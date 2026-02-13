import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import * as Sentry from '@sentry/nextjs';

interface UserUsage {
  userId: string;
  date: string; // YYYY-MM-DD format
  tokenCount: number;
  requestCount: number;
  costUSD: number;
  lastRequest: any; // Firestore timestamp
  subscriptionTier: 'growth' | 'transformation';
}

interface RateLimitConfig {
  growth: {
    dailyTokenLimit: number;
    dailyRequestLimit: number;
    dailyCostLimitUSD: number;
  };
  transformation: {
    dailyTokenLimit: number;
    dailyRequestLimit: number;
    dailyCostLimitUSD: number;
  };
}

// Rate limiting configuration
const RATE_LIMITS: RateLimitConfig = {
  growth: {
    dailyTokenLimit: 10000,      // 10K tokens/day (~$0.10-0.60/day)
    dailyRequestLimit: 20,        // 20 requests/day
    dailyCostLimitUSD: 1.00,     // $1/day maximum
  },
  transformation: {
    dailyTokenLimit: 50000,      // 50K tokens/day (~$0.50-3.00/day)
    dailyRequestLimit: 100,       // 100 requests/day
    dailyCostLimitUSD: 5.00,     // $5/day maximum
  },
};

// Token cost calculation (approximate)
const TOKEN_COSTS = {
  'gpt-4o-mini': {
    input: 0.00015 / 1000,   // $0.15 per 1M tokens
    output: 0.0006 / 1000,   // $0.60 per 1M tokens
  },
  'gpt-4o': {
    input: 0.0025 / 1000,    // $2.50 per 1M tokens
    output: 0.01 / 1000,     // $10 per 1M tokens
  },
};

export class RateLimiter {
  private getDb() {
    if (typeof window === 'undefined') {
      throw new Error('Rate limiter is only available in the browser');
    }
    return getFirestore();
  }

  async checkAndUpdateUsage(
    userId: string,
    model: string,
    inputTokens: number,
    outputTokens: number,
    subscriptionTier: 'growth' | 'transformation' = 'growth'
  ): Promise<{
    allowed: boolean;
    remainingTokens: number;
    remainingRequests: number;
    remainingBudget: number;
    resetTime: Date;
    reason?: string;
  }> {
    try {
      const db = this.getDb();
      const today = new Date().toISOString().split('T')[0];
      const usageRef = doc(db, 'userUsage', `${userId}_${today}`);
      
      // Get current usage
      const usageDoc = await getDoc(usageRef);
      const currentUsage: UserUsage = usageDoc.exists() 
        ? usageDoc.data() as UserUsage
        : {
            userId,
            date: today,
            tokenCount: 0,
            requestCount: 0,
            costUSD: 0,
            lastRequest: serverTimestamp(),
            subscriptionTier,
          };

      // Calculate cost for this request
      const modelCosts = TOKEN_COSTS[model as keyof typeof TOKEN_COSTS] || TOKEN_COSTS['gpt-4o-mini'];
      const requestCost = (inputTokens * modelCosts.input) + (outputTokens * modelCosts.output);
      const totalTokens = inputTokens + outputTokens;

      // Get limits for user's subscription tier
      const limits = RATE_LIMITS[subscriptionTier];

      // Check limits
      const newTokenCount = currentUsage.tokenCount + totalTokens;
      const newRequestCount = currentUsage.requestCount + 1;
      const newCostUSD = currentUsage.costUSD + requestCost;

      // Calculate remaining resources
      const remainingTokens = Math.max(0, limits.dailyTokenLimit - currentUsage.tokenCount);
      const remainingRequests = Math.max(0, limits.dailyRequestLimit - currentUsage.requestCount);
      const remainingBudget = Math.max(0, limits.dailyCostLimitUSD - currentUsage.costUSD);

      // Reset time (midnight UTC)
      const resetTime = new Date();
      resetTime.setUTCDate(resetTime.getUTCDate() + 1);
      resetTime.setUTCHours(0, 0, 0, 0);

      // Check if request would exceed limits
      if (newTokenCount > limits.dailyTokenLimit) {
        return {
          allowed: false,
          remainingTokens,
          remainingRequests,
          remainingBudget,
          resetTime,
          reason: `Daily token limit exceeded. Limit: ${limits.dailyTokenLimit}, Would use: ${newTokenCount}`,
        };
      }

      if (newRequestCount > limits.dailyRequestLimit) {
        return {
          allowed: false,
          remainingTokens,
          remainingRequests,
          remainingBudget,
          resetTime,
          reason: `Daily request limit exceeded. Limit: ${limits.dailyRequestLimit}`,
        };
      }

      if (newCostUSD > limits.dailyCostLimitUSD) {
        return {
          allowed: false,
          remainingTokens,
          remainingRequests,
          remainingBudget,
          resetTime,
          reason: `Daily cost limit exceeded. Limit: $${limits.dailyCostLimitUSD}, Would cost: $${newCostUSD.toFixed(4)}`,
        };
      }

      // Update usage
      if (usageDoc.exists()) {
        await updateDoc(usageRef, {
          tokenCount: increment(totalTokens),
          requestCount: increment(1),
          costUSD: increment(requestCost),
          lastRequest: serverTimestamp(),
          subscriptionTier, // Update tier in case it changed
        });
      } else {
        await setDoc(usageRef, {
          ...currentUsage,
          tokenCount: totalTokens,
          requestCount: 1,
          costUSD: requestCost,
          lastRequest: serverTimestamp(),
        });
      }

      // Log usage for monitoring
      Sentry.addBreadcrumb({
        message: 'OpenAI API usage recorded',
        category: 'rate-limiting',
        data: {
          userId,
          model,
          inputTokens,
          outputTokens,
          cost: requestCost,
          tier: subscriptionTier,
        },
        level: 'info',
      });

      return {
        allowed: true,
        remainingTokens: limits.dailyTokenLimit - newTokenCount,
        remainingRequests: limits.dailyRequestLimit - newRequestCount,
        remainingBudget: limits.dailyCostLimitUSD - newCostUSD,
        resetTime,
      };

    } catch (error) {
      Sentry.captureException(error, {
        tags: { component: 'rate-limiter' },
        extra: { userId, model, inputTokens, outputTokens },
      });

      // Fail closed - deny request on error
      return {
        allowed: false,
        remainingTokens: 0,
        remainingRequests: 0,
        remainingBudget: 0,
        resetTime: new Date(),
        reason: 'Rate limiting service error',
      };
    }
  }

  async getUserUsage(userId: string, subscriptionTier: 'growth' | 'transformation' = 'growth'): Promise<{
    usage: UserUsage;
    limits: typeof RATE_LIMITS.growth;
    percentUsed: {
      tokens: number;
      requests: number;
      cost: number;
    };
  }> {
    try {
      const db = this.getDb();
      const today = new Date().toISOString().split('T')[0];
      const usageRef = doc(db, 'userUsage', `${userId}_${today}`);
      const usageDoc = await getDoc(usageRef);

      const usage: UserUsage = usageDoc.exists() 
        ? usageDoc.data() as UserUsage
        : {
            userId,
            date: today,
            tokenCount: 0,
            requestCount: 0,
            costUSD: 0,
            lastRequest: null,
            subscriptionTier,
          };

      const limits = RATE_LIMITS[subscriptionTier];

      return {
        usage,
        limits,
        percentUsed: {
          tokens: (usage.tokenCount / limits.dailyTokenLimit) * 100,
          requests: (usage.requestCount / limits.dailyRequestLimit) * 100,
          cost: (usage.costUSD / limits.dailyCostLimitUSD) * 100,
        },
      };
    } catch (error) {
      Sentry.captureException(error, {
        tags: { component: 'rate-limiter-usage' },
        extra: { userId },
      });
      throw error;
    }
  }

  // Admin function to get system-wide usage
  async getSystemUsage(startDate: string, endDate: string): Promise<{
    totalCost: number;
    totalTokens: number;
    totalRequests: number;
    userCount: number;
    averageCostPerUser: number;
  }> {
    // This would need to be implemented as a Firebase Function
    // for security and performance reasons
    throw new Error('System usage must be retrieved via Firebase Functions');
  }
}

export const rateLimiter = new RateLimiter();
