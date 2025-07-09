import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import logo from "../assets/logo/logowhitebg.png";
import { FaAngleLeft } from "react-icons/fa";
export default function Signup() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast(); // ✅ init toast

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}register/`,
        {
          username,
          email,
          password1,
          password2,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ); 
      if (response.status === 200) {
        toast({
          title: "OTP successfully sent to your mail",
          status: "success",
          duration: 2000, // Toast visible for 2 seconds
          isClosable: true,
          position: "top-right",
        });
      
        localStorage.setItem("signupemail", email);
      
        // Wait 2 seconds before navigating
        setTimeout(() => {
          navigate("/signupotp");
        }, 2000);
      }
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Error signing up";
      // ✅ Show error toast from backend message
      toast({
        title: "Signup Failed",
        description: errorMsg,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem("seydamtoken");
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form Section */}{" "}
      <button
        onClick={() => {
          navigate("/");
        }}
        className="absolute top-10 left-8 flex items-center "
      >
        <div className="p-[6px] border-[2px] text-[#0D0D82] border-[#0D0D82] rounded-lg">
          <FaAngleLeft className="text-[#0D0D82]" />
        </div>{" "}
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

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Create An Account
            </h2>
            <p className="text-gray-900">
              Please enter your details to register
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg border border-[#0D0D82] px-4 py-3 placeholder-gray-400 
                           focus:outline-none focus:ring-0 focus:border-[#0D0D82]"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg border border-[#0D0D82] px-4 py-3 placeholder-gray-400 
                           focus:outline-none focus:ring-0 focus:border-[#0D0D82]"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label
                  htmlFor="password1"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password1"
                    type={showPassword ? "text" : "password"}
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-[#0D0D82] px-4 py-3 placeholder-gray-400 
                             focus:outline-none focus:ring-0 focus:border-[#0D0D82] pr-12"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password2"
                    type={showPassword ? "text" : "password"}
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-[#0D0D82] px-4 py-3 placeholder-gray-400 
                             focus:outline-none focus:ring-0 focus:border-[#0D0D82] pr-12"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex justify-center items-center px-4 py-3 text-white bg-[#0D0D82] 
                         rounded-lg 
                         focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Register
                  </>
                )}
              </button>

              <p className="text-center text-base text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-[#0D0D82]">
                  Click To Sign In
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
