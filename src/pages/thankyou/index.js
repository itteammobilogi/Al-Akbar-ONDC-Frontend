import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function ThankYouPage() {
  return (
    <>
      <Head>
        <title>Thank You | Al-Akbar</title>
      </Head>

      <div>
        <Navbar />
      </div>
      <div>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white max-w-lg mx-auto p-8 rounded-3xl shadow-2xl text-center"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-green-500 mx-auto mb-4"
            >
              <CheckCircle className="w-20 h-20 mx-auto" />
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl font-bold text-gray-800 mb-2"
            >
              Thank You for Your Purchase!
            </motion.h1>

            <p className="text-gray-600 mb-6">
              We’ve received your order and it’s being processed. You’ll get a
              confirmation email shortly.
            </p>

            <Link
              href="/"
              className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-medium shadow-md transition-all"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}
