// API route for crisis assessment and prevention
import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { assessCrisis, CrisisAssessmentInput } from '@/ai/flows/crisis-prevention';
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
    if (!text || text.trim().length < 5) {
      return NextResponse.json({ 
        error: 'Text content required for crisis assessment' 
      }, { status: 400 });
    }

    // Get recent entries for pattern analysis
    const recentEntriesSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('entries')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    const recentEntries = recentEntriesSnapshot.docs
      .map(doc => doc.data().text)
      .filter(entry => entry !== text);

    // Get user's crisis history and preferences
    const userProfileSnapshot = await db
      .collection('users')
      .doc(userId)
      .get();

    const userProfile = userProfileSnapshot.data();
    const userHistory = {
      previousCrises: userProfile?.crisisHistory || [],
      copingStrategies: userProfile?.copingStrategies || [],
      supportNetwork: userProfile?.emergencyContacts || [],
      triggers: userProfile?.knownTriggers || []
    };

    // Prepare input for crisis assessment
    const assessmentInput = CrisisAssessmentInput.parse({
      text: text.trim(),
      userId,
      beforeMood,
      recentEntries,
      userHistory,
      timestamp: Date.now()
    });

    // Perform crisis assessment
    const assessment = await assessCrisis(assessmentInput);

    // Store the assessment in Firestore
    const assessmentData = {
      entryId,
      userId,
      riskScore: assessment.riskScore,
      riskLevel: assessment.riskLevel,
      triggerWords: assessment.triggerWords,
      warningPatterns: assessment.warningPatterns,
      interventionType: assessment.interventionType,
      confidence: assessment.confidence,
      timestamp: new Date(),
      processed: true
    };

    await db
      .collection('users')
      .doc(userId)
      .collection('crisis_assessments')
      .add(assessmentData);

    // Handle different intervention types
    if (assessment.interventionType !== 'none') {
      await handleIntervention(userId, assessment, entryId);
    }

    // Update user's crisis patterns if high risk
    if (assessment.riskLevel === 'high' || assessment.riskLevel === 'crisis') {
      await updateUserCrisisProfile(userId, assessment);
    }

    // Log analytics (without sensitive data)
    logger.info('Crisis assessment completed', {
      userId,
      riskLevel: assessment.riskLevel,
      interventionType: assessment.interventionType,
      confidence: assessment.confidence,
      triggerCount: assessment.triggerWords.length
    }, {
      component: 'crisis_prevention',
      action: 'assessment_completed'
    });

    // Return assessment (filtering sensitive information)
    const safeAssessment = {
      ...assessment,
      triggerWords: assessment.triggerWords.length > 0 ? ['[triggers detected]'] : [],
      emergencyContacts: undefined // Don't return in API response for privacy
    };

    return NextResponse.json(safeAssessment);

  } catch (error) {
    logger.error('Error in crisis assessment', error, {
      endpoint: '/api/crisis-assessment',
      method: 'POST'
    });

    return NextResponse.json(
      { error: 'Failed to perform crisis assessment' },
      { status: 500 }
    );
  }
}

// Handle different types of interventions
async function handleIntervention(
  userId: string, 
  assessment: any, 
  entryId?: string
) {
  const interventionData = {
    userId,
    entryId,
    type: assessment.interventionType,
    riskLevel: assessment.riskLevel,
    riskScore: assessment.riskScore,
    timestamp: new Date(),
    status: 'initiated'
  };

  // Store intervention record
  await db
    .collection('users')
    .doc(userId)
    .collection('interventions')
    .add(interventionData);

  switch (assessment.interventionType) {
    case 'gentle_check':
      await scheduleGentleCheckIn(userId, assessment);
      break;
    case 'urgent_support':
      await initiateUrgentSupport(userId, assessment);
      break;
    case 'emergency_protocol':
      await activateEmergencyProtocol(userId, assessment);
      break;
  }
}

// Schedule a gentle check-in
async function scheduleGentleCheckIn(userId: string, assessment: any) {
  // Schedule a follow-up check in 4 hours
  const followUpTime = new Date(Date.now() + 4 * 60 * 60 * 1000);
  
  await db
    .collection('scheduled_tasks')
    .add({
      type: 'gentle_check_in',
      userId,
      executeAt: followUpTime,
      data: {
        riskLevel: assessment.riskLevel,
        copingStrategies: assessment.copingStrategies.slice(0, 3)
      }
    });

  logger.info('Gentle check-in scheduled', {
    userId,
    followUpTime: followUpTime.toISOString()
  });
}

// Initiate urgent support
async function initiateUrgentSupport(userId: string, assessment: any) {
  // Schedule immediate follow-up in 30 minutes
  const urgentFollowUp = new Date(Date.now() + 30 * 60 * 1000);
  
  await db
    .collection('scheduled_tasks')
    .add({
      type: 'urgent_support_follow_up',
      userId,
      executeAt: urgentFollowUp,
      data: {
        riskLevel: assessment.riskLevel,
        supportResources: assessment.supportResources
      }
    });

  // Create urgent support notification
  await db
    .collection('users')
    .doc(userId)
    .collection('notifications')
    .add({
      type: 'urgent_support',
      title: 'Support Available',
      message: 'We noticed you might be going through a difficult time. Professional support resources are available.',
      resources: assessment.supportResources.filter((r: any) => r.available24h),
      timestamp: new Date(),
      priority: 'high',
      read: false
    });

  logger.warn('Urgent support initiated', {
    userId,
    riskScore: assessment.riskScore
  });
}

// Activate emergency protocol
async function activateEmergencyProtocol(userId: string, assessment: any) {
  // Create immediate emergency notification
  await db
    .collection('users')
    .doc(userId)
    .collection('notifications')
    .add({
      type: 'emergency',
      title: 'Crisis Support Available',
      message: 'If you are in immediate danger, please call 988 or 911. You are not alone.',
      emergencyResources: assessment.supportResources.filter((r: any) => 
        r.type === 'hotline' || r.type === 'emergency'
      ),
      timestamp: new Date(),
      priority: 'critical',
      read: false
    });

  // Schedule immediate follow-up in 15 minutes
  const emergencyFollowUp = new Date(Date.now() + 15 * 60 * 1000);
  
  await db
    .collection('scheduled_tasks')
    .add({
      type: 'emergency_follow_up',
      userId,
      executeAt: emergencyFollowUp,
      data: {
        riskLevel: assessment.riskLevel,
        assessmentId: assessment.id
      }
    });

  // Log critical event
  logger.error('Emergency protocol activated', {
    userId,
    riskScore: assessment.riskScore,
    triggerCount: assessment.triggerWords.length
  });
}

// Update user's crisis profile for personalized future support
async function updateUserCrisisProfile(userId: string, assessment: any) {
  const userRef = db.collection('users').doc(userId);
  
  await userRef.update({
    'crisisHistory': admin.firestore.FieldValue.arrayUnion({
      date: new Date().toISOString(),
      riskScore: assessment.riskScore,
      riskLevel: assessment.riskLevel,
      triggerPatterns: assessment.warningPatterns,
      intervention: assessment.interventionType
    }),
    'lastCrisisAssessment': new Date(),
    'riskFactors': assessment.warningPatterns
  });
}