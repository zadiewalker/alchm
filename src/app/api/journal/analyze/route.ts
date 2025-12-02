import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin } from '@/lib/firebaseAdmin';
import { analyzeJournalEntry } from '@/lib/ai/analyze-entry';
import type { EntryAnalysis } from '@/lib/ai/analyze-entry';

// Initialize Firebase Admin
initializeFirebaseAdmin();

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const idToken = authHeader.replace('Bearer ', '');
    const auth = getAuth();
    
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (authError) {
      console.error('Token verification failed:', authError);
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { content, entryId, generateAll = false } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Entry content is required' },
        { status: 400 }
      );
    }

    if (content.length > 10000) {
      return NextResponse.json(
        { error: 'Entry content too long (max 10,000 characters)' },
        { status: 400 }
      );
    }

    const userId = decodedToken.uid;
    const db = getFirestore();

    // Check user subscription tier for multi-response access
    let userDoc;
    try {
      userDoc = await db.collection('users').doc(userId).get();
    } catch (firestoreError) {
      console.error('Failed to fetch user doc:', firestoreError);
      return NextResponse.json(
        { error: 'Failed to verify user permissions' },
        { status: 500 }
      );
    }

    const userData = userDoc.data();
    const isSubscribed = userData?.subscription?.status === 'active' || 
                        userData?.tier === 'premium' ||
                        userData?.tier === 'oracle';
    
    // Free users only get primary response unless explicitly overridden
    const shouldGenerateAll = generateAll && isSubscribed;

    // Perform AI analysis
    let analysisResult;
    try {
      analysisResult = await analyzeJournalEntry(content, shouldGenerateAll);
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      return NextResponse.json(
        { error: 'Analysis temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Handle crisis situations immediately
    if (analysisResult.crisis?.detected) {
      // Log crisis detection for monitoring
      console.warn('Crisis detected for user:', userId);
      
      // Save minimal crisis record to Firestore
      try {
        await db.collection('crisis_logs').add({
          userId,
          timestamp: new Date(),
          urgencyLevel: analysisResult.analysis.urgencyLevel,
          autoResources: true
        });
      } catch (logError) {
        console.error('Failed to log crisis detection:', logError);
        // Don't fail the request for logging errors
      }

      return NextResponse.json({
        crisis: analysisResult.crisis,
        analysis: {
          urgencyLevel: analysisResult.analysis.urgencyLevel,
          emotionalTone: analysisResult.analysis.emotionalTone
        }
      });
    }

    // Prepare response data
    const responseData = {
      analysis: analysisResult.analysis,
      responses: analysisResult.responses,
      metadata: {
        timestamp: new Date().toISOString(),
        aiModel: 'claude-3-sonnet',
        responseCount: analysisResult.responses.length,
        tier: shouldGenerateAll ? 'premium' : 'free'
      }
    };

    // Save analysis to Firestore if entryId provided
    if (entryId) {
      try {
        await db.collection('journal_analyses').doc(entryId).set({
          userId,
          entryId,
          ...responseData,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Update entry document with analysis reference
        await db.collection('entries').doc(entryId).update({
          hasAnalysis: true,
          primaryPillar: analysisResult.analysis.primaryPillar,
          urgencyLevel: analysisResult.analysis.urgencyLevel,
          lastAnalyzed: new Date()
        });
      } catch (saveError) {
        console.error('Failed to save analysis:', saveError);
        // Continue with response even if save fails
      }
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Journal analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const idToken = authHeader.replace('Bearer ', '');
    const auth = getAuth();
    
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (authError) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('entryId');

    if (!entryId) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    const userId = decodedToken.uid;
    const db = getFirestore();

    // Fetch existing analysis
    try {
      const analysisDoc = await db.collection('journal_analyses').doc(entryId).get();
      
      if (!analysisDoc.exists) {
        return NextResponse.json(
          { error: 'Analysis not found' },
          { status: 404 }
        );
      }

      const analysisData = analysisDoc.data();
      
      // Verify user owns this analysis
      if (analysisData?.userId !== userId) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      return NextResponse.json(analysisData);

    } catch (fetchError) {
      console.error('Failed to fetch analysis:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch analysis' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Get analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}