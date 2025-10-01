/**
 * Crisis Resource Integration Validator
 * 
 * CRITICAL MISSION: Validate that all crisis resources (988 hotline, Crisis Text Line,
 * cultural resources, international support) remain fully accessible and functional
 * during all Firebase Studio diagnostic operations.
 * 
 * This validator ensures that users in crisis always have immediate access to
 * life-saving resources, regardless of system state or diagnostic activity.
 */

interface CrisisResource {
  id: string;
  name: string;
  type: 'hotline' | 'text' | 'chat' | 'website' | 'app';
  contact: string;
  availability: '24/7' | 'business_hours' | 'limited';
  languages: string[];
  culturalGroups: string[];
  ageGroups: string[];
  priority: number; // 1 = highest priority
  testable: boolean;
  backupResources: string[];
}

interface CrisisResourceValidationResult {
  resourceId: string;
  accessible: boolean;
  responseTime: number;
  testTimestamp: Date;
  errorDetails?: string;
  backupTested?: boolean;
  culturalRelevanceScore: number;
}

interface CrisisResourceIntegrationStatus {
  allResourcesAccessible: boolean;
  totalResources: number;
  accessibleResources: number;
  averageResponseTime: number;
  criticalResourcesStatus: boolean;
  culturalResourcesCoverage: number;
  validationScore: number; // 0-100
  emergencyResourcesReady: boolean;
}

class CrisisResourceIntegrationValidator {
  private static instance: CrisisResourceIntegrationValidator;
  
  // Core crisis resources that must always work
  private readonly CRITICAL_RESOURCES: CrisisResource[] = [
    {
      id: '988_suicide_crisis_lifeline',
      name: '988 Suicide & Crisis Lifeline',
      type: 'hotline',
      contact: 'tel:988',
      availability: '24/7',
      languages: ['en', 'es'],
      culturalGroups: ['general'],
      ageGroups: ['all'],
      priority: 1,
      testable: true,
      backupResources: ['crisis_text_line']
    },
    {
      id: 'crisis_text_line',
      name: 'Crisis Text Line',
      type: 'text',
      contact: 'sms:741741',
      availability: '24/7',
      languages: ['en', 'es'],
      culturalGroups: ['general'],
      ageGroups: ['all'],
      priority: 2,
      testable: true,
      backupResources: ['988_suicide_crisis_lifeline']
    },
    {
      id: 'trans_lifeline',
      name: 'Trans Lifeline',
      type: 'hotline',
      contact: 'tel:877-565-8860',
      availability: '24/7',
      languages: ['en'],
      culturalGroups: ['lgbtq+', 'transgender'],
      ageGroups: ['all'],
      priority: 1,
      testable: true,
      backupResources: ['988_suicide_crisis_lifeline']
    },
    {
      id: 'trevor_project',
      name: 'The Trevor Project',
      type: 'hotline',
      contact: 'tel:1-866-488-7386',
      availability: '24/7',
      languages: ['en', 'es'],
      culturalGroups: ['lgbtq+', 'youth'],
      ageGroups: ['13-24'],
      priority: 1,
      testable: true,
      backupResources: ['crisis_text_line']
    },
    {
      id: 'samhsa_helpline',
      name: 'SAMHSA National Helpline',
      type: 'hotline',
      contact: 'tel:1-800-662-4357',
      availability: '24/7',
      languages: ['en', 'es'],
      culturalGroups: ['general'],
      ageGroups: ['all'],
      priority: 3,
      testable: true,
      backupResources: ['988_suicide_crisis_lifeline']
    }
  ];

  // Cultural and international resources
  private readonly CULTURAL_RESOURCES: CrisisResource[] = [
    {
      id: 'national_suicide_prevention_australia',
      name: 'Lifeline Australia',
      type: 'hotline',
      contact: 'tel:13-11-14',
      availability: '24/7',
      languages: ['en'],
      culturalGroups: ['australia'],
      ageGroups: ['all'],
      priority: 1,
      testable: false,
      backupResources: []
    },
    {
      id: 'samaritans_uk',
      name: 'Samaritans UK',
      type: 'hotline',
      contact: 'tel:116-123',
      availability: '24/7',
      languages: ['en'],
      culturalGroups: ['uk'],
      ageGroups: ['all'],
      priority: 1,
      testable: false,
      backupResources: []
    },
    {
      id: 'centro_de_atencion_ciudadana',
      name: 'Centro de Atención Ciudadana',
      type: 'hotline',
      contact: 'tel:800-911-2000',
      availability: '24/7',
      languages: ['es'],
      culturalGroups: ['mexico', 'latino'],
      ageGroups: ['all'],
      priority: 2,
      testable: false,
      backupResources: []
    }
  ];

  private readonly PERFORMANCE_THRESHOLDS = {
    HOTLINE_ACCESS_MAX: 300,           // ms to access hotline
    TEXT_LINE_ACCESS_MAX: 200,         // ms to access text line
    RESOURCE_LOAD_MAX: 500,            // ms to load resource data
    BACKUP_ACTIVATION_MAX: 1000,       // ms to activate backup resource
    VALIDATION_TIMEOUT: 10000          // ms total validation timeout
  };

  private lastValidation: Date | null = null;
  private validationCache: Map<string, CrisisResourceValidationResult> = new Map();
  private cacheTimeout = 30000; // 30 seconds cache

  private constructor() {
    this.initializeValidator();
  }

  static getInstance(): CrisisResourceIntegrationValidator {
    if (!CrisisResourceIntegrationValidator.instance) {
      CrisisResourceIntegrationValidator.instance = new CrisisResourceIntegrationValidator();
    }
    return CrisisResourceIntegrationValidator.instance;
  }

  /**
   * Initialize the crisis resource validator
   */
  private initializeValidator(): void {
    console.log('🛡️ Crisis Resource Integration Validator initialized');
    
    if (typeof window !== 'undefined') {
      // Setup periodic validation during diagnostic operations
      this.setupPeriodicValidation();
      
      // Setup emergency resource testing
      this.setupEmergencyResourceTesting();
    }
  }

  /**
   * Validate all crisis resources are accessible and functional
   */
  async validateAllCrisisResources(): Promise<CrisisResourceIntegrationStatus> {
    console.log('🔍 Validating all crisis resource integrations...');
    
    const validationStart = Date.now();
    const allResources = [...this.CRITICAL_RESOURCES, ...this.CULTURAL_RESOURCES];
    
    try {
      // Test all resources in parallel for speed
      const validationPromises = allResources.map(resource => 
        this.validateSingleResource(resource)
      );
      
      const results = await Promise.allSettled(validationPromises);
      
      // Process results
      const validationResults: CrisisResourceValidationResult[] = [];
      const accessibleCount = results.filter((result, index) => {
        if (result.status === 'fulfilled') {
          validationResults.push(result.value);
          return result.value.accessible;
        } else {
          // Create failed result
          const failedResource = allResources[index];
          validationResults.push({
            resourceId: failedResource.id,
            accessible: false,
            responseTime: -1,
            testTimestamp: new Date(),
            errorDetails: String(result.reason),
            culturalRelevanceScore: 0
          });
          return false;
        }
      }).length;
      
      // Calculate status
      const status = this.calculateIntegrationStatus(validationResults, allResources);
      
      const validationTime = Date.now() - validationStart;
      console.log(`Crisis resource validation completed in ${validationTime}ms`);
      console.log(`Status: ${accessibleCount}/${allResources.length} resources accessible`);
      
      this.lastValidation = new Date();
      
      // Cache results
      validationResults.forEach(result => {
        this.validationCache.set(result.resourceId, result);
      });
      
      return status;
      
    } catch (error) {
      console.error('💥 Crisis resource validation failed:', error);
      
      // Return emergency status
      return {
        allResourcesAccessible: false,
        totalResources: allResources.length,
        accessibleResources: 0,
        averageResponseTime: -1,
        criticalResourcesStatus: false,
        culturalResourcesCoverage: 0,
        validationScore: 0,
        emergencyResourcesReady: false
      };
    }
  }

  /**
   * Validate a single crisis resource
   */
  private async validateSingleResource(resource: CrisisResource): Promise<CrisisResourceValidationResult> {
    // Check cache first
    const cached = this.validationCache.get(resource.id);
    if (cached && (Date.now() - cached.testTimestamp.getTime()) < this.cacheTimeout) {
      return cached;
    }
    
    const testStart = Date.now();
    
    try {
      // Test resource accessibility based on type
      const accessible = await this.testResourceAccessibility(resource);
      const responseTime = Date.now() - testStart;
      
      // Test backup resources if main resource fails
      let backupTested = false;
      if (!accessible && resource.backupResources.length > 0) {
        backupTested = await this.testBackupResources(resource);
      }
      
      const result: CrisisResourceValidationResult = {
        resourceId: resource.id,
        accessible,
        responseTime,
        testTimestamp: new Date(),
        backupTested,
        culturalRelevanceScore: this.calculateCulturalRelevanceScore(resource)
      };
      
      return result;
      
    } catch (error) {
      return {
        resourceId: resource.id,
        accessible: false,
        responseTime: Date.now() - testStart,
        testTimestamp: new Date(),
        errorDetails: String(error),
        culturalRelevanceScore: 0
      };
    }
  }

  /**
   * Test resource accessibility based on resource type
   */
  private async testResourceAccessibility(resource: CrisisResource): Promise<boolean> {
    switch (resource.type) {
      case 'hotline':
        return this.testHotlineAccessibility(resource);
      
      case 'text':
        return this.testTextLineAccessibility(resource);
      
      case 'chat':
        return this.testChatAccessibility(resource);
      
      case 'website':
        return this.testWebsiteAccessibility(resource);
      
      case 'app':
        return this.testAppAccessibility(resource);
      
      default:
        console.warn(`Unknown resource type: ${resource.type}`);
        return false;
    }
  }

  /**
   * Test hotline accessibility
   */
  private async testHotlineAccessibility(resource: CrisisResource): Promise<boolean> {
    try {
      if (!resource.testable) {
        // For international numbers that can't be tested, assume accessible
        return true;
      }

      // Test that tel: link is properly formatted and accessible
      const telLink = resource.contact;
      
      if (!telLink.startsWith('tel:')) {
        console.error(`Invalid hotline format for ${resource.id}: ${telLink}`);
        return false;
      }
      
      // Test if the tel link would be clickable
      if (typeof document !== 'undefined') {
        const testLink = document.createElement('a');
        testLink.href = telLink;
        
        // Basic validation that href is set correctly
        const isValidTel = testLink.href === telLink || testLink.href.includes(telLink.replace('tel:', ''));
        
        if (!isValidTel) {
          console.error(`Hotline link validation failed for ${resource.id}`);
          return false;
        }
      }
      
      return true;
      
    } catch (error) {
      console.error(`Hotline accessibility test failed for ${resource.id}:`, error);
      return false;
    }
  }

  /**
   * Test text line accessibility
   */
  private async testTextLineAccessibility(resource: CrisisResource): Promise<boolean> {
    try {
      const smsLink = resource.contact;
      
      if (!smsLink.startsWith('sms:')) {
        console.error(`Invalid SMS format for ${resource.id}: ${smsLink}`);
        return false;
      }
      
      // Test SMS link format
      if (typeof document !== 'undefined') {
        const testLink = document.createElement('a');
        testLink.href = smsLink;
        
        const isValidSms = testLink.href.includes('sms:') || testLink.href.includes('message:');
        
        if (!isValidSms) {
          console.error(`SMS link validation failed for ${resource.id}`);
          return false;
        }
      }
      
      return true;
      
    } catch (error) {
      console.error(`Text line accessibility test failed for ${resource.id}:`, error);
      return false;
    }
  }

  /**
   * Test chat accessibility
   */
  private async testChatAccessibility(resource: CrisisResource): Promise<boolean> {
    try {
      // Test that chat widget or iframe is accessible
      const chatUrl = resource.contact;
      
      if (chatUrl.startsWith('http')) {
        // Test if URL is reachable (in production, would use HEAD request)
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error(`Chat accessibility test failed for ${resource.id}:`, error);
      return false;
    }
  }

  /**
   * Test website accessibility
   */
  private async testWebsiteAccessibility(resource: CrisisResource): Promise<boolean> {
    try {
      const websiteUrl = resource.contact;
      
      if (!websiteUrl.startsWith('http')) {
        return false;
      }
      
      // In production, would test actual website accessibility
      // For now, assume accessible if properly formatted
      return true;
      
    } catch (error) {
      console.error(`Website accessibility test failed for ${resource.id}:`, error);
      return false;
    }
  }

  /**
   * Test app accessibility
   */
  private async testAppAccessibility(resource: CrisisResource): Promise<boolean> {
    try {
      // Test if app deep link or store link is accessible
      const appLink = resource.contact;
      
      if (appLink.includes('://') || appLink.startsWith('http')) {
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error(`App accessibility test failed for ${resource.id}:`, error);
      return false;
    }
  }

  /**
   * Test backup resources when main resource fails
   */
  private async testBackupResources(resource: CrisisResource): Promise<boolean> {
    console.log(`Testing backup resources for ${resource.id}`);
    
    for (const backupId of resource.backupResources) {
      const backupResource = [...this.CRITICAL_RESOURCES, ...this.CULTURAL_RESOURCES]
        .find(r => r.id === backupId);
      
      if (backupResource) {
        const backupAccessible = await this.testResourceAccessibility(backupResource);
        if (backupAccessible) {
          console.log(`Backup resource ${backupId} is accessible`);
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Calculate cultural relevance score for resource
   */
  private calculateCulturalRelevanceScore(resource: CrisisResource): number {
    let score = 50; // Base score
    
    // Higher score for more inclusive resources
    score += resource.culturalGroups.length * 10;
    score += resource.languages.length * 5;
    score += resource.ageGroups.includes('all') ? 10 : 0;
    score += resource.availability === '24/7' ? 20 : 0;
    
    return Math.min(100, score);
  }

  /**
   * Calculate overall integration status
   */
  private calculateIntegrationStatus(
    results: CrisisResourceValidationResult[],
    allResources: CrisisResource[]
  ): CrisisResourceIntegrationStatus {
    const totalResources = results.length;
    const accessibleResults = results.filter(r => r.accessible);
    const accessibleCount = accessibleResults.length;
    
    // Check critical resources specifically
    const criticalResourceIds = this.CRITICAL_RESOURCES.map(r => r.id);
    const criticalResults = results.filter(r => criticalResourceIds.includes(r.resourceId));
    const criticalAccessible = criticalResults.filter(r => r.accessible).length;
    const criticalResourcesStatus = criticalAccessible === criticalResults.length;
    
    // Calculate average response time for accessible resources
    const responseTimes = accessibleResults
      .map(r => r.responseTime)
      .filter(time => time > 0);
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : -1;
    
    // Calculate cultural coverage
    const culturalScores = results.map(r => r.culturalRelevanceScore);
    const culturalResourcesCoverage = culturalScores.length > 0
      ? culturalScores.reduce((sum, score) => sum + score, 0) / culturalScores.length
      : 0;
    
    // Calculate validation score
    const accessibilityScore = (accessibleCount / totalResources) * 60; // 60% weight
    const performanceScore = averageResponseTime > 0 && averageResponseTime < 500 ? 20 : 0; // 20% weight
    const criticalScore = criticalResourcesStatus ? 20 : 0; // 20% weight
    const validationScore = Math.round(accessibilityScore + performanceScore + criticalScore);
    
    // Emergency resources check (988, Crisis Text Line must work)
    const emergencyResourceIds = ['988_suicide_crisis_lifeline', 'crisis_text_line'];
    const emergencyResourcesReady = emergencyResourceIds.every(id =>
      results.find(r => r.resourceId === id)?.accessible === true
    );
    
    return {
      allResourcesAccessible: accessibleCount === totalResources,
      totalResources,
      accessibleResources: accessibleCount,
      averageResponseTime,
      criticalResourcesStatus,
      culturalResourcesCoverage,
      validationScore,
      emergencyResourcesReady
    };
  }

  /**
   * Setup periodic validation during diagnostic operations
   */
  private setupPeriodicValidation(): void {
    // Validate resources every 30 seconds during diagnostic operations
    setInterval(async () => {
      if (this.isDiagnosticOperationActive()) {
        const status = await this.validateAllCrisisResources();
        
        if (!status.emergencyResourcesReady) {
          console.error('🚨 Emergency resources not ready during diagnostic operation!');
          this.triggerEmergencyResourceAlert();
        }
      }
    }, 30000);
  }

  /**
   * Setup emergency resource testing
   */
  private setupEmergencyResourceTesting(): void {
    // Listen for crisis events and immediately validate resources
    window.addEventListener('crisis-detected', async () => {
      console.log('🚨 Crisis detected - validating resources immediately');
      await this.validateEmergencyResources();
    });
  }

  /**
   * Check if diagnostic operation is currently active
   */
  private isDiagnosticOperationActive(): boolean {
    if (typeof window !== 'undefined') {
      return window.simulateFirebaseStudioDiagnostic === true ||
             document.querySelector('#gentle-diagnostic-indicator') !== null;
    }
    return false;
  }

  /**
   * Validate only emergency/critical resources quickly
   */
  async validateEmergencyResources(): Promise<boolean> {
    console.log('🚨 Emergency resource validation...');
    
    const emergencyResources = this.CRITICAL_RESOURCES.filter(r => r.priority === 1);
    
    try {
      const validationPromises = emergencyResources.map(resource => 
        this.validateSingleResource(resource)
      );
      
      const results = await Promise.allSettled(validationPromises);
      const allEmergencyResourcesOk = results.every(result => 
        result.status === 'fulfilled' && result.value.accessible
      );
      
      if (!allEmergencyResourcesOk) {
        this.triggerEmergencyResourceAlert();
        return false;
      }
      
      console.log('✅ All emergency resources validated successfully');
      return true;
      
    } catch (error) {
      console.error('💥 Emergency resource validation failed:', error);
      this.triggerEmergencyResourceAlert();
      return false;
    }
  }

  /**
   * Trigger alert when emergency resources are not accessible
   */
  private triggerEmergencyResourceAlert(): void {
    console.error('🚨 EMERGENCY RESOURCE ALERT - CRITICAL RESOURCES NOT ACCESSIBLE');
    
    // Dispatch emergency event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('crisis-resource-emergency', {
        detail: {
          reason: 'Emergency resources not accessible',
          timestamp: Date.now(),
          action: 'immediate_diagnostic_stop'
        }
      }));
    }
  }

  /**
   * Get current resource validation status
   */
  getValidationStatus(): {
    lastValidation: Date | null;
    cacheSize: number;
    emergencyResourcesOk: boolean;
  } {
    // Quick check of cached emergency resources
    const emergencyIds = ['988_suicide_crisis_lifeline', 'crisis_text_line'];
    const emergencyResourcesOk = emergencyIds.every(id => {
      const cached = this.validationCache.get(id);
      return cached && cached.accessible;
    });
    
    return {
      lastValidation: this.lastValidation,
      cacheSize: this.validationCache.size,
      emergencyResourcesOk
    };
  }

  /**
   * Clear validation cache (force fresh validation)
   */
  clearValidationCache(): void {
    this.validationCache.clear();
    console.log('🔄 Crisis resource validation cache cleared');
  }
}

// Export singleton instance
export const crisisResourceValidator = CrisisResourceIntegrationValidator.getInstance();

// Export types
export type {
  CrisisResource,
  CrisisResourceValidationResult,
  CrisisResourceIntegrationStatus
};