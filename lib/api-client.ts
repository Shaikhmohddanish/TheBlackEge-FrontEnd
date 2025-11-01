// API Client for The Blackege E-commerce Platform
export const API_BASE_URL = 'http://localhost:8080/api';

// API Error class
export class APIError extends Error {
  constructor(message: string, public status: number, public details?: any) {
    super(message);
    this.name = 'APIError';
  }
}

// Check if code is running in the browser
const isBrowser = typeof window !== 'undefined';

// Token management
export const tokenManager = {
  getToken: () => {
    if (!isBrowser) return null;
    return localStorage.getItem('token');
  },
  setToken: (token: string) => {
    if (!isBrowser) return;
    localStorage.setItem('token', token);
  },
  getRefreshToken: () => {
    if (!isBrowser) return null;
    return localStorage.getItem('refreshToken');
  },
  setRefreshToken: (token: string) => {
    if (!isBrowser) return;
    localStorage.setItem('refreshToken', token);
  },
  getUser: () => {
    if (!isBrowser) return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: any) => {
    if (!isBrowser) return;
    localStorage.setItem('user', JSON.stringify(user));
  },
  clearTokens: () => {
    if (!isBrowser) return;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  isTokenExpired: (token: string): boolean => {
    try {
      if (!token) return true;
      
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      
      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if token has expired (exp is in seconds, Date.now() is in milliseconds)
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return true;
      }
      
      return false;
    } catch (error) {
      return true;
    }
  },
};

// Note: Backend doesn't implement refresh tokens yet
// For now, handle token expiration gracefully
export const refreshToken = async (): Promise<string | null> => {
  // Completely disable refresh token logic for now
  return null;
};

// Authenticated request helper
export const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let token = tokenManager.getToken();

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  };


  if (url.includes('/cart') || url.includes('/wishlist') || url.includes('/admin')) {
    
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
        }
      } catch (e) {
      }
    }
  }

  let response = await fetch(url, requestOptions);

  // If token expired, try to refresh
  if (response.status === 401) {
    // Don't try to refresh or clear tokens - just return the 401 response
    // This prevents the logout loop while keeping the user logged in
    return response;
  }

  return response;
};

// Handle API response
export const handleAPIResponse = async (response: Response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'An unknown error occurred' };
    }

    throw new APIError(
      errorData.message || 'Request failed',
      response.status,
      errorData.details
    );
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Cache implementation
export class APICache {
  private cache = new Map<string, { data: any; expiry: number }>();
  private ttl: number;

  constructor(ttl = 300000) { // 5 minutes default
    this.ttl = ttl;
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key: string, data: any, customTTL?: number): void {
    const expiry = Date.now() + (customTTL || this.ttl);
    this.cache.set(key, { data, expiry });
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const apiCache = new APICache();

// Loading manager
export class LoadingManager {
  private loadingStates = new Map<string, boolean>();
  private listeners: Array<(key: string, isLoading: boolean) => void> = [];

  setLoading(key: string, isLoading: boolean): void {
    this.loadingStates.set(key, isLoading);
    this.notifyListeners(key, isLoading);
  }

  isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false;
  }

  subscribe(callback: (key: string, isLoading: boolean) => void): void {
    this.listeners.push(callback);
  }

  private notifyListeners(key: string, isLoading: boolean): void {
    this.listeners.forEach(callback => callback(key, isLoading));
  }
}

export const loadingManager = new LoadingManager();

// Main API client function
export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: any; status: number }> => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await makeAuthenticatedRequest(url, options);
    const data = await handleAPIResponse(response);
    return { data, status: response.status };
  } catch (error) {
    throw error;
  }
};

// Debounce utility
export const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Pagination helper
export class PaginationHelper {
  public page: number;
  public size: number;
  public totalPages: number = 0;
  public totalElements: number = 0;
  private listeners: Array<(pageInfo: any) => void> = [];

  constructor(initialPage = 0, initialSize = 10) {
    this.page = initialPage;
    this.size = initialSize;
  }

  setPageInfo(pageInfo: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
  }): void {
    this.page = pageInfo.currentPage;
    this.totalPages = pageInfo.totalPages;
    this.totalElements = pageInfo.totalElements;
    this.notifyListeners();
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.notifyListeners();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.notifyListeners();
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.notifyListeners();
    }
  }

  subscribe(callback: (pageInfo: any) => void): void {
    this.listeners.push(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback =>
      callback({
        page: this.page,
        size: this.size,
        totalPages: this.totalPages,
        totalElements: this.totalElements,
      })
    );
  }
}
