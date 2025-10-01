/**
 * ALCHM Therapist Beta Testing - Comprehensive Feedback Collection System
 * Clinical relevance scoring and professional feedback management
 * Designed for licensed mental health professionals
 */

import { z } from 'zod';

// Clinical feedback categories
export const CLINICAL_FEEDBACK_CATEGORIES = [
  'crisis_detection_accuracy',
  'ai_clinical_insights',
  'client_progress_monitoring', 
  'professional_typeof window !== 'undefined' && documentation',
  'hipaa_compliance_experience',
  'treatment_planning_integration',
  'emergency_escalation_effectiveness',
  'cross_cultural_competency',
  'user_interface_clinical_workflow',
  'data_security_confidence'
] as const;

// Feedback priority levels
export const FEEDBACK_PRIORITY_LEVELS = [
  'critical_blocker',
  'high_impact',
  'moderate_improvement',
  'nice_to_have',
  'future_consideration'
] as const;

// Clinical relevance scoring
export const CLINICAL_RELEVANCE_SCORES = [
  1, // Not clinically relevant
  2, // Minimally relevant
  3, // Moderately relevant
  4, // Highly relevant
  5  // Critical to clinical practice
] as const;

// Feedback collection contexts
export const FEEDBACK_CONTEXTS = [
  'crisis_scenario_testing',
  'mock_client_session',
  'typeof window !== 'undefined' && documentation_workflow',
  'ai_insight_evaluation',
  'hipaa_compliance_check',
  'emergency_response_drill',
  'treatment_plan_review',
  'general_platform_use',
  'training_module_completion',
  'peer_collaboration_session'
] as const;

// Evidence-based feedback schema
export const TherapistFeedbackSchema = z.object({
  // Therapist identification and context
  therapistId: z.string().uuid('Invalid therapist ID'),
  sessionId: z.string().optional(),
  groupId: z.string().optional(),
  
  // Feedback metadata
  category: z.enum(CLINICAL_FEEDBACK_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid feedback category' })
  }),
  context: z.enum(FEEDBACK_CONTEXTS, {
    errorMap: () => ({ message: 'Please select the context of this feedback' })
  }),
  priority: z.enum(FEEDBACK_PRIORITY_LEVELS, {
    errorMap: () => ({ message: 'Please select feedback priority level' })
  }),
  
  // Clinical relevance assessment
  clinicalRelevanceScore: z.enum(CLINICAL_RELEVANCE_SCORES, {
    errorMap: () => ({ message: 'Please rate the clinical relevance' })
  }),
  
  // Core feedback content
  title: z.string().min(10, 'Feedback title must be at least 10 characters').max(100, 'Title too long'),
  description: z.string().min(50, 'Please provide detailed feedback (minimum 50 characters)').max(2000, 'Description too long'),
  
  // Specific feature/scenario details
  featureArea: z.string().min(5, 'Please specify the feature area'),
  stepsToReproduce: z.array(z.string()).min(1, 'Please provide steps to reproduce').optional(),
  expectedBehavior: z.string().min(10, 'Please describe expected behavior').optional(),
  actualBehavior: z.string().min(10, 'Please describe actual behavior').optional(),
  
  // Clinical impact assessment
  clinicalImpact: z.object({
    patientSafetyRisk: z.boolean().default(false),
    workflowDisruption: z.enum(['none', 'minimal', 'moderate', 'significant', 'severe']),
    timeImpact: z.number().min(0).max(120).optional(), // minutes
    confidenceInAIInsights: z.enum(['very_low', 'low', 'neutral', 'high', 'very_high']).optional(),
    usabilityForClinicians: z.enum(['very_poor', 'poor', 'acceptable', 'good', 'excellent']).optional()
  }),
  
  // Professional recommendations
  recommendedSolution: z.string().min(20, 'Please provide professional recommendations').optional(),
  alternativeApproaches: z.array(z.string()).optional(),
  
  // Rating scales (1-10)
  ratings: z.object({
    overallSatisfaction: z.number().min(1).max(10),
    easeOfUse: z.number().min(1).max(10),
    clinicalValue: z.number().min(1).max(10),
    timeEfficiency: z.number().min(1).max(10),
    accuracyOfInsights: z.number().min(1).max(10).optional(),
    hipaaComplianceConfidence: z.number().min(1).max(10).optional()
  }),
  
  // Comparative assessment
  comparisonToCurrent: z.object({
    currentToolsUsed: z.array(z.string()).optional(),
    improvementOverCurrent: z.enum(['much_worse', 'worse', 'similar', 'better', 'much_better']).optional(),
    willingnessToReplace: z.enum(['never', 'unlikely', 'maybe', 'likely', 'definitely']).optional()
  }).optional(),
  
  // Professional context
  clientType: z.enum(['adolescent', 'adult', 'geriatric', 'mixed', 'not_applicable']).optional(),
  treatmentModality: z.enum(['individual', 'group', 'family', 'couples', 'mixed']).optional(),
  settingType: z.enum(['private_practice', 'community_center', 'hospital', 'school', 'telehealth', 'other']).optional(),
  
  // Evidence and attachments
  screenshotAvailable: z.boolean().default(false),
  videoRecordingAvailable: z.boolean().default(false),
  logDataAvailable: z.boolean().default(false),
  
  // Follow-up preferences
  followUpPreferred: z.boolean().default(false),
  availableForInterview: z.boolean().default(false),
  willingToTestFixes: z.boolean().default(true),
  
  // Professional development impact
  learningOutcomes: z.array(z.string()).optional(),
  skillsImproved: z.array(z.string()).optional(),
  confidenceChanges: z.string().optional(),
  
  // Submission metadata
  submittedAt: z.date().default(() => new Date()),
  estimatedTimeSpent: z.number().min(1).max(480).optional(), // minutes on this feedback
  sessionDuration: z.number().min(1).max(480).optional() // minutes in the testing session
});

export type TherapistFeedback = z.infer<typeof TherapistFeedbackSchema>;

// Feedback analysis and scoring
export interface FeedbackAnalytics {
  feedbackId: string;
  therapistProfile: {
    experienceLevel: number;
    specializations: string[];
    techComfortLevel: string;
    aiExperienceLevel: string;
  };
  
  // Automated analysis scores
  sentiment: {
    overall: 'negative' | 'neutral' | 'positive';
    confidence: number;
    aspects: Record<string, number>; // Feature-specific sentiment
  };
  
  urgency: {
    score: number; // 1-10
    factors: string[];
    requiresImmediateAttention: boolean;
  };
  
  actionability: {
    score: number; // 1-10
    specificSteps: string[];
    implementationComplexity: 'low' | 'medium' | 'high';
  };
  
  // Clinical validation metrics
  clinicalValidation: {
    evidenceQuality: number; // 1-5
    professionalCredibility: number; // 1-5
    replicability: number; // 1-5
  };
  
  // Categorization and tagging
  autoTags: string[];
  suggestedAssignees: string[];
  relatedFeedback: string[];
  
  // Impact assessment
  impactMetrics: {
    potentialUsersAffected: number;
    clinicalRiskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
    businessValue: number; // 1-10
  };
}

// Feedback response and resolution tracking
export interface FeedbackResolution {
  feedbackId: string;
  status: 'received' | 'acknowledged' | 'investigating' | 'in_progress' | 'testing' | 'resolved' | 'closed';
  
  assignedTo: {
    developmentTeam: string[];
    clinicalAdvisor?: string;
    productManager: string;
  };
  
  response: {
    initialResponse: {
      date: Date;
      acknowledgment: string;
      estimatedResolution?: Date;
    };
    
    progressUpdates: Array<{
      date: Date;
      update: string;
      status: string;
      attachments?: string[];
    }>;
    
    resolution: {
      date?: Date;
      description?: string;
      implementedChanges?: string[];
      testingInstructions?: string;
    };
  };
  
  // Therapist satisfaction tracking
  therapistSatisfaction: {
    responseTime: number; // 1-10
    communicationQuality: number; // 1-10
    resolutionQuality: number; // 1-10
    willingnessToProvideFutureFeedback: boolean;
  } | null;
  
  // Resolution validation
  validated: boolean;
  validationDate?: Date;
  validatedBy?: string;
  retesting: {
    requested: boolean;
    completed: boolean;
    results?: string;
  };
}

/**
 * Professional Feedback Collection Service
 * Manages comprehensive feedback from licensed therapists
 */
export class TherapistFeedbackService {
  private static instance: TherapistFeedbackService;
  
  static getInstance(): TherapistFeedbackService {
    if (!TherapistFeedbackService.instance) {
      TherapistFeedbackService.instance = new TherapistFeedbackService();
    }
    return TherapistFeedbackService.instance;
  }

  /**
   * Submit structured feedback from therapist
   */
  async submitFeedback(feedback: TherapistFeedback): Promise<{
    feedbackId: string;
    status: string;
    estimatedResponseTime: string;
    trackingUrl: string;
  }> {
    // Validate feedback completeness and clinical relevance
    const validation = await this.validateFeedback(feedback);
    if (!validation.isValid) {
      throw new Error(`Feedback validation failed: ${validation.errors.join(', ')}`);
    }

    // Generate unique feedback ID
    const feedbackId = `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Perform initial analysis and scoring
    const analytics = await this.analyzeFeedback(feedback, feedbackId);
    
    // Store feedback with analytics
    await this.storeFeedback(feedbackId, feedback, analytics);
    
    // Auto-route based on priority and clinical impact
    const routing = await this.routeFeedback(feedback, analytics);
    
    // Send acknowledgment to therapist
    await this.sendAcknowledgment(feedback.therapistId, feedbackId, routing);
    
    // Alert relevant team members if high priority
    if (analytics.urgency.requiresImmediateAttention) {
      await this.alertUrgentFeedback(feedbackId, feedback, analytics);
    }

    return {
      feedbackId,
      status: 'received',
      estimatedResponseTime: this.calculateResponseTime(analytics.urgency.score),
      trackingUrl: `https://alchm-therapist-beta-staging.web.app/feedback/${feedbackId}`
    };
  }

  /**
   * Validate feedback completeness and clinical relevance
   */
  private async validateFeedback(feedback: TherapistFeedback): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Schema validation
      TherapistFeedbackSchema.parse(feedback);
    } catch (zodError: any) {
      errors.push(`Schema validation failed: ${zodError.message}`);
    }

    // Clinical relevance validation
    if (feedback.clinicalRelevanceScore < 2 && feedback.priority === 'critical_blocker') {
      warnings.push('High priority feedback with low clinical relevance - please reconsider priority level');
    }

    // Context validation
    if (feedback.context === 'crisis_scenario_testing' && !feedback.clinicalImpact?.patientSafetyRisk) {
      warnings.push('Crisis scenario feedback should consider patient safety implications');
    }

    // Professional completeness
    if (feedback.category === 'ai_clinical_insights' && !feedback.ratings.accuracyOfInsights) {
      warnings.push('AI insights feedback should include accuracy rating');
    }

    // Evidence quality check
    if (feedback.priority === 'critical_blocker' && !feedback.stepsToReproduce) {
      errors.push('Critical feedback must include steps to reproduce');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Analyze feedback for routing and prioritization
   */
  private async analyzeFeedback(feedback: TherapistFeedback, feedbackId: string): Promise<FeedbackAnalytics> {
    // Sentiment analysis
    const sentiment = await this.analyzeSentiment(feedback.description);
    
    // Calculate urgency score
    const urgencyScore = this.calculateUrgencyScore(feedback);
    
    // Assess actionability
    const actionability = this.assessActionability(feedback);
    
    // Clinical validation
    const clinicalValidation = await this.validateClinicalQuality(feedback);
    
    // Impact assessment
    const impactMetrics = this.assessImpact(feedback);
    
    // Auto-tagging
    const autoTags = this.generateTags(feedback);
    
    // Find related feedback
    const relatedFeedback = await this.findRelatedFeedback(feedback);

    return {
      feedbackId,
      therapistProfile: await this.getTherapistProfile(feedback.therapistId),
      sentiment,
      urgency: {
        score: urgencyScore,
        factors: this.getUrgencyFactors(feedback),
        requiresImmediateAttention: urgencyScore >= 8 || feedback.clinicalImpact.patientSafetyRisk
      },
      actionability,
      clinicalValidation,
      autoTags,
      suggestedAssignees: this.suggestAssignees(feedback, autoTags),
      relatedFeedback,
      impactMetrics
    };
  }

  private async analyzeSentiment(text: string): Promise<{
    overall: 'negative' | 'neutral' | 'positive';
    confidence: number;
    aspects: Record<string, number>;
  }> {
    // In production, integrate with NLP service (Google Cloud NLP, AWS Comprehend, etc.)
    // For staging, simulate sentiment analysis
    
    const negativeKeywords = ['terrible', 'awful', 'broken', 'useless', 'frustrating', 'confusing'];
    const positiveKeywords = ['excellent', 'great', 'helpful', 'intuitive', 'effective', 'valuable'];
    
    const words = text.toLowerCase().split(/\s+/);
    const negativeCount = words.filter(word => negativeKeywords.some(neg => word.includes(neg))).length;
    const positiveCount = words.filter(word => positiveKeywords.some(pos => word.includes(pos))).length;
    
    let overall: 'negative' | 'neutral' | 'positive';
    if (positiveCount > negativeCount) overall = 'positive';
    else if (negativeCount > positiveCount) overall = 'negative';
    else overall = 'neutral';
    
    return {
      overall,
      confidence: 0.75, // Mock confidence score
      aspects: {
        usability: positiveCount > 0 ? 0.6 : -0.4,
        functionality: negativeCount > 0 ? -0.3 : 0.5,
        clinical_value: 0.2
      }
    };
  }

  private calculateUrgencyScore(feedback: TherapistFeedback): number {
    let score = 0;
    
    // Priority level weighting
    const priorityScores = {
      'critical_blocker': 10,
      'high_impact': 7,
      'moderate_improvement': 5,
      'nice_to_have': 3,
      'future_consideration': 1
    };
    score += priorityScores[feedback.priority];
    
    // Clinical relevance weighting
    score += feedback.clinicalRelevanceScore * 1.5;
    
    // Patient safety risk
    if (feedback.clinicalImpact.patientSafetyRisk) {
      score = Math.max(score, 9); // Minimum urgency 9 for safety risks
    }
    
    // Workflow disruption
    const disruptionScores = {
      'none': 0,
      'minimal': 1,
      'moderate': 3,
      'significant': 6,
      'severe': 8
    };
    score += disruptionScores[feedback.clinicalImpact.workflowDisruption];
    
    // Crisis scenario context
    if (feedback.context === 'crisis_scenario_testing') {
      score += 2;
    }
    
    return Math.min(10, Math.max(1, score));
  }

  private assessActionability(feedback: TherapistFeedback): {
    score: number;
    specificSteps: string[];
    implementationComplexity: 'low' | 'medium' | 'high';
  } {
    let score = 5; // Base actionability score
    const specificSteps: string[] = [];
    
    // Has specific steps to reproduce
    if (feedback.stepsToReproduce && feedback.stepsToReproduce.length > 0) {
      score += 2;
      specificSteps.push('Steps to reproduce provided');
    }
    
    // Has expected vs actual behavior
    if (feedback.expectedBehavior && feedback.actualBehavior) {
      score += 2;
      specificSteps.push('Clear behavior description available');
    }
    
    // Has recommended solution
    if (feedback.recommendedSolution) {
      score += 1;
      specificSteps.push('Professional recommendation provided');
    }
    
    // Determine implementation complexity
    let implementationComplexity: 'low' | 'medium' | 'high' = 'medium';
    
    if (feedback.category === 'user_interface_clinical_workflow') {
      implementationComplexity = 'low';
    } else if (feedback.category === 'ai_clinical_insights' || feedback.category === 'crisis_detection_accuracy') {
      implementationComplexity = 'high';
    }
    
    return {
      score: Math.min(10, score),
      specificSteps,
      implementationComplexity
    };
  }

  private async validateClinicalQuality(feedback: TherapistFeedback): Promise<{
    evidenceQuality: number;
    professionalCredibility: number;
    replicability: number;
  }> {
    // In production, analyze therapist credentials and feedback history
    return {
      evidenceQuality: feedback.stepsToReproduce ? 4 : 3,
      professionalCredibility: 4, // Based on verified therapist status
      replicability: feedback.stepsToReproduce && feedback.context ? 4 : 2
    };
  }

  private assessImpact(feedback: TherapistFeedback): {
    potentialUsersAffected: number;
    clinicalRiskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
    businessValue: number;
  } {
    // Estimate based on feature area and priority
    const featureUsageMap: Record<string, number> = {
      'crisis_detection_accuracy': 100, // All users potentially affected
      'ai_clinical_insights': 80,
      'professional_typeof window !== 'undefined' && documentation': 90,
      'hipaa_compliance_experience': 100,
      'user_interface_clinical_workflow': 95
    };
    
    const potentialUsersAffected = featureUsageMap[feedback.category] || 50;
    
    // Clinical risk assessment
    let clinicalRiskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical' = 'none';
    
    if (feedback.clinicalImpact.patientSafetyRisk) {
      clinicalRiskLevel = 'critical';
    } else if (feedback.category === 'crisis_detection_accuracy') {
      clinicalRiskLevel = 'high';
    } else if (feedback.clinicalImpact.workflowDisruption === 'severe') {
      clinicalRiskLevel = 'medium';
    } else if (feedback.clinicalRelevanceScore >= 4) {
      clinicalRiskLevel = 'low';
    }
    
    // Business value calculation
    const businessValue = feedback.clinicalRelevanceScore * 2;
    
    return {
      potentialUsersAffected,
      clinicalRiskLevel,
      businessValue
    };
  }

  private generateTags(feedback: TherapistFeedback): string[] {
    const tags: string[] = [];
    
    // Category-based tags
    tags.push(feedback.category);
    tags.push(feedback.context);
    tags.push(feedback.priority);
    
    // Feature-specific tags
    if (feedback.featureArea) {
      tags.push(`feature:${feedback.featureArea.toLowerCase().replace(/\s+/g, '_')}`);
    }
    
    // Clinical impact tags
    if (feedback.clinicalImpact.patientSafetyRisk) {
      tags.push('patient_safety');
    }
    
    if (feedback.clinicalImpact.workflowDisruption !== 'none') {
      tags.push(`workflow_impact:${feedback.clinicalImpact.workflowDisruption}`);
    }
    
    // Professional context tags
    if (feedback.clientType) {
      tags.push(`client_type:${feedback.clientType}`);
    }
    
    if (feedback.settingType) {
      tags.push(`setting:${feedback.settingType}`);
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }

  private suggestAssignees(feedback: TherapistFeedback, tags: string[]): string[] {
    const assignees: string[] = [];
    
    // Route based on category
    const categoryRouting: Record<string, string[]> = {
      'crisis_detection_accuracy': ['ai_team', 'clinical_advisor', 'safety_team'],
      'ai_clinical_insights': ['ai_team', 'clinical_advisor'],
      'professional_typeof window !== 'undefined' && documentation': ['ui_team', 'clinical_advisor'],
      'hipaa_compliance_experience': ['security_team', 'compliance_team'],
      'emergency_escalation_effectiveness': ['safety_team', 'clinical_advisor'],
      'user_interface_clinical_workflow': ['ui_team', 'ux_researcher']
    };
    
    const categoryAssignees = categoryRouting[feedback.category] || ['product_team'];
    assignees.push(...categoryAssignees);
    
    // Add product manager for all feedback
    assignees.push('product_manager');
    
    // Add clinical advisor for high clinical relevance
    if (feedback.clinicalRelevanceScore >= 4 && !assignees.includes('clinical_advisor')) {
      assignees.push('clinical_advisor');
    }
    
    return [...new Set(assignees)];
  }

  private getUrgencyFactors(feedback: TherapistFeedback): string[] {
    const factors: string[] = [];
    
    if (feedback.clinicalImpact.patientSafetyRisk) {
      factors.push('Patient safety risk identified');
    }
    
    if (feedback.priority === 'critical_blocker') {
      factors.push('Marked as critical blocker');
    }
    
    if (feedback.clinicalImpact.workflowDisruption === 'severe') {
      factors.push('Severe workflow disruption');
    }
    
    if (feedback.context === 'crisis_scenario_testing') {
      factors.push('Crisis scenario testing feedback');
    }
    
    if (feedback.clinicalRelevanceScore >= 4) {
      factors.push('High clinical relevance');
    }
    
    return factors;
  }

  private calculateResponseTime(urgencyScore: number): string {
    if (urgencyScore >= 9) return '4 hours';
    if (urgencyScore >= 7) return '24 hours';
    if (urgencyScore >= 5) return '3 days';
    if (urgencyScore >= 3) return '1 week';
    return '2 weeks';
  }

  private async getTherapistProfile(therapistId: string): Promise<any> {
    // In production, fetch from Firestore
    return {
      experienceLevel: 8,
      specializations: ['trauma', 'anxiety', 'depression'],
      techComfortLevel: 'intermediate',
      aiExperienceLevel: 'basic'
    };
  }

  private async findRelatedFeedback(feedback: TherapistFeedback): Promise<string[]> {
    // In production, use vector similarity or keyword matching
    return []; // Mock empty related feedback
  }

  private async storeFeedback(
    feedbackId: string,
    feedback: TherapistFeedback,
    analytics: FeedbackAnalytics
  ): Promise<void> {
    // In production, store in Firestore with proper security rules
    console.log(`Storing feedback ${feedbackId}`, { feedback, analytics });
  }

  private async routeFeedback(
    feedback: TherapistFeedback,
    analytics: FeedbackAnalytics
  ): Promise<{ team: string; estimatedResponse: string }> {
    // Route based on urgency and category
    if (analytics.urgency.requiresImmediateAttention) {
      return { team: 'urgent_response_team', estimatedResponse: '4 hours' };
    }
    
    return { 
      team: analytics.suggestedAssignees[0] || 'general_team',
      estimatedResponse: this.calculateResponseTime(analytics.urgency.score)
    };
  }

  private async sendAcknowledgment(
    therapistId: string,
    feedbackId: string,
    routing: { team: string; estimatedResponse: string }
  ): Promise<void> {
    // In production, send email/in-app notification
    console.log(`Acknowledgment sent to therapist ${therapistId} for feedback ${feedbackId}`);
  }

  private async alertUrgentFeedback(
    feedbackId: string,
    feedback: TherapistFeedback,
    analytics: FeedbackAnalytics
  ): Promise<void> {
    // In production, send Slack alerts, emails, or SMS to on-call team
    console.log(`URGENT FEEDBACK ALERT: ${feedbackId}`, {
      category: feedback.category,
      urgencyScore: analytics.urgency.score,
      clinicalRisk: analytics.impactMetrics.clinicalRiskLevel
    });
  }

  /**
   * Retrieve feedback analytics dashboard data
   */
  async getFeedbackAnalyticsDashboard(filters?: {
    category?: string;
    priority?: string;
    dateRange?: { start: Date; end: Date };
    therapistId?: string;
    groupId?: string;
  }): Promise<{
    summary: {
      totalFeedback: number;
      avgRating: number;
      responseRate: number;
      urgentCount: number;
    };
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
    trends: {
      satisfaction: Array<{ date: string; score: number }>;
      volume: Array<{ date: string; count: number }>;
    };
    topIssues: Array<{
      title: string;
      category: string;
      count: number;
      avgUrgency: number;
    }>;
  }> {
    // In production, query Firestore with filters and aggregations
    return {
      summary: {
        totalFeedback: 156,
        avgRating: 7.8,
        responseRate: 94.2,
        urgentCount: 8
      },
      byCategory: {
        'crisis_detection_accuracy': 45,
        'ai_clinical_insights': 32,
        'professional_typeof window !== 'undefined' && documentation': 28,
        'hipaa_compliance_experience': 22,
        'user_interface_clinical_workflow': 29
      },
      byPriority: {
        'critical_blocker': 8,
        'high_impact': 34,
        'moderate_improvement': 67,
        'nice_to_have': 38,
        'future_consideration': 9
      },
      trends: {
        satisfaction: [
          { date: '2024-01-15', score: 7.2 },
          { date: '2024-01-22', score: 7.5 },
          { date: '2024-01-29', score: 7.8 },
          { date: '2024-02-05', score: 8.1 }
        ],
        volume: [
          { date: '2024-01-15', count: 12 },
          { date: '2024-01-22', count: 18 },
          { date: '2024-01-29', count: 23 },
          { date: '2024-02-05', count: 19 }
        ]
      },
      topIssues: [
        {
          title: 'Crisis detection false positives',
          category: 'crisis_detection_accuracy',
          count: 12,
          avgUrgency: 8.3
        },
        {
          title: 'AI insights lack context',
          category: 'ai_clinical_insights',
          count: 9,
          avgUrgency: 6.7
        }
      ]
    };
  }
}