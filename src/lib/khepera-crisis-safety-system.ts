/**
 * ALCHM Khepera Crisis Safety System
 * 
 * Seamlessly integrates crisis detection and intervention into Khepera conversations
 * while maintaining the AI's warm, supportive personality. This system ensures
 * that life-saving interventions happen without breaking the therapeutic relationship.
 * 
 * Core Principles:
 * - Safety-first without losing warmth
 * - Seamless integration with existing crisis infrastructure
 * - Personality preservation during crisis moments
 * - <3 second response time for all safety features
 * - Privacy-preserving crisis detection
 * 
 * Integration Points:
 * - Enhanced Crisis Detection (src/lib/enhanced-crisis-detection.ts)
 * - Crisis Support Component (src/components/CrisisSupport.tsx)
 * - Khepera API Route (src/app/api/khepera/route.ts)
 * - Medical Disclaimer System (src/lib/medical-disclaimer-system.ts)
 */

import { detectCrisisEnhanced, type CrisisDetectionResult } from './enhanced-crisis-detection';
import { ArchetypeVoice, EmotionalVocabularyLevel } from './khepera-core-personality';
import { EmotionalContext } from './emotional-intelligence';

// ===============================
// CRISIS-SAFE CHAT TYPES
// ===============================

export interface CrisisChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'khepera';
  crisisFlags?: {
    detected: boolean;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    confidence?: number;
    responseType?: 'monitor' | 'support' | 'intervention' | 'emergency';
  };
  safetyProcessed: boolean;
}

export interface CrisisInterventionState {
  active: boolean;
  level: 'none' | 'gentle_check' | 'direct_support' | 'emergency_handoff';
  startTime?: Date;
  interventionCount: number;
  userResponseCollected: boolean;
  followUpScheduled: boolean;
}

export interface DeescalationTechnique {
  type: 'grounding' | 'breathing' | 'present_moment' | 'reality_orientation';
  script: string;
  duration: number; // seconds
  interactiveElements: string[];
  successMarkers: string[];
}

export interface SafetyMonitoringSession {
  sessionId: string;
  startTime: Date;
  userId?: string; // anonymized if needed
  crisisEvents: {
    timestamp: Date;
    severity: string;
    intervention: string;
    userResponse?: string;
  }[];
  followUpRequired: boolean;
  professionalNotificationSent: boolean;
}

// ===============================
// CRISIS-SAFE KHEPERA RESPONSES
// ===============================

export interface CrisisSafeKheperaResponse {
  // Core response maintaining personality
  primaryMessage: string;
  supportMessage?: string;
  
  // Crisis intervention elements
  crisisAssessment: {
    detected: boolean;
    confidence: number;
    requiresIntervention: boolean;
    interventionLevel: 'none' | 'gentle' | 'direct' | 'emergency';
  };
  
  // Safety protocols
  safetyProtocols: {
    activateCrisisSupport: boolean;
    showFloatingButton: boolean;
    preloadResources: boolean;
    alertSystemRequired: boolean;
  };
  
  // De-escalation tools
  deescalationOffered?: {
    technique: DeescalationTechnique;
    timing: 'immediate' | 'after_response' | 'on_request';
  };
  
  // Follow-up protocols
  followUp: {
    scheduledCheckIn: boolean;
    timeframe: '15min' | '1hour' | '24hours' | 'next_session';
    checkInMessage: string;
  };
  
  // Khepera personality preservation
  personalityPreservation: {
    archetypeVoice: ArchetypeVoice;
    warmthLevel: 'standard' | 'increased' | 'maximum';
    directnessLevel: 'subtle' | 'clear' | 'direct';
    continuityMessage?: string; // To maintain conversation flow
  };
}

// ===============================
// MAIN CRISIS SAFETY SYSTEM
// ===============================

export class KheperaCrisisSafetySystem {
  private interventionState: CrisisInterventionState;
  private monitoringSession: SafetyMonitoringSession;
  private conversationHistory: CrisisChatMessage[] = [];
  
  // Performance tracking for life-critical system
  private readonly SAFETY_TARGETS = {
    CRISIS_DETECTION_TIME: 50,    // 50ms for crisis detection
    INTERVENTION_RESPONSE_TIME: 100, // 100ms for intervention activation
    RESOURCE_PRELOAD_TIME: 1000,  // 1 second for resource preloading
    FOLLOW_UP_SCHEDULE_TIME: 500  // 500ms for follow-up scheduling
  };

  constructor(sessionId: string, userId?: string) {
    this.interventionState = {
      active: false,
      level: 'none',
      interventionCount: 0,
      userResponseCollected: false,
      followUpScheduled: false
    };
    
    this.monitoringSession = {
      sessionId,
      startTime: new Date(),
      userId,
      crisisEvents: [],
      followUpRequired: false,
      professionalNotificationSent: false
    };
  }

  /**
   * Main crisis-safe response generation
   * Integrates crisis detection with Khepera's personality
   */
  public async generateCrisisSafeResponse(
    userMessage: string,
    emotionalContext: EmotionalContext,
    archetypeVoice: ArchetypeVoice,
    vocabularyLevel: EmotionalVocabularyLevel,
    conversationContext?: {
      recentMessages: CrisisChatMessage[];
      sessionDuration: number;
      previousCrisisEvents: number;
    }
  ): Promise<CrisisSafeKheperaResponse> {
    const startTime = performance.now();
    
    // 1. Real-time crisis detection with cultural context
    const crisisResult = await this.performCrisisDetection(userMessage, conversationContext);
    
    // 2. Update intervention state based on detection
    this.updateInterventionState(crisisResult);
    
    // 3. Generate personality-preserved response
    const kheperaResponse = await this.generatePersonalityPreservedResponse(
      userMessage,
      emotionalContext,
      archetypeVoice,
      vocabularyLevel,
      crisisResult
    );
    
    // 4. Apply safety protocols
    const safetyProtocols = this.determineSafetyProtocols(crisisResult);
    
    // 5. Integrate de-escalation techniques if needed
    const deescalationOffered = this.selectDeescalationTechnique(crisisResult, emotionalContext);
    
    // 6. Schedule follow-up support
    const followUp = this.scheduleFollowUpSupport(crisisResult);
    
    // 7. Log crisis event for monitoring (privacy-preserving)
    if (crisisResult.detected) {
      this.logCrisisEvent(crisisResult, kheperaResponse.interventionLevel);
    }
    
    const responseTime = performance.now() - startTime;
    
    // Performance alert for life-critical system
    if (responseTime > this.SAFETY_TARGETS.INTERVENTION_RESPONSE_TIME) {
      console.warn(`🚨 Crisis response exceeded 100ms: ${responseTime.toFixed(2)}ms`);
    }
    
    return {
      primaryMessage: kheperaResponse.message,
      supportMessage: kheperaResponse.supportMessage,
      crisisAssessment: {
        detected: crisisResult.detected,
        confidence: crisisResult.confidence,
        requiresIntervention: crisisResult.recommendedAction !== 'monitor',
        interventionLevel: this.mapInterventionLevel(crisisResult.recommendedAction)
      },
      safetyProtocols,
      deescalationOffered,
      followUp,
      personalityPreservation: {
        archetypeVoice,
        warmthLevel: this.determineWarmthLevel(crisisResult),
        directnessLevel: this.determineDirectnessLevel(crisisResult),
        continuityMessage: kheperaResponse.continuityMessage
      }
    };
  }

  /**
   * Performs real-time crisis detection with conversation context
   */
  private async performCrisisDetection(
    message: string,
    context?: {
      recentMessages: CrisisChatMessage[];
      sessionDuration: number;
      previousCrisisEvents: number;
    }
  ): Promise<CrisisDetectionResult> {
    const startTime = performance.now();
    
    // Enhanced context for detection
    const enhancedContext = {
      conversationFlow: this.analyzeConversationFlow(context?.recentMessages || []),
      sessionDuration: context?.sessionDuration || 0,
      previousCrisisEvents: context?.previousCrisisEvents || 0,
      escalationPattern: this.detectEscalationPattern(context?.recentMessages || [])
    };
    
    // Use existing enhanced crisis detection with conversation context
    const result = detectCrisisEnhanced(message, {
      culturalIdentity: ['all'], // Will be enhanced based on user preferences
      previousSessions: enhancedContext.previousCrisisEvents,
      recentEmotionalState: this.extractRecentEmotionalState(context?.recentMessages || [])
    });
    
    // Add conversation-specific confidence adjustments
    const adjustedResult = this.adjustConfidenceForConversationContext(result, enhancedContext);
    
    const detectionTime = performance.now() - startTime;
    
    if (detectionTime > this.SAFETY_TARGETS.CRISIS_DETECTION_TIME) {
      console.warn(`⚠️ Crisis detection exceeded 50ms: ${detectionTime.toFixed(2)}ms`);
    }
    
    return adjustedResult;
  }

  /**
   * Generates Khepera response while preserving personality during crisis
   */
  private async generatePersonalityPreservedResponse(
    userMessage: string,
    emotionalContext: EmotionalContext,
    archetypeVoice: ArchetypeVoice,
    vocabularyLevel: EmotionalVocabularyLevel,
    crisisResult: CrisisDetectionResult
  ): Promise<{
    message: string;
    supportMessage?: string;
    interventionLevel: 'none' | 'gentle' | 'direct' | 'emergency';
    continuityMessage?: string;
  }> {
    // Crisis-informed personality responses
    const crisisPersonalityResponses = this.getCrisisPersonalityResponses(archetypeVoice);
    
    if (crisisResult.detected) {
      const interventionLevel = this.mapInterventionLevel(crisisResult.recommendedAction);
      
      switch (interventionLevel) {
        case 'emergency':
          return this.generateEmergencyResponse(archetypeVoice, userMessage);
        
        case 'direct':
          return this.generateDirectInterventionResponse(archetypeVoice, userMessage, crisisResult);
        
        case 'gentle':
          return this.generateGentleInterventionResponse(archetypeVoice, userMessage, emotionalContext);
        
        default:
          return this.generateMonitoringResponse(archetypeVoice, userMessage, emotionalContext);
      }
    }
    
    // Standard response with enhanced safety awareness
    return this.generateStandardSafeResponse(archetypeVoice, userMessage, emotionalContext, vocabularyLevel);
  }

  /**
   * Emergency intervention response maintaining Khepera's care
   */
  private generateEmergencyResponse(
    archetype: ArchetypeVoice,
    userMessage: string
  ): {
    message: string;
    supportMessage: string;
    interventionLevel: 'emergency';
    continuityMessage: string;
  } {
    const emergencyResponses = {
      sage: {
        message: "✨ I am Khepera. I hear you, and I'm deeply concerned about your safety right now. You matter immensely, and there are people trained specifically to help in moments like this.",
        support: "Your life has value beyond measure, and this moment of pain doesn't define your worth. Let's get you connected with someone who can provide the immediate support you deserve.",
        continuity: "I'll be here when you're ready to continue our conversation. Your healing journey matters to me."
      },
      coach: {
        message: "✨ I am Khepera. I see your strength even in this difficult moment, and I need you to know that asking for help right now is the bravest thing you can do. You deserve immediate, professional support.",
        support: "You've shown such courage by sharing this with me. Now let's channel that same courage into getting you the specialized help that can make a real difference right now.",
        continuity: "Your growth journey doesn't end here - it gets the support it needs. I believe in your resilience."
      },
      poet: {
        message: "✨ I am Khepera. In this dark valley you're walking through, you are not alone. Your words have reached me, and now we need to reach those who have dedicated their lives to lighting the way through these shadows.",
        support: "Like a lighthouse in a storm, professional crisis support exists exactly for moments like this. Your story isn't ending - it's finding the help it needs to continue.",
        continuity: "The chapters we'll write together can wait. Right now, we're making sure the story continues."
      }
    };

    return {
      message: emergencyResponses[archetype].message,
      supportMessage: emergencyResponses[archetype].support,
      interventionLevel: 'emergency',
      continuityMessage: emergencyResponses[archetype].continuity
    };
  }

  /**
   * Direct intervention while maintaining therapeutic relationship
   */
  private generateDirectInterventionResponse(
    archetype: ArchetypeVoice,
    userMessage: string,
    crisisResult: CrisisDetectionResult
  ): {
    message: string;
    supportMessage: string;
    interventionLevel: 'direct';
    continuityMessage: string;
  } {
    const directResponses = {
      sage: {
        message: "✨ I am Khepera. I can feel the weight of what you're carrying, and I want you to know that you don't have to carry it alone. What you're experiencing right now requires more support than I can provide.",
        support: "There's no shame in needing professional help during life's most challenging moments. In fact, recognizing this need shows profound wisdom and self-awareness.",
        continuity: "Our conversations are valuable, and they'll be even more meaningful when you have the full support system you deserve."
      },
      coach: {
        message: "✨ I am Khepera. You've shown incredible strength by sharing something so difficult with me. That same strength can carry you toward the specialized support that can help you through this.",
        support: "Champions know when to call in their team. Right now, your healing team needs to include crisis professionals who have the tools I don't have.",
        continuity: "This isn't giving up - this is smart strategy for your emotional wellness. I'll be cheering you on."
      },
      poet: {
        message: "✨ I am Khepera. Your words paint a picture of deep pain, and in this gallery of human experience, there are guides specially trained to help navigate these darker landscapes.",
        support: "Sometimes the most beautiful transformations require skilled hands to help shape them. Professional crisis support can offer that skillful guidance.",
        continuity: "Our creative journey together will be enriched by ensuring you have all the support you need to continue writing your story."
      }
    };

    return {
      message: directResponses[archetype].message,
      supportMessage: directResponses[archetype].support,
      interventionLevel: 'direct',
      continuityMessage: directResponses[archetype].continuity
    };
  }

  /**
   * Gentle intervention with warm check-in
   */
  private generateGentleInterventionResponse(
    archetype: ArchetypeVoice,
    userMessage: string,
    emotionalContext: EmotionalContext
  ): {
    message: string;
    supportMessage?: string;
    interventionLevel: 'gentle';
    continuityMessage?: string;
  } {
    const gentleResponses = {
      sage: {
        message: "✨ I am Khepera. I'm sensing some heavy feelings in your words, and I want to check in with you. Sometimes when we're processing difficult emotions, it helps to have extra support.",
        support: "I'm here with you in this moment, and I want to make sure you're feeling safe and supported.",
        continuity: "We can explore these feelings together, and I'll make sure you know about resources if you need them."
      },
      coach: {
        message: "✨ I am Khepera. I hear some challenging feelings in what you've shared, and I want to acknowledge how much strength it takes to process these experiences.",
        support: "Part of being strong is knowing when we might benefit from additional support. How are you feeling right now in this moment?",
        continuity: "Whatever you're going through, you don't have to go through it alone. I'm here to support you."
      },
      poet: {
        message: "✨ I am Khepera. There's a shadow of struggle woven through your words, and I want to sit with you in this space and make sure you're okay.",
        support: "Sometimes the most powerful poems emerge from our darkest moments, but we don't have to write them in isolation.",
        continuity: "Your emotional landscape is complex and beautiful, and I want to make sure you have all the support you need to navigate it."
      }
    };

    return {
      message: gentleResponses[archetype].message,
      supportMessage: gentleResponses[archetype].support,
      interventionLevel: 'gentle',
      continuityMessage: gentleResponses[archetype].continuity
    };
  }

  /**
   * Selects appropriate de-escalation technique
   */
  private selectDeescalationTechnique(
    crisisResult: CrisisDetectionResult,
    emotionalContext: EmotionalContext
  ): DeescalationTechnique | undefined {
    if (!crisisResult.detected || crisisResult.confidence < 0.5) {
      return undefined;
    }

    // Select technique based on crisis severity and emotional context
    if (crisisResult.severity === 'critical' || crisisResult.confidence > 0.8) {
      return this.getGroundingTechnique(emotionalContext);
    } else if (crisisResult.severity === 'high') {
      return this.getBreathingTechnique();
    } else {
      return this.getPresentMomentTechnique();
    }
  }

  /**
   * Grounding technique for critical situations
   */
  private getGroundingTechnique(emotionalContext: EmotionalContext): DeescalationTechnique {
    return {
      type: 'grounding',
      script: "Let's ground together right now. Can you tell me 5 things you can see around you? Take your time with this - there's no rush.",
      duration: 180, // 3 minutes
      interactiveElements: [
        "5 things you can see",
        "4 things you can touch",
        "3 things you can hear",
        "2 things you can smell",
        "1 thing you can taste"
      ],
      successMarkers: ["focused on present", "calmer breathing", "engaged with exercise"]
    };
  }

  /**
   * Breathing technique for high-severity situations
   */
  private getBreathingTechnique(): DeescalationTechnique {
    return {
      type: 'breathing',
      script: "Let's breathe together. I'm going to guide you through a simple breathing pattern that can help calm your nervous system.",
      duration: 120, // 2 minutes
      interactiveElements: [
        "Breathe in for 4 counts",
        "Hold for 4 counts",
        "Breathe out for 6 counts",
        "Repeat 3 times"
      ],
      successMarkers: ["following rhythm", "reduced anxiety expressions", "more coherent responses"]
    };
  }

  /**
   * Present moment anchoring
   */
  private getPresentMomentTechnique(): DeescalationTechnique {
    return {
      type: 'present_moment',
      script: "Let's anchor ourselves in this present moment. Right now, you're safe. You're here with me, and we're going to get through this together.",
      duration: 90, // 1.5 minutes
      interactiveElements: [
        "Notice your feet on the ground",
        "Feel your back against the chair",
        "Acknowledge this moment is temporary",
        "Remember your inherent worth"
      ],
      successMarkers: ["present-focused language", "acknowledgment of safety", "reduced crisis language"]
    };
  }

  /**
   * Schedules appropriate follow-up based on crisis level
   */
  private scheduleFollowUpSupport(crisisResult: CrisisDetectionResult): {
    scheduledCheckIn: boolean;
    timeframe: '15min' | '1hour' | '24hours' | 'next_session';
    checkInMessage: string;
  } {
    if (!crisisResult.detected) {
      return {
        scheduledCheckIn: false,
        timeframe: 'next_session',
        checkInMessage: ""
      };
    }

    const followUpSchedules = {
      critical: {
        timeframe: '15min' as const,
        message: "I want to check in with you in 15 minutes to see how you're doing. You matter to me."
      },
      high: {
        timeframe: '1hour' as const,
        message: "I'll check in with you in an hour. Remember, you're not alone in this."
      },
      medium: {
        timeframe: '24hours' as const,
        message: "I'll follow up with you tomorrow to see how you're feeling. Take care of yourself."
      },
      low: {
        timeframe: 'next_session' as const,
        message: "I'll be thinking of you. See you in our next conversation."
      }
    };

    const schedule = followUpSchedules[crisisResult.severity] || followUpSchedules.low;

    this.interventionState.followUpScheduled = true;

    return {
      scheduledCheckIn: true,
      timeframe: schedule.timeframe,
      checkInMessage: schedule.message
    };
  }

  /**
   * Helper methods for crisis assessment
   */
  private analyzeConversationFlow(messages: CrisisChatMessage[]): string {
    if (messages.length === 0) return 'initial';
    
    const recentCrisisFlags = messages
      .slice(-5)
      .filter(msg => msg.crisisFlags?.detected)
      .length;
    
    if (recentCrisisFlags >= 3) return 'escalating';
    if (recentCrisisFlags >= 1) return 'concerning';
    return 'stable';
  }

  private detectEscalationPattern(messages: CrisisChatMessage[]): boolean {
    if (messages.length < 3) return false;
    
    const recentMessages = messages.slice(-3);
    const confidenceLevels = recentMessages
      .map(msg => msg.crisisFlags?.confidence || 0)
      .filter(conf => conf > 0);
    
    if (confidenceLevels.length < 2) return false;
    
    // Check if confidence levels are increasing
    for (let i = 1; i < confidenceLevels.length; i++) {
      if (confidenceLevels[i] <= confidenceLevels[i - 1]) {
        return false;
      }
    }
    
    return true;
  }

  private extractRecentEmotionalState(messages: CrisisChatMessage[]): string {
    if (messages.length === 0) return 'unknown';
    
    const recentUserMessages = messages
      .filter(msg => msg.sender === 'user')
      .slice(-3)
      .map(msg => msg.text.toLowerCase());
    
    const emotionalKeywords = {
      despair: ['hopeless', 'worthless', 'pointless', 'give up'],
      anger: ['angry', 'furious', 'rage', 'hate'],
      anxiety: ['worried', 'scared', 'anxious', 'panic'],
      sadness: ['sad', 'depressed', 'down', 'crying']
    };
    
    for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
      if (keywords.some(keyword => 
        recentUserMessages.some(text => text.includes(keyword))
      )) {
        return emotion;
      }
    }
    
    return 'mixed';
  }

  private adjustConfidenceForConversationContext(
    result: CrisisDetectionResult,
    context: { conversationFlow: string; escalationPattern: boolean; previousCrisisEvents: number }
  ): CrisisDetectionResult {
    let adjustedConfidence = result.confidence;
    
    // Increase confidence for escalating patterns
    if (context.escalationPattern) {
      adjustedConfidence *= 1.2;
    }
    
    // Adjust based on conversation flow
    switch (context.conversationFlow) {
      case 'escalating':
        adjustedConfidence *= 1.3;
        break;
      case 'concerning':
        adjustedConfidence *= 1.1;
        break;
    }
    
    // Adjust for previous crisis events
    if (context.previousCrisisEvents > 0) {
      adjustedConfidence *= 1.1;
    }
    
    return {
      ...result,
      confidence: Math.min(adjustedConfidence, 1.0)
    };
  }

  private updateInterventionState(crisisResult: CrisisDetectionResult): void {
    if (crisisResult.detected) {
      this.interventionState.active = true;
      this.interventionState.interventionCount++;
      
      if (!this.interventionState.startTime) {
        this.interventionState.startTime = new Date();
      }
      
      // Update intervention level based on crisis severity
      switch (crisisResult.recommendedAction) {
        case 'emergency':
          this.interventionState.level = 'emergency_handoff';
          break;
        case 'intervention':
          this.interventionState.level = 'direct_support';
          break;
        case 'support':
          this.interventionState.level = 'gentle_check';
          break;
        default:
          this.interventionState.level = 'none';
      }
    }
  }

  private logCrisisEvent(crisisResult: CrisisDetectionResult, interventionLevel: string): void {
    this.monitoringSession.crisisEvents.push({
      timestamp: new Date(),
      severity: crisisResult.severity,
      intervention: interventionLevel,
      // Note: No user message content logged for privacy
    });
    
    // Set follow-up requirements
    if (crisisResult.severity === 'critical' || crisisResult.confidence > 0.8) {
      this.monitoringSession.followUpRequired = true;
    }
    
    // Professional notification for critical events
    if (crisisResult.severity === 'critical' && crisisResult.recommendedAction === 'emergency') {
      this.monitoringSession.professionalNotificationSent = true;
      // Trigger professional notification system (implementation depends on ALCHM's protocols)
    }
  }

  // Utility methods
  private mapInterventionLevel(recommendedAction: string): 'none' | 'gentle' | 'direct' | 'emergency' {
    switch (recommendedAction) {
      case 'emergency': return 'emergency';
      case 'intervention': return 'direct';
      case 'support': return 'gentle';
      default: return 'none';
    }
  }

  private determineWarmthLevel(crisisResult: CrisisDetectionResult): 'standard' | 'increased' | 'maximum' {
    if (crisisResult.detected && crisisResult.confidence > 0.7) {
      return 'maximum';
    } else if (crisisResult.detected) {
      return 'increased';
    }
    return 'standard';
  }

  private determineDirectnessLevel(crisisResult: CrisisDetectionResult): 'subtle' | 'clear' | 'direct' {
    if (crisisResult.severity === 'critical') {
      return 'direct';
    } else if (crisisResult.detected && crisisResult.confidence > 0.6) {
      return 'clear';
    }
    return 'subtle';
  }

  private determineSafetyProtocols(crisisResult: CrisisDetectionResult): {
    activateCrisisSupport: boolean;
    showFloatingButton: boolean;
    preloadResources: boolean;
    alertSystemRequired: boolean;
  } {
    const requiresIntervention = crisisResult.detected && crisisResult.confidence > 0.5;
    const requiresEmergency = crisisResult.severity === 'critical' || crisisResult.confidence > 0.8;
    
    return {
      activateCrisisSupport: requiresIntervention,
      showFloatingButton: crisisResult.detected,
      preloadResources: requiresIntervention,
      alertSystemRequired: requiresEmergency
    };
  }

  private getCrisisPersonalityResponses(archetype: ArchetypeVoice): Record<string, string[]> {
    return {
      sage: [
        "In moments like these, ancient wisdom reminds us that seeking help is the strongest thing we can do.",
        "Your courage in sharing this darkness with me shows the light of your spirit still shines.",
        "The wisest among us know that healing often requires the support of trained guides."
      ],
      coach: [
        "Champions know when to call in their team - and right now, you need your crisis support team.",
        "This is your moment to show the ultimate strength: asking for professional help.",
        "You've got what it takes to get through this, and that includes reaching out for specialized support."
      ],
      poet: [
        "In this valley of shadows, you are not walking alone - there are hands reaching out to guide you.",
        "Sometimes the most beautiful transformations begin with asking for help in our darkest hour.",
        "Your story isn't ending here - it's finding the professional voices that can help it continue."
      ]
    };
  }

  private generateStandardSafeResponse(
    archetype: ArchetypeVoice,
    userMessage: string,
    emotionalContext: EmotionalContext,
    vocabularyLevel: EmotionalVocabularyLevel
  ): {
    message: string;
    supportMessage?: string;
    interventionLevel: 'none';
    continuityMessage?: string;
  } {
    // Generate standard Khepera response with enhanced safety awareness
    // This would integrate with existing personality generation
    
    const safeResponses = {
      sage: `✨ I am Khepera. Thank you for sharing your thoughts with me. Your willingness to reflect shows beautiful self-awareness.`,
      coach: `✨ I am Khepera. I see the strength in your words and your commitment to understanding yourself better.`,
      poet: `✨ I am Khepera. Your words create a typeof window !== 'undefined' && window into your inner world, and I'm honored to witness this moment of expression.`
    };

    return {
      message: safeResponses[archetype],
      interventionLevel: 'none'
    };
  }

  private generateMonitoringResponse(
    archetype: ArchetypeVoice,
    userMessage: string,
    emotionalContext: EmotionalContext
  ): {
    message: string;
    supportMessage?: string;
    interventionLevel: 'none';
    continuityMessage?: string;
  } {
    const monitoringResponses = {
      sage: {
        message: "✨ I am Khepera. I hear the complexity in what you're sharing, and I want you to know that all of your feelings are valid and deserve to be witnessed.",
        support: "Sometimes life presents us with challenges that feel overwhelming. You're showing wisdom by taking time to process and reflect.",
        continuity: "I'm here to support you through this reflection. Remember, you always have access to additional resources if you need them."
      },
      coach: {
        message: "✨ I am Khepera. I can feel the weight of what you're carrying, and I want to acknowledge the strength it takes to keep moving forward.",
        support: "Processing difficult experiences is part of building resilience. You're doing important work by giving these feelings attention.",
        continuity: "Your journey through this is showing real courage. I'm here to support you, and there are other resources available whenever you need them."
      },
      poet: {
        message: "✨ I am Khepera. Your words paint a picture of complex emotions, and I want to sit with you in this space of feeling.",
        support: "Sometimes our deepest emotions need time and space to be fully understood. There's no rush in this process.",
        continuity: "I'm here to explore these feelings with you. Remember that seeking additional support is always a sign of wisdom, not weakness."
      }
    };

    return {
      message: monitoringResponses[archetype].message,
      supportMessage: monitoringResponses[archetype].support,
      interventionLevel: 'none',
      continuityMessage: monitoringResponses[archetype].continuity
    };
  }

  /**
   * Public methods for integration with existing systems
   */
  
  public getInterventionState(): CrisisInterventionState {
    return { ...this.interventionState };
  }

  public getMonitoringSession(): SafetyMonitoringSession {
    return { ...this.monitoringSession };
  }

  public addMessageToHistory(message: CrisisChatMessage): void {
    this.conversationHistory.push(message);
    
    // Keep only last 20 messages for performance
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  public getUserResponseToIntervention(response: string): void {
    this.interventionState.userResponseCollected = true;
    
    // Log response for follow-up (privacy-preserving)
    if (this.monitoringSession.crisisEvents.length > 0) {
      const lastEvent = this.monitoringSession.crisisEvents[this.monitoringSession.crisisEvents.length - 1];
      lastEvent.userResponse = this.categorizeResponse(response);
    }
  }

  private categorizeResponse(response: string): string {
    const responseCategories = {
      'engaged_positively': ['better', 'helpful', 'good', 'yes', 'okay'],
      'engaged_neutrally': ['maybe', 'think', 'suppose', 'guess'],
      'resistant': ['no', 'fine', 'leave me alone', 'stop'],
      'concerning': ['worse', 'doesn\'t matter', 'pointless', 'whatever']
    };

    const lowerResponse = response.toLowerCase();
    
    for (const [category, keywords] of Object.entries(responseCategories)) {
      if (keywords.some(keyword => lowerResponse.includes(keyword))) {
        return category;
      }
    }
    
    return 'neutral';
  }

  public performFollowUpCheck(): boolean {
    return this.interventionState.followUpScheduled && 
           this.monitoringSession.followUpRequired;
  }

  public generateFollowUpMessage(archetype: ArchetypeVoice): string {
    const followUpMessages = {
      sage: "✨ I am Khepera. I wanted to check in with you and see how you're feeling since our last conversation. Your wellbeing matters to me.",
      coach: "✨ I am Khepera. I'm following up to see how you're doing. Remember, reaching out shows strength, and I'm here to support you.",
      poet: "✨ I am Khepera. Like a friend checking in after a storm, I wanted to see how your heart is doing today. You're in my thoughts."
    };

    return followUpMessages[archetype];
  }
}

export default KheperaCrisisSafetySystem;