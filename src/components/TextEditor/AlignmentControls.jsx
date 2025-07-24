import React from "react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

export const AlignmentControls = ({ currentAlignment, onAlignmentChange }) => {
  const alignments = [
    { type: "left", icon: AlignLeft, title: "Align Left" },
    { type: "center", icon: AlignCenter, title: "Center" },
    { type: "right", icon: AlignRight, title: "Align Right" },
    { type: "justify", icon: AlignJustify, title: "Justify" },
  ];

  return (
    <div className="flex">
      {alignments.map(({ type, icon: Icon, title }) => (
        <button
          key={type}
          onClick={() => onAlignmentChange(type)}
          className={`p-2 border-r border-gray-300 last:border-r-0 hover:bg-blue-50 transition-colors ${
            currentAlignment === type ? "bg-blue-100" : "bg-white"
          }`}
          title={title}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
};
