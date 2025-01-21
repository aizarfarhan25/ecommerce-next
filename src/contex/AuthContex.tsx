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
    console.log("Token check on mount:", !!token); // Debugging

    if (token) {
      const setupAuth = async () => {
        try {
          // Set token in axios headers
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;

          // Verify token validity
          const profileResponse = await axiosInstance.get("/auth/profile");
          console.log("Profile fetch successful:", profileResponse.status); // Debugging

          setIsAuthenticated(true);
          setUser(profileResponse.data);
        } catch (error) {
          console.error("Auth setup failed:", error); // Debugging
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login..."); // Debugging

      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { access_token } = response.data;
      if (!access_token) {
        throw new Error("Login failed: No access token received");
      }

      // Set cookie with proper settings
      Cookies.set("token", access_token, {
        expires: 7, // 7 days
        secure: true,
        sameSite: "lax",
        path: "/",
      });

      console.log("Token saved, setting up auth..."); // Debugging

      // Set up authentication state
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;
      setIsAuthenticated(true);

      // Fetch user data
      const userResponse = await axiosInstance.get("/auth/profile");
      setUser(userResponse.data);

      return true;
    } catch (error: any) {
      console.error("Login failed:", {
        error,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  };

  const handleLogout = () => {
    console.log("Logging out..."); // Debugging
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
