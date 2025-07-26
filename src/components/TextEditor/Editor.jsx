"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { cmToPx } from "../../utils/pdf";
import { useAdvancedImageHandling } from "../../hooks/useAdvancedImageHandling";
import { AdvancedImageEditor } from "./AdvancedImageEditor";

// Paper size dimensions in cm
const paperSizes = {
  A1: { width: 59.4, height: 84.1 },
  A2: { width: 42.0, height: 59.4 },
  A3: { width: 29.7, height: 42.0 },
  A4: { width: 21.0, height: 29.7 },
  A5: { width: 14.8, height: 21.0 },
  Letter: { width: 21.6, height: 27.9 },
  Legal: { width: 21.6, height: 35.6 },
};

export const Editor = ({
  editorRef,
  editorState,
  onSelectionChange,
  onContentChange,
  selectedHeading,
}) => {
  const pageBreakTimeoutRef = useRef(null);
  const lastContentRef = useRef("");
  const [editingImage, setEditingImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef(null);
  const contentChangeTimeoutRef = useRef(null);

  const {
    handlePaste,
    handleDrop,
    handleDragOver,
    moveImageToPosition,
    updateImageProperties,
    removeImage,
  } = useAdvancedImageHandling(editorRef);

  // Get current paper dimensions based on size and orientation
  const getCurrentPaperDimensions = () => {
    const baseDimensions = paperSizes[editorState.paperSize] || paperSizes.A4;

    if (editorState.orientation === "landscape") {
      return {
        width: baseDimensions.height,
        height: baseDimensions.width,
      };
    }

    return baseDimensions;
  };

  const currentDimensions = getCurrentPaperDimensions();
  const pageWidth = cmToPx(currentDimensions.width);
  const pageHeight = cmToPx(currentDimensions.height);
  const topMargin = cmToPx(editorState.margins.top * 0.7);
  const bottomMargin = cmToPx(editorState.margins.bottom);
  const leftMargin = cmToPx(editorState.margins.left);
  const rightMargin = cmToPx(editorState.margins.right * 1.4);

  // FIXED: Add buffer space before page separators (20px buffer)
  const pageBuffer = 20;
  const availablePageHeight =
    pageHeight - topMargin - bottomMargin - pageBuffer;
  const availablePageWidth = pageWidth - leftMargin - rightMargin;

  // Calculate which page is currently visible
  const calculateCurrentPage = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight;
    const viewportCenter = scrollTop + viewportHeight / 2;

    // Calculate which page the center of the viewport is on
    const pageNumber = Math.floor(viewportCenter / (pageHeight + 20)) + 1; // 20px gap between pages
    setCurrentPage(Math.max(1, pageNumber));
  }, [pageHeight]);

  // Calculate total pages based on content
  const calculateTotalPages = useCallback(() => {
    if (!editorRef.current) return;
    const contentHeight = editorRef.current.scrollHeight;
    const pagesNeeded = Math.max(
      1,
      Math.ceil(contentHeight / availablePageHeight)
    );
    setTotalPages(pagesNeeded);
  }, [availablePageHeight]);

  const insertPageBreak = useCallback(
    (element, insertBefore = true) => {
      const pageBreak = document.createElement("div");
      pageBreak.className = "page-break-auto";
      pageBreak.style.cssText = `
      height: ${pageBuffer}px;
      background: transparent;
      margin: 0;
      padding: 0;
      position: relative;
      page-break-before: always;
      break-before: page;
      clear: both;
    `;
      if (insertBefore) {
        element.parentNode?.insertBefore(pageBreak, element);
      } else {
        element.parentNode?.insertBefore(pageBreak, element.nextSibling);
      }
      return pageBreak;
    },
    [pageBuffer]
  );

  const removeAutoPageBreaks = useCallback(() => {
    if (!editorRef.current) return;
    const autoBreaks = editorRef.current.querySelectorAll(".page-break-auto");
    autoBreaks.forEach((breakEl) => breakEl.remove());
  }, []);

  const calculateAutoPageBreaks = useCallback(() => {
    if (!editorRef.current) return;
    // Debounce to prevent excessive calculations
    if (pageBreakTimeoutRef.current) {
      clearTimeout(pageBreakTimeoutRef.current);
    }
    pageBreakTimeoutRef.current = setTimeout(() => {
      if (!editorRef.current) return;
      // Remove existing auto page breaks
      removeAutoPageBreaks();
      const children = Array.from(editorRef.current.children);
      let currentPageHeight = 0;
      children.forEach((child) => {
        const element = child;

        // Skip auto page breaks
        if (element.classList.contains("page-break-auto")) {
          return;
        }
        // Get element height including margins
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        const marginTop = Number.parseFloat(computedStyle.marginTop) || 0;
        const marginBottom = Number.parseFloat(computedStyle.marginBottom) || 0;
        const elementHeight = rect.height + marginTop + marginBottom;

        // Check if element would overflow current page (with buffer)
        if (
          currentPageHeight + elementHeight > availablePageHeight &&
          currentPageHeight > 0
        ) {
          // Insert page break before this element
          insertPageBreak(element, true);
          currentPageHeight = elementHeight;
        } else {
          currentPageHeight += elementHeight;
        }

        // Handle very tall elements that exceed page height
        if (elementHeight > availablePageHeight) {
          // For very tall elements, just ensure they start on a new page
          if (currentPageHeight > elementHeight) {
            insertPageBreak(element, true);
            currentPageHeight = elementHeight;
          }
        }
      });
      // Calculate total pages after page breaks
      calculateTotalPages();
    }, 100); // 100ms debounce
  }, [
    availablePageHeight,
    insertPageBreak,
    removeAutoPageBreaks,
    calculateTotalPages,
  ]);

  // Process advanced image containers
  const processAdvancedImageContainers = useCallback(() => {
    if (!editorRef.current) return;
    const imageContainers = editorRef.current.querySelectorAll(
      ".advanced-image-container"
    );
    imageContainers.forEach((container) => {
      const img = container.querySelector("img");
      if (img && !container.hasAttribute("data-processed")) {
        container.setAttribute("data-processed", "true");

        // Create React-like handlers for the image
        const handleImageEdit = () => {
          setEditingImage(img);
        };
        const handleImageRemove = () => {
          removeImage(container);
          onContentChange(editorRef.current?.innerHTML || "");
        };
        const handleImageUpdate = (updates) => {
          updateImageProperties(container, updates);
          onContentChange(editorRef.current?.innerHTML || "");
        };
        const handleImageMove = (newPosition) => {
          moveImageToPosition(container, newPosition.x, newPosition.y);
          onContentChange(editorRef.current?.innerHTML || "");
        };

        // Add click handler for image selection
        img.addEventListener("click", (e) => {
          e.stopPropagation();
          handleImageEdit();
        });

        // Store handlers on the container for cleanup
        container._handlers = {
          handleImageEdit,
          handleImageRemove,
          handleImageUpdate,
          handleImageMove,
        };
      }
    });
  }, [
    onContentChange,
    removeImage,
    updateImageProperties,
    moveImageToPosition,
  ]);

  useEffect(() => {
    const handleSelectionChange = () => {
      onSelectionChange();
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [onSelectionChange]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    // Add event listeners for image handling
    editor.addEventListener("paste", handlePaste);
    editor.addEventListener("drop", handleDrop);
    editor.addEventListener("dragover", handleDragOver);
    return () => {
      editor.removeEventListener("paste", handlePaste);
      editor.removeEventListener("drop", handleDrop);
      editor.removeEventListener("dragover", handleDragOver);
    };
  }, [handlePaste, handleDrop, handleDragOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      let element = selection.anchorNode;
      if (element?.nodeType === Node.TEXT_NODE) {
        element = element.parentElement;
      }

      // Check if we're in a list item
      while (element && element.nodeName !== "LI") {
        element = element.parentElement;
      }

      if (element && element.nodeName === "LI") {
        const listItem = element;

        if (e.key === "Enter") {
          const isEmpty =
            listItem.textContent?.trim() === "" ||
            listItem.innerHTML === "&nbsp;";

          if (isEmpty) {
            // Exit list on second Enter
            e.preventDefault();

            const list = listItem.parentElement;
            const p = document.createElement("p");
            p.innerHTML = "&nbsp;";

            if (list && list.children.length === 1) {
              // Replace entire list if it's the only item
              list.parentElement?.replaceChild(p, list);
            } else {
              // Remove this item and add paragraph after list
              listItem.remove();
              list?.parentElement?.insertBefore(p, list.nextSibling);
            }

            // Set cursor in new paragraph
            const range = document.createRange();
            range.setStart(p, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

            return;
          }
        }

        if (e.key === "Tab") {
          e.preventDefault();

          if (e.shiftKey) {
            // Outdent
            const currentList = listItem.parentElement;
            const parentLi = currentList?.parentElement;

            if (parentLi && parentLi.nodeName === "LI") {
              const grandparentList = parentLi.parentElement;
              const newLi = document.createElement("li");
              newLi.innerHTML = listItem.innerHTML;

              if (parentLi.nextSibling) {
                grandparentList?.insertBefore(newLi, parentLi.nextSibling);
              } else {
                grandparentList?.appendChild(newLi);
              }

              listItem.remove();

              if (currentList && currentList.children.length === 0) {
                currentList.remove();
              }

              const range = document.createRange();
              range.setStart(newLi, newLi.childNodes.length);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          } else {
            // Indent
            const currentList = listItem.parentElement;
            const isOrderedList = currentList?.nodeName === "OL";

            const nestedList = document.createElement(
              isOrderedList ? "ol" : "ul"
            );
            if (isOrderedList) {
              nestedList.style.listStyleType = "lower-alpha";
            } else {
              nestedList.style.listStyleType = "circle";
            }

            const newLi = document.createElement("li");
            newLi.innerHTML = listItem.innerHTML;
            nestedList.appendChild(newLi);

            if (listItem.previousElementSibling) {
              listItem.previousElementSibling.appendChild(nestedList);
              listItem.remove();
            } else {
              const parentLi = document.createElement("li");
              parentLi.innerHTML = "&nbsp;";
              parentLi.appendChild(nestedList);
              currentList?.insertBefore(parentLi, listItem);
              listItem.remove();
            }

            const range = document.createRange();
            range.setStart(newLi, newLi.childNodes.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
    };
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("keydown", handleKeyDown);
      return () => editor.removeEventListener("keydown", handleKeyDown);
    }
  }, [editorRef]);

  // Monitor content changes for auto page breaking and image processing
  useEffect(() => {
    if (editorState.content !== lastContentRef.current) {
      lastContentRef.current = editorState.content;
      calculateAutoPageBreaks();
      processAdvancedImageContainers();
    }
  }, [
    editorState.content,
    calculateAutoPageBreaks,
    processAdvancedImageContainers,
  ]);

  // Recalculate page breaks when margins, paper size, or orientation change
  useEffect(() => {
    calculateAutoPageBreaks();
  }, [
    editorState.margins,
    editorState.paperSize,
    editorState.orientation,
    calculateAutoPageBreaks,
  ]);

  // Add scroll listener to track current page
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      calculateCurrentPage();
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [calculateCurrentPage]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (contentChangeTimeoutRef.current) {
        clearTimeout(contentChangeTimeoutRef.current);
      }
      if (pageBreakTimeoutRef.current) {
        clearTimeout(pageBreakTimeoutRef.current);
      }
    };
  }, []);

  // FIXED: Equal margins on both sides
  const marginStyles = {
    paddingTop: `${topMargin}px`,
    paddingBottom: `${bottomMargin + pageBuffer}px`,
    paddingLeft: `${leftMargin}px`,
    paddingRight: `${rightMargin}px`, // FIXED: Use actual rightMargin, not reduced
    minHeight: `${availablePageHeight}px`,
    boxSizing: "border-box",
    overflow: "visible",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    // FIXED: Ensure content is properly centered
    margin: "0 auto",
    maxWidth: `${availablePageWidth}px`,
  };

  // FIXED: Generate page separators that don't hide content
  const generatePageSeparators = () => {
    const separators = [];

    for (let i = 1; i < totalPages; i++) {
      separators.push(
        <div
          key={`separator-${i}`}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: `${i * pageHeight + (i - 1) * 20}px`, // Fixed positioning
            height: "20px",
            zIndex: 5, // LOWER z-index so content appears above
            background: "transparent", // Transparent background
          }}
        >
          {/* Page separator with gap */}
          <div className="h-full bg-gray-100 border-t border-b border-gray-300 opacity-30">
            <div className="flex items-center justify-center h-full">
              <div className="text-xs text-gray-400 bg-white px-2 py-1 rounded opacity-70">
                Page {i + 1}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return separators;
  };

  const handleInput = () => {
    if (editorRef.current) {
      // Clear any pending content change timeout
      if (contentChangeTimeoutRef.current) {
        clearTimeout(contentChangeTimeoutRef.current);
      }
      // Debounce content change to avoid excessive calls
      contentChangeTimeoutRef.current = setTimeout(() => {
        if (editorRef.current) {
          onContentChange(editorRef.current.innerHTML);
        }
      }, 150); // 150ms debounce
    }
  };

  // Handle heading clicks for AI editing
  const handleHeadingClick = useCallback((event) => {
    const target = event.target;

    // Check if clicked element is a heading
    if (target.tagName.match(/^H[1-6]$/)) {
      event.preventDefault();
      event.stopPropagation();

      // Find the heading ID or create one
      let headingId = target.id;
      if (!headingId) {
        const level = Number.parseInt(target.tagName.charAt(1));
        headingId = `heading-${level}-${Date.now()}`;
        target.id = headingId;
      }

      // Trigger heading selection (this will be handled by the parent component)
      const customEvent = new CustomEvent("headingSelect", {
        detail: { headingId },
        bubbles: true,
      });
      target.dispatchEvent(customEvent);
    }
  }, []);

  const handleImageEditorUpdate = (updates) => {
    if (!editingImage) return;
    const container = editingImage.closest(".advanced-image-container");
    if (container) {
      updateImageProperties(container, updates);
      onContentChange(editorRef.current?.innerHTML || "");
    }
  };

  const handleImageEditorRemove = () => {
    if (!editingImage) return;

    const container = editingImage.closest(".advanced-image-container");
    if (container) {
      removeImage(container);
      onContentChange(editorRef.current?.innerHTML || "");
    }
    setEditingImage(null);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="flex-1 bg-gray-100 p-8 overflow-auto"
        style={{ position: "relative" }}
      >
        <div
          className="mx-auto bg-white shadow-lg relative transition-all duration-300 ease-in-out"
          style={{
            width: `${pageWidth}px`,
            minHeight: `${totalPages * pageHeight + (totalPages - 1) * 20}px`, // Include gaps
            maxWidth: `${pageWidth}px`,
          }}
        >
          {/* FIXED: Page separators with lower z-index and transparency */}
          {generatePageSeparators()}

          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onClick={(e) => {
              onSelectionChange();
              handleHeadingClick(e);
            }}
            onKeyUp={onSelectionChange}
            style={{
              ...marginStyles,
              lineHeight: editorState.lineSpacing,
              outline: "none",
              position: "relative",
              zIndex: 10, // Higher z-index so content appears above separators
              fontSize: "14px",
              fontFamily: '"Times New Roman", Times, serif',
              color: "#000000",
              textAlign: "justify",
              // REMOVED: width constraint that was causing issues
            }}
            className="prose max-w-none editor-content"
            data-placeholder="Start typing your document... Use headings (H1-H6) to create sections that can be edited with AI."
          />
        </div>

        {/* Page indicator at bottom */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-lg z-50">
          <div className="text-sm text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      {/* Advanced Image Editor Modal */}
      {editingImage && (
        <AdvancedImageEditor
          imageElement={editingImage}
          onUpdate={handleImageEditorUpdate}
          onRemove={handleImageEditorRemove}
          onClose={() => setEditingImage(null)}
        />
      )}

      <style jsx>{`
        .editor-content {
          /* Ensure proper text flow */
          overflow: visible;
          position: relative;
        }

        .editor-content p {
          margin: 0 0 1em 0;
          line-height: inherit;
        }

        .editor-content h1,
        .editor-content h2,
        .editor-content h3,
        .editor-content h4,
        .editor-content h5,
        .editor-content h6 {
          margin: 1.5em 0 0.5em 0;
          line-height: 1.3;
          font-weight: bold;
        }

        .editor-content h1 {
          font-size: 2em;
        }
        .editor-content h2 {
          font-size: 1.5em;
        }
        .editor-content h3 {
          font-size: 1.17em;
        }
        .editor-content h4 {
          font-size: 1em;
        }
        .editor-content h5 {
          font-size: 0.83em;
        }
        .editor-content h6 {
          font-size: 0.67em;
        }

        .editor-content ul,
        .editor-content ol {
          margin: 1em 0;
          padding-left: 2em;
        }

        .editor-content li {
          margin: 0.5em 0;
          line-height: inherit;
        }

        .editor-content blockquote {
          margin: 1em 2em;
          padding-left: 1em;
          border-left: 3px solid #ccc;
          font-style: italic;
        }

        .editor-content [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #999;
          font-style: italic;
        }

        /* Image containers */
        .editor-content .advanced-image-container {
          display: block;
          max-width: 100%;
          margin: 0.5em 0;
        }

        .editor-content .advanced-image-container img {
          max-width: 100%;
          height: auto;
          display: block;
        }

        /* Page break elements */
        .page-break-auto {
          display: block !important;
          clear: both !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
    </>
  );
};
