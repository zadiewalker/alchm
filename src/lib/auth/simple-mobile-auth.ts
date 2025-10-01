/**
 * Simplified Mobile Authentication for ALCHM
 * Production-ready authentication without complex dependencies
 */

import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getAuth,
  User
} from 'firebase/auth';
import { app } from '@/lib/firebase';

// Helper function to create session via API
async function createSessionAPI(user: User): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: user.uid,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Session creation failed:', error);
    return false;
  }
}

// Simple mobile detection
export function detectMobileCapabilities() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isIOS: false,
      isAndroid: false,
      supportsPopups: true,
      browserName: 'unknown'
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const supportsPopups = !isIOS; // iOS Safari often blocks popups

  return {
    isMobile,
    isIOS,
    isAndroid,
    supportsPopups,
    browserName: isIOS ? 'safari' : isAndroid ? 'chrome' : 'unknown'
  };
}

// Check if redirect is in progress
export function isRedirectInProgress(): boolean {
  if (typeof window === 'undefined') return false;
  
  const url = new URL(window.location.href);
  return url.searchParams.has('code') || url.searchParams.has('state');
}

// Pre-warm authentication (no-op for simplicity)
export function preWarmMobileAuth(): void {
  // Simple implementation - just log that we're pre-warming
  console.log('🔐 Pre-warming mobile auth...');
}

// Mobile-optimized Google sign-in
export async function signInWithGoogleMobile(): Promise<{
  user: User | null;
  error: string | null;
  authMethod?: string;
  requiresAgeVerification?: boolean;
}> {
  try {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    
    // Add scopes
    provider.addScope('profile');
    provider.addScope('email');
    
    const capabilities = detectMobileCapabilities();
    
    // Use redirect for iOS, popup for others
    if (capabilities.isIOS) {
      console.log('🔐 iOS detected - checking for redirect result...');
      
      // Check if we're returning from a redirect
      const redirectResult = await getRedirectResult(auth);
      
      if (redirectResult?.user) {
        console.log('🔐 Redirect auth successful');
        
        // Create session via API
        await createSessionAPI(redirectResult.user);
        
        return {
          user: redirectResult.user,
          error: null,
          authMethod: 'redirect',
          requiresAgeVerification: false
        };
      } else {
        // No redirect result, initiate redirect
        console.log('🔐 Starting redirect auth...');
        await signInWithRedirect(auth, provider);
        
        // This will cause navigation, return pending state
        return {
          user: null,
          error: null,
          authMethod: 'redirect_pending'
        };
      }
    } else {
      // Use popup for non-iOS devices
      console.log('🔐 Using popup auth...');
      const result = await signInWithPopup(auth, provider);
      
      // Create session via API
      await createSessionAPI(result.user);
      
      return {
        user: result.user,
        error: null,
        authMethod: 'popup',
        requiresAgeVerification: false
      };
    }
  } catch (error: any) {
    console.error('🚨 Mobile Google sign-in error:', error);
    
    let userFriendlyError = 'Authentication failed. Please try again.';
    
    if (error.code === 'auth/popup-blocked') {
      userFriendlyError = 'Popup blocked. Please allow popups and try again.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      userFriendlyError = 'Sign-in was cancelled. Take your time.';
    } else if (error.code === 'auth/network-request-failed') {
      userFriendlyError = 'Network error. Please check your connection.';
    }
    
    return {
      user: null,
      error: userFriendlyError,
      authMethod: 'failed'
    };
  }
}

// Standard email/password sign-in
export async function signInWithEmail(email: string, password: string): Promise<{
  user: User | null;
  error: string | null;
}> {
  try {
    const auth = getAuth(app);
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Create session via API
    await createSessionAPI(result.user);
    
    return {
      user: result.user,
      error: null
    };
  } catch (error: any) {
    console.error('🚨 Email sign-in error:', error);
    
    let userFriendlyError = 'Sign-in failed. Please check your credentials.';
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      userFriendlyError = 'Invalid email or password. Please try again.';
    } else if (error.code === 'auth/network-request-failed') {
      userFriendlyError = 'Network error. Please check your connection.';
    } else if (error.code === 'auth/too-many-requests') {
      userFriendlyError = 'Too many attempts. Please wait a moment and try again.';
    }
    
    return {
      user: null,
      error: userFriendlyError
    };
  }
}

// Create account with email/password
export async function createAccountWithEmail(email: string, password: string): Promise<{
  user: User | null;
  error: string | null;
}> {
  try {
    const auth = getAuth(app);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create session via API
    await createSessionAPI(result.user);
    
    return {
      user: result.user,
      error: null
    };
  } catch (error: any) {
    console.error('🚨 Account creation error:', error);
    
    let userFriendlyError = 'Account creation failed. Please try again.';
    
    if (error.code === 'auth/email-already-in-use') {
      userFriendlyError = 'An account with this email already exists.';
    } else if (error.code === 'auth/weak-password') {
      userFriendlyError = 'Password is too weak. Please choose a stronger password.';
    } else if (error.code === 'auth/invalid-email') {
      userFriendlyError = 'Invalid email address. Please check and try again.';
    }
    
    return {
      user: null,
      error: userFriendlyError
    };
  }
}

// Sign out
export async function signOutUser(): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const auth = getAuth(app);
    await signOut(auth);
    
    // Clear session via API
    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Session clearing error:', error);
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('🚨 Sign out error:', error);
    return { 
      success: false, 
      error: 'Sign out failed. Please try again.' 
    };
  }
}

// Validate auth domain (simplified)
export function validateAuthDomain(): boolean {
  if (typeof window === 'undefined') return true;
  
  const allowedDomains = [
    'alchmapp.web.app',
    'alchm-digital-sanctuary.web.app',
    'localhost:3000',
    'localhost:3001',
    'localhost:5000'
  ];
  
  const currentHost = window.location.host;
  return allowedDomains.some(domain => currentHost.includes(domain));
}

// Get current domain type
export function getCurrentDomainType(): 'primary' | 'secondary' | 'development' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';
  
  const host = window.location.host;
  
  if (host.includes('alchmapp.web.app')) return 'primary';
  if (host.includes('alchm-digital-sanctuary.web.app')) return 'secondary';
  if (host.includes('localhost')) return 'development';
  
  return 'unknown';
}

// Standard Google sign-in (fallback)
export async function signInWithGoogle(): Promise<{
  user: User | null;
  error: string | null;
  requiresAgeVerification: boolean;
}> {
  try {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await signInWithPopup(auth, provider);
    
    // Create session via API
    await createSessionAPI(result.user);
    
    return {
      user: result.user,
      error: null,
      requiresAgeVerification: false
    };
  } catch (error: any) {
    console.error('🚨 Google sign-in error:', error);
    
    let userFriendlyError = 'Google sign-in failed. Please try again.';
    
    if (error.code === 'auth/popup-blocked') {
      userFriendlyError = 'Popup blocked. Please allow popups and try again.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      userFriendlyError = 'Sign-in was cancelled.';
    }
    
    return {
      user: null,
      error: userFriendlyError,
      requiresAgeVerification: false
    };
  }
}