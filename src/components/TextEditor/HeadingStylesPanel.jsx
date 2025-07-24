import React, { useState, useEffect, useRef } from "react";
import { Settings, ChevronDown } from "lucide-react";

export const HeadingStylesPanel = ({
  headingStyles,
  onStyleUpdate,
  onApplyStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setEditingStyle(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        title="Heading Styles"
      >
        <Settings size={16} />
        <span>Styles</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[350px] p-4">
          <h3 className="font-semibold mb-3 text-[#1a1a8c]">Heading Styles</h3>

          {headingStyles.map((style) => (
            <div
              key={style.id}
              className="mb-4 p-3 border border-gray-200 rounded"
            >
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => onApplyStyle(style.id)}
                  className="text-left hover:text-[#1a1a8c] transition-colors"
                  style={{
                    fontSize: `${Math.min(style.fontSize, 18)}px`,
                    fontFamily: style.fontFamily,
                    fontWeight: style.fontWeight,
                    color: style.color,
                    textAlign: style.alignment,
                  }}
                >
                  {style.name}
                </button>
                <button
                  onClick={() =>
                    setEditingStyle(editingStyle === style.id ? null : style.id)
                  }
                  className="text-gray-500 hover:text-[#1a1a8c] transition-colors"
                >
                  <Settings size={14} />
                </button>
              </div>

              {editingStyle === style.id && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={style.name}
                    onChange={(e) =>
                      onStyleUpdate(style.id, { name: e.target.value })
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Style name"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Font Size
                      </label>
                      <input
                        type="number"
                        value={style.fontSize}
                        onChange={(e) =>
                          onStyleUpdate(style.id, {
                            fontSize: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Font size"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Font Family
                      </label>
                      <select
                        value={style.fontFamily}
                        onChange={(e) =>
                          onStyleUpdate(style.id, {
                            fontFamily: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Trebuchet MS">Trebuchet MS</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Font Weight
                      </label>
                      <select
                        value={style.fontWeight}
                        onChange={(e) =>
                          onStyleUpdate(style.id, {
                            fontWeight: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="300">Light</option>
                        <option value="600">Semi Bold</option>
                        <option value="700">Bold</option>
                        <option value="800">Extra Bold</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        value={style.color}
                        onChange={(e) =>
                          onStyleUpdate(style.id, { color: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm h-8"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Text Alignment
                    </label>
                    <select
                      value={style.alignment}
                      onChange={(e) =>
                        onStyleUpdate(style.id, { alignment: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
