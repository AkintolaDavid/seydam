"use client";

import { useState, useEffect } from "react";
import {
  FaPlus,
  FaMinus,
  FaEdit,
  FaCheck,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaFileAlt,
  FaCog,
  FaEye,
  FaSave,
  FaUndo,
  FaGripVertical,
  FaSpinner,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const ReportStructureEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // const structureData = location.state?.structureData;
  // const topic = location.state?.topic || "";
  // const description = location.state?.description || "";

  const structureData = location.state?.structureData;
  const topic =
    "DESIGN AND IMPLEMENTATION OF SMALL SCALE ENTERPRISE MANAGEMENT system";
  const description =
    "DESIGN AND IMPLEMENTATION OF SMALL SCALE ENTERPRISE MANAGEMENT system";

  const transformBackendData = (backendData) => {
    if (!backendData || !backendData.data) return {};

    const transformed = {};

    Object.entries(backendData.data).forEach(([chapterKey, chapterContent]) => {
      // Convert chapter key to readable format
      const chapterTitle = chapterKey
        .replace(/_/g, " ")
        .replace(/chapter (\d+)/, "Chapter $1 -")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      transformed[chapterTitle] = chapterContent;
    });

    return transformed;
  };

  const [structure, setStructure] = useState(() => {
    if (structureData) {
      return transformBackendData(structureData);
    }
    return {};
  });

  const [expandedSections, setExpandedSections] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [originalStructure, setOriginalStructure] = useState(structure);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Update structure when structureData changes
  useEffect(() => {
    if (structureData) {
      const transformed = transformBackendData(structureData);
      setStructure(transformed);
      setOriginalStructure(transformed);
    }
  }, [structureData]);

  const toggleSection = (path) => {
    setExpandedSections((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const startEditing = (path, currentValue) => {
    setEditingItem(path);
    setEditValue(currentValue || "");
  };

  const saveEdit = () => {
    if (editingItem && editValue.trim()) {
      updateStructure(editingItem, editValue.trim());
    }
    setEditingItem(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValue("");
  };

  const updateStructure = (path, value) => {
    const pathArray = path.split(".");
    const newStructure = JSON.parse(JSON.stringify(structure));

    let current = newStructure;
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }

    current[pathArray[pathArray.length - 1]] = value;
    setStructure(newStructure);
  };

  const addItem = (parentPath, isArray = false) => {
    const pathArray = parentPath.split(".");
    const newStructure = JSON.parse(JSON.stringify(structure));

    let current = newStructure;
    for (const key of pathArray) {
      current = current[key];
    }

    if (isArray && Array.isArray(current)) {
      const newIndex = current.length;
      current.push(`${String.fromCharCode(97 + newIndex)}. ...`);
    } else if (typeof current === "object" && current !== null) {
      const existingKeys = Object.keys(current);
      let newKey = "New Section";
      let counter = 1;

      while (existingKeys.includes(newKey)) {
        newKey = `New Section ${counter}`;
        counter++;
      }

      current[newKey] = null;
    }

    setStructure(newStructure);
  };

  const removeItem = (path) => {
    const pathArray = path.split(".");
    const newStructure = JSON.parse(JSON.stringify(structure));

    let current = newStructure;
    let parent = null;
    let lastKey = null;

    for (let i = 0; i < pathArray.length; i++) {
      if (i === pathArray.length - 1) {
        lastKey = pathArray[i];
        break;
      }
      parent = current;
      current = current[pathArray[i]];
    }

    if (Array.isArray(current)) {
      current.splice(Number.parseInt(lastKey), 1);
    } else if (
      parent &&
      typeof parent[pathArray[pathArray.length - 2]] === "object"
    ) {
      delete current[lastKey];
    }

    setStructure(newStructure);
  };

  const resetStructure = () => {
    setStructure(JSON.parse(JSON.stringify(originalStructure)));
    setExpandedSections({});
    setEditingItem(null);
  };

  const generateReport = async () => {
    if (!topic.trim() || !description.trim()) {
      alert("Topic and description are required for report generation!");
      return;
    }

    setIsGenerating(true);

    try {
      // Transform structure back to backend format
      const backendStructure = {};

      Object.entries(structure).forEach(([key, value]) => {
        const backendKey = key
          .toLowerCase()
          .replace(/chapter (\d+) - /i, "chapter_$1_")
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "");

        backendStructure[backendKey] = value;
      });

      const payload = {
        topic: topic,
        description: description,
        structure: backendStructure,
      };

      console.log("Sending payload to backend:", payload);

      const response = await fetch(`${BASE_URL}report_generation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("seydamtoken") || ""}`,
        },
        body: JSON.stringify(payload),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Report generation response:", result);

      if (result.status === "success" && result.data?.job_id) {
        // Navigate to loading page with job_id
        navigate("/report-loading", {
          state: {
            jobId: result.data.job_id,
            topic: topic,
          },
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert(`Error generating report: ${error.message}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Drag and Drop Functions
  const handleDragStart = (e, path, level) => {
    setDraggedItem({ path, level });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, path, level) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem({ path, level });
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e, targetPath, targetLevel) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.path === targetPath) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Only allow reordering within the same level
    if (draggedItem.level === targetLevel) {
      reorderItems(draggedItem.path, targetPath);
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const reorderItems = (sourcePath, targetPath) => {
    const sourcePathArray = sourcePath.split(".");
    const targetPathArray = targetPath.split(".");

    // Only reorder if they have the same parent
    if (sourcePathArray.length !== targetPathArray.length) return;

    const parentPath = sourcePathArray.slice(0, -1);
    const sourceKey = sourcePathArray[sourcePathArray.length - 1];
    const targetKey = targetPathArray[targetPathArray.length - 1];

    const newStructure = JSON.parse(JSON.stringify(structure));

    // Navigate to parent object
    let parent = newStructure;
    for (const key of parentPath) {
      parent = parent[key];
    }

    // Get all entries and reorder
    const entries = Object.entries(parent);
    const sourceIndex = entries.findIndex(([key]) => key === sourceKey);
    const targetIndex = entries.findIndex(([key]) => key === targetKey);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      // Remove source item
      const [sourceEntry] = entries.splice(sourceIndex, 1);
      // Insert at target position
      entries.splice(targetIndex, 0, sourceEntry);

      // Rebuild parent object with new order
      const newParent = {};
      entries.forEach(([key, value]) => {
        newParent[key] = value;
      });

      // Update the parent in structure
      let current = newStructure;
      for (let i = 0; i < parentPath.length - 1; i++) {
        current = current[parentPath[i]];
      }

      if (parentPath.length === 0) {
        setStructure(newParent);
      } else {
        current[parentPath[parentPath.length - 1]] = newParent;
        setStructure(newStructure);
      }
    }
  };

  const renderStructureItem = (key, value, path = "", level = 0) => {
    const currentPath = path ? `${path}.${key}` : key;
    const isExpanded = expandedSections[currentPath];
    const isEditing = editingItem === currentPath;
    const isDraggedOver = dragOverItem?.path === currentPath;
    const isDragging = draggedItem?.path === currentPath;

    const getItemIcon = (level) => {
      if (level === 0) return "📚";
      if (level === 1) return "📄";
      if (level === 2) return "📝";
      return "•";
    };

    const getItemColor = (level) => {
      const colors = [
        "border-l-[#0D0D82] bg-blue-50",
        "border-l-green-500 bg-green-50",
        "border-l-purple-500 bg-purple-50",
        "border-l-orange-500 bg-orange-50",
      ];
      return colors[level % colors.length] || "border-l-gray-500 bg-gray-50";
    };

    if (Array.isArray(value)) {
      return (
        <div
          key={currentPath}
          className={`mb-2 border-l-4 ${getItemColor(
            level
          )} rounded-r-lg transition-all duration-200 ${
            isDraggedOver ? "ring-2 ring-blue-400 bg-blue-100" : ""
          } ${isDragging ? "opacity-50 scale-95" : ""}`}
          draggable
          onDragStart={(e) => handleDragStart(e, currentPath, level)}
          onDragOver={(e) => handleDragOver(e, currentPath, level)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, currentPath, level)}
        >
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-2">
              <FaGripVertical
                className="text-gray-400 cursor-move hover:text-gray-600"
                size={12}
              />
              <span className="text-lg">{getItemIcon(level)}</span>
              <span className="font-medium text-gray-800">{key}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {value.length} items
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => addItem(currentPath, true)}
                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                title="Add item"
              >
                <FaPlus size={12} />
              </button>
            </div>
          </div>
          <div className="pl-8 pb-3">
            {value.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-1 group"
              >
                <span className="text-gray-700">{item}</span>
                <button
                  onClick={() => removeItem(`${currentPath}.${index}`)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded transition-all"
                  title="Remove item"
                >
                  <FaMinus size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div
          key={currentPath}
          className={`mb-2 border-l-4 ${getItemColor(
            level
          )} rounded-r-lg transition-all duration-200 ${
            isDraggedOver ? "ring-2 ring-blue-400 bg-blue-100" : ""
          } ${isDragging ? "opacity-50 scale-95" : ""}`}
          draggable
          onDragStart={(e) => handleDragStart(e, currentPath, level)}
          onDragOver={(e) => handleDragOver(e, currentPath, level)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, currentPath, level)}
        >
          <div
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleSection(currentPath)}
          >
            <div className="flex items-center space-x-2">
              <FaGripVertical
                className="text-gray-400 cursor-move hover:text-gray-600"
                size={12}
              />
              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                {isExpanded ? (
                  <FaChevronDown size={12} />
                ) : (
                  <FaChevronRight size={12} />
                )}
              </button>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0D0D82]"
                    onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                    autoFocus
                  />
                  <button
                    onClick={saveEdit}
                    className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                  >
                    <FaCheck size={12} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ) : (
                <span className="font-medium text-gray-800">{key}</span>
              )}
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {Object.keys(value).length} sections
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {!isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(currentPath, key);
                  }}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                  title="Edit section name"
                >
                  <FaEdit size={12} />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addItem(currentPath);
                }}
                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                title="Add subsection"
              >
                <FaPlus size={12} />
              </button>
              {level > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(currentPath);
                  }}
                  className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                  title="Remove section"
                >
                  <FaMinus size={12} />
                </button>
              )}
            </div>
          </div>
          {isExpanded && (
            <div className="pl-6 pb-3">
              {Object.entries(value).map(([subKey, subValue]) =>
                renderStructureItem(subKey, subValue, currentPath, level + 1)
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={currentPath}
        className={`mb-2 border-l-4 ${getItemColor(
          level
        )} rounded-r-lg transition-all duration-200 ${
          isDraggedOver ? "ring-2 ring-blue-400 bg-blue-100" : ""
        } ${isDragging ? "opacity-50 scale-95" : ""}`}
        draggable
        onDragStart={(e) => handleDragStart(e, currentPath, level)}
        onDragOver={(e) => handleDragOver(e, currentPath, level)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, currentPath, level)}
      >
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-2">
            <FaGripVertical
              className="text-gray-400 cursor-move hover:text-gray-600"
              size={12}
            />
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0D0D82]"
                  onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                  autoFocus
                />
                <button
                  onClick={saveEdit}
                  className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                >
                  <FaCheck size={12} />
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <span className="text-gray-800 ml-7 font-semibold">{key}</span>
            )}
            {value && typeof value === "string" && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                {value.length > 20 ? `${value.substring(0, 20)}...` : value}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {!isEditing && (
              <button
                onClick={() => startEditing(currentPath, key)}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                title="Edit item name"
              >
                <FaEdit size={12} />
              </button>
            )}
            {level > 0 && (
              <button
                onClick={() => removeItem(currentPath)}
                className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                title="Remove item"
              >
                <FaMinus size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <FaFileAlt className="mr-3 text-blue-600" />
                Report Structure Editor
              </h1>
              <p className="text-gray-600 mt-2">
                Drag and drop to reorder sections, then customize your report
                structure
              </p>
              {topic && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Topic: {topic}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setExpandedSections({})}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <FaCog className="mr-2" size={14} />
                Collapse All
              </button>
              <button
                onClick={() => {
                  const allPaths = {};
                  const addPaths = (obj, path = "") => {
                    Object.keys(obj).forEach((key) => {
                      const currentPath = path ? `${path}.${key}` : key;
                      if (
                        typeof obj[key] === "object" &&
                        obj[key] !== null &&
                        !Array.isArray(obj[key])
                      ) {
                        allPaths[currentPath] = true;
                        addPaths(obj[key], currentPath);
                      }
                    });
                  };
                  addPaths(structure);
                  setExpandedSections(allPaths);
                }}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
              >
                <FaEye className="mr-2" size={14} />
                Expand All
              </button>
              <button
                onClick={resetStructure}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center"
              >
                <FaUndo className="mr-2" size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Structure Editor */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Report Structure
            </h2>
            <p className="text-gray-600 text-sm">
              🔄 Drag the grip icons to reorder sections • ✏️ Click edit to
              rename • ➕ Add new sections • 🗑️ Remove unwanted sections
            </p>
          </div>

          {Object.keys(structure).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaFileAlt size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No structure data available</p>
              <p className="text-sm">
                Please provide report structure data to begin editing
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(structure).map(([key, value]) =>
                renderStructureItem(key, value, "", 0)
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600">
            <div className="mb-2 md:mb-0">
              <span className="font-medium">Total Sections:</span>{" "}
              {Object.keys(structure).length}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#0D0D82] rounded mr-2"></div>
                <span>Main Chapters</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Sections</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                <span>Subsections</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={generateReport}
          className="mt-6 w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          disabled={Object.keys(structure).length === 0 || isGenerating}
        >
          {isGenerating ? (
            <>
              <FaSpinner className="animate-spin mr-2" size={16} />
              Generating Report...
            </>
          ) : (
            <>
              <FaSave className="mr-2" size={16} />
              Generate Report
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReportStructureEditor;
