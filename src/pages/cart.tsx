import React, { useEffect, useState } from "react";
import { useCart } from "@/contex/CartContex";
import { useAuth } from "@/contex/AuthContex";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { toast } from "react-toastify";
import { Button, Modal, Box, Typography } from "@mui/material";

const CartPage = () => {
  const { cart, total, setQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
    toast.success("Item removed from cart");
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    // First show processing state
    setTimeout(() => {
      setIsProcessing(false);
      handleOpen();
      setTimeout(() => {
        clearCart();
        setTimeout(() => {
          handleClose();
          // router.push("/");
        },);
      }, 3000);
    },2000);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
          <div className="text-center">
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center"
            >
              <div className="flex-shrink-0 w-full sm:w-40 rounded-2xl overflow-hidden mb-4 sm:mb-0 bg-white shadow-sm">
                <img
                  src={item.image || "/placeholder-image.jpg"}
                  alt={item.title}
                  className="w-full h-full aspect-square object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-image.jpg";
                  }}
                />
              </div>
              <div className="flex-1 sm:ml-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">${item.price}</p>
                <div className="mt-4 flex items-center">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="mx-4 text-gray-600">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-row sm:flex-col justify-between items-center sm:items-end">
                <p className="text-lg font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-lg">
            Total: <span className="font-bold">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {isProcessing ? "Processing..." : "Purchase"}
          </button>
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "8px",
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ textAlign: "center" }}
            >
              Purchase Successful
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2, textAlign: "center" }}
            >
              Thank you for your purchase! Your cart has been cleared.
            </Typography>
          </Box>
        </Modal>
      </div>
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
