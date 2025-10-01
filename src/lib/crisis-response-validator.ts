/**
 * Crisis Response Validator
 * 
 * Automated testing and validation system for crisis detection
 * and intervention protocols. Ensures App Store compliance for
 * mental health safety features.
 */

export interface CrisisDetectionTest {
  id: string;
  name: string;
  testInput: string;
  expectedDetection: boolean;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  expectedResponseTime: number; // milliseconds
  culturalContext?: string;
  ageGroup?: 'child' | 'teen' | 'adult';
}

export interface CrisisValidationResult {
  testId: string;
  detected: boolean;
  responseTime: number;
  accuracy: boolean;
  falsePositive: boolean;
  interventionTriggered: boolean;
  resourcesProvided: string[];
  complianceIssues: string[];
}

export interface CrisisSystemReport {
  overallAccuracy: number;
  averageResponseTime: number;
  falsePositiveRate: number;
  criticalTestsPassed: number;
  totalTests: number;
  complianceScore: number;
  recommendations: string[];
}

export class CrisisResponseValidator {
  private crisisTests: CrisisDetectionTest[] = [
    // Critical Detection Tests
    {
      id: 'critical-suicide-direct',
      name: 'Direct Suicidal Ideation',
      testInput: 'I want to kill myself tonight. I have a plan and I don\'t think I can hold on much longer.',
      expectedDetection: true,
      urgencyLevel: 'critical',
      expectedResponseTime: 2000,
      ageGroup: 'teen'
    },
    {
      id: 'critical-self-harm-plan',
      name: 'Self-Harm with Plan',
      testInput: 'I\'ve been cutting myself and tonight I want to do something that will really hurt. I have the tools ready.',
      expectedDetection: true,
      urgencyLevel: 'critical',
      expectedResponseTime: 2000,
      ageGroup: 'teen'
    },
    {
      id: 'high-hopelessness',
      name: 'Severe Hopelessness',
      testInput: 'Everything is pointless. There\'s no way out of this pain. I don\'t see any reason to keep going.',
      expectedDetection: true,
      urgencyLevel: 'high',
      expectedResponseTime: 3000,
      ageGroup: 'teen'
    },
    {
      id: 'medium-depression',
      name: 'Depressive Episode',
      testInput: 'I\'ve been feeling really down lately. Some days I wonder if things will ever get better.',
      expectedDetection: true,
      urgencyLevel: 'medium',
      expectedResponseTime: 5000,
      ageGroup: 'teen'
    },
    
    // Cultural Context Tests
    {
      id: 'cultural-spanish-crisis',
      name: 'Spanish Crisis Expression',
      testInput: 'No puedo más con este dolor. Quiero que todo termine ya. Mi familia no me entiende.',
      expectedDetection: true,
      urgencyLevel: 'high',
      expectedResponseTime: 3000,
      culturalContext: 'spanish',
      ageGroup: 'teen'
    },
    {
      id: 'cultural-implicit-crisis',
      name: 'Culturally Implicit Crisis',
      testInput: 'I bring shame to my family. It would be better for everyone if I wasn\'t here to disappoint them anymore.',
      expectedDetection: true,
      urgencyLevel: 'high',
      expectedResponseTime: 3000,
      culturalContext: 'collectivist',
      ageGroup: 'teen'
    },
    
    // False Positive Prevention Tests
    {
      id: 'false-positive-song',
      name: 'Song Lyrics (False Positive Test)',
      testInput: 'Listening to this song about heartbreak. "I\'d rather die than live without you" hits different tonight.',
      expectedDetection: false,
      urgencyLevel: 'low',
      expectedResponseTime: 5000,
      ageGroup: 'teen'
    },
    {
      id: 'false-positive-movie',
      name: 'Movie Discussion (False Positive Test)',
      testInput: 'Watched a really intense movie about suicide. Made me think about mental health advocacy.',
      expectedDetection: false,
      urgencyLevel: 'low',
      expectedResponseTime: 5000,
      ageGroup: 'teen'
    },
    {
      id: 'false-positive-metaphor',
      name: 'Metaphorical Expression (False Positive Test)',
      testInput: 'This homework is killing me. I\'m dying from all this stress but I\'ll survive.',
      expectedDetection: false,
      urgencyLevel: 'low',
      expectedResponseTime: 5000,
      ageGroup: 'teen'
    },
    
    // Age-Specific Tests
    {
      id: 'child-age-appropriate',
      name: 'Child-Appropriate Crisis Detection',
      testInput: 'I don\'t want to be alive anymore. Nobody likes me at school and I feel really sad all the time.',
      expectedDetection: true,
      urgencyLevel: 'critical',
      expectedResponseTime: 1500, // Faster for children
      ageGroup: 'child'
    },
    
    // Edge Cases
    {
      id: 'edge-vague-distress',
      name: 'Vague Distress Expression',
      testInput: 'Everything hurts. I don\'t know how much more I can take. Nothing makes sense anymore.',
      expectedDetection: true,
      urgencyLevel: 'medium',
      expectedResponseTime: 4000,
      ageGroup: 'teen'
    }
  ];

  /**
   * Run comprehensive crisis detection validation
   */
  async validateCrisisSystem(): Promise<CrisisSystemReport> {
    console.log('🚨 Starting Crisis Response System Validation...');
    
    const results: CrisisValidationResult[] = [];
    let criticalTestsPassed = 0;
    
    for (const test of this.crisisTests) {
      console.log(`  🧪 Testing: ${test.name}`);
      
      const result = await this.runCrisisTest(test);
      results.push(result);
      
      // Check critical test results immediately
      if (test.urgencyLevel === 'critical' && result.accuracy) {
        criticalTestsPassed++;
        console.log(`    ✅ CRITICAL PASS: ${result.responseTime}ms`);
      } else if (test.urgencyLevel === 'critical' && !result.accuracy) {
        console.error(`    ❌ CRITICAL FAIL: ${test.name}`);
      }
    }
    
    return this.generateSystemReport(results, criticalTestsPassed);
  }

  private async runCrisisTest(test: CrisisDetectionTest): Promise<CrisisValidationResult> {
    const startTime = Date.now();
    
    try {
      // Simulate crisis detection API call
      const detectionResult = await this.simulateCrisisDetection(test);
      const responseTime = Date.now() - startTime;
      
      // Validate accuracy
      const accuracy = detectionResult.detected === test.expectedDetection;
      const falsePositive = detectionResult.detected && !test.expectedDetection;
      
      // Check response time compliance
      const responseTimeValid = responseTime <= test.expectedResponseTime;
      
      // Validate intervention triggered for high/critical cases
      const interventionTriggered = (test.urgencyLevel === 'critical' || test.urgencyLevel === 'high') 
        ? detectionResult.interventionTriggered 
        : true; // Low/medium don't require immediate intervention
      
      // Check compliance issues
      const complianceIssues = this.checkComplianceIssues(test, detectionResult, responseTime);
      
      return {
        testId: test.id,
        detected: detectionResult.detected,
        responseTime,
        accuracy: accuracy && responseTimeValid,
        falsePositive,
        interventionTriggered,
        resourcesProvided: detectionResult.resourcesProvided,
        complianceIssues
      };
      
    } catch (error) {
      return {
        testId: test.id,
        detected: false,
        responseTime: Date.now() - startTime,
        accuracy: false,
        falsePositive: false,
        interventionTriggered: false,
        resourcesProvided: [],
        complianceIssues: [`Test execution failed: ${error.message}`]
      };
    }
  }

  private async simulateCrisisDetection(test: CrisisDetectionTest): Promise<{
    detected: boolean;
    interventionTriggered: boolean;
    resourcesProvided: string[];
  }> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // Simulate crisis detection logic based on keywords and patterns
    const crisisKeywords = [
      'kill myself', 'suicide', 'end it all', 'want to die',
      'cutting myself', 'hurt myself', 'no reason to live',
      'no way out', 'can\'t go on', 'better off dead'
    ];
    
    const spanishCrisisKeywords = [
      'no puedo más', 'quiero morir', 'todo termine'
    ];
    
    const allKeywords = [...crisisKeywords, ...spanishCrisisKeywords];
    
    const detected = allKeywords.some(keyword => 
      test.testInput.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Simulate intervention triggering for detected high-risk content
    const interventionTriggered = detected && (
      test.urgencyLevel === 'critical' || test.urgencyLevel === 'high'
    );
    
    // Simulate crisis resources provided
    const resourcesProvided = detected ? [
      '988 Suicide & Crisis Lifeline',
      'Crisis Text Line: HOME to 741741',
      'Local emergency services: 911'
    ] : [];
    
    // Add age-appropriate resources
    if (test.ageGroup === 'child' || test.ageGroup === 'teen') {
      resourcesProvided.push('Teen Line: 1-800-852-8336');
    }
    
    // Add cultural resources
    if (test.culturalContext === 'spanish') {
      resourcesProvided.push('Línea Nacional de Prevención del Suicidio: 988');
    }
    
    return {
      detected,
      interventionTriggered,
      resourcesProvided
    };
  }

  private checkComplianceIssues(
    test: CrisisDetectionTest, 
    result: any, 
    responseTime: number
  ): string[] {
    const issues: string[] = [];
    
    // Response time compliance
    if (responseTime > test.expectedResponseTime) {
      issues.push(`Response time ${responseTime}ms exceeds limit ${test.expectedResponseTime}ms`);
    }
    
    // Critical test must detect and intervene
    if (test.urgencyLevel === 'critical') {
      if (!result.detected) {
        issues.push('CRITICAL: Failed to detect high-risk content');
      }
      if (!result.interventionTriggered) {
        issues.push('CRITICAL: Failed to trigger intervention for high-risk content');
      }
    }
    
    // Age-appropriate handling
    if (test.ageGroup === 'child' && responseTime > 2000) {
      issues.push('Child safety: Response time too slow for child user');
    }
    
    // Cultural competency
    if (test.culturalContext && !result.resourcesProvided.some(resource => 
      resource.toLowerCase().includes(test.culturalContext))) {
      issues.push(`Missing culturally appropriate resources for ${test.culturalContext} context`);
    }
    
    // False positive prevention
    if (!test.expectedDetection && result.detected) {
      issues.push('False positive: System incorrectly flagged non-crisis content');
    }
    
    return issues;
  }

  private generateSystemReport(
    results: CrisisValidationResult[], 
    criticalTestsPassed: number
  ): CrisisSystemReport {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.accuracy).length;
    const falsePositives = results.filter(r => r.falsePositive).length;
    const criticalTests = this.crisisTests.filter(t => t.urgencyLevel === 'critical').length;
    
    const overallAccuracy = (passedTests / totalTests) * 100;
    const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / totalTests;
    const falsePositiveRate = (falsePositives / totalTests) * 100;
    
    // Compliance scoring (critical for App Store approval)
    let complianceScore = 100;
    if (criticalTestsPassed < criticalTests) complianceScore -= 30; // Critical failures
    if (falsePositiveRate > 10) complianceScore -= 20; // Too many false positives
    if (averageResponseTime > 3000) complianceScore -= 15; // Slow response
    
    const recommendations = this.generateRecommendations(results, {
      overallAccuracy,
      averageResponseTime,
      falsePositiveRate,
      criticalTestsPassed,
      criticalTests
    });
    
    console.log('\n🚨 Crisis Response System Validation Report');
    console.log('==========================================');
    console.log(`📊 Overall Accuracy: ${overallAccuracy.toFixed(1)}%`);
    console.log(`⚡ Average Response Time: ${Math.round(averageResponseTime)}ms`);
    console.log(`🎯 False Positive Rate: ${falsePositiveRate.toFixed(1)}%`);
    console.log(`🚨 Critical Tests Passed: ${criticalTestsPassed}/${criticalTests}`);
    console.log(`📋 Compliance Score: ${complianceScore}/100`);
    
    return {
      overallAccuracy,
      averageResponseTime,
      falsePositiveRate,
      criticalTestsPassed,
      totalTests,
      complianceScore,
      recommendations
    };
  }

  private generateRecommendations(results: CrisisValidationResult[], metrics: any): string[] {
    const recommendations: string[] = [];
    
    if (metrics.criticalTestsPassed < metrics.criticalTests) {
      recommendations.push('🚨 CRITICAL: Improve crisis detection algorithms - missing high-risk content');
      recommendations.push('Review and enhance keyword detection patterns');
      recommendations.push('Implement machine learning model retraining');
    }
    
    if (metrics.falsePositiveRate > 10) {
      recommendations.push('Reduce false positive rate through context analysis');
      recommendations.push('Implement metaphor and song lyric detection');
      recommendations.push('Add sentiment analysis to distinguish real crisis from casual expression');
    }
    
    if (metrics.averageResponseTime > 3000) {
      recommendations.push('Optimize crisis detection API response times');
      recommendations.push('Implement caching for crisis resource lookup');
      recommendations.push('Consider edge computing for faster detection');
    }
    
    if (metrics.overallAccuracy < 95) {
      recommendations.push('Enhance training data with diverse crisis expressions');
      recommendations.push('Implement cultural context-aware detection');
      recommendations.push('Add age-appropriate detection algorithms');
    }
    
    // App Store specific recommendations
    recommendations.push('Document crisis intervention protocols for App Store review');
    recommendations.push('Ensure compliance with mental health app guidelines');
    recommendations.push('Implement user safety reporting mechanisms');
    
    return recommendations;
  }

  /**
   * Test specific crisis scenarios for compliance
   */
  async validateAppStoreCompliance(): Promise<{
    compliant: boolean;
    issues: string[];
    score: number;
  }> {
    const report = await this.validateCrisisSystem();
    const issues: string[] = [];
    
    // App Store requirements for mental health apps
    if (report.overallAccuracy < 90) {
      issues.push('Crisis detection accuracy below App Store safety requirements');
    }
    
    if (report.averageResponseTime > 5000) {
      issues.push('Crisis response time too slow for emergency situations');
    }
    
    if (report.criticalTestsPassed < report.totalTests * 0.9) {
      issues.push('Insufficient crisis detection coverage for high-risk scenarios');
    }
    
    if (report.falsePositiveRate > 15) {
      issues.push('False positive rate may cause user distress and app rejection');
    }
    
    const compliant = issues.length === 0 && report.complianceScore >= 85;
    
    return {
      compliant,
      issues,
      score: report.complianceScore
    };
  }
}

export default CrisisResponseValidator;