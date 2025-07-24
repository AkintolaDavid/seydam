import { useState, useCallback, useEffect, useRef } from "react";

export const useHeadingNavigation = (editorRef, content) => {
  const [headings, setHeadings] = useState([]);
  const [selectedHeading, setSelectedHeading] = useState(null);
  const [selectedContent, setSelectedContent] = useState("");
  const extractionTimeoutRef = useRef();
  const lastContentRef = useRef("");
  const observerRef = useRef(null);

  // Extract all headings from the editor content
  const extractHeadings = useCallback(() => {
    if (!editorRef.current) { 
      return;
    }

    // Clear any pending extraction
    if (extractionTimeoutRef.current) {
      clearTimeout(extractionTimeoutRef.current);
    }

    // Debounce extraction to avoid excessive calls during typing
    extractionTimeoutRef.current = setTimeout(() => {
      if (!editorRef.current) return;
 
      const headingElements = editorRef.current.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
      );
      const extractedHeadings = [];

      console.log(`Found ${headingElements.length} heading elements`);

      headingElements.forEach((element, index) => {
        const htmlElement = element;
        const level = parseInt(htmlElement.tagName.charAt(1));
        const text = htmlElement.textContent?.trim() || `Heading ${level}`;

        // Generate unique ID if not present
        let id = htmlElement.id;
        if (!id) {
          id = `heading-${level}-${Date.now()}-${index}`;
          htmlElement.id = id;
        }

        console.log(
          `Extracted heading: Level ${level}, Text: "${text}", ID: ${id}`
        );

        extractedHeadings.push({
          id,
          level,
          text,
          element: htmlElement,
          startOffset: 0, // Will be calculated when needed
          endOffset: 0, // Will be calculated when needed
        });
      });

      console.log(`Total headings extracted: ${extractedHeadings.length}`);

      // Force update by creating new array
      setHeadings([...extractedHeadings]);

      // Clear selected heading if it no longer exists
      setSelectedHeading((prev) => {
        if (prev && !extractedHeadings.find((h) => h.id === prev.id)) {
          setSelectedContent("");
          return null;
        }
        return prev;
      });
    }, 50); // Reduced debounce time for faster updates
  }, [editorRef]);

  // Set up mutation observer to watch for DOM changes
  useEffect(() => {
    if (!editorRef.current) return;

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new mutation observer
    observerRef.current = new MutationObserver((mutations) => {
      let shouldExtract = false;

      mutations.forEach((mutation) => {
        // Check if headings were added, removed, or modified
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes);
          const removedNodes = Array.from(mutation.removedNodes);

          // Check if any heading elements were added or removed
          const hasHeadingChanges = [...addedNodes, ...removedNodes].some(
            (node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node;
                return (
                  element.tagName?.match(/^H[1-6]$/) ||
                  element.querySelector?.("h1, h2, h3, h4, h5, h6")
                );
              }
              return false;
            }
          );

          if (hasHeadingChanges) {
            shouldExtract = true;
          }
        }

        // Check if heading content or attributes changed
        if (
          mutation.type === "characterData" ||
          mutation.type === "attributes"
        ) {
          const target = mutation.target;
          if (
            target.tagName?.match(/^H[1-6]$/) ||
            target.closest?.("h1, h2, h3, h4, h5, h6")
          ) {
            shouldExtract = true;
          }
        }
      });

      if (shouldExtract) {
        console.log("DOM mutation detected, extracting headings...");
        extractHeadings();
      }
    });

    // Start observing
    observerRef.current.observe(editorRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["id", "class", "style"],
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [editorRef, extractHeadings]);

  // Get content between a heading and the next heading of same or higher level
  const getHeadingContent = useCallback(
    (heading) => {
      if (!editorRef.current) return "";

      console.log(
        `Getting content for heading: "${heading.text}" (Level ${heading.level})`
      );

      const allElements = Array.from(editorRef.current.children);
      const headingIndex = allElements.findIndex(
        (el) => el === heading.element
      );

      if (headingIndex === -1) {
        console.log("Heading element not found in editor");
        return "";
      }

      let content = "";

      // Find the next heading of the same or higher level (lower level number)
      let nextHeadingIndex = -1;
      for (let i = headingIndex + 1; i < allElements.length; i++) {
        const element = allElements[i];
        if (element.tagName.match(/^H[1-6]$/)) {
          const elementLevel = parseInt(element.tagName.charAt(1));
          // Stop at headings of same or higher level (same level or lower level number)
          if (elementLevel <= heading.level) {
            nextHeadingIndex = i;
            console.log(
              `Found next heading at index ${i}: "${element.textContent}" (Level ${elementLevel})`
            );
            break;
          }
        }
      }

      // Include content from the heading until the next heading of same/higher level
      const endIndex =
        nextHeadingIndex === -1 ? allElements.length : nextHeadingIndex;

      console.log(
        `Content range: from index ${headingIndex} to ${endIndex - 1}`
      );

      // Start from the heading itself and include all content until the next heading
      for (let i = headingIndex; i < endIndex; i++) {
        const element = allElements[i];
        content += element.outerHTML;
      }

      console.log(
        `Extracted content for heading "${heading.text}":`,
        content.substring(0, 200) + "..."
      );
      return content;
    },
    [editorRef]
  );

  // Get only the content UNDER a heading (excluding the heading itself)
  const getHeadingContentOnly = useCallback(
    (heading) => {
      if (!editorRef.current) return "";

      console.log(
        `Getting content under heading: "${heading.text}" (Level ${heading.level})`
      );

      const allElements = Array.from(editorRef.current.children);
      const headingIndex = allElements.findIndex(
        (el) => el === heading.element
      );

      if (headingIndex === -1) {
        console.log("Heading element not found in editor");
        return "";
      }

      let content = "";

      // Find the next heading of the same or higher level (lower level number)
      let nextHeadingIndex = -1;
      for (let i = headingIndex + 1; i < allElements.length; i++) {
        const element = allElements[i];
        if (element.tagName.match(/^H[1-6]$/)) {
          const elementLevel = parseInt(element.tagName.charAt(1));
          // Stop at headings of same or higher level (same level or lower level number)
          if (elementLevel <= heading.level) {
            nextHeadingIndex = i;
            console.log(
              `Found next heading at index ${i}: "${element.textContent}" (Level ${elementLevel})`
            );
            break;
          }
        }
      }

      // Include content AFTER the heading until the next heading of same/higher level
      const startIndex = headingIndex + 1; // Start AFTER the heading
      const endIndex =
        nextHeadingIndex === -1 ? allElements.length : nextHeadingIndex;

      console.log(
        `Content range (content only): from index ${startIndex} to ${
          endIndex - 1
        }`
      );

      // Include all content between headings (excluding the heading itself)
      for (let i = startIndex; i < endIndex; i++) {
        const element = allElements[i];
        content += element.outerHTML;
      }

      // If no content found, return a placeholder
      if (!content.trim()) {
        content =
          '<p style="font-size: 12px; font-family: Arial; color: #666; font-style: italic;">No content under this heading yet. Click here to start writing...</p>';
      }

      console.log(
        `Extracted content under heading "${heading.text}":`,
        content.substring(0, 200) + "..."
      );
      return content;
    },
    [editorRef]
  );

  // Navigate to a heading (scroll into view)
  const navigateToHeading = useCallback(
    (headingId) => {
      const heading = headings.find((h) => h.id === headingId);
      if (!heading) return;

      console.log("Navigating to heading:", heading.text);

      // Scroll heading into view
      heading.element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });

      // Briefly highlight the heading
      heading.element.style.transition = "background-color 0.3s ease";
      heading.element.style.backgroundColor = "rgba(26, 26, 140, 0.1)";

      setTimeout(() => {
        heading.element.style.backgroundColor = "";
        setTimeout(() => {
          heading.element.style.transition = "";
        }, 300);
      }, 1000);
    },
    [headings]
  );

  // Select a heading for AI editing and extract its content
  const selectHeading = useCallback(
    (headingId) => {
      if (!headingId) {
        setSelectedHeading(null);
        setSelectedContent("");
        // Remove visual selection from all headings
        headings.forEach((h) => {
          h.element.classList.remove("selected-heading");
        });
        return;
      }

      const heading = headings.find((h) => h.id === headingId);
      if (!heading) return;

      console.log("Selecting heading for AI editing:", heading.text);

      // Remove previous selection
      headings.forEach((h) => {
        h.element.classList.remove("selected-heading");
      });

      // Add visual selection to current heading
      heading.element.classList.add("selected-heading");

      setSelectedHeading(heading);

      // Extract content under this heading (excluding the heading itself for AI editing)
      const content = getHeadingContentOnly(heading);
      setSelectedContent(content);

      // Scroll heading into view
      heading.element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
    [headings, getHeadingContentOnly]
  );

  // Update content for a specific heading
  const updateHeadingContent = useCallback(
    (headingId, newContent) => {
      if (!editorRef.current) return;

      const heading = headings.find((h) => h.id === headingId);
      if (!heading) return;

      console.log(`Updating content for heading: "${heading.text}"`);

      const allElements = Array.from(editorRef.current.children);
      const headingIndex = allElements.findIndex(
        (el) => el === heading.element
      );

      if (headingIndex === -1) return;

      // Find the range of elements to replace (content under the heading)
      let nextHeadingIndex = -1;
      for (let i = headingIndex + 1; i < allElements.length; i++) {
        const element = allElements[i];
        if (element.tagName.match(/^H[1-6]$/)) {
          const elementLevel = parseInt(element.tagName.charAt(1));
          if (elementLevel <= heading.level) {
            nextHeadingIndex = i;
            break;
          }
        }
      }

      const startIndex = headingIndex + 1; // Start AFTER the heading
      const endIndex =
        nextHeadingIndex === -1 ? allElements.length : nextHeadingIndex;

      // Remove old content (everything between headings, but keep the heading)
      for (let i = endIndex - 1; i >= startIndex; i--) {
        allElements[i].remove();
      }

      // Create temporary container for new content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = newContent;

      // Insert new content after the heading
      const insertionPoint =
        nextHeadingIndex !== -1 ? allElements[nextHeadingIndex] : null;

      Array.from(tempDiv.children).forEach((child) => {
        if (insertionPoint) {
          editorRef.current.insertBefore(child.cloneNode(true), insertionPoint);
        } else {
          editorRef.current.appendChild(child.cloneNode(true));
        }
      });

      console.log("Content updated successfully");

      // Re-extract headings to update references
      setTimeout(() => {
        extractHeadings();
        // Re-select the updated heading
        setTimeout(() => selectHeading(headingId), 100);
      }, 100);
    },
    [editorRef, headings, extractHeadings, selectHeading]
  );

  // Extract headings when content changes (with content comparison to avoid unnecessary extractions)
  useEffect(() => {
    if (content && content !== lastContentRef.current) {
      console.log("Content changed, triggering heading extraction...");
      lastContentRef.current = content;
      extractHeadings();
    }
  }, [content, extractHeadings]);

  // Initial extraction when editor is ready
  useEffect(() => {
    if (editorRef.current) {
      console.log("Editor ready, performing initial heading extraction...");
      // Wait a bit for the editor to be fully initialized
      setTimeout(() => extractHeadings(), 500);
    }
  }, [editorRef, extractHeadings]);

  // Cleanup timeout and observer on unmount
  useEffect(() => {
    return () => {
      if (extractionTimeoutRef.current) {
        clearTimeout(extractionTimeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    headings,
    selectedHeading,
    selectedContent,
    selectHeading,
    navigateToHeading,
    updateHeadingContent,
    extractHeadings,
  };
};
