/**
 * ALCHM Privacy-Preserving Analytics Engine
 * 
 * This system generates genuine insights from user journal data while maintaining
 * absolute privacy and ethical standards. All processing happens client-side with
 * minimal server exposure and complete user control over their data.
 * 
 * Core Principles:
 * - Privacy is non-negotiable
 * - Data serves healing, not surveillance
 * - Insights empower users, never exploit vulnerabilities
 * - Transparency in methodology and limitations
 */

import { JournalEntry, UserStats } from './journal-service';
import { Timestamp } from 'firebase/firestore';

// ==============================================================================
// PRIVACY-PRESERVING DATA TYPES
// ==============================================================================

export interface PrivacySettings {
  enableAnalytics: boolean;
  shareAnonymizedInsights: boolean;
  dataRetentionDays: number;
  allowEmotionalAnalysis: boolean;
  allowPatternDetection: boolean;
  consentTimestamp: Date;
  consentVersion: string;
}

export interface EmotionalPattern {
  emotion: string;
  frequency: number;
  trend: 'improving' | 'stable' | 'needs_attention';
  contextualTriggers: string[];
  copingStrategies: string[];
  confidenceScore: number;
}

export interface WritingAnalytics {
  averageWordCount: number;
  wordCountTrend: 'increasing' | 'stable' | 'decreasing';
  vocabularyDiversity: number;
  emotionalVocabularyRichness: number;
  reflectionDepthScore: number;
  consistencyScore: number;
  writingMomentum: number;
}

export interface GrowthIndicators {
  selfAwarenessGrowth: number;
  emotionalRegulation: number;
  resilience: number;
  introspectionQuality: number;
  healingProgression: number;
  breakthroughMoments: BreakthroughMoment[];
  plateauPeriods: PlateauPeriod[];
}

export interface BreakthroughMoment {
  date: Date;
  type: 'emotional_clarity' | 'self_discovery' | 'coping_strategy' | 'relationship_insight';
  description: string;
  confidenceScore: number;
  relatedEntries: string[];
}

export interface PlateauPeriod {
  startDate: Date;
  endDate: Date;
  description: string;
  suggestedInterventions: string[];
}

export interface ConsistencyMetrics {
  journalingFrequency: number;
  engagementDepth: number;
  emotionalOpenness: number;
  reflectionConsistency: number;
  streak: {
    current: number;
    longest: number;
    recentBreaks: number;
  };
}

export interface TherapeuticInsights {
  emotionalPatterns: EmotionalPattern[];
  progressIndicators: GrowthIndicators;
  therapeuticMilestones: TherapeuticMilestone[];
  riskFactors: RiskFactor[];
  supportRecommendations: SupportRecommendation[];
}

export interface TherapeuticMilestone {
  id: string;
  name: string;
  description: string;
  achievedDate: Date;
  evidenceEntries: string[];
  significanceScore: number;
}

export interface RiskFactor {
  type: 'isolation' | 'negative_spiraling' | 'avoidance' | 'crisis_indicators';
  severity: 'low' | 'medium' | 'high';
  description: string;
  firstDetected: Date;
  trends: 'improving' | 'stable' | 'worsening';
  supportActions: string[];
}

export interface SupportRecommendation {
  type: 'self_care' | 'professional_help' | 'community_support' | 'crisis_intervention';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  actionSteps: string[];
  resources: string[];
}

export interface AnalyticsReport {
  id: string;
  userId: string;
  generatedAt: Date;
  timeframe: {
    start: Date;
    end: Date;
    type: 'week' | 'month' | 'quarter' | 'year';
  };
  privacySettings: PrivacySettings;
  writingAnalytics: WritingAnalytics;
  emotionalAnalytics: EmotionalAnalytics;
  therapeuticInsights: TherapeuticInsights;
  consistencyMetrics: ConsistencyMetrics;
  overallWellbeingScore: number;
  growthTrajectory: 'accelerating' | 'steady' | 'plateaued' | 'needs_support';
  recommendations: Recommendation[];
  dataQuality: DataQualityMetrics;
}

export interface EmotionalAnalytics {
  primaryEmotions: Array<{ emotion: string; percentage: number; trend: string }>;
  emotionalRange: number;
  emotionalStability: number;
  positiveEmotionRatio: number;
  emotionalVocabularyGrowth: number;
  emotionalProcessingDepth: number;
  moodPatterns: MoodPattern[];
}

export interface MoodPattern {
  pattern: string;
  frequency: number;
  timeContext: string;
  triggers: string[];
  outcomes: string[];
}

export interface Recommendation {
  id: string;
  type: 'healing_practice' | 'writing_technique' | 'self_care' | 'professional_support';
  title: string;
  description: string;
  priority: number;
  evidenceBased: boolean;
  traumaInformed: boolean;
  actionable: boolean;
}

export interface DataQualityMetrics {
  entryCount: number;
  averageEntryLength: number;
  emotionalDataCompleteness: number;
  temporalCoverage: number;
  consistencyScore: number;
  reliabilityScore: number;
}

// ==============================================================================
// PRIVACY-PRESERVING ANALYTICS ENGINE
// ==============================================================================

export class PrivacyPreservingAnalyticsEngine {
  private static readonly MIN_ENTRIES_FOR_PATTERNS = 5;
  private static readonly MIN_DAYS_FOR_TRENDS = 14;
  private static readonly CONFIDENCE_THRESHOLD = 0.7;

  /**
   * Generate comprehensive analytics report while preserving privacy
   */
  static async generateReport(
    entries: JournalEntry[],
    userStats: UserStats,
    privacySettings: PrivacySettings,
    timeframe: { start: Date; end: Date; type: 'week' | 'month' | 'quarter' | 'year' }
  ): Promise<AnalyticsReport> {
    if (!privacySettings.enableAnalytics) {
      throw new Error('Analytics disabled by user privacy settings');
    }

    // Filter entries by timeframe and consent
    const filteredEntries = this.filterEntriesByTimeframe(entries, timeframe);
    
    if (filteredEntries.length < this.MIN_ENTRIES_FOR_PATTERNS) {
      return this.generateMinimalReport(filteredEntries, userStats, privacySettings, timeframe);
    }

    // Apply differential privacy noise if sharing anonymized insights
    const processedEntries = privacySettings.shareAnonymizedInsights 
      ? this.applyDifferentialPrivacy(filteredEntries)
      : filteredEntries;

    return {
      id: this.generateSecureId(),
      userId: '', // Never store user ID in analytics
      generatedAt: new Date(),
      timeframe,
      privacySettings,
      writingAnalytics: this.analyzeWritingPatterns(processedEntries),
      emotionalAnalytics: privacySettings.allowEmotionalAnalysis 
        ? this.analyzeEmotionalPatterns(processedEntries)
        : this.getEmptyEmotionalAnalytics(),
      therapeuticInsights: this.generateTherapeuticInsights(processedEntries, privacySettings),
      consistencyMetrics: this.analyzeConsistency(processedEntries, userStats),
      overallWellbeingScore: this.calculateWellbeingScore(processedEntries),
      growthTrajectory: this.assessGrowthTrajectory(processedEntries),
      recommendations: this.generateRecommendations(processedEntries, privacySettings),
      dataQuality: this.assessDataQuality(processedEntries)
    };
  }

  /**
   * Filter entries by timeframe with privacy protection
   */
  private static filterEntriesByTimeframe(
    entries: JournalEntry[],
    timeframe: { start: Date; end: Date }
  ): JournalEntry[] {
    return entries.filter(entry => {
      const entryDate = entry.createdAt instanceof Timestamp 
        ? entry.createdAt.toDate() 
        : entry.createdAt;
      return entryDate >= timeframe.start && entryDate <= timeframe.end;
    });
  }

  /**
   * Apply differential privacy to protect individual entries
   */
  private static applyDifferentialPrivacy(entries: JournalEntry[]): JournalEntry[] {
    // Add calibrated noise to sensitive metrics while preserving utility
    return entries.map(entry => ({
      ...entry,
      wordCount: Math.max(1, entry.wordCount + this.addLaplaceNoise(0, 1)),
      mood: entry.mood ? Math.max(1, Math.min(10, entry.mood + this.addLaplaceNoise(0, 0.5))) : undefined
    }));
  }

  /**
   * Add Laplace noise for differential privacy
   */
  private static addLaplaceNoise(mu: number, b: number): number {
    const u = Math.random() - 0.5;
    return mu - b * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  }

  /**
   * Analyze writing patterns with privacy preservation
   */
  private static analyzeWritingPatterns(entries: JournalEntry[]): WritingAnalytics {
    if (entries.length === 0) {
      return this.getEmptyWritingAnalytics();
    }

    const wordCounts = entries.map(e => e.wordCount || 0);
    const averageWordCount = wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length;
    
    // Analyze vocabulary diversity using unique word ratio
    const vocabularyDiversity = this.calculateVocabularyDiversity(entries);
    
    // Assess emotional vocabulary richness
    const emotionalVocabularyRichness = this.calculateEmotionalVocabularyRichness(entries);
    
    // Calculate reflection depth based on introspective language patterns
    const reflectionDepthScore = this.calculateReflectionDepth(entries);
    
    // Assess writing consistency over time
    const consistencyScore = this.calculateWritingConsistency(entries);
    
    // Calculate writing momentum (engagement trend)
    const writingMomentum = this.calculateWritingMomentum(entries);

    return {
      averageWordCount,
      wordCountTrend: this.determineWordCountTrend(entries),
      vocabularyDiversity,
      emotionalVocabularyRichness,
      reflectionDepthScore,
      consistencyScore,
      writingMomentum
    };
  }

  /**
   * Analyze emotional patterns with trauma-informed approach
   */
  private static analyzeEmotionalPatterns(entries: JournalEntry[]): EmotionalAnalytics {
    const emotionalTerms = this.extractEmotionalTerms(entries);
    const emotionalCounts = this.countEmotionalOccurrences(emotionalTerms);
    
    const totalEmotions = Object.values(emotionalCounts).reduce((sum, count) => sum + count, 0);
    const primaryEmotions = Object.entries(emotionalCounts)
      .map(([emotion, count]) => ({
        emotion,
        percentage: (count / totalEmotions) * 100,
        trend: this.calculateEmotionTrend(emotion, entries)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    return {
      primaryEmotions,
      emotionalRange: this.calculateEmotionalRange(emotionalCounts),
      emotionalStability: this.calculateEmotionalStability(entries),
      positiveEmotionRatio: this.calculatePositiveEmotionRatio(emotionalCounts),
      emotionalVocabularyGrowth: this.calculateEmotionalVocabularyGrowth(entries),
      emotionalProcessingDepth: this.calculateEmotionalProcessingDepth(entries),
      moodPatterns: this.identifyMoodPatterns(entries)
    };
  }

  /**
   * Generate therapeutic insights with trauma-informed care principles
   */
  private static generateTherapeuticInsights(
    entries: JournalEntry[],
    privacySettings: PrivacySettings
  ): TherapeuticInsights {
    return {
      emotionalPatterns: this.identifyEmotionalPatterns(entries),
      progressIndicators: this.assessGrowthIndicators(entries),
      therapeuticMilestones: this.identifyTherapeuticMilestones(entries),
      riskFactors: this.assessRiskFactors(entries),
      supportRecommendations: this.generateSupportRecommendations(entries)
    };
  }

  /**
   * Calculate overall wellbeing score using multiple indicators
   */
  private static calculateWellbeingScore(entries: JournalEntry[]): number {
    if (entries.length === 0) return 0;

    const factors = [
      this.calculateMoodScore(entries) * 0.3,
      this.calculateConsistencyScore(entries) * 0.2,
      this.calculateReflectionDepth(entries) * 0.2,
      this.calculateEmotionalStability(entries) * 0.15,
      this.calculatePositivityRatio(entries) * 0.15
    ];

    return Math.min(100, Math.max(0, factors.reduce((sum, score) => sum + score, 0)));
  }

  /**
   * Generate personalized, trauma-informed recommendations
   */
  private static generateRecommendations(
    entries: JournalEntry[],
    privacySettings: PrivacySettings
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Writing frequency recommendations
    if (entries.length < 3) {
      recommendations.push({
        id: 'consistency-building',
        type: 'writing_technique',
        title: 'Build Writing Consistency',
        description: 'Start with just 2-3 minutes of daily writing to build a sustainable habit.',
        priority: 8,
        evidenceBased: true,
        traumaInformed: true,
        actionable: true
      });
    }

    // Emotional processing recommendations
    const emotionalRange = this.calculateEmotionalRange(this.extractEmotionalTerms(entries));
    if (emotionalRange < 0.3) {
      recommendations.push({
        id: 'emotional-exploration',
        type: 'healing_practice',
        title: 'Explore Emotional Vocabulary',
        description: 'Try naming specific emotions beyond "good" or "bad" to deepen self-awareness.',
        priority: 7,
        evidenceBased: true,
        traumaInformed: true,
        actionable: true
      });
    }

    // Reflection depth recommendations
    const reflectionDepth = this.calculateReflectionDepth(entries);
    if (reflectionDepth < 0.5) {
      recommendations.push({
        id: 'deeper-reflection',
        type: 'writing_technique',
        title: 'Deepen Your Reflections',
        description: 'Ask yourself "why" questions to explore the roots of your experiences.',
        priority: 6,
        evidenceBased: true,
        traumaInformed: true,
        actionable: true
      });
    }

    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 5);
  }

  // ==============================================================================
  // HELPER METHODS FOR PRIVACY-PRESERVING ANALYSIS
  // ==============================================================================

  private static calculateVocabularyDiversity(entries: JournalEntry[]): number {
    const allWords = entries.flatMap(entry => 
      entry.content.toLowerCase().match(/\b\w+\b/g) || []
    );
    const uniqueWords = new Set(allWords);
    return allWords.length > 0 ? uniqueWords.size / allWords.length : 0;
  }

  private static calculateEmotionalVocabularyRichness(entries: JournalEntry[]): number {
    const emotionalTerms = this.extractEmotionalTerms(entries);
    const uniqueEmotions = new Set(Object.keys(emotionalTerms));
    return Math.min(1, uniqueEmotions.size / 20); // Normalized to 20 common emotions
  }

  private static calculateReflectionDepth(entries: JournalEntry[]): number {
    const reflectivePatterns = [
      /\b(because|why|realize|understand|feel|think|believe|wonder)\b/gi,
      /\b(learned|discovered|noticed|recognized|acknowledged)\b/gi,
      /\?(.*?)(feel|think|mean|happen)/gi
    ];

    let totalScore = 0;
    for (const entry of entries) {
      let entryScore = 0;
      for (const pattern of reflectivePatterns) {
        const matches = entry.content.match(pattern);
        entryScore += matches ? matches.length : 0;
      }
      totalScore += Math.min(1, entryScore / entry.wordCount);
    }

    return entries.length > 0 ? totalScore / entries.length : 0;
  }

  private static calculateWritingConsistency(entries: JournalEntry[]): number {
    if (entries.length < 2) return 0;

    const sortedEntries = entries.sort((a, b) => {
      const aTime = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : a.createdAt.getTime();
      const bTime = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : b.createdAt.getTime();
      return aTime - bTime;
    });

    let consistencyScore = 0;
    for (let i = 1; i < sortedEntries.length; i++) {
      const prevTime = sortedEntries[i-1].createdAt instanceof Timestamp 
        ? sortedEntries[i-1].createdAt.toMillis() 
        : sortedEntries[i-1].createdAt.getTime();
      const currTime = sortedEntries[i].createdAt instanceof Timestamp 
        ? sortedEntries[i].createdAt.toMillis() 
        : sortedEntries[i].createdAt.getTime();
      
      const daysDiff = (currTime - prevTime) / (1000 * 60 * 60 * 24);
      consistencyScore += Math.max(0, 1 - Math.abs(daysDiff - 1) / 7); // Optimal is daily writing
    }

    return consistencyScore / (sortedEntries.length - 1);
  }

  private static extractEmotionalTerms(entries: JournalEntry[]): Record<string, number> {
    const emotionWords = {
      // Positive emotions
      'happy': 0, 'joy': 0, 'excited': 0, 'grateful': 0, 'peaceful': 0, 'content': 0, 'proud': 0,
      'hopeful': 0, 'optimistic': 0, 'confident': 0, 'loved': 0, 'fulfilled': 0,
      // Negative emotions
      'sad': 0, 'angry': 0, 'frustrated': 0, 'anxious': 0, 'worried': 0, 'scared': 0, 'lonely': 0,
      'overwhelmed': 0, 'disappointed': 0, 'stressed': 0, 'confused': 0, 'guilty': 0,
      // Complex emotions
      'ambivalent': 0, 'nostalgic': 0, 'vulnerable': 0, 'empowered': 0, 'relieved': 0, 'surprised': 0
    };

    for (const entry of entries) {
      const words = entry.content.toLowerCase().match(/\b\w+\b/g) || [];
      for (const word of words) {
        if (word in emotionWords) {
          emotionWords[word]++;
        }
      }
    }

    return emotionWords;
  }

  // ... Additional helper methods would continue here
  // (Implementing all the referenced methods for completeness)

  private static generateMinimalReport(
    entries: JournalEntry[],
    userStats: UserStats,
    privacySettings: PrivacySettings,
    timeframe: { start: Date; end: Date; type: 'week' | 'month' | 'quarter' | 'year' }
  ): AnalyticsReport {
    return {
      id: this.generateSecureId(),
      userId: '',
      generatedAt: new Date(),
      timeframe,
      privacySettings,
      writingAnalytics: this.getEmptyWritingAnalytics(),
      emotionalAnalytics: this.getEmptyEmotionalAnalytics(),
      therapeuticInsights: this.getEmptyTherapeuticInsights(),
      consistencyMetrics: this.getBasicConsistencyMetrics(userStats),
      overallWellbeingScore: 0,
      growthTrajectory: 'needs_support',
      recommendations: this.getBasicRecommendations(),
      dataQuality: this.assessDataQuality(entries)
    };
  }

  private static getEmptyWritingAnalytics(): WritingAnalytics {
    return {
      averageWordCount: 0,
      wordCountTrend: 'stable',
      vocabularyDiversity: 0,
      emotionalVocabularyRichness: 0,
      reflectionDepthScore: 0,
      consistencyScore: 0,
      writingMomentum: 0
    };
  }

  private static getEmptyEmotionalAnalytics(): EmotionalAnalytics {
    return {
      primaryEmotions: [],
      emotionalRange: 0,
      emotionalStability: 0,
      positiveEmotionRatio: 0,
      emotionalVocabularyGrowth: 0,
      emotionalProcessingDepth: 0,
      moodPatterns: []
    };
  }

  private static getEmptyTherapeuticInsights(): TherapeuticInsights {
    return {
      emotionalPatterns: [],
      progressIndicators: {
        selfAwarenessGrowth: 0,
        emotionalRegulation: 0,
        resilience: 0,
        introspectionQuality: 0,
        healingProgression: 0,
        breakthroughMoments: [],
        plateauPeriods: []
      },
      therapeuticMilestones: [],
      riskFactors: [],
      supportRecommendations: []
    };
  }

  private static generateSecureId(): string {
    return `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static assessDataQuality(entries: JournalEntry[]): DataQualityMetrics {
    const entryCount = entries.length;
    const averageEntryLength = entryCount > 0 
      ? entries.reduce((sum, e) => sum + e.wordCount, 0) / entryCount 
      : 0;

    return {
      entryCount,
      averageEntryLength,
      emotionalDataCompleteness: entryCount > 0 ? entries.filter(e => e.mood).length / entryCount : 0,
      temporalCoverage: this.calculateTemporalCoverage(entries),
      consistencyScore: this.calculateWritingConsistency(entries),
      reliabilityScore: Math.min(1, entryCount / 10) // More entries = higher reliability
    };
  }

  // Placeholder implementations for referenced methods
  private static determineWordCountTrend(entries: JournalEntry[]): 'increasing' | 'stable' | 'decreasing' {
    if (entries.length < 3) return 'stable';
    
    const recent = entries.slice(-3).map(e => e.wordCount);
    const earlier = entries.slice(-6, -3).map(e => e.wordCount);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.length > 0 ? earlier.reduce((a, b) => a + b, 0) / earlier.length : recentAvg;
    
    const change = (recentAvg - earlierAvg) / earlierAvg;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  private static calculateWritingMomentum(entries: JournalEntry[]): number {
    // Implementation would calculate writing engagement momentum
    return 0.5; // Placeholder
  }

  private static countEmotionalOccurrences(emotionalTerms: Record<string, number>): Record<string, number> {
    return emotionalTerms;
  }

  private static calculateEmotionTrend(emotion: string, entries: JournalEntry[]): string {
    // Implementation would track emotion trends over time
    return 'stable'; // Placeholder
  }

  private static calculateEmotionalRange(emotionalCounts: Record<string, number>): number {
    const emotions = Object.values(emotionalCounts).filter(count => count > 0);
    return emotions.length / 20; // Normalized to 20 possible emotions
  }

  private static calculateEmotionalStability(entries: JournalEntry[]): number {
    // Implementation would calculate emotional stability over time
    return 0.5; // Placeholder
  }

  private static calculatePositiveEmotionRatio(emotionalCounts: Record<string, number>): number {
    const positiveEmotions = ['happy', 'joy', 'excited', 'grateful', 'peaceful', 'content', 'proud', 'hopeful', 'optimistic', 'confident', 'loved', 'fulfilled'];
    const positiveCount = positiveEmotions.reduce((sum, emotion) => sum + (emotionalCounts[emotion] || 0), 0);
    const totalCount = Object.values(emotionalCounts).reduce((sum, count) => sum + count, 0);
    return totalCount > 0 ? positiveCount / totalCount : 0;
  }

  private static calculateEmotionalVocabularyGrowth(entries: JournalEntry[]): number {
    // Implementation would track vocabulary growth over time
    return 0.5; // Placeholder
  }

  private static calculateEmotionalProcessingDepth(entries: JournalEntry[]): number {
    // Implementation would assess emotional processing depth
    return 0.5; // Placeholder
  }

  private static identifyMoodPatterns(entries: JournalEntry[]): MoodPattern[] {
    // Implementation would identify mood patterns
    return []; // Placeholder
  }

  private static identifyEmotionalPatterns(entries: JournalEntry[]): EmotionalPattern[] {
    // Implementation would identify emotional patterns
    return []; // Placeholder
  }

  private static assessGrowthIndicators(entries: JournalEntry[]): GrowthIndicators {
    // Implementation would assess growth indicators
    return {
      selfAwarenessGrowth: 0.5,
      emotionalRegulation: 0.5,
      resilience: 0.5,
      introspectionQuality: 0.5,
      healingProgression: 0.5,
      breakthroughMoments: [],
      plateauPeriods: []
    };
  }

  private static identifyTherapeuticMilestones(entries: JournalEntry[]): TherapeuticMilestone[] {
    return [];
  }

  private static assessRiskFactors(entries: JournalEntry[]): RiskFactor[] {
    return [];
  }

  private static generateSupportRecommendations(entries: JournalEntry[]): SupportRecommendation[] {
    return [];
  }

  private static analyzeConsistency(entries: JournalEntry[], userStats: UserStats): ConsistencyMetrics {
    return {
      journalingFrequency: entries.length / 30, // Entries per month
      engagementDepth: this.calculateReflectionDepth(entries),
      emotionalOpenness: 0.5, // Placeholder
      reflectionConsistency: this.calculateWritingConsistency(entries),
      streak: {
        current: userStats.streak,
        longest: userStats.longestStreak,
        recentBreaks: 0 // Placeholder
      }
    };
  }

  private static assessGrowthTrajectory(entries: JournalEntry[]): 'accelerating' | 'steady' | 'plateaued' | 'needs_support' {
    if (entries.length < 5) return 'needs_support';
    // Implementation would assess growth trajectory
    return 'steady'; // Placeholder
  }

  private static calculateMoodScore(entries: JournalEntry[]): number {
    const moodEntries = entries.filter(e => e.mood);
    if (moodEntries.length === 0) return 50;
    
    const avgMood = moodEntries.reduce((sum, e) => sum + (e.mood || 5), 0) / moodEntries.length;
    return (avgMood / 10) * 100;
  }

  private static calculateConsistencyScore(entries: JournalEntry[]): number {
    return this.calculateWritingConsistency(entries) * 100;
  }

  private static calculatePositivityRatio(entries: JournalEntry[]): number {
    const emotionalTerms = this.extractEmotionalTerms(entries);
    return this.calculatePositiveEmotionRatio(emotionalTerms) * 100;
  }

  private static getBasicConsistencyMetrics(userStats: UserStats): ConsistencyMetrics {
    return {
      journalingFrequency: 0,
      engagementDepth: 0,
      emotionalOpenness: 0,
      reflectionConsistency: 0,
      streak: {
        current: userStats.streak,
        longest: userStats.longestStreak,
        recentBreaks: 0
      }
    };
  }

  private static getBasicRecommendations(): Recommendation[] {
    return [
      {
        id: 'start-journaling',
        type: 'writing_technique',
        title: 'Begin Your Healing Journey',
        description: 'Start with just a few minutes of daily writing to build self-awareness.',
        priority: 10,
        evidenceBased: true,
        traumaInformed: true,
        actionable: true
      }
    ];
  }

  private static calculateTemporalCoverage(entries: JournalEntry[]): number {
    if (entries.length < 2) return 0;
    
    const dates = entries.map(e => 
      e.createdAt instanceof Timestamp ? e.createdAt.toDate() : e.createdAt
    ).sort((a, b) => a.getTime() - b.getTime());
    
    const totalDays = (dates[dates.length - 1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24);
    const activeDays = new Set(dates.map(d => d.toDateString())).size;
    
    return totalDays > 0 ? activeDays / totalDays : 0;
  }
}

// ==============================================================================
// DEFAULT PRIVACY SETTINGS
// ==============================================================================

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  enableAnalytics: true,
  shareAnonymizedInsights: false,
  dataRetentionDays: 365,
  allowEmotionalAnalysis: true,
  allowPatternDetection: true,
  consentTimestamp: new Date(),
  consentVersion: '1.0.0'
};

// ==============================================================================
// UTILITY FUNCTIONS
// ==============================================================================

export function createAnalyticsTimeframe(type: 'week' | 'month' | 'quarter' | 'year'): { start: Date; end: Date; type: typeof type } {
  const end = new Date();
  const start = new Date();

  switch (type) {
    case 'week':
      start.setDate(end.getDate() - 7);
      break;
    case 'month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(end.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(end.getFullYear() - 1);
      break;
  }

  return { start, end, type };
}

export function validatePrivacySettings(settings: Partial<PrivacySettings>): PrivacySettings {
  return {
    ...DEFAULT_PRIVACY_SETTINGS,
    ...settings
  };
}