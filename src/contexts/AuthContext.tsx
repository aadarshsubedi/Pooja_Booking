// src/contexts/AuthContext.tsx
import React, { createContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, signinUser, signupUser, logoutUser } from "../api/Api";

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<any>;
  signup: (username: string, email: string, password: string, role: string, extra?: any) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    const access = localStorage.getItem("accessToken");
    if (!access) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const data = await getCurrentUser();
      setUser({ username: data.username, role: data.role });
      setIsAuthenticated(true);
    } catch {
      // ✅ important: prevent "ghost login"
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      localStorage.removeItem("userEmail");

      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const onAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-change", onAuthChange);
    return () => window.removeEventListener("auth-change", onAuthChange);
  }, []);

  const signup = async (username: string, email: string, password: string, role: string, extra: any = {}) => {
  const data = await signupUser({ username, email, password, role, ...extra });
  window.dispatchEvent(new Event("auth-change"));
  return data;
};

  const login = async (username: string, password: string) => {
    const data = await signinUser({ username, password });
    window.dispatchEvent(new Event("auth-change"));
    return data;
  };

  const logout = async () => {
  try {
    await logoutUser();
  } finally {
    // ✅ force UI to update immediately
    setUser(null);
    setIsAuthenticated(false);

    // cleanup extra frontend-only things
    localStorage.removeItem("userProfile");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    window.dispatchEvent(new Event("auth-change"));
  }
};

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
