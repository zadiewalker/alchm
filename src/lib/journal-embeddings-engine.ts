// ALCHM Journal Embeddings Engine
// Gemini-powered semantic analysis and vector embeddings for personalized coaching

import {
  JournalEmbedding,
  ExtractedTheme,
  EmotionalSignature,
  LifeStageIndicator,
  GrowthPattern,
  PersonalizationSignal,
  CoachingNeed,
  InterventionReadiness
} from '@/types/ai-personalization-schema';

import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { IdentityJourney, CulturalContext } from '@/types/identity-schema';
import { CareerJourney, SMARTGoal } from '@/types/career-schema';

export interface JournalEmbeddingsConfig {
  geminiApiKey: string;
  modelVersion: string;
  embeddingDimensions: number;
  batchSize: number;
  cacheEmbeddings: boolean;
  reprocessingInterval: number; // days
  qualityThreshold: number; // 0-1
  culturalAnalysisEnabled: boolean;
  multilingualSupport: boolean;
  privacyMode: 'standard' | 'enhanced' | 'maximum';
}

export interface EmbeddingContext {
  userId: string;
  culturalContext: CulturalContext;
  identityJourney: IdentityJourney;
  careerJourney: CareerJourney;
  currentGoals: SMARTGoal[];
  recentEntries: EmotionalEntry[];
  userPreferences: UserEmbeddingPreferences;
  temporalContext: TemporalContext;
}

export interface UserEmbeddingPreferences {
  analysisDepth: 'surface' | 'moderate' | 'deep' | 'comprehensive';
  focusAreas: EmbeddingFocusArea[];
  culturalSensitivity: 'standard' | 'high' | 'maximum';
  privacyLevel: 'standard' | 'enhanced' | 'maximum';
  languageAnalysis: boolean;
  thematicAnalysis: boolean;
  emotionalAnalysis: boolean;
  progressAnalysis: boolean;
}

export interface EmbeddingFocusArea {
  area: 'emotional_patterns' | 'life_themes' | 'growth_indicators' | 'relationship_dynamics' | 'career_development' | 'creative_expression' | 'spiritual_growth' | 'cultural_identity';
  weight: number; // 0-1
  customization: FocusAreaCustomization;
}

export interface TemporalContext {
  timeOfEntry: Date;
  seasonalFactors: SeasonalFactor[];
  lifePhaseContext: LifePhaseContext;
  recentEventInfluence: RecentEventInfluence[];
  cyclicalPatterns: CyclicalPattern[];
}

export interface EmbeddingAnalysisResult {
  embedding: JournalEmbedding;
  analysisMetadata: AnalysisMetadata;
  qualityMetrics: EmbeddingQualityMetrics;
  personalizationInsights: PersonalizationInsight[];
  recommendationSeeds: RecommendationSeed[];
  culturalAnalysis: CulturalAnalysisResult;
  nextSteps: EmbeddingNextStep[];
}

export interface EmbeddingCluster {
  clusterId: string;
  userId: string;
  clusterType: 'thematic' | 'emotional' | 'temporal' | 'growth_stage' | 'challenge_area';
  
  // Cluster Properties
  centroid: number[]; // Average embedding vector
  coherence: number; // 0-1
  stability: number; // 0-1
  size: number; // Number of embeddings
  
  // Cluster Analysis
  dominantThemes: DominantTheme[];
  emotionalCharacteristics: EmotionalCharacteristic[];
  timePatterns: TimePattern[];
  growthIndicators: ClusterGrowthIndicator[];
  
  // Member Embeddings
  memberEmbeddings: string[]; // JournalEmbedding IDs
  representativeEmbedding: string; // Most representative embedding ID
  outlierEmbeddings: string[]; // Less typical embeddings
  
  // Evolution and Trends
  clusterEvolution: ClusterEvolution[];
  trends: ClusterTrend[];
  predictions: ClusterPrediction[];
  
  // Personalization Implications
  coachingImplications: CoachingImplication[];
  pathwayRelevance: PathwayRelevance[];
  interventionOpportunities: InterventionOpportunity[];
  
  createdAt: Date;
  lastUpdated: Date;
  isActive: boolean;
}

export interface SemanticSimilarity {
  embeddingId1: string;
  embeddingId2: string;
  similarity: number; // 0-1 cosine similarity
  similarityType: 'content' | 'emotional' | 'thematic' | 'growth' | 'overall';
  
  // Similarity Analysis
  sharedThemes: SharedTheme[];
  emotionalResonance: EmotionalResonance;
  contextualAlignment: ContextualAlignment;
  
  // Personalization Value
  insightPotential: number; // 0-1
  coachingValue: number; // 0-1
  pathwayRelevance: number; // 0-1
  
  computedAt: Date;
}

export class JournalEmbeddingsEngine {
  private config: JournalEmbeddingsConfig;
  private geminiClient: GeminiClient;
  private embeddingCache: Map<string, JournalEmbedding>;
  private clusterAnalyzer: ClusterAnalyzer;
  private semanticAnalyzer: SemanticAnalyzer;
  private culturalAnalyzer: CulturalAnalyzer;
  private personalizationExtractor: PersonalizationExtractor;
  private qualityAssessor: EmbeddingQualityAssessor;

  constructor(config: JournalEmbeddingsConfig) {
    this.config = config;
    this.geminiClient = new GeminiClient(config.geminiApiKey);
    this.embeddingCache = new Map();
    this.clusterAnalyzer = new ClusterAnalyzer(config);
    this.semanticAnalyzer = new SemanticAnalyzer(config);
    this.culturalAnalyzer = new CulturalAnalyzer(config);
    this.personalizationExtractor = new PersonalizationExtractor(config);
    this.qualityAssessor = new EmbeddingQualityAssessor(config);
  }

  // Main embedding generation function
  async generateJournalEmbedding(
    entry: EmotionalEntry,
    context: EmbeddingContext
  ): Promise<EmbeddingAnalysisResult> {
    
    console.log('Generating journal embedding for entry:', entry.entryId);
    
    // Step 1: Prepare text content for embedding
    const processedContent = await this.prepareContentForEmbedding(entry, context);
    
    // Step 2: Generate embeddings using Gemini
    const embeddingVectors = await this.generateGeminiEmbeddings(
      processedContent,
      context
    );
    
    // Step 3: Extract themes and patterns
    const thematicAnalysis = await this.extractThemes(
      entry,
      embeddingVectors,
      context
    );
    
    // Step 4: Analyze emotional signature
    const emotionalAnalysis = await this.analyzeEmotionalSignature(
      entry,
      embeddingVectors,
      context
    );
    
    // Step 5: Identify life stage indicators
    const lifeStageAnalysis = await this.identifyLifeStageIndicators(
      entry,
      embeddingVectors,
      context
    );
    
    // Step 6: Detect growth patterns
    const growthAnalysis = await this.detectGrowthPatterns(
      entry,
      embeddingVectors,
      context
    );
    
    // Step 7: Generate personalization signals
    const personalizationSignals = await this.generatePersonalizationSignals(
      entry,
      embeddingVectors,
      thematicAnalysis,
      emotionalAnalysis,
      context
    );
    
    // Step 8: Identify coaching needs
    const coachingNeeds = await this.identifyCoachingNeeds(
      entry,
      personalizationSignals,
      context
    );
    
    // Step 9: Assess intervention readiness
    const interventionReadiness = await this.assessInterventionReadiness(
      entry,
      personalizationSignals,
      context
    );
    
    // Step 10: Perform cultural analysis
    const culturalAnalysis = await this.performCulturalAnalysis(
      entry,
      embeddingVectors,
      context
    );
    
    // Step 11: Create final embedding object
    const embedding: JournalEmbedding = {
      embeddingId: `emb_${entry.entryId}_${Date.now()}`,
      userId: context.userId,
      entryId: entry.entryId,
      contentEmbedding: embeddingVectors.content,
      emotionalEmbedding: embeddingVectors.emotional,
      themeEmbedding: embeddingVectors.theme,
      progressEmbedding: embeddingVectors.progress,
      extractedThemes: thematicAnalysis.themes,
      emotionalSignature: emotionalAnalysis.signature,
      lifeStageIndicators: lifeStageAnalysis.indicators,
      growthPatterns: growthAnalysis.patterns,
      challengeAreas: this.extractChallengeAreas(personalizationSignals),
      strengthAreas: this.extractStrengthAreas(personalizationSignals),
      semanticTags: await this.generateSemanticTags(entry, embeddingVectors),
      intentAnalysis: await this.analyzeIntent(entry, embeddingVectors),
      valueAlignment: await this.analyzeValueAlignment(entry, context),
      goalRelevance: await this.analyzeGoalRelevance(entry, context),
      personalizationSignals,
      coachingNeeds,
      interventionReadiness,
      extractionTimestamp: new Date(),
      modelVersion: this.config.modelVersion,
      confidence: this.calculateEmbeddingConfidence(embeddingVectors, thematicAnalysis),
      qualityScore: await this.assessEmbeddingQuality(embeddingVectors, entry)
    };
    
    // Step 12: Generate analysis result
    const analysisResult: EmbeddingAnalysisResult = {
      embedding,
      analysisMetadata: this.generateAnalysisMetadata(entry, context),
      qualityMetrics: await this.calculateQualityMetrics(embedding),
      personalizationInsights: await this.generatePersonalizationInsights(embedding, context),
      recommendationSeeds: await this.generateRecommendationSeeds(embedding, context),
      culturalAnalysis,
      nextSteps: await this.generateNextSteps(embedding, context)
    };
    
    // Step 13: Cache embedding if quality is sufficient
    if (embedding.qualityScore >= this.config.qualityThreshold) {
      this.embeddingCache.set(embedding.embeddingId, embedding);
    }
    
    return analysisResult;
  }

  // Prepare content for embedding generation
  private async prepareContentForEmbedding(
    entry: EmotionalEntry,
    context: EmbeddingContext
  ): Promise<ProcessedContent> {
    
    const processedContent: ProcessedContent = {
      primaryText: entry.reflectionText,
      contextualText: this.buildContextualText(entry, context),
      emotionalContext: this.extractEmotionalContext(entry),
      temporalContext: this.extractTemporalContext(entry, context),
      culturalContext: this.extractCulturalContext(entry, context),
      goalContext: this.extractGoalContext(entry, context)
    };

    // Apply privacy filtering if needed
    if (context.userPreferences.privacyLevel !== 'standard') {
      processedContent.primaryText = await this.applyPrivacyFiltering(
        processedContent.primaryText,
        context.userPreferences.privacyLevel
      );
    }

    // Apply cultural sensitivity processing
    if (this.config.culturalAnalysisEnabled) {
      processedContent.culturalContext = await this.enhanceCulturalContext(
        processedContent.culturalContext,
        context.culturalContext
      );
    }

    return processedContent;
  }

  // Generate embeddings using Gemini
  private async generateGeminiEmbeddings(
    content: ProcessedContent,
    context: EmbeddingContext
  ): Promise<EmbeddingVectors> {
    
    try {
      // Generate content embedding
      const contentEmbedding = await this.geminiClient.generateEmbedding({
        content: content.primaryText,
        model: 'models/embedding-001',
        taskType: 'SEMANTIC_SIMILARITY'
      });

      // Generate emotional embedding with emotional context
      const emotionalText = this.combineTextWithContext(
        content.primaryText,
        content.emotionalContext
      );
      const emotionalEmbedding = await this.geminiClient.generateEmbedding({
        content: emotionalText,
        model: 'models/embedding-001',
        taskType: 'CLASSIFICATION'
      });

      // Generate thematic embedding with full context
      const thematicText = this.combineTextWithFullContext(content);
      const themeEmbedding = await this.geminiClient.generateEmbedding({
        content: thematicText,
        model: 'models/embedding-001',
        taskType: 'CLUSTERING'
      });

      // Generate progress embedding with temporal context
      const progressText = this.combineTextWithTemporalContext(
        content.primaryText,
        content.temporalContext,
        content.goalContext
      );
      const progressEmbedding = await this.geminiClient.generateEmbedding({
        content: progressText,
        model: 'models/embedding-001',
        taskType: 'SEMANTIC_SIMILARITY'
      });

      return {
        content: contentEmbedding.embedding.values,
        emotional: emotionalEmbedding.embedding.values,
        theme: themeEmbedding.embedding.values,
        progress: progressEmbedding.embedding.values
      };

    } catch (error) {
      console.error('Gemini embedding generation failed:', error);
      return this.generateFallbackEmbeddings(content);
    }
  }

  // Extract themes using AI analysis
  private async extractThemes(
    entry: EmotionalEntry,
    embeddings: EmbeddingVectors,
    context: EmbeddingContext
  ): Promise<ThematicAnalysisResult> {
    
    const analysisPrompt = this.buildThemeAnalysisPrompt(entry, context);
    
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
          maxOutputTokens: 2000
        }
      });

      const analysisResult = this.parseThemeAnalysisResponse(
        geminiResponse.response.text(),
        embeddings,
        context
      );

      return analysisResult;

    } catch (error) {
      console.error('Theme extraction failed:', error);
      return this.generateFallbackThemeAnalysis(entry, context);
    }
  }

  // Build theme analysis prompt
  private buildThemeAnalysisPrompt(
    entry: EmotionalEntry,
    context: EmbeddingContext
  ): string {
    
    return `
Analyze this journal entry for deep themes, patterns, and personal insights to enable personalized AI coaching.

JOURNAL ENTRY:
"${entry.reflectionText}"

CONTEXT:
- Activity: ${entry.activity}
- Mood Change: ${entry.moodBefore} → ${entry.moodAfter}
- Stress Level: ${entry.stressLevel}/10
- Cultural Background: ${JSON.stringify(context.culturalContext)}
- Current Life Phase: ${context.identityJourney.currentPhase}
- Recent Goals: ${context.currentGoals.map(g => g.goalTitle).join(', ')}

Please analyze and identify:

1. CORE LIFE THEMES:
   - Major life areas being explored or developed
   - Recurring patterns across different life domains
   - Values and principles being expressed or questioned
   - Identity development themes

2. EMOTIONAL PATTERNS:
   - Emotional processing styles and preferences
   - Emotional growth indicators
   - Stress response patterns
   - Resilience and coping mechanisms

3. GROWTH INDICATORS:
   - Signs of personal development and learning
   - Areas of expanding awareness or capability
   - Breakthrough moments or insights
   - Integration of new perspectives

4. CHALLENGE AREAS:
   - Persistent difficulties or obstacles
   - Areas requiring support or development
   - Internal conflicts or tensions
   - External barriers to growth

5. STRENGTH AREAS:
   - Natural abilities and talents being expressed
   - Sources of resilience and resourcefulness
   - Areas of confidence and competence
   - Cultural strengths and assets

6. COACHING OPPORTUNITIES:
   - Specific areas where coaching could be most beneficial
   - Readiness for different types of interventions
   - Preferred learning and growth styles
   - Cultural considerations for coaching approach

7. PERSONALIZATION SIGNALS:
   - Communication style preferences
   - Motivational factors and values
   - Learning style indicators
   - Cultural adaptation needs

Please provide specific, actionable insights that can inform personalized AI coaching, pathway recommendations, and intervention timing.

Respond in JSON format with confidence scores (0-1) for each insight.
`;
  }

  // Analyze emotional signature
  private async analyzeEmotionalSignature(
    entry: EmotionalEntry,
    embeddings: EmbeddingVectors,
    context: EmbeddingContext
  ): Promise<EmotionalAnalysisResult> {
    
    const recentEntries = context.recentEntries.slice(-10); // Last 10 entries
    
    const emotionalSignature: EmotionalSignature = {
      dominantEmotions: this.extractDominantEmotions(entry, recentEntries),
      emotionalRange: this.calculateEmotionalRange(recentEntries),
      emotionalStability: this.calculateEmotionalStability(recentEntries),
      emotionalGrowth: this.calculateEmotionalGrowth(recentEntries),
      culturalExpression: await this.analyzeCulturalEmotionalExpression(entry, context)
    };

    return {
      signature: emotionalSignature,
      patterns: this.identifyEmotionalPatterns(recentEntries),
      development: this.assessEmotionalDevelopment(entry, recentEntries),
      culturalFactors: this.analyzeCulturalEmotionalFactors(entry, context)
    };
  }

  // Generate personalization signals
  private async generatePersonalizationSignals(
    entry: EmotionalEntry,
    embeddings: EmbeddingVectors,
    thematicAnalysis: ThematicAnalysisResult,
    emotionalAnalysis: EmotionalAnalysisResult,
    context: EmbeddingContext
  ): Promise<PersonalizationSignal[]> {
    
    const signals: PersonalizationSignal[] = [];

    // Communication style signals
    const communicationSignals = this.extractCommunicationStyleSignals(entry, context);
    signals.push(...communicationSignals);

    // Learning preference signals
    const learningSignals = this.extractLearningPreferenceSignals(entry, thematicAnalysis);
    signals.push(...learningSignals);

    // Motivational signals
    const motivationalSignals = this.extractMotivationalSignals(entry, emotionalAnalysis);
    signals.push(...motivationalSignals);

    // Cultural adaptation signals
    const culturalSignals = this.extractCulturalAdaptationSignals(entry, context);
    signals.push(...culturalSignals);

    // Timing and pacing signals
    const timingSignals = this.extractTimingPreferenceSignals(entry, context);
    signals.push(...timingSignals);

    // Support style signals
    const supportSignals = this.extractSupportStyleSignals(entry, emotionalAnalysis);
    signals.push(...supportSignals);

    return signals.filter(signal => signal.strength > 0.3); // Filter weak signals
  }

  // Generate semantic similarity between embeddings
  async calculateSemanticSimilarity(
    embedding1: JournalEmbedding,
    embedding2: JournalEmbedding
  ): Promise<SemanticSimilarity> {
    
    // Calculate cosine similarity for different embedding types
    const contentSimilarity = this.cosineSimilarity(
      embedding1.contentEmbedding,
      embedding2.contentEmbedding
    );
    
    const emotionalSimilarity = this.cosineSimilarity(
      embedding1.emotionalEmbedding,
      embedding2.emotionalEmbedding
    );
    
    const thematicSimilarity = this.cosineSimilarity(
      embedding1.themeEmbedding,
      embedding2.themeEmbedding
    );
    
    const progressSimilarity = this.cosineSimilarity(
      embedding1.progressEmbedding,
      embedding2.progressEmbedding
    );

    // Calculate overall similarity (weighted average)
    const overallSimilarity = 
      (contentSimilarity * 0.4) +
      (emotionalSimilarity * 0.3) +
      (thematicSimilarity * 0.2) +
      (progressSimilarity * 0.1);

    // Analyze shared themes
    const sharedThemes = this.findSharedThemes(
      embedding1.extractedThemes,
      embedding2.extractedThemes
    );

    // Analyze emotional resonance
    const emotionalResonance = this.analyzeEmotionalResonance(
      embedding1.emotionalSignature,
      embedding2.emotionalSignature
    );

    return {
      embeddingId1: embedding1.embeddingId,
      embeddingId2: embedding2.embeddingId,
      similarity: overallSimilarity,
      similarityType: 'overall',
      sharedThemes,
      emotionalResonance,
      contextualAlignment: this.analyzeContextualAlignment(embedding1, embedding2),
      insightPotential: this.calculateInsightPotential(overallSimilarity, sharedThemes),
      coachingValue: this.calculateCoachingValue(overallSimilarity, emotionalResonance),
      pathwayRelevance: this.calculatePathwayRelevance(overallSimilarity, sharedThemes),
      computedAt: new Date()
    };
  }

  // Cluster embeddings for pattern discovery
  async clusterEmbeddings(
    embeddings: JournalEmbedding[],
    clusterType: EmbeddingCluster['clusterType'],
    userId: string
  ): Promise<EmbeddingCluster[]> {
    
    const clusters: EmbeddingCluster[] = [];
    
    // Select embedding vectors based on cluster type
    const vectors = embeddings.map(emb => {
      switch (clusterType) {
        case 'thematic':
          return emb.themeEmbedding;
        case 'emotional':
          return emb.emotionalEmbedding;
        case 'growth_stage':
          return emb.progressEmbedding;
        default:
          return emb.contentEmbedding;
      }
    });

    // Perform k-means clustering
    const clusterResults = await this.performKMeansClustering(vectors, embeddings);

    // Create cluster objects
    for (let i = 0; i < clusterResults.length; i++) {
      const clusterMembers = clusterResults[i];
      
      if (clusterMembers.length < 2) continue; // Skip small clusters

      const cluster: EmbeddingCluster = {
        clusterId: `cluster_${userId}_${clusterType}_${i}_${Date.now()}`,
        userId,
        clusterType,
        centroid: this.calculateCentroid(clusterMembers.map(m => vectors[m])),
        coherence: this.calculateClusterCoherence(clusterMembers, vectors),
        stability: 0.8, // Would be calculated based on historical data
        size: clusterMembers.length,
        dominantThemes: await this.extractDominantThemes(clusterMembers, embeddings),
        emotionalCharacteristics: await this.extractEmotionalCharacteristics(clusterMembers, embeddings),
        timePatterns: this.extractTimePatterns(clusterMembers, embeddings),
        growthIndicators: this.extractClusterGrowthIndicators(clusterMembers, embeddings),
        memberEmbeddings: clusterMembers.map(m => embeddings[m].embeddingId),
        representativeEmbedding: this.findRepresentativeEmbedding(clusterMembers, embeddings),
        outlierEmbeddings: this.findOutlierEmbeddings(clusterMembers, embeddings),
        clusterEvolution: [],
        trends: await this.identifyClusterTrends(clusterMembers, embeddings),
        predictions: await this.generateClusterPredictions(clusterMembers, embeddings),
        coachingImplications: await this.generateCoachingImplications(clusterMembers, embeddings),
        pathwayRelevance: await this.assessPathwayRelevance(clusterMembers, embeddings),
        interventionOpportunities: await this.identifyInterventionOpportunities(clusterMembers, embeddings),
        createdAt: new Date(),
        lastUpdated: new Date(),
        isActive: true
      };

      clusters.push(cluster);
    }

    return clusters;
  }

  // Helper methods
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private extractDominantEmotions(entry: EmotionalEntry, recentEntries: EmotionalEntry[]): string[] {
    const allEmotions = [
      entry.emotionalState.primaryEmotion,
      ...entry.emotionalState.secondaryEmotions,
      ...recentEntries.flatMap(e => [e.emotionalState.primaryEmotion, ...e.emotionalState.secondaryEmotions])
    ];

    const emotionCounts = allEmotions.reduce((counts, emotion) => {
      counts[emotion] = (counts[emotion] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    return Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([emotion]) => emotion);
  }

  private calculateEmotionalRange(entries: EmotionalEntry[]): number {
    if (entries.length === 0) return 0;
    
    const intensities = entries.map(e => e.emotionalState.emotionIntensity);
    const max = Math.max(...intensities);
    const min = Math.min(...intensities);
    
    return (max - min) / 10; // Normalize to 0-1
  }

  private calculateEmotionalStability(entries: EmotionalEntry[]): number {
    if (entries.length < 2) return 0.5;
    
    const moodChanges = entries.map(e => Math.abs(e.moodAfter - e.moodBefore));
    const avgChange = moodChanges.reduce((sum, change) => sum + change, 0) / moodChanges.length;
    
    return Math.max(0, 1 - (avgChange / 10)); // Higher stability = lower average change
  }

  private generateFallbackEmbeddings(content: ProcessedContent): EmbeddingVectors {
    // Generate simple embeddings based on text features
    const textLength = content.primaryText.length;
    const wordCount = content.primaryText.split(' ').length;
    
    // Create basic embeddings (in production, use proper fallback model)
    const fallbackVector = new Array(768).fill(0).map(() => Math.random() - 0.5);
    
    return {
      content: fallbackVector,
      emotional: fallbackVector.map(v => v * 0.8),
      theme: fallbackVector.map(v => v * 0.9),
      progress: fallbackVector.map(v => v * 0.7)
    };
  }

  // More helper methods would be implemented here...
}

// Supporting interfaces
interface ProcessedContent {
  primaryText: string;
  contextualText: string;
  emotionalContext: string;
  temporalContext: string;
  culturalContext: string;
  goalContext: string;
}

interface EmbeddingVectors {
  content: number[];
  emotional: number[];
  theme: number[];
  progress: number[];
}

interface ThematicAnalysisResult {
  themes: ExtractedTheme[];
  patterns: ThemePattern[];
  evolution: ThemeEvolution[];
  insights: ThemeInsight[];
}

interface EmotionalAnalysisResult {
  signature: EmotionalSignature;
  patterns: EmotionalPattern[];
  development: EmotionalDevelopment;
  culturalFactors: CulturalEmotionalFactor[];
}

// Export main class and types
export { JournalEmbeddingsEngine };
export type {
  JournalEmbeddingsConfig,
  EmbeddingContext,
  EmbeddingAnalysisResult,
  EmbeddingCluster,
  SemanticSimilarity
};