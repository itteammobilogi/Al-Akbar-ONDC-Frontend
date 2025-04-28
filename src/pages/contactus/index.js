import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { submitContactForm } from "@/utils/ApiUrlHelper"; // 👈 API import
import toast from "react-hot-toast"; // 👈 toast import
import { useRouter } from "next/router";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await submitContactForm(form);
      toast.success(res.message || "Message sent successfully! 🎉");

      // Optional: Clear form after success
      setForm({
        name: "",
        email: "",
        message: "",
      });
      router.push("/");
    } catch (error) {
      toast.error(error.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="bg-[#fff9f7] pt-12 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-base md:text-lg">
            We'd love to hear from you! Whether it's a question, feedback, or a
            warm hello — reach out and let's connect.
          </p>
        </motion.section>

        {/* Contact Info Cards */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          variants={fadeInUp}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
        >
          <div className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <MapPin className="w-6 h-6 text-pink-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800">Address</h4>
            <p className="text-sm text-gray-600 mt-1">
              Ozone Bizz Center Mumbai-Central 4000008
            </p>
          </div>
          <div className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <Mail className="w-6 h-6 text-pink-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800">Email</h4>
            <p className="text-sm text-gray-600 mt-1">akbar000785@gmail.com</p>
          </div>
          <div className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <Phone className="w-6 h-6 text-pink-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800">Phone</h4>
            <p className="text-sm text-gray-600 mt-1">+91 9082670335</p>
          </div>
        </motion.section>

        {/* Contact Form */}
        <motion.form
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          variants={fadeInUp}
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              rows="4"
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Type your message here..."
              required
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-pink-700 transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </motion.form>
      </div>

      <Footer />
    </div>
  );
}

export default ContactUs;
