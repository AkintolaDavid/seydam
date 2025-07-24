import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Maximize2 } from 'lucide-react';

const marginPresets = [
  { name: 'Normal', margins: { top: 2.5, bottom: 2.5, left: 3.0, right: 2.0 } },
  { name: 'Narrow', margins: { top: 1.3, bottom: 1.3, left: 1.3, right: 1.3 } },
  { name: 'Wide', margins: { top: 2.5, bottom: 2.5, left: 5.0, right: 5.0 } },
  { name: 'Moderate', margins: { top: 2.5, bottom: 2.5, left: 1.9, right: 1.9 } },
];

export const PageMarginsControl = ({
  margins,
  onMarginsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowCustom(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarginChange = (side, value) => {
    onMarginsChange({ ...margins, [side]: value });
  };

  const getCurrentPreset = () => {
    return marginPresets.find(preset => 
      preset.margins.top === margins.top &&
      preset.margins.bottom === margins.bottom &&
      preset.margins.left === margins.left &&
      preset.margins.right === margins.right
    );
  };

  const currentPreset = getCurrentPreset();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors min-w-[120px]"
        title="Page Margins"
      >
        <Maximize2 size={16} />
        <span className="text-sm">{currentPreset?.name || 'Custom'}</span>
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[280px]">
          <div className="p-2 border-b border-gray-200 text-sm font-medium text-gray-700">
            Page Margins
          </div>
          
          {!showCustom ? (
            <>
              {marginPresets.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => {
                    onMarginsChange(preset.margins);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors text-sm ${
                    currentPreset?.name === preset.name ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-gray-500">
                    T: {preset.margins.top}cm, B: {preset.margins.bottom}cm, 
                    L: {preset.margins.left}cm, R: {preset.margins.right}cm
                  </div>
                </button>
              ))}
              
              <div className="border-t border-gray-200 mt-1">
                <button
                  onClick={() => setShowCustom(true)}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors text-sm text-gray-700"
                >
                  Custom Margins...
                </button>
              </div>
            </>
          ) : (
            <div className="p-3">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Top (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={margins.top}
                    onChange={(e) => handleMarginChange('top', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bottom (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={margins.bottom}
                    onChange={(e) => handleMarginChange('bottom', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Left (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={margins.left}
                    onChange={(e) => handleMarginChange('left', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Right (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={margins.right}
                    onChange={(e) => handleMarginChange('right', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCustom(false)}
                  className="flex-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-3 py-1 text-sm bg-[#1a1a8c] text-white hover:bg-[#141466] rounded transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};