import React from "react";
import { useLog } from "../context/LogContext";

export const Header: React.FC = () => {
  const { setIsModalOpen } = useLog();
  const toggleModal = () => setIsModalOpen(true);

  return (
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
  );
};
