import { motion } from "framer-motion";
const HeroBanner = ({ title, backgroundImage }) => {
  return (
    <div className="relative h-[30vh] sm:h-[40vh] lg:h-[50vh] w-full overflow-hidden mt-[64px] sm:mt-20">
      <img
        src={backgroundImage || "/placeholder.svg?height=600&width=1600"}
        alt={title}
        className="w-full h-full object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/10 flex items-end pb-10 md:pb-20 justify-center">
        <motion.div
          className="text-center text-white max-w-4xl px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h1>

          <motion.div
            className="w-24 h-1 bg-[#fbae42] mx-auto mt-0"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
