"use client"

import { useState, useEffect } from "react"
import { TabbedToolbar } from "./../components/TextEditor/TabbedToolbar"
import { Editor } from "../components/TextEditor/Editor"
import { HeadingNavigationPanel } from "../components/TextEditor/HeadingNavigationPanel"
import { AIEditingPanel } from "../components/TextEditor/AIEditingPanel"
import { useEditor } from "../hooks/useEditor"
import { useAdvancedImageHandling } from "../hooks/useAdvancedImageHandling"
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts"
import { useHeadingNavigation } from "../hooks/useHeadingNavigation"
import { exportToPDF } from "../utils/pdf"
import { exportToDocx } from "../utils/docx"
import { useLocation } from "react-router-dom"

function TextEditor() {
  const {
    editorRef,
    editorState,
    setEditorState,
    updateSelection,
    executeCommand,
    updateHeadingStyle,
    addCustomHeadingStyle,
    deleteHeadingStyle,
    updateMargins,
    updateLineSpacing,
    updatePaperSize,
    updateOrientation,
    handleListToggle,
    handleIndent,
    handleOutdent,
    getCurrentListType,
    handleContentChange,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    getRecentHistory,
    clearHistory,
  } = useEditor()

  const location = useLocation()
  const importedContent = location.state?.importedContent
  const reportData = location.state?.reportData
  const report_id = location.state?.report_id
  const source = location.state?.source // "generated" or "manual"

  console.log("TextEditor received:", { importedContent, reportData, report_id, source })

  const imageHandlers = useAdvancedImageHandling(editorRef)
  const [isExporting, setIsExporting] = useState(false)

  // Heading navigation and AI editing state
  const {
    headings,
    selectedHeading,
    selectedContent,
    selectHeading,
    navigateToHeading,
    updateHeadingContent,
    extractHeadings,
  } = useHeadingNavigation(editorRef, editorState.content)

  const [showAIPanel, setShowAIPanel] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isProcessingAI, setIsProcessingAI] = useState(false)

  // Load imported content when component mounts
  useEffect(() => {
    if (importedContent && editorRef.current) {
      console.log("Loading imported content into editor:", importedContent)
      editorRef.current.innerHTML = importedContent
      setEditorState((prev) => ({ ...prev, content: importedContent }))
      clearHistory(importedContent)

      // Extract headings after content is loaded
      setTimeout(() => {
        console.log("Extracting headings from imported content...")
        extractHeadings()
        // Double-check extraction after a longer delay
        setTimeout(() => {
          console.log("Second heading extraction attempt...")
          extractHeadings()
        }, 500)
      }, 200)
    }
  }, [importedContent, clearHistory, extractHeadings])

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: () => handleUndo(1),
    onRedo: () => handleRedo(1),
    onBold: () => executeCommand("bold"),
    onItalic: () => executeCommand("italic"),
    onUnderline: () => executeCommand("underline"),
    canUndo,
    canRedo,
  })

  const handleExportPDF = async () => {
    if (!editorRef.current) return
    setIsExporting(true)
    try {
      await exportToPDF(editorRef.current, editorState.margins, editorState.paperSize, editorState.orientation)
    } catch (error) {
      console.error("Error exporting PDF:", error)
      alert("Failed to export PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportDocx = async () => {
    if (!editorRef.current) return
    setIsExporting(true)
    try {
      await exportToDocx(editorRef.current, editorState.margins)
    } catch (error) {
      console.error("Error exporting DOCX:", error)
      alert("Failed to export DOCX. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  // Enhanced JSON import handler with heading extraction
  const handleJsonImport = (importedContent) => {
    if (editorRef.current) {
      console.log("Importing JSON content:", importedContent)
      editorRef.current.innerHTML = importedContent
      setEditorState((prev) => ({ ...prev, content: importedContent }))
      clearHistory(importedContent)

      // Extract headings after JSON import with proper timing
      setTimeout(() => {
        console.log("Extracting headings after JSON import...")
        extractHeadings()
        // Double-check extraction after a longer delay to ensure DOM is fully updated
        setTimeout(() => {
          console.log("Second heading extraction attempt...")
          extractHeadings()
        }, 500)
      }, 200)
    }
  }

  // Enhanced content change handler that triggers heading extraction
  const handleContentChangeWithHeadings = (content) => {
    handleContentChange(content)
    // Debounce heading extraction to avoid excessive calls
    setTimeout(() => extractHeadings(), 300)
  }

  // Handle heading selection for AI editing
  const handleHeadingSelect = (headingId) => {
    console.log("Heading selected for AI editing:", headingId)
    selectHeading(headingId)
    setShowAIPanel(true)
  }

  // Handle heading navigation (scroll to heading)
  const handleHeadingNavigate = (headingId) => {
    console.log("Navigating to heading:", headingId)
    navigateToHeading(headingId)
  }

  const handleAIEdit = async (prompt) => {
    if (!selectedHeading || !selectedContent) return
    setIsProcessingAI(true)
    setAiPrompt(prompt)
    try {
      // TODO: Replace with actual AI API call
      // For now, we'll simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate AI response - in real implementation, this would be the AI-generated content
      const simulatedAIResponse = `[AI-Enhanced Content]\n\n${selectedContent}\n\n[This content has been processed with the prompt: "${prompt}"]`

      // Update the content in the editor
      updateHeadingContent(selectedHeading.id, simulatedAIResponse)

      // Update the main editor state
      if (editorRef.current) {
        handleContentChangeWithHeadings(editorRef.current.innerHTML)
      }
    } catch (error) {
      console.error("AI processing error:", error)
      alert("Failed to process content with AI. Please try again.")
    } finally {
      setIsProcessingAI(false)
    }
  }

  const handleCloseAIPanel = () => {
    setShowAIPanel(false)
    setAiPrompt("")
    selectHeading(null)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-[#000000] text-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">Seydam AI-Powered Report Editor</h1>
        <p className="text-blue-50 text-sm">
          {source === "generated" ? `Edit your generated report (ID: ${report_id})` : "Edit your imported report"}
        </p>
      </div>

      <TabbedToolbar
        editorState={editorState}
        onCommand={executeCommand}
        onHeadingStyleUpdate={updateHeadingStyle}
        addCustomHeadingStyle={addCustomHeadingStyle}
        deleteHeadingStyle={deleteHeadingStyle}
        onMarginsChange={updateMargins}
        onLineSpacingChange={updateLineSpacing}
        onPaperSizeChange={updatePaperSize}
        onOrientationChange={updateOrientation}
        onExportPDF={handleExportPDF}
        onExportDocx={handleExportDocx}
        onJsonImport={handleJsonImport}
        onListToggle={handleListToggle}
        onIndent={handleIndent}
        onOutdent={handleOutdent}
        getCurrentListType={getCurrentListType}
        isExporting={isExporting}
        imageHandlers={imageHandlers}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        undoCount={undoCount}
        redoCount={redoCount}
        getRecentHistory={getRecentHistory}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Heading Navigation Panel */}
        <HeadingNavigationPanel
          headings={headings}
          selectedHeading={selectedHeading}
          onHeadingSelect={handleHeadingSelect}
          onHeadingNavigate={handleHeadingNavigate}
          onExtractHeadings={extractHeadings}
        />

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          <Editor
            editorRef={editorRef}
            editorState={editorState}
            onSelectionChange={updateSelection}
            onContentChange={handleContentChangeWithHeadings}
            selectedHeading={selectedHeading}
          />
        </div>

        {/* AI Editing Panel */}
        {showAIPanel && (
          <AIEditingPanel
            selectedHeading={selectedHeading}
            selectedContent={selectedContent}
            prompt={aiPrompt}
            isProcessing={isProcessingAI}
            onPromptChange={setAiPrompt}
            onSubmit={handleAIEdit}
            onClose={handleCloseAIPanel}
          />
        )}
      </div>

      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a1a8c]"></div>
              <span>Generating document...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TextEditor
