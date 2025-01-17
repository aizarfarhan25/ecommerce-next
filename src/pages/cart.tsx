import React, { useEffect } from "react";
import { useCart } from "@/contex/CartContex";
import { useAuth } from "@/contex/AuthContex";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "@/components/Header";

const CartPage = () => {
  const { cart, addToCart, decreaseQuantity, removeFromCart, buyCart } =
    useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex flex-1 flex-col items-center p-4">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500">Your cart is empty.</p>
            <Link
              href="/"
              className="mt-4 inline-block bg-gray-950 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between mb-4 border p-4 rounded"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-20 h-20 object-cover mr-4"
                />

                <div className="flex-1">
                  <h2 className="font-bold">{item.title}</h2>
                  <p>${item.price.toFixed(2)}</p>

                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400 transition"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}

            <p className="font-bold text-lg mt-4">Total: ${total.toFixed(2)}</p>
            <button
              onClick={() => {
                buyCart();
                alert("Your purchase is successful");
                router.push("/");
              }}
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition ml-4"
            >
              Purchase Now
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export async function getServerSideProps({ req }: { req: any }) {
  const token = req.cookies.token; // Check authentication token from cookies

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default CartPage;
