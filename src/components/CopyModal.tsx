import React from "react";
import { useLog } from "../context/LogContext";

export const CopyModal: React.FC = () => {
  const {
    isCopyModalOpen,
    setIsCopyModalOpen,
    formatDiscordMessage,
    copyToClipboard,
  } = useLog();

  const onClose = () => setIsCopyModalOpen(false);

  if (!isCopyModalOpen) return null;

  return (
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
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
