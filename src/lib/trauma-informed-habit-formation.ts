/**
 * ALCHM Trauma-Informed Habit Formation System
 * 
 * Respects nervous system capacity, typeof window !== 'undefined' && window of tolerance, and polyvagal states
 * while building sustainable emotional habits. Based on trauma-informed care
 * principles and neuroplasticity research.
 * 
 * Key Principles:
 * - Safety first: Never push beyond nervous system capacity
 * - Titration: Start with micro-habits to avoid overwhelm
 * - Choice and agency: Users always have control
 * - Somatic awareness: Include body-based feedback
 * - Nervous system regulation before habit formation
 * 
 * Based on research from:
 * - Van der Kolk, B. "The Body Keeps the Score"
 * - Porges, S. - Polyvagal Theory
 * - Dana, D. - Trauma-informed nervous system work
 * - Siegel, D. - Window of tolerance
 * - Levine, P. - Somatic experiencing principles
 */

import { PolyvagalState } from './polyvagal-state-engine';
import { EmotionalSkill } from '../components/HabitStackBuilder';

// Trauma-informed habit safety assessment
export interface TraumaSafetyAssessment {
  current_nervous_system_state: PolyvagalState;
  typeof window !== 'undefined' && window_of_tolerance_position: number; // -100 to +100 (hypoarousal to hyperarousal)
  emotional_capacity_rating: number; // 0-100
  somatic_safety_indicators: SomaticIndicator[];
  cognitive_availability: number; // 0-100
  support_system_accessibility: number; // 0-100
  recent_triggers_present: boolean;
  sleep_quality_last_24h: 'poor' | 'fair' | 'good' | 'excellent';
  basic_needs_met: boolean;
  overall_safety_score: number; // 0-100
}

export interface SomaticIndicator {
  body_region: 'head' | 'throat' | 'chest' | 'stomach' | 'lower_abdomen' | 'whole_body';
  sensation_type: 'tension' | 'relaxation' | 'numbness' | 'energy' | 'vibration' | 'temperature' | 'other';
  intensity: number; // 0-100
  emotional_association?: string;
  safety_indicator: 'safe' | 'caution' | 'stop';
}

// Trauma-informed habit structure
export interface TraumaInformedHabit {
  habit_id: string;
  name: string;
  description: string;
  emotional_skill_target: EmotionalSkill;
  
  // Trauma-informed specifications
  minimum_nervous_system_requirements: {
    required_polyvagal_state: PolyvagalState['primary_state'][];
    minimum_typeof window !== 'undefined' && window_tolerance: number; // -100 to +100
    minimum_emotional_capacity: number; // 0-100
  };
  
  // Progressive difficulty levels
  micro_level: HabitLevel;
  foundational_level: HabitLevel;
  growth_level: HabitLevel;
  integration_level: HabitLevel;
  
  // Safety features
  nervous_system_preparation: string[];
  early_warning_signs: string[];
  emergency_exit_strategies: string[];
  co_regulation_opportunities: string[];
  
  // Adaptation protocols
  hyperarousal_modifications: HabitModification[];
  hypoarousal_modifications: HabitModification[];
  dissociation_safety_protocols: string[];
  
  // Progress tracking (trauma-informed)
  success_metrics: TraumaInformedSuccessMetric[];
  neural_pathway_markers: NeuralPathwayMarker[];
}

export interface HabitLevel {
  level_name: string;
  duration_seconds: number;
  cognitive_load: number; // 0-100
  somatic_engagement: number; // 0-100
  emotional_intensity: number; // 0-100
  instructions: string[];
  success_criteria: string[];
  graduation_requirements: string[];
}

export interface HabitModification {
  trigger_condition: string;
  modification_type: 'reduce_duration' | 'reduce_intensity' | 'add_support' | 'pause_habit' | 'redirect_attention';
  specific_changes: string[];
  rationale: string;
}

export interface TraumaInformedSuccessMetric {
  metric_name: string;
  measurement_type: 'completion' | 'nervous_system_state' | 'somatic_awareness' | 'emotional_regulation' | 'self_compassion';
  success_definition: string;
  avoiding_shame_triggers: string[];
}

export interface NeuralPathwayMarker {
  pathway_name: string;
  brain_region_target: string;
  strengthening_indicators: string[];
  integration_signs: string[];
  consolidation_supports: string[];
}

// Habit formation protocol with trauma considerations
export interface TraumaInformedProtocol {
  phase: 'safety_establishment' | 'stabilization' | 'micro_habit_introduction' | 'gradual_expansion' | 'integration';
  duration_days: number;
  daily_activities: ProtocolActivity[];
  nervous_system_supports: string[];
  progress_checkpoints: ProgressCheckpoint[];
  adaptation_triggers: AdaptationTrigger[];
}

export interface ProtocolActivity {
  activity_name: string;
  timing: 'morning' | 'midday' | 'evening' | 'as_needed';
  duration_minutes: number;
  prerequisites: string[];
  instructions: string[];
  success_indicators: string[];
  modification_options: string[];
}

export interface ProgressCheckpoint {
  checkpoint_name: string;
  assessment_questions: string[];
  somatic_check_indicators: string[];
  safety_verification: string[];
  next_phase_readiness_criteria: string[];
}

export interface AdaptationTrigger {
  trigger_description: string;
  recognition_signs: string[];
  immediate_response: string[];
  long_term_adjustments: string[];
}

export class TraumaInformedHabitFormationEngine {
  
  /**
   * Assesses current capacity for habit formation with trauma-informed lens
   */
  static assessCapacityForHabitFormation(
    nervousSystemState: PolyvagalState,
    recentTriggers: string[] = [],
    basicNeedsMet: boolean = true
  ): TraumaSafetyAssessment {
    
    const somaticIndicators = this.assessSomaticSafety(nervousSystemState);
    const typeof window !== 'undefined' && windowPosition = this.calculateWindowOfTolerancePosition(nervousSystemState);
    const emotionalCapacity = this.assessEmotionalCapacity(nervousSystemState, recentTriggers);
    const cognitiveAvailability = this.assessCognitiveAvailability(nervousSystemState);
    
    // Calculate overall safety score
    const safetyFactors = [
      nervousSystemState.regulation_quality * 0.3,
      (100 + typeof window !== 'undefined' && windowPosition) / 2 * 0.2, // Convert to 0-100 scale
      emotionalCapacity * 0.2,
      cognitiveAvailability * 0.15,
      basicNeedsMet ? 100 : 0 * 0.1,
      recentTriggers.length === 0 ? 100 : Math.max(0, 100 - (recentTriggers.length * 20)) * 0.05
    ];
    
    const overallSafety = safetyFactors.reduce((sum, factor) => sum + factor, 0);
    
    return {
      current_nervous_system_state: nervousSystemState,
      typeof window !== 'undefined' && window_of_tolerance_position: typeof window !== 'undefined' && windowPosition,
      emotional_capacity_rating: emotionalCapacity,
      somatic_safety_indicators: somaticIndicators,
      cognitive_availability: cognitiveAvailability,
      support_system_accessibility: 75, // Would be assessed from user data
      recent_triggers_present: recentTriggers.length > 0,
      sleep_quality_last_24h: 'fair', // Would be assessed from user data
      basic_needs_met: basicNeedsMet,
      overall_safety_score: Math.round(overallSafety)
    };
  }

  /**
   * Creates a personalized trauma-informed habit based on current capacity
   */
  static createTraumaInformedHabit(
    emotionalSkill: EmotionalSkill,
    safetyAssessment: TraumaSafetyAssessment,
    userPreferences: { intensity: 'gentle' | 'moderate' | 'intensive' } = { intensity: 'gentle' }
  ): TraumaInformedHabit {
    
    const habitLevels = this.generateProgressiveLevels(emotionalSkill, safetyAssessment);
    const safetyFeatures = this.createSafetyFeatures(emotionalSkill, safetyAssessment);
    const adaptations = this.createNervousSystemAdaptations(emotionalSkill);
    
    return {
      habit_id: `trauma_informed_${emotionalSkill.skill_name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      name: `Gentle ${emotionalSkill.skill_name} Practice`,
      description: `A trauma-informed approach to building ${emotionalSkill.skill_name.toLowerCase()} that respects your nervous system's capacity and promotes genuine healing.`,
      emotional_skill_target: emotionalSkill,
      
      minimum_nervous_system_requirements: {
        required_polyvagal_state: ['ventral_vagal', 'mobilized_ventral_vagal'],
        minimum_typeof window !== 'undefined' && window_tolerance: -20, // Very gentle requirement
        minimum_emotional_capacity: 30
      },
      
      micro_level: habitLevels.micro,
      foundational_level: habitLevels.foundational,
      growth_level: habitLevels.growth,
      integration_level: habitLevels.integration,
      
      nervous_system_preparation: safetyFeatures.preparation,
      early_warning_signs: safetyFeatures.warningSign,
      emergency_exit_strategies: safetyFeatures.exitStrategies,
      co_regulation_opportunities: safetyFeatures.coRegulation,
      
      hyperarousal_modifications: adaptations.hyperarousal,
      hypoarousal_modifications: adaptations.hypoarousal,
      dissociation_safety_protocols: adaptations.dissociation,
      
      success_metrics: this.createTraumaInformedMetrics(emotionalSkill),
      neural_pathway_markers: this.createNeuralPathwayMarkers(emotionalSkill)
    };
  }

  /**
   * Generates a trauma-informed protocol for habit formation
   */
  static createHabitFormationProtocol(
    habit: TraumaInformedHabit,
    safetyAssessment: TraumaSafetyAssessment
  ): TraumaInformedProtocol[] {
    
    const protocols: TraumaInformedProtocol[] = [];
    
    // Phase 1: Safety Establishment
    protocols.push({
      phase: 'safety_establishment',
      duration_days: 7,
      daily_activities: [
        {
          activity_name: 'Morning Nervous System Check-in',
          timing: 'morning',
          duration_minutes: 3,
          prerequisites: ['Comfortable, private space', 'No immediate stressors'],
          instructions: [
            'Take three slow, conscious breaths',
            'Notice your internal state without judgment',
            'Ask: "How is my nervous system feeling right now?"',
            'Honor whatever you discover',
            'Set a gentle intention for the day'
          ],
          success_indicators: ['Feeling present', 'Aware of internal state', 'No pressure or rush'],
          modification_options: ['Reduce to 1 minute if overwhelmed', 'Use grounding techniques if dissociated']
        }
      ],
      nervous_system_supports: [
        'Regular meals and hydration',
        'Gentle movement or stretching',
        'Connection with supportive people',
        'Adequate sleep prioritization'
      ],
      progress_checkpoints: [
        {
          checkpoint_name: 'Week 1 Safety Review',
          assessment_questions: [
            'Do you feel safe in your body most of the time?',
            'Are you able to notice your internal state without judgment?',
            'Do you have access to support when needed?'
          ],
          somatic_check_indicators: ['Relaxed breathing', 'Soft jaw and shoulders', 'Grounded feeling'],
          safety_verification: ['No increase in trauma symptoms', 'Sleep remains stable', 'Basic functioning maintained'],
          next_phase_readiness_criteria: ['Consistent daily check-ins', 'Stable nervous system baseline', 'Sense of safety and choice']
        }
      ],
      adaptation_triggers: [
        {
          trigger_description: 'Increased anxiety or hypervigilance',
          recognition_signs: ['Racing heart', 'Scanning environment', 'Difficulty concentrating'],
          immediate_response: ['Stop current activity', 'Focus on grounding', 'Seek co-regulation'],
          long_term_adjustments: ['Reduce activity intensity', 'Increase support', 'Consider professional help']
        }
      ]
    });

    // Phase 2: Stabilization
    protocols.push({
      phase: 'stabilization',
      duration_days: 14,
      daily_activities: [
        {
          activity_name: 'Micro Emotional Skill Practice',
          timing: 'midday',
          duration_minutes: 2,
          prerequisites: ['Feeling regulated', 'In typeof window !== 'undefined' && window of tolerance', 'No recent triggers'],
          instructions: [
            'Check nervous system state first',
            'If feeling safe and regulated, proceed',
            'Practice the smallest version of the emotional skill',
            'Focus on process, not outcome',
            'End with self-appreciation'
          ],
          success_indicators: ['Remained regulated throughout', 'Felt curious rather than pressured', 'Sense of gentle accomplishment'],
          modification_options: ['Skip if not feeling regulated', 'Use visualization instead of action', 'Practice with support person']
        }
      ],
      nervous_system_supports: [
        'Continued basic needs attention',
        'Regular co-regulation opportunities',
        'Somatic awareness practices',
        'Boundaries with stressful situations'
      ],
      progress_checkpoints: [
        {
          checkpoint_name: '2-Week Stabilization Check',
          assessment_questions: [
            'Are you able to practice micro-habits without feeling overwhelmed?',
            'Do you notice early warning signs of dysregulation?',
            'Can you modify or stop activities when needed?'
          ],
          somatic_check_indicators: ['Stable energy levels', 'Comfortable in body', 'Good sleep patterns'],
          safety_verification: ['No worsening of trauma symptoms', 'Maintained social connections', 'Effective coping strategies'],
          next_phase_readiness_criteria: ['Consistent micro-practices', 'Good nervous system awareness', 'Flexible and self-compassionate']
        }
      ],
      adaptation_triggers: [
        {
          trigger_description: 'Emotional overwhelm during practice',
          recognition_signs: ['Sudden emotional intensity', 'Feeling out of control', 'Physical activation'],
          immediate_response: ['Stop practice immediately', 'Use emergency grounding', 'Seek comfort and support'],
          long_term_adjustments: ['Reduce practice frequency', 'Add more preparation time', 'Consider trauma therapy']
        }
      ]
    });

    // Additional phases would be added based on progress...

    return protocols;
  }

  /**
   * Monitors habit practice for trauma responses and adjusts accordingly
   */
  static monitorAndAdaptHabitPractice(
    habit: TraumaInformedHabit,
    currentSession: HabitPracticeSession,
    nervousSystemFeedback: PolyvagalState
  ): HabitAdaptationRecommendation {
    
    const traumaWarningsSigns = this.detectTraumaWarningSigns(nervousSystemFeedback, currentSession);
    const adaptations = this.generateRealTimeAdaptations(habit, traumaWarningsSigns);
    
    return {
      continue_practice: traumaWarningsSigns.length === 0,
      immediate_actions: adaptations.immediate,
      session_modifications: adaptations.modifications,
      future_adjustments: adaptations.futureChanges,
      safety_priority_message: traumaWarningsSigns.length > 0 
        ? "Your safety and nervous system regulation are the priority. It's perfectly okay to pause or modify this practice."
        : "You're doing great! Your nervous system is indicating it's safe to continue."
    };
  }

  // Private helper methods

  private static assessSomaticSafety(nervousSystemState: PolyvagalState): SomaticIndicator[] {
    // In a real implementation, this would integrate with somatic tracking
    return [
      {
        body_region: 'chest',
        sensation_type: 'energy',
        intensity: nervousSystemState.embodiment_level,
        safety_indicator: nervousSystemState.embodiment_level > 60 ? 'safe' : 'caution'
      },
      {
        body_region: 'stomach',
        sensation_type: nervousSystemState.arousal_level > 70 ? 'tension' : 'relaxation',
        intensity: Math.abs(nervousSystemState.arousal_level - 50),
        safety_indicator: nervousSystemState.arousal_level > 80 ? 'stop' : 'safe'
      }
    ];
  }

  private static calculateWindowOfTolerancePosition(nervousSystemState: PolyvagalState): number {
    // Convert arousal level to typeof window !== 'undefined' && window of tolerance position
    // 0-30 = hypoarousal (negative values)
    // 30-70 = typeof window !== 'undefined' && window of tolerance (0)  
    // 70-100 = hyperarousal (positive values)
    
    if (nervousSystemState.arousal_level < 30) {
      return -((30 - nervousSystemState.arousal_level) / 30 * 100);
    } else if (nervousSystemState.arousal_level > 70) {
      return ((nervousSystemState.arousal_level - 70) / 30 * 100);
    } else {
      return 0; // In typeof window !== 'undefined' && window of tolerance
    }
  }

  private static assessEmotionalCapacity(
    nervousSystemState: PolyvagalState, 
    recentTriggers: string[]
  ): number {
    let capacity = nervousSystemState.regulation_quality;
    
    // Reduce capacity based on recent triggers
    capacity -= recentTriggers.length * 15;
    
    // Adjust for nervous system state
    if (nervousSystemState.primary_state === 'dorsal_vagal') capacity *= 0.3;
    if (nervousSystemState.primary_state === 'sympathetic') capacity *= 0.6;
    
    return Math.max(0, Math.min(100, capacity));
  }

  private static assessCognitiveAvailability(nervousSystemState: PolyvagalState): number {
    // Cognitive availability decreases with dysregulation
    const baseAvailability = 100;
    const dysregulationPenalty = (100 - nervousSystemState.regulation_quality) * 0.8;
    const arousalPenalty = Math.abs(nervousSystemState.arousal_level - 50) * 0.5;
    
    return Math.max(0, baseAvailability - dysregulationPenalty - arousalPenalty);
  }

  private static generateProgressiveLevels(
    emotionalSkill: EmotionalSkill,
    safetyAssessment: TraumaSafetyAssessment
  ) {
    return {
      micro: {
        level_name: 'Micro Practice',
        duration_seconds: 30,
        cognitive_load: 10,
        somatic_engagement: 20,
        emotional_intensity: 5,
        instructions: [
          'Take one conscious breath',
          `Gently notice any ${emotionalSkill.skill_name.toLowerCase()} present`,
          'No need to change anything, just notice',
          'Thank yourself for this moment of awareness'
        ],
        success_criteria: ['Completed without overwhelm', 'Maintained present moment awareness'],
        graduation_requirements: ['7 consecutive days of comfortable micro-practice', 'Stable nervous system response']
      },
      foundational: {
        level_name: 'Foundation Building',
        duration_seconds: 120,
        cognitive_load: 25,
        somatic_engagement: 40,
        emotional_intensity: 15,
        instructions: [
          'Begin with nervous system check-in',
          `Practice ${emotionalSkill.skill_name.toLowerCase()} for 2 minutes`,
          'Notice both thoughts and body sensations',
          'End with self-compassion phrase'
        ],
        success_criteria: ['Maintained regulation throughout', 'Increased skill familiarity'],
        graduation_requirements: ['14 days of consistent practice', 'Growing confidence and ease']
      },
      growth: {
        level_name: 'Active Growth',
        duration_seconds: 300,
        cognitive_load: 50,
        somatic_engagement: 60,
        emotional_intensity: 35,
        instructions: [
          'Extended practice session with variation',
          'Integrate skill with challenging emotions',
          'Practice self-regulation during difficulty',
          'Celebrate growth and learning'
        ],
        success_criteria: ['Effective skill use under mild stress', 'Self-regulation during practice'],
        graduation_requirements: ['21 days of growth-level practice', 'Skill transfer to daily situations']
      },
      integration: {
        level_name: 'Life Integration',
        duration_seconds: 600,
        cognitive_load: 70,
        somatic_engagement: 80,
        emotional_intensity: 50,
        instructions: [
          'Full integration with daily life',
          'Use skill spontaneously when needed',
          'Support others in learning the skill',
          'Continuous refinement and mastery'
        ],
        success_criteria: ['Natural, automatic skill use', 'Helping others develop the skill'],
        graduation_requirements: ['30 days of integration', 'Consistent skill mastery']
      }
    };
  }

  private static createSafetyFeatures(
    emotionalSkill: EmotionalSkill,
    safetyAssessment: TraumaSafetyAssessment
  ) {
    return {
      preparation: [
        'Check that you feel safe and grounded',
        'Ensure you have privacy and won\'t be interrupted',
        'Have a support person available if needed',
        'Remind yourself you can stop at any time'
      ],
      warningSign: [
        'Sudden increase in heart rate or breathing',
        'Feeling disconnected from your body',
        'Overwhelming emotions or numbness',
        'Urge to flee or freeze'
      ],
      exitStrategies: [
        'Stop the practice immediately',
        'Focus on your feet on the ground',
        'Look around and name 5 things you can see',
        'Call a trusted support person',
        'Use your personalized grounding technique'
      ],
      coRegulation: [
        'Practice with a trusted friend or therapist',
        'Share your experience afterward',
        'Seek comfort and validation when needed',
        'Remember that healing happens in relationship'
      ]
    };
  }

  private static createNervousSystemAdaptations(emotionalSkill: EmotionalSkill) {
    return {
      hyperarousal: [
        {
          trigger_condition: 'Heart rate increases significantly',
          modification_type: 'reduce_intensity' as const,
          specific_changes: ['Reduce practice duration by 50%', 'Focus on grounding first'],
          rationale: 'High arousal reduces learning capacity and may retraumatize'
        }
      ],
      hypoarousal: [
        {
          trigger_condition: 'Feeling disconnected or numb',
          modification_type: 'add_support' as const,
          specific_changes: ['Add gentle movement', 'Practice with support person'],
          rationale: 'Hypoarousal requires activation and connection'
        }
      ],
      dissociation: [
        'If you feel "not in your body," stop the practice immediately',
        'Focus on physical sensations: feet on floor, back against chair',
        'Use grounding techniques until you feel present',
        'Consider practicing with a trained support person'
      ]
    };
  }

  private static createTraumaInformedMetrics(emotionalSkill: EmotionalSkill): TraumaInformedSuccessMetric[] {
    return [
      {
        metric_name: 'Nervous System Stability',
        measurement_type: 'nervous_system_state',
        success_definition: 'Maintaining regulation during and after practice',
        avoiding_shame_triggers: ['Not measuring "perfect" performance', 'Celebrating any level of engagement']
      },
      {
        metric_name: 'Somatic Awareness Growth',
        measurement_type: 'somatic_awareness',
        success_definition: 'Increased ability to notice body sensations and emotions',
        avoiding_shame_triggers: ['No judgment of "right" or "wrong" sensations']
      },
      {
        metric_name: 'Self-Compassion Practice',
        measurement_type: 'self_compassion',
        success_definition: 'Speaking kindly to yourself during challenges',
        avoiding_shame_triggers: ['Not comparing to others', 'Honoring your unique pace']
      }
    ];
  }

  private static createNeuralPathwayMarkers(emotionalSkill: EmotionalSkill): NeuralPathwayMarker[] {
    return [
      {
        pathway_name: 'Prefrontal-Amygdala Regulation Circuit',
        brain_region_target: 'Prefrontal Cortex to Amygdala',
        strengthening_indicators: ['Faster emotional recovery', 'Less reactive to triggers'],
        integration_signs: ['Natural emotional regulation', 'Increased typeof window !== 'undefined' && window of tolerance'],
        consolidation_supports: ['Sleep quality', 'Regular practice', 'Safe relationships']
      }
    ];
  }

  private static detectTraumaWarningSigns(
    nervousSystemState: PolyvagalState,
    session: HabitPracticeSession
  ): string[] {
    const warnings: string[] = [];
    
    if (nervousSystemState.arousal_level > 80) {
      warnings.push('High nervous system arousal detected');
    }
    
    if (nervousSystemState.regulation_quality < 30) {
      warnings.push('Low regulation capacity');
    }
    
    if (session.reported_difficulty > 8) {
      warnings.push('High subjective difficulty reported');
    }
    
    return warnings;
  }

  private static generateRealTimeAdaptations(
    habit: TraumaInformedHabit,
    warnings: string[]
  ): {
    immediate: string[];
    modifications: string[];
    futureChanges: string[];
  } {
    return {
      immediate: warnings.length > 0 
        ? ['Pause current practice', 'Focus on grounding and safety', 'No pressure to continue']
        : ['Continue at current pace', 'Maintain awareness of internal state'],
      modifications: warnings.length > 0
        ? ['Reduce duration to micro-level', 'Add more nervous system preparation']
        : [],
      futureChanges: warnings.length > 0
        ? ['Consider trauma therapy support', 'Slow down progression timeline']
        : []
    };
  }
}

// Supporting interfaces
export interface HabitPracticeSession {
  session_id: string;
  start_time: Date;
  duration_minutes: number;
  habit_level_attempted: 'micro' | 'foundational' | 'growth' | 'integration';
  completion_status: 'completed' | 'modified' | 'stopped_early';
  nervous_system_before: PolyvagalState;
  nervous_system_after: PolyvagalState;
  reported_difficulty: number; // 1-10
  somatic_experience: string;
  emotional_experience: string;
  insights_gained: string[];
  support_used: string[];
}

export interface HabitAdaptationRecommendation {
  continue_practice: boolean;
  immediate_actions: string[];
  session_modifications: string[];
  future_adjustments: string[];
  safety_priority_message: string;
}