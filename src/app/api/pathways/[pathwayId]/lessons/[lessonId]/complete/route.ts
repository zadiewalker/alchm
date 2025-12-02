import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin } from '@/lib/firebaseAdmin';
import { getPathway, getLesson, getNextLesson } from '@/lib/pathways';
import { PathwayGamificationService } from '@/lib/gamification/pathway-integration';

// Initialize Firebase Admin
initializeFirebaseAdmin();

export async function POST(
  req: NextRequest,
  { params }: { params: { pathwayId: string; lessonId: string } }
) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
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

    const userId = decodedToken.uid;
    const { pathwayId, lessonId } = params;
    
    // Parse request body
    const body = await req.json();
    const { 
      timeSpentMinutes, 
      practicesCompleted = [], 
      journalEntryId,
      notes 
    } = body;

    if (!timeSpentMinutes || typeof timeSpentMinutes !== 'number') {
      return NextResponse.json(
        { error: 'timeSpentMinutes is required' },
        { status: 400 }
      );
    }

    // Get pathway and lesson
    const pathway = getPathway(pathwayId);
    if (!pathway) {
      return NextResponse.json(
        { error: 'Pathway not found' },
        { status: 404 }
      );
    }

    const lesson = getLesson(pathwayId, lessonId);
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    // Validate minimum time requirement
    if (timeSpentMinutes < lesson.minimumTimeMinutes) {
      return NextResponse.json(
        { 
          error: 'Please take more time with this lesson',
          minimumRequired: lesson.minimumTimeMinutes,
          timeSpent: timeSpentMinutes
        },
        { status: 400 }
      );
    }

    const db = getFirestore();

    // Check if lesson is already completed
    const progressDoc = await db
      .collection('users')
      .doc(userId)
      .collection('pathwayProgress')
      .doc(pathwayId)
      .get();

    const existingProgress = progressDoc.exists() ? progressDoc.data() : {};
    const lessonCompletions = existingProgress.lessonCompletions || {};
    
    if (lessonCompletions[lessonId]) {
      return NextResponse.json(
        { error: 'Lesson already completed' },
        { status: 400 }
      );
    }

    // Record lesson completion
    const completionData = {
      completedAt: new Date(),
      timeSpentMinutes,
      practicesCompleted,
      journalEntryId,
      notes
    };

    // Calculate if pathway is complete
    const newCompletedCount = (existingProgress.completedLessons || 0) + 1;
    const pathwayComplete = newCompletedCount >= pathway.lessons.length;

    // Update progress document
    const progressUpdate = {
      currentLessonOrder: lesson.order + 1,
      completedLessons: newCompletedCount,
      xpEarned: FieldValue.increment(lesson.xpReward),
      lastActivityAt: new Date(),
      status: pathwayComplete ? 'completed' : 'in-progress',
      [`lessonCompletions.${lessonId}`]: completionData
    };

    // Set start date if this is the first lesson
    if (!existingProgress.startedAt) {
      progressUpdate.startedAt = new Date();
    }

    // Set completion date if pathway is finished
    if (pathwayComplete) {
      progressUpdate.completedAt = new Date();
    }

    await db
      .collection('users')
      .doc(userId)
      .collection('pathwayProgress')
      .doc(pathwayId)
      .set(progressUpdate, { merge: true });
    
    // Process through trauma-informed gamification system
    let gamificationResult;
    try {
      // Get user preferences and grace state for gamification processing
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.exists() ? userDoc.data() : {};
      const userPreferences = userData.preferences || { celebrationStyle: 'gentle' };
      const currentGraceState = userData.graceTokens || { tokens: 2 };

      // Process lesson completion through pathway gamification service
      gamificationResult = PathwayGamificationService.processLessonCompletion(
        {
          pathwayId,
          lessonId,
          lessonOrder: lesson.order,
          timeSpentMinutes,
          practicesCompleted,
          journalEntryId,
          notes
        },
        userPreferences,
        currentGraceState
      );

      // Update main gamification system with trauma-informed approach
      const gamificationUpdate = {
        'gamification.xp': FieldValue.increment(gamificationResult.xpAwarded),
        'gamification.lastXPEarned': new Date(),
        'gamification.presenceMetrics': gamificationResult.presenceMetrics,
        'gamification.lastPathwayCompletion': {
          pathwayId,
          lessonId,
          completedAt: new Date(),
          wisdomMoment: gamificationResult.wisdomMoment
        }
      };

      // Add grace tokens if earned
      if (gamificationResult.graceTokensEarned) {
        gamificationUpdate['graceTokens.tokens'] = FieldValue.increment(gamificationResult.graceTokensEarned);
      }

      // Update archetype evolution
      if (gamificationResult.archetypeEvolution.length > 0) {
        gamificationResult.archetypeEvolution.forEach(evolution => {
          gamificationUpdate[`gamification.archetypes.${evolution.archetypeId}.growth`] = 
            FieldValue.increment(evolution.growthAmount);
          gamificationUpdate[`gamification.archetypes.${evolution.archetypeId}.lastInsights`] = 
            evolution.newInsights;
        });
      }

      // Save badge if unlocked
      if (gamificationResult.badgeUnlocked) {
        gamificationUpdate[`gamification.badges.${gamificationResult.badgeUnlocked.id}`] = {
          unlockedAt: new Date(),
          ...gamificationResult.badgeUnlocked
        };
      }

      await db.collection('users').doc(userId).update(gamificationUpdate);

    } catch (gamificationError) {
      console.warn('Failed to update pathway gamification:', gamificationError);
      // Don't fail the request for gamification errors - use fallback
      gamificationResult = {
        xpAwarded: lesson.xpReward,
        celebrationMessage: "You completed this lesson with courage. That's beautiful.",
        wisdomMoment: "Every step forward is sacred.",
        nextRecommendation: "Rest and integrate before continuing."
      };
    }

    // Get next lesson
    const nextLesson = pathwayComplete ? null : getNextLesson(pathwayId, lesson.order);

    return NextResponse.json({
      success: true,
      xpAwarded: gamificationResult.xpAwarded,
      completionAffirmation: lesson.completionAffirmation,
      pathwayComplete,
      recommendBreak: lesson.recommendedBreakAfter,
      
      // Enhanced trauma-informed gamification data
      celebrationMessage: gamificationResult.celebrationMessage,
      wisdomMoment: gamificationResult.wisdomMoment,
      nextRecommendation: gamificationResult.nextRecommendation,
      presenceMetrics: gamificationResult.presenceMetrics,
      archetypeEvolution: gamificationResult.archetypeEvolution,
      badgeUnlocked: gamificationResult.badgeUnlocked,
      graceTokensEarned: gamificationResult.graceTokensEarned,
      
      nextLesson: nextLesson ? {
        id: nextLesson.id,
        order: nextLesson.order,
        title: nextLesson.title,
        subtitle: nextLesson.subtitle,
        stage: nextLesson.stage,
        minimumTimeMinutes: nextLesson.minimumTimeMinutes
      } : null,
      
      newProgress: {
        completedLessons: newCompletedCount,
        totalLessons: pathway.lessons.length,
        percentComplete: Math.round((newCompletedCount / pathway.lessons.length) * 100),
        xpEarned: (existingProgress.xpEarned || 0) + gamificationResult.xpAwarded
      }
    });

  } catch (error) {
    console.error('Lesson completion API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}