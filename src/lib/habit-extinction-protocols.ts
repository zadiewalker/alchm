/**
 * ALCHM Habit Extinction & Pattern Transformation Protocols
 * 
 * Neuroplasticity-based system for transforming unhelpful patterns rather than 
 * simply trying to "break" habits. Uses principles of neural rewiring, 
 * trauma-informed approaches, and gentle pattern interruption.
 * 
 * Core Philosophy:
 * - Transform rather than eliminate - unhelpful patterns often served a protective function
 * - Curiosity over judgment - understanding the pattern's original purpose
 * - Nervous system safety first - avoid creating additional stress or shame
 * - Replacement over restriction - build new pathways while old ones naturally weaken
 * 
 * Based on research from:
 * - Huberman Lab: Neural plasticity and habit change
 * - Charles Duhigg: "The Power of Habit" - Habit loops
 * - James Clear: Habit environment design
 * - Dr. Judson Brewer: Neuroscience of breaking habits
 * - Trauma-informed pattern understanding
 */

import { PolyvagalState } from './polyvagal-state-engine';
import { EmotionalSkill } from '../components/HabitStackBuilder';

// Pattern analysis and understanding
export interface UnhelpfulPattern {
  pattern_id: string;
  pattern_name: string;
  description: string;
  category: 'emotional_regulation' | 'cognitive_pattern' | 'behavioral_habit' | 'relational_pattern' | 'somatic_pattern';
  
  // Pattern loop analysis
  trigger_cues: TriggerCue[];
  routine_behaviors: RoutineBehavior[];
  reinforcing_rewards: PatternReward[];
  
  // Protective function understanding
  original_adaptive_function: string;
  current_impact: PatternImpact;
  nervous_system_relationship: NervousSystemPattern;
  
  // Transformation readiness
  user_awareness_level: number; // 0-100
  motivation_to_change: number; // 0-100
  support_system_strength: number; // 0-100
  competing_patterns: string[]; // Other patterns that might interfere
}

export interface TriggerCue {
  cue_type: 'environmental' | 'emotional' | 'social' | 'temporal' | 'physiological';
  specific_trigger: string;
  intensity_level: number; // 0-100
  frequency: 'multiple_daily' | 'daily' | 'several_weekly' | 'weekly' | 'occasional';
  nervous_system_state_correlation: PolyvagalState['primary_state'][];
  modification_potential: 'high' | 'medium' | 'low'; // How modifiable this trigger is
}

export interface RoutineBehavior {
  behavior_description: string;
  duration_typical: string;
  intensity: number; // 0-100
  automatic_level: number; // 0-100 (how unconscious)
  somatic_components: string[];
  emotional_components: string[];
  cognitive_components: string[];
}

export interface PatternReward {
  reward_type: 'neurochemical' | 'emotional_relief' | 'social_connection' | 'sense_of_control' | 'avoidance_of_discomfort';
  specific_reward: string;
  reward_strength: number; // 0-100
  immediate_vs_delayed: 'immediate' | 'short_term' | 'long_term';
  replacement_potential: ReplacementReward[];
}

export interface ReplacementReward {
  alternative_reward: string;
  satisfaction_potential: number; // 0-100
  accessibility: number; // 0-100 (how easy to access)
  nervous_system_compatibility: string;
}

export interface PatternImpact {
  helpful_aspects: string[];
  unhelpful_aspects: string[];
  overall_life_impact: number; // -100 to +100
  specific_area_impacts: {
    relationships: number; // -100 to +100
    work_productivity: number;
    emotional_wellbeing: number;
    physical_health: number;
    personal_growth: number;
  };
}

export interface NervousSystemPattern {
  typical_nervous_system_state_during_pattern: PolyvagalState['primary_state'];
  pattern_as_regulation_strategy: boolean;
  pattern_increases_dysregulation: boolean;
  typeof window !== 'undefined' && window_of_tolerance_impact: 'expands' | 'contracts' | 'neutral';
  somatic_signature: string; // How the pattern feels in the body
}

// Transformation protocol structure
export interface PatternTransformationProtocol {
  protocol_id: string;
  target_pattern: UnhelpfulPattern;
  transformation_approach: 'gentle_replacement' | 'gradual_modification' | 'environmental_design' | 'neural_rewiring' | 'trauma_informed_integration';
  
  phases: TransformationPhase[];
  success_metrics: TransformationMetric[];
  safety_protocols: SafetyProtocol[];
  
  // Personalization factors
  chronotype_considerations: string[];
  nervous_system_adaptations: string[];
  support_requirements: string[];
}

export interface TransformationPhase {
  phase_name: string;
  duration_weeks: number;
  primary_focus: string;
  daily_practices: TransformationPractice[];
  weekly_assessments: PhaseAssessment[];
  graduation_criteria: string[];
  
  // Trauma-informed adaptations
  nervous_system_preparation: string[];
  early_warning_signs: string[];
  modification_options: string[];
}

export interface TransformationPractice {
  practice_name: string;
  practice_type: 'awareness_building' | 'trigger_modification' | 'routine_replacement' | 'reward_substitution' | 'nervous_system_regulation';
  duration_minutes: number;
  frequency_per_day: number;
  instructions: string[];
  neuroplasticity_principle: string;
  trauma_safety_notes: string[];
}

export interface PhaseAssessment {
  assessment_name: string;
  assessment_questions: string[];
  progress_indicators: string[];
  nervous_system_check: string[];
  adjustment_recommendations: string[];
}

export interface TransformationMetric {
  metric_name: string;
  measurement_approach: 'frequency_tracking' | 'intensity_rating' | 'nervous_system_state' | 'life_impact_assessment' | 'qualitative_reflection';
  success_definition: string;
  avoiding_shame_metrics: string[]; // What NOT to measure to avoid shame spirals
}

export interface SafetyProtocol {
  protocol_name: string;
  trigger_conditions: string[];
  immediate_actions: string[];
  professional_support_criteria: string[];
  emergency_contacts: string[];
}

// Neural rewiring strategies
export interface NeuralRewiringStrategy {
  strategy_name: string;
  neuroplasticity_mechanism: 'synaptic_pruning' | 'neurogenesis' | 'myelin_remodeling' | 'neural_network_reorganization';
  implementation_steps: string[];
  optimal_timing: string;
  repetition_schedule: RepetitionSchedule;
  environmental_supports: string[];
}

export interface RepetitionSchedule {
  initial_frequency: 'hourly' | 'multiple_daily' | 'daily' | 'every_other_day';
  progression_pattern: 'linear_increase' | 'exponential_spacing' | 'plateau_maintenance' | 'responsive_to_progress';
  consolidation_supports: string[];
}

export class HabitExtinctionProtocolEngine {
  
  /**
   * Analyzes an unhelpful pattern to understand its structure and function
   */
  static analyzeUnhelpfulPattern(
    patternDescription: string,
    userObservations: PatternObservation[],
    currentNervousSystemState: PolyvagalState
  ): UnhelpfulPattern {
    
    // In a real implementation, this would use sophisticated pattern analysis
    // For now, creating a template based on common patterns
    
    const analyzedTriggers = this.analyzeTriggerCues(userObservations);
    const analyzedRoutines = this.analyzeRoutineBehaviors(userObservations);
    const analyzedRewards = this.analyzePatternRewards(userObservations);
    const nervousSystemAnalysis = this.analyzeNervousSystemRelationship(userObservations, currentNervousSystemState);
    
    return {
      pattern_id: `pattern_${Date.now()}`,
      pattern_name: patternDescription,
      description: `User-identified pattern: ${patternDescription}`,
      category: this.categorizePattern(patternDescription, userObservations),
      
      trigger_cues: analyzedTriggers,
      routine_behaviors: analyzedRoutines,
      reinforcing_rewards: analyzedRewards,
      
      original_adaptive_function: this.inferOriginalFunction(userObservations),
      current_impact: this.assessCurrentImpact(userObservations),
      nervous_system_relationship: nervousSystemAnalysis,
      
      user_awareness_level: this.assessAwarenessLevel(userObservations),
      motivation_to_change: 75, // Would be assessed from user input
      support_system_strength: 60, // Would be assessed from user data
      competing_patterns: []
    };
  }

  /**
   * Creates a personalized transformation protocol
   */
  static createTransformationProtocol(
    pattern: UnhelpfulPattern,
    targetEmotionalSkills: EmotionalSkill[],
    nervousSystemCapacity: PolyvagalState,
    userPreferences: { pace: 'very_gentle' | 'gentle' | 'moderate' | 'intensive' }
  ): PatternTransformationProtocol {
    
    const transformationApproach = this.selectTransformationApproach(pattern, nervousSystemCapacity);
    const phases = this.designTransformationPhases(pattern, transformationApproach, userPreferences.pace);
    const safetyProtocols = this.createSafetyProtocols(pattern, nervousSystemCapacity);
    
    return {
      protocol_id: `transformation_${pattern.pattern_id}_${Date.now()}`,
      target_pattern: pattern,
      transformation_approach: transformationApproach,
      
      phases: phases,
      success_metrics: this.createTransformationMetrics(pattern),
      safety_protocols: safetyProtocols,
      
      chronotype_considerations: [
        'Schedule practices during optimal awareness typeof window !== 'undefined' && windows',
        'Align with natural energy rhythms',
        'Use circadian biology to support neuroplasticity'
      ],
      nervous_system_adaptations: [
        'Begin all practices with nervous system check-in',
        'Modify intensity based on current regulation capacity',
        'Always prioritize safety over progress'
      ],
      support_requirements: [
        'Trusted person to share progress with',
        'Professional support if trauma responses emerge',
        'Compassionate accountability partner'
      ]
    };
  }

  /**
   * Monitors transformation progress and adapts protocol as needed
   */
  static monitorTransformationProgress(
    protocol: PatternTransformationProtocol,
    weeklyCheckins: WeeklyCheckin[],
    currentNervousSystemState: PolyvagalState
  ): ProtocolAdaptation {
    
    const progressAnalysis = this.analyzeTransformationProgress(weeklyCheckins);
    const nervousSystemImpact = this.assessNervousSystemImpact(weeklyCheckins, currentNervousSystemState);
    const adaptations = this.generateProtocolAdaptations(progressAnalysis, nervousSystemImpact);
    
    return {
      continue_current_phase: progressAnalysis.on_track && nervousSystemImpact.stable,
      phase_modifications: adaptations.phaseChanges,
      practice_adjustments: adaptations.practiceAdjustments,
      support_recommendations: adaptations.supportRecommendations,
      celebration_moments: progressAnalysis.achievements,
      gentle_encouragement: this.generateEncouragement(progressAnalysis, nervousSystemImpact)
    };
  }

  /**
   * Creates neural rewiring strategies for specific pattern components
   */
  static designNeuralRewiringStrategy(
    patternComponent: 'trigger_sensitivity' | 'automatic_routine' | 'reward_dependency',
    targetReplacement: string,
    nervousSystemCapacity: PolyvagalState
  ): NeuralRewiringStrategy {
    
    const strategies = {
      trigger_sensitivity: {
        strategy_name: 'Trigger Desensitization & Recontextualization',
        neuroplasticity_mechanism: 'synaptic_pruning' as const,
        implementation_steps: [
          'Practice noticing triggers in a regulated state',
          'Pair trigger awareness with calming response',
          'Gradually increase trigger exposure while maintaining regulation',
          'Create new neural associations through repetition',
          'Strengthen prefrontal cortex response to triggers'
        ],
        optimal_timing: 'When feeling regulated and resourced',
        repetition_schedule: {
          initial_frequency: 'daily' as const,
          progression_pattern: 'linear_increase' as const,
          consolidation_supports: ['Sleep quality', 'Stress management', 'Supportive relationships']
        },
        environmental_supports: [
          'Safe practice environment',
          'Supportive people nearby',
          'Removal of unnecessary trigger sources'
        ]
      },
      
      automatic_routine: {
        strategy_name: 'Routine Interruption & Replacement',
        neuroplasticity_mechanism: 'neural_network_reorganization' as const,
        implementation_steps: [
          'Increase awareness of routine initiation',
          'Create "pause points" in the routine',
          'Practice alternative behaviors at pause points',
          'Strengthen new neural pathways through repetition',
          'Celebrate successful routine modifications'
        ],
        optimal_timing: 'During natural transition times',
        repetition_schedule: {
          initial_frequency: 'multiple_daily' as const,
          progression_pattern: 'plateau_maintenance' as const,
          consolidation_supports: ['Environmental cues', 'Social accountability', 'Reward systems']
        },
        environmental_supports: [
          'Modified physical environment',
          'Removed triggering objects/contexts',
          'Added supportive cues for new behaviors'
        ]
      },
      
      reward_dependency: {
        strategy_name: 'Reward Substitution & Neurochemical Rebalancing',
        neuroplasticity_mechanism: 'neurogenesis' as const,
        implementation_steps: [
          'Identify the core need being met by current reward',
          'Find healthier ways to meet the same need',
          'Practice accessing alternative rewards',
          'Gradually reduce dependency on original reward',
          'Build sustainable reward systems'
        ],
        optimal_timing: 'When nervous system is regulated',
        repetition_schedule: {
          initial_frequency: 'daily' as const,
          progression_pattern: 'responsive_to_progress' as const,
          consolidation_supports: ['Variety in reward options', 'Social connection', 'Meaningful activities']
        },
        environmental_supports: [
          'Easy access to healthy rewards',
          'Reduced access to problematic rewards',
          'Community support for new reward systems'
        ]
      }
    };
    
    return strategies[patternComponent];
  }

  // Private helper methods
  
  private static analyzeTriggerCues(observations: PatternObservation[]): TriggerCue[] {
    // Would analyze user observations to identify common triggers
    return [
      {
        cue_type: 'emotional',
        specific_trigger: 'Feeling overwhelmed or stressed',
        intensity_level: 80,
        frequency: 'daily',
        nervous_system_state_correlation: ['sympathetic'],
        modification_potential: 'medium'
      },
      {
        cue_type: 'environmental',
        specific_trigger: 'Specific location or time of day',
        intensity_level: 60,
        frequency: 'daily',
        nervous_system_state_correlation: ['ventral_vagal', 'sympathetic'],
        modification_potential: 'high'
      }
    ];
  }

  private static analyzeRoutineBehaviors(observations: PatternObservation[]): RoutineBehavior[] {
    return [
      {
        behavior_description: 'Automatic behavioral sequence',
        duration_typical: '5-15 minutes',
        intensity: 70,
        automatic_level: 85,
        somatic_components: ['Tension in shoulders', 'Shallow breathing'],
        emotional_components: ['Temporary relief', 'Underlying anxiety'],
        cognitive_components: ['Racing thoughts', 'Self-critical dialogue']
      }
    ];
  }

  private static analyzePatternRewards(observations: PatternObservation[]): PatternReward[] {
    return [
      {
        reward_type: 'emotional_relief',
        specific_reward: 'Temporary escape from difficult emotions',
        reward_strength: 75,
        immediate_vs_delayed: 'immediate',
        replacement_potential: [
          {
            alternative_reward: 'Mindful breathing for emotional regulation',
            satisfaction_potential: 60,
            accessibility: 90,
            nervous_system_compatibility: 'Supports regulation rather than dysregulation'
          },
          {
            alternative_reward: 'Brief connection with supportive person',
            satisfaction_potential: 80,
            accessibility: 70,
            nervous_system_compatibility: 'Provides co-regulation and genuine relief'
          }
        ]
      }
    ];
  }

  private static analyzeNervousSystemRelationship(observations: PatternObservation[], currentState: PolyvagalState): NervousSystemPattern {
    return {
      typical_nervous_system_state_during_pattern: 'sympathetic',
      pattern_as_regulation_strategy: true,
      pattern_increases_dysregulation: false,
      typeof window !== 'undefined' && window_of_tolerance_impact: 'contracts',
      somatic_signature: 'Pattern often begins with physical tension and ends with temporary relaxation'
    };
  }

  private static categorizePattern(description: string, observations: PatternObservation[]): UnhelpfulPattern['category'] {
    // Simple keyword-based categorization - would be more sophisticated in real implementation
    if (description.toLowerCase().includes('emotion') || description.toLowerCase().includes('feeling')) {
      return 'emotional_regulation';
    }
    if (description.toLowerCase().includes('thought') || description.toLowerCase().includes('think')) {
      return 'cognitive_pattern';
    }
    if (description.toLowerCase().includes('relationship') || description.toLowerCase().includes('social')) {
      return 'relational_pattern';
    }
    if (description.toLowerCase().includes('body') || description.toLowerCase().includes('physical')) {
      return 'somatic_pattern';
    }
    return 'behavioral_habit';
  }

  private static inferOriginalFunction(observations: PatternObservation[]): string {
    return 'This pattern likely developed as a protective strategy to manage overwhelming emotions or situations. It served an important adaptive function at some point in your life.';
  }

  private static assessCurrentImpact(observations: PatternObservation[]): PatternImpact {
    return {
      helpful_aspects: [
        'Provides temporary relief from difficult emotions',
        'Gives sense of control in overwhelming situations',
        'Has been a reliable coping mechanism'
      ],
      unhelpful_aspects: [
        'May interfere with long-term goals',
        'Provides only temporary relief',
        'Can increase shame or self-criticism'
      ],
      overall_life_impact: -30, // Mild negative impact
      specific_area_impacts: {
        relationships: -20,
        work_productivity: -40,
        emotional_wellbeing: -30,
        physical_health: -10,
        personal_growth: -25
      }
    };
  }

  private static assessAwarenessLevel(observations: PatternObservation[]): number {
    // Would assess based on depth and accuracy of user observations
    return 70; // Good awareness level
  }

  private static selectTransformationApproach(pattern: UnhelpfulPattern, nervousSystemCapacity: PolyvagalState): PatternTransformationProtocol['transformation_approach'] {
    // Select approach based on pattern characteristics and nervous system capacity
    if (nervousSystemCapacity.regulation_quality < 50) {
      return 'trauma_informed_integration';
    }
    if (pattern.nervous_system_relationship.pattern_as_regulation_strategy) {
      return 'gentle_replacement';
    }
    if (pattern.trigger_cues.some(cue => cue.modification_potential === 'high')) {
      return 'environmental_design';
    }
    return 'neural_rewiring';
  }

  private static designTransformationPhases(
    pattern: UnhelpfulPattern,
    approach: PatternTransformationProtocol['transformation_approach'],
    pace: 'very_gentle' | 'gentle' | 'moderate' | 'intensive'
  ): TransformationPhase[] {
    const baseDuration = {
      'very_gentle': 6,
      'gentle': 4,
      'moderate': 3,
      'intensive': 2
    };

    return [
      {
        phase_name: 'Awareness & Understanding',
        duration_weeks: baseDuration[pace],
        primary_focus: 'Developing compassionate awareness of the pattern without judgment',
        daily_practices: [
          {
            practice_name: 'Pattern Awareness Check-in',
            practice_type: 'awareness_building',
            duration_minutes: 3,
            frequency_per_day: 2,
            instructions: [
              'Notice when the pattern is happening or about to happen',
              'Observe without judgment - you\'re just gathering information',
              'Note what you were feeling or thinking just before',
              'Thank yourself for this awareness'
            ],
            neuroplasticity_principle: 'Awareness strengthens prefrontal cortex regulation',
            trauma_safety_notes: ['Stop if you notice self-criticism arising', 'This is information gathering, not self-judgment']
          }
        ],
        weekly_assessments: [
          {
            assessment_name: 'Awareness Development Check',
            assessment_questions: [
              'How often are you noticing the pattern as it happens?',
              'What have you learned about your triggers?',
              'How is your self-compassion during this process?'
            ],
            progress_indicators: ['Increased pattern recognition', 'Reduced self-criticism', 'Growing curiosity about the pattern'],
            nervous_system_check: ['Regulation maintained during awareness practices', 'No increase in shame or anxiety'],
            adjustment_recommendations: ['Reduce frequency if overwhelming', 'Add more self-compassion practices']
          }
        ],
        graduation_criteria: [
          'Can notice pattern 70% of the time without self-criticism',
          'Understanding of at least 2 major triggers',
          'Maintained nervous system stability'
        ],
        nervous_system_preparation: [
          'Begin each practice feeling grounded and safe',
          'Have support available if needed',
          'Remember you can pause anytime'
        ],
        early_warning_signs: [
          'Increasing self-criticism or shame',
          'Feeling overwhelmed by pattern awareness',
          'Anxiety about changing the pattern'
        ],
        modification_options: [
          'Reduce practice frequency',
          'Focus only on noticing, not understanding',
          'Practice with support person'
        ]
      }
      // Additional phases would be added based on the specific pattern and approach
    ];
  }

  private static createTransformationMetrics(pattern: UnhelpfulPattern): TransformationMetric[] {
    return [
      {
        metric_name: 'Pattern Awareness Growth',
        measurement_approach: 'qualitative_reflection',
        success_definition: 'Increased ability to notice pattern without self-judgment',
        avoiding_shame_metrics: ['Not counting "failures"', 'Not comparing to others', 'Celebrating any awareness']
      },
      {
        metric_name: 'Nervous System Stability',
        measurement_approach: 'nervous_system_state',
        success_definition: 'Maintaining regulation throughout transformation process',
        avoiding_shame_metrics: ['Not pushing beyond capacity', 'Honoring need for breaks']
      },
      {
        metric_name: 'Life Impact Improvement',
        measurement_approach: 'life_impact_assessment',
        success_definition: 'Gradual improvement in areas affected by the pattern',
        avoiding_shame_metrics: ['Recognizing non-linear progress', 'Celebrating small wins']
      }
    ];
  }

  private static createSafetyProtocols(pattern: UnhelpfulPattern, nervousSystemCapacity: PolyvagalState): SafetyProtocol[] {
    return [
      {
        protocol_name: 'Overwhelm Response Protocol',
        trigger_conditions: ['Feeling overwhelmed by pattern awareness', 'Increase in shame or self-criticism'],
        immediate_actions: ['Pause all transformation practices', 'Use grounding techniques', 'Seek co-regulation'],
        professional_support_criteria: ['Persistent increase in distress', 'Pattern relates to trauma responses'],
        emergency_contacts: ['Trusted friend or family member', 'Mental health professional if available']
      }
    ];
  }

  private static analyzeTransformationProgress(checkins: WeeklyCheckin[]): ProgressAnalysis {
    return {
      on_track: true,
      achievements: ['Increased pattern awareness', 'Maintained self-compassion'],
      challenges: ['Some difficulty with triggers in stressful situations'],
      insights: ['Pattern serves important emotional regulation function']
    };
  }

  private static assessNervousSystemImpact(checkins: WeeklyCheckin[], currentState: PolyvagalState): NervousSystemImpact {
    return {
      stable: currentState.regulation_quality > 50,
      improvements: ['Better emotional regulation overall'],
      concerns: [],
      adaptations_needed: []
    };
  }

  private static generateProtocolAdaptations(progress: ProgressAnalysis, nervousSystemImpact: NervousSystemImpact): ProtocolAdaptationDetails {
    return {
      phaseChanges: [],
      practiceAdjustments: [],
      supportRecommendations: ['Continue with current support system']
    };
  }

  private static generateEncouragement(progress: ProgressAnalysis, nervousSystemImpact: NervousSystemImpact): string {
    return "You're doing incredible work in understanding and gently transforming this pattern. Remember that this process is about growth and self-compassion, not perfection. Every moment of awareness is a victory.";
  }
}

// Supporting interfaces
export interface PatternObservation {
  observation_date: Date;
  trigger_noticed: string;
  routine_description: string;
  emotional_state_before: string;
  emotional_state_after: string;
  somatic_experience: string;
  environmental_context: string;
  insights_gained: string[];
}

export interface WeeklyCheckin {
  week_number: number;
  pattern_frequency: number;
  awareness_level: number;
  self_compassion_rating: number;
  nervous_system_stability: number;
  life_impact_changes: string[];
  challenges_encountered: string[];
  support_used: string[];
  insights_gained: string[];
}

export interface ProtocolAdaptation {
  continue_current_phase: boolean;
  phase_modifications: string[];
  practice_adjustments: string[];
  support_recommendations: string[];
  celebration_moments: string[];
  gentle_encouragement: string;
}

interface ProgressAnalysis {
  on_track: boolean;
  achievements: string[];
  challenges: string[];
  insights: string[];
}

interface NervousSystemImpact {
  stable: boolean;
  improvements: string[];
  concerns: string[];
  adaptations_needed: string[];
}

interface ProtocolAdaptationDetails {
  phaseChanges: string[];
  practiceAdjustments: string[];
  supportRecommendations: string[];
}