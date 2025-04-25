"use client";

import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/router";
import { login } from "@/utils/ApiUrlHelper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in both fields");
      return;
    }

    try {
      const payload = { email, password };
      setLoading(true);

      const res = await login(payload);

      if (res && res.success) {
        toast.success(res.message || "Login successful");

        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        localStorage.setItem("user", JSON.stringify(res.user));

        setTimeout(() => {
          const redirectPath = res.role === "admin" ? "/dashboard" : "/";
          router.push(redirectPath);
        }, 1500);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Invalid email or password");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white px-10 py-12 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4 flex items-center justify-center gap-2">
              Welcome Back
              <ShoppingCart className="w-7 h-7 " />
              {/* <Smile className="w-7 h-7 " /> */}
              {/* <LogIn className="w-7 h-7 " /> */}
            </h2>

            {/* <motion.img
              src="https://www.clipartmax.com/png/middle/417-4175624_man-walking-with-shopping-cart-vector-customer-with-shopping-cart-icon-png.png"
              alt="Shopping Cart Icon"
              className="w-24 h-24 mx-auto object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            /> */}
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`w-full py-3 rounded-xl transition duration-300 shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-gray-600 text-sm"
          >
            Don&apos;t have an account?{" "}
            <Link href="/auth/SignUp" className="text-blue-600">
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </AuthLayout>
  );
}
