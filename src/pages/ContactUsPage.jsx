import ContactInfo from "../components/contact/ContactInfo";
import ContactForm from "../components/contact/ContactForm";
import { motion } from "framer-motion";
import Navbar from "../components/Landing/Navbar";
import Footer from "../components/Landing/Footer";
export default function ContactUs() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Banner */}
      <div className="pt-40 flex justify-center ">
        {" "}
        <motion.div
          className="text-center text-black max-w-4xl px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-semibold mb-2 text-[#1a1a8c]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Reach Out To Us
          </motion.h1>

          <motion.div
            className="w-24 h-1 bg-[#1a1a8c] mx-auto mt-0"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>
      </div>
      {/* Contact Information and Form Section */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="order-2 lg:order-1">
              <ContactInfo />
            </div>

            {/* Contact Form */}
            <div className="order-1 lg:order-2">
              <ContactForm
                title="Send Us a Message"
                subtitle="We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible."
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
