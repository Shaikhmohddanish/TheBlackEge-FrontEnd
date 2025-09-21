import type { Product } from '@/lib/api/products';

/**
 * Generate a product URL using the slug if available, otherwise fall back to ID
 * @param product - The product object
 * @returns The product URL path
 */
export function getProductUrl(product: Product): string {
  if (product.slug) {
    return `/products/${product.slug}`;
  }
  return `/product/${product.id}`;
}

/**
 * Generate a product URL using the slug if available, otherwise fall back to ID
 * @param product - The product object
 * @returns The product URL path
 */
export function getProductUrlFromSlug(slug: string): string {
  return `/products/${slug}`;
}

/**
 * Generate a product URL using the ID
 * @param productId - The product ID
 * @returns The product URL path
 */
export function getProductUrlFromId(productId: string): string {
  return `/product/${productId}`;
}

/**
 * Extract slug from a product URL
 * @param url - The product URL
 * @returns The slug or null if not found
 */
export function extractSlugFromUrl(url: string): string | null {
  const match = url.match(/\/products\/([^\/]+)/);
  return match ? match[1] : null;
}

/**
 * Check if a URL is a slug-based product URL
 * @param url - The URL to check
 * @returns True if it's a slug-based product URL
 */
export function isSlugBasedProductUrl(url: string): boolean {
  return url.startsWith('/products/');
}

/**
 * Generate a slug from a product name
 * @param name - The product name
 * @returns A URL-friendly slug
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}
