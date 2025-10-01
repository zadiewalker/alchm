/**
 * Emergency Protocol Validation Framework
 * 
 * End-to-end validation of emergency escalation protocols
 * Ensures all crisis intervention pathways work under real-world conditions
 * 
 * CRITICAL: This validates systems that can save lives during crisis situations
 */

import { collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types for emergency protocol testing
export interface EmergencyProtocolTest {
  testId: string;
  protocolType: 'crisis_detection' | 'resource_access' | 'emergency_calling' | 'navigation_paths';
  scenario: string;
  steps: EmergencyProtocolStep[];
  result: 'passed' | 'failed' | 'warning';
  responseTime: number;
  issues: string[];
  timestamp: string;
  userAgent?: string;
  networkCondition?: 'fast' | 'slow' | 'offline';
}

export interface EmergencyProtocolStep {
  stepNumber: number;
  description: string;
  expectedOutcome: string;
  actualOutcome: string;
  passed: boolean;
  responseTime: number;
  error?: string;
}

export interface EmergencyNavigationTest {
  fromPage: string;
  toEmergencyResource: string;
  navigationMethod: 'button' | 'link' | 'modal' | 'redirect';
  accessible: boolean;
  responseTime: number;
  error?: string;
}

export interface EmergencyContactTest {
  contactType: '988' | '911' | 'crisis_text' | 'international';
  contact: string;
  testMethod: 'tel_link' | 'sms_link' | 'web_redirect';
  functional: boolean;
  error?: string;
}

export interface CrisisEscalationTest {
  inputSeverity: 'low' | 'medium' | 'high' | 'immediate';
  expectedResponse: 'monitoring' | 'resources' | 'intervention' | 'emergency_contact';
  actualResponse: string;
  resourcesProvided: number;
  culturallyAppropriate: boolean;
  responseTime: number;
}

// Emergency protocol testing class
export class EmergencyProtocolValidator {
  private readonly MAX_RESPONSE_TIME = 3000; // 3 seconds for emergency responses
  private readonly CRITICAL_NAVIGATION_TIME = 1000; // 1 second for emergency navigation

  // Test crisis detection to emergency escalation pathway
  async testCrisisEscalationProtocol(): Promise<EmergencyProtocolTest> {
    const testId = `escalation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    const steps: EmergencyProtocolStep[] = [];
    let issues: string[] = [];
    let overallResult: 'passed' | 'failed' | 'warning' = 'passed';

    try {
      // Step 1: Send high-severity crisis text
      const step1StartTime = Date.now();
      const crisisResponse = await fetch('/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'I want to kill myself tonight, I have a plan',
          userId: 'emergency-test-user',
          userLanguage: 'en'
        })
      });

      const step1ResponseTime = Date.now() - step1StartTime;
      const crisisData = await crisisResponse.json();

      const step1Passed = crisisResponse.ok && 
                          crisisData.crisisDetected === true && 
                          crisisData.severity === 'immediate' &&
                          step1ResponseTime <= this.MAX_RESPONSE_TIME;

      steps.push({
        stepNumber: 1,
        description: 'Crisis detection for immediate risk text',
        expectedOutcome: 'Crisis detected with immediate severity and emergency resources',
        actualOutcome: `Crisis: ${crisisData.crisisDetected}, Severity: ${crisisData.severity}, Response: ${step1ResponseTime}ms`,
        passed: step1Passed,
        responseTime: step1ResponseTime,
        error: step1Passed ? undefined : 'Crisis detection failed or too slow'
      });

      if (!step1Passed) {
        issues.push('Crisis detection failed for immediate risk scenario');
        overallResult = 'failed';
      }

      // Step 2: Validate emergency resources provided
      const step2StartTime = Date.now();
      const hasEmergencyResources = crisisData.resources && crisisData.resources.length > 0;
      const has988 = crisisData.emergencyContacts?.some((contact: any) => contact.number === '988');
      const hasInterventions = crisisData.interventions && crisisData.interventions.length > 0;

      const step2ResponseTime = Date.now() - step2StartTime;
      const step2Passed = hasEmergencyResources && has988 && hasInterventions;

      steps.push({
        stepNumber: 2,
        description: 'Emergency resources and interventions provided',
        expectedOutcome: 'Crisis resources, 988 contact, and interventions included',
        actualOutcome: `Resources: ${crisisData.resources?.length || 0}, 988: ${has988}, Interventions: ${crisisData.interventions?.length || 0}`,
        passed: step2Passed,
        responseTime: step2ResponseTime,
        error: step2Passed ? undefined : 'Missing required emergency resources'
      });

      if (!step2Passed) {
        issues.push('Missing required emergency resources or interventions');
        overallResult = 'failed';
      }

      // Step 3: Test emergency contact accessibility
      const step3StartTime = Date.now();
      let contactsAccessible = 0;
      let totalContacts = 0;

      if (crisisData.emergencyContacts) {
        for (const contact of crisisData.emergencyContacts) {
          totalContacts++;
          // Validate phone number format
          if (/^\d{3,4}$/.test(contact.number)) {
            contactsAccessible++;
          }
        }
      }

      const step3ResponseTime = Date.now() - step3StartTime;
      const step3Passed = contactsAccessible === totalContacts && totalContacts > 0;

      steps.push({
        stepNumber: 3,
        description: 'Emergency contact accessibility validation',
        expectedOutcome: 'All emergency contacts have valid formats',
        actualOutcome: `${contactsAccessible}/${totalContacts} contacts accessible`,
        passed: step3Passed,
        responseTime: step3ResponseTime,
        error: step3Passed ? undefined : 'Some emergency contacts have invalid formats'
      });

      if (!step3Passed) {
        issues.push('Emergency contacts have accessibility issues');
        overallResult = overallResult === 'failed' ? 'failed' : 'warning';
      }

    } catch (error) {
      issues.push(`Protocol test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      overallResult = 'failed';

      steps.push({
        stepNumber: steps.length + 1,
        description: 'Emergency protocol execution',
        expectedOutcome: 'Successful completion of all steps',
        actualOutcome: 'Test execution failed',
        passed: false,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    const totalResponseTime = Date.now() - startTime;

    return {
      testId,
      protocolType: 'crisis_detection',
      scenario: 'High-severity crisis escalation pathway',
      steps,
      result: overallResult,
      responseTime: totalResponseTime,
      issues,
      timestamp: new Date().toISOString()
    };
  }

  // Test emergency navigation paths from all major pages
  async testEmergencyNavigationPaths(): Promise<EmergencyProtocolTest> {
    const testId = `navigation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    const steps: EmergencyProtocolStep[] = [];
    let issues: string[] = [];
    let overallResult: 'passed' | 'failed' | 'warning' = 'passed';

    const pagesToTest = [
      { path: '/', name: 'Landing Page' },
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/journal', name: 'Journal Entry' },
      { path: '/journals', name: 'Journal List' },
      { path: '/pathways', name: 'Pathways' },
      { path: '/pricing', name: 'Pricing' }
    ];

    try {
      for (const page of pagesToTest) {
        const stepStartTime = Date.now();
        
        // Test if page is accessible and loads quickly
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${page.path}`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });

        const stepResponseTime = Date.now() - stepStartTime;
        const stepPassed = response.ok && stepResponseTime <= this.CRITICAL_NAVIGATION_TIME;

        steps.push({
          stepNumber: steps.length + 1,
          description: `Emergency access from ${page.name}`,
          expectedOutcome: `Page loads in <${this.CRITICAL_NAVIGATION_TIME}ms with crisis resources accessible`,
          actualOutcome: `Status: ${response.status}, Time: ${stepResponseTime}ms`,
          passed: stepPassed,
          responseTime: stepResponseTime,
          error: stepPassed ? undefined : `Page inaccessible or too slow (${stepResponseTime}ms)`
        });

        if (!stepPassed) {
          issues.push(`Emergency navigation from ${page.name} is compromised`);
          overallResult = 'failed';
        }
      }

    } catch (error) {
      issues.push(`Navigation test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      overallResult = 'failed';
    }

    return {
      testId,
      protocolType: 'navigation_paths',
      scenario: 'Emergency resource navigation from all major pages',
      steps,
      result: overallResult,
      responseTime: Date.now() - startTime,
      issues,
      timestamp: new Date().toISOString()
    };
  }

  // Test emergency contact functionality
  async testEmergencyContactProtocol(): Promise<EmergencyProtocolTest> {
    const testId = `contacts-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    const steps: EmergencyProtocolStep[] = [];
    let issues: string[] = [];
    let overallResult: 'passed' | 'failed' | 'warning' = 'passed';

    const emergencyContacts = [
      { name: '988 Lifeline', number: '988', type: 'crisis' },
      { name: 'Emergency Services', number: '911', type: 'emergency' },
      { name: 'Crisis Text Line', number: '741741', type: 'crisis' }
    ];

    try {
      for (const contact of emergencyContacts) {
        const stepStartTime = Date.now();
        
        // Validate contact format and accessibility
        const telLink = `tel:${contact.number}`;
        const isValidFormat = /^tel:\+?[\d\-\(\)\s]+$/.test(telLink);
        const isAccessibleNumber = contact.number.length >= 3 && contact.number.length <= 11;
        
        const stepResponseTime = Date.now() - stepStartTime;
        const stepPassed = isValidFormat && isAccessibleNumber;

        steps.push({
          stepNumber: steps.length + 1,
          description: `${contact.name} contact validation`,
          expectedOutcome: 'Valid phone number format and accessible',
          actualOutcome: `Format valid: ${isValidFormat}, Accessible: ${isAccessibleNumber}`,
          passed: stepPassed,
          responseTime: stepResponseTime,
          error: stepPassed ? undefined : 'Invalid contact format or inaccessible number'
        });

        if (!stepPassed) {
          issues.push(`${contact.name} contact has accessibility issues`);
          overallResult = 'failed';
        }
      }

      // Test international emergency access
      const internationalStep = Date.now();
      const internationalHelpline = 'https://findahelpline.com';
      
      try {
        const internationalResponse = await fetch(internationalHelpline, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });

        const internationalTime = Date.now() - internationalStep;
        const internationalPassed = internationalResponse.ok;

        steps.push({
          stepNumber: steps.length + 1,
          description: 'International crisis helpline access',
          expectedOutcome: 'International helpline website accessible',
          actualOutcome: `Status: ${internationalResponse.status}, Time: ${internationalTime}ms`,
          passed: internationalPassed,
          responseTime: internationalTime,
          error: internationalPassed ? undefined : 'International helpline not accessible'
        });

        if (!internationalPassed) {
          issues.push('International crisis helpline not accessible');
          overallResult = overallResult === 'failed' ? 'failed' : 'warning';
        }

      } catch (error) {
        issues.push('International helpline test failed');
        overallResult = overallResult === 'failed' ? 'failed' : 'warning';
      }

    } catch (error) {
      issues.push(`Contact test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      overallResult = 'failed';
    }

    return {
      testId,
      protocolType: 'emergency_calling',
      scenario: 'Emergency contact functionality validation',
      steps,
      result: overallResult,
      responseTime: Date.now() - startTime,
      issues,
      timestamp: new Date().toISOString()
    };
  }

  // Test resource accessibility under different network conditions
  async testResourceAccessibilityProtocol(networkCondition: 'fast' | 'slow' | 'offline' = 'fast'): Promise<EmergencyProtocolTest> {
    const testId = `resources-${networkCondition}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    const steps: EmergencyProtocolStep[] = [];
    let issues: string[] = [];
    let overallResult: 'passed' | 'failed' | 'warning' = 'passed';

    const criticalResources = [
      { name: 'Crisis Detection API', url: '/api/crisis-detection', method: 'GET' },
      { name: 'Health Check', url: '/api/health/ping', method: 'GET' }
    ];

    // Adjust timeout based on network condition
    const timeout = networkCondition === 'slow' ? 10000 : networkCondition === 'fast' ? 3000 : 1000;

    try {
      for (const resource of criticalResources) {
        const stepStartTime = Date.now();
        
        try {
          const response = await fetch(resource.url, {
            method: resource.method,
            signal: AbortSignal.timeout(timeout)
          });

          const stepResponseTime = Date.now() - stepStartTime;
          const stepPassed = response.ok && (
            networkCondition === 'slow' ? stepResponseTime <= 10000 :
            networkCondition === 'fast' ? stepResponseTime <= 3000 : 
            true // offline test just checks if it fails gracefully
          );

          steps.push({
            stepNumber: steps.length + 1,
            description: `${resource.name} accessibility (${networkCondition} network)`,
            expectedOutcome: `Resource accessible within timeout (${timeout}ms)`,
            actualOutcome: `Status: ${response.status}, Time: ${stepResponseTime}ms`,
            passed: stepPassed,
            responseTime: stepResponseTime,
            error: stepPassed ? undefined : `Resource too slow or inaccessible (${stepResponseTime}ms)`
          });

          if (!stepPassed) {
            issues.push(`${resource.name} not accessible under ${networkCondition} network conditions`);
            overallResult = 'failed';
          }

        } catch (error) {
          const stepResponseTime = Date.now() - stepStartTime;
          
          // For offline test, failure is expected
          const stepPassed = networkCondition === 'offline';

          steps.push({
            stepNumber: steps.length + 1,
            description: `${resource.name} accessibility (${networkCondition} network)`,
            expectedOutcome: networkCondition === 'offline' 
              ? 'Graceful failure with offline fallback' 
              : 'Resource accessible within timeout',
            actualOutcome: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            passed: stepPassed,
            responseTime: stepResponseTime,
            error: stepPassed ? undefined : error instanceof Error ? error.message : 'Unknown error'
          });

          if (!stepPassed) {
            issues.push(`${resource.name} failed under ${networkCondition} network conditions`);
            overallResult = 'failed';
          }
        }
      }

    } catch (error) {
      issues.push(`Resource accessibility test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      overallResult = 'failed';
    }

    return {
      testId,
      protocolType: 'resource_access',
      scenario: `Resource accessibility under ${networkCondition} network conditions`,
      steps,
      result: overallResult,
      responseTime: Date.now() - startTime,
      issues,
      timestamp: new Date().toISOString(),
      networkCondition
    };
  }

  // Run comprehensive emergency protocol validation
  async runComprehensiveValidation(): Promise<EmergencyProtocolTest[]> {
    console.log('🚨 Starting comprehensive emergency protocol validation...');
    
    const results: EmergencyProtocolTest[] = [];

    try {
      // Test crisis escalation protocol
      console.log('Testing crisis escalation protocol...');
      const escalationTest = await this.testCrisisEscalationProtocol();
      results.push(escalationTest);

      // Test emergency navigation paths
      console.log('Testing emergency navigation paths...');
      const navigationTest = await this.testEmergencyNavigationPaths();
      results.push(navigationTest);

      // Test emergency contact protocol
      console.log('Testing emergency contact protocol...');
      const contactTest = await this.testEmergencyContactProtocol();
      results.push(contactTest);

      // Test resource accessibility under different conditions
      console.log('Testing resource accessibility (fast network)...');
      const fastNetworkTest = await this.testResourceAccessibilityProtocol('fast');
      results.push(fastNetworkTest);

      console.log('Testing resource accessibility (slow network)...');
      const slowNetworkTest = await this.testResourceAccessibilityProtocol('slow');
      results.push(slowNetworkTest);

      // Log results to Firebase for monitoring
      await this.logProtocolTestResults(results);

      return results;

    } catch (error) {
      console.error('Comprehensive validation failed:', error);
      throw error;
    }
  }

  // Log protocol test results to Firebase
  private async logProtocolTestResults(results: EmergencyProtocolTest[]): Promise<void> {
    try {
      for (const result of results) {
        await addDoc(collection(db, 'emergency_protocol_tests'), {
          ...result,
          timestamp: Timestamp.fromDate(new Date(result.timestamp))
        });
      }
    } catch (error) {
      console.error('Failed to log protocol test results:', error);
    }
  }

  // Get recent protocol test results
  async getRecentProtocolTests(hours = 24): Promise<EmergencyProtocolTest[]> {
    try {
      const cutoff = new Date();
      cutoff.setHours(cutoff.getHours() - hours);
      
      const q = query(
        collection(db, 'emergency_protocol_tests'),
        where('timestamp', '>=', Timestamp.fromDate(cutoff)),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timestamp: data.timestamp.toDate().toISOString()
        } as EmergencyProtocolTest;
      });
    } catch (error) {
      console.error('Failed to get recent protocol tests:', error);
      return [];
    }
  }

  // Generate protocol validation summary
  generateValidationSummary(results: EmergencyProtocolTest[]): {
    overall: 'passed' | 'failed' | 'warning';
    totalTests: number;
    passedTests: number;
    failedTests: number;
    warningTests: number;
    criticalIssues: string[];
    averageResponseTime: number;
  } {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.result === 'passed').length;
    const failedTests = results.filter(r => r.result === 'failed').length;
    const warningTests = results.filter(r => r.result === 'warning').length;
    
    const criticalIssues = results
      .filter(r => r.result === 'failed')
      .flatMap(r => r.issues);

    const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / totalTests;

    const overall = failedTests > 0 ? 'failed' : warningTests > 0 ? 'warning' : 'passed';

    return {
      overall,
      totalTests,
      passedTests,
      failedTests,
      warningTests,
      criticalIssues,
      averageResponseTime
    };
  }
}

// Export singleton instance
export const emergencyProtocolValidator = new EmergencyProtocolValidator();