import React from "react";
import { Printer } from "lucide-react";
import { useLog } from "../context/LogContext";
import { ShipType } from "../hooks/useLogState";

export const Editor: React.FC = () => {
  const {
    mode,
    setMode,
    title,
    setTitle,
    body,
    setBody,
    signature,
    setSignature,
    subtitle,
    setSubtitle,
    selectedShip,
    setSelectedShip,
    events,
    setEvents,
    crew,
    setCrew,
    gold,
    setGold,
    doubloons,
    setDoubloons,
    ourTeam,
    setOurTeam,
    dives,
    updateDive,
    removeDive,
    addNewDive,
    generatePDF,
    generateImages,
    resetState,
    setIsCopyModalOpen,
  } = useLog();

  return (
    <div className="w-1/2 bg-[#2a2a2a] p-6 rounded-lg">
      <div className="space-y-4">
        {/* Mode Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "patrol" | "skirmish")}
            className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
          >
            <option value="patrol">Patrol</option>
            <option value="skirmish">Skirmish</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Ship</label>
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
          <label className="block text-sm font-medium mb-2">Log Title</label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white h-16"
            placeholder="Enter log title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Log Entry</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white h-32"
            placeholder="Write your log entry..."
          />
        </div>

        {mode === "patrol" ? (
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
        ) : (
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
          <label className="block text-sm font-medium mb-2">Signature</label>
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
  );
};
