import { useCallback, useRef } from 'react';

export const useAdvancedImageHandling = (editorRef) => {
  const fileInputRef = useRef(null);

  const insertImageAtCursor = useCallback((src, width, height) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // Create image container with enhanced structure
    const container = document.createElement('div');
    container.className = 'advanced-image-container';
    container.contentEditable = 'false';
    container.setAttribute('data-image-id', Date.now().toString());
    container.setAttribute('data-alignment', 'left');
    container.style.cssText = `
      display: block;
      margin: 15px 0;
      position: relative;
      max-width: 100%;
    `;

    // Create wrapper for image and caption
    const wrapper = document.createElement('div');
    wrapper.className = 'image-wrapper';
    wrapper.style.cssText = `
      display: inline-block;
      position: relative;
      max-width: 100%;
    `;

    // Create image element
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = `
      max-width: 100%;
      height: auto;
      display: block;
      border: 1px solid transparent;
      transition: border-color 0.2s ease;
    `;
    
    if (width) {
      img.style.width = `${width}px`;
      img.setAttribute('width', width.toString());
    }
    if (height) {
      img.style.height = `${height}px`;
      img.setAttribute('height', height.toString());
    }

    // Add data attributes for tracking
    img.setAttribute('data-image-id', Date.now().toString());
    img.setAttribute('data-original-src', src);
    
    wrapper.appendChild(img);
    container.appendChild(wrapper);

    // Insert at cursor position
    range.deleteContents();
    range.insertNode(container);
    
    // Move cursor after the image
    range.setStartAfter(container);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    // Focus back to editor
    editorRef.current.focus();

    return container;
  }, [editorRef]);

  const moveImageToPosition = useCallback((imageContainer, x, y) => {
    if (!editorRef.current) return;

    // Find the best insertion point based on coordinates
    const editorRect = editorRef.current.getBoundingClientRect();
    const elements = Array.from(editorRef.current.children);
    
    let insertBefore = null;
    let minDistance = Infinity;

    elements.forEach(element => {
      if (element === imageContainer) return;
      
      const rect = element.getBoundingClientRect();
      const elementY = rect.top - editorRect.top + editorRef.current.scrollTop;
      const distance = Math.abs(elementY - y);
      
      if (distance < minDistance) {
        minDistance = distance;
        insertBefore = y < elementY ? element : element.nextElementSibling;
      }
    });

    // Move the image container
    if (insertBefore) {
      editorRef.current.insertBefore(imageContainer, insertBefore);
    } else {
      editorRef.current.appendChild(imageContainer);
    }
  }, [editorRef]);

  const updateImageProperties = useCallback((imageContainer, updates) => {
    const img = imageContainer.querySelector('img');
    const wrapper = imageContainer.querySelector('.image-wrapper');
    
    if (!img || !wrapper) return;

    if (updates.src) {
      img.src = updates.src;
      img.setAttribute('data-original-src', updates.src);
    }
    
    if (updates.width !== undefined) {
      img.style.width = `${updates.width}px`;
      img.setAttribute('width', updates.width.toString());
    }
    
    if (updates.height !== undefined) {
      img.style.height = `${updates.height}px`;
      img.setAttribute('height', updates.height.toString());
    }
    
    if (updates.alignment) {
      imageContainer.setAttribute('data-alignment', updates.alignment);
      switch (updates.alignment) {
        case 'center':
          imageContainer.style.textAlign = 'center';
          break;
        case 'right':
          imageContainer.style.textAlign = 'right';
          break;
        default:
          imageContainer.style.textAlign = 'left';
      }
    }

    if (updates.caption !== undefined) {
      // Handle caption
      let captionElement = imageContainer.querySelector('.image-caption');
      
      if (updates.caption) {
        if (!captionElement) {
          captionElement = document.createElement('div');
          captionElement.className = 'image-caption';
          captionElement.style.cssText = `
            margin-top: 8px;
            text-align: center;
            font-size: 12px;
            color: #666;
            font-style: italic;
            line-height: 1.4;
          `;
          wrapper.appendChild(captionElement);
        }
        captionElement.textContent = updates.caption;
      } else if (captionElement) {
        captionElement.remove();
      }
    }
  }, []);

  const removeImage = useCallback((imageContainer) => {
    imageContainer.remove();
  }, []);

  const handlePaste = useCallback((event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            insertImageAtCursor(reader.result);
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  }, [insertImageAtCursor]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        insertImageAtCursor(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [insertImageAtCursor]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        insertImageAtCursor(reader.result);
      };
      reader.readAsDataURL(file);
    }
    
    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  }, [insertImageAtCursor]);

  return {
    fileInputRef,
    handlePaste,
    handleDrop,
    handleDragOver,
    handleFileSelect,
    handleFileInputChange,
    insertImageAtCursor,
    moveImageToPosition,
    updateImageProperties,
    removeImage
  };
};