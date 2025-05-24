import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { Spinner } from "@material-tailwind/react"; // or use your own spinner

const PdfViewer = () => {
  const pdfUrl = "https://yourdomain.com/your-folder-name/brochure.pdf";

  return (
    <div style={{ height: "750px" }}>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={pdfUrl}
          renderLoader={() => (
            <div className="flex items-center justify-center h-full">
              <Spinner className="h-10 w-10 text-gray-600" />
            </div>
          )}
        />
      </Worker>
    </div>
  );
};

export default PdfViewer;
