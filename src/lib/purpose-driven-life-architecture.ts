// ALCHM Purpose-Driven Life Architecture
// Use IKIGAI results to generate comprehensive life development pathways and purpose alignment

import {
  IKIGAIDiscovery,
  PurposeDrivenLifeArchitecture,
  PurposeAlignmentScore,
  CoreIKIGAI,
  PurposeAlignment,
  PurposePathway,
  LifeDomain,
  PurposeDecisionFramework
} from '@/types/ikigai-purpose-schema';

import { PersonalizedPathway, CoachProfile } from '@/types/ai-personalization-schema';
import { IdentityJourney, CulturalContext } from '@/types/identity-schema';
import { CareerJourney, SMARTGoal } from '@/types/career-schema';
import { EmotionalEntry } from '@/types/emotional-wellness-schema';

export interface LifeArchitectureConfig {
  geminiApiKey: string;
  modelVersion: string;
  architectureDepth: 'foundational' | 'comprehensive' | 'transformational';
  updateFrequency: 'weekly' | 'monthly' | 'quarterly';
  decisionSupportLevel: 'basic' | 'guided' | 'intensive';
  culturalIntegration: 'standard' | 'deep' | 'comprehensive';
  aiCoachingEnabled: boolean;
  communityIntegration: boolean;
  trackingGranularity: 'daily' | 'weekly' | 'milestone';
}

export interface LifeArchitectureContext {
  userId: string;
  ikigaiDiscovery: IKIGAIDiscovery;
  culturalContext: CulturalContext;
  identityJourney: IdentityJourney;
  careerJourney: CareerJourney;
  currentGoals: SMARTGoal[];
  recentEmotionalEntries: EmotionalEntry[];
  lifeCircumstances: LifeCircumstance[];
  availableResources: AvailableResource[];
  supportSystem: SupportSystem;
  timeCapacity: TimeCapacity;
  currentChallenges: CurrentChallenge[];
}

export interface ArchitectureGenerationResult {
  architecture: PurposeDrivenLifeArchitecture;
  initialAlignment: PurposeAlignmentScore;
  recommendedPathways: PurposePathway[];
  decisionFramework: PurposeDecisionFramework;
  implementationPlan: ImplementationPlan;
  monitoringStrategy: MonitoringStrategy;
  supportPlan: ArchitectureSupportPlan;
}

export interface PurposeAlignmentAnalysis {
  currentAlignment: AlignmentAssessment;
  alignmentGaps: AlignmentGap[];
  strengthAreas: AlignmentStrength[];
  improvementOpportunities: ImprovementOpportunity[];
  culturalAlignment: CulturalAlignment;
  pathwayRecommendations: PathwayRecommendation[];
  decisionGuidance: DecisionGuidance[];
}

export interface DailyPurposeGuidance {
  guidanceId: string;
  userId: string;
  date: Date;
  
  // Morning Intention Setting
  morningReflection: MorningReflection;
  purposeIntention: PurposeIntention;
  dailyAlignment: DailyAlignment;
  
  // Decision Support
  decisionMoments: DecisionMoment[];
  alignmentChecks: AlignmentCheck[];
  courseCorrections: CourseCorrection[];
  
  // Evening Integration
  eveningReflection: EveningReflection;
  purposeAlignment: PurposeAlignmentReview;
  growthInsights: GrowthInsight[];
  
  // AI Coaching
  aiGuidance: DailyAIGuidance[];
  personalizedPrompts: PersonalizedPrompt[];
  culturalWisdom: CulturalWisdom[];
  
  effectiveness: number; // 0-1
  userEngagement: number; // 0-1
  alignmentContribution: number; // 0-1
}

export class PurposeDrivenLifeArchitecture {
  private config: LifeArchitectureConfig;
  private geminiClient: GeminiClient;
  private architectureBuilder: ArchitectureBuilder;
  private alignmentCalculator: AlignmentCalculator;
  private pathwayGenerator: PurposePathwayGenerator;
  private decisionFrameworkBuilder: DecisionFrameworkBuilder;
  private dailyGuidanceEngine: DailyGuidanceEngine;
  private monitoringEngine: PurposeMonitoringEngine;
  private culturalIntegrationEngine: CulturalIntegrationEngine;

  constructor(config: LifeArchitectureConfig) {
    this.config = config;
    this.geminiClient = new GeminiClient(config.geminiApiKey);
    this.architectureBuilder = new ArchitectureBuilder(config);
    this.alignmentCalculator = new AlignmentCalculator(config);
    this.pathwayGenerator = new PurposePathwayGenerator(config);
    this.decisionFrameworkBuilder = new DecisionFrameworkBuilder(config);
    this.dailyGuidanceEngine = new DailyGuidanceEngine(config);
    this.monitoringEngine = new PurposeMonitoringEngine(config);
    this.culturalIntegrationEngine = new CulturalIntegrationEngine(config);
  }

  // Generate comprehensive life architecture from IKIGAI discovery
  async generateLifeArchitecture(
    context: LifeArchitectureContext
  ): Promise<ArchitectureGenerationResult> {
    
    console.log('Generating purpose-driven life architecture for:', context.userId);
    
    // Step 1: Analyze IKIGAI discovery for architectural insights
    const ikigaiAnalysis = await this.analyzeIKIGAIForArchitecture(
      context.ikigaiDiscovery,
      context
    );
    
    // Step 2: Design life domain structure
    const lifeDomains = await this.designLifeDomains(
      context.ikigaiDiscovery,
      context
    );
    
    // Step 3: Create purpose alignment framework
    const alignmentFramework = await this.createAlignmentFramework(
      context.ikigaiDiscovery,
      lifeDomains,
      context
    );
    
    // Step 4: Generate purpose pathways
    const purposePathways = await this.generatePurposePathways(
      context.ikigaiDiscovery,
      lifeDomains,
      context
    );
    
    // Step 5: Build decision framework
    const decisionFramework = await this.buildDecisionFramework(
      context.ikigaiDiscovery,
      context
    );
    
    // Step 6: Create monitoring and tracking system
    const monitoringStrategy = await this.createMonitoringStrategy(
      context.ikigaiDiscovery,
      context
    );
    
    // Step 7: Integrate cultural and community elements
    const culturalIntegration = await this.integrateCulturalElements(
      context.ikigaiDiscovery,
      context.culturalContext,
      lifeDomains
    );
    
    // Step 8: Build the comprehensive architecture
    const architecture: PurposeDrivenLifeArchitecture = {
      architectureId: `arch_${context.userId}_${Date.now()}`,
      userId: context.userId,
      coreIKIGAI: context.ikigaiDiscovery.coreIKIGAI,
      purposeAlignment: alignmentFramework,
      lifeVision: await this.generateLifeVision(context.ikigaiDiscovery, context),
      lifeDomains,
      domainAlignment: await this.calculateDomainAlignment(lifeDomains, context),
      crossDomainSynergies: await this.identifyCrossDomainSynergies(lifeDomains),
      purposePathways,
      currentPathways: await this.identifyCurrentPathways(purposePathways, context),
      completedPathways: [],
      futurePathways: await this.generateFuturePathways(purposePathways, context),
      decisionFramework,
      decisionHistory: [],
      decisionPatterns: [],
      alignmentTracking: await this.initializeAlignmentTracking(context),
      purposeMetrics: await this.createPurposeMetrics(context.ikigaiDiscovery),
      fulfillmentMeasurement: await this.createFulfillmentMeasurement(context),
      purposeCoaching: await this.initializePurposeCoaching(context),
      dailyGuidance: [],
      weeklyReflections: [],
      monthlyAlignment: [],
      culturalPurposeFramework: culturalIntegration,
      communityPurpose: await this.createCommunityPurpose(context),
      legacyBuilding: await this.initializeLegacyBuilding(context),
      architectureEvolution: [],
      adaptationTriggers: await this.createAdaptationTriggers(),
      refinementOpportunities: [],
      createdAt: new Date(),
      lastArchitectureReview: new Date(),
      nextArchitectureReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Monthly
      version: '1.0'
    };
    
    // Step 9: Calculate initial alignment score
    const initialAlignment = await this.calculateInitialAlignment(architecture, context);
    
    // Step 10: Create implementation plan
    const implementationPlan = await this.createImplementationPlan(
      architecture,
      context
    );
    
    return {
      architecture,
      initialAlignment,
      recommendedPathways: purposePathways.slice(0, 5), // Top 5 recommendations
      decisionFramework,
      implementationPlan,
      monitoringStrategy,
      supportPlan: await this.createSupportPlan(architecture, context)
    };
  }

  // Calculate comprehensive purpose alignment score
  async calculatePurposeAlignmentScore(
    architecture: PurposeDrivenLifeArchitecture,
    context: LifeArchitectureContext,
    dateRange: DateRange
  ): Promise<PurposeAlignmentScore> {
    
    console.log('Calculating purpose alignment score for:', context.userId);
    
    // Step 1: Analyze daily choices and decisions
    const dailyChoiceAnalysis = await this.analyzeDailyChoiceAlignment(
      architecture,
      context,
      dateRange
    );
    
    // Step 2: Evaluate life domain alignment
    const domainAlignmentAnalysis = await this.evaluateDomainAlignment(
      architecture.lifeDomains,
      context,
      dateRange
    );
    
    // Step 3: Assess decision-making alignment
    const decisionAlignmentAnalysis = await this.assessDecisionAlignment(
      architecture.decisionHistory,
      architecture.coreIKIGAI,
      dateRange
    );
    
    // Step 4: Calculate time allocation alignment
    const timeAllocationAnalysis = await this.analyzeTimeAllocationAlignment(
      architecture,
      context,
      dateRange
    );
    
    // Step 5: Evaluate action alignment
    const actionAlignmentAnalysis = await this.evaluateActionAlignment(
      architecture,
      context,
      dateRange
    );
    
    // Step 6: Calculate component scores
    const componentScores = {
      dailyChoiceAlignment: dailyChoiceAnalysis.alignmentScore,
      decisionAlignment: decisionAlignmentAnalysis.alignmentScore,
      actionAlignment: actionAlignmentAnalysis.alignmentScore,
      timeAllocationAlignment: timeAllocationAnalysis.alignmentScore,
      domainAlignment: domainAlignmentAnalysis.overallAlignmentScore
    };
    
    // Step 7: Calculate weighted overall score
    const overallScore = 
      (componentScores.dailyChoiceAlignment * 0.25) +
      (componentScores.decisionAlignment * 0.25) +
      (componentScores.actionAlignment * 0.20) +
      (componentScores.timeAllocationAlignment * 0.15) +
      (componentScores.domainAlignment * 0.15);
    
    // Step 8: Analyze trends and trajectory
    const alignmentTrajectory = await this.analyzeAlignmentTrajectory(
      architecture,
      context,
      dateRange
    );
    
    // Step 9: Generate AI insights and recommendations
    const aiInsights = await this.generateAlignmentAIInsights(
      componentScores,
      alignmentTrajectory,
      architecture,
      context
    );
    
    return {
      scoreId: `align_${context.userId}_${Date.now()}`,
      userId: context.userId,
      overallScore,
      trendDirection: alignmentTrajectory.trendDirection,
      confidenceLevel: this.calculateAlignmentConfidence(componentScores, dateRange),
      domainScores: domainAlignmentAnalysis.domainScores,
      elementAlignmentScores: await this.calculateElementAlignmentScores(architecture),
      intersectionAlignmentScores: await this.calculateIntersectionAlignmentScores(architecture),
      dailyChoiceAlignment: componentScores.dailyChoiceAlignment,
      decisionAlignment: componentScores.decisionAlignment,
      actionAlignment: componentScores.actionAlignment,
      timeAllocationAlignment: componentScores.timeAllocationAlignment,
      alignmentTrajectory,
      improvementAreas: await this.identifyImprovementAreas(componentScores, aiInsights),
      strengthAreas: await this.identifyStrengthAreas(componentScores, aiInsights),
      aiInsights,
      recommendations: await this.generateAlignmentRecommendations(aiInsights, architecture),
      interventionSuggestions: await this.generateInterventionSuggestions(aiInsights, architecture),
      calculatedAt: new Date(),
      dataRange: dateRange,
      nextCalculation: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Weekly recalculation
    };
  }

  // Generate daily purpose guidance
  async generateDailyPurposeGuidance(
    architecture: PurposeDrivenLifeArchitecture,
    context: LifeArchitectureContext,
    date: Date = new Date()
  ): Promise<DailyPurposeGuidance> {
    
    console.log('Generating daily purpose guidance for:', context.userId, date.toDateString());
    
    // Step 1: Create morning intention setting
    const morningReflection = await this.generateMorningReflection(
      architecture,
      context,
      date
    );
    
    // Step 2: Set daily purpose intention
    const purposeIntention = await this.generatePurposeIntention(
      architecture.coreIKIGAI,
      context,
      date
    );
    
    // Step 3: Prepare decision support framework
    const decisionSupport = await this.prepareDailyDecisionSupport(
      architecture.decisionFramework,
      context,
      date
    );
    
    // Step 4: Create alignment check prompts
    const alignmentChecks = await this.createDailyAlignmentChecks(
      architecture,
      context,
      date
    );
    
    // Step 5: Generate AI guidance for the day
    const aiGuidance = await this.generateDailyAIGuidance(
      architecture,
      context,
      date
    );
    
    // Step 6: Create cultural wisdom integration
    const culturalWisdom = await this.generateDailyCulturalWisdom(
      architecture.culturalPurposeFramework,
      context,
      date
    );
    
    return {
      guidanceId: `guidance_${context.userId}_${date.toISOString().split('T')[0]}`,
      userId: context.userId,
      date,
      morningReflection,
      purposeIntention,
      dailyAlignment: await this.calculateDailyAlignment(architecture, context, date),
      decisionMoments: [],
      alignmentChecks,
      courseCorrections: [],
      eveningReflection: await this.generateEveningReflectionTemplate(architecture, context),
      purposeAlignment: {} as PurposeAlignmentReview,
      growthInsights: [],
      aiGuidance,
      personalizedPrompts: await this.generatePersonalizedDailyPrompts(architecture, context, date),
      culturalWisdom,
      effectiveness: 0, // Will be updated based on user engagement
      userEngagement: 0, // Will be updated based on user interaction
      alignmentContribution: 0 // Will be calculated at end of day
    };
  }

  // Analyze IKIGAI for architectural insights
  private async analyzeIKIGAIForArchitecture(
    ikigaiDiscovery: IKIGAIDiscovery,
    context: LifeArchitectureContext
  ): Promise<IKIGAIArchitecturalAnalysis> {
    
    const analysisPrompt = this.buildIKIGAIArchitectureAnalysisPrompt(ikigaiDiscovery, context);
    
    try {
      const geminiResponse = await this.geminiClient.generateContent({
        contents: [{
          parts: [{
            text: analysisPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          maxOutputTokens: 3000
        }
      });

      const analysisResult = this.parseIKIGAIArchitectureAnalysis(
        geminiResponse.response.text(),
        ikigaiDiscovery,
        context
      );

      return analysisResult;

    } catch (error) {
      console.error('IKIGAI architecture analysis failed:', error);
      return this.generateFallbackArchitectureAnalysis(ikigaiDiscovery, context);
    }
  }

  // Build IKIGAI architecture analysis prompt
  private buildIKIGAIArchitectureAnalysisPrompt(
    ikigaiDiscovery: IKIGAIDiscovery,
    context: LifeArchitectureContext
  ): string {
    
    const coreElements = this.summarizeIKIGAIElements(ikigaiDiscovery);
    const intersections = this.summarizeIKIGAIIntersections(ikigaiDiscovery);
    
    return `
Analyze this IKIGAI discovery to design a comprehensive purpose-driven life architecture.

CORE IKIGAI DISCOVERY:
Purpose Statement: "${ikigaiDiscovery.coreIKIGAI.purposeStatement}"
Purpose Clarity: ${ikigaiDiscovery.purposeClarity.clarityLevel}/1
Overall Alignment: ${ikigaiDiscovery.alignmentScore}/1

IKIGAI ELEMENTS:
${coreElements}

IKIGAI INTERSECTIONS:
${intersections}

USER CONTEXT:
- Cultural Background: ${JSON.stringify(context.culturalContext)}
- Life Phase: ${context.identityJourney.currentPhase}
- Career Stage: ${context.careerJourney.currentPhase}
- Current Goals: ${context.currentGoals.map(g => g.goalTitle).join(', ')}
- Available Time: ${context.timeCapacity.weeklyHours} hours/week
- Support System: ${context.supportSystem.supportLevel}

CURRENT LIFE CIRCUMSTANCES:
${context.lifeCircumstances.map(lc => `- ${lc.category}: ${lc.description}`).join('\n')}

CURRENT CHALLENGES:
${context.currentChallenges.map(cc => `- ${cc.description} (impact: ${cc.impact})`).join('\n')}

Please analyze and provide:

1. LIFE DOMAIN ARCHITECTURE:
   - Key life domains that need purpose alignment
   - How IKIGAI elements map to each domain
   - Priority domains for initial focus
   - Integration strategies between domains

2. PURPOSE PATHWAY OPPORTUNITIES:
   - Specific pathways that advance the core IKIGAI
   - Progressive development sequences
   - Cultural integration opportunities
   - Community and relationship pathways

3. DECISION FRAMEWORK DESIGN:
   - Decision criteria based on IKIGAI principles
   - Values-based decision filters
   - Cultural consideration guidelines
   - Trade-off evaluation methods

4. ALIGNMENT MEASUREMENT STRATEGY:
   - Key indicators of purpose alignment
   - Daily tracking opportunities
   - Weekly reflection prompts
   - Monthly assessment criteria

5. IMPLEMENTATION PRIORITIES:
   - Immediate actions to increase alignment
   - 30-day purpose integration plan
   - 90-day transformation goals
   - Long-term life architecture vision

6. CULTURAL INTEGRATION:
   - Cultural practices that support purpose
   - Community involvement opportunities
   - Ancestral wisdom integration
   - Cultural expression of IKIGAI

7. SUPPORT REQUIREMENTS:
   - AI coaching focus areas
   - Community support needs
   - Professional development requirements
   - Resource and tool needs

8. MONITORING AND ADAPTATION:
   - Early warning signs of misalignment
   - Adaptation trigger points
   - Evolution and growth indicators
   - Course correction strategies

Respond in JSON format with specific, actionable architectural recommendations and implementation strategies.
`;
  }

  // Design life domains based on IKIGAI
  private async designLifeDomains(
    ikigaiDiscovery: IKIGAIDiscovery,
    context: LifeArchitectureContext
  ): Promise<LifeDomain[]> {
    
    const domains: LifeDomain[] = [];
    
    // Core life domains based on IKIGAI elements
    const domainMappings = [
      {
        name: 'Career & Purpose Work',
        description: 'Professional activities aligned with your IKIGAI',
        ikigaiConnections: ['profession', 'vocation'],
        priority: this.calculateDomainPriority('career', ikigaiDiscovery, context)
      },
      {
        name: 'Creative Expression & Passion',
        description: 'Activities and pursuits you love and that energize you',
        ikigaiConnections: ['passion', 'mission'],
        priority: this.calculateDomainPriority('creative', ikigaiDiscovery, context)
      },
      {
        name: 'Community & Service',
        description: 'How you contribute to what the world needs',
        ikigaiConnections: ['mission', 'vocation'],
        priority: this.calculateDomainPriority('community', ikigaiDiscovery, context)
      },
      {
        name: 'Personal Growth & Learning',
        description: 'Developing your talents and capabilities',
        ikigaiConnections: ['passion', 'profession'],
        priority: this.calculateDomainPriority('growth', ikigaiDiscovery, context)
      },
      {
        name: 'Relationships & Connection',
        description: 'Building meaningful relationships aligned with your purpose',
        ikigaiConnections: ['mission'],
        priority: this.calculateDomainPriority('relationships', ikigaiDiscovery, context)
      },
      {
        name: 'Health & Wellbeing',
        description: 'Physical, mental, and spiritual health supporting your purpose',
        ikigaiConnections: ['passion'],
        priority: this.calculateDomainPriority('health', ikigaiDiscovery, context)
      }
    ];
    
    for (const mapping of domainMappings) {
      const domain: LifeDomain = {
        domainId: `domain_${mapping.name.toLowerCase().replace(/\s+/g, '_')}`,
        name: mapping.name,
        description: mapping.description,
        category: mapping.name.toLowerCase().replace(/\s+/g, '_') as LifeDomainCategory,
        priority: mapping.priority,
        ikigaiConnections: await this.mapIKIGAIConnections(mapping.ikigaiConnections, ikigaiDiscovery),
        currentAlignment: await this.assessCurrentDomainAlignment(mapping, context),
        targetAlignment: 0.9, // Default high target
        alignmentGap: 0, // Will be calculated
        developmentAreas: await this.identifyDomainDevelopmentAreas(mapping, ikigaiDiscovery, context),
        culturalIntegration: await this.assessDomainCulturalIntegration(mapping, context),
        supportRequirements: await this.identifyDomainSupportRequirements(mapping, context),
        pathwayOpportunities: [],
        metrics: await this.createDomainMetrics(mapping, ikigaiDiscovery),
        lastAssessment: new Date(),
        nextAssessment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Monthly
        isActive: true
      };
      
      domain.alignmentGap = domain.targetAlignment - domain.currentAlignment;
      domains.push(domain);
    }
    
    return domains.sort((a, b) => b.priority - a.priority);
  }

  // Generate purpose pathways
  private async generatePurposePathways(
    ikigaiDiscovery: IKIGAIDiscovery,
    lifeDomains: LifeDomain[],
    context: LifeArchitectureContext
  ): Promise<PurposePathway[]> {
    
    const pathways: PurposePathway[] = [];
    
    // Generate pathways for each high-priority domain
    for (const domain of lifeDomains.filter(d => d.priority > 0.7)) {
      const domainPathways = await this.generateDomainPathways(
        domain,
        ikigaiDiscovery,
        context
      );
      pathways.push(...domainPathways);
    }
    
    // Generate cross-domain integration pathways
    const integrationPathways = await this.generateCrossDomainPathways(
      lifeDomains,
      ikigaiDiscovery,
      context
    );
    pathways.push(...integrationPathways);
    
    // Generate cultural and community pathways
    const culturalPathways = await this.generateCulturalPathways(
      ikigaiDiscovery,
      context
    );
    pathways.push(...culturalPathways);
    
    return pathways.sort((a, b) => b.purposeAlignmentPotential - a.purposeAlignmentPotential);
  }

  // Helper methods for various calculations would be implemented here...

  private summarizeIKIGAIElements(ikigaiDiscovery: IKIGAIDiscovery): string {
    return `
What You Love: ${ikigaiDiscovery.whatYouLove.items.map(item => item.title).join(', ')}
What You're Good At: ${ikigaiDiscovery.whatYoureGoodAt.items.map(item => item.title).join(', ')}
What the World Needs: ${ikigaiDiscovery.whatTheWorldNeeds.items.map(item => item.title).join(', ')}
What You Can Be Paid For: ${ikigaiDiscovery.whatYouCanBePaidFor.items.map(item => item.title).join(', ')}
`;
  }

  private summarizeIKIGAIIntersections(ikigaiDiscovery: IKIGAIDiscovery): string {
    return `
Passion (Love + Good At): ${ikigaiDiscovery.passion.strengthLevel}/1
Mission (Love + World Needs): ${ikigaiDiscovery.mission.strengthLevel}/1
Vocation (World Needs + Paid For): ${ikigaiDiscovery.vocation.strengthLevel}/1
Profession (Good At + Paid For): ${ikigaiDiscovery.profession.strengthLevel}/1
`;
  }

  // More helper methods would be implemented here...
}

// Supporting interfaces
interface IKIGAIArchitecturalAnalysis {
  lifeDomainRecommendations: LifeDomainRecommendation[];
  purposePathwayOpportunities: PurposePathwayOpportunity[];
  decisionFrameworkElements: DecisionFrameworkElement[];
  alignmentMeasurementStrategy: AlignmentMeasurementStrategy;
  implementationPriorities: ImplementationPriority[];
  culturalIntegrationStrategy: CulturalIntegrationStrategy;
  supportRequirements: SupportRequirement[];
  monitoringStrategy: MonitoringStrategy;
}

interface LifeDomainRecommendation {
  domainName: string;
  priority: number;
  ikigaiAlignment: number;
  developmentOpportunities: string[];
  culturalIntegration: string[];
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface AlignmentTrajectory {
  trendDirection: 'improving' | 'stable' | 'declining';
  velocityOfChange: number;
  projectedAlignment: number;
  confidenceInterval: number;
}

// Export main class and types
export { PurposeDrivenLifeArchitecture };
export type {
  LifeArchitectureConfig,
  LifeArchitectureContext,
  ArchitectureGenerationResult,
  PurposeAlignmentAnalysis,
  DailyPurposeGuidance
};