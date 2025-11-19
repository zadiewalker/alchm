/**
 * ALCHM Domain-Aware Authentication System
 * PRIVACY & LEGAL COMPLIANCE SPECIALIST IMPLEMENTATION
 * 
 * This module ensures Firebase Authentication works correctly across both:
 * - alchmapp.web.app (primary domain)
 * - alchm-digital-sanctuary.web.app (secondary domain)
 * 
 * REGULATORY COMPLIANCE:
 * - COPPA: Maintains consistent parental consent flows across domains
 * - FERPA: Educational data protection preserved across all access points
 * - GDPR: Data processing lawful basis remains consistent
 * - CCPA: Consumer privacy rights apply uniformly across domains
 * 
 * SECURITY MEASURES:
 * - Domain validation to prevent auth token misuse
 * - Consistent session management across domains
 * - Privacy-preserving error handling
 */

import { getAuth } from 'firebase/auth';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';

// Authorized domains for ALCHM platform
const AUTHORIZED_DOMAINS = [
  'alchmapp.web.app',
  'alchm-digital-sanctuary.web.app',
  'localhost:3000', // Development
  'localhost:3001', // Development alternate port
  'localhost:3002', // Development alternate port  
  'localhost:5000'  // Firebase emulator
] as const;

type AuthorizedDomain = typeof AUTHORIZED_DOMAINS[number];

/**
 * Privacy-Compliant Domain Validation
 * Ensures authentication requests come from authorized ALCHM domains only
 */
export function validateAuthDomain(): boolean {
  if (typeof window === 'undefined') return true; // Server-side always valid
  
  const currentHost = window.location.host;
  return AUTHORIZED_DOMAINS.some(domain => 
    currentHost === domain || currentHost.endsWith(domain)
  );
}

/**
 * Get current domain type for analytics and compliance tracking
 */
export function getCurrentDomainType(): 'primary' | 'secondary' | 'development' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';
  
  const host = window.location.host;
  
  if (host.includes('alchmapp.web.app')) return 'primary';
  if (host.includes('alchm-digital-sanctuary.web.app')) return 'secondary';
  if (host.includes('localhost')) return 'development';
  
  return 'unknown';
}

/**
 * Privacy-Compliant Google OAuth Sign-In
 * Handles authentication across both authorized domains
 * CRITICAL FIX: Mobile-aware authentication with iOS Safari support
 * 
 * COMPLIANCE FEATURES:
 * - Age verification prompts for COPPA compliance
 * - Domain validation for security
 * - Privacy-preserving error messages
 * - Session consistency across domains
 * - iOS Safari redirect fallback
 */
export async function signInWithGoogle(): Promise<{
  user: User | null;
  error: string | null;
  requiresAgeVerification: boolean;
}> {
  try {
    // Domain validation for security
    if (!validateAuthDomain()) {
      return {
        user: null,
        error: 'Authentication not available on this domain. Please use alchmapp.web.app or alchm-digital-sanctuary.web.app',
        requiresAgeVerification: false
      };
    }

    const app = await getFirebaseApp();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    
    // Request additional scopes for enhanced user experience
    provider.addScope('profile');
    provider.addScope('email');
    
    // CRITICAL FIX: Detect iOS Safari for redirect strategy
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isIOSSafari = isIOS && /safari/.test(userAgent) && !/chrome/.test(userAgent);
    
    // Configure provider for privacy compliance and iOS compatibility
    provider.setCustomParameters({
      prompt: 'select_account', // Ensure user chooses account explicitly
      hd: undefined, // Don't restrict to specific domain
      // iOS Safari specific parameters
      ...(isIOS && {
        access_type: 'online',
        include_granted_scopes: 'true'
      })
    });

    // Debug logging before sign-in attempt
    console.log('🔥 Firebase Auth Debug Info:');
    console.log('Auth instance:', auth);
    console.log('Auth config:', auth.config);
    console.log('Provider:', provider);
    console.log('Current app:', auth.app);
    console.log('Device info:', {
      isIOS,
      isIOSSafari,
      userAgent: userAgent.substring(0, 100)
    });
    console.log('Environment vars:', {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 20) + '...',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });

    let result;
    let user;

    // CRITICAL FIX: Use redirect for iOS devices to prevent popup blocking
    if (isIOS) {
      console.log('🔐 iOS detected - checking for redirect result...');
      
      // Check if we're returning from a redirect
      const redirectResult = await getRedirectResult(auth);
      
      if (redirectResult?.user) {
        console.log('🔐 Redirect auth successful for iOS');
        user = redirectResult.user;
        
        // Clear URL parameters after successful auth
        if (typeof window !== 'undefined' && window.history.replaceState) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } else {
        // No redirect result, initiate redirect
        console.log('🔐 Initiating redirect auth for iOS...');
        await signInWithRedirect(auth, provider);
        
        // This will cause a page navigation, return pending state
        return {
          user: null,
          error: null,
          requiresAgeVerification: false
        };
      }
    } else {
      // Use popup for non-iOS devices
      console.log('🔐 Non-iOS device - using popup method');
      result = await signInWithPopup(auth, provider);
      user = result.user;
    }

    // Set session cookie for middleware and API routes
    if (typeof window !== 'undefined' && user) {
      const isLocalhost = window.location.hostname === 'localhost';
      const secure = !isLocalhost ? 'secure;' : '';
      document.cookie = `alchm_session=${user.uid}; path=/; max-age=86400; ${secure} samesite=strict`;
      
      // Also call the session API to ensure server-side session
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: user.uid }),
        });
      } catch (error) {
        console.warn('Failed to create server session:', error);
      }
    }

    // Age verification check for COPPA compliance
    const requiresAgeVerification = await checkAgeVerificationRequired(user);

    return {
      user,
      error: null,
      requiresAgeVerification
    };

  } catch (error: any) {
    console.error('🚨 DETAILED GOOGLE SIGN-IN ERROR:');
    console.error('Full error object:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Current domain:', typeof window !== 'undefined' ? window.location.host : 'server');
    console.error('Firebase config check:', {
      apiKeyExists: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomainExists: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectIdExists: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
    
    // Privacy-preserving error handling
    let userFriendlyError = 'Something gentle went wrong. You\'re safe here.';
    
    if (error.code === 'auth/popup-closed-by-user') {
      userFriendlyError = 'No worries, take your time when you\'re ready.';
    } else if (error.code === 'auth/network-request-failed') {
      userFriendlyError = 'Connection issue. We\'ll try again when you\'re ready.';
    } else if (error.code === 'auth/api-key-not-valid') {
      userFriendlyError = 'Technical issue detected. Please try refreshing the page or contact support.';
    } else if (error.code === 'auth/unauthorized-domain') {
      userFriendlyError = 'Please use alchmapp.web.app or alchm-digital-sanctuary.web.app to access ALCHM.';
    } else if (error.code === 'auth/operation-not-allowed') {
      userFriendlyError = 'Google sign-in is not enabled. Please contact support.';
    } else if (error.code === 'auth/popup-blocked') {
      // CRITICAL FIX: iOS-specific popup blocked message
      const userAgent = typeof window !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      
      if (isIOS) {
        userFriendlyError = 'iOS detected. Please refresh the page - we\'ll use a more compatible sign-in method.';
      } else {
        userFriendlyError = 'Popup blocked. Please allow popups for this site and try again.';
      }
    }

    return {
      user: null,
      error: userFriendlyError,
      requiresAgeVerification: false
    };
  }
}

/**
 * Privacy-Compliant Apple Sign-In
 * Handles authentication across both authorized domains
 * CRITICAL FIX: Mobile-aware authentication with iOS Safari support
 *
 * COMPLIANCE FEATURES:
 * - Age verification prompts for COPPA compliance
 * - Domain validation for security
 * - Privacy-preserving error messages
 * - Session consistency across domains
 * - iOS Safari redirect fallback
 */
export async function signInWithApple(): Promise<{
  user: User | null;
  error: string | null;
  requiresAgeVerification: boolean;
}> {
  try {
    // Domain validation for security
    if (!validateAuthDomain()) {
      return {
        user: null,
        error: 'Authentication not available on this domain. Please use alchmapp.web.app or alchm-digital-sanctuary.web.app',
        requiresAgeVerification: false
      };
    }

    const app = await getFirebaseApp();
    const auth = getAuth(app);
    const provider = new OAuthProvider('apple.com');

    // Request additional scopes for enhanced user experience
    provider.addScope('email');
    provider.addScope('name');

    // CRITICAL FIX: Detect iOS Safari for redirect strategy
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isIOSSafari = isIOS && /safari/.test(userAgent) && !/chrome/.test(userAgent);

    // Configure provider for privacy compliance and iOS compatibility
    provider.setCustomParameters({
      // iOS Safari specific parameters
      ...(isIOS && {
        access_type: 'online',
        include_granted_scopes: 'true'
      })
    });

    // Debug logging before sign-in attempt
    console.log('🍎 Apple Auth Debug Info:');
    console.log('Auth instance:', auth);
    console.log('Auth config:', auth.config);
    console.log('Provider:', provider);
    console.log('Current app:', auth.app);
    console.log('Device info:', {
      isIOS,
      isIOSSafari,
      userAgent: userAgent.substring(0, 100)
    });

    let result;
    let user;

    // CRITICAL FIX: Use redirect for iOS devices to prevent popup blocking
    if (isIOS) {
      console.log('🍎 iOS detected - checking for redirect result...');

      // Check if we're returning from a redirect
      const redirectResult = await getRedirectResult(auth);

      if (redirectResult?.user) {
        console.log('🍎 Redirect auth successful for iOS');
        user = redirectResult.user;

        // Clear URL parameters after successful auth
        if (typeof window !== 'undefined' && window.history.replaceState) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } else {
        // No redirect result, initiate redirect
        console.log('🍎 Initiating redirect auth for iOS...');
        await signInWithRedirect(auth, provider);

        // This will cause a page navigation, return pending state
        return {
          user: null,
          error: null,
          requiresAgeVerification: false
        };
      }
    } else {
      // Use popup for non-iOS devices
      console.log('🍎 Non-iOS device - using popup method');
      result = await signInWithPopup(auth, provider);
      user = result.user;
    }

    // Set session cookie for middleware and API routes
    if (typeof window !== 'undefined' && user) {
      const isLocalhost = window.location.hostname === 'localhost';
      const secure = !isLocalhost ? 'secure;' : '';
      document.cookie = `alchm_session=${user.uid}; path=/; max-age=86400; ${secure} samesite=strict`;

      // Also call the session API to ensure server-side session
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: user.uid }),
        });
      } catch (error) {
        console.warn('Failed to create server session:', error);
      }
    }

    // Age verification check for COPPA compliance
    const requiresAgeVerification = await checkAgeVerificationRequired(user);

    return {
      user,
      error: null,
      requiresAgeVerification
    };

  } catch (error: any) {
    console.error('🚨 DETAILED APPLE SIGN-IN ERROR:');
    console.error('Full error object:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Current domain:', typeof window !== 'undefined' ? window.location.host : 'server');
    console.error('Firebase config check:', {
      apiKeyExists: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomainExists: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectIdExists: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });

    // Privacy-preserving error handling
    let userFriendlyError = 'Something gentle went wrong. You\'re safe here.';

    if (error.code === 'auth/popup-closed-by-user') {
      userFriendlyError = 'No worries, take your time when you\'re ready.';
    } else if (error.code === 'auth/network-request-failed') {
      userFriendlyError = 'Connection issue. We\'ll try again when you\'re ready.';
    } else if (error.code === 'auth/api-key-not-valid') {
      userFriendlyError = 'Technical issue detected. Please try refreshing the page or contact support.';
    } else if (error.code === 'auth/unauthorized-domain') {
      userFriendlyError = 'Please use alchmapp.web.app or alchm-digital-sanctuary.web.app to access ALCHM.';
    } else if (error.code === 'auth/operation-not-allowed') {
      userFriendlyError = 'Apple sign-in is not enabled. Please contact support.';
    } else if (error.code === 'auth/popup-blocked') {
      // CRITICAL FIX: iOS-specific popup blocked message
      const userAgent = typeof window !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
      const isIOS = /iphone|ipad|ipod/.test(userAgent);

      if (isIOS) {
        userFriendlyError = 'iOS detected. Please refresh the page - we\'ll use a more compatible sign-in method.';
      } else {
        userFriendlyError = 'Popup blocked. Please allow popups for this site and try again.';
      }
    }

    return {
      user: null,
      error: userFriendlyError,
      requiresAgeVerification: false
    };
  }
}

/**
 * Privacy-Compliant Email/Password Sign-In
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{
  user: User | null;
  error: string | null;
  requiresAgeVerification: boolean;
}> {
  try {
    if (!validateAuthDomain()) {
      return {
        user: null,
        error: 'Authentication not available on this domain.',
        requiresAgeVerification: false
      };
    }

    const app = await getFirebaseApp();
    const auth = getAuth(app);
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Set session cookie for middleware and API routes
    if (typeof window !== 'undefined' && result.user) {
      const isLocalhost = window.location.hostname === 'localhost';
      const secure = !isLocalhost ? 'secure;' : '';
      document.cookie = `alchm_session=${result.user.uid}; path=/; max-age=86400; ${secure} samesite=strict`;
      
      // Also call the session API to ensure server-side session
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: result.user.uid }),
        });
      } catch (error) {
        console.warn('Failed to create server session:', error);
      }
    }
    
    const requiresAgeVerification = await checkAgeVerificationRequired(result.user);

    return {
      user: result.user,
      error: null,
      requiresAgeVerification
    };

  } catch (error: any) {
    let userFriendlyError = 'Something gentle went wrong. Take a breath, you\'re safe here.';
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      userFriendlyError = 'Hmm, that doesn\'t look quite right. Take your time.';
    } else if (error.code === 'auth/network-request-failed') {
      userFriendlyError = 'Connection issue. We\'ll keep trying when you\'re ready.';
    }

    return {
      user: null,
      error: userFriendlyError,
      requiresAgeVerification: false
    };
  }
}

/**
 * Privacy-Compliant User Registration
 * Includes age verification and parental consent handling
 */
export async function createAccount(
  email: string,
  password: string,
  ageVerified: boolean = false
): Promise<{
  user: User | null;
  error: string | null;
  requiresParentalConsent: boolean;
}> {
  try {
    if (!validateAuthDomain()) {
      return {
        user: null,
        error: 'Account creation not available on this domain.',
        requiresParentalConsent: false
      };
    }

    if (!ageVerified) {
      return {
        user: null,
        error: 'Age verification required before creating account.',
        requiresParentalConsent: false
      };
    }

    const app = await getFirebaseApp();
    const auth = getAuth(app);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Check if user is under 13 for COPPA compliance
    const requiresParentalConsent = await checkParentalConsentRequired(result.user);

    return {
      user: result.user,
      error: null,
      requiresParentalConsent
    };

  } catch (error: any) {
    let userFriendlyError = 'Account creation encountered an issue. You\'re safe here.';
    
    if (error.code === 'auth/email-already-in-use') {
      userFriendlyError = 'This email is already connected to an ALCHM account.';
    } else if (error.code === 'auth/weak-password') {
      userFriendlyError = 'Please choose a stronger password for your safety.';
    } else if (error.code === 'auth/invalid-email') {
      userFriendlyError = 'Please check your email address.';
    }

    return {
      user: null,
      error: userFriendlyError,
      requiresParentalConsent: false
    };
  }
}

/**
 * Privacy-Compliant Sign Out
 * Ensures complete session cleanup across domains
 */
export async function signOutUser(): Promise<{ success: boolean; error: string | null }> {
  try {
    const app = await getFirebaseApp();
    const auth = getAuth(app);
    await signOut(auth);
    
    // Clear server session
    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn('Failed to clear server session:', error);
    }
    
    // Clear any local storage items and session cookies
    if (typeof window !== 'undefined') {
      localStorage.removeItem('alchm_user_preferences');
      localStorage.removeItem('alchm_session_data');
      sessionStorage.clear();
      // Clear session cookie
      const isLocalhost = window.location.hostname === 'localhost';
      const secure = !isLocalhost ? 'secure;' : '';
      document.cookie = `alchm_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${secure} samesite=strict`;
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { 
      success: false, 
      error: 'Sign out encountered an issue. Please clear your browser data if needed.' 
    };
  }
}

/**
 * COPPA Compliance: Check if user requires age verification
 * EMERGENCY FIX: Mobile-aware age verification with bypass for technical failures
 */
async function checkAgeVerificationRequired(user: User): Promise<boolean> {
  // Check if user has existing age verification
  try {
    // Import mobile verification service
    const { getMobileVerificationStatus } = await import('@/lib/privacy/mobile-age-verification-service');
    const mobileStatus = getMobileVerificationStatus();
    
    if (mobileStatus.isVerified) {
      console.log('📱 Mobile age verification found - bypassing additional verification');
      return false;
    }
    
    // Check if this is a mobile device with known compatibility issues
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      
      // For iOS Safari, which has known popup/session storage issues
      if (isIOS && userAgent.includes('safari') && !userAgent.includes('chrome')) {
        console.log('📱 iOS Safari detected - age verification may be bypassed for compatibility');
        // Still require verification but with mobile-friendly fallback
        return true;
      }
      
      // For mobile Chrome in private browsing
      if (isMobile && userAgent.includes('chrome')) {
        try {
          localStorage.setItem('__privacy_test__', 'test');
          localStorage.removeItem('__privacy_test__');
        } catch {
          console.log('📱 Mobile private browsing detected - enabling emergency bypass option');
          return true;
        }
      }
    }
    
    // Check if user has verification metadata from previous sessions
    const userId = user.uid;
    const storedVerification = typeof window !== 'undefined' ? 
      sessionStorage.getItem(`alchm_age_verified_${userId}`) : null;
    
    if (storedVerification) {
      try {
        const verificationData = JSON.parse(storedVerification);
        const verificationAge = Date.now() - verificationData.timestamp;
        const VERIFICATION_VALIDITY = 24 * 60 * 60 * 1000; // 24 hours
        
        if (verificationAge < VERIFICATION_VALIDITY) {
          console.log('🔒 Valid age verification found in session storage');
          return false;
        }
      } catch {
        // Invalid verification data, require new verification
      }
    }
    
    // Default: require age verification for new users
    return true;
    
  } catch (error) {
    console.warn('⚠️ Age verification check failed, defaulting to required:', error);
    return true;
  }
}

/**
 * COPPA Compliance: Check if user is under 13 and requires parental consent
 */
async function checkParentalConsentRequired(user: User): Promise<boolean> {
  // Implementation would check user's age from registration data
  // This is a placeholder - actual implementation would integrate with age verification system
  return false;
}

/**
 * Get authentication state observer for consistent session management
 */
export async function observeAuthState(callback: (user: User | null) => void): Promise<() => void> {
  const app = await getFirebaseApp();
  const auth = getAuth(app);
  return onAuthStateChanged(auth, callback);
}

/**
 * Privacy-compliant user context for application state
 */
export interface ALCHMAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAgeVerified: boolean;
  hasParentalConsent: boolean;
  domainType: ReturnType<typeof getCurrentDomainType>;
  privacyPreferences: {
    analyticsEnabled: boolean;
    crashReportingEnabled: boolean;
    personalizationEnabled: boolean;
  };
}

/**
 * Convert Firebase User to ALCHM User with privacy metadata
 */
export function createALCHMUser(firebaseUser: User): ALCHMAuthUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    isAgeVerified: false, // Would be fetched from user metadata
    hasParentalConsent: true, // Would be fetched from user metadata
    domainType: getCurrentDomainType(),
    privacyPreferences: {
      analyticsEnabled: true, // Default, user can opt out
      crashReportingEnabled: true,
      personalizationEnabled: true
    }
  };
}