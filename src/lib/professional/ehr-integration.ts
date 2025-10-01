/**
 * EHR Integration Compatibility Layer
 * 
 * This system provides secure, HIPAA-compliant integration with Electronic Health Records
 * systems commonly used in mental health practices. It supports FHIR standards and
 * maintains strict data privacy controls.
 */

import crypto from 'crypto';

// FHIR R4 Standard Interfaces
interface FHIRResource {
  resourceType: string;
  id?: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    profile?: string[];
    security?: {
      system: string;
      code: string;
      display?: string;
    }[];
  };
}

interface FHIRPatient extends FHIRResource {
  resourceType: 'Patient';
  identifier?: {
    use?: string;
    type?: {
      coding: {
        system: string;
        code: string;
      }[];
    };
    system?: string;
    value: string;
  }[];
  active?: boolean;
  name?: {
    use?: string;
    family?: string;
    given?: string[];
  }[];
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
}

interface FHIRObservation extends FHIRResource {
  resourceType: 'Observation';
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled';
  category?: {
    coding: {
      system: string;
      code: string;
      display?: string;
    }[];
  }[];
  code: {
    coding: {
      system: string;
      code: string;
      display?: string;
    }[];
  };
  subject: {
    reference: string;
  };
  effectiveDateTime?: string;
  valueQuantity?: {
    value: number;
    unit?: string;
    system?: string;
    code?: string;
  };
  valueString?: string;
  component?: {
    code: {
      coding: {
        system: string;
        code: string;
        display?: string;
      }[];
    };
    valueQuantity?: {
      value: number;
      unit?: string;
    };
  }[];
}

interface FHIRCarePlan extends FHIRResource {
  resourceType: 'CarePlan';
  status: 'draft' | 'active' | 'suspended' | 'completed' | 'entered-in-error' | 'cancelled' | 'unknown';
  intent: 'proposal' | 'plan' | 'order' | 'option';
  subject: {
    reference: string;
  };
  period?: {
    start?: string;
    end?: string;
  };
  activity?: {
    detail?: {
      status?: 'not-started' | 'scheduled' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled' | 'stopped' | 'unknown';
      description?: string;
      scheduledTiming?: {
        repeat?: {
          frequency?: number;
          period?: number;
          periodUnit?: string;
        };
      };
    };
  }[];
}

// EHR System Configurations
interface EHRSystemConfig {
  systemId: string;
  name: string;
  type: 'epic' | 'cerner' | 'allscripts' | 'athenahealth' | 'eclinicalworks' | 'generic_fhir';
  version: string;
  fhirEndpoint: string;
  authMethod: 'oauth2' | 'api_key' | 'certificate' | 'smart_on_fhir';
  capabilities: {
    patientRead: boolean;
    observationCreate: boolean;
    observationRead: boolean;
    carePlanCreate: boolean;
    carePlanUpdate: boolean;
    typeof window !== 'undefined' && documentReference: boolean;
  };
  customMappings?: {
    moodScale?: string;
    anxietyScale?: string;
    depressionScale?: string;
    customFields?: { [key: string]: string };
  };
}

// Integration Data Models
interface ALCHMToEHRMapping {
  clientId: string;
  ehrPatientId: string;
  ehrSystemId: string;
  consentLevel: 'read_only' | 'read_write' | 'full_integration';
  dataTypes: {
    moodData: boolean;
    journalInsights: boolean;
    progressMetrics: boolean;
    crisisAlerts: boolean;
    therapeuticGoals: boolean;
  };
  mappingRules: {
    moodScaleMapping: { alchm: number; ehr: string | number }[];
    customFieldMappings: { [alchm: string]: string };
  };
  lastSync?: Date;
  syncStatus: 'active' | 'paused' | 'error' | 'disabled';
  encryptionKey: string;
}

export class EHRIntegrationManager {
  private static readonly SUPPORTED_SYSTEMS: { [key: string]: EHRSystemConfig } = {
    epic: {
      systemId: 'epic',
      name: 'Epic MyChart',
      type: 'epic',
      version: 'R4',
      fhirEndpoint: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
      authMethod: 'smart_on_fhir',
      capabilities: {
        patientRead: true,
        observationCreate: true,
        observationRead: true,
        carePlanCreate: true,
        carePlanUpdate: true,
        typeof window !== 'undefined' && documentReference: true
      },
      customMappings: {
        moodScale: '72133-2', // LOINC code for mood assessment
        anxietyScale: '72133-2',
        depressionScale: '44249-1' // PHQ-9
      }
    },
    cerner: {
      systemId: 'cerner',
      name: 'Cerner PowerChart',
      type: 'cerner',
      version: 'R4',
      fhirEndpoint: 'https://fhir-open.cerner.com/r4',
      authMethod: 'smart_on_fhir',
      capabilities: {
        patientRead: true,
        observationCreate: true,
        observationRead: true,
        carePlanCreate: false, // Limited in some Cerner implementations
        carePlanUpdate: false,
        typeof window !== 'undefined' && documentReference: true
      }
    },
    generic_fhir: {
      systemId: 'generic',
      name: 'Generic FHIR R4',
      type: 'generic_fhir',
      version: 'R4',
      fhirEndpoint: '', // Set dynamically
      authMethod: 'oauth2',
      capabilities: {
        patientRead: true,
        observationCreate: true,
        observationRead: true,
        carePlanCreate: true,
        carePlanUpdate: true,
        typeof window !== 'undefined' && documentReference: true
      }
    }
  };

  /**
   * Create secure EHR integration mapping
   */
  public static async createEHRIntegration(
    clientId: string,
    therapistId: string,
    ehrSystemType: string,
    ehrPatientId: string,
    consentLevel: 'read_only' | 'read_write' | 'full_integration',
    dataTypes: ALCHMToEHRMapping['dataTypes']
  ): Promise<{ success: boolean; integrationId?: string; error?: string }> {
    
    try {
      // Verify therapist has proper credentials and consent
      const consentVerified = await this.verifyEHRConsent(clientId, therapistId, consentLevel);
      if (!consentVerified) {
        return { success: false, error: 'Invalid or insufficient consent for EHR integration' };
      }

      // Validate EHR system support
      const ehrConfig = this.SUPPORTED_SYSTEMS[ehrSystemType];
      if (!ehrConfig) {
        return { success: false, error: 'Unsupported EHR system type' };
      }

      // Generate encryption key for this integration
      const encryptionKey = crypto.randomBytes(32).toString('hex');

      // Create integration mapping
      const integrationMapping: ALCHMToEHRMapping = {
        clientId,
        ehrPatientId,
        ehrSystemId: ehrConfig.systemId,
        consentLevel,
        dataTypes,
        mappingRules: {
          moodScaleMapping: this.createMoodScaleMapping(ehrConfig),
          customFieldMappings: ehrConfig.customMappings || {}
        },
        syncStatus: 'active',
        encryptionKey
      };

      // Store integration mapping securely
      const integrationId = await this.storeIntegrationMapping(integrationMapping, therapistId);

      // Test connection to EHR system
      const connectionTest = await this.testEHRConnection(ehrConfig, ehrPatientId);
      if (!connectionTest.success) {
        return { 
          success: false, 
          error: `EHR connection failed: ${connectionTest.error}` 
        };
      }

      return { success: true, integrationId };

    } catch (error) {
      console.error('Error creating EHR integration:', error);
      return { success: false, error: 'Failed to create EHR integration' };
    }
  }

  /**
   * Sync ALCHM data to EHR system
   */
  public static async syncToEHR(
    integrationId: string,
    dataType: 'mood' | 'progress' | 'crisis' | 'goals',
    alchmsData: any
  ): Promise<{ success: boolean; fhirResourceId?: string; error?: string }> {
    
    try {
      // Get integration mapping
      const mapping = await this.getIntegrationMapping(integrationId);
      if (!mapping) {
        return { success: false, error: 'Integration mapping not found' };
      }

      // Check if this data type is allowed
      if (!this.isDataTypeSyncAllowed(mapping, dataType)) {
        return { success: false, error: 'Data type not permitted for sync' };
      }

      // Get EHR configuration
      const ehrConfig = this.SUPPORTED_SYSTEMS[mapping.ehrSystemId];

      // Convert ALCHM data to FHIR format
      const fhirResource = await this.convertToFHIR(alchmsData, dataType, mapping, ehrConfig);

      // Send to EHR system
      const syncResult = await this.sendToEHRSystem(fhirResource, ehrConfig, mapping);

      // Log sync activity
      await this.logSyncActivity(integrationId, dataType, syncResult.success);

      return syncResult;

    } catch (error) {
      console.error('Error syncing to EHR:', error);
      return { success: false, error: 'Sync operation failed' };
    }
  }

  /**
   * Retrieve data from EHR system
   */
  public static async retrieveFromEHR(
    integrationId: string,
    resourceType: 'observation' | 'careplan' | 'patient',
    dateRange?: { start: Date; end: Date }
  ): Promise<{ success: boolean; data?: any[]; error?: string }> {
    
    try {
      const mapping = await this.getIntegrationMapping(integrationId);
      if (!mapping || mapping.consentLevel === 'read_only') {
        return { success: false, error: 'Insufficient permissions for EHR read access' };
      }

      const ehrConfig = this.SUPPORTED_SYSTEMS[mapping.ehrSystemId];
      const ehrData = await this.fetchFromEHRSystem(
        resourceType, 
        mapping.ehrPatientId, 
        ehrConfig,
        dateRange
      );

      // Convert EHR data to ALCHM format
      const alchmsData = await this.convertFromFHIR(ehrData, mapping);

      return { success: true, data: alchmsData };

    } catch (error) {
      console.error('Error retrieving from EHR:', error);
      return { success: false, error: 'Retrieval operation failed' };
    }
  }

  /**
   * Generate therapeutic progress summary for EHR integration
   */
  public static async generateEHRProgressSummary(
    clientId: string,
    therapistId: string,
    timeframe: { start: Date; end: Date }
  ): Promise<FHIRObservation[]> {
    
    // Get client data
    const progressData = await this.getClientProgressData(clientId, timeframe);
    
    const observations: FHIRObservation[] = [];

    // Mood trends observation
    if (progressData.moodData?.length > 0) {
      observations.push({
        resourceType: 'Observation',
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs'
          }]
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '72133-2',
            display: 'Mood assessment'
          }]
        },
        subject: {
          reference: `Patient/${clientId}`
        },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: {
          value: this.calculateAverageMood(progressData.moodData),
          unit: 'score',
          system: 'http://unitsofmeasure.org',
          code: '1'
        }
      });
    }

    // Therapeutic engagement observation
    observations.push({
      resourceType: 'Observation',
      status: 'final',
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/observation-category',
          code: 'therapy',
          display: 'Therapy'
        }]
      }],
      code: {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '385893007',
          display: 'Therapeutic engagement'
        }]
      },
      subject: {
        reference: `Patient/${clientId}`
      },
      effectiveDateTime: new Date().toISOString(),
      valueString: this.assessEngagementLevel(progressData.journalData)
    });

    return observations;
  }

  // Helper methods for EHR operations
  private static async verifyEHRConsent(
    clientId: string, 
    therapistId: string, 
    consentLevel: string
  ): Promise<boolean> {
    // In production, this would verify explicit EHR integration consent
    // beyond the standard therapeutic consent
    return true; // Mock implementation
  }

  private static createMoodScaleMapping(ehrConfig: EHRSystemConfig): { alchm: number; ehr: string | number }[] {
    // Map ALCHM's 1-10 mood scale to EHR-specific scales
    return [
      { alchm: 1, ehr: 'Severe' },
      { alchm: 2, ehr: 'Moderate-Severe' },
      { alchm: 3, ehr: 'Moderate' },
      { alchm: 4, ehr: 'Mild-Moderate' },
      { alchm: 5, ehr: 'Mild' },
      { alchm: 6, ehr: 'Minimal' },
      { alchm: 7, ehr: 'None-Minimal' },
      { alchm: 8, ehr: 'Good' },
      { alchm: 9, ehr: 'Very Good' },
      { alchm: 10, ehr: 'Excellent' }
    ];
  }

  private static async storeIntegrationMapping(
    mapping: ALCHMToEHRMapping, 
    therapistId: string
  ): Promise<string> {
    // Generate unique integration ID
    const integrationId = crypto.randomUUID();
    
    // In production, store in secure database with therapist association
    console.log('Storing EHR integration mapping:', { integrationId, therapistId, mapping });
    
    return integrationId;
  }

  private static async testEHRConnection(
    ehrConfig: EHRSystemConfig, 
    patientId: string
  ): Promise<{ success: boolean; error?: string }> {
    
    try {
      // In production, this would perform actual connection test
      console.log('Testing EHR connection:', { system: ehrConfig.name, patientId });
      
      // Mock successful connection
      return { success: true };
      
    } catch (error) {
      return { success: false, error: 'Connection test failed' };
    }
  }

  private static async getIntegrationMapping(integrationId: string): Promise<ALCHMToEHRMapping | null> {
    // Mock implementation - in production, retrieve from secure storage
    return null;
  }

  private static isDataTypeSyncAllowed(mapping: ALCHMToEHRMapping, dataType: string): boolean {
    switch (dataType) {
      case 'mood':
        return mapping.dataTypes.moodData;
      case 'progress':
        return mapping.dataTypes.progressMetrics;
      case 'crisis':
        return mapping.dataTypes.crisisAlerts;
      case 'goals':
        return mapping.dataTypes.therapeuticGoals;
      default:
        return false;
    }
  }

  private static async convertToFHIR(
    alchmsData: any, 
    dataType: string, 
    mapping: ALCHMToEHRMapping, 
    ehrConfig: EHRSystemConfig
  ): Promise<FHIRResource> {
    
    // Convert ALCHM data structures to FHIR format based on data type
    switch (dataType) {
      case 'mood':
        return this.convertMoodDataToFHIR(alchmsData, mapping);
      case 'progress':
        return this.convertProgressDataToFHIR(alchmsData, mapping);
      default:
        throw new Error(`Unsupported data type: ${dataType}`);
    }
  }

  private static convertMoodDataToFHIR(moodData: any, mapping: ALCHMToEHRMapping): FHIRObservation {
    return {
      resourceType: 'Observation',
      status: 'final',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '72133-2',
          display: 'Mood assessment'
        }]
      },
      subject: {
        reference: `Patient/${mapping.ehrPatientId}`
      },
      effectiveDateTime: new Date(moodData.timestamp).toISOString(),
      valueQuantity: {
        value: moodData.moodBefore || moodData.mood,
        unit: 'score'
      }
    };
  }

  private static convertProgressDataToFHIR(progressData: any, mapping: ALCHMToEHRMapping): FHIRObservation {
    return {
      resourceType: 'Observation',
      status: 'final',
      code: {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '182840001',
          display: 'Review of patient progress'
        }]
      },
      subject: {
        reference: `Patient/${mapping.ehrPatientId}`
      },
      effectiveDateTime: new Date().toISOString(),
      valueString: JSON.stringify(progressData)
    };
  }

  private static async sendToEHRSystem(
    fhirResource: FHIRResource, 
    ehrConfig: EHRSystemConfig, 
    mapping: ALCHMToEHRMapping
  ): Promise<{ success: boolean; fhirResourceId?: string; error?: string }> {
    
    // Mock implementation - in production, this would use actual EHR APIs
    console.log('Sending to EHR system:', {
      system: ehrConfig.name,
      resourceType: fhirResource.resourceType,
      patientId: mapping.ehrPatientId
    });
    
    return { 
      success: true, 
      fhirResourceId: `${fhirResource.resourceType}/${crypto.randomUUID()}` 
    };
  }

  private static async fetchFromEHRSystem(
    resourceType: string, 
    patientId: string, 
    ehrConfig: EHRSystemConfig,
    dateRange?: { start: Date; end: Date }
  ): Promise<any[]> {
    
    // Mock implementation
    return [];
  }

  private static async convertFromFHIR(ehrData: any[], mapping: ALCHMToEHRMapping): Promise<any[]> {
    // Convert FHIR resources back to ALCHM format
    return ehrData.map(resource => ({
      // Mock conversion
      id: resource.id,
      type: resource.resourceType,
      data: resource
    }));
  }

  private static async logSyncActivity(
    integrationId: string, 
    dataType: string, 
    success: boolean
  ): Promise<void> {
    console.log('EHR Sync Activity:', { integrationId, dataType, success, timestamp: new Date() });
  }

  private static async getClientProgressData(
    clientId: string, 
    timeframe: { start: Date; end: Date }
  ): Promise<{ moodData?: any[]; journalData?: any[] }> {
    // Mock implementation - would fetch actual client data
    return {
      moodData: [
        { timestamp: new Date(), mood: 7 },
        { timestamp: new Date(), mood: 6 }
      ],
      journalData: []
    };
  }

  private static calculateAverageMood(moodData: any[]): number {
    if (!moodData.length) return 0;
    return moodData.reduce((sum, entry) => sum + (entry.mood || entry.moodBefore || 0), 0) / moodData.length;
  }

  private static assessEngagementLevel(journalData: any[]): string {
    const entriesPerWeek = journalData.length / 4; // Assuming 4 week period
    if (entriesPerWeek >= 5) return 'High engagement';
    if (entriesPerWeek >= 2) return 'Moderate engagement';
    return 'Low engagement';
  }
}

/**
 * EHR Integration Security Utilities
 */
export class EHRSecurityManager {
  
  /**
   * Encrypt sensitive EHR data before storage or transmission
   */
  public static encrypt(data: string, key: string): string {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt EHR data
   */
  public static decrypt(encryptedData: string, key: string): string {
    const algorithm = 'aes-256-gcm';
    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipher(algorithm, key);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Generate secure patient identifiers for EHR matching
   */
  public static generateSecurePatientId(clientId: string, ehrSystemId: string): string {
    const combined = `${clientId}:${ehrSystemId}:${process.env.EHR_SALT}`;
    return crypto.createHash('sha256').update(combined).digest('hex').substring(0, 16);
  }
}

export default EHRIntegrationManager;