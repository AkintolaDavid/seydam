"use client";

import { useState } from "react";
import { VscWholeWord } from "react-icons/vsc";
import { FaChevronDown, FaRocket, FaDatabase, FaBook } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
const faqs = [
  {
    question: "Can it generate custom report?",
    answer:
      "Yes, Seydam AI tailors each report based on your input—topics, objectives, and structure. It mimics human reasoning to produce unique content with the exact formatting and references you require.",
  },
  {
    question: "How am I sure it will give me what I want?",
    answer:
      "Seydam AI asks for detailed inputs before starting your report. You get to specify tone, academic level, source types, and even your personal style so the results feel just right.",
  },
  {
    question: "How long will it take to generate my report?",
    answer:
      "Most reports are generated in under 5 minutes. For large or complex documents, it may take up to 10 minutes to ensure quality and coherence throughout.",
  },
  {
    question: "What about AI and plagiarism report checkers?",
    answer:
      "Seydam AI includes built-in tools to optimize for both originality and bypassing AI detection. You'll also receive an optional plagiarism and AI detection score for peace of mind.",
  },
];

const stats = [
  {
    number: "100",
    text: "Generate up to ",
    highlight: "100 references",
    suffix: "for your report!",
    icon: FaBook,
  },
  {
    number: "40,000",
    text: "Seydam AI generates up to",
    highlight: "40,000 words",
    suffix: "report",
    icon: VscWholeWord,
  },
  // {
  //   number: "50%",
  //   text: "Generate reports at",
  //   highlight: "50%",
  //   suffix: "of the time and cost of doing it manually",
  //   icon: FaRocket,
  // },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // First FAQ opened by default

  return (
    <div className="flex gap-8 flex-col lg:flex-row justify-between items-start py-10 sm:py-16 md:py-32 px-[20px] md:px-[65px] lg:px-[104px] mx-auto max-w-[105rem]">
      {/* Left Side - Statistics */}
      <div className="flex-1 bg-[#0D0D82] rounded-2xl p-4 sm:p-8 md:p-10 text-white">
        <div className="space-y-6 sm:space-y-10 md:space-y-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mt-4">
              Why Choose Seydam Ai?
            </h2>
            {/* <p className="text-blue-100 text-lg">
              Join thousands of students and researchers who trust our platform
            </p> */}
          </div>

          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  {/* <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Icon className="text-2xl text-white" />
                  </div> */}{" "}
                  <Icon className="text-2xl text-white mb-16 sm:mb-14" />
                </div>
                <div className="flex-1">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <p className="text-base sm:text-lg md:text-xl text-blue-100 leading-relaxed">
                    {stat.text}{" "}
                    <span className="text-white font-semibold">
                      {stat.highlight}
                    </span>{" "}
                    {stat.suffix}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="pt-4 rounded-xl text-white p-0">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className=" mb-4">
              Our support team is here to help you get the most out of Seydam
              Ai.
            </p>

            <Link to="/contact" className="inline-block group">
              <button className="bg-white text-[#0D0D82] px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition-all duration-200">
                Contact Support
                <BiSupport />
              </button>
            </Link>
          </div>

          {/* <div className="mt-12 p-6 bg-white bg-opacity-10 rounded-xl border border-white border-opacity-20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8  rounded-full flex items-center justify-center">
                <span className="text-[#ffffff] font-bold text-base">✓</span>
              </div>
              <span className="text-lg font-semibold">
                Trusted by 2,000+ Users
              </span>
            </div>
            <p className="text-blue-100 text-sm">
              From undergraduate students to PhD researchers, Seydam AI delivers
              professional-quality reports that meet academic standards.
            </p>
          </div> */}
        </div>
      </div>

      {/* Right Side - FAQ */}
      <div className="flex-1 lg:pl-8">
        <div className="space-y-6 mb-8">
          <h2 className="text-[26px] sm:text-3xl md:text-4xl font-bold text-[#0D0D82]">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 sm:text-lg">
            Get answers to the most common questions about Seydam AI. Still have
            questions? Contact our support team.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left p-6 hover:bg-gray-50 rounded-xl transition-colors duration-200"
              >
                <span className="font-semibold text-lg text-[#0D0D82] pr-4">
                  {faq.question}
                </span>
                <FaChevronDown
                  className={`w-5 h-5 text-[#0D0D82] transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-[500px] pb-6" : "max-h-0"
                }`}
              >
                <div className="px-6">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
