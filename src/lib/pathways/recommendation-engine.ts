// ALCHM Pathway Recommendation Engine
// AI-powered recommendation system with cultural intelligence and personalization

import {
  PathwayTemplate,
  PathwayCategory,
  AgeGroup,
  CulturalContext,
  SELCompetencyScore,
  PathwayProgress,
  EmotionalState
} from '@/types/pathways-schema';
import { PathwayRegistry } from './pathway-registry';
import { PathwayTemplateFactory } from './pathway-factory';
import { generateGeminiInsight, analyzeJournalForPathways } from '@/lib/ai/gemini-pathways';
import { generateGPTMentorship } from '@/lib/ai/gpt-pathways';
import { db } from '@/lib/firebaseAdmin';
import { validateSession } from '@/lib/validateSession';

export interface UserProfile {
  userId: string;
  ageGroup: AgeGroup;
  culturalContext: CulturalContext;
  currentSELScores: SELCompetencyScore;
  emotionalState: EmotionalState;
  interests: string[];
  traumaHistory?: boolean;
  accessTier: 'foundation' | 'enhanced' | 'premium' | 'clinical';
  learningStyle: LearningStyleProfile;
  engagementPatterns: EngagementPattern[];
  completedPathways: string[];
  currentChallenges: string[];
  goals: PersonalGoal[];
  supportSystem: SupportSystemProfile;
  riskFactors: RiskFactor[];
  protectiveFactors: ProtectiveFactor[];
}

export interface LearningStyleProfile {
  preferredModalities: ('visual' | 'auditory' | 'kinesthetic' | 'reading_writing')[];
  attentionSpan: 'short' | 'medium' | 'long' | 'variable';
  processingSpeed: 'fast' | 'moderate' | 'deliberate';
  socialPreference: 'individual' | 'small_group' | 'large_group' | 'flexible';
  challengePreference: 'gradual' | 'moderate' | 'intensive';
  feedbackPreference: 'immediate' | 'periodic' | 'comprehensive';
}

export interface EngagementPattern {
  timeOfDay: string;
  dayOfWeek: string;
  sessionDuration: number;
  completionRate: number;
  qualityScore: number;
  emotionalStateBefore: EmotionalState;
  emotionalStateAfter: EmotionalState;
  timestamp: Date;
}

export interface PersonalGoal {
  id: string;
  category: 'sel_development' | 'academic' | 'social' | 'emotional' | 'behavioral' | 'life_skills';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeframe: string;
  measurable: boolean;
  culturallyRelevant: boolean;
  supportNeeded: string[];
}

export interface SupportSystemProfile {
  familySupport: 'strong' | 'moderate' | 'limited' | 'absent';
  peerSupport: 'strong' | 'moderate' | 'limited' | 'absent';
  mentorSupport: 'strong' | 'moderate' | 'limited' | 'absent';
  communitySupport: 'strong' | 'moderate' | 'limited' | 'absent';
  professionalSupport: 'strong' | 'moderate' | 'limited' | 'absent';
  culturalCommunityConnection: 'strong' | 'moderate' | 'limited' | 'absent';
}

export interface RiskFactor {
  type: 'academic' | 'social' | 'emotional' | 'behavioral' | 'environmental' | 'health';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  timeframe: 'current' | 'recent' | 'historical';
  interventionNeeded: boolean;
  culturalConsiderations: string[];
}

export interface ProtectiveFactor {
  type: 'personal' | 'family' | 'school' | 'community' | 'cultural' | 'spiritual';
  strength: 'emerging' | 'developing' | 'strong' | 'exceptional';
  description: string;
  leverageOpportunities: string[];
  culturalSignificance: number; // 0-1 scale
}

export interface RecommendationResult {
  pathway: PathwayTemplate;
  recommendationScore: number;
  recommendationType: 'immediate' | 'short_term' | 'long_term' | 'crisis_support';
  reasoning: RecommendationReasoning;
  culturalFit: CulturalFitAnalysis;
  personalization: PersonalizationSuggestions;
  prerequisites: PrerequisiteAnalysis;
  expectedOutcomes: ExpectedOutcome[];
  adaptations: AdaptationRecommendation[];
  timeline: RecommendationTimeline;
  supportNeeds: SupportNeedAnalysis;
  riskConsiderations: RiskConsideration[];
}

export interface RecommendationReasoning {
  primaryReason: string;
  supportingFactors: string[];
  selAlignmentScore: number;
  culturalResonanceScore: number;
  personalGoalAlignment: number;
  traumaInformedScore: number;
  developmentalAppropriatenessScore: number;
  engagementPredictionScore: number;
}

export interface CulturalFitAnalysis {
  overallFitScore: number; // 0-1
  communicationStyleMatch: number;
  valueSystemAlignment: number;
  culturalElementsPresent: string[];
  adaptationsNeeded: string[];
  culturalStrengthsLeveraged: string[];
  potentialCulturalBarriers: string[];
}

export interface PersonalizationSuggestions {
  learningStyleAdaptations: string[];
  attentionSpanModifications: string[];
  interactionStyleAdjustments: string[];
  contentPersonalization: string[];
  pacingRecommendations: string[];
  motivationalElements: string[];
}

export interface PrerequisiteAnalysis {
  hasPrerequisites: boolean;
  missingPrerequisites: string[];
  alternativePathways: string[];
  skillGapAssessment: SkillGapAssessment[];
  preparationRecommendations: string[];
}

export interface SkillGapAssessment {
  selCompetency: keyof SELCompetencyScore;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  bridgingStrategies: string[];
}

export interface ExpectedOutcome {
  metric: string;
  baselineValue: number;
  projectedImprovement: number;
  timeframe: string;
  confidence: number; // 0-1
  culturallyRelevant: boolean;
  measurabilityScore: number;
}

export interface AdaptationRecommendation {
  adaptationType: 'cultural' | 'trauma_informed' | 'learning_style' | 'accessibility' | 'developmental';
  description: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  implementationGuidance: string;
  expectedImpact: number; // 0-1
}

export interface RecommendationTimeline {
  immediateActions: string[];
  weekOneGoals: string[];
  firstMonthMilestones: string[];
  longerTermObjectives: string[];
  checkpointSchedule: CheckpointSchedule[];
}

export interface CheckpointSchedule {
  timing: string;
  purpose: string;
  assessmentFocus: string[];
  adaptationOpportunities: string[];
}

export interface SupportNeedAnalysis {
  familyInvolvementLevel: 'minimal' | 'moderate' | 'significant' | 'intensive';
  professionalSupportNeeded: boolean;
  peerSupportOpportunities: string[];
  mentorshipRecommendations: string[];
  communityResourcesNeeded: string[];
  culturalSupportIntegration: string[];
}

export interface RiskConsideration {
  riskType: string;
  likelihood: 'low' | 'moderate' | 'high';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  mitigationStrategies: string[];
  monitoringRecommendations: string[];
  escalationTriggers: string[];
}

export class PathwayRecommendationEngine {
  private registry: PathwayRegistry;
  private factory: PathwayTemplateFactory;

  constructor() {
    this.registry = PathwayRegistry.getInstance();
    this.factory = PathwayTemplateFactory;
  }

  /**
   * Get comprehensive pathway recommendations for a user
   */
  async getRecommendations(
    userProfile: UserProfile,
    options: {
      limit?: number;
      includeAlternatives?: boolean;
      prioritizeImmediate?: boolean;
      culturalPriority?: 'high' | 'medium' | 'low';
      traumaInformedRequired?: boolean;
    } = {}
  ): Promise<RecommendationResult[]> {
    try {
      await validateSession(userProfile.userId);

      // Analyze user needs and context
      const needsAnalysis = await this.analyzeUserNeeds(userProfile);

      // Get available pathways based on user profile
      const availablePathways = await this.getEligiblePathways(userProfile);

      // Score and rank pathways
      const scoredRecommendations = await this.scorePathways(
        availablePathways,
        userProfile,
        needsAnalysis,
        options
      );

      // Generate comprehensive recommendation objects
      const recommendations = await this.generateRecommendationResults(
        scoredRecommendations,
        userProfile,
        needsAnalysis
      );

      // Apply filters and limits
      return this.applyRecommendationFilters(recommendations, options);

    } catch (error) {
      console.error('Error generating pathway recommendations:', error);
      return [];
    }
  }

  /**
   * Get emergency/crisis pathway recommendations
   */
  async getCrisisRecommendations(
    userProfile: UserProfile,
    crisisIndicators: {
      emotionalDistress: number; // 0-10
      riskLevel: 'low' | 'moderate' | 'high' | 'critical';
      immediateSupport: boolean;
      culturalConsiderations: string[];
    }
  ): Promise<RecommendationResult[]> {
    try {
      await validateSession(userProfile.userId);

      // Get crisis-appropriate pathways
      const crisisPathways = await this.registry.getTemplates({
        category: 'crisis_support',
        ageGroup: userProfile.ageGroup,
        culturalContext: userProfile.culturalContext,
        traumaInformed: true,
        safetyRating: 'excellent',
        userId: userProfile.userId
      });

      // Additional trauma-informed pathways if appropriate
      if (crisisIndicators.riskLevel !== 'critical') {
        const traumaPathways = await this.registry.getTemplates({
          category: 'trauma_informed',
          ageGroup: userProfile.ageGroup,
          culturalContext: userProfile.culturalContext,
          userId: userProfile.userId
        });
        crisisPathways.push(...traumaPathways);
      }

      // Score for crisis appropriateness
      const scoredCrisisRecommendations = await this.scoreCrisisPathways(
        crisisPathways,
        userProfile,
        crisisIndicators
      );

      return scoredCrisisRecommendations.slice(0, 3); // Limit to top 3 for crisis

    } catch (error) {
      console.error('Error generating crisis recommendations:', error);
      return [];
    }
  }

  /**
   * Analyze journal entries for pathway recommendations
   */
  async analyzeJournalForRecommendations(
    userId: string,
    journalEntries: string[],
    userProfile: UserProfile
  ): Promise<{
    recommendedCategories: PathwayCategory[];
    emotionalAnalysis: EmotionalState;
    urgencyLevel: 'low' | 'medium' | 'high' | 'crisis';
    culturalConsiderations: string[];
    recommendations: RecommendationResult[];
  }> {
    try {
      await validateSession(userId);

      // Combine journal entries for analysis
      const combinedJournal = journalEntries.join('\n\n');

      // Analyze with Gemini for pathway suggestions
      const journalAnalysis = await analyzeJournalForPathways(
        combinedJournal,
        userProfile.culturalContext
      );

      // Get specific pathway recommendations based on analysis
      const categoryRecommendations = await Promise.all(
        journalAnalysis.suggestedPathways.map(category =>
          this.getRecommendations({
            ...userProfile,
            currentChallenges: [...userProfile.currentChallenges, ...this.extractChallengesFromJournal(combinedJournal)]
          }, {
            limit: 2,
            prioritizeImmediate: journalAnalysis.urgencyLevel === 'high' || journalAnalysis.urgencyLevel === 'crisis'
          })
        )
      );

      const allRecommendations = categoryRecommendations.flat();

      return {
        recommendedCategories: journalAnalysis.suggestedPathways as PathwayCategory[],
        emotionalAnalysis: journalAnalysis.emotionalState,
        urgencyLevel: journalAnalysis.urgencyLevel,
        culturalConsiderations: await this.extractCulturalConsiderations(combinedJournal, userProfile.culturalContext),
        recommendations: allRecommendations.slice(0, 5) // Top 5 recommendations
      };

    } catch (error) {
      console.error('Error analyzing journal for recommendations:', error);
      return {
        recommendedCategories: ['self_discovery'],
        emotionalAnalysis: {
          primaryEmotion: 'neutral',
          intensity: 5,
          valence: 0,
          arousal: 0.5,
          complexity: 0.5,
          regulation: 0.5
        },
        urgencyLevel: 'low',
        culturalConsiderations: [],
        recommendations: []
      };
    }
  }

  /**
   * Get pathway recommendations based on specific SEL goals
   */
  async getGoalBasedRecommendations(
    userProfile: UserProfile,
    selGoals: {
      primaryGoal: keyof SELCompetencyScore;
      targetImprovement: number;
      timeframe: string;
      culturalAlignment: boolean;
    }
  ): Promise<RecommendationResult[]> {
    try {
      await validateSession(userProfile.userId);

      // Find pathways that focus on the target SEL competency
      const allPathways = await this.registry.getTemplates({
        ageGroup: userProfile.ageGroup,
        culturalContext: userProfile.culturalContext,
        accessTier: userProfile.accessTier,
        userId: userProfile.userId
      });

      // Filter pathways that address the primary goal
      const goalAlignedPathways = allPathways.filter(pathway => {
        const selFocus = pathway.SELCompetencyFocus;
        return selFocus[selGoals.primaryGoal] && selFocus[selGoals.primaryGoal]! > 0;
      });

      // Score based on goal alignment and user profile
      const scoredRecommendations = await this.scoreGoalBasedPathways(
        goalAlignedPathways,
        userProfile,
        selGoals
      );

      return scoredRecommendations.slice(0, 5);

    } catch (error) {
      console.error('Error generating goal-based recommendations:', error);
      return [];
    }
  }

  /**
   * Generate sequential pathway recommendations (pathway progression)
   */
  async getSequentialRecommendations(
    userProfile: UserProfile,
    completedPathwayId: string
  ): Promise<{
    nextRecommendations: RecommendationResult[];
    progressionPath: ProgressionPath;
    advancedOptions: RecommendationResult[];
  }> {
    try {
      await validateSession(userProfile.userId);

      // Get completed pathway details
      const completedPathway = await this.registry.getTemplate(completedPathwayId, userProfile.userId);
      if (!completedPathway) {
        throw new Error('Completed pathway not found');
      }

      // Analyze progression opportunities
      const progressionAnalysis = await this.analyzeProgressionOpportunities(
        completedPathway.template,
        userProfile
      );

      // Get next level recommendations
      const nextRecommendations = await this.getProgressionRecommendations(
        progressionAnalysis,
        userProfile
      );

      // Get advanced options
      const advancedOptions = await this.getAdvancedOptions(
        completedPathway.template,
        userProfile
      );

      return {
        nextRecommendations,
        progressionPath: progressionAnalysis.progressionPath,
        advancedOptions
      };

    } catch (error) {
      console.error('Error generating sequential recommendations:', error);
      return {
        nextRecommendations: [],
        progressionPath: { steps: [], estimatedDuration: '', objectives: [] },
        advancedOptions: []
      };
    }
  }

  // Private helper methods

  private async analyzeUserNeeds(userProfile: UserProfile): Promise<{
    selPriorities: (keyof SELCompetencyScore)[];
    emotionalNeeds: string[];
    culturalConsiderations: string[];
    urgencyIndicators: string[];
    traumaConsiderations: string[];
    learningStyleNeeds: string[];
  }> {
    // Identify SEL priorities based on current scores
    const selPriorities = this.identifySELPriorities(userProfile.currentSELScores);

    // Analyze emotional state for needs
    const emotionalNeeds = this.analyzeEmotionalNeeds(userProfile.emotionalState);

    // Extract cultural considerations
    const culturalConsiderations = this.extractUserCulturalNeeds(userProfile.culturalContext);

    // Identify urgency indicators
    const urgencyIndicators = this.identifyUrgencyIndicators(
      userProfile.currentChallenges,
      userProfile.riskFactors,
      userProfile.emotionalState
    );

    // Analyze trauma considerations
    const traumaConsiderations = userProfile.traumaHistory 
      ? this.generateTraumaConsiderations(userProfile)
      : [];

    // Learning style needs
    const learningStyleNeeds = this.analyzeLearningStyleNeeds(userProfile.learningStyle);

    return {
      selPriorities,
      emotionalNeeds,
      culturalConsiderations,
      urgencyIndicators,
      traumaConsiderations,
      learningStyleNeeds
    };
  }

  private identifySELPriorities(selScores: SELCompetencyScore): (keyof SELCompetencyScore)[] {
    const threshold = 70; // Scores below this indicate priority areas
    const priorities: (keyof SELCompetencyScore)[] = [];

    Object.entries(selScores).forEach(([competency, score]) => {
      if (score < threshold) {
        priorities.push(competency as keyof SELCompetencyScore);
      }
    });

    // Sort by lowest scores first
    priorities.sort((a, b) => selScores[a] - selScores[b]);

    return priorities.slice(0, 3); // Top 3 priorities
  }

  private analyzeEmotionalNeeds(emotionalState: EmotionalState): string[] {
    const needs: string[] = [];

    if (emotionalState.regulation < 0.6) {
      needs.push('emotional_regulation_support');
    }
    if (emotionalState.intensity > 7) {
      needs.push('intensity_management');
    }
    if (emotionalState.valence < -0.3) {
      needs.push('mood_support');
    }
    if (emotionalState.complexity > 0.7) {
      needs.push('emotional_clarity');
    }

    return needs;
  }

  private extractUserCulturalNeeds(culturalContext: CulturalContext): string[] {
    const needs: string[] = [];

    if (culturalContext.communicationStyle === 'indirect') {
      needs.push('indirect_communication_adaptation');
    }
    if (culturalContext.valueSystem.includes('collectivist')) {
      needs.push('collectivist_value_integration');
    }
    if (culturalContext.valueSystem.includes('family_centered')) {
      needs.push('family_inclusive_approach');
    }

    return needs;
  }

  private identifyUrgencyIndicators(
    challenges: string[],
    riskFactors: RiskFactor[],
    emotionalState: EmotionalState
  ): string[] {
    const indicators: string[] = [];

    // High-risk factors
    const highRiskFactors = riskFactors.filter(rf => rf.severity === 'high' || rf.severity === 'critical');
    if (highRiskFactors.length > 0) {
      indicators.push('high_risk_factors_present');
    }

    // Current challenges
    if (challenges.length > 3) {
      indicators.push('multiple_current_challenges');
    }

    // Emotional distress
    if (emotionalState.intensity > 8 || emotionalState.regulation < 0.3) {
      indicators.push('emotional_distress');
    }

    return indicators;
  }

  private generateTraumaConsiderations(userProfile: UserProfile): string[] {
    return [
      'trauma_informed_approach_required',
      'safety_prioritization',
      'choice_and_control_emphasis',
      'cultural_trauma_awareness',
      'strength_based_focus'
    ];
  }

  private analyzeLearningStyleNeeds(learningStyle: LearningStyleProfile): string[] {
    const needs: string[] = [];

    if (learningStyle.attentionSpan === 'short') {
      needs.push('short_session_adaptation');
    }
    if (learningStyle.socialPreference === 'individual') {
      needs.push('individual_focused_content');
    }
    if (learningStyle.feedbackPreference === 'immediate') {
      needs.push('immediate_feedback_integration');
    }

    return needs;
  }

  private async getEligiblePathways(userProfile: UserProfile): Promise<PathwayTemplate[]> {
    return await this.registry.getTemplates({
      ageGroup: userProfile.ageGroup,
      culturalContext: userProfile.culturalContext,
      accessTier: userProfile.accessTier,
      traumaInformed: userProfile.traumaHistory,
      userId: userProfile.userId
    });
  }

  private async scorePathways(
    pathways: PathwayTemplate[],
    userProfile: UserProfile,
    needsAnalysis: any,
    options: any
  ): Promise<Array<{ pathway: PathwayTemplate; score: number; reasoning: any }>> {
    const scoredPathways = [];

    for (const pathway of pathways) {
      // Skip already completed pathways
      if (userProfile.completedPathways.includes(pathway.id)) {
        continue;
      }

      const score = await this.calculateRecommendationScore(
        pathway,
        userProfile,
        needsAnalysis,
        options
      );

      scoredPathways.push({
        pathway,
        score: score.total,
        reasoning: score.breakdown
      });
    }

    // Sort by score descending
    scoredPathways.sort((a, b) => b.score - a.score);

    return scoredPathways;
  }

  private async calculateRecommendationScore(
    pathway: PathwayTemplate,
    userProfile: UserProfile,
    needsAnalysis: any,
    options: any
  ): Promise<{ total: number; breakdown: any }> {
    const scores = {
      selAlignment: 0,          // 0-25 points
      culturalFit: 0,           // 0-20 points
      ageAppropriate: 0,        // 0-15 points
      traumaInformed: 0,        // 0-15 points
      learningStyleMatch: 0,    // 0-10 points
      urgencyAlignment: 0,      // 0-10 points
      goalAlignment: 0,         // 0-5 points
    };

    // SEL alignment scoring
    const selMatchCount = needsAnalysis.selPriorities.filter(
      (priority: keyof SELCompetencyScore) => pathway.SELCompetencyFocus[priority] > 0
    ).length;
    scores.selAlignment = Math.min(25, selMatchCount * 8);

    // Cultural fit scoring
    const culturalFit = await this.assessCulturalFit(pathway, userProfile.culturalContext);
    scores.culturalFit = culturalFit * 20;

    // Age appropriate
    scores.ageAppropriate = pathway.targetAge === userProfile.ageGroup ? 15 : 0;

    // Trauma-informed scoring
    if (userProfile.traumaHistory) {
      const metadata = pathway.metadata as any;
      if (metadata?.tt6Alignment?.traumaInformed) {
        scores.traumaInformed = 15;
      }
    } else {
      scores.traumaInformed = 10; // Default score if no trauma history
    }

    // Learning style match
    scores.learningStyleMatch = this.assessLearningStyleMatch(pathway, userProfile.learningStyle);

    // Urgency alignment
    if (options.prioritizeImmediate && needsAnalysis.urgencyIndicators.length > 0) {
      scores.urgencyAlignment = this.assessUrgencyAlignment(pathway, needsAnalysis.urgencyIndicators);
    }

    // Goal alignment
    scores.goalAlignment = this.assessGoalAlignment(pathway, userProfile.goals);

    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);

    return { total, breakdown: scores };
  }

  private async assessCulturalFit(
    pathway: PathwayTemplate,
    culturalContext: CulturalContext
  ): Promise<number> {
    const metadata = pathway.metadata as any;
    
    if (!metadata?.culturalValidation) return 0.5; // Neutral if no validation data

    const validatedCultures = metadata.culturalValidation.validatedCultures || [];
    const hasDirectMatch = culturalContext.culturalBackground.some(bg =>
      validatedCultures.includes(bg)
    );

    if (hasDirectMatch) return 1.0;
    if (validatedCultures.includes('universal')) return 0.8;

    // Check for cultural adaptations
    if (pathway.culturalAdaptations && pathway.culturalAdaptations.length > 0) {
      return 0.6;
    }

    return 0.3; // Low cultural fit
  }

  private assessLearningStyleMatch(
    pathway: PathwayTemplate,
    learningStyle: LearningStyleProfile
  ): number {
    let score = 0;

    // Check interaction types match learning style
    const hasVisualElements = pathway.steps.some(step =>
      step.content.interactiveElements?.some(elem =>
        ['draw_canvas', 'choice_selection', 'slider'].includes(elem.type)
      )
    );
    if (hasVisualElements && learningStyle.preferredModalities.includes('visual')) {
      score += 3;
    }

    // Check session duration vs attention span
    const avgDuration = pathway.estimatedDurationMinutes / pathway.steps.length;
    if (learningStyle.attentionSpan === 'short' && avgDuration <= 15) {
      score += 3;
    } else if (learningStyle.attentionSpan === 'medium' && avgDuration <= 25) {
      score += 2;
    }

    // Check social preference
    const hasPeerInteraction = pathway.steps.some(step => step.type === 'peer_interaction');
    if (learningStyle.socialPreference !== 'individual' && hasPeerInteraction) {
      score += 2;
    } else if (learningStyle.socialPreference === 'individual' && !hasPeerInteraction) {
      score += 2;
    }

    return Math.min(10, score);
  }

  private assessUrgencyAlignment(pathway: PathwayTemplate, urgencyIndicators: string[]): number {
    const urgentCategories = ['crisis_support', 'trauma_informed', 'emotional_regulation'];
    
    if (urgencyIndicators.includes('emotional_distress') && 
        pathway.category === 'emotional_regulation') {
      return 10;
    }
    
    if (urgencyIndicators.includes('high_risk_factors_present') && 
        urgentCategories.includes(pathway.category)) {
      return 8;
    }

    return 0;
  }

  private assessGoalAlignment(pathway: PathwayTemplate, goals: PersonalGoal[]): number {
    const highPriorityGoals = goals.filter(goal => goal.priority === 'high' || goal.priority === 'urgent');
    
    const alignmentCount = highPriorityGoals.filter(goal => {
      if (goal.category === 'sel_development') return true;
      if (goal.category === 'emotional' && pathway.category === 'emotional_regulation') return true;
      if (goal.category === 'social' && pathway.category === 'social_connection') return true;
      return false;
    }).length;

    return Math.min(5, alignmentCount * 2);
  }

  private async generateRecommendationResults(
    scoredRecommendations: Array<{ pathway: PathwayTemplate; score: number; reasoning: any }>,
    userProfile: UserProfile,
    needsAnalysis: any
  ): Promise<RecommendationResult[]> {
    const results: RecommendationResult[] = [];

    for (const { pathway, score, reasoning } of scoredRecommendations) {
      const result: RecommendationResult = {
        pathway,
        recommendationScore: score,
        recommendationType: this.determineRecommendationType(pathway, userProfile, needsAnalysis),
        reasoning: await this.generateRecommendationReasoning(pathway, userProfile, reasoning),
        culturalFit: await this.analyzeCulturalFit(pathway, userProfile.culturalContext),
        personalization: this.generatePersonalizationSuggestions(pathway, userProfile),
        prerequisites: await this.analyzePrerequisites(pathway, userProfile),
        expectedOutcomes: this.generateExpectedOutcomes(pathway, userProfile),
        adaptations: this.generateAdaptationRecommendations(pathway, userProfile),
        timeline: this.generateRecommendationTimeline(pathway, userProfile),
        supportNeeds: this.analyzeSupportNeeds(pathway, userProfile),
        riskConsiderations: this.analyzeRiskConsiderations(pathway, userProfile)
      };

      results.push(result);
    }

    return results;
  }

  // Additional helper methods continue here...
  
  private determineRecommendationType(
    pathway: PathwayTemplate,
    userProfile: UserProfile,
    needsAnalysis: any
  ): RecommendationResult['recommendationType'] {
    if (needsAnalysis.urgencyIndicators.length > 0) {
      return 'immediate';
    }
    if (pathway.category === 'crisis_support') {
      return 'crisis_support';
    }
    if (pathway.difficultyLevel === 'foundation') {
      return 'short_term';
    }
    return 'long_term';
  }

  private async generateRecommendationReasoning(
    pathway: PathwayTemplate,
    userProfile: UserProfile,
    reasoning: any
  ): Promise<RecommendationReasoning> {
    return {
      primaryReason: this.generatePrimaryReason(pathway, userProfile, reasoning),
      supportingFactors: this.generateSupportingFactors(pathway, userProfile, reasoning),
      selAlignmentScore: reasoning.selAlignment / 25,
      culturalResonanceScore: reasoning.culturalFit / 20,
      personalGoalAlignment: reasoning.goalAlignment / 5,
      traumaInformedScore: reasoning.traumaInformed / 15,
      developmentalAppropriatenessScore: reasoning.ageAppropriate / 15,
      engagementPredictionScore: reasoning.learningStyleMatch / 10
    };
  }

  private generatePrimaryReason(pathway: PathwayTemplate, userProfile: UserProfile, reasoning: any): string {
    if (reasoning.selAlignment > 15) {
      return `Strongly aligns with your current SEL development priorities`;
    }
    if (reasoning.culturalFit > 15) {
      return `Culturally adapted for your background and values`;
    }
    if (reasoning.traumaInformed > 10 && userProfile.traumaHistory) {
      return `Designed with trauma-informed care principles`;
    }
    return `Good foundational pathway for continued growth`;
  }

  private generateSupportingFactors(pathway: PathwayTemplate, userProfile: UserProfile, reasoning: any): string[] {
    const factors = [];
    
    if (reasoning.ageAppropriate > 0) {
      factors.push(`Age-appropriate for ${userProfile.ageGroup} learners`);
    }
    if (reasoning.learningStyleMatch > 5) {
      factors.push(`Matches your preferred learning style`);
    }
    if (pathway.culturalAdaptations?.length > 0) {
      factors.push(`Includes cultural adaptations for your background`);
    }

    return factors;
  }

  private async analyzeCulturalFit(pathway: PathwayTemplate, culturalContext: CulturalContext): Promise<CulturalFitAnalysis> {
    const overallFitScore = await this.assessCulturalFit(pathway, culturalContext);
    
    return {
      overallFitScore,
      communicationStyleMatch: this.assessCommunicationStyleMatch(pathway, culturalContext),
      valueSystemAlignment: this.assessValueSystemAlignment(pathway, culturalContext),
      culturalElementsPresent: this.identifyCulturalElements(pathway),
      adaptationsNeeded: this.identifyNeededAdaptations(pathway, culturalContext),
      culturalStrengthsLeveraged: this.identifyLeveragedStrengths(pathway, culturalContext),
      potentialCulturalBarriers: this.identifyPotentialBarriers(pathway, culturalContext)
    };
  }

  private assessCommunicationStyleMatch(pathway: PathwayTemplate, culturalContext: CulturalContext): number {
    const hasContextualPrompts = pathway.steps.some(step =>
      step.content.contextualPrompts && Object.keys(step.content.contextualPrompts).length > 0
    );
    
    if (culturalContext.communicationStyle === 'indirect' && hasContextualPrompts) {
      return 0.9;
    }
    return 0.6; // Default moderate match
  }

  private assessValueSystemAlignment(pathway: PathwayTemplate, culturalContext: CulturalContext): number {
    let alignment = 0.5; // Base alignment

    if (culturalContext.valueSystem.includes('family_centered')) {
      const hasFamilyFocus = JSON.stringify(pathway).toLowerCase().includes('family');
      if (hasFamilyFocus) alignment += 0.3;
    }

    if (culturalContext.valueSystem.includes('collectivist')) {
      const hasCollectiveElements = pathway.steps.some(step => step.type === 'peer_interaction');
      if (hasCollectiveElements) alignment += 0.2;
    }

    return Math.min(1.0, alignment);
  }

  private identifyCulturalElements(pathway: PathwayTemplate): string[] {
    const elements = [];
    
    if (pathway.culturalAdaptations && pathway.culturalAdaptations.length > 0) {
      elements.push(...pathway.culturalAdaptations.map(ca => `${ca} cultural adaptation`));
    }
    
    const hasContextualPrompts = pathway.steps.some(step =>
      step.content.contextualPrompts && Object.keys(step.content.contextualPrompts).length > 0
    );
    if (hasContextualPrompts) {
      elements.push('Culturally contextualized prompts');
    }

    return elements;
  }

  private identifyNeededAdaptations(pathway: PathwayTemplate, culturalContext: CulturalContext): string[] {
    const adaptations = [];

    if (culturalContext.communicationStyle === 'indirect') {
      adaptations.push('Indirect communication style adaptation');
    }

    if (culturalContext.primaryLanguage !== 'en') {
      adaptations.push('Language and translation considerations');
    }

    return adaptations;
  }

  private identifyLeveragedStrengths(pathway: PathwayTemplate, culturalContext: CulturalContext): string[] {
    const strengths = [];

    if (culturalContext.valueSystem.includes('collectivist')) {
      const hasGroupElements = pathway.steps.some(step => step.type === 'peer_interaction');
      if (hasGroupElements) {
        strengths.push('Leverages collectivist values through group activities');
      }
    }

    return strengths;
  }

  private identifyPotentialBarriers(pathway: PathwayTemplate, culturalContext: CulturalContext): string[] {
    const barriers = [];

    if (culturalContext.communicationStyle === 'indirect') {
      const hasDirectPrompts = pathway.steps.some(step =>
        step.content.primaryPrompt.includes('directly') || step.content.primaryPrompt.includes('clearly state')
      );
      if (hasDirectPrompts) {
        barriers.push('Direct communication prompts may feel uncomfortable');
      }
    }

    return barriers;
  }

  private generatePersonalizationSuggestions(pathway: PathwayTemplate, userProfile: UserProfile): PersonalizationSuggestions {
    return {
      learningStyleAdaptations: this.generateLearningStyleAdaptations(pathway, userProfile.learningStyle),
      attentionSpanModifications: this.generateAttentionSpanModifications(pathway, userProfile.learningStyle),
      interactionStyleAdjustments: this.generateInteractionAdjustments(pathway, userProfile),
      contentPersonalization: this.generateContentPersonalization(pathway, userProfile),
      pacingRecommendations: this.generatePacingRecommendations(pathway, userProfile),
      motivationalElements: this.generateMotivationalElements(pathway, userProfile)
    };
  }

  private generateLearningStyleAdaptations(pathway: PathwayTemplate, learningStyle: LearningStyleProfile): string[] {
    const adaptations = [];

    if (learningStyle.preferredModalities.includes('visual')) {
      adaptations.push('Add visual elements and diagrams to reflections');
    }
    if (learningStyle.preferredModalities.includes('kinesthetic')) {
      adaptations.push('Include movement and embodied practices');
    }

    return adaptations;
  }

  private generateAttentionSpanModifications(pathway: PathwayTemplate, learningStyle: LearningStyleProfile): string[] {
    const modifications = [];

    if (learningStyle.attentionSpan === 'short') {
      modifications.push('Break sessions into 10-15 minute segments');
      modifications.push('Add more frequent breaks and check-ins');
    }

    return modifications;
  }

  private generateInteractionAdjustments(pathway: PathwayTemplate, userProfile: UserProfile): string[] {
    const adjustments = [];

    if (userProfile.learningStyle.socialPreference === 'individual') {
      adjustments.push('Adapt group activities for individual reflection');
    }

    return adjustments;
  }

  private generateContentPersonalization(pathway: PathwayTemplate, userProfile: UserProfile): string[] {
    const personalization = [];

    userProfile.interests.forEach(interest => {
      personalization.push(`Incorporate examples related to ${interest}`);
    });

    return personalization;
  }

  private generatePacingRecommendations(pathway: PathwayTemplate, userProfile: UserProfile): string[] {
    const recommendations = [];

    if (userProfile.learningStyle.processingSpeed === 'deliberate') {
      recommendations.push('Allow extra time for deep reflection');
    }

    return recommendations;
  }

  private generateMotivationalElements(pathway: PathwayTemplate, userProfile: UserProfile): string[] {
    const elements = [];

    userProfile.protectiveFactors.forEach(factor => {
      if (factor.strength === 'strong' || factor.strength === 'exceptional') {
        elements.push(`Leverage your strength in ${factor.description}`);
      }
    });

    return elements;
  }

  // Continue with remaining helper methods...

  private async analyzePrerequisites(pathway: PathwayTemplate, userProfile: UserProfile): Promise<PrerequisiteAnalysis> {
    const hasPrerequisites = pathway.prerequisitePathways && pathway.prerequisitePathways.length > 0;
    const missingPrerequisites = [];

    if (hasPrerequisites) {
      for (const prereqId of pathway.prerequisitePathways) {
        if (!userProfile.completedPathways.includes(prereqId)) {
          missingPrerequisites.push(prereqId);
        }
      }
    }

    return {
      hasPrerequisites,
      missingPrerequisites,
      alternativePathways: [],
      skillGapAssessment: this.generateSkillGapAssessment(pathway, userProfile),
      preparationRecommendations: this.generatePreparationRecommendations(pathway, userProfile)
    };
  }

  private generateSkillGapAssessment(pathway: PathwayTemplate, userProfile: UserProfile): SkillGapAssessment[] {
    const assessments: SkillGapAssessment[] = [];

    Object.entries(pathway.SELCompetencyFocus).forEach(([competency, requiredLevel]) => {
      const currentLevel = userProfile.currentSELScores[competency as keyof SELCompetencyScore];
      const gap = Math.max(0, requiredLevel - currentLevel);

      if (gap > 10) { // Significant gap
        assessments.push({
          selCompetency: competency as keyof SELCompetencyScore,
          currentLevel,
          requiredLevel,
          gap,
          bridgingStrategies: this.generateBridgingStrategies(competency, gap)
        });
      }
    });

    return assessments;
  }

  private generateBridgingStrategies(competency: string, gap: number): string[] {
    const strategies: Record<string, string[]> = {
      selfAwareness: ['Practice mindful reflection', 'Keep an emotion journal', 'Try body awareness exercises'],
      selfManagement: ['Learn grounding techniques', 'Practice deep breathing', 'Develop coping strategies'],
      socialAwareness: ['Practice perspective-taking', 'Observe social dynamics', 'Read emotional cues'],
      relationshipSkills: ['Practice active listening', 'Work on communication skills', 'Build empathy'],
      responsibleDecisionMaking: ['Consider consequences', 'Practice problem-solving', 'Seek diverse perspectives']
    };

    return strategies[competency] || ['Engage in foundational practices'];
  }

  private generatePreparationRecommendations(pathway: PathwayTemplate, userProfile: UserProfile): string[] {
    const recommendations = [];

    if (pathway.difficultyLevel === 'integration' || pathway.difficultyLevel === 'mastery') {
      recommendations.push('Complete foundational pathways first');
    }

    if (userProfile.traumaHistory && pathway.category !== 'trauma_informed') {
      recommendations.push('Consider trauma-informed preparation');
    }

    return recommendations;
  }

  private generateExpectedOutcomes(pathway: PathwayTemplate, userProfile: UserProfile): ExpectedOutcome[] {
    const outcomes: ExpectedOutcome[] = [];

    Object.entries(pathway.SELCompetencyFocus).forEach(([competency, focus]) => {
      if (focus > 0) {
        const currentLevel = userProfile.currentSELScores[competency as keyof SELCompetencyScore];
        const projectedImprovement = Math.min(20, focus * 0.5); // Conservative projection

        outcomes.push({
          metric: `${competency} improvement`,
          baselineValue: currentLevel,
          projectedImprovement,
          timeframe: `${pathway.estimatedDurationMinutes / 60} hours`,
          confidence: 0.7,
          culturallyRelevant: true,
          measurabilityScore: 0.8
        });
      }
    });

    return outcomes;
  }

  private generateAdaptationRecommendations(pathway: PathwayTemplate, userProfile: UserProfile): AdaptationRecommendation[] {
    const adaptations: AdaptationRecommendation[] = [];

    if (userProfile.traumaHistory) {
      adaptations.push({
        adaptationType: 'trauma_informed',
        description: 'Enhance safety measures and choice options',
        importance: 'critical',
        implementationGuidance: 'Add safety checks and exit strategies',
        expectedImpact: 0.9
      });
    }

    if (userProfile.culturalContext.communicationStyle === 'indirect') {
      adaptations.push({
        adaptationType: 'cultural',
        description: 'Adapt prompts for indirect communication style',
        importance: 'high',
        implementationGuidance: 'Use gentle, contextual prompting',
        expectedImpact: 0.7
      });
    }

    return adaptations;
  }

  private generateRecommendationTimeline(pathway: PathwayTemplate, userProfile: UserProfile): RecommendationTimeline {
    return {
      immediateActions: ['Review pathway overview', 'Set up safe practice space'],
      weekOneGoals: ['Complete first 2 steps', 'Establish reflection routine'],
      firstMonthMilestones: ['Complete pathway', 'Demonstrate skill application'],
      longerTermObjectives: ['Integrate learnings into daily life', 'Support others in similar journey'],
      checkpointSchedule: [
        {
          timing: 'Week 1',
          purpose: 'Early engagement assessment',
          assessmentFocus: ['emotional_safety', 'cultural_fit'],
          adaptationOpportunities: ['pacing', 'support_level']
        },
        {
          timing: 'Week 2',
          purpose: 'Progress evaluation',
          assessmentFocus: ['skill_development', 'engagement'],
          adaptationOpportunities: ['difficulty_level', 'personalization']
        }
      ]
    };
  }

  private analyzeSupportNeeds(pathway: PathwayTemplate, userProfile: UserProfile): SupportNeedAnalysis {
    return {
      familyInvolvementLevel: this.determineFamilyInvolvementLevel(userProfile),
      professionalSupportNeeded: this.assessProfessionalSupportNeed(pathway, userProfile),
      peerSupportOpportunities: this.identifyPeerSupportOpportunities(pathway, userProfile),
      mentorshipRecommendations: this.generateMentorshipRecommendations(pathway, userProfile),
      communityResourcesNeeded: this.identifyCommunityResources(pathway, userProfile),
      culturalSupportIntegration: this.identifyCulturalSupportNeeds(pathway, userProfile)
    };
  }

  private determineFamilyInvolvementLevel(userProfile: UserProfile): SupportNeedAnalysis['familyInvolvementLevel'] {
    if (userProfile.culturalContext.valueSystem.includes('family_centered')) {
      return 'significant';
    }
    if (userProfile.supportSystem.familySupport === 'strong') {
      return 'moderate';
    }
    return 'minimal';
  }

  private assessProfessionalSupportNeed(pathway: PathwayTemplate, userProfile: UserProfile): boolean {
    return userProfile.riskFactors.some(rf => rf.severity === 'high' || rf.severity === 'critical') ||
           pathway.category === 'trauma_informed' ||
           pathway.category === 'crisis_support';
  }

  private identifyPeerSupportOpportunities(pathway: PathwayTemplate, userProfile: UserProfile): string[] {
    const opportunities = [];

    if (pathway.steps.some(step => step.type === 'peer_interaction')) {
      opportunities.push('Pathway includes peer interaction components');
    }

    if (userProfile.learningStyle.socialPreference !== 'individual') {
      opportunities.push('Consider forming study groups or reflection partnerships');
    }

    return opportunities;
  }

  private generateMentorshipRecommendations(pathway: PathwayTemplate, userProfile: UserProfile): string[] {
    const recommendations = [];

    if (userProfile.supportSystem.mentorSupport === 'limited') {
      recommendations.push('Consider finding a mentor with pathway experience');
    }

    if (userProfile.culturalContext.culturalBackground.length > 0) {
      recommendations.push('Seek mentors with shared cultural background');
    }

    return recommendations;
  }

  private identifyCommunityResources(pathway: PathwayTemplate, userProfile: UserProfile): string[] {
    const resources = [];

    if (pathway.category === 'crisis_support') {
      resources.push('Crisis hotlines and emergency support services');
    }

    if (userProfile.culturalContext.culturalBackground.length > 0) {
      resources.push('Cultural community centers and support groups');
    }

    return resources;
  }

  private identifyCulturalSupportNeeds(pathway: PathwayTemplate, userProfile: UserProfile): string[] {
    const needs = [];

    if (userProfile.culturalContext.culturalBackground.length > 0) {
      needs.push('Integration with cultural community practices');
    }

    if (userProfile.culturalContext.communicationStyle === 'high_context') {
      needs.push('Cultural interpretation and context support');
    }

    return needs;
  }

  private analyzeRiskConsiderations(pathway: PathwayTemplate, userProfile: UserProfile): RiskConsideration[] {
    const considerations: RiskConsideration[] = [];

    // Trauma-related risks
    if (userProfile.traumaHistory && pathway.category !== 'trauma_informed') {
      considerations.push({
        riskType: 'trauma_activation',
        likelihood: 'moderate',
        severity: 'high',
        mitigationStrategies: ['Add trigger warnings', 'Provide exit strategies', 'Include grounding techniques'],
        monitoringRecommendations: ['Regular emotional safety checks', 'Professional consultation'],
        escalationTriggers: ['Emotional overwhelm', 'Dissociation', 'Panic responses']
      });
    }

    // Cultural misalignment risks
    const culturalFit = userProfile.culturalContext.culturalBackground.some(bg =>
      pathway.culturalAdaptations?.includes(bg)
    );
    if (!culturalFit) {
      considerations.push({
        riskType: 'cultural_misalignment',
        likelihood: 'moderate',
        severity: 'moderate',
        mitigationStrategies: ['Provide cultural context', 'Adapt examples and scenarios'],
        monitoringRecommendations: ['Cultural resonance feedback', 'Adaptation effectiveness'],
        escalationTriggers: ['Consistent cultural discomfort', 'Value conflicts']
      });
    }

    return considerations;
  }

  private applyRecommendationFilters(
    recommendations: RecommendationResult[],
    options: any
  ): RecommendationResult[] {
    let filtered = [...recommendations];

    // Apply limit
    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    // Filter by trauma-informed requirement
    if (options.traumaInformedRequired) {
      filtered = filtered.filter(rec => {
        const metadata = rec.pathway.metadata as any;
        return metadata?.tt6Alignment?.traumaInformed;
      });
    }

    // Cultural priority filtering
    if (options.culturalPriority === 'high') {
      filtered = filtered.filter(rec => rec.culturalFit.overallFitScore > 0.7);
    }

    return filtered;
  }

  // Additional specialized methods...

  private async scoreCrisisPathways(
    pathways: PathwayTemplate[],
    userProfile: UserProfile,
    crisisIndicators: any
  ): Promise<RecommendationResult[]> {
    const results: RecommendationResult[] = [];

    for (const pathway of pathways) {
      const crisisScore = this.calculateCrisisRelevanceScore(pathway, crisisIndicators);
      const safetyScore = this.calculateCrisisSafetyScore(pathway, userProfile);
      const accessibilityScore = this.calculateCrisisAccessibilityScore(pathway, userProfile);

      const totalScore = (crisisScore * 0.4) + (safetyScore * 0.4) + (accessibilityScore * 0.2);

      if (totalScore > 0.6) { // Minimum threshold for crisis recommendations
        const result: RecommendationResult = {
          pathway,
          recommendationScore: totalScore * 100,
          recommendationType: 'crisis_support',
          reasoning: {
            primaryReason: 'Designed for crisis support and immediate safety',
            supportingFactors: ['Trauma-informed approach', 'Immediate accessibility', 'Safety prioritized'],
            selAlignmentScore: crisisScore,
            culturalResonanceScore: await this.assessCulturalFit(pathway, userProfile.culturalContext),
            personalGoalAlignment: 0.8, // High for crisis situations
            traumaInformedScore: safetyScore,
            developmentalAppropriatenessScore: pathway.targetAge === userProfile.ageGroup ? 1 : 0.5,
            engagementPredictionScore: accessibilityScore
          },
          culturalFit: await this.analyzeCulturalFit(pathway, userProfile.culturalContext),
          personalization: this.generateCrisisPersonalization(pathway, userProfile, crisisIndicators),
          prerequisites: { hasPrerequisites: false, missingPrerequisites: [], alternativePathways: [], skillGapAssessment: [], preparationRecommendations: [] },
          expectedOutcomes: this.generateCrisisExpectedOutcomes(pathway, crisisIndicators),
          adaptations: this.generateCrisisAdaptations(pathway, userProfile, crisisIndicators),
          timeline: this.generateCrisisTimeline(pathway, crisisIndicators),
          supportNeeds: this.generateCrisisSupportNeeds(pathway, userProfile, crisisIndicators),
          riskConsiderations: this.generateCrisisRiskConsiderations(pathway, userProfile, crisisIndicators)
        };

        results.push(result);
      }
    }

    return results.sort((a, b) => b.recommendationScore - a.recommendationScore);
  }

  private calculateCrisisRelevanceScore(pathway: PathwayTemplate, crisisIndicators: any): number {
    let score = 0;

    if (pathway.category === 'crisis_support') {
      score += 0.4;
    } else if (pathway.category === 'trauma_informed') {
      score += 0.3;
    } else if (pathway.category === 'emotional_regulation') {
      score += 0.2;
    }

    // Check for immediate applicability
    const hasImmediateSteps = pathway.steps.some(step =>
      step.type === 'skill_practice' && step.estimatedDurationMinutes <= 15
    );
    if (hasImmediateSteps) {
      score += 0.2;
    }

    return Math.min(1.0, score);
  }

  private calculateCrisisSafetyScore(pathway: PathwayTemplate, userProfile: UserProfile): number {
    const metadata = pathway.metadata as any;
    
    if (!metadata?.safetyRating) return 0.3;

    const safetyScores = {
      'excellent': 1.0,
      'good': 0.8,
      'adequate': 0.5,
      'needs_improvement': 0.2,
      'restricted': 0.0
    };

    return safetyScores[metadata.safetyRating.overallRating] || 0.3;
  }

  private calculateCrisisAccessibilityScore(pathway: PathwayTemplate, userProfile: UserProfile): number {
    let score = 0.5; // Base accessibility

    // Short duration for immediate access
    if (pathway.estimatedDurationMinutes <= 30) {
      score += 0.3;
    }

    // No prerequisites for immediate access
    if (!pathway.prerequisitePathways || pathway.prerequisitePathways.length === 0) {
      score += 0.2;
    }

    return Math.min(1.0, score);
  }

  private generateCrisisPersonalization(
    pathway: PathwayTemplate,
    userProfile: UserProfile,
    crisisIndicators: any
  ): PersonalizationSuggestions {
    return {
      learningStyleAdaptations: ['Simplified, clear instructions', 'Focus on immediate safety'],
      attentionSpanModifications: ['Very short sessions (5-10 minutes)', 'Single-focus activities'],
      interactionStyleAdjustments: ['Minimal complexity', 'Clear yes/no options'],
      contentPersonalization: ['Safety-focused examples', 'Cultural safety considerations'],
      pacingRecommendations: ['Immediate implementation', 'Self-paced with support'],
      motivationalElements: ['Safety achievement recognition', 'Small step acknowledgment']
    };
  }

  private generateCrisisExpectedOutcomes(pathway: PathwayTemplate, crisisIndicators: any): ExpectedOutcome[] {
    return [
      {
        metric: 'Immediate safety increase',
        baselineValue: crisisIndicators.riskLevel === 'critical' ? 20 : 40,
        projectedImprovement: 30,
        timeframe: 'Immediate to 24 hours',
        confidence: 0.8,
        culturallyRelevant: true,
        measurabilityScore: 0.9
      },
      {
        metric: 'Emotional regulation improvement',
        baselineValue: 30,
        projectedImprovement: 25,
        timeframe: '1-3 days',
        confidence: 0.7,
        culturallyRelevant: true,
        measurabilityScore: 0.8
      }
    ];
  }

  private generateCrisisAdaptations(
    pathway: PathwayTemplate,
    userProfile: UserProfile,
    crisisIndicators: any
  ): AdaptationRecommendation[] {
    return [
      {
        adaptationType: 'trauma_informed',
        description: 'Enhanced safety protocols and immediate exit strategies',
        importance: 'critical',
        implementationGuidance: 'Provide multiple safety options and immediate support contacts',
        expectedImpact: 0.95
      },
      {
        adaptationType: 'cultural',
        description: 'Cultural safety and respect integration',
        importance: 'high',
        implementationGuidance: 'Ensure cultural values are honored in crisis support',
        expectedImpact: 0.8
      }
    ];
  }

  private generateCrisisTimeline(pathway: PathwayTemplate, crisisIndicators: any): RecommendationTimeline {
    return {
      immediateActions: ['Ensure immediate safety', 'Access crisis support contacts'],
      weekOneGoals: ['Stabilize emotional state', 'Implement safety strategies'],
      firstMonthMilestones: ['Establish support systems', 'Develop coping strategies'],
      longerTermObjectives: ['Build resilience', 'Prevent future crises'],
      checkpointSchedule: [
        {
          timing: '24 hours',
          purpose: 'Immediate safety assessment',
          assessmentFocus: ['safety_status', 'support_activation'],
          adaptationOpportunities: ['support_level', 'intervention_intensity']
        },
        {
          timing: '3 days',
          purpose: 'Stabilization check',
          assessmentFocus: ['emotional_regulation', 'coping_effectiveness'],
          adaptationOpportunities: ['strategy_adjustment', 'additional_support']
        }
      ]
    };
  }

  private generateCrisisSupportNeeds(
    pathway: PathwayTemplate,
    userProfile: UserProfile,
    crisisIndicators: any
  ): SupportNeedAnalysis {
    return {
      familyInvolvementLevel: crisisIndicators.immediateSupport ? 'intensive' : 'significant',
      professionalSupportNeeded: true,
      peerSupportOpportunities: ['Crisis support groups', 'Peer crisis counselors'],
      mentorshipRecommendations: ['Crisis-experienced mentors', 'Professional guidance'],
      communityResourcesNeeded: ['Crisis hotlines', 'Emergency services', 'Cultural crisis support'],
      culturalSupportIntegration: ['Cultural healers', 'Community elders', 'Cultural crisis protocols']
    };
  }

  private generateCrisisRiskConsiderations(
    pathway: PathwayTemplate,
    userProfile: UserProfile,
    crisisIndicators: any
  ): RiskConsideration[] {
    return [
      {
        riskType: 'escalation',
        likelihood: crisisIndicators.riskLevel === 'critical' ? 'high' : 'moderate',
        severity: 'critical',
        mitigationStrategies: ['24/7 support access', 'Professional intervention ready', 'Family notification protocols'],
        monitoringRecommendations: ['Continuous safety monitoring', 'Regular professional check-ins'],
        escalationTriggers: ['Increased distress', 'Safety plan failure', 'Support system breakdown']
      },
      {
        riskType: 'cultural_isolation',
        likelihood: 'moderate',
        severity: 'high',
        mitigationStrategies: ['Cultural community integration', 'Cultural liaison involvement'],
        monitoringRecommendations: ['Cultural support effectiveness', 'Community connection strength'],
        escalationTriggers: ['Cultural disconnect', 'Community rejection', 'Identity crisis']
      }
    ];
  }

  private extractChallengesFromJournal(journalText: string): string[] {
    const challengeKeywords = ['difficult', 'struggle', 'hard', 'challenge', 'problem', 'stress', 'anxious', 'sad', 'overwhelmed'];
    const sentences = journalText.split(/[.!?]/).filter(s => s.trim().length > 10);
    
    return sentences
      .filter(sentence => challengeKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      ))
      .map(sentence => sentence.trim())
      .slice(0, 3); // Limit to top 3 challenges
  }

  private async extractCulturalConsiderations(
    journalText: string,
    culturalContext: CulturalContext
  ): Promise<string[]> {
    const considerations = [];

    // Look for cultural references in journal
    const culturalKeywords = ['family', 'tradition', 'culture', 'community', 'heritage', 'religion', 'spiritual'];
    const hasCulturalContent = culturalKeywords.some(keyword =>
      journalText.toLowerCase().includes(keyword)
    );

    if (hasCulturalContent) {
      considerations.push('Journal reflects cultural values and connections');
    }

    // Add cultural context considerations
    if (culturalContext.communicationStyle === 'indirect') {
      considerations.push('Consider indirect communication preferences in pathway selection');
    }

    if (culturalContext.valueSystem.includes('family_centered')) {
      considerations.push('Honor family-centered values in pathway approach');
    }

    return considerations;
  }

  // Continue with progression analysis methods...

  private async analyzeProgressionOpportunities(
    completedPathway: PathwayTemplate,
    userProfile: UserProfile
  ): Promise<{
    progressionPath: ProgressionPath;
    readinessScore: number;
    recommendedDirection: string;
  }> {
    const progressionPath: ProgressionPath = {
      steps: [],
      estimatedDuration: '',
      objectives: []
    };

    // Analyze what was learned and what's next
    const selGrowthAreas = this.identifyGrowthOpportunities(completedPathway, userProfile);
    const nextLevelPathways = await this.identifyNextLevelPathways(completedPathway, userProfile);
    const readinessScore = this.calculateProgressionReadiness(completedPathway, userProfile);

    return {
      progressionPath,
      readinessScore,
      recommendedDirection: this.determineProgressionDirection(selGrowthAreas, nextLevelPathways)
    };
  }

  private identifyGrowthOpportunities(
    completedPathway: PathwayTemplate,
    userProfile: UserProfile
  ): (keyof SELCompetencyScore)[] {
    // Identify which SEL areas showed growth and which need more development
    const growthAreas: (keyof SELCompetencyScore)[] = [];

    Object.entries(completedPathway.SELCompetencyFocus).forEach(([competency, focus]) => {
      const currentScore = userProfile.currentSELScores[competency as keyof SELCompetencyScore];
      if (currentScore < 80 && focus > 0) { // Still room for growth
        growthAreas.push(competency as keyof SELCompetencyScore);
      }
    });

    return growthAreas;
  }

  private async identifyNextLevelPathways(
    completedPathway: PathwayTemplate,
    userProfile: UserProfile
  ): Promise<PathwayTemplate[]> {
    // Find pathways that build on the completed one
    const allPathways = await this.registry.getTemplates({
      ageGroup: userProfile.ageGroup,
      culturalContext: userProfile.culturalContext,
      accessTier: userProfile.accessTier,
      userId: userProfile.userId
    });

    return allPathways.filter(pathway => {
      // Same category but higher difficulty
      if (pathway.category === completedPathway.category) {
        const difficultyOrder = ['foundation', 'exploration', 'integration', 'mastery'];
        const completedIndex = difficultyOrder.indexOf(completedPathway.difficultyLevel);
        const pathwayIndex = difficultyOrder.indexOf(pathway.difficultyLevel);
        return pathwayIndex > completedIndex;
      }

      // Related categories
      const relatedCategories = this.getRelatedCategories(completedPathway.category);
      return relatedCategories.includes(pathway.category);
    });
  }

  private getRelatedCategories(category: PathwayCategory): PathwayCategory[] {
    const relationships: Record<PathwayCategory, PathwayCategory[]> = {
      'self_discovery': ['emotional_regulation', 'purpose_exploration', 'cultural_identity'],
      'emotional_regulation': ['resilience_building', 'social_connection', 'self_discovery'],
      'social_connection': ['leadership_development', 'emotional_regulation', 'cultural_identity'],
      'purpose_exploration': ['leadership_development', 'self_discovery', 'resilience_building'],
      'resilience_building': ['emotional_regulation', 'trauma_informed', 'purpose_exploration'],
      'leadership_development': ['social_connection', 'purpose_exploration', 'cultural_identity'],
      'cultural_identity': ['self_discovery', 'social_connection', 'leadership_development'],
      'trauma_informed': ['resilience_building', 'emotional_regulation', 'self_discovery'],
      'crisis_support': ['trauma_informed', 'emotional_regulation', 'resilience_building']
    };

    return relationships[category] || [];
  }

  private calculateProgressionReadiness(
    completedPathway: PathwayTemplate,
    userProfile: UserProfile
  ): number {
    let readiness = 0.5; // Base readiness

    // Check SEL score improvements
    const avgSELScore = Object.values(userProfile.currentSELScores).reduce((sum, score) => sum + score, 0) / 5;
    if (avgSELScore > 70) readiness += 0.2;
    if (avgSELScore > 80) readiness += 0.1;

    // Check engagement patterns
    const recentEngagement = userProfile.engagementPatterns.slice(-5);
    const avgCompletion = recentEngagement.reduce((sum, ep) => sum + ep.completionRate, 0) / recentEngagement.length;
    if (avgCompletion > 0.8) readiness += 0.2;

    return Math.min(1.0, readiness);
  }

  private determineProgressionDirection(
    growthAreas: (keyof SELCompetencyScore)[],
    nextLevelPathways: PathwayTemplate[]
  ): string {
    if (growthAreas.length > 2) {
      return 'Continue deepening current competencies';
    } else {
      return 'Ready to explore related areas and advanced concepts';
    }
  }

  private async getProgressionRecommendations(
    progressionAnalysis: any,
    userProfile: UserProfile
  ): Promise<RecommendationResult[]> {
    // Implementation would generate recommendations based on progression analysis
    return [];
  }

  private async getAdvancedOptions(
    completedPathway: PathwayTemplate,
    userProfile: UserProfile
  ): Promise<RecommendationResult[]> {
    // Implementation would identify advanced pathways and specializations
    return [];
  }

  private async scoreGoalBasedPathways(
    pathways: PathwayTemplate[],
    userProfile: UserProfile,
    selGoals: any
  ): Promise<RecommendationResult[]> {
    // Implementation would score pathways based on specific SEL goals
    return [];
  }
}

interface ProgressionPath {
  steps: string[];
  estimatedDuration: string;
  objectives: string[];
}

export default PathwayRecommendationEngine;