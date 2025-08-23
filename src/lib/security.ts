// Security utilities for ALCHM
import { z } from 'zod';

// Input validation schemas
export const emailSchema = z.string().email().max(254);
export const passwordSchema = z.string().min(8).max(128);
export const userIdSchema = z.string().min(1).max(128);

// Rate limiting configuration
export const RATE_LIMITS = {
  AUTH: { requests: 5, window: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  API: { requests: 100, window: 60 * 1000 }, // 100 requests per minute
  UPLOAD: { requests: 10, window: 60 * 1000 }, // 10 uploads per minute
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

// Security headers for API routes
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
} as const;