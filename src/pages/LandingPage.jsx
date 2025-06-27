import React from "react";
import Home from "../components/Landing/Home";
import Navbar from "../components/Landing/Navbar";
import Pricing from "../components/Landing/Pricing";
import Services from "../components/Landing/Services";
import Footer from "../components/Landing/Footer";
import FAQSection from "../components/Landing/HighseasFaq";
import Banner from "../components/Landing/Banner";
import Category from "../components/Landing/Category";
import IndustriesGrid from "../components/Landing/IndustriesGrid";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <Home />
      <Banner />
      <IndustriesGrid /> <Pricing />
      <FAQSection />
      <Footer />
    </div>
  );
}
