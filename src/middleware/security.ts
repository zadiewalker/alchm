import { NextRequest, NextResponse } from 'next/server';

// Security headers configuration
export const securityHeaders = {
  // Content Security Policy - Restrict resource loading
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com *.firebase.com *.firebaseapp.com https://vercel.live",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data: blob: https: *.firebase.com *.firebaseapp.com *.googleapis.com",
    "media-src 'self' data: blob:",
    "connect-src 'self' *.firebase.com *.firebaseio.com *.googleapis.com wss://*.firebase.com https://vercel.live wss://ws-us3.pusher.com",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "manifest-src 'self'"
  ].join('; '),

  // HTTP Strict Transport Security - Force HTTPS
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',

  // X-Frame-Options - Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // X-Content-Type-Options - Prevent MIME sniffing
  'X-Content-Type-Options': 'nosniff',

  // X-XSS-Protection - Enable XSS filtering
  'X-XSS-Protection': '1; mode=block',

  // Referrer Policy - Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy - Control browser features
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=(self)',
    'encrypted-media=(self)',
    'fullscreen=(self)',
    'picture-in-picture=(self)'
  ].join(', '),

  // X-Permitted-Cross-Domain-Policies - Control cross-domain requests
  'X-Permitted-Cross-Domain-Policies': 'none',

  // X-DNS-Prefetch-Control - Control DNS prefetching
  'X-DNS-Prefetch-Control': 'off',

  // Cross-Origin-Embedder-Policy - Control cross-origin embedding
  'Cross-Origin-Embedder-Policy': 'unsafe-none',

  // Cross-Origin-Opener-Policy - Control cross-origin typeof window !== 'undefined' && window interactions
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',

  // Cross-Origin-Resource-Policy - Control cross-origin resource sharing
  'Cross-Origin-Resource-Policy': 'cross-origin'
};

// Rate limiting configuration
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export function rateLimit(request: NextRequest, limit: number = 100, typeof window !== 'undefined' && windowMs: number = 15 * 60 * 1000) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  // Clean expired entries
  Object.keys(rateLimitStore).forEach(key => {
    const entry = rateLimitStore[key];
    if (entry && entry.resetTime < now) {
      delete rateLimitStore[key];
    }
  });
  
  // Check rate limit
  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = {
      count: 1,
      resetTime: now + typeof window !== 'undefined' && windowMs
    };
    return { allowed: true, remaining: limit - 1 };
  }
  
  if (rateLimitStore[ip].resetTime < now) {
    rateLimitStore[ip] = {
      count: 1,
      resetTime: now + typeof window !== 'undefined' && windowMs
    };
    return { allowed: true, remaining: limit - 1 };
  }
  
  rateLimitStore[ip].count++;
  
  const remaining = Math.max(0, limit - rateLimitStore[ip].count);
  const allowed = rateLimitStore[ip].count <= limit;
  
  return { allowed, remaining };
}

// IP blocking for suspicious activity
const blockedIPs = new Set<string>();
const suspiciousActivity: { [key: string]: number } = {};

export function checkSuspiciousActivity(request: NextRequest): boolean {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  // Check if IP is already blocked
  if (blockedIPs.has(ip)) {
    return false;
  }
  
  // Check for suspicious patterns
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  
  // Block known bad user agents
  const badUserAgents = [
    'bot', 'crawler', 'spider', 'scraper', 'scanner',
    'sqlmap', 'nikto', 'nessus', 'w3af', 'dirbuster'
  ];
  
  if (badUserAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    suspiciousActivity[ip] = (suspiciousActivity[ip] || 0) + 5;
  }
  
  // Check for suspicious referers
  const badReferers = [
    'viagra', 'casino', 'poker', 'xxx', 'adult', 'porn'
  ];
  
  if (badReferers.some(ref => referer.toLowerCase().includes(ref))) {
    suspiciousActivity[ip] = (suspiciousActivity[ip] || 0) + 3;
  }
  
  // Block if too much suspicious activity
  if ((suspiciousActivity[ip] || 0) >= 10) {
    blockedIPs.add(ip);
    console.log(`Blocked suspicious IP: ${ip}`);
    return false;
  }
  
  return true;
}

// CSRF Protection
export function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => 
    byte.toString(16).padStart(2, '0')
  ).join('');
}

export function validateCSRFToken(request: NextRequest, expectedToken: string): boolean {
  const token = request.headers.get('x-csrf-token') || 
                request.nextUrl.searchParams.get('csrf_token');
  
  return token === expectedToken;
}

// Security middleware function
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add security-related cache control for sensitive pages
  if (response.url.includes('/dashboard') || 
      response.url.includes('/therapist-dashboard') ||
      response.url.includes('/analytics')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  return response;
}

// Request validation
export function validateRequest(request: NextRequest): { valid: boolean; reason?: string } {
  // Check for suspicious activity
  if (!checkSuspiciousActivity(request)) {
    return { valid: false, reason: 'Suspicious activity detected' };
  }
  
  // Check rate limiting
  const rateCheck = rateLimit(request);
  if (!rateCheck.allowed) {
    return { valid: false, reason: 'Rate limit exceeded' };
  }
  
  // Validate common attack patterns in URL
  const url = request.nextUrl.pathname + request.nextUrl.search;
  const attackPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /\.\.\//,
    /%2e%2e%2f/i,
    /union.*select/i,
    /select.*from/i,
    /insert.*into/i,
    /delete.*from/i,
    /drop.*table/i,
    /exec.*\(/i,
    /cmd.*\=/i
  ];
  
  for (const pattern of attackPatterns) {
    if (pattern.test(url)) {
      return { valid: false, reason: 'Malicious pattern detected in URL' };
    }
  }
  
  // Validate Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type') || '';
    const allowedContentTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain'
    ];
    
    if (!allowedContentTypes.some(type => contentType.startsWith(type))) {
      return { valid: false, reason: 'Invalid Content-Type' };
    }
  }
  
  return { valid: true };
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/vbscript:/gi, '') // Remove vbscript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// Secure cookie options
export const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

// Security audit logging
export function logSecurityEvent(event: {
  type: 'blocked_request' | 'rate_limited' | 'suspicious_activity' | 'csrf_failure';
  ip: string;
  userAgent?: string;
  url?: string;
  details?: any;
}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...event
  };
  
  // In production, this would be sent to a secure logging service
  console.log('SECURITY EVENT:', JSON.stringify(logEntry));
  
  // TODO: Integrate with monitoring service (e.g., Sentry, DataDog)
  // if (process.env.NODE_ENV === 'production') {
  //   sendToSecurityMonitoring(logEntry);
  // }
}

export default {
  securityHeaders,
  rateLimit,
  checkSuspiciousActivity,
  generateCSRFToken,
  validateCSRFToken,
  applySecurityHeaders,
  validateRequest,
  sanitizeInput,
  secureCookieOptions,
  logSecurityEvent
};