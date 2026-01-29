"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrisisMonitoringService = void 0;
const admin = __importStar(require("firebase-admin"));
const adminAuth_1 = require("./adminAuth");
class CrisisMonitoringService {
    constructor() {
        this.db = admin.firestore();
    }
    // Real-time crisis event retrieval with privacy protection
    async getCrisisEvents(limit = 50, startAfter, filters) {
        try {
            let query = this.db.collection("crisisEvents")
                .orderBy("timestamp", "desc");
            // Apply filters
            if (filters === null || filters === void 0 ? void 0 : filters.confidenceLevel) {
                query = query.where("confidenceLevel", "==", filters.confidenceLevel);
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.resolved) !== undefined) {
                query = query.where("resolved", "==", filters.resolved);
            }
            if (filters === null || filters === void 0 ? void 0 : filters.timeRange) {
                query = query
                    .where("timestamp", ">=", filters.timeRange.start)
                    .where("timestamp", "<=", filters.timeRange.end);
            }
            if (startAfter) {
                const startDoc = await this.db.collection("crisisEvents").doc(startAfter).get();
                if (startDoc.exists) {
                    query = query.startAfter(startDoc);
                }
            }
            const snapshot = await query.limit(limit).get();
            return snapshot.docs.map(doc => {
                var _a;
                const data = doc.data();
                return (0, adminAuth_1.sanitizeCrisisData)(Object.assign(Object.assign({ id: doc.id, userId: data.userId }, data), { timestamp: ((_a = data.timestamp) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date() }));
            });
        }
        catch (error) {
            console.error("Error fetching crisis events:", error);
            throw new Error("Failed to retrieve crisis events");
        }
    }
    // Generate comprehensive analytics
    async generateAnalytics(period = "24h") {
        try {
            const now = new Date();
            let startDate;
            switch (period) {
                case "24h":
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case "7d":
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case "30d":
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            }
            // Fetch crisis events for the period
            const crisisSnapshot = await this.db.collection("crisisEvents")
                .where("timestamp", ">=", startDate)
                .where("timestamp", "<=", now)
                .get();
            const crisisEvents = crisisSnapshot.docs.map(doc => {
                var _a;
                const data = doc.data();
                return Object.assign(Object.assign({ id: doc.id }, data), { timestamp: ((_a = data.timestamp) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date() });
            });
            // Calculate basic metrics
            const totalCrises = crisisEvents.length;
            const highConfidenceCrises = crisisEvents.filter((event) => event.confidenceLevel === "high").length;
            // Generate daily trend data
            const dailyTrends = this.generateDailyTrends(crisisEvents, startDate, now);
            // Confidence level distribution
            const confidenceTrends = this.generateConfidenceTrends(crisisEvents);
            // System health metrics
            const systemHealth = await this.calculateSystemHealth(startDate, now);
            return {
                period,
                totalCrises,
                highConfidenceCrises,
                averageResponseTime: await this.calculateAverageResponseTime(crisisEvents),
                trends: {
                    daily: dailyTrends,
                    byConfidence: confidenceTrends,
                    byDemographics: [] // Populated if demographic data is available
                },
                systemHealth
            };
        }
        catch (error) {
            console.error("Error generating analytics:", error);
            throw new Error("Failed to generate crisis analytics");
        }
    }
    // Monitor for crisis spikes and trigger alerts
    async checkForAlerts() {
        try {
            const alertRules = await this.getActiveAlertRules();
            for (const rule of alertRules) {
                const shouldTrigger = await this.evaluateAlertRule(rule);
                if (shouldTrigger) {
                    await this.triggerAlert(rule);
                }
            }
        }
        catch (error) {
            console.error("Error checking alerts:", error);
        }
    }
    // Escalate a crisis event
    async escalateCrisis(crisisId, adminUid, reason) {
        try {
            await this.db.collection("crisisEvents").doc(crisisId).update({
                escalated: true,
                escalatedAt: admin.firestore.FieldValue.serverTimestamp(),
                escalatedBy: adminUid,
                escalationReason: reason
            });
            // Log admin action
            await (0, adminAuth_1.logAdminAction)(adminUid, "crisis_escalated", {
                crisisId,
                reason
            });
            console.log(`Crisis ${crisisId} escalated by admin ${adminUid}`);
        }
        catch (error) {
            console.error("Error escalating crisis:", error);
            throw new Error("Failed to escalate crisis");
        }
    }
    // Resolve a crisis event
    async resolveCrisis(crisisId, adminUid, notes) {
        try {
            await this.db.collection("crisisEvents").doc(crisisId).update({
                resolved: true,
                resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
                resolvedBy: adminUid,
                resolutionNotes: notes
            });
            // Log admin action
            await (0, adminAuth_1.logAdminAction)(adminUid, "crisis_resolved", {
                crisisId,
                notes
            });
            console.log(`Crisis ${crisisId} resolved by admin ${adminUid}`);
        }
        catch (error) {
            console.error("Error resolving crisis:", error);
            throw new Error("Failed to resolve crisis");
        }
    }
    // Export anonymized data for reporting
    async exportCrisisData(startDate, endDate, format = "csv") {
        try {
            const crisisEvents = await this.getCrisisEvents(1000, undefined, {
                timeRange: { start: startDate, end: endDate }
            });
            if (format === "json") {
                return JSON.stringify(crisisEvents, null, 2);
            }
            // Convert to CSV
            const csvHeaders = [
                "anonymizedId",
                "confidenceLevel",
                "timestamp",
                "escalated",
                "resolved",
                "location",
                "ageRange",
                "language"
            ];
            const csvRows = crisisEvents.map(event => {
                var _a, _b, _c;
                return [
                    event.anonymizedId,
                    event.confidenceLevel,
                    event.timestamp.toISOString(),
                    event.escalated,
                    event.resolved || false,
                    ((_a = event.location) === null || _a === void 0 ? void 0 : _a.country) || "",
                    ((_b = event.demographics) === null || _b === void 0 ? void 0 : _b.ageRange) || "",
                    ((_c = event.demographics) === null || _c === void 0 ? void 0 : _c.language) || ""
                ];
            });
            return [csvHeaders.join(","), ...csvRows.map(row => row.join(","))].join("\n");
        }
        catch (error) {
            console.error("Error exporting crisis data:", error);
            throw new Error("Failed to export crisis data");
        }
    }
    // Private helper methods
    generateDailyTrends(crisisEvents, startDate, endDate) {
        const trends = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayStart = new Date(currentDate);
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);
            const dayCount = crisisEvents.filter(event => event.timestamp >= dayStart && event.timestamp <= dayEnd).length;
            trends.push({ date: dateStr, count: dayCount });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return trends;
    }
    generateConfidenceTrends(crisisEvents) {
        const levels = ["low", "medium", "high"];
        return levels.map(level => ({
            level,
            count: crisisEvents.filter(event => event.confidenceLevel === level).length
        }));
    }
    async calculateSystemHealth(startDate, endDate) {
        try {
            // Check AI service health from logs
            const healthSnapshot = await this.db.collection("systemHealth")
                .where("timestamp", ">=", startDate)
                .where("timestamp", "<=", endDate)
                .get();
            if (healthSnapshot.empty) {
                return { aiUptime: 99.9, averageProcessingTime: 2.5 };
            }
            const healthData = healthSnapshot.docs.map(doc => doc.data());
            const averageUptime = healthData.reduce((acc, curr) => acc + (curr.uptime || 99.9), 0) / healthData.length;
            const averageProcessingTime = healthData.reduce((acc, curr) => acc + (curr.processingTime || 2.5), 0) / healthData.length;
            return {
                aiUptime: averageUptime,
                averageProcessingTime
            };
        }
        catch (error) {
            console.error("Error calculating system health:", error);
            return { aiUptime: 99.9, averageProcessingTime: 2.5 };
        }
    }
    async calculateAverageResponseTime(crisisEvents) {
        // Calculate average time from detection to resolution
        const resolvedEvents = crisisEvents.filter(event => event.resolved && event.resolvedAt);
        if (resolvedEvents.length === 0)
            return 0;
        const totalResponseTime = resolvedEvents.reduce((acc, event) => {
            const responseTime = (event.resolvedAt.toDate() - event.timestamp) / 1000 / 60; // minutes
            return acc + responseTime;
        }, 0);
        return totalResponseTime / resolvedEvents.length;
    }
    async getActiveAlertRules() {
        try {
            const snapshot = await this.db.collection("alertRules")
                .where("enabled", "==", true)
                .get();
            return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            console.error("Error fetching alert rules:", error);
            return [];
        }
    }
    async evaluateAlertRule(rule) {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        switch (rule.condition) {
            case "high_confidence_spike":
                const highConfidenceCount = await this.db.collection("crisisEvents")
                    .where("confidenceLevel", "==", "high")
                    .where("timestamp", ">=", oneHourAgo)
                    .get();
                return highConfidenceCount.size > rule.threshold;
            case "response_time_threshold":
                const unresolved = await this.db.collection("crisisEvents")
                    .where("resolved", "==", false)
                    .where("timestamp", "<=", new Date(now.getTime() - rule.threshold * 60 * 1000))
                    .get();
                return !unresolved.empty;
            default:
                return false;
        }
    }
    async triggerAlert(rule) {
        try {
            // Update last triggered time
            await this.db.collection("alertRules").doc(rule.id).update({
                lastTriggered: admin.firestore.FieldValue.serverTimestamp()
            });
            // Log alert trigger
            await this.db.collection("alertLog").add({
                ruleId: rule.id,
                ruleName: rule.name,
                condition: rule.condition,
                threshold: rule.threshold,
                triggeredAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.warn(`Alert triggered: ${rule.name} (${rule.condition})`);
            // In production, send notifications to recipients
            // This could integrate with email, SMS, or Slack
        }
        catch (error) {
            console.error("Error triggering alert:", error);
        }
    }
}
exports.CrisisMonitoringService = CrisisMonitoringService;
//# sourceMappingURL=crisisMonitoring.js.map