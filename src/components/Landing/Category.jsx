"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
//import "./swiperCustom.css";
import {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  A11y,
} from "swiper/modules";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import img from "../../assets/service/control.png";
export default function Category() {
  const Shopbyproduct = [
    {
      id: 1,
      image: img,
      description: "Cloth",
      isLiked: false,
    },
    {
      id: 2,
      image: img,
      description: "Jewelry",
      isLiked: false,
    },
    {
      id: 3,
      image: img,

      description: "Watch",
      isLiked: false,
    },
    {
      id: 4,
      image: img,
      // image: require("./assets/landing/Screenshot 2024-11-12 124630.png"),
      description: "Perfume",
      isLiked: false,
    },
    {
      id: 5,
      image: img,
      description: "Bag",
      isLiked: false,
    },
    {
      id: 6,
      image: img,
      description: "Shoe",
      isLiked: false,
    },
  ];
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="products"
        className="flex flex-col items-center justify-center mt-12 lg:mt-24 px-6 py-8 mb-16 lg:mb-28"
      >
        <div className="relative mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-center">
            Explore <span className="font-medium">Categories</span>
          </h2>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#c9b19c]"></div>
        </div>

        <div className="max-w-screen-2xl w-full">
          <Swiper
            pagination={{
              clickable: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            cssMode={true}
            mousewheel={true}
            keyboard={true}
            modules={[Pagination, Navigation, Mousewheel, Keyboard, A11y]}
            className="mySwiper py-8"
            breakpoints={{
              250: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              950: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1300: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
            }}
          >
            {Shopbyproduct.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="flex flex-col items-center relative group overflow-hidden">
                  <div className="relative overflow-hidden rounded-xl">
                    <Link to={`/category/${product.description}`}>
                      <div className="overflow-hidden rounded-xl">
                        <img
                          alt={product.description}
                          src={product.image || "/placeholder.svg"}
                          className="rounded-sm w-[240px] h-[350px] sm:w-[310px] sm:h-[470px] object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </Link>
                  </div>
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                    <Link to={`/category/${product.description}`}>
                      <span className="bg-white bg-opacity-90 px-6 py-3 text-base sm:text-lg font-medium text-gray-800 rounded-md shadow-md transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                        {product.description}
                      </span>
                    </Link>
                  </div>
                </div>{" "}
                <div className="h-12"></div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-next after:text-[#c9b19c] after:text-2xl"></div>
            <div className="swiper-button-prev after:text-[#c9b19c] after:text-2xl"></div>
          </Swiper>
        </div>
      </motion.div>
    </div>
  );
}
