import React from "react";
import { PageMarginsControl } from "../PageMarginsControl";
import { PaperSizeDropdown } from "../PaperSizeDropdown";
import { OrientationToggle } from "../OrientationToggle";

export const PageLayoutSection = ({
  editorState,
  onMarginsChange,
  onPaperSizeChange,
  onOrientationChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {/* Paper Size */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">Paper Size</div>
        <PaperSizeDropdown
          currentSize={editorState.paperSize}
          onSizeChange={onPaperSizeChange}
        />
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Orientation */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">
          Orientation
        </div>
        <OrientationToggle
          currentOrientation={editorState.orientation}
          onOrientationChange={onOrientationChange}
        />
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Margins */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">Margins</div>
        <PageMarginsControl
          margins={editorState.margins}
          onMarginsChange={onMarginsChange}
        />
      </div>
    </div>
  );
};
