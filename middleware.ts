import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ALCHM Supported Locales Configuration
const SUPPORTED_LOCALES = [
  'en', // English (default)
  'es', // Spanish
  'pt', // Portuguese 
  'sw', // Swahili
  'ar', // Arabic
  'hi', // Hindi
  'zh', // Chinese (Simplified)
  'fr', // French
  'yo', // Yoruba
  'ko', // Korean
  'de', // German
] as const;

type SupportedLocale = typeof SUPPORTED_LOCALES[number];
const DEFAULT_LOCALE: SupportedLocale = 'en';

// Locale detection from request headers
function detectLocale(request: NextRequest): SupportedLocale {
  // 1. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
  const preferredLanguages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase())
    .map(lang => lang.split('-')[0]); // Extract primary language code

  // Find first supported locale from user preferences
  for (const preferred of preferredLanguages) {
    if (SUPPORTED_LOCALES.includes(preferred as SupportedLocale)) {
      return preferred as SupportedLocale;
    }
  }

  // Fallback to default locale
  return DEFAULT_LOCALE;
}

// Check if pathname is missing locale prefix
function isLocaleMissing(pathname: string): boolean {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  return !SUPPORTED_LOCALES.includes(firstSegment as SupportedLocale);
}

// ALCHM Universal Language Router & Locale-Aware Middleware
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const sessionCookie = req.cookies.get('alchm_session')?.value;

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // LOCALE ROUTING LOGIC - Handle missing locale prefix
  if (isLocaleMissing(pathname)) {
    const detectedLocale = detectLocale(req);
    
    // Special handling for root path
    if (pathname === '/') {
      const onboardingUrl = new URL(`/${detectedLocale}/onboarding${search}`, req.url);
      return NextResponse.redirect(onboardingUrl);
    }
    
    // For other paths, add locale prefix
    const localizedUrl = new URL(`/${detectedLocale}${pathname}${search}`, req.url);
    return NextResponse.redirect(localizedUrl);
  }

  // Extract current locale from path
  const currentLocale = pathname.split('/')[1] as SupportedLocale;
  
  // Validate locale exists in supported list
  if (!SUPPORTED_LOCALES.includes(currentLocale)) {
    const fallbackUrl = new URL(`/${DEFAULT_LOCALE}${pathname}${search}`, req.url);
    return NextResponse.redirect(fallbackUrl);
  }

  // Remove locale prefix for route matching
  const localizedPath = pathname.replace(`/${currentLocale}`, '') || '/';

  // Protected routes that require authentication (without locale prefix)
  const protectedRoutes = [
    '/dashboard',
    '/journals', 
    '/reflection',
    '/profile',
    '/settings',
    '/khepera'
  ];

  // Routes that should redirect authenticated users away
  const authRoutes = ['/auth', '/login', '/signup'];
  
  // Public routes that never require authentication
  const publicRoutes = [
    '/',
    '/onboarding',
    '/about',
    '/privacy',
    '/terms',
    '/contact'
  ];

  const isProtectedRoute = protectedRoutes.some(route => localizedPath.startsWith(route));
  const isAuthRoute = authRoutes.some(route => localizedPath.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => localizedPath === route || localizedPath.startsWith(route));

  // Handle public routes - always allow
  if (isPublicRoute) {
    const response = NextResponse.next();
    response.headers.set('x-alchm-locale', currentLocale);
    return response;
  }

  // Handle authentication routes - redirect if session exists
  if (isAuthRoute && sessionCookie) {
    const dashboardUrl = new URL(`/${currentLocale}/dashboard`, req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!sessionCookie) {
      // No session cookie - redirect to localized auth
      const authUrl = new URL(`/${currentLocale}/auth`, req.url);
      authUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(authUrl);
    }

    // Session exists - add locale to headers and continue
    const response = NextResponse.next();
    response.headers.set('x-alchm-locale', currentLocale);
    response.headers.set('x-has-session', 'true');
    return response;
  }

  // Default: add locale to headers and continue
  const response = NextResponse.next();
  response.headers.set('x-alchm-locale', currentLocale);
  return response;
}

// Locale-aware matcher configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (/api/*)
     * - Static files (/_next/static/*)
     * - Image optimization (/_next/image/*)
     * - Public assets with file extensions
     * - Manifest and service worker files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};