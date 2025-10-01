/**
 * 🕐 Khepera Personalized Intervention Timing System
 * 
 * Analyzes user journaling patterns to provide optimal intervention timing
 * while maintaining privacy and respecting individual healing rhythms.
 */

export interface UserPattern {
  userId: string;
  journalingFrequency: number; // entries per week
  preferredTimes: TimeWindow[];
  emotionalCycles: EmotionalCycle[];
  crisisIndicators: CrisisIndicator[];
  healingRhythms: HealingRhythm[];
  culturalConsiderations: CulturalTiming[];
  lastUpdated: Date;
}

export interface TimeWindow {
  startHour: number; // 24-hour format
  endHour: number;
  dayOfWeek?: number; // 0-6, Sunday = 0
  frequency: number; // how often user journals in this window
  emotionalState: string; // typical mood during this time
  effectiveness: number; // 0-1, how well interventions work at this time
}

export interface EmotionalCycle {
  pattern: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  peakTimes: number[]; // hours for daily, days for weekly, etc.
  lowTimes: number[];
  intensity: number; // 0-1
  culturalInfluence?: string;
}

export interface CrisisIndicator {
  pattern: string;
  confidence: number; // 0-1
  timeToIntervention: number; // hours before crisis point
  culturalContext?: string;
  interventionStyle: 'gentle' | 'supportive' | 'grounding' | 'connecting';
}

export interface HealingRhythm {
  phase: 'contemplation' | 'processing' | 'integration' | 'growth' | 'rest';
  duration: number; // typical length in days
  interventionPreference: string;
  culturalAlignment?: string;
}

export interface CulturalTiming {
  culture: string;
  significantTimes: string[]; // holidays, observances, cultural events
  communicationStyle: 'direct' | 'indirect' | 'contextual';
  familyConsiderations: boolean;
  seasonalInfluences: string[];
}

export interface InterventionTiming {
  optimalTime: Date;
  confidence: number;
  rationale: string;
  interventionType: 'preventive' | 'supportive' | 'crisis' | 'growth';
  culturalAdaptation: string;
  archetype: string;
  personalizedMessage: string;
}

export interface CircadianContext {
  hour: number;
  dayOfWeek: number;
  season: string;
  userTimezone: string;
  culturalEvents?: string[];
}

class PersonalizedInterventionTiming {
  private userPatterns: Map<string, UserPattern> = new Map();
  private readonly PATTERN_LEARNING_THRESHOLD = 5; // minimum entries to establish patterns
  private readonly PRIVACY_DECAY_DAYS = 30; // how long to keep detailed patterns

  /**
   * Analyzes user's journal entry and updates their personal patterns
   */
  public analyzeEntry(
    userId: string,
    journalText: string,
    mood: string,
    timestamp: Date,
    culturalContext?: string
  ): void {
    const pattern = this.getOrCreateUserPattern(userId);
    
    // Update journaling frequency
    this.updateJournalingFrequency(pattern, timestamp);
    
    // Update preferred times
    this.updatePreferredTimes(pattern, timestamp, mood);
    
    // Analyze emotional cycles
    this.analyzeEmotionalCycles(pattern, mood, timestamp);
    
    // Detect crisis indicators
    this.updateCrisisIndicators(pattern, journalText, mood, timestamp);
    
    // Update healing rhythms
    this.updateHealingRhythms(pattern, journalText, mood, timestamp);
    
    // Update cultural timing considerations
    if (culturalContext) {
      this.updateCulturalTiming(pattern, culturalContext, timestamp);
    }
    
    pattern.lastUpdated = new Date();
    this.userPatterns.set(userId, pattern);
    
    // Privacy: Clean old patterns
    this.cleanOldPatterns(pattern);
  }

  /**
   * Determines optimal timing for next intervention
   */
  public getOptimalInterventionTiming(
    userId: string,
    currentContext: CircadianContext,
    culturalContext?: string
  ): InterventionTiming | null {
    const pattern = this.userPatterns.get(userId);
    if (!pattern || this.hasInsufficientData(pattern)) {
      return this.getDefaultTiming(currentContext, culturalContext);
    }

    // Analyze current circadian context
    const circadianScore = this.analyzeCircadianOptimality(pattern, currentContext);
    
    // Check for crisis intervention needs
    const crisisIntervention = this.checkCrisisIntervention(pattern, currentContext);
    if (crisisIntervention) {
      return crisisIntervention;
    }
    
    // Analyze healing rhythm phase
    const healingPhase = this.getCurrentHealingPhase(pattern);
    
    // Consider cultural timing factors
    const culturalTiming = this.analyzeCulturalTiming(pattern, currentContext, culturalContext);
    
    // Calculate optimal intervention window
    const optimalWindow = this.calculateOptimalWindow(
      pattern,
      currentContext,
      circadianScore,
      healingPhase,
      culturalTiming
    );

    if (!optimalWindow) {
      return null;
    }

    return {
      optimalTime: optimalWindow.time,
      confidence: optimalWindow.confidence,
      rationale: optimalWindow.rationale,
      interventionType: optimalWindow.type,
      culturalAdaptation: culturalTiming.adaptation,
      archetype: this.selectOptimalArchetype(pattern, optimalWindow),
      personalizedMessage: this.generatePersonalizedMessage(pattern, optimalWindow)
    };
  }

  /**
   * Predicts user's receptivity to different intervention styles
   */
  public predictReceptivity(
    userId: string,
    interventionStyle: string,
    proposedTime: Date
  ): number {
    const pattern = this.userPatterns.get(userId);
    if (!pattern) return 0.5; // neutral if no data

    const timeWindow = this.findMatchingTimeWindow(pattern, proposedTime);
    if (!timeWindow) return 0.3; // lower if outside usual times

    // Factor in emotional cycles
    const emotionalOptimality = this.calculateEmotionalOptimality(pattern, proposedTime);
    
    // Factor in healing rhythm
    const healingOptimality = this.calculateHealingOptimality(pattern, interventionStyle);
    
    // Combine factors
    return (timeWindow.effectiveness * 0.4) + 
           (emotionalOptimality * 0.3) + 
           (healingOptimality * 0.3);
  }

  private getOrCreateUserPattern(userId: string): UserPattern {
    const existing = this.userPatterns.get(userId);
    if (existing) return existing;

    return {
      userId,
      journalingFrequency: 0,
      preferredTimes: [],
      emotionalCycles: [],
      crisisIndicators: [],
      healingRhythms: [],
      culturalConsiderations: [],
      lastUpdated: new Date()
    };
  }

  private updateJournalingFrequency(pattern: UserPattern, timestamp: Date): void {
    // Calculate weekly frequency based on recent entries
    const oneWeekAgo = new Date(timestamp.getTime() - 7 * 24 * 60 * 60 * 1000);
    // This would typically query a database for recent entries
    // For now, we'll increment based on current entry
    pattern.journalingFrequency = Math.min(pattern.journalingFrequency + 0.1, 7);
  }

  private updatePreferredTimes(pattern: UserPattern, timestamp: Date, mood: string): void {
    const hour = timestamp.getHours();
    const dayOfWeek = timestamp.getDay();
    
    // Find or create time window
    let timeWindow = pattern.preferredTimes.find(tw => 
      tw.startHour <= hour && 
      tw.endHour >= hour && 
      (tw.dayOfWeek === undefined || tw.dayOfWeek === dayOfWeek)
    );

    if (!timeWindow) {
      timeWindow = {
        startHour: Math.max(0, hour - 1),
        endHour: Math.min(23, hour + 1),
        dayOfWeek,
        frequency: 1,
        emotionalState: mood,
        effectiveness: 0.5
      };
      pattern.preferredTimes.push(timeWindow);
    } else {
      timeWindow.frequency += 1;
      // Update emotional state with weighted average
      // Simplified for this implementation
      timeWindow.emotionalState = mood;
    }
  }

  private analyzeEmotionalCycles(pattern: UserPattern, mood: string, timestamp: Date): void {
    const hour = timestamp.getHours();
    const dayOfWeek = timestamp.getDay();
    
    // Look for daily emotional patterns
    let dailyCycle = pattern.emotionalCycles.find(c => c.pattern === 'daily');
    if (!dailyCycle) {
      dailyCycle = {
        pattern: 'daily',
        peakTimes: [],
        lowTimes: [],
        intensity: 0.1
      };
      pattern.emotionalCycles.push(dailyCycle);
    }
    
    // Categorize mood and update cycles
    if (this.isPositiveMood(mood)) {
      if (!dailyCycle.peakTimes.includes(hour)) {
        dailyCycle.peakTimes.push(hour);
      }
    } else if (this.isNegativeMood(mood)) {
      if (!dailyCycle.lowTimes.includes(hour)) {
        dailyCycle.lowTimes.push(hour);
      }
    }
    
    // Update weekly patterns
    this.updateWeeklyCycle(pattern, mood, dayOfWeek);
  }

  private updateCrisisIndicators(
    pattern: UserPattern,
    journalText: string,
    mood: string,
    timestamp: Date
  ): void {
    const crisisSignals = this.detectCrisisSignals(journalText, mood);
    
    for (const signal of crisisSignals) {
      let indicator = pattern.crisisIndicators.find(ci => ci.pattern === signal.pattern);
      
      if (!indicator) {
        indicator = {
          pattern: signal.pattern,
          confidence: signal.confidence,
          timeToIntervention: signal.timeToIntervention,
          interventionStyle: signal.interventionStyle
        };
        pattern.crisisIndicators.push(indicator);
      } else {
        // Update confidence with weighted average
        indicator.confidence = (indicator.confidence * 0.7) + (signal.confidence * 0.3);
      }
    }
  }

  private updateHealingRhythms(
    pattern: UserPattern,
    journalText: string,
    mood: string,
    timestamp: Date
  ): void {
    const currentPhase = this.detectHealingPhase(journalText, mood);
    
    let rhythm = pattern.healingRhythms.find(hr => hr.phase === currentPhase);
    if (!rhythm) {
      rhythm = {
        phase: currentPhase,
        duration: 7, // default week
        interventionPreference: this.getPhasePreference(currentPhase)
      };
      pattern.healingRhythms.push(rhythm);
    }
  }

  private updateCulturalTiming(
    pattern: UserPattern,
    culturalContext: string,
    timestamp: Date
  ): void {
    let cultural = pattern.culturalConsiderations.find(cc => cc.culture === culturalContext);
    
    if (!cultural) {
      cultural = {
        culture: culturalContext,
        significantTimes: [],
        communicationStyle: 'contextual',
        familyConsiderations: true,
        seasonalInfluences: []
      };
      pattern.culturalConsiderations.push(cultural);
    }
    
    // Update based on timestamp and context
    const season = this.getSeason(timestamp);
    if (!cultural.seasonalInfluences.includes(season)) {
      cultural.seasonalInfluences.push(season);
    }
  }

  private analyzeCircadianOptimality(
    pattern: UserPattern,
    context: CircadianContext
  ): number {
    const matchingWindow = pattern.preferredTimes.find(tw => 
      tw.startHour <= context.hour && 
      tw.endHour >= context.hour &&
      (tw.dayOfWeek === undefined || tw.dayOfWeek === context.dayOfWeek)
    );

    if (!matchingWindow) return 0.2;
    
    // Factor in frequency and effectiveness
    const frequencyScore = Math.min(matchingWindow.frequency / 10, 1);
    const effectivenessScore = matchingWindow.effectiveness;
    
    return (frequencyScore * 0.6) + (effectivenessScore * 0.4);
  }

  private checkCrisisIntervention(
    pattern: UserPattern,
    context: CircadianContext
  ): InterventionTiming | null {
    for (const indicator of pattern.crisisIndicators) {
      if (indicator.confidence > 0.7) {
        return {
          optimalTime: new Date(), // immediate
          confidence: indicator.confidence,
          rationale: `Crisis intervention needed based on pattern: ${indicator.pattern}`,
          interventionType: 'crisis',
          culturalAdaptation: 'Crisis-sensitive approach',
          archetype: 'mystic_healer', // healing archetype for crisis
          personalizedMessage: this.generateCrisisMessage(indicator)
        };
      }
    }
    
    return null;
  }

  private getCurrentHealingPhase(pattern: UserPattern): HealingRhythm | null {
    // Return the most recent healing rhythm
    return pattern.healingRhythms.length > 0 ? 
      pattern.healingRhythms[pattern.healingRhythms.length - 1] : null;
  }

  private analyzeCulturalTiming(
    pattern: UserPattern,
    context: CircadianContext,
    culturalContext?: string
  ): { adaptation: string; score: number } {
    if (!culturalContext) {
      return { adaptation: 'Universal approach', score: 0.5 };
    }

    const cultural = pattern.culturalConsiderations.find(cc => cc.culture === culturalContext);
    if (!cultural) {
      return { adaptation: 'General cultural sensitivity', score: 0.4 };
    }

    // Check for cultural events or significant times
    const season = this.getSeason(new Date());
    const culturalScore = cultural.seasonalInfluences.includes(season) ? 0.8 : 0.6;
    
    const adaptation = this.getCulturalAdaptation(cultural, context);
    
    return { adaptation, score: culturalScore };
  }

  private calculateOptimalWindow(
    pattern: UserPattern,
    context: CircadianContext,
    circadianScore: number,
    healingPhase: HealingRhythm | null,
    culturalTiming: { adaptation: string; score: number }
  ): { time: Date; confidence: number; rationale: string; type: string } | null {
    // Find the best time window within next 24 hours
    const now = new Date();
    let bestWindow: any = null;
    let bestScore = 0;

    for (const timeWindow of pattern.preferredTimes) {
      const windowScore = this.calculateWindowScore(
        timeWindow,
        circadianScore,
        healingPhase,
        culturalTiming
      );

      if (windowScore > bestScore) {
        bestScore = windowScore;
        bestWindow = {
          time: this.calculateNextWindowTime(timeWindow, now),
          confidence: windowScore,
          rationale: this.generateWindowRationale(timeWindow, healingPhase, culturalTiming),
          type: this.determineInterventionType(healingPhase, windowScore)
        };
      }
    }

    return bestWindow;
  }

  private calculateWindowScore(
    timeWindow: TimeWindow,
    circadianScore: number,
    healingPhase: HealingRhythm | null,
    culturalTiming: { adaptation: string; score: number }
  ): number {
    let score = timeWindow.effectiveness * 0.4;
    score += circadianScore * 0.3;
    score += culturalTiming.score * 0.2;
    
    if (healingPhase) {
      // Bonus for alignment with healing phase
      score += 0.1;
    }
    
    return Math.min(score, 1.0);
  }

  private selectOptimalArchetype(pattern: UserPattern, window: any): string {
    // Select archetype based on intervention type and user patterns
    switch (window.type) {
      case 'crisis':
        return 'mystic_healer';
      case 'growth':
        return 'sage_oracle';
      case 'supportive':
        return 'cosmic_dancer';
      case 'preventive':
        return 'earth_guardian';
      default:
        return 'sage_oracle';
    }
  }

  private generatePersonalizedMessage(pattern: UserPattern, window: any): string {
    const culturalConsideration = pattern.culturalConsiderations[0];
    const timeOfDay = this.getTimeOfDayPhrase(window.time.getHours());
    
    if (culturalConsideration) {
      return `${timeOfDay} feels like a gentle time for reflection in your journey. Your cultural wisdom guides this moment.`;
    }
    
    return `${timeOfDay} offers a space for your thoughts to find their voice.`;
  }

  // Helper methods
  private hasInsufficientData(pattern: UserPattern): boolean {
    return pattern.preferredTimes.length < this.PATTERN_LEARNING_THRESHOLD;
  }

  private getDefaultTiming(
    context: CircadianContext,
    culturalContext?: string
  ): InterventionTiming {
    // Default gentle timing for new users
    const optimalTime = new Date();
    optimalTime.setHours(optimalTime.getHours() + 2); // 2 hours from now

    return {
      optimalTime,
      confidence: 0.3,
      rationale: 'Initial gentle timing while learning your patterns',
      interventionType: 'supportive',
      culturalAdaptation: culturalContext ? `Culturally aware for ${culturalContext}` : 'Universal approach',
      archetype: 'sage_oracle',
      personalizedMessage: 'Welcome to your journey of reflection and growth.'
    };
  }

  private isPositiveMood(mood: string): boolean {
    const positiveMoods = ['happy', 'grateful', 'peaceful', 'excited', 'confident', 'loved'];
    return positiveMoods.some(m => mood.toLowerCase().includes(m));
  }

  private isNegativeMood(mood: string): boolean {
    const negativeMoods = ['sad', 'angry', 'anxious', 'frustrated', 'lonely', 'overwhelmed'];
    return negativeMoods.some(m => mood.toLowerCase().includes(m));
  }

  private updateWeeklyCycle(pattern: UserPattern, mood: string, dayOfWeek: number): void {
    let weeklyCycle = pattern.emotionalCycles.find(c => c.pattern === 'weekly');
    if (!weeklyCycle) {
      weeklyCycle = {
        pattern: 'weekly',
        peakTimes: [],
        lowTimes: [],
        intensity: 0.1
      };
      pattern.emotionalCycles.push(weeklyCycle);
    }
    
    if (this.isPositiveMood(mood) && !weeklyCycle.peakTimes.includes(dayOfWeek)) {
      weeklyCycle.peakTimes.push(dayOfWeek);
    } else if (this.isNegativeMood(mood) && !weeklyCycle.lowTimes.includes(dayOfWeek)) {
      weeklyCycle.lowTimes.push(dayOfWeek);
    }
  }

  private detectCrisisSignals(journalText: string, mood: string): any[] {
    const signals = [];
    const textLower = journalText.toLowerCase();
    
    // Simple crisis detection patterns
    if (textLower.includes('hopeless') || textLower.includes('can\'t go on')) {
      signals.push({
        pattern: 'hopelessness',
        confidence: 0.8,
        timeToIntervention: 0, // immediate
        interventionStyle: 'supportive'
      });
    }
    
    if (textLower.includes('overwhelming') || textLower.includes('too much')) {
      signals.push({
        pattern: 'overwhelm',
        confidence: 0.6,
        timeToIntervention: 2, // 2 hours
        interventionStyle: 'grounding'
      });
    }
    
    return signals;
  }

  private detectHealingPhase(journalText: string, mood: string): HealingRhythm['phase'] {
    const textLower = journalText.toLowerCase();
    
    if (textLower.includes('thinking about') || textLower.includes('reflecting')) {
      return 'contemplation';
    } else if (textLower.includes('working through') || textLower.includes('processing')) {
      return 'processing';
    } else if (textLower.includes('understand') || textLower.includes('learning')) {
      return 'integration';
    } else if (textLower.includes('growing') || textLower.includes('changing')) {
      return 'growth';
    } else {
      return 'rest';
    }
  }

  private getPhasePreference(phase: HealingRhythm['phase']): string {
    switch (phase) {
      case 'contemplation': return 'gentle_inquiry';
      case 'processing': return 'supportive_presence';
      case 'integration': return 'wisdom_sharing';
      case 'growth': return 'encouragement';
      case 'rest': return 'gentle_check_in';
      default: return 'supportive_presence';
    }
  }

  private getSeason(date: Date): string {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  private getCulturalAdaptation(cultural: CulturalTiming, context: CircadianContext): string {
    if (cultural.familyConsiderations && context.hour >= 18 && context.hour <= 22) {
      return 'Family time awareness - gentle and respectful approach';
    }
    
    switch (cultural.communicationStyle) {
      case 'direct':
        return 'Direct, clear communication style';
      case 'indirect':
        return 'Gentle, indirect communication style';
      case 'contextual':
        return 'Context-aware, culturally sensitive communication';
      default:
        return 'Respectful cultural approach';
    }
  }

  private findMatchingTimeWindow(pattern: UserPattern, time: Date): TimeWindow | null {
    const hour = time.getHours();
    const dayOfWeek = time.getDay();
    
    return pattern.preferredTimes.find(tw => 
      tw.startHour <= hour && 
      tw.endHour >= hour &&
      (tw.dayOfWeek === undefined || tw.dayOfWeek === dayOfWeek)
    ) || null;
  }

  private calculateEmotionalOptimality(pattern: UserPattern, time: Date): number {
    const hour = time.getHours();
    
    for (const cycle of pattern.emotionalCycles) {
      if (cycle.pattern === 'daily') {
        if (cycle.peakTimes.includes(hour)) {
          return 0.8;
        } else if (cycle.lowTimes.includes(hour)) {
          return 0.3;
        }
      }
    }
    
    return 0.5; // neutral
  }

  private calculateHealingOptimality(pattern: UserPattern, interventionStyle: string): number {
    const currentRhythm = this.getCurrentHealingPhase(pattern);
    if (!currentRhythm) return 0.5;
    
    // Match intervention style with healing phase preference
    if (currentRhythm.interventionPreference === interventionStyle) {
      return 0.9;
    } else if (this.isCompatibleIntervention(currentRhythm.interventionPreference, interventionStyle)) {
      return 0.7;
    } else {
      return 0.4;
    }
  }

  private isCompatibleIntervention(preferred: string, proposed: string): boolean {
    const compatible: Record<string, string[]> = {
      'gentle_inquiry': ['supportive_presence', 'wisdom_sharing'],
      'supportive_presence': ['gentle_inquiry', 'encouragement'],
      'wisdom_sharing': ['gentle_inquiry', 'encouragement'],
      'encouragement': ['supportive_presence', 'wisdom_sharing'],
      'gentle_check_in': ['gentle_inquiry', 'supportive_presence']
    };
    
    return compatible[preferred]?.includes(proposed) || false;
  }

  private calculateNextWindowTime(timeWindow: TimeWindow, from: Date): Date {
    const nextTime = new Date(from);
    
    // If we're past the window today, move to next occurrence
    if (from.getHours() > timeWindow.endHour) {
      nextTime.setDate(nextTime.getDate() + 1);
    }
    
    nextTime.setHours(timeWindow.startHour, 0, 0, 0);
    return nextTime;
  }

  private generateWindowRationale(
    timeWindow: TimeWindow,
    healingPhase: HealingRhythm | null,
    culturalTiming: { adaptation: string; score: number }
  ): string {
    let rationale = `Based on your patterns, ${this.getTimeOfDayPhrase(timeWindow.startHour)} is typically a good time for reflection`;
    
    if (healingPhase) {
      rationale += `, especially during your current ${healingPhase.phase} phase`;
    }
    
    if (culturalTiming.score > 0.6) {
      rationale += `, with cultural timing considerations`;
    }
    
    return rationale;
  }

  private determineInterventionType(healingPhase: HealingRhythm | null, score: number): string {
    if (score > 0.8) return 'growth';
    if (score > 0.6) return 'supportive';
    if (healingPhase?.phase === 'rest') return 'gentle';
    return 'preventive';
  }

  private generateCrisisMessage(indicator: CrisisIndicator): string {
    switch (indicator.interventionStyle) {
      case 'supportive':
        return 'I sense you\'re carrying something heavy. You don\'t have to face this alone.';
      case 'grounding':
        return 'Let\'s pause here together. Your feelings are valid, and this moment will pass.';
      case 'connecting':
        return 'Your courage in sharing shows such strength. Community and support are waiting for you.';
      default:
        return 'I\'m here with you in this difficult moment. Your life has value.';
    }
  }

  private getTimeOfDayPhrase(hour: number): string {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  private cleanOldPatterns(pattern: UserPattern): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.PRIVACY_DECAY_DAYS);
    
    // Remove old time windows with low frequency
    pattern.preferredTimes = pattern.preferredTimes.filter(tw => tw.frequency > 1);
    
    // Reduce precision of old emotional cycles for privacy
    pattern.emotionalCycles.forEach(cycle => {
      if (cycle.intensity < 0.1) {
        cycle.peakTimes = cycle.peakTimes.slice(0, 3); // Keep only top 3
        cycle.lowTimes = cycle.lowTimes.slice(0, 3);
      }
    });
  }

  /**
   * Exports user patterns for privacy review (privacy-preserving)
   */
  public exportUserPatterns(userId: string): Partial<UserPattern> | null {
    const pattern = this.userPatterns.get(userId);
    if (!pattern) return null;

    return {
      userId: pattern.userId,
      journalingFrequency: Math.round(pattern.journalingFrequency * 10) / 10, // Round for privacy
      preferredTimes: pattern.preferredTimes.map(tw => ({
        ...tw,
        frequency: Math.min(tw.frequency, 10) // Cap for privacy
      })),
      lastUpdated: pattern.lastUpdated
    };
  }

  /**
   * Deletes user patterns for privacy compliance
   */
  public deleteUserPatterns(userId: string): boolean {
    return this.userPatterns.delete(userId);
  }
}

export const personalizedInterventionTiming = new PersonalizedInterventionTiming();