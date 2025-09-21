import { makeAuthenticatedRequest, handleAPIResponse, API_BASE_URL } from '@/lib/api-client';

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categories: string[];
  stockQuantity: number;
  brand?: string;
  colors?: string[];
  sizes?: string[];
  sku: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  careInstructions?: string;
  isActive: boolean;
  isFeatured?: boolean;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  images?: string[];
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  categories: string[];
  stockQuantity: number;
  brand?: string;
  colors?: string[];
  sizes?: string[];
  sku: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  careInstructions?: string;
  isActive: boolean;
  isFeatured?: boolean;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ProductsResponse {
  products: AdminProduct[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Admin Product Management API Client
 */

// Create a new product
export const createProduct = async (productData: ProductFormData): Promise<AdminProduct> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (id: string, productData: ProductFormData): Promise<AdminProduct> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
};

// Get product by ID for editing
export const getProductById = async (id: string): Promise<AdminProduct> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/products/${id}`);
    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw error;
  }
};

// Get all products with pagination (for admin)
export const getAdminProducts = async (
  page = 0,
  size = 10,
  sortBy = 'id',
  sortDir = 'desc'
): Promise<ProductsResponse> => {
  try {
    const params = new URLSearchParams({
      paginated: 'true',
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/products?${params.toString()}`);
    const data = await handleAPIResponse(response);

    return {
      products: data.content || [],
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      currentPage: data.number || 0,
      pageSize: data.size || size,
    };
  } catch (error) {
    console.error('Failed to fetch admin products:', error);
    throw error;
  }
};

// Search products (for admin)
export const searchAdminProducts = async (
  keyword: string,
  page = 0,
  size = 10,
  sortBy = 'id',
  sortDir = 'desc'
): Promise<ProductsResponse> => {
  try {
    const params = new URLSearchParams({
      keyword,
      paginated: 'true',
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/products/search?${params.toString()}`);
    const data = await handleAPIResponse(response);

    return {
      products: data.content || [],
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      currentPage: data.number || 0,
      pageSize: data.size || size,
    };
  } catch (error) {
    console.error('Failed to search admin products:', error);
    throw error;
  }
};

// Toggle product active status
export const toggleProductStatus = async (id: string, isActive: boolean): Promise<AdminProduct> => {
  try {
    const product = await getProductById(id);
    return await updateProduct(id, { ...product, isActive });
  } catch (error) {
    console.error('Failed to toggle product status:', error);
    throw error;
  }
};

// Bulk operations
export const bulkDeleteProducts = async (productIds: string[]): Promise<void> => {
  try {
    const deletePromises = productIds.map(id => deleteProduct(id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Failed to bulk delete products:', error);
    throw error;
  }
};

export const bulkUpdateProductStatus = async (productIds: string[], isActive: boolean): Promise<void> => {
  try {
    const updatePromises = productIds.map(id => toggleProductStatus(id, isActive));
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Failed to bulk update product status:', error);
    throw error;
  }
};

// Validation helpers
export const validateProductData = (data: Partial<ProductFormData>): string[] => {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Product name is required');
  }

  if (!data.description?.trim()) {
    errors.push('Product description is required');
  }

  if (!data.price || data.price <= 0) {
    errors.push('Valid price is required');
  }

  if (!data.categories || data.categories.length === 0) {
    errors.push('At least one category is required');
  }

  if (!data.stockQuantity || data.stockQuantity < 0) {
    errors.push('Valid stock quantity is required');
  }

  if (!data.sku?.trim()) {
    errors.push('SKU is required');
  }

  return errors;
};
