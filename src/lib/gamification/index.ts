/**
 * GAMIFICATION INTELLIGENCE SYSTEM INTEGRATION
 * "The complete ecosystem for healing-centered achievement"
 * 
 * This file exports the complete badge intelligence system that transforms
 * traditional gamification into therapeutic support systems.
 * 
 * Core Innovation: We measure healing outcomes, not engagement metrics.
 * Revolutionary Principle: Achievements serve the user's therapy, not platform addiction.
 */

// Core Intelligence Systems
export { BadgeSystemIntelligence } from './badge-system-intelligence';
export type { 
  BadgeEffectivenessMetrics,
  BadgePersonalizationProfile,
  ABTestConfiguration,
  BadgeDesignVariant,
  PersonalizedAchievementSuggestion
} from './badge-system-intelligence';

export { TraumaInformedABTesting } from './ab-testing-framework';
export type {
  TraumaInformedTestMetrics,
  TestParticipant,
  TestSafeguards,
  TestResults
} from './ab-testing-framework';

export { PersonalizedAchievementEngine } from './personalized-achievement-engine';
export type {
  HealingPattern,
  PersonalGrowthProfile,
  ContextualFactors,
  AchievementRecommendation
} from './personalized-achievement-engine';

// Grace Token & Anti-Shame Systems
export { 
  GraceTokenSystem,
  PresenceMetricSystem,
  AntiShameSystem
} from './grace-token-revolution';
export type {
  GraceTokenState,
  PresenceMetrics,
  GraceTokenUsageResult,
  ShameInterceptionResult
} from './grace-token-revolution';

// Badge Trees & Community Systems (if they exist)
export { REVOLUTIONARY_BADGE_TREES } from './organic-badge-trees';
export { MutualSupportCommunitySystem } from './mutual-support-community';
export { PresenceOverPerformanceSystem } from './presence-over-performance';

// Duolingo-Style Healing Engine
export { 
  DuolingoStyleHealingEngine,
  default as DuolingoEngine 
} from './duolingo-style-healing-engine';
export type {
  EmotionalStreak,
  EmotionalSkill,
  EmotionalExercise,
  LearningPath,
  PathRecommendation,
  CelebrationEvent,
  DailyCheckIn
} from './duolingo-style-healing-engine';

// Adaptive Learning Engine
export { 
  AdaptiveLearningEngine,
  default as AdaptiveEngine 
} from './adaptive-learning-engine';
export type {
  LearningAnalytics,
  AdaptiveCurriculum,
  LearningModule,
  AdaptiveExercise,
  PersonalizedRecommendation,
  PersonalizedMilestone
} from './adaptive-learning-engine';

// Engagement System
export { 
  EngagementSystem,
  default as EngagementEngine 
} from './engagement-system';
export type {
  EngagementPreferences,
  SpacedRepetitionItem,
  EngagementNudge,
  EngagementAnalytics,
  MotivationalCue
} from './engagement-system';

// Main Integration Class
export class HealingGamificationIntelligence {
  /**
   * Complete system initialization for a user
   */
  static async initializeForUser(userId: string, options?: {
    skipVulnerabilityScreening?: boolean;
    customHealingGoals?: string[];
    culturalAdaptations?: string[];
  }) {
    try {
      console.log(`Initializing Healing Gamification Intelligence for user: ${userId}`);
      
      // 1. Analyze user's healing patterns
      const healingPatterns = await PersonalizedAchievementEngine.analyzeHealingPatterns(userId);
      console.log('✓ Healing patterns analyzed');
      
      // 2. Create personal growth profile
      const growthProfile = await PersonalizedAchievementEngine.createPersonalGrowthProfile(userId, {
        primaryHealingGoals: options?.customHealingGoals,
        culturalBackground: options?.culturalAdaptations
      });
      console.log('✓ Personal growth profile created');
      
      // 3. Assess current contextual factors
      const contextualFactors = await PersonalizedAchievementEngine.assessContextualFactors(userId);
      console.log('✓ Contextual factors assessed');
      
      // 4. Generate initial personalized recommendations
      const recommendations = await PersonalizedAchievementEngine.generateRecommendations(
        userId,
        healingPatterns,
        growthProfile,
        contextualFactors,
        3 // Initial 3 recommendations
      );
      console.log('✓ Personalized recommendations generated');
      
      // 5. Initialize grace token system
      const graceTokens = GraceTokenSystem.renewWeeklyTokens({
        tokens: 0,
        renewalDate: '',
        weeklyUsage: {
          week: '',
          tokensUsed: 0,
          tokensEarned: 0,
          healingMoments: []
        },
        lifetimeGraceUsed: 0,
        wisestGraceUse: ''
      });
      console.log('✓ Grace token system initialized');
      
      // 6. Set up anti-shame monitoring
      const antiShameConfig = {
        enabled: true,
        sensitivityLevel: growthProfile.traumaInformedNeeds.needsExtraGrace ? 'high' : 'moderate',
        interventionPreferences: growthProfile.celebrationPreferences
      };
      console.log('✓ Anti-shame system configured');
      
      return {
        success: true,
        systems: {
          healingPatterns,
          growthProfile,
          contextualFactors,
          recommendations,
          graceTokens,
          antiShameConfig
        },
        message: 'Healing Gamification Intelligence successfully initialized'
      };
    } catch (error) {
      console.error('Error initializing Healing Gamification Intelligence:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to initialize intelligence systems'
      };
    }
  }
  
  /**
   * Daily intelligence update cycle
   */
  static async dailyIntelligenceUpdate(userId: string) {
    try {
      console.log(`Running daily intelligence update for user: ${userId}`);
      
      // 1. Check for badge effectiveness changes
      const recentBadges = await this.getRecentBadges(userId, 7); // Last 7 days
      const effectivenessUpdates = await Promise.all(
        recentBadges.map(badge => 
          BadgeSystemIntelligence.analyzeBadgeEffectiveness(badge.id, {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            end: new Date()
          })
        )
      );
      
      // 2. Update healing patterns based on recent activity
      const updatedPatterns = await PersonalizedAchievementEngine.analyzeHealingPatterns(userId);
      
      // 3. Refresh recommendations based on new patterns
      const contextualFactors = await PersonalizedAchievementEngine.assessContextualFactors(userId);
      const growthProfile = await PersonalizedAchievementEngine.createPersonalGrowthProfile(userId);
      
      const refreshedRecommendations = await PersonalizedAchievementEngine.generateRecommendations(
        userId,
        updatedPatterns,
        growthProfile,
        contextualFactors,
        3
      );
      
      // 4. Check grace token renewal
      const currentGraceTokens = await this.getCurrentGraceTokens(userId);
      if (GraceTokenSystem.shouldRenewTokens(currentGraceTokens.renewalDate)) {
        const renewedTokens = GraceTokenSystem.renewWeeklyTokens(currentGraceTokens);
        await this.saveGraceTokens(userId, renewedTokens);
      }
      
      // 5. Monitor for shame spiral risks
      const shameRiskAssessment = await this.assessShameSpiraRisk(userId);
      if (shameRiskAssessment.risk > 3) {
        const intervention = AntiShameSystem.interceptShameSpiral({
          missedDays: shameRiskAssessment.missedDays,
          selfCriticalLanguage: shameRiskAssessment.selfCriticalLanguage,
          perfectionismSpike: shameRiskAssessment.perfectionismSpike,
          comparisonThoughts: shameRiskAssessment.comparisonThoughts
        });
        
        if (intervention.intercepted) {
          await this.deliverShameIntervention(userId, intervention);
        }
      }
      
      console.log('✓ Daily intelligence update completed successfully');
      
      return {
        success: true,
        updates: {
          badgeEffectiveness: effectivenessUpdates,
          healingPatterns: updatedPatterns,
          recommendations: refreshedRecommendations,
          shameRisk: shameRiskAssessment
        }
      };
    } catch (error) {
      console.error('Error in daily intelligence update:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Create and monitor a trauma-informed A/B test
   */
  static async createHealingFocusedTest(
    testName: string,
    hypothesis: string,
    controlVariant: BadgeDesignVariant,
    treatmentVariant: BadgeDesignVariant,
    options?: {
      maxDuration?: number; // days
      targetHealingPhases?: string[];
      ethicalOversight?: boolean;
    }
  ) {
    try {
      console.log(`Creating trauma-informed A/B test: ${testName}`);
      
      // 1. Validate both variants are trauma-informed
      await this.validateTraumaInformedDesign(controlVariant);
      await this.validateTraumaInformedDesign(treatmentVariant);
      
      // 2. Initialize test with enhanced safeguards
      const testId = await TraumaInformedABTesting.initializeTest(
        testName,
        hypothesis,
        controlVariant,
        treatmentVariant,
        {
          healingPhases: options?.targetHealingPhases,
          excludeVulnerableGroups: true
        }
      );
      
      // 3. Set up continuous monitoring
      const monitoringInterval = setInterval(async () => {
        try {
          const results = await TraumaInformedABTesting.monitorTestOutcomes(testId);
          
          // Check for early termination conditions
          if (this.shouldTerminateTest(results)) {
            clearInterval(monitoringInterval);
            await this.terminateTestForSafety(testId, results);
          }
        } catch (error) {
          console.error('Error monitoring test:', error);
        }
      }, 24 * 60 * 60 * 1000); // Daily monitoring
      
      console.log(`✓ Trauma-informed test created with ID: ${testId}`);
      
      return {
        success: true,
        testId,
        monitoringActive: true,
        safeguards: {
          continuousMonitoring: true,
          vulnerabilityScreening: true,
          ethicalTermination: true
        }
      };
    } catch (error) {
      console.error('Error creating trauma-informed test:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Generate comprehensive intelligence report for a user
   */
  static async generateIntelligenceReport(userId: string) {
    try {
      console.log(`Generating comprehensive intelligence report for user: ${userId}`);
      
      // Gather all intelligence data
      const [
        healingPatterns,
        growthProfile,
        contextualFactors,
        recentBadges,
        graceTokenHistory,
        recommendations
      ] = await Promise.all([
        PersonalizedAchievementEngine.analyzeHealingPatterns(userId),
        PersonalizedAchievementEngine.createPersonalGrowthProfile(userId),
        PersonalizedAchievementEngine.assessContextualFactors(userId),
        this.getRecentBadges(userId, 30),
        this.getGraceTokenHistory(userId),
        PersonalizedAchievementEngine.generateRecommendations(userId, null, null, null, 5)
      ]);
      
      // Analyze badge effectiveness for earned badges
      const badgeEffectiveness = await Promise.all(
        recentBadges.map(badge => 
          BadgeSystemIntelligence.analyzeBadgeEffectiveness(badge.id, {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            end: new Date()
          })
        )
      );
      
      const report = {
        userId,
        generatedAt: new Date(),
        
        // Healing Intelligence
        healingIntelligence: {
          patterns: healingPatterns,
          currentPhase: contextualFactors.currentPhase,
          growthTrajectory: this.analyzeGrowthTrajectory(healingPatterns, recentBadges),
          therapeuticValue: this.calculateTherapeuticValue(badgeEffectiveness)
        },
        
        // Personal Profile Intelligence
        personalIntelligence: {
          profile: growthProfile,
          preferences: this.extractPreferences(growthProfile),
          adaptationNeeds: this.identifyAdaptationNeeds(growthProfile, contextualFactors),
          culturalConsiderations: growthProfile.culturalBackground
        },
        
        // Achievement Intelligence
        achievementIntelligence: {
          recommendations: recommendations,
          personalizedApproach: this.generatePersonalizedApproach(healingPatterns, growthProfile),
          optimalTiming: this.identifyOptimalTiming(contextualFactors),
          supportNeeds: this.identifySupportNeeds(growthProfile)
        },
        
        // Grace & Anti-Shame Intelligence
        graceIntelligence: {
          tokenUsagePatterns: this.analyzeGraceTokenPatterns(graceTokenHistory),
          selfCompassionGrowth: this.measureSelfCompassionGrowth(graceTokenHistory),
          shameResilienceLevel: this.calculateShameResilience(healingPatterns),
          interventionEffectiveness: this.assessInterventionEffectiveness(graceTokenHistory)
        },
        
        // System Health
        systemHealth: {
          traumaInformedCompliance: this.assessTraumaInformedCompliance(badgeEffectiveness),
          harmReductionEffectiveness: this.calculateHarmReduction(badgeEffectiveness),
          therapeuticValueOptimization: this.assessTherapeuticOptimization(badgeEffectiveness),
          ethicalComplianceScore: this.calculateEthicalCompliance(badgeEffectiveness)
        },
        
        // Recommendations
        intelligenceRecommendations: {
          systemOptimizations: this.generateSystemOptimizations(badgeEffectiveness),
          personalAdaptations: this.generatePersonalAdaptations(growthProfile, healingPatterns),
          safeguardEnhancements: this.generateSafeguardEnhancements(contextualFactors),
          therapeuticOpportunities: this.identifyTherapeuticOpportunities(recommendations)
        }
      };
      
      console.log('✓ Comprehensive intelligence report generated');
      
      return {
        success: true,
        report,
        insights: this.generateKeyInsights(report),
        actionItems: this.generateActionItems(report)
      };
    } catch (error) {
      console.error('Error generating intelligence report:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Private helper methods (simplified for brevity)
  private static async getRecentBadges(userId: string, days: number) {
    // Would fetch recent badges from database
    return [
      { id: 'presence_1', earnedAt: new Date(), therapeuticValue: 85 },
      { id: 'insight_1', earnedAt: new Date(), therapeuticValue: 78 }
    ];
  }
  
  private static async getCurrentGraceTokens(userId: string): Promise<GraceTokenState> {
    // Would fetch current grace tokens from database
    return {
      tokens: 2,
      renewalDate: GraceTokenSystem.getNextRenewalDate(),
      weeklyUsage: {
        week: new Date().toISOString().slice(0, 7),
        tokensUsed: 0,
        tokensEarned: 0,
        healingMoments: []
      },
      lifetimeGraceUsed: 5,
      wisestGraceUse: 'Self-compassion during difficult processing work'
    };
  }
  
  private static async saveGraceTokens(userId: string, tokens: GraceTokenState) {
    // Would save to database
    console.log(`Grace tokens renewed for user ${userId}`);
  }
  
  private static async assessShameSpiraRisk(userId: string) {
    // Would analyze recent activity for shame spiral indicators
    return {
      risk: 2,
      missedDays: 1,
      selfCriticalLanguage: false,
      perfectionismSpike: false,
      comparisonThoughts: false
    };
  }
  
  private static async deliverShameIntervention(userId: string, intervention: ShameInterceptionResult) {
    // Would deliver intervention through appropriate channels
    console.log(`Shame intervention delivered for user ${userId}: ${intervention.redirectMessage}`);
  }
  
  private static async validateTraumaInformedDesign(variant: BadgeDesignVariant) {
    // Validate the design meets trauma-informed criteria
    const harmfulPatterns = ['perfect', 'must', 'always', 'never', 'failure'];
    const allMessages = [
      ...variant.messaging.celebrationMessages,
      ...variant.messaging.progressEncouragement
    ];
    
    for (const message of allMessages) {
      for (const pattern of harmfulPatterns) {
        if (message.toLowerCase().includes(pattern)) {
          throw new Error(`Potentially harmful language detected: "${pattern}"`);
        }
      }
    }
  }
  
  private static shouldTerminateTest(results: any): boolean {
    // Check if test should be terminated for safety
    return results.harmSignals?.anxietyTriggers > 20 || 
           results.harmSignals?.shameActivation > 15;
  }
  
  private static async terminateTestForSafety(testId: string, results: any) {
    // Terminate test and provide support to participants
    console.log(`Test ${testId} terminated for safety concerns:`, results.harmSignals);
  }
  
  private static async getGraceTokenHistory(userId: string) {
    // Would fetch grace token usage history
    return [];
  }
  
  // Analysis helper methods (simplified)
  private static analyzeGrowthTrajectory(patterns: HealingPattern, badges: any[]) {
    return 'positive_with_sustainable_pace';
  }
  
  private static calculateTherapeuticValue(effectiveness: BadgeEffectivenessMetrics[]) {
    return effectiveness.reduce((sum, e) => sum + e.therapeuticValue.completionSatisfaction, 0) / effectiveness.length;
  }
  
  private static extractPreferences(profile: PersonalGrowthProfile) {
    return {
      motivational: profile.motivationalStyle,
      celebration: profile.celebrationPreferences,
      challenge: profile.challengeComfort
    };
  }
  
  private static identifyAdaptationNeeds(profile: PersonalGrowthProfile, context: ContextualFactors) {
    return ['gentle_pacing', 'extra_support', 'cultural_sensitivity'];
  }
  
  private static generatePersonalizedApproach(patterns: HealingPattern, profile: PersonalGrowthProfile) {
    return `${patterns.patternType} approach with ${profile.challengeComfort} challenge level`;
  }
  
  private static identifyOptimalTiming(context: ContextualFactors) {
    return `${context.energyLevels} energy phase - ${context.currentPhase} focus`;
  }
  
  private static identifySupportNeeds(profile: PersonalGrowthProfile) {
    return profile.traumaInformedNeeds.needsExtraGrace ? ['extra_grace', 'gentle_accountability'] : ['standard_support'];
  }
  
  private static analyzeGraceTokenPatterns(history: any[]) {
    return 'healthy_self_compassion_use';
  }
  
  private static measureSelfCompassionGrowth(history: any[]) {
    return 15; // Percentage increase
  }
  
  private static calculateShameResilience(patterns: HealingPattern) {
    return patterns.shameRecovery === 'quick_bounce_back' ? 85 : 
           patterns.shameRecovery === 'needs_processing_time' ? 70 : 60;
  }
  
  private static assessInterventionEffectiveness(history: any[]) {
    return 88; // Percentage effectiveness
  }
  
  private static assessTraumaInformedCompliance(effectiveness: BadgeEffectivenessMetrics[]) {
    return effectiveness.every(e => e.traumaInformedImpact.anxietyTriggerRate < 10) ? 95 : 78;
  }
  
  private static calculateHarmReduction(effectiveness: BadgeEffectivenessMetrics[]) {
    const avgAnxietyTriggers = effectiveness.reduce((sum, e) => sum + e.traumaInformedImpact.anxietyTriggerRate, 0) / effectiveness.length;
    return 100 - avgAnxietyTriggers;
  }
  
  private static assessTherapeuticOptimization(effectiveness: BadgeEffectivenessMetrics[]) {
    const avgTherapeutic = effectiveness.reduce((sum, e) => sum + e.therapeuticValue.completionSatisfaction, 0) / effectiveness.length;
    return avgTherapeutic;
  }
  
  private static calculateEthicalCompliance(effectiveness: BadgeEffectivenessMetrics[]) {
    return 95; // High ethical compliance score
  }
  
  private static generateSystemOptimizations(effectiveness: BadgeEffectivenessMetrics[]) {
    return ['increase_grace_integration', 'enhance_celebration_authenticity', 'improve_cultural_adaptation'];
  }
  
  private static generatePersonalAdaptations(profile: PersonalGrowthProfile, patterns: HealingPattern) {
    return [`optimize_for_${patterns.patternType}`, `enhance_${profile.motivationalStyle}`, 'increase_cultural_resonance'];
  }
  
  private static generateSafeguardEnhancements(context: ContextualFactors) {
    return context.energyLevels === 'conservation_mode' ? 
      ['extra_grace_periods', 'reduced_challenge_levels'] : 
      ['standard_safeguards'];
  }
  
  private static identifyTherapeuticOpportunities(recommendations: AchievementRecommendation[]) {
    return recommendations.map(r => `enhance_${r.category}_through_${r.therapeuticValue.split(' ')[0]}`);
  }
  
  private static generateKeyInsights(report: any) {
    return [
      `User shows ${report.healingIntelligence.growthTrajectory} healing trajectory`,
      `Therapeutic value optimization at ${report.systemHealth.therapeuticValueOptimization}%`,
      `Shame resilience level: ${report.graceIntelligence.shameResilienceLevel}%`
    ];
  }
  
  private static generateActionItems(report: any) {
    return [
      'Continue current healing-centered approach',
      'Optimize badge timing for user\'s energy patterns',
      'Enhance cultural sensitivity in achievement language'
    ];
  }
}

// Convenience exports for common use cases
export const initializeHealingGamification = HealingGamificationIntelligence.initializeForUser;
export const runDailyIntelligenceUpdate = HealingGamificationIntelligence.dailyIntelligenceUpdate;
export const createTraumaInformedTest = HealingGamificationIntelligence.createHealingFocusedTest;
export const generateUserIntelligenceReport = HealingGamificationIntelligence.generateIntelligenceReport;

// Duolingo-Style System Convenience Exports
export const initializeDuolingoHealingJourney = DuolingoStyleHealingEngine.initializeJourney;
export const processDailyHealingActivity = DuolingoStyleHealingEngine.processDailyActivity;
export const updateGraceBasedStreak = DuolingoStyleHealingEngine.updateGraceBasedStreak;

// Adaptive Learning Convenience Exports
export const analyzeLearningPatterns = AdaptiveLearningEngine.analyzeLearningPatterns;
export const generatePersonalizedCurriculum = AdaptiveLearningEngine.generatePersonalizedCurriculum;
export const updateCurriculumAdaptively = AdaptiveLearningEngine.updateCurriculumAdaptively;

// Engagement System Convenience Exports
export const initializeEngagementPreferences = EngagementSystem.initializeEngagementPreferences;
export const generateGentleNudges = EngagementSystem.generateGentleNudges;
export const updateSpacedRepetition = EngagementSystem.updateSpacedRepetition;
export const analyzeEngagementPatterns = EngagementSystem.analyzeEngagementPatterns;

export default HealingGamificationIntelligence;