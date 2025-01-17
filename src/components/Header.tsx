import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import CartIcon from "./CartIcon";
import { useAuth } from "@/contex/AuthContex";

interface HeaderProps {
  title?: string;
  showCartIcon?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = "GegeShop", showCartIcon = true }) => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout(); 
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl md:text-3xl font-extrabold text-black">
          {title}
        </Link>
        <div className="flex gap-6 items-center">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Log Out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </Link>
          )}
          {showCartIcon && <CartIcon />}
        </div>
      </div>
    </header>
  );
};

export default Header;

