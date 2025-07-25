// src/components/Footer.jsx

import React from "react";
import { FaInstagram, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { FiFeather } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/logoblackbg.png";
import img from "../../assets/about/img2.jpg";
const Footer = () => (
  <footer
    id="footer"
    className="relative bg-[#000145] text-white py-20 overflow-hidden"
  >
    {" "}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      {/* Very dark overlay to make image barely visible */}
      <div className="absolute inset-0 bg-[#000145] bg-opacity-80"></div>
    </div>
    <div className="relative px-[20px] md:px-[65px] lg:px-[104px] mx-auto max-w-[105rem]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div className="">
          <div className="flex items-center mb-2">
            <img src={logo} alt="Saydem AI Logo" className="h-14" />
            {/* <span className="text-2xl font-bold">Saydem AI</span> */}
          </div>
          {/* <span>Generate Your Very Own AI assisted Report</span> */}
          {/* <Link to="/get-started" className="bg-blue-700">
            <button className="flex items-center gap-2 px-6 py-2 bg-white text-[#0D0D82] rounded-md hover:bg-green-800 active:bg-green-900 mt-4 transition duration-200">
              Get Started
              <FiFeather className="text-[#0D0D82]" />
            </button>
          </Link> */}
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="text-lg font-semibold">Explore</h3>
          <ul className="mt-4 space-y-2 text-gray-100">
            <li>
              <a href="#pricing" className="hover:text-white">
                Pricing
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-white">
                Services
              </a>
            </li>{" "}
            <li>
              <a href="/about" className="hover:text-white">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold">Legal</h3>
          <ul className="mt-4 space-y-2 text-gray-100">
            <li>
              <a href="/terms-and-conditions" className="hover:text-white">
                Terms Of Service
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/refund-policy" className="hover:text-white">
                Refund Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-lg font-semibold">Connect</h3>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="text-gray-100 hover:text-white">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-gray-100 hover:text-white">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="text-gray-100 hover:text-white">
              <FaGithub size={20} />
            </a>
            <a href="#" className="text-gray-100 hover:text-white">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-24 lg:mt-40 border-t border-gray-200 pt-6 text-center text-gray-200 text-sm">
        Copyright &copy; {new Date().getFullYear()} Saydem. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
