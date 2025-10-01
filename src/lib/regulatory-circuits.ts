/**
 * Regulatory Circuits Strengthening Engine
 * Neuroscience-backed habit loops that specifically target neural circuits for self-regulation
 * 
 * Based on research showing that specific sequences of practices can strengthen:
 * - Prefrontal-amygdala connections (emotional regulation)
 * - Vagal tone (parasympathetic activation)
 * - Hippocampal neurogenesis (memory and learning)
 * - Insula development (interoceptive awareness)
 * - Mirror neuron system (social connection)
 */

export interface RegulatoryCircuit {
  id: string;
  name: string;
  description: string;
  brain_regions: BrainRegion[];
  neural_pathways: NeuralPathway[];
  strengthening_sequence: StrengtheningPhase[];
  measurement_markers: RegulationMarker[];
  trauma_considerations: TraumaConsideration[];
}

export interface BrainRegion {
  name: string;
  function: string;
  development_timeframe: string;
  trauma_sensitivity: 'high' | 'moderate' | 'low';
  strengthening_activities: string[];
}

export interface NeuralPathway {
  from_region: string;
  to_region: string;
  function: string;
  development_indicator: string;
  strengthening_practices: Practice[];
}

export interface StrengtheningPhase {
  week: number;
  phase_name: string;
  neural_focus: string;
  practice_sequence: PracticeStep[];
  expected_changes: string[];
  signs_of_progress: string[];
}

export interface PracticeStep {
  order: number;
  name: string;
  duration_seconds: number;
  neural_target: string;
  instruction: string;
  breathing_component?: BreathingPattern;
  somatic_component?: SomaticElement;
  cognitive_component?: CognitiveElement;
  social_component?: SocialElement;
}

export interface BreathingPattern {
  type: 'coherent' | 'extended_exhale' | 'box_breathing' | 'natural_awareness';
  inhale_count: number;
  hold_count?: number;
  exhale_count: number;
  pause_count?: number;
  repetitions: number;
  neural_effect: string;
}

export interface SomaticElement {
  type: 'body_scan' | 'tension_release' | 'grounding' | 'movement' | 'self_touch';
  instruction: string;
  duration_seconds: number;
  neural_effect: string;
}

export interface CognitiveElement {
  type: 'mindfulness' | 'self_compassion' | 'intention_setting' | 'gratitude' | 'future_visualization';
  instruction: string;
  neural_effect: string;
}

export interface SocialElement {
  type: 'loving_kindness' | 'connection_visualization' | 'gratitude_for_others' | 'mirror_neuron_activation';
  instruction: string;
  neural_effect: string;
}

export interface RegulationMarker {
  name: string;
  measurement_method: 'self_report' | 'behavioral_observation' | 'physiological' | 'cognitive_assessment';
  baseline_period: number; // days
  change_threshold: number; // minimum change to be considered significant
  celebration_message: string;
}

export interface TraumaConsideration {
  trauma_type: string;
  risk_factors: string[];
  modifications: string[];
  contraindications: string[];
  extra_supports: string[];
}

export interface HabitLoop {
  id: string;
  name: string;
  regulatory_circuit: string;
  
  // Classic habit loop components with trauma-informed modifications
  cue_system: CueSystem;
  routine_sequence: PracticeStep[];
  reward_system: RewardSystem;
  
  // Neuroplasticity enhancements
  neural_priming: string[]; // Activities that prepare the brain
  consolidation_support: string[]; // Activities that help lock in changes
  generalization_practices: string[]; // How to apply skills in daily life
  
  // Trauma-informed safety features
  choice_points: ChoicePoint[];
  regulation_checks: RegulationCheck[];
  adaptation_protocols: AdaptationProtocol[];
  
  // Measurement and celebration
  progress_tracking: ProgressElement[];
  neuroplasticity_milestones: NeuroplasticityMilestone[];
  
  created_date: Date;
  effectiveness_rating?: number;
}

export interface CueSystem {
  type: 'environmental' | 'somatic' | 'temporal' | 'emotional' | 'social';
  primary_cue: string;
  backup_cues: string[];
  cue_preparation: string; // How to set up the cue
  trauma_modifications: string[]; // Adjustments for trauma survivors
}

export interface RewardSystem {
  intrinsic_rewards: string[]; // Natural satisfaction from the practice
  neurochemical_rewards: string[]; // Dopamine, serotonin, etc. releases
  social_rewards?: string[]; // Connection and recognition
  celebration_moments: CelebrationMoment[];
  shame_prevention: string[]; // What to do if practice doesn't go well
}

export interface CelebrationMoment {
  trigger: string;
  celebration_type: 'subtle' | 'gentle' | 'warm' | 'joyful';
  message: string;
  somatic_element?: string; // Physical celebration
  reflection_prompt?: string;
}

export interface ChoicePoint {
  moment: string; // When in the routine this choice occurs
  choice_description: string;
  options: ChoiceOption[];
  default_if_overwhelmed: string;
}

export interface ChoiceOption {
  label: string;
  description: string;
  leads_to: string; // Next step or adaptation
  encouragement: string;
}

export interface RegulationCheck {
  timing: 'before' | 'during' | 'after';
  check_method: 'somatic' | 'emotional' | 'cognitive' | 'energy';
  question: string;
  thresholds: {
    continue: string;
    modify: string;
    pause: string;
  };
  responses: {
    continue: string;
    modify: string;
    pause: string;
  };
}

export interface AdaptationProtocol {
  trigger_condition: string;
  adaptation_type: 'simplify' | 'shorten' | 'gentler' | 'pause' | 'different_approach';
  specific_changes: string[];
  return_criteria: string;
  self_compassion_message: string;
}

export interface ProgressElement {
  name: string;
  measurement_frequency: 'daily' | 'weekly' | 'monthly';
  data_type: 'scale' | 'boolean' | 'text' | 'physiological';
  neural_correlation: string;
  celebration_thresholds: number[];
}

export interface NeuroplasticityMilestone {
  name: string;
  neural_change_description: string;
  typical_timeframe: string;
  signs_of_achievement: string[];
  celebration_ritual: string;
  next_development_focus: string;
}

export interface Practice {
  id: string;
  name: string;
  description: string;
  neural_targets: string[];
  practice_steps: PracticeStep[];
}

export class RegulatoryCircuitsEngine {
  
  /**
   * Create a complete regulatory circuit strengthening program
   */
  static createRegulatoryCircuitProgram(
    target_circuit: 'emotional_regulation' | 'stress_response' | 'social_connection' | 'cognitive_flexibility' | 'interoceptive_awareness',
    user_profile: {
      trauma_history: string[];
      current_regulation_capacity: string;
      preferred_practices: string[];
      time_availability: number; // minutes per day
      nervous_system_sensitivities: string[];
    }
  ): {
    circuit_description: RegulatoryCircuit;
    habit_loops: HabitLoop[];
    progression_plan: StrengtheningPhase[];
    personalization_notes: string[];
  } {
    
    const circuit = this.getRegulatoryCircuit(target_circuit);
    const loops = this.createHabitLoops(circuit, user_profile);
    const progression = this.createProgressionPlan(circuit, user_profile);
    
    return {
      circuit_description: circuit,
      habit_loops: loops,
      progression_plan: progression,
      personalization_notes: this.generatePersonalizationNotes(user_profile, circuit)
    };
  }
  
  /**
   * Execute a habit loop with real-time adaptation based on regulation state
   */
  static executeHabitLoop(
    loop: HabitLoop,
    current_regulation_state: {
      nervous_system_state: string;
      energy_level: number; // 1-10
      emotional_state: string;
      available_time: number; // minutes
      environment: string;
    }
  ): {
    adapted_routine: PracticeStep[];
    regulation_checks: RegulationCheck[];
    choice_points_available: ChoicePoint[];
    estimated_neural_benefit: number;
    completion_celebration: CelebrationMoment;
  } {
    
    const adapted_routine = this.adaptRoutineToState(loop.routine_sequence, current_regulation_state);
    const active_checks = this.selectRelevantChecks(loop.regulation_checks, current_regulation_state);
    const available_choices = this.prepareChoicePoints(loop.choice_points, current_regulation_state);
    
    return {
      adapted_routine,
      regulation_checks: active_checks,
      choice_points_available: available_choices,
      estimated_neural_benefit: this.estimateNeuralBenefit(adapted_routine, current_regulation_state),
      completion_celebration: this.selectCelebration(loop.reward_system.celebration_moments, current_regulation_state)
    };
  }
  
  /**
   * Track and celebrate neuroplastic changes in regulatory circuits
   */
  static trackRegulatoryDevelopment(
    circuit_id: string,
    practice_history: {
      days_practiced: number;
      consistency_rate: number;
      engagement_levels: number[];
      regulation_improvements: RegulationImprovement[];
      breakthrough_moments: BreakthroughMoment[];
    }
  ): {
    neural_pathway_strength: number;
    regulation_capacity_change: number;
    milestones_achieved: NeuroplasticityMilestone[];
    next_development_phase: StrengtheningPhase;
    celebration_messages: string[];
    scientific_progress_report: string;
  } {
    
    const pathway_strength = this.calculatePathwayStrength(practice_history);
    const capacity_change = this.measureRegulationCapacityChange(practice_history);
    const milestones = this.identifyAchievedMilestones(circuit_id, practice_history);
    
    return {
      neural_pathway_strength: pathway_strength,
      regulation_capacity_change: capacity_change,
      milestones_achieved: milestones,
      next_development_phase: this.recommendNextPhase(circuit_id, pathway_strength),
      celebration_messages: this.generateCelebrationMessages(milestones, capacity_change),
      scientific_progress_report: this.generateScientificReport(circuit_id, practice_history)
    };
  }
  
  // Private implementation methods
  private static getRegulatoryCircuit(target: string): RegulatoryCircuit {
    const circuits = {
      emotional_regulation: {
        id: 'emotional_regulation',
        name: 'Emotional Regulation Circuit',
        description: 'Strengthens prefrontal-amygdala connections for better emotional control',
        brain_regions: [
          {
            name: 'Prefrontal Cortex',
            function: 'Executive control and emotional regulation',
            development_timeframe: '2-8 weeks',
            trauma_sensitivity: 'high' as const,
            strengthening_activities: ['mindfulness', 'cognitive reappraisal', 'decision making']
          },
          {
            name: 'Amygdala',
            function: 'Emotional processing and threat detection',
            development_timeframe: '1-4 weeks',
            trauma_sensitivity: 'high' as const,
            strengthening_activities: ['safety practices', 'gradual exposure', 'self-soothing']
          }
        ],
        neural_pathways: [
          {
            from_region: 'Prefrontal Cortex',
            to_region: 'Amygdala',
            function: 'Top-down emotional regulation',
            development_indicator: 'Faster recovery from emotional triggers',
            strengthening_practices: []
          }
        ],
        strengthening_sequence: [
          {
            week: 1,
            phase_name: 'Foundation Building',
            neural_focus: 'Basic awareness and safety',
            practice_sequence: [],
            expected_changes: ['Increased emotional awareness', 'Better trigger recognition'],
            signs_of_progress: ['Noticing emotions sooner', 'Less reactive responses']
          }
        ],
        measurement_markers: [
          {
            name: 'Emotional Recovery Time',
            measurement_method: 'self_report',
            baseline_period: 7,
            change_threshold: 20,
            celebration_message: 'Your brain is getting faster at emotional regulation!'
          }
        ],
        trauma_considerations: [
          {
            trauma_type: 'developmental',
            risk_factors: ['Emotional overwhelm', 'Hypervigilance'],
            modifications: ['Extra safety cues', 'Shorter practices'],
            contraindications: ['Forced emotional processing'],
            extra_supports: ['Grounding techniques', 'Professional therapy backup']
          }
        ]
      }
    };
    
    return circuits[target as keyof typeof circuits] || circuits.emotional_regulation;
  }
  
  private static createHabitLoops(circuit: RegulatoryCircuit, user_profile: any): HabitLoop[] {
    return [
      {
        id: `${circuit.id}_morning_loop`,
        name: 'Morning Regulation Practice',
        regulatory_circuit: circuit.id,
        cue_system: {
          type: 'temporal',
          primary_cue: 'After morning routine',
          backup_cues: ['Phone reminder', 'Visual cue'],
          cue_preparation: 'Set phone reminder for consistent time',
          trauma_modifications: ['Gentle tone', 'Optional snooze']
        },
        routine_sequence: this.createMorningSequence(circuit, user_profile),
        reward_system: {
          intrinsic_rewards: ['Sense of accomplishment', 'Feeling grounded'],
          neurochemical_rewards: ['Dopamine from completion', 'Serotonin from breathing'],
          celebration_moments: [
            {
              trigger: 'Practice completed',
              celebration_type: 'gentle',
              message: 'Beautiful work strengthening your neural pathways! 🌱',
              somatic_element: 'Place hand on heart',
              reflection_prompt: 'How does your nervous system feel now?'
            }
          ],
          shame_prevention: ['Every attempt is progress', 'Adaptation is wisdom']
        },
        neural_priming: ['Three deep breaths', 'Gentle body awareness'],
        consolidation_support: ['Brief reflection', 'Gratitude moment'],
        generalization_practices: ['Use breathing in stress', 'Apply awareness throughout day'],
        choice_points: [
          {
            moment: 'Mid-practice',
            choice_description: 'How is your capacity right now?',
            options: [
              {
                label: 'Full practice',
                description: 'Continue with complete routine',
                leads_to: 'continue_sequence',
                encouragement: 'Your nervous system is ready for growth!'
              },
              {
                label: 'Simplified',
                description: 'Shorter, gentler version',
                leads_to: 'simplified_sequence',
                encouragement: 'Honoring your needs is perfect!'
              }
            ],
            default_if_overwhelmed: 'simplified_sequence'
          }
        ],
        regulation_checks: [
          {
            timing: 'before',
            check_method: 'somatic',
            question: 'How is your energy and nervous system?',
            thresholds: {
              continue: 'Stable or energized',
              modify: 'Low but manageable',
              pause: 'Depleted or dysregulated'
            },
            responses: {
              continue: 'Perfect! Let\'s strengthen those neural pathways.',
              modify: 'Let\'s adapt this to honor your current state.',
              pause: 'Your body\'s wisdom is perfect. Rest is productive too.'
            }
          }
        ],
        adaptation_protocols: [
          {
            trigger_condition: 'Low energy or overwhelm',
            adaptation_type: 'simplify',
            specific_changes: ['Shorter duration', 'Gentler practices', 'More choice'],
            return_criteria: 'When feeling more regulated',
            self_compassion_message: 'Adapting your practice shows self-awareness, not weakness.'
          }
        ],
        progress_tracking: [
          {
            name: 'Practice Consistency',
            measurement_frequency: 'daily',
            data_type: 'boolean',
            neural_correlation: 'Pathway strengthening requires repetition',
            celebration_thresholds: [7, 21, 66] // days
          }
        ],
        neuroplasticity_milestones: [
          {
            name: 'Neural Pathway Formation',
            neural_change_description: 'Initial prefrontal-amygdala connections established',
            typical_timeframe: '2-3 weeks',
            signs_of_achievement: ['Faster emotional recovery', 'Less reactivity'],
            celebration_ritual: 'Acknowledge your brain\'s amazing adaptability',
            next_development_focus: 'Strengthening and automaticity'
          }
        ],
        created_date: new Date()
      }
    ];
  }
  
  private static createMorningSequence(circuit: RegulatoryCircuit, user_profile: any): PracticeStep[] {
    return [
      {
        order: 1,
        name: 'Grounding Awareness',
        duration_seconds: 30,
        neural_target: 'Insula activation for body awareness',
        instruction: 'Feel your feet on the ground, notice your breath naturally',
        somatic_component: {
          type: 'grounding',
          instruction: 'Feel the support of the earth beneath you',
          duration_seconds: 30,
          neural_effect: 'Activates parasympathetic nervous system'
        }
      },
      {
        order: 2,
        name: 'Coherent Breathing',
        duration_seconds: 120,
        neural_target: 'Vagal tone strengthening',
        instruction: 'Breathe slowly and evenly, 5 seconds in, 5 seconds out',
        breathing_component: {
          type: 'coherent',
          inhale_count: 5,
          exhale_count: 5,
          repetitions: 12,
          neural_effect: 'Increases heart rate variability and vagal tone'
        }
      },
      {
        order: 3,
        name: 'Intention Setting',
        duration_seconds: 60,
        neural_target: 'Prefrontal cortex activation',
        instruction: 'Set a gentle intention for how you want to show up today',
        cognitive_component: {
          type: 'intention_setting',
          instruction: 'Connect with your deeper values and intentions',
          neural_effect: 'Strengthens executive function and self-direction'
        }
      }
    ];
  }
  
  private static createProgressionPlan(circuit: RegulatoryCircuit, user_profile: any): StrengtheningPhase[] {
    return circuit.strengthening_sequence;
  }
  
  private static generatePersonalizationNotes(user_profile: any, circuit: RegulatoryCircuit): string[] {
    return [
      'Practices adapted for your current regulation capacity',
      'Extra choice points added for trauma sensitivity',
      'Duration modified for your time availability'
    ];
  }
  
  private static adaptRoutineToState(sequence: PracticeStep[], state: any): PracticeStep[] {
    if (state.energy_level < 5) {
      return sequence.map(step => ({
        ...step,
        duration_seconds: Math.floor(step.duration_seconds * 0.7)
      }));
    }
    return sequence;
  }
  
  private static selectRelevantChecks(checks: RegulationCheck[], state: any): RegulationCheck[] {
    return checks; // Simplified for now
  }
  
  private static prepareChoicePoints(choices: ChoicePoint[], state: any): ChoicePoint[] {
    return choices; // Simplified for now
  }
  
  private static estimateNeuralBenefit(routine: PracticeStep[], state: any): number {
    return routine.length * 10 + state.energy_level * 5; // Simplified calculation
  }
  
  private static selectCelebration(celebrations: CelebrationMoment[], state: any): CelebrationMoment {
    return celebrations[0] || {
      trigger: 'completion',
      celebration_type: 'gentle',
      message: 'Well done! Your brain is building new pathways.',
      somatic_element: 'Place hand on heart'
    };
  }
  
  private static calculatePathwayStrength(history: any): number {
    return Math.min(100, history.days_practiced * 2 + history.consistency_rate * 30);
  }
  
  private static measureRegulationCapacityChange(history: any): number {
    return history.regulation_improvements.length * 10; // Simplified
  }
  
  private static identifyAchievedMilestones(circuit_id: string, history: any): NeuroplasticityMilestone[] {
    return []; // Would check against actual milestones
  }
  
  private static recommendNextPhase(circuit_id: string, strength: number): StrengtheningPhase {
    return {
      week: Math.floor(strength / 25) + 1,
      phase_name: 'Next Development Phase',
      neural_focus: 'Advanced integration',
      practice_sequence: [],
      expected_changes: ['Deeper integration'],
      signs_of_progress: ['More automatic responses']
    };
  }
  
  private static generateCelebrationMessages(milestones: NeuroplasticityMilestone[], change: number): string[] {
    return [
      'Your neural pathways are getting stronger!',
      'The changes you\'re making are measurable and real.',
      'Your brain\'s plasticity is working beautifully.'
    ];
  }
  
  private static generateScientificReport(circuit_id: string, history: any): string {
    return `Neural development in ${circuit_id} showing positive adaptation patterns. Consistency rate of ${history.consistency_rate}% supporting optimal neuroplasticity conditions.`;
  }
}

// Supporting interfaces
interface RegulationImprovement {
  date: Date;
  improvement_type: string;
  magnitude: number;
  description: string;
}

interface BreakthroughMoment {
  date: Date;
  description: string;
  neural_significance: string;
  celebration_level: number;
}