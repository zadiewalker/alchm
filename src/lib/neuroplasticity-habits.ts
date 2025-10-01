/**
 * ALCHM Neuroplasticity & Habit Formation Engine
 * Trauma-informed, neuroscience-backed architecture for lasting behavioral change
 * 
 * This system leverages polyvagal theory, typeof window !== 'undefined' && window of tolerance concepts, and
 * neuroplasticity research to create sustainable habits that respect trauma responses.
 * 
 * Design Philosophy: Make neuroplasticity elegantly accessible
 */

export interface NervousSystemState {
  current: 'ventral_vagal' | 'sympathetic' | 'dorsal_vagal';
  typeof window !== 'undefined' && windowOfTolerance: {
    baseline: number; // 0-100, user's typical capacity
    current: number;  // 0-100, current capacity
    trend: 'expanding' | 'stable' | 'contracting';
  };
  autonomicMarkers: {
    heartRateVariability?: number;
    breathingPattern: 'calm' | 'shallow' | 'rapid' | 'irregular';
    energyLevel: 'depleted' | 'low' | 'stable' | 'energized' | 'hyperaroused';
    emotionalState: 'disconnected' | 'overwhelmed' | 'balanced' | 'engaged';
  };
  regulationCapacity: 'minimal' | 'limited' | 'moderate' | 'strong';
  lastAssessment: Date;
  glimmers: string[]; // Positive nervous system cues from recent days
  triggers: TriggerAwareness[];
}

export interface TriggerAwareness {
  type: 'somatic' | 'emotional' | 'cognitive' | 'environmental';
  intensity: number; // 1-10
  recognitionSpeed: 'immediate' | 'during' | 'after' | 'much_later';
  coping_effectiveness: number; // 1-10
  description?: string;
  first_noticed: Date;
  pattern_identified: boolean;
}

export interface MicroHabit {
  id: string;
  name: string;
  description: string;
  neuroplasticity_target: 'prefrontal_cortex' | 'amygdala_regulation' | 'hippocampus' | 'vagal_tone' | 'mirror_neurons';
  
  // Trauma-informed scaling
  minimal_version: string;      // 10-second version for dysregulated states
  moderate_version: string;     // 2-minute version for limited capacity
  expanded_version: string;     // Full version for strong regulation
  
  // Neuroplasticity design
  repetition_threshold: number; // Days needed for neural pathway formation
  complexity_progression: MicroHabitProgression[];
  synaptic_plasticity_typeof window !== 'undefined' && window: 'sleep_dependent' | 'immediate' | 'consolidation_phase';
  
  // Somatic integration
  body_awareness_component: string;
  grounding_elements: string[];
  breathing_integration: boolean;
  
  // Personalization
  trauma_adaptations: TraumaAdaptation[];
  nervous_system_requirements: {
    minimum_typeof window !== 'undefined' && window: number; // Minimum typeof window !== 'undefined' && window of tolerance required
    contraindicated_states: ('sympathetic' | 'dorsal_vagal')[];
    optimal_states: ('ventral_vagal' | 'sympathetic' | 'dorsal_vagal')[];
  };
  
  // Measurement
  progress_indicators: ProgressIndicator[];
  neuroplasticity_markers: NeuroplasticityMarker[];
  
  created_date: Date;
  last_adapted: Date;
}

export interface MicroHabitProgression {
  week: number;
  complexity_level: 'foundation' | 'building' | 'integrating' | 'mastering';
  neural_focus: string;
  practice_description: string;
  expected_adaptations: string[];
}

export interface TraumaAdaptation {
  trauma_type: 'developmental' | 'shock' | 'complex' | 'betrayal' | 'systemic';
  modification: string;
  rationale: string;
  safety_considerations: string[];
}

export interface ProgressIndicator {
  type: 'somatic_awareness' | 'emotional_regulation' | 'cognitive_flexibility' | 'stress_response' | 'relational_capacity';
  measurement_method: 'self_report' | 'behavioral_observation' | 'physiological' | 'pattern_recognition';
  baseline_establishment_period: number; // days
  change_detection_sensitivity: 'subtle' | 'moderate' | 'significant';
  celebration_threshold: number;
}

export interface NeuroplasticityMarker {
  brain_region: string;
  expected_change: string;
  timeframe: string;
  evidence_base: string[];
  user_friendly_description: string;
}

export interface HabitStack {
  id: string;
  name: string;
  description: string;
  micro_habits: string[]; // IDs of micro habits
  
  // Trauma-informed sequencing
  nervous_system_preparation: string; // What to do to prepare nervous system
  optimal_timing: TimingRecommendation[];
  stack_duration_range: [number, number]; // min, max minutes
  
  // Flexibility and adaptation
  modification_options: StackModification[];
  pause_protocols: PauseProtocol[];
  recovery_adaptations: string[];
  
  // Integration support
  environmental_supports: string[];
  social_supports: string[];
  reminder_strategies: ReminderStrategy[];
  
  created_date: Date;
  effectiveness_rating: number; // 1-10, based on consistency and wellbeing
}

export interface TimingRecommendation {
  time_of_day: 'morning' | 'midday' | 'evening' | 'flexible';
  nervous_system_state: ('ventral_vagal' | 'sympathetic' | 'dorsal_vagal')[];
  duration_minutes: number;
  preparation_needed: string;
  rationale: string;
}

export interface StackModification {
  trigger_condition: string;
  modification: 'simplify' | 'skip_portion' | 'extend_rest' | 'add_grounding' | 'pause_entirely';
  specific_changes: string[];
  duration: 'this_session' | 'today_only' | 'until_regulated' | 'reassess_in_days';
}

export interface PauseProtocol {
  trigger: string;
  immediate_action: string;
  self_compassion_message: string;
  return_criteria: string;
  adaptation_for_return: string;
}

export interface ReminderStrategy {
  type: 'gentle_notification' | 'environmental_cue' | 'body_awareness' | 'intention_setting' | 'social_support';
  description: string;
  trauma_considerations: string[];
}

export interface HabitProgress {
  user_id: string;
  habit_id: string;
  
  // Neural change tracking
  days_practiced: number;
  neural_pathway_strength: number; // 0-100, estimated based on consistency and engagement
  automaticity_level: number; // 0-100, how automatic the habit has become
  
  // Wellbeing correlation
  wellbeing_correlation: number; // -1 to 1, correlation with wellbeing measures
  stress_response_improvement: number; // 0-100
  regulation_capacity_change: number; // -50 to 50, change from baseline
  
  // Adaptation history
  modifications_used: string[];
  pause_periods: PausePeriod[];
  nervous_system_trends: NervousSystemTrend[];
  
  // Celebration milestones
  neuroplasticity_milestones: NeuroplasticityMilestone[];
  personal_victories: PersonalVictory[];
  
  last_updated: Date;
  next_adaptation_review: Date;
}

export interface PausePeriod {
  start_date: Date;
  end_date?: Date;
  reason: string;
  self_compassion_practiced: boolean;
  learning_extracted: string;
  return_strategy: string;
}

export interface NervousSystemTrend {
  date: Date;
  typeof window !== 'undefined' && window_of_tolerance: number;
  regulation_speed: number; // How quickly they return to baseline
  glimmers_noticed: number;
  triggers_recognized: number;
  overall_resilience: number;
}

export interface NeuroplasticityMilestone {
  date: Date;
  type: 'neural_pathway_formation' | 'automaticity_threshold' | 'stress_response_improvement' | 'regulation_mastery';
  description: string;
  celebration_message: string;
  supporting_evidence: string[];
}

export interface PersonalVictory {
  date: Date;
  description: string;
  habit_connection: string;
  emotional_significance: number; // 1-10
  shared_with_others: boolean;
}

export class NeuroplasticityHabitEngine {
  
  /**
   * Create a personalized micro-habit based on user's trauma history and current capacity
   */
  static createPersonalizedMicroHabit(
    user_profile: {
      trauma_history?: string[];
      current_challenges: string[];
      nervous_system_baseline: NervousSystemState;
      existing_strengths: string[];
      preferred_modalities: ('somatic' | 'cognitive' | 'emotional' | 'creative' | 'movement' | 'breathing')[];
    },
    neuroplasticity_target: MicroHabit['neuroplasticity_target']
  ): MicroHabit {
    
    const habit_templates = this.getHabitTemplatesForTarget(neuroplasticity_target);
    const selected_template = this.selectBestTemplate(habit_templates, user_profile);
    
    return this.adaptTemplateForUser(selected_template, user_profile);
  }
  
  /**
   * Assess current nervous system state with gentle, trauma-informed approach
   */
  static assessNervousSystemState(
    somatic_check: {
      energy_level: string;
      breathing_awareness: string;
      muscle_tension: string;
      heart_awareness: string;
      overall_sense: string;
    },
    recent_experiences?: {
      sleep_quality: number;
      stress_events: string[];
      positive_connections: string[];
      accomplishments: string[];
    }
  ): NervousSystemState {
    
    const current_state = this.interpretSomaticSignals(somatic_check);
    const typeof window !== 'undefined' && window_assessment = this.calculateWindowOfTolerance(somatic_check, recent_experiences);
    const capacity = this.determineRegulationCapacity(current_state, typeof window !== 'undefined' && window_assessment);
    
    return {
      current: current_state,
      typeof window !== 'undefined' && windowOfTolerance: typeof window !== 'undefined' && window_assessment,
      autonomicMarkers: this.extractAutonomicMarkers(somatic_check),
      regulationCapacity: capacity,
      lastAssessment: new Date(),
      glimmers: this.identifyGlimmers(recent_experiences?.positive_connections || []),
      triggers: [] // Would be populated from user's historical data
    };
  }
  
  /**
   * Recommend habit modifications based on current nervous system state
   */
  static adaptHabitsToCurrentState(
    current_state: NervousSystemState,
    scheduled_habits: MicroHabit[],
    user_preferences: {
      prefer_simplification: boolean;
      auto_adapt: boolean;
      reminder_style: 'gentle' | 'encouraging' | 'minimal';
    }
  ): {
    recommended_habits: AdaptedHabit[];
    modifications_made: string[];
    self_compassion_reminder: string;
    return_to_full_practice_criteria: string;
  } {
    
    const adapted_habits = scheduled_habits.map(habit => 
      this.adaptHabitForCurrentState(habit, current_state)
    );
    
    const modifications = adapted_habits
      .filter(ah => ah.modification_applied)
      .map(ah => ah.modification_explanation);
    
    return {
      recommended_habits: adapted_habits,
      modifications_made: modifications,
      self_compassion_reminder: this.generateSelfCompassionMessage(current_state, modifications.length),
      return_to_full_practice_criteria: this.defineReturnCriteria(current_state)
    };
  }
  
  /**
   * Track neuroplastic changes with celebration of brain's adaptive capacity
   */
  static trackNeuroplasticProgress(
    habit_progress: HabitProgress,
    recent_practice_data: {
      consistency_rate: number;
      engagement_quality: number; // 1-10
      wellbeing_correlation: number;
      challenge_navigation: string[];
    }
  ): {
    neural_pathway_strength_change: number;
    automaticity_progress: number;
    milestones_reached: NeuroplasticityMilestone[];
    celebration_messages: string[];
    next_development_focus: string;
  } {
    
    const neural_change = this.calculateNeuralPathwayStrength(habit_progress, recent_practice_data);
    const automaticity = this.assessAutomaticity(recent_practice_data);
    const milestones = this.identifyNewMilestones(habit_progress, neural_change, automaticity);
    
    return {
      neural_pathway_strength_change: neural_change,
      automaticity_progress: automaticity,
      milestones_reached: milestones,
      celebration_messages: milestones.map(m => m.celebration_message),
      next_development_focus: this.recommendNextFocus(habit_progress, neural_change)
    };
  }
  
  /**
   * Create elegant, Jony Ive-inspired progress visualization
   */
  static generateProgressVisualization(
    habit_progress: HabitProgress,
    timeframe: 'week' | 'month' | 'quarter'
  ): {
    neural_pathway_visual: ProgressVisualization;
    wellbeing_correlation_chart: ProgressVisualization;
    nervous_system_resilience_trend: ProgressVisualization;
    celebration_highlights: CelebrationHighlight[];
    insights_discovered: string[];
  } {
    
    return {
      neural_pathway_visual: this.createNeuralPathwayVisualization(habit_progress, timeframe),
      wellbeing_correlation_chart: this.createWellbeingCorrelationChart(habit_progress, timeframe),
      nervous_system_resilience_trend: this.createResilienceTrendChart(habit_progress, timeframe),
      celebration_highlights: this.extractCelebrationHighlights(habit_progress, timeframe),
      insights_discovered: this.generateInsights(habit_progress, timeframe)
    };
  }
  
  // Private helper methods for trauma-informed implementation
  private static getHabitTemplatesForTarget(target: MicroHabit['neuroplasticity_target']): MicroHabitTemplate[] {
    const templates = {
      prefrontal_cortex: [
        {
          name: "Gentle Decision Pause",
          description: "Brief pause before decisions to strengthen executive function",
          minimal: "Take one breath before choosing",
          moderate: "Notice the choice, breathe, then decide mindfully",
          expanded: "Pause, connect with body wisdom, consider options, breathe, then choose"
        },
        {
          name: "Intention Micro-Setting",
          description: "Tiny intention-setting practice for cognitive flexibility",
          minimal: "Name one intention for the next hour",
          moderate: "Set gentle intention and notice how it feels in your body",
          expanded: "Set intention, visualize it manifesting, connect with your why"
        }
      ],
      amygdala_regulation: [
        {
          name: "Amygdala Awareness",
          description: "Gentle amygdala recognition and soothing",
          minimal: "Name the emotion: 'I notice anxiety/fear/anger'",
          moderate: "Name emotion, place hand on heart, take slow breath",
          expanded: "Name emotion, self-soothe with touch, breathe, offer self-compassion"
        }
      ],
      vagal_tone: [
        {
          name: "Vagal Breath",
          description: "Breathing practice to strengthen vagal tone",
          minimal: "Three slow exhales longer than inhales",
          moderate: "Box breathing: 4 counts in, hold 4, out 6, rest 2",
          expanded: "Extended exhale breathing with hand on heart and belly"
        }
      ]
    } as const;
    
    return templates[target] || [];
  }
  
  private static selectBestTemplate(
    templates: MicroHabitTemplate[],
    user_profile: any
  ): MicroHabitTemplate {
    // Select based on user preferences and trauma considerations
    return templates[0]; // Simplified for now
  }
  
  private static adaptTemplateForUser(
    template: MicroHabitTemplate,
    user_profile: any
  ): MicroHabit {
    // Create trauma-informed adaptations
    return {
      id: `habit_${Date.now()}`,
      name: template.name,
      description: template.description,
      neuroplasticity_target: 'prefrontal_cortex', // Would be dynamic
      minimal_version: template.minimal,
      moderate_version: template.moderate,
      expanded_version: template.expanded,
      repetition_threshold: 21, // Days for initial pathway formation
      complexity_progression: this.createProgressionPlan(template),
      synaptic_plasticity_typeof window !== 'undefined' && window: 'consolidation_phase',
      body_awareness_component: "Notice sensations in your body",
      grounding_elements: ["Feel feet on ground", "Notice breath naturally"],
      breathing_integration: true,
      trauma_adaptations: this.createTraumaAdaptations(user_profile),
      nervous_system_requirements: {
        minimum_typeof window !== 'undefined' && window: 30,
        contraindicated_states: ['dorsal_vagal'],
        optimal_states: ['ventral_vagal']
      },
      progress_indicators: this.createProgressIndicators(),
      neuroplasticity_markers: this.createNeuroplasticityMarkers(),
      created_date: new Date(),
      last_adapted: new Date()
    };
  }
  
  private static interpretSomaticSignals(somatic_check: any): 'ventral_vagal' | 'sympathetic' | 'dorsal_vagal' {
    // Simplified interpretation logic
    if (somatic_check.energy_level === 'energized' && somatic_check.overall_sense === 'calm') {
      return 'ventral_vagal';
    }
    if (somatic_check.energy_level === 'high' || somatic_check.breathing_awareness === 'rapid') {
      return 'sympathetic';
    }
    return 'dorsal_vagal';
  }
  
  private static calculateWindowOfTolerance(
    somatic_check: any,
    recent_experiences?: any
  ): NervousSystemState['typeof window !== 'undefined' && windowOfTolerance'] {
    return {
      baseline: 70,
      current: 65,
      trend: 'stable'
    };
  }
  
  private static determineRegulationCapacity(
    current_state: string,
    typeof window !== 'undefined' && window_assessment: any
  ): 'minimal' | 'limited' | 'moderate' | 'strong' {
    if (typeof window !== 'undefined' && window_assessment.current >= 80) return 'strong';
    if (typeof window !== 'undefined' && window_assessment.current >= 60) return 'moderate';
    if (typeof window !== 'undefined' && window_assessment.current >= 40) return 'limited';
    return 'minimal';
  }
  
  private static extractAutonomicMarkers(somatic_check: any): NervousSystemState['autonomicMarkers'] {
    return {
      breathingPattern: 'calm',
      energyLevel: 'stable',
      emotionalState: 'balanced'
    };
  }
  
  private static identifyGlimmers(positive_connections: string[]): string[] {
    return positive_connections.slice(0, 3);
  }
  
  private static adaptHabitForCurrentState(
    habit: MicroHabit,
    current_state: NervousSystemState
  ): AdaptedHabit {
    
    let version_to_use = habit.moderate_version;
    let modification_applied = false;
    let explanation = "";
    
    if (current_state.regulationCapacity === 'minimal') {
      version_to_use = habit.minimal_version;
      modification_applied = true;
      explanation = "Simplified to honor your current capacity";
    } else if (current_state.regulationCapacity === 'strong') {
      version_to_use = habit.expanded_version;
    }
    
    return {
      habit_id: habit.id,
      adapted_version: version_to_use,
      modification_applied,
      modification_explanation: explanation,
      estimated_duration: this.estimateDuration(version_to_use),
      nervous_system_prep: this.recommendPreparation(current_state)
    };
  }
  
  private static generateSelfCompassionMessage(
    current_state: NervousSystemState,
    modifications_count: number
  ): string {
    if (modifications_count > 0) {
      return "Your nervous system is asking for gentleness today. Adapting your practice is wisdom, not weakness.";
    }
    return "You're showing up beautifully for yourself today.";
  }
  
  private static defineReturnCriteria(current_state: NervousSystemState): string {
    if (current_state.regulationCapacity === 'minimal') {
      return "When you feel more grounded and your breathing feels easier";
    }
    return "Continue listening to your body's wisdom";
  }
  
  // Additional helper methods would be implemented here...
  private static createProgressionPlan(template: MicroHabitTemplate): MicroHabitProgression[] {
    return [
      {
        week: 1,
        complexity_level: 'foundation',
        neural_focus: 'Initial pathway creation',
        practice_description: template.minimal,
        expected_adaptations: ['Awareness building', 'Pattern recognition']
      }
    ];
  }
  
  private static createTraumaAdaptations(user_profile: any): TraumaAdaptation[] {
    return [
      {
        trauma_type: 'complex',
        modification: 'Extra emphasis on choice and agency',
        rationale: 'Restores sense of control',
        safety_considerations: ['Always allow for stopping', 'Emphasize body autonomy']
      }
    ];
  }
  
  private static createProgressIndicators(): ProgressIndicator[] {
    return [
      {
        type: 'emotional_regulation',
        measurement_method: 'self_report',
        baseline_establishment_period: 7,
        change_detection_sensitivity: 'subtle',
        celebration_threshold: 10
      }
    ];
  }
  
  private static createNeuroplasticityMarkers(): NeuroplasticityMarker[] {
    return [
      {
        brain_region: 'Prefrontal Cortex',
        expected_change: 'Increased executive function',
        timeframe: '2-4 weeks',
        evidence_base: ['Davidson et al., 2003', 'Lutz et al., 2004'],
        user_friendly_description: 'Your brain is building stronger decision-making circuits'
      }
    ];
  }
  
  private static calculateNeuralPathwayStrength(
    habit_progress: HabitProgress,
    recent_data: any
  ): number {
    return Math.min(100, habit_progress.days_practiced * 2.5 + recent_data.engagement_quality * 5);
  }
  
  private static assessAutomaticity(recent_data: any): number {
    return recent_data.consistency_rate * 0.8 + (recent_data.engagement_quality / 10) * 20;
  }
  
  private static identifyNewMilestones(
    habit_progress: HabitProgress,
    neural_change: number,
    automaticity: number
  ): NeuroplasticityMilestone[] {
    const milestones: NeuroplasticityMilestone[] = [];
    
    if (neural_change >= 50 && !habit_progress.neuroplasticity_milestones.find(m => m.type === 'neural_pathway_formation')) {
      milestones.push({
        date: new Date(),
        type: 'neural_pathway_formation',
        description: 'Initial neural pathway established',
        celebration_message: '✨ Amazing! Your brain has started forming new pathways. This is real, measurable change.',
        supporting_evidence: ['Consistency over 21 days', 'Sustained engagement', 'Wellbeing correlation']
      });
    }
    
    return milestones;
  }
  
  private static recommendNextFocus(habit_progress: HabitProgress, neural_change: number): string {
    if (neural_change < 50) {
      return "Continue building consistency to strengthen neural pathways";
    }
    return "Ready to add complexity or develop automaticity";
  }
  
  private static createNeuralPathwayVisualization(
    habit_progress: HabitProgress,
    timeframe: string
  ): ProgressVisualization {
    return {
      type: 'neural_pathway_growth',
      title: 'Your Brain is Changing',
      description: 'Neural pathway strength over time',
      data_points: [], // Would contain actual progress data
      visual_style: 'elegant_line_graph',
      color_scheme: ['#a4b792', '#8fa882', '#7a9971'] // Sage green variations
    };
  }
  
  private static createWellbeingCorrelationChart(
    habit_progress: HabitProgress,
    timeframe: string
  ): ProgressVisualization {
    return {
      type: 'wellbeing_correlation',
      title: 'Habits Supporting Your Wellbeing',
      description: 'How your practice correlates with feeling good',
      data_points: [],
      visual_style: 'scatter_with_trend',
      color_scheme: ['#a4b792', '#e8f4f8']
    };
  }
  
  private static createResilienceTrendChart(
    habit_progress: HabitProgress,
    timeframe: string
  ): ProgressVisualization {
    return {
      type: 'resilience_trend',
      title: 'Growing Resilience',
      description: 'Your nervous system\'s expanding capacity',
      data_points: [],
      visual_style: 'area_chart',
      color_scheme: ['#a4b792', '#c4d4b8']
    };
  }
  
  private static extractCelebrationHighlights(
    habit_progress: HabitProgress,
    timeframe: string
  ): CelebrationHighlight[] {
    return [
      {
        date: new Date(),
        title: 'Neural Pathway Milestone',
        description: 'Your brain formed measurable new connections',
        significance: 'high',
        celebration_style: 'gentle_acknowledgment'
      }
    ];
  }
  
  private static generateInsights(habit_progress: HabitProgress, timeframe: string): string[] {
    return [
      "Your consistency is literally rewiring your brain for resilience",
      "Small practices create profound neurological changes",
      "Your nervous system is learning new patterns of regulation"
    ];
  }
  
  private static estimateDuration(version: string): number {
    if (version.length < 50) return 1; // minutes
    if (version.length < 100) return 2;
    return 5;
  }
  
  private static recommendPreparation(current_state: NervousSystemState): string {
    if (current_state.regulationCapacity === 'minimal') {
      return "Take a moment to feel your feet on the ground first";
    }
    return "Connect with your breath and intention";
  }
}

// Supporting interfaces
interface MicroHabitTemplate {
  name: string;
  description: string;
  minimal: string;
  moderate: string;
  expanded: string;
}

interface AdaptedHabit {
  habit_id: string;
  adapted_version: string;
  modification_applied: boolean;
  modification_explanation: string;
  estimated_duration: number;
  nervous_system_prep: string;
}

interface ProgressVisualization {
  type: string;
  title: string;
  description: string;
  data_points: any[];
  visual_style: string;
  color_scheme: string[];
}

interface CelebrationHighlight {
  date: Date;
  title: string;
  description: string;
  significance: 'low' | 'medium' | 'high' | 'profound';
  celebration_style: 'subtle_acknowledgment' | 'gentle_acknowledgment' | 'warm_celebration' | 'radiant_celebration';
}