/**
 * Crisis-Safe Guided Experience Component
 * 
 * GUARDIAN ANGEL MODE: Every interaction is designed to protect and support users in crisis
 * 
 * This component wraps the entire guided experience with comprehensive crisis detection,
 * safe exit points, gentle boundaries, and culturally-responsive intervention systems.
 * 
 * Every line of code here could save a life.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  crisisSafetyCoordinator, 
  type CrisisContextType, 
  type InterventionStrategyType 
} from '@/lib/crisis-safety-coordinator';
import { EnhancedCrisisIntervention } from '@/components/EnhancedCrisisIntervention';
import { CrisisFloatingButton } from '@/components/ui/CrisisFloatingButton';
import { PostWritingCare } from '@/components/ui/PostWritingCare';
import { PanicSafeNavigation } from '@/components/PanicSafeNavigation';
import { useAuth } from '@/lib/useAuth';
import { analytics } from '@/lib/analytics';
import { logger } from '@/lib/logging';
import ComprehensiveGuidedExperience from './ComprehensiveGuidedExperience';

interface CrisisSafeGuidedExperienceProps {
  children: React.ReactNode;
  userContext?: any;
  emergencyBypassEnabled?: boolean;
}

interface UsageMonitoringState {
  sessionStart: number;
  interactionCount: number;
  totalTimeSpent: number;
  lastInteractionTime: number;
  obsessiveWarningShown: boolean;
  isolationWarningShown: boolean;
  gentleBreakSuggested: boolean;
}

export default function CrisisSafeGuidedExperience({
  children,
  userContext,
  emergencyBypassEnabled = true
}: CrisisSafeGuidedExperienceProps) {
  const { user } = useAuth();
  const [activeIntervention, setActiveIntervention] = useState<InterventionStrategyType | null>(null);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [safeExitPoints, setSafeExitPoints] = useState<string[]>([]);
  const [crisisResources, setCrisisResources] = useState<any[]>([]);
  const [gentleBoundaryActive, setGentleBoundaryActive] = useState(false);
  const [usageMonitoring, setUsageMonitoring] = useState<UsageMonitoringState>({
    sessionStart: Date.now(),
    interactionCount: 0,
    totalTimeSpent: 0,
    lastInteractionTime: Date.now(),
    obsessiveWarningShown: false,
    isolationWarningShown: false,
    gentleBreakSuggested: false
  });
  
  const [crisisContext, setCrisisContext] = useState<CrisisContextType>({
    currentState: 'onboarding',
    timeInState: 0,
    userInteractionLevel: 'passive',
    usagePatterns: {
      sessionDuration: 0,
      dailyUsage: 0,
      writeFrequency: 0
    },
    environmentalFactors: {
      timeOfDay: getCurrentTimeOfDay(),
      dayOfWeek: getCurrentDayOfWeek(),
      isOffline: !navigator.onLine,
      deviceType: getDeviceType()
    }
  });

  const [offlineMode, setOfflineMode] = useState(!navigator.onLine);
  const [emergencyKeySequence, setEmergencyKeySequence] = useState<string[]>([]);
  const contentSummaryRef = useRef<string>('');
  const lastCrisisCheck = useRef<number>(0);
  const interventionActive = useRef<boolean>(false);

  // Monitor online/offline status for crisis resource availability
  useEffect(() => {
    const handleOnline = () => {
      setOfflineMode(false);
      logger.info('Crisis-Safe Experience: Online mode restored');
    };

    const handleOffline = () => {
      setOfflineMode(true);
      logger.info('Crisis-Safe Experience: Offline mode - crisis resources cached');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Emergency keyboard shortcuts for crisis intervention
  useEffect(() => {
    if (!emergencyBypassEnabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Emergency sequence: Shift + Alt + H (Help)
      if (event.shiftKey && event.altKey && event.key === 'H') {
        event.preventDefault();
        triggerEmergencyCrisisSupport();
        return;
      }

      // Track key sequence for other emergency patterns
      setEmergencyKeySequence(prev => {
        const newSequence = [...prev, event.key].slice(-5); // Keep last 5 keys
        
        // Check for distress patterns in typing
        if (newSequence.join('').toLowerCase().includes('help')) {
          triggerGentleCrisisCheck();
        }

        return newSequence;
      });
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [emergencyBypassEnabled]);

  // Monitor usage patterns for gentle boundary interventions
  useEffect(() => {
    const monitoringInterval = setInterval(() => {
      if (!user?.uid) return;

      const currentTime = Date.now();
      const sessionDuration = currentTime - usageMonitoring.sessionStart;
      const timeSinceLastInteraction = currentTime - usageMonitoring.lastInteractionTime;

      // Check for obsessive usage (>2 hours continuous)
      if (sessionDuration > 2 * 60 * 60 * 1000 && !usageMonitoring.obsessiveWarningShown) {
        triggerGentleBoundaryIntervention('obsessive_usage');
        setUsageMonitoring(prev => ({ ...prev, obsessiveWarningShown: true }));
      }

      // Check for isolation patterns (long sessions without breaks)
      if (sessionDuration > 3 * 60 * 60 * 1000 && !usageMonitoring.isolationWarningShown) {
        triggerGentleBoundaryIntervention('isolation_concern');
        setUsageMonitoring(prev => ({ ...prev, isolationWarningShown: true }));
      }

      // Suggest gentle break after 1 hour if actively engaged
      if (sessionDuration > 60 * 60 * 1000 && 
          crisisContext.userInteractionLevel === 'engaged' && 
          !usageMonitoring.gentleBreakSuggested) {
        triggerGentleBoundaryIntervention('gentle_break');
        setUsageMonitoring(prev => ({ ...prev, gentleBreakSuggested: true }));
      }

      // Update usage monitoring
      const updatedMonitoring = {
        ...usageMonitoring,
        totalTimeSpent: sessionDuration,
        lastInteractionTime: timeSinceLastInteraction > 5 * 60 * 1000 ? currentTime : usageMonitoring.lastInteractionTime
      };

      setUsageMonitoring(updatedMonitoring);

      // Monitor with crisis safety coordinator
      const patterns = crisisSafetyCoordinator.monitorUsagePatterns(
        user.uid,
        crisisContext.currentState,
        sessionDuration,
        crisisContext
      );

      if (patterns.interventionNeeded) {
        triggerUsageBasedIntervention(patterns.boundaryRecommendation);
      }

    }, 30000); // Check every 30 seconds

    return () => clearInterval(monitoringInterval);
  }, [user?.uid, usageMonitoring.sessionStart, crisisContext]);

  // Real-time crisis detection on content changes
  const performCrisisAssessment = useCallback(async (contentSummary: string) => {
    if (!user?.uid || !contentSummary.trim() || interventionActive.current) return;
    
    const now = Date.now();
    
    // Rate limit crisis checks (max once per 5 seconds to avoid overwhelming)
    if (now - lastCrisisCheck.current < 5000) return;
    lastCrisisCheck.current = now;

    try {
      interventionActive.current = true;
      
      const assessment = await crisisSafetyCoordinator.assessAndIntervene(
        contentSummary,
        user.uid,
        userContext || {
          location: { country: 'United States', timezone: 'UTC' },
          preferences: { 
            languages: ['English'], 
            ageGroup: 'adult' as const,
            lgbtqContext: false,
            immigrationStatus: 'unknown' as const
          },
          urgencyLevel: 'moderate' as const,
          accessMethod: 'any' as const
        },
        crisisContext
      );

      if (assessment.intervention) {
        setActiveIntervention(assessment.intervention);
        setSafeExitPoints(assessment.safeExitPoints);
        setCrisisResources(assessment.immediateResources);
        
        // Show intervention based on priority
        if (['immediate', 'urgent'].includes(assessment.intervention.priority)) {
          setShowCrisisSupport(true);
        } else {
          // For moderate interventions, show gentle support
          triggerGentleCrisisCheck();
        }

        // Track crisis intervention
        analytics.track('crisis', 'intervention_shown', assessment.intervention.priority);
      }

    } catch (error) {
      logger.error('Crisis assessment failed', error);
      
      // Safe fallback - show basic crisis support for any error
      triggerEmergencyCrisisSupport();
    } finally {
      interventionActive.current = false;
    }
  }, [user?.uid, userContext, crisisContext]);

  // Trigger emergency crisis support immediately
  const triggerEmergencyCrisisSupport = useCallback(() => {
    setShowCrisisSupport(true);
    setActiveIntervention({
      priority: 'immediate',
      culturalAdaptations: [],
      resourceRecommendations: ['988', '741741'],
      safetyPlanning: true,
      followUpScheduled: true,
      escalationThreshold: 1.0,
      interventionMessage: 'We want to make sure you\'re safe. Crisis support is available right now.',
      supportActions: [{
        actionType: 'resource_access',
        priority: 1,
        culturallyAdapted: false
      }]
    });

    // Provide immediate resources
    setCrisisResources([
      {
        type: 'hotline',
        name: '988 Suicide & Crisis Lifeline',
        contact: '988',
        description: 'Immediate 24/7 crisis support',
        available24h: true,
        languages: ['English', 'Spanish'],
        costFree: true,
        confidential: true
      },
      {
        type: 'text_line',
        name: 'Crisis Text Line',
        contact: 'Text HOME to 741741',
        description: 'Crisis counselor via text',
        available24h: true,
        languages: ['English', 'Spanish'],
        costFree: true,
        confidential: true
      }
    ]);

    analytics.track('crisis', 'emergency_triggered', 'manual');
    logger.info('Emergency crisis support activated');
  }, []);

  // Gentle crisis check for subtle concerns
  const triggerGentleCrisisCheck = useCallback(() => {
    setGentleBoundaryActive(true);
    
    // Auto-hide gentle boundary after 10 seconds if not interacted with
    setTimeout(() => {
      setGentleBoundaryActive(false);
    }, 10000);

    analytics.track('crisis', 'gentle_check_triggered');
  }, []);

  // Handle gentle boundary interventions
  const triggerGentleBoundaryIntervention = useCallback((type: string) => {
    setGentleBoundaryActive(true);
    
    analytics.track('crisis', 'boundary_intervention', type);
    logger.info('Gentle boundary intervention triggered', { type });
  }, []);

  // Handle usage-based interventions
  const triggerUsageBasedIntervention = useCallback((recommendationType: string | null) => {
    if (!recommendationType) return;

    setGentleBoundaryActive(true);
    
    // Show appropriate boundary message based on recommendation type
    analytics.track('crisis', 'usage_intervention', recommendationType);
  }, []);

  // Handle content summary updates from writing components
  const handleContentSummaryUpdate = useCallback((summary: string) => {
    contentSummaryRef.current = summary;
    
    // Debounced crisis assessment
    const timeoutId = setTimeout(() => {
      if (summary.trim().length > 20) { // Only assess substantial content
        performCrisisAssessment(summary);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [performCrisisAssessment]);

  // Update crisis context based on current user state
  const updateCrisisContext = useCallback((
    newState: CrisisContextType['currentState'],
    interactionLevel: CrisisContextType['userInteractionLevel'] = 'active'
  ) => {
    setCrisisContext(prev => ({
      ...prev,
      currentState: newState,
      timeInState: Date.now() - (prev.timeInState || Date.now()),
      userInteractionLevel: interactionLevel,
      usagePatterns: {
        ...prev.usagePatterns,
        sessionDuration: Date.now() - usageMonitoring.sessionStart
      }
    }));

    // Track state change
    analytics.trackNavigation.pageView(newState);
  }, [usageMonitoring.sessionStart]);

  // Handle crisis intervention resolution
  const handleCrisisResolution = useCallback(() => {
    setShowCrisisSupport(false);
    setActiveIntervention(null);
    
    if (user?.uid) {
      crisisSafetyCoordinator.resolveIntervention(user.uid);
    }
    
    analytics.track('crisis', 'intervention_resolved');
    logger.info('Crisis intervention resolved');
  }, [user?.uid]);

  // Handle gentle boundary dismissal
  const handleBoundaryDismissal = useCallback(() => {
    setGentleBoundaryActive(false);
    analytics.track('crisis', 'boundary_dismissed');
  }, []);

  // Render gentle boundary overlay
  const renderGentleBoundary = () => {
    if (!gentleBoundaryActive) return null;

    const boundaryMessage = getBoundaryMessage();

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-4 right-4 z-40 flex justify-center pointer-events-none"
        >
          <div className="bg-gradient-to-r from-sage-50 to-sage-100 border border-sage-200 rounded-2xl p-4 shadow-soft max-w-md pointer-events-auto">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-sage-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sage-600 text-sm">💙</span>
              </div>
              <div className="flex-1">
                <p className="text-sage-800 text-sm leading-relaxed">
                  {boundaryMessage}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleBoundaryDismissal}
                    className="px-3 py-1 bg-sage-200 hover:bg-sage-300 text-sage-700 rounded-full text-xs transition-colors"
                  >
                    I'm okay
                  </button>
                  <button
                    onClick={triggerEmergencyCrisisSupport}
                    className="px-3 py-1 bg-sage-400 hover:bg-sage-500 text-white rounded-full text-xs transition-colors"
                  >
                    I need support
                  </button>
                </div>
              </div>
              <button
                onClick={handleBoundaryDismissal}
                className="w-5 h-5 text-sage-400 hover:text-sage-600 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Get appropriate boundary message
  const getBoundaryMessage = (): string => {
    const sessionDuration = Date.now() - usageMonitoring.sessionStart;
    const hours = Math.floor(sessionDuration / (1000 * 60 * 60));

    if (hours >= 3) {
      return "You've been here for a while. Sometimes taking a break helps us process our thoughts. Your well-being matters.";
    } else if (hours >= 2) {
      return "Taking time for reflection is beautiful. A gentle break might help you integrate what you've discovered.";
    } else if (hours >= 1) {
      return "You're doing important inner work. Consider stepping outside or connecting with someone who cares about you.";
    }

    return "Your dedication to self-reflection is admirable. Remember to be gentle with yourself throughout this process.";
  };

  return (
    <div className="relative min-h-screen bg-sanctuary-white">
      {/* Crisis-safe navigation with panic-resistant design */}
      <PanicSafeNavigation 
        safeExitPoints={safeExitPoints}
        emergencyCallback={triggerEmergencyCrisisSupport}
        offlineMode={offlineMode}
      />

      {/* Gentle boundary system */}
      {renderGentleBoundary()}

      {/* Main content with crisis context tracking */}
      <div 
        className="relative"
        onFocus={() => updateCrisisContext(crisisContext.currentState, 'engaged')}
        onBlur={() => updateCrisisContext(crisisContext.currentState, 'passive')}
      >
        <ComprehensiveGuidedExperience 
          onContentSummaryUpdate={handleContentSummaryUpdate}
          onStateChange={updateCrisisContext}
          crisisSafeMode={activeIntervention !== null}
        />
      </div>

      {/* Crisis intervention modal */}
      <AnimatePresence>
        {showCrisisSupport && activeIntervention && (
          <EnhancedCrisisIntervention
            contentSummary={contentSummaryRef.current}
            userId={user?.uid || 'anonymous'}
            userContext={userContext}
            isVisible={showCrisisSupport}
            onClose={handleCrisisResolution}
            onContinueWriting={() => {
              setShowCrisisSupport(false);
              updateCrisisContext('writing', 'engaged');
            }}
            onResourceAccessed={(resourceId, resourceType) => {
              analytics.track('crisis', 'resource_accessed', resourceType, undefined, { resourceId });
            }}
          />
        )}
      </AnimatePresence>

      {/* Always-accessible crisis support button */}
      <CrisisFloatingButton
        onClick={triggerEmergencyCrisisSupport}
        offlineMode={offlineMode}
        urgentMode={activeIntervention?.priority === 'immediate'}
      />

      {/* Post-writing care for emotional support after journaling */}
      <PostWritingCare
        isVisible={crisisContext.currentState === 'writing' && crisisContext.timeInState > 5 * 60 * 1000}
        onClose={() => updateCrisisContext('reflection')}
        crisisSupported={activeIntervention !== null}
      />

      {/* Offline indicator for crisis resource availability */}
      {offlineMode && (
        <div className="fixed bottom-20 left-4 bg-amber-100 border border-amber-200 text-amber-800 px-3 py-2 rounded-full text-xs">
          Offline - Crisis resources cached
        </div>
      )}
    </div>
  );
}

// Utility functions
function getCurrentTimeOfDay(): CrisisContextType['environmentalFactors']['timeOfDay'] {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 8) return 'early_morning';
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'late_night';
}

function getCurrentDayOfWeek(): CrisisContextType['environmentalFactors']['dayOfWeek'] {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  return days[new Date().getDay()];
}

function getDeviceType(): CrisisContextType['environmentalFactors']['deviceType'] {
  if (typeof window === 'undefined') return 'desktop';
  
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
  if (/mobile|android|iphone|ipod|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
  return 'desktop';
}