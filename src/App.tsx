import React from "react";
import { SettingsModal } from "./components/SettingsModal";
import { CopyModal } from "./components/CopyModal";
import { Header } from "./components/Header";
import { LogPreview } from "./components/LogPreview";
import { Editor } from "./components/Editor";
import { LogProvider } from "./context/LogContext";

function App() {
  return (
    <LogProvider>
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        <Header />
        <SettingsModal />
        <CopyModal />

        {/* Main Layout */}
        <div className="container mx-auto p-4 flex gap-4">
          <Editor />
          <LogPreview />
        </div>
      </div>
    </LogProvider>
  );
}

export default App;
