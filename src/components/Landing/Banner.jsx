import React from "react";
import img1 from "../../assets/banner/ban1.jpg";
import img2 from "../../assets/banner/ban2.jpg";

export default function Banner() {
  return (
    <div className="flex justify-center items-center">
      <img src={img1} className="hidden lg:block rounded-br-[100px]" />{" "}
      <img src={img2} className="block lg:hidden" />
    </div>
  );
}
