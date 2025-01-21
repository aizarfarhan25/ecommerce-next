import React from "react";
import Link from "next/link";
import { useCart } from "@/contex/CartContex";
import { BsCart3 } from "react-icons/bs";

const CartIcon = () => {
  const { cart } = useCart();

  // Hitung total items di cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" className="relative">
      <BsCart3 className="w-6 h-6 text-gray-700" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
