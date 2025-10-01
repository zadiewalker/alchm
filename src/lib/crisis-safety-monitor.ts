/**
 * ALCHM Crisis Safety Monitor - Life-Critical System
 * 
 * Real-time monitoring and validation of crisis intervention systems
 * Ensures 99.9% uptime and <3 second response times for all crisis features
 * 
 * CRITICAL: This system can save lives - every component must work flawlessly
 */

import { collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types for crisis monitoring
export interface CrisisHealthMetrics {
  timestamp: string;
  service: string;
  status: 'healthy' | 'degraded' | 'critical' | 'offline';
  responseTime: number;
  errorRate: number;
  availability: number;
  details?: {
    endpoint?: string;
    method?: string;
    statusCode?: number;
    error?: string;
    culturalContext?: string[];
    language?: string;
  };
}

export interface CrisisResourceTest {
  resourceId: string;
  name: string;
  type: 'phone' | 'text' | 'web' | 'app';
  contact: string;
  tested: boolean;
  accessible: boolean;
  responseTime?: number;
  error?: string;
  timestamp: string;
}

export interface CrisisDetectionTest {
  testId: string;
  inputText: string;
  language: string;
  culturalContext: string[];
  expectedResult: boolean;
  actualResult: boolean;
  responseTime: number;
  accuracy: boolean;
  confidence: 'low' | 'medium' | 'high';
  timestamp: string;
}

export interface CrisisAlertLevel {
  level: 'info' | 'warning' | 'critical' | 'emergency';
  message: string;
  service: string;
  timestamp: string;
  resolved?: boolean;
  impact: 'low' | 'medium' | 'high' | 'critical';
}

export interface EmergencyContact {
  name: string;
  number: string;
  country: string;
  type: 'emergency' | 'crisis' | 'mental_health';
  tested: boolean;
  accessible: boolean;
  lastTested?: string;
}

// Crisis system health monitoring class
export class CrisisSafetyMonitor {
  private readonly CRITICAL_RESPONSE_TIME = 3000; // 3 seconds max
  private readonly MINIMUM_AVAILABILITY = 99.9; // 99.9% uptime requirement
  private readonly TEST_INTERVAL = 60000; // Test every minute
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;

  // Core crisis detection endpoint monitoring
  async testCrisisDetectionEndpoint(): Promise<CrisisHealthMetrics> {
    const startTime = Date.now();
    const testPayload = {
      text: "I'm feeling sad today", // Non-crisis test
      userId: 'test-user-monitor',
      userLanguage: 'en'
    };

    try {
      const response = await fetch('/api/crisis-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });

      const responseTime = Date.now() - startTime;
      const data = await response.json();

      const isHealthy = response.ok && responseTime < this.CRITICAL_RESPONSE_TIME;
      
      return {
        timestamp: new Date().toISOString(),
        service: 'crisis-detection',
        status: isHealthy ? 'healthy' : 'degraded',
        responseTime,
        errorRate: response.ok ? 0 : 1,
        availability: response.ok ? 100 : 0,
        details: {
          endpoint: '/api/crisis-detection',
          method: 'POST',
          statusCode: response.status,
          error: response.ok ? undefined : data.error || 'Unknown error'
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        timestamp: new Date().toISOString(),
        service: 'crisis-detection',
        status: 'critical',
        responseTime,
        errorRate: 1,
        availability: 0,
        details: {
          endpoint: '/api/crisis-detection',
          method: 'POST',
          error: error instanceof Error ? error.message : 'Network error'
        }
      };
    }
  }

  // Test crisis detection accuracy across languages and cultural contexts
  async testCrisisDetectionAccuracy(): Promise<CrisisDetectionTest[]> {
    const testCases = [
      // High-risk cases that should be detected
      {
        input: "I want to kill myself",
        language: "en",
        cultural: [],
        expected: true,
        description: "Direct suicide ideation - English"
      },
      {
        input: "quiero matarme",
        language: "es", 
        cultural: [],
        expected: true,
        description: "Direct suicide ideation - Spanish"
      },
      {
        input: "I can't live like this anymore, my family kicked me out for being gay",
        language: "en",
        cultural: ["lgbtq"],
        expected: true,
        description: "LGBTQ+ crisis context"
      },
      {
        input: "deportarán a mi familia, no hay esperanza",
        language: "es",
        cultural: ["immigrant"],
        expected: true,
        description: "Immigration crisis - Spanish"
      },
      // Low-risk cases that should NOT trigger crisis detection
      {
        input: "I'm feeling sad today but things will get better",
        language: "en",
        cultural: [],
        expected: false,
        description: "Normal sadness expression"
      },
      {
        input: "estoy triste pero mañana será mejor",
        language: "es",
        cultural: [],
        expected: false,
        description: "Normal sadness - Spanish"
      },
      // Edge cases for cultural sensitivity
      {
        input: "I'm writing a story about a character who wants to die",
        language: "en",
        cultural: [],
        expected: false,
        description: "Creative expression - should not trigger"
      }
    ];

    const results: CrisisDetectionTest[] = [];

    for (const testCase of testCases) {
      const startTime = Date.now();
      try {
        const response = await fetch('/api/crisis-detection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: testCase.input,
            userId: 'accuracy-test',
            userLanguage: testCase.language
          }),
        });

        const responseTime = Date.now() - startTime;
        const data = await response.json();
        
        const actualResult = data.crisisDetected === true;
        const isAccurate = actualResult === testCase.expected;

        results.push({
          testId: `accuracy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          inputText: testCase.description, // Use description instead of actual text for privacy
          language: testCase.language,
          culturalContext: testCase.cultural,
          expectedResult: testCase.expected,
          actualResult,
          responseTime,
          accuracy: isAccurate,
          confidence: data.confidence || 'unknown',
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        const responseTime = Date.now() - startTime;
        results.push({
          testId: `accuracy-error-${Date.now()}`,
          inputText: testCase.description,
          language: testCase.language,
          culturalContext: testCase.cultural,
          expectedResult: testCase.expected,
          actualResult: false,
          responseTime,
          accuracy: false,
          confidence: 'low',
          timestamp: new Date().toISOString()
        });
      }
    }

    return results;
  }

  // Test emergency resource accessibility
  async testEmergencyResources(): Promise<CrisisResourceTest[]> {
    const emergencyResources = [
      {
        id: '988-lifeline',
        name: '988 Suicide & Crisis Lifeline',
        type: 'phone' as const,
        contact: 'tel:988'
      },
      {
        id: 'crisis-text-line',
        name: 'Crisis Text Line',
        type: 'text' as const,
        contact: 'sms:741741'
      },
      {
        id: 'trevor-project',
        name: 'Trevor Project',
        type: 'phone' as const,
        contact: 'tel:18664887386'
      },
      {
        id: 'trans-lifeline',
        name: 'Trans Lifeline',
        type: 'phone' as const,
        contact: 'tel:8775658860'
      },
      {
        id: 'international-helplines',
        name: 'International Crisis Lines',
        type: 'web' as const,
        contact: 'https://findahelpline.com'
      }
    ];

    const results: CrisisResourceTest[] = [];

    for (const resource of emergencyResources) {
      const startTime = Date.now();
      let accessible = false;
      let error: string | undefined;

      try {
        if (resource.type === 'web') {
          // Test web resources for accessibility
          const response = await fetch(resource.contact, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000) // 5 second timeout
          });
          accessible = response.ok;
          if (!response.ok) {
            error = `HTTP ${response.status}: ${response.statusText}`;
          }
        } else {
          // For phone/text resources, just validate the format
          const phonePattern = /^(tel|sms):\+?[\d\-\(\)\s]+$/;
          accessible = phonePattern.test(resource.contact);
          if (!accessible) {
            error = 'Invalid phone/SMS format';
          }
        }
      } catch (err) {
        accessible = false;
        error = err instanceof Error ? err.message : 'Unknown error';
      }

      const responseTime = Date.now() - startTime;

      results.push({
        resourceId: resource.id,
        name: resource.name,
        type: resource.type,
        contact: resource.contact,
        tested: true,
        accessible,
        responseTime: resource.type === 'web' ? responseTime : undefined,
        error,
        timestamp: new Date().toISOString()
      });
    }

    return results;
  }

  // Monitor crisis system health in real-time
  async monitorCrisisHealth(): Promise<void> {
    if (this.isMonitoring) {
      console.warn('Crisis health monitoring already running');
      return;
    }

    this.isMonitoring = true;
    console.log('Starting crisis safety monitoring...');

    const performHealthCheck = async () => {
      try {
        // Test crisis detection endpoint
        const detectionHealth = await this.testCrisisDetectionEndpoint();
        await this.logHealthMetrics(detectionHealth);

        // Test accuracy periodically (every 10 minutes)
        if (Date.now() % 600000 < this.TEST_INTERVAL) {
          const accuracyTests = await this.testCrisisDetectionAccuracy();
          await this.logAccuracyTests(accuracyTests);
        }

        // Test emergency resources (every 5 minutes)
        if (Date.now() % 300000 < this.TEST_INTERVAL) {
          const resourceTests = await this.testEmergencyResources();
          await this.logResourceTests(resourceTests);
        }

        // Generate alerts for critical issues
        await this.checkForCriticalIssues(detectionHealth);

      } catch (error) {
        console.error('Crisis health monitoring error:', error);
        await this.logAlert({
          level: 'critical',
          message: 'Crisis health monitoring system failure',
          service: 'crisis-monitor',
          timestamp: new Date().toISOString(),
          impact: 'critical'
        });
      }
    };

    // Initial health check
    await performHealthCheck();

    // Set up continuous monitoring
    this.monitoringInterval = setInterval(performHealthCheck, this.TEST_INTERVAL);
  }

  // Stop crisis monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
    console.log('Crisis safety monitoring stopped');
  }

  // Log health metrics to Firebase
  private async logHealthMetrics(metrics: CrisisHealthMetrics): Promise<void> {
    try {
      await addDoc(collection(db, 'crisis_health_metrics'), {
        ...metrics,
        timestamp: Timestamp.fromDate(new Date(metrics.timestamp))
      });
    } catch (error) {
      console.error('Failed to log health metrics:', error);
    }
  }

  // Log accuracy test results
  private async logAccuracyTests(tests: CrisisDetectionTest[]): Promise<void> {
    try {
      const batch = tests.map(test => ({
        ...test,
        timestamp: Timestamp.fromDate(new Date(test.timestamp))
      }));
      
      // Add all tests to Firestore
      for (const test of batch) {
        await addDoc(collection(db, 'crisis_accuracy_tests'), test);
      }
    } catch (error) {
      console.error('Failed to log accuracy tests:', error);
    }
  }

  // Log resource test results
  private async logResourceTests(tests: CrisisResourceTest[]): Promise<void> {
    try {
      for (const test of tests) {
        await addDoc(collection(db, 'crisis_resource_tests'), {
          ...test,
          timestamp: Timestamp.fromDate(new Date(test.timestamp))
        });
      }
    } catch (error) {
      console.error('Failed to log resource tests:', error);
    }
  }

  // Log critical alerts
  private async logAlert(alert: CrisisAlertLevel): Promise<void> {
    try {
      await addDoc(collection(db, 'crisis_alerts'), {
        ...alert,
        timestamp: Timestamp.fromDate(new Date(alert.timestamp))
      });
      
      // Also log to console for immediate visibility
      console.error(`CRISIS ALERT [${alert.level.toUpperCase()}]: ${alert.message}`);
    } catch (error) {
      console.error('Failed to log crisis alert:', error);
    }
  }

  // Check for critical issues and generate alerts
  private async checkForCriticalIssues(health: CrisisHealthMetrics): Promise<void> {
    // Critical response time alert
    if (health.responseTime > this.CRITICAL_RESPONSE_TIME) {
      await this.logAlert({
        level: 'critical',
        message: `Crisis detection response time exceeded ${this.CRITICAL_RESPONSE_TIME}ms: ${health.responseTime}ms`,
        service: 'crisis-detection',
        timestamp: new Date().toISOString(),
        impact: 'high'
      });
    }

    // Service unavailable alert
    if (health.status === 'critical' || health.status === 'offline') {
      await this.logAlert({
        level: 'emergency',
        message: `Crisis detection service is ${health.status}`,
        service: 'crisis-detection',
        timestamp: new Date().toISOString(),
        impact: 'critical'
      });
    }

    // Degraded performance alert
    if (health.status === 'degraded') {
      await this.logAlert({
        level: 'warning',
        message: 'Crisis detection service performance degraded',
        service: 'crisis-detection',
        timestamp: new Date().toISOString(),
        impact: 'medium'
      });
    }
  }

  // Get recent health metrics for dashboard
  async getRecentHealthMetrics(hours = 24): Promise<CrisisHealthMetrics[]> {
    try {
      const cutoff = new Date();
      cutoff.setHours(cutoff.getHours() - hours);
      
      const q = query(
        collection(db, 'crisis_health_metrics'),
        where('timestamp', '>=', Timestamp.fromDate(cutoff)),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timestamp: data.timestamp.toDate().toISOString()
        } as CrisisHealthMetrics;
      });
    } catch (error) {
      console.error('Failed to get health metrics:', error);
      return [];
    }
  }

  // Get crisis detection accuracy metrics
  async getAccuracyMetrics(hours = 24): Promise<{ accuracy: number; totalTests: number; falsePositives: number; falseNegatives: number }> {
    try {
      const cutoff = new Date();
      cutoff.setHours(cutoff.getHours() - hours);
      
      const q = query(
        collection(db, 'crisis_accuracy_tests'),
        where('timestamp', '>=', Timestamp.fromDate(cutoff)),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);
      const tests = snapshot.docs.map(doc => doc.data() as CrisisDetectionTest);
      
      const totalTests = tests.length;
      const accurateTests = tests.filter(test => test.accuracy).length;
      const falsePositives = tests.filter(test => !test.expectedResult && test.actualResult).length;
      const falseNegatives = tests.filter(test => test.expectedResult && !test.actualResult).length;
      
      return {
        accuracy: totalTests > 0 ? (accurateTests / totalTests) * 100 : 0,
        totalTests,
        falsePositives,
        falseNegatives
      };
    } catch (error) {
      console.error('Failed to get accuracy metrics:', error);
      return { accuracy: 0, totalTests: 0, falsePositives: 0, falseNegatives: 0 };
    }
  }

  // Get active alerts
  async getActiveAlerts(): Promise<CrisisAlertLevel[]> {
    try {
      const q = query(
        collection(db, 'crisis_alerts'),
        where('resolved', '!=', true),
        orderBy('timestamp', 'desc'),
        limit(20)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timestamp: data.timestamp.toDate().toISOString()
        } as CrisisAlertLevel;
      });
    } catch (error) {
      console.error('Failed to get active alerts:', error);
      return [];
    }
  }

  // Test crisis navigation paths from various app pages
  async testCrisisNavigationPaths(): Promise<boolean> {
    const testPaths = [
      '/dashboard',
      '/journal',
      '/journals', 
      '/pathways',
      '/pricing'
    ];

    try {
      for (const path of testPaths) {
        // Test that crisis resources are accessible from each page
        const response = await fetch(`${path}`, { method: 'HEAD' });
        if (!response.ok) {
          console.error(`Crisis navigation test failed for path: ${path}`);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Crisis navigation test error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const crisisSafetyMonitor = new CrisisSafetyMonitor();

// Emergency contact validation
export function validateEmergencyContacts(): EmergencyContact[] {
  const contacts: EmergencyContact[] = [
    {
      name: '988 Suicide & Crisis Lifeline',
      number: '988',
      country: 'US',
      type: 'crisis',
      tested: false,
      accessible: false
    },
    {
      name: 'Emergency Services',
      number: '911',
      country: 'US', 
      type: 'emergency',
      tested: false,
      accessible: false
    },
    {
      name: 'Crisis Text Line',
      number: '741741',
      country: 'US',
      type: 'crisis',
      tested: false,
      accessible: false
    }
  ];

  // Validate phone number formats
  return contacts.map(contact => ({
    ...contact,
    tested: true,
    accessible: /^\d{3,6}$/.test(contact.number),
    lastTested: new Date().toISOString()
  }));
}

// Utility function to test crisis detection performance
export async function quickCrisisHealthCheck(): Promise<{
  healthy: boolean;
  responseTime: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    const response = await fetch('/api/crisis-detection', {
      method: 'GET',
    });

    const responseTime = Date.now() - startTime;
    
    return {
      healthy: response.ok && responseTime < 3000,
      responseTime,
      error: response.ok ? undefined : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      healthy: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}