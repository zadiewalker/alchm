/**
 * TRAUMA-INFORMED ENGAGEMENT SYSTEM
 * "Gentle nudges that respect autonomy and support healing rhythms"
 * 
 * Revolutionary Approach:
 * - Spaced repetition optimized for emotional learning
 * - Gentle nudges that never pressure or shame
 * - Adaptive timing based on user's energy and emotional state
 * - Meaningful reminders that connect to personal values
 * - Respect for user autonomy and healing pace
 * 
 * Core Philosophy: Support, never pressure. Invite, never demand.
 */

import { 
  EmotionalSkill, 
  EmotionalExercise, 
  DailyCheckIn,
  EmotionalStreak 
} from './duolingo-style-healing-engine';

export interface EngagementPreferences {
  userId: string;
  nudgeStyle: 'minimal' | 'gentle' | 'encouraging' | 'none';
  optimalTimes: string[]; // Times when user is most receptive
  frequency: 'daily' | 'every_other_day' | 'weekly' | 'adaptive';
  channels: ('app_notification' | 'email' | 'sms' | 'in_app_only')[];
  traumaInformed: boolean;
  respectfulLanguage: boolean;
  personalValues: string[]; // To connect nudges to what matters to them
  energyPatterns: {
    highEnergyTimes: string[];
    lowEnergyTimes: string[];
    recoveryDays: string[];
  };
  boundarySettings: {
    maxNudgesPerDay: number;
    pauseDuringDifficultPeriods: boolean;
    respectSilentPeriods: boolean;
  };
}

export interface SpacedRepetitionItem {
  id: string;
  type: 'skill_practice' | 'concept_review' | 'insight_integration' | 'emotional_check_in';
  skillId?: string;
  exerciseId?: string;
  concept?: string;
  lastReviewed: string;
  nextReview: string;
  interval: number; // days
  easeFactor: number; // 1.3 to 2.5
  repetitions: number;
  difficulty: number; // 1-5 scale
  userRating?: number; // How helpful was this?
  emotionalSafety: number; // 1-5 scale
  lastPerformance: 'struggled' | 'okay' | 'good' | 'mastered';
}

export interface EngagementNudge {
  id: string;
  type: 'check_in_reminder' | 'skill_practice_suggestion' | 'milestone_acknowledgment' | 'gentle_return' | 'wisdom_share';
  title: string;
  message: string;
  timing: string; // ISO timestamp
  priority: 'low' | 'medium' | 'high';
  personalizedElements: {
    userValues: string[];
    currentContext: string;
    emotionalRelevance: string;
  };
  actionable: {
    primaryAction: {
      label: string;
      type: 'open_check_in' | 'start_exercise' | 'view_progress' | 'dismiss';
      data?: any;
    };
    secondaryAction?: {
      label: string;
      type: 'pause_notifications' | 'customize_timing' | 'learn_more';
      data?: any;
    };
  };
  respectfulExit: {
    enabled: boolean;
    message: string;
    pauseOptions: ('1_hour' | '1_day' | '3_days' | '1_week')[];
  };
}

export interface EngagementAnalytics {
  userId: string;
  nudgeResponseRate: number;
  optimalEngagementTimes: string[];
  preferredNudgeTypes: string[];
  spacedRepetitionEffectiveness: number;
  userSatisfactionScore: number;
  overengagementWarnings: number;
  traumaResponseIndicators: number;
  adaptationsSuggested: string[];
}

export interface MotivationalCue {
  id: string;
  trigger: 'low_engagement' | 'return_after_break' | 'skill_struggle' | 'milestone_approach' | 'emotional_difficulty';
  message: string;
  tone: 'gentle_encouragement' | 'wise_support' | 'playful_invitation' | 'compassionate_understanding';
  timing: 'immediate' | 'delayed' | 'optimal_typeof window !== 'undefined' && window';
  personalizedToUser: boolean;
}

/**
 * Main engagement system that manages gentle nudges and spaced repetition
 */
export class EngagementSystem {
  
  /**
   * Initialize engagement preferences for a new user
   */
  static async initializeEngagementPreferences(
    userId: string,
    userProfile: {
      traumaInformed?: boolean;
      communicationStyle?: string;
      culturalBackground?: string[];
      timeZone?: string;
    }
  ): Promise<EngagementPreferences> {
    
    // Start with trauma-informed defaults
    const basePreferences: EngagementPreferences = {
      userId,
      nudgeStyle: userProfile.traumaInformed ? 'gentle' : 'encouraging',
      optimalTimes: ['09:00', '19:00'], // Morning and evening defaults
      frequency: 'adaptive',
      channels: ['in_app_only'], // Start conservative
      traumaInformed: userProfile.traumaInformed || true,
      respectfulLanguage: true,
      personalValues: [], // To be learned over time
      energyPatterns: {
        highEnergyTimes: ['09:00', '10:00'],
        lowEnergyTimes: ['13:00', '22:00'],
        recoveryDays: []
      },
      boundarySettings: {
        maxNudgesPerDay: userProfile.traumaInformed ? 1 : 2,
        pauseDuringDifficultPeriods: true,
        respectSilentPeriods: true
      }
    };
    
    return basePreferences;
  }

  /**
   * Create spaced repetition schedule for emotional skills
   */
  static createSpacedRepetitionSchedule(
    skills: EmotionalSkill[],
    userPreferences: EngagementPreferences
  ): SpacedRepetitionItem[] {
    const schedule: SpacedRepetitionItem[] = [];
    
    skills.forEach(skill => {
      skill.exercises.forEach(exercise => {
        // Calculate optimal interval based on skill level and user comfort
        const baseInterval = this.calculateBaseInterval(skill.level, exercise.difficulty);
        const personalizedInterval = this.personalizeInterval(baseInterval, userPreferences);
        
        const item: SpacedRepetitionItem = {
          id: `${skill.id}_${exercise.id}`,
          type: 'skill_practice',
          skillId: skill.id,
          exerciseId: exercise.id,
          lastReviewed: '',
          nextReview: this.calculateNextReview(personalizedInterval),
          interval: personalizedInterval,
          easeFactor: 2.5, // Standard starting factor
          repetitions: 0,
          difficulty: this.mapDifficultyToNumber(exercise.difficulty),
          emotionalSafety: this.assessEmotionalSafety(exercise, userPreferences),
          lastPerformance: 'okay'
        };
        
        schedule.push(item);
      });
    });
    
    return schedule;
  }

  /**
   * Generate gentle engagement nudges
   */
  static async generateGentleNudges(
    userPreferences: EngagementPreferences,
    userContext: {
      currentStreak: EmotionalStreak;
      recentCheckIns: DailyCheckIn[];
      skillProgress: EmotionalSkill[];
      lastActive: string;
    },
    spacedRepetitionItems: SpacedRepetitionItem[]
  ): Promise<EngagementNudge[]> {
    
    const nudges: EngagementNudge[] = [];
    const now = new Date();
    
    // Check if user needs a gentle return nudge
    const daysSinceLastActive = this.calculateDaysSince(userContext.lastActive);
    if (daysSinceLastActive > 1 && daysSinceLastActive <= 3) {
      nudges.push(this.createGentleReturnNudge(userPreferences, daysSinceLastActive));
    }
    
    // Check if it's time for daily check-in
    const hasCheckedInToday = this.hasCheckedInToday(userContext.recentCheckIns);
    if (!hasCheckedInToday && this.isOptimalTime(userPreferences.optimalTimes)) {
      nudges.push(this.createCheckInNudge(userPreferences, userContext.currentStreak));
    }
    
    // Check for spaced repetition items due for review
    const dueItems = spacedRepetitionItems.filter(item => 
      new Date(item.nextReview) <= now && 
      item.emotionalSafety >= 3 // Only suggest emotionally safe items
    );
    
    if (dueItems.length > 0 && nudges.length < userPreferences.boundarySettings.maxNudgesPerDay) {
      const prioritizedItem = this.prioritizeSpacedRepetitionItem(dueItems, userContext);
      if (prioritizedItem) {
        nudges.push(this.createSkillPracticeNudge(prioritizedItem, userPreferences, userContext));
      }
    }
    
    // Check for milestone approach
    const approachingMilestone = this.checkApproachingMilestone(userContext.currentStreak);
    if (approachingMilestone && nudges.length === 0) {
      nudges.push(this.createMilestoneNudge(approachingMilestone, userPreferences));
    }
    
    // Filter nudges by user preferences and current capacity
    return this.filterNudgesByPreferences(nudges, userPreferences);
  }

  /**
   * Update spaced repetition based on user performance
   */
  static updateSpacedRepetition(
    item: SpacedRepetitionItem,
    performance: 'struggled' | 'okay' | 'good' | 'mastered',
    userRating: number, // 1-5 scale for helpfulness
    emotionalResponse: 'overwhelming' | 'challenging' | 'comfortable' | 'easy'
  ): SpacedRepetitionItem {
    
    let newEaseFactor = item.easeFactor;
    let newInterval = item.interval;
    
    // Adjust based on performance using modified SM-2 algorithm
    switch (performance) {
      case 'struggled':
        newEaseFactor = Math.max(1.3, item.easeFactor - 0.2);
        newInterval = 1; // Review tomorrow
        break;
      case 'okay':
        newEaseFactor = Math.max(1.3, item.easeFactor - 0.1);
        newInterval = Math.max(1, Math.round(item.interval * 1.2));
        break;
      case 'good':
        newInterval = Math.round(item.interval * newEaseFactor);
        break;
      case 'mastered':
        newEaseFactor = Math.min(2.5, item.easeFactor + 0.1);
        newInterval = Math.round(item.interval * newEaseFactor * 1.3);
        break;
    }
    
    // Adjust for emotional response (trauma-informed modification)
    if (emotionalResponse === 'overwhelming') {
      newInterval = Math.round(newInterval * 2); // Much longer interval
      newEaseFactor = Math.max(1.3, newEaseFactor - 0.3);
    } else if (emotionalResponse === 'challenging') {
      newInterval = Math.round(newInterval * 1.5); // Longer interval
    }
    
    // Adjust emotional safety rating
    let newEmotionalSafety = item.emotionalSafety;
    if (emotionalResponse === 'overwhelming') {
      newEmotionalSafety = Math.max(1, item.emotionalSafety - 1);
    } else if (emotionalResponse === 'comfortable' || emotionalResponse === 'easy') {
      newEmotionalSafety = Math.min(5, item.emotionalSafety + 0.5);
    }
    
    return {
      ...item,
      lastReviewed: new Date().toISOString(),
      nextReview: this.calculateNextReview(newInterval),
      interval: newInterval,
      easeFactor: newEaseFactor,
      repetitions: item.repetitions + 1,
      userRating,
      emotionalSafety: newEmotionalSafety,
      lastPerformance: performance
    };
  }

  /**
   * Analyze engagement patterns and suggest adaptations
   */
  static analyzeEngagementPatterns(
    userId: string,
    engagementHistory: {
      nudgesShown: EngagementNudge[];
      nudgesActedOn: string[];
      nudgesDismissed: string[];
      pauseRequests: any[];
      spacedRepetitionPerformance: SpacedRepetitionItem[];
    }
  ): EngagementAnalytics {
    
    const { nudgesShown, nudgesActedOn, nudgesDismissed, pauseRequests, spacedRepetitionPerformance } = engagementHistory;
    
    // Calculate response rate
    const responseRate = nudgesShown.length > 0 ? 
      (nudgesActedOn.length / nudgesShown.length) : 0;
    
    // Identify optimal engagement times
    const actedOnNudges = nudgesShown.filter(nudge => nudgesActedOn.includes(nudge.id));
    const optimalTimes = this.extractOptimalTimes(actedOnNudges);
    
    // Identify preferred nudge types
    const preferredTypes = this.extractPreferredNudgeTypes(actedOnNudges);
    
    // Calculate spaced repetition effectiveness
    const srEffectiveness = this.calculateSpacedRepetitionEffectiveness(spacedRepetitionPerformance);
    
    // Calculate user satisfaction from ratings
    const userSatisfaction = this.calculateUserSatisfaction(spacedRepetitionPerformance);
    
    // Check for overengagement warnings
    const overengagementWarnings = this.detectOverengagement(nudgesShown, pauseRequests);
    
    // Check for trauma response indicators
    const traumaIndicators = this.detectTraumaResponseIndicators(spacedRepetitionPerformance, pauseRequests);
    
    // Generate adaptation suggestions
    const adaptationsSuggested = this.generateAdaptationSuggestions({
      responseRate,
      userSatisfaction,
      overengagementWarnings,
      traumaIndicators
    });
    
    return {
      userId,
      nudgeResponseRate: responseRate,
      optimalEngagementTimes: optimalTimes,
      preferredNudgeTypes: preferredTypes,
      spacedRepetitionEffectiveness: srEffectiveness,
      userSatisfactionScore: userSatisfaction,
      overengagementWarnings,
      traumaResponseIndicators: traumaIndicators,
      adaptationsSuggested
    };
  }

  /**
   * Create motivational cues for different situations
   */
  static createMotivationalCues(
    trigger: MotivationalCue['trigger'],
    userPreferences: EngagementPreferences,
    context: any
  ): MotivationalCue[] {
    
    const cues: MotivationalCue[] = [];
    
    const toneMapping = {
      minimal: 'gentle_encouragement',
      gentle: 'compassionate_understanding',
      encouraging: 'wise_support',
      none: 'gentle_encouragement'
    };
    
    const tone = toneMapping[userPreferences.nudgeStyle] || 'gentle_encouragement';
    
    switch (trigger) {
      case 'low_engagement':
        cues.push({
          id: `low_engagement_${Date.now()}`,
          trigger,
          message: this.getLowEngagementMessage(tone, userPreferences),
          tone,
          timing: 'optimal_typeof window !== 'undefined' && window',
          personalizedToUser: true
        });
        break;
        
      case 'return_after_break':
        cues.push({
          id: `return_${Date.now()}`,
          trigger,
          message: this.getReturnMessage(tone, userPreferences, context.daysAway),
          tone,
          timing: 'immediate',
          personalizedToUser: true
        });
        break;
        
      case 'skill_struggle':
        cues.push({
          id: `struggle_${Date.now()}`,
          trigger,
          message: this.getStruggleMessage(tone, userPreferences, context.skillName),
          tone,
          timing: 'delayed',
          personalizedToUser: true
        });
        break;
        
      case 'milestone_approach':
        cues.push({
          id: `milestone_${Date.now()}`,
          trigger,
          message: this.getMilestoneMessage(tone, context.milestone),
          tone,
          timing: 'optimal_typeof window !== 'undefined' && window',
          personalizedToUser: true
        });
        break;
        
      case 'emotional_difficulty':
        cues.push({
          id: `emotional_support_${Date.now()}`,
          trigger,
          message: this.getEmotionalSupportMessage(tone, userPreferences),
          tone,
          timing: 'immediate',
          personalizedToUser: true
        });
        break;
    }
    
    return cues;
  }

  // Private helper methods (simplified for brevity)
  private static calculateBaseInterval(skillLevel: number, difficulty: string): number {
    const difficultyMultiplier = {
      'introduction': 1,
      'exploration': 1.5,
      'challenge': 2,
      'mastery': 3
    };
    
    return Math.max(1, Math.round((skillLevel + 1) * (difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier] || 1)));
  }

  private static personalizeInterval(baseInterval: number, preferences: EngagementPreferences): number {
    const frequencyMultiplier = {
      'daily': 0.5,
      'every_other_day': 1,
      'weekly': 2,
      'adaptive': 1
    };
    
    return Math.max(1, Math.round(baseInterval * frequencyMultiplier[preferences.frequency]));
  }

  private static calculateNextReview(intervalDays: number): string {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervalDays);
    return nextDate.toISOString();
  }

  private static mapDifficultyToNumber(difficulty: string): number {
    const mapping = {
      'introduction': 1,
      'exploration': 2,
      'challenge': 3,
      'mastery': 4
    };
    return mapping[difficulty as keyof typeof mapping] || 2;
  }

  private static assessEmotionalSafety(exercise: EmotionalExercise, preferences: EngagementPreferences): number {
    let safety = 5; // Start with maximum safety
    
    // Reduce safety for trauma-informed users with certain topics
    if (preferences.traumaInformed && exercise.trauma_informed.triggerWarnings.length > 0) {
      safety -= exercise.trauma_informed.triggerWarnings.length * 0.5;
    }
    
    return Math.max(1, Math.min(5, safety));
  }

  private static calculateDaysSince(dateString: string): number {
    const lastDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private static hasCheckedInToday(recentCheckIns: DailyCheckIn[]): boolean {
    const today = new Date().toISOString().split('T')[0];
    return recentCheckIns.some(checkIn => checkIn.date === today);
  }

  private static isOptimalTime(optimalTimes: string[]): boolean {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return optimalTimes.some(time => {
      const timeParts = time.split(':');
      const optimalHour = parseInt(timeParts[0]);
      const currentHour = now.getHours();
      
      // Within 1 hour of optimal time
      return Math.abs(currentHour - optimalHour) <= 1;
    });
  }

  private static createGentleReturnNudge(preferences: EngagementPreferences, daysAway: number): EngagementNudge {
    const messages = {
      gentle: [
        "Welcome back to yourself. Your healing journey was here waiting for you.",
        "No judgment, just presence. Ready to reconnect with your emotional wellness?",
        "Your return is an act of self-compassion. How are you feeling today?"
      ],
      encouraging: [
        "Great to see you back! Your healing journey continues right where you left off.",
        "Welcome back, emotional warrior! Ready to dive back into your growth?",
        "You're back! Let's continue building those amazing emotional skills."
      ]
    };
    
    const messageSet = messages[preferences.nudgeStyle as keyof typeof messages] || messages.gentle;
    const message = messageSet[Math.floor(Math.random() * messageSet.length)];
    
    return {
      id: `gentle_return_${Date.now()}`,
      type: 'gentle_return',
      title: 'Welcome Back',
      message,
      timing: new Date().toISOString(),
      priority: 'medium',
      personalizedElements: {
        userValues: preferences.personalValues,
        currentContext: `returning_after_${daysAway}_days`,
        emotionalRelevance: 'self_compassion'
      },
      actionable: {
        primaryAction: {
          label: 'Check In',
          type: 'open_check_in'
        },
        secondaryAction: {
          label: 'Just Browsing',
          type: 'dismiss'
        }
      },
      respectfulExit: {
        enabled: true,
        message: "Take all the time you need. You can always adjust notification settings.",
        pauseOptions: ['1_day', '3_days', '1_week']
      }
    };
  }

  private static createCheckInNudge(preferences: EngagementPreferences, streak: EmotionalStreak): EngagementNudge {
    const messages = {
      gentle: [
        "How's your heart today? A gentle check-in with yourself can be a gift.",
        "Your emotional world has wisdom to share. Ready to listen?",
        "A moment of self-connection awaits. How are you feeling right now?"
      ],
      encouraging: [
        "Time for your daily emotional wellness check-in! You've got this!",
        "Let's see how you're doing today - your growth journey continues!",
        "Daily check-in time! Your consistency is building something beautiful."
      ]
    };
    
    const messageSet = messages[preferences.nudgeStyle as keyof typeof messages] || messages.gentle;
    const message = messageSet[Math.floor(Math.random() * messageSet.length)];
    
    return {
      id: `check_in_${Date.now()}`,
      type: 'check_in_reminder',
      title: 'Daily Check-In',
      message,
      timing: new Date().toISOString(),
      priority: 'medium',
      personalizedElements: {
        userValues: preferences.personalValues,
        currentContext: `streak_day_${streak.currentStreak}`,
        emotionalRelevance: 'self_awareness'
      },
      actionable: {
        primaryAction: {
          label: 'Check In Now',
          type: 'open_check_in'
        },
        secondaryAction: {
          label: 'Remind Me Later',
          type: 'dismiss',
          data: { snooze: '2_hours' }
        }
      },
      respectfulExit: {
        enabled: true,
        message: "You can customize when and how often you receive these reminders.",
        pauseOptions: ['1_hour', '1_day']
      }
    };
  }

  private static createSkillPracticeNudge(
    item: SpacedRepetitionItem,
    preferences: EngagementPreferences,
    context: any
  ): EngagementNudge {
    return {
      id: `skill_practice_${item.id}_${Date.now()}`,
      type: 'skill_practice_suggestion',
      title: 'Skill Practice',
      message: "A skill you've been developing is ready for practice. Want to strengthen it?",
      timing: new Date().toISOString(),
      priority: 'low',
      personalizedElements: {
        userValues: preferences.personalValues,
        currentContext: `spaced_repetition_${item.type}`,
        emotionalRelevance: 'skill_building'
      },
      actionable: {
        primaryAction: {
          label: 'Practice Now',
          type: 'start_exercise',
          data: { exerciseId: item.exerciseId }
        }
      },
      respectfulExit: {
        enabled: true,
        message: "Skills develop at your pace. No pressure at all.",
        pauseOptions: ['1_day', '3_days']
      }
    };
  }

  private static createMilestoneNudge(milestone: any, preferences: EngagementPreferences): EngagementNudge {
    return {
      id: `milestone_${milestone.days}_${Date.now()}`,
      type: 'milestone_acknowledgment',
      title: 'Milestone Approaching',
      message: `You're ${milestone.remaining} days away from ${milestone.days} days of consistent growth!`,
      timing: new Date().toISOString(),
      priority: 'low',
      personalizedElements: {
        userValues: preferences.personalValues,
        currentContext: `approaching_${milestone.days}_days`,
        emotionalRelevance: 'achievement'
      },
      actionable: {
        primaryAction: {
          label: 'View Progress',
          type: 'view_progress'
        }
      },
      respectfulExit: {
        enabled: true,
        message: "Milestones are celebrations, not obligations.",
        pauseOptions: ['1_day']
      }
    };
  }

  // More helper methods would be implemented here...
  private static prioritizeSpacedRepetitionItem(items: SpacedRepetitionItem[], context: any): SpacedRepetitionItem | null {
    // Logic to select the most appropriate item for practice
    return items[0];
  }

  private static checkApproachingMilestone(streak: EmotionalStreak): any {
    const milestones = [7, 14, 30, 60, 100, 365];
    const nextMilestone = milestones.find(m => m > streak.currentStreak);
    
    if (nextMilestone && (nextMilestone - streak.currentStreak) <= 2) {
      return {
        days: nextMilestone,
        remaining: nextMilestone - streak.currentStreak
      };
    }
    
    return null;
  }

  private static filterNudgesByPreferences(nudges: EngagementNudge[], preferences: EngagementPreferences): EngagementNudge[] {
    if (preferences.nudgeStyle === 'none') return [];
    
    return nudges.slice(0, preferences.boundarySettings.maxNudgesPerDay);
  }

  // Message generation methods
  private static getLowEngagementMessage(tone: string, preferences: EngagementPreferences): string {
    const messages = {
      gentle_encouragement: "Your healing journey is always here when you're ready. No pressure, just presence.",
      compassionate_understanding: "Sometimes we need space from growth work. That's perfectly okay and very human.",
      wise_support: "Every season has its rhythm. Trust your inner wisdom about when to engage.",
      playful_invitation: "Your emotional wellness toolkit misses you! But only come back when it feels right."
    };
    
    return messages[tone as keyof typeof messages] || messages.gentle_encouragement;
  }

  private static getReturnMessage(tone: string, preferences: EngagementPreferences, daysAway: number): string {
    const messages = {
      gentle_encouragement: `Welcome back after ${daysAway} days. Your return is an act of self-love.`,
      compassionate_understanding: `${daysAway} days away, and now you're back. Perfect timing, as always.`,
      wise_support: `Your ${daysAway}-day pause was exactly what you needed. Welcome back to yourself.`,
      playful_invitation: `Look who's back after ${daysAway} days! Your emotional wellness journey got even better while you were away.`
    };
    
    return messages[tone as keyof typeof messages] || messages.gentle_encouragement;
  }

  private static getStruggleMessage(tone: string, preferences: EngagementPreferences, skillName: string): string {
    const messages = {
      gentle_encouragement: `${skillName} feels challenging right now, and that's completely normal. Growth often feels uncomfortable.`,
      compassionate_understanding: `Struggling with ${skillName}? You're not behind. You're exactly where you need to be.`,
      wise_support: `${skillName} is teaching you something important through this difficulty. Trust the process.`,
      playful_invitation: `${skillName} is being a tough teacher today! Want to approach it from a different angle?`
    };
    
    return messages[tone as keyof typeof messages] || messages.gentle_encouragement;
  }

  private static getMilestoneMessage(tone: string, milestone: any): string {
    return `You're approaching ${milestone.days} days of emotional wellness practice. Each day has been a choice to prioritize your healing.`;
  }

  private static getEmotionalSupportMessage(tone: string, preferences: EngagementPreferences): string {
    const messages = {
      gentle_encouragement: "This feels like a difficult moment. You don't have to carry this alone.",
      compassionate_understanding: "I notice you might be struggling. Your feelings are valid, and support is available.",
      wise_support: "Difficult emotions are information, not judgment. What might they be trying to tell you?",
      playful_invitation: "Tough emotional weather today? Let's find some shelter and warmth together."
    };
    
    return messages[tone as keyof typeof messages] || messages.gentle_encouragement;
  }

  // Analytics helper methods (simplified implementations)
  private static extractOptimalTimes(nudges: EngagementNudge[]): string[] {
    // Analyze when nudges were most successful
    return ['09:00', '19:00'];
  }

  private static extractPreferredNudgeTypes(nudges: EngagementNudge[]): string[] {
    // Analyze which types of nudges users responded to
    return ['check_in_reminder', 'gentle_return'];
  }

  private static calculateSpacedRepetitionEffectiveness(items: SpacedRepetitionItem[]): number {
    // Calculate how well spaced repetition is working
    return 0.75;
  }

  private static calculateUserSatisfaction(items: SpacedRepetitionItem[]): number {
    // Calculate average user ratings
    const ratings = items.filter(item => item.userRating).map(item => item.userRating!);
    return ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 3;
  }

  private static detectOverengagement(nudges: EngagementNudge[], pauseRequests: any[]): number {
    // Detect if user is being overwhelmed
    return pauseRequests.length;
  }

  private static detectTraumaResponseIndicators(items: SpacedRepetitionItem[], pauseRequests: any[]): number {
    // Detect patterns that might indicate trauma responses
    const overwhelmingResponses = items.filter(item => item.lastPerformance === 'struggled').length;
    return overwhelmingResponses + pauseRequests.length;
  }

  private static generateAdaptationSuggestions(analytics: {
    responseRate: number;
    userSatisfaction: number;
    overengagementWarnings: number;
    traumaIndicators: number;
  }): string[] {
    const suggestions: string[] = [];
    
    if (analytics.responseRate < 0.3) {
      suggestions.push('Reduce nudge frequency');
      suggestions.push('Personalize timing based on user activity');
    }
    
    if (analytics.userSatisfaction < 3) {
      suggestions.push('Improve content relevance');
      suggestions.push('Increase emotional safety measures');
    }
    
    if (analytics.overengagementWarnings > 2) {
      suggestions.push('Implement stricter boundary enforcement');
      suggestions.push('Add more pause options');
    }
    
    if (analytics.traumaIndicators > 3) {
      suggestions.push('Increase trauma-informed modifications');
      suggestions.push('Reduce complexity of suggested exercises');
    }
    
    return suggestions;
  }
}

export default EngagementSystem;