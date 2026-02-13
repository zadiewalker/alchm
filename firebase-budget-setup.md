# Firebase Budget Alerts Setup Guide

## 1. Google Cloud Console Budget Alerts

### A. Create Budget Alerts
1. Go to [Google Cloud Console - Billing](https://console.cloud.google.com/billing)
2. Select your Firebase project's billing account
3. Navigate to "Budgets & alerts"
4. Click "Create Budget"

### B. Configure Budget
```
Name: ALCHM Firebase Monthly Budget
Projects: alchm-digital-sanctuary
Services: All services (or specific Firebase services)
Budget Amount: $50/month (adjust based on your needs)
```

### C. Set Alert Thresholds
```
Alert 1: 50% of budget ($25)
Alert 2: 80% of budget ($40)  
Alert 3: 90% of budget ($45)
Alert 4: 100% of budget ($50)
Alert 5: 110% of budget ($55)
```

### D. Configure Notifications
- Email: your-email@domain.com
- Pub/Sub Topic: firebase-budget-alerts (create this topic)

## 2. Pub/Sub Topic for Alerts

### Create Topic
```bash
gcloud pubsub topics create firebase-budget-alerts
```

### Create Subscription
```bash
gcloud pubsub subscriptions create firebase-budget-alerts-sub \
  --topic=firebase-budget-alerts
```

## 3. Firebase Function for Budget Processing

The following function will process budget alerts and take action:

```typescript
// functions/src/budgetAlerts.ts
import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { logger } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';

interface BudgetAlert {
  budgetDisplayName: string;
  alertThresholdExceeded: number;
  costAmount: number;
  budgetAmount: number;
  currencyCode: string;
  schemaVersion: string;
}

export const processBudgetAlert = onMessagePublished(
  'firebase-budget-alerts',
  async (event) => {
    const data = event.data.message.data;
    const alert: BudgetAlert = JSON.parse(
      Buffer.from(data, 'base64').toString()
    );

    logger.info('Budget alert received:', alert);

    const db = getFirestore();
    
    // Store alert for monitoring
    await db.collection('budgetAlerts').add({
      ...alert,
      timestamp: new Date(),
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
  }
);

async function emergencyBudgetResponse(alert: BudgetAlert) {
  const db = getFirestore();
  
  // Temporarily disable high-cost features
  await db.collection('systemConfig').doc('rateLimiting').update({
    emergencyMode: true,
    reducedLimits: true,
    lastUpdated: new Date(),
  });

  // Send emergency notification
  logger.error('EMERGENCY: Budget exceeded 100%', alert);
  
  // Could integrate with Slack/email here
}

async function highBudgetWarning(alert: BudgetAlert) {
  const db = getFirestore();
  
  // Reduce rate limits
  await db.collection('systemConfig').doc('rateLimiting').update({
    warningMode: true,
    reducedLimits: true,
    lastUpdated: new Date(),
  });

  logger.warn('High budget usage: 90% threshold exceeded', alert);
}

async function moderateBudgetWarning(alert: BudgetAlert) {
  logger.warn('Moderate budget usage: 80% threshold exceeded', alert);
  
  // Just log for now, but could reduce limits for Growth users
}
```

## 4. Application-Level Budget Monitoring

### Daily Cost Tracking Function
```typescript
// functions/src/dailyCostTracking.ts
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore } from 'firebase-admin/firestore';

export const trackDailyCosts = onSchedule(
  'every day 23:59',
  async () => {
    const db = getFirestore();
    const today = new Date().toISOString().split('T')[0];
    
    // Aggregate user costs
    const usageSnapshot = await db
      .collection('userUsage')
      .where('date', '==', today)
      .get();
    
    let totalCost = 0;
    let totalTokens = 0;
    let totalRequests = 0;
    
    usageSnapshot.forEach(doc => {
      const data = doc.data();
      totalCost += data.costUSD || 0;
      totalTokens += data.tokenCount || 0;
      totalRequests += data.requestCount || 0;
    });
    
    // Store daily summary
    await db.collection('dailyCostSummary').doc(today).set({
      date: today,
      totalCostUSD: totalCost,
      totalTokens,
      totalRequests,
      userCount: usageSnapshot.size,
      averageCostPerUser: usageSnapshot.size > 0 ? totalCost / usageSnapshot.size : 0,
      timestamp: new Date(),
    });
    
    // Check if daily cost is concerning
    if (totalCost > 10) { // Alert if daily cost exceeds $10
      logger.warn('High daily cost detected', {
        date: today,
        totalCost,
        userCount: usageSnapshot.size,
      });
    }
  }
);
```

## 5. Cost Monitoring Dashboard Component

```typescript
// src/components/admin/CostMonitoring.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DailyCostSummary {
  date: string;
  totalCostUSD: number;
  totalTokens: number;
  totalRequests: number;
  userCount: number;
  averageCostPerUser: number;
}

export default function CostMonitoring() {
  const [costData, setCostData] = useState<DailyCostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCostData();
  }, []);

  const loadCostData = async () => {
    try {
      const q = query(
        collection(db, 'dailyCostSummary'),
        orderBy('date', 'desc'),
        limit(30)
      );
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data() as DailyCostSummary);
      setCostData(data);
    } catch (error) {
      console.error('Failed to load cost data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCost = costData.reduce((sum, day) => sum + day.totalCostUSD, 0);
  const averageDailyCost = costData.length > 0 ? totalCost / costData.length : 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Cost Monitoring (Last 30 Days)</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-medium text-blue-800">Total Cost</h3>
          <p className="text-2xl font-bold text-blue-600">${totalCost.toFixed(2)}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-medium text-green-800">Avg Daily Cost</h3>
          <p className="text-2xl font-bold text-green-600">${averageDailyCost.toFixed(2)}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium text-purple-800">Projected Monthly</h3>
          <p className="text-2xl font-bold text-purple-600">${(averageDailyCost * 30).toFixed(2)}</p>
        </div>
      </div>
      
      {/* Cost trend chart would go here */}
      <div className="space-y-2">
        {costData.slice(0, 7).map(day => (
          <div key={day.date} className="flex justify-between items-center p-2 border rounded">
            <span>{day.date}</span>
            <div className="text-right">
              <div className="font-medium">${day.totalCostUSD.toFixed(2)}</div>
              <div className="text-sm text-gray-500">{day.userCount} users</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 6. Implementation Steps

1. **Set up Google Cloud Budget** (manual step in Console)
2. **Deploy the Firebase Functions** for budget processing
3. **Configure Pub/Sub notifications** 
4. **Add cost tracking to your existing functions**
5. **Create admin dashboard** for cost monitoring
6. **Test budget alerts** with small threshold

## 7. Environment Variables to Add

```
# .env.local
FIREBASE_BUDGET_ALERT_EMAIL=your-email@domain.com
EMERGENCY_BUDGET_THRESHOLD=50.00
WARNING_BUDGET_THRESHOLD=40.00
```

This setup provides comprehensive budget monitoring and automatic cost controls for your Firebase usage.