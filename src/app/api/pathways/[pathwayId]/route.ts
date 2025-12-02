import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin } from '@/lib/firebaseAdmin';
import { getPathway, getNextLesson, calculatePathwayProgress } from '@/lib/pathways';

// Initialize Firebase Admin
initializeFirebaseAdmin();

export async function GET(
  request: NextRequest,
  { params }: { params: { pathwayId: string } }
) {
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

    const { pathwayId } = params;
    const userId = decodedToken.uid;

    // Get pathway definition
    const pathway = getPathway(pathwayId);
    if (!pathway) {
      return NextResponse.json(
        { error: 'Pathway not found' },
        { status: 404 }
      );
    }

    const db = getFirestore();

    // Get user's progress for this pathway
    const progressDoc = await db
      .collection('users')
      .doc(userId)
      .collection('pathwayProgress')
      .doc(pathwayId)
      .get();

    let progress = null;
    if (progressDoc.exists()) {
      const data = progressDoc.data();
      progress = {
        status: data?.status || 'not-started',
        currentLessonOrder: data?.currentLessonOrder || 1,
        completedLessons: data?.completedLessons || 0,
        percentComplete: calculatePathwayProgress(
          data?.completedLessons || 0, 
          pathway.lessons.length
        ),
        xpEarned: data?.xpEarned || 0,
        startedAt: data?.startedAt,
        lastActivityAt: data?.lastActivityAt,
        completedAt: data?.completedAt,
        lessonCompletions: data?.lessonCompletions || {}
      };
    } else {
      progress = {
        status: 'not-started',
        currentLessonOrder: 1,
        completedLessons: 0,
        percentComplete: 0,
        xpEarned: 0,
        lessonCompletions: {}
      };
    }

    // Check if user meets prerequisites
    if (pathway.prerequisitePathways?.length) {
      const prerequisiteChecks = await Promise.all(
        pathway.prerequisitePathways.map(async (prereqId) => {
          const prereqDoc = await db
            .collection('users')
            .doc(userId)
            .collection('pathwayProgress')
            .doc(prereqId)
            .get();
          
          return prereqDoc.exists() && prereqDoc.data()?.status === 'completed';
        })
      );
      
      if (!prerequisiteChecks.every(Boolean)) {
        return NextResponse.json(
          { 
            error: 'Prerequisites not met',
            missingPrerequisites: pathway.prerequisitePathways
          },
          { status: 403 }
        );
      }
    }

    // Check entry count requirement
    if (pathway.minimumEntries) {
      const entriesSnapshot = await db
        .collection('entries')
        .where('userId', '==', userId)
        .count()
        .get();
      
      const entryCount = entriesSnapshot.data().count;
      
      if (entryCount < pathway.minimumEntries) {
        return NextResponse.json(
          { 
            error: 'Minimum entry requirement not met',
            requiredEntries: pathway.minimumEntries,
            currentEntries: entryCount
          },
          { status: 403 }
        );
      }
    }

    // Get next lesson suggestion
    const nextLesson = progress.status === 'completed' 
      ? null 
      : getNextLesson(pathwayId, progress.currentLessonOrder - 1);

    return NextResponse.json({
      ...pathway,
      progress,
      nextLesson: nextLesson ? {
        id: nextLesson.id,
        order: nextLesson.order,
        title: nextLesson.title,
        subtitle: nextLesson.subtitle,
        stage: nextLesson.stage,
        type: nextLesson.type,
        minimumTimeMinutes: nextLesson.minimumTimeMinutes,
        triggerWarning: nextLesson.triggerWarning
      } : null,
      isCompleted: progress.status === 'completed',
      canContinue: progress.status !== 'completed'
    });

  } catch (error) {
    console.error('Pathway detail API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}