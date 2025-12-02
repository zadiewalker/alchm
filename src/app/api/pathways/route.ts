import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin } from '@/lib/firebaseAdmin';
import { PATHWAYS, getAvailablePathways, calculatePathwayProgress } from '@/lib/pathways';

// Initialize Firebase Admin
initializeFirebaseAdmin();

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
      console.error('Token verification failed:', authError);
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;
    const db = getFirestore();

    // Get user's pathway progress
    const progressSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('pathwayProgress')
      .get();
    
    const progressMap = new Map();
    const completedPathways: string[] = [];
    
    progressSnapshot.docs.forEach(doc => {
      const data = doc.data();
      progressMap.set(doc.id, data);
      
      if (data.status === 'completed') {
        completedPathways.push(doc.id);
      }
    });
    
    // Get user's entry count for prerequisites
    const entriesSnapshot = await db
      .collection('entries')
      .where('userId', '==', userId)
      .count()
      .get();
    
    const entryCount = entriesSnapshot.data().count;
    
    // Enrich pathways with progress and availability
    const enrichedPathways = PATHWAYS.map(pathway => {
      const progress = progressMap.get(pathway.id);
      
      // Check prerequisites
      const prerequisitesMet = (pathway.prerequisitePathways || []).every(
        prereqId => completedPathways.includes(prereqId)
      );
      const entriesMet = entryCount >= (pathway.minimumEntries || 0);
      const isAvailable = prerequisitesMet && entriesMet;
      
      // Calculate progress percentage
      const progressPercent = progress 
        ? calculatePathwayProgress(progress.completedLessons || 0, pathway.lessons.length)
        : 0;
      
      return {
        id: pathway.id,
        title: pathway.title,
        subtitle: pathway.subtitle,
        description: pathway.description,
        icon: pathway.icon,
        color: pathway.color,
        difficulty: pathway.difficulty,
        estimatedDuration: pathway.estimatedDuration,
        totalXP: pathway.totalXP,
        archetypeGuide: pathway.archetypeGuide,
        coreWound: pathway.coreWound,
        coreGift: pathway.coreGift,
        triggerWarnings: pathway.triggerWarnings,
        
        // Exclude full lesson content in list view
        lessonCount: pathway.lessons.length,
        
        progress: progress ? {
          status: progress.status || 'not-started',
          currentLessonOrder: progress.currentLessonOrder || 1,
          completedLessons: progress.completedLessons || 0,
          percentComplete: progressPercent,
          xpEarned: progress.xpEarned || 0,
          startedAt: progress.startedAt,
          lastActivityAt: progress.lastActivityAt,
          completedAt: progress.completedAt
        } : {
          status: 'not-started',
          currentLessonOrder: 1,
          completedLessons: 0,
          percentComplete: 0,
          xpEarned: 0
        },
        
        isAvailable,
        unavailableReason: !isAvailable
          ? !prerequisitesMet
            ? `Complete ${pathway.prerequisitePathways?.[0]} first`
            : `Write ${pathway.minimumEntries} journal entries first`
          : null,
      };
    });
    
    return NextResponse.json({ 
      pathways: enrichedPathways,
      userStats: {
        totalEntries: entryCount,
        completedPathways: completedPathways.length,
        totalXPEarned: Array.from(progressMap.values())
          .reduce((total, progress) => total + (progress.xpEarned || 0), 0)
      }
    });

  } catch (error) {
    console.error('Pathways API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}