import React, { useState, useRef, useEffect } from "react";
import { Download, FileText, File, ChevronDown } from "lucide-react";

export const ExportDropdown = ({ onExportPDF, onExportDocx, isExporting }) => {
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

  const handleExportPDF = () => {
    onExportPDF();
    setIsOpen(false);
  };

  const handleExportDocx = () => {
    onExportDocx();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-2 bg-[#1a1a8c] text-white rounded hover:bg-[#141466] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export Document"
      >
        <Download size={16} />
        <span>Export</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[180px]">
          <div className="p-2 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-700">
              Export Options
            </div>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={16} className="text-red-600" />
            <div>
              <div className="font-medium text-gray-900">Export as PDF</div>
              <div className="text-xs text-gray-500">
                Portable Document Format
              </div>
            </div>
          </button>

          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <File size={16} className="text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">Export as DOCX</div>
              <div className="text-xs text-gray-500">
                Microsoft Word Document
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
