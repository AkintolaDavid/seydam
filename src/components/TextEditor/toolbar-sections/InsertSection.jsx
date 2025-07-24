import React from "react";
import { SectionCreator } from "../SectionCreator";
import { ImageToolbar } from "../ImageToolbar";
import { TableCreator } from "../TableCreator";

export const InsertSection = ({ imageHandlers }) => {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {/* Section Creator */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">Sections</div>
        <SectionCreator />
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Image Tools */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">Media</div>
        <ImageToolbar
          onInsertImage={imageHandlers.handleFileSelect}
          fileInputRef={imageHandlers.fileInputRef}
          onFileInputChange={imageHandlers.handleFileInputChange}
        />
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Table Creator */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">Tables</div>
        <TableCreator />
      </div>
    </div>
  );
};
