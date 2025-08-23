// API route for emotional alchemy processing
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { db } from '@/lib/firebaseAdmin';
import { processEmotionalAlchemy, EmotionalAlchemyInput } from '@/ai/flows/emotional-alchemy';
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
    const { text, beforeMood, entryId } = body;

    // Validate input
    if (!text || text.trim().length < 10) {
      return NextResponse.json({ 
        error: 'Journal entry must be at least 10 characters' 
      }, { status: 400 });
    }

    // Get recent entries for context
    const recentEntriesSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('entries')
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();

    const previousEntries = recentEntriesSnapshot.docs
      .map(doc => doc.data().text)
      .filter(entry => entry !== text);

    // Prepare input for emotional alchemy
    const alchemyInput = EmotionalAlchemyInput.parse({
      text: text.trim(),
      userId,
      beforeMood,
      previousEntries,
      timestamp: Date.now()
    });

    // Process emotional alchemy
    const result = await processEmotionalAlchemy(alchemyInput);

    // Store the insight in Firestore
    const insightData = {
      entryId,
      userId,
      reflection: result.reflection,
      suggestedActions: result.suggestedActions,
      moodPrediction: result.moodPrediction,
      confidenceScore: result.confidenceScore,
      emotionalTags: result.emotionalTags,
      celebrationTriggered: result.celebrationTriggered,
      insights: result.insights,
      timestamp: new Date(),
      processed: true
    };

    await db
      .collection('users')
      .doc(userId)
      .collection('insights')
      .add(insightData);

    // Update entry with mood prediction if celebration triggered
    if (result.celebrationTriggered && entryId) {
      await db
        .collection('users')
        .doc(userId)
        .collection('entries')
        .doc(entryId)
        .update({
          afterMood: result.moodPrediction,
          celebrationTriggered: true,
          processed: true
        });
    }

    // Log analytics
    logger.info('Emotional alchemy processed', {
      userId,
      emotionalTags: result.emotionalTags,
      moodImprovement: result.moodPrediction - (beforeMood || 5),
      celebrationTriggered: result.celebrationTriggered,
      confidenceScore: result.confidenceScore
    }, {
      component: 'emotional_alchemy',
      action: 'processed'
    });

    return NextResponse.json(result);

  } catch (error) {
    logger.error('Error in emotional alchemy processing', error, {
      endpoint: '/api/emotional-alchemy',
      method: 'POST'
    });

    return NextResponse.json(
      { error: 'Failed to process emotional alchemy' },
      { status: 500 }
    );
  }
}