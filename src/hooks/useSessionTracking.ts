'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  trackSessionStart, 
  trackSessionEnd, 
  trackPageLoad, 
  trackFunnelStep,
  trackUserSatisfaction 
} from '@/lib/analytics';
import { useMonitor } from '@/lib/monitoring';

interface SessionData {
  sessionId: string;
  startTime: number;
  pageViews: number;
  lastActivity: number;
  userId?: string;
}

export function useSessionTracking(userId?: string) {
  const router = useRouter();
  const { getSessionId, setUserId } = useMonitor();
  const sessionData = useRef<SessionData | null>(null);
  const pageLoadStart = useRef<number>(Date.now());
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize session
    initializeSession();
    
    // Track page load performance
    trackPageLoadPerformance();
    
    // Set up activity tracking
    setupActivityTracking();
    
    // Set up beforeunload handler
    setupBeforeUnloadHandler();
    
    return () => {
      endSession();
      cleanupEventListeners();
    };
  }, []);

  useEffect(() => {
    if (userId) {
      setUserId(userId);
      updateSessionUserId(userId);
    }
  }, [userId, setUserId]);

  const initializeSession = () => {
    const sessionId = getSessionId();
    const startTime = Date.now();
    
    sessionData.current = {
      sessionId,
      startTime,
      pageViews: 1,
      lastActivity: startTime,
      userId
    };
    
    // Track session start
    trackSessionStart(sessionId);
    
    // Store session data
    storeSessionData();
  };

  const trackPageLoadPerformance = () => {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = Date.now() - pageLoadStart.current;
        trackPageLoad(window.location.pathname, loadTime);
      });
    }
  };

  const setupActivityTracking = () => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const updateActivity = () => {
      if (sessionData.current) {
        sessionData.current.lastActivity = Date.now();
        resetInactivityTimer();
      }
    };
    
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
    
    // Set initial inactivity timer
    resetInactivityTimer();
  };

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    
    // Consider session inactive after 30 minutes
    inactivityTimer.current = setTimeout(() => {
      endSession();
    }, 30 * 60 * 1000);
  };

  const setupBeforeUnloadHandler = () => {
    const handleBeforeUnload = () => {
      endSession();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // For mobile browsers
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        endSession();
      }
    });
  };

  const updateSessionUserId = (userId: string) => {
    if (sessionData.current) {
      sessionData.current.userId = userId;
      storeSessionData();
    }
  };

  const storeSessionData = () => {
    if (sessionData.current && typeof window !== 'undefined') {
      sessionStorage.setItem(
        `session_${sessionData.current.sessionId}`,
        JSON.stringify(sessionData.current)
      );
    }
  };

  const endSession = () => {
    if (sessionData.current) {
      const duration = Date.now() - sessionData.current.startTime;
      
      // Track session end
      trackSessionEnd(sessionData.current.sessionId, Math.floor(duration / 1000));
      
      // Send session data to server
      sendSessionData(sessionData.current, duration);
      
      // Clear session data
      sessionData.current = null;
    }
  };

  const cleanupEventListeners = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
  };

  const sendSessionData = async (session: SessionData, duration: number) => {
    try {
      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          userId: session.userId,
          startTime: session.startTime,
          endTime: Date.now(),
          duration,
          pageViews: session.pageViews,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          screen: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language
        })
      });
    } catch (error) {
      console.error('Failed to send session data:', error);
    }
  };

  // Public methods for manual tracking
  const trackPageView = (page: string) => {
    if (sessionData.current) {
      sessionData.current.pageViews += 1;
      sessionData.current.lastActivity = Date.now();
      storeSessionData();
    }
    
    const loadTime = Date.now() - pageLoadStart.current;
    trackPageLoad(page, loadTime);
    pageLoadStart.current = Date.now();
  };

  const trackFunnel = (funnelName: string, step: string, stepNumber: number) => {
    trackFunnelStep(funnelName, step, stepNumber);
  };

  const trackSatisfaction = (rating: number, feedback?: string) => {
    trackUserSatisfaction(rating, feedback);
  };

  const getSessionInfo = () => ({
    sessionId: sessionData.current?.sessionId,
    startTime: sessionData.current?.startTime,
    pageViews: sessionData.current?.pageViews,
    lastActivity: sessionData.current?.lastActivity
  });

  return {
    trackPageView,
    trackFunnel,
    trackSatisfaction,
    getSessionInfo
  };
}

// Hook for tracking specific user journeys
export function useJourneyTracking() {
  const { trackFunnel } = useSessionTracking();

  const trackJourneyStep = (journey: string, step: string) => {
    const journeySteps: Record<string, string[]> = {
      onboarding: [
        'landing',
        'signup_form',
        'email_verification',
        'profile_setup',
        'first_journal_entry',
        'completed'
      ],
      subscription: [
        'pricing_view',
        'plan_selection',
        'payment_method',
        'checkout',
        'confirmation',
        'activation'
      ],
      journal_creation: [
        'entry_start',
        'writing',
        'mood_selection',
        'ai_processing',
        'reflection_view',
        'save_complete'
      ]
    };

    const steps = journeySteps[journey];
    if (steps) {
      const stepNumber = steps.indexOf(step) + 1;
      if (stepNumber > 0) {
        trackFunnel(journey, step, stepNumber);
      }
    }
  };

  return { trackJourneyStep };
}