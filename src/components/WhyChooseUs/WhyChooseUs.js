// /components/home/WhyChooseUs.jsx
import React from "react";
import { Truck, ShieldCheck, Sparkles } from "lucide-react"; // Optional: lucide-react icons

const features = [
  {
    icon: <Truck className="w-6 h-6 text-pink-600" />,
    title: "Free Shipping",
    desc: "Enjoy fast & free shipping on all orders above ₹999.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-pink-600" />,
    title: "Easy Returns",
    desc: "No questions asked return policy within 7 days.",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-pink-600" />,
    title: "Premium Quality",
    desc: "We use only premium-grade fabrics for lasting comfort.",
  },
];

function WhyChooseUs() {
  return (
    <div className="max-w-7xl mx-auto px-4 ">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Why Choose Us
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-0">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <div className="mb-3 flex justify-center">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhyChooseUs;
