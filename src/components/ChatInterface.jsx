"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import axios from "axios"

export default function ChatInterface({ setChatHistory }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "system",
      content: "Hello! I'm your coding assistant. Share your code, and I'll help you analyze it.",
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      const token = localStorage.getItem("seydamtoken")
      if (!token) throw new Error("Please log in to continue")

      // Save to chat history
      await axios.post(
        "http://localhost:5000/api/chat-history/save",
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Get code analysis
      const response = await axios.post(
        "http://localhost:5000/api/submissions/submit",
        { userCode: input },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Add assistant's response using the feedback
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "system",
          content: response?.data?.feedback || "I've analyzed your code successfully.",
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "system",
          content:
            error.response?.data?.message || "I encountered an error while processing your code. Please try again.",
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.type === "user" ? "bg-blue-600 text-white" : "bg-white shadow-md"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </motion.div>
        ))}
        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white shadow-md rounded-lg p-4 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your code here..."
            disabled={isProcessing}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  )
}

