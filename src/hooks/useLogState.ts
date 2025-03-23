import { useState, useEffect } from "react";

type DiveEntry = {
  ourTeam: "Athena" | "Reaper";
  enemyTeam: "Athena" | "Reaper";
  outcome: "win" | "loss";
  notes: string;
};

export type LogMode = "patrol" | "skirmish";
export type ShipType = "valhalla" | "fenrir" | "tyr" | "odin";

export function useLogState() {
  // Mode and basic fields
  const [mode, setMode] = useState<LogMode>("patrol");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [signature, setSignature] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [selectedShip, setSelectedShip] = useState<ShipType>("audacious");

  // Patrol-specific fields
  const [events, setEvents] = useState("");
  const [crew, setCrew] = useState("");
  const [gold, setGold] = useState("");
  const [doubloons, setDoubloons] = useState("");

  // Skirmish-specific fields
  const [ourTeam, setOurTeam] = useState<"Athena" | "Reaper">("Athena");
  const [dives, setDives] = useState<DiveEntry[]>([]);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // Font choices
  const [titleFont, setTitleFont] = useState("Satisfy");
  const [bodyFont, setBodyFont] = useState("Indie_Flower");

  // For tabbing between preview pages
  const [activePageIndex, setActivePageIndex] = useState(0);

  // We'll split body text into multiple pages (for the big "body" only)
  const [pages, setPages] = useState<string[]>([]);

  // -----------------------------------
  // Load from localStorage on mount
  // -----------------------------------
  useEffect(() => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode) setMode(savedMode as LogMode);

    const savedTitle = localStorage.getItem("title");
    const savedBody = localStorage.getItem("body");
    const savedSignature = localStorage.getItem("signature");
    const savedSubtitle = localStorage.getItem("subtitle");
    const savedEvents = localStorage.getItem("events");
    const savedCrew = localStorage.getItem("crew");
    const savedGold = localStorage.getItem("gold");
    const savedDoubloons = localStorage.getItem("doubloons");
    const savedOurTeam = localStorage.getItem("ourTeam");
    const savedDives = localStorage.getItem("dives");
    const savedSelectedShip = localStorage.getItem("selectedShip");
    const savedTitleFont = localStorage.getItem("titleFont");
    const savedBodyFont = localStorage.getItem("bodyFont");

    if (savedTitle) setTitle(savedTitle);
    if (savedBody) setBody(savedBody);
    if (savedSignature) setSignature(savedSignature);
    if (savedSubtitle) setSubtitle(savedSubtitle);
    if (savedEvents) setEvents(savedEvents);
    if (savedCrew) setCrew(savedCrew);
    if (savedGold) setGold(savedGold);
    if (savedDoubloons) setDoubloons(savedDoubloons);
    if (savedOurTeam) setOurTeam(savedOurTeam as "Athena" | "Reaper");
    if (savedDives) setDives(JSON.parse(savedDives));
    if (savedSelectedShip) setSelectedShip(savedSelectedShip as ShipType);
    if (savedTitleFont) setTitleFont(savedTitleFont);
    if (savedBodyFont) setBodyFont(savedBodyFont);
  }, []);

  // Helper: Debounce calls to localStorage
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Save to localStorage whenever relevant fields change
  useEffect(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem("mode", mode);
      localStorage.setItem("title", title);
      localStorage.setItem("body", body);
      localStorage.setItem("signature", signature);
      localStorage.setItem("subtitle", subtitle);
      localStorage.setItem("events", events);
      localStorage.setItem("crew", crew);
      localStorage.setItem("gold", gold);
      localStorage.setItem("doubloons", doubloons);
      localStorage.setItem("ourTeam", ourTeam);
      localStorage.setItem("dives", JSON.stringify(dives));
      localStorage.setItem("selectedShip", selectedShip);
      localStorage.setItem("titleFont", titleFont);
      localStorage.setItem("bodyFont", bodyFont);
    };
    const debouncedSave = debounce(saveToLocalStorage, 500);
    debouncedSave();
  }, [
    mode,
    title,
    body,
    signature,
    subtitle,
    events,
    crew,
    gold,
    doubloons,
    ourTeam,
    dives,
    selectedShip,
    titleFont,
    bodyFont,
  ]);

  // Pagination logic
  const WRITING_AREA_HEIGHT = 982; // pixels
  const LINE_HEIGHT = 24; // approximate line height
  const LINES_PER_PAGE = Math.floor(WRITING_AREA_HEIGHT / LINE_HEIGHT);
  const CHARS_PER_LINE = 70; // approx chars per line
  const CHARS_PER_PAGE = LINES_PER_PAGE * CHARS_PER_LINE;

  function splitTextIntoPages(longText: string): string[] {
    if (!longText) return [""];

    const pagesArr: string[] = [];
    const lines = longText.split("\n");
    let currentPage = "";
    let currentHeight = 0;

    for (const line of lines) {
      const lineLength = line.length;
      const wrappedLines = Math.ceil(lineLength / CHARS_PER_LINE);
      const linePixelHeight = wrappedLines * LINE_HEIGHT;

      if (currentHeight + linePixelHeight > WRITING_AREA_HEIGHT) {
        pagesArr.push(currentPage);
        currentPage = line;
        currentHeight = linePixelHeight;
      } else {
        if (currentPage) {
          currentPage += "\n";
          currentHeight += LINE_HEIGHT;
        }
        currentPage += line;
        currentHeight += linePixelHeight;
      }

      if (lineLength > CHARS_PER_PAGE) {
        let remainingText = line;
        while (remainingText.length > CHARS_PER_PAGE) {
          const chunk = remainingText.slice(0, CHARS_PER_PAGE);
          pagesArr.push(chunk);
          remainingText = remainingText.slice(CHARS_PER_PAGE);
        }
        currentPage = remainingText;
        currentHeight =
          Math.ceil(remainingText.length / CHARS_PER_LINE) * LINE_HEIGHT;
      }
    }

    if (currentPage) {
      pagesArr.push(currentPage);
    }

    return pagesArr;
  }

  // Whenever 'body' changes, recalc pages
  useEffect(() => {
    const splitted = splitTextIntoPages(body);
    setPages(splitted);
    setActivePageIndex(splitted.length - 1); // jump to last page
  }, [body]);

  // Skirmish dive management
  const addNewDive = () => {
    const newDive: DiveEntry = {
      ourTeam,
      enemyTeam: ourTeam === "Athena" ? "Reaper" : "Athena",
      outcome: "win",
      notes: "",
    };
    setDives([...dives, newDive]);
  };

  const updateDive = (index: number, updated: Partial<DiveEntry>) => {
    setDives(dives.map((d, i) => (i === index ? { ...d, ...updated } : d)));
  };

  const removeDive = (index: number) => {
    setDives(dives.filter((_, i) => i !== index));
  };

  // Reset all state
  const resetState = () => {
    setTitle("");
    setBody("");
    setSignature("");
    setSubtitle("");
    setEvents("");
    setCrew("");
    setGold("");
    setDoubloons("");
    setOurTeam("Athena");
    setDives([]);
    setActivePageIndex(0);
  };

  // Load testing data
  const loadTestingData = () => {
    if (mode === "patrol") {
      setTitle("Test Patrol Title");
      setBody("Sample patrol log entry...");
      setSignature("Capt. Test");
      setEvents("Event 1\nEvent 2\nEvent 3");
      setCrew("Crew 1\nCrew 2\nCrew 3");
      setGold("1000");
      setDoubloons("300");
      setSubtitle("Test Subtitle");
    } else {
      setTitle("Test Skirmish Title");
      setBody("Skirmish details here...");
      setSignature("Capt. Test");
      setOurTeam("Athena");
      setDives([
        {
          ourTeam: "Athena",
          enemyTeam: "Reaper",
          outcome: "loss",
          notes: "Stamp Leader, they had 10 flags...",
        },
        {
          ourTeam: "Athena",
          enemyTeam: "Reaper",
          outcome: "win",
          notes: "Second match, big win",
        },
      ]);
      setSubtitle("Skirmish Leader");
    }
  };

  // Format list helper
  const formatList = (text: string) => {
    if (!text) return [];
    return text.split("\n").filter((item) => item.trim() !== "");
  };

  // Discord message formatting
  const formatDiscordMessage = () => {
    // Common sections that appear in both modes
    const formatCommonSections = () => {
      const sections = [
        title || "Title here",
        "",
        body ||
          (mode === "patrol" ? "Patrol details here" : "Skirmish details here"),
        "",
      ];
      return sections.join("\n");
    };

    // Format the signature block that appears at the end
    const formatSignature = () => {
      const sections = [
        "",
        "Signed:",
        signature || "Your Signature",
        subtitle || "",
      ].filter(Boolean);
      return sections.join("\n");
    };

    // Format patrol-specific content
    const formatPatrolContent = () => {
      const sections = [
        "Events:",
        events || "N/A",
        "",
        `Gold: ${gold || "0"}`,
        `Doubloons: ${doubloons || "0"}`,
        "",
        "Crew:",
        crew || "N/A",
      ];
      return sections.join("\n");
    };

    // Format skirmish-specific content
    const formatSkirmishContent = () => {
      const formatTeamEmoji = (team: "Athena" | "Reaper") =>
        `${team} ${team === "Athena" ? ":Athena:" : ":Reaper:"}`;

      const formatDive = (dive: DiveEntry, index: number) => {
        const vs = `${formatTeamEmoji(dive.ourTeam)} vs. ${formatTeamEmoji(
          dive.enemyTeam
        )}`;
        const notes = dive.notes ? ` - ${dive.notes}` : "";
        return `${index + 1}. ${vs} [${dive.outcome}]${notes}`;
      };

      const sections = [
        `Team: ${ourTeam || "Athena"}`,
        "",
        "Dives:",
        dives.length
          ? dives.map((d, i) => formatDive(d, i)).join("\n")
          : "No dives yet",
      ];
      return sections.join("\n");
    };

    // Combine all sections based on mode
    const content = [
      formatCommonSections(),
      mode === "patrol" ? formatPatrolContent() : formatSkirmishContent(),
      formatSignature(),
    ].join("\n");

    return content.trim();
  };

  return {
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
    setDives,
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
  };
}
