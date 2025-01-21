import { useState } from "react";
import { useRouter } from "next/router";
import { useProduct } from "@/hooks/useProduct";
import Header from "@/components/Header";
import { useCart } from "@/contex/CartContex";
import { CartItem } from "@/contex/CartContex";
import { useAuth } from "@/contex/AuthContex";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { product, isLoading } = useProduct(id as string);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="p-4 md:p-6">
          <div className="animate-pulse">{/* Add loading skeleton here */}</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const increment = () => {
    setQuantity((prev) => prev + 1); // tambah jumlah produk
  };

  const decrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // kurangi jumlah produk, tidak boleh kurang dari 1
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    if (product) {
      const cartItem: CartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
        category: product.category,
      };
      addToCart(cartItem, quantity);
      toast.success("Product added to cart");
    }
  };

  return (
    <div className="">
      <Header />
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="w-full md:w-[40%]">
            {product?.images[0] && (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}
          </div>
          <div className="w-full">
            <h1 className="text-xl md:text-2xl font-semibold mb-3">
              {product?.title}
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              {product?.description}
            </p>
            <p className="text-lg md:text-xl font-semibold mt-3 md:mt-4">
              ${product?.price}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Category: {product?.category.name}
            </p>
            <div className="flex items-center mt-3">
              <button
                onClick={decrement}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                -
              </button>
              <span className="mx-4">{quantity}</span>
              <button
                onClick={increment}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full md:w-auto mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
            >
              {isAuthenticated ? "Add to Cart" : "Login to Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
