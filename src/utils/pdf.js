import html2pdf from 'html2pdf.js';

// Paper size dimensions in cm
const paperSizes = {
  'A1': { width: 59.4, height: 84.1 },
  'A2': { width: 42.0, height: 59.4 },
  'A3': { width: 29.7, height: 42.0 },
  'A4': { width: 21.0, height: 29.7 },
  'A5': { width: 14.8, height: 21.0 },
  'Letter': { width: 21.6, height: 27.9 },
  'Legal': { width: 21.6, height: 35.6 },
};

const applyComputedStylesInline = (element) => {
  const computedStyle = window.getComputedStyle(element);
  
  // Apply key computed styles as inline styles
  const stylesToCopy = [
    'color', 'backgroundColor', 'fontSize', 'fontFamily', 'fontWeight', 
    'fontStyle', 'textDecoration', 'textAlign', 'lineHeight', 'margin',
    'padding', 'border', 'borderRadius', 'display', 'width', 'height',
    'minHeight', 'maxHeight', 'minWidth', 'maxWidth', 'position',
    'top', 'left', 'right', 'bottom', 'zIndex', 'opacity', 'visibility'
  ];
  
  stylesToCopy.forEach(property => {
    const value = computedStyle.getPropertyValue(property);
    if (value && value !== 'initial' && value !== 'inherit') {
      element.style.setProperty(property, value);
    }
  });
  
  // Recursively apply to all child elements
  Array.from(element.children).forEach(child => {
    applyComputedStylesInline(child);
  });
};

const processImagesForPDF = (element) => {
  return new Promise((resolve) => {
    const images = element.querySelectorAll('img');
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      resolve();
      return;
    }

    images.forEach((img) => {
      // Ensure images are properly sized for PDF
      if (img.style.width) {
        img.setAttribute('width', img.style.width.replace('px', ''));
      }
      if (img.style.height) {
        img.setAttribute('height', img.style.height.replace('px', ''));
      }

      // Handle image loading
      if (img.complete) {
        loadedCount++;
        if (loadedCount === totalImages) {
          resolve();
        }
      } else {
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            resolve();
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            resolve();
          }
        };
      }
    });
  });
};

const processTablesForPDF = (element) => {
  const tables = element.querySelectorAll('.table-container');
  
  tables.forEach(tableContainer => {
    const table = tableContainer.querySelector('table');
    if (!table) return;

    // Apply PDF-specific table styling
    table.style.cssText += `
      border-collapse: collapse;
      width: 100%;
      font-size: 10px;
      font-family: Arial, sans-serif;
      margin: 10px 0;
    `;

    // Style all cells
    const cells = table.querySelectorAll('th, td');
    cells.forEach(cell => {
      const htmlCell = cell;
      
      // Get cell content, handling empty cells
      let cellText = htmlCell.textContent?.trim() || '';
      if (cellText === '\u00A0' || cellText === '') {
        cellText = '';
      }
      
      // Apply consistent cell styling
      htmlCell.style.cssText += `
        border: 1px solid #000;
        padding: 6px 8px;
        vertical-align: top;
        word-wrap: break-word;
        font-size: 10px;
        line-height: 1.2;
      `;
      
      // Style headers differently
      if (htmlCell.tagName === 'TH') {
        htmlCell.style.cssText += `
          background-color: #f0f0f0;
          font-weight: bold;
          text-align: left;
        `;
      } else {
        htmlCell.style.cssText += `
          background-color: white;
          text-align: left;
        `;
      }
      
      // Ensure text content is preserved
      htmlCell.textContent = cellText;
    });

    // Remove any contentEditable attributes
    cells.forEach(cell => {
      cell.removeAttribute('contenteditable');
      cell.removeAttribute('data-cell-type');
      cell.removeAttribute('data-row');
      cell.removeAttribute('data-col');
    });
  });
};

export const exportToPDF = async (
  element, 
  margins, 
  paperSize = 'A4', 
  orientation = 'portrait'
) => {
  try {
    // Get paper dimensions
    const baseDimensions = paperSizes[paperSize] || paperSizes.A4;
    const dimensions = orientation === 'landscape' 
      ? { width: baseDimensions.height, height: baseDimensions.width }
      : baseDimensions;

    // Create a clean copy of the content for PDF export
    const exportContainer = document.createElement('div');
    exportContainer.style.cssText = `
      width: ${dimensions.width}cm;
      min-height: ${dimensions.height}cm;
      background: white;
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: black;
      line-height: 1.15;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    `;

    // Create a new div and copy innerHTML to avoid contentEditable issues
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = element.innerHTML;
    
    // Remove page break indicators and other editor-specific elements
    const pageBreaks = contentDiv.querySelectorAll('.page-break-auto, .page-break');
    pageBreaks.forEach(pb => pb.remove());
    
    // Process image containers
    const imageContainers = contentDiv.querySelectorAll('.image-container, .advanced-image-container');
    imageContainers.forEach(container => {
      const img = container.querySelector('img');
      if (img) {
        // Replace container with just the image for PDF
        const newImg = img.cloneNode(true);
        
        // Apply container alignment to image
        const containerStyle = window.getComputedStyle(container);
        if (containerStyle.textAlign === 'center') {
          newImg.style.display = 'block';
          newImg.style.margin = '0 auto';
        } else if (containerStyle.textAlign === 'right') {
          newImg.style.display = 'block';
          newImg.style.marginLeft = 'auto';
        }
        
        container.parentNode?.replaceChild(newImg, container);
      }
    });
    
    // Process tables for PDF export
    processTablesForPDF(contentDiv);
    
    // Apply computed styles inline to ensure proper rendering
    applyComputedStylesInline(contentDiv);
    
    // Clean up and normalize styles for PDF export
    const allElements = contentDiv.querySelectorAll('*');
    allElements.forEach((el) => {
      const htmlEl = el;
      
      // Remove contentEditable attributes
      htmlEl.removeAttribute('contenteditable');
      htmlEl.removeAttribute('data-placeholder');
      
      // Ensure text is visible
      if (!htmlEl.style.color || htmlEl.style.color === 'transparent') {
        htmlEl.style.color = 'black';
      }
      
      // Normalize font sizes
      if (htmlEl.style.fontSize) {
        const fontSize = parseInt(htmlEl.style.fontSize);
        if (fontSize) {
          htmlEl.style.fontSize = `${fontSize}px`;
        }
      }
      
      // Ensure font families are properly set
      if (htmlEl.style.fontFamily) {
        htmlEl.style.fontFamily = htmlEl.style.fontFamily.replace(/"/g, '');
      }
      
      // Handle list styling
      if (htmlEl.tagName === 'UL' || htmlEl.tagName === 'OL') {
        htmlEl.style.marginLeft = '20px';
        htmlEl.style.paddingLeft = '10px';
      }
      
      if (htmlEl.tagName === 'LI') {
        htmlEl.style.marginBottom = '5px';
        htmlEl.style.lineHeight = '1.2';
      }

      // Handle images
      if (htmlEl.tagName === 'IMG') {
        htmlEl.style.maxWidth = '100%';
        htmlEl.style.height = 'auto';
      }
    });

    // Add the cleaned content to export container
    exportContainer.appendChild(contentDiv);
    
    // Temporarily add to DOM for rendering
    exportContainer.style.position = 'absolute';
    exportContainer.style.left = '-9999px';
    exportContainer.style.top = '0';
    document.body.appendChild(exportContainer);

    // Wait for images to load
    await processImagesForPDF(exportContainer);

    // Convert paper size to jsPDF format
    let format = 'a4';
    if (paperSize === 'A1') format = [594, 841];
    else if (paperSize === 'A2') format = [420, 594];
    else if (paperSize === 'A3') format = [297, 420];
    else if (paperSize === 'A4') format = 'a4';
    else if (paperSize === 'A5') format = [148, 210];
    else if (paperSize === 'Letter') format = 'letter';
    else if (paperSize === 'Legal') format = 'legal';

    const opt = {
      margin: [
        margins.top / 2.54, // Convert cm to inches
        margins.right / 2.54,
        margins.bottom / 2.54,
        margins.left / 2.54
      ],
      filename: `document_${paperSize}_${orientation}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        letterRendering: true,
        imageTimeout: 15000,
        removeContainer: true,
        width: dimensions.width * 37.795275591, // Convert cm to px
        height: dimensions.height * 37.795275591
      },
      jsPDF: { 
        unit: 'mm', 
        format: format,
        orientation: orientation,
        putOnlyUsedFonts: true,
        floatPrecision: 16
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', '.image-container', '.table-container', 'table']
      }
    };

    // Generate and save PDF
    await html2pdf().set(opt).from(exportContainer).save();
    
    // Clean up
    document.body.removeChild(exportContainer);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const cmToPx = (cm) => {
  return cm * 37.795275591; // 1cm = 37.795275591px at 96 DPI
};