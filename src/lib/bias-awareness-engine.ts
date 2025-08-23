// ALCHM Bias Awareness Detection and Reflection Engine
// AI-powered bias detection with culturally responsive interventions

import {
  BiasReflection,
  AIBiasDetection,
  DetectedBias,
  BiasRisk,
  ResolutionPath,
  EmpathyOpportunity,
  CulturalContext,
  TraumaInformedNote,
  IdentityJourney
} from '@/types/identity-schema';

export interface BiasDetectionConfig {
  sensitivityLevel: 'high' | 'medium' | 'low';
  culturalContextRequired: boolean;
  intersectionalAnalysis: boolean;
  traumaInformedApproach: boolean;
  anonymousProcessing: boolean;
  communityLearningEnabled: boolean;
}

export interface BiasAnalysisResult {
  detectedBiases: DetectedBias[];
  confidenceScore: number;
  culturalNuances: CulturalNuance[];
  recommendedInterventions: BiasIntervention[];
  empathyBuildingOpportunities: EmpathyBuildingOpportunity[];
  communityLearningValue: number;
  traumaSafety: TraumaSafetyAssessment;
  systemicConnections: SystemicConnection[];
}

export interface DetectedBias {
  id: string;
  biasType: 'implicit' | 'explicit' | 'confirmation' | 'cultural' | 'intersectional' | 'systemic' | 'internalized';
  biasCategory: 'racial' | 'gender' | 'cultural' | 'socioeconomic' | 'ability' | 'age' | 'orientation' | 'religion' | 'appearance' | 'cognitive' | 'other';
  evidenceText: string;
  confidenceScore: number; // 0-1
  severity: 'low' | 'medium' | 'high' | 'critical';
  culturalContext: CulturalBiasContext;
  intersectionalFactors: IntersectionalFactor[];
  systemicConnections: SystemicBiasConnection[];
  harmPotential: HarmPotential;
  educationOpportunity: EducationOpportunity;
  empathyGrowthPotential: EmpathyGrowthPotential;
  communityImpact: CommunityBiasImpact;
  healingConsiderations: HealingConsideration[];
  restorationOpportunities: RestorationOpportunity[];
  allyshipActivation: AllyshipActivation;
}

export interface BiasIntervention {
  interventionType: 'gentle_awareness' | 'socratic_questioning' | 'perspective_taking' | 'cultural_education' | 'empathy_building' | 'systemic_analysis' | 'healing_support' | 'community_dialogue';
  culturallyAdapted: boolean;
  traumaInformed: boolean;
  urgencyLevel: 'immediate' | 'soon' | 'gradual' | 'ongoing';
  interventionContent: InterventionContent;
  followUpStrategy: FollowUpStrategy;
  successMetrics: InterventionSuccessMetric[];
  supportResources: SupportResource[];
  communityEngagement: CommunityEngagement;
  mentorshipRecommendation: MentorshipRecommendation;
}

export interface CulturalNuance {
  culturalDimension: string;
  nuanceDescription: string;
  historicalContext: string;
  contemporaryRelevance: string;
  intersectionalConsiderations: string[];
  culturalWisdomIntegration: CulturalWisdomIntegration;
  respectfulApproaches: RespectfulApproach[];
  avoidanceFactors: AvoidanceFactor[];
  healingOpportunities: CulturalHealingOpportunity[];
}

export interface EmpathyBuildingOpportunity {
  opportunityType: 'perspective_shift' | 'lived_experience_connection' | 'historical_understanding' | 'contemporary_awareness' | 'intersectional_empathy' | 'systemic_empathy' | 'healing_empathy';
  targetAwareness: string;
  empathyExercise: EmpathyExercise;
  culturalConsiderations: CulturalEmpathyConsideration[];
  traumaConsiderations: TraumaEmpathyConsideration[];
  communityConnections: CommunityEmpathyConnection[];
  narrativeIntegration: NarrativeEmpathyIntegration;
  actionOpportunities: EmpathyActionOpportunity[];
  measurementMethods: EmpathyMeasurementMethod[];
  progressTracking: EmpathyProgressTracking;
}

export class BiasAwarenessEngine {
  private config: BiasDetectionConfig;
  private culturalKnowledgeBase: Map<string, CulturalBiasPattern>;
  private intersectionalFrameworks: Map<string, IntersectionalFramework>;
  private biasPatterns: Map<string, BiasPattern>;
  
  constructor(config: BiasDetectionConfig) {
    this.config = config;
    this.culturalKnowledgeBase = this.initializeCulturalKnowledge();
    this.intersectionalFrameworks = this.initializeIntersectionalFrameworks();
    this.biasPatterns = this.initializeBiasPatterns();
  }

  // Main bias detection function
  async detectBias(
    content: string,
    context: {
      userId: string;
      culturalContext?: CulturalContext;
      identityElements?: any[];
      previousReflections?: BiasReflection[];
    }
  ): Promise<BiasAnalysisResult> {
    
    // Step 1: NLP Analysis for bias patterns
    const nlpResults = await this.performNLPBiasAnalysis(content);
    
    // Step 2: Cultural context analysis
    const culturalAnalysis = this.config.culturalContextRequired && context.culturalContext ?
      await this.performCulturalBiasAnalysis(content, context.culturalContext) :
      { culturalNuances: [], culturalRiskFactors: [] };
    
    // Step 3: Intersectional analysis
    const intersectionalAnalysis = this.config.intersectionalAnalysis ?
      await this.performIntersectionalAnalysis(content, context) :
      { intersectionalFactors: [], complexityScore: 0 };
    
    // Step 4: Systemic bias connections
    const systemicAnalysis = await this.identifySystemicConnections(nlpResults.patterns, context);
    
    // Step 5: Trauma safety assessment
    const traumaSafety = this.config.traumaInformedApproach ?
      await this.assessTraumaSafety(content, nlpResults, context) :
      this.defaultTraumaSafety();
    
    // Step 6: Generate interventions
    const interventions = await this.generateInterventions(
      nlpResults,
      culturalAnalysis,
      intersectionalAnalysis,
      traumaSafety,
      context
    );
    
    // Step 7: Identify empathy opportunities
    const empathyOpportunities = await this.identifyEmpathyOpportunities(
      nlpResults,
      culturalAnalysis,
      context
    );
    
    // Step 8: Assess community learning value
    const communityValue = this.config.communityLearningEnabled ?
      this.assessCommunityLearningValue(nlpResults, culturalAnalysis, context) :
      0;
    
    return {
      detectedBiases: nlpResults.detectedBiases,
      confidenceScore: nlpResults.overallConfidence,
      culturalNuances: culturalAnalysis.culturalNuances,
      recommendedInterventions: interventions,
      empathyBuildingOpportunities: empathyOpportunities,
      communityLearningValue: communityValue,
      traumaSafety,
      systemicConnections: systemicAnalysis
    };
  }

  // Create bias reflection from analysis
  async createBiasReflection(
    analysisResult: BiasAnalysisResult,
    userResponse: string,
    context: {
      userId: string;
      promptId: string;
      culturalContext?: CulturalContext;
    }
  ): Promise<BiasReflection> {
    
    const primaryBias = analysisResult.detectedBiases[0]; // Focus on most significant bias
    
    const resolutionPath = await this.generateResolutionPath(
      primaryBias,
      analysisResult.recommendedInterventions,
      context
    );
    
    const empathyConnection = await this.generateEmpathyConnection(
      primaryBias,
      analysisResult.empathyBuildingOpportunities,
      context
    );
    
    const communityImpact = this.assessCommunityImpact(
      primaryBias,
      analysisResult.communityLearningValue,
      context
    );
    
    const traumaInformedNotes = this.generateTraumaInformedNotes(
      analysisResult.traumaSafety,
      primaryBias,
      context
    );
    
    return {
      id: `bias_reflection_${context.userId}_${Date.now()}`,
      promptId: context.promptId,
      userResponse,
      biasType: primaryBias.biasType,
      biasCategory: primaryBias.biasCategory,
      detectionMethod: 'ai_analysis',
      resolved: false,
      resolutionPath,
      culturalContext: context.culturalContext || this.getDefaultCulturalContext(),
      emotionalResponse: await this.assessEmotionalResponse(userResponse, primaryBias),
      learningOutcome: this.initializeLearningOutcome(),
      actionCommitments: [],
      empathyConnection,
      communityImpact,
      followUpScheduled: this.calculateFollowUpDate(primaryBias.severity),
      supportResourcesUsed: [],
      aiInsights: this.generateAIInsights(analysisResult),
      mentorFeedback: [],
      privacyLevel: 'private', // Default to most private
      triggerWarnings: this.generateTriggerWarnings(primaryBias, analysisResult.traumaSafety),
      healingProgress: this.initializeHealingProgress(),
      date: new Date(),
      lastReflectedOn: new Date()
    };
  }

  // Generate follow-up prompts based on bias reflection
  async generateFollowUpPrompts(
    biasReflection: BiasReflection,
    progressSinceLastReflection: number // 0-1
  ): Promise<{
    reflectionPrompts: ReflectionPrompt[];
    empathyExercises: EmpathyExercise[];
    communityEngagementSuggestions: CommunityEngagementSuggestion[];
    learningResources: LearningResource[];
    healingSupportOptions: HealingSupportOption[];
  }> {
    
    const basePrompts = await this.generateBaseReflectionPrompts(biasReflection);
    const progressAdaptedPrompts = this.adaptPromptsForProgress(basePrompts, progressSinceLastReflection);
    const culturallyAdaptedPrompts = this.adaptPromptsForCulture(progressAdaptedPrompts, biasReflection.culturalContext);
    
    const empathyExercises = await this.generateEmpathyExercises(biasReflection);
    const communityEngagement = await this.generateCommunityEngagementSuggestions(biasReflection);
    const learningResources = await this.generateLearningResources(biasReflection);
    const healingSupport = await this.generateHealingSupportOptions(biasReflection);
    
    return {
      reflectionPrompts: culturallyAdaptedPrompts,
      empathyExercises,
      communityEngagementSuggestions: communityEngagement,
      learningResources,
      healingSupportOptions: healingSupport
    };
  }

  // Track bias resolution progress
  async updateBiasResolution(
    biasReflectionId: string,
    updates: {
      newReflection?: string;
      actionsTaken?: ActionCommitment[];
      empathyGrowth?: number;
      communityEngagement?: CommunityEngagement[];
      healingProgress?: HealingProgress;
      supportUsed?: string[];
    }
  ): Promise<{
    updatedReflection: BiasReflection;
    resolutionScore: number;
    nextSteps: NextStep[];
    celebrateProgress?: CelebrationMoment;
  }> {
    
    // This would update the bias reflection in the database
    // For now, returning structure of what would be returned
    
    const resolutionScore = await this.calculateResolutionScore(biasReflectionId, updates);
    const nextSteps = await this.generateNextSteps(resolutionScore, updates);
    
    const celebrateProgress = resolutionScore > 0.7 ? 
      await this.generateCelebrationMoment(resolutionScore, updates) : 
      undefined;
    
    return {
      updatedReflection: {} as BiasReflection, // Would be populated from database
      resolutionScore,
      nextSteps,
      celebrateProgress
    };
  }

  // Private helper methods for bias detection
  private async performNLPBiasAnalysis(content: string): Promise<{
    detectedBiases: DetectedBias[];
    patterns: BiasPattern[];
    overallConfidence: number;
  }> {
    
    // This would integrate with Gemini API for NLP analysis
    const patterns = this.identifyBiasPatterns(content);
    const detectedBiases: DetectedBias[] = [];
    
    for (const pattern of patterns) {
      const bias = await this.createDetectedBias(pattern, content);
      if (bias.confidenceScore > 0.3) { // Only include if confidence is reasonable
        detectedBiases.push(bias);
      }
    }
    
    const overallConfidence = detectedBiases.length > 0 ?
      detectedBiases.reduce((sum, bias) => sum + bias.confidenceScore, 0) / detectedBiases.length :
      0;
    
    return {
      detectedBiases,
      patterns,
      overallConfidence
    };
  }

  private identifyBiasPatterns(content: string): BiasPattern[] {
    const patterns: BiasPattern[] = [];
    const lowerContent = content.toLowerCase();
    
    // Pattern matching for common bias indicators
    this.biasPatterns.forEach((pattern, key) => {
      if (pattern.regex.test(lowerContent) || this.semanticMatch(content, pattern.semanticIndicators)) {
        patterns.push(pattern);
      }
    });
    
    return patterns;
  }

  private async createDetectedBias(pattern: BiasPattern, content: string): Promise<DetectedBias> {
    return {
      id: `detected_bias_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      biasType: pattern.type,
      biasCategory: pattern.category,
      evidenceText: this.extractEvidenceText(content, pattern),
      confidenceScore: this.calculateConfidence(pattern, content),
      severity: this.assessSeverity(pattern, content),
      culturalContext: await this.analyzeCulturalBiasContext(pattern, content),
      intersectionalFactors: await this.identifyIntersectionalFactors(pattern, content),
      systemicConnections: await this.identifySystemicBiasConnections(pattern),
      harmPotential: this.assessHarmPotential(pattern, content),
      educationOpportunity: this.identifyEducationOpportunity(pattern),
      empathyGrowthPotential: this.assessEmpathyGrowthPotential(pattern),
      communityImpact: this.assessCommunityBiasImpact(pattern),
      healingConsiderations: await this.identifyHealingConsiderations(pattern),
      restorationOpportunities: await this.identifyRestorationOpportunities(pattern),
      allyshipActivation: this.identifyAllyshipActivation(pattern)
    };
  }

  private async performCulturalBiasAnalysis(
    content: string, 
    culturalContext: CulturalContext
  ): Promise<{
    culturalNuances: CulturalNuance[];
    culturalRiskFactors: CulturalRiskFactor[];
  }> {
    
    const relevantCulturalPatterns = this.getCulturalBiasPatterns(culturalContext);
    const culturalNuances: CulturalNuance[] = [];
    const culturalRiskFactors: CulturalRiskFactor[] = [];
    
    for (const pattern of relevantCulturalPatterns) {
      if (this.matchesCulturalPattern(content, pattern)) {
        culturalNuances.push(await this.createCulturalNuance(pattern, culturalContext));
        
        if (pattern.riskLevel > 0.5) {
          culturalRiskFactors.push(this.createCulturalRiskFactor(pattern));
        }
      }
    }
    
    return {
      culturalNuances,
      culturalRiskFactors
    };
  }

  private async generateInterventions(
    nlpResults: any,
    culturalAnalysis: any,
    intersectionalAnalysis: any,
    traumaSafety: TraumaSafetyAssessment,
    context: any
  ): Promise<BiasIntervention[]> {
    
    const interventions: BiasIntervention[] = [];
    
    for (const bias of nlpResults.detectedBiases) {
      const intervention = await this.createBiasIntervention(
        bias,
        culturalAnalysis,
        traumaSafety,
        context
      );
      interventions.push(intervention);
    }
    
    return interventions;
  }

  private async createBiasIntervention(
    bias: DetectedBias,
    culturalAnalysis: any,
    traumaSafety: TraumaSafetyAssessment,
    context: any
  ): Promise<BiasIntervention> {
    
    const interventionType = this.selectInterventionType(bias, traumaSafety);
    const culturallyAdapted = this.adaptInterventionForCulture(interventionType, culturalAnalysis);
    const traumaInformed = this.adaptInterventionForTrauma(interventionType, traumaSafety);
    
    return {
      interventionType,
      culturallyAdapted: culturallyAdapted.adapted,
      traumaInformed: traumaInformed.adapted,
      urgencyLevel: this.determineUrgency(bias.severity, traumaSafety.safetyLevel),
      interventionContent: await this.generateInterventionContent(
        interventionType,
        bias,
        culturallyAdapted,
        traumaInformed
      ),
      followUpStrategy: this.generateFollowUpStrategy(bias, interventionType),
      successMetrics: this.generateInterventionSuccessMetrics(bias, interventionType),
      supportResources: this.identifySupportResources(bias, culturalAnalysis),
      communityEngagement: this.generateCommunityEngagement(bias),
      mentorshipRecommendation: this.generateMentorshipRecommendation(bias, context)
    };
  }

  // Initialize knowledge bases
  private initializeCulturalKnowledge(): Map<string, CulturalBiasPattern> {
    const knowledge = new Map<string, CulturalBiasPattern>();
    
    // Add cultural bias patterns
    knowledge.set('racial_microaggressions', {
      culturalDimensions: ['race', 'ethnicity'],
      biasIndicators: [
        'you speak so well',
        'where are you really from',
        'you don\'t look like',
        'I don\'t see color'
      ],
      culturalContext: 'Often well-intentioned but harmful assumptions about racial identity',
      harmLevel: 'medium',
      intersectionalFactors: ['race', 'class', 'education'],
      interventionStrategies: ['awareness_building', 'perspective_taking', 'historical_education'],
      healingApproaches: ['community_validation', 'identity_affirmation', 'systemic_understanding']
    });
    
    knowledge.set('cultural_appropriation_patterns', {
      culturalDimensions: ['ethnicity', 'religion', 'tradition'],
      biasIndicators: [
        'I love that culture',
        'it\'s just fashion',
        'imitation is flattery',
        'we\'re all human'
      ],
      culturalContext: 'Taking from marginalized cultures without understanding or permission',
      harmLevel: 'high',
      intersectionalFactors: ['race', 'class', 'power'],
      interventionStrategies: ['cultural_education', 'power_analysis', 'respect_building'],
      healingApproaches: ['cultural_reclamation', 'community_dialogue', 'reparative_action']
    });
    
    // Add more patterns...
    
    return knowledge;
  }

  private initializeIntersectionalFrameworks(): Map<string, IntersectionalFramework> {
    const frameworks = new Map<string, IntersectionalFramework>();
    
    frameworks.set('race_gender', {
      dimensions: ['race', 'gender'],
      compoundingEffects: ['stereotyping', 'marginalization', 'invisibility'],
      uniqueExperiences: ['misogynoir', 'fetishization', 'respectability_politics'],
      interventionApproaches: ['intersectional_analysis', 'inclusive_spaces', 'amplify_voices'],
      communitySupport: ['sisterhood_circles', 'advocacy_groups', 'mentorship_networks']
    });
    
    // Add more frameworks...
    
    return frameworks;
  }

  private initializeBiasPatterns(): Map<string, BiasPattern> {
    const patterns = new Map<string, BiasPattern>();
    
    patterns.set('confirmation_bias', {
      type: 'confirmation',
      category: 'cognitive',
      regex: /\b(proves my point|just confirms|always said|typical|as expected)\b/i,
      semanticIndicators: ['selective evidence', 'dismissing contradictions', 'cherry picking'],
      severity: 'medium',
      interventionStrategies: ['perspective_taking', 'evidence_evaluation', 'devil_advocate'],
      empathyOpportunities: ['consider_other_views', 'understand_disagreement', 'find_common_ground']
    });
    
    // Add more patterns...
    
    return patterns;
  }

  // Helper methods
  private semanticMatch(content: string, indicators: string[]): boolean {
    // This would use more sophisticated semantic analysis
    return indicators.some(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  private extractEvidenceText(content: string, pattern: BiasPattern): string {
    // Extract the specific text that indicates bias
    const match = content.match(pattern.regex);
    return match ? match[0] : content.substring(0, 100) + '...';
  }

  private calculateConfidence(pattern: BiasPattern, content: string): number {
    // Calculate confidence based on pattern strength and context
    let confidence = 0.5; // Base confidence
    
    if (pattern.regex.test(content)) confidence += 0.3;
    if (pattern.semanticIndicators.some(ind => content.includes(ind))) confidence += 0.2;
    
    return Math.min(1, confidence);
  }

  private assessSeverity(pattern: BiasPattern, content: string): 'low' | 'medium' | 'high' | 'critical' {
    // Assess severity based on potential harm and context
    return pattern.severity as 'low' | 'medium' | 'high' | 'critical';
  }

  private async assessTraumaSafety(
    content: string,
    nlpResults: any,
    context: any
  ): Promise<TraumaSafetyAssessment> {
    
    const triggerRisk = this.assessTriggerRisk(content, nlpResults);
    const retraumatizationRisk = this.assessRetraumatizationRisk(context);
    const safetyLevel = this.calculateSafetyLevel(triggerRisk, retraumatizationRisk);
    
    return {
      safetyLevel,
      triggerRisk,
      retraumatizationRisk,
      recommendedPrecautions: this.generateSafetyPrecautions(safetyLevel),
      supportResourcesNeeded: this.identifyNeededSupportResources(safetyLevel),
      healingOpportunities: this.identifyHealingOpportunities(context)
    };
  }

  private defaultTraumaSafety(): TraumaSafetyAssessment {
    return {
      safetyLevel: 'medium',
      triggerRisk: 'low',
      retraumatizationRisk: 'low',
      recommendedPrecautions: ['gentle_approach', 'choice_emphasis'],
      supportResourcesNeeded: ['basic_support'],
      healingOpportunities: []
    };
  }

  // Additional helper methods would be implemented here...
  private assessTriggerRisk(content: string, nlpResults: any): 'low' | 'medium' | 'high' {
    return 'low'; // Placeholder
  }

  private assessRetraumatizationRisk(context: any): 'low' | 'medium' | 'high' {
    return 'low'; // Placeholder
  }

  private calculateSafetyLevel(triggerRisk: string, retraumatizationRisk: string): 'safe' | 'caution' | 'high_risk' {
    return 'safe'; // Placeholder
  }

  private generateSafetyPrecautions(safetyLevel: string): string[] {
    return ['Use gentle language', 'Emphasize choice and control'];
  }

  private identifyNeededSupportResources(safetyLevel: string): string[] {
    return ['Counseling resources', 'Community support'];
  }

  private identifyHealingOpportunities(context: any): HealingOpportunity[] {
    return [];
  }

  private generateTraumaInformedNotes(
    traumaSafety: TraumaSafetyAssessment,
    bias: DetectedBias,
    context: any
  ): TraumaInformedNote[] {
    const notes: TraumaInformedNote[] = [];
    
    if (traumaSafety.safetyLevel !== 'safe') {
      notes.push({
        type: 'safety_check',
        content: 'This reflection touches on sensitive areas. Please go at your own pace.',
        severity: 'caution',
        actionRequired: false,
        culturalConsiderations: ['Cultural safety prioritized'],
        supportResources: ['Counseling available', 'Community support'],
        followUpRequired: true
      });
    }
    
    return notes;
  }

  // More implementation details would follow...
}

// Supporting interfaces and types
interface BiasPattern {
  type: string;
  category: string;
  regex: RegExp;
  semanticIndicators: string[];
  severity: string;
  interventionStrategies: string[];
  empathyOpportunities: string[];
}

interface CulturalBiasPattern {
  culturalDimensions: string[];
  biasIndicators: string[];
  culturalContext: string;
  harmLevel: string;
  intersectionalFactors: string[];
  interventionStrategies: string[];
  healingApproaches: string[];
}

interface IntersectionalFramework {
  dimensions: string[];
  compoundingEffects: string[];
  uniqueExperiences: string[];
  interventionApproaches: string[];
  communitySupport: string[];
}

interface TraumaSafetyAssessment {
  safetyLevel: 'safe' | 'caution' | 'high_risk';
  triggerRisk: 'low' | 'medium' | 'high';
  retraumatizationRisk: 'low' | 'medium' | 'high';
  recommendedPrecautions: string[];
  supportResourcesNeeded: string[];
  healingOpportunities: HealingOpportunity[];
}

// Export main class and types
export { BiasAwarenessEngine };
export type {
  BiasDetectionConfig,
  BiasAnalysisResult,
  DetectedBias,
  BiasIntervention,
  CulturalNuance,
  EmpathyBuildingOpportunity
};