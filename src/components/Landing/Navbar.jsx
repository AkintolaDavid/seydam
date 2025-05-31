"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { FaHome, FaStore, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import logo1 from "../../assets/logo/logowhitebg.png";
import { UserPlus, LogIn } from "lucide-react";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount, setcartItemCount] = useState(null);
  const [wishlistItemCount, setwishlistItemCount] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link to="/">
              <img
                src={logo1 || "/placeholder.svg"}
                className="h-[34px] sm:h-10"
                alt="Logo"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex space-x-8">
            <Link
              to="/"
              className="font-medium text-lg text-gray-900 hover:text-[#000000] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="font-medium text-lg text-gray-900 hover:text-[#000000] transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="font-medium text-lg text-gray-900 hover:text-[#000000] transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-6">
            <button
              onClick={() => {
                navigate("/login");
              }}
              className=" border-[2px] border-[#1A1A8C] font-semibold text-[#1A1A8C] py-[6px] px-6 rounded-md"
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate("/signup");
              }}
              className=" border-[2px] border-[#1A1A8C] bg-[#1A1A8C] font-medium text-[#ffffff] py-[6px] px-6 rounded-md"
            >
              Register
            </button>
          </div>

          <div className="flex lg:hidden items-center space-x-4">
            <button
              onClick={() => {
                navigate("/login");
              }}
              className=" border-[2px] border-[#1A1A8C] font-semibold text-[#1A1A8C] py-[4px] px-6 rounded-md"
            >
              Login
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#1A1A8C]"
            >
              {mobileMenuOpen ? (
                <IoClose className="h-7 w-7" />
              ) : (
                <HiMenu className="h-7 w-7 text-[#1A1A8C]" />
              )}
            </button>
          </div>
          {mobileMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              ></div>

              <div className="fixed top-0 right-0 h-full w-72 bg-gray-100 z-50 lg:hidden overflow-y-auto shadow-xl transform transition-transform duration-300 ease-in-out">
                <div className="flex justify-end items-center py-6 pr-8 border-b border-gray-200">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#1A1A8C] border border-[#1a1a8c] rounded-lg w-8 h-8 flex items-center justify-center"
                  >
                    <IoClose className="h-6 w-6" />
                  </button>
                </div>

                <nav className=" py-5 px-8">
                  <div className="space-y-8">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/");
                      }}
                      className="w-full flex items-center space-x-3 border-[2px] border-[#1a1a8c] text-[#1A1A8C] py-2 px-3 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      <FaHome className="h-[20px] w-[20px]" />
                      <span className="font-medium">Home</span>
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/about");
                      }}
                      className="w-full flex items-center space-x-3 border-[2px] border-[#1a1a8c] text-[#1A1A8C] py-2 px-3 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      <FaInfoCircle className="h-[20px] w-[20px]" />
                      <span className="font-medium">About</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/contact");
                      }}
                      className="w-full flex items-center space-x-3 border-[2px] border-[#1a1a8c] text-[#1A1A8C] py-2 px-3 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      <FaEnvelope className="h-[20px] w-[20px]" />
                      <span className="font-medium">Contact Us</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/login");
                      }}
                      className="w-full flex items-center space-x-3 border-[2px] border-[#1a1a8c] text-[#1A1A8C] py-2 px-3 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      <LogIn className="h-[20px] w-[20px]" />
                      <span className="font-medium">Login</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/signup");
                      }}
                      className="w-full flex items-center space-x-3 border-[2px] border-[#1a1a8c] text-[#1A1A8C] py-2 px-3 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      <UserPlus className="h-[20px] w-[20px]" />
                      <span className="font-medium">Register</span>
                    </button>
                  </div>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-200 bg-gray-100">
                  <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-600">© 2025 SEYDAM</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Navigation - Middle */}
    </header>
  );
};

export default Navbar;
