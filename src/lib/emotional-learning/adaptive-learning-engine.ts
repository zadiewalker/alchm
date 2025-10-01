/**
 * ADAPTIVE LEARNING ENGINE
 * "Personalized Emotional Intelligence Education"
 * 
 * Revolutionary learning engine that adapts content, pacing, and approach based on
 * user's emotional patterns, trauma history, learning style, and current needs.
 * Prioritizes healing and genuine skill development over engagement metrics.
 */

import { Timestamp } from 'firebase/firestore';
import type { 
  EmotionalSkillTree, 
  EmotionalLesson, 
  EmotionalLearningProgress, 
  EmotionalCompetency 
} from './emotional-skill-tree';
import type { HealingBadge, BadgeUnlockTrigger } from './badge-ecosystem';

// Learning Personalization Types
export interface LearningPersonalization {
  userId: string;
  lastUpdated: Timestamp;
  
  // Emotional Patterns Analysis
  emotionalPatterns: {
    dominantEmotions: string[]; // Most frequently experienced
    emotionalTriggers: string[]; // Known trigger patterns
    regulationStrengths: EmotionalCompetency[]; // Areas of natural skill
    regulationChallenges: EmotionalCompetency[]; // Areas needing support
    traumaResponsePatterns: string[]; // Fight/flight/freeze/fawn patterns
    healingResilience: number; // 0-100 capacity for processing difficult content
  };
  
  // Learning Style Profile
  learningStyle: {
    cognitivePreferences: {
      visual: number; // 0-100 preference scores
      auditory: number;
      kinesthetic: number;
      reading: number;
    };
    emotionalProcessing: {
      needsTime: boolean; // Requires extended processing time
      prefersGentle: boolean; // Gentle vs direct approach
      respondsToStories: boolean; // Narrative-based learning
      needsFrequentBreaks: boolean; // Attention/energy considerations
    };
    practicePreferences: {
      likesReflection: boolean;
      prefersPractical: boolean; // Hands-on vs theoretical
      needsRepetition: boolean; // Multiple exposures to same concept
      respondsToEncouragement: boolean;
    };
  };
  
  // Trauma-Informed Adaptations
  traumaAdaptations: {
    anxietyTriggers: string[]; // Content that increases anxiety
    panicTriggers: string[]; // Content that might trigger panic
    dissociationRisk: boolean; // Needs grounding reminders
    needsExtraChoice: boolean; // Requires opt-in for all content
    requiresSlowPace: boolean; // Needs extended time between lessons
    benefitsFromSomaticWork: boolean; // Body-based practices help
  };
  
  // Current Emotional State Context
  currentContext: {
    overallWellbeing: number; // 0-100 current emotional capacity
    stressLevel: number; // 0-100 current stress
    crisisRisk: boolean; // Elevated risk indicators
    recentTrauma: boolean; // Processing recent difficult events
    supportSystemStrength: number; // 0-100 available support
    motivationLevel: number; // 0-100 energy for learning
  };
  
  // Learning Efficacy Tracking
  learningMetrics: {
    retentionRate: number; // 0-100 how well skills are retained
    transferRate: number; // 0-100 how well skills transfer to real world
    engagementQuality: number; // 0-100 depth of engagement (not time)
    skillApplication: number; // 0-100 real-world application success
    healingProgress: number; // 0-100 overall emotional healing trajectory
  };
}

// Adaptive Learning Recommendations
export interface LearningRecommendation {
  type: 'lesson' | 'practice' | 'reflection' | 'break' | 'support';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Content Recommendations
  recommendedLesson?: EmotionalLesson;
  adaptedContent?: AdaptedLessonContent;
  practiceExercise?: any;
  
  // Reasoning
  reason: string;
  userBenefit: string;
  healingRationale: string;
  
  // Timing & Pacing
  optimalTiming: {
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'flexible';
    daysUntilReady: number;
    estimatedDuration: number; // minutes
    preparationNeeded: boolean;
  };
  
  // Trauma-Informed Safeguards
  safeguards: {
    contentWarnings: string[];
    requiredBreaks: boolean;
    pauseReminders: boolean;
    groundingSupport: boolean;
    crisisResources: string[];
  };
}

// Adapted Content Based on Personalization
export interface AdaptedLessonContent {
  originalLesson: EmotionalLesson;
  adaptations: {
    // Content Modifications
    simplifiedLanguage?: boolean;
    addedVisuals?: boolean;
    extendedExplanations?: boolean;
    additionalExamples?: string[];
    culturalAdaptations?: any[];
    
    // Pacing Modifications
    extendedTimeEstimate?: number;
    additionalBreaks?: number;
    gentlerProgression?: boolean;
    optionalAdvancedContent?: any;
    
    // Trauma-Informed Modifications
    softened?: boolean; // Gentler approach to difficult topics
    choiceEnhanced?: boolean; // More opt-in elements
    groundingAdded?: boolean; // Somatic practices integrated
    safetyReminders?: string[];
    
    // Learning Style Modifications
    visualAids?: any[];
    audioComponents?: any[];
    kinestheticElements?: any[];
    narrativeFraming?: string;
  };
  
  personalizedObjectives: string[];
  customizedReflection: {
    prompt: string;
    guidingQuestions: string[];
    adaptedForUser: boolean;
  };
}

// Healing-Centered Learning Analytics
export interface HealingLearningAnalytics {
  userId: string;
  sessionId: string;
  timestamp: Timestamp;
  
  // Engagement Quality (not quantity)
  engagementQuality: {
    emotionalDepth: number; // 0-100 depth of emotional engagement
    genuineReflection: boolean; // Real contemplation vs surface completion
    selfCompassionPresent: boolean; // Kind vs critical self-talk
    vulnerabilityLevel: number; // 0-100 willingness to be vulnerable
    insightGenerated: boolean; // Real learning occurred
  };
  
  // Healing Indicators
  healingProgress: {
    selfAwarenessIncrease: number; // -100 to 100 change
    regulationSkillImprovement: number; // -100 to 100 change
    boundaryStrengthening: number; // -100 to 100 change
    selfCompassionGrowth: number; // -100 to 100 change
    traumaHealingMovement: number; // -100 to 100 change
  };
  
  // Red Flags - Trauma-Informed Monitoring
  concernIndicators: {
    dissociationSigns: boolean;
    anxietySpike: boolean;
    overwhelmIndicated: boolean;
    crisisLanguage: boolean;
    avoidancePatterns: boolean;
  };
  
  // Positive Indicators
  growthSigns: {
    newInsightReported: boolean;
    skillPracticedOutsideApp: boolean;
    boundarySetSuccessfully: boolean;
    supportSoughtWhenNeeded: boolean;
    authenticityChosenOverPerfection: boolean;
  };
}

// Main Adaptive Learning Engine
export class AdaptiveLearningEngine {
  /**
   * Generate personalized learning recommendation based on user's full context
   */
  static async generateRecommendation(
    personalization: LearningPersonalization,
    recentProgress: EmotionalLearningProgress,
    currentEmotionalState?: any,
    recentJournalData?: any
  ): Promise<LearningRecommendation> {
    
    // Crisis/Safety Assessment First
    if (this.assessCrisisRisk(personalization, currentEmotionalState)) {
      return this.generateCrisisSupport(personalization);
    }
    
    // Trauma-Informed Capacity Check
    const capacity = this.assessLearningCapacity(personalization, currentEmotionalState);
    if (capacity === 'rest') {
      return this.generateRestRecommendation(personalization);
    }
    
    // Identify Learning Priorities
    const priorities = this.identifyLearningPriorities(
      personalization,
      recentProgress,
      currentEmotionalState,
      recentJournalData
    );
    
    // Generate Adaptive Content
    const recommendation = await this.createPersonalizedRecommendation(
      priorities,
      personalization,
      capacity
    );
    
    return recommendation;
  }
  
  /**
   * Adapt lesson content based on user's personalization profile
   */
  static adaptLesson(
    lesson: EmotionalLesson,
    personalization: LearningPersonalization
  ): AdaptedLessonContent {
    
    const adaptations: AdaptedLessonContent['adaptations'] = {};
    
    // Learning Style Adaptations
    if (personalization.learningStyle.cognitivePreferences.visual > 70) {
      adaptations.visualAids = this.generateVisualAids(lesson);
    }
    
    if (personalization.learningStyle.emotionalProcessing.needsTime) {
      adaptations.extendedTimeEstimate = lesson.estimatedTime * 1.5;
      adaptations.additionalBreaks = Math.ceil(lesson.exercises.length / 2);
    }
    
    if (personalization.learningStyle.emotionalProcessing.prefersGentle) {
      adaptations.softened = true;
      adaptations.gentlerProgression = true;
    }
    
    // Trauma-Informed Adaptations
    if (personalization.traumaAdaptations.requiresSlowPace) {
      adaptations.gentlerProgression = true;
      adaptations.extendedTimeEstimate = lesson.estimatedTime * 2;
    }
    
    if (personalization.traumaAdaptations.dissociationRisk) {
      adaptations.groundingAdded = true;
      adaptations.safetyReminders = [
        'Remember: You are safe in this moment',
        'Take a moment to feel your feet on the ground',
        'Notice three things you can see around you'
      ];
    }
    
    if (personalization.traumaAdaptations.needsExtraChoice) {
      adaptations.choiceEnhanced = true;
    }
    
    // Content Difficulty Adaptations
    if (personalization.emotionalPatterns.healingResilience < 50) {
      adaptations.simplifiedLanguage = true;
      adaptations.extendedExplanations = true;
    }
    
    // Personalized Objectives
    const personalizedObjectives = this.personalizeObjectives(
      lesson.objectives,
      personalization.emotionalPatterns.regulationChallenges
    );
    
    // Customized Reflection
    const customizedReflection = this.personalizeReflection(
      lesson.reflection,
      personalization
    );
    
    return {
      originalLesson: lesson,
      adaptations,
      personalizedObjectives,
      customizedReflection
    };
  }
  
  /**
   * Update personalization based on user's learning analytics
   */
  static updatePersonalization(
    currentPersonalization: LearningPersonalization,
    analytics: HealingLearningAnalytics,
    skillApplications: any[]
  ): LearningPersonalization {
    
    const updated = { ...currentPersonalization };
    
    // Update Learning Metrics
    if (analytics.engagementQuality.insightGenerated) {
      updated.learningMetrics.retentionRate += 2;
    }
    
    if (skillApplications.length > 0) {
      updated.learningMetrics.transferRate += 5;
      updated.learningMetrics.skillApplication += 3;
    }
    
    // Update Emotional Patterns
    if (analytics.healingProgress.selfAwarenessIncrease > 0) {
      updated.emotionalPatterns.healingResilience += 1;
    }
    
    // Update Trauma Adaptations Based on Response
    if (analytics.concernIndicators.anxietySpike) {
      updated.traumaAdaptations.requiresSlowPace = true;
    }
    
    if (analytics.concernIndicators.dissociationSigns) {
      updated.traumaAdaptations.dissociationRisk = true;
      updated.traumaAdaptations.benefitsFromSomaticWork = true;
    }
    
    // Update Learning Style
    if (analytics.engagementQuality.genuineReflection) {
      updated.learningStyle.practicePreferences.likesReflection = true;
    }
    
    updated.lastUpdated = Timestamp.now();
    
    return updated;
  }
  
  /**
   * Assess if user is in crisis and needs support resources
   */
  private static assessCrisisRisk(
    personalization: LearningPersonalization,
    currentState?: any
  ): boolean {
    if (personalization.currentContext.crisisRisk) return true;
    if (personalization.currentContext.overallWellbeing < 30) return true;
    if (currentState?.indicators?.includes('crisis')) return true;
    return false;
  }
  
  /**
   * Assess user's current capacity for learning
   */
  private static assessLearningCapacity(
    personalization: LearningPersonalization,
    currentState?: any
  ): 'high' | 'medium' | 'low' | 'rest' {
    const wellbeing = personalization.currentContext.overallWellbeing;
    const motivation = personalization.currentContext.motivationLevel;
    const stress = personalization.currentContext.stressLevel;
    
    if (wellbeing < 40 || stress > 80) return 'rest';
    if (wellbeing < 60 || motivation < 40) return 'low';
    if (wellbeing < 80 || motivation < 70) return 'medium';
    return 'high';
  }
  
  /**
   * Identify what the user most needs to learn right now
   */
  private static identifyLearningPriorities(
    personalization: LearningPersonalization,
    progress: EmotionalLearningProgress,
    currentState?: any,
    journalData?: any
  ): EmotionalCompetency[] {
    const priorities: EmotionalCompetency[] = [];
    
    // Current emotional state priorities
    if (currentState?.overwhelmed) {
      priorities.push('self_regulation');
    }
    
    if (currentState?.isolated) {
      priorities.push('relationship_skills');
    }
    
    // Pattern-based priorities
    if (personalization.emotionalPatterns.regulationChallenges.length > 0) {
      priorities.push(...personalization.emotionalPatterns.regulationChallenges);
    }
    
    // Progress-based priorities (what's next in their journey)
    const nextLogicalStep = this.getNextLogicalStep(progress);
    if (nextLogicalStep) {
      priorities.push(nextLogicalStep);
    }
    
    return Array.from(new Set(priorities)); // Remove duplicates
  }
  
  private static async createPersonalizedRecommendation(
    priorities: EmotionalCompetency[],
    personalization: LearningPersonalization,
    capacity: 'high' | 'medium' | 'low' | 'rest'
  ): Promise<LearningRecommendation> {
    
    // Find the most appropriate lesson based on priorities and capacity
    const topPriority = priorities[0];
    const lesson = this.findAppropriateLesson(topPriority, capacity);
    
    if (!lesson) {
      return this.generateRestRecommendation(personalization);
    }
    
    const adaptedContent = this.adaptLesson(lesson, personalization);
    
    return {
      type: 'lesson',
      priority: this.determinePriority(topPriority, personalization),
      recommendedLesson: lesson,
      adaptedContent,
      reason: `This lesson addresses your current need for ${topPriority.replace('_', ' ')} skills`,
      userBenefit: `You'll gain practical tools for ${this.getBenefitDescription(topPriority)}`,
      healingRationale: `Building ${topPriority.replace('_', ' ')} skills will support your healing journey by ${this.getHealingBenefit(topPriority)}`,
      optimalTiming: {
        timeOfDay: this.getOptimalTiming(personalization),
        daysUntilReady: capacity === 'low' ? 2 : 0,
        estimatedDuration: adaptedContent.adaptations.extendedTimeEstimate || lesson.estimatedTime,
        preparationNeeded: personalization.traumaAdaptations.needsExtraChoice
      },
      safeguards: {
        contentWarnings: lesson.contentWarnings,
        requiredBreaks: adaptedContent.adaptations.additionalBreaks ? true : false,
        pauseReminders: lesson.pauseReminders,
        groundingSupport: adaptedContent.adaptations.groundingAdded || false,
        crisisResources: ['Crisis Text Line: Text HOME to 741741', 'National Suicide Prevention Lifeline: 988']
      }
    };
  }
  
  private static generateCrisisSupport(personalization: LearningPersonalization): LearningRecommendation {
    return {
      type: 'support',
      priority: 'urgent',
      reason: 'Your wellbeing is the top priority right now',
      userBenefit: 'You\'ll get the immediate support you need',
      healingRationale: 'Taking care of your immediate needs is the foundation for all other healing work',
      optimalTiming: {
        daysUntilReady: 0,
        estimatedDuration: 0,
        preparationNeeded: false
      },
      safeguards: {
        contentWarnings: [],
        requiredBreaks: false,
        pauseReminders: false,
        groundingSupport: true,
        crisisResources: [
          'Crisis Text Line: Text HOME to 741741',
          'National Suicide Prevention Lifeline: 988',
          'SAMHSA National Helpline: 1-800-662-4357'
        ]
      }
    };
  }
  
  private static generateRestRecommendation(personalization: LearningPersonalization): LearningRecommendation {
    return {
      type: 'break',
      priority: 'high',
      reason: 'Rest is a form of healing, and your system needs care right now',
      userBenefit: 'You\'ll restore your emotional capacity for learning',
      healingRationale: 'Honoring your need for rest builds self-trust and prevents overwhelm',
      optimalTiming: {
        daysUntilReady: Math.max(1, Math.floor(personalization.currentContext.stressLevel / 20)),
        estimatedDuration: 0,
        preparationNeeded: false
      },
      safeguards: {
        contentWarnings: [],
        requiredBreaks: false,
        pauseReminders: false,
        groundingSupport: false,
        crisisResources: []
      }
    };
  }
  
  // Helper methods (simplified implementations)
  private static generateVisualAids(lesson: EmotionalLesson): any[] {
    return []; // Would generate appropriate visual aids
  }
  
  private static personalizeObjectives(objectives: string[], challenges: EmotionalCompetency[]): string[] {
    return objectives; // Would adapt based on user's specific challenges
  }
  
  private static personalizeReflection(
    reflection: EmotionalLesson['reflection'],
    personalization: LearningPersonalization
  ): AdaptedLessonContent['customizedReflection'] {
    return {
      prompt: reflection.prompt,
      guidingQuestions: reflection.guidingQuestions,
      adaptedForUser: true
    };
  }
  
  private static getNextLogicalStep(progress: EmotionalLearningProgress): EmotionalCompetency | null {
    // Logic to determine next step in user's learning progression
    return null; // Placeholder
  }
  
  private static findAppropriateLesson(priority: EmotionalCompetency, capacity: string): EmotionalLesson | null {
    // Logic to find lesson matching priority and capacity
    return null; // Placeholder
  }
  
  private static determinePriority(competency: EmotionalCompetency, personalization: LearningPersonalization): LearningRecommendation['priority'] {
    if (personalization.currentContext.crisisRisk) return 'urgent';
    if (competency === 'self_regulation' && personalization.currentContext.stressLevel > 70) return 'high';
    return 'medium';
  }
  
  private static getBenefitDescription(competency: EmotionalCompetency): string {
    const descriptions = {
      emotional_awareness: 'understanding and naming your emotions',
      self_regulation: 'managing difficult emotions with wisdom',
      social_awareness: 'reading emotional cues in relationships',
      relationship_skills: 'building healthier connections',
      responsible_decision_making: 'making choices aligned with your values',
      trauma_healing: 'transforming pain into wisdom',
      boundary_setting: 'protecting your energy with love',
      self_compassion: 'treating yourself with kindness'
    };
    return descriptions[competency] || 'emotional growth';
  }
  
  private static getHealingBenefit(competency: EmotionalCompetency): string {
    const benefits = {
      emotional_awareness: 'helping you understand your inner world',
      self_regulation: 'giving you tools to stay grounded during storms',
      social_awareness: 'improving your relationships and connections',
      relationship_skills: 'creating the love and support you deserve',
      responsible_decision_making: 'aligning your choices with your authentic self',
      trauma_healing: 'transforming your pain into wisdom and strength',
      boundary_setting: 'protecting your energy so you can show up authentically',
      self_compassion: 'being your own best friend and supporter'
    };
    return benefits[competency] || 'supporting your overall emotional wellbeing';
  }
  
  private static getOptimalTiming(personalization: LearningPersonalization): LearningRecommendation['optimalTiming']['timeOfDay'] {
    if (personalization.currentContext.stressLevel > 70) return 'morning'; // Before stress accumulates
    if (personalization.learningStyle.emotionalProcessing.needsTime) return 'evening'; // More time to process
    return 'flexible';
  }
}

// Export everything
export {
  AdaptiveLearningEngine
};

export type {
  LearningPersonalization,
  LearningRecommendation,
  AdaptedLessonContent,
  HealingLearningAnalytics
};