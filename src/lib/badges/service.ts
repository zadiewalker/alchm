// lib/badges/service.ts - Badge management service

import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { Badge } from './export';
import { culturalBadgeManager, CulturalBadge } from '@/lib/culturally-responsive-badges';
import { CulturalAnalyticsContext } from '@/lib/analytics/cultural-engagement-analytics';

// Sample badges that users can earn
export const AVAILABLE_BADGES: Omit<Badge, 'id' | 'earnedDate' | 'notes'>[] = [
  // Presence Badges
  {
    name: "First Step",
    description: "Completed your first journal entry. Every journey begins with a single step.",
    category: "presence",
    iconUrl: "/badges/first-step.svg",
    metadata: { reflectionCount: 1 }
  },
  {
    name: "Week Warrior",
    description: "Maintained a 7-day journaling streak. Consistency is your superpower.",
    category: "presence", 
    iconUrl: "/badges/week-warrior.svg",
    metadata: { streakLength: 7 }
  },
  {
    name: "Moon Cycle",
    description: "Journaled for 30 consecutive days. You've established a powerful ritual.",
    category: "presence",
    iconUrl: "/badges/moon-cycle.svg", 
    metadata: { streakLength: 30 }
  },
  {
    name: "Seasonal Sage",
    description: "Maintained your practice for 90 days. You embody steady transformation.",
    category: "presence",
    iconUrl: "/badges/seasonal-sage.svg",
    metadata: { streakLength: 90 }
  },

  // Reflection Badges
  {
    name: "Deep Diver",
    description: "Wrote 10 thoughtful reflections. Your introspection creates wisdom.",
    category: "reflection",
    iconUrl: "/badges/deep-diver.svg",
    metadata: { reflectionCount: 10 }
  },
  {
    name: "Pattern Seeker", 
    description: "Wrote 25 entries exploring your emotional patterns and triggers.",
    category: "reflection",
    iconUrl: "/badges/pattern-seeker.svg",
    metadata: { reflectionCount: 25 }
  },
  {
    name: "Wisdom Weaver",
    description: "Created 50 meaningful reflections that honor your lived experience.",
    category: "reflection", 
    iconUrl: "/badges/wisdom-weaver.svg",
    metadata: { reflectionCount: 50 }
  },
  {
    name: "Story Keeper",
    description: "Reached 100 journal entries. You are the author of your own story.",
    category: "reflection",
    iconUrl: "/badges/story-keeper.svg",
    metadata: { reflectionCount: 100 }
  },

  // Growth Badges  
  {
    name: "Comfort Zone Challenger",
    description: "Explored uncomfortable feelings with courage and self-compassion.",
    category: "growth",
    iconUrl: "/badges/comfort-zone.svg"
  },
  {
    name: "Boundary Builder",
    description: "Reflected on healthy boundaries and honored your own limits.",
    category: "growth",
    iconUrl: "/badges/boundary-builder.svg"
  },
  {
    name: "Inner Voice Amplifier",
    description: "Consistently listened to and trusted your intuition through journaling.",
    category: "growth", 
    iconUrl: "/badges/inner-voice.svg"
  },
  {
    name: "Resilience Cultivator",
    description: "Documented your journey through challenges with grace and strength.",
    category: "growth",
    iconUrl: "/badges/resilience.svg"
  },

  // Community Badges
  {
    name: "Wisdom Sharer",
    description: "Engaged with community stories and perspectives with openness.",
    category: "community",
    iconUrl: "/badges/wisdom-sharer.svg",
    metadata: { communityEngagement: true }
  },
  {
    name: "Cultural Bridge",
    description: "Explored different cultural perspectives and shared your own insights.",
    category: "community", 
    iconUrl: "/badges/cultural-bridge.svg",
    metadata: { communityEngagement: true }
  },
  {
    name: "Peer Supporter",
    description: "Demonstrated care and support for fellow community members.",
    category: "community",
    iconUrl: "/badges/peer-supporter.svg", 
    metadata: { communityEngagement: true }
  },
  {
    name: "Voice Lifter",
    description: "Used your platform to amplify marginalized voices and perspectives.",
    category: "community",
    iconUrl: "/badges/voice-lifter.svg",
    metadata: { communityEngagement: true }
  }
];

export interface IdentityAffirmingBadgeContext {
  culturalBackground?: string[];
  lgbtqIdentity?: boolean;
  neurodivergent?: boolean;
  immigrantStatus?: string;
  intersectionalIdentities?: string[];
  healingApproaches?: string[];
  communityOrientation?: 'individual' | 'collective' | 'balanced';
  safetyNeeds?: {
    familyAcceptance: string;
    needsPrivacyProtection: boolean;
    culturalStigmaAwareness: boolean;
  };
}

export class BadgeService {
  // Get all badges earned by a user
  async getUserBadges(userId: string): Promise<Badge[]> {
    try {
      const badgesRef = collection(db, 'users', userId, 'badges');
      const snapshot = await getDocs(badgesRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Badge[];
    } catch (error) {
      console.error('Error fetching user badges:', error);
      return [];
    }
  }

  // Award a badge to a user
  async awardBadge(userId: string, badgeId: string, notes?: string): Promise<boolean> {
    try {
      const badgeTemplate = AVAILABLE_BADGES.find(b => 
        b.name.toLowerCase().replace(/\s+/g, '-') === badgeId
      );
      
      if (!badgeTemplate) {
        console.error('Badge template not found:', badgeId);
        return false;
      }

      const badge: Badge = {
        id: badgeId,
        ...badgeTemplate,
        earnedDate: new Date().toISOString(),
        notes: notes || ''
      };

      const badgeRef = doc(db, 'users', userId, 'badges', badgeId);
      await setDoc(badgeRef, badge);
      
      return true;
    } catch (error) {
      console.error('Error awarding badge:', error);
      return false;
    }
  }

  // Add personal notes to a badge
  async addBadgeNotes(userId: string, badgeId: string, notes: string): Promise<boolean> {
    try {
      const badgeRef = doc(db, 'users', userId, 'badges', badgeId);
      await updateDoc(badgeRef, { notes });
      return true;
    } catch (error) {
      console.error('Error adding badge notes:', error);
      return false;
    }
  }

  // Check if user should earn a badge based on their activity
  async checkBadgeEligibility(userId: string, activityData: {
    totalEntries?: number;
    currentStreak?: number;
    longestStreak?: number;
    communityEngagement?: boolean;
  }): Promise<string[]> {
    const eligibleBadges: string[] = [];
    const currentBadges = await this.getUserBadges(userId);
    const earnedBadgeIds = currentBadges.map(b => b.id);

    // Check streak-based badges
    if (activityData.currentStreak) {
      if (activityData.currentStreak >= 7 && !earnedBadgeIds.includes('week-warrior')) {
        eligibleBadges.push('week-warrior');
      }
      if (activityData.currentStreak >= 30 && !earnedBadgeIds.includes('moon-cycle')) {
        eligibleBadges.push('moon-cycle');
      }
      if (activityData.currentStreak >= 90 && !earnedBadgeIds.includes('seasonal-sage')) {
        eligibleBadges.push('seasonal-sage');
      }
    }

    // Check entry count badges
    if (activityData.totalEntries) {
      if (activityData.totalEntries >= 1 && !earnedBadgeIds.includes('first-step')) {
        eligibleBadges.push('first-step');
      }
      if (activityData.totalEntries >= 10 && !earnedBadgeIds.includes('deep-diver')) {
        eligibleBadges.push('deep-diver');
      }
      if (activityData.totalEntries >= 25 && !earnedBadgeIds.includes('pattern-seeker')) {
        eligibleBadges.push('pattern-seeker');
      }
      if (activityData.totalEntries >= 50 && !earnedBadgeIds.includes('wisdom-weaver')) {
        eligibleBadges.push('wisdom-weaver');
      }
      if (activityData.totalEntries >= 100 && !earnedBadgeIds.includes('story-keeper')) {
        eligibleBadges.push('story-keeper');
      }
    }

    // Check community engagement badges
    if (activityData.communityEngagement && !earnedBadgeIds.includes('wisdom-sharer')) {
      eligibleBadges.push('wisdom-sharer');
    }

    return eligibleBadges;
  }

  // Auto-award badges when criteria are met (enhanced with cultural awareness)
  async autoAwardBadges(
    userId: string, 
    activityData: {
      totalEntries?: number;
      currentStreak?: number;
      longestStreak?: number;
      communityEngagement?: boolean;
      culturalContext?: IdentityAffirmingBadgeContext;
      journalContent?: string[];
    }
  ): Promise<string[]> {
    const eligibleBadges = await this.checkBadgeEligibility(userId, activityData);
    const awardedBadges: string[] = [];

    // Check traditional badges
    for (const badgeId of eligibleBadges) {
      const success = await this.awardBadge(userId, badgeId);
      if (success) {
        awardedBadges.push(badgeId);
      }
    }

    // Check cultural badges if context provided
    if (activityData.culturalContext && activityData.journalContent) {
      const culturalBadges = await this.checkCulturalBadgeEligibility(
        userId,
        activityData.culturalContext,
        activityData.journalContent
      );
      
      for (const badgeId of culturalBadges) {
        const success = await this.awardCulturalBadge(userId, badgeId, activityData.culturalContext);
        if (success) {
          awardedBadges.push(badgeId);
        }
      }
    }

    return awardedBadges;
  }

  // Get badge statistics for a user
  async getBadgeStats(userId: string): Promise<{
    total: number;
    byCategory: Record<string, number>;
    recentBadges: Badge[];
  }> {
    const badges = await this.getUserBadges(userId);
    
    const byCategory = badges.reduce((acc, badge) => {
      acc[badge.category] = (acc[badge.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentBadges = badges
      .sort((a, b) => new Date(b.earnedDate).getTime() - new Date(a.earnedDate).getTime())
      .slice(0, 3);

    return {
      total: badges.length,
      byCategory,
      recentBadges
    };
  }

  // Check eligibility for cultural badges
  async checkCulturalBadgeEligibility(
    userId: string,
    culturalContext: IdentityAffirmingBadgeContext,
    journalContent: string[]
  ): Promise<string[]> {
    const relevantBadges = culturalBadgeManager.getRelevantBadges({
      culturalBackground: culturalContext.culturalBackground,
      lgbtqIdentity: culturalContext.lgbtqIdentity,
      neurodivergent: culturalContext.neurodivergent,
      immigrant: culturalContext.immigrantStatus !== undefined,
      ageGroup: 'adult', // Default, could be determined from user data
      intersectionalIdentities: culturalContext.intersectionalIdentities
    });

    const eligibleBadges: string[] = [];
    const currentBadges = await this.getUserBadges(userId);
    const earnedBadgeIds = currentBadges.map(b => b.id);

    for (const badge of relevantBadges) {
      if (earnedBadgeIds.includes(badge.id)) continue;

      // Check if badge should be awarded based on journal content
      for (const content of journalContent) {
        if (culturalBadgeManager.shouldAwardBadge(
          badge.id,
          content,
          culturalContext,
          { previousEntries: journalContent.length }
        )) {
          eligibleBadges.push(badge.id);
          break;
        }
      }
    }

    return eligibleBadges;
  }

  // Award cultural badge with appropriate celebration
  async awardCulturalBadge(
    userId: string,
    badgeId: string,
    culturalContext: IdentityAffirmingBadgeContext
  ): Promise<boolean> {
    try {
      const culturalBadge = culturalBadgeManager.allBadges.find(b => b.id === badgeId);
      
      if (!culturalBadge) {
        console.error('Cultural badge not found:', badgeId);
        return false;
      }

      const badge: Badge = {
        id: badgeId,
        name: culturalBadge.name,
        description: culturalBadge.description,
        category: culturalBadge.category,
        iconUrl: culturalBadge.icon, // Cultural badges use emoji icons
        earnedDate: new Date().toISOString(),
        notes: culturalBadge.culturalContext
      };

      const badgeRef = doc(db, 'users', userId, 'badges', badgeId);
      await setDoc(badgeRef, badge);
      
      return true;
    } catch (error) {
      console.error('Error awarding cultural badge:', error);
      return false;
    }
  }

  // Get culturally-appropriate celebration message
  getCulturalCelebrationMessage(
    badgeId: string,
    culturalContext: IdentityAffirmingBadgeContext
  ): string {
    return culturalBadgeManager.getCulturalCelebration(badgeId, culturalContext);
  }

  // Get badges filtered for cultural relevance
  async getCulturallyRelevantBadges(
    userId: string,
    culturalContext: IdentityAffirmingBadgeContext
  ): Promise<{
    earnedBadges: Badge[];
    availableBadges: CulturalBadge[];
    culturalAffirmations: string[];
  }> {
    const earnedBadges = await this.getUserBadges(userId);
    const availableBadges = culturalBadgeManager.getRelevantBadges({
      culturalBackground: culturalContext.culturalBackground,
      lgbtqIdentity: culturalContext.lgbtqIdentity,
      neurodivergent: culturalContext.neurodivergent,
      immigrant: culturalContext.immigrantStatus !== undefined,
      ageGroup: 'adult',
      intersectionalIdentities: culturalContext.intersectionalIdentities
    });

    // Generate cultural affirmations based on earned badges
    const culturalAffirmations = earnedBadges
      .filter(badge => availableBadges.some(cb => cb.id === badge.id))
      .map(badge => {
        const culturalBadge = availableBadges.find(cb => cb.id === badge.id);
        return culturalBadge?.celebrationMessage || `You earned: ${badge.name}`;
      });

    return {
      earnedBadges,
      availableBadges: availableBadges.filter(cb => 
        !earnedBadges.some(eb => eb.id === cb.id)
      ),
      culturalAffirmations
    };
  }
}

export const badgeService = new BadgeService();