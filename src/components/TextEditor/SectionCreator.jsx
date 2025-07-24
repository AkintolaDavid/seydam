import React, { useState, useRef, useEffect } from "react";
import { Plus, ChevronDown, FileText, Columns, Layout } from "lucide-react";

const sectionLayouts = [
  {
    id: "basic",
    name: "Basic Section",
    description: "Simple section with heading and content",
    icon: FileText,
    template: `
      <div class="section-container" style="margin: 20px 0; padding: 15px; border-left: 4px solid #1a1a8c; background: #f8f9fa;">
        <h2 style="font-size: 18px; font-weight: bold; color: #1a1a8c; margin: 0 0 10px 0;">Section Title</h2>
        <p style="font-size: 12px; color: #000; margin: 0; line-height: 1.5;">Click here to add your content...</p>
      </div>
    `,
  },
  {
    id: "two-column",
    name: "Two Column",
    description: "Side-by-side content layout",
    icon: Columns,
    template: `
      <div class="section-container" style="margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="font-size: 18px; font-weight: bold; color: #1a1a8c; margin: 0 0 15px 0;">Two Column Section</h2>
        <div style="display: flex; gap: 20px;">
          <div style="flex: 1; padding: 10px; background: #f8f9fa; border-radius: 4px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">Left Column</h3>
            <p style="font-size: 12px; margin: 0; line-height: 1.5;">Add content here...</p>
          </div>
          <div style="flex: 1; padding: 10px; background: #f8f9fa; border-radius: 4px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">Right Column</h3>
            <p style="font-size: 12px; margin: 0; line-height: 1.5;">Add content here...</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "highlight",
    name: "Highlight Box",
    description: "Emphasized content section",
    icon: Layout,
    template: `
      <div class="section-container" style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); border-radius: 8px; border: 1px solid #1a1a8c;">
        <h2 style="font-size: 16px; font-weight: bold; color: #1a1a8c; margin: 0 0 10px 0; text-align: center;">Important Information</h2>
        <p style="font-size: 12px; color: #000; margin: 0; line-height: 1.5; text-align: center;">This is a highlighted section for important content...</p>
      </div>
    `,
  },
];

export const SectionCreator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const insertSection = (layout) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Create a temporary container to parse the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = layout.template.trim();

    // Get the section element
    const sectionElement = tempDiv.firstElementChild;

    if (sectionElement) {
      // Make the section editable
      sectionElement.contentEditable = "true";

      // Insert the section at cursor position
      range.deleteContents();
      range.insertNode(sectionElement);

      // Move cursor to the content area
      const contentElement = sectionElement.querySelector("p");
      if (contentElement) {
        const newRange = document.createRange();
        newRange.selectNodeContents(contentElement);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }

    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        title="Insert Section"
      >
        <Plus size={16} />
        <span>Section</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[320px]">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">
              Choose Section Layout
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Select a layout and formatting option for your new section
            </p>
          </div>

          <div className="p-2">
            {sectionLayouts.map((layout) => {
              const Icon = layout.icon;
              return (
                <button
                  key={layout.id}
                  onClick={() => insertSection(layout)}
                  className="w-full p-3 text-left hover:bg-blue-50 transition-colors rounded border border-transparent hover:border-blue-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded">
                      <Icon size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {layout.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {layout.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600">
              <strong>Tip:</strong> After inserting a section, you can click on
              any text to edit it and customize the formatting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
