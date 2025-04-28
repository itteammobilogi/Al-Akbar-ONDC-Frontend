"use client";

import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { Rocket } from "lucide-react";
import { signup } from "@/utils/ApiUrlHelper";
import { useRouter } from "next/router";
import { Cake } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const payload = { name, email, password, dob };
      const res = await signup(payload);

      if (res && res.success) {
        toast.success(res.message || "Signup successful");
        setTimeout(() => {
          router.push("/auth/Login"); // or wherever you want
        }, 1500);
        // Optionally reset form or redirect
      } else {
        toast.error(res.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(
        err.response?.data?.message || "Something went wrong. Try again later."
      );
    }
  };

  const handleDobChange = (e) => {
    setDob(e.target.value);

    // 🎉 Show a toast when user selects date
    if (e.target.value) {
      toast.success(
        "🎉 Nice! We'll surprise you with a gift on your Birthday!"
      );
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white px-10 py-12 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-2"
          >
            Let’s Get Started
            <Rocket className="w-7 h-7 animate-bounce" />
          </motion.h2>

          <form onSubmit={handleSignup} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-600 bg-white px-1"
              >
                Full Name
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-600 bg-white px-1"
              >
                Email
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-600 bg-white px-1"
              >
                Password
              </label>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={handleDobChange}
                className="peer w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 pl-12" // Add pl-12 for icon space
                required
              />

              {/* Birthday Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400"
              >
                <Cake className="w-5 h-5" />
              </motion.div>

              <label
                htmlFor="dob"
                className="absolute left-12 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-600 bg-white px-1"
              >
                Date of Birth
              </label>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl transition duration-300 hover:bg-green-700 shadow-lg"
            >
              Sign Up
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-gray-600 text-sm"
          >
            Already have an account?{" "}
            <Link
              href="/auth/Login"
              className="text-green-600 font-medium hover:underline"
            >
              Login
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </AuthLayout>
  );
}
