/**
 * ALCHM Circadian Emotional Learning Engine
 * 
 * Optimizes emotional learning and habit formation based on chronobiology research.
 * Integrates circadian rhythms, cortisol patterns, and neuroplasticity typeof window !== 'undefined' && windows
 * to maximize learning effectiveness and minimize system overwhelm.
 * 
 * Based on research from:
 * - Huberman Lab: Circadian Rhythms and Learning
 * - Walker, M. "Why We Sleep" - Memory consolidation timing
 * - McGaugh, J. - Memory consolidation and stress hormones
 * - Roenneberg, T. - Chronotype research
 */

import { PolyvagalState } from './polyvagal-state-engine';
import { EmotionalSkill } from '../components/HabitStackBuilder';

// Chronotype classification based on research
export type Chronotype = 'extreme_lark' | 'moderate_lark' | 'neither' | 'moderate_owl' | 'extreme_owl';

// Circadian phases throughout the day
export interface CircadianPhase {
  name: string;
  start_hour: number; // 24-hour format
  end_hour: number;
  cortisol_level: 'low' | 'rising' | 'peak' | 'declining';
  melatonin_level: 'low' | 'rising' | 'peak' | 'declining';
  core_body_temperature: 'lowest' | 'rising' | 'peak' | 'declining';
  learning_capacity: number; // 0-100
  emotional_regulation_capacity: number; // 0-100
  neuroplasticity_typeof window !== 'undefined' && window: 'closed' | 'opening' | 'peak' | 'consolidation';
  recommended_activities: string[];
  trauma_sensitivity_risk: 'low' | 'moderate' | 'high';
}

// Individual's circadian profile
export interface CircadianProfile {
  chronotype: Chronotype;
  sleep_onset_time: string; // HH:MM format
  wake_time: string; // HH:MM format
  light_exposure_preference: 'early' | 'late' | 'flexible';
  exercise_timing_preference: 'morning' | 'afternoon' | 'evening';
  cognitive_peak_times: string[]; // Array of HH:MM times
  emotional_vulnerability_times: string[]; // Times when dysregulation is more likely
  last_assessment_date: Date;
}

// Learning optimization recommendations
export interface CircadianLearningRecommendation {
  optimal_learning_typeof window !== 'undefined' && windows: TimeWindow[];
  habit_formation_timing: TimeWindow[];
  emotional_processing_typeof window !== 'undefined' && windows: TimeWindow[];
  consolidation_support_activities: ConsolidationActivity[];
  trauma_informed_adaptations: TraumaAdaptation[];
  personalized_schedule: PersonalizedSchedule;
}

export interface TimeWindow {
  name: string;
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  effectiveness_score: number; // 0-100
  rationale: string;
  nervous_system_state_requirement: PolyvagalState['primary_state'];
}

export interface ConsolidationActivity {
  name: string;
  description: string;
  timing: 'pre_sleep' | 'during_sleep' | 'upon_waking' | 'post_learning';
  duration_minutes: number;
  instructions: string[];
  neuroscience_rationale: string;
}

export interface TraumaAdaptation {
  adaptation_type: 'timing' | 'intensity' | 'duration' | 'support';
  description: string;
  implementation: string;
  warning_signs: string[];
}

export interface PersonalizedSchedule {
  morning_routine: ScheduledActivity[];
  afternoon_activities: ScheduledActivity[];
  evening_routine: ScheduledActivity[];
  bedtime_protocol: ScheduledActivity[];
}

export interface ScheduledActivity {
  time: string; // HH:MM
  activity_type: 'emotional_skill' | 'habit_practice' | 'consolidation' | 'regulation' | 'rest';
  activity_name: string;
  duration_minutes: number;
  intensity_level: 'micro' | 'light' | 'moderate' | 'intensive';
  nervous_system_preparation: string[];
  success_indicators: string[];
}

export class CircadianEmotionalLearningEngine {
  private static readonly CIRCADIAN_PHASES: Record<string, CircadianPhase> = {
    'early_morning': {
      name: 'Early Morning (5-7 AM)',
      start_hour: 5,
      end_hour: 7,
      cortisol_level: 'rising',
      melatonin_level: 'declining',
      core_body_temperature: 'lowest',
      learning_capacity: 60,
      emotional_regulation_capacity: 70,
      neuroplasticity_typeof window !== 'undefined' && window: 'opening',
      recommended_activities: [
        'gentle_emotional_awareness',
        'gratitude_practice',
        'breath_regulation',
        'micro_habit_reinforcement'
      ],
      trauma_sensitivity_risk: 'moderate'
    },
    'morning': {
      name: 'Morning (7-10 AM)',
      start_hour: 7,
      end_hour: 10,
      cortisol_level: 'peak',
      melatonin_level: 'low',
      core_body_temperature: 'rising',
      learning_capacity: 85,
      emotional_regulation_capacity: 80,
      neuroplasticity_typeof window !== 'undefined' && window: 'peak',
      recommended_activities: [
        'new_emotional_skill_learning',
        'challenging_habit_formation',
        'cognitive_emotional_processing',
        'complex_pattern_recognition'
      ],
      trauma_sensitivity_risk: 'low'
    },
    'late_morning': {
      name: 'Late Morning (10 AM-12 PM)',
      start_hour: 10,
      end_hour: 12,
      cortisol_level: 'declining',
      melatonin_level: 'low',
      core_body_temperature: 'rising',
      learning_capacity: 90,
      emotional_regulation_capacity: 85,
      neuroplasticity_typeof window !== 'undefined' && window: 'peak',
      recommended_activities: [
        'intensive_emotional_skill_practice',
        'habit_stack_construction',
        'emotional_pattern_analysis',
        'reflective_journaling'
      ],
      trauma_sensitivity_risk: 'low'
    },
    'early_afternoon': {
      name: 'Early Afternoon (12-2 PM)',
      start_hour: 12,
      end_hour: 14,
      cortisol_level: 'declining',
      melatonin_level: 'low',
      core_body_temperature: 'peak',
      learning_capacity: 75,
      emotional_regulation_capacity: 70,
      neuroplasticity_typeof window !== 'undefined' && window: 'consolidation',
      recommended_activities: [
        'habit_reinforcement',
        'emotional_skill_review',
        'gentle_processing',
        'social_emotional_practice'
      ],
      trauma_sensitivity_risk: 'moderate'
    },
    'afternoon_dip': {
      name: 'Afternoon Dip (2-4 PM)',
      start_hour: 14,
      end_hour: 16,
      cortisol_level: 'low',
      melatonin_level: 'low',
      core_body_temperature: 'peak',
      learning_capacity: 50,
      emotional_regulation_capacity: 55,
      neuroplasticity_typeof window !== 'undefined' && window: 'closed',
      recommended_activities: [
        'rest_and_recovery',
        'gentle_movement',
        'passive_emotional_awareness',
        'consolidation_support'
      ],
      trauma_sensitivity_risk: 'high'
    },
    'late_afternoon': {
      name: 'Late Afternoon (4-6 PM)',
      start_hour: 16,
      end_hour: 18,
      cortisol_level: 'low',
      melatonin_level: 'low',
      core_body_temperature: 'declining',
      learning_capacity: 70,
      emotional_regulation_capacity: 75,
      neuroplasticity_typeof window !== 'undefined' && window: 'opening',
      recommended_activities: [
        'emotional_skill_practice',
        'habit_maintenance',
        'social_emotional_learning',
        'creative_expression'
      ],
      trauma_sensitivity_risk: 'moderate'
    },
    'early_evening': {
      name: 'Early Evening (6-8 PM)',
      start_hour: 18,
      end_hour: 20,
      cortisol_level: 'low',
      melatonin_level: 'rising',
      core_body_temperature: 'declining',
      learning_capacity: 65,
      emotional_regulation_capacity: 80,
      neuroplasticity_typeof window !== 'undefined' && window: 'consolidation',
      recommended_activities: [
        'reflective_practices',
        'emotional_processing',
        'habit_completion_celebration',
        'preparation_for_consolidation'
      ],
      trauma_sensitivity_risk: 'moderate'
    },
    'night': {
      name: 'Night (8-10 PM)',
      start_hour: 20,
      end_hour: 22,
      cortisol_level: 'low',
      melatonin_level: 'rising',
      core_body_temperature: 'declining',
      learning_capacity: 40,
      emotional_regulation_capacity: 85,
      neuroplasticity_typeof window !== 'undefined' && window: 'consolidation',
      recommended_activities: [
        'gentle_emotional_review',
        'consolidation_preparation',
        'gratitude_reflection',
        'nervous_system_calming'
      ],
      trauma_sensitivity_risk: 'low'
    }
  };

  private static readonly CONSOLIDATION_ACTIVITIES: ConsolidationActivity[] = [
    {
      name: 'Pre-Sleep Emotional Review',
      description: 'Gentle review of the day\'s emotional learning without judgment',
      timing: 'pre_sleep',
      duration_minutes: 10,
      instructions: [
        'Lie comfortably in bed with eyes closed',
        'Take 3 deep, slow breaths to activate parasympathetic nervous system',
        'Mentally scan the day for moments of emotional growth or challenge',
        'Notice these moments with curiosity rather than judgment',
        'Set a gentle intention for overnight consolidation: "My brain is integrating today\'s learning while I sleep"',
        'Release any need to problem-solve and trust the consolidation process'
      ],
      neuroscience_rationale: 'Activates the default mode network for memory consolidation and reduces cortisol before sleep'
    },
    {
      name: 'Morning Consolidation Integration',
      description: 'Upon waking practice to integrate overnight neural processing',
      timing: 'upon_waking',
      duration_minutes: 5,
      instructions: [
        'Before getting out of bed, take a moment to notice your internal state',
        'Ask: "What feels different about yesterday\'s challenges this morning?"',
        'Notice any new insights or perspectives that emerged overnight',
        'Set a gentle intention to carry this integration into the day',
        'Express gratitude to your nervous system for its overnight work'
      ],
      neuroscience_rationale: 'Captures insights from REM sleep processing and strengthens newly consolidated pathways'
    },
    {
      name: 'Learning Interval Spacing',
      description: 'Spaced repetition of emotional skills to strengthen neural pathways',
      timing: 'post_learning',
      duration_minutes: 3,
      instructions: [
        'Immediately after practicing an emotional skill, pause for integration',
        'Take 3 conscious breaths to shift from sympathetic to parasympathetic',
        'Briefly review what you just practiced without judgment',
        'Schedule the next practice session based on optimal spacing intervals',
        'Trust that your brain is already beginning to consolidate this practice'
      ],
      neuroscience_rationale: 'Optimizes spaced repetition for long-term potentiation and pathway strengthening'
    }
  ];

  /**
   * Analyzes current time and circadian profile to optimize learning recommendations
   */
  static generateLearningRecommendations(
    circadianProfile: CircadianProfile,
    currentNervousSystemState: PolyvagalState,
    targetEmotionalSkills: EmotionalSkill[]
  ): CircadianLearningRecommendation {
    const currentHour = new Date().getHours();
    const currentPhase = this.getCurrentCircadianPhase(currentHour);
    
    // Adjust recommendations based on chronotype
    const adjustedPhase = this.adjustForChronotype(currentPhase, circadianProfile.chronotype);
    
    // Create trauma-informed adaptations
    const traumaAdaptations = this.createTraumaAdaptations(
      currentNervousSystemState, 
      adjustedPhase
    );

    // Generate optimal time typeof window !== 'undefined' && windows
    const optimalWindows = this.calculateOptimalWindows(circadianProfile, targetEmotionalSkills);

    // Create personalized schedule
    const personalizedSchedule = this.buildPersonalizedSchedule(
      circadianProfile,
      targetEmotionalSkills,
      currentNervousSystemState
    );

    return {
      optimal_learning_typeof window !== 'undefined' && windows: optimalWindows.learning,
      habit_formation_timing: optimalWindows.habits,
      emotional_processing_typeof window !== 'undefined' && windows: optimalWindows.processing,
      consolidation_support_activities: this.CONSOLIDATION_ACTIVITIES,
      trauma_informed_adaptations: traumaAdaptations,
      personalized_schedule: personalizedSchedule
    };
  }

  /**
   * Determines current circadian phase based on time of day
   */
  private static getCurrentCircadianPhase(hour: number): CircadianPhase {
    for (const phase of Object.values(this.CIRCADIAN_PHASES)) {
      if (hour >= phase.start_hour && hour < phase.end_hour) {
        return phase;
      }
    }
    // Default to night phase for hours not covered
    return this.CIRCADIAN_PHASES['night'];
  }

  /**
   * Adjusts circadian phase recommendations based on individual chronotype
   */
  private static adjustForChronotype(phase: CircadianPhase, chronotype: Chronotype): CircadianPhase {
    const adjustments = {
      'extreme_lark': { shift: -2, capacity_boost: 10 },
      'moderate_lark': { shift: -1, capacity_boost: 5 },
      'neither': { shift: 0, capacity_boost: 0 },
      'moderate_owl': { shift: 1, capacity_boost: 5 },
      'extreme_owl': { shift: 2, capacity_boost: 10 }
    };

    const adjustment = adjustments[chronotype];
    
    return {
      ...phase,
      learning_capacity: Math.min(100, phase.learning_capacity + adjustment.capacity_boost),
      emotional_regulation_capacity: Math.min(100, phase.emotional_regulation_capacity + adjustment.capacity_boost)
    };
  }

  /**
   * Creates trauma-informed adaptations based on current nervous system state
   */
  private static createTraumaAdaptations(
    nervousSystemState: PolyvagalState,
    currentPhase: CircadianPhase
  ): TraumaAdaptation[] {
    const adaptations: TraumaAdaptation[] = [];

    // High arousal adaptations
    if (nervousSystemState.arousal_level > 70) {
      adaptations.push({
        adaptation_type: 'intensity',
        description: 'Reduce learning intensity due to elevated nervous system arousal',
        implementation: 'Focus on micro-practices (1-2 minutes) with emphasis on co-regulation',
        warning_signs: ['Increased heart rate', 'Difficulty concentrating', 'Feeling rushed or pressured']
      });
    }

    // Window of tolerance adaptations
    if (Math.abs(nervousSystemState.typeof window !== 'undefined' && window_of_tolerance_position) > 30) {
      adaptations.push({
        adaptation_type: 'support',
        description: 'Outside typeof window !== 'undefined' && window of tolerance - prioritize regulation over learning',
        implementation: 'Begin with nervous system regulation before any emotional skill practice',
        warning_signs: ['Feeling overwhelmed or numb', 'Difficulty accessing emotions', 'Physical tension or collapse']
      });
    }

    // High trauma sensitivity time adaptations
    if (currentPhase.trauma_sensitivity_risk === 'high') {
      adaptations.push({
        adaptation_type: 'timing',
        description: 'High trauma sensitivity period - gentle approaches only',
        implementation: 'Focus on co-regulation, avoid challenging emotional processing',
        warning_signs: ['Increased emotional reactivity', 'Fatigue', 'Difficulty with emotional boundaries']
      });
    }

    return adaptations;
  }

  /**
   * Calculates optimal time typeof window !== 'undefined' && windows for different types of learning
   */
  private static calculateOptimalWindows(
    profile: CircadianProfile,
    skills: EmotionalSkill[]
  ): {
    learning: TimeWindow[];
    habits: TimeWindow[];
    processing: TimeWindow[];
  } {
    // This would typically be more complex, analyzing individual patterns
    // For now, providing research-based defaults adjusted for chronotype

    const learningWindows: TimeWindow[] = [
      {
        name: 'Morning Peak Learning',
        start_time: '08:00',
        end_time: '11:00',
        effectiveness_score: 90,
        rationale: 'Peak cortisol and neuroplasticity typeof window !== 'undefined' && window for new skill acquisition',
        nervous_system_state_requirement: 'ventral_vagal'
      },
      {
        name: 'Afternoon Practice',
        start_time: '16:00',
        end_time: '18:00',
        effectiveness_score: 75,
        rationale: 'Good capacity recovery with lower pressure for skill reinforcement',
        nervous_system_state_requirement: 'ventral_vagal'
      }
    ];

    const habitWindows: TimeWindow[] = [
      {
        name: 'Morning Routine Integration',
        start_time: '07:00',
        end_time: '09:00',
        effectiveness_score: 85,
        rationale: 'Existing routine strength supports new habit stacking',
        nervous_system_state_requirement: 'ventral_vagal'
      },
      {
        name: 'Evening Completion',
        start_time: '18:00',
        end_time: '20:00',
        effectiveness_score: 80,
        rationale: 'Natural transition time with completion satisfaction',
        nervous_system_state_requirement: 'ventral_vagal'
      }
    ];

    const processingWindows: TimeWindow[] = [
      {
        name: 'Late Morning Processing',
        start_time: '10:00',
        end_time: '12:00',
        effectiveness_score: 85,
        rationale: 'High cognitive capacity with emotional regulation stability',
        nervous_system_state_requirement: 'ventral_vagal'
      },
      {
        name: 'Evening Integration',
        start_time: '19:00',
        end_time: '21:00',
        effectiveness_score: 75,
        rationale: 'Natural reflection time with preparation for consolidation',
        nervous_system_state_requirement: 'ventral_vagal'
      }
    ];

    return {
      learning: learningWindows,
      habits: habitWindows,
      processing: processingWindows
    };
  }

  /**
   * Builds a personalized daily schedule optimized for circadian rhythms
   */
  private static buildPersonalizedSchedule(
    profile: CircadianProfile,
    skills: EmotionalSkill[],
    nervousSystemState: PolyvagalState
  ): PersonalizedSchedule {
    // This would be highly personalized based on individual data
    // Providing trauma-informed template that can be customized

    return {
      morning_routine: [
        {
          time: '07:30',
          activity_type: 'regulation',
          activity_name: 'Morning Nervous System Check-in',
          duration_minutes: 3,
          intensity_level: 'micro',
          nervous_system_preparation: [
            'Take 3 conscious breaths',
            'Notice internal state without judgment',
            'Set intention for gentle learning'
          ],
          success_indicators: ['Feeling present', 'Aware of internal state', 'Sense of choice']
        },
        {
          time: '08:00',
          activity_type: 'emotional_skill',
          activity_name: 'Primary Skill Practice',
          duration_minutes: 15,
          intensity_level: 'moderate',
          nervous_system_preparation: [
            'Confirm feeling resourced and regulated',
            'Create physical safety (comfortable space)',
            'Have co-regulation support available if needed'
          ],
          success_indicators: ['Maintained regulation', 'Curious engagement', 'Sense of learning']
        }
      ],
      afternoon_activities: [
        {
          time: '16:30',
          activity_type: 'habit_practice',
          activity_name: 'Habit Stack Reinforcement',
          duration_minutes: 5,
          intensity_level: 'light',
          nervous_system_preparation: [
            'Brief regulation check',
            'Connect to existing routine anchor',
            'Remind self this is practice, not perfection'
          ],
          success_indicators: ['Completed without pressure', 'Connected to routine', 'Felt manageable']
        }
      ],
      evening_routine: [
        {
          time: '20:00',
          activity_type: 'consolidation',
          activity_name: 'Day Integration Review',
          duration_minutes: 8,
          intensity_level: 'light',
          nervous_system_preparation: [
            'Create calming environment',
            'Activate parasympathetic through slow breathing',
            'Set intention for gentle review'
          ],
          success_indicators: ['Feeling calm', 'Non-judgmental awareness', 'Ready for rest']
        }
      ],
      bedtime_protocol: [
        {
          time: '21:30',
          activity_type: 'consolidation',
          activity_name: 'Pre-Sleep Consolidation Preparation',
          duration_minutes: 10,
          intensity_level: 'micro',
          nervous_system_preparation: [
            'Already in comfortable sleep position',
            'Dim lighting activated',
            'All devices put away'
          ],
          success_indicators: ['Feeling sleepy', 'Mind beginning to quiet', 'Body relaxed']
        }
      ]
    };
  }

  /**
   * Assesses user's chronotype using validated questionnaire items
   */
  static assessChronotype(responses: ChronotypeAssessmentResponse[]): Chronotype {
    // Simplified version of Munich ChronoType Questionnaire (MCTQ)
    let score = 0;
    
    responses.forEach(response => {
      score += response.score;
    });

    // Convert score to chronotype
    if (score <= -2) return 'extreme_lark';
    if (score <= -1) return 'moderate_lark';
    if (score <= 1) return 'neither';
    if (score <= 2) return 'moderate_owl';
    return 'extreme_owl';
  }

  /**
   * Monitors learning effectiveness across different times to optimize recommendations
   */
  static trackLearningEffectiveness(
    userId: string,
    learningSession: LearningSession
  ): void {
    // This would integrate with analytics to continuously optimize timing
    // Implementation would store data for machine learning optimization
    console.log(`Tracking learning effectiveness for ${userId}:`, learningSession);
  }
}

export interface ChronotypeAssessmentResponse {
  question_id: string;
  score: number; // -2 to +2 scale
}

export interface LearningSession {
  start_time: Date;
  end_time: Date;
  activity_type: 'emotional_skill' | 'habit_practice' | 'processing';
  effectiveness_rating: number; // 1-10
  nervous_system_state_before: PolyvagalState;
  nervous_system_state_after: PolyvagalState;
  subjective_experience: string;
}