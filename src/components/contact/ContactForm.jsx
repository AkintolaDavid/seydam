import { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import { FloatingInput, FloatingTextarea } from "./FloatingInput";
import { useToast } from "@chakra-ui/react";

const ContactForm = ({ title, subtitle }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const toast = useToast();
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/message/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: data.message || "Contact submitted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.message || "Failed to submit contact");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="bg-white px-6  py-4 rounded-xl shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-3xl font-semibold mb-3 sm:mb-6 text-gray-900 relative inline-block">
          {title}
          {/* <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#000000] to-amber-300"></span> */}
        </h2>
        {subtitle && <p className="text-gray-600 mb-5 sm:mb-8">{subtitle}</p>}
      </motion.div>

      {isSuccess && (
        <motion.div
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          Thank you for your message! We'll get back to you soon.
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FloatingInput
              id="name"
              name="name"
              label="Your Name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FloatingInput
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FloatingInput
              id="subject"
              name="subject"
              label="Subject"
              value={formData.subject}
              onChange={handleChange}
              error={errors.subject}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <FloatingTextarea
              id="message"
              name="message"
              label="Message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              error={errors.message}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#1a1a8c] text-white font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow-sm transition-all duration-300 flex items-center justify-center ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:-translate-y-1"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  Send Message
                  <FaPaperPlane className="ml-2 text-lg" />
                </span>
              )}
            </button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;
