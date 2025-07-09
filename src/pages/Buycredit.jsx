"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaClock,
  FaCreditCard,
  FaUser,
  FaSignOutAlt,
  FaCoins,
  FaShoppingCart,
  FaArrowLeft,
  FaCheck,
  FaStar,
} from "react-icons/fa";

const BuyCredits = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);

  const creditPackages = [
    {
      id: 1,
      credits: 10,
      price: 5000,
      popular: false,
      savings: 0,
      description: "Perfect for trying out our service",
    },
    {
      id: 2,
      credits: 25,
      price: 12000,
      popular: true,
      savings: 500,
      description: "Great for regular users",
    },
    {
      id: 3,
      credits: 50,
      price: 23000,
      popular: false,
      savings: 2000,
      description: "Best value for heavy users",
    },
    {
      id: 4,
      credits: 100,
      price: 45000,
      popular: false,
      savings: 5000,
      description: "Maximum value package",
    },
  ];

  const handlePurchase = async (pkg) => {
    setSelectedPackage(pkg.id);
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Redirect to success page or dashboard
      alert(
        `Successfully purchased ${
          pkg.credits
        } credits for ₦${pkg.price.toLocaleString()}!`
      );
      navigate("/dashboard");
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen  flex">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Buy Credits</h1>
            <p className="text-gray-600 mt-1">
              Choose a credit package that fits your needs
            </p>
          </div>
        </div>

        {/* Credit Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaCoins className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800">
                How Credits Work
              </h3>
              <p className="text-blue-700 mt-1">
                Each report generation costs 5 credits. Minimum purchase is 10
                credits (₦5,000). Credits never expire and can be used anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Credit Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {creditPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative border-2 rounded-xl p-6 text-center transition-all hover:shadow-lg ${
                pkg.popular
                  ? "border-blue-500 bg-blue-50 transform scale-105"
                  : "border-gray-200 hover:border-blue-300 bg-white"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <FaStar className="text-xs" />
                    <span>Most Popular</span>
                  </span>
                </div>
              )}

              <div className="mb-4">
                <FaCoins
                  className={`text-4xl mx-auto ${
                    pkg.popular ? "text-blue-600" : "text-yellow-600"
                  }`}
                />
              </div>

              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {pkg.credits}
              </h3>
              <p className="text-gray-600 mb-4">Credits</p>

              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-800">
                  ₦{pkg.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  ₦{(pkg.price / pkg.credits).toLocaleString()} per credit
                </p>
              </div>

              {pkg.savings > 0 && (
                <div className="mb-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Save ₦{pkg.savings.toLocaleString()}
                  </span>
                </div>
              )}

              <p className="text-sm text-gray-600 mb-6">{pkg.description}</p>

              <div className="mb-6">
                <div className="text-left space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCheck className="text-green-500 mr-2" />
                    <span>
                      {Math.floor(pkg.credits / 5)} reports can be generated
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCheck className="text-green-500 mr-2" />
                    <span>Credits never expire</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCheck className="text-green-500 mr-2" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(pkg)}
                disabled={loading && selectedPackage === pkg.id}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  pkg.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading && selectedPackage === pkg.id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FaShoppingCart />
                    <span>Purchase Now</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Accepted Payment Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
              <div className="bg-green-100 p-2 rounded">
                <FaCreditCard className="text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Bank Transfer</h4>
                <p className="text-sm text-gray-600">Direct bank transfer</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
              <div className="bg-blue-100 p-2 rounded">
                <FaCreditCard className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Paystack</h4>
                <p className="text-sm text-gray-600">Card payments</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
              <div className="bg-purple-100 p-2 rounded">
                <FaCreditCard className="text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Flutterwave</h4>
                <p className="text-sm text-gray-600">Mobile money & cards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCredits;
