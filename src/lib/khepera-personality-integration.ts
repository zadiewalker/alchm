/**
 * ✨ Khepera Personality Integration Service
 * 
 * Bridges the new core personality system with existing ALCHM infrastructure
 * Provides seamless integration with current API while adding sophisticated
 * adaptive personality features that make emotional wellness as engaging
 * as language learning apps.
 * 
 * Integration Philosophy:
 * - Maintain all existing safety and compliance features
 * - Enhance user experience with adaptive responses
 * - Preserve trauma-informed communication principles
 * - Add Duolingo-like engagement without gamifying emotions
 */

import { 
  KheperaCorePersonality, 
  type UserState, 
  type AppPage, 
  type InteractionContext,
  type EmotionalVocabularyLevel,
  type ArchetypeVoice 
} from './khepera-core-personality';
import { EmotionalContext, WritingPatterns, detectEmotionalContext, analyzeWritingPatterns } from './emotional-intelligence';
import { KheperaTieredGuidance, type UserTier, type KheperaResponse as TieredResponse } from './khepera-tiered-guidance';
import { detectCrisisEnhanced } from './enhanced-crisis-detection';

// ===============================
// INTEGRATION TYPES
// ===============================

export interface EnhancedKheperaRequest {
  // Core content
  text: string;
  
  // User context
  userTier: UserTier;
  sessionCount: number;
  currentStreak: number;
  daysSinceLastVisit: number;
  
  // App context
  currentPage: AppPage;
  interactionContext: InteractionContext;
  completedFeatures: string[];
  
  // Writing patterns
  timeSpent?: number;
  editCount?: number;
  pauseDuration?: number;
  
  // Historical data for vocabulary assessment
  recentTexts?: string[];
  interactionHistory?: any[];
  
  // Cultural context
  culturalIdentity?: string[];
  preferredLanguage?: string;
  
  // Time context
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  
  // User preferences
  preferredArchetype?: ArchetypeVoice;
  
  // Legacy support
  emotionalContext?: EmotionalContext;
  writingPatterns?: WritingPatterns;
  userHistory?: any;
  previousSessions?: number;
  recentEmotionalState?: string;
}

export interface EnhancedKheperaResponse extends TieredResponse {
  // Enhanced personality features
  personalityArchetype: {
    current: ArchetypeVoice;
    reasoning: string;
    adaptedComplexity: EmotionalVocabularyLevel;
  };
  
  // Context awareness
  contextualAdaptation: {
    pageSpecific: boolean;
    interactionContext: InteractionContext;
    featureIntroduction?: {
      suggested: boolean;
      featureName?: string;
      timing: 'appropriate' | 'too_early' | 'completed';
    };
  };
  
  // Engagement features
  engagementElements: {
    vocabularyGrowth?: {
      suggestedWords: string[];
      currentLevel: EmotionalVocabularyLevel;
      nextLevelHint?: string;
    };
    progressCelebration?: {
      milestone: string;
      achievement: string;
    };
    personalizedPrompt?: string;
  };
  
  // Legacy compatibility
  legacySupport: {
    compatibleWithExistingAPI: boolean;
    tieredGuidanceResponse: TieredResponse;
  };
}

// ===============================
// MAIN INTEGRATION SERVICE
// ===============================

export class KheperaPersonalityIntegration {
  /**
   * Main integration method that enhances existing Khepera API with adaptive personality
   */
  static async enhanceKheperaResponse(request: EnhancedKheperaRequest): Promise<EnhancedKheperaResponse> {
    // 1. Build comprehensive user state
    const userState = this.buildUserState(request);
    
    // 2. Assess emotional vocabulary level
    const vocabularyLevel = this.assessVocabularyLevel(request);
    userState.emotionalVocabularyLevel = vocabularyLevel;
    
    // 3. Detect emotional context (enhanced or provided)
    const emotionalContext = request.emotionalContext || 
      detectEmotionalContext(request.text, undefined, {
        culturalIdentity: request.culturalIdentity,
        previousSessions: request.previousSessions,
        recentEmotionalState: request.recentEmotionalState
      });
    
    // 4. Analyze writing patterns
    const writingPatterns = request.writingPatterns || 
      analyzeWritingPatterns(
        request.text,
        request.timeSpent || 0,
        request.editCount || 0,
        request.pauseDuration || 0
      );
    
    // 5. Generate enhanced personality response
    const personalityResponse = KheperaCorePersonality.generateResponse(
      userState,
      emotionalContext,
      request.text,
      writingPatterns
    );
    
    // 6. Generate legacy tiered guidance response for compatibility
    const tieredGuidance = new KheperaTieredGuidance(request.userTier);
    const legacyResponse = tieredGuidance.generateResponse(
      emotionalContext,
      writingPatterns,
      request.userHistory,
      request.text
    );
    
    // 7. Merge responses with enhanced features
    return this.mergeResponses(
      personalityResponse,
      legacyResponse,
      userState,
      emotionalContext,
      vocabularyLevel
    );
  }
  
  /**
   * Builds comprehensive user state from request data
   */
  private static buildUserState(request: EnhancedKheperaRequest): UserState {
    return {
      emotionalVocabularyLevel: 'explorer', // Will be assessed
      currentPage: request.currentPage,
      interactionContext: request.interactionContext,
      sessionCount: request.sessionCount,
      daysSinceLastVisit: request.daysSinceLastVisit,
      currentStreak: request.currentStreak,
      completedFeatures: request.completedFeatures,
      recentEmotions: this.extractRecentEmotions(request.recentTexts || []),
      timeOfDay: request.timeOfDay || this.detectTimeOfDay(),
      culturalContext: request.culturalIdentity,
      preferredArchetype: request.preferredArchetype
    };
  }
  
  /**
   * Assesses user's emotional vocabulary level for adaptive complexity
   */
  private static assessVocabularyLevel(request: EnhancedKheperaRequest): EmotionalVocabularyLevel {
    const recentTexts = request.recentTexts || [request.text];
    const interactionHistory = request.interactionHistory || [{
      timeSpent: request.timeSpent || 0,
      editCount: request.editCount || 0,
      wordCount: request.text.split(/\s+/).length
    }];
    
    return KheperaCorePersonality.assessEmotionalVocabulary(recentTexts, interactionHistory);
  }
  
  /**
   * Merges personality response with legacy response for comprehensive output
   */
  private static mergeResponses(
    personalityResponse: import('./khepera-core-personality').KheperaResponse,
    legacyResponse: TieredResponse,
    userState: UserState,
    emotionalContext: EmotionalContext,
    vocabularyLevel: EmotionalVocabularyLevel
  ): EnhancedKheperaResponse {
    // Use personality response as primary, with legacy as fallback
    const primaryInsight = personalityResponse.text || legacyResponse.insight;
    const primaryEncouragement = personalityResponse.validationMessage || 
                                personalityResponse.actionableInsight || 
                                legacyResponse.encouragement;
    
    return {
      // Core response (maintaining API compatibility)
      insight: primaryInsight,
      encouragement: primaryEncouragement,
      followUpQuestion: personalityResponse.followUpPrompt || legacyResponse.followUpQuestion,
      resourceSuggestion: personalityResponse.resourceSuggestion || legacyResponse.resourceSuggestion,
      progressInsight: legacyResponse.progressInsight, // Keep tier-specific insights
      archetype: personalityResponse.archetype,
      upgradeContext: legacyResponse.upgradeContext,
      
      // Enhanced personality features
      personalityArchetype: {
        current: personalityResponse.archetype,
        reasoning: this.getArchetypeReasoning(personalityResponse.archetype, emotionalContext, userState),
        adaptedComplexity: vocabularyLevel
      },
      
      contextualAdaptation: {
        pageSpecific: this.isPageSpecificResponse(userState.currentPage, primaryInsight),
        interactionContext: userState.interactionContext,
        featureIntroduction: personalityResponse.includesFeatureIntroduction ? {
          suggested: true,
          featureName: this.detectFeatureName(primaryInsight),
          timing: 'appropriate'
        } : { suggested: false, timing: 'too_early' }
      },
      
      engagementElements: {
        vocabularyGrowth: this.generateVocabularyGrowth(vocabularyLevel, emotionalContext),
        progressCelebration: this.generateProgressCelebration(userState),
        personalizedPrompt: personalityResponse.followUpPrompt
      },
      
      legacySupport: {
        compatibleWithExistingAPI: true,
        tieredGuidanceResponse: legacyResponse
      }
    };
  }
  
  /**
   * Extracts recent emotional themes from user's writing history
   */
  private static extractRecentEmotions(recentTexts: string[]): string[] {
    const emotionKeywords = {
      vulnerability: ['scared', 'afraid', 'nervous', 'vulnerable'],
      strength: ['strong', 'proud', 'capable', 'resilient'],
      processing: ['thinking', 'wondering', 'processing', 'figuring'],
      pain: ['hurt', 'sad', 'broken', 'lost'],
      growth: ['learning', 'changing', 'growing', 'becoming'],
      connection: ['lonely', 'isolated', 'belong', 'connected'],
      hope: ['hope', 'future', 'better', 'possible']
    };
    
    const recentEmotions: string[] = [];
    const combinedText = recentTexts.join(' ').toLowerCase();
    
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      if (keywords.some(keyword => combinedText.includes(keyword))) {
        recentEmotions.push(emotion);
      }
    });
    
    return recentEmotions;
  }
  
  /**
   * Detects time of day for contextual responses
   */
  private static detectTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }
  
  /**
   * Provides reasoning for archetype selection
   */
  private static getArchetypeReasoning(
    archetype: ArchetypeVoice, 
    context: EmotionalContext, 
    userState: UserState
  ): string {
    const reasonings = {
      sage: `Selected for wisdom and grounding due to ${context.isCrisis ? 'crisis situation' : 
             context.needsSupport ? 'need for support' : 'user\'s reflective state'}`,
      coach: `Selected for empowerment and strength-building due to ${
             userState.interactionContext === 'celebration' ? 'celebration context' :
             context.primary === 'growth' ? 'growth themes' : 'user\'s progress momentum'}`,
      poet: `Selected for metaphorical expression due to ${
             userState.emotionalVocabularyLevel === 'articulator' ? 'advanced emotional vocabulary' :
             context.primary === 'processing' ? 'complex emotional processing' : 'creative expression needs'}`
    };
    
    return reasonings[archetype];
  }
  
  /**
   * Determines if response is page-specific
   */
  private static isPageSpecificResponse(page: AppPage, response: string): boolean {
    const pageKeywords = {
      dashboard: ['welcome', 'sanctuary', 'journey begins'],
      journal: ['courage', 'writing', 'words', 'expression'],
      pricing: ['invest', 'growth', 'potential', 'commitment'],
      analytics: ['patterns', 'progress', 'insights', 'data'],
      onboarding: ['welcome', 'beginning', 'first time', 'start']
    };
    
    const keywords = pageKeywords[page] || [];
    return keywords.some(keyword => response.toLowerCase().includes(keyword));
  }
  
  /**
   * Detects feature name from introduction message
   */
  private static detectFeatureName(response: string): string | undefined {
    const featureKeywords = {
      'emotional_analytics': ['patterns', 'analytics', 'insights'],
      'streak_celebrations': ['streak', 'days', 'consistency'],
      'community_connection': ['community', 'others', 'connection']
    };
    
    for (const [feature, keywords] of Object.entries(featureKeywords)) {
      if (keywords.some(keyword => response.toLowerCase().includes(keyword))) {
        return feature;
      }
    }
    return undefined;
  }
  
  /**
   * Generates vocabulary growth suggestions
   */
  private static generateVocabularyGrowth(
    level: EmotionalVocabularyLevel,
    context: EmotionalContext
  ): { suggestedWords: string[]; currentLevel: EmotionalVocabularyLevel; nextLevelHint?: string } {
    const nextLevel = {
      explorer: 'learner',
      learner: 'articulator',
      articulator: 'articulator' // Already at highest
    }[level];
    
    const suggestedWords = KheperaCorePersonality.getVocabularySuggestions(
      level,
      context.primary
    );
    
    const nextLevelHints = {
      explorer: "As you continue journaling, you might notice more nuanced words for your feelings emerging naturally.",
      learner: "Your emotional vocabulary is expanding beautifully. Soon you might find yourself expressing complex emotional landscapes.",
      articulator: "Your sophisticated emotional expression creates space for profound healing and insight."
    };
    
    return {
      suggestedWords,
      currentLevel: level,
      nextLevelHint: nextLevel !== level ? nextLevelHints[level] : undefined
    };
  }
  
  /**
   * Generates progress celebration if appropriate
   */
  private static generateProgressCelebration(userState: UserState): { milestone: string; achievement: string } | undefined {
    if (userState.interactionContext === 'streak_milestone') {
      return {
        milestone: `${userState.currentStreak}-day streak`,
        achievement: 'Consistent self-reflection practice'
      };
    }
    
    if (userState.sessionCount === 1) {
      return {
        milestone: 'First journal entry',
        achievement: 'Beginning your growth journey'
      };
    }
    
    if (userState.sessionCount % 10 === 0) {
      return {
        milestone: `${userState.sessionCount} total sessions`,
        achievement: 'Committed to emotional growth'
      };
    }
    
    return undefined;
  }
  
  /**
   * Creates a request object for easy integration with existing API
   */
  static createEnhancedRequest(
    basicRequest: {
      text: string;
      userTier: UserTier;
      sessionCount?: number;
      currentPage?: AppPage;
      timeSpent?: number;
      editCount?: number;
    },
    enhancedContext: {
      currentStreak?: number;
      daysSinceLastVisit?: number;
      interactionContext?: InteractionContext;
      completedFeatures?: string[];
      recentTexts?: string[];
      preferredArchetype?: ArchetypeVoice;
    } = {}
  ): EnhancedKheperaRequest {
    return {
      // Required core fields
      text: basicRequest.text,
      userTier: basicRequest.userTier,
      sessionCount: basicRequest.sessionCount || 1,
      currentStreak: enhancedContext.currentStreak || 1,
      daysSinceLastVisit: enhancedContext.daysSinceLastVisit || 0,
      
      // App context with sensible defaults
      currentPage: basicRequest.currentPage || 'journal',
      interactionContext: enhancedContext.interactionContext || 'returning',
      completedFeatures: enhancedContext.completedFeatures || [],
      
      // Writing patterns
      timeSpent: basicRequest.timeSpent,
      editCount: basicRequest.editCount,
      pauseDuration: 0,
      
      // Historical data
      recentTexts: enhancedContext.recentTexts || [basicRequest.text],
      interactionHistory: [{
        timeSpent: basicRequest.timeSpent || 0,
        editCount: basicRequest.editCount || 0,
        wordCount: basicRequest.text.split(/\s+/).length
      }],
      
      // User preferences
      preferredArchetype: enhancedContext.preferredArchetype,
      timeOfDay: this.detectTimeOfDay()
    };
  }
  
  /**
   * Provides example usage for different scenarios
   */
  static getUsageExamples(): Record<string, EnhancedKheperaRequest> {
    return {
      newUser: this.createEnhancedRequest(
        { text: "I'm not sure what to write but I want to try this.", userTier: 'sanctuary', currentPage: 'onboarding' },
        { interactionContext: 'first_visit', currentStreak: 1, daysSinceLastVisit: 0 }
      ),
      
      returningUser: this.createEnhancedRequest(
        { text: "Today was really hard. I felt overwhelmed by everything.", userTier: 'seeker', sessionCount: 15 },
        { currentStreak: 5, daysSinceLastVisit: 1, interactionContext: 'returning' }
      ),
      
      milestone: this.createEnhancedRequest(
        { text: "I can't believe I've been doing this for a week!", userTier: 'sanctuary', sessionCount: 7 },
        { currentStreak: 7, interactionContext: 'streak_milestone' }
      ),
      
      analytics: this.createEnhancedRequest(
        { text: "Looking at my patterns, I see I write most when I'm stressed.", userTier: 'healer', currentPage: 'analytics' },
        { sessionCount: 30, completedFeatures: ['emotional_analytics'] }
      )
    };
  }
}

export default KheperaPersonalityIntegration;