# ALCHM Gamification Metrics & Analytics Specification

## North Star Metrics

### Primary KPI
**Weekly Reflection Completions per DAU (WRC/DAU)**
- Formula: `(Journal Entries + Quest Completions) / Weekly Active Users`
- Target: +20% week-over-week improvement
- Tracking: Daily cohort analysis with 7-day rolling windows

### Secondary KPIs
1. **D7 Retention Rate** ≥ 70%
2. **Premium Conversion Rate** ≥ 20%
3. **Badge Unlock Velocity** (Time to first badge)
4. **K-factor** (Referral coefficient)

## Event Taxonomy

### Core Gamification Events
```javascript
// Streak & Progress Events
'streak_started'              // First journal entry ever
'streak_incremented'          // Daily streak continuation  
'grace_used'                  // Grace token utilized to maintain streak
'recovery_multiplier_applied' // Bonus XP after return from break
'streak_paused'              // Kindness break requested
'streak_resumed'             // Return from pause

// Quest & Reflection Events  
'quest_started'              // 5-minute quest initiated
'quest_step_completed'       // Individual quest step finished
'quest_paused'               // "I need a pause" used in quest
'quest_completed'            // Full 3-step quest finished
'quest_abandoned'            // Quest not completed within 24h

// Achievement & Progression Events
'badge_earned'               // Badge unlocked with level/tree
'level_up'                   // User XP level increase
'xp_awarded'                 // XP granted for any action
'tree_completed'             // Full badge tree (3 levels) completed

// Community & Social Events
'challenge_joined'           // Anonymous challenge participation
'challenge_completed'        // Challenge goal achieved
'share_card_created'         // Reflection receipt generated
'share_card_shared'          // Receipt shared to social media
'referral_sent'              // Referral link shared
'referral_converted'         // Friend joined via referral

// Subscription & Monetization Events
'subscription_activated'     // Premium tier purchased
'trial_started'              // Free trial activated (referral/review)
'trial_converted'            // Trial converted to paid
'subscription_churned'       // Premium cancellation

// Safety & Support Events
'crisis_detection_triggered' // High-risk content identified
'pause_requested'            // Kindness break initiated
'pause_ended'               // Return from break
'support_resource_accessed'  // Crisis resources viewed/contacted
```

### Event Properties Schema
```javascript
{
  userId: string,           // User identifier
  event: GamificationEvent, // Event type from taxonomy above
  timestamp: Timestamp,     // Event occurrence time
  sessionId: string,        // Session tracking
  version: '2.0_grace_based', // Gamification version
  metadata: {
    // Event-specific properties
    badgeKey?: string,
    level?: number,
    xpAwarded?: number,
    streakDays?: number,
    graceTokensUsed?: number,
    recoveryMultiplier?: number,
    questTheme?: string,
    challengeId?: string,
    // ... other relevant properties
  }
}
```

## Behavioral Cohorts

### User Segmentation
1. **Newcomers**: 0-3 days, focusing on onboarding completion
2. **Explorers**: 4-14 days, establishing habit patterns  
3. **Builders**: 15-30 days, deepening engagement
4. **Masters**: 31+ days, advanced features and mentoring

### Grace Usage Patterns
- **Grace Avoiders**: Never use grace tokens (potential perfectionists)
- **Grace Users**: Regular grace token utilization (healthy boundary setting)
- **Pause Takers**: Frequent kindness breaks (trauma-informed usage)

### Engagement Archetypes
- **Streak Seekers**: Motivated by consistency metrics
- **Quest Completers**: Prefer structured guided reflections
- **Badge Collectors**: Achievement-oriented progression
- **Community Participants**: Social challenges and sharing

## Success Metrics by Mechanic

### Grace-Based Streaks
- **Streak Survival Rate**: % of users maintaining 7+ day streaks
- **Grace Token Utilization**: Average tokens used per user per week
- **Recovery Multiplier Effectiveness**: Engagement post-break vs pre-break
- **Pause-to-Return Rate**: % of paused users who resume within planned timeframe

**Target KPIs**:
- Grace token usage: 60% of users utilize ≥1 token/week
- Pause return rate: ≥80% return within planned timeframe
- Post-break engagement: +25% XP earning in first 3 days back

### Reflection Quests
- **Quest Completion Rate**: % of started quests finished (target: ≥70%)
- **Average Quest Duration**: Time to complete 3-step flow (target: 5-7 minutes)
- **Pause Usage in Quests**: % utilizing "I need a pause" (healthy: 10-15%)
- **Quest-to-Badge Conversion**: Quests completed per insight badge earned

**Target KPIs**:
- Quest completion rate: ≥70%
- Average duration: 5-7 minutes
- Repeat quest rate: ≥40% complete multiple quests

### Badge Trees & Progression
- **Badge Unlock Velocity**: Time to first badge (target: ≤48 hours)
- **Tree Completion Rate**: % of users completing full badge trees
- **Badge Celebration Engagement**: Click-through on celebration messages
- **Cross-Tree Progression**: Users earning badges across multiple trees

**Target KPIs**:
- First badge: ≤48 hours for 70% of active users
- Tree completion: ≥25% complete at least one full tree by day 30
- Cross-tree: ≥50% earn badges in 2+ trees

### Community Challenges
- **Challenge Participation Rate**: % of eligible users joining challenges
- **Challenge Completion Rate**: % finishing challenge goals
- **Anonymity Comfort**: User feedback on privacy-safe participation
- **Challenge-to-Subscription**: Premium conversion rate post-challenge

**Target KPIs**:
- Participation: ≥30% of weekly active users
- Completion: ≥60% of participants achieve challenge goal
- Privacy comfort: ≥95% positive feedback on anonymity

## Analytics Implementation

### Firebase Analytics Integration
```javascript
// Custom event logging
import { logEvent } from 'firebase/analytics';

const logGamificationEvent = (eventName, parameters) => {
  logEvent(analytics, eventName, {
    ...parameters,
    gamification_version: '2.0_grace_based',
    timestamp: Date.now()
  });
};

// Example usage
logGamificationEvent('badge_earned', {
  badge_key: 'still_here',
  badge_level: 1,
  xp_awarded: 50,
  days_to_earn: 1,
  user_level: 2
});
```

### Real-time Dashboard Metrics
- **Live WRC/DAU**: Updated every 15 minutes
- **Streak Health**: Grace token usage and pause rates
- **Quest Performance**: Completion rates and average durations  
- **Badge Distribution**: Unlock rates across different trees
- **Safety Indicators**: Crisis detection rates and support usage

### Weekly Business Reviews
- **Cohort Retention Analysis**: D1, D3, D7, D14, D30 retention by feature usage
- **Feature Adoption Curves**: Time-to-adoption for each gamification mechanic
- **Monetization Funnels**: Free → Trial → Premium conversion paths
- **Safety & Wellbeing**: Crisis intervention effectiveness and user feedback

## A/B Testing Framework

### Active Experiments

#### Test 1: Grace vs Strict Streaks
- **Hypothesis**: Grace-based streaks increase D7 retention without harming engagement
- **Variants**: 
  - A: Traditional streak (reset on miss)
  - B: Grace-based (2 tokens/week, recovery multiplier)
- **Primary Metric**: D7 retention rate
- **Secondary Metrics**: WRC/DAU, grace token usage, user satisfaction
- **Sample Size**: 10,000 users per variant
- **Duration**: 4 weeks

#### Test 2: AI Archetype Personalization  
- **Hypothesis**: Personalized AI tone increases quest completion rates
- **Variants**:
  - A: Generic supportive tone
  - B: User-selected archetype (Sage/Coach/Poet)
- **Primary Metric**: Quest completion rate
- **Secondary Metrics**: AI interaction frequency, premium conversion
- **Sample Size**: 5,000 users per variant  
- **Duration**: 6 weeks

### Statistical Requirements
- **Minimum Effect Size**: 5% relative improvement
- **Statistical Power**: 80%
- **Significance Level**: α = 0.05
- **Multiple Testing Correction**: Bonferroni adjustment for multiple metrics

## Privacy & Ethical Analytics

### Data Collection Principles
1. **Minimal Collection**: Only data necessary for product improvement
2. **User Consent**: Clear opt-in for analytics beyond basic functionality
3. **Anonymization**: Personal identifiers removed from behavior analysis
4. **Right to Deletion**: Users can request complete data removal

### Sensitive Data Handling
- **Journal Content**: Never stored in analytics systems
- **Crisis Indicators**: Aggregated only, individual cases handled by clinical protocols
- **Demographic Data**: Optional and encrypted separately
- **Behavioral Patterns**: Anonymized cohort analysis only

### Ethical Guardrails
- **No Dark Patterns**: Metrics cannot incentivize manipulative design
- **Wellbeing First**: Safety metrics weighted above engagement metrics
- **Transparency**: Users can view their own analytics data
- **Regular Audits**: Monthly review of data usage and privacy compliance

## Reporting & Insights

### Daily Automated Reports
- WRC/DAU trend with 7-day moving average
- Streak health indicators and grace usage
- Quest completion funnel analysis
- Badge unlock distribution
- Crisis detection summary (anonymized)

### Weekly Strategic Reviews
- Cohort retention deep-dive by feature usage
- Monetization funnel performance
- User feedback sentiment analysis
- Competitive benchmark comparison
- Safety and wellbeing assessment

### Monthly Business Reviews
- Feature adoption lifecycle analysis  
- Premium conversion attribution modeling
- Churn prediction and intervention opportunities
- Product roadmap data-driven prioritization
- ROI analysis of gamification investment

## Tools & Infrastructure

### Analytics Stack
- **Collection**: Firebase Analytics + Custom Events
- **Storage**: BigQuery for raw data, Firestore for real-time
- **Processing**: Cloud Functions for real-time aggregations
- **Visualization**: Looker Studio for dashboards, Mixpanel for funnels
- **Alerting**: Cloud Monitoring for anomaly detection

### Data Pipeline
```
User Action → Firebase Analytics → Cloud Functions → BigQuery → Looker Studio
                ↓
          Real-time Aggregation → Firestore → Admin Dashboard
```

### Performance Monitoring
- **Query Performance**: Sub-100ms for real-time metrics
- **Data Freshness**: ≤5 minute delay for critical metrics
- **Dashboard Load Time**: ≤3 seconds for executive dashboards
- **Alert Response**: ≤1 minute for critical safety indicators

## Success Criteria & KPI Targets

### Week 1 Post-Launch
- ✅ Grace-based streaks: 70% of users earn first badge
- ✅ Quests: 50% complete at least one quest
- ✅ No critical privacy/safety issues
- 📊 Baseline WRC/DAU established

### Week 4 Post-Launch
- 📈 WRC/DAU: +20% vs baseline
- 🔄 D7 Retention: ≥70%
- 🏆 Badge Distribution: ≥3 badges/user median
- 💰 Premium Trials: ≥15% of active users

### Week 12 Post-Launch (Steady State)
- 🎯 WRC/DAU: Sustained +25% improvement
- 🔄 D7 Retention: ≥75%
- 💵 Premium Conversion: ≥20%
- 🤝 Referral K-factor: ≥0.15
- 🛡️ Safety: Zero streak-shame feedback, <0.1% crisis escalations

*"Data-driven compassion. Measure what matters for human flourishing."*