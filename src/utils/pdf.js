import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

const applyComputedStylesInline = (element) => {
  const computedStyle = window.getComputedStyle(element);

  // Apply key computed styles as inline styles
  const stylesToCopy = [
    "color",
    "backgroundColor",
    "fontSize",
    "fontFamily",
    "fontWeight",
    "fontStyle",
    "textDecoration",
    "textAlign",
    "lineHeight",
    "margin",
    "padding",
    "border",
    "borderRadius",
    "display",
    "width",
    "height",
    "minHeight",
    "maxHeight",
    "minWidth",
    "maxWidth",
    "position",
    "top",
    "left",
    "right",
    "bottom",
    "zIndex",
    "opacity",
    "visibility",
  ];

  stylesToCopy.forEach((property) => {
    const value = computedStyle.getPropertyValue(property);
    if (value && value !== "initial" && value !== "inherit") {
      element.style.setProperty(property, value);
    }
  });

  // Recursively apply to all child elements
  Array.from(element.children).forEach((child) => {
    applyComputedStylesInline(child);
  });
};

const processImagesForPDF = (element) => {
  return new Promise((resolve) => {
    const images = element.querySelectorAll("img");
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      resolve();
      return;
    }

    images.forEach((img) => {
      // Ensure images are properly sized for PDF
      if (img.style.width) {
        img.setAttribute("width", img.style.width.replace("px", ""));
      }
      if (img.style.height) {
        img.setAttribute("height", img.style.height.replace("px", ""));
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
  const tables = element.querySelectorAll(".table-container");
  tables.forEach((tableContainer) => {
    const table = tableContainer.querySelector("table");
    if (!table) return;

    // Apply PDF-specific table styling
    table.style.cssText += `
      border-collapse: collapse;
      width: 100%;
      font-size: 10px;
      font-family: "Times New Roman", Times, serif;
      margin: 10px 0;
    `;

    // Style all cells
    const cells = table.querySelectorAll("th, td");
    cells.forEach((cell) => {
      // Get cell content, handling empty cells
      let cellText = cell.textContent?.trim() || "";
      if (cellText === "\u00A0" || cellText === "") {
        cellText = "";
      }

      // Apply consistent cell styling
      cell.style.cssText += `
        border: 1px solid #000;
        padding: 6px 8px;
        vertical-align: top;
        word-wrap: break-word;
        font-size: 10px;
        line-height: 1.2;
      `;

      // Style headers differently
      if (cell.tagName === "TH") {
        cell.style.cssText += `
          background-color: #f0f0f0;
          font-weight: bold;
          text-align: left;
        `;
      } else {
        cell.style.cssText += `
          background-color: white;
          text-align: left;
        `;
      }

      // Ensure text content is preserved
      cell.textContent = cellText;
    });

    // Remove any contentEditable attributes
    cells.forEach((cell) => {
      cell.removeAttribute("contenteditable");
      cell.removeAttribute("data-cell-type");
      cell.removeAttribute("data-row");
      cell.removeAttribute("data-col");
    });
  });
};

export const exportToPDF = async (
  element,
  margins,
  paperSize = "A4",
  orientation = "portrait"
) => {
  console.log("Starting PDF export...", element);

  try {
    // Get paper dimensions
    const baseDimensions = paperSizes[paperSize] || paperSizes.A4;
    const dimensions =
      orientation === "landscape"
        ? { width: baseDimensions.height, height: baseDimensions.width }
        : baseDimensions;

    // Create a clean copy of the content for PDF export
    const exportContainer = document.createElement("div");
    exportContainer.style.cssText = `
      width: ${dimensions.width}cm;
      min-height: ${dimensions.height}cm;
      background: white;
      font-family: "Times New Roman", Times, serif;
      font-size: 14px;
      color: black;
      line-height: 1.15;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      position: absolute;
      left: -9999px;
      top: 0;
    `;

    // Create a new div and copy innerHTML to avoid contentEditable issues
    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = element.innerHTML;

    // Apply equal margins to content div
    contentDiv.style.cssText = `
      padding-top: ${margins.top}cm;
      padding-bottom: ${margins.bottom}cm;
      padding-left: ${margins.left}cm;
      padding-right: ${margins.left}cm;
      box-sizing: border-box;
      width: 100%;
      margin: 0;
      text-align: left;
      min-height: ${dimensions.height - margins.top - margins.bottom}cm;
    `;

    // Remove page break indicators and other editor-specific elements
    const pageBreaks = contentDiv.querySelectorAll(
      ".page-break-auto, .page-break"
    );
    pageBreaks.forEach((pb) => pb.remove());

    // Process image containers
    const imageContainers = contentDiv.querySelectorAll(
      ".image-container, .advanced-image-container"
    );
    imageContainers.forEach((container) => {
      const img = container.querySelector("img");
      if (img) {
        // Replace container with just the image for PDF
        const newImg = img.cloneNode(true);
        // Apply container alignment to image
        const containerStyle = window.getComputedStyle(container);
        if (containerStyle.textAlign === "center") {
          newImg.style.display = "block";
          newImg.style.margin = "0 auto";
        } else if (containerStyle.textAlign === "right") {
          newImg.style.display = "block";
          newImg.style.marginLeft = "auto";
        }
        container.parentNode?.replaceChild(newImg, container);
      }
    });

    // Process tables for PDF export
    processTablesForPDF(contentDiv);

    // Apply computed styles inline to ensure proper rendering
    applyComputedStylesInline(contentDiv);

    // Clean up and normalize styles for PDF export
    const allElements = contentDiv.querySelectorAll("*");
    allElements.forEach((el) => {
      // Remove contentEditable attributes
      el.removeAttribute("contenteditable");
      el.removeAttribute("data-placeholder");

      // Ensure text is visible
      if (!el.style.color || el.style.color === "transparent") {
        el.style.color = "black";
      }

      // Normalize font sizes
      if (el.style.fontSize) {
        const fontSize = Number.parseInt(el.style.fontSize);
        if (fontSize) {
          el.style.fontSize = `${fontSize}px`;
        }
      }

      // Ensure font families are properly set
      if (el.style.fontFamily) {
        el.style.fontFamily = el.style.fontFamily.replace(/"/g, "");
      }

      // Handle list styling
      if (el.tagName === "UL" || el.tagName === "OL") {
        el.style.marginLeft = "20px";
        el.style.paddingLeft = "10px";
      }
      if (el.tagName === "LI") {
        el.style.marginBottom = "5px";
        el.style.lineHeight = "1.2";
      }

      // Handle images
      if (el.tagName === "IMG") {
        el.style.maxWidth = "100%";
        el.style.height = "auto";
      }
    });

    // Add the cleaned content to export container
    exportContainer.appendChild(contentDiv);

    // Temporarily add to DOM for rendering
    document.body.appendChild(exportContainer);

    // Wait for images to load
    await processImagesForPDF(exportContainer);

    console.log("Creating canvas from HTML...");

    // Convert HTML to canvas
    const canvas = await html2canvas(exportContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: dimensions.width * 37.795275591, // Convert cm to px
      height: dimensions.height * 37.795275591,
      x: 0,
      y: 0,
    });

    console.log("Canvas created, generating PDF...");

    // Convert paper size to jsPDF format
    let format = "a4";
    if (paperSize === "A1") format = [594, 841];
    else if (paperSize === "A2") format = [420, 594];
    else if (paperSize === "A3") format = [297, 420];
    else if (paperSize === "A4") format = "a4";
    else if (paperSize === "A5") format = [148, 210];
    else if (paperSize === "Letter") format = "letter";
    else if (paperSize === "Legal") format = "legal";

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: "mm",
      format: format,
    });

    // Get PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to fit PDF page
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Add image to PDF
    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    if (imgHeight <= pdfHeight) {
      // Single page
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    } else {
      // Multiple pages
      let yPosition = 0;
      const pageHeight = pdfHeight;

      while (yPosition < imgHeight) {
        if (yPosition > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, "JPEG", 0, -yPosition, imgWidth, imgHeight);
        yPosition += pageHeight;
      }
    }

    // Save PDF
    const filename = `document_${paperSize}_${orientation}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    pdf.save(filename);

    console.log("PDF generated successfully!");

    // Clean up
    document.body.removeChild(exportContainer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
};

export const cmToPx = (cm) => {
  return cm * 37.795275591; // 1cm = 37.795275591px at 96 DPI
};
