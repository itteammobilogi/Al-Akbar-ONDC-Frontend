import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { getCartByUser, removeCartItem } from "@/utils/ApiUrlHelper";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const UserCart = () => {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartByUser();
        setCart(data);
      } catch (err) {
        toast.error("Failed to load cart");
      }
    };

    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeCartItem(productId);
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-[#fdf4f0] to-white min-h-screen px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-pink-700 mb-8 tracking-tight">
            Your Shopping Bag 🛍️
          </h2>

          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-16">
              <p className="text-lg">Your cart is empty.</p>
              <a
                href="/products"
                className="text-pink-600 mt-2 inline-block hover:underline"
              >
                Continue shopping →
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => {
                let mainImage = "";
                try {
                  mainImage = JSON.parse(item.images)?.[0] || "";
                } catch {}

                return (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between bg-white p-5 rounded-xl shadow border border-pink-100"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={`http://localhost:5000${mainImage}`}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ₹{item.price} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-pink-600">
                        ₹{item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              <div className="text-right mt-6">
                <button
                  onClick={handleCheckout}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-semibold shadow transition-all cursor-pointer"
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserCart;
