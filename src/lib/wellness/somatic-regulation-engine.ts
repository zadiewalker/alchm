/**
 * ALCHM Advanced Somatic Regulation Engine
 * 
 * Revolutionary nervous system state tracking and regulation system that integrates:
 * - Polyvagal theory and autonomic nervous system assessment
 * - Somatic experiencing and body-based healing
 * - Interoceptive awareness and embodied intelligence
 * - Trauma-informed nervous system regulation
 * - Cultural approaches to body wisdom and healing
 * - Disability-affirming and chronic illness-supportive approaches
 * 
 * This engine provides real-time nervous system assessment, personalized regulation
 * interventions, and tracks progress in developing somatic intelligence and regulation capacity.
 */

import { PolyvagalStateEngine, PolyvagalState } from '@/lib/polyvagal-state-engine';
import { logger } from '@/lib/logging';

export interface SomaticRegulationAssessment {
  id: string;
  userId: string;
  timestamp: Date;
  
  // Comprehensive Somatic Assessment
  polyvagal_state: PolyvagalState;
  somatic_intelligence_score: number; // 0-100, how well user reads body signals
  interoceptive_accuracy: number; // 0-100, accuracy in perceiving internal signals
  embodied_awareness_level: number; // 0-100, overall body awareness
  
  // Nervous System Regulation Capacity
  regulation_capacity: RegulationCapacity;
  co_regulation_ability: CoRegulationAbility;
  self_soothing_effectiveness: SelfSoothingEffectiveness;
  
  // Body-Based Trauma Indicators
  trauma_embodiment_indicators: TraumaEmbodimentIndicator[];
  somatic_resources: SomaticResource[];
  protective_patterns: ProtectivePattern[];
  
  // Cultural and Accessibility Considerations
  cultural_somatic_preferences: CulturalSomaticPreference[];
  accessibility_adaptations_needed: AccessibilityAdaptation[];
  chronic_condition_impacts: ChronicConditionImpact[];
  
  // Regulation Recommendations
  immediate_regulation_needs: ImmediateRegulationNeed[];
  personalized_interventions: PersonalizedSomaticIntervention[];
  professional_support_recommendations: ProfessionalSupportRecommendation[];
  
  // Progress Tracking
  regulation_skill_progress: RegulationSkillProgress[];
  nervous_system_resilience_trends: ResilienceTrend[];
  somatic_learning_milestones: SomaticMilestone[];
}

export interface RegulationCapacity {
  overall_capacity: number; // 0-100
  ventral_vagal_access: number; // 0-100, ability to access safety/connection state
  sympathetic_regulation: number; // 0-100, ability to manage activation
  dorsal_vagal_recovery: number; // 0-100, ability to recover from shutdown
  typeof window !== 'undefined' && window_of_tolerance: WindowOfToleranceMetrics;
  state_flexibility: number; // 0-100, ability to move between states appropriately
  recovery_speed: number; // 0-100, how quickly returns to regulation after dysregulation
}

export interface WindowOfToleranceMetrics {
  current_width: number; // 0-100, current capacity for emotional intensity
  optimal_width: number; // personal baseline for comparison
  expansion_rate: number; // rate of typeof window !== 'undefined' && window expansion over time
  contraction_triggers: string[]; // what narrows the typeof window !== 'undefined' && window
  expansion_supports: string[]; // what widens the typeof window !== 'undefined' && window
  stability: number; // 0-100, how stable the typeof window !== 'undefined' && window is
}

export interface CoRegulationAbility {
  receptivity_to_support: number; // 0-100, openness to receiving regulation support
  ability_to_offer_support: number; // 0-100, capacity to help others regulate
  safe_relationship_navigation: number; // 0-100, skill in maintaining regulating relationships
  boundary_awareness: number; // 0-100, healthy boundaries in co-regulation
  cultural_co_regulation_patterns: CulturalCoRegulation[];
}

export interface SelfSoothingEffectiveness {
  somatic_self_soothing: number; // 0-100, body-based self-soothing skills
  emotional_self_soothing: number; // 0-100, emotional regulation skills
  cognitive_self_soothing: number; // 0-100, thought-based soothing skills
  environmental_self_soothing: number; // 0-100, using environment for regulation
  preferred_modalities: SelfSoothingModality[];
  effectiveness_by_state: EffectivenessByState[];
}

export interface TraumaEmbodimentIndicator {
  indicator_type: 'hypervigilance' | 'dissociation' | 'freeze' | 'hyperactivation' | 'collapse' | 'fragmentation';
  intensity: number; // 0-100
  body_regions_affected: BodyRegion[];
  trigger_patterns: TriggerPattern[];
  adaptive_function: string; // how this response was protective
  healing_approaches: HealingApproach[];
  cultural_trauma_considerations: CulturalTraumaConsideration[];
}

export interface SomaticResource {
  resource_type: 'strength' | 'resilience' | 'connection' | 'grounding' | 'boundary' | 'joy' | 'wisdom';
  resource_name: string;
  body_location: BodyRegion[];
  access_method: string;
  strengthening_practices: string[];
  cultural_expressions: string[];
  trauma_informed_adaptations: string[];
}

export interface ProtectivePattern {
  pattern_name: string;
  pattern_description: string;
  somatic_expression: string;
  adaptive_function: string;
  current_helpfulness: number; // 0-100, how much this pattern still serves
  transformation_potential: number; // 0-100, capacity for healthy transformation
  gentle_evolution_approaches: string[];
}

export interface PersonalizedSomaticIntervention {
  intervention_id: string;
  intervention_name: string;
  intervention_type: 'regulation' | 'awareness' | 'discharge' | 'integration' | 'resource_building' | 'co_regulation';
  
  // Targeting
  target_nervous_system_state: string;
  target_body_regions: BodyRegion[];
  target_regulation_capacity: string[];
  
  // Cultural and Accessibility Integration
  cultural_adaptations: CulturalAdaptation[];
  accessibility_modifications: AccessibilityModification[];
  chronic_condition_considerations: ChronicConditionConsideration[];
  
  // Implementation
  step_by_step_instructions: InstructionStep[];
  duration_range: [number, number]; // min, max minutes
  frequency_recommendation: string;
  optimal_timing: string[];
  
  // Safety and Effectiveness
  safety_level: 'high' | 'moderate' | 'requires_guidance' | 'professional_only';
  contraindications: string[];
  expected_outcomes: string[];
  progress_indicators: string[];
  
  // Integration Support
  integration_practices: string[];
  follow_up_support: string[];
  community_practice_options: CommunityPracticeOption[];
}

export interface ImmediateRegulationNeed {
  urgency: 'low' | 'moderate' | 'high' | 'crisis';
  need_type: 'grounding' | 'activation' | 'calming' | 'connection' | 'safety' | 'discharge';
  target_timeframe: string; // '5 minutes', '30 minutes', etc.
  recommended_interventions: QuickIntervention[];
  professional_support_needed: boolean;
  crisis_resources: CrisisResource[];
}

export interface RegulationSkillProgress {
  skill_name: string;
  baseline_capacity: number; // 0-100
  current_capacity: number; // 0-100
  improvement_rate: number; // rate of improvement over time
  practice_consistency: number; // 0-100, how consistently user practices
  breakthrough_moments: BreakthroughMoment[];
  challenges_identified: Challenge[];
  next_development_areas: string[];
}

// Advanced Somatic Regulation Engine
export class SomaticRegulationEngine {
  
  /**
   * Conduct comprehensive somatic regulation assessment
   */
  static async assessSomaticRegulation(
    userId: string,
    somatic_check_in: SomaticCheckIn,
    current_context: CurrentContext,
    user_history: UserSomaticHistory
  ): Promise<SomaticRegulationAssessment> {
    
    try {
      // Conduct polyvagal state assessment
      const polyvagal_state = PolyvagalStateEngine.assessPolyvagalState(
        somatic_check_in.somatic_indicators,
        somatic_check_in.emotional_indicators,
        somatic_check_in.cognitive_indicators,
        somatic_check_in.social_indicators,
        current_context.environmental_context
      );
      
      // Assess somatic intelligence and awareness
      const somatic_intelligence = await this.assessSomaticIntelligence(
        somatic_check_in,
        user_history.somatic_learning_history
      );
      
      const interoceptive_accuracy = await this.assessInteroceptiveAccuracy(
        somatic_check_in,
        user_history.interoceptive_tracking_history
      );
      
      // Assess regulation capacities
      const regulation_capacity = await this.assessRegulationCapacity(
        polyvagal_state,
        somatic_check_in,
        user_history.regulation_skill_history
      );
      
      const co_regulation_ability = await this.assessCoRegulationAbility(
        somatic_check_in.social_indicators,
        current_context.social_context,
        user_history.relationship_patterns
      );
      
      const self_soothing_effectiveness = await this.assessSelfSoothingEffectiveness(
        somatic_check_in,
        user_history.self_soothing_patterns
      );
      
      // Assess trauma embodiment and resources
      const trauma_indicators = await this.identifyTraumaEmbodimentIndicators(
        polyvagal_state,
        somatic_check_in,
        user_history.trauma_history
      );
      
      const somatic_resources = await this.identifySomaticResources(
        somatic_check_in,
        polyvagal_state,
        user_history.resilience_patterns
      );
      
      const protective_patterns = await this.identifyProtectivePatterns(
        somatic_check_in,
        trauma_indicators,
        user_history.adaptive_patterns
      );
      
      // Cultural and accessibility considerations
      const cultural_preferences = await this.assessCulturalSomaticPreferences(
        current_context.cultural_background,
        user_history.cultural_healing_experiences
      );
      
      const accessibility_needs = await this.assessAccessibilityAdaptations(
        current_context.accessibility_needs,
        somatic_check_in.physical_capacity_indicators
      );
      
      const chronic_condition_impacts = await this.assessChronicConditionImpacts(
        current_context.chronic_conditions,
        somatic_check_in.symptom_reports
      );
      
      // Generate personalized interventions
      const immediate_needs = await this.identifyImmediateRegulationNeeds(
        polyvagal_state,
        regulation_capacity,
        current_context.current_stressors
      );
      
      const personalized_interventions = await this.generatePersonalizedInterventions(
        polyvagal_state,
        regulation_capacity,
        cultural_preferences,
        accessibility_needs,
        chronic_condition_impacts,
        user_history.intervention_effectiveness
      );
      
      const professional_recommendations = await this.generateProfessionalRecommendations(
        trauma_indicators,
        regulation_capacity,
        immediate_needs
      );
      
      // Track progress and learning
      const skill_progress = await this.trackRegulationSkillProgress(
        userId,
        regulation_capacity,
        user_history.skill_development_history
      );
      
      const resilience_trends = await this.analyzeResilienceTrends(
        userId,
        user_history.regulation_assessments
      );
      
      const learning_milestones = await this.identifySomaticMilestones(
        somatic_intelligence,
        interoceptive_accuracy,
        regulation_capacity,
        user_history.milestone_history
      );
      
      const assessment: SomaticRegulationAssessment = {
        id: `somatic_assessment_${Date.now()}`,
        userId,
        timestamp: new Date(),
        polyvagal_state,
        somatic_intelligence_score: somatic_intelligence,
        interoceptive_accuracy,
        embodied_awareness_level: this.calculateEmbodiedAwareness(somatic_intelligence, interoceptive_accuracy),
        regulation_capacity,
        co_regulation_ability,
        self_soothing_effectiveness,
        trauma_embodiment_indicators: trauma_indicators,
        somatic_resources,
        protective_patterns,
        cultural_somatic_preferences: cultural_preferences,
        accessibility_adaptations_needed: accessibility_needs,
        chronic_condition_impacts,
        immediate_regulation_needs: immediate_needs,
        personalized_interventions,
        professional_support_recommendations: professional_recommendations,
        regulation_skill_progress: skill_progress,
        nervous_system_resilience_trends: resilience_trends,
        somatic_learning_milestones: learning_milestones
      };
      
      // Log assessment for monitoring
      logger.info('Somatic regulation assessment completed', {
        userId: userId.slice(0, 8) + '...',
        polyvagal_state: polyvagal_state.dominant_state,
        regulation_capacity: regulation_capacity.overall_capacity,
        interventions_recommended: personalized_interventions.length,
        immediate_needs: immediate_needs.length
      });
      
      return assessment;
      
    } catch (error) {
      logger.error('Error conducting somatic regulation assessment', error);
      throw new Error(`Somatic assessment failed: ${error.message}`);
    }
  }
  
  /**
   * Generate real-time regulation guidance based on current nervous system state
   */
  static async generateRealTimeRegulationGuidance(
    current_assessment: SomaticRegulationAssessment,
    immediate_context: {
      current_stressors: string[];
      available_time: number; // minutes
      privacy_level: 'private' | 'semi_private' | 'public';
      support_available: boolean;
    }
  ): Promise<RealTimeRegulationGuidance> {
    
    const dominant_state = current_assessment.polyvagal_state.dominant_state;
    const regulation_capacity = current_assessment.regulation_capacity.overall_capacity;
    const typeof window !== 'undefined' && window_position = current_assessment.polyvagal_state.typeof window !== 'undefined' && window_of_tolerance.current_position;
    
    // Select interventions based on current state and capacity
    let prioritized_interventions: PersonalizedSomaticIntervention[] = [];
    
    if (typeof window !== 'undefined' && window_position === 'hyperarousal' && regulation_capacity > 50) {
      prioritized_interventions = current_assessment.personalized_interventions.filter(
        i => i.intervention_type === 'regulation' && i.target_nervous_system_state.includes('calming')
      );
    } else if (typeof window !== 'undefined' && window_position === 'hypoarousal' && regulation_capacity > 30) {
      prioritized_interventions = current_assessment.personalized_interventions.filter(
        i => i.intervention_type === 'awareness' || i.target_nervous_system_state.includes('gentle_activation')
      );
    } else if (typeof window !== 'undefined' && window_position === 'optimal') {
      prioritized_interventions = current_assessment.personalized_interventions.filter(
        i => i.intervention_type === 'resource_building' || i.intervention_type === 'integration'
      );
    } else {
      // Low regulation capacity - focus on safety and professional support
      prioritized_interventions = current_assessment.personalized_interventions.filter(
        i => i.safety_level === 'high' && i.intervention_type === 'regulation'
      );
    }
    
    // Filter by available time and context
    const contextually_appropriate = prioritized_interventions.filter(intervention => {
      const max_duration = intervention.duration_range[1];
      const privacy_appropriate = this.checkPrivacyAppropriate(intervention, immediate_context.privacy_level);
      return max_duration <= immediate_context.available_time && privacy_appropriate;
    });
    
    // Select top 3 most appropriate interventions
    const selected_interventions = contextually_appropriate.slice(0, 3);
    
    // Generate step-by-step guidance
    const step_by_step_guidance = await this.generateStepByStepGuidance(
      selected_interventions,
      current_assessment,
      immediate_context
    );
    
    // Generate follow-up recommendations
    const follow_up_recommendations = await this.generateFollowUpRecommendations(
      current_assessment,
      selected_interventions
    );
    
    // Check for professional support needs
    const professional_support_needed = this.assessImmediateProfessionalSupportNeed(
      current_assessment,
      immediate_context.current_stressors
    );
    
    return {
      assessment_id: current_assessment.id,
      generated_at: new Date(),
      current_state_summary: this.generateStateSummary(current_assessment),
      prioritized_interventions: selected_interventions,
      step_by_step_guidance,
      expected_outcomes: await this.generateExpectedOutcomes(selected_interventions, current_assessment),
      follow_up_recommendations,
      professional_support_needed,
      crisis_resources: professional_support_needed ? await this.getCrisisResources(current_assessment.userId) : [],
      contextual_modifications: await this.generateContextualModifications(
        selected_interventions,
        immediate_context,
        current_assessment
      )
    };
  }
  
  /**
   * Track somatic regulation progress over time
   */
  static async trackSomaticRegulationProgress(
    userId: string,
    assessment_history: SomaticRegulationAssessment[],
    timeframe: 'week' | 'month' | 'quarter' | 'year'
  ): Promise<SomaticRegulationProgressReport> {
    
    if (assessment_history.length < 2) {
      throw new Error('Insufficient assessment history for progress tracking');
    }
    
    const sorted_history = assessment_history.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const baseline = sorted_history[0];
    const current = sorted_history[sorted_history.length - 1];
    
    // Calculate progress metrics
    const regulation_capacity_progress = this.calculateProgressMetric(
      baseline.regulation_capacity.overall_capacity,
      current.regulation_capacity.overall_capacity
    );
    
    const somatic_intelligence_progress = this.calculateProgressMetric(
      baseline.somatic_intelligence_score,
      current.somatic_intelligence_score
    );
    
    const interoceptive_accuracy_progress = this.calculateProgressMetric(
      baseline.interoceptive_accuracy,
      current.interoceptive_accuracy
    );
    
    const typeof window !== 'undefined' && window_of_tolerance_progress = this.calculateWindowProgress(
      baseline.regulation_capacity.typeof window !== 'undefined' && window_of_tolerance,
      current.regulation_capacity.typeof window !== 'undefined' && window_of_tolerance
    );
    
    // Analyze skill development
    const skill_development_analysis = await this.analyzeSkillDevelopment(
      sorted_history,
      timeframe
    );
    
    // Identify breakthrough moments
    const breakthrough_moments = await this.identifyBreakthroughMoments(
      sorted_history,
      timeframe
    );
    
    // Analyze intervention effectiveness
    const intervention_effectiveness = await this.analyzeInterventionEffectiveness(
      userId,
      sorted_history,
      timeframe
    );
    
    // Generate optimization recommendations
    const optimization_recommendations = await this.generateOptimizationRecommendations(
      current,
      skill_development_analysis,
      intervention_effectiveness
    );
    
    // Identify next development areas
    const next_development_areas = await this.identifyNextDevelopmentAreas(
      current,
      skill_development_analysis
    );
    
    return {
      userId,
      timeframe,
      baseline_date: baseline.timestamp,
      current_date: current.timestamp,
      overall_progress_score: this.calculateOverallProgress([
        regulation_capacity_progress,
        somatic_intelligence_progress,
        interoceptive_accuracy_progress
      ]),
      regulation_capacity_progress,
      somatic_intelligence_progress,
      interoceptive_accuracy_progress,
      typeof window !== 'undefined' && window_of_tolerance_progress,
      skill_development_analysis,
      breakthrough_moments,
      intervention_effectiveness,
      nervous_system_resilience_trends: current.nervous_system_resilience_trends,
      optimization_recommendations,
      next_development_areas,
      celebration_achievements: await this.identifyCelebrationAchievements(
        baseline,
        current,
        breakthrough_moments
      ),
      generated_at: new Date()
    };
  }
  
  // Private helper methods
  private static async assessSomaticIntelligence(
    somatic_check_in: SomaticCheckIn,
    learning_history: SomaticLearningHistory[]
  ): Promise<number> {
    // Implementation would assess user's ability to read and interpret body signals
    // This is a sophisticated assessment that would consider:
    // - Accuracy of body awareness
    // - Ability to identify emotions through body sensations
    // - Recognition of nervous system state changes
    // - Understanding of body's needs and responses
    return 75; // Placeholder - would be calculated based on assessment
  }
  
  private static async assessInteroceptiveAccuracy(
    somatic_check_in: SomaticCheckIn,
    tracking_history: InteroceptiveTrackingHistory[]
  ): Promise<number> {
    // Implementation would assess accuracy in perceiving internal bodily signals
    // This would include heart rate awareness, breathing awareness, gut sensations, etc.
    return 70; // Placeholder
  }
  
  private static async assessRegulationCapacity(
    polyvagal_state: PolyvagalState,
    somatic_check_in: SomaticCheckIn,
    skill_history: RegulationSkillHistory[]
  ): Promise<RegulationCapacity> {
    // Implementation would assess various aspects of nervous system regulation
    return {
      overall_capacity: 65,
      ventral_vagal_access: 70,
      sympathetic_regulation: 60,
      dorsal_vagal_recovery: 55,
      typeof window !== 'undefined' && window_of_tolerance: {
        current_width: 65,
        optimal_width: 75,
        expansion_rate: 2, // points per month
        contraction_triggers: ['work stress', 'relationship conflict'],
        expansion_supports: ['meditation', 'somatic practices', 'therapy'],
        stability: 70
      },
      state_flexibility: 60,
      recovery_speed: 65
    };
  }
  
  // Additional helper methods would be implemented...
  private static checkPrivacyAppropriate(intervention: PersonalizedSomaticIntervention, privacy_level: string): boolean {
    // Check if intervention is appropriate for current privacy level
    return true; // Placeholder
  }
  
  private static calculateProgressMetric(baseline: number, current: number): ProgressMetric {
    const change = current - baseline;
    const percent_change = baseline > 0 ? (change / baseline) * 100 : 0;
    
    return {
      baseline_value: baseline,
      current_value: current,
      absolute_change: change,
      percent_change,
      progress_rating: this.rateProgress(percent_change),
      trend: change > 2 ? 'improving' : change < -2 ? 'declining' : 'stable'
    };
  }
  
  private static rateProgress(percent_change: number): 'excellent' | 'good' | 'moderate' | 'minimal' | 'concerning' {
    if (percent_change > 25) return 'excellent';
    if (percent_change > 15) return 'good';
    if (percent_change > 5) return 'moderate';
    if (percent_change > -5) return 'minimal';
    return 'concerning';
  }
  
  private static calculateOverallProgress(progress_metrics: ProgressMetric[]): number {
    const average_change = progress_metrics.reduce((sum, metric) => sum + metric.absolute_change, 0) / progress_metrics.length;
    return Math.min(100, Math.max(0, 50 + average_change)); // Normalize to 0-100 scale
  }
}

// Supporting interfaces
export interface SomaticCheckIn {
  somatic_indicators: any;
  emotional_indicators: any;
  cognitive_indicators: any;
  social_indicators: any;
  physical_capacity_indicators: any;
  symptom_reports: any;
}

export interface CurrentContext {
  environmental_context: any;
  social_context: any;
  cultural_background: any;
  accessibility_needs: any;
  chronic_conditions: any;
  current_stressors: string[];
}

export interface UserSomaticHistory {
  somatic_learning_history: SomaticLearningHistory[];
  interoceptive_tracking_history: InteroceptiveTrackingHistory[];
  regulation_skill_history: RegulationSkillHistory[];
  relationship_patterns: any;
  trauma_history: any;
  resilience_patterns: any;
  adaptive_patterns: any;
  cultural_healing_experiences: any;
  intervention_effectiveness: any;
  skill_development_history: any;
  regulation_assessments: SomaticRegulationAssessment[];
  milestone_history: any;
}

export interface RealTimeRegulationGuidance {
  assessment_id: string;
  generated_at: Date;
  current_state_summary: string;
  prioritized_interventions: PersonalizedSomaticIntervention[];
  step_by_step_guidance: StepByStepGuidance[];
  expected_outcomes: ExpectedOutcome[];
  follow_up_recommendations: FollowUpRecommendation[];
  professional_support_needed: boolean;
  crisis_resources: CrisisResource[];
  contextual_modifications: ContextualModification[];
}

export interface SomaticRegulationProgressReport {
  userId: string;
  timeframe: string;
  baseline_date: Date;
  current_date: Date;
  overall_progress_score: number;
  regulation_capacity_progress: ProgressMetric;
  somatic_intelligence_progress: ProgressMetric;
  interoceptive_accuracy_progress: ProgressMetric;
  typeof window !== 'undefined' && window_of_tolerance_progress: WindowProgressMetric;
  skill_development_analysis: SkillDevelopmentAnalysis;
  breakthrough_moments: BreakthroughMoment[];
  intervention_effectiveness: InterventionEffectivenessAnalysis;
  nervous_system_resilience_trends: ResilienceTrend[];
  optimization_recommendations: OptimizationRecommendation[];
  next_development_areas: NextDevelopmentArea[];
  celebration_achievements: CelebrationAchievement[];
  generated_at: Date;
}

// Additional supporting interfaces would be defined here...
interface ProgressMetric {
  baseline_value: number;
  current_value: number;
  absolute_change: number;
  percent_change: number;
  progress_rating: string;
  trend: string;
}

interface WindowProgressMetric extends ProgressMetric {
  expansion_rate_change: number;
  stability_improvement: number;
  trigger_reduction: number;
  support_increase: number;
}

interface BodyRegion {
  region_name: string;
  specific_location: string;
  sensation_quality: string;
  regulation_capacity: number;
}

interface CulturalSomaticPreference {
  cultural_background: string;
  preferred_approaches: string[];
  cultural_taboos: string[];
  traditional_practices: string[];
  adaptation_needs: string[];
}

interface AccessibilityAdaptation {
  adaptation_type: string;
  specific_modification: string;
  implementation_method: string;
  effectiveness_rating: number;
}

interface ChronicConditionImpact {
  condition_name: string;
  somatic_impacts: string[];
  regulation_challenges: string[];
  adaptive_strategies: string[];
  support_needs: string[];
}

interface InstructionStep {
  step_number: number;
  instruction: string;
  duration: string;
  key_points: string[];
  modifications: string[];
  safety_notes: string[];
}

interface QuickIntervention {
  name: string;
  duration: string;
  instructions: string[];
  expected_effect: string;
  safety_level: string;
}

interface CrisisResource {
  resource_type: string;
  name: string;
  contact_information: string;
  availability: string;
  specializations: string[];
}

// Export the main engine and supporting types
export { SomaticRegulationEngine };
export type {
  SomaticRegulationAssessment,
  RegulationCapacity,
  PersonalizedSomaticIntervention,
  RealTimeRegulationGuidance,
  SomaticRegulationProgressReport
};