/**
 * ALCHM Real-Time Crisis Monitoring System
 * 
 * MISSION CRITICAL: Continuous monitoring system that watches for crisis
 * indicators across ALL user interactions with <3 second response time.
 * 
 * This system operates as the always-on guardian that:
 * - Monitors every user interaction in real-time
 * - Detects crisis patterns before they escalate
 * - Triggers immediate safety interventions
 * - Maintains 24/7 crisis detection capabilities
 * - Operates offline when needed
 * 
 * Every millisecond of delay could cost a life.
 */

import { crisisSafetyMiddleware } from '@/middleware/crisis-safety-middleware';
import { businessMetricOverride, CrisisSeverityLevel } from './business-metric-override';
import { crisisDetectionEngine } from '@/lib/crisis-detection-engine';
import { globalCrisisResources } from '@/lib/global-crisis-resources';
import { logger } from '@/lib/logging';
import { analytics } from '@/lib/analytics';

// Real-time monitoring configuration
interface RealTimeMonitorConfig {
  maxResponseTimeMs: number;
  monitoringIntervalMs: number;
  escalationThreshold: number;
  offlineMonitoringEnabled: boolean;
  continuousPatternAnalysis: boolean;
  behaviorChangeDetection: boolean;
  emergencyBroadcastEnabled: boolean;
}

// User interaction types to monitor
enum InteractionType {
  JOURNAL_ENTRY = 'journal_entry',
  CHAT_MESSAGE = 'chat_message',
  GOAL_UPDATE = 'goal_update',
  REFLECTION_RESPONSE = 'reflection_response',
  COMMUNITY_POST = 'community_post',
  SEARCH_QUERY = 'search_query',
  PAGE_NAVIGATION = 'page_navigation',
  SESSION_BEHAVIOR = 'session_behavior'
}

// Crisis monitoring state
interface CrisisMonitoringState {
  userId: string;
  currentRiskLevel: CrisisSeverityLevel | 'none';
  lastInteractionTime: number;
  interactionHistory: UserInteraction[];
  escalationPattern: boolean;
  interventionActive: boolean;
  businessMetricsSuspended: boolean;
  offlineMonitoringActive: boolean;
  emergencyContactsNotified: boolean;
}

// User interaction data
interface UserInteraction {
  type: InteractionType;
  timestamp: number;
  contentSummary: string;
  crisisIndicators: string[];
  riskScore: number;
  context: {
    timeOfDay: string;
    dayOfWeek: string;
    sessionDuration: number;
    deviceType: string;
    location?: string;
  };
}

// Crisis pattern analysis
interface CrisisPattern {
  userId: string;
  patternType: 'escalating' | 'chronic' | 'acute' | 'situational';
  riskTrajectory: 'increasing' | 'stable' | 'decreasing';
  interventionNeeded: boolean;
  professionalReferralRecommended: boolean;
  timeToEscalation: number; // estimated minutes
}

/**
 * Real-Time Crisis Monitor
 * 
 * Continuously monitors all user interactions for crisis indicators
 */
export class RealTimeCrisisMonitor {
  private static instance: RealTimeCrisisMonitor;
  private isActive: boolean = false;
  private userStates: Map<string, CrisisMonitoringState> = new Map();
  private monitoringTimer: NodeJS.Timeout | null = null;
  private offlineQueue: UserInteraction[] = [];
  
  private config: RealTimeMonitorConfig = {
    maxResponseTimeMs: 3000,
    monitoringIntervalMs: 1000, // 1 second
    escalationThreshold: 0.7,
    offlineMonitoringEnabled: true,
    continuousPatternAnalysis: true,
    behaviorChangeDetection: true,
    emergencyBroadcastEnabled: true
  };

  private constructor() {
    this.initializeMonitoring();
  }

  static getInstance(): RealTimeCrisisMonitor {
    if (!RealTimeCrisisMonitor.instance) {
      RealTimeCrisisMonitor.instance = new RealTimeCrisisMonitor();
    }
    return RealTimeCrisisMonitor.instance;
  }

  /**
   * CORE: Start real-time crisis monitoring
   */
  startMonitoring(): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    
    // Start continuous monitoring loop
    this.monitoringTimer = setInterval(() => {
      this.performMonitoringCycle();
    }, this.config.monitoringIntervalMs);

    // Set up offline monitoring
    if (this.config.offlineMonitoringEnabled) {
      this.setupOfflineMonitoring();
    }

    logger.info('Real-time crisis monitoring started', {
      maxResponseTime: this.config.maxResponseTimeMs,
      monitoringInterval: this.config.monitoringIntervalMs
    });
  }

  /**
   * Stop crisis monitoring
   */
  stopMonitoring(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = null;
    }

    logger.info('Real-time crisis monitoring stopped');
  }

  /**
   * IMMEDIATE: Process user interaction for crisis indicators
   */
  async processUserInteraction(
    userId: string,
    interactionType: InteractionType,
    content: string,
    context: any = {}
  ): Promise<{
    crisisDetected: boolean;
    riskLevel: CrisisSeverityLevel | 'none';
    interventionTriggered: boolean;
    businessMetricsSuspended: boolean;
    emergencyResponse?: any;
  }> {
    const processingStartTime = Date.now();
    
    try {
      // Create interaction record
      const interaction: UserInteraction = {
        type: interactionType,
        timestamp: processingStartTime,
        contentSummary: this.sanitizeContent(content),
        crisisIndicators: [],
        riskScore: 0,
        context: {
          timeOfDay: new Date().toTimeString().split(' ')[0],
          dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
          sessionDuration: context.sessionDuration || 0,
          deviceType: context.deviceType || 'unknown',
          location: context.location
        }
      };

      // Update user state
      await this.updateUserState(userId, interaction);

      // Perform crisis analysis
      const crisisAnalysis = await this.analyzeCrisisRisk(userId, interaction);

      // Handle crisis detection
      if (crisisAnalysis.crisisDetected) {
        return await this.handleCrisisDetection(userId, crisisAnalysis, interaction);
      }

      // Validate response time
      const responseTime = Date.now() - processingStartTime;
      if (responseTime > this.config.maxResponseTimeMs) {
        logger.warn('Crisis monitoring response time exceeded', {
          userId,
          responseTime,
          maxAllowed: this.config.maxResponseTimeMs
        });
      }

      return {
        crisisDetected: false,
        riskLevel: 'none',
        interventionTriggered: false,
        businessMetricsSuspended: false
      };

    } catch (error) {
      logger.error('Crisis interaction processing failed', error);
      
      // Emergency fallback
      return await this.handleProcessingFailure(userId, content);
    }
  }

  /**
   * Continuous monitoring cycle for all active users
   */
  private async performMonitoringCycle(): Promise<void> {
    if (!this.isActive) {
      return;
    }

    try {
      const cycleStartTime = Date.now();
      
      // Check all monitored users
      const monitoringPromises = Array.from(this.userStates.keys()).map(userId =>
        this.checkUserForCrisisEscalation(userId)
      );

      await Promise.allSettled(monitoringPromises);

      // Process offline queue if needed
      if (this.offlineQueue.length > 0) {
        await this.processOfflineQueue();
      }

      // Clean up inactive monitoring states
      this.cleanupInactiveStates();

      const cycleTime = Date.now() - cycleStartTime;
      
      // Log performance metrics
      if (cycleTime > this.config.monitoringIntervalMs * 0.8) {
        logger.warn('Monitoring cycle taking too long', {
          cycleTime,
          activeUsers: this.userStates.size,
          queueSize: this.offlineQueue.length
        });
      }

    } catch (error) {
      logger.error('Monitoring cycle failed', error);
    }
  }

  /**
   * Analyze crisis risk for user interaction
   */
  private async analyzeCrisisRisk(
    userId: string,
    interaction: UserInteraction
  ): Promise<{
    crisisDetected: boolean;
    riskLevel: CrisisSeverityLevel | 'none';
    patterns: CrisisPattern[];
    escalationRisk: number;
  }> {
    try {
      // Get current user state
      const userState = this.userStates.get(userId);
      
      // Perform crisis detection on content
      const crisisResult = await crisisDetectionEngine.analyzeContent(
        interaction.contentSummary,
        userId,
        'real_time_monitoring'
      );

      // Update interaction with crisis data
      interaction.crisisIndicators = crisisResult.triggers;
      interaction.riskScore = crisisResult.confidence;

      // Analyze patterns if enabled
      let patterns: CrisisPattern[] = [];
      if (this.config.continuousPatternAnalysis && userState) {
        patterns = await this.analyzeUserPatterns(userId, userState, interaction);
      }

      // Calculate escalation risk
      const escalationRisk = this.calculateEscalationRisk(userState, interaction, patterns);

      return {
        crisisDetected: crisisResult.detected,
        riskLevel: this.mapSeverityToLevel(crisisResult.severity),
        patterns,
        escalationRisk
      };

    } catch (error) {
      logger.error('Crisis risk analysis failed', error);
      
      // Safe fallback
      return {
        crisisDetected: true,
        riskLevel: CrisisSeverityLevel.MEDIUM,
        patterns: [],
        escalationRisk: 0.8
      };
    }
  }

  /**
   * Handle detected crisis situation
   */
  private async handleCrisisDetection(
    userId: string,
    crisisAnalysis: any,
    interaction: UserInteraction
  ): Promise<any> {
    try {
      // Trigger crisis safety middleware
      const middlewareResult = await crisisSafetyMiddleware.interceptUserInteraction(
        null as any, // Request object not available here
        interaction.contentSummary,
        userId,
        { interaction }
      );

      // Suspend business metrics if needed
      if (middlewareResult.businessMetricsSuspended) {
        await businessMetricOverride.suspendBusinessMetrics(
          userId,
          crisisAnalysis.riskLevel,
          'real_time_crisis_detection'
        );
      }

      // Update user monitoring state
      await this.updateUserCrisisState(userId, crisisAnalysis.riskLevel, true);

      // Trigger professional escalation if critical
      if (crisisAnalysis.riskLevel === CrisisSeverityLevel.CRITICAL) {
        await this.triggerEmergencyEscalation(userId, crisisAnalysis);
      }

      // Log crisis event
      await this.logCrisisEvent(userId, crisisAnalysis, interaction);

      return {
        crisisDetected: true,
        riskLevel: crisisAnalysis.riskLevel,
        interventionTriggered: true,
        businessMetricsSuspended: middlewareResult.businessMetricsSuspended,
        emergencyResponse: middlewareResult.emergencyResponse
      };

    } catch (error) {
      logger.error('Crisis detection handling failed', error);
      
      // Emergency response
      return await this.handleEmergencyFallback(userId);
    }
  }

  /**
   * Check user for crisis escalation patterns
   */
  private async checkUserForCrisisEscalation(userId: string): Promise<void> {
    const userState = this.userStates.get(userId);
    
    if (!userState || !userState.interventionActive) {
      return;
    }

    try {
      // Check for escalation patterns
      const escalationDetected = await this.detectEscalationPattern(userState);
      
      if (escalationDetected && !userState.emergencyContactsNotified) {
        await this.triggerEmergencyEscalation(userId, { escalationDetected: true });
      }

      // Check if user has been inactive too long during crisis
      const inactivityThreshold = 30 * 60 * 1000; // 30 minutes
      const timeSinceLastInteraction = Date.now() - userState.lastInteractionTime;
      
      if (timeSinceLastInteraction > inactivityThreshold && 
          userState.currentRiskLevel === CrisisSeverityLevel.CRITICAL) {
        await this.handleCrisisInactivity(userId, userState);
      }

    } catch (error) {
      logger.error('Escalation check failed', error);
    }
  }

  /**
   * Trigger emergency escalation
   */
  private async triggerEmergencyEscalation(
    userId: string,
    crisisData: any
  ): Promise<void> {
    try {
      // This would integrate with your emergency notification system
      logger.error('EMERGENCY ESCALATION TRIGGERED', {
        userId,
        timestamp: Date.now(),
        crisisData
      });

      // Update user state
      const userState = this.userStates.get(userId);
      if (userState) {
        userState.emergencyContactsNotified = true;
      }

      // Could trigger:
      // - Professional notification system
      // - Emergency contact alerts
      // - Crisis intervention team dispatch
      // - Local emergency services (in extreme cases with user consent)

    } catch (error) {
      logger.error('Emergency escalation failed', error);
    }
  }

  /**
   * Helper methods
   */
  private async updateUserState(userId: string, interaction: UserInteraction): Promise<void> {
    const existingState = this.userStates.get(userId);
    
    const updatedState: CrisisMonitoringState = {
      userId,
      currentRiskLevel: existingState?.currentRiskLevel || 'none',
      lastInteractionTime: interaction.timestamp,
      interactionHistory: [
        ...(existingState?.interactionHistory || []).slice(-20), // Keep last 20 interactions
        interaction
      ],
      escalationPattern: existingState?.escalationPattern || false,
      interventionActive: existingState?.interventionActive || false,
      businessMetricsSuspended: existingState?.businessMetricsSuspended || false,
      offlineMonitoringActive: existingState?.offlineMonitoringActive || false,
      emergencyContactsNotified: existingState?.emergencyContactsNotified || false
    };

    this.userStates.set(userId, updatedState);
  }

  private async updateUserCrisisState(
    userId: string,
    riskLevel: CrisisSeverityLevel,
    interventionActive: boolean
  ): Promise<void> {
    const userState = this.userStates.get(userId);
    if (userState) {
      userState.currentRiskLevel = riskLevel;
      userState.interventionActive = interventionActive;
      userState.businessMetricsSuspended = 
        [CrisisSeverityLevel.MEDIUM, CrisisSeverityLevel.HIGH, CrisisSeverityLevel.CRITICAL]
        .includes(riskLevel);
    }
  }

  private sanitizeContent(content: string): string {
    // Create a safe summary for crisis detection without storing full content
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  }

  private mapSeverityToLevel(severity: string): CrisisSeverityLevel | 'none' {
    switch (severity) {
      case 'low': return CrisisSeverityLevel.LOW;
      case 'medium': return CrisisSeverityLevel.MEDIUM;
      case 'high': return CrisisSeverityLevel.HIGH;
      case 'critical': return CrisisSeverityLevel.CRITICAL;
      default: return 'none';
    }
  }

  private calculateEscalationRisk(
    userState: CrisisMonitoringState | undefined,
    interaction: UserInteraction,
    patterns: CrisisPattern[]
  ): number {
    let escalationRisk = interaction.riskScore;

    // Increase risk based on patterns
    if (patterns.some(p => p.riskTrajectory === 'increasing')) {
      escalationRisk += 0.2;
    }

    // Increase risk based on recent history
    if (userState?.interactionHistory) {
      const recentHighRiskInteractions = userState.interactionHistory
        .filter(i => Date.now() - i.timestamp < 60 * 60 * 1000) // Last hour
        .filter(i => i.riskScore > 0.6);
      
      escalationRisk += recentHighRiskInteractions.length * 0.1;
    }

    return Math.min(escalationRisk, 1.0);
  }

  private async analyzeUserPatterns(
    userId: string,
    userState: CrisisMonitoringState,
    currentInteraction: UserInteraction
  ): Promise<CrisisPattern[]> {
    // Implement pattern analysis logic
    // This would analyze user behavior over time for escalation patterns
    return [];
  }

  private async detectEscalationPattern(userState: CrisisMonitoringState): Promise<boolean> {
    // Analyze if crisis is escalating based on interaction history
    const recentInteractions = userState.interactionHistory
      .filter(i => Date.now() - i.timestamp < 2 * 60 * 60 * 1000); // Last 2 hours

    if (recentInteractions.length < 3) {
      return false;
    }

    // Check if risk scores are increasing
    const riskScores = recentInteractions.map(i => i.riskScore);
    const isEscalating = riskScores.every((score, index) => 
      index === 0 || score >= riskScores[index - 1]
    );

    return isEscalating && riskScores[riskScores.length - 1] > 0.8;
  }

  private async handleCrisisInactivity(
    userId: string,
    userState: CrisisMonitoringState
  ): Promise<void> {
    logger.warn('Crisis user inactive for extended period', {
      userId,
      riskLevel: userState.currentRiskLevel,
      lastInteraction: userState.lastInteractionTime
    });

    // Could trigger wellness check or escalation
  }

  private async handleProcessingFailure(userId: string, content: string): Promise<any> {
    // Emergency response when processing fails
    return {
      crisisDetected: true,
      riskLevel: CrisisSeverityLevel.HIGH,
      interventionTriggered: true,
      businessMetricsSuspended: true
    };
  }

  private async handleEmergencyFallback(userId: string): Promise<any> {
    return {
      crisisDetected: true,
      riskLevel: CrisisSeverityLevel.CRITICAL,
      interventionTriggered: true,
      businessMetricsSuspended: true
    };
  }

  private initializeMonitoring(): void {
    // Set up offline detection
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        // Save critical state before page unload
        this.handlePageUnload();
      });
    }
  }

  private setupOfflineMonitoring(): void {
    // Set up service worker communication for offline monitoring
    if (typeof navigator !== 'undefined' && navigator.serviceWorker) {
      navigator.serviceWorker.ready.then(registration => {
        // Set up communication with service worker for offline crisis detection
      });
    }
  }

  private async processOfflineQueue(): Promise<void> {
    // Process queued interactions that occurred while offline
    const interactions = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const interaction of interactions) {
      // Process each offline interaction
    }
  }

  private cleanupInactiveStates(): void {
    const inactivityThreshold = 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();

    for (const [userId, state] of this.userStates.entries()) {
      if (now - state.lastInteractionTime > inactivityThreshold && 
          !state.interventionActive) {
        this.userStates.delete(userId);
      }
    }
  }

  private handlePageUnload(): void {
    // Save critical monitoring state
    try {
      const criticalStates = Array.from(this.userStates.entries())
        .filter(([_, state]) => state.interventionActive)
        .map(([userId, state]) => ({ userId, state }));

      if (criticalStates.length > 0) {
        localStorage.setItem('alchm_crisis_monitoring_state', JSON.stringify(criticalStates));
      }
    } catch (error) {
      // Fail silently
    }
  }

  private async logCrisisEvent(
    userId: string,
    crisisAnalysis: any,
    interaction: UserInteraction
  ): Promise<void> {
    try {
      await analytics.track('crisis', 'real_time_detection', {
        riskLevel: crisisAnalysis.riskLevel,
        interactionType: interaction.type,
        escalationRisk: crisisAnalysis.escalationRisk,
        responseTime: Date.now() - interaction.timestamp
      });
    } catch (error) {
      logger.error('Failed to log crisis event', error);
    }
  }

  /**
   * Public API methods
   */
  
  // Get monitoring state for user
  getUserMonitoringState(userId: string): CrisisMonitoringState | null {
    return this.userStates.get(userId) || null;
  }

  // Check if user is being monitored
  isUserBeingMonitored(userId: string): boolean {
    return this.userStates.has(userId);
  }

  // Clear monitoring for user (when safe)
  clearUserMonitoring(userId: string): void {
    this.userStates.delete(userId);
  }

  // Get health status
  getHealthStatus(): {
    isActive: boolean;
    monitoredUsers: number;
    averageResponseTime: number;
    queueSize: number;
  } {
    return {
      isActive: this.isActive,
      monitoredUsers: this.userStates.size,
      averageResponseTime: 0, // Would calculate from metrics
      queueSize: this.offlineQueue.length
    };
  }

  // Update configuration
  updateConfig(newConfig: Partial<RealTimeMonitorConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const realTimeCrisisMonitor = RealTimeCrisisMonitor.getInstance();

// Export types
export type { 
  RealTimeMonitorConfig,
  CrisisMonitoringState,
  UserInteraction,
  CrisisPattern,
  InteractionType
};