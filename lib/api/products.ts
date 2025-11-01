// Product API functions
import { API_BASE_URL, handleAPIResponse, makeAuthenticatedRequest, apiCache } from '../api-client';

// Transform backend product data to frontend format
const transformProduct = (backendProduct: any): Product => {
  return {
    id: backendProduct.id?.toString() || '',
    name: backendProduct.name || '',
    slug: backendProduct.slug || '',
    description: backendProduct.description || '',
    price: backendProduct.price || 0,
    stockQuantity: backendProduct.stockQuantity || 0,
    inventory: backendProduct.stockQuantity || 0,
    inStock: (backendProduct.stockQuantity || 0) > 0,
    imageUrl: backendProduct.imageUrl,
    variants: backendProduct.variants || [],
    media: backendProduct.media?.map((m: any) => ({
      ...m,
      url: m.filePath || m.url,
    })) || [],
    categories: Array.isArray(backendProduct.categories) ? Array.from(backendProduct.categories) : [],
    category: Array.isArray(backendProduct.categories) && backendProduct.categories.length > 0 
      ? backendProduct.categories[0].toString() 
      : '',
    createdAt: backendProduct.createdAt,
    createdBy: backendProduct.createdBy,
    updatedAt: backendProduct.updatedAt,
    updatedBy: backendProduct.updatedBy,
  };
};

export interface Product {
  id: string;
  name: string;
  slug?: string; // SEO-friendly URL slug
  description: string;
  price: number;
  stockQuantity?: number;
  imageUrl?: string; // For backward compatibility
  variants?: ProductVariant[];
  media?: ProductMedia[];
  categories?: string[];
  category?: string; // Derived from categories
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  salePrice?: number; // Derived from variants or promotions
  inventory?: number; // Derived from stockQuantity
  inStock?: boolean; // Computed property
}

export interface ProductVariant {
  id?: string;
  size?: string;
  color?: string;
  stockQuantity?: number;
  additionalPrice?: number;
  skuCode?: string;
  productId?: string;
}

export interface ProductMedia {
  id?: string;
  filePath?: string;
  url?: string; // Computed from filePath
  mediaType?: 'IMAGE' | 'VIDEO';
  altText?: string;
  title?: string;
  displayOrder?: number;
}

export interface ProductFilter {
  keyword?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  size?: number;
}

export interface ProductsResponse {
  products: Product[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categories?: string[];
  variants?: ProductVariant[];
}

// Get All Products (Paginated)
export const getProducts = async (
  page = 0,
  size = 10,
  sort = 'name',
  direction: 'asc' | 'desc' = 'asc'
): Promise<ProductsResponse> => {
  try {
    const cacheKey = `products_${page}_${size}_${sort}_${direction}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const url = `${API_BASE_URL}/products?paginated=true&page=${page}&size=${size}&sortBy=${sort}&sortDir=${direction}`;
    
    // Add timeout to prevent long waits when backend is down
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(url, { 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      const data = await handleAPIResponse(response);

      const result = {
        products: (data.content || []).map(transformProduct),
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
        currentPage: data.number || 0,
        size: data.size || 0,
      };

      apiCache.set(cacheKey, result);
      return result;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // If backend is not running, return empty result instead of throwing
      if (
        typeof fetchError === 'object' && 
        fetchError !== null && 
        (
          (('name' in fetchError) && (fetchError as Error).name === 'AbortError') ||
          (('message' in fetchError) && typeof (fetchError as Error).message === 'string' && 
           (fetchError as Error).message.includes('fetch'))
        )
      ) {
        return {
          products: [],
          totalPages: 0,
          totalElements: 0,
          currentPage: 0,
          size: 0,
        };
      }
      throw fetchError;
    }
  } catch (error) {
    // Return empty results for any error to avoid breaking the UI
    return {
      products: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: 0,
      size: 0,
    };
  }
};

// Get Single Product
export const getProduct = async (productId: string): Promise<Product> => {
  try {
    const cacheKey = `product_${productId}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    const product = await handleAPIResponse(response);

    const transformedProduct = transformProduct(product);
    apiCache.set(cacheKey, transformedProduct);
    return transformedProduct;
  } catch (error) {
    throw error;
  }
};

// Get Product by Slug
export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const cacheKey = `product_slug_${slug}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`);
    const product = await handleAPIResponse(response);

    const transformedProduct = transformProduct(product);
    apiCache.set(cacheKey, transformedProduct);
    return transformedProduct;
  } catch (error) {
    throw error;
  }
};

// Search Products
export const searchProducts = async (
  keyword: string,
  page = 0,
  size = 10
): Promise<ProductsResponse> => {
  try {
    const url = `${API_BASE_URL}/products/search?keyword=${encodeURIComponent(
      keyword
    )}&paginated=true&page=${page}&size=${size}`;
    const response = await fetch(url);
    const data = await handleAPIResponse(response);

    return {
      products: (data.content || []).map(transformProduct),
      totalPages: data.totalPages || 0,
      totalElements: data.totalElements || 0,
      currentPage: data.number || 0,
      size: data.size || 0,
    };
  } catch (error) {
    throw error;
  }
};

// Filter Products
export const filterProducts = async (filters: ProductFilter): Promise<ProductsResponse> => {
  try {
    const params = new URLSearchParams();

    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.categories?.length) {
      filters.categories.forEach(cat => params.append('categories', cat));
    }
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());

    params.append('page', (filters.page || 0).toString());
    params.append('size', (filters.size || 10).toString());

    const url = `${API_BASE_URL}/products/filter?${params.toString()}`;
    const response = await fetch(url);
    const data = await handleAPIResponse(response);

    return {
      products: (data.content || []).map(transformProduct),
      totalPages: data.totalPages || 0,
      totalElements: data.totalElements || 0,
      currentPage: data.number || 0,
      size: data.size || 0,
    };
  } catch (error) {
    throw error;
  }
};

// Get Products by Category
export const getProductsByCategory = async (
  category: string,
  page = 0,
  size = 10
): Promise<ProductsResponse> => {
  try {
    const url = `${API_BASE_URL}/products/category/${encodeURIComponent(
      category
    )}?paginated=true&page=${page}&size=${size}`;
    const response = await fetch(url);
    const data = await handleAPIResponse(response);

    return {
      products: (data.content || []).map(transformProduct),
      totalPages: data.totalPages || 0,
      totalElements: data.totalElements || 0,
      currentPage: data.number || 0,
      size: data.size || 0,
    };
  } catch (error) {
    throw error;
  }
};

// Get All Categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const cacheKey = 'categories';
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${API_BASE_URL}/products/categories`);
    const categories = await handleAPIResponse(response);

    apiCache.set(cacheKey, categories, 600000); // Cache for 10 minutes
    return categories;
  } catch (error) {
    throw error;
  }
};

// Create Product (Admin Only)
export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });

    const product = await handleAPIResponse(response);
    
    // Clear products cache
    apiCache.clear();
    
    return product;
  } catch (error) {
    throw error;
  }
};

// Update Product (Admin Only)
export const updateProduct = async (
  productId: string,
  productData: Partial<CreateProductData>
): Promise<Product> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });

    const product = await handleAPIResponse(response);
    
    // Clear cache for this product and products list
    apiCache.delete(`product_${productId}`);
    apiCache.clear();
    
    return product;
  } catch (error) {
    throw error;
  }
};

// Delete Product (Admin Only)
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });

    await handleAPIResponse(response);
    
    // Clear cache
    apiCache.delete(`product_${productId}`);
    apiCache.clear();
  } catch (error) {
    throw error;
  }
};

// Upload Product Media
export const uploadProductMedia = async (
  productId: string,
  file: File,
  altText = '',
  title = '',
  displayOrder = 0
): Promise<ProductMedia> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', altText);
    formData.append('title', title);
    formData.append('displayOrder', displayOrder.toString());

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/products/${productId}/media`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const media = await handleAPIResponse(response);
    
    // Clear product cache
    apiCache.delete(`product_${productId}`);
    
    return media;
  } catch (error) {
    throw error;
  }
};

// Upload with Progress
export const uploadProductMediaWithProgress = (
  productId: string,
  file: File,
  onProgress: (percent: number) => void,
  altText = '',
  title = '',
  displayOrder = 0
): Promise<ProductMedia> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', altText);
    formData.append('title', title);
    formData.append('displayOrder', displayOrder.toString());

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200 || xhr.status === 201) {
        const media = JSON.parse(xhr.responseText);
        apiCache.delete(`product_${productId}`);
        resolve(media);
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    const token = localStorage.getItem('token');
    xhr.open('POST', `${API_BASE_URL}/products/${productId}/media`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
};
