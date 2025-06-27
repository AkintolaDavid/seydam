"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaDownload,
  FaEye,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const ReportGeneratedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const jobId = location.state?.jobId;
  const topic = location.state?.topic || "Your Report";

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) {
      navigate("/report-form");
      return;
    }

    const fetchReport = async () => {
      try {
        const response = await fetch(`${BASE_URL}download-report/${jobId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("seydamtoken") || ""}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReportData(data);
        } else {
          throw new Error("Failed to fetch report");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [jobId, navigate]);

  const handleDownload = async () => {
    try {
      const response = await fetch(`${BASE_URL}download-report/${jobId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("seydamtoken") || ""}`,
        },
      });
      console.log(response);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-${jobId}.docx`;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Error downloading report. Please try again.");
    }
  };

  const handleNewReport = () => {
    navigate("/report-form");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <FaSpinner
            className="animate-spin mx-auto text-blue-600 mb-4"
            size={48}
          />
          <h2 className="text-xl font-semibold text-gray-800">
            Loading your report...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="text-red-500 mb-4">
            <FaFileAlt size={48} className="mx-auto opacity-50" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Report
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleNewReport}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
          <FaCheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Report Generated Successfully!
          </h1>
          <p className="text-gray-600 mb-4">{topic}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <FaDownload className="mr-2" />
              Download Report
            </button>
            {/* <button
              onClick={handleNewReport}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Create New Report
            </button> */}
          </div>
        </div>

        {/* Report Preview */}
        {reportData && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <FaEye className="text-blue-600 mr-3" size={24} />
              <h2 className="text-2xl font-semibold text-gray-800">
                Report Preview
              </h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(reportData, null, 2)}
              </pre>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Job ID:</strong> {jobId}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Generated:</strong> {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportGeneratedPage;
