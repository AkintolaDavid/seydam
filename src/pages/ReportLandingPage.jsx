"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FaFileAlt, FaCheckCircle, FaClock, FaSpinner } from "react-icons/fa"

const ReportLoadingPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const jobId = location.state?.jobId
  const topic = location.state?.topic || "Your Report"

  const [status, setStatus] = useState("queued")
  const [progress, setProgress] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [statusData, setStatusData] = useState(null)

  useEffect(() => {
    if (!jobId) {
      navigate("/report-form")
      return
    }

    // Timer for elapsed time
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    // Status polling
    const pollStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}check-report-status/${jobId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("seydamtoken") || ""}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setStatusData(data)
          setStatus(data.status)

          // Update progress based on status
          if (data.status === "queued") {
            setProgress(10)
          } else if (data.status === "processing") {
            setProgress(50)
          } else if (data.status === "finished") {
            setProgress(100)
            // Wait a moment then navigate to report page
            setTimeout(() => {
              navigate("/report-generated", {
                state: { jobId, topic },
              })
            }, 2000)
          }
        }
      } catch (error) {
        console.error("Error checking status:", error)
      }
    }

    // Initial status check
    pollStatus()

    // Poll every 5 seconds (not too frequent to avoid stressing server)
    const statusInterval = setInterval(pollStatus, 5000)

    return () => {
      clearInterval(timer)
      clearInterval(statusInterval)
    }
  }, [jobId, navigate])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusMessage = () => {
    switch (status) {
      case "queued":
        return "Your report is in the queue..."
      case "processing":
        return "Generating your report..."
      case "finished":
        return "Report generated successfully!"
      default:
        return "Processing your request..."
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "queued":
        return <FaClock className="text-yellow-500" size={24} />
      case "processing":
        return <FaSpinner className="text-blue-500 animate-spin" size={24} />
      case "finished":
        return <FaCheckCircle className="text-green-500" size={24} />
      default:
        return <FaSpinner className="text-blue-500 animate-spin" size={24} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        {/* Header */}
        <div className="mb-8">
          <FaFileAlt className="mx-auto text-blue-600 mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Generating Report</h1>
          <p className="text-gray-600 text-sm">{topic}</p>
        </div>

        {/* Progress Circle */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none" />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-3">
            {getStatusIcon()}
            <span className="ml-3 text-lg font-medium text-gray-800">{getStatusMessage()}</span>
          </div>

          {statusData && (
            <div className="text-sm text-gray-500 space-y-1">
              <p>Job ID: {jobId}</p>
              <p>Status: {status}</p>
              {statusData.created_at && <p>Started: {new Date(statusData.created_at).toLocaleTimeString()}</p>}
            </div>
          )}
        </div>

        {/* Time Elapsed */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center text-gray-600">
            <FaClock className="mr-2" size={16} />
            <span className="text-sm">Time elapsed: {formatTime(timeElapsed)}</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>

        {/* Estimated Time */}
        <p className="text-xs text-gray-400 mt-4">Report generation typically takes 2-5 minutes</p>
      </div>
    </div>
  )
}

export default ReportLoadingPage
