// ALCHM Pathway Template Factory - Cultural Adaptation Engine
// Automated generation of culturally responsive pathway templates

import {
  PathwayTemplate,
  PathwayStep,
  StepContent,
  PathwayCategory,
  AgeGroup,
  CulturalContext,
  AIPromptConfig,
  ReflectionQuestion,
  ExampleScenario,
  InteractiveElement,
  MediaContent
} from '@/types/pathways-schema';
import { generateGeminiInsight } from '@/lib/ai/gemini-pathways';
import { generateGPTMentorship, generateCulturalExamples } from '@/lib/ai/gpt-pathways';

export interface TemplateFactoryConfig {
  baseTemplate: BaseTemplateDefinition;
  culturalAdaptations: CulturalAdaptationSet[];
  targetAudience: TargetAudienceProfile;
  accessTier: 'foundation' | 'enhanced' | 'premium' | 'clinical';
  safetyRequirements: SafetyRequirements;
}

export interface BaseTemplateDefinition {
  category: PathwayCategory;
  coreObjectives: string[];
  essentialSteps: EssentialStepDefinition[];
  foundationalConcepts: string[];
  measurableOutcomes: string[];
  estimatedDuration: number;
  difficultyProgression: DifficultyProgression;
}

export interface EssentialStepDefinition {
  stepType: string;
  corePrompt: string;
  learningObjective: string;
  selCompetencyFocus: string[];
  requiredInteractionTypes: string[];
  culturalConsiderations: string[];
  safetyConsiderations: string[];
}

export interface CulturalAdaptationSet {
  targetCulture: string;
  adaptationType: 'language' | 'examples' | 'metaphors' | 'values' | 'communication_style' | 'family_structure';
  adaptationStrategies: AdaptationStrategy[];
  validationCriteria: CulturalValidationCriteria;
  expertReviewed: boolean;
}

export interface AdaptationStrategy {
  sourceElement: string;
  targetElement: string;
  adaptationReason: string;
  culturalResonance: number; // 0-1 scale
  ageAppropriate: boolean;
  communityEndorsed: boolean;
}

export interface TargetAudienceProfile {
  ageGroup: AgeGroup;
  culturalContext: CulturalContext;
  traumaInformed: boolean;
  accessibilityRequirements: string[];
  preferredInteractionStyles: string[];
  attentionSpanConsiderations: AttentionSpanProfile;
}

export interface AttentionSpanProfile {
  optimalSessionLength: number; // minutes
  maxSessionLength: number;     // minutes
  breakFrequency: number;       // minutes between breaks
  interactivityRequired: boolean;
  multiModalSupport: boolean;
}

export interface SafetyRequirements {
  traumaInformedLevel: 'basic' | 'intermediate' | 'advanced' | 'clinical';
  triggerWarnings: string[];
  crisisInterventionTriggers: string[];
  mandatoryBreakPoints: number[];
  supervisorNotificationTriggers: string[];
  emergencyProtocols: EmergencyProtocol[];
}

export interface EmergencyProtocol {
  triggerCondition: string;
  immediateActions: string[];
  notificationRequired: boolean;
  escalationProcedure: string;
  followUpRequired: boolean;
}

export interface DifficultyProgression {
  startingComplexity: number;  // 0-10 scale
  endingComplexity: number;    // 0-10 scale
  progressionRate: 'linear' | 'exponential' | 'stepped' | 'adaptive';
  milestoneCheckpoints: number[]; // Step indices for difficulty assessments
}

export interface CulturalValidationCriteria {
  communityReview: boolean;
  expertValidation: boolean;
  pilotTesting: boolean;
  feedbackIncorporation: boolean;
  minimumResonanceScore: number; // 0-1
}

export class PathwayTemplateFactory {
  private static readonly CORE_TEMPLATES: Record<PathwayCategory, BaseTemplateDefinition> = {
    self_discovery: {
      category: 'self_discovery',
      coreObjectives: [
        'Develop deeper self-awareness and understanding',
        'Identify personal strengths and values',
        'Explore identity and authentic self-expression',
        'Build confidence in personal decision-making'
      ],
      essentialSteps: [
        {
          stepType: 'reflection_prompt',
          corePrompt: 'Who am I when I am most authentic?',
          learningObjective: 'Identify core identity elements',
          selCompetencyFocus: ['selfAwareness'],
          requiredInteractionTypes: ['text_input', 'mood_picker'],
          culturalConsiderations: ['individual_vs_collective_identity', 'family_expectations'],
          safetyConsiderations: ['identity_exploration_safety', 'non_judgmental_space']
        },
        {
          stepType: 'guided_meditation',
          corePrompt: 'Connect with your inner wisdom and values',
          learningObjective: 'Access intuitive self-knowledge',
          selCompetencyFocus: ['selfAwareness', 'selfManagement'],
          requiredInteractionTypes: ['audio', 'timeline'],
          culturalConsiderations: ['spiritual_practices', 'meditation_traditions'],
          safetyConsiderations: ['grounding_techniques', 'reality_check_prompts']
        },
        {
          stepType: 'creative_expression',
          corePrompt: 'Express your authentic self through creative means',
          learningObjective: 'Explore non-verbal self-expression',
          selCompetencyFocus: ['selfAwareness'],
          requiredInteractionTypes: ['draw_canvas', 'choice_selection'],
          culturalConsiderations: ['artistic_traditions', 'creative_expression_norms'],
          safetyConsiderations: ['creative_safety', 'non_performance_based']
        }
      ],
      foundationalConcepts: ['identity', 'authenticity', 'values', 'strengths', 'self_compassion'],
      measurableOutcomes: ['increased_self_awareness', 'values_clarity', 'identity_coherence'],
      estimatedDuration: 60,
      difficultyProgression: {
        startingComplexity: 3,
        endingComplexity: 7,
        progressionRate: 'linear',
        milestoneCheckpoints: [1, 3, 5]
      }
    },
    emotional_regulation: {
      category: 'emotional_regulation',
      coreObjectives: [
        'Develop healthy emotional awareness and expression',
        'Learn effective coping strategies',
        'Build resilience in challenging situations',
        'Practice emotional self-management'
      ],
      essentialSteps: [
        {
          stepType: 'reflection_prompt',
          corePrompt: 'How do emotions show up in my body and mind?',
          learningObjective: 'Develop somatic emotional awareness',
          selCompetencyFocus: ['selfAwareness', 'selfManagement'],
          requiredInteractionTypes: ['slider', 'text_input'],
          culturalConsiderations: ['emotional_expression_norms', 'body_awareness_comfort'],
          safetyConsiderations: ['emotional_overwhelm_prevention', 'grounding_available']
        },
        {
          stepType: 'skill_practice',
          corePrompt: 'Practice calming techniques that work for you',
          learningObjective: 'Build emotional regulation toolkit',
          selCompetencyFocus: ['selfManagement'],
          requiredInteractionTypes: ['choice_selection', 'slider'],
          culturalConsiderations: ['traditional_calming_practices', 'family_coping_styles'],
          safetyConsiderations: ['technique_safety_screening', 'medical_considerations']
        }
      ],
      foundationalConcepts: ['emotional_awareness', 'regulation_strategies', 'resilience', 'coping'],
      measurableOutcomes: ['emotional_awareness_increase', 'coping_skill_usage', 'stress_reduction'],
      estimatedDuration: 45,
      difficultyProgression: {
        startingComplexity: 2,
        endingComplexity: 6,
        progressionRate: 'stepped',
        milestoneCheckpoints: [1, 2, 4]
      }
    },
    social_connection: {
      category: 'social_connection',
      coreObjectives: [
        'Build healthy relationship skills',
        'Develop empathy and perspective-taking',
        'Practice effective communication',
        'Strengthen social support systems'
      ],
      essentialSteps: [
        {
          stepType: 'peer_interaction',
          corePrompt: 'Practice seeing situations from different perspectives',
          learningObjective: 'Develop perspective-taking skills',
          selCompetencyFocus: ['socialAwareness', 'relationshipSkills'],
          requiredInteractionTypes: ['choice_selection', 'text_input'],
          culturalConsiderations: ['communication_directness', 'relationship_hierarchies'],
          safetyConsiderations: ['peer_interaction_safety', 'boundary_respect']
        }
      ],
      foundationalConcepts: ['empathy', 'communication', 'boundaries', 'social_support'],
      measurableOutcomes: ['empathy_increase', 'communication_improvement', 'relationship_satisfaction'],
      estimatedDuration: 50,
      difficultyProgression: {
        startingComplexity: 4,
        endingComplexity: 8,
        progressionRate: 'linear',
        milestoneCheckpoints: [2, 4, 6]
      }
    },
    purpose_exploration: {
      category: 'purpose_exploration',
      coreObjectives: [
        'Explore personal meaning and purpose',
        'Connect values with actions',
        'Identify contribution opportunities',
        'Build sense of agency and impact'
      ],
      essentialSteps: [
        {
          stepType: 'reflection_prompt',
          corePrompt: 'What impact do I want to have in the world?',
          learningObjective: 'Connect personal values with larger purpose',
          selCompetencyFocus: ['selfAwareness', 'responsibleDecisionMaking'],
          requiredInteractionTypes: ['text_input', 'choice_selection'],
          culturalConsiderations: ['collective_vs_individual_purpose', 'family_expectations'],
          safetyConsiderations: ['realistic_expectations', 'overwhelm_prevention']
        }
      ],
      foundationalConcepts: ['purpose', 'meaning', 'values', 'contribution', 'agency'],
      measurableOutcomes: ['purpose_clarity', 'values_alignment', 'action_orientation'],
      estimatedDuration: 70,
      difficultyProgression: {
        startingComplexity: 5,
        endingComplexity: 9,
        progressionRate: 'exponential',
        milestoneCheckpoints: [1, 3, 5, 7]
      }
    },
    resilience_building: {
      category: 'resilience_building',
      coreObjectives: [
        'Develop adaptive coping strategies',
        'Build emotional and mental resilience',
        'Practice bouncing back from setbacks',
        'Strengthen personal support systems'
      ],
      essentialSteps: [
        {
          stepType: 'skill_practice',
          corePrompt: 'How do I respond to challenges with strength?',
          learningObjective: 'Build resilience mindset and skills',
          selCompetencyFocus: ['selfManagement', 'responsibleDecisionMaking'],
          requiredInteractionTypes: ['slider', 'text_input'],
          culturalConsiderations: ['cultural_resilience_models', 'community_support'],
          safetyConsiderations: ['trauma_awareness', 'strength_focus']
        }
      ],
      foundationalConcepts: ['resilience', 'coping', 'adaptation', 'growth_mindset', 'support'],
      measurableOutcomes: ['resilience_increase', 'coping_effectiveness', 'recovery_speed'],
      estimatedDuration: 55,
      difficultyProgression: {
        startingComplexity: 3,
        endingComplexity: 7,
        progressionRate: 'adaptive',
        milestoneCheckpoints: [2, 4, 6]
      }
    },
    leadership_development: {
      category: 'leadership_development',
      coreObjectives: [
        'Develop leadership skills and confidence',
        'Practice inclusive leadership approaches',
        'Build team collaboration abilities',
        'Strengthen decision-making skills'
      ],
      essentialSteps: [
        {
          stepType: 'action_planning',
          corePrompt: 'How can I lead with authenticity and compassion?',
          learningObjective: 'Develop authentic leadership style',
          selCompetencyFocus: ['relationshipSkills', 'responsibleDecisionMaking'],
          requiredInteractionTypes: ['choice_selection', 'text_input'],
          culturalConsiderations: ['leadership_styles', 'hierarchy_respect'],
          safetyConsiderations: ['leadership_pressure_management', 'realistic_expectations']
        }
      ],
      foundationalConcepts: ['leadership', 'influence', 'collaboration', 'decision_making', 'authenticity'],
      measurableOutcomes: ['leadership_confidence', 'collaboration_skills', 'decision_quality'],
      estimatedDuration: 65,
      difficultyProgression: {
        startingComplexity: 6,
        endingComplexity: 9,
        progressionRate: 'stepped',
        milestoneCheckpoints: [2, 4, 6, 8]
      }
    },
    cultural_identity: {
      category: 'cultural_identity',
      coreObjectives: [
        'Explore and celebrate cultural identity',
        'Navigate cultural intersections',
        'Build cultural pride and resilience',
        'Practice cultural bridge-building'
      ],
      essentialSteps: [
        {
          stepType: 'reflection_prompt',
          corePrompt: 'How does my cultural heritage shape who I am?',
          learningObjective: 'Explore cultural identity elements',
          selCompetencyFocus: ['selfAwareness', 'socialAwareness'],
          requiredInteractionTypes: ['text_input', 'choice_selection'],
          culturalConsiderations: ['cultural_pride', 'identity_complexity'],
          safetyConsiderations: ['cultural_safety', 'identity_affirmation']
        }
      ],
      foundationalConcepts: ['cultural_identity', 'heritage', 'intersectionality', 'belonging', 'pride'],
      measurableOutcomes: ['cultural_pride', 'identity_integration', 'cultural_competence'],
      estimatedDuration: 60,
      difficultyProgression: {
        startingComplexity: 4,
        endingComplexity: 8,
        progressionRate: 'linear',
        milestoneCheckpoints: [2, 4, 6]
      }
    },
    trauma_informed: {
      category: 'trauma_informed',
      coreObjectives: [
        'Build trauma-informed coping strategies',
        'Develop emotional safety skills',
        'Practice grounding and regulation',
        'Strengthen healing-oriented mindset'
      ],
      essentialSteps: [
        {
          stepType: 'guided_meditation',
          corePrompt: 'Practice feeling safe and grounded in your body',
          learningObjective: 'Develop embodied safety skills',
          selCompetencyFocus: ['selfAwareness', 'selfManagement'],
          requiredInteractionTypes: ['audio', 'slider'],
          culturalConsiderations: ['body_awareness_comfort', 'traditional_healing'],
          safetyConsiderations: ['trauma_awareness', 'choice_emphasis', 'exit_strategies']
        }
      ],
      foundationalConcepts: ['safety', 'grounding', 'regulation', 'healing', 'empowerment'],
      measurableOutcomes: ['safety_increase', 'regulation_improvement', 'empowerment_growth'],
      estimatedDuration: 40,
      difficultyProgression: {
        startingComplexity: 1,
        endingComplexity: 5,
        progressionRate: 'adaptive',
        milestoneCheckpoints: [1, 2, 3, 4]
      }
    },
    crisis_support: {
      category: 'crisis_support',
      coreObjectives: [
        'Develop crisis coping strategies',
        'Build immediate safety skills',
        'Practice crisis communication',
        'Strengthen support system activation'
      ],
      essentialSteps: [
        {
          stepType: 'skill_practice',
          corePrompt: 'How can I stay safe and reach out when I need help?',
          learningObjective: 'Build immediate safety and support skills',
          selCompetencyFocus: ['selfManagement', 'relationshipSkills'],
          requiredInteractionTypes: ['choice_selection', 'text_input'],
          culturalConsiderations: ['help_seeking_norms', 'family_involvement'],
          safetyConsiderations: ['crisis_protocols', 'immediate_safety', 'professional_support']
        }
      ],
      foundationalConcepts: ['crisis_management', 'safety_planning', 'support_systems', 'help_seeking'],
      measurableOutcomes: ['crisis_preparedness', 'support_activation', 'safety_behavior'],
      estimatedDuration: 30,
      difficultyProgression: {
        startingComplexity: 2,
        endingComplexity: 4,
        progressionRate: 'linear',
        milestoneCheckpoints: [1, 2, 3]
      }
    }
  };

  /**
   * Generate a culturally adapted pathway template
   */
  static async generateTemplate(config: TemplateFactoryConfig): Promise<PathwayTemplate> {
    const baseTemplate = config.baseTemplate;
    const culturalContext = config.targetAudience.culturalContext;

    // Generate culturally adapted steps
    const adaptedSteps = await this.generateAdaptedSteps(
      baseTemplate.essentialSteps,
      config.culturalAdaptations,
      config.targetAudience,
      config.safetyRequirements
    );

    // Generate AI prompt configurations
    const aiPrompts = await this.generateAIPromptConfigs(
      adaptedSteps,
      culturalContext,
      config.accessTier
    );

    // Apply cultural adaptations to content
    const culturallyAdaptedSteps = await this.applyCulturalAdaptations(
      adaptedSteps,
      config.culturalAdaptations,
      culturalContext
    );

    // Generate template metadata
    const template: PathwayTemplate = {
      id: '', // Will be set when saved
      title: await this.generateCulturallyAdaptedTitle(baseTemplate.category, culturalContext),
      description: await this.generateCulturallyAdaptedDescription(baseTemplate, culturalContext),
      category: baseTemplate.category,
      targetAge: config.targetAudience.ageGroup,
      culturalAdaptations: config.culturalAdaptations.map(ca => ca.targetCulture),
      estimatedDurationMinutes: this.calculateAdjustedDuration(
        baseTemplate.estimatedDuration,
        config.targetAudience
      ),
      difficultyLevel: this.determineDifficultyLevel(baseTemplate.difficultyProgression, config.accessTier),
      prerequisitePathways: [],
      SELCompetencyFocus: this.extractSELFocus(baseTemplate.essentialSteps),
      steps: culturallyAdaptedSteps,
      tags: this.generateTags(baseTemplate, config.culturalAdaptations, config.targetAudience),
      isActive: true,
      version: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'pathway-factory'
    };

    return template;
  }

  /**
   * Generate culturally adapted steps
   */
  private static async generateAdaptedSteps(
    essentialSteps: EssentialStepDefinition[],
    culturalAdaptations: CulturalAdaptationSet[],
    targetAudience: TargetAudienceProfile,
    safetyRequirements: SafetyRequirements
  ): Promise<PathwayStep[]> {
    const adaptedSteps: PathwayStep[] = [];

    for (let i = 0; i < essentialSteps.length; i++) {
      const essentialStep = essentialSteps[i];
      
      // Generate base step content
      const stepContent = await this.generateStepContent(
        essentialStep,
        targetAudience.culturalContext,
        targetAudience.ageGroup
      );

      // Apply safety requirements
      const safeStepContent = this.applySafetyRequirements(
        stepContent,
        safetyRequirements,
        essentialStep.safetyConsiderations
      );

      // Generate interactive elements
      const interactiveElements = await this.generateInteractiveElements(
        essentialStep.requiredInteractionTypes,
        targetAudience
      );

      // Create pathway step
      const step: PathwayStep = {
        id: `step_${i + 1}`,
        order: i + 1,
        title: await this.generateStepTitle(essentialStep, targetAudience.culturalContext),
        type: essentialStep.stepType as any,
        estimatedDurationMinutes: this.calculateStepDuration(
          essentialStep,
          targetAudience.attentionSpanConsiderations
        ),
        content: {
          ...safeStepContent,
          interactiveElements
        },
        aiPrompts: await this.generateStepAIPrompts(essentialStep, targetAudience.culturalContext),
        triggers: this.generateStepTriggers(essentialStep, safetyRequirements),
        validationCriteria: this.generateValidationCriteria(essentialStep, targetAudience),
        adaptiveElements: await this.generateAdaptiveElements(essentialStep, culturalAdaptations),
        unlockConditions: this.generateUnlockConditions(i, essentialSteps.length),
        isOptional: this.determineOptionalStatus(essentialStep, targetAudience)
      };

      adaptedSteps.push(step);
    }

    return adaptedSteps;
  }

  /**
   * Generate step content with cultural adaptations
   */
  private static async generateStepContent(
    essentialStep: EssentialStepDefinition,
    culturalContext: CulturalContext,
    ageGroup: AgeGroup
  ): Promise<StepContent> {
    // Generate culturally adapted examples
    const examples = await generateCulturalExamples(
      essentialStep.learningObjective,
      culturalContext,
      ageGroup
    );

    // Generate reflection questions
    const reflectionQuestions = await this.generateCulturallyAdaptedQuestions(
      essentialStep.corePrompt,
      essentialStep.learningObjective,
      culturalContext
    );

    // Generate contextual prompts for different cultural contexts
    const contextualPrompts = await this.generateContextualPrompts(
      essentialStep.corePrompt,
      culturalContext,
      essentialStep.culturalConsiderations
    );

    return {
      primaryPrompt: await this.adaptPromptForCulture(essentialStep.corePrompt, culturalContext),
      contextualPrompts,
      supportingMedia: await this.generateSupportingMedia(essentialStep, culturalContext),
      interactiveElements: [], // Will be populated separately
      reflectionQuestions,
      examples: examples.examples.map((example, index) => ({
        id: `example_${index + 1}`,
        scenario: example,
        culturalContext: culturalContext.culturalBackground[0] || 'universal',
        ageAppropriate: [ageGroup],
        outcomeExample: examples.scenarios[index] || 'Positive growth and understanding',
        learningObjective: essentialStep.learningObjective
      }))
    };
  }

  private static async generateCulturallyAdaptedQuestions(
    basePrompt: string,
    learningObjective: string,
    culturalContext: CulturalContext
  ): Promise<ReflectionQuestion[]> {
    try {
      // Use GPT to generate culturally adapted questions
      const gptResponse = await generateGPTMentorship({
        stepContent: basePrompt,
        userContext: { culturalContext },
        promptType: 'mirror',
        culturalContext
      });

      // Extract questions from response
      const questions = this.extractQuestionsFromResponse(gptResponse.content);

      return questions.map((question, index) => ({
        id: `question_${index + 1}`,
        question,
        type: 'open_ended' as const,
        isRequired: index === 0, // First question required
        culturalAdaptations: this.generateQuestionAdaptations(question, culturalContext),
        followUpLogic: this.generateFollowUpLogic(question, culturalContext)
      }));

    } catch (error) {
      console.error('Error generating culturally adapted questions:', error);
      return [{
        id: 'question_1',
        question: basePrompt,
        type: 'open_ended',
        isRequired: true,
        culturalAdaptations: {},
        followUpLogic: undefined
      }];
    }
  }

  private static extractQuestionsFromResponse(content: string): string[] {
    // Extract questions from AI response
    const questionMarkers = ['?', 'Consider:', 'Reflect on:', 'Think about:'];
    const sentences = content.split(/[.!]/);
    
    return sentences
      .filter(sentence => questionMarkers.some(marker => sentence.includes(marker)))
      .map(question => question.trim())
      .filter(question => question.length > 10)
      .slice(0, 3); // Limit to 3 questions max
  }

  private static generateQuestionAdaptations(
    question: string,
    culturalContext: CulturalContext
  ): Record<string, string> {
    const adaptations: Record<string, string> = {};

    // Communication style adaptations
    if (culturalContext.communicationStyle === 'indirect') {
      adaptations.indirect = question.replace(/directly/g, 'gently').replace(/clearly/g, 'thoughtfully');
    }

    // Cultural background adaptations
    culturalContext.culturalBackground.forEach(culture => {
      adaptations[culture] = this.adaptQuestionForCulture(question, culture);
    });

    return adaptations;
  }

  private static adaptQuestionForCulture(question: string, culture: string): string {
    // Simple cultural adaptations - in production would be more sophisticated
    const adaptations: Record<string, (q: string) => string> = {
      'collectivist': (q) => q.replace(/I/g, 'we').replace(/my/g, 'our'),
      'latin_american': (q) => q.includes('family') ? q : q + ' Consider your family and community context.',
      'asian': (q) => q.replace(/individual/g, 'personal and family'),
      'african': (q) => q.includes('community') ? q : q + ' Think about your community connections.',
      'indigenous': (q) => q.includes('ancestors') ? q : q + ' Consider wisdom from your ancestors.'
    };

    return adaptations[culture] ? adaptations[culture](question) : question;
  }

  private static generateFollowUpLogic(
    question: string,
    culturalContext: CulturalContext
  ): any {
    return {
      conditions: {
        'short_response': 'response.length < 50',
        'emotional_content': 'response.includes_emotion_words',
        'cultural_reference': 'response.includes_cultural_elements'
      },
      followUpQuestions: {
        'short_response': 'Can you tell me more about that?',
        'emotional_content': 'How did that feel for you?',
        'cultural_reference': 'How does your cultural background influence this?'
      },
      aiPromptAdjustments: {
        'short_response': 'Encourage deeper reflection',
        'emotional_content': 'Validate emotional expression',
        'cultural_reference': 'Explore cultural connections'
      }
    };
  }

  private static async generateContextualPrompts(
    basePrompt: string,
    culturalContext: CulturalContext,
    culturalConsiderations: string[]
  ): Promise<Record<string, string>> {
    const contextualPrompts: Record<string, string> = {};

    // Generate prompts for different cultural contexts
    for (const culture of culturalContext.culturalBackground) {
      try {
        const adaptedPrompt = await this.adaptPromptForSpecificCulture(
          basePrompt,
          culture,
          culturalConsiderations
        );
        contextualPrompts[culture] = adaptedPrompt;
      } catch (error) {
        console.error(`Error adapting prompt for ${culture}:`, error);
        contextualPrompts[culture] = basePrompt;
      }
    }

    // Communication style adaptations
    if (culturalContext.communicationStyle === 'indirect') {
      contextualPrompts.indirect = this.makePromptIndirect(basePrompt);
    }

    return contextualPrompts;
  }

  private static async adaptPromptForSpecificCulture(
    prompt: string,
    culture: string,
    considerations: string[]
  ): Promise<string> {
    // Use AI to adapt prompt for specific culture
    try {
      const culturalContext: CulturalContext = {
        primaryLanguage: 'en',
        culturalBackground: [culture],
        communicationStyle: 'direct',
        valueSystem: [],
        socioeconomicFactors: []
      };

      const gptResponse = await generateGPTMentorship({
        stepContent: prompt,
        userContext: { culturalContext, considerations },
        promptType: 'mentor',
        culturalContext
      });

      return gptResponse.content;

    } catch (error) {
      console.error('Error adapting prompt with AI:', error);
      return prompt;
    }
  }

  private static makePromptIndirect(prompt: string): string {
    return prompt
      .replace(/What do you/g, 'You might consider')
      .replace(/How do you/g, 'Perhaps you could reflect on how you')
      .replace(/Why do you/g, 'It might be interesting to explore why you')
      .replace(/Tell me/g, 'If you feel comfortable sharing')
      .replace(/Describe/g, 'You might want to think about');
  }

  private static async adaptPromptForCulture(
    prompt: string,
    culturalContext: CulturalContext
  ): Promise<string> {
    // Apply cultural adaptations to base prompt
    let adaptedPrompt = prompt;

    // Communication style adaptations
    if (culturalContext.communicationStyle === 'indirect') {
      adaptedPrompt = this.makePromptIndirect(adaptedPrompt);
    }

    // Value system adaptations
    if (culturalContext.valueSystem.includes('family_centered')) {
      adaptedPrompt = adaptedPrompt.includes('family') 
        ? adaptedPrompt 
        : adaptedPrompt + ' Consider how this relates to your family relationships.';
    }

    if (culturalContext.valueSystem.includes('collectivist')) {
      adaptedPrompt = adaptedPrompt.replace(/your individual/g, 'your and your community\'s');
    }

    return adaptedPrompt;
  }

  private static async generateSupportingMedia(
    essentialStep: EssentialStepDefinition,
    culturalContext: CulturalContext
  ): Promise<MediaContent[]> {
    // Generate culturally appropriate media suggestions
    const media: MediaContent[] = [];

    // Add meditation audio for relevant steps
    if (essentialStep.stepType === 'guided_meditation') {
      media.push({
        type: 'audio',
        url: `/audio/meditations/${culturalContext.culturalBackground[0]}/grounding.mp3`,
        altText: 'Culturally adapted grounding meditation',
        culturalContext: culturalContext.culturalBackground[0],
        emotionalTone: 'calming'
      });
    }

    // Add visual aids for creative expression
    if (essentialStep.stepType === 'creative_expression') {
      media.push({
        type: 'image',
        url: `/images/creative_prompts/${culturalContext.culturalBackground[0]}/inspiration.jpg`,
        altText: 'Cultural inspiration for creative expression',
        culturalContext: culturalContext.culturalBackground[0],
        emotionalTone: 'inspiring'
      });
    }

    return media;
  }

  private static async generateInteractiveElements(
    requiredTypes: string[],
    targetAudience: TargetAudienceProfile
  ): Promise<InteractiveElement[]> {
    return requiredTypes.map(type => ({
      type: type as any,
      configuration: this.getInteractiveElementConfig(type, targetAudience),
      validationRules: this.getValidationRules(type)
    }));
  }

  private static getInteractiveElementConfig(type: string, audience: TargetAudienceProfile): Record<string, any> {
    const configs: Record<string, any> = {
      'text_input': {
        minLength: audience.ageGroup === 'early_adolescent' ? 20 : 50,
        maxLength: audience.ageGroup === 'early_adolescent' ? 200 : 500,
        placeholder: 'Share your thoughts...',
        culturallyAdapted: true
      },
      'mood_picker': {
        emotionSet: 'culturally_adapted',
        intensityScale: true,
        culturalEmotions: audience.culturalContext.culturalBackground
      },
      'slider': {
        min: 0,
        max: 10,
        step: 1,
        labels: ['Not at all', 'Completely'],
        culturalLabels: true
      },
      'choice_selection': {
        multiSelect: true,
        culturallyAdaptedOptions: true,
        allowOther: true
      },
      'draw_canvas': {
        tools: ['pen', 'highlighter', 'shapes'],
        culturalTemplates: audience.culturalContext.culturalBackground,
        collaborative: audience.culturalContext.valueSystem.includes('collectivist')
      },
      'timeline': {
        timeRange: 'flexible',
        culturalTimeConceptions: audience.culturalContext.culturalBackground,
        allowNonLinear: true
      }
    };

    return configs[type] || {};
  }

  private static getValidationRules(type: string): any[] {
    const rules: Record<string, any[]> = {
      'text_input': [
        { field: 'content', rule: 'min_length', value: 10, errorMessage: 'Please share a bit more detail' }
      ],
      'mood_picker': [
        { field: 'emotion', rule: 'required', value: true, errorMessage: 'Please select how you\'re feeling' }
      ],
      'slider': [
        { field: 'value', rule: 'required', value: true, errorMessage: 'Please select a value' }
      ]
    };

    return rules[type] || [];
  }

  // Additional helper methods for template generation...
  
  private static async generateStepAIPrompts(
    essentialStep: EssentialStepDefinition,
    culturalContext: CulturalContext
  ): Promise<AIPromptConfig> {
    return {
      geminiPrompts: {
        moodAnalysis: `Analyze emotional state considering ${culturalContext.culturalBackground.join(' and ')} cultural context`,
        biasDetection: `Check for cultural biases in responses about ${essentialStep.learningObjective}`,
        SELScoring: `Score SEL development in ${essentialStep.selCompetencyFocus.join(', ')} with cultural sensitivity`,
        culturalSensitivity: `Ensure cultural appropriateness for ${culturalContext.culturalBackground.join(', ')} background`,
        safetyAssessment: `Assess emotional safety considering trauma-informed practices`
      },
      gptPrompts: {
        mentorPrompt: `Provide wise, culturally sensitive guidance for ${essentialStep.learningObjective}`,
        mirrorPrompt: `Reflect back insights about ${essentialStep.learningObjective} with cultural awareness`,
        visionaryPrompt: `Help envision growth in ${essentialStep.learningObjective} within cultural context`,
        contextualPrompt: `Adapt guidance based on cultural context and individual needs`,
        encouragementPrompt: `Provide culturally appropriate encouragement and validation`
      },
      orchestrationLogic: [
        {
          condition: 'cultural_sensitivity_needed',
          aiProvider: 'gemini',
          promptType: 'culturalSensitivity',
          parameters: { culturalContext },
          successCriteria: 'high_sensitivity_score',
          fallbackAction: 'use_fallback_prompt'
        }
      ],
      adaptivePrompting: {
        personalityAdaptation: true,
        culturalAdaptation: true,
        progressBasedAdaptation: true,
        moodBasedAdaptation: true,
        learningStyleAdaptation: true
      }
    };
  }

  // More helper methods would continue here...
  
  private static generateStepTriggers(essentialStep: EssentialStepDefinition, safetyRequirements: SafetyRequirements): any[] {
    return [
      {
        type: 'engagement_based',
        condition: 'low_engagement_detected',
        action: {
          type: 'adjust_difficulty',
          parameters: { direction: 'easier', amount: 0.2 }
        }
      },
      {
        type: 'mood_based',
        condition: 'distress_detected',
        action: {
          type: 'provide_support',
          parameters: { supportType: 'grounding_exercise' }
        }
      }
    ];
  }

  private static generateValidationCriteria(essentialStep: EssentialStepDefinition, targetAudience: TargetAudienceProfile): any {
    return {
      minimumWordCount: targetAudience.ageGroup === 'early_adolescent' ? 25 : 50,
      requiredElements: ['emotional_check', 'reflection_content'],
      qualityThresholds: [
        {
          metric: 'reflection_depth',
          minimumScore: 3,
          measurementMethod: 'ai_analysis'
        }
      ],
      timeRequirements: {
        minimumSeconds: 120,
        maximumSeconds: targetAudience.attentionSpanConsiderations.maxSessionLength * 60,
        optimalRange: [300, targetAudience.attentionSpanConsiderations.optimalSessionLength * 60]
      }
    };
  }

  private static async generateAdaptiveElements(
    essentialStep: EssentialStepDefinition,
    culturalAdaptations: CulturalAdaptationSet[]
  ): Promise<any[]> {
    return [
      {
        elementId: 'prompt_tone',
        adaptationType: 'tone',
        baselineValue: 'encouraging',
        adaptationRules: culturalAdaptations.map(ca => ({
          condition: `cultural_background_includes_${ca.targetCulture}`,
          adjustedValue: ca.adaptationStrategies[0]?.targetElement || 'encouraging',
          confidence: ca.adaptationStrategies[0]?.culturalResonance || 0.8,
          explanation: ca.adaptationStrategies[0]?.adaptationReason || 'Cultural adaptation'
        }))
      }
    ];
  }

  private static generateUnlockConditions(stepIndex: number, totalSteps: number): any[] {
    if (stepIndex === 0) return []; // First step is always unlocked

    return [
      {
        type: 'previous_step_completed',
        requirement: `step_${stepIndex}`,
        parameters: { minimumScore: 60 }
      }
    ];
  }

  private static determineOptionalStatus(essentialStep: EssentialStepDefinition, targetAudience: TargetAudienceProfile): boolean {
    // Make certain steps optional based on cultural considerations
    if (essentialStep.stepType === 'peer_interaction' && 
        targetAudience.culturalContext.valueSystem.includes('privacy_focused')) {
      return true;
    }
    return false;
  }

  // Template-level helper methods...

  private static async generateCulturallyAdaptedTitle(category: PathwayCategory, culturalContext: CulturalContext): Promise<string> {
    const baseTitles: Record<PathwayCategory, string> = {
      self_discovery: 'Discovering Your Authentic Self',
      emotional_regulation: 'Managing Emotions with Wisdom',
      social_connection: 'Building Meaningful Relationships',
      purpose_exploration: 'Finding Your Life Purpose',
      resilience_building: 'Building Inner Strength',
      leadership_development: 'Developing Leadership Skills',
      cultural_identity: 'Celebrating Your Cultural Identity',
      trauma_informed: 'Healing and Growth Journey',
      crisis_support: 'Crisis Support and Safety'
    };

    let title = baseTitles[category];

    // Apply cultural adaptations
    if (culturalContext.valueSystem.includes('collectivist')) {
      title = title.replace('Your', 'Our Community\'s').replace('Self', 'Collective Self');
    }

    if (culturalContext.culturalBackground.includes('indigenous')) {
      title = title.replace('Journey', 'Path of the Ancestors');
    }

    return title;
  }

  private static async generateCulturallyAdaptedDescription(
    baseTemplate: BaseTemplateDefinition,
    culturalContext: CulturalContext
  ): Promise<string> {
    let description = `A transformative journey to ${baseTemplate.coreObjectives.join(', ').toLowerCase()}.`;

    // Add cultural context
    if (culturalContext.culturalBackground.length > 0) {
      description += ` Thoughtfully adapted for ${culturalContext.culturalBackground.join(' and ')} perspectives.`;
    }

    return description;
  }

  private static calculateAdjustedDuration(baseDuration: number, targetAudience: TargetAudienceProfile): number {
    let adjustedDuration = baseDuration;

    // Adjust for age group
    if (targetAudience.ageGroup === 'early_adolescent') {
      adjustedDuration *= 0.8; // Shorter for younger users
    }

    // Adjust for attention span
    if (adjustedDuration > targetAudience.attentionSpanConsiderations.optimalSessionLength) {
      adjustedDuration = targetAudience.attentionSpanConsiderations.optimalSessionLength;
    }

    return Math.round(adjustedDuration);
  }

  private static determineDifficultyLevel(progression: DifficultyProgression, accessTier: string): any {
    const levelMap: Record<string, any> = {
      'foundation': 'foundation',
      'enhanced': 'exploration',
      'premium': 'integration',
      'clinical': 'mastery'
    };

    return levelMap[accessTier] || 'foundation';
  }

  private static extractSELFocus(essentialSteps: EssentialStepDefinition[]): any {
    const focus: any = {
      selfAwareness: 0,
      selfManagement: 0,
      socialAwareness: 0,
      relationshipSkills: 0,
      responsibleDecisionMaking: 0
    };

    essentialSteps.forEach(step => {
      step.selCompetencyFocus.forEach(competency => {
        if (focus[competency] !== undefined) {
          focus[competency] += 20; // Arbitrary scoring
        }
      });
    });

    return focus;
  }

  private static generateTags(
    baseTemplate: BaseTemplateDefinition,
    culturalAdaptations: CulturalAdaptationSet[],
    targetAudience: TargetAudienceProfile
  ): string[] {
    const tags = [
      baseTemplate.category,
      targetAudience.ageGroup,
      ...baseTemplate.foundationalConcepts,
      ...culturalAdaptations.map(ca => ca.targetCulture),
      'trauma_informed',
      'culturally_responsive'
    ];

    return [...new Set(tags)]; // Remove duplicates
  }

  private static calculateStepDuration(
    essentialStep: EssentialStepDefinition,
    attentionSpan: AttentionSpanProfile
  ): number {
    const baseDuration = 15; // Base 15 minutes per step

    // Adjust based on step type
    const stepDurations: Record<string, number> = {
      'reflection_prompt': 12,
      'guided_meditation': 10,
      'creative_expression': 20,
      'peer_interaction': 18,
      'mentor_dialogue': 15,
      'skill_practice': 16,
      'insight_synthesis': 14,
      'action_planning': 22,
      'progress_celebration': 8
    };

    let duration = stepDurations[essentialStep.stepType] || baseDuration;

    // Adjust for attention span
    if (duration > attentionSpan.optimalSessionLength) {
      duration = attentionSpan.optimalSessionLength;
    }

    return duration;
  }

  private static applySafetyRequirements(
    stepContent: StepContent,
    safetyRequirements: SafetyRequirements,
    stepSafetyConsiderations: string[]
  ): StepContent {
    // Add safety elements to step content
    const safeContent = { ...stepContent };

    // Add trigger warnings if needed
    if (safetyRequirements.triggerWarnings.length > 0) {
      safeContent.primaryPrompt = `Safety note: This reflection may touch on challenging topics. You can pause or skip at any time.\n\n${safeContent.primaryPrompt}`;
    }

    // Add safety questions
    const safetyQuestions = stepSafetyConsiderations.map((consideration, index) => ({
      id: `safety_${index + 1}`,
      question: `Do you feel emotionally safe to continue with this reflection?`,
      type: 'multiple_choice' as const,
      isRequired: true,
      culturalAdaptations: {},
      followUpLogic: undefined
    }));

    safeContent.reflectionQuestions = [...safetyQuestions, ...safeContent.reflectionQuestions];

    return safeContent;
  }

  private static async generateAIPromptConfigs(
    steps: PathwayStep[],
    culturalContext: CulturalContext,
    accessTier: string
  ): Promise<AIPromptConfig[]> {
    return steps.map(step => step.aiPrompts);
  }

  private static async applyCulturalAdaptations(
    steps: PathwayStep[],
    culturalAdaptations: CulturalAdaptationSet[],
    culturalContext: CulturalContext
  ): Promise<PathwayStep[]> {
    return Promise.all(steps.map(async step => {
      // Apply cultural adaptations to each step
      const adaptedStep = { ...step };

      // Apply adaptation strategies
      for (const adaptationSet of culturalAdaptations) {
        for (const strategy of adaptationSet.adaptationStrategies) {
          if (strategy.sourceElement === 'primary_prompt') {
            adaptedStep.content.primaryPrompt = strategy.targetElement;
          }
          // Apply other adaptations...
        }
      }

      return adaptedStep;
    }));
  }

  /**
   * Get base template for a category
   */
  static getBaseTemplate(category: PathwayCategory): BaseTemplateDefinition {
    return this.CORE_TEMPLATES[category];
  }

  /**
   * Get available categories
   */
  static getAvailableCategories(): PathwayCategory[] {
    return Object.keys(this.CORE_TEMPLATES) as PathwayCategory[];
  }
}

export default PathwayTemplateFactory;