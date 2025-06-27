import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "Can it generate custom report?",
    answer:
      "Yes, Seydam AI tailors each report based on your input—topics, objectives, and structure. It mimics human reasoning to produce unique content with the exact formatting and references you require.",
    video:
      "https://res.cloudinary.com/demo/video/upload/w_800,h_450,c_fill,vc_auto/sample.mp4",
  },
  {
    question: "How am I sure it will give me what I want?",
    answer:
      "Seydam AI asks for detailed inputs before starting your report. You get to specify tone, academic level, source types, and even your personal style so the results feel just right.",
    video:
      "https://res.cloudinary.com/demo/video/upload/w_800,h_450,c_fill,vc_auto/dog.mp4",
  },
  {
    question: "How long will it take to generate my report?",
    answer:
      "Most reports are generated in under 5 minutes. For large or complex documents, it may take up to 10 minutes to ensure quality and coherence throughout.",
    video:
      "https://res.cloudinary.com/demo/video/upload/w_800,h_450,c_fill,vc_auto/bike.mp4",
  },
  {
    question: "What about AI and plagiarism report checkers?",
    answer:
      "Seydam AI includes built-in tools to optimize for both originality and bypassing AI detection. You’ll also receive an optional plagiarism and AI detection score for peace of mind.",
    video:
      "https://res.cloudinary.com/demo/video/upload/w_800,h_450,c_fill,vc_auto/snow.mp4",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // First FAQ opened by default

  return (
    <div className="flex gap-8 flex-col lg:flex-row justify-between items-center py-10 sm:py-16 md:py-32 px-[20px] md:px-[65px] lg:px-[104px] mx-auto max-w-[105rem]">
      {/* Left Side */}
      <div className="flex flex-col gap-8 justify-between items-start flex-1">
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Do you have a question <span className="text-black">?</span>
          </h2>
          <span className="text-3xl sm:text-4xl font-bold">
            Watch video to see how Seydam AI works.
          </span>
          <p className="text-gray-600">
            Check out the most common questions our customers asked. Still have
            questions?
          </p>
        </div>

        <div className="w-full bg-gray-50 px-2 py-6 rounded-xl space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-4">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left font-medium text-lg"
              >
                {faq.question}
                <FaChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-[1000px] mt-4" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 text-sm mb-4">{faq.answer}</p>
                <video
                  src={faq.video}
                  controls
                  className="w-full rounded-lg"
                  width="100%"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side (Could be removed or used for image/promo later) */}
      {/* <div className="flex flex-col justify-center items-center">
        <img src={explore} alt="Explore" className="w-full max-w-sm" />
      </div> */}
    </div>
  );
}
