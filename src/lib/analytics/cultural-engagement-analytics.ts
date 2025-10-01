/**
 * ALCHM Cultural Engagement Analytics
 * 
 * Philosophy: "Data tells stories, but culture gives those stories meaning.
 * We measure engagement through cultural lenses, not universal assumptions."
 * 
 * This analytics system:
 * - Recognizes different cultural patterns of engagement
 * - Avoids pathologizing cultural communication styles
 * - Measures success through culturally-informed metrics
 * - Protects marginalized users from algorithmic bias
 * - Centers community-defined wellness outcomes
 */

import { logEvent } from '@/lib/analytics';

export interface CulturalAnalyticsContext {
  userId: string;
  culturalBackground: string[];
  lgbtqIdentity?: boolean;
  neurodivergent?: boolean;
  immigrantStatus?: 'typeof window !== 'undefined' && documented' | 'untypeof window !== 'undefined' && documented' | 'mixed_status' | 'prefer_not_to_say';
  communityOrientation: 'individual' | 'collective' | 'balanced';
  healingApproaches: string[];
  safetyNeeds: {
    familyAcceptance: 'supportive' | 'mixed' | 'rejecting' | 'unknown';
    needsPrivacyProtection: boolean;
    culturalStigmaAwareness: boolean;
  };
  communicationStyle: {
    directness: number; // 0-1 scale
    storytelling: number; // preference for narrative vs direct communication
    silence_comfort: number; // comfort with reflection time
    community_processing: number; // preference for collective vs individual processing
  };
}

export interface CulturalEngagementMetrics {
  // Traditional metrics (culturally adjusted)
  session_duration_cultural_adjusted: number;
  entries_per_week_cultural_normal: number;
  streak_patterns_with_cultural_context: {
    length: number;
    cultural_appropriateness: 'aligned' | 'pressured' | 'sustainable';
    respects_cultural_cycles: boolean;
  };
  
  // Culturally-informed metrics
  cultural_authenticity_expression: number; // 0-1 scale
  identity_affirmation_moments: number;
  cultural_healing_integration: number;
  community_connection_strength: number;
  intergenerational_wisdom_access: number;
  cultural_safety_maintained: boolean;
  
  // Intersectional wellbeing indicators
  intersectional_stress_recognition: number;
  systemic_trauma_acknowledgment: number;
  cultural_pride_development: number;
  code_switching_fatigue_awareness: number;
  chosen_family_support_access: number;
  
  // Anti-oppression metrics
  microaggression_processing_support: number;
  cultural_gaslighting_resistance: number;
  internalized_oppression_healing: number;
  cultural_strengths_recognition: number;
}

export interface CulturalAnalyticsEvent {
  event_type: 'cultural_engagement' | 'cultural_expression' | 'cultural_healing' | 'cultural_safety';
  user_context: CulturalAnalyticsContext;
  cultural_significance: 'low' | 'medium' | 'high' | 'sacred';
  community_impact?: 'individual' | 'family' | 'chosen_family' | 'cultural_community' | 'broader_society';
  healing_tradition_honored?: string;
  cultural_wisdom_accessed?: boolean;
  identity_affirmed?: string[];
  systemic_factors_acknowledged?: boolean;
}

class CulturalEngagementAnalyticsEngine {
  private culturalBenchmarks: Map<string, any> = new Map();
  private intersectionalPatterns: Map<string, any> = new Map();
  
  constructor() {
    this.initializeCulturalBenchmarks();
  }
  
  /**
   * Initialize culturally-informed engagement benchmarks
   */
  private initializeCulturalBenchmarks(): void {
    // Different cultural baselines for healthy engagement
    this.culturalBenchmarks.set('collectivist_high_context', {
      expected_session_duration: 25, // Longer reflection time
      healthy_entry_frequency: 3, // per week, allowing for community processing time
      storytelling_preference: 0.8,
      silence_comfort: 0.9,
      family_integration_importance: 0.8
    });
    
    this.culturalBenchmarks.set('individualist_direct', {
      expected_session_duration: 15, // More focused sessions
      healthy_entry_frequency: 5, // per week, higher frequency preference
      storytelling_preference: 0.4,
      silence_comfort: 0.5,
      family_integration_importance: 0.3
    });
    
    this.culturalBenchmarks.set('multicultural_adaptive', {
      expected_session_duration: 20, // Variable based on context
      healthy_entry_frequency: 4, // per week
      storytelling_preference: 0.6,
      silence_comfort: 0.7,
      family_integration_importance: 0.6,
      code_switching_awareness: 0.9
    });
    
    this.culturalBenchmarks.set('indigenous_land_connected', {
      expected_session_duration: 30, // Longer for land-based reflection
      healthy_entry_frequency: 2, // per week, seasonal awareness
      storytelling_preference: 0.9,
      silence_comfort: 1.0,
      seasonal_awareness: 0.9,
      ancestral_connection_importance: 0.9
    });
  }
  
  /**
   * Analyze user engagement through cultural lens
   */
  async analyzeCulturalEngagement(
    userId: string,
    context: CulturalAnalyticsContext,
    recentActivity: any
  ): Promise<CulturalEngagementMetrics> {
    const culturalPattern = this.identifyPrimaryCulturalPattern(context);
    const benchmark = this.culturalBenchmarks.get(culturalPattern) || this.culturalBenchmarks.get('individualist_direct');
    
    // Analyze traditional metrics with cultural adjustments
    const culturallyAdjustedDuration = this.adjustSessionDurationForCulture(
      recentActivity.avg_session_duration,
      benchmark.expected_session_duration,
      context
    );
    
    const culturallyNormalFrequency = this.assessFrequencyWithCulturalNorms(
      recentActivity.entries_per_week,
      benchmark.healthy_entry_frequency,
      context
    );
    
    const streakPatterns = this.analyzeStreaksWithCulturalContext(
      recentActivity.streak_data,
      context
    );
    
    // Analyze culturally-informed metrics
    const culturalAuthenticity = await this.measureCulturalAuthenticityExpression(
      userId,
      recentActivity.entry_content,
      context
    );
    
    const identityAffirmation = await this.trackIdentityAffirmationMoments(
      recentActivity.entry_content,
      context
    );
    
    const culturalHealingIntegration = await this.assessCulturalHealingIntegration(
      recentActivity.entry_content,
      context.healingApproaches,
      context
    );
    
    // Analyze intersectional wellbeing
    const intersectionalMetrics = await this.analyzeIntersectionalWellbeing(
      userId,
      recentActivity,
      context
    );
    
    // Analyze anti-oppression metrics
    const antiOppressionMetrics = await this.analyzeAntiOppressionHealing(
      recentActivity.entry_content,
      context
    );
    
    return {
      session_duration_cultural_adjusted: culturallyAdjustedDuration,
      entries_per_week_cultural_normal: culturallyNormalFrequency,
      streak_patterns_with_cultural_context: streakPatterns,
      cultural_authenticity_expression: culturalAuthenticity,
      identity_affirmation_moments: identityAffirmation,
      cultural_healing_integration: culturalHealingIntegration,
      community_connection_strength: intersectionalMetrics.community_connection,
      intergenerational_wisdom_access: intersectionalMetrics.intergenerational_wisdom,
      cultural_safety_maintained: intersectionalMetrics.cultural_safety,
      intersectional_stress_recognition: intersectionalMetrics.intersectional_stress,
      systemic_trauma_acknowledgment: intersectionalMetrics.systemic_trauma,
      cultural_pride_development: intersectionalMetrics.cultural_pride,
      code_switching_fatigue_awareness: intersectionalMetrics.code_switching_fatigue,
      chosen_family_support_access: intersectionalMetrics.chosen_family_support,
      microaggression_processing_support: antiOppressionMetrics.microaggression_processing,
      cultural_gaslighting_resistance: antiOppressionMetrics.gaslighting_resistance,
      internalized_oppression_healing: antiOppressionMetrics.internalized_oppression_healing,
      cultural_strengths_recognition: antiOppressionMetrics.cultural_strengths_recognition
    };
  }
  
  /**
   * Track culturally-significant events
   */
  async trackCulturalEvent(event: CulturalAnalyticsEvent): Promise<void> {
    // Add cultural context to event
    const enrichedEvent = {
      ...event,
      timestamp: Date.now(),
      cultural_pattern: this.identifyPrimaryCulturalPattern(event.user_context),
      intersectional_identities: this.getIntersectionalIdentities(event.user_context),
      safety_level: this.assessCulturalSafetyLevel(event.user_context),
      community_impact_level: event.community_impact || 'individual'
    };
    
    // Log with cultural sensitivity
    await logEvent('cultural_engagement', enrichedEvent);
    
    // Track patterns for cultural insights (aggregated, anonymized)
    this.updateCulturalPatterns(enrichedEvent);
  }
  
  /**
   * Generate culturally-informed engagement insights
   */
  async generateCulturalInsights(
    metrics: CulturalEngagementMetrics,
    context: CulturalAnalyticsContext
  ): Promise<{
    strengths: string[];
    growth_areas: string[];
    cultural_affirmations: string[];
    community_connections: string[];
    healing_recommendations: string[];
  }> {
    const insights = {
      strengths: [],
      growth_areas: [],
      cultural_affirmations: [],
      community_connections: [],
      healing_recommendations: []
    } as any;
    
    // Identify cultural strengths
    if (metrics.cultural_authenticity_expression > 0.7) {
      insights.strengths.push("You're expressing your authentic cultural self with courage and clarity");
    }
    
    if (metrics.identity_affirmation_moments > 3) {
      insights.strengths.push("You're consistently affirming and celebrating your identity");
    }
    
    if (metrics.community_connection_strength > 0.6) {
      insights.strengths.push("Your healing work is contributing to community strength");
    }
    
    // Cultural affirmations based on identity
    if (context.lgbtqIdentity) {
      insights.cultural_affirmations.push("Your queer identity is a source of wisdom and strength");
      if (metrics.chosen_family_support_access > 0.5) {
        insights.cultural_affirmations.push("You're building chosen family connections that honor your authentic self");
      }
    }
    
    if (context.culturalBackground.includes('african_diaspora')) {
      insights.cultural_affirmations.push("You carry the resilience and wisdom of your ancestors");
      if (metrics.intergenerational_wisdom_access > 0.6) {
        insights.cultural_affirmations.push("You're connecting with ancestral strength and cultural wisdom");
      }
    }
    
    if (context.culturalBackground.includes('multicultural')) {
      insights.cultural_affirmations.push("Your multicultural identity is a bridge between worlds");
      if (metrics.code_switching_fatigue_awareness > 0.5) {
        insights.growth_areas.push("Consider exploring support for code-switching fatigue and identity navigation");
      }
    }
    
    // Culturally-appropriate growth suggestions
    if (metrics.cultural_healing_integration < 0.4) {
      insights.growth_areas.push("Explore integrating more of your cultural healing traditions into your practice");
    }
    
    if (metrics.systemic_trauma_acknowledgment < 0.3 && this.hasSystemicTraumaRisk(context)) {
      insights.growth_areas.push("Consider exploring how systemic factors impact your wellbeing");
    }
    
    // Community connection suggestions
    if (context.communityOrientation === 'collective' && metrics.community_connection_strength < 0.5) {
      insights.community_connections.push("Explore ways to connect your healing with community wellbeing");
    }
    
    // Healing recommendations based on cultural background
    insights.healing_recommendations = this.generateCulturalHealingRecommendations(context, metrics);
    
    return insights;
  }
  
  /**
   * Identify primary cultural engagement pattern
   */
  private identifyPrimaryCulturalPattern(context: CulturalAnalyticsContext): string {
    if (context.culturalBackground.includes('indigenous') || 
        context.healingApproaches.includes('land_based')) {
      return 'indigenous_land_connected';
    }
    
    if (context.culturalBackground.length > 1 || 
        context.culturalBackground.includes('multicultural')) {
      return 'multicultural_adaptive';
    }
    
    if (context.communityOrientation === 'collective' || 
        context.communicationStyle.directness < 0.5) {
      return 'collectivist_high_context';
    }
    
    return 'individualist_direct';
  }
  
  /**
   * Adjust session duration expectations for cultural context
   */
  private adjustSessionDurationForCulture(
    actualDuration: number,
    expectedDuration: number,
    context: CulturalAnalyticsContext
  ): number {
    let adjustedScore = actualDuration / expectedDuration;
    
    // Adjust for storytelling preference
    if (context.communicationStyle.storytelling > 0.7 && actualDuration > expectedDuration * 0.8) {
      adjustedScore *= 1.2; // Longer sessions are culturally appropriate
    }
    
    // Adjust for silence comfort
    if (context.communicationStyle.silence_comfort > 0.7 && actualDuration > expectedDuration) {
      adjustedScore *= 1.1; // Reflection time is culturally valued
    }
    
    return Math.min(adjustedScore, 1.0);
  }
  
  /**
   * Assess frequency with cultural norms
   */
  private assessFrequencyWithCulturalNorms(
    actualFrequency: number,
    expectedFrequency: number,
    context: CulturalAnalyticsContext
  ): number {
    let adjustedScore = actualFrequency / expectedFrequency;
    
    // Adjust for community processing preferences
    if (context.communicationStyle.community_processing > 0.7 && actualFrequency < expectedFrequency) {
      adjustedScore *= 1.2; // Lower frequency may be appropriate for community-oriented processing
    }
    
    // Adjust for safety needs
    if (context.safetyNeeds.needsPrivacyProtection && actualFrequency < expectedFrequency) {
      adjustedScore *= 1.3; // Lower frequency may indicate safety-conscious engagement
    }
    
    return Math.min(adjustedScore, 1.0);
  }
  
  /**
   * Analyze streaks with cultural context
   */
  private analyzeStreaksWithCulturalContext(streakData: any, context: CulturalAnalyticsContext): any {
    const culturalAppropriateness = this.assessStreakCulturalAppropriateness(streakData, context);
    const respectsCulturalCycles = this.assessCulturalCycleRespect(streakData, context);
    
    return {
      length: streakData.current_streak || 0,
      cultural_appropriateness: culturalAppropriateness,
      respects_cultural_cycles: respectsCulturalCycles
    };
  }
  
  private assessStreakCulturalAppropriateness(streakData: any, context: CulturalAnalyticsContext): string {
    // Avoid pathologizing cultural patterns of engagement
    if (context.culturalBackground.includes('indigenous') && streakData.seasonal_variation > 0.3) {
      return 'aligned'; // Seasonal variation is culturally appropriate
    }
    
    if (context.safetyNeeds.familyAcceptance === 'rejecting' && streakData.consistency < 0.5) {
      return 'aligned'; // Inconsistency may indicate safety-conscious engagement
    }
    
    if (streakData.pressure_indicators > 0.7) {
      return 'pressured'; // High pressure indicates unhealthy engagement
    }
    
    return 'sustainable';
  }
  
  private assessCulturalCycleRespect(streakData: any, context: CulturalAnalyticsContext): boolean {
    // Check if engagement respects cultural cycles and rhythms
    if (context.culturalBackground.includes('indigenous')) {
      return streakData.seasonal_awareness > 0.5;
    }
    
    if (context.healingApproaches.includes('community_centered')) {
      return streakData.community_event_awareness > 0.3;
    }
    
    return true; // Default to respectful if no specific cycles identified
  }
  
  /**
   * Measure cultural authenticity expression
   */
  private async measureCulturalAuthenticityExpression(
    userId: string,
    entryContent: string[],
    context: CulturalAnalyticsContext
  ): Promise<number> {
    let authenticityScore = 0;
    let totalEntries = entryContent.length;
    
    if (totalEntries === 0) return 0;
    
    for (const content of entryContent) {
      const lowerContent = content.toLowerCase();
      
      // Check for cultural identity expression
      if (context.culturalBackground.some(culture => 
        lowerContent.includes(culture) || 
        lowerContent.includes('my culture') ||
        lowerContent.includes('heritage'))) {
        authenticityScore += 0.3;
      }
      
      // Check for language integration
      if (context.culturalBackground.includes('multicultural') && 
          (lowerContent.includes('language') || lowerContent.includes('bilingual'))) {
        authenticityScore += 0.2;
      }
      
      // Check for healing tradition integration
      if (context.healingApproaches.some(approach => lowerContent.includes(approach))) {
        authenticityScore += 0.2;
      }
      
      // Check for identity affirmation
      if (lowerContent.includes('proud') || 
          lowerContent.includes('authentic') || 
          lowerContent.includes('true self')) {
        authenticityScore += 0.3;
      }
    }
    
    return Math.min(authenticityScore / totalEntries, 1.0);
  }
  
  /**
   * Track identity affirmation moments
   */
  private async trackIdentityAffirmationMoments(
    entryContent: string[],
    context: CulturalAnalyticsContext
  ): Promise<number> {
    let affirmationCount = 0;
    
    const affirmationKeywords = [
      'proud', 'celebrate', 'love myself', 'authentic', 'true to myself',
      'my identity', 'who I am', 'self-acceptance', 'embracing',
      'honoring my', 'cultural pride', 'identity strength'
    ];
    
    for (const content of entryContent) {
      const lowerContent = content.toLowerCase();
      
      affirmationCount += affirmationKeywords.reduce((count, keyword) => {
        return count + (lowerContent.includes(keyword) ? 1 : 0);
      }, 0);
    }
    
    return affirmationCount;
  }
  
  /**
   * Assess cultural healing integration
   */
  private async assessCulturalHealingIntegration(
    entryContent: string[],
    healingApproaches: string[],
    context: CulturalAnalyticsContext
  ): Promise<number> {
    let integrationScore = 0;
    let totalEntries = entryContent.length;
    
    if (totalEntries === 0) return 0;
    
    const culturalHealingKeywords = {
      'community_centered': ['community', 'family', 'together', 'support', 'circle'],
      'ancestral': ['ancestors', 'elders', 'wisdom', 'lineage', 'generations'],
      'somatic': ['body', 'breath', 'movement', 'sensation', 'embodied'],
      'land_based': ['nature', 'earth', 'seasons', 'land', 'natural'],
      'ritual': ['ritual', 'ceremony', 'sacred', 'practice', 'tradition'],
      'storytelling': ['story', 'narrative', 'telling', 'sharing', 'experience']
    };
    
    for (const content of entryContent) {
      const lowerContent = content.toLowerCase();
      
      for (const approach of healingApproaches) {
        const keywords = culturalHealingKeywords[approach as keyof typeof culturalHealingKeywords] || [];
        const hasKeywords = keywords.some(keyword => lowerContent.includes(keyword));
        
        if (hasKeywords) {
          integrationScore += 0.2;
        }
      }
    }
    
    return Math.min(integrationScore / totalEntries, 1.0);
  }
  
  /**
   * Analyze intersectional wellbeing indicators
   */
  private async analyzeIntersectionalWellbeing(
    userId: string,
    recentActivity: any,
    context: CulturalAnalyticsContext
  ): Promise<any> {
    const metrics = {
      community_connection: 0,
      intergenerational_wisdom: 0,
      cultural_safety: true,
      intersectional_stress: 0,
      systemic_trauma: 0,
      cultural_pride: 0,
      code_switching_fatigue: 0,
      chosen_family_support: 0
    };
    
    // Analyze each metric based on entry content and context
    // This would involve more sophisticated NLP and pattern recognition
    
    return metrics;
  }
  
  /**
   * Analyze anti-oppression healing metrics
   */
  private async analyzeAntiOppressionHealing(
    entryContent: string[],
    context: CulturalAnalyticsContext
  ): Promise<any> {
    return {
      microaggression_processing: 0,
      gaslighting_resistance: 0,
      internalized_oppression_healing: 0,
      cultural_strengths_recognition: 0
    };
  }
  
  /**
   * Generate cultural healing recommendations
   */
  private generateCulturalHealingRecommendations(
    context: CulturalAnalyticsContext,
    metrics: CulturalEngagementMetrics
  ): string[] {
    const recommendations = [];
    
    // Based on cultural background
    if (context.culturalBackground.includes('african_diaspora')) {
      recommendations.push("Explore ancestral strength practices");
      recommendations.push("Consider Ubuntu-based community healing");
    }
    
    if (context.culturalBackground.includes('indigenous')) {
      recommendations.push("Honor seasonal cycles in your healing");
      recommendations.push("Consider land-based healing practices");
    }
    
    if (context.lgbtqIdentity) {
      recommendations.push("Celebrate queer joy and resilience");
      recommendations.push("Connect with chosen family support");
    }
    
    return recommendations;
  }
  
  private getIntersectionalIdentities(context: CulturalAnalyticsContext): string[] {
    const identities = [...context.culturalBackground];
    
    if (context.lgbtqIdentity) identities.push('lgbtq');
    if (context.neurodivergent) identities.push('neurodivergent');
    if (context.immigrantStatus && context.immigrantStatus !== 'prefer_not_to_say') {
      identities.push(`immigrant_${context.immigrantStatus}`);
    }
    
    return identities;
  }
  
  private assessCulturalSafetyLevel(context: CulturalAnalyticsContext): 'high' | 'medium' | 'low' {
    if (context.safetyNeeds.familyAcceptance === 'rejecting' || 
        context.safetyNeeds.needsPrivacyProtection) {
      return 'low';
    }
    
    if (context.safetyNeeds.familyAcceptance === 'mixed' || 
        context.safetyNeeds.culturalStigmaAwareness) {
      return 'medium';
    }
    
    return 'high';
  }
  
  private hasSystemicTraumaRisk(context: CulturalAnalyticsContext): boolean {
    return context.lgbtqIdentity || 
           context.culturalBackground.some(bg => ['african_diaspora', 'indigenous', 'immigrant'].includes(bg)) ||
           context.immigrantStatus === 'untypeof window !== 'undefined' && documented';
  }
  
  private updateCulturalPatterns(event: any): void {
    // Update aggregated cultural patterns for insights
    // This would be implemented with privacy-preserving techniques
  }
}

// Export singleton instance
export const culturalEngagementAnalytics = new CulturalEngagementAnalyticsEngine();

/**
 * Convenience functions for tracking cultural events
 */
export async function trackCulturalExpression(
  context: CulturalAnalyticsContext,
  expressionType: string,
  culturalSignificance: 'low' | 'medium' | 'high' | 'sacred'
): Promise<void> {
  await culturalEngagementAnalytics.trackCulturalEvent({
    event_type: 'cultural_expression',
    user_context: context,
    cultural_significance: culturalSignificance,
    identity_affirmed: [expressionType]
  });
}

export async function trackCulturalHealing(
  context: CulturalAnalyticsContext,
  healingTradition: string,
  communityImpact?: string
): Promise<void> {
  await culturalEngagementAnalytics.trackCulturalEvent({
    event_type: 'cultural_healing',
    user_context: context,
    cultural_significance: 'high',
    healing_tradition_honored: healingTradition,
    community_impact: communityImpact as any
  });
}

export async function trackCulturalSafety(
  context: CulturalAnalyticsContext,
  safetyLevel: 'maintained' | 'challenged' | 'restored'
): Promise<void> {
  await culturalEngagementAnalytics.trackCulturalEvent({
    event_type: 'cultural_safety',
    user_context: context,
    cultural_significance: 'high',
    cultural_wisdom_accessed: safetyLevel === 'restored'
  });
}