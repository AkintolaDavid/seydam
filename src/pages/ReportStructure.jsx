"use client";

import { useToast } from "@chakra-ui/react";
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
  FaSave,
  FaGripVertical,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const ReportStructureEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const structureData = location.state?.structureData;
  const topic = location.state?.topic || "";
  const description = location.state?.description || "";
  const report_id = location.state?.report_id || "";

  const username = localStorage.getItem("username") || "User";
  const capitalizedUsername = username
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const capitalizedTopic = topic
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  console.log("Report ID:", report_id);
  console.log("Initial structure data:", structureData);

  // Fixed transformBackendData function
  const transformBackendData = (backendData) => {
    console.log("Transforming backend data:", backendData);

    if (!backendData) return {};

    const dataToTransform = backendData.data || backendData;

    if (typeof dataToTransform !== "object") return {};

    const transformed = {};

    Object.entries(dataToTransform).forEach(([chapterKey, chapterContent]) => {
      const chapterTitle = chapterKey
        .replace(/_/g, " ")
        .replace(/chapter (\d+)/, "Chapter $1 -")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      transformed[chapterTitle] = chapterContent;
    });

    console.log("Transformed data:", transformed);
    return transformed;
  };

  const [structure, setStructure] = useState(() => {
    console.log("Initializing structure with:", structureData);
    if (structureData) {
      const transformed = transformBackendData(structureData);
      console.log("Initial transformed structure:", transformed);
      return transformed;
    }
    return {};
  });

  const [expandedSections, setExpandedSections] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [originalStructure, setOriginalStructure] = useState(structure);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const toast = useToast();

  // Update structure when structureData changes
  useEffect(() => {
    console.log("useEffect triggered with structureData:", structureData);
    if (structureData) {
      const transformed = transformBackendData(structureData);
      console.log("Setting structure to:", transformed);
      setStructure(transformed);
      setOriginalStructure(transformed);
    }
  }, [structureData]);

  // Debug effect to log structure changes
  useEffect(() => {
    console.log("Structure state updated:", structure);
    console.log("Structure keys:", Object.keys(structure));
  }, [structure]);

  // Helper function to extract chapter number for sorting
  const getChapterNumber = (key) => {
    const match = key.match(/Chapter (\d+)/);
    return match ? Number.parseInt(match[1]) : 999; // Put non-numbered items at the end
  };

  // Helper function to extract subsection number for sorting
  const getSubsectionNumber = (key) => {
    const match = key.match(/^(\d+)\.(\d+)/);
    if (match) {
      return Number.parseInt(match[1]) * 1000 + Number.parseInt(match[2]); // For sorting like 1.1, 1.2, 2.1, etc.
    }
    // Also handle simple numeric keys like "1", "2", "3"
    const numMatch = key.match(/^(\d+)$/);
    if (numMatch) {
      return Number.parseInt(numMatch[1]);
    }
    return 999;
  };

  const toggleSection = (path) => {
    setExpandedSections((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const startEditing = (path, currentValue, isValueEdit = false) => {
    console.log(
      "Starting edit for path:",
      path,
      "with value:",
      currentValue,
      "isValueEdit:",
      isValueEdit
    );
    setEditingItem(path);
    setEditValue(currentValue || "");
  };

  const saveEdit = () => {
    toast({
      title: "Report Changes Saved!",
      status: "success",
      duration: 1000, // 1 second
      isClosable: true,
      position: "top-right",
    });
    if (editingItem && editValue.trim()) {
      console.log(
        "Saving edit for path:",
        editingItem,
        "with new value:",
        editValue.trim()
      );
      updateStructureWithNewPath(editingItem, editValue.trim());
      setHasChanges(true);
    }
    setEditingItem(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValue("");
  };

  // Helper function to safely navigate to a path in the structure
  const navigateToPath = (structure, pathArray) => {
    let current = structure;
    const validPath = [];

    for (const key of pathArray) {
      console.log(
        "Navigating to key:",
        key,
        "Current keys:",
        Object.keys(current)
      );

      if (
        current &&
        typeof current === "object" &&
        current[key] !== undefined
      ) {
        current = current[key];
        validPath.push(key);
      } else {
        console.error(
          "Path navigation failed at key:",
          key,
          "Available keys:",
          Object.keys(current || {})
        );
        return { success: false, current: null, validPath };
      }
    }

    return { success: true, current, validPath };
  };

  const updateStructureWithNewPath = (path, newValue) => {
    console.log(
      "Updating structure at path:",
      path,
      "with new value:",
      newValue
    );
    const pathArray = path.split("|||");

    setStructure((prevStructure) => {
      const newStructure = JSON.parse(JSON.stringify(prevStructure));

      if (pathArray.length === 1) {
        const oldKey = pathArray[0];
        if (prevStructure[oldKey] !== undefined) {
          // For top-level items, we're updating the key
          if (oldKey !== newValue) {
            const oldValue = newStructure[oldKey];
            delete newStructure[oldKey];
            newStructure[newValue] = oldValue;
            console.log("Renamed top-level key from", oldKey, "to", newValue);
          }
        }
      } else {
        const parentPath = pathArray.slice(0, -1);
        const lastKey = pathArray[pathArray.length - 1];

        // Navigate to parent using the new path format
        let current = newStructure;
        for (const key of parentPath) {
          if (current[key] === undefined) {
            console.error("Path not found:", parentPath);
            return prevStructure;
          }
          current = current[key];
        }

        // Check if we're editing a value (string) or a key (object)
        if (typeof current[lastKey] === "string") {
          // We're editing the value
          current[lastKey] = newValue;
          console.log("Updated value at", lastKey, "to", newValue);
        } else if (current[lastKey] !== undefined) {
          // We're editing the key
          if (lastKey !== newValue) {
            const oldValue = current[lastKey];
            delete current[lastKey];
            current[newValue] = oldValue;
            console.log("Renamed key from", lastKey, "to", newValue);
          }
        } else {
          console.error("Key not found:", lastKey, "in", Object.keys(current));
          return prevStructure;
        }
      }

      console.log("Updated structure:", newStructure);
      return newStructure;
    });
  };

  const addItem = (parentPath, isArray = false) => {
    console.log("Adding item to path:", parentPath, "isArray:", isArray);

    setStructure((prevStructure) => {
      const newStructure = JSON.parse(JSON.stringify(prevStructure));

      if (!parentPath) {
        const existingKeys = Object.keys(newStructure);
        let newKey = "New Chapter";
        let counter = 1;

        while (existingKeys.includes(newKey)) {
          newKey = `New Chapter ${counter}`;
          counter++;
        }

        newStructure[newKey] = {
          "New Section": "Content placeholder",
        };
      } else {
        const pathArray = parentPath.split(".");

        // Use the safe navigation helper
        const navResult = navigateToPath(newStructure, pathArray);

        if (!navResult.success) {
          console.error(
            "Failed to navigate to path for adding item:",
            pathArray
          );
          return prevStructure;
        }

        const current = navResult.current;

        if (isArray && Array.isArray(current)) {
          const newIndex = current.length;
          current.push(`${String.fromCharCode(97 + newIndex)}. New item`);
        } else if (typeof current === "object" && current !== null) {
          const existingKeys = Object.keys(current);
          let newKey = "New Section";
          let counter = 1;

          while (existingKeys.includes(newKey)) {
            newKey = `New Section ${counter}`;
            counter++;
          }

          current[newKey] = "Content placeholder";
        }
      }

      console.log("Added item, new structure:", newStructure);
      return newStructure;
    });

    setHasChanges(true);
  };

  const removeItem = (path) => {
    console.log("Removing item at path:", path);
    const pathArray = path.split(".");

    setStructure((prevStructure) => {
      const newStructure = JSON.parse(JSON.stringify(prevStructure));

      if (pathArray.length === 1) {
        delete newStructure[pathArray[0]];
      } else {
        const parentPath = pathArray.slice(0, -1);
        const keyToRemove = pathArray[pathArray.length - 1];

        // Use the safe navigation helper
        const navResult = navigateToPath(newStructure, parentPath);

        if (!navResult.success) {
          console.error(
            "Failed to navigate to path for removing item:",
            parentPath
          );
          return prevStructure;
        }

        const current = navResult.current;

        if (Array.isArray(current)) {
          current.splice(Number.parseInt(keyToRemove), 1);
        } else if (current[keyToRemove] !== undefined) {
          delete current[keyToRemove];
        } else {
          console.error(
            "Key to remove not found:",
            keyToRemove,
            "in",
            Object.keys(current)
          );
          return prevStructure;
        }
      }

      console.log("Removed item, new structure:", newStructure);
      return newStructure;
    });

    setHasChanges(true);
  };

  const resetStructure = () => {
    console.log("Resetting structure to original");
    setStructure(JSON.parse(JSON.stringify(originalStructure)));
    setExpandedSections({});
    setEditingItem(null);
    setHasChanges(false);
  };

  const generateReport = async () => {
    setIsGenerating(true);

    try {
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
        structure: backendStructure,
        report_id: report_id,
      };

      console.log("Sending payload to backend:", payload);
      console.log("Current structure being sent:", structure);
      console.log("Backend structure being sent:", backendStructure);

      const response = await fetch(`${BASE_URL}report_generation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("seydamtoken") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      console.log(response);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Report generation response:", result);

      if (result.status === "success" && result.data?.status) {
        navigate("/report-loading", {
          state: {
            report_id: report_id,
            status: result?.data?.status,
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

  const renderStructureItem = (key, value, path = "", level = 0) => {
    // Use a special separator that won't conflict with dots in keys
    const currentPath = path ? `${path}|||${key}` : key;
    const isExpanded = expandedSections[currentPath];
    const isEditing = editingItem === currentPath;

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
          )} rounded-r-lg transition-all duration-200`}
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
              {level > 0 && (
                <button
                  onClick={() => removeItem(currentPath)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                  title="Remove section"
                >
                  <FaMinus size={12} />
                </button>
              )}
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
                  onClick={() => removeItem(`${currentPath}|||${index}`)}
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
      // Sort the subsections numerically
      const sortedEntries = Object.entries(value).sort(([keyA], [keyB]) => {
        const numA = getSubsectionNumber(keyA);
        const numB = getSubsectionNumber(keyB);
        return numA - numB;
      });

      return (
        <div
          key={currentPath}
          className={`mb-2 border-l-4 ${getItemColor(
            level
          )} rounded-r-lg transition-all duration-200`}
        >
          <div
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleSection(currentPath)}
          >
            <div className="flex items-center space-x-1 sm:space-x-2">
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
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0D0D82] min-w-[200px]"
                    onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                    autoFocus
                    placeholder="Enter section content..."
                  />
                  <button
                    onClick={saveEdit}
                    className="p-1 text-[#0D0D82] hover:bg-green-100 rounded transition-colors"
                    title="Save changes"
                  >
                    <FaCheck size={12} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Cancel editing"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ) : (
                <span className="text-[15px] sm:text-base font-medium text-gray-800">
                  {key}
                </span>
              )}
              <span className="hidden sm:block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
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
                  title="Edit section content"
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
              {sortedEntries.map(([subKey, subValue]) =>
                renderStructureItem(subKey, subValue, currentPath, level + 1)
              )}
            </div>
          )}
        </div>
      );
    }

    // This is the leaf node - where the VALUE (yellow text) should be editable
    return (
      <div
        key={currentPath}
        className={`mb-2 border-l-4 ${getItemColor(
          level
        )} rounded-r-lg transition-all duration-200`}
      >
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-2">
            <FaGripVertical
              className="text-gray-400 cursor-move hover:text-gray-600"
              size={12}
            />
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {key}
                </span>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0D0D82] min-w-[200px]"
                  onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                  autoFocus
                  placeholder="Enter content..."
                />
                <button
                  onClick={saveEdit}
                  className="p-1 text-[#0D0D82] hover:bg-green-100 rounded transition-colors"
                  title="                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Save changes"
                >
                  <FaCheck size={12} />
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                  title="Cancel editing"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-7">
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {key}
                </span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {value}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {!isEditing && (
              <button
                onClick={() => startEditing(currentPath, value, true)}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                title="Edit content"
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

  // Sort chapters numerically before rendering
  const sortedChapters = Object.entries(structure).sort(([keyA], [keyB]) => {
    const numA = getChapterNumber(keyA);
    const numB = getChapterNumber(keyB);
    return numA - numB;
  });

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="">
        {/* Header */}
        <div className="md:border-b-[1px]">
          <h1 className="text-[20px] sm:text-2xl md:text-3xl font-bold text-white">
            Report Structure Outline
          </h1>
          <p className="hidden md:block text-white mt-1 mb-2 text-[17px] font-medium max-w-[300px] sm:max-w-[900px]">
            Review and edit generated report outline below
          </p>
        </div>

        <div className="bg-white rounded-lg p-0 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between"></div>
        </div>

        {/* Structure Editor */}
        <div className="bg-white rounded-lg p-2 sm:p-4 md:p-6 shadow-sm">
          <div className="mb-4">
            {topic && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-[14px] sm:text-base font-semibold text-[#0D0D82]">
                  Report Topic: {capitalizedTopic}
                </p>
              </div>
            )}

            {/* {hasChanges && (
              <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FaCheck className="text-green-600" size={14} />
                  <p className="text-green-800 text-sm font-medium">
                    Changes detected!
                  </p>
                </div>
              </div>
            )} */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <p className="text-gray-600 font-medium text-[13px] sm:text-sm">
                  <button className=" text-[#0D0D82] ">
                    <FaEdit size={14} />
                  </button>{" "}
                  Click to edit outline content{" "}
                </p>
                <p className="text-gray-600 font-medium text-[13px] sm:text-sm mt-1">
                  <button className=" text-[#0D0D82]">
                    <FaPlus size={14} />
                  </button>{" "}
                  Click to add new sections
                </p>
              </div>
              {hasChanges && (
                <button
                  onClick={resetStructure}
                  className="text-sm text-white bg-red-700 p-2 rounded-lg font-medium"
                >
                  Reset to Original
                </button>
              )}
            </div>
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
              {sortedChapters.map(([key, value]) =>
                renderStructureItem(key, value, "", 0)
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600">
            <div className="flex flex-wrap items-center sm:space-x-4">
              <div className="flex items-center mr-4 sm:mr-0">
                <div className="w-3 h-3 bg-[#0D0D82] rounded mr-2"></div>
                <span>Main Chapters</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Sections</span>
              </div>
              {/* <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                <span>Subsections</span>
              </div> */}
            </div>
          </div>
        </div>

        <button
          onClick={generateReport}
          className="mt-6 w-full md:w-auto px-8 py-2 sm:py-3 bg-[#0D0D82] text-white rounded-lg hover:bg-[#0e0ea1] transition-colors flex items-center justify-center font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
