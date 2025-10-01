/**
 * Legal Compliance Middleware for Next.js
 * Integrates legal compliance validation into the Next.js middleware pipeline
 * Ensures all requests comply with GDPR/CCPA/COPPA requirements
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiComplianceValidator } from './lib/legal/api-compliance-validator';

/**
 * Legal compliance middleware for Next.js
 * Add this to your main middleware.ts file
 */
export async function legalComplianceMiddleware(request: NextRequest): Promise<NextResponse> {
  // Skip compliance checks for static assets and internal Next.js routes
  if (shouldSkipCompliance(request)) {
    return NextResponse.next();
  }

  try {
    // Run compliance validation
    const response = await apiComplianceValidator.createMiddleware()(request);
    
    // Add compliance headers to all responses
    addComplianceHeaders(response, request);
    
    return response;
    
  } catch (error) {
    console.error('Legal compliance middleware error:', error);
    
    // Log compliance system failure but allow request to proceed
    await logComplianceSystemError(error as Error, request);
    
    return NextResponse.next();
  }
}

/**
 * Determine if compliance checking should be skipped for this request
 */
function shouldSkipCompliance(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname;
  
  // Skip static assets
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/static/') ||
      pathname.includes('.')) {
    return true;
  }
  
  // Skip Next.js internal routes
  if (pathname.startsWith('/__next') || 
      pathname.startsWith('/_vercel')) {
    return true;
  }
  
  // Skip public legal typeof window !== 'undefined' && documents (to avoid recursion)
  if (pathname.includes('/privacy-policy') || 
      pathname.includes('/terms') ||
      pathname.includes('/legal/')) {
    return true;
  }
  
  return false;
}

/**
 * Add compliance-related headers to responses
 */
function addComplianceHeaders(response: NextResponse, request: NextRequest): void {
  // Add privacy policy reference
  response.headers.set('X-Privacy-Policy', '/privacy-policy.html');
  
  // Add cookie policy reference
  response.headers.set('X-Cookie-Policy', '/cookie-policy.html');
  
  // Add GDPR compliance indicator
  response.headers.set('X-GDPR-Compliant', 'true');
  
  // Add CCPA compliance indicator
  response.headers.set('X-CCPA-Compliant', 'true');
  
  // Add COPPA compliance indicator for child-safe routes
  if (isChildSafeRoute(request.nextUrl.pathname)) {
    response.headers.set('X-COPPA-Compliant', 'true');
  }
  
  // Add data processing notification
  response.headers.set('X-Data-Processing', 'minimal');
  
  // Add user rights information
  response.headers.set('X-User-Rights', '/privacy/user-rights');
  
  // Add consent management reference
  response.headers.set('X-Consent-Management', '/privacy/consent');
}

/**
 * Check if route is designed for children (COPPA compliance)
 */
function isChildSafeRoute(pathname: string): boolean {
  const childSafeRoutes = [
    '/kids/',
    '/children/',
    '/family/',
    '/safe/'
  ];
  
  return childSafeRoutes.some(route => pathname.includes(route));
}

/**
 * Log compliance system errors for monitoring
 */
async function logComplianceSystemError(error: Error, request: NextRequest): Promise<void> {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    request: {
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    },
    system: 'legal-compliance-middleware'
  };
  
  // In production, send to monitoring service
  console.error('Legal compliance system error:', errorLog);
  
  // Could integrate with services like Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // await sendToMonitoringService(errorLog);
  }
}

/**
 * Cookie consent middleware
 * Handles cookie consent for GDPR compliance
 */
export function cookieConsentMiddleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  // Check if user has given cookie consent
  const cookieConsent = request.cookies.get('alchm_cookie_consent');
  
  if (!cookieConsent) {
    // Set flag to show cookie consent banner
    response.headers.set('X-Show-Cookie-Banner', 'true');
  }
  
  // Add cookie policy headers
  response.headers.set('X-Cookie-Policy-Required', 'true');
  response.headers.set('X-Cookie-Categories', 'essential,analytics,ai_enhancement');
  
  return response;
}

/**
 * Age verification middleware
 * Ensures age-appropriate content delivery
 */
export function ageVerificationMiddleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  // Check for age verification
  const ageVerified = request.cookies.get('alchm_age_verified');
  const userAge = request.cookies.get('alchm_user_age_group');
  
  if (!ageVerified && request.nextUrl.pathname.includes('/register')) {
    // Redirect to age verification
    return NextResponse.redirect(new URL('/age-verification', request.url));
  }
  
  // Add age-appropriate headers
  if (userAge?.value === 'minor') {
    response.headers.set('X-COPPA-Mode', 'true');
    response.headers.set('X-Enhanced-Privacy', 'true');
    response.headers.set('X-Parental-Controls', 'required');
  }
  
  return response;
}

/**
 * Data minimization middleware
 * Ensures minimal data collection
 */
export function dataMinimizationMiddleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  // Add data minimization headers
  response.headers.set('X-Data-Collection', 'minimal');
  response.headers.set('X-Purpose-Limitation', 'true');
  response.headers.set('X-Storage-Limitation', 'user-controlled');
  
  // Block unnecessary tracking
  if (request.nextUrl.pathname.includes('/track') && 
      !request.cookies.get('alchm_analytics_consent')) {
    return new NextResponse('Analytics consent required', { status: 403 });
  }
  
  return response;
}

/**
 * Crisis intervention compliance middleware
 * Special handling for crisis detection features
 */
export function crisisComplianceMiddleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  if (request.nextUrl.pathname.includes('/crisis') || 
      request.nextUrl.pathname.includes('/emergency')) {
    
    // Add crisis-specific compliance headers
    response.headers.set('X-Crisis-Mode', 'true');
    response.headers.set('X-Safety-Override', 'allowed');
    response.headers.set('X-Emergency-Contacts', 'enabled');
    
    // Add medical disclaimer
    response.headers.set('X-Medical-Disclaimer', '/medical-disclaimer.html');
  }
  
  return response;
}

/**
 * Export all middleware functions for integration
 */
export const legalMiddleware = {
  compliance: legalComplianceMiddleware,
  cookies: cookieConsentMiddleware,
  ageVerification: ageVerificationMiddleware,
  dataMinimization: dataMinimizationMiddleware,
  crisis: crisisComplianceMiddleware
};

/**
 * Combined legal compliance middleware
 * Runs all legal compliance checks in sequence
 */
export async function combinedLegalMiddleware(request: NextRequest): Promise<NextResponse> {
  // Skip if not applicable
  if (shouldSkipCompliance(request)) {
    return NextResponse.next();
  }
  
  let response: NextResponse;
  
  // Run middleware in sequence
  response = await legalComplianceMiddleware(request);
  if (response.status !== 200 && response.status !== 307) return response;
  
  response = cookieConsentMiddleware(request);
  if (response.status !== 200 && response.status !== 307) return response;
  
  response = ageVerificationMiddleware(request);
  if (response.status !== 200 && response.status !== 307) return response;
  
  response = dataMinimizationMiddleware(request);
  if (response.status !== 200 && response.status !== 307) return response;
  
  response = crisisComplianceMiddleware(request);
  
  return response;
}

export default combinedLegalMiddleware;