import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logoGreen.png";
export default function Login({ setToken }) {
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
      localStorage.setItem("token", response.data.token);
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
    localStorage.removeItem("token");
  }, []);
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo */}
          <div className="flex justify-center lg:justify-start">
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
            <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-gray-500">
              Please enter your details and login below
            </p>
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
                  className="mt-1 bg-white block w-full rounded-lg border border-[#16A34A] px-4 py-3 
             focus:outline-none focus:ring-0 focus:border-[#16A34A]"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block bg-white  w-full rounded-lg border border-[#16A34A] px-4 py-3  
                             focus pr-12"
                    placeholder="Enter your password"
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

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg bg-green-50 text-green-600`}
              >
                {message}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg bg-red-50 text-red-600`}
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex justify-center items-center px-4 py-3 text-white bg-[#16A34A] 
                         rounded-lg hover:bg-[#13b750] focus:outline-none focus:ring-2 focus:ring-[#16A34A] 
                         focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign in
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account yet?{" "}
                <Link to="/signup" className="font-medium text-[#16A34A]">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
