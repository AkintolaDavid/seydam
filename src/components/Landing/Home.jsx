import React from "react";
import { FiFeather } from "react-icons/fi";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import homoeimg from "../../assets/homeimg.png";
const Home = () => {
  return (
    <section
      id="home"
      className="relative px-[20px] md:px-[65px] lg:px-[104px] mx-auto max-w-[105rem] py-20 sm:py-28 md:py-32 justify-between bg-white flex flex-col  gap-8 sm:gap-10 lg:gap-14  items-center overflow-hidden text-gray-900 transition-colors duration-300"
    >
      <div className="relative text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight pt-14 ">
          Get your{" "}
          <span className="inline-block text-[#0D0D82]">
            <Typewriter
              options={{
                strings: [
                  "technical",
                  "project",
                  "business",
                  "research",
                  "design",
                ],
                autoStart: true,
                loop: true,
                delay: 100,
                deleteSpeed: 75,
              }}
            />{" "}
          </span>
          <br className="md:hidden" /> report
          <br className="hidden md:block" /> handled{" "}
          <span className="text-[#0D0D82]">swiftly</span>
        </h1>

        {/* <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Leverage cutting‑edge AI to draft, research, and polish your final year project —  
          save time and focus on what matters.
        </p> */}

        <p className="mt-6 text-lg sm:text-xl text-gray-500 ">
          The Perfect Report Writing AI. From Idea to Report—Smarter, Faster and
          Easier.
        </p>

        <div className="flex justify-center mt-6 gap-4">
          <Link to="/signup">
            <button className="flex items-center gap-2 px-6 py-2 bg-[#0D0D82] text-white rounded-md  transition duration-200">
              Get Started
              {/* <FiFeather className="text-white" /> */}
            </button>
          </Link>{" "}
          <Link to="/signup">
            <button className="hidden sm:flex items-center gap-2 px-6 py-2 border-[1px] border-[#0D0D82] text-[#0D0D82] font-normal rounded-md  transition duration-200">
              See How It Works
              {/* <FiFeather className="text-white" /> */}
            </button>
          </Link>
        </div>
      </div>
      <div>
        <img
          src={homoeimg}
          alt="homeimg"
          className="w-[98%] ml-[1%] lg:w-[800px]"
        />
      </div>
    </section>
  );
};

export default Home;
