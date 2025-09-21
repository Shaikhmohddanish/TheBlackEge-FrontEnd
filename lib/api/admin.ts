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

export interface CouponDto {
  id?: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minimumPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  currentUsage?: number;
  active: boolean;
}

export interface CouponsResponse {
  content: CouponDto[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
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

// Update user role (Admin only)
export const updateUserRole = async (userId: string, role: string): Promise<{ success: boolean; message: string; user: AdminUser }> => {
  try {
    const token = tokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Update role failed:', error);
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

    console.log('Making getAllUsers API call with URL:', `${API_BASE_URL}/admin/dashboard/users?${params.toString()}`);
    console.log('Using token:', token?.substring(0, 20) + '...');
    
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/users?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('getAllUsers response status:', response.status, response.statusText);
    console.log('getAllUsers response headers:', Object.fromEntries(response.headers.entries()));

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

    console.log('Making dashboard summary API call...');
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Dashboard summary response status:', response.status);
    const result = await handleAPIResponse(response);
    console.log('Dashboard summary data:', result);
    return result;
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

// ==================== COUPON MANAGEMENT ====================

// Get all coupons (Admin only)
export const getAllCoupons = async (
  page = 0, 
  size = 10, 
  search?: string, 
  activeOnly = false
): Promise<CouponsResponse> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      activeOnly: activeOnly.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/admin/coupons?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get coupons:', error);
    throw error;
  }
};

// Get coupon by ID (Admin only)
export const getCouponById = async (id: string): Promise<CouponDto> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/coupons/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get coupon:', error);
    throw error;
  }
};

// Create coupon (Admin only)
export const createCoupon = async (couponData: Omit<CouponDto, 'id' | 'currentUsage'>): Promise<CouponDto> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(couponData),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to create coupon:', error);
    throw error;
  }
};

// Update coupon (Admin only)
export const updateCoupon = async (id: string, couponData: Omit<CouponDto, 'id' | 'currentUsage'>): Promise<CouponDto> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/coupons/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(couponData),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to update coupon:', error);
    throw error;
  }
};

// Delete coupon (Admin only)
export const deleteCoupon = async (id: string): Promise<void> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/coupons/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete coupon');
    }
  } catch (error) {
    console.error('Failed to delete coupon:', error);
    throw error;
  }
};