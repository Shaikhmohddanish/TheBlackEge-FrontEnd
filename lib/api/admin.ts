// Admin API functions
import { API_BASE_URL, handleAPIResponse, tokenManager } from '../api-client';

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  enabled: boolean;
  roles: string[];
  createdAt: string;
}

export interface ResetPasswordData {
  newPassword: string;
}

export interface UserStatusData {
  lock?: boolean;
  enable?: boolean;
}

export interface DashboardSummary {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  activeUsers: number;
  totalSales: number;
  averageOrderValue: number;
  topSellingCategory: string;
}

export interface AnalyticsResponse {
  title: string;
  timeRange: string;
  labels: string[];
  datasets?: Record<string, number[]>;
  values?: number[];
  colors?: string[];
  summary?: Record<string, any>;
}

// Get user details (Admin only)
export const getAdminUserDetails = async (userId: string): Promise<AdminUser> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get user details:', error);
    throw error;
  }
};

// Reset user password (Admin only)
export const resetUserPassword = async (userId: string, passwordData: ResetPasswordData): Promise<{ success: boolean; message: string }> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
};

// Lock/Unlock user account (Admin only)
export const toggleUserLock = async (userId: string, lock: boolean): Promise<{ success: boolean; message: string }> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/lock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ lock }),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Toggle lock failed:', error);
    throw error;
  }
};

// Enable/Disable user account (Admin only)
export const toggleUserEnable = async (userId: string, enable: boolean): Promise<{ success: boolean; message: string }> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/enable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ enable }),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Toggle enable failed:', error);
    throw error;
  }
};

// Get all users (Admin only)
export const getAllUsers = async (page = 0, size = 10, search?: string): Promise<{
  users: AdminUser[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE_URL}/admin/dashboard/users?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await handleAPIResponse(response);
    
    // Transform backend Page<UserDto> to frontend format
    return {
      users: data.content || [],
      totalPages: data.totalPages || 0,
      totalElements: data.totalElements || 0,
      currentPage: data.number || 0,
    };
  } catch (error) {
    console.error('Failed to get users:', error);
    throw error;
  }
};

// Get dashboard summary (Admin only)
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/dashboard/summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get dashboard summary:', error);
    throw error;
  }
};

// Get sales analytics (Admin only)
export const getSalesAnalytics = async (startDate: string, endDate: string): Promise<AnalyticsResponse> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);

    const response = await fetch(`${API_BASE_URL}/admin/dashboard/analytics/sales?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get sales analytics:', error);
    throw error;
  }
};

// Get product analytics (Admin only)
export const getProductAnalytics = async (startDate: string, endDate: string): Promise<AnalyticsResponse> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);

    const response = await fetch(`${API_BASE_URL}/admin/dashboard/analytics/products?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get product analytics:', error);
    throw error;
  }
};

// Get user analytics (Admin only)
export const getUserAnalytics = async (startDate: string, endDate: string): Promise<AnalyticsResponse> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);

    const response = await fetch(`${API_BASE_URL}/admin/dashboard/analytics/users?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get user analytics:', error);
    throw error;
  }
};