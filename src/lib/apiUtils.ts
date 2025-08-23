// Enhanced API utilities for ALCHM
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from './validateSession';
import { AuthError, AuthErrorCode } from '@/types/auth';

// API Error types
export enum ApiErrorCode {
  // Client errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  
  // Server errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  TIMEOUT = 'TIMEOUT'
}

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: any;
  timestamp: string;
  requestId: string;
  userMessage?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    requestId: string;
    timestamp: string;
    version: string;
    processingTime?: number;
  };
}

export interface RequestContext {
  requestId: string;
  userId?: string;
  userAgent: string;
  ip: string;
  timestamp: Date;
  method: string;
  path: string;
  headers: Record<string, string>;
  startTime: number;
}

// Request validation schemas
export interface ValidationSchema {
  body?: Record<string, any>;
  query?: Record<string, any>;
  headers?: Record<string, any>;
}

// Rate limiting configuration
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// Generate unique request ID
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Extract request context
export function extractRequestContext(req: NextRequest): RequestContext {
  const requestId = generateRequestId();
  const url = new URL(req.url);
  
  return {
    requestId,
    userAgent: req.headers.get('user-agent') || 'unknown',
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
    timestamp: new Date(),
    method: req.method,
    path: url.pathname,
    headers: Object.fromEntries(req.headers.entries()),
    startTime: Date.now()
  };
}

// Create standardized API response
export function createApiResponse<T>(
  data?: T,
  error?: ApiError,
  context?: RequestContext,
  processingTime?: number
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: !error,
    meta: {
      requestId: context?.requestId || generateRequestId(),
      timestamp: new Date().toISOString(),
      version: '1.0',
      processingTime
    }
  };

  if (error) {
    response.error = error;
  } else if (data !== undefined) {
    response.data = data;
  }

  const status = error ? getStatusCodeFromError(error.code) : 200;
  
  return NextResponse.json(response, { 
    status,
    headers: {
      'X-Request-ID': response.meta.requestId,
      'X-API-Version': response.meta.version,
      ...(processingTime && { 'X-Processing-Time': `${processingTime}ms` })
    }
  });
}

// Create API error
export function createApiError(
  code: ApiErrorCode,
  message: string,
  details?: any,
  userMessage?: string,
  requestId?: string
): ApiError {
  return {
    code,
    message,
    details,
    userMessage: userMessage || getDefaultUserMessage(code),
    timestamp: new Date().toISOString(),
    requestId: requestId || generateRequestId()
  };
}

// Map error codes to HTTP status codes
export function getStatusCodeFromError(code: ApiErrorCode): number {
  switch (code) {
    case ApiErrorCode.BAD_REQUEST:
    case ApiErrorCode.VALIDATION_ERROR:
      return 400;
    case ApiErrorCode.UNAUTHORIZED:
      return 401;
    case ApiErrorCode.FORBIDDEN:
      return 403;
    case ApiErrorCode.NOT_FOUND:
      return 404;
    case ApiErrorCode.METHOD_NOT_ALLOWED:
      return 405;
    case ApiErrorCode.RATE_LIMITED:
      return 429;
    case ApiErrorCode.INTERNAL_ERROR:
    case ApiErrorCode.DATABASE_ERROR:
      return 500;
    case ApiErrorCode.SERVICE_UNAVAILABLE:
      return 503;
    case ApiErrorCode.TIMEOUT:
      return 504;
    case ApiErrorCode.EXTERNAL_API_ERROR:
      return 502;
    default:
      return 500;
  }
}

// Get default user-friendly messages
export function getDefaultUserMessage(code: ApiErrorCode): string {
  switch (code) {
    case ApiErrorCode.BAD_REQUEST:
      return 'The request was invalid. Please check your input and try again.';
    case ApiErrorCode.UNAUTHORIZED:
      return 'You need to be logged in to access this resource.';
    case ApiErrorCode.FORBIDDEN:
      return 'You don\'t have permission to access this resource.';
    case ApiErrorCode.NOT_FOUND:
      return 'The requested resource was not found.';
    case ApiErrorCode.METHOD_NOT_ALLOWED:
      return 'This request method is not supported for this endpoint.';
    case ApiErrorCode.VALIDATION_ERROR:
      return 'The provided data is invalid. Please check your input.';
    case ApiErrorCode.RATE_LIMITED:
      return 'Too many requests. Please wait a moment before trying again.';
    case ApiErrorCode.INTERNAL_ERROR:
      return 'An internal error occurred. Please try again later.';
    case ApiErrorCode.SERVICE_UNAVAILABLE:
      return 'The service is temporarily unavailable. Please try again later.';
    case ApiErrorCode.DATABASE_ERROR:
      return 'A database error occurred. Please try again later.';
    case ApiErrorCode.EXTERNAL_API_ERROR:
      return 'An external service error occurred. Please try again later.';
    case ApiErrorCode.TIMEOUT:
      return 'The request timed out. Please try again.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
}

// Validate request authentication
export async function validateAuth(req: NextRequest, context: RequestContext): Promise<string> {
  try {
    const sessionResult = await validateSession();
    
    if (!sessionResult.valid) {
      const authError = sessionResult.error;
      
      // Map auth errors to API errors
      let apiErrorCode: ApiErrorCode;
      switch (authError?.code) {
        case AuthErrorCode.NO_SESSION:
        case AuthErrorCode.SESSION_EXPIRED:
        case AuthErrorCode.SESSION_REVOKED:
          apiErrorCode = ApiErrorCode.UNAUTHORIZED;
          break;
        case AuthErrorCode.INVALID_CLAIMS:
        case AuthErrorCode.VERIFICATION_FAILED:
          apiErrorCode = ApiErrorCode.FORBIDDEN;
          break;
        default:
          apiErrorCode = ApiErrorCode.UNAUTHORIZED;
      }
      
      throw createApiError(
        apiErrorCode,
        authError?.message || 'Authentication failed',
        authError,
        authError?.userMessage,
        context.requestId
      );
    }
    
    context.userId = sessionResult.userId;
    return sessionResult.userId!;
  } catch (error) {
    if (error instanceof Object && 'code' in error) {
      throw error; // Re-throw API errors
    }
    
    throw createApiError(
      ApiErrorCode.INTERNAL_ERROR,
      'Authentication validation failed',
      error,
      undefined,
      context.requestId
    );
  }
}

// Validate request input
export function validateInput<T>(
  input: any,
  schema: ValidationSchema,
  context: RequestContext
): T {
  try {
    // Simple validation - could be enhanced with Joi, Yup, or Zod
    if (schema.body) {
      for (const [key, rules] of Object.entries(schema.body)) {
        if (rules.required && (input[key] === undefined || input[key] === null)) {
          throw createApiError(
            ApiErrorCode.VALIDATION_ERROR,
            `Missing required field: ${key}`,
            { field: key, value: input[key] },
            `The field '${key}' is required.`,
            context.requestId
          );
        }
        
        if (rules.type && input[key] !== undefined && typeof input[key] !== rules.type) {
          throw createApiError(
            ApiErrorCode.VALIDATION_ERROR,
            `Invalid type for field: ${key}. Expected ${rules.type}`,
            { field: key, value: input[key], expectedType: rules.type },
            `The field '${key}' must be a ${rules.type}.`,
            context.requestId
          );
        }
        
        if (rules.minLength && typeof input[key] === 'string' && input[key].length < rules.minLength) {
          throw createApiError(
            ApiErrorCode.VALIDATION_ERROR,
            `Field ${key} must be at least ${rules.minLength} characters`,
            { field: key, value: input[key], minLength: rules.minLength },
            `The field '${key}' must be at least ${rules.minLength} characters long.`,
            context.requestId
          );
        }
        
        if (rules.maxLength && typeof input[key] === 'string' && input[key].length > rules.maxLength) {
          throw createApiError(
            ApiErrorCode.VALIDATION_ERROR,
            `Field ${key} must not exceed ${rules.maxLength} characters`,
            { field: key, value: input[key], maxLength: rules.maxLength },
            `The field '${key}' must not exceed ${rules.maxLength} characters.`,
            context.requestId
          );
        }
      }
    }
    
    return input as T;
  } catch (error) {
    if (error instanceof Object && 'code' in error) {
      throw error; // Re-throw API errors
    }
    
    throw createApiError(
      ApiErrorCode.VALIDATION_ERROR,
      'Input validation failed',
      error,
      'The provided input is invalid.',
      context.requestId
    );
  }
}

// Handle async errors
export function handleAsyncError(error: any, context: RequestContext): ApiError {
  console.error(`[API Error] ${context.requestId}:`, {
    error: error.message || error,
    stack: error.stack,
    context: {
      method: context.method,
      path: context.path,
      userId: context.userId,
      timestamp: context.timestamp.toISOString()
    }
  });

  // If it's already an API error, return it
  if (error instanceof Object && 'code' in error && Object.values(ApiErrorCode).includes(error.code)) {
    return error;
  }

  // Map common errors
  if (error.name === 'ValidationError') {
    return createApiError(
      ApiErrorCode.VALIDATION_ERROR,
      error.message,
      error,
      undefined,
      context.requestId
    );
  }

  if (error.name === 'MongoError' || error.code?.startsWith('firestore/')) {
    return createApiError(
      ApiErrorCode.DATABASE_ERROR,
      'Database operation failed',
      error,
      undefined,
      context.requestId
    );
  }

  if (error.name === 'TimeoutError' || error.code === 'ETIMEDOUT') {
    return createApiError(
      ApiErrorCode.TIMEOUT,
      'Request timed out',
      error,
      undefined,
      context.requestId
    );
  }

  // Default to internal error
  return createApiError(
    ApiErrorCode.INTERNAL_ERROR,
    error.message || 'An unexpected error occurred',
    error,
    undefined,
    context.requestId
  );
}

// Sanitize sensitive data for logging
export function sanitizeForLogging(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization'];
  const sanitized = { ...data };

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeForLogging(sanitized[key]);
    }
  }

  return sanitized;
}

// Common HTTP method validation
export function validateHttpMethod(
  req: NextRequest,
  allowedMethods: string[],
  context: RequestContext
): void {
  if (!allowedMethods.includes(req.method)) {
    throw createApiError(
      ApiErrorCode.METHOD_NOT_ALLOWED,
      `Method ${req.method} not allowed`,
      { method: req.method, allowedMethods },
      `This endpoint only supports: ${allowedMethods.join(', ')}`,
      context.requestId
    );
  }
}