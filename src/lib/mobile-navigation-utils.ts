/**
 * Mobile Navigation Utilities for Crisis-Safe User Experience
 * Optimized for vulnerable users accessing ALCHM during emotional distress
 */

interface MobileNavigationConfig {
  minTouchTarget: number;
  crisisTouchTarget: number;
  hapticPatterns: {
    confirmation: number[];
    error: number[];
    success: number[];
  };
  transitionDelays: {
    gentle: number;
    standard: number;
    immediate: number;
  };
}

export const MOBILE_NAV_CONFIG: MobileNavigationConfig = {
  minTouchTarget: 52, // Anxiety-friendly minimum
  crisisTouchTarget: 64, // Crisis mode enlargement
  hapticPatterns: {
    confirmation: [10, 5, 10], // Gentle confirmation
    error: [50, 20, 50, 20, 50], // Clear error indication
    success: [15, 10, 15] // Reassuring success
  },
  transitionDelays: {
    gentle: 150, // Smooth, non-jarring
    standard: 100, // Quick but visible
    immediate: 0 // No delay for crisis situations
  }
};

/**
 * Provides trauma-informed haptic feedback
 */
export function provideTacticFeedback(type: 'confirmation' | 'error' | 'success') {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    typeof window !== 'undefined' && navigator.vibrate(MOBILE_NAV_CONFIG.hapticPatterns[type]);
  }
}

/**
 * Checks if device meets minimum touch target requirements
 */
export function validateTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= MOBILE_NAV_CONFIG.minTouchTarget && 
         rect.height >= MOBILE_NAV_CONFIG.minTouchTarget;
}

/**
 * Detects if user might be in a crisis state based on interaction patterns
 */
export function detectPotentialCrisisState(): boolean {
  // Check for indicators like:
  // - Rapid, repeated touches
  // - High error rates
  // - Time of day (3am crisis access)
  // - Offline usage patterns
  
  const now = new Date();
  const hour = now.getHours();
  
  // Late night/early morning access (common crisis times)
  const isCrisisTime = hour >= 23 || hour <= 5;
  
  // Check for recent navigation errors
  const recentErrors = typeof window !== 'undefined' && sessionStorage.getItem('navigation_errors');
  const errorCount = recentErrors ? JSON.parse(recentErrors).length : 0;
  
  // Check for offline usage (users in crisis may have poor connectivity)
  const isOffline = !typeof window !== 'undefined' && navigator.onLine;
  
  return isCrisisTime || errorCount > 2 || isOffline;
}

/**
 * Applies crisis mode styling automatically
 */
export function enableCrisisModeIfNeeded() {
  if (detectPotentialCrisisState()) {
    typeof window !== 'undefined' && document.body.classList.add('crisis-mode');
    
    // Store crisis mode state
    typeof window !== 'undefined' && sessionStorage.setItem('crisis_mode_enabled', 'true');
    typeof window !== 'undefined' && sessionStorage.setItem('crisis_mode_timestamp', Date.now().toString());
    
    // Show supportive message
    showCrisisModeNotification();
  }
}

/**
 * Shows crisis mode activation notification
 */
function showCrisisModeNotification() {
  const notification = typeof window !== 'undefined' && document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(164, 183, 146, 0.95);
    color: white;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 14px;
    z-index: 10000;
    text-align: center;
    max-width: 300px;
    animation: slideDownGentle 0.3s ease-out;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  `;
  
  notification.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px;">🌿 Extra Care Mode</div>
    <div style="opacity: 0.9; font-size: 12px;">
      Larger touch targets and enhanced support activated
    </div>
  `;
  
  typeof window !== 'undefined' && document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideUpGentle 0.3s ease-in forwards';
      setTimeout(() => typeof window !== 'undefined' && document.body.removeChild(notification), 300);
    }
  }, 4000);
}

/**
 * Tracks navigation errors for crisis detection
 */
export function trackNavigationError(error: Error, context: string) {
  const errors = JSON.parse(typeof window !== 'undefined' && sessionStorage.getItem('navigation_errors') || '[]');
  errors.push({
    error: error.message,
    context,
    timestamp: Date.now(),
    userAgent: typeof window !== 'undefined' && navigator.userAgent,
    url: typeof window !== 'undefined' && window.location.href
  });
  
  // Keep only last 10 errors
  if (errors.length > 10) {
    errors.shift();
  }
  
  typeof window !== 'undefined' && sessionStorage.setItem('navigation_errors', JSON.stringify(errors));
  
  // Enable crisis mode if too many errors
  if (errors.filter(e => Date.now() - e.timestamp < 300000).length >= 3) {
    typeof window !== 'undefined' && document.body.classList.add('crisis-mode');
  }
}

/**
 * Optimizes performance for low-end devices
 */
export function optimizeForLowEndDevice() {
  // Detect low-end device indicators
  const isLowEnd = (
    (typeof window !== 'undefined' && navigator as any).deviceMemory && (typeof window !== 'undefined' && navigator as any).deviceMemory < 4 ||
    (typeof window !== 'undefined' && navigator as any).hardwareConcurrency && (typeof window !== 'undefined' && navigator as any).hardwareConcurrency < 4 ||
    typeof window !== 'undefined' && navigator.userAgent.includes('Android') && !typeof window !== 'undefined' && navigator.userAgent.includes('Chrome/9')
  );
  
  if (isLowEnd) {
    typeof window !== 'undefined' && document.body.classList.add('low-end-device');
    
    // Reduce animation complexity
    const style = typeof window !== 'undefined' && document.createElement('style');
    style.textContent = `
      .low-end-device * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
      .low-end-device .animate-gentle-pulse,
      .low-end-device .gentle-breathing {
        animation: none !important;
      }
    `;
    typeof window !== 'undefined' && document.head.appendChild(style);
  }
}

/**
 * Saves navigation state for crash recovery
 */
export function saveNavigationState(targetPath: string) {
  const state = {
    targetPath,
    timestamp: Date.now(),
    scrollPosition: typeof window !== 'undefined' && window.scrollY,
    referrer: typeof window !== 'undefined' && document.referrer,
    sessionId: typeof window !== 'undefined' && sessionStorage.getItem('session_id'),
    crisisMode: typeof window !== 'undefined' && document.body.classList.contains('crisis-mode')
  };
  
  typeof window !== 'undefined' && sessionStorage.setItem('last_navigation_state', JSON.stringify(state));
}

/**
 * Restores navigation state after crash/reload
 */
export function restoreNavigationState(): boolean {
  const stateStr = typeof window !== 'undefined' && sessionStorage.getItem('last_navigation_state');
  if (!stateStr) return false;
  
  try {
    const state = JSON.parse(stateStr);
    
    // Only restore if recent (within 5 minutes)
    if (Date.now() - state.timestamp < 300000) {
      // Restore scroll position
      typeof window !== 'undefined' && window.scrollTo(0, state.scrollPosition);
      
      // Restore crisis mode if it was active
      if (state.crisisMode) {
        typeof window !== 'undefined' && document.body.classList.add('crisis-mode');
      }
      
      return true;
    }
  } catch (error) {
    console.error('Failed to restore navigation state:', error);
  }
  
  return false;
}

/**
 * Initialize mobile navigation optimizations
 */
export function initializeMobileNavigation() {
  // Auto-enable crisis mode if needed
  enableCrisisModeIfNeeded();
  
  // Optimize for low-end devices
  optimizeForLowEndDevice();
  
  // Restore previous state if needed
  restoreNavigationState();
  
  // Clean up old navigation states
  setTimeout(() => {
    const keys = Object.keys(typeof window !== 'undefined' && sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('nav_') || key.startsWith('scroll_')) {
        const timestamp = typeof window !== 'undefined' && sessionStorage.getItem(key + '_timestamp');
        if (timestamp && Date.now() - parseInt(timestamp) > 3600000) {
          typeof window !== 'undefined' && sessionStorage.removeItem(key);
          typeof window !== 'undefined' && sessionStorage.removeItem(key + '_timestamp');
        }
      }
    });
  }, 1000);
}

// iOS Safari specific optimizations
export function applyIOSOptimizations() {
  if (/iPad|iPhone|iPod/.test(typeof window !== 'undefined' && navigator.userAgent)) {
    // Prevent zoom on input focus
    const inputs = typeof window !== 'undefined' && document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      (input as HTMLElement).style.fontSize = '16px';
    });
    
    // Handle safe area insets
    const style = typeof window !== 'undefined' && document.createElement('style');
    style.textContent = `
      @supports (padding: max(0px)) {
        .ios-safe-bottom {
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }
        .ios-safe-top {
          padding-top: max(16px, env(safe-area-inset-top));
        }
      }
    `;
    typeof window !== 'undefined' && document.head.appendChild(style);
  }
}

// Android Chrome specific optimizations  
export function applyAndroidOptimizations() {
  if (/Android/.test(typeof window !== 'undefined' && navigator.userAgent)) {
    // Handle address bar behavior
    const initialViewportHeight = typeof window !== 'undefined' && window.innerHeight;
    
    typeof window !== 'undefined' && window.addEventListener('resize', () => {
      // Only adjust if significant change (keyboard appearance)
      if (typeof window !== 'undefined' && window.innerHeight < initialViewportHeight * 0.75) {
        typeof window !== 'undefined' && document.body.classList.add('keyboard-active');
      } else {
        typeof window !== 'undefined' && document.body.classList.remove('keyboard-active');
      }
    });
    
    // Hardware back button support
    typeof window !== 'undefined' && window.addEventListener('popstate', (event) => {
      // Provide smooth back navigation
      provideTacticFeedback('confirmation');
    });
  }
}

export default {
  MOBILE_NAV_CONFIG,
  provideTacticFeedback,
  validateTouchTarget,
  detectPotentialCrisisState,
  enableCrisisModeIfNeeded,
  trackNavigationError,
  optimizeForLowEndDevice,
  saveNavigationState,
  restoreNavigationState,
  initializeMobileNavigation,
  applyIOSOptimizations,
  applyAndroidOptimizations
};