import React from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const bannerImages = [
  "/assets/ban1.jpg",
  "/assets/ban2.webp",
  "/assets/ban3.webp",
];

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 cursor-pointer bg-black bg-opacity-50 p-2 rounded-full"
      onClick={onClick}
    >
      <ChevronLeft className="text-white" />
    </div>
  );
}

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 cursor-pointer bg-black bg-opacity-50 p-2 rounded-full"
      onClick={onClick}
    >
      <ChevronRight className="text-white" />
    </div>
  );
}

function Banner() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div className="relative w-full aspect-[16/9] sm:h-[70vh] overflow-hidden">
      <Slider {...settings} className="banner-slider w-full h-full">
        {bannerImages.map((src, index) => (
          <div key={index} className="w-full h-full">
            <img
              src={src}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Banner;
