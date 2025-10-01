// ALCHM AI Opt-Out Manager
// Comprehensive system for managing AI interaction levels and user consent

export interface AIInteractionLevel {
  level: 'none' | 'minimal' | 'standard' | 'enhanced';
  name: string;
  description: string;
  features: {
    aiAnalysis: boolean;
    aiPrompts: boolean;
    patternRecognition: boolean;
    resourceSuggestions: boolean;
    culturalAdaptation: boolean;
    emotionalInsights: boolean;
  };
  crisisSafety: boolean; // Always true
  dataProcessing: 'none' | 'anonymized' | 'encrypted';
}

export const AI_INTERACTION_LEVELS: Record<string, AIInteractionLevel> = {
  none: {
    level: 'none',
    name: 'Pure Analog',
    description: 'Complete AI-free journaling with human-curated prompts and resources',
    features: {
      aiAnalysis: false,
      aiPrompts: false,
      patternRecognition: false,
      resourceSuggestions: false,
      culturalAdaptation: false,
      emotionalInsights: false
    },
    crisisSafety: true, // Always enabled for safety
    dataProcessing: 'none'
  },
  minimal: {
    level: 'minimal',
    name: 'Safety-First',
    description: 'Only crisis detection and emergency resources, no analysis or insights',
    features: {
      aiAnalysis: false,
      aiPrompts: false,
      patternRecognition: false,
      resourceSuggestions: true, // Only crisis resources
      culturalAdaptation: false,
      emotionalInsights: false
    },
    crisisSafety: true,
    dataProcessing: 'anonymized'
  },
  standard: {
    level: 'standard',
    name: 'Balanced AI Support',
    description: 'AI insights and prompts with full user control and transparency',
    features: {
      aiAnalysis: true,
      aiPrompts: true,
      patternRecognition: true,
      resourceSuggestions: true,
      culturalAdaptation: true,
      emotionalInsights: true
    },
    crisisSafety: true,
    dataProcessing: 'encrypted'
  },
  enhanced: {
    level: 'enhanced',
    name: 'Full AI Partnership',
    description: 'Advanced pattern recognition, personalized insights, and proactive support',
    features: {
      aiAnalysis: true,
      aiPrompts: true,
      patternRecognition: true,
      resourceSuggestions: true,
      culturalAdaptation: true,
      emotionalInsights: true
    },
    crisisSafety: true,
    dataProcessing: 'encrypted'
  }
};

export interface UserAIPreferences {
  interactionLevel: 'none' | 'minimal' | 'standard' | 'enhanced';
  consentTimestamp: string;
  lastReviewDate: string;
  explicitOptOut: boolean;
  specificOptOuts: {
    emotionalAnalysis: boolean;
    patternRecognition: boolean;
    personalizedPrompts: boolean;
    culturalAdaptation: boolean;
    dataCollection: boolean;
  };
  analogPreferences: {
    preferredPromptTypes: string[];
    difficultyLevel: 'gentle' | 'moderate' | 'deep';
    culturalFramework: string;
    sessionLength: 'short' | 'medium' | 'long';
  };
  reviewFrequency: 'monthly' | 'quarterly' | 'annually' | 'never';
  parentalControls?: {
    enabled: boolean;
    parentEmail: string;
    reviewRequired: boolean;
  };
}

export class AIOptOutManager {
  private static instance: AIOptOutManager;
  
  public static getInstance(): AIOptOutManager {
    if (!AIOptOutManager.instance) {
      AIOptOutManager.instance = new AIOptOutManager();
    }
    return AIOptOutManager.instance;
  }

  // Progressive AI introduction flow
  async initiateConsentFlow(userId: string, userAge?: number): Promise<{
    flowType: 'adult' | 'minor' | 'unknown';
    requiresParentalConsent: boolean;
    recommendedLevel: 'none' | 'minimal' | 'standard' | 'enhanced';
    educationalContent: ConsentEducationContent;
  }> {
    const requiresParentalConsent = userAge !== undefined && userAge < 13;
    const flowType = userAge === undefined ? 'unknown' : (userAge < 18 ? 'minor' : 'adult');
    
    // Conservative default for minors, informed choice for adults
    const recommendedLevel = requiresParentalConsent ? 'none' : 
                            userAge && userAge < 16 ? 'minimal' : 
                            'standard';

    const educationalContent = this.generateEducationalContent(flowType, requiresParentalConsent);

    return {
      flowType,
      requiresParentalConsent,
      recommendedLevel,
      educationalContent
    };
  }

  // Create comprehensive consent record
  async recordConsentDecision(userId: string, decision: ConsentDecision): Promise<ConsentRecord> {
    const consentRecord: ConsentRecord = {
      userId,
      timestamp: new Date().toISOString(),
      interactionLevel: decision.selectedLevel,
      explicitChoices: decision.explicitChoices,
      educationalContentViewed: decision.educationalContentViewed,
      timeSpentReviewing: decision.timeSpentReviewing,
      parentalApproval: decision.parentalApproval,
      ipAddress: decision.ipAddress,
      userAgent: decision.userAgent,
      complianceFrameworks: ['FERPA', 'COPPA', 'GDPR', 'IEEE-2857'],
      withdrawalInstructions: this.generateWithdrawalInstructions(),
      nextReviewDate: this.calculateNextReviewDate(decision.selectedLevel)
    };

    // Store consent record
    await this.storeConsentRecord(consentRecord);
    
    // Update user preferences
    await this.updateUserPreferences(userId, {
      interactionLevel: decision.selectedLevel,
      consentTimestamp: consentRecord.timestamp,
      lastReviewDate: consentRecord.timestamp,
      explicitOptOut: decision.selectedLevel === 'none',
      specificOptOuts: decision.explicitChoices,
      analogPreferences: decision.analogPreferences || this.getDefaultAnalogPreferences(),
      reviewFrequency: decision.reviewFrequency || 'quarterly'
    });

    return consentRecord;
  }

  // Generate analog journaling experience
  async generateAnalogExperience(userId: string, preferences: UserAIPreferences): Promise<AnalogJournalingExperience> {
    const { analogPreferences } = preferences;
    
    return {
      welcomeMessage: this.getPersonalizedWelcome(analogPreferences),
      todaysPrompts: await this.selectCuratedPrompts(analogPreferences),
      culturalElements: await this.getCulturalElements(analogPreferences.culturalFramework),
      groundingPractices: this.getRecommendedGroundingPractices(),
      reflectionGuides: this.getReflectionGuides(analogPreferences.difficultyLevel),
      safetyResources: this.getCrisisSafetyResources(), // Always included
      progressTracking: {
        entriesWritten: 0,
        timeSpentReflecting: 0,
        promptsExplored: [],
        personalGrowthIndicators: []
      },
      exportOptions: this.getAnalogExportOptions()
    };
  }

  // User-friendly AI explanation
  generateAITransparencyReport(): AITransparencyReport {
    return {
      whatAIDoes: [
        'Analyzes writing patterns to offer gentle emotional insights',
        'Suggests culturally-appropriate coping strategies and resources',
        'Detects crisis language to provide immediate safety support',
        'Generates personalized reflection questions based on your entries',
        'Recognizes emotional growth and positive changes over time'
      ],
      whatAIDoesNOT: [
        'Diagnose mental health conditions or medical problems',
        'Provide medical, psychiatric, or therapeutic advice',
        'Replace professional counseling or therapy',
        'Remember previous conversations (each session is isolated)',
        'Share your personal information with anyone',
        'Judge or evaluate your thoughts or feelings'
      ],
      howYourDataIsUsed: {
        processing: 'Your journal entries are processed only to provide insights',
        storage: 'All data is encrypted end-to-end on secure servers',
        retention: 'You control how long your data is kept',
        deletion: 'You can delete your data completely at any time',
        sharing: 'Your personal data is never shared with third parties',
        anonymization: 'Analytics are completely anonymized and aggregated'
      },
      yourRights: [
        'Right to opt out of AI processing at any time',
        'Right to access all data collected about you',
        'Right to delete your data completely',
        'Right to export your journal entries',
        'Right to modify your consent preferences',
        'Right to parental control (if under 18)'
      ],
      safetyMeasures: [
        'Crisis detection remains active even if you opt out of other AI features',
        'All AI responses are trauma-informed and culturally sensitive',
        'AI cannot and will not provide medical or psychiatric advice',
        'Professional crisis resources are always provided when needed',
        'Your safety and wellbeing are our highest priority'
      ]
    };
  }

  // Granular control options
  getGranularControls(): GranularAIControl[] {
    return [
      {
        feature: 'Emotional Analysis',
        description: 'AI analyzes your writing to identify emotions and mood patterns',
        benefits: ['Track emotional trends', 'Recognize triggers', 'Celebrate growth'],
        risks: ['Data processing', 'Potential misinterpretation'],
        canOptOut: true,
        defaultEnabled: true
      },
      {
        feature: 'Pattern Recognition',
        description: 'AI identifies recurring themes and behavioral patterns',
        benefits: ['Understand habits', 'Recognize progress', 'Identify areas for growth'],
        risks: ['Privacy concerns', 'Algorithmic bias'],
        canOptOut: true,
        defaultEnabled: true
      },
      {
        feature: 'Personalized Prompts',
        description: 'AI generates reflection questions based on your previous entries',
        benefits: ['Relevant questions', 'Deeper exploration', 'Continued growth'],
        risks: ['Filter bubble', 'Reduced spontaneity'],
        canOptOut: true,
        defaultEnabled: true
      },
      {
        feature: 'Cultural Adaptation',
        description: 'AI adapts responses to honor your cultural background',
        benefits: ['Culturally relevant support', 'Inclusive language', 'Traditional wisdom'],
        risks: ['Stereotyping', 'Cultural assumptions'],
        canOptOut: true,
        defaultEnabled: true
      },
      {
        feature: 'Crisis Detection',
        description: 'AI monitors for signs of crisis and provides immediate safety resources',
        benefits: ['Immediate support', 'Safety protection', 'Emergency resources'],
        risks: ['False positives', 'Privacy invasion'],
        canOptOut: false, // Never can be disabled
        defaultEnabled: true
      },
      {
        feature: 'Resource Suggestions',
        description: 'AI recommends coping strategies and support resources',
        benefits: ['Helpful tools', 'Professional resources', 'Skill building'],
        risks: ['Over-reliance', 'Generic suggestions'],
        canOptOut: true,
        defaultEnabled: true
      }
    ];
  }

  // Easy withdrawal process
  async initiateOptOut(userId: string, reason?: string): Promise<OptOutProcess> {
    const process: OptOutProcess = {
      processId: `optout_${Date.now()}`,
      userId,
      initiatedAt: new Date().toISOString(),
      reason: reason || 'user_request',
      steps: [
        {
          step: 1,
          title: 'Confirm Opt-Out Decision',
          description: 'Are you sure you want to disable AI features?',
          options: ['Yes, disable all AI', 'Switch to minimal AI', 'Customize settings', 'Cancel'],
          completed: false
        },
        {
          step: 2,
          title: 'Choose Alternative',
          description: 'Select your preferred journaling experience',
          options: ['Pure analog mode', 'Crisis safety only', 'Custom configuration'],
          completed: false
        },
        {
          step: 3,
          title: 'Data Handling',
          description: 'What should happen to your existing AI-generated insights?',
          options: ['Delete all AI data', 'Keep but stop processing', 'Export before deletion'],
          completed: false
        },
        {
          step: 4,
          title: 'Confirmation',
          description: 'Review your choices and confirm',
          options: ['Confirm opt-out', 'Modify choices', 'Cancel process'],
          completed: false
        }
      ],
      alternativeOffered: this.generateAnalogAlternative(),
      dataHandlingOptions: this.getDataHandlingOptions(),
      withdrawalRights: this.getWithdrawalRights(),
      reactivationInstructions: 'You can re-enable AI features at any time in your settings'
    };

    return process;
  }

  // Helper methods
  private generateEducationalContent(flowType: string, requiresParentalConsent: boolean): ConsentEducationContent {
    return {
      title: requiresParentalConsent ? 'AI Assistance for Young Journalers' : 'Understanding AI in Your Journaling',
      sections: [
        {
          title: 'What is AI-Assisted Journaling?',
          content: 'AI can help you explore your thoughts and feelings by offering gentle insights and supportive prompts.',
          kidfriendly: requiresParentalConsent
        },
        {
          title: 'Your Safety Comes First',
          content: 'AI will never replace human support. It\'s designed to enhance your self-reflection, not make decisions for you.',
          kidfriendly: requiresParentalConsent
        },
        {
          title: 'Complete Privacy Protection',
          content: 'Your thoughts are private and secure. AI processes your writing to help you, but never shares it with anyone.',
          kidfriendly: requiresParentalConsent
        },
        {
          title: 'You\'re Always in Control',
          content: 'You can change your mind about AI assistance at any time. Your choice, your journal, your rules.',
          kidfriendly: requiresParentalConsent
        }
      ],
      parentalGuidance: requiresParentalConsent ? {
        title: 'Information for Parents/Guardians',
        content: 'ALCHM provides AI-assisted journaling designed specifically for young people with comprehensive safety protections and parental oversight.',
        parentalControls: [
          'Review and approve AI interaction levels',
          'Monitor AI feature usage (without reading journal content)',
          'Receive safety alerts if crisis language is detected',
          'Control data retention and deletion policies',
          'Access educational resources about digital wellness'
        ]
      } : undefined
    };
  }

  private getDefaultAnalogPreferences(): UserAIPreferences['analogPreferences'] {
    return {
      preferredPromptTypes: ['daily_check_in', 'emotional_awareness', 'strength_recognition'],
      difficultyLevel: 'gentle',
      culturalFramework: 'universal',
      sessionLength: 'medium'
    };
  }

  private generateAnalogAlternative(): AnalogAlternative {
    return {
      title: 'Rich Analog Journaling Experience',
      features: [
        '150+ trauma-informed reflection prompts',
        'Cultural wisdom from diverse traditions',
        'Grounding techniques and breathing exercises',
        'Progress tracking without AI analysis',
        'Export capabilities for your entries',
        'Crisis safety resources (always available)'
      ],
      benefits: [
        'Complete privacy - no AI processing',
        'Direct connection to your inner wisdom',
        'Traditional healing practices integration',
        'Human-curated reflection guidance',
        'Freedom from algorithmic influence'
      ],
      promptPreview: [
        'How did your body speak to you today?',
        'What small acts of courage did you show?',
        'What wisdom from your culture guides you?'
      ]
    };
  }

  private getDataHandlingOptions(): DataHandlingOption[] {
    return [
      {
        option: 'Complete Deletion',
        description: 'Delete all AI-generated insights and analysis data',
        timeline: 'Immediate',
        reversible: false,
        impact: 'You will lose all AI-generated insights but keep your original journal entries'
      },
      {
        option: 'Freeze Processing',
        description: 'Keep existing insights but stop all new AI processing',
        timeline: 'Immediate',
        reversible: true,
        impact: 'Previous insights remain accessible but no new AI analysis occurs'
      },
      {
        option: 'Export Then Delete',
        description: 'Download your AI insights before deletion',
        timeline: '24-48 hours',
        reversible: false,
        impact: 'You receive a complete export of insights before they are permanently deleted'
      }
    ];
  }

  private getWithdrawalRights(): string[] {
    return [
      'Right to immediate cessation of AI processing',
      'Right to delete all AI-generated data',
      'Right to export AI insights before deletion',
      'Right to maintain access to crisis safety features',
      'Right to re-enable AI features at any time',
      'Right to granular control over specific AI functions',
      'Right to parental oversight (if under 18)',
      'Right to data portability and account deletion'
    ];
  }

  // Additional helper methods would be implemented here...
  private async storeConsentRecord(record: ConsentRecord): Promise<void> {
    // Implementation for storing consent record
  }

  private async updateUserPreferences(userId: string, preferences: UserAIPreferences): Promise<void> {
    // Implementation for updating user preferences
  }

  private async selectCuratedPrompts(preferences: any): Promise<any[]> {
    // Implementation for selecting curated prompts
    return [];
  }

  private async getCulturalElements(framework: string): Promise<any> {
    // Implementation for getting cultural elements
    return {};
  }

  private getRecommendedGroundingPractices(): any[] {
    // Implementation for grounding practices
    return [];
  }

  private getReflectionGuides(level: string): any[] {
    // Implementation for reflection guides
    return [];
  }

  private getCrisisSafetyResources(): any[] {
    // Implementation for crisis safety resources
    return [];
  }

  private getAnalogExportOptions(): any[] {
    // Implementation for export options
    return [];
  }

  private getPersonalizedWelcome(preferences: any): string {
    return 'Welcome to your analog journaling space.';
  }

  private calculateNextReviewDate(level: string): string {
    const now = new Date();
    now.setMonth(now.getMonth() + 3); // Quarterly review
    return now.toISOString();
  }

  private generateWithdrawalInstructions(): string[] {
    return [
      'Visit Settings > AI Preferences',
      'Click "Opt Out of AI Features"',
      'Follow the guided process',
      'Or contact support for assistance'
    ];
  }
}

// Supporting interfaces
interface ConsentDecision {
  selectedLevel: 'none' | 'minimal' | 'standard' | 'enhanced';
  explicitChoices: Record<string, boolean>;
  educationalContentViewed: string[];
  timeSpentReviewing: number;
  parentalApproval?: ParentalApproval;
  ipAddress: string;
  userAgent: string;
  analogPreferences?: UserAIPreferences['analogPreferences'];
  reviewFrequency?: 'monthly' | 'quarterly' | 'annually' | 'never';
}

interface ConsentRecord {
  userId: string;
  timestamp: string;
  interactionLevel: string;
  explicitChoices: Record<string, boolean>;
  educationalContentViewed: string[];
  timeSpentReviewing: number;
  parentalApproval?: ParentalApproval;
  ipAddress: string;
  userAgent: string;
  complianceFrameworks: string[];
  withdrawalInstructions: string[];
  nextReviewDate: string;
}

interface ParentalApproval {
  parentEmail: string;
  approvalTimestamp: string;
  verificationMethod: 'email' | 'phone' | 'typeof window !== 'undefined' && document';
  approvalToken: string;
}

interface ConsentEducationContent {
  title: string;
  sections: Array<{
    title: string;
    content: string;
    kidfriendly: boolean;
  }>;
  parentalGuidance?: {
    title: string;
    content: string;
    parentalControls: string[];
  };
}

interface AnalogJournalingExperience {
  welcomeMessage: string;
  todaysPrompts: any[];
  culturalElements: any;
  groundingPractices: any[];
  reflectionGuides: any[];
  safetyResources: any[];
  progressTracking: {
    entriesWritten: number;
    timeSpentReflecting: number;
    promptsExplored: string[];
    personalGrowthIndicators: string[];
  };
  exportOptions: any[];
}

interface AITransparencyReport {
  whatAIDoes: string[];
  whatAIDoesNOT: string[];
  howYourDataIsUsed: {
    processing: string;
    storage: string;
    retention: string;
    deletion: string;
    sharing: string;
    anonymization: string;
  };
  yourRights: string[];
  safetyMeasures: string[];
}

interface GranularAIControl {
  feature: string;
  description: string;
  benefits: string[];
  risks: string[];
  canOptOut: boolean;
  defaultEnabled: boolean;
}

interface OptOutProcess {
  processId: string;
  userId: string;
  initiatedAt: string;
  reason: string;
  steps: Array<{
    step: number;
    title: string;
    description: string;
    options: string[];
    completed: boolean;
  }>;
  alternativeOffered: AnalogAlternative;
  dataHandlingOptions: DataHandlingOption[];
  withdrawalRights: string[];
  reactivationInstructions: string;
}

interface AnalogAlternative {
  title: string;
  features: string[];
  benefits: string[];
  promptPreview: string[];
}

interface DataHandlingOption {
  option: string;
  description: string;
  timeline: string;
  reversible: boolean;
  impact: string;
}

export default AIOptOutManager;