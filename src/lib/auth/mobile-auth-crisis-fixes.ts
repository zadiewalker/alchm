/**
 * ALCHM Mobile Authentication Crisis Fixes
 * Emergency implementation addressing critical iOS Safari and Android Chrome issues
 * 
 * CRITICAL FIXES:
 * - iOS Safari popup blocking with redirect fallbacks
 * - Android Chrome gesture requirements
 * - Crisis-safe error handling
 * - Enhanced session persistence
 * - Touch accessibility for distressed users
 */

import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  GoogleAuthProvider,
  User,
  AuthError
} from 'firebase/auth';
import { app } from '@/lib/firebase';

export interface CrisisMobileAuthResult {
  user: User | null;
  error: string | null;
  requiresAgeVerification: boolean;
  authMethod: 'popup' | 'redirect' | 'emergency-bypass' | 'failed';
  crisisSupport?: {
    level: 'none' | 'mild' | 'moderate' | 'severe' | 'critical';
    emergencyOptions: Array<{
      label: string;
      action: string;
      priority: 'primary' | 'secondary' | 'crisis';
    }>;
  };
}

export interface EnhancedMobileDetection {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTouch: boolean;
  isIOSSafari: boolean;
  isIOSChrome: boolean;
  isIOSFirefox: boolean;
  isAndroidChrome: boolean;
  isAndroidFirefox: boolean;
  isPrivateBrowsing: boolean;
  supportsPopups: boolean;
  requiresRedirect: boolean;
  deviceStress: 'low' | 'moderate' | 'high';
  batteryLevel?: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
  browserName: string;
  crisisContext: boolean;
}

/**
 * Enhanced mobile device and capability detection for crisis scenarios
 */
export async function detectCrisisMobileCapabilities(): Promise<EnhancedMobileDetection> {
  if (typeof window === 'undefined') {
    return {
      isIOS: false,
      isAndroid: false,
      isMobile: false,
      isTouch: false,
      isIOSSafari: false,
      isIOSChrome: false,
      isIOSFirefox: false,
      isAndroidChrome: false,
      isAndroidFirefox: false,
      isPrivateBrowsing: false,
      supportsPopups: false,
      requiresRedirect: true,
      deviceStress: 'moderate',
      connectionQuality: 'offline',
      browserName: 'server',
      crisisContext: false
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  
  // Enhanced iOS detection
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isIOSSafari = isIOS && /safari/.test(userAgent) && 
                      !/crios|fxios|chrome|firefox/.test(userAgent);
  const isIOSChrome = isIOS && /crios/.test(userAgent);
  const isIOSFirefox = isIOS && /fxios/.test(userAgent);
  
  // Enhanced Android detection
  const isAndroid = /android/.test(userAgent);
  const isAndroidChrome = isAndroid && /chrome/.test(userAgent) && !/firefox/.test(userAgent);
  const isAndroidFirefox = isAndroid && /firefox/.test(userAgent);
  
  const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Private browsing detection (affects popup behavior)
  const isPrivateBrowsing = await detectPrivateBrowsing();
  
  // Popup support assessment
  const supportsPopups = !isIOSSafari && !isPrivateBrowsing && !isAndroidChrome;
  const requiresRedirect = isIOSSafari || isPrivateBrowsing || isAndroidChrome;
  
  // Device performance assessment
  const deviceStress = await assessDeviceStress();
  
  // Connection quality
  const connectionQuality = await assessConnectionQuality();
  
  // Battery level (if available)
  let batteryLevel: number | undefined;
  try {
    // @ts-ignore - Battery API may not be available
    const battery = await navigator.getBattery?.();
    if (battery) {
      batteryLevel = Math.round(battery.level * 100);
    }
  } catch (error) {
    // Battery API not supported
  }
  
  // Crisis context detection
  const crisisContext = detectCrisisContext();
  
  // Browser name determination
  let browserName = 'unknown';
  if (isIOSSafari) browserName = 'ios-safari';
  else if (isIOSChrome) browserName = 'ios-chrome';
  else if (isIOSFirefox) browserName = 'ios-firefox';
  else if (isAndroidChrome) browserName = 'android-chrome';
  else if (isAndroidFirefox) browserName = 'android-firefox';
  else if (/firefox/.test(userAgent)) browserName = 'firefox';
  else if (/edge/.test(userAgent)) browserName = 'edge';
  else if (/chrome/.test(userAgent)) browserName = 'chrome';
  else if (/safari/.test(userAgent)) browserName = 'safari';
  
  return {
    isIOS,
    isAndroid,
    isMobile,
    isTouch,
    isIOSSafari,
    isIOSChrome,
    isIOSFirefox,
    isAndroidChrome,
    isAndroidFirefox,
    isPrivateBrowsing,
    supportsPopups,
    requiresRedirect,
    deviceStress,
    batteryLevel,
    connectionQuality,
    browserName,
    crisisContext
  };
}

/**
 * Crisis-safe Google authentication for mobile devices
 */
export async function signInWithGoogleCrisisSafe(): Promise<CrisisMobileAuthResult> {
  const mobile = await detectCrisisMobileCapabilities();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  
  // Crisis-optimized provider configuration
  provider.addScope('profile');
  provider.addScope('email');
  provider.setCustomParameters({
    prompt: mobile.crisisContext ? 'consent' : 'select_account', // Reduce complexity in crisis
    hd: undefined,
    access_type: 'online', // Faster for mobile
    approval_prompt: 'auto'
  });

  console.log('🔐 Crisis-Safe Mobile Auth:', {
    browser: mobile.browserName,
    requiresRedirect: mobile.requiresRedirect,
    crisisContext: mobile.crisisContext,
    deviceStress: mobile.deviceStress,
    batteryLevel: mobile.batteryLevel
  });

  // Emergency bypass for critical crisis situations
  if (mobile.crisisContext && (mobile.deviceStress === 'high' || (mobile.batteryLevel && mobile.batteryLevel < 10))) {
    return {
      user: null,
      error: null,
      requiresAgeVerification: false,
      authMethod: 'emergency-bypass',
      crisisSupport: {
        level: 'critical',
        emergencyOptions: [
          { label: 'Call 988 Crisis Line', action: 'tel:988', priority: 'crisis' },
          { label: 'Text HOME to 741741', action: 'sms:741741&body=HOME', priority: 'crisis' },
          { label: 'Emergency 911', action: 'tel:911', priority: 'crisis' },
          { label: 'Access Emergency Resources', action: '/emergency/resources', priority: 'primary' }
        ]
      }
    };
  }

  // Choose authentication strategy based on device capabilities
  if (mobile.requiresRedirect || mobile.deviceStress === 'high' || mobile.connectionQuality === 'poor') {
    return await attemptRedirectAuthWithCrisisSupport(auth, provider, mobile);
  }

  // Try popup with immediate redirect fallback
  return await attemptPopupWithCrisisSupport(auth, provider, mobile);
}

/**
 * Redirect-based authentication with crisis support
 */
async function attemptRedirectAuthWithCrisisSupport(
  auth: any, 
  provider: GoogleAuthProvider, 
  mobile: EnhancedMobileDetection
): Promise<CrisisMobileAuthResult> {
  try {
    // Check if we're returning from a redirect
    console.log('🔐 Checking for redirect result...');
    const redirectResult = await getRedirectResult(auth);
    
    if (redirectResult?.user) {
      console.log('🔐 Redirect auth successful');
      await setCrisisSafeSessionCookie(redirectResult.user, mobile);
      
      // Provide haptic feedback for successful auth
      if (mobile.isTouch && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]); // Success pattern
      }
      
      return {
        user: redirectResult.user,
        error: null,
        requiresAgeVerification: true,
        authMethod: 'redirect'
      };
    }

    // No redirect result, initiate redirect
    console.log('🔐 Initiating crisis-safe redirect auth...');
    
    // Provide feedback before redirect
    if (mobile.isTouch && navigator.vibrate) {
      navigator.vibrate(50); // Brief acknowledgment
    }
    
    await signInWithRedirect(auth, provider);
    
    // This will cause a page navigation
    return {
      user: null,
      error: null,
      requiresAgeVerification: false,
      authMethod: 'redirect'
    };

  } catch (error: any) {
    console.error('🚨 Redirect auth failed:', error);
    
    return {
      user: null,
      error: getCrisisSafeErrorMessage(error, mobile),
      requiresAgeVerification: false,
      authMethod: 'failed',
      crisisSupport: generateCrisisSupport(error, mobile)
    };
  }
}

/**
 * Popup authentication with crisis-aware fallbacks
 */
async function attemptPopupWithCrisisSupport(
  auth: any,
  provider: GoogleAuthProvider,
  mobile: EnhancedMobileDetection
): Promise<CrisisMobileAuthResult> {
  try {
    console.log('🔐 Attempting crisis-safe popup auth...');
    
    // Provide haptic feedback for touch interaction
    if (mobile.isTouch && navigator.vibrate) {
      navigator.vibrate(15);
    }
    
    const result = await signInWithPopup(auth, provider);
    
    if (result?.user) {
      console.log('🔐 Popup auth successful');
      await setCrisisSafeSessionCookie(result.user, mobile);
      
      // Success haptic feedback
      if (mobile.isTouch && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      return {
        user: result.user,
        error: null,
        requiresAgeVerification: true,
        authMethod: 'popup'
      };
    }

    throw new Error('No user returned from popup');

  } catch (error: any) {
    console.error('🚨 Popup auth failed, trying crisis-safe fallback:', error);
    
    // If popup fails on mobile, try redirect
    if (mobile.isMobile && (
      error.code === 'auth/popup-blocked' ||
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request'
    )) {
      console.log('🔐 Falling back to redirect method for crisis safety...');
      return await attemptRedirectAuthWithCrisisSupport(auth, provider, mobile);
    }
    
    return {
      user: null,
      error: getCrisisSafeErrorMessage(error, mobile),
      requiresAgeVerification: false,
      authMethod: 'failed',
      crisisSupport: generateCrisisSupport(error, mobile)
    };
  }
}

/**
 * Crisis-safe session cookie management with enhanced persistence
 */
async function setCrisisSafeSessionCookie(user: User, mobile: EnhancedMobileDetection): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const isLocalhost = window.location.hostname === 'localhost';
    const secure = !isLocalhost ? 'secure;' : '';
    
    // Base cookie
    document.cookie = `alchm_session=${user.uid}; path=/; max-age=86400; ${secure} samesite=strict`;
    
    // Enhanced mobile persistence strategies
    if (mobile.isMobile) {
      // Strategy 1: Session storage (survives page reloads)
      sessionStorage.setItem('alchm_mobile_session', user.uid);
      sessionStorage.setItem('alchm_session_timestamp', Date.now().toString());
      
      // Strategy 2: iOS Safari needs special handling
      if (mobile.isIOSSafari) {
        try {
          localStorage.setItem('alchm_ios_session_backup', JSON.stringify({
            uid: user.uid,
            timestamp: Date.now(),
            browser: 'ios-safari'
          }));
        } catch (error) {
          // Storage may be disabled in private browsing
          console.warn('iOS Safari session backup failed (likely private browsing)');
        }
      }
      
      // Strategy 3: Crisis emergency session for high-stress situations
      if (mobile.crisisContext || mobile.deviceStress === 'high') {
        try {
          sessionStorage.setItem('alchm_crisis_session', JSON.stringify({
            uid: user.uid,
            crisisMode: true,
            timestamp: Date.now()
          }));
        } catch (error) {
          console.error('Crisis session backup failed');
        }
      }
      
      // Strategy 4: Battery-aware persistence
      if (mobile.batteryLevel && mobile.batteryLevel < 20) {
        try {
          sessionStorage.setItem('alchm_low_battery_session', user.uid);
        } catch (error) {
          console.warn('Low battery session backup failed');
        }
      }
    }
    
    console.log('🔐 Crisis-safe session persistence configured');
  } catch (error) {
    console.error('🚨 Session persistence failed:', error);
    
    // Emergency fallback
    try {
      sessionStorage.setItem('alchm_emergency_session', user.uid);
    } catch (fallbackError) {
      console.error('🚨 Emergency session storage completely failed');
    }
  }
}

/**
 * Generate trauma-informed error messages for mobile authentication
 */
function getCrisisSafeErrorMessage(error: AuthError, mobile: EnhancedMobileDetection): string {
  const isCrisis = mobile.crisisContext;
  const isLowBattery = mobile.batteryLevel && mobile.batteryLevel < 20;
  const isOffline = mobile.connectionQuality === 'offline';
  
  // Critical crisis situations get immediate support messaging
  if (isCrisis && (error.code === 'auth/network-request-failed' || isOffline)) {
    return "Take a breath. Even offline, crisis support is available. Emergency calling works always.";
  }
  
  if (isCrisis && error.code === 'auth/popup-blocked') {
    return "It's okay - we'll try a different way to get you signed in safely.";
  }
  
  if (isCrisis && error.code === 'auth/popup-closed-by-user') {
    return "No pressure at all. Take your time - we'll be here when you're ready.";
  }
  
  // iOS Safari specific messaging
  if (mobile.isIOSSafari) {
    if (error.code === 'auth/popup-blocked') {
      return isCrisis
        ? "We understand - let's try signing in a different way that works better on iPhone."
        : "Safari requires a redirect to sign in safely. We'll take you there now.";
    }
    
    if (error.code === 'auth/unauthorized-domain') {
      return "For your safety, please use alchmapp.web.app to sign in on iPhone/iPad.";
    }
  }
  
  // Android Chrome specific messaging
  if (mobile.isAndroidChrome) {
    if (error.code === 'auth/network-request-failed') {
      return isCrisis
        ? "Connection issue, but you're safe. Crisis resources work offline - see below."
        : "Network connection interrupted. Please check your internet and try again.";
    }
  }
  
  // Low battery messaging
  if (isLowBattery) {
    return isCrisis
      ? "Low battery, but help is still available. Emergency calling works even at 1% battery."
      : "Your battery is low. Let's get you signed in quickly.";
  }
  
  // General crisis-safe messaging
  if (isCrisis) {
    return "You're in a safe space. Let's try a different way to sign in, or access help directly below.";
  }
  
  // Default mobile-friendly messaging
  return "Authentication needs a moment to work on mobile. Please try again when you're ready.";
}

/**
 * Generate crisis support options based on error and device context
 */
function generateCrisisSupport(error: AuthError, mobile: EnhancedMobileDetection): CrisisMobileAuthResult['crisisSupport'] {
  if (!mobile.crisisContext && mobile.deviceStress !== 'high') {
    return undefined;
  }
  
  const emergencyOptions = [
    { label: 'Call 988 Crisis Line', action: 'tel:988', priority: 'crisis' as const },
    { label: 'Text HOME to 741741', action: 'sms:741741&body=HOME', priority: 'crisis' as const }
  ];
  
  // Add emergency services for critical situations
  if (mobile.crisisContext && (error.code === 'auth/network-request-failed' || mobile.batteryLevel && mobile.batteryLevel < 5)) {
    emergencyOptions.unshift({
      label: 'Emergency 911',
      action: 'tel:911',
      priority: 'crisis' as const
    });
  }
  
  // Add offline resources
  if (mobile.connectionQuality === 'offline' || mobile.connectionQuality === 'poor') {
    emergencyOptions.push({
      label: 'Offline Crisis Resources',
      action: '/offline/crisis',
      priority: 'primary' as const
    });
  }
  
  // Add guest access
  emergencyOptions.push({
    label: 'Access Safe Journaling Space',
    action: '/guest/journal',
    priority: 'secondary' as const
  });
  
  return {
    level: mobile.crisisContext ? 'severe' : 'moderate',
    emergencyOptions
  };
}

// Helper functions
function detectPrivateBrowsing(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Test localStorage access (blocked in iOS private browsing)
      const testKey = '__test_private_browsing__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      resolve(false); // Not private
    } catch (e) {
      resolve(true); // Likely private
    }
  });
}

function assessDeviceStress(): Promise<'low' | 'moderate' | 'high'> {
  return new Promise((resolve) => {
    const start = performance.now();
    requestAnimationFrame(() => {
      const frameTime = performance.now() - start;
      if (frameTime < 8) resolve('low');
      else if (frameTime < 16) resolve('moderate');
      else resolve('high');
    });
  });
}

function assessConnectionQuality(): Promise<'excellent' | 'good' | 'poor' | 'offline'> {
  return new Promise((resolve) => {
    if (!navigator.onLine) {
      resolve('offline');
      return;
    }
    
    const start = performance.now();
    fetch('/api/health/ping', { method: 'HEAD' })
      .then(() => {
        const latency = performance.now() - start;
        if (latency < 100) resolve('excellent');
        else if (latency < 300) resolve('good');
        else resolve('poor');
      })
      .catch(() => resolve('poor'));
  });
}

function detectCrisisContext(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Multiple crisis indicators
  const timeIndicator = new Date().getHours() < 6 || new Date().getHours() > 22;
  const urlIndicator = window.location.search.includes('crisis=true');
  const storageIndicator = localStorage.getItem('alchm_crisis_mode') === 'active';
  const sessionIndicator = sessionStorage.getItem('alchm_emergency_access') !== null;
  
  return timeIndicator || urlIndicator || storageIndicator || sessionIndicator;
}

export {
  detectCrisisContext,
  assessDeviceStress,
  detectPrivateBrowsing
};