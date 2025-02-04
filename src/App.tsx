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
        <div role="banner">
          <Header />
        </div>
        <SettingsModal data-testid="settings-modal" />
        <CopyModal data-testid="copy-modal" />

        {/* Main Layout */}
        <main className="container mx-auto p-4 flex gap-4">
          <Editor data-testid="editor" />
          <LogPreview data-testid="log-preview" />
        </main>
      </div>
    </LogProvider>
  );
}

export default App;
