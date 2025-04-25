import { getFeaturedProducts } from "@/utils/ApiUrlHelper";
import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

function FeaturedProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchExclusive = async () => {
      try {
        const result = await getFeaturedProducts();
        setProducts(result);
      } catch (error) {
        console.error("Error loading exclusive products", error);
      }
    };
    fetchExclusive();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Abaya Hero Section (no image) */}
      <div className="bg-gradient-to-r from-[#fbe4d8] via-[#faedcd] to-[#d6c9a8] border border-[#fbd2c3] rounded-xl shadow-sm p-10 mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
          Timeless Abayas, Modern Grace
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Discover a curated collection of abayas designed for the modern woman
          who values elegance, comfort, and tradition. Perfect for every season
          and every reason.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
          <span className="px-4 py-2 bg-pink-200 text-pink-800 text-sm font-medium rounded-full shadow-sm">
            Elegant Designs
          </span>
          <span className="px-4 py-2 bg-rose-100 text-rose-700 text-sm font-medium rounded-full shadow-sm">
            Everyday Comfort
          </span>
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full shadow-sm">
            Made with Love
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Featured Products
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((product) => {
          const images = Array.isArray(product.images)
            ? product.images
            : JSON.parse(product.images || "[]");
          const mainImage = images[0];

          return (
            <div
              key={product.id}
              className="bg-white border border-pink-200 rounded-lg shadow-md p-4 transition-transform hover:scale-105"
            >
              <div className="relative">
                <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md z-10">
                  Exclusive
                </span>

                <div className="rounded overflow-hidden">
                  <img
                    src={`http://localhost:5000${mainImage}`}
                    alt={`Product ${product.name}`}
                    className="w-full h-40 object-cover"
                  />
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 text-sm mb-1 mt-3 truncate">
                {product.name}
              </h3>

              <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center space-x-2">
                <p className="text-pink-600 font-bold text-sm">
                  ₹{product.discountPrice || product.price}
                </p>
                {product.discountPrice && (
                  <p className="text-gray-400 text-xs line-through">
                    ₹{product.price}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeaturedProduct;
