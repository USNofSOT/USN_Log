import React, { useState, useEffect } from "react";
import { Printer } from "lucide-react";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

function App() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [signature, setSignature] = useState("");
  const [events, setEvents] = useState("");
  const [crew, setCrew] = useState("");
  const [gold, setGold] = useState("");
  const [doubloons, setDoubloons] = useState("");
  const [selectedShip, setSelectedShip] = useState("audacious");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleFont, setTitleFont] = useState("Satisfy");
  const [bodyFont, setBodyFont] = useState("Indie_Flower");
  const [subtitle, setSubtitle] = useState("");
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // For tabbing between preview pages
  const [activePageIndex, setActivePageIndex] = useState(0);

  // We’ll split body text into pages. Each item in pages[] is the chunk for that page.
  const [pages, setPages] = useState<string[]>([]);

  // Ship logos
  const shipLogos: Record<string, string> = {
    audacious: "/USN_Log/ships/audacious.png",
    odin: "/USN_Log/ships/odin.png",
    tyr: "/USN_Log/ships/tyr.png",
    thor: "/USN_Log/ships/thor.png",
  };

  // -----------------------------------------------
  // 1) Basic localStorage loading/saving
  // -----------------------------------------------
  useEffect(() => {
    const savedTitle = localStorage.getItem("title");
    const savedBody = localStorage.getItem("body");
    const savedSignature = localStorage.getItem("signature");
    const savedEvents = localStorage.getItem("events");
    const savedCrew = localStorage.getItem("crew");
    const savedGold = localStorage.getItem("gold");
    const savedDoubloons = localStorage.getItem("doubloons");
    const savedSubtitle = localStorage.getItem("subtitle");

    if (savedTitle) setTitle(savedTitle);
    if (savedBody) setBody(savedBody);
    if (savedSignature) setSignature(savedSignature);
    if (savedEvents) setEvents(savedEvents);
    if (savedCrew) setCrew(savedCrew);
    if (savedGold) setGold(savedGold);
    if (savedDoubloons) setDoubloons(savedDoubloons);
    if (savedSubtitle) setSubtitle(savedSubtitle);
  }, []);

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem("title", title);
      localStorage.setItem("body", body);
      localStorage.setItem("signature", signature);
      localStorage.setItem("events", events);
      localStorage.setItem("crew", crew);
      localStorage.setItem("gold", gold);
      localStorage.setItem("doubloons", doubloons);
      localStorage.setItem("subtitle", subtitle);
    };
    const debouncedSave = debounce(saveToLocalStorage, 500);
    debouncedSave();
  }, [title, body, signature, events, crew, gold, doubloons, subtitle]);

  // -----------------------------------------------
  // 2) Splitting text: naive approach by lines & chars
  // -----------------------------------------------
  const MAX_LINES_PER_PAGE = 30;
  const MAX_CHARS_PER_PAGE = 1400;

  function splitTextIntoPages(longText: string): string[] {
    if (!longText) return [""];

    const pagesArr: string[] = [];
    const lines = longText.split("\n");
    let currentPage = "";
    let lineCount = 0;
    let charCount = 0;

    for (const line of lines) {
      // If we exceed lines or chars, push currentPage and reset
      if (
        lineCount >= MAX_LINES_PER_PAGE ||
        charCount + line.length > MAX_CHARS_PER_PAGE
      ) {
        if (currentPage) {
          pagesArr.push(currentPage);
          currentPage = "";
          lineCount = 0;
          charCount = 0;
        }
      }

      // Add line to current page
      if (currentPage) {
        currentPage += "\n";
        charCount++; // newline character
      }
      currentPage += line;
      lineCount++;
      charCount += line.length;

      // If a single line alone is huge, we handle it in chunks
      if (line.length > MAX_CHARS_PER_PAGE) {
        let remainingText = line;
        while (remainingText.length > 0) {
          const chunk = remainingText.slice(0, MAX_CHARS_PER_PAGE);
          pagesArr.push(chunk);
          remainingText = remainingText.slice(MAX_CHARS_PER_PAGE);
        }
        // Reset after forcing out chunks
        currentPage = "";
        lineCount = 0;
        charCount = 0;
      }
    }

    if (currentPage) {
      pagesArr.push(currentPage);
    }

    return pagesArr;
  }

  // Build the pages whenever `body` changes
  useEffect(() => {
    const splitted = splitTextIntoPages(body);
    setPages(splitted);
    setActivePageIndex(splitted.length - 1); // jump to last page
  }, [body]);

  // -----------------------------------------------
  // 3) PDF / Image generation
  // -----------------------------------------------
  const makeFileName = (pageIndex?: number) => {
    let base = title ? title.replace(/\s+/g, "-") : "Voyage_Log";
    if (pageIndex != null) {
      base += `_page${pageIndex + 1}`;
    }
    return base + ".png";
  };

  const generatePDF = () => {
    // *** We now use #print-container, which has ALL pages in normal flow. ***
    const element = document.getElementById("print-container");
    if (!element) return;

    const opt = {
      margin: 0,
      filename: title ? title.replace(/\s+/g, "-") + ".pdf" : "Voyage_Log.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        width: 816,
        height: 1056,
      },
      jsPDF: {
        unit: "px",
        format: [816, 1056],
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css"] },
    };

    html2pdf().set(opt).from(element).save();
  };

  const generateImage = async () => {
    // *** Similarly, we target #print-container for images. ***
    const pageElements = document.querySelectorAll(
      "#print-container .page-preview"
    );
    if (!pageElements.length) return;

    for (let i = 0; i < pageElements.length; i++) {
      const pageEl = pageElements[i] as HTMLElement;
      // Give images some crossOrigin if needed
      const canvas = await html2canvas(pageEl, { scale: 2, useCORS: true });
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = makeFileName(i);
          a.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    }
  };

  // -----------------------------------------------
  // 4) UI logic & “hidden container” approach
  // -----------------------------------------------
  const loadTestingData = () => {
    setTitle("Test Title");
    setBody(`Lorem ipsum... (some big text to force multi-page)`);
    setSignature("Capt. Test");
    setEvents("Event 1\nEvent 2\nEvent 3");
    setCrew("Crew Member 1\nCrew Member 2\nCrew Member 3");
    setGold("100");
    setDoubloons("50");
    setSubtitle("Test Subtitle");
  };

  const resetState = () => {
    setTitle("");
    setBody("");
    setSignature("");
    setSubtitle("");
    setEvents("");
    setCrew("");
    setGold("");
    setDoubloons("");
    setActivePageIndex(0);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const formatDiscordMessage = () => {
    return `${title || "title here"}\n\n${body || "details here"}\n\nEvents:\n${
      events || "events here"
    }\n\n:Gold: Gold: ${gold || "0"}\n:Doubloons: Doubloons: ${
      doubloons || "0"
    }\n\nCrew:\n${crew || "crew names"}`;
  };

  const copyToClipboard = () => {
    const text = formatDiscordMessage();
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const calculateTitleSize = (text: string) => {
    // Simplified for brevity
    return "text-5xl";
  };

  const calculateBodySize = (text: string) => {
    // Also simplified
    return "text-base";
  };

  // Convert multiline input to array
  const formatList = (text: string) => {
    if (!text) return [];
    return text.split("\n").filter((item) => item.trim() !== "");
  };

  // The main page “template” – we’ll reuse this for both the user preview (just one page) and the hidden container (all pages).
  const renderPage = (pageText: string, pageKey: number) => {
    return (
      <div
        key={pageKey}
        className="page-preview bg-[url('/parchment.png')] bg-cover rounded-lg pb-28 mb-8"
        style={{
          width: "816px",
          height: "1190px",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          pageBreakAfter: "always",
          position: "relative",
        }}
      >
        <img
          src={shipLogos[selectedShip]}
          alt="Ship Logo"
          crossOrigin="anonymous" // helpful if using useCORS
          className="absolute inset-0 m-auto"
          style={{
            width: "50%",
            height: "auto",
            opacity: 0.3,
            zIndex: 0,
          }}
        />

        <div className="p-12 h-full flex flex-col relative z-10">
          <h2
            className={`${calculateTitleSize(
              title
            )} text-center ml-16 mr-16 mt-12 mb-8 font-['${titleFont}'] text-black whitespace-pre-wrap`}
          >
            {title || "Log Title"}
          </h2>

          <div
            className={`font-['${bodyFont}'] ${calculateBodySize(
              body
            )} flex-grow whitespace-pre-wrap text-black leading-relaxed p-2`}
          >
            {pageText || "Your log entry will appear here..."}
          </div>

          {/* Events / Crew */}
          <div
            className={`grid grid-cols-2 gap-8 ml-6 mt-4 ${
              subtitle ? "mb-6" : ""
            }`}
          >
            <div>
              <h3 className="font-['Satisfy'] text-2xl text-black mb-2">
                Notable Events
              </h3>
              <ul
                className="list-none font-['Indie_Flower'] text-lg text-black"
                style={{
                  columns: "2",
                  columnGap: "1rem",
                  breakInside: "avoid-column",
                }}
              >
                {formatList(events).map((event, i) => (
                  <li
                    key={i}
                    className="mb-1"
                    style={{ breakInside: "avoid-column" }}
                  >
                    {event}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-['Satisfy'] text-2xl text-black mb-2">
                Crew Manifest
              </h3>
              <ul
                className="list-none font-['Indie_Flower'] text-lg text-black"
                style={{
                  columns: "2",
                  columnGap: "1rem",
                  breakInside: "avoid-column",
                }}
              >
                {formatList(crew).map((member, i) => (
                  <li
                    key={i}
                    className="mb-1"
                    style={{ breakInside: "avoid-column" }}
                  >
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Gold + Doubloons + Signature */}
          <div className="flex justify-between items-end">
            <div className="flex gap-8">
              <div className="flex pl-4 items-center gap-2">
                <img
                  src="/USN_Log/gold.webp"
                  alt="Gold"
                  className="w-8 h-8"
                  crossOrigin="anonymous"
                />
                <span className="font-['Indie_Flower'] text-2xl text-black">
                  {gold || "0"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="/USN_Log/doubloon.webp"
                  alt="Doubloons"
                  className="w-8 h-8"
                  crossOrigin="anonymous"
                />
                <span className="font-['Indie_Flower'] text-2xl text-black">
                  {doubloons || "0"}
                </span>
              </div>
            </div>

            <div
              className="font-['Dancing_Script'] absolute right-16 bottom-0 text-5xl text-black font-bold whitespace-pre-wrap"
              style={{
                transform: "rotate(-4deg)",
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {signature || "Your Signature"}
              {subtitle && (
                <div className="text-3xl mt-2 text-right">{subtitle}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // -----------------------------------------------
  // 5) Render
  // -----------------------------------------------
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="bg-[#2a2a2a] p-4 text-center flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-500">
          SoT USN Voyage Log Generator
        </h1>
        <button
          onClick={toggleModal}
          className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
        >
          Settings
        </button>
      </header>

      {/* Settings Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg w-1/3 text-white">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title Font
                </label>
                <select
                  value={titleFont}
                  onChange={(e) => setTitleFont(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                >
                  <option value="Satisfy">Satisfy</option>
                  <option value="Dancing_Script">Dancing Script</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Log Entry Font
                </label>
                <select
                  value={bodyFont}
                  onChange={(e) => setBodyFont(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                >
                  <option value="Satisfy">Satisfy</option>
                  <option value="Indie_Flower">Indie Flower</option>
                  <option value="Dancing_Script">Dancing Script</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              {import.meta.env.DEV && (
                <button
                  onClick={loadTestingData}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                >
                  Load Testing Data
                </button>
              )}
              <button
                onClick={toggleModal}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="container mx-auto p-4 flex gap-4">
        {/* Editor Section */}
        <div className="w-1/2 bg-[#2a2a2a] p-6 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Ship
              </label>
              <select
                value={selectedShip}
                onChange={(e) => setSelectedShip(e.target.value)}
                className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
              >
                <option value="audacious">Audacious</option>
                <option value="odin">Odin</option>
                <option value="tyr">Tyr</option>
                <option value="thor">Thor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Log Title
              </label>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white h-16"
                placeholder="Enter log title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Log Entry
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white h-32"
                placeholder="Write your log entry..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Events (One per line)
              </label>
              <textarea
                value={events}
                onChange={(e) => setEvents(e.target.value)}
                className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white h-32"
                placeholder="Enter events (one per line)..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Crew Members (One per line)
              </label>
              <textarea
                value={crew}
                onChange={(e) => setCrew(e.target.value)}
                className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white h-32"
                placeholder="Enter crew members (one per line)..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Gold Earned
                </label>
                <input
                  type="text"
                  value={gold}
                  onChange={(e) => setGold(e.target.value)}
                  className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                  placeholder="Enter gold amount..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Doubloons Earned
                </label>
                <input
                  type="text"
                  value={doubloons}
                  onChange={(e) => setDoubloons(e.target.value)}
                  className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                  placeholder="Enter doubloons amount..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Signature
              </label>
              <textarea
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                rows={2}
                placeholder="Enter rank or custom subtitle..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={generatePDF}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                <Printer size={20} />
                Generate PDF
              </button>

              <button
                onClick={generateImage}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                <Printer size={20} />
                Generate Image(s)
              </button>

              <button
                onClick={resetState}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                Reset
              </button>

              <button
                onClick={() => setIsCopyModalOpen(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                Copy Discord Message
              </button>
            </div>
          </div>
        </div>

        {/*  (A) Preview Section: Renders ONLY the active page for user display */}
        <div className="w-1/2">
          {pages.length > 1 && (
            <div className="flex gap-2 mb-2">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePageIndex(idx)}
                  className={`px-3 py-1 rounded ${
                    idx === activePageIndex
                      ? "bg-blue-600"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                >
                  Page {idx + 1}
                </button>
              ))}
            </div>
          )}

          {/* Show just the currently active page in the “preview” */}
          {pages[activePageIndex] &&
            renderPage(pages[activePageIndex], activePageIndex)}
        </div>
      </div>

      {/* (B) Hidden Container: Renders ALL pages stacked. We use this for PDF + images. */}
      <div
        id="print-container"
        style={{
          visibility: "hidden",
          height: 0,
          overflow: "hidden",
        }}
      >
        {pages.map((pageText, idx) => renderPage(pageText, idx))}
      </div>

      {/* Copy Modal */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg w-1/3 text-white">
            <h2 className="text-2xl font-bold mb-4">Discord Message</h2>
            <textarea
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white h-64"
              defaultValue={formatDiscordMessage()}
              readOnly
            />
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={copyToClipboard}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Copy
              </button>
              <button
                onClick={() => setIsCopyModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
