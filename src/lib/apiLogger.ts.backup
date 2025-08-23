// Comprehensive API logging and monitoring for ALCHM
import { NextRequest } from 'next/server';
import { RequestContext, ApiError, sanitizeForLogging } from './apiUtils';

// Log levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// Log entry structure
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  requestId: string;
  userId?: string;
  method: string;
  path: string;
  ip: string;
  userAgent: string;
  processingTime?: number;
  statusCode?: number;
  error?: any;
  metadata?: Record<string, any>;
}

// Performance metrics
export interface PerformanceMetrics {
  requestId: string;
  method: string;
  path: string;
  statusCode: number;
  processingTime: number;
  timestamp: string;
  userId?: string;
  errorCode?: string;
  cacheHit?: boolean;
  dbQueries?: number;
  externalAPICalls?: number;
}

// Logger interface
interface Logger {
  log(entry: LogEntry): void;
  error(message: string, context: RequestContext, error?: any, metadata?: Record<string, any>): void;
  warn(message: string, context: RequestContext, metadata?: Record<string, any>): void;
  info(message: string, context: RequestContext, metadata?: Record<string, any>): void;
  debug(message: string, context: RequestContext, metadata?: Record<string, any>): void;
  logRequest(context: RequestContext, statusCode: number, processingTime: number): void;
  logError(context: RequestContext, error: ApiError, statusCode: number, processingTime: number): void;
  getMetrics(timeframe?: number): PerformanceMetrics[];
}

// Console logger implementation
class ConsoleLogger implements Logger {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000;

  log(entry: LogEntry): void {
    const colors = {
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.INFO]: '\x1b[36m',  // Cyan
      [LogLevel.DEBUG]: '\x1b[37m'  // White
    };

    const reset = '\x1b[0m';
    const color = colors[entry.level] || reset;

    const logLine = `${color}[${entry.timestamp}] ${entry.level.toUpperCase()} [${entry.requestId}] ${entry.message}${reset}`;
    
    console.log(logLine);
    
    if (entry.error || entry.metadata) {
      const details: any = {};
      if (entry.error) details.error = sanitizeForLogging(entry.error);
      if (entry.metadata) details.metadata = sanitizeForLogging(entry.metadata);
      if (Object.keys(details).length > 0) {
        console.log(`${color}  Details:${reset}`, details);
      }
    }
  }

  error(message: string, context: RequestContext, error?: any, metadata?: Record<string, any>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      requestId: context.requestId,
      userId: context.userId,
      method: context.method,
      path: context.path,
      ip: context.ip,
      userAgent: context.userAgent,
      error: error ? sanitizeForLogging(error) : undefined,
      metadata: metadata ? sanitizeForLogging(metadata) : undefined
    });
  }

  warn(message: string, context: RequestContext, metadata?: Record<string, any>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      requestId: context.requestId,
      userId: context.userId,
      method: context.method,
      path: context.path,
      ip: context.ip,
      userAgent: context.userAgent,
      metadata: metadata ? sanitizeForLogging(metadata) : undefined
    });
  }

  info(message: string, context: RequestContext, metadata?: Record<string, any>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      requestId: context.requestId,
      userId: context.userId,
      method: context.method,
      path: context.path,
      ip: context.ip,
      userAgent: context.userAgent,
      metadata: metadata ? sanitizeForLogging(metadata) : undefined
    });
  }

  debug(message: string, context: RequestContext, metadata?: Record<string, any>): void {
    // Only log debug in development
    if (process.env.NODE_ENV === 'development') {
      this.log({
        timestamp: new Date().toISOString(),
        level: LogLevel.DEBUG,
        message,
        requestId: context.requestId,
        userId: context.userId,
        method: context.method,
        path: context.path,
        ip: context.ip,
        userAgent: context.userAgent,
        metadata: metadata ? sanitizeForLogging(metadata) : undefined
      });
    }
  }

  logRequest(context: RequestContext, statusCode: number, processingTime: number): void {
    const metric: PerformanceMetrics = {
      requestId: context.requestId,
      method: context.method,
      path: context.path,
      statusCode,
      processingTime,
      timestamp: new Date().toISOString(),
      userId: context.userId
    };

    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    const level = statusCode >= 500 ? LogLevel.ERROR : 
                  statusCode >= 400 ? LogLevel.WARN : 
                  LogLevel.INFO;

    this.log({
      timestamp: new Date().toISOString(),
      level,
      message: `${context.method} ${context.path} - ${statusCode} (${processingTime}ms)`,
      requestId: context.requestId,
      userId: context.userId,
      method: context.method,
      path: context.path,
      ip: context.ip,
      userAgent: context.userAgent,
      processingTime,
      statusCode
    });
  }

  logError(context: RequestContext, error: ApiError, statusCode: number, processingTime: number): void {
    const metric: PerformanceMetrics = {
      requestId: context.requestId,
      method: context.method,
      path: context.path,
      statusCode,
      processingTime,
      timestamp: new Date().toISOString(),
      userId: context.userId,
      errorCode: error.code
    };

    this.metrics.push(metric);
    
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    this.error(
      `API Error: ${error.code} - ${error.message}`,
      context,
      error,
      {
        statusCode,
        processingTime,
        errorDetails: error.details
      }
    );
  }

  getMetrics(timeframe?: number): PerformanceMetrics[] {
    if (!timeframe) return [...this.metrics];
    
    const cutoff = new Date(Date.now() - timeframe);
    return this.metrics.filter(m => new Date(m.timestamp) > cutoff);
  }
}

// Structured logger for production (JSON format)
class StructuredLogger implements Logger {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000;

  log(entry: LogEntry): void {
    // Output structured JSON for log aggregation tools
    console.log(JSON.stringify({
      ...entry,
      service: 'alchm-api',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }));
  }

  error(message: string, context: RequestContext, error?: any, metadata?: Record<string, any>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      requestId: context.requestId,
      userId: context.userId,
      method: context.method,
      path: context.path,
      ip: context.ip,
      userAgent: context.userAgent,
      error: error ? sanitizeForLogging(error) : undefined,
      metadata: metadata ? sanitizeForLogging(metadata) : undefined
    });
  }

  warn(message: string, context: RequestContext, metadata?: Record<string, any>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      requestId: context.requestId,
      userId: context.userId,
      method: context.method,
      path: context.path,
      ip: context.ip,
      userAgent: context.userAgent,
      metadata: metadata ? sanitizeForLogging(metadata) : undefined
    });
  }

  info(message: string, context: RequestContext, metadata?: Record<string, any>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      requestId: context.requestId,
      userId: context.userId,
      method: context.method,
      path: context.path,
      ip: context.ip,
      userAgent: context.userAgent,
      metadata: metadata ? sanitizeForLogging(metadata) : undefined
    });
  }

  debug(message: string, context: RequestContext, metadata?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
      this.log({
        timestamp: new Date().toISOString(),
        level: LogLevel.DEBUG,
        message,
        requestId: context.requestId,
        userId: context.userId,
        method: context.method,
        path: context.path,
        ip: context.ip,
        userAgent: context.userAgent,
        metadata: metadata ? sanitizeForLogging(metadata) : undefined
      });
    }
  }

  logRequest(context: RequestContext, statusCode: number, processingTime: number): void {
    const metric: PerformanceMetrics = {
      requestId: context.requestId,
      method: context.method,
      path: context.path,
      statusCode,
      processingTime,
      timestamp: new Date().toISOString(),
      userId: context.userId
    };

    this.metrics.push(metric);
    
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    const level = statusCode >= 500 ? LogLevel.ERROR : 
                  statusCode >= 400 ? LogLevel.WARN : 
                  LogLevel.INFO;

    this.log({
      timestamp: new Date().toISOString(),
      level,
      message: 'API Request',
      requestId: context.requestId,
      userId: context.userId,
      method: context.method,
      path: context.path,
      ip: context.ip,
      userAgent: context.userAgent,
      processingTime,
      statusCode,
      metadata: {
        requestMetrics: {
          processingTime,
          statusCode,
          path: context.path,
          method: context.method
        }
      }
    });
  }

  logError(context: RequestContext, error: ApiError, statusCode: number, processingTime: number): void {
    const metric: PerformanceMetrics = {
      requestId: context.requestId,
      method: context.method,
      path: context.path,
      statusCode,
      processingTime,
      timestamp: new Date().toISOString(),
      userId: context.userId,
      errorCode: error.code
    };

    this.metrics.push(metric);
    
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message: 'API Error',
      requestId: context.requestId,
      userId: context.userId,
      method: context.method,
      path: context.path,
      ip: context.ip,
      userAgent: context.userAgent,
      processingTime,
      statusCode,
      error: sanitizeForLogging(error),
      metadata: {
        errorMetrics: {
          errorCode: error.code,
          processingTime,
          statusCode,
          path: context.path,
          method: context.method
        }
      }
    });
  }

  getMetrics(timeframe?: number): PerformanceMetrics[] {
    if (!timeframe) return [...this.metrics];
    
    const cutoff = new Date(Date.now() - timeframe);
    return this.metrics.filter(m => new Date(m.timestamp) > cutoff);
  }
}

// Analytics and monitoring
export class ApiAnalytics {
  private logger: Logger;
  private alerts: AlertRule[] = [];

  constructor(logger: Logger) {
    this.logger = logger;
    this.setupDefaultAlerts();
  }

  private setupDefaultAlerts(): void {
    // High error rate alert
    this.alerts.push({
      name: 'high_error_rate',
      condition: (metrics) => {
        const recentMetrics = metrics.filter(m => 
          new Date(m.timestamp) > new Date(Date.now() - 5 * 60 * 1000)
        );
        if (recentMetrics.length === 0) return false;
        
        const errorCount = recentMetrics.filter(m => m.statusCode >= 500).length;
        const errorRate = errorCount / recentMetrics.length;
        return errorRate > 0.1; // 10% error rate
      },
      action: (metrics) => {
        console.error('[ALERT] High error rate detected:', {
          errorRate: metrics.filter(m => m.statusCode >= 500).length / metrics.length,
          timeframe: '5 minutes',
          totalRequests: metrics.length
        });
      }
    });

    // Slow response time alert
    this.alerts.push({
      name: 'slow_response_time',
      condition: (metrics) => {
        const recentMetrics = metrics.filter(m => 
          new Date(m.timestamp) > new Date(Date.now() - 5 * 60 * 1000)
        );
        if (recentMetrics.length === 0) return false;
        
        const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.processingTime, 0) / recentMetrics.length;
        return avgResponseTime > 2000; // 2 seconds average
      },
      action: (metrics) => {
        const avgResponseTime = metrics.reduce((sum, m) => sum + m.processingTime, 0) / metrics.length;
        console.warn('[ALERT] Slow response time detected:', {
          averageResponseTime: avgResponseTime,
          timeframe: '5 minutes',
          totalRequests: metrics.length
        });
      }
    });
  }

  checkAlerts(): void {
    const metrics = this.logger.getMetrics(5 * 60 * 1000); // Last 5 minutes
    
    for (const alert of this.alerts) {
      if (alert.condition(metrics)) {
        alert.action(metrics);
      }
    }
  }

  getApiHealth(): ApiHealthStatus {
    const metrics = this.logger.getMetrics(15 * 60 * 1000); // Last 15 minutes
    
    if (metrics.length === 0) {
      return {
        status: 'unknown',
        metrics: {
          requestCount: 0,
          errorRate: 0,
          averageResponseTime: 0,
          p95ResponseTime: 0
        }
      };
    }

    const errorCount = metrics.filter(m => m.statusCode >= 500).length;
    const errorRate = errorCount / metrics.length;
    
    const responseTimes = metrics.map(m => m.processingTime).sort((a, b) => a - b);
    const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p95ResponseTime = responseTimes[p95Index] || 0;

    let status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
    if (errorRate > 0.1 || averageResponseTime > 3000) {
      status = 'unhealthy';
    } else if (errorRate > 0.05 || averageResponseTime > 1500) {
      status = 'degraded';
    } else {
      status = 'healthy';
    }

    return {
      status,
      metrics: {
        requestCount: metrics.length,
        errorRate,
        averageResponseTime,
        p95ResponseTime
      }
    };
  }
}

// Alert rule interface
interface AlertRule {
  name: string;
  condition: (metrics: PerformanceMetrics[]) => boolean;
  action: (metrics: PerformanceMetrics[]) => void;
}

// API health status
interface ApiHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  metrics: {
    requestCount: number;
    errorRate: number;
    averageResponseTime: number;
    p95ResponseTime: number;
  };
}

// Create logger instance based on environment
export function createLogger(): Logger {
  if (process.env.NODE_ENV === 'production') {
    return new StructuredLogger();
  } else {
    return new ConsoleLogger();
  }
}

// Export singleton instances
export const apiLogger = createLogger();
export const apiAnalytics = new ApiAnalytics(apiLogger);

// Start monitoring in production
if (process.env.NODE_ENV === 'production') {
  // Check alerts every minute
  setInterval(() => {
    apiAnalytics.checkAlerts();
  }, 60000);
}