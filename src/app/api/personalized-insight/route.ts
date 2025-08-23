// Personalized Insight API - Main entry point for trauma-informed AI
// Provides personalized, context-aware insights that build user trust

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { traumaInformedEngine, PersonalizedInsightRequest } from '@/ai/trauma-informed-engine';
import { logger } from '@/lib/logging';
import { z } from 'zod';

// Request validation schema
const PersonalizedInsightRequestSchema = z.object({
  text: z.string().min(1).max(10000),
  entryId: z.string(),
  context: z.object({
    timeZone: z.string().default('UTC'),
    deviceType: z.enum(['mobile', 'desktop', 'tablet']).optional(),
    sessionLength: z.number().optional()
  }),
  preferences: z.object({
    communicationStyle: z.string().optional(),
    culturalContext: z.string().optional(),
    supportLevel: z.enum(['minimal', 'moderate', 'comprehensive']).default('moderate'),
    privacyLevel: z.enum(['standard', 'enhanced', 'maximum']).default('standard')
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    // Parse and validate request
    const body = await request.json();
    const validatedData = PersonalizedInsightRequestSchema.parse(body);

    // Build complete request object
    const insightRequest: PersonalizedInsightRequest = {
      text: validatedData.text,
      userId,
      entryId: validatedData.entryId,
      context: {
        timestamp: Date.now(),
        timeZone: validatedData.context.timeZone,
        deviceType: validatedData.context.deviceType,
        sessionLength: validatedData.context.sessionLength,
        previousEntryCount: await getPreviousEntryCount(userId)
      },
      preferences: validatedData.preferences || {
        supportLevel: 'moderate',
        privacyLevel: 'standard'
      }
    };

    // Generate personalized insight
    const startTime = Date.now();
    const response = await traumaInformedEngine.generatePersonalizedInsight(insightRequest);
    const processingTime = Date.now() - startTime;

    // Store response for learning (non-sensitive metadata only)
    await storeResponseMetadata(userId, validatedData.entryId, response, processingTime);

    // Log successful generation
    logger.info('Personalized insight generated', {
      userId: userId.slice(0, 8) + '...',
      entryId: validatedData.entryId,
      processingTime,
      personalizationLevel: response.personalizationLevel,
      responseType: response.responseType,
      qualityScore: calculateQualityScore(response.qualityMetrics)
    });

    // Return response with additional metadata
    return NextResponse.json({
      success: true,
      insight: response.insight,
      encouragement: response.encouragement,
      gentleAction: response.gentleAction,
      resources: response.resources,
      metadata: {
        confidenceScore: response.confidenceScore,
        personalizationLevel: response.personalizationLevel,
        responseType: response.responseType,
        processingTime,
        triggerRisk: response.triggerRisk,
        qualityMetrics: response.qualityMetrics
      },
      responseId: generateResponseId(userId, validatedData.entryId),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid request format',
        details: error.errors
      }, { status: 400 });
    }

    logger.error('Error generating personalized insight', error);
    
    return NextResponse.json({
      error: 'Failed to generate insight',
      fallback: {
        insight: 'Thank you for sharing your thoughts. Your willingness to reflect shows courage and self-awareness.',
        encouragement: 'Every step toward understanding yourself better is meaningful.',
        responseType: 'validation'
      }
    }, { status: 500 });
  }
}

// Feedback endpoint for learning
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    const body = await request.json();
    const { responseId, feedback } = body;

    if (!responseId || !feedback) {
      return NextResponse.json({ error: 'Missing responseId or feedback' }, { status: 400 });
    }

    if (!['helpful', 'not_helpful', 'triggering', 'perfect'].includes(feedback)) {
      return NextResponse.json({ error: 'Invalid feedback value' }, { status: 400 });
    }

    // Record feedback for learning
    await traumaInformedEngine.recordFeedback(userId, responseId, feedback);

    logger.info('User feedback recorded', {
      userId: userId.slice(0, 8) + '...',
      responseId,
      feedback
    });

    return NextResponse.json({ success: true, message: 'Feedback recorded' });

  } catch (error) {
    logger.error('Error recording feedback', error);
    return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
  }
}

// Get user personalization analytics
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    // Get personalization analytics
    const analytics = await traumaInformedEngine.getPersonalizationAnalytics(userId);

    return NextResponse.json({
      success: true,
      analytics: {
        ...analytics,
        improvementSuggestions: generateImprovementSuggestions(analytics)
      }
    });

  } catch (error) {
    logger.error('Error getting personalization analytics', error);
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 });
  }
}

// Helper Functions

async function getPreviousEntryCount(userId: string): Promise<number> {
  try {
    // This would typically query the user's entry collection
    // For now, return a default value
    return 0;
  } catch (error) {
    return 0;
  }
}

async function storeResponseMetadata(
  userId: string, 
  entryId: string, 
  response: any, 
  processingTime: number
): Promise<void> {
  try {
    const { db } = await import('@/lib/firebaseAdmin');
    
    // Store only non-sensitive metadata for analytics and learning
    await db.collection('response_analytics').add({
      userId,
      entryId,
      responseId: generateResponseId(userId, entryId),
      personalizationLevel: response.personalizationLevel,
      responseType: response.responseType,
      triggerRisk: response.triggerRisk,
      qualityMetrics: response.qualityMetrics,
      processingTime,
      timestamp: new Date(),
      // Do NOT store the actual insight content
    });
  } catch (error) {
    logger.warn('Failed to store response metadata', error);
  }
}

function generateResponseId(userId: string, entryId: string): string {
  const timestamp = Date.now();
  const hash = Buffer.from(`${userId}_${entryId}_${timestamp}`).toString('base64').slice(0, 12);
  return `resp_${hash}`;
}

function calculateQualityScore(metrics: any): number {
  const weights = {
    traumaInformed: 0.25,
    personalized: 0.20,
    actionable: 0.15,
    empathetic: 0.20,
    culturallySensitive: 0.10,
    strengthsBased: 0.10
  };

  let score = 0;
  for (const [metric, weight] of Object.entries(weights)) {
    if (metrics[metric]) {
      score += weight;
    }
  }

  return Math.round(score * 100);
}

function generateImprovementSuggestions(analytics: any): string[] {
  const suggestions = [];

  if (!analytics.hasPattern) {
    suggestions.push('Continue journaling to help me learn your preferred communication style');
  }

  if (analytics.personalizationLevel < 0.5) {
    suggestions.push('Share more about your preferences in your profile to get more tailored insights');
  }

  if (analytics.strengthsLanguageCount === 0) {
    suggestions.push('Let me know which strength-based words resonate with you most');
  }

  if (analytics.triggerSensitivityCount > 0) {
    suggestions.push('Thank you for letting me know what language to avoid - this helps me support you better');
  }

  if (suggestions.length === 0) {
    suggestions.push('Your personalization is working well! Keep sharing to maintain this connection');
  }

  return suggestions;
}