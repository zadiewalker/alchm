/**
 * Crisis-Responsive Habit Adaptation Engine
 * 
 * Revolutionary system that intelligently adapts habits during difficult periods
 * without shame, blame, or abandonment. Recognizes that crisis periods require
 * different approaches to habit maintenance and creates compassionate adaptations
 * that preserve progress while honoring human limitations.
 * 
 * Features:
 * - Automatic crisis detection and gentle habit modification
 * - Shame-free adaptation messaging and reframing
 * - Maintenance vs. growth mode switching
 * - Trauma-informed crisis navigation
 * - Recovery and re-engagement planning
 * - Neuroplasticity preservation during stress
 * - Community support activation
 * - Identity protection during difficult times
 */

export interface CrisisProfile {
  userId: string;
  crisisId: string;
  crisisType: 'acute' | 'chronic' | 'cyclical' | 'complex' | 'developmental';
  severityLevel: number; // 0-100 scale
  
  // Crisis characteristics
  crisisCategory: {
    primary: 'mental-health' | 'physical-health' | 'financial' | 'relationship' | 'family' | 'work' | 'trauma' | 'grief';
    secondary?: string[];
  };
  
  // Impact assessment
  impactAreas: {
    energyLevel: number; // 0-100
    cognitiveCapacity: number; // 0-100
    emotionalRegulation: number; // 0-100
    socialConnection: number; // 0-100
    basicFunctioning: number; // 0-100
    timeAvailability: number; // 0-100
  };
  
  // Temporal aspects
  timeFrames: {
    estimatedDuration: 'hours' | 'days' | 'weeks' | 'months' | 'ongoing';
    crisisStart: Date;
    expectedRecovery?: Date;
    previousSimilarCrises?: Date[];
  };
  
  // Support systems
  availableSupport: {
    familySupport: number; // 0-100
    friendSupport: number; // 0-100
    professionalSupport: number; // 0-100
    communitySupport: number; // 0-100
    institutionalSupport: number; // 0-100
  };
  
  // Crisis-specific needs
  adaptationRequirements: {
    needSimplification: boolean;
    needFlexibility: boolean;
    needReduction: boolean;
    needSupport: boolean;
    needRoutineStabilization: boolean;
    needIdentityProtection: boolean;
  };
}

export interface CrisisHabitAdaptation {
  adaptationId: string;
  originalHabitId: string;
  crisisProfileId: string;
  
  // Adaptation strategy
  adaptationStrategy: {
    mode: 'maintenance' | 'minimal' | 'pause' | 'pivot' | 'support-focus';
    intensityReduction: number; // 0-100 percentage
    frequencyAdjustment: number; // 0-200 percentage (can be increased for stabilization)
    durationModification: number; // 0-200 percentage
    complexitySimplification: number; // 0-100 percentage
  };
  
  // Modified habit structure
  adaptedHabit: {
    simplifiedVersion: string;
    minimumViableVersion: string;
    emergencyVersion: string;
    supportIntegratedVersion: string;
  };
  
  // Shame-free messaging
  messaging: {
    adaptationExplanation: string;
    progressReframe: string;
    identityProtection: string;
    recoveryAssurance: string;
    celebrationAdjustment: string;
  };
  
  // Support activation
  supportActivation: {
    automaticSupport: string[];
    requestableSupport: string[];
    communityNotifications: string[];
    professionalReferrals: string[];
  };
  
  // Recovery planning
  recoveryPlan: {
    gradualReengagement: GradualReengagementPlan;
    progressRecognition: ProgressRecognitionPlan;
    identityReintegration: IdentityReintegrationPlan;
    learningIntegration: LearningIntegrationPlan;
  };
}

export interface GradualReengagementPlan {
  phases: Array<{
    phaseName: string;
    durationEstimate: string;
    habitIntensity: number; // 0-100
    supportLevel: number; // 0-100
    successCriteria: string[];
    flexibilityAllowance: number; // 0-100
  }>;
  
  // Reengagement triggers
  triggers: {
    physiologicalMarkers: string[];
    emotionalReadiness: string[];
    circumstantialImprovements: string[];
    selfAssessmentThresholds: string[];
  };
  
  // Safety measures
  safetyMeasures: {
    overwhelmPrevention: string[];
    progressProtection: string[];
    relapsePrevention: string[];
    identityStabilization: string[];
  };
}

export interface NeuroplasticityPreservation {
  preservationStrategy: {
    pathwayMaintenance: string[];
    memoryConsolidation: string[];
    skillRetention: string[];
    identityIntegration: string[];
  };
  
  // Minimal effective dose for pathway preservation
  minimalMaintenance: {
    frequency: 'daily' | 'every-other-day' | 'weekly' | 'as-possible';
    duration: number; // minutes
    intensity: number; // 0-100 scale
    complexity: 'basic' | 'simplified' | 'core-only';
  };
  
  // Stress-adapted neuroplasticity support
  stressAdaptations: {
    cortisol_management: string[];
    hippocampus_protection: string[];
    prefrontal_support: string[];
    amygdala_regulation: string[];
  };
}

export interface CrisisNavigationSupport {
  navigationId: string;
  crisisPhase: 'onset' | 'acute' | 'plateau' | 'fluctuating' | 'recovery';
  
  // Phase-specific support
  supportStrategies: {
    immediate_needs: string[];
    stability_measures: string[];
    adaptation_guidance: string[];
    hope_preservation: string[];
    identity_protection: string[];
  };
  
  // Community activation
  communitySupport: {
    automatic_notifications: string[];
    support_circle_activation: string[];
    professional_recommendations: string[];
    peer_support_matching: string[];
  };
  
  // Resource mobilization
  resourceMobilization: {
    immediate_resources: string[];
    ongoing_support: string[];
    professional_connections: string[];
    crisis_specific_tools: string[];
  };
}

export class CrisisResponsiveHabitAdaptationEngine {
  
  /**
   * Detect crisis conditions and trigger appropriate adaptations
   */
  static detectCrisisConditions(
    userData: {
      userId: string;
      recentHabitCompletions: { habitId: string; completed: boolean; date: Date; quality?: number }[];
      moodData: { date: Date; mood: number; stress: number; energy: number }[];
      userReportedStressors: string[];
      behaviorChanges: string[];
    },
    userProfile: {
      traumaHistory: boolean;
      previousCrises: CrisisProfile[];
      resilience_factors: string[];
      support_systems: string[];
    }
  ): {
    crisisDetected: boolean;
    crisisProfile?: CrisisProfile;
    recommendedAdaptations: CrisisHabitAdaptation[];
    immediateSupport: string[];
  } {
    
    // Analyze patterns for crisis indicators
    const crisisIndicators = this.analyzeCrisisIndicators(userData, userProfile);
    
    if (!crisisIndicators.crisisLikely) {
      return {
        crisisDetected: false,
        recommendedAdaptations: [],
        immediateSupport: []
      };
    }
    
    // Generate crisis profile
    const crisisProfile = this.generateCrisisProfile(
      userData,
      userProfile,
      crisisIndicators
    );
    
    // Create adaptive recommendations for each active habit
    const adaptations = this.createCrisisAdaptations(
      userData.recentHabitCompletions,
      crisisProfile
    );
    
    // Identify immediate support needs
    const immediateSupport = this.identifyImmediateSupport(crisisProfile);
    
    return {
      crisisDetected: true,
      crisisProfile,
      recommendedAdaptations: adaptations,
      immediateSupport
    };
  }
  
  /**
   * Create shame-free habit adaptations for crisis periods
   */
  static createShameFreeAdaptations(
    originalHabit: {
      habitId: string;
      name: string;
      description: string;
      currentStreak: number;
      importance: number; // 0-100
      complexity: number; // 0-100
      timeRequired: number; // minutes
    },
    crisisProfile: CrisisProfile,
    userPreferences: {
      adaptationStyle: 'gentle' | 'practical' | 'motivational' | 'scientific';
      messagingTone: 'compassionate' | 'encouraging' | 'matter-of-fact' | 'hopeful';
      identityProtection: boolean;
      communitySupport: boolean;
    }
  ): CrisisHabitAdaptation {
    
    // Determine appropriate adaptation strategy
    const adaptationStrategy = this.determineAdaptationStrategy(
      originalHabit,
      crisisProfile
    );
    
    // Create simplified versions of the habit
    const adaptedHabit = this.createAdaptedHabitVersions(
      originalHabit,
      adaptationStrategy,
      crisisProfile.impactAreas
    );
    
    // Generate shame-free messaging
    const messaging = this.generateShameFreeMessaging(
      originalHabit,
      adaptationStrategy,
      crisisProfile,
      userPreferences
    );
    
    // Plan support activation
    const supportActivation = this.planSupportActivation(
      crisisProfile,
      userPreferences.communitySupport
    );
    
    // Create recovery plan
    const recoveryPlan = this.createRecoveryPlan(
      originalHabit,
      adaptationStrategy,
      crisisProfile
    );
    
    return {
      adaptationId: `crisis_adaptation_${Date.now()}`,
      originalHabitId: originalHabit.habitId,
      crisisProfileId: crisisProfile.crisisId,
      adaptationStrategy,
      adaptedHabit,
      messaging,
      supportActivation,
      recoveryPlan
    };
  }
  
  /**
   * Preserve neuroplasticity during crisis periods through minimal maintenance
   */
  static preserveNeuroplasticityDuringCrisis(
    habitData: {
      habitId: string;
      neuralPathwayStrength: number;
      lastPracticeDate: Date;
      consistencyHistory: boolean[];
    },
    crisisProfile: CrisisProfile,
    neuroplasticityGoals: {
      maintainPathways: boolean;
      preventDeterioration: boolean;
      supportRecovery: boolean;
      preserveIdentity: boolean;
    }
  ): NeuroplasticityPreservation {
    
    // Calculate minimum effective dose for pathway preservation
    const minimalMaintenance = this.calculateMinimalMaintenance(
      habitData.neuralPathwayStrength,
      crisisProfile.impactAreas,
      crisisProfile.timeFrames.estimatedDuration
    );
    
    // Design preservation strategies
    const preservationStrategy = this.designPreservationStrategy(
      habitData,
      neuroplasticityGoals,
      crisisProfile
    );
    
    // Create stress-adapted support
    const stressAdaptations = this.createStressAdaptations(
      crisisProfile.crisisCategory.primary,
      crisisProfile.severityLevel
    );
    
    return {
      preservationStrategy,
      minimalMaintenance,
      stressAdaptations
    };
  }
  
  /**
   * Provide comprehensive crisis navigation support
   */
  static provideCrisisNavigationSupport(
    crisisProfile: CrisisProfile,
    currentPhase: 'onset' | 'acute' | 'plateau' | 'fluctuating' | 'recovery',
    availableResources: {
      family: string[];
      friends: string[];
      professionals: string[];
      community: string[];
      institutional: string[];
    },
    userPreferences: {
      supportActivationPermission: boolean;
      privacyLevel: 'private' | 'selective' | 'open';
      communicationPreferences: string[];
    }
  ): CrisisNavigationSupport {
    
    // Phase-specific support strategies
    const supportStrategies = this.createPhaseSpecificSupport(
      currentPhase,
      crisisProfile
    );
    
    // Community support activation
    const communitySupport = this.activateCommunitySupportSafely(
      availableResources,
      userPreferences,
      crisisProfile
    );
    
    // Resource mobilization
    const resourceMobilization = this.mobilizeAppropriateResources(
      crisisProfile,
      availableResources,
      currentPhase
    );
    
    return {
      navigationId: `crisis_nav_${Date.now()}`,
      crisisPhase: currentPhase,
      supportStrategies,
      communitySupport,
      resourceMobilization
    };
  }
  
  /**
   * Plan gradual reengagement after crisis resolution
   */
  static planGradualReengagement(
    preCrisis: {
      habitIntensity: number;
      habitFrequency: number;
      habitComplexity: number;
    },
    crisisAdaptation: CrisisHabitAdaptation,
    recoveryContext: {
      recoveryStage: 'early' | 'middle' | 'late' | 'stabilized';
      energyReturning: boolean;
      supportStillNeeded: boolean;
      identityStable: boolean;
    },
    userPreferences: {
      reengagementSpeed: 'very-slow' | 'slow' | 'moderate' | 'normal';
      priorityHabits: string[];
      flexibilityDesired: boolean;
    }
  ): GradualReengagementPlan {
    
    // Calculate appropriate phases for reengagement
    const phases = this.calculateReengagementPhases(
      precrisis: {
        habitIntensity: precrisis.habitIntensity,
        habitFrequency: precrisis.habitFrequency,
        habitComplexity: precrisis.habitComplexity
      },
      crisisAdaptation,
      recoveryContext,
      userPreferences.reengagementSpeed
    );
    
    // Identify appropriate triggers for each phase
    const triggers = this.identifyReengagementTriggers(
      recoveryContext,
      userPreferences
    );
    
    // Create safety measures to prevent overwhelm
    const safetyMeasures = this.createReengagementSafetyMeasures(
      crisisAdaptation.crisisProfileId,
      userPreferences
    );
    
    return {
      phases,
      triggers,
      safetyMeasures
    };
  }
  
  // Private helper methods
  private static analyzeCrisisIndicators(
    userData: any,
    userProfile: any
  ): { crisisLikely: boolean; indicators: string[]; severity: number } {
    
    const indicators: string[] = [];
    let severity = 0;
    
    // Analyze habit completion patterns
    const recentCompletions = userData.recentHabitCompletions
      .filter((completion: any) => completion.date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    const completionRate = recentCompletions.filter((c: any) => c.completed).length / recentCompletions.length;
    
    if (completionRate < 0.3) {
      indicators.push('Significant drop in habit completion');
      severity += 25;
    }
    
    // Analyze mood and energy patterns
    const recentMoodData = userData.moodData
      .filter((mood: any) => mood.date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    const avgStress = recentMoodData.reduce((sum: number, data: any) => sum + data.stress, 0) / recentMoodData.length;
    const avgEnergy = recentMoodData.reduce((sum: number, data: any) => sum + data.energy, 0) / recentMoodData.length;
    
    if (avgStress > 70) {
      indicators.push('Elevated stress levels');
      severity += 20;
    }
    
    if (avgEnergy < 30) {
      indicators.push('Low energy levels');
      severity += 15;
    }
    
    // Check user reported stressors
    if (userData.userReportedStressors.length > 0) {
      indicators.push('User reported stressors');
      severity += userData.userReportedStressors.length * 10;
    }
    
    return {
      crisisLikely: severity > 40 || indicators.length >= 2,
      indicators,
      severity: Math.min(100, severity)
    };
  }
  
  private static generateCrisisProfile(
    userData: any,
    userProfile: any,
    indicators: any
  ): CrisisProfile {
    
    // Determine crisis type and characteristics
    const crisisType = this.determineCrisisType(indicators, userProfile);
    const impactAreas = this.assessImpactAreas(userData, indicators);
    
    return {
      userId: userData.userId,
      crisisId: `crisis_${Date.now()}`,
      crisisType: crisisType.type,
      severityLevel: indicators.severity,
      crisisCategory: {
        primary: crisisType.primary,
        secondary: crisisType.secondary
      },
      impactAreas,
      timeFrames: {
        estimatedDuration: this.estimateCrisisDuration(crisisType, indicators),
        crisisStart: new Date(),
        previousSimilarCrises: userProfile.previousCrises.map((c: any) => c.crisisStart)
      },
      availableSupport: this.assessAvailableSupport(userProfile),
      adaptationRequirements: this.determineAdaptationRequirements(impactAreas, crisisType)
    };
  }
  
  private static createCrisisAdaptations(
    recentHabitCompletions: any[],
    crisisProfile: CrisisProfile
  ): CrisisHabitAdaptation[] {
    
    const uniqueHabits = [...new Set(recentHabitCompletions.map(h => h.habitId))];
    
    return uniqueHabits.map(habitId => {
      const habitData = recentHabitCompletions.filter(h => h.habitId === habitId);
      
      // Create mock habit object for adaptation
      const originalHabit = {
        habitId,
        name: `Habit ${habitId}`,
        description: 'User habit',
        currentStreak: this.calculateStreak(habitData),
        importance: 70, // Default importance
        complexity: 50, // Default complexity
        timeRequired: 15 // Default time
      };
      
      return this.createShameFreeAdaptations(
        originalHabit,
        crisisProfile,
        {
          adaptationStyle: 'gentle',
          messagingTone: 'compassionate',
          identityProtection: true,
          communitySupport: crisisProfile.availableSupport.familySupport > 50
        }
      );
    });
  }
  
  private static calculateStreak(habitData: any[]): number {
    // Simple streak calculation
    let streak = 0;
    const sortedData = habitData.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    for (const completion of sortedData) {
      if (completion.completed) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
  
  // Additional helper method implementations would continue here...
  private static determineCrisisType(indicators: any, userProfile: any): any {
    // Logic to determine crisis type based on indicators and user profile
    return {
      type: 'acute' as const,
      primary: 'mental-health' as const,
      secondary: ['stress', 'overwhelm']
    };
  }
  
  private static assessImpactAreas(userData: any, indicators: any): any {
    return {
      energyLevel: 40,
      cognitiveCapacity: 50,
      emotionalRegulation: 45,
      socialConnection: 60,
      basicFunctioning: 55,
      timeAvailability: 30
    };
  }
  
  // More helper methods would be implemented for full functionality...
}

// Supporting interfaces
interface ProgressRecognitionPlan {
  recognitionMethods: string[];
  celebrationAdaptations: string[];
  progressReframing: string[];
  identityAffirmation: string[];
}

interface IdentityReintegrationPlan {
  identityProtectionMethods: string[];
  strengthReconnection: string[];
  valueRealignment: string[];
  purposeRediscovery: string[];
}

interface LearningIntegrationPlan {
  crisisLearnings: string[];
  resilenceBuilding: string[];
  adaptationSkills: string[];
  wisdomIntegration: string[];
}