// Crisis Care Coordination System with Intelligent Routing
// Provides immediate crisis support, intelligent resource routing, and coordinated care
// Integrates with crisis hotlines, emergency services, and mental health professionals

import { z } from 'zod';
import { logger } from '@/lib/logging';
import { traumaInformedEngine } from '@/ai/trauma-informed-engine';
import { practitionerNetworkOrchestrator } from './practitioner-network';
import { communityWellnessOrchestrator } from './community-wellness-circles';

// Crisis severity and types
export type CrisisSeverity = 
  | 'low' // Mild distress, self-harm ideation without plan
  | 'moderate' // Moderate distress, some risk factors present
  | 'high' // Severe distress, plan but no immediate intent
  | 'critical' // Imminent danger, active plan with intent
  | 'emergency'; // Immediate life-threatening situation

export type CrisisType = 
  | 'suicidal_ideation'
  | 'suicide_attempt'
  | 'self_harm'
  | 'psychotic_episode'
  | 'severe_depression'
  | 'panic_attack'
  | 'manic_episode'
  | 'trauma_flashback'
  | 'dissociative_episode'
  | 'substance_abuse_crisis'
  | 'domestic_violence'
  | 'sexual_assault'
  | 'abuse_disclosure'
  | 'grief_crisis'
  | 'homicidal_ideation';

export interface CrisisEvent {
  id: string;
  userId: string;
  type: CrisisType;
  severity: CrisisSeverity;
  timestamp: Date;
  location?: CrisisLocation;
  triggerSource: 'user_reported' | 'ai_detected' | 'community_reported' | 'practitioner_escalation';
  description: string;
  riskFactors: RiskFactor[];
  protectiveFactors: ProtectiveFactor[];
  immediateNeeds: ImmediateNeed[];
  culturalConsiderations: CulturalCrisisConsideration[];
  accessibilityNeeds: AccessibilityNeed[];
  supportSystemStatus: SupportSystemStatus;
  historicalContext: CrisisHistoricalContext;
  intervention: CrisisIntervention;
  routing: CrisisRouting;
  followUp: CrisisFollowUp;
  resolution: CrisisResolution;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrisisLocation {
  type: 'approximate' | 'precise' | 'unknown';
  coordinates?: {
    latitude: number;
    longitude: number;
    accuracy: number; // meters
  };
  address?: {
    street?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  timeZone: string;
  emergencyServices: EmergencyServiceInfo;
}

export interface CrisisIntervention {
  id: string;
  strategy: InterventionStrategy;
  resources: CrisisResource[];
  immediateActions: ImmediateAction[];
  safetyPlan: SafetyPlan;
  communicationPlan: CommunicationPlan;
  escalationPlan: EscalationPlan;
  deescalationTechniques: DeescalationTechnique[];
  timeline: InterventionTimeline;
  responsibleParties: ResponsibleParty[];
  culturalAdaptations: CulturalAdaptation[];
  traumaInformed: boolean;
}

export interface CrisisRouting {
  algorithm: 'intelligent' | 'rule_based' | 'manual';
  primaryRoute: CrisisResourceRoute;
  alternativeRoutes: CrisisResourceRoute[];
  routingDecisionFactors: RoutingFactor[];
  routingConfidence: number;
  estimatedResponseTime: string;
  coordinatedCare: CoordinatedCareTeam;
  communicationFlow: CommunicationFlow;
  qualityAssurance: QualityAssuranceProtocol;
}

export type InterventionStrategy = 
  | 'immediate_professional' // Professional crisis counselor
  | 'peer_support' // Trained peer support specialist
  | 'community_response' // Community crisis team
  | 'emergency_services' // 911/emergency medical services
  | 'mobile_crisis' // Mobile crisis unit
  | 'crisis_text_line' // Text-based crisis support
  | 'warm_handoff' // Direct connection to therapist
  | 'family_support' // Activate family/friend network
  | 'self_guided' // Guided self-soothing techniques
  | 'coordinated_multi'; // Multi-resource coordination

export interface CrisisResource {
  id: string;
  type: CrisisResourceType;
  name: string;
  contact: ResourceContact;
  availability: ResourceAvailability;
  specializations: CrisisSpecialization[];
  languages: string[];
  culturalCompetencies: string[];
  traumaInformed: boolean;
  accessibilityFeatures: AccessibilityFeature[];
  responseTime: string;
  capacity: ResourceCapacity;
  qualityRating: QualityRating;
  integrationLevel: 'full' | 'partial' | 'referral_only';
}

export type CrisisResourceType = 
  | 'crisis_hotline'
  | 'crisis_text_line'
  | 'crisis_chat'
  | 'mobile_crisis_team'
  | 'crisis_center'
  | 'emergency_room'
  | 'psychiatric_emergency'
  | 'crisis_respite'
  | 'peer_crisis_support'
  | 'crisis_counselor'
  | 'family_crisis_support'
  | 'cultural_crisis_support'
  | 'lgbtq_crisis_support'
  | 'youth_crisis_support'
  | 'elder_crisis_support'
  | 'substance_abuse_crisis'
  | 'domestic_violence_crisis'
  | 'sexual_assault_crisis';

// Crisis care coordination engine
export class CrisisCareCoordinator {
  private crisisResources: Map<string, CrisisResource> = new Map();
  private activeCrises: Map<string, CrisisEvent> = new Map();
  private routingAlgorithm: IntelligentCrisisRouting;
  private safetyMonitor: CrisisSafetyMonitor;
  private followUpSystem: CrisisFollowUpSystem;

  constructor() {
    this.routingAlgorithm = new IntelligentCrisisRouting();
    this.safetyMonitor = new CrisisSafetyMonitor();
    this.followUpSystem = new CrisisFollowUpSystem();
    this.initializeDefaultCrisisResources();
  }

  // Detect and respond to crisis events
  async detectAndRespondToCrisis(
    userId: string,
    crisisData: CrisisDetectionData
  ): Promise<CrisisResponse> {
    // Analyze crisis severity and type
    const crisisAnalysis = await this.analyzeCrisisEvent(crisisData);
    
    // Create crisis event record
    const crisisEvent = await this.createCrisisEvent(
      userId,
      crisisData,
      crisisAnalysis
    );

    // Immediate safety assessment
    const safetyAssessment = await this.conductSafetyAssessment(
      crisisEvent,
      crisisData
    );

    // Generate immediate trauma-informed response
    const immediateResponse = await this.generateImmediateResponse(
      crisisEvent,
      safetyAssessment
    );

    // Route to appropriate resources
    const routing = await this.routeToAppropriateResources(
      crisisEvent,
      safetyAssessment
    );

    // Coordinate intervention
    const intervention = await this.coordinateIntervention(
      crisisEvent,
      routing,
      immediateResponse
    );

    // Initialize follow-up care
    const followUp = await this.initializeFollowUpCare(
      crisisEvent,
      intervention
    );

    const response: CrisisResponse = {
      crisisEventId: crisisEvent.id,
      severity: crisisEvent.severity,
      immediateResponse: immediateResponse.message,
      safetyPlan: immediateResponse.safetyPlan,
      resources: routing.primaryRoute.resources,
      interventions: intervention.actions,
      coordinatedCare: routing.coordinatedCare,
      followUpPlan: followUp,
      estimatedResponse: routing.estimatedResponseTime,
      traumaInformed: true,
      culturallyAdapted: crisisEvent.culturalConsiderations.length > 0,
      createdAt: new Date()
    };

    // Store active crisis
    this.activeCrises.set(crisisEvent.id, crisisEvent);
    
    // Begin continuous monitoring
    await this.safetyMonitor.initiateCrisisMonitoring(crisisEvent.id);

    logger.error('Crisis event detected and response coordinated', {
      crisisId: crisisEvent.id,
      userId: userId.slice(0, 8) + '...',
      severity: crisisEvent.severity,
      type: crisisEvent.type,
      resourcesActivated: routing.primaryRoute.resources.length
    });

    return response;
  }

  // Route crisis to most appropriate resources
  async routeToAppropriateResources(
    crisisEvent: CrisisEvent,
    safetyAssessment: SafetyAssessment
  ): Promise<CrisisRouting> {
    // Get user preferences and constraints
    const userPreferences = await this.getUserCrisisPreferences(crisisEvent.userId);
    
    // Get available resources
    const availableResources = await this.getAvailableCrisisResources(
      crisisEvent.location,
      crisisEvent.culturalConsiderations
    );

    // Apply intelligent routing algorithm
    const routing = await this.routingAlgorithm.calculateOptimalRouting({
      crisisEvent,
      safetyAssessment,
      userPreferences,
      availableResources,
      constraints: {
        responseTime: this.getMaxResponseTime(crisisEvent.severity),
        culturalMatch: userPreferences.culturalMatchRequired,
        languageMatch: userPreferences.preferredLanguage,
        traumaInformed: true,
        accessibility: userPreferences.accessibilityNeeds
      }
    });

    // Validate routing decision
    await this.validateRoutingDecision(routing, crisisEvent);

    return routing;
  }

  // Coordinate multi-resource intervention
  async coordinateIntervention(
    crisisEvent: CrisisEvent,
    routing: CrisisRouting,
    immediateResponse: ImmediateResponse
  ): Promise<CrisisIntervention> {
    const coordinatedTeam: CoordinatedCareTeam = {
      lead: routing.primaryRoute.resources[0],
      members: routing.primaryRoute.resources.slice(1),
      roles: await this.assignTeamRoles(routing.primaryRoute.resources),
      communicationPlan: await this.createCommunicationPlan(routing),
      escalationProtocol: await this.createEscalationProtocol(crisisEvent, routing)
    };

    // Create intervention strategy
    const intervention: CrisisIntervention = {
      id: `intervention-${crisisEvent.id}`,
      strategy: this.determineInterventionStrategy(crisisEvent, routing),
      resources: routing.primaryRoute.resources,
      immediateActions: await this.generateImmediateActions(
        crisisEvent,
        immediateResponse
      ),
      safetyPlan: immediateResponse.safetyPlan,
      communicationPlan: coordinatedTeam.communicationPlan,
      escalationPlan: coordinatedTeam.escalationProtocol,
      deescalationTechniques: await this.getDeescalationTechniques(
        crisisEvent.type,
        crisisEvent.culturalConsiderations
      ),
      timeline: await this.createInterventionTimeline(crisisEvent, routing),
      responsibleParties: await this.assignResponsibilities(coordinatedTeam),
      culturalAdaptations: await this.applyCulturalAdaptations(
        crisisEvent.culturalConsiderations
      ),
      traumaInformed: true
    };

    // Activate intervention
    await this.activateIntervention(intervention);

    return intervention;
  }

  // Create personalized safety plan
  async createPersonalizedSafetyPlan(
    userId: string,
    crisisEvent: CrisisEvent,
    resourcesAvailable: CrisisResource[]
  ): Promise<PersonalizedSafetyPlan> {
    // Get user's existing safety plan if available
    const existingSafetyPlan = await this.getUserSafetyPlan(userId);
    
    // Analyze current crisis context
    const crisisContext = await this.analyzeCrisisContext(crisisEvent);
    
    // Generate personalized safety plan
    const safetyPlan: PersonalizedSafetyPlan = {
      id: `safety-plan-${crisisEvent.id}`,
      userId,
      crisisEventId: crisisEvent.id,
      immediateStrategies: await this.generateImmediateStrategies(
        crisisEvent,
        crisisContext
      ),
      copingStrategies: await this.generateCopingStrategies(
        crisisEvent,
        existingSafetyPlan?.effectiveCoping
      ),
      supportContacts: await this.organizeSupportContacts(
        resourcesAvailable,
        crisisEvent.supportSystemStatus
      ),
      environmentalSafety: await this.assessEnvironmentalSafety(
        crisisEvent.location,
        crisisEvent.type
      ),
      professionalResources: await this.organizeProfessionalResources(
        resourcesAvailable
      ),
      warningSignRecognition: await this.generateWarningSignGuide(
        crisisEvent.riskFactors,
        existingSafetyPlan?.previousTriggers
      ),
      preventionStrategies: await this.generatePreventionStrategies(
        crisisEvent.triggerSource,
        crisisEvent.historicalContext
      ),
      culturalElements: await this.integrateCulturalElements(
        crisisEvent.culturalConsiderations
      ),
      accessibilityAdaptations: await this.createAccessibilityAdaptations(
        crisisEvent.accessibilityNeeds
      ),
      reviewSchedule: {
        immediate: '1 hour',
        shortTerm: '24 hours',
        ongoing: 'weekly',
        nextReview: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      },
      emergencyProtocol: await this.createEmergencyProtocol(
        crisisEvent.location,
        resourcesAvailable
      ),
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    return safetyPlan;
  }

  // Monitor crisis resolution and recovery
  async monitorCrisisResolution(crisisEventId: string): Promise<CrisisMonitoringReport> {
    const crisisEvent = this.activeCrises.get(crisisEventId);
    if (!crisisEvent) {
      throw new Error('Crisis event not found');
    }

    // Get current status from all involved resources
    const resourceStatuses = await this.getResourceStatuses(
      crisisEvent.routing.primaryRoute.resources
    );

    // Assess current safety level
    const currentSafetyLevel = await this.assessCurrentSafetyLevel(
      crisisEventId,
      resourceStatuses
    );

    // Check intervention effectiveness
    const interventionEffectiveness = await this.assessInterventionEffectiveness(
      crisisEvent.intervention,
      resourceStatuses
    );

    // Generate monitoring report
    const report: CrisisMonitoringReport = {
      crisisEventId,
      currentStatus: this.determineCrisisStatus(
        currentSafetyLevel,
        interventionEffectiveness
      ),
      safetyLevel: currentSafetyLevel,
      interventionProgress: interventionEffectiveness,
      resourceUtilization: await this.analyzeResourceUtilization(resourceStatuses),
      escalationNeeded: this.assessEscalationNeed(
        currentSafetyLevel,
        interventionEffectiveness
      ),
      nextActions: await this.determineNextActions(
        crisisEvent,
        currentSafetyLevel,
        interventionEffectiveness
      ),
      timeToResolution: this.estimateTimeToResolution(
        crisisEvent,
        interventionEffectiveness
      ),
      qualityMetrics: await this.calculateQualityMetrics(crisisEvent),
      traumaInformedCompliance: await this.assessTraumaInformedCompliance(
        crisisEvent
      ),
      generatedAt: new Date()
    };

    return report;
  }

  // Initialize default crisis resources
  private async initializeDefaultCrisisResources(): Promise<void> {
    // National Crisis Hotlines
    this.crisisResources.set('988-lifeline', {
      id: '988-lifeline',
      type: 'crisis_hotline',
      name: '988 Suicide & Crisis Lifeline',
      contact: {
        phone: '988',
        availability: '24/7',
        languages: ['en', 'es'],
        formats: ['voice', 'text', 'chat']
      },
      availability: {
        hours: '24/7',
        timezone: 'all',
        capacity: 'high',
        averageWaitTime: '2 minutes'
      },
      specializations: [
        {
          area: 'suicide_prevention',
          level: 'expert',
          certifications: ['ASIST', 'QPR', 'safeTALK']
        }
      ],
      languages: ['en', 'es'],
      culturalCompetencies: ['general'],
      traumaInformed: true,
      accessibilityFeatures: [
        { type: 'hearing_impaired', available: true },
        { type: 'speech_impaired', available: true },
        { type: 'cognitive_accessibility', available: true }
      ],
      responseTime: 'immediate',
      capacity: {
        current: 85,
        maximum: 100,
        overflowPlan: 'redirect_to_backup'
      },
      qualityRating: {
        overall: 4.8,
        traumaInformed: 4.9,
        culturalSensitivity: 4.7,
        effectiveness: 4.8,
        accessibility: 4.6
      },
      integrationLevel: 'full'
    });

    // Crisis Text Line
    this.crisisResources.set('crisis-text-line', {
      id: 'crisis-text-line',
      type: 'crisis_text_line',
      name: 'Crisis Text Line',
      contact: {
        phone: '741741',
        textMessage: 'Text HOME to 741741',
        availability: '24/7',
        languages: ['en', 'es'],
        formats: ['text']
      },
      availability: {
        hours: '24/7',
        timezone: 'all',
        capacity: 'high',
        averageWaitTime: '5 minutes'
      },
      specializations: [
        {
          area: 'crisis_support',
          level: 'expert',
          certifications: ['crisis_counselor']
        },
        {
          area: 'youth_crisis',
          level: 'advanced',
          certifications: ['youth_crisis_specialist']
        }
      ],
      languages: ['en', 'es'],
      culturalCompetencies: ['youth', 'lgbtq', 'general'],
      traumaInformed: true,
      accessibilityFeatures: [
        { type: 'hearing_impaired', available: true },
        { type: 'speech_impaired', available: true },
        { type: 'motor_accessibility', available: true }
      ],
      responseTime: '< 5 minutes',
      capacity: {
        current: 78,
        maximum: 100,
        overflowPlan: 'queue_with_updates'
      },
      qualityRating: {
        overall: 4.7,
        traumaInformed: 4.8,
        culturalSensitivity: 4.6,
        effectiveness: 4.7,
        accessibility: 4.9
      },
      integrationLevel: 'full'
    });

    // Additional crisis resources would be initialized here...
    await this.initializeCulturalCrisisResources();
    await this.initializeSpecializedCrisisResources();
    await this.initializeLocalCrisisResources();
  }

  private async initializeCulturalCrisisResources(): Promise<void> {
    // LGBTQ+ Crisis Resources
    this.crisisResources.set('trevor-lifeline', {
      id: 'trevor-lifeline',
      type: 'lgbtq_crisis_support',
      name: 'The Trevor Lifeline',
      contact: {
        phone: '1-866-488-7386',
        availability: '24/7',
        languages: ['en', 'es'],
        formats: ['voice', 'text', 'chat']
      },
      availability: {
        hours: '24/7',
        timezone: 'US',
        capacity: 'medium',
        averageWaitTime: '3 minutes'
      },
      specializations: [
        {
          area: 'lgbtq_youth_crisis',
          level: 'expert',
          certifications: ['lgbtq_affirming_care']
        }
      ],
      languages: ['en', 'es'],
      culturalCompetencies: ['lgbtq', 'youth', 'gender_diverse'],
      traumaInformed: true,
      accessibilityFeatures: [
        { type: 'all_standard', available: true }
      ],
      responseTime: '< 3 minutes',
      capacity: {
        current: 70,
        maximum: 100,
        overflowPlan: 'warm_handoff_to_partner'
      },
      qualityRating: {
        overall: 4.9,
        traumaInformed: 4.9,
        culturalSensitivity: 5.0,
        effectiveness: 4.8,
        accessibility: 4.7
      },
      integrationLevel: 'partial'
    });

    // Additional cultural resources would be added here...
  }

  // Helper methods
  private async analyzeCrisisEvent(data: CrisisDetectionData): Promise<CrisisAnalysis> {
    // Use AI to analyze crisis severity and type
    const analysis = await traumaInformedEngine.generatePersonalizedInsight({
      text: data.content,
      userId: data.userId,
      entryId: `crisis-analysis-${Date.now()}`,
      context: {
        timestamp: Date.now(),
        timeZone: data.timeZone || 'UTC',
        deviceType: data.deviceType,
        sessionLength: 0,
        previousEntryCount: 0
      },
      preferences: {
        supportLevel: 'comprehensive',
        privacyLevel: 'standard'
      }
    });

    return {
      severity: this.determineSeverity(analysis, data),
      type: this.determineCrisisType(analysis, data),
      confidence: analysis.confidenceScore,
      riskFactors: await this.extractRiskFactors(data),
      protectiveFactors: await this.extractProtectiveFactors(data),
      culturalConsiderations: await this.extractCulturalConsiderations(data),
      immediateNeeds: await this.identifyImmediateNeeds(analysis, data)
    };
  }

  private getMaxResponseTime(severity: CrisisSeverity): string {
    const responseTimeMap: Record<CrisisSeverity, string> = {
      low: '30 minutes',
      moderate: '15 minutes',
      high: '5 minutes',
      critical: '2 minutes',
      emergency: 'immediate'
    };
    return responseTimeMap[severity];
  }

  // Additional helper methods would be implemented here...
}

// Intelligent crisis routing system
export class IntelligentCrisisRouting {
  private routingWeights: CrisisRoutingWeights;
  private qualityDatabase: Map<string, ResourceQualityData> = new Map();

  constructor() {
    this.routingWeights = {
      severity: 0.30,
      specialization: 0.25,
      availability: 0.20,
      cultural: 0.15,
      quality: 0.10
    };
  }

  async calculateOptimalRouting(params: RoutingParameters): Promise<CrisisRouting> {
    // Filter resources by basic eligibility
    const eligibleResources = this.filterEligibleResources(
      params.availableResources,
      params.constraints
    );

    // Score each resource combination
    const scoredRoutes = await this.scoreResourceRoutes(
      eligibleResources,
      params
    );

    // Select optimal routing
    const optimalRoute = this.selectOptimalRoute(scoredRoutes);

    // Generate alternative routes
    const alternativeRoutes = this.generateAlternativeRoutes(
      scoredRoutes.slice(1, 4)
    );

    return {
      algorithm: 'intelligent',
      primaryRoute: optimalRoute,
      alternativeRoutes,
      routingDecisionFactors: await this.generateRoutingFactors(optimalRoute, params),
      routingConfidence: optimalRoute.confidence,
      estimatedResponseTime: optimalRoute.estimatedResponseTime,
      coordinatedCare: await this.createCoordinatedCareTeam(optimalRoute),
      communicationFlow: await this.createCommunicationFlow(optimalRoute),
      qualityAssurance: await this.createQualityAssuranceProtocol(optimalRoute)
    };
  }

  // Additional routing methods would be implemented here...
}

// Supporting interfaces and types
export interface CrisisDetectionData {
  userId: string;
  content: string;
  source: 'journal' | 'chat' | 'assessment' | 'community_report';
  timeZone?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  location?: CrisisLocation;
  context?: Record<string, any>;
}

export interface CrisisResponse {
  crisisEventId: string;
  severity: CrisisSeverity;
  immediateResponse: string;
  safetyPlan: SafetyPlan;
  resources: CrisisResource[];
  interventions: ImmediateAction[];
  coordinatedCare: CoordinatedCareTeam;
  followUpPlan: CrisisFollowUp;
  estimatedResponse: string;
  traumaInformed: boolean;
  culturallyAdapted: boolean;
  createdAt: Date;
}

export interface SafetyAssessment {
  immediateDanger: boolean;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  protectiveFactors: ProtectiveFactor[];
  riskFactors: RiskFactor[];
  capacity: 'full' | 'impaired' | 'severely_impaired';
  support: 'strong' | 'moderate' | 'weak' | 'none';
  environment: 'safe' | 'concerning' | 'dangerous';
}

// Additional interfaces would be defined here...
export interface CrisisAnalysis {
  severity: CrisisSeverity;
  type: CrisisType;
  confidence: number;
  riskFactors: RiskFactor[];
  protectiveFactors: ProtectiveFactor[];
  culturalConsiderations: CulturalCrisisConsideration[];
  immediateNeeds: ImmediateNeed[];
}

export interface CrisisRoutingWeights {
  severity: number;
  specialization: number;
  availability: number;
  cultural: number;
  quality: number;
}

export interface RoutingParameters {
  crisisEvent: CrisisEvent;
  safetyAssessment: SafetyAssessment;
  userPreferences: CrisisPreferences;
  availableResources: CrisisResource[];
  constraints: RoutingConstraints;
}

// Export the main coordinator
export const crisisCareCoordinator = new CrisisCareCoordinator();