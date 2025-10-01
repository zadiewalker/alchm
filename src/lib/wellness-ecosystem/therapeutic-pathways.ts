// Therapeutic Pathway Orchestration System
// Coordinates therapy sessions, therapeutic homework, and progress tracking across platforms
// Integrates with therapy apps, therapist platforms, and treatment modalities

import { z } from 'zod';
import { logger } from '@/lib/logging';
import { traumaInformedEngine } from '@/ai/trauma-informed-engine';
import { wellnessEcosystemOrchestrator } from './orchestration-engine';

// Therapeutic modality definitions
export type TherapeuticModality = 
  | 'cbt' // Cognitive Behavioral Therapy
  | 'dbt' // Dialectical Behavior Therapy
  | 'emdr' // Eye Movement Desensitization and Reprocessing
  | 'somatic' // Somatic Experiencing
  | 'ifs' // Internal Family Systems
  | 'psychodynamic' // Psychodynamic Therapy
  | 'humanistic' // Person-Centered/Humanistic
  | 'mindfulness' // Mindfulness-Based Therapy
  | 'narrative' // Narrative Therapy
  | 'gestalt' // Gestalt Therapy
  | 'art_therapy' // Art Therapy
  | 'music_therapy' // Music Therapy
  | 'movement_therapy' // Movement/Dance Therapy
  | 'family_systems' // Family Systems Therapy
  | 'group_therapy'; // Group Therapy

export interface TherapeuticPathway {
  id: string;
  name: string;
  description: string;
  primaryModality: TherapeuticModality;
  supportingModalities: TherapeuticModality[];
  traumaSpecific: boolean;
  culturalAdaptations: CulturalTherapeuticAdaptation[];
  phases: TherapeuticPhase[];
  integrations: TherapeuticIntegration[];
  outcomeMetrics: TherapeuticOutcomeMetric[];
  safetyProtocols: SafetyProtocol[];
}

export interface TherapeuticPhase {
  id: string;
  name: string;
  description: string;
  modality: TherapeuticModality;
  objectives: TherapeuticObjective[];
  interventions: TherapeuticIntervention[];
  homework: TherapeuticHomework[];
  duration: PhaseDuration;
  prerequisites?: string[];
  traumaConsiderations: TraumaConsideration[];
  progressMarkers: ProgressMarker[];
}

export interface TherapeuticObjective {
  id: string;
  description: string;
  category: ObjectiveCategory;
  measurable: boolean;
  metric?: string;
  targetValue?: number;
  timeframe: string;
  traumaInformed: boolean;
  culturalConsiderations?: string[];
}

export type ObjectiveCategory = 
  | 'symptom_reduction'
  | 'coping_skills'
  | 'emotional_regulation'
  | 'interpersonal'
  | 'trauma_processing'
  | 'behavioral_change'
  | 'cognitive_restructuring'
  | 'mindfulness'
  | 'self_compassion'
  | 'meaning_making';

export interface TherapeuticIntervention {
  id: string;
  name: string;
  type: InterventionType;
  modality: TherapeuticModality;
  description: string;
  instructions: string[];
  materials?: string[];
  duration: string;
  frequency: InterventionFrequency;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  traumaAdaptations: TraumaAdaptation[];
  measurableOutcomes: InterventionOutcome[];
  integrationPoints: IntegrationPoint[];
}

export type InterventionType = 
  | 'skill_building'
  | 'exposure_work'
  | 'processing_work'
  | 'behavioral_experiment'
  | 'mindfulness_practice'
  | 'journaling_exercise'
  | 'creative_expression'
  | 'body_work'
  | 'relationship_work'
  | 'meaning_making';

export interface TherapeuticHomework {
  id: string;
  name: string;
  description: string;
  type: HomeworkType;
  instructions: string[];
  frequency: HomeworkFrequency;
  estimatedTime: string;
  materials?: string[];
  supportResources: string[];
  adaptations: HomeworkAdaptation[];
  trackingMethods: TrackingMethod[];
  integrationTarget?: string; // External app/platform
}

export type HomeworkType = 
  | 'thought_record'
  | 'behavioral_activation'
  | 'mindfulness_practice'
  | 'exposure_assignment'
  | 'journaling'
  | 'skill_practice'
  | 'relationship_exercise'
  | 'creative_assignment'
  | 'body_awareness'
  | 'values_exploration';

// Therapeutic integration system
export class TherapeuticPathwayOrchestrator {
  private therapyIntegrations: Map<string, TherapyIntegration> = new Map();
  private activePathways: Map<string, ActiveTherapeuticPathway> = new Map();
  private therapistNetwork: Map<string, TherapistProfile> = new Map();

  constructor() {
    this.initializeTherapeuticPathways();
  }

  // Register therapy platform integration
  async registerTherapyIntegration(integration: TherapyIntegration): Promise<void> {
    try {
      // Validate therapy integration
      await this.validateTherapyIntegration(integration);
      
      // Establish secure connection
      await this.establishTherapyConnection(integration);
      
      // Store integration
      this.therapyIntegrations.set(integration.id, integration);
      
      logger.info('Therapy integration registered', {
        platform: integration.platform,
        modalities: integration.supportedModalities.length,
        traumaInformed: integration.traumaInformed
      });
      
    } catch (error) {
      logger.error('Failed to register therapy integration', error);
      throw error;
    }
  }

  // Create personalized therapeutic pathway
  async createPersonalizedTherapeuticPathway(
    userId: string,
    assessmentData: TherapeuticAssessment,
    preferences: TherapyPreferences
  ): Promise<PersonalizedTherapeuticPathway> {
    
    // Analyze user needs and trauma history
    const needsAnalysis = await this.analyzeTherapeuticNeeds(assessmentData);
    
    // Select appropriate modalities
    const recommendedModalities = await this.selectTherapeuticModalities(
      needsAnalysis,
      preferences,
      assessmentData.traumaHistory
    );
    
    // Build customized pathway
    const pathway = await this.buildCustomPathway(
      userId,
      recommendedModalities,
      needsAnalysis,
      preferences
    );
    
    // Apply trauma-informed adaptations
    const traumaInformedPathway = await this.applyTraumaInformedAdaptations(
      pathway,
      assessmentData.traumaHistory
    );
    
    // Integrate with available therapy platforms
    const integratedPathway = await this.integrateWithTherapyPlatforms(
      traumaInformedPathway,
      userId
    );
    
    return integratedPathway;
  }

  // Coordinate therapy session preparation
  async coordinateSessionPreparation(
    userId: string,
    sessionData: UpcomingSession
  ): Promise<SessionPreparation> {
    const activePathway = this.activePathways.get(userId);
    if (!activePathway) {
      throw new Error('No active therapeutic pathway found');
    }

    // Analyze recent journal entries for session insights
    const recentInsights = await this.analyzeRecentJournaling(userId);
    
    // Generate session-specific talking points
    const talkingPoints = await this.generateSessionTalkingPoints(
      recentInsights,
      sessionData.sessionType,
      activePathway.currentPhase
    );
    
    // Prepare homework review
    const homeworkReview = await this.prepareHomeworkReview(userId);
    
    // Generate safety check prompts
    const safetyPrompts = await this.generateSafetyCheckPrompts(
      activePathway,
      recentInsights
    );
    
    const preparation: SessionPreparation = {
      sessionId: sessionData.id,
      userId,
      talkingPoints,
      homeworkReview,
      safetyPrompts,
      recommendedFocus: await this.recommendSessionFocus(recentInsights, activePathway),
      preparationExercises: await this.getPreparationExercises(sessionData.sessionType),
      integrationData: await this.getIntegrationData(userId),
      createdAt: new Date()
    };

    return preparation;
  }

  // Process post-session integration
  async processPostSessionIntegration(
    userId: string,
    sessionData: CompletedSession
  ): Promise<PostSessionIntegration> {
    const activePathway = this.activePathways.get(userId);
    if (!activePathway) {
      throw new Error('No active therapeutic pathway found');
    }

    // Process session outcomes
    const outcomes = await this.processSessionOutcomes(sessionData);
    
    // Update pathway progress
    await this.updatePathwayProgress(userId, outcomes);
    
    // Generate follow-up homework
    const followUpHomework = await this.generateFollowUpHomework(
      sessionData,
      activePathway.currentPhase
    );
    
    // Create integration tasks for external platforms
    const integrationTasks = await this.createIntegrationTasks(
      userId,
      sessionData,
      followUpHomework
    );
    
    // Schedule next preparation
    const nextPreparation = await this.scheduleNextSessionPreparation(
      userId,
      sessionData.nextSessionDate
    );

    const integration: PostSessionIntegration = {
      sessionId: sessionData.id,
      userId,
      outcomes,
      followUpHomework,
      integrationTasks,
      nextPreparation,
      progressUpdate: outcomes.progressUpdate,
      recommendations: await this.generatePostSessionRecommendations(outcomes),
      processedAt: new Date()
    };

    return integration;
  }

  // Coordinate homework tracking across platforms
  async coordinateHomeworkTracking(
    userId: string,
    homework: TherapeuticHomework[]
  ): Promise<HomeworkCoordination> {
    const userIntegrations = await this.getUserTherapyIntegrations(userId);
    const coordination: HomeworkCoordination = {
      userId,
      assignments: [],
      integrations: [],
      trackingMethods: [],
      reminders: []
    };

    for (const assignment of homework) {
      // Find appropriate integration for this homework type
      const targetIntegration = this.findOptimalIntegration(
        assignment,
        userIntegrations
      );
      
      if (targetIntegration) {
        // Create homework in external platform
        const externalAssignment = await this.createExternalHomework(
          targetIntegration,
          assignment
        );
        
        coordination.assignments.push({
          homeworkId: assignment.id,
          externalId: externalAssignment.id,
          platform: targetIntegration.platform,
          trackingMethod: externalAssignment.trackingMethod
        });
        
        // Set up tracking
        const tracking = await this.setupHomeworkTracking(
          targetIntegration,
          assignment,
          externalAssignment
        );
        
        coordination.trackingMethods.push(tracking);
        
        // Configure reminders
        const reminders = await this.configureHomeworkReminders(
          assignment,
          targetIntegration
        );
        
        coordination.reminders.push(...reminders);
      } else {
        // Use ALCHM's internal tracking
        const internalTracking = await this.setupInternalHomeworkTracking(assignment);
        coordination.trackingMethods.push(internalTracking);
      }
    }

    return coordination;
  }

  // Generate therapeutic insights from wellness data
  async generateTherapeuticInsights(
    userId: string,
    timeframe: string
  ): Promise<TherapeuticInsight[]> {
    const activePathway = this.activePathways.get(userId);
    if (!activePathway) {
      return [];
    }

    // Collect wellness data from all integrated platforms
    const wellnessData = await wellnessEcosystemOrchestrator.coordinateWellnessData(userId);
    
    // Analyze data through therapeutic lens
    const therapeuticAnalysis = await this.analyzeDataThroughTherapeuticLens(
      wellnessData,
      activePathway
    );
    
    // Generate modality-specific insights
    const modalityInsights = await this.generateModalitySpecificInsights(
      therapeuticAnalysis,
      activePathway.primaryModality
    );
    
    // Apply trauma-informed filtering
    const traumaFilteredInsights = await this.applyTherapeuticTraumaFiltering(
      modalityInsights,
      userId
    );
    
    return traumaFilteredInsights;
  }

  // Connect with therapist network
  async connectWithTherapistNetwork(
    userId: string,
    searchCriteria: TherapistSearchCriteria
  ): Promise<TherapistMatch[]> {
    // Filter therapists by criteria
    const potentialMatches = Array.from(this.therapistNetwork.values())
      .filter(therapist => this.matchesSearchCriteria(therapist, searchCriteria));
    
    // Score matches based on user needs
    const scoredMatches = await this.scoreTherapistMatches(
      potentialMatches,
      userId,
      searchCriteria
    );
    
    // Apply trauma-informed matching
    const traumaInformedMatches = await this.applyTraumaInformedMatching(
      scoredMatches,
      searchCriteria.traumaSpecific
    );
    
    // Sort by compatibility score
    traumaInformedMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    return traumaInformedMatches.slice(0, 10); // Return top 10 matches
  }

  // Initialize therapeutic pathways
  private async initializeTherapeuticPathways(): void {
    // CBT Pathway for Anxiety and Depression
    const cbtPathway: TherapeuticPathway = {
      id: 'cbt_anxiety_depression',
      name: 'CBT for Anxiety and Depression',
      description: 'Evidence-based cognitive behavioral therapy approach for anxiety and depression',
      primaryModality: 'cbt',
      supportingModalities: ['mindfulness'],
      traumaSpecific: false,
      culturalAdaptations: [
        {
          culture: 'collectivist',
          adaptations: ['family_involvement', 'community_context', 'relational_emphasis']
        }
      ],
      phases: [
        {
          id: 'cbt_assessment_psychoeducation',
          name: 'Assessment and Psychoeducation',
          description: 'Initial assessment and education about CBT principles',
          modality: 'cbt',
          objectives: [
            {
              id: 'understanding_cbt_model',
              description: 'Client understands the CBT model and thought-feeling-behavior connections',
              category: 'cognitive_restructuring',
              measurable: true,
              metric: 'understanding_score',
              targetValue: 80,
              timeframe: '2_weeks',
              traumaInformed: true
            }
          ],
          interventions: [
            {
              id: 'thought_feeling_behavior_mapping',
              name: 'Thought-Feeling-Behavior Mapping',
              type: 'skill_building',
              modality: 'cbt',
              description: 'Learn to identify connections between thoughts, feelings, and behaviors',
              instructions: [
                'Identify a recent distressing situation',
                'Map out the thoughts you had',
                'Identify the emotions you felt',
                'Note the behaviors or actions you took',
                'Explore the connections between all three'
              ],
              duration: '20-30 minutes',
              frequency: {
                type: 'daily',
                times: 1,
                flexibility: 'flexible'
              },
              difficulty: 'beginner',
              traumaAdaptations: [
                {
                  trigger: 'overwhelm',
                  modification: 'start_with_less_distressing_situations'
                }
              ],
              measurableOutcomes: [
                {
                  metric: 'accuracy_of_mapping',
                  measurement: 'therapist_rating',
                  target: 'improve_weekly'
                }
              ],
              integrationPoints: [
                {
                  platform: 'mood_tracker',
                  action: 'log_thought_patterns',
                  dataFlow: 'bidirectional'
                }
              ]
            }
          ],
          homework: [
            {
              id: 'daily_thought_record',
              name: 'Daily Thought Record',
              description: 'Track thoughts, feelings, and behaviors daily',
              type: 'thought_record',
              instructions: [
                'Set aside 10-15 minutes each evening',
                'Review your day for any distressing moments',
                'Complete a thought record for 1-2 situations',
                'Focus on accuracy rather than changing thoughts yet'
              ],
              frequency: {
                type: 'daily',
                times: 1,
                flexibility: 'adaptive'
              },
              estimatedTime: '10-15 minutes',
              supportResources: [
                'thought_record_template',
                'example_thought_records',
                'troubleshooting_guide'
              ],
              adaptations: [
                {
                  condition: 'time_constraints',
                  modification: 'reduce_to_one_situation_per_day'
                }
              ],
              trackingMethods: [
                {
                  method: 'journal_integration',
                  frequency: 'daily',
                  platform: 'alchm_journal'
                }
              ],
              integrationTarget: 'mood_tracker_app'
            }
          ],
          duration: {
            estimated: '2-4 weeks',
            flexible: true,
            factors: ['client_readiness', 'comprehension_speed', 'trauma_considerations']
          },
          traumaConsiderations: [
            {
              consideration: 'hypervigilance',
              adaptation: 'gentle_pacing',
              monitoring: 'continuous_safety_check'
            }
          ],
          progressMarkers: [
            {
              id: 'cbt_model_understanding',
              description: 'Client can explain CBT model in their own words',
              measurement: 'qualitative_assessment',
              milestone: true
            }
          ]
        }
      ],
      integrations: [
        {
          platform: 'mood_tracker',
          type: 'bidirectional',
          dataTypes: ['mood_scores', 'thought_patterns', 'behavioral_data'],
          purpose: 'track_progress_and_patterns'
        }
      ],
      outcomeMetrics: [
        {
          name: 'anxiety_level',
          measurement: 'GAD-7',
          frequency: 'weekly',
          targetDirection: 'decrease',
          traumaInformed: true
        }
      ],
      safetyProtocols: [
        {
          trigger: 'suicidal_ideation',
          response: 'immediate_safety_assessment',
          escalation: 'crisis_intervention_protocol'
        }
      ]
    };

    // EMDR Pathway for Trauma
    const emdrPathway: TherapeuticPathway = {
      id: 'emdr_trauma_processing',
      name: 'EMDR for Trauma Processing',
      description: 'Eye Movement Desensitization and Reprocessing for trauma recovery',
      primaryModality: 'emdr',
      supportingModalities: ['somatic', 'mindfulness'],
      traumaSpecific: true,
      culturalAdaptations: [
        {
          culture: 'indigenous',
          adaptations: ['ceremonial_elements', 'ancestor_connection', 'nature_integration']
        }
      ],
      phases: [
        {
          id: 'emdr_preparation',
          name: 'Preparation and Stabilization',
          description: 'Building safety, resources, and stabilization before processing',
          modality: 'emdr',
          objectives: [
            {
              id: 'dual_awareness',
              description: 'Client can maintain dual awareness during activated states',
              category: 'trauma_processing',
              measurable: true,
              metric: 'dual_awareness_score',
              targetValue: 70,
              timeframe: '4_weeks',
              traumaInformed: true
            }
          ],
          interventions: [
            {
              id: 'safe_place_installation',
              name: 'Safe Place Visualization Installation',
              type: 'processing_work',
              modality: 'emdr',
              description: 'Install a safe place resource using bilateral stimulation',
              instructions: [
                'Guide client to visualize a safe, peaceful place',
                'Enhance the image with sensory details',
                'Notice positive emotions and body sensations',
                'Apply bilateral stimulation while holding the image',
                'Create a cue word or gesture for future access'
              ],
              duration: '45-60 minutes',
              frequency: {
                type: 'as_needed',
                times: 1,
                flexibility: 'strict'
              },
              difficulty: 'intermediate',
              traumaAdaptations: [
                {
                  trigger: 'dissociation',
                  modification: 'slower_pacing_with_grounding'
                }
              ],
              measurableOutcomes: [
                {
                  metric: 'resource_accessibility',
                  measurement: 'client_self_report',
                  target: 'consistent_access'
                }
              ],
              integrationPoints: [
                {
                  platform: 'meditation_app',
                  action: 'guided_safe_place_practice',
                  dataFlow: 'unidirectional'
                }
              ]
            }
          ],
          homework: [
            {
              id: 'daily_safe_place_practice',
              name: 'Daily Safe Place Practice',
              description: 'Practice accessing safe place resource daily',
              type: 'skill_practice',
              instructions: [
                'Set aside 5-10 minutes in a quiet space',
                'Close your eyes and access your safe place',
                'Engage all your senses in the visualization',
                'Notice the positive feelings and sensations',
                'Use your cue word or gesture',
                'Practice 2-3 times per session'
              ],
              frequency: {
                type: 'daily',
                times: 1,
                flexibility: 'flexible'
              },
              estimatedTime: '5-10 minutes',
              supportResources: [
                'guided_safe_place_audio',
                'troubleshooting_guide',
                'grounding_techniques'
              ],
              adaptations: [
                {
                  condition: 'visualization_difficulties',
                  modification: 'use_actual_safe_objects_or_spaces'
                }
              ],
              trackingMethods: [
                {
                  method: 'effectiveness_rating',
                  frequency: 'daily',
                  platform: 'therapy_tracker'
                }
              ]
            }
          ],
          duration: {
            estimated: '4-8 weeks',
            flexible: true,
            factors: ['trauma_severity', 'stabilization_needs', 'resource_development']
          },
          traumaConsiderations: [
            {
              consideration: 'typeof window !== 'undefined' && window_of_tolerance',
              adaptation: 'constant_monitoring_and_regulation',
              monitoring: 'session_by_session_assessment'
            }
          ],
          progressMarkers: [
            {
              id: 'resource_stability',
              description: 'Client can reliably access and benefit from installed resources',
              measurement: 'therapist_and_client_assessment',
              milestone: true
            }
          ]
        }
      ],
      integrations: [
        {
          platform: 'meditation_app',
          type: 'unidirectional',
          dataTypes: ['mindfulness_practice', 'regulation_exercises'],
          purpose: 'support_stabilization'
        }
      ],
      outcomeMetrics: [
        {
          name: 'ptsd_symptoms',
          measurement: 'PCL-5',
          frequency: 'monthly',
          targetDirection: 'decrease',
          traumaInformed: true
        }
      ],
      safetyProtocols: [
        {
          trigger: 'dissociation',
          response: 'immediate_grounding_protocol',
          escalation: 'session_pause_and_stabilization'
        }
      ]
    };

    // Additional pathway implementations would be added here...
  }

  // Helper methods
  private async validateTherapyIntegration(integration: TherapyIntegration): Promise<void> {
    if (!integration.traumaInformed) {
      throw new Error('All therapy integrations must be trauma-informed');
    }

    if (!integration.privacyCompliant) {
      throw new Error('Therapy integration must be HIPAA compliant');
    }

    if (!integration.supportedModalities.length) {
      throw new Error('Integration must support at least one therapeutic modality');
    }
  }

  private async establishTherapyConnection(integration: TherapyIntegration): Promise<void> {
    // Establish secure connection to therapy platform
    logger.info(`Establishing connection to ${integration.platform}`);
  }

  private async analyzeTherapeuticNeeds(assessment: TherapeuticAssessment): Promise<NeedsAnalysis> {
    // Analyze assessment data to determine therapeutic needs
    return {
      primaryConcerns: assessment.primaryConcerns,
      traumaHistory: assessment.traumaHistory,
      preferredModalities: assessment.preferredModalities,
      riskFactors: assessment.riskFactors,
      strengths: assessment.strengths,
      culturalFactors: assessment.culturalFactors
    };
  }

  // Additional helper methods would be implemented here...
}

// Supporting interfaces and types
export interface TherapyIntegration {
  id: string;
  platform: string;
  supportedModalities: TherapeuticModality[];
  traumaInformed: boolean;
  privacyCompliant: boolean;
  features: TherapyIntegrationFeature[];
  apiEndpoints: APIEndpoint[];
}

export interface TherapyIntegrationFeature {
  name: string;
  description: string;
  category: 'homework_tracking' | 'session_notes' | 'progress_monitoring' | 'resource_sharing';
  available: boolean;
}

export interface TherapeuticAssessment {
  userId: string;
  primaryConcerns: string[];
  traumaHistory: TraumaHistory;
  preferredModalities: TherapeuticModality[];
  riskFactors: RiskFactor[];
  strengths: string[];
  culturalFactors: CulturalFactor[];
  completedAt: Date;
}

export interface PersonalizedTherapeuticPathway {
  id: string;
  userId: string;
  basePathway: TherapeuticPathway;
  personalizations: PathwayPersonalization[];
  integratedPlatforms: string[];
  estimatedDuration: string;
  nextPhase: string;
  progressTracking: ProgressTracking;
}

export interface SessionPreparation {
  sessionId: string;
  userId: string;
  talkingPoints: TalkingPoint[];
  homeworkReview: HomeworkReview;
  safetyPrompts: SafetyPrompt[];
  recommendedFocus: string[];
  preparationExercises: PreparationExercise[];
  integrationData: IntegrationData;
  createdAt: Date;
}

export interface PostSessionIntegration {
  sessionId: string;
  userId: string;
  outcomes: SessionOutcome[];
  followUpHomework: TherapeuticHomework[];
  integrationTasks: IntegrationTask[];
  nextPreparation: NextSessionPreparation;
  progressUpdate: ProgressUpdate;
  recommendations: PostSessionRecommendation[];
  processedAt: Date;
}

export interface HomeworkCoordination {
  userId: string;
  assignments: HomeworkAssignment[];
  integrations: HomeworkIntegration[];
  trackingMethods: HomeworkTrackingMethod[];
  reminders: HomeworkReminder[];
}

export interface TherapeuticInsight {
  id: string;
  type: 'progress' | 'pattern' | 'concern' | 'achievement';
  category: ObjectiveCategory;
  description: string;
  evidence: InsightEvidence[];
  confidence: number;
  actionable: boolean;
  traumaInformed: boolean;
  recommendations: string[];
  createdAt: Date;
}

export interface TherapistMatch {
  therapistId: string;
  profile: TherapistProfile;
  compatibilityScore: number;
  matchingFactors: MatchingFactor[];
  availability: TherapistAvailability;
  traumaSpecialization: boolean;
  culturalCompetency: CulturalCompetency[];
}

// Additional interfaces would be defined here...
export interface CulturalTherapeuticAdaptation {
  culture: string;
  adaptations: string[];
}

export interface TraumaConsideration {
  consideration: string;
  adaptation: string;
  monitoring: string;
}

export interface ProgressMarker {
  id: string;
  description: string;
  measurement: string;
  milestone: boolean;
}

export interface PhaseDuration {
  estimated: string;
  flexible: boolean;
  factors: string[];
}

export interface InterventionFrequency {
  type: 'daily' | 'weekly' | 'as_needed' | 'session_based';
  times: number;
  flexibility: 'strict' | 'flexible' | 'adaptive';
}

export interface TraumaAdaptation {
  trigger: string;
  modification: string;
}

export interface InterventionOutcome {
  metric: string;
  measurement: 'objective' | 'subjective' | 'therapist_rating' | 'client_self_report';
  target: string;
}

export interface IntegrationPoint {
  platform: string;
  action: string;
  dataFlow: 'unidirectional' | 'bidirectional';
}

export interface HomeworkFrequency {
  type: 'daily' | 'weekly' | 'as_needed';
  times: number;
  flexibility: 'strict' | 'flexible' | 'adaptive';
}

export interface HomeworkAdaptation {
  condition: string;
  modification: string;
}

export interface TrackingMethod {
  method: string;
  frequency: string;
  platform: string;
}

// Export the main orchestrator
export const therapeuticPathwayOrchestrator = new TherapeuticPathwayOrchestrator();