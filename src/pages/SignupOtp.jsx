import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import logo from "../assets/logo/logowhitebg.png";
import { FaAngleLeft } from "react-icons/fa";
import axios from "axios";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const email = localStorage.getItem("signupemail");

      if (!email || otp.length !== 6) {
        throw new Error("Invalid email or OTP.");
      }

      const response = await axios.post(`${BASE_URL}verify-otp/`, {
        email,
        otp: parseInt(otp, 10),
      });
      localStorage.setItem("seydamtoken", response.data.token);
      toast({
        title: "OTP Verified",
        description: response.data?.message || "You're now logged in.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });

      // Optional: store token if needed
      // localStorage.setItem("seydamtoken", response.data.token);

      localStorage.removeItem("signupemail");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description:
          error.response?.data?.error ||
          error.message ||
          "Invalid OTP entered.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-10 left-8 flex items-center"
      >
        <div className="p-[6px] border-[2px] text-[#0D0D82] border-[#0D0D82] rounded-lg">
          <FaAngleLeft className="text-[#0D0D82]" />
        </div>
        <span className="text-lg ml-1 font-medium text-[#0D0D82]">Back</span>
      </button>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo */}
          <div className="flex justify-start">
            <img
              src={logo}
              alt="Logo"
              width={180}
              height={60}
              className="h-14 w-auto"
            />
          </div>

          {/* OTP Form */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Enter OTP Code
            </h2>
            <p className="text-gray-900">
              A 6-digit code was sent to your email.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="mt-1 block w-full text-center text-xl tracking-widest rounded-lg border border-[#0D0D82] px-4 py-3 placeholder-gray-400 
                       focus:outline-none focus:ring-0 focus:border-[#0D0D82]"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full flex justify-center items-center px-4 py-3 text-white bg-[#0D0D82] 
                       rounded-lg focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
