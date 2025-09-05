'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  isAuthenticated, 
  getCurrentUser,
  hasRole,
  isAdmin,
  loginWithGoogle,
  registerWithGoogle
} from '@/lib/api/auth';
import type { LoginCredentials, RegisterData, AuthResponse, GoogleAuthData } from '@/lib/api/auth';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  enabled: boolean;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  loginWithGoogle: (googleData: GoogleAuthData) => Promise<AuthResponse>;
  registerWithGoogle: (googleData: GoogleAuthData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid tokens
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await loginUser(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await registerUser(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user state even if logout fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (googleData: GoogleAuthData): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await loginWithGoogle(googleData);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleRegister = async (googleData: GoogleAuthData): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await registerWithGoogle(googleData);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Google registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkRole = (role: string): boolean => {
    return hasRole(role);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    login,
    register,
    loginWithGoogle: googleLogin,
    registerWithGoogle: googleRegister,
    logout,
    hasRole: checkRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
