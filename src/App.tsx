import React, { useState, useEffect } from "react";
import { Printer } from "lucide-react";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

function App() {
  // -----------------------------------
  // 0) State for "mode" + existing fields
  // -----------------------------------
  const [mode, setMode] = useState<"patrol" | "skirmish">("patrol");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [signature, setSignature] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [selectedShip, setSelectedShip] = useState("audacious");

  // Patrol-specific fields
  const [events, setEvents] = useState("");
  const [crew, setCrew] = useState("");
  const [gold, setGold] = useState("");
  const [doubloons, setDoubloons] = useState("");

  // Skirmish-specific fields
  const [ourTeam, setOurTeam] = useState<"Athena" | "Reaper">("Athena");
  // We'll store multiple "dives" in an array
  const [dives, setDives] = useState<
    {
      ourTeam: "Athena" | "Reaper";
      enemyTeam: "Athena" | "Reaper";
      outcome: "win" | "loss";
      notes: string;
    }[]
  >([]);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // Font choices
  const [titleFont, setTitleFont] = useState("Satisfy");
  const [bodyFont, setBodyFont] = useState("Indie_Flower");

  // For tabbing between preview pages
  const [activePageIndex, setActivePageIndex] = useState(0);

  // We'll split body text into multiple pages (for the big "body" only)
  const [pages, setPages] = useState<string[]>([]);

  // -----------------------------------
  // 1) Load from localStorage on mount
  // -----------------------------------
  useEffect(() => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode) setMode(savedMode as "patrol" | "skirmish");

    const savedTitle = localStorage.getItem("title");
    const savedBody = localStorage.getItem("body");
    const savedSignature = localStorage.getItem("signature");
    const savedSubtitle = localStorage.getItem("subtitle");
    const savedEvents = localStorage.getItem("events");
    const savedCrew = localStorage.getItem("crew");
    const savedGold = localStorage.getItem("gold");
    const savedDoubloons = localStorage.getItem("doubloons");
    const savedOurTeam = localStorage.getItem("ourTeam");
    const savedDives = localStorage.getItem("dives");
    const savedSelectedShip = localStorage.getItem("selectedShip");
    const savedTitleFont = localStorage.getItem("titleFont");
    const savedBodyFont = localStorage.getItem("bodyFont");

    if (savedTitle) setTitle(savedTitle);
    if (savedBody) setBody(savedBody);
    if (savedSignature) setSignature(savedSignature);
    if (savedSubtitle) setSubtitle(savedSubtitle);
    if (savedEvents) setEvents(savedEvents);
    if (savedCrew) setCrew(savedCrew);
    if (savedGold) setGold(savedGold);
    if (savedDoubloons) setDoubloons(savedDoubloons);
    if (savedOurTeam) setOurTeam(savedOurTeam as "Athena" | "Reaper");
    if (savedDives) setDives(JSON.parse(savedDives));
    if (savedSelectedShip) setSelectedShip(savedSelectedShip);
    if (savedTitleFont) setTitleFont(savedTitleFont);
    if (savedBodyFont) setBodyFont(savedBodyFont);
  }, []);

  // Helper: Debounce calls to localStorage
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // -----------------------------------
  // 2) Save to localStorage whenever relevant fields change
  // -----------------------------------
  useEffect(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem("mode", mode);
      localStorage.setItem("title", title);
      localStorage.setItem("body", body);
      localStorage.setItem("signature", signature);
      localStorage.setItem("subtitle", subtitle);
      localStorage.setItem("events", events);
      localStorage.setItem("crew", crew);
      localStorage.setItem("gold", gold);
      localStorage.setItem("doubloons", doubloons);
      localStorage.setItem("ourTeam", ourTeam);
      localStorage.setItem("dives", JSON.stringify(dives));
      localStorage.setItem("selectedShip", selectedShip);
      localStorage.setItem("titleFont", titleFont);
      localStorage.setItem("bodyFont", bodyFont);
    };
    const debouncedSave = debounce(saveToLocalStorage, 500);
    debouncedSave();
  }, [
    mode,
    title,
    body,
    signature,
    subtitle,
    events,
    crew,
    gold,
    doubloons,
    ourTeam,
    dives,
    selectedShip,
    titleFont,
    bodyFont,
  ]);

  // -----------------------------------
  // 3) Pagination logic for the 'body' text
  // -----------------------------------
  const WRITING_AREA_HEIGHT = 982; // pixels
  const LINE_HEIGHT = 24; // approximate line height
  const LINES_PER_PAGE = Math.floor(WRITING_AREA_HEIGHT / LINE_HEIGHT);
  const CHARS_PER_LINE = 70; // approx chars per line
  const CHARS_PER_PAGE = LINES_PER_PAGE * CHARS_PER_LINE;

  function splitTextIntoPages(longText: string): string[] {
    if (!longText) return [""];

    const pagesArr: string[] = [];
    const lines = longText.split("\n");
    let currentPage = "";
    let currentHeight = 0;

    for (const line of lines) {
      // Approx how many lines this single text line occupies
      const lineLength = line.length;
      const wrappedLines = Math.ceil(lineLength / CHARS_PER_LINE);
      const linePixelHeight = wrappedLines * LINE_HEIGHT;

      // Check if adding line overflows
      if (currentHeight + linePixelHeight > WRITING_AREA_HEIGHT) {
        // Push current page
        pagesArr.push(currentPage);
        currentPage = line;
        currentHeight = linePixelHeight;
      } else {
        // Add line to current page
        if (currentPage) {
          currentPage += "\n";
          currentHeight += LINE_HEIGHT; // newline overhead
        }
        currentPage += line;
        currentHeight += linePixelHeight;
      }

      // If line is extremely long
      if (lineLength > CHARS_PER_PAGE) {
        let remainingText = line;
        while (remainingText.length > CHARS_PER_PAGE) {
          const chunk = remainingText.slice(0, CHARS_PER_PAGE);
          pagesArr.push(chunk);
          remainingText = remainingText.slice(CHARS_PER_PAGE);
        }
        currentPage = remainingText;
        currentHeight =
          Math.ceil(remainingText.length / CHARS_PER_LINE) * LINE_HEIGHT;
      }
    }

    if (currentPage) {
      pagesArr.push(currentPage);
    }

    return pagesArr;
  }

  // Whenever 'body' changes, recalc pages
  useEffect(() => {
    const splitted = splitTextIntoPages(body);
    setPages(splitted);
    setActivePageIndex(splitted.length - 1); // jump to last page
  }, [body]);

  // -----------------------------------
  // 4) PDF & Image generation
  // -----------------------------------
  const makeFileName = (pageIndex: number, ext = "png") => {
    let base = title ? title.replace(/\s+/g, "-") : "Voyage_Log";
    return `${base}_page${pageIndex + 1}.${ext}`;
  };

  const generatePDF = async () => {
    const originalActive = activePageIndex;

    for (let i = 0; i < pages.length; i++) {
      setActivePageIndex(i);
      await new Promise((r) => setTimeout(r, 100));
      const pageEl = document.getElementById("visible-page");
      if (!pageEl) continue;

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

    setActivePageIndex(originalActive);
  };

  const generateImages = async () => {
    const originalActive = activePageIndex;

    for (let i = 0; i < pages.length; i++) {
      setActivePageIndex(i);
      await new Promise((r) => setTimeout(r, 100));
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

    setActivePageIndex(originalActive);
  };

  // -----------------------------------
  // 5) Utility & UI logic
  // -----------------------------------
  const loadTestingData = () => {
    if (mode === "patrol") {
      setTitle("Test Patrol Title");
      setBody("Sample patrol log entry...");
      setSignature("Capt. Test");
      setEvents("Event 1\nEvent 2\nEvent 3");
      setCrew("Crew 1\nCrew 2\nCrew 3");
      setGold("1000");
      setDoubloons("300");
      setSubtitle("Test Subtitle");
    } else {
      // Skirmish testing data
      setTitle("Test Skirmish Title");
      setBody("Skirmish details here...");
      setSignature("Capt. Test");
      setOurTeam("Athena");
      setDives([
        {
          ourTeam: "Athena",
          enemyTeam: "Reaper",
          outcome: "loss",
          notes: "Stamp Leader, they had 10 flags...",
        },
        {
          ourTeam: "Athena",
          enemyTeam: "Reaper",
          outcome: "win",
          notes: "Second match, big win",
        },
      ]);
      setSubtitle("Skirmish Leader");
    }
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
    setOurTeam("Athena");
    setDives([]);
    setActivePageIndex(0);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatDiscordMessage());
    alert("Copied to clipboard!");
  };

  const calculateTitleSize = (_text: string) => {
    return "text-5xl";
  };
  const calculateBodySize = (_text: string) => {
    return "text-base";
  };

  const formatList = (text: string) => {
    if (!text) return [];
    return text.split("\n").filter((item) => item.trim() !== "");
  };

  // -----------------------------------
  // 6) Add/Update/Remove for skirmish dives (all inside same file)
  // -----------------------------------
  const addNewDive = () => {
    const newDive = {
      ourTeam,
      enemyTeam: ourTeam === "Athena" ? "Reaper" : "Athena",
      outcome: "win" as const,
      notes: "",
    };
    setDives([...dives, newDive]);
  };

  const updateDive = (
    index: number,
    updated: Partial<(typeof dives)[number]>
  ) => {
    setDives(dives.map((d, i) => (i === index ? { ...d, ...updated } : d)));
  };

  const removeDive = (index: number) => {
    setDives(dives.filter((_, i) => i !== index));
  };

  // -----------------------------------
  // 7) Discord message formatting
  // -----------------------------------
  const formatDiscordMessage = () => {
    if (mode === "patrol") {
      return `${title || "Title here"}

${body || "Patrol details here"}

Events:
${events || "N/A"}

Gold: ${gold || "0"}
Doubloons: ${doubloons || "0"}

Crew:
${crew || "N/A"}

Signed:
${signature || "Your Signature"}
${subtitle ? `${subtitle}` : ""}
`.trim();
    } else {
      // Skirmish
      const diveLines = dives
        .map(
          (d, i) =>
            `${i + 1}. ${d.ourTeam} ${
              d.ourTeam === "Athena" ? ":Athena:" : ":Reaper:"
            } vs. ${d.enemyTeam} ${
              d.enemyTeam === "Athena" ? ":Athena:" : ":Reaper:"
            } [${d.outcome}]${d.notes ? ` - ${d.notes}` : ""}`
        )
        .join("\n");

      return `${title || "Skirmish Title"}

${body || "Skirmish details here"}

Team: ${ourTeam || "Athena"}

Dives:
${diveLines || "No dives yet"}

Signed:
${signature || "Your Signature"}
${subtitle ? `${subtitle}` : ""}
`.trim();
    }
  };

  // -----------------------------------
  // 8) Previews: We'll do it in `renderPage()`
  // -----------------------------------
  const shipLogos: Record<string, string> = {
    audacious: "/USN_Log/ships/audacious.png",
    odin: "/USN_Log/ships/odin.png",
    tyr: "/USN_Log/ships/tyr.png",
    thor: "/USN_Log/ships/thor.png",
  };

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

        <div
          id="writing-area"
          className="p-12 h-full flex flex-col relative z-10"
        >
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

          {/* On last page, we render either "Patrol" fields or "Skirmish" fields */}
          {isLastPage && mode === "patrol" && (
            <>
              {/* Patrol Layout: Events + Crew */}
              <div className="grid grid-cols-2 gap-8 ml-6 mt-4">
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

          {isLastPage && mode === "skirmish" && (
            <div className="p-2">
              {/* Skirmish Layout */}
              <h3 className="font-['Satisfy'] text-2xl text-black mb-2">
                Skirmish Dives
              </h3>
              <div className="font-['Indie_Flower'] text-xl text-black leading-relaxed p-2">
                {dives.length === 0 && (
                  <div>No dives recorded for this skirmish.</div>
                )}
                <div
                  className={`grid ${
                    dives.length > 8 ? "grid-cols-2 gap-0" : "grid-cols-1"
                  }`}
                >
                  {dives.map((dive, i) => (
                    <div key={i} className="mb-3">
                      <strong className="flex items-center gap-2">
                        <span>
                          {i + 1}. {dive.ourTeam}
                        </span>
                        <img
                          className="w-8 h-8"
                          src={`/USN_Log/${dive.ourTeam.toLocaleLowerCase()}.webp`}
                          alt=""
                        />
                        <span>vs {dive.enemyTeam}</span>
                        <img
                          className="w-8 h-8"
                          src={`/USN_Log/${dive.enemyTeam.toLocaleLowerCase()}.webp`}
                          alt=""
                        />
                        <span>({dive.outcome})</span>
                      </strong>
                      {dive.notes && (
                        <div className="ml-4 italic">{dive.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature */}
              <div className="flex justify-end items-center mt-8">
                <div
                  className="font-['Dancing_Script'] text-5xl text-black font-bold whitespace-pre-wrap"
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
          )}
        </div>
      </div>
    );
  };

  // -----------------------------------
  // 9) The actual component markup
  // -----------------------------------
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="bg-[#2a2a2a] py-1 px-4 pr-8 text-center flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img className="w-20 h-20" src="/USN_Log/USN_Logo.png" alt="" />
          <h1 className="text-3xl font-bold text-amber-500">
            SoT USN Voyage Log Generator
          </h1>
        </div>
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
            {/* Mode Toggle */}
            <div>
              <label className="block text-sm font-medium mb-2">Mode</label>
              <select
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as "patrol" | "skirmish")
                }
                className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
              >
                <option value="patrol">Patrol</option>
                <option value="skirmish">Skirmish</option>
              </select>
            </div>

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

            {/* Conditionally show Patrol vs Skirmish fields */}
            {mode === "patrol" && (
              <>
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
                    placeholder="Enter crew members..."
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
              </>
            )}

            {mode === "skirmish" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Team
                  </label>
                  <select
                    value={ourTeam}
                    onChange={(e) =>
                      setOurTeam(e.target.value as "Athena" | "Reaper")
                    }
                    className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                  >
                    <option value="Athena">Athena</option>
                    <option value="Reaper">Reaper</option>
                  </select>
                </div>

                <div className="border border-gray-500 p-2 mt-2">
                  <h2 className="text-lg font-bold mb-2">Skirmish Dives</h2>
                  {dives.map((dive, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 mb-2 text-sm"
                    >
                      <select
                        value={dive.ourTeam}
                        onChange={(e) =>
                          updateDive(index, {
                            ourTeam: e.target.value as "Athena" | "Reaper",
                          })
                        }
                        className="bg-[#3a3a3a] rounded border border-gray-600 text-white px-1"
                      >
                        <option value="Athena">Athena</option>
                        <option value="Reaper">Reaper</option>
                      </select>
                      <span>vs.</span>
                      <select
                        value={dive.enemyTeam}
                        onChange={(e) =>
                          updateDive(index, {
                            enemyTeam: e.target.value as "Athena" | "Reaper",
                          })
                        }
                        className="bg-[#3a3a3a] rounded border border-gray-600 text-white px-1"
                      >
                        <option value="Athena">Athena</option>
                        <option value="Reaper">Reaper</option>
                      </select>
                      <select
                        value={dive.outcome}
                        onChange={(e) =>
                          updateDive(index, {
                            outcome: e.target.value as "win" | "loss",
                          })
                        }
                        className="bg-[#3a3a3a] rounded border border-gray-600 text-white px-1"
                      >
                        <option value="win">win</option>
                        <option value="loss">loss</option>
                      </select>
                      <input
                        className="flex-grow bg-[#3a3a3a] rounded border border-gray-600 text-white px-1"
                        placeholder="Notes..."
                        value={dive.notes}
                        onChange={(e) =>
                          updateDive(index, { notes: e.target.value })
                        }
                      />
                      <button
                        onClick={() => removeDive(index)}
                        className="text-red-400 text-xs px-2"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addNewDive}
                    className="mt-2 bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                  >
                    + Add Dive
                  </button>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Signature
              </label>
              <textarea
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                rows={2}
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

        {/* Preview Section */}
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
