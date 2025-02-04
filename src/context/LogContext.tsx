import React, { createContext, useContext } from "react";
import { useLogState } from "../hooks/useLogState";
import { useExport } from "../hooks/useExport";
import { ShipType } from "../hooks/useLogState";

interface LogContextType {
  // State
  mode: "patrol" | "skirmish";
  title: string;
  body: string;
  signature: string;
  subtitle: string;
  selectedShip: ShipType;
  events: string;
  crew: string;
  gold: string;
  doubloons: string;
  ourTeam: "Athena" | "Reaper";
  dives: Array<{
    ourTeam: "Athena" | "Reaper";
    enemyTeam: "Athena" | "Reaper";
    outcome: "win" | "loss";
    notes?: string;
  }>;
  isModalOpen: boolean;
  isCopyModalOpen: boolean;
  titleFont: string;
  bodyFont: string;
  activePageIndex: number;
  pages: string[];

  // Setters
  setMode: (mode: "patrol" | "skirmish") => void;
  setTitle: (title: string) => void;
  setBody: (body: string) => void;
  setSignature: (signature: string) => void;
  setSubtitle: (subtitle: string) => void;
  setSelectedShip: (ship: ShipType) => void;
  setEvents: (events: string) => void;
  setCrew: (crew: string) => void;
  setGold: (gold: string) => void;
  setDoubloons: (doubloons: string) => void;
  setOurTeam: (team: "Athena" | "Reaper") => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setIsCopyModalOpen: (isOpen: boolean) => void;
  setTitleFont: (font: string) => void;
  setBodyFont: (font: string) => void;
  setActivePageIndex: (index: number) => void;

  // Actions
  addNewDive: () => void;
  updateDive: (
    index: number,
    update: Partial<{
      ourTeam: "Athena" | "Reaper";
      enemyTeam: "Athena" | "Reaper";
      outcome: "win" | "loss";
      notes?: string;
    }>
  ) => void;
  removeDive: (index: number) => void;
  resetState: () => void;
  loadTestingData: () => void;
  formatList: (text: string) => string[];
  formatDiscordMessage: () => string;

  // Export functions
  generatePDF: () => Promise<void>;
  generateImages: () => Promise<void>;
  copyToClipboard: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const logState = useLogState();
  const { generatePDF, generateImages, copyToClipboard } = useExport({
    title: logState.title,
    activePageIndex: logState.activePageIndex,
    setActivePageIndex: logState.setActivePageIndex,
    pages: logState.pages,
    formatDiscordMessage: logState.formatDiscordMessage,
  });

  const value = {
    ...logState,
    generatePDF,
    generateImages,
    copyToClipboard,
  };

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error("useLog must be used within a LogProvider");
  }
  return context;
};
