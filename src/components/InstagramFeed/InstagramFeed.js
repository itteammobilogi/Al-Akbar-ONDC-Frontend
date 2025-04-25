// /components/home/InstagramFeed.jsx
import React from "react";

const mockImages = [
  "/assets/insta1.jpg",
  "/assets/insta2.jpg",
  "/assets/insta3.jpg",
  "/assets/insta4.jpg",
  "/assets/insta5.jpg",
  "/assets/insta6.jpg",
];

function InstagramFeed() {
  return (
    <div className="my-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
        Follow Us On Instagram
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {mockImages.map((src, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-sm">
            <img
              src={src}
              alt={`Insta ${index + 1}`}
              className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstagramFeed;
