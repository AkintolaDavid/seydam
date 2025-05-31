import React from "react";
import bgImage from "../assets/logo/logowhitebg.png";
import Navbar from "../components/Landing/Navbar";
import Footer from "../components/Landing/Footer";

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          <p>
            At Adii Lolade Collection, your privacy is a priority. We collect
            minimal data necessary to process orders and improve your
            experience.
          </p>
          <p className="mt-4">
            We never sell or share your data with third parties, except where
            necessary to process payments or ship orders.
          </p>
          <p className="mt-4">
            All transactions are encrypted and secured via our payment partners.
          </p>
          <p className="mt-4">
            You have the right to access, update, or delete your data at any
            time. Contact us at{" "}
            <a
              href="mailto:support@adiiloladecollection.com"
              className="text-blue-600"
            >
              support@adiiloladecollection.com
            </a>{" "}
            for any privacy-related queries.
          </p>
        </div>
      </div><Footer/>
    </>
  );
};

export default PrivacyPolicy;
