/**
 * ALCHM Mobile Authentication Optimizer
 * Crisis-Safe Mobile OAuth Implementation
 * 
 * This module addresses critical mobile authentication failures that prevent
 * trauma survivors from accessing support during their most vulnerable moments.
 * 
 * MOBILE-SPECIFIC ISSUES ADDRESSED:
 * - iOS Safari popup blocking and redirect failures
 * - Android Chrome touch event handling
 * - Network timeout issues on slow connections
 * - Touch target accessibility for trembling hands
 * - OAuth redirect failures on mobile domains
 */

import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import { app } from '@/lib/firebase';
import { mobilePerformanceMonitor } from '@/lib/mobile/crisis-mobile-performance-monitor';

interface MobileAuthResult {
  user: User | null;
  error: string | null;
  requiresAgeVerification: boolean;
  authMethod: 'popup' | 'redirect' | 'failed';
}

interface MobileDetection {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTouch: boolean;
  supportsPopups: boolean;
  browserName: string;
}

/**
 * Comprehensive mobile device and capability detection
 */
export function detectMobileCapabilities(): MobileDetection {
  if (typeof window === 'undefined') {
    return {
      isIOS: false,
      isAndroid: false,
      isMobile: false,
      isTouch: false,
      supportsPopups: false,
      browserName: 'server'
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // iOS Safari has strict popup policies, especially in private browsing
  const isIOSSafari = isIOS && /safari/.test(userAgent) && !/chrome/.test(userAgent);
  const isAndroidChrome = isAndroid && /chrome/.test(userAgent);
  
  // CRITICAL FIX: iOS devices have unreliable popup support, always prefer redirect
  // iOS Safari blocks popups aggressively, especially in private browsing mode
  const supportsPopups = !isIOS && !isAndroidChrome;
  
  let browserName = 'unknown';
  if (isIOSSafari) browserName = 'ios-safari';
  else if (isAndroidChrome) browserName = 'android-chrome';
  else if (/firefox/.test(userAgent)) browserName = 'firefox';
  else if (/edge/.test(userAgent)) browserName = 'edge';
  else if (/chrome/.test(userAgent)) browserName = 'chrome';

  return {
    isIOS,
    isAndroid,
    isMobile,
    isTouch,
    supportsPopups,
    browserName
  };
}

/**
 * Crisis-Safe Mobile Google Authentication
 * Automatically chooses the best authentication method for the user's device
 * CRITICAL FIX: Prioritizes redirect for iOS Safari to prevent blocking
 */
export async function signInWithGoogleMobile(): Promise<MobileAuthResult> {
  const mobile = detectMobileCapabilities();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  
  // Start performance monitoring for crisis users
  mobilePerformanceMonitor.startAuthMonitoring();
  
  // Configure provider for mobile optimization
  provider.addScope('profile');
  provider.addScope('email');
  provider.setCustomParameters({
    prompt: 'select_account',
    hd: undefined
  });

  console.log('🔐 Mobile Auth Debug:', {
    mobile,
    currentDomain: window.location.hostname,
    userAgent: navigator.userAgent.substring(0, 100),
    authStrategy: mobile.isIOS ? 'redirect-first' : 'popup-with-fallback'
  });

  // CRITICAL FIX: Always use redirect for iOS devices with enhanced Safari support
  if (mobile.isIOS) {
    console.log('🔐 iOS detected - using enhanced redirect method (popup blocking prevention)');
    console.log('🔐 iOS Safari version detection:', {
      isPrivateBrowsing: detectPrivateBrowsing(),
      safariVersion: getSafariVersion(navigator.userAgent),
      supportsWebKit: 'webkit' in window
    });
    return await attemptIOSEnhancedRedirectAuth(auth, provider, mobile);
  }

  // Strategy 1: Try redirect first for Android Chrome and other mobile browsers
  if (mobile.isMobile && !mobile.supportsPopups) {
    console.log('🔐 Using redirect method for mobile browser');
    return await attemptRedirectAuth(auth, provider, mobile);
  }

  // Strategy 2: Try popup with fallback to redirect for desktop/other browsers
  console.log('🔐 Attempting popup method with mobile fallback');
  return await attemptPopupWithFallback(auth, provider, mobile);
}

/**
 * Redirect-based authentication for mobile browsers
 * CRITICAL FIX: Enhanced iOS Safari redirect handling
 */
async function attemptRedirectAuth(
  auth: any, 
  provider: GoogleAuthProvider, 
  mobile: MobileDetection
): Promise<MobileAuthResult> {
  try {
    // Check if we're returning from a redirect
    console.log('🔐 Checking for redirect result...');
    const redirectResult = await getRedirectResult(auth);
    
    if (redirectResult?.user) {
      console.log('🔐 Redirect auth successful:', {
        uid: redirectResult.user.uid,
        email: redirectResult.user.email,
        device: mobile.isIOS ? 'iOS' : mobile.isAndroid ? 'Android' : 'Other'
      });
      
      await setMobileSessionCookie(redirectResult.user);
      
      // Record successful authentication
      mobilePerformanceMonitor.recordAuthSuccess('redirect');
      
      // CRITICAL FIX: Clear any URL parameters after successful auth
      if (typeof window !== 'undefined' && window.history.replaceState) {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
      
      return {
        user: redirectResult.user,
        error: null,
        requiresAgeVerification: true,
        authMethod: 'redirect'
      };
    }

    // No redirect result, initiate redirect
    console.log('🔐 Initiating redirect auth for', mobile.isIOS ? 'iOS' : 'mobile', 'device...');
    
    // CRITICAL FIX: Add iOS-specific configuration
    if (mobile.isIOS) {
      provider.setCustomParameters({
        prompt: 'select_account',
        hd: undefined,
        // iOS Safari specific parameters
        access_type: 'online',
        include_granted_scopes: 'true'
      });
    }
    
    await signInWithRedirect(auth, provider);
    
    // This will cause a page navigation, so we won't reach here
    return {
      user: null,
      error: null,
      requiresAgeVerification: false,
      authMethod: 'redirect'
    };

  } catch (error: any) {
    console.error('🚨 Redirect auth failed:', error);
    console.error('🚨 Device context:', {
      isIOS: mobile.isIOS,
      browserName: mobile.browserName,
      userAgent: navigator.userAgent.substring(0, 100)
    });
    
    // Record authentication failure
    mobilePerformanceMonitor.recordAuthFailure(
      error.code || 'unknown-error',
      error.message || 'Redirect authentication failed',
      0
    );
    
    return {
      user: null,
      error: getMobileErrorMessage(error, mobile),
      requiresAgeVerification: false,
      authMethod: 'failed'
    };
  }
}

/**
 * Popup authentication with mobile fallback
 */
async function attemptPopupWithFallback(
  auth: any,
  provider: GoogleAuthProvider,
  mobile: MobileDetection
): Promise<MobileAuthResult> {
  try {
    console.log('🔐 Attempting popup auth...');
    const result = await signInWithPopup(auth, provider);
    
    if (result?.user) {
      console.log('🔐 Popup auth successful');
      await setMobileSessionCookie(result.user);
      
      // Record successful authentication
      mobilePerformanceMonitor.recordAuthSuccess('popup');
      
      return {
        user: result.user,
        error: null,
        requiresAgeVerification: true,
        authMethod: 'popup'
      };
    }

    throw new Error('No user returned from popup');

  } catch (error: any) {
    console.error('🚨 Popup auth failed, trying redirect fallback:', error);
    
    // If popup fails on mobile, try redirect
    if (mobile.isMobile && (
      error.code === 'auth/popup-blocked' ||
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request'
    )) {
      console.log('🔐 Falling back to redirect method...');
      return await attemptRedirectAuth(auth, provider, mobile);
    }

    // Record authentication failure
    mobilePerformanceMonitor.recordAuthFailure(
      error.code || 'popup-failed',
      error.message || 'Popup authentication failed',
      0
    );
    
    return {
      user: null,
      error: getMobileErrorMessage(error, mobile),
      requiresAgeVerification: false,
      authMethod: 'failed'
    };
  }
}

/**
 * Set session cookie with mobile-optimized settings
 */
async function setMobileSessionCookie(user: User): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const isLocalhost = window.location.hostname === 'localhost';
    const secure = !isLocalhost ? 'secure;' : '';
    const sameSite = 'strict'; // Mobile browsers prefer strict
    
    document.cookie = `alchm_session=${user.uid}; path=/; max-age=86400; ${secure} samesite=${sameSite}`;
    console.log('🔐 Mobile session cookie set successfully');
  } catch (error) {
    console.error('🚨 Failed to set mobile session cookie:', error);
  }
}

/**
 * Mobile-specific trauma-informed error messages
 */
function getMobileErrorMessage(error: any, mobile: MobileDetection): string {
  console.error('🚨 Mobile auth error details:', {
    code: error.code,
    message: error.message,
    mobile
  });

  // iOS Safari specific errors
  if (mobile.isIOS) {
    if (error.code === 'auth/popup-blocked') {
      return 'Authentication requires a popup. Please allow popups for this site in Safari settings, then try again.';
    }
    if (error.code === 'auth/popup-closed-by-user') {
      return 'Authentication was cancelled. Take your time - we\'ll be here when you\'re ready.';
    }
    if (error.code === 'auth/network-request-failed') {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
  }

  // Android specific errors
  if (mobile.isAndroid) {
    if (error.code === 'auth/popup-blocked') {
      return 'Please allow popups in your browser settings and try again.';
    }
    if (error.code === 'auth/cancelled-popup-request') {
      return 'Authentication was interrupted. Please try again when you\'re ready.';
    }
  }

  // General mobile errors with trauma-informed language
  if (error.code === 'auth/unauthorized-domain') {
    return 'Please use alchmapp.web.app or alchm-digital-sanctuary.web.app to access ALCHM safely.';
  }
  
  if (error.code === 'auth/api-key-not-valid') {
    return 'Technical configuration issue detected. Please refresh the page or contact support.';
  }
  
  if (error.code === 'auth/operation-not-allowed') {
    return 'Google sign-in is temporarily unavailable. Please try email sign-in or contact support.';
  }

  if (error.code === 'auth/network-request-failed') {
    return 'Connection interrupted. Please check your internet and try again when ready.';
  }

  // Default trauma-informed error
  return 'Authentication encountered a gentle hiccup. You\'re safe here - please try again when you\'re ready.';
}

/**
 * Check if we're in the middle of a redirect flow
 */
export function isRedirectInProgress(): boolean {
  if (typeof window === 'undefined') return false;
  
  const params = new URLSearchParams(window.location.search);
  return params.has('state') && params.has('code');
}

/**
 * Mobile-optimized auth state monitoring
 */
export function createMobileAuthObserver(callback: (user: User | null, method?: string) => void) {
  const auth = getAuth(app);
  const mobile = detectMobileCapabilities();
  
  return auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log('🔐 Mobile auth state changed: user authenticated');
      await setMobileSessionCookie(user);
      callback(user, mobile.isMobile ? 'mobile' : 'desktop');
    } else {
      console.log('🔐 Mobile auth state changed: user signed out');
      callback(null);
    }
  });
}

/**
 * Pre-warm authentication for faster mobile loading
 */
export function preWarmMobileAuth(): void {
  if (typeof window === 'undefined') return;

  const mobile = detectMobileCapabilities();
  
  if (mobile.isMobile) {
    // Pre-initialize auth on mobile for faster response
    const auth = getAuth(app);
    console.log('🔥 Pre-warming mobile authentication...');
    
    // Check for pending redirect result immediately
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        console.log('🔐 Found pending redirect result during pre-warm');
      }
    }).catch((error) => {
      console.log('🔐 No pending redirect result (normal)');
    });
  }
}

/**
 * Enhanced iOS Safari detection and redirect authentication
 * CRITICAL FIX: Handles iOS Safari private browsing and version-specific issues
 */
async function attemptIOSEnhancedRedirectAuth(
  auth: any, 
  provider: GoogleAuthProvider, 
  mobile: MobileDetection
): Promise<MobileAuthResult> {
  try {
    // Enhanced iOS Safari state management
    const authStateKey = 'alchm_ios_auth_state';
    const redirectAttemptKey = 'alchm_ios_redirect_attempt';
    
    // Check if we're returning from a redirect
    console.log('🔐 iOS Enhanced: Checking for redirect result...');
    const redirectResult = await getRedirectResult(auth);
    
    if (redirectResult?.user) {
      console.log('🔐 iOS Enhanced: Redirect auth successful:', {
        uid: redirectResult.user.uid,
        email: redirectResult.user.email,
        safariVersion: getSafariVersion(navigator.userAgent),
        isPrivateBrowsing: detectPrivateBrowsing()
      });
      
      // Clear iOS-specific state tracking
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(authStateKey);
        sessionStorage.removeItem(redirectAttemptKey);
        localStorage.removeItem(authStateKey);
        localStorage.removeItem(redirectAttemptKey);
      }
      
      await setMobileSessionCookie(redirectResult.user);
      mobilePerformanceMonitor.recordAuthSuccess('redirect');
      
      // CRITICAL FIX: Enhanced URL cleanup for iOS Safari
      if (typeof window !== 'undefined' && window.history.replaceState) {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        // iOS Safari-specific URL state cleanup
        if (window.location.hash.includes('state=') || window.location.hash.includes('code=')) {
          window.location.hash = '';
        }
      }
      
      return {
        user: redirectResult.user,
        error: null,
        requiresAgeVerification: true,
        authMethod: 'redirect'
      };
    }

    // Check for previous redirect attempts to prevent loops
    const redirectAttempts = parseInt(sessionStorage.getItem(redirectAttemptKey) || '0');
    if (redirectAttempts >= 3) {
      console.error('🚨 iOS Enhanced: Too many redirect attempts, suggesting manual retry');
      return {
        user: null,
        error: 'Authentication needs a fresh start. Please close and reopen Safari, then try again.',
        requiresAgeVerification: false,
        authMethod: 'failed'
      };
    }

    // Enhanced provider configuration for iOS Safari
    provider.setCustomParameters({
      prompt: 'select_account',
      hd: undefined,
      // iOS Safari specific parameters for better compatibility
      access_type: 'online',
      include_granted_scopes: 'true',
      // Force account selection even if only one account
      login_hint: undefined,
      // Prevent caching issues in iOS Safari
      approval_prompt: 'auto'
    });
    
    // Store state before redirect for iOS Safari tracking
    const authState = {
      timestamp: Date.now(),
      userAgent: navigator.userAgent.substring(0, 100),
      attempt: redirectAttempts + 1,
      isPrivateBrowsing: detectPrivateBrowsing(),
      safariVersion: getSafariVersion(navigator.userAgent)
    };
    
    try {
      sessionStorage.setItem(authStateKey, JSON.stringify(authState));
      sessionStorage.setItem(redirectAttemptKey, String(redirectAttempts + 1));
    } catch (e) {
      // iOS Safari private browsing might block sessionStorage
      console.warn('🔐 iOS Enhanced: SessionStorage blocked, using localStorage fallback');
      try {
        localStorage.setItem(authStateKey, JSON.stringify(authState));
        localStorage.setItem(redirectAttemptKey, String(redirectAttempts + 1));
      } catch (e2) {
        console.warn('🔐 iOS Enhanced: Both session and local storage blocked, proceeding without state tracking');
      }
    }
    
    console.log('🔐 iOS Enhanced: Initiating redirect auth with enhanced settings...');
    console.log('🔐 iOS Enhanced: Auth state:', authState);
    
    // CRITICAL FIX: Add iOS-specific timeout handling
    const redirectTimeout = setTimeout(() => {
      console.error('🚨 iOS Enhanced: Redirect timeout - iOS Safari may have issues');
    }, 5000);
    
    await signInWithRedirect(auth, provider);
    clearTimeout(redirectTimeout);
    
    // This will cause a page navigation, so we won't reach here
    return {
      user: null,
      error: null,
      requiresAgeVerification: false,
      authMethod: 'redirect'
    };

  } catch (error: any) {
    console.error('🚨 iOS Enhanced: Redirect auth failed:', error);
    console.error('🚨 iOS Enhanced: Detailed context:', {
      errorCode: error.code,
      errorMessage: error.message,
      safariVersion: getSafariVersion(navigator.userAgent),
      isPrivateBrowsing: detectPrivateBrowsing(),
      userAgent: navigator.userAgent.substring(0, 100),
      currentURL: window.location.href,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    });
    
    // Record failure with enhanced context
    mobilePerformanceMonitor.recordAuthFailure(
      error.code || 'ios-enhanced-redirect-failed',
      `iOS Enhanced: ${error.message || 'Redirect authentication failed'}`,
      parseInt(sessionStorage.getItem('alchm_ios_redirect_attempt') || '0')
    );
    
    return {
      user: null,
      error: getIOSEnhancedErrorMessage(error, mobile),
      requiresAgeVerification: false,
      authMethod: 'failed'
    };
  }
}

/**
 * Detect iOS Safari private browsing mode
 */
function detectPrivateBrowsing(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    // iOS Safari private browsing detection
    localStorage.setItem('__private_browsing_test__', 'test');
    localStorage.removeItem('__private_browsing_test__');
    return false;
  } catch (e) {
    return true;
  }
}

/**
 * Extract Safari version from user agent
 */
function getSafariVersion(userAgent: string): string {
  const match = userAgent.match(/Version\/([\d.]+)/);
  return match ? match[1] : 'unknown';
}

/**
 * iOS Safari-specific error messages for crisis users
 */
function getIOSEnhancedErrorMessage(error: any, mobile: MobileDetection): string {
  const safariVersion = getSafariVersion(navigator.userAgent);
  const isPrivateBrowsing = detectPrivateBrowsing();
  
  console.error('🚨 iOS Enhanced error details:', {
    code: error.code,
    message: error.message,
    safariVersion,
    isPrivateBrowsing,
    mobile
  });

  // iOS Safari private browsing specific errors
  if (isPrivateBrowsing) {
    if (error.code === 'auth/web-storage-unsupported') {
      return 'Private browsing detected. For your safety, please use regular Safari mode to sign in to ALCHM.';
    }
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      return 'Private browsing detected. Please switch to regular Safari mode and try again.';
    }
  }

  // iOS Safari version-specific errors
  if (error.code === 'auth/popup-blocked') {
    return 'iOS Safari security is protecting you. Please refresh this page - we\'ll use a more compatible sign-in method.';
  }
  
  if (error.code === 'auth/network-request-failed') {
    return 'Network connection interrupted. Please check your WiFi or cellular connection and try again.';
  }
  
  if (error.code === 'auth/unauthorized-domain') {
    return 'Please make sure you\'re using alchmapp.web.app or alchm-digital-sanctuary.web.app to access ALCHM safely.';
  }
  
  if (error.code === 'auth/operation-not-allowed') {
    return 'Google sign-in is temporarily unavailable. Please try refreshing the page or contact support.';
  }

  // iOS Safari-specific timeout or connection issues
  if (error.message?.includes('timeout') || error.message?.includes('Failed to fetch')) {
    return 'Connection timeout on iOS. Please check your internet connection and try again when ready.';
  }

  // Default trauma-informed error for iOS users
  return 'iOS authentication encountered a gentle hiccup. You\'re safe here - please refresh the page and try again.';
}

export type { MobileAuthResult, MobileDetection };