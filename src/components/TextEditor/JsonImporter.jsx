"use client"

import { useState } from "react"
import { FileText, Upload, X } from "lucide-react"

// Extracted utility function for formatting content to HTML
export const formatContentToHtml = (data) => {
  let html = ""

  // Add topic as main title (H1) if it exists
  if (data.topic) {
    html += `<h1 style="font-size: 24px; font-family: Arial; font-weight: bold; color: #1a1a8c; text-align: left; margin: 20px 0 15px 0;" id="topic-heading" data-heading-style="h1">${data.topic}</h1>`
  }

  // Process chapters
  Object.entries(data).forEach(([chapterKey, chapterValue]) => {
    // Skip the topic field
    if (chapterKey === "topic" || typeof chapterValue !== "object" || !chapterValue) {
      return
    }

    const chapter = chapterValue

    // Add chapter title as H1 heading
    html += `<h1 style="font-size: 24px; font-family: Arial; font-weight: bold; color: #1a1a8c; text-align: left; margin: 30px 0 20px 0;" id="chapter-${chapterKey}" data-heading-style="h1">${chapter.title}</h1>`

    // Sort sections by their numeric keys (1.1, 1.2, etc.)
    const sortedSections = Object.entries(chapter.sections).sort(([a], [b]) => {
      const numA = Number.parseFloat(a)
      const numB = Number.parseFloat(b)
      return numA - numB
    })

    sortedSections.forEach(([sectionKey, section]) => {
      // Add section heading with number and title combined as H2
      const sectionTitle = `${sectionKey} ${section.title}`
      html += `<h2 style="font-size: 20px; font-family: Arial; font-weight: bold; color: #1a1a8c; text-align: left; margin: 25px 0 15px 0;" id="section-${sectionKey.replace(
        ".",
        "-",
      )}" data-heading-style="h2">${sectionTitle}</h2>`

      // Add section content with proper paragraph formatting
      const paragraphs = section.content.split("\n\n")
      paragraphs.forEach((paragraph) => {
        if (paragraph.trim()) {
          html += `<p style="font-size: 12px; font-family: Arial; line-height: 1.15; text-align: justify; margin-bottom: 15px; color: #000000;">${paragraph.trim()}</p>`
        }
      })
    })
  })

  return html
}

export const JsonImporter = ({ onImport }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState("")

  const handleImport = () => {
    try {
      setError("")
      if (!jsonInput.trim()) {
        throw new Error("Please enter JSON data")
      }

      const parsedData = JSON.parse(jsonInput)

      // Validate the JSON structure
      if (typeof parsedData !== "object" || parsedData === null) {
        throw new Error("Invalid JSON structure - must be an object")
      }

      // Check if it has at least one chapter with the expected structure
      const chapterKeys = Object.keys(parsedData).filter((key) => key !== "topic")
      if (chapterKeys.length === 0) {
        throw new Error("No chapters found in JSON data")
      }

      // Validate at least one chapter structure
      let hasValidChapter = false
      for (const key of chapterKeys) {
        const chapter = parsedData[key]
        if (typeof chapter === "object" && chapter !== null && "title" in chapter && "sections" in chapter) {
          hasValidChapter = true
          break
        }
      }

      if (!hasValidChapter) {
        throw new Error('JSON must contain chapters with "title" and "sections" properties')
      }

      const formattedHtml = formatContentToHtml(parsedData)
      console.log("Formatted HTML for import:", formattedHtml)

      onImport(formattedHtml)
      setIsOpen(false)
      setJsonInput("")
      setError("")
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON format - please check your syntax")
      } else {
        setError(err instanceof Error ? err.message : "An error occurred while processing the JSON")
      }
    }
  }

  const handleClear = () => {
    setJsonInput("")
    setError("")
  }

  const sampleJson = `{
  "topic": "Design and Implementation of an IoT-Enabled Environmental Monitoring System",
  "chapter_1_Introduction": {
    "title": "Chapter One: Introduction",
    "sections": {
      "1.1": {
        "title": "Background of the Study",
        "content": "Your content here..."
      },
      "1.2": {
        "title": "Motivation for the Project",
        "content": "Your content here..."
      },
      "1.3": {
        "title": "Problem Statement",
        "content": "Your content here..."
      }
    }
  },
  "chapter_2_Literature": {
    "title": "Chapter Two: Literature Review",
    "sections": {
      "2.1": {
        "title": "Overview of IoT Systems",
        "content": "Your content here..."
      },
      "2.2": {
        "title": "Environmental Monitoring Technologies",
        "content": "Your content here..."
      }
    }
  }
}`

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        title="Import from JSON"
      >
        <Upload size={16} />
        <span>Import JSON</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="text-[#1a1a8c]" size={24} />
                <h2 className="text-xl font-bold text-[#1a1a8c]">Import Document from JSON</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-hidden flex flex-col">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Paste your JSON data below:</label>
                <div className="text-xs text-gray-500 mb-3">
                  Expected format: Object with optional "topic" and chapter objects containing "title" and "sections"
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={sampleJson}
                  className="flex-1 w-full p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:ring-2 focus:ring-[#1a1a8c] focus:border-transparent"
                  style={{ minHeight: "300px" }}
                />
              </div>

              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Format Information */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Automatic Formatting:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>
                    • <strong>Topic</strong> → Heading 1 (H1)
                  </li>
                  <li>
                    • <strong>Chapter titles</strong> → Heading 1 (H1)
                  </li>
                  <li>
                    • <strong>Section numbers + titles</strong> → Heading 2 (H2)
                  </li>
                  <li>
                    • <strong>Content</strong> → Formatted paragraphs
                  </li>
                  <li>• All headings will appear in the navigation panel with proper hierarchy</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                The content will be formatted with proper headings and styling for AI editing
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!jsonInput.trim()}
                  className="px-4 py-2 bg-[#1a1a8c] text-white rounded hover:bg-[#141466] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import & Format
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
