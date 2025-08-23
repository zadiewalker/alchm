import { cookies } from 'next/headers';
import { auth } from './firebaseAdmin';
import { AuthError, AuthErrorCode } from '../types/auth';

// Enhanced session validation with comprehensive error handling
export interface SessionValidationResult {
  valid: boolean;
  userId?: string;
  email?: string;
  claims?: any;
  error?: AuthError;
  expiresAt?: number;
  needsRefresh?: boolean;
}

export async function getSessionToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('alchm_session')?.value ?? cookieStore.get('__session')?.value ?? null;
  } catch (error) {
    console.error('[Session] getSessionToken error:', error);
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('alchm_refresh')?.value ?? null;
  } catch (error) {
    console.error('[Session] getRefreshToken error:', error);
    return null;
  }
}

export async function validateSession(): Promise<SessionValidationResult> {
  const sessionToken = await getSessionToken();
  
  if (!sessionToken) {
    return {
      valid: false,
      error: {
        code: AuthErrorCode.NO_SESSION,
        message: 'No session token found',
        userMessage: 'Please log in to continue'
      }
    };
  }

  try {
    // Verify the session cookie with Firebase Admin
    const decodedClaims = await auth.verifySessionCookie(sessionToken, true);
    
    // Check if session is close to expiry (within 1 hour)
    const expiryTime = decodedClaims.exp * 1000;
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000;
    const needsRefresh = (expiryTime - currentTime) < oneHour;
    
    return {
      valid: true,
      userId: decodedClaims.uid,
      email: decodedClaims.email,
      claims: decodedClaims,
      expiresAt: expiryTime,
      needsRefresh
    };
    
  } catch (error: any) {
    console.error('[Session] Validation failed:', {
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });

    // Map Firebase Auth errors to our error types
    let authError: AuthError;
    
    if (error.code === 'auth/session-cookie-expired') {
      authError = {
        code: AuthErrorCode.SESSION_EXPIRED,
        message: 'Session has expired',
        userMessage: 'Your session has expired. Please log in again.',
        canRefresh: true
      };
    } else if (error.code === 'auth/session-cookie-revoked') {
      authError = {
        code: AuthErrorCode.SESSION_REVOKED,
        message: 'Session was revoked',
        userMessage: 'Your session is no longer valid. Please log in again.',
        canRefresh: false
      };
    } else if (error.code === 'auth/invalid-session-cookie-claims') {
      authError = {
        code: AuthErrorCode.INVALID_CLAIMS,
        message: 'Invalid session claims',
        userMessage: 'Authentication error. Please log in again.',
        canRefresh: false
      };
    } else {
      authError = {
        code: AuthErrorCode.VERIFICATION_FAILED,
        message: error.message || 'Session verification failed',
        userMessage: 'Unable to verify your session. Please try logging in again.',
        canRefresh: true
      };
    }
    
    return {
      valid: false,
      error: authError
    };
  }
}

export async function requireValidSession(): Promise<SessionValidationResult> {
  const result = await validateSession();
  
  if (!result.valid) {
    throw new Error(result.error?.message || 'Authentication required');
  }
  
  return result;
}

// Enhanced session utilities for server components
export async function getServerSession() {
  try {
    const result = await validateSession();
    return result.valid ? result : null;
  } catch (error) {
    console.error('[Session] getServerSession error:', error);
    return null;
  }
}

export async function getUserFromSession() {
  try {
    const result = await validateSession();
    if (result.valid) {
      return {
        uid: result.userId!,
        email: result.email,
        claims: result.claims
      };
    }
    return null;
  } catch (error) {
    console.error('[Session] getUserFromSession error:', error);
    return null;
  }
}

// Session persistence helpers
export function createSessionCookieOptions(secure: boolean = true) {
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 14 * 24 * 60 * 60 // 14 days
  };
}

export function createRefreshCookieOptions(secure: boolean = true) {
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  };
}
