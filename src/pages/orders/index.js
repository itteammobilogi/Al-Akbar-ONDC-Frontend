"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Head from "next/head";
import { getUserOrdersPaginated } from "@/utils/ApiUrlHelper";
import { toast } from "react-hot-toast";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getUserOrdersPaginated(page);
      setOrders(res.orders || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load orders. Please login.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  // --- Group orders ---
  const groupedOrders = orders.reduce((acc, item) => {
    const existingOrder = acc.find((o) => o.orderId === item.orderId);
    if (existingOrder) {
      existingOrder.items.push(item);
    } else {
      acc.push({
        orderId: item.orderId,
        totalAmount: item.totalAmount,
        paymentMethod: item.paymentMethod,
        paymentStatus: item.paymentStatus,
        orderStatus: item.orderStatus,
        createdAt: item.createdAt,
        items: [item],
      });
    }
    return acc;
  }, []);

  return (
    <>
      <Head>
        <title>My Orders | Al-Akbar</title>
      </Head>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
          >
            My Orders
          </motion.h1>

          {loading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin w-8 h-8 text-pink-600" />
            </div>
          ) : groupedOrders.length === 0 ? (
            <p className="text-center text-gray-600">No orders found.</p>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
              className="space-y-6"
            >
              {groupedOrders.map((order) => (
                <motion.div
                  key={order.orderId}
                  className="bg-white p-6 rounded-xl shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Order #{order.orderId}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        order.orderStatus === 0
                          ? "bg-yellow-400 text-black"
                          : order.orderStatus === 1
                          ? "bg-blue-400 text-white"
                          : order.orderStatus === 2
                          ? "bg-purple-500 text-white"
                          : order.orderStatus === 3
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {order.orderStatus === 0
                        ? "Pending"
                        : order.orderStatus === 1
                        ? "Processing"
                        : order.orderStatus === 2
                        ? "Shipped"
                        : order.orderStatus === 3
                        ? "Delivered"
                        : "Unknown"}
                    </span>
                  </div>

                  {/* List Products */}
                  <div className="space-y-4">
                    {order.items.map((item, idx) => {
                      const images = JSON.parse(item.productImages || "[]");
                      const mainImage = images[0] || "";

                      return (
                        <div
                          key={idx}
                          className="flex gap-4 items-center border-b pb-4"
                        >
                          <img
                            src={`http://localhost:5000${mainImage}`}
                            alt={item.productName}
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {item.productName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-700">
                              ₹{item.productPrice}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-4 text-right text-gray-800 font-semibold">
                    Total: ₹{order.totalAmount}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
