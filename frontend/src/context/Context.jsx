import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status when app loads
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get("/user/is-auth");

      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }

    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login user and store user data in state
  const login = async (data) => {
    try {
      const res = await api.post("/user/login", data);
      setUser(res.data.user);
      toast.success("Logged in successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // Register new user and login
  const register = async (data) => {
    try {
      const res = await api.post("/user/register", data);
      setUser(res.data.user);
      toast.success("Account created");
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed");
      throw err;
    }
  };

  // Logout user and clear session
  const logout = async () => {
    try {
      await api.get("/user/logout");
      setUser(null);
      toast.success("Logged out");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);