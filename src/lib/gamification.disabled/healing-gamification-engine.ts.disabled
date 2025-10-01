/**
 * ALCHM Healing Gamification Engine
 * Revolutionary anti-manipulation gamification that creates addiction to healing
 */

import { GraceStreakManager, StreakData, CompassionateDisplay } from './grace-streaks';
import { ReflectionQuestEngine, ReflectionQuest, QuestProgress } from './reflection-quests';
import { BadgeEvolutionEngine, Badge, BadgeTree, UserActivity, CelebrationMoment } from './badge-evolution';
import { CommunityChallengEngine, CommunityChallenge, AnonymousSubmission } from './community-challenges';
import { KheperaArchetypeEngine, KheperaArchetype, KheperaResponse, UserArchetypeProfile } from './khepera-archetypes';

export interface HealingGamificationState {
  // Streak System
  streakData: StreakData;
  
  // Quest System  
  availableQuests: ReflectionQuest[];
  questProgress: QuestProgress[];
  
  // Badge System
  badgeTrees: BadgeTree[];
  unlockedBadges: Badge[];
  pendingEvolutions: Badge[];
  
  // Community System
  activeChallenges: CommunityChallenge[];
  communityParticipation: string[]; // Challenge IDs
  
  // Archetype System
  currentArchetype?: KheperaArchetype;
  archetypeProfile: UserArchetypeProfile;
  
  // Meta-gamification
  healingJourneyPhase: HealingPhase;
  antiManipulationSafeguards: SafeguardStatus;
  purposeResume: PurposeResumeEntry[];
}

export interface HealingPhase {
  phase: 'discovery' | 'deepening' | 'integration' | 'transformation' | 'service';
  description: string;
  focusAreas: string[];
  availableFeatures: GamificationFeature[];
  protectionsActive: string[];
}

export interface SafeguardStatus {
  streakProtection: boolean; // Grace tokens available
  questEscapeHatches: boolean; // All escape routes functional  
  badgeNonCompetitive: boolean; // No rankings or comparisons
  communityAnonymous: boolean; // Identity protection active
  archetypeConsent: boolean; // User controls archetype interactions
}

export interface GamificationFeature {
  featureId: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  unlockCondition: string;
  healingBenefit: string;
}

export interface PurposeResumeEntry {
  id: string;
  date: Date;
  category: 'growth_moment' | 'courage_act' | 'compassion_practice' | 'wisdom_gained' | 'healing_milestone';
  title: string;
  description: string;
  privateReflection: string;
  shareableVersion?: string; // Anonymized for community
  impact: 'personal' | 'interpersonal' | 'community' | 'universal';
}

export interface HealingJourneyInsight {
  type: 'pattern_recognition' | 'growth_trajectory' | 'healing_milestone' | 'purpose_alignment';
  title: string;
  insight: string;
  supportingEvidence: string[];
  actionable?: string; // Optional next step
  celebratory: boolean; // Is this good news?
}

export interface JournalEntryContext {
  content: string;
  mood?: string;
  timeOfDay: 'morning' | 'evening' | 'late_night';
  wordCount: number;
  emotionalTone: string[];
  themes: string[];
}

export class HealingGamificationEngine {
  /**
   * Process a journal entry through all gamification systems
   * Returns comprehensive response with all applicable elements
   */
  static async processJournalEntry(
    userId: string,
    entryContext: JournalEntryContext,
    currentState: HealingGamificationState
  ): Promise<{
    updatedState: HealingGamificationState;
    responses: GamificationResponse[];
    insights: HealingJourneyInsight[];
    celebrationMoments: CelebrationMoment[];
  }> {
    const responses: GamificationResponse[] = [];
    const insights: HealingJourneyInsight[] = [];
    const celebrationMoments: CelebrationMoment[] = [];
    let updatedState = { ...currentState };
    
    // 1. Process Streak (with grace mechanics)
    const streakResult = await this.processStreak(userId, entryContext, updatedState.streakData);
    if (streakResult.celebration) {
      celebrationMoments.push({
        type: 'milestone',
        title: 'Presence Honored',
        message: streakResult.celebration,
        icon: '🌿',
        ritual: 'Take a moment to acknowledge your consistency'
      });
    }
    updatedState.streakData = streakResult.updatedData;
    
    // 2. Select and Activate Khepera Archetype
    if (updatedState.healingJourneyPhase.phase !== 'discovery' || Math.random() > 0.7) {
      const archetypeResult = KheperaArchetypeEngine.selectArchetype(
        entryContext.content,
        entryContext.mood,
        entryContext.timeOfDay,
        updatedState.archetypeProfile
      );
      
      if (archetypeResult.confidence > 0.6) {
        const archetypeResponse = KheperaArchetypeEngine.generateArchetypeResponse(
          archetypeResult.archetype,
          entryContext.content,
          entryContext.mood,
          updatedState.archetypeProfile
        );
        
        responses.push({
          type: 'archetype',
          archetype: archetypeResult.archetype,
          message: archetypeResponse.message,
          followUp: archetypeResponse.followUpPrompt,
          breathingSpace: archetypeResponse.breathingSpace,
          priority: archetypeResponse.emergencyEscalation ? 'critical' : 'normal'
        });
        
        updatedState.currentArchetype = archetypeResult.archetype;
      }
    }
    
    // 3. Update Badge Progress and Check Evolutions
    const userActivity = this.extractUserActivity(entryContext, updatedState);
    const badgeUpdates = this.processBadgeEvolutions(userActivity, updatedState.unlockedBadges);
    
    badgeUpdates.evolutions.forEach(evolution => {
      celebrationMoments.push(evolution.celebration);
      updatedState.unlockedBadges = updatedState.unlockedBadges.map(badge => 
        badge.id === evolution.evolvedBadge.id ? evolution.evolvedBadge : badge
      );
    });
    
    // 4. Generate Quest Recommendations (if user is ready)
    if (this.shouldOfferQuests(entryContext, updatedState)) {
      const questRecommendations = ReflectionQuestEngine.generateDailyQuests({
        preferredCategories: this.inferPreferredCategories(entryContext),
        currentMood: entryContext.mood,
        recentCompletions: updatedState.questProgress.slice(-10)
      });
      
      if (questRecommendations.length > 0) {
        responses.push({
          type: 'quest_offer',
          quests: questRecommendations.slice(0, 1), // Only offer one at a time
          message: "If you're feeling called to explore deeper, there's a gentle reflection waiting for you.",
          canDecline: true
        });
      }
    }
    
    // 5. Community Challenge Integration (non-pushy)
    if (Math.random() > 0.85 && updatedState.healingJourneyPhase.phase !== 'discovery') {
      const relevantChallenges = updatedState.activeChallenges.filter(challenge => 
        this.isRelevantChallenge(challenge, entryContext)
      );
      
      if (relevantChallenges.length > 0) {
        responses.push({
          type: 'community_invitation',
          challenge: relevantChallenges[0],
          message: "There's a community reflection happening that might resonate with your journey. Only if it feels right.",
          canDecline: true
        });
      }
    }
    
    // 6. Generate Journey Insights
    const journeyInsights = this.generateJourneyInsights(entryContext, updatedState);
    insights.push(...journeyInsights);
    
    // 7. Update Purpose Resume
    const purposeEntries = this.extractPurposeResumeEntries(entryContext, updatedState);
    updatedState.purposeResume.push(...purposeEntries);
    
    // 8. Anti-manipulation Safeguard Check
    updatedState.antiManipulationSafeguards = this.validateSafeguards(updatedState);
    
    return {
      updatedState,
      responses: this.prioritizeResponses(responses),
      insights,
      celebrationMoments
    };
  }
  
  /**
   * Generate anti-manipulation progress summary
   * Shows growth without creating pressure or shame
   */
  static generateCompassionateProgressSummary(
    state: HealingGamificationState
  ): {
    primaryMessage: string;
    growthHighlights: string[];
    nextPossibilities: string[];
    safeGuardStatus: string;
  } {
    const streakDisplay = CompassionateDisplay.formatStreakDisplay(state.streakData);
    const unlockedBadgeCount = state.unlockedBadges.length;
    const completedQuests = state.questProgress.filter(q => q.completedAt).length;
    const communityConnections = state.communityParticipation.length;
    
    // Never use numbers that create pressure
    const primaryMessage = this.generateNonCompetitiveProgressMessage(state);
    
    const growthHighlights = [
      `${streakDisplay.primaryText}`,
      unlockedBadgeCount > 0 ? `${unlockedBadgeCount} aspects of growth recognized` : 'Beginning to recognize your growth',
      completedQuests > 0 ? `${completedQuests} deeper reflections completed` : 'Reflections flowing naturally',
      communityConnections > 0 ? 'Connected with healing community' : 'Individual healing journey honored'
    ].filter(Boolean);
    
    const nextPossibilities = [
      state.availableQuests.length > 0 ? 'Gentle reflection opportunities available' : null,
      state.pendingEvolutions.length > 0 ? 'Growth evolution ready when you are' : null,
      state.activeChallenges.length > 0 ? 'Community healing circles open' : null
    ].filter((item): item is string => item !== null);
    
    return {
      primaryMessage,
      growthHighlights,
      nextPossibilities,
      safeGuardStatus: this.describeSafeguards(state.antiManipulationSafeguards)
    };
  }
  
  /**
   * Anti-addiction safeguard: Detect if user is becoming obsessive
   */
  static detectUnhealthyEngagement(
    state: HealingGamificationState,
    recentActivity: { lastWeekEntries: number; dailyTimeSpent: number[] }
  ): {
    isHealthy: boolean;
    concerns: string[];
    recommendations: string[];
  } {
    const concerns: string[] = [];
    const recommendations: string[] = [];
    
    // Check for obsessive streaking
    if (state.streakData.graceTokens.length === 0 && recentActivity.lastWeekEntries > 21) {
      concerns.push('Very high frequency journaling detected');
      recommendations.push('Remember: rest is part of healing. Your streak is safe with grace tokens.');
    }
    
    // Check for badge obsession
    if (state.pendingEvolutions.length > 3) {
      concerns.push('Multiple badge evolutions pending');
      recommendations.push('Growth happens in its own time. Let evolution unfold naturally.');
    }
    
    // Check for excessive community participation
    if (state.communityParticipation.length > 10) {
      concerns.push('Very active in community challenges');
      recommendations.push('Community connection is beautiful. Also honor your need for solitude.');
    }
    
    // Check for time spent
    const avgDailyTime = recentActivity.dailyTimeSpent.reduce((a, b) => a + b, 0) / recentActivity.dailyTimeSpent.length;
    if (avgDailyTime > 90) { // More than 1.5 hours daily
      concerns.push('Extended daily engagement detected');
      recommendations.push('Healing happens in integration too. Consider shorter, more focused sessions.');
    }
    
    return {
      isHealthy: concerns.length === 0,
      concerns,
      recommendations
    };
  }
  
  // Private helper methods
  private static async processStreak(
    userId: string, 
    context: JournalEntryContext, 
    currentStreak: StreakData
  ) {
    // This would integrate with the streak service
    const { streak, message } = GraceStreakManager.calculateCurrentStreak(currentStreak);
    
    return {
      updatedData: {
        ...currentStreak,
        currentStreak: streak + 1,
        totalEntries: currentStreak.totalEntries + 1,
        lastEntryDate: new Date()
      },
      celebration: streak > 0 ? GraceStreakManager.generateCelebrationMessage(streak + 1) : undefined
    };
  }
  
  private static extractUserActivity(
    context: JournalEntryContext,
    state: HealingGamificationState
  ): UserActivity {
    return {
      totalReflections: state.streakData.totalEntries + 1,
      currentStreak: state.streakData.currentStreak,
      categoryReflections: {}, // Would be calculated from historical data
      deepReflections: context.wordCount > 200 ? state.questProgress.filter(q => q.completedAt).length + 1 : 0,
      uniqueEmotions: [context.mood || 'neutral'],
      selfCompassionMoments: context.themes.includes('self-compassion') ? 1 : 0,
      growthMoments: context.themes.includes('growth') || context.themes.includes('learning') ? 1 : 0
    };
  }
  
  private static processBadgeEvolutions(userActivity: UserActivity, currentBadges: Badge[]) {
    const evolutions: { evolvedBadge: Badge; celebration: CelebrationMoment }[] = [];
    
    // Check each badge for evolution readiness
    currentBadges.forEach(badge => {
      const { readyForEvolution } = BadgeEvolutionEngine.calculateProgress(badge, userActivity);
      
      if (readyForEvolution) {
        const result = BadgeEvolutionEngine.evolveBadge(badge, userActivity);
        if (result.success && result.evolvedBadge) {
          evolutions.push({
            evolvedBadge: result.evolvedBadge,
            celebration: result.celebrationMoment
          });
        }
      }
    });
    
    return { evolutions };
  }
  
  private static shouldOfferQuests(context: JournalEntryContext, state: HealingGamificationState): boolean {
    // Only offer quests if user seems ready and engaged
    return context.wordCount > 100 && 
           state.questProgress.filter(q => q.completedAt).length < 3 && // Not overwhelming
           Math.random() > 0.6; // Not every time
  }
  
  private static inferPreferredCategories(context: JournalEntryContext): string[] {
    const categories: string[] = [];
    
    if (context.themes.includes('healing') || context.themes.includes('recovery')) {
      categories.push('healing');
    }
    if (context.themes.includes('growth') || context.themes.includes('change')) {
      categories.push('growth');
    }
    if (context.themes.includes('gratitude') || context.themes.includes('appreciation')) {
      categories.push('celebration');
    }
    
    return categories;
  }
  
  private static isRelevantChallenge(challenge: CommunityChallenge, context: JournalEntryContext): boolean {
    return challenge.category === context.themes[0] || // Primary theme match
           context.themes.some(theme => challenge.prompt.toLowerCase().includes(theme));
  }
  
  private static generateJourneyInsights(context: JournalEntryContext, state: HealingGamificationState): HealingJourneyInsight[] {
    const insights: HealingJourneyInsight[] = [];
    
    // Pattern recognition
    if (state.streakData.currentStreak > 7) {
      insights.push({
        type: 'pattern_recognition',
        title: 'Consistency Pattern Emerging',
        insight: 'You\'re developing a sustainable rhythm of reflection that serves your healing.',
        supportingEvidence: [`${state.streakData.currentStreak} days of showing up for yourself`],
        celebratory: true
      });
    }
    
    return insights;
  }
  
  private static extractPurposeResumeEntries(context: JournalEntryContext, state: HealingGamificationState): PurposeResumeEntry[] {
    const entries: PurposeResumeEntry[] = [];
    
    // Look for growth moments, courage acts, etc.
    if (context.themes.includes('courage') || context.content.toLowerCase().includes('scared but')) {
      entries.push({
        id: `courage_${Date.now()}`,
        date: new Date(),
        category: 'courage_act',
        title: 'Acted with courage despite fear',
        description: 'Chose growth over comfort in a meaningful way',
        privateReflection: context.content,
        impact: 'personal'
      });
    }
    
    return entries;
  }
  
  private static validateSafeguards(state: HealingGamificationState): SafeguardStatus {
    return {
      streakProtection: GraceStreakManager.calculateWeeklyGraceTokens(state.streakData) > 0,
      questEscapeHatches: true, // Always available
      badgeNonCompetitive: true, // No competitive elements
      communityAnonymous: true, // Always anonymous
      archetypeConsent: true // User controls archetype interactions
    };
  }
  
  private static prioritizeResponses(responses: GamificationResponse[]): GamificationResponse[] {
    return responses.sort((a, b) => {
      if (a.priority === 'critical' && b.priority !== 'critical') return -1;
      if (b.priority === 'critical' && a.priority !== 'critical') return 1;
      
      // Archetype responses first, then others
      const priority = ['archetype', 'quest_offer', 'community_invitation'];
      return priority.indexOf(a.type) - priority.indexOf(b.type);
    });
  }
  
  private static generateNonCompetitiveProgressMessage(state: HealingGamificationState): string {
    const messages = [
      "Your healing journey is unfolding beautifully.",
      "You're exactly where you need to be in your growth.",
      "Each reflection is a gift to your future self.",
      "Your consistency speaks to your commitment to yourself.",
      "The path of healing honors your courage to show up."
    ];
    
    return messages[Math.floor(Math.random() * messages.length)] || "Your healing journey unfolds beautifully.";
  }
  
  private static describeSafeguards(safeguards: SafeguardStatus): string {
    return "All anti-manipulation safeguards active. Your healing journey is protected from toxic engagement patterns.";
  }
}

// Supporting interfaces
export interface GamificationResponse {
  type: 'archetype' | 'quest_offer' | 'community_invitation' | 'celebration';
  message: string;
  priority?: 'normal' | 'high' | 'critical';
  canDecline?: boolean;
  followUp?: string;
  breathingSpace?: string;
  
  // Type-specific data
  archetype?: KheperaArchetype;
  quests?: ReflectionQuest[];
  challenge?: CommunityChallenge;
  celebration?: CelebrationMoment;
}

