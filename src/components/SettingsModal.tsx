interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleFont: string;
  bodyFont: string;
  onTitleFontChange: (font: string) => void;
  onBodyFontChange: (font: string) => void;
  onLoadTestingData: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  titleFont,
  bodyFont,
  onTitleFontChange,
  onBodyFontChange,
  onLoadTestingData,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg w-1/3 text-white">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title Font</label>
            <select
              value={titleFont}
              onChange={(e) => onTitleFontChange(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            >
              <option value="Satisfy">Satisfy</option>
              <option value="Dancing_Script">Dancing Script</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Log Entry Font
            </label>
            <select
              value={bodyFont}
              onChange={(e) => onBodyFontChange(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            >
              <option value="Satisfy">Satisfy</option>
              <option value="Indie_Flower">Indie Flower</option>
              <option value="Dancing_Script">Dancing Script</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={onLoadTestingData}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
          >
            Load Testing Data
          </button>

          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
