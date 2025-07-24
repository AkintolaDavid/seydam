import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Edit3, 
  Trash2, 
  Move, 
  RotateCw, 
  Crop, 
  Upload, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react';

export const DraggableImage = ({
  src,
  alt = '',
  width = 300,
  height = 200,
  alignment = 'left',
  caption = '',
  onUpdate,
  onRemove,
  onEdit,
  onMove,
  editorRef
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeData, setResizeData] = useState({ 
    startWidth: 0, 
    startHeight: 0, 
    startX: 0, 
    startY: 0,
    handle: ''
  });
  const [editingCaption, setEditingCaption] = useState(false);
  const [tempCaption, setTempCaption] = useState(caption);

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollTimeoutRef = useRef();

  // Auto-scroll during drag
  const handleAutoScroll = useCallback((clientY) => {
    if (!editorRef.current) return;

    const editorRect = editorRef.current.getBoundingClientRect();
    const scrollThreshold = 50;
    const scrollSpeed = 10;

    if (clientY < editorRect.top + scrollThreshold) {
      // Scroll up
      editorRef.current.scrollTop -= scrollSpeed;
    } else if (clientY > editorRect.bottom - scrollThreshold) {
      // Scroll down
      editorRef.current.scrollTop += scrollSpeed;
    }
  }, [editorRef]);

  // Handle drag start
  const handleMouseDown = useCallback((e, action, handle) => {
    e.preventDefault();
    e.stopPropagation();

    if (action === 'drag') {
      setIsDragging(true);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    } else if (action === 'resize' && handle) {
      setIsResizing(true);
      setResizeData({
        startWidth: width,
        startHeight: height,
        startX: e.clientX,
        startY: e.clientY,
        handle
      });
    }
  }, [width, height]);

  // Handle mouse move for drag and resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        handleAutoScroll(e.clientY);
        
        // Update position for visual feedback
        if (containerRef.current) {
          const newX = e.clientX - dragOffset.x;
          const newY = e.clientY - dragOffset.y;
          
          containerRef.current.style.position = 'fixed';
          containerRef.current.style.left = `${newX}px`;
          containerRef.current.style.top = `${newY}px`;
          containerRef.current.style.zIndex = '1000';
          containerRef.current.style.pointerEvents = 'none';
        }
      } else if (isResizing) {
        const deltaX = e.clientX - resizeData.startX;
        const deltaY = e.clientY - resizeData.startY;
        
        let newWidth = resizeData.startWidth;
        let newHeight = resizeData.startHeight;
        
        // Calculate new dimensions based on resize handle
        switch (resizeData.handle) {
          case 'se': // Southeast
            newWidth = resizeData.startWidth + deltaX;
            newHeight = resizeData.startHeight + deltaY;
            break;
          case 'sw': // Southwest
            newWidth = resizeData.startWidth - deltaX;
            newHeight = resizeData.startHeight + deltaY;
            break;
          case 'ne': // Northeast
            newWidth = resizeData.startWidth + deltaX;
            newHeight = resizeData.startHeight - deltaY;
            break;
          case 'nw': // Northwest
            newWidth = resizeData.startWidth - deltaX;
            newHeight = resizeData.startHeight - deltaY;
            break;
          case 'e': // East
            newWidth = resizeData.startWidth + deltaX;
            break;
          case 'w': // West
            newWidth = resizeData.startWidth - deltaX;
            break;
          case 'n': // North
            newHeight = resizeData.startHeight - deltaY;
            break;
          case 's': // South
            newHeight = resizeData.startHeight + deltaY;
            break;
        }
        
        // Maintain aspect ratio unless Shift is held
        if (!e.shiftKey && imageRef.current) {
          const aspectRatio = imageRef.current.naturalWidth / imageRef.current.naturalHeight;
          if (resizeData.handle.includes('e') || resizeData.handle.includes('w')) {
            newHeight = newWidth / aspectRatio;
          } else if (resizeData.handle.includes('n') || resizeData.handle.includes('s')) {
            newWidth = newHeight * aspectRatio;
          } else {
            // Corner handles - use the larger change
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              newHeight = newWidth / aspectRatio;
            } else {
              newWidth = newHeight * aspectRatio;
            }
          }
        }
        
        // Apply minimum constraints
        newWidth = Math.max(50, newWidth);
        newHeight = Math.max(50, newHeight);
        
        onUpdate({ width: Math.round(newWidth), height: Math.round(newHeight) });
      }
    };

    const handleMouseUp = (e) => {
      if (isDragging) {
        // Find drop position in editor
        if (editorRef.current && containerRef.current) {
          const editorRect = editorRef.current.getBoundingClientRect();
          const relativeX = e.clientX - editorRect.left + editorRef.current.scrollLeft;
          const relativeY = e.clientY - editorRect.top + editorRef.current.scrollTop;
          
          // Reset positioning
          containerRef.current.style.position = '';
          containerRef.current.style.left = '';
          containerRef.current.style.top = '';
          containerRef.current.style.zIndex = '';
          containerRef.current.style.pointerEvents = '';
          
          onMove({ x: relativeX, y: relativeY });
        }
        setIsDragging(false);
      }
      
      if (isResizing) {
        setIsResizing(false);
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Auto-scroll during drag
      if (isDragging) {
        const scrollInterval = setInterval(() => {
          if (isDragging) {
            // This will be handled by mousemove event
          }
        }, 16); // ~60fps
        
        return () => {
          clearInterval(scrollInterval);
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeData, onUpdate, onMove, handleAutoScroll, editorRef]);

  // Handle click outside to deselect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsSelected(false);
        setShowToolbar(false);
        setShowContextMenu(false);
      }
    };

    if (isSelected) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelected]);

  // Handle context menu
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
    setIsSelected(true);
  }, []);

  // Handle file replacement
  const handleFileReplace = useCallback(() => {
    fileInputRef.current?.click();
    setShowContextMenu(false);
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdate({ src: reader.result });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }, [onUpdate]);

  // Handle caption editing
  const handleCaptionSave = useCallback(() => {
    onUpdate({ caption: tempCaption });
    setEditingCaption(false);
  }, [tempCaption, onUpdate]);

  const handleCaptionCancel = useCallback(() => {
    setTempCaption(caption);
    setEditingCaption(false);
  }, [caption]);

  // Get alignment styles
  const getAlignmentStyles = () => {
    switch (alignment) {
      case 'center':
        return { display: 'block', margin: '10px auto' };
      case 'right':
        return { display: 'block', marginLeft: 'auto', marginRight: '0', margin: '10px 0 10px auto' };
      default:
        return { display: 'block', margin: '10px 0' };
    }
  };

  // Resize handles
  const renderResizeHandles = () => {
    if (!isSelected || isDragging) return null;

    const handles = [
      { position: 'nw', cursor: 'nw-resize', style: { top: -4, left: -4 } },
      { position: 'ne', cursor: 'ne-resize', style: { top: -4, right: -4 } },
      { position: 'sw', cursor: 'sw-resize', style: { bottom: -4, left: -4 } },
      { position: 'se', cursor: 'se-resize', style: { bottom: -4, right: -4 } },
      { position: 'n', cursor: 'n-resize', style: { top: -4, left: '50%', transform: 'translateX(-50%)' } },
      { position: 's', cursor: 's-resize', style: { bottom: -4, left: '50%', transform: 'translateX(-50%)' } },
      { position: 'w', cursor: 'w-resize', style: { top: '50%', left: -4, transform: 'translateY(-50%)' } },
      { position: 'e', cursor: 'e-resize', style: { top: '50%', right: -4, transform: 'translateY(-50%)' } },
    ];

    return (
      <>
        {handles.map(handle => (
          <div
            key={handle.position}
            className="absolute w-2 h-2 bg-[#1a1a8c] border border-white cursor-pointer z-10"
            style={{ ...handle.style, cursor: handle.cursor }}
            onMouseDown={(e) => handleMouseDown(e, 'resize', handle.position)}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`relative inline-block ${isSelected ? 'ring-2 ring-[#1a1a8c]' : ''} ${isDragging ? 'opacity-75' : ''}`}
        style={getAlignmentStyles()}
        onClick={() => {
          setIsSelected(true);
          setShowToolbar(true);
        }}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setShowToolbar(isSelected)}
        onMouseLeave={() => setShowToolbar(isSelected && showContextMenu)}
      >
        {/* Main Image */}
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block max-w-full h-auto cursor-move"
          style={{ width, height }}
          draggable={false}
          onMouseDown={(e) => handleMouseDown(e, 'drag')}
        />

        {/* Caption */}
        {(caption || editingCaption) && (
          <div className="mt-2 text-center">
            {editingCaption ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempCaption}
                  onChange={(e) => setTempCaption(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="Enter caption..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCaptionSave();
                    if (e.key === 'Escape') handleCaptionCancel();
                  }}
                />
                <button
                  onClick={handleCaptionSave}
                  className="px-2 py-1 text-xs bg-[#1a1a8c] text-white rounded hover:bg-[#141466]"
                >
                  Save
                </button>
                <button
                  onClick={handleCaptionCancel}
                  className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p 
                className="text-sm text-gray-600 italic cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => setEditingCaption(true)}
              >
                {caption || 'Click to add caption'}
              </p>
            )}
          </div>
        )}

        {/* Resize Handles */}
        {renderResizeHandles()}

        {/* Floating Toolbar */}
        {showToolbar && isSelected && !isDragging && (
          <div className="absolute -top-12 left-0 flex items-center gap-1 bg-white border border-gray-300 rounded shadow-lg p-1 z-20">
            <button
              onClick={onEdit}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Edit Image"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => setEditingCaption(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Add Caption"
            >
              <MessageSquare size={14} />
            </button>
            <button
              onClick={handleFileReplace}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Replace Image"
            >
              <Upload size={14} />
            </button>
            <div className="w-px h-4 bg-gray-300" />
            <button
              onClick={() => onUpdate({ alignment: 'left' })}
              className={`p-1 hover:bg-gray-100 rounded transition-colors ${alignment === 'left' ? 'bg-blue-100' : ''}`}
              title="Align Left"
            >
              <AlignLeft size={14} />
            </button>
            <button
              onClick={() => onUpdate({ alignment: 'center' })}
              className={`p-1 hover:bg-gray-100 rounded transition-colors ${alignment === 'center' ? 'bg-blue-100' : ''}`}
              title="Align Center"
            >
              <AlignCenter size={14} />
            </button>
            <button
              onClick={() => onUpdate({ alignment: 'right' })}
              className={`p-1 hover:bg-gray-100 rounded transition-colors ${alignment === 'right' ? 'bg-blue-100' : ''}`}
              title="Align Right"
            >
              <AlignRight size={14} />
            </button>
            <div className="w-px h-4 bg-gray-300" />
            <button
              onClick={onRemove}
              className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
              title="Remove Image"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed bg-white border border-gray-300 rounded shadow-lg py-1 z-50 min-w-[160px]"
          style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
        >
          <button
            onClick={() => {
              onEdit();
              setShowContextMenu(false);
            }}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
          >
            <Crop size={14} />
            Crop & Edit
          </button>
          <button
            onClick={handleFileReplace}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
          >
            <Upload size={14} />
            Replace Image
          </button>
          <button
            onClick={() => {
              setEditingCaption(true);
              setShowContextMenu(false);
            }}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
          >
            <MessageSquare size={14} />
            {caption ? 'Edit Caption' : 'Add Caption'}
          </button>
          <div className="border-t border-gray-200 my-1" />
          <button
            onClick={() => {
              onRemove();
              setShowContextMenu(false);
            }}
            className="w-full px-3 py-2 text-left hover:bg-red-100 text-red-600 flex items-center gap-2"
          >
            <Trash2 size={14} />
            Remove Image
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};