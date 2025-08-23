// ALCHM Pathway Template Registry - TT6-Aligned Architecture
// Trauma-informed, tiered template system with cultural responsiveness

import { 
  PathwayTemplate, 
  PathwayCategory, 
  AgeGroup, 
  CulturalContext,
  SELCompetencyScore,
  PathwayStep,
  StepContent,
  AIPromptConfig
} from '@/types/pathways-schema';
import { db } from '@/lib/firebaseAdmin';
import { validateSession } from '@/lib/validateSession';

export interface TT6AlignmentCriteria {
  traumaInformed: boolean;          // Meets trauma-informed care standards
  culturallyResponsive: boolean;    // Culturally adapted content
  developmentallyAppropriate: boolean; // Age-appropriate design
  strengthsBased: boolean;          // Focuses on capabilities vs deficits
  collaborativeApproach: boolean;   // Includes youth voice/choice
  safetyOriented: boolean;         // Prioritizes emotional/physical safety
}

export interface PathwayTemplateMetadata {
  templateId: string;
  tt6Alignment: TT6AlignmentCriteria;
  evidenceBase: EvidenceMetrics;
  culturalValidation: CulturalValidationData;
  outcomeMetrics: OutcomeExpectations;
  accessTier: 'foundation' | 'enhanced' | 'premium' | 'clinical';
  safetyRating: SafetyRating;
  lastValidated: Date;
  validationExpiry: Date;
  createdBy: string;
  reviewedBy: string[];
}

export interface EvidenceMetrics {
  researchBasis: string[];          // Research citations
  pilotTestResults: PilotTestData;
  userOutcomes: UserOutcomeData;
  culturalEfficacy: CulturalEfficacyData;
  safetyRecord: SafetyRecord;
}

export interface PilotTestData {
  participantCount: number;
  demographics: Record<string, number>;
  completionRate: number;
  engagementScore: number;
  outcomeImprovement: Partial<SELCompetencyScore>;
  culturalResonance: number;
  safetyIncidents: number;
}

export interface UserOutcomeData {
  totalUsers: number;
  avgCompletionRate: number;
  avgSELGrowth: SELCompetencyScore;
  longTermRetention: number;        // 6+ month engagement
  crisisPreventionRate: number;
  positiveOutcomeReports: number;
}

export interface CulturalEfficacyData {
  validatedCultures: string[];
  adaptationQuality: Record<string, number>;
  communityFeedback: CommunityFeedbackData[];
  culturalExpertReview: ExpertReviewData[];
}

export interface SafetyRecord {
  safetyIncidents: SafetyIncident[];
  riskMitigationStrategies: string[];
  traumaPreventionMeasures: string[];
  crisisInterventionTriggers: string[];
}

export interface SafetyIncident {
  incidentType: 'emotional_distress' | 'trauma_trigger' | 'crisis_escalation' | 'cultural_insensitivity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolution: string;
  preventionMeasures: string[];
  timestamp: Date;
}

export interface SafetyRating {
  overallRating: 'excellent' | 'good' | 'adequate' | 'needs_improvement' | 'restricted';
  traumaInformedScore: number;      // 0-100
  culturalSafetyScore: number;      // 0-100
  crisisPreventionScore: number;    // 0-100
  ageAppropriatenessScore: number;  // 0-100
  restrictions: string[];           // Any usage restrictions
}

export interface OutcomeExpectations {
  primaryObjectives: string[];
  measurableOutcomes: MeasurableOutcome[];
  timeToImpact: TimeToImpactData;
  successCriteria: SuccessCriteria;
}

export interface MeasurableOutcome {
  metric: string;
  baselineRange: [number, number];
  targetImprovement: number;
  timeframe: string;
  measurementMethod: string;
}

export interface TimeToImpactData {
  immediateAwareness: number;       // Days to see awareness growth
  behaviorChange: number;           // Days to see behavior change  
  skillIntegration: number;         // Days to integrate skills
  longTermRetention: number;        // Days for long-term retention
}

export interface SuccessCriteria {
  minimumCompletionRate: number;
  minimumEngagementScore: number;
  minimumSELGrowth: Partial<SELCompetencyScore>;
  maximumDropoffRate: number;
  minimumSafetyRating: number;
}

export interface CommunityFeedbackData {
  culturalGroup: string;
  feedbackSource: string;
  resonanceScore: number;           // 0-100
  appropriatenessScore: number;     // 0-100
  recommendations: string[];
  concerns: string[];
  endorsement: boolean;
}

export interface ExpertReviewData {
  expertId: string;
  expertise: string[];
  culturalBackground: string;
  reviewScore: number;              // 0-100
  recommendations: string[];
  approvalStatus: 'approved' | 'conditional' | 'rejected';
  reviewDate: Date;
}

export class PathwayRegistry {
  private static instance: PathwayRegistry;
  private templateCache: Map<string, PathwayTemplate> = new Map();
  private metadataCache: Map<string, PathwayTemplateMetadata> = new Map();

  private constructor() {}

  static getInstance(): PathwayRegistry {
    if (!PathwayRegistry.instance) {
      PathwayRegistry.instance = new PathwayRegistry();
    }
    return PathwayRegistry.instance;
  }

  /**
   * Get pathway templates with TT6 alignment and cultural filtering
   */
  async getTemplates(criteria: {
    category?: PathwayCategory;
    ageGroup?: AgeGroup;
    culturalContext?: CulturalContext;
    accessTier?: string;
    traumaInformed?: boolean;
    safetyRating?: string;
    userId?: string;
  }): Promise<PathwayTemplate[]> {
    try {
      // Validate user access if userId provided
      if (criteria.userId) {
        await validateSession(criteria.userId);
      }

      // Build Firestore query
      let query = db.collection('pathway_templates');

      // Apply filters
      if (criteria.category) {
        query = query.where('category', '==', criteria.category);
      }
      if (criteria.ageGroup) {
        query = query.where('targetAge', '==', criteria.ageGroup);
      }
      if (criteria.accessTier) {
        query = query.where('metadata.accessTier', '==', criteria.accessTier);
      }

      // Add trauma-informed filter
      if (criteria.traumaInformed) {
        query = query.where('metadata.tt6Alignment.traumaInformed', '==', true);
      }

      // Add safety rating filter
      if (criteria.safetyRating) {
        query = query.where('metadata.safetyRating.overallRating', '>=', criteria.safetyRating);
      }

      query = query.where('isActive', '==', true);
      query = query.orderBy('metadata.evidenceBase.userOutcomes.avgCompletionRate', 'desc');

      const snapshot = await query.get();
      const templates: PathwayTemplate[] = [];

      for (const doc of snapshot.docs) {
        const template = { id: doc.id, ...doc.data() } as PathwayTemplate;
        
        // Apply cultural filtering
        if (criteria.culturalContext && !await this.isCulturallyAppropriate(template, criteria.culturalContext)) {
          continue;
        }

        // Cache template
        this.templateCache.set(template.id, template);
        templates.push(template);
      }

      return templates;

    } catch (error) {
      console.error('Error getting pathway templates:', error);
      return [];
    }
  }

  /**
   * Get specific template with full metadata
   */
  async getTemplate(templateId: string, userId?: string): Promise<{
    template: PathwayTemplate;
    metadata: PathwayTemplateMetadata;
  } | null> {
    try {
      if (userId) {
        await validateSession(userId);
      }

      // Check cache first
      const cachedTemplate = this.templateCache.get(templateId);
      const cachedMetadata = this.metadataCache.get(templateId);

      if (cachedTemplate && cachedMetadata) {
        return { template: cachedTemplate, metadata: cachedMetadata };
      }

      // Fetch from database
      const templateDoc = await db.collection('pathway_templates').doc(templateId).get();
      if (!templateDoc.exists) {
        return null;
      }

      const template = { id: templateDoc.id, ...templateDoc.data() } as PathwayTemplate;
      const metadata = template.metadata as PathwayTemplateMetadata;

      // Cache for future use
      this.templateCache.set(templateId, template);
      this.metadataCache.set(templateId, metadata);

      return { template, metadata };

    } catch (error) {
      console.error('Error getting pathway template:', error);
      return null;
    }
  }

  /**
   * Create new pathway template with TT6 validation
   */
  async createTemplate(
    template: Omit<PathwayTemplate, 'id' | 'createdAt' | 'updatedAt'>,
    metadata: Omit<PathwayTemplateMetadata, 'templateId' | 'lastValidated'>,
    creatorId: string
  ): Promise<string> {
    try {
      await validateSession(creatorId);

      // Validate TT6 alignment
      const tt6Validation = await this.validateTT6Alignment(template, metadata.tt6Alignment);
      if (!tt6Validation.isValid) {
        throw new Error(`TT6 validation failed: ${tt6Validation.errors.join(', ')}`);
      }

      // Validate cultural responsiveness
      const culturalValidation = await this.validateCulturalResponsiveness(template);
      if (!culturalValidation.isValid) {
        throw new Error(`Cultural validation failed: ${culturalValidation.errors.join(', ')}`);
      }

      // Generate safety rating
      const safetyRating = await this.generateSafetyRating(template);

      const now = new Date();
      const templateId = db.collection('pathway_templates').doc().id;

      const completeTemplate: PathwayTemplate = {
        ...template,
        id: templateId,
        createdAt: now,
        updatedAt: now,
        createdBy: creatorId
      };

      const completeMetadata: PathwayTemplateMetadata = {
        ...metadata,
        templateId,
        safetyRating,
        lastValidated: now,
        validationExpiry: new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)), // 90 days
        createdBy: creatorId,
        reviewedBy: []
      };

      // Attach metadata to template
      completeTemplate.metadata = completeMetadata;

      // Save to database
      await db.collection('pathway_templates').doc(templateId).set(completeTemplate);

      // Create template audit log
      await this.createAuditLog({
        templateId,
        action: 'created',
        userId: creatorId,
        timestamp: now,
        details: {
          tt6Alignment: metadata.tt6Alignment,
          safetyRating: safetyRating.overallRating,
          accessTier: metadata.accessTier
        }
      });

      return templateId;

    } catch (error) {
      console.error('Error creating pathway template:', error);
      throw error;
    }
  }

  /**
   * Recommend pathways based on user profile and needs
   */
  async recommendPathways(
    userId: string,
    userProfile: {
      ageGroup: AgeGroup;
      culturalContext: CulturalContext;
      currentSELScores: SELCompetencyScore;
      interests: string[];
      traumaHistory?: boolean;
      accessTier: string;
    },
    limit: number = 5
  ): Promise<Array<{
    template: PathwayTemplate;
    relevanceScore: number;
    reasoning: string;
    adaptations: string[];
  }>> {
    try {
      await validateSession(userId);

      // Get user's pathway history
      const completedPathways = await this.getUserCompletedPathways(userId);
      
      // Get all appropriate templates
      const templates = await this.getTemplates({
        ageGroup: userProfile.ageGroup,
        culturalContext: userProfile.culturalContext,
        accessTier: userProfile.accessTier,
        traumaInformed: userProfile.traumaHistory,
        userId
      });

      // Score and rank templates
      const recommendations = [];
      for (const template of templates) {
        // Skip already completed pathways
        if (completedPathways.includes(template.id)) {
          continue;
        }

        const score = await this.calculateRelevanceScore(template, userProfile);
        const reasoning = this.generateRecommendationReasoning(template, userProfile, score);
        const adaptations = await this.suggestAdaptations(template, userProfile);

        recommendations.push({
          template,
          relevanceScore: score.total,
          reasoning,
          adaptations
        });
      }

      // Sort by relevance and return top recommendations
      recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
      return recommendations.slice(0, limit);

    } catch (error) {
      console.error('Error recommending pathways:', error);
      return [];
    }
  }

  /**
   * Validate TT6 trauma-informed alignment
   */
  private async validateTT6Alignment(
    template: Omit<PathwayTemplate, 'id' | 'createdAt' | 'updatedAt'>,
    alignment: TT6AlignmentCriteria
  ): Promise<{ isValid: boolean; errors: string[]; score: number }> {
    const errors: string[] = [];
    let score = 0;

    // Check trauma-informed criteria
    if (alignment.traumaInformed) {
      const traumaScore = this.validateTraumaInformedContent(template);
      score += traumaScore;
      if (traumaScore < 70) {
        errors.push('Template does not meet trauma-informed care standards');
      }
    }

    // Check culturally responsive criteria
    if (alignment.culturallyResponsive) {
      const culturalScore = this.validateCulturalResponsiveness(template);
      score += culturalScore.score;
      if (culturalScore.score < 70) {
        errors.push('Template lacks adequate cultural responsiveness');
      }
    }

    // Check developmental appropriateness
    if (alignment.developmentallyAppropriate) {
      const devScore = this.validateDevelopmentalAppropriateness(template);
      score += devScore;
      if (devScore < 70) {
        errors.push('Template content is not developmentally appropriate');
      }
    }

    // Check strengths-based approach
    if (alignment.strengthsBased) {
      const strengthsScore = this.validateStrengthsBasedApproach(template);
      score += strengthsScore;
      if (strengthsScore < 70) {
        errors.push('Template does not adequately emphasize strengths-based approach');
      }
    }

    // Check collaborative approach
    if (alignment.collaborativeApproach) {
      const collabScore = this.validateCollaborativeApproach(template);
      score += collabScore;
      if (collabScore < 70) {
        errors.push('Template lacks adequate youth voice and choice elements');
      }
    }

    // Check safety orientation
    if (alignment.safetyOriented) {
      const safetyScore = this.validateSafetyOrientation(template);
      score += safetyScore;
      if (safetyScore < 70) {
        errors.push('Template does not adequately prioritize emotional safety');
      }
    }

    const avgScore = score / 6; // Average across criteria
    const isValid = errors.length === 0 && avgScore >= 70;

    return { isValid, errors, score: avgScore };
  }

  private validateTraumaInformedContent(template: any): number {
    let score = 0;
    
    // Check for trauma-sensitive language
    const traumaSensitiveWords = ['safe', 'choice', 'collaboration', 'trustworthiness', 'transparency'];
    const content = JSON.stringify(template).toLowerCase();
    
    traumaSensitiveWords.forEach(word => {
      if (content.includes(word)) score += 15;
    });

    // Check for trigger warnings and safety considerations
    if (template.steps.some((step: PathwayStep) => 
      step.validationCriteria?.requiredElements?.includes('safety_check'))) {
      score += 25;
    }

    return Math.min(100, score);
  }

  private validateCulturalResponsiveness(template: any): { isValid: boolean; errors: string[]; score: number } {
    let score = 0;
    const errors: string[] = [];

    // Check for cultural adaptations
    if (template.culturalAdaptations && template.culturalAdaptations.length > 0) {
      score += 30;
    } else {
      errors.push('No cultural adaptations specified');
    }

    // Check for contextual prompts
    const hasContextualPrompts = template.steps.some((step: PathwayStep) =>
      step.content.contextualPrompts && Object.keys(step.content.contextualPrompts).length > 0
    );
    
    if (hasContextualPrompts) {
      score += 25;
    } else {
      errors.push('Steps lack contextual cultural prompts');
    }

    // Check for diverse examples
    const hasDiverseExamples = template.steps.some((step: PathwayStep) =>
      step.content.examples && step.content.examples.length > 1
    );
    
    if (hasDiverseExamples) {
      score += 25;
    }

    // Check for language considerations
    if (template.metadata?.culturalValidation?.validatedCultures?.length > 2) {
      score += 20;
    }

    return {
      isValid: score >= 70,
      errors,
      score
    };
  }

  private validateDevelopmentalAppropriateness(template: any): number {
    let score = 50; // Base score

    // Check estimated duration appropriateness
    const avgDuration = template.estimatedDurationMinutes;
    if (template.targetAge === 'early_adolescent' && avgDuration <= 45) score += 15;
    if (template.targetAge === 'mid_adolescent' && avgDuration <= 60) score += 15;
    if (template.targetAge === 'late_adolescent' && avgDuration <= 75) score += 15;

    // Check interactive elements
    const hasInteractiveElements = template.steps.some((step: PathwayStep) =>
      step.content.interactiveElements && step.content.interactiveElements.length > 0
    );
    if (hasInteractiveElements) score += 20;

    // Check for age-appropriate language complexity
    // This would need NLP analysis in production
    score += 15; // Placeholder

    return Math.min(100, score);
  }

  private validateStrengthsBasedApproach(template: any): number {
    let score = 0;
    const content = JSON.stringify(template).toLowerCase();

    // Check for strengths-focused language
    const strengthsWords = ['strength', 'ability', 'capable', 'resource', 'resilience', 'growth'];
    strengthsWords.forEach(word => {
      if (content.includes(word)) score += 10;
    });

    // Check for celebration elements
    if (template.steps.some((step: PathwayStep) => step.type === 'progress_celebration')) {
      score += 25;
    }

    return Math.min(100, score);
  }

  private validateCollaborativeApproach(template: any): number {
    let score = 0;

    // Check for choice elements
    const hasChoices = template.steps.some((step: PathwayStep) =>
      step.content.interactiveElements?.some(elem => elem.type === 'choice_selection')
    );
    if (hasChoices) score += 30;

    // Check for open-ended reflections
    const hasOpenEnded = template.steps.some((step: PathwayStep) =>
      step.content.reflectionQuestions?.some(q => q.type === 'open_ended')
    );
    if (hasOpenEnded) score += 25;

    // Check for peer interaction
    if (template.steps.some((step: PathwayStep) => step.type === 'peer_interaction')) {
      score += 25;
    }

    // Check for optional steps
    if (template.steps.some((step: PathwayStep) => step.isOptional)) {
      score += 20;
    }

    return Math.min(100, score);
  }

  private validateSafetyOrientation(template: any): number {
    let score = 0;

    // Check for safety validation criteria
    const hasSafetyValidation = template.steps.some((step: PathwayStep) =>
      step.validationCriteria?.requiredElements?.includes('emotional_safety_check')
    );
    if (hasSafetyValidation) score += 40;

    // Check for crisis intervention triggers
    const hasCrisisTriggers = template.steps.some((step: PathwayStep) =>
      step.triggers?.some(trigger => trigger.action.type === 'provide_support')
    );
    if (hasCrisisTriggers) score += 30;

    // Check for graduated disclosure
    if (template.difficultyLevel === 'foundation') score += 30;

    return Math.min(100, score);
  }

  private async generateSafetyRating(template: any): Promise<SafetyRating> {
    const traumaScore = this.validateTraumaInformedContent(template);
    const culturalScore = this.validateCulturalResponsiveness(template).score;
    const crisisScore = this.validateSafetyOrientation(template);
    const ageScore = this.validateDevelopmentalAppropriateness(template);

    const averageScore = (traumaScore + culturalScore + crisisScore + ageScore) / 4;

    let overallRating: SafetyRating['overallRating'];
    if (averageScore >= 90) overallRating = 'excellent';
    else if (averageScore >= 80) overallRating = 'good';
    else if (averageScore >= 70) overallRating = 'adequate';
    else if (averageScore >= 60) overallRating = 'needs_improvement';
    else overallRating = 'restricted';

    return {
      overallRating,
      traumaInformedScore: traumaScore,
      culturalSafetyScore: culturalScore,
      crisisPreventionScore: crisisScore,
      ageAppropriatenessScore: ageScore,
      restrictions: overallRating === 'restricted' ? ['Requires supervision', 'Additional safety measures needed'] : []
    };
  }

  private async isCulturallyAppropriate(template: PathwayTemplate, culturalContext: CulturalContext): Promise<boolean> {
    // Check if template has been validated for this culture
    const metadata = template.metadata as PathwayTemplateMetadata;
    if (!metadata?.culturalValidation) return true; // Default to inclusive

    const validatedCultures = metadata.culturalValidation.validatedCultures || [];
    
    // Check for cultural background match
    const culturalMatch = culturalContext.culturalBackground.some(bg =>
      validatedCultures.includes(bg) || validatedCultures.includes('universal')
    );

    // Check communication style compatibility
    const hasContextualPrompts = template.steps.some(step =>
      step.content.contextualPrompts && Object.keys(step.content.contextualPrompts).length > 0
    );

    return culturalMatch || hasContextualPrompts;
  }

  private async getUserCompletedPathways(userId: string): Promise<string[]> {
    try {
      const snapshot = await db
        .collection('users')
        .doc(userId)
        .collection('pathways')
        .where('isCompleted', '==', true)
        .get();

      return snapshot.docs.map(doc => doc.data().pathwayTemplateId);
    } catch (error) {
      console.error('Error getting user completed pathways:', error);
      return [];
    }
  }

  private async calculateRelevanceScore(template: PathwayTemplate, userProfile: any): Promise<{
    total: number;
    breakdown: Record<string, number>;
  }> {
    const scores = {
      selAlignment: 0,
      culturalFit: 0,
      ageAppropriate: 0,
      safetyLevel: 0,
      interestMatch: 0,
      evidenceBase: 0
    };

    // SEL alignment score (0-25 points)
    const selNeeds = this.identifySELNeeds(userProfile.currentSELScores);
    const templateFocus = template.SELCompetencyFocus;
    
    selNeeds.forEach(need => {
      if (templateFocus[need] && templateFocus[need]! > 0) {
        scores.selAlignment += 5;
      }
    });

    // Cultural fit score (0-20 points)
    const culturalFit = await this.isCulturallyAppropriate(template, userProfile.culturalContext);
    scores.culturalFit = culturalFit ? 20 : 5;

    // Age appropriate score (0-20 points)
    scores.ageAppropriate = template.targetAge === userProfile.ageGroup ? 20 : 0;

    // Safety level score (0-15 points)
    const metadata = template.metadata as PathwayTemplateMetadata;
    if (metadata?.safetyRating) {
      const safetyScores = {
        'excellent': 15,
        'good': 12,
        'adequate': 8,
        'needs_improvement': 4,
        'restricted': 0
      };
      scores.safetyLevel = safetyScores[metadata.safetyRating.overallRating];
    }

    // Interest match score (0-10 points)
    const categoryInterest = userProfile.interests.includes(template.category);
    scores.interestMatch = categoryInterest ? 10 : 0;

    // Evidence base score (0-10 points)
    if (metadata?.evidenceBase?.userOutcomes) {
      const completionRate = metadata.evidenceBase.userOutcomes.avgCompletionRate;
      scores.evidenceBase = Math.min(10, completionRate / 10);
    }

    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);

    return { total, breakdown: scores };
  }

  private identifySELNeeds(selScores: SELCompetencyScore): (keyof SELCompetencyScore)[] {
    const needs: (keyof SELCompetencyScore)[] = [];
    const threshold = 70; // Scores below this indicate growth opportunities

    Object.entries(selScores).forEach(([competency, score]) => {
      if (score < threshold) {
        needs.push(competency as keyof SELCompetencyScore);
      }
    });

    return needs;
  }

  private generateRecommendationReasoning(template: PathwayTemplate, userProfile: any, score: any): string {
    const reasons = [];

    if (score.breakdown.selAlignment > 15) {
      reasons.push(`Aligns with your current SEL development needs`);
    }
    if (score.breakdown.culturalFit === 20) {
      reasons.push(`Culturally adapted for your background`);
    }
    if (score.breakdown.ageAppropriate === 20) {
      reasons.push(`Designed specifically for your age group`);
    }
    if (score.breakdown.safetyLevel >= 12) {
      reasons.push(`Meets high safety and trauma-informed standards`);
    }
    if (score.breakdown.interestMatch === 10) {
      reasons.push(`Matches your expressed interests in ${template.category}`);
    }

    return reasons.length > 0 ? reasons.join('. ') + '.' : 'Good foundational pathway for continued growth.';
  }

  private async suggestAdaptations(template: PathwayTemplate, userProfile: any): Promise<string[]> {
    const adaptations = [];

    // Cultural adaptations
    if (userProfile.culturalContext.communicationStyle === 'indirect') {
      adaptations.push('Prompts adapted for indirect communication style');
    }

    // Trauma adaptations
    if (userProfile.traumaHistory) {
      adaptations.push('Enhanced safety measures and trauma-informed modifications');
    }

    // Age adaptations
    if (userProfile.ageGroup === 'early_adolescent') {
      adaptations.push('Shortened reflection periods and increased interactive elements');
    }

    return adaptations;
  }

  private async createAuditLog(logData: {
    templateId: string;
    action: string;
    userId: string;
    timestamp: Date;
    details: Record<string, any>;
  }): Promise<void> {
    try {
      await db.collection('pathway_template_audit_logs').add(logData);
    } catch (error) {
      console.error('Error creating audit log:', error);
    }
  }

  /**
   * Clear caches (useful for testing and development)
   */
  clearCaches(): void {
    this.templateCache.clear();
    this.metadataCache.clear();
  }
}

export default PathwayRegistry;