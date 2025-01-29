import React from "react";
import { useLogState } from "./hooks/useLogState";
import { useExport } from "./hooks/useExport";
import { SettingsModal } from "./components/SettingsModal";
import { CopyModal } from "./components/CopyModal";
import { Header } from "./components/Header";
import { LogPreview } from "./components/LogPreview";
import { Editor } from "./components/Editor";

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

  const { generatePDF, generateImages, copyToClipboard } = useExport({
    title,
    activePageIndex,
    setActivePageIndex,
    pages,
    formatDiscordMessage,
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header onSettingsClick={toggleModal} />

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
        <Editor
          mode={mode}
          setMode={setMode}
          title={title}
          setTitle={setTitle}
          body={body}
          setBody={setBody}
          signature={signature}
          setSignature={setSignature}
          subtitle={subtitle}
          setSubtitle={setSubtitle}
          selectedShip={selectedShip}
          setSelectedShip={setSelectedShip}
          events={events}
          setEvents={setEvents}
          crew={crew}
          setCrew={setCrew}
          gold={gold}
          setGold={setGold}
          doubloons={doubloons}
          setDoubloons={setDoubloons}
          ourTeam={ourTeam}
          setOurTeam={setOurTeam}
          dives={dives}
          updateDive={updateDive}
          removeDive={removeDive}
          addNewDive={addNewDive}
          generatePDF={generatePDF}
          generateImages={generateImages}
          resetState={resetState}
          setIsCopyModalOpen={setIsCopyModalOpen}
        />

        <LogPreview
          pages={pages}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          selectedShip={selectedShip}
          title={title}
          signature={signature}
          subtitle={subtitle}
          mode={mode}
          events={events}
          crew={crew}
          gold={gold}
          doubloons={doubloons}
          dives={dives}
          titleFont={titleFont}
          bodyFont={bodyFont}
          formatList={formatList}
        />
      </div>
    </div>
  );
}

export default App;
