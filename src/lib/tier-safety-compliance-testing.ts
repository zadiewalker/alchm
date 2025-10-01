/**
 * Comprehensive Safety Compliance Testing for Khepera Tiered Guidance System
 * 
 * This testing suite validates that our tiered system never exploits vulnerable users
 * and maintains the highest ethical standards for mental health support.
 */

import { 
  assessUpgradeEthics, 
  canAccessFeature, 
  CoolingOffManager,
  validateTierTransitionConsent,
  UNIVERSAL_SAFETY_FEATURES,
  ENHANCEMENT_FEATURES,
  type UserVulnerabilityState,
  type TierTransitionConsent
} from './ethical-tier-boundaries';

export interface SafetyTestResult {
  testName: string;
  passed: boolean;
  details: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation?: string;
}

export interface ComplianceReport {
  overallCompliance: boolean;
  criticalFailures: number;
  highRiskIssues: number;
  testResults: SafetyTestResult[];
  executionTime: Date;
  nextTestDue: Date;
}

/**
 * Test Suite: Crisis State Protection
 */
export function testCrisisStateProtection(): SafetyTestResult[] {
  const results: SafetyTestResult[] = [];

  // Test 1: No upgrade prompts during crisis
  const crisisUser: UserVulnerabilityState = {
    isCrisisDetected: true,
    isEmotionallyDistressed: false,
    hasRecentTrauma: false,
    isNewUser: false,
    hasFinancialStress: false,
    lastUpgradePrompt: null
  };

  const crisisUpgradeTest = assessUpgradeEthics(crisisUser, 'sanctuary', ['milestone_achieved']);
  results.push({
    testName: 'Crisis State Upgrade Block',
    passed: !crisisUpgradeTest.canShowUpgrade,
    details: `Crisis user upgrade blocking: ${crisisUpgradeTest.reason}`,
    severity: 'critical'
  });

  // Test 2: Emotional distress protection
  const distressedUser: UserVulnerabilityState = {
    isCrisisDetected: false,
    isEmotionallyDistressed: true,
    hasRecentTrauma: false,
    isNewUser: false,
    hasFinancialStress: false,
    lastUpgradePrompt: null
  };

  const distressUpgradeTest = assessUpgradeEthics(distressedUser, 'sanctuary', []);
  results.push({
    testName: 'Emotional Distress Protection',
    passed: !distressUpgradeTest.canShowUpgrade,
    details: `Distressed user protection: ${distressUpgradeTest.reason}`,
    severity: 'critical'
  });

  // Test 3: Crisis features always accessible
  const crisisFeatureTest = canAccessFeature('Crisis Detection & Intervention', 'sanctuary', crisisUser);
  results.push({
    testName: 'Crisis Features Always Accessible',
    passed: crisisFeatureTest.canAccess,
    details: `Crisis feature access: ${crisisFeatureTest.reason}`,
    severity: 'critical'
  });

  return results;
}

/**
 * Test Suite: Financial Stress Protection
 */
export function testFinancialStressProtection(): SafetyTestResult[] {
  const results: SafetyTestResult[] = [];

  const financiallyStressedUser: UserVulnerabilityState = {
    isCrisisDetected: false,
    isEmotionallyDistressed: false,
    hasRecentTrauma: false,
    isNewUser: false,
    hasFinancialStress: true,
    lastUpgradePrompt: null
  };

  const financialUpgradeTest = assessUpgradeEthics(
    financiallyStressedUser, 
    'sanctuary', 
    ['breakthrough_achieved', 'milestone_reached']
  );

  results.push({
    testName: 'Financial Stress Upgrade Protection',
    passed: !financialUpgradeTest.canShowUpgrade,
    details: `Financial stress protection: ${financialUpgradeTest.reason}`,
    severity: 'high',
    recommendation: 'Never pressure users experiencing financial stress to upgrade'
  });

  return results;
}

/**
 * Test Suite: New User Protection
 */
export function testNewUserProtection(): SafetyTestResult[] {
  const results: SafetyTestResult[] = [];

  const newUser: UserVulnerabilityState = {
    isCrisisDetected: false,
    isEmotionallyDistressed: false,
    hasRecentTrauma: false,
    isNewUser: true,
    hasFinancialStress: false,
    lastUpgradePrompt: null
  };

  const newUserUpgradeTest = assessUpgradeEthics(newUser, 'sanctuary', ['first_entry_completed']);
  results.push({
    testName: 'New User Protection Period',
    passed: !newUserUpgradeTest.canShowUpgrade,
    details: `New user protection: ${newUserUpgradeTest.reason}`,
    severity: 'high',
    recommendation: 'Allow new users 7 days to establish emotional baseline before any upgrade suggestions'
  });

  return results;
}

/**
 * Test Suite: Cooling-Off Period Enforcement
 */
export function testCoolingOffPeriods(): SafetyTestResult[] {
  const results: SafetyTestResult[] = [];

  // Test recent upgrade prompt
  const recentPromptUser: UserVulnerabilityState = {
    isCrisisDetected: false,
    isEmotionallyDistressed: false,
    hasRecentTrauma: false,
    isNewUser: false,
    hasFinancialStress: false,
    lastUpgradePrompt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  };

  const coolingOffTest = assessUpgradeEthics(recentPromptUser, 'sanctuary', ['milestone_achieved']);
  results.push({
    testName: 'Cooling-Off Period Enforcement',
    passed: !coolingOffTest.canShowUpgrade,
    details: `Cooling-off enforcement: ${coolingOffTest.reason}`,
    severity: 'high'
  });

  // Test cooling-off manager
  const { canShow } = CoolingOffManager.canShowUpgradePrompt(
    new Date(Date.now() - 24 * 60 * 60 * 1000),
    recentPromptUser
  );

  results.push({
    testName: 'Cooling-Off Manager Validation',
    passed: !canShow,
    details: 'Cooling-off manager correctly blocks recent prompts',
    severity: 'high'
  });

  return results;
}

/**
 * Test Suite: Essential Feature Access
 */
export function testEssentialFeatureAccess(): SafetyTestResult[] {
  const results: SafetyTestResult[] = [];

  const freeUser: UserVulnerabilityState = {
    isCrisisDetected: false,
    isEmotionallyDistressed: false,
    hasRecentTrauma: false,
    isNewUser: false,
    hasFinancialStress: false,
    lastUpgradePrompt: null
  };

  // Test all universal safety features
  UNIVERSAL_SAFETY_FEATURES.forEach(feature => {
    const accessTest = canAccessFeature(feature.feature, 'sanctuary', freeUser);
    results.push({
      testName: `Essential Feature Access: ${feature.feature}`,
      passed: accessTest.canAccess,
      details: `Feature "${feature.feature}" access: ${accessTest.reason}`,
      severity: feature.essentialMentalHealth ? 'critical' : 'medium'
    });
  });

  return results;
}

/**
 * Test Suite: Consent Validation
 */
export function testConsentValidation(): SafetyTestResult[] {
  const results: SafetyTestResult[] = [];

  // Test consent during vulnerable state (should be invalid)
  const vulnerableConsent: TierTransitionConsent = {
    userId: 'test_user',
    fromTier: 'sanctuary',
    toTier: 'deep_cut',
    consentGiven: true,
    consentTimestamp: new Date(),
    coolingOffExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    informedConsentProvided: true,
    vulnerabilityStateAtConsent: {
      isCrisisDetected: true,
      isEmotionallyDistressed: false,
      hasRecentTrauma: false,
      isNewUser: false,
      hasFinancialStress: false,
      lastUpgradePrompt: null
    },
    canWithdrawUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };

  const vulnerableConsentTest = validateTierTransitionConsent(vulnerableConsent);
  results.push({
    testName: 'Vulnerable State Consent Rejection',
    passed: !vulnerableConsentTest.isValid,
    details: `Vulnerable consent validation: ${vulnerableConsentTest.reason}`,
    severity: 'critical'
  });

  // Test valid consent
  const validConsent: TierTransitionConsent = {
    ...vulnerableConsent,
    vulnerabilityStateAtConsent: {
      isCrisisDetected: false,
      isEmotionallyDistressed: false,
      hasRecentTrauma: false,
      isNewUser: false,
      hasFinancialStress: false,
      lastUpgradePrompt: null
    },
    consentTimestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    canWithdrawUntil: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Withdrawal period expired
  };

  const validConsentTest = validateTierTransitionConsent(validConsent);
  results.push({
    testName: 'Valid Consent Acceptance',
    passed: validConsentTest.isValid && validConsentTest.canProceed,
    details: `Valid consent validation: ${validConsentTest.reason}`,
    severity: 'medium'
  });

  return results;
}

/**
 * Test Suite: Positive Milestone Requirement
 */
export function testPositiveMilestoneRequirement(): SafetyTestResult[] {
  const results: SafetyTestResult[] = [];

  const stableUser: UserVulnerabilityState = {
    isCrisisDetected: false,
    isEmotionallyDistressed: false,
    hasRecentTrauma: false,
    isNewUser: false,
    hasFinancialStress: false,
    lastUpgradePrompt: null
  };

  // Test without positive milestone
  const noMilestoneTest = assessUpgradeEthics(stableUser, 'sanctuary', []);
  results.push({
    testName: 'No Upgrade Without Positive Milestones',
    passed: !noMilestoneTest.canShowUpgrade,
    details: `No milestone protection: ${noMilestoneTest.reason}`,
    severity: 'high'
  });

  // Test with positive milestone
  const positiveTest = assessUpgradeEthics(
    stableUser, 
    'sanctuary', 
    ['breakthrough_achieved', 'growth_milestone_reached']
  );
  results.push({
    testName: 'Upgrade Allowed With Positive Milestones',
    passed: positiveTest.canShowUpgrade,
    details: `Positive milestone upgrade: ${positiveTest.reason}`,
    severity: 'medium'
  });

  return results;
}

/**
 * Comprehensive Compliance Test Runner
 */
export function runComprehensiveComplianceTest(): ComplianceReport {
  const startTime = new Date();
  const allResults: SafetyTestResult[] = [];

  // Run all test suites
  allResults.push(...testCrisisStateProtection());
  allResults.push(...testFinancialStressProtection());
  allResults.push(...testNewUserProtection());
  allResults.push(...testCoolingOffPeriods());
  allResults.push(...testEssentialFeatureAccess());
  allResults.push(...testConsentValidation());
  allResults.push(...testPositiveMilestoneRequirement());

  // Calculate compliance metrics
  const criticalFailures = allResults.filter(r => !r.passed && r.severity === 'critical').length;
  const highRiskIssues = allResults.filter(r => !r.passed && r.severity === 'high').length;
  const overallCompliance = criticalFailures === 0 && highRiskIssues === 0;

  return {
    overallCompliance,
    criticalFailures,
    highRiskIssues,
    testResults: allResults,
    executionTime: startTime,
    nextTestDue: new Date(Date.now() + 6 * 60 * 60 * 1000) // Every 6 hours
  };
}

/**
 * Automated Compliance Monitoring
 */
export class ComplianceMonitor {
  private lastTestRun: Date | null = null;
  private complianceHistory: ComplianceReport[] = [];

  async runScheduledCompliance(): Promise<ComplianceReport> {
    const report = runComprehensiveComplianceTest();
    this.lastTestRun = new Date();
    this.complianceHistory.push(report);

    // Alert on critical failures
    if (report.criticalFailures > 0) {
      await this.alertCriticalFailure(report);
    }

    // Keep only last 24 reports (4 days of history)
    if (this.complianceHistory.length > 24) {
      this.complianceHistory = this.complianceHistory.slice(-24);
    }

    return report;
  }

  private async alertCriticalFailure(report: ComplianceReport): Promise<void> {
    console.error('🚨 CRITICAL COMPLIANCE FAILURE DETECTED', {
      criticalFailures: report.criticalFailures,
      highRiskIssues: report.highRiskIssues,
      timestamp: report.executionTime
    });

    // In production, this would integrate with monitoring systems
    const criticalTests = report.testResults.filter(r => !r.passed && r.severity === 'critical');
    criticalTests.forEach(test => {
      console.error(`CRITICAL: ${test.testName} - ${test.details}`);
    });
  }

  getComplianceStatus(): {
    isCompliant: boolean;
    lastTestTime: Date | null;
    recentTrends: { date: Date; compliant: boolean }[]
  } {
    const recentTrends = this.complianceHistory.slice(-7).map(report => ({
      date: report.executionTime,
      compliant: report.overallCompliance
    }));

    return {
      isCompliant: this.complianceHistory.length > 0 ? 
        this.complianceHistory[this.complianceHistory.length - 1].overallCompliance : 
        false,
      lastTestTime: this.lastTestRun,
      recentTrends
    };
  }
}

// Global compliance monitor instance
export const globalComplianceMonitor = new ComplianceMonitor();

/**
 * Real-time Compliance Validation Hook
 * 
 * Use this in components to ensure real-time compliance before showing upgrades
 */
export function useRealTimeCompliance(
  userState: UserVulnerabilityState,
  currentTier: 'sanctuary' | 'deep_cut' | 'oracle'
): {
  canShowUpgrade: boolean;
  complianceReason: string;
  nextAllowedTime: Date | null;
} {
  const { canShow, nextAvailable } = CoolingOffManager.canShowUpgradePrompt(
    userState.lastUpgradePrompt,
    userState
  );

  if (!canShow) {
    return {
      canShowUpgrade: false,
      complianceReason: 'Cooling-off period or vulnerability protection active',
      nextAllowedTime: nextAvailable
    };
  }

  const upgradeEthics = assessUpgradeEthics(userState, currentTier, []);
  
  return {
    canShowUpgrade: upgradeEthics.canShowUpgrade,
    complianceReason: upgradeEthics.reason,
    nextAllowedTime: upgradeEthics.canShowUpgrade ? null : 
      new Date(Date.now() + upgradeEthics.coolingOffPeriod * 60 * 60 * 1000)
  };
}

export default {
  runComprehensiveComplianceTest,
  ComplianceMonitor,
  globalComplianceMonitor,
  useRealTimeCompliance
};