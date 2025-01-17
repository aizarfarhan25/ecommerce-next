import "react-toastify/dist/ReactToastify.css";
import { AppProps } from "next/app";
import { AuthProvider } from "@/contex/AuthContex";
import { CartProvider } from "@/contex/CartContex";
import { ToastContainer } from "react-toastify";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
