"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaFileAlt, FaCheckCircle, FaClock, FaSpinner } from "react-icons/fa";

const ReportLoadingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const report_id = location.state?.report_id;
  const [status, setStatus] = useState(location.state?.status || "queued");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [statusData, setStatusData] = useState(null);

  // Function to format JSON content to HTML (same as JsonImporter)
  const formatContentToHtml = (data) => {
    let html = "";

    // Add topic as main title (H1) if it exists
    if (data.topic) {
      html += `<h1 style="font-size: 24px; font-family: Arial; font-weight: bold; color: #1a1a8c; text-align: left; margin: 20px 0 15px 0;" id="topic-heading" data-heading-style="h1">${data.topic}</h1>`;
    }

    // Process chapters
    Object.entries(data).forEach(([chapterKey, chapterValue]) => {
      // Skip the topic field
      if (
        chapterKey === "topic" ||
        typeof chapterValue !== "object" ||
        !chapterValue
      ) {
        return;
      }

      const chapter = chapterValue;

      // Add chapter title as H1 heading
      html += `<h1 style="font-size: 24px; font-family: Arial; font-weight: bold; color: #1a1a8c; text-align: left; margin: 30px 0 20px 0;" id="chapter-${chapterKey}" data-heading-style="h1">${chapter.title}</h1>`;

      // Sort sections by their numeric keys (1.1, 1.2, etc.)
      const sortedSections = Object.entries(chapter.sections).sort(
        ([a], [b]) => {
          const numA = Number.parseFloat(a);
          const numB = Number.parseFloat(b);
          return numA - numB;
        }
      );

      sortedSections.forEach(([sectionKey, section]) => {
        // Add section heading with number and title combined as H2
        const sectionTitle = `${sectionKey} ${section.title}`;
        html += `<h2 style="font-size: 20px; font-family: Arial; font-weight: bold; color: #1a1a8c; text-align: left; margin: 25px 0 15px 0;" id="section-${sectionKey.replace(
          ".",
          "-"
        )}" data-heading-style="h2">${sectionTitle}</h2>`;

        // Add section content with proper paragraph formatting
        const paragraphs = section.content.split("\n\n");
        paragraphs.forEach((paragraph) => {
          if (paragraph.trim()) {
            html += `<p style="font-size: 12px; font-family: Arial; line-height: 1.15; text-align: justify; margin-bottom: 15px; color: #000000;">${paragraph.trim()}</p>`;
          }
        });
      });
    });

    return html;
  };

  useEffect(() => {
    // if (!report_id) {
    //   navigate("/dashboard");
    //   return;
    // }

    // Timer for elapsed time (every second)
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    // Status polling function
    const pollStatus = async () => {
      try {
        console.log("Checking status for report:", report_id);
        const response = await fetch(
          `${BASE_URL}check-report-status/${report_id}/`,
          {
            headers: {
              Authorization: `Token ${
                localStorage.getItem("seydamtoken") || ""
              }`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Status response:", data);
          setStatusData(data);
          setStatus(data.status);

          // When status is completed, fetch the report data and process it
          if (data.status === "finished") {
            console.log("Report completed, fetching report data...");
            try {
              const reportResponse = await fetch(
                `${BASE_URL}download-report/${report_id}/`,
                {
                  headers: {
                    Authorization: `Token ${
                      localStorage.getItem("seydamtoken") || ""
                    }`,
                  },
                }
              );
              if (reportResponse.ok) {
                const reportJsonData = await reportResponse.json();
                console.log("Report JSON data fetched:", reportJsonData);

                // Process the JSON data through formatContentToHtml (same as JsonImporter)
                const formattedHtml = formatContentToHtml(reportJsonData);
                // Navigate to text editor with the formatted HTML content
                setTimeout(() => {
                  navigate("/text-editor", {
                    state: {
                      importedContent: formattedHtml,
                      // report_id: report_id,
                      // source: "report_generation",
                    },
                  });
                }, 1500);
              } else {
                console.error(
                  "Failed to fetch report data:",
                  reportResponse.status
                );
              }
            } catch (reportError) {
              console.error("Error fetching report:", reportError);
              alert("Error fetching report. Please try again.");
            }
          }
        } else {
          console.error("Failed to check status:", response.status);
        }
      } catch (error) {
        console.error("Error checking status:", error);
      }
    };

    // Initial status check
    pollStatus();

    // Poll every 10 seconds
    const statusInterval = setInterval(pollStatus, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(statusInterval);
    };
  }, [report_id, navigate, BASE_URL]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusMessage = () => {
    switch (status) {
      case "queued":
        return "Your report is in the queue...";
      case "running":
        return "Generating your report...";
      case "completed":
        return "Report generated successfully!";
      default:
        return "Processing your request...";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "queued":
        return <FaClock className="text-yellow-500" size={32} />;
      case "running":
        return <FaSpinner className="text-blue-500 animate-spin" size={32} />;
      case "completed":
        return <FaCheckCircle className="text-green-500" size={32} />;
      default:
        return <FaSpinner className="text-blue-500 animate-spin" size={32} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-4 sm:p-8 w-full max-w-md text-center border-[1px] border-[#0d0d8250]">
        {/* Header */}
        <div className="mb-8">
          <FaFileAlt className="mx-auto text-[#060668] mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Generating Report
          </h1>
          <p className="text-gray-600 text-sm">
            Please wait while we create your report
          </p>
        </div>

        {/* Loading Spinner */}
        {/* <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto flex items-center justify-center">
            {getStatusIcon()}
          </div>
        </div> */}

        {/* Status Message */}
        <div className="mb-6">
          {/* <div className="flex items-center justify-center mb-3">
            <span className="text-lg font-medium text-gray-800">
              {getStatusMessage()}
            </span>
          </div> */}
          {/* <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#060668] border-solid" />
          </div> */}
          {/* {statusData && (
            <div className="text-sm text-gray-500 space-y-1">
              <p>Report ID: {report_id}</p>
              <p>
                Status: <span className="capitalize font-medium">{status}</span>
              </p>
              {statusData.created_at && (
                <p>
                  Started:{" "}
                  {new Date(statusData.created_at).toLocaleTimeString()}
                </p>
              )}
            </div>
          )} */}
        </div>
        <div className=" mx-auto animate-spin rounded-full h-12 w-12 border-t-4 border-[#060668] border-solid" />

        {/* Time Elapsed */}
        <div className=" rounded-lg p-4 my-6">
          <div className="flex items-center justify-center text-gray-600">
            <FaClock className="mr-2 text-[#0D0D82]" size={16} />
            <span className="text-sm">
              Time elapsed: {formatTime(timeElapsed)}
            </span>
          </div>
        </div>

        {/* Loading Animation Dots */}
        <div className="flex justify-center space-x-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#060668] rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>

        {/* Status-based Progress Text */}
        <div className="text-center">
          {status === "queued" && (
            <p
              className="text-base font-medium text-[#0D0D82]  px-3 py-2 rounded-lg "
              style={{ backgroundColor: "rgba(26, 26, 140, 0.2)" }}
            >
              Your report is generating ...
            </p>
          )}
          {status === "running" && (
            <p
              className="text-base font-medium text-[#0D0D82]  px-3 py-2 rounded-lg"
              style={{ backgroundColor: "rgba(26, 26, 140, 0.2)" }}
            >
              Your report is generating ...
            </p>
          )}
          {status === "completed" && (
            <p
              className="text-base font-medium text-[#0D0D82] px-3 py-2 rounded-lg"
              style={{ backgroundColor: "rgba(26, 26, 140, 0.2)" }}
            >
              ✅ Report completed! Processing and redirecting to editor...
            </p>
          )}
        </div>

        {/* Estimated Time */}
        {/* <p className="text-xs text-gray-400 mt-4">
          Report generation typically takes 2-5 minutes
        </p> */}
      </div>
    </div>
  );
};

export default ReportLoadingPage;
