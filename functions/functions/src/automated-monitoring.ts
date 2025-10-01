import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

interface MetricThreshold {
  metric: string;
  critical: number;
  warning: number;
  info: number;
}

interface SystemMetrics {
  activeUsers: number;
  errorRate: number;
  responseTime: number;
  memoryUsage: number;
  journalCreationRate: number;
  aiProcessingTime: number;
  stripeTransactionRate: number;
  crisisInterventions: number;
}

// Core monitoring thresholds for ALCHM
const METRIC_THRESHOLDS: Record<string, MetricThreshold> = {
  activeUsers: { metric: 'activeUsers', critical: 10000, warning: 7500, info: 5000 },
  errorRate: { metric: 'errorRate', critical: 50, warning: 20, info: 10 },
  responseTime: { metric: 'responseTime', critical: 3000, warning: 2000, info: 1000 },
  memoryUsage: { metric: 'memoryUsage', critical: 90, warning: 75, info: 60 },
  journalCreationRate: { metric: 'journalCreationRate', critical: 1000, warning: 500, info: 100 },
  aiProcessingTime: { metric: 'aiProcessingTime', critical: 10000, warning: 7000, info: 5000 },
  crisisInterventions: { metric: 'crisisInterventions', critical: 10, warning: 5, info: 2 }
};

// Automated monitoring function - runs every 5 minutes
export const automatedSystemMonitoring = functions.pubsub
  .schedule('*/5 * * * *') // Every 5 minutes
  .onRun(async (context) => {
    try {
      console.log('Starting automated system monitoring...');
      
      const metrics = await collectSystemMetrics();
      await evaluateAlerts(metrics);
      await updateSystemHealth(metrics);
      
      console.log('Automated monitoring completed successfully');
    } catch (error) {
      console.error('Automated monitoring failed:', error);
      await createCriticalAlert('monitoring_system_failure', {
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now()
      });
    }
  });

// Crisis intervention monitoring - runs every minute
export const crisisMonitoring = functions.pubsub
  .schedule('* * * * *') // Every minute
  .onRun(async (context) => {
    try {
      const now = Date.now();
      const oneMinuteAgo = now - (60 * 1000);
      
      // Check for crisis-level journal entries
      const crisisJournalsRef = db.collection('journals')
        .where('riskAssessment.level', '==', 'crisis')
        .where('createdAt', '>=', oneMinuteAgo);
      
      const crisisSnapshot = await crisisJournalsRef.get();
      
      if (crisisSnapshot.size > 0) {
        const crisisEntries = crisisSnapshot.docs.map(doc => ({
          id: doc.id,
          userId: doc.data().userId,
          riskLevel: doc.data().riskAssessment?.level,
          timestamp: doc.data().createdAt
        }));
        
        await createCriticalAlert('crisis_interventions_detected', {
          count: crisisEntries.length,
          entries: crisisEntries,
          timestamp: now
        });
        
        console.log(`CRISIS ALERT: ${crisisEntries.length} crisis-level entries detected`);
      }
      
    } catch (error) {
      console.error('Crisis monitoring failed:', error);
    }
  });

// Performance degradation monitoring - runs every 10 minutes
export const performanceMonitoring = functions.pubsub
  .schedule('*/10 * * * *') // Every 10 minutes
  .onRun(async (context) => {
    try {
      const performance = await measureSystemPerformance();
      
      // Check AI processing performance
      const aiThreshold = METRIC_THRESHOLDS.aiProcessingTime;
      if (aiThreshold && performance.aiProcessingTime > aiThreshold.critical) {
        await createCriticalAlert('ai_processing_degraded', {
          currentTime: performance.aiProcessingTime,
          threshold: aiThreshold.critical,
          timestamp: Date.now()
        });
      }
      
      // Check database performance
      const dbThreshold = METRIC_THRESHOLDS.responseTime;
      if (dbThreshold && performance.responseTime > dbThreshold.critical) {
        await createCriticalAlert('database_performance_degraded', {
          currentTime: performance.responseTime,
          threshold: dbThreshold.critical,
          timestamp: Date.now()
        });
      }
      
      // Store performance metrics for trend analysis
      await db.collection('performance_metrics').add({
        ...performance,
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('Performance monitoring failed:', error);
    }
  });

async function collectSystemMetrics(): Promise<SystemMetrics> {
  const now = Date.now();
  const fiveMinutesAgo = now - (5 * 60 * 1000);
  const oneHourAgo = now - (60 * 60 * 1000);

  const [
    activeUsersSnapshot,
    recentErrorsSnapshot,
    recentJournalsSnapshot,
    crisisSnapshot
  ] = await Promise.all([
    // Active users in last 5 minutes
    db.collection('user_sessions')
      .where('lastActivity', '>=', fiveMinutesAgo)
      .get(),
    
    // Errors in last hour
    db.collection('error_logs')
      .where('timestamp', '>=', oneHourAgo)
      .get(),
    
    // Journal entries in last 5 minutes
    db.collection('journals')
      .where('createdAt', '>=', fiveMinutesAgo)
      .get(),
    
    // Crisis interventions in last hour
    db.collection('journals')
      .where('riskAssessment.level', '==', 'crisis')
      .where('createdAt', '>=', oneHourAgo)
      .get()
  ]);

  const performance = await measureSystemPerformance();

  return {
    activeUsers: activeUsersSnapshot.size,
    errorRate: recentErrorsSnapshot.size,
    responseTime: performance.responseTime,
    memoryUsage: performance.memoryUsage,
    journalCreationRate: recentJournalsSnapshot.size,
    aiProcessingTime: performance.aiProcessingTime,
    stripeTransactionRate: performance.stripeTransactionRate,
    crisisInterventions: crisisSnapshot.size
  };
}

async function measureSystemPerformance() {
  const start = Date.now();
  
  // Test database response time
  await db.collection('system_health').doc('test').get();
  const responseTime = Date.now() - start;
  
  // Get memory usage from system health document
  const healthDoc = await db.collection('system_health').doc('functions').get();
  const healthData = healthDoc.data() || {};
  
  // Measure AI processing time (average from recent entries)
  const aiMetricsRef = db.collection('ai_processing_metrics')
    .orderBy('timestamp', 'desc')
    .limit(10);
  const aiMetricsSnapshot = await aiMetricsRef.get();
  
  const avgAiProcessingTime = aiMetricsSnapshot.docs.reduce((acc, doc) => {
    return acc + (doc.data().processingTime || 0);
  }, 0) / Math.max(aiMetricsSnapshot.size, 1);
  
  return {
    responseTime,
    memoryUsage: healthData.memoryUsage || 0,
    aiProcessingTime: avgAiProcessingTime,
    stripeTransactionRate: 0 // Would be calculated from Stripe webhook data
  };
}

async function evaluateAlerts(metrics: SystemMetrics) {
  const alerts: Array<{
    metric: string;
    currentValue: number;
    threshold: number;
    severity: 'critical' | 'warning' | 'info';
    timestamp: number;
  }> = [];
  
  for (const [key, value] of Object.entries(metrics)) {
    const threshold = METRIC_THRESHOLDS[key];
    if (!threshold) continue;
    
    let severity: 'critical' | 'warning' | 'info' | null = null;
    
    if (value >= threshold.critical) {
      severity = 'critical';
    } else if (value >= threshold.warning) {
      severity = 'warning';
    } else if (value >= threshold.info) {
      severity = 'info';
    }
    
    if (severity) {
      alerts.push({
        metric: key,
        currentValue: value,
        threshold: threshold[severity],
        severity,
        timestamp: Date.now()
      });
    }
  }
  
  // Create alert events
  for (const alert of alerts) {
    await createAlert(alert);
  }
  
  return alerts;
}

async function createAlert(alertData: any) {
  const alertId = `alert_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  const alert = {
    id: alertId,
    ruleId: 'automated_monitoring',
    ruleName: `Automated ${alertData.metric} Monitoring`,
    metric: alertData.metric,
    currentValue: alertData.currentValue,
    threshold: alertData.threshold,
    severity: alertData.severity,
    timestamp: alertData.timestamp,
    acknowledged: false,
    context: {
      automated: true,
      source: 'system_monitoring'
    }
  };
  
  await db.collection('monitoring_alerts').doc(alertId).set(alert);
  
  // Send immediate notification for critical alerts
  if (alertData.severity === 'critical') {
    await sendImmediateNotification(alert);
  }
  
  console.log(`Alert created: ${alertData.metric} = ${alertData.currentValue} (${alertData.severity})`);
}

async function createCriticalAlert(type: string, data: any) {
  const alertId = `critical_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  const alert = {
    id: alertId,
    ruleId: 'critical_system_alert',
    ruleName: `Critical System Alert: ${type}`,
    metric: type,
    currentValue: data.count || 1,
    threshold: 0,
    severity: 'critical',
    timestamp: Date.now(),
    acknowledged: false,
    context: {
      type,
      data,
      automated: true,
      source: 'critical_monitoring'
    }
  };
  
  await db.collection('monitoring_alerts').doc(alertId).set(alert);
  await sendImmediateNotification(alert);
  
  console.log(`CRITICAL ALERT: ${type}`, data);
}

async function sendImmediateNotification(alert: any) {
  // In production, this would send to configured notification channels
  // For now, we'll log and store in a high-priority notifications collection
  
  const notification = {
    alertId: alert.id,
    type: 'immediate',
    severity: alert.severity,
    message: `ALCHM Alert: ${alert.ruleName} - ${alert.metric} is ${alert.currentValue}`,
    timestamp: Date.now(),
    sent: false
  };
  
  await db.collection('urgent_notifications').add(notification);
  
  // Would integrate with:
  // - Email service (SendGrid, AWS SES)
  // - Slack webhook
  // - SMS service (Twilio)
  // - PagerDuty for critical alerts
}

async function updateSystemHealth(metrics: SystemMetrics) {
  const healthScore = calculateOverallHealthScore(metrics);
  const status = healthScore > 90 ? 'healthy' : healthScore > 70 ? 'degraded' : 'unhealthy';
  
  const healthUpdate = {
    overall: status,
    score: healthScore,
    metrics,
    lastUpdated: Date.now(),
    trends: calculateTrends(metrics)
  };
  
  await db.collection('system_health').doc('overall').set(healthUpdate);
}

function calculateOverallHealthScore(metrics: SystemMetrics): number {
  let score = 100;
  
  // Deduct points based on metric severity
  Object.entries(metrics).forEach(([key, value]) => {
    const threshold = METRIC_THRESHOLDS[key];
    if (!threshold) return;
    
    if (value >= threshold.critical) {
      score -= 30;
    } else if (value >= threshold.warning) {
      score -= 15;
    } else if (value >= threshold.info) {
      score -= 5;
    }
  });
  
  // Special penalty for crisis interventions
  if (metrics.crisisInterventions > 0) {
    score -= Math.min(20, metrics.crisisInterventions * 5);
  }
  
  return Math.max(0, score);
}

function calculateTrends(currentMetrics: SystemMetrics) {
  // In production, this would compare against historical data
  return {
    activeUsers: 'stable',
    errorRate: currentMetrics.errorRate > 10 ? 'increasing' : 'stable',
    performance: currentMetrics.responseTime > 2000 ? 'degrading' : 'stable',
    aiProcessing: currentMetrics.aiProcessingTime > 7000 ? 'slow' : 'optimal'
  };
}

// Manual alert trigger for testing
export const triggerTestAlert = functions.https.onCall(async (data, context) => {
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }
  
  await createAlert({
    metric: 'test_metric',
    currentValue: 100,
    threshold: 50,
    severity: 'info',
    timestamp: Date.now()
  });
  
  return { success: true, message: 'Test alert triggered' };
});

// Health check endpoint
export const getSystemHealthStatus = functions.https.onCall(async (data, context) => {
  const healthDoc = await db.collection('system_health').doc('overall').get();
  const healthData = healthDoc.data();
  
  if (!healthData) {
    return { status: 'unknown', message: 'Health data not available' };
  }
  
  return {
    status: healthData.overall,
    score: healthData.score,
    lastUpdated: healthData.lastUpdated,
    metrics: healthData.metrics
  };
});