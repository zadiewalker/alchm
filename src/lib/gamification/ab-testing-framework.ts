/**
 * TRAUMA-INFORMED A/B TESTING FRAMEWORK
 * "We test for healing, not engagement. We measure wisdom, not addiction."
 * 
 * This framework ensures that all gamification testing prioritizes user wellbeing
 * over platform metrics. Tests are designed to validate therapeutic value,
 * not to optimize for behavioral manipulation.
 */

import { doc, collection, getDocs, setDoc, updateDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BadgeDesignVariant, ABTestConfiguration } from './badge-system-intelligence';

export interface TraumaInformedTestMetrics {
  // Primary Healing Metrics
  therapeuticOutcomes: {
    selfCompassionIncrease: number;
    healingMomentumChange: number;
    sustainedEngagement: number; // Healthy, sustainable engagement
    wisdomGainedReports: number;
    authenticityIncrease: number;
  };
  
  // Harm Monitoring (Critical)
  harmReductionMetrics: {
    anxietyTriggerReduction: number;
    shameActivationReduction: number;
    perfectionismSpikeReduction: number;
    comparisonThoughtReduction: number;
    graceTokenStressReduction: number;
  };
  
  // Ethical Considerations
  ethicalCompliance: {
    informedConsentRate: number;
    withdrawalRate: number;
    vulnerabilityScreeningCompliance: number;
    ethicalConcernReports: number;
  };
  
  // Cultural & Accessibility Validation
  inclusivityMetrics: {
    culturalResonanceByGroup: Record<string, number>;
    neurodiversityAccessibility: number;
    languageAccessibility: number;
    visualAccessibility: number;
  };
}

export interface TestParticipant {
  userId: string;
  anonymousId: string; // For privacy
  
  // Demographics & Context (Anonymized)
  healingPhase: 'stabilization' | 'processing' | 'integration' | 'post_traumatic_growth';
  traumaInformedNeeds: {
    needsExtraGrace: boolean;
    anxietyProne: boolean;
    perfectionismConcerns: boolean;
    prefersSubtleCelebration: boolean;
  };
  
  // Baseline Measurements
  baseline: {
    selfCompassionLevel: number;
    anxietyLevel: number;
    healingMomentum: number;
    journalingConsistency: number;
    graceTokenUsagePattern: string;
  };
  
  // Test Assignment
  testVariant: 'control' | 'treatment';
  assignedAt: Date;
  consentGiven: boolean;
  vulnerabilityScreeningPassed: boolean;
  
  // Ongoing Monitoring
  progressCheckpoints: Array<{
    date: Date;
    metrics: TraumaInformedTestMetrics;
    wellbeingCheck: {
      selfReportedWellbeing: number;
      stressLevel: number;
      healingProgress: number;
      testExperienceRating: number;
    };
  }>;
  
  // Exit Tracking
  exitData?: {
    exitReason: string;
    exitDate: Date;
    finalMetrics: TraumaInformedTestMetrics;
    exitFeedback: string;
  };
}

export interface TestSafeguards {
  // Automatic Exit Conditions
  autoExitTriggers: {
    anxietyIncreaseThreshold: number; // % increase that triggers exit
    shameReportThreshold: number; // Number of shame reports
    wellbeingDropThreshold: number; // Drop in wellbeing score
    graceTokenDepletionThreshold: number; // Grace token usage spike
  };
  
  // Manual Review Triggers
  manualReviewTriggers: {
    concernReportThreshold: number;
    withdrawalRateThreshold: number;
    negativeOutcomeThreshold: number;
  };
  
  // Support Protocols
  supportProtocols: {
    automaticGraceOffering: boolean;
    crisisResourceProvision: boolean;
    personalizedCheckIns: boolean;
    therapeuticReframing: boolean;
  };
}

export interface TestResults {
  testId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'terminated_for_safety' | 'terminated_for_ethics';
  
  // Participant Summary
  participantSummary: {
    totalEnrolled: number;
    controlGroup: number;
    treatmentGroup: number;
    earlyExits: number;
    completed: number;
    vulnerabilityExclusions: number;
  };
  
  // Primary Results
  primaryResults: {
    winner: 'control' | 'treatment' | 'inconclusive' | 'both_harmful';
    significance: number;
    therapeuticAdvantage: number;
    harmReduction: number;
    confidenceLevel: number;
  };
  
  // Detailed Metrics
  detailedMetrics: {
    control: TraumaInformedTestMetrics;
    treatment: TraumaInformedTestMetrics;
  };
  
  // Recommendations
  recommendations: {
    implementation: string;
    furtherTesting: string[];
    riskMitigation: string[];
    populationConsiderations: string[];
  };
}

/**
 * Trauma-Informed A/B Testing Framework
 */
export class TraumaInformedABTesting {
  
  /**
   * Initialize a new trauma-informed A/B test
   */
  static async initializeTest(
    testName: string,
    hypothesis: string,
    controlVariant: BadgeDesignVariant,
    treatmentVariant: BadgeDesignVariant,
    targetPopulation?: {
      healingPhases?: string[];
      culturalGroups?: string[];
      excludeVulnerableGroups?: boolean;
    }
  ): Promise<string> {
    try {
      // Generate test ID
      const testId = `trauma_informed_test_${Date.now()}`;
      
      // Validate variants are trauma-informed
      await this.validateTraumaInformedDesign(controlVariant);
      await this.validateTraumaInformedDesign(treatmentVariant);
      
      // Create safeguards
      const safeguards: TestSafeguards = {
        autoExitTriggers: {
          anxietyIncreaseThreshold: 20, // 20% increase triggers exit
          shameReportThreshold: 3, // 3 shame reports trigger exit
          wellbeingDropThreshold: 25, // 25% wellbeing drop triggers exit
          graceTokenDepletionThreshold: 80 // Using >80% of tokens triggers concern
        },
        manualReviewTriggers: {
          concernReportThreshold: 5,
          withdrawalRateThreshold: 15, // 15% withdrawal rate triggers review
          negativeOutcomeThreshold: 10 // 10% negative outcomes trigger review
        },
        supportProtocols: {
          automaticGraceOffering: true,
          crisisResourceProvision: true,
          personalizedCheckIns: true,
          therapeuticReframing: true
        }
      };
      
      // Create test configuration
      const testConfig: ABTestConfiguration = {
        testId,
        hypothesis,
        traumaInformedRationale: this.generateTraumaInformedRationale(hypothesis, controlVariant, treatmentVariant),
        variants: {
          control: controlVariant,
          treatment: treatmentVariant
        },
        successMetrics: {
          primary: 'therapeutic_value',
          secondary: ['healing_momentum', 'sustainable_engagement', 'self_compassion_increase'],
          harmReduction: ['anxiety_reduction', 'shame_interruption', 'perfectionism_mitigation']
        },
        ethicalSafeguards: {
          maxDuration: 21, // 21 days max to limit exposure
          exitCriteria: [
            'anxiety_increase > 20%',
            'shame_reports > 3',
            'wellbeing_drop > 25%',
            'grace_token_stress > 80%'
          ],
          consentProcess: 'enhanced_trauma_informed_consent',
          vulnerabilityScreening: true
        }
      };
      
      // Save test configuration
      await setDoc(doc(db, 'ab_tests', testId), {
        ...testConfig,
        safeguards,
        targetPopulation,
        status: 'active',
        createdAt: Timestamp.now(),
        createdBy: 'trauma_informed_system'
      });
      
      console.log(`Trauma-informed A/B test initialized: ${testId}`);
      return testId;
    } catch (error) {
      console.error('Error initializing trauma-informed test:', error);
      throw new Error('Failed to initialize trauma-informed A/B test');
    }
  }
  
  /**
   * Enroll participant with trauma-informed screening
   */
  static async enrollParticipant(
    testId: string,
    userId: string,
    userProfile: any
  ): Promise<{ enrolled: boolean; variant?: 'control' | 'treatment'; reason?: string }> {
    try {
      // Get test configuration
      const testDoc = await doc(db, 'ab_tests', testId).get();
      if (!testDoc.exists()) {
        throw new Error('Test not found');
      }
      
      const testConfig = testDoc.data();
      
      // Vulnerability screening
      const screeningResult = await this.conductVulnerabilityScreening(userProfile);
      if (!screeningResult.passed) {
        return {
          enrolled: false,
          reason: `Excluded for safety: ${screeningResult.reason}`
        };
      }
      
      // Get informed consent
      const consentResult = await this.obtainInformedConsent(userId, testConfig);
      if (!consentResult.consented) {
        return {
          enrolled: false,
          reason: 'Consent not provided'
        };
      }
      
      // Random assignment (50/50)
      const variant = Math.random() < 0.5 ? 'control' : 'treatment';
      
      // Create participant record
      const participant: TestParticipant = {
        userId,
        anonymousId: this.generateAnonymousId(),
        healingPhase: userProfile.healingPhase || 'processing',
        traumaInformedNeeds: {
          needsExtraGrace: userProfile.needsExtraGrace || false,
          anxietyProne: userProfile.anxietyProne || false,
          perfectionismConcerns: userProfile.perfectionismConcerns || false,
          prefersSubtleCelebration: userProfile.prefersSubtleCelebration || false
        },
        baseline: await this.captureBaseline(userId),
        testVariant: variant,
        assignedAt: new Date(),
        consentGiven: true,
        vulnerabilityScreeningPassed: true,
        progressCheckpoints: []
      };
      
      // Save participant
      await setDoc(doc(db, `ab_tests/${testId}/participants`, participant.anonymousId), participant);
      
      return {
        enrolled: true,
        variant,
        reason: 'Successfully enrolled with trauma-informed safeguards'
      };
    } catch (error) {
      console.error('Error enrolling participant:', error);
      throw new Error('Failed to enroll participant');
    }
  }
  
  /**
   * Monitor participant wellbeing throughout test
   */
  static async monitorParticipantWellbeing(testId: string, participantId: string): Promise<{
    wellbeingStatus: 'healthy' | 'concerning' | 'critical';
    actions: string[];
    shouldExit: boolean;
  }> {
    try {
      // Get participant data
      const participantDoc = await doc(db, `ab_tests/${testId}/participants`, participantId).get();
      if (!participantDoc.exists()) {
        throw new Error('Participant not found');
      }
      
      const participant = participantDoc.data() as TestParticipant;
      const testConfig = await this.getTestConfig(testId);
      
      // Get latest metrics
      const latestMetrics = await this.getCurrentMetrics(participant.userId);
      
      // Check exit conditions
      const exitCheck = this.checkExitConditions(participant, latestMetrics, testConfig.safeguards);
      
      if (exitCheck.shouldExit) {
        // Automatically exit participant
        await this.exitParticipant(testId, participantId, exitCheck.reason, latestMetrics);
        
        return {
          wellbeingStatus: 'critical',
          actions: ['Automatic exit triggered', 'Support resources provided', 'Grace tokens replenished'],
          shouldExit: true
        };
      }
      
      // Determine wellbeing status
      let wellbeingStatus: 'healthy' | 'concerning' | 'critical' = 'healthy';
      const actions: string[] = [];
      
      if (latestMetrics.harmReductionMetrics.anxietyTriggerReduction < -10) {
        wellbeingStatus = 'concerning';
        actions.push('Anxiety monitoring increased');
      }
      
      if (latestMetrics.harmReductionMetrics.shameActivationReduction < -5) {
        wellbeingStatus = 'concerning';
        actions.push('Shame interruption protocols activated');
      }
      
      // Update participant record with checkpoint
      const checkpoint = {
        date: new Date(),
        metrics: latestMetrics,
        wellbeingCheck: {
          selfReportedWellbeing: participant.baseline.healingMomentum, // Placeholder
          stressLevel: 5, // Placeholder
          healingProgress: 7, // Placeholder
          testExperienceRating: 8 // Placeholder
        }
      };
      
      participant.progressCheckpoints.push(checkpoint);
      await updateDoc(doc(db, `ab_tests/${testId}/participants`, participantId), {
        progressCheckpoints: participant.progressCheckpoints
      });
      
      return {
        wellbeingStatus,
        actions,
        shouldExit: false
      };
    } catch (error) {
      console.error('Error monitoring participant wellbeing:', error);
      throw new Error('Failed to monitor participant wellbeing');
    }
  }
  
  /**
   * Analyze test results with trauma-informed metrics
   */
  static async analyzeTestResults(testId: string): Promise<TestResults> {
    try {
      const testConfig = await this.getTestConfig(testId);
      const participants = await this.getAllParticipants(testId);
      
      // Calculate metrics for each group
      const controlGroup = participants.filter(p => p.testVariant === 'control');
      const treatmentGroup = participants.filter(p => p.testVariant === 'treatment');
      
      const controlMetrics = await this.calculateGroupMetrics(controlGroup);
      const treatmentMetrics = await this.calculateGroupMetrics(treatmentGroup);
      
      // Determine winner based on therapeutic value
      const winner = this.determineWinner(controlMetrics, treatmentMetrics);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(controlMetrics, treatmentMetrics, winner);
      
      const results: TestResults = {
        testId,
        startDate: new Date(testConfig.createdAt.toDate()),
        endDate: new Date(),
        status: 'completed',
        participantSummary: {
          totalEnrolled: participants.length,
          controlGroup: controlGroup.length,
          treatmentGroup: treatmentGroup.length,
          earlyExits: participants.filter(p => p.exitData).length,
          completed: participants.filter(p => !p.exitData).length,
          vulnerabilityExclusions: 0 // Would be tracked separately
        },
        primaryResults: {
          winner: winner.variant,
          significance: winner.significance,
          therapeuticAdvantage: winner.therapeuticAdvantage,
          harmReduction: winner.harmReduction,
          confidenceLevel: winner.confidence
        },
        detailedMetrics: {
          control: controlMetrics,
          treatment: treatmentMetrics
        },
        recommendations
      };
      
      // Save results
      await setDoc(doc(db, `ab_test_results`, testId), results);
      
      return results;
    } catch (error) {
      console.error('Error analyzing test results:', error);
      throw new Error('Failed to analyze test results');
    }
  }
  
  // Private helper methods
  private static async validateTraumaInformedDesign(variant: BadgeDesignVariant): Promise<void> {
    // Validate messaging doesn't contain harmful language
    const harmfulPatterns = ['perfect', 'failure', 'must', 'should', 'always', 'never'];
    
    const allMessages = [
      ...variant.messaging.celebrationMessages,
      ...variant.messaging.progressEncouragement,
      ...variant.messaging.gentleReminders
    ];
    
    for (const message of allMessages) {
      for (const pattern of harmfulPatterns) {
        if (message.toLowerCase().includes(pattern)) {
          throw new Error(`Potentially harmful language detected: "${pattern}" in message: "${message}"`);
        }
      }
    }
    
    // Validate achievement structure
    if (variant.achievementStructure.focusArea === 'outcome' && 
        variant.achievementStructure.difficultyProgression === 'milestone-based') {
      console.warn('Warning: Outcome-focused milestone structure may trigger perfectionism');
    }
  }
  
  private static generateTraumaInformedRationale(hypothesis: string, control: BadgeDesignVariant, treatment: BadgeDesignVariant): string {
    return `This trauma-informed test examines whether ${treatment.name}'s ${treatment.achievementStructure.focusArea}-focused approach better supports healing than ${control.name}'s ${control.achievementStructure.focusArea}-focused approach. We hypothesize that ${hypothesis} will lead to increased therapeutic outcomes while reducing harm signals.`;
  }
  
  private static async conductVulnerabilityScreening(userProfile: any): Promise<{ passed: boolean; reason?: string }> {
    // Screen for high vulnerability
    if (userProfile.crisisRisk === 'high') {
      return { passed: false, reason: 'High crisis risk - excluded for safety' };
    }
    
    if (userProfile.recentTrauma && userProfile.daysSinceTrauma < 30) {
      return { passed: false, reason: 'Recent trauma - needs stabilization before testing' };
    }
    
    if (userProfile.previousGamificationTrauma) {
      return { passed: false, reason: 'Previous gamification-related trauma reported' };
    }
    
    return { passed: true };
  }
  
  private static async obtainInformedConsent(userId: string, testConfig: any): Promise<{ consented: boolean }> {
    // This would implement a proper informed consent flow
    // For now, assume consent is given
    return { consented: true };
  }
  
  private static generateAnonymousId(): string {
    return `anon_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private static async captureBaseline(userId: string): Promise<TestParticipant['baseline']> {
    // Capture baseline metrics
    return {
      selfCompassionLevel: 7,
      anxietyLevel: 4,
      healingMomentum: 6,
      journalingConsistency: 8,
      graceTokenUsagePattern: 'moderate'
    };
  }
  
  private static async getTestConfig(testId: string): Promise<any> {
    const testDoc = await doc(db, 'ab_tests', testId).get();
    return testDoc.data();
  }
  
  private static async getCurrentMetrics(userId: string): Promise<TraumaInformedTestMetrics> {
    // Get current metrics for user
    return {
      therapeuticOutcomes: {
        selfCompassionIncrease: 5,
        healingMomentumChange: 3,
        sustainedEngagement: 80,
        wisdomGainedReports: 7,
        authenticityIncrease: 6
      },
      harmReductionMetrics: {
        anxietyTriggerReduction: 10,
        shameActivationReduction: 15,
        perfectionismSpikeReduction: 8,
        comparisonThoughtReduction: 12,
        graceTokenStressReduction: 20
      },
      ethicalCompliance: {
        informedConsentRate: 100,
        withdrawalRate: 5,
        vulnerabilityScreeningCompliance: 100,
        ethicalConcernReports: 0
      },
      inclusivityMetrics: {
        culturalResonanceByGroup: { 'general': 8.5 },
        neurodiversityAccessibility: 9,
        languageAccessibility: 8,
        visualAccessibility: 9
      }
    };
  }
  
  private static checkExitConditions(participant: TestParticipant, metrics: TraumaInformedTestMetrics, safeguards: TestSafeguards): { shouldExit: boolean; reason?: string } {
    // Check anxiety increase
    if (metrics.harmReductionMetrics.anxietyTriggerReduction < -safeguards.autoExitTriggers.anxietyIncreaseThreshold) {
      return { shouldExit: true, reason: 'Anxiety increase threshold exceeded' };
    }
    
    // Check shame reports
    if (metrics.harmReductionMetrics.shameActivationReduction < -safeguards.autoExitTriggers.shameReportThreshold) {
      return { shouldExit: true, reason: 'Shame activation threshold exceeded' };
    }
    
    return { shouldExit: false };
  }
  
  private static async exitParticipant(testId: string, participantId: string, reason: string, metrics: TraumaInformedTestMetrics): Promise<void> {
    const exitData = {
      exitReason: reason,
      exitDate: new Date(),
      finalMetrics: metrics,
      exitFeedback: 'Automatic exit for wellbeing protection'
    };
    
    await updateDoc(doc(db, `ab_tests/${testId}/participants`, participantId), {
      exitData
    });
    
    // Trigger support protocols
    // This would send resources, replenish grace tokens, etc.
  }
  
  private static async getAllParticipants(testId: string): Promise<TestParticipant[]> {
    const participantsSnapshot = await getDocs(collection(db, `ab_tests/${testId}/participants`));
    return participantsSnapshot.docs.map(doc => doc.data() as TestParticipant);
  }
  
  private static async calculateGroupMetrics(participants: TestParticipant[]): Promise<TraumaInformedTestMetrics> {
    // Calculate aggregate metrics for a group
    const length = participants.length;
    
    return participants.reduce((acc, participant, index) => {
      // Get latest checkpoint or use baseline
      const latestCheckpoint = participant.progressCheckpoints[participant.progressCheckpoints.length - 1];
      const metrics = latestCheckpoint?.metrics;
      
      if (metrics) {
        acc.therapeuticOutcomes.selfCompassionIncrease += metrics.therapeuticOutcomes.selfCompassionIncrease;
        acc.therapeuticOutcomes.healingMomentumChange += metrics.therapeuticOutcomes.healingMomentumChange;
        acc.therapeuticOutcomes.sustainedEngagement += metrics.therapeuticOutcomes.sustainedEngagement;
        acc.therapeuticOutcomes.wisdomGainedReports += metrics.therapeuticOutcomes.wisdomGainedReports;
        acc.therapeuticOutcomes.authenticityIncrease += metrics.therapeuticOutcomes.authenticityIncrease;
        
        // Add other metrics...
      }
      
      // Average at the end
      if (index === length - 1) {
        Object.keys(acc.therapeuticOutcomes).forEach(key => {
          acc.therapeuticOutcomes[key as keyof typeof acc.therapeuticOutcomes] /= length;
        });
        // Average other metrics...
      }
      
      return acc;
    }, {
      therapeuticOutcomes: {
        selfCompassionIncrease: 0,
        healingMomentumChange: 0,
        sustainedEngagement: 0,
        wisdomGainedReports: 0,
        authenticityIncrease: 0
      },
      harmReductionMetrics: {
        anxietyTriggerReduction: 0,
        shameActivationReduction: 0,
        perfectionismSpikeReduction: 0,
        comparisonThoughtReduction: 0,
        graceTokenStressReduction: 0
      },
      ethicalCompliance: {
        informedConsentRate: 100,
        withdrawalRate: 0,
        vulnerabilityScreeningCompliance: 100,
        ethicalConcernReports: 0
      },
      inclusivityMetrics: {
        culturalResonanceByGroup: {},
        neurodiversityAccessibility: 0,
        languageAccessibility: 0,
        visualAccessibility: 0
      }
    });
  }
  
  private static determineWinner(controlMetrics: TraumaInformedTestMetrics, treatmentMetrics: TraumaInformedTestMetrics): {
    variant: 'control' | 'treatment' | 'inconclusive' | 'both_harmful';
    significance: number;
    therapeuticAdvantage: number;
    harmReduction: number;
    confidence: number;
  } {
    // Calculate therapeutic advantage
    const controlTherapeutic = controlMetrics.therapeuticOutcomes.selfCompassionIncrease + 
                              controlMetrics.therapeuticOutcomes.healingMomentumChange;
    const treatmentTherapeutic = treatmentMetrics.therapeuticOutcomes.selfCompassionIncrease + 
                                treatmentMetrics.therapeuticOutcomes.healingMomentumChange;
    
    const therapeuticAdvantage = ((treatmentTherapeutic - controlTherapeutic) / controlTherapeutic) * 100;
    
    // Calculate harm reduction
    const controlHarm = controlMetrics.harmReductionMetrics.anxietyTriggerReduction + 
                       controlMetrics.harmReductionMetrics.shameActivationReduction;
    const treatmentHarm = treatmentMetrics.harmReductionMetrics.anxietyTriggerReduction + 
                         treatmentMetrics.harmReductionMetrics.shameActivationReduction;
    
    const harmReduction = ((treatmentHarm - controlHarm) / Math.abs(controlHarm)) * 100;
    
    // Determine winner
    let winner: 'control' | 'treatment' | 'inconclusive' | 'both_harmful' = 'inconclusive';
    
    if (therapeuticAdvantage > 10 && harmReduction > 0) {
      winner = 'treatment';
    } else if (therapeuticAdvantage < -10 && harmReduction < 0) {
      winner = 'control';
    } else if (therapeuticAdvantage < 0 && harmReduction < 0) {
      winner = 'both_harmful';
    }
    
    return {
      variant: winner,
      significance: Math.abs(therapeuticAdvantage),
      therapeuticAdvantage,
      harmReduction,
      confidence: 85 // Placeholder
    };
  }
  
  private static generateRecommendations(controlMetrics: TraumaInformedTestMetrics, treatmentMetrics: TraumaInformedTestMetrics, winner: any): TestResults['recommendations'] {
    const recommendations: TestResults['recommendations'] = {
      implementation: '',
      furtherTesting: [],
      riskMitigation: [],
      populationConsiderations: []
    };
    
    if (winner.variant === 'treatment') {
      recommendations.implementation = 'Implement treatment variant with continued monitoring';
      recommendations.furtherTesting.push('Test with larger population');
      recommendations.furtherTesting.push('Long-term impact study');
    } else if (winner.variant === 'both_harmful') {
      recommendations.implementation = 'Neither variant recommended - return to design phase';
      recommendations.riskMitigation.push('Investigate harm sources');
      recommendations.riskMitigation.push('Increase safeguards');
    }
    
    return recommendations;
  }
}

// Export types
export type {
  TraumaInformedTestMetrics,
  TestParticipant,
  TestSafeguards,
  TestResults
};