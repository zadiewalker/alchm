/**
 * Next.js Middleware for Security Headers
 * 
 * CRITICAL: Implements Content Security Policy and other security headers
 * required for healthcare applications handling sensitive mental health data
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRODUCTION_BLOCKED_ROUTES = new Set([
  '/debug-hooks',
  '/debug-react',
  '/test',
  '/test-hooks',
  '/test-simple',
]);

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function applySecurityHeaders(response: NextResponse, request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Content Security Policy - Strict for healthcare apps
  const cspPolicy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googleapis.com https://*.firebase.com https://*.firebaseapp.com https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://*.firebase.com https://*.firebaseapp.com https://*.googleapis.com https://*.gstatic.com https://*.stripe.com",
    "connect-src 'self' https://*.firebase.com https://*.firebaseapp.com https://*.firebaseio.com wss://*.firebaseio.com wss://*.firebase.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://api.stripe.com https://*.sentry.io",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspPolicy);

  // Additional security headers required for healthcare apps
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // HTTPS Strict Transport Security (HSTS) - Required for health data
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Permissions Policy - Disable unnecessary browser features
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
  );

  // Cache Control for sensitive pages
  if (pathname.includes('/admin') ||
      pathname.includes('/journal') ||
      pathname.includes('/crisis')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
}

export function middleware(request: NextRequest) {
  const normalizedPath = normalizePathname(request.nextUrl.pathname);

  if (process.env.NODE_ENV === 'production' && PRODUCTION_BLOCKED_ROUTES.has(normalizedPath)) {
    const blockedResponse = new NextResponse('Not Found', { status: 404 });
    applySecurityHeaders(blockedResponse, request);
    return blockedResponse;
  }

  // Create response with security headers
  const response = NextResponse.next();
  applySecurityHeaders(response, request);

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Skip internal Next.js paths and static files
    '/((?!_next/static|_next/image|favicon.ico|icon-|manifest.json).*)',
  ],
};
