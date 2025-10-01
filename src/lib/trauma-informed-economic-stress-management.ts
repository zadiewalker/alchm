/**
 * ALCHM Trauma-Informed Economic Stress Management System
 * Revolutionary approach to financial stress that acknowledges systemic oppression
 * 
 * This system explicitly rejects:
 * - Bootstrap mythology and individual blame
 * - Positive thinking as solution to structural problems
 * - Therapy that ignores material conditions
 * 
 * This system provides:
 * - Trauma-informed responses to economic stress
 * - Systemic analysis of financial anxiety
 * - Community-based economic healing
 * - Connection between individual and collective liberation
 */

export interface EconomicStressProfile {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  
  // Economic Situation Analysis
  current_economic_status: {
    income_stability: 'crisis' | 'unstable' | 'barely_stable' | 'stable' | 'comfortable';
    housing_security: 'homeless' | 'at_risk' | 'unstable' | 'stable' | 'secure';
    food_security: 'food_insecure' | 'sometimes_insecure' | 'mostly_secure' | 'secure';
    healthcare_access: 'no_access' | 'limited_access' | 'emergency_only' | 'adequate' | 'comprehensive';
    debt_burden: 'overwhelming' | 'high_stress' | 'manageable' | 'low' | 'debt_free';
    financial_safety_net: 'none' | 'minimal' | 'some_family_support' | 'adequate' | 'strong';
  };

  // Systemic Barriers Assessment
  systemic_barriers: {
    racism_impact: number; // 0-10 scale
    classism_impact: number;
    sexism_impact: number;
    ableism_impact: number;
    homophobia_transphobia_impact: number;
    immigration_status_impact: number;
    geographic_isolation_impact: number;
    educational_barrier_impact: number;
    criminal_justice_system_impact: number;
    healthcare_system_barriers: number;
  };

  // Trauma Responses to Economic Stress
  economic_trauma_symptoms: {
    financial_anxiety_severity: number; // 0-10 scale
    money_avoidance_behaviors: string[];
    scarcity_mindset_indicators: string[];
    financial_shame_levels: number;
    hypervigilance_around_money: number;
    financial_decision_paralysis: number;
    money_related_nightmares: boolean;
    physical_symptoms: string[];
    relationship_impact: string[];
    work_performance_impact: string[];
  };

  // Resilience and Survival Strategies
  survival_strengths: {
    resource_maximization_skills: string[];
    community_support_utilization: string[];
    crisis_management_abilities: string[];
    advocacy_and_navigation_skills: string[];
    creative_problem_solving: string[];
    emotional_regulation_strategies: string[];
  };

  // Healing and Growth Goals
  healing_goals: {
    immediate_stabilization_needs: string[];
    trauma_healing_priorities: string[];
    skill_development_areas: string[];
    community_connection_goals: string[];
    systemic_change_engagement: string[];
  };
}

export interface EconomicStressIntervention {
  id: string;
  name: string;
  description: string;
  type: 'immediate_crisis' | 'stabilization' | 'healing' | 'empowerment' | 'systemic_change';
  target_symptoms: string[];
  systemic_analysis_component: boolean;
  community_based: boolean;
  individual_and_collective: 'individual' | 'group' | 'community_organizing' | 'policy_advocacy';
  
  intervention_steps: {
    step_number: number;
    title: string;
    description: string;
    estimated_duration: string;
    materials_needed: string[];
    systemic_context_integration: string;
  }[];

  trauma_informed_modifications: {
    trigger_warnings: string[];
    grounding_techniques: string[];
    pacing_considerations: string[];
    safety_planning: string[];
  };

  expected_outcomes: {
    immediate_relief_indicators: string[];
    medium_term_empowerment: string[];
    long_term_systemic_engagement: string[];
  };
}

// Trauma-Informed Economic Stress Management Engine
export class TraumaInformedEconomicStressEngine {
  private interventions: Map<string, EconomicStressIntervention> = new Map();
  private stressProfiles: Map<string, EconomicStressProfile> = new Map();

  constructor() {
    this.initializeInterventions();
  }

  private initializeInterventions(): void {
    // Crisis Stabilization Intervention
    this.addIntervention({
      id: 'economic_crisis_stabilization',
      name: 'Economic Crisis Stabilization: Systemic Perspective',
      description: 'Immediate crisis intervention that validates economic stress as rational response to oppressive systems while providing practical stabilization support.',
      type: 'immediate_crisis',
      target_symptoms: ['overwhelming_financial_anxiety', 'panic_about_survival', 'decision_paralysis', 'crisis_overwhelm'],
      systemic_analysis_component: true,
      community_based: true,
      individual_and_collective: 'group',
      intervention_steps: [
        {
          step_number: 1,
          title: 'Immediate Safety and Grounding',
          description: 'Ground in present safety while acknowledging real threats. Validate that financial stress is a normal response to abnormal economic conditions.',
          estimated_duration: '10-15 minutes',
          materials_needed: ['grounding_techniques_guide', 'crisis_resource_list'],
          systemic_context_integration: 'Your stress is not a personal failing - it\'s your body and mind responding appropriately to economic systems designed to create insecurity.'
        },
        {
          step_number: 2,
          title: 'Immediate Needs Triage',
          description: 'Identify most urgent survival needs and connect with immediate resources. Focus on what can be addressed today.',
          estimated_duration: '20-30 minutes',
          materials_needed: ['community_resource_database', 'emergency_aid_contacts'],
          systemic_context_integration: 'Needing help is not weakness - it\'s what communities are for. The myth of individual self-sufficiency serves systems that exploit us.'
        },
        {
          step_number: 3,
          title: 'Crisis Context and Validation',
          description: 'Explore how systemic factors contribute to current crisis. Reduce self-blame and shame through systemic analysis.',
          estimated_duration: '15-20 minutes',
          materials_needed: ['systemic_analysis_framework', 'validation_statements'],
          systemic_context_integration: 'Your situation is largely the result of policy choices and systemic design, not personal failures. Understanding this is the beginning of both healing and change.'
        },
        {
          step_number: 4,
          title: 'Immediate Action Planning',
          description: 'Create concrete next steps for the next 24-48 hours. Focus on survival needs and stress reduction.',
          estimated_duration: '15-20 minutes',
          materials_needed: ['action_planning_template', 'community_support_contacts'],
          systemic_context_integration: 'Taking care of immediate needs is both self-care and preparation for broader change work. You can\'t fight injustice from a place of total depletion.'
        },
        {
          step_number: 5,
          title: 'Community Connection and Follow-up',
          description: 'Connect with ongoing community support. Schedule follow-up check-in within 48 hours.',
          estimated_duration: '10-15 minutes',
          materials_needed: ['community_contact_list', 'follow_up_scheduling'],
          systemic_context_integration: 'Healing happens in community. Individual therapy alone cannot address systemic problems - we need collective support and action.'
        }
      ],
      trauma_informed_modifications: {
        trigger_warnings: ['Discussion of financial stress may activate trauma responses', 'Systemic analysis may bring up anger or grief'],
        grounding_techniques: [
          'Focus on breath and present moment safety',
          'Feel feet on ground and body in chair',
          'Remind yourself: I am safe right now, I am not alone, systems can change'
        ],
        pacing_considerations: [
          'Allow extra time for emotional processing',
          'Take breaks between steps as needed',
          'Don\'t rush to action if still in trauma response'
        ],
        safety_planning: [
          'Identify safe people to contact in crisis',
          'Plan for basic needs in next 48 hours',
          'Create plan for managing overwhelming emotions'
        ]
      },
      expected_outcomes: {
        immediate_relief_indicators: ['reduced_panic_symptoms', 'clear_next_steps_identified', 'community_connection_established'],
        medium_term_empowerment: ['systemic_understanding_increased', 'self_blame_reduced', 'resource_navigation_skills_developed'],
        long_term_systemic_engagement: ['interest_in_economic_justice_work', 'community_organizing_participation', 'policy_advocacy_engagement']
      }
    });

    // Financial Trauma Healing Intervention
    this.addIntervention({
      id: 'financial_trauma_healing_process',
      name: 'Financial Trauma Healing: Liberation Psychology Approach',
      description: 'Deep healing process for money-related trauma that integrates individual healing with systemic change work. Addresses generational poverty trauma and internalized economic oppression.',
      type: 'healing',
      target_symptoms: ['financial_shame', 'scarcity_mindset', 'money_avoidance', 'generational_trauma_patterns'],
      systemic_analysis_component: true,
      community_based: true,
      individual_and_collective: 'group',
      intervention_steps: [
        {
          step_number: 1,
          title: 'Financial Trauma Story Mapping',
          description: 'Map personal and family financial trauma story within systemic context. Honor survival strategies developed under oppression.',
          estimated_duration: '60-90 minutes',
          materials_needed: ['trauma_mapping_template', 'systemic_oppression_timeline', 'family_resilience_framework'],
          systemic_context_integration: 'Your family\'s financial struggles are largely the result of systemic exclusion and oppression, not moral failings. The strategies you developed are evidence of tremendous resilience.'
        },
        {
          step_number: 2,
          title: 'Somatic Financial Trauma Release',
          description: 'Use body-based techniques to release stored trauma around money and survival. Integrate systemic understanding with somatic healing.',
          estimated_duration: '45-60 minutes',
          materials_needed: ['somatic_trauma_techniques', 'grounding_materials', 'safe_space_creation'],
          systemic_context_integration: 'Your body holds the stress of economic oppression. As you release this trauma, you\'re also preparing to engage more effectively in economic justice work.'
        },
        {
          step_number: 3,
          title: 'Reframing Money Relationships',
          description: 'Develop new relationship with money based on values of justice, community, and sustainability rather than scarcity and competition.',
          estimated_duration: '45-60 minutes',
          materials_needed: ['values_clarification_tools', 'alternative_economy_examples', 'community_wealth_models'],
          systemic_context_integration: 'Money is a tool that can serve justice or injustice. As you heal your relationship with money, you can use it more effectively for liberation.'
        },
        {
          step_number: 4,
          title: 'Financial Boundaries and Advocacy',
          description: 'Develop skills for financial boundary-setting and self-advocacy. Practice challenging systems that exploit financial vulnerability.',
          estimated_duration: '30-45 minutes',
          materials_needed: ['boundary_setting_scripts', 'financial_advocacy_techniques', 'know_your_rights_information'],
          systemic_context_integration: 'Setting financial boundaries is both self-care and resistance to exploitation. Every boundary you set makes it easier for others to do the same.'
        },
        {
          step_number: 5,
          title: 'Community Economic Healing Integration',
          description: 'Connect personal financial healing to community economic healing work. Explore ways to contribute to economic justice movement.',
          estimated_duration: '30-45 minutes',
          materials_needed: ['community_organizing_opportunities', 'economic_justice_actions', 'collective_healing_practices'],
          systemic_context_integration: 'Individual healing and collective liberation are inseparable. Your healing contributes to community healing and systemic change.'
        }
      ],
      trauma_informed_modifications: {
        trigger_warnings: ['Deep exploration of financial trauma may activate intense emotions', 'Family patterns exploration may bring up grief or anger'],
        grounding_techniques: [
          'Return to present moment safety when overwhelmed',
          'Use movement and breath to regulate nervous system',
          'Connect with community support when processing alone feels too intense'
        ],
        pacing_considerations: [
          'Allow multiple sessions to complete full process',
          'Take integration time between sessions',
          'Honor when breaks or slower pacing is needed'
        ],
        safety_planning: [
          'Identify support people for processing between sessions',
          'Plan self-care practices for integration periods',
          'Create safety plan for if trauma symptoms intensify'
        ]
      },
      expected_outcomes: {
        immediate_relief_indicators: ['reduced_financial_shame', 'increased_self_compassion', 'systemic_understanding_clarity'],
        medium_term_empowerment: ['improved_financial_decision_making', 'stronger_financial_boundaries', 'community_connection_increased'],
        long_term_systemic_engagement: ['economic_justice_advocacy', 'community_healing_leadership', 'alternative_economy_participation']
      }
    });

    // Economic Empowerment Building Intervention
    this.addIntervention({
      id: 'systemic_economic_empowerment',
      name: 'Systemic Economic Empowerment: Building Power While Navigating Oppression',
      description: 'Empowerment-focused intervention that builds economic skills and agency while maintaining critical analysis of systemic barriers. Prepares for both individual advancement and collective change.',
      type: 'empowerment',
      target_symptoms: ['financial_powerlessness', 'economic_decision_paralysis', 'lack_of_economic_agency', 'skill_development_needs'],
      systemic_analysis_component: true,
      community_based: true,
      individual_and_collective: 'community_organizing',
      intervention_steps: [
        {
          step_number: 1,
          title: 'Economic Power Analysis',
          description: 'Analyze personal economic position within broader systems. Identify sources of economic power and leverage.',
          estimated_duration: '45-60 minutes',
          materials_needed: ['economic_power_assessment', 'systemic_analysis_framework', 'leverage_identification_tools'],
          systemic_context_integration: 'Even within oppressive systems, you have more economic power than you might realize. Understanding your leverage is the first step to building more.'
        },
        {
          step_number: 2,
          title: 'Barrier Navigation Strategy Development',
          description: 'Develop specific strategies for navigating systemic barriers to economic advancement. Learn from others with similar challenges.',
          estimated_duration: '60-75 minutes',
          materials_needed: ['barrier_navigation_toolkit', 'community_success_stories', 'mentorship_connections'],
          systemic_context_integration: 'Navigating barriers is not about accepting them as permanent. It\'s about survival and advancement while working to eliminate them for everyone.'
        },
        {
          step_number: 3,
          title: 'Economic Skill Building with Justice Analysis',
          description: 'Build practical economic skills (budgeting, investing, etc.) while maintaining analysis of how economic systems distribute resources unequally.',
          estimated_duration: '90-120 minutes',
          materials_needed: ['financial_literacy_curriculum', 'economic_justice_analysis', 'community_investment_options'],
          systemic_context_integration: 'Financial skills are tools for both personal stability and community building. As you build wealth, you can invest in community development and economic justice.'
        },
        {
          step_number: 4,
          title: 'Community Wealth Building Integration',
          description: 'Connect individual economic advancement to community wealth building. Explore cooperative economics and solidarity investments.',
          estimated_duration: '60-75 minutes',
          materials_needed: ['community_investment_guide', 'cooperative_business_models', 'solidarity_economy_resources'],
          systemic_context_integration: 'Individual wealth building and community wealth building can reinforce each other. The goal is liberation for everyone, not just individual advancement.'
        },
        {
          step_number: 5,
          title: 'Economic Justice Action Planning',
          description: 'Develop plan for using increased economic power for economic justice work. Set goals for both personal advancement and systemic change.',
          estimated_duration: '45-60 minutes',
          materials_needed: ['action_planning_template', 'economic_justice_opportunities', 'accountability_partnership'],
          systemic_context_integration: 'Economic empowerment without justice consciousness can replicate oppressive systems. Your advancement can be a tool for collective liberation.'
        }
      ],
      trauma_informed_modifications: {
        trigger_warnings: ['Economic empowerment work may trigger imposter syndrome or unworthiness feelings', 'Success planning may activate fear of failure or visibility'],
        grounding_techniques: [
          'Remember that you deserve economic stability and power',
          'Connect with community members who share justice values',
          'Ground in the understanding that your empowerment serves collective liberation'
        ],
        pacing_considerations: [
          'Allow time to process any guilt or fear about economic advancement',
          'Take breaks if empowerment feels overwhelming or triggering',
          'Balance skill building with values reflection'
        ],
        safety_planning: [
          'Identify support for managing success anxiety',
          'Create plan for staying connected to community as circumstances improve',
          'Develop strategies for managing increased visibility or responsibility'
        ]
      },
      expected_outcomes: {
        immediate_relief_indicators: ['increased_economic_confidence', 'clearer_skill_development_plan', 'community_investment_connections'],
        medium_term_empowerment: ['improved_financial_management', 'barrier_navigation_success', 'leadership_skill_development'],
        long_term_systemic_engagement: ['community_wealth_building_leadership', 'economic_justice_organizing', 'systemic_change_advocacy']
      }
    });
  }

  private addIntervention(intervention: EconomicStressIntervention): void {
    this.interventions.set(intervention.id, intervention);
  }

  /**
   * Assess user's economic stress and trauma patterns
   */
  async assessEconomicStress(
    userId: string,
    assessmentData: {
      economic_situation: any;
      systemic_barriers: any;
      trauma_symptoms: any;
      current_stressors: string[];
      support_system: any;
    }
  ): Promise<EconomicStressProfile> {
    const profile: EconomicStressProfile = {
      id: `stress_profile_${userId}_${Date.now()}`,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
      current_economic_status: assessmentData.economic_situation,
      systemic_barriers: assessmentData.systemic_barriers,
      economic_trauma_symptoms: assessmentData.trauma_symptoms,
      survival_strengths: {
        resource_maximization_skills: ['budgeting_under_pressure', 'creative_cost_cutting', 'multiple_income_streams'],
        community_support_utilization: ['family_networks', 'community_resources', 'mutual_aid_participation'],
        crisis_management_abilities: ['rapid_problem_solving', 'emotional_regulation_under_stress', 'priority_setting'],
        advocacy_and_navigation_skills: ['system_navigation', 'resource_research', 'self_advocacy'],
        creative_problem_solving: ['alternative_resource_finding', 'bartering_skills', 'innovation_under_constraint'],
        emotional_regulation_strategies: ['trauma_informed_coping', 'community_connection', 'meaning_making']
      },
      healing_goals: {
        immediate_stabilization_needs: assessmentData.current_stressors,
        trauma_healing_priorities: ['financial_shame_reduction', 'systemic_understanding', 'somatic_regulation'],
        skill_development_areas: ['financial_literacy', 'advocacy_skills', 'community_organizing'],
        community_connection_goals: ['mutual_aid_participation', 'economic_justice_groups', 'peer_support'],
        systemic_change_engagement: ['policy_advocacy', 'community_organizing', 'cooperative_development']
      }
    };

    this.stressProfiles.set(profile.id, profile);
    return profile;
  }

  /**
   * Recommend interventions based on stress profile
   */
  async recommendInterventions(
    stressProfile: EconomicStressProfile
  ): Promise<{
    immediate_interventions: EconomicStressIntervention[];
    medium_term_interventions: EconomicStressIntervention[];
    long_term_interventions: EconomicStressIntervention[];
    community_based_options: EconomicStressIntervention[];
  }> {
    const allInterventions = Array.from(this.interventions.values());
    
    // Crisis interventions for immediate needs
    const immediateInterventions = allInterventions.filter(intervention => 
      intervention.type === 'immediate_crisis' || 
      (intervention.type === 'stabilization' && stressProfile.current_economic_status.income_stability === 'crisis')
    );

    // Healing interventions for trauma processing
    const mediumTermInterventions = allInterventions.filter(intervention => 
      intervention.type === 'healing' || intervention.type === 'stabilization'
    );

    // Empowerment interventions for skill building
    const longTermInterventions = allInterventions.filter(intervention => 
      intervention.type === 'empowerment' || intervention.type === 'systemic_change'
    );

    // Community-based interventions
    const communityBasedOptions = allInterventions.filter(intervention => 
      intervention.community_based && 
      (intervention.individual_and_collective === 'group' || 
       intervention.individual_and_collective === 'community_organizing')
    );

    return {
      immediate_interventions: immediateInterventions,
      medium_term_interventions: mediumTermInterventions,
      long_term_interventions: longTermInterventions,
      community_based_options: communityBasedOptions
    };
  }

  /**
   * Track progress and adjust interventions
   */
  async trackProgressAndAdjust(
    stressProfileId: string,
    progressData: {
      symptom_changes: Record<string, number>;
      intervention_effectiveness: Record<string, number>;
      community_engagement_level: number;
      systemic_understanding_growth: number;
      new_stressors: string[];
      achieved_goals: string[];
    }
  ): Promise<{
    progress_summary: string;
    intervention_adjustments: string[];
    next_phase_recommendations: string[];
  }> {
    // In production, this would analyze actual progress data
    return {
      progress_summary: 'Significant progress in reducing financial shame and increasing systemic understanding. Ready for more advanced empowerment work.',
      intervention_adjustments: [
        'Transition from crisis interventions to empowerment-focused work',
        'Increase community organizing component based on growing interest',
        'Add skill-building modules for identified development areas'
      ],
      next_phase_recommendations: [
        'Begin economic empowerment intervention with justice analysis',
        'Connect with community wealth building initiatives',
        'Explore leadership development in economic justice organizing'
      ]
    };
  }

  // Getter methods
  getAllInterventions(): EconomicStressIntervention[] {
    return Array.from(this.interventions.values());
  }

  getInterventionById(id: string): EconomicStressIntervention | undefined {
    return this.interventions.get(id);
  }

  getStressProfileById(id: string): EconomicStressProfile | undefined {
    return this.stressProfiles.get(id);
  }
}

// Export singleton instance
export const traumaInformedEconomicStressEngine = new TraumaInformedEconomicStressEngine();