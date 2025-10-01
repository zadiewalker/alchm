/**
 * ALCHM Grace-Based Habit Tracker
 * A neuroplasticity-informed habit tracking system that eliminates shame and celebrates presence over performance
 * 
 * Core Philosophy:
 * - No streak-breaking failures, only pause periods with grace tokens
 * - Neural pathway strength over daily completion pressure
 * - Recovery multipliers that honor the non-linear nature of healing
 * - Celebration of showing up in any form
 */

export interface GraceToken {
  id: string;
  earned_date: Date;
  reason: 'life_challenge' | 'nervous_system_overwhelm' | 'physical_illness' | 'intentional_rest' | 'crisis_response' | 'self_compassion';
  description: string;
  used_date?: Date;
  habit_context: string;
  grace_granted: number; // days of grace period
  wisdom_gained?: string; // what the person learned from needing grace
  self_compassion_practiced: boolean;
}

export interface PresenceTracking {
  date: Date;
  showed_up: boolean;
  engagement_quality: 'minimal' | 'moderate' | 'full' | 'expanded'; // not quantity, but quality of presence
  nervous_system_state: 'regulated' | 'activated' | 'shutdown' | 'mixed';
  adaptation_used?: {
    from_version: string;
    to_version: string;
    reason: string;
    satisfaction: number; // 1-10 with adaptation
  };
  celebration_moment?: {
    type: 'showing_up' | 'adaptation_wisdom' | 'nervous_system_honor' | 'breakthrough_moment';
    description: string;
    emotional_significance: number; // 1-10
  };
  insights_discovered: string[];
  body_wisdom_listened_to: boolean;
}

export interface NeuralPathwayProgress {
  pathway_name: string;
  formation_start_date: Date;
  current_strength: number; // 0-100, based on consistency and neural consolidation
  formation_phase: 'initial_sprouting' | 'strengthening' | 'integrating' | 'automaticity' | 'mastery';
  
  // 66-day neuroplasticity cycle tracking
  cycle_day: number; // 1-66 for current cycle
  cycles_completed: number;
  
  // Grace-informed metrics
  presence_rate: number; // % of days person showed up in some form
  adaptation_wisdom_score: number; // How well they adapt practices to their state
  nervous_system_honoring: number; // How well they respect their capacity
  
  // Recovery multipliers
  return_strength_boost: number; // Multiplier applied when returning from pause
  resilience_building: number; // How much strength gained from working with challenges
  
  // Milestone celebrations
  milestones_achieved: NeuralMilestone[];
  next_celebration_threshold: number;
}

export interface NeuralMilestone {
  name: string;
  strength_threshold: number;
  achieved_date?: Date;
  celebration_message: string;
  neuroscience_explanation: string;
  personal_significance: string;
  ritual_completed: boolean;
}

export interface HabitGraceConfig {
  grace_tokens_per_month: number;
  auto_grace_triggers: string[]; // Conditions that automatically grant grace
  recovery_multiplier_base: number; // Base multiplier when returning from pause
  celebration_frequency: 'weekly' | 'milestone_based' | 'daily_micro';
  shame_interruption_enabled: boolean;
  community_support_level: 'private' | 'anonymous_sharing' | 'full_community';
}

export interface GraceHabitEntry {
  id: string;
  user_id: string;
  habit_id: string;
  date: Date;
  
  // Grace-based tracking (no binary success/failure)
  presence_type: 'showed_up' | 'adapted_beautifully' | 'honored_limits' | 'used_grace' | 'intentional_pause';
  engagement_level: number; // 1-10, but celebrated at any level
  nervous_system_respect: boolean; // Did they honor their capacity?
  
  // Neuroplasticity data
  neural_benefit_estimate: number; // Estimated contribution to pathway strength
  consolidation_support: string[]; // What helped lock in the learning
  generalization_moments: string[]; // How they applied skills in daily life
  
  // Grace system
  grace_tokens_used: number;
  grace_reason?: string;
  self_compassion_message?: string;
  return_strategy?: string;
  
  // Celebration data
  wins_celebrated: string[];
  insights_gained: string[];
  gratitude_expressed: string[];
  
  // Recovery tracking
  returning_from_pause: boolean;
  recovery_multiplier_applied: number;
  comeback_wisdom: string[];
  
  created_at: Date;
  updated_at: Date;
}

export interface GraceHabitStats {
  neural_pathway_strength: number;
  presence_over_perfection_score: number;
  grace_wisdom_cultivated: number;
  nervous_system_honoring_rate: number;
  adaptation_mastery: number;
  community_inspiration_given: number;
  
  // Time-based insights
  best_practice_times: string[];
  nervous_system_patterns: {
    optimal_states: string[];
    challenging_states: string[];
    adaptation_strategies: string[];
  };
  
  // Grace utilization
  grace_tokens_earned: number;
  grace_tokens_used: number;
  grace_wisdom_developed: string[];
  
  // Recovery mastery
  comeback_strength: number;
  resilience_building_events: number;
  pause_period_learning: string[];
  
  // Celebration milestones
  milestones_achieved_count: number;
  celebration_rituals_completed: number;
  community_celebrations_shared: number;
}

export class GraceHabitTracker {
  
  /**
   * Create a grace-based habit tracking system for a specific habit
   */
  static initializeGraceTracking(
    habit_id: string,
    user_preferences: {
      grace_philosophy: 'gentle' | 'moderate' | 'flexible' | 'radical_self_compassion';
      celebration_style: 'subtle' | 'warm' | 'joyful' | 'radiant';
      community_sharing_comfort: 'private' | 'anonymous' | 'named_sharing';
      shame_interruption_sensitivity: 'high' | 'moderate' | 'low';
    },
    neural_target: {
      pathway_name: string;
      expected_formation_timeframe: number; // days
      complexity_level: 'simple' | 'moderate' | 'complex';
      trauma_considerations: string[];
    }
  ): {
    grace_config: HabitGraceConfig;
    neural_pathway_setup: NeuralPathwayProgress;
    initial_grace_tokens: GraceToken[];
    celebration_calendar: CelebrationMoment[];
  } {
    
    const grace_config = this.createGraceConfig(user_preferences);
    const pathway_progress = this.initializeNeuralPathway(neural_target);
    const initial_tokens = this.grantWelcomeGraceTokens(user_preferences.grace_philosophy);
    const celebrations = this.planCelebrationMoments(neural_target, user_preferences.celebration_style);
    
    return {
      grace_config,
      neural_pathway_setup: pathway_progress,
      initial_grace_tokens: initial_tokens,
      celebration_calendar: celebrations
    };
  }
  
  /**
   * Record a habit practice with grace-based approach
   */
  static recordGracefulPractice(
    habit_id: string,
    practice_data: {
      showed_up: boolean;
      engagement_quality: PresenceTracking['engagement_quality'];
      nervous_system_state: PresenceTracking['nervous_system_state'];
      adaptations_made: string[];
      challenges_faced: string[];
      wins_to_celebrate: string[];
      insights_discovered: string[];
    },
    grace_context?: {
      using_grace_token: boolean;
      grace_reason: string;
      self_compassion_practiced: boolean;
      return_strategy: string;
    }
  ): {
    entry_recorded: GraceHabitEntry;
    neural_pathway_update: NeuralPathwayProgress;
    celebration_triggered?: CelebrationMoment;
    grace_tokens_granted?: GraceToken[];
    shame_interruption_activated?: ShameInterruption;
    community_inspiration?: CommunityShare;
  } {
    
    const entry = this.createGraceEntry(habit_id, practice_data, grace_context);
    const neural_update = this.updateNeuralPathway(habit_id, entry);
    const celebration = this.checkForCelebrations(neural_update, entry);
    const new_tokens = this.assessGraceTokenGeneration(entry, practice_data.challenges_faced);
    const shame_check = this.runShameInterruption(entry, practice_data);
    
    return {
      entry_recorded: entry,
      neural_pathway_update: neural_update,
      celebration_triggered: celebration,
      grace_tokens_granted: new_tokens,
      shame_interruption_activated: shame_check,
      community_inspiration: this.generateCommunityInspiration(entry)
    };
  }
  
  /**
   * Handle pause periods with wisdom and grace
   */
  static enterGracefulPause(
    habit_id: string,
    pause_reason: GraceToken['reason'],
    pause_context: {
      expected_duration?: number; // days
      self_awareness_level: 'body_wisdom' | 'emotional_intelligence' | 'life_circumstances' | 'nervous_system_signals';
      support_needed: string[];
      learning_opportunity: string;
      return_criteria: string;
    }
  ): {
    grace_token_granted: GraceToken;
    pause_wisdom_ritual: PauseWisdomRitual;
    neural_pathway_protection: NeuralProtection;
    return_strategy_plan: ReturnStrategy;
    community_support_offered?: CommunitySupport;
  } {
    
    const grace_token = this.createGraceToken(pause_reason, pause_context);
    const wisdom_ritual = this.createPauseWisdomRitual(pause_context);
    const neural_protection = this.protectNeuralProgress(habit_id, pause_context.expected_duration);
    const return_plan = this.createReturnStrategy(habit_id, pause_context);
    
    return {
      grace_token_granted: grace_token,
      pause_wisdom_ritual: wisdom_ritual,
      neural_pathway_protection: neural_protection,
      return_strategy_plan: return_plan,
      community_support_offered: this.offerCommunitySupport(pause_context.support_needed)
    };
  }
  
  /**
   * Handle returns from pause with celebration and multiplied strength
   */
  static celebrateGracefulReturn(
    habit_id: string,
    return_context: {
      days_paused: number;
      wisdom_gained: string[];
      nervous_system_changes: string[];
      life_changes: string[];
      readiness_level: number; // 1-10
      adaptation_requests: string[];
    }
  ): {
    welcome_back_celebration: CelebrationMoment;
    recovery_multiplier: number;
    pathway_reconnection: NeuralPathwayProgress;
    comeback_wisdom_integration: WisdomIntegration;
    adaptation_plan: AdaptationPlan;
  } {
    
    const celebration = this.createWelcomeBackCelebration(return_context);
    const multiplier = this.calculateRecoveryMultiplier(return_context);
    const pathway_update = this.reconnectNeuralPathway(habit_id, return_context, multiplier);
    const wisdom_integration = this.integrateReturnWisdom(return_context.wisdom_gained);
    const adaptation_plan = this.createPostPauseAdaptations(habit_id, return_context);
    
    return {
      welcome_back_celebration: celebration,
      recovery_multiplier: multiplier,
      pathway_reconnection: pathway_update,
      comeback_wisdom_integration: wisdom_integration,
      adaptation_plan
    };
  }
  
  /**
   * Generate grace-based progress visualization
   */
  static generateGraceProgressVisualization(
    habit_id: string,
    timeframe: 'week' | 'month' | 'quarter' | 'year'
  ): {
    neural_pathway_garden: PathwayVisualization;
    presence_over_performance_chart: PresenceChart;
    grace_wisdom_timeline: WisdomTimeline;
    celebration_constellation: CelebrationVisualization;
    nervous_system_honoring_graph: NervousSystemGraph;
    community_inspiration_impact: CommunityImpactChart;
  } {
    
    return {
      neural_pathway_garden: this.createPathwayGardenVisualization(habit_id, timeframe),
      presence_over_performance_chart: this.createPresenceChart(habit_id, timeframe),
      grace_wisdom_timeline: this.createGraceWisdomTimeline(habit_id, timeframe),
      celebration_constellation: this.createCelebrationConstellation(habit_id, timeframe),
      nervous_system_honoring_graph: this.createNervousSystemGraph(habit_id, timeframe),
      community_inspiration_impact: this.createCommunityImpactChart(habit_id, timeframe)
    };
  }
  
  // Private implementation methods
  private static createGraceConfig(preferences: any): HabitGraceConfig {
    const base_tokens = {
      gentle: 8,
      moderate: 6,
      flexible: 4,
      radical_self_compassion: 12
    };
    
    return {
      grace_tokens_per_month: base_tokens[preferences.grace_philosophy],
      auto_grace_triggers: [
        'illness_reported',
        'high_stress_period',
        'nervous_system_overwhelm',
        'life_transition',
        'grief_or_loss',
        'trauma_anniversary'
      ],
      recovery_multiplier_base: preferences.grace_philosophy === 'radical_self_compassion' ? 1.8 : 1.5,
      celebration_frequency: 'milestone_based',
      shame_interruption_enabled: preferences.shame_interruption_sensitivity === 'high',
      community_support_level: preferences.community_sharing_comfort
    };
  }
  
  private static initializeNeuralPathway(target: any): NeuralPathwayProgress {
    return {
      pathway_name: target.pathway_name,
      formation_start_date: new Date(),
      current_strength: 0,
      formation_phase: 'initial_sprouting',
      cycle_day: 1,
      cycles_completed: 0,
      presence_rate: 0,
      adaptation_wisdom_score: 0,
      nervous_system_honoring: 0,
      return_strength_boost: 1.0,
      resilience_building: 0,
      milestones_achieved: [],
      next_celebration_threshold: 25 // First milestone at 25% pathway strength
    };
  }
  
  private static grantWelcomeGraceTokens(philosophy: string): GraceToken[] {
    const welcome_count = philosophy === 'radical_self_compassion' ? 3 : 2;
    
    return Array(welcome_count).fill(null).map((_, i) => ({
      id: `welcome_${i + 1}`,
      earned_date: new Date(),
      reason: 'self_compassion',
      description: 'Welcome gift for beginning your neuroplasticity journey with grace',
      habit_context: 'journey_start',
      grace_granted: 7, // One week of grace
      self_compassion_practiced: true
    }));
  }
  
  private static planCelebrationMoments(target: any, style: string): CelebrationMoment[] {
    const base_celebrations = [
      {
        trigger: 'first_week_presence',
        celebration_type: style,
        message: 'You showed up for yourself seven times! Your brain is beginning to form new pathways. 🌱',
        somatic_element: 'Place hand on heart and breathe deeply',
        reflection_prompt: 'What did you notice about showing up for yourself this week?'
      },
      {
        trigger: 'neural_pathway_25_percent',
        celebration_type: style,
        message: 'Amazing! Your neural pathway is 25% formed. This is real, measurable brain change! ✨',
        somatic_element: 'Take a moment to appreciate your brain\'s incredible adaptability',
        reflection_prompt: 'How does it feel to know your brain is literally changing?'
      }
    ];
    
    return base_celebrations;
  }
  
  private static createGraceEntry(habit_id: string, practice_data: any, grace_context?: any): GraceHabitEntry {
    return {
      id: `entry_${Date.now()}`,
      user_id: 'current_user', // Would be dynamic
      habit_id,
      date: new Date(),
      presence_type: grace_context?.using_grace_token ? 'used_grace' : 
                     practice_data.adaptations_made.length > 0 ? 'adapted_beautifully' : 'showed_up',
      engagement_level: this.mapEngagementToNumber(practice_data.engagement_quality),
      nervous_system_respect: practice_data.adaptations_made.length > 0 || 
                              practice_data.nervous_system_state === 'regulated',
      neural_benefit_estimate: this.calculateNeuralBenefit(practice_data),
      consolidation_support: practice_data.insights_discovered,
      generalization_moments: [],
      grace_tokens_used: grace_context?.using_grace_token ? 1 : 0,
      grace_reason: grace_context?.grace_reason,
      self_compassion_message: grace_context?.using_grace_token ? 
        'You honored your limits with wisdom. This is strength, not weakness.' : undefined,
      wins_celebrated: practice_data.wins_to_celebrate,
      insights_gained: practice_data.insights_discovered,
      gratitude_expressed: [],
      returning_from_pause: false,
      recovery_multiplier_applied: 1.0,
      comeback_wisdom: [],
      created_at: new Date(),
      updated_at: new Date()
    };
  }
  
  private static updateNeuralPathway(habit_id: string, entry: GraceHabitEntry): NeuralPathwayProgress {
    // This would load existing pathway data and update it
    // Simplified implementation for now
    return {
      pathway_name: 'Emotional Regulation Pathway',
      formation_start_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
      current_strength: Math.min(100, entry.neural_benefit_estimate * 5),
      formation_phase: 'strengthening',
      cycle_day: 15,
      cycles_completed: 0,
      presence_rate: 85,
      adaptation_wisdom_score: entry.nervous_system_respect ? 90 : 70,
      nervous_system_honoring: 88,
      return_strength_boost: 1.0,
      resilience_building: 75,
      milestones_achieved: [],
      next_celebration_threshold: 50
    };
  }
  
  private static mapEngagementToNumber(quality: PresenceTracking['engagement_quality']): number {
    const mapping = {
      minimal: 3,
      moderate: 6,
      full: 8,
      expanded: 10
    };
    return mapping[quality];
  }
  
  private static calculateNeuralBenefit(practice_data: any): number {
    let benefit = 5; // Base benefit for showing up
    
    if (practice_data.nervous_system_state === 'regulated') benefit += 3;
    if (practice_data.adaptations_made.length > 0) benefit += 2; // Wisdom bonus
    if (practice_data.insights_discovered.length > 0) benefit += 1;
    
    return Math.min(10, benefit);
  }
  
  private static checkForCelebrations(neural_update: NeuralPathwayProgress, entry: GraceHabitEntry): CelebrationMoment | undefined {
    if (neural_update.current_strength >= neural_update.next_celebration_threshold) {
      return {
        trigger: `neural_pathway_${neural_update.next_celebration_threshold}_percent`,
        celebration_type: 'warm',
        message: `Incredible! Your neural pathway is ${neural_update.current_strength}% formed. Your consistency is literally rewiring your brain! 🎉`,
        somatic_element: 'Take three deep breaths and feel the pride in your body',
        reflection_prompt: 'What changes have you noticed since beginning this practice?'
      };
    }
    return undefined;
  }
  
  private static assessGraceTokenGeneration(entry: GraceHabitEntry, challenges: string[]): GraceToken[] {
    if (challenges.length >= 3) { // Facing multiple challenges deserves grace
      return [{
        id: `earned_${Date.now()}`,
        earned_date: new Date(),
        reason: 'life_challenge',
        description: 'Earned for navigating multiple challenges while maintaining your practice',
        habit_context: entry.habit_id,
        grace_granted: 3,
        self_compassion_practiced: true
      }];
    }
    return [];
  }
  
  private static runShameInterruption(entry: GraceHabitEntry, practice_data: any): ShameInterruption | undefined {
    // Detect potential shame spirals and interrupt with compassion
    if (entry.engagement_level < 5 && entry.grace_tokens_used === 0) {
      return {
        trigger_detected: 'low_engagement_without_grace',
        interruption_message: 'Hold on - I notice you might be judging yourself. ANY engagement is neuroplasticity at work. Your brain doesn\'t know the difference between "perfect" practice and "imperfect" practice - it just knows you showed up.',
        reframe_offered: 'What if this "imperfect" practice is exactly what your nervous system needed today?',
        self_compassion_invitation: 'Place your hand on your heart and say: "I am learning to be gentle with myself as my brain grows new pathways."'
      };
    }
    return undefined;
  }
  
  private static generateCommunityInspiration(entry: GraceHabitEntry): CommunityShare | undefined {
    if (entry.insights_gained.length > 0 || entry.nervous_system_respect) {
      return {
        inspiration_type: 'wisdom_share',
        message: 'Someone in our community just demonstrated beautiful nervous system wisdom by adapting their practice to their capacity. This is what healing looks like! 💚',
        anonymous_wisdom: entry.insights_gained[0] || 'Adapting my practice to my capacity felt like self-love in action.',
        encouragement_for_others: 'Your body\'s wisdom deserves the same respect.'
      };
    }
    return undefined;
  }
  
  // Additional helper methods would be implemented here...
  private static createGraceToken(reason: GraceToken['reason'], context: any): GraceToken {
    return {
      id: `token_${Date.now()}`,
      earned_date: new Date(),
      reason,
      description: context.learning_opportunity,
      habit_context: 'current_habit',
      grace_granted: context.expected_duration || 7,
      wisdom_gained: context.learning_opportunity,
      self_compassion_practiced: true
    };
  }
  
  private static createPauseWisdomRitual(context: any): PauseWisdomRitual {
    return {
      ritual_type: 'pause_honoring',
      invitation: 'Your body and nervous system are asking for rest. This is wisdom, not failure.',
      reflection_questions: [
        'What is my body/nervous system trying to tell me?',
        'How is pausing an act of self-care?',
        'What do I need to feel ready to return?'
      ],
      self_compassion_practice: 'Loving-kindness meditation focused on self-forgiveness',
      wisdom_integration: context.learning_opportunity
    };
  }
  
  private static protectNeuralProgress(habit_id: string, duration?: number): NeuralProtection {
    return {
      protection_message: 'Your neural pathways remain strong during rest periods. Neuroplasticity includes integration phases.',
      strength_preservation: 'maintained',
      return_boost_prepared: true,
      duration_protected: duration || 14
    };
  }
  
  private static createReturnStrategy(habit_id: string, context: any): ReturnStrategy {
    return {
      gentle_reentry_plan: 'Start with the minimal version of your practice',
      capacity_assessment: 'Check in with your nervous system first',
      adaptation_options: [
        'Shorter duration',
        'Different time of day',
        'Modified environment',
        'Additional support'
      ],
      celebration_of_return: 'Honor the courage it takes to begin again'
    };
  }
  
  private static offerCommunitySupport(support_needed: string[]): CommunitySupport | undefined {
    if (support_needed.length > 0) {
      return {
        support_type: 'gentle_encouragement',
        message: 'Our community holds space for all phases of the healing journey',
        resources_offered: support_needed,
        connection_opportunities: ['Anonymous wisdom sharing', 'Mutual support check-ins']
      };
    }
    return undefined;
  }
  
  // Visualization helper methods...
  private static createPathwayGardenVisualization(habit_id: string, timeframe: string): PathwayVisualization {
    return {
      visualization_type: 'neural_garden',
      metaphor: 'Your neural pathways are like a garden growing stronger each day',
      growth_elements: [
        { element: 'seeds_planted', value: 21, description: 'Days you showed up' },
        { element: 'roots_deepening', value: 75, description: 'Pathway strength' },
        { element: 'flowers_blooming', value: 3, description: 'Milestones achieved' }
      ],
      grace_elements: [
        { element: 'rest_periods', value: 2, description: 'Wise pause periods for integration' },
        { element: 'adaptation_wisdom', value: 90, description: 'How well you honored your capacity' }
      ]
    };
  }
  
  private static createPresenceChart(habit_id: string, timeframe: string): PresenceChart {
    return {
      chart_type: 'presence_over_perfection',
      title: 'Your Beautiful Practice Journey',
      subtitle: 'Celebrating all the ways you show up for yourself',
      data_points: [
        { date: new Date(), presence_type: 'showed_up', celebration: 'You honored your commitment' },
        { date: new Date(), presence_type: 'adapted_beautifully', celebration: 'You listened to your wisdom' }
      ]
    };
  }
}

// Supporting interfaces for grace-based tracking
interface CelebrationMoment {
  trigger: string;
  celebration_type: 'subtle' | 'gentle' | 'warm' | 'joyful' | 'radiant';
  message: string;
  somatic_element?: string;
  reflection_prompt?: string;
}

interface ShameInterruption {
  trigger_detected: string;
  interruption_message: string;
  reframe_offered: string;
  self_compassion_invitation: string;
}

interface CommunityShare {
  inspiration_type: string;
  message: string;
  anonymous_wisdom: string;
  encouragement_for_others: string;
}

interface PauseWisdomRitual {
  ritual_type: string;
  invitation: string;
  reflection_questions: string[];
  self_compassion_practice: string;
  wisdom_integration: string;
}

interface NeuralProtection {
  protection_message: string;
  strength_preservation: string;
  return_boost_prepared: boolean;
  duration_protected: number;
}

interface ReturnStrategy {
  gentle_reentry_plan: string;
  capacity_assessment: string;
  adaptation_options: string[];
  celebration_of_return: string;
}

interface CommunitySupport {
  support_type: string;
  message: string;
  resources_offered: string[];
  connection_opportunities: string[];
}

interface WisdomIntegration {
  wisdom_gained: string[];
  integration_practices: string[];
  growth_celebrated: string;
}

interface AdaptationPlan {
  modifications_suggested: string[];
  capacity_honoring: string[];
  success_redefinition: string;
}

interface PathwayVisualization {
  visualization_type: string;
  metaphor: string;
  growth_elements: Array<{element: string; value: number; description: string}>;
  grace_elements: Array<{element: string; value: number; description: string}>;
}

interface PresenceChart {
  chart_type: string;
  title: string;
  subtitle: string;
  data_points: Array<{date: Date; presence_type: string; celebration: string}>;
}

interface WisdomTimeline {
  timeline_type: string;
  wisdom_moments: Array<{date: Date; wisdom: string; integration: string}>;
}

interface CelebrationVisualization {
  constellation_type: string;
  milestones: Array<{achievement: string; date: Date; significance: string}>;
}

interface NervousSystemGraph {
  graph_type: string;
  honoring_data: Array<{date: Date; respect_level: number; adaptations: string[]}>;
}

interface CommunityImpactChart {
  impact_type: string;
  inspiration_given: number;
  wisdom_shared: number;
  support_received: number;
}