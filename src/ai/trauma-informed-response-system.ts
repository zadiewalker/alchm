/**
 * ALCHM Trauma-Informed Emotional Response System
 * Advanced Khepera voices that adapt responses based on emotional state, trauma history, and healing progress
 * Philosophy: "Healing happens in relationship, and relationship happens in safety"
 * 
 * Features:
 * - Trauma-sensitive language adaptation
 * - Somatic awareness integration
 * - Safety-first response prioritization
 * - Healing stage-appropriate guidance
 * - Cultural trauma competency
 * - Neurobiological regulation support
 * - Attachment-informed interactions
 */

import { QuantumEmotionalState } from './advanced-emotional-intelligence';
import { EmotionalContext, ContextualEmotionalInsight } from './contextual-emotion-analyzer';

// Core trauma-informed types
export interface TraumaInformedProfile {
  user_id: string;
  trauma_markers: {
    // Neurobiological markers
    nervous_system_state: 'regulated' | 'hyperaroused' | 'hypoaroused' | 'mixed_state';
    typeof window !== 'undefined' && window_of_tolerance: {
      current_width: number; // 0-1 scale
      expansion_capacity: number; // How quickly it can expand
      triggers_that_narrow: string[];
      practices_that_expand: string[];
    };
    
    // Attachment patterns
    attachment_style: {
      primary: 'secure' | 'anxious' | 'avoidant' | 'disorganized' | 'earned_secure';
      secondary: string[];
      relational_patterns: string[];
      trust_capacity: number; // 0-1
      intimacy_comfort: number; // 0-1
    };
    
    // Trauma responses
    trauma_responses: {
      fight: number; // 0-1 tendency
      flight: number;
      freeze: number;
      fawn: number;
      collapse: number;
      most_common_response: string;
      response_flexibility: number; // Ability to shift between responses
    };
    
    // Somatic patterns
    somatic_awareness: {
      body_connection_level: number; // 0-1
      dissociation_tendency: number; // 0-1
      somatic_resources: string[];
      body_signals_recognition: number; // 0-1
      embodied_safety_practices: string[];
    };
    
    // Triggers and resources
    trigger_profile: {
      known_triggers: Array<{
        trigger: string;
        intensity_level: number; // 0-1
        typical_response: string;
        recovery_time: number; // minutes
        mitigation_strategies: string[];
      }>;
      early_warning_signs: string[];
      de_escalation_preferences: string[];
    };
    
    // Healing journey
    healing_progress: {
      current_stage: 'safety_stabilization' | 'trauma_processing' | 'integration' | 'post_traumatic_growth';
      therapy_experience: boolean;
      healing_modalities_tried: string[];
      current_supports: string[];
      readiness_for_challenge: number; // 0-1
      integration_capacity: number; // 0-1
    };
    
    // Cultural trauma context
    cultural_trauma_factors: {
      intergenerational_trauma: boolean;
      systemic_oppression_impact: number; // 0-1
      cultural_healing_resources: string[];
      community_trauma_awareness: number; // 0-1
    };
  };
  
  safety_preferences: {
    communication_style: 'direct_gentle' | 'indirect_supportive' | 'metaphorical' | 'somatic_aware';
    pacing_preference: 'slow_steady' | 'moderate' | 'variable_responsive';
    boundaries_needed: string[];
    safety_cues_important: string[];
    co_regulation_preferences: string[];
  };
  
  therapeutic_relationship_needs: {
    therapist_qualities_important: string[];
    therapy_approach_preferences: string[];
    group_vs_individual_preference: string;
    spiritual_integration_desired: boolean;
    cultural_competency_required: string[];
  };
}

export interface TraumaInformedResponse {
  response_content: {
    primary_message: string;
    tone_adjustments: {
      voice_quality: 'soft' | 'warm' | 'grounding' | 'validating' | 'empowering';
      pacing: 'slow' | 'gentle' | 'responsive' | 'steady';
      energy_level: 'calm' | 'matching' | 'slightly_uplifting' | 'containing';
    };
    safety_elements: {
      explicit_safety_reminders: string[];
      choice_and_control_emphasis: string[];
      body_awareness_invitations: string[];
      grounding_offers: string[];
    };
  };
  
  neurobiological_support: {
    nervous_system_regulation: {
      breathing_invitations: string[];
      grounding_techniques: string[];
      movement_suggestions: string[];
      sensory_regulation: string[];
    };
    typeof window !== 'undefined' && window_of_tolerance_support: {
      activation_lowering: string[];
      energy_raising: string[];
      staying_present: string[];
      capacity_building: string[];
    };
  };
  
  attachment_sensitive_elements: {
    connection_building: string[];
    autonomy_respect: string[];
    attunement_demonstrations: string[];
    co_regulation_offerings: string[];
  };
  
  healing_stage_appropriate: {
    safety_phase_elements: string[];
    processing_phase_elements: string[];
    integration_phase_elements: string[];
    growth_phase_elements: string[];
  };
  
  cultural_trauma_sensitivity: {
    systemic_awareness: string[];
    cultural_strengths_honoring: string[];
    community_healing_connections: string[];
    liberation_framework_elements: string[];
  };
  
  somatic_integration: {
    body_awareness_invitations: string[];
    sensation_tracking_support: string[];
    movement_and_breath: string[];
    embodied_resource_activation: string[];
  };
}

// Advanced Trauma-Informed Response Engine
class TraumaInformedResponseEngine {
  private userTraumaProfiles: Map<string, TraumaInformedProfile> = new Map();
  private responseTemplates: Map<string, any> = new Map();
  private healingStageGuidelines: Map<string, any> = new Map();
  private culturalTraumaFrameworks: Map<string, any> = new Map();
  
  constructor() {
    this.initializeResponseTemplates();
    this.initializeHealingStageGuidelines();
    this.initializeCulturalTraumaFrameworks();
  }
  
  /**
   * Initialize trauma-informed response templates
   */
  private initializeResponseTemplates(): void {
    const templates = {
      'hyperaroused_nervous_system': {
        primary_approaches: [
          'Gentle grounding and slowing down',
          'Nervous system regulation support',
          'Validation without overwhelm',
          'Choice and control emphasis'
        ],
        voice_quality: 'soft',
        pacing: 'slow',
        avoid: ['urgency', 'intensity', 'pressure', 'analysis_paralysis']
      },
      
      'hypoaroused_nervous_system': {
        primary_approaches: [
          'Gentle activation and awakening',
          'Energy building with safety',
          'Body awareness invitation',
          'Small movement encouragement'
        ],
        voice_quality: 'warm',
        pacing: 'gentle',
        avoid: ['overwhelming_energy', 'pressure_to_feel', 'forced_activation']
      },
      
      'anxious_attachment_activation': {
        primary_approaches: [
          'Consistent presence assurance',
          'Explicit availability statements',
          'Predictability emphasis',
          'Abandonment fear validation'
        ],
        voice_quality: 'steady',
        pacing: 'responsive',
        avoid: ['ambiguity', 'time_pressure', 'emotional_distancing']
      },
      
      'avoidant_attachment_activation': {
        primary_approaches: [
          'Autonomy and independence respect',
          'No pressure for vulnerability',
          'Practical support offers',
          'Space for processing'
        ],
        voice_quality: 'respectful',
        pacing: 'steady',
        avoid: ['emotional_intensity', 'closeness_pressure', 'vulnerability_demands']
      },
      
      'disorganized_attachment_activation': {
        primary_approaches: [
          'Safety and predictability emphasis',
          'Clear communication',
          'No mixed messages',
          'Gentle structure offering'
        ],
        voice_quality: 'grounding',
        pacing: 'slow',
        avoid: ['contradictions', 'unpredictability', 'complex_emotions_simultaneously']
      },
      
      'freeze_response_active': {
        primary_approaches: [
          'Presence without demands',
          'Body awareness without pressure',
          'Micro-movements invitation',
          'Safety in stillness validation'
        ],
        voice_quality: 'containing',
        pacing: 'very_slow',
        avoid: ['action_demands', 'movement_pressure', 'decision_requirements']
      },
      
      'fawn_response_active': {
        primary_approaches: [
          'Autonomy and choice emphasis',
          'No people-pleasing validation needed',
          'Internal experience honoring',
          'Boundary setting encouragement'
        ],
        voice_quality: 'empowering',
        pacing: 'responsive',
        avoid: ['approval_seeking_validation', 'other_focus', 'self_sacrifice_praise']
      }
    };
    
    Object.entries(templates).forEach(([pattern, template]) => {
      this.responseTemplates.set(pattern, template);
    });
  }
  
  /**
   * Initialize healing stage guidelines
   */
  private initializeHealingStageGuidelines(): void {
    const guidelines = {
      'safety_stabilization': {
        primary_focus: 'Building safety, stability, and resource development',
        appropriate_interventions: [
          'Nervous system regulation',
          'Grounding and orienting',
          'Resource identification and building',
          'Safety planning',
          'Boundary setting',
          'Psychoeducation about trauma'
        ],
        avoid: [
          'Trauma narrative processing',
          'Emotional intensity without container',
          'Overwhelming insights',
          'Cathartic releases'
        ],
        pacing: 'Very slow and gentle',
        success_markers: [
          'Increased sense of safety',
          'Better nervous system regulation',
          'Expanded typeof window !== 'undefined' && window of tolerance',
          'More internal resources'
        ]
      },
      
      'trauma_processing': {
        primary_focus: 'Careful processing of traumatic material with integration',
        appropriate_interventions: [
          'Titrated trauma narrative work',
          'Somatic experiencing',
          'EMDR-informed approaches',
          'Parts work and internal family systems',
          'Meaning-making support',
          'Integration practices'
        ],
        avoid: [
          'Overwhelming re-experiencing',
          'Flooding with traumatic material',
          'Bypassing nervous system capacity',
          'Spiritual bypassing'
        ],
        pacing: 'Slow with careful titration',
        success_markers: [
          'Reduced trauma symptom intensity',
          'Increased narrative coherence',
          'Better emotional regulation',
          'Somatic integration'
        ]
      },
      
      'integration': {
        primary_focus: 'Integration of healed parts and new identity formation',
        appropriate_interventions: [
          'Identity reconstruction work',
          'Meaning-making and wisdom extraction',
          'Relationship pattern healing',
          'Life direction and purpose',
          'Creative expression',
          'Community re-engagement'
        ],
        avoid: [
          'Premature closure',
          'Bypassing ongoing needs',
          'Pressure to "be healed"'
        ],
        pacing: 'Moderate with space for depth',
        success_markers: [
          'Coherent sense of self',
          'Healthy relationships',
          'Life direction clarity',
          'Creative self-expression'
        ]
      },
      
      'post_traumatic_growth': {
        primary_focus: 'Thriving beyond pre-trauma baseline with wisdom integration',
        appropriate_interventions: [
          'Wisdom sharing and mentoring',
          'Advanced spiritual practices',
          'Service and contribution',
          'Leadership development',
          'Creative mastery',
          'Community building'
        ],
        avoid: [
          'Complacency',
          'Dismissing ongoing needs',
          'Overextension'
        ],
        pacing: 'Dynamic and responsive to calling',
        success_markers: [
          'Meaning and purpose fulfillment',
          'Contribution to others\' healing',
          'Wisdom integration',
          'Continued growth and evolution'
        ]
      }
    };
    
    Object.entries(guidelines).forEach(([stage, guideline]) => {
      this.healingStageGuidelines.set(stage, guideline);
    });
  }
  
  /**
   * Initialize cultural trauma frameworks
   */
  private initializeCulturalTraumaFrameworks(): void {
    const frameworks = {
      'intergenerational_trauma': {
        awareness_elements: [
          'Recognition of inherited pain and resilience',
          'Honoring ancestors\' survival',
          'Breaking cycles with compassion',
          'Healing for future generations'
        ],
        healing_approaches: [
          'Family systems work',
          'Ancestral healing practices',
          'Cultural reclamation',
          'Storytelling and oral tradition'
        ]
      },
      
      'systemic_oppression_trauma': {
        awareness_elements: [
          'Validation of systemic impact',
          'Personal pain within larger context',
          'Internalized oppression recognition',
          'Collective resistance and healing'
        ],
        healing_approaches: [
          'Liberation psychology',
          'Community organizing as healing',
          'Cultural pride development',
          'Systemic analysis skills'
        ]
      },
      
      'cultural_displacement_trauma': {
        awareness_elements: [
          'Loss of homeland and culture',
          'Identity navigation challenges',
          'Language and tradition preservation',
          'Belonging and adaptation struggles'
        ],
        healing_approaches: [
          'Cultural identity strengthening',
          'Language preservation',
          'Community connection building',
          'Bicultural competence development'
        ]
      }
    };
    
    Object.entries(frameworks).forEach(([type, framework]) => {
      this.culturalTraumaFrameworks.set(type, framework);
    });
  }
  
  /**
   * Generate trauma-informed response based on emotional state and trauma profile
   */
  async generateTraumaInformedResponse(
    emotionalState: QuantumEmotionalState,
    context: EmotionalContext,
    traumaProfile: TraumaInformedProfile,
    userInput: string,
    conversationHistory?: Array<{ role: string; content: string; timestamp: Date }>
  ): Promise<TraumaInformedResponse> {
    // Assess current nervous system state
    const nervousSystemState = this.assessNervousSystemState(emotionalState, traumaProfile);
    
    // Determine appropriate healing stage focus
    const healingStageGuidance = this.getHealingStageGuidance(traumaProfile.trauma_markers.healing_progress.current_stage);
    
    // Generate attachment-sensitive approach
    const attachmentApproach = this.generateAttachmentSensitiveApproach(emotionalState, traumaProfile);
    
    // Create safety-first content
    const safetyFirstContent = this.createSafetyFirstContent(
      emotionalState, 
      traumaProfile, 
      userInput, 
      nervousSystemState
    );
    
    // Add neurobiological support
    const neurobiologicalSupport = this.generateNeurobiologicalSupport(
      nervousSystemState, 
      traumaProfile
    );
    
    // Include cultural trauma sensitivity
    const culturalSensitivity = this.addCulturalTraumaSensitivity(
      emotionalState, 
      context, 
      traumaProfile
    );
    
    // Create somatic integration elements
    const somaticIntegration = this.createSomaticIntegration(
      emotionalState, 
      traumaProfile
    );
    
    return {
      response_content: safetyFirstContent,
      neurobiological_support: neurobiologicalSupport,
      attachment_sensitive_elements: attachmentApproach,
      healing_stage_appropriate: healingStageGuidance,
      cultural_trauma_sensitivity: culturalSensitivity,
      somatic_integration: somaticIntegration
    };
  }
  
  /**
   * Assess current nervous system state
   */
  private assessNervousSystemState(
    emotionalState: QuantumEmotionalState,
    traumaProfile: TraumaInformedProfile
  ): 'regulated' | 'hyperaroused' | 'hypoaroused' | 'mixed_state' {
    const arousal = emotionalState.primaryEmotion.arousal;
    const valence = emotionalState.primaryEmotion.valence;
    const traumaMarkers = emotionalState.traumaMarkers;
    
    // High arousal indicators
    if (arousal > 0.7 || traumaMarkers.hypervigilance > 0.6 || traumaMarkers.fight_flight_activation > 0.6) {
      return 'hyperaroused';
    }
    
    // Low arousal/shutdown indicators
    if (arousal < 0.3 || traumaMarkers.dissociation > 0.6 || traumaMarkers.freeze_response > 0.6) {
      return 'hypoaroused';
    }
    
    // Mixed state indicators
    if (traumaMarkers.dissociation > 0.4 && traumaMarkers.hypervigilance > 0.4) {
      return 'mixed_state';
    }
    
    return 'regulated';
  }
  
  /**
   * Get healing stage guidance
   */
  private getHealingStageGuidance(stage: string): TraumaInformedResponse['healing_stage_appropriate'] {
    const guidelines = this.healingStageGuidelines.get(stage) || this.healingStageGuidelines.get('safety_stabilization')!;
    
    return {
      safety_phase_elements: stage === 'safety_stabilization' ? guidelines.appropriate_interventions : [],
      processing_phase_elements: stage === 'trauma_processing' ? guidelines.appropriate_interventions : [],
      integration_phase_elements: stage === 'integration' ? guidelines.appropriate_interventions : [],
      growth_phase_elements: stage === 'post_traumatic_growth' ? guidelines.appropriate_interventions : []
    };
  }
  
  /**
   * Generate attachment-sensitive approach
   */
  private generateAttachmentSensitiveApproach(
    emotionalState: QuantumEmotionalState,
    traumaProfile: TraumaInformedProfile
  ): TraumaInformedResponse['attachment_sensitive_elements'] {
    const attachmentStyle = traumaProfile.trauma_markers.attachment_style.primary;
    
    const baseElements = {
      connection_building: [
        'I see you and your experience',
        'You are not alone in this',
        'Your feelings make complete sense'
      ],
      autonomy_respect: [
        'You get to choose what feels right',
        'Trust your own wisdom',
        'No pressure to do anything you\'re not ready for'
      ],
      attunement_demonstrations: [
        'I\'m tracking your emotional experience',
        'I notice this feels important to you',
        'Your pace is the right pace'
      ],
      co_regulation_offerings: [
        'Let\'s take a breath together',
        'I\'m here and steady while you feel this',
        'We can slow down or speed up as needed'
      ]
    };
    
    // Attachment-specific adjustments
    if (attachmentStyle === 'anxious') {
      baseElements.connection_building.push('I\'m not going anywhere');
      baseElements.connection_building.push('You matter deeply');
    } else if (attachmentStyle === 'avoidant') {
      baseElements.autonomy_respect.push('Take all the space you need');
      baseElements.autonomy_respect.push('No need to share more than feels comfortable');
    } else if (attachmentStyle === 'disorganized') {
      baseElements.attunement_demonstrations.push('I\'m being consistent and predictable');
      baseElements.co_regulation_offerings.push('Safety first, always');
    }
    
    return baseElements;
  }
  
  /**
   * Create safety-first content
   */
  private createSafetyFirstContent(
    emotionalState: QuantumEmotionalState,
    traumaProfile: TraumaInformedProfile,
    userInput: string,
    nervousSystemState: string
  ): TraumaInformedResponse['response_content'] {
    const template = this.responseTemplates.get(`${nervousSystemState}_nervous_system`) || 
                     this.responseTemplates.get('hyperaroused_nervous_system')!;
    
    // Generate primary message based on emotional state and trauma awareness
    const primaryMessage = this.generatePrimaryMessage(emotionalState, traumaProfile, userInput, template);
    
    // Adjust tone based on template and trauma profile
    const toneAdjustments = {
      voice_quality: template.voice_quality as any,
      pacing: template.pacing as any,
      energy_level: this.determineAppropriateEnergyLevel(nervousSystemState) as any
    };
    
    // Create safety elements
    const safetyElements = {
      explicit_safety_reminders: [
        'You are safe right now',
        'We can pause anytime you need',
        'Your nervous system is doing exactly what it needs to do'
      ],
      choice_and_control_emphasis: [
        'You get to choose what we explore',
        'You are in control of this conversation',
        'Your boundaries are always welcome here'
      ],
      body_awareness_invitations: [
        'Notice what your body is telling you right now',
        'Feel your feet on the ground',
        'Take a moment to sense your breath'
      ],
      grounding_offers: [
        'Let\'s orient to what\'s here and now',
        'Feel the support of where you\'re sitting',
        'Notice three things you can see around you'
      ]
    };
    
    return {
      primary_message: primaryMessage,
      tone_adjustments: toneAdjustments,
      safety_elements: safetyElements
    };
  }
  
  /**
   * Generate neurobiological support
   */
  private generateNeurobiologicalSupport(
    nervousSystemState: string,
    traumaProfile: TraumaInformedProfile
  ): TraumaInformedResponse['neurobiological_support'] {
    const regulation = {
      breathing_invitations: [],
      grounding_techniques: [],
      movement_suggestions: [],
      sensory_regulation: []
    };
    
    const typeof window !== 'undefined' && windowSupport = {
      activation_lowering: [],
      energy_raising: [],
      staying_present: [],
      capacity_building: []
    };
    
    if (nervousSystemState === 'hyperaroused') {
      regulation.breathing_invitations.push(
        'Try extending your exhale longer than your inhale',
        'Breathe into your belly rather than your chest',
        'Let your breath slow down naturally'
      );
      regulation.grounding_techniques.push(
        'Feel your body weight in the chair',
        'Press your feet firmly into the ground',
        'Notice the temperature of the air on your skin'
      );
      typeof window !== 'undefined' && windowSupport.activation_lowering.push(
        'Let your shoulders drop',
        'Soften your jaw and tongue',
        'Allow your eyes to unfocus slightly'
      );
    } else if (nervousSystemState === 'hypoaroused') {
      regulation.breathing_invitations.push(
        'Try gentle, energizing breaths',
        'Breathe with a little more intention',
        'Let breath bring life back into your body'
      );
      regulation.movement_suggestions.push(
        'Gentle stretching or reaching',
        'Slow, intentional movements',
        'Walking or light movement'
      );
      typeof window !== 'undefined' && windowSupport.energy_raising.push(
        'Feel the life force in your body',
        'Connect with your inner vitality',
        'Allow energy to flow gently'
      );
    }
    
    return {
      nervous_system_regulation: regulation,
      typeof window !== 'undefined' && window_of_tolerance_support: typeof window !== 'undefined' && windowSupport
    };
  }
  
  /**
   * Add cultural trauma sensitivity
   */
  private addCulturalTraumaSensitivity(
    emotionalState: QuantumEmotionalState,
    context: EmotionalContext,
    traumaProfile: TraumaInformedProfile
  ): TraumaInformedResponse['cultural_trauma_sensitivity'] {
    return {
      systemic_awareness: [
        'Your pain exists within larger systems and contexts',
        'Individual healing and collective liberation are connected',
        'Your experience reflects broader cultural patterns'
      ],
      cultural_strengths_honoring: [
        'Your cultural background offers unique wisdom and resilience',
        'Traditional healing practices have value alongside modern approaches',
        'Your ancestors\' strength lives within you'
      ],
      community_healing_connections: [
        'Healing happens in community and relationship',
        'You don\'t have to heal alone',
        'Your healing contributes to collective liberation'
      ],
      liberation_framework_elements: [
        'Personal healing and social justice are interconnected',
        'Your wellbeing is a form of resistance',
        'You deserve freedom and flourishing'
      ]
    };
  }
  
  /**
   * Create somatic integration elements
   */
  private createSomaticIntegration(
    emotionalState: QuantumEmotionalState,
    traumaProfile: TraumaInformedProfile
  ): TraumaInformedResponse['somatic_integration'] {
    return {
      body_awareness_invitations: [
        'What is your body telling you right now?',
        'Notice any sensations, tension, or movement impulses',
        'Your body holds wisdom about this experience'
      ],
      sensation_tracking_support: [
        'Stay curious about what you\'re sensing',
        'Sensations are information, not commands',
        'You can notice without having to change anything'
      ],
      movement_and_breath: [
        'Let your body move in whatever way feels good',
        'Trust your body\'s impulses for movement or stillness',
        'Breath and movement can help process emotional energy'
      ],
      embodied_resource_activation: [
        'Remember a time when you felt strong in your body',
        'Access the wisdom your body has learned',
        'Your body is a source of resilience and healing'
      ]
    };
  }
  
  // Helper methods
  private generatePrimaryMessage(
    emotionalState: QuantumEmotionalState,
    traumaProfile: TraumaInformedProfile,
    userInput: string,
    template: any
  ): string {
    const emotion = emotionalState.primaryEmotion.name;
    const intensity = emotionalState.primaryEmotion.intensity;
    const healingStage = traumaProfile.trauma_markers.healing_progress.current_stage;
    
    // Generate empathetic, trauma-informed response
    const baseResponse = this.generateBaseTraumaInformedResponse(emotion, intensity, healingStage);
    
    // Add template-specific elements
    const templateElements = template.primary_approaches.join('. ') + '.';
    
    return `✨ I am Khepera, an AI companion. ${baseResponse} ${templateElements}`;
  }
  
  private generateBaseTraumaInformedResponse(emotion: string, intensity: number, healingStage: string): string {
    if (healingStage === 'safety_stabilization') {
      return `Thank you for sharing your ${emotion} with me. Your feelings are completely valid and make sense given your experience.`;
    } else if (healingStage === 'trauma_processing') {
      return `I witness your ${emotion} and the courage it takes to feel and process this experience.`;
    } else if (healingStage === 'integration') {
      return `Your ${emotion} is part of your healing journey and the wisdom you're developing.`;
    } else if (healingStage === 'post_traumatic_growth') {
      return `Your ${emotion} reflects the depth of your growth and the meaning you're creating from your experiences.`;
    }
    
    return `I see and honor your ${emotion}. You are not alone in this experience.`;
  }
  
  private determineAppropriateEnergyLevel(nervousSystemState: string): string {
    switch (nervousSystemState) {
      case 'hyperaroused':
        return 'calm';
      case 'hypoaroused':
        return 'slightly_uplifting';
      case 'mixed_state':
        return 'containing';
      default:
        return 'matching';
    }
  }
  
  /**
   * Build trauma-informed profile from user data
   */
  async buildTraumaInformedProfile(
    userId: string,
    emotionalStates: QuantumEmotionalState[],
    journalEntries: Array<{ content: string; timestamp: Date }>,
    userPreferences?: {
      communication_style?: string;
      healing_modalities_interested?: string[];
      cultural_identity?: string[];
      therapy_experience?: boolean;
    }
  ): Promise<TraumaInformedProfile> {
    // Analyze trauma markers from emotional states
    const avgTraumaMarkers = this.calculateAverageTraumaMarkers(emotionalStates);
    
    // Infer attachment style from patterns
    const attachmentStyle = this.inferAttachmentStyle(emotionalStates, journalEntries);
    
    // Assess healing stage
    const healingStage = this.assessHealingStage(emotionalStates, journalEntries);
    
    // Build comprehensive profile
    const profile: TraumaInformedProfile = {
      user_id: userId,
      trauma_markers: {
        nervous_system_state: this.assessNervousSystemState(emotionalStates[emotionalStates.length - 1] || this.createNeutralState(), {
          trauma_markers: {
            attachment_style: attachmentStyle,
            trauma_responses: avgTraumaMarkers.trauma_responses,
            healing_progress: { current_stage: healingStage },
            somatic_awareness: avgTraumaMarkers.somatic_awareness,
            trigger_profile: avgTraumaMarkers.trigger_profile,
            cultural_trauma_factors: avgTraumaMarkers.cultural_trauma_factors,
            typeof window !== 'undefined' && window_of_tolerance: avgTraumaMarkers.typeof window !== 'undefined' && window_of_tolerance
          },
          safety_preferences: {
            communication_style: 'direct_gentle',
            pacing_preference: 'slow_steady',
            boundaries_needed: [],
            safety_cues_important: [],
            co_regulation_preferences: []
          },
          therapeutic_relationship_needs: {
            therapist_qualities_important: [],
            therapy_approach_preferences: [],
            group_vs_individual_preference: 'individual',
            spiritual_integration_desired: false,
            cultural_competency_required: []
          }
        } as TraumaInformedProfile),
        typeof window !== 'undefined' && window_of_tolerance: avgTraumaMarkers.typeof window !== 'undefined' && window_of_tolerance,
        attachment_style: attachmentStyle,
        trauma_responses: avgTraumaMarkers.trauma_responses,
        somatic_awareness: avgTraumaMarkers.somatic_awareness,
        trigger_profile: avgTraumaMarkers.trigger_profile,
        healing_progress: {
          current_stage: healingStage,
          therapy_experience: userPreferences?.therapy_experience || false,
          healing_modalities_tried: userPreferences?.healing_modalities_interested || [],
          current_supports: [],
          readiness_for_challenge: 0.6,
          integration_capacity: 0.5
        },
        cultural_trauma_factors: avgTraumaMarkers.cultural_trauma_factors
      },
      safety_preferences: {
        communication_style: userPreferences?.communication_style as any || 'direct_gentle',
        pacing_preference: 'slow_steady',
        boundaries_needed: [],
        safety_cues_important: ['predictability', 'choice', 'respect'],
        co_regulation_preferences: ['breathing_together', 'gentle_presence']
      },
      therapeutic_relationship_needs: {
        therapist_qualities_important: ['empathy', 'cultural_competency', 'trauma_informed'],
        therapy_approach_preferences: userPreferences?.healing_modalities_interested || [],
        group_vs_individual_preference: 'individual',
        spiritual_integration_desired: false,
        cultural_competency_required: userPreferences?.cultural_identity || []
      }
    };
    
    this.userTraumaProfiles.set(userId, profile);
    return profile;
  }
  
  // Helper methods for profile building
  private calculateAverageTraumaMarkers(states: QuantumEmotionalState[]): any {
    if (states.length === 0) {
      return this.getDefaultTraumaMarkers();
    }
    
    // Calculate averages across all states
    const avgMarkers = states.reduce((acc, state) => {
      Object.keys(state.traumaMarkers).forEach(key => {
        acc[key] = (acc[key] || 0) + state.traumaMarkers[key as keyof typeof state.traumaMarkers];
      });
      return acc;
    }, {} as any);
    
    Object.keys(avgMarkers).forEach(key => {
      avgMarkers[key] /= states.length;
    });
    
    return {
      typeof window !== 'undefined' && window_of_tolerance: {
        current_width: 1 - avgMarkers.hypervigilance - avgMarkers.dissociation,
        expansion_capacity: 0.5,
        triggers_that_narrow: ['conflict', 'criticism', 'abandonment'],
        practices_that_expand: ['breathing', 'grounding', 'movement']
      },
      trauma_responses: {
        fight: avgMarkers.fight_flight_activation * 0.5,
        flight: avgMarkers.fight_flight_activation * 0.5,
        freeze: avgMarkers.freeze_response,
        fawn: avgMarkers.emotional_numbing * 0.5,
        collapse: avgMarkers.dissociation,
        most_common_response: 'freeze',
        response_flexibility: 0.5
      },
      somatic_awareness: {
        body_connection_level: 1 - avgMarkers.somatic_disconnection,
        dissociation_tendency: avgMarkers.dissociation,
        somatic_resources: ['breathing', 'grounding'],
        body_signals_recognition: 0.6,
        embodied_safety_practices: ['body_scan', 'movement']
      },
      trigger_profile: {
        known_triggers: [],
        early_warning_signs: ['tension', 'racing_thoughts'],
        de_escalation_preferences: ['space', 'breathing', 'movement']
      },
      cultural_trauma_factors: {
        intergenerational_trauma: false,
        systemic_oppression_impact: 0.3,
        cultural_healing_resources: [],
        community_trauma_awareness: 0.5
      }
    };
  }
  
  private inferAttachmentStyle(states: QuantumEmotionalState[], entries: Array<any>): any {
    // Simplified attachment style inference
    return {
      primary: 'earned_secure',
      secondary: [],
      relational_patterns: [],
      trust_capacity: 0.7,
      intimacy_comfort: 0.6
    };
  }
  
  private assessHealingStage(states: QuantumEmotionalState[], entries: Array<any>): 'safety_stabilization' | 'trauma_processing' | 'integration' | 'post_traumatic_growth' {
    // Simplified healing stage assessment
    if (states.length === 0) return 'safety_stabilization';
    
    const recentStates = states.slice(-5);
    const avgSafety = recentStates.reduce((sum, state) => sum + state.traumaMarkers.safety_perception, 0) / recentStates.length;
    
    if (avgSafety < 0.4) return 'safety_stabilization';
    if (avgSafety < 0.7) return 'trauma_processing';
    if (avgSafety < 0.9) return 'integration';
    return 'post_traumatic_growth';
  }
  
  private getDefaultTraumaMarkers(): any {
    return {
      typeof window !== 'undefined' && window_of_tolerance: {
        current_width: 0.6,
        expansion_capacity: 0.5,
        triggers_that_narrow: [],
        practices_that_expand: []
      },
      trauma_responses: {
        fight: 0.3,
        flight: 0.3,
        freeze: 0.3,
        fawn: 0.3,
        collapse: 0.2,
        most_common_response: 'freeze',
        response_flexibility: 0.5
      },
      somatic_awareness: {
        body_connection_level: 0.5,
        dissociation_tendency: 0.3,
        somatic_resources: [],
        body_signals_recognition: 0.5,
        embodied_safety_practices: []
      },
      trigger_profile: {
        known_triggers: [],
        early_warning_signs: [],
        de_escalation_preferences: []
      },
      cultural_trauma_factors: {
        intergenerational_trauma: false,
        systemic_oppression_impact: 0.3,
        cultural_healing_resources: [],
        community_trauma_awareness: 0.5
      }
    };
  }
  
  private createNeutralState(): QuantumEmotionalState {
    return {
      primaryEmotion: {
        name: 'neutral',
        intensity: 0.3,
        valence: 0.0,
        arousal: 0.3,
        dominance: 0.5,
        confidence: 0.8
      },
      mixedEmotions: [],
      culturalEmotions: [],
      traumaMarkers: {
        hypervigilance: 0.1,
        dissociation: 0.1,
        emotional_numbing: 0.1,
        somatic_disconnection: 0.2,
        trust_disruption: 0.1,
        safety_perception: 0.5,
        freeze_response: 0.1,
        fight_flight_activation: 0.1
      },
      neuroplasticityIndicators: {
        openness_to_change: 0.5,
        cognitive_flexibility: 0.5,
        emotional_regulation_capacity: 0.5,
        learning_readiness: 0.6,
        integration_potential: 0.5
      },
      embodiedMarkers: {
        somatic_awareness: 0.4,
        breathing_pattern: 'calm',
        energy_signature: 'grounded',
        tension_patterns: [],
        visceral_indicators: []
      },
      temporalDynamics: {
        emotional_velocity: 0.2,
        stability_prediction: 0.7,
        recovery_trajectory: 'stable',
        integration_timeline: 1
      },
      contextualFactors: {
        time_of_day_influence: 0.3,
        seasonal_relevance: 0.3,
        social_context_impact: 0.3,
        environmental_stressors: [],
        supportive_elements: []
      },
      therapeuticPriority: {
        urgency_level: 'low',
        intervention_type: 'validation',
        growth_opportunity: 0.5,
        healing_capacity: 0.7
      },
      emotionalMetaCognition: {
        self_awareness_level: 0.5,
        emotional_labeling_accuracy: 0.5,
        regulation_attempts: [],
        coping_strategies_active: [],
        unconscious_patterns: []
      }
    };
  }
}

// Export singleton instance
export const traumaInformedResponseEngine = new TraumaInformedResponseEngine();

// Export types
export type {
  TraumaInformedProfile,
  TraumaInformedResponse
};