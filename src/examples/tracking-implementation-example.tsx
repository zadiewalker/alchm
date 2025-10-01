'use client';

// EXAMPLE: How to implement user flow tracking in ALCHM components
// This shows real examples of where and how to add tracking calls

import { useEffect, useState } from 'react';
import { 
  trackPageView, 
  trackJournalEntryStart, 
  trackJournalEntrySave,
  trackMoodTracked,
  trackUpgradePageView,
  trackUpgradeButtonClick,
  trackCheckoutStart,
  trackAIInsightRequest,
  trackAIInsightReceived,
  trackPathwayView,
  trackPathwayStart,
  trackFeatureDiscovered,
  trackFeatureFirstUse,
  trackCustomEvent
} from '@/lib/analytics';

// EXAMPLE 1: Page View Tracking
// Add this to every page component to track page views
export function ExamplePageComponent() {
  useEffect(() => {
    // Track page view when component mounts
    trackPageView('write_page');
  }, []);

  return <div>Your page content</div>;
}

// EXAMPLE 2: Journal Entry Flow Tracking
export function ExampleJournalComponent() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(5);
  const [startTime, setStartTime] = useState<number>(Date.now());
  
  // Track when user starts writing
  useEffect(() => {
    if (content.length === 1) { // First character typed
      trackJournalEntryStart();
      setStartTime(Date.now());
    }
  }, [content]);

  // Track mood selection
  const handleMoodChange = (newMood: number) => {
    setMood(newMood);
    trackMoodTracked(newMood);
  };

  // Track when entry is saved
  const handleSave = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    
    await trackJournalEntrySave(wordCount, mood);
    
    // Save the entry...
  };

  return (
    <div>
      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
      />
      <div>
        <label>Mood: </label>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={mood}
          onChange={(e) => handleMoodChange(parseInt(e.target.value))}
        />
      </div>
      <button onClick={handleSave}>Save Entry</button>
    </div>
  );
}

// EXAMPLE 3: Upgrade Funnel Tracking
export function ExampleUpgradeComponent() {
  useEffect(() => {
    // Track upgrade page view with source
    const source = new URLSearchParams(typeof window !== 'undefined' && window.location.search).get('source') || 'direct';
    trackUpgradePageView();
  }, []);

  const handleUpgradeClick = async (tier: 'deep-cut' | 'oracle') => {
    // Track button click
    await trackUpgradeButtonClick(tier);
    
    // Track checkout start
    const price = tier === 'oracle' ? 9.99 : 4.99;
    await trackCheckoutStart(tier, price);
    
    // Proceed with checkout...
  };

  return (
    <div>
      <button onClick={() => handleUpgradeClick('deep-cut')}>
        Upgrade to Deep Cut ($4.99)
      </button>
      <button onClick={() => handleUpgradeClick('oracle')}>
        Upgrade to Oracle ($9.99)
      </button>
    </div>
  );
}

// EXAMPLE 4: AI Interaction Tracking
export function ExampleAIComponent() {
  const [entry, setEntry] = useState('');
  
  const requestAIInsight = async (requestType: string) => {
    const requestStart = Date.now();
    
    // Track AI insight request
    await trackAIInsightRequest();
    
    try {
      // Make AI request...
      const response = await fetch('/api/ai-insight', {
        method: 'POST',
        body: JSON.stringify({ entry, type: requestType })
      });
      
      const responseTime = Date.now() - requestStart;
      
      // Track AI insight received
      await trackAIInsightReceived();
      
    } catch (error) {
      // Track error if needed
      await trackCustomEvent('ai_insight_error', {
        request_type: requestType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <div>
      <textarea 
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your entry..."
      />
      <button onClick={() => requestAIInsight('emotional_insight')}>
        Get AI Insight
      </button>
    </div>
  );
}

// EXAMPLE 5: Pathway/Feature Tracking
export function ExamplePathwayComponent({ pathwayId }: { pathwayId: string }) {
  useEffect(() => {
    // Track pathway view
    trackPathwayView(pathwayId);
  }, [pathwayId]);

  const startPathway = () => {
    // Check if first time (you'd get this from user data)
    const isFirstTime = true; // Replace with actual check
    trackPathwayStart(pathwayId);
    
    // Navigate to pathway...
  };

  return (
    <div>
      <h2>Pathway: {pathwayId}</h2>
      <button onClick={startPathway}>Start Pathway</button>
    </div>
  );
}

// EXAMPLE 6: Feature Discovery Tracking
export function ExampleFeatureDiscovery() {
  const handleFeatureClick = (featureName: string) => {
    // Track when user discovers a new feature
    trackFeatureDiscovered(featureName);
    
    // If it's their first use, track that too
    const daysSinceSignup = 7; // Get from user data
    trackFeatureFirstUse(featureName);
  };

  return (
    <div>
      <button onClick={() => handleFeatureClick('mood_tracking')}>
        Try Mood Tracking
      </button>
      <button onClick={() => handleFeatureClick('ai_insights')}>
        Get AI Insights
      </button>
    </div>
  );
}

// EXAMPLE 7: Custom Event Tracking for Unique Use Cases
export function ExampleCustomTracking() {
  const handleSpecialAction = () => {
    // Track custom events for specific business logic
    trackCustomEvent('special_feature_used', {
      feature_type: 'experimental',
      user_engagement_level: 'high',
      context: 'onboarding_flow'
    });
  };

  const handleErrorBoundary = (error: Error) => {
    // Track errors for debugging
    trackCustomEvent('app_error', {
      error_message: error.message,
      error_stack: error.stack,
      page: typeof window !== 'undefined' && window.location.pathname,
      user_agent: typeof window !== 'undefined' && navigator.userAgent
    });
  };

  return (
    <div>
      <button onClick={handleSpecialAction}>
        Use Special Feature
      </button>
    </div>
  );
}

// EXAMPLE 8: Tracking with React Hooks
export function usePageViewTracking(pageName: string, additionalData?: Record<string, any>) {
  useEffect(() => {
    trackPageView(pageName);
  }, [pageName, additionalData]);
}

export function useTimingTracking() {
  const [startTime] = useState(Date.now());

  const getTimeSpent = () => {
    return Math.floor((Date.now() - startTime) / 1000);
  };

  return { getTimeSpent };
}

// HOW TO USE THESE EXAMPLES:
/*

1. Import the tracking functions you need:
   import { trackPageView, trackJournalEntryStart } from '@/lib/analytics';

2. Add tracking calls at key user interaction points:
   - When pages load (useEffect)
   - When buttons are clicked (onClick handlers)  
   - When forms are submitted (onSubmit)
   - When errors occur (catch blocks)
   - When features are first used (conditional logic)

3. Include relevant context data:
   - User tier (free/paid)
   - Time spent on actions
   - Success/failure states
   - Source of traffic/actions

4. Track the complete user journey:
   - Landing → Registration → Onboarding → First Use → Engagement → Conversion

5. For conversion funnels, track each step:
   - View upgrade page
   - Click upgrade button  
   - Start checkout
   - Complete/abandon checkout

*/