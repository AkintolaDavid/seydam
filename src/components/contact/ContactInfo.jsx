"use client";

import { motion } from "framer-motion";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
// import instagram from "../../assets/linklogo/instagram.webp";
// import whatsapp from "../../assets/linklogo/whatsapp.jpg";
const ContactInfo = () => {
  const contactItems = [
    {
      icon: <FaMapLocationDot className="text-[#000000] text-lg" />,
      title: "Location",
      details: [{ label: "", value: "Lagos, Nigeria" }],
      color: "from-yellow-50 to-yellow-100",
      iconColor: "text-yellow-500",
      borderColor: "border-yellow-200",
    },
    {
      icon: <FaEnvelope className="text-[#000000] text-lg" />,
      title: "Email",
      details: [{ label: "", value: "support@seydam.com" }],
      color: "from-orange-50 to-orange-100",
      iconColor: "text-orange-500",
      borderColor: "border-orange-200",
    },
    {
      icon: <FaPhone className="text-[#000000] text-lg" />,
      title: "Phone",
      details: [{ label: "", value: "+353 89 965 7193" }],
      color: "from-amber-50 to-amber-100",
      iconColor: "text-[#fbae42]",
      borderColor: "border-amber-200",
    },
  ];

  return (
    <div className="relative">
      <motion.h2
        className="text-3xl font-semibold mb-8 text-gray-900 relative mt-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Contact Information
      </motion.h2>
      <div className="relative z-30">
        <div className="space-y-8">
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              className={`flex items-start p-4 rounded-xl bg-gradient-to-tl border hover:shadow-sm transition-all duration-300`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div
                className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-4 flex-shrink-0 ${item.iconColor}`}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1 text-gray-900">
                  {item.title}
                </h3>
                {item.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-700 mb-[2px]">
                    {detail.label && (
                      <span className="font-medium">{detail.label}: </span>
                    )}
                    {detail.value}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Connect With Us
          </h3>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/adiiloladecollections/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#C13584" }}
            >
              {" "}
              <img src={instagram} alt="insta" className="h-[30px]" />
            </a>
            <a
              href="https://wa.me/353899657193"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#C13584" }}
            >
              {" "}
              <img src={whatsapp} alt="whatsapp" className="h-[30px]" />
            </a>
          </div>
        </motion.div> */}
      </div>

      {/* {decorationImage && (
        <motion.img
          src={decorationImage}
          alt="Decoration"
          className="z-50 absolute bottom-0 right-0 h-[250px] lg:h-[300px] rounded-lg"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />
      )} */}
    </div>
  );
};

export default ContactInfo;
