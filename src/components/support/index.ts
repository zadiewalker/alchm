/**
 * CRISIS-OPTIMIZED: Emergency Performance Support Index
 * 
 * This is a temporary, ultra-minimal version created to solve critical bundle size issues.
 * Only the most essential support functions are included to keep users in crisis safe.
 */

// EMERGENCY: Only export what's absolutely needed for crisis support
export const TechnicalSupportChatbotLazy = () => 
  import('./TechnicalSupportChatbot').then(m => ({ default: m.TechnicalSupportChatbot }));

// CACHE CRISIS SUPPORT: Essential cache management tools
export const CacheClearInstructionsLazy = () =>
  import('./CacheClearInstructions').then(m => ({ default: m.default }));

// Emergency utilities - minimal only
export const supportUtils = {
  isMobile: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  },
  
  isSupported: (): boolean => {
    if (typeof window === 'undefined') return false;
    return 'fetch' in window;
  },
  
  // Cache emergency utilities
  emergencyCacheClear: async (): Promise<void> => {
    try {
      // Clear all caches for crisis users
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Emergency cache clear failed:', error);
      window.location.reload();
    }
  },
  
  // Platform detection for cache instructions
  getPlatform: () => {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    if (/android/.test(ua)) return 'android';
    return 'desktop';
  }
};

// All other exports temporarily disabled for performance emergency
// TODO: Re-enable after bundle size optimization is complete