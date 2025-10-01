/**
 * Trauma-Informed Habit Adaptation System
 * 
 * Dynamically adapts habits based on nervous system dysregulation, trauma responses,
 * and current capacity. This system recognizes that trauma survivors need flexible,
 * responsive approaches that honor their body's wisdom and changing needs.
 * 
 * Key Principles:
 * - Titration: Start small, build slowly
 * - Choice and Agency: Always preserve user control
 * - Window of Tolerance: Respect nervous system capacity
 * - Pendulation: Move between challenge and rest
 * - Somatic Awareness: Honor body signals
 * - Trauma-Specific Adaptations: Different trauma types need different approaches
 * 
 * Based on research from:
 * - Polyvagal Theory (Stephen Porges)
 * - Somatic Experiencing (Peter Levine)
 * - Complex Trauma (Judith Herman, Christine Courtois)
 * - Window of Tolerance (Dan Siegel)
 * - Trauma-Sensitive Yoga (David Emerson)
 */

import { NervousSystemState, MicroHabit } from './neuroplasticity-habits';

export interface TraumaAdaptationProfile {
  id: string;
  user_id: string;
  
  // Trauma pattern recognition
  primary_trauma_responses: TraumaResponse[];
  typical_dysregulation_patterns: DysregulationPattern[];
  
  // Nervous system patterns
  typeof window !== 'undefined' && window_of_tolerance_range: [number, number]; // Min-max capacity
  regulation_strategies: RegulationStrategy[];
  trigger_early_warning_signs: EarlyWarningSigns;
  
  // Adaptation preferences
  preferred_modification_types: ModificationType[];
  communication_preferences: CommunicationPreferences;
  agency_requirements: AgencyRequirement[];
  
  // Historical adaptation data
  successful_adaptations: SuccessfulAdaptation[];
  ineffective_adaptations: IneffectiveAdaptation[];
  
  // Crisis management
  crisis_protocols: CrisisProtocol[];
  
  created_date: Date;
  last_updated: Date;
}

export interface TraumaResponse {
  response_type: 'hyperarousal' | 'hypoarousal' | 'dissociation' | 'emotional_flooding' | 'somatic_shutdown';
  typical_triggers: string[];
  body_sensations: string[];
  emotional_patterns: string[];
  cognitive_impacts: string[];
  duration_range: [number, number]; // minutes
  intensity_scale: [number, number]; // 1-10 range
  effective_interventions: string[];
}

export interface DysregulationPattern {
  pattern_name: string;
  sequence: DysregulationStep[];
  predictive_factors: string[];
  intervention_typeof window !== 'undefined' && windows: InterventionWindow[];
  recovery_timeline: RecoveryTimeline;
}

export interface DysregulationStep {
  step_name: string;
  typical_duration_minutes: number;
  body_signals: string[];
  emotional_state: string;
  cognitive_capacity: number; // 0-100
  optimal_interventions: string[];
  contraindicated_approaches: string[];
}

export interface InterventionWindow {
  typeof window !== 'undefined' && window_name: string;
  timing_in_sequence: 'early' | 'middle' | 'late' | 'recovery';
  intervention_types: string[];
  success_probability: number; // 0-100
}

export interface RegulationStrategy {
  strategy_name: string;
  strategy_type: 'breathing' | 'movement' | 'grounding' | 'cognitive' | 'social' | 'sensory';
  effectiveness_rating: number; // 1-10
  time_to_effect: number; // minutes
  accessibility: 'always' | 'most_times' | 'sometimes' | 'rarely';
  side_effects?: string[];
  contraindications?: string[];
}

export interface EarlyWarningSigns {
  physical_signals: PhysicalSignal[];
  emotional_signals: EmotionalSignal[];
  cognitive_signals: CognitiveSignal[];
  behavioral_signals: BehaviorSignal[];
  environmental_factors: EnvironmentalFactor[];
}

export interface PhysicalSignal {
  signal: string;
  typical_intensity: number; // 1-10
  lead_time_minutes: number; // How early this appears before full dysregulation
  reliability: number; // 0-100, how consistently this predicts dysregulation
}

export interface TraumaInformedAdaptation {
  adaptation_id: string;
  trigger_conditions: TriggerCondition[];
  
  // Modification strategies
  habit_modifications: HabitModification[];
  communication_approach: CommunicationApproach;
  choice_enhancement: ChoiceEnhancement[];
  
  // Safety measures
  safety_protocols: SafetyProtocol[];
  crisis_considerations: CrisisConsideration[];
  
  // Recovery support
  recovery_practices: RecoveryPractice[];
  integration_support: IntegrationSupport[];
  
  // Tracking and learning
  effectiveness_metrics: EffectivenessMetric[];
  adaptation_learning: AdaptationLearning;
  
  created_date: Date;
  last_used: Date;
  success_rate: number; // 0-100
}

export interface TriggerCondition {
  condition_type: 'nervous_system_state' | 'stress_level' | 'energy_level' | 'time_pressure' | 'environmental' | 'relational';
  threshold_value: any;
  sensitivity: 'high' | 'medium' | 'low';
  override_capability: boolean; // Can user override this adaptation?
}

export interface HabitModification {
  modification_type: 'duration_reduction' | 'complexity_simplification' | 'modality_change' | 'environment_change' | 'timing_shift' | 'pause_option';
  original_version: string;
  modified_version: string;
  modification_rationale: string;
  neural_impact_preservation: number; // 0-100, how much neuroplasticity benefit is maintained
  user_control_level: 'automatic' | 'suggested' | 'user_choice_required';
}

export interface CommunicationApproach {
  tone: 'gentle' | 'encouraging' | 'neutral' | 'empowering';
  language_style: 'simple' | 'detailed' | 'metaphorical' | 'scientific';
  validation_level: 'high' | 'moderate' | 'minimal';
  explanation_depth: 'full' | 'brief' | 'minimal' | 'none';
  trauma_informed_elements: string[];
}

export interface ChoiceEnhancement {
  choice_point: string;
  options_presented: ChoiceOption[];
  default_selection: string;
  autonomy_support_message: string;
}

export interface ChoiceOption {
  option_name: string;
  description: string;
  neural_benefit_level: number; // 0-100
  effort_required: number; // 0-100
  trauma_sensitivity: 'low' | 'medium' | 'high';
}

export interface SafetyProtocol {
  protocol_name: string;
  activation_triggers: string[];
  immediate_actions: string[];
  user_communication: string;
  follow_up_actions: string[];
  professional_consultation_threshold?: string;
}

export interface RecoveryPractice {
  practice_name: string;
  practice_type: 'self_compassion' | 'nervous_system_reset' | 'meaning_making' | 'energy_restoration';
  duration_minutes: number;
  when_to_use: 'immediately' | 'within_hour' | 'same_day' | 'next_day';
  practice_steps: string[];
}

export class TraumaInformedHabitAdaptationEngine {
  
  /**
   * Assess current state and determine if habit adaptations are needed
   */
  static assessAdaptationNeeds(
    current_nervous_system_state: NervousSystemState,
    trauma_profile: TraumaAdaptationProfile,
    current_context: {
      stress_level: number; // 0-10
      energy_level: number; // 0-100
      time_pressure: boolean;
      social_support_available: boolean;
      recent_triggers: string[];
      sleep_quality_last_night: number; // 0-100
      life_disruptions: string[];
    },
    scheduled_habits: MicroHabit[]
  ): {
    adaptations_needed: boolean;
    adaptation_urgency: 'low' | 'moderate' | 'high' | 'critical';
    specific_adaptations_recommended: TraumaInformedAdaptation[];
    reasoning: string[];
    user_communication: string;
  } {
    
    const assessment_results = this.performMultiDimensionalAssessment(
      current_nervous_system_state,
      trauma_profile,
      current_context
    );
    
    if (assessment_results.adaptation_score < 30) {
      return {
        adaptations_needed: false,
        adaptation_urgency: 'low',
        specific_adaptations_recommended: [],
        reasoning: ['Current capacity supports standard habit practice'],
        user_communication: 'You\'re in a good space for your regular practices today.'
      };
    }
    
    const specific_adaptations = this.generateSpecificAdaptations(
      assessment_results,
      scheduled_habits,
      trauma_profile
    );
    
    return {
      adaptations_needed: true,
      adaptation_urgency: this.determineUrgency(assessment_results.adaptation_score),
      specific_adaptations_recommended: specific_adaptations,
      reasoning: assessment_results.reasoning,
      user_communication: this.generateUserCommunication(assessment_results, trauma_profile)
    };
  }
  
  /**
   * Apply real-time adaptations during habit practice
   */
  static applyRealTimeAdaptations(
    current_habit: MicroHabit,
    real_time_signals: {
      body_tension_level: number; // 0-10
      breathing_pattern: 'calm' | 'shallow' | 'rapid' | 'irregular';
      emotional_intensity: number; // 0-10
      dissociation_indicators: string[];
      time_elapsed: number; // minutes
      engagement_level: number; // 0-10
    },
    trauma_profile: TraumaAdaptationProfile
  ): {
    immediate_modifications: ImmediateModification[];
    safety_checks: SafetyCheck[];
    choice_points: ChoicePoint[];
    encouragement_message: string;
    continuation_recommendation: 'continue' | 'modify' | 'pause' | 'stop';
  } {
    
    const risk_assessment = this.assessRealTimeRisk(real_time_signals, trauma_profile);
    
    if (risk_assessment.risk_level === 'high' || risk_assessment.risk_level === 'critical') {
      return this.generateSafetyResponse(risk_assessment, current_habit, trauma_profile);
    }
    
    const modifications = this.generateRealTimeModifications(
      real_time_signals,
      current_habit,
      trauma_profile
    );
    
    return {
      immediate_modifications: modifications,
      safety_checks: this.generateSafetyChecks(real_time_signals),
      choice_points: this.generateChoicePoints(current_habit, real_time_signals),
      encouragement_message: this.generateEncouragementMessage(real_time_signals, trauma_profile),
      continuation_recommendation: this.recommendContinuation(risk_assessment, real_time_signals)
    };
  }
  
  /**
   * Create trauma-specific habit variations
   */
  static createTraumaSpecificVariations(
    base_habit: MicroHabit,
    trauma_types: string[],
    individual_patterns: DysregulationPattern[]
  ): {
    [traumaType: string]: TraumaSpecificHabitVariation;
  } {
    
    const variations: { [key: string]: TraumaSpecificHabitVariation } = {};
    
    trauma_types.forEach(trauma_type => {
      variations[trauma_type] = this.createVariationForTraumaType(
        base_habit,
        trauma_type,
        individual_patterns.find(p => p.pattern_name.includes(trauma_type))
      );
    });
    
    return variations;
  }
  
  /**
   * Generate post-practice integration support
   */
  static generateIntegrationSupport(
    completed_habit: MicroHabit,
    practice_experience: {
      completion_level: number; // 0-100
      engagement_quality: number; // 0-10
      emotional_experience: string[];
      body_sensations_noticed: string[];
      insights_gained: string[];
      challenges_encountered: string[];
      modifications_used: string[];
    },
    trauma_profile: TraumaAdaptationProfile
  ): {
    celebration_approach: CelebrationApproach;
    meaning_making_support: MeaningMakingSupport;
    neural_integration_practices: NeuralIntegrationPractice[];
    next_session_recommendations: NextSessionRecommendation[];
    learning_extraction: LearningExtraction;
  } {
    
    const celebration = this.createTraumaInformedCelebration(practice_experience, trauma_profile);
    const meaning_making = this.createMeaningMakingSupport(practice_experience);
    const integration_practices = this.selectNeuralIntegrationPractices(practice_experience);
    
    return {
      celebration_approach: celebration,
      meaning_making_support: meaning_making,
      neural_integration_practices: integration_practices,
      next_session_recommendations: this.generateNextSessionRecommendations(practice_experience),
      learning_extraction: this.extractLearningFromSession(practice_experience, trauma_profile)
    };
  }
  
  /**
   * Crisis-responsive habit modification
   */
  static handleCrisisAdaptation(
    crisis_indicators: {
      crisis_type: 'emotional_flooding' | 'dissociation' | 'panic' | 'suicidal_ideation' | 'self_harm_urges' | 'flashback';
      intensity: number; // 1-10
      duration_so_far: number; // minutes
      available_resources: string[];
      safety_level: 'safe' | 'concerning' | 'dangerous';
    },
    current_habits: MicroHabit[],
    trauma_profile: TraumaAdaptationProfile
  ): {
    immediate_habit_modifications: CrisisHabitModification[];
    safety_protocols_activated: SafetyProtocol[];
    resource_mobilization: ResourceMobilization;
    recovery_timeline: CrisisRecoveryTimeline;
    return_to_practice_criteria: ReturnCriteria;
  } {
    
    const crisis_level = this.assessCrisisLevel(crisis_indicators);
    
    if (crisis_level === 'severe') {
      return this.generateSevereCrisisResponse(crisis_indicators, trauma_profile);
    }
    
    const habit_modifications = this.createCrisisHabitModifications(
      current_habits,
      crisis_indicators,
      trauma_profile
    );
    
    return {
      immediate_habit_modifications: habit_modifications,
      safety_protocols_activated: this.activateRelevantSafetyProtocols(crisis_indicators, trauma_profile),
      resource_mobilization: this.mobilizeResources(crisis_indicators, trauma_profile),
      recovery_timeline: this.createRecoveryTimeline(crisis_indicators),
      return_to_practice_criteria: this.defineReturnCriteria(crisis_indicators, trauma_profile)
    };
  }
  
  /**
   * Learn from adaptation patterns to improve future recommendations
   */
  static learnFromAdaptationOutcomes(
    adaptation_used: TraumaInformedAdaptation,
    outcomes: {
      effectiveness_rating: number; // 1-10
      user_satisfaction: number; // 1-10
      habit_completion: boolean;
      neural_engagement_maintained: boolean;
      side_effects: string[];
      user_feedback: string;
      objective_measures?: {
        stress_reduction: number; // -10 to 10
        energy_impact: number; // -10 to 10
        mood_impact: number; // -10 to 10
      };
    },
    user_profile: TraumaAdaptationProfile
  ): {
    learning_insights: LearningInsight[];
    profile_updates: ProfileUpdate[];
    algorithm_improvements: AlgorithmImprovement[];
    future_recommendations: FutureRecommendation[];
  } {
    
    const insights = this.extractLearningInsights(adaptation_used, outcomes);
    const profile_updates = this.generateProfileUpdates(outcomes, user_profile);
    
    return {
      learning_insights: insights,
      profile_updates: profile_updates,
      algorithm_improvements: this.identifyAlgorithmImprovements(adaptation_used, outcomes),
      future_recommendations: this.generateFutureRecommendations(insights, user_profile)
    };
  }
  
  // Private implementation methods
  
  private static performMultiDimensionalAssessment(
    nervous_system_state: NervousSystemState,
    trauma_profile: TraumaAdaptationProfile,
    context: any
  ): AssessmentResults {
    
    let adaptation_score = 0;
    const reasoning = [];
    
    // Window of tolerance assessment
    if (nervous_system_state.typeof window !== 'undefined' && windowOfTolerance.current < trauma_profile.typeof window !== 'undefined' && window_of_tolerance_range[0]) {
      adaptation_score += 40;
      reasoning.push('Current capacity below personal minimum threshold');
    }
    
    // Stress level assessment
    if (context.stress_level > 7) {
      adaptation_score += 30;
      reasoning.push('Elevated stress level requiring gentler approach');
    }
    
    // Energy level assessment
    if (context.energy_level < 30) {
      adaptation_score += 25;
      reasoning.push('Low energy requiring simplified practices');
    }
    
    // Recent triggers assessment
    if (context.recent_triggers.length > 0) {
      adaptation_score += 35;
      reasoning.push('Recent triggers detected, extra care needed');
    }
    
    // Sleep quality assessment
    if (context.sleep_quality_last_night < 50) {
      adaptation_score += 20;
      reasoning.push('Poor sleep affecting cognitive and emotional capacity');
    }
    
    return {
      adaptation_score,
      reasoning,
      risk_factors: this.identifyRiskFactors(nervous_system_state, context),
      protective_factors: this.identifyProtectiveFactors(context)
    };
  }
  
  private static generateSpecificAdaptations(
    assessment: AssessmentResults,
    habits: MicroHabit[],
    profile: TraumaAdaptationProfile
  ): TraumaInformedAdaptation[] {
    
    return habits.map(habit => {
      const adaptation: TraumaInformedAdaptation = {
        adaptation_id: `${habit.id}_adaptation_${Date.now()}`,
        trigger_conditions: this.createTriggerConditions(assessment),
        habit_modifications: this.createHabitModifications(habit, assessment, profile),
        communication_approach: this.selectCommunicationApproach(profile),
        choice_enhancement: this.createChoiceEnhancements(habit, assessment),
        safety_protocols: profile.crisis_protocols,
        crisis_considerations: this.createCrisisConsiderations(assessment),
        recovery_practices: this.selectRecoveryPractices(profile),
        integration_support: this.createIntegrationSupport(),
        effectiveness_metrics: this.createEffectivenessMetrics(),
        adaptation_learning: this.initializeAdaptationLearning(),
        created_date: new Date(),
        last_used: new Date(),
        success_rate: 0 // Will be updated based on outcomes
      };
      
      return adaptation;
    });
  }
  
  private static createHabitModifications(
    habit: MicroHabit,
    assessment: AssessmentResults,
    profile: TraumaAdaptationProfile
  ): HabitModification[] {
    
    const modifications: HabitModification[] = [];
    
    // Duration reduction if low capacity
    if (assessment.adaptation_score > 50) {
      modifications.push({
        modification_type: 'duration_reduction',
        original_version: habit.moderate_version,
        modified_version: habit.minimal_version,
        modification_rationale: 'Reduced to honor current nervous system capacity',
        neural_impact_preservation: 70, // Minimal version still provides neuroplasticity benefits
        user_control_level: 'suggested'
      });
    }
    
    // Complexity simplification if high stress
    if (assessment.reasoning.includes('Elevated stress level')) {
      modifications.push({
        modification_type: 'complexity_simplification',
        original_version: habit.moderate_version,
        modified_version: this.createSimplifiedVersion(habit),
        modification_rationale: 'Simplified to reduce cognitive load during stress',
        neural_impact_preservation: 60,
        user_control_level: 'user_choice_required'
      });
    }
    
    return modifications;
  }
  
  private static createSimplifiedVersion(habit: MicroHabit): string {
    // Create an even simpler version than minimal for high stress states
    return `Ultra-gentle version: ${habit.minimal_version.split(' ').slice(0, 3).join(' ')}`;
  }
  
  private static selectCommunicationApproach(profile: TraumaAdaptationProfile): CommunicationApproach {
    return {
      tone: 'gentle',
      language_style: 'simple',
      validation_level: 'high',
      explanation_depth: 'brief',
      trauma_informed_elements: [
        'Acknowledges courage in showing up',
        'Normalizes need for modifications',
        'Emphasizes choice and agency',
        'Validates body wisdom'
      ]
    };
  }
  
  private static determineUrgency(adaptation_score: number): 'low' | 'moderate' | 'high' | 'critical' {
    if (adaptation_score < 30) return 'low';
    if (adaptation_score < 60) return 'moderate';
    if (adaptation_score < 85) return 'high';
    return 'critical';
  }
  
  private static generateUserCommunication(assessment: AssessmentResults, profile: TraumaAdaptationProfile): string {
    if (assessment.adaptation_score > 70) {
      return 'Your system is asking for extra gentleness today. Let\'s honor that wisdom by adapting your practices.';
    } else if (assessment.adaptation_score > 40) {
      return 'I notice your capacity might be different today. We can adjust your practices to match your current state.';
    }
    return 'Your practices can be gently modified to better support you today.';
  }
  
  // Crisis response methods
  private static generateSevereCrisisResponse(
    crisis_indicators: any,
    trauma_profile: TraumaAdaptationProfile
  ): any {
    return {
      immediate_habit_modifications: [
        {
          modification_type: 'crisis_pause',
          modified_practice: 'All habit practices paused. Focus on immediate safety and stabilization.',
          safety_priority: 'critical'
        }
      ],
      safety_protocols_activated: trauma_profile.crisis_protocols.filter(p => p.protocol_name === 'severe_crisis'),
      resource_mobilization: {
        professional_resources: 'immediate',
        peer_support: 'urgent',
        self_care: 'crisis_stabilization'
      },
      recovery_timeline: {
        immediate: 'Safety and stabilization',
        next_24_hours: 'Professional support engagement',
        next_week: 'Gradual return to gentle practices'
      },
      return_to_practice_criteria: {
        safety_established: true,
        professional_clearance: true,
        nervous_system_stabilization: true
      }
    };
  }
  
  // Additional helper methods would be implemented here...
  private static identifyRiskFactors(state: any, context: any): string[] {
    return ['Low typeof window !== 'undefined' && window of tolerance', 'Recent triggers', 'High stress'];
  }
  
  private static identifyProtectiveFactors(context: any): string[] {
    return context.social_support_available ? ['Social support available'] : [];
  }
  
  private static createTriggerConditions(assessment: AssessmentResults): TriggerCondition[] {
    return [
      {
        condition_type: 'stress_level',
        threshold_value: 7,
        sensitivity: 'high',
        override_capability: true
      }
    ];
  }
  
  private static createChoiceEnhancements(habit: MicroHabit, assessment: AssessmentResults): ChoiceEnhancement[] {
    return [
      {
        choice_point: 'Practice start',
        options_presented: [
          {
            option_name: 'Full practice',
            description: habit.moderate_version,
            neural_benefit_level: 100,
            effort_required: 80,
            trauma_sensitivity: 'medium'
          },
          {
            option_name: 'Gentle version',
            description: habit.minimal_version,
            neural_benefit_level: 70,
            effort_required: 30,
            trauma_sensitivity: 'low'
          },
          {
            option_name: 'Skip today',
            description: 'Honor your needs and try again tomorrow',
            neural_benefit_level: 0,
            effort_required: 0,
            trauma_sensitivity: 'low'
          }
        ],
        default_selection: 'Gentle version',
        autonomy_support_message: 'Your choice honors your body\'s wisdom'
      }
    ];
  }
  
  private static createCrisisConsiderations(assessment: AssessmentResults): CrisisConsideration[] {
    return [
      {
        consideration: 'Monitor for overwhelm',
        warning_signs: ['Dissociation', 'Emotional flooding', 'Physical shutdown'],
        immediate_response: 'Stop practice and ground in present moment'
      }
    ];
  }
  
  private static selectRecoveryPractices(profile: TraumaAdaptationProfile): RecoveryPractice[] {
    return profile.regulation_strategies.map(strategy => ({
      practice_name: strategy.strategy_name,
      practice_type: 'nervous_system_reset',
      duration_minutes: 3,
      when_to_use: 'immediately',
      practice_steps: [`Use ${strategy.strategy_name} to return to regulation`]
    }));
  }
  
  private static createIntegrationSupport(): IntegrationSupport {
    return {
      self_compassion_reminders: ['You showed up for yourself today', 'Modifications are wisdom, not weakness'],
      meaning_making_prompts: ['What did your body teach you today?'],
      neural_pathway_celebration: 'Your brain is growing new connections'
    };
  }
  
  private static createEffectivenessMetrics(): EffectivenessMetric[] {
    return [
      {
        metric_name: 'Nervous system impact',
        measurement_approach: 'Before/after self-report',
        target_outcome: 'Improved or maintained regulation'
      }
    ];
  }
  
  private static initializeAdaptationLearning(): AdaptationLearning {
    return {
      patterns_identified: [],
      successful_strategies: [],
      areas_for_improvement: [],
      user_preferences_learned: []
    };
  }
}

// Supporting interfaces
interface AssessmentResults {
  adaptation_score: number;
  reasoning: string[];
  risk_factors: string[];
  protective_factors: string[];
}

interface TraumaSpecificHabitVariation {
  variation_name: string;
  trauma_type: string;
  modifications: HabitModification[];
  safety_considerations: string[];
  success_indicators: string[];
}

interface ImmediateModification {
  modification: string;
  reason: string;
  implementation: string;
}

interface SafetyCheck {
  check_name: string;
  check_question: string;
  concerning_responses: string[];
  response_protocol: string;
}

interface ChoicePoint {
  moment: string;
  options: string[];
  default_choice: string;
  autonomy_message: string;
}

interface CelebrationApproach {
  celebration_style: 'gentle' | 'warm' | 'enthusiastic';
  focus_areas: string[];
  trauma_sensitive_elements: string[];
}

interface MeaningMakingSupport {
  reflection_prompts: string[];
  integration_questions: string[];
  growth_acknowledgment: string;
}

interface NeuralIntegrationPractice {
  practice_name: string;
  duration_minutes: number;
  neural_purpose: string;
  steps: string[];
}

interface NextSessionRecommendation {
  recommendation: string;
  rationale: string;
  timing_suggestion: string;
}

interface LearningExtraction {
  key_learnings: string[];
  patterns_noticed: string[];
  future_applications: string[];
}

interface CrisisHabitModification {
  modification_type: 'pause' | 'crisis_specific' | 'safety_first';
  modified_practice: string;
  safety_priority: 'high' | 'critical';
}

interface ResourceMobilization {
  professional_resources: string;
  peer_support: string;
  self_care: string;
}

interface CrisisRecoveryTimeline {
  immediate: string;
  next_24_hours: string;
  next_week: string;
}

interface ReturnCriteria {
  safety_established: boolean;
  professional_clearance?: boolean;
  nervous_system_stabilization: boolean;
}

interface LearningInsight {
  insight: string;
  confidence_level: number;
  applications: string[];
}

interface ProfileUpdate {
  update_type: string;
  old_value: any;
  new_value: any;
  reasoning: string;
}

interface AlgorithmImprovement {
  improvement_area: string;
  current_limitation: string;
  proposed_enhancement: string;
}

interface FutureRecommendation {
  recommendation: string;
  implementation_timeline: string;
  expected_benefit: string;
}

// Additional interfaces for completeness
interface ModificationType {
  type: string;
  preference_level: number;
}

interface CommunicationPreferences {
  preferred_tone: string;
  validation_needs: string;
  explanation_preferences: string;
}

interface AgencyRequirement {
  requirement: string;
  importance_level: 'critical' | 'high' | 'moderate';
}

interface SuccessfulAdaptation {
  adaptation_type: string;
  context: string;
  outcome: string;
  date: Date;
}

interface IneffectiveAdaptation {
  adaptation_type: string;
  context: string;
  problems: string[];
  date: Date;
}

interface CrisisProtocol {
  protocol_name: string;
  activation_triggers: string[];
  immediate_actions: string[];
}

interface EmotionalSignal {
  signal: string;
  intensity: number;
  lead_time_minutes: number;
  reliability: number;
}

interface CognitiveSignal {
  signal: string;
  intensity: number;
  lead_time_minutes: number;
  reliability: number;
}

interface BehaviorSignal {
  signal: string;
  intensity: number;
  lead_time_minutes: number;
  reliability: number;
}

interface EnvironmentalFactor {
  factor: string;
  impact_level: number;
  predictive_value: number;
}

interface RecoveryTimeline {
  typical_duration: number;
  phases: string[];
  support_needs: string[];
}

interface CrisisConsideration {
  consideration: string;
  warning_signs: string[];
  immediate_response: string;
}

interface IntegrationSupport {
  self_compassion_reminders: string[];
  meaning_making_prompts: string[];
  neural_pathway_celebration: string;
}

interface EffectivenessMetric {
  metric_name: string;
  measurement_approach: string;
  target_outcome: string;
}

interface AdaptationLearning {
  patterns_identified: string[];
  successful_strategies: string[];
  areas_for_improvement: string[];
  user_preferences_learned: string[];
}