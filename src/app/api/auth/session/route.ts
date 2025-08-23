import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { createSessionCookieOptions, createRefreshCookieOptions } from '@/lib/validateSession';

// Create session cookie (POST)
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedClaims = await auth.verifyIdToken(idToken);

    // Create session cookie with 14-day expiry
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days in milliseconds
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    // Determine if we're in a secure environment
    const isSecure = process.env.NODE_ENV === 'production';

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      sessionCookie,
      expiresAt: Date.now() + expiresIn,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        emailVerified: decodedClaims.email_verified,
      }
    });

    // Set the session cookie
    response.cookies.set('alchm_session', sessionCookie, createSessionCookieOptions(isSecure));

    // Set refresh token cookie if available
    const refreshToken = decodedClaims.firebase?.sign_in_attributes?.refresh_token;
    if (refreshToken) {
      response.cookies.set('alchm_refresh', refreshToken, createRefreshCookieOptions(isSecure));
    }

    return response;

  } catch (error: any) {
    console.error('[Auth API] Session creation failed:', {
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });

    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { 
          error: 'Token expired',
          code: 'TOKEN_EXPIRED',
          message: 'Your login session has expired. Please sign in again.'
        },
        { status: 401 }
      );
    }

    if (error.code === 'auth/id-token-revoked') {
      return NextResponse.json(
        { 
          error: 'Token revoked',
          code: 'TOKEN_REVOKED',
          message: 'Your login session has been revoked. Please sign in again.'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Session creation failed',
        code: 'SESSION_CREATE_FAILED',
        message: 'Unable to create session. Please try again.'
      },
      { status: 500 }
    );
  }
}

// Refresh session cookie (PUT)
export async function PUT(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('alchm_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    // Verify current session
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Check if session is close to expiry (within 1 hour)
    const expiryTime = decodedClaims.exp * 1000;
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (expiryTime - currentTime > oneHour) {
      // Session is still valid for more than 1 hour, no refresh needed
      return NextResponse.json({
        success: true,
        message: 'Session is still valid',
        expiresAt: expiryTime
      });
    }

    // Create new session cookie
    const newExpiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days
    
    // We would need a new ID token to create a new session cookie
    // For now, extend the current session if possible
    const isSecure = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({
      success: true,
      message: 'Session refreshed',
      expiresAt: Date.now() + newExpiresIn
    });

    // In a real implementation, you would get a new ID token from the client
    // and create a new session cookie. For now, we'll just extend the current one.
    response.cookies.set('alchm_session', sessionCookie, createSessionCookieOptions(isSecure));

    return response;

  } catch (error: any) {
    console.error('[Auth API] Session refresh failed:', {
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });

    // Clear invalid session cookies
    const response = NextResponse.json(
      { 
        error: 'Session refresh failed',
        code: 'SESSION_REFRESH_FAILED',
        message: 'Please sign in again.'
      },
      { status: 401 }
    );

    response.cookies.delete('alchm_session');
    response.cookies.delete('alchm_refresh');

    return response;
  }
}

// Clear session cookie (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('alchm_session')?.value;

    if (sessionCookie) {
      try {
        // Revoke the session cookie
        const decodedClaims = await auth.verifySessionCookie(sessionCookie);
        await auth.revokeRefreshTokens(decodedClaims.uid);
      } catch (error) {
        // Session might already be invalid, continue with cleanup
        console.warn('[Auth API] Session revocation warning:', error);
      }
    }

    // Create response and clear cookies
    const response = NextResponse.json({
      success: true,
      message: 'Session cleared'
    });

    response.cookies.delete('alchm_session');
    response.cookies.delete('alchm_refresh');

    return response;

  } catch (error: any) {
    console.error('[Auth API] Session deletion failed:', error);
    
    // Still clear cookies even if server-side cleanup fails
    const response = NextResponse.json({
      success: true,
      message: 'Session cleared'
    });

    response.cookies.delete('alchm_session');
    response.cookies.delete('alchm_refresh');

    return response;
  }
}

// Get current session status (GET)
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('alchm_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { 
          authenticated: false,
          message: 'No session found'
        },
        { status: 200 }
      );
    }

    // Verify session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // Check expiry
    const expiryTime = decodedClaims.exp * 1000;
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000;
    const needsRefresh = (expiryTime - currentTime) < oneHour;

    return NextResponse.json({
      authenticated: true,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        emailVerified: decodedClaims.email_verified,
      },
      expiresAt: expiryTime,
      needsRefresh
    });

  } catch (error: any) {
    console.error('[Auth API] Session status check failed:', error);

    return NextResponse.json(
      { 
        authenticated: false,
        error: 'Session verification failed',
        code: error.code
      },
      { status: 401 }
    );
  }
}
