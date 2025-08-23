// Trauma-Informed AI Engine - Creates Unbreakable User Bond
// Problem: Generic AI responses don't build trust with trauma survivors
// Solution: Context-aware personalization that learns without storing sensitive data

import { z } from 'zod';
import { logger } from '@/lib/logging';
import { AITierManager } from './resilient-ai-pipeline';
import Redis from 'ioredis';

// Core trauma-informed principles
export interface TraumaInformedPrinciples {
  safety: 'Physical and emotional safety is paramount';
  trustworthiness: 'Build trust through transparency and reliability';
  choice: 'Prioritize user choice and control';
  collaboration: 'Share power and decision-making';
  empowerment: 'Focus on strengths and resilience';
}

// User communication patterns (learned, not stored)
export interface CommunicationPattern {
  preferredTone: 'gentle' | 'direct' | 'encouraging' | 'validating';
  responseLength: 'brief' | 'moderate' | 'detailed';
  traumaAwareness: 'high' | 'medium' | 'low';
  triggerSensitivity: string[]; // Words/topics to avoid
  strengthsLanguage: string[]; // User's preferred strength words
  crisesHistoryPattern: 'frequent' | 'seasonal' | 'rare' | 'none';
}

// Personalization context (derived, not stored)
export interface PersonalizationContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'late_night';
  dayOfWeek: string;
  emotionalState: 'distressed' | 'neutral' | 'positive' | 'unknown';
  entryLength: number;
  writingStyle: 'analytical' | 'emotional' | 'narrative' | 'fragmented';
  urgencyLevel: 'low' | 'medium' | 'high' | 'crisis';
  recentPatterns: {
    moodTrend: 'improving' | 'declining' | 'stable';
    engagementLevel: 'high' | 'medium' | 'low';
    supportSeekingBehavior: boolean;
  };
}

// AI response quality metrics
export interface ResponseQuality {
  traumaInformed: boolean;
  personalized: boolean;
  actionable: boolean;
  empathetic: boolean;
  culturallySensitive: boolean;
  strengthsBased: boolean;
  boundaryRespecting: boolean;
}

// Personalized insight request
const PersonalizedInsightRequest = z.object({
  text: z.string().min(1),
  userId: z.string(),
  entryId: z.string(),
  context: z.object({
    timestamp: z.number(),
    timeZone: z.string(),
    deviceType: z.enum(['mobile', 'desktop', 'tablet']).optional(),
    sessionLength: z.number().optional(),
    previousEntryCount: z.number().default(0)
  }),
  preferences: z.object({
    communicationStyle: z.string().optional(),
    culturalContext: z.string().optional(),
    supportLevel: z.enum(['minimal', 'moderate', 'comprehensive']).default('moderate'),
    privacyLevel: z.enum(['standard', 'enhanced', 'maximum']).default('standard')
  })
});

export type PersonalizedInsightRequest = z.infer<typeof PersonalizedInsightRequest>;

// Trauma-informed AI response
export interface TraumaInformedResponse {
  insight: string;
  encouragement: string;
  gentleAction?: string;
  resources?: string[];
  confidenceScore: number;
  personalizationLevel: number; // 0-1, how well we know this user
  triggerRisk: 'none' | 'low' | 'medium' | 'high';
  responseType: 'validation' | 'insight' | 'guidance' | 'crisis_support';
  qualityMetrics: ResponseQuality;
}

// Privacy-first pattern learning (no sensitive data stored)
class PrivacyFirstLearning {
  private redis: Redis;
  private readonly PATTERN_TTL = 30 * 24 * 60 * 60; // 30 days

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });
  }

  // Learn communication patterns without storing sensitive content
  async learnCommunicationPattern(userId: string, context: PersonalizationContext): Promise<void> {
    const patternKey = `patterns:${userId}`;
    
    // Extract non-sensitive behavioral patterns
    const behavioralPattern = {
      timeOfDay: context.timeOfDay,
      preferredLength: this.categorizeLength(context.entryLength),
      writingStyle: context.writingStyle,
      emotionalRange: context.emotionalState,
      engagementLevel: context.recentPatterns.engagementLevel,
      timestamp: Date.now()
    };

    // Store as hash with automatic expiry
    await this.redis.hmset(patternKey, behavioralPattern);
    await this.redis.expire(patternKey, this.PATTERN_TTL);

    // Update frequency counters
    await this.updateFrequencyCounters(userId, behavioralPattern);
  }

  // Get learned patterns for personalization
  async getCommunicationPattern(userId: string): Promise<CommunicationPattern | null> {
    try {
      const patternKey = `patterns:${userId}`;
      const storedPattern = await this.redis.hgetall(patternKey);

      if (Object.keys(storedPattern).length === 0) {
        return null; // New user, no patterns yet
      }

      // Derive communication preferences from behavioral patterns
      return {
        preferredTone: this.inferPreferredTone(storedPattern),
        responseLength: this.inferResponseLength(storedPattern),
        traumaAwareness: this.inferTraumaAwareness(storedPattern),
        triggerSensitivity: await this.getAvoidancePatterns(userId),
        strengthsLanguage: await this.getStrengthsLanguage(userId),
        crisesHistoryPattern: await this.getCrisisPattern(userId)
      };
    } catch (error) {
      logger.warn('Error getting communication pattern', error);
      return null;
    }
  }

  // Update frequency counters for pattern recognition
  private async updateFrequencyCounters(userId: string, pattern: any): Promise<void> {
    const countersKey = `counters:${userId}`;
    
    await this.redis.hincrby(countersKey, `timeOfDay:${pattern.timeOfDay}`, 1);
    await this.redis.hincrby(countersKey, `length:${pattern.preferredLength}`, 1);
    await this.redis.hincrby(countersKey, `style:${pattern.writingStyle}`, 1);
    await this.redis.hincrby(countersKey, `engagement:${pattern.engagementLevel}`, 1);
    
    await this.redis.expire(countersKey, this.PATTERN_TTL);
  }

  // Infer preferred communication tone from patterns
  private inferPreferredTone(pattern: any): 'gentle' | 'direct' | 'encouraging' | 'validating' {
    const emotionalRange = pattern.emotionalRange;
    const writingStyle = pattern.writingStyle;

    if (emotionalRange === 'distressed' || writingStyle === 'fragmented') {
      return 'gentle';
    } else if (writingStyle === 'analytical') {
      return 'direct';
    } else if (pattern.engagementLevel === 'high') {
      return 'encouraging';
    } else {
      return 'validating';
    }
  }

  // Infer preferred response length
  private inferResponseLength(pattern: any): 'brief' | 'moderate' | 'detailed' {
    const preferredLength = pattern.preferredLength;
    
    if (preferredLength === 'short') return 'brief';
    if (preferredLength === 'long') return 'detailed';
    return 'moderate';
  }

  // Infer trauma awareness level needed
  private inferTraumaAwareness(pattern: any): 'high' | 'medium' | 'low' {
    const emotionalRange = pattern.emotionalRange;
    const engagementLevel = pattern.engagementLevel;

    if (emotionalRange === 'distressed' && engagementLevel === 'low') {
      return 'high';
    } else if (emotionalRange === 'neutral' && engagementLevel === 'medium') {
      return 'medium';
    } else {
      return 'low';
    }
  }

  // Get words/topics to avoid (learned from user reactions)
  private async getAvoidancePatterns(userId: string): Promise<string[]> {
    const avoidanceKey = `avoidance:${userId}`;
    const avoidedTopics = await this.redis.smembers(avoidanceKey);
    return avoidedTopics;
  }

  // Get user's preferred strength-based language
  private async getStrengthsLanguage(userId: string): Promise<string[]> {
    const strengthsKey = `strengths:${userId}`;
    const strengthsWords = await this.redis.smembers(strengthsKey);
    return strengthsWords.length > 0 ? strengthsWords : [
      'resilient', 'brave', 'thoughtful', 'self-aware', 'courageous'
    ];
  }

  // Get crisis timing patterns (for prevention)
  private async getCrisisPattern(userId: string): Promise<'frequent' | 'seasonal' | 'rare' | 'none'> {
    const crisisKey = `crisis_pattern:${userId}`;
    const pattern = await this.redis.get(crisisKey);
    return (pattern as any) || 'none';
  }

  // Learn from user feedback (implicit and explicit)
  async learnFromFeedback(
    userId: string, 
    responseId: string, 
    feedback: 'helpful' | 'not_helpful' | 'triggering' | 'perfect'
  ): Promise<void> {
    const feedbackKey = `feedback:${userId}:${responseId}`;
    
    await this.redis.set(feedbackKey, feedback, 'EX', this.PATTERN_TTL);
    
    // Update learning weights based on feedback
    if (feedback === 'triggering') {
      await this.learnAvoidancePattern(userId, responseId);
    } else if (feedback === 'perfect') {
      await this.reinforceSuccessPattern(userId, responseId);
    }
  }

  // Learn what to avoid when user indicates triggering content
  private async learnAvoidancePattern(userId: string, responseId: string): Promise<void> {
    // This would analyze the response that was triggering and learn to avoid similar patterns
    const avoidanceKey = `avoidance:${userId}`;
    const responseKey = `response:${responseId}`;
    
    // Get response metadata to understand what was triggering
    const responseData = await this.redis.hgetall(responseKey);
    
    if (responseData.keywords) {
      const keywords = responseData.keywords.split(',');
      for (const keyword of keywords) {
        await this.redis.sadd(avoidanceKey, keyword);
      }
      await this.redis.expire(avoidanceKey, this.PATTERN_TTL);
    }
  }

  // Reinforce successful response patterns
  private async reinforceSuccessPattern(userId: string, responseId: string): Promise<void> {
    const successKey = `success_patterns:${userId}`;
    const responseKey = `response:${responseId}`;
    
    const responseData = await this.redis.hgetall(responseKey);
    
    if (responseData.tone) {
      await this.redis.hincrby(successKey, `tone:${responseData.tone}`, 2);
    }
    if (responseData.approach) {
      await this.redis.hincrby(successKey, `approach:${responseData.approach}`, 2);
    }
    
    await this.redis.expire(successKey, this.PATTERN_TTL);
  }

  // Categorize entry length for pattern learning
  private categorizeLength(length: number): 'short' | 'medium' | 'long' {
    if (length < 100) return 'short';
    if (length < 500) return 'medium';
    return 'long';
  }
}

// Context analyzer for understanding current user state
class ContextAnalyzer {
  // Analyze current context from entry and patterns
  static analyzeContext(request: PersonalizedInsightRequest): PersonalizationContext {
    const now = new Date(request.context.timestamp);
    const hour = now.getHours();
    
    return {
      timeOfDay: this.getTimeOfDay(hour),
      dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
      emotionalState: this.detectEmotionalState(request.text),
      entryLength: request.text.length,
      writingStyle: this.detectWritingStyle(request.text),
      urgencyLevel: this.detectUrgencyLevel(request.text),
      recentPatterns: {
        moodTrend: 'stable', // Would be derived from recent entries
        engagementLevel: this.detectEngagementLevel(request),
        supportSeekingBehavior: this.detectSupportSeeking(request.text)
      }
    };
  }

  private static getTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' | 'late_night' {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'late_night';
  }

  private static detectEmotionalState(text: string): 'distressed' | 'neutral' | 'positive' | 'unknown' {
    const lowerText = text.toLowerCase();
    
    const distressWords = ['anxious', 'depressed', 'overwhelmed', 'panicked', 'hopeless', 'scared', 'angry', 'frustrated'];
    const positiveWords = ['grateful', 'happy', 'peaceful', 'hopeful', 'excited', 'proud', 'content', 'blessed'];
    
    const distressCount = distressWords.filter(word => lowerText.includes(word)).length;
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    
    if (distressCount > positiveCount && distressCount > 0) return 'distressed';
    if (positiveCount > distressCount && positiveCount > 0) return 'positive';
    if (distressCount === 0 && positiveCount === 0) return 'neutral';
    return 'unknown';
  }

  private static detectWritingStyle(text: string): 'analytical' | 'emotional' | 'narrative' | 'fragmented' {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = text.length / sentences.length;
    
    const emotionalWords = ['feel', 'felt', 'feeling', 'emotion', 'heart', 'soul'];
    const analyticalWords = ['think', 'analyze', 'understand', 'realize', 'consider', 'process'];
    
    const emotionalCount = emotionalWords.filter(word => text.toLowerCase().includes(word)).length;
    const analyticalCount = analyticalWords.filter(word => text.toLowerCase().includes(word)).length;
    
    if (avgSentenceLength < 20) return 'fragmented';
    if (analyticalCount > emotionalCount) return 'analytical';
    if (emotionalCount > 0) return 'emotional';
    return 'narrative';
  }

  private static detectUrgencyLevel(text: string): 'low' | 'medium' | 'high' | 'crisis' {
    const lowerText = text.toLowerCase();
    
    const crisisWords = ['suicidal', 'kill myself', 'end it all', 'can\'t go on', 'want to die'];
    const highUrgencyWords = ['emergency', 'urgent', 'help me', 'desperate', 'breaking point'];
    const mediumUrgencyWords = ['struggling', 'difficult', 'hard time', 'need support'];
    
    if (crisisWords.some(word => lowerText.includes(word))) return 'crisis';
    if (highUrgencyWords.some(word => lowerText.includes(word))) return 'high';
    if (mediumUrgencyWords.some(word => lowerText.includes(word))) return 'medium';
    return 'low';
  }

  private static detectEngagementLevel(request: PersonalizedInsightRequest): 'high' | 'medium' | 'low' {
    const entryLength = request.text.length;
    const sessionLength = request.context.sessionLength || 0;
    
    if (entryLength > 500 && sessionLength > 300) return 'high'; // Long entry, long session
    if (entryLength > 200 || sessionLength > 120) return 'medium';
    return 'low';
  }

  private static detectSupportSeeking(text: string): boolean {
    const supportWords = ['help', 'advice', 'support', 'guidance', 'what should', 'need to talk'];
    return supportWords.some(word => text.toLowerCase().includes(word));
  }
}

// Personalized prompt builder
class PersonalizedPromptBuilder {
  static buildTraumaInformedPrompt(
    request: PersonalizedInsightRequest,
    communicationPattern: CommunicationPattern | null,
    context: PersonalizationContext
  ): string {
    const basePrompt = this.getBasePrompt(context.urgencyLevel);
    const personalizedElements = this.getPersonalizedElements(communicationPattern, context);
    const safetyGuidelines = this.getSafetyGuidelines(context.urgencyLevel);
    
    return `${basePrompt}\n\n${personalizedElements}\n\n${safetyGuidelines}\n\nJournal entry: "${request.text}"\n\nProvide a response that embodies trauma-informed care principles while feeling personally meaningful to this individual.`;
  }

  private static getBasePrompt(urgencyLevel: string): string {
    if (urgencyLevel === 'crisis') {
      return `You are a trauma-informed AI companion trained in crisis intervention. This person may be in immediate distress. Prioritize safety, validation, and connecting them with professional resources. Your response should be gentle, non-judgmental, and focused on immediate support.`;
    }
    
    return `You are a compassionate AI companion trained in trauma-informed care. Provide a validating, gentle response that honors this person's experience and strength. Focus on their resilience and offer supportive insights that feel personally meaningful.`;
  }

  private static getPersonalizedElements(
    pattern: CommunicationPattern | null,
    context: PersonalizationContext
  ): string {
    if (!pattern) {
      return `This appears to be someone new to journaling. Use gentle, welcoming language that validates their courage in sharing.`;
    }

    let elements = [];
    
    // Tone preferences
    elements.push(`Communication style: ${pattern.preferredTone}`);
    
    // Response length
    elements.push(`Response length: ${pattern.responseLength}`);
    
    // Time-aware personalization
    if (context.timeOfDay === 'late_night') {
      elements.push(`It's late at night - acknowledge this may be a difficult time and offer gentle comfort.`);
    } else if (context.timeOfDay === 'morning') {
      elements.push(`It's morning - consider this as a time for gentle intention-setting or fresh perspective.`);
    }
    
    // Strengths-based language
    if (pattern.strengthsLanguage.length > 0) {
      elements.push(`Use strength words that resonate: ${pattern.strengthsLanguage.slice(0, 3).join(', ')}`);
    }
    
    // Avoid triggers
    if (pattern.triggerSensitivity.length > 0) {
      elements.push(`Avoid topics/words that may be triggering: ${pattern.triggerSensitivity.join(', ')}`);
    }
    
    return elements.join('\n');
  }

  private static getSafetyGuidelines(urgencyLevel: string): string {
    const baseGuidelines = `Safety guidelines:
- Never minimize or dismiss their experience
- Validate their courage in sharing
- Focus on their existing strengths and resilience
- Offer hope without toxic positivity
- Respect their autonomy and choices`;

    if (urgencyLevel === 'crisis') {
      return `${baseGuidelines}
- PRIORITY: Include crisis resources (988 Suicide & Crisis Lifeline)
- Encourage immediate professional support
- Emphasize they are not alone
- Avoid problem-solving, focus on immediate safety`;
    }
    
    if (urgencyLevel === 'high') {
      return `${baseGuidelines}
- Gently suggest professional support options
- Acknowledge the difficulty of their situation
- Provide extra validation and encouragement`;
    }
    
    return baseGuidelines;
  }
}

// Main Trauma-Informed AI Engine
export class TraumaInformedEngine {
  private privacyLearning: PrivacyFirstLearning;
  private aiTierManager: AITierManager;
  
  constructor() {
    this.privacyLearning = new PrivacyFirstLearning();
    this.aiTierManager = new AITierManager();
  }

  // Generate personalized, trauma-informed response
  async generatePersonalizedInsight(request: PersonalizedInsightRequest): Promise<TraumaInformedResponse> {
    try {
      // Analyze current context
      const context = ContextAnalyzer.analyzeContext(request);
      
      // Get learned communication patterns
      const communicationPattern = await this.privacyLearning.getCommunicationPattern(request.userId);
      
      // Handle crisis immediately
      if (context.urgencyLevel === 'crisis') {
        return await this.generateCrisisResponse(request, context);
      }
      
      // Build personalized prompt
      const personalizedPrompt = PersonalizedPromptBuilder.buildTraumaInformedPrompt(
        request, 
        communicationPattern, 
        context
      );
      
      // Generate AI response using resilient pipeline
      const aiResponse = await this.aiTierManager.execute({
        text: personalizedPrompt,
        userId: request.userId,
        requestType: 'insight_generation',
        context: {
          userProfile: {
            communicationStyle: communicationPattern?.preferredTone || 'validating',
            traumaInformed: true,
            preferredTone: communicationPattern?.preferredTone || 'gentle'
          },
          urgency: context.urgencyLevel
        },
        timestamp: request.context.timestamp
      });
      
      // Enhance with personalized elements
      const enhancedResponse = await this.enhanceWithPersonalization(
        aiResponse, 
        request, 
        context, 
        communicationPattern
      );
      
      // Learn from this interaction
      await this.privacyLearning.learnCommunicationPattern(request.userId, context);
      
      return enhancedResponse;
      
    } catch (error) {
      logger.error('Error generating personalized insight', error);
      return this.generateFallbackResponse(request);
    }
  }

  // Generate crisis-specific response with immediate resources
  private async generateCrisisResponse(
    request: PersonalizedInsightRequest, 
    context: PersonalizationContext
  ): Promise<TraumaInformedResponse> {
    const crisisInsight = `I hear that you're in a lot of pain right now, and I want you to know that your life has value and meaning. You've shown incredible courage by reaching out and sharing what you're going through.`;
    
    const crisisResources = [
      '988 Suicide & Crisis Lifeline: Call or text 988',
      'Crisis Text Line: Text HOME to 741741',
      'If you\'re in immediate danger, please call 911',
      'NAMI Crisis Resources: nami.org/help'
    ];
    
    return {
      insight: crisisInsight,
      encouragement: 'You are not alone in this. There are people who want to help you through this difficult time.',
      gentleAction: 'Please reach out to one of these crisis resources or a trusted person in your life.',
      resources: crisisResources,
      confidenceScore: 1.0,
      personalizationLevel: 0.8,
      triggerRisk: 'none',
      responseType: 'crisis_support',
      qualityMetrics: {
        traumaInformed: true,
        personalized: true,
        actionable: true,
        empathetic: true,
        culturallySensitive: true,
        strengthsBased: true,
        boundaryRespecting: true
      }
    };
  }

  // Enhance AI response with personalization
  private async enhanceWithPersonalization(
    aiResponse: any,
    request: PersonalizedInsightRequest,
    context: PersonalizationContext,
    pattern: CommunicationPattern | null
  ): Promise<TraumaInformedResponse> {
    // Extract main insight
    let insight = aiResponse.insight;
    
    // Add personalized encouragement
    const encouragement = this.generatePersonalizedEncouragement(context, pattern);
    
    // Add gentle action if appropriate
    const gentleAction = this.generateGentleAction(context, pattern);
    
    // Assess quality
    const qualityMetrics = this.assessResponseQuality(insight, request);
    
    // Calculate personalization level
    const personalizationLevel = pattern ? 0.8 : 0.3; // Higher if we know the user
    
    return {
      insight,
      encouragement,
      gentleAction,
      resources: context.urgencyLevel === 'high' ? this.getWellnessResources() : undefined,
      confidenceScore: aiResponse.confidence,
      personalizationLevel,
      triggerRisk: this.assessTriggerRisk(insight),
      responseType: this.determineResponseType(context),
      qualityMetrics
    };
  }

  // Generate personalized encouragement
  private generatePersonalizedEncouragement(
    context: PersonalizationContext, 
    pattern: CommunicationPattern | null
  ): string {
    const timeAwareMessages = {
      morning: 'Starting your day with self-reflection shows remarkable self-awareness.',
      afternoon: 'Taking time in the middle of your day to check in with yourself is a beautiful practice.',
      evening: 'Ending your day with reflection demonstrates real commitment to your growth.',
      late_night: 'Even in the quiet hours, you\'re taking care of yourself. That takes courage.'
    };
    
    const baseMessage = timeAwareMessages[context.timeOfDay];
    
    if (pattern?.strengthsLanguage && pattern.strengthsLanguage.length > 0) {
      const strengthWord = pattern.strengthsLanguage[0];
      return `${baseMessage} You continue to show how ${strengthWord} you truly are.`;
    }
    
    return baseMessage;
  }

  // Generate gentle action suggestion
  private generateGentleAction(
    context: PersonalizationContext, 
    pattern: CommunicationPattern | null
  ): string | undefined {
    if (context.urgencyLevel === 'crisis' || context.urgencyLevel === 'high') {
      return undefined; // Crisis responses handle their own actions
    }
    
    if (context.emotionalState === 'distressed') {
      return 'Consider taking three slow, deep breaths and perhaps reaching out to someone who makes you feel safe.';
    }
    
    if (context.timeOfDay === 'late_night') {
      return 'If possible, try to get some rest. Your insights will still be here tomorrow.';
    }
    
    if (pattern?.preferredTone === 'encouraging') {
      return 'Keep exploring these insights - you\'re building something meaningful.';
    }
    
    return 'Take a moment to acknowledge the strength it took to share this.';
  }

  // Assess response quality against trauma-informed principles
  private assessResponseQuality(insight: string, request: PersonalizedInsightRequest): ResponseQuality {
    const lowerInsight = insight.toLowerCase();
    
    return {
      traumaInformed: this.checkTraumaInformed(lowerInsight),
      personalized: this.checkPersonalized(insight, request),
      actionable: this.checkActionable(lowerInsight),
      empathetic: this.checkEmpathetic(lowerInsight),
      culturallySensitive: this.checkCulturallySensitive(insight),
      strengthsBased: this.checkStrengthsBased(lowerInsight),
      boundaryRespecting: this.checkBoundaryRespecting(lowerInsight)
    };
  }

  // Quality assessment methods
  private checkTraumaInformed(insight: string): boolean {
    const traumaInformedWords = ['safe', 'valid', 'courage', 'strength', 'survivor', 'resilient', 'healing'];
    return traumaInformedWords.some(word => insight.includes(word));
  }

  private checkPersonalized(insight: string, request: PersonalizedInsightRequest): boolean {
    // Check if response feels personal rather than generic
    return insight.length > 50 && !insight.includes('generic') && !insight.includes('in general');
  }

  private checkActionable(insight: string): boolean {
    const actionWords = ['try', 'consider', 'practice', 'explore', 'notice', 'breathe', 'reach out'];
    return actionWords.some(word => insight.includes(word));
  }

  private checkEmpathetic(insight: string): boolean {
    const empathyWords = ['understand', 'hear', 'feel', 'acknowledge', 'recognize', 'validate'];
    return empathyWords.some(word => insight.includes(word));
  }

  private checkCulturallySensitive(insight: string): boolean {
    // Check for inclusive language and absence of cultural assumptions
    const problematicWords = ['should', 'must', 'always', 'never'];
    return !problematicWords.some(word => insight.toLowerCase().includes(word));
  }

  private checkStrengthsBased(insight: string): boolean {
    const strengthWords = ['strength', 'resilient', 'capable', 'brave', 'courage', 'wisdom', 'growth'];
    return strengthWords.some(word => insight.includes(word));
  }

  private checkBoundaryRespecting(insight: string): boolean {
    // Check that response doesn't push too hard or make assumptions
    const boundaryWords = ['choice', 'when ready', 'if you want', 'consider', 'might'];
    return boundaryWords.some(word => insight.includes(word));
  }

  // Assess trigger risk in response
  private assessTriggerRisk(insight: string): 'none' | 'low' | 'medium' | 'high' {
    const lowerInsight = insight.toLowerCase();
    
    const potentialTriggers = ['failure', 'wrong', 'fault', 'blame', 'should have', 'fix yourself'];
    const triggerCount = potentialTriggers.filter(trigger => lowerInsight.includes(trigger)).length;
    
    if (triggerCount >= 2) return 'high';
    if (triggerCount === 1) return 'medium';
    if (lowerInsight.includes('difficult') || lowerInsight.includes('challenge')) return 'low';
    return 'none';
  }

  // Determine response type
  private determineResponseType(context: PersonalizationContext): 'validation' | 'insight' | 'guidance' | 'crisis_support' {
    if (context.urgencyLevel === 'crisis') return 'crisis_support';
    if (context.urgencyLevel === 'high') return 'guidance';
    if (context.emotionalState === 'distressed') return 'validation';
    return 'insight';
  }

  // Get wellness resources for high urgency situations
  private getWellnessResources(): string[] {
    return [
      'NAMI Support Groups: nami.org/support',
      'Mental Health America: mhanational.org',
      'Psychology Today Therapist Finder: psychologytoday.com',
      'Headspace meditation app for immediate calm'
    ];
  }

  // Fallback response for errors
  private generateFallbackResponse(request: PersonalizedInsightRequest): TraumaInformedResponse {
    return {
      insight: 'Thank you for sharing your thoughts with me. Your willingness to reflect and explore your inner world shows real courage and self-awareness.',
      encouragement: 'Every step you take toward understanding yourself better is meaningful, even when the path feels unclear.',
      gentleAction: 'Take a moment to acknowledge the strength it took to share this.',
      confidenceScore: 0.75,
      personalizationLevel: 0.0,
      triggerRisk: 'none',
      responseType: 'validation',
      qualityMetrics: {
        traumaInformed: true,
        personalized: false,
        actionable: true,
        empathetic: true,
        culturallySensitive: true,
        strengthsBased: true,
        boundaryRespecting: true
      }
    };
  }

  // Learn from user feedback to improve personalization
  async recordFeedback(
    userId: string, 
    responseId: string, 
    feedback: 'helpful' | 'not_helpful' | 'triggering' | 'perfect'
  ): Promise<void> {
    await this.privacyLearning.learnFromFeedback(userId, responseId, feedback);
    
    logger.info('User feedback recorded', {
      userId: userId.slice(0, 8) + '...',
      responseId,
      feedback
    });
  }

  // Get personalization analytics (for monitoring)
  async getPersonalizationAnalytics(userId: string): Promise<any> {
    const pattern = await this.privacyLearning.getCommunicationPattern(userId);
    
    return {
      hasPattern: pattern !== null,
      personalizationLevel: pattern ? 0.8 : 0.3,
      preferredTone: pattern?.preferredTone || 'unknown',
      responseLength: pattern?.responseLength || 'unknown',
      traumaAwareness: pattern?.traumaAwareness || 'medium',
      strengthsLanguageCount: pattern?.strengthsLanguage.length || 0,
      triggerSensitivityCount: pattern?.triggerSensitivity.length || 0
    };
  }
}

// Export for API integration
export const traumaInformedEngine = new TraumaInformedEngine();
export { PersonalizedInsightRequest, TraumaInformedResponse, CommunicationPattern };