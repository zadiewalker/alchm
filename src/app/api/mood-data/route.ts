// API route for mood tracking data
import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { logger } from '@/lib/logging';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'week';
    const requestedUserId = searchParams.get('userId');

    // Verify user can only access their own data
    if (requestedUserId && requestedUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Fetch journal entries with mood data
    const entriesSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('entries')
      .where('timestamp', '>=', startDate)
      .orderBy('timestamp', 'desc')
      .get();

    // Fetch corresponding insights
    const insightsSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('insights')
      .where('timestamp', '>=', startDate)
      .orderBy('timestamp', 'desc')
      .get();

    // Create a map of insights by entryId
    const insightsMap = new Map();
    insightsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.entryId) {
        insightsMap.set(data.entryId, data);
      }
    });

    // Process mood entries
    const moodEntries = entriesSnapshot.docs.map(doc => {
      const entryData = doc.data();
      const insight = insightsMap.get(doc.id);
      
      return {
        id: doc.id,
        date: entryData.timestamp instanceof Date 
          ? entryData.timestamp.toISOString().split('T')[0]
          : new Date(entryData.timestamp?.seconds * 1000 || entryData.createdAt).toISOString().split('T')[0],
        beforeMood: entryData.beforeMood || 5,
        afterMood: insight?.moodPrediction || entryData.afterMood,
        emotionalTags: insight?.emotionalTags || entryData.emotionalTags || [],
        celebrationTriggered: insight?.celebrationTriggered || entryData.celebrationTriggered || false,
        timestamp: entryData.timestamp?.seconds * 1000 || entryData.createdAt || Date.now()
      };
    }).filter(entry => entry.beforeMood); // Only include entries with mood data

    // Calculate aggregate statistics
    const stats = calculateMoodStats(moodEntries);

    // Log analytics
    logger.info('Mood data fetched', {
      userId,
      range,
      entryCount: moodEntries.length,
      averageImprovement: stats.averageImprovement
    }, {
      component: 'mood_tracker',
      action: 'data_fetched'
    });

    return NextResponse.json({
      entries: moodEntries,
      stats,
      range
    });

  } catch (error) {
    logger.error('Error fetching mood data', error, {
      endpoint: '/api/mood-data',
      method: 'GET'
    });

    return NextResponse.json(
      { error: 'Failed to fetch mood data' },
      { status: 500 }
    );
  }
}

function calculateMoodStats(entries: any[]) {
  if (entries.length === 0) {
    return {
      totalEntries: 0,
      averageImprovement: 0,
      celebrationCount: 0,
      currentStreak: 0,
      bestMoodDay: null,
      commonEmotions: []
    };
  }

  // Calculate average mood improvement
  const improvements = entries
    .filter(entry => entry.afterMood && entry.beforeMood)
    .map(entry => entry.afterMood - entry.beforeMood);
  
  const averageImprovement = improvements.length > 0
    ? improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length
    : 0;

  // Count celebrations
  const celebrationCount = entries.filter(entry => entry.celebrationTriggered).length;

  // Calculate current streak
  let currentStreak = 0;
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.afterMood && entry.beforeMood && entry.afterMood > entry.beforeMood) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Find best mood day
  const bestMoodDay = entries.reduce((best: any, entry) => {
    const mood = entry.afterMood || entry.beforeMood;
    if (!best || mood > best.mood) {
      return { date: entry.date, mood };
    }
    return best;
  }, null);

  // Calculate common emotions
  const emotionCounts: Record<string, number> = {};
  entries.forEach(entry => {
    if (entry.emotionalTags) {
      entry.emotionalTags.forEach((tag: string) => {
        emotionCounts[tag] = (emotionCounts[tag] || 0) + 1;
      });
    }
  });

  const commonEmotions = Object.entries(emotionCounts)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalEntries: entries.length,
    averageImprovement: Math.round(averageImprovement * 10) / 10,
    celebrationCount,
    currentStreak,
    bestMoodDay,
    commonEmotions
  };
}