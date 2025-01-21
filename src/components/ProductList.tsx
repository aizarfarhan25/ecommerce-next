import React from "react";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { useCart } from "@/contex/CartContex";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from "@/contex/AuthContex";

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
  category: {
    id: number;
    name: string;
  };
}

interface Props {
  products: Product[];
}

const ProductList: React.FC<Props> = ({ products }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      // toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        category: product.category,
      },
      1
    );
    toast.success("Product added to cart");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto w-[90%] md:w-[85%] lg:w-[80%]">
      {products.map((product) => (
        <Link
          href={`/product/${product.id}`}
          key={product.id}
          className="flex flex-col border border-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          <div className="relative w-full h-48 mb-4">
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex flex-col flex-grow">
            <h2 className="font-semibold text-sm text-gray-900">
              {product.title}
            </h2>
          </div>

          <div className="flex items-center mt-4">
            <span className="text-xs text-gray-700 bg-white border border-gray-300 py-1 px-2 rounded-3xl">
              {product.category.name}
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-2">
            <div className="order-2 md:order-1 w-full md:w-auto">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(product);
                }}
                className="w-full md:w-auto text-sm bg-black text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2"
              >
                <MdOutlineShoppingCartCheckout />
                <span className="whitespace-nowrap">
                  {isAuthenticated ? "Add to Cart" : "Login to Add"}
                </span>
              </button>
            </div>
            <div className="order-1 md:order-2 w-full md:w-auto text-right">
              <p className="text-xs">Price</p>
              <p className="text-gray-600 text-sm font-semibold">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
