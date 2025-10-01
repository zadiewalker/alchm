/**
 * ALCHM Beta Management System
 * Controls user onboarding, beta slot allocation, and growth metrics
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

const db = getFirestore();

// Beta configuration
const BETA_CONFIG = {
  MAX_BETA_USERS: 10000, // Initial beta cap
  REFERRAL_SLOTS_PER_USER: 3, // Each user can invite 3 friends
  WEEKLY_GROWTH_LIMIT: 200, // Max new users per week
  PRIORITY_COHORTS: {
    MENTAL_HEALTH_PROFESSIONALS: 500,
    EARLY_ADOPTERS: 1000,
    REFERRALS: 3000,
    GENERAL_WAITLIST: 5500
  }
};

/**
 * Check beta availability and assign slot if available
 */
export const requestBetaAccess = onCall(
  { cors: true },
  async (request) => {
    const { 
      email, 
      cohortType = 'GENERAL_WAITLIST', 
      referralCode, 
      professionalCredentials,
      waitlistReason 
    } = request.data;

    if (!email) {
      throw new HttpsError('invalid-argument', 'Email is required');
    }

    try {
      // Check if user is already in beta or waitlist
      const existingUserQuery = await db.collection('beta_users')
        .where('email', '==', email)
        .get();

      if (!existingUserQuery.empty) {
        const userDoc = existingUserQuery.docs[0];
        const userData = userDoc?.data();
        
        return {
          success: true,
          status: userData?.status,
          message: userData?.status === 'active' 
            ? 'You already have beta access!' 
            : `You're on the waitlist. Position: ${userData?.waitlistPosition}`,
          betaCode: userData?.betaCode || null
        };
      }

      // Get current beta stats
      const betaStats = await getBetaStats();
      const availableSlots = BETA_CONFIG.MAX_BETA_USERS - betaStats.activeBetaUsers;

      // Process referral code if provided
      let referrerData: any = null;
      if (referralCode) {
        const referrerQuery = await db.collection('beta_users')
          .where('betaCode', '==', referralCode)
          .where('status', '==', 'active')
          .get();

        if (!referrerQuery.empty) {
          referrerData = referrerQuery.docs[0]?.data();
          
          // Check if referrer has slots available
          const referralsUsed = referrerData.referralsUsed || 0;
          if (referralsUsed >= BETA_CONFIG.REFERRAL_SLOTS_PER_USER) {
            throw new HttpsError('resource-exhausted', 'Referral code has no remaining slots');
          }
        } else {
          throw new HttpsError('not-found', 'Invalid referral code');
        }
      }

      // Determine priority and slot allocation
      const priority = calculatePriority(cohortType, !!referralCode, professionalCredentials);
      const shouldGetImediateAccess = availableSlots > 0 && (
        priority >= 800 || // High priority cohorts
        (referrerData && availableSlots > 100) // Referrals with available slots
      );

      const betaUser = {
        email,
        cohortType,
        priority,
        status: shouldGetImediateAccess ? 'active' : 'waitlist',
        createdAt: Timestamp.now(),
        referralCode: referralCode || null,
        referrerId: referrerData?.userId || null,
        professionalCredentials: professionalCredentials || null,
        waitlistReason: waitlistReason || null,
        betaCode: shouldGetImediateAccess ? generateBetaCode() : null,
        waitlistPosition: shouldGetImediateAccess ? null : betaStats.waitlistSize + 1,
        referralsUsed: 0,
        invitedAt: shouldGetImediateAccess ? Timestamp.now() : null
      };

      // Add to beta collection
      const betaUserRef = await db.collection('beta_users').add(betaUser);
      
      // Update referrer if this was a successful referral
      if (referrerData && shouldGetImediateAccess && referralCode) {
        const referrerQuery = await db.collection('beta_users')
          .where('betaCode', '==', referralCode)
          .where('status', '==', 'active')
          .get();
          
        if (!referrerQuery.empty && referrerQuery.docs[0]) {
          await db.collection('beta_users').doc(referrerQuery.docs[0].id).update({
            referralsUsed: FieldValue.increment(1),
            lastReferralAt: Timestamp.now()
          });
        }
      }

      // Log beta event
      await logBetaEvent(betaUserRef.id, shouldGetImediateAccess ? 'beta_access_granted' : 'waitlist_joined', {
        email,
        cohortType,
        priority,
        referralCode: !!referralCode,
        waitlistPosition: betaUser.waitlistPosition
      });

      if (shouldGetImediateAccess) {
        // Send welcome email / notification
        await triggerWelcomeFlow(betaUserRef.id, email, betaUser.betaCode!);
        
        return {
          success: true,
          status: 'active',
          message: 'Welcome to ALCHM beta! Check your email for next steps.',
          betaCode: betaUser.betaCode
        };
      } else {
        return {
          success: true,
          status: 'waitlist',
          message: `You've been added to our waitlist. Position: ${betaUser.waitlistPosition || 'TBD'}`,
          waitlistPosition: betaUser.waitlistPosition || 0,
          estimatedWaitWeeks: Math.ceil((betaUser.waitlistPosition || 1) / BETA_CONFIG.WEEKLY_GROWTH_LIMIT)
        };
      }

    } catch (error) {
      logger.error('Beta access request failed:', error);
      throw new HttpsError('internal', 'Failed to process beta access request');
    }
  }
);

/**
 * Process weekly beta slot releases
 */
export const processWeeklyBetaRelease = onCall(
  { cors: true },
  async (request) => {
    // Verify admin access
    if (!request.auth?.token?.admin) {
      throw new HttpsError('permission-denied', 'Admin access required');
    }

    try {
      const betaStats = await getBetaStats();
      const availableSlots = BETA_CONFIG.MAX_BETA_USERS - betaStats.activeBetaUsers;
      const slotsToRelease = Math.min(availableSlots, BETA_CONFIG.WEEKLY_GROWTH_LIMIT);

      if (slotsToRelease <= 0) {
        return {
          success: true,
          message: 'No slots available for release',
          slotsReleased: 0
        };
      }

      // Get highest priority waitlist users
      const waitlistQuery = await db.collection('beta_users')
        .where('status', '==', 'waitlist')
        .orderBy('priority', 'desc')
        .orderBy('createdAt', 'asc')
        .limit(slotsToRelease)
        .get();

      const batch = db.batch();
      let promotedUsers = 0;

      for (const doc of waitlistQuery.docs) {
        const userData = doc.data();
        const betaCode = generateBetaCode();
        
        batch.update(doc.ref, {
          status: 'active',
          betaCode,
          invitedAt: Timestamp.now(),
          waitlistPosition: null
        });

        // Log promotion
        await logBetaEvent(doc.id, 'waitlist_promoted', {
          email: userData.email,
          cohortType: userData.cohortType,
          waitDays: Math.ceil((Timestamp.now().toMillis() - userData.createdAt.toMillis()) / (1000 * 60 * 60 * 24))
        });

        // Trigger welcome flow
        await triggerWelcomeFlow(doc.id, userData.email, betaCode);
        
        promotedUsers++;
      }

      await batch.commit();

      // Update waitlist positions for remaining users
      await updateWaitlistPositions();

      return {
        success: true,
        message: `Promoted ${promotedUsers} users from waitlist`,
        slotsReleased: promotedUsers,
        remainingSlots: availableSlots - promotedUsers
      };

    } catch (error) {
      logger.error('Weekly beta release failed:', error);
      throw new HttpsError('internal', 'Failed to process weekly beta release');
    }
  }
);

/**
 * Validate beta code and activate user
 */
export const validateBetaCode = onCall(
  { cors: true },
  async (request) => {
    const { betaCode, email } = request.data;

    if (!betaCode || !email) {
      throw new HttpsError('invalid-argument', 'Beta code and email are required');
    }

    try {
      const betaUserQuery = await db.collection('beta_users')
        .where('betaCode', '==', betaCode)
        .where('email', '==', email)
        .where('status', '==', 'active')
        .get();

      if (betaUserQuery.empty) {
        throw new HttpsError('not-found', 'Invalid beta code or email');
      }

      const betaUserDoc = betaUserQuery.docs[0];
      const betaUserData = betaUserDoc?.data();

      // Mark as activated if not already
      if (!betaUserData?.activatedAt) {
        await betaUserDoc?.ref.update({
          activatedAt: Timestamp.now(),
          lastActiveAt: Timestamp.now()
        });

        await logBetaEvent(betaUserDoc?.id || '', 'beta_activated', {
          email,
          cohortType: betaUserData?.cohortType,
          inviteToDays: Math.ceil((Timestamp.now().toMillis() - (betaUserData?.invitedAt?.toMillis() || 0)) / (1000 * 60 * 60 * 24))
        });
      }

      return {
        success: true,
        message: 'Welcome to ALCHM! Your beta access is confirmed.',
        userId: betaUserDoc?.id,
        cohortType: betaUserData?.cohortType,
        referralCode: betaUserData?.betaCode, // They can now invite others
        invitesRemaining: BETA_CONFIG.REFERRAL_SLOTS_PER_USER - (betaUserData?.referralsUsed || 0)
      };

    } catch (error) {
      logger.error('Beta code validation failed:', error);
      throw new HttpsError('internal', 'Failed to validate beta code');
    }
  }
);

/**
 * Get beta program statistics
 */
export const getBetaStatistics = onCall(
  { cors: true },
  async (request) => {
    // Allow authenticated users to see general stats
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required');
    }

    try {
      const stats = await getBetaStats();
      
      return {
        success: true,
        statistics: {
          totalBetaSlots: BETA_CONFIG.MAX_BETA_USERS,
          activeBetaUsers: stats.activeBetaUsers,
          waitlistSize: stats.waitlistSize,
          slotsRemaining: BETA_CONFIG.MAX_BETA_USERS - stats.activeBetaUsers,
          weeklyGrowthLimit: BETA_CONFIG.WEEKLY_GROWTH_LIMIT,
          cohortBreakdown: stats.cohortBreakdown,
          averageWaitTime: stats.averageWaitTime
        }
      };

    } catch (error) {
      logger.error('Failed to get beta statistics:', error);
      throw new HttpsError('internal', 'Failed to retrieve statistics');
    }
  }
);

// Helper functions

async function getBetaStats() {
  const [activeQuery, waitlistQuery] = await Promise.all([
    db.collection('beta_users').where('status', '==', 'active').get(),
    db.collection('beta_users').where('status', '==', 'waitlist').get()
  ]);

  const activeBetaUsers = activeQuery.size;
  const waitlistSize = waitlistQuery.size;

  // Calculate cohort breakdown
  const cohortBreakdown: Record<string, number> = {};
  activeQuery.docs.forEach(doc => {
    const cohort = doc.data().cohortType;
    cohortBreakdown[cohort] = (cohortBreakdown[cohort] || 0) + 1;
  });

  // Calculate average wait time for activated users
  let totalWaitTime = 0;
  let waitTimeCount = 0;
  activeQuery.docs.forEach(doc => {
    const data = doc.data();
    if (data.createdAt && data.invitedAt) {
      totalWaitTime += data.invitedAt.toMillis() - data.createdAt.toMillis();
      waitTimeCount++;
    }
  });

  const averageWaitTime = waitTimeCount > 0 
    ? Math.ceil(totalWaitTime / waitTimeCount / (1000 * 60 * 60 * 24)) 
    : 0;

  return {
    activeBetaUsers,
    waitlistSize,
    cohortBreakdown,
    averageWaitTime
  };
}

function calculatePriority(
  cohortType: string, 
  hasReferral: boolean, 
  professionalCredentials?: any
): number {
  let basePriority = 100;

  // Cohort-based priority
  switch (cohortType) {
    case 'MENTAL_HEALTH_PROFESSIONALS':
      basePriority = 1000;
      break;
    case 'EARLY_ADOPTERS':
      basePriority = 800;
      break;
    case 'REFERRALS':
      basePriority = 600;
      break;
    default:
      basePriority = 400;
  }

  // Boost for referrals
  if (hasReferral) {
    basePriority += 200;
  }

  // Boost for verified credentials
  if (professionalCredentials?.verified) {
    basePriority += 300;
  }

  return basePriority;
}

function generateBetaCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ALCHM-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function updateWaitlistPositions() {
  const waitlistQuery = await db.collection('beta_users')
    .where('status', '==', 'waitlist')
    .orderBy('priority', 'desc')
    .orderBy('createdAt', 'asc')
    .get();

  const batch = db.batch();
  
  waitlistQuery.docs.forEach((doc, index) => {
    batch.update(doc.ref, { waitlistPosition: index + 1 });
  });

  await batch.commit();
}

async function triggerWelcomeFlow(userId: string, email: string, betaCode: string) {
  // Create welcome flow trigger document
  await db.collection('email_triggers').add({
    type: 'beta_welcome',
    userId,
    email,
    betaCode,
    status: 'pending',
    createdAt: Timestamp.now(),
    metadata: {
      template: 'beta_welcome_v2',
      personalizedContent: true
    }
  });
}

async function logBetaEvent(userId: string, event: string, metadata: any) {
  await db.collection('beta_analytics').add({
    userId,
    event,
    timestamp: Timestamp.now(),
    metadata,
    source: 'beta_management_system'
  });
}