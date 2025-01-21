import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const setupAuth = async () => {
        try {
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;

          await axiosInstance.get("/auth/profile");

          setIsAuthenticated(true);
          await fetchUserData(token);
        } catch (error) {
          console.error("Token validation failed:", error);
          handleLogout();
        } finally {
          setLoading(false);
        }
      };

      setupAuth();
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { access_token } = response.data;
      if (!access_token) {
        throw new Error("Login failed: No access token received");
      }

      Cookies.set("token", access_token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;
      setIsAuthenticated(true);
      await fetchUserData(access_token);
      return true;
    } catch (error: any) {
      console.error("Login error details:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(errorMessage);
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
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
