import React, { useState } from "react";
import { Code, Copy, X, Check } from "lucide-react";

export const HtmlViewer = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy HTML:", error);
    }
  };

  const formatHtml = (html) => {
    // Simple HTML formatting for better readability
    return html
      .replace(/></g, ">\n<")
      .replace(/(<div[^>]*>)/g, "\n$1")
      .replace(/(<\/div>)/g, "$1\n")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        title="View HTML Source"
      >
        <Code size={16} />
        <span>View HTML</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Code className="text-[#1a1a8c]" size={24} />
                <h2 className="text-xl font-bold text-[#1a1a8c]">
                  HTML Source Code
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-2 bg-[#1a1a8c] text-white rounded hover:bg-[#141466] transition-colors"
                  title="Copy HTML to clipboard"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? "Copied!" : "Copy HTML"}</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-hidden flex flex-col">
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  Raw HTML content from the editor:
                </div>
                <div className="text-xs text-gray-500">
                  This shows the actual HTML markup that will be used for PDF
                  export and can be copied for external use.
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <textarea
                  value={formatHtml(content)}
                  readOnly
                  className="flex-1 w-full p-4 border border-gray-300 rounded-md font-mono text-sm resize-none bg-gray-50 focus:outline-none"
                  style={{ minHeight: "400px" }}
                />
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm text-blue-800">
                  <strong>Tip:</strong> You can copy this HTML and use it in
                  other applications or save it as an HTML file for web
                  publishing.
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Character count: {content.length.toLocaleString()}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
