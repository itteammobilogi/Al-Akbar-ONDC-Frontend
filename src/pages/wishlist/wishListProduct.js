import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {
  getWishlistProductsByUser,
  removeFromWishlist,
} from "@/utils/ApiUrlHelper";
import toast from "react-hot-toast";

const WishListProduct = () => {
  const [wishlist, setWishList] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const data = await getWishlistProductsByUser();
      setWishList(data);
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishList((prev) => prev.filter((item) => item.id !== productId));
      toast.success("Removed from wishlist!");
    } catch (err) {
      console.error("Failed to remove:", err);
      toast.error("Failed to remove.");
    }
  };

  const handleClearAll = () => {
    setWishList([]); // Optional: call backend API if needed
    toast("Cleared all wishlist items!");
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-[#fdf4f0] to-white min-h-screen">
        <div className="px-4 py-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center text-pink-700 mb-8 tracking-tight">
              Your Wishlist ❤️
            </h2>

            {/* {wishlist.length > 0 && (
              <div className="text-center mb-6">
                <button
                  onClick={handleClearAll}
                  className="text-sm text-pink-600 hover:underline hover:text-pink-800"
                >
                  Clear All Wishlist ❤️‍🔥
                </button>
              </div>
            )} */}

            {wishlist.length === 0 ? (
              <div className="text-center text-gray-500 mt-16">
                <Heart
                  className="mx-auto text-pink-400 animate-pulse"
                  size={60}
                />
                <p className="mt-4 text-lg">
                  You haven’t added anything yet.
                  <br />
                  <a
                    href="/products"
                    className="text-pink-600 font-medium hover:underline"
                  >
                    Browse trending products →
                  </a>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlist.map((product, index) => {
                  let mainImage = "";
                  try {
                    mainImage = JSON.parse(product.images)?.[0] || "";
                  } catch {}

                  return (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.04, rotate: [0, 1, -1, 0] }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="relative bg-white p-5 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-pink-100 group"
                    >
                      <div className="relative">
                        <img
                          src={`http://localhost:5000${mainImage}`}
                          alt={product.name}
                          className="rounded-xl w-full h-48 object-cover mb-4 group-hover:scale-105 transition-transform"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="absolute bottom-3 left-3 bg-white/70 backdrop-blur-sm p-2 rounded-full shadow"
                        >
                          <Heart className="text-pink-500" size={18} />
                        </motion.div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-lg text-pink-600 font-bold">
                        ₹{product.price}
                      </p>

                      <button
                        onClick={() => handleRemove(product.id)}
                        className="mt-4 text-sm bg-red-100 text-red-600 px-4 py-1 rounded-full hover:bg-red-200 transition"
                      >
                        Remove
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Promo Banner */}
            <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-pink-400 to-pink-600 text-white p-6 rounded-2xl shadow-md text-center">
              <h4 className="text-2xl font-bold mb-2">
                Get 10% OFF on your next order 🎉
              </h4>
              <p className="mb-4">
                Use code <strong>WISHLIST10</strong> during checkout.
              </p>
              <a
                href="/products"
                className="inline-block bg-white text-pink-600 font-semibold px-6 py-2 rounded-full hover:bg-pink-50 transition"
              >
                Explore Products
              </a>
            </div>

            {/* You May Also Like */}
            <div className="max-w-6xl mx-auto mt-20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                You may also like
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="min-w-[250px] bg-white rounded-xl p-4 shadow border hover:shadow-md transition"
                  >
                    <div className="h-40 w-full bg-gray-200 rounded-lg mb-3 animate-pulse" />
                    <p className="text-base font-semibold text-gray-700">
                      Product {item}
                    </p>
                    <p className="text-pink-600 font-bold">
                      ₹{999 + item * 100}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <a
        href="/products"
        className="fixed bottom-6 right-6 bg-pink-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-pink-700 transition-all z-50"
      >
        🛍️ Shop Now
      </a>

      <Footer />
    </>
  );
};

export default WishListProduct;
