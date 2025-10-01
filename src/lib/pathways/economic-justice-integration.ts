/**
 * ALCHM Economic Justice System Integration
 * Connects revolutionary economic pathways to core ALCHM architecture
 * 
 * This integration ensures:
 * - Seamless connection between emotional healing and economic justice
 * - Cultural responsiveness across all economic pathways
 * - Trauma-informed approach to financial stress
 * - Community organizing integration with individual healing
 */

import { 
  economicJusticePathwayOrchestrator,
  type RevolutionaryPathway as EconomicPathway
} from './economic-justice-pathways';
import { 
  economicJusticeResourceNavigator,
  type EconomicJusticeResource,
  type MutualAidNetwork
} from '../community/economic-justice-resources';
import {
  traumaInformedEconomicStressEngine,
  type EconomicStressProfile,
  type EconomicStressIntervention
} from '../trauma-informed-economic-stress-management';
import { completePathwayOrchestrator } from './complete-pathway-catalog';

// Integration interfaces
export interface IntegratedUserProfile {
  userId: string;
  
  // Core ALCHM Profile
  emotional_intelligence_metrics?: {
    self_awareness: number;
    emotional_regulation: number;
    empathy: number;
    social_skills: number;
  };
  
  // Cultural Identity
  cultural_background: {
    primary_culture: string;
    languages_spoken: string[];
    cultural_practices: string[];
    discrimination_experiences: string[];
  };
  
  // Economic Justice Profile
  economic_situation: {
    current_financial_status: 'crisis' | 'survival' | 'stability' | 'growth' | 'wealth_building';
    primary_economic_barriers: string[];
    systemic_oppression_experiences: string[];
    community_involvement_level: number;
    mutual_aid_participation: boolean;
    organizing_interest: number;
  };
  
  // Trauma-Informed Considerations
  trauma_history: {
    economic_trauma: boolean;
    generational_poverty: boolean;
    financial_abuse: boolean;
    systemic_violence_exposure: boolean;
    healing_readiness_level: number;
  };
  
  // Integration Preferences
  pathway_integration_preference: {
    individual_focus: number; // 0-10 scale
    community_focus: number; // 0-10 scale
    systemic_change_focus: number; // 0-10 scale
    healing_pace_preference: 'gentle' | 'moderate' | 'intensive';
  };
}

export interface IntegratedPathwayRecommendation {
  recommended_sequence: {
    core_alchm_pathways: any[];
    economic_justice_pathways: EconomicPathway[];
    integration_points: string[];
  };
  
  resource_connections: {
    immediate_support_resources: EconomicJusticeResource[];
    mutual_aid_networks: MutualAidNetwork[];
    community_organizing_opportunities: any[];
  };
  
  trauma_informed_modifications: {
    pacing_adjustments: string[];
    safety_considerations: string[];
    healing_integration: string[];
  };
  
  cultural_adaptations: {
    language_accommodations: string[];
    cultural_healing_practices: string[];
    community_specific_resources: string[];
  };
}

// Main Integration Engine
export class EconomicJusticeSystemIntegrator {
  
  /**
   * Create fully integrated pathway recommendation combining emotional healing and economic justice
   */
  async createIntegratedPathwayPlan(
    userProfile: IntegratedUserProfile
  ): Promise<IntegratedPathwayRecommendation> {
    
    // Get core ALCHM pathway recommendations
    const corePathways = await this.getCoreAlchmPathways(userProfile);
    
    // Get economic justice pathway recommendations
    const economicJusticeSequence = await economicJusticePathwayOrchestrator
      .createPersonalizedEconomicJusticeSequence(
        userProfile.userId,
        userProfile.economic_situation,
        this.extractEconomicGoals(userProfile)
      );
    
    // Create integration points between pathways
    const integrationPoints = this.createPathwayIntegrationPoints(
      corePathways,
      economicJusticeSequence.recommended_sequence
    );
    
    // Get resource connections
    const resourceConnections = await this.getResourceConnections(userProfile);
    
    // Create trauma-informed modifications
    const traumaInformedMods = this.createTraumaInformedModifications(userProfile);
    
    // Create cultural adaptations
    const culturalAdaptations = this.createCulturalAdaptations(userProfile);
    
    return {
      recommended_sequence: {
        core_alchm_pathways: corePathways,
        economic_justice_pathways: economicJusticeSequence.recommended_sequence,
        integration_points: integrationPoints
      },
      resource_connections: resourceConnections,
      trauma_informed_modifications: traumaInformedMods,
      cultural_adaptations: culturalAdaptations
    };
  }
  
  /**
   * Integrate economic stress support with emotional healing
   */
  async integrateEconomicStressWithEmotionalHealing(
    userProfile: IntegratedUserProfile,
    currentEmotionalState: any
  ): Promise<{
    integrated_interventions: any[];
    holistic_support_plan: string[];
    community_healing_connections: string[];
  }> {
    
    // Assess economic stress
    const economicStressProfile = await traumaInformedEconomicStressEngine
      .assessEconomicStress(userProfile.userId, {
        economic_situation: this.mapEconomicSituation(userProfile.economic_situation),
        systemic_barriers: this.mapSystemicBarriers(userProfile),
        trauma_symptoms: this.mapTraumaSymptoms(userProfile),
        current_stressors: this.identifyCurrentStressors(userProfile, currentEmotionalState),
        support_system: this.assessSupportSystem(userProfile)
      });
    
    // Get intervention recommendations
    const interventionRecommendations = await traumaInformedEconomicStressEngine
      .recommendInterventions(economicStressProfile);
    
    // Create integrated healing approach
    const integratedInterventions = this.combineEmotionalAndEconomicInterventions(
      currentEmotionalState,
      interventionRecommendations
    );
    
    return {
      integrated_interventions: integratedInterventions,
      holistic_support_plan: [
        'Address immediate economic stressors while processing emotional impacts',
        'Connect individual healing to community economic justice work',
        'Use systemic understanding to reduce self-blame and shame',
        'Build economic skills while maintaining trauma-informed pacing',
        'Engage in mutual aid both as receiver and giver for healing',
        'Connect economic empowerment to broader liberation values'
      ],
      community_healing_connections: [
        'Join financial trauma healing circles in your community',
        'Participate in mutual aid networks for both support and contribution',
        'Connect with others who share economic justice analysis',
        'Engage in community organizing around shared economic challenges',
        'Share your healing journey to help others on similar paths'
      ]
    };
  }
  
  /**
   * Create culturally responsive economic justice programming
   */
  async createCulturallyResponsiveEconomicProgram(
    userProfile: IntegratedUserProfile
  ): Promise<{
    culturally_adapted_pathways: EconomicPathway[];
    community_specific_resources: EconomicJusticeResource[];
    cultural_healing_integration: string[];
  }> {
    
    const allEconomicPathways = economicJusticePathwayOrchestrator.getAllEconomicJusticePathways();
    
    // Adapt pathways for cultural context
    const culturallyAdaptedPathways = allEconomicPathways.map(pathway => 
      this.adaptPathwayForCulture(pathway, userProfile.cultural_background)
    );
    
    // Find culturally relevant resources
    const communityResources = economicJusticeResourceNavigator.getAllResources()
      .filter(resource => this.isCulturallyRelevant(resource, userProfile.cultural_background));
    
    // Create cultural healing integration
    const culturalHealingIntegration = this.createCulturalHealingIntegration(userProfile);
    
    return {
      culturally_adapted_pathways: culturallyAdaptedPathways,
      community_specific_resources: communityResources,
      cultural_healing_integration: culturalHealingIntegration
    };
  }
  
  /**
   * Monitor integration success and adjust pathways
   */
  async monitorIntegrationProgress(
    userId: string,
    integrationPlan: IntegratedPathwayRecommendation,
    progressData: {
      emotional_healing_progress: any;
      economic_empowerment_progress: any;
      community_engagement_level: number;
      systemic_change_participation: boolean;
    }
  ): Promise<{
    integration_success_metrics: Record<string, number>;
    pathway_adjustments: string[];
    community_engagement_recommendations: string[];
    next_phase_planning: string[];
  }> {
    
    // Calculate integration success metrics
    const successMetrics = {
      holistic_healing_integration: this.calculateHolisticIntegration(progressData),
      community_connection_strength: progressData.community_engagement_level,
      systemic_awareness_growth: progressData.systemic_change_participation ? 8 : 4,
      economic_empowerment_progress: this.calculateEconomicEmpowerment(progressData),
      cultural_healing_integration: 7 // Would be calculated from actual data
    };
    
    // Create pathway adjustments based on progress
    const pathwayAdjustments = this.generatePathwayAdjustments(successMetrics, progressData);
    
    return {
      integration_success_metrics: successMetrics,
      pathway_adjustments: pathwayAdjustments,
      community_engagement_recommendations: [
        'Increase participation in mutual aid networks based on growing capacity',
        'Begin mentoring others in earlier stages of economic justice journey',
        'Explore leadership opportunities in community organizing',
        'Share integrated healing approach in community education settings'
      ],
      next_phase_planning: [
        'Transition to advanced economic justice pathway work',
        'Develop community leadership and organizing skills',
        'Create economic justice education opportunities for others',
        'Engage in policy advocacy based on lived experience and systemic understanding'
      ]
    };
  }
  
  // Private helper methods
  
  private async getCoreAlchmPathways(userProfile: IntegratedUserProfile): Promise<any[]> {
    // This would integrate with existing ALCHM pathway system
    // For now, return placeholder
    return [
      { id: 'emotional_intelligence_pathway', integration_with_economic_justice: true },
      { id: 'trauma_healing_pathway', economic_trauma_component: true },
      { id: 'cultural_identity_pathway', economic_oppression_analysis: true }
    ];
  }
  
  private extractEconomicGoals(userProfile: IntegratedUserProfile): string[] {
    const goals = [];
    
    if (userProfile.economic_situation.current_financial_status === 'crisis') {
      goals.push('immediate_stabilization', 'crisis_resource_navigation');
    }
    
    if (userProfile.trauma_history.economic_trauma) {
      goals.push('financial_trauma_healing');
    }
    
    if (userProfile.economic_situation.organizing_interest > 6) {
      goals.push('systemic_change_advocacy', 'community_organizing');
    }
    
    if (userProfile.economic_situation.mutual_aid_participation) {
      goals.push('cooperative_economics', 'mutual_aid_leadership');
    }
    
    return goals;
  }
  
  private createPathwayIntegrationPoints(
    corePathways: any[], 
    economicPathways: EconomicPathway[]
  ): string[] {
    return [
      'Integrate financial stress processing with emotional regulation pathway',
      'Connect cultural identity work with economic oppression analysis',
      'Combine trauma healing with financial trauma recovery',
      'Link community building pathways with mutual aid participation',
      'Integrate personal empowerment with economic empowerment',
      'Connect spiritual/meaning-making pathways with economic justice values'
    ];
  }
  
  private async getResourceConnections(
    userProfile: IntegratedUserProfile
  ): Promise<{
    immediate_support_resources: EconomicJusticeResource[];
    mutual_aid_networks: MutualAidNetwork[];
    community_organizing_opportunities: any[];
  }> {
    
    const resources = await economicJusticeResourceNavigator.findResources({
      resource_types: this.identifyNeededResourceTypes(userProfile),
      location: { city: 'User Location', state: 'User State' }, // Would come from profile
      urgent_need: userProfile.economic_situation.current_financial_status === 'crisis',
      language_preference: userProfile.cultural_background.languages_spoken[0],
      accessibility_needs: [], // Would come from profile
      transportation_limitations: false // Would come from profile
    });
    
    return resources;
  }
  
  private createTraumaInformedModifications(userProfile: IntegratedUserProfile): {
    pacing_adjustments: string[];
    safety_considerations: string[];
    healing_integration: string[];
  } {
    return {
      pacing_adjustments: [
        'Allow extra time for economic stress processing',
        'Provide grounding techniques for financial anxiety',
        'Offer flexible scheduling for varying capacity levels',
        'Build in integration time between intense pathway work'
      ],
      safety_considerations: [
        'Ensure basic needs are addressed before intensive pathway work',
        'Create safety plans for financial crisis situations',
        'Maintain connection to trauma-informed support systems',
        'Monitor for retraumatization and adjust accordingly'
      ],
      healing_integration: [
        'Connect individual healing to community healing practices',
        'Use systemic analysis to reduce shame and self-blame',
        'Integrate somatic practices with economic empowerment work',
        'Honor cultural healing traditions alongside modern approaches'
      ]
    };
  }
  
  private createCulturalAdaptations(userProfile: IntegratedUserProfile): {
    language_accommodations: string[];
    cultural_healing_practices: string[];
    community_specific_resources: string[];
  } {
    return {
      language_accommodations: userProfile.cultural_background.languages_spoken,
      cultural_healing_practices: [
        'Honor traditional approaches to community resource sharing',
        'Integrate cultural wisdom about money and resources',
        'Acknowledge impact of colonization on economic systems',
        'Include cultural ceremonies and rituals in healing process'
      ],
      community_specific_resources: [
        'Connect with culturally specific mutual aid networks',
        'Access community-controlled financial institutions',
        'Engage with cultural community organizing traditions',
        'Utilize traditional healing practices for economic trauma'
      ]
    };
  }
  
  private mapEconomicSituation(economicSituation: any): any {
    return {
      income_stability: economicSituation.current_financial_status === 'crisis' ? 'crisis' : 'stable',
      housing_security: 'stable', // Would be mapped from actual data
      food_security: 'secure', // Would be mapped from actual data
      healthcare_access: 'adequate', // Would be mapped from actual data
      debt_burden: 'manageable', // Would be mapped from actual data
      financial_safety_net: 'some_family_support' // Would be mapped from actual data
    };
  }
  
  private mapSystemicBarriers(userProfile: IntegratedUserProfile): any {
    // Would map user's discrimination experiences to numeric impact scores
    return {
      racism_impact: 6,
      classism_impact: 7,
      sexism_impact: 5,
      ableism_impact: 2,
      homophobia_transphobia_impact: 1,
      immigration_status_impact: 0,
      geographic_isolation_impact: 3,
      educational_barrier_impact: 4,
      criminal_justice_system_impact: 0,
      healthcare_system_barriers: 5
    };
  }
  
  private mapTraumaSymptoms(userProfile: IntegratedUserProfile): any {
    return {
      financial_anxiety_severity: userProfile.trauma_history.economic_trauma ? 7 : 3,
      money_avoidance_behaviors: ['bill_avoidance'],
      scarcity_mindset_indicators: ['fear_of_spending'],
      financial_shame_levels: userProfile.trauma_history.generational_poverty ? 8 : 4,
      hypervigilance_around_money: 6,
      financial_decision_paralysis: 5,
      money_related_nightmares: userProfile.trauma_history.economic_trauma,
      physical_symptoms: ['tension', 'sleep_issues'],
      relationship_impact: ['money_stress'],
      work_performance_impact: ['distraction']
    };
  }
  
  private identifyCurrentStressors(userProfile: IntegratedUserProfile, emotionalState: any): string[] {
    const stressors = [];
    
    if (userProfile.economic_situation.current_financial_status === 'crisis') {
      stressors.push('basic_needs_insecurity', 'housing_instability');
    }
    
    if (userProfile.economic_situation.primary_economic_barriers.length > 0) {
      stressors.push('systemic_barrier_navigation');
    }
    
    return stressors;
  }
  
  private assessSupportSystem(userProfile: IntegratedUserProfile): any {
    return {
      family_support: userProfile.economic_situation.community_involvement_level > 5 ? 'strong' : 'limited',
      community_connections: userProfile.economic_situation.mutual_aid_participation ? 'strong' : 'some',
      professional_support: 'limited' // Would be assessed from actual data
    };
  }
  
  private combineEmotionalAndEconomicInterventions(
    emotionalState: any, 
    economicInterventions: any
  ): any[] {
    // Would create integrated intervention combining both approaches
    return [
      {
        name: 'Integrated Stress Management',
        combines: ['emotional_regulation', 'financial_stress_reduction'],
        approach: 'holistic_trauma_informed'
      }
    ];
  }
  
  private adaptPathwayForCulture(
    pathway: EconomicPathway, 
    culturalBackground: any
  ): EconomicPathway {
    // Would adapt pathway content for cultural context
    return {
      ...pathway,
      cultural_adaptations: {
        ...pathway.cultural_adaptations,
        culturally_adapted_content: true,
        community_specific_examples: true
      }
    };
  }
  
  private isCulturallyRelevant(
    resource: EconomicJusticeResource, 
    culturalBackground: any
  ): boolean {
    return resource.contact_info.languages_supported.some(lang => 
      culturalBackground.languages_spoken.includes(lang)
    );
  }
  
  private createCulturalHealingIntegration(userProfile: IntegratedUserProfile): string[] {
    return [
      'Honor traditional community resource sharing practices',
      'Integrate cultural ceremonies into economic healing process',
      'Acknowledge historical trauma related to economic systems',
      'Connect with cultural community organizing traditions',
      'Use traditional approaches to money and resource relationships'
    ];
  }
  
  private identifyNeededResourceTypes(userProfile: IntegratedUserProfile): any[] {
    const types = [];
    
    if (userProfile.economic_situation.current_financial_status === 'crisis') {
      types.push('emergency_financial_aid', 'crisis_intervention');
    }
    
    if (userProfile.trauma_history.economic_trauma) {
      types.push('financial_counseling', 'mental_health_services');
    }
    
    if (userProfile.economic_situation.organizing_interest > 6) {
      types.push('community_organizing', 'policy_advocacy');
    }
    
    return types;
  }
  
  private calculateHolisticIntegration(progressData: any): number {
    // Would calculate based on actual integration between emotional and economic healing
    return 7; // Placeholder
  }
  
  private calculateEconomicEmpowerment(progressData: any): number {
    // Would calculate based on actual economic progress metrics
    return 6; // Placeholder
  }
  
  private generatePathwayAdjustments(
    successMetrics: any, 
    progressData: any
  ): string[] {
    return [
      'Increase community organizing component based on growing systemic awareness',
      'Add advanced financial trauma healing work based on readiness indicators',
      'Integrate more leadership development as community engagement grows',
      'Expand cooperative economics exploration based on values alignment'
    ];
  }
}

// Export singleton instance
export const economicJusticeSystemIntegrator = new EconomicJusticeSystemIntegrator();