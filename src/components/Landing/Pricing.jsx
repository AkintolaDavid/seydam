import React from "react";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden py-16 sm:py-20 md:py-32 transition-colors duration-300"
    >
      {/* bottom-right circle */}
      {/* <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-green-200 rounded-full opacity-50" /> */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Header */}
        <h2 className="text-4xl font-semibold text-gray-900 dark:text-white lg:mt-3">
          Pricing Plans
        </h2>

        {/* Pricing Cards */}
        <div className="mt-10 sm:mt-16 grid gap-8 grid-cols-1 md:grid-cols-3">
          {/* Free Tier */}
          <div className="border-1 border-green-400 rounded-lg p-6 shadow-xl flex flex-col">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white ">
              Free
            </h3>
            <p className="mt-4 text-[32px] font-extrabold text-gray-900 dark:text-white">
              Free Trial
              {/* <span className="text-2xl font-medium">/mo</span> */}
            </p>
            <ul className="mt-6 space-y-4 text-gray-600 dark:text-white flex-1">
              <li>Generates Report Structure</li>
              <li>Generates Only Chapter One</li>
              <li>⁠Limited amount of tokens</li>
            </ul>
            <button className="mt-6 px-4 py-2 font-semibold text-[#1a1a8c] bg-white rounded-md transition">
              Try Free Now
            </button>
          </div>

          {/* Special Tier (Highlighted) */}
          <div className="border-1 border-purple-500 rounded-lg p-6 shadow-xl flex flex-col">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Special
            </h3>
            <p className="mt-4 text-[32px] font-extrabold text-gray-900 dark:text-white">
              &#8358;30,000
              {/* <span className="text-2xl font-medium">/mo</span> */}
            </p>
            <ul className="mt-6 space-y-4 text-gray-600 dark:text-white flex-1">
              <li>Generates Full Report</li>
              <li>500,000 tokens of AI prompts</li>{" "}
              <li>Access to 50 citations in report</li>
            </ul>
            <button className="mt-6 px-4 py-2 font-semibold text-[#1a1a8c] bg-white rounded-md transition">
              Choose Special
            </button>
          </div>

          {/* Premium Tier */}
          <div className="border-1 border-amber-500 rounded-lg p-6 shadow-xl flex flex-col">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Premium
            </h3>
            <p className="mt-4 text-[32px] font-extrabold text-gray-900 dark:text-white">
              &#8358;40,000
              {/* <span className="text-2xl font-medium">/mo</span> */}
            </p>
            <ul className="mt-6 space-y-4 text-gray-600 dark:text-white flex-1">
              <li>Generates ⁠Presentation Slides</li>
              <li>⁠Access to max of 100 references </li>
              <li>1 million tokens of AI changes</li>
            </ul>
            <button className="mt-6 px-4 py-2 font-semibold text-[#1a1a8c] bg-white rounded-md transition">
              Choose Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
