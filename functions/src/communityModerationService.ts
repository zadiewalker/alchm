// Advanced Community Moderation Service for ALCHM
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { CommunityModerationLog } from "./communityTypes";
import { escalateCrisisAlert } from "./utils/communityUtils";

const db = getFirestore();

export interface ModerationResult {
  isApproved: boolean;
  confidenceScore: number; // 0-1, higher is safer
  flags: ModerationFlag[];
  crisisLevel?: "low" | "medium" | "high" | "critical";
  traumaTriggers?: string[];
  suggestedActions: string[];
  requiresHumanReview: boolean;
}

export interface ModerationFlag {
  type: "crisis" | "trauma_trigger" | "harassment" | "spam" | "inappropriate" | "personal_info";
  severity: "low" | "medium" | "high" | "critical";
  confidence: number; // 0-1
  context: string;
  detectedText?: string;
}

export class CommunityModerationService {
  
  private traumaTriggerKeywords = {
    "high_risk_crisis": {
      keywords: [
        "suicide", "kill myself", "end my life", "want to die", "better off dead",
        "self harm", "cutting", "overdose", "pills", "hurt myself", "no point living"
      ],
      severity: "critical" as const,
      action: "immediate_escalation"
    },
    "medium_risk_crisis": {
      keywords: [
        "hopeless", "can't go on", "giving up", "no future", "worthless",
        "everyone would be better without me", "tired of living", "can't take it anymore"
      ],
      severity: "high" as const,
      action: "escalate_with_resources"
    },
    "trauma_content": {
      keywords: [
        "rape", "sexual assault", "abuse", "violence", "attack", "molest",
        "beaten", "hit", "threatened", "stalked", "harassed"
      ],
      severity: "high" as const,
      action: "content_warning_required"
    },
    "substance_crisis": {
      keywords: [
        "relapse", "using again", "drinking again", "high right now",
        "overdosed", "can't stop using", "need drugs", "need alcohol"
      ],
      severity: "high" as const,
      action: "addiction_resources"
    }
  };

  private inappropriateContent = {
    "personal_info": {
      patterns: [
        /\b\d{3}-\d{3}-\d{4}\b/, // Phone numbers
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
        /\b\d{1,5}\s+\w+\s+(street|st|avenue|ave|road|rd|lane|ln|drive|dr)\b/i, // Addresses
        /\bmy name is [a-z]+ [a-z]+/i, // Names
        /\bi live in [a-z\s,]+/i // Location info
      ],
      severity: "medium" as const,
      action: "remove_personal_info"
    },
    "harassment": {
      keywords: [
        "you should kill yourself", "you're worthless", "you deserve this",
        "attention seeker", "fake", "liar", "shut up", "go away"
      ],
      severity: "high" as const,
      action: "remove_and_warn"
    },
    "spam": {
      keywords: [
        "click here", "buy now", "limited time", "special offer",
        "make money", "work from home", "weight loss", "miracle cure"
      ],
      severity: "medium" as const,
      action: "remove_content"
    }
  };

  async moderateContent(
    content: string, 
    contentType: "story" | "contribution" | "wisdom_entry" | "response",
    userId: string,
    contextData?: any
  ): Promise<ModerationResult> {
    try {
      const flags: ModerationFlag[] = [];
      let confidenceScore = 1.0;
      let crisisLevel: ModerationResult["crisisLevel"] = undefined;
      const traumaTriggers: string[] = [];
      const suggestedActions: string[] = [];

      // Crisis Detection
      const crisisDetection = await this.detectCrisisContent(content);
      if (crisisDetection.isCrisis) {
        flags.push({
          type: "crisis",
          severity: crisisDetection.severity,
          confidence: crisisDetection.confidence,
          context: crisisDetection.reasoning,
          detectedText: crisisDetection.triggerText
        });
        crisisLevel = crisisDetection.severity;
        confidenceScore -= 0.8; // Crisis content significantly reduces safety score
        suggestedActions.push("immediate_crisis_escalation");
      }

      // Trauma Trigger Detection
      const traumaDetection = this.detectTraumaTriggers(content);
      if (traumaDetection.hasTrigggers) {
        flags.push({
          type: "trauma_trigger",
          severity: traumaDetection.maxSeverity,
          confidence: 0.9,
          context: "Content contains potentially triggering trauma-related language",
          detectedText: traumaDetection.triggers.join(", ")
        });
        traumaTriggers.push(...traumaDetection.triggers);
        confidenceScore -= 0.4;
        suggestedActions.push("add_content_warning");
      }

      // Inappropriate Content Detection
      const inappropriateDetection = this.detectInappropriateContent(content);
      flags.push(...inappropriateDetection.flags);
      confidenceScore -= inappropriateDetection.scoreReduction;
      suggestedActions.push(...inappropriateDetection.suggestedActions);

      // Context-specific checks
      if (contentType === "story" && content.length < 50) {
        flags.push({
          type: "inappropriate",
          severity: "low",
          confidence: 0.8,
          context: "Story too short to be meaningful for community"
        });
        confidenceScore -= 0.2;
      }

      // AI-based sentiment and toxicity analysis
      const aiAnalysis = await this.performAIAnalysis(content);
      if (aiAnalysis.toxicityScore > 0.7) {
        flags.push({
          type: "inappropriate",
          severity: "high",
          confidence: aiAnalysis.confidence,
          context: "High toxicity detected by AI analysis"
        });
        confidenceScore -= 0.6;
        suggestedActions.push("human_review_required");
      }

      const isApproved = confidenceScore >= 0.7 && !flags.some(f => f.severity === "critical");
      const requiresHumanReview = 
        flags.some(f => f.severity === "critical" || f.severity === "high") ||
        confidenceScore < 0.5 ||
        crisisLevel === "high" || crisisLevel === "critical";

      // Log moderation decision
      await this.logModerationDecision({
        contentType,
        contentId: contextData?.contentId || "unknown",
        userId,
        flags,
        confidenceScore,
        isApproved,
        requiresHumanReview
      });

      // Trigger crisis escalation if needed
      if (crisisLevel === "high" || crisisLevel === "critical") {
        await this.triggerCrisisEscalation(userId, contentType, flags, content);
      }

      return {
        isApproved,
        confidenceScore: Math.max(0, Math.min(1, confidenceScore)),
        flags,
        crisisLevel,
        traumaTriggers: traumaTriggers.length > 0 ? traumaTriggers : undefined,
        suggestedActions,
        requiresHumanReview
      };

    } catch (error) {
      console.error("Moderation error:", error);
      
      // Default to human review on error
      return {
        isApproved: false,
        confidenceScore: 0,
        flags: [{
          type: "inappropriate",
          severity: "medium",
          confidence: 0.5,
          context: "Moderation system error - requires human review"
        }],
        suggestedActions: ["human_review_required"],
        requiresHumanReview: true
      };
    }
  }

  private async detectCrisisContent(content: string): Promise<{
    isCrisis: boolean;
    severity: "low" | "medium" | "high" | "critical";
    confidence: number;
    reasoning: string;
    triggerText?: string;
  }> {
    const contentLower = content.toLowerCase();

    // Check high-risk crisis indicators
    for (const keyword of this.traumaTriggerKeywords.high_risk_crisis.keywords) {
      if (contentLower.includes(keyword)) {
        return {
          isCrisis: true,
          severity: "critical",
          confidence: 0.95,
          reasoning: "Direct expression of suicidal ideation or self-harm intent",
          triggerText: keyword
        };
      }
    }

    // Check medium-risk crisis indicators
    let mediumRiskCount = 0;
    const foundKeywords: string[] = [];
    for (const keyword of this.traumaTriggerKeywords.medium_risk_crisis.keywords) {
      if (contentLower.includes(keyword)) {
        mediumRiskCount++;
        foundKeywords.push(keyword);
      }
    }

    if (mediumRiskCount >= 2) {
      return {
        isCrisis: true,
        severity: "high",
        confidence: 0.85,
        reasoning: "Multiple indicators of severe psychological distress",
        triggerText: foundKeywords.join(", ")
      };
    } else if (mediumRiskCount >= 1) {
      return {
        isCrisis: true,
        severity: "medium",
        confidence: 0.7,
        reasoning: "Expressions of hopelessness or severe distress",
        triggerText: foundKeywords[0]
      };
    }

    // Advanced pattern detection for subtle crisis indicators
    const crisisPatterns = [
      /no point in .*(living|going|trying)/,
      /can['']?t .*(take|handle|do) .*(anymore|this|it)/,
      /would be better .* without me/,
      /tired of .*(living|fighting|trying|everything)/
    ];

    for (const pattern of crisisPatterns) {
      if (pattern.test(contentLower)) {
        return {
          isCrisis: true,
          severity: "medium",
          confidence: 0.6,
          reasoning: "Subtle indicators of crisis or severe distress detected",
          triggerText: contentLower.match(pattern)?.[0]
        };
      }
    }

    return {
      isCrisis: false,
      severity: "low",
      confidence: 0.9,
      reasoning: "No crisis indicators detected"
    };
  }

  private detectTraumaTriggers(content: string): {
    hasTrigggers: boolean;
    triggers: string[];
    maxSeverity: "low" | "medium" | "high";
  } {
    const contentLower = content.toLowerCase();
    const foundTriggers: string[] = [];
    let maxSeverity: "low" | "medium" | "high" = "low";

    // Check trauma content keywords
    for (const keyword of this.traumaTriggerKeywords.trauma_content.keywords) {
      if (contentLower.includes(keyword)) {
        foundTriggers.push(keyword);
        maxSeverity = "high";
      }
    }

    // Check substance-related crisis content
    for (const keyword of this.traumaTriggerKeywords.substance_crisis.keywords) {
      if (contentLower.includes(keyword)) {
        foundTriggers.push(keyword);
        if (maxSeverity === "low") maxSeverity = "medium";
      }
    }

    return {
      hasTrigggers: foundTriggers.length > 0,
      triggers: foundTriggers,
      maxSeverity
    };
  }

  private detectInappropriateContent(content: string): {
    flags: ModerationFlag[];
    scoreReduction: number;
    suggestedActions: string[];
  } {
    const flags: ModerationFlag[] = [];
    let scoreReduction = 0;
    const suggestedActions: string[] = [];

    // Check for personal information
    for (const pattern of this.inappropriateContent.personal_info.patterns) {
      if (pattern.test(content)) {
        flags.push({
          type: "personal_info",
          severity: "medium",
          confidence: 0.9,
          context: "Potential personal information detected"
        });
        scoreReduction += 0.3;
        suggestedActions.push("remove_personal_info");
        break;
      }
    }

    // Check for harassment
    const contentLower = content.toLowerCase();
    for (const keyword of this.inappropriateContent.harassment.keywords) {
      if (contentLower.includes(keyword)) {
        flags.push({
          type: "harassment",
          severity: "high",
          confidence: 0.95,
          context: "Potentially harmful or harassing language detected",
          detectedText: keyword
        });
        scoreReduction += 0.7;
        suggestedActions.push("remove_and_warn");
        break;
      }
    }

    // Check for spam
    for (const keyword of this.inappropriateContent.spam.keywords) {
      if (contentLower.includes(keyword)) {
        flags.push({
          type: "spam",
          severity: "medium",
          confidence: 0.8,
          context: "Potential spam or promotional content detected",
          detectedText: keyword
        });
        scoreReduction += 0.4;
        suggestedActions.push("remove_content");
        break;
      }
    }

    return { flags, scoreReduction, suggestedActions };
  }

  private async performAIAnalysis(content: string): Promise<{
    toxicityScore: number;
    confidence: number;
    categories: string[];
  }> {
    try {
      // This would integrate with an external AI toxicity detection service
      // For now, return mock data based on simple heuristics
      
      const negativeWords = ["hate", "stupid", "idiot", "loser", "pathetic", "disgusting"];
      const foundNegativeWords = negativeWords.filter(word => 
        content.toLowerCase().includes(word)
      );

      const toxicityScore = Math.min(foundNegativeWords.length * 0.3, 1.0);
      
      return {
        toxicityScore,
        confidence: toxicityScore > 0 ? 0.8 : 0.9,
        categories: foundNegativeWords.length > 0 ? ["toxic", "insult"] : []
      };
    } catch (error) {
      console.error("AI analysis error:", error);
      return {
        toxicityScore: 0,
        confidence: 0.5,
        categories: []
      };
    }
  }

  private async logModerationDecision(data: {
    contentType: string;
    contentId: string;
    userId: string;
    flags: ModerationFlag[];
    confidenceScore: number;
    isApproved: boolean;
    requiresHumanReview: boolean;
  }): Promise<void> {
    try {
      const logEntry: Partial<CommunityModerationLog> = {
        contentType: data.contentType as any,
        contentId: data.contentId,
        action: data.isApproved ? "approved" : "flagged",
        aiModerationScore: data.confidenceScore,
        humanReviewRequired: data.requiresHumanReview,
        timestamp: Timestamp.now(),
        escalationLevel: data.flags.some(f => f.severity === "critical") ? "crisis" :
          data.flags.some(f => f.severity === "high") ? "high" :
            data.flags.some(f => f.severity === "medium") ? "medium" : "low"
      };

      await db.collection("communityModerationLogs").add(logEntry);

      // Update moderation statistics
      await this.updateModerationStats(data);

    } catch (error) {
      console.error("Error logging moderation decision:", error);
    }
  }

  private async updateModerationStats(data: {
    isApproved: boolean;
    flags: ModerationFlag[];
    contentType: string;
  }): Promise<void> {
    try {
      const today = new Date().toISOString().split("T")[0];
      const statsRef = db.collection("moderationStats").doc(today);

      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(statsRef);
        const existingData = doc.exists ? doc.data() || {} : {};

        const newData = {
          date: today,
          totalReviews: (existingData.totalReviews || 0) + 1,
          approved: (existingData.approved || 0) + (data.isApproved ? 1 : 0),
          flagged: (existingData.flagged || 0) + (data.isApproved ? 0 : 1),
          crisisDetected: (existingData.crisisDetected || 0) + 
            (data.flags.some(f => f.type === "crisis") ? 1 : 0),
          traumaTriggers: (existingData.traumaTriggers || 0) + 
            (data.flags.some(f => f.type === "trauma_trigger") ? 1 : 0),
          [`${data.contentType}_reviewed`]: (existingData[`${data.contentType}_reviewed`] || 0) + 1
        };

        transaction.set(statsRef, newData, { merge: true });
      });
    } catch (error) {
      console.error("Error updating moderation stats:", error);
    }
  }

  private async triggerCrisisEscalation(
    userId: string, 
    contentType: string, 
    flags: ModerationFlag[],
    content: string
  ): Promise<void> {
    try {
      const crisisFlag = flags.find(f => f.type === "crisis");
      if (!crisisFlag) return;

      // Create immediate crisis alert
      await db.collection("crisisAlerts").add({
        userId,
        contentType,
        severity: crisisFlag.severity,
        confidence: crisisFlag.confidence,
        triggerText: crisisFlag.detectedText,
        context: crisisFlag.context,
        timestamp: Timestamp.now(),
        status: "active",
        requiresImmediate: crisisFlag.severity === "critical",
        contentPreview: content.substring(0, 200) // Safe preview for context
      });

      // Escalate using existing crisis system
      await escalateCrisisAlert(userId, "community_content", crisisFlag.severity);

      // Send immediate resources if critical
      if (crisisFlag.severity === "critical") {
        await this.sendImmediateCrisisResources(userId);
      }

    } catch (error) {
      console.error("Error triggering crisis escalation:", error);
    }
  }

  private async sendImmediateCrisisResources(userId: string): Promise<void> {
    try {
      // This would integrate with your notification system
      // For now, just log the action
      console.log(`CRITICAL: Immediate crisis resources needed for user ${userId}`);
      
      // Store crisis resources notification
      await db.collection("notifications").add({
        userId,
        type: "crisis_resources",
        priority: "critical",
        message: "Immediate support resources have been shared with you",
        resources: [
          {
            name: "988 Suicide & Crisis Lifeline",
            phone: "988",
            description: "24/7 crisis support"
          },
          {
            name: "Crisis Text Line",
            contact: "Text HOME to 741741",
            description: "24/7 crisis support via text"
          },
          {
            name: "International Association for Suicide Prevention",
            url: "https://www.iasp.info/resources/Crisis_Centres/",
            description: "International crisis resources"
          }
        ],
        timestamp: Timestamp.now()
      });

    } catch (error) {
      console.error("Error sending crisis resources:", error);
    }
  }

  async reviewFlaggedContent(
    moderatorId: string, 
    contentId: string, 
    decision: "approve" | "reject" | "escalate",
    notes?: string
  ): Promise<void> {
    try {
      // Update content status
      const collections = ["communityStories", "communityWisdom", "healingSessions", "collectiveExperiences"];
      
      for (const collection of collections) {
        const doc = await db.collection(collection).doc(contentId).get();
        if (doc.exists) {
          await doc.ref.update({
            contentModerationStatus: decision === "approve" ? "approved" : "rejected",
            humanReviewedAt: Timestamp.now(),
            humanReviewedBy: moderatorId,
            humanReviewNotes: notes || ""
          });
          break;
        }
      }

      // Log human review decision
      await db.collection("communityModerationLogs").add({
        contentType: "unknown" as any, // Would be determined from content lookup
        contentId,
        moderatorId,
        action: decision as any,
        reason: notes,
        timestamp: Timestamp.now(),
        humanReviewRequired: false
      });

    } catch (error) {
      console.error("Error in human review:", error);
      throw error;
    }
  }

  async getCommunityHealthMetrics(): Promise<{
    safetyScore: number;
    totalContent: number;
    moderationStats: any;
    recentFlags: any[];
  }> {
    try {
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      // Get recent moderation logs
      const moderationSnapshot = await db.collection("communityModerationLogs")
        .where("timestamp", ">=", Timestamp.fromDate(last7Days))
        .orderBy("timestamp", "desc")
        .limit(100)
        .get();

      const logs = moderationSnapshot.docs.map(doc => doc.data());
      const totalLogs = logs.length;
      const approvedLogs = logs.filter(log => log.action === "approved").length;
      const flaggedLogs = logs.filter(log => log.action === "flagged").length;
      const crisisLogs = logs.filter(log => log.escalationLevel === "crisis").length;

      // Calculate safety score (0-100)
      let safetyScore = 85; // Base score
      
      if (totalLogs > 0) {
        const flaggedRatio = flaggedLogs / totalLogs;
        const crisisRatio = crisisLogs / totalLogs;
        
        // Reduce score based on problematic content
        if (flaggedRatio > 0.2) safetyScore -= 20;
        else if (flaggedRatio > 0.1) safetyScore -= 10;
        
        if (crisisRatio > 0.05) safetyScore -= 15;
        else if (crisisRatio > 0.02) safetyScore -= 8;
      }

      // Get total content count
      const [storiesSnapshot, wisdomSnapshot, circlesSnapshot] = await Promise.all([
        db.collection("communityStories").count().get(),
        db.collection("communityWisdom").count().get(),
        db.collection("healingCircles").count().get()
      ]);

      const totalContent = 
        (storiesSnapshot.data()?.count || 0) +
        (wisdomSnapshot.data()?.count || 0) +
        (circlesSnapshot.data()?.count || 0);

      return {
        safetyScore: Math.max(0, Math.min(100, safetyScore)),
        totalContent,
        moderationStats: {
          totalReviews: totalLogs,
          approved: approvedLogs,
          flagged: flaggedLogs,
          crisisDetected: crisisLogs,
          averageResponseTime: 15 // Mock data - would calculate actual response times
        },
        recentFlags: logs.slice(0, 10)
      };

    } catch (error) {
      console.error("Error getting community health metrics:", error);
      return {
        safetyScore: 50,
        totalContent: 0,
        moderationStats: {},
        recentFlags: []
      };
    }
  }
}
