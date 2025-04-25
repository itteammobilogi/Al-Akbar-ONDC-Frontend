import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import {
  clearUserCartItem,
  createOrder,
  createRazorpayOrder,
  getCartByUser,
  removeCartItem,
  verifyRazorpaySignature,
} from "@/utils/ApiUrlHelper";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const razorpayReady = await loadRazorpayScript();
      if (!razorpayReady) {
        toast.error("Failed to load Razorpay. Please try again.");
        return;
      }

      // Step 1: Create Razorpay Order on backend
      const payload = {
        amount: grandTotal,
        totalDiscountAmount: discount,
        shippingCharge: shipping,
        couponCode: null,
      };

      const { order } = await createRazorpayOrder(payload);

      // Step 2: Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Al-Akbar",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 3: Verify Razorpay payment
            await verifyRazorpaySignature({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Step 4: Create the actual order
            const finalOrderPayload = {
              totalAmount: grandTotal,
              paymentMethod: "RAZORPAY",
              paymentStatus: "paid",
              totalDiscountAmount: discount,
              shippingCharge: shipping,
              couponCode: null,
              rto: false,
              phone: form.phone,
              country: form.country,
              state: form.state,
              city: form.city,
              address: form.address,
              pincode: form.pincode,
              items: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            };

            await createOrder(finalOrderPayload);
            await clearUserCartItem();
            toast.success("Order placed successfully!");
            router.push("/thank-you");
          } catch (err) {
            console.error("Verification failed:", err);
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          address: form.address,
        },
        theme: {
          color: "#F37254",
        },
      });

      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartByUser();
        setCartItems(data);

        // Initial total
        const subtotal = data.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        );
        setTotal(subtotal);
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    setTotal(subtotal);
  }, [cartItems]);

  const handleRemove = async (productId) => {
    try {
      await removeCartItem(productId);
      // Refetch or filter local state
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
      toast.success("Item Removed From Cart!");
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
  };

  const shipping = total > 1000 ? 0 : 100;
  const discount = total > 1000 ? 500 : 0;
  const grandTotal = total + shipping - discount;

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <div className="min-h-screen bg-[#fff9f8] py-10 px-4">
          {loading ? (
            <div className="text-center text-gray-500 text-lg">
              Loading your cart...
            </div>
          ) : cartItems.length === 0 ? (
            // 🛒 EMPTY CART UI
            <div className="text-center space-y-4">
              <div className="text-5xl">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Your cart is empty
              </h2>
              <p className="text-gray-500">👉 Start shopping now!</p>
              <button
                onClick={() => router.push("/")}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-md font-medium shadow-md transition cursor-pointer"
              >
                Go to Home
              </button>
            </div>
          ) : (
            <motion.div
              className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Shipping Details
                </h2>
                <form className="grid gap-4" onSubmit={handleSubmit}>
                  <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-3 rounded-md"
                  />
                  <input
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-3 rounded-md"
                  />
                  <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-3 rounded-md"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="country"
                      placeholder="Country"
                      value={form.country}
                      onChange={handleChange}
                      required
                      className="border border-gray-300 p-3 rounded-md"
                    />
                    <input
                      name="state"
                      placeholder="State"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="border border-gray-300 p-3 rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="city"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="border border-gray-300 p-3 rounded-md"
                    />
                    <input
                      name="pincode"
                      placeholder="Pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      className="border border-gray-300 p-3 rounded-md"
                    />
                  </div>
                  <textarea
                    name="address"
                    placeholder="Full Address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-3 rounded-md"
                    rows={3}
                  />

                  <button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 transition-all duration-300 text-white font-semibold py-3 rounded-md shadow-md"
                  >
                    Place Order
                  </button>
                </form>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    let mainImage = "";
                    try {
                      const parsedImages = JSON.parse(item.images);
                      mainImage = parsedImages[0];
                    } catch (err) {
                      console.error("Image parse error:", err);
                    }

                    return (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center gap-4 border-b pb-2"
                      >
                        <img
                          src={`http://localhost:5000${mainImage}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Qty: {item.quantity} × ₹{item.price}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-gray-700">
                            ₹{item.quantity * item.price}
                          </div>
                          <button
                            onClick={() => handleRemove(item.productId)}
                            className="flex items-center gap-2 px-3 py-1.5 border border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex justify-between text-sm text-gray-700 pt-4">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Discount</span>
                    <span>₹{discount}</span>
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
