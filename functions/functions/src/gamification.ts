/**
 * ALCHM Firebase Functions - Gamification System v2.0
 * Grace-based streaks, reflection quests, badge trees, and trauma-informed engagement
 * Aligned with SAMHSA 4Rs and "Reclaim your resilience" positioning
 */

import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const db = getFirestore();

// Badge unlock conditions and rewards
const BADGE_CONDITIONS = {
  first_entry: { entryCount: 1 },
  still_here: { entryCount: 3 },
  week_strong: { streakDays: 7 },
  depth_diver: { khepraInteractions: 5 },
  community_builder: { referrals: 3 },
  sacred_witness: { entryCount: 30 }
};

const TIER_REWARDS = {
  referral_tier1: { type: 'trial', tier: 'tier1', days: 7 },
  referral_tier2: { type: 'trial', tier: 'tier2', days: 3 },
  review_tier1: { type: 'trial', tier: 'tier1', days: 7 }
};

/**
 * Triggered when a new journal entry is created
 * Updates streaks, checks badge unlocks, and tracks engagement
 */
export const onJournalEntryCreated = onDocumentCreated(
  'users/{userId}/journal_entries/{entryId}',
  async (event) => {
    const { userId, entryId } = event.params;
    const entryData = event.data?.data();

    if (!entryData) {
      logger.error('No entry data found');
      return;
    }

    logger.info(`Processing new journal entry for user ${userId}`);

    try {
      await db.runTransaction(async (transaction) => {
        // Get user profile
        const userRef = db.doc(`users/${userId}`);
        const userSnap = await transaction.get(userRef);
        
        if (!userSnap.exists) {
          throw new Error('User profile not found');
        }

        const userData = userSnap.data()!;
        const now = Timestamp.now();
        const today = new Date(now.toDate());
        today.setHours(0, 0, 0, 0);
        
        const lastJournalDate = userData.lastJournalDate?.toDate();
        const lastJournalDateOnly = lastJournalDate ? new Date(lastJournalDate) : null;
        
        if (lastJournalDateOnly) {
          lastJournalDateOnly.setHours(0, 0, 0, 0);
        }

        // Update user statistics
        let newStreak = userData.currentStreak || 0;
        
        // Check if this is a consecutive day
        if (lastJournalDateOnly) {
          const daysDiff = (today.getTime() - lastJournalDateOnly.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysDiff === 1) {
            // Consecutive day - increment streak
            newStreak += 1;
          } else if (daysDiff > 1) {
            // Broken streak - reset to 1
            newStreak = 1;
          }
          // Same day entries don't affect streak
        } else {
          // First entry ever
          newStreak = 1;
        }

        const updatedUserData = {
          totalEntries: (userData.totalEntries || 0) + 1,
          currentStreak: newStreak,
          longestStreak: Math.max(userData.longestStreak || 0, newStreak),
          lastJournalDate: now,
          updatedAt: now
        };

        transaction.update(userRef, updatedUserData);

        // Update streak subcollection
        const streakRef = db.doc(`users/${userId}/streaks/current`);
        transaction.set(streakRef, {
          currentStreak: newStreak,
          longestStreak: updatedUserData.longestStreak,
          lastJournalDate: now,
          totalJournalDays: updatedUserData.totalEntries,
          streakStartDate: newStreak === 1 ? now : userData.streakStartDate || now,
          updatedAt: now
        }, { merge: true });

        // Add to emotional timeline
        const timelineRef = db.collection(`users/${userId}/timeline`).doc();
        transaction.set(timelineRef, {
          date: now,
          entryType: 'journal',
          mood: entryData.moodBefore || 'contemplative',
          emotionalTags: entryData.emotionalTags || [],
          intensityLevel: entryData.intensityLevel || 5,
          title: entryData.title || 'Untitled Entry',
          wordCount: entryData.wordCount || 0,
          createdAt: now
        });

        // Check badge unlocks
        await checkAndUnlockBadges(transaction, userId, {
          entryCount: updatedUserData.totalEntries,
          streakDays: newStreak,
          khepraInteractions: userData.khepraInteractions || 0,
          referralCount: userData.referralCount || 0
        });

        // Check review trigger (after 3 entries)
        if (updatedUserData.totalEntries === 3) {
          await triggerReviewRequest(transaction, userId);
        }
      });

      logger.info(`Successfully processed journal entry for user ${userId}`);
    } catch (error) {
      logger.error('Error processing journal entry:', error);
      throw error;
    }
  }
);

/**
 * Check and unlock badges based on user achievements
 */
async function checkAndUnlockBadges(
  transaction: FirebaseFirestore.Transaction,
  userId: string,
  metrics: {
    entryCount: number;
    streakDays: number;
    khepraInteractions: number;
    referralCount: number;
  }
) {
  const badgesRef = db.collection(`users/${userId}/badges`);
  const existingBadgesSnap = await transaction.get(badgesRef);
  const existingBadgeIds = existingBadgesSnap.docs.map(doc => doc.id);

  const newBadges: string[] = [];

  // Check each badge condition
  for (const [badgeId, condition] of Object.entries(BADGE_CONDITIONS)) {
    if (existingBadgeIds.includes(badgeId)) continue;

    let shouldUnlock = false;

    if ('entryCount' in condition && metrics.entryCount >= condition.entryCount) {
      shouldUnlock = true;
    } else if ('streakDays' in condition && metrics.streakDays >= condition.streakDays) {
      shouldUnlock = true;
    } else if ('khepraInteractions' in condition && metrics.khepraInteractions >= condition.khepraInteractions) {
      shouldUnlock = true;
    } else if ('referrals' in condition && metrics.referralCount >= condition.referrals) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      const badgeRef = badgesRef.doc(badgeId);
      const badgeData = getBadgeDefinition(badgeId);
      
      transaction.set(badgeRef, {
        ...badgeData,
        unlockedAt: Timestamp.now(),
        userId: userId
      });

      newBadges.push(badgeId);
    }
  }

  if (newBadges.length > 0) {
    logger.info(`Unlocked ${newBadges.length} badges for user ${userId}: ${newBadges.join(', ')}`);
  }
}

/**
 * Trigger review request after user milestone
 */
async function triggerReviewRequest(
  transaction: FirebaseFirestore.Transaction,
  userId: string
) {
  const reviewTriggerRef = db.collection(`users/${userId}/review_triggers`).doc();
  
  transaction.set(reviewTriggerRef, {
    triggerType: 'milestone_3_entries',
    triggered: false,
    createdAt: Timestamp.now(),
    incentiveOffered: 'tier1_trial_7days',
    message: 'Feeling seen? Leave a review and unlock 7 days of Tier 1 features!'
  });

  logger.info(`Created review trigger for user ${userId}`);
}

/**
 * Handle referral completion and reward distribution
 */
export const onReferralCompleted = onDocumentUpdated(
  'users/{referrerId}/referrals/{referralId}',
  async (event) => {
    const { referrerId } = event.params;
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!beforeData || !afterData) return;

    // Check if referral just completed (friend made first journal entry)
    if (beforeData.status !== 'activated' && afterData.status === 'activated') {
      logger.info(`Processing completed referral for user ${referrerId}`);

      try {
        await db.runTransaction(async (transaction) => {
          const userRef = db.doc(`users/${referrerId}`);
          const userSnap = await transaction.get(userRef);
          
          if (!userSnap.exists) return;

          const userData = userSnap.data()!;
          const newReferralCount = (userData.referralCount || 0) + 1;

          // Update referral count
          transaction.update(userRef, {
            referralCount: newReferralCount,
            updatedAt: Timestamp.now()
          });

          // Grant rewards based on referral count
          let reward: { type: string; tier: string; days: number } | null = null;
          if (newReferralCount === 1) {
            // First referral - Tier 1 trial for 7 days
            reward = { type: 'trial', tier: 'tier1', days: 7 };
          } else if (newReferralCount === 3) {
            // Third referral - Tier 2 trial for 7 days + badge unlock
            reward = { type: 'trial', tier: 'tier2', days: 7 };
            
            // Unlock community builder badge
            const badgeRef = db.doc(`users/${referrerId}/badges/community_builder`);
            transaction.set(badgeRef, {
              ...getBadgeDefinition('community_builder'),
              unlockedAt: Timestamp.now(),
              userId: referrerId
            });
          }

          if (reward) {
            // Grant trial access
            const trialExpiry = new Date();
            trialExpiry.setDate(trialExpiry.getDate() + reward.days);

            transaction.update(userRef, {
              tier: reward.tier,
              trialExpiresAt: Timestamp.fromDate(trialExpiry),
              updatedAt: Timestamp.now()
            });

            logger.info(`Granted ${reward.tier} trial for ${reward.days} days to user ${referrerId}`);
          }

          // Record reward in timeline
          const timelineRef = db.collection(`users/${referrerId}/timeline`).doc();
          transaction.set(timelineRef, {
            date: Timestamp.now(),
            entryType: 'milestone',
            milestoneType: 'referral_reward',
            description: `Friend joined through your referral! ${reward ? `Unlocked ${reward.tier} for ${reward.days} days.` : 'Keep sharing to unlock rewards.'}`,
            createdAt: Timestamp.now()
          });
        });

      } catch (error) {
        logger.error('Error processing referral completion:', error);
      }
    }
  }
);

/**
 * Callable function to process review submission and grant rewards
 */
export const processReviewReward = onCall(
  { cors: true },
  async (request) => {
    const { userId, rating, reviewText, platform } = request.data;

    if (!userId || !rating) {
      throw new HttpsError('invalid-argument', 'Missing required fields');
    }

    try {
      // Verify user authentication
      if (!request.auth) {
        throw new HttpsError('unauthenticated', 'User not authenticated');
      }
      if (request.auth.uid !== userId) {
        throw new HttpsError('permission-denied', 'User ID mismatch');
      }

      await db.runTransaction(async (transaction) => {
        // Record the review
        const reviewRef = db.collection('app_reviews').doc();
        transaction.set(reviewRef, {
          userId,
          rating,
          reviewText: reviewText || '',
          platform: platform || 'in_app',
          reviewTrigger: 'prompted_3_entries',
          reviewedAt: Timestamp.now(),
          incentiveOffered: 'tier1_trial_7days',
          incentiveClaimed: true
        });

        // Grant Tier 1 trial for 7 days
        const userRef = db.doc(`users/${userId}`);
        const userSnap = await transaction.get(userRef);
        
        if (!userSnap.exists) {
          throw new Error('User not found');
        }

        const trialExpiry = new Date();
        trialExpiry.setDate(trialExpiry.getDate() + 7);

        transaction.update(userRef, {
          tier: 'tier1',
          trialExpiresAt: Timestamp.fromDate(trialExpiry),
          updatedAt: Timestamp.now()
        });

        // Add to timeline
        const timelineRef = db.collection(`users/${userId}/timeline`).doc();
        transaction.set(timelineRef, {
          date: Timestamp.now(),
          entryType: 'milestone',
          milestoneType: 'review_reward',
          description: 'Thank you for your review! Unlocked 7 days of Tier 1 features.',
          createdAt: Timestamp.now()
        });

        logger.info(`Granted review reward to user ${userId}: 7 days of Tier 1`);
      });

      return { success: true, message: '7 days of Tier 1 features unlocked!' };

    } catch (error) {
      logger.error('Error processing review reward:', error);
      throw new HttpsError('internal', 'Failed to process review reward');
    }
  }
);

/**
 * Callable function to create referral link
 */
export const createReferralLink = onCall(
  { cors: true },
  async (request) => {
    const { userId } = request.data;

    if (!userId) {
      throw new HttpsError('invalid-argument', 'User ID is required');
    }

    try {
      // Verify authentication
      if (!request.auth) {
        throw new HttpsError('unauthenticated', 'User not authenticated');
      }
      if (request.auth.uid !== userId) {
        throw new HttpsError('permission-denied', 'User ID mismatch');
      }

      // Get or create referral code
      const userRef = db.doc(`users/${userId}`);
      const userSnap = await userRef.get();
      
      if (!userSnap.exists) {
        throw new HttpsError('not-found', 'User not found');
      }

      const userData = userSnap.data()!;
      let referralCode = userData.referralCode;

      if (!referralCode) {
        // Generate unique referral code
        referralCode = generateReferralCode();
        await userRef.update({ referralCode });
      }

      const referralLink = `https://alchm-digital-sanctuary.web.app/invite/${referralCode}`;

      return {
        referralCode,
        referralLink,
        message: 'Share this link to invite friends to ALCHM'
      };

    } catch (error) {
      logger.error('Error creating referral link:', error);
      throw new HttpsError('internal', 'Failed to create referral link');
    }
  }
);

/**
 * Helper function to get badge definition
 */
function getBadgeDefinition(badgeId: string) {
  const definitions: Record<string, any> = {
    first_entry: {
      id: 'first_entry',
      name: 'First Words',
      description: 'You took the first step. Your voice matters.',
      category: 'milestone',
      emoji: '🌱',
      rarity: 'common',
      emotionalResonance: 'validating',
      celebrationMessage: 'You showed up for yourself today. That takes courage.'
    },
    still_here: {
      id: 'still_here', 
      name: 'Still Here',
      description: 'Three entries deep. You\'re building something meaningful.',
      category: 'milestone',
      emoji: '💝',
      rarity: 'common',
      emotionalResonance: 'empowering',
      celebrationMessage: 'You\'re creating a practice of self-care. Notice how that feels.'
    },
    week_strong: {
      id: 'week_strong',
      name: 'Week Strong',
      description: 'Seven days of showing up for yourself.',
      category: 'milestone',
      emoji: '⚡',
      rarity: 'uncommon',
      emotionalResonance: 'empowering',
      celebrationMessage: 'A week of self-compassion. You\'re building resilience.'
    },
    depth_diver: {
      id: 'depth_diver',
      name: 'Depth Diver',
      description: 'You went deep with KHEPERA\'s guidance.',
      category: 'reflection',
      emoji: '🔮',
      rarity: 'uncommon',
      emotionalResonance: 'transformative',
      celebrationMessage: 'You trusted the process and went beneath the surface.'
    },
    community_builder: {
      id: 'community_builder',
      name: 'Community Builder',
      description: 'You invited others into their healing journey.',
      category: 'community',
      emoji: '🤝',
      rarity: 'rare',
      emotionalResonance: 'empowering',
      celebrationMessage: 'You\'re helping others find their voice too. Beautiful.'
    },
    sacred_witness: {
      id: 'sacred_witness',
      name: 'Sacred Witness',
      description: 'Thirty days of witnessing your own becoming.',
      category: 'growth',
      emoji: '👁️',
      rarity: 'sacred',
      emotionalResonance: 'transformative',
      celebrationMessage: 'You\'ve become your own sacred witness. This is profound growth.'
    }
  };

  return definitions[badgeId] || {};
}

/**
 * Generate unique referral code
 */
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ===== NEW GRACE-BASED GAMIFICATION SYSTEM =====

/**
 * Grace-based streak system with recovery multipliers
 * "You're still here. That's the win."
 */
export const updateGraceStreak = onDocumentCreated(
  'users/{userId}/journals/{journalId}',
  async (event) => {
    const userId = event.params.userId;
    const journalData = event.data?.data();
    
    if (!journalData) return;

    try {
      const streakRef = db.doc(`users/${userId}/streaks/current`);
      const streakDoc = await streakRef.get();
      
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      if (!streakDoc.exists) {
        // First journal entry - initialize grace-based streak
        await streakRef.set({
          current: 1,
          longest: 1,
          lastJournalISO: today,
          graceTokens: 2, // Weekly allowance
          recoveryMultiplier: 1.0,
          streakFrozen: false,
          recoveryMultiplierUntil: null
        });
        
        // Award "Still Here I" badge
        await awardGraceBadge(userId, 'still_here', 1, 'You showed up. That\'s the win.');
        await logGamificationEvent(userId, 'streak_started', { firstEntry: true });
        
        return;
      }

      const streakData = streakDoc.data();
      const lastJournalDate = streakData?.lastJournalISO;
      const currentStreak = streakData?.current || 0;
      const longestStreak = streakData?.longest || 0;
      const graceTokens = streakData?.graceTokens || 0;
      const recoveryMultiplierUntil = streakData?.recoveryMultiplierUntil;
      
      // Skip if same day
      if (lastJournalDate === today) {
        return;
      }

      // Calculate days since last entry
      const lastDate = new Date(lastJournalDate);
      const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let newStreak = currentStreak;
      let newGraceTokens = graceTokens;
      let multiplier = 1.0;
      let updateData: any = {};
      
      // Apply recovery multiplier if active
      if (recoveryMultiplierUntil && now.toISOString() <= recoveryMultiplierUntil) {
        multiplier = 1.5;
        await logGamificationEvent(userId, 'recovery_multiplier_applied', { 
          multiplier, 
          returnDay: daysDiff 
        });
      }

      if (daysDiff === 1) {
        // Perfect streak continuation
        newStreak = currentStreak + 1;
      } else if (daysDiff > 1) {
        // Streak broken - check for grace tokens
        if (graceTokens > 0 && daysDiff <= 3) {
          // Use grace token to maintain streak
          newStreak = currentStreak + 1;
          newGraceTokens = graceTokens - 1;
          
          await logGamificationEvent(userId, 'grace_used', {
            daysMissed: daysDiff,
            tokensRemaining: newGraceTokens,
            message: 'Grace day used. You\'re still here.'
          });
        } else {
          // Streak reset - but award recovery multiplier
          newStreak = 1;
          const recoveryUntil = new Date();
          recoveryUntil.setDate(recoveryUntil.getDate() + 2);
          
          updateData.recoveryMultiplierUntil = recoveryUntil.toISOString();
          
          await logGamificationEvent(userId, 'streak_reset_with_recovery', {
            previousStreak: currentStreak,
            daysAway: daysDiff,
            message: 'Welcome back. Survival counts. Your next entries get bonus XP.'
          });
        }
      }

      // Update streak data
      updateData = {
        ...updateData,
        current: newStreak,
        longest: Math.max(newStreak, longestStreak),
        lastJournalISO: today,
        graceTokens: newGraceTokens
      };

      await streakRef.update(updateData);

      // Award XP and check badges
      const baseXP = 25;
      const finalXP = Math.round(baseXP * multiplier);
      
      await addXPEvent(userId, finalXP, 'journal', multiplier, 
        `Journal entry (streak day ${newStreak})`);

      // Check for streak-based badges
      await checkStreakBadges(userId, newStreak);

      await logGamificationEvent(userId, 'streak_incremented', {
        newStreak,
        longestStreak: Math.max(newStreak, longestStreak),
        graceTokensUsed: graceTokens - newGraceTokens,
        recoveryMultiplier: multiplier,
        xpAwarded: finalXP
      });

    } catch (error) {
      logger.error(`Error updating grace streak for user ${userId}:`, error);
    }
  }
);

/**
 * Reflection Quest System - 5-minute runs
 * Name It → Feel It → Reframe It
 */
export const completeQuestStep = onCall(
  { cors: true },
  async (request) => {
    const { userId, questId, stepNumber, response } = request.data;
    
    if (!userId || !questId || !stepNumber || !response) {
      throw new HttpsError('invalid-argument', 'Missing required quest data');
    }

    try {
      const questRef = db.doc(`users/${userId}/quests/${questId}`);
      const questDoc = await questRef.get();
      
      if (!questDoc.exists) {
        // Create new quest
        const questThemes = ['name-feel-reframe', 'past-present-future', 'fear-courage-action'];
        const randomTheme = questThemes[Math.floor(Math.random() * questThemes.length)];
        
        await questRef.set({
          id: questId,
          theme: randomTheme,
          stepsDone: 1,
          totalSteps: 3,
          startedAt: Timestamp.now(),
          responses: { [`step${stepNumber}`]: response },
          pausedAt: null
        });
        
        await logGamificationEvent(userId, 'quest_started', { questId, theme: randomTheme });
        
        return { 
          success: true, 
          message: 'Quest started! Deep reflections ahead.',
          nextStep: 2,
          totalSteps: 3
        };
      }

      const questData = questDoc.data();
      if (!questData) {
        throw new HttpsError('not-found', 'Quest not found');
      }
      
      const newStepsDone = Math.max(questData.stepsDone, stepNumber);
      const updatedResponses = {
        ...questData.responses,
        [`step${stepNumber}`]: response
      };

      // Check if quest is complete
      if (newStepsDone >= 3) {
        await questRef.update({
          stepsDone: newStepsDone,
          responses: updatedResponses,
          completedAt: Timestamp.now()
        });

        // Award quest completion rewards
        const questXP = 75;
        await addXPEvent(userId, questXP, 'quest', 1.0, `Completed ${questData.theme} quest`);
        
        // Check for quest-based badges
        await checkQuestBadges(userId);
        
        await logGamificationEvent(userId, 'quest_completed', { 
          questId, 
          theme: questData.theme,
          xpAwarded: questXP 
        });

        return {
          success: true,
          message: 'Quest complete! Micro-badge unlocked.',
          questComplete: true,
          xpAwarded: questXP
        };
      } else {
        await questRef.update({
          stepsDone: newStepsDone,
          responses: updatedResponses
        });

        return {
          success: true,
          message: 'Step recorded. Keep going.',
          nextStep: newStepsDone + 1,
          totalSteps: 3
        };
      }

    } catch (error) {
      logger.error('Error completing quest step:', error);
      throw new HttpsError('internal', 'Failed to complete quest step');
    }
  }
);

/**
 * Pause Quest - "I need a pause" button
 */
export const pauseQuest = onCall(
  { cors: true },
  async (request) => {
    const { userId, questId, reason } = request.data;
    
    try {
      const questRef = db.doc(`users/${userId}/quests/${questId}`);
      await questRef.update({
        pausedAt: Timestamp.now(),
        pauseReason: reason || 'processing'
      });

      await logGamificationEvent(userId, 'quest_paused', { questId, reason });

      return {
        success: true,
        message: 'Taking a pause is self-care. Your progress is saved.'
      };

    } catch (error) {
      logger.error('Error pausing quest:', error);
      throw new HttpsError('internal', 'Failed to pause quest');
    }
  }
);

/**
 * Community Challenge System (Anonymized)
 */
export const joinChallenge = onCall(
  { cors: true },
  async (request) => {
    const { userId, challengeId } = request.data;
    
    if (!userId || !challengeId) {
      throw new HttpsError('invalid-argument', 'Missing challenge data');
    }

    try {
      const challengeRef = db.doc(`challenges/${challengeId}`);
      const userAlias = `User✶${Math.random().toString(36).substr(2, 4)}`;

      await db.runTransaction(async (transaction) => {
        const challengeDoc = await transaction.get(challengeRef);
        
        if (!challengeDoc.exists) {
          throw new HttpsError('not-found', 'Challenge not found');
        }

        const challengeData = challengeDoc.data();
        const participants = challengeData?.participants || [];
        
        // Check if already joined
        const existingParticipant = participants.find((p: any) => p.uid === userId);
        if (existingParticipant) {
          throw new HttpsError('already-exists', 'Already joined this challenge');
        }

        // Add participant
        const newParticipant = {
          uid: userId,
          alias: userAlias,
          entries: 0,
          joinedAt: Timestamp.now()
        };

        transaction.update(challengeRef, {
          participants: [...participants, newParticipant],
          totalParticipants: participants.length + 1
        });

        // Record user participation
        const userChallengeRef = db.doc(`users/${userId}/challenges/${challengeId}`);
        transaction.set(userChallengeRef, {
          challengeId,
          alias: userAlias,
          joinedAt: Timestamp.now(),
          entriesSubmitted: 0,
          isActive: true
        });
      });

      await logGamificationEvent(userId, 'challenge_joined', { challengeId, alias: userAlias });

      return {
        success: true,
        message: `Joined challenge as ${userAlias}!`,
        alias: userAlias
      };

    } catch (error) {
      logger.error('Error joining challenge:', error);
      throw new HttpsError('internal', 'Failed to join challenge');
    }
  }
);

/**
 * Kindness Break System - Pause with Grace
 */
export const requestKindnessBreak = onCall(
  { cors: true },
  async (request) => {
    const { userId, reason, plannedReturnDays } = request.data;
    
    if (!userId) {
      throw new HttpsError('invalid-argument', 'User ID required');
    }

    try {
      const pauseRef = db.doc(`users/${userId}/kindness_break/current`);
      const streakRef = db.doc(`users/${userId}/streaks/current`);
      
      const plannedReturn = new Date();
      plannedReturn.setDate(plannedReturn.getDate() + (plannedReturnDays || 7));
      
      // Create kindness break record
      await pauseRef.set({
        userId,
        startedAt: Timestamp.now(),
        reason: reason || 'processing',
        plannedReturnDate: plannedReturn.toISOString(),
        checkInReminders: true,
        gracePeriodDays: plannedReturnDays || 7,
        returnMessage: null
      });

      // Freeze streak (don't reset)
      await streakRef.update({
        streakFrozen: true,
        pauseStartDate: Timestamp.now()
      });

      await logGamificationEvent(userId, 'pause_requested', {
        reason,
        plannedDays: plannedReturnDays,
        message: 'Taking a pause is self-care. We\'ll be here when you\'re ready.'
      });

      return { 
        success: true, 
        message: 'Taking a pause is self-care. We\'ll be here when you\'re ready.',
        returnDate: plannedReturn.toISOString(),
        streakPreserved: true
      };

    } catch (error) {
      logger.error('Error requesting kindness break:', error);
      throw new HttpsError('internal', 'Failed to request kindness break');
    }
  }
);

/**
 * Return from Kindness Break
 */
export const returnFromKindnessBreak = onCall(
  { cors: true },
  async (request) => {
    const { userId } = request.data;
    
    if (!userId) {
      throw new HttpsError('invalid-argument', 'User ID required');
    }

    try {
      const pauseRef = db.doc(`users/${userId}/kindness_break/current`);
      const streakRef = db.doc(`users/${userId}/streaks/current`);
      
      // Award "Still Here" badge for returning
      await awardGraceBadge(userId, 'still_here', 1, 'Welcome back. Survival counts.');
      
      // Unfreeze streak and add recovery multiplier
      const recoveryUntil = new Date();
      recoveryUntil.setDate(recoveryUntil.getDate() + 3);
      
      await streakRef.update({
        streakFrozen: false,
        recoveryMultiplierUntil: recoveryUntil.toISOString(),
        graceTokens: 2, // Refresh grace tokens
        pauseStartDate: null
      });

      // Archive the pause
      const pauseData = await pauseRef.get();
      if (pauseData.exists) {
        await pauseRef.update({
          actualReturnDate: new Date().toISOString(),
          returnMessage: 'Welcome back. Survival counts.'
        });
      }

      const durationDays = pauseData.exists ? 
        Math.floor((Date.now() - pauseData.data()?.startedAt.toMillis()) / (1000 * 60 * 60 * 24)) : 0;

      await logGamificationEvent(userId, 'pause_ended', {
        durationDays,
        recoveryMultiplierUntil: recoveryUntil.toISOString(),
        message: 'Welcome back. Survival counts. Your next entries get bonus XP.'
      });

      return { 
        success: true, 
        message: 'Welcome back. Survival counts. Your next entries get bonus XP.',
        recoveryMultiplierUntil: recoveryUntil.toISOString(),
        streakPreserved: true
      };

    } catch (error) {
      logger.error('Error returning from kindness break:', error);
      throw new HttpsError('internal', 'Failed to return from kindness break');
    }
  }
);

// Helper Functions

async function awardGraceBadge(userId: string, badgeKey: string, level: number, message: string) {
  const badgeRef = db.doc(`users/${userId}/badges/${badgeKey}_${level}`);
  const existingBadge = await badgeRef.get();
  
  if (existingBadge.exists) {
    return; // Badge already earned
  }

  const badgeConfig = getGraceBadgeConfig(badgeKey, level);
  
  await badgeRef.set({
    key: badgeKey,
    level,
    earnedAt: Timestamp.now(),
    name: badgeConfig.name,
    description: badgeConfig.description,
    tree: badgeConfig.tree,
    celebrationMessage: message || badgeConfig.celebrationMessage,
    xpAwarded: badgeConfig.xpReward
  });

  // Add XP reward
  await addXPEvent(userId, badgeConfig.xpReward, 'badge', 1.0, 
    `Badge earned: ${badgeConfig.name}`);
  
  await logGamificationEvent(userId, 'badge_earned', {
    badgeKey,
    level,
    xpAwarded: badgeConfig.xpReward,
    celebrationMessage: message
  });
}

function getGraceBadgeConfig(key: string, level: number) {
  const configs: Record<string, Record<number, any>> = {
    still_here: {
      1: { 
        name: 'Still Here I', 
        description: 'You showed up. That\'s the win.', 
        tree: 'presence',
        xpReward: 50,
        celebrationMessage: 'You showed up for yourself. That takes courage.'
      },
      2: { 
        name: 'Still Here II', 
        description: 'Three days of showing up for yourself.', 
        tree: 'presence',
        xpReward: 100,
        celebrationMessage: 'You\'re building something real.'
      },
      3: { 
        name: 'Still Here III', 
        description: 'A week of presence. Consistency is your superpower.', 
        tree: 'presence',
        xpReward: 200,
        celebrationMessage: 'A week of presence. You\'re building resilience.'
      }
    },
    chaos_to_clarity: {
      1: { 
        name: 'Chaos → Clarity I', 
        description: 'Found signal in the noise.', 
        tree: 'insight',
        xpReward: 75,
        celebrationMessage: 'You found patterns in the chaos. That\'s wisdom.'
      },
      2: { 
        name: 'Chaos → Clarity II', 
        description: 'Patterns emerging from the storm.', 
        tree: 'insight',
        xpReward: 150,
        celebrationMessage: 'The patterns are becoming clear. You\'re gaining insight.'
      },
      3: { 
        name: 'Chaos → Clarity III', 
        description: 'Master of making sense from chaos.', 
        tree: 'insight',
        xpReward: 300,
        celebrationMessage: 'You transform chaos into clarity. That\'s alchemy.'
      }
    },
    soft_but_strong: {
      1: { 
        name: 'Soft but Strong I', 
        description: 'Vulnerability as strength discovered.', 
        tree: 'resilience',
        xpReward: 100,
        celebrationMessage: 'You discovered vulnerability as strength.'
      },
      2: { 
        name: 'Soft but Strong II', 
        description: 'Compassion for self, boundaries with others.', 
        tree: 'resilience',
        xpReward: 200,
        celebrationMessage: 'Compassion for self, boundaries with others. Balance.'
      },
      3: { 
        name: 'Soft but Strong III', 
        description: 'Embodying gentle power.', 
        tree: 'resilience',
        xpReward: 400,
        celebrationMessage: 'You embody gentle power. That\'s mastery.'
      }
    }
  };
  
  return configs[key]?.[level] || { 
    name: `${key} ${level}`, 
    description: 'Achievement unlocked', 
    tree: 'general',
    xpReward: 50,
    celebrationMessage: 'You did something meaningful.'
  };
}

async function addXPEvent(userId: string, amount: number, source: string, multiplier: number, description: string) {
  const finalAmount = Math.round(amount * multiplier);
  
  // Log XP event
  await db.collection(`users/${userId}/xp_events`).add({
    amount: finalAmount,
    source,
    multiplier,
    timestamp: Timestamp.now(),
    description
  });

  // Update user's total XP and level
  const userRef = db.doc(`users/${userId}`);
  
  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists) {
      return;
    }
    
    const userData = userDoc.data();
    const currentXP = userData?.totalXP || 0;
    const currentLevel = userData?.level || 1;
    const newTotalXP = currentXP + finalAmount;
    
    // Calculate new level (every 500 XP = level up)
    const newLevel = Math.floor(newTotalXP / 500) + 1;
    
    transaction.update(userRef, {
      totalXP: newTotalXP,
      level: newLevel
    });

    // Award level-up celebration if leveled up
    if (newLevel > currentLevel) {
      const levelTitle = getLevelTitle(newLevel);
      await logGamificationEvent(userId, 'level_up', {
        newLevel,
        totalXP: newTotalXP,
        title: levelTitle,
        celebrationMessage: `Level up! You\'re now a ${levelTitle}.`
      });
    }
  });
}

function getLevelTitle(level: number): string {
  if (level <= 5) return 'Seeker';
  if (level <= 10) return 'Explorer';
  if (level <= 20) return 'Alchemist';
  if (level <= 35) return 'Sage';
  return 'Master';
}

async function checkStreakBadges(userId: string, streakDays: number) {
  if (streakDays === 3) {
    await awardGraceBadge(userId, 'still_here', 2, 'Three days of showing up for yourself. You\'re building something real.');
  } else if (streakDays === 7) {
    await awardGraceBadge(userId, 'still_here', 3, 'A week of presence. You\'re building resilience.');
  } else if (streakDays === 14) {
    await awardGraceBadge(userId, 'chaos_to_clarity', 2, 'Two weeks of insights. The patterns are emerging.');
  } else if (streakDays === 30) {
    await awardGraceBadge(userId, 'soft_but_strong', 3, 'A month of showing up. You embody gentle power.');
  }
}

async function checkQuestBadges(userId: string) {
  // Count completed quests
  const questsSnapshot = await db.collection(`users/${userId}/quests`)
    .where('completedAt', '!=', null)
    .get();
  
  const completedQuests = questsSnapshot.docs.length;
  
  if (completedQuests === 5) {
    await awardGraceBadge(userId, 'chaos_to_clarity', 1, 'Five quests completed. You found signal in the noise.');
  } else if (completedQuests === 15) {
    await awardGraceBadge(userId, 'chaos_to_clarity', 2, 'Fifteen quests completed. Patterns emerging from the storm.');
  } else if (completedQuests === 50) {
    await awardGraceBadge(userId, 'chaos_to_clarity', 3, 'Fifty quests completed. You transform chaos into clarity.');
  }
}

async function logGamificationEvent(userId: string, event: string, metadata: any) {
  await db.collection('analytics_events').add({
    userId,
    event,
    timestamp: Timestamp.now(),
    metadata,
    sessionId: `${userId}_${Date.now()}`,
    version: '2.0_grace_based'
  });
}