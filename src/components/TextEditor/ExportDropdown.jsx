import React, { useState, useRef, useEffect } from "react";
import pdfIcon from "../../assets/download/pdf.png";
import docxIcon from "../../assets/download/docs.png";

export const ExportDropdown = ({ onExportPDF, onExportDocx, isExporting }) => {
  const [isOpen, setIsOpen] = useState(true);
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
      <div className="mt-1 bg-white border border-gray-200 rounded-lg z-50 flex overflow-hidden">
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex-1 flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group border-r border-gray-100"
        >
          <div className="w-8 h-8 rounded-lg bg-red-100  group-hover:bg-red-200 transition-colors">
            <img
              src={pdfIcon}
              alt="PDF"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">
              Export as PDF
            </div>
            <div className="text-xs text-gray-500">
              Portable Document Format
            </div>
          </div>
        </button>

        <button
          onClick={handleExportDocx}
          disabled={isExporting}
          className="flex-1 flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100  group-hover:bg-blue-200 transition-colors">
            <img
              src={docxIcon}
              alt="DOCX"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">
              Export as DOCX
            </div>
            <div className="text-xs text-gray-500">Microsoft Word Document</div>
          </div>
        </button>
      </div>
    </div>
  );
};
