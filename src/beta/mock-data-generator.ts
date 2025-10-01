/**
 * ALCHM Therapist Beta Testing - HIPAA-Compliant Mock Data Generator
 * Generates realistic but entirely fictional client data for therapeutic testing
 * NO REAL CLIENT DATA - ALL SYNTHETIC FOR CLINICAL TRAINING PURPOSES
 */

import { z } from 'zod';

// Mock client demographics (entirely fictional)
export const MOCK_CLIENT_DEMOGRAPHICS = {
  ageRanges: [
    { min: 16, max: 18, category: 'adolescent' },
    { min: 19, max: 30, category: 'young_adult' },
    { min: 31, max: 50, category: 'adult' },
    { min: 51, max: 70, category: 'middle_aged' },
    { min: 71, max: 90, category: 'elderly' }
  ],
  
  genderIdentities: [
    'female', 'male', 'non-binary', 'transgender_female', 
    'transgender_male', 'genderfluid', 'prefer_not_to_say'
  ],
  
  ethnicities: [
    'caucasian', 'african_american', 'hispanic_latino', 'asian',
    'native_american', 'pacific_islander', 'middle_eastern', 'mixed_ethnicity'
  ],
  
  socioeconomicLevels: [
    'low_income', 'lower_middle', 'middle_class', 'upper_middle', 'high_income'
  ]
} as const;

// Clinical presentation categories for testing
export const CLINICAL_PRESENTATIONS = [
  'anxiety_disorders',
  'depressive_disorders', 
  'trauma_and_ptsd',
  'bipolar_disorders',
  'personality_disorders',
  'substance_use_disorders',
  'eating_disorders',
  'adjustment_disorders',
  'grief_and_loss',
  'relationship_issues',
  'identity_exploration',
  'life_transitions',
  'chronic_illness_adjustment',
  'neurodivergent_support'
] as const;

// Crisis risk levels for testing emergency systems
export const CRISIS_RISK_LEVELS = [
  'none',
  'low',
  'moderate', 
  'high',
  'imminent'
] as const;

// Therapeutic modalities for treatment planning testing
export const THERAPEUTIC_MODALITIES = [
  'cognitive_behavioral_therapy',
  'dialectical_behavior_therapy',
  'acceptance_commitment_therapy',
  'psychodynamic_therapy',
  'humanistic_therapy',
  'family_systems_therapy',
  'trauma_focused_therapy',
  'mindfulness_based_therapy',
  'solution_focused_therapy',
  'narrative_therapy'
] as const;

// Mock client profile schema
export const MockClientProfileSchema = z.object({
  // Synthetic identification
  mockClientId: z.string().uuid(),
  pseudonym: z.string().min(2), // Fictional name for clinical reference
  
  // Demographics (synthetic)
  age: z.number().min(16).max(90),
  genderIdentity: z.enum(['female', 'male', 'non-binary', 'transgender_female', 'transgender_male', 'genderfluid', 'prefer_not_to_say']),
  ethnicity: z.enum(['caucasian', 'african_american', 'hispanic_latino', 'asian', 'native_american', 'pacific_islander', 'middle_eastern', 'mixed_ethnicity']),
  socioeconomicLevel: z.enum(['low_income', 'lower_middle', 'middle_class', 'upper_middle', 'high_income']),
  
  // Clinical presentation
  primaryDiagnosis: z.enum(CLINICAL_PRESENTATIONS),
  secondaryDiagnoses: z.array(z.enum(CLINICAL_PRESENTATIONS)),
  currentRiskLevel: z.enum(CRISIS_RISK_LEVELS),
  
  // Treatment context
  treatmentModality: z.enum(THERAPEUTIC_MODALITIES),
  sessionFrequency: z.enum(['weekly', 'biweekly', 'monthly', 'as_needed']),
  treatmentDuration: z.number().min(1).max(60), // months
  
  // Progress indicators for testing
  currentMoodBaseline: z.number().min(1).max(10),
  anxietyLevel: z.number().min(1).max(10),
  functionalImpairment: z.number().min(1).max(10),
  
  // Synthetic background (for therapeutic context)
  backgroundNarrative: z.string().max(2000),
  currentStressors: z.array(z.string()),
  copingStrategies: z.array(z.string()),
  supportSystems: z.array(z.string()),
  
  // Crisis indicators for testing emergency systems
  crisisIndicators: z.object({
    suicidalIdeation: z.boolean(),
    selfHarmBehaviors: z.boolean(),
    substanceAbuse: z.boolean(),
    severeAgitation: z.boolean(),
    psychoticSymptoms: z.boolean()
  }),
  
  // Therapeutic relationship factors
  engagementLevel: z.enum(['poor', 'fair', 'good', 'excellent']),
  therapyReadiness: z.number().min(1).max(10),
  
  // Mock metadata
  createdForTesting: z.boolean().default(true),
  assignedTherapist: z.string().uuid(),
  testingScenarios: z.array(z.string()),
  
  // Privacy and compliance
  dataType: z.literal('mock_synthetic_data'),
  hipaaCompliant: z.literal(true),
  realClientData: z.literal(false)
});

export type MockClientProfile = z.infer<typeof MockClientProfileSchema>;

// Mock journal entry schema for crisis testing
export const MockJournalEntrySchema = z.object({
  mockEntryId: z.string().uuid(),
  mockClientId: z.string().uuid(),
  pseudonym: z.string(),
  
  // Entry metadata
  timestamp: z.date(),
  sessionContext: z.enum(['pre_session', 'post_session', 'between_sessions', 'crisis_moment']),
  
  // Content (synthetic therapeutic content)
  content: z.string().min(50).max(5000),
  mood: z.number().min(1).max(10),
  anxiety: z.number().min(1).max(10),
  
  // Crisis indicators for testing
  crisisKeywords: z.array(z.string()),
  riskLevel: z.enum(CRISIS_RISK_LEVELS),
  requiresImmediateAttention: z.boolean(),
  
  // AI testing indicators
  aiInsightTriggers: z.array(z.string()),
  expectedAIResponse: z.string().optional(),
  
  // Testing metadata
  scenarioType: z.enum(['routine_check_in', 'breakthrough_moment', 'crisis_expression', 'progress_reflection', 'setback_processing']),
  testingObjective: z.string(),
  expectedTherapistNotification: z.boolean(),
  
  // Compliance markers
  syntheticContent: z.literal(true),
  realJournalEntry: z.literal(false),
  educationalPurpose: z.literal(true)
});

export type MockJournalEntry = z.infer<typeof MockJournalEntrySchema>;

/**
 * HIPAA-Compliant Mock Data Generator
 * Creates realistic but entirely synthetic client data for clinical training
 */
export class MockDataGenerator {
  private static instance: MockDataGenerator;
  private readonly FICTIONAL_FIRST_NAMES = [
    'Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Jamie', 'Riley', 'Sage',
    'Cameron', 'Avery', 'Quinn', 'Blake', 'Emery', 'Finley', 'Hayden', 'Kendall',
    'Logan', 'Marley', 'Nico', 'Payton', 'Remi', 'Skylar', 'Tatum', 'Wren'
  ];
  
  private readonly CRISIS_SCENARIOS = {
    none: {
      keywords: [],
      content: "Today was okay. I felt pretty stable and managed to get through my work tasks. I'm working on the coping strategies we discussed."
    },
    low: {
      keywords: ['stressed', 'overwhelmed', 'tired'],
      content: "I'm feeling pretty overwhelmed with everything going on. Work has been stressful and I'm having trouble sleeping. I know I should use my breathing exercises but I keep forgetting."
    },
    moderate: {
      keywords: ['hopeless', 'worthless', 'burden'],
      content: "I've been feeling really hopeless lately. Sometimes I wonder if things will ever get better. I feel like such a burden to everyone around me. I don't want to keep feeling this way."
    },
    high: {
      keywords: ['suicidal thoughts', 'end it all', 'better off dead'],
      content: "I've been having thoughts about not wanting to be here anymore. I don't have a plan, but the thoughts are getting stronger. I feel like everyone would be better off without me."
    },
    imminent: {
      keywords: ['suicide plan', 'pills', 'tonight', 'goodbye'],
      content: "I can't take this anymore. I have the pills and I think tonight might be the night. I'm writing this as a way to say goodbye. I'm sorry but I can't keep fighting."
    }
  };

  private readonly THERAPEUTIC_SCENARIOS = [
    {
      type: 'breakthrough_moment',
      content: "I had this amazing realization today during our session. When you asked about my childhood patterns, something just clicked. I can see how I've been recreating the same dynamics in my relationships. It's like a light bulb went off.",
      mood: 7,
      anxiety: 4,
      expectedAIResponse: 'Breakthrough insight about relationship patterns'
    },
    {
      type: 'setback_processing',
      content: "I relapsed again yesterday. I know we talked about this pattern but I still fell into it. I'm disappointed in myself but trying to remember what you said about progress not being linear.",
      mood: 3,
      anxiety: 8,
      expectedAIResponse: 'Relapse processing with self-compassion work needed'
    },
    {
      type: 'progress_reflection',
      content: "Looking back at where I was three months ago, I can actually see the progress. I'm handling triggers better and my relationships are improving. I still have work to do but I feel hopeful.",
      mood: 8,
      anxiety: 3,
      expectedAIResponse: 'Positive progress reflection with maintained motivation'
    }
  ];

  static getInstance(): MockDataGenerator {
    if (!MockDataGenerator.instance) {
      MockDataGenerator.instance = new MockDataGenerator();
    }
    return MockDataGenerator.instance;
  }

  /**
   * Generate a complete mock client profile for therapist testing
   */
  generateMockClient(overrides?: Partial<MockClientProfile>): MockClientProfile {
    const ageRange = this.randomChoice(MOCK_CLIENT_DEMOGRAPHICS.ageRanges);
    const age = this.randomInt(ageRange.min, ageRange.max);
    const primaryDiagnosis = this.randomChoice(CLINICAL_PRESENTATIONS);
    
    const baseProfile: MockClientProfile = {
      mockClientId: this.generateUUID(),
      pseudonym: this.generatePseudonym(),
      age,
      genderIdentity: this.randomChoice(MOCK_CLIENT_DEMOGRAPHICS.genderIdentities),
      ethnicity: this.randomChoice(MOCK_CLIENT_DEMOGRAPHICS.ethnicities),
      socioeconomicLevel: this.randomChoice(MOCK_CLIENT_DEMOGRAPHICS.socioeconomicLevels),
      primaryDiagnosis,
      secondaryDiagnoses: this.generateSecondaryDiagnoses(primaryDiagnosis),
      currentRiskLevel: this.randomChoice(CRISIS_RISK_LEVELS),
      treatmentModality: this.randomChoice(THERAPEUTIC_MODALITIES),
      sessionFrequency: this.randomChoice(['weekly', 'biweekly', 'monthly', 'as_needed']),
      treatmentDuration: this.randomInt(1, 24),
      currentMoodBaseline: this.randomInt(1, 10),
      anxietyLevel: this.randomInt(1, 10),
      functionalImpairment: this.randomInt(1, 10),
      backgroundNarrative: this.generateBackgroundNarrative(primaryDiagnosis, age),
      currentStressors: this.generateCurrentStressors(),
      copingStrategies: this.generateCopingStrategies(),
      supportSystems: this.generateSupportSystems(),
      crisisIndicators: this.generateCrisisIndicators(),
      engagementLevel: this.randomChoice(['poor', 'fair', 'good', 'excellent']),
      therapyReadiness: this.randomInt(1, 10),
      createdForTesting: true,
      assignedTherapist: overrides?.assignedTherapist || this.generateUUID(),
      testingScenarios: this.generateTestingScenarios(primaryDiagnosis),
      dataType: 'mock_synthetic_data',
      hipaaCompliant: true,
      realClientData: false
    };

    return { ...baseProfile, ...overrides };
  }

  /**
   * Generate mock journal entry for crisis detection testing
   */
  generateMockJournalEntry(
    clientProfile: MockClientProfile,
    scenario?: keyof typeof this.CRISIS_SCENARIOS
  ): MockJournalEntry {
    const selectedScenario = scenario || this.randomChoice(Object.keys(this.CRISIS_SCENARIOS) as Array<keyof typeof this.CRISIS_SCENARIOS>);
    const scenarioData = this.CRISIS_SCENARIOS[selectedScenario];
    
    const therapeuticScenario = this.randomChoice(this.THERAPEUTIC_SCENARIOS);
    
    // Decide between crisis scenario or therapeutic scenario
    const isCrisisScenario = Math.random() < 0.3; // 30% crisis scenarios
    
    const entryData = isCrisisScenario ? {
      content: scenarioData.content + " " + this.addPersonalContext(clientProfile),
      crisisKeywords: scenarioData.keywords,
      riskLevel: selectedScenario,
      requiresImmediateAttention: selectedScenario === 'high' || selectedScenario === 'imminent',
      scenarioType: 'crisis_expression' as const,
      mood: selectedScenario === 'imminent' ? 1 : this.randomInt(1, 4),
      anxiety: selectedScenario === 'imminent' ? 10 : this.randomInt(6, 10)
    } : {
      content: therapeuticScenario.content + " " + this.addPersonalContext(clientProfile),
      crisisKeywords: [],
      riskLevel: clientProfile.currentRiskLevel,
      requiresImmediateAttention: false,
      scenarioType: therapeuticScenario.type as any,
      mood: therapeuticScenario.mood,
      anxiety: therapeuticScenario.anxiety
    };

    return {
      mockEntryId: this.generateUUID(),
      mockClientId: clientProfile.mockClientId,
      pseudonym: clientProfile.pseudonym,
      timestamp: new Date(Date.now() - this.randomInt(0, 7 * 24 * 60 * 60 * 1000)), // Random time in last week
      sessionContext: this.randomChoice(['pre_session', 'post_session', 'between_sessions', 'crisis_moment']),
      ...entryData,
      aiInsightTriggers: this.generateAIInsightTriggers(entryData.content),
      expectedAIResponse: this.generateExpectedAIResponse(entryData.content, entryData.riskLevel),
      testingObjective: `Test ${isCrisisScenario ? 'crisis detection' : 'therapeutic insight'} for ${clientProfile.primaryDiagnosis}`,
      expectedTherapistNotification: entryData.requiresImmediateAttention,
      syntheticContent: true,
      realJournalEntry: false,
      educationalPurpose: true
    };
  }

  /**
   * Generate a cohort of mock clients for therapist testing
   */
  generateClientCohort(therapistId: string, cohortSize: number = 8): MockClientProfile[] {
    const cohort: MockClientProfile[] = [];
    const diagnoses = [...CLINICAL_PRESENTATIONS];
    
    // Ensure diversity in presentations
    for (let i = 0; i < cohortSize; i++) {
      const diagnosis = diagnoses.length > 0 
        ? diagnoses.splice(this.randomInt(0, diagnoses.length - 1), 1)[0]
        : this.randomChoice(CLINICAL_PRESENTATIONS);
      
      const client = this.generateMockClient({
        assignedTherapist: therapistId,
        primaryDiagnosis: diagnosis
      });
      
      cohort.push(client);
    }
    
    return cohort;
  }

  /**
   * Generate crisis testing scenarios for emergency escalation training
   */
  generateCrisisTestingScenarios(clientProfile: MockClientProfile): Array<{
    scenarioId: string;
    riskLevel: typeof CRISIS_RISK_LEVELS[number];
    journalEntry: MockJournalEntry;
    expectedResponse: {
      shouldTriggerAlert: boolean;
      suggestedActions: string[];
      urgencyLevel: number;
    };
  }> {
    const scenarios = [];
    
    // Generate one scenario for each crisis level
    for (const riskLevel of CRISIS_RISK_LEVELS) {
      if (riskLevel === 'none') continue;
      
      const journalEntry = this.generateMockJournalEntry(clientProfile, riskLevel);
      const scenarioId = this.generateUUID();
      
      scenarios.push({
        scenarioId,
        riskLevel,
        journalEntry,
        expectedResponse: this.generateExpectedCrisisResponse(riskLevel)
      });
    }
    
    return scenarios;
  }

  /**
   * Generate treatment planning test data
   */
  generateMockTreatmentPlan(clientProfile: MockClientProfile): {
    planId: string;
    clientId: string;
    goals: Array<{
      goalId: string;
      objective: string;
      interventions: string[];
      timeline: string;
      measurableOutcomes: string[];
    }>;
    riskManagement: {
      identifiedRisks: string[];
      mitigationStrategies: string[];
      emergencyContacts: string[];
    };
    progressMetrics: {
      baselineMeasures: Record<string, number>;
      targetMeasures: Record<string, number>;
      reviewFrequency: string;
    };
  } {
    const goals = this.generateTreatmentGoals(clientProfile.primaryDiagnosis);
    
    return {
      planId: this.generateUUID(),
      clientId: clientProfile.mockClientId,
      goals,
      riskManagement: {
        identifiedRisks: this.generateIdentifiedRisks(clientProfile),
        mitigationStrategies: this.generateMitigationStrategies(clientProfile.primaryDiagnosis),
        emergencyContacts: ['Crisis Hotline: 988', 'Emergency: 911', 'Therapist: (555) 123-4567']
      },
      progressMetrics: {
        baselineMeasures: {
          mood: clientProfile.currentMoodBaseline,
          anxiety: clientProfile.anxietyLevel,
          functioning: 11 - clientProfile.functionalImpairment
        },
        targetMeasures: {
          mood: Math.min(10, clientProfile.currentMoodBaseline + 2),
          anxiety: Math.max(1, clientProfile.anxietyLevel - 2),
          functioning: Math.min(10, 11 - clientProfile.functionalImpairment + 2)
        },
        reviewFrequency: 'monthly'
      }
    };
  }

  // Private helper methods
  private randomChoice<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private generatePseudonym(): string {
    const firstName = this.randomChoice(this.FICTIONAL_FIRST_NAMES);
    const lastInitial = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    return `${firstName} ${lastInitial}.`;
  }

  private generateSecondaryDiagnoses(primary: string): string[] {
    const possible = CLINICAL_PRESENTATIONS.filter(d => d !== primary);
    const count = Math.random() < 0.6 ? 1 : (Math.random() < 0.8 ? 2 : 0);
    
    const secondary = [];
    for (let i = 0; i < count; i++) {
      const diagnosis = this.randomChoice(possible);
      if (!secondary.includes(diagnosis)) {
        secondary.push(diagnosis);
      }
    }
    
    return secondary;
  }

  private generateBackgroundNarrative(diagnosis: string, age: number): string {
    const templates = {
      anxiety_disorders: `${this.generatePseudonym()} is a ${age}-year-old individual presenting with chronic anxiety symptoms that began in early adulthood. They report persistent worry about daily activities and future events, with physical symptoms including restlessness and difficulty concentrating. They have been managing symptoms independently but seek professional support to develop more effective coping strategies.`,
      
      depressive_disorders: `${this.generatePseudonym()} is experiencing persistent low mood and decreased motivation that has impacted their daily functioning for several months. They report difficulty with energy levels, sleep disturbances, and loss of interest in previously enjoyable activities. They are seeking therapy to understand their symptoms better and develop tools for managing depression.`,
      
      trauma_and_ptsd: `${this.generatePseudonym()} is working through the impact of past traumatic experiences that continue to affect their daily life. They experience symptoms including hypervigilance, intrusive memories, and avoidance of certain situations. They are motivated to engage in trauma-informed therapy to process their experiences and develop healthy coping mechanisms.`
    };
    
    return templates[diagnosis as keyof typeof templates] || 
           `${this.generatePseudonym()} is a ${age}-year-old individual seeking therapeutic support to address personal challenges and improve their overall mental health and well-being.`;
  }

  private generateCurrentStressors(): string[] {
    const possibleStressors = [
      'Work-related pressure and deadlines',
      'Financial concerns and budgeting',
      'Relationship difficulties',
      'Family responsibilities and dynamics',
      'Health concerns or chronic illness',
      'Academic or educational pressures',
      'Social anxiety and isolation',
      'Life transitions and changes',
      'Housing or living situation stress',
      'Caregiving responsibilities'
    ];
    
    const count = this.randomInt(2, 4);
    const stressors = [];
    
    for (let i = 0; i < count; i++) {
      const stressor = this.randomChoice(possibleStressors);
      if (!stressors.includes(stressor)) {
        stressors.push(stressor);
      }
    }
    
    return stressors;
  }

  private generateCopingStrategies(): string[] {
    const strategies = [
      'Deep breathing exercises',
      'Regular physical exercise',
      'Journaling and self-reflection',
      'Mindfulness meditation',
      'Social support and connection',
      'Creative expression (art, music, writing)',
      'Time management and organization',
      'Professional therapy sessions',
      'Healthy sleep hygiene',
      'Limiting social media and news consumption'
    ];
    
    const count = this.randomInt(3, 6);
    const selected = [];
    
    for (let i = 0; i < count; i++) {
      const strategy = this.randomChoice(strategies);
      if (!selected.includes(strategy)) {
        selected.push(strategy);
      }
    }
    
    return selected;
  }

  private generateSupportSystems(): string[] {
    const supports = [
      'Close family members',
      'Trusted friends',
      'Romantic partner or spouse',
      'Professional therapist',
      'Support group members',
      'Religious or spiritual community',
      'Workplace colleagues',
      'Healthcare providers',
      'Online communities',
      'Pets and companion animals'
    ];
    
    const count = this.randomInt(2, 5);
    const selected = [];
    
    for (let i = 0; i < count; i++) {
      const support = this.randomChoice(supports);
      if (!selected.includes(support)) {
        selected.push(support);
      }
    }
    
    return selected;
  }

  private generateCrisisIndicators(): MockClientProfile['crisisIndicators'] {
    // Generate realistic but varied crisis indicators
    return {
      suicidalIdeation: Math.random() < 0.15, // 15% chance
      selfHarmBehaviors: Math.random() < 0.10, // 10% chance
      substanceAbuse: Math.random() < 0.20, // 20% chance
      severeAgitation: Math.random() < 0.12, // 12% chance
      psychoticSymptoms: Math.random() < 0.05  // 5% chance
    };
  }

  private generateTestingScenarios(diagnosis: string): string[] {
    const baseScenarios = [
      'routine_progress_monitoring',
      'crisis_detection_testing',
      'ai_insight_accuracy',
      'therapeutic_relationship_building'
    ];
    
    const diagnosisSpecific = {
      anxiety_disorders: ['panic_attack_simulation', 'exposure_therapy_planning'],
      depressive_disorders: ['suicide_risk_assessment', 'behavioral_activation'],
      trauma_and_ptsd: ['trauma_processing_safety', 'grounding_technique_application']
    };
    
    const specific = diagnosisSpecific[diagnosis as keyof typeof diagnosisSpecific] || [];
    return [...baseScenarios, ...specific];
  }

  private addPersonalContext(client: MockClientProfile): string {
    const contexts = [
      `As a ${client.age}-year-old dealing with ${client.primaryDiagnosis.replace(/_/g, ' ')}, this resonates with my current experience.`,
      `Given my background and current stressors, this feels particularly relevant right now.`,
      `This connects to what we've been working on in therapy regarding my patterns and triggers.`,
      `I'm trying to apply the coping strategies we discussed, but it's challenging in moments like these.`
    ];
    
    return this.randomChoice(contexts);
  }

  private generateAIInsightTriggers(content: string): string[] {
    const triggers = [];
    
    if (content.includes('breakthrough') || content.includes('realization')) {
      triggers.push('therapeutic_breakthrough');
    }
    
    if (content.includes('hopeless') || content.includes('worthless')) {
      triggers.push('depression_indicators');
    }
    
    if (content.includes('overwhelmed') || content.includes('stressed')) {
      triggers.push('anxiety_symptoms');
    }
    
    if (content.includes('relapsed') || content.includes('setback')) {
      triggers.push('relapse_processing');
    }
    
    return triggers;
  }

  private generateExpectedAIResponse(content: string, riskLevel: string): string {
    if (riskLevel === 'imminent' || riskLevel === 'high') {
      return 'URGENT: Crisis intervention required - immediate therapist notification sent';
    }
    
    if (content.includes('breakthrough')) {
      return 'Positive therapeutic progress detected - insight development noted';
    }
    
    if (content.includes('setback')) {
      return 'Processing setback with self-compassion - resilience building opportunity';
    }
    
    return 'Regular therapeutic content - monitoring for patterns and progress';
  }

  private generateExpectedCrisisResponse(riskLevel: string): {
    shouldTriggerAlert: boolean;
    suggestedActions: string[];
    urgencyLevel: number;
  } {
    const responses = {
      low: {
        shouldTriggerAlert: false,
        suggestedActions: ['Monitor for escalation', 'Encourage coping strategies'],
        urgencyLevel: 2
      },
      moderate: {
        shouldTriggerAlert: true,
        suggestedActions: ['Contact within 24 hours', 'Safety planning review'],
        urgencyLevel: 5
      },
      high: {
        shouldTriggerAlert: true,
        suggestedActions: ['Contact within 4 hours', 'Safety assessment', 'Crisis intervention'],
        urgencyLevel: 8
      },
      imminent: {
        shouldTriggerAlert: true,
        suggestedActions: ['IMMEDIATE contact', 'Emergency services consideration', 'Crisis stabilization'],
        urgencyLevel: 10
      }
    };
    
    return responses[riskLevel as keyof typeof responses] || responses.low;
  }

  private generateTreatmentGoals(diagnosis: string): Array<{
    goalId: string;
    objective: string;
    interventions: string[];
    timeline: string;
    measurableOutcomes: string[];
  }> {
    const baseGoals = [
      {
        goalId: this.generateUUID(),
        objective: 'Improve emotional regulation and coping skills',
        interventions: ['CBT techniques', 'Mindfulness practices', 'Coping skills training'],
        timeline: '3 months',
        measurableOutcomes: ['Mood ratings improve by 2 points', 'Use coping skills 3x/week']
      },
      {
        goalId: this.generateUUID(),
        objective: 'Enhance daily functioning and quality of life',
        interventions: ['Behavioral activation', 'Activity scheduling', 'Goal setting'],
        timeline: '4 months',
        measurableOutcomes: ['Complete daily activities 80% of time', 'Engage in enjoyable activities 2x/week']
      }
    ];
    
    return baseGoals;
  }

  private generateIdentifiedRisks(client: MockClientProfile): string[] {
    const risks = [];
    
    if (client.crisisIndicators.suicidalIdeation) {
      risks.push('Suicidal ideation and risk factors');
    }
    
    if (client.crisisIndicators.substanceAbuse) {
      risks.push('Substance use as maladaptive coping');
    }
    
    if (client.currentRiskLevel === 'high' || client.currentRiskLevel === 'imminent') {
      risks.push('Elevated crisis risk requiring close monitoring');
    }
    
    risks.push('Social isolation and withdrawal patterns');
    
    return risks;
  }

  private generateMitigationStrategies(diagnosis: string): string[] {
    const strategies = [
      'Regular safety assessments and planning',
      'Crisis contact information readily available',
      'Structured coping skills practice',
      'Social support network activation',
      'Professional consultation as needed'
    ];
    
    if (diagnosis === 'trauma_and_ptsd') {
      strategies.push('Trauma-informed grounding techniques');
    }
    
    return strategies;
  }
}