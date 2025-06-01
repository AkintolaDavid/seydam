// About.jsx
import React, { useState } from "react";
//import Navbar from '../components/Navbar';
// import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import img1 from "../assets/about/img1.jpg";
import teamImage from "../assets/iphone.png";
import { FiMenu, FiX } from "react-icons/fi";
import Navbar from "../components/Landing/Navbar";
import Footer from "../components/Landing/Footer";

const About = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="relative overflow-hidden w-full min-h-screen bg-white  text-gray-900  px-0 pt-10 sm:pt-20 font-sans">
      <div className="px-[20px] md:px-[65px] lg:px-[104px] mx-auto max-w-[105rem] space-y-10 sm:space-y-16">
        {/* <Navbar hideAuthButtons={true} /> */}
        <Navbar />

        {/* Caption */}
        <div className="text-center pt-2 sm:pt-0">
          <h1 className="text-left text-3xl sm:text-4xl lg:text-5xl sm:w-[90%] font-semibold text-gray-900 leading-tight sm:leading-loose ">
            SEYDAM AI Is Focused On Delivering Top Quality Report With AI
            Assistance.
          </h1>
        </div>

        {/* <!-- Image Section --> */}
        <div className="mt-0 sm:mt-4 space-y-2">
          {/* <!-- Top Large Image --> */}
          <img
            src={img1}
            alt="Team brainstorming"
            className="w-full object-cover h-80 sm:h-[500px] lg:h-[700px] rounded-lg shadow"
          />
        </div>

        {/* Values */}
        <div className="py-4 sm:py-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 sm:mb-8">
            Our Values
          </h2>

          {/* <!-- Grid for Values --> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
            {/* <!-- Value 1 --> */}
            <div className="border-t border-gray-400 pt-2 sm:pt-4 w-full">
              <h3 className="font-semibold text-2xl text-gray-900">Be Bold</h3>
              <p className="mt-1 text-base">
                We are ambitious and non-complacent. We have a hunger to achieve
                great goals. We believe that making big bets is better than
                inaction.
              </p>
            </div>

            {/* <!-- Value 2 --> */}
            <div className="border-t border-gray-400 pt-2 sm:pt-4 w-full">
              <h3 className="font-semibold text-2xl text-gray-900">Be Lean</h3>
              <p className="mt-1 text-base">
                We use the least to achieve the most. We avoid waste of time and
                resources by directing energy to high-impact behaviours.
              </p>
            </div>

            {/* <!-- Value 3 --> */}
            <div className="border-t border-gray-400 pt-2 sm:pt-4 w-full">
              <h3 className="font-semibold text-2xl text-gray-900">
                Be Unorthodox
              </h3>
              <p className="mt-1 text-base">
                We make a difference by introducing new perspectives and
                fighting conformity. We embrace feedback while constantly
                challenging ideas.
              </p>
            </div>

            {/* <!-- Value 4 --> */}
            <div className="border-t border-gray-400 pt-2 sm:pt-4 w-full text-sm">
              <h3 className="font-semibold text-2xl text-gray-900">
                Be Scholarly
              </h3>
              <p className="mt-1 text-base">
                Seeking the truth is of utmost importance. We strive to ensure
                that we minimize major disputes and that our decisions are
                driven by evidence.
              </p>
            </div>
          </div>
        </div>

        {/*Team*/}
        <div className="pb-10 sm:pb-16">
          <h2 className="text-3xl md:text-4xl text-gray-900 font-semibold mb-4 sm:mb-8">
            Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src="#"
                alt="David Park"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Oyewole Temi
                </h3>
                <p className="text-sm text-gray-500">CEO</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src="#"
                alt="David Park"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Akintola David
                </h3>
                <p className="text-sm text-gray-500">CEO</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src="#"
                alt="David Park"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Bonike</h3>
                <p className="text-sm text-gray-500">CEO</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src="#"
                alt="David Park"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Trabaye</h3>
                <p className="text-sm text-gray-500">CEO</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src="#"
                alt="David Park"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Samo</h3>
                <p className="text-sm text-gray-500">CEO</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src="#"
                alt="David Park"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Deo</h3>
                <p className="text-sm text-gray-500">CEO</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src="#"
                alt="David Park"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sola</h3>
                <p className="text-sm text-gray-500">CEO</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src="#"
                alt="David Park"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Adeleke Konge
                </h3>
                <p className="text-sm text-gray-500">CEO</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
