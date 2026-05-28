import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

interface ScalingMetrics {
  activeUsers24h: number;
  apiRequestsPerHour: number;
  averageResponseTime: number;
  errorRate: number;
  databaseReadsPerHour: number;
  databaseWritesPerHour: number;
  totalCostToday: number;
}

interface ScalingThresholds {
  activeUsersWarning: number;
  activeUsersCritical: number;
  apiRequestsWarning: number;
  apiRequestsCritical: number;
  responseTimeWarning: number;
  responseTimeCritical: number;
  errorRateWarning: number;
  errorRateCritical: number;
  costWarning: number;
  costCritical: number;
}

const SCALING_THRESHOLDS: ScalingThresholds = {
  activeUsersWarning: 500,    // 500 active users in 24h
  activeUsersCritical: 1000,  // 1000 active users in 24h
  apiRequestsWarning: 10000,  // 10k API requests per hour
  apiRequestsCritical: 20000, // 20k API requests per hour
  responseTimeWarning: 2000,  // 2 seconds average response
  responseTimeCritical: 5000, // 5 seconds average response
  errorRateWarning: 0.05,     // 5% error rate
  errorRateCritical: 0.10,    // 10% error rate
  costWarning: 25,            // $25/day
  costCritical: 50,           // $50/day
};

// Monitor system metrics every 15 minutes
export const monitorScalingMetrics = onSchedule(
  "every 15 minutes",
  async () => {
    try {
      logger.info("Starting scaling metrics monitoring...");
      
      const metrics = await collectSystemMetrics();
      const alerts = analyzeMetrics(metrics);
      
      if (alerts.length > 0) {
        await processScalingAlerts(alerts, metrics);
      }
      
      // Store metrics for historical analysis
      await storeMetrics(metrics);
      
      logger.info("Scaling metrics monitoring completed", { metrics, alertsCount: alerts.length });
      
    } catch (error) {
      logger.error("Scaling metrics monitoring failed", error);
      
      // Store critical alert for failed monitoring
      await storeCriticalAlert("monitoring_failure", {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      });
    }
  }
);

async function collectSystemMetrics(): Promise<ScalingMetrics> {
  const db = getFirestore();
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
  const today = now.toISOString().split("T")[0];

  // Active users in last 24 hours
  const activeUsersSnapshot = await db
    .collection("dailyActiveUsers")
    .where("lastSeen", ">=", last24Hours)
    .get();

  const activeUsers24h = activeUsersSnapshot.size;

  // API requests in last hour (from function logs)
  const recentSessionsSnapshot = await db
    .collection("userSessions")
    .where("lastActivity", ">=", lastHour)
    .get();

  const apiRequestsPerHour = recentSessionsSnapshot.docs.reduce((total, doc) => {
    return total + (doc.data().events || 0);
  }, 0);

  // Database reads/writes from recent usage
  const recentUsageSnapshot = await db
    .collection("userUsage")
    .where("date", "==", today)
    .get();

  let databaseReadsPerHour = 0;
  let databaseWritesPerHour = 0;
  
  recentUsageSnapshot.forEach(doc => {
    const data = doc.data();
    databaseReadsPerHour += data.requestCount || 0;
    databaseWritesPerHour += Math.ceil((data.requestCount || 0) * 0.3); // Estimate writes
  });

  // Total cost today
  const costSummaryDoc = await db
    .collection("dailyCostSummary")
    .doc(today)
    .get();

  const totalCostToday = costSummaryDoc.exists ? 
    (costSummaryDoc.data()?.totalCostUSD || 0) : 0;

  // Error rate from recent system health
  const healthSnapshot = await db
    .collection("systemHealth")
    .where("timestamp", ">=", lastHour)
    .orderBy("timestamp", "desc")
    .limit(10)
    .get();

  let averageResponseTime = 0;
  let errorRate = 0;

  if (!healthSnapshot.empty) {
    const healthData = healthSnapshot.docs.map(doc => doc.data());
    averageResponseTime = healthData.reduce((sum, health) => 
      sum + (health.processingTime || 0), 0) / healthData.length;
    
    // Estimate error rate based on system health
    const healthyMetrics = healthData.filter(health => health.uptime > 99);
    errorRate = 1 - (healthyMetrics.length / healthData.length);
  }

  return {
    activeUsers24h,
    apiRequestsPerHour,
    averageResponseTime,
    errorRate,
    databaseReadsPerHour,
    databaseWritesPerHour,
    totalCostToday,
  };
}

function analyzeMetrics(metrics: ScalingMetrics): Array<{
  type: "warning" | "critical";
  metric: string;
  value: number;
  threshold: number;
  message: string;
}> {
  const alerts = [];

  // Active users alerts
  if (metrics.activeUsers24h >= SCALING_THRESHOLDS.activeUsersCritical) {
    alerts.push({
      type: "critical" as const,
      metric: "activeUsers24h",
      value: metrics.activeUsers24h,
      threshold: SCALING_THRESHOLDS.activeUsersCritical,
      message: `Critical: ${metrics.activeUsers24h} active users in 24h (threshold: ${SCALING_THRESHOLDS.activeUsersCritical})`,
    });
  } else if (metrics.activeUsers24h >= SCALING_THRESHOLDS.activeUsersWarning) {
    alerts.push({
      type: "warning" as const,
      metric: "activeUsers24h",
      value: metrics.activeUsers24h,
      threshold: SCALING_THRESHOLDS.activeUsersWarning,
      message: `Warning: ${metrics.activeUsers24h} active users in 24h (threshold: ${SCALING_THRESHOLDS.activeUsersWarning})`,
    });
  }

  // API requests alerts
  if (metrics.apiRequestsPerHour >= SCALING_THRESHOLDS.apiRequestsCritical) {
    alerts.push({
      type: "critical" as const,
      metric: "apiRequestsPerHour",
      value: metrics.apiRequestsPerHour,
      threshold: SCALING_THRESHOLDS.apiRequestsCritical,
      message: `Critical: ${metrics.apiRequestsPerHour} API requests/hour (threshold: ${SCALING_THRESHOLDS.apiRequestsCritical})`,
    });
  } else if (metrics.apiRequestsPerHour >= SCALING_THRESHOLDS.apiRequestsWarning) {
    alerts.push({
      type: "warning" as const,
      metric: "apiRequestsPerHour",
      value: metrics.apiRequestsPerHour,
      threshold: SCALING_THRESHOLDS.apiRequestsWarning,
      message: `Warning: ${metrics.apiRequestsPerHour} API requests/hour (threshold: ${SCALING_THRESHOLDS.apiRequestsWarning})`,
    });
  }

  // Response time alerts
  if (metrics.averageResponseTime >= SCALING_THRESHOLDS.responseTimeCritical) {
    alerts.push({
      type: "critical" as const,
      metric: "averageResponseTime",
      value: metrics.averageResponseTime,
      threshold: SCALING_THRESHOLDS.responseTimeCritical,
      message: `Critical: ${metrics.averageResponseTime}ms average response time (threshold: ${SCALING_THRESHOLDS.responseTimeCritical}ms)`,
    });
  } else if (metrics.averageResponseTime >= SCALING_THRESHOLDS.responseTimeWarning) {
    alerts.push({
      type: "warning" as const,
      metric: "averageResponseTime",
      value: metrics.averageResponseTime,
      threshold: SCALING_THRESHOLDS.responseTimeWarning,
      message: `Warning: ${metrics.averageResponseTime}ms average response time (threshold: ${SCALING_THRESHOLDS.responseTimeWarning}ms)`,
    });
  }

  // Error rate alerts
  if (metrics.errorRate >= SCALING_THRESHOLDS.errorRateCritical) {
    alerts.push({
      type: "critical" as const,
      metric: "errorRate",
      value: metrics.errorRate,
      threshold: SCALING_THRESHOLDS.errorRateCritical,
      message: `Critical: ${(metrics.errorRate * 100).toFixed(1)}% error rate (threshold: ${(SCALING_THRESHOLDS.errorRateCritical * 100).toFixed(1)}%)`,
    });
  } else if (metrics.errorRate >= SCALING_THRESHOLDS.errorRateWarning) {
    alerts.push({
      type: "warning" as const,
      metric: "errorRate",
      value: metrics.errorRate,
      threshold: SCALING_THRESHOLDS.errorRateWarning,
      message: `Warning: ${(metrics.errorRate * 100).toFixed(1)}% error rate (threshold: ${(SCALING_THRESHOLDS.errorRateWarning * 100).toFixed(1)}%)`,
    });
  }

  // Cost alerts
  if (metrics.totalCostToday >= SCALING_THRESHOLDS.costCritical) {
    alerts.push({
      type: "critical" as const,
      metric: "totalCostToday",
      value: metrics.totalCostToday,
      threshold: SCALING_THRESHOLDS.costCritical,
      message: `Critical: $${metrics.totalCostToday.toFixed(2)} spent today (threshold: $${SCALING_THRESHOLDS.costCritical})`,
    });
  } else if (metrics.totalCostToday >= SCALING_THRESHOLDS.costWarning) {
    alerts.push({
      type: "warning" as const,
      metric: "totalCostToday",
      value: metrics.totalCostToday,
      threshold: SCALING_THRESHOLDS.costWarning,
      message: `Warning: $${metrics.totalCostToday.toFixed(2)} spent today (threshold: $${SCALING_THRESHOLDS.costWarning})`,
    });
  }

  return alerts;
}

async function processScalingAlerts(alerts: any[], metrics: ScalingMetrics) {
  const db = getFirestore();
  
  // Store scaling alerts
  for (const alert of alerts) {
    await db.collection("scalingAlerts").add({
      ...alert,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      metrics,
      resolved: false,
    });
    
    // Log alert
    if (alert.type === "critical") {
      logger.error("Critical scaling alert", alert);
    } else {
      logger.warn("Scaling warning", alert);
    }
  }

  // Take automatic actions for critical alerts
  const criticalAlerts = alerts.filter(alert => alert.type === "critical");
  
  if (criticalAlerts.length > 0) {
    await handleCriticalScalingAlerts(criticalAlerts, metrics);
  }
}

async function handleCriticalScalingAlerts(criticalAlerts: any[], metrics: ScalingMetrics) {
  const db = getFirestore();
  
  try {
    // Enable emergency throttling
    await db.collection("systemConfig").doc("scaling").set({
      emergencyMode: true,
      throttlingEnabled: true,
      reducedCapacity: true,
      triggerAlerts: criticalAlerts.map(alert => alert.metric),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // Log emergency action
    logger.error("EMERGENCY: Scaling limits exceeded, emergency throttling enabled", {
      criticalAlerts,
      metrics,
    });

    // Store emergency event
    await db.collection("emergencyEvents").add({
      type: "scaling_emergency",
      severity: "critical",
      criticalAlerts,
      metrics,
      actionsToken: ["emergency_throttling_enabled", "reduced_capacity_mode"],
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

  } catch (error) {
    logger.error("Failed to handle critical scaling alerts", error);
  }
}

async function storeMetrics(metrics: ScalingMetrics) {
  const db = getFirestore();
  
  try {
    await db.collection("scalingMetrics").add({
      ...metrics,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    logger.error("Failed to store scaling metrics", error);
  }
}

async function storeCriticalAlert(type: string, data: any) {
  const db = getFirestore();
  
  try {
    await db.collection("systemAlerts").add({
      type,
      severity: "critical",
      data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      resolved: false,
    });
  } catch (error) {
    logger.error("Failed to store critical alert", error);
  }
}

// Generate daily scaling report
export const generateDailyScalingReport = onSchedule(
  "0 8 * * *", // Daily at 8 AM UTC
  async () => {
    try {
      const db = getFirestore();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      // Get yesterday's metrics
      const metricsSnapshot = await db
        .collection("scalingMetrics")
        .where("timestamp", ">=", yesterday)
        .orderBy("timestamp", "desc")
        .get();

      if (metricsSnapshot.empty) {
        logger.warn("No scaling metrics found for daily report");
        return;
      }

      const metrics = metricsSnapshot.docs.map(doc => doc.data());
      
      // Calculate daily aggregates
      const report = {
        date: yesterdayStr,
        peakActiveUsers: Math.max(...metrics.map(m => m.activeUsers24h)),
        avgActiveUsers: metrics.reduce((sum, m) => sum + m.activeUsers24h, 0) / metrics.length,
        peakAPIRequests: Math.max(...metrics.map(m => m.apiRequestsPerHour)),
        avgResponseTime: metrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / metrics.length,
        maxErrorRate: Math.max(...metrics.map(m => m.errorRate)),
        totalCost: metrics[0]?.totalCostToday || 0,
        totalAlerts: 0, // Will be calculated
        criticalAlerts: 0, // Will be calculated
      };

      // Count alerts for yesterday
      const alertsSnapshot = await db
        .collection("scalingAlerts")
        .where("timestamp", ">=", yesterday)
        .get();

      report.totalAlerts = alertsSnapshot.size;
      report.criticalAlerts = alertsSnapshot.docs.filter(
        doc => doc.data().type === "critical"
      ).length;

      // Store daily report
      await db.collection("dailyScalingReports").doc(yesterdayStr).set(report);

      logger.info("Daily scaling report generated", report);

    } catch (error) {
      logger.error("Failed to generate daily scaling report", error);
    }
  }
);