import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const auth = admin.auth();

// Enhanced session validation with comprehensive error handling
export interface SessionValidationResult {
  valid: boolean;
  user?: {
    uid: string;
    email?: string | null;
    displayName?: string | null;
  };
  claims?: any;
  error?: string;
  expiresAt?: number;
  needsRefresh?: boolean;
}

export async function getSessionToken(request?: NextRequest): Promise<string | null> {
  try {
    if (request) {
      // Extract from request cookies
      return request.cookies.get('session')?.value || null;
    } else {
      // Extract from server cookies
      const cookieStore = await cookies();
      return cookieStore.get('session')?.value || null;
    }
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

export async function validateSession(request?: NextRequest): Promise<SessionValidationResult> {
  const sessionToken = await getSessionToken(request);
  
  if (!sessionToken) {
    return {
      valid: false,
      error: 'No session token found'
    };
  }

  try {
    // Verify the token as ID token (since we're using custom tokens)
    const decodedClaims = await auth.verifyIdToken(sessionToken);
    
    // Check if session is close to expiry (within 1 hour)
    const expiryTime = decodedClaims.exp * 1000;
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000;
    const needsRefresh = (expiryTime - currentTime) < oneHour;
    
    return {
      valid: true,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email || null,
        displayName: decodedClaims.name || null,
      },
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

    return {
      valid: false,
      error: error.message || 'Session verification failed'
    };
  }
}

export async function requireValidSession(): Promise<SessionValidationResult> {
  const result = await validateSession();
  
  if (!result.valid) {
    throw new Error(result.error || 'Authentication required');
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
    if (result.valid && result.user) {
      return {
        uid: result.user.uid,
        email: result.user.email,
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
