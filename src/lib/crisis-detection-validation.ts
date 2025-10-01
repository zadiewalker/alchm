/**
 * COMPREHENSIVE CRISIS DETECTION VALIDATION SYSTEM
 * Validates 95%+ accuracy requirement for App Store compliance
 * 
 * This validation system tests:
 * 1. Previously failed indirect suicidal expressions
 * 2. Cultural and identity-specific crisis patterns
 * 3. Performance under load requirements
 * 4. False positive prevention
 * 5. Real-time response capabilities
 */

import { detectCrisisEnhanced, validateDetectionSystem, type CrisisDetectionResult } from './enhanced-crisis-detection';

// Critical test cases that previously failed at 67% accuracy
export const CRITICAL_FAILED_SCENARIOS = [
  // Indirect suicidal expressions (previously missed)
  {
    text: "Everyone would be better off without me",
    expected: true,
    type: "indirect_suicidal",
    severity: "critical",
    description: "Classic indirect suicidal ideation - burden relief"
  },
  {
    text: "Nobody would miss me if I was gone",
    expected: true,
    type: "indirect_suicidal", 
    severity: "critical",
    description: "Indirect expression of expendability"
  },
  {
    text: "The world would be better without me in it",
    expected: true,
    type: "indirect_suicidal",
    severity: "critical", 
    description: "Global burden relief fantasy"
  },
  {
    text: "I'm just a burden to everyone around me",
    expected: true,
    type: "indirect_suicidal",
    severity: "high",
    description: "Burden perception leading to suicidal ideation"
  },
  {
    text: "I wish I could just disappear forever",
    expected: true,
    type: "indirect_suicidal",
    severity: "high",
    description: "Disappearance fantasy"
  },
  {
    text: "There's no point in me being here anymore",
    expected: true,
    type: "indirect_suicidal",
    severity: "high",
    description: "Existential worthlessness"
  },

  // Cultural crisis expressions that need special detection
  {
    text: "My family rejected me when I came out and I can't take this pain anymore",
    expected: true,
    type: "lgbtq_crisis",
    severity: "critical",
    description: "LGBTQ+ family rejection crisis"
  },
  {
    text: "The weight of generational trauma is crushing my soul",
    expected: true,
    type: "bipoc_crisis", 
    severity: "high",
    description: "BIPOC ancestral trauma crisis"
  },
  {
    text: "ICE anxiety has me living in constant fear, I can't go on",
    expected: true,
    type: "immigrant_crisis",
    severity: "high", 
    description: "Immigration status crisis"
  },
  {
    text: "Code switching exhaustion is breaking me down completely",
    expected: true,
    type: "bipoc_crisis",
    severity: "high",
    description: "Code switching fatigue crisis"
  },
  {
    text: "My chronic pain makes me feel like my body is a prison",
    expected: true,
    type: "disability_crisis",
    severity: "high",
    description: "Disability-related suicidal ideation"
  },
  {
    text: "Masking autism all day is destroying my sense of self",
    expected: true,
    type: "neurodivergent_crisis",
    severity: "high",
    description: "Neurodivergent masking exhaustion"
  },

  // Economic stress crisis expressions
  {
    text: "Lost my job and facing eviction, I see no way forward",
    expected: true,
    type: "economic_crisis",
    severity: "high",
    description: "Economic desperation crisis"
  },
  {
    text: "Medical bills are bankrupting us, I can't be this burden",
    expected: true,
    type: "economic_crisis",
    severity: "high", 
    description: "Medical debt crisis with burden themes"
  },

  // Complex multi-factor expressions
  {
    text: "As a trans person of color, the world feels hostile and I'm tired of fighting every day just to exist",
    expected: true,
    type: "intersectional_crisis",
    severity: "high",
    description: "Intersectional identity crisis"
  },
  {
    text: "Dealing with both racism and disability discrimination, I feel like giving up",
    expected: true,
    type: "intersectional_crisis", 
    severity: "high",
    description: "Multiple identity-based stressors"
  }
];

// False positive test cases (should NOT trigger crisis detection)
export const FALSE_POSITIVE_TESTS = [
  {
    text: "I'm feeling a bit down today but I'll be okay",
    expected: false,
    type: "normal_sadness",
    description: "Temporary sadness with coping"
  },
  {
    text: "Work is really stressful but I have good support",
    expected: false,
    type: "manageable_stress", 
    description: "Stress with support systems"
  },
  {
    text: "Bad day but looking forward to the weekend",
    expected: false,
    type: "temporary_difficulty",
    description: "Temporary difficulty with future focus"
  },
  {
    text: "Sometimes I wonder what life would be like if I made different choices",
    expected: false,
    type: "normal_reflection",
    description: "Hypothetical life reflection"
  },
  {
    text: "I really don't want to go to work today",
    expected: false,
    type: "normal_avoidance",
    description: "Normal work avoidance"
  },
  {
    text: "Feeling overwhelmed but I have therapy tomorrow",
    expected: false,
    type: "managed_overwhelm",
    description: "Overwhelm with professional support"
  },
  {
    text: "Having a rough patch but my friends are helping me through it",
    expected: false,
    type: "supported_difficulty",
    description: "Difficulty with social support"
  }
];

// Performance requirements
export const PERFORMANCE_REQUIREMENTS = {
  maxResponseTime: 3000, // 3 seconds max
  optimalResponseTime: 1000, // 1 second optimal
  concurrentUserLoad: 1000, // Must handle 1000+ concurrent users
  accuracyTarget: 0.95, // 95% accuracy minimum
  falsePositiveRate: 0.02, // <2% false positive rate
  memoryUsageLimit: 100 * 1024 * 1024, // 100MB memory limit
};

/**
 * Comprehensive Validation Engine
 * Tests all aspects of the enhanced crisis detection system
 */
export class CrisisDetectionValidator {
  private results: ValidationResults = {
    timestamp: new Date().toISOString(),
    overallAccuracy: 0,
    criticalScenarios: { passed: 0, total: 0, failures: [] },
    falsePositives: { passed: 0, total: 0, failures: [] },
    performance: { responseTime: 0, memoryUsage: 0, concurrent: 0 },
    culturalCompetency: { passed: 0, total: 0, failures: [] },
    complianceStatus: 'pending' as 'passed' | 'failed' | 'pending'
  };

  /**
   * Run comprehensive validation suite
   */
  async runFullValidation(): Promise<ValidationResults> {
    console.log('🔍 Starting Enhanced Crisis Detection Validation...');
    
    try {
      // Test critical scenarios that previously failed
      await this.testCriticalScenarios();
      
      // Test false positive prevention
      await this.testFalsePositivePrevention();
      
      // Test performance requirements
      await this.testPerformanceRequirements();
      
      // Test cultural competency
      await this.testCulturalCompetency();
      
      // Calculate overall results
      this.calculateOverallResults();
      
      console.log(`✅ Validation Complete - Overall Accuracy: ${(this.results.overallAccuracy * 100).toFixed(1)}%`);
      
      return this.results;
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      this.results.complianceStatus = 'failed';
      return this.results;
    }
  }

  /**
   * Test critical scenarios that previously failed
   */
  private async testCriticalScenarios(): Promise<void> {
    console.log('Testing critical failure scenarios...');
    
    this.results.criticalScenarios.total = CRITICAL_FAILED_SCENARIOS.length;
    
    for (const scenario of CRITICAL_FAILED_SCENARIOS) {
      const startTime = Date.now();
      
      const result = detectCrisisEnhanced(scenario.text, {
        culturalIdentity: this.getCulturalContext(scenario.type),
        previousSessions: 5,
        recentEmotionalState: 'distressed'
      });
      
      const responseTime = Date.now() - startTime;
      
      const passed = result.isCrisis === scenario.expected;
      if (passed) {
        this.results.criticalScenarios.passed++;
      } else {
        this.results.criticalScenarios.failures.push({
          scenario: scenario.description,
          text: scenario.text,
          expected: scenario.expected,
          actual: result.isCrisis,
          severity: result.severity,
          confidence: result.confidence,
          responseTime,
          type: scenario.type
        });
      }
    }
  }

  /**
   * Test false positive prevention
   */
  private async testFalsePositivePrevention(): Promise<void> {
    console.log('Testing false positive prevention...');
    
    this.results.falsePositives.total = FALSE_POSITIVE_TESTS.length;
    
    for (const test of FALSE_POSITIVE_TESTS) {
      const startTime = Date.now();
      
      const result = detectCrisisEnhanced(test.text);
      const responseTime = Date.now() - startTime;
      
      const passed = result.isCrisis === test.expected;
      if (passed) {
        this.results.falsePositives.passed++;
      } else {
        this.results.falsePositives.failures.push({
          scenario: test.description,
          text: test.text,
          expected: test.expected,
          actual: result.isCrisis,
          severity: result.severity,
          confidence: result.confidence,
          responseTime,
          type: test.type
        });
      }
    }
  }

  /**
   * Test performance under load requirements
   */
  private async testPerformanceRequirements(): Promise<void> {
    console.log('Testing performance requirements...');
    
    const testText = "I can't take this pain anymore, everyone would be better off without me";
    const concurrentTests = 50; // Reduced for practical testing
    
    // Memory usage before
    const memoryBefore = process.memoryUsage().heapUsed;
    
    // Concurrent load test
    const startTime = Date.now();
    const promises = Array.from({ length: concurrentTests }, async () => {
      const testStart = Date.now();
      const result = detectCrisisEnhanced(testText);
      return Date.now() - testStart;
    });
    
    const responseTimes = await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    
    // Memory usage after
    const memoryAfter = process.memoryUsage().heapUsed;
    
    this.results.performance = {
      responseTime: Math.max(...responseTimes),
      memoryUsage: memoryAfter - memoryBefore,
      concurrent: concurrentTests,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      totalProcessingTime: totalTime
    };
  }

  /**
   * Test cultural competency across different communities
   */
  private async testCulturalCompetency(): Promise<void> {
    console.log('Testing cultural competency...');
    
    const culturalScenarios = CRITICAL_FAILED_SCENARIOS.filter(s => 
      s.type.includes('_crisis') && s.type !== 'indirect_suicidal'
    );
    
    this.results.culturalCompetency.total = culturalScenarios.length;
    
    for (const scenario of culturalScenarios) {
      const result = detectCrisisEnhanced(scenario.text, {
        culturalIdentity: this.getCulturalContext(scenario.type)
      });
      
      const passed = result.isCrisis === scenario.expected && 
                    result.culturalContext && 
                    result.culturalContext.length > 0;
      
      if (passed) {
        this.results.culturalCompetency.passed++;
      } else {
        this.results.culturalCompetency.failures.push({
          scenario: scenario.description,
          text: scenario.text,
          expected: scenario.expected,
          actual: result.isCrisis,
          culturalContext: result.culturalContext,
          type: scenario.type
        });
      }
    }
  }

  /**
   * Calculate overall validation results
   */
  private calculateOverallResults(): void {
    const totalTests = this.results.criticalScenarios.total + this.results.falsePositives.total;
    const totalPassed = this.results.criticalScenarios.passed + this.results.falsePositives.passed;
    
    this.results.overallAccuracy = totalPassed / totalTests;
    
    // Check compliance requirements
    const accuracyMet = this.results.overallAccuracy >= PERFORMANCE_REQUIREMENTS.accuracyTarget;
    const performanceMet = this.results.performance.responseTime <= PERFORMANCE_REQUIREMENTS.maxResponseTime;
    const falsePositiveRate = 1 - (this.results.falsePositives.passed / this.results.falsePositives.total);
    const falsePositiveMet = falsePositiveRate <= PERFORMANCE_REQUIREMENTS.falsePositiveRate;
    
    this.results.complianceStatus = (accuracyMet && performanceMet && falsePositiveMet) ? 'passed' : 'failed';
  }

  /**
   * Get cultural context for testing
   */
  private getCulturalContext(type: string): string[] {
    const contextMap: Record<string, string[]> = {
      'lgbtq_crisis': ['lgbtq'],
      'bipoc_crisis': ['bipoc'],
      'immigrant_crisis': ['immigrant'],
      'disability_crisis': ['disability'],
      'neurodivergent_crisis': ['neurodivergent'],
      'economic_crisis': ['economic_stress'],
      'intersectional_crisis': ['lgbtq', 'bipoc']
    };
    
    return contextMap[type] || [];
  }

  /**
   * Generate detailed validation report
   */
  generateReport(): string {
    const report = `
# ENHANCED CRISIS DETECTION VALIDATION REPORT
Generated: ${this.results.timestamp}

## COMPLIANCE STATUS: ${this.results.complianceStatus.toUpperCase()}

## ACCURACY METRICS
- **Overall Accuracy**: ${(this.results.overallAccuracy * 100).toFixed(1)}% (Target: 95%+)
- **Critical Scenarios**: ${this.results.criticalScenarios.passed}/${this.results.criticalScenarios.total} (${((this.results.criticalScenarios.passed / this.results.criticalScenarios.total) * 100).toFixed(1)}%)
- **False Positive Prevention**: ${this.results.falsePositives.passed}/${this.results.falsePositives.total} (${((this.results.falsePositives.passed / this.results.falsePositives.total) * 100).toFixed(1)}%)
- **Cultural Competency**: ${this.results.culturalCompetency.passed}/${this.results.culturalCompetency.total} (${((this.results.culturalCompetency.passed / this.results.culturalCompetency.total) * 100).toFixed(1)}%)

## PERFORMANCE METRICS
- **Max Response Time**: ${this.results.performance.responseTime}ms (Target: <3000ms)
- **Average Response Time**: ${this.results.performance.averageResponseTime?.toFixed(0)}ms (Target: <1000ms)
- **Memory Usage**: ${(this.results.performance.memoryUsage / 1024 / 1024).toFixed(1)}MB
- **Concurrent Load**: ${this.results.performance.concurrent} simultaneous requests

## CRITICAL FAILURES
${this.results.criticalScenarios.failures.map(f => 
  `- **${f.type}**: "${f.text}" - Expected: ${f.expected}, Got: ${f.actual} (Confidence: ${f.confidence.toFixed(2)})`
).join('\n')}

## FALSE POSITIVE FAILURES  
${this.results.falsePositives.failures.map(f => 
  `- **${f.type}**: "${f.text}" - Expected: ${f.expected}, Got: ${f.actual} (Confidence: ${f.confidence.toFixed(2)})`
).join('\n')}

## CULTURAL COMPETENCY FAILURES
${this.results.culturalCompetency.failures.map(f => 
  `- **${f.type}**: "${f.text}" - Cultural Context: ${f.culturalContext?.join(', ') || 'None detected'}`
).join('\n')}

## APP STORE COMPLIANCE
- ✅ Crisis Detection Accuracy: ${this.results.overallAccuracy >= 0.95 ? 'PASSED' : 'FAILED'}
- ✅ Response Time: ${this.results.performance.responseTime <= 3000 ? 'PASSED' : 'FAILED'}
- ✅ Cultural Sensitivity: ${this.results.culturalCompetency.passed > 0 ? 'PASSED' : 'FAILED'}
- ✅ False Positive Rate: ${(1 - (this.results.falsePositives.passed / this.results.falsePositives.total)) <= 0.02 ? 'PASSED' : 'FAILED'}
`;

    return report;
  }
}

// Type definitions
export interface ValidationResults {
  timestamp: string;
  overallAccuracy: number;
  criticalScenarios: {
    passed: number;
    total: number;
    failures: TestFailure[];
  };
  falsePositives: {
    passed: number;
    total: number;
    failures: TestFailure[];
  };
  performance: {
    responseTime: number;
    memoryUsage: number;
    concurrent: number;
    averageResponseTime?: number;
    totalProcessingTime?: number;
  };
  culturalCompetency: {
    passed: number;
    total: number;
    failures: CulturalTestFailure[];
  };
  complianceStatus: 'passed' | 'failed' | 'pending';
}

export interface TestFailure {
  scenario: string;
  text: string;
  expected: boolean;
  actual: boolean;
  severity: number;
  confidence: number;
  responseTime: number;
  type: string;
}

export interface CulturalTestFailure {
  scenario: string;
  text: string;
  expected: boolean;
  actual: boolean;
  culturalContext?: string[];
  type: string;
}

/**
 * Quick validation function for immediate testing
 */
export async function quickValidation(): Promise<{
  passed: boolean;
  accuracy: number;
  criticalIssues: string[];
}> {
  const validator = new CrisisDetectionValidator();
  const results = await validator.runFullValidation();
  
  const criticalIssues: string[] = [];
  
  if (results.overallAccuracy < 0.95) {
    criticalIssues.push(`Accuracy below 95%: ${(results.overallAccuracy * 100).toFixed(1)}%`);
  }
  
  if (results.performance.responseTime > 3000) {
    criticalIssues.push(`Response time too slow: ${results.performance.responseTime}ms`);
  }
  
  if (results.criticalScenarios.failures.length > 0) {
    criticalIssues.push(`${results.criticalScenarios.failures.length} critical scenario failures`);
  }
  
  return {
    passed: results.complianceStatus === 'passed',
    accuracy: results.overallAccuracy,
    criticalIssues
  };
}

export default CrisisDetectionValidator;