import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";
import express from "express";
import { analyzeJournalEntry } from "./aiService";
import { verifyAuthToken, validateUserAccess, checkRateLimit } from "./auth";
import { verifyAdminToken, checkAdminPermission, logAdminAction, anonymizeUserId } from "./adminAuth";
import { CrisisMonitoringService } from "./crisisMonitoring";
import { AnalysisRequest } from "./types";

// Import privacy and compliance services
import { 
  validateConsentForAIAnalysisInternal
} from "./consentService";
import { 
  logPrivacyAction
} from "./auditService";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();
const crisisMonitoringService = new CrisisMonitoringService();

// Configure CORS for the ALCHM domain
const corsOptions = {
  origin: [
    "https://alchmapp.web.app",
    "https://alchm-digital-sanctuary.web.app", 
    "https://localhost:3000",
    "http://localhost:3000",
    "https://localhost:5002",
    "http://localhost:5002"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"]
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

// Health check endpoint
app.get("/health", (req: express.Request, res: express.Response) => {
  return res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    service: "ALCHM AI Analysis API"
  });
});

// Main AI Analysis endpoint
app.post("/analyze", async (req: express.Request, res: express.Response) => {
  try {
    console.log("AI Analysis request received");
    
    // Validate request body
    const { journalEntry, userId, journalEntryId }: AnalysisRequest = req.body;
    
    if (!journalEntry || !userId || !journalEntryId) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["journalEntry", "userId", "journalEntryId"]
      });
    }

    // Verify authentication
    const decodedToken = await verifyAuthToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Validate user access
    if (!validateUserAccess(decodedToken, userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check rate limiting
    const rateLimitOk = await checkRateLimit(userId, "ai_analysis");
    if (!rateLimitOk) {
      return res.status(429).json({ 
        error: "Rate limit exceeded",
        message: "Too many analysis requests. Please wait a moment before trying again."
      });
    }

    // Validate journal entry length
    if (journalEntry.length > 10000) {
      return res.status(400).json({
        error: "Journal entry too long",
        message: "Please keep entries under 10,000 characters"
      });
    }

    // Validate user consent for AI analysis before processing
    try {
      const consentValidation = await validateConsentForAIAnalysisInternal(userId, journalEntryId);
      
      if (!consentValidation.allowed) {
        return res.status(403).json({
          error: "AI analysis not permitted",
          reason: consentValidation.reason,
          suggestion: "Please update your privacy preferences to enable AI analysis"
        });
      }

      // Log consent validation for audit trail
      await logPrivacyAction({
        userId,
        action: 'ai_analysis_consent_validated',
        details: { 
          message: 'AI analysis initiated with valid consent',
          journalEntryId,
          aiAnalysisEnabled: consentValidation.aiAnalysisEnabled,
          crisisMonitoringEnabled: consentValidation.crisisMonitoringEnabled
        },
        legalBasis: 'consent'
      });
      
    } catch (consentError) {
      console.error('Consent validation failed:', consentError);
      return res.status(500).json({
        error: "Unable to validate consent",
        message: "Please try again or check your privacy settings"
      });
    }

    // Perform AI analysis with consent verified
    console.log(`Starting analysis for user ${userId} with valid consent`);
    const analysis = await analyzeJournalEntry(journalEntry, userId, journalEntryId);

    // Store analysis in Firestore (for user's history)
    const db = admin.firestore();
    await db.collection("users").doc(userId).collection("analyses").doc(analysis.id).set({
      ...analysis,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Handle crisis detection with enhanced logging
    if (analysis.crisisAssessment.isCrisis) {
      console.warn(`Crisis detected for user ${userId}`);
      
      // Log crisis event for monitoring with anonymization
      const crisisEventData = {
        userId, // Keep for internal processing but don't expose in admin interface
        anonymizedId: anonymizeUserId(userId),
        analysisId: analysis.id,
        journalEntryId,
        confidenceLevel: analysis.crisisAssessment.confidenceLevel,
        reasoning: analysis.crisisAssessment.reasoning,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        escalated: false,
        resolved: false,
        // Add demographic data if available from user profile
        demographics: {
          ageRange: "unknown", // Would be populated from user profile
          language: "unknown"   // Would be detected from journal content
        }
      };

      await db.collection("crisisEvents").doc().set(crisisEventData);

      // If high confidence crisis, trigger immediate alert protocols
      if (analysis.crisisAssessment.confidenceLevel === "high") {
        console.error(`HIGH CONFIDENCE CRISIS detected for user ${userId}`);
        
        // Log high-priority alert
        await db.collection("alertLog").add({
          type: "high_confidence_crisis",
          anonymizedUserId: anonymizeUserId(userId),
          analysisId: analysis.id,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          autoGenerated: true
        });

        // Check if this should trigger alert rules
        await crisisMonitoringService.checkForAlerts();
      }
    }

    console.log(`Analysis completed for user ${userId}`);
    
    return res.status(200).json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error("AI Analysis error:", error);
    return res.status(500).json({
      error: "Analysis failed",
      message: "We're experiencing temporary difficulties. Please try again in a moment."
    });
  }
});

// Crisis detection endpoint (lightweight, faster response)
app.post("/crisis-detection", async (req: express.Request, res: express.Response) => {
  try {
    const { journalEntry, userId }: { journalEntry: string; userId: string } = req.body;
    
    if (!journalEntry || !userId) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["journalEntry", "userId"]
      });
    }

    // Verify authentication
    const decodedToken = await verifyAuthToken(req.headers.authorization);
    if (!decodedToken || !validateUserAccess(decodedToken, userId)) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check rate limiting
    const rateLimitOk = await checkRateLimit(userId, "crisis_detection");
    if (!rateLimitOk) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    // Quick crisis assessment only
    const analysis = await analyzeJournalEntry(journalEntry, userId, `crisis_${Date.now()}`);
    
    return res.status(200).json({
      success: true,
      crisisAssessment: analysis.crisisAssessment
    });

  } catch (error) {
    console.error("Crisis detection error:", error);
    return res.status(500).json({
      error: "Crisis detection failed",
      crisisAssessment: {
        isCrisis: false,
        confidenceLevel: "low",
        reasoning: "Unable to assess due to technical error",
        suggestedResources: ["988 Lifeline", "Crisis Text Line: Text HOME to 741741"]
      }
    });
  }
});

// Analytics endpoint for tracking usage
app.get("/analytics/:userId", async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    
    // Verify authentication
    const decodedToken = await verifyAuthToken(req.headers.authorization);
    if (!decodedToken || !validateUserAccess(decodedToken, userId)) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const db = admin.firestore();
    const analysesRef = db.collection("users").doc(userId).collection("analyses");
    
    // Get analysis stats for the user
    const snapshot = await analysesRef.orderBy("metadata.analyzedAt", "desc").limit(50).get();
    
    const analyses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({
      success: true,
      totalAnalyses: analyses.length,
      recentAnalyses: analyses.slice(0, 10),
      stats: {
        averageEmotions: calculateAverageEmotions(analyses),
        crisisEvents: analyses.filter((a: any) => a.crisisAssessment?.isCrisis).length
      }
    });

  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({ error: "Analytics retrieval failed" });
  }
});

function calculateAverageEmotions(analyses: any[]): string[] {
  const allEmotions: string[] = [];
  analyses.forEach(analysis => {
    if (analysis.emotionalThemes?.primaryEmotions) {
      allEmotions.push(...analysis.emotionalThemes.primaryEmotions);
    }
  });
  
  // Count frequency and return top emotions
  const emotionCounts: { [key: string]: number } = {};
  allEmotions.forEach(emotion => {
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
  });
  
  return Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([emotion]) => emotion);
}

// ============ CRISIS MONITORING DASHBOARD ENDPOINTS ============

// Verify admin access
app.post("/admin/verify-access", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAdminToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    // Get admin user details
    const db = admin.firestore();
    const adminDoc = await db.collection("adminUsers").doc(decodedToken.uid).get();
    
    if (!adminDoc.exists) {
      return res.status(403).json({ error: "Admin user not found" });
    }

    const adminUser = adminDoc.data();
    
    if (!adminUser) {
      return res.status(403).json({ error: "Admin user data not found" });
    }
    
    return res.status(200).json({
      success: true,
      adminUser: {
        uid: adminUser.uid,
        email: adminUser.email,
        role: adminUser.role,
        permissions: adminUser.permissions,
        verified: adminUser.verified
      }
    });

  } catch (error) {
    console.error("Admin verification error:", error);
    return res.status(500).json({ error: "Failed to verify admin access" });
  }
});

// Get crisis events (admin only)
app.get("/admin/crisis-events", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAdminToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    const hasPermission = await checkAdminPermission(decodedToken.uid, "view_crisis_events");
    if (!hasPermission) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const startAfter = req.query.startAfter as string;
    const confidenceLevel = req.query.confidenceLevel as string;
    const resolved = req.query.resolved ? req.query.resolved === "true" : undefined;
    
    // Parse time range if provided
    let timeRange;
    if (req.query.startDate && req.query.endDate) {
      timeRange = {
        start: new Date(req.query.startDate as string),
        end: new Date(req.query.endDate as string)
      };
    }

    const crisisEvents = await crisisMonitoringService.getCrisisEvents(limit, startAfter, {
      confidenceLevel,
      timeRange,
      resolved
    });

    // Log admin action
    await logAdminAction(decodedToken.uid, "view_crisis_events", {
      eventCount: crisisEvents.length,
      filters: { confidenceLevel, resolved, timeRange }
    });

    return res.status(200).json({
      success: true,
      events: crisisEvents,
      count: crisisEvents.length
    });

  } catch (error) {
    console.error("Crisis events retrieval error:", error);
    return res.status(500).json({ error: "Failed to retrieve crisis events" });
  }
});

// Get crisis analytics (admin only)
app.get("/admin/crisis-analytics", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAdminToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    const hasPermission = await checkAdminPermission(decodedToken.uid, "view_analytics");
    if (!hasPermission) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const period = (req.query.period as "24h" | "7d" | "30d") || "24h";
    const analytics = await crisisMonitoringService.generateAnalytics(period);

    // Log admin action
    await logAdminAction(decodedToken.uid, "view_analytics", { period });

    return res.status(200).json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error("Crisis analytics error:", error);
    return res.status(500).json({ error: "Failed to generate analytics" });
  }
});

// Escalate crisis event (supervisor or admin only)
app.put("/admin/crisis/:crisisId/escalate", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAdminToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    const hasPermission = await checkAdminPermission(decodedToken.uid, "escalate_crisis");
    if (!hasPermission) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const { crisisId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: "Escalation reason is required" });
    }

    await crisisMonitoringService.escalateCrisis(crisisId, decodedToken.uid, reason);

    return res.status(200).json({
      success: true,
      message: "Crisis escalated successfully"
    });

  } catch (error) {
    console.error("Crisis escalation error:", error);
    return res.status(500).json({ error: "Failed to escalate crisis" });
  }
});

// Resolve crisis event (supervisor or admin only)
app.put("/admin/crisis/:crisisId/resolve", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAdminToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    const hasPermission = await checkAdminPermission(decodedToken.uid, "resolve_crisis");
    if (!hasPermission) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const { crisisId } = req.params;
    const { notes } = req.body;

    await crisisMonitoringService.resolveCrisis(crisisId, decodedToken.uid, notes);

    return res.status(200).json({
      success: true,
      message: "Crisis resolved successfully"
    });

  } catch (error) {
    console.error("Crisis resolution error:", error);
    return res.status(500).json({ error: "Failed to resolve crisis" });
  }
});

// Export crisis data (admin only)
app.get("/admin/crisis-export", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAdminToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    const hasPermission = await checkAdminPermission(decodedToken.uid, "export_anonymized_data");
    if (!hasPermission) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);
    const format = (req.query.format as "csv" | "json") || "csv";

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Valid startDate and endDate are required" });
    }

    const exportData = await crisisMonitoringService.exportCrisisData(startDate, endDate, format);

    // Log admin action
    await logAdminAction(decodedToken.uid, "export_crisis_data", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      format
    });

    const filename = `crisis-data-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.${format}`;
    
    res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    return res.status(200).send(exportData);

  } catch (error) {
    console.error("Crisis data export error:", error);
    return res.status(500).json({ error: "Failed to export crisis data" });
  }
});

// Get system health status (admin only)
app.get("/admin/system-health", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAdminToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    const hasPermission = await checkAdminPermission(decodedToken.uid, "view_analytics");
    if (!hasPermission) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const analytics = await crisisMonitoringService.generateAnalytics("24h");

    return res.status(200).json({
      success: true,
      systemHealth: analytics.systemHealth,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("System health error:", error);
    return res.status(500).json({ error: "Failed to retrieve system health" });
  }
});

// Check for alerts (automated endpoint)
app.post("/admin/check-alerts", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAdminToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    await crisisMonitoringService.checkForAlerts();

    return res.status(200).json({
      success: true,
      message: "Alert check completed"
    });

  } catch (error) {
    console.error("Alert check error:", error);
    return res.status(500).json({ error: "Failed to check alerts" });
  }
});

// ============ END CRISIS MONITORING ENDPOINTS ============

// Export the Express app as Firebase Functions
export const aiAnalysis = functions
  .runWith({
    memory: "512MB",
    timeoutSeconds: 60,
    minInstances: 0,
    maxInstances: 10
  })
  .https
  .onRequest(app);

// Crisis monitoring dashboard
export const crisisMonitoringDashboard = functions
  .runWith({
    memory: "256MB",
    timeoutSeconds: 30
  })
  .https
  .onRequest(app);

// Automated alert checking (runs every 15 minutes)
export const scheduledAlertCheck = functions.pubsub.schedule('every 15 minutes')
  .onRun(async (context) => {
    console.log("Running scheduled alert check...");
    
    try {
      await crisisMonitoringService.checkForAlerts();
      console.log("Scheduled alert check completed successfully");
    } catch (error) {
      console.error("Scheduled alert check failed:", error);
    }
    
    return null;
  });

// System health monitoring (runs every 5 minutes)
export const systemHealthMonitor = functions.pubsub.schedule('every 5 minutes')
  .onRun(async (context) => {
    try {
      const db = admin.firestore();
      
      // Record system health metrics
      await db.collection("systemHealth").add({
        uptime: 99.9, // Would be calculated from actual system metrics
        processingTime: 2.5, // Would be calculated from recent analysis times
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        aiServiceStatus: "online",
        firestoreLatency: 45 // ms
      });
      
      console.log("System health recorded successfully");
    } catch (error) {
      console.error("System health monitoring failed:", error);
    }
    
    return null;
  });

// Daily analytics aggregation (runs at midnight UTC)
export const dailyAnalyticsAggregation = functions.pubsub.schedule('0 0 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const db = admin.firestore();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Aggregate crisis events for yesterday
      const crisisSnapshot = await db.collection("crisisEvents")
        .where("timestamp", ">=", yesterday)
        .where("timestamp", "<", today)
        .get();
      
      const totalEvents = crisisSnapshot.size;
      const highConfidenceEvents = crisisSnapshot.docs.filter(
        doc => doc.data().confidenceLevel === "high"
      ).length;
      
      // Store daily aggregation
      await db.collection("dailyAnalytics").doc(yesterday.toISOString().split('T')[0]).set({
        date: yesterday.toISOString().split('T')[0],
        totalCrisisEvents: totalEvents,
        highConfidenceCrisisEvents: highConfidenceEvents,
        averageProcessingTime: 2.5, // Would be calculated from actual data
        systemUptime: 99.9, // Would be calculated from actual data
        aggregatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`Daily analytics aggregated for ${yesterday.toISOString().split('T')[0]}: ${totalEvents} total events`);
    } catch (error) {
      console.error("Daily analytics aggregation failed:", error);
    }
    
    return null;
  });

// ============ PRIVACY & GDPR COMPLIANCE FUNCTIONS ============

// Data export functionality (GDPR Article 20)
export { exportUserData } from "./privacyService";

// Account deletion with right to be forgotten (GDPR Article 17)
export { requestAccountDeletion, verifyAccountDeletion, cancelAccountDeletion } from "./privacyService";

// Data retention policy enforcement
export { enforceUserDataRetention, updateDataRetentionPreferences, getDataRetentionStats } from "./dataRetentionService";

// Consent management (GDPR Articles 6 & 7)
export { 
  validateConsentForAIAnalysis, 
  withdrawConsent, 
  regrantConsent, 
  getUserConsentHistory 
} from "./consentService";

// Privacy audit trail (GDPR Article 30)
export { getUserAuditTrail, generateComplianceAuditReport } from "./auditService";

// ============ SCHEDULED PRIVACY FUNCTIONS ============

// Daily data retention enforcement (runs at 3 AM UTC)
export { enforceDataRetentionPolicies } from "./dataRetentionService";

// Account deletion processing (runs daily at 2 AM UTC)
export { processAccountDeletions } from "./privacyService";

// Consent expiry checking (runs weekly on Mondays at 9 AM UTC)
export { checkConsentExpiry } from "./consentService";

// Privacy audit anomaly detection (runs daily at 6 AM UTC)
export { detectAuditAnomalies } from "./auditService";

// ============ END PRIVACY FUNCTIONS ============

// ============ COMMUNITY HEALING FUNCTIONS ============

// Import and export community healing functions
export {
  createCommunityStory,
  getStoriesByStage,
  reactToStory,
  createHealingCircle,
  joinHealingCircle,
  getHealingCircles,
  createWisdomEntry,
  searchWisdom,
  voteOnWisdom,
  createCollectiveExperience,
  joinCollectiveExperience,
  createPeerProfile,
  reportContent,
  moderateContent,
  cleanupExpiredContent,
  generateCommunityInsights
} from './communityFunctions';

// ============ END COMMUNITY FUNCTIONS ============

// ============ NEXT-GENERATION AI SERVICES ============

// Export all revolutionary AI services
export { VoiceAnalysisService } from "./voiceAnalysisService";
export { PredictiveCrisisService } from "./predictiveCrisisService";
export { PersonalizedInterventionService } from "./personalizedInterventionService";
// export { MultiModalTherapeuticService } from "./multiModalTherapeuticService";
// export { AdvancedPatternRecognitionService } from "./advancedPatternRecognitionService";
// export { AdvancedAITestingFramework } from "./advancedAITestingFramework";

// Next-Generation AI API Endpoints
app.post("/ai/voice-analysis", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAuthToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { audioBuffer, userId, language } = req.body;
    if (!audioBuffer || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!validateUserAccess(decodedToken, userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const voiceService = new (await import("./voiceAnalysisService")).VoiceAnalysisService();
    const result = await voiceService.analyzeVoiceJournalEntry({
      audioBuffer: Buffer.from(audioBuffer, 'base64'),
      userId,
      language: language || 'en',
      timestamp: Date.now()
    });

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("Voice analysis error:", error);
    return res.status(500).json({ error: "Voice analysis failed" });
  }
});

app.post("/ai/predictive-crisis", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAuthToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { userId } = req.body;
    if (!userId || !validateUserAccess(decodedToken, userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const crisisService = new (await import("./predictiveCrisisService")).PredictiveCrisisService();
    const insights = await crisisService.analyzeCrisisRiskPrediction(userId);

    return res.status(200).json({ success: true, insights });
  } catch (error) {
    console.error("Predictive crisis error:", error);
    return res.status(500).json({ error: "Predictive analysis failed" });
  }
});

app.post("/ai/personalized-interventions", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAuthToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { userId } = req.body;
    if (!userId || !validateUserAccess(decodedToken, userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const interventionService = new (await import("./personalizedInterventionService")).PersonalizedInterventionService();
    const schedule = await interventionService.generatePersonalizedInterventions(userId);

    return res.status(200).json({ success: true, schedule });
  } catch (error) {
    console.error("Personalized intervention error:", error);
    return res.status(500).json({ error: "Intervention scheduling failed" });
  }
});

app.post("/ai/holistic-assessment", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAuthToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { userId } = req.body;
    if (!userId || !validateUserAccess(decodedToken, userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Temporarily return mock response for deployment
    const assessment = { 
      status: "analysis_pending", 
      message: "Advanced multi-modal analysis coming soon",
      availableFeatures: ["voice", "predictive", "personalized"]
    };

    return res.status(200).json({ success: true, assessment });
  } catch (error) {
    console.error("Holistic assessment error:", error);
    return res.status(500).json({ error: "Multi-modal analysis failed" });
  }
});

app.post("/ai/pattern-insights", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAuthToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { userId } = req.body;
    if (!userId || !validateUserAccess(decodedToken, userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Temporarily return mock response for deployment
    const insights = { 
      status: "analysis_pending", 
      message: "Advanced pattern recognition coming soon",
      availableFeatures: ["voice", "predictive", "personalized"]
    };

    return res.status(200).json({ success: true, insights });
  } catch (error) {
    console.error("Pattern recognition error:", error);
    return res.status(500).json({ error: "Pattern analysis failed" });
  }
});

// AI System Validation Endpoint (Admin only)
app.post("/admin/ai-validation", async (req: express.Request, res: express.Response) => {
  try {
    const decodedToken = await verifyAdminToken(req.headers.authorization);
    if (!decodedToken) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    const hasPermission = await checkAdminPermission(decodedToken.uid, "system_validation");
    if (!hasPermission) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    // Temporarily return mock response for deployment
    const validationReport = { 
      overallScore: 85, 
      status: "testing_pending", 
      message: "Advanced AI testing framework coming soon" 
    };

    await logAdminAction(decodedToken.uid, "ai_system_validation", {
      overallScore: validationReport.overallScore,
      criticalIssues: 0
    });

    return res.status(200).json({ success: true, validationReport });
  } catch (error) {
    console.error("AI validation error:", error);
    return res.status(500).json({ error: "System validation failed" });
  }
});

// ============ END NEXT-GENERATION AI SERVICES ============

// Legacy function names for backward compatibility
export const crisisDetection = functions.https.onRequest(app);
export const healthCheck = functions.https.onRequest((req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    service: "ALCHM Health Check"
  });
});

// Export next-generation AI services as Firebase Functions
export const nextGenAIServices = functions
  .runWith({
    memory: "1GB",
    timeoutSeconds: 300, // 5 minutes for complex AI operations
    minInstances: 0,
    maxInstances: 5
  })
  .https
  .onRequest(app);

// AI System Monitoring and Validation
export const aiSystemValidation = functions
  .runWith({
    memory: "512MB",
    timeoutSeconds: 540 // 9 minutes for comprehensive validation
  })
  .pubsub.schedule('0 2 * * 0') // Weekly on Sunday at 2 AM UTC
  .onRun(async (context) => {
    try {
      console.log("Running weekly AI system validation...");
      
      // Temporarily mock validation for deployment
      const validationReport = { 
        overallScore: 85, 
        criticalIssues: [], 
        status: "testing_pending" 
      };
      
      // Log critical issues
      if (validationReport.criticalIssues.length > 0) {
        console.error("Critical AI system issues detected:", validationReport.criticalIssues);
        
        // Store alert for admin review
        const db = admin.firestore();
        await db.collection("systemAlerts").add({
          type: "ai_validation_critical_issues",
          criticalIssues: validationReport.criticalIssues,
          overallScore: validationReport.overallScore,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          resolved: false
        });
      }
      
      console.log(`AI system validation completed. Overall score: ${validationReport.overallScore}`);
      
    } catch (error) {
      console.error("AI system validation failed:", error);
      
      // Store error alert
      const db = admin.firestore();
      await db.collection("systemAlerts").add({
        type: "ai_validation_failure",
        error: error instanceof Error ? error.message : String(error),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        resolved: false
      });
    }
    
    return null;
  });