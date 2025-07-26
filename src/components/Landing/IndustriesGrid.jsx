 
import { AiFillThunderbolt } from "react-icons/ai";
import { IoDocumentText } from "react-icons/io5";
import { FaUpload } from "react-icons/fa";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { PiChatTeardropDotsFill } from "react-icons/pi";
const industries = [
  {
    icon: AiFillThunderbolt,
    title: "Instant Report Generation",
    description: "Generate full-length reports in seconds with a single click.",
  },
  {
    icon: IoDocumentText,
    title: "Reports Are Generated Based On Instruction",
    description:
      "Custom reports generated exactly as per your input and requirements.",
  },
  {
    icon: FaUpload,
    title: "Upload Report Guidelines And Structure",
    description:
      "Upload templates or rubrics to guide report formatting and flow.",
  },
  {
    icon: MdOutlineVerifiedUser,
    title: "Verified References And Citations",
    description: "Automatically includes citations with zero plagiarism.",
  },
  {
    icon: HiMiniPencilSquare,
    title: "Report Outline Structure Editing",
    description:
      "Easily reorder or edit report sections with visual outline tools.",
  },
  {
    icon: PiChatTeardropDotsFill,
    title: "Smart AI Edits with Prompts",
    description:
      "Use prompts to refine tone, clarity, or expand content intelligently.",
  },
];

export default function IndustriesGrid() {
  return (
    <>
      <section className=" px-[20px] md:px-[65px] lg:px-[104px] mx-auto max-w-[105rem] justify-between flex flex-col py-14 md:py-24  items-center">
        <div className="text-center mb-12 w-full">
          <h2 className="text-[34px] sm:text-[42px] font-bold text-[#11117a] lg:mt-3 ">
            Key Benefits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {industries.map((industry, index) => (
            <div
              key={index}
              className=" p-3 sm:p-6 h-auto lg:h-[230px] flex flex-col items-start rounded-lg shadow-sm border-[1px] bg-white border-[#0D0D82] transition-shadow duration-300"
            >
              <div className="flex flex-col gap-3 mb-1 sm:mb-2">
                <div
                  className="inline-flex items-center justify-center w-10 h-10 mb-0 rounded-full"
                  style={{ backgroundColor: "rgba(26, 26, 140, 0.2)" }}
                >
                  <industry.icon className="w-6 h-6 text-[#0D0D82]" />{" "}
                </div>{" "}
                <h3 className="text-xl font-bold">{industry.title}</h3>
              </div>
              <p className="text-gray-700 text-[16px] md:text-[17px] leading-7">
                {industry.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
