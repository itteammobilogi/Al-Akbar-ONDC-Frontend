// /components/home/Testimonials.jsx
import React from "react";
import Slider from "react-slick";

const testimonials = [
  {
    name: "Ayesha Khan",
    message:
      "Absolutely loved the abaya I received! The quality is amazing and fits perfectly.",
  },
  {
    name: "Sana Qureshi",
    message:
      "Elegant and comfortable. I’ve worn mine to both work and events — so versatile!",
  },
  {
    name: "Nazia Patel",
    message:
      "I’m so impressed with the packaging and attention to detail. Will order again!",
  },
  {
    name: "Mariam Noor",
    message:
      "Perfect for daily wear and so breathable! Loved the stitching quality.",
  },
  {
    name: "Fatima Sheikh",
    message:
      "Stylish yet modest — just what I was looking for. Highly recommend!",
  },
];

const sliderSettings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  responsive: [
    {
      breakpoint: 768, // mobile
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 1024, // tablet
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 1440, // desktop
      settings: {
        slidesToShow: 3,
      },
    },
  ],
};

function Testimonials() {
  return (
    <div className="my-12 text-center px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        What Our Customers Say
      </h2>

      <Slider {...sliderSettings}>
        {testimonials.map((review, index) => (
          <div key={index} className="px-3">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mx-auto max-w-md">
              <p className="text-gray-600 italic mb-4">“{review.message}”</p>
              <h4 className="text-sm font-semibold text-pink-600">
                — {review.name}
              </h4>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Testimonials;
