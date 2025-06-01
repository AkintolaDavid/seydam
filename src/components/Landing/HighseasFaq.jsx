import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import explore from "../../assets/homeimg.png";
import YouTubeThumbnail from "./YoutubeThumbnail";
const faqs = [
  "Can it generate custom report?",
  "How am I sure it will give me what I what?",
  "How long will it take to generate my report?",
  "What about AI and plagiarism report checkers?",
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="flex gap-8 flex-col lg:flex-row justify-between items-center py-10 sm:py-16 md:py-32 px-[20px] md:px-[65px] lg:px-[104px] mx-auto max-w-[105rem]">
      {/* Left Side */}
      {/* Right Side */}
      <div className="flex flex-col gap-8 justify-between items-start ">
        {/* Left Side */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Do you have a question <span className="text-black">?</span>
          </h2>{" "}
          <span className="text-3xl sm:text-4xl font-bold">
            Watch video to see how Seydam AI works.
          </span>
          <p className="text-gray-600">
            Check out the most common questions our customers asked. Still have
            questions?
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-1 w-full bg-gray-50 px-2 py-6 rounded-xl space-y-4">
          {faqs.map((question, index) => (
            <div key={index} className="border-b pb-4">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left font-medium text-lg"
              >
                {question}
                <FaChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-[500px] mt-2" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  accumsan, metus ultrices eleifend gravida.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>{" "}
      <div className="flex flex-col justify-center items-center">
        <YouTubeThumbnail videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
      </div>
    </div>
  );
}
