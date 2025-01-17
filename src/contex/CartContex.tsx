import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  buyCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const savedCart = localStorage.getItem("cart");

    if (!token) {
      setCart([]);
    } else {
      setCart(savedCart ? JSON.parse(savedCart) : []);
    }
  }, []);

  const addToCart = (product: CartItem, quantity: number = 1) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity; 
    } else {
      updatedCart.push({ ...product, quantity }); 
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (id: number) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.id === id);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1; 
      } else {
        const filteredCart = updatedCart.filter((item) => item.id !== id);
        setCart(filteredCart);
        localStorage.setItem("cart", JSON.stringify(filteredCart));
        return;
      }

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); 
    }
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); 
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart"); 
  };

  const buyCart = () => {
    setCart([]);
    localStorage.removeItem("cart"); 
    router.push("/");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,
        buyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

