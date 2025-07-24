import React, { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const fonts = [
  "Arial",
  "Times New Roman",
  "Roboto",
  "Helvetica",
  "Georgia",
  "Verdana",
  "Trebuchet MS",
  "Comic Sans MS",
  "Impact",
  "Lucida Console",
];

export const FontFamilyDropdown = ({ currentFont, onFontChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors min-w-[120px]"
        title="Font Family"
      >
        <span className="truncate text-left flex-1">{currentFont}</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[160px] max-h-60 overflow-y-auto">
          {fonts.map((font) => (
            <button
              key={font}
              onClick={() => {
                onFontChange(font);
                setIsOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors ${
                font === currentFont ? "bg-blue-100" : ""
              }`}
              style={{ fontFamily: font }}
            >
              {font}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
