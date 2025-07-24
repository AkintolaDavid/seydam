import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

export const FontSizeDropdown = ({
  currentSize,
  onSizeChange,
}) => {
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
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        title="Font Size"
      >
        <span className="min-w-[2rem] text-left">{currentSize}</span>
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-48 overflow-y-auto">
          {fontSizes.map(size => (
            <button
              key={size}
              onClick={() => {
                onSizeChange(size);
                setIsOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left hover:bg-blue-50 ${
                size === currentSize ? 'bg-blue-100' : ''
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};