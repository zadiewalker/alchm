// API route for IKIGAI assessment processing
import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { processIkigaiAssessment, IkigaiAssessmentInput } from '@/ai/flows/ikigai-discovery';
import { logger } from '@/lib/logging';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    // Parse request body
    const body = await request.json();
    const { sessionId, currentStep, responses } = body;

    // Validate input
    if (!sessionId || !currentStep || !responses) {
      return NextResponse.json({ 
        error: 'Session ID, current step, and responses are required' 
      }, { status: 400 });
    }

    // Get previous IKIGAI sessions
    const previousSessionsSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('ikigai_sessions')
      .where('sessionId', '!=', sessionId)
      .orderBy('sessionId')
      .orderBy('completedAt', 'desc')
      .get();

    const previousSessions = previousSessionsSnapshot.docs.map(doc => ({
      sessionId: doc.data().sessionId,
      step: doc.data().step,
      responses: doc.data().responses,
      completedAt: doc.data().completedAt
    }));

    // Get recent journal entries for context
    const journalEntriesSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('entries')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    const journalEntries = journalEntriesSnapshot.docs
      .map(doc => doc.data().text)
      .filter(text => text && text.length > 50);

    // Prepare input for IKIGAI assessment
    const assessmentInput = IkigaiAssessmentInput.parse({
      userId,
      sessionId,
      currentStep,
      responses,
      journalEntries,
      previousSessions,
      timestamp: Date.now()
    });

    // Process IKIGAI assessment
    const result = await processIkigaiAssessment(assessmentInput);

    // Store the session data
    const sessionData = {
      userId,
      sessionId,
      step: currentStep,
      responses,
      results: result.stepResults,
      purposeStatement: result.purposeStatement,
      progressPercentage: result.progressPercentage,
      completedAt: new Date(),
      timestamp: new Date()
    };

    await db
      .collection('users')
      .doc(userId)
      .collection('ikigai_sessions')
      .doc(`${sessionId}_step_${currentStep}`)
      .set(sessionData);

    // Store insights if generated
    if (result.insights.length > 0) {
      await db
        .collection('users')
        .doc(userId)
        .collection('ikigai_insights')
        .add({
          sessionId,
          step: currentStep,
          insights: result.insights,
          purposeStatement: result.purposeStatement,
          careerSuggestions: result.careerSuggestions,
          timestamp: new Date()
        });
    }

    // Update user's IKIGAI progress
    await db
      .collection('users')
      .doc(userId)
      .update({
        'ikigaiProgress.currentStep': currentStep,
        'ikigaiProgress.progressPercentage': result.progressPercentage,
        'ikigaiProgress.lastUpdated': new Date(),
        'ikigaiProgress.completionBadges': result.completionBadges
      });

    // If assessment is complete, update user profile
    if (result.progressPercentage === 100 && result.purposeStatement) {
      await db
        .collection('users')
        .doc(userId)
        .update({
          'profile.purposeStatement': result.purposeStatement,
          'profile.ikigaiCompleted': true,
          'profile.ikigaiCompletedAt': new Date()
        });
    }

    // Log analytics
    logger.info('IKIGAI assessment processed', {
      userId,
      sessionId,
      step: currentStep,
      progressPercentage: result.progressPercentage,
      insightCount: result.insights.length,
      stepComplete: result.stepComplete
    }, {
      component: 'ikigai_assessment',
      action: 'step_completed'
    });

    return NextResponse.json(result);

  } catch (error) {
    logger.error('Error in IKIGAI assessment processing', error, {
      endpoint: '/api/ikigai-assessment',
      method: 'POST'
    });

    return NextResponse.json(
      { error: 'Failed to process IKIGAI assessment' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve IKIGAI progress
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    // Get user's IKIGAI progress
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const ikigaiProgress = userData?.ikigaiProgress || {
      currentStep: 1,
      progressPercentage: 0,
      completionBadges: []
    };

    // Get all IKIGAI sessions
    const sessionsSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('ikigai_sessions')
      .orderBy('completedAt', 'desc')
      .get();

    const sessions = sessionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      completedAt: doc.data().completedAt?.toDate()?.toISOString()
    }));

    // Get latest insights
    const insightsSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('ikigai_insights')
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();

    const insights = insightsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()?.toISOString()
    }));

    return NextResponse.json({
      progress: ikigaiProgress,
      sessions,
      insights,
      purposeStatement: userData?.profile?.purposeStatement
    });

  } catch (error) {
    logger.error('Error fetching IKIGAI progress', error, {
      endpoint: '/api/ikigai-assessment',
      method: 'GET'
    });

    return NextResponse.json(
      { error: 'Failed to fetch IKIGAI progress' },
      { status: 500 }
    );
  }
}