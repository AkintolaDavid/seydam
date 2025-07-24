import { useState, useCallback, useRef, useEffect } from 'react';

export const useUndoRedo = (
  initialContent = '',
  maxHistorySize = 50
) => {
  const [history, setHistory] = useState([
    { content: initialContent, timestamp: Date.now(), description: 'Initial state' }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUndoRedoOperation, setIsUndoRedoOperation] = useState(false);
  const debounceTimeoutRef = useRef();
  const lastSaveTimeRef = useRef(Date.now());

  // Add new state to history
  const saveState = useCallback((content, description = 'Edit') => {
    if (isUndoRedoOperation) return;

    const now = Date.now();
    const timeSinceLastSave = now - lastSaveTimeRef.current;
    
    // Debounce rapid changes (don't save if less than 500ms since last save and it's a simple edit)
    if (timeSinceLastSave < 500 && description === 'Edit') {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      debounceTimeoutRef.current = setTimeout(() => {
        saveState(content, description);
      }, 500);
      return;
    }

    lastSaveTimeRef.current = now;

    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      const newState = {
        content,
        timestamp: now,
        description
      };
      
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        setCurrentIndex(prev => Math.max(0, prev - 1));
        return newHistory;
      }
      
      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [currentIndex, isUndoRedoOperation, maxHistorySize]);

  // Undo operation
  const undo = useCallback((steps = 1) => {
    const newIndex = Math.max(0, currentIndex - steps);
    if (newIndex !== currentIndex) {
      setIsUndoRedoOperation(true);
      setCurrentIndex(newIndex);
      
      // Reset flag after a brief delay to allow the operation to complete
      setTimeout(() => setIsUndoRedoOperation(false), 100);
      
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  // Redo operation
  const redo = useCallback((steps = 1) => {
    const newIndex = Math.min(history.length - 1, currentIndex + steps);
    if (newIndex !== currentIndex) {
      setIsUndoRedoOperation(true);
      setCurrentIndex(newIndex);
      
      // Reset flag after a brief delay to allow the operation to complete
      setTimeout(() => setIsUndoRedoOperation(false), 100);
      
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  // Get current state
  const getCurrentState = useCallback(() => {
    return history[currentIndex];
  }, [history, currentIndex]);

  // Check if undo/redo is available
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Get available undo/redo counts
  const undoCount = currentIndex;
  const redoCount = history.length - 1 - currentIndex;

  // Get recent history for dropdown
  const getRecentHistory = useCallback((count = 10) => {
    const start = Math.max(0, currentIndex - count + 1);
    const end = currentIndex + 1;
    return history.slice(start, end).reverse();
  }, [history, currentIndex]);

  // Clear history (useful for new documents)
  const clearHistory = useCallback((newContent = '') => {
    setHistory([{ content: newContent, timestamp: Date.now(), description: 'Document cleared' }]);
    setCurrentIndex(0);
    setIsUndoRedoOperation(false);
    lastSaveTimeRef.current = Date.now();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveState,
    undo,
    redo,
    getCurrentState,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    getRecentHistory,
    clearHistory,
    isUndoRedoOperation,
    currentIndex,
    historyLength: history.length
  };
};