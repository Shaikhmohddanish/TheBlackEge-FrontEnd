/**
 * Browser Storage Service - Multi-tier caching strategy
 * Uses IndexedDB, localStorage, and sessionStorage efficiently
 */

// Storage types
export type StorageType = 'indexeddb' | 'localStorage' | 'sessionStorage';

// Cache entry with metadata
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  version: string;
  tags?: string[];
}

// Storage configuration
export interface StorageConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  version: string;
  compression?: boolean;
}

// Default configurations
const DEFAULT_CONFIGS: Record<StorageType, StorageConfig> = {
  indexeddb: {
    maxSize: 50 * 1024 * 1024, // 50MB
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    version: '1.0.0',
    compression: true
  },
  localStorage: {
    maxSize: 5 * 1024 * 1024, // 5MB
    ttl: 2 * 60 * 60 * 1000, // 2 hours
    version: '1.0.0',
    compression: false
  },
  sessionStorage: {
    maxSize: 10 * 1024 * 1024, // 10MB
    ttl: 30 * 60 * 1000, // 30 minutes
    version: '1.0.0',
    compression: false
  }
};

/**
 * Browser Storage Service
 */
export class BrowserStorageService {
  private db: IDBDatabase | null = null;
  private configs: Record<StorageType, StorageConfig>;

  constructor(configs?: Partial<Record<StorageType, Partial<StorageConfig>>>) {
    this.configs = { ...DEFAULT_CONFIGS };
    if (configs) {
      Object.keys(configs).forEach(key => {
        if (configs[key as StorageType]) {
          this.configs[key as StorageType] = {
            ...this.configs[key as StorageType],
            ...configs[key as StorageType]
          };
        }
      });
    }
  }

  /**
   * Initialize IndexedDB
   */
  async initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BlackegeCache', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores for different data types
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('wishlist')) {
          db.createObjectStore('wishlist', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('cart')) {
          db.createObjectStore('cart', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('search')) {
          db.createObjectStore('search', { keyPath: 'query' });
        }
        if (!db.objectStoreNames.contains('analytics')) {
          db.createObjectStore('analytics', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Set data in storage
   */
  async set<T>(
    key: string, 
    data: T, 
    storageType: StorageType = 'indexeddb',
    tags?: string[]
  ): Promise<void> {
    const config = this.configs[storageType];
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + config.ttl,
      version: config.version,
      tags
    };

    switch (storageType) {
      case 'indexeddb':
        await this.setIndexedDB(key, entry);
        break;
      case 'localStorage':
        this.setLocalStorage(key, entry);
        break;
      case 'sessionStorage':
        this.setSessionStorage(key, entry);
        break;
    }
  }

  /**
   * Get data from storage
   */
  async get<T>(key: string, storageType: StorageType = 'indexeddb'): Promise<T | null> {
    let entry: CacheEntry<T> | null = null;

    switch (storageType) {
      case 'indexeddb':
        entry = await this.getIndexedDB<T>(key);
        break;
      case 'localStorage':
        entry = this.getLocalStorage<T>(key);
        break;
      case 'sessionStorage':
        entry = this.getSessionStorage<T>(key);
        break;
    }

    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      await this.delete(key, storageType);
      return null;
    }

    return entry.data;
  }

  /**
   * Delete data from storage
   */
  async delete(key: string, storageType: StorageType = 'indexeddb'): Promise<void> {
    switch (storageType) {
      case 'indexeddb':
        await this.deleteIndexedDB(key);
        break;
      case 'localStorage':
        localStorage.removeItem(key);
        break;
      case 'sessionStorage':
        sessionStorage.removeItem(key);
        break;
    }
  }

  /**
   * Clear all data from storage
   */
  async clear(storageType: StorageType = 'indexeddb'): Promise<void> {
    switch (storageType) {
      case 'indexeddb':
        await this.clearIndexedDB();
        break;
      case 'localStorage':
        localStorage.clear();
        break;
      case 'sessionStorage':
        sessionStorage.clear();
        break;
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<Record<StorageType, { used: number; available: number; percentage: number }>> {
    const stats: Record<StorageType, { used: number; available: number; percentage: number }> = {} as any;

    for (const type of ['indexeddb', 'localStorage', 'sessionStorage'] as StorageType[]) {
      const config = this.configs[type];
      let used = 0;

      if (type === 'indexeddb') {
        used = await this.getIndexedDBUsage();
      } else if (type === 'localStorage') {
        used = this.getLocalStorageUsage();
      } else {
        used = this.getSessionStorageUsage();
      }

      stats[type] = {
        used,
        available: config.maxSize,
        percentage: (used / config.maxSize) * 100
      };
    }

    return stats;
  }

  /**
   * Clean expired entries
   */
  async cleanExpired(storageType: StorageType = 'indexeddb'): Promise<number> {
    let cleaned = 0;

    switch (storageType) {
      case 'indexeddb':
        cleaned = await this.cleanExpiredIndexedDB();
        break;
      case 'localStorage':
        cleaned = this.cleanExpiredLocalStorage();
        break;
      case 'sessionStorage':
        cleaned = this.cleanExpiredSessionStorage();
        break;
    }

    return cleaned;
  }

  // IndexedDB methods
  private async setIndexedDB(key: string, entry: CacheEntry): Promise<void> {
    if (!this.db) await this.initIndexedDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['products', 'users', 'wishlist', 'cart', 'search', 'analytics'], 'readwrite');
      const store = transaction.objectStore(this.getStoreName(key));
      const request = store.put({ id: key, ...entry });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getIndexedDB<T>(key: string): Promise<CacheEntry<T> | null> {
    if (!this.db) await this.initIndexedDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.getStoreName(key)], 'readonly');
      const store = transaction.objectStore(this.getStoreName(key));
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? { ...result } : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async deleteIndexedDB(key: string): Promise<void> {
    if (!this.db) await this.initIndexedDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.getStoreName(key)], 'readwrite');
      const store = transaction.objectStore(this.getStoreName(key));
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async clearIndexedDB(): Promise<void> {
    if (!this.db) await this.initIndexedDB();
    
    const stores = ['products', 'users', 'wishlist', 'cart', 'search', 'analytics'];
    const promises = stores.map(storeName => {
      return new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
    
    await Promise.all(promises);
  }

  private async getIndexedDBUsage(): Promise<number> {
    // Estimate IndexedDB usage (simplified)
    return new Promise((resolve) => {
      if (!this.db) {
        resolve(0);
        return;
      }
      
      let totalSize = 0;
      const stores = ['products', 'users', 'wishlist', 'cart', 'search', 'analytics'];
      let completed = 0;
      
      stores.forEach(storeName => {
        const transaction = this.db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => {
          const data = request.result;
          totalSize += JSON.stringify(data).length;
          completed++;
          
          if (completed === stores.length) {
            resolve(totalSize);
          }
        };
      });
    });
  }

  private async cleanExpiredIndexedDB(): Promise<number> {
    if (!this.db) await this.initIndexedDB();
    
    let cleaned = 0;
    const stores = ['products', 'users', 'wishlist', 'cart', 'search', 'analytics'];
    
    for (const storeName of stores) {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      await new Promise<void>((resolve) => {
        request.onsuccess = () => {
          const data = request.result;
          const now = Date.now();
          
          data.forEach((item: any) => {
            if (item.expiresAt && now > item.expiresAt) {
              store.delete(item.id);
              cleaned++;
            }
          });
          
          resolve();
        };
      });
    }
    
    return cleaned;
  }

  // localStorage methods
  private setLocalStorage(key: string, entry: CacheEntry): void {
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {

      this.cleanExpiredLocalStorage();
      localStorage.setItem(key, JSON.stringify(entry));
    }
  }

  private getLocalStorage<T>(key: string): CacheEntry<T> | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  }

  private getLocalStorageUsage(): number {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        total += localStorage.getItem(key)?.length || 0;
      }
    }
    return total;
  }

  private cleanExpiredLocalStorage(): number {
    let cleaned = 0;
    const now = Date.now();
    
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const entry = JSON.parse(item);
            if (entry.expiresAt && now > entry.expiresAt) {
              localStorage.removeItem(key);
              cleaned++;
            }
          } catch (error) {
            // Remove corrupted entries
            localStorage.removeItem(key);
            cleaned++;
          }
        }
      }
    }
    
    return cleaned;
  }

  // sessionStorage methods
  private setSessionStorage(key: string, entry: CacheEntry): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {

      this.cleanExpiredSessionStorage();
      sessionStorage.setItem(key, JSON.stringify(entry));
    }
  }

  private getSessionStorage<T>(key: string): CacheEntry<T> | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  }

  private getSessionStorageUsage(): number {
    let total = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        total += sessionStorage.getItem(key)?.length || 0;
      }
    }
    return total;
  }

  private cleanExpiredSessionStorage(): number {
    let cleaned = 0;
    const now = Date.now();
    
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key) {
        const item = sessionStorage.getItem(key);
        if (item) {
          try {
            const entry = JSON.parse(item);
            if (entry.expiresAt && now > entry.expiresAt) {
              sessionStorage.removeItem(key);
              cleaned++;
            }
          } catch (error) {
            // Remove corrupted entries
            sessionStorage.removeItem(key);
            cleaned++;
          }
        }
      }
    }
    
    return cleaned;
  }

  // Helper methods
  private getStoreName(key: string): string {
    if (key.startsWith('product')) return 'products';
    if (key.startsWith('user')) return 'users';
    if (key.startsWith('wishlist')) return 'wishlist';
    if (key.startsWith('cart')) return 'cart';
    if (key.startsWith('search')) return 'search';
    if (key.startsWith('analytics')) return 'analytics';
    return 'products'; // default
  }
}

// Export singleton instance
export const browserStorage = new BrowserStorageService();
