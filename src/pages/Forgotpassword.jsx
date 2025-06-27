import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo/logowhitebg.png";
import { FaAngleLeft } from "react-icons/fa6";
export default function ForgotPassword() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}login/`, {
        email,
        password,
      });

      setMessage(response.data.message);
      console.log(response.data);
      localStorage.setItem("seydamtoken", response.data.token);
      setToken(response.data.token); // ✅ Update token state
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("username", response.data.username);
      if (response?.data?.hadUserGenerated === false) {
        navigate("/reportform");
      } else {
        navigate("/generationPage");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error logging in");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem("seydamtoken");
  }, []);
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <button
        onClick={() => {
          navigate("/login");
        }}
        className="absolute top-10 left-8 flex items-center "
      >
        <div className="p-[6px] border-[2px] text-[#0D0D82] border-[#0D0D82] rounded-lg">
          <FaAngleLeft className="text-[#0D0D82]" />
        </div>{" "}
        <span className="text-lg ml-1 font-medium text-[#0D0D82]">Back</span>
      </button>
      {/* Form Section */}
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
              Forgot Password
            </h2>
            <p className="text-gray-00">Please enter your registered Email</p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 bg-white block w-full rounded-lg border border-[#0D0D82] px-4 py-3 
             focus:outline-none focus:ring-0 focus:border-[#0D0D82]"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex justify-center items-center px-4 py-3 text-white bg-[#0D0D82] 
                         rounded-lg  focus:outline-none focus:ring-2 focus:ring-[#0D0D82] 
                         focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Submit</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
