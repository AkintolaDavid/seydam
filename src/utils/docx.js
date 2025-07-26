import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';

const parseHtmlToElements = (element) => {
  const elements = [];
  
  const processNode = (node, listLevel = 0) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        elements.push({
          type: 'paragraph',
          content: text,
          alignment: 'left',
          fontSize: 12,
          fontFamily: 'Arial'
        });
      }
      return;
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node;
      const tagName = el.tagName.toLowerCase();
      
      // Handle images
      if (tagName === 'img') {
        const src = el.getAttribute('src');
        const width = parseInt(el.style.width) || parseInt(el.getAttribute('width') || '300');
        const height = parseInt(el.style.height) || parseInt(el.getAttribute('height') || '200');
        
        if (src) {
          elements.push({
            type: 'image',
            imageData: { src, width, height },
            alignment: getAlignment(el.parentElement || el)
          });
        }
        return;
      }

      // Handle image containers
      if (el.classList.contains('image-container') || el.classList.contains('advanced-image-container')) {
        const img = el.querySelector('img');
        if (img) {
          const src = img.getAttribute('src');
          const width = parseInt(img.style.width) || parseInt(img.getAttribute('width') || '300');
          const height = parseInt(img.style.height) || parseInt(img.getAttribute('height') || '200');
          
          if (src) {
            elements.push({
              type: 'image',
              imageData: { src, width, height },
              alignment: getAlignment(el)
            });
          }
        }
        return;
      }

      // Handle tables
      if (el.classList.contains('table-container')) {
        const table = el.querySelector('table');
        if (table) {
          const tableData = parseTableData(table);
          if (tableData) {
            elements.push({
              type: 'table',
              tableData,
              alignment: 'left'
            });
          }
        }
        return;
      }
      
      // Handle headings
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        const level = parseInt(tagName.charAt(1));
        const text = el.textContent?.trim();
        if (text) {
          elements.push({
            type: 'heading',
            content: text,
            level,
            alignment: getAlignment(el),
            fontSize: getFontSize(el, level),
            fontFamily: getFontFamily(el),
            bold: isBold(el),
            italic: isItalic(el),
            underline: isUnderlined(el)
          });
        }
        return;
      }
      
      // Handle lists
      if (tagName === 'ul' || tagName === 'ol') {
        const listItems = el.querySelectorAll('li');
        listItems.forEach(li => {
          const text = getTextContent(li);
          if (text) {
            elements.push({
              type: 'list',
              content: text,
              listType: tagName === 'ul' ? 'bullet' : 'numbered',
              listLevel,
              alignment: 'left',
              fontSize: getFontSize(li),
              fontFamily: getFontFamily(li),
              bold: isBold(li),
              italic: isItalic(li),
              underline: isUnderlined(li)
            });
          }
        });
        return;
      }
      
      // Handle paragraphs and divs
      if (tagName === 'p' || tagName === 'div') {
        const text = getTextContent(el);
        if (text) {
          elements.push({
            type: 'paragraph',
            content: text,
            alignment: getAlignment(el),
            fontSize: getFontSize(el),
            fontFamily: getFontFamily(el),
            bold: isBold(el),
            italic: isItalic(el),
            underline: isUnderlined(el)
          });
        }
        return;
      }
      
      // Process child nodes for other elements
      Array.from(node.childNodes).forEach(child => processNode(child, listLevel));
    }
  };
  
  Array.from(element.childNodes).forEach(child => processNode(child));
  return elements;
};

const parseTableData = (table) => {
  const rows = [];
  let hasHeader = false;

  // Check for header row
  const thead = table.querySelector('thead');
  if (thead) {
    hasHeader = true;
    const headerRow = thead.querySelector('tr');
    if (headerRow) {
      const headerCells = Array.from(headerRow.querySelectorAll('th, td'));
      const headerData = headerCells.map(cell => {
        const text = cell.textContent?.trim() || '';
        // Handle empty headers (which start as &nbsp;)
        return text === '\u00A0' || text === '' ? '' : text;
      });
      rows.push(headerData);
    }
  }

  // Process body rows
  const tbody = table.querySelector('tbody') || table;
  const bodyRows = tbody.querySelectorAll('tr');
  
  bodyRows.forEach(row => {
    // Skip if this row is already processed as header
    if (hasHeader && row.closest('thead')) return;
    
    const cells = Array.from(row.querySelectorAll('th, td'));
    const rowData = cells.map(cell => {
      const text = cell.textContent?.trim() || '';
      // Handle empty cells (which might contain &nbsp;)
      return text === '\u00A0' || text === '' ? '' : text;
    });
    
    // Only add non-empty rows or rows with at least one non-empty cell
    if (rowData.some(cell => cell !== '')) {
      rows.push(rowData);
    }
  });

  return rows.length > 0 ? { rows, hasHeader } : null;
};

const getTextContent = (element) => {
  // Get text content while preserving some formatting
  let text = '';
  
  const processTextNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent || '';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node;
      if (el.tagName === 'BR') {
        text += '\n';
      } else if (el.tagName === 'IMG') {
        // Skip images in text content
        return;
      } else {
        Array.from(node.childNodes).forEach(processTextNode);
      }
    }
  };
  
  Array.from(element.childNodes).forEach(processTextNode);
  return text.trim();
};

const getAlignment = (element) => {
  const style = window.getComputedStyle(element);
  const textAlign = style.textAlign || element.style.textAlign;
  
  switch (textAlign) {
    case 'center': return 'center';
    case 'right': return 'right';
    case 'justify': return 'justify';
    default: return 'left';
  }
};

const getFontSize = (element, defaultSize = 12) => {
  const style = window.getComputedStyle(element);
  const fontSize = element.style.fontSize || style.fontSize;
  
  if (fontSize) {
    const size = parseInt(fontSize);
    return isNaN(size) ? defaultSize : size;
  }
  
  return defaultSize;
};

const getFontFamily = (element) => {
  const style = window.getComputedStyle(element);
  const fontFamily = element.style.fontFamily || style.fontFamily;
  return fontFamily?.replace(/"/g, '').split(',')[0] || 'Arial';
};

const isBold = (element) => {
  const style = window.getComputedStyle(element);
  const fontWeight = element.style.fontWeight || style.fontWeight;
  return fontWeight === 'bold' || parseInt(fontWeight) >= 600;
};

const isItalic = (element) => {
  const style = window.getComputedStyle(element);
  const fontStyle = element.style.fontStyle || style.fontStyle;
  return fontStyle === 'italic';
};

const isUnderlined = (element) => {
  const style = window.getComputedStyle(element);
  const textDecoration = element.style.textDecoration || style.textDecoration;
  return textDecoration.includes('underline');
};

const convertAlignmentToDocx = (alignment) => {
  switch (alignment) {
    case 'center': return AlignmentType.CENTER;
    case 'right': return AlignmentType.RIGHT;
    case 'justify': return AlignmentType.JUSTIFIED;
    default: return AlignmentType.LEFT;
  }
};

const convertHeadingLevel = (level) => {
  switch (level) {
    case 1: return HeadingLevel.HEADING_1;
    case 2: return HeadingLevel.HEADING_2;
    case 3: return HeadingLevel.HEADING_3;
    case 4: return HeadingLevel.HEADING_4;
    case 5: return HeadingLevel.HEADING_5;
    case 6: return HeadingLevel.HEADING_6;
    default: return HeadingLevel.HEADING_1;
  }
};

const convertImageToBuffer = async (src) => {
  return new Promise((resolve, reject) => {
    if (src.startsWith('data:')) {
      // Handle base64 data URLs
      try {
        const base64Data = src.split(',')[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        resolve(bytes.buffer);
      } catch (error) {
        reject(error);
      }
    } else {
      // Handle regular URLs
      fetch(src)
        .then(response => response.arrayBuffer())
        .then(resolve)
        .catch(reject);
    }
  });
};

const createDocxTable = (tableData) => {
  const { rows, hasHeader } = tableData;
  
  const tableRows = rows.map((rowData, rowIndex) => {
    const isHeader = hasHeader && rowIndex === 0;
    
    const cells = rowData.map(cellText => {
      return new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: cellText || '', // Handle empty cells
                bold: isHeader,
                size: 24, // 12pt in half-points
                font: 'Arial'
              })
            ],
            alignment: AlignmentType.LEFT
          })
        ],
        width: {
          size: 100 / rowData.length, // Equal width distribution
          type: WidthType.PERCENTAGE
        }
      });
    });
    
    return new TableRow({
      children: cells,
      tableHeader: isHeader
    });
  });
  
  return new Table({
    rows: tableRows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    }
  });
};

export const exportToDocx = async (element, margins) => {
  console.log(element) 
  try {
    // Parse HTML content to structured elements
    const elements = parseHtmlToElements(element);
    
    // Convert parsed elements to DOCX paragraphs
    const docxElements = await Promise.all(elements.map(async (el) => {
      if (el.type === 'image' && el.imageData) {
        try {
          const imageBuffer = await convertImageToBuffer(el.imageData.src);
          
          return new Paragraph({
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: el.imageData.width,
                  height: el.imageData.height,
                },
              }),
            ],
            alignment: convertAlignmentToDocx(el.alignment || 'left'),
          });
        } catch (error) {
          console.warn('Failed to process image:', error);
          // Return a placeholder paragraph if image processing fails
          return new Paragraph({
            children: [new TextRun('[Image could not be processed]')],
            alignment: convertAlignmentToDocx(el.alignment || 'left'),
          });
        }
      }

      if (el.type === 'table' && el.tableData) {
        return createDocxTable(el.tableData);
      }

      const textRun = new TextRun({
        text: el.content || '',
        bold: el.bold,
        italics: el.italic,
        underline: el.underline ? {} : undefined,
        size: (el.fontSize || 12) * 2, // DOCX uses half-points
        font: el.fontFamily || 'Arial'
      });
      
      if (el.type === 'heading' && el.level) {
        return new Paragraph({
          children: [textRun],
          heading: convertHeadingLevel(el.level),
          alignment: convertAlignmentToDocx(el.alignment || 'left')
        });
      }
      
      if (el.type === 'list') {
        return new Paragraph({
          children: [textRun],
          bullet: el.listType === 'bullet' ? {
            level: el.listLevel || 0
          } : undefined,
          numbering: el.listType === 'numbered' ? {
            reference: 'default-numbering',
            level: el.listLevel || 0
          } : undefined,
          alignment: convertAlignmentToDocx(el.alignment || 'left')
        });
      }
      
      return new Paragraph({
        children: [textRun],
        alignment: convertAlignmentToDocx(el.alignment || 'left')
      });
    }));
    
    // Create DOCX document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: margins.top * 567, // Convert cm to twips (1cm = 567 twips)
              right: margins.right * 567,
              bottom: margins.bottom * 567,
              left: margins.left * 567
            }
          }
        },
        children: docxElements
      }]
    });
    
    // Generate and save DOCX file using toBlob for browser compatibility
    const blob = await Packer.toBlob(doc);
    
    const fileName = `document_${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(blob, fileName);
    
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw new Error('Failed to generate DOCX. Please try again.');
  }
};