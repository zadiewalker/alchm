// FHIR-Compliant Health Interoperability System
// Enables ALCHM to integrate with EHR systems, telemedicine platforms, and healthcare providers
// Maintains HIPAA compliance and trauma-informed care principles

import { z } from 'zod';
import { logger } from '@/lib/logging';

// FHIR R4 Resource Types for Mental Health
export interface FHIRPatient {
  resourceType: 'Patient';
  id?: string;
  identifier?: FHIRIdentifier[];
  name?: FHIRHumanName[];
  telecom?: FHIRContactPoint[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  address?: FHIRAddress[];
  communication?: FHIRPatientCommunication[];
  generalPractitioner?: FHIRReference[];
  managingOrganization?: FHIRReference;
}

export interface FHIRObservation {
  resourceType: 'Observation';
  id?: string;
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: FHIRCodeableConcept[];
  code: FHIRCodeableConcept;
  subject: FHIRReference;
  encounter?: FHIRReference;
  effectiveDateTime?: string;
  effectivePeriod?: FHIRPeriod;
  issued?: string;
  performer?: FHIRReference[];
  valueQuantity?: FHIRQuantity;
  valueCodeableConcept?: FHIRCodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  interpretation?: FHIRCodeableConcept[];
  note?: FHIRAnnotation[];
  component?: FHIRObservationComponent[];
}

export interface FHIRCarePlan {
  resourceType: 'CarePlan';
  id?: string;
  identifier?: FHIRIdentifier[];
  status: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed' | 'entered-in-error' | 'unknown';
  intent: 'proposal' | 'plan' | 'order' | 'option';
  category?: FHIRCodeableConcept[];
  title?: string;
  description?: string;
  subject: FHIRReference;
  encounter?: FHIRReference;
  period?: FHIRPeriod;
  created?: string;
  author?: FHIRReference;
  contributor?: FHIRReference[];
  careTeam?: FHIRReference[];
  addresses?: FHIRReference[];
  goal?: FHIRReference[];
  activity?: FHIRCarePlanActivity[];
}

export interface FHIRGoal {
  resourceType: 'Goal';
  id?: string;
  identifier?: FHIRIdentifier[];
  lifecycleStatus: 'proposed' | 'planned' | 'accepted' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'entered-in-error' | 'rejected';
  achievementStatus?: FHIRCodeableConcept;
  category?: FHIRCodeableConcept[];
  priority?: FHIRCodeableConcept;
  description: FHIRCodeableConcept;
  subject: FHIRReference;
  startDate?: string;
  startCodeableConcept?: FHIRCodeableConcept;
  target?: FHIRGoalTarget[];
  statusDate?: string;
  statusReason?: string;
  expressedBy?: FHIRReference;
  addresses?: FHIRReference[];
  note?: FHIRAnnotation[];
  outcomeCode?: FHIRCodeableConcept[];
  outcomeReference?: FHIRReference[];
}

export interface FHIREncounter {
  resourceType: 'Encounter';
  id?: string;
  identifier?: FHIRIdentifier[];
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled' | 'entered-in-error' | 'unknown';
  statusHistory?: FHIREncounterStatusHistory[];
  class: FHIRCoding;
  classHistory?: FHIREncounterClassHistory[];
  type?: FHIRCodeableConcept[];
  serviceType?: FHIRCodeableConcept;
  priority?: FHIRCodeableConcept;
  subject?: FHIRReference;
  episodeOfCare?: FHIRReference[];
  basedOn?: FHIRReference[];
  participant?: FHIREncounterParticipant[];
  appointment?: FHIRReference[];
  period?: FHIRPeriod;
  length?: FHIRDuration;
  reasonCode?: FHIRCodeableConcept[];
  reasonReference?: FHIRReference[];
  diagnosis?: FHIREncounterDiagnosis[];
  account?: FHIRReference[];
  hospitalization?: FHIREncounterHospitalization;
  location?: FHIREncounterLocation[];
  serviceProvider?: FHIRReference;
}

// Supporting FHIR data types
export interface FHIRIdentifier {
  use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old';
  type?: FHIRCodeableConcept;
  system?: string;
  value?: string;
  period?: FHIRPeriod;
  assigner?: FHIRReference;
}

export interface FHIRHumanName {
  use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden';
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  period?: FHIRPeriod;
}

export interface FHIRContactPoint {
  system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value?: string;
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  rank?: number;
  period?: FHIRPeriod;
}

export interface FHIRAddress {
  use?: 'home' | 'work' | 'temp' | 'old' | 'billing';
  type?: 'postal' | 'physical' | 'both';
  text?: string;
  line?: string[];
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  period?: FHIRPeriod;
}

export interface FHIRReference {
  reference?: string;
  type?: string;
  identifier?: FHIRIdentifier;
  display?: string;
}

export interface FHIRCodeableConcept {
  coding?: FHIRCoding[];
  text?: string;
}

export interface FHIRCoding {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
}

export interface FHIRQuantity {
  value?: number;
  comparator?: '<' | '<=' | '>=' | '>';
  unit?: string;
  system?: string;
  code?: string;
}

export interface FHIRPeriod {
  start?: string;
  end?: string;
}

export interface FHIRAnnotation {
  authorReference?: FHIRReference;
  authorString?: string;
  time?: string;
  text: string;
}

// Mental Health Specific FHIR Extensions
export interface MentalHealthObservation extends FHIRObservation {
  category: FHIRCodeableConcept[];
  code: FHIRCodeableConcept;
  component?: MentalHealthComponent[];
  traumaInformed?: boolean;
  culturalContext?: FHIRCodeableConcept;
  privacyLevel?: 'standard' | 'enhanced' | 'restricted';
}

export interface MentalHealthComponent extends FHIRObservationComponent {
  code: FHIRCodeableConcept;
  valueQuantity?: FHIRQuantity;
  valueCodeableConcept?: FHIRCodeableConcept;
  valueString?: string;
  traumaSafe?: boolean;
}

export interface TraumaInformedCarePlan extends FHIRCarePlan {
  category: FHIRCodeableConcept[];
  traumaInformedPrinciples: TraumaInformedPrinciple[];
  culturalAdaptations?: CulturalAdaptation[];
  safetyPlan?: SafetyPlanReference;
  triggerAwareness?: TriggerAwareness[];
}

export interface TraumaInformedPrinciple {
  principle: 'safety' | 'trustworthiness' | 'choice' | 'collaboration' | 'empowerment';
  implementation: string;
  evidence: FHIRReference[];
}

// FHIR Interoperability Engine
export class FHIRInteroperabilityEngine {
  private fhirEndpoints: Map<string, FHIREndpoint> = new Map();
  private patientMappings: Map<string, PatientMapping> = new Map();

  constructor() {
    this.initializeStandardTerminologies();
  }

  // Register FHIR endpoint for healthcare integration
  async registerFHIREndpoint(endpoint: FHIREndpoint): Promise<void> {
    try {
      // Validate FHIR endpoint
      await this.validateFHIREndpoint(endpoint);
      
      // Test connectivity
      await this.testFHIRConnectivity(endpoint);
      
      // Store endpoint configuration
      this.fhirEndpoints.set(endpoint.id, endpoint);
      
      logger.info('FHIR endpoint registered', {
        id: endpoint.id,
        baseUrl: endpoint.baseUrl,
        version: endpoint.fhirVersion
      });
      
    } catch (error) {
      logger.error('Failed to register FHIR endpoint', error);
      throw error;
    }
  }

  // Convert ALCHM wellness data to FHIR observations
  async convertToFHIRObservations(
    userId: string,
    wellnessData: ALCHMWellnessData[]
  ): Promise<MentalHealthObservation[]> {
    const observations: MentalHealthObservation[] = [];
    const patientReference = await this.getPatientReference(userId);

    for (const data of wellnessData) {
      try {
        const observation = await this.mapToFHIRObservation(data, patientReference);
        if (observation) {
          observations.push(observation);
        }
      } catch (error) {
        logger.warn('Failed to convert wellness data to FHIR', { data, error });
      }
    }

    return observations;
  }

  // Create trauma-informed care plan
  async createTraumaInformedCarePlan(
    userId: string,
    pathwayData: PathwayData
  ): Promise<TraumaInformedCarePlan> {
    const patientReference = await this.getPatientReference(userId);
    
    const carePlan: TraumaInformedCarePlan = {
      resourceType: 'CarePlan',
      identifier: [{
        system: 'https://alchm.app/care-plan',
        value: `pathway-${pathwayData.id}`
      }],
      status: 'active',
      intent: 'plan',
      category: [{
        coding: [{
          system: 'http://snomed.info/sct',
          code: '386053000',
          display: 'Evaluation procedure'
        }, {
          system: 'https://alchm.app/care-categories',
          code: 'trauma-informed-care',
          display: 'Trauma-Informed Care'
        }]
      }],
      title: pathwayData.name,
      description: pathwayData.description,
      subject: patientReference,
      period: {
        start: new Date().toISOString(),
        end: pathwayData.expectedCompletion
      },
      created: new Date().toISOString(),
      traumaInformedPrinciples: [
        {
          principle: 'safety',
          implementation: 'All interventions prioritize physical and emotional safety',
          evidence: []
        },
        {
          principle: 'trustworthiness',
          implementation: 'Building trust through transparency and reliability',
          evidence: []
        },
        {
          principle: 'choice',
          implementation: 'User maintains control over their healing journey',
          evidence: []
        },
        {
          principle: 'collaboration',
          implementation: 'Shared decision-making in treatment planning',
          evidence: []
        },
        {
          principle: 'empowerment',
          implementation: 'Focus on strengths and resilience building',
          evidence: []
        }
      ],
      culturalAdaptations: pathwayData.culturalAdaptations,
      activity: await this.convertPathwayToCarePlanActivities(pathwayData)
    };

    return carePlan;
  }

  // Sync with healthcare provider systems
  async syncWithHealthcareProvider(
    providerId: string,
    userId: string,
    dataTypes: FHIRResourceType[]
  ): Promise<SyncResult> {
    const endpoint = this.fhirEndpoints.get(providerId);
    if (!endpoint) {
      throw new Error(`Healthcare provider ${providerId} not registered`);
    }

    const patientReference = await this.getPatientReference(userId);
    const syncResults: SyncResult = {
      providerId,
      userId,
      syncedResources: [],
      errors: [],
      timestamp: new Date()
    };

    // Sync each requested resource type
    for (const resourceType of dataTypes) {
      try {
        const result = await this.syncResourceType(endpoint, patientReference, resourceType);
        syncResults.syncedResources.push(result);
      } catch (error) {
        syncResults.errors.push({
          resourceType,
          error: error.message
        });
        logger.warn(`Failed to sync ${resourceType} for user ${userId}`, error);
      }
    }

    return syncResults;
  }

  // Create mental health assessment from ALCHM journal data
  async createMentalHealthAssessment(
    userId: string,
    journalEntries: JournalEntry[],
    assessmentType: MentalHealthAssessmentType
  ): Promise<MentalHealthObservation[]> {
    const patientReference = await this.getPatientReference(userId);
    const observations: MentalHealthObservation[] = [];

    // Analyze journal entries for mental health indicators
    const analysis = await this.analyzeMentalHealthIndicators(journalEntries);

    // Create mood observation
    if (analysis.moodData) {
      observations.push({
        resourceType: 'Observation',
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'survey',
            display: 'Survey'
          }]
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '72133-2',
            display: 'Mood assessment'
          }]
        },
        subject: patientReference,
        effectiveDateTime: new Date().toISOString(),
        valueCodeableConcept: {
          coding: [{
            system: 'https://alchm.app/mood-scale',
            code: analysis.moodData.primaryMood,
            display: analysis.moodData.primaryMood
          }]
        },
        component: analysis.moodData.components?.map(comp => ({
          code: {
            coding: [{
              system: 'https://alchm.app/mood-components',
              code: comp.type,
              display: comp.display
            }]
          },
          valueQuantity: {
            value: comp.value,
            unit: comp.unit,
            system: 'http://unitsofmeasure.org'
          },
          traumaSafe: true
        })),
        traumaInformed: true,
        culturalContext: analysis.culturalContext,
        privacyLevel: 'enhanced'
      });
    }

    // Create anxiety level observation
    if (analysis.anxietyLevel) {
      observations.push({
        resourceType: 'Observation',
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'survey',
            display: 'Survey'
          }]
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '72133-2',
            display: 'Anxiety assessment'
          }]
        },
        subject: patientReference,
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: {
          value: analysis.anxietyLevel,
          unit: 'score',
          system: 'http://unitsofmeasure.org'
        },
        traumaInformed: true,
        privacyLevel: 'enhanced'
      });
    }

    return observations;
  }

  // Share wellness insights with healthcare team
  async shareWellnessInsights(
    userId: string,
    providerId: string,
    insights: WellnessInsight[],
    consentScope: ConsentScope
  ): Promise<ShareResult> {
    const endpoint = this.fhirEndpoints.get(providerId);
    if (!endpoint) {
      throw new Error(`Provider ${providerId} not found`);
    }

    // Convert insights to FHIR observations
    const observations = await this.convertInsightsToFHIR(userId, insights);
    
    // Filter based on consent scope
    const filteredObservations = this.applyConsentFiltering(observations, consentScope);
    
    // Apply trauma-informed sharing principles
    const traumaInformedObservations = await this.applyTraumaInformedSharing(
      filteredObservations,
      userId
    );

    const shareResults: ShareResult = {
      userId,
      providerId,
      sharedResources: [],
      errors: [],
      timestamp: new Date()
    };

    // Share each observation
    for (const observation of traumaInformedObservations) {
      try {
        const result = await this.postFHIRResource(endpoint, observation);
        shareResults.sharedResources.push({
          resourceType: 'Observation',
          resourceId: result.id,
          status: 'shared'
        });
      } catch (error) {
        shareResults.errors.push({
          resourceType: 'Observation',
          error: error.message
        });
      }
    }

    return shareResults;
  }

  // Private helper methods
  private async initializeStandardTerminologies(): void {
    // Initialize standard terminologies for mental health
    // LOINC codes for mental health assessments
    // SNOMED CT codes for mental health conditions
    // Custom ALCHM terminology for trauma-informed care
  }

  private async validateFHIREndpoint(endpoint: FHIREndpoint): Promise<void> {
    if (!endpoint.baseUrl || !endpoint.fhirVersion) {
      throw new Error('Invalid FHIR endpoint configuration');
    }

    if (!endpoint.security || !endpoint.security.tokenEndpoint) {
      throw new Error('FHIR endpoint must support OAuth 2.0');
    }
  }

  private async testFHIRConnectivity(endpoint: FHIREndpoint): Promise<void> {
    try {
      // Test FHIR capability statement
      const response = await fetch(`${endpoint.baseUrl}/metadata`, {
        headers: {
          'Accept': 'application/fhir+json',
          'Authorization': `Bearer ${await this.getAccessToken(endpoint)}`
        }
      });

      if (!response.ok) {
        throw new Error(`FHIR endpoint test failed: ${response.status}`);
      }

      const capability = await response.json();
      logger.info('FHIR endpoint connectivity confirmed', {
        endpoint: endpoint.id,
        version: capability.fhirVersion
      });

    } catch (error) {
      logger.error('FHIR connectivity test failed', error);
      throw error;
    }
  }

  private async getPatientReference(userId: string): Promise<FHIRReference> {
    const mapping = this.patientMappings.get(userId);
    if (mapping) {
      return {
        reference: `Patient/${mapping.fhirPatientId}`,
        display: mapping.displayName
      };
    }

    // Create new patient mapping
    const patientId = `alchm-${userId}`;
    this.patientMappings.set(userId, {
      alchUserid: userId,
      fhirPatientId: patientId,
      displayName: 'ALCHM User'
    });

    return {
      reference: `Patient/${patientId}`,
      display: 'ALCHM User'
    };
  }

  private async mapToFHIRObservation(
    data: ALCHMWellnessData,
    patientRef: FHIRReference
  ): Promise<MentalHealthObservation | null> {
    // Map ALCHM wellness data to FHIR observation based on data type
    switch (data.type) {
      case 'mood':
        return this.createMoodObservation(data, patientRef);
      case 'anxiety':
        return this.createAnxietyObservation(data, patientRef);
      case 'journaling':
        return this.createJournalingObservation(data, patientRef);
      default:
        return null;
    }
  }

  private createMoodObservation(
    data: ALCHMWellnessData,
    patientRef: FHIRReference
  ): MentalHealthObservation {
    return {
      resourceType: 'Observation',
      status: 'final',
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/observation-category',
          code: 'survey',
          display: 'Survey'
        }]
      }],
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '72133-2',
          display: 'Mood assessment'
        }]
      },
      subject: patientRef,
      effectiveDateTime: new Date(data.timestamp).toISOString(),
      valueString: data.value as string,
      traumaInformed: true,
      privacyLevel: 'enhanced'
    };
  }

  private createAnxietyObservation(
    data: ALCHMWellnessData,
    patientRef: FHIRReference
  ): MentalHealthObservation {
    return {
      resourceType: 'Observation',
      status: 'final',
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/observation-category',
          code: 'survey',
          display: 'Survey'
        }]
      }],
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '72133-2',
          display: 'Anxiety level assessment'
        }]
      },
      subject: patientRef,
      effectiveDateTime: new Date(data.timestamp).toISOString(),
      valueQuantity: {
        value: data.value as number,
        unit: 'score',
        system: 'http://unitsofmeasure.org'
      },
      traumaInformed: true,
      privacyLevel: 'enhanced'
    };
  }

  private createJournalingObservation(
    data: ALCHMWellnessData,
    patientRef: FHIRReference
  ): MentalHealthObservation {
    return {
      resourceType: 'Observation',
      status: 'final',
      category: [{
        coding: [{
          system: 'https://alchm.app/observation-categories',
          code: 'journaling',
          display: 'Journaling Activity'
        }]
      }],
      code: {
        coding: [{
          system: 'https://alchm.app/codes',
          code: 'journal-entry',
          display: 'Journal Entry Reflection'
        }]
      },
      subject: patientRef,
      effectiveDateTime: new Date(data.timestamp).toISOString(),
      note: [{
        text: 'Patient completed self-reflection journaling exercise'
      }],
      traumaInformed: true,
      privacyLevel: 'restricted'
    };
  }

  private async getAccessToken(endpoint: FHIREndpoint): Promise<string> {
    // Implement OAuth 2.0 token acquisition
    // This would use client credentials flow for system-to-system access
    return 'mock-token'; // Placeholder
  }

  private async postFHIRResource(endpoint: FHIREndpoint, resource: any): Promise<any> {
    const response = await fetch(`${endpoint.baseUrl}/${resource.resourceType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/fhir+json',
        'Authorization': `Bearer ${await this.getAccessToken(endpoint)}`
      },
      body: JSON.stringify(resource)
    });

    if (!response.ok) {
      throw new Error(`Failed to post FHIR resource: ${response.status}`);
    }

    return await response.json();
  }

  // Additional helper methods would be implemented here...
}

// Supporting interfaces
export interface FHIREndpoint {
  id: string;
  name: string;
  baseUrl: string;
  fhirVersion: string;
  security: FHIRSecurity;
  capabilities: string[];
  traumaInformedCompliant: boolean;
}

export interface FHIRSecurity {
  tokenEndpoint: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
}

export interface PatientMapping {
  alchUserId: string;
  fhirPatientId: string;
  displayName: string;
  consentLevel: 'minimal' | 'standard' | 'comprehensive';
}

export interface ALCHMWellnessData {
  type: string;
  value: any;
  timestamp: number;
  source: string;
  metadata?: Record<string, any>;
}

export interface PathwayData {
  id: string;
  name: string;
  description: string;
  expectedCompletion: string;
  culturalAdaptations?: CulturalAdaptation[];
}

export interface SyncResult {
  providerId: string;
  userId: string;
  syncedResources: ResourceSyncResult[];
  errors: SyncError[];
  timestamp: Date;
}

export interface ResourceSyncResult {
  resourceType: string;
  count: number;
  lastUpdated: Date;
}

export interface SyncError {
  resourceType: string;
  error: string;
}

export interface ConsentScope {
  dataTypes: string[];
  purposes: string[];
  recipients: string[];
  retention: string;
}

export interface ShareResult {
  userId: string;
  providerId: string;
  sharedResources: SharedResource[];
  errors: ShareError[];
  timestamp: Date;
}

export interface SharedResource {
  resourceType: string;
  resourceId: string;
  status: 'shared' | 'failed';
}

export interface ShareError {
  resourceType: string;
  error: string;
}

export type FHIRResourceType = 'Patient' | 'Observation' | 'CarePlan' | 'Goal' | 'Encounter';
export type MentalHealthAssessmentType = 'mood' | 'anxiety' | 'depression' | 'trauma' | 'comprehensive';

// Additional FHIR interfaces would be defined here...
export interface FHIRObservationComponent {
  code: FHIRCodeableConcept;
  valueQuantity?: FHIRQuantity;
  valueCodeableConcept?: FHIRCodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  dataAbsentReason?: FHIRCodeableConcept;
}

export interface FHIRPatientCommunication {
  language: FHIRCodeableConcept;
  preferred?: boolean;
}

export interface FHIRCarePlanActivity {
  outcomeCodeableConcept?: FHIRCodeableConcept[];
  outcomeReference?: FHIRReference[];
  progress?: FHIRAnnotation[];
  reference?: FHIRReference;
  detail?: FHIRCarePlanActivityDetail;
}

export interface FHIRCarePlanActivityDetail {
  kind?: 'Appointment' | 'CommunicationRequest' | 'DeviceRequest' | 'DiagnosticReport' | 'MedicationRequest' | 'NutritionOrder' | 'Task' | 'ServiceRequest' | 'VisionPrescription';
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  code?: FHIRCodeableConcept;
  reasonCode?: FHIRCodeableConcept[];
  reasonReference?: FHIRReference[];
  goal?: FHIRReference[];
  status: 'not-started' | 'scheduled' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled' | 'stopped' | 'unknown' | 'entered-in-error';
  statusReason?: FHIRCodeableConcept;
  doNotPerform?: boolean;
  scheduledTiming?: FHIRTiming;
  scheduledPeriod?: FHIRPeriod;
  scheduledString?: string;
  location?: FHIRReference;
  performer?: FHIRReference[];
  productCodeableConcept?: FHIRCodeableConcept;
  productReference?: FHIRReference;
  dailyAmount?: FHIRQuantity;
  quantity?: FHIRQuantity;
  description?: string;
}

export interface FHIRGoalTarget {
  measure?: FHIRCodeableConcept;
  detailQuantity?: FHIRQuantity;
  detailRange?: FHIRRange;
  detailCodeableConcept?: FHIRCodeableConcept;
  detailString?: string;
  detailBoolean?: boolean;
  detailInteger?: number;
  detailRatio?: FHIRRatio;
  dueDate?: string;
  dueDuration?: FHIRDuration;
}

export interface FHIRTiming {
  event?: string[];
  repeat?: FHIRTimingRepeat;
  code?: FHIRCodeableConcept;
}

export interface FHIRTimingRepeat {
  boundsDuration?: FHIRDuration;
  boundsRange?: FHIRRange;
  boundsPeriod?: FHIRPeriod;
  count?: number;
  countMax?: number;
  duration?: number;
  durationMax?: number;
  durationUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';
  frequency?: number;
  frequencyMax?: number;
  period?: number;
  periodMax?: number;
  periodUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';
  dayOfWeek?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  timeOfDay?: string[];
  when?: ('MORN' | 'MORN.early' | 'MORN.late' | 'NOON' | 'AFT' | 'AFT.early' | 'AFT.late' | 'EVE' | 'EVE.early' | 'EVE.late' | 'NIGHT' | 'PHS' | 'HS' | 'WAKE' | 'C' | 'CM' | 'CD' | 'CV' | 'AC' | 'ACM' | 'ACD' | 'ACV' | 'PC' | 'PCM' | 'PCD' | 'PCV')[];
  offset?: number;
}

export interface FHIRDuration {
  value?: number;
  comparator?: '<' | '<=' | '>=' | '>';
  unit?: string;
  system?: string;
  code?: string;
}

export interface FHIRRange {
  low?: FHIRQuantity;
  high?: FHIRQuantity;
}

export interface FHIRRatio {
  numerator?: FHIRQuantity;
  denominator?: FHIRQuantity;
}

// Export the main FHIR engine
export const fhirInteroperabilityEngine = new FHIRInteroperabilityEngine();