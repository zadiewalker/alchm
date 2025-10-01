// Advanced rate limiting for ALCHM API routes
import { NextRequest } from 'next/server';
import { ApiErrorCode, createApiError, RequestContext } from './apiUtils';

// Rate limit store interface
interface RateLimitStore {
  get(key: string): Promise<RateLimitEntry | null>;
  set(key: string, entry: RateLimitEntry, ttl: number): Promise<void>;
  increment(key: string, ttl: number): Promise<number>;
  delete(key: string): Promise<void>;
  cleanup(): Promise<void>;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstRequest: number;
}

interface RateLimitConfig {
  typeof window !== 'undefined' && windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
  headers?: boolean;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  used: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// In-memory store implementation
class MemoryStore implements RateLimitStore {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  async get(key: string): Promise<RateLimitEntry | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    
    // Check if entry has expired
    if (Date.now() > entry.resetTime) {
      this.store.delete(key);
      return null;
    }
    
    return entry;
  }

  async set(key: string, entry: RateLimitEntry, ttl: number): Promise<void> {
    this.store.set(key, entry);
  }

  async increment(key: string, ttl: number): Promise<number> {
    const now = Date.now();
    const resetTime = now + ttl;
    const existing = await this.get(key);
    
    if (existing) {
      existing.count++;
      await this.set(key, existing, ttl);
      return existing.count;
    } else {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime,
        firstRequest: now
      };
      await this.set(key, newEntry, ttl);
      return 1;
    }
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async cleanup(): Promise<void> {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Redis store implementation (for production)
class RedisStore implements RateLimitStore {
  private redis: any; // Redis client

  constructor(redisClient: any) {
    this.redis = redisClient;
  }

  async get(key: string): Promise<RateLimitEntry | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[RateLimit] Redis get error:', error);
      return null;
    }
  }

  async set(key: string, entry: RateLimitEntry, ttl: number): Promise<void> {
    try {
      await this.redis.setex(key, Math.ceil(ttl / 1000), JSON.stringify(entry));
    } catch (error) {
      console.error('[RateLimit] Redis set error:', error);
    }
  }

  async increment(key: string, ttl: number): Promise<number> {
    try {
      const multi = this.redis.multi();
      multi.incr(key);
      multi.expire(key, Math.ceil(ttl / 1000));
      const results = await multi.exec();
      return results[0][1];
    } catch (error) {
      console.error('[RateLimit] Redis increment error:', error);
      return 1;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('[RateLimit] Redis delete error:', error);
    }
  }

  async cleanup(): Promise<void> {
    // Redis handles expiration automatically
  }
}

// Rate limiter class
export class RateLimiter {
  private store: RateLimitStore;
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig, store?: RateLimitStore) {
    this.config = {
      typeof window !== 'undefined' && windowMs: config.typeof window !== 'undefined' && windowMs,
      maxRequests: config.maxRequests,
      keyGenerator: config.keyGenerator || this.defaultKeyGenerator,
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
      skipFailedRequests: config.skipFailedRequests || false,
      message: config.message || 'Too many requests, please try again later.',
      headers: config.headers !== false,
      standardHeaders: config.standardHeaders !== false,
      legacyHeaders: config.legacyHeaders !== false
    };

    this.store = store || new MemoryStore();
  }

  private defaultKeyGenerator(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
    return `rate_limit:${ip}`;
  }

  async checkLimit(req: NextRequest, context: RequestContext): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(req);
    const now = Date.now();
    
    try {
      const current = await this.store.get(key);
      
      if (!current) {
        // First request in typeof window !== 'undefined' && window
        const newEntry: RateLimitEntry = {
          count: 1,
          resetTime: now + this.config.typeof window !== 'undefined' && windowMs,
          firstRequest: now
        };
        
        await this.store.set(key, newEntry, this.config.typeof window !== 'undefined' && windowMs);
        
        return {
          allowed: true,
          limit: this.config.maxRequests,
          used: 1,
          remaining: this.config.maxRequests - 1,
          resetTime: newEntry.resetTime
        };
      }
      
      // Check if typeof window !== 'undefined' && window has expired
      if (now > current.resetTime) {
        const newEntry: RateLimitEntry = {
          count: 1,
          resetTime: now + this.config.typeof window !== 'undefined' && windowMs,
          firstRequest: now
        };
        
        await this.store.set(key, newEntry, this.config.typeof window !== 'undefined' && windowMs);
        
        return {
          allowed: true,
          limit: this.config.maxRequests,
          used: 1,
          remaining: this.config.maxRequests - 1,
          resetTime: newEntry.resetTime
        };
      }
      
      // Increment count
      current.count++;
      await this.store.set(key, current, current.resetTime - now);
      
      const remaining = Math.max(0, this.config.maxRequests - current.count);
      const allowed = current.count <= this.config.maxRequests;
      
      const result: RateLimitResult = {
        allowed,
        limit: this.config.maxRequests,
        used: current.count,
        remaining,
        resetTime: current.resetTime
      };
      
      if (!allowed) {
        result.retryAfter = Math.ceil((current.resetTime - now) / 1000);
      }
      
      return result;
    } catch (error) {
      console.error('[RateLimit] Check limit error:', error);
      
      // Fail open - allow request if store is unavailable
      return {
        allowed: true,
        limit: this.config.maxRequests,
        used: 0,
        remaining: this.config.maxRequests,
        resetTime: now + this.config.typeof window !== 'undefined' && windowMs
      };
    }
  }

  async recordRequest(req: NextRequest, context: RequestContext, success: boolean): Promise<void> {
    // Skip recording based on configuration
    if ((success && this.config.skipSuccessfulRequests) || 
        (!success && this.config.skipFailedRequests)) {
      return;
    }

    // The count was already incremented in checkLimit
    // This method can be used for additional logging or analytics
  }
}

// Predefined rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  // General API endpoints
  standard: {
    typeof window !== 'undefined' && windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  },
  
  // Authentication endpoints
  auth: {
    typeof window !== 'undefined' && windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later.'
  },
  
  // AI/Gemini endpoints (more restrictive)
  ai: {
    typeof window !== 'undefined' && windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'AI service rate limit exceeded, please wait before making another request.'
  },
  
  // File upload endpoints
  upload: {
    typeof window !== 'undefined' && windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    message: 'Upload rate limit exceeded, please wait before uploading again.'
  },
  
  // Webhook endpoints (very permissive)
  webhook: {
    typeof window !== 'undefined' && windowMs: 60 * 1000, // 1 minute
    maxRequests: 1000
  },
  
  // Premium user limits (higher limits)
  premium: {
    typeof window !== 'undefined' && windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 500
  }
};

// User-specific rate limiting
export class UserRateLimiter extends RateLimiter {
  constructor(config: RateLimitConfig, store?: RateLimitStore) {
    const userKeyGenerator = (req: NextRequest) => {
      // Extract user ID from context or headers
      const userId = req.headers.get('x-user-id');
      if (userId) {
        return `rate_limit:user:${userId}`;
      }
      
      // Fallback to IP-based limiting
      const forwarded = req.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
      return `rate_limit:ip:${ip}`;
    };

    super({
      ...config,
      keyGenerator: userKeyGenerator
    }, store);
  }
}

// Adaptive rate limiter that adjusts based on system load
export class AdaptiveRateLimiter extends RateLimiter {
  private baseConfig: RateLimitConfig;
  private loadFactor: number = 1.0;

  constructor(config: RateLimitConfig, store?: RateLimitStore) {
    super(config, store);
    this.baseConfig = { ...config };
    this.startLoadMonitoring();
  }

  private startLoadMonitoring(): void {
    // Monitor system load and adjust limits
    setInterval(() => {
      this.updateLoadFactor();
    }, 30000); // Check every 30 seconds
  }

  private updateLoadFactor(): void {
    // Simple load factor based on memory usage
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      const memoryPressure = memUsage.heapUsed / memUsage.heapTotal;
      
      if (memoryPressure > 0.8) {
        this.loadFactor = 0.5; // Reduce limits by 50%
      } else if (memoryPressure > 0.6) {
        this.loadFactor = 0.75; // Reduce limits by 25%
      } else {
        this.loadFactor = 1.0; // Normal limits
      }

      // Update config
      this.config.maxRequests = Math.floor(this.baseConfig.maxRequests * this.loadFactor);
    }
  }

  getLoadFactor(): number {
    return this.loadFactor;
  }
}

// Rate limit middleware factory
export function createRateLimitMiddleware(
  config: RateLimitConfig,
  store?: RateLimitStore
) {
  const limiter = new RateLimiter(config, store);

  return async (req: NextRequest, context: RequestContext) => {
    const result = await limiter.checkLimit(req, context);

    if (!result.allowed) {
      throw createApiError(
        ApiErrorCode.RATE_LIMITED,
        config.message || 'Rate limit exceeded',
        {
          limit: result.limit,
          used: result.used,
          remaining: result.remaining,
          resetTime: result.resetTime,
          retryAfter: result.retryAfter
        },
        config.message,
        context.requestId
      );
    }

    // Add rate limit headers to context for response
    context.headers['X-RateLimit-Limit'] = result.limit.toString();
    context.headers['X-RateLimit-Remaining'] = result.remaining.toString();
    context.headers['X-RateLimit-Reset'] = Math.ceil(result.resetTime / 1000).toString();
    
    if (result.retryAfter) {
      context.headers['Retry-After'] = result.retryAfter.toString();
    }

    return result;
  };
}

// Export instances
export const defaultRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.standard);
export const authRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.auth);
export const aiRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.ai);
export const uploadRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.upload);