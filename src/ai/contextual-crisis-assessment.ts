/**
 * Contextual Crisis Assessment Engine
 * 
 * Holistic evaluation system that considers:
 * - User's complete emotional history
 * - Cultural and identity contexts
 * - Trauma patterns and triggers
 * - Current life circumstances
 * - Social support systems
 * - Previous crisis resolutions
 * 
 * Provides nuanced understanding beyond individual incidents
 */

import { CrisisPattern, CrisisHistory } from './advanced-crisis-pattern-recognition';
import { KheperaCrisisResponse } from './khepera-crisis-response-system';

interface ContextualAssessment {
  overallRiskLevel: 'minimal' | 'low' | 'moderate' | 'high' | 'critical';
  confidenceScore: number;
  primaryConcerns: string[];
  protectiveFactors: string[];
  riskFactors: string[];
  culturalConsiderations: string[];
  traumaInformedRecommendations: string[];
  immediateSafetyNeeds: boolean;
  followUpTimeframe: 'immediate' | '24_hours' | '72_hours' | 'weekly' | 'monthly';
}

interface UserContext {
  demographics: {
    age?: number;
    location?: string;
    culturalBackground: string[];
    identityFactors: string[];
    languagePreferences: string[];
  };
  mentalHealthHistory: {
    previousDiagnoses?: string[];
    medicationHistory?: string[];
    therapyExperience?: string[];
    hospitalizations?: number;
    traumaHistory?: TraumaHistory;
  };
  socialContext: {
    supportSystemStrength: 'strong' | 'moderate' | 'weak' | 'isolated';
    familySupport: 'supportive' | 'neutral' | 'unsupportive' | 'abusive';
    peerConnections: number;
    professionalSupport: boolean;
    communityInvolvement: 'high' | 'moderate' | 'low' | 'none';
  };
  currentStressors: {
    financial: 'severe' | 'moderate' | 'mild' | 'none';
    relationship: 'severe' | 'moderate' | 'mild' | 'none';
    health: 'severe' | 'moderate' | 'mild' | 'none';
    work_school: 'severe' | 'moderate' | 'mild' | 'none';
    legal: 'severe' | 'moderate' | 'mild' | 'none';
    housing: 'severe' | 'moderate' | 'mild' | 'none';
  };
  copingStrategies: {
    healthy: string[];
    unhealthy: string[];
    effectiveness: 'high' | 'moderate' | 'low';
  };
  journalPatterns: {
    frequency: 'daily' | 'weekly' | 'sporadic' | 'crisis_only';
    emotionalTrends: EmotionalTrend[];
    triggerPatterns: string[];
    growthIndicators: string[];
  };
}

interface TraumaHistory {
  types: ('childhood' | 'sexual' | 'domestic_violence' | 'war' | 'medical' | 'loss' | 'discrimination' | 'systemic')[];
  timeframes: string[];
  treatmentStatus: 'untreated' | 'in_treatment' | 'past_treatment' | 'resolved';
  currentImpact: 'severe' | 'moderate' | 'mild' | 'minimal';
}

interface EmotionalTrend {
  timeframe: 'week' | 'month' | 'quarter';
  direction: 'improving' | 'stable' | 'declining' | 'volatile';
  averageMood: number; // 1-10 scale
  crisisFrequency: number;
  resilienceMarkers: string[];
}

interface LifeCircumstance {
  category: 'relationship' | 'health' | 'finance' | 'work' | 'family' | 'identity' | 'spiritual';
  status: 'crisis' | 'stress' | 'stable' | 'positive';
  impact: 'severe' | 'moderate' | 'mild';
  duration: 'acute' | 'chronic' | 'episodic';
  supportAvailable: boolean;
}

class ContextualCrisisAssessment {
  private riskFactorWeights: Map<string, number> = new Map();
  private protectiveFactorWeights: Map<string, number> = new Map();
  private culturalRiskModifiers: Map<string, number> = new Map();
  private traumaImpactModifiers: Map<string, number> = new Map();

  constructor() {
    this.initializeWeights();
  }

  private initializeWeights(): void {
    // Risk Factor Weights (higher = more concerning)
    this.riskFactorWeights.set('previous_suicide_attempt', 0.8);
    this.riskFactorWeights.set('family_suicide_history', 0.6);
    this.riskFactorWeights.set('substance_abuse', 0.7);
    this.riskFactorWeights.set('social_isolation', 0.6);
    this.riskFactorWeights.set('recent_loss', 0.5);
    this.riskFactorWeights.set('chronic_illness', 0.4);
    this.riskFactorWeights.set('unemployment', 0.3);
    this.riskFactorWeights.set('financial_crisis', 0.4);
    this.riskFactorWeights.set('relationship_breakdown', 0.4);
    this.riskFactorWeights.set('legal_problems', 0.3);
    this.riskFactorWeights.set('housing_instability', 0.5);
    this.riskFactorWeights.set('discrimination_ongoing', 0.4);
    this.riskFactorWeights.set('untreated_trauma', 0.6);
    this.riskFactorWeights.set('medication_noncompliance', 0.5);

    // Protective Factor Weights (higher = more protective)
    this.protectiveFactorWeights.set('strong_support_system', 0.7);
    this.protectiveFactorWeights.set('therapeutic_relationship', 0.6);
    this.protectiveFactorWeights.set('spiritual_practice', 0.4);
    this.protectiveFactorWeights.set('stable_housing', 0.5);
    this.protectiveFactorWeights.set('meaningful_work', 0.4);
    this.protectiveFactorWeights.set('healthy_coping_skills', 0.6);
    this.protectiveFactorWeights.set('cultural_connection', 0.5);
    this.protectiveFactorWeights.set('future_goals', 0.5);
    this.protectiveFactorWeights.set('children_dependents', 0.6);
    this.protectiveFactorWeights.set('pet_companion', 0.3);
    this.protectiveFactorWeights.set('creative_expression', 0.4);
    this.protectiveFactorWeights.set('physical_activity', 0.3);

    // Cultural Risk Modifiers
    this.culturalRiskModifiers.set('stigma_high_culture', 0.3);
    this.culturalRiskModifiers.set('collectivist_shame', 0.2);
    this.culturalRiskModifiers.set('language_barrier', 0.3);
    this.culturalRiskModifiers.set('immigration_stress', 0.4);
    this.culturalRiskModifiers.set('identity_conflict', 0.4);

    // Trauma Impact Modifiers
    this.traumaImpactModifiers.set('childhood_trauma', 0.6);
    this.traumaImpactModifiers.set('complex_trauma', 0.7);
    this.traumaImpactModifiers.set('recent_trauma', 0.5);
    this.traumaImpactModifiers.set('unresolved_trauma', 0.6);
    this.traumaImpactModifiers.set('retraumatization', 0.8);
  }

  /**
   * Comprehensive assessment considering all contextual factors
   */
  async assessCrisisContext(
    patterns: CrisisPattern[],
    userContext: UserContext,
    currentCircumstances: LifeCircumstance[]
  ): Promise<ContextualAssessment> {
    
    // Calculate base risk from crisis patterns
    const patternRisk = this.calculatePatternRisk(patterns);
    
    // Assess contextual factors
    const riskFactors = this.identifyRiskFactors(userContext, currentCircumstances);
    const protectiveFactors = this.identifyProtectiveFactors(userContext);
    const culturalFactors = this.assessCulturalContext(userContext);
    const traumaFactors = this.assessTraumaImpact(userContext);
    
    // Calculate weighted risk score
    const riskScore = this.calculateWeightedRisk(
      patternRisk,
      riskFactors,
      protectiveFactors,
      culturalFactors,
      traumaFactors
    );
    
    const overallRiskLevel = this.determineRiskLevel(riskScore);
    const confidenceScore = this.calculateConfidence(userContext, patterns);
    
    return {
      overallRiskLevel,
      confidenceScore,
      primaryConcerns: this.identifyPrimaryConcerns(patterns, riskFactors),
      protectiveFactors: protectiveFactors.map(factor => factor.description),
      riskFactors: riskFactors.map(factor => factor.description),
      culturalConsiderations: this.generateCulturalConsiderations(userContext),
      traumaInformedRecommendations: this.generateTraumaInformedRecommendations(userContext, overallRiskLevel),
      immediateSafetyNeeds: this.assessImmediateSafety(patterns, riskScore),
      followUpTimeframe: this.determineFollowUpTimeframe(overallRiskLevel, patterns)
    };
  }

  private calculatePatternRisk(patterns: CrisisPattern[]): number {
    if (patterns.length === 0) return 0;

    const severityWeights = { critical: 1.0, high: 0.8, moderate: 0.5, low: 0.2 };
    const typeWeights = { direct: 1.0, indirect: 0.8, escalation: 0.9, trauma_response: 0.6, cultural: 0.5, intersectional: 0.7 };

    let totalRisk = 0;
    let weightSum = 0;

    for (const pattern of patterns) {
      const severityWeight = severityWeights[pattern.severity];
      const typeWeight = typeWeights[pattern.type];
      const weight = severityWeight * typeWeight * pattern.confidence;
      
      totalRisk += weight;
      weightSum += 1;
    }

    return weightSum > 0 ? totalRisk / weightSum : 0;
  }

  private identifyRiskFactors(userContext: UserContext, circumstances: LifeCircumstance[]): Array<{description: string, weight: number}> {
    const riskFactors: Array<{description: string, weight: number}> = [];

    // Social context risks
    if (userContext.socialContext.supportSystemStrength === 'isolated') {
      riskFactors.push({
        description: 'Social isolation and lack of support system',
        weight: this.riskFactorWeights.get('social_isolation') || 0.6
      });
    }

    if (userContext.socialContext.familySupport === 'abusive') {
      riskFactors.push({
        description: 'Abusive family environment',
        weight: 0.7
      });
    }

    // Mental health history risks
    if (userContext.mentalHealthHistory.hospitalizations && userContext.mentalHealthHistory.hospitalizations > 0) {
      riskFactors.push({
        description: 'Previous psychiatric hospitalizations',
        weight: this.riskFactorWeights.get('previous_suicide_attempt') || 0.8
      });
    }

    if (userContext.mentalHealthHistory.traumaHistory?.treatmentStatus === 'untreated') {
      riskFactors.push({
        description: 'Untreated trauma history',
        weight: this.riskFactorWeights.get('untreated_trauma') || 0.6
      });
    }

    // Current stressor risks
    Object.entries(userContext.currentStressors).forEach(([stressor, severity]) => {
      if (severity === 'severe') {
        const weight = this.riskFactorWeights.get(`${stressor}_crisis`) || 0.4;
        riskFactors.push({
          description: `Severe ${stressor.replace('_', ' ')} stress`,
          weight
        });
      }
    });

    // Life circumstance risks
    circumstances.forEach(circumstance => {
      if (circumstance.status === 'crisis' && circumstance.impact === 'severe') {
        riskFactors.push({
          description: `Crisis in ${circumstance.category} domain`,
          weight: 0.5
        });
      }
    });

    // Coping strategy risks
    if (userContext.copingStrategies.effectiveness === 'low') {
      riskFactors.push({
        description: 'Ineffective coping strategies',
        weight: 0.4
      });
    }

    if (userContext.copingStrategies.unhealthy.length > userContext.copingStrategies.healthy.length) {
      riskFactors.push({
        description: 'Predominantly unhealthy coping mechanisms',
        weight: 0.5
      });
    }

    return riskFactors;
  }

  private identifyProtectiveFactors(userContext: UserContext): Array<{description: string, weight: number}> {
    const protectiveFactors: Array<{description: string, weight: number}> = [];

    // Social support
    if (userContext.socialContext.supportSystemStrength === 'strong') {
      protectiveFactors.push({
        description: 'Strong social support system',
        weight: this.protectiveFactorWeights.get('strong_support_system') || 0.7
      });
    }

    if (userContext.socialContext.professionalSupport) {
      protectiveFactors.push({
        description: 'Active professional therapeutic support',
        weight: this.protectiveFactorWeights.get('therapeutic_relationship') || 0.6
      });
    }

    // Coping resources
    if (userContext.copingStrategies.healthy.length >= 3) {
      protectiveFactors.push({
        description: 'Multiple healthy coping strategies',
        weight: this.protectiveFactorWeights.get('healthy_coping_skills') || 0.6
      });
    }

    // Stability factors
    if (userContext.currentStressors.housing === 'none') {
      protectiveFactors.push({
        description: 'Stable housing situation',
        weight: this.protectiveFactorWeights.get('stable_housing') || 0.5
      });
    }

    // Cultural connections
    if (userContext.socialContext.communityInvolvement === 'high') {
      protectiveFactors.push({
        description: 'Strong community connections',
        weight: this.protectiveFactorWeights.get('cultural_connection') || 0.5
      });
    }

    // Growth indicators from journaling
    if (userContext.journalPatterns.growthIndicators.length > 0) {
      protectiveFactors.push({
        description: 'Evidence of personal growth and self-awareness',
        weight: 0.4
      });
    }

    if (userContext.journalPatterns.frequency === 'daily') {
      protectiveFactors.push({
        description: 'Consistent self-reflection practice',
        weight: 0.3
      });
    }

    return protectiveFactors;
  }

  private assessCulturalContext(userContext: UserContext): Array<{factor: string, impact: number}> {
    const culturalFactors: Array<{factor: string, impact: number}> = [];

    // Language barriers
    if (!userContext.demographics.languagePreferences.includes('english')) {
      culturalFactors.push({
        factor: 'Language barrier may affect help-seeking',
        impact: this.culturalRiskModifiers.get('language_barrier') || 0.3
      });
    }

    // Identity conflict assessment
    const hasIdentityConflict = userContext.demographics.identityFactors.some(factor => 
      ['lgbtq', 'transgender', 'non_binary'].includes(factor.toLowerCase())
    ) && userContext.demographics.culturalBackground.some(culture => 
      ['traditional_religious', 'conservative'].includes(culture.toLowerCase())
    );

    if (hasIdentityConflict) {
      culturalFactors.push({
        factor: 'Potential identity-culture conflict',
        impact: this.culturalRiskModifiers.get('identity_conflict') || 0.4
      });
    }

    // Immigration stress
    if (userContext.demographics.culturalBackground.includes('immigrant') || 
        userContext.currentStressors.legal === 'severe') {
      culturalFactors.push({
        factor: 'Immigration-related stress',
        impact: this.culturalRiskModifiers.get('immigration_stress') || 0.4
      });
    }

    return culturalFactors;
  }

  private assessTraumaImpact(userContext: UserContext): Array<{factor: string, impact: number}> {
    const traumaFactors: Array<{factor: string, impact: number}> = [];
    
    const traumaHistory = userContext.mentalHealthHistory.traumaHistory;
    if (!traumaHistory) return traumaFactors;

    // Childhood trauma
    if (traumaHistory.types.includes('childhood')) {
      traumaFactors.push({
        factor: 'Childhood trauma history',
        impact: this.traumaImpactModifiers.get('childhood_trauma') || 0.6
      });
    }

    // Complex trauma (multiple types)
    if (traumaHistory.types.length >= 3) {
      traumaFactors.push({
        factor: 'Complex trauma (multiple types)',
        impact: this.traumaImpactModifiers.get('complex_trauma') || 0.7
      });
    }

    // Treatment status
    if (traumaHistory.treatmentStatus === 'untreated') {
      traumaFactors.push({
        factor: 'Untreated trauma',
        impact: this.traumaImpactModifiers.get('unresolved_trauma') || 0.6
      });
    }

    // Current impact
    if (traumaHistory.currentImpact === 'severe') {
      traumaFactors.push({
        factor: 'Severe current trauma impact',
        impact: 0.7
      });
    }

    return traumaFactors;
  }

  private calculateWeightedRisk(
    patternRisk: number,
    riskFactors: Array<{description: string, weight: number}>,
    protectiveFactors: Array<{description: string, weight: number}>,
    culturalFactors: Array<{factor: string, impact: number}>,
    traumaFactors: Array<{factor: string, impact: number}>
  ): number {
    
    // Base risk from patterns (40% weight)
    let totalRisk = patternRisk * 0.4;
    
    // Add risk factors (30% weight)
    const riskSum = riskFactors.reduce((sum, factor) => sum + factor.weight, 0);
    const riskAverage = riskFactors.length > 0 ? riskSum / riskFactors.length : 0;
    totalRisk += riskAverage * 0.3;
    
    // Subtract protective factors (20% weight)
    const protectiveSum = protectiveFactors.reduce((sum, factor) => sum + factor.weight, 0);
    const protectiveAverage = protectiveFactors.length > 0 ? protectiveSum / protectiveFactors.length : 0;
    totalRisk -= protectiveAverage * 0.2;
    
    // Add cultural modifiers (5% weight)
    const culturalImpact = culturalFactors.reduce((sum, factor) => sum + factor.impact, 0);
    totalRisk += culturalImpact * 0.05;
    
    // Add trauma modifiers (5% weight)
    const traumaImpact = traumaFactors.reduce((sum, factor) => sum + factor.impact, 0);
    totalRisk += traumaImpact * 0.05;
    
    return Math.max(0, Math.min(1, totalRisk));
  }

  private determineRiskLevel(riskScore: number): 'minimal' | 'low' | 'moderate' | 'high' | 'critical' {
    if (riskScore >= 0.8) return 'critical';
    if (riskScore >= 0.6) return 'high';
    if (riskScore >= 0.4) return 'moderate';
    if (riskScore >= 0.2) return 'low';
    return 'minimal';
  }

  private calculateConfidence(userContext: UserContext, patterns: CrisisPattern[]): number {
    let confidence = 0.5; // Base confidence
    
    // More data = higher confidence
    const dataPoints = [
      userContext.mentalHealthHistory.previousDiagnoses?.length || 0,
      userContext.socialContext.peerConnections || 0,
      userContext.journalPatterns.emotionalTrends.length,
      patterns.length
    ].reduce((sum, points) => sum + Math.min(points, 5), 0);
    
    confidence += (dataPoints / 20) * 0.3; // Max 0.3 boost from data richness
    
    // Pattern confidence
    const avgPatternConfidence = patterns.length > 0 
      ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length 
      : 0.5;
    confidence += avgPatternConfidence * 0.2; // Max 0.2 boost from pattern confidence
    
    return Math.min(0.95, Math.max(0.1, confidence));
  }

  private identifyPrimaryConcerns(
    patterns: CrisisPattern[], 
    riskFactors: Array<{description: string, weight: number}>
  ): string[] {
    const concerns: string[] = [];
    
    // Add pattern-based concerns
    patterns.forEach(pattern => {
      if (pattern.severity === 'critical' || pattern.severity === 'high') {
        concerns.push(`${pattern.type} crisis pattern detected`);
      }
    });
    
    // Add highest-weight risk factors
    riskFactors
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .forEach(factor => concerns.push(factor.description));
    
    return concerns;
  }

  private generateCulturalConsiderations(userContext: UserContext): string[] {
    const considerations: string[] = [];
    
    userContext.demographics.culturalBackground.forEach(culture => {
      switch (culture.toLowerCase()) {
        case 'indigenous':
          considerations.push('Traditional healing practices may complement Western approaches');
          considerations.push('Historical trauma considerations important');
          break;
        case 'latino':
          considerations.push('Family involvement in treatment may be culturally important');
          considerations.push('Spiritual/religious elements may be significant');
          break;
        case 'asian':
          considerations.push('Stigma reduction approaches may be necessary');
          considerations.push('Face-saving and family honor considerations');
          break;
        case 'black':
          considerations.push('Medical mistrust considerations');
          considerations.push('Community-based support may be preferred');
          break;
      }
    });
    
    return considerations;
  }

  private generateTraumaInformedRecommendations(
    userContext: UserContext, 
    riskLevel: string
  ): string[] {
    const recommendations: string[] = [];
    
    recommendations.push('Ensure all interactions prioritize safety and trustworthiness');
    recommendations.push('Maintain user choice and control in all decisions');
    recommendations.push('Recognize trauma symptoms and triggers');
    
    if (userContext.mentalHealthHistory.traumaHistory?.types.includes('childhood')) {
      recommendations.push('Consider developmental trauma-informed approaches');
    }
    
    if (userContext.demographics.identityFactors.some(factor => 
      ['lgbtq', 'transgender'].includes(factor.toLowerCase()))) {
      recommendations.push('Ensure LGBTQ+ affirming care approaches');
    }
    
    if (riskLevel === 'high' || riskLevel === 'critical') {
      recommendations.push('Immediate trauma-informed crisis intervention needed');
      recommendations.push('Safety planning with trauma considerations');
    }
    
    return recommendations;
  }

  private assessImmediateSafety(patterns: CrisisPattern[], riskScore: number): boolean {
    const hasDirectSuicidalPatterns = patterns.some(p => 
      p.type === 'direct' && p.severity === 'critical'
    );
    
    const hasImmediateTimeFrames = patterns.some(p => 
      p.indicators.some(indicator => 
        ['tonight', 'today', 'now', 'right now'].some(time => indicator.includes(time))
      )
    );
    
    return hasDirectSuicidalPatterns || hasImmediateTimeFrames || riskScore >= 0.8;
  }

  private determineFollowUpTimeframe(
    riskLevel: string, 
    patterns: CrisisPattern[]
  ): 'immediate' | '24_hours' | '72_hours' | 'weekly' | 'monthly' {
    
    if (riskLevel === 'critical') return 'immediate';
    if (riskLevel === 'high') return '24_hours';
    if (riskLevel === 'moderate') return '72_hours';
    if (riskLevel === 'low') return 'weekly';
    return 'monthly';
  }

  /**
   * Generates personalized safety plan based on contextual assessment
   */
  generateSafetyPlan(assessment: ContextualAssessment, userContext: UserContext): {
    warningSigns: string[];
    copingStrategies: string[];
    socialSupports: string[];
    professionalContacts: string[];
    environmentalSafety: string[];
    reasonsToLive: string[];
  } {
    return {
      warningSigns: this.identifyPersonalizedWarningSigns(userContext),
      copingStrategies: this.recommendCopingStrategies(userContext),
      socialSupports: this.identifySocialSupports(userContext),
      professionalContacts: this.recommendProfessionalContacts(assessment, userContext),
      environmentalSafety: this.recommendEnvironmentalSafety(userContext),
      reasonsToLive: this.identifyReasonsToLive(userContext)
    };
  }

  private identifyPersonalizedWarningSigns(userContext: UserContext): string[] {
    const signs: string[] = [];
    
    // Based on trigger patterns
    userContext.journalPatterns.triggerPatterns.forEach(trigger => {
      signs.push(`When ${trigger} occurs or intensifies`);
    });
    
    // Based on trauma history
    if (userContext.mentalHealthHistory.traumaHistory) {
      signs.push('Trauma anniversary dates or reminders');
      signs.push('Feeling disconnected or numb');
    }
    
    // Universal warning signs
    signs.push('Sleep changes (too much or too little)');
    signs.push('Withdrawing from people and activities');
    signs.push('Increased substance use');
    signs.push('Feeling hopeless or trapped');
    
    return signs;
  }

  private recommendCopingStrategies(userContext: UserContext): string[] {
    const strategies: string[] = [];
    
    // Include existing healthy strategies
    strategies.push(...userContext.copingStrategies.healthy);
    
    // Add trauma-informed strategies
    strategies.push('Grounding techniques (5-4-3-2-1 sensory method)');
    strategies.push('Deep breathing exercises');
    strategies.push('Safe place visualization');
    
    // Cultural strategies
    if (userContext.demographics.culturalBackground.includes('indigenous')) {
      strategies.push('Connection with nature/land');
      strategies.push('Traditional ceremonial practices');
    }
    
    return strategies;
  }

  private identifySocialSupports(userContext: UserContext): string[] {
    const supports: string[] = [];
    
    if (userContext.socialContext.familySupport === 'supportive') {
      supports.push('Family members (specify trusted individuals)');
    }
    
    if (userContext.socialContext.peerConnections > 0) {
      supports.push('Close friends (identify 2-3 specific people)');
    }
    
    if (userContext.socialContext.communityInvolvement !== 'none') {
      supports.push('Community or spiritual group members');
    }
    
    supports.push('Crisis text line (741741)');
    supports.push('988 Suicide & Crisis Lifeline');
    
    return supports;
  }

  private recommendProfessionalContacts(
    assessment: ContextualAssessment, 
    userContext: UserContext
  ): string[] {
    const contacts: string[] = [];
    
    if (userContext.socialContext.professionalSupport) {
      contacts.push('Primary therapist/counselor');
    }
    
    contacts.push('Crisis mobile response team');
    contacts.push('Emergency services (911 if immediate danger)');
    
    if (assessment.culturalConsiderations.length > 0) {
      contacts.push('Culturally responsive crisis counselor');
    }
    
    return contacts;
  }

  private recommendEnvironmentalSafety(userContext: UserContext): string[] {
    const safety: string[] = [];
    
    safety.push('Remove or secure potential means of harm');
    safety.push('Avoid alcohol and substances');
    safety.push('Stay in safe, supportive environments');
    
    if (userContext.socialContext.familySupport === 'abusive') {
      safety.push('Identify safe alternative locations');
      safety.push('Keep important typeof window !== 'undefined' && documents accessible');
    }
    
    return safety;
  }

  private identifyReasonsToLive(userContext: UserContext): string[] {
    const reasons: string[] = [];
    
    // Based on demographics and context
    if (userContext.demographics.age && userContext.demographics.age < 30) {
      reasons.push('Future experiences and milestones to witness');
    }
    
    // Social connections
    if (userContext.socialContext.familySupport === 'supportive') {
      reasons.push('Family who care about you');
    }
    
    if (userContext.socialContext.peerConnections > 0) {
      reasons.push('Friends who value your presence');
    }
    
    // Growth and goals
    if (userContext.journalPatterns.growthIndicators.length > 0) {
      reasons.push('Personal growth journey you\'re on');
    }
    
    // Universal reasons
    reasons.push('Contribution you can make to others');
    reasons.push('Experiences you haven\'t had yet');
    reasons.push('People you haven\'t met who need you');
    
    return reasons;
  }
}

export default ContextualCrisisAssessment;
export type { 
  ContextualAssessment, 
  UserContext, 
  TraumaHistory, 
  EmotionalTrend, 
  LifeCircumstance 
};