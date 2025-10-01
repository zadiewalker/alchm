/**
 * CRISIS-OPTIMIZED: Emergency Performance Support Index
 * 
 * This is a temporary, ultra-minimal version created to solve critical bundle size issues.
 * Only the most essential support functions are included to keep users in crisis safe.
 */

// EMERGENCY: Only export what's absolutely needed for crisis support
export const TechnicalSupportChatbotLazy = () => 
  import('./TechnicalSupportChatbot').then(m => ({ default: m.TechnicalSupportChatbot }));

// Emergency utilities - minimal only
export const supportUtils = {
  isMobile: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  },
  
  isSupported: (): boolean => {
    if (typeof window === 'undefined') return false;
    return 'fetch' in window;
  }
};

// All other exports temporarily disabled for performance emergency
// TODO: Re-enable after bundle size optimization is complete