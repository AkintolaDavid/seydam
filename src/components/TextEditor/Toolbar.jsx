import React from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { FontSizeDropdown } from "./FontSizeDropdown";
import { FontFamilyDropdown } from "./FontFamilyDropdown";
import { AlignmentControls } from "./AlignmentControls";
import { ListControls } from "./ListControls";
import { HeadingStylesPanel } from "./HeadingStylesPanel";
import { PageLayoutSettings } from "./PageLayoutSettings";
import { JsonImporter } from "./JsonImporter";
import { HtmlViewer } from "./HtmlViewer";
import { ExportDropdown } from "./ExportDropdown";
import { ImageToolbar } from "./ImageToolbar";
import { UndoRedoControls } from "./UndoRedoControls";

export const Toolbar = ({
  editorState,
  onCommand,
  onHeadingStyleUpdate,
  onMarginsChange,
  onLineSpacingChange,
  onExportPDF,
  onExportDocx,
  onJsonImport,
  onListToggle,
  onIndent,
  onOutdent,
  getCurrentListType,
  isExporting,
  imageHandlers,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  undoCount,
  redoCount,
  getRecentHistory,
}) => {
  const handleFontSizeChange = (size) => {
    onCommand("fontSize", size.toString());
  };

  const handleFontFamilyChange = (font) => {
    onCommand("fontName", font);
  };

  const handleAlignmentChange = (alignment) => {
    const commands = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
      justify: "justifyFull",
    };
    onCommand(commands[alignment]);
  };

  const handleApplyStyle = (styleId) => {
    const style = editorState.headingStyles.find((s) => s.id === styleId);
    if (style) {
      onCommand("fontSize", style.fontSize.toString());
      onCommand("fontName", style.fontFamily);
      onCommand("bold", style.fontWeight === "bold" ? "true" : "false");
      onCommand("foreColor", style.color);

      // Apply alignment
      const alignmentCommands = {
        left: "justifyLeft",
        center: "justifyCenter",
        right: "justifyRight",
        justify: "justifyFull",
      };
      onCommand(alignmentCommands[style.alignment]);
    }
  };

  return (
    <div className="bg-white border-b border-gray-300 p-2 flex flex-wrap items-center gap-2">
      {/* Undo/Redo Controls */}
      <div className="border border-gray-300 rounded">
        <UndoRedoControls
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          undoCount={undoCount}
          redoCount={redoCount}
          getRecentHistory={getRecentHistory}
        />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* File Operations */}
      <JsonImporter onImport={onJsonImport} />

      <HtmlViewer content={editorState.content} />

      <ExportDropdown
        onExportPDF={onExportPDF}
        onExportDocx={onExportDocx}
        isExporting={isExporting}
      />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Font Controls */}
      <FontFamilyDropdown
        currentFont={editorState.currentFormat.fontFamily}
        onFontChange={handleFontFamilyChange}
      />

      <FontSizeDropdown
        currentSize={editorState.currentFormat.fontSize}
        onSizeChange={handleFontSizeChange}
      />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Text Formatting */}
      <div className="flex border border-gray-300 rounded">
        <button
          onClick={() => onCommand("bold")}
          className={`p-2 border-r border-gray-300 hover:bg-blue-50 transition-colors ${
            editorState.currentFormat.bold ? "bg-blue-100" : "bg-white"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => onCommand("italic")}
          className={`p-2 border-r border-gray-300 hover:bg-blue-50 transition-colors ${
            editorState.currentFormat.italic ? "bg-blue-100" : "bg-white"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => onCommand("underline")}
          className={`p-2 hover:bg-blue-50 transition-colors ${
            editorState.currentFormat.underline ? "bg-blue-100" : "bg-white"
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Alignment */}
      <div className="border border-gray-300 rounded">
        <AlignmentControls
          currentAlignment={editorState.currentFormat.alignment}
          onAlignmentChange={handleAlignmentChange}
        />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Lists */}
      <div className="border border-gray-300 rounded">
        <ListControls
          onListToggle={onListToggle}
          onIndent={onIndent}
          onOutdent={onOutdent}
          currentListType={getCurrentListType()}
        />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Image Tools */}
      <ImageToolbar
        onInsertImage={imageHandlers.handleFileSelect}
        fileInputRef={imageHandlers.fileInputRef}
        onFileInputChange={imageHandlers.handleFileInputChange}
      />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Styles */}
      <HeadingStylesPanel
        headingStyles={editorState.headingStyles}
        onStyleUpdate={onHeadingStyleUpdate}
        onApplyStyle={handleApplyStyle}
      />

      <div className="flex-1" />

      {/* Page Layout */}
      <PageLayoutSettings
        margins={editorState.margins}
        lineSpacing={editorState.lineSpacing}
        onMarginsChange={onMarginsChange}
        onLineSpacingChange={onLineSpacingChange}
      />
    </div>
  );
};
