import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin } from '@/lib/firebaseAdmin';
import { getPathway, getLesson } from '@/lib/pathways';

// Initialize Firebase Admin
initializeFirebaseAdmin();

export async function GET(
  request: NextRequest,
  { params }: { params: { pathwayId: string; lessonId: string } }
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

    const { pathwayId, lessonId } = params;
    const userId = decodedToken.uid;

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

    const db = getFirestore();

    // Get user's progress for this pathway
    const progressDoc = await db
      .collection('users')
      .doc(userId)
      .collection('pathwayProgress')
      .doc(pathwayId)
      .get();

    let progress = null;
    let isAccessible = true;
    let accessMessage = '';

    if (progressDoc.exists()) {
      const data = progressDoc.data();
      progress = {
        status: data?.status || 'not-started',
        currentLessonOrder: data?.currentLessonOrder || 1,
        completedLessons: data?.completedLessons || 0,
        lessonCompletions: data?.lessonCompletions || {}
      };

      // Check if this lesson is accessible
      // User can only access lessons up to their current lesson order
      if (lesson.order > progress.currentLessonOrder) {
        isAccessible = false;
        accessMessage = `Complete the previous lessons first. You're currently on lesson ${progress.currentLessonOrder}.`;
      }
    } else {
      // No progress yet - only first lesson is accessible
      if (lesson.order > 1) {
        isAccessible = false;
        accessMessage = 'Start with the first lesson of this pathway.';
      }
      
      progress = {
        status: 'not-started',
        currentLessonOrder: 1,
        completedLessons: 0,
        lessonCompletions: {}
      };
    }

    // If not accessible, return limited info
    if (!isAccessible) {
      return NextResponse.json(
        { 
          error: 'Lesson not accessible',
          message: accessMessage,
          lesson: {
            id: lesson.id,
            title: lesson.title,
            subtitle: lesson.subtitle,
            order: lesson.order,
            stage: lesson.stage
          }
        },
        { status: 403 }
      );
    }

    // Check if lesson is already completed
    const isCompleted = !!progress.lessonCompletions[lessonId];
    const completion = progress.lessonCompletions[lessonId];

    return NextResponse.json({
      pathway: {
        id: pathway.id,
        title: pathway.title,
        subtitle: pathway.subtitle,
        archetypeGuide: pathway.archetypeGuide,
        color: pathway.color,
        totalLessons: pathway.lessons.length
      },
      lesson: {
        ...lesson,
        isCompleted,
        completion: completion || null
      },
      userProgress: {
        currentLessonOrder: progress.currentLessonOrder,
        completedLessons: progress.completedLessons,
        percentComplete: Math.round((progress.completedLessons / pathway.lessons.length) * 100)
      }
    });

  } catch (error) {
    console.error('Lesson detail API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}