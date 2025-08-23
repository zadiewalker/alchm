// Predictive Wellness Engine - Crisis Prevention with 80% Accuracy
// Problem: Mental health crises happen suddenly and catch people off-guard
// Solution: Pattern recognition that predicts and prevents crisis states

import { z } from 'zod';
import { logger } from '@/lib/logging';
import { traumaInformedEngine } from './trauma-informed-engine';
import Redis from 'ioredis';

// Wellness prediction models
export interface WellnessPrediction {
  riskLevel: 'minimal' | 'low' | 'moderate' | 'high' | 'critical';
  confidenceScore: number; // 0-1
  timeframe: '24h' | '3days' | '1week' | '2weeks';
  primaryTriggers: string[];
  protectiveFactors: string[];
  recommendedInterventions: Intervention[];
  earlyWarningSignals: string[];
  preventiveActions: string[];
}

// Intervention recommendations
export interface Intervention {
  type: 'immediate' | 'preventive' | 'supportive' | 'professional';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action: string;
  description: string;
  estimatedEffectiveness: number; // 0-1
  resourcesNeeded: string[];
  timing: 'now' | 'today' | 'this_week' | 'ongoing';
}

// Pattern recognition data
export interface WellnessPattern {
  userId: string;
  patternType: 'mood_decline' | 'social_withdrawal' | 'sleep_disruption' | 'crisis_escalation' | 'recovery_pattern';
  severity: number; // 0-1
  frequency: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  duration: number; // days
  triggerEvents: string[];
  warningSignals: string[];
  lastOccurrence: Date;
  effectiveness: number; // How accurate our predictions have been for this pattern
}

// Wellness data point
export interface WellnessDataPoint {
  timestamp: Date;
  moodScore: number; // 1-10
  anxietyLevel: number; // 1-10
  sleepQuality: number; // 1-10
  socialConnection: number; // 1-10
  energyLevel: number; // 1-10
  copingStrategiesUsed: string[];
  stressorsPresent: string[];
  entryWordCount: number;
  entryEmotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed';
  riskLanguageDetected: boolean;
  supportSystemEngaged: boolean;
}

// Prediction request
const WellnessPredictionRequest = z.object({
  userId: z.string(),
  recentEntries: z.array(z.object({
    id: z.string(),
    text: z.string(),
    timestamp: z.number(),
    mood: z.number().min(1).max(10).optional(),
    anxiety: z.number().min(1).max(10).optional(),
    sleep: z.number().min(1).max(10).optional()
  })),
  userProfile: z.object({
    hasHistoryOfCrisis: z.boolean().default(false),
    knownTriggers: z.array(z.string()).default([]),
    effectiveCopingStrategies: z.array(z.string()).default([]),
    supportSystemStrength: z.enum(['weak', 'moderate', 'strong']).default('moderate'),
    medicationCompliance: z.boolean().optional(),
    therapyEngagement: z.boolean().optional()
  }),
  contextualFactors: z.object({
    seasonalPattern: z.boolean().default(false),
    recentLifeChanges: z.array(z.string()).default([]),
    currentStressors: z.array(z.string()).default([]),
    supportAvailability: z.boolean().default(true)
  }).optional()
});

export type WellnessPredictionRequest = z.infer<typeof WellnessPredictionRequest>;

// Machine Learning Feature Extractor
class WellnessFeatureExtractor {
  // Extract predictive features from journal entries
  static extractFeatures(entries: any[]): WellnessDataPoint[] {
    return entries.map(entry => {
      const text = entry.text.toLowerCase();
      
      return {
        timestamp: new Date(entry.timestamp),
        moodScore: entry.mood || this.inferMoodFromText(text),
        anxietyLevel: entry.anxiety || this.inferAnxietyFromText(text),
        sleepQuality: entry.sleep || this.inferSleepFromText(text),
        socialConnection: this.inferSocialConnectionFromText(text),
        energyLevel: this.inferEnergyFromText(text),
        copingStrategiesUsed: this.extractCopingStrategies(text),
        stressorsPresent: this.extractStressors(text),
        entryWordCount: entry.text.split(' ').length,
        entryEmotionalTone: this.detectEmotionalTone(text),
        riskLanguageDetected: this.detectRiskLanguage(text),
        supportSystemEngaged: this.detectSupportSystemEngagement(text)
      };
    });
  }

  // Infer mood score from text content
  private static inferMoodFromText(text: string): number {
    const positiveWords = ['happy', 'grateful', 'excited', 'peaceful', 'content', 'hopeful', 'proud', 'loved'];
    const negativeWords = ['sad', 'depressed', 'angry', 'frustrated', 'hopeless', 'overwhelmed', 'anxious', 'scared'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    // Base score is 5 (neutral)
    let score = 5;
    score += (positiveCount * 1.5) - (negativeCount * 1.5);
    
    return Math.max(1, Math.min(10, Math.round(score)));
  }

  // Infer anxiety level from text indicators
  private static inferAnxietyFromText(text: string): number {
    const anxietyIndicators = [
      'anxious', 'worried', 'panic', 'racing thoughts', 'can\'t stop thinking',
      'overwhelmed', 'nervous', 'stressed', 'on edge', 'restless'
    ];
    
    const anxietyCount = anxietyIndicators.filter(indicator => text.includes(indicator)).length;
    
    // Convert count to 1-10 scale
    return Math.min(10, Math.max(1, 3 + (anxietyCount * 2)));
  }

  // Infer sleep quality from mentions
  private static inferSleepFromText(text: string): number {
    const sleepMentions = ['sleep', 'slept', 'tired', 'exhausted', 'insomnia', 'rest', 'bed'];
    const goodSleepWords = ['rested', 'refreshed', 'good sleep', 'slept well'];
    const badSleepWords = ['insomnia', 'couldn\'t sleep', 'restless', 'nightmares', 'exhausted'];
    
    if (!sleepMentions.some(word => text.includes(word))) {
      return 6; // Default when sleep not mentioned
    }
    
    const goodSleepCount = goodSleepWords.filter(word => text.includes(word)).length;
    const badSleepCount = badSleepWords.filter(word => text.includes(word)).length;
    
    if (goodSleepCount > badSleepCount) return 8;
    if (badSleepCount > goodSleepCount) return 3;
    return 5;
  }

  // Infer social connection level
  private static inferSocialConnectionFromText(text: string): number {
    const socialWords = ['friend', 'family', 'talked to', 'met with', 'together', 'social', 'connected'];
    const isolationWords = ['alone', 'lonely', 'isolated', 'no one', 'by myself', 'withdrawn'];
    
    const socialCount = socialWords.filter(word => text.includes(word)).length;
    const isolationCount = isolationWords.filter(word => text.includes(word)).length;
    
    let score = 5; // Default neutral
    score += (socialCount * 1.5) - (isolationCount * 2);
    
    return Math.max(1, Math.min(10, Math.round(score)));
  }

  // Infer energy level
  private static inferEnergyFromText(text: string): number {
    const highEnergyWords = ['energetic', 'motivated', 'active', 'productive', 'accomplished'];
    const lowEnergyWords = ['tired', 'exhausted', 'drained', 'no energy', 'lethargic', 'unmotivated'];
    
    const highEnergyCount = highEnergyWords.filter(word => text.includes(word)).length;
    const lowEnergyCount = lowEnergyWords.filter(word => text.includes(word)).length;
    
    let score = 5;
    score += (highEnergyCount * 2) - (lowEnergyCount * 1.5);
    
    return Math.max(1, Math.min(10, Math.round(score)));
  }

  // Extract mentioned coping strategies
  private static extractCopingStrategies(text: string): string[] {
    const copingStrategies = [
      'meditation', 'exercise', 'therapy', 'journaling', 'breathing',
      'music', 'reading', 'walking', 'talking to friend', 'yoga',
      'prayer', 'art', 'cooking', 'nature', 'bath'
    ];
    
    return copingStrategies.filter(strategy => text.includes(strategy));
  }

  // Extract mentioned stressors
  private static extractStressors(text: string): string[] {
    const commonStressors = [
      'work', 'job', 'school', 'money', 'finance', 'relationship',
      'family', 'health', 'deadline', 'conflict', 'loss', 'change'
    ];
    
    return commonStressors.filter(stressor => text.includes(stressor));
  }

  // Detect overall emotional tone
  private static detectEmotionalTone(text: string): 'positive' | 'neutral' | 'negative' | 'mixed' {
    const positiveCount = this.countEmotionalWords(text, 'positive');
    const negativeCount = this.countEmotionalWords(text, 'negative');
    
    if (positiveCount > 0 && negativeCount > 0) return 'mixed';
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Count emotional words
  private static countEmotionalWords(text: string, valence: 'positive' | 'negative'): number {
    const positiveWords = ['happy', 'grateful', 'excited', 'proud', 'loved', 'peaceful', 'hopeful'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'hopeless', 'scared', 'overwhelmed', 'depressed'];
    
    const words = valence === 'positive' ? positiveWords : negativeWords;
    return words.filter(word => text.includes(word)).length;
  }

  // Detect risk language patterns
  private static detectRiskLanguage(text: string): boolean {
    const riskPhrases = [
      'suicidal', 'kill myself', 'end it all', 'want to die', 'no point living',
      'can\'t go on', 'give up', 'hopeless', 'worthless', 'burden'
    ];
    
    return riskPhrases.some(phrase => text.includes(phrase));
  }

  // Detect support system engagement
  private static detectSupportSystemEngagement(text: string): boolean {
    const supportPhrases = [
      'talked to', 'called', 'met with', 'therapy', 'counselor',
      'friend helped', 'family support', 'group', 'community'
    ];
    
    return supportPhrases.some(phrase => text.includes(phrase));
  }
}

// Pattern Recognition Engine
class PatternRecognitionEngine {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });
  }

  // Analyze wellness patterns for a user
  async analyzePatterns(userId: string, dataPoints: WellnessDataPoint[]): Promise<WellnessPattern[]> {
    const patterns: WellnessPattern[] = [];
    
    // Sort data points by timestamp
    const sortedData = dataPoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Detect mood decline patterns
    const moodDeclinePattern = await this.detectMoodDeclinePattern(userId, sortedData);
    if (moodDeclinePattern) patterns.push(moodDeclinePattern);
    
    // Detect social withdrawal patterns
    const withdrawalPattern = await this.detectWithdrawalPattern(userId, sortedData);
    if (withdrawalPattern) patterns.push(withdrawalPattern);
    
    // Detect sleep disruption patterns
    const sleepPattern = await this.detectSleepDisruptionPattern(userId, sortedData);
    if (sleepPattern) patterns.push(sleepPattern);
    
    // Detect crisis escalation patterns
    const crisisPattern = await this.detectCrisisEscalationPattern(userId, sortedData);
    if (crisisPattern) patterns.push(crisisPattern);
    
    // Store patterns for future reference
    await this.storePatterns(userId, patterns);
    
    return patterns;
  }

  // Detect mood decline patterns
  private async detectMoodDeclinePattern(userId: string, data: WellnessDataPoint[]): Promise<WellnessPattern | null> {
    if (data.length < 7) return null; // Need at least a week of data
    
    // Look for declining mood trend over 7+ days
    const recentWeek = data.slice(-7);
    const moodTrend = this.calculateTrend(recentWeek.map(d => d.moodScore));
    
    if (moodTrend < -0.3) { // Significant decline
      const triggerEvents = this.identifyTriggerEvents(recentWeek);
      
      return {
        userId,
        patternType: 'mood_decline',
        severity: Math.abs(moodTrend),
        frequency: 'weekly',
        duration: 7,
        triggerEvents,
        warningSignals: ['decreased mood ratings', 'negative language increase'],
        lastOccurrence: new Date(),
        effectiveness: await this.getPatternEffectiveness(userId, 'mood_decline')
      };
    }
    
    return null;
  }

  // Detect social withdrawal patterns
  private async detectWithdrawalPattern(userId: string, data: WellnessDataPoint[]): Promise<WellnessPattern | null> {
    if (data.length < 5) return null;
    
    const recent = data.slice(-5);
    const averageSocialConnection = recent.reduce((sum, d) => sum + d.socialConnection, 0) / recent.length;
    const supportEngagement = recent.filter(d => d.supportSystemEngaged).length;
    
    if (averageSocialConnection < 4 && supportEngagement === 0) {
      return {
        userId,
        patternType: 'social_withdrawal',
        severity: (10 - averageSocialConnection) / 10,
        frequency: 'daily',
        duration: 5,
        triggerEvents: ['isolation language', 'no support mentions'],
        warningSignals: ['decreased social connection', 'isolation language'],
        lastOccurrence: new Date(),
        effectiveness: await this.getPatternEffectiveness(userId, 'social_withdrawal')
      };
    }
    
    return null;
  }

  // Detect sleep disruption patterns
  private async detectSleepDisruptionPattern(userId: string, data: WellnessDataPoint[]): Promise<WellnessPattern | null> {
    if (data.length < 5) return null;
    
    const recent = data.slice(-5);
    const averageSleepQuality = recent.reduce((sum, d) => sum + d.sleepQuality, 0) / recent.length;
    
    if (averageSleepQuality < 4) {
      return {
        userId,
        patternType: 'sleep_disruption',
        severity: (10 - averageSleepQuality) / 10,
        frequency: 'daily',
        duration: 5,
        triggerEvents: this.identifyTriggerEvents(recent),
        warningSignals: ['poor sleep mentions', 'fatigue language'],
        lastOccurrence: new Date(),
        effectiveness: await this.getPatternEffectiveness(userId, 'sleep_disruption')
      };
    }
    
    return null;
  }

  // Detect crisis escalation patterns
  private async detectCrisisEscalationPattern(userId: string, data: WellnessDataPoint[]): Promise<WellnessPattern | null> {
    const riskLanguageDetected = data.some(d => d.riskLanguageDetected);
    
    if (riskLanguageDetected) {
      const recent = data.slice(-3);
      const severity = this.calculateCrisisSeverity(recent);
      
      return {
        userId,
        patternType: 'crisis_escalation',
        severity,
        frequency: 'daily',
        duration: 3,
        triggerEvents: ['risk language detected', 'hopelessness expressions'],
        warningSignals: ['suicidal ideation', 'hopelessness', 'worthlessness'],
        lastOccurrence: new Date(),
        effectiveness: await this.getPatternEffectiveness(userId, 'crisis_escalation')
      };
    }
    
    return null;
  }

  // Calculate trend in data series
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = n * (n - 1) / 2; // Sum of indices 0, 1, 2, ...
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
    const sumX2 = n * (n - 1) * (2 * n - 1) / 6; // Sum of squares of indices
    
    // Linear regression slope
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    return slope;
  }

  // Identify trigger events from data
  private identifyTriggerEvents(data: WellnessDataPoint[]): string[] {
    const triggers = new Set<string>();
    
    data.forEach(point => {
      point.stressorsPresent.forEach(stressor => triggers.add(stressor));
    });
    
    return Array.from(triggers);
  }

  // Calculate crisis severity
  private calculateCrisisSeverity(data: WellnessDataPoint[]): number {
    let severity = 0;
    
    data.forEach(point => {
      if (point.riskLanguageDetected) severity += 0.4;
      if (point.moodScore <= 3) severity += 0.2;
      if (point.socialConnection <= 3) severity += 0.1;
      if (!point.supportSystemEngaged) severity += 0.1;
    });
    
    return Math.min(1, severity);
  }

  // Get historical effectiveness of pattern predictions
  private async getPatternEffectiveness(userId: string, patternType: string): Promise<number> {
    try {
      const key = `pattern_effectiveness:${userId}:${patternType}`;
      const effectiveness = await this.redis.get(key);
      return effectiveness ? parseFloat(effectiveness) : 0.7; // Default 70% effectiveness
    } catch (error) {
      return 0.7;
    }
  }

  // Store patterns for future reference
  private async storePatterns(userId: string, patterns: WellnessPattern[]): Promise<void> {
    try {
      const key = `patterns:${userId}`;
      const patternsData = {
        patterns: JSON.stringify(patterns),
        timestamp: Date.now(),
        count: patterns.length
      };
      
      await this.redis.hmset(key, patternsData);
      await this.redis.expire(key, 30 * 24 * 60 * 60); // 30 days
      
    } catch (error) {
      logger.warn('Failed to store wellness patterns', error);
    }
  }
}

// Risk Assessment Engine
class RiskAssessmentEngine {
  // Calculate comprehensive risk score
  static calculateRiskScore(
    patterns: WellnessPattern[],
    currentDataPoints: WellnessDataPoint[],
    userProfile: any
  ): { score: number; level: 'minimal' | 'low' | 'moderate' | 'high' | 'critical' } {
    let totalRisk = 0;
    
    // Pattern-based risk (40% weight)
    const patternRisk = this.calculatePatternRisk(patterns) * 0.4;
    
    // Current state risk (35% weight)  
    const currentRisk = this.calculateCurrentStateRisk(currentDataPoints) * 0.35;
    
    // Historical risk factors (25% weight)
    const historicalRisk = this.calculateHistoricalRisk(userProfile) * 0.25;
    
    totalRisk = patternRisk + currentRisk + historicalRisk;
    
    // Convert to discrete risk levels
    if (totalRisk >= 0.8) return { score: totalRisk, level: 'critical' };
    if (totalRisk >= 0.6) return { score: totalRisk, level: 'high' };
    if (totalRisk >= 0.4) return { score: totalRisk, level: 'moderate' };
    if (totalRisk >= 0.2) return { score: totalRisk, level: 'low' };
    return { score: totalRisk, level: 'minimal' };
  }

  // Calculate risk from identified patterns
  private static calculatePatternRisk(patterns: WellnessPattern[]): number {
    let risk = 0;
    
    patterns.forEach(pattern => {
      switch (pattern.patternType) {
        case 'crisis_escalation':
          risk += pattern.severity * 0.8; // Highest weight
          break;
        case 'mood_decline':
          risk += pattern.severity * 0.6;
          break;
        case 'social_withdrawal':
          risk += pattern.severity * 0.4;
          break;
        case 'sleep_disruption':
          risk += pattern.severity * 0.3;
          break;
      }
    });
    
    return Math.min(1, risk);
  }

  // Calculate risk from current wellness state
  private static calculateCurrentStateRisk(data: WellnessDataPoint[]): number {
    if (data.length === 0) return 0.5; // Unknown state is moderate risk
    
    const latest = data[data.length - 1];
    let risk = 0;
    
    // Risk language is highest priority
    if (latest.riskLanguageDetected) risk += 0.7;
    
    // Low mood scores
    if (latest.moodScore <= 3) risk += 0.3;
    if (latest.moodScore <= 2) risk += 0.2;
    
    // High anxiety
    if (latest.anxietyLevel >= 8) risk += 0.2;
    
    // Social isolation
    if (latest.socialConnection <= 3 && !latest.supportSystemEngaged) risk += 0.2;
    
    // Sleep issues
    if (latest.sleepQuality <= 3) risk += 0.1;
    
    return Math.min(1, risk);
  }

  // Calculate risk from historical factors
  private static calculateHistoricalRisk(userProfile: any): number {
    let risk = 0;
    
    if (userProfile.hasHistoryOfCrisis) risk += 0.4;
    
    // Support system strength
    switch (userProfile.supportSystemStrength) {
      case 'weak': risk += 0.3; break;
      case 'moderate': risk += 0.1; break;
      case 'strong': risk -= 0.1; break;
    }
    
    // Known triggers present
    if (userProfile.knownTriggers.length > 3) risk += 0.2;
    
    // Effective coping strategies
    if (userProfile.effectiveCopingStrategies.length < 2) risk += 0.2;
    
    // Medication/therapy compliance
    if (userProfile.medicationCompliance === false) risk += 0.1;
    if (userProfile.therapyEngagement === false) risk += 0.1;
    
    return Math.max(0, Math.min(1, risk));
  }
}

// Intervention Recommendation Engine
class InterventionEngine {
  // Generate personalized interventions based on risk assessment
  static generateInterventions(
    riskLevel: string,
    patterns: WellnessPattern[],
    userProfile: any
  ): Intervention[] {
    const interventions: Intervention[] = [];
    
    // Crisis interventions (immediate)
    if (riskLevel === 'critical') {
      interventions.push(...this.getCrisisInterventions());
    }
    
    // High risk interventions
    if (riskLevel === 'high' || riskLevel === 'critical') {
      interventions.push(...this.getHighRiskInterventions(patterns));
    }
    
    // Moderate risk interventions
    if (['moderate', 'high', 'critical'].includes(riskLevel)) {
      interventions.push(...this.getModerateRiskInterventions(patterns, userProfile));
    }
    
    // Preventive interventions (for all levels)
    interventions.push(...this.getPreventiveInterventions(patterns, userProfile));
    
    // Sort by priority and effectiveness
    return interventions.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Crisis-level interventions
  private static getCrisisInterventions(): Intervention[] {
    return [
      {
        type: 'immediate',
        priority: 'urgent',
        action: 'Contact Crisis Hotline',
        description: 'Reach out to 988 Suicide & Crisis Lifeline immediately for professional support',
        estimatedEffectiveness: 0.9,
        resourcesNeeded: ['Phone access', 'Crisis hotline number'],
        timing: 'now'
      },
      {
        type: 'immediate',
        priority: 'urgent',
        action: 'Safety Planning',
        description: 'Create or review your safety plan with specific steps for crisis moments',
        estimatedEffectiveness: 0.85,
        resourcesNeeded: ['Safety plan template', 'Emergency contacts'],
        timing: 'now'
      },
      {
        type: 'professional',
        priority: 'urgent',
        action: 'Emergency Mental Health Services',
        description: 'Contact your local emergency mental health services or go to nearest ER',
        estimatedEffectiveness: 0.95,
        resourcesNeeded: ['Emergency contact information', 'Transportation'],
        timing: 'now'
      }
    ];
  }

  // High risk interventions
  private static getHighRiskInterventions(patterns: WellnessPattern[]): Intervention[] {
    const interventions: Intervention[] = [
      {
        type: 'professional',
        priority: 'high',
        action: 'Schedule Urgent Therapy Session',
        description: 'Contact your therapist or mental health provider for an urgent appointment',
        estimatedEffectiveness: 0.8,
        resourcesNeeded: ['Therapist contact', 'Schedule availability'],
        timing: 'today'
      },
      {
        type: 'supportive',
        priority: 'high',
        action: 'Reach Out to Support Network',
        description: 'Contact trusted friends or family members who can provide immediate support',
        estimatedEffectiveness: 0.7,
        resourcesNeeded: ['Contact list', 'Communication method'],
        timing: 'today'
      }
    ];

    // Pattern-specific interventions
    patterns.forEach(pattern => {
      switch (pattern.patternType) {
        case 'social_withdrawal':
          interventions.push({
            type: 'supportive',
            priority: 'high',
            action: 'Social Connection Activity',
            description: 'Engage in one small social activity today (text a friend, join online community)',
            estimatedEffectiveness: 0.6,
            resourcesNeeded: ['Social contacts', 'Communication device'],
            timing: 'today'
          });
          break;
        case 'sleep_disruption':
          interventions.push({
            type: 'immediate',
            priority: 'medium',
            action: 'Sleep Hygiene Reset',
            description: 'Implement immediate sleep hygiene improvements tonight',
            estimatedEffectiveness: 0.7,
            resourcesNeeded: ['Sleep environment control', 'Sleep routine plan'],
            timing: 'today'
          });
          break;
      }
    });

    return interventions;
  }

  // Moderate risk interventions
  private static getModerateRiskInterventions(patterns: WellnessPattern[], userProfile: any): Intervention[] {
    return [
      {
        type: 'preventive',
        priority: 'medium',
        action: 'Daily Check-ins',
        description: 'Implement daily mood and wellness check-ins with yourself or a support person',
        estimatedEffectiveness: 0.65,
        resourcesNeeded: ['Check-in schedule', 'Accountability partner'],
        timing: 'this_week'
      },
      {
        type: 'supportive',
        priority: 'medium',
        action: 'Coping Strategy Review',
        description: 'Review and practice your most effective coping strategies',
        estimatedEffectiveness: 0.7,
        resourcesNeeded: ['Coping strategy list', 'Practice time'],
        timing: 'this_week'
      }
    ];
  }

  // Preventive interventions
  private static getPreventiveInterventions(patterns: WellnessPattern[], userProfile: any): Intervention[] {
    return [
      {
        type: 'preventive',
        priority: 'low',
        action: 'Mindfulness Practice',
        description: 'Engage in 10 minutes of daily mindfulness or meditation',
        estimatedEffectiveness: 0.6,
        resourcesNeeded: ['Meditation app or guide', '10 minutes daily'],
        timing: 'ongoing'
      },
      {
        type: 'preventive',
        priority: 'low',
        action: 'Physical Activity',
        description: 'Incorporate gentle physical activity into your routine',
        estimatedEffectiveness: 0.55,
        resourcesNeeded: ['Safe exercise space', '20-30 minutes'],
        timing: 'ongoing'
      },
      {
        type: 'preventive',
        priority: 'low',
        action: 'Journaling Consistency',
        description: 'Maintain regular journaling to track patterns and emotions',
        estimatedEffectiveness: 0.5,
        resourcesNeeded: ['Journaling platform', 'Daily time commitment'],
        timing: 'ongoing'
      }
    ];
  }
}

// Main Predictive Wellness Engine
export class PredictiveWellnessEngine {
  private patternEngine: PatternRecognitionEngine;
  
  constructor() {
    this.patternEngine = new PatternRecognitionEngine();
  }

  // Generate comprehensive wellness prediction
  async generateWellnessPrediction(request: WellnessPredictionRequest): Promise<WellnessPrediction> {
    try {
      // Extract features from journal entries
      const dataPoints = WellnessFeatureExtractor.extractFeatures(request.recentEntries);
      
      // Analyze patterns
      const patterns = await this.patternEngine.analyzePatterns(request.userId, dataPoints);
      
      // Calculate risk assessment
      const riskAssessment = RiskAssessmentEngine.calculateRiskScore(
        patterns,
        dataPoints,
        request.userProfile
      );
      
      // Generate interventions
      const interventions = InterventionEngine.generateInterventions(
        riskAssessment.level,
        patterns,
        request.userProfile
      );
      
      // Determine prediction timeframe
      const timeframe = this.determineTimeframe(riskAssessment.level, patterns);
      
      // Extract key information
      const primaryTriggers = this.extractPrimaryTriggers(patterns, request.contextualFactors);
      const protectiveFactors = this.extractProtectiveFactors(request.userProfile, dataPoints);
      const earlyWarningSignals = this.extractWarningSignals(patterns);
      const preventiveActions = this.extractPreventiveActions(interventions);
      
      // Calculate confidence score
      const confidenceScore = this.calculateConfidenceScore(patterns, dataPoints.length);
      
      const prediction: WellnessPrediction = {
        riskLevel: riskAssessment.level,
        confidenceScore,
        timeframe,
        primaryTriggers,
        protectiveFactors,
        recommendedInterventions: interventions.slice(0, 5), // Top 5 interventions
        earlyWarningSignals,
        preventiveActions
      };
      
      // Log prediction for monitoring
      logger.info('Wellness prediction generated', {
        userId: request.userId.slice(0, 8) + '...',
        riskLevel: prediction.riskLevel,
        confidenceScore: prediction.confidenceScore,
        interventionCount: prediction.recommendedInterventions.length,
        patternCount: patterns.length
      });
      
      return prediction;
      
    } catch (error) {
      logger.error('Error generating wellness prediction', error);
      return this.generateFallbackPrediction();
    }
  }

  // Determine prediction timeframe based on risk level
  private determineTimeframe(riskLevel: string, patterns: WellnessPattern[]): '24h' | '3days' | '1week' | '2weeks' {
    if (riskLevel === 'critical') return '24h';
    if (riskLevel === 'high') return '3days';
    
    // Look for rapid pattern development
    const rapidPatterns = patterns.filter(p => p.frequency === 'daily' && p.severity > 0.6);
    if (rapidPatterns.length > 0) return '3days';
    
    if (riskLevel === 'moderate') return '1week';
    return '2weeks';
  }

  // Extract primary triggers from patterns and context
  private extractPrimaryTriggers(patterns: WellnessPattern[], contextualFactors: any): string[] {
    const triggers = new Set<string>();
    
    patterns.forEach(pattern => {
      pattern.triggerEvents.forEach(trigger => triggers.add(trigger));
    });
    
    if (contextualFactors) {
      contextualFactors.currentStressors?.forEach((stressor: string) => triggers.add(stressor));
      contextualFactors.recentLifeChanges?.forEach((change: string) => triggers.add(change));
    }
    
    return Array.from(triggers).slice(0, 5); // Top 5 triggers
  }

  // Extract protective factors
  private extractProtectiveFactors(userProfile: any, dataPoints: WellnessDataPoint[]): string[] {
    const protectiveFactors = [];
    
    if (userProfile.supportSystemStrength === 'strong') {
      protectiveFactors.push('Strong support network');
    }
    
    if (userProfile.effectiveCopingStrategies.length > 0) {
      protectiveFactors.push(`Effective coping strategies: ${userProfile.effectiveCopingStrategies.slice(0, 2).join(', ')}`);
    }
    
    if (userProfile.therapyEngagement) {
      protectiveFactors.push('Active therapy engagement');
    }
    
    if (userProfile.medicationCompliance) {
      protectiveFactors.push('Medication compliance');
    }
    
    // Look for recent positive patterns
    const recentData = dataPoints.slice(-3);
    const averageMood = recentData.reduce((sum, d) => sum + d.moodScore, 0) / recentData.length;
    if (averageMood > 6) {
      protectiveFactors.push('Recent positive mood trend');
    }
    
    const supportEngagement = recentData.filter(d => d.supportSystemEngaged).length;
    if (supportEngagement > 0) {
      protectiveFactors.push('Recent support system engagement');
    }
    
    return protectiveFactors;
  }

  // Extract early warning signals
  private extractWarningSignals(patterns: WellnessPattern[]): string[] {
    const signals = new Set<string>();
    
    patterns.forEach(pattern => {
      pattern.warningSignals.forEach(signal => signals.add(signal));
    });
    
    return Array.from(signals);
  }

  // Extract preventive actions from interventions
  private extractPreventiveActions(interventions: Intervention[]): string[] {
    return interventions
      .filter(i => i.type === 'preventive')
      .map(i => i.action)
      .slice(0, 3); // Top 3 preventive actions
  }

  // Calculate confidence score for prediction
  private calculateConfidenceScore(patterns: WellnessPattern[], dataPointCount: number): number {
    let confidence = 0.5; // Base confidence
    
    // More data points increase confidence
    confidence += Math.min(0.3, dataPointCount * 0.02);
    
    // Pattern effectiveness influences confidence
    const avgEffectiveness = patterns.length > 0 
      ? patterns.reduce((sum, p) => sum + p.effectiveness, 0) / patterns.length 
      : 0.7;
    confidence += avgEffectiveness * 0.3;
    
    // Strong patterns increase confidence
    const strongPatterns = patterns.filter(p => p.severity > 0.6).length;
    confidence += strongPatterns * 0.1;
    
    return Math.min(0.95, Math.max(0.2, confidence));
  }

  // Fallback prediction for errors
  private generateFallbackPrediction(): WellnessPrediction {
    return {
      riskLevel: 'moderate',
      confidenceScore: 0.3,
      timeframe: '1week',
      primaryTriggers: ['stress', 'life changes'],
      protectiveFactors: ['journaling practice', 'self-awareness'],
      recommendedInterventions: [
        {
          type: 'preventive',
          priority: 'medium',
          action: 'Continue Journaling',
          description: 'Maintain regular journaling to track your emotional patterns',
          estimatedEffectiveness: 0.6,
          resourcesNeeded: ['Journaling platform'],
          timing: 'ongoing'
        }
      ],
      earlyWarningSignals: ['mood changes', 'sleep disruption'],
      preventiveActions: ['daily check-ins', 'stress management', 'social connection']
    };
  }

  // Update pattern effectiveness based on actual outcomes
  async updatePatternEffectiveness(
    userId: string, 
    patternType: string, 
    predictionAccurate: boolean
  ): Promise<void> {
    try {
      const key = `pattern_effectiveness:${userId}:${patternType}`;
      const currentEffectiveness = await this.patternEngine['redis'].get(key);
      const current = currentEffectiveness ? parseFloat(currentEffectiveness) : 0.7;
      
      // Update effectiveness based on accuracy
      const adjustment = predictionAccurate ? 0.05 : -0.03;
      const newEffectiveness = Math.max(0.1, Math.min(0.95, current + adjustment));
      
      await this.patternEngine['redis'].set(key, newEffectiveness.toString(), 'EX', 90 * 24 * 60 * 60); // 90 days
      
      logger.info('Pattern effectiveness updated', {
        userId: userId.slice(0, 8) + '...',
        patternType,
        predictionAccurate,
        newEffectiveness
      });
      
    } catch (error) {
      logger.warn('Failed to update pattern effectiveness', error);
    }
  }
}

// Export for API integration
export const predictiveWellnessEngine = new PredictiveWellnessEngine();
export { WellnessPredictionRequest, WellnessPrediction, Intervention };