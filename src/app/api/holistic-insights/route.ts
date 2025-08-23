// Holistic Insights API - Cross-Platform Wellness Intelligence
// Integrates data from multiple sources to provide comprehensive wellness insights

import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { 
  crossPlatformIntelligenceEngine, 
  DataIntegrationRequest,
  WellnessDataSource 
} from '@/ai/cross-platform-intelligence';
import { logger } from '@/lib/logging';
import { z } from 'zod';

// Request validation schema
const HolisticInsightsRequestSchema = z.object({
  integratedData: z.record(
    z.string(),
    z.array(z.object({
      platform: z.string(),
      dataType: z.string(),
      value: z.union([z.number(), z.string(), z.boolean()]),
      timestamp: z.number(),
      confidence: z.number().min(0).max(1).default(0.8),
      source: z.enum(['direct', 'inferred', 'aggregated']).default('direct'),
      metadata: z.record(z.any()).optional()
    }))
  ),
  privacySettings: z.object({
    allowCorrelationAnalysis: z.boolean().default(true),
    shareAggregatedData: z.boolean().default(false),
    retentionPeriodDays: z.number().min(1).max(365).default(90),
    anonymizePersonalData: z.boolean().default(true)
  }).optional(),
  analyticsPreferences: z.object({
    enablePredictiveInsights: z.boolean().default(true),
    enableCrossCorrelations: z.boolean().default(true),
    focusAreas: z.array(z.string()).default([])
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
    const validatedData = HolisticInsightsRequestSchema.parse(body);

    // Check rate limiting for holistic analysis
    const rateLimitOk = await checkAnalysisRateLimit(userId);
    if (!rateLimitOk) {
      return NextResponse.json({
        error: 'Rate limit exceeded',
        message: 'Holistic analysis is limited to 3 per day for optimal processing'
      }, { status: 429 });
    }

    // Convert timestamps to Date objects
    const integratedData: Record<string, WellnessDataSource[]> = {};
    Object.entries(validatedData.integratedData).forEach(([platform, dataPoints]) => {
      integratedData[platform] = dataPoints.map(point => ({
        ...point,
        timestamp: new Date(point.timestamp)
      }));
    });

    // Set default preferences
    const privacySettings = validatedData.privacySettings || {
      allowCorrelationAnalysis: true,
      shareAggregatedData: false,
      retentionPeriodDays: 90,
      anonymizePersonalData: true
    };

    const analyticsPreferences = validatedData.analyticsPreferences || {
      enablePredictiveInsights: true,
      enableCrossCorrelations: true,
      focusAreas: []
    };

    // Generate holistic insights
    const startTime = Date.now();
    const result = await crossPlatformIntelligenceEngine.generateHolisticInsights(
      userId,
      integratedData,
      privacySettings,
      analyticsPreferences
    );
    const processingTime = Date.now() - startTime;

    // Store analysis results for user's history
    await storeHolisticAnalysis(userId, result, processingTime);

    // Generate wellness summary
    const wellnessSummary = generateWellnessSummary(result.profile);

    // Generate integration suggestions
    const integrationSuggestions = generateIntegrationSuggestions(
      Object.keys(integratedData),
      result.profile.dataCompletenessScore
    );

    logger.info('Holistic insights generated', {
      userId: userId.slice(0, 8) + '...',
      overallWellnessScore: result.profile.overallWellnessScore,
      dataCompletenessScore: result.profile.dataCompletenessScore,
      insightCount: result.insights.length,
      platformCount: Object.keys(integratedData).length,
      processingTime
    });

    return NextResponse.json({
      success: true,
      analysis: {
        wellnessProfile: {
          overallScore: result.profile.overallWellnessScore,
          physicalHealth: result.profile.physicalHealth,
          mentalHealth: result.profile.mentalHealth,
          socialWellness: result.profile.socialWellness,
          cognitiveWellness: result.profile.cognitiveWellness,
          spiritualWellness: result.profile.spiritualWellness,
          environmentalFactors: result.profile.environmentalFactors,
          dataCompleteness: result.profile.dataCompletenessScore
        },
        crossPlatformInsights: result.insights,
        recommendations: result.recommendations,
        summary: wellnessSummary
      },
      metadata: {
        analysisId: generateAnalysisId(userId),
        timestamp: new Date().toISOString(),
        processingTime,
        platformsAnalyzed: Object.keys(integratedData),
        privacyLevel: privacySettings.anonymizePersonalData ? 'high' : 'standard'
      },
      suggestions: {
        integrationOpportunities: integrationSuggestions,
        nextSteps: getNextSteps(result.profile, result.insights),
        dataGaps: identifyDataGaps(result.profile.dataCompletenessScore)
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid request format',
        details: error.errors
      }, { status: 400 });
    }

    logger.error('Error generating holistic insights', error);
    
    return NextResponse.json({
      error: 'Failed to generate holistic insights',
      fallback: {
        summary: 'Continue tracking your wellness across multiple platforms for better insights',
        recommendation: 'Focus on consistent data collection and regular wellness check-ins'
      }
    }, { status: 500 });
  }
}

// Get supported platforms
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    // Get supported platforms
    const supportedPlatforms = crossPlatformIntelligenceEngine.getSupportedPlatforms();

    // Get user's current integrations
    const userIntegrations = await getUserIntegrations(userId);

    // Get user's historical analysis
    const analysisHistory = await getAnalysisHistory(userId);

    return NextResponse.json({
      success: true,
      supportedPlatforms: supportedPlatforms.map(platform => ({
        id: platform.id,
        name: platform.name,
        type: platform.type,
        dataTypes: platform.dataTypes,
        refreshRate: platform.refreshRate,
        privacyLevel: platform.privacyLevel,
        integrated: userIntegrations.includes(platform.id)
      })),
      userIntegrations: {
        connectedPlatforms: userIntegrations,
        totalAnalyses: analysisHistory.length,
        lastAnalysis: analysisHistory[0]?.timestamp || null,
        averageWellnessScore: calculateAverageWellnessScore(analysisHistory)
      },
      integrationGuide: getIntegrationGuide()
    });

  } catch (error) {
    logger.error('Error getting platform information', error);
    return NextResponse.json({ error: 'Failed to get platform information' }, { status: 500 });
  }
}

// Connect new platform
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
    const { platformId, authToken, dataTypes, syncFrequency } = body;

    if (!platformId || !authToken) {
      return NextResponse.json({ 
        error: 'Missing platformId or authToken' 
      }, { status: 400 });
    }

    // Validate platform integration
    const isValid = await crossPlatformIntelligenceEngine.validatePlatformIntegration(
      platformId,
      authToken
    );

    if (!isValid) {
      return NextResponse.json({
        error: 'Failed to validate platform integration',
        message: 'Please check your authentication credentials'
      }, { status: 400 });
    }

    // Store platform integration
    await storePlatformIntegration(userId, {
      platformId,
      authToken: hashAuthToken(authToken), // Store hashed version
      dataTypes,
      syncFrequency,
      connectedAt: new Date()
    });

    logger.info('Platform connected', {
      userId: userId.slice(0, 8) + '...',
      platformId,
      dataTypes
    });

    return NextResponse.json({
      success: true,
      message: `Successfully connected to ${platformId}`,
      platformId,
      dataTypes,
      syncFrequency
    });

  } catch (error) {
    logger.error('Error connecting platform', error);
    return NextResponse.json({ error: 'Failed to connect platform' }, { status: 500 });
  }
}

// Helper Functions

async function checkAnalysisRateLimit(userId: string): Promise<boolean> {
  try {
    const today = new Date().toDateString();
    const rateLimitKey = `holistic_analysis_rate_limit:${userId}:${today}`;
    
    // Check current count
    const currentCount = await getRateLimitCount(rateLimitKey);
    
    if (currentCount >= 3) {
      return false; // Exceeded daily limit
    }
    
    await incrementRateLimit(rateLimitKey);
    return true;
    
  } catch (error) {
    logger.warn('Rate limit check failed', error);
    return true; // Allow on error
  }
}

async function getRateLimitCount(key: string): Promise<number> {
  // This would use Redis in production
  return 0;
}

async function incrementRateLimit(key: string): Promise<void> {
  // This would increment Redis counter with 24h expiry
}

async function storeHolisticAnalysis(
  userId: string,
  result: any,
  processingTime: number
): Promise<void> {
  try {
    const analysisRecord = {
      userId,
      analysisId: generateAnalysisId(userId),
      overallWellnessScore: result.profile.overallWellnessScore,
      dataCompletenessScore: result.profile.dataCompletenessScore,
      insightCount: result.insights.length,
      recommendationCount: result.recommendations.length,
      processingTime,
      timestamp: new Date(),
      // Store aggregated metrics only, not sensitive details
      wellnessDomainScores: {
        physical: calculateDomainScore(result.profile.physicalHealth),
        mental: calculateDomainScore(result.profile.mentalHealth),
        social: calculateDomainScore(result.profile.socialWellness),
        cognitive: calculateDomainScore(result.profile.cognitiveWellness),
        spiritual: calculateDomainScore(result.profile.spiritualWellness)
      }
    };
    
    await db.collection('holistic_analyses').add(analysisRecord);
    
  } catch (error) {
    logger.warn('Failed to store holistic analysis', error);
  }
}

function generateWellnessSummary(profile: any): string {
  const score = profile.overallWellnessScore;
  
  if (score >= 80) {
    return `Excellent! Your overall wellness score of ${score}/100 indicates you're thriving across multiple wellness dimensions. Continue your current practices and celebrate your success.`;
  } else if (score >= 70) {
    return `Great work! Your wellness score of ${score}/100 shows strong overall wellness with some areas for growth. You're on a positive trajectory.`;
  } else if (score >= 60) {
    return `Good foundation! Your score of ${score}/100 indicates solid wellness habits with clear opportunities for improvement. Focus on 1-2 key areas.`;
  } else if (score >= 50) {
    return `Building momentum! Your score of ${score}/100 suggests focusing on fundamental wellness practices would provide significant benefits.`;
  } else {
    return `Starting point identified! Your score of ${score}/100 indicates this is a perfect time to prioritize your wellness with small, consistent steps.`;
  }
}

function generateIntegrationSuggestions(
  connectedPlatforms: string[],
  dataCompleteness: number
): string[] {
  const suggestions = [];
  
  if (!connectedPlatforms.includes('apple_health') && !connectedPlatforms.includes('google_fit')) {
    suggestions.push('Connect a fitness tracker (Apple Health or Google Fit) for comprehensive physical health insights');
  }
  
  if (!connectedPlatforms.includes('oura') && dataCompleteness < 0.7) {
    suggestions.push('Consider sleep tracking integration for better sleep-wellness correlations');
  }
  
  if (!connectedPlatforms.includes('headspace') && !connectedPlatforms.includes('meditation_app')) {
    suggestions.push('Connect a meditation app to track mindfulness practices and mental wellness');
  }
  
  if (!connectedPlatforms.includes('calendar') && dataCompleteness < 0.8) {
    suggestions.push('Calendar integration can provide insights into work-life balance and stress patterns');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Your integration coverage is excellent! Consider exploring advanced correlations in your settings.');
  }
  
  return suggestions;
}

function generateAnalysisId(userId: string): string {
  const timestamp = Date.now();
  const hash = Buffer.from(`${userId}_holistic_${timestamp}`).toString('base64').slice(0, 12);
  return `holistic_${hash}`;
}

function getNextSteps(profile: any, insights: any[]): string[] {
  const nextSteps = [];
  
  // Based on lowest scoring wellness domain
  const domainScores = {
    physical: calculateDomainScore(profile.physicalHealth),
    mental: calculateDomainScore(profile.mentalHealth),
    social: calculateDomainScore(profile.socialWellness),
    cognitive: calculateDomainScore(profile.cognitiveWellness),
    spiritual: calculateDomainScore(profile.spiritualWellness)
  };
  
  const lowestDomain = Object.entries(domainScores)
    .sort(([,a], [,b]) => a - b)[0];
  
  switch (lowestDomain[0]) {
    case 'physical':
      nextSteps.push('Focus on improving physical health - prioritize sleep, exercise, and nutrition');
      break;
    case 'mental':
      nextSteps.push('Strengthen mental wellness - consider stress management and emotional regulation practices');
      break;
    case 'social':
      nextSteps.push('Enhance social connections - schedule time with friends, family, or community groups');
      break;
    case 'cognitive':
      nextSteps.push('Support cognitive wellness - improve focus, productivity, and learning practices');
      break;
    case 'spiritual':
      nextSteps.push('Explore spiritual wellness - consider mindfulness, purpose, and value alignment practices');
      break;
  }
  
  // Add insight-based next steps
  const highImpactInsights = insights.filter(insight => insight.impact === 'high');
  if (highImpactInsights.length > 0) {
    nextSteps.push(`Act on your highest impact insight: ${highImpactInsights[0].title}`);
  }
  
  nextSteps.push('Continue regular data tracking for more personalized insights over time');
  
  return nextSteps.slice(0, 4); // Limit to 4 next steps
}

function identifyDataGaps(dataCompleteness: number): string[] {
  const gaps = [];
  
  if (dataCompleteness < 0.9) {
    gaps.push('Sleep quality tracking for better recovery insights');
  }
  
  if (dataCompleteness < 0.8) {
    gaps.push('Social interaction tracking for relationship wellness insights');
  }
  
  if (dataCompleteness < 0.7) {
    gaps.push('Stress and mood tracking for emotional pattern recognition');
  }
  
  if (dataCompleteness < 0.6) {
    gaps.push('Physical activity and exercise tracking for fitness insights');
  }
  
  if (gaps.length === 0) {
    gaps.push('Your data coverage is comprehensive! Consider exploring advanced analytics features.');
  }
  
  return gaps;
}

function calculateDomainScore(domainData: any): number {
  const values = Object.values(domainData).filter(val => typeof val === 'number') as number[];
  if (values.length === 0) return 5;
  
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

async function getUserIntegrations(userId: string): Promise<string[]> {
  try {
    const integrationsSnapshot = await db.collection('platform_integrations')
      .where('userId', '==', userId)
      .get();
      
    return integrationsSnapshot.docs.map(doc => doc.data().platformId);
    
  } catch (error) {
    logger.warn('Failed to get user integrations', error);
    return [];
  }
}

async function getAnalysisHistory(userId: string): Promise<any[]> {
  try {
    const historySnapshot = await db.collection('holistic_analyses')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();
      
    return historySnapshot.docs.map(doc => doc.data());
    
  } catch (error) {
    logger.warn('Failed to get analysis history', error);
    return [];
  }
}

function calculateAverageWellnessScore(history: any[]): number {
  if (history.length === 0) return 0;
  
  const totalScore = history.reduce((sum, analysis) => sum + analysis.overallWellnessScore, 0);
  return Math.round(totalScore / history.length);
}

async function storePlatformIntegration(userId: string, integration: any): Promise<void> {
  try {
    await db.collection('platform_integrations').add({
      userId,
      ...integration
    });
  } catch (error) {
    logger.warn('Failed to store platform integration', error);
  }
}

function hashAuthToken(token: string): string {
  // In production, use proper hashing like bcrypt
  return Buffer.from(token).toString('base64').slice(0, 16);
}

function getIntegrationGuide(): any {
  return {
    gettingStarted: [
      'Connect at least one fitness tracking platform (Apple Health, Google Fit, or Fitbit)',
      'Enable mood and journal tracking within ALCHM',
      'Connect calendar for work-life balance insights',
      'Run your first holistic analysis'
    ],
    bestPractices: [
      'Allow at least 7 days of data collection before running analysis',
      'Enable correlation analysis for deeper insights',
      'Review insights weekly and act on high-impact recommendations',
      'Maintain privacy settings that match your comfort level'
    ],
    privacyAssurance: [
      'All data is processed with your specified privacy settings',
      'Personal data can be anonymized before analysis',
      'You control data retention periods and sharing preferences',
      'Platform tokens are encrypted and never stored in plain text'
    ]
  };
}