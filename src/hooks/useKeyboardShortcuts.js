import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = ({
  onUndo,
  onRedo,
  onSave,
  onBold,
  onItalic,
  onUnderline,
  canUndo,
  canRedo
}) => {
  const handleKeyDown = useCallback((event) => {
    // Check if we're in an input field or textarea (but not contentEditable)
    const target = event.target;
    const isInInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
    const isInContentEditable = target.contentEditable === 'true';
    
    // Only prevent default for contentEditable areas, not regular inputs
    const shouldHandleShortcut = isInContentEditable || (!isInInput && !target.closest('input, textarea, select'));
    
    if (!shouldHandleShortcut) return;

    const { ctrlKey, metaKey, shiftKey, key } = event;
    const isCtrlOrCmd = ctrlKey || metaKey;

    if (isCtrlOrCmd) {
      switch (key.toLowerCase()) {
        case 'z':
          event.preventDefault();
          if (shiftKey) {
            // Ctrl+Shift+Z or Cmd+Shift+Z for Redo
            if (canRedo) {
              onRedo();
            }
          } else {
            // Ctrl+Z or Cmd+Z for Undo
            if (canUndo) {
              onUndo();
            }
          }
          break;
          
        case 'y':
          // Ctrl+Y for Redo (Windows standard)
          if (!shiftKey && canRedo) {
            event.preventDefault();
            onRedo();
          }
          break;
          
        case 's':
          // Ctrl+S for Save
          if (onSave && !shiftKey) {
            event.preventDefault();
            onSave();
          }
          break;
          
        case 'b':
          // Ctrl+B for Bold
          if (onBold && !shiftKey && isInContentEditable) {
            event.preventDefault();
            onBold();
          }
          break;
          
        case 'i':
          // Ctrl+I for Italic
          if (onItalic && !shiftKey && isInContentEditable) {
            event.preventDefault();
            onItalic();
          }
          break;
          
        case 'u':
          // Ctrl+U for Underline
          if (onUnderline && !shiftKey && isInContentEditable) {
            event.preventDefault();
            onUnderline();
          }
          break;
      }
    }
  }, [onUndo, onRedo, onSave, onBold, onItalic, onUnderline, canUndo, canRedo]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Return the current shortcuts for display purposes
  const shortcuts = {
    undo: navigator.platform.includes('Mac') ? '⌘Z' : 'Ctrl+Z',
    redo: navigator.platform.includes('Mac') ? '⌘⇧Z' : 'Ctrl+Shift+Z',
    redoAlt: navigator.platform.includes('Mac') ? '' : 'Ctrl+Y',
    save: navigator.platform.includes('Mac') ? '⌘S' : 'Ctrl+S',
    bold: navigator.platform.includes('Mac') ? '⌘B' : 'Ctrl+B',
    italic: navigator.platform.includes('Mac') ? '⌘I' : 'Ctrl+I',
    underline: navigator.platform.includes('Mac') ? '⌘U' : 'Ctrl+U',
  };

  return { shortcuts };
};