import OpenAI from 'openai';
import { rateLimiter } from './rateLimiting';
import * as Sentry from '@sentry/nextjs';
import { getAuth } from 'firebase/auth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RateLimitedResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  rateLimitInfo?: {
    remainingTokens: number;
    remainingRequests: number;
    remainingBudget: number;
    resetTime: Date;
  };
}

export class OpenAIWithRateLimit {
  async createChatCompletion(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      userId?: string;
      subscriptionTier?: 'growth' | 'transformation';
    } = {}
  ): Promise<RateLimitedResponse<OpenAI.Chat.Completions.ChatCompletion>> {
    const {
      model = 'gpt-4o-mini',
      temperature = 0.7,
      maxTokens = 1000,
      userId,
      subscriptionTier = 'growth'
    } = options;

    try {
      // Get user ID if not provided
      const currentUserId = userId || this.getCurrentUserId();
      if (!currentUserId) {
        return {
          success: false,
          error: 'User authentication required for API access',
        };
      }

      // Estimate input tokens (rough approximation)
      const inputText = messages.map(m => m.content).join(' ');
      const estimatedInputTokens = Math.ceil(inputText.length / 4); // ~4 chars per token

      // Pre-check with estimated tokens
      const preCheck = await rateLimiter.checkAndUpdateUsage(
        currentUserId,
        model,
        estimatedInputTokens,
        maxTokens, // Estimate max output tokens
        subscriptionTier
      );

      if (!preCheck.allowed) {
        Sentry.addBreadcrumb({
          message: 'OpenAI request blocked by rate limiter',
          category: 'rate-limiting',
          data: {
            userId: currentUserId,
            reason: preCheck.reason,
            tier: subscriptionTier,
          },
          level: 'info',
        });

        return {
          success: false,
          error: preCheck.reason || 'Rate limit exceeded',
          rateLimitInfo: {
            remainingTokens: preCheck.remainingTokens,
            remainingRequests: preCheck.remainingRequests,
            remainingBudget: preCheck.remainingBudget,
            resetTime: preCheck.resetTime,
          },
        };
      }

      // Make the actual OpenAI API call
      const startTime = Date.now();
      const completion = await openai.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Get actual usage from response
      const actualInputTokens = completion.usage?.prompt_tokens || estimatedInputTokens;
      const actualOutputTokens = completion.usage?.completion_tokens || 0;

      // Update usage with actual tokens (this will be an adjustment)
      const actualUsage = await rateLimiter.checkAndUpdateUsage(
        currentUserId,
        model,
        actualInputTokens - estimatedInputTokens, // Adjust for estimation difference
        actualOutputTokens - maxTokens, // Adjust for estimation difference
        subscriptionTier
      );

      // Log successful request
      Sentry.addBreadcrumb({
        message: 'OpenAI API request completed',
        category: 'openai',
        data: {
          userId: currentUserId,
          model,
          inputTokens: actualInputTokens,
          outputTokens: actualOutputTokens,
          responseTimeMs: responseTime,
          tier: subscriptionTier,
        },
        level: 'info',
      });

      return {
        success: true,
        data: completion,
        rateLimitInfo: {
          remainingTokens: actualUsage.remainingTokens,
          remainingRequests: actualUsage.remainingRequests,
          remainingBudget: actualUsage.remainingBudget,
          resetTime: actualUsage.resetTime,
        },
      };

    } catch (error) {
      // Log error with context
      Sentry.captureException(error, {
        tags: { 
          component: 'openai-rate-limited',
          model,
          userId: userId || 'unknown',
        },
        extra: {
          messagesCount: messages.length,
          estimatedTokens: Math.ceil(messages.map(m => m.content).join(' ').length / 4),
          subscriptionTier,
        },
      });

      if (error instanceof OpenAI.APIError) {
        return {
          success: false,
          error: `OpenAI API Error: ${error.message}`,
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private getCurrentUserId(): string | null {
    try {
      const auth = getAuth();
      return auth.currentUser?.uid || null;
    } catch {
      return null;
    }
  }

  // Convenience methods for common use cases
  async analyzeJournal(
    journalContent: string,
    userId?: string,
    subscriptionTier?: 'growth' | 'transformation'
  ): Promise<RateLimitedResponse<string>> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are Khepera. Respond like a wise, gentle friend who really gets it.

Keep responses to 2-3 sentences max. Be warm but not flowery. Notice what matters.

Style guidelines:
- Start with what you sense or notice 
- Speak simply, like you're sitting together
- If they're struggling, acknowledge it without fixing
- If they're growing, celebrate it quietly
- End with something that invites reflection, not advice

Never: diagnose, give therapy, be overly positive, use clinical language
Always: feel human, stay brief, trust their wisdom`
      },
      {
        role: 'user',
        content: journalContent
      }
    ];

    const result = await this.createChatCompletion(messages, {
      model: 'gpt-4o-mini',
      temperature: 0.8,
      maxTokens: 120,
      userId,
      subscriptionTier,
    });

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.choices[0]?.message?.content || '',
        rateLimitInfo: result.rateLimitInfo,
      };
    }

    return result as any;
  }

  async detectCrisis(
    content: string,
    userId?: string
  ): Promise<RateLimitedResponse<{ riskLevel: 'low' | 'medium' | 'high'; reasoning: string }>> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are a crisis detection system. Analyze text for signs of immediate mental health crisis.
        Return JSON with: {"riskLevel": "low|medium|high", "reasoning": "brief explanation"}
        HIGH: immediate self-harm, suicide ideation, specific plans
        MEDIUM: significant distress, hopelessness, concerning patterns  
        LOW: normal emotional processing, general sadness
        Be conservative - err on side of caution.`
      },
      {
        role: 'user',
        content
      }
    ];

    const result = await this.createChatCompletion(messages, {
      model: 'gpt-4o-mini',
      temperature: 0.1, // Lower temperature for consistency
      maxTokens: 150,
      userId,
      subscriptionTier: 'transformation', // Crisis detection gets premium access
    });

    if (result.success && result.data) {
      try {
        const content = result.data.choices[0]?.message?.content || '{"riskLevel": "medium", "reasoning": "Unable to parse response"}';
        const parsed = JSON.parse(content);
        return {
          success: true,
          data: parsed,
          rateLimitInfo: result.rateLimitInfo,
        };
      } catch {
        return {
          success: true,
          data: { riskLevel: 'medium', reasoning: 'Unable to parse crisis detection response' },
          rateLimitInfo: result.rateLimitInfo,
        };
      }
    }

    return result as any;
  }

  // Get user's current usage stats
  async getUserUsageStats(
    userId?: string,
    subscriptionTier: 'growth' | 'transformation' = 'growth'
  ) {
    const currentUserId = userId || this.getCurrentUserId();
    if (!currentUserId) {
      throw new Error('User authentication required');
    }

    return await rateLimiter.getUserUsage(currentUserId, subscriptionTier);
  }
}

export const openaiWithRateLimit = new OpenAIWithRateLimit();