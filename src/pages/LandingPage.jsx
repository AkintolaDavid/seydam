import React from "react";
import Home from "../components/Landing/Home";
import Navbar from "../components/Landing/Navbar";
import Pricing from "../components/Landing/Pricing";
import Services from "../components/Landing/Services";
import Footer from "../components/Landing/Footer";
import FAQSection from "../components/Landing/HighseasFaq";
import Banner from "../components/Landing/Banner";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <Home />
      <Banner/>
         <Services />  <Pricing /><FAQSection/>
 
      <Footer />
    </div>
  );
}
