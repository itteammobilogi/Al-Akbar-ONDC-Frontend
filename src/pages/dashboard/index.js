import React from "react";
import AdminLayout from "@/components/Sidebar/Sidebar";
import DashboardMetrics from "@/components/dashboard/Dashboard";
import DashboardCharts from "@/components/dashboard/DashboardPie";

const DashboardPage = () => {
  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Admin Dashboard</h1>
        <DashboardMetrics />
        <DashboardCharts />
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
