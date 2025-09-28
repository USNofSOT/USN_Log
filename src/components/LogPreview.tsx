import React from "react";
import { useLog } from "../context/LogContext";
import { log_icons } from "../config/log_icons";
import { log_backgrounds } from "../config/log_background";

export const LogPreview: React.FC = () => {
  const {
    pages,
    activePageIndex,
    setActivePageIndex,
    selectedShip,
    title,
    signature,
    subtitle,
    mode,
    events,
    crew,
    gold,
    doubloons,
    dives,
    titleFont,
    bodyFont,
    logBackground,
    formatList,
  } = useLog();
  const shipLogos: Record<string, string> = log_icons.reduce((acc, icon) => {
    acc[icon.value] = icon.path;
    return acc;
  }, {} as Record<string, string>);

  const renderPage = (pageText: string, idx: number, isVisible: boolean) => {
    const displayStyle = isVisible ? "block" : "none";
    const isLastPage = idx === pages.length - 1;

    return (
      <div
        key={idx}
        id={isVisible ? "visible-page" : undefined}
        className="bg-cover rounded-lg pb-28 mb-8"
        style={{
          backgroundImage: `url('${log_backgrounds[logBackground as keyof typeof log_backgrounds].path}')`,
          width: "816px",
          height: "1190px",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          position: "relative",
          display: displayStyle,
        }}
      >
        {/* Ship Logo */}
          {selectedShip !== 'none' && (
            <img
              src={shipLogos[selectedShip]}
              onError={(e) => {
                e.currentTarget.src = "/USN_Log/log_icons/usn_logo.png";
              }}
              alt="Ship Logo"
              crossOrigin="anonymous"
              className="absolute inset-0 m-auto"
              style={{
                width: "50%",
                height: "auto",
                opacity: 0.3,
                zIndex: 0,
              }}
            />
          )}

        <div
          id="writing-area"
          className="p-12 h-full flex flex-col relative z-10"
        >
          <h2
            className={`text-5xl text-center ml-16 mr-16 mt-12 mb-8 font-['${titleFont}'] text-black whitespace-pre-wrap`}
          >
            {title || "Log Title"}
          </h2>

          <div
            className={`font-['${bodyFont}'] text-base flex-grow whitespace-pre-wrap text-black leading-relaxed p-2`}
          >
            {pageText || "Your log entry will appear here..."}
          </div>

          {/* On last page, we render either "Patrol" fields or "Skirmish" fields */}
          {isLastPage && mode === "patrol" && (
            <>
              {/* Patrol Layout: Events + Crew */}
              <div className="grid grid-cols-2 gap-8 ml-6 mt-4">
                <div>
                  <h3 className="font-['Satisfy'] text-2xl text-black mb-2">
                    Notable Events
                  </h3>
                  <ul
                    className="list-none font-['Indie_Flower'] text-lg text-black"
                    style={{
                      columns: "2",
                      columnGap: "1rem",
                      breakInside: "avoid-column",
                    }}
                  >
                    {formatList(events).map((ev, i) => (
                      <li key={i} style={{ breakInside: "avoid-column" }}>
                        {ev}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-['Satisfy'] text-2xl text-black mb-2">
                    Crew Manifest
                  </h3>
                  <ul
                    className="list-none font-['Indie_Flower'] text-lg text-black"
                    style={{
                      columns: "2",
                      columnGap: "1rem",
                      breakInside: "avoid-column",
                    }}
                  >
                    {formatList(crew).map((member, i) => (
                      <li key={i} style={{ breakInside: "avoid-column" }}>
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Gold + Doubloons + Signature */}
              <div className="flex justify-between items-end">
                <div className="flex gap-8">
                  <div className="flex pl-4 items-center gap-2">
                    <img
                      src="/USN_Log/gold.webp"
                      alt="Gold"
                      crossOrigin="anonymous"
                      className="w-8 h-8"
                    />
                    <span className="font-['Indie_Flower'] text-2xl text-black">
                      {gold || "0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src="/USN_Log/doubloon.webp"
                      alt="Doubloons"
                      crossOrigin="anonymous"
                      className="w-8 h-8"
                    />
                    <span className="font-['Indie_Flower'] text-2xl text-black">
                      {doubloons || "0"}
                    </span>
                  </div>
                </div>

                <div
                  className="font-['Dancing_Script'] absolute right-16 bottom-0 text-5xl text-black font-bold whitespace-pre-wrap"
                  style={{
                    transform: "rotate(-4deg)",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {signature || "Your Signature"}
                  {subtitle && (
                    <div className="text-3xl mt-2 text-right">{subtitle}</div>
                  )}
                </div>
              </div>
            </>
          )}

          {isLastPage && mode === "skirmish" && (
            <div className="p-2">
              {/* Skirmish Layout */}
              <h3 className="font-['Satisfy'] text-2xl text-black mb-2">
                Skirmish Dives
              </h3>
              <div className="font-['Indie_Flower'] text-xl text-black leading-relaxed p-2">
                {dives.length === 0 && (
                  <div>No dives recorded for this skirmish.</div>
                )}
                <div
                  className={`grid ${
                    dives.length > 8 ? "grid-cols-2 gap-0" : "grid-cols-1"
                  }`}
                >
                  {dives.map((dive, i) => (
                    <div key={i} className="mb-3">
                      <strong className="flex items-center gap-2">
                        <span>
                          {i + 1}. {dive.ourTeam}
                        </span>
                        <img
                          className="w-8 h-8"
                          src={`/USN_Log/${dive.ourTeam.toLocaleLowerCase()}.webp`}
                          alt=""
                        />
                        <span>vs {dive.enemyTeam}</span>
                        <img
                          className="w-8 h-8"
                          src={`/USN_Log/${dive.enemyTeam.toLocaleLowerCase()}.webp`}
                          alt=""
                        />
                        <span>({dive.outcome})</span>
                      </strong>
                      {dive.notes && (
                        <div className="ml-4 italic">{dive.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature */}
              <div className="flex justify-end items-center mt-8">
                <div
                  className="font-['Dancing_Script'] text-5xl text-black font-bold whitespace-pre-wrap"
                  style={{
                    transform: "rotate(-4deg)",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {signature || "Your Signature"}
                  {subtitle && (
                    <div className="text-3xl mt-2 text-right">{subtitle}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-1/2" data-testid="log-preview">
      {pages.length > 1 && (
        <div className="flex gap-2 mb-2">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePageIndex(idx)}
              className={`px-3 py-1 rounded ${
                idx === activePageIndex
                  ? "bg-blue-600"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              Page {idx + 1}
            </button>
          ))}
        </div>
      )}

      {pages.map((pageText, idx) =>
        renderPage(pageText, idx, idx === activePageIndex)
      )}
    </div>
  );
};
