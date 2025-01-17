import { useEffect, useState } from "react";
import { useCart } from "@/contex/CartContex";
import Link from "next/link";
import { CiShoppingCart } from "react-icons/ci";

const CartIcon = () => {
  const { cart } = useCart();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setItemCount(totalItems);
    } else {
      setItemCount(0);
    }
  }, [cart]);

  return (
    <Link href="/cart" className="relative">
      <CiShoppingCart size={30} />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;

