import { useState, useCallback, useRef } from 'react';
import { useUndoRedo } from './useUndoRedo';

const defaultHeadingStyles = [
  { 
    id: 'h1', 
    name: 'Heading 1', 
    fontSize: 24, 
    fontFamily: 'Arial', 
    fontWeight: 'bold', 
    color: '#1a1a8c', 
    alignment: 'left',
    bold: true,
    italic: false,
    underline: false,
  },
  { 
    id: 'h2', 
    name: 'Heading 2', 
    fontSize: 20, 
    fontFamily: 'Arial', 
    fontWeight: 'bold', 
    color: '#1a1a8c', 
    alignment: 'left',
    bold: true,
    italic: false,
    underline: false,
  },
  { 
    id: 'h3', 
    name: 'Heading 3', 
    fontSize: 16, 
    fontFamily: 'Arial', 
    fontWeight: 'bold', 
    color: '#1a1a8c', 
    alignment: 'left',
    bold: true,
    italic: false,
    underline: false,
  },
  { 
    id: 'h4', 
    name: 'Heading 4', 
    fontSize: 14, 
    fontFamily: 'Arial', 
    fontWeight: 'bold', 
    color: '#1a1a8c', 
    alignment: 'left',
    bold: true,
    italic: false,
    underline: false,
  },
  { 
    id: 'h5', 
    name: 'Heading 5', 
    fontSize: 12, 
    fontFamily: 'Arial', 
    fontWeight: 'bold', 
    color: '#1a1a8c', 
    alignment: 'left',
    bold: true,
    italic: false,
    underline: false,
  },
  { 
    id: 'h6', 
    name: 'Heading 6', 
    fontSize: 11, 
    fontFamily: 'Arial', 
    fontWeight: 'bold', 
    color: '#1a1a8c', 
    alignment: 'left',
    bold: true,
    italic: false,
    underline: false,
  },
];

const defaultMargins = {
  top: 2.5,
  bottom: 2.5,
  left: 3.0,
  right: 2.0,
};

export const useEditor = () => {
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState({
    content: '',
    selection: null,
    headingStyles: defaultHeadingStyles,
    margins: defaultMargins,
    lineSpacing: 1.15,
    paperSize: 'A4',
    orientation: 'portrait',
    currentFormat: {
      bold: false,
      italic: false,
      underline: false,
      fontSize: 12,
      fontFamily: 'Arial',
      alignment: 'left',
    },
  });

  // Initialize undo/redo system
  const {
    saveState,
    undo: undoOperation,
    redo: redoOperation,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    getRecentHistory,
    clearHistory,
    isUndoRedoOperation
  } = useUndoRedo(editorState.content);

  const getCurrentListType = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 'none';
    
    let element = selection.anchorNode;
    if (element?.nodeType === Node.TEXT_NODE) {
      element = element.parentElement;
    }
    
    while (element && element !== editorRef.current) {
      if (element.nodeName === 'LI') {
        const parent = element.parentElement;
        if (parent?.nodeName === 'UL') return 'bullet';
        if (parent?.nodeName === 'OL') return 'numbered';
      }
      element = element.parentElement;
    }
    
    return 'none';
  }, []);

  const updateSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setEditorState(prev => ({ ...prev, selection: range }));
      
      // Update current format based on selection - but prevent inheritance issues
      const element = range.startContainer.parentElement;
      if (element && editorRef.current?.contains(element)) {
        const computedStyle = window.getComputedStyle(element);
        
        // Only update format if we're actually in a formatted element
        // Prevent heading styles from affecting unrelated content
        let actualFontSize = 12; // Default
        let actualFontFamily = 'Arial'; // Default
        
        // Check if we're directly in a styled element (not just near one)
        if (element.style.fontSize) {
          actualFontSize = parseInt(element.style.fontSize) || 12;
        } else if (element.tagName && ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
          actualFontSize = parseInt(computedStyle.fontSize) || 12;
        }
        
        if (element.style.fontFamily) {
          actualFontFamily = element.style.fontFamily.replace(/"/g, '') || 'Arial';
        } else if (element.tagName && ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
          actualFontFamily = computedStyle.fontFamily.replace(/"/g, '') || 'Arial';
        }
        
        setEditorState(prev => ({
          ...prev,
          currentFormat: {
            bold: computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 600,
            italic: computedStyle.fontStyle === 'italic',
            underline: computedStyle.textDecoration.includes('underline'),
            fontSize: actualFontSize,
            fontFamily: actualFontFamily,
            alignment: computedStyle.textAlign || 'left',
          },
        }));
      }
    }
  }, []);

  const executeCommand = useCallback((command, value) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    // Save state before command for undo functionality
    const currentContent = editorRef.current.innerHTML;
    
    // Special handling for font commands to apply only to selected text
    if (command === 'fontSize' || command === 'fontName' || command === 'lineHeight') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        if (!range.collapsed) {
          // Apply formatting to selection only
          const span = document.createElement('span');
          
          if (command === 'fontSize') {
            span.style.fontSize = `${value}px`;
          } else if (command === 'fontName') {
            span.style.fontFamily = value || 'Arial';
          } else if (command === 'lineHeight') {
            span.style.lineHeight = value || '1.15';
          }
          
          try {
            // Check if the selection contains multiple elements
            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
            
            // Restore selection to the new span
            range.selectNodeContents(span);
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (e) {
            console.warn('Could not apply formatting to selection:', e);
            // Fallback to document.execCommand
            document.execCommand(command, false, value);
          }
        } else {
          // No selection, apply to current position for future typing
          document.execCommand(command, false, value);
        }
      }
    } else {
      // For other commands, use the standard approach
      document.execCommand(command, false, value);
    }
    
    updateSelection();
    
    // Save state after command
    setTimeout(() => {
      if (editorRef.current && !isUndoRedoOperation) {
        const newContent = editorRef.current.innerHTML;
        if (newContent !== currentContent) {
          saveState(newContent, getCommandDescription(command, value));
        }
      }
    }, 10);
  }, [updateSelection, saveState, isUndoRedoOperation]);

  const getCommandDescription = (command, value) => {
    switch (command) {
      case 'bold': return 'Bold formatting';
      case 'italic': return 'Italic formatting';
      case 'underline': return 'Underline formatting';
      case 'fontSize': return `Font size: ${value}px`;
      case 'fontName': return `Font: ${value}`;
      case 'justifyLeft': return 'Align left';
      case 'justifyCenter': return 'Align center';
      case 'justifyRight': return 'Align right';
      case 'justifyFull': return 'Justify';
      case 'insertOrderedList': return 'Numbered list';
      case 'insertUnorderedList': return 'Bullet list';
      case 'indent': return 'Increase indent';
      case 'outdent': return 'Decrease indent';
      default: return 'Text formatting';
    }
  };

  const extractParagraphsFromSelection = (range) => {
    const container = document.createElement('div');
    container.appendChild(range.cloneContents());
    
    // Get all text content and split by various paragraph indicators
    let textContent = container.innerHTML;
    
    // Replace various HTML elements that indicate paragraph breaks
    textContent = textContent
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
      .replace(/&nbsp;/g, ' '); // Replace non-breaking spaces
    
    // Split by newlines and filter out empty lines
    const paragraphs = textContent
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    return paragraphs;
  };

  const handleListToggle = useCallback((type, style) => {
    if (!editorRef.current) return;
    
    const currentContent = editorRef.current.innerHTML;
    editorRef.current.focus();
    const currentType = getCurrentListType();
    
    // If already in the same list type, toggle it off
    if (currentType === type) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let element = selection.anchorNode;
        if (element?.nodeType === Node.TEXT_NODE) {
          element = element.parentElement;
        }
        
        // Find the list item
        while (element && element.nodeName !== 'LI') {
          element = element.parentElement;
        }
        
        if (element && element.nodeName === 'LI') {
          const listElement = element.parentElement;
          const textContent = element.textContent || '';
          
          // Replace list item with paragraph
          const p = document.createElement('p');
          p.textContent = textContent;
          // Ensure paragraph maintains base styling
          p.style.fontSize = '12px';
          p.style.fontFamily = 'Arial, sans-serif';
          p.style.color = '#000000';
          
          if (listElement && listElement.children.length === 1) {
            // If this is the only item, replace the entire list
            listElement.parentElement?.replaceChild(p, listElement);
          } else {
            // Replace just this item
            element.parentElement?.replaceChild(p, element);
          }
          
          // Set cursor position
          const range = document.createRange();
          const sel = window.getSelection();
          range.setStart(p, 0);
          range.collapse(true);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }
      updateSelection();
      
      // Save state for undo
      setTimeout(() => {
        if (editorRef.current && !isUndoRedoOperation) {
          const newContent = editorRef.current.innerHTML;
          if (newContent !== currentContent) {
            saveState(newContent, 'Remove list');
          }
        }
      }, 10);
      return;
    }
    
    // Handle selection and convert to list
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      if (!range.collapsed) {
        // Extract paragraphs from selection, preserving paragraph structure
        const paragraphs = extractParagraphsFromSelection(range);
        
        if (paragraphs.length > 0) {
          const listType = type === 'bullet' ? 'ul' : 'ol';
          const listElement = document.createElement(listType);
          
          // Apply base styling to prevent inheritance issues
          listElement.style.fontSize = '12px';
          listElement.style.fontFamily = 'Arial, sans-serif';
          listElement.style.color = '#000000';
          
          // Apply custom style
          if (style) {
            if (type === 'bullet') {
              listElement.style.listStyleType = style === 'arrow' ? 'none' : 
                                                style === 'checkmark' ? 'none' : style;
            } else {
              listElement.style.listStyleType = style;
            }
          }
          
          // Create a list item for each paragraph
          paragraphs.forEach(paragraphText => {
            const li = document.createElement('li');
            
            // Ensure list item maintains base styling
            li.style.fontSize = '12px';
            li.style.fontFamily = 'Arial, sans-serif';
            li.style.color = '#000000';
            
            // Handle special bullet styles
            if (type === 'bullet' && (style === 'arrow' || style === 'checkmark')) {
              const symbol = style === 'arrow' ? '➤' : '✓';
              li.innerHTML = `<span style="margin-right: 8px;">${symbol}</span>${paragraphText}`;
              li.style.listStyleType = 'none';
            } else {
              li.textContent = paragraphText;
            }
            
            listElement.appendChild(li);
          });
          
          // Replace the selected content with the list
          range.deleteContents();
          range.insertNode(listElement);
          
          // Position cursor at end of last item
          const lastItem = listElement.lastElementChild;
          if (lastItem) {
            const newRange = document.createRange();
            newRange.setStart(lastItem, lastItem.childNodes.length);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
      } else {
        // Create new list at cursor position
        const listType = type === 'bullet' ? 'ul' : 'ol';
        const listElement = document.createElement(listType);
        const li = document.createElement('li');
        
        // Apply base styling to prevent inheritance issues
        listElement.style.fontSize = '12px';
        listElement.style.fontFamily = 'Arial, sans-serif';
        listElement.style.color = '#000000';
        li.style.fontSize = '12px';
        li.style.fontFamily = 'Arial, sans-serif';
        li.style.color = '#000000';
        
        // Apply custom style
        if (style) {
          if (type === 'bullet') {
            listElement.style.listStyleType = style === 'arrow' ? 'none' : 
                                              style === 'checkmark' ? 'none' : style;
          } else {
            listElement.style.listStyleType = style;
          }
        }
        
        // Handle special bullet styles
        if (type === 'bullet' && (style === 'arrow' || style === 'checkmark')) {
          const symbol = style === 'arrow' ? '➤' : '✓';
          li.innerHTML = `<span style="margin-right: 8px;">${symbol}</span>`;
          li.style.listStyleType = 'none';
        } else {
          li.innerHTML = '&nbsp;';
        }
        
        listElement.appendChild(li);
        range.insertNode(listElement);
        
        // Position cursor inside the list item
        const newRange = document.createRange();
        newRange.setStart(li, li.childNodes.length);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
    
    updateSelection();
    
    // Save state for undo
    setTimeout(() => {
      if (editorRef.current && !isUndoRedoOperation) {
        const newContent = editorRef.current.innerHTML;
        if (newContent !== currentContent) {
          saveState(newContent, `Create ${type} list`);
        }
      }
    }, 10);
  }, [getCurrentListType, updateSelection, saveState, isUndoRedoOperation]);

  const handleIndent = useCallback(() => {
    if (!editorRef.current) return;
    
    const currentContent = editorRef.current.innerHTML;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    let element = selection.anchorNode;
    if (element?.nodeType === Node.TEXT_NODE) {
      element = element.parentElement;
    }
    
    // Find the list item
    while (element && element.nodeName !== 'LI') {
      element = element.parentElement;
    }
    
    if (element && element.nodeName === 'LI') {
      const currentList = element.parentElement;
      const isOrderedList = currentList?.nodeName === 'OL';
      
      // Create nested list
      const nestedList = document.createElement(isOrderedList ? 'ol' : 'ul');
      
      // Apply base styling to prevent inheritance issues
      nestedList.style.fontSize = '12px';
      nestedList.style.fontFamily = 'Arial, sans-serif';
      nestedList.style.color = '#000000';
      
      if (isOrderedList) {
        nestedList.style.listStyleType = 'lower-alpha';
      } else {
        nestedList.style.listStyleType = 'circle';
      }
      
      const newLi = document.createElement('li');
      newLi.innerHTML = element.innerHTML;
      
      // Apply base styling to prevent inheritance issues
      newLi.style.fontSize = '12px';
      newLi.style.fontFamily = 'Arial, sans-serif';
      newLi.style.color = '#000000';
      
      nestedList.appendChild(newLi);
      
      // Insert nested list
      if (element.previousElementSibling) {
        element.previousElementSibling.appendChild(nestedList);
        element.remove();
      } else {
        // Create a new parent item
        const parentLi = document.createElement('li');
        parentLi.innerHTML = '&nbsp;';
        parentLi.style.fontSize = '12px';
        parentLi.style.fontFamily = 'Arial, sans-serif';
        parentLi.style.color = '#000000';
        parentLi.appendChild(nestedList);
        currentList?.insertBefore(parentLi, element);
        element.remove();
      }
      
      // Set cursor position
      const range = document.createRange();
      range.setStart(newLi, newLi.childNodes.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Save state for undo
      setTimeout(() => {
        if (editorRef.current && !isUndoRedoOperation) {
          const newContent = editorRef.current.innerHTML;
          if (newContent !== currentContent) {
            saveState(newContent, 'Increase indent');
          }
        }
      }, 10);
    } else {
      // Regular indent for non-list content
      executeCommand('indent');
    }
  }, [executeCommand, saveState, isUndoRedoOperation]);

  const handleOutdent = useCallback(() => {
    if (!editorRef.current) return;
    
    const currentContent = editorRef.current.innerHTML;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    let element = selection.anchorNode;
    if (element?.nodeType === Node.TEXT_NODE) {
      element = element.parentElement;
    }
    
    // Find the list item
    while (element && element.nodeName !== 'LI') {
      element = element.parentElement;
    }
    
    if (element && element.nodeName === 'LI') {
      const currentList = element.parentElement;
      const parentLi = currentList?.parentElement;
      
      if (parentLi && parentLi.nodeName === 'LI') {
        // Move item to parent level
        const grandparentList = parentLi.parentElement;
        const newLi = document.createElement('li');
        newLi.innerHTML = element.innerHTML;
        
        // Apply base styling to prevent inheritance issues
        newLi.style.fontSize = '12px';
        newLi.style.fontFamily = 'Arial, sans-serif';
        newLi.style.color = '#000000';
        
        // Insert after the parent item
        if (parentLi.nextSibling) {
          grandparentList?.insertBefore(newLi, parentLi.nextSibling);
        } else {
          grandparentList?.appendChild(newLi);
        }
        
        element.remove();
        
        // Clean up empty lists
        if (currentList && currentList.children.length === 0) {
          currentList.remove();
        }
        
        // Set cursor position
        const range = document.createRange();
        range.setStart(newLi, newLi.childNodes.length);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Save state for undo
        setTimeout(() => {
          if (editorRef.current && !isUndoRedoOperation) {
            const newContent = editorRef.current.innerHTML;
            if (newContent !== currentContent) {
              saveState(newContent, 'Decrease indent');
            }
          }
        }, 10);
      }
    } else {
      // Regular outdent for non-list content
      executeCommand('outdent');
    }
  }, [executeCommand, saveState, isUndoRedoOperation]);

  const updateHeadingStyle = useCallback((styleId, updates) => {
    setEditorState(prev => {
      const newStyles = prev.headingStyles.map(style =>
        style.id === styleId ? { ...style, ...updates } : style
      );
      
      // Apply changes to existing elements using this style
      if (editorRef.current) {
        const elements = editorRef.current.querySelectorAll(`[data-heading-style="${styleId}"]`);
        elements.forEach(element => {
          const htmlElement = element;
          const updatedStyle = newStyles.find(s => s.id === styleId);
          if (updatedStyle) {
            htmlElement.style.fontSize = `${updatedStyle.fontSize}px`;
            htmlElement.style.fontFamily = updatedStyle.fontFamily;
            htmlElement.style.fontWeight = updatedStyle.bold ? 'bold' : updatedStyle.fontWeight;
            htmlElement.style.fontStyle = updatedStyle.italic ? 'italic' : 'normal';
            htmlElement.style.textDecoration = updatedStyle.underline ? 'underline' : 'none';
            htmlElement.style.color = updatedStyle.color;
            htmlElement.style.textAlign = updatedStyle.alignment;
          }
        });
      }
      
      return { ...prev, headingStyles: newStyles };
    });
  }, []);

  const addCustomHeadingStyle = useCallback((style) => {
    const newId = `custom-${Date.now()}`;
    const newStyle = { ...style, id: newId };
    
    setEditorState(prev => ({
      ...prev,
      headingStyles: [...prev.headingStyles, newStyle]
    }));
  }, []);

  const deleteHeadingStyle = useCallback((styleId) => {
    // Don't allow deletion of default heading styles
    if (styleId.startsWith('h')) return;
    
    setEditorState(prev => ({
      ...prev,
      headingStyles: prev.headingStyles.filter(style => style.id !== styleId)
    }));
  }, []);

  const updateMargins = useCallback((margins) => {
    setEditorState(prev => ({ ...prev, margins }));
  }, []);

  const updateLineSpacing = useCallback((spacing) => {
    setEditorState(prev => ({ ...prev, lineSpacing: spacing }));
    
    // Apply line spacing to selected text only if there's a selection
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.lineHeight = spacing.toString();
      
      try {
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
        
        // Restore selection
        range.selectNodeContents(span);
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (e) {
        console.warn('Could not apply line spacing to selection:', e);
      }
    } else if (editorRef.current) {
      // If no selection, apply to the entire editor
      editorRef.current.style.lineHeight = spacing.toString();
    }
  }, []);

  const updatePaperSize = useCallback((paperSize) => {
    setEditorState(prev => ({ ...prev, paperSize }));
  }, []);

  const updateOrientation = useCallback((orientation) => {
    setEditorState(prev => ({ ...prev, orientation }));
  }, []);

  // Undo/Redo handlers that update the editor content
  const handleUndo = useCallback((steps = 1) => {
    const state = undoOperation(steps);
    if (state && editorRef.current) {
      editorRef.current.innerHTML = state.content;
      setEditorState(prev => ({ ...prev, content: state.content }));
      updateSelection();
    }
  }, [undoOperation, updateSelection]);

  const handleRedo = useCallback((steps = 1) => {
    const state = redoOperation(steps);
    if (state && editorRef.current) {
      editorRef.current.innerHTML = state.content;
      setEditorState(prev => ({ ...prev, content: state.content }));
      updateSelection();
    }
  }, [redoOperation, updateSelection]);

  // Handle content changes and save to history
  const handleContentChange = useCallback((content) => {
    setEditorState(prev => ({ ...prev, content }));
    
    // Save state for undo (debounced)
    if (!isUndoRedoOperation) {
      saveState(content, 'Edit');
    }
  }, [saveState, isUndoRedoOperation]);

  return {
    editorRef,
    editorState,
    setEditorState,
    updateSelection,
    executeCommand,
    updateHeadingStyle,
    addCustomHeadingStyle,
    deleteHeadingStyle,
    updateMargins,
    updateLineSpacing,
    updatePaperSize,
    updateOrientation,
    handleListToggle,
    handleIndent,
    handleOutdent,
    getCurrentListType,
    handleContentChange,
    // Undo/Redo functionality
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    getRecentHistory,
    clearHistory,
  };
};