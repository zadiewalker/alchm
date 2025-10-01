/**
 * ALCHM Trauma-Informed Movement Therapy Integration System
 * 
 * Revolutionary embodied healing system that integrates:
 * - Somatic experiencing through mindful movement
 * - Trauma-informed dance and movement therapy
 * - Body-based trauma release and integration
 * - Cultural movement healing traditions
 * - Disability-affirming and accessible movement practices
 * - Nervous system regulation through embodied practices
 * - Community-based movement healing and co-regulation
 * 
 * This system provides personalized movement therapy interventions that honor
 * trauma, celebrate all bodies, and integrate movement as medicine for healing.
 */

import { PolyvagalState } from '@/lib/polyvagal-state-engine';
import { SomaticRegulationAssessment } from './somatic-regulation-engine';
import { logger } from '@/lib/logging';

export interface MovementTherapySession {
  id: string;
  userId: string;
  sessionDate: Date;
  
  // Session Foundation
  pre_session_assessment: PreSessionAssessment;
  trauma_informed_adaptations: TraumaInformedAdaptation[];
  cultural_movement_integration: CulturalMovementIntegration[];
  accessibility_modifications: AccessibilityModification[];
  
  // Movement Therapy Components
  movement_modalities_used: MovementModality[];
  somatic_experiencing_elements: SomaticExperiencingElement[];
  nervous_system_regulation_practices: NervousSystemRegulationPractice[];
  expressive_movement_components: ExpressiveMovementComponent[];
  
  // Trauma Processing Integration
  trauma_processing_indicators: TraumaProcessingIndicator[];
  discharge_and_integration_moments: DischargeIntegrationMoment[];
  resource_building_activities: ResourceBuildingActivity[];
  safety_and_grounding_practices: SafetyGroundingPractice[];
  
  // Session Outcomes
  post_session_assessment: PostSessionAssessment;
  nervous_system_state_changes: NervousSystemStateChange[];
  embodied_insights: EmbodiedInsight[];
  integration_homework: IntegrationHomework[];
  
  // Progress Tracking
  therapy_goals_progress: TherapyGoalProgress[];
  somatic_integration_markers: SomaticIntegrationMarker[];
  resilience_building_indicators: ResilienceBuildingIndicator[];
  
  // Professional Support
  therapist_notes: TherapistNote[];
  supervision_needs: SupervisionNeed[];
  professional_referral_recommendations: ProfessionalReferral[];
}

export interface MovementModality {
  modality_name: string;
  modality_type: 'dance_movement_therapy' | 'somatic_experiencing' | 'authentic_movement' | 
                 'contact_improvisation' | 'developmental_movement' | 'expressive_arts' | 
                 'trauma_sensitive_yoga' | 'martial_arts_therapy' | 'cultural_dance_healing';
  
  // Trauma-Informed Approach
  trauma_informed_principles: TraumaInformedPrinciple[];
  safety_protocols: SafetyProtocol[];
  consent_practices: ConsentPractice[];
  choice_and_agency_supports: ChoiceAgencySupport[];
  
  // Cultural Integration
  cultural_origins: CulturalOrigin[];
  cultural_respectfulness_measures: CulturalRespectfulness[];
  community_healing_aspects: CommunityHealingAspect[];
  
  // Accessibility Features
  physical_adaptations: PhysicalAdaptation[];
  sensory_accommodations: SensoryAccommodation[];
  cognitive_supports: CognitiveSupport[];
  chronic_condition_modifications: ChronicConditionModification[];
  
  // Therapeutic Objectives
  nervous_system_benefits: NervousSystemBenefit[];
  trauma_healing_mechanisms: TraumaHealingMechanism[];
  emotional_regulation_supports: EmotionalRegulationSupport[];
  somatic_integration_methods: SomaticIntegrationMethod[];
}

export interface SomaticExperiencingElement {
  element_name: string;
  element_type: 'pendulation' | 'titration' | 'resource_building' | 'discharge' | 
                'completion' | 'integration' | 'boundary_development' | 'orientation';
  
  // Implementation
  movement_expression: MovementExpression;
  body_awareness_focus: BodyAwarenessFocus;
  nervous_system_tracking: NervousSystemTracking;
  
  // Safety and Pacing
  titration_approach: TitrationApproach;
  overwhelm_prevention: OverwhelmPrevention[];
  grounding_integration: GroundingIntegration[];
  
  // Trauma-Specific Considerations
  activation_management: ActivationManagement;
  dissociation_prevention: DissociationPrevention;
  re_association_support: ReAssociationSupport;
  
  // Cultural and Accessibility Integration
  cultural_movement_expressions: CulturalMovementExpression[];
  accessibility_adaptations: AccessibilityAdaptation[];
  chronic_condition_considerations: ChronicConditionConsideration[];
}

export interface TraumaProcessingIndicator {
  indicator_type: 'activation_wave' | 'discharge_tremoring' | 'emotional_release' | 
                  'memory_surfacing' | 'somatic_flashback' | 'integration_moment' | 
                  'breakthrough_experience' | 'completion_cycle';
  
  // Indicator Details
  intensity_level: number; // 0-100
  duration: number; // minutes
  body_regions_involved: BodyRegion[];
  emotional_quality: EmotionalQuality[];
  
  // Processing Support
  support_provided: SupportProvided[];
  grounding_techniques_used: GroundingTechnique[];
  co_regulation_elements: CoRegulationElement[];
  
  // Safety and Integration
  safety_maintained: boolean;
  overwhelm_prevented: boolean;
  integration_supported: boolean;
  
  // Professional Oversight
  therapist_intervention_needed: boolean;
  supervision_recommended: boolean;
  follow_up_required: boolean;
}

export interface DischargeIntegrationMoment {
  moment_id: string;
  timestamp: Date;
  
  // Discharge Characteristics
  discharge_type: 'tremoring' | 'shaking' | 'spontaneous_movement' | 'emotional_release' | 
                  'breath_release' | 'vocal_expression' | 'postural_adjustment' | 'energy_shift';
  
  discharge_intensity: number; // 0-100
  discharge_duration: number; // seconds
  body_areas_involved: BodyRegion[];
  
  // Integration Support
  integration_practices_used: IntegrationPractice[];
  meaning_making_support: MeaningMakingSupport[];
  somatic_consolidation: SomaticConsolidation[];
  
  // Nervous System Response
  pre_discharge_state: NervousSystemState;
  post_discharge_state: NervousSystemState;
  regulation_improvement: RegulationImprovement;
  
  // Safety and Support
  safety_maintained_during_discharge: boolean;
  support_person_present: boolean;
  professional_guidance_level: 'none' | 'minimal' | 'moderate' | 'intensive';
  
  // Outcomes and Learning
  embodied_insights_gained: EmbodiedInsight[];
  somatic_resources_discovered: SomaticResource[];
  healing_progress_indicators: HealingProgressIndicator[];
}

export interface CulturalMovementIntegration {
  cultural_tradition: string;
  movement_practices_integrated: CulturalMovementPractice[];
  
  // Cultural Respect and Authenticity
  cultural_consultation: CulturalConsultation[];
  authenticity_measures: AuthenticityMeasure[];
  appropriation_prevention: AppropriationPrevention[];
  
  // Healing Integration
  traditional_healing_principles: TraditionalHealingPrinciple[];
  ancestral_wisdom_integration: AncestralWisdomIntegration[];
  community_healing_elements: CommunityHealingElement[];
  
  // Adaptation and Personalization
  individual_cultural_adaptation: IndividualCulturalAdaptation[];
  mixed_heritage_integration: MixedHeritageIntegration[];
  cultural_trauma_considerations: CulturalTraumaConsideration[];
  
  // Contemporary Integration
  modern_trauma_therapy_synthesis: ModernTherapySynthesis[];
  clinical_validation: ClinicalValidation[];
  research_backing: ResearchBacking[];
}

export interface NervousSystemRegulationPractice {
  practice_name: string;
  practice_type: 'polyvagal_regulation' | 'typeof window !== 'undefined' && window_of_tolerance_expansion' | 'co_regulation' | 
                 'self_regulation' | 'activation_management' | 'calming_restoration' | 
                 'social_engagement_building' | 'freeze_response_healing';
  
  // Movement Integration
  movement_components: MovementComponent[];
  breath_integration: BreathIntegration[];
  body_position_elements: BodyPositionElement[];
  
  // Nervous System Targeting
  polyvagal_pathway_targeted: PolyvagalPathway[];
  autonomic_regulation_focus: AutonomicRegulationFocus[];
  neuroception_modification: NeuroceptionModification[];
  
  // Trauma-Informed Implementation
  safety_building_elements: SafetyBuildingElement[];
  choice_preservation: ChoicePreservation[];
  agency_restoration: AgencyRestoration[];
  
  // Effectiveness Measures
  regulation_outcomes: RegulationOutcome[];
  nervous_system_flexibility_gains: FlexibilityGain[];
  resilience_building_indicators: ResilienceBuildingIndicator[];
}

// Core Movement Therapy Engine
export class TraumaInformedMovementTherapy {
  
  /**
   * Create personalized movement therapy session based on user's current state
   */
  static async createPersonalizedSession(
    userId: string,
    current_somatic_assessment: SomaticRegulationAssessment,
    therapy_goals: TherapyGoal[],
    cultural_background: CulturalBackground,
    accessibility_needs: AccessibilityNeed[],
    chronic_conditions: ChronicCondition[],
    trauma_history: TraumaHistory,
    movement_preferences: MovementPreference[]
  ): Promise<PersonalizedMovementTherapyPlan> {
    
    try {
      // Assess readiness for movement therapy
      const readiness_assessment = await this.assessMovementTherapyReadiness(
        current_somatic_assessment,
        trauma_history,
        accessibility_needs
      );
      
      if (!readiness_assessment.ready_for_movement_therapy) {
        return this.createPreparatoryPlan(readiness_assessment, therapy_goals);
      }
      
      // Select appropriate movement modalities
      const selected_modalities = await this.selectMovementModalities(
        current_somatic_assessment.polyvagal_state,
        therapy_goals,
        cultural_background,
        accessibility_needs,
        movement_preferences,
        trauma_history
      );
      
      // Design trauma-informed adaptations
      const trauma_adaptations = await this.designTraumaInformedAdaptations(
        trauma_history,
        current_somatic_assessment,
        selected_modalities
      );
      
      // Integrate cultural movement practices
      const cultural_integration = await this.integrateCulturalMovementPractices(
        cultural_background,
        selected_modalities,
        therapy_goals
      );
      
      // Create accessibility modifications
      const accessibility_modifications = await this.createAccessibilityModifications(
        accessibility_needs,
        chronic_conditions,
        selected_modalities
      );
      
      // Design nervous system regulation integration
      const regulation_practices = await this.designNervousSystemRegulationPractices(
        current_somatic_assessment.polyvagal_state,
        current_somatic_assessment.regulation_capacity,
        selected_modalities
      );
      
      // Create safety protocols and grounding resources
      const safety_protocols = await this.createSafetyProtocols(
        trauma_history,
        current_somatic_assessment,
        selected_modalities
      );
      
      // Design session structure
      const session_structure = await this.designSessionStructure(
        selected_modalities,
        trauma_adaptations,
        regulation_practices,
        safety_protocols
      );
      
      // Generate integration and homework practices
      const integration_practices = await this.generateIntegrationPractices(
        selected_modalities,
        therapy_goals,
        current_somatic_assessment
      );
      
      // Create progress tracking system
      const progress_tracking = await this.createProgressTrackingSystem(
        therapy_goals,
        selected_modalities,
        current_somatic_assessment
      );
      
      const personalized_plan: PersonalizedMovementTherapyPlan = {
        userId,
        created_at: new Date(),
        therapy_goals,
        baseline_assessment: current_somatic_assessment,
        readiness_assessment,
        selected_modalities,
        trauma_informed_adaptations: trauma_adaptations,
        cultural_integration,
        accessibility_modifications,
        nervous_system_regulation_practices: regulation_practices,
        safety_protocols,
        session_structure,
        integration_practices,
        progress_tracking,
        professional_support_recommendations: await this.generateProfessionalSupportRecommendations(
          trauma_history,
          current_somatic_assessment,
          therapy_goals
        ),
        contraindications: await this.identifyContraindications(
          trauma_history,
          current_somatic_assessment,
          chronic_conditions
        ),
        emergency_protocols: await this.createEmergencyProtocols(
          trauma_history,
          current_somatic_assessment
        )
      };
      
      logger.info('Personalized movement therapy plan created', {
        userId: userId.slice(0, 8) + '...',
        modalities_count: selected_modalities.length,
        cultural_integrations: cultural_integration.length,
        accessibility_modifications: accessibility_modifications.length,
        safety_protocols: safety_protocols.length
      });
      
      return personalized_plan;
      
    } catch (error) {
      logger.error('Error creating personalized movement therapy session', error);
      throw new Error(`Movement therapy planning failed: ${error.message}`);
    }
  }
  
  /**
   * Guide a live movement therapy session with real-time trauma-informed support
   */
  static async guideLiveSession(
    session_plan: PersonalizedMovementTherapyPlan,
    live_context: LiveSessionContext
  ): Promise<LiveSessionGuidance> {
    
    try {
      // Real-time nervous system assessment
      const current_state = await this.assessCurrentNervousSystemState(
        live_context.user_reported_state,
        live_context.environmental_context
      );
      
      // Adapt session based on current state
      const session_adaptations = await this.adaptSessionForCurrentState(
        session_plan,
        current_state,
        live_context
      );
      
      // Generate step-by-step guidance
      const step_by_step_guidance = await this.generateStepByStepGuidance(
        session_adaptations,
        current_state,
        live_context
      );
      
      // Create real-time safety monitoring
      const safety_monitoring = await this.createRealTimeSafetyMonitoring(
        current_state,
        session_plan.trauma_informed_adaptations,
        session_plan.safety_protocols
      );
      
      // Generate trauma processing support
      const trauma_processing_support = await this.generateTraumaProcessingSupport(
        current_state,
        session_plan.trauma_informed_adaptations,
        live_context.support_available
      );
      
      // Create integration guidance
      const integration_guidance = await this.createIntegrationGuidance(
        session_adaptations,
        current_state,
        session_plan.integration_practices
      );
      
      return {
        session_id: `live_session_${Date.now()}`,
        session_plan_id: session_plan.userId,
        start_time: new Date(),
        current_nervous_system_state: current_state,
        session_adaptations,
        step_by_step_guidance,
        safety_monitoring,
        trauma_processing_support,
        integration_guidance,
        emergency_resources: session_plan.emergency_protocols,
        professional_support_contacts: session_plan.professional_support_recommendations,
        real_time_modifications: await this.generateRealTimeModifications(
          current_state,
          session_adaptations,
          live_context
        )
      };
      
    } catch (error) {
      logger.error('Error guiding live movement therapy session', error);
      throw new Error(`Live session guidance failed: ${error.message}`);
    }
  }
  
  /**
   * Process and integrate post-session experiences
   */
  static async processPostSessionIntegration(
    session_id: string,
    live_guidance: LiveSessionGuidance,
    post_session_report: PostSessionReport
  ): Promise<SessionIntegrationResult> {
    
    try {
      // Analyze session outcomes
      const session_analysis = await this.analyzeSessionOutcomes(
        live_guidance,
        post_session_report
      );
      
      // Identify trauma processing that occurred
      const trauma_processing_analysis = await this.analyzeTraumaProcessing(
        post_session_report.trauma_processing_indicators,
        post_session_report.discharge_integration_moments
      );
      
      // Assess nervous system changes
      const nervous_system_changes = await this.assessNervousSystemChanges(
        live_guidance.current_nervous_system_state,
        post_session_report.post_session_nervous_system_state
      );
      
      // Generate embodied insights
      const embodied_insights = await this.generateEmbodiedInsights(
        session_analysis,
        trauma_processing_analysis,
        nervous_system_changes,
        post_session_report.user_reported_insights
      );
      
      // Create integration homework
      const integration_homework = await this.createIntegrationHomework(
        embodied_insights,
        nervous_system_changes,
        live_guidance.session_adaptations
      );
      
      // Assess progress toward therapy goals
      const therapy_goal_progress = await this.assessTherapyGoalProgress(
        session_analysis,
        trauma_processing_analysis,
        nervous_system_changes,
        live_guidance.session_plan_id
      );
      
      // Generate next session recommendations
      const next_session_recommendations = await this.generateNextSessionRecommendations(
        session_analysis,
        therapy_goal_progress,
        embodied_insights
      );
      
      // Identify any professional support needs
      const professional_support_needs = await this.identifyProfessionalSupportNeeds(
        trauma_processing_analysis,
        nervous_system_changes,
        post_session_report.user_reported_concerns
      );
      
      const integration_result: SessionIntegrationResult = {
        session_id,
        processed_at: new Date(),
        session_analysis,
        trauma_processing_analysis,
        nervous_system_changes,
        embodied_insights,
        integration_homework,
        therapy_goal_progress,
        next_session_recommendations,
        professional_support_needs,
        celebration_achievements: await this.identifyCelebrationAchievements(
          session_analysis,
          therapy_goal_progress,
          embodied_insights
        ),
        somatic_resources_discovered: await this.identifyNewSomaticResources(
          session_analysis,
          embodied_insights
        ),
        resilience_building_indicators: await this.identifyResilienceBuildingIndicators(
          nervous_system_changes,
          embodied_insights
        )
      };
      
      logger.info('Post-session integration completed', {
        session_id,
        insights_generated: embodied_insights.length,
        resources_discovered: integration_result.somatic_resources_discovered.length,
        progress_indicators: therapy_goal_progress.length,
        professional_support_needed: professional_support_needs.length > 0
      });
      
      return integration_result;
      
    } catch (error) {
      logger.error('Error processing post-session integration', error);
      throw new Error(`Post-session integration failed: ${error.message}`);
    }
  }
  
  /**
   * Track long-term movement therapy progress and outcomes
   */
  static async trackLongTermProgress(
    userId: string,
    session_history: SessionIntegrationResult[],
    timeframe: 'month' | 'quarter' | 'year'
  ): Promise<LongTermProgressReport> {
    
    if (session_history.length < 3) {
      throw new Error('Insufficient session history for long-term progress tracking');
    }
    
    try {
      // Analyze therapy goal achievement
      const therapy_goal_analysis = await this.analyzeLongTermTherapyGoalProgress(
        session_history,
        timeframe
      );
      
      // Track nervous system regulation improvements
      const regulation_improvements = await this.trackRegulationImprovements(
        session_history,
        timeframe
      );
      
      // Analyze trauma healing progression
      const trauma_healing_progression = await this.analyzeTraumaHealingProgression(
        session_history,
        timeframe
      );
      
      // Track embodied insights development
      const embodied_insights_development = await this.trackEmbodiedInsightsDevelopment(
        session_history,
        timeframe
      );
      
      // Analyze somatic resource building
      const somatic_resource_building = await this.analyzeSomaticResourceBuilding(
        session_history,
        timeframe
      );
      
      // Track resilience and capacity building
      const resilience_building_analysis = await this.analyzeResilienceBuilding(
        session_history,
        timeframe
      );
      
      // Identify breakthrough moments and patterns
      const breakthrough_analysis = await this.analyzeBreakthroughMoments(
        session_history,
        timeframe
      );
      
      // Generate future treatment recommendations
      const future_recommendations = await this.generateFutureRecommendations(
        therapy_goal_analysis,
        regulation_improvements,
        trauma_healing_progression,
        embodied_insights_development
      );
      
      return {
        userId,
        timeframe,
        analysis_period: {
          start_date: session_history[0].processed_at,
          end_date: session_history[session_history.length - 1].processed_at,
          total_sessions: session_history.length
        },
        therapy_goal_analysis,
        regulation_improvements,
        trauma_healing_progression,
        embodied_insights_development,
        somatic_resource_building,
        resilience_building_analysis,
        breakthrough_analysis,
        future_recommendations,
        overall_progress_score: await this.calculateOverallProgressScore([
          therapy_goal_analysis,
          regulation_improvements,
          trauma_healing_progression,
          resilience_building_analysis
        ]),
        generated_at: new Date()
      };
      
    } catch (error) {
      logger.error('Error tracking long-term movement therapy progress', error);
      throw new Error(`Long-term progress tracking failed: ${error.message}`);
    }
  }
  
  // Private helper methods implementation
  private static async assessMovementTherapyReadiness(
    assessment: SomaticRegulationAssessment,
    trauma_history: TraumaHistory,
    accessibility_needs: AccessibilityNeed[]
  ): Promise<MovementTherapyReadiness> {
    // Implementation would assess if user is ready for movement therapy
    return {
      ready_for_movement_therapy: true,
      readiness_factors: ['stable nervous system state', 'trauma processing capacity'],
      preparation_needed: [],
      contraindications: [],
      recommended_supports: []
    };
  }
  
  private static async selectMovementModalities(
    polyvagal_state: PolyvagalState,
    therapy_goals: TherapyGoal[],
    cultural_background: CulturalBackground,
    accessibility_needs: AccessibilityNeed[],
    movement_preferences: MovementPreference[],
    trauma_history: TraumaHistory
  ): Promise<MovementModality[]> {
    // Implementation would select appropriate modalities based on all factors
    return []; // Placeholder
  }
  
  // Additional helper methods would be implemented...
  private static async designTraumaInformedAdaptations(
    trauma_history: TraumaHistory,
    assessment: SomaticRegulationAssessment,
    modalities: MovementModality[]
  ): Promise<TraumaInformedAdaptation[]> {
    return []; // Placeholder
  }
  
  private static async calculateOverallProgressScore(analyses: any[]): Promise<number> {
    // Implementation would calculate comprehensive progress score
    return 75; // Placeholder
  }
}

// Supporting interfaces
export interface PersonalizedMovementTherapyPlan {
  userId: string;
  created_at: Date;
  therapy_goals: TherapyGoal[];
  baseline_assessment: SomaticRegulationAssessment;
  readiness_assessment: MovementTherapyReadiness;
  selected_modalities: MovementModality[];
  trauma_informed_adaptations: TraumaInformedAdaptation[];
  cultural_integration: CulturalMovementIntegration[];
  accessibility_modifications: AccessibilityModification[];
  nervous_system_regulation_practices: NervousSystemRegulationPractice[];
  safety_protocols: SafetyProtocol[];
  session_structure: SessionStructure;
  integration_practices: IntegrationPractice[];
  progress_tracking: ProgressTracking;
  professional_support_recommendations: ProfessionalReferral[];
  contraindications: Contraindication[];
  emergency_protocols: EmergencyProtocol[];
}

export interface LiveSessionGuidance {
  session_id: string;
  session_plan_id: string;
  start_time: Date;
  current_nervous_system_state: NervousSystemState;
  session_adaptations: SessionAdaptation[];
  step_by_step_guidance: StepByStepGuidance[];
  safety_monitoring: SafetyMonitoring;
  trauma_processing_support: TraumaProcessingSupport;
  integration_guidance: IntegrationGuidance;
  emergency_resources: EmergencyProtocol[];
  professional_support_contacts: ProfessionalReferral[];
  real_time_modifications: RealTimeModification[];
}

export interface SessionIntegrationResult {
  session_id: string;
  processed_at: Date;
  session_analysis: SessionAnalysis;
  trauma_processing_analysis: TraumaProcessingAnalysis;
  nervous_system_changes: NervousSystemChange[];
  embodied_insights: EmbodiedInsight[];
  integration_homework: IntegrationHomework[];
  therapy_goal_progress: TherapyGoalProgress[];
  next_session_recommendations: NextSessionRecommendation[];
  professional_support_needs: ProfessionalSupportNeed[];
  celebration_achievements: CelebrationAchievement[];
  somatic_resources_discovered: SomaticResource[];
  resilience_building_indicators: ResilienceBuildingIndicator[];
}

export interface LongTermProgressReport {
  userId: string;
  timeframe: string;
  analysis_period: AnalysisPeriod;
  therapy_goal_analysis: TherapyGoalAnalysis;
  regulation_improvements: RegulationImprovement[];
  trauma_healing_progression: TraumaHealingProgression;
  embodied_insights_development: EmbodiedInsightsDevelopment;
  somatic_resource_building: SomaticResourceBuilding;
  resilience_building_analysis: ResilienceBuildingAnalysis;
  breakthrough_analysis: BreakthroughAnalysis;
  future_recommendations: FutureRecommendation[];
  overall_progress_score: number;
  generated_at: Date;
}

// Additional supporting interfaces would be defined here...
interface MovementTherapyReadiness {
  ready_for_movement_therapy: boolean;
  readiness_factors: string[];
  preparation_needed: string[];
  contraindications: string[];
  recommended_supports: string[];
}

interface TherapyGoal {
  goal_id: string;
  goal_description: string;
  goal_type: string;
  target_completion: Date;
  progress_markers: string[];
}

interface CulturalBackground {
  primary_culture: string;
  cultural_identities: string[];
  movement_traditions: string[];
  healing_practices: string[];
}

interface AccessibilityNeed {
  need_type: string;
  description: string;
  accommodation_required: string;
  severity: string;
}

interface ChronicCondition {
  condition_name: string;
  impact_on_movement: string;
  accommodations_needed: string[];
}

interface TraumaHistory {
  has_trauma_history: boolean;
  trauma_types: string[];
  current_symptoms: string[];
  treatment_history: string[];
}

interface MovementPreference {
  preference_type: string;
  description: string;
  cultural_significance: string;
}

// Export the main therapy engine and supporting types
export { TraumaInformedMovementTherapy };
export type {
  MovementTherapySession,
  MovementModality,
  PersonalizedMovementTherapyPlan,
  LiveSessionGuidance,
  SessionIntegrationResult,
  LongTermProgressReport
};