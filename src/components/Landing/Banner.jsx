import React from "react";
import img1 from "../../assets/banner/Group 90.png";
import img2 from "../../assets/banner/Group 91.png";

export default function Banner() {
  return (
    <div>
      <img src={img1} className="hidden md:block" />{" "}
      <img src={img2} className="block md:hidden" />
    </div>
  );
}
