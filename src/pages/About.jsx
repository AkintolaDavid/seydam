// About.jsx
import React, { useState } from "react";
//import Navbar from '../components/Navbar';
// import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import img1 from "../assets/about/img1.jpg";
import Navbar from "../components/Landing/Navbar";
import Footer from "../components/Landing/Footer";
import oye from "../assets/team/oye.jpg";
import adg from "../assets/team/adg.jpg";
import dav from "../assets/team/akintola.png";
import bon from "../assets/team/bonike.png";
import deo from "../assets/team/deo.png";
import trabs from "../assets/team/trabs.png";
import samo from "../assets/team/samo.png";
import { TbSpeakerphone } from "react-icons/tb";
import { MdOutlineSearch } from "react-icons/md";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaLinkedinIn,
  FaUsersLine,
} from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
const About = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="relative overflow-hidden w-full min-h-screen bg-white  text-gray-900  px-0 pt-10 sm:pt-20 font-sans">
      <div className="px-[20px] md:px-[65px] lg:px-[104px] mx-auto max-w-[105rem] space-y-10 sm:space-y-12">
        {/* <Navbar hideAuthButtons={true} /> */}
        <Navbar />

        {/* Caption */}
        {/* <div className="text-center pt-2 sm:pt-0">
          <h1 className="text-left text-3xl sm:text-4xl lg:text-5xl sm:w-[90%] font-semibold text-gray-900 leading-tight sm:leading-loose ">
            SEYDAM AI Is Focused On Delivering Top Quality Report With AI
            Assistance.
          </h1>
        </div> */}

        {/* <!-- Image Section --> */}
        <div className="pt-6 sm:pt-0 space-y-2">
          {/* <!-- Top Large Image --> */}
          <img
            src={img1}
            alt="Team brainstorming"
            className="w-full object-cover h-80 sm:h-[500px] lg:h-[700px] rounded-lg shadow"
          />
        </div>

        {/* Values */}
        <div className="py-4 sm:py-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 sm:mb-8">
            Our Values
          </h2>

          {/* <!-- Grid for Values --> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
            {/* Value 1 */}
            <div className="border-t border-gray-400 pt-2 sm:pt-4 w-full">
              <div
                className="inline-flex items-center justify-center w-10 h-10 mb-2 rounded-full"
                style={{ backgroundColor: "rgba(26, 26, 140, 0.2)" }}
              >
                <TbSpeakerphone className="text-[#0D0D82] w-6 h-6 " />
              </div>{" "}
              <h3 className="font-semibold text-2xl text-gray-900">
                Being Bold
              </h3>
              <p className="mt-1 text-base">
                We are ambitious and non-complacent. We have a hunger to achieve
                great goals. We believe that making big bets is better than
                inaction.
              </p>
            </div>

            {/* Value 5 */}
            <div className="border-t border-gray-400 pt-2 sm:pt-4 w-full">
              <div
                className="inline-flex items-center justify-center w-10 h-10 mb-2 rounded-full"
                style={{ backgroundColor: "rgba(26, 26, 140, 0.2)" }}
              >
                <MdOutlineSearch className="text-[#0D0D82] w-6 h-6 " />
              </div>{" "}
              <h3 className="font-semibold text-2xl text-gray-900">
                Transparency
              </h3>
              <p className="mt-1 text-base">
                We operate with honesty and clarity. We communicate openly about
                decisions, setbacks, and successes to build trust with our team
                and users.
              </p>
            </div>

            {/* Value 6 */}
            <div className="border-t border-gray-400 pt-2 sm:pt-4 w-full">
              <div
                className="inline-flex items-center justify-center w-10 h-10 mb-2 rounded-full"
                style={{ backgroundColor: "rgba(26, 26, 140, 0.2)" }}
              >
                <FaUsersLine className="text-[#0D0D82] w-6 h-6 " />
              </div>{" "}
              <h3 className="font-semibold text-2xl text-gray-900">
                Customer First
              </h3>
              <p className="mt-1 text-base">
                We build technology for real people. Empathy is at the core of
                our design, communication, and product experience.
              </p>
            </div>

            {/* Value 7 */}
            <div className="border-t border-gray-400 pt-2 sm:pt-4 w-full">
              <div
                className="inline-flex items-center justify-center w-10 h-10 mb-2 rounded-full"
                style={{ backgroundColor: "rgba(26, 26, 140, 0.2)" }}
              >
                <FaRegCheckCircle className="text-[#0D0D82] w-6 h-6 " />
              </div>{" "}
              <h3 className="font-semibold text-2xl text-gray-900">
                Accountability
              </h3>
              <p className="mt-1 text-base">
                We own our actions and their outcomes. We measure success by the
                value we deliver and learn fast from failure.
              </p>
            </div>
          </div>
        </div>

        {/*Team*/}
        <div className="pb-10 sm:pb-16">
          <h2 className="text-3xl md:text-4xl text-gray-900 font-semibold mb-4 sm:mb-8">
            Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src={oye}
                alt="Oyewole Temi"
                className="w-[70px] h-[70px] sm:w-24 sm:h-24 object-cover rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Oyewole Temiloluwa
                </h3>
                <p className="text-sm text-gray-600 font-normal">
                  CEO / Backend Developer
                </p>{" "}
                <span className="flex gap-2 mt-2">
                  <div className="flex items-center gap-3 text-gray-800">
                    <a
                      href="https://www.instagram.com/_oyeofficial/?utm_source=ig_web_button_share_sheet"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="text-xl  transition" />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/temiloluwa-oyewole-217349248?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Bo5ILBdmHRaKw1%2BbS4ChPaw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin className="text-xl  transition" />
                    </a>
                  </div>
                </span>{" "}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src={dav}
                alt="Akintola David "
                className="w-[70px] h-[70px] sm:w-24 sm:h-24 object-cover rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Akintola David
                </h3>
                <p className="text-sm text-gray-600 font-normal">
                  Frontend Developer
                </p>{" "}
                <span className="flex gap-2 mt-2">
                  <div className="flex items-center gap-3 text-gray-800">
                    <a
                      href="https://www.instagram.com/caster__david/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="text-xl  transition" />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/akintola-david-70553b233/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin className="text-xl  transition" />
                    </a>

                    {/* <a
    href="https://github.com/AkintolaDavid"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="GitHub"
  >
    <FaGithub className="text-xl hover:text-black transition" />
  </a> */}
                  </div>
                </span>{" "}
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src={adg}
                alt="Tomiwa Adeaga"
                className="w-[70px] h-[70px] sm:w-24 sm:h-24 object-cover rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Tomiwa Adeaga
                </h3>
                <p className="text-sm text-gray-600 font-normal">AI Engineer</p>{" "}
                <span className="flex gap-2 mt-2">
                  <div className="flex items-center gap-3 text-gray-800">
                    <a
                      href="https://www.instagram.com/tomiwa_adeaga/?utm_source=ig_web_button_share_sheet"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="text-xl  transition" />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/tomiwa-adeaga?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B%2FRiGpzz%2FRkSuMTLtNPXHFw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin className="text-xl  transition" />
                    </a>
                  </div>
                </span>{" "}
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src={trabs}
                alt="Igbaroola Samuel"
                className="w-[70px] h-[70px] sm:w-24 sm:h-24 object-cover rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Igbaroola Samuel
                </h3>
                <p className="text-sm text-gray-600 font-normal">
                  Frontend Developer
                </p>{" "}
                <span className="flex gap-2 mt-2">
                  <div className="flex items-center gap-3 text-gray-800">
                    <a
                      href="https://www.linkedin.com/in/samuel-igbaroola-755a64219?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BTLFv467VQzmC1fd0HdbYSA%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="text-xl  transition" />
                    </a>

                    <a
                      href="https://www.instagram.com/sam_igbaroola?igsh=MXc5am5obDN5Nm5oMw=="
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin className="text-xl  transition" />
                    </a>
                  </div>
                </span>{" "}
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src={bon}
                alt="Ogundinrun AyooluwaTomiwa"
                className="w-[70px] h-[70px] sm:w-24 sm:h-24 object-cover rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ogundinrun
                </h3>{" "}
                <h3 className="text-lg font-semibold text-gray-900">
                  AyooluwaTomiwa
                </h3>
                <p className="mt-1 text-sm text-gray-600 font-normal">
                  Finance Manager
                </p>
                <span className="flex gap-2 mt-2">
                  <div className="flex items-center gap-3 text-gray-800">
                    <a
                      href="https://www.instagram.com/ayooluwatomiwa._?igsh=MWxoaDRnYnpqbjI2aA%3D%3D&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="text-xl  transition" />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/ayooluwatomiwaogundiran?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin className="text-xl  transition" />
                    </a>
                  </div>
                </span>{" "}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src={samo}
                alt="Bolaji Samo"
                className="w-[70px] h-[70px] sm:w-24 sm:h-24 object-cover rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Bolaji Samo
                </h3>
                <p className="text-sm text-gray-600 font-normal">
                  Policy And Strategy
                </p>{" "}
                <span className="flex gap-2 mt-2">
                  <div className="flex items-center gap-3 text-gray-800">
                    <a
                      href="https://www.instagram.com/samo.o_/?utm_source=ig_web_button_share_sheet"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="text-xl  transition" />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/bolaji-samo-1219a9234?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BKS6AXHWxQ%2FCsuSPVqi41bA%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin className="text-xl  transition" />
                    </a>
                  </div>
                </span>{" "}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white shadow rounded-lg">
              <img
                src={deo}
                alt=" Olaoye Daniel"
                className="w-[70px] h-[70px] sm:w-24 sm:h-24 object-cover rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Olaoye Daniel
                </h3>
                <p className="text-sm text-gray-600 font-normal">
                  Finance Manager
                </p>{" "}
                <span className="flex gap-2 mt-2">
                  <div className="flex items-center gap-3 text-gray-800">
                    <a
                      href="https://www.instagram.com/deothe1st/?utm_source=ig_web_button_share_sheet"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="text-xl  transition" />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/daniel-olaoye-143028268?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BSynw46DUR5SzZxM2V%2FOQTA%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin className="text-xl  transition" />
                    </a>
                  </div>
                </span>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
