import React, { useState, useRef, useEffect } from "react";
import { Undo, Redo, ChevronDown, Clock } from "lucide-react";

export const UndoRedoControls = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  undoCount,
  redoCount,
  getRecentHistory,
}) => {
  const [showUndoDropdown, setShowUndoDropdown] = useState(false);
  const [showRedoDropdown, setShowRedoDropdown] = useState(false);
  const undoDropdownRef = useRef(null);
  const redoDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        undoDropdownRef.current &&
        !undoDropdownRef.current.contains(event.target)
      ) {
        setShowUndoDropdown(false);
      }
      if (
        redoDropdownRef.current &&
        !redoDropdownRef.current.contains(event.target)
      ) {
        setShowRedoDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) {
      // Less than 1 minute
      return "Just now";
    } else if (diff < 3600000) {
      // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
  };

  const handleUndoSteps = (steps) => {
    onUndo(steps);
    setShowUndoDropdown(false);
  };

  const handleRedoSteps = (steps) => {
    onRedo(steps);
    setShowRedoDropdown(false);
  };

  const recentHistory = getRecentHistory(10);

  return (
    <div className="flex items-center">
      {/* Undo Controls */}
      <div className="relative flex" ref={undoDropdownRef}>
        <button
          onClick={() => onUndo(1)}
          disabled={!canUndo}
          className={`p-2 border-r  flex flex-col items-center border-gray-300 hover:bg-blue-50 transition-colors ${
            canUndo ? "text-gray-700" : "text-gray-400 cursor-not-allowed"
          }`}
          title={`Undo${undoCount > 0 ? ` (${undoCount} available)` : ""}`}
        >
          {" "}
          <span
            className={`text-[12px]  font-medium ${
              canRedo ? "text-gray-700" : "text-gray-500 cursor-not-allowed"
            }`}
          >
            UNDO
          </span>
          <Undo size={16} />
        </button>

        {canUndo && (
          <button
            onClick={() => setShowUndoDropdown(!showUndoDropdown)}
            className="p-1 border-r border-gray-300 hover:bg-blue-50 transition-colors text-gray-700"
            title="Undo multiple steps"
          >
            <ChevronDown size={12} />
          </button>
        )}

        {showUndoDropdown && canUndo && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[280px]">
            <div className="p-2 border-b border-gray-200 text-sm font-medium text-gray-700">
              Undo Actions ({undoCount} available)
            </div>

            <div className="max-h-60 overflow-y-auto">
              {/* Quick undo options */}
              <div className="p-2 border-b border-gray-100">
                <div className="text-xs text-gray-500 mb-2">Quick Undo:</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 5]
                    .filter((n) => n <= undoCount)
                    .map((steps) => (
                      <button
                        key={steps}
                        onClick={() => handleUndoSteps(steps)}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-blue-100 rounded transition-colors"
                      >
                        {steps} step{steps > 1 ? "s" : ""}
                      </button>
                    ))}
                  {undoCount > 5 && (
                    <button
                      onClick={() => handleUndoSteps(undoCount)}
                      className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                    >
                      All ({undoCount})
                    </button>
                  )}
                </div>
              </div>

              {/* Recent history */}
              {recentHistory.slice(1).map((state, index) => (
                <button
                  key={index}
                  onClick={() => handleUndoSteps(index + 1)}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-gray-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {state.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(state.timestamp)}
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      -{index + 1}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Redo Controls */}
      <div className="relative flex" ref={redoDropdownRef}>
        <button
          onClick={() => onRedo(1)}
          disabled={!canRedo}
          className={`p-2 flex flex-col items-center hover:bg-blue-50 transition-colors ${
            canRedo ? "text-gray-700" : "text-gray-400 cursor-not-allowed"
          }`}
          title={`Redo${redoCount > 0 ? ` (${redoCount} available)` : ""}`}
        >
          <span
            className={`text-[12px]  font-medium ${
              canRedo ? "text-gray-700" : "text-gray-500 cursor-not-allowed"
            }`}
          >
            REDO
          </span>
          <Redo size={16} />
        </button>

        {canRedo && (
          <button
            onClick={() => setShowRedoDropdown(!showRedoDropdown)}
            className="p-1 hover:bg-blue-50 transition-colors text-gray-700"
            title="Redo multiple steps"
          >
            <ChevronDown size={12} />
          </button>
        )}

        {showRedoDropdown && canRedo && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[280px]">
            <div className="p-2 border-b border-gray-200 text-sm font-medium text-gray-700">
              Redo Actions ({redoCount} available)
            </div>

            <div className="max-h-60 overflow-y-auto">
              {/* Quick redo options */}
              <div className="p-2 border-b border-gray-100">
                <div className="text-xs text-gray-500 mb-2">Quick Redo:</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 5]
                    .filter((n) => n <= redoCount)
                    .map((steps) => (
                      <button
                        key={steps}
                        onClick={() => handleRedoSteps(steps)}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-green-100 rounded transition-colors"
                      >
                        {steps} step{steps > 1 ? "s" : ""}
                      </button>
                    ))}
                  {redoCount > 5 && (
                    <button
                      onClick={() => handleRedoSteps(redoCount)}
                      className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                    >
                      All ({redoCount})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
