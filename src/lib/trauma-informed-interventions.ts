/**
 * Trauma-Informed Intervention Engine
 * Personalized neuroplasticity interventions adapted for different trauma types
 * 
 * This system recognizes that different trauma experiences create different
 * neural patterns and require different approaches to healing and habit formation.
 * 
 * Based on research from:
 * - Polyvagal Theory (Stephen Porges)
 * - Window of Tolerance (Dan Siegel)  
 * - Somatic Experiencing (Peter Levine)
 * - Complex Trauma research (Judith Herman, Bessel van der Kolk)
 */

export interface TraumaProfile {
  id: string;
  user_id: string;
  
  // Trauma categorization (self-reported, not diagnostic)
  trauma_types: TraumaType[];
  primary_trauma_pattern: 'developmental' | 'shock' | 'complex' | 'betrayal' | 'systemic' | 'medical' | 'collective';
  
  // Nervous system patterns
  typical_responses: NervousSystemResponse[];
  typeof window !== 'undefined' && window_of_tolerance_baseline: number; // 0-100
  regulation_strengths: string[];
  regulation_challenges: string[];
  
  // Somatic patterns
  body_relationship: 'connected' | 'partially_connected' | 'disconnected' | 'hypervigilant' | 'dissociated';
  somatic_resources: string[];
  somatic_challenges: string[];
  
  // Relational patterns
  attachment_style: 'secure' | 'anxious' | 'avoidant' | 'disorganized' | 'healing';
  social_engagement_capacity: 'high' | 'moderate' | 'limited' | 'minimal';
  trust_patterns: TrustPattern[];
  
  // Strengths and resources
  resilience_factors: string[];
  existing_coping_strategies: CopingStrategy[];
  support_systems: SupportSystem[];
  
  // Intervention preferences
  preferred_modalities: InterventionModality[];
  contraindications: string[];
  trigger_awareness: TriggerMap[];
  
  created_date: Date;
  last_updated: Date;
}

export interface TraumaType {
  category: 'developmental' | 'shock' | 'complex' | 'betrayal' | 'systemic' | 'medical' | 'collective';
  age_of_occurrence?: string;
  duration?: string;
  relationship_to_perpetrator?: string;
  impact_areas: string[];
  healing_stage: 'safety' | 'remembrance' | 'reconnection';
}

export interface NervousSystemResponse {
  trigger_category: string;
  typical_response: 'hyperarousal' | 'hypoarousal' | 'mixed' | 'dissociation';
  body_sensations: string[];
  emotional_patterns: string[];
  behavioral_patterns: string[];
  recovery_time: 'minutes' | 'hours' | 'days' | 'varies';
  effective_interventions: string[];
}

export interface TrustPattern {
  area: 'self_trust' | 'body_trust' | 'other_trust' | 'world_trust' | 'process_trust';
  current_level: number; // 1-10
  fluctuation_pattern: 'stable' | 'context_dependent' | 'highly_variable';
  building_strategies: string[];
}

export interface CopingStrategy {
  strategy: string;
  effectiveness: number; // 1-10
  sustainability: number; // 1-10
  side_effects?: string[];
  when_used: string[];
}

export interface SupportSystem {
  type: 'professional' | 'personal' | 'community' | 'spiritual' | 'animal' | 'nature';
  description: string;
  accessibility: 'readily_available' | 'sometimes_available' | 'rarely_available';
  effectiveness: number; // 1-10
}

export interface InterventionModality {
  type: 'somatic' | 'cognitive' | 'creative' | 'movement' | 'nature' | 'spiritual' | 'social';
  preference_level: number; // 1-10
  past_effectiveness: number; // 1-10
  current_accessibility: number; // 1-10
}

export interface TriggerMap {
  trigger: string;
  intensity_range: [number, number]; // min-max on 1-10 scale
  warning_signs: string[];
  effective_interventions: string[];
  ineffective_approaches: string[];
}

export interface TraumaInformedIntervention {
  id: string;
  name: string;
  description: string;
  target_trauma_types: string[];
  
  // Neuroplasticity focus
  neural_targets: NeuralTarget[];
  neuroplasticity_approach: 'bottom_up' | 'top_down' | 'integrated';
  
  // Trauma-informed modifications
  safety_considerations: SafetyConsideration[];
  titration_guidelines: TitrationGuideline[];
  choice_and_agency_elements: ChoiceElement[];
  
  // Implementation structure
  phases: InterventionPhase[];
  session_structure: SessionStructure;
  homework_practices: HomeworkPractice[];
  
  // Measurement and adaptation
  progress_indicators: TraumaProgressIndicator[];
  red_flag_indicators: RedFlagIndicator[];
  adaptation_protocols: AdaptationProtocol[];
  
  // Integration support
  daily_life_integration: string[];
  relational_integration: string[];
  crisis_support_plan: CrisisSupportPlan;
}

export interface NeuralTarget {
  brain_region: string;
  function: string;
  trauma_impact: string;
  healing_approach: string;
  expected_timeline: string;
}

export interface SafetyConsideration {
  risk_factor: string;
  warning_signs: string[];
  prevention_strategies: string[];
  response_plan: string;
}

export interface TitrationGuideline {
  principle: string;
  implementation: string;
  signs_of_overwhelm: string[];
  adjustment_strategy: string;
}

export interface ChoiceElement {
  moment: string;
  choices_offered: string[];
  autonomy_support: string;
  opt_out_strategy: string;
}

export interface InterventionPhase {
  name: string;
  focus: string;
  duration_range: string;
  prerequisites: string[];
  practices: PhasePractice[];
  completion_indicators: string[];
}

export interface PhasePractice {
  name: string;
  type: 'daily' | 'weekly' | 'as_needed' | 'crisis_resource';
  duration: number; // minutes
  neural_focus: string;
  trauma_adaptations: string[];
  practice_steps: TraumaInformedStep[];
}

export interface TraumaInformedStep {
  order: number;
  name: string;
  instruction: string;
  neural_effect: string;
  trauma_modifications: {
    developmental?: string;
    shock?: string;
    complex?: string;
    betrayal?: string;
    systemic?: string;
  };
  choice_points: string[];
  safety_checks: string[];
  adaptation_options: string[];
}

export interface SessionStructure {
  opening: SessionElement;
  main_practice: SessionElement;
  integration: SessionElement;
  closing: SessionElement;
  optional_elements: SessionElement[];
}

export interface SessionElement {
  name: string;
  purpose: string;
  duration_minutes: number;
  trauma_considerations: string[];
  adaptation_options: string[];
}

export interface HomeworkPractice {
  name: string;
  frequency: string;
  duration_minutes: number;
  neural_focus: string;
  trauma_adaptations: string[];
  success_metrics: string[];
}

export interface TraumaProgressIndicator {
  domain: 'safety' | 'regulation' | 'integration' | 'connection' | 'empowerment';
  indicator: string;
  measurement_method: string;
  trauma_sensitive_approach: string;
  celebration_approach: string;
}

export interface RedFlagIndicator {
  warning_sign: string;
  immediate_response: string;
  follow_up_action: string;
  professional_consultation_trigger: boolean;
}

export interface AdaptationProtocol {
  trigger_condition: string;
  assessment_questions: string[];
  adaptation_options: string[];
  implementation_guidance: string;
  return_criteria: string;
}

export interface CrisisSupportPlan {
  early_warning_signs: string[];
  immediate_resources: string[];
  professional_contacts: string[];
  peer_support_options: string[];
  self_care_protocols: string[];
}

export class TraumaInformedInterventionEngine {
  
  /**
   * Create a personalized intervention plan based on trauma profile
   */
  static createPersonalizedPlan(
    trauma_profile: TraumaProfile,
    current_goals: {
      primary_goal: string;
      secondary_goals: string[];
      timeline_preference: string;
      intensity_preference: 'gentle' | 'moderate' | 'intensive';
    },
    resources: {
      time_available: number; // minutes per day
      support_available: boolean;
      crisis_resources_identified: boolean;
      professional_support: boolean;
    }
  ): {
    recommended_interventions: TraumaInformedIntervention[];
    implementation_sequence: string[];
    safety_plan: CrisisSupportPlan;
    progress_tracking_plan: TraumaProgressIndicator[];
    personalization_rationale: string[];
  } {
    
    const interventions = this.selectInterventions(trauma_profile, current_goals);
    const sequence = this.createImplementationSequence(interventions, trauma_profile);
    const safety_plan = this.createSafetyPlan(trauma_profile, resources);
    
    return {
      recommended_interventions: interventions,
      implementation_sequence: sequence,
      safety_plan,
      progress_tracking_plan: this.createProgressPlan(trauma_profile, interventions),
      personalization_rationale: this.generateRationale(trauma_profile, interventions)
    };
  }
  
  /**
   * Get trauma-specific neuroplasticity interventions
   */
  static getTraumaSpecificInterventions(): {
    developmental_trauma: TraumaInformedIntervention;
    shock_trauma: TraumaInformedIntervention;
    complex_trauma: TraumaInformedIntervention;
    betrayal_trauma: TraumaInformedIntervention;
    systemic_trauma: TraumaInformedIntervention;
  } {
    return {
      developmental_trauma: this.createDevelopmentalTraumaIntervention(),
      shock_trauma: this.createShockTraumaIntervention(),
      complex_trauma: this.createComplexTraumaIntervention(),
      betrayal_trauma: this.createBetrayalTraumaIntervention(),
      systemic_trauma: this.createSystemicTraumaIntervention()
    };
  }
  
  /**
   * Adapt intervention in real-time based on current state
   */
  static adaptInterventionToCurrentState(
    intervention: TraumaInformedIntervention,
    current_state: {
      nervous_system_state: string;
      typeof window !== 'undefined' && window_of_tolerance_position: 'within' | 'hyperarousal' | 'hypoarousal';
      trigger_level: number; // 0-10
      support_availability: boolean;
      time_pressure: boolean;
    }
  ): {
    adapted_practice: PhasePractice;
    safety_modifications: string[];
    choice_points: ChoiceElement[];
    early_exit_strategies: string[];
    celebration_approach: string;
  } {
    
    const current_phase = this.getCurrentPhase(intervention, current_state);
    const adapted_practice = this.adaptPracticeToState(current_phase.practices[0], current_state);
    
    return {
      adapted_practice,
      safety_modifications: this.generateSafetyModifications(current_state),
      choice_points: this.enhanceChoicePoints(intervention.choice_and_agency_elements, current_state),
      early_exit_strategies: this.createEarlyExitStrategies(current_state),
      celebration_approach: this.determineCelebrationApproach(current_state)
    };
  }
  
  // Private implementation methods
  private static selectInterventions(
    profile: TraumaProfile,
    goals: any
  ): TraumaInformedIntervention[] {
    
    const interventions = this.getTraumaSpecificInterventions();
    const selected: TraumaInformedIntervention[] = [];
    
    // Select based on primary trauma pattern
    switch (profile.primary_trauma_pattern) {
      case 'developmental':
        selected.push(interventions.developmental_trauma);
        break;
      case 'shock':
        selected.push(interventions.shock_trauma);
        break;
      case 'complex':
        selected.push(interventions.complex_trauma);
        break;
      case 'betrayal':
        selected.push(interventions.betrayal_trauma);
        break;
      case 'systemic':
        selected.push(interventions.systemic_trauma);
        break;
    }
    
    return selected;
  }
  
  private static createDevelopmentalTraumaIntervention(): TraumaInformedIntervention {
    return {
      id: 'developmental_trauma_intervention',
      name: 'Developmental Repair and Neural Integration',
      description: 'Supports the development of neural circuits that were disrupted by early trauma',
      target_trauma_types: ['developmental', 'complex'],
      neural_targets: [
        {
          brain_region: 'Prefrontal Cortex',
          function: 'Executive functioning and emotional regulation',
          trauma_impact: 'Underdevelopment due to chronic stress',
          healing_approach: 'Gentle strengthening through consistent, safe practices',
          expected_timeline: '3-6 months for initial changes'
        },
        {
          brain_region: 'Hippocampus',
          function: 'Memory formation and learning',
          trauma_impact: 'Impaired development from chronic cortisol',
          healing_approach: 'Neurogenesis through learning and positive experiences',
          expected_timeline: '2-4 months for measureable growth'
        }
      ],
      neuroplasticity_approach: 'bottom_up',
      safety_considerations: [
        {
          risk_factor: 'Re-traumatization from pushing too hard',
          warning_signs: ['Dissociation', 'Emotional overwhelm', 'Physical shutdown'],
          prevention_strategies: ['Micro-dosing practices', 'Constant choice', 'Body awareness'],
          response_plan: 'Immediate grounding and safety restoration'
        }
      ],
      titration_guidelines: [
        {
          principle: 'Smallest possible dose',
          implementation: 'Start with 30-second practices',
          signs_of_overwhelm: ['Spacing out', 'Agitation', 'Numbness'],
          adjustment_strategy: 'Reduce duration or intensity immediately'
        }
      ],
      choice_and_agency_elements: [
        {
          moment: 'Practice beginning',
          choices_offered: ['Full practice', 'Shortened practice', 'Just breathing', 'Skip today'],
          autonomy_support: 'Your choice is always the right choice',
          opt_out_strategy: 'Honor your wisdom and try again tomorrow'
        }
      ],
      phases: [
        {
          name: 'Safety and Stabilization',
          focus: 'Building basic regulation and safety',
          duration_range: '4-8 weeks',
          prerequisites: ['Crisis safety plan', 'Basic grounding skills'],
          practices: [
            {
              name: 'Micro-Mindfulness',
              type: 'daily',
              duration: 1, // 1 minute
              neural_focus: 'Prefrontal cortex strengthening',
              trauma_adaptations: ['Ultra-short duration', 'Eyes open option', 'Movement allowed'],
              practice_steps: [
                {
                  order: 1,
                  name: 'Arrival',
                  instruction: 'Notice you are here, in this moment',
                  neural_effect: 'Activates present-moment awareness',
                  trauma_modifications: {
                    developmental: 'Emphasize safety of the present moment'
                  },
                  choice_points: ['Continue or stop here'],
                  safety_checks: ['Am I feeling safe in my body?'],
                  adaptation_options: ['Shorter duration', 'Eyes open', 'Move if needed']
                }
              ]
            }
          ],
          completion_indicators: ['Can practice without overwhelm', 'Some body awareness developing']
        }
      ],
      session_structure: {
        opening: {
          name: 'Safety Check',
          purpose: 'Establish current safety and capacity',
          duration_minutes: 2,
          trauma_considerations: ['Non-judgmental assessment', 'Permission to modify'],
          adaptation_options: ['Skip if triggering', 'Verbal or somatic check']
        },
        main_practice: {
          name: 'Titrated Neuroplasticity Practice',
          purpose: 'Gentle neural strengthening',
          duration_minutes: 5,
          trauma_considerations: ['Constant choice', 'Micro-movements allowed'],
          adaptation_options: ['Shorten significantly', 'Change modality', 'Partner support']
        },
        integration: {
          name: 'Gentle Integration',
          purpose: 'Help nervous system integrate changes',
          duration_minutes: 2,
          trauma_considerations: ['No forced processing', 'Movement encouraged'],
          adaptation_options: ['Skip if overwhelming', 'Journal instead', 'Art expression']
        },
        closing: {
          name: 'Appreciation',
          purpose: 'Acknowledge courage and effort',
          duration_minutes: 1,
          trauma_considerations: ['No shame for modifications', 'Celebrate any attempt'],
          adaptation_options: ['Silent appreciation', 'Self-touch', 'Verbal affirmation']
        },
        optional_elements: []
      },
      homework_practices: [
        {
          name: 'Daily Micro-Moments',
          frequency: 'Multiple times daily',
          duration_minutes: 0.5,
          neural_focus: 'Strengthening present-moment awareness',
          trauma_adaptations: ['No formal structure required', 'Use throughout day'],
          success_metrics: ['Increased body awareness', 'Faster regulation recovery']
        }
      ],
      progress_indicators: [
        {
          domain: 'safety',
          indicator: 'Increased sense of internal safety',
          measurement_method: 'Weekly self-report scale',
          trauma_sensitive_approach: 'No pressure for linear progress',
          celebration_approach: 'Honor all improvements, however small'
        }
      ],
      red_flag_indicators: [
        {
          warning_sign: 'Increasing dissociation or numbness',
          immediate_response: 'Stop practice and ground in present',
          follow_up_action: 'Reduce intensity and increase safety',
          professional_consultation_trigger: true
        }
      ],
      adaptation_protocols: [
        {
          trigger_condition: 'Overwhelm or dysregulation during practice',
          assessment_questions: ['What does your body need right now?', 'How can we make this safer?'],
          adaptation_options: ['Stop completely', 'Reduce duration', 'Change to movement'],
          implementation_guidance: 'Follow the body\'s wisdom above all protocols',
          return_criteria: 'When nervous system feels settled and curious'
        }
      ],
      daily_life_integration: [
        'Use micro-practices during daily activities',
        'Apply grounding techniques when triggered',
        'Practice choice-making in low-stakes situations'
      ],
      relational_integration: [
        'Share progress with trusted supports',
        'Practice boundary-setting in relationships',
        'Use co-regulation when available'
      ],
      crisis_support_plan: {
        early_warning_signs: ['Increasing numbness', 'Overwhelming emotions', 'Suicidal thoughts'],
        immediate_resources: ['Crisis hotline numbers', 'Trusted person contacts'],
        professional_contacts: ['Therapist', 'Psychiatrist', 'Emergency services'],
        peer_support_options: ['Support group', 'Trusted friends', 'Online communities'],
        self_care_protocols: ['Grounding techniques', 'Comfort items', 'Safe space creation']
      }
    };
  }
  
  // Additional trauma-specific interventions would be implemented similarly...
  private static createShockTraumaIntervention(): TraumaInformedIntervention {
    // Implementation for shock trauma - focused on titration and pendulation
    return {
      id: 'shock_trauma_intervention',
      name: 'Shock Trauma Integration and Nervous System Regulation',
      description: 'Supports the completion of thwarted defensive responses and nervous system regulation',
      target_trauma_types: ['shock', 'medical'],
      neural_targets: [],
      neuroplasticity_approach: 'bottom_up',
      safety_considerations: [],
      titration_guidelines: [],
      choice_and_agency_elements: [],
      phases: [],
      session_structure: {} as SessionStructure,
      homework_practices: [],
      progress_indicators: [],
      red_flag_indicators: [],
      adaptation_protocols: [],
      daily_life_integration: [],
      relational_integration: [],
      crisis_support_plan: {} as CrisisSupportPlan
    };
  }
  
  private static createComplexTraumaIntervention(): TraumaInformedIntervention {
    // Implementation for complex trauma - focused on safety, regulation, and integration
    return {
      id: 'complex_trauma_intervention',
      name: 'Complex Trauma Healing and Neural Integration',
      description: 'Comprehensive approach to healing from complex developmental trauma',
      target_trauma_types: ['complex', 'developmental'],
      neural_targets: [],
      neuroplasticity_approach: 'integrated',
      safety_considerations: [],
      titration_guidelines: [],
      choice_and_agency_elements: [],
      phases: [],
      session_structure: {} as SessionStructure,
      homework_practices: [],
      progress_indicators: [],
      red_flag_indicators: [],
      adaptation_protocols: [],
      daily_life_integration: [],
      relational_integration: [],
      crisis_support_plan: {} as CrisisSupportPlan
    };
  }
  
  private static createBetrayalTraumaIntervention(): TraumaInformedIntervention {
    // Implementation for betrayal trauma - focused on trust rebuilding
    return {
      id: 'betrayal_trauma_intervention',
      name: 'Betrayal Trauma Recovery and Trust Restoration',
      description: 'Specialized approach for healing from betrayal by trusted figures',
      target_trauma_types: ['betrayal'],
      neural_targets: [],
      neuroplasticity_approach: 'integrated',
      safety_considerations: [],
      titration_guidelines: [],
      choice_and_agency_elements: [],
      phases: [],
      session_structure: {} as SessionStructure,
      homework_practices: [],
      progress_indicators: [],
      red_flag_indicators: [],
      adaptation_protocols: [],
      daily_life_integration: [],
      relational_integration: [],
      crisis_support_plan: {} as CrisisSupportPlan
    };
  }
  
  private static createSystemicTraumaIntervention(): TraumaInformedIntervention {
    // Implementation for systemic trauma - focused on empowerment and collective healing
    return {
      id: 'systemic_trauma_intervention',
      name: 'Systemic Trauma Healing and Empowerment',
      description: 'Addresses trauma from systemic oppression and collective healing',
      target_trauma_types: ['systemic', 'collective'],
      neural_targets: [],
      neuroplasticity_approach: 'integrated',
      safety_considerations: [],
      titration_guidelines: [],
      choice_and_agency_elements: [],
      phases: [],
      session_structure: {} as SessionStructure,
      homework_practices: [],
      progress_indicators: [],
      red_flag_indicators: [],
      adaptation_protocols: [],
      daily_life_integration: [],
      relational_integration: [],
      crisis_support_plan: {} as CrisisSupportPlan
    };
  }
  
  private static createImplementationSequence(
    interventions: TraumaInformedIntervention[],
    profile: TraumaProfile
  ): string[] {
    return [
      'Safety and stabilization phase',
      'Basic regulation skills',
      'Gradual exposure and integration',
      'Relational healing',
      'Post-traumatic growth'
    ];
  }
  
  private static createSafetyPlan(
    profile: TraumaProfile,
    resources: any
  ): CrisisSupportPlan {
    return {
      early_warning_signs: profile.typical_responses.map(r => r.body_sensations).flat(),
      immediate_resources: ['Grounding techniques', 'Safe person contact'],
      professional_contacts: resources.professional_support ? ['Therapist contact'] : [],
      peer_support_options: ['Support group', 'Crisis text line'],
      self_care_protocols: profile.existing_coping_strategies.map(s => s.strategy)
    };
  }
  
  private static createProgressPlan(
    profile: TraumaProfile,
    interventions: TraumaInformedIntervention[]
  ): TraumaProgressIndicator[] {
    return interventions.map(i => i.progress_indicators).flat();
  }
  
  private static generateRationale(
    profile: TraumaProfile,
    interventions: TraumaInformedIntervention[]
  ): string[] {
    return [
      `Selected interventions based on ${profile.primary_trauma_pattern} trauma pattern`,
      `Adapted for ${profile.body_relationship} body relationship`,
      `Honors ${profile.attachment_style} attachment style`,
      `Incorporates preferred modalities: ${profile.preferred_modalities.map(m => m.type).join(', ')}`
    ];
  }
  
  private static getCurrentPhase(
    intervention: TraumaInformedIntervention,
    current_state: any
  ): InterventionPhase {
    return intervention.phases[0]; // Simplified - would use actual phase logic
  }
  
  private static adaptPracticeToState(
    practice: PhasePractice,
    current_state: any
  ): PhasePractice {
    if (current_state.typeof window !== 'undefined' && window_of_tolerance_position !== 'within') {
      return {
        ...practice,
        duration: Math.floor(practice.duration / 2),
        trauma_adaptations: [...practice.trauma_adaptations, 'Shortened for current state']
      };
    }
    return practice;
  }
  
  private static generateSafetyModifications(current_state: any): string[] {
    const modifications = ['Maintain choice and agency'];
    
    if (current_state.trigger_level > 7) {
      modifications.push('Focus on grounding and safety');
    }
    
    if (!current_state.support_availability) {
      modifications.push('Ensure self-support resources available');
    }
    
    return modifications;
  }
  
  private static enhanceChoicePoints(
    existing_choices: ChoiceElement[],
    current_state: any
  ): ChoiceElement[] {
    return existing_choices.map(choice => ({
      ...choice,
      choices_offered: [...choice.choices_offered, 'Stop and ground', 'Get support']
    }));
  }
  
  private static createEarlyExitStrategies(current_state: any): string[] {
    return [
      'Stop immediately if overwhelm occurs',
      'Return to grounding techniques',
      'Connect with support person if needed',
      'Use your established safety protocols'
    ];
  }
  
  private static determineCelebrationApproach(current_state: any): string {
    if (current_state.typeof window !== 'undefined' && window_of_tolerance_position !== 'within') {
      return 'Gentle acknowledgment of courage in participating despite challenges';
    }
    return 'Warm celebration of neural growth and healing progress';
  }
}