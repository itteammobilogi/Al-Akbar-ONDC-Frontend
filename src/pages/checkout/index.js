import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import {
  clearUserCartItem,
  createOrder,
  createRazorpayOrder,
  getCartByUser,
  removeCartItem,
  verifyRazorpaySignature,
  applyCoupon, //  Import Apply Coupon API
} from "@/utils/ApiUrlHelper";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import axios from "axios";

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

  const [couponInput, setCouponInput] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

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

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    try {
      const res = await applyCoupon(couponInput.trim(), total);
      setDiscountAmount(parseFloat(res.discountValue) || 0);
      setAppliedCoupon(couponInput.trim());
      toast.success(`🎉 Coupon applied! ₹${res.discountValue} OFF`);
    } catch (err) {
      toast.error(err.message || "Invalid or expired coupon");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (cartItems.length === 0) {
  //     toast.error("Cart is empty.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const razorpayReady = await loadRazorpayScript();
  //     if (!razorpayReady) {
  //       toast.error("Failed to load Razorpay. Please try again.");
  //       return;
  //     }

  //     const payload = {
  //       amount: grandTotal,
  //       totalDiscountAmount: discountAmount,
  //       shippingCharge: shipping,
  //       couponCode: appliedCoupon || null,
  //     };

  //     const { order } = await createRazorpayOrder(payload);

  //     const rzp = new window.Razorpay({
  //       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
  //       amount: order.amount,
  //       currency: order.currency,
  //       name: "Al-Akbar",
  //       description: "Order Payment",
  //       order_id: order.id,
  //       handler: async function (response) {
  //         try {
  //           await verifyRazorpaySignature({
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_signature: response.razorpay_signature,
  //           });

  //           const finalOrderPayload = {
  //             totalAmount: grandTotal,
  //             paymentMethod: "RAZORPAY",
  //             paymentStatus: "paid",
  //             totalDiscountAmount: discountAmount,
  //             shippingCharge: shipping,
  //             couponCode: appliedCoupon || null,
  //             rto: false,
  //             phone: form.phone,
  //             country: form.country,
  //             state: form.state,
  //             city: form.city,
  //             address: form.address,
  //             pincode: form.pincode,
  //             items: cartItems.map((item) => ({
  //               productId: item.productId,
  //               quantity: item.quantity,
  //               price: item.price,
  //             })),
  //           };

  //           await createOrder(finalOrderPayload);
  //           await clearUserCartItem();
  //           toast.success("Order placed successfully!");
  //           router.push("/thankyou");
  //         } catch (err) {
  //           console.error("Verification failed:", err);
  //           toast.error("Payment verification failed.");
  //         }
  //       },
  //       prefill: {
  //         name: form.name,
  //         email: form.email,
  //         contact: form.phone,
  //       },
  //       notes: {
  //         address: form.address,
  //       },
  //       theme: {
  //         color: "#F37254",
  //       },
  //     });

  //     rzp.open();
  //   } catch (error) {
  //     console.error("Checkout error:", error);
  //     toast.error("Something went wrong.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

      // Step 1: Create internal order in your DB
      const finalOrderPayload = {
        totalAmount: grandTotal,
        paymentMethod: "RAZORPAY",
        paymentStatus: "pending", // Mark as pending until payment is captured
        totalDiscountAmount: discountAmount,
        shippingCharge: shipping,
        couponCode: appliedCoupon || null,
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

      const createdOrder = await createOrder(finalOrderPayload);
      const savedOrderId = createdOrder.orderId; // from backend response

      // Step 2: Create Razorpay order using savedOrderId in notes
      const { order } = await createRazorpayOrder({
        amount: grandTotal,
        totalDiscountAmount: discountAmount,
        shippingCharge: shipping,
        couponCode: appliedCoupon || null,
        notes: {
          orderId: savedOrderId,
          userId: createdOrder.userId,
        },
      });

      // Step 3: Launch Razorpay checkout
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Al-Akbar",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            await verifyRazorpaySignature({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Payment verified: Clear cart
            await clearUserCartItem();
            toast.success("Order placed successfully!");
            router.push("/thankyou");
          } catch (err) {
            console.error("Verification failed:", err);
            toast.error("Payment verification failed.");
          }
        },
        handler: async function (response) {
          try {
            await verifyRazorpaySignature({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,

              transaction_amount: grandTotal,
              orderId: savedOrderId,
              items_json: cartItems,
            });

            await clearUserCartItem();
            toast.success("Order placed successfully!");
            router.push("/thankyou");
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
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
      toast.success("Item Removed From Cart!");
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
  };

  const shipping = total > 1000 ? 0 : 100;
  const grandTotal = total + shipping - discountAmount;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#fff9f8] py-10 px-4">
        {loading ? (
          <div className="text-center text-gray-500 text-lg">
            Loading your cart...
          </div>
        ) : cartItems.length === 0 ? (
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
            className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Shipping Form */}
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

            {/* Cart + Coupon + Total */}
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">
                Order Summary
              </h2>

              {/* Coupon Section */}
              <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="border p-3 rounded-md w-full"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-md font-semibold transition w-full sm:w-auto"
                >
                  Apply
                </button>
              </div>

              {/* Cart Items */}
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
                      className="flex justify-between items-center gap-4 border-b pb-4"
                    >
                      <img
                        src={`https://ondcapi.elloweb.com${mainImage}`}
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
                      <div className="flex flex-col items-end gap-1">
                        <div className="font-semibold text-gray-700">
                          ₹{item.quantity * item.price}
                        </div>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="flex items-center gap-1 px-2 py-1 border border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full text-xs font-medium transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="pt-6 mt-6  space-y-3 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}

                <hr className="my-3" />

                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
