import {
  addWishListProduct,
  getSingleProduct,
  getWishlistProductsByUser,
  handleAddProducttoCart,
} from "@/utils/ApiUrlHelper";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Share2, Copy } from "lucide-react";
import Footer from "@/components/Footer/Footer";
import { useRouter } from "next/router";

import Navbar from "@/components/Navbar/Navbar";
import toast from "react-hot-toast";

export default function ProductDetail({ product }) {
  const router = useRouter();

  const [shareLink, setShareLink] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const unitPrice = parseFloat(product.discountPrice || product.price);
  const totalAmount = (unitPrice * quantity).toFixed(2);

  const images = JSON.parse(product.images || "[]");
  const colors = JSON.parse(product.colors || "[]");
  const sizes = ["S", "M", "L", "XL"]; // Mocked until you receive from backend
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareLink(window.location.href);
    }
  }, []);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const handleAddtoCart = async () => {
    try {
      const quantity = parseInt(
        document.querySelector("input[type='number']")?.value || 1
      );
      const res = await handleAddProducttoCart(product.id, quantity);
      toast.success(res.message || "Added to cart!");
      router.push("/checkout");
    } catch (err) {
      toast.error("You must be logged in to add to cart");
    }
  };

  // const handleAddToWishlist = async (productId) => {
  //   try {
  //     const res = await addWishListProduct(productId);
  //     toast.success(res.message || "Added to wishlist!");
  //   } catch {
  //     toast.error("Failed to add to wishlist.");
  //   }
  // };
  const handleAddToWishlist = async (productId) => {
    try {
      const isAlreadyWishlisted = wishlistItems.includes(productId);

      if (isAlreadyWishlisted) {
        toast.success("Already wishlisted!");
        return;
      }

      const res = await addWishListProduct(productId);
      setWishlistItems((prev) => [...prev, productId]);
      toast.success(res.message || "Added to wishlist!");
    } catch (err) {
      toast.error("Wishlist action failed.");
      console.error(err);
    }
  };

  useEffect(() => {
    // Example: Simulate fetching wishlist productIds
    const fetchWishlist = async () => {
      try {
        // Replace with your API call
        const data = await getWishlistProductsByUser(); // Should return array of productIds
        setWishlistItems(data);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    };

    fetchWishlist();
  }, []);

  const isWishlisted = wishlistItems.includes(product.id);

  return (
    <div>
      <Navbar />

      <div className="p-4 min-h-screen bg-[#fff9f7]">
        <motion.div
          className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Product Image */}
            <div className="rounded-xl overflow-hidden border border-pink-100 shadow-sm relative">
              {product.is_exclusive ? (
                <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Exclusive
                </span>
              ) : null}
              <img
                src={`http://localhost:5000${images[0]}`}
                alt={product.name}
                className="w-full h-80 object-contain bg-white p-4"
              />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>

              <p className="text-sm text-gray-600 mb-3">
                {product.description}
              </p>

              {product.offerType && (
                <p className="inline-block mb-2 text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  {product.offerType}
                </p>
              )}

              <div className="mb-4">
                <div className="flex items-center space-x-3">
                  <p className="text-pink-600 font-bold text-2xl">
                    ₹{totalAmount}
                  </p>
                  {product.discountPrice && (
                    <p className="text-gray-400 text-base line-through">
                      ₹{(parseFloat(product.price) * quantity).toFixed(2)}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ({quantity} × ₹{unitPrice})
                </p>
              </div>

              {/* Sizes */}
              {sizes.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-1 text-gray-700">
                    Select Size:
                  </p>
                  <div className="flex gap-2">
                    {sizes.map((size, idx) => (
                      <button
                        key={idx}
                        className="px-3 py-1 border rounded-md text-sm hover:bg-pink-100"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {colors.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-1 text-gray-700">
                    Available Colors:
                  </p>
                  <div className="flex space-x-2">
                    {colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-2 mb-4">
                <label className="text-sm font-medium">Qty:</label>
                <input
                  id="product-qty"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value)))
                  }
                  className="w-16 border rounded-md p-1 text-center text-sm"
                />
              </div>

              {/* Stock Info */}
              <p
                className={`mb-4 text-sm font-semibold ${
                  product.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </p>

              {/* Low stock alert */}
              {product.stock > 0 &&
                product.stock <= product.inventoryAlertThreshold && (
                  <p className="text-red-600 text-sm font-medium mb-4">
                    Hurry! Only {product.stock} left in stock.
                  </p>
                )}

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-full font-medium transition-all duration-300 shadow-md cursor-pointer"
                  onClick={handleAddtoCart}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddToWishlist(product.id)}
                  className="flex items-center gap-2 border border-pink-600 text-pink-600 hover:bg-pink-50 px-5 py-2 rounded-full font-medium transition-all duration-300 shadow-md cursor-pointer"
                >
                  {isWishlisted ? (
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  ) : (
                    <Heart className="w-4 h-4 text-gray-400" />
                  )}
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </button>
              </div>

              {/* Pincode Delivery Check */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  className="border px-3 py-2 text-sm rounded-md w-40"
                />
                <button className="text-sm text-pink-600 font-semibold hover:underline cursor-pointer">
                  Check Delivery
                </button>
              </div>

              {/* Share Options */}
              <div className="flex gap-4 items-center text-sm mt-4">
                {shareLink && (
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      shareLink
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <Share2 className="w-4 h-4 cursor-pointer" />
                    Share on WhatsApp
                  </a>
                )}

                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 text-gray-600 hover:underline cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const product = await getSingleProduct(id);

    return {
      props: { product },
    };
  } catch (err) {
    console.error("Failed to fetch product:", err);
    return {
      props: { product: null },
    };
  }
}
