// ALCHM Mentorship Matching Engine
// AI-powered matching based on identity similarity, complementary needs, and cultural alignment

import {
  IdentityJourney,
  IdentityMap,
  MentorshipConnection,
  CulturalContext,
  BiasReflection,
  PersonalIdentityElement,
  CulturalIdentityElement,
  AspirationalIdentityElement
} from '@/types/identity-schema';

export interface MentorshipProfile {
  userId: string;
  identityJourney: IdentityJourney;
  mentorshipPreferences: MentorshipPreferences;
  availabilityAndCapacity: AvailabilityCapacity;
  experienceAndExpertise: ExperienceExpertise;
  culturalBridgingCapacity: CulturalBridgingCapacity;
  biasAwarenessLevel: BiasAwarenessLevel;
  empathyAndSupport: EmpathySupport;
  safetyAndBoundaries: SafetyBoundaries;
  matchingHistory: MatchingHistory;
  communityContributions: CommunityContributions;
  healingAndTrauma: HealingTraumaCapacity;
  advocacyAndAction: AdvocacyActionCapacity;
}

export interface MentorshipPreferences {
  seekingMentorship: boolean;
  offeringMentorship: boolean;
  connectionTypes: MentorshipConnectionType[];
  preferredCulturalAlignment: 'similar_backgrounds' | 'different_backgrounds' | 'mixed' | 'no_preference';
  identityFocusAreas: string[];
  biasAccountabilityComfort: 'high' | 'medium' | 'low';
  empathyBuildingInterest: 'high' | 'medium' | 'low';
  narrativeSharingComfort: 'high' | 'medium' | 'low';
  intersectionalSupportNeeds: string[];
  healingFocusPreference: 'yes' | 'no' | 'trauma_informed_only';
  advocacyInterest: 'high' | 'medium' | 'low';
  anonymityPreference: 'fully_anonymous' | 'pseudonymous' | 'verified_identity';
  communicationStyle: CommunicationStyle[];
  sessionFrequency: 'weekly' | 'bi_weekly' | 'monthly' | 'as_needed';
  durationCommitment: 'short_term' | 'medium_term' | 'long_term' | 'ongoing';
}

export interface MatchingCriteria {
  identitySimilarity: number; // 0-1 weight
  culturalAlignment: number; // 0-1 weight
  complementaryNeeds: number; // 0-1 weight
  biasAwarenessCompatibility: number; // 0-1 weight
  empathyResonance: number; // 0-1 weight
  safetyCompatibility: number; // 0-1 weight
  experienceBalance: number; // 0-1 weight
  communicationAlignment: number; // 0-1 weight
  availabilityMatch: number; // 0-1 weight
  healingAndTraumaConsiderations: number; // 0-1 weight
  advocacyAlignement: number; // 0-1 weight
  intersectionalCompatibility: number; // 0-1 weight
}

export interface MentorshipMatch {
  matchId: string;
  mentorProfile: MentorshipProfile;
  menteeProfile: MentorshipProfile;
  matchScore: number; // 0-1 overall compatibility
  strengthAreas: MatchStrength[];
  growthAreas: MatchGrowthArea[];
  culturalSynergies: CulturalSynergy[];
  complementarities: Complementarity[];
  potentialChallenges: PotentialChallenge[];
  safetyConcerns: SafetyConcern[];
  successPredictors: SuccessPredictor[];
  recommendedApproach: RecommendedApproach;
  suggestedStructure: SuggestedStructure;
  milestoneRecommendations: MilestoneRecommendation[];
  communityBenefit: CommunityBenefit;
  healingPotential: HealingPotential;
  biasGrowthOpportunity: BiasGrowthOpportunity;
  empathyExpansionPotential: EmpathyExpansionPotential;
  confidenceScore: number; // 0-1 AI confidence in match quality
  ethicalConsiderations: EthicalConsideration[];
  culturalWisdomIntegration: CulturalWisdomIntegration[];
}

export interface MentorshipMatchingConfig {
  algorithmVersion: string;
  culturalSensitivityLevel: 'high' | 'medium' | 'low';
  biasAwarenessRequired: boolean;
  traumaInformedMatching: boolean;
  intersectionalAnalysis: boolean;
  communityBenefitWeighting: number; // 0-1
  safetyPriorityLevel: 'maximum' | 'high' | 'medium';
  diversityPreference: 'encourage_diversity' | 'allow_similarity' | 'no_preference';
  experienceLevelMixing: 'required' | 'preferred' | 'allowed' | 'discouraged';
  minimumMatchScore: number; // 0-1 threshold
  maxMatchesPerPerson: number;
  cooldownPeriodDays: number;
  qualityOverQuantity: boolean;
}

export class MentorshipMatchingEngine {
  private config: MentorshipMatchingConfig;
  private identitySimilarityWeights: Map<string, number>;
  private culturalCompatibilityMatrix: Map<string, Map<string, number>>;
  private biasAwarenessLevels: Map<string, BiasAwarenessMetrics>;
  private communicationStyleCompatibility: Map<string, string[]>;
  
  constructor(config: MentorshipMatchingConfig) {
    this.config = config;
    this.identitySimilarityWeights = this.initializeIdentitySimilarityWeights();
    this.culturalCompatibilityMatrix = this.initializeCulturalCompatibilityMatrix();
    this.biasAwarenessLevels = this.initializeBiasAwarenessLevels();
    this.communicationStyleCompatibility = this.initializeCommunicationCompatibility();
  }

  // Main matching function
  async findMentorshipMatches(
    seekerProfile: MentorshipProfile,
    candidateProfiles: MentorshipProfile[],
    criteria: MatchingCriteria
  ): Promise<MentorshipMatch[]> {
    
    const potentialMatches: MentorshipMatch[] = [];
    
    for (const candidateProfile of candidateProfiles) {
      
      // Skip if not compatible basic requirements
      if (!this.passesBasicCompatibility(seekerProfile, candidateProfile)) {
        continue;
      }
      
      // Calculate comprehensive match score
      const matchAnalysis = await this.analyzeMatchCompatibility(
        seekerProfile,
        candidateProfile,
        criteria
      );
      
      // Only include matches above threshold
      if (matchAnalysis.matchScore >= this.config.minimumMatchScore) {
        potentialMatches.push(matchAnalysis);
      }
    }
    
    // Sort by match score and quality indicators
    const rankedMatches = this.rankMatches(potentialMatches, criteria);
    
    // Apply diversity and quality filters
    const finalMatches = this.applyMatchingFilters(rankedMatches, seekerProfile);
    
    // Limit to maximum matches per person
    return finalMatches.slice(0, this.config.maxMatchesPerPerson);
  }

  // Calculate identity similarity score
  private calculateIdentitySimilarity(
    identityMap1: IdentityMap,
    identityMap2: IdentityMap
  ): number {
    
    let totalSimilarity = 0;
    let totalWeight = 0;
    
    // Personal identity similarity
    const personalSimilarity = this.calculatePersonalIdentitySimilarity(
      identityMap1.personal,
      identityMap2.personal
    );
    totalSimilarity += personalSimilarity * 0.3;
    totalWeight += 0.3;
    
    // Cultural identity similarity
    const culturalSimilarity = this.calculateCulturalIdentitySimilarity(
      identityMap1.cultural,
      identityMap2.cultural
    );
    totalSimilarity += culturalSimilarity * 0.4;
    totalWeight += 0.4;
    
    // Aspirational identity similarity
    const aspirationalSimilarity = this.calculateAspirationalIdentitySimilarity(
      identityMap1.aspirational,
      identityMap2.aspirational
    );
    totalSimilarity += aspirationalSimilarity * 0.3;
    totalWeight += 0.3;
    
    return totalWeight > 0 ? totalSimilarity / totalWeight : 0;
  }

  // Calculate cultural alignment score
  private calculateCulturalAlignment(
    culturalContext1: CulturalContext,
    culturalContext2: CulturalContext,
    preferences1: MentorshipPreferences,
    preferences2: MentorshipPreferences
  ): number {
    
    // Check preference alignment
    if (preferences1.preferredCulturalAlignment === 'different_backgrounds' ||
        preferences2.preferredCulturalAlignment === 'different_backgrounds') {
      
      const culturalDistance = this.calculateCulturalDistance(culturalContext1, culturalContext2);
      return culturalDistance; // Higher distance is preferred
    }
    
    if (preferences1.preferredCulturalAlignment === 'similar_backgrounds' ||
        preferences2.preferredCulturalAlignment === 'similar_backgrounds') {
      
      const culturalSimilarity = this.calculateCulturalSimilarity(culturalContext1, culturalContext2);
      return culturalSimilarity; // Higher similarity is preferred
    }
    
    // For mixed or no preference, calculate compatibility
    return this.calculateCulturalCompatibility(culturalContext1, culturalContext2);
  }

  // Calculate complementary needs score
  private calculateComplementaryNeeds(
    profile1: MentorshipProfile,
    profile2: MentorshipProfile
  ): number {
    
    let complementarityScore = 0;
    let totalFactors = 0;
    
    // Experience complementarity
    const experienceComplementarity = this.assessExperienceComplementarity(
      profile1.experienceAndExpertise,
      profile2.experienceAndExpertise
    );
    complementarityScore += experienceComplementarity;
    totalFactors += 1;
    
    // Identity focus area complementarity
    const focusAreaComplementarity = this.assessFocusAreaComplementarity(
      profile1.mentorshipPreferences.identityFocusAreas,
      profile2.mentorshipPreferences.identityFocusAreas,
      profile1.identityJourney.identityMap,
      profile2.identityJourney.identityMap
    );
    complementarityScore += focusAreaComplementarity;
    totalFactors += 1;
    
    // Bias awareness complementarity
    const biasAwarenessComplementarity = this.assessBiasAwarenessComplementarity(
      profile1.biasAwarenessLevel,
      profile2.biasAwarenessLevel
    );
    complementarityScore += biasAwarenessComplementarity;
    totalFactors += 1;
    
    // Healing and trauma complementarity
    const healingComplementarity = this.assessHealingComplementarity(
      profile1.healingAndTrauma,
      profile2.healingAndTrauma
    );
    complementarityScore += healingComplementarity;
    totalFactors += 1;
    
    return totalFactors > 0 ? complementarityScore / totalFactors : 0;
  }

  // Assess bias awareness compatibility
  private assessBiasAwarenessCompatibility(
    profile1: MentorshipProfile,
    profile2: MentorshipProfile
  ): number {
    
    const biasLevel1 = profile1.biasAwarenessLevel;
    const biasLevel2 = profile2.biasAwarenessLevel;
    
    // Check comfort levels
    const comfort1 = profile1.mentorshipPreferences.biasAccountabilityComfort;
    const comfort2 = profile2.mentorshipPreferences.biasAccountabilityComfort;
    
    // Calculate compatibility based on levels and comfort
    let compatibilityScore = 0;
    
    // High-high pairing
    if (biasLevel1.overallLevel > 0.7 && biasLevel2.overallLevel > 0.7) {
      compatibilityScore = 0.9;
    }
    // High-medium with high comfort
    else if ((biasLevel1.overallLevel > 0.7 || biasLevel2.overallLevel > 0.7) &&
             (comfort1 === 'high' || comfort2 === 'high')) {
      compatibilityScore = 0.8;
    }
    // Medium-medium with medium+ comfort
    else if (biasLevel1.overallLevel > 0.4 && biasLevel2.overallLevel > 0.4 &&
             comfort1 !== 'low' && comfort2 !== 'low') {
      compatibilityScore = 0.7;
    }
    // Low compatibility with mismatched levels/comfort
    else {
      compatibilityScore = 0.3;
    }
    
    // Adjust for specific bias areas alignment
    const specificAreaAlignment = this.calculateBiasAreaAlignment(biasLevel1, biasLevel2);
    compatibilityScore = (compatibilityScore + specificAreaAlignment) / 2;
    
    return Math.max(0, Math.min(1, compatibilityScore));
  }

  // Calculate empathy resonance
  private calculateEmpathyResonance(
    profile1: MentorshipProfile,
    profile2: MentorshipProfile
  ): number {
    
    const empathy1 = profile1.empathyAndSupport;
    const empathy2 = profile2.empathyAndSupport;
    
    // Base resonance from empathy levels
    let resonance = (empathy1.empathyLevel + empathy2.empathyLevel) / 2;
    
    // Adjust for empathy building interest alignment
    const interest1 = profile1.mentorshipPreferences.empathyBuildingInterest;
    const interest2 = profile2.mentorshipPreferences.empathyBuildingInterest;
    
    if (interest1 === 'high' && interest2 === 'high') {
      resonance += 0.2;
    } else if (interest1 === 'high' || interest2 === 'high') {
      resonance += 0.1;
    }
    
    // Adjust for complementary empathy styles
    const styleCompatibility = this.calculateEmpathyStyleCompatibility(empathy1, empathy2);
    resonance = (resonance + styleCompatibility) / 2;
    
    return Math.max(0, Math.min(1, resonance));
  }

  // Analyze comprehensive match compatibility
  private async analyzeMatchCompatibility(
    seekerProfile: MentorshipProfile,
    candidateProfile: MentorshipProfile,
    criteria: MatchingCriteria
  ): Promise<MentorshipMatch> {
    
    // Calculate individual compatibility scores
    const identitySimilarity = this.calculateIdentitySimilarity(
      seekerProfile.identityJourney.identityMap,
      candidateProfile.identityJourney.identityMap
    );
    
    const culturalAlignment = this.calculateCulturalAlignment(
      seekerProfile.identityJourney.culturalContext,
      candidateProfile.identityJourney.culturalContext,
      seekerProfile.mentorshipPreferences,
      candidateProfile.mentorshipPreferences
    );
    
    const complementaryNeeds = this.calculateComplementaryNeeds(
      seekerProfile,
      candidateProfile
    );
    
    const biasCompatibility = this.assessBiasAwarenessCompatibility(
      seekerProfile,
      candidateProfile
    );
    
    const empathyResonance = this.calculateEmpathyResonance(
      seekerProfile,
      candidateProfile
    );
    
    const safetyCompatibility = this.assessSafetyCompatibility(
      seekerProfile,
      candidateProfile
    );
    
    const experienceBalance = this.calculateExperienceBalance(
      seekerProfile,
      candidateProfile
    );
    
    const communicationAlignment = this.assessCommunicationAlignment(
      seekerProfile,
      candidateProfile
    );
    
    const availabilityMatch = this.calculateAvailabilityMatch(
      seekerProfile,
      candidateProfile
    );
    
    const healingConsiderations = this.assessHealingConsiderations(
      seekerProfile,
      candidateProfile
    );
    
    const advocacyAlignment = this.calculateAdvocacyAlignment(
      seekerProfile,
      candidateProfile
    );
    
    const intersectionalCompatibility = this.assessIntersectionalCompatibility(
      seekerProfile,
      candidateProfile
    );
    
    // Calculate weighted overall match score
    const matchScore = this.calculateWeightedMatchScore({
      identitySimilarity,
      culturalAlignment,
      complementaryNeeds,
      biasCompatibility,
      empathyResonance,
      safetyCompatibility,
      experienceBalance,
      communicationAlignment,
      availabilityMatch,
      healingConsiderations,
      advocacyAlignment,
      intersectionalCompatibility
    }, criteria);
    
    // Generate match insights
    const strengthAreas = this.identifyMatchStrengths({
      identitySimilarity,
      culturalAlignment,
      complementaryNeeds,
      biasCompatibility,
      empathyResonance,
      safetyCompatibility,
      experienceBalance,
      communicationAlignment,
      availabilityMatch,
      healingConsiderations,
      advocacyAlignment,
      intersectionalCompatibility
    });
    
    const growthAreas = this.identifyGrowthAreas({
      identitySimilarity,
      culturalAlignment,
      complementaryNeeds,
      biasCompatibility,
      empathyResonance,
      safetyCompatibility,
      experienceBalance,
      communicationAlignment,
      availabilityMatch,
      healingConsiderations,
      advocacyAlignment,
      intersectionalCompatibility
    });
    
    const culturalSynergies = this.identifyCulturalSynergies(
      seekerProfile,
      candidateProfile
    );
    
    const complementarities = this.identifyComplementarities(
      seekerProfile,
      candidateProfile
    );
    
    const potentialChallenges = this.identifyPotentialChallenges(
      seekerProfile,
      candidateProfile
    );
    
    const safetyConcerns = this.assessSafetyConcerns(
      seekerProfile,
      candidateProfile
    );
    
    const successPredictors = this.identifySuccessPredictors(
      seekerProfile,
      candidateProfile,
      matchScore
    );
    
    const recommendedApproach = this.generateRecommendedApproach(
      seekerProfile,
      candidateProfile,
      strengthAreas,
      growthAreas
    );
    
    const suggestedStructure = this.generateSuggestedStructure(
      seekerProfile,
      candidateProfile
    );
    
    const milestoneRecommendations = this.generateMilestoneRecommendations(
      seekerProfile,
      candidateProfile
    );
    
    const communityBenefit = this.assessCommunityBenefit(
      seekerProfile,
      candidateProfile
    );
    
    const healingPotential = this.assessHealingPotential(
      seekerProfile,
      candidateProfile
    );
    
    const biasGrowthOpportunity = this.assessBiasGrowthOpportunity(
      seekerProfile,
      candidateProfile
    );
    
    const empathyExpansionPotential = this.assessEmpathyExpansionPotential(
      seekerProfile,
      candidateProfile
    );
    
    const confidenceScore = this.calculateMatchConfidence(
      matchScore,
      strengthAreas,
      safetyConcerns
    );
    
    const ethicalConsiderations = this.identifyEthicalConsiderations(
      seekerProfile,
      candidateProfile
    );
    
    const culturalWisdomIntegration = this.identifyCulturalWisdomIntegration(
      seekerProfile,
      candidateProfile
    );
    
    return {
      matchId: `match_${seekerProfile.userId}_${candidateProfile.userId}_${Date.now()}`,
      mentorProfile: candidateProfile,
      menteeProfile: seekerProfile,
      matchScore,
      strengthAreas,
      growthAreas,
      culturalSynergies,
      complementarities,
      potentialChallenges,
      safetyConcerns,
      successPredictors,
      recommendedApproach,
      suggestedStructure,
      milestoneRecommendations,
      communityBenefit,
      healingPotential,
      biasGrowthOpportunity,
      empathyExpansionPotential,
      confidenceScore,
      ethicalConsiderations,
      culturalWisdomIntegration
    };
  }

  // Helper methods for initialization and calculations
  private initializeIdentitySimilarityWeights(): Map<string, number> {
    const weights = new Map<string, number>();
    
    // Personal identity element weights
    weights.set('core_values', 0.9);
    weights.set('life_experiences', 0.8);
    weights.set('personality_traits', 0.6);
    weights.set('relationships', 0.7);
    weights.set('achievements', 0.5);
    weights.set('challenges', 0.8);
    
    return weights;
  }

  private initializeCulturalCompatibilityMatrix(): Map<string, Map<string, number>> {
    const matrix = new Map<string, Map<string, number>>();
    
    // This would contain cultural compatibility scores
    // For brevity, implementing basic structure
    const cultures = ['collectivist', 'individualist', 'family_centered', 'achievement_oriented'];
    
    cultures.forEach(culture1 => {
      const compatibilityMap = new Map<string, number>();
      cultures.forEach(culture2 => {
        // Basic compatibility logic - same culture = 1.0, different = varies
        if (culture1 === culture2) {
          compatibilityMap.set(culture2, 1.0);
        } else {
          // Different cultures can still be compatible
          compatibilityMap.set(culture2, 0.7);
        }
      });
      matrix.set(culture1, compatibilityMap);
    });
    
    return matrix;
  }

  private initializeBiasAwarenessLevels(): Map<string, BiasAwarenessMetrics> {
    // Initialize bias awareness metrics
    return new Map();
  }

  private initializeCommunicationCompatibility(): Map<string, string[]> {
    const compatibility = new Map<string, string[]>();
    
    compatibility.set('direct', ['direct', 'clear_structured']);
    compatibility.set('gentle', ['gentle', 'supportive_nurturing', 'healing_centered']);
    compatibility.set('socratic', ['socratic', 'reflective', 'challenging']);
    compatibility.set('storytelling', ['storytelling', 'narrative', 'experiential']);
    
    return compatibility;
  }

  // Additional helper methods would be implemented here...
  private passesBasicCompatibility(profile1: MentorshipProfile, profile2: MentorshipProfile): boolean {
    // Basic compatibility checks
    return true; // Placeholder
  }

  private rankMatches(matches: MentorshipMatch[], criteria: MatchingCriteria): MentorshipMatch[] {
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  private applyMatchingFilters(matches: MentorshipMatch[], seekerProfile: MentorshipProfile): MentorshipMatch[] {
    // Apply diversity and quality filters
    return matches; // Placeholder
  }

  // More implementation methods would follow...
  private calculatePersonalIdentitySimilarity(elements1: PersonalIdentityElement[], elements2: PersonalIdentityElement[]): number {
    return 0.5; // Placeholder
  }

  private calculateCulturalIdentitySimilarity(elements1: CulturalIdentityElement[], elements2: CulturalIdentityElement[]): number {
    return 0.5; // Placeholder
  }

  private calculateAspirationalIdentitySimilarity(elements1: AspirationalIdentityElement[], elements2: AspirationalIdentityElement[]): number {
    return 0.5; // Placeholder
  }

  // More helper methods...
}

// Supporting interfaces
interface MentorshipConnectionType {
  type: string;
  description: string;
}

interface AvailabilityCapacity {
  hoursPerWeek: number;
  preferredTimes: string[];
  timezone: string;
  capacity: number;
}

interface ExperienceExpertise {
  yearsOfExperience: number;
  expertiseAreas: string[];
  mentorshipExperience: number;
}

interface CulturalBridgingCapacity {
  bridgeBuilder: boolean;
  culturalFluency: string[];
  crossCulturalExperience: number;
}

interface BiasAwarenessLevel {
  overallLevel: number;
  specificAreas: Map<string, number>;
  growthAreas: string[];
}

interface EmpathySupport {
  empathyLevel: number;
  supportStyle: string[];
  emotionalIntelligence: number;
}

interface SafetyBoundaries {
  safetyProtocols: string[];
  boundaries: string[];
  traumaInformed: boolean;
}

interface MatchingHistory {
  previousMatches: number;
  successRate: number;
  feedback: string[];
}

interface CommunityContributions {
  contributions: string[];
  impact: number;
  leadership: boolean;
}

interface HealingTraumaCapacity {
  traumaInformed: boolean;
  healingExperience: number;
  traumaTypes: string[];
}

interface AdvocacyActionCapacity {
  advocacyExperience: number;
  actionOrientation: number;
  leadershipCapacity: number;
}

// More supporting types would be defined here...

export { MentorshipMatchingEngine };
export type {
  MentorshipProfile,
  MentorshipMatch,
  MentorshipMatchingConfig,
  MatchingCriteria
};