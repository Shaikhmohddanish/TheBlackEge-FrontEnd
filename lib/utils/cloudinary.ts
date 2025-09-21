/**
 * Cloudinary utility functions for generating optimized image URLs
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'theblackege';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

/**
 * Generate Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  transformation?: string,
  fallback?: string
): string {
  if (!publicId) {
    return fallback || '/placeholder.jpg';
  }

  const baseUrl = `${BASE_URL}/${transformation || 'f_auto,q_auto'}/${publicId}`;
  return baseUrl;
}

/**
 * Get responsive image URLs for different sizes
 */
export function getResponsiveImageUrls(publicId: string, fallback?: string) {
  if (!publicId) {
    const placeholder = fallback || '/placeholder.jpg';
    return {
      thumbnail: placeholder,
      small: placeholder,
      medium: placeholder,
      large: placeholder,
      original: placeholder,
    };
  }

  return {
    thumbnail: getCloudinaryUrl(publicId, 'w_150,h_150,c_fill,f_auto,q_auto', fallback),
    small: getCloudinaryUrl(publicId, 'w_300,h_300,c_fill,f_auto,q_auto', fallback),
    medium: getCloudinaryUrl(publicId, 'w_600,h_600,c_fill,f_auto,q_auto', fallback),
    large: getCloudinaryUrl(publicId, 'w_1200,h_1200,c_fill,f_auto,q_auto', fallback),
    original: getCloudinaryUrl(publicId, 'f_auto,q_auto', fallback),
  };
}

/**
 * Get product-specific image URLs
 */
export function getProductImageUrls(publicId: string, fallback?: string) {
  if (!publicId) {
    const placeholder = fallback || '/placeholder.jpg';
    return {
      thumbnail: placeholder,
      card: placeholder,
      detail: placeholder,
      gallery: placeholder,
      zoom: placeholder,
      original: placeholder,
    };
  }

  return {
    thumbnail: getCloudinaryUrl(publicId, 'w_150,h_150,c_fill,f_auto,q_auto', fallback),
    card: getCloudinaryUrl(publicId, 'w_300,h_300,c_fill,f_auto,q_auto', fallback),
    detail: getCloudinaryUrl(publicId, 'w_600,h_600,c_fill,f_auto,q_auto', fallback),
    gallery: getCloudinaryUrl(publicId, 'w_800,h_800,c_fill,f_auto,q_auto', fallback),
    zoom: getCloudinaryUrl(publicId, 'w_1200,h_1200,c_fill,f_auto,q_auto', fallback),
    original: getCloudinaryUrl(publicId, 'f_auto,q_auto', fallback),
  };
}

/**
 * Get user avatar URLs
 */
export function getUserImageUrls(publicId: string, fallback?: string) {
  if (!publicId) {
    const placeholder = fallback || '/default-avatar.jpg';
    return {
      thumbnail: placeholder,
      small: placeholder,
      medium: placeholder,
      large: placeholder,
      original: placeholder,
    };
  }

  return {
    thumbnail: getCloudinaryUrl(publicId, 'w_40,h_40,c_fill,f_auto,q_auto', fallback),
    small: getCloudinaryUrl(publicId, 'w_80,h_80,c_fill,f_auto,q_auto', fallback),
    medium: getCloudinaryUrl(publicId, 'w_150,h_150,c_fill,f_auto,q_auto', fallback),
    large: getCloudinaryUrl(publicId, 'w_300,h_300,c_fill,f_auto,q_auto', fallback),
    original: getCloudinaryUrl(publicId, 'f_auto,q_auto', fallback),
  };
}

/**
 * Get optimized image URL for specific use case
 */
export function getOptimizedImageUrl(
  publicId: string,
  width: number,
  height: number,
  quality: 'auto' | 'low' | 'medium' | 'high' = 'auto',
  format: 'auto' | 'webp' | 'jpg' | 'png' = 'auto',
  fallback?: string
): string {
  if (!publicId) {
    return fallback || '/placeholder.jpg';
  }

  const transformation = `w_${width},h_${height},c_fill,f_${format},q_${quality}`;
  return getCloudinaryUrl(publicId, transformation, fallback);
}

/**
 * Get lazy loading image URL (blur placeholder)
 */
export function getLazyImageUrl(publicId: string, fallback?: string): string {
  if (!publicId) {
    return fallback || '/placeholder.jpg';
  }

  return getCloudinaryUrl(publicId, 'w_20,h_20,c_fill,f_auto,q_low,blur_100', fallback);
}

/**
 * Get high-quality image URL for zoom/lightbox
 */
export function getZoomImageUrl(publicId: string, fallback?: string): string {
  if (!publicId) {
    return fallback || '/placeholder.jpg';
  }

  return getCloudinaryUrl(publicId, 'w_2000,h_2000,c_fill,f_auto,q_high', fallback);
}

/**
 * Check if a string is a Cloudinary public ID
 */
export function isCloudinaryPublicId(str: string): boolean {
  if (!str) return false;
  
  // Cloudinary public IDs typically don't contain slashes or special characters
  // and are usually in the format: folder/filename or just filename
  return !str.startsWith('http') && !str.includes('://');
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) {
    return null;
  }

  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
      return null;
    }

    // Get the part after the transformation parameters
    const publicIdPart = urlParts[uploadIndex + 2];
    return publicIdPart.split('.')[0]; // Remove file extension
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
}
