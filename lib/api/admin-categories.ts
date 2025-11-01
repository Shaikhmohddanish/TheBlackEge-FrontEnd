import { makeAuthenticatedRequest, handleAPIResponse, API_BASE_URL } from '@/lib/api-client';

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  parentName?: string;
  isActive: boolean;
  sortOrder?: number;
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CategoriesResponse {
  categories: Category[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Get all categories with pagination
export const getAdminCategories = async (
  page: number = 0, 
  size: number = 20, 
  sortBy: string = 'sortOrder', 
  sortDir: string = 'asc'
): Promise<CategoriesResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });

    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/categories?${params.toString()}`,
      { method: 'GET' }
    );

    return await handleAPIResponse(response) as CategoriesResponse;
  } catch (error) {
    throw error;
  }
};

// Get all active categories (for product form dropdown)
export const getActiveCategories = async (): Promise<Category[]> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/categories/active`,
      { method: 'GET' }
    );

    return await handleAPIResponse(response) as Category[];
  } catch (error) {
    throw error;
  }
};

// Get category hierarchy (for tree view)
export const getCategoryHierarchy = async (): Promise<Category[]> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/categories/hierarchy`,
      { method: 'GET' }
    );

    return await handleAPIResponse(response) as Category[];
  } catch (error) {
    throw error;
  }
};

// Create new category
export const createCategory = async (categoryData: CategoryFormData): Promise<Category> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/categories`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      }
    );

    return await handleAPIResponse(response) as Category;
  } catch (error) {
    throw error;
  }
};

// Update category
export const updateCategory = async (id: string, categoryData: CategoryFormData): Promise<Category> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/categories/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      }
    );

    return await handleAPIResponse(response) as Category;
  } catch (error) {
    throw error;
  }
};

// Delete category
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/categories/${id}`,
      { method: 'DELETE' }
    );

    await handleAPIResponse(response);
  } catch (error) {
    throw error;
  }
};

// Toggle category status
export const toggleCategoryStatus = async (id: string, isActive: boolean): Promise<Category> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/categories/${id}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      }
    );

    return await handleAPIResponse(response) as Category;
  } catch (error) {
    throw error;
  }
};

// Bulk delete categories
export const bulkDeleteCategories = async (categoryIds: string[]): Promise<void> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/categories/bulk/delete`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryIds }),
      }
    );

    await handleAPIResponse(response);
  } catch (error) {
    throw error;
  }
};

// Update category sort order
export const updateCategorySortOrder = async (updates: { id: string; sortOrder: number }[]): Promise<void> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/categories/bulk/sort-order`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      }
    );

    await handleAPIResponse(response);
  } catch (error) {
    throw error;
  }
};

// Search categories
export const searchCategories = async (
  query: string, 
  page: number = 0, 
  size: number = 20
): Promise<CategoriesResponse> => {
  try {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      size: size.toString()
    });

    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/categories/search?${params.toString()}`,
      { method: 'GET' }
    );

    return await handleAPIResponse(response) as CategoriesResponse;
  } catch (error) {
    throw error;
  }
};

// Validate category data
export const validateCategoryData = (data: CategoryFormData): string[] => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Category name must be at least 2 characters long');
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Category name cannot exceed 100 characters');
  }
  
  if (data.description && data.description.length > 500) {
    errors.push('Category description cannot exceed 500 characters');
  }
  
  if (data.seoTitle && data.seoTitle.length > 60) {
    errors.push('SEO title should not exceed 60 characters');
  }
  
  if (data.seoDescription && data.seoDescription.length > 160) {
    errors.push('SEO description should not exceed 160 characters');
  }
  
  return errors;
};

// Upload category image
export const uploadCategoryImage = async (categoryId: string, file: File): Promise<Category> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/categories/${categoryId}/image`,
      {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let the browser set it for FormData
        headers: {}
      }
    );

    return await handleAPIResponse(response) as Category;
  } catch (error) {
    throw error;
  }
};

// Delete category image
export const deleteCategoryImage = async (categoryId: string): Promise<void> => {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/categories/${categoryId}/image`,
      { method: 'DELETE' }
    );

    await handleAPIResponse(response);
  } catch (error) {
    throw error;
  }
};