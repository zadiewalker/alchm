// Firebase Functions for Automated Sharding Optimization
// Handles 10M+ users with intelligent load balancing

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ShardMigrationService, IntelligentSharding, ShardRouter } from '../../src/lib/database/sharding-strategy';

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Scheduled function: Optimize user sharding every 24 hours
export const optimizeUserSharding = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Starting daily shard optimization...');
    
    try {
      // Analyze user activity patterns
      const activeUsers = await analyzeUserActivity();
      console.log(`Analyzed ${activeUsers.length} active users`);
      
      // Execute auto-migration for overloaded shards
      await ShardMigrationService.analyzeAndMigrate();
      
      // Update load balancer rules
      await updateLoadBalancerRules();
      
      // Generate optimization report
      await generateOptimizationReport(activeUsers.length);
      
      console.log('Daily shard optimization completed successfully');
      
    } catch (error) {
      console.error('Error in shard optimization:', error);
      
      // Alert ops team
      await sendOptimizationAlert('FAILED', error.message);
      
      throw error;
    }
  });

// Real-time function: Monitor shard performance
export const monitorShardPerformance = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    try {
      const performanceData = await collectShardMetrics();
      
      // Check for performance issues
      const alerts = await checkPerformanceThresholds(performanceData);
      
      if (alerts.length > 0) {
        await triggerPerformanceAlerts(alerts);
      }
      
      // Update real-time dashboard
      await updatePerformanceDashboard(performanceData);
      
    } catch (error) {
      console.error('Error in performance monitoring:', error);
    }
  });

// HTTP function: Get optimal shard for new user
export const assignUserShard = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const { userId, userProfile } = data;
  
  try {
    // Get optimal shard for user
    const shardId = await IntelligentSharding.getOptimalShard(userProfile);
    
    // Store shard assignment
    await db.collection('user_shard_mapping').doc(userId).set({
      userId,
      shardId,
      assignedAt: new Date(),
      userProfile,
      assignmentReason: 'optimal_placement'
    });
    
    // Update shard user count
    await incrementShardUserCount(shardId);
    
    console.log(`Assigned user ${userId} to shard ${shardId}`);
    
    return { shardId, assigned: true };
    
  } catch (error) {
    console.error('Error assigning user shard:', error);
    throw new functions.https.HttpsError('internal', 'Failed to assign shard');
  }
});

// HTTP function: Get user's current shard
export const getUserShard = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const { userId } = data;
  
  try {
    const shardId = await ShardRouter.getShardForUser(userId);
    const shardMetrics = await getShardPerformance(shardId);
    
    return {
      shardId,
      performance: shardMetrics,
      optimal: true
    };
    
  } catch (error) {
    console.error('Error getting user shard:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get shard');
  }
});

// Firestore trigger: Update shard metrics on user activity
export const updateShardMetricsOnActivity = functions.firestore
  .document('users/{userId}/entries/{entryId}')
  .onCreate(async (snap, context) => {
    const { userId } = context.params;
    
    try {
      // Get user's shard
      const shardId = await ShardRouter.getShardForUser(userId);
      
      // Update shard activity metrics
      await db.collection('shard_performance').doc(shardId).update({
        writeRate: admin.firestore.FieldValue.increment(1),
        lastActivity: new Date(),
        'activityMetrics.entriesCreated': admin.firestore.FieldValue.increment(1)
      });
      
      // Update user activity profile
      await updateUserActivityProfile(userId, 'entry_created');
      
    } catch (error) {
      console.error('Error updating shard metrics:', error);
    }
  });

// Helper Functions

async function analyzeUserActivity() {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  // Get all active users from last week
  const activeUsersSnapshot = await db.collectionGroup('entries')
    .where('timestamp', '>=', oneWeekAgo)
    .get();
  
  const userActivity = new Map();
  
  activeUsersSnapshot.docs.forEach(doc => {
    const data = doc.data();
    const userId = data.userId;
    
    if (!userActivity.has(userId)) {
      userActivity.set(userId, {
        userId,
        entriesPerWeek: 0,
        aiRequestsPerDay: 0,
        lastActiveDate: data.timestamp.toDate()
      });
    }
    
    userActivity.get(userId).entriesPerWeek++;
  });
  
  return Array.from(userActivity.values());
}

async function updateLoadBalancerRules() {
  // Get current shard distribution
  const shardDistribution = await getShardDistribution();
  
  // Update Cloud Load Balancer backend services
  const loadBalancerConfig = {
    shardRouting: shardDistribution,
    regionPriority: {
      'us-central1': 1,
      'europe-west1': 2,
      'asia-southeast1': 3
    },
    healthCheck: {
      enabled: true,
      path: '/health/shard',
      interval: 30
    }
  };
  
  // Store updated config
  await db.collection('infrastructure_config').doc('load_balancer').set({
    config: loadBalancerConfig,
    updatedAt: new Date(),
    version: Date.now()
  });
  
  console.log('Load balancer rules updated');
}

async function getShardDistribution() {
  const shardsSnapshot = await db.collection('shard_metadata')
    .where('status', '==', 'active')
    .get();
  
  const distribution = {};
  
  shardsSnapshot.docs.forEach(doc => {
    const data = doc.data();
    const region = data.shardId.split('_')[2]; // Extract region
    
    if (!distribution[region]) {
      distribution[region] = [];
    }
    
    distribution[region].push({
      shardId: data.shardId,
      userCount: data.userCount,
      capacity: data.capacity
    });
  });
  
  return distribution;
}

async function collectShardMetrics() {
  const shardsSnapshot = await db.collection('shard_performance').get();
  
  const metrics = [];
  
  for (const doc of shardsSnapshot.docs) {
    const data = doc.data();
    
    // Calculate current metrics
    const currentMetrics = {
      shardId: data.shardId,
      userCount: data.userCount,
      writeRate: data.writeRate || 0,
      readRate: data.readRate || 0,
      latencyP95: await calculateLatencyP95(data.shardId),
      errorRate: await calculateErrorRate(data.shardId),
      capacity: data.userCount / 50000, // Max users per shard
      timestamp: new Date()
    };
    
    metrics.push(currentMetrics);
    
    // Update stored metrics
    await doc.ref.update(currentMetrics);
  }
  
  return metrics;
}

async function calculateLatencyP95(shardId: string) {
  // Get recent latency samples
  const latencySnapshot = await db.collection('performance_samples')
    .where('shardId', '==', shardId)
    .where('timestamp', '>=', new Date(Date.now() - 5 * 60 * 1000)) // Last 5 minutes
    .orderBy('latency', 'desc')
    .get();
  
  if (latencySnapshot.empty) return 0;
  
  const latencies = latencySnapshot.docs.map(doc => doc.data().latency);
  const p95Index = Math.floor(latencies.length * 0.05); // Top 5%
  
  return latencies[p95Index] || 0;
}

async function calculateErrorRate(shardId: string) {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  // Get total requests
  const totalRequestsSnapshot = await db.collection('request_logs')
    .where('shardId', '==', shardId)
    .where('timestamp', '>=', fiveMinutesAgo)
    .get();
  
  // Get error requests
  const errorRequestsSnapshot = await db.collection('request_logs')
    .where('shardId', '==', shardId)
    .where('timestamp', '>=', fiveMinutesAgo)
    .where('status', '>=', 400)
    .get();
  
  const totalRequests = totalRequestsSnapshot.size;
  const errorRequests = errorRequestsSnapshot.size;
  
  return totalRequests > 0 ? errorRequests / totalRequests : 0;
}

async function checkPerformanceThresholds(metrics) {
  const alerts = [];
  
  for (const metric of metrics) {
    // High latency alert
    if (metric.latencyP95 > 300) {
      alerts.push({
        type: 'HIGH_LATENCY',
        shardId: metric.shardId,
        value: metric.latencyP95,
        threshold: 300,
        severity: 'WARNING'
      });
    }
    
    // High error rate alert
    if (metric.errorRate > 0.01) { // >1%
      alerts.push({
        type: 'HIGH_ERROR_RATE',
        shardId: metric.shardId,
        value: metric.errorRate,
        threshold: 0.01,
        severity: 'CRITICAL'
      });
    }
    
    // Near capacity alert
    if (metric.capacity > 0.85) {
      alerts.push({
        type: 'NEAR_CAPACITY',
        shardId: metric.shardId,
        value: metric.capacity,
        threshold: 0.85,
        severity: 'WARNING'
      });
    }
  }
  
  return alerts;
}

async function triggerPerformanceAlerts(alerts) {
  for (const alert of alerts) {
    // Store alert
    await db.collection('performance_alerts').add({
      ...alert,
      timestamp: new Date(),
      status: 'ACTIVE'
    });
    
    // Send to monitoring system
    console.log(`ALERT: ${alert.type} on ${alert.shardId}`, alert);
    
    // Auto-remediation for capacity issues
    if (alert.type === 'NEAR_CAPACITY') {
      console.log(`Triggering auto-migration for ${alert.shardId}`);
      // This could trigger immediate migration
    }
  }
}

async function updatePerformanceDashboard(metrics) {
  const dashboardData = {
    timestamp: new Date(),
    totalShards: metrics.length,
    activeUsers: metrics.reduce((sum, m) => sum + m.userCount, 0),
    averageLatency: metrics.reduce((sum, m) => sum + m.latencyP95, 0) / metrics.length,
    totalWriteRate: metrics.reduce((sum, m) => sum + m.writeRate, 0),
    healthyShards: metrics.filter(m => m.latencyP95 < 200 && m.errorRate < 0.005).length,
    alerts: await getActiveAlertsCount()
  };
  
  await db.collection('performance_dashboard').doc('current').set(dashboardData);
}

async function getActiveAlertsCount() {
  const alertsSnapshot = await db.collection('performance_alerts')
    .where('status', '==', 'ACTIVE')
    .get();
  
  return alertsSnapshot.size;
}

async function generateOptimizationReport(activeUserCount: number) {
  const report = {
    timestamp: new Date(),
    activeUsers: activeUserCount,
    totalShards: await getTotalShardCount(),
    migrationsExecuted: await getMigrationsInLast24Hours(),
    averageLatency: await getGlobalAverageLatency(),
    systemHealth: await getSystemHealthScore(),
    recommendations: await generateOptimizationRecommendations()
  };
  
  await db.collection('optimization_reports').add(report);
  console.log('Optimization report generated:', report);
}

async function getTotalShardCount() {
  const shardsSnapshot = await db.collection('shard_metadata')
    .where('status', '==', 'active')
    .get();
  
  return shardsSnapshot.size;
}

async function getMigrationsInLast24Hours() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const migrationsSnapshot = await db.collection('migration_history')
    .where('timestamp', '>=', oneDayAgo)
    .get();
  
  return migrationsSnapshot.size;
}

async function getGlobalAverageLatency() {
  const metricsSnapshot = await db.collection('shard_performance').get();
  
  if (metricsSnapshot.empty) return 0;
  
  const totalLatency = metricsSnapshot.docs.reduce((sum, doc) => {
    return sum + (doc.data().latencyP95 || 0);
  }, 0);
  
  return totalLatency / metricsSnapshot.size;
}

async function getSystemHealthScore() {
  const metrics = await collectShardMetrics();
  
  const healthyShards = metrics.filter(m => 
    m.latencyP95 < 200 && 
    m.errorRate < 0.005 && 
    m.capacity < 0.8
  );
  
  return metrics.length > 0 ? healthyShards.length / metrics.length : 1;
}

async function generateOptimizationRecommendations() {
  const recommendations = [];
  
  // Analyze current performance
  const metrics = await collectShardMetrics();
  const overloadedShards = metrics.filter(m => m.capacity > 0.8);
  const slowShards = metrics.filter(m => m.latencyP95 > 250);
  
  if (overloadedShards.length > 0) {
    recommendations.push({
      type: 'SCALE_OUT',
      description: `${overloadedShards.length} shards are near capacity. Consider creating new shards.`,
      priority: 'HIGH',
      affectedShards: overloadedShards.map(s => s.shardId)
    });
  }
  
  if (slowShards.length > 0) {
    recommendations.push({
      type: 'PERFORMANCE_OPTIMIZATION',
      description: `${slowShards.length} shards have high latency. Review indexing and query patterns.`,
      priority: 'MEDIUM',
      affectedShards: slowShards.map(s => s.shardId)
    });
  }
  
  return recommendations;
}

async function incrementShardUserCount(shardId: string) {
  await db.collection('shard_metadata').doc(shardId).update({
    userCount: admin.firestore.FieldValue.increment(1),
    lastUpdated: new Date()
  });
}

async function getShardPerformance(shardId: string) {
  const performanceDoc = await db.collection('shard_performance').doc(shardId).get();
  return performanceDoc.data() || {};
}

async function updateUserActivityProfile(userId: string, activityType: string) {
  const profileRef = db.collection('user_activity_profiles').doc(userId);
  
  const updates: any = {
    lastActiveDate: new Date(),
    [`activities.${activityType}`]: admin.firestore.FieldValue.increment(1)
  };
  
  if (activityType === 'entry_created') {
    updates.entriesPerWeek = admin.firestore.FieldValue.increment(1);
  }
  
  await profileRef.set(updates, { merge: true });
}

async function sendOptimizationAlert(status: string, message: string) {
  await db.collection('system_alerts').add({
    type: 'SHARD_OPTIMIZATION',
    status,
    message,
    timestamp: new Date(),
    severity: status === 'FAILED' ? 'CRITICAL' : 'INFO'
  });
}