'use client';

// ALCHM IKIGAI Bootcamp Management Utilities
// Session progression, state management, and analytics

import React from 'react';
import { 
  IKIGAIBootcamp, 
  IKIGAISession, 
  IKIGAIProgressMetrics,
  TraumaInformedNote,
  IKIGAIAnalytics,
  EngagementMetrics,
  OutcomeMetrics
} from '@/types/ikigai-schema';
import { CulturalContext } from '@/types/pathways-schema';

export class IKIGAIBootcampManager {
  private bootcamp: IKIGAIBootcamp;
  
  constructor(bootcamp: IKIGAIBootcamp) {
    this.bootcamp = bootcamp;
  }

  // Initialize a new bootcamp for a user
  static createNewBootcamp(
    userId: string, 
    culturalContext: CulturalContext,
    estimatedWeeks: number = 6
  ): IKIGAIBootcamp {
    const startDate = new Date();
    const expectedCompletion = new Date(startDate.getTime() + (estimatedWeeks * 7 * 24 * 60 * 60 * 1000));
    
    const sessions = this.generateSessionSequence(userId, culturalContext);
    
    return {
      id: `bootcamp_${userId}_${startDate.getTime()}`,
      userId,
      startedAt: startDate,
      expectedCompletionDate: expectedCompletion,
      sessions,
      overallProgress: 0,
      masterMap: this.initializeEmptyAIMap(),
      personalGrowthPlan: this.initializeGrowthPlan(),
      culturalIntegrationPlan: this.initializeCulturalPlan(culturalContext),
      isActive: true
    };
  }

  // Generate the standard 5-session sequence
  private static generateSessionSequence(
    userId: string, 
    culturalContext: CulturalContext
  ): IKIGAISession[] {
    const sessionTypes: IKIGAISession['sessionType'][] = [
      'discovery',
      'deep_dive', 
      'synthesis',
      'action_planning',
      'reflection_review'
    ];

    return sessionTypes.map((sessionType, index) => ({
      id: `session_${userId}_${index + 1}`,
      userId,
      sessionNumber: index + 1,
      sessionType,
      responses: this.initializeEmptyResponses(),
      AIMap: this.initializeEmptyAIMap(),
      alignmentScore: 0,
      reflectionsLinked: [],
      culturalContext: this.adaptCulturalContextForSession(culturalContext, sessionType),
      traumaInformedNotes: [],
      progressMetrics: this.initializeProgressMetrics(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: index === 0, // Only first session is initially active
      nextSessionSuggested: index < sessionTypes.length - 1 ? 
        new Date(Date.now() + ((index + 1) * 7 * 24 * 60 * 60 * 1000)) : undefined
    }));
  }

  // Session transition logic
  canProgressToSession(sessionIndex: number): { canProgress: boolean; reasons: string[] } {
    if (sessionIndex <= 0) return { canProgress: true, reasons: [] };
    
    const previousSession = this.bootcamp.sessions[sessionIndex - 1];
    const reasons: string[] = [];
    
    // Check completion
    if (!previousSession.completedAt) {
      reasons.push('Previous session must be completed');
    }
    
    // Check minimum progress
    if (previousSession.progressMetrics.sessionProgress < 0.8) {
      reasons.push('Previous session needs at least 80% completion');
    }
    
    // Check confidence threshold
    if (previousSession.progressMetrics.confidenceIncrease < 0.5) {
      reasons.push('Need higher confidence levels before proceeding');
    }
    
    // Check trauma-informed considerations
    const criticalNotes = previousSession.traumaInformedNotes.filter(
      note => note.severity === 'critical' && note.actionRequired
    );
    if (criticalNotes.length > 0) {
      reasons.push('Critical trauma-informed concerns need addressing');
    }
    
    return {
      canProgress: reasons.length === 0,
      reasons
    };
  }

  // Update session progress with intelligent metrics
  updateSessionProgress(
    sessionId: string, 
    updates: Partial<IKIGAIProgressMetrics>,
    engagementData?: {
      timeSpent?: number;
      interactionCount?: number;
      aiUtilizationChange?: number;
    }
  ): IKIGAISession | null {
    const sessionIndex = this.bootcamp.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return null;
    
    const session = this.bootcamp.sessions[sessionIndex];
    const previousMetrics = session.progressMetrics;
    
    // Calculate intelligent progress updates
    const updatedMetrics: IKIGAIProgressMetrics = {
      ...previousMetrics,
      ...updates,
      
      // Auto-calculate engagement based on interaction patterns
      engagementScore: this.calculateEngagementScore(
        previousMetrics,
        engagementData,
        updates.sessionProgress || previousMetrics.sessionProgress
      ),
      
      // Cultural resonance based on cultural context usage
      culturalResonance: this.calculateCulturalResonance(
        session.culturalContext,
        updates.reflectionDepth || previousMetrics.reflectionDepth
      ),
      
      // AI utilization tracking
      aiUtilization: engagementData?.aiUtilizationChange !== undefined ?
        Math.max(0, Math.min(1, previousMetrics.aiUtilization + engagementData.aiUtilizationChange)) :
        previousMetrics.aiUtilization
    };

    // Update session
    const updatedSession: IKIGAISession = {
      ...session,
      progressMetrics: updatedMetrics,
      updatedAt: new Date()
    };

    this.bootcamp.sessions[sessionIndex] = updatedSession;
    
    // Update overall bootcamp progress
    this.updateOverallProgress();
    
    return updatedSession;
  }

  // Trauma-informed safety monitoring
  addTraumaInformedNote(
    sessionId: string, 
    note: Omit<TraumaInformedNote, 'culturalConsiderations'>,
    culturalContext: CulturalContext
  ): void {
    const sessionIndex = this.bootcamp.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return;
    
    const culturalConsiderations = this.generateCulturalConsiderations(
      note.type, 
      culturalContext
    );
    
    const fullNote: TraumaInformedNote = {
      ...note,
      culturalConsiderations
    };
    
    this.bootcamp.sessions[sessionIndex].traumaInformedNotes.push(fullNote);
  }

  // Analytics tracking
  trackAnalyticsEvent(
    sessionId: string,
    eventType: IKIGAIAnalytics['eventType'],
    data: Record<string, any>
  ): IKIGAIAnalytics {
    const session = this.bootcamp.sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    const analytics: IKIGAIAnalytics = {
      sessionId,
      userId: this.bootcamp.userId,
      timestamp: new Date(),
      eventType,
      data,
      aiProviderUsed: data.aiProvider || 'gemini',
      culturalContext: session.culturalContext.area ? [session.culturalContext.area] : [],
      engagementMetrics: this.calculateEngagementMetrics(session),
      outcomeMetrics: this.calculateOutcomeMetrics(session)
    };

    return analytics;
  }

  // Session completion with validation
  completeSession(sessionId: string): { success: boolean; message: string; nextSession?: IKIGAISession } {
    const sessionIndex = this.bootcamp.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      return { success: false, message: 'Session not found' };
    }

    const session = this.bootcamp.sessions[sessionIndex];
    
    // Validate completion criteria
    const validationResult = this.validateSessionCompletion(session);
    if (!validationResult.isValid) {
      return { 
        success: false, 
        message: `Cannot complete session: ${validationResult.reasons.join(', ')}` 
      };
    }

    // Complete current session
    this.bootcamp.sessions[sessionIndex] = {
      ...session,
      completedAt: new Date(),
      isActive: false,
      progressMetrics: {
        ...session.progressMetrics,
        sessionProgress: 1.0
      }
    };

    // Activate next session if available
    const nextSessionIndex = sessionIndex + 1;
    if (nextSessionIndex < this.bootcamp.sessions.length) {
      const nextSession = this.bootcamp.sessions[nextSessionIndex];
      this.bootcamp.sessions[nextSessionIndex] = {
        ...nextSession,
        isActive: true,
        updatedAt: new Date()
      };

      return {
        success: true,
        message: 'Session completed successfully',
        nextSession: this.bootcamp.sessions[nextSessionIndex]
      };
    }

    // Bootcamp completion
    this.bootcamp.actualCompletionDate = new Date();
    this.bootcamp.isActive = false;
    this.bootcamp.overallProgress = 1.0;

    return {
      success: true,
      message: 'Bootcamp completed successfully!'
    };
  }

  // Pause/resume functionality
  pauseBootcamp(reason?: string): void {
    this.bootcamp.isActive = false;
    this.bootcamp.pausedAt = new Date();
    
    // Add trauma-informed note about pausing
    const activeSession = this.bootcamp.sessions.find(s => s.isActive);
    if (activeSession) {
      this.addTraumaInformedNote(activeSession.id, {
        type: 'safety_check',
        content: `Bootcamp paused. ${reason || 'You can resume whenever you feel ready.'}`,
        severity: 'info',
        actionRequired: false,
        supportResources: ['Resume option available anytime'],
        followUpRequired: false
      }, activeSession.culturalContext);
    }
  }

  resumeBootcamp(): void {
    this.bootcamp.isActive = true;
    this.bootcamp.pausedAt = undefined;
  }

  // Private helper methods
  private static initializeEmptyResponses() {
    return {
      passions: [],
      skills: [],
      values: [],
      opportunities: [],
      intersections: {
        passionSkill: [],
        passionValue: [],
        passionOpportunity: [],
        skillValue: [],
        skillOpportunity: [],
        valueOpportunity: [],
        centralIntersection: []
      },
      confidenceScores: {
        passionsConfidence: 0,
        skillsConfidence: 0,
        valuesConfidence: 0,
        opportunitiesConfidence: 0,
        overallConfidence: 0,
        readinessForAction: 0
      },
      emotionalResonance: {
        dominantEmotions: [],
        emotionalIntensity: 0,
        emotionalClarity: 0,
        emotionalConflicts: [],
        emotionalSupports: [],
        emotionalGrowthAreas: [],
        culturalEmotionalContext: []
      }
    };
  }

  private static initializeEmptyAIMap() {
    return {
      clusters: [],
      synthesisText: '',
      recommendedActions: [],
      visualElements: [],
      connectionStrengths: [],
      insights: [],
      personalityAlignment: {
        traits: [],
        alignmentScore: 0,
        strengths: [],
        growthAreas: [],
        workingStyles: [],
        communicationPreferences: [],
        culturalPersonalityFactors: []
      },
      culturalAlignment: {
        overallAlignment: 0,
        valueAlignment: 0,
        opportunityAlignment: 0,
        expressionAlignment: 0,
        familyAlignment: 0,
        communityAlignment: 0,
        gaps: [],
        bridges: [],
        adaptations: []
      },
      developmentTrajectory: {
        currentPhase: 'discovery',
        nextPhase: 'exploration',
        trajectoryPath: [],
        timeHorizon: 'medium_term',
        keyTransitions: [],
        milestones: [],
        potentialChallenges: [],
        successFactors: []
      }
    };
  }

  private static initializeProgressMetrics(): IKIGAIProgressMetrics {
    return {
      sessionProgress: 0,
      overallProgress: 0,
      clarityIncrease: 0,
      confidenceIncrease: 0,
      actionTaken: 0,
      engagementScore: 0.5,
      culturalResonance: 0.5,
      timeSpent: 0,
      reflectionDepth: 0,
      aiUtilization: 0
    };
  }

  private calculateEngagementScore(
    previousMetrics: IKIGAIProgressMetrics,
    engagementData?: any,
    currentProgress: number = 0
  ): number {
    let baseScore = previousMetrics.engagementScore;
    
    // Increase engagement based on time spent and interactions
    if (engagementData?.timeSpent > 0) {
      const timeBonus = Math.min(0.1, engagementData.timeSpent / 600); // Max bonus at 10 min
      baseScore += timeBonus;
    }
    
    if (engagementData?.interactionCount > 0) {
      const interactionBonus = Math.min(0.1, engagementData.interactionCount / 50);
      baseScore += interactionBonus;
    }
    
    // Progress momentum bonus
    if (currentProgress > previousMetrics.sessionProgress) {
      baseScore += 0.05;
    }
    
    return Math.max(0, Math.min(1, baseScore));
  }

  private calculateCulturalResonance(
    culturalContext: any,
    reflectionDepth: number
  ): number {
    let resonance = 0.5; // Base resonance
    
    // Higher resonance with deeper reflection
    resonance += reflectionDepth * 0.3;
    
    // Cultural context engagement bonus
    if (culturalContext.area && culturalContext.culturalResonance > 0.7) {
      resonance += 0.2;
    }
    
    return Math.max(0, Math.min(1, resonance));
  }

  private validateSessionCompletion(session: IKIGAISession): { isValid: boolean; reasons: string[] } {
    const reasons: string[] = [];
    
    // Check minimum progress
    if (session.progressMetrics.sessionProgress < 0.8) {
      reasons.push('Session progress below 80%');
    }
    
    // Check critical trauma notes
    const criticalNotes = session.traumaInformedNotes.filter(
      note => note.severity === 'critical' && note.actionRequired
    );
    if (criticalNotes.length > 0) {
      reasons.push('Critical trauma-informed concerns unresolved');
    }
    
    // Session-specific validations
    switch (session.sessionType) {
      case 'discovery':
        const totalResponses = Object.values(session.responses).flat().length;
        if (totalResponses < 8) {
          reasons.push('Need at least 8 total responses across all quadrants');
        }
        break;
        
      case 'synthesis':
        if (session.AIMap.clusters.length === 0) {
          reasons.push('AI analysis must be completed');
        }
        break;
        
      case 'action_planning':
        if (session.AIMap.recommendedActions.length === 0) {
          reasons.push('At least one action plan must be created');
        }
        break;
    }
    
    return {
      isValid: reasons.length === 0,
      reasons
    };
  }

  private generateCulturalConsiderations(
    noteType: TraumaInformedNote['type'],
    culturalContext: CulturalContext
  ): string[] {
    const considerations: string[] = [];
    
    // Add cultural context-aware considerations
    if (culturalContext.valueSystem.includes('collectivist')) {
      considerations.push('Consider community and family perspectives');
    }
    
    if (culturalContext.valueSystem.includes('family_centered')) {
      considerations.push('Honor family traditions and expectations');
    }
    
    if (noteType === 'cultural_safety') {
      considerations.push('Cultural identity and expression are valued');
      considerations.push('No judgment on cultural practices');
    }
    
    return considerations;
  }

  private calculateEngagementMetrics(session: IKIGAISession): EngagementMetrics {
    return {
      timeSpent: session.progressMetrics.timeSpent,
      interactionCount: Object.values(session.responses).flat().length,
      reflectionDepth: session.progressMetrics.reflectionDepth,
      aiUtilization: session.progressMetrics.aiUtilization,
      completionRate: session.progressMetrics.sessionProgress,
      returnRate: session.isActive ? 1 : 0
    };
  }

  private calculateOutcomeMetrics(session: IKIGAISession): OutcomeMetrics {
    return {
      clarityIncrease: session.progressMetrics.clarityIncrease,
      confidenceIncrease: session.progressMetrics.confidenceIncrease,
      actionPlanning: session.progressMetrics.actionTaken,
      culturalAlignment: session.progressMetrics.culturalResonance,
      goalAlignment: session.alignmentScore,
      wellbeingImpact: (session.progressMetrics.clarityIncrease + session.progressMetrics.confidenceIncrease) / 2
    };
  }

  private updateOverallProgress(): void {
    const totalSessions = this.bootcamp.sessions.length;
    const completedSessions = this.bootcamp.sessions.filter(s => s.completedAt).length;
    const activeSession = this.bootcamp.sessions.find(s => s.isActive);
    const activeProgress = activeSession?.progressMetrics.sessionProgress || 0;
    
    this.bootcamp.overallProgress = (completedSessions + activeProgress) / totalSessions;
  }

  private static initializeGrowthPlan() {
    return {
      vision: '',
      coreValues: [],
      keyStrengths: [],
      developmentAreas: [],
      shortTermGoals: [],
      mediumTermGoals: [],
      longTermVision: '',
      actionPlan: {
        immediateSteps: [],
        shortTermGoals: [],
        longTermVision: '',
        milestones: [],
        resources: [],
        support: [],
        metrics: []
      },
      supportSystem: {
        mentors: [],
        peers: [],
        family: [],
        community: [],
        professional: [],
        cultural: []
      },
      measurementPlan: {
        metrics: [],
        checkInFrequency: 'weekly',
        assessmentMethods: [],
        feedbackSources: [],
        adjustmentTriggers: [],
        culturalMeasurements: []
      }
    };
  }

  private static initializeCulturalPlan(culturalContext: CulturalContext) {
    return {
      culturalStrengths: [],
      culturalChallenges: [],
      bridgingStrategies: [],
      communityEngagement: [],
      culturalMentorship: [],
      traditionIntegration: [],
      modernAdaptation: []
    };
  }

  private static adaptCulturalContextForSession(
    baseContext: CulturalContext,
    sessionType: IKIGAISession['sessionType']
  ) {
    return {
      area: sessionType,
      originalElement: `${sessionType}_session`,
      adaptedElement: `culturally_adapted_${sessionType}`,
      rationale: `Adapted for ${sessionType} session with cultural sensitivity`,
      culturalResonance: 0.8,
      effectiveness: 0.8
    };
  }

  // Getters
  getBootcamp(): IKIGAIBootcamp {
    return this.bootcamp;
  }

  getCurrentSession(): IKIGAISession | null {
    return this.bootcamp.sessions.find(s => s.isActive) || null;
  }

  getSessionByIndex(index: number): IKIGAISession | null {
    return this.bootcamp.sessions[index] || null;
  }
}

// React Hook for bootcamp management
export const useIKIGAIBootcamp = (initialBootcamp: IKIGAIBootcamp) => {
  const [bootcampManager] = React.useState(() => new IKIGAIBootcampManager(initialBootcamp));
  const [bootcamp, setBootcamp] = React.useState(initialBootcamp);

  const updateBootcamp = React.useCallback((updatedBootcamp: IKIGAIBootcamp) => {
    setBootcamp(updatedBootcamp);
  }, []);

  const updateSessionProgress = React.useCallback((
    sessionId: string,
    updates: Partial<IKIGAIProgressMetrics>,
    engagementData?: any
  ) => {
    const updatedSession = bootcampManager.updateSessionProgress(sessionId, updates, engagementData);
    if (updatedSession) {
      setBootcamp(bootcampManager.getBootcamp());
    }
    return updatedSession;
  }, [bootcampManager]);

  const completeSession = React.useCallback((sessionId: string) => {
    const result = bootcampManager.completeSession(sessionId);
    setBootcamp(bootcampManager.getBootcamp());
    return result;
  }, [bootcampManager]);

  return {
    bootcamp,
    bootcampManager,
    updateBootcamp,
    updateSessionProgress,
    completeSession,
    getCurrentSession: () => bootcampManager.getCurrentSession(),
    canProgressToSession: (index: number) => bootcampManager.canProgressToSession(index)
  };
};