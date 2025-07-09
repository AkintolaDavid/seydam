"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaPlus,
  FaClock,
  FaCreditCard,
  FaUser,
  FaSignOutAlt,
  FaCoins,
  FaEdit,
  FaCalendarAlt,
  FaDownload,
  FaEye,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userCredits] = useState(25); // Mock user credits
  const [recentReports] = useState([
    {
      id: 1,
      title:
        "Design and Implementation of IoT-Enabled Environmental Monitoring System",
      date: "2024-01-15",
      status: "completed",
      pages: 45,
      type: "Research Project",
    },
    {
      id: 2,
      title: "Machine Learning Applications in Healthcare Data Analysis",
      date: "2024-01-10",
      status: "completed",
      pages: 38,
      type: "Final Year Project",
    },
    {
      id: 3,
      title: "Blockchain Technology for Supply Chain Management",
      date: "2024-01-05",
      status: "completed",
      pages: 52,
      type: "Thesis",
    },
  ]);

  const handleCreateNewReport = () => {
    navigate("/report-form");
  };

  const handleBuyCredits = () => {
    navigate("/buy-credits");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-auto bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header with Credits */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Ready to create your next report?
            </p>
          </div>

          {/* Credits Display */}
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaCoins className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Credits</p>
              <p className="text-2xl font-bold text-gray-800">{userCredits}</p>
            </div>
            <button
              onClick={handleBuyCredits}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Buy More
            </button>
          </div>
        </div>

        {/* Create New Report Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* New Report Card */}
          <div className="lg:col-span-2">
            <div className="bg-[#0D0D82]  rounded-xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4">Create New Report</h2>
                <p className="text-blue-100 mb-6">
                  Start writing your next academic or research report with AI
                  assistance.
                </p>
                <button
                  onClick={handleCreateNewReport}
                  className="bg-white text-[#0D0D82] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Start New Report</span>
                </button>
              </div>
              <div className="absolute top-4 right-4 opacity-20">
                <FaFileAlt className="text-6xl" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reports Created</p>
                  <p className="text-2xl font-bold text-gray-800">12</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaFileAlt className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Credits Used</p>
                  <p className="text-2xl font-bold text-gray-800">60</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FaCoins className="text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                Recent Reports
              </h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FaFileAlt className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {report.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center space-x-1">
                          <FaCalendarAlt />
                          <span>
                            {new Date(report.date).toLocaleDateString()}
                          </span>
                        </span>
                        <span>{report.pages} pages</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {report.type}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <FaEye />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <FaDownload />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <FaEdit />
                    </button>
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
