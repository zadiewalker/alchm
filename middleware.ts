import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applyRouteGuard, logRouteAccess } from './src/lib/routeGuards';
import { 
  detectLocale, 
  detectCrisisLocale,
  isLocaleMissing, 
  isValidLocale,
  getLocaleFromPathname,
  measureLocaleDetection,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type SupportedLocale 
} from './src/lib/localeDetection';
import {
  detectCrisisRequest,
  getCrisisRoute,
  createCrisisResponse,
  handlePanicButton,
  logCrisisAccess,
  optimizeForCrisis,
  enhanceAccessibility,
  getCrisisPreloadHeaders
} from './src/lib/crisisRouting';
// Edge-compatible crisis safety system
import { edgeCrisisSafetyMiddleware } from './src/middleware/crisis-safety-middleware-edge';

// ALCHM Universal Language Router & Locale-Aware Middleware
export async function middleware(req: NextRequest) {
  const startTime = Date.now();
  const { pathname, search } = req.nextUrl;
  const sessionCookie = req.cookies.get('alchm_session')?.value;

  // CRITICAL: Crisis safety middleware intercepts ALL interactions FIRST
  // This runs before any business logic and can override everything
  // EDGE RUNTIME COMPATIBLE: Using lightweight edge-compatible crisis detection
  try {
    const crisisInterception = await edgeCrisisSafetyMiddleware.interceptUserInteraction(
      req,
      undefined, // Content will be extracted from request
      undefined, // User ID will be extracted from session
      { pathname, startTime }
    );

    // If crisis safety system requests emergency response, return immediately
    if (crisisInterception.emergencyResponse) {
      return crisisInterception.emergencyResponse;
    }

    // If business metrics are suspended, add crisis headers
    if (crisisInterception.businessMetricsSuspended) {
      const response = NextResponse.next();
      response.headers.set('X-Crisis-Business-Metrics-Suspended', 'true');
      response.headers.set('X-Crisis-Override-State', crisisInterception.overrideState);
      response.headers.set('X-Crisis-Safety-Active', 'true');
      
      // Continue with modified headers for crisis-aware processing
      return response;
    }

  } catch (error) {
    // FAILSAFE: Never let crisis safety middleware failure break the app
    console.error('Crisis safety middleware error - continuing with standard flow', error);
  }

  // PRIORITY: Handle panic button immediately
  const panicResponse = handlePanicButton(req);
  if (panicResponse) {
    return panicResponse;
  }

  // Enhanced static asset detection - prevent redirect loops
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/sw.js' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/apple-touch-icon') ||
    pathname.startsWith('/android-chrome') ||
    pathname.startsWith('/mstile') ||
    pathname === '/browserconfig.xml' ||
    pathname === '/safari-pinned-tab.svg' ||
    // Static assets with extensions (including locale-prefixed static files)
    (pathname.includes('.') && 
      (pathname.match(/\.(json|html|css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|webp|xml|txt)$/) ||
       SUPPORTED_LOCALES.some(locale => pathname.startsWith(`/${locale}/`) && pathname.substring(locale.length + 2).includes('.'))))
  ) {
    // Handle locale-prefixed static files by rewriting to actual public file path
    for (const locale of SUPPORTED_LOCALES) {
      if (pathname.startsWith(`/${locale}/`) && pathname.includes('.')) {
        const staticFilePath = pathname.substring(locale.length + 2); // Remove /locale/ prefix
        const rewriteUrl = new URL(`/${staticFilePath}`, req.url);
        const response = NextResponse.rewrite(rewriteUrl);
        response.headers.set('x-alchm-static-rewrite', 'true');
        response.headers.set('x-alchm-original-path', pathname);
        return response;
      }
    }

    const response = NextResponse.next();
    // Cache static assets for performance
    if (pathname.startsWith('/_next/static/') || pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    return response;
  }

  // LOCALE ROUTING LOGIC - Handle missing locale prefix with loop prevention
  if (isLocaleMissing(pathname)) {
    // Prevent redirect loops by checking if we're already in a redirect cycle
    const redirectHeader = req.headers.get('x-alchm-redirect-count');
    const redirectCount = redirectHeader ? parseInt(redirectHeader, 10) : 0;
    
    if (redirectCount >= 3) {
      // Too many redirects, fallback to default locale without redirect
      const response = NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}${pathname}${search}`, req.url));
      response.headers.set('x-alchm-fallback', 'true');
      response.headers.set('x-alchm-locale', DEFAULT_LOCALE);
      return response;
    }
    
    // Use crisis-aware detection for emergency routes
    const isEmergencyPath = pathname.includes('/emergency') || pathname.includes('/crisis');
    const detectedLocale = isEmergencyPath ? detectCrisisLocale(req) : detectLocale(req);
    
    // Measure locale detection performance
    const metrics = measureLocaleDetection(req);
    
    // Special handling for root path - redirect to localized homepage
    if (pathname === '/') {
      const homeUrl = new URL(`/${detectedLocale}${search}`, req.url);
      const response = NextResponse.redirect(homeUrl, 307); // Temporary redirect for better SEO
      response.headers.set('x-locale-detection-ms', metrics.detectionTime.toString());
      response.headers.set('x-locale-source', metrics.source);
      response.headers.set('x-alchm-redirect-count', (redirectCount + 1).toString());
      response.headers.set('x-alchm-redirect-reason', 'missing-locale-root');
      return response;
    }
    
    // For other paths, add locale prefix
    const localizedUrl = new URL(`/${detectedLocale}${pathname}${search}`, req.url);
    const response = NextResponse.redirect(localizedUrl, 307); // Temporary redirect
    response.headers.set('x-locale-detection-ms', metrics.detectionTime.toString());
    response.headers.set('x-locale-source', metrics.source);
    response.headers.set('x-alchm-redirect-count', (redirectCount + 1).toString());
    response.headers.set('x-alchm-redirect-reason', 'missing-locale-path');
    return response;
  }

  // Extract current locale from path
  const currentLocale = getLocaleFromPathname(pathname);
  
  // Validate locale exists in supported list
  if (!currentLocale || !isValidLocale(currentLocale)) {
    // Remove invalid locale and redirect to default
    const pathWithoutInvalidLocale = pathname.replace(/^\/[^/]+/, '') || '/';
    const fallbackUrl = new URL(`/${DEFAULT_LOCALE}${pathWithoutInvalidLocale}${search}`, req.url);
    const response = NextResponse.redirect(fallbackUrl, 307);
    response.headers.set('x-alchm-redirect-reason', 'invalid-locale');
    response.headers.set('x-alchm-fallback-locale', DEFAULT_LOCALE);
    return response;
  }

  // CRISIS ROUTE HANDLING - Priority handling for emergency situations
  const crisisRoute = getCrisisRoute(pathname);
  const isCrisisRequest = detectCrisisRequest(req);
  
  if (crisisRoute || isCrisisRequest) {
    let crisisResponse = createCrisisResponse(req, currentLocale, crisisRoute);
    
    if (crisisRoute) {
      // Apply crisis optimizations
      crisisResponse = optimizeForCrisis(crisisResponse, crisisRoute);
      crisisResponse = enhanceAccessibility(crisisResponse, crisisRoute.accessibilityMode);
      
      // Add preload headers
      const preloadHeaders = getCrisisPreloadHeaders(crisisRoute);
      Object.entries(preloadHeaders).forEach(([key, value]) => {
        crisisResponse.headers.set(key, value);
      });
      
      // Log crisis access
      const duration = Date.now() - startTime;
      logCrisisAccess(req, crisisRoute, currentLocale, duration);
      logRouteAccess(pathname, currentLocale, !!sessionCookie, duration);
    }
    
    return crisisResponse;
  }

  // Apply route guard with performance monitoring
  const routeGuardResult = applyRouteGuard(req, pathname, currentLocale);
  
  if (routeGuardResult) {
    const duration = Date.now() - startTime;
    logRouteAccess(pathname, currentLocale, !!sessionCookie, duration);
    return routeGuardResult;
  }

  // Default: add locale to headers and continue with performance monitoring
  const response = NextResponse.next();
  response.headers.set('x-alchm-locale', currentLocale);
  response.headers.set('x-alchm-performance-monitor', 'enabled');
  
  // Add performance headers for mobile optimization
  const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';
  if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) {
    response.headers.set('x-mobile-optimized', 'true');
    response.headers.set('x-mobile-performance', 'priority');
  }
  
  const duration = Date.now() - startTime;
  response.headers.set('x-middleware-duration', duration.toString());
  logRouteAccess(pathname, currentLocale, !!sessionCookie, duration);
  
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
     * - Manifest, robots, sitemap, and service worker files
     * - App Router generated files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|manifest.webmanifest|robots.txt|sitemap.xml|sw.js|apple-touch-icon|android-chrome|mstile|browserconfig.xml|safari-pinned-tab.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|eot|ico|webmanifest|xml)$).*)',
  ],
};