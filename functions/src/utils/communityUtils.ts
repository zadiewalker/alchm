// Community Healing Utility Functions
import { createHash } from "crypto";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

// === ANONYMIZATION UTILITIES ===
export function generateAnonymousId(userId: string, context: string): string {
  // Create a deterministic but anonymous ID based on user ID and context
  const hash = createHash("sha256");
  hash.update(`${userId}_${context}_${process.env.ANONYMOUS_SALT || "alchm_community_salt"}`);
  return hash.digest("hex").substring(0, 16);
}

export function hashForPrivacy(data: string): string {
  const hash = createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

// === SESSION VALIDATION ===
export async function validateSession(sessionToken: string): Promise<{ userId: string; isValid: boolean }> {
  try {
    // This would integrate with your existing session validation
    // For now, we'll assume the session token contains the user ID
    // In production, this should verify the token against Firebase Auth
    const userId = sessionToken; // Simplified for demo
    return { userId, isValid: true };
  } catch (error) {
    return { userId: "", isValid: false };
  }
}

// === AI MODERATION ===
interface ModerationResult {
  isApproved: boolean;
  score: number;
  flags: string[];
  crisisIndicators?: boolean;
  crisisLevel?: string;
  traumaTriggers?: string[];
}

export async function aiModerationCheck(content: string, contentType: string): Promise<ModerationResult> {
  try {
    // Integrate with your existing AI service
    const response = await fetch("/api/moderate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, contentType })
    });

    if (!response.ok) {
      // Fallback to basic moderation
      return await basicModerationCheck(content);
    }

    return await response.json();
  } catch (error) {
    console.error("AI moderation error:", error);
    // Fallback to basic moderation
    return await basicModerationCheck(content);
  }
}

async function basicModerationCheck(content: string): Promise<ModerationResult> {
  const contentLower = content.toLowerCase();

  // Basic trauma-informed keyword detection
  const crisisKeywords = [
    "suicide", "kill myself", "end my life", "want to die", "self harm",
    "cutting", "overdose", "pills", "hurt myself"
  ];

  const traumaTriggers = [
    "rape", "sexual assault", "abuse", "violence", "attack"
  ];

  const inappropriateContent = [
    "spam", "advertisement", "buy now", "click here"
  ];

  const flags: string[] = [];
  let crisisIndicators = false;
  let crisisLevel = "low";
  let detectedTriggers: string[] = [];

  // Check for crisis content
  if (crisisKeywords.some(keyword => contentLower.includes(keyword))) {
    flags.push("crisis_content");
    crisisIndicators = true;
    crisisLevel = "high";
  }

  // Check for trauma triggers
  const foundTriggers = traumaTriggers.filter(trigger => contentLower.includes(trigger));
  if (foundTriggers.length > 0) {
    flags.push("trauma_trigger");
    detectedTriggers = foundTriggers;
  }

  // Check for inappropriate content
  if (inappropriateContent.some(keyword => contentLower.includes(keyword))) {
    flags.push("inappropriate");
  }

  // Calculate safety score (0-1, higher is safer)
  let score = 1.0;
  if (crisisIndicators) score -= 0.6;
  if (detectedTriggers.length > 0) score -= 0.3;
  if (flags.includes("inappropriate")) score -= 0.4;

  return {
    isApproved: score >= 0.7 && !crisisIndicators,
    score: Math.max(0, score),
    flags,
    crisisIndicators,
    crisisLevel: crisisIndicators ? crisisLevel : undefined,
    traumaTriggers: detectedTriggers.length > 0 ? detectedTriggers : undefined
  };
}

// === PEER MATCHING ALGORITHM ===
export interface MatchingCriteria {
  healingStage: string;
  topics: string[];
  supportType: string;
  timeZone: string;
  communicationStyle: string;
}

export function calculateMatchScore(profile1: MatchingCriteria, profile2: MatchingCriteria): number {
  let score = 0;

  // Healing stage compatibility (30 points)
  const stageCompatibility = getStageCompatibility(profile1.healingStage, profile2.healingStage);
  score += stageCompatibility * 30;

  // Shared topics (25 points)
  const sharedTopics = profile1.topics.filter(topic => profile2.topics.includes(topic));
  const topicScore = sharedTopics.length / Math.max(profile1.topics.length, profile2.topics.length);
  score += topicScore * 25;

  // Support type compatibility (20 points)
  const supportCompatibility = getSupportCompatibility(profile1.supportType, profile2.supportType);
  score += supportCompatibility * 20;

  // Time zone proximity (15 points)
  const timeZoneScore = getTimeZoneCompatibility(profile1.timeZone, profile2.timeZone);
  score += timeZoneScore * 15;

  // Communication style compatibility (10 points)
  const communicationScore = profile1.communicationStyle === profile2.communicationStyle ? 1 : 0.5;
  score += communicationScore * 10;

  return Math.round(score);
}

function getStageCompatibility(stage1: string, stage2: string): number {
  const stageOrder = ["beginning", "processing", "integrating", "thriving", "wisdom_sharing"];
  const index1 = stageOrder.indexOf(stage1);
  const index2 = stageOrder.indexOf(stage2);

  if (index1 === -1 || index2 === -1) return 0;

  const difference = Math.abs(index1 - index2);

  // Best matches are adjacent stages or mentorship (wisdom_sharing with earlier stages)
  if (difference === 0) return 1; // Same stage
  if (difference === 1) return 0.8; // Adjacent stages
  if (stage1 === "wisdom_sharing" || stage2 === "wisdom_sharing") return 0.9; // Mentorship potential
  if (difference === 2) return 0.5;
  return 0.2;
}

function getSupportCompatibility(type1: string, type2: string): number {
  if (type1 === "mutual_support" && type2 === "mutual_support") return 1;
  if ((type1 === "seeking_support" && type2 === "offering_support") ||
      (type1 === "offering_support" && type2 === "seeking_support")) return 0.9;
  if (type1 === type2) return 0.7;
  return 0.3;
}

function getTimeZoneCompatibility(tz1: string, tz2: string): number {
  // Simplified time zone compatibility
  if (tz1 === tz2) return 1;

  // This would be more sophisticated in production
  // For now, just check if they're in similar regions
  const region1 = tz1.split("/")[0];
  const region2 = tz2.split("/")[0];

  if (region1 === region2) return 0.7;
  return 0.3;
}

// === CONTENT FILTERING ===
export function applyTraumaInformedFilters(content: string): {
  needsWarning: boolean;
  warningType?: string;
  filteredContent: string;
} {
  const triggerWords = [
    "suicide", "self-harm", "cutting", "violence", "abuse",
    "rape", "assault", "death", "overdose"
  ];

  const contentLower = content.toLowerCase();
  const foundTriggers = triggerWords.filter(word => contentLower.includes(word));

  if (foundTriggers.length > 0) {
    return {
      needsWarning: true,
      warningType: "trauma_trigger",
      filteredContent: content // In production, might add content warnings
    };
  }

  return {
    needsWarning: false,
    filteredContent: content
  };
}

// === COMMUNITY HEALTH METRICS ===
export async function calculateCommunityHealthScore(): Promise<number> {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get recent activity metrics
    const [storiesSnapshot, circlesSnapshot, wisdomSnapshot, moderationSnapshot] = await Promise.all([
      db.collection("communityStories")
        .where("createdAt", ">=", weekAgo)
        .where("contentModerationStatus", "==", "approved")
        .get(),
      db.collection("healingCircles")
        .where("isActive", "==", true)
        .where("lastActivityAt", ">=", weekAgo)
        .get(),
      db.collection("communityWisdom")
        .where("createdAt", ">=", weekAgo)
        .get(),
      db.collection("communityModerationLogs")
        .where("timestamp", ">=", weekAgo)
        .get()
    ]);

    const totalContent = storiesSnapshot.size + circlesSnapshot.size + wisdomSnapshot.size;
    const moderationActions = moderationSnapshot.size;

    // Calculate health score (0-100)
    let healthScore = 80; // Base score

    // Boost for active content
    if (totalContent > 50) healthScore += 10;
    else if (totalContent > 20) healthScore += 5;

    // Penalty for high moderation activity (indicates problems)
    const moderationRate = moderationActions / Math.max(totalContent, 1);
    if (moderationRate > 0.1) healthScore -= 20;
    else if (moderationRate > 0.05) healthScore -= 10;

    return Math.max(0, Math.min(100, healthScore));
  } catch (error) {
    console.error("Error calculating community health score:", error);
    return 50; // Default neutral score
  }
}

// === CRISIS ESCALATION ===
export async function escalateCrisisAlert(userId: string, contentId: string, severity: "low" | "medium" | "high" | "critical"): Promise<void> {
  try {
    // Create immediate crisis alert
    await db.collection("crisisAlerts").add({
      userId,
      contentId,
      severity,
      status: "active",
      createdAt: new Date(),
      escalatedAt: new Date(),
      requiresImmediate: severity === "high" || severity === "critical"
    });

    // If high or critical severity, trigger immediate notifications
    if (severity === "high" || severity === "critical") {
      // This would integrate with your notification system
      // For now, just log it
      console.log(`${severity.toUpperCase()} SEVERITY CRISIS ALERT: User ${userId}, Content ${contentId}`);
    }
  } catch (error) {
    console.error("Error escalating crisis alert:", error);
  }
}

// === ANONYMOUS ID VALIDATION ===
export function validateAnonymousId(anonymousId: string): boolean {
  // Basic validation - should be 16 character hex string
  return /^[a-f0-9]{16}$/.test(anonymousId);
}

// === RATE LIMITING ===
export async function checkRateLimit(userId: string, action: string, windowMinutes: number = 60, maxActions: number = 10): Promise<boolean> {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);

    const actionsSnapshot = await db.collection("userActions")
      .where("userId", "==", userId)
      .where("action", "==", action)
      .where("timestamp", ">=", windowStart)
      .get();

    if (actionsSnapshot.size >= maxActions) {
      return false; // Rate limit exceeded
    }

    // Log this action
    await db.collection("userActions").add({
      userId,
      action,
      timestamp: now
    });

    return true;
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return true; // Allow action on error to avoid blocking users
  }
}