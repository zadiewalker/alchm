import { NextRequest, NextResponse } from 'next/server';

// ALCHM Route Guard Types
export type RouteType = 'public' | 'protected' | 'auth' | 'emergency' | 'admin';

export interface RouteGuardConfig {
  requireAuth: boolean;
  requireNoAuth: boolean;
  allowEmergencyAccess: boolean;
  requireAdmin: boolean;
  redirectOnFailure?: string;
  emergencyBypass: boolean;
}

// Route configurations
export const ROUTE_CONFIGS: Record<string, RouteGuardConfig> = {
  // Public routes - no auth required
  '/': { requireAuth: false, requireNoAuth: false, allowEmergencyAccess: true, requireAdmin: false, emergencyBypass: true },
  '/pricing': { requireAuth: false, requireNoAuth: false, allowEmergencyAccess: true, requireAdmin: false, emergencyBypass: false },
  '/about': { requireAuth: false, requireNoAuth: false, allowEmergencyAccess: true, requireAdmin: false, emergencyBypass: false },
  '/privacy': { requireAuth: false, requireNoAuth: false, allowEmergencyAccess: true, requireAdmin: false, emergencyBypass: false },
  '/terms': { requireAuth: false, requireNoAuth: false, allowEmergencyAccess: true, requireAdmin: false, emergencyBypass: false },
  '/contact': { requireAuth: false, requireNoAuth: false, allowEmergencyAccess: true, requireAdmin: false, emergencyBypass: false },
  
  // Emergency routes - always accessible
  '/emergency': { requireAuth: false, requireNoAuth: false, allowEmergencyAccess: true, requireAdmin: false, emergencyBypass: true },
  '/crisis': { requireAuth: false, requireNoAuth: false, allowEmergencyAccess: true, requireAdmin: false, emergencyBypass: true },
  '/emergency-safe': { requireAuth: false, requireNoAuth: false, allowEmergencyAccess: true, requireAdmin: false, emergencyBypass: true },
  '/crisis-resources': { requireAuth: false, requireNoAuth: false, allowEmergencyAccess: true, requireAdmin: false, emergencyBypass: true },
  
  // Auth routes - should redirect if already authenticated
  '/auth': { requireAuth: false, requireNoAuth: true, allowEmergencyAccess: false, requireAdmin: false, redirectOnFailure: '/dashboard', emergencyBypass: false },
  '/auth/login': { requireAuth: false, requireNoAuth: true, allowEmergencyAccess: false, requireAdmin: false, redirectOnFailure: '/dashboard', emergencyBypass: false },
  '/auth/signup': { requireAuth: false, requireNoAuth: true, allowEmergencyAccess: false, requireAdmin: false, redirectOnFailure: '/dashboard', emergencyBypass: false },
  
  // Protected routes - require authentication
  '/dashboard': { requireAuth: true, requireNoAuth: false, allowEmergencyAccess: false, requireAdmin: false, redirectOnFailure: '/auth/login', emergencyBypass: false },
  '/journal': { requireAuth: true, requireNoAuth: false, allowEmergencyAccess: false, requireAdmin: false, redirectOnFailure: '/auth/login', emergencyBypass: false },
  '/journals': { requireAuth: true, requireNoAuth: false, allowEmergencyAccess: false, requireAdmin: false, redirectOnFailure: '/auth/login', emergencyBypass: false },
  '/profile': { requireAuth: true, requireNoAuth: false, allowEmergencyAccess: false, requireAdmin: false, redirectOnFailure: '/auth/login', emergencyBypass: false },
  '/settings': { requireAuth: true, requireNoAuth: false, allowEmergencyAccess: false, requireAdmin: false, redirectOnFailure: '/auth/login', emergencyBypass: false },
  '/pathways': { requireAuth: true, requireNoAuth: false, allowEmergencyAccess: false, requireAdmin: false, redirectOnFailure: '/auth/login', emergencyBypass: false },
  '/khepera': { requireAuth: true, requireNoAuth: false, allowEmergencyAccess: false, requireAdmin: false, redirectOnFailure: '/auth/login', emergencyBypass: false },
  
  // Admin routes
  '/admin': { requireAuth: true, requireNoAuth: false, allowEmergencyAccess: false, requireAdmin: true, redirectOnFailure: '/dashboard', emergencyBypass: false },
};

// Get route configuration for a path
export function getRouteConfig(pathname: string): RouteGuardConfig {
  // Remove locale prefix for route matching
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '') || '/';
  
  // Find exact match first
  if (ROUTE_CONFIGS[pathWithoutLocale]) {
    return ROUTE_CONFIGS[pathWithoutLocale];
  }
  
  // Find prefix match
  for (const [route, config] of Object.entries(ROUTE_CONFIGS)) {
    if (pathWithoutLocale.startsWith(route) && route !== '/') {
      return config;
    }
  }
  
  // Default to protected if no match found
  return {
    requireAuth: true,
    requireNoAuth: false,
    allowEmergencyAccess: false,
    requireAdmin: false,
    redirectOnFailure: '/auth/login',
    emergencyBypass: false
  };
}

// Enhanced session validation for middleware
export function hasValidSession(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get('alchm_session')?.value || request.cookies.get('__session')?.value;
  const authToken = request.headers.get('authorization');
  
  // Check for session cookie
  if (sessionCookie) {
    try {
      // Basic validation - check if it looks like a valid session cookie
      // In middleware, we can't do full JWT verification, but we can do basic checks
      return sessionCookie.length > 20 && sessionCookie.includes('.');
    } catch {
      return false;
    }
  }
  
  // Check for auth header
  if (authToken && authToken.startsWith('Bearer ')) {
    const token = authToken.substring(7);
    return token.length > 20 && token.includes('.');
  }
  
  return false;
}

// Check if user is admin
export function isAdmin(request: NextRequest): boolean {
  const adminCookie = request.cookies.get('alchm_admin')?.value;
  const userRole = request.headers.get('x-user-role');
  
  return adminCookie === 'true' || userRole === 'admin';
}

// Enhanced route guard with performance optimizations
export function applyRouteGuard(
  request: NextRequest,
  pathname: string,
  locale: string
): NextResponse | null {
  const config = getRouteConfig(pathname);
  const hasSession = hasValidSession(request);
  const userIsAdmin = isAdmin(request);
  
  // Emergency bypass - always allow emergency routes with performance optimization
  if (config.emergencyBypass) {
    const response = NextResponse.next();
    response.headers.set('x-alchm-emergency', 'true');
    response.headers.set('x-alchm-priority', 'crisis');
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('X-Priority', 'u=0'); // Highest priority for crisis routes
    return response;
  }
  
  // Admin route protection
  if (config.requireAdmin && (!hasSession || !userIsAdmin)) {
    const redirectUrl = new URL(`/${locale}/dashboard`, request.url);
    const response = NextResponse.redirect(redirectUrl, 307);
    response.headers.set('x-redirect-reason', 'admin-required');
    return response;
  }
  
  // Authentication required
  if (config.requireAuth && !hasSession) {
    const redirectUrl = new URL(`/${locale}${config.redirectOnFailure || '/auth/login'}`, request.url);
    // Preserve original destination for post-login redirect
    redirectUrl.searchParams.set('redirect', encodeURIComponent(pathname));
    const response = NextResponse.redirect(redirectUrl, 307);
    response.headers.set('x-redirect-reason', 'auth-required');
    response.headers.set('x-auth-redirect', 'true');
    return response;
  }
  
  // Should not be authenticated (auth pages) - redirect to dashboard if already logged in
  if (config.requireNoAuth && hasSession) {
    const redirectUrl = new URL(`/${locale}${config.redirectOnFailure || '/dashboard'}`, request.url);
    const response = NextResponse.redirect(redirectUrl, 307);
    response.headers.set('x-redirect-reason', 'already-authenticated');
    return response;
  }
  
  // Allow through with enhanced headers for performance monitoring
  const response = NextResponse.next();
  response.headers.set('x-alchm-locale', locale);
  response.headers.set('x-route-config', JSON.stringify({
    requireAuth: config.requireAuth,
    requireAdmin: config.requireAdmin,
    emergency: config.emergencyBypass
  }));
  
  if (hasSession) {
    response.headers.set('x-has-session', 'true');
    response.headers.set('x-authenticated', 'true');
  }
  
  if (userIsAdmin) {
    response.headers.set('x-is-admin', 'true');
    response.headers.set('x-admin-access', 'granted');
  }
  
  // Performance optimization for protected routes
  if (config.requireAuth && hasSession) {
    response.headers.set('x-protected-route', 'true');
    response.headers.set('Cache-Control', 'private, max-age=300'); // 5 minute cache for authenticated users
  }
  
  return response;
}

// Performance monitoring for route guards
export function logRouteAccess(
  pathname: string,
  locale: string,
  hasSession: boolean,
  duration: number
): void {
  // In production, this would log to analytics
  if (process.env.NODE_ENV === 'development') {
    console.log(`Route access: ${pathname} (${locale}) - Auth: ${hasSession} - ${duration}ms`);
  }
}