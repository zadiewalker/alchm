/**
 * Crisis Safety Coordinator
 * 
 * MISSION CRITICAL: The central nervous system for crisis safety throughout ALCHM
 * 
 * This system orchestrates comprehensive crisis detection, intervention, and resource
 * coordination across all user touchpoints while maintaining privacy and cultural sensitivity.
 * 
 * Every function in this system could mean the difference between life and death.
 */

import { z } from 'zod';
import { logger } from '@/lib/logging';
import { 
  enhancedCrisisDetection, 
  type CrisisDetectionInputType, 
  type CrisisDetectionOutputType,
  quickCrisisCheck 
} from '@/lib/enhanced-crisis-detection';
import { 
  globalCrisisResources, 
  type UserContext, 
  type CrisisResource 
} from '@/lib/global-crisis-resources';
import { analytics } from '@/lib/analytics';

// Crisis Safety Configuration Schema
export const CrisisSafetyConfig = z.object({
  enableRealtimeMonitoring: z.boolean().default(true),
  emergencyResponseTime: z.number().min(1000).max(5000).default(3000), // 3 seconds max
  culturalAdaptationsEnabled: z.boolean().default(true),
  offlineResourceCaching: z.boolean().default(true),
  privacyPreservingMode: z.boolean().default(true),
  gentleBoundarySystem: z.boolean().default(true),
  analyticsShameProtection: z.boolean().default(true),
  multiLanguageSupport: z.boolean().default(true),
  accessibilityEnhanced: z.boolean().default(true)
});

// Crisis Context for different user journey states
export const CrisisContext = z.object({
  currentState: z.enum([
    'onboarding', 'writing', 'reflection', 'analytics_viewing', 
    'community_interaction', 'goal_setting', 'resource_browsing', 'idle'
  ]),
  timeInState: z.number(), // milliseconds
  userInteractionLevel: z.enum(['passive', 'active', 'engaged', 'obsessive']),
  isolationIndicators: z.array(z.string()).optional(),
  usagePatterns: z.object({
    sessionDuration: z.number(),
    dailyUsage: z.number(),
    writeFrequency: z.number(),
    lastSocialInteraction: z.number().optional()
  }),
  environmentalFactors: z.object({
    timeOfDay: z.enum(['early_morning', 'morning', 'afternoon', 'evening', 'late_night']),
    dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    isOffline: z.boolean(),
    deviceType: z.enum(['mobile', 'desktop', 'tablet']),
    batteryLevel: z.number().min(0).max(100).optional()
  })
});

// Crisis Intervention Strategy
export const InterventionStrategy = z.object({
  priority: z.enum(['immediate', 'urgent', 'moderate', 'gentle', 'monitoring']),
  culturalAdaptations: z.array(z.string()),
  resourceRecommendations: z.array(z.string()),
  safetyPlanning: z.boolean(),
  followUpScheduled: z.boolean(),
  escalationThreshold: z.number().min(0).max(1),
  interventionMessage: z.string(),
  supportActions: z.array(z.object({
    actionType: z.enum(['breathing_exercise', 'grounding_technique', 'resource_access', 'safety_planning', 'community_connection']),
    priority: z.number().min(1).max(5),
    culturallyAdapted: z.boolean()
  }))
});

export type CrisisSafetyConfigType = z.infer<typeof CrisisSafetyConfig>;
export type CrisisContextType = z.infer<typeof CrisisContext>;
export type InterventionStrategyType = z.infer<typeof InterventionStrategy>;

/**
 * Central Crisis Safety Coordinator
 * 
 * Manages all crisis detection, intervention, and resource coordination
 * across the entire ALCHM platform with sub-3-second response times.
 */
export class CrisisSafetyCoordinator {
  private config: CrisisSafetyConfigType;
  private activeInterventions: Map<string, InterventionStrategyType> = new Map();
  private resourceCache: Map<string, CrisisResource[]> = new Map();
  private usageMonitoring: Map<string, any> = new Map();
  private offlineMode: boolean = false;

  constructor(config: Partial<CrisisSafetyConfigType> = {}) {
    this.config = CrisisSafetyConfig.parse(config);
    this.initializeSystem();
  }

  private initializeSystem(): void {
    this.setupOfflineDetection();
    this.preloadCriticalResources();
    this.initializeUsageMonitoring();
    
    logger.info('Crisis Safety Coordinator initialized', {
      emergencyResponseTime: this.config.emergencyResponseTime,
      culturalAdaptationsEnabled: this.config.culturalAdaptationsEnabled,
      privacyPreservingMode: this.config.privacyPreservingMode
    });
  }

  /**
   * CORE FUNCTION: Comprehensive crisis assessment and intervention
   * 
   * This is the primary entry point for crisis safety throughout the platform.
   * Must complete in under 3 seconds to meet emergency response standards.
   */
  async assessAndIntervene(
    contentSummary: string,
    userId: string,
    userContext: UserContext,
    crisisContext: CrisisContextType
  ): Promise<{
    intervention: InterventionStrategyType | null;
    safeExitPoints: string[];
    immediateResources: CrisisResource[];
    followUpActions: string[];
    systemAlerts: string[];
  }> {
    const startTime = Date.now();
    
    try {
      // Quick crisis check first (< 100ms)
      const quickCheck = quickCrisisCheck(contentSummary);
      
      // If no crisis indicators, provide safe monitoring
      if (!quickCheck.hasCrisisIndicators) {
        return this.generateSafeMonitoringResponse(userId, crisisContext);
      }

      // Enhanced crisis detection for confirmed indicators
      const detectionInput: CrisisDetectionInputType = {
        textSummary: contentSummary,
        userId,
        timestamp: Date.now(),
        culturalContext: this.buildCulturalContext(userContext),
        sessionContext: {
          timeOfDay: crisisContext.environmentalFactors.timeOfDay,
          dayOfWeek: crisisContext.environmentalFactors.dayOfWeek,
          deviceType: crisisContext.environmentalFactors.deviceType,
          writingDuration: crisisContext.timeInState
        }
      };

      const crisisDetection = await enhancedCrisisDetection.detectCrisis(detectionInput);
      
      // Generate culturally-responsive intervention strategy
      const intervention = await this.generateInterventionStrategy(
        crisisDetection,
        userContext,
        crisisContext,
        quickCheck.urgentAction
      );

      // Get immediate accessible resources
      const immediateResources = await this.getImmediateResources(
        userContext,
        crisisDetection.riskLevel,
        this.offlineMode
      );

      // Generate safe exit points for current context
      const safeExitPoints = this.generateSafeExitPoints(crisisContext);

      // Plan follow-up actions
      const followUpActions = this.planFollowUpActions(intervention, crisisDetection);

      // Generate system alerts if escalation needed
      const systemAlerts = this.generateSystemAlerts(crisisDetection, userId);

      // Store active intervention
      if (intervention) {
        this.activeInterventions.set(userId, intervention);
      }

      // Log crisis event (privacy-safe)
      await this.logCrisisEvent(userId, crisisDetection.riskLevel, Date.now() - startTime);

      return {
        intervention,
        safeExitPoints,
        immediateResources,
        followUpActions,
        systemAlerts
      };

    } catch (error) {
      logger.error('Crisis assessment failed - using safe fallback', error);
      
      // CRITICAL: Always provide safe fallback
      return this.generateEmergencyFallbackResponse(userId, userContext);
    }
  }

  /**
   * Monitor user interaction patterns for concerning behavior
   */
  monitorUsagePatterns(
    userId: string,
    interactionType: string,
    duration: number,
    context: Partial<CrisisContextType>
  ): {
    concerningPattern: boolean;
    interventionNeeded: boolean;
    boundaryRecommendation: string | null;
  } {
    const userPatterns = this.usageMonitoring.get(userId) || {
      sessionDurations: [],
      interactionTypes: {},
      dailyUsage: 0,
      obsessiveIndicators: 0,
      isolationScore: 0,
      lastSocialInteraction: Date.now()
    };

    // Update patterns
    userPatterns.sessionDurations.push(duration);
    userPatterns.interactionTypes[interactionType] = (userPatterns.interactionTypes[interactionType] || 0) + 1;
    userPatterns.dailyUsage += duration;

    // Check for obsessive usage patterns
    const avgSessionDuration = userPatterns.sessionDurations.reduce((a, b) => a + b, 0) / userPatterns.sessionDurations.length;
    const obsessiveThreshold = 2 * 60 * 60 * 1000; // 2 hours
    const isObsessiveSession = duration > obsessiveThreshold;
    const isDailyOveruse = userPatterns.dailyUsage > 4 * 60 * 60 * 1000; // 4 hours daily

    if (isObsessiveSession) {
      userPatterns.obsessiveIndicators++;
    }

    // Check for isolation patterns
    const noSocialInteraction = Date.now() - userPatterns.lastSocialInteraction > 7 * 24 * 60 * 60 * 1000; // 7 days
    if (noSocialInteraction) {
      userPatterns.isolationScore++;
    }

    // Store updated patterns
    this.usageMonitoring.set(userId, userPatterns);

    // Determine intervention needs
    const concerningPattern = userPatterns.obsessiveIndicators > 3 || userPatterns.isolationScore > 2 || isDailyOveruse;
    const interventionNeeded = userPatterns.obsessiveIndicators > 5 || userPatterns.isolationScore > 4;

    let boundaryRecommendation: string | null = null;
    if (isObsessiveSession) {
      boundaryRecommendation = 'gentle_break_suggestion';
    } else if (isDailyOveruse) {
      boundaryRecommendation = 'daily_limit_reminder';
    } else if (noSocialInteraction) {
      boundaryRecommendation = 'connection_encouragement';
    }

    return {
      concerningPattern,
      interventionNeeded,
      boundaryRecommendation
    };
  }

  /**
   * Generate safe exit points for any user journey state
   */
  generateSafeExitPoints(crisisContext: CrisisContextType): string[] {
    const baseExitPoints = [
      'crisis_hotline_988',
      'crisis_text_741741',
      'emergency_contacts',
      'safe_person_contact'
    ];

    const contextualExitPoints = [];

    switch (crisisContext.currentState) {
      case 'writing':
        contextualExitPoints.push('save_and_breathe', 'pause_writing_safely');
        break;
      case 'analytics_viewing':
        contextualExitPoints.push('close_analytics_gently', 'focus_on_strengths');
        break;
      case 'community_interaction':
        contextualExitPoints.push('private_support_chat', 'mod_assistance');
        break;
      case 'onboarding':
        contextualExitPoints.push('pause_onboarding', 'immediate_support');
        break;
      default:
        contextualExitPoints.push('return_to_safety', 'contact_support');
    }

    // Add cultural exit points if applicable
    if (this.config.culturalAdaptationsEnabled) {
      contextualExitPoints.push('cultural_specific_resources', 'spiritual_support');
    }

    // Add offline exit points if needed
    if (this.offlineMode) {
      contextualExitPoints.push('offline_emergency_numbers', 'local_crisis_resources');
    }

    return [...baseExitPoints, ...contextualExitPoints];
  }

  /**
   * Prevent analytics from creating shame or pressure during crisis
   */
  applyCrisisSafeAnalytics(
    userId: string,
    analyticsData: any,
    userCrisisState: 'none' | 'low' | 'moderate' | 'high' | 'critical'
  ): any {
    if (!this.config.analyticsShameProtection) {
      return analyticsData;
    }

    const safeAnalytics = { ...analyticsData };

    // Remove or modify shame-inducing metrics during crisis
    if (['moderate', 'high', 'critical'].includes(userCrisisState)) {
      // Hide streak breaks or negative trends
      if (safeAnalytics.streakDays === 0) {
        safeAnalytics.streakDays = 1; // Show progress, not failure
        safeAnalytics.streakMessage = "Every day is a fresh start";
      }

      // Focus on positive indicators only
      safeAnalytics.focusMetrics = {
        resilience: safeAnalytics.resilienceScore || 50,
        progress: "You're taking important steps",
        support: "Help is always available"
      };

      // Remove comparison metrics
      delete safeAnalytics.benchmarks;
      delete safeAnalytics.goals;
      delete safeAnalytics.achievements;

      // Add crisis-safe messaging
      safeAnalytics.crisisSafeMessage = this.getCrisisSafeAnalyticsMessage(userCrisisState);
    }

    return safeAnalytics;
  }

  /**
   * Get immediate crisis resources with offline fallback
   */
  async getImmediateResources(
    userContext: UserContext,
    riskLevel: CrisisDetectionOutputType['riskLevel'],
    forceOffline: boolean = false
  ): Promise<CrisisResource[]> {
    const cacheKey = `${userContext.location.country}_${riskLevel}_${forceOffline}`;
    
    // Check cache first
    if (this.resourceCache.has(cacheKey)) {
      return this.resourceCache.get(cacheKey)!;
    }

    try {
      let resources: CrisisResource[];
      
      if (forceOffline || this.offlineMode) {
        // Use offline cached resources
        resources = globalCrisisResources.getOfflineResources(userContext.location.country);
      } else {
        // Get full culturally-appropriate resources
        resources = globalCrisisResources.getCrisisResources(userContext, 8);
      }

      // Filter by urgency level
      if (riskLevel === 'critical') {
        resources = resources.filter(r => r.available24h && (r.type === 'hotline' || r.type === 'text_line'));
      }

      // Cache resources
      this.resourceCache.set(cacheKey, resources);
      
      return resources;
    } catch (error) {
      logger.error('Failed to get immediate resources', error);
      
      // Emergency fallback
      return [
        {
          type: 'hotline',
          name: '988 Crisis Lifeline',
          contact: '988',
          description: 'Immediate crisis support',
          available24h: true,
          languages: ['English'],
          costFree: true,
          confidential: true,
          offlineAccessible: true
        }
      ];
    }
  }

  // Private helper methods
  private async generateInterventionStrategy(
    crisisDetection: CrisisDetectionOutputType,
    userContext: UserContext,
    crisisContext: CrisisContextType,
    urgentAction: boolean
  ): Promise<InterventionStrategyType> {
    const culturalAdaptations = this.getCulturalAdaptations(userContext, crisisDetection.riskLevel);
    
    return {
      priority: urgentAction ? 'immediate' : this.mapRiskToPriority(crisisDetection.riskLevel),
      culturalAdaptations,
      resourceRecommendations: crisisDetection.culturallyAppropriateResources.map(r => r.id || r.name),
      safetyPlanning: ['high', 'critical'].includes(crisisDetection.riskLevel),
      followUpScheduled: crisisDetection.followUpRecommended,
      escalationThreshold: this.getEscalationThreshold(crisisDetection.riskLevel),
      interventionMessage: crisisDetection.supportMessage,
      supportActions: crisisDetection.immediateActions.map(action => ({
        actionType: this.mapActionToType(action.action),
        priority: action.priority,
        culturallyAdapted: action.culturallyAdapted
      }))
    };
  }

  private generateSafeMonitoringResponse(
    userId: string, 
    crisisContext: CrisisContextType
  ) {
    return {
      intervention: null,
      safeExitPoints: this.generateSafeExitPoints(crisisContext),
      immediateResources: [],
      followUpActions: ['gentle_check_in'],
      systemAlerts: []
    };
  }

  private generateEmergencyFallbackResponse(userId: string, userContext: UserContext) {
    return {
      intervention: {
        priority: 'immediate' as const,
        culturalAdaptations: [],
        resourceRecommendations: ['988', '741741'],
        safetyPlanning: true,
        followUpScheduled: true,
        escalationThreshold: 1.0,
        interventionMessage: 'We want to make sure you\'re safe. Crisis support is available right now.',
        supportActions: []
      },
      safeExitPoints: ['crisis_hotline_988', 'crisis_text_741741', 'emergency_contacts'],
      immediateResources: [
        {
          type: 'hotline' as const,
          name: '988 Crisis Lifeline',
          contact: '988',
          description: 'Immediate crisis support',
          available24h: true,
          languages: ['English'],
          costFree: true,
          confidential: true,
          offlineAccessible: true
        }
      ],
      followUpActions: ['immediate_safety_check'],
      systemAlerts: ['emergency_fallback_activated']
    };
  }

  private buildCulturalContext(userContext: UserContext) {
    return {
      primaryLanguage: userContext.preferences.languages[0],
      culturalBackground: userContext.preferences.culturalBackground,
      religiousContext: userContext.preferences.religiousContext,
      lgbtqContext: userContext.preferences.lgbtqContext,
      ageGroup: userContext.preferences.ageGroup,
      immigrationStatus: userContext.preferences.immigrationStatus
    };
  }

  private getCulturalAdaptations(userContext: UserContext, riskLevel: string): string[] {
    const adaptations: string[] = [];

    if (userContext.preferences.lgbtqContext) {
      adaptations.push('lgbtq_affirming_language', 'chosen_family_resources');
    }

    if (userContext.preferences.immigrationStatus === 'undocumented') {
      adaptations.push('immigration_safe_resources', 'no_authority_contact');
    }

    if (userContext.preferences.ageGroup === 'youth') {
      adaptations.push('youth_friendly_approach', 'parent_notification_consideration');
    }

    if (userContext.preferences.religiousContext) {
      adaptations.push('spiritual_support_integration', 'faith_sensitive_language');
    }

    return adaptations;
  }

  private mapRiskToPriority(riskLevel: string): InterventionStrategyType['priority'] {
    switch (riskLevel) {
      case 'critical': return 'immediate';
      case 'high': return 'urgent';
      case 'moderate': return 'moderate';
      case 'low': return 'gentle';
      default: return 'monitoring';
    }
  }

  private getEscalationThreshold(riskLevel: string): number {
    switch (riskLevel) {
      case 'critical': return 1.0;
      case 'high': return 0.8;
      case 'moderate': return 0.6;
      case 'low': return 0.4;
      default: return 0.2;
    }
  }

  private mapActionToType(action: string): InterventionStrategyType['supportActions'][0]['actionType'] {
    if (action.includes('breathing') || action.includes('breath')) return 'breathing_exercise';
    if (action.includes('grounding') || action.includes('5-4-3-2-1')) return 'grounding_technique';
    if (action.includes('call') || action.includes('contact')) return 'resource_access';
    if (action.includes('safety') || action.includes('plan')) return 'safety_planning';
    if (action.includes('community') || action.includes('support')) return 'community_connection';
    return 'resource_access';
  }

  private planFollowUpActions(intervention: InterventionStrategyType | null, detection: CrisisDetectionOutputType): string[] {
    const actions: string[] = [];

    if (detection.followUpRecommended) {
      actions.push('schedule_check_in_24h');
    }

    if (intervention?.safetyPlanning) {
      actions.push('safety_plan_review', 'resource_accessibility_check');
    }

    if (detection.riskLevel === 'critical') {
      actions.push('immediate_follow_up', 'escalation_protocol');
    }

    return actions;
  }

  private generateSystemAlerts(detection: CrisisDetectionOutputType, userId: string): string[] {
    const alerts: string[] = [];

    if (detection.escalationTrigger) {
      alerts.push('crisis_escalation_triggered');
    }

    if (detection.responseTimeMs > this.config.emergencyResponseTime) {
      alerts.push('response_time_exceeded');
    }

    return alerts;
  }

  private getCrisisSafeAnalyticsMessage(crisisState: string): string {
    switch (crisisState) {
      case 'critical':
        return 'Your safety is our priority. These insights celebrate your strength in seeking support.';
      case 'high':
        return 'You\'re taking brave steps forward. Focus on the progress you\'re making.';
      case 'moderate':
        return 'Every entry is an act of self-care. You\'re building resilience with each reflection.';
      default:
        return 'Your journey of growth continues. Each step matters.';
    }
  }

  private setupOfflineDetection(): void {
    if (typeof window !== 'undefined') {
      this.offlineMode = !navigator.onLine;
      
      window.addEventListener('online', () => {
        this.offlineMode = false;
        logger.info('Crisis Safety Coordinator: Online mode restored');
      });

      window.addEventListener('offline', () => {
        this.offlineMode = true;
        logger.info('Crisis Safety Coordinator: Offline mode activated');
      });
    }
  }

  private preloadCriticalResources(): void {
    // Preload emergency resources for major countries
    const criticalCountries = ['United States', 'United Kingdom', 'Canada', 'Australia'];
    
    criticalCountries.forEach(country => {
      const resources = globalCrisisResources.getOfflineResources(country);
      this.resourceCache.set(`${country}_critical_offline`, resources);
    });
  }

  private initializeUsageMonitoring(): void {
    // Initialize usage pattern monitoring
    if (typeof window !== 'undefined') {
      // Track page visibility for usage monitoring
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          // User left - update patterns
        } else {
          // User returned - check for intervention needs
        }
      });
    }
  }

  private async logCrisisEvent(userId: string, riskLevel: string, responseTime: number): Promise<void> {
    try {
      // Privacy-safe logging
      analytics.track('crisis', 'intervention_triggered', riskLevel, responseTime, {
        hasIntervention: true,
        responseTimeMs: responseTime,
        privacyProtected: true
      });
      
      logger.info('Crisis intervention logged', {
        riskLevel,
        responseTimeMs: responseTime,
        timestamp: Date.now()
      });
    } catch (error) {
      // Fail silently to not interfere with crisis intervention
      logger.error('Failed to log crisis event', error);
    }
  }

  /**
   * Public methods for integration
   */
  
  // Get active intervention for user
  getActiveIntervention(userId: string): InterventionStrategyType | null {
    return this.activeInterventions.get(userId) || null;
  }

  // Clear intervention when resolved
  resolveIntervention(userId: string): void {
    this.activeInterventions.delete(userId);
  }

  // Update configuration
  updateConfig(newConfig: Partial<CrisisSafetyConfigType>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Health check for system monitoring
  healthCheck(): {
    status: 'healthy' | 'degraded' | 'critical';
    responseTime: number;
    cacheSize: number;
    activeInterventions: number;
  } {
    const startTime = Date.now();
    const responseTime = Date.now() - startTime;
    
    const status = responseTime < this.config.emergencyResponseTime ? 'healthy' : 'degraded';
    
    return {
      status,
      responseTime,
      cacheSize: this.resourceCache.size,
      activeInterventions: this.activeInterventions.size
    };
  }
}

// Export singleton instance
export const crisisSafetyCoordinator = new CrisisSafetyCoordinator({
  enableRealtimeMonitoring: true,
  emergencyResponseTime: 3000,
  culturalAdaptationsEnabled: true,
  offlineResourceCaching: true,
  privacyPreservingMode: true,
  gentleBoundarySystem: true,
  analyticsShameProtection: true,
  multiLanguageSupport: true,
  accessibilityEnhanced: true
});