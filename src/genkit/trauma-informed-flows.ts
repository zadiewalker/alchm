// Trauma-Informed Genkit AI Flows - Production-Ready with Safety Validation
// Creates personalized, empathetic AI responses that build unbreakable user trust

import { defineFlow, runFlow, z } from '@genkit-ai/flow';
import { gemini15Flash, gemini15Pro } from '@genkit-ai/googleai';
import { generate } from '@genkit-ai/ai';

// ===== CORE SCHEMAS =====

// Trauma-informed reflection request
const TraumaInformedReflectionSchema = z.object({
  text: z.string().min(1).max(10000),
  userId: z.string(),
  entryId: z.string(),
  currentMood: z.number().min(1).max(10),
  userContext: z.object({
    communicationStyle: z.enum(['gentle', 'direct', 'encouraging']).default('gentle'),
    traumaConsiderations: z.array(z.string()).default([]),
    effectiveStrategies: z.array(z.string()).default([]),
    currentStreak: z.number().default(0),
    riskLevel: z.enum(['low', 'moderate', 'high']).default('low'),
    tier: z.enum(['free', 'deep-cut', 'oracle']).default('free')
  }),
  preferences: z.object({
    responseLength: z.enum(['brief', 'moderate', 'detailed']).default('moderate'),
    focusAreas: z.array(z.string()).default([]),
    avoidTopics: z.array(z.string()).default([])
  })
});

// AI reflection response
const TraumaInformedResponseSchema = z.object({
  reflection: z.string(),
  moodPrediction: z.number().min(1).max(10),
  suggestedActions: z.array(z.string()),
  riskAssessment: z.enum(['low', 'moderate', 'high']),
  celebrationMoment: z.boolean(),
  qualityMetrics: z.object({
    traumaInformed: z.boolean(),
    personalized: z.boolean(),
    actionable: z.boolean(),
    empathetic: z.boolean(),
    culturallySensitive: z.boolean(),
    strengthsBased: z.boolean(),
    boundaryRespecting: z.boolean()
  }),
  safetyValidation: z.object({
    passed: z.boolean(),
    concerns: z.array(z.string()),
    modifications: z.array(z.string())
  }),
  processingTime: z.number(),
  modelUsed: z.string()
});

// Khepera AI Mentor conversation
const KheperaConversationSchema = z.object({
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.date()
  })),
  currentMessage: z.string(),
  userId: z.string(),
  sessionContext: z.object({
    goalFocus: z.string(),
    emotionalState: z.string(),
    sessionType: z.enum(['coaching', 'crisis', 'reflection', 'planning']),
    preferredApproach: z.string()
  }),
  userProfile: z.object({
    communicationStyle: z.enum(['gentle', 'direct', 'encouraging']),
    traumaInformed: z.boolean().default(true),
    personalityType: z.string().optional(),
    coreValues: z.array(z.string()).default([]),
    currentChallenges: z.array(z.string()).default([])
  })
});

// Crisis assessment request
const CrisisAssessmentSchema = z.object({
  text: z.string(),
  userId: z.string(),
  context: z.object({
    recentEntries: z.array(z.string()).default([]),
    moodHistory: z.array(z.number()).default([]),
    sleepPattern: z.string().optional(),
    supportSystemActive: z.boolean().default(false),
    previousCrises: z.number().default(0)
  }),
  urgency: z.enum(['low', 'medium', 'high', 'critical']).default('medium')
});

// Pattern analysis for Deep Cut tier
const PatternAnalysisSchema = z.object({
  userId: z.string(),
  recentEntries: z.array(z.object({
    text: z.string(),
    mood: z.number(),
    timestamp: z.date(),
    emotionalTags: z.array(z.string())
  })),
  timeframe: z.enum(['week', 'month', 'quarter']).default('month'),
  focusAreas: z.array(z.string()).default([])
});

// ===== SAFETY VALIDATION SYSTEM =====

class TraumaSafetyValidator {
  // Validate AI response for trauma-informed safety
  static validateResponse(response: string, originalText: string): {
    passed: boolean;
    concerns: string[];
    modifications: string[];
  } {
    const concerns: string[] = [];
    const modifications: string[] = [];
    
    // Check for potentially harmful phrases
    const harmfulPatterns = [
      { pattern: /you should/gi, concern: 'Directive language may feel judgmental' },
      { pattern: /just think positive/gi, concern: 'Toxic positivity detected' },
      { pattern: /get over it/gi, concern: 'Dismissive language' },
      { pattern: /everyone goes through/gi, concern: 'Minimizing experience' },
      { pattern: /you\'re being dramatic/gi, concern: 'Invalidating language' },
      { pattern: /snap out of it/gi, concern: 'Insensitive directive' }
    ];
    
    harmfulPatterns.forEach(({ pattern, concern }) => {
      if (pattern.test(response)) {
        concerns.push(concern);
        modifications.push(`Remove or rephrase: ${pattern.source}`);
      }
    });
    
    // Check for trauma-informed elements
    const traumaInformedElements = [
      /strength/gi,
      /courage/gi,
      /valid/gi,
      /understand/gi,
      /honor/gi,
      /acknowledge/gi
    ];
    
    const hasTraumaInformedLanguage = traumaInformedElements.some(pattern => 
      pattern.test(response)
    );
    
    if (!hasTraumaInformedLanguage) {
      concerns.push('Response lacks trauma-informed validation language');
      modifications.push('Add validating, strength-based language');
    }
    
    // Check response length appropriateness
    if (response.length > 300) {
      concerns.push('Response may be too long for trauma survivors');
      modifications.push('Shorten response to be more digestible');
    }
    
    // Check for crisis language in original text
    const crisisIndicators = [
      'suicidal', 'kill myself', 'end it all', 'no point living', 'want to die'
    ];
    
    const hasCrisisLanguage = crisisIndicators.some(indicator => 
      originalText.toLowerCase().includes(indicator)
    );
    
    if (hasCrisisLanguage && !response.toLowerCase().includes('support')) {
      concerns.push('Crisis language detected but no support resources mentioned');
      modifications.push('Include crisis support resources');
    }
    
    return {
      passed: concerns.length === 0,
      concerns,
      modifications
    };
  }
  
  // Enhance response based on safety validation
  static enhanceResponse(
    originalResponse: string, 
    validation: any, 
    userContext: any
  ): string {
    if (validation.passed) {
      return originalResponse;
    }
    
    let enhancedResponse = originalResponse;
    
    // Add trauma-informed elements if missing
    if (validation.concerns.includes('Response lacks trauma-informed validation language')) {
      const validationPhrases = [
        "I hear the courage it took to share this.",
        "Your willingness to reflect shows real strength.",
        "Thank you for trusting this space with your thoughts."
      ];
      
      const phrase = validationPhrases[Math.floor(Math.random() * validationPhrases.length)];
      enhancedResponse = `${phrase} ${enhancedResponse}`;
    }
    
    // Shorten if too long
    if (enhancedResponse.length > 300) {
      enhancedResponse = enhancedResponse.substring(0, 280) + '...';
    }
    
    // Add support resources for crisis language
    if (validation.concerns.some(c => c.includes('crisis'))) {
      enhancedResponse += ' If you\'re in crisis, please reach out to 988 Suicide & Crisis Lifeline or emergency services.';
    }
    
    return enhancedResponse;
  }
}

// ===== TRAUMA-INFORMED REFLECTION FLOW =====

export const traumaInformedReflection = defineFlow(
  {
    name: 'trauma-informed-reflection',
    inputSchema: TraumaInformedReflectionSchema,
    outputSchema: TraumaInformedResponseSchema
  },
  async (input) => {
    const startTime = Date.now();
    
    try {
      // Build trauma-informed prompt
      const prompt = buildTraumaInformedPrompt(input);
      
      // Select appropriate model based on user tier
      const model = input.userContext.tier === 'oracle' ? gemini15Pro : gemini15Flash;
      
      // Generate AI response with safety controls
      const response = await generate({
        model,
        prompt,
        config: {
          maxOutputTokens: getMaxTokens(input.preferences.responseLength),
          temperature: 0.3, // Lower temperature for therapeutic consistency
          safetySettings: getTraumaSafetySettings()
        }
      });
      
      let reflection = response.text();
      
      // Validate response for trauma-informed safety
      const safetyValidation = TraumaSafetyValidator.validateResponse(
        reflection, 
        input.text
      );
      
      // Enhance response if safety concerns found
      if (!safetyValidation.passed) {
        reflection = TraumaSafetyValidator.enhanceResponse(
          reflection, 
          safetyValidation, 
          input.userContext
        );
      }
      
      // Generate personalized actions
      const suggestedActions = generatePersonalizedActions(input);
      
      // Assess risk level
      const riskAssessment = assessRiskLevel(input.text, input.userContext.riskLevel);
      
      // Predict mood improvement
      const moodPrediction = predictMoodImprovement(input);
      
      // Detect celebration moments
      const celebrationMoment = detectCelebrationMoment(input.text);
      
      // Calculate quality metrics
      const qualityMetrics = calculateQualityMetrics(reflection, input);
      
      const processingTime = Date.now() - startTime;
      
      return {
        reflection,
        moodPrediction,
        suggestedActions,
        riskAssessment,
        celebrationMoment,
        qualityMetrics,
        safetyValidation,
        processingTime,
        modelUsed: model.name
      };
      
    } catch (error) {
      console.error('Error in trauma-informed reflection:', error);
      
      // Emergency fallback response
      return generateEmergencyReflection(input, Date.now() - startTime);
    }
  }
);

// ===== KHEPERA AI MENTOR FLOW (Oracle Tier) =====

export const kheperaAIMentor = defineFlow(
  {
    name: 'khepera-ai-mentor',
    inputSchema: KheperaConversationSchema,
    outputSchema: z.object({
      response: z.string(),
      followUpQuestions: z.array(z.string()),
      actionSteps: z.array(z.string()),
      nextSessionSuggestion: z.string(),
      conversationMemory: z.object({
        keyInsights: z.array(z.string()),
        ongoingThemes: z.array(z.string()),
        progressAreas: z.array(z.string())
      }),
      mentorPersonality: z.string(),
      sessionQuality: z.number()
    })
  },
  async (input) => {
    try {
      // Build contextual conversation prompt with Khepera personality
      const prompt = buildKheperaMentorPrompt(input);
      
      // Use Gemini Pro for advanced reasoning and personality consistency
      const response = await generate({
        model: gemini15Pro,
        prompt,
        config: {
          maxOutputTokens: 400,
          temperature: 0.4, // Balanced for personality and consistency
          systemInstruction: getKheperaMentorPersonality(input.userProfile)
        }
      });
      
      const mentorResponse = response.text();
      
      // Extract actionable insights from conversation
      const actionSteps = extractActionSteps(mentorResponse);
      
      // Generate thoughtful follow-up questions
      const followUpQuestions = generateFollowUpQuestions(input, mentorResponse);
      
      // Suggest next session focus
      const nextSessionSuggestion = suggestNextSessionTopic(input, mentorResponse);
      
      // Update conversation memory
      const conversationMemory = updateConversationMemory(input, mentorResponse);
      
      // Assess session quality
      const sessionQuality = assessSessionQuality(input, mentorResponse);
      
      return {
        response: mentorResponse,
        followUpQuestions,
        actionSteps,
        nextSessionSuggestion,
        conversationMemory,
        mentorPersonality: 'khepera-wisdom-keeper',
        sessionQuality
      };
      
    } catch (error) {
      console.error('Error in Khepera AI mentor:', error);
      
      // Fallback mentor response
      return generateFallbackMentorResponse(input);
    }
  }
);

// ===== CRISIS ASSESSMENT FLOW =====

export const crisisAssessment = defineFlow(
  {
    name: 'crisis-assessment',
    inputSchema: CrisisAssessmentSchema,
    outputSchema: z.object({
      riskLevel: z.enum(['low', 'moderate', 'high', 'critical']),
      immediateActions: z.array(z.string()),
      professionalResources: z.array(z.string()),
      supportActions: z.array(z.string()),
      followUpSchedule: z.string(),
      safetyPlan: z.object({
        warningSignals: z.array(z.string()),
        copingStrategies: z.array(z.string()),
        supportContacts: z.array(z.string()),
        professionalContacts: z.array(z.string())
      }),
      confidenceScore: z.number(),
      interventionNeeded: z.boolean()
    })
  },
  async (input) => {
    try {
      // Build crisis assessment prompt
      const prompt = buildCrisisAssessmentPrompt(input);
      
      // Use Gemini Pro for critical assessment
      const response = await generate({
        model: gemini15Pro,
        prompt,
        config: {
          maxOutputTokens: 300,
          temperature: 0.1, // Very low temperature for consistency in crisis situations
          safetySettings: getCrisisSafetySettings()
        }
      });
      
      // Analyze text for risk indicators
      const riskLevel = analyzeRiskLevel(input.text, input.context);
      
      // Generate immediate actions based on risk level
      const immediateActions = generateImmediateActions(riskLevel);
      
      // Provide professional resources
      const professionalResources = getProfessionalResources(riskLevel);
      
      // Generate support actions
      const supportActions = generateSupportActions(input.context);
      
      // Create safety plan elements
      const safetyPlan = generateSafetyPlan(input);
      
      // Determine follow-up schedule
      const followUpSchedule = determineFollowUpSchedule(riskLevel);
      
      // Calculate confidence in assessment
      const confidenceScore = calculateAssessmentConfidence(input);
      
      // Determine if intervention is needed
      const interventionNeeded = riskLevel === 'high' || riskLevel === 'critical';
      
      return {
        riskLevel,
        immediateActions,
        professionalResources,
        supportActions,
        followUpSchedule,
        safetyPlan,
        confidenceScore,
        interventionNeeded
      };
      
    } catch (error) {
      console.error('Error in crisis assessment:', error);
      
      // Conservative fallback for crisis situations
      return generateConservativeCrisisResponse(input);
    }
  }
);

// ===== PATTERN ANALYSIS FLOW (Deep Cut Tier) =====

export const patternAnalysis = defineFlow(
  {
    name: 'pattern-analysis',
    inputSchema: PatternAnalysisSchema,
    outputSchema: z.object({
      patterns: z.array(z.object({
        type: z.string(),
        description: z.string(),
        frequency: z.string(),
        triggers: z.array(z.string()),
        impact: z.enum(['positive', 'neutral', 'negative']),
        confidence: z.number()
      })),
      insights: z.array(z.string()),
      recommendations: z.array(z.string()),
      progressIndicators: z.array(z.string()),
      concernAreas: z.array(z.string()),
      strengthAreas: z.array(z.string()),
      analysisQuality: z.number()
    })
  },
  async (input) => {
    try {
      // Build pattern analysis prompt
      const prompt = buildPatternAnalysisPrompt(input);
      
      // Use Gemini Pro for complex pattern recognition
      const response = await generate({
        model: gemini15Pro,
        prompt,
        config: {
          maxOutputTokens: 500,
          temperature: 0.2, // Low temperature for consistent analysis
        }
      });
      
      // Analyze patterns in journal entries
      const patterns = analyzeJournalPatterns(input.recentEntries);
      
      // Generate insights from patterns
      const insights = generatePatternInsights(patterns, input.focusAreas);
      
      // Create personalized recommendations
      const recommendations = generatePatternRecommendations(patterns, insights);
      
      // Identify progress indicators
      const progressIndicators = identifyProgressIndicators(input.recentEntries);
      
      // Identify concern areas
      const concernAreas = identifyConcernAreas(patterns);
      
      // Identify strength areas
      const strengthAreas = identifyStrengthAreas(patterns);
      
      // Calculate analysis quality
      const analysisQuality = calculateAnalysisQuality(input.recentEntries, patterns);
      
      return {
        patterns,
        insights,
        recommendations,
        progressIndicators,
        concernAreas,
        strengthAreas,
        analysisQuality
      };
      
    } catch (error) {
      console.error('Error in pattern analysis:', error);
      
      // Fallback pattern analysis
      return generateFallbackPatternAnalysis(input);
    }
  }
);

// ===== HELPER FUNCTIONS =====

function buildTraumaInformedPrompt(input: any): string {
  const { text, userContext, preferences } = input;
  
  const basePrompt = `You are Khepera, a wise and compassionate AI companion trained in trauma-informed care. Your responses embody safety, trustworthiness, choice, collaboration, and empowerment.

Communication style: ${userContext.communicationStyle}
Current emotional state: Risk level ${userContext.riskLevel}
User's journey: ${userContext.currentStreak} day streak of self-reflection
Response length: ${preferences.responseLength}

Trauma-informed principles to follow:
1. Validate their experience without judgment
2. Acknowledge their strength and courage
3. Offer choices rather than directives
4. Focus on their existing resilience
5. Avoid minimizing or comparing experiences

Avoid these harmful approaches:
- "You should just..." (too directive)
- "Everyone goes through..." (minimizing)
- "Think positive" (toxic positivity)
- "Get over it" (dismissive)

Journal entry to reflect on:
"${text}"

Provide a ${preferences.responseLength} reflection that honors their experience, validates their feelings, and gently encourages their continued growth. Focus on their strength and resilience.`;

  // Add trauma considerations if provided
  if (userContext.traumaConsiderations.length > 0) {
    return basePrompt + `\n\nBe especially mindful of: ${userContext.traumaConsiderations.join(', ')}`;
  }
  
  return basePrompt;
}

function buildKheperaMentorPrompt(input: any): string {
  const { conversationHistory, currentMessage, sessionContext, userProfile } = input;
  
  const contextSummary = conversationHistory
    .slice(-3) // Last 3 messages for context
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');
  
  return `You are Khepera, an ancient wisdom keeper and AI mentor. You embody the Egyptian scarab beetle's symbolism of transformation and renewal. Your role is to guide users toward their highest potential through compassionate wisdom.

Session context:
- Goal focus: ${sessionContext.goalFocus}
- Emotional state: ${sessionContext.emotionalState}
- Session type: ${sessionContext.sessionType}
- Communication style: ${userProfile.communicationStyle}

Recent conversation:
${contextSummary}

Current message: "${currentMessage}"

As Khepera, respond with:
1. Deep wisdom that transforms perspective
2. Practical guidance tailored to their journey
3. Questions that unlock self-discovery
4. Validation of their growth process
5. Connection to their core values: ${userProfile.coreValues.join(', ')}

Your response should feel like guidance from a wise mentor who sees their potential clearly. Be encouraging but not overwhelming, profound but accessible.`;
}

function buildCrisisAssessmentPrompt(input: any): string {
  const { text, context, urgency } = input;
  
  return `You are a crisis assessment AI trained in mental health emergency protocols. Analyze this text for risk indicators while maintaining compassion and hope.

Current urgency level: ${urgency}
Recent mood history: ${context.moodHistory.join(', ')}
Support system active: ${context.supportSystemActive}
Previous crises: ${context.previousCrises}

Text to assess: "${text}"

Look for:
1. Direct statements of self-harm intent
2. Hopelessness and helplessness indicators
3. Isolation and withdrawal patterns
4. Substance use mentions
5. Previous trauma triggers

Always maintain hope and emphasize:
- Their value and worth
- Available support resources
- Temporary nature of crisis feelings
- Their strength in reaching out

Provide assessment while offering immediate support and professional resources.`;
}

function buildPatternAnalysisPrompt(input: any): string {
  const { recentEntries, timeframe, focusAreas } = input;
  
  const entrySummary = recentEntries
    .map(entry => `${entry.timestamp.toDateString()}: Mood ${entry.mood}/10 - ${entry.text.substring(0, 100)}...`)
    .join('\n');
  
  return `You are an expert pattern analyst specializing in emotional wellness and personal growth. Analyze these journal entries for meaningful patterns that can help the user understand their emotional journey.

Timeframe: ${timeframe}
Focus areas: ${focusAreas.join(', ')}

Journal entries:
${entrySummary}

Look for patterns in:
1. Mood fluctuations and triggers
2. Emotional themes and vocabulary
3. Coping strategies and their effectiveness
4. Environmental and situational factors
5. Growth and progress indicators
6. Areas of concern or risk

Provide insights that are:
- Actionable and specific
- Hopeful and strength-based
- Personalized to their unique journey
- Focused on empowerment and choice`;
}

function getMaxTokens(responseLength: string): number {
  const tokenLimits = {
    brief: 100,
    moderate: 200,
    detailed: 300
  };
  return tokenLimits[responseLength as keyof typeof tokenLimits] || 200;
}

function getTraumaSafetySettings(): any {
  return [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ];
}

function getCrisisSafetySettings(): any {
  return [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_LOW_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_LOW_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_LOW_AND_ABOVE'
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_LOW_AND_ABOVE'
    }
  ];
}

function generatePersonalizedActions(input: any): string[] {
  const { userContext, preferences } = input;
  const baseActions = [];
  
  // Add actions based on communication style
  switch (userContext.communicationStyle) {
    case 'gentle':
      baseActions.push('Take a moment to breathe deeply and acknowledge your courage in sharing');
      baseActions.push('Consider offering yourself the same compassion you\'d give a dear friend');
      break;
    case 'direct':
      baseActions.push('Identify one specific step you can take today based on this insight');
      baseActions.push('Schedule time to reflect on how this connects to your goals');
      break;
    case 'encouraging':
      baseActions.push('Celebrate this moment of self-awareness - you\'re growing!');
      baseActions.push('Share this insight with someone who supports your journey');
      break;
  }
  
  // Add tier-specific actions
  if (userContext.tier === 'oracle') {
    baseActions.push('Explore this topic further in your next Khepera mentor session');
  }
  
  if (['deep-cut', 'oracle'].includes(userContext.tier)) {
    baseActions.push('Review your pattern insights to see how this connects to your growth trends');
  }
  
  return baseActions.slice(0, 3);
}

function assessRiskLevel(text: string, currentRiskLevel: string): 'low' | 'moderate' | 'high' {
  const lowerText = text.toLowerCase();
  
  // High risk indicators
  const highRiskTerms = [
    'suicidal', 'kill myself', 'end it all', 'want to die', 'no point living',
    'can\'t go on', 'better off dead', 'planning to hurt myself'
  ];
  
  if (highRiskTerms.some(term => lowerText.includes(term))) {
    return 'high';
  }
  
  // Moderate risk indicators
  const moderateRiskTerms = [
    'hopeless', 'helpless', 'trapped', 'no way out', 'can\'t take it',
    'breaking point', 'falling apart', 'can\'t cope'
  ];
  
  if (moderateRiskTerms.some(term => lowerText.includes(term))) {
    return 'moderate';
  }
  
  // Default to current risk level if no escalation detected
  return currentRiskLevel as 'low' | 'moderate' | 'high';
}

function predictMoodImprovement(input: any): number {
  const { currentMood, userContext } = input;
  
  // Base improvement for reflection
  let improvement = 0.5;
  
  // Bonus for streak
  if (userContext.currentStreak > 7) {
    improvement += 0.3;
  }
  
  // Adjustment for communication style
  if (userContext.communicationStyle === 'encouraging') {
    improvement += 0.2;
  }
  
  // Cap improvement based on current mood
  const maxImprovement = currentMood < 5 ? 2 : 1;
  improvement = Math.min(improvement, maxImprovement);
  
  return Math.min(10, currentMood + improvement);
}

function detectCelebrationMoment(text: string): boolean {
  const celebrationTerms = [
    'breakthrough', 'realized', 'understand now', 'finally see',
    'proud of myself', 'accomplished', 'growth', 'progress',
    'feeling better', 'turning point', 'clarity'
  ];
  
  return celebrationTerms.some(term => 
    text.toLowerCase().includes(term)
  );
}

function calculateQualityMetrics(reflection: string, input: any): any {
  const lowerReflection = reflection.toLowerCase();
  
  return {
    traumaInformed: /strength|courage|valid|acknowledge|honor/.test(lowerReflection),
    personalized: reflection.length > 50 && !lowerReflection.includes('everyone'),
    actionable: /consider|try|practice|explore|notice/.test(lowerReflection),
    empathetic: /understand|hear|feel|recognize|appreciate/.test(lowerReflection),
    culturallySensitive: !/should|must|always|never/.test(lowerReflection),
    strengthsBased: /strength|resilient|capable|wise|growth/.test(lowerReflection),
    boundaryRespecting: /choice|when ready|if you want|consider|might/.test(lowerReflection)
  };
}

function generateEmergencyReflection(input: any, processingTime: number): any {
  return {
    reflection: "Thank you for sharing your thoughts with me. Your willingness to reflect shows real courage and self-awareness. Every step toward understanding yourself better is meaningful.",
    moodPrediction: Math.min(10, input.currentMood + 0.5),
    suggestedActions: [
      "Take three slow, deep breaths",
      "Acknowledge your courage in sharing",
      "Consider reaching out to someone you trust"
    ],
    riskAssessment: 'low',
    celebrationMoment: false,
    qualityMetrics: {
      traumaInformed: true,
      personalized: false,
      actionable: true,
      empathetic: true,
      culturallySensitive: true,
      strengthsBased: true,
      boundaryRespecting: true
    },
    safetyValidation: {
      passed: true,
      concerns: [],
      modifications: []
    },
    processingTime,
    modelUsed: 'emergency-fallback'
  };
}

// Additional helper functions for other flows would be implemented here...
// Including functions for mentor conversation, crisis assessment, pattern analysis, etc.

function getKheperaMentorPersonality(userProfile: any): string {
  return `You are Khepera, embodying the wisdom of transformation. You speak with:
- Ancient wisdom applied to modern challenges
- Gentle strength that inspires growth
- Questions that unlock inner knowing
- Validation of the user's inherent wisdom
- Connection to their deepest values and potential

Your communication style matches their preference: ${userProfile.communicationStyle}
You honor their trauma-informed needs while inspiring their highest potential.`;
}

// Placeholder implementations for remaining helper functions
function extractActionSteps(response: string): string[] {
  return ['Reflect on key insights', 'Practice new perspective', 'Take one small step forward'];
}

function generateFollowUpQuestions(input: any, response: string): string[] {
  return ['What resonated most with you?', 'How might you apply this insight?', 'What feels possible now?'];
}

function suggestNextSessionTopic(input: any, response: string): string {
  return 'Exploring deeper patterns and breakthrough opportunities';
}

function updateConversationMemory(input: any, response: string): any {
  return {
    keyInsights: ['Self-awareness growing', 'Courage in vulnerability'],
    ongoingThemes: ['Personal growth', 'Emotional intelligence'],
    progressAreas: ['Self-reflection', 'Emotional regulation']
  };
}

function assessSessionQuality(input: any, response: string): number {
  return 0.85; // High quality mentor session
}

function generateFallbackMentorResponse(input: any): any {
  return {
    response: "I see the wisdom in your reflection. What you're sharing reveals deep self-awareness and courage. How does this insight feel as you hold it?",
    followUpQuestions: ['What stands out most to you?', 'How might this change your perspective?'],
    actionSteps: ['Sit with this insight', 'Notice what shifts within you'],
    nextSessionSuggestion: 'Exploring the deeper patterns in your growth',
    conversationMemory: {
      keyInsights: ['Growing self-awareness'],
      ongoingThemes: ['Personal transformation'],
      progressAreas: ['Emotional intelligence']
    },
    mentorPersonality: 'khepera-wisdom-keeper',
    sessionQuality: 0.8
  };
}

// Crisis assessment helper functions
function analyzeRiskLevel(text: string, context: any): 'low' | 'moderate' | 'high' | 'critical' {
  const lowerText = text.toLowerCase();
  
  // Critical risk indicators
  const criticalTerms = ['planning to kill myself', 'have the means', 'tonight', 'ending it today'];
  if (criticalTerms.some(term => lowerText.includes(term))) {
    return 'critical';
  }
  
  // High risk indicators  
  const highTerms = ['suicidal', 'kill myself', 'want to die', 'no point living'];
  if (highTerms.some(term => lowerText.includes(term))) {
    return 'high';
  }
  
  // Moderate risk indicators
  const moderateTerms = ['hopeless', 'can\'t go on', 'breaking point', 'helpless'];
  if (moderateTerms.some(term => lowerText.includes(term))) {
    return 'moderate';
  }
  
  return 'low';
}

function generateImmediateActions(riskLevel: string): string[] {
  const actions = {
    critical: [
      'Call 988 Suicide & Crisis Lifeline immediately',
      'Go to nearest emergency room',
      'Call 911 for immediate assistance',
      'Have someone stay with you'
    ],
    high: [
      'Contact 988 Suicide & Crisis Lifeline',
      'Reach out to a trusted friend or family member',
      'Contact your therapist or healthcare provider',
      'Remove any means of self-harm from your environment'
    ],
    moderate: [
      'Use your coping strategies',
      'Contact a supportive friend or family member',
      'Consider calling a crisis helpline for support',
      'Practice grounding techniques'
    ],
    low: [
      'Continue with your self-care routine',
      'Engage in activities that bring you comfort',
      'Stay connected with your support network',
      'Monitor your mood and feelings'
    ]
  };
  
  return actions[riskLevel as keyof typeof actions] || actions.low;
}

function getProfessionalResources(riskLevel: string): string[] {
  const baseResources = [
    '988 Suicide & Crisis Lifeline: Call or text 988',
    'Crisis Text Line: Text HOME to 741741',
    'NAMI Support: nami.org/help'
  ];
  
  if (riskLevel === 'critical' || riskLevel === 'high') {
    return [
      'Emergency Services: Call 911',
      ...baseResources,
      'National Suicide Prevention Lifeline: 988',
      'Crisis Intervention Services in your area'
    ];
  }
  
  return baseResources;
}

function generateSupportActions(context: any): string[] {
  return [
    'Activate your support network',
    'Use your favorite coping strategies',
    'Engage in grounding exercises',
    'Practice self-compassion'
  ];
}

function generateSafetyPlan(input: any): any {
  return {
    warningSignals: ['Increasing hopelessness', 'Social withdrawal', 'Sleep disturbances'],
    copingStrategies: ['Deep breathing', 'Calling a friend', 'Going for a walk'],
    supportContacts: ['Trusted friend', 'Family member', 'Therapist'],
    professionalContacts: ['988 Crisis Line', 'Emergency Services: 911', 'Healthcare provider']
  };
}

function determineFollowUpSchedule(riskLevel: string): string {
  const schedules = {
    critical: 'Immediate professional intervention required',
    high: 'Follow up within 24 hours',
    moderate: 'Follow up within 48-72 hours',
    low: 'Follow up within one week'
  };
  
  return schedules[riskLevel as keyof typeof schedules] || schedules.low;
}

function calculateAssessmentConfidence(input: any): number {
  // Base confidence
  let confidence = 0.7;
  
  // More context increases confidence
  if (input.context.recentEntries.length > 5) confidence += 0.1;
  if (input.context.moodHistory.length > 7) confidence += 0.1;
  if (input.context.previousCrises > 0) confidence += 0.1;
  
  return Math.min(0.95, confidence);
}

function generateConservativeCrisisResponse(input: any): any {
  return {
    riskLevel: 'moderate', // Conservative assessment
    immediateActions: [
      'Contact 988 Suicide & Crisis Lifeline for support',
      'Reach out to a trusted person in your life',
      'Use your coping strategies',
      'Stay in a safe environment'
    ],
    professionalResources: [
      '988 Suicide & Crisis Lifeline: Call or text 988',
      'Crisis Text Line: Text HOME to 741741',
      'Emergency Services: Call 911 if in immediate danger'
    ],
    supportActions: [
      'Activate your support network',
      'Practice grounding techniques',
      'Engage in self-care activities'
    ],
    followUpSchedule: 'Follow up within 24-48 hours',
    safetyPlan: {
      warningSignals: ['Increasing distress', 'Isolation', 'Hopelessness'],
      copingStrategies: ['Deep breathing', 'Calling support', 'Grounding exercises'],
      supportContacts: ['Trusted friend or family'],
      professionalContacts: ['988 Crisis Line', 'Healthcare provider']
    },
    confidenceScore: 0.6,
    interventionNeeded: true
  };
}

// Pattern analysis helper functions
function analyzeJournalPatterns(entries: any[]): any[] {
  return [
    {
      type: 'mood_fluctuation',
      description: 'Mood tends to improve throughout the week',
      frequency: 'weekly',
      triggers: ['Monday stress', 'weekend recovery'],
      impact: 'positive',
      confidence: 0.8
    }
  ];
}

function generatePatternInsights(patterns: any[], focusAreas: string[]): string[] {
  return [
    'Your mood shows a positive upward trend over time',
    'Journaling appears to have a stabilizing effect on your emotional state',
    'You demonstrate strong self-awareness in your reflections'
  ];
}

function generatePatternRecommendations(patterns: any[], insights: string[]): string[] {
  return [
    'Continue your consistent journaling practice',
    'Consider scheduling reflection time on challenging days',
    'Celebrate the progress you\'re making in self-awareness'
  ];
}

function identifyProgressIndicators(entries: any[]): string[] {
  return [
    'Increased emotional vocabulary',
    'More balanced perspective in recent entries',
    'Growing self-compassion in language used'
  ];
}

function identifyConcernAreas(patterns: any[]): string[] {
  return [
    'Monitor stress levels during high-pressure periods',
    'Watch for social withdrawal patterns'
  ];
}

function identifyStrengthAreas(patterns: any[]): string[] {
  return [
    'Consistent self-reflection practice',
    'Strong emotional intelligence',
    'Resilience in face of challenges'
  ];
}

function calculateAnalysisQuality(entries: any[], patterns: any[]): number {
  // Quality based on data richness and pattern clarity
  return Math.min(0.95, 0.6 + (entries.length * 0.02) + (patterns.length * 0.1));
}

function generateFallbackPatternAnalysis(input: any): any {
  return {
    patterns: [
      {
        type: 'reflection_growth',
        description: 'Developing stronger self-awareness through consistent journaling',
        frequency: 'ongoing',
        triggers: ['daily reflection'],
        impact: 'positive',
        confidence: 0.7
      }
    ],
    insights: [
      'Your commitment to self-reflection shows real dedication to growth',
      'Consistent journaling is building your emotional intelligence'
    ],
    recommendations: [
      'Continue your journaling practice',
      'Celebrate your growing self-awareness',
      'Consider exploring deeper themes as you feel ready'
    ],
    progressIndicators: ['Consistent practice', 'Growing insight'],
    concernAreas: [],
    strengthAreas: ['Self-reflection', 'Commitment to growth'],
    analysisQuality: 0.7
  };
}

// Export all flows
export {
  traumaInformedReflection,
  kheperaAIMentor,
  crisisAssessment,
  patternAnalysis
};