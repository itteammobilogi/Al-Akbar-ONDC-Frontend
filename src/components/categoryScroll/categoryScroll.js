// /components/home/CategoryScroll.jsx
import React from "react";

const categories = [
  "New Arrivals",
  "Black Abayas",
  "Festive Wear",
  "Workwear",
  "Modest Styles",
  "Luxury Edit",
  "Everyday Comfort",
  "New Arrivals",
  "Black Abayas",
  "Festive Wear",
  "Workwear",
  "Modest Styles",
  "Luxury Edit",
  "Everyday Comfort",
];

function CategoryScroll() {
  return (
    <div className="my-8 overflow-x-auto">
      <div className="flex space-x-4 px-4 sm:px-6 md:px-8">
        {categories.map((category, index) => (
          <button
            key={index}
            className="whitespace-nowrap px-5 py-2 bg-pink-100 text-pink-800 text-sm font-medium rounded-full hover:bg-pink-200 transition"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryScroll;
