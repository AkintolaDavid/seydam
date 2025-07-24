import React, { useState, useRef, useEffect } from 'react';
import { List, ListOrdered, Indent, Outdent, ChevronDown } from 'lucide-react';

const bulletStyles = [
  { value: 'disc', label: '● Solid Circle', symbol: '●' },
  { value: 'circle', label: '○ Hollow Circle', symbol: '○' },
  { value: 'square', label: '■ Square', symbol: '■' },
  { value: 'arrow', label: '➤ Arrow', symbol: '➤' },
  { value: 'checkmark', label: '✓ Checkmark', symbol: '✓' },
];

const numberStyles = [
  { value: 'decimal', label: '1., 2., 3.', example: '1.' },
  { value: 'lower-alpha', label: 'a., b., c.', example: 'a.' },
  { value: 'upper-alpha', label: 'A., B., C.', example: 'A.' },
  { value: 'lower-roman', label: 'i., ii., iii.', example: 'i.' },
  { value: 'upper-roman', label: 'I., II., III.', example: 'I.' },
];

export const ListControls = ({
  onListToggle,
  onIndent,
  onOutdent,
  currentListType,
}) => {
  const [bulletDropdownOpen, setBulletDropdownOpen] = useState(false);
  const [numberDropdownOpen, setNumberDropdownOpen] = useState(false);
  const [selectedBulletStyle, setSelectedBulletStyle] = useState('disc');
  const [selectedNumberStyle, setSelectedNumberStyle] = useState('decimal');
  
  const bulletDropdownRef = useRef(null);
  const numberDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bulletDropdownRef.current && !bulletDropdownRef.current.contains(event.target)) {
        setBulletDropdownOpen(false);
      }
      if (numberDropdownRef.current && !numberDropdownRef.current.contains(event.target)) {
        setNumberDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBulletClick = () => {
    onListToggle('bullet', selectedBulletStyle);
  };

  const handleNumberClick = () => {
    onListToggle('numbered', selectedNumberStyle);
  };

  const handleBulletStyleSelect = (style) => {
    setSelectedBulletStyle(style);
    onListToggle('bullet', style);
    setBulletDropdownOpen(false);
  };

  const handleNumberStyleSelect = (style) => {
    setSelectedNumberStyle(style);
    onListToggle('numbered', style);
    setNumberDropdownOpen(false);
  };

  return (
    <div className="flex">
      {/* Bullet List with Dropdown */}
      <div className="relative flex" ref={bulletDropdownRef}>
        <button
          onClick={handleBulletClick}
          className={`p-2 bg-white border-r border-gray-300 hover:bg-blue-50 transition-colors ${
            currentListType === 'bullet' ? 'bg-blue-100' : ''
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => setBulletDropdownOpen(!bulletDropdownOpen)}
          className="p-1 bg-white border-r border-gray-300 hover:bg-blue-50 transition-colors"
          title="Bullet Style Options"
        >
          <ChevronDown size={12} />
        </button>
        
        {bulletDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[200px]">
            <div className="p-2 border-b border-gray-200 text-sm font-medium text-gray-700">
              Bullet Styles
            </div>
            {bulletStyles.map(style => (
              <button
                key={style.value}
                onClick={() => handleBulletStyleSelect(style.value)}
                className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                  selectedBulletStyle === style.value ? 'bg-blue-100' : ''
                }`}
              >
                <span className="text-lg">{style.symbol}</span>
                <span className="text-sm">{style.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Numbered List with Dropdown */}
      <div className="relative flex" ref={numberDropdownRef}>
        <button
          onClick={handleNumberClick}
          className={`p-2 bg-white border-r border-gray-300 hover:bg-blue-50 transition-colors ${
            currentListType === 'numbered' ? 'bg-blue-100' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() => setNumberDropdownOpen(!numberDropdownOpen)}
          className="p-1 bg-white border-r border-gray-300 hover:bg-blue-50 transition-colors"
          title="Number Style Options"
        >
          <ChevronDown size={12} />
        </button>
        
        {numberDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[200px]">
            <div className="p-2 border-b border-gray-200 text-sm font-medium text-gray-700">
              Number Styles
            </div>
            {numberStyles.map(style => (
              <button
                key={style.value}
                onClick={() => handleNumberStyleSelect(style.value)}
                className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                  selectedNumberStyle === style.value ? 'bg-blue-100' : ''
                }`}
              >
                <span className="text-lg font-mono">{style.example}</span>
                <span className="text-sm">{style.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Indent/Outdent Controls */}
      <button
        onClick={onOutdent}
        className="p-2 bg-white border-r border-gray-300 hover:bg-blue-50 transition-colors"
        title="Decrease Indent"
      >
        <Outdent size={16} />
      </button>
      <button
        onClick={onIndent}
        className="p-2 bg-white hover:bg-blue-50 transition-colors"
        title="Increase Indent"
      >
        <Indent size={16} />
      </button>
    </div>
  );
};