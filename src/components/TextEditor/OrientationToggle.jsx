import React from 'react';
import { FileText, RotateCw } from 'lucide-react';

export const OrientationToggle = ({
  currentOrientation,
  onOrientationChange,
}) => {
  return (
    <div className="flex border border-gray-300 rounded">
      <button
        onClick={() => onOrientationChange('portrait')}
        className={`flex items-center gap-2 px-3 py-2 border-r border-gray-300 hover:bg-blue-50 transition-colors ${
          currentOrientation === 'portrait' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'
        }`}
        title="Portrait"
      >
        <FileText size={16} />
        <span className="text-sm">Portrait</span>
      </button>
      
      <button
        onClick={() => onOrientationChange('landscape')}
        className={`flex items-center gap-2 px-3 py-2 hover:bg-blue-50 transition-colors ${
          currentOrientation === 'landscape' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'
        }`}
        title="Landscape"
      >
        <RotateCw size={16} />
        <span className="text-sm">Landscape</span>
      </button>
    </div>
  );
};