import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, AlignJustify } from 'lucide-react';

const spacingOptions = [
  { value: 1.0, label: '1.0 - Single' },
  { value: 1.15, label: '1.15 - Default' },
  { value: 1.5, label: '1.5 - One and half' },
  { value: 2.0, label: '2.0 - Double' },
  { value: 2.5, label: '2.5' },
  { value: 3.0, label: '3.0 - Triple' },
];

export const LineSpacingDropdown = ({
  currentSpacing,
  onSpacingChange,
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

  const currentOption = spacingOptions.find(option => option.value === currentSpacing);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors min-w-[140px]"
        title="Line Spacing"
      >
        <AlignJustify size={16} />
        <span className="text-sm">{currentOption?.value || currentSpacing}</span>
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[200px]">
          <div className="p-2 border-b border-gray-200 text-sm font-medium text-gray-700">
            Line Spacing
          </div>
          {spacingOptions.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onSpacingChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors text-sm ${
                option.value === currentSpacing ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};