// Enhanced Khepera AI endpoint with optimized Gemini integration and comprehensive error handling
import { NextRequest } from 'next/server';
import { enhancedGeminiService } from '@/lib/enhancedAI';
import { createAIHandler, createApiError, ApiErrorCode } from '@/lib/apiWrapper';
import { RequestContext } from '@/lib/apiUtils';
import { checkAIRateLimit } from '@/lib/ai';

// Input validation schema for Khepera AI requests
const KHEPERA_VALIDATION = {
  body: {
    prompt: { required: true, type: 'string', minLength: 10, maxLength: 5000 },
    includeRiskAssessment: { required: false, type: 'boolean' },
    includeResourceRecommendations: { required: false, type: 'boolean' },
    culturalContext: { required: false, type: 'string', maxLength: 100 },
    userHistory: { required: false, type: 'object' } // Array of previous entries
  }
};

async function kheperapAIHandler(req: NextRequest, context: RequestContext) {
  const userId = context.userId!; // Guaranteed by authenticated handler
  
  try {
    // Parse and validate input
    const body = await req.json();
    
    // Rate limiting check specific to AI operations
    if (!checkAIRateLimit('analysis', userId)) {
      throw createApiError(
        ApiErrorCode.RATE_LIMITED,
        'AI analysis rate limit exceeded',
        { userId, operation: 'analysis' },
        'You are making AI requests too quickly. Please wait a moment before trying again.',
        context.requestId
      );
    }

    // Validate prompt content for safety
    const sanitizedPrompt = sanitizePrompt(body.prompt);
    
    if (!sanitizedPrompt || sanitizedPrompt.trim().length < 10) {
      throw createApiError(
        ApiErrorCode.VALIDATION_ERROR,
        'Prompt too short or invalid',
        { originalLength: body.prompt?.length, sanitizedLength: sanitizedPrompt?.length },
        'Please provide a meaningful prompt for Khepera to respond to.',
        context.requestId
      );
    }

    // Check if Gemini service is configured
    if (!enhancedGeminiService.isConfigured()) {
      console.error('[Khepera API] Gemini service not configured');
      throw createApiError(
        ApiErrorCode.SERVICE_UNAVAILABLE,
        'AI service not configured',
        undefined,
        'Khepera is temporarily unavailable. Please try again later.',
        context.requestId
      );
    }

    // Call enhanced Gemini service
    const response = await enhancedGeminiService.analyzeJournalEntry(
      sanitizedPrompt,
      context.requestId,
      {
        includeRiskAssessment: body.includeRiskAssessment || true,
        includeResourceRecommendations: body.includeResourceRecommendations || true,
        culturalContext: body.culturalContext,
        userHistory: Array.isArray(body.userHistory) ? body.userHistory.slice(-5) : []
      }
    );

    // Structure response for Khepera
    const kheperapResponse = {
      message: response.content,
      confidence: response.confidence,
      processingTime: response.processingTime,
      metadata: {
        requestId: response.metadata.requestId,
        timestamp: response.metadata.timestamp,
        model: response.model,
        cached: response.metadata.cached,
        riskLevel: response.metadata.riskAssessment?.level,
        emotionalContext: response.metadata.emotionalContext,
        recommendations: response.metadata.recommendations,
        badgeSuggestion: undefined as any // Will be populated below if applicable
      },
      tokenUsage: response.tokenUsage
    };

    // Add badge suggestion based on emotional transformation detection
    if (response.metadata.emotionalContext) {
      const badge = generateBadgeSuggestion(response.metadata.emotionalContext, response.content);
      if (badge) {
        kheperapResponse.metadata.badgeSuggestion = badge;
      }
    }

    // Log AI interaction for monitoring
    console.log('[Khepera API] AI response generated:', {
      requestId: context.requestId,
      userId,
      confidence: response.confidence,
      processingTime: response.processingTime,
      riskLevel: response.metadata.riskAssessment?.level,
      cached: response.metadata.cached
    });

    return {
      success: true,
      data: kheperapResponse
    };

  } catch (error: any) {
    console.error('[Khepera API] AI processing failed:', error);
    
    // Handle specific AI service errors
    if (error.code === 'QUOTA_EXCEEDED') {
      throw createApiError(
        ApiErrorCode.SERVICE_UNAVAILABLE,
        'AI service quota exceeded',
        error,
        'Khepera is currently at capacity. Please try again in a few minutes.',
        context.requestId
      );
    }

    if (error.code === 'CONTENT_FILTERED') {
      throw createApiError(
        ApiErrorCode.BAD_REQUEST,
        'Content filtered by AI safety systems',
        error,
        'Your message was filtered for safety. Please rephrase and try again.',
        context.requestId
      );
    }

    if (error.code?.includes('timeout')) {
      throw createApiError(
        ApiErrorCode.TIMEOUT,
        'AI processing timeout',
        error,
        'Khepera is taking longer than expected. Please try again.',
        context.requestId
      );
    }

    // Return fallback response for any other errors
    const fallbackResponse = generateFallbackResponse(context.requestId);
    
    return {
      success: true,
      data: fallbackResponse,
      warning: 'Using fallback response due to AI service error'
    };
  }
}

// Helper function to sanitize prompt input
function sanitizePrompt(prompt: string): string {
  if (typeof prompt !== 'string') return '';
  
  return prompt
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove potential script injections
    .substring(0, 5000); // Enforce max length
}

// Helper function to generate badge suggestions
function generateBadgeSuggestion(emotionalContext: any, response: string): string | null {
  const badges = [
    { trigger: ['resilience', 'strength', 'overcome'], badge: 'Still Here' },
    { trigger: ['growth', 'learning', 'insight'], badge: 'Truth Seeker' },
    { trigger: ['healing', 'progress', 'better'], badge: 'Turning the Page' },
    { trigger: ['authentic', 'honest', 'real'], badge: 'Truth Teller' },
    { trigger: ['hope', 'future', 'possibility'], badge: 'Light Keeper' },
    { trigger: ['support', 'community', 'connection'], badge: 'Bridge Builder' }
  ];

  const lowerResponse = response.toLowerCase();
  
  for (const badgeOption of badges) {
    if (badgeOption.trigger.some(trigger => lowerResponse.includes(trigger))) {
      return badgeOption.badge;
    }
  }

  // Default badge based on emotional valence
  if (emotionalContext?.valence === 'positive') {
    return 'Light Keeper';
  } else if (emotionalContext?.intensity > 0.7) {
    return 'Still Here';
  }

  return null;
}

// Helper function to generate fallback response
function generateFallbackResponse(requestId: string) {
  const fallbackMessages = [
    "I hear you, and I want you to know that your feelings are valid. Even when I can't find the perfect words, know that you're not alone in this.",
    "Sometimes the most powerful thing is just acknowledging where we are. You took the time to share, and that takes courage.",
    "Your words matter, even when the response isn't what we hoped for. Keep writing, keep processing, keep being authentic to your experience.",
    "In this moment of technical difficulty, the real truth remains: you are worthy of support, understanding, and care.",
    "While I navigate some challenges on my end, please know that your voice and your experience are important and valued."
  ];

  const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];

  return {
    message: randomMessage,
    confidence: 0.5,
    processingTime: 100,
    metadata: {
      requestId,
      timestamp: new Date().toISOString(),
      model: 'fallback',
      cached: false,
      isFallback: true
    },
    tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
  };
}

// Export enhanced AI handler
export const POST = createAIHandler(kheperapAIHandler, {
  validation: KHEPERA_VALIDATION,
  monitoring: {
    logLevel: 'info',
    performanceTracking: true,
    includeRequestBody: false, // Don't log sensitive journal content
    includeResponseBody: false
  },
  security: {
    maxRequestSize: 20 * 1024, // 20KB limit for AI requests
    csrfProtection: true
  },
  timeout: 30000 // 30 second timeout for AI processing
});
