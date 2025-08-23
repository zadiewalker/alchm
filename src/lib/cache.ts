// Advanced caching strategies for ALCHM
'use client';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  version: string;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  version?: string; // Cache version for invalidation
  persistent?: boolean; // Use localStorage for persistence
  compression?: boolean; // Compress large data
}

class CacheManager {
  private memoryCache = new Map<string, CacheItem<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
  private readonly maxMemoryItems = 100;

  // Set cache item
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const {
      ttl = this.defaultTTL,
      version = '1.0',
      persistent = false,
      compression = false
    } = options;

    const item: CacheItem<T> = {
      data: compression ? this.compress(data) : data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      version
    };

    // Memory cache
    this.memoryCache.set(key, item);
    this.cleanupMemoryCache();

    // Persistent cache
    if (persistent && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`alchm:cache:${key}`, JSON.stringify(item));
      } catch (error) {
        console.warn('[Cache] Failed to persist cache item:', error);
      }
    }
  }

  // Get cache item
  get<T>(key: string, options: { version?: string } = {}): T | null {
    const { version } = options;

    // Try memory cache first
    let item = this.memoryCache.get(key);

    // Try persistent cache if not in memory
    if (!item && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`alchm:cache:${key}`);
        if (stored) {
          item = JSON.parse(stored);
          // Restore to memory cache
          if (item) {
            this.memoryCache.set(key, item);
          }
        }
      } catch (error) {
        console.warn('[Cache] Failed to read persistent cache:', error);
      }
    }

    if (!item) return null;

    // Check expiration
    if (Date.now() > item.expiresAt) {
      this.delete(key);
      return null;
    }

    // Check version
    if (version && item.version !== version) {
      this.delete(key);
      return null;
    }

    return item.data;
  }

  // Delete cache item
  delete(key: string): void {
    this.memoryCache.delete(key);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`alchm:cache:${key}`);
      } catch (error) {
        console.warn('[Cache] Failed to delete persistent cache:', error);
      }
    }
  }

  // Clear all cache
  clear(): void {
    this.memoryCache.clear();
    
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('alchm:cache:')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('[Cache] Failed to clear persistent cache:', error);
      }
    }
  }

  // Get cache statistics
  getStats(): {
    memoryItems: number;
    memorySize: number;
    persistentItems: number;
  } {
    let persistentItems = 0;
    
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage);
        persistentItems = keys.filter(key => key.startsWith('alchm:cache:')).length;
      } catch (error) {
        // Ignore errors
      }
    }

    return {
      memoryItems: this.memoryCache.size,
      memorySize: this.estimateMemorySize(),
      persistentItems
    };
  }

  // Cleanup memory cache when it gets too large
  private cleanupMemoryCache(): void {
    if (this.memoryCache.size <= this.maxMemoryItems) return;

    // Remove oldest items
    const entries = Array.from(this.memoryCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, entries.length - this.maxMemoryItems + 10);
    toRemove.forEach(([key]) => this.memoryCache.delete(key));
  }

  // Estimate memory usage
  private estimateMemorySize(): number {
    let size = 0;
    this.memoryCache.forEach((item) => {
      size += JSON.stringify(item).length;
    });
    return size;
  }

  // Simple compression for large objects
  private compress<T>(data: T): T {
    // In a real implementation, you might use a compression library
    // For now, just return as-is
    return data;
  }
}

// Create singleton instance
export const cacheManager = new CacheManager();

// Specific cache utilities for ALCHM

// Journal cache
export const journalCache = {
  setJournals: (userId: string, journals: any[]) => {
    cacheManager.set(`journals:${userId}`, journals, {
      ttl: 10 * 60 * 1000, // 10 minutes
      persistent: true,
      version: '1.0'
    });
  },

  getJournals: (userId: string) => {
    return cacheManager.get(`journals:${userId}`, { version: '1.0' });
  },

  invalidateJournals: (userId: string) => {
    cacheManager.delete(`journals:${userId}`);
  },

  setJournalEntry: (entryId: string, entry: any) => {
    cacheManager.set(`journal_entry:${entryId}`, entry, {
      ttl: 30 * 60 * 1000, // 30 minutes
      persistent: true,
      version: '1.0'
    });
  },

  getJournalEntry: (entryId: string) => {
    return cacheManager.get(`journal_entry:${entryId}`, { version: '1.0' });
  }
};

// AI analysis cache
export const aiCache = {
  setAnalysis: (entryId: string, analysis: any) => {
    cacheManager.set(`ai_analysis:${entryId}`, analysis, {
      ttl: 60 * 60 * 1000, // 1 hour
      persistent: true,
      version: '1.0'
    });
  },

  getAnalysis: (entryId: string) => {
    return cacheManager.get(`ai_analysis:${entryId}`, { version: '1.0' });
  },

  setReflectionPrompts: (userId: string, prompts: string[]) => {
    cacheManager.set(`reflection_prompts:${userId}`, prompts, {
      ttl: 24 * 60 * 60 * 1000, // 24 hours
      persistent: true,
      version: '1.0'
    });
  },

  getReflectionPrompts: (userId: string) => {
    return cacheManager.get(`reflection_prompts:${userId}`, { version: '1.0' });
  }
};

// User preferences cache
export const userCache = {
  setPreferences: (userId: string, preferences: any) => {
    cacheManager.set(`user_prefs:${userId}`, preferences, {
      ttl: 24 * 60 * 60 * 1000, // 24 hours
      persistent: true,
      version: '1.0'
    });
  },

  getPreferences: (userId: string) => {
    return cacheManager.get(`user_prefs:${userId}`, { version: '1.0' });
  },

  setTheme: (userId: string, theme: 'light' | 'dark') => {
    cacheManager.set(`theme:${userId}`, theme, {
      ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
      persistent: true,
      version: '1.0'
    });
  },

  getTheme: (userId: string) => {
    return cacheManager.get(`theme:${userId}`, { version: '1.0' });
  }
};

// API response cache with automatic invalidation
export class APICache {
  private pendingRequests = new Map<string, Promise<any>>();

  async cachedFetch<T>(
    url: string,
    options: RequestInit = {},
    cacheOptions: CacheOptions = {}
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(url, options);
    
    // Check cache first
    const cached = cacheManager.get<T>(cacheKey, { version: cacheOptions.version });
    if (cached) {
      return cached;
    }

    // Prevent duplicate requests
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Make request
    const promise = this.makeRequest<T>(url, options);
    this.pendingRequests.set(cacheKey, promise);

    try {
      const result = await promise;
      
      // Cache successful responses
      cacheManager.set(cacheKey, result, cacheOptions);
      
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  private async makeRequest<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  private generateCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `api:${method}:${url}:${this.hashString(body)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  invalidatePattern(pattern: string): void {
    // Invalidate cache entries matching a pattern
    const keys = Array.from(cacheManager['memoryCache'].keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        cacheManager.delete(key);
      }
    });
  }
}

// Export API cache instance
export const apiCache = new APICache();

// Cache warmup strategies
export const cacheWarmup = {
  // Preload critical data
  async preloadCriticalData(userId: string): Promise<void> {
    try {
      // Preload recent journals
      await apiCache.cachedFetch(`/api/journals?userId=${userId}&limit=10`, {}, {
        ttl: 10 * 60 * 1000,
        persistent: true
      });

      // Preload user preferences
      await apiCache.cachedFetch(`/api/users/${userId}/preferences`, {}, {
        ttl: 24 * 60 * 60 * 1000,
        persistent: true
      });
    } catch (error) {
      console.warn('[Cache] Warmup failed:', error);
    }
  },

  // Background refresh of expiring cache items
  async backgroundRefresh(userId: string): Promise<void> {
    // This would run periodically to refresh cache items before they expire
    console.log('[Cache] Background refresh for user:', userId);
  }
};

// React hook for cache management
export function useCache() {
  return {
    set: cacheManager.set.bind(cacheManager),
    get: cacheManager.get.bind(cacheManager),
    delete: cacheManager.delete.bind(cacheManager),
    clear: cacheManager.clear.bind(cacheManager),
    stats: cacheManager.getStats(),
    warmup: cacheWarmup.preloadCriticalData,
    journalCache,
    aiCache,
    userCache,
    apiCache: apiCache.cachedFetch.bind(apiCache)
  };
}