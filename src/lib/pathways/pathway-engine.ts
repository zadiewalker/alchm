// ALCHM Pathways Engine - Soul-Centered Systems Architecture
// AI-augmented journeys for transformative SEL

import { 
  PathwayProgress, 
  PathwayTemplate, 
  PathwayStep, 
  PathwayAIInsight,
  SELCompetencyScore,
  EmotionalState,
  PathwayMilestone,
  CulturalContext
} from '@/types/pathways-schema';
import { db } from '@/lib/firebaseAdmin';
import { generateGeminiInsight } from '@/lib/ai/gemini-pathways';
import { generateGPTMentorship } from '@/lib/ai/gpt-pathways';
import { validateSession } from '@/lib/validateSession';

export class PathwayEngine {
  private userId: string;
  private pathwayId: string;
  private progress: PathwayProgress | null = null;
  private template: PathwayTemplate | null = null;

  constructor(userId: string, pathwayId: string) {
    this.userId = userId;
    this.pathwayId = pathwayId;
  }

  /**
   * Initialize or resume a pathway journey
   */
  async initializePathway(templateId: string): Promise<PathwayProgress> {
    try {
      // Validate user session
      await validateSession(this.userId);

      // Load pathway template
      this.template = await this.loadPathwayTemplate(templateId);
      if (!this.template) {
        throw new Error(`Pathway template ${templateId} not found`);
      }

      // Check for existing progress
      this.progress = await this.loadPathwayProgress();

      if (!this.progress) {
        // Create new pathway progress
        this.progress = await this.createNewPathwayProgress(templateId);
      }

      // Update last accessed timestamp
      await this.updateLastAccessed();

      return this.progress;
    } catch (error) {
      console.error('Error initializing pathway:', error);
      throw error;
    }
  }

  /**
   * Get current step with AI-enhanced prompts
   */
  async getCurrentStep(): Promise<{
    step: PathwayStep;
    aiEnhancedPrompts: {
      mentorPrompt: string;
      reflectionPrompt: string;
      encouragementMessage: string;
    };
    culturalAdaptations: Record<string, string>;
  }> {
    if (!this.progress || !this.template) {
      throw new Error('Pathway not initialized');
    }

    const currentStep = this.template.steps.find(
      step => step.id === this.progress!.currentStep
    );

    if (!currentStep) {
      throw new Error('Current step not found');
    }

    // Generate AI-enhanced prompts
    const aiEnhancedPrompts = await this.generateAIEnhancedPrompts(currentStep);

    // Apply cultural adaptations
    const culturalAdaptations = await this.applyCulturalAdaptations(
      currentStep,
      this.progress.culturalContext
    );

    return {
      step: currentStep,
      aiEnhancedPrompts,
      culturalAdaptations
    };
  }

  /**
   * Submit step completion with AI analysis
   */
  async completeStep(
    stepId: string,
    userInput: {
      reflections: string[];
      journalEntry?: string;
      interactiveResponses: Record<string, any>;
      emotionalState?: EmotionalState;
      timeSpentMs: number;
    }
  ): Promise<{
    aiInsights: PathwayAIInsight[];
    nextStep?: PathwayStep;
    milestones: PathwayMilestone[];
    SELGrowth: Partial<SELCompetencyScore>;
  }> {
    if (!this.progress || !this.template) {
      throw new Error('Pathway not initialized');
    }

    try {
      // Validate step completion
      const step = this.template.steps.find(s => s.id === stepId);
      if (!step) {
        throw new Error('Step not found');
      }

      // Generate AI insights using both Gemini and GPT
      const aiInsights = await this.generateStepInsights(step, userInput);

      // Calculate SEL growth
      const selGrowth = await this.calculateSELGrowth(stepId, userInput, aiInsights);

      // Check for milestones
      const milestones = await this.checkMilestones(stepId, aiInsights, selGrowth);

      // Update step progress
      await this.updateStepProgress(stepId, userInput, aiInsights);

      // Determine next step
      const nextStep = await this.determineNextStep(stepId, aiInsights);

      // Update overall pathway progress
      await this.updatePathwayProgress(selGrowth, milestones);

      return {
        aiInsights,
        nextStep: nextStep || undefined,
        milestones,
        SELGrowth: selGrowth
      };

    } catch (error) {
      console.error('Error completing step:', error);
      throw error;
    }
  }

  /**
   * Generate AI-enhanced prompts for current step
   */
  private async generateAIEnhancedPrompts(step: PathwayStep): Promise<{
    mentorPrompt: string;
    reflectionPrompt: string;
    encouragementMessage: string;
  }> {
    try {
      const userContext = await this.buildUserContext();

      // GPT for mentor-style guidance
      const mentorPrompt = await generateGPTMentorship({
        stepContent: step.content.primaryPrompt,
        userContext,
        promptType: 'mentor',
        culturalContext: this.progress!.culturalContext
      });

      // Gemini for reflection analysis and prompting
      const reflectionPrompt = await generateGeminiInsight({
        type: 'reflection_prompt',
        stepContent: step.content.primaryPrompt,
        userProgress: this.progress!,
        culturalContext: this.progress!.culturalContext
      });

      // GPT for encouragement based on progress
      const encouragementMessage = await generateGPTMentorship({
        stepContent: step.content.primaryPrompt,
        userContext,
        promptType: 'encouragement',
        culturalContext: this.progress!.culturalContext
      });

      return {
        mentorPrompt: mentorPrompt.content,
        reflectionPrompt: reflectionPrompt.content,
        encouragementMessage: encouragementMessage.content
      };

    } catch (error) {
      console.error('Error generating AI prompts:', error);
      // Return fallback prompts
      return {
        mentorPrompt: step.content.primaryPrompt,
        reflectionPrompt: 'Take a moment to reflect on your thoughts and feelings.',
        encouragementMessage: 'You\'re doing great! Keep exploring and growing.'
      };
    }
  }

  /**
   * Apply cultural adaptations to step content
   */
  private async applyCulturalAdaptations(
    step: PathwayStep,
    culturalContext: CulturalContext
  ): Promise<Record<string, string>> {
    try {
      const adaptations: Record<string, string> = {};

      // Apply language adaptations
      if (culturalContext.primaryLanguage !== 'en') {
        // In production, integrate with translation service
        adaptations.languageNote = `Content adapted for ${culturalContext.primaryLanguage} speakers`;
      }

      // Apply cultural context adaptations
      if (step.content.contextualPrompts) {
        for (const [context, prompt] of Object.entries(step.content.contextualPrompts)) {
          if (culturalContext.culturalBackground.includes(context)) {
            adaptations[context] = prompt;
          }
        }
      }

      // Apply communication style adaptations
      const communicationStyle = culturalContext.communicationStyle;
      if (communicationStyle === 'indirect' || communicationStyle === 'high_context') {
        adaptations.communicationNote = 'Prompts adapted for indirect communication preference';
      }

      return adaptations;

    } catch (error) {
      console.error('Error applying cultural adaptations:', error);
      return {};
    }
  }

  /**
   * Generate AI insights for completed step
   */
  private async generateStepInsights(
    step: PathwayStep,
    userInput: any
  ): Promise<PathwayAIInsight[]> {
    const insights: PathwayAIInsight[] = [];

    try {
      // Gemini analysis for mood, bias detection, and SEL scoring
      const geminiInsight = await generateGeminiInsight({
        type: 'step_completion_analysis',
        stepContent: step.content.primaryPrompt,
        userInput: userInput.reflections.join(' ') + (userInput.journalEntry || ''),
        userProgress: this.progress!,
        culturalContext: this.progress!.culturalContext
      });

      insights.push({
        id: `gemini_${Date.now()}`,
        userId: this.userId,
        pathwayId: this.pathwayId,
        stepId: step.id,
        insightType: 'emotional_pattern',
        content: geminiInsight.content,
        confidence: geminiInsight.confidence,
        timestamp: new Date(),
        aiProvider: 'gemini',
        triggers: ['step_completion'],
        recommendations: geminiInsight.recommendations,
        emotionalState: geminiInsight.emotionalState,
        SELGrowthIndicators: geminiInsight.selGrowthIndicators,
        culturalConsiderations: geminiInsight.culturalConsiderations
      });

      // GPT analysis for mentorship and visionary guidance
      const gptInsight = await generateGPTMentorship({
        stepContent: step.content.primaryPrompt,
        userContext: await this.buildUserContext(),
        promptType: 'insight_analysis',
        culturalContext: this.progress!.culturalContext,
        userReflections: userInput.reflections
      });

      insights.push({
        id: `gpt_${Date.now()}`,
        userId: this.userId,
        pathwayId: this.pathwayId,
        stepId: step.id,
        insightType: 'growth_opportunity',
        content: gptInsight.content,
        confidence: gptInsight.confidence,
        timestamp: new Date(),
        aiProvider: 'gpt',
        triggers: ['step_completion'],
        recommendations: gptInsight.recommendations,
        emotionalState: gptInsight.emotionalState,
        SELGrowthIndicators: [],
        culturalConsiderations: []
      });

      return insights;

    } catch (error) {
      console.error('Error generating step insights:', error);
      return [];
    }
  }

  /**
   * Calculate SEL competency growth from step completion
   */
  private async calculateSELGrowth(
    stepId: string,
    userInput: any,
    aiInsights: PathwayAIInsight[]
  ): Promise<Partial<SELCompetencyScore>> {
    try {
      const step = this.template!.steps.find(s => s.id === stepId);
      if (!step) return {};

      const growth: Partial<SELCompetencyScore> = {};

      // Analyze reflection depth and emotional awareness
      const reflectionText = userInput.reflections.join(' ') + (userInput.journalEntry || '');
      const wordCount = reflectionText.split(' ').length;
      const emotionalWords = this.countEmotionalWords(reflectionText);

      // Self-awareness growth
      if (emotionalWords > 5 && wordCount > 50) {
        growth.selfAwareness = Math.min(5, Math.floor(emotionalWords / 2));
      }

      // Social awareness growth based on perspective-taking
      const perspectiveIndicators = this.countPerspectiveIndicators(reflectionText);
      if (perspectiveIndicators > 0) {
        growth.socialAwareness = Math.min(3, perspectiveIndicators);
      }

      // Decision-making growth based on consideration of consequences
      const decisionIndicators = this.countDecisionIndicators(reflectionText);
      if (decisionIndicators > 0) {
        growth.responsibleDecisionMaking = Math.min(4, decisionIndicators);
      }

      // AI-informed growth adjustments
      for (const insight of aiInsights) {
        for (const growthIndicator of insight.SELGrowthIndicators) {
          const competency = growthIndicator.competency;
          const currentGrowth = growth[competency] || 0;
          growth[competency] = Math.max(currentGrowth, growthIndicator.growthRate * 10);
        }
      }

      return growth;

    } catch (error) {
      console.error('Error calculating SEL growth:', error);
      return {};
    }
  }

  /**
   * Check for milestone achievements
   */
  private async checkMilestones(
    stepId: string,
    aiInsights: PathwayAIInsight[],
    selGrowth: Partial<SELCompetencyScore>
  ): Promise<PathwayMilestone[]> {
    const milestones: PathwayMilestone[] = [];

    try {
      // Check for breakthrough moments in AI insights
      for (const insight of aiInsights) {
        if (insight.insightType === 'celebration_moment') {
          milestones.push({
            id: `breakthrough_${Date.now()}`,
            stepId,
            type: 'breakthrough',
            title: 'Breakthrough Moment',
            description: insight.content,
            achievedAt: new Date(),
            impactScore: insight.confidence,
            celebrationMessage: 'Amazing insight! You\'ve made a real breakthrough in understanding yourself.'
          });
        }
      }

      // Check for significant SEL growth
      const totalGrowth = Object.values(selGrowth).reduce((sum, growth) => sum + (growth || 0), 0);
      if (totalGrowth > 10) {
        milestones.push({
          id: `sel_growth_${Date.now()}`,
          stepId,
          type: 'reflection_depth',
          title: 'Deep Reflection Achievement',
          description: 'Significant growth in multiple SEL competencies',
          achievedAt: new Date(),
          impactScore: totalGrowth,
          celebrationMessage: 'Your reflection shows incredible depth and growth across multiple areas!'
        });
      }

      // Check step-specific milestones
      const step = this.template!.steps.find(s => s.id === stepId);
      if (step && this.isFirstTimeCompletion(stepId)) {
        milestones.push({
          id: `step_completion_${stepId}`,
          stepId,
          type: 'insight_connection',
          title: `${step.title} Completed`,
          description: 'First time completing this transformative step',
          achievedAt: new Date(),
          impactScore: 5,
          celebrationMessage: `Congratulations on completing "${step.title}"! This is an important step in your journey.`
        });
      }

      return milestones;

    } catch (error) {
      console.error('Error checking milestones:', error);
      return [];
    }
  }

  /**
   * Determine next step based on progress and AI recommendations
   */
  private async determineNextStep(
    completedStepId: string,
    aiInsights: PathwayAIInsight[]
  ): Promise<PathwayStep | null> {
    try {
      if (!this.template) return null;

      const completedStep = this.template.steps.find(s => s.id === completedStepId);
      if (!completedStep) return null;

      // Find next step in sequence
      const nextStepOrder = completedStep.order + 1;
      let nextStep = this.template.steps.find(s => s.order === nextStepOrder);

      // AI-informed step recommendation
      for (const insight of aiInsights) {
        for (const recommendation of insight.recommendations) {
          if (recommendation.type === 'next_step' && recommendation.priority === 'high') {
            // Look for recommended step
            const recommendedStep = this.template.steps.find(
              s => s.title.toLowerCase().includes(recommendation.title.toLowerCase())
            );
            if (recommendedStep) {
              nextStep = recommendedStep;
              break;
            }
          }
        }
      }

      // Check unlock conditions
      if (nextStep && !await this.checkUnlockConditions(nextStep)) {
        // Find alternative step or skip to next available
        const availableSteps = this.template.steps.filter(
          s => s.order > completedStep.order && this.checkUnlockConditions(s)
        );
        nextStep = availableSteps[0] || null;
      }

      return nextStep;

    } catch (error) {
      console.error('Error determining next step:', error);
      return null;
    }
  }

  /**
   * Build comprehensive user context for AI prompting
   */
  private async buildUserContext(): Promise<Record<string, any>> {
    if (!this.progress) return {};

    return {
      currentSELScores: this.progress.SELCompetencyScore,
      culturalContext: this.progress.culturalContext,
      engagementScore: this.progress.engagementScore,
      completionRate: this.progress.completionRate,
      recentMilestones: this.progress.milestones.slice(-3),
      timeInPathway: Date.now() - this.progress.startedAt.getTime(),
      personalizedElements: this.progress.personalizedElements
    };
  }

  /**
   * Utility methods for text analysis
   */
  private countEmotionalWords(text: string): number {
    const emotionalWords = [
      'feel', 'felt', 'emotion', 'happy', 'sad', 'angry', 'excited', 'nervous',
      'proud', 'ashamed', 'grateful', 'frustrated', 'content', 'anxious',
      'joy', 'fear', 'love', 'hate', 'hope', 'worry', 'calm', 'stressed'
    ];
    const words = text.toLowerCase().split(/\s+/);
    return words.filter(word => emotionalWords.some(em => word.includes(em))).length;
  }

  private countPerspectiveIndicators(text: string): number {
    const indicators = ['others might', 'from their perspective', 'they probably', 'others feel', 'someone else'];
    const lowerText = text.toLowerCase();
    return indicators.filter(indicator => lowerText.includes(indicator)).length;
  }

  private countDecisionIndicators(text: string): number {
    const indicators = ['if I', 'consequence', 'result', 'outcome', 'decision', 'choice', 'because'];
    const lowerText = text.toLowerCase();
    return indicators.filter(indicator => lowerText.includes(indicator)).length;
  }

  private isFirstTimeCompletion(stepId: string): boolean {
    if (!this.progress) return true;
    const stepProgress = this.progress.stepProgress[stepId];
    return !stepProgress || stepProgress.status !== 'completed';
  }

  private async checkUnlockConditions(step: PathwayStep): Promise<boolean> {
    // Simplified unlock logic - in production would be more sophisticated
    return true;
  }

  /**
   * Data persistence methods
   */
  private async loadPathwayTemplate(templateId: string): Promise<PathwayTemplate | null> {
    try {
      const doc = await db.collection('pathway_templates').doc(templateId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as PathwayTemplate;
    } catch (error) {
      console.error('Error loading pathway template:', error);
      return null;
    }
  }

  private async loadPathwayProgress(): Promise<PathwayProgress | null> {
    try {
      const doc = await db
        .collection('users')
        .doc(this.userId)
        .collection('pathways')
        .doc(this.pathwayId)
        .get();
      
      if (!doc.exists) return null;
      
      const data = doc.data();
      return {
        ...data,
        startedAt: data.startedAt.toDate(),
        completedAt: data.completedAt?.toDate(),
        pausedAt: data.pausedAt?.toDate(),
        lastActiveAt: data.lastActiveAt.toDate()
      } as PathwayProgress;
    } catch (error) {
      console.error('Error loading pathway progress:', error);
      return null;
    }
  }

  private async createNewPathwayProgress(templateId: string): Promise<PathwayProgress> {
    const now = new Date();
    const firstStep = this.template!.steps.find(s => s.order === 1);
    
    const progress: PathwayProgress = {
      id: this.pathwayId,
      userId: this.userId,
      pathwayTemplateId: templateId,
      currentStep: firstStep?.id || '',
      stepProgress: {},
      isCompleted: false,
      isPaused: false,
      startedAt: now,
      engagementScore: 0,
      SELCompetencyScore: {
        selfAwareness: 0,
        selfManagement: 0,
        socialAwareness: 0,
        relationshipSkills: 0,
        responsibleDecisionMaking: 0
      },
      culturalContext: await this.loadUserCulturalContext(),
      personalizedElements: [],
      milestones: [],
      totalTimeSpentMs: 0,
      completionRate: 0,
      lastActiveAt: now
    };

    await db
      .collection('users')
      .doc(this.userId)
      .collection('pathways')
      .doc(this.pathwayId)
      .set(progress);

    return progress;
  }

  private async loadUserCulturalContext(): Promise<CulturalContext> {
    try {
      const userDoc = await db.collection('users').doc(this.userId).get();
      const userData = userDoc.data();
      
      return userData?.culturalContext || {
        primaryLanguage: 'en',
        culturalBackground: ['western'],
        communicationStyle: 'direct',
        valueSystem: ['individualistic'],
        socioeconomicFactors: []
      };
    } catch (error) {
      console.error('Error loading cultural context:', error);
      return {
        primaryLanguage: 'en',
        culturalBackground: ['western'],
        communicationStyle: 'direct',
        valueSystem: ['individualistic'],
        socioeconomicFactors: []
      };
    }
  }

  private async updateStepProgress(stepId: string, userInput: any, aiInsights: PathwayAIInsight[]): Promise<void> {
    try {
      const stepProgress = this.progress!.stepProgress[stepId] || {
        status: 'not_started',
        reflections: [],
        aiInsights: [],
        journalEntries: [],
        badges: [],
        timestamp: new Date(),
        completionScore: 0,
        engagementTimeMs: 0,
        retryCount: 0,
        lastAccessedAt: new Date()
      };

      stepProgress.status = 'completed';
      stepProgress.reflections.push(...userInput.reflections);
      stepProgress.aiInsights.push(...aiInsights.map(i => i.id));
      if (userInput.journalEntry) {
        stepProgress.journalEntries.push(userInput.journalEntry);
      }
      stepProgress.engagementTimeMs += userInput.timeSpentMs;
      stepProgress.completionScore = this.calculateCompletionScore(userInput, aiInsights);
      stepProgress.lastAccessedAt = new Date();

      this.progress!.stepProgress[stepId] = stepProgress;

      await db
        .collection('users')
        .doc(this.userId)
        .collection('pathways')
        .doc(this.pathwayId)
        .update({
          stepProgress: this.progress!.stepProgress,
          lastActiveAt: new Date()
        });

    } catch (error) {
      console.error('Error updating step progress:', error);
    }
  }

  private async updatePathwayProgress(selGrowth: Partial<SELCompetencyScore>, milestones: PathwayMilestone[]): Promise<void> {
    try {
      if (!this.progress) return;

      // Update SEL scores
      Object.entries(selGrowth).forEach(([competency, growth]) => {
        if (growth && this.progress!.SELCompetencyScore[competency as keyof SELCompetencyScore] !== undefined) {
          this.progress!.SELCompetencyScore[competency as keyof SELCompetencyScore] += growth;
        }
      });

      // Add new milestones
      this.progress.milestones.push(...milestones);

      // Update completion rate
      const completedSteps = Object.values(this.progress.stepProgress).filter(
        sp => sp.status === 'completed'
      ).length;
      this.progress.completionRate = (completedSteps / this.template!.steps.length) * 100;

      // Check if pathway is completed
      if (this.progress.completionRate >= 100) {
        this.progress.isCompleted = true;
        this.progress.completedAt = new Date();
      }

      await db
        .collection('users')
        .doc(this.userId)
        .collection('pathways')
        .doc(this.pathwayId)
        .update({
          SELCompetencyScore: this.progress.SELCompetencyScore,
          milestones: this.progress.milestones,
          completionRate: this.progress.completionRate,
          isCompleted: this.progress.isCompleted,
          completedAt: this.progress.completedAt,
          lastActiveAt: new Date()
        });

    } catch (error) {
      console.error('Error updating pathway progress:', error);
    }
  }

  private async updateLastAccessed(): Promise<void> {
    try {
      await db
        .collection('users')
        .doc(this.userId)
        .collection('pathways')
        .doc(this.pathwayId)
        .update({
          lastActiveAt: new Date()
        });
    } catch (error) {
      console.error('Error updating last accessed:', error);
    }
  }

  private calculateCompletionScore(userInput: any, aiInsights: PathwayAIInsight[]): number {
    let score = 0;

    // Base score for completion
    score += 20;

    // Reflection depth
    const totalReflectionLength = userInput.reflections.join(' ').length;
    score += Math.min(30, totalReflectionLength / 20); // Up to 30 points for depth

    // AI insight quality
    const avgConfidence = aiInsights.reduce((sum, i) => sum + i.confidence, 0) / aiInsights.length;
    score += avgConfidence * 25; // Up to 25 points for AI confidence

    // Engagement time (optimal range)
    const engagementMinutes = userInput.timeSpentMs / (1000 * 60);
    if (engagementMinutes >= 5 && engagementMinutes <= 20) {
      score += 25; // Optimal engagement time
    } else if (engagementMinutes > 1) {
      score += 10; // Some engagement
    }

    return Math.min(100, Math.round(score));
  }
}

export default PathwayEngine;