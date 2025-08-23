// ALCHM AI-Powered Wellness Prompting Engine
// GPT-4o integration for contextual emotional wellness prompts and interventions

import {
  EmotionalEntry,
  EmotionalState,
  BreathworkSession,
  MovementSession,
  RitualSession,
  CreativePractice,
  AlchemyProcess,
  EmotionalPattern,
  AIEmotionalInsight
} from '@/types/emotional-wellness-schema';

import { IdentityJourney, CulturalContext } from '@/types/identity-schema';

export interface WellnessPromptingConfig {
  algorithmVersion: string;
  gpt4ApiKey: string;
  promptingEnabled: boolean;
  realTimePromptsEnabled: boolean;
  contextualAwarenessEnabled: boolean;
  culturalAdaptationEnabled: boolean;
  traumaInformedPromptsEnabled: boolean;
  personalizationEnabled: boolean;
  timedInterventionsEnabled: boolean;
  progressAwarePromptsEnabled: boolean;
  communityWisdomIntegrationEnabled: boolean;
  ancestralWisdomPromptsEnabled: boolean;
  somaticAwarenessPromptsEnabled: boolean;
  creativityPromptsEnabled: boolean;
  ritualPromptsEnabled: boolean;
  breathworkPromptsEnabled: boolean;
  movementPromptsEnabled: boolean;
  journalingPromptsEnabled: boolean;
  reflectionPromptsEnabled: boolean;
  celebrationPromptsEnabled: boolean;
  supportPromptsEnabled: boolean;
}

export interface WellnessPromptContext {
  userId: string;
  currentEntry: EmotionalEntry;
  recentEntries: EmotionalEntry[];
  emotionalPatterns: EmotionalPattern[];
  identityJourney: IdentityJourney;
  culturalContext: CulturalContext;
  timeOfDay: string;
  dayOfWeek: string;
  season: string;
  environmentalContext: EnvironmentalContext;
  availableTime: number; // minutes
  energyLevel: number; // 1-10
  receptivity: WellnessReceptivity;
  personalPreferences: WellnessPreferences;
  traumaInformedConsiderations: TraumaInformedConsideration[];
  culturalSensitivities: CulturalSensitivity[];
  recentWellnessActivities: RecentWellnessActivity[];
  previousPromptResponses: PromptResponse[];
  currentLifeCircumstances: LifeCircumstance[];
  supportSystemStatus: SupportSystemStatus;
  communityConnectionLevel: number; // 0-1
  spiritualPracticeEngagement: number; // 0-1
}

export interface WellnessPrompt {
  promptId: string;
  userId: string;
  promptType: WellnessPromptType;
  emotionalTrigger: EmotionalTrigger;
  
  // Core prompt
  title: string;
  message: string;
  tone: PromptTone;
  urgency: PromptUrgency;
  
  // Suggested interventions
  breathworkSuggestions: BreathworkSuggestion[];
  movementSuggestions: MovementSuggestion[];
  ritualSuggestions: RitualSuggestion[];
  creativeSuggestions: CreativeSuggestion[];
  journalingSuggestions: JournalingSuggestion[];
  somaticSuggestions: SomaticSuggestion[];
  communityConnectionSuggestions: CommunityConnectionSuggestion[];
  natureSuggestions: NatureSuggestion[];
  nourishmentSuggestions: NourishmentSuggestion[];
  restSuggestions: RestSuggestion[];
  
  // Cultural and personalization
  culturalAdaptations: CulturalAdaptation[];
  personalizations: PromptPersonalization[];
  traumaInformedModifications: TraumaInformedModification[];
  accessibilityModifications: AccessibilityModification[];
  
  // Timing and context
  optimalTiming: OptimalTiming;
  contextualFactors: ContextualFactor[];
  environmentalConsiderations: EnvironmentalConsideration[];
  
  // AI insights
  aiReasoning: string;
  expectedOutcome: ExpectedOutcome;
  alternativePrompts: AlternativePrompt[];
  followUpPrompts: FollowUpPrompt[];
  
  // Engagement and effectiveness
  confidenceScore: number; // 0-1
  relevanceScore: number; // 0-1
  culturalSensitivityScore: number; // 0-1
  traumaInformedScore: number; // 0-1
  personalizationScore: number; // 0-1
  
  // Metadata
  generatedAt: Date;
  expiresAt: Date;
  priority: PromptPriority;
  category: WellnessCategory[];
  tags: string[];
  
  // User response tracking
  userResponse: PromptResponse | null;
  effectiveness: PromptEffectiveness | null;
  feedbackReceived: PromptFeedback | null;
}

export interface WellnessPromptingSession {
  sessionId: string;
  userId: string;
  sessionType: 'real_time' | 'scheduled' | 'pattern_based' | 'emergency' | 'celebration' | 'transition_support';
  
  // Session context
  triggerEvent: TriggerEvent;
  emotionalContext: EmotionalContext;
  environmentalContext: EnvironmentalContext;
  temporalContext: TemporalContext;
  
  // Generated prompts
  primaryPrompt: WellnessPrompt;
  backupPrompts: WellnessPrompt[];
  contextualPrompts: WellnessPrompt[];
  followUpPrompts: WellnessPrompt[];
  
  // Session outcomes
  prompts Delivered: WellnessPrompt[];
  userEngagement: UserEngagement;
  interventionsCompleted: InterventionCompletion[];
  wellnessOutcomes: WellnessOutcome[];
  emotionalShifts: EmotionalShift[];
  
  // Cultural and identity integration
  culturalWisdomShared: CulturalWisdomElement[];
  identityAffirmationProvided: IdentityAffirmation[];
  ancestralWisdomIntegrated: AncestralWisdomIntegration[];
  communityConnectionFacilitated: CommunityConnectionFacilitation[];
  
  // Learning and adaptation
  sessionLearnings: SessionLearning[];
  personalizations Applied: PersonalizationApplied[];
  adaptationsRequired: AdaptationRequired[];
  futurePromptingInsights: FuturePromptingInsight[];
  
  // Quality and effectiveness
  sessionEffectiveness: number; // 0-1
  culturalCompetence: number; // 0-1
  traumaInformedApproach: number; // 0-1
  userSatisfaction: number; // 0-1
  wellnessImpact: number; // 0-1
  
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
}

export interface WellnessInterventionRecommendation {
  recommendationId: string;
  interventionType: InterventionType;
  title: string;
  description: string;
  estimatedDuration: number; // minutes
  difficultyLevel: 'gentle' | 'moderate' | 'engaging' | 'immersive';
  
  // Specific intervention details
  breathworkDetails: BreathworkDetails | null;
  movementDetails: MovementDetails | null;
  ritualDetails: RitualDetails | null;
  creativeDetails: CreativeDetails | null;
  journalingDetails: JournalingDetails | null;
  somaticDetails: SomaticDetails | null;
  
  // Cultural and accessibility
  culturalAdaptations: CulturalAdaptation[];
  accessibilitySupport: AccessibilitySupport[];
  traumaInformedApproach: TraumaInformedApproach[];
  
  // Effectiveness and tracking
  expectedBenefits: ExpectedBenefit[];
  contraindications: Contraindication[];
  safetyConsiderations: SafetyConsideration[];
  progressIndicators: ProgressIndicator[];
  
  effectiveness Score: number; // 0-1
  culturalResonance: number; // 0-1
  personalRelevance: number; // 0-1
  accessibilityScore: number; // 0-1
}

export class WellnessPromptingEngine {
  private config: WellnessPromptingConfig;
  private gpt4Client: GPT4Client;
  private contextAnalyzer: ContextAnalyzer;
  private culturalAdaptationEngine: CulturalAdaptationEngine;
  private traumaInformedEngine: TraumaInformedEngine;
  private personalizationEngine: PersonalizationEngine;
  private interventionLibrary: InterventionLibrary;
  private promptLibrary: PromptLibrary;
  private effectivenessTracker: EffectivenessTracker;
  private timedInterventionScheduler: TimedInterventionScheduler;
  private communityWisdomIntegrator: CommunityWisdomIntegrator;
  private ancestralWisdomConnector: AncestralWisdomConnector;

  constructor(config: WellnessPromptingConfig) {
    this.config = config;
    this.gpt4Client = new GPT4Client(config.gpt4ApiKey);
    this.contextAnalyzer = new ContextAnalyzer(config);
    this.culturalAdaptationEngine = new CulturalAdaptationEngine(config);
    this.traumaInformedEngine = new TraumaInformedEngine(config);
    this.personalizationEngine = new PersonalizationEngine(config);
    this.interventionLibrary = new InterventionLibrary(config);
    this.promptLibrary = new PromptLibrary(config);
    this.effectivenessTracker = new EffectivenessTracker(config);
    this.timedInterventionScheduler = new TimedInterventionScheduler(config);
    this.communityWisdomIntegrator = new CommunityWisdomIntegrator(config);
    this.ancestralWisdomConnector = new AncestralWisdomConnector(config);
  }

  // Main wellness prompting function
  async generateWellnessPrompt(
    context: WellnessPromptContext,
    triggerType: 'real_time' | 'scheduled' | 'pattern_based' = 'real_time'
  ): Promise<WellnessPrompt> {
    
    console.log('Generating wellness prompt for user:', context.userId);
    
    // Step 1: Analyze emotional and contextual state
    const emotionalAnalysis = await this.analyzeEmotionalState(context);
    
    // Step 2: Identify intervention opportunities
    const interventionOpportunities = await this.identifyInterventionOpportunities(
      emotionalAnalysis,
      context
    );
    
    // Step 3: Generate contextual prompt using GPT-4o
    const gpt4Prompt = await this.generateGPT4Prompt(
      emotionalAnalysis,
      interventionOpportunities,
      context
    );
    
    // Step 4: Apply cultural and trauma-informed adaptations
    const culturallyAdaptedPrompt = await this.applyCulturalAdaptations(
      gpt4Prompt,
      context.culturalContext,
      context.traumaInformedConsiderations
    );
    
    // Step 5: Personalize based on user preferences and history
    const personalizedPrompt = await this.personalizePrompt(
      culturallyAdaptedPrompt,
      context.personalPreferences,
      context.previousPromptResponses
    );
    
    // Step 6: Generate specific intervention recommendations
    const interventionRecommendations = await this.generateInterventionRecommendations(
      personalizedPrompt,
      interventionOpportunities,
      context
    );
    
    // Step 7: Create final wellness prompt
    const wellnessPrompt: WellnessPrompt = {
      promptId: `prompt_${context.userId}_${Date.now()}`,
      userId: context.userId,
      promptType: this.determinePromptType(emotionalAnalysis, context),
      emotionalTrigger: emotionalAnalysis.primaryTrigger,
      title: personalizedPrompt.title,
      message: personalizedPrompt.message,
      tone: personalizedPrompt.tone,
      urgency: this.assessPromptUrgency(emotionalAnalysis),
      breathworkSuggestions: interventionRecommendations.breathwork,
      movementSuggestions: interventionRecommendations.movement,
      ritualSuggestions: interventionRecommendations.ritual,
      creativeSuggestions: interventionRecommendations.creative,
      journalingSuggestions: interventionRecommendations.journaling,
      somaticSuggestions: interventionRecommendations.somatic,
      communityConnectionSuggestions: interventionRecommendations.community,
      natureSuggestions: interventionRecommendations.nature,
      nourishmentSuggestions: interventionRecommendations.nourishment,
      restSuggestions: interventionRecommendations.rest,
      culturalAdaptations: personalizedPrompt.culturalAdaptations,
      personalizations: personalizedPrompt.personalizations,
      traumaInformedModifications: personalizedPrompt.traumaInformedModifications,
      accessibilityModifications: personalizedPrompt.accessibilityModifications,
      optimalTiming: this.calculateOptimalTiming(context),
      contextualFactors: this.extractContextualFactors(context),
      environmentalConsiderations: this.assessEnvironmentalConsiderations(context),
      aiReasoning: personalizedPrompt.reasoning,
      expectedOutcome: this.predictExpectedOutcome(personalizedPrompt, context),
      alternativePrompts: await this.generateAlternativePrompts(personalizedPrompt, context),
      followUpPrompts: await this.generateFollowUpPrompts(personalizedPrompt, context),
      confidenceScore: personalizedPrompt.confidence,
      relevanceScore: this.calculateRelevanceScore(personalizedPrompt, context),
      culturalSensitivityScore: this.calculateCulturalSensitivityScore(personalizedPrompt, context),
      traumaInformedScore: this.calculateTraumaInformedScore(personalizedPrompt, context),
      personalizationScore: this.calculatePersonalizationScore(personalizedPrompt, context),
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      priority: this.assessPromptPriority(emotionalAnalysis, context),
      category: this.categorizeWellnessPrompt(emotionalAnalysis, interventionOpportunities),
      tags: this.generatePromptTags(personalizedPrompt, context),
      userResponse: null,
      effectiveness: null,
      feedbackReceived: null
    };
    
    return wellnessPrompt;
  }

  // Generate contextual prompts using GPT-4o
  private async generateGPT4Prompt(
    emotionalAnalysis: EmotionalAnalysis,
    interventionOpportunities: InterventionOpportunity[],
    context: WellnessPromptContext
  ): Promise<GPT4PromptResult> {
    
    const prompt = this.buildGPT4AnalysisPrompt(emotionalAnalysis, interventionOpportunities, context);
    
    try {
      const gpt4Response = await this.gpt4Client.generateCompletion({
        messages: [{
          role: 'user',
          content: prompt
        }],
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      });
      
      const parsedResponse = this.parseGPT4Response(gpt4Response.content);
      return parsedResponse;
      
    } catch (error) {
      console.error('GPT-4o wellness prompt generation failed:', error);
      return this.generateFallbackPrompt(emotionalAnalysis, context);
    }
  }

  // Build comprehensive analysis prompt for GPT-4o
  private buildGPT4AnalysisPrompt(
    emotionalAnalysis: EmotionalAnalysis,
    interventionOpportunities: InterventionOpportunity[],
    context: WellnessPromptContext
  ): string {
    
    const culturalContext = context.culturalContext;
    const currentEntry = context.currentEntry;
    
    const prompt = `
You are a trauma-informed, culturally responsive AI wellness coach specializing in emotional alchemy and mental wellness. Analyze this person's current emotional state and generate a compassionate, actionable wellness prompt.

EMOTIONAL STATE ANALYSIS:
- Current Mood: ${currentEntry.moodBefore}/10 → ${currentEntry.moodAfter}/10 (after ${currentEntry.activity})
- Stress Level: ${currentEntry.stressLevel}/10
- Energy Level: ${context.energyLevel}/10
- Primary Emotions: ${emotionalAnalysis.primaryEmotions.join(', ')}
- Emotional Pattern: ${emotionalAnalysis.patternDetected}
- Recent Activity: ${currentEntry.activity}
- Reflection: "${currentEntry.reflectionText}"

CULTURAL CONTEXT:
- Background: ${JSON.stringify(culturalContext)}
- Available Time: ${context.availableTime} minutes
- Time of Day: ${context.timeOfDay}
- Environment: ${context.environmentalContext.setting}

INTERVENTION OPPORTUNITIES:
${interventionOpportunities.map(opp => `- ${opp.type}: ${opp.description} (readiness: ${opp.readiness})`).join('\n')}

TRAUMA-INFORMED CONSIDERATIONS:
${context.traumaInformedConsiderations.map(c => `- ${c.consideration}: ${c.approach}`).join('\n')}

Please generate a wellness prompt that:

1. ACKNOWLEDGES their current emotional state with validation and compassion
2. OFFERS a specific, actionable intervention appropriate for their available time
3. HONORS their cultural background and values
4. USES trauma-informed language that emphasizes choice and agency
5. PROVIDES gentle encouragement without pressure
6. INCLUDES 2-3 specific intervention suggestions with estimated times

Response must be in JSON format:
{
  "title": "Brief, encouraging title",
  "message": "Compassionate, culturally sensitive message that validates their experience and offers support",
  "tone": "gentle|encouraging|supportive|celebratory|grounding",
  "primaryIntervention": {
    "type": "breathwork|movement|creative|journaling|ritual|somatic",
    "title": "Specific intervention name",
    "description": "Clear, simple instructions",
    "duration": "estimated minutes",
    "benefit": "what this will help with"
  },
  "alternativeInterventions": [
    {
      "type": "intervention_type",
      "title": "Alternative option",
      "description": "Instructions",
      "duration": "minutes"
    }
  ],
  "culturalAdaptations": [
    "specific cultural considerations or adaptations"
  ],
  "traumaInformedApproach": [
    "trauma-informed language or modifications"
  ],
  "reasoning": "Brief explanation of why these interventions were chosen",
  "confidence": 0.85
}

Remember: This person has written "${currentEntry.reflectionText}" - meet them where they are with deep compassion and practical support.
`;
    
    return prompt;
  }

  // Process emotional state for prompt generation
  private async analyzeEmotionalState(context: WellnessPromptContext): Promise<EmotionalAnalysis> {
    
    const currentEntry = context.currentEntry;
    const recentEntries = context.recentEntries;
    
    // Analyze current emotional state
    const primaryEmotions = this.extractPrimaryEmotions(currentEntry.emotionalState);
    const emotionalIntensity = this.calculateEmotionalIntensity(currentEntry);
    const stressLevel = currentEntry.stressLevel;
    const moodChange = currentEntry.moodAfter - currentEntry.moodBefore;
    
    // Detect patterns from recent entries
    const patternDetected = this.detectEmotionalPattern(recentEntries);
    const trendDirection = this.calculateTrendDirection(recentEntries);
    
    // Identify primary emotional trigger
    const primaryTrigger = this.identifyPrimaryTrigger(currentEntry, context);
    
    // Assess intervention readiness
    const interventionReadiness = this.assessInterventionReadiness(context);
    
    // Cultural emotional expression analysis
    const culturalEmotionalContext = this.analyzeCulturalEmotionalContext(
      currentEntry,
      context.culturalContext
    );
    
    const analysis: EmotionalAnalysis = {
      primaryEmotions,
      secondaryEmotions: this.extractSecondaryEmotions(currentEntry.emotionalState),
      emotionalIntensity,
      stressLevel,
      moodChange,
      patternDetected,
      trendDirection,
      primaryTrigger,
      interventionReadiness,
      culturalEmotionalContext,
      traumaIndicators: this.detectTraumaIndicators(currentEntry, context),
      resilienceFactors: this.identifyResilienceFactors(currentEntry, context),
      supportNeeds: this.assessSupportNeeds(currentEntry, context),
      urgencyLevel: this.assessUrgencyLevel(currentEntry, context),
      readinessForGrowth: this.assessGrowthReadiness(currentEntry, context),
      culturalStrengths: this.identifyCulturalStrengths(context),
      communityConnectionNeeds: this.assessCommunityConnectionNeeds(context)
    };
    
    return analysis;
  }

  // Identify specific intervention opportunities
  private async identifyInterventionOpportunities(
    emotionalAnalysis: EmotionalAnalysis,
    context: WellnessPromptContext
  ): Promise<InterventionOpportunity[]> {
    
    const opportunities: InterventionOpportunity[] = [];
    
    // Breathwork opportunities
    if (emotionalAnalysis.stressLevel > 6 || emotionalAnalysis.primaryEmotions.includes('anxiety')) {
      opportunities.push({
        type: 'breathwork',
        description: '3-minute grounding breath practice',
        readiness: this.calculateBreathworkReadiness(emotionalAnalysis, context),
        culturalRelevance: this.assessCulturalRelevance('breathwork', context),
        timeRequired: 3,
        difficultyLevel: 'gentle',
        traumaInformed: true,
        expectedBenefit: 'nervous system regulation and grounding'
      });
    }
    
    // Movement opportunities
    if (emotionalAnalysis.primaryEmotions.includes('frustration') || emotionalAnalysis.primaryEmotions.includes('anger')) {
      opportunities.push({
        type: 'movement',
        description: 'Gentle movement to release tension',
        readiness: this.calculateMovementReadiness(emotionalAnalysis, context),
        culturalRelevance: this.assessCulturalRelevance('movement', context),
        timeRequired: 5,
        difficultyLevel: 'moderate',
        traumaInformed: true,
        expectedBenefit: 'emotional release and physical tension relief'
      });
    }
    
    // Creative expression opportunities
    if (emotionalAnalysis.emotionalIntensity > 7 || emotionalAnalysis.patternDetected === 'processing_heavy_emotions') {
      opportunities.push({
        type: 'creative',
        description: 'Creative expression for emotional processing',
        readiness: this.calculateCreativeReadiness(emotionalAnalysis, context),
        culturalRelevance: this.assessCulturalRelevance('creative', context),
        timeRequired: 10,
        difficultyLevel: 'engaging',
        traumaInformed: true,
        expectedBenefit: 'emotional expression and insight'
      });
    }
    
    // Journaling opportunities
    if (context.currentEntry.reflectionText.length < 50 || emotionalAnalysis.readinessForGrowth > 0.7) {
      opportunities.push({
        type: 'journaling',
        description: 'Guided reflection and emotional exploration',
        readiness: this.calculateJournalingReadiness(emotionalAnalysis, context),
        culturalRelevance: this.assessCulturalRelevance('journaling', context),
        timeRequired: 8,
        difficultyLevel: 'moderate',
        traumaInformed: true,
        expectedBenefit: 'clarity and emotional processing'
      });
    }
    
    // Ritual opportunities
    if (emotionalAnalysis.culturalEmotionalContext.ritualAppropriate) {
      opportunities.push({
        type: 'ritual',
        description: 'Cultural healing ritual or ceremony',
        readiness: this.calculateRitualReadiness(emotionalAnalysis, context),
        culturalRelevance: this.assessCulturalRelevance('ritual', context),
        timeRequired: 15,
        difficultyLevel: 'immersive',
        traumaInformed: true,
        expectedBenefit: 'spiritual connection and cultural healing'
      });
    }
    
    // Community connection opportunities
    if (emotionalAnalysis.communityConnectionNeeds > 0.6) {
      opportunities.push({
        type: 'community',
        description: 'Connect with supportive community',
        readiness: this.calculateCommunityReadiness(emotionalAnalysis, context),
        culturalRelevance: this.assessCulturalRelevance('community', context),
        timeRequired: 20,
        difficultyLevel: 'engaging',
        traumaInformed: true,
        expectedBenefit: 'social support and belonging'
      });
    }
    
    return opportunities.filter(opp => opp.readiness > 0.5);
  }

  // Parse GPT-4o response
  private parseGPT4Response(response: string): GPT4PromptResult {
    try {
      const parsed = JSON.parse(response);
      return {
        title: parsed.title,
        message: parsed.message,
        tone: parsed.tone,
        primaryIntervention: parsed.primaryIntervention,
        alternativeInterventions: parsed.alternativeInterventions || [],
        culturalAdaptations: parsed.culturalAdaptations || [],
        traumaInformedModifications: parsed.traumaInformedApproach || [],
        accessibilityModifications: [],
        personalizations: [],
        reasoning: parsed.reasoning,
        confidence: parsed.confidence || 0.7
      };
    } catch (error) {
      console.error('Failed to parse GPT-4o response:', error);
      return this.generateFallbackPrompt({} as EmotionalAnalysis, {} as WellnessPromptContext);
    }
  }

  // Generate fallback prompt when AI fails
  private generateFallbackPrompt(
    emotionalAnalysis: EmotionalAnalysis,
    context: WellnessPromptContext
  ): GPT4PromptResult {
    return {
      title: 'Take a Moment for Yourself',
      message: 'I notice you\'re processing some emotions right now. Would you like to try a gentle breathing exercise to help you feel more grounded?',
      tone: 'gentle',
      primaryIntervention: {
        type: 'breathwork',
        title: '3-Minute Grounding Breath',
        description: 'Breathe in for 4 counts, hold for 4, exhale for 6. Repeat for 3 minutes.',
        duration: '3',
        benefit: 'Helps regulate your nervous system and create a sense of calm'
      },
      alternativeInterventions: [
        {
          type: 'journaling',
          title: 'Write it Out',
          description: 'Take 5 minutes to write about what you\'re feeling right now',
          duration: '5'
        }
      ],
      culturalAdaptations: ['Adapted for your cultural background and values'],
      traumaInformedModifications: ['You have complete choice in whether to engage with these suggestions'],
      accessibilityModifications: [],
      personalizations: [],
      reasoning: 'Gentle, accessible interventions appropriate for emotional processing',
      confidence: 0.6
    };
  }

  // Helper methods
  private extractPrimaryEmotions(emotionalState: EmotionalState): string[] {
    return [emotionalState.primaryEmotion, ...emotionalState.secondaryEmotions.slice(0, 2)];
  }

  private calculateEmotionalIntensity(entry: EmotionalEntry): number {
    return entry.emotionalState.emotionIntensity;
  }

  private detectEmotionalPattern(recentEntries: EmotionalEntry[]): string {
    if (recentEntries.length < 3) return 'insufficient_data';
    
    const stressLevels = recentEntries.map(e => e.stressLevel);
    const avgStress = stressLevels.reduce((a, b) => a + b, 0) / stressLevels.length;
    
    if (avgStress > 7) return 'high_stress_pattern';
    if (avgStress < 4) return 'low_stress_stable';
    
    const heavyReflections = recentEntries.filter(e => 
      e.reflectionText.toLowerCase().includes('heavy') ||
      e.reflectionText.toLowerCase().includes('difficult') ||
      e.reflectionText.toLowerCase().includes('overwhelming')
    ).length;
    
    if (heavyReflections > recentEntries.length * 0.6) {
      return 'processing_heavy_emotions';
    }
    
    return 'stable_processing';
  }

  private identifyPrimaryTrigger(entry: EmotionalEntry, context: WellnessPromptContext): EmotionalTrigger {
    // Analyze reflection text and context to identify trigger
    const reflection = entry.reflectionText.toLowerCase();
    
    if (reflection.includes('work') || reflection.includes('job')) {
      return { type: 'work_stress', intensity: entry.stressLevel, description: 'Work-related stress' };
    }
    if (reflection.includes('family') || reflection.includes('relationship')) {
      return { type: 'relationship_stress', intensity: entry.stressLevel, description: 'Relationship challenges' };
    }
    if (reflection.includes('tired') || reflection.includes('exhausted')) {
      return { type: 'fatigue', intensity: entry.stressLevel, description: 'Physical or emotional fatigue' };
    }
    
    return { type: 'general_processing', intensity: entry.stressLevel, description: 'General emotional processing' };
  }

  // More helper methods would be implemented here...
}

// Supporting interfaces
export interface EmotionalAnalysis {
  primaryEmotions: string[];
  secondaryEmotions: string[];
  emotionalIntensity: number;
  stressLevel: number;
  moodChange: number;
  patternDetected: string;
  trendDirection: 'improving' | 'stable' | 'declining';
  primaryTrigger: EmotionalTrigger;
  interventionReadiness: number; // 0-1
  culturalEmotionalContext: CulturalEmotionalContext;
  traumaIndicators: TraumaIndicator[];
  resilienceFactors: ResilienceFactor[];
  supportNeeds: SupportNeed[];
  urgencyLevel: number; // 0-1
  readinessForGrowth: number; // 0-1
  culturalStrengths: CulturalStrength[];
  communityConnectionNeeds: number; // 0-1
}

export interface InterventionOpportunity {
  type: 'breathwork' | 'movement' | 'creative' | 'journaling' | 'ritual' | 'somatic' | 'community' | 'nature';
  description: string;
  readiness: number; // 0-1
  culturalRelevance: number; // 0-1
  timeRequired: number; // minutes
  difficultyLevel: 'gentle' | 'moderate' | 'engaging' | 'immersive';
  traumaInformed: boolean;
  expectedBenefit: string;
}

export interface GPT4PromptResult {
  title: string;
  message: string;
  tone: PromptTone;
  primaryIntervention: {
    type: string;
    title: string;
    description: string;
    duration: string;
    benefit: string;
  };
  alternativeInterventions: Array<{
    type: string;
    title: string;
    description: string;
    duration: string;
  }>;
  culturalAdaptations: string[];
  traumaInformedModifications: string[];
  accessibilityModifications: string[];
  personalizations: string[];
  reasoning: string;
  confidence: number;
}

export type WellnessPromptType = 
  | 'grounding_support' | 'energy_boost' | 'emotional_processing' | 'stress_relief'
  | 'creative_expression' | 'cultural_healing' | 'community_connection' | 'celebration'
  | 'transition_support' | 'breakthrough_integration' | 'self_compassion' | 'empowerment';

export type PromptTone = 'gentle' | 'encouraging' | 'supportive' | 'celebratory' | 'grounding' | 'empowering';

export type PromptUrgency = 'low' | 'moderate' | 'high' | 'immediate';

export type PromptPriority = 'low' | 'medium' | 'high' | 'critical';

// More supporting types would continue...

export { WellnessPromptingEngine };
export type {
  WellnessPromptingConfig,
  WellnessPromptContext,
  WellnessPrompt,
  WellnessPromptingSession,
  WellnessInterventionRecommendation
};