/**
 * EMOTIONAL SKILL TREE SYSTEM
 * "Duolingo for Emotions" - Revolutionary Healing-Centered Learning
 * 
 * This system provides micro-learning emotional lessons that build genuine
 * emotional intelligence and coping skills through engaging, trauma-informed
 * interactions that prioritize healing over addiction.
 */

import { Timestamp } from 'firebase/firestore';

// Core Emotional Competencies
export type EmotionalCompetency = 
  | 'emotional_awareness'
  | 'self_regulation' 
  | 'social_awareness'
  | 'relationship_skills'
  | 'responsible_decision_making'
  | 'trauma_healing'
  | 'boundary_setting'
  | 'self_compassion';

// Skill Trees - Progressive Learning Paths
export interface EmotionalSkillTree {
  id: EmotionalCompetency;
  name: string;
  description: string;
  icon: string;
  color: string; // healing-centered color palette
  totalLevels: number;
  prerequisites: EmotionalCompetency[];
  lessons: EmotionalLesson[];
  // Trauma-informed design
  traumaSensitivity: 'low' | 'medium' | 'high';
  gentleIntroduction: boolean;
  pauseButtons: boolean;
  selfPacedOnly: boolean;
}

// Individual Lessons - 3-5 minute micro-learning
export interface EmotionalLesson {
  id: string;
  skillTreeId: EmotionalCompetency;
  level: number;
  order: number;
  name: string;
  description: string;
  estimatedTime: number; // minutes
  objectives: string[];
  
  // Lesson Content
  introduction: {
    title: string;
    explanation: string;
    realWorldContext: string;
    whyItMatters: string;
  };
  
  exercises: EmotionalExercise[];
  reflection: {
    prompt: string;
    guidingQuestions: string[];
    optional: boolean;
  };
  
  // Learning Outcomes
  skillsLearned: string[];
  realWorldApplications: string[];
  nextSteps: string[];
  
  // Trauma-Informed Design
  contentWarnings: string[];
  gentleReentry: boolean;
  pauseReminders: boolean;
  selfCompassionCheck: boolean;
  
  // Progress Tracking
  completionCriteria: {
    exercisesRequired: number;
    minimumAccuracy?: number; // if applicable
    reflectionRequired: boolean;
    practiceRequired: boolean;
  };
}

// Interactive Exercises - Hands-on skill practice
export interface EmotionalExercise {
  id: string;
  type: 'identification' | 'practice' | 'scenario' | 'reflection' | 'body_awareness' | 'breathing' | 'reframing';
  name: string;
  instructions: string;
  content: any; // exercise-specific content
  
  // Feedback System
  feedback: {
    immediate: boolean;
    encouraging: boolean;
    learning_focused: boolean;
    shame_resistant: boolean;
  };
  
  // Adaptive Learning
  difficulty: 'foundation' | 'intermediate' | 'advanced';
  personalizable: boolean;
  traumaAdaptations: any[];
}

// User Progress in Emotional Learning
export interface EmotionalLearningProgress {
  userId: string;
  lastUpdated: Timestamp;
  
  // Overall Progress
  totalLessonsCompleted: number;
  totalSkillsLearned: number;
  currentStreak: number;
  longestStreak: number;
  averageSessionTime: number; // minutes
  
  // Skill Tree Progress
  treeProgress: Record<EmotionalCompetency, {
    currentLevel: number;
    lessonsCompleted: number;
    totalLessons: number;
    masteryScore: number; // 0-100
    lastPracticed: Timestamp;
    strugglingAreas: string[];
    strengthAreas: string[];
  }>;
  
  // Learning Analytics
  learningStyle: {
    prefersVisual: boolean;
    prefersAudio: boolean;
    prefersKinesthetic: boolean;
    prefersReflection: boolean;
    needsMorePractice: boolean;
    respondsToCelebration: boolean;
  };
  
  // Grace & Healing Metrics
  graceTokensUsed: number;
  healingPausesRequested: number;
  selfCompassionMoments: number;
  boundaryPractices: number;
  emotionalBreakthroughs: number;
  traumaHealingProgress: number; // 0-100
  
  // Personalization Data
  emotionalTriggers: string[];
  copingPreferences: string[];
  supportNeeds: string[];
  celebrationStyle: 'subtle' | 'warm' | 'joyful';
  
  // Real-World Application
  skillsAppliedInLife: Record<string, {
    skill: string;
    situation: string;
    success: boolean;
    learned: string;
    dateApplied: Timestamp;
  }>;
}

// Foundation Skills - Essential emotional literacy
export const FOUNDATION_SKILLS: EmotionalSkillTree = {
  id: 'emotional_awareness',
  name: 'Feeling Translator',
  description: 'Learn to identify, name, and understand your emotions with compassion',
  icon: '🔍',
  color: '#E8F5E8',
  totalLevels: 10,
  prerequisites: [],
  traumaSensitivity: 'low',
  gentleIntroduction: true,
  pauseButtons: true,
  selfPacedOnly: true,
  lessons: [
    {
      id: 'emotion_wheel_intro',
      skillTreeId: 'emotional_awareness',
      level: 1,
      order: 1,
      name: 'The Emotion Wheel - Your Feeling GPS',
      description: 'Discover the rich landscape of human emotions beyond "good" and "bad"',
      estimatedTime: 4,
      objectives: [
        'Identify 8 core emotions',
        'Understand emotion intensity levels',
        'Practice emotion naming without judgment'
      ],
      introduction: {
        title: 'Emotions Are Information',
        explanation: 'Your emotions are like a GPS system for your inner world. They tell you what you need, what matters to you, and how to navigate life with wisdom.',
        realWorldContext: 'When someone asks "How are you feeling?" you\'ll have words beyond "fine" or "stressed"',
        whyItMatters: 'Naming emotions reduces their intensity by 30% and helps you respond instead of react'
      },
      exercises: [
        {
          id: 'emotion_wheel_explore',
          type: 'identification',
          name: 'Emotion Wheel Explorer',
          instructions: 'Look at different emotion words and notice which ones resonate with how you feel right now',
          content: {
            emotions: ['curious', 'hopeful', 'overwhelmed', 'grateful', 'uncertain', 'proud'],
            interactiveWheel: true,
            intensitySlider: true
          },
          feedback: {
            immediate: true,
            encouraging: true,
            learning_focused: true,
            shame_resistant: true
          },
          difficulty: 'foundation',
          personalizable: true,
          traumaAdaptations: ['gentle_pace', 'pause_available', 'no_overwhelming_options']
        }
      ],
      reflection: {
        prompt: 'What did you discover about your emotional vocabulary today?',
        guidingQuestions: [
          'Which emotions were easy to identify?',
          'Which emotions felt new or unfamiliar?',
          'How does it feel to have more words for your experience?'
        ],
        optional: true
      },
      skillsLearned: ['Emotion identification', 'Emotional vocabulary', 'Self-awareness'],
      realWorldApplications: [
        'Check in with yourself during stressful moments',
        'Communicate feelings more clearly to others',
        'Notice emotional patterns in your daily life'
      ],
      nextSteps: [
        'Practice the daily emotion check-in',
        'Use emotion words in conversations',
        'Start noticing what triggers different emotions'
      ],
      contentWarnings: [],
      gentleReentry: true,
      pauseReminders: true,
      selfCompassionCheck: true,
      completionCriteria: {
        exercisesRequired: 1,
        reflectionRequired: false,
        practiceRequired: false
      }
    }
  ]
};

// Self-Regulation Skills
export const SELF_REGULATION_SKILLS: EmotionalSkillTree = {
  id: 'self_regulation',
  name: 'Pause Master',
  description: 'Learn to respond instead of react through breath, body, and mindful awareness',
  icon: '⏸️',
  color: '#F0F8FF',
  totalLevels: 12,
  prerequisites: ['emotional_awareness'],
  traumaSensitivity: 'medium',
  gentleIntroduction: true,
  pauseButtons: true,
  selfPacedOnly: true,
  lessons: [
    {
      id: 'sacred_pause_intro',
      skillTreeId: 'self_regulation',
      level: 1,
      order: 1,
      name: 'The Sacred Pause - Your Superpower',
      description: 'Master the space between trigger and response where all your power lives',
      estimatedTime: 5,
      objectives: [
        'Learn the STOP technique',
        'Practice the 3-breath reset',
        'Create your personal pause ritual'
      ],
      introduction: {
        title: 'The Power Lives in the Pause',
        explanation: 'Between every trigger and response is a sacred space. In this space lives your power to choose. This lesson teaches you how to find and expand that space.',
        realWorldContext: 'When someone says something that usually makes you angry, you can pause, breathe, and respond with wisdom instead of reacting from hurt',
        whyItMatters: 'The pause is where healing happens. It\'s where you break cycles, build trust, and become the person you want to be.'
      },
      exercises: [
        {
          id: 'stop_technique_practice',
          type: 'practice',
          name: 'STOP Technique Master',
          instructions: 'Practice the STOP technique: Stop, Take a breath, Observe, Proceed with intention',
          content: {
            acronym: 'STOP',
            steps: [
              'STOP - Pause whatever you\'re doing',
              'TAKE A BREATH - One deep, intentional breath',
              'OBSERVE - Notice thoughts, feelings, body sensations',
              'PROCEED - Choose your response with intention'
            ],
            practiceScenarios: [
              'Someone interrupts you during a conversation',
              'You receive unexpected criticism',
              'You feel overwhelmed by your to-do list',
              'You make a mistake that embarrasses you'
            ]
          },
          feedback: {
            immediate: true,
            encouraging: true,
            learning_focused: true,
            shame_resistant: true
          },
          difficulty: 'foundation',
          personalizable: true,
          traumaAdaptations: ['paced_breathing', 'grounding_options', 'safety_reminders']
        }
      ],
      reflection: {
        prompt: 'When in your life could the sacred pause be most helpful?',
        guidingQuestions: [
          'What situations usually trigger quick reactions from you?',
          'How did it feel to practice slowing down?',
          'What would change if you could pause before responding?'
        ],
        optional: false
      },
      skillsLearned: ['Impulse control', 'Mindful responding', 'Self-regulation'],
      realWorldApplications: [
        'Use STOP before responding to difficult emails',
        'Pause during conflicts to avoid saying hurtful things',
        'Take three breaths before making important decisions'
      ],
      nextSteps: [
        'Practice STOP once daily in low-stakes situations',
        'Notice your personal trigger patterns',
        'Celebrate each time you remember to pause'
      ],
      contentWarnings: ['Mentions conflict scenarios'],
      gentleReentry: true,
      pauseReminders: true,
      selfCompassionCheck: true,
      completionCriteria: {
        exercisesRequired: 1,
        reflectionRequired: true,
        practiceRequired: true
      }
    }
  ]
};

// Skill Tree Registry
export const EMOTIONAL_SKILL_TREES: Record<EmotionalCompetency, EmotionalSkillTree> = {
  emotional_awareness: FOUNDATION_SKILLS,
  self_regulation: SELF_REGULATION_SKILLS,
  // Additional trees would be defined here
  social_awareness: {
    id: 'social_awareness',
    name: 'Body Wisdom',
    description: 'Read emotions in yourself and others through body language, tone, and energy',
    icon: '👁️',
    color: '#FFF8E1',
    totalLevels: 8,
    prerequisites: ['emotional_awareness'],
    traumaSensitivity: 'high',
    gentleIntroduction: true,
    pauseButtons: true,
    selfPacedOnly: true,
    lessons: []
  },
  relationship_skills: {
    id: 'relationship_skills',
    name: 'Boundary Guardian',
    description: 'Build healthy relationships through clear communication and loving boundaries',
    icon: '🛡️',
    color: '#F3E5F5',
    totalLevels: 15,
    prerequisites: ['emotional_awareness', 'self_regulation'],
    traumaSensitivity: 'high',
    gentleIntroduction: true,
    pauseButtons: true,
    selfPacedOnly: true,
    lessons: []
  },
  responsible_decision_making: {
    id: 'responsible_decision_making',
    name: 'Wisdom Keeper',
    description: 'Make decisions aligned with your values and the wellbeing of all',
    icon: '⚖️',
    color: '#E1F5FE',
    totalLevels: 10,
    prerequisites: ['emotional_awareness', 'self_regulation', 'social_awareness'],
    traumaSensitivity: 'medium',
    gentleIntroduction: true,
    pauseButtons: true,
    selfPacedOnly: true,
    lessons: []
  },
  trauma_healing: {
    id: 'trauma_healing',
    name: 'Phoenix Rising',
    description: 'Transform pain into wisdom and post-traumatic stress into post-traumatic growth',
    icon: '🔥',
    color: '#FFF3E0',
    totalLevels: 20,
    prerequisites: ['emotional_awareness', 'self_regulation'],
    traumaSensitivity: 'high',
    gentleIntroduction: true,
    pauseButtons: true,
    selfPacedOnly: true,
    lessons: []
  },
  boundary_setting: {
    id: 'boundary_setting',
    name: 'Gentle Warrior',
    description: 'Protect your energy and honor your needs with fierce compassion',
    icon: '🌟',
    color: '#E8F5E8',
    totalLevels: 12,
    prerequisites: ['emotional_awareness', 'relationship_skills'],
    traumaSensitivity: 'high',
    gentleIntroduction: true,
    pauseButtons: true,
    selfPacedOnly: true,
    lessons: []
  },
  self_compassion: {
    id: 'self_compassion',
    name: 'Storm Surfer',
    description: 'Navigate life\'s storms with kindness, resilience, and unshakeable self-love',
    icon: '🌊',
    color: '#F0F8FF',
    totalLevels: 14,
    prerequisites: ['emotional_awareness'],
    traumaSensitivity: 'low',
    gentleIntroduction: true,
    pauseButtons: true,
    selfPacedOnly: true,
    lessons: []
  }
};

// Learning Engine for Personalization
export class EmotionalLearningEngine {
  /**
   * Recommends next lesson based on user's progress and needs
   */
  static getNextRecommendedLesson(
    progress: EmotionalLearningProgress,
    currentEmotionalState?: string,
    recentJournalData?: any
  ): { lesson: EmotionalLesson; reason: string; urgency: 'low' | 'medium' | 'high' } | null {
    // Analyze user's current needs
    const strugglingAreas = this.identifyStrugglingAreas(progress);
    const strengths = this.identifyStrengths(progress);
    const emotionalTriggers = progress.emotionalTriggers;
    
    // If user is struggling with regulation and current state indicates distress
    if (currentEmotionalState && ['overwhelmed', 'angry', 'anxious'].includes(currentEmotionalState)) {
      const regulationLesson = this.findNextAvailableLesson(progress, 'self_regulation');
      if (regulationLesson) {
        return {
          lesson: regulationLesson,
          reason: 'This lesson can help with the overwhelm you\'re experiencing right now',
          urgency: 'high'
        };
      }
    }
    
    // Regular progression through skill trees
    const nextLesson = this.findOptimalNextLesson(progress);
    if (nextLesson) {
      return {
        lesson: nextLesson,
        reason: 'Perfect next step in your emotional learning journey',
        urgency: 'medium'
      };
    }
    
    return null;
  }
  
  /**
   * Adapts lesson content based on user's trauma history and preferences
   */
  static adaptLessonForUser(
    lesson: EmotionalLesson,
    progress: EmotionalLearningProgress
  ): EmotionalLesson {
    const adaptedLesson = { ...lesson };
    
    // Trauma-informed adaptations
    if (progress.emotionalTriggers.length > 0) {
      adaptedLesson.pauseReminders = true;
      adaptedLesson.selfCompassionCheck = true;
      
      // Add more breaks for trauma-sensitive content
      if (lesson.traumaSensitivity === 'high') {
        adaptedLesson.exercises = adaptedLesson.exercises.map(exercise => ({
          ...exercise,
          traumaAdaptations: [
            ...exercise.traumaAdaptations,
            'frequent_breaks',
            'grounding_prompts',
            'safety_affirmations'
          ]
        }));
      }
    }
    
    // Learning style adaptations
    const learningStyle = progress.learningStyle;
    if (learningStyle.prefersVisual) {
      // Add visual aids to exercises
    }
    if (learningStyle.needsMorePractice) {
      // Add additional practice exercises
    }
    
    return adaptedLesson;
  }
  
  private static identifyStrugglingAreas(progress: EmotionalLearningProgress): EmotionalCompetency[] {
    return Object.entries(progress.treeProgress)
      .filter(([_, treeProgress]) => 
        treeProgress.masteryScore < 70 && treeProgress.strugglingAreas.length > 0
      )
      .map(([competency, _]) => competency as EmotionalCompetency);
  }
  
  private static identifyStrengths(progress: EmotionalLearningProgress): EmotionalCompetency[] {
    return Object.entries(progress.treeProgress)
      .filter(([_, treeProgress]) => treeProgress.masteryScore >= 80)
      .map(([competency, _]) => competency as EmotionalCompetency);
  }
  
  private static findNextAvailableLesson(
    progress: EmotionalLearningProgress,
    competency: EmotionalCompetency
  ): EmotionalLesson | null {
    const tree = EMOTIONAL_SKILL_TREES[competency];
    const userTreeProgress = progress.treeProgress[competency];
    
    if (!tree || !userTreeProgress) return null;
    
    // Find first incomplete lesson in the tree
    return tree.lessons.find(lesson => 
      lesson.level === userTreeProgress.currentLevel &&
      lesson.order === userTreeProgress.lessonsCompleted + 1
    ) || null;
  }
  
  private static findOptimalNextLesson(progress: EmotionalLearningProgress): EmotionalLesson | null {
    // Implementation would analyze all available trees and find the best next step
    // based on prerequisites, user preferences, and learning progression
    return null;
  }
}

// Export everything
export type {
  EmotionalSkillTree,
  EmotionalLesson,
  EmotionalExercise,
  EmotionalLearningProgress,
  EmotionalCompetency
};

export {
  EMOTIONAL_SKILL_TREES,
  EmotionalLearningEngine
};