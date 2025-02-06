import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contex/AuthContex";
import { useCart } from "@/contex/CartContex";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl md:text-2xl font-bold text-black">GegeShop</span>
        </Link>

        {/* Mobile menu button */}
        <button
          data-testid="menu-toggle-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/about"
            className="px-4 py-2 text-sm md:text-base font-medium text-gray-700 hover:text-gray-900"
          >
            About Us
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <FaShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm md:text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile navigation */}
        <div
          data-testid="mobile-menu"
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg flex-col items-center py-4 space-y-4`}
        >
          <Link
            href="/about"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            About Us
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 hover:text-gray-900 flex items-center"
              >
                <FaShoppingCart size={20} />
                <span className="ml-2">Cart</span>
                {cartItemsCount > 0 && (
                  <span 
                    className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                  >
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;