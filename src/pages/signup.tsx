import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axiosInstance from "@/utils/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface SignUpData {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

const signUpService = {
  async registerUser(userData: SignUpData) {
    try {
      const response = await axiosInstance.post("/users/", userData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error(
              "Invalid data provided. Please check your information"
            );
          case 409:
            throw new Error("Email is already registered");
          case 422:
            throw new Error("Please provide valid email and password");
          case 500:
            throw new Error("Server error. Please try again in a moment");
          default:
            throw new Error(
              "Registration failed. Please check your connection and try again"
            );
        }
      }
      throw new Error("Unable to complete registration. Please try again");
    }
  },

  validatePassword(password: string): string | null {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }

    return null;
  },

  validateInputs(name: string, email: string, password: string): string | null {
    if (!name || !email || !password) {
      return "All fields are required";
    }

    if (!email.includes("@")) {
      return "Please enter a valid email address";
    }

    const passwordError = this.validatePassword(password);
    if (passwordError) {
      return passwordError;
    }

    return null;
  },
};

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = signUpService.validateInputs(name, email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users", {
        name,
        email,
        password,
        avatar: "https://api.lorem.space/image/face?w=150&h=150"
      });

      if (response.data) {
        router.push("/login");
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (error) setError("");

    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="bg-white p-8 shadow-lg rounded-md w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Sign Up
          </h2>

          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Enter your full name"
              value={name}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Enter your email"
              value={email}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition pr-12"
                placeholder="Enter your password"
                value={password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <FaEye className="w-5 h-5" />
                ) : (
                  <FaEyeSlash className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gray-950 text-white rounded-lg hover:bg-gray-900 transition font-semibold disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-t-4 border-white rounded-full animate-spin mx-auto"></div>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;
