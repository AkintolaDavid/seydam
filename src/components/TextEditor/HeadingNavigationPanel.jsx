import React, { useEffect, useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Hash, 
  RefreshCw, 
  FileText,
  Eye,
  Edit3,
  ChevronLeft,
  Wand2
} from 'lucide-react';

export const HeadingNavigationPanel = ({
  headings,
  selectedHeading,
  onHeadingSelect,
  onHeadingNavigate,
  onExtractHeadings
}) => {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set());
    useEffect(() => {
      if (headings.length > 0 && expandedSections.size === 0) {
        const allHeadingIds = new Set(headings.map(h => h.id));
        setExpandedSections(allHeadingIds);
      }
    }, [headings.length, expandedSections.size]);
  const buildHeadingHierarchy = () => {
    const hierarchy = [];
    const stack = [];

    headings.forEach(heading => {
      const headingWithChildren = { ...heading, children: [], depth: 0 };

      while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
        stack.pop();
      }

      headingWithChildren.depth = stack.length;

      if (stack.length === 0) {
        hierarchy.push(headingWithChildren);
      } else {
        stack[stack.length - 1].children.push(headingWithChildren);
      }

      stack.push(headingWithChildren);
    });

    return hierarchy;
  };

  const toggleSection = (headingId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(headingId)) {
      newExpanded.delete(headingId);
    } else {
      newExpanded.add(headingId);
    }
    setExpandedSections(newExpanded);
  };

  const handleHeadingClick = (headingId, event) => {
    event.preventDefault();
    event.stopPropagation();
    onHeadingNavigate(headingId);
  };

  const handleEditClick = (headingId, event) => {
    event.preventDefault();
    event.stopPropagation();
    onHeadingSelect(headingId);
  };

  const renderHeading = (heading) => {
    const isSelected = selectedHeading?.id === heading.id;
    const isExpanded = expandedSections.has(heading.id);
    const hasChildren = heading.children.length > 0;
    const indentLevel = Math.max(0, heading.level - 1);
    const paddingLeft = 12 + indentLevel * 20;

    return (
      <div key={heading.id} className="select-none">
        <div
          className={`flex items-center gap-2 px-3 py-2 transition-all duration-200 group ${
            isSelected 
              ? 'bg-[#1a1a8c] text-white shadow-sm' 
              : 'hover:bg-blue-50 text-gray-700'
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSection(heading.id);
              }}
              className={`p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors ${
                isSelected ? 'text-white' : 'text-gray-500'
              }`}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Heading Level Indicator */}
          <div 
            className={`flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
              isSelected 
                ? 'bg-white bg-opacity-20 text-white' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100'
            }`}
          >
            H{heading.level}
          </div>

          {/* Heading Text - Clickable for navigation */}
          <button
            onClick={(e) => handleHeadingClick(heading.id, e)}
            className={`flex-1 text-left text-sm font-medium truncate hover:underline transition-all ${
              isSelected ? 'text-white' : 'text-gray-800 hover:text-[#1a1a8c]'
            }`}
            title={`Navigate to: ${heading.text}`}
          >
            {heading.text || `Heading ${heading.level}`}
          </button>

          {/* Edit Icon - Clickable for AI editing */}
          <button
            onClick={(e) => handleEditClick(heading.id, e)}
            className={`p-1.5 rounded transition-all hover:scale-110 ${
              isSelected 
                ? 'bg-white bg-opacity-20 text-white hover:bg-opacity-30' 
                : 'text-gray-400 hover:text-[#1a1a8c] hover:bg-blue-100'
            }`}
            title="Edit with AI"
          >
            <Wand2 size={14} />
          </button>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {heading.children.map(child => renderHeading({ ...child, depth: heading.depth + 1 }))}
          </div>
        )}
      </div>
    );
  };

  const hierarchy = buildHeadingHierarchy();

  // Auto-expand all sections when headings are first loaded


  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Expand Navigation"
        >
          <ChevronRight size={20} />
        </button>
        <div className="mt-4 text-xs text-gray-400 transform -rotate-90 whitespace-nowrap">
          Navigation
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Hash className="text-[#1a1a8c]" size={20} />
            <h2 className="font-semibold text-gray-900">Document Structure</h2>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Collapse Navigation"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              console.log('Manual refresh triggered');
              onExtractHeadings();
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Refresh headings"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          
          <div className="text-xs text-gray-500">
            {headings.length} heading{headings.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Headings List */}
      <div className="flex-1 overflow-y-auto">
        {headings.length === 0 ? (
          <div className="p-6 text-center">
            <FileText className="mx-auto text-gray-300 mb-3" size={48} />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No Headings Found</h3>
            <p className="text-xs text-gray-500 mb-4">
              Add headings (H1-H6) to your document to see the structure here.
            </p>
            <div className="text-xs text-gray-400 space-y-2">
              <p className="mb-1">💡 <strong>Tips:</strong></p>
              <p>• Use heading styles from the toolbar</p>
              <p>• Type # for H1, ## for H2, etc.</p>
              <p>• Import JSON documents with headings</p>
              <p>• Click "Refresh" if headings don't appear</p>
            </div>
          </div>
        ) : (
          <div className="py-2">
            {hierarchy.map(heading => renderHeading(heading))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <Eye size={12} />
          <span>Click heading to navigate • </span>
          <Wand2 size={12} />
          <span>Click wand to edit with AI</span>
        </div>
        {selectedHeading && (
          <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
            <div className="font-medium text-blue-800">Selected for AI editing:</div>
            <div className="text-blue-700 truncate">{selectedHeading.text}</div>
          </div>
        )}
        
        {/* Hierarchy Legend */}
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
          <div className="font-medium text-green-800 mb-1">Hierarchy:</div>
          <div className="text-green-700 space-y-1">
            <div>H1 - Main headings</div>
            <div className="ml-4">H2 - Subsections</div>
            <div className="ml-8">H3 - Sub-subsections</div>
          </div>
        </div>
      </div>
    </div>
  );
};