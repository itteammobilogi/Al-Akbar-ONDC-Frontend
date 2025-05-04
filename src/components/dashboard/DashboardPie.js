import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { getDashboardStats } from "@/utils/ApiUrlHelper";
import { Loader2 } from "lucide-react";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899"];

const DashboardVerticalBar = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-gray-400 h-8 w-8" />
      </div>
    );
  }

  const userData = [
    { name: "Orders", value: stats?.totalOrders || 0 },
    { name: "Customers", value: stats?.totalCustomers || 0 },
    { name: "Coupons Used", value: stats?.couponsUsed || 0 },
  ];

  const revenueData = [
    { name: "Revenue", value: parseFloat(stats?.totalRevenue || 0) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mb-10">
      {/* User Data Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Customers, Orders & Coupons
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" barSize={35} label={{ position: "top" }}>
              {userData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Chart */}
      {/* <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Revenue Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              barSize={35}
              fill="#f59e0b"
              label={{ position: "top" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div> */}
    </div>
  );
};

export default DashboardVerticalBar;
