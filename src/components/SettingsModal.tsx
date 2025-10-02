import React, { useState } from "react";
import { useLog } from "../context/LogContext";
import { log_backgrounds } from "../config/log_background";
import { log_icons } from "../config/log_icons";
import { availableFonts, defaultFonts } from "../config/fonts";
import { fontSizeConfig, defaultFontSizes } from "../config/fontSizes";
import { spacingConfig, defaultSpacing } from "../config/spacing";
import { appearanceDefaults } from "../config/appearance";
import { discordFormats, imageFormats, defaultDiscordFormat, defaultImageFormat } from "../config/formats";
import { RepeatIcon, ChevronDownIcon, ChevronUpIcon, MinimizeIcon, MaximizeIcon } from "lucide-react";
import type { SectionStyle, TextAlignment } from "../hooks/useLogState";

export const SettingsModal: React.FC = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    titleFont,
    bodyFont,
    signatureFont,
    headerFont,
    listFont,
    goldFont,
    logBackground,
    setLogBackground,
    setTitleFont,
    setBodyFont,
    setSignatureFont,
    setHeaderFont,
    setListFont,
    setGoldFont,
    loadTestingData,
    logIcon,
    setLogIcon,
    showTitleOnFirstPage,
    setShowTitleOnFirstPage,
    showExtrasOnLastPage,
    setShowExtrasOnLastPage,
    titleFontSize,
    bodyFontSize,
    signatureFontSize,
    headerFontSize,
    listFontSize,
    setTitleFontSize,
    setBodyFontSize,
    setSignatureFontSize,
    setHeaderFontSize,
    setListFontSize,
    contentPadding,
    contentMargin,
    setContentPadding,
    setContentMargin,
    enableEvents,
    enableCrew,
    setEnableEvents,
    setEnableCrew,
    discordFormat,
    imageFormat,
    setDiscordFormat,
    setImageFormat,
    titleColor,
    bodyColor,
    signatureColor,
    setTitleColor,
    setBodyColor,
    setSignatureColor,
    headerColor,
    listColor,
    goldColor,
    setHeaderColor,
    setListColor,
    setGoldColor,
    sectionStyles,
    updateSectionStyle,
    resetSectionStyles,
    title,
    signature,
    events,
    crew,
    gold,
    doubloons,
    formatList,
  } = useLog();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isPreviewMinimized, setIsPreviewMinimized] = useState(false);

  const onClose = () => setIsModalOpen(false);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  };

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

  // Preview component
  const SettingsPreview: React.FC = () => {
    const shipLogos: Record<string, string> = log_icons.reduce((acc, icon) => {
      acc[icon.value] = icon.path;
      return acc;
    }, {} as Record<string, string>);

    return (
      <div className={`bg-[#1a1a1a] rounded-lg transition-all duration-300 ${
        isPreviewMinimized ? 'p-2' : 'p-4'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h4 className={`font-medium text-white ${
            isPreviewMinimized ? 'text-sm' : 'text-lg'
          }`}>
            Live Preview
          </h4>
          <button
            onClick={() => setIsPreviewMinimized(!isPreviewMinimized)}
            className="text-gray-400 hover:text-white transition-colors"
            title={isPreviewMinimized ? "Maximize preview" : "Minimize preview"}
          >
            {isPreviewMinimized ? <MaximizeIcon size={16} /> : <MinimizeIcon size={16} />}
          </button>
        </div>
        
        {!isPreviewMinimized && (
          <div className="relative overflow-hidden">
            <div
              className="bg-cover rounded-lg relative mx-auto"
              style={{
                backgroundImage: `url('${log_backgrounds[logBackground as keyof typeof log_backgrounds].path}')`,
                width: "280px",
                height: "380px",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                padding: `${Math.max(contentPadding * 0.35, 4)}px`,
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
                    width: "45%",
                    height: "auto",
                    opacity: 0.25,
                    zIndex: 0,
                  }}
                />
              )}

              <div className="h-full flex flex-col relative z-10 text-xs overflow-hidden">
                {/* Title Section Preview */}
                <div style={{
                  ...getSectionStyle(sectionStyles.title),
                  paddingTop: `${Math.max(sectionStyles.title.paddingTop * 0.35, 2)}px`,
                  paddingBottom: `${Math.max(sectionStyles.title.paddingBottom * 0.35, 2)}px`,
                  paddingLeft: `${Math.max(sectionStyles.title.paddingLeft * 0.35, 2)}px`,
                  paddingRight: `${Math.max(sectionStyles.title.paddingRight * 0.35, 2)}px`,
                  marginTop: `${Math.max(sectionStyles.title.marginTop * 0.35, 2)}px`,
                  marginBottom: `${Math.max(sectionStyles.title.marginBottom * 0.35, 2)}px`,
                  marginLeft: `${sectionStyles.title.marginLeft * 0.35}px`,
                  marginRight: `${sectionStyles.title.marginRight * 0.35}px`,
                }}>
                  <h2
                    className={`font-${titleFont} whitespace-pre-wrap leading-tight`}
                    style={{ 
                      fontSize: `${Math.max(titleFontSize * 0.35, 10)}px`,
                      color: titleColor,
                    }}
                  >
                    {title || "Preview Title"}
                  </h2>
                </div>

                {/* Body Section Preview */}
                <div
                  className={`font-${bodyFont} flex-grow whitespace-pre-wrap leading-tight overflow-hidden`}
                  style={{ 
                    fontSize: `${Math.max(bodyFontSize * 0.35, 8)}px`,
                    color: bodyColor,
                    ...getSectionStyle(sectionStyles.body),
                    paddingTop: `${Math.max(sectionStyles.body.paddingTop * 0.35, 2)}px`,
                    paddingBottom: `${Math.max(sectionStyles.body.paddingBottom * 0.35, 2)}px`,
                    paddingLeft: `${Math.max(sectionStyles.body.paddingLeft * 0.35, 2)}px`,
                    paddingRight: `${Math.max(sectionStyles.body.paddingRight * 0.35, 2)}px`,
                    marginTop: `${sectionStyles.body.marginTop * 0.35}px`,
                    marginBottom: `${sectionStyles.body.marginBottom * 0.35}px`,
                    marginLeft: `${sectionStyles.body.marginLeft * 0.35}px`,
                    marginRight: `${sectionStyles.body.marginRight * 0.35}px`,
                  }}
                >
                  Sample body text that shows how your content will appear in the log with proper formatting and styling...
                </div>

                {/* Events and Crew Sections Preview */}
                <div className="grid grid-cols-2 gap-1 flex-shrink-0">
                  {/* Events Section Preview */}
                  {enableEvents && (
                    <div style={{
                      ...getSectionStyle(sectionStyles.events),
                      paddingTop: `${Math.max(sectionStyles.events.paddingTop * 0.35, 1)}px`,
                      paddingBottom: `${Math.max(sectionStyles.events.paddingBottom * 0.35, 1)}px`,
                      paddingLeft: `${Math.max(sectionStyles.events.paddingLeft * 0.35, 1)}px`,
                      paddingRight: `${Math.max(sectionStyles.events.paddingRight * 0.35, 1)}px`,
                      marginTop: `${sectionStyles.events.marginTop * 0.35}px`,
                      marginBottom: `${sectionStyles.events.marginBottom * 0.35}px`,
                      marginLeft: `${sectionStyles.events.marginLeft * 0.35}px`,
                      marginRight: `${sectionStyles.events.marginRight * 0.35}px`,
                    }}>
                      <h3 
                        className={`font-${headerFont} leading-tight`}
                        style={{ 
                          fontSize: `${Math.max(headerFontSize * 0.35, 8)}px`,
                          color: headerColor,
                        }}
                      >
                        Events
                      </h3>
                      <ul
                        className={`list-none font-${listFont} leading-tight`}
                        style={{
                          fontSize: `${Math.max(listFontSize * 0.35, 7)}px`,
                          color: listColor,
                        }}
                      >
                        <li>• Sample event</li>
                        <li>• Another event</li>
                      </ul>
                    </div>
                  )}

                  {/* Crew Section Preview */}
                  {enableCrew && (
                    <div style={{
                      ...getSectionStyle(sectionStyles.crew),
                      paddingTop: `${Math.max(sectionStyles.crew.paddingTop * 0.35, 1)}px`,
                      paddingBottom: `${Math.max(sectionStyles.crew.paddingBottom * 0.35, 1)}px`,
                      paddingLeft: `${Math.max(sectionStyles.crew.paddingLeft * 0.35, 1)}px`,
                      paddingRight: `${Math.max(sectionStyles.crew.paddingRight * 0.35, 1)}px`,
                      marginTop: `${sectionStyles.crew.marginTop * 0.35}px`,
                      marginBottom: `${sectionStyles.crew.marginBottom * 0.35}px`,
                      marginLeft: `${sectionStyles.crew.marginLeft * 0.35}px`,
                      marginRight: `${sectionStyles.crew.marginRight * 0.35}px`,
                    }}>
                      <h3 
                        className={`font-${headerFont} leading-tight`}
                        style={{ 
                          fontSize: `${Math.max(headerFontSize * 0.35, 8)}px`,
                          color: headerColor,
                        }}
                      >
                        Crew
                      </h3>
                      <ul
                        className={`list-none font-${listFont} leading-tight`}
                        style={{
                          fontSize: `${Math.max(listFontSize * 0.35, 7)}px`,
                          color: listColor,
                        }}
                      >
                        <li>• Captain</li>
                        <li>• First Mate</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Gold and Signature Section Preview */}
                <div className="flex justify-between items-end flex-shrink-0 mt-1">
                  <div 
                    className="flex gap-1"
                    style={{
                      ...getSectionStyle(sectionStyles.gold),
                      paddingTop: `${sectionStyles.gold.paddingTop * 0.35}px`,
                      paddingBottom: `${sectionStyles.gold.paddingBottom * 0.35}px`,
                      paddingLeft: `${Math.max(sectionStyles.gold.paddingLeft * 0.35, 1)}px`,
                      paddingRight: `${sectionStyles.gold.paddingRight * 0.35}px`,
                      marginTop: `${sectionStyles.gold.marginTop * 0.35}px`,
                      marginBottom: `${sectionStyles.gold.marginBottom * 0.35}px`,
                      marginLeft: `${sectionStyles.gold.marginLeft * 0.35}px`,
                      marginRight: `${sectionStyles.gold.marginRight * 0.35}px`,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <img
                        src="/USN_Log/gold.webp"
                        alt="Gold"
                        crossOrigin="anonymous"
                        className="w-2 h-2"
                      />
                      <span 
                        className={`font-${goldFont}`}
                        style={{ 
                          fontSize: `${Math.max(listFontSize * 0.4, 7)}px`,
                          color: goldColor,
                        }}
                      >
                        1000
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <img
                        src="/USN_Log/doubloon.webp"
                        alt="Doubloons"
                        crossOrigin="anonymous"
                        className="w-2 h-2"
                      />
                      <span 
                        className={`font-${goldFont}`}
                        style={{ 
                          fontSize: `${Math.max(listFontSize * 0.4, 7)}px`,
                          color: goldColor,
                        }}
                      >
                        300
                      </span>
                    </div>
                  </div>

                  {/* Signature Section Preview */}
                  <div
                    className={`font-${signatureFont} font-bold whitespace-pre-wrap leading-tight`}
                    style={{
                      fontSize: `${Math.max(signatureFontSize * 0.35, 8)}px`,
                      color: signatureColor,
                      transform: "rotate(-2deg)",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                      ...getSectionStyle(sectionStyles.signature),
                      paddingTop: `${sectionStyles.signature.paddingTop * 0.35}px`,
                      paddingBottom: `${sectionStyles.signature.paddingBottom * 0.35}px`,
                      paddingLeft: `${sectionStyles.signature.paddingLeft * 0.35}px`,
                      paddingRight: `${Math.max(sectionStyles.signature.paddingRight * 0.35, 2)}px`,
                      marginTop: `${sectionStyles.signature.marginTop * 0.35}px`,
                      marginBottom: `${sectionStyles.signature.marginBottom * 0.35}px`,
                      marginLeft: `${sectionStyles.signature.marginLeft * 0.35}px`,
                      marginRight: `${sectionStyles.signature.marginRight * 0.35}px`,
                    }}
                  >
                    {signature || "Preview Signature"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SectionStyleControls: React.FC<{
    sectionName: keyof typeof sectionStyles;
    displayName: string;
    style: SectionStyle;
  }> = ({ sectionName, displayName, style }) => {
    const isExpanded = expandedSections.has(sectionName);

    return (
      <div className="border border-gray-600 rounded-lg mb-4">
        <button
          onClick={() => toggleSection(sectionName)}
          className="w-full flex justify-between items-center p-4 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-t-lg"
        >
          <h4 className="text-lg font-medium text-white">{displayName} Section</h4>
          {isExpanded ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
        </button>
        
        {isExpanded && (
          <div className="p-4 bg-[#2a2a2a] rounded-b-lg">
            <div className="grid grid-cols-2 gap-6">
              {/* Text Alignment */}
              <div>
                <label className="block text-sm font-medium mb-2">Text Alignment</label>
                <select
                  value={style.alignment}
                  onChange={(e) => updateSectionStyle(sectionName, { alignment: e.target.value as TextAlignment })}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>

              {/* Reset Section Button */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    if (window.confirm(`Reset ${displayName} section to defaults?`)) {
                      // This would need default values for each section
                      resetSectionStyles();
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded flex items-center gap-2"
                >
                  <RepeatIcon size={16} />
                  Reset Section
                </button>
              </div>
            </div>

            {/* Padding Controls */}
            <div className="mt-6">
              <h5 className="text-md font-medium mb-3 text-gray-300">Padding</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Top: {style.paddingTop}px</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={style.paddingTop}
                    onChange={(e) => updateSectionStyle(sectionName, { paddingTop: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Bottom: {style.paddingBottom}px</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={style.paddingBottom}
                    onChange={(e) => updateSectionStyle(sectionName, { paddingBottom: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Left: {style.paddingLeft}px</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={style.paddingLeft}
                    onChange={(e) => updateSectionStyle(sectionName, { paddingLeft: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Right: {style.paddingRight}px</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={style.paddingRight}
                    onChange={(e) => updateSectionStyle(sectionName, { paddingRight: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Margin Controls */}
            <div className="mt-6">
              <h5 className="text-md font-medium mb-3 text-gray-300">Margin</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Top: {style.marginTop}px</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={style.marginTop}
                    onChange={(e) => updateSectionStyle(sectionName, { marginTop: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Bottom: {style.marginBottom}px</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={style.marginBottom}
                    onChange={(e) => updateSectionStyle(sectionName, { marginBottom: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Left: {style.marginLeft}px</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={style.marginLeft}
                    onChange={(e) => updateSectionStyle(sectionName, { marginLeft: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Right: {style.marginRight}px</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={style.marginRight}
                    onChange={(e) => updateSectionStyle(sectionName, { marginRight: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className={`bg-[#2a2a2a] p-6 rounded-lg shadow-lg text-white max-h-[95vh] overflow-hidden flex transition-all duration-300 ${
        isPreviewMinimized ? 'w-[80%] max-w-5xl' : 'w-[95%] max-w-7xl'
      }`}>
        
        {/* Settings Panel - Left Side */}
        <div className="flex-1 overflow-y-auto pr-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* 1. Format Settings - Most Important */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-orange-400">Output Format Settings</h3>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to reset format settings to default values?")) {
                    setDiscordFormat(defaultDiscordFormat);
                    setImageFormat(defaultImageFormat);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded flex items-center gap-2"
                title="Reset formats to defaults"
              >
                <RepeatIcon size={16} />
                Reset Formats
              </button>
            </div>
            <div className="bg-[#3a3a3a] p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-4">
                Configure how your log will be formatted for different outputs:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Discord Format</label>
                  <select
                    value={discordFormat}
                    onChange={(e) => setDiscordFormat(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                  >
                    {Object.entries(discordFormats).map(([key, format]) => (
                      <option key={key} value={key}>{format.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">{discordFormats[discordFormat as keyof typeof discordFormats]?.description || "Format for Discord output"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image Format</label>
                  <select
                    value={imageFormat}
                    onChange={(e) => setImageFormat(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                  >
                    {Object.entries(imageFormats).map(([key, format]) => (
                      <option key={key} value={key}>{format.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">{imageFormats[imageFormat as keyof typeof imageFormats]?.description || "Format for image generation"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. General Display Options */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">General Display Options</h3>
            <div className="bg-[#3a3a3a] p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-4">Control which elements appear and when they're shown:</p>
              <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center text-white cursor-pointer hover:bg-[#4a4a4a] p-2 rounded">
                  <input
                    type="checkbox"
                    checked={enableEvents}
                    onChange={(e) => setEnableEvents(e.target.checked)}
                    className="mr-3 w-4 h-4 accent-blue-500"
                  />
                  <div>
                    <span className="font-medium">Enable Events section</span>
                    <p className="text-xs text-gray-400">When disabled, events will not appear in patrol logs</p>
                  </div>
                </label>
                
                <label className="flex items-center text-white cursor-pointer hover:bg-[#4a4a4a] p-2 rounded">
                  <input
                    type="checkbox"
                    checked={enableCrew}
                    onChange={(e) => setEnableCrew(e.target.checked)}
                    className="mr-3 w-4 h-4 accent-blue-500"
                  />
                  <div>
                    <span className="font-medium">Enable Crew section</span>
                    <p className="text-xs text-gray-400">When disabled, crew manifest will not appear in patrol logs</p>
                  </div>
                </label>

                <div className="border-t border-gray-500 mt-4 pt-4">
                  <p className="text-sm text-gray-300 mb-3">Advanced page layout options:</p>
                  
                  <label className="flex items-center text-white cursor-pointer hover:bg-[#4a4a4a] p-2 rounded mb-2">
                    <input
                      type="checkbox"
                      checked={showTitleOnFirstPage}
                      onChange={(e) => setShowTitleOnFirstPage(e.target.checked)}
                      className="mr-3 w-4 h-4 accent-blue-500"
                    />
                    <div>
                      <span className="font-medium">Show title only on first page</span>
                      <p className="text-xs text-gray-400">When disabled, title will appear on all pages</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center text-white cursor-pointer hover:bg-[#4a4a4a] p-2 rounded">
                    <input
                      type="checkbox"
                      checked={showExtrasOnLastPage}
                      onChange={(e) => setShowExtrasOnLastPage(e.target.checked)}
                      className="mr-3 w-4 h-4 accent-blue-500"
                    />
                    <div>
                      <span className="font-medium">Show crew, events & signature only on last page</span>
                      <p className="text-xs text-gray-400">When disabled, these elements will appear on all pages</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Appearance & Visual Settings */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-purple-400">Appearance & Visual Settings</h3>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to reset appearance settings to default values?")) {
                    setContentPadding(defaultSpacing.padding);
                    setContentMargin(defaultSpacing.margin);
                    setLogBackground(appearanceDefaults.logBackground);
                    setLogIcon(appearanceDefaults.logIcon);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded flex items-center gap-2"
                title="Reset appearance to defaults"
              >
                <RepeatIcon size={16} />
                Reset Appearance
              </button>
            </div>
            <div className="bg-[#3a3a3a] p-4 rounded-lg">
              {/* Visual Elements */}
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4 text-gray-300">Visual Elements</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Log Background</label>
                    <select
                      value={logBackground}
                      onChange={(e) => setLogBackground(e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                    >
                      {Object.entries(log_backgrounds).map(([key, bg]) => (
                        <option key={key} value={key}>{bg.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Ship Logo</label>
                    <select
                      value={logIcon}
                      onChange={(e) => setLogIcon(e.target.value as ShipType)}
                      className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                    >
                      {log_icons.map((icon, i) => (
                        <option value={icon.value} key={i}>{icon.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Global Spacing Controls */}
              <div className="pt-4 border-t border-gray-600">
                <h4 className="text-lg font-medium mb-4 text-gray-300">Global Layout & Spacing</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Content Padding</label>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-400 w-16">Padding:</label>
                      <input
                        type="range"
                        min={spacingConfig.padding.min}
                        max={spacingConfig.padding.max}
                        value={contentPadding}
                        onChange={(e) => setContentPadding(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-400 w-12">{contentPadding}px</span>
                    </div>
                    <p className="text-xs text-gray-500">Controls inner spacing of the writing area</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Content Margin</label>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-400 w-16">Margin:</label>
                      <input
                        type="range"
                        min={spacingConfig.margin.min}
                        max={spacingConfig.margin.max}
                        value={contentMargin}
                        onChange={(e) => setContentMargin(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-400 w-12">{contentMargin}px</span>
                    </div>
                    <p className="text-xs text-gray-500">Controls spacing between sections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Typography Settings */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-green-400">Typography Settings</h3>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to reset all fonts to their default values?")) {
                    setTitleFont(defaultFonts.title);
                    setBodyFont(defaultFonts.body);
                    setSignatureFont(defaultFonts.signature);
                    setHeaderFont(defaultFonts.headers);
                    setListFont(defaultFonts.lists);
                    setTitleFontSize(defaultFontSizes.title);
                    setBodyFontSize(defaultFontSizes.body);
                    setSignatureFontSize(defaultFontSizes.signature);
                    setHeaderFontSize(defaultFontSizes.headers);
                    setListFontSize(defaultFontSizes.lists);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded flex items-center gap-2"
                title="Reset all fonts to defaults"
              >
                <RepeatIcon size={16} />
                Reset Typography
              </button>
            </div>
            <div className="bg-[#3a3a3a] p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-4">
                Configure fonts, sizes, and colors for different text elements:
              </p>
              <div className="grid grid-cols-2 gap-6">
                {/* Title Font */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Title Font</label>
                  <select
                    value={titleFont}
                    onChange={(e) => setTitleFont(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                  >
                    {availableFonts.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-12">Size:</label>
                    <input
                      type="range"
                      min={fontSizeConfig.title.min}
                      max={fontSizeConfig.title.max}
                      value={titleFontSize}
                      onChange={(e) => setTitleFontSize(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-12">{titleFontSize}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-12">Color:</label>
                    <input
                      type="color"
                      value={titleColor}
                      onChange={(e) => setTitleColor(e.target.value)}
                      className="w-8 h-8 rounded border border-gray-600 bg-gray-700"
                    />
                    <span className="text-xs text-gray-400">{titleColor}</span>
                  </div>
                </div>

                {/* Body Font */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Body Text Font</label>
                  <select
                    value={bodyFont}
                    onChange={(e) => setBodyFont(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                  >
                    {availableFonts.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-12">Size:</label>
                    <input
                      type="range"
                      min={fontSizeConfig.body.min}
                      max={fontSizeConfig.body.max}
                      value={bodyFontSize}
                      onChange={(e) => setBodyFontSize(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-12">{bodyFontSize}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-12">Color:</label>
                    <input
                      type="color"
                      value={bodyColor}
                      onChange={(e) => setBodyColor(e.target.value)}
                      className="w-8 h-8 rounded border border-gray-600 bg-gray-700"
                    />
                    <span className="text-xs text-gray-400">{bodyColor}</span>
                  </div>
                </div>

                {/* Signature Font */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Signature Font</label>
                  <select
                    value={signatureFont}
                    onChange={(e) => setSignatureFont(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                  >
                    {availableFonts.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-12">Size:</label>
                    <input
                      type="range"
                      min={fontSizeConfig.signature.min}
                      max={fontSizeConfig.signature.max}
                      value={signatureFontSize}
                      onChange={(e) => setSignatureFontSize(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-12">{signatureFontSize}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-12">Color:</label>
                    <input
                      type="color"
                      value={signatureColor}
                      onChange={(e) => setSignatureColor(e.target.value)}
                      className="w-8 h-8 rounded border border-gray-600 bg-gray-700"
                    />
                    <span className="text-xs text-gray-400">{signatureColor}</span>
                  </div>
                </div>

                {/* Headers Font */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Headers Font</label>
                  <select
                    value={headerFont}
                    onChange={(e) => setHeaderFont(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                  >
                    {availableFonts.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-12">Size:</label>
                    <input
                      type="range"
                      min={fontSizeConfig.headers.min}
                      max={fontSizeConfig.headers.max}
                      value={headerFontSize}
                      onChange={(e) => setHeaderFontSize(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-12">{headerFontSize}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-12">Color:</label>
                    <input
                      type="color"
                      value={headerColor}
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="w-8 h-8 rounded border border-gray-600 bg-gray-700"
                    />
                    <span className="text-xs text-gray-400">{headerColor}</span>
                  </div>
                </div>

                {/* Lists Font */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Lists Font</label>
                  <select
                    value={listFont}
                    onChange={(e) => setListFont(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                  >
                    {availableFonts.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-12">Size:</label>
                    <input
                      type="range"
                      min={fontSizeConfig.lists.min}
                      max={fontSizeConfig.lists.max}
                      value={listFontSize}
                      onChange={(e) => setListFontSize(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-12">{listFontSize}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-12">Color:</label>
                    <input
                      type="color"
                      value={listColor}
                      onChange={(e) => setListColor(e.target.value)}
                      className="w-8 h-8 rounded border border-gray-600 bg-gray-700"
                    />
                    <span className="text-xs text-gray-400">{listColor}</span>
                  </div>
                </div>

                {/* Gold/Currency Settings */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Gold & Currency</label>
                  <select
                    value={goldFont}
                    onChange={(e) => setGoldFont(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-blue-500"
                  >
                    {availableFonts.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-12">Color:</label>
                    <input
                      type="color"
                      value={goldColor}
                      onChange={(e) => setGoldColor(e.target.value)}
                      className="w-8 h-8 rounded border border-gray-600 bg-gray-700"
                    />
                    <span className="text-xs text-gray-400">{goldColor}</span>
                  </div>
                  <p className="text-xs text-gray-500">Font and color for gold and doubloon values</p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Advanced Section Layout Settings */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-cyan-400">Advanced Section Layout</h3>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to reset all section layouts to default values?")) {
                    resetSectionStyles();
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded flex items-center gap-2"
                title="Reset section layouts to defaults"
              >
                <RepeatIcon size={16} />
                Reset Sections
              </button>
            </div>
            <div className="bg-[#3a3a3a] p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-4">
                Fine-tune text alignment, padding, and margins for individual sections:
              </p>
              
              <SectionStyleControls 
                sectionName="title" 
                displayName="Title" 
                style={sectionStyles.title}
              />
              <SectionStyleControls 
                sectionName="body" 
                displayName="Body Text" 
                style={sectionStyles.body}
              />
              <SectionStyleControls 
                sectionName="events" 
                displayName="Events" 
                style={sectionStyles.events}
              />
              <SectionStyleControls 
                sectionName="crew" 
                displayName="Crew" 
                style={sectionStyles.crew}
              />
              <SectionStyleControls 
                sectionName="signature" 
                displayName="Signature" 
                style={sectionStyles.signature}
              />
              <SectionStyleControls 
                sectionName="gold" 
                displayName="Gold & Currency" 
                style={sectionStyles.gold}
              />
              <SectionStyleControls 
                sectionName="dives" 
                displayName="Skirmish Dives" 
                style={sectionStyles.dives}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-600">
            <div className="flex gap-4">
              <button
                onClick={loadTestingData}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition-colors"
              >
                Load Testing Data
              </button>
              
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to reset ALL settings to their default values? This cannot be undone.")) {
                    // Reset fonts
                    setTitleFont(defaultFonts.title);
                    setBodyFont(defaultFonts.body);
                    setSignatureFont(defaultFonts.signature);
                    setHeaderFont(defaultFonts.headers);
                    setListFont(defaultFonts.lists);
                    setGoldFont(defaultFonts.lists);
                    
                    // Reset font sizes
                    setTitleFontSize(defaultFontSizes.title);
                    setBodyFontSize(defaultFontSizes.body);
                    setSignatureFontSize(defaultFontSizes.signature);
                    setHeaderFontSize(defaultFontSizes.headers);
                    setListFontSize(defaultFontSizes.lists);
                    
                    // Reset colors
                    setTitleColor("#000000");
                    setBodyColor("#000000");
                    setSignatureColor("#000000");
                    setHeaderColor("#000000");
                    setListColor("#000000");
                    setGoldColor("#000000");
                    
                    // Reset spacing
                    setContentPadding(defaultSpacing.padding);
                    setContentMargin(defaultSpacing.margin);
                    
                    // Reset appearance
                    setLogBackground(appearanceDefaults.logBackground);
                    setLogIcon(appearanceDefaults.logIcon);
                    
                    // Reset formats
                    setDiscordFormat(defaultDiscordFormat);
                    setImageFormat(defaultImageFormat);
                    
                    // Reset display options
                    setShowTitleOnFirstPage(false);
                    setShowExtrasOnLastPage(false);
                    setEnableEvents(true);
                    setEnableCrew(true);
                    
                    // Reset section styles
                    resetSectionStyles();
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2"
                title="Reset everything to defaults"
              >
                <RepeatIcon size={16} />
                Reset Everything
              </button>
            </div>

            <button
              onClick={onClose}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Close Settings
            </button>
          </div>
        </div>

        {/* Preview Panel - Right Side */}
        <div className={`flex-shrink-0 border-l border-gray-600 pl-6 transition-all duration-300 ${
          isPreviewMinimized ? 'w-20' : 'w-80'
        }`}>
          <SettingsPreview />
        </div>
      </div>
    </div>
  );
};

