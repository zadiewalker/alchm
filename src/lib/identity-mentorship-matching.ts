// ALCHM Identity-Based Mentorship Matching System
// AI-powered mentorship matching based on shared identity experiences and cultural compatibility

import {
  IdentityMentorshipSystem,
  MentorProfile,
  MenteeProfile,
  MatchingCriteria,
  MentorshipRelationship,
  SharedIdentityMatching,
  CulturalCompatibilityMatching
} from '@/types/identity-pathway-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { CulturalContext, IdentityJourney } from '@/types/identity-schema';
import { BiasAwarenessEngine } from './bias-awareness-engine';

export interface MentorshipMatchingConfig {
  geminiApiKey: string;
  matchingAlgorithm: 'ai_powered' | 'rule_based' | 'hybrid';
  culturalWeighting: number; // 0-1, importance of cultural factors
  experienceWeighting: number; // 0-1, importance of shared experiences
  goalAlignmentWeighting: number; // 0-1, importance of goal alignment
  personalityWeighting: number; // 0-1, importance of personality fit
  safetyChecks: boolean;
  diversityRequirements: boolean;
  expertValidation: boolean;
  communityFeedback: boolean;
}

export interface MentorshipMatchRequest {
  requestId: string;
  menteeProfile: MenteeProfile;
  identityProfile: IdentityExplorationProfile;
  matchingPreferences: MatchingPreferences;
  mentorshipGoals: MentorshipGoal[];
  culturalRequirements: CulturalRequirement[];
  availabilityConstraints: AvailabilityConstraint[];
  communicationPreferences: CommunicationPreference[];
  safetyRequirements: SafetyRequirement[];
}

export interface MatchingPreferences {
  preferredMentorCharacteristics: MentorCharacteristic[];
  dealBreakers: string[];
  culturalPriorities: CulturalPriority[];
  experiencePriorities: ExperiencePriority[];
  mentorshipStyle: 'formal' | 'informal' | 'peer' | 'group' | 'flexible';
  communicationFrequency: 'weekly' | 'biweekly' | 'monthly' | 'as_needed';
  relationshipDuration: 'short_term' | 'medium_term' | 'long_term' | 'ongoing';
  anonymityLevel: 'full' | 'partial' | 'identified';
}

export interface MentorshipMatchResult {
  matchId: string;
  mentorProfile: MentorProfile;
  menteeProfile: MenteeProfile;
  compatibilityScore: number; // 0-1
  matchingFactors: MatchingFactor[];
  sharedExperiences: SharedExperience[];
  culturalAlignment: CulturalAlignment;
  potentialChallenges: PotentialChallenge[];
  recommendedApproach: RecommendedApproach;
  safetyAssessment: SafetyAssessment;
  relationshipPrediction: RelationshipPrediction;
  aiInsights: MentorshipAIInsight[];
}

export interface MentorshipMatchingAnalysis {
  totalCandidates: number;
  qualifiedCandidates: number;
  topMatches: MentorshipMatchResult[];
  matchingChallenges: MatchingChallenge[];
  diversityAnalysis: DiversityAnalysis;
  culturalRepresentation: CulturalRepresentation[];
  recommendedAlternatives: AlternativeOption[];
  waitlistRecommendation?: WaitlistRecommendation;
}

export interface MentorCharacteristic {
  characteristic: string;
  importance: 'low' | 'medium' | 'high' | 'required';
  description: string;
  culturalContext?: string;
}

export interface MatchingFactor {
  factor: 'shared_identity' | 'cultural_background' | 'similar_experiences' | 'complementary_skills' | 'goal_alignment' | 'communication_style';
  score: number; // 0-1
  description: string;
  evidence: string[];
  culturalSignificance?: string;
}

export interface SharedExperience {
  experienceType: string;
  mentorExperience: string;
  menteeExperience: string;
  relevanceScore: number; // 0-1
  culturalContext: string;
  learningOpportunity: string;
}

export interface CulturalAlignment {
  primaryCultureMatch: boolean;
  valueSimilarity: number; // 0-1
  communicationStyleAlignment: number; // 0-1
  culturalSafetyScore: number; // 0-1
  sharedCulturalReferences: string[];
  respectForDifferences: number; // 0-1
  crossCulturalLearningPotential: number; // 0-1
}

export class IdentityMentorshipMatchingEngine {
  private config: MentorshipMatchingConfig;
  private geminiClient: GeminiClient;
  private biasAwarenessEngine: BiasAwarenessEngine;
  private matchingAlgorithm: MentorshipMatchingAlgorithm;
  private culturalAnalyzer: CulturalCompatibilityAnalyzer;
  private safetyValidator: MentorshipSafetyValidator;
  private diversityAnalyzer: DiversityAnalyzer;

  constructor(
    config: MentorshipMatchingConfig,
    biasAwarenessEngine: BiasAwarenessEngine
  ) {
    this.config = config;
    this.geminiClient = new GeminiClient(config.geminiApiKey);
    this.biasAwarenessEngine = biasAwarenessEngine;
    this.matchingAlgorithm = new AIProvidedMentorshipMatchingAlgorithm(config);
    this.culturalAnalyzer = new CulturalCompatibilityAnalyzer(config);
    this.safetyValidator = new MentorshipSafetyValidator(config);
    this.diversityAnalyzer = new DiversityAnalyzer(config);
  }

  // Find mentorship matches for a mentee
  async findMentorshipMatches(
    request: MentorshipMatchRequest,
    availableMentors: MentorProfile[]
  ): Promise<MentorshipMatchingAnalysis> {
    
    console.log('Finding mentorship matches for:', request.menteeProfile.userId);
    
    // Step 1: Filter mentors based on basic compatibility
    const compatibleMentors = await this.filterCompatibleMentors(
      availableMentors,
      request
    );
    
    // Step 2: Analyze each compatible mentor for detailed matching
    const detailedMatches = await Promise.all(
      compatibleMentors.map(mentor => 
        this.analyzeDetailedMatch(mentor, request)
      )
    );
    
    // Step 3: Apply cultural compatibility analysis
    const culturallyAnalyzedMatches = await Promise.all(
      detailedMatches.map(match => 
        this.analyzeCulturalCompatibility(match, request)
      )
    );
    
    // Step 4: Perform safety assessment for each match
    const safetyAssessedMatches = await Promise.all(
      culturallyAnalyzedMatches.map(match => 
        this.assessMentorshipSafety(match, request)
      )
    );
    
    // Step 5: Apply bias detection and mitigation
    const biasCheckedMatches = await this.checkForMatchingBias(
      safetyAssessedMatches,
      request
    );
    
    // Step 6: Generate AI insights for each match
    const aiEnhancedMatches = await Promise.all(
      biasCheckedMatches.map(match => 
        this.generateMatchingAIInsights(match, request)
      )
    );
    
    // Step 7: Rank and sort matches
    const rankedMatches = this.rankMatches(aiEnhancedMatches, request);
    
    // Step 8: Analyze diversity and representation
    const diversityAnalysis = await this.analyzeDiversity(
      rankedMatches,
      request.identityProfile
    );
    
    // Step 9: Identify matching challenges and alternatives
    const matchingChallenges = await this.identifyMatchingChallenges(
      request,
      availableMentors,
      rankedMatches
    );
    
    // Step 10: Generate alternative recommendations
    const alternatives = await this.generateAlternativeRecommendations(
      request,
      matchingChallenges
    );
    
    return {
      totalCandidates: availableMentors.length,
      qualifiedCandidates: compatibleMentors.length,
      topMatches: rankedMatches.slice(0, 5), // Top 5 matches
      matchingChallenges,
      diversityAnalysis,
      culturalRepresentation: await this.analyzeCulturalRepresentation(rankedMatches),
      recommendedAlternatives: alternatives,
      waitlistRecommendation: rankedMatches.length < 3 ? 
        await this.generateWaitlistRecommendation(request) : undefined
    };
  }

  // Create mentor profile with identity focus
  async createMentorProfile(
    userId: string,
    identityProfile: IdentityExplorationProfile,
    mentorshipCapabilities: MentorshipCapability[],
    culturalContext: CulturalContext
  ): Promise<MentorProfile> {
    
    // Step 1: Analyze mentor's identity journey for mentoring insights
    const identityMentoringAnalysis = await this.analyzeIdentityMentoringCapabilities(
      identityProfile,
      mentorshipCapabilities
    );
    
    // Step 2: Assess cultural mentoring strengths
    const culturalMentoringStrengths = await this.assessCulturalMentoringStrengths(
      culturalContext,
      identityProfile
    );
    
    // Step 3: Generate mentoring approach based on identity experiences
    const mentoringApproach = await this.generateIdentityBasedMentoringApproach(
      identityProfile,
      culturalContext
    );
    
    // Step 4: Create safety and boundaries framework
    const safetyFramework = await this.createMentorSafetyFramework(
      identityProfile,
      culturalContext
    );
    
    return {
      profileId: `mentor_${userId}_${Date.now()}`,
      userId,
      identityProfile,
      mentorshipExperience: identityMentoringAnalysis.experience,
      specializations: identityMentoringAnalysis.specializations,
      culturalExpertise: culturalMentoringStrengths.expertise,
      sharedExperiences: identityMentoringAnalysis.shareableExperiences,
      mentoringStyle: mentoringApproach.style,
      communicationPreferences: mentoringApproach.communicationPreferences,
      availability: mentoringApproach.availability,
      culturalSafetyCommitment: safetyFramework.commitments,
      boundariesAndLimitations: safetyFramework.boundaries,
      diversityAndInclusionApproach: mentoringApproach.diversityApproach,
      successStories: [],
      currentMentees: [],
      mentoringCapacity: mentoringApproach.capacity,
      lastActiveDate: new Date(),
      isActive: true,
      profileCompleteness: this.calculateProfileCompleteness(identityProfile),
      verificationStatus: 'pending'
    };
  }

  // Analyze detailed match compatibility
  private async analyzeDetailedMatch(
    mentor: MentorProfile,
    request: MentorshipMatchRequest
  ): Promise<MentorshipMatchResult> {
    
    // Step 1: Calculate shared identity factors
    const sharedIdentityScore = await this.calculateSharedIdentityScore(
      mentor.identityProfile,
      request.identityProfile
    );
    
    // Step 2: Analyze shared experiences
    const sharedExperiences = await this.identifySharedExperiences(
      mentor.sharedExperiences,
      request.identityProfile
    );
    
    // Step 3: Assess goal alignment
    const goalAlignment = await this.assessGoalAlignment(
      mentor.specializations,
      request.mentorshipGoals
    );
    
    // Step 4: Evaluate communication compatibility
    const communicationCompatibility = await this.evaluateCommunicationCompatibility(
      mentor.communicationPreferences,
      request.communicationPreferences
    );
    
    // Step 5: Calculate overall compatibility score
    const compatibilityScore = this.calculateCompatibilityScore({
      sharedIdentityScore,
      sharedExperiencesScore: this.calculateSharedExperiencesScore(sharedExperiences),
      goalAlignmentScore: goalAlignment.score,
      communicationScore: communicationCompatibility.score
    });
    
    return {
      matchId: `match_${mentor.userId}_${request.menteeProfile.userId}_${Date.now()}`,
      mentorProfile: mentor,
      menteeProfile: request.menteeProfile,
      compatibilityScore,
      matchingFactors: [
        {
          factor: 'shared_identity',
          score: sharedIdentityScore,
          description: 'Overlap in identity dimensions and experiences',
          evidence: await this.generateSharedIdentityEvidence(mentor.identityProfile, request.identityProfile)
        },
        {
          factor: 'goal_alignment',
          score: goalAlignment.score,
          description: goalAlignment.description,
          evidence: goalAlignment.evidence
        },
        {
          factor: 'communication_style',
          score: communicationCompatibility.score,
          description: communicationCompatibility.description,
          evidence: communicationCompatibility.evidence
        }
      ],
      sharedExperiences,
      culturalAlignment: {} as CulturalAlignment, // Will be filled in cultural analysis
      potentialChallenges: await this.identifyPotentialChallenges(mentor, request),
      recommendedApproach: await this.generateRecommendedApproach(mentor, request),
      safetyAssessment: {} as SafetyAssessment, // Will be filled in safety analysis
      relationshipPrediction: await this.predictRelationshipOutcome(mentor, request),
      aiInsights: [] // Will be filled with AI analysis
    };
  }

  // Analyze cultural compatibility
  private async analyzeCulturalCompatibility(
    match: MentorshipMatchResult,
    request: MentorshipMatchRequest
  ): Promise<MentorshipMatchResult> {
    
    const culturalAnalysisPrompt = this.buildCulturalCompatibilityPrompt(
      match.mentorProfile.identityProfile.culturalIdentity,
      request.identityProfile.culturalIdentity,
      request.culturalRequirements
    );
    
    try {
      const geminiResponse = await this.geminiClient.generateContent({
        contents: [{
          parts: [{
            text: culturalAnalysisPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          maxOutputTokens: 2000
        }
      });

      const culturalAnalysis = this.parseCulturalCompatibilityAnalysis(
        geminiResponse.response.text(),
        match,
        request
      );

      return {
        ...match,
        culturalAlignment: culturalAnalysis.alignment,
        matchingFactors: [
          ...match.matchingFactors,
          {
            factor: 'cultural_background',
            score: culturalAnalysis.alignment.valueSimilarity,
            description: 'Cultural background compatibility and shared values',
            evidence: culturalAnalysis.evidence,
            culturalSignificance: culturalAnalysis.significance
          }
        ]
      };

    } catch (error) {
      console.error('Cultural compatibility analysis failed:', error);
      return match;
    }
  }

  // Build cultural compatibility analysis prompt
  private buildCulturalCompatibilityPrompt(
    mentorCultural: any,
    menteeCultural: any,
    requirements: CulturalRequirement[]
  ): string {
    
    return `
Analyze the cultural compatibility between a mentor and mentee for identity-based mentorship.

MENTOR CULTURAL PROFILE:
- Primary Culture: ${mentorCultural?.culturalHeritage?.[0]?.name || 'Not specified'}
- Cultural Values: ${mentorCultural?.culturalValues?.map((v: any) => v.name).join(', ') || 'Not specified'}
- Cultural Practices: ${mentorCultural?.traditionalPractices?.map((p: any) => p.name).join(', ') || 'Not specified'}
- Acculturation Level: ${mentorCultural?.acculturationLevel || 'Not specified'}

MENTEE CULTURAL PROFILE:
- Primary Culture: ${menteeCultural?.culturalHeritage?.[0]?.name || 'Not specified'}
- Cultural Values: ${menteeCultural?.culturalValues?.map((v: any) => v.name).join(', ') || 'Not specified'}
- Cultural Practices: ${menteeCultural?.traditionalPractices?.map((p: any) => p.name).join(', ') || 'Not specified'}
- Acculturation Level: ${menteeCultural?.acculturationLevel || 'Not specified'}

CULTURAL REQUIREMENTS:
${requirements.map(req => `- ${req.requirement}: ${req.importance}`).join('\n')}

ANALYSIS REQUIREMENTS:
1. Assess cultural value alignment and compatibility
2. Identify shared cultural references and understanding
3. Evaluate potential for cultural learning and growth
4. Assess risk of cultural misunderstanding or insensitivity
5. Determine cultural safety factors
6. Identify opportunities for cross-cultural mentorship benefits

IMPORTANT CONSIDERATIONS:
- Cultural differences can be valuable for learning when approached respectfully
- Same-culture mentorship may provide deeper understanding and safety
- Cross-cultural mentorship requires extra cultural competency
- Power dynamics between cultures must be considered
- Historical context and cultural trauma awareness is essential

Provide analysis in JSON format:
{
  "alignment": {
    "primaryCultureMatch": boolean,
    "valueSimilarity": 0-1,
    "communicationStyleAlignment": 0-1,
    "culturalSafetyScore": 0-1,
    "sharedCulturalReferences": [],
    "respectForDifferences": 0-1,
    "crossCulturalLearningPotential": 0-1
  },
  "evidence": [],
  "significance": "...",
  "recommendations": []
}
`;
  }

  // Generate AI insights for mentorship match
  private async generateMatchingAIInsights(
    match: MentorshipMatchResult,
    request: MentorshipMatchRequest
  ): Promise<MentorshipMatchResult> {
    
    const insightsPrompt = this.buildMatchingInsightsPrompt(match, request);
    
    try {
      const geminiResponse = await this.geminiClient.generateContent({
        contents: [{
          parts: [{
            text: insightsPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          topP: 0.8,
          maxOutputTokens: 1500
        }
      });

      const aiInsights = this.parseMatchingInsights(
        geminiResponse.response.text(),
        match
      );

      return {
        ...match,
        aiInsights
      };

    } catch (error) {
      console.error('AI insights generation failed:', error);
      return match;
    }
  }

  // Calculate compatibility score
  private calculateCompatibilityScore(scores: {
    sharedIdentityScore: number;
    sharedExperiencesScore: number;
    goalAlignmentScore: number;
    communicationScore: number;
  }): number {
    
    const weights = {
      sharedIdentity: this.config.experienceWeighting,
      sharedExperiences: this.config.experienceWeighting * 0.8,
      goalAlignment: this.config.goalAlignmentWeighting,
      communication: this.config.personalityWeighting
    };
    
    const weightedScore = 
      (scores.sharedIdentityScore * weights.sharedIdentity) +
      (scores.sharedExperiencesScore * weights.sharedExperiences) +
      (scores.goalAlignmentScore * weights.goalAlignment) +
      (scores.communicationScore * weights.communication);
    
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    
    return weightedScore / totalWeight;
  }

  // Helper methods (implementations would be expanded)
  private async filterCompatibleMentors(mentors: MentorProfile[], request: MentorshipMatchRequest) {
    // Implementation would filter mentors based on basic compatibility criteria
    return mentors.filter(mentor => 
      mentor.isActive && 
      mentor.currentMentees.length < mentor.mentoringCapacity
    );
  }

  private async calculateSharedIdentityScore(mentorProfile: IdentityExplorationProfile, menteeProfile: IdentityExplorationProfile) {
    // Implementation would calculate identity overlap score
    return 0.8; // Placeholder
  }

  private async identifySharedExperiences(mentorExperiences: any[], menteeProfile: IdentityExplorationProfile) {
    // Implementation would identify shared experiences
    return [];
  }

  // More helper methods would be implemented here...
}

// Supporting interfaces
interface MentorshipGoal {
  goalId: string;
  category: 'identity_exploration' | 'career_development' | 'cultural_navigation' | 'bias_awareness' | 'leadership';
  description: string;
  priority: 'low' | 'medium' | 'high';
  timeframe: string;
}

interface CulturalRequirement {
  requirement: string;
  importance: 'preferred' | 'important' | 'required';
  description: string;
}

interface AvailabilityConstraint {
  timeZone: string;
  availableDays: string[];
  availableHours: string[];
  frequency: string;
}

interface CommunicationPreference {
  method: 'video' | 'audio' | 'text' | 'in_person';
  frequency: string;
  formalityLevel: 'formal' | 'casual' | 'flexible';
}

interface SafetyRequirement {
  requirement: string;
  level: 'basic' | 'enhanced' | 'maximum';
  description: string;
}

interface MentorshipCapability {
  area: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  experience: string;
  culturalContext?: string;
}

export { IdentityMentorshipMatchingEngine };
export type {
  MentorshipMatchingConfig,
  MentorshipMatchRequest,
  MentorshipMatchResult,
  MentorshipMatchingAnalysis
};