// /components/Footer/Footer.jsx
import React from "react";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-[#fdf4f0] text-gray-700 mt-12 pt-12 pb-6 border-t border-pink-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <Link href="/" className="">
            <h2 className="text-2xl font-bold font-serif text-pink-600 mb-3">
              Al-Akbar
            </h2>
          </Link>

          <p className="text-sm text-gray-600 mb-4">
            Elegant, modest and timeless pieces tailored for the modern woman.
          </p>
          <div className="flex space-x-3">
            <Instagram className="w-5 h-5 text-pink-600 hover:text-pink-800 cursor-pointer" />
            <Facebook className="w-5 h-5 text-pink-600 hover:text-pink-800 cursor-pointer" />
            <Mail className="w-5 h-5 text-pink-600 hover:text-pink-800 cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Shop
              </a>
            </li>
            <li>
              <Link href="/aboutus" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contactus" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Customer Care</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Shipping & Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Subscribe</h3>
          <p className="text-sm mb-3">
            Get the latest style drops and exclusive offers.
          </p>
          <form className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 text-sm outline-none bg-white"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-4 py-2 text-sm font-medium hover:bg-pink-700 transition"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Al-Akbar. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
