import React from "react"; 
import bgImage from "../assets/logo/logowhitebg.png";
import Navbar from "../components/Landing/Navbar";
import Footer from "../components/Landing/Footer";

const ReturnsAndRefunds = () => {
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
            Returns & Refunds
          </h1>
          <p>
            We want you to love your purchase! If you’re not satisfied, we
            accept returns within 14 days of delivery on unopened, unused
            products.
          </p>

          <h2 className="mt-4 font-semibold">To initiate a return:</h2>
          <ol className="list-decimal ml-6 space-y-1">
            <li>
              Contact us at{" "}
              <a
                href="mailto:support@adiiloladecollection.com"
                className="text-blue-600"
              >
                support@adiiloladecollection.com
              </a>{" "}
              with your order number.
            </li>
            <li>
              Return shipping costs are the responsibility of the customer
              unless the item was received damaged or incorrect.
            </li>
            <li>
              Once your return is received and inspected, we’ll notify you and
              process your refund within 5–7 business days.
            </li>
          </ol>

          <p className="mt-4">
            <strong>Please note:</strong> For hygiene reasons, opened or used
            products cannot be returned.
          </p>
        </div>
      </div><Footer/>
    </>
  );
};

export default ReturnsAndRefunds;
