/**
 * Client-Safe Browser APIs
 * Trauma-informed utilities for safe browser API access
 */

export interface HapticFeedbackPattern {
  gentle: number[];
  affirmative: number[];
  alert: number[];
  crisis: number[];
}

// Trauma-informed haptic patterns
export const HAPTIC_PATTERNS: HapticFeedbackPattern = {
  gentle: [30],                    // Single gentle tap
  affirmative: [50, 25, 50],      // Positive confirmation pattern
  alert: [100, 50, 100],          // Attention pattern
  crisis: [200, 100, 200, 100, 200] // Emergency pattern
};

/**
 * Safe haptic feedback for trauma-informed interactions
 */
export function safeHapticFeedback(pattern: keyof HapticFeedbackPattern = 'gentle'): void {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  // Check for haptic support
  if (!navigator.vibrate) return;
  
  // Respect user's motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  // Apply trauma-informed haptic pattern
  navigator.vibrate(HAPTIC_PATTERNS[pattern]);
}

/**
 * Safe storage operations with trauma-informed error handling
 */
export const safeStorage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Storage access failed (privacy mode?)', { key });
      return null;
    }
  },
  
  set: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Storage write failed (privacy mode?)', { key });
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Storage removal failed', { key });
      return false;
    }
  }
};

/**
 * Safe network status detection
 */
export function getNetworkStatus() {
  if (typeof window === 'undefined') {
    return { online: true, effectiveType: 'unknown' };
  }
  
  return {
    online: navigator.onLine,
    effectiveType: (navigator as any).connection?.effectiveType || 'unknown'
  };
}

/**
 * Safe device capabilities detection
 */
export function getDeviceCapabilities() {
  if (typeof window === 'undefined') {
    return {
      hasHaptics: false,
      hasCamera: false,
      hasNotifications: false,
      isMobile: false
    };
  }
  
  return {
    hasHaptics: 'vibrate' in navigator,
    hasCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    hasNotifications: 'Notification' in window,
    isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  };
}

/**
 * Safe CSS animation detection for trauma-informed motion
 */
export function shouldUseReducedMotion(): boolean {
  if (typeof window === 'undefined') return true; // Safe default
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Crisis-safe page visibility detection
 */
export function isPageVisible(): boolean {
  if (typeof document === 'undefined') return true; // Safe default
  
  return !document.hidden;
}

/**
 * Safe performance measurement for crisis response times
 */
export function measureCrisisResponseTime(startTime: number): number {
  if (typeof performance === 'undefined') return 0; // Safe fallback
  
  return performance.now() - startTime;
}

/**
 * Safe geolocation for crisis services (with privacy protection)
 */
export async function getSafeGeolocation(): Promise<{ lat?: number; lng?: number; error?: string }> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return { error: 'Geolocation not available' };
  }
  
  return new Promise((resolve) => {
    const options = {
      enableHighAccuracy: false, // Privacy-conscious
      timeout: 10000,           // 10s timeout
      maximumAge: 300000        // 5min cache
    };
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        resolve({ error: error.message });
      },
      options
    );
  });
}

/**
 * Trauma-informed focus management
 */
export function safeFocus(element: HTMLElement | null): void {
  if (!element || typeof document === 'undefined') return;
  
  // Respect reduced motion preferences
  if (shouldUseReducedMotion()) {
    element.focus({ preventScroll: true });
  } else {
    element.focus({ preventScroll: false });
  }
}

/**
 * Safe clipboard operations for crisis resource sharing
 */
export async function safeCopyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return false;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn('Clipboard access failed', error);
    return false;
  }
}