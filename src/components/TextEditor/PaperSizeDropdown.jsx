import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, FileText } from 'lucide-react';

const paperSizes = [
  { value: 'A1', label: 'A1 (59.4 × 84.1 cm)', width: 59.4, height: 84.1 },
  { value: 'A2', label: 'A2 (42.0 × 59.4 cm)', width: 42.0, height: 59.4 },
  { value: 'A3', label: 'A3 (29.7 × 42.0 cm)', width: 29.7, height: 42.0 },
  { value: 'A4', label: 'A4 (21.0 × 29.7 cm)', width: 21.0, height: 29.7 },
  { value: 'A5', label: 'A5 (14.8 × 21.0 cm)', width: 14.8, height: 21.0 },
  { value: 'Letter', label: 'Letter (21.6 × 27.9 cm)', width: 21.6, height: 27.9 },
  { value: 'Legal', label: 'Legal (21.6 × 35.6 cm)', width: 21.6, height: 35.6 },
];

export const PaperSizeDropdown = ({
  currentSize,
  onSizeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentPaper = paperSizes.find(size => size.value === currentSize);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors min-w-[120px]"
        title="Paper Size"
      >
        <FileText size={16} />
        <span className="text-sm">{currentPaper?.value || currentSize}</span>
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[250px]">
          <div className="p-2 border-b border-gray-200 text-sm font-medium text-gray-700">
            Paper Size
          </div>
          {paperSizes.map(size => (
            <button
              key={size.value}
              onClick={() => {
                onSizeChange(size.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors text-sm ${
                size.value === currentSize ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
              }`}
            >
              <div className="font-medium">{size.value}</div>
              <div className="text-xs text-gray-500">{size.width} × {size.height} cm</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};