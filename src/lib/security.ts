// Security utilities for ALCHM - Enhanced security features
import { z } from 'zod';

// Input validation schemas with enhanced security
export const emailSchema = z.string().email().max(254);
export const passwordSchema = z.string().min(12).max(128).regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  'Password must contain uppercase, lowercase, number, and special character'
);
export const userIdSchema = z.string().min(1).max(128);

// Enhanced rate limiting configuration with dynamic adjustment
export const RATE_LIMITS = {
  AUTH: { requests: 3, windowMs: 15 * 60 * 1000 }, // 3 requests per 15 minutes (stricter)
  API: { requests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  UPLOAD: { requests: 5, windowMs: 60 * 1000 }, // 5 uploads per minute (stricter)
  CHILD_USER: { requests: 2, windowMs: 15 * 60 * 1000 }, // Special limits for children
  ADMIN: { requests: 200, windowMs: 60 * 1000 }, // Higher limits for admin users
} as const;

// Content Security Policy
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://apis.google.com', 'https://www.googleapis.com'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'"],
  'connect-src': [
    "'self'", 
    'https://*.googleapis.com',
    'https://*.firebaseio.com',
    'https://*.cloudfunctions.net'
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
} as const;

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>\"'&]/g, (char) => {
      const map: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return map[char] || char;
    })
    .trim()
    .slice(0, 1000); // Limit length
}

// Validate and sanitize environment variables
export function validateEnvVar(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

// Check if request is from authorized origin
export function isAuthorizedOrigin(origin: string | null): boolean {
  const allowedOrigins = [
    'https://alchm-digital-sanctuary.web.app',
    'https://alchm-digital-sanctuary.firebaseapp.com',
    process.env.NEXT_PUBLIC_BASE_URL,
  ].filter(Boolean);
  
  return origin ? allowedOrigins.includes(origin) : false;
}

// Enhanced security headers for API routes with COPPA/FERPA compliance
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
} as const;

/**
 * Enhanced security validation (simplified implementation)
 */
export async function validateSecureOperation(operation: {
  userId?: string;
  userType: 'child' | 'student' | 'adult' | 'educator' | 'researcher' | 'admin';
  action: string;
  resource: string;
  dataType: string;
  context: Record<string, any>;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<{
  allowed: boolean;
  securityScore: number;
  violations: string[];
  auditTrail: string;
  restrictions: string[];
}> {
  try {
    // Basic validation logic (can be extended later)
    const violations: string[] = [];
    const restrictions: string[] = [];
    let allowed = true;
    let securityScore = 100;

    // Basic security checks
    if (operation.userType === 'child' && operation.action === 'admin') {
      violations.push('Children cannot perform admin actions');
      allowed = false;
      securityScore = 0;
    }

    if (!operation.userId && operation.action !== 'auth') {
      violations.push('Authentication required');
      allowed = false;
      securityScore = 0;
    }

    return {
      allowed,
      securityScore,
      violations,
      auditTrail: `validation_${allowed ? 'passed' : 'failed'}_${Date.now()}`,
      restrictions
    };
  } catch (error) {
    // Fail securely - deny access if validation fails
    return {
      allowed: false,
      securityScore: 0,
      violations: ['Security validation failed'],
      auditTrail: 'validation_error',
      restrictions: ['Operation blocked due to security validation failure']
    };
  }
}

/**
 * Enhanced input sanitization with context awareness
 */
export function sanitizeInputSecure(input: string, context: {
  userType?: 'child' | 'student' | 'adult';
  dataType?: 'journal' | 'profile' | 'educational';
  maxLength?: number;
}): string {
  // Apply stricter sanitization for children's data
  const maxLength = context.userType === 'child' ? 500 : (context.maxLength || 1000);
  
  let sanitized = input
    .replace(/[<>\"'&]/g, (char) => {
      const map: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return map[char] || char;
    })
    .trim()
    .slice(0, maxLength);

  // Additional sanitization for educational records
  if (context.dataType === 'educational') {
    // Remove potentially sensitive patterns
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN REDACTED]'); // SSN
    sanitized = sanitized.replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARD REDACTED]'); // Credit card
  }

  return sanitized;
}

/**
 * Rate limiting with enhanced child protection
 */
export function getRateLimit(userType: string, action: string): { requests: number; windowMs: number } {
  // Special protection for children
  if (userType === 'child') {
    return RATE_LIMITS.CHILD_USER;
  }

  // Admin users get higher limits
  if (userType === 'admin') {
    return RATE_LIMITS.ADMIN;
  }

  // Action-specific limits
  switch (action) {
    case 'auth':
    case 'login':
      return RATE_LIMITS.AUTH;
    case 'upload':
      return RATE_LIMITS.UPLOAD;
    default:
      return RATE_LIMITS.API;
  }
}

/**
 * Generate Content Security Policy with educational platform requirements
 */
export function generateCSP(userType?: string): string {
  const directives = { ...CSP_DIRECTIVES };

  // Stricter CSP for children
  if (userType === 'child') {
    directives['script-src'] = ["'self'"]; // Remove unsafe-inline for children
    directives['connect-src'] = ["'self'", 'https://*.googleapis.com']; // Limit external connections
  }

  return Object.entries(directives)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Security headers optimized for educational platforms
 */
export function getSecurityHeaders(userType?: string): Record<string, string> {
  const headers = { ...SECURITY_HEADERS };

  // Enhanced security for children
  if (userType === 'child') {
    headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()';
    headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, private';
  }

  return headers;
}