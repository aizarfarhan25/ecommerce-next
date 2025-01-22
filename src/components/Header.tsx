import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contex/AuthContex";
import { useCart } from "@/contex/CartContex";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
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
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-black">GegeShop</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => router.push("/cart")}
                className="relative p-2"
                aria-label="shopping cart"
              >
                <FaShoppingCart className="w-6 h-6 text-gray-700" />
                {cartItemsCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                    aria-label="cart items"
                  >
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link href="/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
