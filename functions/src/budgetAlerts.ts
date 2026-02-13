import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

interface BudgetAlert {
  budgetDisplayName: string;
  alertThresholdExceeded: number;
  costAmount: number;
  budgetAmount: number;
  currencyCode: string;
  schemaVersion: string;
}

interface DailyCostSummary {
  date: string;
  totalCostUSD: number;
  totalTokens: number;
  totalRequests: number;
  userCount: number;
  averageCostPerUser: number;
}

// Process budget alerts from Google Cloud
export const processBudgetAlert = onMessagePublished(
  'firebase-budget-alerts',
  async (event) => {
    try {
      const data = event.data.message.data;
      const alert: BudgetAlert = JSON.parse(
        Buffer.from(data, 'base64').toString()
      );

      logger.info('Budget alert received:', alert);

      const db = getFirestore();
      
      // Store alert for monitoring
      await db.collection('budgetAlerts').add({
        ...alert,
        timestamp: admin.firestore.Timestamp.now(),
        processed: true,
      });

      // Take action based on threshold
      if (alert.alertThresholdExceeded >= 1.0) {
        // 100% budget exceeded - emergency actions
        await emergencyBudgetResponse(alert);
      } else if (alert.alertThresholdExceeded >= 0.9) {
        // 90% budget - warning actions
        await highBudgetWarning(alert);
      } else if (alert.alertThresholdExceeded >= 0.8) {
        // 80% budget - moderate warning
        await moderateBudgetWarning(alert);
      }

    } catch (error) {
      logger.error('Error processing budget alert:', error);
    }
  }
);

async function emergencyBudgetResponse(alert: BudgetAlert) {
  const db = getFirestore();
  
  try {
    // Temporarily disable high-cost features
    await db.collection('systemConfig').doc('rateLimiting').set({
      emergencyMode: true,
      reducedLimits: true,
      emergencyThreshold: 0.1, // Reduce limits to 10% of normal
      reason: `Budget exceeded 100%: $${alert.costAmount}`,
      lastUpdated: admin.firestore.Timestamp.now(),
    }, { merge: true });

    // Log critical alert
    logger.error('EMERGENCY: Budget exceeded 100%', {
      budgetName: alert.budgetDisplayName,
      costAmount: alert.costAmount,
      budgetAmount: alert.budgetAmount,
      thresholdExceeded: alert.alertThresholdExceeded,
    });

    // Store emergency event
    await db.collection('emergencyEvents').add({
      type: 'budget_exceeded',
      severity: 'critical',
      alert,
      timestamp: admin.firestore.Timestamp.now(),
      actionsToken: ['rate_limiting_enabled', 'emergency_mode_activated'],
    });

  } catch (error) {
    logger.error('Error in emergency budget response:', error);
  }
}

async function highBudgetWarning(alert: BudgetAlert) {
  const db = getFirestore();
  
  try {
    // Reduce rate limits for Growth tier users
    await db.collection('systemConfig').doc('rateLimiting').set({
      warningMode: true,
      reducedLimits: true,
      growthTierReduction: 0.5, // Reduce Growth tier limits by 50%
      reason: `Budget warning at 90%: $${alert.costAmount}`,
      lastUpdated: admin.firestore.Timestamp.now(),
    }, { merge: true });

    logger.warn('High budget usage: 90% threshold exceeded', {
      budgetName: alert.budgetDisplayName,
      costAmount: alert.costAmount,
      budgetAmount: alert.budgetAmount,
    });

  } catch (error) {
    logger.error('Error in high budget warning:', error);
  }
}

async function moderateBudgetWarning(alert: BudgetAlert) {
  const db = getFirestore();
  
  try {
    logger.warn('Moderate budget usage: 80% threshold exceeded', {
      budgetName: alert.budgetDisplayName,
      costAmount: alert.costAmount,
      budgetAmount: alert.budgetAmount,
    });

    // Store warning event
    await db.collection('budgetWarnings').add({
      type: 'moderate_warning',
      alert,
      timestamp: admin.firestore.Timestamp.now(),
    });

  } catch (error) {
    logger.error('Error in moderate budget warning:', error);
  }
}

// Track daily costs and usage
export const trackDailyCosts = onSchedule(
  'every day 23:59',
  async () => {
    try {
      const db = getFirestore();
      const today = new Date().toISOString().split('T')[0];
      
      // Aggregate user costs for today
      const usageSnapshot = await db
        .collection('userUsage')
        .where('date', '==', today)
        .get();
      
      let totalCost = 0;
      let totalTokens = 0;
      let totalRequests = 0;
      const userCosts: Record<string, number> = {};
      
      usageSnapshot.forEach(doc => {
        const data = doc.data();
        const cost = data.costUSD || 0;
        const tokens = data.tokenCount || 0;
        const requests = data.requestCount || 0;
        
        totalCost += cost;
        totalTokens += tokens;
        totalRequests += requests;
        
        // Track per-user costs for anomaly detection
        const userId = data.userId;
        if (userId) {
          userCosts[userId] = cost;
        }
      });
      
      const summary: DailyCostSummary = {
        date: today,
        totalCostUSD: totalCost,
        totalTokens,
        totalRequests,
        userCount: usageSnapshot.size,
        averageCostPerUser: usageSnapshot.size > 0 ? totalCost / usageSnapshot.size : 0,
      };
      
      // Store daily summary
      await db.collection('dailyCostSummary').doc(today).set({
        ...summary,
        timestamp: admin.firestore.Timestamp.now(),
        userCosts: Object.keys(userCosts).length > 0 ? userCosts : null,
      });
      
      // Check for anomalies
      await checkCostAnomalies(summary, userCosts);
      
      logger.info('Daily cost summary recorded', summary);

    } catch (error) {
      logger.error('Error tracking daily costs:', error);
    }
  }
);

async function checkCostAnomalies(
  summary: DailyCostSummary, 
  userCosts: Record<string, number>
) {
  const db = getFirestore();

  try {
    // Check if daily cost is concerning
    const HIGH_DAILY_COST_THRESHOLD = 10; // $10/day
    const VERY_HIGH_DAILY_COST_THRESHOLD = 25; // $25/day
    
    if (summary.totalCostUSD > VERY_HIGH_DAILY_COST_THRESHOLD) {
      logger.error('VERY HIGH daily cost detected', summary);
      
      await db.collection('costAnomalies').add({
        type: 'very_high_daily_cost',
        severity: 'critical',
        summary,
        threshold: VERY_HIGH_DAILY_COST_THRESHOLD,
        timestamp: admin.firestore.Timestamp.now(),
      });
      
    } else if (summary.totalCostUSD > HIGH_DAILY_COST_THRESHOLD) {
      logger.warn('High daily cost detected', summary);
      
      await db.collection('costAnomalies').add({
        type: 'high_daily_cost',
        severity: 'warning',
        summary,
        threshold: HIGH_DAILY_COST_THRESHOLD,
        timestamp: admin.firestore.Timestamp.now(),
      });
    }

    // Check for individual user anomalies
    const HIGH_USER_COST_THRESHOLD = 2; // $2/day per user
    const anomalousUsers = Object.entries(userCosts)
      .filter(([, cost]) => cost > HIGH_USER_COST_THRESHOLD);

    if (anomalousUsers.length > 0) {
      logger.warn('High-cost users detected', {
        users: anomalousUsers.length,
        totalCost: anomalousUsers.reduce((sum, [, cost]) => sum + cost, 0),
      });

      await db.collection('userCostAnomalies').add({
        type: 'high_individual_cost',
        date: summary.date,
        anomalousUsers: Object.fromEntries(anomalousUsers),
        threshold: HIGH_USER_COST_THRESHOLD,
        timestamp: admin.firestore.Timestamp.now(),
      });
    }

  } catch (error) {
    logger.error('Error checking cost anomalies:', error);
  }
}

// Clean up old usage data (run monthly)
export const cleanupOldUsageData = onSchedule(
  '0 2 1 * *', // 2 AM on 1st of every month
  async () => {
    try {
      const db = getFirestore();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const cutoffDate = sixMonthsAgo.toISOString().split('T')[0];

      // Clean up user usage data older than 6 months
      const oldUsageQuery = db
        .collection('userUsage')
        .where('date', '<', cutoffDate)
        .limit(500);

      const snapshot = await oldUsageQuery.get();
      
      if (!snapshot.empty) {
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        logger.info(`Cleaned up ${snapshot.size} old usage records`);
      }

      // Archive daily cost summaries older than 1 year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const archiveCutoff = oneYearAgo.toISOString().split('T')[0];

      const oldSummariesQuery = db
        .collection('dailyCostSummary')
        .where('date', '<', archiveCutoff)
        .limit(100);

      const summariesSnapshot = await oldSummariesQuery.get();
      
      if (!summariesSnapshot.empty) {
        const batch = db.batch();
        summariesSnapshot.docs.forEach(doc => {
          // Move to archive collection
          batch.set(
            db.collection('archivedCostSummary').doc(doc.id),
            doc.data()
          );
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        logger.info(`Archived ${summariesSnapshot.size} old cost summaries`);
      }

    } catch (error) {
      logger.error('Error cleaning up old usage data:', error);
    }
  }
);