// User address API functions
import { makeAuthenticatedRequest, handleAPIResponse, API_BASE_URL } from '../api-client';

export interface UserAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  enabled: boolean;
  roles: string[];
  firstName?: string;
  lastName?: string;
  address?: UserAddress;
}

/**
 * Update user address
 */
export const updateUserAddress = async (address: UserAddress): Promise<UserProfile> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/user/address`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
    });

    return handleAPIResponse(response);
  } catch (error) {
    console.error('Error updating user address:', error);
    throw error;
  }
};

/**
 * Get user profile with address
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/user/profile`);
    return handleAPIResponse(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Delete user address
 */
export const deleteUserAddress = async (): Promise<UserProfile> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/user/address`, {
      method: 'DELETE',
    });

    return handleAPIResponse(response);
  } catch (error) {
    console.error('Error deleting user address:', error);
    throw error;
  }
};

/**
 * Update user profile information
 */
export const updateUserProfile = async (profileData: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}): Promise<UserProfile> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    return handleAPIResponse(response);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};