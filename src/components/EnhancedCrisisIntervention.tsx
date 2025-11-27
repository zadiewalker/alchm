/**
 * Enhanced Crisis Intervention Component
 * 
 * MISSION CRITICAL: Provide immediate, culturally competent crisis support
 * with sub-3-second response times and privacy-preserving intervention.
 * 
 * This component serves as the primary crisis intervention interface,
 * integrating enhanced detection, global resources, and trauma-informed care.
 */

"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  enhancedCrisisDetection, 
  type CrisisDetectionInputType, 
  type CrisisDetectionOutputType 
} from '@/lib/enhanced-crisis-detection';
import { 
  globalCrisisResources, 
  getQuickEmergencyResources,
  type UserContext 
} from '@/lib/global-crisis-resources';
import { logger } from '@/lib/logging';

interface EnhancedCrisisInterventionProps {
  // AI-generated summary only (never raw content for privacy)
  contentSummary: string;
  userId: string;
  userContext: UserContext;
  isVisible: boolean;
  onClose: () => void;
  onContinueWriting: () => void;
  onResourceAccessed: (resourceId: string, resourceType: string) => void;
}

interface InterventionState {
  step: 'detection' | 'assessment' | 'resources' | 'safety_planning' | 'follow_up';
  crisisDetection: CrisisDetectionOutputType | null;
  userResponse: string | null;
  breathingActive: boolean;
  resourcesAccessed: string[];
  interventionStartTime: number;
}

export function EnhancedCrisisIntervention({
  contentSummary,
  userId,
  userContext,
  isVisible,
  onClose,
  onContinueWriting,
  onResourceAccessed
}: EnhancedCrisisInterventionProps) {
  const [state, setState] = useState<InterventionState>({
    step: 'detection',
    crisisDetection: null,
    userResponse: null,
    breathingActive: false,
    resourcesAccessed: [],
    interventionStartTime: Date.now()
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!typeof window !== 'undefined' && navigator.onLine);
  
  // Enhanced crisis detection with cultural context
  const performCrisisAssessment = useCallback(async () => {
    if (!contentSummary || !isVisible) return;
    
    setIsProcessing(true);
    
    try {
      const detectionInput: CrisisDetectionInputType = {
        textSummary: contentSummary,
        userId: userId,
        timestamp: Date.now(),
        culturalContext: {
          primaryLanguage: userContext.preferences.languages[0],
          culturalBackground: userContext.preferences.culturalBackground,
          religiousContext: userContext.preferences.religiousContext,
          lgbtqContext: userContext.preferences.lgbtqContext,
          ageGroup: userContext.preferences.ageGroup,
          immigrationStatus: userContext.preferences.immigrationStatus
        },
        sessionContext: {
          timeOfDay: getCurrentTimeOfDay(),
          dayOfWeek: getCurrentDayOfWeek(),
          deviceType: getDeviceType(),
          writingDuration: Date.now() - state.interventionStartTime
        }
      };
      
      const detection = await enhancedCrisisDetection.detectCrisis(detectionInput);
      
      setState(prev => ({
        ...prev,
        crisisDetection: detection,
        step: detection.riskLevel === 'critical' ? 'resources' : 'assessment'
      }));
      
      // Log intervention start (privacy-safe)
      logger.info('Crisis intervention initiated', {
        riskLevel: detection.riskLevel,
        interventionType: detection.interventionType,
        responseTimeMs: detection.responseTimeMs,
        culturalContextProvided: !!detectionInput.culturalContext?.primaryLanguage
      });
      
    } catch (error) {
      logger.error('Crisis detection failed', error);
      
      // Safe fallback - assume moderate risk
      setState(prev => ({
        ...prev,
        step: 'resources',
        crisisDetection: {
          riskLevel: 'moderate',
          confidence: 0.5,
          interventionType: 'resource_offer',
          culturallyAppropriateResources: [],
          immediateActions: [],
          supportMessage: 'We want to make sure you\'re safe. Crisis support is available.',
          followUpRecommended: true,
          escalationTrigger: false,
          responseTimeMs: 3000
        }
      }));
    } finally {
      setIsProcessing(false);
    }
  }, [contentSummary, userId, userContext, isVisible, state.interventionStartTime]);
  
  // Perform assessment when component becomes visible
  useEffect(() => {
    if (isVisible && !state.crisisDetection) {
      performCrisisAssessment();
    }
  }, [isVisible, performCrisisAssessment, state.crisisDetection]);
  
  // Monitor online status for offline resource access
  useEffect(() => {
    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => setOfflineMode(true);
    
    typeof window !== 'undefined' && window.addEventListener('online', handleOnline);
    typeof window !== 'undefined' && window.addEventListener('offline', handleOffline);
    
    return () => {
      typeof window !== 'undefined' && window.removeEventListener('online', handleOnline);
      typeof window !== 'undefined' && window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Get culturally appropriate crisis resources
  const availableResources = useMemo(() => {
    if (!state.crisisDetection || state.crisisDetection.culturallyAppropriateResources.length > 0) {
      return state.crisisDetection?.culturallyAppropriateResources || [];
    }
    
    // Fallback to global resource manager
    return globalCrisisResources.getCrisisResources(userContext, 5);
  }, [state.crisisDetection, userContext]);
  
  // Quick emergency resources for offline mode
  const emergencyResources = useMemo(() => {
    return getQuickEmergencyResources(userContext.location.country);
  }, [userContext.location.country]);
  
  // Handle resource access with tracking
  const handleResourceClick = useCallback((resourceId: string, resourceType: string, contact: string) => {
    setState(prev => ({
      ...prev,
      resourcesAccessed: [...prev.resourcesAccessed, resourceId]
    }));
    
    onResourceAccessed(resourceId, resourceType);
    
    // Provide haptic feedback for crisis interactions
    if (typeof window !== 'undefined' && navigator.vibrate) {
      typeof window !== 'undefined' && navigator.vibrate([100, 50, 100]);
    }
    
    // Handle different contact types
    if (contact.startsWith('tel:') || /^\d/.test(contact)) {
      const phoneNumber = contact.replace('tel:', '');
      typeof window !== 'undefined' && window.location.href = `tel:${phoneNumber}`;
    } else if (contact.includes('text') || contact.includes('Text')) {
      // Extract text instructions
      const textMatch = contact.match(/Text (.+) to (\d+)/i);
      if (textMatch) {
        const [, message, number] = textMatch;
        typeof window !== 'undefined' && window.location.href = `sms:${number}?&body=${encodeURIComponent(message)}`;
      }
    } else if (contact.startsWith('http')) {
      typeof window !== 'undefined' && window.open(contact, '_blank');
    }
    
    logger.info('Crisis resource accessed', {
      resourceId,
      resourceType,
      riskLevel: state.crisisDetection?.riskLevel,
      timeToAccess: Date.now() - state.interventionStartTime
    });
  }, [onResourceAccessed, state.crisisDetection?.riskLevel, state.interventionStartTime]);
  
  // Breathing exercise component
  const BreathingExercise = () => {
    const [breathCount, setBreathCount] = useState(0);
    const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
    
    useEffect(() => {
      if (!state.breathingActive) return;
      
      const interval = setInterval(() => {
        setPhase(prev => {
          if (prev === 'in') return 'hold';
          if (prev === 'hold') return 'out';
          setBreathCount(c => c + 1);
          return 'in';
        });
      }, 4000);
      
      if (breathCount >= 6) {
        setState(prev => ({ ...prev, breathingActive: false }));
        setBreathCount(0);
      }
      
      return () => clearInterval(interval);
    }, [state.breathingActive, breathCount]);
    
    const phaseMessages = {
      in: 'Breathe in slowly through your nose...',
      hold: 'Hold gently...',
      out: 'Breathe out slowly through your mouth...'
    };
    
    return (
      <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-60 flex flex-col items-center justify-center">
        <div className={`w-32 h-32 rounded-full border-4 border-sage-300 mb-8 transition-all duration-4000 ${
          phase === 'in' ? 'scale-125 bg-sage-100' : 
          phase === 'hold' ? 'scale-125 bg-sage-200' : 
          'scale-100 bg-sage-50'
        }`} />
        <h3 className="text-2xl font-medium text-ink mb-4">
          {phaseMessages[phase]}
        </h3>
        <p className="text-muted mb-8">
          Breath {Math.floor(breathCount / 2) + 1} of 3
        </p>
        <Button
          onClick={() => setState(prev => ({ ...prev, breathingActive: false }))}
          variant="ghost"
          className="text-sage-600"
        >
          I'm ready to continue
        </Button>
      </div>
    );
  };
  
  if (!isVisible) return null;
  
  return (
    <>
      {state.breathingActive && <BreathingExercise />}
      
      <div className="fixed inset-0 bg-sage-400/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full max-h-[85vh] overflow-y-auto bg-white border-sage-200 shadow-sacred rounded-3xl">
          <div className="p-8">
            
            {/* Loading State */}
            {isProcessing && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-sage-200 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                  <div className="w-8 h-8 bg-sage-400 rounded-full" />
                </div>
                <h3 className="text-xl font-medium text-ink mb-2">
                  Checking in with you...
                </h3>
                <p className="text-muted">
                  This will just take a moment.
                </p>
              </div>
            )}
            
            {/* Crisis Assessment Step */}
            {state.step === 'assessment' && state.crisisDetection && (
              <div className="text-center px-6 py-8">
                <div className="w-12 h-12 bg-sage-100 rounded-full mx-auto mb-8 flex items-center justify-center">
                  <div className="w-6 h-6 bg-sage-400 rounded-full animate-gentle-breathe"></div>
                </div>
                
                <h2 className="text-xl font-medium text-sanctuary-gray-800 mb-6 leading-relaxed">
                  We're here with you
                </h2>
                
                <p className="text-base text-sanctuary-gray-600 leading-relaxed mb-12 emotional-content">
                  {state.crisisDetection.supportMessage}
                </p>
                
                <div className="space-y-3 mb-8">
                  <Button
                    onClick={() => setState(prev => ({ ...prev, step: 'resources' }))}
                    size="lg"
                    className="w-full bg-sage-400 hover:bg-sage-500 text-white"
                  >
                    I could use some support resources
                  </Button>
                  
                  <Button
                    onClick={() => setState(prev => ({ ...prev, breathingActive: true }))}
                    variant="outline"
                    size="lg"
                    className="w-full border-sage-300 text-sage-700 hover:bg-sage-50"
                  >
                    Help me breathe first
                  </Button>
                  
                  <Button
                    onClick={onContinueWriting}
                    variant="ghost"
                    size="lg"
                    className="w-full text-muted hover:text-ink"
                  >
                    I'm okay to keep writing
                  </Button>
                </div>
              </div>
            )}
            
            {/* Crisis Resources Step */}
            {state.step === 'resources' && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-medium text-ink mb-4">
                    Support is here for you
                  </h3>
                  
                  <p className="text-lg text-muted leading-relaxed mb-8">
                    {state.crisisDetection?.supportMessage || 
                     'These resources are available 24/7 and understand what you\'re going through.'}
                  </p>
                  
                  {offlineMode && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                      <p className="text-amber-800 text-sm">
                        📶 You appear to be offline. These numbers will still work from your phone.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 mb-8">
                  {/* Critical resources first */}
                  {state.crisisDetection?.riskLevel === 'critical' && (
                    <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-medium text-red-800 mb-2">
                          🚨 Immediate Help Available
                        </h4>
                        <p className="text-red-700 text-sm">
                          If you're in immediate danger, these resources can help right now.
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => handleResourceClick('emergency_crisis', 'emergency', 'tel:988')}
                        className="w-full mb-3 bg-red-600 hover:bg-red-700 text-white font-medium py-4"
                      >
                        <span className="text-2xl mr-3">📞</span>
                        Call 988 - Crisis Lifeline
                        <span className="block text-sm opacity-90">Available right now</span>
                      </Button>
                      
                      {userContext.preferences.immigrationStatus !== 'untypeof window !== 'undefined' && documented' && (
                        <Button
                          onClick={() => handleResourceClick('emergency_911', 'emergency', 'tel:911')}
                          variant="outline"
                          className="w-full border-red-300 text-red-700 hover:bg-red-50"
                        >
                          Call 911 if in immediate physical danger
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {/* Culturally appropriate resources */}
                  {availableResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="p-6 bg-white border border-blue-200/50 rounded-2xl shadow-soft hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-ink text-lg">
                            {resource.name}
                          </h4>
                          {resource.culturalSpecialty && (
                            <span className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded-full">
                              {resource.culturalSpecialty}
                            </span>
                          )}
                        </div>
                        <div className="text-2xl">
                          {resource.type === 'hotline' ? '📞' :
                           resource.type === 'text_line' ? '💬' :
                           resource.type === 'chat_service' ? '💻' : '🆘'}
                        </div>
                      </div>
                      
                      <p className="text-muted text-sm mb-4 leading-relaxed">
                        {resource.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.available24h && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            24/7 Available
                          </span>
                        )}
                        {resource.costFree && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Free
                          </span>
                        )}
                        {resource.confidential && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            Confidential
                          </span>
                        )}
                        {resource.immigrationSafe && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                            Immigration Safe
                          </span>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => handleResourceClick(resource.id, resource.type, resource.contact)}
                        className={`w-full ${
                          state.resourcesAccessed.includes(resource.id)
                            ? 'bg-sage-600 hover:bg-sage-700'
                            : 'bg-sage-400 hover:bg-sage-500'
                        } text-white`}
                      >
                        {resource.type === 'hotline' ? 'Call Now' :
                         resource.type === 'text_line' ? 'Start Texting' :
                         resource.type === 'chat_service' ? 'Start Chat' :
                         'Get Help'}
                        <span className="ml-2 text-sm opacity-90">
                          {resource.contact}
                        </span>
                      </Button>
                    </div>
                  ))}
                  
                  {/* Offline emergency fallback */}
                  {offlineMode && availableResources.length === 0 && (
                    <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                      <h4 className="font-medium text-amber-800 mb-4">
                        📶 Offline Emergency Resources
                      </h4>
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleResourceClick('offline_crisis', 'hotline', emergencyResources.crisis_hotline)}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          Crisis Hotline: {emergencyResources.crisis_hotline}
                        </Button>
                        <Button
                          onClick={() => handleResourceClick('offline_emergency', 'emergency', emergencyResources.emergency)}
                          variant="outline"
                          className="w-full border-amber-300 text-amber-700"
                        >
                          Emergency: {emergencyResources.emergency}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-center space-y-4">
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => setState(prev => ({ ...prev, breathingActive: true }))}
                      variant="outline"
                      size="sm"
                      className="border-sage-300"
                    >
                      Take a breathing break
                    </Button>
                    
                    <Button
                      onClick={() => setState(prev => ({ ...prev, step: 'safety_planning' }))}
                      variant="outline"
                      size="sm"
                    >
                      Create safety plan
                    </Button>
                  </div>
                  
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="text-muted"
                  >
                    Close for now
                  </Button>
                </div>
              </div>
            )}
            
            {/* Safety Planning Step */}
            {state.step === 'safety_planning' && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-medium text-ink mb-4">
                    Building your safety plan
                  </h3>
                  
                  <p className="text-muted leading-relaxed mb-8">
                    A safety plan helps you prepare for difficult moments and remember what helps you feel safe.
                  </p>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div className="p-4 bg-sage-50/50 border border-sage-200/50 rounded-xl">
                    <label className="block font-medium text-ink mb-2">
                      Who is someone you trust that you could contact?
                    </label>
                    <input
                      type="text"
                      placeholder="Name and phone number..."
                      className="w-full p-3 bg-white border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400/25"
                    />
                  </div>
                  
                  <div className="p-4 bg-sage-50/50 border border-sage-200/50 rounded-xl">
                    <label className="block font-medium text-ink mb-2">
                      What activities help you feel calm or safe?
                    </label>
                    <textarea
                      placeholder="For example: listening to music, taking a walk, calling a friend..."
                      className="w-full p-3 bg-white border border-sage-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sage-400/25"
                      rows={3}
                    />
                  </div>
                  
                  <div className="p-4 bg-sage-50/50 border border-sage-200/50 rounded-xl">
                    <label className="block font-medium text-ink mb-2">
                      What would make tonight/today feel more manageable?
                    </label>
                    <textarea
                      placeholder="Take your time with this..."
                      className="w-full p-3 bg-white border border-sage-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sage-400/25"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Button
                    onClick={() => setState(prev => ({ ...prev, step: 'resources' }))}
                    variant="ghost"
                    size="sm"
                  >
                    Back to resources
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={onContinueWriting}
                      variant="outline"
                      size="sm"
                    >
                      Continue writing
                    </Button>
                    
                    <Button
                      onClick={onClose}
                      size="sm"
                      className="bg-sage-400 hover:bg-sage-500"
                    >
                      Save my plan
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Always-present close option */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/25"
              aria-label="Close crisis support"
            >
              <svg className="w-4 h-4 text-muted hover:text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}

// Utility functions
function getCurrentTimeOfDay(): 'early_morning' | 'morning' | 'afternoon' | 'evening' | 'late_night' {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 8) return 'early_morning';
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'late_night';
}

function getCurrentDayOfWeek(): 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  return days[new Date().getDay()];
}

function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  const userAgent = typeof window !== 'undefined' && navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
  if (/mobile|android|iphone|ipod|blackberry|opera|mini|typeof window !== 'undefined' && windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

export default EnhancedCrisisIntervention;