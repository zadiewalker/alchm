// Enhanced and optimized Gemini AI integration for ALCHM
import { getServerEnv } from './env';
import { sanitizeInput } from './security';
import { createApiError, ApiErrorCode } from './apiUtils';

// Enhanced AI response types
export interface EnhancedAIResponse {
  content: string;
  confidence: number;
  processingTime: number;
  model: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    cached: boolean;
    riskAssessment?: RiskAssessment;
    emotionalContext?: EmotionalContext;
    recommendations?: string[];
  };
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  immediateAction: boolean;
  resources: SupportResource[];
}

export interface EmotionalContext {
  primaryEmotion: string;
  intensity: number; // 0-1 scale
  valence: 'positive' | 'neutral' | 'negative';
  arousal: 'low' | 'medium' | 'high';
  complexity: 'simple' | 'mixed' | 'complex';
}

export interface SupportResource {
  type: 'hotline' | 'text' | 'chat' | 'professional' | 'community';
  name: string;
  contact: string;
  description: string;
  available24_7: boolean;
  languages: string[];
}

export interface TraumaInformedAnalysis {
  isTraumaRelated: boolean;
  traumaIndicators: string[];
  healingStrengths: string[];
  copingStrategies: string[];
  resilienceFactors: string[];
  supportRecommendations: string[];
  safetyPlan?: SafetyPlanSuggestion[];
}

export interface SafetyPlanSuggestion {
  category: 'warning_signs' | 'coping_strategies' | 'support_contacts' | 'professional_resources';
  suggestions: string[];
}

// Cache for AI responses
class AIResponseCache {
  private cache = new Map<string, { response: EnhancedAIResponse; expiresAt: number }>();
  private readonly TTL = 60 * 60 * 1000; // 1 hour

  set(key: string, response: EnhancedAIResponse): void {
    const expiresAt = Date.now() + this.TTL;
    this.cache.set(key, { response: { ...response, metadata: { ...response.metadata, cached: true } }, expiresAt });
    this.cleanup();
  }

  get(key: string): EnhancedAIResponse | null {
    const cached = this.cache.get(key);
    if (!cached || Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return cached.response;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // Would need to track hits/misses
    };
  }
}

// Enhanced Gemini AI service
export class EnhancedGeminiService {
  private apiKey: string;
  private cache = new AIResponseCache();
  private requestCount = 0;
  private errorCount = 0;
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  // Trauma-informed prompts optimized for Gemini
  private readonly TRAUMA_INFORMED_PROMPTS = {
    analysis: `You are Khepera, a trauma-informed AI guide specializing in healing and emotional intelligence. Your responses must be:

CORE PRINCIPLES:
- Safety-first: Never re-traumatize or provide medical/psychiatric advice
- Strength-based: Focus on resilience, survival skills, and existing coping mechanisms
- Culturally aware: Honor diverse expressions of emotion and healing
- Empowering: Support user agency and self-determination
- Non-judgmental: Validate experiences without minimizing or dismissing

RESPONSE STRUCTURE:
1. Validation & Acknowledgment (show you heard them)
2. Strength Recognition (identify their resilience/survival skills)
3. Gentle Reflection (offer perspective without judgment)
4. Empowering Suggestion (optional, user-choice focused)
5. Resource Connection (if appropriate, trauma-informed resources)

SAFETY PROTOCOLS:
- If crisis indicators detected: Provide immediate crisis resources
- If trauma memories surfaced: Emphasize grounding and safety
- If self-harm mentioned: Balance validation with safety resources
- Always end with affirmation of their worth and strength

Analyze this journal entry with trauma-informed care:`,

    reflection: `As Khepera, generate 3 gentle reflection prompts that:
- Honor the user's emotional experience
- Encourage self-compassion and strength-recognition
- Avoid potentially triggering or invasive questions
- Focus on present moment awareness and personal agency
- Support healing and growth at the user's own pace

Base these prompts on the following journal content:`,

    crisis: `CRISIS INTERVENTION MODE: This entry contains crisis indicators.

Respond with:
1. Immediate validation and safety affirmation
2. Crisis hotlines and emergency resources
3. Grounding techniques for immediate use
4. Reminder of their inherent worth and that help is available
5. Safety planning suggestions

Be direct, compassionate, and resource-focused. Prioritize immediate safety:`,

    strengthsBased: `Focus on identifying and reinforcing the user's existing strengths, resilience factors, and healthy coping mechanisms. Look for:
- Survival skills and adaptations
- Support systems and connections
- Creative expressions and outlets
- Acts of self-care and protection
- Moments of hope or meaning-making
- Evidence of post-traumatic growth

Reflect these strengths back to the user:`,

    culturalAwareness: `Respond with cultural humility and awareness. Consider:
- Language patterns and code-switching
- Cultural expressions of emotion and healing
- Community and family dynamics
- Spiritual or traditional healing practices
- Systemic and historical trauma contexts
- Identity intersections (race, gender, sexuality, etc.)

Honor their cultural context while providing support:`,

    riskAssessment: `Carefully assess risk level while maintaining therapeutic relationship:

LOW RISK: Adaptive coping, support present, future-oriented
MEDIUM RISK: Some concerning thoughts but safety intact, coping struggling
HIGH RISK: Safety compromised, isolation, persistent hopelessness
CRITICAL RISK: Immediate danger, specific plans, means available

Focus on protective factors and safety planning:`,

    reFraming: `Offer gentle cognitive reframing that:
- Validates their current perspective first
- Introduces alternative viewpoints carefully
- Emphasizes their strength in surviving/coping
- Connects to their values and goals
- Maintains hope without toxic positivity

Reframe with trauma awareness:`,

    resourceMatching: `Match appropriate resources based on:
- Presenting concerns and emotional state
- Cultural background and preferences
- Geographic location (if mentioned)
- Support system availability
- Previous helpful interventions mentioned

Provide trauma-informed resource recommendations:`
  };

  // Crisis keywords with enhanced detection
  private readonly CRISIS_INDICATORS = {
    immediate: [
      'kill myself', 'end my life', 'want to die', 'suicide', 'suicidal',
      'overdose', 'cutting deep', 'no point living', 'better off dead',
      'can\'t go on', 'nothing left', 'final goodbye'
    ],
    high: [
      'hurt myself', 'self-harm', 'cutting', 'burning myself', 'punish myself',
      'hate myself', 'worthless', 'burden', 'everyone better without me',
      'hopeless', 'trapped', 'no way out', 'can\'t escape'
    ],
    medium: [
      'numb', 'empty', 'disconnected', 'struggling', 'overwhelming',
      'can\'t cope', 'falling apart', 'breaking down', 'losing control'
    ],
    protective: [
      'getting help', 'therapy', 'support group', 'calling friend',
      'taking medication', 'using coping skills', 'staying safe'
    ]
  };

  // Trauma indicators for assessment
  private readonly TRAUMA_INDICATORS = [
    'flashback', 'nightmare', 'triggered', 'dissociat', 'panic attack',
    'hypervigilant', 'avoidance', 'intrusive thoughts', 'memory gaps',
    'emotional numb', 'survivor guilt', 'betrayal', 'violation'
  ];

  constructor() {
    const env = getServerEnv();
    this.apiKey = env.geminiApiKey || process.env.GEMINI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('[EnhancedGemini] API key not configured');
    }
  }

  // Main analysis method with enhanced features
  async analyzeJournalEntry(
    content: string, 
    requestId: string,
    options: {
      includeRiskAssessment?: boolean;
      includeResourceRecommendations?: boolean;
      culturalContext?: string;
      userHistory?: string[];
    } = {}
  ): Promise<EnhancedAIResponse> {
    const startTime = Date.now();
    const sanitizedContent = sanitizeInput(content);
    
    try {
      // Generate cache key
      const cacheKey = this.generateCacheKey(sanitizedContent, options);
      
      // Check cache first
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Detect crisis level
      const riskAssessment = this.assessRisk(sanitizedContent);
      
      // Select appropriate prompt based on risk level
      let selectedPrompt: string;
      if (riskAssessment.level === 'critical') {
        selectedPrompt = this.TRAUMA_INFORMED_PROMPTS.crisis;
      } else if (riskAssessment.immediateAction) {
        selectedPrompt = this.TRAUMA_INFORMED_PROMPTS.riskAssessment;
      } else {
        selectedPrompt = this.TRAUMA_INFORMED_PROMPTS.analysis;
      }

      // Add cultural context if provided
      if (options.culturalContext) {
        selectedPrompt = this.TRAUMA_INFORMED_PROMPTS.culturalAwareness + '\n\n' + selectedPrompt;
      }

      // Make API call to Gemini
      const response = await this.callGeminiAPI({
        prompt: selectedPrompt,
        content: sanitizedContent,
        temperature: riskAssessment.level === 'critical' ? 0.2 : 0.4,
        maxTokens: 600,
        requestId
      });

      // Process emotional context
      const emotionalContext = this.analyzeEmotionalContext(sanitizedContent);

      // Generate recommendations
      const recommendations = await this.generateRecommendations(
        sanitizedContent, 
        riskAssessment, 
        emotionalContext,
        requestId
      );

      // Construct enhanced response
      const enhancedResponse: EnhancedAIResponse = {
        content: response.content,
        confidence: response.confidence,
        processingTime: Date.now() - startTime,
        model: 'gemini-pro',
        tokenUsage: response.tokenUsage,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          cached: false,
          riskAssessment: options.includeRiskAssessment ? riskAssessment : undefined,
          emotionalContext,
          recommendations: options.includeResourceRecommendations ? recommendations : undefined
        }
      };

      // Cache the response
      this.cache.set(cacheKey, enhancedResponse);
      
      this.requestCount++;
      return enhancedResponse;

    } catch (error) {
      this.errorCount++;
      console.error('[EnhancedGemini] Analysis failed:', error);
      
      // Return safe fallback response
      return this.createFallbackResponse(riskAssessment, requestId, Date.now() - startTime);
    }
  }

  // Generate reflection prompts
  async generateReflectionPrompts(
    previousEntries: string[],
    requestId: string,
    culturalContext?: string
  ): Promise<string[]> {
    try {
      const context = previousEntries.slice(-3).join('\n---\n');
      const sanitizedContext = sanitizeInput(context);
      
      const prompt = culturalContext ? 
        this.TRAUMA_INFORMED_PROMPTS.culturalAwareness + '\n\n' + this.TRAUMA_INFORMED_PROMPTS.reflection :
        this.TRAUMA_INFORMED_PROMPTS.reflection;

      const response = await this.callGeminiAPI({
        prompt,
        content: sanitizedContext,
        temperature: 0.7,
        maxTokens: 300,
        requestId
      });

      return this.parseReflectionPrompts(response.content);
    } catch (error) {
      console.error('[EnhancedGemini] Reflection prompt generation failed:', error);
      return this.getFallbackReflectionPrompts();
    }
  }

  // Assess trauma indicators
  async assessTraumaIndicators(
    content: string,
    requestId: string
  ): Promise<TraumaInformedAnalysis> {
    try {
      const sanitizedContent = sanitizeInput(content);
      
      const response = await this.callGeminiAPI({
        prompt: this.TRAUMA_INFORMED_PROMPTS.strengthsBased,
        content: sanitizedContent,
        temperature: 0.3,
        maxTokens: 400,
        requestId
      });

      return this.parseTraumaAnalysis(response.content, sanitizedContent);
    } catch (error) {
      console.error('[EnhancedGemini] Trauma assessment failed:', error);
      return this.getFallbackTraumaAnalysis();
    }
  }

  // Private helper methods

  private async callGeminiAPI({
    prompt,
    content,
    temperature = 0.4,
    maxTokens = 500,
    requestId
  }: {
    prompt: string;
    content: string;
    temperature?: number;
    maxTokens?: number;
    requestId: string;
  }): Promise<{
    content: string;
    confidence: number;
    tokenUsage: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    if (!this.apiKey) {
      throw createApiError(
        ApiErrorCode.EXTERNAL_API_ERROR,
        'Gemini API key not configured',
        undefined,
        'AI service temporarily unavailable',
        requestId
      );
    }

    const fullPrompt = `${prompt}\n\nJournal Entry:\n${content}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: fullPrompt
        }]
      }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        topP: 0.8,
        topK: 40,
        candidateCount: 1
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_ONLY_HIGH'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_ONLY_HIGH'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_ONLY_HIGH' // Allow discussion of difficult topics in therapeutic context
        }
      ]
    };

    const response = await fetch(`${this.baseUrl}/gemini-pro:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.apiKey
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw createApiError(
        ApiErrorCode.EXTERNAL_API_ERROR,
        `Gemini API error: ${response.status} - ${errorText}`,
        { status: response.status, response: errorText },
        'AI service temporarily unavailable',
        requestId
      );
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw createApiError(
        ApiErrorCode.EXTERNAL_API_ERROR,
        'Invalid response format from Gemini API',
        data,
        'AI service returned invalid response',
        requestId
      );
    }

    const responseText = data.candidates[0].content.parts[0].text;
    const tokenUsage = {
      promptTokens: data.usageMetadata?.promptTokenCount || 0,
      completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
      totalTokens: data.usageMetadata?.totalTokenCount || 0
    };

    return {
      content: responseText,
      confidence: this.calculateConfidence(data.candidates[0]),
      tokenUsage
    };
  }

  private assessRisk(content: string): RiskAssessment {
    const lowerContent = content.toLowerCase();
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    const indicators: string[] = [];
    let immediateAction = false;

    // Check for immediate crisis indicators
    for (const indicator of this.CRISIS_INDICATORS.immediate) {
      if (lowerContent.includes(indicator)) {
        level = 'critical';
        indicators.push(indicator);
        immediateAction = true;
      }
    }

    // Check for high-risk indicators
    if (level !== 'critical') {
      for (const indicator of this.CRISIS_INDICATORS.high) {
        if (lowerContent.includes(indicator)) {
          level = 'high';
          indicators.push(indicator);
          immediateAction = true;
        }
      }
    }

    // Check for medium-risk indicators
    if (level === 'low') {
      for (const indicator of this.CRISIS_INDICATORS.medium) {
        if (lowerContent.includes(indicator)) {
          level = 'medium';
          indicators.push(indicator);
        }
      }
    }

    // Check for protective factors
    const protectiveFactors = this.CRISIS_INDICATORS.protective.filter(
      factor => lowerContent.includes(factor)
    );

    if (protectiveFactors.length > 0 && level !== 'critical') {
      // Adjust risk level down if protective factors are present
      if (level === 'high') level = 'medium';
      if (level === 'medium') level = 'low';
    }

    return {
      level,
      indicators,
      immediateAction,
      resources: this.getSupportResources(level)
    };
  }

  private analyzeEmotionalContext(content: string): EmotionalContext {
    const emotionWords = {
      positive: ['happy', 'joy', 'excited', 'grateful', 'peaceful', 'content', 'hopeful', 'proud', 'loved'],
      negative: ['sad', 'angry', 'afraid', 'anxious', 'depressed', 'hurt', 'lonely', 'guilty', 'ashamed'],
      complex: ['conflicted', 'confused', 'overwhelmed', 'mixed', 'complicated', 'torn', 'ambivalent']
    };

    const lowerContent = content.toLowerCase();
    let primaryEmotion = 'neutral';
    let valence: 'positive' | 'neutral' | 'negative' = 'neutral';
    let intensity = 0.5;
    let arousal: 'low' | 'medium' | 'high' = 'medium';
    let complexity: 'simple' | 'mixed' | 'complex' = 'simple';

    // Simple emotion detection (could be enhanced with ML)
    const positiveCount = emotionWords.positive.filter(word => lowerContent.includes(word)).length;
    const negativeCount = emotionWords.negative.filter(word => lowerContent.includes(word)).length;
    const complexCount = emotionWords.complex.filter(word => lowerContent.includes(word)).length;

    if (complexCount > 0 || (positiveCount > 0 && negativeCount > 0)) {
      complexity = 'complex';
      valence = 'neutral';
      primaryEmotion = 'mixed emotions';
    } else if (positiveCount > negativeCount) {
      valence = 'positive';
      primaryEmotion = 'positive';
    } else if (negativeCount > positiveCount) {
      valence = 'negative';
      primaryEmotion = 'negative';
    }

    // Estimate intensity based on certain words
    const intensityWords = ['very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally'];
    intensity = Math.min(1.0, 0.3 + (intensityWords.filter(word => lowerContent.includes(word)).length * 0.2));

    // Estimate arousal based on content length and emotional words
    const totalEmotionWords = positiveCount + negativeCount + complexCount;
    if (totalEmotionWords > 5 || content.length > 500) {
      arousal = 'high';
    } else if (totalEmotionWords < 2 || content.length < 100) {
      arousal = 'low';
    }

    return {
      primaryEmotion,
      intensity,
      valence,
      arousal,
      complexity
    };
  }

  private async generateRecommendations(
    content: string,
    riskAssessment: RiskAssessment,
    emotionalContext: EmotionalContext,
    requestId: string
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Crisis-specific recommendations
    if (riskAssessment.level === 'critical' || riskAssessment.immediateAction) {
      recommendations.push(
        'Consider reaching out to a crisis helpline immediately',
        'Connect with a trusted friend or family member',
        'Go to your nearest emergency room if you feel unsafe'
      );
    }

    // Emotional regulation recommendations
    if (emotionalContext.arousal === 'high') {
      recommendations.push(
        'Try deep breathing or grounding exercises',
        'Consider taking a short walk or doing gentle movement',
        'Practice mindfulness or meditation'
      );
    }

    // General wellness recommendations
    recommendations.push(
      'Continue journaling as a form of self-expression',
      'Maintain your sleep and nutrition routines',
      'Consider professional counseling if you haven\'t already'
    );

    return recommendations;
  }

  private getSupportResources(riskLevel: 'low' | 'medium' | 'high' | 'critical'): SupportResource[] {
    const baseResources: SupportResource[] = [
      {
        type: 'hotline',
        name: 'National Suicide Prevention Lifeline',
        contact: '988',
        description: '24/7 crisis support',
        available24_7: true,
        languages: ['English', 'Spanish']
      },
      {
        type: 'text',
        name: 'Crisis Text Line',
        contact: 'Text HOME to 741741',
        description: 'Text-based crisis support',
        available24_7: true,
        languages: ['English', 'Spanish']
      }
    ];

    if (riskLevel === 'critical' || riskLevel === 'high') {
      baseResources.unshift({
        type: 'professional',
        name: 'Emergency Services',
        contact: '911',
        description: 'Immediate emergency assistance',
        available24_7: true,
        languages: ['English']
      });
    }

    return baseResources;
  }

  private calculateConfidence(candidate: any): number {
    // Simple confidence calculation based on safety ratings and finish reason
    const safetyRatings = candidate.safetyRatings || [];
    const finishReason = candidate.finishReason;

    let confidence = 0.8; // Base confidence

    if (finishReason === 'STOP') {
      confidence += 0.1;
    } else if (finishReason === 'MAX_TOKENS') {
      confidence -= 0.1;
    } else if (finishReason === 'SAFETY') {
      confidence -= 0.3;
    }

    // Adjust based on safety ratings
    const highRiskRatings = safetyRatings.filter((rating: any) => 
      rating.probability === 'HIGH' || rating.probability === 'MEDIUM'
    );

    if (highRiskRatings.length > 0) {
      confidence -= 0.2;
    }

    return Math.max(0.1, Math.min(1.0, confidence));
  }

  private generateCacheKey(content: string, options: any): string {
    const contentHash = createHash('md5').update(content).digest('hex');
    const optionsHash = createHash('md5').update(JSON.stringify(options)).digest('hex');
    return `gemini:${contentHash}:${optionsHash}`;
  }

  private createFallbackResponse(
    riskAssessment: RiskAssessment,
    requestId: string,
    processingTime: number
  ): EnhancedAIResponse {
    const content = riskAssessment.level === 'critical' ? 
      "I hear that you're going through something very difficult right now. Your feelings are valid, and you don't have to face this alone. Please consider reaching out to a crisis helpline (988) or trusted person immediately. You matter, and help is available." :
      "Thank you for sharing with me. I can sense you're processing some important feelings. Remember that seeking support is a sign of strength, and you have the power to take things one step at a time.";

    return {
      content,
      confidence: 0.5,
      processingTime,
      model: 'fallback',
      tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
        cached: false,
        riskAssessment
      }
    };
  }

  private parseReflectionPrompts(content: string): string[] {
    // Extract prompts from AI response
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const prompts: string[] = [];

    for (const line of lines) {
      // Look for numbered items or bullet points
      const match = line.match(/^\d+[\.\)]\s*(.+)$/) || line.match(/^[-\*]\s*(.+)$/);
      if (match) {
        prompts.push(match[1].trim());
      } else if (line.endsWith('?') && line.length > 20) {
        prompts.push(line.trim());
      }
    }

    return prompts.slice(0, 3); // Return max 3 prompts
  }

  private getFallbackReflectionPrompts(): string[] {
    return [
      "What is one thing you appreciate about yourself today?",
      "How have you shown strength or resilience recently?",
      "What would you tell a good friend who was going through something similar?"
    ];
  }

  private parseTraumaAnalysis(content: string, originalContent: string): TraumaInformedAnalysis {
    const lowerOriginal = originalContent.toLowerCase();
    
    return {
      isTraumaRelated: this.TRAUMA_INDICATORS.some(indicator => lowerOriginal.includes(indicator)),
      traumaIndicators: this.TRAUMA_INDICATORS.filter(indicator => lowerOriginal.includes(indicator)),
      healingStrengths: ['resilience', 'self-awareness', 'courage to share'],
      copingStrategies: ['journaling', 'self-reflection', 'emotional expression'],
      resilienceFactors: ['ability to articulate feelings', 'seeking understanding'],
      supportRecommendations: [
        'Continue journaling as a healing practice',
        'Consider trauma-informed therapy if not already engaged',
        'Practice grounding techniques for difficult moments'
      ]
    };
  }

  private getFallbackTraumaAnalysis(): TraumaInformedAnalysis {
    return {
      isTraumaRelated: false,
      traumaIndicators: [],
      healingStrengths: ['self-reflection', 'emotional awareness'],
      copingStrategies: ['journaling', 'self-expression'],
      resilienceFactors: ['willingness to process emotions'],
      supportRecommendations: ['Continue self-care practices']
    };
  }

  // Public utility methods

  getPerformanceMetrics(): {
    requestCount: number;
    errorCount: number;
    successRate: number;
    cacheStats: { size: number; hitRate: number };
  } {
    return {
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      successRate: this.requestCount > 0 ? (this.requestCount - this.errorCount) / this.requestCount : 0,
      cacheStats: this.cache.getStats()
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Export singleton instance
export const enhancedGeminiService = new EnhancedGeminiService();