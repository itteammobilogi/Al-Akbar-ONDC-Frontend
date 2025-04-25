import React from "react";
import { Heart, Sparkles, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

function AboutUs() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="bg-[#fff9f8] pt-12 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            About Us
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Rooted in elegance, driven by tradition — we bring timeless Abayas
            crafted for today’s woman.
          </p>
        </motion.section>

        {/* Our Story */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-24"
        >
          <h2 className="text-2xl font-bold mb-4 text-pink-600">Our Story</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
            At ABAYA, we believe modesty is a form of empowerment. What began as
            a small vision has grown into a brand loved for its elegance,
            comfort, and craftsmanship. From premium fabrics to thoughtful
            tailoring, each piece reflects our dedication to quality and
            heritage.
          </p>
        </motion.section>

        {/* Why Choose Us */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-24"
        >
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <Heart className="mx-auto text-pink-600 mb-3" />,
                title: "Made with Love",
                desc: "Every design is handcrafted with love and care by local artisans.",
              },
              {
                icon: <Sparkles className="mx-auto text-pink-600 mb-3" />,
                title: "Premium Quality",
                desc: "We use only luxurious, breathable fabrics designed to last.",
              },
              {
                icon: <ShieldCheck className="mx-auto text-pink-600 mb-3" />,
                title: "Trusted by Thousands",
                desc: "A loyal customer base across the globe who believe in our story.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition"
              >
                {item.icon}
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-gradient-to-r from-pink-100 to-yellow-50 py-10 px-6 rounded-xl shadow-lg text-center"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Ready to Shop?
          </h3>
          <p className="text-gray-600 mb-5 text-sm md:text-base">
            Explore our latest collections designed with love, luxury, and
            modesty.
          </p>
          <a
            href="/shop"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-pink-700 transition"
          >
            View Collection
          </a>
        </motion.section>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default AboutUs;
