import React, { useState, useEffect, useRef } from 'react';
import { Type, ChevronDown, Settings, Plus, Trash2, Bold, Italic, Underline } from 'lucide-react';

export const HeadingStylesDropdown = ({
  headingStyles,
  onStyleUpdate,
  onApplyStyle,
  onAddCustomStyle,
  onDeleteStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [newStyle, setNewStyle] = useState({
    name: 'Custom Style',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#1a1a8c',
    alignment: 'left',
    bold: true,
    italic: false,
    underline: false,
  });
  
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setEditingStyle(null);
        setShowAddCustom(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Quick apply styles (most commonly used)
  const quickStyles = [
    { 
      id: 'normal', 
      name: 'Normal Text', 
      fontSize: 12, 
      fontFamily: 'Arial', 
      fontWeight: 'normal', 
      color: '#000000',
      alignment: 'left',
      bold: false,
      italic: false,
      underline: false,
    },
    ...headingStyles.slice(0, 3) // Show first 3 heading styles
  ];

  const handleQuickApply = (styleId) => {
    if (styleId === 'normal') {
      // Apply normal text formatting
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        document.execCommand('fontSize', false, '12');
        document.execCommand('fontName', false, 'Arial');
        document.execCommand('bold', false, 'false');
        document.execCommand('italic', false, 'false');
        document.execCommand('underline', false, 'false');
        document.execCommand('foreColor', false, '#000000');
        document.execCommand('justifyLeft');
      }
    } else {
      onApplyStyle(styleId);
    }
    setIsOpen(false);
  };

  const handleAddCustomStyle = () => {
    if (onAddCustomStyle) {
      onAddCustomStyle(newStyle);
      setShowAddCustom(false);
      setNewStyle({
        name: 'Custom Style',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: '#1a1a8c',
        alignment: 'left',
        bold: true,
        italic: false,
        underline: false,
      });
    }
  };

  const updateNewStyleProperty = (property, value) => {
    setNewStyle(prev => ({ ...prev, [property]: value }));
  };

  const updateStyleProperty = (styleId, property, value) => {
    onStyleUpdate(styleId, { [property]: value });
  };

  const getPreviewStyle = (style) => ({
    fontSize: `${Math.min(style.fontSize, 18)}px`,
    fontFamily: style.fontFamily,
    fontWeight: style.bold ? 'bold' : style.fontWeight,
    fontStyle: style.italic ? 'italic' : 'normal',
    textDecoration: style.underline ? 'underline' : 'none',
    color: style.color,
    textAlign: style.alignment,
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors min-w-[140px]"
        title="Heading Styles"
      >
        <Type size={16} />
        <span className="text-sm">Styles</span>
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[400px] max-h-[600px] overflow-y-auto">
          {/* Quick Styles Section */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Styles</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => handleQuickApply(style.id)}
                  className="p-3 text-left border border-gray-200 rounded hover:border-[#1a1a8c] hover:bg-blue-50 transition-colors"
                  style={getPreviewStyle(style)}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* All Heading Styles */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">All Heading Styles</h3>
              <span className="text-xs text-gray-500">Click to apply • Gear to edit</span>
            </div>
            
            {headingStyles.map(style => (
              <div key={style.id} className="mb-3 p-3 border border-gray-200 rounded hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => {
                      onApplyStyle(style.id);
                      setIsOpen(false);
                    }}
                    className="flex-1 text-left hover:text-[#1a1a8c] transition-colors"
                    style={getPreviewStyle(style)}
                  >
                    {style.name}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingStyle(editingStyle === style.id ? null : style.id)}
                      className="p-1 text-gray-500 hover:text-[#1a1a8c] transition-colors"
                      title="Edit style"
                    >
                      <Settings size={14} />
                    </button>
                    {onDeleteStyle && !style.id.startsWith('h') && (
                      <button
                        onClick={() => onDeleteStyle(style.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete custom style"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                
                {editingStyle === style.id && (
                  <div className="space-y-3 pt-3 border-t border-gray-200">
                    {/* Style Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Style Name</label>
                      <input
                        type="text"
                        value={style.name}
                        onChange={(e) => updateStyleProperty(style.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                        placeholder="Style name"
                      />
                    </div>
                    
                    {/* Font Settings */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                        <input
                          type="number"
                          min="8"
                          max="72"
                          value={style.fontSize}
                          onChange={(e) => updateStyleProperty(style.id, 'fontSize', parseInt(e.target.value) || 12)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
                        <select
                          value={style.fontFamily}
                          onChange={(e) => updateStyleProperty(style.id, 'fontFamily', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Verdana">Verdana</option>
                          <option value="Trebuchet MS">Trebuchet MS</option>
                          <option value="Courier New">Courier New</option>
                          <option value="Comic Sans MS">Comic Sans MS</option>
                        </select>
                      </div>
                    </div>

                    {/* Text Formatting */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Text Formatting</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStyleProperty(style.id, 'bold', !style.bold)}
                          className={`p-2 border rounded transition-colors ${
                            style.bold ? 'bg-[#1a1a8c] text-white border-[#1a1a8c]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                          title="Bold"
                        >
                          <Bold size={14} />
                        </button>
                        <button
                          onClick={() => updateStyleProperty(style.id, 'italic', !style.italic)}
                          className={`p-2 border rounded transition-colors ${
                            style.italic ? 'bg-[#1a1a8c] text-white border-[#1a1a8c]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                          title="Italic"
                        >
                          <Italic size={14} />
                        </button>
                        <button
                          onClick={() => updateStyleProperty(style.id, 'underline', !style.underline)}
                          className={`p-2 border rounded transition-colors ${
                            style.underline ? 'bg-[#1a1a8c] text-white border-[#1a1a8c]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                          title="Underline"
                        >
                          <Underline size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Color and Alignment */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
                        <input
                          type="color"
                          value={style.color}
                          onChange={(e) => updateStyleProperty(style.id, 'color', e.target.value)}
                          className="w-full h-10 border border-gray-300 rounded focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Text Alignment</label>
                        <select
                          value={style.alignment}
                          onChange={(e) => updateStyleProperty(style.id, 'alignment', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                          <option value="justify">Justify</option>
                        </select>
                      </div>
                    </div>

                    {/* Preview */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Preview</label>
                      <div 
                        className="p-3 border border-gray-200 rounded bg-gray-50"
                        style={getPreviewStyle(style)}
                      >
                        {style.name} - Sample text preview
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Custom Style */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Custom Styles</h3>
              {onAddCustomStyle && (
                <button
                  onClick={() => setShowAddCustom(!showAddCustom)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-[#1a1a8c] text-white rounded hover:bg-[#141466] transition-colors"
                >
                  <Plus size={14} />
                  Add Custom
                </button>
              )}
            </div>

            {showAddCustom && (
              <div className="space-y-3 p-3 border border-gray-200 rounded bg-gray-50">
                {/* Style Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Style Name</label>
                  <input
                    type="text"
                    value={newStyle.name}
                    onChange={(e) => updateNewStyleProperty('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                    placeholder="Custom style name"
                  />
                </div>
                
                {/* Font Settings */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                    <input
                      type="number"
                      min="8"
                      max="72"
                      value={newStyle.fontSize}
                      onChange={(e) => updateNewStyleProperty('fontSize', parseInt(e.target.value) || 12)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
                    <select
                      value={newStyle.fontFamily}
                      onChange={(e) => updateNewStyleProperty('fontFamily', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Trebuchet MS">Trebuchet MS</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Comic Sans MS">Comic Sans MS</option>
                    </select>
                  </div>
                </div>

                {/* Text Formatting */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Text Formatting</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateNewStyleProperty('bold', !newStyle.bold)}
                      className={`p-2 border rounded transition-colors ${
                        newStyle.bold ? 'bg-[#1a1a8c] text-white border-[#1a1a8c]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      title="Bold"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      onClick={() => updateNewStyleProperty('italic', !newStyle.italic)}
                      className={`p-2 border rounded transition-colors ${
                        newStyle.italic ? 'bg-[#1a1a8c] text-white border-[#1a1a8c]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      title="Italic"
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      onClick={() => updateNewStyleProperty('underline', !newStyle.underline)}
                      className={`p-2 border rounded transition-colors ${
                        newStyle.underline ? 'bg-[#1a1a8c] text-white border-[#1a1a8c]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      title="Underline"
                    >
                      <Underline size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Color and Alignment */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
                    <input
                      type="color"
                      value={newStyle.color}
                      onChange={(e) => updateNewStyleProperty('color', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Text Alignment</label>
                    <select
                      value={newStyle.alignment}
                      onChange={(e) => updateNewStyleProperty('alignment', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Preview</label>
                  <div 
                    className="p-3 border border-gray-200 rounded bg-white"
                    style={getPreviewStyle(newStyle)}
                  >
                    {newStyle.name} - Sample text preview
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleAddCustomStyle}
                    className="flex-1 px-3 py-2 bg-[#1a1a8c] text-white rounded hover:bg-[#141466] transition-colors text-sm font-medium"
                  >
                    Add Style
                  </button>
                  <button
                    onClick={() => setShowAddCustom(false)}
                    className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Usage Tips */}
          <div className="p-4 bg-blue-50">
            <p className="text-xs text-blue-800 font-medium mb-2">💡 Usage Tips:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Select text and click a style to apply formatting</li>
              <li>• Click without selection to start typing with that style</li>
              <li>• Use H1-H6 for document structure and AI editing</li>
              <li>• Headings appear automatically in the navigation panel</li>
              <li>• Custom styles can be edited and deleted</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};