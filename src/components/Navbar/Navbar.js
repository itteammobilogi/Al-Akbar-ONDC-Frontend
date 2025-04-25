import React, { useState, useEffect } from "react";
import { Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import Link from "next/link";
import SearchBox from "../Search/SearchBox";
import { getCartByUser, getWishlistProductsByUser } from "@/utils/ApiUrlHelper";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [wishListCount, setWishListCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const name = user?.name || "";
      setUserInitial(name.charAt(0).toUpperCase());
    }

    const fetchCounts = async () => {
      try {
        // now we know token exists
        // const wishlist = await getWishlistProductsByUser();
        const cart = await getCartByUser();
        // setWishListCount(wishlist.length);
        setCartCount(cart.length || cart.items?.length || 0);
      } catch (error) {
        console.error("Error fetching counts", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <header className="shadow-md w-full bg-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold text-pink-600 tracking-wide">
            <Link href="/" className="">
              Al-Akbar
            </Link>
          </div>

          {/* Desktop Category Links */}
          <ul className="hidden md:flex space-x-6 font-medium text-sm text-gray-700 uppercase">
            <li className="hover:text-pink-600 cursor-pointer">Men</li>
            <li className="hover:text-pink-600 cursor-pointer">Women</li>
            <li className="hover:text-pink-600 cursor-pointer">Kids</li>
            <li className="hover:text-pink-600 cursor-pointer">Beauty</li>
            <li className="hover:text-pink-600 cursor-pointer">Studio</li>
          </ul>

          {/* Search + Icons */}
          <div className="flex items-center space-x-4">
            {/* <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search for products, brands..."
                className="border border-gray-300 rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 w-64"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div> */}
            <SearchBox />

            {/* Icons */}
            <div className="flex space-x-4 items-center text-gray-700">
              {userInitial ? (
                <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {userInitial}
                </div>
              ) : (
                <Link
                  href="/auth/Login"
                  className="flex flex-col items-center text-xs cursor-pointer hover:text-pink-600"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
              )}

              <Link
                href="/wishlist/wishListProduct"
                className="relative flex flex-col items-center text-xs cursor-pointer hover:text-pink-600"
              >
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/cart/userCart"
                className="relative flex flex-col items-center text-xs cursor-pointer hover:text-pink-600"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Bag</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Hamburger Menu (Mobile) */}
              <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 mt-2 space-y-2 pb-4">
            <ul className="flex flex-col space-y-2 text-sm text-gray-700 font-medium uppercase px-2">
              <li className="hover:text-pink-600 cursor-pointer">Men</li>
              <li className="hover:text-pink-600 cursor-pointer">Women</li>
              <li className="hover:text-pink-600 cursor-pointer">Kids</li>
              <li className="hover:text-pink-600 cursor-pointer">Beauty</li>
              <li className="hover:text-pink-600 cursor-pointer">Studio</li>
            </ul>

            <div className="px-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
