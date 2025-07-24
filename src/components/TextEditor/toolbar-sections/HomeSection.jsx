import React from 'react';
import { Bold, Italic, Underline, ChevronDown } from 'lucide-react';
import { FontSizeDropdown } from '../FontSizeDropdown';
import { FontFamilyDropdown } from '../FontFamilyDropdown';
import { AlignmentControls } from '../AlignmentControls';
import { ListControls } from '../ListControls';
import { LineSpacingDropdown } from '../LineSpacingDropdown';
import { HeadingStylesDropdown } from '../HeadingStylesDropdown';

export const HomeSection = ({
  editorState,
  onCommand,
  onLineSpacingChange,
  onListToggle,
  onIndent,
  onOutdent,
  getCurrentListType,
  onHeadingStyleUpdate,
  addCustomHeadingStyle,
  deleteHeadingStyle,
}) => {
  const handleFontSizeChange = (size) => {
    onCommand('fontSize', size.toString());
  };

  const handleFontFamilyChange = (font) => {
    onCommand('fontName', font);
  };

  const handleAlignmentChange = (alignment) => {
    const commands = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight',
      justify: 'justifyFull',
    };
    onCommand(commands[alignment]);
  };

  const handleApplyHeadingStyle = (styleId) => {
    const style = editorState.headingStyles.find(s => s.id === styleId);
    if (!style) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Determine heading level from style ID
      let headingLevel = 1;
      if (styleId.startsWith('h') && styleId.length === 2) {
        headingLevel = parseInt(styleId.charAt(1)) || 1;
      } else {
        // For custom styles, default to H2
        headingLevel = 2;
      }
      
      if (!range.collapsed) {
        // Wrap selected text in heading element
        try {
          const headingTag = `h${headingLevel}`;
          const heading = document.createElement(headingTag);
          
          // Apply all style properties
          heading.style.fontSize = `${style.fontSize}px`;
          heading.style.fontFamily = style.fontFamily;
          heading.style.fontWeight = style.bold ? 'bold' : style.fontWeight;
          heading.style.fontStyle = style.italic ? 'italic' : 'normal';
          heading.style.textDecoration = style.underline ? 'underline' : 'none';
          heading.style.color = style.color;
          heading.style.textAlign = style.alignment;
          heading.id = `heading-${headingLevel}-${Date.now()}`;
          heading.setAttribute('data-heading-style', styleId);
          
          // Extract and wrap content
          const contents = range.extractContents();
          heading.appendChild(contents);
          range.insertNode(heading);
          
          // Select the new heading
          range.selectNodeContents(heading);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (e) {
          console.warn('Could not create heading element:', e);
          // Fallback: apply formatting without creating heading element
          applyStyleFormatting(style);
        }
      } else {
        // No selection, insert a new heading at cursor position
        const headingTag = `h${headingLevel}`;
        const heading = document.createElement(headingTag);
        
        // Apply all style properties
        heading.style.fontSize = `${style.fontSize}px`;
        heading.style.fontFamily = style.fontFamily;
        heading.style.fontWeight = style.bold ? 'bold' : style.fontWeight;
        heading.style.fontStyle = style.italic ? 'italic' : 'normal';
        heading.style.textDecoration = style.underline ? 'underline' : 'none';
        heading.style.color = style.color;
        heading.style.textAlign = style.alignment;
        heading.id = `heading-${headingLevel}-${Date.now()}`;
        heading.setAttribute('data-heading-style', styleId);
        heading.textContent = style.name;
        
        range.insertNode(heading);
        
        // Position cursor inside the heading
        range.selectNodeContents(heading);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      // No selection available, just apply formatting
      applyStyleFormatting(style);
    }
  };

  const applyStyleFormatting = (style) => {
    // Apply individual formatting commands
    onCommand('fontSize', style.fontSize.toString());
    onCommand('fontName', style.fontFamily);
    onCommand('bold', style.bold ? 'true' : 'false');
    onCommand('italic', style.italic ? 'true' : 'false');
    onCommand('underline', style.underline ? 'true' : 'false');
    onCommand('foreColor', style.color);
    
    // Apply alignment
    const alignmentCommands = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight',
      justify: 'justifyFull',
    };
    onCommand(alignmentCommands[style.alignment]);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Heading Styles */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">Styles</div>
        <HeadingStylesDropdown
          headingStyles={editorState.headingStyles}
          onStyleUpdate={onHeadingStyleUpdate}
          onApplyStyle={handleApplyHeadingStyle}
          onAddCustomStyle={addCustomHeadingStyle}
          onDeleteStyle={deleteHeadingStyle}
        />
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Font Controls */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">Font</div>
        <FontFamilyDropdown
          currentFont={editorState.currentFormat.fontFamily}
          onFontChange={handleFontFamilyChange}
        />
        <FontSizeDropdown
          currentSize={editorState.currentFormat.fontSize}
          onSizeChange={handleFontSizeChange}
        />
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <div className="text-sm font-medium text-gray-700 mr-2">Format</div>
        <div className="flex border border-gray-300 rounded">
          <button
            onClick={() => onCommand('bold')}
            className={`p-2 border-r border-gray-300 hover:bg-blue-50 transition-colors ${
              editorState.currentFormat.bold ? 'bg-blue-100' : 'bg-white'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => onCommand('italic')}
            className={`p-2 border-r border-gray-300 hover:bg-blue-50 transition-colors ${
              editorState.currentFormat.italic ? 'bg-blue-100' : 'bg-white'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => onCommand('underline')}
            className={`p-2 hover:bg-blue-50 transition-colors ${
              editorState.currentFormat.underline ? 'bg-blue-100' : 'bg-white'
            }`}
            title="Underline (Ctrl+U)"
          >
            <Underline size={16} />
          </button>
        </div>
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Alignment */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">Align</div>
        <div className="border border-gray-300 rounded">
          <AlignmentControls
            currentAlignment={editorState.currentFormat.alignment}
            onAlignmentChange={handleAlignmentChange}
          />
        </div>
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Lists and Indentation */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">Lists</div>
        <div className="border border-gray-300 rounded">
          <ListControls
            onListToggle={onListToggle}
            onIndent={onIndent}
            onOutdent={onOutdent}
            currentListType={getCurrentListType()}
          />
        </div>
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Line Spacing */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">Spacing</div>
        <LineSpacingDropdown
          currentSpacing={editorState.lineSpacing}
          onSpacingChange={onLineSpacingChange}
        />
      </div>
    </div>
  );
};