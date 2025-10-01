# ALCHM User Flow Tracking Implementation Guide

## Overview
This guide shows you exactly how to add tracking calls to capture actual user flows in your ALCHM application. The analytics system is already set up - you just need to add the tracking calls at the right places.

## Quick Start Checklist

### ✅ Already Done
- Analytics infrastructure (`src/lib/analytics.ts`)
- Firebase Analytics integration
- Comprehensive tracking functions
- Updated Stripe integration with tracking

### 🎯 What You Need to Add
- Tracking calls in your React components
- Page view tracking on route changes
- Event tracking on user interactions

## Implementation Steps

### 1. Import Tracking Functions

```typescript
// Add to the top of any component where you want tracking
import { 
  trackPageView,
  trackJournalEntryStart,
  trackJournalEntrySave,
  trackUpgradePageView,
  trackUpgradeButtonClick,
  trackMoodTracked,
  trackCustomEvent
} from '@/lib/analytics';
```

### 2. Page View Tracking

**Add this to EVERY page component:**

```typescript
// In your page components (pages in src/app/)
useEffect(() => {
  trackPageView('page_name', {
    source: 'direct', // or get from URL params
    user_tier: 'free' // get from user context
  });
}, []);
```

**Example locations to add:**
- `src/app/page.tsx` - Home page
- `src/app/dashboard/page.tsx` - Dashboard 
- `src/app/write/page.tsx` - Journal writing
- `src/app/journals/page.tsx` - Journal list
- `src/app/upgrade/page.tsx` ✅ Already added!

### 3. Journal Flow Tracking

**In your journal writing component (`src/app/write/page.tsx`):**

```typescript
// Track when user starts writing
useEffect(() => {
  if (content.length === 1) { // First character
    trackJournalEntryStart('direct');
  }
}, [content]);

// Track when entry is saved
const handleSave = async () => {
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  
  await trackJournalEntrySave(wordCount, timeSpent, mood, hasAIInteraction);
  
  // Then save the entry...
};

// Track mood changes
const handleMoodChange = (newMood: number) => {
  setMood(newMood);
  trackMoodTracked(newMood, 'journal_entry');
};
```

### 4. Authentication Flow Tracking

**In your auth components:**

```typescript
// Login success
import { trackLogin } from '@/lib/analytics';

const handleLoginSuccess = (provider: 'google' | 'apple' | 'email_link') => {
  trackLogin(provider);
};

// Sign up success  
import { trackSignUp } from '@/lib/analytics';

const handleSignUpSuccess = (method: 'google' | 'apple' | 'email_link') => {
  trackSignUp(method);
};
```

### 5. AI Interaction Tracking

**When users request AI insights:**

```typescript
const requestAIInsight = async (type: string) => {
  const requestStart = Date.now();
  
  // Track request
  await trackAIInsightRequest(entryText.length, type);
  
  try {
    const response = await fetch('/api/ai-insight', { /* ... */ });
    const responseTime = Date.now() - requestStart;
    
    // Track successful response
    await trackAIInsightReceived(type, responseTime);
    
  } catch (error) {
    // Track errors
    await trackCustomEvent('ai_insight_error', {
      type,
      error: error.message
    });
  }
};
```

### 6. Pathway/Feature Tracking

**When users start pathways:**

```typescript
// Track pathway view
useEffect(() => {
  trackPathwayView(pathwayId, 'pathways_page');
}, [pathwayId]);

// Track pathway start
const startPathway = () => {
  const isFirstTime = !user.completedPathways?.includes(pathwayId);
  trackPathwayStart(pathwayId, isFirstTime);
};
```

### 7. Error and Edge Case Tracking

**Add error tracking throughout your app:**

```typescript
// In error boundaries or catch blocks
const handleError = (error: Error, context: string) => {
  trackCustomEvent('app_error', {
    error_message: error.message,
    error_stack: error.stack,
    context,
    page: window.location.pathname,
    user_tier: user?.tier || 'free'
  });
};
```

## Key Tracking Points by User Journey

### 🏠 Landing & Discovery
```typescript
// Home page view
trackPageView('home', { source: utm_source });

// About page view  
trackPageView('about', { source: 'navigation' });

// Pricing page view
trackPricingPageView('header_cta');
```

### 👤 Authentication & Onboarding
```typescript
// Sign up completed
trackSignUp('google');

// Onboarding started
trackOnboardingStart('post_signup');

// Onboarding step completed
trackOnboardingStepComplete(1, 'welcome_message', 45);

// Onboarding completed
trackOnboardingComplete(180, 5);
```

### ✍️ Core Product Usage
```typescript
// Started writing first entry
trackJournalEntryStart('onboarding_prompt');

// Saved first entry
trackFirstJournalEntry(wordCount, mood);

// Dashboard viewed
trackPageView('dashboard', { entries_count: userEntries.length });
```

### 🤖 AI Interactions
```typescript
// Requested AI insight
trackAIInsightRequest(entryLength, 'emotional_pattern');

// AI insight received
trackAIInsightReceived('emotional_pattern', 1200);

// User found insight helpful
trackAIInsightFeedback(true, 'emotional_pattern');
```

### 💰 Upgrade Funnel
```typescript
// Viewed upgrade page ✅ Already implemented!
trackUpgradePageView('journal_limit_modal');

// Clicked upgrade button ✅ Already implemented!
trackUpgradeButtonClick('deep-cut', 'upgrade_page');

// Started checkout ✅ Already implemented!
trackCheckoutStart('deep-cut', 4.99);
```

## Priority Implementation Order

### Week 1: Core Tracking
1. **Page view tracking** - Add to all main pages
2. **Journal flow tracking** - Add to write/save flow  
3. **Auth flow tracking** - Add to login/signup

### Week 2: Engagement Tracking
1. **AI interaction tracking** - Add to AI features
2. **Feature discovery tracking** - Add to new feature usage
3. **Pathway tracking** - Add to pathway flows

### Week 3: Conversion Optimization
1. **Error tracking** - Add comprehensive error capture
2. **Performance tracking** - Add timing measurements
3. **A/B test tracking** - Add variant tracking

## Testing Your Implementation

### 1. Check Browser Console
Open browser dev tools and look for analytics events being fired:
```javascript
// You should see these in console:
// "Analytics event: page_view"  
// "Analytics event: journal_entry_start"
```

### 2. Firebase Analytics Dashboard
- Go to Firebase Console → Analytics
- Check Events tab for your custom events
- Verify data is flowing correctly

### 3. Real-time Testing
```typescript
// Add temporary console logs to verify
const trackWithLog = async (event: string, data: any) => {
  console.log(`🔥 Tracking: ${event}`, data);
  await trackCustomEvent(event, data);
};
```

## Common Patterns & Best Practices

### ✅ DO
- Track page views on every page
- Include context data (source, tier, etc.)
- Track both successful and failed actions
- Use consistent event naming
- Track timing for key interactions

### ❌ DON'T  
- Track too frequently (e.g., every keystroke)
- Include sensitive data in events
- Block UI while tracking events
- Assume tracking is working without testing

## Data You'll Get

With proper implementation, you'll track:

### User Journey Data
- How users discover your app (traffic sources)
- Where users drop off (conversion funnel)
- Which features drive engagement
- What leads to upgrades

### Product Insights
- Most used features
- AI interaction patterns  
- Journal writing behavior
- Pathway completion rates

### Business Metrics
- Conversion rates by source
- Upgrade funnel performance
- User lifetime value indicators
- Retention patterns

## Need Help?

The analytics system is ready - you just need to add the tracking calls. Start with page views and journal flows, then expand from there. Each tracking call you add gives you more insight into how users actually use ALCHM.

Remember: Every user interaction is a data point that can help you improve the product!