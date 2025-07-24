"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaPlus,
  FaCoins,
  FaEdit,
  FaCalendarAlt,
  FaDownload,
  FaEye,
} from "react-icons/fa";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ReportForm from "./ReportForm";

const Dashboard = () => {
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
  const username = localStorage.getItem("username");
  const capitalizedUsername = username
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const [data, setdata] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const toast = useToast();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("seydamtoken"); // Get token from storage
        console.log(token);
        const response = await axios.get(`${BASE_URL}dashboard`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setdata(response.data); // Store the products in state
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []); 

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleCreateNewReport = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOutline = async (report_id) => {
    try {
      const token = localStorage.getItem("seydamtoken");
      const baseUrl = import.meta.env.VITE_BASE_URL;

      // Find the report topic and description from previously fetched reports
      const selectedReport = data?.reports?.find(
        (report) => report.report_id === report_id
      );

      const topic = selectedReport?.report_topic || "";
      const description = selectedReport?.report_description || "";

      const response = await axios.get(
        `${baseUrl}report/${report_id}/content/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(response);
      navigate("/report-structure", {
        state: {
          structureData: response.data.outline,
          topic,
          description,
          report_id,
        },
      });
    } catch (error) {
      console.error("Error approving report:", error);
    }
  };

  const viewreport = async (report_id) => {
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
  };
  return (
    <div className="min-h-screen bg-black flex p-4 sm:p-6">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header with Credits */}
        <div className="md:border-b-[1px] flex justify-between items-center mb-4 md:mb-8 md:mt-2">
          <div className="hidden md:block">
            <h1 className="text-[22px] sm:text-2xl md:text-3xl font-bold text-white">
              {capitalizedUsername} Dashboard
            </h1>
            <p className="text-white mb-2 mt-0 text-[17px] font-medium max-w-[300px] sm:max-w-[900px]">
              Welcome back! Ready to create your next report?
            </p>
          </div>

          {/* Credits Display */}
          {/* <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaCoins className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Credits</p>
              <p className="text-2xl font-bold text-gray-800">
                {data?.remaining_credits}
              </p>
            </div>
            <button
              onClick={handleBuyCredits}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Buy More
            </button>
          </div> */}
        </div>

        {/* Create New Report Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* New Report Card */}
          <div className="lg:col-span-2">
            <div className="bg-[#ffffff]  rounded-lg p-4 relative overflow-hidden">
              <div className="relative z-10 text-black">
                <h2 className="text-[20px] sm:text-[22px] lg:text-2xl font-bold mb-2">
                  Create New Report
                </h2>
                <p className=" mb-4 sm:mb-6 text-sm sm:text-base max-w-[300px] sm:max-w-[400px] lg:max-w-[900px]">
                  Start writing your next academic or research report with AI
                  assistance.
                </p>
                <button
                  onClick={handleCreateNewReport}
                  className="bg-[#060668] text-[#ffffff] px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-medium  transition-colors flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Create New Report</span>
                </button>
              </div>{" "}
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <ReportForm onClose={handleCloseModal} />
                </div>
              )}
              <div className="absolute top-4 right-4 opacity-20">
                <FaFileAlt className="text-5xl sm:text-6xl" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Reports Created</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {" "}
                    {data?.report_count || 0}
                  </p>
                </div>
                <div className="bg-[#060668] p-3 rounded-full">
                  <FaFileAlt className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-3 ">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Credits Used</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {" "}
                    {data?.used_credits ?? 0}/{data?.amounted_credits ?? 0}
                  </p>
                </div>
                <div className="bg-[#060668] p-3 rounded-full">
                  <FaCoins className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                Reports Generated
              </h3>
              {/* <button className="text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button> */}
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data?.reports?.map((report, index) => (
                <div
                  key={index}
                  className="flex  flex-col sm:flex-row items-end sm:items-center justify-between p-2 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start sm:items-center space-x-4">
                    <div className="bg-blue-50 p-[6px] sm:p-2 rounded-lg">
                      <FaFileAlt className="text-[#060668] text-2xl" />
                    </div>
                    <div>
                      <h4 className="text-[13px] sm:text-base font-medium text-gray-800">
                        <p>
                          {report.report_topic.length > 80
                            ? report.report_topic.slice(0, 80) + "..."
                            : report.report_topic}
                        </p>

                        {/* {report?.report_topic
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")} */}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        {/* <span className="flex items-center space-x-1">
                          <FaCalendarAlt />
                          <span>
                            {new Date(report.date).toLocaleDateString()}
                          </span>
                        </span>
                        <span>{report.pages} pages</span> */}
                        <span className="bg-gray-50 text-black px-2 py-1 rounded-full text-xs">
                          {new Date(report.created_at).toLocaleDateString()}
                        </span> 
                        <span
  className={`px-2 py-1 rounded-full text-xs
    ${
      report.status === "complete"
        ? "bg-green-100 text-green-800"
        : report.status === "outline"
        ? "bg-red-100 text-red-800"
        : "bg-red-100 text-red-800"
    }
  `}
>
  {report.status}
</span>

                      </div>
                    </div>
                  </div>
                  <div className="flex mt-3 sm:mt-0 space-x-2">
                  {report.status !== "outline" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewreport(report.report_id)}
                          className="bg-blue-900 text-white font-medium rounded-lg py-1 text-sm px-2"
                        >
                          View Report
                        </button>
                      </div>
                   ) : report.status === "outline" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOutline(report.report_id)}
                          className="bg-blue-900 text-white font-medium rounded-md py-1 text-sm px-3"
                        >
                          View Outline
                        </button>
                      </div>
                    ) : null}
               {/*      {report.status === "completed" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewreport(report.report_id)}
                          className="bg-blue-900 text-white font-medium rounded-lg py-1 text-sm px-2"
                        >
                          View Report
                        </button>
                      </div>
                    ) : report.status === "in progress" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewreport(report.report_id)}
                          className="bg-blue-900 text-white font-medium rounded-lg py-1 text-sm px-2"
                        >
                          View Report
                        </button>
                      </div>
                    ) : report.status === "outline" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOutline(report.report_id)}
                          className="bg-blue-900 text-white font-medium rounded-md py-1 text-sm px-3"
                        >
                          View Outline
                        </button>
                      </div>
                    ) : null} */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
