export const dynamic = 'force-static';
export const revalidate = false;

import { NextRequest, NextResponse } from 'next/server';
import { analyzeJournalEntry } from '../../../lib/aiService';
import { adminDb } from '../../../lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { journalContent, journalEntryId, userToken } = await request.json();

    // Validate required fields
    if (!journalContent || !journalEntryId || !userToken) {
      return NextResponse.json(
        { error: 'Missing required fields: journalContent, journalEntryId, userToken' },
        { status: 400 }
      );
    }

    // Verify user authentication
    // In a real implementation, you'd verify the token
    // For now, we'll extract userId from the token (simplified)
    const userId = userToken; // In production, decode and verify JWT

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('OpenAI API key not configured - returning mock analysis');
      return NextResponse.json({
        analysis: {
          emotionalRecognition: "Thank you for sharing your thoughts and feelings with such honesty.",
          strengthIdentification: "It takes courage to explore your inner world through journaling.",
          gentleInsight: "Your willingness to reflect shows a commitment to your own growth and healing.",
          nurturingSuggestion: "Take a moment to acknowledge yourself for this act of self-care and expression."
        },
        emotionalThemes: {
          primaryEmotions: ['reflective', 'brave'],
          emotionalJourney: 'Taking time for self-reflection',
          copingStrategies: ['journaling'],
          growthIndicators: ['self-awareness', 'emotional expression'],
          supportiveNote: 'You are creating a safe space for your feelings'
        },
        wisdomReflection: "In sharing your thoughts, you demonstrate a deep understanding that healing happens when we give voice to our experiences. Your commitment to this practice is a testament to your inner wisdom.",
        crisisAssessment: {
          isCrisis: false,
          confidenceLevel: 'low',
          reasoning: 'Demo mode - AI analysis not configured',
          suggestedResources: null
        },
        isDemo: true
      });
    }

    // Perform AI analysis
    console.log('Analyzing journal entry for user:', userId);
    const analysis = await analyzeJournalEntry(journalContent, userId, journalEntryId);

    // Handle crisis detection
    if (analysis.crisisAssessment.isCrisis) {
      console.log('🚨 CRISIS DETECTED for user:', userId, '- Confidence:', analysis.crisisAssessment.confidenceLevel);
      
      // Enhanced crisis response
      try {
        // Store crisis event for tracking and follow-up
        const crisisEvent = {
          userId,
          journalEntryId,
          detectedAt: new Date(),
          confidenceLevel: analysis.crisisAssessment.confidenceLevel,
          reasoning: analysis.crisisAssessment.reasoning,
          resolved: false
        };
        
        await adminDb.collection('crisis-events').add(crisisEvent);
        console.log('✓ Crisis event logged for follow-up');
        
        // In production, you would also:
        // 1. Send secure alert to crisis response team
        // 2. Provide immediate response resources
        // 3. Enable emergency contact notification (with prior consent)
        // 4. Escalate to human crisis counselor if available
        
      } catch (error) {
        console.error('❌ Failed to log crisis event:', error);
      }
    }

    // Save analysis metadata to Firestore using Admin SDK
    try {
      const entryRef = adminDb.collection('journal-entries').doc(journalEntryId);
      await entryRef.update({
        aiAnalysis: {
          id: analysis.id,
          analyzedAt: analysis.metadata.analyzedAt,
          hasAnalysis: true
        }
      });
      console.log('✓ Successfully saved AI analysis metadata to Firestore');
    } catch (dbError) {
      console.error('Failed to update journal entry with analysis metadata:', dbError);
      // Continue anyway - analysis can still be returned to user
    }

    // Return analysis to client
    return NextResponse.json({
      analysis: analysis.analysis,
      emotionalThemes: analysis.emotionalThemes,
      wisdomReflection: analysis.wisdomReflection,
      crisisAssessment: analysis.crisisAssessment,
      metadata: analysis.metadata,
      isDemo: false
    });

  } catch (error) {
    console.error('Journal analysis error:', error);

    // Return supportive error message
    return NextResponse.json(
      {
        error: 'Unable to analyze journal entry at this time',
        fallbackMessage: 'Your thoughts and feelings are valid, and we appreciate you taking time to reflect. Please try again later, or reach out for support if you need it.',
        supportResources: [
          'Crisis Support: 988',
          'Text HOME to 741741 for Crisis Text Line',
          'Emergency: 911'
        ]
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'ALCHM Journal Analysis API',
    status: 'healthy',
    version: '1.0.0',
    capabilities: [
      'Trauma-informed analysis',
      'Crisis detection',
      'Emotional theme identification',
      'Wisdom reflection',
      'Privacy-preserving processing'
    ]
  });
}