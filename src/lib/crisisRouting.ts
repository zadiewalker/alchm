import { NextRequest, NextResponse } from 'next/server';
import { detectCrisisLocale, type SupportedLocale } from './localeDetection';

// Crisis routing configuration
export interface CrisisRoute {
  path: string;
  priority: 'emergency' | 'urgent' | 'support';
  bypassAuth: boolean;
  cacheStrategy: 'no-cache' | 'short-cache' | 'medium-cache';
  preloadResources: string[];
  accessibilityMode: 'high-contrast' | 'large-text' | 'simple-layout' | 'standard';
}

// Crisis routes configuration
export const CRISIS_ROUTES: Record<string, CrisisRoute> = {
  '/emergency': {
    path: '/emergency',
    priority: 'emergency',
    bypassAuth: true,
    cacheStrategy: 'no-cache',
    preloadResources: [
      '/api/crisis-detection',
      '/api/crisis-support',
      '/crisis-resources'
    ],
    accessibilityMode: 'high-contrast'
  },
  '/crisis': {
    path: '/crisis',
    priority: 'emergency',
    bypassAuth: true,
    cacheStrategy: 'no-cache',
    preloadResources: [
      '/api/crisis-detection',
      '/api/crisis-support'
    ],
    accessibilityMode: 'large-text'
  },
  '/emergency-safe': {
    path: '/emergency-safe',
    priority: 'emergency',
    bypassAuth: true,
    cacheStrategy: 'no-cache',
    preloadResources: [
      '/api/crisis-support'
    ],
    accessibilityMode: 'simple-layout'
  },
  '/crisis-resources': {
    path: '/crisis-resources',
    priority: 'urgent',
    bypassAuth: true,
    cacheStrategy: 'short-cache',
    preloadResources: [],
    accessibilityMode: 'standard'
  }
};

// Crisis keywords for URL/content detection
const CRISIS_KEYWORDS = [
  'emergency',
  'crisis',
  'suicide',
  'self-harm',
  'panic',
  'help',
  'urgent',
  'danger',
  'threat',
  'abuse',
  'violence',
  'trauma',
  'ptsd',
  'flashback',
  'trigger',
  'breakdown',
  'meltdown',
  'overwhelmed',
  'desperate',
  'hopeless'
];

// Enhanced crisis detection with mobile accessibility considerations
export function detectCrisisRequest(request: NextRequest): boolean {
  const { pathname, searchParams } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const referer = request.headers.get('referer')?.toLowerCase() || '';
  
  // Check URL path for crisis indicators
  const pathLower = pathname.toLowerCase();
  if (CRISIS_KEYWORDS.some(keyword => pathLower.includes(keyword))) {
    return true;
  }
  
  // Check search parameters
  const query = searchParams.get('q')?.toLowerCase() || '';
  if (CRISIS_KEYWORDS.some(keyword => query.includes(keyword))) {
    return true;
  }
  
  // Check for emergency query parameters
  if (searchParams.get('emergency') === 'true' || 
      searchParams.get('crisis') === 'true' ||
      searchParams.get('help') === 'true' ||
      searchParams.get('panic') === 'true') {
    return true;
  }
  
  // Check referer for crisis-related sites
  const crisisSites = [
    'suicidepreventionlifeline.org',
    'crisistextline.org',
    'nami.org',
    'samhsa.gov',
    '988lifeline.org',
    'crisischat.org'
  ];
  
  if (crisisSites.some(site => referer.includes(site))) {
    return true;
  }
  
  // Detect mobile crisis patterns (common on crisis hotline referrals)
  if (userAgent.includes('mobile') && 
      (pathLower.includes('help') || pathLower.includes('support'))) {
    return true;
  }
  
  return false;
}

// Get crisis route configuration
export function getCrisisRoute(pathname: string): CrisisRoute | null {
  // Remove locale prefix for route matching
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '') || '/';
  return CRISIS_ROUTES[pathWithoutLocale] || null;
}

// Create crisis-optimized response
export function createCrisisResponse(
  request: NextRequest,
  locale: SupportedLocale,
  route?: CrisisRoute
): NextResponse {
  const response = NextResponse.next();
  
  // Crisis-specific headers
  response.headers.set('x-alchm-crisis', 'true');
  response.headers.set('x-alchm-locale', locale);
  response.headers.set('x-alchm-emergency-bypass', 'true');
  
  // Cache control based on route priority
  if (route) {
    switch (route.cacheStrategy) {
      case 'no-cache':
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        break;
      case 'short-cache':
        response.headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes
        break;
      case 'medium-cache':
        response.headers.set('Cache-Control', 'public, max-age=1800'); // 30 minutes
        break;
    }
    
    // Accessibility mode
    response.headers.set('x-accessibility-mode', route.accessibilityMode);
    
    // Priority level
    response.headers.set('x-crisis-priority', route.priority);
    
    // Preload resources
    if (route.preloadResources.length > 0) {
      response.headers.set('x-preload-resources', route.preloadResources.join(','));
    }
  }
  
  // Security headers for crisis situations
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Performance headers for fast crisis loading
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Early-Data', '1');
  
  return response;
}

// Handle crisis redirect
export function handleCrisisRedirect(
  request: NextRequest,
  targetPath: string,
  locale?: SupportedLocale
): NextResponse {
  const detectedLocale = locale || detectCrisisLocale(request);
  const localizedPath = `/${detectedLocale}${targetPath}`;
  
  const redirectUrl = new URL(localizedPath, request.url);
  const response = NextResponse.redirect(redirectUrl, 307); // Temporary redirect for crisis
  
  // Crisis redirect headers
  response.headers.set('x-crisis-redirect', 'true');
  response.headers.set('x-redirect-reason', 'crisis-optimization');
  response.headers.set('x-target-locale', detectedLocale);
  
  return response;
}

// Emergency route bypass check
export function shouldBypassAuth(pathname: string): boolean {
  const route = getCrisisRoute(pathname);
  return route?.bypassAuth ?? false;
}

// Enhanced crisis performance optimization for mobile users
export function optimizeForCrisis(response: NextResponse, route: CrisisRoute): NextResponse {
  // Set highest priority for emergency routes
  if (route.priority === 'emergency') {
    response.headers.set('Priority', 'u=0'); // Highest priority
    response.headers.set('X-Priority', 'emergency');
    response.headers.set('X-Crisis-Level', 'emergency');
  } else if (route.priority === 'urgent') {
    response.headers.set('Priority', 'u=1');
    response.headers.set('X-Priority', 'urgent');
    response.headers.set('X-Crisis-Level', 'urgent');
  }
  
  // Enable early hints for resource preloading
  if (route.preloadResources.length > 0) {
    const preloadLinks = route.preloadResources
      .map(resource => `<${resource}>; rel=preload; as=fetch; crossorigin=anonymous`)
      .join(', ');
    response.headers.set('Link', preloadLinks);
  }
  
  // Mobile-first crisis optimization
  response.headers.set('X-Mobile-Optimized', 'true');
  response.headers.set('X-Touch-Friendly', 'true');
  response.headers.set('X-Large-Touch-Targets', 'enabled');
  response.headers.set('X-Crisis-Mode', 'active');
  
  // Performance optimizations for crisis situations
  response.headers.set('X-Compress-Response', 'true');
  response.headers.set('X-Minimize-JavaScript', 'true');
  response.headers.set('X-Prefetch-Critical', 'emergency');
  
  // Accessibility headers for crisis users
  response.headers.set('X-High-Contrast-Ready', 'true');
  response.headers.set('X-Screen-Reader-Priority', 'high');
  response.headers.set('X-Reduce-Motion', 'respect-preference');
  
  return response;
}

// Enhanced crisis accessibility for trauma-informed design
export function enhanceAccessibility(
  response: NextResponse,
  accessibilityMode: CrisisRoute['accessibilityMode']
): NextResponse {
  switch (accessibilityMode) {
    case 'high-contrast':
      response.headers.set('X-Force-High-Contrast', 'true');
      response.headers.set('X-Color-Scheme', 'high-contrast');
      response.headers.set('X-Background-Color', '#000000');
      response.headers.set('X-Text-Color', '#ffffff');
      break;
    case 'large-text':
      response.headers.set('X-Force-Large-Text', 'true');
      response.headers.set('X-Min-Font-Size', '20px');
      response.headers.set('X-Line-Height', '1.6');
      response.headers.set('X-Letter-Spacing', '0.05em');
      break;
    case 'simple-layout':
      response.headers.set('X-Force-Simple-Layout', 'true');
      response.headers.set('X-Reduced-Motion', 'true');
      response.headers.set('X-Minimal-UI', 'true');
      response.headers.set('X-Hide-Non-Essential', 'true');
      break;
    case 'standard':
    default:
      response.headers.set('X-Accessibility-Mode', 'standard');
      response.headers.set('X-Respect-Preferences', 'true');
      break;
  }
  
  // Universal accessibility headers for crisis users
  response.headers.set('X-Screen-Reader-Optimized', 'true');
  response.headers.set('X-Keyboard-Navigation', 'enabled');
  response.headers.set('X-Focus-Management', 'aggressive');
  response.headers.set('X-Skip-Links', 'enabled');
  
  // Trauma-informed accessibility
  response.headers.set('X-Trigger-Warnings', 'enabled');
  response.headers.set('X-Gentle-Transitions', 'true');
  response.headers.set('X-Panic-Button-Visible', 'true');
  response.headers.set('X-Breathing-Reminders', 'available');
  
  // Mobile accessibility for trembling hands/motor difficulties
  response.headers.set('X-Large-Touch-Targets', '48px');
  response.headers.set('X-Touch-Tolerance', 'generous');
  response.headers.set('X-Gesture-Alternatives', 'provided');
  
  return response;
}

// Crisis monitoring and analytics
export interface CrisisMetrics {
  route: string;
  locale: SupportedLocale;
  priority: CrisisRoute['priority'];
  responseTime: number;
  userAgent: string;
  timestamp: number;
  bypassedAuth: boolean;
}

export function logCrisisAccess(
  request: NextRequest,
  route: CrisisRoute,
  locale: SupportedLocale,
  responseTime: number
): void {
  const metrics: CrisisMetrics = {
    route: route.path,
    locale,
    priority: route.priority,
    responseTime,
    userAgent: request.headers.get('user-agent') || 'unknown',
    timestamp: Date.now(),
    bypassedAuth: route.bypassAuth
  };
  
  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to crisis monitoring dashboard
    console.log('CRISIS_ACCESS:', JSON.stringify(metrics));
  } else {
    console.log('Crisis route accessed:', metrics);
  }
}

// Panic button routing - instant emergency access
export function handlePanicButton(request: NextRequest): NextResponse | null {
  const { searchParams } = request.nextUrl;
  
  // Check for panic button trigger
  if (searchParams.get('panic') === 'true' || searchParams.get('emergency') === 'true') {
    const locale = detectCrisisLocale(request);
    return handleCrisisRedirect(request, '/emergency', locale);
  }
  
  return null;
}

// Crisis resource preloader
export function getCrisisPreloadHeaders(route: CrisisRoute): Record<string, string> {
  const headers: Record<string, string> = {};
  
  if (route.preloadResources.length > 0) {
    // DNS prefetch for critical domains
    headers['X-DNS-Prefetch'] = 'api.alchm.app,crisis.alchm.app,emergency.alchm.app';
    
    // Resource hints
    const preconnectLinks = route.preloadResources
      .filter(resource => resource.startsWith('/api/'))
      .map(resource => `<https://api.alchm.app${resource}>; rel=preconnect`)
      .join(', ');
    
    if (preconnectLinks) {
      headers['Link'] = preconnectLinks;
    }
    
    // Module preload for critical scripts
    headers['X-Module-Preload'] = '/crisis-emergency.js,/mobile-optimizer.js';
  }
  
  return headers;
}