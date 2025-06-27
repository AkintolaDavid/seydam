import React from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
const Pricing = () => {
  return (
    <section
      id="pricing"
      className="relative bg-[#000145] text-[#0D0D82]  overflow-hidden py-16 sm:py-20 md:py-32 transition-colors duration-300"
    >
      {/* bottom-right circle */}
      {/* <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-green-200 rounded-full opacity-50" /> */}

      <div className="relative px-[20px] md:px-[65px] lg:px-[104px] mx-auto max-w-[105rem] text-center">
        {/* Section Header */}
        <h2 className="text-4xl font-bold text-white lg:mt-3">Pricing Plans</h2>

        {/* Pricing Cards */}
        <div className="mt-10 sm:mt-16 grid gap-8 grid-cols-1 md:grid-cols-3">
          {/* Free Tier */}
          <div className="bg-white rounded-lg p-3  flex flex-col items-start">
            <h3 className="text-[20px] font-semibold text-[#0D0D82]  ">
              Free Trail
            </h3>
            <span className="text-sm">Available For </span>
            <p className="mt-0 text-[26px] font-semibold text-[#0D0D82] ">
              Free
              {/* <span className="text-2xl font-medium">/mo</span> */}
            </p>
            <span className="my-2 sm:my-4 border-b w-full border-[0.5px] border-gray-200 "></span>
            <ul className="mt-0 space-y-4 text-[#0D0D82]  flex flex-col items-start">
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span>Generates Report Structure</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span> Limited amount of tokens</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span>Generates Only Chapter One</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span>Generates Report Structure</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span> Limited amount of tokens</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span>Generates Only Chapter One</span>
              </li>
            </ul>
            <span className=" mt-2 sm:mt-4 border-b w-full border-[0.5px] border-gray-200 "></span>
            <button className="my-4 w-[90%] ml-[5%] mt-6 px-4 py-2 font-semibold text-[#ffffff] bg-[#0D0D82] rounded-md transition">
              Try Free Now
            </button>
          </div>
          <div className="bg-white rounded-lg p-3  flex flex-col items-start">
            <h3 className="text-[20px] font-semibold text-[#0D0D82]  ">
              Premium Package
            </h3>
            <span className="text-sm">Available For </span>
            <p className="mt-0 text-[26px] font-semibold text-[#0D0D82] ">
              &#8358;30,000
              {/* <span className="text-2xl font-medium">/mo</span> */}
            </p>
            <span className="my-2 sm:my-4 border-b w-full border-[0.5px] border-gray-200 "></span>
            <ul className="mt-0 space-y-4 text-[#0D0D82]  flex flex-col items-start">
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span>Generates Report Structure</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span> Limited amount of tokens</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span>Generates Only Chapter One</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span>Generates Report Structure</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span> Limited amount of tokens</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span>Generates Only Chapter One</span>
              </li>
            </ul>
            <span className=" mt-2 sm:mt-4 border-b w-full border-[0.5px] border-gray-200 "></span>
            <button className="my-4 w-[90%] ml-[5%] mt-6 px-4 py-2 font-semibold text-[#ffffff] bg-[#0D0D82] rounded-md transition">
              Try Premium
            </button>
          </div>
          <div className="bg-white rounded-lg p-3  flex flex-col items-start">
            <h3 className="text-[20px] font-semibold text-[#0D0D82]  ">
              Special Package
            </h3>
            <span className="text-sm">Available For </span>
            <p className="mt-0 text-[26px] font-semibold text-[#0D0D82] ">
              &#8358;45,000
              {/* <span className="text-2xl font-medium">/mo</span> */}
            </p>
            <span className="my-2 sm:my-4 border-b w-full border-[0.5px] border-gray-200 "></span>
            <ul className="mt-0 space-y-4 text-[#0D0D82]  flex flex-col items-start">
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span>Generates Report Structure</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span> Limited amount of tokens</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span>Generates Only Chapter One</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span>Generates Report Structure</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span> Limited amount of tokens</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <IoIosCheckmarkCircle />
                <span>Generates Only Chapter One</span>
              </li>
            </ul>
            <span className=" mt-2 sm:mt-4 border-b w-full border-[0.5px] border-gray-200 "></span>
            <button className="my-4 w-[90%] ml-[5%] mt-6 px-4 py-2 font-semibold text-[#ffffff] bg-[#0D0D82] rounded-md transition">
              Try Special
            </button>
          </div>
          {/* Special Tier (Highlighted) */}
          {/* <div className="bg-white rounded-lg p-3 sm:p-6  flex flex-col">
            <h3 className="text-2xl font-semibold text-[#0D0D82] ">Premium</h3>
            <p className="mt-4 text-[32px] font-bold text-[#0D0D82] ">
              &#8358;30,000 
            </p>
            <ul className="mt-6 space-y-4 text-[#0D0D82]  flex-1">
              <li>Generates Full Report</li>
              <li>Access to 50 citations and references</li>
              <li>500,000 tokens of AI changes</li>{" "}
            </ul>
            <button className="mt-6 px-4 py-2 font-semibold text-[#ffffff] bg-[#0D0D82] rounded-md transition">
              Choose Special
            </button>
          </div>
 
          <div className="bg-white rounded-lg p-3 sm:p-6  flex flex-col">
            <h3 className="text-2xl font-semibold text-[#0D0D82] ">Special</h3>
            <p className="mt-4 text-[32px] font-bold text-[#0D0D82] ">
              &#8358;40,000 
            </p>
            <ul className="mt-6 space-y-4 text-[#0D0D82]  flex-1">
              <li>Generates Addtional ⁠Presentation Slides</li>
              <li>Access to 100 citations and references</li>
              <li>1 million tokens of AI changes</li>
            </ul>
            <button className="mt-6 px-4 py-2 font-semibold text-[#ffffff] bg-[#0D0D82] rounded-md transition">
              Choose Premium
            </button>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
