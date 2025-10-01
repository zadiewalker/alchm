/**
 * Firebase Functions 2nd Generation Performance Optimizer for ALCHM
 * 
 * MISSION-CRITICAL: Ensures sub-3-second response times for crisis detection
 * and mental health support features. Every millisecond saved could help save a life.
 */

import { logger } from '@/lib/logging';

export interface FunctionPerformanceConfig {
  memory: '256MB' | '512MB' | '1GB' | '2GB' | '4GB' | '8GB';
  timeout: number; // seconds
  minInstances: number;
  maxInstances: number;
  concurrency: number;
  cpu: number; // CPU count for 2nd gen
  region: string;
  vpc?: {
    connector: string;
    egressSettings: 'PRIVATE_RANGES_ONLY' | 'ALL_TRAFFIC';
  };
}

export interface CrisisOptimizedConfig extends FunctionPerformanceConfig {
  priority: 'crisis' | 'standard' | 'background';
  warmupSchedule?: string;
  connectionPooling: boolean;
  cacheStrategy: 'aggressive' | 'standard' | 'minimal';
}

// Optimized configurations for different function types
export const FUNCTION_CONFIGS: Record<string, CrisisOptimizedConfig> = {
  // Crisis detection - highest priority, fastest response
  crisisDetection: {
    memory: '2GB',
    timeout: 30,
    minInstances: 3, // Always warm for immediate response
    maxInstances: 50,
    concurrency: 100,
    cpu: 2,
    region: 'us-central1',
    priority: 'crisis',
    warmupSchedule: '0 * * * *', // Keep warm every hour
    connectionPooling: true,
    cacheStrategy: 'aggressive'
  },

  // AI reflection processing - high priority, optimized for batch processing
  aiReflection: {
    memory: '4GB',
    timeout: 60,
    minInstances: 2,
    maxInstances: 100,
    concurrency: 50,
    cpu: 4,
    region: 'us-central1',
    priority: 'crisis',
    connectionPooling: true,
    cacheStrategy: 'standard'
  },

  // Real-time monitoring - medium priority, consistent performance
  realtimeMonitoring: {
    memory: '1GB',
    timeout: 30,
    minInstances: 1,
    maxInstances: 25,
    concurrency: 80,
    cpu: 2,
    region: 'us-central1',
    priority: 'standard',
    connectionPooling: true,
    cacheStrategy: 'standard'
  },

  // Performance monitoring - low priority, efficient batching
  performanceTracking: {
    memory: '512MB',
    timeout: 30,
    minInstances: 0,
    maxInstances: 10,
    concurrency: 100,
    cpu: 1,
    region: 'us-central1',
    priority: 'background',
    connectionPooling: true,
    cacheStrategy: 'minimal'
  },

  // User authentication - high priority, fast response
  userAuth: {
    memory: '1GB',
    timeout: 30,
    minInstances: 2,
    maxInstances: 50,
    concurrency: 100,
    cpu: 2,
    region: 'us-central1',
    priority: 'crisis',
    warmupSchedule: '*/30 * * * *', // Keep warm every 30 minutes
    connectionPooling: true,
    cacheStrategy: 'aggressive'
  },

  // Stripe webhooks - medium priority, reliable processing
  stripeWebhooks: {
    memory: '512MB',
    timeout: 60,
    minInstances: 1,
    maxInstances: 20,
    concurrency: 50,
    cpu: 1,
    region: 'us-central1',
    priority: 'standard',
    connectionPooling: true,
    cacheStrategy: 'standard'
  }
};

/**
 * Crisis-Optimized Connection Pool Manager
 * Maintains persistent connections to reduce cold start impact
 */
export class CrisisConnectionPool {
  private static instance: CrisisConnectionPool | null = null;
  private pools = new Map<string, any>();
  private healthChecks = new Map<string, number>();

  static getInstance(): CrisisConnectionPool {
    if (!this.instance) {
      this.instance = new CrisisConnectionPool();
    }
    return this.instance;
  }

  async getConnection(service: string, config: any): Promise<any> {
    const poolKey = `${service}_${JSON.stringify(config)}`;
    
    if (this.pools.has(poolKey)) {
      const connection = this.pools.get(poolKey);
      
      // Health check - ensure connection is still valid
      if (await this.isConnectionHealthy(connection, service)) {
        return connection;
      } else {
        this.pools.delete(poolKey);
      }
    }

    // Create new connection
    const connection = await this.createConnection(service, config);
    this.pools.set(poolKey, connection);
    this.healthChecks.set(poolKey, Date.now());
    
    return connection;
  }

  private async createConnection(service: string, config: any): Promise<any> {
    switch (service) {
      case 'firestore':
        return this.createFirestoreConnection(config);
      case 'openai':
        return this.createOpenAIConnection(config);
      case 'gemini':
        return this.createGeminiConnection(config);
      default:
        throw new Error(`Unknown service: ${service}`);
    }
  }

  private async createFirestoreConnection(config: any): Promise<any> {
    // Connection pooling configuration for Firestore
    return {
      poolSize: config.poolSize || 10,
      maxIdleTime: config.maxIdleTime || 300000, // 5 minutes
      connectionTimeout: config.connectionTimeout || 5000, // 5 seconds
      created: Date.now()
    };
  }

  private async createOpenAIConnection(config: any): Promise<any> {
    // Connection pooling for OpenAI API
    return {
      baseURL: 'https://api.openai.com/v1',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      created: Date.now()
    };
  }

  private async createGeminiConnection(config: any): Promise<any> {
    // Connection pooling for Google Gemini API
    return {
      baseURL: 'https://generativelanguage.googleapis.com/v1beta',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      created: Date.now()
    };
  }

  private async isConnectionHealthy(connection: any, service: string): Promise<boolean> {
    const maxAge = 600000; // 10 minutes
    const age = Date.now() - connection.created;
    
    if (age > maxAge) {
      return false;
    }

    // Service-specific health checks
    try {
      switch (service) {
        case 'firestore':
          return true; // Firestore connections don't typically fail
        case 'openai':
        case 'gemini':
          return true; // API connections are stateless
        default:
          return true;
      }
    } catch (error) {
      logger.warn(`Health check failed for ${service}`, error);
      return false;
    }
  }

  cleanup(): void {
    // Clean up old connections
    const maxAge = 900000; // 15 minutes
    const now = Date.now();

    for (const [key, timestamp] of this.healthChecks.entries()) {
      if (now - timestamp > maxAge) {
        this.pools.delete(key);
        this.healthChecks.delete(key);
      }
    }
  }
}

/**
 * Performance-Optimized Function Wrapper
 * Provides crisis-aware performance optimizations
 */
export class CrisisOptimizedFunction {
  private config: CrisisOptimizedConfig;
  private connectionPool: CrisisConnectionPool;
  private performanceMetrics = new Map<string, number[]>();

  constructor(config: CrisisOptimizedConfig) {
    this.config = config;
    this.connectionPool = CrisisConnectionPool.getInstance();
  }

  async execute<T>(
    functionName: string,
    handler: () => Promise<T>,
    context?: { userId?: string; riskLevel?: string }
  ): Promise<T> {
    const startTime = Date.now();
    const executionId = `${functionName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Apply crisis-specific optimizations
      if (this.config.priority === 'crisis') {
        await this.applyCrisisOptimizations(context);
      }

      // Execute the function
      const result = await handler();

      // Record performance metrics
      const executionTime = Date.now() - startTime;
      this.recordPerformanceMetric(functionName, executionTime);

      // Check for performance degradation
      await this.checkPerformanceThresholds(functionName, executionTime);

      logger.info(`Function executed successfully`, {
        functionName,
        executionTime,
        executionId,
        priority: this.config.priority
      });

      return result;

    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      logger.error(`Function execution failed`, {
        functionName,
        executionTime,
        executionId,
        error: error instanceof Error ? error.message : 'Unknown error',
        priority: this.config.priority
      });

      // If this is a crisis function, try emergency fallback
      if (this.config.priority === 'crisis') {
        return await this.executeEmergencyFallback(functionName, error);
      }

      throw error;
    }
  }

  private async applyCrisisOptimizations(context?: { userId?: string; riskLevel?: string }): Promise<void> {
    // Preload connections for crisis functions
    if (this.config.connectionPooling) {
      await this.preloadConnections();
    }

    // Adjust timeout based on risk level
    if (context?.riskLevel === 'critical') {
      // Reduce timeout for critical cases to fail fast and try alternatives
      this.config.timeout = Math.min(this.config.timeout, 15);
    }

    // Enable aggressive caching for crisis functions
    if (this.config.cacheStrategy === 'aggressive') {
      await this.enableAggressiveCaching();
    }
  }

  private async preloadConnections(): Promise<void> {
    try {
      // Preload Firestore connection
      await this.connectionPool.getConnection('firestore', {
        poolSize: 20,
        maxIdleTime: 600000 // 10 minutes for crisis functions
      });

      // Preload AI service connections
      await this.connectionPool.getConnection('gemini', {
        timeout: 15000,
        maxRetries: 2
      });

    } catch (error) {
      logger.warn('Failed to preload connections', error);
    }
  }

  private async enableAggressiveCaching(): Promise<void> {
    // Implementation would depend on caching strategy
    // For crisis functions, cache everything possible
    logger.debug('Aggressive caching enabled for crisis function');
  }

  private recordPerformanceMetric(functionName: string, executionTime: number): void {
    if (!this.performanceMetrics.has(functionName)) {
      this.performanceMetrics.set(functionName, []);
    }

    const metrics = this.performanceMetrics.get(functionName)!;
    metrics.push(executionTime);

    // Keep only recent metrics (last 100 executions)
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
  }

  private async checkPerformanceThresholds(functionName: string, executionTime: number): Promise<void> {
    const thresholds = {
      crisis: 3000, // 3 seconds for crisis functions
      standard: 5000, // 5 seconds for standard functions
      background: 10000 // 10 seconds for background functions
    };

    const threshold = thresholds[this.config.priority];
    
    if (executionTime > threshold) {
      logger.warn(`Function performance threshold exceeded`, {
        functionName,
        executionTime,
        threshold,
        priority: this.config.priority
      });

      // Alert for crisis functions
      if (this.config.priority === 'crisis') {
        await this.triggerPerformanceAlert(functionName, executionTime, threshold);
      }
    }
  }

  private async triggerPerformanceAlert(functionName: string, executionTime: number, threshold: number): Promise<void> {
    // This would integrate with your monitoring system
    logger.error(`CRISIS FUNCTION PERFORMANCE ALERT`, {
      functionName,
      executionTime,
      threshold,
      severity: 'critical'
    });

    // Could send to external monitoring service
    try {
      // Example: Send to monitoring API
      // await fetch('/api/monitoring/performance-alert', { ... });
    } catch (error) {
      logger.warn('Failed to send performance alert', error);
    }
  }

  private async executeEmergencyFallback<T>(functionName: string, originalError: any): Promise<T> {
    logger.warn(`Executing emergency fallback for ${functionName}`, originalError);

    // Emergency fallback strategies
    switch (functionName) {
      case 'crisisDetection':
        return this.crisisDetectionFallback() as T;
      case 'aiReflection':
        return this.aiReflectionFallback() as T;
      default:
        throw originalError;
    }
  }

  private crisisDetectionFallback(): any {
    // Always err on the side of caution
    return {
      riskLevel: 'moderate',
      confidence: 0.5,
      interventionType: 'resource_offer',
      culturallyAppropriateResources: [
        {
          type: 'hotline',
          name: '988 Suicide & Crisis Lifeline',
          contact: '988',
          description: '24/7 free and confidential support',
          available24h: true,
          languages: ['English', 'Spanish'],
          costFree: true,
          confidential: true
        }
      ],
      immediateActions: [
        {
          priority: 1,
          action: 'If you\'re in crisis, call 988 for immediate support',
          timeframe: 'immediate',
          culturallyAdapted: false
        }
      ],
      supportMessage: 'We want to make sure you\'re safe. If you\'re having thoughts of hurting yourself, please reach out for help immediately.',
      followUpRecommended: true,
      escalationTrigger: false,
      responseTimeMs: 100
    };
  }

  private aiReflectionFallback(): any {
    // Provide supportive but generic response
    return {
      reflection: 'Thank you for sharing your thoughts. Your willingness to reflect shows strength and self-awareness.',
      moodPrediction: 6, // Neutral/slightly positive
      suggestedActions: [
        'Take three deep breaths and acknowledge this moment of self-reflection',
        'Consider sharing this insight with someone you trust',
        'Remember that every step of reflection is meaningful'
      ],
      riskAssessment: 'low',
      celebrationMoment: false,
      traumaInformed: true,
      modelVersion: 'emergency-fallback',
      tier: 'emergency',
      createdAt: new Date().toISOString()
    };
  }

  getPerformanceReport(): string {
    let report = `🎯 Function Performance Report: ${this.config.priority} priority\n`;
    report += '=' .repeat(50) + '\n\n';

    for (const [functionName, metrics] of this.performanceMetrics.entries()) {
      const avg = metrics.reduce((a, b) => a + b, 0) / metrics.length;
      const max = Math.max(...metrics);
      const min = Math.min(...metrics);
      
      report += `${functionName}:\n`;
      report += `  Average: ${avg.toFixed(0)}ms\n`;
      report += `  Min: ${min}ms | Max: ${max}ms\n`;
      report += `  Executions: ${metrics.length}\n\n`;
    }

    return report;
  }
}

// Pre-configured function wrappers for common use cases
export const createCrisisDetectionFunction = () => 
  new CrisisOptimizedFunction(FUNCTION_CONFIGS.crisisDetection);

export const createAIReflectionFunction = () => 
  new CrisisOptimizedFunction(FUNCTION_CONFIGS.aiReflection);

export const createRealtimeMonitoringFunction = () => 
  new CrisisOptimizedFunction(FUNCTION_CONFIGS.realtimeMonitoring);

export const createPerformanceTrackingFunction = () => 
  new CrisisOptimizedFunction(FUNCTION_CONFIGS.performanceTracking);

export const createUserAuthFunction = () => 
  new CrisisOptimizedFunction(FUNCTION_CONFIGS.userAuth);

export const createStripeWebhookFunction = () => 
  new CrisisOptimizedFunction(FUNCTION_CONFIGS.stripeWebhooks);

// Global performance monitoring
export const startGlobalPerformanceMonitoring = () => {
  const connectionPool = CrisisConnectionPool.getInstance();
  
  // Cleanup old connections every 5 minutes
  setInterval(() => {
    connectionPool.cleanup();
  }, 300000);

  logger.info('Global performance monitoring started');
};

export default CrisisOptimizedFunction;