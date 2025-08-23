// ALCHM IKIGAI Analysis Engine
// AI-powered semantic clustering and life purpose mapping

import {
  IKIGAISession,
  IKIGAIResponses,
  IKIGAIAIMap,
  IKIGAICluster,
  RecommendedAction,
  PassionResponse,
  SkillResponse,
  ValueResponse,
  OpportunityResponse,
  IntersectionMapping,
  CentralIntersection,
  ConnectionStrength,
  AIInsight,
  CulturalAdaptation,
  TraumaInformedNote
} from '@/types/ikigai-schema';
import { generateGeminiInsight } from '@/lib/ai/gemini-pathways';
import { generateGPTMentorship } from '@/lib/ai/gpt-pathways';
import { CulturalContext, EmotionalState } from '@/types/pathways-schema';
import { db } from '@/lib/firebaseAdmin';
import { validateSession } from '@/lib/validateSession';

export interface IKIGAIAnalysisRequest {
  userId: string;
  sessionId: string;
  responses: IKIGAIResponses;
  culturalContext: CulturalContext;
  previousSessions?: IKIGAISession[];
  analysisDepth: 'quick' | 'standard' | 'comprehensive';
  focusAreas?: string[];
  traumaInformedMode: boolean;
}

export interface IKIGAIAnalysisResult {
  aiMap: IKIGAIAIMap;
  alignmentScore: number;
  insights: AIInsight[];
  recommendations: RecommendedAction[];
  culturalAdaptations: CulturalAdaptation[];
  traumaInformedNotes: TraumaInformedNote[];
  processingMetadata: AnalysisMetadata;
}

export interface AnalysisMetadata {
  processingTime: number;
  aiProvidersUsed: string[];
  confidenceScore: number;
  culturalAdaptationApplied: boolean;
  traumaInformedAdjustments: string[];
  qualityMetrics: QualityMetrics;
}

export interface QualityMetrics {
  coherenceScore: number;        // How well elements fit together
  actionabilityScore: number;    // How actionable the insights are
  culturalResonanceScore: number; // Cultural alignment
  personalRelevanceScore: number; // Personal relevance
  completenessScore: number;     // How complete the analysis is
}

export interface SemanticVector {
  elementId: string;
  elementType: 'passion' | 'skill' | 'value' | 'opportunity';
  vector: number[];             // Embedding vector
  keywords: string[];
  emotionalTone: number[];      // Emotional dimensions
  culturalMarkers: string[];    // Cultural significance markers
  intensityScore: number;       // Overall intensity/importance
}

export interface ClusteringResult {
  clusters: IKIGAICluster[];
  outliers: string[];          // Elements that don't fit well in clusters
  qualityScore: number;        // Quality of clustering
  recommendedMerges: ClusterMergeRecommendation[];
  recommendedSplits: ClusterSplitRecommendation[];
}

export interface ClusterMergeRecommendation {
  cluster1Id: string;
  cluster2Id: string;
  similarity: number;
  rationale: string;
}

export interface ClusterSplitRecommendation {
  clusterId: string;
  splitPoint: number;
  rationale: string;
  suggestedNames: string[];
}

export class IKIGAIAnalysisEngine {
  private static instance: IKIGAIAnalysisEngine;
  
  private constructor() {}

  static getInstance(): IKIGAIAnalysisEngine {
    if (!IKIGAIAnalysisEngine.instance) {
      IKIGAIAnalysisEngine.instance = new IKIGAIAnalysisEngine();
    }
    return IKIGAIAnalysisEngine.instance;
  }

  /**
   * Main analysis method - generates complete IKIGAI AI map
   */
  async analyzeIKIGAI(request: IKIGAIAnalysisRequest): Promise<IKIGAIAnalysisResult> {
    const startTime = Date.now();
    
    try {
      await validateSession(request.userId);

      // Step 1: Generate semantic vectors for all elements
      const semanticVectors = await this.generateSemanticVectors(request.responses, request.culturalContext);

      // Step 2: Perform semantic clustering using Gemini
      const clusteringResult = await this.performSemanticClustering(semanticVectors, request);

      // Step 3: Calculate intersection mappings
      const intersections = await this.calculateIntersections(request.responses, semanticVectors, request.culturalContext);

      // Step 4: Generate connection strengths
      const connectionStrengths = await this.calculateConnectionStrengths(semanticVectors, intersections);

      // Step 5: Generate AI insights using Gemini
      const aiInsights = await this.generateAIInsights(request, clusteringResult, intersections);

      // Step 6: Generate coaching narrative and recommendations using GPT-4o
      const coachingResults = await this.generateCoachingNarrative(request, clusteringResult, aiInsights);

      // Step 7: Calculate alignment score
      const alignmentScore = this.calculateAlignmentScore(clusteringResult, intersections, request.responses);

      // Step 8: Generate visual elements for the map
      const visualElements = await this.generateVisualElements(clusteringResult, connectionStrengths, request.culturalContext);

      // Step 9: Apply cultural adaptations
      const culturalAdaptations = await this.applyCulturalAdaptations(request, coachingResults);

      // Step 10: Generate trauma-informed notes if needed
      const traumaInformedNotes = request.traumaInformedMode 
        ? await this.generateTraumaInformedNotes(request, aiInsights)
        : [];

      const aiMap: IKIGAIAIMap = {
        clusters: clusteringResult.clusters,
        synthesisText: coachingResults.synthesisText,
        recommendedActions: coachingResults.recommendedActions,
        visualElements,
        connectionStrengths,
        insights: aiInsights,
        personalityAlignment: await this.analyzePersonalityAlignment(request.responses),
        culturalAlignment: await this.analyzeCulturalAlignment(request.responses, request.culturalContext),
        developmentTrajectory: await this.generateDevelopmentTrajectory(clusteringResult, intersections, request)
      };

      return {
        aiMap,
        alignmentScore,
        insights: aiInsights,
        recommendations: coachingResults.recommendedActions,
        culturalAdaptations,
        traumaInformedNotes,
        processingMetadata: {
          processingTime: Date.now() - startTime,
          aiProvidersUsed: ['gemini', 'gpt'],
          confidenceScore: this.calculateConfidenceScore(aiInsights, coachingResults),
          culturalAdaptationApplied: culturalAdaptations.length > 0,
          traumaInformedAdjustments: traumaInformedNotes.map(note => note.type),
          qualityMetrics: this.calculateQualityMetrics(aiMap, request)
        }
      };

    } catch (error) {
      console.error('Error in IKIGAI analysis:', error);
      throw error;
    }
  }

  /**
   * Generate semantic vectors for all IKIGAI elements using Gemini
   */
  private async generateSemanticVectors(
    responses: IKIGAIResponses,
    culturalContext: CulturalContext
  ): Promise<SemanticVector[]> {
    const vectors: SemanticVector[] = [];

    // Process passions
    for (const passion of responses.passions) {
      const vector = await this.generateElementVector(
        'passion',
        passion.text,
        {
          intensity: passion.intensity,
          emotionalState: passion.emotionalState,
          culturalInfluence: passion.culturalInfluence,
          barriers: passion.barriers,
          supportNetwork: passion.supportNetwork
        },
        culturalContext
      );
      vectors.push(vector);
    }

    // Process skills
    for (const skill of responses.skills) {
      const vector = await this.generateElementVector(
        'skill',
        skill.text,
        {
          proficiency: skill.proficiencyLevel,
          acquisition: skill.acquisitionSource,
          applications: skill.applicationContext,
          satisfaction: skill.personalSatisfaction,
          culturalRecognition: skill.culturalRecognition
        },
        culturalContext
      );
      vectors.push(vector);
    }

    // Process values
    for (const value of responses.values) {
      const vector = await this.generateElementVector(
        'value',
        value.text,
        {
          importance: value.importance,
          livingAlignment: value.livingAlignment,
          culturalAlignment: value.culturalAlignment,
          expressions: value.expressions,
          challenges: value.challenges
        },
        culturalContext
      );
      vectors.push(vector);
    }

    // Process opportunities
    for (const opportunity of responses.opportunities) {
      const vector = await this.generateElementVector(
        'opportunity',
        opportunity.text,
        {
          feasibility: opportunity.feasibility,
          impact: opportunity.impact,
          timeframe: opportunity.timeframe,
          barriers: opportunity.barriers,
          culturalReceptivity: opportunity.culturalReceptivity
        },
        culturalContext
      );
      vectors.push(vector);
    }

    return vectors;
  }

  /**
   * Generate semantic vector for individual element using Gemini
   */
  private async generateElementVector(
    elementType: 'passion' | 'skill' | 'value' | 'opportunity',
    text: string,
    metadata: Record<string, any>,
    culturalContext: CulturalContext
  ): Promise<SemanticVector> {
    try {
      // Use Gemini to analyze the element and generate semantic understanding
      const geminiRequest = {
        type: 'step_completion_analysis' as const,
        stepContent: `Analyze this ${elementType}: "${text}"`,
        userInput: JSON.stringify(metadata),
        userProgress: {} as any,
        culturalContext
      };

      const geminiResponse = await generateGeminiInsight(geminiRequest);

      // Extract keywords and emotional markers
      const keywords = this.extractKeywords(text, geminiResponse.content);
      const emotionalTone = this.analyzeEmotionalTone(text, geminiResponse.emotionalState);
      const culturalMarkers = this.extractCulturalMarkers(text, culturalContext, geminiResponse.culturalConsiderations);

      // Generate pseudo-embedding vector (in production, would use actual embeddings)
      const vector = this.generatePseudoEmbedding(text, keywords, emotionalTone, culturalMarkers);

      return {
        elementId: this.generateElementId(elementType, text),
        elementType,
        vector,
        keywords,
        emotionalTone,
        culturalMarkers,
        intensityScore: this.calculateIntensityScore(metadata, emotionalTone)
      };

    } catch (error) {
      console.error('Error generating semantic vector:', error);
      
      // Fallback vector generation
      return {
        elementId: this.generateElementId(elementType, text),
        elementType,
        vector: this.generateBasicEmbedding(text),
        keywords: this.extractBasicKeywords(text),
        emotionalTone: [0.5, 0.5, 0.5], // Neutral emotional tone
        culturalMarkers: [],
        intensityScore: 0.5
      };
    }
  }

  private extractKeywords(text: string, aiAnalysis: string): string[] {
    // Extract meaningful keywords from text and AI analysis
    const combinedText = `${text} ${aiAnalysis}`;
    const words = combinedText.toLowerCase().split(/\s+/);
    
    // Filter out common words and keep meaningful terms
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'cannot', 'this', 'that', 'these', 'those']);
    
    const keywords = words
      .filter(word => word.length > 2 && !stopWords.has(word))
      .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
      .slice(0, 10); // Limit to top 10 keywords

    return keywords;
  }

  private analyzeEmotionalTone(text: string, emotionalState: EmotionalState): number[] {
    // Convert emotional state to numerical vector
    return [
      emotionalState.valence,     // Positive/negative dimension
      emotionalState.arousal,     // High/low energy dimension
      emotionalState.intensity / 10 // Intensity normalized to 0-1
    ];
  }

  private extractCulturalMarkers(
    text: string,
    culturalContext: CulturalContext,
    culturalConsiderations: string[]
  ): string[] {
    const markers: string[] = [];
    
    // Add cultural background markers
    markers.push(...culturalContext.culturalBackground);
    
    // Add value system markers
    markers.push(...culturalContext.valueSystem);
    
    // Add AI-identified cultural considerations
    markers.push(...culturalConsiderations);
    
    // Look for explicit cultural references in text
    const culturalKeywords = ['family', 'tradition', 'community', 'heritage', 'culture', 'faith', 'religion', 'ancestors', 'elders'];
    const textLower = text.toLowerCase();
    
    culturalKeywords.forEach(keyword => {
      if (textLower.includes(keyword)) {
        markers.push(keyword);
      }
    });

    return [...new Set(markers)]; // Remove duplicates
  }

  private generatePseudoEmbedding(
    text: string,
    keywords: string[],
    emotionalTone: number[],
    culturalMarkers: string[]
  ): number[] {
    // Generate a pseudo-embedding vector based on text characteristics
    // In production, would use actual sentence embeddings from Gemini/GPT
    
    const vector: number[] = [];
    
    // Text-based features (first 50 dimensions)
    for (let i = 0; i < 50; i++) {
      vector.push(Math.random() * 0.2 + 0.4); // Random baseline
    }
    
    // Keyword-based features (dimensions 50-100)
    for (let i = 0; i < 50; i++) {
      const keywordInfluence = keywords.length > i ? 0.3 : 0;
      vector.push(Math.random() * 0.2 + keywordInfluence);
    }
    
    // Emotional features (dimensions 100-103)
    vector.push(...emotionalTone);
    
    // Cultural features (dimensions 103-110)
    for (let i = 0; i < 7; i++) {
      const culturalInfluence = culturalMarkers.length > i ? 0.4 : 0;
      vector.push(Math.random() * 0.2 + culturalInfluence);
    }
    
    return vector;
  }

  private generateBasicEmbedding(text: string): number[] {
    // Simple fallback embedding based on text characteristics
    const vector: number[] = [];
    
    for (let i = 0; i < 110; i++) {
      // Use text characteristics to influence vector
      const charCode = text.charCodeAt(i % text.length) / 255;
      vector.push(charCode * 0.5 + Math.random() * 0.5);
    }
    
    return vector;
  }

  private extractBasicKeywords(text: string): string[] {
    return text.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 5);
  }

  private generateElementId(elementType: string, text: string): string {
    // Generate consistent ID for element
    const hash = text.split('').reduce((acc, char) => {
      acc = ((acc << 5) - acc) + char.charCodeAt(0);
      return acc & acc; // Convert to 32-bit integer
    }, 0);
    
    return `${elementType}_${Math.abs(hash)}`;
  }

  private calculateIntensityScore(metadata: Record<string, any>, emotionalTone: number[]): number {
    let intensity = 0.5; // Base intensity
    
    // Add intensity from metadata
    if (metadata.intensity) intensity += metadata.intensity / 20; // Normalize to 0-0.5
    if (metadata.importance) intensity += metadata.importance / 20;
    if (metadata.proficiency) intensity += metadata.proficiency / 20;
    
    // Add emotional intensity
    intensity += emotionalTone[2] * 0.3; // Emotional intensity contribution
    
    return Math.min(1.0, intensity);
  }

  /**
   * Perform semantic clustering using Gemini AI
   */
  private async performSemanticClustering(
    vectors: SemanticVector[],
    request: IKIGAIAnalysisRequest
  ): Promise<ClusteringResult> {
    try {
      // Use Gemini to perform intelligent clustering
      const clusteringPrompt = this.buildClusteringPrompt(vectors, request.culturalContext);
      
      const geminiRequest = {
        type: 'step_completion_analysis' as const,
        stepContent: clusteringPrompt,
        userInput: JSON.stringify(vectors.map(v => ({
          id: v.elementId,
          type: v.elementType,
          keywords: v.keywords,
          cultural: v.culturalMarkers,
          intensity: v.intensityScore
        }))),
        userProgress: {} as any,
        culturalContext: request.culturalContext
      };

      const geminiResponse = await generateGeminiInsight(geminiRequest);

      // Parse clustering results from Gemini response
      const clusters = this.parseClusteringResults(geminiResponse, vectors);

      // Calculate clustering quality
      const qualityScore = this.calculateClusteringQuality(clusters, vectors);

      return {
        clusters,
        outliers: this.identifyOutliers(clusters, vectors),
        qualityScore,
        recommendedMerges: this.identifyMergeOpportunities(clusters, vectors),
        recommendedSplits: this.identifySplitOpportunities(clusters, vectors)
      };

    } catch (error) {
      console.error('Error in semantic clustering:', error);
      
      // Fallback to basic clustering
      return this.performBasicClustering(vectors);
    }
  }

  private buildClusteringPrompt(vectors: SemanticVector[], culturalContext: CulturalContext): string {
    return `Analyze these IKIGAI elements and group them into meaningful clusters that represent coherent themes in this person's life purpose:

Elements to cluster:
${vectors.map(v => `- ${v.elementType}: ${v.keywords.join(', ')} (cultural: ${v.culturalMarkers.join(', ')})`).join('\n')}

Cultural Context: ${culturalContext.culturalBackground.join(', ')}
Value System: ${culturalContext.valueSystem.join(', ')}

Please identify 3-7 meaningful clusters that:
1. Group related elements across different quadrants (passions, skills, values, opportunities)
2. Respect cultural contexts and value systems
3. Create actionable themes for life purpose development
4. Balance specificity with broad applicability

For each cluster, provide:
- Cluster name
- Elements included
- Central theme
- Cultural significance
- Development potential
- Actionability level`;
  }

  private parseClusteringResults(geminiResponse: any, vectors: SemanticVector[]): IKIGAICluster[] {
    // Parse Gemini's clustering suggestions and create formal cluster objects
    const clusters: IKIGAICluster[] = [];
    
    // Extract clustering information from Gemini response
    const clusterSuggestions = this.extractClusterSuggestions(geminiResponse.content);
    
    clusterSuggestions.forEach((suggestion, index) => {
      const cluster: IKIGAICluster = {
        id: `cluster_${index + 1}`,
        name: suggestion.name || `Life Theme ${index + 1}`,
        type: 'intersection',
        elements: suggestion.elements || [],
        centroid: this.calculateClusterCentroid(suggestion.elements, vectors),
        coherenceScore: suggestion.coherence || 0.7,
        culturalResonance: suggestion.culturalResonance || 0.6,
        developmentPotential: suggestion.developmentPotential || 0.7,
        actionability: suggestion.actionability || 0.6,
        description: suggestion.description || `A meaningful life theme involving ${suggestion.elements?.length || 0} elements`,
        insights: suggestion.insights || [],
        recommendations: suggestion.recommendations || []
      };
      
      clusters.push(cluster);
    });
    
    return clusters;
  }

  private extractClusterSuggestions(responseText: string): any[] {
    // Parse the Gemini response text to extract cluster suggestions
    const suggestions: any[] = [];
    
    // Look for cluster patterns in the response
    const clusterRegex = /cluster|theme|group/gi;
    const lines = responseText.split('\n');
    
    let currentCluster: any = null;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (clusterRegex.test(trimmedLine)) {
        // Start of a new cluster
        if (currentCluster) {
          suggestions.push(currentCluster);
        }
        
        currentCluster = {
          name: this.extractClusterName(trimmedLine),
          elements: [],
          insights: [],
          recommendations: [],
          coherence: 0.7,
          culturalResonance: 0.6,
          developmentPotential: 0.7,
          actionability: 0.6
        };
      } else if (currentCluster && trimmedLine.length > 0) {
        // Add content to current cluster
        if (trimmedLine.includes('passion') || trimmedLine.includes('skill') || 
            trimmedLine.includes('value') || trimmedLine.includes('opportunity')) {
          // This looks like an element reference
          const elementId = this.extractElementReference(trimmedLine);
          if (elementId) {
            currentCluster.elements.push(elementId);
          }
        } else {
          // This looks like insight or description
          if (trimmedLine.length > 20) {
            currentCluster.insights.push(trimmedLine);
          }
        }
      }
    });
    
    // Add the last cluster
    if (currentCluster) {
      suggestions.push(currentCluster);
    }
    
    // If no clusters were found, create default clusters
    if (suggestions.length === 0) {
      suggestions.push(
        {
          name: "Core Strengths",
          elements: [],
          insights: ["Your natural abilities and passionate interests"],
          recommendations: ["Develop these strengths further"],
          coherence: 0.6,
          culturalResonance: 0.5,
          developmentPotential: 0.8,
          actionability: 0.7
        },
        {
          name: "Value-Driven Opportunities",
          elements: [],
          insights: ["Opportunities that align with your core values"],
          recommendations: ["Pursue opportunities that honor your values"],
          coherence: 0.6,
          culturalResonance: 0.7,
          developmentPotential: 0.7,
          actionability: 0.6
        }
      );
    }
    
    return suggestions;
  }

  private extractClusterName(line: string): string {
    // Extract cluster name from line
    const patterns = [
      /cluster\s*\d*[:\-]?\s*(.+)/i,
      /theme\s*\d*[:\-]?\s*(.+)/i,
      /group\s*\d*[:\-]?\s*(.+)/i
    ];
    
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return "Life Theme";
  }

  private extractElementReference(line: string): string | null {
    // Extract element ID references from text
    // This is a simplified approach - in production would be more sophisticated
    
    if (line.includes('passion')) return 'passion_element';
    if (line.includes('skill')) return 'skill_element';
    if (line.includes('value')) return 'value_element';
    if (line.includes('opportunity')) return 'opportunity_element';
    
    return null;
  }

  private calculateClusterCentroid(elementIds: string[], vectors: SemanticVector[]): any {
    // Calculate the centroid (average) of vectors in the cluster
    const clusterVectors = vectors.filter(v => elementIds.includes(v.elementId));
    
    if (clusterVectors.length === 0) {
      return {
        passionWeight: 0.25,
        skillWeight: 0.25,
        valueWeight: 0.25,
        opportunityWeight: 0.25,
        emotionalResonance: 0.5,
        culturalFit: 0.5,
        feasibility: 0.5,
        impact: 0.5
      };
    }
    
    // Calculate type distribution
    const typeCount = clusterVectors.reduce((acc, v) => {
      acc[v.elementType] = (acc[v.elementType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const total = clusterVectors.length;
    
    return {
      passionWeight: (typeCount.passion || 0) / total,
      skillWeight: (typeCount.skill || 0) / total,
      valueWeight: (typeCount.value || 0) / total,
      opportunityWeight: (typeCount.opportunity || 0) / total,
      emotionalResonance: clusterVectors.reduce((sum, v) => sum + v.emotionalTone[0], 0) / total,
      culturalFit: clusterVectors.reduce((sum, v) => sum + (v.culturalMarkers.length > 0 ? 0.8 : 0.4), 0) / total,
      feasibility: clusterVectors.reduce((sum, v) => sum + v.intensityScore, 0) / total,
      impact: clusterVectors.reduce((sum, v) => sum + v.intensityScore, 0) / total
    };
  }

  private calculateClusteringQuality(clusters: IKIGAICluster[], vectors: SemanticVector[]): number {
    // Calculate overall quality of clustering
    let totalQuality = 0;
    
    clusters.forEach(cluster => {
      totalQuality += cluster.coherenceScore;
    });
    
    return clusters.length > 0 ? totalQuality / clusters.length : 0.5;
  }

  private identifyOutliers(clusters: IKIGAICluster[], vectors: SemanticVector[]): string[] {
    // Identify elements that don't fit well in any cluster
    const clusteredElements = new Set();
    
    clusters.forEach(cluster => {
      cluster.elements.forEach(elementId => {
        clusteredElements.add(elementId);
      });
    });
    
    return vectors
      .filter(v => !clusteredElements.has(v.elementId))
      .map(v => v.elementId);
  }

  private identifyMergeOpportunities(clusters: IKIGAICluster[], vectors: SemanticVector[]): ClusterMergeRecommendation[] {
    // Identify clusters that might be merged
    const recommendations: ClusterMergeRecommendation[] = [];
    
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const similarity = this.calculateClusterSimilarity(clusters[i], clusters[j], vectors);
        
        if (similarity > 0.7) {
          recommendations.push({
            cluster1Id: clusters[i].id,
            cluster2Id: clusters[j].id,
            similarity,
            rationale: `These clusters share similar themes and could be combined for stronger coherence`
          });
        }
      }
    }
    
    return recommendations;
  }

  private identifySplitOpportunities(clusters: IKIGAICluster[], vectors: SemanticVector[]): ClusterSplitRecommendation[] {
    // Identify clusters that might be split
    const recommendations: ClusterSplitRecommendation[] = [];
    
    clusters.forEach(cluster => {
      if (cluster.elements.length > 6 && cluster.coherenceScore < 0.6) {
        recommendations.push({
          clusterId: cluster.id,
          splitPoint: Math.floor(cluster.elements.length / 2),
          rationale: `This cluster is large and has low coherence - consider splitting into more focused themes`,
          suggestedNames: [`${cluster.name} - Part A`, `${cluster.name} - Part B`]
        });
      }
    });
    
    return recommendations;
  }

  private calculateClusterSimilarity(cluster1: IKIGAICluster, cluster2: IKIGAICluster, vectors: SemanticVector[]): number {
    // Calculate similarity between two clusters
    const centroid1 = cluster1.centroid;
    const centroid2 = cluster2.centroid;
    
    // Simple similarity based on centroid distances
    const weightDiff = Math.abs(centroid1.passionWeight - centroid2.passionWeight) +
                      Math.abs(centroid1.skillWeight - centroid2.skillWeight) +
                      Math.abs(centroid1.valueWeight - centroid2.valueWeight) +
                      Math.abs(centroid1.opportunityWeight - centroid2.opportunityWeight);
    
    return 1 - (weightDiff / 4); // Normalize to 0-1 similarity
  }

  private performBasicClustering(vectors: SemanticVector[]): ClusteringResult {
    // Fallback clustering method
    const clusters: IKIGAICluster[] = [];
    
    // Group by element type as basic clustering
    const typeGroups = vectors.reduce((acc, vector) => {
      if (!acc[vector.elementType]) {
        acc[vector.elementType] = [];
      }
      acc[vector.elementType].push(vector.elementId);
      return acc;
    }, {} as Record<string, string[]>);
    
    Object.entries(typeGroups).forEach(([type, elementIds], index) => {
      clusters.push({
        id: `basic_cluster_${index}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Focus`,
        type: 'intersection',
        elements: elementIds,
        centroid: this.calculateClusterCentroid(elementIds, vectors),
        coherenceScore: 0.6,
        culturalResonance: 0.5,
        developmentPotential: 0.6,
        actionability: 0.5,
        description: `Elements focused on ${type}`,
        insights: [`Your ${type} elements group together naturally`],
        recommendations: [`Develop your ${type} area further`]
      });
    });
    
    return {
      clusters,
      outliers: [],
      qualityScore: 0.6,
      recommendedMerges: [],
      recommendedSplits: []
    };
  }

  /**
   * Calculate intersection mappings between different quadrants
   */
  private async calculateIntersections(
    responses: IKIGAIResponses,
    vectors: SemanticVector[],
    culturalContext: CulturalContext
  ): Promise<IntersectionMapping> {
    // Implementation for calculating intersections between quadrants
    // This would use vector similarity calculations and AI analysis
    
    return {
      passionSkill: await this.calculatePairwiseIntersections('passion', 'skill', responses, vectors, culturalContext),
      passionValue: await this.calculatePairwiseIntersections('passion', 'value', responses, vectors, culturalContext),
      passionOpportunity: await this.calculatePairwiseIntersections('passion', 'opportunity', responses, vectors, culturalContext),
      skillValue: await this.calculatePairwiseIntersections('skill', 'value', responses, vectors, culturalContext),
      skillOpportunity: await this.calculatePairwiseIntersections('skill', 'opportunity', responses, vectors, culturalContext),
      valueOpportunity: await this.calculatePairwiseIntersections('value', 'opportunity', responses, vectors, culturalContext),
      centralIntersection: await this.calculateCentralIntersections(responses, vectors, culturalContext)
    };
  }

  private async calculatePairwiseIntersections(
    type1: string,
    type2: string,
    responses: IKIGAIResponses,
    vectors: SemanticVector[],
    culturalContext: CulturalContext
  ): Promise<any[]> {
    // Calculate intersections between two quadrant types
    const type1Vectors = vectors.filter(v => v.elementType === type1);
    const type2Vectors = vectors.filter(v => v.elementType === type2);
    
    const intersections: any[] = [];
    
    for (const v1 of type1Vectors) {
      for (const v2 of type2Vectors) {
        const similarity = this.calculateVectorSimilarity(v1.vector, v2.vector);
        
        if (similarity > 0.6) {
          intersections.push({
            element1Id: v1.elementId,
            element2Id: v2.elementId,
            connectionStrength: similarity,
            connectionType: this.determineConnectionType(similarity),
            insights: await this.generateIntersectionInsights(v1, v2, culturalContext),
            actionSuggestions: await this.generateActionSuggestions(v1, v2),
            culturalConsiderations: this.combineCulturalMarkers(v1.culturalMarkers, v2.culturalMarkers),
            developmentOpportunities: await this.generateDevelopmentOpportunities(v1, v2)
          });
        }
      }
    }
    
    return intersections;
  }

  private calculateVectorSimilarity(vector1: number[], vector2: number[]): number {
    // Calculate cosine similarity between two vectors
    if (vector1.length !== vector2.length) return 0;
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      norm1 += vector1[i] * vector1[i];
      norm2 += vector2[i] * vector2[i];
    }
    
    if (norm1 === 0 || norm2 === 0) return 0;
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  private determineConnectionType(similarity: number): 'natural' | 'developed' | 'potential' | 'conflicting' {
    if (similarity > 0.8) return 'natural';
    if (similarity > 0.7) return 'developed';
    if (similarity > 0.6) return 'potential';
    return 'conflicting';
  }

  private async generateIntersectionInsights(
    vector1: SemanticVector,
    vector2: SemanticVector,
    culturalContext: CulturalContext
  ): Promise<string[]> {
    // Generate insights about the intersection of two elements
    const sharedKeywords = vector1.keywords.filter(k => vector2.keywords.includes(k));
    const sharedCultural = vector1.culturalMarkers.filter(m => vector2.culturalMarkers.includes(m));
    
    const insights = [];
    
    if (sharedKeywords.length > 0) {
      insights.push(`Both elements involve: ${sharedKeywords.join(', ')}`);
    }
    
    if (sharedCultural.length > 0) {
      insights.push(`Culturally connected through: ${sharedCultural.join(', ')}`);
    }
    
    // Add type-specific insights
    insights.push(`This ${vector1.elementType}-${vector2.elementType} connection shows strong potential for integration`);
    
    return insights;
  }

  private async generateActionSuggestions(vector1: SemanticVector, vector2: SemanticVector): Promise<string[]> {
    // Generate actionable suggestions for developing this intersection
    const suggestions = [];
    
    suggestions.push(`Explore projects that combine ${vector1.elementType} and ${vector2.elementType}`);
    suggestions.push(`Look for opportunities to use your ${vector1.elementType} in ${vector2.elementType} contexts`);
    suggestions.push(`Develop skills that bridge these two areas`);
    
    return suggestions;
  }

  private combineCulturalMarkers(markers1: string[], markers2: string[]): string[] {
    return [...new Set([...markers1, ...markers2])];
  }

  private async generateDevelopmentOpportunities(vector1: SemanticVector, vector2: SemanticVector): Promise<string[]> {
    // Generate development opportunities for this intersection
    return [
      `Combine ${vector1.elementType} strengths with ${vector2.elementType} applications`,
      `Seek mentorship in areas that bridge both elements`,
      `Create projects that leverage both areas`
    ];
  }

  private async calculateCentralIntersections(
    responses: IKIGAIResponses,
    vectors: SemanticVector[],
    culturalContext: CulturalContext
  ): Promise<CentralIntersection[]> {
    // Calculate 4-way intersections (passion + skill + value + opportunity)
    const centralIntersections: CentralIntersection[] = [];
    
    // For each passion, find best matching skill, value, and opportunity
    for (const passion of responses.passions) {
      const passionVector = vectors.find(v => v.elementId.includes(passion.id) || v.keywords.some(k => passion.text.toLowerCase().includes(k)));
      
      if (passionVector) {
        const bestSkill = this.findBestMatch(passionVector, vectors.filter(v => v.elementType === 'skill'));
        const bestValue = this.findBestMatch(passionVector, vectors.filter(v => v.elementType === 'value'));
        const bestOpportunity = this.findBestMatch(passionVector, vectors.filter(v => v.elementType === 'opportunity'));
        
        if (bestSkill && bestValue && bestOpportunity) {
          const synergy = this.calculateSynergy([passionVector, bestSkill, bestValue, bestOpportunity]);
          
          if (synergy > 0.5) {
            centralIntersections.push({
              id: `central_${passion.id}`,
              passionId: passion.id,
              skillId: bestSkill.elementId,
              valueId: bestValue.elementId,
              opportunityId: bestOpportunity.elementId,
              synergy,
              description: await this.generateSynergyDescription([passionVector, bestSkill, bestValue, bestOpportunity]),
              actionPlan: await this.generateActionPlan([passionVector, bestSkill, bestValue, bestOpportunity], culturalContext),
              risks: await this.identifyRisks([passionVector, bestSkill, bestValue, bestOpportunity]),
              supports: await this.identifySupports([passionVector, bestSkill, bestValue, bestOpportunity]),
              timeHorizon: this.estimateTimeHorizon(synergy),
              culturalFit: this.calculateCulturalFit([passionVector, bestSkill, bestValue, bestOpportunity], culturalContext),
              personalReadiness: this.assessPersonalReadiness([passionVector, bestSkill, bestValue, bestOpportunity])
            });
          }
        }
      }
    }
    
    return centralIntersections;
  }

  private findBestMatch(targetVector: SemanticVector, candidateVectors: SemanticVector[]): SemanticVector | null {
    let bestMatch: SemanticVector | null = null;
    let bestSimilarity = 0;
    
    for (const candidate of candidateVectors) {
      const similarity = this.calculateVectorSimilarity(targetVector.vector, candidate.vector);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = candidate;
      }
    }
    
    return bestSimilarity > 0.4 ? bestMatch : null;
  }

  private calculateSynergy(vectors: SemanticVector[]): number {
    // Calculate synergy score for a set of vectors
    let totalSynergy = 0;
    let comparisons = 0;
    
    for (let i = 0; i < vectors.length; i++) {
      for (let j = i + 1; j < vectors.length; j++) {
        totalSynergy += this.calculateVectorSimilarity(vectors[i].vector, vectors[j].vector);
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalSynergy / comparisons : 0;
  }

  private async generateSynergyDescription(vectors: SemanticVector[]): Promise<string> {
    const types = vectors.map(v => v.elementType);
    const keywords = vectors.flatMap(v => v.keywords).slice(0, 5);
    
    return `A powerful integration of ${types.join(', ')} around themes of ${keywords.join(', ')}`;
  }

  private async generateActionPlan(vectors: SemanticVector[], culturalContext: CulturalContext): Promise<any> {
    // Generate action plan for this central intersection
    return {
      immediateSteps: [
        {
          id: 'explore_intersection',
          description: 'Explore how these elements work together',
          timeframe: '1-2 weeks',
          difficulty: 3,
          importance: 8,
          dependencies: [],
          resources: ['time for reflection'],
          culturalConsiderations: culturalContext.culturalBackground,
          traumaInformedNotes: ['proceed at your own pace'],
          successCriteria: ['increased clarity about connections']
        }
      ],
      shortTermGoals: [],
      longTermVision: 'Integrated life purpose expression',
      milestones: [],
      resources: [],
      support: [],
      metrics: []
    };
  }

  private async identifyRisks(vectors: SemanticVector[]): Promise<string[]> {
    return [
      'Overcommitment across multiple areas',
      'Difficulty prioritizing between competing interests',
      'Cultural or family resistance to integrated approach'
    ];
  }

  private async identifySupports(vectors: SemanticVector[]): Promise<string[]> {
    return [
      'Natural alignment between elements',
      'Existing skills and interests',
      'Passionate engagement with topic'
    ];
  }

  private estimateTimeHorizon(synergy: number): string {
    if (synergy > 0.8) return '6-12 months';
    if (synergy > 0.6) return '1-2 years';
    return '2-5 years';
  }

  private calculateCulturalFit(vectors: SemanticVector[], culturalContext: CulturalContext): number {
    const culturalMarkers = vectors.flatMap(v => v.culturalMarkers);
    const contextMarkers = [...culturalContext.culturalBackground, ...culturalContext.valueSystem];
    
    const overlap = culturalMarkers.filter(marker => contextMarkers.includes(marker));
    
    return overlap.length / Math.max(culturalMarkers.length, 1);
  }

  private assessPersonalReadiness(vectors: SemanticVector[]): number {
    // Assess readiness based on intensity scores and emotional tone
    const avgIntensity = vectors.reduce((sum, v) => sum + v.intensityScore, 0) / vectors.length;
    const avgEmotionalPositivity = vectors.reduce((sum, v) => sum + v.emotionalTone[0], 0) / vectors.length;
    
    return (avgIntensity + avgEmotionalPositivity) / 2;
  }

  // Continue with remaining methods...

  private async calculateConnectionStrengths(
    vectors: SemanticVector[],
    intersections: IntersectionMapping
  ): Promise<ConnectionStrength[]> {
    // Calculate connection strengths between all elements
    const connections: ConnectionStrength[] = [];
    
    // Add connections from intersection mappings
    const allIntersections = [
      ...intersections.passionSkill,
      ...intersections.passionValue,
      ...intersections.passionOpportunity,
      ...intersections.skillValue,
      ...intersections.skillOpportunity,
      ...intersections.valueOpportunity
    ];
    
    allIntersections.forEach(intersection => {
      connections.push({
        fromId: intersection.element1Id,
        toId: intersection.element2Id,
        strength: intersection.connectionStrength,
        type: intersection.connectionType,
        confidence: intersection.connectionStrength,
        evidence: intersection.insights,
        developmentOpportunity: intersection.connectionType === 'potential',
        culturalRelevance: intersection.culturalConsiderations.length > 0 ? 0.8 : 0.5
      });
    });
    
    return connections;
  }

  private async generateAIInsights(
    request: IKIGAIAnalysisRequest,
    clusteringResult: ClusteringResult,
    intersections: IntersectionMapping
  ): Promise<AIInsight[]> {
    // Generate AI insights using Gemini
    try {
      const insightPrompt = this.buildInsightPrompt(request, clusteringResult, intersections);
      
      const geminiRequest = {
        type: 'step_completion_analysis' as const,
        stepContent: insightPrompt,
        userInput: JSON.stringify({
          clusters: clusteringResult.clusters.map(c => ({
            name: c.name,
            elements: c.elements.length,
            coherence: c.coherenceScore
          })),
          intersections: Object.keys(intersections).map(key => ({
            type: key,
            count: (intersections as any)[key].length
          }))
        }),
        userProgress: {} as any,
        culturalContext: request.culturalContext
      };

      const geminiResponse = await generateGeminiInsight(geminiRequest);

      return this.parseAIInsights(geminiResponse);

    } catch (error) {
      console.error('Error generating AI insights:', error);
      return this.generateFallbackInsights();
    }
  }

  private buildInsightPrompt(
    request: IKIGAIAnalysisRequest,
    clusteringResult: ClusteringResult,
    intersections: IntersectionMapping
  ): string {
    return `Analyze this person's IKIGAI profile and provide deep insights about their life purpose potential:

Identified Clusters:
${clusteringResult.clusters.map(c => `- ${c.name}: ${c.description}`).join('\n')}

Cultural Context: ${request.culturalContext.culturalBackground.join(', ')}
Values: ${request.culturalContext.valueSystem.join(', ')}

Provide insights about:
1. Patterns across their passions, skills, values, and opportunities
2. Hidden connections they might not see
3. Potential gaps or blind spots
4. Cultural strengths they can leverage
5. Development opportunities
6. Challenges they might face
7. Unique combinations that set them apart

Focus on actionable insights that respect their cultural context and support trauma-informed growth.`;
  }

  private parseAIInsights(geminiResponse: any): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // Parse insights from Gemini response
    const responseLines = geminiResponse.content.split('\n').filter((line: string) => line.trim().length > 0);
    
    responseLines.forEach((line: string, index: number) => {
      if (line.length > 30) { // Filter for substantial insights
        insights.push({
          id: `insight_${index + 1}`,
          type: this.categorizeInsight(line),
          title: this.extractInsightTitle(line),
          description: line.trim(),
          confidence: geminiResponse.confidence || 0.7,
          impact: this.assessInsightImpact(line),
          actionability: this.assessInsightActionability(line),
          evidence: [line],
          recommendations: this.extractInsightRecommendations(line),
          culturalConsiderations: geminiResponse.culturalConsiderations || [],
          traumaInformedNotes: [],
          timeHorizon: this.estimateInsightTimeHorizon(line)
        });
      }
    });
    
    return insights.slice(0, 8); // Limit to top 8 insights
  }

  private categorizeInsight(text: string): any {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('pattern') || lowerText.includes('theme')) return 'pattern';
    if (lowerText.includes('gap') || lowerText.includes('missing')) return 'gap';
    if (lowerText.includes('opportunity') || lowerText.includes('potential')) return 'opportunity';
    if (lowerText.includes('strength') || lowerText.includes('strong')) return 'strength';
    if (lowerText.includes('challenge') || lowerText.includes('difficult')) return 'challenge';
    if (lowerText.includes('cultural') || lowerText.includes('tradition')) return 'cultural';
    if (lowerText.includes('develop') || lowerText.includes('grow')) return 'development';
    
    return 'pattern';
  }

  private extractInsightTitle(text: string): string {
    // Extract first meaningful phrase as title
    const sentences = text.split(/[.!?]/);
    const firstSentence = sentences[0].trim();
    
    if (firstSentence.length > 60) {
      return firstSentence.substring(0, 57) + '...';
    }
    
    return firstSentence;
  }

  private assessInsightImpact(text: string): number {
    const impactWords = ['significant', 'major', 'important', 'crucial', 'key', 'powerful', 'strong'];
    const lowerText = text.toLowerCase();
    
    const impactCount = impactWords.filter(word => lowerText.includes(word)).length;
    return Math.min(1.0, 0.4 + (impactCount * 0.15));
  }

  private assessInsightActionability(text: string): number {
    const actionWords = ['can', 'could', 'should', 'try', 'practice', 'develop', 'explore', 'consider'];
    const lowerText = text.toLowerCase();
    
    const actionCount = actionWords.filter(word => lowerText.includes(word)).length;
    return Math.min(1.0, 0.3 + (actionCount * 0.175));
  }

  private extractInsightRecommendations(text: string): string[] {
    // Extract actionable recommendations from insight text
    const recommendations = [];
    
    if (text.toLowerCase().includes('develop')) {
      recommendations.push('Focus on developing this area further');
    }
    if (text.toLowerCase().includes('explore')) {
      recommendations.push('Explore this connection more deeply');
    }
    if (text.toLowerCase().includes('connect')) {
      recommendations.push('Look for ways to connect these elements');
    }
    
    return recommendations;
  }

  private estimateInsightTimeHorizon(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('immediate') || lowerText.includes('now')) return 'immediate';
    if (lowerText.includes('short') || lowerText.includes('soon')) return 'short-term';
    if (lowerText.includes('long') || lowerText.includes('future')) return 'long-term';
    if (lowerText.includes('develop') || lowerText.includes('build')) return 'medium-term';
    
    return 'medium-term';
  }

  private generateFallbackInsights(): AIInsight[] {
    return [
      {
        id: 'fallback_1',
        type: 'pattern',
        title: 'Unique Combination of Elements',
        description: 'Your combination of passions, skills, values, and opportunities creates a unique profile for purposeful living.',
        confidence: 0.6,
        impact: 0.7,
        actionability: 0.6,
        evidence: ['Analysis of your IKIGAI elements'],
        recommendations: ['Explore how your elements can work together'],
        culturalConsiderations: [],
        traumaInformedNotes: [],
        timeHorizon: 'ongoing'
      }
    ];
  }

  private async generateCoachingNarrative(
    request: IKIGAIAnalysisRequest,
    clusteringResult: ClusteringResult,
    insights: AIInsight[]
  ): Promise<{ synthesisText: string; recommendedActions: RecommendedAction[] }> {
    try {
      // Use GPT-4o for coaching narrative
      const coachingPrompt = this.buildCoachingPrompt(request, clusteringResult, insights);
      
      const gptRequest = {
        stepContent: coachingPrompt,
        userContext: {
          clusters: clusteringResult.clusters,
          insights: insights.map(i => i.description),
          culturalContext: request.culturalContext
        },
        promptType: 'mentor' as const,
        culturalContext: request.culturalContext
      };

      const gptResponse = await generateGPTMentorship(gptRequest);

      return {
        synthesisText: gptResponse.content,
        recommendedActions: this.parseRecommendedActions(gptResponse)
      };

    } catch (error) {
      console.error('Error generating coaching narrative:', error);
      return this.generateFallbackCoaching(request, clusteringResult);
    }
  }

  private buildCoachingPrompt(
    request: IKIGAIAnalysisRequest,
    clusteringResult: ClusteringResult,
    insights: AIInsight[]
  ): string {
    return `You are a wise, culturally-sensitive life purpose coach. Based on this person's IKIGAI analysis, provide personalized guidance and coaching.

Their Life Purpose Clusters:
${clusteringResult.clusters.map(c => `- ${c.name}: ${c.description}`).join('\n')}

Key Insights Discovered:
${insights.map(i => `- ${i.title}: ${i.description}`).join('\n')}

Cultural Context: ${request.culturalContext.culturalBackground.join(', ')}
Communication Style: ${request.culturalContext.communicationStyle}
Values: ${request.culturalContext.valueSystem.join(', ')}

Provide:
1. A warm, encouraging synthesis of their unique purpose profile
2. Specific, actionable recommendations for living their purpose
3. Cultural wisdom that honors their background
4. Trauma-informed guidance that emphasizes choice and empowerment

Be specific, personal, and inspiring. Help them see the beautiful uniqueness of their combination and how they can express it in the world.`;
  }

  private parseRecommendedActions(gptResponse: any): RecommendedAction[] {
    const actions: RecommendedAction[] = [];
    
    // Parse recommendations from GPT response
    gptResponse.recommendations?.forEach((rec: any, index: number) => {
      actions.push({
        id: `action_${index + 1}`,
        title: rec.title || 'Purpose Development Action',
        description: rec.description || 'Take steps to develop your purpose',
        priority: this.mapPriorityFromGPT(rec.priority),
        timeframe: this.mapTimeframeFromGPT(rec.timeframe),
        category: this.categorizeAction(rec.description || rec.title),
        difficulty: Math.min(10, rec.estimatedImpact || 5),
        impact: Math.min(10, rec.estimatedImpact || 7),
        culturalFit: 0.8,
        traumaInformed: true,
        prerequisites: [],
        steps: [],
        resources: [],
        support: [],
        successMetrics: [],
        risks: [],
        mitigations: []
      });
    });
    
    // If no recommendations parsed, create default ones
    if (actions.length === 0) {
      actions.push({
        id: 'default_action_1',
        title: 'Explore Your Purpose Intersections',
        description: 'Spend time exploring how your passions, skills, values, and opportunities can work together.',
        priority: 'high',
        timeframe: 'short_term',
        category: 'exploration',
        difficulty: 3,
        impact: 8,
        culturalFit: 0.8,
        traumaInformed: true,
        prerequisites: [],
        steps: [],
        resources: [],
        support: [],
        successMetrics: [],
        risks: [],
        mitigations: []
      });
    }
    
    return actions;
  }

  private mapPriorityFromGPT(priority: string): 'urgent' | 'high' | 'medium' | 'low' {
    if (!priority) return 'medium';
    
    const p = priority.toLowerCase();
    if (p.includes('urgent') || p.includes('critical')) return 'urgent';
    if (p.includes('high') || p.includes('important')) return 'high';
    if (p.includes('low') || p.includes('optional')) return 'low';
    return 'medium';
  }

  private mapTimeframeFromGPT(timeframe: string): 'immediate' | 'short_term' | 'medium_term' | 'long_term' {
    if (!timeframe) return 'medium_term';
    
    const t = timeframe.toLowerCase();
    if (t.includes('immediate') || t.includes('now')) return 'immediate';
    if (t.includes('short') || t.includes('week')) return 'short_term';
    if (t.includes('long') || t.includes('year')) return 'long_term';
    return 'medium_term';
  }

  private categorizeAction(description: string): 'exploration' | 'skill_development' | 'value_alignment' | 'opportunity_pursuit' {
    const d = description.toLowerCase();
    
    if (d.includes('explore') || d.includes('discover')) return 'exploration';
    if (d.includes('skill') || d.includes('learn') || d.includes('develop')) return 'skill_development';
    if (d.includes('value') || d.includes('align') || d.includes('honor')) return 'value_alignment';
    if (d.includes('opportunity') || d.includes('pursue') || d.includes('apply')) return 'opportunity_pursuit';
    
    return 'exploration';
  }

  private generateFallbackCoaching(
    request: IKIGAIAnalysisRequest,
    clusteringResult: ClusteringResult
  ): { synthesisText: string; recommendedActions: RecommendedAction[] } {
    return {
      synthesisText: "Your IKIGAI profile reveals a unique combination of elements that can guide you toward purposeful living. Each cluster represents an opportunity to express your authentic self in meaningful ways.",
      recommendedActions: [{
        id: 'fallback_action',
        title: 'Begin Purpose Exploration',
        description: 'Start exploring how your passions, skills, values, and opportunities can work together.',
        priority: 'high',
        timeframe: 'short_term',
        category: 'exploration',
        difficulty: 4,
        impact: 7,
        culturalFit: 0.7,
        traumaInformed: true,
        prerequisites: [],
        steps: [],
        resources: [],
        support: [],
        successMetrics: [],
        risks: [],
        mitigations: []
      }]
    };
  }

  // Continue with additional analysis methods...

  private calculateAlignmentScore(
    clusteringResult: ClusteringResult,
    intersections: IntersectionMapping,
    responses: IKIGAIResponses
  ): number {
    // Calculate overall alignment score (0-100)
    let score = 0;
    
    // Cluster coherence contribution (40%)
    const avgCoherence = clusteringResult.clusters.reduce((sum, c) => sum + c.coherenceScore, 0) / clusteringResult.clusters.length;
    score += avgCoherence * 40;
    
    // Intersection strength contribution (30%)
    const allIntersections = [
      ...intersections.passionSkill,
      ...intersections.passionValue,
      ...intersections.passionOpportunity,
      ...intersections.skillValue,
      ...intersections.skillOpportunity,
      ...intersections.valueOpportunity
    ];
    
    const avgIntersectionStrength = allIntersections.length > 0 
      ? allIntersections.reduce((sum, i) => sum + i.connectionStrength, 0) / allIntersections.length
      : 0.5;
    score += avgIntersectionStrength * 30;
    
    // Central intersection contribution (20%)
    const centralIntersectionScore = intersections.centralIntersection.length > 0
      ? intersections.centralIntersection.reduce((sum, ci) => sum + ci.synergy, 0) / intersections.centralIntersection.length
      : 0.3;
    score += centralIntersectionScore * 20;
    
    // Confidence contribution (10%)
    const avgConfidence = (responses.confidenceScores.overallConfidence + responses.confidenceScores.readinessForAction) / 2;
    score += avgConfidence * 10;
    
    return Math.round(score);
  }

  private async generateVisualElements(
    clusters: IKIGAICluster[],
    connectionStrengths: ConnectionStrength[],
    culturalContext: CulturalContext
  ): Promise<any[]> {
    // Generate visual elements for React Flow visualization
    const elements: any[] = [];
    
    // Add cluster nodes
    clusters.forEach((cluster, index) => {
      elements.push({
        id: cluster.id,
        type: 'cluster',
        position: this.calculateClusterPosition(index, clusters.length),
        size: this.calculateClusterSize(cluster),
        style: this.generateClusterStyle(cluster, culturalContext),
        data: {
          cluster,
          label: cluster.name,
          description: cluster.description,
          coherence: cluster.coherenceScore
        },
        metadata: {
          elementId: cluster.id,
          elementType: 'cluster',
          importance: cluster.developmentPotential,
          connectionCount: cluster.elements.length,
          culturalSignificance: cluster.culturalResonance,
          animationTriggers: ['hover', 'click']
        }
      });
    });
    
    // Add connection edges
    connectionStrengths.forEach(connection => {
      if (connection.strength > 0.6) {
        elements.push({
          id: `edge_${connection.fromId}_${connection.toId}`,
          type: 'edge',
          position: { x: 0, y: 0 }, // Edges don't have fixed positions
          size: { width: 0, height: 0 },
          style: this.generateConnectionStyle(connection, culturalContext),
          data: {
            connection,
            source: connection.fromId,
            target: connection.toId,
            strength: connection.strength,
            type: connection.type
          },
          metadata: {
            elementId: `edge_${connection.fromId}_${connection.toId}`,
            elementType: 'connection',
            importance: connection.strength,
            connectionCount: 2,
            culturalSignificance: connection.culturalRelevance,
            animationTriggers: ['hover']
          }
        });
      }
    });
    
    return elements;
  }

  private calculateClusterPosition(index: number, totalClusters: number): { x: number; y: number } {
    // Arrange clusters in a circular pattern
    const angle = (2 * Math.PI * index) / totalClusters;
    const radius = 200;
    const centerX = 400;
    const centerY = 300;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  }

  private calculateClusterSize(cluster: IKIGAICluster): { width: number; height: number } {
    const baseSize = 120;
    const sizeMultiplier = 1 + (cluster.developmentPotential * 0.5);
    
    return {
      width: baseSize * sizeMultiplier,
      height: baseSize * sizeMultiplier
    };
  }

  private generateClusterStyle(cluster: IKIGAICluster, culturalContext: CulturalContext): any {
    // Generate culturally-adapted visual style
    const baseColor = this.getClusterColor(cluster);
    const culturalColor = this.adaptColorForCulture(baseColor, culturalContext);
    
    return {
      color: '#ffffff',
      backgroundColor: culturalColor,
      borderColor: this.darkenColor(culturalColor, 0.2),
      borderWidth: 2,
      fontSize: 14,
      fontWeight: 'bold',
      opacity: 0.85,
      culturalTheme: culturalContext.culturalBackground[0] || 'universal'
    };
  }

  private getClusterColor(cluster: IKIGAICluster): string {
    // Assign colors based on cluster characteristics
    const colorMap = {
      'passion': '#e74c3c',    // Red
      'skill': '#3498db',      // Blue
      'value': '#2ecc71',      // Green
      'opportunity': '#f39c12', // Orange
      'intersection': '#9b59b6' // Purple
    };
    
    return colorMap[cluster.type] || '#95a5a6';
  }

  private adaptColorForCulture(baseColor: string, culturalContext: CulturalContext): string {
    // Adapt colors based on cultural preferences
    // This is a simplified approach - in production would use comprehensive cultural color research
    
    const culturalColorMap: Record<string, Record<string, string>> = {
      'east_asian': {
        '#e74c3c': '#d73527', // Slightly deeper red
        '#3498db': '#2980b9', // Slightly deeper blue
        '#2ecc71': '#27ae60', // Slightly deeper green
      },
      'latin_american': {
        '#e74c3c': '#ff6b35', // Warmer red-orange
        '#3498db': '#4ecdc4', // Turquoise
        '#2ecc71': '#45b7d1', // Bright blue-green
      },
      'african': {
        '#e74c3c': '#d35400', // Earth orange
        '#3498db': '#2c3e50', // Deep blue-gray
        '#2ecc71': '#f39c12', // Warm orange
      }
    };
    
    const primaryCulture = culturalContext.culturalBackground[0];
    const adaptations = culturalColorMap[primaryCulture];
    
    return adaptations?.[baseColor] || baseColor;
  }

  private darkenColor(color: string, amount: number): string {
    // Simple color darkening function
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    
    const r = Math.max(0, (num >> 16) * (1 - amount));
    const g = Math.max(0, ((num >> 8) & 0x00FF) * (1 - amount));
    const b = Math.max(0, (num & 0x0000FF) * (1 - amount));
    
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  }

  private generateConnectionStyle(connection: ConnectionStrength, culturalContext: CulturalContext): any {
    const strengthColor = this.getConnectionColor(connection.strength);
    
    return {
      color: strengthColor,
      backgroundColor: 'transparent',
      borderColor: strengthColor,
      borderWidth: Math.max(1, connection.strength * 4),
      fontSize: 0,
      fontWeight: 'normal',
      opacity: 0.6 + (connection.strength * 0.4),
      culturalTheme: culturalContext.culturalBackground[0] || 'universal'
    };
  }

  private getConnectionColor(strength: number): string {
    // Color connections based on strength
    if (strength > 0.8) return '#27ae60'; // Strong - green
    if (strength > 0.6) return '#f39c12'; // Medium - orange  
    return '#95a5a6'; // Weak - gray
  }

  // Additional analysis methods...

  private async applyCulturalAdaptations(
    request: IKIGAIAnalysisRequest,
    coachingResults: any
  ): Promise<CulturalAdaptation[]> {
    // Apply cultural adaptations to the analysis
    const adaptations: CulturalAdaptation[] = [];
    
    // Language adaptations
    if (request.culturalContext.primaryLanguage !== 'en') {
      adaptations.push({
        area: 'language',
        originalElement: 'Analysis in English',
        adaptedElement: `Analysis adapted for ${request.culturalContext.primaryLanguage} speakers`,
        rationale: 'Improve accessibility and cultural resonance',
        culturalResonance: 0.8,
        effectiveness: 0.7
      });
    }
    
    // Communication style adaptations
    if (request.culturalContext.communicationStyle === 'indirect') {
      adaptations.push({
        area: 'communication_style',
        originalElement: 'Direct coaching language',
        adaptedElement: 'Gentle, contextual coaching approach',
        rationale: 'Honor indirect communication preferences',
        culturalResonance: 0.9,
        effectiveness: 0.8
      });
    }
    
    // Value system adaptations
    if (request.culturalContext.valueSystem.includes('collectivist')) {
      adaptations.push({
        area: 'value_emphasis',
        originalElement: 'Individual purpose focus',
        adaptedElement: 'Community-connected purpose focus',
        rationale: 'Align with collectivist values',
        culturalResonance: 0.85,
        effectiveness: 0.8
      });
    }
    
    return adaptations;
  }

  private async generateTraumaInformedNotes(
    request: IKIGAIAnalysisRequest,
    insights: AIInsight[]
  ): Promise<TraumaInformedNote[]> {
    const notes: TraumaInformedNote[] = [];
    
    // Add general trauma-informed reminders
    notes.push({
      type: 'choice_emphasis',
      content: 'Remember, you have complete choice in how and when to explore these insights. Go at your own pace.',
      severity: 'info',
      actionRequired: false,
      culturalConsiderations: request.culturalContext.culturalBackground,
      supportResources: ['Take breaks as needed', 'Seek support if overwhelming'],
      followUpRequired: false
    });
    
    // Add safety checks for high-intensity insights
    const highImpactInsights = insights.filter(insight => insight.impact > 0.8);
    if (highImpactInsights.length > 0) {
      notes.push({
        type: 'safety_check',
        content: 'These insights may bring up strong emotions. Check in with yourself and seek support if needed.',
        severity: 'caution',
        actionRequired: true,
        culturalConsiderations: request.culturalContext.culturalBackground,
        supportResources: ['Trusted friend or family member', 'Counselor or therapist', 'Cultural community elder'],
        followUpRequired: true
      });
    }
    
    // Add strength-focus reminders
    notes.push({
      type: 'strength_focus',
      content: 'This analysis highlights your unique strengths and potential. You have everything within you to live purposefully.',
      severity: 'info',
      actionRequired: false,
      culturalConsiderations: request.culturalContext.culturalBackground,
      supportResources: [],
      followUpRequired: false
    });
    
    return notes;
  }

  // Quality calculation methods...

  private calculateConfidenceScore(insights: AIInsight[], coachingResults: any): number {
    const insightConfidence = insights.reduce((sum, insight) => sum + insight.confidence, 0) / Math.max(insights.length, 1);
    const coachingConfidence = coachingResults.confidence || 0.7;
    
    return (insightConfidence + coachingConfidence) / 2;
  }

  private calculateQualityMetrics(aiMap: IKIGAIAIMap, request: IKIGAIAnalysisRequest): QualityMetrics {
    return {
      coherenceScore: this.calculateCoherenceScore(aiMap),
      actionabilityScore: this.calculateActionabilityScore(aiMap),
      culturalResonanceScore: this.calculateCulturalResonanceScore(aiMap, request.culturalContext),
      personalRelevanceScore: this.calculatePersonalRelevanceScore(aiMap, request),
      completenessScore: this.calculateCompletenessScore(aiMap)
    };
  }

  private calculateCoherenceScore(aiMap: IKIGAIAIMap): number {
    return aiMap.clusters.reduce((sum, cluster) => sum + cluster.coherenceScore, 0) / Math.max(aiMap.clusters.length, 1);
  }

  private calculateActionabilityScore(aiMap: IKIGAIAIMap): number {
    return aiMap.recommendedActions.reduce((sum, action) => sum + (action.impact / 10), 0) / Math.max(aiMap.recommendedActions.length, 1);
  }

  private calculateCulturalResonanceScore(aiMap: IKIGAIAIMap, culturalContext: CulturalContext): number {
    return aiMap.clusters.reduce((sum, cluster) => sum + cluster.culturalResonance, 0) / Math.max(aiMap.clusters.length, 1);
  }

  private calculatePersonalRelevanceScore(aiMap: IKIGAIAIMap, request: IKIGAIAnalysisRequest): number {
    // Calculate based on how well insights match user's expressed interests and goals
    return aiMap.insights.reduce((sum, insight) => sum + insight.impact, 0) / Math.max(aiMap.insights.length, 1);
  }

  private calculateCompletenessScore(aiMap: IKIGAIAIMap): number {
    let score = 0;
    
    // Check for presence of key components
    if (aiMap.clusters.length > 0) score += 0.25;
    if (aiMap.insights.length > 0) score += 0.25;
    if (aiMap.recommendedActions.length > 0) score += 0.25;
    if (aiMap.connectionStrengths.length > 0) score += 0.25;
    
    return score;
  }

  // Placeholder methods for personality and cultural alignment analysis...

  private async analyzePersonalityAlignment(responses: IKIGAIResponses): Promise<any> {
    // Personality alignment analysis
    return {
      traits: [],
      alignmentScore: 0.7,
      strengths: ['Self-awareness', 'Values clarity'],
      growthAreas: ['Action planning', 'Goal setting'],
      workingStyles: ['Collaborative', 'Reflective'],
      communicationPreferences: ['Visual', 'Written'],
      culturalPersonalityFactors: []
    };
  }

  private async analyzeCulturalAlignment(responses: IKIGAIResponses, culturalContext: CulturalContext): Promise<any> {
    // Cultural alignment analysis
    return {
      overallAlignment: 0.8,
      valueAlignment: 0.8,
      opportunityAlignment: 0.7,
      expressionAlignment: 0.7,
      familyAlignment: 0.6,
      communityAlignment: 0.7,
      gaps: [],
      bridges: [],
      adaptations: []
    };
  }

  private async generateDevelopmentTrajectory(
    clusteringResult: ClusteringResult,
    intersections: IntersectionMapping,
    request: IKIGAIAnalysisRequest
  ): Promise<any> {
    // Development trajectory analysis
    return {
      currentPhase: 'Discovery',
      nextPhase: 'Integration',
      trajectoryPath: [],
      timeHorizon: '6-12 months',
      keyTransitions: [],
      milestones: [],
      potentialChallenges: [],
      successFactors: []
    };
  }
}

export default IKIGAIAnalysisEngine;