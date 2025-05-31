import React from "react"; 
import bgImage from "../assets/logo/logowhitebg.png";
import Navbar from "../components/Landing/Navbar";
import Footer from "../components/Landing/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="relative p-6 max-w-7xl mx-auto pt-32 h-screen">
        <img
          src={bgImage}
          alt="Background"
          className="absolute inset-0 m-auto opacity-10 h-[70%] object-contain z-0"
        />

        <div className="relative z-10">
          <h1 className="text-3xl font-semibold mb-10 text-center">
            Terms & Conditions
          </h1>
          <ul className=" ml-6 space-y-2">
            <li>
              1. All products are for personal use only and not for resale.
            </li>
            <li>2. Prices are subject to change without notice.</li>
            <li>
              3. We reserve the right to refuse or cancel any order at our
              discretion.
            </li>
            <li>
              4. You agree to provide current, complete, and accurate purchase
              and account information.
            </li>
            <li>
              5. Product results may vary. We are not liable for allergic
              reactions or outcomes not stated.
            </li>
          </ul>
        </div>
      </div><Footer/>
    </>
  );
};

export default TermsAndConditions;
