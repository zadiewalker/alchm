/**
 * ALCHM Consent Flow Builder
 * Comprehensive consent management system for GDPR/CCPA/COPPA compliance
 * Supports granular consent, parental consent, and withdrawal mechanisms
 */

export interface ConsentFlowConfig {
  id: string;
  name: string;
  description: string;
  targetAudience: 'adult' | 'teen' | 'minor' | 'parent' | 'educator';
  jurisdiction: 'US' | 'EU' | 'CA' | 'Global';
  regulations: Array<'GDPR' | 'CCPA' | 'COPPA' | 'FERPA'>;
  language: string;
  flowType: 'onboarding' | 'feature_specific' | 'policy_update' | 'withdrawal';
  priority: 'critical' | 'high' | 'medium' | 'low';
  trigger: 'immediate' | 'interaction' | 'time_based' | 'feature_access';
}

export interface ConsentItem {
  id: string;
  purpose: string;
  description: string;
  detailedExplanation: string;
  legalBasis: 'consent' | 'contract' | 'legitimate_interest' | 'legal_obligation' | 'vital_interest';
  dataTypes: string[];
  processingActivities: string[];
  thirdParties: string[];
  retentionPeriod: string;
  consequences: {
    ifAccepted: string;
    ifDeclined: string;
  };
  isRequired: boolean;
  isAgeRestricted: boolean;
  requiresParentalConsent: boolean;
  withdrawalPossible: boolean;
  category: 'essential' | 'functional' | 'analytics' | 'marketing' | 'research';
}

export interface ConsentFlowStep {
  id: string;
  type: 'introduction' | 'consent_item' | 'age_verification' | 'parental_consent' | 'summary' | 'confirmation';
  title: string;
  content: string;
  consentItems?: string[]; // IDs of consent items for this step
  isRequired: boolean;
  nextStep?: string;
  previousStep?: string;
  skipConditions?: Array<{
    condition: string;
    skipTo: string;
  }>;
}

export interface ParentalConsentFlow {
  emailVerification: boolean;
  identityVerification: boolean;
  consentMethods: Array<'email' | 'phone' | 'video_call' | 'printed_form'>;
  verificationTimeout: number; // hours
  followUpReminders: boolean;
  childDataAccess: boolean;
}

export interface ConsentRecord {
  userId: string;
  flowId: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  consentChoices: Record<string, {
    granted: boolean;
    timestamp: string;
    method: string;
    version: string;
  }>;
  parentalConsent?: {
    parentEmail: string;
    verificationMethod: string;
    verifiedAt: string;
    parentName: string;
    relationship: string;
  };
  withdrawalHistory: Array<{
    itemId: string;
    withdrawnAt: string;
    reason?: string;
    method: string;
  }>;
  version: string;
  jurisdiction: string;
}

export class ConsentFlowBuilder {
  private flows: Map<string, ConsentFlowConfig> = new Map();
  private consentItems: Map<string, ConsentItem> = new Map();
  private flowSteps: Map<string, ConsentFlowStep[]> = new Map();
  private consentRecords: Map<string, ConsentRecord> = new Map();

  constructor() {
    this.initializeDefaultFlows();
    this.loadExistingConsent();
  }

  /**
   * Initialize default consent flows for different scenarios
   */
  private initializeDefaultFlows(): void {
    // Main onboarding flow for adults
    this.createOnboardingFlow();
    
    // COPPA compliance flow for minors
    this.createMinorOnboardingFlow();
    
    // Feature-specific consent flows
    this.createFeatureConsentFlows();
    
    // Policy update consent flow
    this.createPolicyUpdateFlow();
    
    // Consent withdrawal flow
    this.createWithdrawalFlow();
  }

  /**
   * Create main onboarding consent flow for adult users
   */
  private createOnboardingFlow(): void {
    const flowConfig: ConsentFlowConfig = {
      id: 'adult_onboarding',
      name: 'Adult User Onboarding Consent',
      description: 'Primary consent flow for adult users (18+)',
      targetAudience: 'adult',
      jurisdiction: 'Global',
      regulations: ['GDPR', 'CCPA'],
      language: 'en',
      flowType: 'onboarding',
      priority: 'critical',
      trigger: 'immediate'
    };

    const consentItems: ConsentItem[] = [
      {
        id: 'essential_services',
        purpose: 'Essential app functionality and account management',
        description: 'Basic features needed to provide our journaling service',
        detailedExplanation: 'This includes account creation, authentication, data storage, and core app functionality. Without this consent, we cannot provide our service.',
        legalBasis: 'contract',
        dataTypes: ['email', 'authentication_tokens', 'account_preferences', 'encrypted_journal_content'],
        processingActivities: ['account_management', 'data_storage', 'authentication', 'service_delivery'],
        thirdParties: ['Firebase (Google Cloud)'],
        retentionPeriod: 'Until account deletion',
        consequences: {
          ifAccepted: 'You can use all core features of ALCHM',
          ifDeclined: 'You cannot create an account or use ALCHM services'
        },
        isRequired: true,
        isAgeRestricted: false,
        requiresParentalConsent: false,
        withdrawalPossible: false,
        category: 'essential'
      },
      {
        id: 'ai_processing',
        purpose: 'AI-powered insights and emotional support',
        description: 'Khepera AI analyzes your journal patterns to provide personalized insights',
        detailedExplanation: 'Our AI system processes your encrypted journal content to identify emotional patterns, provide supportive responses, and suggest helpful resources. All processing is privacy-preserving with immediate data deletion after generating insights.',
        legalBasis: 'consent',
        dataTypes: ['journal_content_patterns', 'emotional_indicators', 'ai_interaction_history'],
        processingActivities: ['pattern_analysis', 'insight_generation', 'ai_response_creation'],
        thirdParties: ['Khepera AI System'],
        retentionPeriod: 'Immediate deletion after processing (insights kept)',
        consequences: {
          ifAccepted: 'You receive personalized AI insights and emotional support',
          ifDeclined: 'You can still journal but won\'t receive AI-powered insights'
        },
        isRequired: false,
        isAgeRestricted: false,
        requiresParentalConsent: false,
        withdrawalPossible: true,
        category: 'functional'
      },
      {
        id: 'crisis_detection',
        purpose: 'Mental health crisis detection and safety monitoring',
        description: 'AI monitors for signs of crisis to provide immediate safety resources',
        detailedExplanation: 'Our system analyzes writing patterns to detect potential mental health crises and immediately provides appropriate resources. This feature could be life-saving but involves processing sensitive emotional data.',
        legalBasis: 'vital_interest',
        dataTypes: ['crisis_indicators', 'emotional_state_patterns', 'safety_triggers'],
        processingActivities: ['crisis_pattern_detection', 'safety_resource_provision', 'emergency_contact_notification'],
        thirdParties: ['Crisis intervention services'],
        retentionPeriod: '72 hours maximum (safety logs only)',
        consequences: {
          ifAccepted: 'Enhanced safety monitoring with immediate crisis support',
          ifDeclined: 'No automated crisis detection (manual crisis resources still available)'
        },
        isRequired: false,
        isAgeRestricted: true,
        requiresParentalConsent: false,
        withdrawalPossible: true,
        category: 'functional'
      },
      {
        id: 'analytics_improvement',
        purpose: 'App usage analytics for service improvement',
        description: 'Anonymous usage data helps us improve the app experience',
        detailedExplanation: 'We collect anonymized data about how you use the app (which features, when, for how long) to identify improvement opportunities. This data cannot be linked back to you personally.',
        legalBasis: 'legitimate_interest',
        dataTypes: ['usage_patterns', 'feature_interactions', 'performance_metrics', 'error_reports'],
        processingActivities: ['usage_analysis', 'feature_optimization', 'bug_identification'],
        thirdParties: ['Firebase Analytics (Google)'],
        retentionPeriod: '24 months',
        consequences: {
          ifAccepted: 'Help us improve ALCHM for all users',
          ifDeclined: 'No impact on your experience; we just can\'t use your usage patterns for improvements'
        },
        isRequired: false,
        isAgeRestricted: false,
        requiresParentalConsent: false,
        withdrawalPossible: true,
        category: 'analytics'
      },
      {
        id: 'research_participation',
        purpose: 'Anonymous mental health research participation',
        description: 'Contribute to mental health research with anonymized data',
        detailedExplanation: 'Your anonymized journaling patterns and outcomes could help researchers understand digital mental health interventions. All data is completely anonymized and cannot be traced back to you.',
        legalBasis: 'consent',
        dataTypes: ['anonymized_emotional_patterns', 'anonymized_outcomes', 'demographic_categories'],
        processingActivities: ['data_anonymization', 'research_analysis', 'academic_publication'],
        thirdParties: ['Academic research institutions'],
        retentionPeriod: '5 years (fully anonymized)',
        consequences: {
          ifAccepted: 'Contribute to advancing mental health understanding and treatment',
          ifDeclined: 'No impact on your ALCHM experience'
        },
        isRequired: false,
        isAgeRestricted: true,
        requiresParentalConsent: false,
        withdrawalPossible: true,
        category: 'research'
      }
    ];

    const flowSteps: ConsentFlowStep[] = [
      {
        id: 'introduction',
        type: 'introduction',
        title: 'Welcome to Your Digital Sanctuary',
        content: 'ALCHM is built with privacy-first principles. Before we begin, let\'s discuss how we protect and use your information. This process takes about 3 minutes and ensures you have complete control over your data.',
        isRequired: true,
        nextStep: 'essential_consent'
      },
      {
        id: 'essential_consent',
        type: 'consent_item',
        title: 'Essential Services',
        content: 'First, let\'s cover the basic functionality needed to provide our journaling service.',
        consentItems: ['essential_services'],
        isRequired: true,
        nextStep: 'ai_features',
        previousStep: 'introduction'
      },
      {
        id: 'ai_features',
        type: 'consent_item',
        title: 'AI-Powered Features',
        content: 'ALCHM offers optional AI features that can enhance your journaling experience. You can enable or disable these at any time.',
        consentItems: ['ai_processing', 'crisis_detection'],
        isRequired: false,
        nextStep: 'data_sharing',
        previousStep: 'essential_consent'
      },
      {
        id: 'data_sharing',
        type: 'consent_item',
        title: 'Service Improvement & Research',
        content: 'Help us improve ALCHM and contribute to mental health research through optional anonymous data sharing.',
        consentItems: ['analytics_improvement', 'research_participation'],
        isRequired: false,
        nextStep: 'summary',
        previousStep: 'ai_features'
      },
      {
        id: 'summary',
        type: 'summary',
        title: 'Your Privacy Choices Summary',
        content: 'Please review your consent choices. You can change these preferences anytime in your account settings.',
        isRequired: true,
        nextStep: 'confirmation',
        previousStep: 'data_sharing'
      },
      {
        id: 'confirmation',
        type: 'confirmation',
        title: 'Consent Confirmed',
        content: 'Thank you for taking control of your privacy. Your choices have been saved and you can modify them anytime. Welcome to ALCHM!',
        isRequired: true,
        previousStep: 'summary'
      }
    ];

    this.flows.set(flowConfig.id, flowConfig);
    consentItems.forEach(item => this.consentItems.set(item.id, item));
    this.flowSteps.set(flowConfig.id, flowSteps);
  }

  /**
   * Create COPPA-compliant consent flow for minor users
   */
  private createMinorOnboardingFlow(): void {
    const flowConfig: ConsentFlowConfig = {
      id: 'minor_onboarding',
      name: 'Minor User COPPA Consent',
      description: 'COPPA-compliant consent flow for users under 13',
      targetAudience: 'minor',
      jurisdiction: 'US',
      regulations: ['COPPA', 'GDPR'],
      language: 'en',
      flowType: 'onboarding',
      priority: 'critical',
      trigger: 'immediate'
    };

    const flowSteps: ConsentFlowStep[] = [
      {
        id: 'age_verification',
        type: 'age_verification',
        title: 'Age Verification Required',
        content: 'To protect children\'s privacy, we need to verify your age before proceeding. If you are under 13, special protections apply.',
        isRequired: true,
        nextStep: 'parental_consent_required',
        skipConditions: [
          { condition: 'age >= 13', skipTo: 'teen_flow' }
        ]
      },
      {
        id: 'parental_consent_required',
        type: 'parental_consent',
        title: 'Parental Consent Required',
        content: 'Federal law requires that we get permission from your parent or guardian before you can use ALCHM. This protects your privacy and safety.',
        isRequired: true,
        nextStep: 'parent_verification',
        previousStep: 'age_verification'
      },
      {
        id: 'parent_verification',
        type: 'consent_item',
        title: 'Parent/Guardian Verification',
        content: 'We need to verify your parent or guardian\'s identity and get their permission for you to use ALCHM with enhanced privacy protections.',
        isRequired: true,
        nextStep: 'child_safe_features',
        previousStep: 'parental_consent_required'
      },
      {
        id: 'child_safe_features',
        type: 'consent_item',
        title: 'Child-Safe Features',
        content: 'With parental permission, you\'ll have access to age-appropriate features with extra privacy protection.',
        consentItems: ['essential_services', 'child_crisis_detection'],
        isRequired: true,
        nextStep: 'parent_dashboard',
        previousStep: 'parent_verification'
      },
      {
        id: 'parent_dashboard',
        type: 'consent_item',
        title: 'Parent Dashboard Access',
        content: 'Your parent/guardian will have access to a dashboard where they can monitor your account and privacy settings.',
        isRequired: true,
        nextStep: 'confirmation',
        previousStep: 'child_safe_features'
      },
      {
        id: 'confirmation',
        type: 'confirmation',
        title: 'Welcome to ALCHM Kids',
        content: 'You\'re all set! Your parent/guardian has been notified and you can start journaling safely.',
        isRequired: true,
        previousStep: 'parent_dashboard'
      }
    ];

    // Create child-specific consent items
    const childConsentItems: ConsentItem[] = [
      {
        id: 'child_crisis_detection',
        purpose: 'Enhanced safety monitoring for children',
        description: 'Special crisis detection designed for young users',
        detailedExplanation: 'This system is specifically designed to detect when children might need help and immediately provides age-appropriate resources while notifying parents/guardians when appropriate.',
        legalBasis: 'vital_interest',
        dataTypes: ['emotional_indicators', 'safety_signals'],
        processingActivities: ['child_safe_crisis_detection', 'parent_notification', 'resource_provision'],
        thirdParties: ['Child crisis services'],
        retentionPeriod: '72 hours maximum',
        consequences: {
          ifAccepted: 'Enhanced safety protection designed for children',
          ifDeclined: 'Basic safety resources still available'
        },
        isRequired: false,
        isAgeRestricted: true,
        requiresParentalConsent: true,
        withdrawalPossible: true,
        category: 'functional'
      }
    ];

    this.flows.set(flowConfig.id, flowConfig);
    childConsentItems.forEach(item => this.consentItems.set(item.id, item));
    this.flowSteps.set(flowConfig.id, flowSteps);
  }

  /**
   * Create feature-specific consent flows
   */
  private createFeatureConsentFlows(): void {
    // Crisis detection feature consent
    const crisisFlowConfig: ConsentFlowConfig = {
      id: 'crisis_detection_consent',
      name: 'Crisis Detection Feature Consent',
      description: 'Consent for enabling crisis detection features',
      targetAudience: 'adult',
      jurisdiction: 'Global',
      regulations: ['GDPR', 'CCPA'],
      language: 'en',
      flowType: 'feature_specific',
      priority: 'high',
      trigger: 'feature_access'
    };

    const crisisFlowSteps: ConsentFlowStep[] = [
      {
        id: 'crisis_explanation',
        type: 'introduction',
        title: 'Crisis Detection & Safety Features',
        content: 'ALCHM can monitor your writing for signs of mental health crisis and provide immediate support resources. This feature processes sensitive emotional data to potentially save lives.',
        isRequired: true,
        nextStep: 'crisis_consent'
      },
      {
        id: 'crisis_consent',
        type: 'consent_item',
        title: 'Enable Crisis Detection',
        content: 'Would you like to enable AI-powered crisis detection? You can disable this anytime in settings.',
        consentItems: ['crisis_detection'],
        isRequired: false,
        nextStep: 'crisis_confirmation',
        previousStep: 'crisis_explanation'
      },
      {
        id: 'crisis_confirmation',
        type: 'confirmation',
        title: 'Crisis Detection Settings Updated',
        content: 'Your crisis detection preferences have been saved. Remember, if you\'re in immediate danger, contact emergency services directly.',
        isRequired: true,
        previousStep: 'crisis_consent'
      }
    ];

    this.flows.set(crisisFlowConfig.id, crisisFlowConfig);
    this.flowSteps.set(crisisFlowConfig.id, crisisFlowSteps);
  }

  /**
   * Create policy update consent flow
   */
  private createPolicyUpdateFlow(): void {
    const updateFlowConfig: ConsentFlowConfig = {
      id: 'policy_update_2024',
      name: 'Privacy Policy Update Consent',
      description: 'Consent for updated privacy policy terms',
      targetAudience: 'adult',
      jurisdiction: 'Global',
      regulations: ['GDPR', 'CCPA'],
      language: 'en',
      flowType: 'policy_update',
      priority: 'high',
      trigger: 'immediate'
    };

    const updateFlowSteps: ConsentFlowStep[] = [
      {
        id: 'update_notice',
        type: 'introduction',
        title: 'Privacy Policy Update',
        content: 'We\'ve updated our privacy policy to provide better protections and clearer explanations. Please review the changes and provide your consent to continue using ALCHM.',
        isRequired: true,
        nextStep: 'changes_summary'
      },
      {
        id: 'changes_summary',
        type: 'consent_item',
        title: 'What\'s Changed',
        content: 'Summary of key changes: Enhanced crisis detection, improved data export, additional user rights under new privacy laws.',
        isRequired: true,
        nextStep: 'updated_consent',
        previousStep: 'update_notice'
      },
      {
        id: 'updated_consent',
        type: 'consent_item',
        title: 'Updated Consent',
        content: 'Please confirm your consent for the updated privacy practices. You can review your consent choices or delete your account if you prefer.',
        consentItems: ['essential_services', 'ai_processing'],
        isRequired: true,
        nextStep: 'update_confirmation',
        previousStep: 'changes_summary'
      },
      {
        id: 'update_confirmation',
        type: 'confirmation',
        title: 'Consent Updated',
        content: 'Thank you for reviewing our privacy policy updates. Your consent choices have been recorded.',
        isRequired: true,
        previousStep: 'updated_consent'
      }
    ];

    this.flows.set(updateFlowConfig.id, updateFlowConfig);
    this.flowSteps.set(updateFlowConfig.id, updateFlowSteps);
  }

  /**
   * Create consent withdrawal flow
   */
  private createWithdrawalFlow(): void {
    const withdrawalFlowConfig: ConsentFlowConfig = {
      id: 'consent_withdrawal',
      name: 'Consent Withdrawal Flow',
      description: 'Process for withdrawing consent for data processing',
      targetAudience: 'adult',
      jurisdiction: 'Global',
      regulations: ['GDPR', 'CCPA'],
      language: 'en',
      flowType: 'withdrawal',
      priority: 'high',
      trigger: 'interaction'
    };

    const withdrawalFlowSteps: ConsentFlowStep[] = [
      {
        id: 'withdrawal_intro',
        type: 'introduction',
        title: 'Withdraw Consent',
        content: 'You have the right to withdraw your consent for data processing at any time. Let\'s review what this means for your ALCHM experience.',
        isRequired: true,
        nextStep: 'select_withdrawal'
      },
      {
        id: 'select_withdrawal',
        type: 'consent_item',
        title: 'Select What to Withdraw',
        content: 'Choose which consent you\'d like to withdraw. Note that withdrawing essential service consent will require account deletion.',
        isRequired: true,
        nextStep: 'withdrawal_consequences',
        previousStep: 'withdrawal_intro'
      },
      {
        id: 'withdrawal_consequences',
        type: 'introduction',
        title: 'Impact of Withdrawal',
        content: 'Here\'s what will happen when you withdraw the selected consent: [Dynamic content based on selections]',
        isRequired: true,
        nextStep: 'confirm_withdrawal',
        previousStep: 'select_withdrawal'
      },
      {
        id: 'confirm_withdrawal',
        type: 'confirmation',
        title: 'Confirm Withdrawal',
        content: 'Are you sure you want to withdraw the selected consent? This action will take effect immediately.',
        isRequired: true,
        nextStep: 'withdrawal_complete',
        previousStep: 'withdrawal_consequences'
      },
      {
        id: 'withdrawal_complete',
        type: 'confirmation',
        title: 'Consent Withdrawn',
        content: 'Your consent has been withdrawn and data processing has been stopped. You can re-enable features anytime in your privacy settings.',
        isRequired: true,
        previousStep: 'confirm_withdrawal'
      }
    ];

    this.flows.set(withdrawalFlowConfig.id, withdrawalFlowConfig);
    this.flowSteps.set(withdrawalFlowConfig.id, withdrawalFlowSteps);
  }

  /**
   * Process user consent through a specific flow
   */
  async processConsentFlow(
    flowId: string, 
    userId: string, 
    userChoices: Record<string, boolean>,
    parentalConsent?: ParentalConsentFlow
  ): Promise<ConsentRecord> {
    const flow = this.flows.get(flowId);
    if (!flow) {
      throw new Error(`Consent flow ${flowId} not found`);
    }

    const timestamp = new Date().toISOString();
    const consentChoices: Record<string, any> = {};

    // Process each consent choice
    Object.entries(userChoices).forEach(([itemId, granted]) => {
      const consentItem = this.consentItems.get(itemId);
      if (consentItem) {
        consentChoices[itemId] = {
          granted,
          timestamp,
          method: 'web_form',
          version: '1.0'
        };
      }
    });

    // Create consent record
    const consentRecord: ConsentRecord = {
      userId,
      flowId,
      timestamp,
      consentChoices,
      withdrawalHistory: [],
      version: '1.0',
      jurisdiction: flow.jurisdiction
    };

    // Add parental consent if applicable
    if (parentalConsent && flow.targetAudience === 'minor') {
      consentRecord.parentalConsent = {
        parentEmail: parentalConsent.emailVerification ? 'verified@email.com' : '',
        verificationMethod: 'email_verification',
        verifiedAt: timestamp,
        parentName: 'Parent Name',
        relationship: 'parent'
      };
    }

    // Store consent record
    this.consentRecords.set(userId, consentRecord);
    this.saveConsentRecord(consentRecord);

    // Apply consent choices to app functionality
    await this.applyConsentChoices(userId, consentChoices);

    // Send confirmation to user (and parent if applicable)
    await this.sendConsentConfirmation(consentRecord);

    return consentRecord;
  }

  /**
   * Withdraw consent for specific items
   */
  async withdrawConsent(
    userId: string, 
    itemIds: string[], 
    reason?: string
  ): Promise<ConsentRecord> {
    const existingRecord = this.consentRecords.get(userId);
    if (!existingRecord) {
      throw new Error(`No consent record found for user ${userId}`);
    }

    const timestamp = new Date().toISOString();

    // Update consent choices
    itemIds.forEach(itemId => {
      if (existingRecord.consentChoices[itemId]) {
        existingRecord.consentChoices[itemId].granted = false;
        existingRecord.consentChoices[itemId].timestamp = timestamp;
        
        // Add to withdrawal history
        existingRecord.withdrawalHistory.push({
          itemId,
          withdrawnAt: timestamp,
          reason,
          method: 'user_request'
        });
      }
    });

    // Update stored record
    this.consentRecords.set(userId, existingRecord);
    this.saveConsentRecord(existingRecord);

    // Apply withdrawal changes
    await this.applyConsentWithdrawal(userId, itemIds);

    // Send withdrawal confirmation
    await this.sendWithdrawalConfirmation(existingRecord, itemIds);

    return existingRecord;
  }

  /**
   * Get current consent status for a user
   */
  getConsentStatus(userId: string): ConsentRecord | null {
    return this.consentRecords.get(userId) || null;
  }

  /**
   * Check if user has consented to specific processing
   */
  hasConsent(userId: string, itemId: string): boolean {
    const record = this.consentRecords.get(userId);
    if (!record) return false;

    const consent = record.consentChoices[itemId];
    return consent ? consent.granted : false;
  }

  /**
   * Get available consent flows for user
   */
  getAvailableFlows(userContext: {
    age?: number;
    jurisdiction?: string;
    existingUser?: boolean;
  }): ConsentFlowConfig[] {
    const flows = Array.from(this.flows.values());
    
    return flows.filter(flow => {
      // Filter by age
      if (userContext.age !== undefined) {
        if (userContext.age < 13 && flow.targetAudience !== 'minor') return false;
        if (userContext.age >= 13 && userContext.age < 18 && flow.targetAudience === 'minor') return false;
        if (userContext.age >= 18 && flow.targetAudience === 'minor') return false;
      }

      // Filter by jurisdiction
      if (userContext.jurisdiction && flow.jurisdiction !== 'Global' && flow.jurisdiction !== userContext.jurisdiction) {
        return false;
      }

      // Filter by user type
      if (userContext.existingUser && flow.flowType === 'onboarding') return false;

      return true;
    });
  }

  /**
   * Generate consent receipt for user records
   */
  generateConsentReceipt(userId: string): string {
    const record = this.consentRecords.get(userId);
    if (!record) {
      throw new Error(`No consent record found for user ${userId}`);
    }

    let receipt = `ALCHM CONSENT RECEIPT\n`;
    receipt += `========================\n\n`;
    receipt += `User ID: ${record.userId}\n`;
    receipt += `Consent Date: ${new Date(record.timestamp).toLocaleString()}\n`;
    receipt += `Flow: ${record.flowId}\n`;
    receipt += `Version: ${record.version}\n`;
    receipt += `Jurisdiction: ${record.jurisdiction}\n\n`;

    receipt += `CONSENT CHOICES:\n`;
    receipt += `----------------\n`;
    Object.entries(record.consentChoices).forEach(([itemId, choice]) => {
      const item = this.consentItems.get(itemId);
      if (item) {
        receipt += `${item.purpose}: ${choice.granted ? 'GRANTED' : 'DENIED'}\n`;
        receipt += `  Date: ${new Date(choice.timestamp).toLocaleString()}\n`;
        receipt += `  Legal Basis: ${item.legalBasis}\n\n`;
      }
    });

    if (record.parentalConsent) {
      receipt += `PARENTAL CONSENT:\n`;
      receipt += `-----------------\n`;
      receipt += `Parent: ${record.parentalConsent.parentName}\n`;
      receipt += `Relationship: ${record.parentalConsent.relationship}\n`;
      receipt += `Verified: ${new Date(record.parentalConsent.verifiedAt).toLocaleString()}\n\n`;
    }

    if (record.withdrawalHistory.length > 0) {
      receipt += `WITHDRAWAL HISTORY:\n`;
      receipt += `-------------------\n`;
      record.withdrawalHistory.forEach(withdrawal => {
        const item = this.consentItems.get(withdrawal.itemId);
        receipt += `${item?.purpose || withdrawal.itemId}: Withdrawn ${new Date(withdrawal.withdrawnAt).toLocaleString()}\n`;
        if (withdrawal.reason) {
          receipt += `  Reason: ${withdrawal.reason}\n`;
        }
      });
    }

    receipt += `\nYou can modify these choices anytime at: alchm.app/privacy\n`;
    receipt += `Questions? Contact: privacy@alchm.app\n`;

    return receipt;
  }

  // Private helper methods

  private loadExistingConsent(): void {
    const stored = typeof window !== 'undefined' && localStorage.getItem('alchm_consent_records');
    if (stored) {
      try {
        const records = JSON.parse(stored);
        Object.entries(records).forEach(([userId, record]) => {
          this.consentRecords.set(userId, record as ConsentRecord);
        });
      } catch (error) {
        console.warn('Failed to load existing consent records');
      }
    }
  }

  private saveConsentRecord(record: ConsentRecord): void {
    const allRecords = Object.fromEntries(this.consentRecords.entries());
    typeof window !== 'undefined' && localStorage.setItem('alchm_consent_records', JSON.stringify(allRecords));
  }

  private async applyConsentChoices(userId: string, choices: Record<string, any>): Promise<void> {
    // Apply consent choices to app functionality
    Object.entries(choices).forEach(([itemId, choice]) => {
      if (choice.granted) {
        typeof window !== 'undefined' && localStorage.removeItem(`alchm_${itemId}_disabled`);
      } else {
        typeof window !== 'undefined' && localStorage.setItem(`alchm_${itemId}_disabled`, 'true');
      }
    });

    console.log(`Applied consent choices for user ${userId}:`, choices);
  }

  private async applyConsentWithdrawal(userId: string, itemIds: string[]): Promise<void> {
    // Apply withdrawal by disabling features
    itemIds.forEach(itemId => {
      typeof window !== 'undefined' && localStorage.setItem(`alchm_${itemId}_disabled`, 'true');
      
      // Clear related data if applicable
      if (itemId === 'analytics_improvement') {
        typeof window !== 'undefined' && localStorage.removeItem('alchm_analytics_data');
      }
      if (itemId === 'ai_processing') {
        typeof window !== 'undefined' && localStorage.removeItem('alchm_ai_history');
      }
    });

    console.log(`Applied consent withdrawal for user ${userId}:`, itemIds);
  }

  private async sendConsentConfirmation(record: ConsentRecord): Promise<void> {
    console.log(`Sending consent confirmation to user ${record.userId}`);
    
    // In production, send email confirmation
    if (record.parentalConsent) {
      console.log(`Sending parental notification to ${record.parentalConsent.parentEmail}`);
    }
  }

  private async sendWithdrawalConfirmation(record: ConsentRecord, withdrawnItems: string[]): Promise<void> {
    console.log(`Sending withdrawal confirmation to user ${record.userId} for items:`, withdrawnItems);
    
    // In production, send email confirmation
  }

  /**
   * Export all consent data for compliance auditing
   */
  exportConsentData(): {
    flows: ConsentFlowConfig[];
    items: ConsentItem[];
    records: ConsentRecord[];
    exportDate: string;
  } {
    return {
      flows: Array.from(this.flows.values()),
      items: Array.from(this.consentItems.values()),
      records: Array.from(this.consentRecords.values()),
      exportDate: new Date().toISOString()
    };
  }

  /**
   * Validate consent record compliance
   */
  validateConsentCompliance(record: ConsentRecord): {
    isValid: boolean;
    violations: string[];
    warnings: string[];
  } {
    const violations: string[] = [];
    const warnings: string[] = [];

    // Check required consent items
    const requiredItems = Array.from(this.consentItems.values()).filter(item => item.isRequired);
    requiredItems.forEach(item => {
      if (!record.consentChoices[item.id] || !record.consentChoices[item.id].granted) {
        violations.push(`Missing required consent for: ${item.purpose}`);
      }
    });

    // Check parental consent for minors
    const hasMinorConsent = Array.from(this.consentItems.values()).some(item => 
      item.requiresParentalConsent && record.consentChoices[item.id]?.granted
    );
    
    if (hasMinorConsent && !record.parentalConsent) {
      violations.push('Parental consent required but not provided');
    }

    // Check consent freshness (GDPR requires renewal)
    const consentAge = Date.now() - new Date(record.timestamp).getTime();
    const twoYears = 2 * 365 * 24 * 60 * 60 * 1000;
    
    if (consentAge > twoYears) {
      warnings.push('Consent is over 2 years old and may need renewal');
    }

    return {
      isValid: violations.length === 0,
      violations,
      warnings
    };
  }
}

// Export singleton instance
export const consentFlowBuilder = new ConsentFlowBuilder();