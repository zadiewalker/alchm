// Enhanced API wrapper for ALCHM with comprehensive error handling, security, and monitoring
import { NextRequest, NextResponse } from 'next/server';
import {
  extractRequestContext,
  createApiResponse,
  handleAsyncError,
  validateAuth,
  validateInput,
  validateHttpMethod,
  RequestContext,
  ApiError,
  ApiErrorCode,
  ValidationSchema,
  createApiError
} from './apiUtils';
import { createRateLimitMiddleware, RATE_LIMIT_CONFIGS } from './rateLimiter';
import { apiLogger } from './apiLogger';

// Enhanced API handler configuration
export interface ApiHandlerConfig {
  // HTTP methods allowed for this endpoint
  allowedMethods?: string[];
  
  // Authentication requirements
  requireAuth?: boolean;
  allowedRoles?: string[];
  
  // Rate limiting configuration
  rateLimitConfig?: keyof typeof RATE_LIMIT_CONFIGS | 'none';
  customRateLimit?: any;
  
  // Validation schemas
  validation?: {
    body?: ValidationSchema['body'];
    query?: ValidationSchema['query'];
    headers?: ValidationSchema['headers'];
  };
  
  // Security configuration
  security?: {
    requireHttps?: boolean;
    csrfProtection?: boolean;
    corsOrigins?: string[];
    maxRequestSize?: number;
  };
  
  // Monitoring and logging
  monitoring?: {
    logLevel?: 'error' | 'warn' | 'info' | 'debug';
    includeRequestBody?: boolean;
    includeResponseBody?: boolean;
    performanceTracking?: boolean;
  };
  
  // Caching configuration
  caching?: {
    enabled?: boolean;
    ttl?: number;
    vary?: string[];
    cacheKey?: (req: NextRequest, context: RequestContext) => string;
  };
  
  // Timeout configuration
  timeout?: number;
}

// Enhanced API handler function type
export interface ApiHandler {
  (req: NextRequest, context: RequestContext): Promise<any>;
}

// Create enhanced API wrapper
export function createApiHandler(
  handler: ApiHandler,
  config: ApiHandlerConfig = {}
) {
  return async (req: NextRequest, ...args: any[]) => {
    const context = extractRequestContext(req);
    const startTime = Date.now();
    
    try {
      // Log incoming request
      apiLogger.info(`Incoming ${req.method} request`, context, {
        path: context.path,
        userAgent: context.userAgent,
        config: {
          requireAuth: config.requireAuth,
          rateLimitConfig: config.rateLimitConfig,
          allowedMethods: config.allowedMethods
        }
      });

      // 1. HTTP Method Validation
      if (config.allowedMethods) {
        validateHttpMethod(req, config.allowedMethods, context);
      }

      // 2. Security Middleware (simplified for now)

      // 3. Rate Limiting
      if (config.rateLimitConfig && config.rateLimitConfig !== 'none') {
        const rateLimitConfig = config.customRateLimit || RATE_LIMIT_CONFIGS[config.rateLimitConfig];
        const rateLimitMiddleware = createRateLimitMiddleware(rateLimitConfig);
        await rateLimitMiddleware(req, context);
      }

      // 4. Authentication
      if (config.requireAuth) {
        const userId = await validateAuth(req, context);
        context.userId = userId;
        
        // Role-based authorization
        if (config.allowedRoles) {
          // This would require extending the auth system to include roles
          // For now, we'll just log that role checking is needed
          apiLogger.debug('Role-based authorization check needed', context, {
            allowedRoles: config.allowedRoles,
            userId
          });
        }
      }

      // 5. Input Validation
      let validatedInput: any;
      if (config.validation) {
        try {
          const rawBody = req.method !== 'GET' ? await req.json() : {};
          const url = new URL(req.url);
          const query = Object.fromEntries(url.searchParams.entries());
          
          validatedInput = {
            body: config.validation.body ? validateInput(rawBody, { body: config.validation.body }, context) : rawBody,
            query: config.validation.query ? validateInput(query, { query: config.validation.query }, context) : query,
            headers: config.validation.headers ? validateInput(
              Object.fromEntries(req.headers.entries()), 
              { headers: config.validation.headers }, 
              context
            ) : Object.fromEntries(req.headers.entries())
          };
        } catch (error) {
          if (error instanceof SyntaxError) {
            throw createApiError(
              ApiErrorCode.BAD_REQUEST,
              'Invalid JSON in request body',
              error,
              'The request body contains invalid JSON',
              context.requestId
            );
          }
          throw error;
        }
      }

      // 6. Cache Check (if enabled)
      if (config.caching?.enabled && req.method === 'GET') {
        // Cache implementation would go here
        // For now, we'll just log that caching is enabled
        apiLogger.debug('Cache check enabled for GET request', context);
      }

      // 7. Timeout Handling
      let timeoutId: NodeJS.Timeout | undefined;
      const timeoutPromise = config.timeout ? new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(createApiError(
            ApiErrorCode.TIMEOUT,
            `Request timeout after ${config.timeout}ms`,
            undefined,
            'The request took too long to process',
            context.requestId
          ));
        }, config.timeout);
      }) : null;

      // 8. Execute Handler
      let result: any;
      try {
        const handlerPromise = handler(req, context);
        
        if (timeoutPromise) {
          result = await Promise.race([handlerPromise, timeoutPromise]);
        } else {
          result = await handlerPromise;
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }

      // 9. Sanitize Output (simplified for now)
      const sanitizedResult = result;

      // 10. Create Response
      const processingTime = Date.now() - startTime;
      const response = createApiResponse(sanitizedResult, undefined, context, processingTime);

      // 11. Add Security Headers (simplified for now)
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');

      // 12. Add Rate Limit Headers (if applicable)
      for (const [key, value] of Object.entries(context.headers)) {
        if (key.startsWith('X-RateLimit') || key === 'Retry-After') {
          response.headers.set(key, value);
        }
      }

      // 13. Cache Response (if enabled)
      if (config.caching?.enabled && req.method === 'GET') {
        // Cache implementation would go here
        apiLogger.debug('Caching GET response', context, { processingTime });
      }

      // 14. Log Successful Request
      apiLogger.logRequest(context, response.status, processingTime);

      if (config.monitoring?.performanceTracking && processingTime > 1000) {
        apiLogger.warn('Slow API response detected', context, {
          processingTime,
          threshold: 1000,
          endpoint: context.path
        });
      }

      return response;

    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      const apiError = handleAsyncError(error, context);
      const response = createApiResponse(undefined, apiError, context, processingTime);
      
      // Add security headers even for errors
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');

      // Log error
      apiLogger.logError(context, apiError, response.status, processingTime);

      // Additional error tracking for specific error types
      if (apiError.code === ApiErrorCode.RATE_LIMITED) {
        apiLogger.warn('Rate limit exceeded', context, {
          ip: context.ip,
          endpoint: context.path,
          userAgent: context.userAgent
        });
      }

      if (apiError.code === ApiErrorCode.UNAUTHORIZED || apiError.code === ApiErrorCode.FORBIDDEN) {
        apiLogger.warn('Authentication/authorization failure', context, {
          ip: context.ip,
          endpoint: context.path,
          errorCode: apiError.code
        });
      }

      return response;
    }
  };
}

// Convenience wrappers for common API patterns

// Simple GET handler
export function createGetHandler(
  handler: (req: NextRequest, context: RequestContext) => Promise<any>,
  config: Omit<ApiHandlerConfig, 'allowedMethods'> = {}
) {
  return createApiHandler(handler, {
    ...config,
    allowedMethods: ['GET']
  });
}

// Simple POST handler
export function createPostHandler(
  handler: (req: NextRequest, context: RequestContext) => Promise<any>,
  config: Omit<ApiHandlerConfig, 'allowedMethods'> = {}
) {
  return createApiHandler(handler, {
    ...config,
    allowedMethods: ['POST'],
    requireAuth: config.requireAuth !== false, // Default to requiring auth for POST
    rateLimitConfig: config.rateLimitConfig || 'standard'
  });
}

// Authenticated handler
export function createAuthenticatedHandler(
  handler: (req: NextRequest, context: RequestContext) => Promise<any>,
  config: Omit<ApiHandlerConfig, 'requireAuth'> = {}
) {
  return createApiHandler(handler, {
    ...config,
    requireAuth: true,
    rateLimitConfig: config.rateLimitConfig || 'standard'
  });
}

// Public handler (no auth required)
export function createPublicHandler(
  handler: (req: NextRequest, context: RequestContext) => Promise<any>,
  config: Omit<ApiHandlerConfig, 'requireAuth'> = {}
) {
  return createApiHandler(handler, {
    ...config,
    requireAuth: false,
    rateLimitConfig: config.rateLimitConfig || 'standard'
  });
}

// AI endpoint handler (special rate limits and logging)
export function createAIHandler(
  handler: (req: NextRequest, context: RequestContext) => Promise<any>,
  config: Omit<ApiHandlerConfig, 'rateLimitConfig'> = {}
) {
  return createApiHandler(handler, {
    ...config,
    allowedMethods: config.allowedMethods || ['POST'],
    requireAuth: config.requireAuth !== false,
    rateLimitConfig: 'ai',
    monitoring: {
      logLevel: 'info',
      performanceTracking: true,
      includeRequestBody: true,
      ...config.monitoring
    }
  });
}

// Webhook handler (relaxed security for external services)
export function createWebhookHandler(
  handler: (req: NextRequest, context: RequestContext) => Promise<any>,
  config: Omit<ApiHandlerConfig, 'requireAuth' | 'rateLimitConfig'> = {}
) {
  return createApiHandler(handler, {
    ...config,
    allowedMethods: config.allowedMethods || ['POST'],
    requireAuth: false,
    rateLimitConfig: 'webhook',
    security: {
      csrfProtection: false,
      ...config.security
    },
    monitoring: {
      logLevel: 'info',
      includeRequestBody: true,
      ...config.monitoring
    }
  });
}

// Export utility functions for route handlers
export {
  ApiErrorCode
} from './apiUtils';