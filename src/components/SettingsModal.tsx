import React from "react";
import { useLog } from "../context/LogContext";
import { log_backgrounds } from "../config/log_background";
import { log_icons } from "../config/log_icons";
import { availableFonts, defaultFonts } from "../config/fonts";
import { fontSizeConfig, defaultFontSizes } from "../config/fontSizes";
import { spacingConfig, defaultSpacing } from "../config/spacing";
import { appearanceDefaults } from "../config/appearance";
import { discordFormats, imageFormats, defaultDiscordFormat, defaultImageFormat } from "../config/formats";
import { RepeatIcon } from "lucide-react";

export const SettingsModal: React.FC = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    titleFont,
    bodyFont,
    signatureFont,
    headerFont,
    listFont,
    logBackground,
    setLogBackground,
    setTitleFont,
    setBodyFont,
    setSignatureFont,
    setHeaderFont,
    setListFont,
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
  } = useLog();

  const onClose = () => setIsModalOpen(false);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg w-2/3 max-w-4xl text-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Display Options</h3>
          <div className="bg-[#3a3a3a] p-4 rounded-lg">
            <p className="text-sm text-gray-300 mb-3">Control when elements appear in your log:</p>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex items-center text-white cursor-pointer hover:bg-[#4a4a4a] p-2 rounded">
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
            </div>
          </div>
        </div>

        {/* Font Settings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-green-400">Font Settings</h3>
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
              Reset Fonts
            </button>
          </div>
          <div className="bg-[#3a3a3a] p-4 rounded-lg">
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
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-purple-400">Appearance Settings</h3>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset appearance settings to default values?")) {
                  setContentPadding(defaultSpacing.padding);
                  setContentMargin(defaultSpacing.margin);
                  setLogBackground(appearanceDefaults.logBackground);
                  setLogIcon(appearanceDefaults.logIcon);
                  setDiscordFormat(defaultDiscordFormat);
                  setImageFormat(defaultImageFormat);
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
            {/* Visual Settings */}
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
              
              {/* Format Settings */}
              <div className="grid grid-cols-2 gap-4 mt-4">
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
                  <p className="text-xs text-gray-500 mt-1">Format for image generation</p>
                </div>
              </div>
            </div>

            {/* Spacing Controls */}
            <div className="pt-4 border-t border-gray-600">
              <h4 className="text-lg font-medium mb-4 text-gray-300">Layout & Spacing</h4>
              <div className="grid grid-cols-2 gap-6">
                {/* Content Padding */}
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

                {/* Content Margin */}
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
                  
                  // Reset font sizes
                  setTitleFontSize(defaultFontSizes.title);
                  setBodyFontSize(defaultFontSizes.body);
                  setSignatureFontSize(defaultFontSizes.signature);
                  setHeaderFontSize(defaultFontSizes.headers);
                  setListFontSize(defaultFontSizes.lists);
                  
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
    </div>
  );
};

