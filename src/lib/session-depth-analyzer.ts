/**
 * Session Depth Analysis System for ALCHM
 * 
 * Distinguishes meaningful healing engagement from superficial browsing
 * Tracks genuine therapeutic progress indicators while respecting privacy
 */

import { Timestamp } from 'firebase/firestore';
import { SessionMetrics } from './privacy-preserving-analytics';

export interface SessionDepthMetrics {
  // Writing quality indicators
  wordCount: number;
  uniqueWordCount: number;
  sentenceComplexity: number; // Average words per sentence
  emotionalWords: number; // Count of emotion-related vocabulary
  
  // Temporal engagement patterns
  actualWritingTime: number; // Time actively typing (not idle)
  pauseReflectionTime: number; // Time spent pausing between sentences
  revisionTime: number; // Time spent editing/revising
  
  // Interaction depth
  promptEngagement: number; // How fully prompts were addressed
  selfDirectedExploration: number; // Content beyond prompts
  connectionsMade: number; // Links between current and past entries
  
  // Emotional processing indicators
  vulnerabilityLevel: number; // Openness in sharing difficult experiences
  insightGeneration: number; // New understandings or realizations
  copingStrategiesUsed: number; // Active use of therapeutic techniques
  progressAcknowledgment: number; // Recognition of growth or healing
}

export interface MeaningfulEngagementIndicators {
  isTherapeuticSession: boolean; // Genuine healing vs. superficial use
  engagementDepth: 'browsing' | 'check_in' | 'processing' | 'breakthrough';
  healingMoments: string[]; // Types of therapeutic breakthroughs observed
  supportNeeds: string[]; // Areas where additional support may help
  strengths: string[]; // User's demonstrated coping strengths
  
  // Risk mitigation
  overwhelmRisk: 'low' | 'moderate' | 'high'; // Risk of emotional overwhelm
  isolationRisk: 'low' | 'moderate' | 'high'; // Risk of social withdrawal
  crisisIndicators: boolean; // Immediate safety concerns
  
  // Growth indicators
  resilenceBuilding: boolean; // Evidence of resilience development
  selfCompassion: boolean; // Kind self-talk vs. self-criticism
  futureFocus: boolean; // Forward-looking vs. ruminating
}

export class SessionDepthAnalyzer {
  private static readonly EMOTIONAL_VOCABULARY = new Set([
    // Basic emotions
    'happy', 'sad', 'angry', 'scared', 'excited', 'worried', 'calm', 'nervous',
    'joy', 'fear', 'rage', 'grief', 'anxiety', 'peace', 'stress', 'relief',
    
    // Complex emotions
    'overwhelmed', 'grateful', 'ashamed', 'proud', 'disappointed', 'hopeful',
    'frustrated', 'content', 'vulnerable', 'empowered', 'isolated', 'connected',
    
    // Trauma-related
    'triggered', 'flashback', 'dissociated', 'numb', 'hypervigilant', 'safe',
    'unsafe', 'boundaries', 'healing', 'recovery', 'therapy', 'support',
    
    // Growth-oriented
    'insight', 'awareness', 'understanding', 'growth', 'progress', 'breakthrough',
    'resilient', 'strong', 'capable', 'worthy', 'enough', 'learning'
  ]);

  private static readonly CRISIS_INDICATORS = new Set([
    'suicide', 'kill myself', 'end it all', 'better off dead', 'no point',
    'self harm', 'cutting', 'hurting myself', 'want to die', 'giving up',
    'hopeless', 'no way out', 'can\'t go on', 'worthless', 'burden'
  ]);

  private static readonly COPING_STRATEGIES = new Set([
    'breathing', 'meditation', 'mindfulness', 'grounding', 'exercise',
    'talking to friend', 'therapy', 'journaling', 'music', 'art',
    'nature', 'walking', 'bath', 'tea', 'reading', 'prayer', 'yoga'
  ]);

  private static readonly INSIGHT_INDICATORS = new Set([
    'realized', 'understood', 'learned', 'discovered', 'noticed', 'aware',
    'insight', 'breakthrough', 'aha moment', 'makes sense', 'clarity',
    'perspective', 'reframe', 'see now', 'understand now'
  ]);

  /**
   * Analyze writing content for therapeutic depth and quality
   */
  static analyzeWritingDepth(content: string, timeSpent: number): SessionDepthMetrics {
    const words = content.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const uniqueWords = new Set(words);
    
    return {
      wordCount: words.length,
      uniqueWordCount: uniqueWords.size,
      sentenceComplexity: words.length / Math.max(sentences.length, 1),
      emotionalWords: this.countEmotionalVocabulary(words),
      
      // Estimate temporal patterns from total time
      actualWritingTime: this.estimateWritingTime(words.length, timeSpent),
      pauseReflectionTime: this.estimatePauseTime(sentences.length, timeSpent),
      revisionTime: this.estimateRevisionTime(content, timeSpent),
      
      promptEngagement: this.analyzePromptEngagement(content),
      selfDirectedExploration: this.analyzeSelfDirectedContent(content),
      connectionsMade: this.analyzeConnections(content),
      
      vulnerabilityLevel: this.assessVulnerability(content),
      insightGeneration: this.detectInsights(content),
      copingStrategiesUsed: this.identifyCopingStrategies(content),
      progressAcknowledgment: this.detectProgressAwareness(content)
    };
  }

  /**
   * Determine meaningful engagement vs. superficial browsing
   */
  static assessMeaningfulEngagement(
    metrics: SessionDepthMetrics,
    sessionDuration: number,
    userHistory?: SessionMetrics[]
  ): MeaningfulEngagementIndicators {
    
    // Calculate therapeutic session probability
    const isTherapeuticSession = this.isGenuineTherapeuticEngagement(metrics, sessionDuration);
    
    // Determine engagement depth
    const engagementDepth = this.categorizeEngagementDepth(metrics, sessionDuration);
    
    // Identify healing moments and breakthroughs
    const healingMoments = this.identifyHealingMoments(metrics);
    
    // Assess support needs
    const supportNeeds = this.identifySupportNeeds(metrics);
    
    // Recognize strengths demonstrated
    const strengths = this.identifyStrengths(metrics);
    
    // Assess risks
    const overwhelmRisk = this.assessOverwhelmRisk(metrics);
    const isolationRisk = this.assessIsolationRisk(metrics, userHistory);
    const crisisIndicators = this.detectCrisisIndicators(metrics);
    
    // Identify growth indicators
    const resilenceBuilding = this.detectResilienceBuilding(metrics);
    const selfCompassion = this.detectSelfCompassion(metrics);
    const futureFocus = this.detectFutureFocus(metrics);

    return {
      isTherapeuticSession,
      engagementDepth,
      healingMoments,
      supportNeeds,
      strengths,
      overwhelmRisk,
      isolationRisk,
      crisisIndicators,
      resilenceBuilding,
      selfCompassion,
      futureFocus
    };
  }

  /**
   * Distinguish therapeutic engagement from casual browsing
   */
  private static isGenuineTherapeuticEngagement(
    metrics: SessionDepthMetrics, 
    duration: number
  ): boolean {
    const therapeuticIndicators = [
      metrics.wordCount > 100, // Substantial writing
      metrics.emotionalWords > 3, // Emotional processing
      metrics.vulnerabilityLevel > 0.3, // Some openness
      duration > 8, // Meaningful time investment
      metrics.actualWritingTime > 5, // Active engagement
      metrics.pauseReflectionTime > 2, // Thoughtful pauses
      metrics.promptEngagement > 0.5 || metrics.selfDirectedExploration > 0.5 // Meaningful content
    ];

    const therapeuticScore = therapeuticIndicators.filter(Boolean).length / therapeuticIndicators.length;
    return therapeuticScore >= 0.5; // At least half the indicators present
  }

  /**
   * Categorize depth of engagement
   */
  private static categorizeEngagementDepth(
    metrics: SessionDepthMetrics, 
    duration: number
  ): 'browsing' | 'check_in' | 'processing' | 'breakthrough' {
    
    if (duration < 3 || metrics.wordCount < 20) {
      return 'browsing';
    }
    
    if (metrics.insightGeneration > 0.7 || metrics.vulnerabilityLevel > 0.8) {
      return 'breakthrough';
    }
    
    if (metrics.emotionalWords > 5 && metrics.actualWritingTime > 10) {
      return 'processing';
    }
    
    return 'check_in';
  }

  /**
   * Identify specific types of healing moments
   */
  private static identifyHealingMoments(metrics: SessionDepthMetrics): string[] {
    const moments: string[] = [];
    
    if (metrics.insightGeneration > 0.5) moments.push('insight_breakthrough');
    if (metrics.vulnerabilityLevel > 0.6) moments.push('emotional_opening');
    if (metrics.copingStrategiesUsed > 2) moments.push('active_coping');
    if (metrics.progressAcknowledgment > 0.5) moments.push('growth_recognition');
    if (metrics.connectionsMade > 1) moments.push('pattern_awareness');
    
    return moments;
  }

  /**
   * Assess areas where user might benefit from support
   */
  private static identifySupportNeeds(metrics: SessionDepthMetrics): string[] {
    const needs: string[] = [];
    
    if (metrics.copingStrategiesUsed === 0) needs.push('coping_skills');
    if (metrics.vulnerabilityLevel < 0.2) needs.push('emotional_expression');
    if (metrics.connectionsMade === 0) needs.push('pattern_recognition');
    if (metrics.insightGeneration < 0.3) needs.push('self_reflection');
    if (metrics.progressAcknowledgment === 0) needs.push('growth_awareness');
    
    return needs;
  }

  /**
   * Identify demonstrated coping strengths
   */
  private static identifyStrengths(metrics: SessionDepthMetrics): string[] {
    const strengths: string[] = [];
    
    if (metrics.copingStrategiesUsed > 1) strengths.push('active_coping');
    if (metrics.vulnerabilityLevel > 0.5) strengths.push('emotional_courage');
    if (metrics.insightGeneration > 0.4) strengths.push('self_awareness');
    if (metrics.progressAcknowledgment > 0.3) strengths.push('growth_mindset');
    if (metrics.selfDirectedExploration > 0.5) strengths.push('self_direction');
    
    return strengths;
  }

  /**
   * Helper methods for content analysis
   */
  private static countEmotionalVocabulary(words: string[]): number {
    return words.filter(word => this.EMOTIONAL_VOCABULARY.has(word)).length;
  }

  private static estimateWritingTime(wordCount: number, totalTime: number): number {
    // Average typing speed is 40 WPM, so estimate active writing time
    const estimatedWritingTime = wordCount / 40;
    return Math.min(estimatedWritingTime, totalTime * 0.7);
  }

  private static estimatePauseTime(sentenceCount: number, totalTime: number): number {
    // Estimate thoughtful pauses between sentences
    return Math.min(sentenceCount * 0.5, totalTime * 0.3);
  }

  private static estimateRevisionTime(content: string, totalTime: number): number {
    // Simple heuristic: complex punctuation suggests revision
    const revisionIndicators = (content.match(/[,;:()]/g) || []).length;
    return Math.min(revisionIndicators * 0.1, totalTime * 0.2);
  }

  private static analyzePromptEngagement(content: string): number {
    // This would integrate with actual prompt system
    // For now, return a placeholder
    return content.length > 100 ? 0.7 : 0.3;
  }

  private static analyzeSelfDirectedContent(content: string): number {
    // Identify content that goes beyond responding to prompts
    const selfDirectedIndicators = [
      content.includes('also'),
      content.includes('another thing'),
      content.includes('additionally'),
      content.includes('i want to add')
    ];
    
    return selfDirectedIndicators.filter(Boolean).length * 0.25;
  }

  private static analyzeConnections(content: string): number {
    const connectionWords = ['like yesterday', 'similar to', 'reminds me', 'like before', 'pattern'];
    return connectionWords.filter(phrase => content.toLowerCase().includes(phrase)).length;
  }

  private static assessVulnerability(content: string): number {
    const vulnerabilityIndicators = [
      content.includes('scared'),
      content.includes('ashamed'),
      content.includes('difficult'),
      content.includes('struggle'),
      content.includes('vulnerable'),
      content.includes('afraid to say')
    ];
    
    return vulnerabilityIndicators.filter(Boolean).length / vulnerabilityIndicators.length;
  }

  private static detectInsights(content: string): number {
    const lowerContent = content.toLowerCase();
    let insightCount = 0;
    
    for (const indicator of this.INSIGHT_INDICATORS) {
      if (lowerContent.includes(indicator)) {
        insightCount++;
      }
    }
    
    return Math.min(insightCount / 3, 1); // Cap at 1.0
  }

  private static identifyCopingStrategies(content: string): number {
    const lowerContent = content.toLowerCase();
    let copingCount = 0;
    
    for (const strategy of this.COPING_STRATEGIES) {
      if (lowerContent.includes(strategy)) {
        copingCount++;
      }
    }
    
    return copingCount;
  }

  private static detectProgressAwareness(content: string): number {
    const progressIndicators = [
      'getting better', 'improving', 'progress', 'growth', 'stronger',
      'learning', 'better than', 'used to', 'now i can'
    ];
    
    const lowerContent = content.toLowerCase();
    const progressCount = progressIndicators.filter(phrase => lowerContent.includes(phrase)).length;
    
    return Math.min(progressCount / 3, 1);
  }

  private static assessOverwhelmRisk(metrics: SessionDepthMetrics): 'low' | 'moderate' | 'high' {
    const riskFactors = [
      metrics.emotionalWords > 10,
      metrics.vulnerabilityLevel > 0.8,
      metrics.wordCount > 1000,
      metrics.actualWritingTime > 45
    ];
    
    const riskCount = riskFactors.filter(Boolean).length;
    if (riskCount >= 3) return 'high';
    if (riskCount >= 2) return 'moderate';
    return 'low';
  }

  private static assessIsolationRisk(
    metrics: SessionDepthMetrics, 
    userHistory?: SessionMetrics[]
  ): 'low' | 'moderate' | 'high' {
    // Simple risk assessment - would be more sophisticated with full history
    if (!userHistory || userHistory.length < 3) return 'moderate';
    
    const recentSessions = userHistory.slice(0, 5);
    const avgGapDays = recentSessions.length > 1 ? 
      (Date.now() - recentSessions[recentSessions.length - 1].timestamp.toMillis()) / (24 * 60 * 60 * 1000) : 0;
    
    if (avgGapDays > 7) return 'high';
    if (avgGapDays > 3) return 'moderate';
    return 'low';
  }

  private static detectCrisisIndicators(metrics: SessionDepthMetrics): boolean {
    // This would analyze content for crisis language - placeholder for privacy
    return false;
  }

  private static detectResilienceBuilding(metrics: SessionDepthMetrics): boolean {
    return metrics.copingStrategiesUsed > 0 && metrics.progressAcknowledgment > 0.3;
  }

  private static detectSelfCompassion(metrics: SessionDepthMetrics): boolean {
    // Would analyze for self-kind vs. self-critical language
    return metrics.vulnerabilityLevel > 0.4 && metrics.insightGeneration > 0.3;
  }

  private static detectFutureFocus(metrics: SessionDepthMetrics): boolean {
    // Would analyze for forward-looking vs. ruminating content
    return metrics.progressAcknowledgment > 0.4;
  }
}

export default SessionDepthAnalyzer;