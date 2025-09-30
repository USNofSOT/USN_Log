import React from "react";
import { useLog } from "../context/LogContext";
import { log_backgrounds } from "../config/log_background";
import { log_icons } from "../config/log_icons";
import { availableFonts, defaultFonts } from "../config/fonts";
import { ShipType } from "../hooks/useLogState";
import { RepeatIcon } from "lucide-react";

export const SettingsModal: React.FC = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    titleFont,
    bodyFont,
    signatureFont,
    subtitleFont,
    headerFont,
    listFont,
    logBackground,
    setLogBackground,
    setTitleFont,
    setBodyFont,
    setSignatureFont,
    setSubtitleFont,
    setHeaderFont,
    setListFont,
    loadTestingData,
    logIcon,
    setLogIcon,
  } = useLog();

  const onClose = () => setIsModalOpen(false);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg w-2/3 max-w-4xl text-white max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold">Font Settings</h3>
              <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all fonts to their default values?")) {
                  setTitleFont(defaultFonts.title);
                  setBodyFont(defaultFonts.body);
                  setSignatureFont(defaultFonts.signature);
                  setSubtitleFont(defaultFonts.subtitle);
                  setHeaderFont(defaultFonts.headers);
                  setListFont(defaultFonts.lists);
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
              >
              <RepeatIcon size={16} className="inline" />
              </button>
            </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title Font</label>
              <select
                value={titleFont}
                onChange={(e) => setTitleFont(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              >
                {availableFonts.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Body Text Font</label>
              <select
                value={bodyFont}
                onChange={(e) => setBodyFont(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              >
                {availableFonts.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Signature Font</label>
              <select
                value={signatureFont}
                onChange={(e) => setSignatureFont(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              >
                {availableFonts.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subtitle Font</label>
              <select
                value={subtitleFont}
                onChange={(e) => setSubtitleFont(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              >
                {availableFonts.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Headers Font (Events, Crew)</label>
              <select
                value={headerFont}
                onChange={(e) => setHeaderFont(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              >
                {availableFonts.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lists Font (Events, Crew)</label>
              <select
                value={listFont}
                onChange={(e) => setListFont(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              >
                {availableFonts.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Background Settings */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Appearance Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Log Background</label>
              <select
                value={logBackground}
                onChange={(e) => setLogBackground(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              >
                {Object.entries(log_backgrounds).map(([key, bg]) => (
                  <option key={key} value={key}>{bg.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="log-icon" className="block text-sm font-medium mb-2">
                Ship Logo
              </label>
              <select
                id="log-icon"
                value={logIcon}
                onChange={(e) => setLogIcon(e.target.value as ShipType)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              >
                {log_icons.map((icon, i) => (
                  <option value={icon.value} key={i}>{icon.name}</option>
                ))}
              </select>
            </div>
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
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
