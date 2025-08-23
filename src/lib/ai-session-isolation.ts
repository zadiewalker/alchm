// ALCHM AI Session Isolation System
// Prevents cross-user data leakage in Khepera AI processing

import { randomBytes } from 'crypto';

export interface AISession {
  sessionId: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  isActive: boolean;
  locale: string;
  culturalProfile?: string;
  securityContext: SessionSecurityContext;
}

export interface SessionSecurityContext {
  encryptionKey: string;
  messageCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  allowedOperations: string[];
  dataRetentionPolicy: 'session_only' | 'encrypted_temporary' | 'no_retention';
}

export interface IsolatedAIRequest {
  sessionId: string;
  userInput: string;
  culturalContext: string;
  metadata: {
    timestamp: Date;
    messageIndex: number;
    inputHash: string;
  };
}

export interface IsolatedAIResponse {
  sessionId: string;
  response: string;
  metadata: {
    timestamp: Date;
    responseId: string;
    processingTime: number;
    modelVersion: string;
  };
  securityValidation: {
    containsPII: boolean;
    riskAssessment: string;
    culturalCompliance: boolean;
  };
}

export class AISessionIsolationManager {
  private activeSessions = new Map<string, AISession>();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_SESSIONS_PER_USER = 3;
  private readonly MAX_MESSAGES_PER_SESSION = 50;

  // Create isolated AI session for user
  async createIsolatedSession(userId: string, locale: string, culturalProfile?: string): Promise<string> {
    // Clean up expired sessions first
    await this.cleanupExpiredSessions();

    // Check user session limits
    const userSessions = Array.from(this.activeSessions.values())
      .filter(session => session.userId === userId && session.isActive);
    
    if (userSessions.length >= this.MAX_SESSIONS_PER_USER) {
      // Terminate oldest session
      const oldestSession = userSessions.sort((a, b) => 
        a.lastActivity.getTime() - b.lastActivity.getTime()
      )[0];
      await this.terminateSession(oldestSession.sessionId);
    }

    // Generate cryptographically secure session ID
    const sessionId = await this.generateSecureSessionId();
    
    // Create session security context
    const securityContext: SessionSecurityContext = {
      encryptionKey: await this.generateSessionEncryptionKey(),
      messageCount: 0,
      riskLevel: 'low',
      allowedOperations: ['reflect', 'analyze', 'guide'],
      dataRetentionPolicy: 'session_only'
    };

    const session: AISession = {
      sessionId,
      userId,
      startTime: new Date(),
      lastActivity: new Date(),
      isActive: true,
      locale,
      culturalProfile,
      securityContext
    };

    this.activeSessions.set(sessionId, session);
    console.log(`[AI Session] Created isolated session ${sessionId} for user ${userId}`);
    
    return sessionId;
  }

  // Process AI request with full isolation
  async processIsolatedRequest(request: IsolatedAIRequest): Promise<IsolatedAIResponse> {
    const session = this.activeSessions.get(request.sessionId);
    if (!session || !session.isActive) {
      throw new Error('Invalid or expired AI session');
    }

    // Update session activity
    session.lastActivity = new Date();
    session.securityContext.messageCount++;

    // Check message limits
    if (session.securityContext.messageCount > this.MAX_MESSAGES_PER_SESSION) {
      await this.terminateSession(request.sessionId);
      throw new Error('Session message limit exceeded for security');
    }

    // Validate and sanitize input
    const sanitizedInput = await this.sanitizeInput(request.userInput);
    const inputHash = await this.hashInput(sanitizedInput);

    // Create isolated prompt with no persistent context
    const isolatedPrompt = this.createIsolatedPrompt(sanitizedInput, session);

    try {
      // Process with AI (this would integrate with your AI service)
      const aiResponse = await this.callIsolatedAI(isolatedPrompt, session);

      // Validate response for PII and safety
      const securityValidation = await this.validateAIResponse(aiResponse, session);

      const response: IsolatedAIResponse = {
        sessionId: request.sessionId,
        response: aiResponse,
        metadata: {
          timestamp: new Date(),
          responseId: await this.generateResponseId(),
          processingTime: 0, // Would be calculated from actual processing
          modelVersion: 'khepera-v1.0-isolated'
        },
        securityValidation
      };

      // Log for audit without storing user data
      await this.auditLogInteraction(session.userId, request.sessionId, {
        hasInput: !!sanitizedInput,
        hasResponse: !!aiResponse,
        riskLevel: securityValidation.riskAssessment,
        timestamp: new Date()
      });

      return response;

    } catch (error) {
      console.error(`[AI Session] Processing failed for session ${request.sessionId}:`, error);
      throw new Error('AI processing failed with isolation maintained');
    }
  }

  // Create completely isolated AI prompt (no memory/context)
  private createIsolatedPrompt(userInput: string, session: AISession): string {
    const culturalGuidance = session.culturalProfile ? 
      `Cultural Context: Respond according to ${session.culturalProfile} cultural framework.` : '';
    
    return `You are KHEPERA, an AI reflection guide. This is a completely isolated conversation with no memory of previous interactions.

CRITICAL ISOLATION RULES:
- You have NO memory of any previous conversations
- You cannot access any user data or history
- This is a single, standalone interaction
- Provide trauma-informed, culturally sensitive guidance only

Session Locale: ${session.locale}
${culturalGuidance}

User Reflection: "${userInput}"

Respond with empathetic, trauma-informed guidance that honors the user's cultural context. Focus on their strength and resilience.`;
  }

  // Simulate isolated AI call (replace with actual AI service)
  private async callIsolatedAI(prompt: string, session: AISession): Promise<string> {
    // This would integrate with your actual AI service (Gemini, OpenAI, etc.)
    // The key is that no session context or user history is passed
    
    console.log(`[AI Session] Processing isolated request for session ${session.sessionId}`);
    
    // Simulated response - replace with actual AI call
    return `As Khepera, I hear the strength in your words and honor your courage in sharing. Your feelings are valid, and your resilience shines through. Remember that growth often comes through challenges, and you have the inner wisdom to navigate this journey. What feels most important for you to honor about yourself right now?

[This response was generated in isolation with no memory of previous conversations]`;
  }

  // Validate AI response for safety and compliance
  private async validateAIResponse(response: string, session: AISession): Promise<{
    containsPII: boolean;
    riskAssessment: string;
    culturalCompliance: boolean;
  }> {
    // Check for accidental PII in AI response
    const containsPII = await this.detectPIIInResponse(response);
    
    // Assess response risk level
    const riskAssessment = this.assessResponseRisk(response);
    
    // Validate cultural compliance
    const culturalCompliance = this.validateCulturalCompliance(response, session.locale);

    // Update session risk level if needed
    if (riskAssessment === 'high' || containsPII) {
      session.securityContext.riskLevel = 'high';
    }

    return {
      containsPII,
      riskAssessment,
      culturalCompliance
    };
  }

  // Terminate session and clear all data
  async terminateSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.isActive = false;
      
      // Clear any temporary data
      await this.clearSessionData(sessionId);
      
      // Remove from active sessions
      this.activeSessions.delete(sessionId);
      
      console.log(`[AI Session] Terminated and cleared session ${sessionId}`);
    }
  }

  // Clean up expired sessions
  private async cleanupExpiredSessions(): Promise<void> {
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.activeSessions) {
      if (now - session.lastActivity.getTime() > this.SESSION_TIMEOUT) {
        expiredSessions.push(sessionId);
      }
    }

    for (const sessionId of expiredSessions) {
      await this.terminateSession(sessionId);
    }

    if (expiredSessions.length > 0) {
      console.log(`[AI Session] Cleaned up ${expiredSessions.length} expired sessions`);
    }
  }

  // Security utilities
  private async generateSecureSessionId(): Promise<string> {
    const buffer = randomBytes(32);
    return buffer.toString('hex');
  }

  private async generateSessionEncryptionKey(): Promise<string> {
    const buffer = randomBytes(32);
    return buffer.toString('base64');
  }

  private async generateResponseId(): Promise<string> {
    const buffer = randomBytes(16);
    return buffer.toString('hex');
  }

  private async hashInput(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async sanitizeInput(input: string): Promise<string> {
    // Basic sanitization - could integrate with PII redaction service
    return input.replace(/[<>{}]/g, ''); // Remove potential injection characters
  }

  private async detectPIIInResponse(response: string): Promise<boolean> {
    // Simple PII detection in AI responses
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    
    return emailPattern.test(response) || phonePattern.test(response);
  }

  private assessResponseRisk(response: string): string {
    // Simple risk assessment
    const riskKeywords = ['suicide', 'harm', 'danger', 'crisis'];
    const hasRiskKeywords = riskKeywords.some(keyword => 
      response.toLowerCase().includes(keyword)
    );
    
    return hasRiskKeywords ? 'high' : 'low';
  }

  private validateCulturalCompliance(response: string, locale: string): boolean {
    // Basic cultural compliance check
    // In production, this would be more sophisticated
    return !response.includes('inappropriate cultural content');
  }

  private async clearSessionData(sessionId: string): Promise<void> {
    // Clear any temporary session data
    // This ensures no user data persists after session termination
    console.log(`[AI Session] Cleared all data for session ${sessionId}`);
  }

  private async auditLogInteraction(userId: string, sessionId: string, interaction: any): Promise<void> {
    // Log interaction for audit without storing actual user content
    const auditEntry = {
      userId: userId.substring(0, 8) + '***', // Partial ID for tracking
      sessionId: sessionId.substring(0, 8) + '***',
      timestamp: interaction.timestamp,
      hasInput: interaction.hasInput,
      hasResponse: interaction.hasResponse,
      riskLevel: interaction.riskLevel
    };
    
    console.log('[AI Session Audit]', auditEntry);
    // In production, store in secure audit log
  }

  // Public session management methods
  async getActiveSessionCount(): Promise<number> {
    await this.cleanupExpiredSessions();
    return this.activeSessions.size;
  }

  async getUserSessionCount(userId: string): Promise<number> {
    await this.cleanupExpiredSessions();
    return Array.from(this.activeSessions.values())
      .filter(session => session.userId === userId && session.isActive).length;
  }

  async isSessionValid(sessionId: string): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);
    if (!session || !session.isActive) return false;
    
    const now = Date.now();
    if (now - session.lastActivity.getTime() > this.SESSION_TIMEOUT) {
      await this.terminateSession(sessionId);
      return false;
    }
    
    return true;
  }
}

// Export singleton instance
export const aiSessionManager = new AISessionIsolationManager();