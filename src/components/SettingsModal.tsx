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
    showTitleOnFirstPage,
    setShowTitleOnFirstPage,
    showExtrasOnLastPage,
    setShowExtrasOnLastPage,
  } = useLog();

  const onClose = () => setIsModalOpen(false);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg w-2/3 max-w-4xl text-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Display Options</h3>
          <div className="bg-[#3a3a3a] p-4 rounded-lg">
            <p className="text-sm text-gray-300 mb-3">Control when elements appear in your log:</p>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex items-center text-white cursor-pointer hover:bg-[#4a4a4a] p-2 rounded">
                <input
                  type="checkbox"
                  checked={showTitleOnFirstPage}
                  onChange={(e) => setShowTitleOnFirstPage(e.target.checked)}
                  className="mr-3 w-4 h-4 accent-blue-500"
                />
                <div>
                  <span className="font-medium">Show title only on first page</span>
                  <p className="text-xs text-gray-400">When disabled, title will appear on all pages</p>
                </div>
              </label>
              <label className="flex items-center text-white cursor-pointer hover:bg-[#4a4a4a] p-2 rounded">
                <input
                  type="checkbox"
                  checked={showExtrasOnLastPage}
                  onChange={(e) => setShowExtrasOnLastPage(e.target.checked)}
                  className="mr-3 w-4 h-4 accent-blue-500"
                />
                <div>
                  <span className="font-medium">Show crew, events & signature only on last page</span>
                  <p className="text-xs text-gray-400">When disabled, these elements will appear on all pages</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Font Settings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-green-400">Font Settings</h3>
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
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded flex items-center gap-2"
              title="Reset all fonts to defaults"
            >
              <RepeatIcon size={16} />
              Reset Fonts
            </button>
          </div>
          <div className="bg-[#3a3a3a] p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title Font</label>
                <select
                  value={titleFont}
                  onChange={(e) => setTitleFont(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
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
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
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
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
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
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                >
                  {availableFonts.map(font => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Headers Font</label>
                <select
                  value={headerFont}
                  onChange={(e) => setHeaderFont(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                >
                  {availableFonts.map(font => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lists Font</label>
                <select
                  value={listFont}
                  onChange={(e) => setListFont(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                >
                  {availableFonts.map(font => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-purple-400">Appearance Settings</h3>
          <div className="bg-[#3a3a3a] p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Log Background</label>
                <select
                  value={logBackground}
                  onChange={(e) => setLogBackground(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                >
                  {Object.entries(log_backgrounds).map(([key, bg]) => (
                    <option key={key} value={key}>{bg.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ship Logo</label>
                <select
                  value={logIcon}
                  onChange={(e) => setLogIcon(e.target.value as ShipType)}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                >
                  {log_icons.map((icon, i) => (
                    <option value={icon.value} key={i}>{icon.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-600">
          <button
            onClick={loadTestingData}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition-colors"
          >
            Load Testing Data
          </button>

          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

