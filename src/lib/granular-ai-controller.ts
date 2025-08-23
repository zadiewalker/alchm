// ALCHM Granular AI Controller
// Fine-grained control system for individual AI features and capabilities

import { UserAIPreferences, AIInteractionLevel } from './ai-opt-out-manager';

export interface GranularAIConfig {
  userId: string;
  globalSettings: GlobalAISettings;
  featureControls: FeatureControlMap;
  sessionControls: SessionControlSettings;
  contextualControls: ContextualControlMap;
  emergencyOverrides: EmergencyOverrideSettings;
  auditTrail: ControlAuditEntry[];
}

export interface GlobalAISettings {
  masterSwitch: boolean; // Global AI on/off
  maxAIInvolvementLevel: 'none' | 'minimal' | 'moderate' | 'full';
  requireExplicitConsent: boolean;
  allowLearningFromInteractions: boolean;
  dataRetentionPolicy: 'session_only' | 'short_term' | 'long_term' | 'permanent';
  crossSessionMemory: boolean;
  parentalControlsEnabled: boolean;
}

export interface FeatureControlMap {
  // Core AI Features
  emotionalAnalysis: FeatureControl;
  patternRecognition: FeatureControl;
  personalizedPrompts: FeatureControl;
  culturalAdaptation: FeatureControl;
  resourceSuggestions: FeatureControl;
  
  // Advanced Features
  predictiveInsights: FeatureControl;
  behaviorTracking: FeatureControl;
  moodPrediction: FeatureControl;
  crisisDetection: FeatureControl; // Cannot be disabled
  
  // Data Processing Features
  contentAnalysis: FeatureControl;
  sentimentAnalysis: FeatureControl;
  topicExtraction: FeatureControl;
  languageProcessing: FeatureControl;
  
  // Interaction Features
  conversationalAI: FeatureControl;
  proactiveSupport: FeatureControl;
  adaptiveResponses: FeatureControl;
  contextualMemory: FeatureControl;
}

export interface FeatureControl {
  enabled: boolean;
  confidenceThreshold: number; // 0-1, minimum confidence to activate
  explicitConsentRequired: boolean;
  canBeOverridden: boolean;
  parentalApprovalRequired: boolean;
  dataProcessingLevel: 'none' | 'anonymized' | 'pseudonymized' | 'identifiable';
  auditLevel: 'none' | 'basic' | 'detailed' | 'comprehensive';
  fallbackBehavior: 'disable' | 'degrade' | 'human_handoff';
  restrictions: FeatureRestriction[];
}

export interface FeatureRestriction {
  type: 'time_based' | 'usage_based' | 'context_based' | 'content_based';
  condition: string;
  action: 'block' | 'warn' | 'require_confirmation' | 'log_only';
  description: string;
}

export interface SessionControlSettings {
  sessionDuration: number; // Maximum session time in minutes
  maxAIInteractions: number; // Maximum AI responses per session
  coolingOffPeriod: number; // Minutes between AI-intensive sessions
  adaptiveThrottling: boolean; // Reduce AI involvement over time
  userFatigueDetection: boolean; // Monitor for AI overuse
  sessionResetTriggers: SessionResetTrigger[];
}

export interface SessionResetTrigger {
  trigger: 'time_elapsed' | 'interaction_count' | 'user_request' | 'stress_detected';
  threshold: number;
  action: 'soft_reset' | 'hard_reset' | 'ai_pause' | 'human_handoff';
}

export interface ContextualControlMap {
  // Context-specific AI behavior controls
  journalEntryTypes: {
    daily_reflection: ContextualControl;
    trauma_processing: ContextualControl;
    crisis_situation: ContextualControl;
    goal_setting: ContextualControl;
    relationship_issues: ContextualControl;
    cultural_exploration: ContextualControl;
  };
  
  emotionalStates: {
    high_stress: ContextualControl;
    depression_indicators: ContextualControl;
    anxiety_spike: ContextualControl;
    positive_mood: ContextualControl;
    neutral_state: ContextualControl;
  };
  
  timeContexts: {
    late_night: ContextualControl;
    early_morning: ContextualControl;
    work_hours: ContextualControl;
    weekend: ContextualControl;
  };
  
  locationContexts: {
    home: ContextualControl;
    school: ContextualControl;
    public_space: ContextualControl;
    therapy_setting: ContextualControl;
  };
}

export interface ContextualControl {
  aiInvolvementLevel: 'none' | 'minimal' | 'standard' | 'enhanced';
  allowedFeatures: string[]; // Subset of available AI features
  disallowedFeatures: string[]; // Features explicitly blocked
  responseStyle: 'formal' | 'casual' | 'supportive' | 'clinical' | 'peer';
  interventionThreshold: number; // 0-1, when to offer help
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  condition: string;
  action: 'increase_support' | 'decrease_ai' | 'human_handoff' | 'crisis_protocol';
  threshold: number;
  description: string;
}

export interface EmergencyOverrideSettings {
  crisisDetectionAlwaysOn: boolean; // Cannot be disabled
  emergencyContactNotification: boolean;
  automaticProfessionalReferral: boolean;
  dataPrivacyOverrideLevel: 'none' | 'minimal' | 'full'; // For emergencies only
  emergencyDataRetention: number; // Days to retain crisis-related data
  parentalNotificationThreshold: 'immediate' | 'severe_only' | 'never';
}

export interface ControlAuditEntry {
  timestamp: string;
  userId: string;
  action: 'feature_toggled' | 'setting_changed' | 'override_triggered' | 'emergency_activated';
  feature: string;
  oldValue: any;
  newValue: any;
  reason: string;
  contextData: Record<string, any>;
  complianceFramework: string[];
}

// ===== GRANULAR AI CONTROLLER CLASS =====

export class GranularAIController {
  private config: GranularAIConfig;
  private auditLogger: ControlAuditLogger;
  private emergencyProtocols: EmergencyProtocolManager;
  private contextDetector: ContextDetectionEngine;

  constructor(userId: string, preferences: UserAIPreferences) {
    this.config = this.initializeConfig(userId, preferences);
    this.auditLogger = new ControlAuditLogger();
    this.emergencyProtocols = new EmergencyProtocolManager();
    this.contextDetector = new ContextDetectionEngine();
  }

  // ===== FEATURE CONTROL METHODS =====

  async checkFeaturePermission(
    feature: keyof FeatureControlMap,
    context: AIRequestContext
  ): Promise<FeaturePermissionResult> {
    
    // 1. Check global settings
    if (!this.config.globalSettings.masterSwitch && feature !== 'crisisDetection') {
      return {
        allowed: false,
        reason: 'global_ai_disabled',
        fallbackAction: 'disable',
        auditRequired: true
      };
    }

    // 2. Check feature-specific settings
    const featureControl = this.config.featureControls[feature];
    if (!featureControl.enabled) {
      return {
        allowed: false,
        reason: 'feature_disabled',
        fallbackAction: featureControl.fallbackBehavior,
        auditRequired: true
      };
    }

    // 3. Check contextual controls
    const contextualPermission = await this.checkContextualPermission(feature, context);
    if (!contextualPermission.allowed) {
      return contextualPermission;
    }

    // 4. Check session limits
    const sessionPermission = await this.checkSessionLimits(feature, context);
    if (!sessionPermission.allowed) {
      return sessionPermission;
    }

    // 5. Check parental controls
    if (featureControl.parentalApprovalRequired && this.config.globalSettings.parentalControlsEnabled) {
      const parentalPermission = await this.checkParentalApproval(feature, context);
      if (!parentalPermission.allowed) {
        return parentalPermission;
      }
    }

    // 6. Check confidence threshold
    if (context.aiConfidence < featureControl.confidenceThreshold) {
      return {
        allowed: false,
        reason: 'confidence_below_threshold',
        fallbackAction: featureControl.fallbackBehavior,
        auditRequired: false,
        suggestedAlternative: this.suggestAlternativeFeature(feature, context)
      };
    }

    return {
      allowed: true,
      reason: 'all_checks_passed',
      auditRequired: featureControl.auditLevel !== 'none',
      dataProcessingLevel: featureControl.dataProcessingLevel,
      restrictions: featureControl.restrictions
    };
  }

  async executeControlledAIFeature(
    feature: keyof FeatureControlMap,
    input: AIFeatureInput,
    context: AIRequestContext
  ): Promise<ControlledAIResponse> {
    
    // 1. Check permission
    const permission = await this.checkFeaturePermission(feature, context);
    if (!permission.allowed) {
      return this.handleDeniedFeature(feature, permission, context);
    }

    // 2. Apply pre-execution restrictions
    const restrictedInput = await this.applyInputRestrictions(input, permission.restrictions || []);

    // 3. Execute AI feature with monitoring
    const startTime = Date.now();
    let response: AIFeatureResponse;
    
    try {
      response = await this.executeAIFeature(feature, restrictedInput, context);
    } catch (error) {
      // Handle AI execution errors
      return this.handleAIError(feature, error, context);
    }

    // 4. Apply output filtering
    const filteredResponse = await this.applyOutputFiltering(response, permission.restrictions || []);

    // 5. Update usage tracking
    await this.updateUsageTracking(feature, Date.now() - startTime, context);

    // 6. Audit if required
    if (permission.auditRequired) {
      await this.auditLogger.logFeatureExecution(feature, input, filteredResponse, context);
    }

    return {
      success: true,
      feature,
      response: filteredResponse,
      processingLevel: permission.dataProcessingLevel || 'anonymized',
      restrictions: permission.restrictions || [],
      metadata: {
        executionTime: Date.now() - startTime,
        confidenceScore: response.confidence,
        restrictionsApplied: permission.restrictions?.length || 0
      }
    };
  }

  // ===== DYNAMIC CONTROL ADJUSTMENT =====

  async adjustControlsBasedOnBehavior(
    userId: string,
    behaviorAnalysis: UserBehaviorAnalysis
  ): Promise<ControlAdjustmentResult> {
    
    const adjustments: ControlAdjustment[] = [];

    // 1. Analyze AI dependency patterns
    if (behaviorAnalysis.aiDependencyScore > 0.8) {
      adjustments.push({
        type: 'session_limit_tightening',
        feature: 'global',
        adjustment: 'reduce_ai_availability',
        reason: 'preventing_ai_dependency',
        severity: 'moderate'
      });
    }

    // 2. Analyze stress/overwhelm indicators
    if (behaviorAnalysis.stressLevel > 0.7) {
      adjustments.push({
        type: 'simplify_ai_interactions',
        feature: 'personalizedPrompts',
        adjustment: 'reduce_complexity',
        reason: 'stress_detected',
        severity: 'high'
      });
    }

    // 3. Analyze privacy comfort level
    if (behaviorAnalysis.privacyConcerns > 0.6) {
      adjustments.push({
        type: 'increase_data_protection',
        feature: 'contentAnalysis',
        adjustment: 'increase_anonymization',
        reason: 'privacy_concerns_detected',
        severity: 'moderate'
      });
    }

    // 4. Apply adjustments
    for (const adjustment of adjustments) {
      await this.applyControlAdjustment(adjustment);
    }

    return {
      adjustmentsMade: adjustments.length,
      adjustments,
      effectiveImmediately: true,
      userNotificationRequired: adjustments.some(a => a.severity === 'high'),
      reviewDate: this.calculateNextReviewDate()
    };
  }

  // ===== USER CONTROL INTERFACE =====

  async updateFeatureControl(
    feature: keyof FeatureControlMap,
    updates: Partial<FeatureControl>,
    userConsent: boolean = false
  ): Promise<ControlUpdateResult> {
    
    // 1. Validate update permissions
    if (!this.canUserModifyFeature(feature)) {
      return {
        success: false,
        reason: 'insufficient_permissions',
        requiredApproval: 'parental_or_admin'
      };
    }

    // 2. Check for critical features
    if (feature === 'crisisDetection' && updates.enabled === false) {
      return {
        success: false,
        reason: 'critical_feature_cannot_be_disabled',
        message: 'Crisis detection cannot be disabled for safety reasons'
      };
    }

    // 3. Apply updates
    const previousSettings = { ...this.config.featureControls[feature] };
    this.config.featureControls[feature] = {
      ...this.config.featureControls[feature],
      ...updates
    };

    // 4. Audit the change
    await this.auditLogger.logControlChange({
      timestamp: new Date().toISOString(),
      userId: this.config.userId,
      action: 'feature_toggled',
      feature,
      oldValue: previousSettings,
      newValue: this.config.featureControls[feature],
      reason: userConsent ? 'user_requested' : 'system_adjustment',
      contextData: { userConsent },
      complianceFramework: ['FERPA', 'COPPA', 'GDPR']
    });

    return {
      success: true,
      previousSettings,
      newSettings: this.config.featureControls[feature],
      effectiveImmediately: true
    };
  }

  // ===== EMERGENCY OVERRIDE SYSTEM =====

  async triggerEmergencyOverride(
    situation: 'crisis_detected' | 'safety_concern' | 'parental_request',
    overrideLevel: 'minimal' | 'moderate' | 'full'
  ): Promise<EmergencyOverrideResult> {
    
    // Always log emergency situations
    await this.auditLogger.logEmergencyOverride(situation, overrideLevel);

    switch (overrideLevel) {
      case 'minimal':
        // Enable crisis detection if somehow disabled, minimal data sharing
        this.config.featureControls.crisisDetection.enabled = true;
        break;
        
      case 'moderate':
        // Enable crisis support features, limited data sharing for safety
        this.config.featureControls.crisisDetection.enabled = true;
        this.config.featureControls.resourceSuggestions.enabled = true;
        this.config.emergencyOverrides.dataPrivacyOverrideLevel = 'minimal';
        break;
        
      case 'full':
        // Full emergency protocol activation
        Object.keys(this.config.featureControls).forEach(feature => {
          if (feature !== 'crisisDetection') {
            this.config.featureControls[feature as keyof FeatureControlMap].enabled = true;
          }
        });
        this.config.emergencyOverrides.dataPrivacyOverrideLevel = 'full';
        break;
    }

    return {
      overrideActivated: true,
      level: overrideLevel,
      situation,
      timestamp: new Date().toISOString(),
      automaticReviewScheduled: true,
      reviewDate: this.calculateEmergencyReviewDate(),
      emergencyContactsNotified: this.config.emergencyOverrides.emergencyContactNotification
    };
  }

  // ===== TRANSPARENCY AND REPORTING =====

  generateUserControlReport(): UserControlReport {
    const activeFeatures = Object.entries(this.config.featureControls)
      .filter(([_, control]) => control.enabled)
      .map(([feature, _]) => feature);

    const disabledFeatures = Object.entries(this.config.featureControls)
      .filter(([_, control]) => !control.enabled)
      .map(([feature, _]) => feature);

    return {
      userId: this.config.userId,
      reportDate: new Date().toISOString(),
      globalSettings: {
        aiEnabled: this.config.globalSettings.masterSwitch,
        maxInvolvement: this.config.globalSettings.maxAIInvolvementLevel,
        parentalControls: this.config.globalSettings.parentalControlsEnabled
      },
      activeFeatures,
      disabledFeatures,
      dataProcessingLevel: this.calculateOverallDataProcessingLevel(),
      recentAdjustments: this.getRecentControlAdjustments(7), // Last 7 days
      nextScheduledReview: this.getNextScheduledReview(),
      userRights: this.getUserRights(),
      controlOptions: this.getAvailableControlOptions()
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  private initializeConfig(userId: string, preferences: UserAIPreferences): GranularAIConfig {
    const baseLevel = preferences.interactionLevel;
    
    return {
      userId,
      globalSettings: {
        masterSwitch: baseLevel !== 'none',
        maxAIInvolvementLevel: this.mapInteractionLevelToInvolvement(baseLevel),
        requireExplicitConsent: true,
        allowLearningFromInteractions: baseLevel === 'enhanced',
        dataRetentionPolicy: 'short_term',
        crossSessionMemory: baseLevel === 'enhanced',
        parentalControlsEnabled: !!preferences.parentalControls?.enabled
      },
      featureControls: this.generateFeatureControlsFromPreferences(preferences),
      sessionControls: this.generateDefaultSessionControls(),
      contextualControls: this.generateDefaultContextualControls(),
      emergencyOverrides: this.generateDefaultEmergencyOverrides(),
      auditTrail: []
    };
  }

  private generateFeatureControlsFromPreferences(preferences: UserAIPreferences): FeatureControlMap {
    const baseEnabled = preferences.interactionLevel !== 'none';
    
    return {
      emotionalAnalysis: this.createFeatureControl(
        !preferences.specificOptOuts.emotionalAnalysis && baseEnabled,
        'moderate'
      ),
      patternRecognition: this.createFeatureControl(
        !preferences.specificOptOuts.patternRecognition && baseEnabled,
        'high'
      ),
      personalizedPrompts: this.createFeatureControl(
        !preferences.specificOptOuts.personalizedPrompts && baseEnabled,
        'moderate'
      ),
      culturalAdaptation: this.createFeatureControl(
        !preferences.specificOptOuts.culturalAdaptation && baseEnabled,
        'low'
      ),
      resourceSuggestions: this.createFeatureControl(baseEnabled, 'low'),
      predictiveInsights: this.createFeatureControl(
        preferences.interactionLevel === 'enhanced',
        'high'
      ),
      behaviorTracking: this.createFeatureControl(
        preferences.interactionLevel === 'enhanced',
        'high'
      ),
      moodPrediction: this.createFeatureControl(
        preferences.interactionLevel === 'enhanced',
        'high'
      ),
      crisisDetection: this.createFeatureControl(true, 'critical'), // Always enabled
      contentAnalysis: this.createFeatureControl(
        !preferences.specificOptOuts.dataCollection && baseEnabled,
        'moderate'
      ),
      sentimentAnalysis: this.createFeatureControl(baseEnabled, 'moderate'),
      topicExtraction: this.createFeatureControl(baseEnabled, 'moderate'),
      languageProcessing: this.createFeatureControl(baseEnabled, 'low'),
      conversationalAI: this.createFeatureControl(baseEnabled, 'moderate'),
      proactiveSupport: this.createFeatureControl(
        preferences.interactionLevel === 'enhanced',
        'high'
      ),
      adaptiveResponses: this.createFeatureControl(baseEnabled, 'moderate'),
      contextualMemory: this.createFeatureControl(
        preferences.interactionLevel === 'enhanced',
        'high'
      )
    };
  }

  private createFeatureControl(enabled: boolean, sensitivityLevel: string): FeatureControl {
    const thresholds = {
      low: 0.3,
      moderate: 0.6,
      high: 0.8,
      critical: 0.95
    };

    return {
      enabled,
      confidenceThreshold: thresholds[sensitivityLevel as keyof typeof thresholds] || 0.6,
      explicitConsentRequired: sensitivityLevel === 'high' || sensitivityLevel === 'critical',
      canBeOverridden: sensitivityLevel !== 'critical',
      parentalApprovalRequired: sensitivityLevel === 'high' || sensitivityLevel === 'critical',
      dataProcessingLevel: enabled ? 'anonymized' : 'none',
      auditLevel: sensitivityLevel === 'critical' ? 'comprehensive' : 'basic',
      fallbackBehavior: 'degrade',
      restrictions: []
    };
  }

  // Additional helper methods would be implemented here...
  
  private mapInteractionLevelToInvolvement(level: string): 'none' | 'minimal' | 'moderate' | 'full' {
    switch (level) {
      case 'none': return 'none';
      case 'minimal': return 'minimal';
      case 'standard': return 'moderate';
      case 'enhanced': return 'full';
      default: return 'moderate';
    }
  }

  // More helper methods would be implemented...
}

// ===== SUPPORTING CLASSES =====

class ControlAuditLogger {
  async logFeatureExecution(feature: string, input: any, response: any, context: any): Promise<void> {
    // Implementation for logging feature execution
  }

  async logControlChange(entry: ControlAuditEntry): Promise<void> {
    // Implementation for logging control changes
  }

  async logEmergencyOverride(situation: string, level: string): Promise<void> {
    // Implementation for logging emergency overrides
  }
}

class EmergencyProtocolManager {
  // Implementation for emergency protocol management
}

class ContextDetectionEngine {
  // Implementation for context detection
}

// ===== SUPPORTING INTERFACES =====

interface AIRequestContext {
  sessionId: string;
  timestamp: string;
  userEmotionalState: string;
  contentType: string;
  deviceContext: string;
  locationContext: string;
  timeContext: string;
  aiConfidence: number;
}

interface FeaturePermissionResult {
  allowed: boolean;
  reason: string;
  fallbackAction?: string;
  auditRequired: boolean;
  dataProcessingLevel?: string;
  restrictions?: FeatureRestriction[];
  suggestedAlternative?: string;
}

interface AIFeatureInput {
  userId: string;
  content: string;
  context: Record<string, any>;
  preferences: Record<string, any>;
}

interface AIFeatureResponse {
  content: string;
  confidence: number;
  metadata: Record<string, any>;
}

interface ControlledAIResponse {
  success: boolean;
  feature: string;
  response: AIFeatureResponse;
  processingLevel: string;
  restrictions: FeatureRestriction[];
  metadata: {
    executionTime: number;
    confidenceScore: number;
    restrictionsApplied: number;
  };
}

interface UserBehaviorAnalysis {
  aiDependencyScore: number;
  stressLevel: number;
  privacyConcerns: number;
  engagementLevel: number;
  helpSeekingBehavior: number;
}

interface ControlAdjustment {
  type: string;
  feature: string;
  adjustment: string;
  reason: string;
  severity: 'low' | 'moderate' | 'high';
}

interface ControlAdjustmentResult {
  adjustmentsMade: number;
  adjustments: ControlAdjustment[];
  effectiveImmediately: boolean;
  userNotificationRequired: boolean;
  reviewDate: string;
}

interface ControlUpdateResult {
  success: boolean;
  reason?: string;
  requiredApproval?: string;
  message?: string;
  previousSettings?: FeatureControl;
  newSettings?: FeatureControl;
  effectiveImmediately?: boolean;
}

interface EmergencyOverrideResult {
  overrideActivated: boolean;
  level: string;
  situation: string;
  timestamp: string;
  automaticReviewScheduled: boolean;
  reviewDate: string;
  emergencyContactsNotified: boolean;
}

interface UserControlReport {
  userId: string;
  reportDate: string;
  globalSettings: any;
  activeFeatures: string[];
  disabledFeatures: string[];
  dataProcessingLevel: string;
  recentAdjustments: any[];
  nextScheduledReview: string;
  userRights: string[];
  controlOptions: any[];
}

export { GranularAIController };
export type {
  GranularAIConfig,
  FeatureControl,
  FeatureControlMap,
  AIRequestContext,
  ControlledAIResponse
};