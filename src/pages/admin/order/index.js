import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "@/utils/ApiUrlHelper";
import AdminLayout from "@/components/Sidebar/Sidebar";
import { BadgeDollarSign, TimerReset } from "lucide-react";
import toast from "react-hot-toast";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Status updated!");

      // Update the local state to reflect the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, orderStatus: parseInt(newStatus) }
            : order
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status");
    }
  };

  const [filters, setFilters] = useState({
    orderStatus: "",
    paymentStatus: "",
    startDate: "",
    endDate: "",
  });

  const fetchFilteredOrders = async (reset = false) => {
    setLoading(true);
    try {
      const data = await getAllOrders(reset ? {} : filters);
      console.log(data, "order data"); // ✅ Now this logs the actual array
      setOrders(data || []);
    } catch (error) {
      console.error("Failed to fetch filtered orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredOrders();
  }, [filters]);

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg text-white">
        <h2 className="text-3xl font-extrabold text-teal-400 mb-6 flex items-center gap-2">
          <BadgeDollarSign className="text-green-400 w-7 h-7" /> Admin Orders
        </h2>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex flex-col min-w-[160px]">
            <label className="text-sm text-gray-300 mb-1">Order Status</label>
            <select
              value={filters.orderStatus ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, orderStatus: e.target.value })
              }
              className="bg-gray-800 text-white rounded px-2 py-1"
            >
              <option value="">All</option>
              <option value="0">Pending</option>
              <option value="1">Processing</option>
              <option value="2">Shipped</option>
              <option value="3">Delivered</option>
            </select>
          </div>

          <div className="flex flex-col min-w-[160px]">
            <label className="text-sm text-gray-300 mb-1">Payment Status</label>
            <select
              value={filters.paymentStatus ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, paymentStatus: e.target.value })
              }
              className="bg-gray-800 text-white rounded px-2 py-1"
            >
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex flex-col min-w-[160px]">
            <label className="text-sm text-gray-300 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="bg-gray-800 text-white rounded px-2 py-1"
            />
          </div>

          <div className="flex flex-col min-w-[160px]">
            <label className="text-sm text-gray-300 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="bg-gray-800 text-white rounded px-2 py-1"
            />
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => fetchFilteredOrders()}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              Apply Filters
            </button>

            <button
              onClick={() => {
                setFilters({
                  orderStatus: "",
                  paymentStatus: "",
                  startDate: "",
                  endDate: "",
                });
                fetchFilteredOrders(true); // reset all
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-300">Loading orders...</p>
        ) : currentOrders.length === 0 ? (
          <p className="text-gray-400 italic">No orders found.</p>
        ) : (
          <>
            <div className="overflow-x-auto border border-gray-700 rounded-xl shadow-xl">
              <table className="min-w-full text-sm text-white">
                <thead className="bg-teal-700 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Payment</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Order Status</th>
                    <th className="px-4 py-3 text-left">Placed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-teal-800/40 transition"
                    >
                      <td className="px-4 py-2">#{order.id}</td>
                      <td className="px-4 py-2">{order.name}</td>
                      <td className="px-4 py-2 text-green-300">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-4 py-2">{order.paymentMethod}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            order.paymentStatus === "paid"
                              ? "bg-green-600 text-white"
                              : order.paymentStatus === "failed"
                              ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-black"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                        >
                          <option value={0}>🕐 Pending</option>
                          <option value={1}>🚚 Processing</option>
                          <option value={2}>📦 Shipped</option>
                          <option value={3}>✅ Delivered</option>
                        </select>
                      </td>

                      <td className="px-4 py-2 text-gray-300">
                        <div className="flex items-center gap-1">
                          <TimerReset className="w-4 h-4 text-yellow-400" />
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 gap-2 text-sm flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded border font-medium transition-all ${
                    currentPage === 1
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded border font-medium transition-all ${
                      currentPage === i + 1
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded border font-medium transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-pink-600 text-white hover:bg-pink-700"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
