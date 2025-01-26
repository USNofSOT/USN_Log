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

  // We'll split body text into multiple pages. Each item in pages[] is a chunk.
  const [pages, setPages] = useState<string[]>([]);

  const shipLogos: Record<string, string> = {
    audacious: "/USN_Log/ships/audacious.png",
    odin: "/USN_Log/ships/odin.png",
    tyr: "/USN_Log/ships/tyr.png",
    thor: "/USN_Log/ships/thor.png",
  };

  // -----------------------------------
  // 1) Load from localStorage on mount
  // -----------------------------------
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

  // Debounce: we won't re-save to localStorage on every keystroke
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Save to localStorage whenever relevant fields change
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

  // -----------------------------------
  // 2) Pagination logic (naive approach)
  // -----------------------------------
  const MAX_LINES_PER_PAGE = 30;
  const MAX_CHARS_PER_PAGE = 1400;
  const EXTRA_LINES_NON_LAST = 14;
  const EXTRA_CHARS_NON_LAST = 500;

  function splitTextIntoPages(longText: string): string[] {
    if (!longText) return [""];

    const pagesArr: string[] = [];
    const lines = longText.split("\n");
    let currentPage = "";
    let lineCount = 0;
    let charCount = 0;

    for (const line of lines) {
      // Calculate max lines/chars for current page
      const isLastPage =
        currentPage === "" && lines.indexOf(line) === lines.length - 1;
      const maxLines = isLastPage
        ? MAX_LINES_PER_PAGE
        : MAX_LINES_PER_PAGE + EXTRA_LINES_NON_LAST;
      const maxChars = isLastPage
        ? MAX_CHARS_PER_PAGE
        : MAX_CHARS_PER_PAGE + EXTRA_CHARS_NON_LAST;

      // If we exceed lines or chars, push currentPage and reset
      if (lineCount >= maxLines || charCount + line.length > maxChars) {
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

      // If a single line alone is huge, chunk it
      if (line.length > maxChars) {
        let remainingText = line;
        while (remainingText.length > 0) {
          const chunk = remainingText.slice(0, maxChars);
          pagesArr.push(chunk);
          remainingText = remainingText.slice(maxChars);
        }
        // Reset
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

  // Whenever 'body' changes, recalc the pages
  useEffect(() => {
    const splitted = splitTextIntoPages(body);
    setPages(splitted);
    setActivePageIndex(splitted.length - 1); // jump to last page
  }, [body]);

  // -----------------------------------
  // 3) PDF & Image generation
  // -----------------------------------
  // For PDF, we can just show all pages in a single container (like your old single preview approach), or we can do them one by one.
  // Let's do them one by one with 'html2pdf' as well, for demonstration.
  const makeFileName = (pageIndex: number, ext = "png") => {
    let base = title ? title.replace(/\s+/g, "-") : "Voyage_Log";
    return `${base}_page${pageIndex + 1}.${ext}`;
  };

  // Simplified PDF approach: We'll do the "one page at a time" trick as well,
  // then combine them in a multi-page PDF if we want. Or we can do one PDF per page.
  // For demonstration, we'll do separate PDF pages. If you want them in a single
  // PDF, we can revert to a multi-page container approach.
  const generatePDF = async () => {
    const originalActive = activePageIndex;

    for (let i = 0; i < pages.length; i++) {
      // 1) Switch to page i
      setActivePageIndex(i);
      // 2) Wait a tick for React to finish
      await new Promise((r) => setTimeout(r, 100));

      // 3) Grab the visible page
      const pageEl = document.getElementById("visible-page");
      if (!pageEl) continue;

      // 4) Generate & download a single-page PDF for page i
      const fileName = makeFileName(i, "pdf");
      const opt = {
        margin: 0,
        filename: fileName,
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
      };

      await html2pdf().set(opt).from(pageEl).save();
    }

    // Restore
    setActivePageIndex(originalActive);
  };

  // Similarly for images, we do a page-by-page approach:
  const generateImages = async () => {
    const originalActive = activePageIndex;

    for (let i = 0; i < pages.length; i++) {
      // 1) Switch to page i
      setActivePageIndex(i);
      // 2) Wait a tick
      await new Promise((r) => setTimeout(r, 100));

      // 3) Use 'visible-page'
      const pageEl = document.getElementById("visible-page");
      if (!pageEl) continue;

      const canvas = await html2canvas(pageEl, { scale: 2, useCORS: true });
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = makeFileName(i, "png");
          a.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    }

    // 4) Restore
    setActivePageIndex(originalActive);
  };

  // -----------------------------------
  // 4) UI logic
  // -----------------------------------
  const loadTestingData = () => {
    setTitle("Test Title");
    setBody(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n" +
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n" +
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\n" +
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet."
    );
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
    navigator.clipboard.writeText(formatDiscordMessage());
    alert("Copied to clipboard!");
  };

  const calculateTitleSize = (text: string) => {
    return "text-5xl"; // or your original logic
  };
  const calculateBodySize = (text: string) => {
    return "text-base"; // or your original logic
  };

  const formatList = (text: string) => {
    if (!text) return [];
    return text.split("\n").filter((item) => item.trim() !== "");
  };

  // This just returns the actual DOM of the page. For the
  // "visible" page we add an id so we can query it easily for screenshots.
  const renderPage = (pageText: string, idx: number, isVisible: boolean) => {
    const displayStyle = isVisible ? "block" : "none";
    const isLastPage = idx === pages.length - 1;

    return (
      <div
        key={idx}
        id={isVisible ? "visible-page" : undefined}
        className="bg-[url('/parchment.png')] bg-cover rounded-lg pb-28 mb-8"
        style={{
          width: "816px",
          height: "1190px",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          position: "relative",
          display: displayStyle,
        }}
      >
        {/* Ship Logo */}
        <img
          src={shipLogos[selectedShip]}
          alt="Ship Logo"
          crossOrigin="anonymous"
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

          {/* Only render these on the last page */}
          {isLastPage && (
            <>
              {/* Events + Crew */}
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
                    {formatList(events).map((ev, i) => (
                      <li key={i} style={{ breakInside: "avoid-column" }}>
                        {ev}
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
                      <li key={i} style={{ breakInside: "avoid-column" }}>
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
                      crossOrigin="anonymous"
                      className="w-8 h-8"
                    />
                    <span className="font-['Indie_Flower'] text-2xl text-black">
                      {gold || "0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src="/USN_Log/doubloon.webp"
                      alt="Doubloons"
                      crossOrigin="anonymous"
                      className="w-8 h-8"
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
            </>
          )}
        </div>
      </div>
    );
  };

  // -----------------------------------
  // 5) The actual component markup
  // -----------------------------------
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
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
              <button
                onClick={loadTestingData}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
              >
                Load Testing Data
              </button>

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
                Generate PDF(s)
              </button>

              <button
                onClick={generateImages}
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

        {/* Preview Section: we render all pages, but only the active one is display:block */}
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

          {/* Render all pages, but only active is visible. No hidden container needed. */}
          {pages.map((pageText, idx) =>
            renderPage(pageText, idx, idx === activePageIndex)
          )}
        </div>
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
