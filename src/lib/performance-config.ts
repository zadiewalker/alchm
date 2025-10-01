// Performance optimization configuration for ALCHM
// This file centralizes all performance-related settings and utilities

export const PERFORMANCE_CONFIG = {
  // Bundle size targets (in KB)
  BUNDLE_SIZE_TARGETS: {
    MAIN_BUNDLE: 150, // Main app bundle
    FIREBASE_BUNDLE: 200, // Firebase chunk
    VENDOR_BUNDLE: 300, // Third-party libraries
    TOTAL_JS: 800, // Total JavaScript
  },
  
  // Code splitting thresholds
  CODE_SPLITTING: {
    MIN_CHUNK_SIZE: 20, // Minimum chunk size in KB
    MAX_CHUNK_SIZE: 244, // Maximum chunk size in KB
    SHARED_MIN_USAGE: 2, // Minimum usage count for shared chunks
  },
  
  // Lazy loading priorities
  LAZY_LOADING: {
    ABOVE_FOLD: ['auth', 'navigation'], // Critical, load immediately
    BELOW_FOLD: ['dashboard', 'analytics'], // Load when needed
    ON_DEMAND: ['export', 'settings', 'admin'], // Load only when accessed
  },
  
  // Cache strategies
  CACHE_DURATIONS: {
    STATIC_ASSETS: 31536000, // 1 year for immutable assets
    API_RESPONSES: 300, // 5 minutes for API responses
    USER_DATA: 3600, // 1 hour for user-specific data
  }
};

// Dynamic import wrapper with error handling
export async function dynamicImport<T>(
  importFn: () => Promise<T>,
  fallback?: () => T,
  timeout = 10000
): Promise<T> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Import timeout')), timeout)
    );
    
    return await Promise.race([importFn(), timeoutPromise]);
  } catch (error) {
    console.warn('Dynamic import failed:', error);
    if (fallback) {
      return fallback();
    }
    throw error;
  }
}

// Performance monitoring utilities
export function measureBundleLoad(bundleName: string) {
  const startTime = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - startTime;
      console.log(`📦 Bundle '${bundleName}' loaded in ${duration.toFixed(2)}ms`);
      
      // Log to analytics if available
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'bundle_load_time', {
          bundle_name: bundleName,
          load_time: Math.round(duration)
        });
      }
      
      return duration;
    }
  };
}

// Memory usage tracking
export function trackMemoryUsage(operation: string) {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return { end: () => {} };
  }
  
  const startMemory = (performance as any).memory.usedJSHeapSize;
  
  return {
    end: () => {
      const endMemory = (performance as any).memory.usedJSHeapSize;
      const memoryUsed = endMemory - startMemory;
      
      console.log(`🧠 Operation '${operation}' used ${(memoryUsed / 1024 / 1024).toFixed(2)}MB`);
      
      return memoryUsed;
    }
  };
}

// Optimize re-renders with intelligent memoization
export function shouldComponentUpdate<T extends Record<string, any>>(
  prevProps: T, 
  nextProps: T, 
  keys?: (keyof T)[]
): boolean {
  const keysToCheck = keys || Object.keys(nextProps) as (keyof T)[];
  
  return keysToCheck.some(key => {
    const prev = prevProps[key];
    const next = nextProps[key];
    
    // Handle objects and arrays
    if (typeof prev === 'object' && typeof next === 'object') {
      return JSON.stringify(prev) !== JSON.stringify(next);
    }
    
    return prev !== next;
  });
}

// Debounced action wrapper for heavy operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttled action wrapper for frequent events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}