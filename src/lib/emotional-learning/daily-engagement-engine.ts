/**
 * ALCHM Daily Engagement Engine
 * Creating Duolingo-level engagement while respecting trauma-informed principles
 * "Make emotional growth irresistible, never obligatory"
 */

import { Timestamp } from 'firebase/firestore';
import type { EmotionalCompetency } from './emotional-skill-tree';
import type { HealingBadge } from './badge-ecosystem';

export interface DailyEmotionalLearningSession {
  id: string;
  date: Date;
  sessionType: 'morning_check_in' | 'skill_practice' | 'evening_reflection' | 'micro_intervention';
  
  // Adaptive Content
  personalizedContent: {
    primarySkill: EmotionalCompetency;
    practiceExercises: MicroEmotionalExercise[];
    reflectionPrompts: string[];
    creativeExpression?: 'voice' | 'art' | 'movement' | 'poetry';
  };
  
  // Engagement Mechanics
  completionRewards: {
    xp: number;
    badgeProgress: Record<string, number>;
    streakContribution: boolean;
    communityImpact?: string;
  };
  
  // Trauma-Informed Features
  capacityAdaptation: {
    difficulty: 'minimal' | 'gentle' | 'moderate' | 'challenging';
    duration: number; // minutes
    pauseOptions: string[];
    alternativeApproaches: string[];
  };
  
  // Real-World Integration
  applicationOpportunities: {
    todaysChallenge: string;
    practiceReminders: string[];
    celebrationMoments: string[];
  };
}

export interface MicroEmotionalExercise {
  id: string;
  name: string;
  description: string;
  competency: EmotionalCompetency;
  
  // Exercise Design
  format: 'guided_reflection' | 'somatic_awareness' | 'cognitive_reframe' | 'creative_expression' | 'micro_intervention';
  duration: number; // seconds
  difficulty: number; // 1-10
  
  // Learning Outcomes
  learningObjective: string;
  realWorldApplication: string;
  masteryIndicator: string;
  
  // Adaptive Features
  personalizations: {
    traumaAdaptation?: string;
    culturalConsideration?: string;
    nervousSystemState?: 'calm' | 'activated' | 'shutdown';
  };
  
  // Engagement Elements
  gamification: {
    pointsAwarded: number;
    progressContribution: number;
    communityChallenge?: boolean;
  };
}

export interface DailyEngagementPattern {
  userId: string;
  
  // Engagement Analytics
  consistency: {
    currentStreak: number;
    longestStreak: number;
    weeklyPattern: number[]; // 7-day pattern
    preferredTimes: string[];
    averageSessionLength: number;
  };
  
  // Learning Progress
  skillDevelopment: {
    primaryFocusSkill: EmotionalCompetency;
    skillVelocity: number; // Rate of improvement
    transferToRealWorld: number; // Success in application
    retentionRate: number; // Knowledge retention over time
  };
  
  // Motivation Drivers
  intrinsicMotivation: {
    autonomy: number; // Feeling of choice and control
    mastery: number; // Sense of skill development
    purpose: number; // Connection to meaningful goals
    relatedness: number; // Community connection
  };
  
  // Trauma-Informed Patterns
  capacityTracking: {
    typeof window !== 'undefined' && windowOfTolerance: number[];
    recoveryPatterns: string[];
    supportNeeds: string[];
    preferredAdaptations: string[];
  };
}

export class DailyEngagementEngine {
  /**
   * Generate personalized daily learning session
   */
  static generateDailySession(
    userId: string,
    userProgress: any,
    nervousSystemState: any,
    preferences: any
  ): DailyEmotionalLearningSession {
    
    // Determine optimal session type based on time and user patterns
    const sessionType = this.determineOptimalSessionType(userId, userProgress);
    
    // Select primary skill based on learning trajectory
    const primarySkill = this.selectPrimarySkillFocus(userProgress, nervousSystemState);
    
    // Generate adaptive exercises
    const practiceExercises = this.generateAdaptiveExercises(
      primarySkill,
      nervousSystemState,
      preferences
    );
    
    // Create engagement rewards
    const completionRewards = this.calculateEngagementRewards(
      sessionType,
      primarySkill,
      userProgress
    );
    
    // Adapt for trauma-informed delivery
    const capacityAdaptation = this.adaptForCurrentCapacity(
      nervousSystemState,
      userProgress.capacityHistory
    );
    
    return {
      id: `session_${Date.now()}`,
      date: new Date(),
      sessionType,
      personalizedContent: {
        primarySkill,
        practiceExercises,
        reflectionPrompts: this.generateReflectionPrompts(primarySkill, sessionType),
        creativeExpression: this.suggestCreativeModality(nervousSystemState, primarySkill)
      },
      completionRewards,
      capacityAdaptation,
      applicationOpportunities: this.generateRealWorldApplications(primarySkill)
    };
  }
  
  /**
   * Create micro-exercises that feel like games but build real skills
   */
  static generateAdaptiveExercises(
    primarySkill: EmotionalCompetency,
    nervousSystemState: any,
    preferences: any
  ): MicroEmotionalExercise[] {
    
    const exerciseTemplates = {
      emotional_awareness: [
        {
          name: "Emotion Detective",
          description: "Notice and name the emotion you're feeling right now",
          format: 'guided_reflection' as const,
          duration: 60,
          learningObjective: "Increase speed and accuracy of emotion identification",
          realWorldApplication: "Recognize emotions as they arise in daily situations",
          masteryIndicator: "Can name specific emotions within 5 seconds"
        },
        {
          name: "Body Emotion Scan",
          description: "Find where this emotion lives in your body",
          format: 'somatic_awareness' as const,
          duration: 90,
          learningObjective: "Connect emotional experience to physical sensations",
          realWorldApplication: "Use body awareness to catch emotions early",
          masteryIndicator: "Consistently identify somatic emotional signals"
        }
      ],
      self_regulation: [
        {
          name: "Pause Power",
          description: "Practice the sacred pause between trigger and response",
          format: 'micro_intervention' as const,
          duration: 45,
          learningObjective: "Strengthen neural pathway for pause response",
          realWorldApplication: "Pause before reactive responses in conflicts",
          masteryIndicator: "Successfully pause 80% of the time when triggered"
        },
        {
          name: "Breath Bridge",
          description: "Use breathing to shift your emotional state",
          format: 'somatic_awareness' as const,
          duration: 120,
          learningObjective: "Master breath-based emotional regulation",
          realWorldApplication: "Calm anxiety or anger using breath techniques",
          masteryIndicator: "Can shift emotional state within 2 minutes using breath"
        }
      ]
    };
    
    const templates = exerciseTemplates[primarySkill] || exerciseTemplates.emotional_awareness;
    
    return templates.map(template => ({
      id: `exercise_${Date.now()}_${Math.random()}`,
      competency: primarySkill,
      difficulty: nervousSystemState.regulationCapacity === 'minimal' ? 3 : 
                  nervousSystemState.regulationCapacity === 'moderate' ? 6 : 8,
      personalizations: {
        nervousSystemState: nervousSystemState.current,
        traumaAdaptation: nervousSystemState.traumaInformed ? 
          "Extra emphasis on choice and agency - you can modify or stop anytime" : undefined
      },
      gamification: {
        pointsAwarded: 25,
        progressContribution: 10,
        communityChallenge: Math.random() > 0.7
      },
      ...template
    }));
  }
  
  /**
   * Calculate engagement rewards that feel meaningful, not manipulative
   */
  static calculateEngagementRewards(
    sessionType: DailyEmotionalLearningSession['sessionType'],
    primarySkill: EmotionalCompetency,
    userProgress: any
  ): DailyEmotionalLearningSession['completionRewards'] {
    
    const baseXP = {
      morning_check_in: 15,
      skill_practice: 30,
      evening_reflection: 20,
      micro_intervention: 25
    }[sessionType];
    
    // Bonus XP for consistency and growth
    const consistencyBonus = userProgress.currentStreak > 7 ? 10 : 
                           userProgress.currentStreak > 3 ? 5 : 0;
    
    const badgeProgress = this.calculateBadgeProgress(sessionType, primarySkill, userProgress);
    
    return {
      xp: baseXP + consistencyBonus,
      badgeProgress,
      streakContribution: true,
      communityImpact: Math.random() > 0.8 ? 
        "Your practice today contributed to the community's collective emotional intelligence growth" : 
        undefined
    };
  }
  
  /**
   * Generate real-world application opportunities
   */
  static generateRealWorldApplications(
    primarySkill: EmotionalCompetency
  ): DailyEmotionalLearningSession['applicationOpportunities'] {
    
    const applicationTemplates = {
      emotional_awareness: {
        todaysChallenge: "Notice and name 3 emotions you experience today",
        practiceReminders: [
          "Before responding to a text, ask: 'What am I feeling right now?'",
          "During transitions, pause and check: 'How is my emotional state?'",
          "When someone asks 'How are you?', give an emotionally specific answer"
        ],
        celebrationMoments: [
          "Celebrate when you catch an emotion as it arises",
          "Acknowledge yourself for emotional honesty",
          "Notice how emotional awareness changes your interactions"
        ]
      },
      self_regulation: {
        todaysChallenge: "Use the pause technique once in a real situation",
        practiceReminders: [
          "Before responding to frustration, take one conscious breath",
          "When feeling overwhelmed, ask: 'What do I need right now?'",
          "Practice self-soothing when you notice emotional activation"
        ],
        celebrationMoments: [
          "Celebrate choosing your response instead of reacting",
          "Acknowledge when you self-soothe successfully",
          "Notice how regulation affects your relationships"
        ]
      }
    };
    
    return applicationTemplates[primarySkill] || applicationTemplates.emotional_awareness;
  }
  
  // Helper methods
  private static determineOptimalSessionType(
    userId: string,
    userProgress: any
  ): DailyEmotionalLearningSession['sessionType'] {
    const hour = new Date().getHours();
    
    if (hour < 10) return 'morning_check_in';
    if (hour > 18) return 'evening_reflection';
    if (userProgress.needsSupport) return 'micro_intervention';
    return 'skill_practice';
  }
  
  private static selectPrimarySkillFocus(
    userProgress: any,
    nervousSystemState: any
  ): EmotionalCompetency {
    // Prioritize based on current needs and development stage
    if (nervousSystemState.regulationCapacity === 'minimal') {
      return 'self_regulation';
    }
    
    // Return the skill with highest growth potential
    return userProgress.skillGaps?.[0] || 'emotional_awareness';
  }
  
  private static generateReflectionPrompts(
    skill: EmotionalCompetency,
    sessionType: DailyEmotionalLearningSession['sessionType']
  ): string[] {
    const prompts = {
      emotional_awareness: [
        "What emotion is asking for your attention right now?",
        "How has this emotion served you today?",
        "What would this emotion say if it could speak?"
      ],
      self_regulation: [
        "When did you successfully manage a difficult emotion today?",
        "What self-soothing technique felt most nurturing?",
        "How did pausing change the outcome of a situation?"
      ]
    };
    
    return prompts[skill] || prompts.emotional_awareness;
  }
  
  private static suggestCreativeModality(
    nervousSystemState: any,
    skill: EmotionalCompetency
  ): 'voice' | 'art' | 'movement' | 'poetry' | undefined {
    if (nervousSystemState.regulationCapacity === 'minimal') {
      return 'movement'; // Most regulating
    }
    
    const suggestions = {
      emotional_awareness: 'art',
      self_regulation: 'voice',
      trauma_healing: 'movement',
      relationship_skills: 'poetry'
    };
    
    return suggestions[skill as keyof typeof suggestions] || 'art';
  }
  
  private static adaptForCurrentCapacity(
    nervousSystemState: any,
    capacityHistory: any[]
  ): DailyEmotionalLearningSession['capacityAdaptation'] {
    const capacity = nervousSystemState.regulationCapacity;
    
    return {
      difficulty: capacity === 'minimal' ? 'minimal' :
                 capacity === 'limited' ? 'gentle' :
                 capacity === 'moderate' ? 'moderate' : 'challenging',
      duration: capacity === 'minimal' ? 2 :
               capacity === 'limited' ? 5 :
               capacity === 'moderate' ? 8 : 12,
      pauseOptions: [
        "Take a break and return later",
        "Switch to a gentler exercise",
        "End session with self-compassion"
      ],
      alternativeApproaches: [
        "Try the creative expression option instead",
        "Focus on breathing and body awareness",
        "Just observe without trying to change anything"
      ]
    };
  }
  
  private static calculateBadgeProgress(
    sessionType: string,
    skill: EmotionalCompetency,
    userProgress: any
  ): Record<string, number> {
    // This would calculate actual badge progress based on completed activities
    return {
      'daily_practitioner': 10,
      [`${skill}_apprentice`]: 15,
      'consistency_champion': 5
    };
  }
}


export type {
  DailyEmotionalLearningSession,
  MicroEmotionalExercise,
  DailyEngagementPattern
};