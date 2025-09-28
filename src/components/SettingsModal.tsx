import React from "react";
import { useLog } from "../context/LogContext";
import { log_backgrounds } from "../config/log_background";
import { log_icons } from "../config/log_icons";
import { ShipType } from "../hooks/useLogState";

export const SettingsModal: React.FC = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    titleFont,
    bodyFont,
    logBackground,
    setLogBackground,
    selectedShip,
    setSelectedShip,
    setTitleFont,
    setBodyFont,
    loadTestingData,
  } = useLog();

  const onClose = () => setIsModalOpen(false);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg w-1/3 text-white">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title Font</label>
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
          <div>
              <label htmlFor="log-icon" className="block text-sm font-medium mb-2">
                Log Icon
              </label>
            <select
              id="log-icon"
              value={selectedShip}
              onChange={(e) => setSelectedShip(e.target.value as ShipType)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            >
              {log_icons.map(function(object, i){
                  return <option value={object.value} key={i}>{object.name}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Log Background
            </label>
              <select
                value={logBackground}
                onChange={(e) => setLogBackground(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              >
                {
                  Object.entries(log_backgrounds).map(([key], i) => {
                    return <option value={key} key={i}>{log_backgrounds[key as keyof typeof log_backgrounds].name}</option>;
                  })
                }
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
