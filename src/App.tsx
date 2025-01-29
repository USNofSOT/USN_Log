import React from "react";
import { Printer } from "lucide-react";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { useLogState, ShipType } from "./hooks/useLogState";
import { SettingsModal } from "./components/SettingsModal";
import { CopyModal } from "./components/CopyModal";

function App() {
  const {
    // State
    mode,
    title,
    body,
    signature,
    subtitle,
    selectedShip,
    events,
    crew,
    gold,
    doubloons,
    ourTeam,
    dives,
    isModalOpen,
    isCopyModalOpen,
    titleFont,
    bodyFont,
    activePageIndex,
    pages,

    // Setters
    setMode,
    setTitle,
    setBody,
    setSignature,
    setSubtitle,
    setSelectedShip,
    setEvents,
    setCrew,
    setGold,
    setDoubloons,
    setOurTeam,
    setDives,
    setIsModalOpen,
    setIsCopyModalOpen,
    setTitleFont,
    setBodyFont,
    setActivePageIndex,

    // Actions
    addNewDive,
    updateDive,
    removeDive,
    resetState,
    loadTestingData,
    formatList,
    formatDiscordMessage,
  } = useLogState();

  // -----------------------------------
  // PDF & Image generation
  // -----------------------------------
  const makeFileName = (pageIndex: number, ext = "png") => {
    const base = title ? title.replace(/\s+/g, "-") : "Voyage_Log";
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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatDiscordMessage());
    alert("Copied to clipboard!");
  };

  // -----------------------------------
  // Ship logos and rendering
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
            className={`text-5xl text-center ml-16 mr-16 mt-12 mb-8 font-['${titleFont}'] text-black whitespace-pre-wrap`}
          >
            {title || "Log Title"}
          </h2>

          <div
            className={`font-['${bodyFont}'] text-base flex-grow whitespace-pre-wrap text-black leading-relaxed p-2`}
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
  // The actual component markup
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

      <SettingsModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        titleFont={titleFont}
        bodyFont={bodyFont}
        onTitleFontChange={setTitleFont}
        onBodyFontChange={setBodyFont}
        onLoadTestingData={loadTestingData}
      />

      <CopyModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        content={formatDiscordMessage()}
        onCopy={copyToClipboard}
      />

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
                onChange={(e) => setSelectedShip(e.target.value as ShipType)}
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
    </div>
  );
}

export default App;
