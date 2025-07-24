import React, { useState, useEffect, useRef } from "react";
import { Layout, ChevronDown } from "lucide-react";

export const PageLayoutSettings = ({
  margins,
  lineSpacing,
  onMarginsChange,
  onLineSpacingChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarginChange = (side, value) => {
    onMarginsChange({ ...margins, [side]: value });
  };

  const lineSpacingOptions = [
    { value: 1.0, label: "1.0" },
    { value: 1.15, label: "1.15" },
    { value: 1.5, label: "1.5" },
    { value: 2.0, label: "2.0" },
    { value: 2.5, label: "2.5" },
    { value: 3.0, label: "3.0" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        title="Page Layout"
      >
        <Layout size={16} />
        <span>Layout</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[280px] p-4">
          <h3 className="font-semibold mb-3 text-[#1a1a8c]">Page Layout</h3>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Margins (cm)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Top</label>
                <input
                  type="number"
                  step="0.1"
                  value={margins.top}
                  onChange={(e) =>
                    handleMarginChange("top", parseFloat(e.target.value))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Bottom
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={margins.bottom}
                  onChange={(e) =>
                    handleMarginChange("bottom", parseFloat(e.target.value))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Left</label>
                <input
                  type="number"
                  step="0.1"
                  value={margins.left}
                  onChange={(e) =>
                    handleMarginChange("left", parseFloat(e.target.value))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Right
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={margins.right}
                  onChange={(e) =>
                    handleMarginChange("right", parseFloat(e.target.value))
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Line Spacing</h4>
            <select
              value={lineSpacing}
              onChange={(e) => onLineSpacingChange(parseFloat(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              {lineSpacingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
