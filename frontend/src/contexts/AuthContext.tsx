import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../services/authService";
import { AuthService } from "../services/authService";
import { AuthContext } from "./auth-context";
import type { AuthContextType } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app start
    const checkAuth = () => {
      const token = AuthService.getToken();
      if (token) {
        // Here you could decode the JWT to get user info
        // For now, we'll just set isAuthenticated to true
        setUser({} as User); // You might want to fetch user data from token or API
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.login({ username, password });
      // You might want to decode the JWT token to get user information
      setUser({} as User); // Set actual user data here
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await AuthService.register({ username, email, password });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    AuthService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user || AuthService.isAuthenticated(),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
