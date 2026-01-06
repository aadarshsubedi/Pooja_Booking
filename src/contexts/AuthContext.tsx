// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from "react";
import {
  getCurrentUser,
  signinUser,
  signupUser,
  logoutUser,
  getMyProfile, // ✅ add this in Api.ts (GET /api/profile/)
} from "../api/Api";

interface User {
  username: string;
  role: string;
  avatarUrl?: string; // ✅ added
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<any>;
  signup: (username: string, email: string, password: string, role: string) => Promise<any>;
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
      const data = await getCurrentUser(); // { username, role }
      let avatarUrl = "";

      // ✅ load avatar (optional, don't fail login if profile fails)
      try {
        const profile = await getMyProfile(); // { avatar_url: "http://..." }
        avatarUrl = profile.avatar_url || "";
      } catch {
        avatarUrl = "";
      }

      setUser({ username: data.username, role: data.role, avatarUrl });
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signup = async (username: string, email: string, password: string, role: string) => {
    const data = await signupUser({ username, email, password, role });
    await checkAuth();
    return data;
  };

  const login = async (username: string, password: string) => {
    const data = await signinUser({ username, password });
    await checkAuth();
    return data;
  };

  const logout = async () => {
    // ✅ IMPORTANT: update UI immediately
    setUser(null);
    setIsAuthenticated(false);
    await logoutUser(); // clears tokens
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
