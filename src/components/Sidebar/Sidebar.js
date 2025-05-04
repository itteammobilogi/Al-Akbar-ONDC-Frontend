// components/AdminLayout.jsx
import React, { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingCart,
  PackageSearch,
  LogOut,
} from "lucide-react";
import Link from "next/link";

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
      {/* Sidebar */}
      <div
        className={`fixed z-50 inset-y-0 left-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:relative`}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <h2 className="text-lg font-bold text-teal-400">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="p-4 hidden md:block text-center">
          <h2 className="text-2xl font-extrabold text-teal-400 flex items-center justify-center gap-2">
            <LayoutDashboard size={22} />
            Admin Panel
          </h2>
        </div>

        <nav className="flex flex-col gap-2 px-4 mt-6">
          <Link href="/dashboard">
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
          </Link>
          <Link href="/admin/product/page">
            <NavItem icon={<ShoppingCart size={18} />} label="Products" />
          </Link>
          <Link href="/admin/order">
            <NavItem icon={<PackageSearch size={18} />} label="Orders" />
          </Link>
          <div onClick={() => alert("Logging out")}>
            <NavItem icon={<LogOut size={18} />} label="Logout" />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 shadow-md flex items-center justify-between px-4 py-4 sticky top-0 z-30">
          <button
            className="text-white md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-teal-300 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-teal-400" />
            Admin Dashboard
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
          {children}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-teal-600/20 transition text-sm cursor-pointer">
    {icon}
    <span>{label}</span>
  </div>
);

export default AdminLayout;
