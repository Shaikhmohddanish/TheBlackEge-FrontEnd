// Debug API functions
import { API_BASE_URL, handleAPIResponse } from '../api-client';

export interface DebugUserInfo {
  success: boolean;
  user?: {
    id: string;
    name: string;
    username: string;
    email: string;
    roles: string[];
  };
  authorities?: string[];
  message?: string;
}

// Get current user info for debugging
export const getCurrentUserInfo = async (): Promise<DebugUserInfo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    return await handleAPIResponse(response) as DebugUserInfo;
  } catch (error) {
    console.error('Debug: Failed to get current user info:', error);
    throw error;
  }
};