import React from "react";
import { useLog } from "../context/LogContext";
import { log_icons } from "../config/log_icons";
import { log_backgrounds } from "../config/log_background";
import type { SectionStyle } from "../hooks/useLogState";

export const LogPreview: React.FC = () => {
  const {
    pages,
    activePageIndex,
    setActivePageIndex,
    logIcon,
    title,
    signature,
    headerFont,
    listFont,
    goldFont,
    signatureFontSize,
    headerFontSize,
    listFontSize,
    mode,
    events,
    crew,
    gold,
    doubloons,
    dives,
    titleFont,
    bodyFont,
    signatureFont,
    logBackground,
    formatList,
    showTitleOnFirstPage,
    showExtrasOnLastPage,
    titleFontSize,
    bodyFontSize,
    contentPadding,
    enableEvents,
    enableCrew,
    previewMode,
    formatDiscordMessage,
    titleColor,
    bodyColor,
    signatureColor,
    headerColor,
    listColor,
    goldColor,
    sectionStyles,
  } = useLog();

  const shipLogos: Record<string, string> = log_icons.reduce((acc, icon) => {
    acc[icon.value] = icon.path;
    return acc;
  }, {} as Record<string, string>);

  // Helper to create section style object
  const getSectionStyle = (sectionStyle: SectionStyle): React.CSSProperties => ({
    textAlign: sectionStyle.alignment as any,
    paddingTop: `${sectionStyle.paddingTop}px`,
    paddingBottom: `${sectionStyle.paddingBottom}px`,
    paddingLeft: `${sectionStyle.paddingLeft}px`,
    paddingRight: `${sectionStyle.paddingRight}px`,
    marginTop: `${sectionStyle.marginTop}px`,
    marginBottom: `${sectionStyle.marginBottom}px`,
    marginLeft: `${sectionStyle.marginLeft}px`,
    marginRight: `${sectionStyle.marginRight}px`,
  });

  const renderPage = (pageText: string, idx: number, isVisible: boolean) => {
    const displayStyle = isVisible ? "block" : "none";
    const isLastPage = idx === pages.length - 1;
    const isFirstPage = idx === 0;

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
          padding: `${contentPadding}px`,
        }}
      >
        {/* Ship Logo */}
        {logIcon !== 'none' && (
          <img
            src={shipLogos[logIcon]}
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
          className="h-full flex flex-col relative z-10"
        >
          {/* Title Section */}
          {(showTitleOnFirstPage ? isFirstPage : true) && (
            <div style={getSectionStyle(sectionStyles.title)}>
              <h2
                className={`font-${titleFont} whitespace-pre-wrap`}
                style={{ 
                  fontSize: `${titleFontSize}px`,
                  color: titleColor,
                }}
              >
                {title || "Log Title"}
              </h2>
            </div>
          )}

          {/* Body Section */}
          <div
            className={`font-${bodyFont} flex-grow whitespace-pre-wrap leading-relaxed`}
            style={{ 
              fontSize: `${bodyFontSize}px`,
              color: bodyColor,
              ...getSectionStyle(sectionStyles.body),
            }}
          >
            {pageText || "Your log entry will appear here..."}
          </div>

          {/* Patrol Mode Sections */}
          {isLastPage && mode === "patrol" && (
            <>
              {(showExtrasOnLastPage ? isLastPage : true) && (
                <div className="grid grid-cols-2 gap-8">
                  {/* Events Section */}
                  {enableEvents && events && (
                    <div style={getSectionStyle(sectionStyles.events)}>
                      <h3 
                        className={`font-${headerFont}`}
                        style={{ 
                          fontSize: `${headerFontSize}px`,
                          color: headerColor,
                        }}
                      >
                        Notable Events
                      </h3>
                      <ul
                        className={`list-none font-${listFont}`}
                        style={{
                          fontSize: `${listFontSize}px`,
                          color: listColor,
                          columns: "2",
                          columnGap: "1rem",
                          breakInside: "avoid-column",
                        }}
                      >
                        {formatList(events).map((ev, i) => (
                          <li 
                            key={i} 
                            style={{ 
                              breakInside: "avoid-column",
                            }}
                          >
                            {ev}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Crew Section */}
                  {enableCrew && crew && (
                    <div style={getSectionStyle(sectionStyles.crew)}>
                      <h3 
                        className={`font-${headerFont}`}
                        style={{ 
                          fontSize: `${headerFontSize}px`,
                          color: headerColor,
                        }}
                      >
                        Crew Manifest
                      </h3>
                      <ul
                        className={`list-none font-${listFont}`}
                        style={{
                          fontSize: `${listFontSize}px`,
                          color: listColor,
                          columns: "2",
                          columnGap: "1rem",
                          breakInside: "avoid-column",
                        }}
                      >
                        {formatList(crew).map((member, i) => (
                          <li 
                            key={i} 
                            style={{ 
                              breakInside: "avoid-column",
                            }}
                          >
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Gold + Doubloons Section */}
              <div className="flex justify-between items-end">
                <div 
                  className="flex gap-8"
                  style={getSectionStyle(sectionStyles.gold)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src="/USN_Log/gold.webp"
                      alt="Gold"
                      crossOrigin="anonymous"
                      className="w-8 h-8"
                    />
                    <span 
                      className={`font-${goldFont}`}
                      style={{ 
                        fontSize: `${listFontSize * 1.3}px`,
                        color: goldColor,
                      }}
                    >
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
                    <span 
                      className={`font-${goldFont}`}
                      style={{ 
                        fontSize: `${listFontSize * 1.3}px`,
                        color: goldColor,
                      }}
                    >
                      {doubloons || "0"}
                    </span>
                  </div>
                </div>

                {/* Signature Section */}
                {(showExtrasOnLastPage ? isLastPage : true) && (
                  <div
                    className={`font-${signatureFont} absolute right-16 bottom-0 font-bold whitespace-pre-wrap`}
                    style={{
                      fontSize: `${signatureFontSize}px`,
                      color: signatureColor,
                      transform: "rotate(-4deg)",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                      ...getSectionStyle(sectionStyles.signature),
                    }}
                  >
                    {signature || "Your Signature"}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Non-last pages with patrol sections */}
          {!isLastPage && (
            <>
              {!showExtrasOnLastPage && mode === "patrol" && (
                <>
                  {/* Events Section */}
                  {events && (
                    <div style={getSectionStyle(sectionStyles.events)}>
                      <h3 
                        className={`font-${headerFont}`}
                        style={{ 
                          fontSize: `${headerFontSize}px`,
                          color: headerColor,
                        }}
                      >
                        Notable Events
                      </h3>
                      <ul 
                        className={`list-none font-${listFont}`}
                        style={{ 
                          fontSize: `${listFontSize}px`,
                          color: listColor,
                        }}
                      >
                        {formatList(events).map((ev, i) => (
                          <li key={i}>{ev}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Crew Section */}
                  {crew && (
                    <div style={getSectionStyle(sectionStyles.crew)}>
                      <h3 
                        className={`font-${headerFont} mb-2`}
                        style={{ 
                          fontSize: `${headerFontSize}px`,
                          color: headerColor,
                        }}
                      >
                        Crew Manifest
                      </h3>
                      <ul 
                        className={`list-none font-${listFont}`}
                        style={{ 
                          fontSize: `${listFontSize}px`,
                          color: listColor,
                        }}
                      >
                        {formatList(crew).map((member, i) => (
                          <li key={i}>{member}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Signature Section */}
                  <div className="flex justify-end mt-auto">
                    <div
                      className={`font-${signatureFont} font-bold whitespace-pre-wrap`}
                      style={{
                        fontSize: `${signatureFontSize}px`,
                        color: signatureColor,
                        transform: "rotate(-4deg)",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                        ...getSectionStyle(sectionStyles.signature),
                      }}
                    >
                      {signature || "Your Signature"}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Skirmish Mode Sections */}
          {isLastPage && mode === "skirmish" && (
            <div style={getSectionStyle(sectionStyles.dives)}>
              <h3 
                className={`font-${headerFont}`}
                style={{ 
                  fontSize: `${headerFontSize}px`,
                  color: headerColor,
                }}
              >
                Skirmish Dives
              </h3>
              <div 
                className={`font-${listFont} leading-relaxed`}
                style={{ 
                  fontSize: `${listFontSize}px`,
                  color: listColor,
                }}
              >
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

              {/* Signature Section */}
              <div 
                className="flex justify-end items-center"
              >
                <div
                  className={`font-${signatureFont} font-bold whitespace-pre-wrap`}
                  style={{
                    fontSize: `${signatureFontSize}px`,
                    color: signatureColor,
                    transform: "rotate(-4deg)",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                    ...getSectionStyle(sectionStyles.signature),
                  }}
                >
                  {signature || "Your Signature"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (previewMode === "discord") {
    return (
      <div className="w-1/2" data-testid="log-preview">
        <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">Discord Message Preview</h2>
          <textarea
            className="w-full p-4 bg-[#3a3a3a] rounded border border-gray-600 text-white font-mono text-sm leading-relaxed resize-none"
            value={formatDiscordMessage()}
            readOnly
            style={{ height: "600px" }}
          />
        </div>
      </div>
    );
  }

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