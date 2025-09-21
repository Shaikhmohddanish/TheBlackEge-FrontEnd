// Authentication API functions
import { API_BASE_URL, handleAPIResponse, tokenManager } from '../api-client';

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginCredentials {
  username: string; // can be username or email
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    phone?: string;
    imageUrl?: string;
    enabled: boolean;
    roles: string[];
  };
}

export interface PasswordValidation {
  valid: boolean;
  strength: number;
  compromised: boolean;
  errors: string[];
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface GoogleAuthData {
  credential: string;
  clientId?: string;
}

// User Registration
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
      }),
    });

    const result = await handleAPIResponse(response);
    
    // Store tokens and user data
    tokenManager.setToken(result.token);
    tokenManager.setUser(result.user);
    
    return result;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// User Login
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernameOrEmail: credentials.username,
        password: credentials.password,
      }),
    });

    const result = await handleAPIResponse(response);
    
    // Store tokens and user data
    tokenManager.setToken(result.token);
    tokenManager.setUser(result.user);
    
    return result;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// User Logout
export const logoutUser = async (): Promise<void> => {
  try {
    // Clear tokens from storage
    tokenManager.clearTokens();
    
    // Optionally call logout endpoint if available
    // await makeAuthenticatedRequest(`${API_BASE_URL}/auth/logout`, {
    //   method: 'POST',
    // });
  } catch (error) {
    console.error('Logout failed:', error);
    // Clear tokens anyway
    tokenManager.clearTokens();
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = tokenManager.getToken();
  const user = tokenManager.getUser();
  
  console.log('isAuthenticated check - token:', !!token, 'user:', !!user);
  
  return !!(token && user);
};

// Get current user
export const getCurrentUser = () => {
  return tokenManager.getUser();
};

// Check if user has specific role
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.roles?.includes(role) || false;
};

// Password validation
export const validatePassword = async (password: string): Promise<PasswordValidation> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Password validation failed:', error);
    return {
      valid: false,
      strength: 0,
      compromised: false,
      errors: ['Password validation failed. Please try again.']
    };
  }
};

// Change password
export const changePassword = async (passwordData: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Password change failed:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Get profile failed:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData: any) => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const result = await handleAPIResponse(response);
    
    // Update stored user data
    if (result) {
      tokenManager.setUser(result);
    }
    
    return result;
  } catch (error) {
    console.error('Profile update failed:', error);
    throw error;
  }
};

// Check if user is admin
export const isAdmin = (): boolean => {
  return hasRole('ROLE_ADMIN');
};

// Google OAuth Login
export const loginWithGoogle = async (googleData: GoogleAuthData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential: googleData.credential,
        clientId: googleData.clientId,
      }),
    });

    const result = await handleAPIResponse(response);
    
    // Store tokens and user data
    tokenManager.setToken(result.token);
    tokenManager.setUser(result.user);
    
    return result;
  } catch (error) {
    console.error('Google login failed:', error);
    throw error;
  }
};

// Google OAuth Registration
export const registerWithGoogle = async (googleData: GoogleAuthData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential: googleData.credential,
        clientId: googleData.clientId,
      }),
    });

    const result = await handleAPIResponse(response);
    
    // Store tokens and user data
    tokenManager.setToken(result.token);
    tokenManager.setUser(result.user);
    
    return result;
  } catch (error) {
    console.error('Google registration failed:', error);
    throw error;
  }
};
