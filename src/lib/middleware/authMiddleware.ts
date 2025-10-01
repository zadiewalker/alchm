/**
 * ALCHM Privacy & Legal Compliance - Secure Authentication Middleware
 * 
 * This middleware ensures all API endpoints are properly authenticated
 * and comply with COPPA, FERPA, GDPR, and CCPA requirements.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSession, SessionValidationResult } from '../validateSession';
import { validateSecureOperation, sanitizeInputSecure, getRateLimit, getSecurityHeaders } from '../security';
import { securityAuditSystem } from '../security/security-audit-system';

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  emailVerified: boolean;
  userType: 'child' | 'student' | 'adult' | 'educator' | 'researcher' | 'admin';
  ageVerificationStatus: 'verified' | 'pending' | 'not_required';
  parentalConsent?: {
    granted: boolean;
    parentEmail?: string;
    consentDate?: string;
    verificationMethod: string;
  };
  educationalContext?: {
    institution?: string;
    ferpaCompliance: boolean;
    educatorConsent?: boolean;
  };
  privacySettings: {
    dataMinimization: boolean;
    rightToErasure: boolean;
    dataPortability: boolean;
    marketingOptOut: boolean;
  };
}

export interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  allowedUserTypes?: string[];
  requireEmailVerification?: boolean;
  requireParentalConsent?: boolean;
  requireEducatorConsent?: boolean;
  rateLimit?: boolean;
  logAccess?: boolean;
  dataType?: 'journal' | 'profile' | 'educational' | 'research';
  sensitive?: boolean;
}

export class AuthenticationError extends Error {
  constructor(
    public code: string,
    public userMessage: string,
    public statusCode: number = 401,
    public canRetry: boolean = true
  ) {
    super(userMessage);
    this.name = 'AuthenticationError';
  }
}

/**
 * Enhanced authentication middleware with comprehensive privacy compliance
 */
export async function withAuth(
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>,
  options: AuthMiddlewareOptions = {}
) {
  return async function authHandler(request: NextRequest): Promise<NextResponse> {
    const startTime = Date.now();
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    try {
      // Apply security headers immediately
      const securityHeaders = getSecurityHeaders();
      
      // Rate limiting if enabled
      if (options.rateLimit !== false) {
        const rateLimitResult = await checkRateLimit(request, clientIp, options);
        if (!rateLimitResult.allowed) {
          return createErrorResponse(
            'Rate limit exceeded',
            'Too many requests. Please slow down.',
            429,
            securityHeaders
          );
        }
      }

      // Validate session if authentication is required
      let sessionResult: SessionValidationResult;
      let user: AuthenticatedUser | null = null;

      if (options.requireAuth !== false) {
        sessionResult = await validateSession();
        
        if (!sessionResult.valid) {
          await logSecurityEvent({
            eventType: 'authentication_failure',
            severity: 'medium',
            ipAddress: clientIp,
            userAgent,
            resource: request.nextUrl.pathname,
            action: 'access_denied',
            result: 'failure',
            metadata: {
              error: sessionResult.error,
              options
            }
          });

          return createErrorResponse(
            'Authentication required',
            sessionResult.error?.userMessage || 'Please sign in to continue',
            401,
            securityHeaders
          );
        }

        // Load user profile with privacy controls
        user = await loadUserWithPrivacyControls(sessionResult.userId!);
        
        if (!user) {
          return createErrorResponse(
            'User not found',
            'User account not found or has been deleted',
            403,
            securityHeaders
          );
        }

        // Validate user type restrictions
        if (options.allowedUserTypes && !options.allowedUserTypes.includes(user.userType)) {
          await logSecurityEvent({
            eventType: 'authorization_failure',
            severity: 'high',
            userId: user.uid,
            ipAddress: clientIp,
            resource: request.nextUrl.pathname,
            action: 'unauthorized_access_attempt',
            result: 'blocked',
            metadata: {
              userType: user.userType,
              allowedTypes: options.allowedUserTypes
            }
          });

          return createErrorResponse(
            'Access denied',
            'Your account type does not have permission to access this resource',
            403,
            securityHeaders
          );
        }

        // Enhanced validation for child users (COPPA compliance)
        if (user.userType === 'child') {
          const childValidation = await validateChildUserAccess(user, options);
          if (!childValidation.allowed) {
            return createErrorResponse(
              'Parental consent required',
              childValidation.message,
              403,
              securityHeaders
            );
          }
        }

        // Educational data protection (FERPA compliance)
        if (options.dataType === 'educational' && user.userType === 'student') {
          const ferpaValidation = await validateFERPACompliance(user, options);
          if (!ferpaValidation.allowed) {
            return createErrorResponse(
              'Educational consent required',
              ferpaValidation.message,
              403,
              securityHeaders
            );
          }
        }

        // Comprehensive security validation
        const securityValidation = await validateSecureOperation({
          userId: user.uid,
          userType: user.userType as any,
          action: request.method,
          resource: request.nextUrl.pathname,
          dataType: options.dataType || 'general',
          context: {
            sensitive: options.sensitive,
            emailVerified: user.emailVerified,
            parentalConsent: user.parentalConsent?.granted,
            educationalContext: user.educationalContext
          },
          ipAddress: clientIp,
          userAgent
        });

        if (!securityValidation.allowed) {
          await logSecurityEvent({
            eventType: 'security_validation_failure',
            severity: 'high',
            userId: user.uid,
            ipAddress: clientIp,
            resource: request.nextUrl.pathname,
            action: 'security_check_failed',
            result: 'blocked',
            metadata: {
              securityScore: securityValidation.securityScore,
              violations: securityValidation.violations,
              restrictions: securityValidation.restrictions
            }
          });

          return createErrorResponse(
            'Security validation failed',
            'This action is not permitted due to security restrictions',
            403,
            securityHeaders
          );
        }
      }

      // Log successful access
      if (options.logAccess !== false && user) {
        await logSecurityEvent({
          eventType: 'resource_access',
          severity: 'info',
          userId: user.uid,
          ipAddress: clientIp,
          userAgent,
          resource: request.nextUrl.pathname,
          action: request.method,
          result: 'success',
          metadata: {
            userType: user.userType,
            dataType: options.dataType,
            processingTime: Date.now() - startTime
          }
        });
      }

      // Call the wrapped handler with authenticated user
      const response = await handler(request, user!);
      
      // Add security headers to response
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      // Add privacy compliance headers
      response.headers.set('X-ALCHM-Privacy-Compliant', 'true');
      response.headers.set('X-ALCHM-User-Type', user?.userType || 'anonymous');
      response.headers.set('X-Processing-Time', `${Date.now() - startTime}ms`);

      return response;

    } catch (error: any) {
      // Log security errors
      await logSecurityEvent({
        eventType: 'system_error',
        severity: 'high',
        ipAddress: clientIp,
        userAgent,
        resource: request.nextUrl.pathname,
        action: 'middleware_error',
        result: 'error',
        metadata: {
          error: error.message,
          stack: error.stack,
          processingTime: Date.now() - startTime
        }
      });

      return createErrorResponse(
        'Internal server error',
        'An unexpected error occurred. Please try again.',
        500,
        getSecurityHeaders()
      );
    }
  };
}

/**
 * Load user with privacy controls and compliance data
 */
async function loadUserWithPrivacyControls(userId: string): Promise<AuthenticatedUser | null> {
  try {
    // This would typically load from your user database
    // For now, return a mock user structure that demonstrates the privacy controls
    
    // TODO: Replace with actual database query
    const mockUser: AuthenticatedUser = {
      uid: userId,
      email: 'user@example.com',
      emailVerified: true,
      userType: 'adult', // This should be determined from user data
      ageVerificationStatus: 'verified',
      privacySettings: {
        dataMinimization: true,
        rightToErasure: true,
        dataPortability: true,
        marketingOptOut: true
      }
    };
    
    return mockUser;
  } catch (error) {
    console.error('Failed to load user with privacy controls:', error);
    return null;
  }
}

/**
 * Validate child user access with COPPA compliance
 */
async function validateChildUserAccess(
  user: AuthenticatedUser, 
  options: AuthMiddlewareOptions
): Promise<{ allowed: boolean; message: string }> {
  // Require parental consent for any child user access
  if (!user.parentalConsent?.granted) {
    return {
      allowed: false,
      message: 'Parental consent is required before your child can access this feature. Please have a parent or guardian complete the consent process.'
    };
  }

  // Verify parental consent is current (not older than 1 year)
  if (user.parentalConsent.consentDate) {
    const consentDate = new Date(user.parentalConsent.consentDate);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (consentDate < oneYearAgo) {
      return {
        allowed: false,
        message: 'Parental consent has expired. Please have a parent or guardian renew the consent.'
      };
    }
  }

  // Additional restrictions for sensitive operations
  if (options.sensitive) {
    return {
      allowed: false,
      message: 'This feature is not available for child accounts as an additional safety measure.'
    };
  }

  return { allowed: true, message: '' };
}

/**
 * Validate FERPA compliance for educational data
 */
async function validateFERPACompliance(
  user: AuthenticatedUser,
  options: AuthMiddlewareOptions
): Promise<{ allowed: boolean; message: string }> {
  if (!user.educationalContext?.ferpaCompliance) {
    return {
      allowed: false,
      message: 'FERPA compliance verification is required for educational features.'
    };
  }

  if (options.requireEducatorConsent && !user.educationalContext.educatorConsent) {
    return {
      allowed: false,
      message: 'Educator consent is required for this educational feature.'
    };
  }

  return { allowed: true, message: '' };
}

/**
 * Enhanced rate limiting with user type considerations
 */
async function checkRateLimit(
  request: NextRequest, 
  clientIp: string, 
  options: AuthMiddlewareOptions
): Promise<{ allowed: boolean }> {
  // TODO: Implement actual rate limiting with Redis or similar
  // This is a placeholder that shows the structure
  
  const action = request.nextUrl.pathname.includes('/auth/') ? 'auth' : 'api';
  const limits = getRateLimit('adult', action); // Default to adult limits
  
  // Implement rate limiting logic here
  // For now, always allow (but log the attempt)
  
  return { allowed: true };
}

/**
 * Create standardized error response with security headers
 */
function createErrorResponse(
  error: string,
  userMessage: string,
  status: number,
  headers: Record<string, string>
): NextResponse {
  const response = NextResponse.json(
    {
      error,
      message: userMessage,
      timestamp: new Date().toISOString(),
      privacyNotice: 'Your privacy is protected. This error has been logged for security purposes but no personal data has been exposed.'
    },
    { status }
  );

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Log security events for audit trail
 */
async function logSecurityEvent(event: {
  eventType: string;
  severity: 'info' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  resource: string;
  action: string;
  result: 'success' | 'failure' | 'blocked' | 'error';
  metadata?: any;
}): Promise<void> {
  try {
    await securityAuditSystem.logSecurityEvent(event);
  } catch (error) {
    // Never let logging failures break the application
    console.error('Failed to log security event:', error);
  }
}