import React from "react";
import { ExportDropdown } from "../ExportDropdown";
import { HtmlViewer } from "../HtmlViewer";

export const ExportSection = ({
  editorState,
  onExportPDF,
  onExportDocx,
  isExporting,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {/* View HTML */}
      {/* <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">View</div>
        <HtmlViewer content={editorState.content} />
      </div> */}

      {/* <div className="w-px h-8 bg-gray-300" /> */}

      {/* Export Options */}
      <div className="flex items-center gap-2">
        <ExportDropdown
          onExportPDF={onExportPDF}
          onExportDocx={onExportDocx}
          isExporting={isExporting}
        />
      </div>

      {isExporting && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Generating document...</span>
        </div>
      )}
    </div>
  );
};
