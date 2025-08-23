import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get('alchm_session')?.value;

  // If no cookie, redirect to login for protected routes
  if (!sessionCookie) {
    if (
      req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/journal') ||
      req.nextUrl.pathname.startsWith('/badges')
    ) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    return NextResponse.next();
  }

  try {
    // Verify cookie with Firebase Admin
    const decodedClaims = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);

    // Attach user ID to request headers for SSR data fetching
    const response = NextResponse.next();
    response.headers.set('x-user-id', decodedClaims.uid);
    return response;
  } catch (error) {
    console.error('Session validation failed:', error);
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}

// Apply middleware to protected routes only
export const config = {
  matcher: ['/dashboard/:path*', '/journal/:path*', '/badges/:path*'],
};
