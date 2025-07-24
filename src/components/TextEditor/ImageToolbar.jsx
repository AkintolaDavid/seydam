import React from "react";
import { ImagePlus } from "lucide-react";

export const ImageToolbar = ({
  onInsertImage,
  fileInputRef,
  onFileInputChange,
}) => {
  return (
    <>
      <button
        onClick={onInsertImage}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        title="Insert Image"
      >
        <ImagePlus size={16} />
        <span>Image</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
      />
    </>
  );
};
