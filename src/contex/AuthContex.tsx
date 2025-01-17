import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axiosInstance";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsAuthenticated(true);
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      const response = await axiosInstance.get("/auth/profile");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { access_token } = response.data;

      // Set token in cookie with httpOnly flag
      Cookies.set("token", access_token, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Set axios default header
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;

      setIsAuthenticated(true);
      await fetchUserData(access_token);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout: handleLogout,
    isLoading: loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
