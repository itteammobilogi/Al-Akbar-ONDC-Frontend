import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  BadgeDollarSign,
  Clock,
  CheckCircle,
  Users,
  TicketPercent,
  TrendingUp,
} from "lucide-react";
import { getDashboardStats } from "@/utils/ApiUrlHelper"; // adjust path as needed
import { Loader2 } from "lucide-react";

const DashboardMetrics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-gray-400 h-8 w-8" />
      </div>
    );
  }

  const cards = [
    {
      title: "Total Orders",
      icon: <ShoppingCart className="w-6 h-6 text-blue-500" />,
      value: stats?.totalOrders || 0,
    },
    {
      title: "Total Revenue",
      icon: <BadgeDollarSign className="w-6 h-6 text-green-500" />,
      value: `₹${stats?.totalRevenue?.toFixed(2) || 0}`,
    },
    {
      title: "Pending Orders",
      icon: <Clock className="w-6 h-6 text-yellow-500" />,
      value: stats?.pendingOrders || 0,
    },
    {
      title: "Delivered Orders",
      icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
      value: stats?.deliveredOrders || 0,
    },
    {
      title: "Total Customers",
      icon: <Users className="w-6 h-6 text-purple-500" />,
      value: stats?.totalCustomers || 0,
    },
    {
      title: "Coupons Used",
      icon: <TicketPercent className="w-6 h-6 text-pink-500" />,
      value: stats?.couponsUsed || 0,
    },
    {
      title: "Conversion Rate",
      icon: <TrendingUp className="w-6 h-6 text-cyan-500" />,
      value: `${stats?.conversionRate || 0}%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg rounded-2xl p-5 text-white flex items-center justify-between hover:scale-[1.02]"
        >
          <div>
            <p className="text-sm text-gray-400">{card.title}</p>
            <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
          </div>
          <div className="bg-gray-700 p-2 rounded-full">{card.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;
