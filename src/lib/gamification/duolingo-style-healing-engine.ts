/**
 * DUOLINGO-STYLE HEALING GAMIFICATION ENGINE
 * "Making emotional wellness as engaging as language learning, without the shame"
 * 
 * Revolutionary Approach:
 * - Grace-based streaks that never break, only pause with compassion
 * - Emotional skills progression that honors healing rhythms 
 * - Adaptive learning paths that meet users where they are
 * - Celebration mechanics that foster genuine joy, not manipulation
 * - Daily check-ins that feel like conversations with a wise friend
 * 
 * Core Philosophy: Addiction to healing, not to the app.
 */

export interface EmotionalStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  gracePeriodsUsed: number;
  streakType: 'gentle_consistency' | 'deep_work' | 'showing_up' | 'breakthrough_moments';
  multiplier: number; // Recovery bonus for returning after breaks
  celebrationsPending: string[];
  milestones: {
    achieved: number[];
    next: number;
    specialMilestones: { [key: number]: string };
  };
}

export interface EmotionalSkill {
  id: string;
  name: string;
  category: 'self_awareness' | 'regulation' | 'empathy' | 'social_skills' | 'motivation';
  level: number;
  xp: number;
  xpToNext: number;
  maxLevel: number;
  unlockedAt?: string;
  isUnlocked: boolean;
  prerequisites: string[];
  exercises: EmotionalExercise[];
  mastery: {
    practiced: number;
    understood: number;
    integrated: number;
    teaching: number; // Can explain to others
  };
}

export interface EmotionalExercise {
  id: string;
  name: string;
  type: 'reflection' | 'practice' | 'observation' | 'integration' | 'breakthrough';
  difficulty: 'introduction' | 'exploration' | 'challenge' | 'mastery';
  estimatedTime: number; // minutes
  description: string;
  prompts: string[];
  completions: number;
  lastCompleted?: string;
  spacedRepetition: {
    nextReview: string;
    interval: number; // days
    easeFactor: number;
  };
  trauma_informed: {
    triggerWarnings: string[];
    exitStrategies: string[];
    supportResources: string[];
  };
}

export interface LearningPath {
  userId: string;
  currentPhase: 'foundation' | 'exploration' | 'integration' | 'mastery' | 'teaching';
  personalizedGoals: string[];
  culturalAdaptations: string[];
  pacing: 'turtle' | 'steady' | 'ambitious' | 'adaptive';
  skillPriorities: string[];
  nextRecommendations: PathRecommendation[];
  progressAnalytics: {
    weeklyGrowth: number;
    consistencyScore: number;
    depthScore: number;
    integrationScore: number;
    joyScore: number; // Most important metric
  };
  healingRhythm: {
    optimalTimes: string[];
    energyPatterns: string[];
    supportNeeds: string[];
  };
}

export interface PathRecommendation {
  type: 'skill_practice' | 'new_concept' | 'review' | 'breakthrough_opportunity' | 'rest_and_integration';
  skillId?: string;
  exerciseId?: string;
  priority: 'gentle_suggestion' | 'perfect_timing' | 'breakthrough_ready';
  reasoning: string;
  expectedBenefit: string;
  timeCommitment: number;
  emotionalSafety: 'very_safe' | 'safe_with_support' | 'advanced_practice';
}

export interface CelebrationEvent {
  id: string;
  type: 'streak_milestone' | 'skill_unlock' | 'exercise_completion' | 'insight_moment' | 'breakthrough' | 'return_celebration';
  title: string;
  message: string;
  animation: 'gentle_sparkle' | 'warm_glow' | 'growth_flourish' | 'wisdom_bloom' | 'heart_expansion';
  badge?: string;
  xpAwarded: number;
  timestamp: string;
  personalizedTouch: string; // Makes it feel genuine
  sharingOption?: {
    anonymous: boolean;
    message: string;
    community: 'healing_circle' | 'growth_community' | 'private_supporters';
  };
}

export interface DailyCheckIn {
  date: string;
  emotionalWeather: 'sunny' | 'partly_cloudy' | 'rainy' | 'stormy' | 'rainbow_after_storm';
  energyLevel: 1 | 2 | 3 | 4 | 5;
  needsToday: string[];
  gratitude: string[];
  challenges: string[];
  growth: string[];
  kheperaConversation: {
    greeting: string;
    insights: string[];
    encouragement: string;
    nextSteps: string[];
  };
  completedAt: string;
  mood_after: 'worse' | 'same' | 'better' | 'much_better';
}

/**
 * The main engine that orchestrates all gamification elements
 */
export class DuolingoStyleHealingEngine {
  
  /**
   * Initialize user's gamification journey
   */
  static async initializeJourney(userId: string, preferences: {
    pacing?: 'turtle' | 'steady' | 'ambitious' | 'adaptive';
    culturalBackground?: string[];
    traumaInformed?: boolean;
    celebrationStyle?: 'gentle' | 'enthusiastic' | 'wise';
    communicationPreference?: 'supportive_friend' | 'wise_mentor' | 'cheerful_coach';
  }): Promise<{
    streak: EmotionalStreak;
    skills: EmotionalSkill[];
    path: LearningPath;
    firstCheckin: DailyCheckIn;
  }> {
    
    // Create initial emotional streak
    const streak: EmotionalStreak = {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      gracePeriodsUsed: 0,
      streakType: 'showing_up',
      multiplier: 1.0,
      celebrationsPending: [],
      milestones: {
        achieved: [],
        next: 1,
        specialMilestones: {
          1: "First step into healing",
          3: "Building the habit of self-care", 
          7: "One week of showing up for yourself",
          14: "Two weeks of consistent growth",
          30: "A month of emotional wellness practice",
          60: "Emotional wellness becoming part of who you are",
          100: "Master of consistent self-compassion",
          365: "A full year of choosing healing"
        }
      }
    };

    // Initialize foundational emotional skills
    const foundationalSkills: EmotionalSkill[] = [
      {
        id: 'emotional_awareness',
        name: 'Emotional Awareness',
        category: 'self_awareness',
        level: 1,
        xp: 0,
        xpToNext: 100,
        maxLevel: 10,
        isUnlocked: true,
        prerequisites: [],
        exercises: this.generateSkillExercises('emotional_awareness'),
        mastery: { practiced: 0, understood: 0, integrated: 0, teaching: 0 }
      },
      {
        id: 'self_compassion',
        name: 'Self-Compassion',
        category: 'regulation', 
        level: 1,
        xp: 0,
        xpToNext: 120,
        maxLevel: 10,
        isUnlocked: true,
        prerequisites: [],
        exercises: this.generateSkillExercises('self_compassion'),
        mastery: { practiced: 0, understood: 0, integrated: 0, teaching: 0 }
      },
      {
        id: 'boundary_setting',
        name: 'Healthy Boundaries',
        category: 'social_skills',
        level: 0,
        xp: 0,
        xpToNext: 150,
        maxLevel: 10,
        isUnlocked: false,
        prerequisites: ['emotional_awareness'],
        exercises: this.generateSkillExercises('boundary_setting'),
        mastery: { practiced: 0, understood: 0, integrated: 0, teaching: 0 }
      }
    ];

    // Create personalized learning path
    const learningPath: LearningPath = {
      userId,
      currentPhase: 'foundation',
      personalizedGoals: this.generatePersonalizedGoals(preferences),
      culturalAdaptations: preferences.culturalBackground || [],
      pacing: preferences.pacing || 'adaptive',
      skillPriorities: ['emotional_awareness', 'self_compassion'],
      nextRecommendations: [],
      progressAnalytics: {
        weeklyGrowth: 0,
        consistencyScore: 0,
        depthScore: 0,
        integrationScore: 0,
        joyScore: 100 // Start with full joy!
      },
      healingRhythm: {
        optimalTimes: [],
        energyPatterns: [],
        supportNeeds: this.assessInitialSupportNeeds(preferences)
      }
    };

    // Generate first recommendations
    learningPath.nextRecommendations = await this.generatePersonalizedRecommendations(
      foundationalSkills,
      learningPath,
      streak
    );

    // Create welcoming first check-in
    const firstCheckin = this.createWelcomeCheckin(preferences);

    return {
      streak,
      skills: foundationalSkills,
      path: learningPath,
      firstCheckin
    };
  }

  /**
   * Process daily activity and update all systems
   */
  static async processDailyActivity(
    userId: string,
    activityType: 'journal_entry' | 'skill_practice' | 'check_in' | 'reflection' | 'breakthrough',
    activityData: any,
    currentState: {
      streak: EmotionalStreak;
      skills: EmotionalSkill[];
      path: LearningPath;
    }
  ): Promise<{
    updatedStreak: EmotionalStreak;
    updatedSkills: EmotionalSkill[];
    updatedPath: LearningPath;
    celebrations: CelebrationEvent[];
    xpGained: number;
    newUnlocks: string[];
  }> {
    
    const { streak, skills, path } = currentState;
    const today = new Date().toISOString().split('T')[0];
    
    // Update streak with grace-based logic
    const updatedStreak = this.updateGraceBasedStreak(streak, today, activityType);
    
    // Calculate XP and skill improvements
    const xpGained = this.calculateActivityXP(activityType, activityData, path);
    const updatedSkills = this.updateSkillProgress(skills, activityType, activityData, xpGained);
    
    // Check for new unlocks
    const newUnlocks = this.checkForUnlocks(updatedSkills);
    
    // Update learning path
    const updatedPath = await this.updateLearningPath(path, updatedStreak, updatedSkills, activityData);
    
    // Generate celebrations
    const celebrations = this.generateCelebrations(
      updatedStreak,
      skills,
      updatedSkills,
      newUnlocks,
      xpGained,
      path
    );

    return {
      updatedStreak,
      updatedSkills,
      updatedPath,
      celebrations,
      xpGained,
      newUnlocks
    };
  }

  /**
   * Grace-based streak system that never shames
   */
  static updateGraceBasedStreak(
    streak: EmotionalStreak,
    currentDate: string,
    activityType: string
  ): EmotionalStreak {
    const lastDate = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
    const today = new Date(currentDate);
    
    if (!lastDate) {
      // First activity ever
      return {
        ...streak,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: currentDate,
        multiplier: 1.0,
        celebrationsPending: ['first_step_celebration']
      };
    }

    const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Perfect consecutive day
      const newStreak = streak.currentStreak + 1;
      const updatedStreak = {
        ...streak,
        currentStreak: newStreak,
        longestStreak: Math.max(streak.longestStreak, newStreak),
        lastActiveDate: currentDate,
        multiplier: 1.0
      };

      // Check for milestone celebrations
      if (streak.milestones.specialMilestones[newStreak]) {
        updatedStreak.celebrationsPending = [
          ...streak.celebrationsPending,
          `milestone_${newStreak}`
        ];
      }

      return updatedStreak;
      
    } else if (daysDiff === 0) {
      // Same day - just update activity
      return {
        ...streak,
        lastActiveDate: currentDate
      };
      
    } else if (daysDiff <= 3) {
      // Short break - use grace period with celebration for return
      return {
        ...streak,
        currentStreak: streak.currentStreak + 1,
        longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
        lastActiveDate: currentDate,
        multiplier: 1.5, // Recovery bonus!
        celebrationsPending: [
          ...streak.celebrationsPending,
          'compassionate_return_celebration'
        ]
      };
      
    } else {
      // Longer break - fresh start with wisdom celebration
      return {
        ...streak,
        currentStreak: 1,
        lastActiveDate: currentDate,
        multiplier: 1.2, // Still get bonus for returning!
        celebrationsPending: [
          ...streak.celebrationsPending,
          'wisdom_of_returning_celebration'
        ]
      };
    }
  }

  /**
   * Generate skill-specific exercises
   */
  static generateSkillExercises(skillId: string): EmotionalExercise[] {
    const exerciseBank: { [key: string]: Omit<EmotionalExercise, 'id' | 'spacedRepetition'>[] } = {
      emotional_awareness: [
        {
          name: "Emotion Naming Practice",
          type: "observation",
          difficulty: "introduction",
          estimatedTime: 5,
          description: "Practice identifying and naming emotions as they arise throughout your day",
          prompts: [
            "What emotion am I experiencing right now?",
            "Where do I feel this emotion in my body?",
            "What might have triggered this feeling?"
          ],
          completions: 0,
          trauma_informed: {
            triggerWarnings: [],
            exitStrategies: ["Take deep breaths", "Ground yourself by naming 5 things you can see"],
            supportResources: ["It's okay to stop anytime", "All emotions are valid"]
          }
        },
        {
          name: "Emotional Weather Check",
          type: "reflection",
          difficulty: "introduction", 
          estimatedTime: 3,
          description: "Describe your emotional state using weather metaphors",
          prompts: [
            "If my emotions were weather, what would today be like?",
            "Are there any storms passing through?",
            "What kind of emotional weather am I hoping for?"
          ],
          completions: 0,
          trauma_informed: {
            triggerWarnings: [],
            exitStrategies: ["Remember: all weather passes", "You are not the storm"],
            supportResources: ["Emotions are temporary visitors", "You are safe to feel"]
          }
        }
      ],
      self_compassion: [
        {
          name: "Kind Inner Voice Practice",
          type: "practice",
          difficulty: "exploration",
          estimatedTime: 10,
          description: "Practice speaking to yourself with the kindness you'd show a dear friend",
          prompts: [
            "What would I say to a friend going through this same situation?",
            "How can I offer myself the same compassion?",
            "What do I need to hear right now from my wisest, most loving self?"
          ],
          completions: 0,
          trauma_informed: {
            triggerWarnings: ["Internal criticism"],
            exitStrategies: ["Place hand on heart", "Take three gentle breaths"],
            supportResources: ["Self-compassion is a practice, not perfection", "You deserve kindness, especially from yourself"]
          }
        }
      ],
      boundary_setting: [
        {
          name: "Boundary Exploration",
          type: "reflection",
          difficulty: "challenge",
          estimatedTime: 15,
          description: "Explore what healthy boundaries mean for you personally",
          prompts: [
            "What are my emotional, physical, and mental limits?",
            "Where in my life do I need stronger boundaries?",
            "What would change if I honored my boundaries more consistently?"
          ],
          completions: 0,
          trauma_informed: {
            triggerWarnings: ["Past boundary violations", "Guilt about setting limits"],
            exitStrategies: ["Remind yourself: boundaries are self-care", "Take a break if overwhelmed"],
            supportResources: ["Boundaries protect your energy for what matters", "Saying no to others means saying yes to yourself"]
          }
        }
      ]
    };

    const exercises = exerciseBank[skillId] || [];
    return exercises.map((exercise, index) => ({
      ...exercise,
      id: `${skillId}_exercise_${index + 1}`,
      spacedRepetition: {
        nextReview: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        interval: 1,
        easeFactor: 2.5
      }
    }));
  }

  /**
   * Generate personalized goals based on user preferences
   */
  static generatePersonalizedGoals(preferences: any): string[] {
    const baseGoals = [
      "Develop consistent emotional awareness",
      "Practice self-compassion daily",
      "Build healthy relationship boundaries"
    ];

    const culturalGoals: { [key: string]: string[] } = {
      'collectivist': ["Honor family harmony while maintaining personal boundaries", "Practice collective healing wisdom"],
      'individualist': ["Develop strong personal identity", "Practice independent emotional regulation"],
      'spiritual': ["Connect emotions to spiritual practice", "Find meaning in emotional experiences"],
      'trauma_survivor': ["Heal at your own pace", "Build safety in emotional expression"]
    };

    let personalizedGoals = [...baseGoals];
    
    if (preferences.culturalBackground) {
      preferences.culturalBackground.forEach((culture: string) => {
        if (culturalGoals[culture]) {
          personalizedGoals = [...personalizedGoals, ...culturalGoals[culture]];
        }
      });
    }

    return personalizedGoals.slice(0, 5); // Keep it manageable
  }

  /**
   * Assess initial support needs
   */
  static assessInitialSupportNeeds(preferences: any): string[] {
    const needs = ['gentle_pacing'];
    
    if (preferences.traumaInformed) {
      needs.push('trauma_informed_approach', 'extra_safety_measures');
    }
    
    if (preferences.celebrationStyle === 'gentle') {
      needs.push('subtle_celebrations');
    } else if (preferences.celebrationStyle === 'enthusiastic') {
      needs.push('energetic_celebrations');
    }

    return needs;
  }

  /**
   * Create welcoming first check-in
   */
  static createWelcomeCheckin(preferences: any): DailyCheckIn {
    const greetings = {
      'supportive_friend': "Hey there! Ready to explore what's happening in your emotional world today?",
      'wise_mentor': "Welcome to this moment of connection with yourself. What's alive in you today?", 
      'cheerful_coach': "Good to see you! Let's dive into how you're feeling and what you need today!"
    };

    const communicationStyle = preferences.communicationPreference || 'supportive_friend';
    
    return {
      date: new Date().toISOString().split('T')[0],
      emotionalWeather: 'partly_cloudy',
      energyLevel: 3,
      needsToday: [],
      gratitude: [],
      challenges: [],
      growth: [],
      kheperaConversation: {
        greeting: greetings[communicationStyle as keyof typeof greetings],
        insights: [
          "Starting a healing journey takes courage. You're already succeeding by being here.",
          "There's no wrong way to feel. All emotions are welcome in this space.",
          "Growth happens at the pace that's right for you."
        ],
        encouragement: "I'm here to support you every step of the way. You're not doing this alone.",
        nextSteps: [
          "Take a few deep breaths and notice what you're feeling right now",
          "Remember: showing up is enough",
          "Be gentle with yourself as you begin"
        ]
      },
      completedAt: '',
      mood_after: 'better'
    };
  }

  /**
   * Generate personalized recommendations
   */
  static async generatePersonalizedRecommendations(
    skills: EmotionalSkill[],
    path: LearningPath,
    streak: EmotionalStreak
  ): Promise<PathRecommendation[]> {
    const recommendations: PathRecommendation[] = [];
    
    // Always recommend foundational practices for beginners
    if (path.currentPhase === 'foundation') {
      recommendations.push({
        type: 'skill_practice',
        skillId: 'emotional_awareness',
        exerciseId: 'emotional_awareness_exercise_1',
        priority: 'perfect_timing',
        reasoning: "Building emotional awareness is the foundation of all healing work",
        expectedBenefit: "You'll develop the ability to notice and name your emotions with kindness",
        timeCommitment: 5,
        emotionalSafety: 'very_safe'
      });
      
      recommendations.push({
        type: 'skill_practice',
        skillId: 'self_compassion',
        exerciseId: 'self_compassion_exercise_1', 
        priority: 'gentle_suggestion',
        reasoning: "Self-compassion makes all other emotional work safer and more effective",
        expectedBenefit: "You'll learn to be your own best friend and supporter",
        timeCommitment: 10,
        emotionalSafety: 'very_safe'
      });
    }

    // Adaptive recommendations based on consistency
    if (streak.currentStreak >= 3) {
      recommendations.push({
        type: 'new_concept',
        priority: 'perfect_timing',
        reasoning: "Your consistency shows you're ready for deeper exploration",
        expectedBenefit: "Expand your emotional toolkit with new perspectives",
        timeCommitment: 15,
        emotionalSafety: 'safe_with_support'
      });
    }

    return recommendations.slice(0, 3); // Keep recommendations focused
  }

  /**
   * Calculate XP for different activities
   */
  static calculateActivityXP(
    activityType: string,
    activityData: any,
    path: LearningPath
  ): number {
    const baseXP: { [key: string]: number } = {
      journal_entry: 25,
      skill_practice: 40,
      check_in: 15,
      reflection: 30,
      breakthrough: 100
    };

    let xp = baseXP[activityType] || 10;
    
    // Bonus for depth and authenticity
    if (activityData.depth === 'deep') xp *= 1.5;
    if (activityData.authenticity === 'vulnerable') xp *= 1.3;
    if (activityData.selfCompassion === 'practiced') xp *= 1.2;
    
    // Adaptive pacing adjustments
    if (path.pacing === 'turtle') xp *= 1.5; // Reward slower, deeper work
    if (path.pacing === 'ambitious') xp *= 0.9; // Prevent burnout
    
    return Math.round(xp);
  }

  /**
   * Update skill progress
   */
  static updateSkillProgress(
    skills: EmotionalSkill[],
    activityType: string,
    activityData: any,
    xpGained: number
  ): EmotionalSkill[] {
    return skills.map(skill => {
      if (activityData.skillId === skill.id || activityData.relatedSkills?.includes(skill.id)) {
        const newXP = skill.xp + xpGained;
        const leveledUp = newXP >= skill.xpToNext;
        
        return {
          ...skill,
          xp: newXP,
          level: leveledUp ? skill.level + 1 : skill.level,
          xpToNext: leveledUp ? this.calculateNextLevelXP(skill.level + 1) : skill.xpToNext,
          mastery: this.updateMastery(skill.mastery, activityType, activityData)
        };
      }
      return skill;
    });
  }

  /**
   * Calculate XP needed for next level
   */
  static calculateNextLevelXP(level: number): number {
    return Math.round(100 * Math.pow(1.2, level - 1));
  }

  /**
   * Update skill mastery
   */
  static updateMastery(
    currentMastery: EmotionalSkill['mastery'],
    activityType: string,
    activityData: any
  ): EmotionalSkill['mastery'] {
    const mastery = { ...currentMastery };
    
    if (activityType === 'skill_practice') {
      mastery.practiced += 1;
    }
    
    if (activityData.insights?.length > 0) {
      mastery.understood += 1;
    }
    
    if (activityData.realWorldApplication) {
      mastery.integrated += 1;
    }
    
    return mastery;
  }

  /**
   * Check for new skill unlocks
   */
  static checkForUnlocks(skills: EmotionalSkill[]): string[] {
    const newUnlocks: string[] = [];
    
    skills.forEach(skill => {
      if (!skill.isUnlocked && this.arePrerequisitesMet(skill, skills)) {
        skill.isUnlocked = true;
        skill.unlockedAt = new Date().toISOString();
        newUnlocks.push(skill.id);
      }
    });
    
    return newUnlocks;
  }

  /**
   * Check if prerequisites are met for a skill
   */
  static arePrerequisitesMet(skill: EmotionalSkill, allSkills: EmotionalSkill[]): boolean {
    return skill.prerequisites.every(prereqId => {
      const prereqSkill = allSkills.find(s => s.id === prereqId);
      return prereqSkill && prereqSkill.level >= 2; // Need to be intermediate level
    });
  }

  /**
   * Update learning path based on progress
   */
  static async updateLearningPath(
    path: LearningPath,
    streak: EmotionalStreak,
    skills: EmotionalSkill[],
    activityData: any
  ): Promise<LearningPath> {
    const updatedPath = { ...path };
    
    // Update progress analytics
    updatedPath.progressAnalytics = {
      ...path.progressAnalytics,
      weeklyGrowth: path.progressAnalytics.weeklyGrowth + 1,
      consistencyScore: Math.min(100, streak.currentStreak * 5),
      depthScore: activityData.depth === 'deep' ? path.progressAnalytics.depthScore + 5 : path.progressAnalytics.depthScore,
      integrationScore: activityData.realWorldApplication ? path.progressAnalytics.integrationScore + 10 : path.progressAnalytics.integrationScore,
      joyScore: activityData.mood_after === 'better' || activityData.mood_after === 'much_better' 
        ? Math.min(100, path.progressAnalytics.joyScore + 2)
        : Math.max(60, path.progressAnalytics.joyScore - 1)
    };
    
    // Update phase if ready
    const averageSkillLevel = skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length;
    if (averageSkillLevel >= 3 && path.currentPhase === 'foundation') {
      updatedPath.currentPhase = 'exploration';
    } else if (averageSkillLevel >= 6 && path.currentPhase === 'exploration') {
      updatedPath.currentPhase = 'integration';
    }
    
    // Generate new recommendations
    updatedPath.nextRecommendations = await this.generatePersonalizedRecommendations(skills, updatedPath, streak);
    
    return updatedPath;
  }

  /**
   * Generate celebrations for achievements
   */
  static generateCelebrations(
    streak: EmotionalStreak,
    oldSkills: EmotionalSkill[],
    newSkills: EmotionalSkill[],
    newUnlocks: string[],
    xpGained: number,
    path: LearningPath
  ): CelebrationEvent[] {
    const celebrations: CelebrationEvent[] = [];
    const now = new Date().toISOString();
    
    // Process pending streak celebrations
    streak.celebrationsPending.forEach(celebrationType => {
      if (celebrationType.startsWith('milestone_')) {
        const milestone = parseInt(celebrationType.split('_')[1]);
        celebrations.push({
          id: `milestone_${milestone}_${Date.now()}`,
          type: 'streak_milestone',
          title: `${milestone} Days of Showing Up!`,
          message: streak.milestones.specialMilestones[milestone] || "Celebrating your consistency!",
          animation: milestone >= 30 ? 'wisdom_bloom' : 'gentle_sparkle',
          xpAwarded: milestone * 5,
          timestamp: now,
          personalizedTouch: this.getPersonalizedMilestoneMessage(milestone, path),
          sharingOption: {
            anonymous: true,
            message: `Someone in our community just reached ${milestone} days of emotional wellness practice! 🌱`,
            community: 'growth_community'
          }
        });
      } else if (celebrationType === 'compassionate_return_celebration') {
        celebrations.push({
          id: `return_${Date.now()}`,
          type: 'return_celebration',
          title: "Welcome Back! 🌈",
          message: "You chose healing over perfectionism. This is what self-compassion looks like.",
          animation: 'heart_expansion',
          xpAwarded: Math.round(xpGained * 1.5),
          timestamp: now,
          personalizedTouch: "Your willingness to return after a break shows tremendous wisdom and self-awareness."
        });
      }
    });
    
    // Skill level up celebrations
    newSkills.forEach((skill, index) => {
      const oldSkill = oldSkills[index];
      if (skill.level > oldSkill.level) {
        celebrations.push({
          id: `skill_levelup_${skill.id}_${Date.now()}`,
          type: 'skill_unlock',
          title: `${skill.name} Level ${skill.level}!`,
          message: `Your ${skill.name.toLowerCase()} skills are growing stronger!`,
          animation: 'growth_flourish',
          badge: `${skill.id}_level_${skill.level}`,
          xpAwarded: 0,
          timestamp: now,
          personalizedTouch: this.getSkillLevelMessage(skill),
          sharingOption: {
            anonymous: true,
            message: `Someone just leveled up their ${skill.name} skills! 💪`,
            community: 'healing_circle'
          }
        });
      }
    });
    
    // New skill unlock celebrations
    newUnlocks.forEach(skillId => {
      const skill = newSkills.find(s => s.id === skillId);
      if (skill) {
        celebrations.push({
          id: `unlock_${skillId}_${Date.now()}`,
          type: 'skill_unlock',
          title: `New Skill Unlocked: ${skill.name}! ✨`,
          message: "Your growth has opened new possibilities for healing.",
          animation: 'wisdom_bloom',
          badge: `${skillId}_unlocked`,
          xpAwarded: 50,
          timestamp: now,
          personalizedTouch: `You've shown you're ready to explore ${skill.name.toLowerCase()}. Trust your journey.`
        });
      }
    });
    
    return celebrations;
  }

  /**
   * Get personalized milestone message
   */
  static getPersonalizedMilestoneMessage(milestone: number, path: LearningPath): string {
    const messages = {
      1: "The hardest part is often just beginning. You did it.",
      3: "Three days of choosing yourself. This is how new patterns form.",
      7: "A full week of prioritizing your emotional wellness. Notice how this feels.",
      14: "Two weeks of consistent practice. You're building something beautiful.",
      30: "A month of showing up for yourself. This is what sustainable healing looks like.",
      60: "Two months of emotional wellness practice. You're transforming your relationship with yourself.",
      100: "100 days of choosing healing. You've created a new way of being.",
      365: "A full year of consistent growth. You are living proof that healing is possible."
    };
    
    return messages[milestone as keyof typeof messages] || `${milestone} days of courage and commitment. You're amazing.`;
  }

  /**
   * Get personalized skill level message
   */
  static getSkillLevelMessage(skill: EmotionalSkill): string {
    const messages = {
      'emotional_awareness': [
        "You're becoming more aware of your emotional landscape.",
        "Your ability to recognize emotions is deepening.",
        "You're developing emotional intelligence that will serve you for life."
      ],
      'self_compassion': [
        "You're learning to be your own best friend.",
        "Your inner voice is becoming kinder and more supportive.",
        "Self-compassion is becoming your natural response to difficulty."
      ],
      'boundary_setting': [
        "You're learning to honor your limits and needs.",
        "Your boundaries are becoming clearer and stronger.",
        "You're mastering the art of saying yes to yourself."
      ]
    };
    
    const skillMessages = messages[skill.id as keyof typeof messages] || [
      "Your emotional skills are growing stronger.",
      "You're developing new capacities for healing.",
      "This growth will ripple into all areas of your life."
    ];
    
    const levelIndex = Math.min(skill.level - 2, skillMessages.length - 1);
    return skillMessages[levelIndex] || skillMessages[0];
  }
}

export default DuolingoStyleHealingEngine;