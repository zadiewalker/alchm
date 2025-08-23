// Production-Grade AI Infrastructure That Never Breaks
// Problem: AI failures kill user trust instantly
// Solution: Multi-tier resilience with graceful degradation

import { defineFlow } from '@genkit-ai/flow';
import { gemini15Flash, gemini15Pro } from '@genkit-ai/googleai';
import { z } from 'zod';
import { logger } from '@/lib/logging';
import Redis from 'ioredis';

// AI Resilience Configuration
export interface AIResilience {
  primary: 'gemini-flash-15';      // 90% of requests - fastest
  fallback: 'gemini-pro-15';       // When Flash is overloaded
  emergency: 'local-model';        // Offline-capable insights
  cache: 'memorystore-redis';      // <100ms for repeated patterns
}

export interface AITier {
  name: string;
  provider: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  retries: number;
  costPerToken: number;
  qualityScore: number; // 0-1 scale
}

// Circuit breaker state
interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  successCount: number;
}

// AI request input/output schemas
const AIRequestSchema = z.object({
  text: z.string().min(1),
  userId: z.string(),
  requestType: z.enum(['reflection', 'crisis_assessment', 'insight_generation', 'pattern_analysis']),
  context: z.object({
    previousEntries: z.array(z.string()).optional(),
    userProfile: z.object({
      communicationStyle: z.string().optional(),
      traumaInformed: z.boolean().default(true),
      preferredTone: z.string().optional()
    }).optional(),
    urgency: z.enum(['low', 'medium', 'high', 'critical']).default('medium')
  }),
  timestamp: z.number()
});

const AIResponseSchema = z.object({
  insight: z.string(),
  confidence: z.number().min(0).max(1),
  tier: z.string(),
  processingTime: z.number(),
  cached: z.boolean(),
  fallbackUsed: z.boolean(),
  quality: z.object({
    traumaInformed: z.boolean(),
    personalized: z.boolean(),
    actionable: z.boolean(),
    empathetic: z.boolean()
  })
});

export type AIRequest = z.infer<typeof AIRequestSchema>;
export type AIResponse = z.infer<typeof AIResponseSchema>;

// AI Tier Configuration
const AI_TIERS: Record<string, AITier> = {
  primary: {
    name: 'Gemini Flash 1.5',
    provider: 'google',
    model: 'gemini-1.5-flash',
    maxTokens: 2048,
    temperature: 0.7,
    timeout: 3000, // 3 seconds
    retries: 2,
    costPerToken: 0.0001,
    qualityScore: 0.95
  },
  fallback: {
    name: 'Gemini Pro 1.5',
    provider: 'google', 
    model: 'gemini-1.5-pro',
    maxTokens: 2048,
    temperature: 0.6,
    timeout: 8000, // 8 seconds
    retries: 1,
    costPerToken: 0.0005,
    qualityScore: 0.98
  },
  emergency: {
    name: 'Local Emergency Model',
    provider: 'local',
    model: 'emergency-insights',
    maxTokens: 500,
    temperature: 0.5,
    timeout: 1000, // 1 second
    retries: 0,
    costPerToken: 0,
    qualityScore: 0.75
  }
};

// Redis client for caching and circuit breaker state
class AICache {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });
  }
  
  // Generate cache key
  private getCacheKey(request: AIRequest): string {
    const contextHash = this.hashObject({
      requestType: request.requestType,
      textLength: request.text.length,
      userStyle: request.context.userProfile?.communicationStyle || 'default'
    });
    
    return `ai:${request.requestType}:${contextHash}`;
  }
  
  // Hash object for consistent cache keys
  private hashObject(obj: any): string {
    return Buffer.from(JSON.stringify(obj)).toString('base64').slice(0, 16);
  }
  
  // Get cached response
  async get(request: AIRequest): Promise<AIResponse | null> {
    try {
      const key = this.getCacheKey(request);
      const cached = await this.redis.get(key);
      
      if (cached) {
        const response = JSON.parse(cached);
        
        // Update cache hit metrics
        await this.recordCacheHit(request.requestType);
        
        return {
          ...response,
          cached: true,
          processingTime: 0
        };
      }
      
      return null;
    } catch (error) {
      logger.warn('Cache get error', error);
      return null;
    }
  }
  
  // Set cached response
  async set(request: AIRequest, response: AIResponse, ttl: number = 3600): Promise<void> {
    try {
      const key = this.getCacheKey(request);
      const value = JSON.stringify({
        ...response,
        cachedAt: Date.now()
      });
      
      await this.redis.setex(key, ttl, value);
      
      // Record cache metrics
      await this.recordCacheSet(request.requestType);
      
    } catch (error) {
      logger.warn('Cache set error', error);
    }
  }
  
  // Record cache hit metrics
  private async recordCacheHit(requestType: string): Promise<void> {
    await this.redis.incr(`cache:hits:${requestType}`);
    await this.redis.incr('cache:hits:total');
  }
  
  // Record cache set metrics
  private async recordCacheSet(requestType: string): Promise<void> {
    await this.redis.incr(`cache:sets:${requestType}`);
    await this.redis.incr('cache:sets:total');
  }
  
  // Get cache statistics
  async getStats(): Promise<any> {
    const hits = await this.redis.get('cache:hits:total') || '0';
    const sets = await this.redis.get('cache:sets:total') || '0';
    
    return {
      totalHits: parseInt(hits),
      totalSets: parseInt(sets),
      hitRate: parseInt(hits) / (parseInt(hits) + parseInt(sets))
    };
  }
}

// Circuit Breaker Implementation
class CircuitBreaker {
  private state: CircuitBreakerState;
  private readonly failureThreshold: number;
  private readonly timeout: number;
  private readonly successThreshold: number;
  
  constructor(
    private tierName: string,
    failureThreshold: number = 5,
    timeout: number = 60000, // 1 minute
    successThreshold: number = 3
  ) {
    this.failureThreshold = failureThreshold;
    this.timeout = timeout;
    this.successThreshold = successThreshold;
    this.state = {
      failures: 0,
      lastFailureTime: 0,
      state: 'CLOSED',
      successCount: 0
    };
  }
  
  // Check if request should be allowed
  canExecute(): boolean {
    const now = Date.now();
    
    switch (this.state.state) {
      case 'CLOSED':
        return true;
        
      case 'OPEN':
        if (now - this.state.lastFailureTime > this.timeout) {
          this.state.state = 'HALF_OPEN';
          this.state.successCount = 0;
          return true;
        }
        return false;
        
      case 'HALF_OPEN':
        return true;
        
      default:
        return false;
    }
  }
  
  // Record successful execution
  onSuccess(): void {
    this.state.failures = 0;
    
    if (this.state.state === 'HALF_OPEN') {
      this.state.successCount++;
      if (this.state.successCount >= this.successThreshold) {
        this.state.state = 'CLOSED';
      }
    }
  }
  
  // Record failed execution
  onFailure(): void {
    this.state.failures++;
    this.state.lastFailureTime = Date.now();
    
    if (this.state.failures >= this.failureThreshold) {
      this.state.state = 'OPEN';
    }
    
    logger.warn(`Circuit breaker failure recorded for ${this.tierName}`, {
      failures: this.state.failures,
      state: this.state.state
    });
  }
  
  // Get current state
  getState(): CircuitBreakerState {
    return { ...this.state };
  }
}

// Rate Limiter
class RateLimiter {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    });
  }
  
  // Check if request is within rate limit
  async isAllowed(userId: string, requestType: string): Promise<boolean> {
    const key = `rate_limit:${userId}:${requestType}`;
    const window = 60; // 1 minute window
    const limit = this.getLimit(requestType);
    
    try {
      const current = await this.redis.incr(key);
      
      if (current === 1) {
        await this.redis.expire(key, window);
      }
      
      return current <= limit;
      
    } catch (error) {
      logger.warn('Rate limiter error', error);
      return true; // Allow on error
    }
  }
  
  // Get rate limit for request type
  private getLimit(requestType: string): number {
    const limits = {
      reflection: 30,        // 30 per minute
      crisis_assessment: 10, // 10 per minute  
      insight_generation: 20,// 20 per minute
      pattern_analysis: 5    // 5 per minute
    };
    
    return limits[requestType as keyof typeof limits] || 10;
  }
  
  // Get remaining requests
  async getRemaining(userId: string, requestType: string): Promise<number> {
    const key = `rate_limit:${userId}:${requestType}`;
    const limit = this.getLimit(requestType);
    
    try {
      const current = await this.redis.get(key);
      return Math.max(0, limit - (parseInt(current || '0')));
    } catch (error) {
      return limit;
    }
  }
}

// AI Tier Manager
class AITierManager {
  private circuitBreakers: Map<string, CircuitBreaker>;
  private cache: AICache;
  private rateLimiter: RateLimiter;
  
  constructor() {
    this.circuitBreakers = new Map();
    this.cache = new AICache();
    this.rateLimiter = new RateLimiter();
    
    // Initialize circuit breakers for each tier
    Object.keys(AI_TIERS).forEach(tier => {
      this.circuitBreakers.set(tier, new CircuitBreaker(tier));
    });
  }
  
  // Execute AI request with resilience
  async execute(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    // Check rate limiting
    const rateLimitAllowed = await this.rateLimiter.isAllowed(
      request.userId, 
      request.requestType
    );
    
    if (!rateLimitAllowed) {
      throw new Error('Rate limit exceeded');
    }
    
    // Try cache first
    const cached = await this.cache.get(request);
    if (cached) {
      return cached;
    }
    
    // Try tiers in order of preference
    const tiers = ['primary', 'fallback', 'emergency'];
    let lastError: Error | null = null;
    
    for (const tierName of tiers) {
      const tier = AI_TIERS[tierName];
      const circuitBreaker = this.circuitBreakers.get(tierName)!;
      
      if (!circuitBreaker.canExecute()) {
        logger.warn(`Circuit breaker OPEN for ${tierName}, skipping`);
        continue;
      }
      
      try {
        const response = await this.executeWithTier(request, tierName, tier);
        
        // Record success
        circuitBreaker.onSuccess();
        
        // Cache successful response
        await this.cache.set(request, response);
        
        // Record metrics
        await this.recordMetrics(tierName, Date.now() - startTime, true);
        
        return response;
        
      } catch (error) {
        lastError = error as Error;
        circuitBreaker.onFailure();
        
        // Record failure metrics
        await this.recordMetrics(tierName, Date.now() - startTime, false);
        
        logger.warn(`AI tier ${tierName} failed`, error);
        
        // Continue to next tier
        continue;
      }
    }
    
    // All tiers failed - return emergency response
    logger.error('All AI tiers failed, generating emergency response', lastError);
    return this.generateEmergencyResponse(request);
  }
  
  // Execute request with specific tier
  private async executeWithTier(
    request: AIRequest, 
    tierName: string, 
    tier: AITier
  ): Promise<AIResponse> {
    const startTime = Date.now();
    
    if (tierName === 'emergency') {
      return this.generateEmergencyResponse(request);
    }
    
    // Build trauma-informed prompt
    const prompt = this.buildTraumaInformedPrompt(request);
    
    // Execute with appropriate model
    let modelResponse: any;
    
    if (tierName === 'primary') {
      modelResponse = await Promise.race([
        gemini15Flash.generate({
          prompt,
          config: {
            maxOutputTokens: tier.maxTokens,
            temperature: tier.temperature
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), tier.timeout)
        )
      ]);
    } else if (tierName === 'fallback') {
      modelResponse = await Promise.race([
        gemini15Pro.generate({
          prompt,
          config: {
            maxOutputTokens: tier.maxTokens,
            temperature: tier.temperature
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), tier.timeout)
        )
      ]);
    }
    
    const insight = modelResponse.text();
    
    if (!insight || insight.length < 20) {
      throw new Error('Insufficient AI response');
    }
    
    // Analyze response quality
    const quality = this.analyzeResponseQuality(insight, request);
    
    return {
      insight,
      confidence: tier.qualityScore,
      tier: tierName,
      processingTime: Date.now() - startTime,
      cached: false,
      fallbackUsed: tierName !== 'primary',
      quality
    };
  }
  
  // Build trauma-informed prompt
  private buildTraumaInformedPrompt(request: AIRequest): string {
    const basePrompts = {
      reflection: `You are a compassionate AI companion trained in trauma-informed care. 
        Provide a gentle, validating reflection on this journal entry. 
        Keep your response under 50 words but make it feel personally meaningful.`,
      crisis_assessment: `You are a mental health AI trained in crisis intervention.
        Assess this text for signs of distress while maintaining a supportive tone.
        Focus on immediate coping strategies and resources.`,
      insight_generation: `You are a wise AI guide helping someone understand their patterns.
        Generate a helpful insight that validates their experience and offers gentle guidance.`,
      pattern_analysis: `You are an AI analyst specializing in emotional patterns.
        Identify meaningful patterns in this text that could help the person grow.`
    };
    
    const basePrompt = basePrompts[request.requestType];
    const userContext = request.context.userProfile;
    
    let contextualPrompt = basePrompt;
    
    if (userContext?.communicationStyle) {
      contextualPrompt += `\n\nCommunication style: ${userContext.communicationStyle}`;
    }
    
    if (userContext?.preferredTone) {
      contextualPrompt += `\n\nPreferred tone: ${userContext.preferredTone}`;
    }
    
    contextualPrompt += `\n\nJournal entry: "${request.text}"`;
    
    if (request.context.previousEntries && request.context.previousEntries.length > 0) {
      contextualPrompt += `\n\nRecent context: ${request.context.previousEntries.slice(-2).join(' ')}`;
    }
    
    return contextualPrompt;
  }
  
  // Analyze response quality
  private analyzeResponseQuality(insight: string, request: AIRequest): any {
    const lowerInsight = insight.toLowerCase();
    
    return {
      traumaInformed: this.isTraumaInformed(lowerInsight),
      personalized: this.isPersonalized(lowerInsight, request),
      actionable: this.isActionable(lowerInsight),
      empathetic: this.isEmpathetic(lowerInsight)
    };
  }
  
  // Check if response is trauma-informed
  private isTraumaInformed(insight: string): boolean {
    const traumaInformedWords = [
      'valid', 'understand', 'safe', 'strength', 'brave', 'survivor',
      'gentle', 'compassion', 'support', 'care', 'healing'
    ];
    
    return traumaInformedWords.some(word => insight.includes(word));
  }
  
  // Check if response is personalized
  private isPersonalized(insight: string, request: AIRequest): boolean {
    // Simple check - could be enhanced with NLP
    return insight.length > 30 && !insight.includes('generic');
  }
  
  // Check if response is actionable
  private isActionable(insight: string): boolean {
    const actionWords = [
      'try', 'consider', 'practice', 'explore', 'reach out',
      'take', 'notice', 'reflect', 'breathe', 'step'
    ];
    
    return actionWords.some(word => insight.includes(word));
  }
  
  // Check if response is empathetic
  private isEmpathetic(insight: string): boolean {
    const empathyWords = [
      'feel', 'understand', 'hear', 'acknowledge', 'recognize',
      'appreciate', 'honor', 'validate', 'support'
    ];
    
    return empathyWords.some(word => insight.includes(word));
  }
  
  // Generate emergency response when all AI fails
  private generateEmergencyResponse(request: AIRequest): AIResponse {
    const emergencyResponses = {
      reflection: `I hear you sharing your thoughts, and I want you to know that taking time to reflect shows strength and self-awareness.`,
      crisis_assessment: `Thank you for reaching out. If you're in immediate danger, please call 988 or 911. Your feelings are valid and support is available.`,
      insight_generation: `Your willingness to explore your inner world shows courage. Every small step of self-awareness is meaningful progress.`,
      pattern_analysis: `I notice you're taking time to understand yourself better. This self-reflection is an important part of growth and healing.`
    };
    
    return {
      insight: emergencyResponses[request.requestType],
      confidence: 0.75,
      tier: 'emergency',
      processingTime: 0,
      cached: false,
      fallbackUsed: true,
      quality: {
        traumaInformed: true,
        personalized: false,
        actionable: false,
        empathetic: true
      }
    };
  }
  
  // Record performance metrics
  private async recordMetrics(
    tierName: string, 
    processingTime: number, 
    success: boolean
  ): Promise<void> {
    try {
      const metricsKey = `ai_metrics:${tierName}`;
      const pipeline = this.cache['redis'].pipeline();
      
      pipeline.lpush(`${metricsKey}:processing_times`, processingTime);
      pipeline.ltrim(`${metricsKey}:processing_times`, 0, 999); // Keep last 1000
      
      if (success) {
        pipeline.incr(`${metricsKey}:successes`);
      } else {
        pipeline.incr(`${metricsKey}:failures`);
      }
      
      pipeline.incr(`${metricsKey}:total_requests`);
      
      await pipeline.exec();
      
    } catch (error) {
      logger.warn('Error recording AI metrics', error);
    }
  }
  
  // Get tier performance metrics
  async getTierMetrics(tierName: string): Promise<any> {
    try {
      const metricsKey = `ai_metrics:${tierName}`;
      const redis = this.cache['redis'];
      
      const [
        processingTimes,
        successes,
        failures,
        totalRequests
      ] = await Promise.all([
        redis.lrange(`${metricsKey}:processing_times`, 0, 99),
        redis.get(`${metricsKey}:successes`) || '0',
        redis.get(`${metricsKey}:failures`) || '0',
        redis.get(`${metricsKey}:total_requests`) || '0'
      ]);
      
      const times = processingTimes.map(t => parseInt(t));
      const averageTime = times.length > 0 
        ? times.reduce((sum, t) => sum + t, 0) / times.length 
        : 0;
      
      const successRate = parseInt(totalRequests) > 0 
        ? parseInt(successes) / parseInt(totalRequests)
        : 0;
      
      return {
        tierName,
        averageProcessingTime: averageTime,
        successRate,
        totalRequests: parseInt(totalRequests),
        circuitBreakerState: this.circuitBreakers.get(tierName)?.getState()
      };
      
    } catch (error) {
      logger.warn('Error getting tier metrics', error);
      return null;
    }
  }
  
  // Get overall AI system health
  async getSystemHealth(): Promise<any> {
    const tiers = ['primary', 'fallback', 'emergency'];
    const tierMetrics = await Promise.all(
      tiers.map(tier => this.getTierMetrics(tier))
    );
    
    const cacheStats = await this.cache.getStats();
    
    return {
      tiers: tierMetrics.filter(m => m !== null),
      cache: cacheStats,
      overallHealth: this.calculateOverallHealth(tierMetrics),
      timestamp: Date.now()
    };
  }
  
  // Calculate overall system health score
  private calculateOverallHealth(tierMetrics: any[]): number {
    const validMetrics = tierMetrics.filter(m => m !== null);
    
    if (validMetrics.length === 0) return 0;
    
    const averageSuccessRate = validMetrics.reduce((sum, m) => sum + m.successRate, 0) / validMetrics.length;
    const primaryHealth = validMetrics.find(m => m.tierName === 'primary')?.successRate || 0;
    
    // Weight primary tier health more heavily
    return (primaryHealth * 0.6) + (averageSuccessRate * 0.4);
  }
}

// Resilient AI Flow - Main entry point
export const resilientAIInsight = defineFlow(
  {
    name: 'resilient-ai-insight',
    inputSchema: AIRequestSchema,
    outputSchema: AIResponseSchema
  },
  async (input: AIRequest): Promise<AIResponse> => {
    const tierManager = new AITierManager();
    
    try {
      return await tierManager.execute(input);
    } catch (error) {
      logger.error('Resilient AI flow failed', error);
      
      // Last resort emergency response
      const tierManager = new AITierManager();
      return tierManager['generateEmergencyResponse'](input);
    }
  }
);

// Export for monitoring and management
export { AITierManager, CircuitBreaker, AICache, RateLimiter };