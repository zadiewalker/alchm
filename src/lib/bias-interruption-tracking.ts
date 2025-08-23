// ALCHM Bias Interruption & Growth Tracking System
// Real-time bias detection integrated with daily journaling and progress visualization

import { BiasAwarenessEngine, BiasAnalysisResult, DetectedBias } from './bias-awareness-engine';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { CulturalContext, IdentityJourney } from '@/types/identity-schema';
import { EmotionalEntry } from '@/types/emotional-wellness-schema';

export interface BiasInterruptionConfig {
  geminiApiKey: string;
  interruptionSensitivity: 'low' | 'medium' | 'high' | 'maximum';
  journalIntegration: boolean;
  realTimeDetection: boolean;
  growthTracking: boolean;
  communityLearning: boolean;
  culturalAdaptation: boolean;
  interventionIntensity: 'gentle' | 'moderate' | 'intensive';
  progressVisualization: boolean;
  personalizedInsights: boolean;
}

export interface BiasInterruptionRequest {
  userId: string;
  content: string;
  context: InterruptionContext;
  identityProfile: IdentityExplorationProfile;
  culturalContext: CulturalContext;
  previousInterruptions: BiasInterruption[];
  userState: UserState;
  sessionId?: string;
}

export interface InterruptionContext {
  source: 'journal_entry' | 'reflection' | 'conversation' | 'decision_making' | 'planning';
  emotionalState: string;
  environmentalContext: string;
  timeOfDay: string;
  previousContext: string[];
  culturalTriggers?: string[];
  stressLevel: number; // 0-1
  openness: number; // 0-1, readiness for feedback
}

export interface UserState {
  biasAwarenessLevel: string;
  currentGrowthPhase: string;
  recentProgress: number; // 0-1
  emotionalWellbeing: number; // 0-1
  culturalSafety: number; // 0-1
  learningCapacity: number; // 0-1
  interventionHistory: InterventionSummary[];
}

export interface BiasInterruption {
  interruptionId: string;
  userId: string;
  detectedBias: DetectedBias;
  interruptionTrigger: InterruptionTrigger;
  interventionApproach: InterventionApproach;
  culturalAdaptation: CulturalAdaptation;
  userResponse: UserResponse;
  learningOutcome: LearningOutcome;
  followUpPlan: FollowUpPlan;
  effectivenessScore: number; // 0-1
  timestamp: Date;
  sessionContext: SessionContext;
}

export interface InterruptionTrigger {
  triggerType: 'automatic' | 'user_requested' | 'pattern_detected' | 'escalation';
  confidenceLevel: number; // 0-1
  urgencyLevel: 'low' | 'medium' | 'high' | 'immediate';
  culturalSensitivity: 'standard' | 'high' | 'maximum';
  traumaAwareness: boolean;
  supportResourcesNeeded: boolean;
}

export interface InterventionApproach {
  approachType: 'socratic_questioning' | 'perspective_taking' | 'cultural_education' | 'empathy_building' | 'self_reflection' | 'community_dialogue';
  intensity: 'gentle' | 'moderate' | 'direct';
  culturalFraming: string;
  languageAdaptation: string;
  personalizedElements: PersonalizedElement[];
  safetyConsiderations: SafetyConsideration[];
  expectedDuration: number; // minutes
}

export interface BiasGrowthTracker {
  trackerId: string;
  userId: string;
  trackingPeriod: DateRange;
  biasCategories: BiasCategory[];
  progressMetrics: ProgressMetric[];
  milestones: GrowthMilestone[];
  setbacks: GrowthSetback[];
  breakthroughs: GrowthBreakthrough[];
  overallTrajectory: GrowthTrajectory;
  culturalCompetencyGrowth: CulturalCompetencyProgress;
  empathyDevelopment: EmpathyDevelopmentProgress;
  systemicAwarenessGrowth: SystemicAwarenessProgress;
  communityImpact: CommunityImpactMeasurement;
}

export interface BiasProgressVisualization {
  visualizationId: string;
  userId: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  progressCharts: ProgressChart[];
  trendAnalysis: TrendAnalysis;
  comparisonMetrics: ComparisonMetric[];
  insightHighlights: InsightHighlight[];
  goalProgress: GoalProgress[];
  celebrationMoments: CelebrationMoment[];
  nextStepsRecommendations: NextStepRecommendation[];
}

export class BiasInterruptionTrackingSystem {
  private config: BiasInterruptionConfig;
  private biasAwarenessEngine: BiasAwarenessEngine;
  private geminiClient: GeminiClient;
  private interruptionEngine: BiasInterruptionEngine;
  private growthTracker: BiasGrowthTracker;
  private progressVisualizer: BiasProgressVisualizer;
  private culturalAdaptationEngine: CulturalAdaptationEngine;

  constructor(
    config: BiasInterruptionConfig,
    biasAwarenessEngine: BiasAwarenessEngine
  ) {
    this.config = config;
    this.biasAwarenessEngine = biasAwarenessEngine;
    this.geminiClient = new GeminiClient(config.geminiApiKey);
    this.interruptionEngine = new BiasInterruptionEngine(config);
    this.growthTracker = new BiasGrowthTracker(config);
    this.progressVisualizer = new BiasProgressVisualizer(config);
    this.culturalAdaptationEngine = new CulturalAdaptationEngine(config);
  }

  // Real-time bias detection and interruption
  async performBiasInterruption(
    request: BiasInterruptionRequest
  ): Promise<BiasInterruptionResult> {
    
    console.log('Performing bias interruption for:', request.userId);
    
    // Step 1: Detect potential biases using the bias awareness engine
    const biasAnalysis = await this.biasAwarenessEngine.detectBias(
      request.content,
      {
        userId: request.userId,
        culturalContext: request.culturalContext,
        identityElements: this.extractIdentityElements(request.identityProfile),
        previousReflections: await this.getPreviousReflections(request.userId)
      }
    );
    
    // Step 2: Assess if interruption is needed and appropriate
    const interruptionAssessment = await this.assessInterruptionNeed(
      biasAnalysis,
      request.context,
      request.userState
    );
    
    if (!interruptionAssessment.shouldIntervene) {
      return this.createNoInterventionResult(biasAnalysis, interruptionAssessment);
    }
    
    // Step 3: Design culturally appropriate intervention
    const interventionDesign = await this.designCulturallyAppropriateIntervention(
      biasAnalysis.detectedBiases[0], // Primary bias
      request.identityProfile,
      request.culturalContext,
      request.userState
    );
    
    // Step 4: Generate personalized interruption content
    const interruptionContent = await this.generateInterruptionContent(
      interventionDesign,
      biasAnalysis,
      request
    );
    
    // Step 5: Create follow-up learning plan
    const followUpPlan = await this.createFollowUpLearningPlan(
      biasAnalysis.detectedBiases[0],
      interventionDesign,
      request.identityProfile
    );
    
    // Step 6: Record the interruption for tracking
    const biasInterruption: BiasInterruption = {
      interruptionId: `interruption_${Date.now()}`,
      userId: request.userId,
      detectedBias: biasAnalysis.detectedBiases[0],
      interruptionTrigger: interruptionAssessment.trigger,
      interventionApproach: interventionDesign,
      culturalAdaptation: await this.createCulturalAdaptation(interventionDesign, request.culturalContext),
      userResponse: {} as UserResponse, // Will be filled when user responds
      learningOutcome: {} as LearningOutcome, // Will be assessed later
      followUpPlan,
      effectivenessScore: 0, // Will be calculated based on user response
      timestamp: new Date(),
      sessionContext: {
        sessionId: request.sessionId || `session_${Date.now()}`,
        source: request.context.source,
        emotionalState: request.context.emotionalState
      }
    };
    
    // Step 7: Update growth tracking
    await this.updateGrowthTracking(request.userId, biasInterruption);
    
    return {
      shouldIntervene: true,
      interruption: biasInterruption,
      interruptionContent,
      biasAnalysis,
      culturalNotes: interventionDesign.culturalFraming,
      supportResources: await this.identifySupportResources(biasAnalysis, request.identityProfile),
      nextSteps: followUpPlan.immediateActions
    };
  }

  // Track bias growth and progress over time
  async updateBiasGrowthTracking(
    userId: string,
    interruption: BiasInterruption,
    userResponse?: UserResponse
  ): Promise<BiasGrowthUpdate> {
    
    console.log('Updating bias growth tracking for:', userId);
    
    // Step 1: Load current growth tracker
    const currentTracker = await this.loadGrowthTracker(userId);
    
    // Step 2: Analyze growth from this interruption
    const growthAnalysis = await this.analyzeGrowthFromInterruption(
      interruption,
      userResponse,
      currentTracker
    );
    
    // Step 3: Update progress metrics
    const updatedMetrics = await this.updateProgressMetrics(
      currentTracker.progressMetrics,
      growthAnalysis
    );
    
    // Step 4: Check for milestones and breakthroughs
    const milestoneAnalysis = await this.checkForMilestones(
      updatedMetrics,
      currentTracker.milestones
    );
    
    // Step 5: Assess overall trajectory changes
    const trajectoryUpdate = await this.assessTrajectoryChanges(
      currentTracker.overallTrajectory,
      growthAnalysis
    );
    
    // Step 6: Generate personalized insights
    const personalizedInsights = await this.generatePersonalizedGrowthInsights(
      growthAnalysis,
      currentTracker,
      interruption
    );
    
    // Step 7: Update cultural competency tracking
    const culturalCompetencyUpdate = await this.updateCulturalCompetencyTracking(
      currentTracker.culturalCompetencyGrowth,
      interruption,
      growthAnalysis
    );
    
    // Step 8: Save updated tracker
    const updatedTracker = await this.saveUpdatedGrowthTracker(userId, {
      ...currentTracker,
      progressMetrics: updatedMetrics,
      milestones: milestoneAnalysis.updatedMilestones,
      breakthroughs: [...currentTracker.breakthroughs, ...milestoneAnalysis.newBreakthroughs],
      overallTrajectory: trajectoryUpdate,
      culturalCompetencyGrowth: culturalCompetencyUpdate
    });
    
    return {
      updatedTracker,
      growthAnalysis,
      newMilestones: milestoneAnalysis.newBreakthroughs,
      personalizedInsights,
      recommendedNextSteps: await this.generateRecommendedNextSteps(updatedTracker)
    };
  }

  // Generate progress visualization
  async generateProgressVisualization(
    userId: string,
    timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  ): Promise<BiasProgressVisualization> {
    
    console.log('Generating progress visualization for:', userId, timeframe);
    
    // Step 1: Load growth tracking data
    const growthData = await this.loadGrowthTrackingData(userId, timeframe);
    
    // Step 2: Generate progress charts
    const progressCharts = await this.generateProgressCharts(growthData, timeframe);
    
    // Step 3: Analyze trends and patterns
    const trendAnalysis = await this.analyzeTrends(growthData, timeframe);
    
    // Step 4: Create comparison metrics
    const comparisonMetrics = await this.createComparisonMetrics(growthData, timeframe);
    
    // Step 5: Generate insight highlights
    const insightHighlights = await this.generateInsightHighlights(
      trendAnalysis,
      progressCharts
    );
    
    // Step 6: Assess goal progress
    const goalProgress = await this.assessGoalProgress(userId, growthData);
    
    // Step 7: Identify celebration moments
    const celebrationMoments = await this.identifyCelebrationMoments(growthData);
    
    // Step 8: Generate next steps recommendations
    const nextStepsRecommendations = await this.generateNextStepsRecommendations(
      trendAnalysis,
      goalProgress
    );
    
    return {
      visualizationId: `viz_${userId}_${timeframe}_${Date.now()}`,
      userId,
      timeframe,
      progressCharts,
      trendAnalysis,
      comparisonMetrics,
      insightHighlights,
      goalProgress,
      celebrationMoments,
      nextStepsRecommendations
    };
  }

  // Assess if interruption is needed
  private async assessInterruptionNeed(
    biasAnalysis: BiasAnalysisResult,
    context: InterruptionContext,
    userState: UserState
  ): Promise<InterruptionAssessment> {
    
    // Step 1: Check bias confidence and severity
    const primaryBias = biasAnalysis.detectedBiases[0];
    if (!primaryBias || primaryBias.confidenceScore < 0.6) {
      return {
        shouldIntervene: false,
        reason: 'Low bias confidence or no significant bias detected',
        trigger: null
      };
    }
    
    // Step 2: Assess user readiness for intervention
    if (context.openness < 0.4 || context.stressLevel > 0.7) {
      return {
        shouldIntervene: false,
        reason: 'User not in optimal state for bias interruption',
        trigger: null,
        alternativeApproach: 'Suggest reflection time or support resources'
      };
    }
    
    // Step 3: Check cultural safety considerations
    if (userState.culturalSafety < 0.6 && primaryBias.biasCategory === 'cultural') {
      return {
        shouldIntervene: false,
        reason: 'Cultural safety threshold not met for cultural bias interruption',
        trigger: null,
        alternativeApproach: 'Offer cultural affirmation and support'
      };
    }
    
    // Step 4: Determine intervention trigger
    const urgencyLevel = this.determineUrgencyLevel(primaryBias, context);
    const triggerType = this.determineTriggerType(biasAnalysis, context, userState);
    
    return {
      shouldIntervene: true,
      reason: 'Bias detected with appropriate conditions for intervention',
      trigger: {
        triggerType,
        confidenceLevel: primaryBias.confidenceScore,
        urgencyLevel,
        culturalSensitivity: this.determineCulturalSensitivity(primaryBias, context),
        traumaAwareness: this.assessTraumaAwareness(primaryBias, userState),
        supportResourcesNeeded: this.assessSupportResourceNeed(primaryBias, userState)
      }
    };
  }

  // Design culturally appropriate intervention
  private async designCulturallyAppropriateIntervention(
    detectedBias: DetectedBias,
    identityProfile: IdentityExplorationProfile,
    culturalContext: CulturalContext,
    userState: UserState
  ): Promise<InterventionApproach> {
    
    const interventionPrompt = this.buildCulturalInterventionPrompt(
      detectedBias,
      identityProfile,
      culturalContext,
      userState
    );
    
    try {
      const geminiResponse = await this.geminiClient.generateContent({
        contents: [{
          parts: [{
            text: interventionPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          maxOutputTokens: 1500
        }
      });

      const interventionDesign = this.parseInterventionDesign(
        geminiResponse.response.text(),
        detectedBias,
        culturalContext
      );

      return interventionDesign;

    } catch (error) {
      console.error('Intervention design failed:', error);
      return this.generateFallbackIntervention(detectedBias, culturalContext);
    }
  }

  // Build cultural intervention prompt
  private buildCulturalInterventionPrompt(
    detectedBias: DetectedBias,
    identityProfile: IdentityExplorationProfile,
    culturalContext: CulturalContext,
    userState: UserState
  ): string {
    
    return `
Design a culturally appropriate bias interruption intervention.

DETECTED BIAS:
- Type: ${detectedBias.biasType}
- Category: ${detectedBias.biasCategory}
- Severity: ${detectedBias.severity}
- Evidence: "${detectedBias.evidenceText}"
- Confidence: ${detectedBias.confidenceScore}

USER CULTURAL PROFILE:
- Primary Culture: ${culturalContext.primaryCulture}
- Communication Style: ${culturalContext.communicationStyle}
- Cultural Values: ${identityProfile.culturalIdentity?.culturalValues?.map(v => v.name).join(', ') || 'Not specified'}

USER STATE:
- Bias Awareness Level: ${userState.biasAwarenessLevel}
- Growth Phase: ${userState.currentGrowthPhase}
- Emotional Wellbeing: ${userState.emotionalWellbeing}
- Cultural Safety: ${userState.culturalSafety}

INTERVENTION REQUIREMENTS:
1. Use culturally appropriate communication style
2. Honor cultural values and worldviews
3. Apply trauma-informed approaches
4. Maintain cultural safety and respect
5. Encourage growth without judgment
6. Provide culturally relevant examples
7. Offer culturally appropriate follow-up resources

CULTURAL CONSIDERATIONS:
- Respect power dynamics and historical context
- Use culturally resonant metaphors and examples
- Honor different ways of knowing and learning
- Consider family and community perspectives
- Respect spiritual and religious frameworks
- Be mindful of cultural trauma and healing

Design an intervention approach that will be effective and respectful for this cultural context.

Respond in JSON format:
{
  "approachType": "...",
  "intensity": "gentle|moderate|direct",
  "culturalFraming": "...",
  "languageAdaptation": "...",
  "personalizedElements": [
    {
      "element": "...",
      "culturalRelevance": "...",
      "implementation": "..."
    }
  ],
  "safetyConsiderations": [
    {
      "consideration": "...",
      "importance": "high|medium|low",
      "mitigation": "..."
    }
  ],
  "expectedDuration": number
}
`;
  }

  // Helper methods (implementations would be expanded)
  private extractIdentityElements(profile: IdentityExplorationProfile): any[] {
    // Implementation would extract relevant identity elements
    return [];
  }

  private async getPreviousReflections(userId: string): Promise<any[]> {
    // Implementation would load previous bias reflections
    return [];
  }

  private createNoInterventionResult(biasAnalysis: BiasAnalysisResult, assessment: InterruptionAssessment) {
    return {
      shouldIntervene: false,
      reason: assessment.reason,
      biasAnalysis,
      alternativeApproach: assessment.alternativeApproach
    };
  }

  // More helper methods would be implemented here...
}

// Supporting interfaces
interface BiasInterruptionResult {
  shouldIntervene: boolean;
  interruption?: BiasInterruption;
  interruptionContent?: any;
  biasAnalysis: BiasAnalysisResult;
  culturalNotes?: string;
  supportResources?: any[];
  nextSteps?: any[];
  reason?: string;
  alternativeApproach?: string;
}

interface InterruptionAssessment {
  shouldIntervene: boolean;
  reason: string;
  trigger: InterruptionTrigger | null;
  alternativeApproach?: string;
}

interface BiasGrowthUpdate {
  updatedTracker: BiasGrowthTracker;
  growthAnalysis: any;
  newMilestones: any[];
  personalizedInsights: any[];
  recommendedNextSteps: any[];
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface UserResponse {
  responseType: 'accepted' | 'dismissed' | 'requested_more' | 'reported_issue';
  feedback: string;
  emotionalResponse: number; // 0-1
  learningValue: number; // 0-1
  culturalAppropriateness: number; // 0-1
  timestamp: Date;
}

interface LearningOutcome {
  outcomeType: 'awareness_increased' | 'behavior_changed' | 'perspective_shifted' | 'skill_developed';
  description: string;
  evidence: string[];
  durability: 'temporary' | 'sustained' | 'integrated';
  culturalRelevance: number; // 0-1
}

interface FollowUpPlan {
  immediateActions: any[];
  shortTermGoals: any[];
  longTermDevelopment: any[];
  supportResources: any[];
  checkInSchedule: any[];
}

export { BiasInterruptionTrackingSystem };
export type {
  BiasInterruptionConfig,
  BiasInterruptionRequest,
  BiasInterruption,
  BiasGrowthTracker,
  BiasProgressVisualization
};