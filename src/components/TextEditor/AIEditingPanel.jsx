import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  Lightbulb, 
  RefreshCw,
  Copy,
  Check,
  Wand2,
  FileText
} from 'lucide-react'; 

 

const promptSuggestions = [
  {
    category: "Improve Writing",
    prompts: [
      "Make this content more professional and formal",
      "Simplify the language for better readability",
      "Add more detail and examples to this section",
      "Improve the flow and transitions between ideas",
      "Make this more engaging and compelling"
    ]
  },
  {
    category: "Content Enhancement",
    prompts: [
      "Expand this section with relevant examples",
      "Add bullet points to summarize key information",
      "Include relevant statistics or data points",
      "Add a conclusion paragraph to this section",
      "Create an introduction for this section"
    ]
  },
  {
    category: "Style & Tone",
    prompts: [
      "Rewrite in a more conversational tone",
      "Make this sound more authoritative",
      "Adjust the tone to be more persuasive",
      "Rewrite for a technical audience",
      "Make this more concise and to the point"
    ]
  },
  {
    category: "Structure & Format",
    prompts: [
      "Reorganize this content for better structure",
      "Break this into smaller, digestible paragraphs",
      "Add subheadings to organize the content",
      "Create a numbered list from this content",
      "Format this as a step-by-step guide"
    ]
  }
];

export const AIEditingPanel = ({
  selectedHeading,
  selectedContent,
  prompt,
  isProcessing,
  onPromptChange,
  onSubmit,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [prompt]);

  const handleSubmit = () => {
    if (prompt.trim() && !isProcessing) {
      onSubmit(prompt.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyContent = async () => {
    try {
      // Extract text content from HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = selectedContent;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy content:', error);
    }
  };

  const getContentPreview = () => {
    if (!selectedContent) return 'No content selected';
    
    // Extract text content from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = selectedContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Remove placeholder text if present
    if (textContent.includes('No content under this heading yet')) {
      return 'No content under this heading yet. Start writing to see content here.';
    }
    
    // Limit preview to first 300 characters for better display
    return textContent.length > 300 
      ? textContent.substring(0, 300) + '...'
      : textContent;
  };

  const getContentWordCount = () => {
    if (!selectedContent) return 0;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = selectedContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Don't count placeholder text
    if (textContent.includes('No content under this heading yet')) {
      return 0;
    }
    
    return textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const hasActualContent = () => {
    if (!selectedContent) return false;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = selectedContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    return textContent.trim() && !textContent.includes('No content under this heading yet');
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg max-h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="text-white" size={16} />
            </div>
            <h2 className="font-semibold text-gray-900">AI Content Editor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        {selectedHeading && (
          <div className="space-y-1">
            <div className="text-sm text-gray-600">
              Editing: <span className="font-medium text-gray-900">{selectedHeading.text}</span>
            </div>
            <div className="text-xs text-gray-500">
              Level {selectedHeading.level} • {getContentWordCount()} words
            </div>
          </div>
        )}
      </div>

      {/* Selected Content Preview */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Content Under This Heading</h3>
          {hasActualContent() && (
            <button
              onClick={copyContent}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        
        <div className="p-3 bg-white border border-gray-200 rounded text-sm max-h-32 overflow-y-auto">
          {hasActualContent() ? (
            <div className="text-gray-700">
              {getContentPreview()}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500 italic">
              <FileText size={16} />
              <span>No content under this heading yet. Start writing to see content here.</span>
            </div>
          )}
        </div>

        {hasActualContent() && (
          <div className="mt-2 text-xs text-gray-500">
            This is the content that will be enhanced by AI. The heading itself is not included.
          </div>
        )}
      </div>

      {/* AI Prompt Input */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Enhancement Prompt
        </label>
        
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasActualContent() 
              ? "Describe how you want to improve this content..." 
              : "Describe what content you want to generate for this section..."
            }
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            rows={3}
            disabled={isProcessing}
          />
          
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isProcessing}
            className="absolute bottom-2 right-2 p-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Submit prompt (Ctrl+Enter)"
          >
            {isProcessing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Press Ctrl+Enter to submit • {prompt.length}/500 characters
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Prompt Suggestions */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="text-yellow-500" size={16} />
            <h3 className="text-sm font-medium text-gray-700">Suggestion Categories</h3>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 mb-4">
            {promptSuggestions.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                  activeCategory === index
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.category}
              </button>
            ))}
          </div>
          
          {/* Prompt Suggestions */}
          <div className="space-y-2">
            {promptSuggestions[activeCategory].prompts.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onPromptChange(suggestion)}
                className="w-full p-3 text-left text-sm bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                disabled={isProcessing}
              >
                <div className="flex items-start gap-2">
                  <Wand2 size={14} className="text-purple-500 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-gray-700 group-hover:text-purple-700">
                    {suggestion}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Content-specific suggestions */}
          {!hasActualContent() && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Content Generation Ideas:</h4>
              <div className="space-y-2">
                {[
                  "Write an introduction explaining the key concepts",
                  "Create a detailed explanation with examples",
                  "Generate a comprehensive overview of this topic",
                  "Write step-by-step instructions or methodology",
                  "Create a summary of important points"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onPromptChange(suggestion)}
                    className="w-full p-2 text-left text-xs bg-white border border-blue-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    disabled={isProcessing}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="p-4 border-t border-gray-200 bg-blue-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Processing with AI...</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600">
            {hasActualContent() 
              ? "Enhancing your existing content. Please wait..."
              : "Generating new content for this section. Please wait..."
            }
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 <strong>How it works:</strong></p>
          <p>• Content shown is everything under the selected heading</p>
          <p>• AI will enhance or generate content for this section only</p>
          <p>• The heading itself remains unchanged</p>
          <p>• Use specific prompts for better results</p>
        </div>
      </div>
    </div>
  );
};