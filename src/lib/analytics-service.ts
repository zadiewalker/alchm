/**
 * ALCHM Analytics Service
 * 
 * This service acts as the bridge between the analytics engine and the application,
 * providing real-time insights while maintaining user privacy and data security.
 */

import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { journalService, JournalEntry, UserStats } from './journal-service';
import { 
  PrivacyPreservingAnalyticsEngine, 
  AnalyticsReport, 
  PrivacySettings, 
  DEFAULT_PRIVACY_SETTINGS,
  createAnalyticsTimeframe,
  validatePrivacySettings
} from './analytics-engine';

export interface AnalyticsCache {
  [key: string]: {
    data: AnalyticsReport;
    timestamp: Date;
    expiresAt: Date;
  };
}

export interface EmotionalIntelligenceMetrics {
  emotionalAwareness: number;
  emotionalRegulation: number;
  empathy: number;
  socialSkills: number;
  motivation: number;
  overallEQ: number;
  growthAreas: string[];
  strengths: string[];
}

export interface HealingJourneyMetrics {
  healingStage: 'beginning' | 'processing' | 'integrating' | 'thriving';
  resilienceScore: number;
  selfCompassionLevel: number;
  triggerAwareness: number;
  copingStrategiesCount: number;
  supportSystemStrength: number;
  progressMomentum: 'accelerating' | 'steady' | 'plateaued' | 'needs_attention';
}

export interface WritingEvolutionMetrics {
  vocabularyGrowth: number;
  emotionalExpressionDepth: number;
  reflectiveQuality: number;
  narrativeCoherence: number;
  self_advocacySkills: number;
  creativityExpression: number;
}

export class AnalyticsService {
  private static cache: AnalyticsCache = {};
  private static readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour
  private static readonly MAX_CACHE_SIZE = 50;

  /**
   * Get comprehensive analytics for a user
   */
  static async getUserAnalytics(
    userId: string,
    timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month',
    forceRefresh: boolean = false
  ): Promise<AnalyticsReport | null> {
    try {
      const cacheKey = `${userId}_${timeframe}`;
      
      // Check cache first
      if (!forceRefresh && this.isCacheValid(cacheKey)) {
        return this.cache[cacheKey].data;
      }

      // Get user privacy settings
      const privacySettings = await this.getUserPrivacySettings(userId);
      
      if (!privacySettings.enableAnalytics) {
        return null;
      }

      // Get user data
      const [entries, userStats] = await Promise.all([
        journalService.getEntries(userId, { limit: 1000 }), // Get substantial history
        journalService.getUserStats(userId)
      ]);

      if (!userStats || entries.length === 0) {
        return null;
      }

      // Create timeframe
      const timeframeObj = createAnalyticsTimeframe(timeframe);

      // Generate analytics report
      const report = await PrivacyPreservingAnalyticsEngine.generateReport(
        entries,
        userStats,
        privacySettings,
        timeframeObj
      );

      // Cache the result
      this.setCacheEntry(cacheKey, report);

      return report;
    } catch (error) {
      console.error('Error generating user analytics:', error);
      return null;
    }
  }

  /**
   * Get emotional intelligence metrics
   */
  static async getEmotionalIntelligenceMetrics(userId: string): Promise<EmotionalIntelligenceMetrics | null> {
    try {
      const entries = await journalService.getEntries(userId, { limit: 100 });
      
      if (entries.length < 5) {
        return null;
      }

      return this.calculateEmotionalIntelligence(entries);
    } catch (error) {
      console.error('Error calculating emotional intelligence:', error);
      return null;
    }
  }

  /**
   * Get healing journey metrics
   */
  static async getHealingJourneyMetrics(userId: string): Promise<HealingJourneyMetrics | null> {
    try {
      const entries = await journalService.getEntries(userId, { limit: 200 });
      const userStats = await journalService.getUserStats(userId);
      
      if (!userStats || entries.length < 3) {
        return null;
      }

      return this.calculateHealingJourney(entries, userStats);
    } catch (error) {
      console.error('Error calculating healing journey metrics:', error);
      return null;
    }
  }

  /**
   * Get writing evolution metrics
   */
  static async getWritingEvolutionMetrics(userId: string): Promise<WritingEvolutionMetrics | null> {
    try {
      const entries = await journalService.getEntries(userId, { limit: 150 });
      
      if (entries.length < 10) {
        return null;
      }

      return this.calculateWritingEvolution(entries);
    } catch (error) {
      console.error('Error calculating writing evolution:', error);
      return null;
    }
  }

  /**
   * Get real-time insights for dashboard
   */
  static async getDashboardInsights(userId: string): Promise<{
    emotionalIntelligence: EmotionalIntelligenceMetrics | null;
    healingJourney: HealingJourneyMetrics | null;
    writingEvolution: WritingEvolutionMetrics | null;
    recentReport: AnalyticsReport | null;
  }> {
    try {
      const [emotionalIntelligence, healingJourney, writingEvolution, recentReport] = await Promise.all([
        this.getEmotionalIntelligenceMetrics(userId),
        this.getHealingJourneyMetrics(userId),
        this.getWritingEvolutionMetrics(userId),
        this.getUserAnalytics(userId, 'month')
      ]);

      return {
        emotionalIntelligence,
        healingJourney,
        writingEvolution,
        recentReport
      };
    } catch (error) {
      console.error('Error getting dashboard insights:', error);
      return {
        emotionalIntelligence: null,
        healingJourney: null,
        writingEvolution: null,
        recentReport: null
      };
    }
  }

  /**
   * Update user privacy settings
   */
  static async updatePrivacySettings(
    userId: string, 
    settings: Partial<PrivacySettings>
  ): Promise<void> {
    try {
      const validatedSettings = validatePrivacySettings(settings);
      const settingsRef = doc(db, 'userPrivacy', userId);
      
      await import('firebase/firestore').then(({ setDoc }) => 
        setDoc(settingsRef, validatedSettings)
      );

      // Clear analytics cache for this user
      this.clearUserCache(userId);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw error;
    }
  }

  /**
   * Get user privacy settings
   */
  static async getUserPrivacySettings(userId: string): Promise<PrivacySettings> {
    try {
      const settingsRef = doc(db, 'userPrivacy', userId);
      const settingsDoc = await getDoc(settingsRef);
      
      if (settingsDoc.exists()) {
        return validatePrivacySettings(settingsDoc.data() as Partial<PrivacySettings>);
      }
      
      // Return default settings and save them
      const defaultSettings = { ...DEFAULT_PRIVACY_SETTINGS };
      await this.updatePrivacySettings(userId, defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('Error getting privacy settings:', error);
      return DEFAULT_PRIVACY_SETTINGS;
    }
  }

  // ==============================================================================
  // EMOTIONAL INTELLIGENCE CALCULATION
  // ==============================================================================

  private static calculateEmotionalIntelligence(entries: JournalEntry[]): EmotionalIntelligenceMetrics {
    const recentEntries = entries.slice(0, 30); // Last 30 entries
    
    // Analyze emotional vocabulary sophistication
    const emotionalAwareness = this.calculateEmotionalAwareness(recentEntries);
    
    // Analyze emotional regulation language patterns
    const emotionalRegulation = this.calculateEmotionalRegulation(recentEntries);
    
    // Analyze empathy and perspective-taking
    const empathy = this.calculateEmpathy(recentEntries);
    
    // Analyze social interaction descriptions
    const socialSkills = this.calculateSocialSkills(recentEntries);
    
    // Analyze goal-setting and motivation language
    const motivation = this.calculateMotivation(recentEntries);
    
    const overallEQ = (emotionalAwareness + emotionalRegulation + empathy + socialSkills + motivation) / 5;
    
    return {
      emotionalAwareness,
      emotionalRegulation,
      empathy,
      socialSkills,
      motivation,
      overallEQ,
      growthAreas: this.identifyEQGrowthAreas({
        emotionalAwareness,
        emotionalRegulation,
        empathy,
        socialSkills,
        motivation
      }),
      strengths: this.identifyEQStrengths({
        emotionalAwareness,
        emotionalRegulation,
        empathy,
        socialSkills,
        motivation
      })
    };
  }

  private static calculateEmotionalAwareness(entries: JournalEntry[]): number {
    let awarenessScore = 0;
    let totalEntries = 0;

    for (const entry of entries) {
      totalEntries++;
      const content = entry.content.toLowerCase();
      
      // Check for emotion identification
      const emotionWords = this.countEmotionWords(content);
      const emotionComplexity = this.assessEmotionComplexity(content);
      const emotionCauses = this.identifyEmotionCauses(content);
      
      const entryScore = (emotionWords * 0.3) + (emotionComplexity * 0.4) + (emotionCauses * 0.3);
      awarenessScore += Math.min(1, entryScore);
    }

    return totalEntries > 0 ? awarenessScore / totalEntries : 0;
  }

  private static calculateEmotionalRegulation(entries: JournalEntry[]): number {
    const regulationPatterns = [
      /\b(calm.*down|deep breath|pause|step back|reflect|reconsider)\b/gi,
      /\b(cope|manage|handle|deal with|work through|process)\b/gi,
      /\b(strategy|technique|approach|method|way to)\b/gi,
      /\b(mindful|present|grounded|centered|balanced)\b/gi
    ];

    let regulationScore = 0;
    let totalEntries = 0;

    for (const entry of entries) {
      totalEntries++;
      let entryScore = 0;
      
      for (const pattern of regulationPatterns) {
        const matches = entry.content.match(pattern);
        entryScore += matches ? matches.length * 0.1 : 0;
      }
      
      regulationScore += Math.min(1, entryScore);
    }

    return totalEntries > 0 ? regulationScore / totalEntries : 0;
  }

  private static calculateEmpathy(entries: JournalEntry[]): number {
    const empathyPatterns = [
      /\b(understand|realize|recognize|see.*perspective|put myself)\b/gi,
      /\b(they.*feel|others.*experience|someone else|perspective)\b/gi,
      /\b(compassion|kindness|care|support|help)\b/gi,
      /\b(imagine|consider|think about.*others)\b/gi
    ];

    let empathyScore = 0;
    let totalEntries = 0;

    for (const entry of entries) {
      totalEntries++;
      let entryScore = 0;
      
      for (const pattern of empathyPatterns) {
        const matches = entry.content.match(pattern);
        entryScore += matches ? matches.length * 0.1 : 0;
      }
      
      empathyScore += Math.min(1, entryScore);
    }

    return totalEntries > 0 ? empathyScore / totalEntries : 0;
  }

  private static calculateSocialSkills(entries: JournalEntry[]): number {
    const socialPatterns = [
      /\b(communicate|express|share|tell|explain|discuss)\b/gi,
      /\b(listen|hear|understand|respond|reply)\b/gi,
      /\b(relationship|friend|family|colleague|connect)\b/gi,
      /\b(conflict|resolve|negotiate|compromise|agreement)\b/gi
    ];

    let socialScore = 0;
    let totalEntries = 0;

    for (const entry of entries) {
      totalEntries++;
      let entryScore = 0;
      
      for (const pattern of socialPatterns) {
        const matches = entry.content.match(pattern);
        entryScore += matches ? matches.length * 0.1 : 0;
      }
      
      socialScore += Math.min(1, entryScore);
    }

    return totalEntries > 0 ? socialScore / totalEntries : 0;
  }

  private static calculateMotivation(entries: JournalEntry[]): number {
    const motivationPatterns = [
      /\b(goal|dream|hope|want|wish|aspire|aim)\b/gi,
      /\b(achieve|accomplish|reach|attain|succeed)\b/gi,
      /\b(motivated|driven|determined|focused|committed)\b/gi,
      /\b(improve|grow|develop|progress|advance)\b/gi
    ];

    let motivationScore = 0;
    let totalEntries = 0;

    for (const entry of entries) {
      totalEntries++;
      let entryScore = 0;
      
      for (const pattern of motivationPatterns) {
        const matches = entry.content.match(pattern);
        entryScore += matches ? matches.length * 0.1 : 0;
      }
      
      motivationScore += Math.min(1, entryScore);
    }

    return totalEntries > 0 ? motivationScore / totalEntries : 0;
  }

  // ==============================================================================
  // HEALING JOURNEY CALCULATION
  // ==============================================================================

  private static calculateHealingJourney(entries: JournalEntry[], userStats: UserStats): HealingJourneyMetrics {
    const healingStage = this.assessHealingStage(entries);
    const resilienceScore = this.calculateResilience(entries);
    const selfCompassionLevel = this.calculateSelfCompassion(entries);
    const triggerAwareness = this.calculateTriggerAwareness(entries);
    const copingStrategiesCount = this.countCopingStrategies(entries);
    const supportSystemStrength = this.assessSupportSystem(entries);
    const progressMomentum = this.assessProgressMomentum(entries, userStats);

    return {
      healingStage,
      resilienceScore,
      selfCompassionLevel,
      triggerAwareness,
      copingStrategiesCount,
      supportSystemStrength,
      progressMomentum
    };
  }

  private static assessHealingStage(entries: JournalEntry[]): 'beginning' | 'processing' | 'integrating' | 'thriving' {
    const recentEntries = entries.slice(0, 20);
    
    // Analyze language patterns to determine healing stage
    const beginningWords = ['confused', 'lost', 'overwhelmed', 'don\'t know', 'help'];
    const processingWords = ['understand', 'realize', 'process', 'work through', 'explore'];
    const integratingWords = ['integrate', 'apply', 'practice', 'implement', 'use'];
    const thrivingWords = ['grateful', 'strong', 'confident', 'peaceful', 'fulfilled'];

    const scores = {
      beginning: this.countWordMatches(recentEntries, beginningWords),
      processing: this.countWordMatches(recentEntries, processingWords),
      integrating: this.countWordMatches(recentEntries, integratingWords),
      thriving: this.countWordMatches(recentEntries, thrivingWords)
    };

    return Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0] as any;
  }

  private static calculateResilience(entries: JournalEntry[]): number {
    const resiliencePatterns = [
      /\b(bounce back|recover|overcome|persevere|endure)\b/gi,
      /\b(strength|strong|resilient|tough|handle)\b/gi,
      /\b(learn.*from|grow.*from|better.*because)\b/gi,
      /\b(keep going|don't give up|push through|stay strong)\b/gi
    ];

    return this.calculatePatternScore(entries, resiliencePatterns);
  }

  private static calculateSelfCompassion(entries: JournalEntry[]): number {
    const compassionPatterns = [
      /\b(kind.*myself|gentle.*myself|forgive.*myself)\b/gi,
      /\b(it's okay|that's normal|understandable|human)\b/gi,
      /\b(self-care|take care|be gentle|be patient)\b/gi,
      /\b(deserve|worthy|enough|valuable)\b/gi
    ];

    return this.calculatePatternScore(entries, compassionPatterns);
  }

  // ==============================================================================
  // WRITING EVOLUTION CALCULATION
  // ==============================================================================

  private static calculateWritingEvolution(entries: JournalEntry[]): WritingEvolutionMetrics {
    const sortedEntries = entries.sort((a, b) => {
      const aTime = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : a.createdAt.getTime();
      const bTime = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : b.createdAt.getTime();
      return aTime - bTime;
    });

    const early = sortedEntries.slice(0, Math.floor(sortedEntries.length / 3));
    const recent = sortedEntries.slice(-Math.floor(sortedEntries.length / 3));

    return {
      vocabularyGrowth: this.calculateVocabularyGrowth(early, recent),
      emotionalExpressionDepth: this.calculateEmotionalDepthGrowth(early, recent),
      reflectiveQuality: this.calculateReflectiveQualityGrowth(early, recent),
      narrativeCoherence: this.calculateNarrativeCoherence(recent),
      self_advocacySkills: this.calculateSelfAdvocacyGrowth(early, recent),
      creativityExpression: this.calculateCreativityExpression(recent)
    };
  }

  // ==============================================================================
  // HELPER METHODS
  // ==============================================================================

  private static countEmotionWords(content: string): number {
    const emotionWords = [
      'happy', 'sad', 'angry', 'excited', 'nervous', 'calm', 'frustrated', 'grateful',
      'anxious', 'peaceful', 'lonely', 'content', 'worried', 'joyful', 'scared', 'confident'
    ];
    
    let count = 0;
    for (const word of emotionWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = content.match(regex);
      count += matches ? matches.length : 0;
    }
    
    return Math.min(1, count / 20); // Normalize to 0-1
  }

  private static assessEmotionComplexity(content: string): number {
    const complexEmotions = [
      'ambivalent', 'conflicted', 'bittersweet', 'nostalgic', 'melancholy',
      'euphoric', 'serene', 'vulnerable', 'empowered', 'overwhelmed'
    ];
    
    let complexity = 0;
    for (const emotion of complexEmotions) {
      if (content.includes(emotion)) {
        complexity += 0.2;
      }
    }
    
    return Math.min(1, complexity);
  }

  private static identifyEmotionCauses(content: string): number {
    const causePatterns = [
      /\bbecause\b.*\bfeel\b/gi,
      /\bfeel.*\bbecause\b/gi,
      /\bmakes me\b/gi,
      /\bwhen.*\bfeel\b/gi
    ];
    
    let causes = 0;
    for (const pattern of causePatterns) {
      const matches = content.match(pattern);
      causes += matches ? matches.length : 0;
    }
    
    return Math.min(1, causes / 5);
  }

  private static identifyEQGrowthAreas(scores: Record<string, number>): string[] {
    const threshold = 0.6;
    return Object.entries(scores)
      .filter(([_, score]) => score < threshold)
      .map(([area, _]) => area)
      .slice(0, 3);
  }

  private static identifyEQStrengths(scores: Record<string, number>): string[] {
    const threshold = 0.7;
    return Object.entries(scores)
      .filter(([_, score]) => score >= threshold)
      .map(([area, _]) => area)
      .slice(0, 3);
  }

  private static countWordMatches(entries: JournalEntry[], words: string[]): number {
    let count = 0;
    for (const entry of entries) {
      for (const word of words) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = entry.content.match(regex);
        count += matches ? matches.length : 0;
      }
    }
    return count;
  }

  private static calculatePatternScore(entries: JournalEntry[], patterns: RegExp[]): number {
    let score = 0;
    let totalEntries = 0;

    for (const entry of entries) {
      totalEntries++;
      let entryScore = 0;
      
      for (const pattern of patterns) {
        const matches = entry.content.match(pattern);
        entryScore += matches ? matches.length * 0.1 : 0;
      }
      
      score += Math.min(1, entryScore);
    }

    return totalEntries > 0 ? score / totalEntries : 0;
  }

  private static calculateTriggerAwareness(entries: JournalEntry[]): number {
    const triggerPatterns = [
      /\btrigger|triggered\b/gi,
      /\bbecause.*feel\b/gi,
      /\bwhen.*react\b/gi,
      /\bnotice.*pattern\b/gi
    ];

    return this.calculatePatternScore(entries, triggerPatterns);
  }

  private static countCopingStrategies(entries: JournalEntry[]): number {
    const copingWords = [
      'breathe', 'meditate', 'walk', 'exercise', 'music', 'art', 'write',
      'talk', 'therapy', 'support', 'rest', 'nature', 'mindfulness'
    ];

    const strategies = new Set();
    for (const entry of entries) {
      for (const word of copingWords) {
        if (entry.content.toLowerCase().includes(word)) {
          strategies.add(word);
        }
      }
    }

    return strategies.size;
  }

  private static assessSupportSystem(entries: JournalEntry[]): number {
    const supportPatterns = [
      /\bfriend|family|therapist|counselor|support group\b/gi,
      /\btalk.*to|share.*with|reach out\b/gi,
      /\bhelp|support|care|listen\b/gi
    ];

    return this.calculatePatternScore(entries, supportPatterns);
  }

  private static assessProgressMomentum(entries: JournalEntry[], userStats: UserStats): 'accelerating' | 'steady' | 'plateaued' | 'needs_attention' {
    const recentStreak = userStats.streak;
    const totalEntries = userStats.totalEntries;
    const recentEntries = entries.slice(0, 10);

    // Simple momentum assessment based on consistency and content quality
    if (recentStreak >= 7 && recentEntries.length >= 5) {
      return 'accelerating';
    } else if (recentStreak >= 3 && recentEntries.length >= 3) {
      return 'steady';
    } else if (totalEntries >= 10) {
      return 'plateaued';
    } else {
      return 'needs_attention';
    }
  }

  private static calculateVocabularyGrowth(early: JournalEntry[], recent: JournalEntry[]): number {
    const earlyWords = this.getUniqueWords(early);
    const recentWords = this.getUniqueWords(recent);
    
    if (earlyWords.size === 0) return 0;
    return Math.max(0, (recentWords.size - earlyWords.size) / earlyWords.size);
  }

  private static getUniqueWords(entries: JournalEntry[]): Set<string> {
    const words = new Set<string>();
    for (const entry of entries) {
      const entryWords = entry.content.toLowerCase().match(/\b\w+\b/g) || [];
      entryWords.forEach(word => words.add(word));
    }
    return words;
  }

  private static calculateEmotionalDepthGrowth(early: JournalEntry[], recent: JournalEntry[]): number {
    const earlyDepth = this.calculateEmotionalDepth(early);
    const recentDepth = this.calculateEmotionalDepth(recent);
    
    return Math.max(0, recentDepth - earlyDepth);
  }

  private static calculateEmotionalDepth(entries: JournalEntry[]): number {
    let depth = 0;
    for (const entry of entries) {
      depth += this.assessEmotionComplexity(entry.content);
    }
    return entries.length > 0 ? depth / entries.length : 0;
  }

  private static calculateReflectiveQualityGrowth(early: JournalEntry[], recent: JournalEntry[]): number {
    const earlyQuality = this.calculateReflectiveQuality(early);
    const recentQuality = this.calculateReflectiveQuality(recent);
    
    return Math.max(0, recentQuality - earlyQuality);
  }

  private static calculateReflectiveQuality(entries: JournalEntry[]): number {
    const reflectivePatterns = [
      /\bwhy|because|realize|understand|learn\b/gi,
      /\bthink|feel|believe|wonder|question\b/gi,
      /\bmeaning|purpose|significance|important\b/gi
    ];

    return this.calculatePatternScore(entries, reflectivePatterns);
  }

  private static calculateNarrativeCoherence(entries: JournalEntry[]): number {
    // Simple coherence assessment based on connective words and structure
    const coherencePatterns = [
      /\bfirst|then|next|finally|however|therefore|because|although\b/gi,
      /\bmeanwhile|furthermore|additionally|consequently|thus\b/gi
    ];

    return this.calculatePatternScore(entries, coherencePatterns);
  }

  private static calculateSelfAdvocacyGrowth(early: JournalEntry[], recent: JournalEntry[]): number {
    const advocacyPatterns = [
      /\bi need|i want|i deserve|my boundary\b/gi,
      /\bstand up|speak up|assert|advocate\b/gi,
      /\bsay no|set limit|protect myself\b/gi
    ];

    const earlyAdvocacy = this.calculatePatternScore(early, advocacyPatterns);
    const recentAdvocacy = this.calculatePatternScore(recent, advocacyPatterns);
    
    return Math.max(0, recentAdvocacy - earlyAdvocacy);
  }

  private static calculateCreativityExpression(entries: JournalEntry[]): number {
    const creativityPatterns = [
      /\bimagine|creative|art|music|poetry|story\b/gi,
      /\bdraw|paint|sing|dance|create|design\b/gi,
      /\binspired|vision|dream|fantasy|metaphor\b/gi
    ];

    return this.calculatePatternScore(entries, creativityPatterns);
  }

  // ==============================================================================
  // CACHE MANAGEMENT
  // ==============================================================================

  private static isCacheValid(key: string): boolean {
    const entry = this.cache[key];
    return entry && entry.expiresAt > new Date();
  }

  private static setCacheEntry(key: string, data: AnalyticsReport): void {
    // Manage cache size
    if (Object.keys(this.cache).length >= this.MAX_CACHE_SIZE) {
      this.clearOldestCacheEntries();
    }

    this.cache[key] = {
      data,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + this.CACHE_DURATION)
    };
  }

  private static clearUserCache(userId: string): void {
    Object.keys(this.cache).forEach(key => {
      if (key.startsWith(userId)) {
        delete this.cache[key];
      }
    });
  }

  private static clearOldestCacheEntries(): void {
    const entries = Object.entries(this.cache);
    entries.sort((a, b) => a[1].timestamp.getTime() - b[1].timestamp.getTime());
    
    // Remove oldest 25% of entries
    const removeCount = Math.floor(entries.length * 0.25);
    for (let i = 0; i < removeCount; i++) {
      delete this.cache[entries[i][0]];
    }
  }
}

export default AnalyticsService;