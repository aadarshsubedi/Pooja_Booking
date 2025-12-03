// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { getCurrentUser, signinUser, signupUser, logoutUser } from "../api/Api";

interface User {
  username: string;
  role: string;
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

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const data = await getCurrentUser();
      setUser({username: data.username, role: data.role});
      setIsAuthenticated(true);
    } catch (_) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signup = async (username: string, email: string, password: string, role: string) => {
    const data = await signupUser({username, email, password, role});
    // signupUser stores tokens and sets localStorage user info
    await checkAuth();
    return data;
  };

  const login = async (username: string, password: string) => {
    const data = await signinUser({username, password});
    await checkAuth();
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{user, isAuthenticated, login, signup, logout, checkAuth}}>
      {children}
    </AuthContext.Provider>
  );
};
