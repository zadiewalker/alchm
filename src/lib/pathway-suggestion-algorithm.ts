// ALCHM Pathway Suggestion Algorithm
// Journal embeddings → Gemini analysis → personalized pathway recommendations

import {
  JournalEmbedding,
  PersonalizedPathway,
  PersonalizationSignal,
  CoachingNeed,
  UserState
} from '@/types/ai-personalization-schema';

import { IdentityJourney, CulturalContext } from '@/types/identity-schema';
import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { CareerJourney, SMARTGoal } from '@/types/career-schema';

export interface PathwaySuggestionConfig {
  geminiApiKey: string;
  modelVersion: string;
  maxPathways: number;
  relevanceThreshold: number; // 0-1
  personalizationDepth: 'basic' | 'standard' | 'advanced' | 'expert';
  culturalAdaptationLevel: 'standard' | 'high' | 'comprehensive';
  adaptiveRefinement: boolean;
  realTimeAdjustment: boolean;
  communityIntegration: boolean;
}

export interface PathwaySuggestionContext {
  userId: string;
  recentEmbeddings: JournalEmbedding[];
  userState: UserState;
  culturalContext: CulturalContext;
  identityJourney: IdentityJourney;
  careerJourney: CareerJourney;
  currentGoals: SMARTGoal[];
  completedPathways: string[];
  currentPathways: string[];
  userPreferences: UserPathwayPreferences;
  availableTime: number; // minutes per week
  supportLevel: SupportLevel;
  temporalContext: TemporalContext;
}

export interface UserPathwayPreferences {
  preferredCategories: PathwayCategory[];
  avoidedCategories: PathwayCategory[];
  learningStyle: LearningStyle;
  pacePreference: 'slow' | 'moderate' | 'fast' | 'intensive' | 'adaptive';
  difficultyPreference: 'progressive' | 'challenging' | 'comfortable' | 'adaptive';
  formatPreferences: PathwayFormat[];
  timeCommitment: TimeCommitment;
  communityInvolvement: 'none' | 'minimal' | 'moderate' | 'high';
  culturalIncorporation: 'minimal' | 'moderate' | 'comprehensive';
  accessibilityNeeds: AccessibilityNeed[];
}

export interface PathwayRecommendation {
  pathway: PersonalizedPathway;
  relevanceScore: number; // 0-1
  personalizations: PathwayPersonalization[];
  adaptations: PathwayAdaptation[];
  reasoning: RecommendationReasoning;
  expectedOutcomes: ExpectedOutcome[];
  successProbability: number; // 0-1
  timeToCompletion: string;
  prerequisites: Prerequisite[];
  supportRequirements: SupportRequirement[];
}

export interface PathwayAnalysisResult {
  recommendations: PathwayRecommendation[];
  embeddingInsights: EmbeddingInsight[];
  patternAnalysis: PatternAnalysis;
  culturalConsiderations: CulturalConsideration[];
  growthOpportunities: GrowthOpportunity[];
  challengePreparation: ChallengePreparation[];
  communityConnections: CommunityConnection[];
  nextSteps: PathwayNextStep[];
}

export interface EmbeddingClusterAnalysis {
  clusterId: string;
  dominantThemes: string[];
  emotionalPatterns: string[];
  growthIndicators: string[];
  pathwayOpportunities: PathwayOpportunity[];
  culturalElements: string[];
  developmentAreas: string[];
  readinessIndicators: ReadinessIndicator[];
}

export class PathwaySuggestionAlgorithm {
  private config: PathwaySuggestionConfig;
  private geminiClient: GeminiClient;
  private embeddingAnalyzer: EmbeddingAnalyzer;
  private pathwayMatcher: PathwayMatcher;
  private personalizationEngine: PathwayPersonalizationEngine;
  private culturalAdaptationEngine: CulturalPathwayEngine;
  private recommendationGenerator: RecommendationGenerator;
  private pathwayLibrary: PathwayLibrary;

  constructor(config: PathwaySuggestionConfig) {
    this.config = config;
    this.geminiClient = new GeminiClient(config.geminiApiKey);
    this.embeddingAnalyzer = new EmbeddingAnalyzer(config);
    this.pathwayMatcher = new PathwayMatcher(config);
    this.personalizationEngine = new PathwayPersonalizationEngine(config);
    this.culturalAdaptationEngine = new CulturalPathwayEngine(config);
    this.recommendationGenerator = new RecommendationGenerator(config);
    this.pathwayLibrary = new PathwayLibrary();
  }

  // Main pathway suggestion function
  async generatePathwaySuggestions(
    context: PathwaySuggestionContext
  ): Promise<PathwayAnalysisResult> {
    
    console.log('Generating pathway suggestions for user:', context.userId);
    
    // Step 1: Analyze journal embeddings for patterns and insights
    const embeddingAnalysis = await this.analyzeJournalEmbeddings(
      context.recentEmbeddings,
      context
    );
    
    // Step 2: Perform semantic clustering of embeddings
    const clusterAnalysis = await this.performEmbeddingClustering(
      context.recentEmbeddings,
      context
    );
    
    // Step 3: Extract personalization signals from embeddings
    const personalizationSignals = await this.extractPathwayPersonalizationSignals(
      embeddingAnalysis,
      clusterAnalysis,
      context
    );
    
    // Step 4: Identify growth patterns and development opportunities
    const growthOpportunities = await this.identifyGrowthOpportunities(
      embeddingAnalysis,
      personalizationSignals,
      context
    );
    
    // Step 5: Match user context with pathway library
    const candidatePathways = await this.matchCandidatePathways(
      growthOpportunities,
      personalizationSignals,
      context
    );
    
    // Step 6: Score and rank pathway candidates
    const scoredPathways = await this.scorePathwayCandidates(
      candidatePathways,
      embeddingAnalysis,
      context
    );
    
    // Step 7: Apply cultural adaptations
    const culturallyAdaptedPathways = await this.applyCulturalAdaptations(
      scoredPathways,
      context.culturalContext
    );
    
    // Step 8: Personalize pathways based on user preferences
    const personalizedPathways = await this.personalizePathways(
      culturallyAdaptedPathways,
      personalizationSignals,
      context
    );
    
    // Step 9: Generate comprehensive recommendations
    const recommendations = await this.generateRecommendations(
      personalizedPathways,
      embeddingAnalysis,
      context
    );
    
    // Step 10: Identify community connections and support needs
    const communityConnections = await this.identifyCommunityConnections(
      recommendations,
      context
    );
    
    return {
      recommendations: recommendations.slice(0, this.config.maxPathways),
      embeddingInsights: embeddingAnalysis.insights,
      patternAnalysis: embeddingAnalysis.patterns,
      culturalConsiderations: await this.generateCulturalConsiderations(context),
      growthOpportunities,
      challengePreparation: await this.generateChallengePreparation(recommendations),
      communityConnections,
      nextSteps: await this.generateNextSteps(recommendations, context)
    };
  }

  // Analyze journal embeddings for pathway insights
  private async analyzeJournalEmbeddings(
    embeddings: JournalEmbedding[],
    context: PathwaySuggestionContext
  ): Promise<EmbeddingAnalysisResult> {
    
    // Build analysis prompt for Gemini
    const analysisPrompt = this.buildEmbeddingAnalysisPrompt(embeddings, context);
    
    try {
      const geminiResponse = await this.geminiClient.generateContent({
        contents: [{
          parts: [{
            text: analysisPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
          maxOutputTokens: 3000
        }
      });

      const analysisResult = this.parseEmbeddingAnalysisResponse(
        geminiResponse.response.text(),
        embeddings,
        context
      );

      return analysisResult;

    } catch (error) {
      console.error('Embedding analysis failed:', error);
      return this.generateFallbackEmbeddingAnalysis(embeddings, context);
    }
  }

  // Build comprehensive embedding analysis prompt
  private buildEmbeddingAnalysisPrompt(
    embeddings: JournalEmbedding[],
    context: PathwaySuggestionContext
  ): string {
    
    const recentThemes = this.extractRecentThemes(embeddings);
    const emotionalPatterns = this.extractEmotionalPatterns(embeddings);
    const growthIndicators = this.extractGrowthIndicators(embeddings);
    
    return `
Analyze these journal embeddings to suggest personalized growth pathways for AI-powered coaching.

USER CONTEXT:
- Current Life Phase: ${context.identityJourney.currentPhase}
- Career Stage: ${context.careerJourney.currentPhase}
- Cultural Background: ${JSON.stringify(context.culturalContext)}
- Current State: Energy ${context.userState.energyLevel}/10, Stress ${context.userState.stressLevel}/10, Motivation ${context.userState.motivationLevel}/10
- Available Time: ${context.availableTime} minutes/week
- Current Goals: ${context.currentGoals.map(g => g.goalTitle).join(', ')}
- Completed Pathways: ${context.completedPathways.join(', ') || 'None'}

JOURNAL EMBEDDING INSIGHTS:
Recent Themes (${recentThemes.length} identified):
${recentThemes.map(theme => `- ${theme.theme} (confidence: ${theme.confidence}, frequency: ${theme.frequency})`).join('\n')}

Emotional Patterns:
${emotionalPatterns.map(pattern => `- ${pattern.pattern}: ${pattern.description}`).join('\n')}

Growth Indicators:
${growthIndicators.map(indicator => `- ${indicator.area}: ${indicator.description} (strength: ${indicator.strength})`).join('\n')}

USER PERSONALIZATION SIGNALS:
${embeddings.flatMap(e => e.personalizationSignals)
  .slice(0, 10)
  .map(signal => `- ${signal.signal}: ${signal.strength} (${signal.implications?.join(', ') || 'No implications'})`)
  .join('\n')}

USER COACHING NEEDS:
${embeddings.flatMap(e => e.coachingNeeds)
  .slice(0, 8)
  .map(need => `- ${need.need} (urgency: ${need.urgency}, approach: ${need.coachingApproach?.join(', ') || 'Not specified'})`)
  .join('\n')}

USER PREFERENCES:
- Learning Style: ${JSON.stringify(context.userPreferences.learningStyle)}
- Pace Preference: ${context.userPreferences.pacePreference}
- Preferred Categories: ${context.userPreferences.preferredCategories.join(', ')}
- Cultural Incorporation: ${context.userPreferences.culturalIncorporation}
- Community Involvement: ${context.userPreferences.communityInvolvement}

Please analyze and provide:

1. PATHWAY OPPORTUNITIES:
   - Specific growth pathways that align with journal themes
   - Development areas identified from embedding patterns
   - Skill-building opportunities based on user goals
   - Creative and spiritual growth paths from cultural context
   - Career advancement pathways from professional insights
   - Wellness and healing pathways from emotional patterns

2. READINESS ASSESSMENT:
   - User's readiness for different pathway types
   - Optimal timing for pathway initiation
   - Prerequisites needed for pathway success
   - Potential obstacles and how to address them

3. PERSONALIZATION FACTORS:
   - Key personalization signals for pathway adaptation
   - Cultural adaptation requirements
   - Communication and learning style preferences
   - Motivational factors and engagement strategies

4. GROWTH PATTERN ANALYSIS:
   - Identified growth patterns from journal evolution
   - Areas of breakthrough potential
   - Integration opportunities for previous learning
   - Natural next steps in development journey

5. CULTURAL INTEGRATION:
   - Cultural elements to incorporate in pathways
   - Traditional practices and wisdom integration
   - Community and ancestral connection opportunities
   - Culturally appropriate coaching approaches

6. RECOMMENDATION PRIORITIES:
   - Top 3 pathway categories to prioritize
   - Specific pathway features to emphasize
   - Success factors for pathway completion
   - Support and accountability requirements

Respond in JSON format with confidence scores (0-1) for all insights and specific, actionable pathway suggestions.
`;
  }

  // Perform semantic clustering of embeddings
  private async performEmbeddingClustering(
    embeddings: JournalEmbedding[],
    context: PathwaySuggestionContext
  ): Promise<EmbeddingClusterAnalysis[]> {
    
    if (embeddings.length < 3) {
      return []; // Need minimum embeddings for clustering
    }

    // Extract content embeddings for clustering
    const contentVectors = embeddings.map(emb => emb.contentEmbedding);
    const themeVectors = embeddings.map(emb => emb.themeEmbedding);
    
    // Perform k-means clustering on different embedding types
    const contentClusters = await this.performKMeansClustering(contentVectors, 3);
    const themeClusters = await this.performKMeansClustering(themeVectors, 3);
    
    const clusterAnalyses: EmbeddingClusterAnalysis[] = [];
    
    // Analyze content clusters
    for (let i = 0; i < contentClusters.length; i++) {
      const clusterEmbeddings = contentClusters[i].map(idx => embeddings[idx]);
      
      if (clusterEmbeddings.length < 2) continue;
      
      const analysis: EmbeddingClusterAnalysis = {
        clusterId: `content_cluster_${i}`,
        dominantThemes: this.extractDominantThemes(clusterEmbeddings),
        emotionalPatterns: this.extractClusterEmotionalPatterns(clusterEmbeddings),
        growthIndicators: this.extractClusterGrowthIndicators(clusterEmbeddings),
        pathwayOpportunities: await this.identifyClusterPathwayOpportunities(clusterEmbeddings, context),
        culturalElements: this.extractCulturalElements(clusterEmbeddings),
        developmentAreas: this.extractDevelopmentAreas(clusterEmbeddings),
        readinessIndicators: this.assessClusterReadiness(clusterEmbeddings, context)
      };
      
      clusterAnalyses.push(analysis);
    }
    
    return clusterAnalyses;
  }

  // Match user context with pathway library
  private async matchCandidatePathways(
    growthOpportunities: GrowthOpportunity[],
    personalizationSignals: PersonalizationSignal[],
    context: PathwaySuggestionContext
  ): Promise<CandidatePathway[]> {
    
    const candidatePathways: CandidatePathway[] = [];
    
    // Get pathway templates from library
    const pathwayTemplates = this.pathwayLibrary.getAllPathways();
    
    for (const template of pathwayTemplates) {
      // Skip if in avoided categories
      if (context.userPreferences.avoidedCategories.includes(template.category)) {
        continue;
      }
      
      // Skip if already completed
      if (context.completedPathways.includes(template.pathwayId)) {
        continue;
      }
      
      // Calculate base compatibility score
      const compatibilityScore = this.calculateCompatibilityScore(
        template,
        growthOpportunities,
        personalizationSignals,
        context
      );
      
      // Only include if meets relevance threshold
      if (compatibilityScore >= this.config.relevanceThreshold) {
        candidatePathways.push({
          template,
          compatibilityScore,
          matchingOpportunities: this.findMatchingOpportunities(template, growthOpportunities),
          personalizationPotential: this.calculatePersonalizationPotential(template, personalizationSignals),
          culturalAlignment: this.calculateCulturalAlignment(template, context.culturalContext),
          prerequisitesMet: this.checkPrerequisites(template, context),
          estimatedEffort: this.estimateEffort(template, context)
        });
      }
    }
    
    return candidatePathways.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  // Score and rank pathway candidates
  private async scorePathwayCandidates(
    candidates: CandidatePathway[],
    embeddingAnalysis: EmbeddingAnalysisResult,
    context: PathwaySuggestionContext
  ): Promise<ScoredPathway[]> {
    
    const scoredPathways: ScoredPathway[] = [];
    
    for (const candidate of candidates) {
      const scores = {
        relevanceScore: this.calculateRelevanceScore(candidate, embeddingAnalysis, context),
        personalizationScore: this.calculatePersonalizationScore(candidate, context),
        culturalFitScore: this.calculateCulturalFitScore(candidate, context),
        feasibilityScore: this.calculateFeasibilityScore(candidate, context),
        impactScore: this.calculateImpactScore(candidate, embeddingAnalysis),
        engagementScore: this.calculateEngagementScore(candidate, context),
        supportScore: this.calculateSupportScore(candidate, context)
      };
      
      // Calculate weighted overall score
      const overallScore = 
        (scores.relevanceScore * 0.25) +
        (scores.personalizationScore * 0.20) +
        (scores.culturalFitScore * 0.15) +
        (scores.feasibilityScore * 0.15) +
        (scores.impactScore * 0.10) +
        (scores.engagementScore * 0.10) +
        (scores.supportScore * 0.05);
      
      scoredPathways.push({
        candidate,
        scores,
        overallScore,
        reasoning: this.generateScoringReasoning(candidate, scores),
        recommendationStrength: this.calculateRecommendationStrength(overallScore, scores)
      });
    }
    
    return scoredPathways.sort((a, b) => b.overallScore - a.overallScore);
  }

  // Generate comprehensive pathway recommendations
  private async generateRecommendations(
    personalizedPathways: PersonalizedPathway[],
    embeddingAnalysis: EmbeddingAnalysisResult,
    context: PathwaySuggestionContext
  ): Promise<PathwayRecommendation[]> {
    
    const recommendations: PathwayRecommendation[] = [];
    
    for (const pathway of personalizedPathways) {
      const recommendation: PathwayRecommendation = {
        pathway,
        relevanceScore: this.calculateFinalRelevanceScore(pathway, embeddingAnalysis),
        personalizations: await this.generatePersonalizationList(pathway, context),
        adaptations: await this.generateAdaptationList(pathway, context),
        reasoning: await this.generateRecommendationReasoning(pathway, embeddingAnalysis, context),
        expectedOutcomes: await this.generateExpectedOutcomes(pathway, context),
        successProbability: this.calculateSuccessProbability(pathway, context),
        timeToCompletion: this.estimateTimeToCompletion(pathway, context),
        prerequisites: this.identifyPrerequisites(pathway, context),
        supportRequirements: this.identifySupportRequirements(pathway, context)
      };
      
      recommendations.push(recommendation);
    }
    
    return recommendations;
  }

  // Helper methods for pathway scoring and analysis
  private calculateCompatibilityScore(
    template: PathwayTemplate,
    opportunities: GrowthOpportunity[],
    signals: PersonalizationSignal[],
    context: PathwaySuggestionContext
  ): number {
    
    let score = 0;
    
    // Category preference alignment
    if (context.userPreferences.preferredCategories.includes(template.category)) {
      score += 0.3;
    }
    
    // Growth opportunity alignment
    const relevantOpportunities = opportunities.filter(opp => 
      opp.category === template.category || 
      opp.skills.some(skill => template.targetSkills?.includes(skill))
    );
    score += Math.min(relevantOpportunities.length * 0.1, 0.3);
    
    // Personalization signal alignment
    const relevantSignals = signals.filter(signal =>
      signal.context.some(ctx => template.keywords?.includes(ctx))
    );
    const signalStrength = relevantSignals.reduce((sum, signal) => sum + signal.strength, 0);
    score += Math.min(signalStrength * 0.2, 0.2);
    
    // Current goal alignment
    const goalAlignment = context.currentGoals.filter(goal =>
      goal.categories?.some(cat => cat === template.category) ||
      template.keywords?.some(keyword => goal.goalTitle.toLowerCase().includes(keyword))
    ).length;
    score += Math.min(goalAlignment * 0.1, 0.2);
    
    return Math.min(score, 1);
  }

  private extractRecentThemes(embeddings: JournalEmbedding[]): ExtractedTheme[] {
    const allThemes = embeddings.flatMap(e => e.extractedThemes);
    
    // Group by theme and calculate aggregated stats
    const themeMap = new Map<string, ExtractedTheme[]>();
    allThemes.forEach(theme => {
      if (!themeMap.has(theme.theme)) {
        themeMap.set(theme.theme, []);
      }
      themeMap.get(theme.theme)!.push(theme);
    });
    
    // Create aggregated theme objects
    const aggregatedThemes: ExtractedTheme[] = [];
    for (const [themeName, themes] of themeMap) {
      const avgConfidence = themes.reduce((sum, t) => sum + t.confidence, 0) / themes.length;
      const totalFrequency = themes.reduce((sum, t) => sum + t.frequency, 0);
      
      aggregatedThemes.push({
        theme: themeName,
        confidence: avgConfidence,
        frequency: totalFrequency,
        evolution: themes.flatMap(t => t.evolution),
        culturalContext: [...new Set(themes.flatMap(t => t.culturalContext))],
        emotionalResonance: themes.reduce((sum, t) => sum + t.emotionalResonance, 0) / themes.length
      });
    }
    
    return aggregatedThemes
      .sort((a, b) => (b.confidence * b.frequency) - (a.confidence * a.frequency))
      .slice(0, 10);
  }

  private extractEmotionalPatterns(embeddings: JournalEmbedding[]): EmotionalPattern[] {
    // Analyze emotional signatures across embeddings
    const signatures = embeddings.map(e => e.emotionalSignature);
    
    const patterns: EmotionalPattern[] = [];
    
    // Dominant emotion patterns
    const allDominantEmotions = signatures.flatMap(s => s.dominantEmotions);
    const emotionCounts = allDominantEmotions.reduce((counts, emotion) => {
      counts[emotion] = (counts[emotion] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      if (count >= 2) { // Appears in at least 2 entries
        patterns.push({
          pattern: 'dominant_emotion',
          description: `Recurring ${emotion} experiences`,
          frequency: count / embeddings.length,
          confidence: Math.min(count / embeddings.length, 1)
        });
      }
    });
    
    // Emotional range patterns
    const avgEmotionalRange = signatures.reduce((sum, s) => sum + s.emotionalRange, 0) / signatures.length;
    if (avgEmotionalRange > 0.7) {
      patterns.push({
        pattern: 'high_emotional_range',
        description: 'Experiences wide range of emotions',
        frequency: avgEmotionalRange,
        confidence: 0.8
      });
    } else if (avgEmotionalRange < 0.3) {
      patterns.push({
        pattern: 'limited_emotional_range',
        description: 'Experiences within narrow emotional range',
        frequency: 1 - avgEmotionalRange,
        confidence: 0.8
      });
    }
    
    return patterns;
  }

  private extractGrowthIndicators(embeddings: JournalEmbedding[]): GrowthIndicator[] {
    const allPatterns = embeddings.flatMap(e => e.growthPatterns);
    
    const indicators: GrowthIndicator[] = [];
    
    // Group by pattern type
    const patternTypeGroups = allPatterns.reduce((groups, pattern) => {
      if (!groups[pattern.patternType]) groups[pattern.patternType] = [];
      groups[pattern.patternType].push(pattern);
      return groups;
    }, {} as Record<string, GrowthPattern[]>);
    
    Object.entries(patternTypeGroups).forEach(([type, patterns]) => {
      const avgVelocity = patterns.reduce((sum, p) => sum + p.velocity, 0) / patterns.length;
      const avgSustainability = patterns.reduce((sum, p) => sum + p.sustainability, 0) / patterns.length;
      const allAreas = [...new Set(patterns.flatMap(p => p.areas))];
      
      indicators.push({
        area: type,
        description: `${type} growth pattern identified`,
        strength: (avgVelocity + avgSustainability) / 2,
        areas: allAreas,
        velocity: avgVelocity,
        sustainability: avgSustainability
      });
    });
    
    return indicators.sort((a, b) => b.strength - a.strength);
  }

  // More helper methods would be implemented here...
}

// Supporting interfaces
interface CandidatePathway {
  template: PathwayTemplate;
  compatibilityScore: number;
  matchingOpportunities: GrowthOpportunity[];
  personalizationPotential: number;
  culturalAlignment: number;
  prerequisitesMet: boolean;
  estimatedEffort: number;
}

interface ScoredPathway {
  candidate: CandidatePathway;
  scores: PathwayScores;
  overallScore: number;
  reasoning: ScoringReasoning;
  recommendationStrength: 'weak' | 'moderate' | 'strong' | 'excellent';
}

interface PathwayScores {
  relevanceScore: number;
  personalizationScore: number;
  culturalFitScore: number;
  feasibilityScore: number;
  impactScore: number;
  engagementScore: number;
  supportScore: number;
}

interface EmbeddingAnalysisResult {
  insights: EmbeddingInsight[];
  patterns: PatternAnalysis;
  opportunities: GrowthOpportunity[];
  readiness: ReadinessAssessment;
  personalizationFactors: PersonalizationFactor[];
  culturalElements: CulturalElement[];
}

interface EmotionalPattern {
  pattern: string;
  description: string;
  frequency: number;
  confidence: number;
}

interface GrowthIndicator {
  area: string;
  description: string;
  strength: number;
  areas: string[];
  velocity: number;
  sustainability: number;
}

// Export main class and types
export { PathwaySuggestionAlgorithm };
export type {
  PathwaySuggestionConfig,
  PathwaySuggestionContext,
  PathwayRecommendation,
  PathwayAnalysisResult
};