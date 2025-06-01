import React from "react";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="relative bg-white text-gray-900  overflow-hidden py-16 sm:py-20 md:py-32 transition-colors duration-300"
    >
      {/* bottom-right circle */}
      {/* <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-green-200 rounded-full opacity-50" /> */}

      <div className="relative px-[20px] md:px-[65px] lg:px-[104px] mx-auto max-w-[105rem] text-center">
        {/* Section Header */}
        <h2 className="text-4xl font-bold  lg:mt-3">Pricing Plans</h2>

        {/* Pricing Cards */}
        <div className="mt-10 sm:mt-16 grid gap-8 grid-cols-1 md:grid-cols-3">
          {/* Free Tier */}
          <div className="border-[2px] border-[#1a1a8c] rounded-lg p-3 sm:p-6  flex flex-col">
            <h3 className="text-2xl font-semibold text-gray-900  ">Free</h3>
            <p className="mt-4 text-[32px] font-bold text-gray-900 ">
              Free Trial
              {/* <span className="text-2xl font-medium">/mo</span> */}
            </p>
            <ul className="mt-6 space-y-4 text-gray-900  flex-1">
              <li>Generates Report Structure</li>
              <li>Generates Only Chapter One</li>
              <li>⁠Limited amount of tokens</li>
            </ul>
            <button className="mt-6 px-4 py-2 font-semibold text-[#ffffff] bg-[#1a1a8c] rounded-md transition">
              Try Free Now
            </button>
          </div>

          {/* Special Tier (Highlighted) */}
          <div className="border-[2px] border-[#1a1a8c] rounded-lg p-3 sm:p-6  flex flex-col">
            <h3 className="text-2xl font-semibold text-gray-900 ">Premium</h3>
            <p className="mt-4 text-[32px] font-bold text-gray-900 ">
              &#8358;30,000
              {/* <span className="text-2xl font-medium">/mo</span> */}
            </p>
            <ul className="mt-6 space-y-4 text-gray-900  flex-1">
              <li>Generates Full Report</li>
              <li>Access to 50 citations and references</li>
              <li>500,000 tokens of AI changes</li>{" "}
            </ul>
            <button className="mt-6 px-4 py-2 font-semibold text-[#ffffff] bg-[#1a1a8c] rounded-md transition">
              Choose Special
            </button>
          </div>

          {/* Premium Tier */}
          <div className="border-[2px] border-[#1a1a8c] rounded-lg p-3 sm:p-6  flex flex-col">
            <h3 className="text-2xl font-semibold text-gray-900 ">Special</h3>
            <p className="mt-4 text-[32px] font-bold text-gray-900 ">
              &#8358;40,000
              {/* <span className="text-2xl font-medium">/mo</span> */}
            </p>
            <ul className="mt-6 space-y-4 text-gray-900  flex-1">
              <li>Generates Addtional ⁠Presentation Slides</li>
              <li>Access to 100 citations and references</li>
              <li>1 million tokens of AI changes</li>
            </ul>
            <button className="mt-6 px-4 py-2 font-semibold text-[#ffffff] bg-[#1a1a8c] rounded-md transition">
              Choose Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
