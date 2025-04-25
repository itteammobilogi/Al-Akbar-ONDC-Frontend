// /components/home/CTASection.jsx
import React from "react";

function CTASection() {
  return (
    <div className="max-w-7xl mx-auto px-4 ">
      {/* Discover CTA Section */}
      <div className="my-12 bg-gradient-to-r from-[#fddcc4] via-[#fef6e4] to-[#cabfa3] rounded-xl px-6 py-10 text-center shadow-md">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 font-serif mb-4">
          Discover the New Abaya Drop
        </h2>
        <p className="text-gray-700 text-sm md:text-base max-w-xl mx-auto mb-6">
          Refresh your wardrobe with pieces that balance timeless tradition and
          modern luxury. Perfect for every occasion.
        </p>
        <a
          href="#"
          className="inline-block bg-pink-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-pink-700 transition"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
}

export default CTASection;
