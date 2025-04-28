"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  autoRewardCoupon,
  getUserCoupons,
  getUserProfile,
  updateUserProfile,
} from "@/utils/ApiUrlHelper";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Edit3, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Head from "next/head";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [errorShown, setErrorShown] = useState(false);
  const [userCoupon, setUserCoupon] = useState([]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token"); // Check token first

    if (!token) {
      if (!errorShown && router.pathname !== "/auth/Login") {
        setErrorShown(true);
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          router.push("/auth/Login");
        }, 1500);
      }
      return; // Stop here if no token
    }

    try {
      const res = await getUserProfile();
      if (res && res.user) {
        setUser(res.user);
        setEditData({
          name: res.user.name,
          email: res.user.email,
          password: "", // Always empty
        });
      } else {
        // API response invalid (maybe token is wrong)
        throw new Error("Invalid response format");
      }
    } catch (err) {
      if (!errorShown && router.pathname !== "/auth/Login") {
        setErrorShown(true);
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          router.push("/auth/Login");
        }, 1500);
      }
      console.error("Fetch profile failed:", err?.message || err);
    }
  };

  const fetchUserCoupon = async () => {
    try {
      const response = await getUserCoupons();
      if (response.success) {
        setUserCoupon(response.coupons || []);
      }
    } catch (error) {
      console.error("Failed to fetch user coupons:", error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserCoupon();
  }, []);

  const openEditModal = () => {
    setEditData({ name: user.name, email: user.email, password: "" });
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateUserProfile({
        name: editData.name,
        email: editData.email,
        password: editData.password || undefined,
      });
      toast.success("Profile updated successfully!");
      setOpenModal(false);
      fetchProfile(); // Refresh updated data
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    return (
      editData.name !== user.name ||
      editData.email !== user.email ||
      (editData.password && editData.password.length > 0)
    );
  };

  return (
    <>
      <Head>
        <title>My Profile | Al-Akbar</title>
        <meta
          name="description"
          content="Manage your Al-Akbar profile details securely. Update your name, email, or password easily."
        />
      </Head>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8"
        >
          {!user ? (
            <p className="text-center text-gray-600">Loading profile...</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <button
                  onClick={openEditModal}
                  className="flex items-center gap-1 text-pink-600 hover:underline text-sm cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              <div className="space-y-6">
                {/* Avatar + Name + Email */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {user.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </p>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Member since + Last updated */}
                <div className="text-sm text-gray-400 space-y-1 mt-4">
                  <p>
                    Member since:{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    Last updated:{" "}
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                {userCoupon.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-bold text-pink-600 mb-4">
                      🎁 Your Coupons
                    </h2>
                    <div className="grid gap-4">
                      {userCoupon.map((coupon) => (
                        <div
                          key={coupon.code}
                          className="border border-pink-300 p-4 rounded-xl bg-pink-50 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold text-pink-800">
                              Code: {coupon.code}
                            </p>

                            {/* Show Valid Till Date */}
                            {coupon.validTill && (
                              <p className="text-sm text-gray-600">
                                Valid Till:{" "}
                                {new Date(coupon.validTill).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            )}

                            {/* Show Coupon Status */}
                            <p
                              className={`mt-1 text-xs font-bold ${
                                coupon.isUsed
                                  ? "text-red-500"
                                  : "text-green-600"
                              }`}
                            >
                              {coupon.isUsed ? "Already Used ❌" : "Active ✅"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* --- Modal for Editing Profile --- */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-40 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 relative flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={editData.password}
                  onChange={(e) =>
                    setEditData({ ...editData, password: e.target.value })
                  }
                  placeholder="Leave blank to keep existing password"
                  className="w-full rounded-lg border border-gray-300 py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-9 text-gray-500 hover:text-pink-500 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-4 mt-8 border-t pt-4">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-full transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!hasChanges() || loading}
                className={`${
                  !hasChanges() || loading
                    ? "bg-pink-300"
                    : "bg-pink-600 hover:bg-pink-700"
                } text-white font-semibold py-2 px-6 rounded-full transition cursor-pointer`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </>
  );
}
