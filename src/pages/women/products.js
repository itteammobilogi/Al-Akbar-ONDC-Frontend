import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {
  addWishListProduct,
  getAllProducts,
  getWishlistProductsByUser,
  getCartByUser,
  handleAddProducttoCart,
} from "@/utils/ApiUrlHelper";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [cartProductIds, setCartProductIds] = useState(new Set());
  const [wishlistProductIds, setWishlistProductIds] = useState(new Set());

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    fetchCartAndWishlist();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts(filters);
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartAndWishlist = async () => {
    try {
      const cart = await getCartByUser();
      const wishlist = await getWishlistProductsByUser();
      setCartProductIds(new Set(cart.map((item) => item.productId)));
      setWishlistProductIds(new Set(wishlist.map((item) => item.productId)));
    } catch (err) {
      console.error("Error loading cart/wishlist:", err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await handleAddProducttoCart(productId, 1);
      setCartProductIds((prev) => new Set(prev).add(productId));
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await addWishListProduct(productId);
      setWishlistProductIds((prev) => new Set(prev).add(productId));
      toast.success("Wishlisted!");
    } catch (err) {
      toast.error(err.message || "Failed to wishlist");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 px-4 md:px-12 py-6 gap-6 flex-col md:flex-row">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/4 bg-white shadow-md p-4 rounded-xl"
        >
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="mb-3">
            <label className="block mb-1">Brand</label>
            <select
              onChange={(e) => handleFilterChange("brand", e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">All</option>
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
              <option value="Realme">Realme</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Price Range</label>
            <select
              onChange={(e) => {
                const [min, max] = e.target.value.split("-").map(Number);
                handleFilterChange("minPrice", min);
                handleFilterChange("maxPrice", max);
              }}
              className="w-full border p-2 rounded"
            >
              <option value="">Any</option>
              <option value="0-10000">Under ₹10,000</option>
              <option value="10000-30000">₹10,000 – ₹30,000</option>
              <option value="30000-100000">Above ₹30,000</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Sort By</label>
            <select
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="new">New Arrivals</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-3/4"
        >
          {loading ? (
            <div className="text-center py-20">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const images = Array.isArray(product.images)
                  ? product.images
                  : JSON.parse(product.images || "[]");
                const mainImage = images[0];
                const isAdded = cartProductIds.has(product.id);
                const isWished = wishlistProductIds.has(product.id);

                return (
                  <Link href={`/product/${product.id}`}>
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.02 }}
                      className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white flex flex-col h-full"
                    >
                      <div className="flex justify-center items-center h-44 overflow-hidden p-2 cursor-pointer">
                        <img
                          src={
                            `https://ondcapi.elloweb.com${mainImage}` ||
                            "/placeholder.png"
                          }
                          alt={product.name}
                          className="object-contain max-h-full"
                        />
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">
                          {product.brand}
                        </p>
                        <p className="font-bold text-pink-600 text-sm mb-4">
                          ₹{product.discountPrice || product.price}
                        </p>

                        {/* Buttons stick to the bottom */}
                        <div className="mt-auto flex flex-wrap sm:flex-nowrap gap-2 gap-y-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddToCart(product.id)}
                            disabled={isAdded}
                            className={`flex-1 min-w-[48%] sm:min-w-0 text-sm px-2 py-2 rounded-lg font-medium transition shadow ${
                              isAdded
                                ? "bg-green-500 text-white cursor-not-allowed"
                                : "bg-pink-500 text-white hover:bg-pink-600"
                            }`}
                          >
                            <ShoppingCart className="inline-block w-4 h-4 mr-1" />
                            {isAdded ? "Added" : "Add to Cart"}
                          </motion.button>

                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddToWishlist(product.id)}
                            disabled={isWished}
                            className={`text-sm px-3 py-2 rounded-lg font-medium border transition shadow ${
                              isWished
                                ? "bg-pink-100 border-pink-300 text-pink-400 cursor-not-allowed"
                                : "bg-white border-pink-500 text-pink-600 hover:bg-pink-100"
                            }`}
                          >
                            <Heart className="inline-block w-4 h-4 mr-1" />
                            {isWished ? "Wishlisted" : "Wishlist"}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
