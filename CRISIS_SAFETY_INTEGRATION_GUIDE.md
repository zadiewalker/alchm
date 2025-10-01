# ALCHM Crisis Safety Systems Integration Guide

## Overview

This guide demonstrates how to integrate the comprehensive crisis safety systems that **prioritize user safety above all business metrics**. These systems are designed to intercept ALL user interactions and immediately suspend business logic during crisis events.

## Life-Critical Architecture

The crisis safety system operates on a strict hierarchy:

1. **User Safety** (Top Priority)
2. **Crisis Resource Delivery** 
3. **Professional Escalation**
4. **Business Metrics** (Suspended during crisis)
5. **Application Features** (Modified during crisis)

## Core Components Implemented

### 1. Crisis Safety Middleware (`/src/middleware/crisis-safety-middleware.ts`)
- **Intercepts ALL user interactions before any business logic**
- **<3 second response time requirement**
- **Automatic business metric suspension**
- **Emergency response system**

### 2. Business Metric Override (`/src/lib/crisis/business-metric-override.ts`)
- **Suspends analytics, goals, streaks, achievements**
- **Removes potentially harmful competitive elements**
- **Grace period management**
- **Professional review requirements**

### 3. Real-Time Crisis Monitor (`/src/lib/crisis/real-time-crisis-monitor.ts`)
- **24/7 continuous monitoring**
- **Pattern analysis and escalation detection**
- **Offline capability**
- **Sub-second crisis detection**

### 4. Emergency Resource Panel (`/src/components/crisis/EmergencyResourcePanel.tsx`)
- **<3 second resource loading**
- **Offline resource caching**
- **Cultural and language adaptations**
- **One-click emergency access**

### 5. Crisis Emergency Interface (`/src/components/crisis/CrisisEmergencyInterface.tsx`)
- **UI transformation during crisis**
- **Simplified navigation**
- **Emergency exit buttons**
- **Trauma-informed design**

### 6. Professional Escalation System (`/src/lib/crisis/professional-escalation-system.ts`)
- **Automated professional notifications**
- **Consent management**
- **Legal compliance (duty to warn)**
- **Multi-tier escalation**

## Integration Examples

### Basic Integration in App Layout

```tsx
// src/app/layout.tsx
import { CrisisEmergencyInterface } from '@/components/crisis/CrisisEmergencyInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeCrisisMonitoring } from '@/hooks/useRealTimeCrisisMonitoring';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { crisisState, userContext } = useRealTimeCrisisMonitoring(user?.uid);

  return (
    <html>
      <body>
        <CrisisEmergencyInterface
          userId={user?.uid || ''}
          userContext={userContext}
          crisisOverrideState={crisisState}
          onEmergencyExit={() => window.location.href = '/emergency-safe'}
          onSafetyConfirmed={() => console.log('User confirmed safety')}
        >
          {children}
        </CrisisEmergencyInterface>
      </body>
    </html>
  );
}
```

### Journal Entry Integration

```tsx
// src/app/journal/page.tsx
import { realTimeCrisisMonitor, InteractionType } from '@/lib/crisis/real-time-crisis-monitor';
import { businessMetricOverride } from '@/lib/crisis/business-metric-override';

export default function JournalPage() {
  const [content, setContent] = useState('');
  const [crisisOverride, setCrisisOverride] = useState(false);
  const { user } = useAuth();

  // Check if business metrics are suspended
  useEffect(() => {
    if (user?.uid) {
      const suspended = businessMetricOverride.areBusinessMetricsSuspended(user.uid);
      setCrisisOverride(suspended);
    }
  }, [user?.uid]);

  const handleContentChange = async (newContent: string) => {
    setContent(newContent);

    // Real-time crisis monitoring on every content change
    if (user?.uid && newContent.length > 20) {
      try {
        const monitoringResult = await realTimeCrisisMonitor.processUserInteraction(
          user.uid,
          InteractionType.JOURNAL_ENTRY,
          newContent,
          {
            sessionDuration: Date.now() - sessionStart,
            deviceType: /Mobile/.test(navigator.userAgent) ? 'mobile' : 'desktop'
          }
        );

        if (monitoringResult.crisisDetected) {
          // Crisis detected - UI will automatically transform
          console.log('Crisis detected - safety systems activated');
        }
      } catch (error) {
        console.error('Crisis monitoring error:', error);
      }
    }
  };

  return (
    <div className="journal-page">
      {/* Hide business metrics during crisis */}
      {!crisisOverride && (
        <div data-metric="streak" className="streak-display">
          Your 7-day writing streak!
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="What's on your mind today?"
        className="journal-textarea"
      />

      {/* Crisis-safe messaging when business metrics suspended */}
      {crisisOverride && (
        <div className="crisis-safe-message">
          Focus on your thoughts and feelings. You're in a safe space.
        </div>
      )}
    </div>
  );
}
```

### Dashboard with Crisis-Safe Analytics

```tsx
// src/app/dashboard/page.tsx
import { crisisSafetyCoordinator } from '@/lib/crisis-safety-coordinator';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [crisisState, setCrisisState] = useState('none');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      loadCrisisSafeAnalytics();
    }
  }, [user?.uid]);

  const loadCrisisSafeAnalytics = async () => {
    try {
      // Get user's current crisis state
      const userState = realTimeCrisisMonitor.getUserMonitoringState(user.uid);
      const currentCrisisState = userState?.currentRiskLevel || 'none';
      setCrisisState(currentCrisisState);

      // Load analytics with crisis safety filter
      const rawAnalytics = await getAnalytics(user.uid);
      const safeAnalytics = crisisSafetyCoordinator.applyCrisisSafeAnalytics(
        user.uid,
        rawAnalytics,
        currentCrisisState
      );
      
      setAnalytics(safeAnalytics);
    } catch (error) {
      console.error('Analytics loading error:', error);
    }
  };

  return (
    <div className="dashboard">
      {/* Crisis-safe analytics display */}
      {analytics && (
        <div className="analytics-section">
          {crisisState === 'none' ? (
            // Normal analytics
            <div>
              <div data-metric="streak">Streak: {analytics.streakDays} days</div>
              <div data-metric="goal">Goal Progress: {analytics.goalProgress}%</div>
              <div data-metric="comparison">Community Rank: {analytics.rank}</div>
            </div>
          ) : (
            // Crisis-safe analytics
            <div>
              <div className="crisis-safe-metric">
                {analytics.crisisSafeMessage}
              </div>
              <div className="crisis-safe-metric">
                Resilience Score: {analytics.focusMetrics.resilience}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### API Route Integration

```tsx
// src/app/api/save/route.ts
import { crisisSafetyMiddleware } from '@/middleware/crisis-safety-middleware';
import { professionalEscalationSystem } from '@/lib/crisis/professional-escalation-system';

export async function POST(req: Request) {
  try {
    const { content, userId } = await req.json();

    // Crisis safety check BEFORE processing
    const crisisCheck = await crisisSafetyMiddleware.interceptUserInteraction(
      req as any,
      content,
      userId
    );

    // Handle emergency response
    if (crisisCheck.emergencyResponse) {
      return crisisCheck.emergencyResponse;
    }

    // Check for professional escalation needs
    if (crisisCheck.overrideState === 'professional_escalation') {
      await professionalEscalationSystem.evaluateEscalation(
        userId,
        { /* crisis result */ },
        { /* user context */ }
      );
    }

    // Normal processing only if no crisis override
    if (crisisCheck.shouldContinue) {
      // Save journal entry with crisis-safe processing
      await saveJournalEntry(userId, content, {
        crisisSafeMode: crisisCheck.businessMetricsSuspended
      });
    }

    return Response.json({
      success: true,
      crisisOverride: crisisCheck.businessMetricsSuspended
    });

  } catch (error) {
    return Response.json({ error: 'Save failed' }, { status: 500 });
  }
}
```

## Key Integration Points

### 1. Middleware Integration (Already Implemented)
The main middleware now includes crisis safety as the **first priority**:
- Intercepts ALL requests
- Can override business logic
- Returns emergency responses immediately

### 2. Business Metric Suspension
Automatically hides/disables:
- Streaks and goals
- Analytics and comparisons  
- Achievement notifications
- Performance pressure

### 3. UI Transformation
The Crisis Emergency Interface automatically:
- Simplifies navigation
- Adds emergency resources
- Changes color schemes
- Reduces cognitive burden

### 4. Professional Escalation
Automatically triggers when:
- Crisis severity reaches threshold
- User consents or legal mandate applies
- Professional network available
- Response time requirements met

## Testing the Crisis Safety Systems

### 1. Crisis Detection Test
```tsx
// Test crisis language detection
const testCrisisDetection = async () => {
  const result = await realTimeCrisisMonitor.processUserInteraction(
    'test-user',
    InteractionType.JOURNAL_ENTRY,
    'I feel hopeless and want to end it all',
    {}
  );
  
  console.log('Crisis detected:', result.crisisDetected);
  console.log('Risk level:', result.riskLevel);
  console.log('Business metrics suspended:', result.businessMetricsSuspended);
};
```

### 2. Business Metric Suspension Test
```tsx
// Test business metric suspension
const testBusinessSuspension = async () => {
  await businessMetricOverride.suspendBusinessMetrics(
    'test-user',
    CrisisSeverityLevel.HIGH,
    'testing_crisis_systems'
  );
  
  const suspended = businessMetricOverride.areBusinessMetricsSuspended('test-user');
  console.log('Metrics suspended:', suspended);
};
```

### 3. Emergency Resource Test
```tsx
// Test emergency resource loading time
const testResourceLoadTime = async () => {
  const startTime = Date.now();
  
  const resources = await globalCrisisResources.getCrisisResources(userContext, 8);
  
  const loadTime = Date.now() - startTime;
  console.log('Resource load time:', loadTime, 'ms');
  console.log('Under 3 seconds:', loadTime < 3000);
};
```

## Monitoring and Health Checks

### System Health Monitoring
```tsx
// Monitor all crisis systems
const monitorCrisisSystems = () => {
  const middlewareHealth = crisisSafetyMiddleware.healthCheck();
  const monitorHealth = realTimeCrisisMonitor.getHealthStatus();
  const businessHealth = businessMetricOverride.healthCheck();
  const escalationHealth = professionalEscalationSystem.healthCheck();

  console.log('Crisis Systems Health:', {
    middleware: middlewareHealth,
    monitor: monitorHealth,
    business: businessHealth,
    escalation: escalationHealth
  });
};
```

## Configuration and Customization

### Crisis Detection Sensitivity
Adjust detection thresholds in crisis detection engine configuration.

### Business Metric Categories
Configure which metrics get suspended in business-metric-override.ts.

### Professional Network
Add professionals to the escalation system via admin interface.

### Cultural Adaptations
Customize crisis resources for different cultural contexts.

## Security and Privacy

All crisis safety systems maintain:
- **Privacy-preserving detection** (AI summaries only)
- **Encrypted crisis logs**
- **Minimal data retention**
- **User consent management**
- **HIPAA-compliant processes**

## Emergency Contacts

- Crisis Text Line: Text HOME to 741741
- National Suicide Prevention Lifeline: 988
- Emergency Services: 911

---

**Remember: These systems are designed to save lives. Every component prioritizes user safety over business objectives. When in doubt, err on the side of safety.**