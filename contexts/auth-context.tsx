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
  // Computed properties for convenience
  firstName?: string;
  lastName?: string;
  // Address information
  address?: {
    fullName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phoneNumber?: string;
  };
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

  // Helper function to split name into firstName and lastName
  const processUserData = (userData: any): User => {
    const nameParts = userData.name ? userData.name.split(' ') : ['', ''];
    return {
      ...userData,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
    };
  };

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        
        if (token && storedUser) {
          try {
            const currentUser = JSON.parse(storedUser);
            setUser(processUserData(currentUser));
          } catch (parseError) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure localStorage is ready
    setTimeout(checkAuth, 100);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await loginUser(credentials);
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(processUserData(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await registerUser(userData);
      setUser(processUserData(response.user));
      return response;
    } catch (error) {
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
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (googleData: GoogleAuthData): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await loginWithGoogle(googleData);
      setUser(processUserData(response.user));
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleRegister = async (googleData: GoogleAuthData): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await registerWithGoogle(googleData);
      setUser(processUserData(response.user));
      return response;
    } catch (error) {
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
    isAuthenticated: !!user && !isLoading, // Only consider authenticated if we have user and not loading
    isAdmin: !!user && !isLoading && isAdmin(), // Only check admin status if we have user and not loading
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
