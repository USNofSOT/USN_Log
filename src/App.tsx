import React, { useState, useEffect } from "react";
import { Printer } from "lucide-react";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import goldImg from "./gold.webp";
import doubloon from "./doubloon.webp";

function App() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [signature, setSignature] = useState("");
  const [events, setEvents] = useState("");
  const [crew, setCrew] = useState("");
  const [gold, setGold] = useState("");
  const [doubloons, setDoubloons] = useState("");
  const [goldBase64, setGoldBase64] = useState("");
  const [doubloonBase64, setDoubloonBase64] = useState("");
  const [selectedShip, setSelectedShip] = useState("audacious");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleFont, setTitleFont] = useState("Satisfy");
  const [bodyFont, setBodyFont] = useState("Indie_Flower");

  const shipLogos = {
    audacious: "/USN_Log/ships/audacious.png",
    odin: "/USN_Log/ships/odin.png",
    tyr: "/USN_Log/ships/tyr.png",
    // Add more ships and their corresponding image paths here
  };

  useEffect(() => {
    // Convert images to base64 on component mount
    const loadImage = async (url: string): Promise<string> => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    Promise.all([loadImage(goldImg), loadImage(doubloon)]).then(
      ([goldData, doubloonData]) => {
        setGoldBase64(goldData);
        setDoubloonBase64(doubloonData);
      }
    );
  }, []);

  const calculateTitleSize = (text: string) => {
    if (!text) return "text-7xl";
    if (text.length <= 20) return "text-6xl";
    if (text.length <= 30) return "text-6xl";
    if (text.length <= 40) return "text-5xl";
    return "text-5xl";
  };

  const calculateBodySize = (text: string) => {
    if (!text) return "text-xl";
    if (text.length <= 500) return "text-xl";
    if (text.length <= 1000) return "text-lg";
    if (text.length <= 2000) return "text-base";
    if (text.length <= 3000) return "text-sm";
    return "text-xs";
  };

  function makeFileName() {
    if (!title) return "Voyage_Log";
    const titleArr = title.split(" ");
    return titleArr.join("-") + ".pdf";
  }

  const formatList = (text: string) => {
    if (!text) return [];
    return text.split("\n").filter((item) => item.trim() !== "");
  };

  const generatePDF = () => {
    const element = document.getElementById("preview");
    const opt = {
      margin: 0,
      filename: makeFileName(),
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        height: 1056, // Standard US Letter height at 96 DPI
        width: 816, // Standard US Letter width at 96 DPI
      },
      jsPDF: {
        unit: "px",
        format: [816, 1056],
        orientation: "portrait",
      },
    };
    html2pdf().set(opt).from(element).save();
  };

  const generateImage = async () => {
    const element = document.getElementById("preview");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = makeFileName().replace(".pdf", ".png");
        a.click();
        URL.revokeObjectURL(url);
      }
    }, "image/png");
  };

  const resetState = () => {
    setTitle("");
    setBody("");
    setSignature("");
    setEvents("");
    setCrew("");
    setGold("");
    setDoubloons("");
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

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
            <div className="mt-6 flex justify-end">
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
                {/* Add more options here */}
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
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full p-2 bg-[#3a3a3a] rounded border border-gray-600 text-white"
                placeholder="Your title and name..."
              />
            </div>

            <div className="space-y-4">
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
                Generate Image
              </button>

              <button
                onClick={resetState}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="w-1/2">
          <div
            id="preview"
            className="bg-[url('/parchment.png')] bg-cover rounded-lg relative"
            style={{
              width: "816px",
              height: "1056px",
              boxShadow: "0 0 20px rgba(0,0,0,0.3)",
            }}
          >
            {/* Ship Logo */}
            <img
              src={shipLogos[selectedShip]}
              alt="Ship Logo"
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
                )} text-center ml-16 mr-16 mt-12 mb-8 font-['${titleFont}'] text-black transition-all duration-200 whitespace-pre-wrap`}
              >
                {title || "Log Title"}
              </h2>

              <div
                className={`font-['${bodyFont}'] ${calculateBodySize(
                  body
                )} flex-grow whitespace-pre-wrap text-black leading-relaxed transition-all duration-200 p-2`}
              >
                {body || "Your log entry will appear here..."}
              </div>

              {/* Events and Crew Section */}
              <div className="grid grid-cols-2 gap-8 ml-6 mt-4 mb-8">
                <div>
                  <h3 className="font-['Satisfy'] text-2xl text-black mb-2">
                    Notable Events
                  </h3>
                  <ul
                    className="list-disc pl-6 font-['Indie_Flower'] text-lg text-black"
                    style={{
                      columns: "2",
                      columnGap: "1rem",
                      breakInside: "avoid-column",
                    }}
                  >
                    {formatList(events).map((event, index) => (
                      <li
                        key={index}
                        style={{
                          breakInside: "avoid-column",
                          marginBottom: "0.25rem",
                        }}
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
                  <ul className="list-disc pl-6 font-['Indie_Flower'] text-lg space-y-1 text-black">
                    {formatList(crew).map((member, index) => (
                      <li key={index}>{member}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex gap-8">
                  <div className="flex pl-4 items-center gap-2">
                    <img
                      src={goldBase64 || goldImg}
                      alt="Gold"
                      className="w-8 h-8"
                    />
                    <span className="font-['Indie_Flower'] text-2xl text-black">
                      {gold || "0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={doubloonBase64 || doubloon}
                      alt="Doubloons"
                      className="w-8 h-8"
                    />
                    <span className="font-['Indie_Flower'] text-2xl text-black">
                      {doubloons || "0"}
                    </span>
                  </div>
                </div>

                <div
                  className={`font-['Dancing_Script'] text-4xl text-black font-bold`}
                  style={{
                    transform: "rotate(-4deg)",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {signature || "Your Signature"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
