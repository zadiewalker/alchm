/**
 * ALCHM AI-Powered Content Moderation System
 * 
 * Intelligent content safety system that classifies user content for therapeutic
 * value while protecting against harmful content and providing supportive interventions.
 */

import { crisisDetectionEngine } from '../crisis-detection/crisis-detection-engine';
import { analytics } from '../analytics';

export interface ContentClassification {
  id: string;
  content: string; // Hash or sanitized reference, never full content
  contentHash: string;
  userId: string;
  timestamp: Date;
  
  // Classification results
  therapeutic: TherapeuticClassification;
  safety: SafetyClassification;
  quality: QualityClassification;
  
  // Moderation actions
  actions: ModerationAction[];
  humanReviewRequired: boolean;
  confidence: number;
}

export interface TherapeuticClassification {
  category: 'therapeutic' | 'concerning' | 'neutral' | 'positive_progress';
  indicators: {
    emotional_processing: number; // 0-1 score
    insight_development: number;
    coping_strategies: number;
    support_seeking: number;
    progress_indicators: number;
  };
  recommendations: TherapeuticRecommendation[];
  encouragementLevel: 'high' | 'medium' | 'low';
}

export interface SafetyClassification {
  riskLevel: 'safe' | 'concerning' | 'high_risk' | 'immediate_danger';
  riskFactors: string[];
  protectiveFactors: string[];
  interventionNeeded: boolean;
  crisisDetection: any; // From crisis detection engine
}

export interface QualityClassification {
  authenticity: number; // 0-1 score for genuine vs spam/fake
  coherence: number;
  engagement: number;
  spam_probability: number;
  bot_probability: number;
}

export interface TherapeuticRecommendation {
  type: 'resource' | 'prompt' | 'exercise' | 'professional_support';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  culturallyRelevant?: boolean;
}

export interface ModerationAction {
  id: string;
  type: 'educational' | 'supportive' | 'protective' | 'professional' | 'flag_for_review';
  description: string;
  resources?: any[];
  automatic: boolean;
  timestamp: Date;
  userResponse?: 'acknowledged' | 'dismissed' | 'engaged';
}

export interface ContentModerationConfig {
  enabled: boolean;
  realTimeAnalysis: boolean;
  therapeuticRecommendations: boolean;
  privacyMode: 'strict' | 'standard' | 'research';
  culturalSensitivity: boolean;
  languageModels: string[];
  confidenceThresholds: {
    therapeutic: number;
    safety: number;
    quality: number;
    humanReview: number;
  };
}

export class AIContentModerationSystem {
  private config: ContentModerationConfig;
  private analyticsBuffer: Map<string, any[]> = new Map();
  private therapeuticPatterns: TherapeuticPattern[] = [];
  private harmfulPatterns: HarmfulPattern[] = [];

  constructor(config: ContentModerationConfig) {
    this.config = config;
    this.initializePatterns();
  }

  /**
   * Initialize therapeutic and harmful content patterns
   */
  private initializePatterns(): void {
    // Therapeutic progress patterns
    this.therapeuticPatterns = [
      {
        id: 'emotional_processing',
        patterns: [
          /\b(feeling|felt|emotions?|processing|understanding|realizing?)\b/gi,
          /\b(insight|awareness|clarity|perspective|learning)\b/gi
        ],
        weight: 0.8,
        category: 'emotional_processing'
      },
      {
        id: 'coping_strategies',
        patterns: [
          /\b(coping|managing|strategies|techniques|breathing|meditation)\b/gi,
          /\b(therapy|counseling|support|helping|healing)\b/gi
        ],
        weight: 0.7,
        category: 'coping_strategies'
      },
      {
        id: 'progress_indicators',
        patterns: [
          /\b(better|improving|progress|growth|stronger|healing)\b/gi,
          /\b(grateful|hopeful|optimistic|positive|proud)\b/gi
        ],
        weight: 0.9,
        category: 'progress_indicators'
      },
      {
        id: 'support_seeking',
        patterns: [
          /\b(reaching out|asking for help|support|connection|community)\b/gi,
          /\b(therapist|counselor|friend|family|professional)\b/gi
        ],
        weight: 0.8,
        category: 'support_seeking'
      }
    ];

    // Harmful content patterns (complementing crisis detection)
    this.harmfulPatterns = [
      {
        id: 'spam_indicators',
        patterns: [
          /\b(click here|buy now|amazing deal|weight loss|crypto)\b/gi,
          /(.)\1{10,}/, // Repeated characters
          /https?:\/\/[^\s]+/gi // URLs (potentially suspicious)
        ],
        severity: 'low',
        action: 'flag_for_review'
      },
      {
        id: 'inappropriate_content',
        patterns: [
          /\b(explicit sexual content patterns would be here)\b/gi,
          /\b(hate speech patterns would be here)\b/gi
        ],
        severity: 'high',
        action: 'protective'
      }
    ];
  }

  /**
   * Analyze content for therapeutic value and safety
   */
  public async moderateContent(content: string, userId: string): Promise<ContentClassification> {
    const startTime = performance.now();
    const contentHash = await this.generateContentHash(content);

    try {
      // Run parallel analysis
      const [therapeutic, safety, quality] = await Promise.all([
        this.analyzeTherapeuticValue(content),
        this.analyzeSafety(content, userId),
        this.analyzeQuality(content)
      ]);

      // Calculate overall confidence
      const confidence = this.calculateOverallConfidence(therapeutic, safety, quality);

      // Determine if human review is needed
      const humanReviewRequired = this.requiresHumanReview(confidence, safety);

      // Generate moderation actions
      const actions = await this.generateModerationActions(therapeutic, safety, quality);

      const classification: ContentClassification = {
        id: this.generateClassificationId(),
        content: '', // Never store actual content
        contentHash,
        userId,
        timestamp: new Date(),
        therapeutic,
        safety,
        quality,
        actions,
        humanReviewRequired,
        confidence
      };

      // Execute automatic actions
      if (this.config.realTimeAnalysis) {
        await this.executeAutomaticActions(classification);
      }

      // Log analytics (privacy-preserving)
      this.logModerationAnalytics(classification, performance.now() - startTime);

      return classification;

    } catch (error) {
      console.error('[ContentModeration] Analysis failed:', error);
      
      // Return safe fallback classification
      return this.createSafeFallbackClassification(contentHash, userId);
    }
  }

  /**
   * Analyze therapeutic value of content
   */
  private async analyzeTherapeuticValue(content: string): Promise<TherapeuticClassification> {
    const indicators = {
      emotional_processing: 0,
      insight_development: 0,
      coping_strategies: 0,
      support_seeking: 0,
      progress_indicators: 0
    };

    // Analyze against therapeutic patterns
    for (const pattern of this.therapeuticPatterns) {
      let score = 0;
      for (const regex of pattern.patterns) {
        const matches = content.match(regex);
        if (matches) {
          score += matches.length * pattern.weight;
        }
      }
      
      // Normalize score to 0-1 range
      indicators[pattern.category as keyof typeof indicators] = Math.min(score / 10, 1);
    }

    // Determine overall category
    const averageScore = Object.values(indicators).reduce((sum, val) => sum + val, 0) / Object.keys(indicators).length;
    let category: TherapeuticClassification['category'];
    
    if (averageScore >= 0.7) {
      category = 'therapeutic';
    } else if (averageScore >= 0.4) {
      category = 'positive_progress';
    } else if (indicators.emotional_processing > 0.3) {
      category = 'concerning'; // Emotional content but no positive indicators
    } else {
      category = 'neutral';
    }

    // Generate recommendations
    const recommendations = await this.generateTherapeuticRecommendations(indicators, category);

    // Determine encouragement level
    const encouragementLevel = indicators.progress_indicators > 0.5 ? 'high' :
                             indicators.emotional_processing > 0.3 ? 'medium' : 'low';

    return {
      category,
      indicators,
      recommendations,
      encouragementLevel
    };
  }

  /**
   * Analyze content safety
   */
  private async analyzeSafety(content: string, userId: string): Promise<SafetyClassification> {
    // Use existing crisis detection engine
    const crisisDetection = await crisisDetectionEngine.analyzeContent(content, userId);

    // Analyze for other harmful patterns
    const harmfulIndicators = this.analyzeHarmfulPatterns(content);

    // Determine risk level
    let riskLevel: SafetyClassification['riskLevel'];
    if (crisisDetection.interventionLevel === 'immediate') {
      riskLevel = 'immediate_danger';
    } else if (crisisDetection.interventionLevel === 'supportive') {
      riskLevel = 'high_risk';
    } else if (crisisDetection.interventionLevel === 'gentle' || harmfulIndicators.length > 0) {
      riskLevel = 'concerning';
    } else {
      riskLevel = 'safe';
    }

    return {
      riskLevel,
      riskFactors: [...crisisDetection.detectedPatterns.map(p => p.id), ...harmfulIndicators],
      protectiveFactors: this.identifyProtectiveFactors(content),
      interventionNeeded: crisisDetection.interventionLevel !== 'none',
      crisisDetection
    };
  }

  /**
   * Analyze content quality
   */
  private async analyzeQuality(content: string): Promise<QualityClassification> {
    // Simple quality metrics
    const wordCount = content.split(/\s+/).length;
    const sentenceCount = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);

    // Authenticity indicators
    const authenticity = this.calculateAuthenticity(content, wordCount, avgWordsPerSentence);
    
    // Coherence analysis
    const coherence = this.calculateCoherence(content, sentenceCount);
    
    // Engagement potential
    const engagement = this.calculateEngagement(content, wordCount);
    
    // Spam detection
    const spam_probability = this.calculateSpamProbability(content);
    
    // Bot detection
    const bot_probability = this.calculateBotProbability(content, wordCount, avgWordsPerSentence);

    return {
      authenticity,
      coherence,
      engagement,
      spam_probability,
      bot_probability
    };
  }

  /**
   * Generate therapeutic recommendations
   */
  private async generateTherapeuticRecommendations(
    indicators: TherapeuticClassification['indicators'],
    category: TherapeuticClassification['category']
  ): Promise<TherapeuticRecommendation[]> {
    const recommendations: TherapeuticRecommendation[] = [];

    // Emotional processing support
    if (indicators.emotional_processing > 0.3 && indicators.coping_strategies < 0.3) {
      recommendations.push({
        type: 'exercise',
        title: 'Grounding Techniques',
        description: 'Try the 5-4-3-2-1 grounding technique to help process these emotions',
        priority: 'medium'
      });
    }

    // Coping strategy enhancement
    if (indicators.coping_strategies < 0.4) {
      recommendations.push({
        type: 'resource',
        title: 'Coping Strategies Library',
        description: 'Explore evidence-based coping techniques for emotional regulation',
        priority: 'medium'
      });
    }

    // Support seeking encouragement
    if (indicators.support_seeking < 0.3 && category === 'concerning') {
      recommendations.push({
        type: 'professional_support',
        title: 'Consider Professional Support',
        description: 'A therapist can provide additional tools and support for your journey',
        priority: 'high'
      });
    }

    // Progress acknowledgment
    if (indicators.progress_indicators > 0.6) {
      recommendations.push({
        type: 'prompt',
        title: 'Celebrate Your Progress',
        description: 'Acknowledging growth is an important part of healing',
        priority: 'low'
      });
    }

    return recommendations;
  }

  /**
   * Generate moderation actions based on analysis
   */
  private async generateModerationActions(
    therapeutic: TherapeuticClassification,
    safety: SafetyClassification,
    quality: QualityClassification
  ): Promise<ModerationAction[]> {
    const actions: ModerationAction[] = [];

    // Safety-based actions
    if (safety.interventionNeeded) {
      actions.push({
        id: this.generateActionId(),
        type: 'protective',
        description: 'Crisis intervention resources provided',
        resources: safety.crisisDetection.recommendedResources,
        automatic: true,
        timestamp: new Date()
      });
    }

    // Therapeutic recommendations
    if (therapeutic.recommendations.length > 0) {
      actions.push({
        id: this.generateActionId(),
        type: 'educational',
        description: 'Therapeutic resources and recommendations provided',
        resources: therapeutic.recommendations,
        automatic: this.config.therapeuticRecommendations,
        timestamp: new Date()
      });
    }

    // Quality-based actions
    if (quality.spam_probability > 0.7) {
      actions.push({
        id: this.generateActionId(),
        type: 'flag_for_review',
        description: 'Content flagged for potential spam',
        automatic: true,
        timestamp: new Date()
      });
    }

    // Supportive actions
    if (therapeutic.category === 'therapeutic' || therapeutic.encouragementLevel === 'high') {
      actions.push({
        id: this.generateActionId(),
        type: 'supportive',
        description: 'Positive reinforcement and encouragement provided',
        automatic: true,
        timestamp: new Date()
      });
    }

    return actions;
  }

  /**
   * Execute automatic moderation actions
   */
  private async executeAutomaticActions(classification: ContentClassification): Promise<void> {
    for (const action of classification.actions) {
      if (action.automatic) {
        try {
          await this.executeAction(classification.userId, action);
        } catch (error) {
          console.error('[ContentModeration] Action execution failed:', error);
        }
      }
    }
  }

  // Helper methods
  private async generateContentHash(content: string): Promise<string> {
    // Generate privacy-preserving hash
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private calculateOverallConfidence(
    therapeutic: TherapeuticClassification,
    safety: SafetyClassification,
    quality: QualityClassification
  ): number {
    // Weighted confidence calculation
    const therapeuticConfidence = Object.values(therapeutic.indicators).reduce((sum, val) => sum + val, 0) / 5;
    const safetyConfidence = safety.crisisDetection?.confidence || 0.5;
    const qualityConfidence = (quality.authenticity + quality.coherence + (1 - quality.spam_probability)) / 3;

    return (therapeuticConfidence * 0.4 + safetyConfidence * 0.4 + qualityConfidence * 0.2);
  }

  private requiresHumanReview(confidence: number, safety: SafetyClassification): boolean {
    return confidence < this.config.confidenceThresholds.humanReview ||
           safety.riskLevel === 'immediate_danger' ||
           safety.riskLevel === 'high_risk';
  }

  private analyzeHarmfulPatterns(content: string): string[] {
    const detected: string[] = [];
    
    for (const pattern of this.harmfulPatterns) {
      for (const regex of pattern.patterns) {
        if (content.match(regex)) {
          detected.push(pattern.id);
          break;
        }
      }
    }
    
    return detected;
  }

  private identifyProtectiveFactors(content: string): string[] {
    const protectivePatterns = [
      { id: 'support_system', pattern: /\b(family|friends|therapist|support|community)\b/gi },
      { id: 'future_focus', pattern: /\b(tomorrow|future|plans|goals|hope)\b/gi },
      { id: 'coping_skills', pattern: /\b(meditation|breathing|exercise|therapy|coping)\b/gi }
    ];

    return protectivePatterns
      .filter(p => content.match(p.pattern))
      .map(p => p.id);
  }

  // Quality calculation helpers
  private calculateAuthenticity(content: string, wordCount: number, avgWordsPerSentence: number): number {
    // Heuristic for authentic personal writing
    let score = 0.5;
    
    // Personal pronouns indicate authenticity
    const personalPronouns = content.match(/\b(i|me|my|myself|we|us|our)\b/gi);
    if (personalPronouns) {
      score += Math.min(personalPronouns.length * 0.05, 0.3);
    }
    
    // Reasonable length suggests thoughtfulness
    if (wordCount >= 20 && wordCount <= 500) {
      score += 0.2;
    }
    
    return Math.min(score, 1);
  }

  private calculateCoherence(content: string, sentenceCount: number): number {
    // Simple coherence based on sentence structure
    if (sentenceCount === 0) return 0;
    
    let score = 0.5;
    
    // Multiple sentences suggest coherent thought
    if (sentenceCount > 1) {
      score += 0.3;
    }
    
    // Transition words indicate coherence
    const transitions = content.match(/\b(however|although|because|therefore|moreover|furthermore)\b/gi);
    if (transitions) {
      score += Math.min(transitions.length * 0.1, 0.2);
    }
    
    return Math.min(score, 1);
  }

  private calculateEngagement(content: string, wordCount: number): number {
    let score = 0;
    
    // Emotional words increase engagement
    const emotionalWords = content.match(/\b(feel|emotion|happy|sad|angry|excited|worried|grateful)\b/gi);
    if (emotionalWords) {
      score += Math.min(emotionalWords.length * 0.1, 0.4);
    }
    
    // Questions suggest engagement
    const questions = content.match(/\?/g);
    if (questions) {
      score += Math.min(questions.length * 0.1, 0.3);
    }
    
    // Appropriate length
    if (wordCount >= 30) {
      score += 0.3;
    }
    
    return Math.min(score, 1);
  }

  private calculateSpamProbability(content: string): number {
    let spamScore = 0;
    
    // Check for spam patterns
    for (const pattern of this.harmfulPatterns.filter(p => p.id === 'spam_indicators')) {
      for (const regex of pattern.patterns) {
        const matches = content.match(regex);
        if (matches) {
          spamScore += matches.length * 0.3;
        }
      }
    }
    
    return Math.min(spamScore, 1);
  }

  private calculateBotProbability(content: string, wordCount: number, avgWordsPerSentence: number): number {
    let botScore = 0;
    
    // Very structured or repetitive text
    if (avgWordsPerSentence < 3 || avgWordsPerSentence > 50) {
      botScore += 0.3;
    }
    
    // Lack of personal pronouns
    const personalPronouns = content.match(/\b(i|me|my|myself)\b/gi);
    if (!personalPronouns && wordCount > 20) {
      botScore += 0.2;
    }
    
    return Math.min(botScore, 1);
  }

  private createSafeFallbackClassification(contentHash: string, userId: string): ContentClassification {
    return {
      id: this.generateClassificationId(),
      content: '',
      contentHash,
      userId,
      timestamp: new Date(),
      therapeutic: {
        category: 'neutral',
        indicators: {
          emotional_processing: 0,
          insight_development: 0,
          coping_strategies: 0,
          support_seeking: 0,
          progress_indicators: 0
        },
        recommendations: [],
        encouragementLevel: 'low'
      },
      safety: {
        riskLevel: 'safe',
        riskFactors: [],
        protectiveFactors: [],
        interventionNeeded: false,
        crisisDetection: null
      },
      quality: {
        authenticity: 0.5,
        coherence: 0.5,
        engagement: 0.5,
        spam_probability: 0,
        bot_probability: 0
      },
      actions: [],
      humanReviewRequired: true,
      confidence: 0
    };
  }

  private logModerationAnalytics(classification: ContentClassification, processingTime: number): void {
    analytics.track('content_moderation_analysis', {
      userId: classification.userId,
      therapeuticCategory: classification.therapeutic.category,
      safetyRiskLevel: classification.safety.riskLevel,
      confidence: classification.confidence,
      humanReviewRequired: classification.humanReviewRequired,
      actionsCount: classification.actions.length,
      processingTime,
      timestamp: classification.timestamp.toISOString()
    });
  }

  // Placeholder methods
  private generateClassificationId(): string { return `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; }
  private generateActionId(): string { return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; }
  private async executeAction(userId: string, action: ModerationAction): Promise<void> {
    // Implementation would execute specific actions like showing resources, sending notifications, etc.
  }
}

// Type definitions
interface TherapeuticPattern {
  id: string;
  patterns: RegExp[];
  weight: number;
  category: string;
}

interface HarmfulPattern {
  id: string;
  patterns: RegExp[];
  severity: 'low' | 'medium' | 'high';
  action: string;
}

// Export system with default configuration
export const aiContentModerationSystem = new AIContentModerationSystem({
  enabled: true,
  realTimeAnalysis: true,
  therapeuticRecommendations: true,
  privacyMode: 'strict',
  culturalSensitivity: true,
  languageModels: ['en'],
  confidenceThresholds: {
    therapeutic: 0.7,
    safety: 0.8,
    quality: 0.6,
    humanReview: 0.5
  }
});