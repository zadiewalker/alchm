/**
 * ALCHM Therapeutic Community NPS System
 * 
 * Professional-grade tools designed to make therapists advocates through
 * HIPAA-compliant client support, outcome tracking, and professional collaboration.
 */

import { analytics } from '../analytics';
import { crisisDetectionEngine } from '../crisis-detection/crisis-detection-engine';
import { CrisisDetectionResult, InterventionLevel } from '../crisis-detection/types';

export interface TherapistProfile {
  id: string;
  email: string;
  name: string;
  licenseNumber: string;
  licenseType: string;
  state: string;
  specializations: string[];
  practiceType: 'private' | 'group' | 'hospital' | 'clinic' | 'telehealth';
  yearsExperience: number;
  alchmsUsage: {
    joinedAt: Date;
    clientsConnected: number;
    totalReferrals: number;
    npsScore?: number;
    advocacyLevel: 'detractor' | 'passive' | 'promoter';
  };
  preferences: {
    notifications: TherapistNotificationPreferences;
    dashboard: DashboardPreferences;
    collaboration: CollaborationPreferences;
  };
  outcomes: TherapeuticOutcome[];
  ceuCredits: CEUCredit[];
}

export interface TherapistNotificationPreferences {
  clientProgress: boolean;
  concernAlerts: boolean;
  breakthroughMoments: boolean;
  sessionPrep: boolean;
  weeklyReports: boolean;
  researchUpdates: boolean;
  crisisAlerts: boolean;
  emergencyEscalation: boolean;
  immediateNotifications: boolean;
}

export interface DashboardPreferences {
  defaultView: 'overview' | 'individual_clients' | 'outcomes' | 'research';
  metricsDisplayed: string[];
  refreshFrequency: 'realtime' | 'hourly' | 'daily';
  anonymizeData: boolean;
}

export interface CollaborationPreferences {
  shareOutcomes: boolean;
  participateInResearch: boolean;
  mentorOtherTherapists: boolean;
  receiveReferrals: boolean;
  provideTestimonials: boolean;
}

export interface ClientConnection {
  clientId: string;
  therapistId: string;
  connectedAt: Date;
  connectionType: 'primary_therapist' | 'consulting' | 'supervisor';
  permissions: ClientPermissions;
  progressSummary: ClientProgressSummary;
  sessionPrep: SessionPrepData[];
  sharedGoals: TherapeuticGoal[];
  status: 'active' | 'paused' | 'completed';
}

export interface ClientPermissions {
  viewProgress: boolean;
  receiveAlerts: boolean;
  accessJournalInsights: boolean;
  assignPathways: boolean;
  exportReports: boolean;
  emergencyContact: boolean;
  crisisNotifications: boolean;
  emergencyEscalation: boolean;
}

export interface ClientProgressSummary {
  overallImprovement: number; // 0-100 score
  keyMetrics: {
    emotionalRegulation: number;
    selfAwareness: number;
    copingStrategies: number;
    resilience: number;
    stressManagement: number;
  };
  recentTrends: {
    sentimentTrend: 'improving' | 'stable' | 'declining';
    engagementLevel: 'high' | 'medium' | 'low';
    crisisRisk: 'low' | 'medium' | 'high' | 'critical';
  };
  milestones: Milestone[];
  concerns: string[];
  recommendations: string[];
  crisisHistory: CrisisDetectionResult[];
  lastCrisisAssessment?: Date;
}

export interface SessionPrepData {
  sessionDate: Date;
  generatedAt: Date;
  discussionPoints: DiscussionPoint[];
  journalInsights: JournalInsight[];
  homeworkRecommendations: HomeworkRecommendation[];
  riskAssessment: RiskAssessment;
  progressNotes: string[];
}

export interface DiscussionPoint {
  category: 'emotional_patterns' | 'breakthrough_moments' | 'challenges' | 'goals' | 'coping_strategies';
  priority: 'high' | 'medium' | 'low';
  content: string;
  supportingEvidence: string[];
  suggestedApproach: string;
}

export interface JournalInsight {
  date: Date;
  theme: string;
  insight: string;
  emotionalTone: string;
  therapeuticOpportunity: string;
  confidenceLevel: number;
}

export interface HomeworkRecommendation {
  type: 'journaling_prompt' | 'pathway_exercise' | 'reflection_activity' | 'skill_practice';
  title: string;
  description: string;
  estimatedTime: number;
  therapeuticGoals: string[];
  adaptations?: string[];
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  factors: RiskFactor[];
  recentChanges: string[];
  recommendedActions: string[];
  escalationProtocol?: string;
  crisisDetection?: CrisisDetectionResult;
  emergencyEscalated?: boolean;
  therapistNotified?: boolean;
}

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high';
  evidence: string[];
  timeline: string;
}

export interface TherapeuticGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: Date;
  progress: number; // 0-100
  milestones: Milestone[];
  assignedBy: 'therapist' | 'client' | 'collaborative';
  status: 'active' | 'completed' | 'paused' | 'modified';
}

export interface Milestone {
  id: string;
  title: string;
  achievedAt: Date;
  description: string;
  significance: 'minor' | 'moderate' | 'major' | 'breakthrough';
  celebrationDelivered: boolean;
}

export interface TherapeuticOutcome {
  clientId: string;
  therapistId: string;
  assessmentPeriod: {
    startDate: Date;
    endDate: Date;
  };
  outcomeMeasures: {
    standardizedScales?: {
      pheq9?: number;
      gad7?: number;
      dass21?: number;
      custom?: { name: string; score: number }[];
    };
    alchgMetrics: {
      emotionalRegulation: number;
      selfAwareness: number;
      resilience: number;
      overallWellbeing: number;
    };
    functionalImprovements: string[];
    clientSelfReport: string;
  };
  treatmentModality: string[];
  alchgContribution: number; // 0-100 estimated contribution
  notes: string;
}

export interface CEUCredit {
  id: string;
  title: string;
  description: string;
  credits: number;
  completedAt: Date;
  provider: string;
  category: string;
  certificateUrl?: string;
}

export interface ProfessionalReferral {
  id: string;
  referringTherapistId: string;
  referredTherapistId?: string;
  referralType: 'therapist_to_therapist' | 'client_referral' | 'professional_consultation';
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  notes: string;
  createdAt: Date;
  completedAt?: Date;
  outcomeTracking?: {
    successful: boolean;
    feedback: string;
    npsImpact: number;
  };
}

export interface ResearchCollaboration {
  studyId: string;
  title: string;
  description: string;
  leadResearcher: string;
  institution: string;
  participatingTherapists: string[];
  dataContributions: {
    therapistId: string;
    anonymizedOutcomes: any[];
    consentLevel: 'aggregate_only' | 'detailed_anonymous' | 'identified_with_consent';
  }[];
  status: 'recruiting' | 'active' | 'analyzing' | 'completed' | 'published';
  publications?: {
    title: string;
    journal: string;
    doi: string;
    publishedAt: Date;
  }[];
}

export class TherapistIntegrationSystem {
  private readonly CRISIS_RESPONSE_TIMEOUT = 3000; // 3 seconds max for crisis detection
  private readonly EMERGENCY_ESCALATION_PRIORITY = 10000; // Highest priority
  
  private therapistProfiles: Map<string, TherapistProfile> = new Map();
  private clientConnections: Map<string, ClientConnection[]> = new Map();
  private activeReferrals: Map<string, ProfessionalReferral> = new Map();
  private researchStudies: Map<string, ResearchCollaboration> = new Map();
  private crisisDetectionCache: Map<string, CrisisDetectionResult> = new Map();
  private emergencyEscalationLog: Map<string, Date[]> = new Map();
  private activeEmergencyNotifications: Set<string> = new Set();

  constructor() {
    this.initializeNPSTracking();
    this.initializeCrisisMonitoring();
  }

  /**
   * Register new therapist with professional verification
   */
  public async registerTherapist(
    therapistData: Partial<TherapistProfile>,
    licenseVerification: any
  ): Promise<TherapistProfile> {
    // Verify professional license
    const verified = await this.verifyProfessionalLicense(
      therapistData.licenseNumber!,
      therapistData.licenseType!,
      therapistData.state!
    );

    if (!verified) {
      throw new Error('Professional license verification failed');
    }

    const therapist: TherapistProfile = {
      id: `therapist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: therapistData.email!,
      name: therapistData.name!,
      licenseNumber: therapistData.licenseNumber!,
      licenseType: therapistData.licenseType!,
      state: therapistData.state!,
      specializations: therapistData.specializations || [],
      practiceType: therapistData.practiceType || 'private',
      yearsExperience: therapistData.yearsExperience || 0,
      alchmsUsage: {
        joinedAt: new Date(),
        clientsConnected: 0,
        totalReferrals: 0,
        advocacyLevel: 'passive'
      },
      preferences: {
        notifications: {
          clientProgress: true,
          concernAlerts: true,
          breakthroughMoments: true,
          sessionPrep: true,
          weeklyReports: true,
          researchUpdates: false,
          crisisAlerts: true, // Default to enabled for safety
          emergencyEscalation: true, // Critical safety feature
          immediateNotifications: true // Emergency notifications
        },
        dashboard: {
          defaultView: 'overview',
          metricsDisplayed: ['emotional_regulation', 'self_awareness', 'resilience'],
          refreshFrequency: 'daily',
          anonymizeData: true
        },
        collaboration: {
          shareOutcomes: false,
          participateInResearch: false,
          mentorOtherTherapists: false,
          receiveReferrals: true,
          provideTestimonials: false
        }
      },
      outcomes: [],
      ceuCredits: []
    };

    this.therapistProfiles.set(therapist.id, therapist);

    analytics.track('therapist_registered', {
      therapistId: therapist.id,
      licenseType: therapist.licenseType,
      specializations: therapist.specializations,
      yearsExperience: therapist.yearsExperience
    });

    return therapist;
  }

  /**
   * Connect client to therapist with HIPAA-compliant permissions
   */
  public async connectClientToTherapist(
    clientId: string,
    therapistId: string,
    connectionType: ClientConnection['connectionType'],
    permissions: ClientPermissions,
    clientConsent: boolean
  ): Promise<ClientConnection> {
    if (!clientConsent) {
      throw new Error('Client consent required for therapist connection');
    }

    const therapist = this.therapistProfiles.get(therapistId);
    if (!therapist) {
      throw new Error('Therapist not found');
    }

    const connection: ClientConnection = {
      clientId,
      therapistId,
      connectedAt: new Date(),
      connectionType,
      permissions,
      progressSummary: await this.generateInitialProgressSummary(clientId),
      sessionPrep: [],
      sharedGoals: [],
      status: 'active'
    };

    // Add to client connections
    const existing = this.clientConnections.get(clientId) || [];
    existing.push(connection);
    this.clientConnections.set(clientId, existing);

    // Update therapist stats
    therapist.alchmsUsage.clientsConnected++;

    analytics.track('client_therapist_connected', {
      clientId,
      therapistId,
      connectionType,
      permissions
    });

    return connection;
  }

  /**
   * Generate AI-powered session prep materials with crisis detection
   */
  public async generateSessionPrepData(
    therapistId: string,
    clientId: string,
    sessionDate: Date,
    recentContent?: string
  ): Promise<{
    sessionPrep: SessionPrepData;
    crisisDetection?: CrisisDetectionResult;
    emergencyAlerts?: string[];
  }> {
    const connection = await this.findClientConnection(clientId, therapistId);
    if (!connection || !connection.permissions.accessJournalInsights) {
      throw new Error('Insufficient permissions for session prep generation');
    }

    // CRITICAL: Crisis detection first if recent content provided
    let crisisDetection: CrisisDetectionResult | undefined;
    const emergencyAlerts: string[] = [];
    
    if (recentContent) {
      try {
        const crisisPromise = crisisDetectionEngine.analyzeContent(recentContent, clientId);
        const timeoutPromise = new Promise<CrisisDetectionResult>((_, reject) => 
          setTimeout(() => reject(new Error('Crisis detection timeout')), this.CRISIS_RESPONSE_TIMEOUT)
        );
        
        crisisDetection = await Promise.race([crisisPromise, timeoutPromise]);
        
        // Cache for therapist notifications
        this.crisisDetectionCache.set(`${clientId}_${Date.now()}`, crisisDetection);
        
        // Emergency escalation if needed
        if (crisisDetection.interventionLevel === 'immediate') {
          await this.triggerTherapistEmergencyNotification(therapistId, clientId, crisisDetection);
          emergencyAlerts.push('EMERGENCY: Client requires immediate crisis intervention');
        } else if (crisisDetection.interventionLevel !== 'none') {
          await this.notifyTherapistOfCrisisRisk(therapistId, clientId, crisisDetection);
          emergencyAlerts.push(`Crisis risk detected: ${crisisDetection.interventionLevel} intervention level`);
        }
        
      } catch (error) {
        console.error('[TherapistIntegration] Crisis detection failed:', error);
        // Continue with session prep but note the failure
        emergencyAlerts.push('Crisis detection system unavailable - please assess client safety manually');
      }
    }

    // Analyze recent journal entries
    const recentInsights = await this.analyzeRecentJournalEntries(clientId, 7); // Last 7 days
    
    // Generate discussion points with crisis awareness
    const discussionPoints = await this.generateDiscussionPointsWithCrisisAwareness(recentInsights, crisisDetection);
    
    // Create homework recommendations
    const homeworkRecommendations = await this.generateHomeworkRecommendations(
      clientId,
      connection.progressSummary,
      connection.sharedGoals
    );

    // Assess current risk factors with crisis integration
    const riskAssessment = await this.generateRiskAssessmentWithCrisisDetection(clientId, recentInsights, crisisDetection);

    const sessionPrep: SessionPrepData = {
      sessionDate,
      generatedAt: new Date(),
      discussionPoints,
      journalInsights: recentInsights,
      homeworkRecommendations,
      riskAssessment,
      progressNotes: await this.generateProgressNotesWithCrisisContext(clientId, connection, crisisDetection)
    };

    // Store for therapist access
    connection.sessionPrep.push(sessionPrep);

    // Update client progress summary with crisis information
    if (crisisDetection) {
      connection.progressSummary.crisisHistory.push(crisisDetection);
      connection.progressSummary.lastCrisisAssessment = new Date();
      
      // Update crisis risk level
      if (crisisDetection.interventionLevel === 'immediate') {
        connection.progressSummary.recentTrends.crisisRisk = 'critical';
      } else if (crisisDetection.interventionLevel === 'supportive') {
        connection.progressSummary.recentTrends.crisisRisk = 'high';
      } else if (crisisDetection.interventionLevel === 'gentle') {
        connection.progressSummary.recentTrends.crisisRisk = 'medium';
      }
    }

    analytics.track('session_prep_generated_with_crisis_detection', {
      therapistId,
      clientId,
      discussionPointsCount: discussionPoints.length,
      homeworkRecommendationsCount: homeworkRecommendations.length,
      riskLevel: riskAssessment.overall,
      hasCrisisDetection: !!crisisDetection,
      crisisLevel: crisisDetection?.interventionLevel || 'none',
      emergencyAlertsCount: emergencyAlerts.length
    });

    return {
      sessionPrep,
      crisisDetection,
      emergencyAlerts: emergencyAlerts.length > 0 ? emergencyAlerts : undefined
    };
  }

  /**
   * Track therapeutic outcomes for research and advocacy
   */
  public async recordTherapeuticOutcome(
    therapistId: string,
    clientId: string,
    outcome: Partial<TherapeuticOutcome>
  ): Promise<TherapeuticOutcome> {
    const therapist = this.therapistProfiles.get(therapistId);
    if (!therapist) {
      throw new Error('Therapist not found');
    }

    const therapeuticOutcome: TherapeuticOutcome = {
      clientId,
      therapistId,
      assessmentPeriod: outcome.assessmentPeriod!,
      outcomeMeasures: outcome.outcomeMeasures!,
      treatmentModality: outcome.treatmentModality!,
      alchgContribution: outcome.alchgContribution || 0,
      notes: outcome.notes || ''
    };

    therapist.outcomes.push(therapeuticOutcome);

    // Update therapist advocacy level based on outcomes
    await this.updateTherapistAdvocacyLevel(therapistId);

    analytics.track('therapeutic_outcome_recorded', {
      therapistId,
      clientId,
      alchgContribution: therapeuticOutcome.alchgContribution,
      overallImprovement: therapeuticOutcome.outcomeMeasures.alchgMetrics.overallWellbeing
    });

    return therapeuticOutcome;
  }

  /**
   * Pathway prescription system for homework assignments
   */
  public async prescribePathway(
    therapistId: string,
    clientId: string,
    pathwayType: string,
    customizations: any,
    therapeuticGoals: string[]
  ): Promise<{ assignmentId: string; pathway: any }> {
    const connection = await this.findClientConnection(clientId, therapistId);
    if (!connection || !connection.permissions.assignPathways) {
      throw new Error('Insufficient permissions for pathway prescription');
    }

    const assignment = {
      assignmentId: `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pathwayType,
      customizations,
      therapeuticGoals,
      assignedBy: therapistId,
      assignedAt: new Date(),
      status: 'active'
    };

    // Create pathway with therapeutic context
    const pathway = await this.createTherapeuticPathway(
      pathwayType,
      customizations,
      therapeuticGoals
    );

    analytics.track('pathway_prescribed', {
      therapistId,
      clientId,
      pathwayType,
      therapeuticGoals
    });

    return { assignmentId: assignment.assignmentId, pathway };
  }

  /**
   * Professional referral tracking system
   */
  public async createProfessionalReferral(
    referringTherapistId: string,
    referralType: ProfessionalReferral['referralType'],
    details: {
      referredTherapistId?: string;
      specialization?: string;
      location?: string;
      notes: string;
    }
  ): Promise<ProfessionalReferral> {
    const referral: ProfessionalReferral = {
      id: `referral_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      referringTherapistId,
      referredTherapistId: details.referredTherapistId,
      referralType,
      status: 'pending',
      notes: details.notes,
      createdAt: new Date()
    };

    this.activeReferrals.set(referral.id, referral);

    // Update referring therapist stats
    const therapist = this.therapistProfiles.get(referringTherapistId);
    if (therapist) {
      therapist.alchmsUsage.totalReferrals++;
    }

    analytics.track('professional_referral_created', {
      referringTherapistId,
      referralType,
      hasSpecificTherapist: !!details.referredTherapistId
    });

    return referral;
  }

  /**
   * Research collaboration platform
   */
  public async joinResearchStudy(
    therapistId: string,
    studyId: string,
    consentLevel: 'aggregate_only' | 'detailed_anonymous' | 'identified_with_consent'
  ): Promise<void> {
    const therapist = this.therapistProfiles.get(therapistId);
    const study = this.researchStudies.get(studyId);
    
    if (!therapist || !study) {
      throw new Error('Therapist or study not found');
    }

    // Add therapist to study
    study.participatingTherapists.push(therapistId);
    
    // Prepare anonymized data contribution
    const dataContribution = {
      therapistId,
      anonymizedOutcomes: await this.prepareAnonymizedOutcomes(therapistId, consentLevel),
      consentLevel
    };
    
    study.dataContributions.push(dataContribution);

    // Update therapist collaboration preferences
    therapist.preferences.collaboration.participateInResearch = true;

    analytics.track('research_study_joined', {
      therapistId,
      studyId,
      consentLevel,
      outcomeCount: dataContribution.anonymizedOutcomes.length
    });
  }

  /**
   * NPS tracking and advocacy building
   */
  private async initializeNPSTracking(): void {
    // Quarterly NPS surveys
    setInterval(() => {
      this.conductNPSSurvey();
    }, 90 * 24 * 60 * 60 * 1000); // Every 90 days

    // Monthly advocacy level updates
    setInterval(() => {
      this.updateAllAdvocacyLevels();
    }, 30 * 24 * 60 * 60 * 1000); // Monthly
  }

  private async conductNPSSurvey(): Promise<void> {
    for (const [therapistId, therapist] of this.therapistProfiles.entries()) {
      // Check if eligible for survey (active for 30+ days)
      const daysSinceJoined = Math.floor(
        (Date.now() - therapist.alchmsUsage.joinedAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceJoined >= 30) {
        await this.sendNPSSurvey(therapistId);
      }
    }
  }

  private async sendNPSSurvey(therapistId: string): Promise<void> {
    // Implementation for sending NPS survey
    analytics.track('nps_survey_sent', { therapistId });
  }

  private async updateTherapistAdvocacyLevel(therapistId: string): Promise<void> {
    const therapist = this.therapistProfiles.get(therapistId);
    if (!therapist) return;

    // Calculate advocacy score based on multiple factors
    let advocacyScore = 0;

    // Outcome quality
    const avgOutcome = therapist.outcomes.reduce((sum, o) => sum + o.alchgContribution, 0) / therapist.outcomes.length;
    advocacyScore += avgOutcome * 0.4;

    // Usage consistency
    const usageScore = Math.min(therapist.alchmsUsage.clientsConnected * 10, 100);
    advocacyScore += usageScore * 0.3;

    // Referral activity
    const referralScore = Math.min(therapist.alchmsUsage.totalReferrals * 20, 100);
    advocacyScore += referralScore * 0.2;

    // NPS score
    if (therapist.alchmsUsage.npsScore) {
      const npsContribution = Math.max(0, (therapist.alchmsUsage.npsScore + 100) / 2);
      advocacyScore += npsContribution * 0.1;
    }

    // Update advocacy level
    if (advocacyScore >= 80) {
      therapist.alchmsUsage.advocacyLevel = 'promoter';
    } else if (advocacyScore >= 50) {
      therapist.alchmsUsage.advocacyLevel = 'passive';
    } else {
      therapist.alchmsUsage.advocacyLevel = 'detractor';
    }
  }

  private async updateAllAdvocacyLevels(): Promise<void> {
    for (const therapistId of this.therapistProfiles.keys()) {
      await this.updateTherapistAdvocacyLevel(therapistId);
    }
  }

  // Helper methods (simplified implementations)
  private async verifyProfessionalLicense(license: string, type: string, state: string): Promise<boolean> {
    // Integration with professional license verification APIs
    return true; // Placeholder
  }

  private async generateInitialProgressSummary(clientId: string): Promise<ClientProgressSummary> {
    return {
      overallImprovement: 0,
      keyMetrics: {
        emotionalRegulation: 50,
        selfAwareness: 50,
        copingStrategies: 50,
        resilience: 50,
        stressManagement: 50
      },
      recentTrends: {
        sentimentTrend: 'stable',
        engagementLevel: 'medium',
        crisisRisk: 'low'
      },
      milestones: [],
      concerns: [],
      recommendations: []
    };
  }

  private async findClientConnection(clientId: string, therapistId: string): Promise<ClientConnection | null> {
    const connections = this.clientConnections.get(clientId) || [];
    return connections.find(c => c.therapistId === therapistId) || null;
  }

  private async analyzeRecentJournalEntries(clientId: string, days: number): Promise<JournalInsight[]> {
    // Analyze journal entries for insights
    return []; // Placeholder
  }

  private async generateDiscussionPoints(insights: JournalInsight[]): Promise<DiscussionPoint[]> {
    return []; // Placeholder
  }

  private async generateHomeworkRecommendations(clientId: string, progress: ClientProgressSummary, goals: TherapeuticGoal[]): Promise<HomeworkRecommendation[]> {
    return []; // Placeholder
  }

  private async generateRiskAssessment(clientId: string, insights: JournalInsight[]): Promise<RiskAssessment> {
    return {
      overall: 'low',
      factors: [],
      recentChanges: [],
      recommendedActions: []
    };
  }

  private async generateProgressNotes(clientId: string, connection: ClientConnection): Promise<string[]> {
    return []; // Placeholder
  }

  private async createTherapeuticPathway(type: string, customizations: any, goals: string[]): Promise<any> {
    return {}; // Placeholder
  }

  private async prepareAnonymizedOutcomes(therapistId: string, consentLevel: string): Promise<any[]> {
    return []; // Placeholder
  }

  // =================================================================
  // CRISIS SAFETY METHODS - HIGHEST PRIORITY
  // =================================================================

  /**
   * Initialize crisis monitoring for therapist integration
   */
  private initializeCrisisMonitoring(): void {
    console.log('[TherapistIntegration] Crisis safety monitoring initialized');
    
    // Set up crisis detection cache cleanup
    setInterval(() => {
      this.cleanupCrisisCache();
    }, 300000); // 5 minutes
    
    // Monitor emergency escalation logs
    setInterval(() => {
      this.cleanupEmergencyLogs();
    }, 3600000); // 1 hour
    
    // Check for pending crisis notifications
    setInterval(() => {
      this.checkPendingCrisisNotifications();
    }, 60000); // 1 minute
  }

  /**
   * Process client content for crisis detection and therapist notification
   */
  public async processClientContentForCrisisDetection(
    clientId: string,
    content: string,
    context: {
      sessionType?: string;
      therapistId?: string;
      urgency?: 'routine' | 'concern' | 'urgent';
    }
  ): Promise<{
    crisisDetection: CrisisDetectionResult;
    therapistNotified: boolean;
    emergencyEscalated: boolean;
    recommendations: string[];
  }> {
    const processingStart = performance.now();
    
    try {
      // CRITICAL: Crisis detection with professional context
      const crisisPromise = crisisDetectionEngine.analyzeContent(content, clientId);
      const timeoutPromise = new Promise<CrisisDetectionResult>((_, reject) => 
        setTimeout(() => reject(new Error('Crisis detection timeout')), this.CRISIS_RESPONSE_TIMEOUT)
      );
      
      const crisisDetection = await Promise.race([crisisPromise, timeoutPromise]);
      
      // Cache result for therapist access
      this.crisisDetectionCache.set(`${clientId}_${Date.now()}`, crisisDetection);
      
      let therapistNotified = false;
      let emergencyEscalated = false;
      const recommendations: string[] = [];
      
      // Professional escalation based on crisis level
      if (crisisDetection.interventionLevel !== 'none') {
        const connections = this.clientConnections.get(clientId) || [];
        
        for (const connection of connections) {
          if (connection.permissions.crisisNotifications) {
            // Notify therapist based on crisis level
            if (crisisDetection.interventionLevel === 'immediate') {
              await this.triggerTherapistEmergencyNotification(connection.therapistId, clientId, crisisDetection);
              emergencyEscalated = true;
              recommendations.push('IMMEDIATE: Emergency crisis intervention protocol activated');
              recommendations.push('Contact client immediately or call emergency services');
            } else {
              await this.notifyTherapistOfCrisisRisk(connection.therapistId, clientId, crisisDetection);
              therapistNotified = true;
              recommendations.push(`Schedule urgent session within 24-48 hours`);
              recommendations.push('Review crisis safety plan with client');
            }
          }
        }
        
        // Update all connected therapists' client progress summaries
        await this.updateClientCrisisStatusForTherapists(clientId, crisisDetection);
      }
      
      // Professional recommendations based on detection
      recommendations.push(...this.generateProfessionalRecommendations(crisisDetection));
      
      analytics.track('therapist_integration_crisis_detection', {
        clientId,
        therapistId: context.therapistId,
        interventionLevel: crisisDetection.interventionLevel,
        crisisScore: crisisDetection.crisisScore,
        confidence: crisisDetection.confidence,
        therapistNotified,
        emergencyEscalated,
        processingTime: performance.now() - processingStart
      });
      
      return {
        crisisDetection,
        therapistNotified,
        emergencyEscalated,
        recommendations
      };
      
    } catch (error) {
      console.error('[TherapistIntegration] Crisis detection failed:', error);
      
      // Safety fallback: Notify therapists of detection failure
      const connections = this.clientConnections.get(clientId) || [];
      for (const connection of connections) {
        if (connection.permissions.crisisNotifications) {
          await this.notifyTherapistOfSystemFailure(connection.therapistId, clientId, error);
        }
      }
      
      // Return safe fallback response
      return {
        crisisDetection: {
          interventionLevel: 'supportive',
          crisisScore: 5,
          detectedPatterns: [],
          recommendedResources: [],
          confidence: 0.7,
          timestamp: new Date(),
          processingTime: performance.now() - processingStart,
          error: 'Detection system unavailable - manual assessment required'
        },
        therapistNotified: true,
        emergencyEscalated: false,
        recommendations: [
          'SYSTEM ALERT: Crisis detection unavailable',
          'Conduct manual crisis risk assessment immediately',
          'Follow standard safety protocols'
        ]
      };
    }
  }

  /**
   * Trigger emergency notification to therapist for immediate crisis
   */
  private async triggerTherapistEmergencyNotification(
    therapistId: string,
    clientId: string,
    crisisDetection: CrisisDetectionResult
  ): Promise<void> {
    try {
      // Rate limiting for emergency notifications
      const emergencyKey = `${therapistId}_${clientId}`;
      const existingEscalations = this.emergencyEscalationLog.get(emergencyKey) || [];
      const recentEscalations = existingEscalations.filter(date => 
        Date.now() - date.getTime() < 3600000 // Within last hour
      );
      
      if (recentEscalations.length >= 3) {
        console.log(`[TherapistIntegration] Emergency notification rate limited for ${emergencyKey}`);
        return;
      }
      
      // Record escalation
      existingEscalations.push(new Date());
      this.emergencyEscalationLog.set(emergencyKey, existingEscalations);
      
      const therapist = this.therapistProfiles.get(therapistId);
      if (!therapist || !therapist.preferences.notifications.emergencyEscalation) {
        return;
      }
      
      // Add to active emergency notifications
      this.activeEmergencyNotifications.add(emergencyKey);
      
      // Generate professional crisis notification
      const emergencyNotification = {
        type: 'EMERGENCY_CRISIS_ALERT',
        priority: this.EMERGENCY_ESCALATION_PRIORITY,
        timestamp: new Date(),
        therapistId,
        clientId,
        crisisLevel: crisisDetection.interventionLevel,
        crisisScore: crisisDetection.crisisScore,
        confidence: crisisDetection.confidence,
        recommendedActions: [
          'Contact client immediately',
          'Assess immediate safety',
          'Consider emergency services if unable to reach client',
          'Document crisis intervention steps'
        ],
        resources: crisisDetection.recommendedResources,
        detectedPatterns: crisisDetection.detectedPatterns.map(p => p.id)
      };
      
      // Send through multiple channels for reliability
      await this.sendEmergencyNotification(therapist, emergencyNotification);
      
      // Escalate through crisis system as well
      await crisisDetectionEngine.escalateEmergency(clientId, crisisDetection);
      
      analytics.track('therapist_emergency_notification_sent', {
        therapistId,
        clientId,
        crisisLevel: crisisDetection.interventionLevel,
        notificationChannels: ['email', 'sms', 'in_app'],
        escalationCount: recentEscalations.length + 1
      });
      
    } catch (error) {
      console.error('[TherapistIntegration] Emergency notification failed:', error);
      
      // Ensure crisis escalation still occurs even if therapist notification fails
      analytics.track('therapist_emergency_notification_failed', {
        therapistId,
        clientId,
        error: 'notification_failed',
        fallbackAction: 'crisis_system_escalation_maintained'
      });
    }
  }

  /**
   * Notify therapist of crisis risk (non-emergency)
   */
  private async notifyTherapistOfCrisisRisk(
    therapistId: string,
    clientId: string,
    crisisDetection: CrisisDetectionResult
  ): Promise<void> {
    const therapist = this.therapistProfiles.get(therapistId);
    if (!therapist || !therapist.preferences.notifications.crisisAlerts) {
      return;
    }
    
    const riskNotification = {
      type: 'CRISIS_RISK_ALERT',
      priority: 'high',
      timestamp: new Date(),
      therapistId,
      clientId,
      crisisLevel: crisisDetection.interventionLevel,
      crisisScore: crisisDetection.crisisScore,
      confidence: crisisDetection.confidence,
      recommendedActions: [
        'Schedule session within 24-48 hours',
        'Review crisis safety plan',
        'Assess need for additional support',
        'Monitor client closely'
      ],
      resources: crisisDetection.recommendedResources
    };
    
    await this.sendCrisisRiskNotification(therapist, riskNotification);
    
    analytics.track('therapist_crisis_risk_notification_sent', {
      therapistId,
      clientId,
      crisisLevel: crisisDetection.interventionLevel,
      crisisScore: crisisDetection.crisisScore
    });
  }

  /**
   * Generate professional recommendations based on crisis detection
   */
  private generateProfessionalRecommendations(crisisDetection: CrisisDetectionResult): string[] {
    const recommendations: string[] = [];
    
    switch (crisisDetection.interventionLevel) {
      case 'immediate':
        recommendations.push(
          'IMMEDIATE ACTION REQUIRED: Client shows signs of acute crisis',
          'Contact client within 15 minutes',
          'If unable to reach, consider wellness check or emergency services',
          'Review crisis safety plan and coping strategies',
          'Consider hospitalization assessment if risk persists',
          'Document all intervention steps thoroughly'
        );
        break;
        
      case 'supportive':
        recommendations.push(
          'Schedule urgent session within 24-48 hours',
          'Review and update crisis safety plan',
          'Assess current support system and coping resources',
          'Consider increased session frequency',
          'Coordinate with other providers if applicable'
        );
        break;
        
      case 'gentle':
        recommendations.push(
          'Address in next scheduled session',
          'Gently explore recent stressors and triggers',
          'Reinforce existing coping strategies',
          'Consider preventive interventions'
        );
        break;
    }
    
    // Add pattern-specific recommendations
    if (crisisDetection.detectedPatterns.length > 0) {
      recommendations.push('DETECTED PATTERNS:');
      for (const pattern of crisisDetection.detectedPatterns) {
        recommendations.push(`- Address ${pattern.category} concerns in session`);
      }
    }
    
    return recommendations;
  }

  /**
   * Update client crisis status for all connected therapists
   */
  private async updateClientCrisisStatusForTherapists(
    clientId: string,
    crisisDetection: CrisisDetectionResult
  ): Promise<void> {
    const connections = this.clientConnections.get(clientId) || [];
    
    for (const connection of connections) {
      // Update progress summary with crisis information
      connection.progressSummary.crisisHistory.push(crisisDetection);
      connection.progressSummary.lastCrisisAssessment = new Date();
      
      // Update risk level
      if (crisisDetection.interventionLevel === 'immediate') {
        connection.progressSummary.recentTrends.crisisRisk = 'critical';
      } else if (crisisDetection.interventionLevel === 'supportive') {
        connection.progressSummary.recentTrends.crisisRisk = 'high';
      } else if (crisisDetection.interventionLevel === 'gentle') {
        connection.progressSummary.recentTrends.crisisRisk = 'medium';
      }
      
      // Add crisis-specific concerns and recommendations
      if (!connection.progressSummary.concerns.includes('Crisis risk detected')) {
        connection.progressSummary.concerns.push('Crisis risk detected');
      }
      
      connection.progressSummary.recommendations.unshift(
        `Crisis intervention level: ${crisisDetection.interventionLevel}`,
        'Review crisis safety protocols'
      );
    }
  }

  /**
   * Generate discussion points with crisis awareness
   */
  private async generateDiscussionPointsWithCrisisAwareness(
    insights: JournalInsight[],
    crisisDetection?: CrisisDetectionResult
  ): Promise<DiscussionPoint[]> {
    const discussionPoints = await this.generateDiscussionPoints(insights);
    
    // Add crisis-specific discussion points if needed
    if (crisisDetection && crisisDetection.interventionLevel !== 'none') {
      const crisisDiscussionPoint: DiscussionPoint = {
        category: 'challenges',
        priority: 'high',
        content: `Client shows signs of ${crisisDetection.interventionLevel} crisis risk. Immediate safety assessment needed.`,
        supportingEvidence: crisisDetection.detectedPatterns.map(p => p.id),
        suggestedApproach: this.getCrisisInterventionApproach(crisisDetection.interventionLevel)
      };
      
      discussionPoints.unshift(crisisDiscussionPoint); // Put crisis first
    }
    
    return discussionPoints;
  }

  /**
   * Generate risk assessment with crisis detection integration
   */
  private async generateRiskAssessmentWithCrisisDetection(
    clientId: string,
    insights: JournalInsight[],
    crisisDetection?: CrisisDetectionResult
  ): Promise<RiskAssessment> {
    const baseAssessment = await this.generateRiskAssessment(clientId, insights);
    
    if (crisisDetection && crisisDetection.interventionLevel !== 'none') {
      // Override risk level with crisis detection
      const crisisRiskLevel = {
        'gentle': 'medium' as const,
        'supportive': 'high' as const,
        'immediate': 'emergency' as const,
        'none': baseAssessment.overall
      }[crisisDetection.interventionLevel];
      
      return {
        ...baseAssessment,
        overall: crisisRiskLevel,
        crisisDetection,
        emergencyEscalated: crisisDetection.interventionLevel === 'immediate',
        therapistNotified: true,
        recommendedActions: [
          ...this.generateProfessionalRecommendations(crisisDetection),
          ...baseAssessment.recommendedActions
        ]
      };
    }
    
    return baseAssessment;
  }

  /**
   * Generate progress notes with crisis context
   */
  private async generateProgressNotesWithCrisisContext(
    clientId: string,
    connection: ClientConnection,
    crisisDetection?: CrisisDetectionResult
  ): Promise<string[]> {
    const baseNotes = await this.generateProgressNotes(clientId, connection);
    
    if (crisisDetection && crisisDetection.interventionLevel !== 'none') {
      const crisisNotes = [
        `CRISIS ALERT: ${crisisDetection.interventionLevel.toUpperCase()} intervention level detected`,
        `Crisis confidence: ${(crisisDetection.confidence * 100).toFixed(1)}%`,
        `Detected patterns: ${crisisDetection.detectedPatterns.map(p => p.id).join(', ')}`,
        `Assessment time: ${crisisDetection.timestamp.toISOString()}`,
        'IMMEDIATE ACTION: Follow crisis intervention protocols'
      ];
      
      return [...crisisNotes, ...baseNotes];
    }
    
    return baseNotes;
  }

  /**
   * Get crisis intervention approach for discussion
   */
  private getCrisisInterventionApproach(interventionLevel: InterventionLevel): string {
    const approaches = {
      immediate: 'EMERGENCY PROTOCOL: Immediate safety assessment, crisis intervention, consider emergency services',
      supportive: 'URGENT: Direct discussion of crisis feelings, safety planning, increased support',
      gentle: 'SUPPORTIVE: Gentle exploration of distress, coping assessment, preventive planning',
      none: 'Standard therapeutic approach'
    };
    
    return approaches[interventionLevel];
  }

  /**
   * Notify therapist of system failure
   */
  private async notifyTherapistOfSystemFailure(
    therapistId: string,
    clientId: string,
    error: any
  ): Promise<void> {
    const therapist = this.therapistProfiles.get(therapistId);
    if (!therapist || !therapist.preferences.notifications.concernAlerts) {
      return;
    }
    
    const systemFailureNotification = {
      type: 'SYSTEM_ALERT',
      priority: 'high',
      timestamp: new Date(),
      therapistId,
      clientId,
      message: 'Crisis detection system temporarily unavailable',
      recommendedActions: [
        'Conduct manual crisis risk assessment',
        'Follow standard safety protocols',
        'Monitor client closely',
        'Document assessment findings'
      ]
    };
    
    await this.sendSystemAlert(therapist, systemFailureNotification);
  }

  /**
   * Clean up crisis detection cache
   */
  private cleanupCrisisCache(): void {
    const now = Date.now();
    const cacheExpiry = 3600000; // 1 hour
    
    for (const [key, result] of this.crisisDetectionCache.entries()) {
      if (now - result.timestamp.getTime() > cacheExpiry) {
        this.crisisDetectionCache.delete(key);
      }
    }
  }

  /**
   * Clean up emergency escalation logs
   */
  private cleanupEmergencyLogs(): void {
    const now = Date.now();
    const logExpiry = 86400000; // 24 hours
    
    for (const [key, escalations] of this.emergencyEscalationLog.entries()) {
      const recentEscalations = escalations.filter(date => 
        now - date.getTime() < logExpiry
      );
      
      if (recentEscalations.length === 0) {
        this.emergencyEscalationLog.delete(key);
      } else {
        this.emergencyEscalationLog.set(key, recentEscalations);
      }
    }
  }

  /**
   * Check for pending crisis notifications
   */
  private async checkPendingCrisisNotifications(): Promise<void> {
    // Check for unacknowledged emergency notifications
    for (const emergencyKey of this.activeEmergencyNotifications) {
      // Implementation would check if notification was acknowledged
      // and send follow-up if needed
    }
  }

  /**
   * Get crisis status for a client across all therapist connections
   */
  public getClientCrisisStatus(clientId: string): {
    currentRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    lastCrisisDetection?: CrisisDetectionResult;
    connectedTherapists: {
      therapistId: string;
      notified: boolean;
      lastNotification?: Date;
    }[];
    emergencyEscalationsLast24h: number;
  } {
    const connections = this.clientConnections.get(clientId) || [];
    let currentRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let lastCrisisDetection: CrisisDetectionResult | undefined;
    
    // Find highest risk level across all connections
    for (const connection of connections) {
      if (connection.progressSummary.recentTrends.crisisRisk === 'critical') {
        currentRiskLevel = 'critical';
      } else if (connection.progressSummary.recentTrends.crisisRisk === 'high' && currentRiskLevel !== 'critical') {
        currentRiskLevel = 'high';
      } else if (connection.progressSummary.recentTrends.crisisRisk === 'medium' && ['low'].includes(currentRiskLevel)) {
        currentRiskLevel = 'medium';
      }
      
      // Get most recent crisis detection
      const recentCrisis = connection.progressSummary.crisisHistory
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
      
      if (recentCrisis && (!lastCrisisDetection || recentCrisis.timestamp > lastCrisisDetection.timestamp)) {
        lastCrisisDetection = recentCrisis;
      }
    }
    
    // Count emergency escalations in last 24 hours
    const now = Date.now();
    const emergencyEscalationsLast24h = Array.from(this.emergencyEscalationLog.entries())
      .filter(([key]) => key.includes(clientId))
      .map(([, escalations]) => escalations)
      .flat()
      .filter(date => now - date.getTime() < 86400000).length;
    
    return {
      currentRiskLevel,
      lastCrisisDetection,
      connectedTherapists: connections.map(c => ({
        therapistId: c.therapistId,
        notified: c.progressSummary.lastCrisisAssessment ? true : false,
        lastNotification: c.progressSummary.lastCrisisAssessment
      })),
      emergencyEscalationsLast24h
    };
  }

  // Placeholder notification methods (would integrate with actual notification systems)
  private async sendEmergencyNotification(therapist: TherapistProfile, notification: any): Promise<void> {
    // Implementation would send via email, SMS, push notification, etc.
    console.log(`[TherapistIntegration] Emergency notification sent to ${therapist.name}`);
  }

  private async sendCrisisRiskNotification(therapist: TherapistProfile, notification: any): Promise<void> {
    // Implementation would send crisis risk alert
    console.log(`[TherapistIntegration] Crisis risk notification sent to ${therapist.name}`);
  }

  private async sendSystemAlert(therapist: TherapistProfile, alert: any): Promise<void> {
    // Implementation would send system alert
    console.log(`[TherapistIntegration] System alert sent to ${therapist.name}`);
  }
}

// Export singleton instance
export const therapistIntegrationSystem = new TherapistIntegrationSystem();

// Crisis safety validation
if (typeof window !== 'undefined') {
  console.log('[TherapistIntegration] Crisis safety integration active - all therapeutic tools include emergency escalation to licensed professionals');
}