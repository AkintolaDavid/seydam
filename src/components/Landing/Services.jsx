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
    title: "Reports Are Generated Based On Instructions",
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
      className="relative bg-[#000000] text-white overflow-hidden py-16 sm:py-24 shadow-sm p-4 transition-all "
    >
      <div className="relative max-w-7xl flex flex-col justify-center items-center mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <h2 className="text-4xl font-semibold  text-center">
          Seydam AI Core Features
        </h2>
        <p className="sm:block hidden mt-4 text-lg  text-center max-w-2xl mx-auto">
          We Provide Features That Enhance Report Writing While You Are In
          Control
        </p>

        {/* Services Grid */}
        <div className="mt-7 sm:mt-12 grid gap-5 sm:gap-10 grid-cols-1 md:grid-cols-2">
          {services.map((svc) => (
            <div
              key={svc.title}
              className="relative flex flex-col items-start gap-2 w-full sm:w-[550px] lg:w-[650px] p-2 rounded-lg"
            >
              {" "}
              <div className="flex items-center gap-2">
                <div className="min-h-2 min-w-2 bg-white rounded-full"></div>{" "}
                <h3 className=" text-2xl font-semibold ">{svc.title}</h3>
                {/* <p className="mt-0  font-medium">
              {svc.description}
            </p> */}
              </div>
              {svc?.image && (
                <div>
                  <img
                    src={svc.image}
                    alt="img"
                    className="h-[200px] sm:h-[300px] lg:h-[350px] w-[374px] sm:w-[500px] lg:w-[600px] rounded-lg shadow-sm"
                  />
                </div>
              )}
              {/* <div className="flex-shrink-0">{svc.icon}</div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
