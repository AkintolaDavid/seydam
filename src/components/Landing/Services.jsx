import React from "react";
import { FaFileAlt, FaEdit, FaBook, FaSlideshare } from "react-icons/fa";
import img from "../../assets/homeimg.png";
import img2 from "../../assets/service/control.png";
import img3 from "../../assets/service/pdf.png";
const services = [
  {
    image: img,
    icon: <FaFileAlt className="text-green-600 w-8 h-8" />,
    title: "Instant Report Generation",
    description:
      "Jumpstart your technical report with a structured draft tailored to your topic and format — instantly.",
  },
  {
    image: img,
    icon: <FaEdit className="text-green-600 w-8 h-8" />,
    title: "Structure Editing",
    description:
      "Update, expand, or refine any section of your report using simple prompts — no need to start from scratch.",
  },
  {
    image: img3,
    icon: <FaBook className="text-green-600 w-8 h-8" />,
    title: "Upload Report Guidelines And Structure",
    description:
      "Get citations from trusted sources like journals, articles, and reports. All content is unique and built for credibility.",
  },
  {
    image: img2,
    icon: <FaSlideshare className="text-green-600 w-8 h-8" />,
    title: "Reports Are Genrated Based On Instructions",
    description:
      "Automatically generate polished slide decks that highlight your report’s key points — ready to present.",
  },
  {
    image: img,
    icon: <FaEdit className="text-green-600 w-8 h-8" />,
    title: "Smart Editing with Prompts",
    description:
      "Update, expand, or refine any section of your report using simple prompts — no need to start from scratch.",
  },
  {
    image: img2,
    icon: <FaBook className="text-green-600 w-8 h-8" />,
    title: "Verified References & Original Content",
    description:
      "Get citations from trusted sources like journals, articles, and reports. All content is unique and built for credibility.",
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="relative bg-white overflow-hidden py-16 sm:py-24 dark:bg-gray-900 text-gray-900 dark:text-white  shadow-sm p-4 transition-all "
    >
      <div className="relative max-w-7xl flex flex-col justify-center items-center mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <h2 className="text-4xl font-semibold text-gray-900 dark:text-white text-center">
          Seydam AI Core Features
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
          We Provide User Friendly Features That Enhance Report Writing While
          You Are In Control.
        </p>

        {/* Services Grid */}
        <div className="mt-12 grid gap-10 grid-cols-1 md:grid-cols-2">
          {services.map((svc) => (
            <div
              key={svc.title}
              className="flex flex-col items-start gap-2 w-full sm:w-[400px] lg:w-[500px]"
            >
              {svc?.image && (
                <div>
                  <img
                    src={svc.image}
                    alt="img"
                    className="h-[200px] sm:h-[250px] lg:h-[300px] w-[375px] sm:w-[400px] lg:w-[500px] rounded-lg"
                  />
                </div>
              )}
              {/* <div className="flex-shrink-0">{svc.icon}</div> */}
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  {svc.title}
                </h3>
                <p className="mt-0 text-white">{svc.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
