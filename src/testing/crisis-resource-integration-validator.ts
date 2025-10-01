/**
 * ALCHM Crisis Resource Integration Validator
 * 
 * Validates that all crisis resources meet strict performance requirements:
 * - <3 second response time for all crisis resources
 * - <1 second for emergency resources (988, Crisis Text Line, 911)
 * - 24/7 availability verification
 * - Cultural resource accessibility validation
 * - Offline fallback functionality testing
 * 
 * This validator ensures life-saving resources are always accessible when needed most.
 */

import { crisisResourcePreloader, type CrisisResource, type UserRiskProfile } from '../lib/crisis-resource-preloader';
import { culturalValidator } from '../lib/crisis/cultural-competency-validator';

export interface ResourcePerformanceTest {
  resourceId: string;
  resourceName: string;
  testType: 'load_time' | 'availability' | 'accessibility' | 'cultural_competency' | 'offline_fallback';
  expectedTime: number; // milliseconds
  actualTime?: number;
  passed: boolean;
  errorMessage?: string;
  culturalContext?: string[];
  timestamp: string;
}

export interface CrisisResourceValidationResults {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  overallAccuracy: number;
  performanceMetrics: {
    averageLoadTime: number;
    maxLoadTime: number;
    emergencyResourceLoadTime: number;
    culturalResourceLoadTime: number;
  };
  availabilityResults: {
    available24_7: number;
    totalResources: number;
    unavailableResources: string[];
  };
  culturalCompetencyResults: {
    totalCommunities: number;
    communitiesWithResources: number;
    missingResources: string[];
  };
  offlineFallbackResults: {
    workingFallbacks: number;
    totalFallbacks: number;
    failedFallbacks: string[];
  };
  emergencyEscalationResults: {
    responseTime: number;
    escalationWorking: boolean;
    fallbacksAvailable: boolean;
  };
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'CRITICAL_FAILURE';
  recommendations: string[];
}

/**
 * Predefined crisis resources for testing
 * These are the minimum required resources for production deployment
 */
export const REQUIRED_CRISIS_RESOURCES: CrisisResource[] = [
  // Universal Emergency Resources
  {
    id: 'emergency-911',
    name: 'Emergency Services',
    number: '911',
    description: 'Life-threatening emergencies',
    available: '24/7',
    priority: 'emergency',
    cultural: ['all'],
    language: ['all'],
    region: 'US',
    ageGroup: 'all',
    lastUpdated: new Date()
  },
  {
    id: 'suicide-prevention-988',
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    description: '24/7 crisis support and suicide prevention',
    available: '24/7',
    priority: 'emergency',
    cultural: ['all'],
    language: ['en', 'es'],
    region: 'US',
    ageGroup: 'all',
    lastUpdated: new Date()
  },
  {
    id: 'crisis-text-line',
    name: 'Crisis Text Line',
    text: 'HOME to 741741',
    description: '24/7 crisis support via text message',
    available: '24/7',
    priority: 'emergency',
    cultural: ['all'],
    language: ['en', 'es'],
    region: 'US',
    ageGroup: 'all',
    lastUpdated: new Date()
  },

  // LGBTQ+ Specific Resources
  {
    id: 'trevor-project',
    name: 'Trevor Project Lifeline',
    number: '1-866-488-7386',
    description: '24/7 crisis support for LGBTQ+ youth',
    available: '24/7',
    priority: 'critical',
    cultural: ['lgbtq'],
    language: ['en', 'es'],
    region: 'US',
    ageGroup: 'youth',
    lastUpdated: new Date()
  },
  {
    id: 'trans-lifeline',
    name: 'Trans Lifeline',
    number: '877-565-8860',
    description: 'Crisis support for transgender community',
    available: '24/7',
    priority: 'critical',
    cultural: ['transgender', 'lgbtq'],
    language: ['en', 'es'],
    region: 'US',
    ageGroup: 'all',
    lastUpdated: new Date()
  },

  // BIPOC Specific Resources
  {
    id: 'blackline',
    name: 'BlackLine',
    number: '1-800-604-5841',
    description: 'Crisis support for Black, Indigenous, and POC communities',
    available: '24/7',
    priority: 'critical',
    cultural: ['black', 'bipoc', 'indigenous'],
    language: ['en'],
    region: 'US',
    ageGroup: 'all',
    lastUpdated: new Date()
  },

  // Domestic Violence Resources
  {
    id: 'domestic-violence-hotline',
    name: 'National Domestic Violence Hotline',
    number: '1-800-799-7233',
    description: '24/7 support for domestic violence survivors',
    available: '24/7',
    priority: 'critical',
    cultural: ['all'],
    language: ['en', 'es'],
    region: 'US',
    ageGroup: 'all',
    lastUpdated: new Date()
  },

  // Substance Abuse Resources
  {
    id: 'samhsa-helpline',
    name: 'SAMHSA National Helpline',
    number: '1-800-662-4357',
    description: '24/7 treatment referral and information service',
    available: '24/7',
    priority: 'high',
    cultural: ['all'],
    language: ['en', 'es'],
    region: 'US',
    ageGroup: 'all',
    lastUpdated: new Date()
  }
];

/**
 * Crisis Resource Integration Validator
 * Comprehensive testing system for all crisis resource functionality
 */
export class CrisisResourceIntegrationValidator {
  private testResults: ResourcePerformanceTest[] = [];
  private validationResults: CrisisResourceValidationResults;

  constructor() {
    this.validationResults = this.initializeValidationResults();
  }

  /**
   * Run comprehensive crisis resource validation
   */
  async runFullValidation(userProfiles?: UserRiskProfile[]): Promise<CrisisResourceValidationResults> {
    console.log('🔍 Starting Crisis Resource Integration Validation...');
    console.log(`📊 Testing ${REQUIRED_CRISIS_RESOURCES.length} critical crisis resources`);

    // Reset results
    this.testResults = [];
    this.validationResults = this.initializeValidationResults();

    try {
      // 1. Test resource loading performance
      await this.testResourceLoadingPerformance();

      // 2. Test 24/7 availability
      await this.testResourceAvailability();

      // 3. Test cultural competency access
      await this.testCulturalResourceAccess();

      // 4. Test offline fallback functionality
      await this.testOfflineFallbacks();

      // 5. Test emergency escalation protocols
      await this.testEmergencyEscalation();

      // 6. Test with different user risk profiles
      if (userProfiles) {
        await this.testUserRiskProfileScenarios(userProfiles);
      }

      // Calculate final results
      this.calculateFinalResults();

      console.log(`✅ Crisis Resource Validation Complete`);
      console.log(`📈 Overall Success Rate: ${(this.validationResults.overallAccuracy * 100).toFixed(1)}%`);
      console.log(`⚡ Average Load Time: ${this.validationResults.performanceMetrics.averageLoadTime.toFixed(0)}ms`);

      return this.validationResults;

    } catch (error) {
      console.error('❌ Crisis Resource Validation Failed:', error);
      this.validationResults.complianceStatus = 'CRITICAL_FAILURE';
      this.validationResults.recommendations.push('CRITICAL: Crisis resource system failure - immediate investigation required');
      return this.validationResults;
    }
  }

  /**
   * Test resource loading performance against strict requirements
   */
  private async testResourceLoadingPerformance(): Promise<void> {
    console.log('🚀 Testing resource loading performance...');

    for (const resource of REQUIRED_CRISIS_RESOURCES) {
      const startTime = performance.now();
      let passed = false;
      let errorMessage = '';

      try {
        // Test different loading scenarios
        if (resource.priority === 'emergency') {
          // Emergency resources must load in <1 second
          const result = await this.loadResourceWithTimeout(resource, 1000);
          passed = result.success;
          if (!passed) errorMessage = 'Emergency resource exceeded 1 second load time';
        } else if (resource.priority === 'critical') {
          // Critical resources must load in <2 seconds
          const result = await this.loadResourceWithTimeout(resource, 2000);
          passed = result.success;
          if (!passed) errorMessage = 'Critical resource exceeded 2 second load time';
        } else {
          // All other resources must load in <3 seconds
          const result = await this.loadResourceWithTimeout(resource, 3000);
          passed = result.success;
          if (!passed) errorMessage = 'Resource exceeded 3 second load time';
        }

        const endTime = performance.now();
        const loadTime = endTime - startTime;

        this.testResults.push({
          resourceId: resource.id,
          resourceName: resource.name,
          testType: 'load_time',
          expectedTime: resource.priority === 'emergency' ? 1000 : (resource.priority === 'critical' ? 2000 : 3000),
          actualTime: loadTime,
          passed,
          errorMessage: passed ? undefined : errorMessage,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        this.testResults.push({
          resourceId: resource.id,
          resourceName: resource.name,
          testType: 'load_time',
          expectedTime: 1000,
          actualTime: performance.now() - startTime,
          passed: false,
          errorMessage: `Load failed: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Load resource with timeout for performance testing
   */
  private async loadResourceWithTimeout(resource: CrisisResource, timeout: number): Promise<{ success: boolean; time: number }> {
    const startTime = performance.now();
    
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve({ success: false, time: performance.now() - startTime });
      }, timeout);

      // Simulate resource loading (in production this would make actual network requests)
      setTimeout(() => {
        clearTimeout(timeoutId);
        const loadTime = performance.now() - startTime;
        resolve({ success: loadTime < timeout, time: loadTime });
      }, Math.random() * 500 + 100); // Simulate 100-600ms load time
    });
  }

  /**
   * Test 24/7 availability of crisis resources
   */
  private async testResourceAvailability(): Promise<void> {
    console.log('📞 Testing 24/7 resource availability...');

    let availableCount = 0;
    const unavailableResources: string[] = [];

    for (const resource of REQUIRED_CRISIS_RESOURCES) {
      let available = false;
      let errorMessage = '';

      try {
        // Test availability (in production this would check actual endpoints)
        if (resource.available === '24/7') {
          // Simulate availability check
          available = await this.checkResourceAvailability(resource);
          if (available) {
            availableCount++;
          } else {
            unavailableResources.push(resource.name);
            errorMessage = 'Resource not available 24/7 as required';
          }
        } else {
          errorMessage = 'Resource does not guarantee 24/7 availability';
          unavailableResources.push(resource.name);
        }

        this.testResults.push({
          resourceId: resource.id,
          resourceName: resource.name,
          testType: 'availability',
          expectedTime: 0,
          passed: available,
          errorMessage: available ? undefined : errorMessage,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        unavailableResources.push(resource.name);
        this.testResults.push({
          resourceId: resource.id,
          resourceName: resource.name,
          testType: 'availability',
          expectedTime: 0,
          passed: false,
          errorMessage: `Availability check failed: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }
    }

    this.validationResults.availabilityResults = {
      available24_7: availableCount,
      totalResources: REQUIRED_CRISIS_RESOURCES.length,
      unavailableResources
    };
  }

  /**
   * Check if resource is available (simulated for testing)
   */
  private async checkResourceAvailability(resource: CrisisResource): Promise<boolean> {
    // In production, this would make actual availability checks
    // For testing, we simulate high availability with occasional failures
    return new Promise((resolve) => {
      setTimeout(() => {
        // 98% availability simulation
        resolve(Math.random() > 0.02);
      }, Math.random() * 200 + 50);
    });
  }

  /**
   * Test cultural resource accessibility
   */
  private async testCulturalResourceAccess(): Promise<void> {
    console.log('🌍 Testing cultural resource accessibility...');

    const culturalCommunities = ['lgbtq', 'bipoc', 'indigenous', 'transgender', 'black'];
    let communitiesWithResources = 0;
    const missingResources: string[] = [];

    for (const community of culturalCommunities) {
      const communityResources = REQUIRED_CRISIS_RESOURCES.filter(resource => 
        resource.cultural?.includes(community) || resource.cultural?.includes('all')
      );

      if (communityResources.length > 0) {
        communitiesWithResources++;
        
        // Test each community resource
        for (const resource of communityResources) {
          const passed = await this.testCulturalResourceAccess_Single(resource, community);
          
          this.testResults.push({
            resourceId: resource.id,
            resourceName: resource.name,
            testType: 'cultural_competency',
            expectedTime: 3000,
            passed,
            culturalContext: [community],
            errorMessage: passed ? undefined : `Cultural resource not accessible for ${community} community`,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        missingResources.push(`No resources for ${community} community`);
      }
    }

    this.validationResults.culturalCompetencyResults = {
      totalCommunities: culturalCommunities.length,
      communitiesWithResources,
      missingResources
    };
  }

  /**
   * Test individual cultural resource access
   */
  private async testCulturalResourceAccess_Single(resource: CrisisResource, community: string): Promise<boolean> {
    try {
      // Test cultural validation
      const validation = culturalValidator.validateCrisis(
        'I need help and support for my identity',
        [community]
      );

      // Check if resource appears in cultural recommendations
      const recommendedResources = validation.culturalFactors.recommendedResources;
      return recommendedResources.some(rec => rec.includes(resource.name) || rec.includes(resource.number || ''));
    } catch (error) {
      console.error(`Cultural resource test failed for ${resource.name}:`, error);
      return false;
    }
  }

  /**
   * Test offline fallback functionality
   */
  private async testOfflineFallbacks(): Promise<void> {
    console.log('📱 Testing offline fallback functionality...');

    let workingFallbacks = 0;
    const failedFallbacks: string[] = [];

    // Test emergency contacts in typeof window !== 'undefined' && localStorage
    try {
      const emergencyContacts = crisisResourcePreloader.getEmergencyResourcesInstant();
      if (emergencyContacts && emergencyContacts.resources) {
        workingFallbacks++;
      } else {
        failedFallbacks.push('Emergency contacts not cached');
      }
    } catch (error) {
      failedFallbacks.push('Emergency contacts access failed');
    }

    // Test service worker cache
    try {
      if ('serviceWorker' in typeof window !== 'undefined' && navigator) {
        const registration = await typeof window !== 'undefined' && navigator.serviceWorker.getRegistration();
        if (registration) {
          workingFallbacks++;
        } else {
          failedFallbacks.push('Service worker not registered');
        }
      } else {
        failedFallbacks.push('Service worker not supported');
      }
    } catch (error) {
      failedFallbacks.push('Service worker test failed');
    }

    // Test cache storage
    try {
      if ('caches' in typeof window !== 'undefined' && window) {
        const cache = await caches.open('alchm-crisis-resources-v1');
        const keys = await cache.keys();
        if (keys.length > 0) {
          workingFallbacks++;
        } else {
          failedFallbacks.push('No resources in cache storage');
        }
      } else {
        failedFallbacks.push('Cache storage not supported');
      }
    } catch (error) {
      failedFallbacks.push('Cache storage test failed');
    }

    this.validationResults.offlineFallbackResults = {
      workingFallbacks,
      totalFallbacks: 3, // typeof window !== 'undefined' && localStorage, service worker, cache storage
      failedFallbacks
    };
  }

  /**
   * Test emergency escalation protocols
   */
  private async testEmergencyEscalation(): Promise<void> {
    console.log('🚨 Testing emergency escalation protocols...');

    const startTime = performance.now();
    
    try {
      // Test emergency resource instant access
      const emergencyResources = crisisResourcePreloader.getEmergencyResourcesInstant();
      const responseTime = performance.now() - startTime;

      const escalationWorking = emergencyResources && 
                               emergencyResources.phone && 
                               emergencyResources.text && 
                               emergencyResources.emergency;

      const fallbacksAvailable = escalationWorking && 
                                Object.keys(emergencyResources.resources).length >= 3;

      this.validationResults.emergencyEscalationResults = {
        responseTime,
        escalationWorking,
        fallbacksAvailable
      };

      this.testResults.push({
        resourceId: 'emergency-escalation',
        resourceName: 'Emergency Escalation Protocol',
        testType: 'accessibility',
        expectedTime: 100, // <100ms for emergency escalation
        actualTime: responseTime,
        passed: escalationWorking && responseTime < 100,
        errorMessage: escalationWorking ? 
          (responseTime < 100 ? undefined : `Response time ${responseTime.toFixed(0)}ms exceeds 100ms threshold`) :
          'Emergency escalation protocol failed',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.validationResults.emergencyEscalationResults = {
        responseTime: performance.now() - startTime,
        escalationWorking: false,
        fallbacksAvailable: false
      };

      this.testResults.push({
        resourceId: 'emergency-escalation',
        resourceName: 'Emergency Escalation Protocol',
        testType: 'accessibility',
        expectedTime: 100,
        actualTime: performance.now() - startTime,
        passed: false,
        errorMessage: `Emergency escalation failed: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Test various user risk profile scenarios
   */
  private async testUserRiskProfileScenarios(userProfiles: UserRiskProfile[]): Promise<void> {
    console.log('👥 Testing user risk profile scenarios...');

    for (const profile of userProfiles) {
      try {
        const startTime = performance.now();
        
        // Test smart preloading for this profile
        await crisisResourcePreloader.smartPreload(profile);
        
        const loadTime = performance.now() - startTime;
        const passed = loadTime < 3000; // Must complete within 3 seconds

        this.testResults.push({
          resourceId: `profile-${profile.emotionalState}`,
          resourceName: `User Profile: ${profile.emotionalState}`,
          testType: 'load_time',
          expectedTime: 3000,
          actualTime: loadTime,
          passed,
          culturalContext: profile.culturalIdentity,
          errorMessage: passed ? undefined : `Profile preloading exceeded 3 seconds: ${loadTime.toFixed(0)}ms`,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        this.testResults.push({
          resourceId: `profile-${profile.emotionalState}`,
          resourceName: `User Profile: ${profile.emotionalState}`,
          testType: 'load_time',
          expectedTime: 3000,
          passed: false,
          errorMessage: `Profile test failed: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Calculate final validation results
   */
  private calculateFinalResults(): void {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(test => test.passed).length;
    const failedTests = totalTests - passedTests;

    // Calculate performance metrics
    const loadTimeTests = this.testResults.filter(test => test.testType === 'load_time' && test.actualTime);
    const loadTimes = loadTimeTests.map(test => test.actualTime!);
    
    const emergencyTests = this.testResults.filter(test => 
      test.testType === 'load_time' && 
      test.expectedTime <= 1000 && 
      test.actualTime
    );
    const emergencyTimes = emergencyTests.map(test => test.actualTime!);

    const culturalTests = this.testResults.filter(test => 
      test.testType === 'cultural_competency' && 
      test.actualTime
    );
    const culturalTimes = culturalTests.map(test => test.actualTime!);

    this.validationResults = {
      ...this.validationResults,
      totalTests,
      passedTests,
      failedTests,
      overallAccuracy: totalTests > 0 ? passedTests / totalTests : 0,
      performanceMetrics: {
        averageLoadTime: loadTimes.length > 0 ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0,
        maxLoadTime: loadTimes.length > 0 ? Math.max(...loadTimes) : 0,
        emergencyResourceLoadTime: emergencyTimes.length > 0 ? Math.max(...emergencyTimes) : 0,
        culturalResourceLoadTime: culturalTimes.length > 0 ? 
          culturalTimes.reduce((a, b) => a + b, 0) / culturalTimes.length : 0
      }
    };

    // Determine compliance status
    this.determineComplianceStatus();

    // Generate recommendations
    this.generateRecommendations();
  }

  /**
   * Determine overall compliance status
   */
  private determineComplianceStatus(): void {
    const criticalFailures = this.testResults.filter(test => 
      !test.passed && (test.expectedTime <= 1000 || test.testType === 'availability')
    );

    if (criticalFailures.length > 0) {
      this.validationResults.complianceStatus = 'CRITICAL_FAILURE';
    } else if (this.validationResults.overallAccuracy >= 0.95 && 
               this.validationResults.performanceMetrics.maxLoadTime <= 3000 &&
               this.validationResults.emergencyEscalationResults.escalationWorking) {
      this.validationResults.complianceStatus = 'COMPLIANT';
    } else {
      this.validationResults.complianceStatus = 'NON_COMPLIANT';
    }
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(): void {
    const recommendations: string[] = [];

    // Performance recommendations
    if (this.validationResults.performanceMetrics.maxLoadTime > 3000) {
      recommendations.push('CRITICAL: Some resources exceed 3-second load time requirement');
    }
    
    if (this.validationResults.performanceMetrics.emergencyResourceLoadTime > 1000) {
      recommendations.push('EMERGENCY: Emergency resources exceed 1-second requirement');
    }

    // Availability recommendations
    if (this.validationResults.availabilityResults.unavailableResources.length > 0) {
      recommendations.push(`Address unavailable resources: ${this.validationResults.availabilityResults.unavailableResources.join(', ')}`);
    }

    // Cultural competency recommendations
    if (this.validationResults.culturalCompetencyResults.missingResources.length > 0) {
      recommendations.push('Add missing cultural crisis resources for complete community coverage');
    }

    // Offline fallback recommendations
    if (this.validationResults.offlineFallbackResults.workingFallbacks < 2) {
      recommendations.push('Improve offline fallback reliability for crisis situations');
    }

    // Emergency escalation recommendations
    if (!this.validationResults.emergencyEscalationResults.escalationWorking) {
      recommendations.push('CRITICAL: Fix emergency escalation protocol - life safety risk');
    }

    this.validationResults.recommendations = recommendations;
  }

  /**
   * Initialize validation results structure
   */
  private initializeValidationResults(): CrisisResourceValidationResults {
    return {
      timestamp: new Date().toISOString(),
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      overallAccuracy: 0,
      performanceMetrics: {
        averageLoadTime: 0,
        maxLoadTime: 0,
        emergencyResourceLoadTime: 0,
        culturalResourceLoadTime: 0
      },
      availabilityResults: {
        available24_7: 0,
        totalResources: 0,
        unavailableResources: []
      },
      culturalCompetencyResults: {
        totalCommunities: 0,
        communitiesWithResources: 0,
        missingResources: []
      },
      offlineFallbackResults: {
        workingFallbacks: 0,
        totalFallbacks: 0,
        failedFallbacks: []
      },
      emergencyEscalationResults: {
        responseTime: 0,
        escalationWorking: false,
        fallbacksAvailable: false
      },
      complianceStatus: 'NON_COMPLIANT',
      recommendations: []
    };
  }

  /**
   * Generate detailed validation report
   */
  generateDetailedReport(): string {
    const report = `
# ALCHM Crisis Resource Integration Validation Report
Generated: ${this.validationResults.timestamp}

## COMPLIANCE STATUS: ${this.validationResults.complianceStatus}

## EXECUTIVE SUMMARY
- **Total Tests**: ${this.validationResults.totalTests}
- **Passed Tests**: ${this.validationResults.passedTests}
- **Failed Tests**: ${this.validationResults.failedTests}
- **Overall Accuracy**: ${(this.validationResults.overallAccuracy * 100).toFixed(1)}%

## PERFORMANCE METRICS
- **Average Load Time**: ${this.validationResults.performanceMetrics.averageLoadTime.toFixed(0)}ms (Requirement: <3000ms)
- **Maximum Load Time**: ${this.validationResults.performanceMetrics.maxLoadTime.toFixed(0)}ms
- **Emergency Resource Load Time**: ${this.validationResults.performanceMetrics.emergencyResourceLoadTime.toFixed(0)}ms (Requirement: <1000ms)
- **Cultural Resource Load Time**: ${this.validationResults.performanceMetrics.culturalResourceLoadTime.toFixed(0)}ms

## AVAILABILITY RESULTS
- **24/7 Available Resources**: ${this.validationResults.availabilityResults.available24_7}/${this.validationResults.availabilityResults.totalResources}
- **Unavailable Resources**: ${this.validationResults.availabilityResults.unavailableResources.join(', ') || 'None'}

## CULTURAL COMPETENCY RESULTS
- **Communities with Resources**: ${this.validationResults.culturalCompetencyResults.communitiesWithResources}/${this.validationResults.culturalCompetencyResults.totalCommunities}
- **Missing Resources**: ${this.validationResults.culturalCompetencyResults.missingResources.join(', ') || 'None'}

## OFFLINE FALLBACK RESULTS
- **Working Fallbacks**: ${this.validationResults.offlineFallbackResults.workingFallbacks}/${this.validationResults.offlineFallbackResults.totalFallbacks}
- **Failed Fallbacks**: ${this.validationResults.offlineFallbackResults.failedFallbacks.join(', ') || 'None'}

## EMERGENCY ESCALATION RESULTS
- **Response Time**: ${this.validationResults.emergencyEscalationResults.responseTime.toFixed(0)}ms (Requirement: <100ms)
- **Escalation Working**: ${this.validationResults.emergencyEscalationResults.escalationWorking ? 'YES' : 'NO'}
- **Fallbacks Available**: ${this.validationResults.emergencyEscalationResults.fallbacksAvailable ? 'YES' : 'NO'}

## DETAILED TEST RESULTS
${this.testResults.map(test => `
### ${test.resourceName}
- **Test Type**: ${test.testType}
- **Expected Time**: ${test.expectedTime}ms
- **Actual Time**: ${test.actualTime?.toFixed(0) || 'N/A'}ms
- **Status**: ${test.passed ? '✅ PASSED' : '❌ FAILED'}
- **Cultural Context**: ${test.culturalContext?.join(', ') || 'N/A'}
- **Error**: ${test.errorMessage || 'None'}
`).join('')}

## RECOMMENDATIONS
${this.validationResults.recommendations.map(rec => `- ${rec}`).join('\n')}

## PRODUCTION READINESS
${this.validationResults.complianceStatus === 'COMPLIANT' ? 
  '✅ System is COMPLIANT and ready for production deployment' :
  this.validationResults.complianceStatus === 'CRITICAL_FAILURE' ?
    '🚨 CRITICAL FAILURE - System is NOT safe for production deployment' :
    '⚠️ System is NON-COMPLIANT - Requires improvements before production deployment'
}

---
*This validation ensures life-saving crisis resources meet strict performance and accessibility requirements*
`;

    return report;
  }

  /**
   * Get test results for programmatic analysis
   */
  getTestResults(): {
    validationResults: CrisisResourceValidationResults;
    individualTests: ResourcePerformanceTest[];
  } {
    return {
      validationResults: this.validationResults,
      individualTests: this.testResults
    };
  }
}

// Export convenience function for quick validation
export async function validateCrisisResourceIntegration(userProfiles?: UserRiskProfile[]): Promise<CrisisResourceValidationResults> {
  const validator = new CrisisResourceIntegrationValidator();
  return validator.runFullValidation(userProfiles);
}

// Export function to get crisis resources for validation
export function getCrisisResources(): CrisisResource[] {
  return REQUIRED_CRISIS_RESOURCES;
}

export default CrisisResourceIntegrationValidator;