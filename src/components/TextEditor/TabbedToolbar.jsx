"use client";

import { useState } from "react";
import { Home, Layout, Download, Plus } from "lucide-react";
import { HomeSection } from "./toolbar-sections/HomeSection";
import { PageLayoutSection } from "./toolbar-sections/PageLayoutSection";
import { ExportSection } from "./toolbar-sections/ExportSection";
import { InsertSection } from "./toolbar-sections/InsertSection";
import { UndoRedoControls } from "./UndoRedoControls";
import { JsonImporter } from "./JsonImporter";

export const TabbedToolbar = (props) => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "insert", label: "Insert", icon: Plus },
    { id: "layout", label: "Page Layout", icon: Layout },
    { id: "export", label: "Export", icon: Download },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeSection {...props} />;
      case "insert":
        return <InsertSection {...props} />;
      case "layout":
        return <PageLayoutSection {...props} />;
      case "export":
        return <ExportSection {...props} />;
      default:
        return <HomeSection {...props} />;
    }
  };

  return (
    <div className="bg-white border-b border-gray-300">
      {/* Tab Navigation */}
      <div className="flex items-center bg-gray-50 border-b border-gray-200">
        {/* Always visible controls */}
        <div className="flex items-center px-4 py-2 border-r border-gray-200">
          <div className="flex items-center gap-2">
            <UndoRedoControls
              onUndo={props.onUndo}
              onRedo={props.onRedo}
              canUndo={props.canUndo}
              canRedo={props.canRedo}
              undoCount={props.undoCount}
              redoCount={props.redoCount}
              getRecentHistory={props.getRecentHistory}
            />
            <div className="w-px h-6 bg-gray-300 mx-2" />
            {/* <JsonImporter onImport={props.onJsonImport} /> */}
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-[#1a1a8c] bg-white border-b-2 border-[#1a1a8c]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-3">{renderTabContent()}</div>
    </div>
  );
};
