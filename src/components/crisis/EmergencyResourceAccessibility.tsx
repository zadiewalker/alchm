'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { crisisResourcePreloader } from '@/lib/crisis-resource-preloader';
import { crisisDetection } from '@/lib/enhanced-crisis-detection';

interface EmergencyResourceProps {
  culturalContext?: string[];
  userProfile?: {
    ageGroup: 'youth' | 'adult' | 'senior';
    language: string;
    location?: string;
    accessibilityNeeds?: string[];
  };
  emergencyMode?: boolean;
  onResourceAccessed?: (resourceId: string, responseTime: number) => void;
}

interface AccessibilityAdaptation {
  largeTouch: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  tremorsDetected: boolean;
  cognitiveSupport: boolean;
}

interface CrisisResourceExtended {
  id: string;
  name: string;
  shortName: string;
  number: string;
  description: string;
  icon: string;
  priority: 'emergency' | 'critical' | 'high' | 'medium';
  cultural: string[];
  ageGroup: string[];
  accessibility: {
    ariaLabel: string;
    keyboardShortcut?: string;
    voiceCommand?: string;
    alternativeAccess?: string;
  };
  metadata: {
    responseTime: string;
    availability: string;
    language: string[];
    specializations: string[];
  };
  action: () => Promise<void>;
}

export default function EmergencyResourceAccessibility({
  culturalContext = [],
  userProfile,
  emergencyMode = false,
  onResourceAccessed
}: EmergencyResourceProps) {
  const [accessibility, setAccessibility] = useState<AccessibilityAdaptation>({
    largeTouch: false,
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    tremorsDetected: false,
    cognitiveSupport: false
  });

  const [resources, setResources] = useState<CrisisResourceExtended[]>([]);
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map());
  const [responseMetrics, setResponseMetrics] = useState<Map<string, number>>(new Map());
  const [isOffline, setIsOffline] = useState(false);
  const [lastInteraction, setLastInteraction] = useState<number>(0);

  const resourcesRef = useRef<HTMLDivElement>(null);
  const performanceRef = useRef<Map<string, number>>(new Map());

  // Detect accessibility needs on mount
  useEffect(() => {
    detectAccessibilityNeeds();
    initializeResources();
    monitorNetworkStatus();
    setupKeyboardShortcuts();
  }, []);

  // Update resources when cultural context or user profile changes
  useEffect(() => {
    if (culturalContext.length > 0 || userProfile) {
      initializeResources();
    }
  }, [culturalContext, userProfile]);

  /**
   * Detect user accessibility needs automatically
   */
  const detectAccessibilityNeeds = useCallback(() => {
    // Screen reader detection
    const screenReader = typeof navigator !== 'undefined' && (
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver') ||
      !!document.querySelector('[aria-live]')
    );

    // High contrast preference
    const highContrast = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-contrast: high)').matches;

    // Reduced motion preference
    const reducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Touch interaction patterns for tremor detection
    let touchEvents = 0;
    let rapidTouchCount = 0;
    
    const handleTouch = () => {
      touchEvents++;
      const now = Date.now();
      
      if (now - lastInteraction < 100) {
        rapidTouchCount++;
        if (rapidTouchCount > 5) {
          setAccessibility(prev => ({ ...prev, tremorsDetected: true, largeTouch: true }));
        }
      } else {
        rapidTouchCount = 0;
      }
      
      setLastInteraction(now);
    };

    // Cognitive load detection (simplified)
    const cognitiveSupport = userProfile?.accessibilityNeeds?.includes('cognitive') || false;

    document.addEventListener('touchstart', handleTouch, { passive: true });
    
    setAccessibility({
      largeTouch: touchEvents > 10,
      highContrast,
      reducedMotion,
      screenReader,
      tremorsDetected: false,
      cognitiveSupport
    });

    return () => {
      document.removeEventListener('touchstart', handleTouch);
    };
  }, [lastInteraction, userProfile]);

  /**
   * Initialize crisis resources with cultural and accessibility adaptations
   */
  const initializeResources = useCallback(async () => {
    const startTime = performance.now();
    
    const baseResources: CrisisResourceExtended[] = [
      {
        id: 'suicide-prevention-988',
        name: 'National Suicide Prevention Lifeline',
        shortName: '988 Lifeline',
        number: '988',
        description: '24/7 crisis support and suicide prevention',
        icon: '📞',
        priority: 'critical',
        cultural: ['all'],
        ageGroup: ['all'],
        accessibility: {
          ariaLabel: 'Call 988 National Suicide Prevention Lifeline for immediate crisis support',
          keyboardShortcut: 'Alt+1',
          voiceCommand: 'Call lifeline',
          alternativeAccess: 'Voice activated: "Hey Siri, call 988" or "OK Google, call 988"'
        },
        metadata: {
          responseTime: 'Immediate connection',
          availability: '24/7/365',
          language: ['English', 'Spanish'],
          specializations: ['Suicide prevention', 'Crisis intervention', 'Mental health support']
        },
        action: async () => {
          const actionStart = performance.now();
          setLoadingStates(prev => new Map(prev.set('suicide-prevention-988', true)));
          
          try {
            // Immediate call with performance tracking
            window.location.href = 'tel:988';
            
            const actionTime = performance.now() - actionStart;
            setResponseMetrics(prev => new Map(prev.set('suicide-prevention-988', actionTime)));
            onResourceAccessed?.('suicide-prevention-988', actionTime);
            
            // Haptic feedback for mobile
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
            
          } finally {
            setLoadingStates(prev => new Map(prev.set('suicide-prevention-988', false)));
          }
        }
      },
      
      {
        id: 'crisis-text-line',
        name: 'Crisis Text Line',
        shortName: 'Text Support',
        number: '741741',
        description: 'Text HOME to 741741 for immediate text-based crisis support',
        icon: '💬',
        priority: 'critical',
        cultural: ['all'],
        ageGroup: ['all'],
        accessibility: {
          ariaLabel: 'Text HOME to 741741 for Crisis Text Line support',
          keyboardShortcut: 'Alt+2',
          voiceCommand: 'Text crisis line',
          alternativeAccess: 'Voice-to-text: "Send text to 741741 with message HOME"'
        },
        metadata: {
          responseTime: 'Response within 5 minutes',
          availability: '24/7/365',
          language: ['English', 'Spanish'],
          specializations: ['Text-based crisis support', 'Anonymous help', 'Youth support']
        },
        action: async () => {
          const actionStart = performance.now();
          setLoadingStates(prev => new Map(prev.set('crisis-text-line', true)));
          
          try {
            // Open text message with pre-filled content
            window.location.href = 'sms:741741?body=HOME';
            
            const actionTime = performance.now() - actionStart;
            setResponseMetrics(prev => new Map(prev.set('crisis-text-line', actionTime)));
            onResourceAccessed?.('crisis-text-line', actionTime);
            
            if (navigator.vibrate) {
              navigator.vibrate([100, 50, 100]);
            }
            
          } finally {
            setLoadingStates(prev => new Map(prev.set('crisis-text-line', false)));
          }
        }
      },

      {
        id: 'emergency-911',
        name: 'Emergency Services',
        shortName: '911',
        number: '911',
        description: 'Life-threatening emergencies requiring immediate emergency response',
        icon: '🚨',
        priority: 'emergency',
        cultural: ['all'],
        ageGroup: ['all'],
        accessibility: {
          ariaLabel: 'Call 911 for life-threatening emergencies',
          keyboardShortcut: 'Alt+9',
          voiceCommand: 'Call emergency',
          alternativeAccess: 'Voice activated: "Hey Siri, call 911" or "OK Google, call 911"'
        },
        metadata: {
          responseTime: 'Immediate dispatch',
          availability: '24/7/365',
          language: ['All languages with interpreters'],
          specializations: ['Medical emergencies', 'Police response', 'Fire department']
        },
        action: async () => {
          const actionStart = performance.now();
          setLoadingStates(prev => new Map(prev.set('emergency-911', true)));
          
          try {
            // Emergency call with confirmation for safety
            if (emergencyMode || confirm('Call 911 for emergency services?')) {
              window.location.href = 'tel:911';
              
              const actionTime = performance.now() - actionStart;
              setResponseMetrics(prev => new Map(prev.set('emergency-911', actionTime)));
              onResourceAccessed?.('emergency-911', actionTime);
              
              // Strong haptic feedback for emergency
              if (navigator.vibrate) {
                navigator.vibrate([300, 100, 300, 100, 300]);
              }
            }
            
          } finally {
            setLoadingStates(prev => new Map(prev.set('emergency-911', false)));
          }
        }
      }
    ];

    // Add cultural resources
    const culturalResources = await getCulturalResources();
    const allResources = [...baseResources, ...culturalResources];
    
    setResources(allResources);
    
    const initTime = performance.now() - startTime;
    console.log(`🆘 Emergency resources initialized in ${initTime.toFixed(2)}ms`);
    
    // Preload resources for fastest access
    await crisisResourcePreloader.smartPreload({
      emotionalState: emergencyMode ? 'crisis' : 'stable',
      historicalPatterns: [],
      culturalIdentity: culturalContext,
      preferredLanguage: userProfile?.language || 'en',
      location: userProfile?.location ? { country: userProfile.location, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone } : undefined,
      ageGroup: userProfile?.ageGroup
    });
    
  }, [culturalContext, userProfile, emergencyMode, onResourceAccessed]);

  /**
   * Get culturally-specific crisis resources
   */
  const getCulturalResources = useCallback(async (): Promise<CrisisResourceExtended[]> => {
    const cultural: CrisisResourceExtended[] = [];

    // LGBTQ+ resources
    if (culturalContext.includes('lgbtq') || culturalContext.includes('queer')) {
      cultural.push({
        id: 'trevor-project',
        name: 'Trevor Project',
        shortName: 'Trevor Support',
        number: '1-866-488-7386',
        description: '24/7 crisis support specifically for LGBTQ+ young people',
        icon: '🏳️‍🌈',
        priority: 'critical',
        cultural: ['lgbtq', 'queer'],
        ageGroup: ['youth'],
        accessibility: {
          ariaLabel: 'Call Trevor Project for LGBTQ+ youth crisis support',
          keyboardShortcut: 'Alt+3',
          voiceCommand: 'Call Trevor Project',
          alternativeAccess: 'Also available via chat at thetrevorproject.org'
        },
        metadata: {
          responseTime: 'Average 2 minutes',
          availability: '24/7/365',
          language: ['English', 'Spanish'],
          specializations: ['LGBTQ+ youth', 'Coming out', 'Identity support', 'Family rejection']
        },
        action: async () => {
          const actionStart = performance.now();
          setLoadingStates(prev => new Map(prev.set('trevor-project', true)));
          
          try {
            window.location.href = 'tel:18664887386';
            
            const actionTime = performance.now() - actionStart;
            setResponseMetrics(prev => new Map(prev.set('trevor-project', actionTime)));
            onResourceAccessed?.('trevor-project', actionTime);
            
          } finally {
            setLoadingStates(prev => new Map(prev.set('trevor-project', false)));
          }
        }
      });
    }

    // Transgender resources
    if (culturalContext.includes('transgender') || culturalContext.includes('trans')) {
      cultural.push({
        id: 'trans-lifeline',
        name: 'Trans Lifeline',
        shortName: 'Trans Support',
        number: '877-565-8860',
        description: 'Crisis support by and for transgender community members',
        icon: '🏳️‍⚧️',
        priority: 'critical',
        cultural: ['transgender', 'trans'],
        ageGroup: ['all'],
        accessibility: {
          ariaLabel: 'Call Trans Lifeline for transgender crisis support',
          keyboardShortcut: 'Alt+4',
          voiceCommand: 'Call Trans Lifeline',
          alternativeAccess: 'Staffed by transgender people who understand your experience'
        },
        metadata: {
          responseTime: 'Direct connection',
          availability: '24/7/365',
          language: ['English', 'Spanish'],
          specializations: ['Transgender issues', 'Gender identity', 'Transition support', 'Discrimination']
        },
        action: async () => {
          const actionStart = performance.now();
          setLoadingStates(prev => new Map(prev.set('trans-lifeline', true)));
          
          try {
            window.location.href = 'tel:8775658860';
            
            const actionTime = performance.now() - actionStart;
            setResponseMetrics(prev => new Map(prev.set('trans-lifeline', actionTime)));
            onResourceAccessed?.('trans-lifeline', actionTime);
            
          } finally {
            setLoadingStates(prev => new Map(prev.set('trans-lifeline', false)));
          }
        }
      });
    }

    // BIPOC resources
    if (culturalContext.includes('bipoc') || culturalContext.includes('black')) {
      cultural.push({
        id: 'blackline',
        name: 'BlackLine',
        shortName: 'BlackLine',
        number: '1-800-604-5841',
        description: 'Crisis support for Black, Indigenous, and People of Color',
        icon: '✊🏿',
        priority: 'high',
        cultural: ['bipoc', 'black'],
        ageGroup: ['all'],
        accessibility: {
          ariaLabel: 'Call BlackLine for BIPOC crisis support',
          keyboardShortcut: 'Alt+5',
          voiceCommand: 'Call BlackLine',
          alternativeAccess: 'Culturally competent support for communities of color'
        },
        metadata: {
          responseTime: 'Personal connection',
          availability: '24/7/365',
          language: ['English'],
          specializations: ['Racial trauma', 'Police violence', 'Systemic oppression', 'Community support']
        },
        action: async () => {
          const actionStart = performance.now();
          setLoadingStates(prev => new Map(prev.set('blackline', true)));
          
          try {
            window.location.href = 'tel:18006045841';
            
            const actionTime = performance.now() - actionStart;
            setResponseMetrics(prev => new Map(prev.set('blackline', actionTime)));
            onResourceAccessed?.('blackline', actionTime);
            
          } finally {
            setLoadingStates(prev => new Map(prev.set('blackline', false)));
          }
        }
      });
    }

    return cultural;
  }, [culturalContext, onResourceAccessed]);

  /**
   * Monitor network status for offline accessibility
   */
  const monitorNetworkStatus = useCallback(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Setup keyboard shortcuts for accessibility
   */
  const setupKeyboardShortcuts = useCallback(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            resources.find(r => r.id === 'suicide-prevention-988')?.action();
            break;
          case '2':
            e.preventDefault();
            resources.find(r => r.id === 'crisis-text-line')?.action();
            break;
          case '9':
            e.preventDefault();
            resources.find(r => r.id === 'emergency-911')?.action();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [resources]);

  /**
   * Get touch target size based on accessibility needs
   */
  const getTouchTargetSize = useCallback(() => {
    if (accessibility.tremorsDetected || accessibility.largeTouch) {
      return 'min-h-[88px] min-w-[88px]'; // WCAG AAA large target
    }
    if (emergencyMode) {
      return 'min-h-[72px] min-w-[72px]'; // Emergency mode
    }
    return 'min-h-[56px] min-w-[56px]'; // Standard WCAG AA
  }, [accessibility, emergencyMode]);

  /**
   * Get contrast and styling based on accessibility needs
   */
  const getAccessibilityStyles = useCallback(() => {
    const baseStyles = 'transition-all duration-200 ease-sanctuary focus:outline-none';
    
    if (accessibility.highContrast) {
      return `${baseStyles} border-2 focus:ring-4 focus:ring-offset-2`;
    }
    
    if (accessibility.reducedMotion) {
      return baseStyles.replace('transition-all duration-200', 'transition-none');
    }
    
    return `${baseStyles} focus:ring-2 focus:ring-offset-1`;
  }, [accessibility]);

  if (resources.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-sage-600">Loading emergency resources...</div>
      </div>
    );
  }

  return (
    <div 
      ref={resourcesRef}
      className="space-y-4 p-4"
      role="region"
      aria-label="Emergency crisis resources"
    >
      {/* Accessibility Status Indicators */}
      {(accessibility.tremorsDetected || accessibility.highContrast || accessibility.screenReader) && (
        <div className="bg-blue-50/90 border border-blue-200/50 rounded-lg p-3 backdrop-blur-sm">
          <div className="text-blue-800 font-medium text-sm mb-1">
            🤝 Accessibility features active
          </div>
          <div className="text-blue-700 text-xs space-y-1">
            {accessibility.tremorsDetected && <div>• Large touch targets enabled</div>}
            {accessibility.highContrast && <div>• High contrast mode detected</div>}
            {accessibility.screenReader && <div>• Screen reader optimized</div>}
          </div>
        </div>
      )}

      {/* Emergency and Critical Resources */}
      <div className="grid grid-cols-1 gap-3">
        {resources
          .filter(r => r.priority === 'emergency' || r.priority === 'critical')
          .map((resource) => (
            <button
              key={resource.id}
              onClick={resource.action}
              disabled={loadingStates.get(resource.id) || false}
              className={`
                ${getTouchTargetSize()}
                ${resource.priority === 'emergency' 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300' 
                  : 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
                }
                text-white rounded-xl p-4 flex items-center gap-4
                ${getAccessibilityStyles()}
                ${accessibility.highContrast ? 'border-white' : ''}
                ${loadingStates.get(resource.id) ? 'opacity-75 cursor-wait' : ''}
                ${accessibility.tremorsDetected ? 'transform hover:scale-105' : ''}
              `}
              style={{
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
              aria-label={resource.accessibility.ariaLabel}
              aria-describedby={`${resource.id}-description`}
            >
              <div className="text-4xl filter drop-shadow-sm">
                {resource.icon}
              </div>
              
              <div className="text-left flex-1">
                <div className="font-semibold text-lg">
                  {resource.shortName}
                </div>
                <div className="text-sm opacity-90 mb-1">
                  {resource.description}
                </div>
                
                {/* Performance metrics for transparency */}
                {responseMetrics.has(resource.id) && (
                  <div className="text-xs opacity-75">
                    Response: {responseMetrics.get(resource.id)?.toFixed(0)}ms
                  </div>
                )}
                
                {/* Keyboard shortcut hint */}
                {resource.accessibility.keyboardShortcut && (
                  <div className="text-xs opacity-75 mt-1">
                    Shortcut: {resource.accessibility.keyboardShortcut}
                  </div>
                )}
              </div>

              <div className="text-right text-xs opacity-80">
                {isOffline ? 'Available offline' : resource.metadata.responseTime}
              </div>
              
              {/* Loading indicator */}
              {loadingStates.get(resource.id) && (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              )}
            </button>
          ))}
      </div>

      {/* Cultural/Specialized Resources */}
      {resources.filter(r => r.priority === 'high' || r.priority === 'medium').length > 0 && (
        <div className="border-t border-sage-muted/30 pt-4">
          <div className="text-center text-sage-600 font-medium text-sm mb-3">
            Specialized Support
          </div>
          <div className="grid grid-cols-1 gap-2">
            {resources
              .filter(r => r.priority === 'high' || r.priority === 'medium')
              .map((resource) => (
                <button
                  key={resource.id}
                  onClick={resource.action}
                  disabled={loadingStates.get(resource.id) || false}
                  className={`
                    ${getTouchTargetSize()}
                    bg-sage-primary/10 hover:bg-sage-primary/20
                    border border-sage-primary/20
                    text-sage-active p-3 rounded-lg
                    flex items-center gap-3
                    ${getAccessibilityStyles()}
                    focus:ring-sage-primary/50
                    ${accessibility.highContrast ? 'border-sage-active' : ''}
                    ${loadingStates.get(resource.id) ? 'opacity-75 cursor-wait' : ''}
                  `}
                  style={{
                    touchAction: 'manipulation',
                    backdropFilter: 'blur(10px)',
                  }}
                  aria-label={resource.accessibility.ariaLabel}
                  aria-describedby={`${resource.id}-description`}
                >
                  <div className="text-2xl">{resource.icon}</div>
                  
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{resource.shortName}</div>
                    <div className="text-xs opacity-80">{resource.description}</div>
                    
                    {/* Cultural specialization indicator */}
                    {resource.cultural.length > 0 && resource.cultural[0] !== 'all' && (
                      <div className="text-xs text-sage-600 mt-1">
                        Specialized for {resource.cultural.join(', ')} community
                      </div>
                    )}
                  </div>
                  
                  {loadingStates.get(resource.id) && (
                    <div className="animate-spin h-4 w-4 border-2 border-sage-primary border-t-transparent rounded-full" />
                  )}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Offline Support Notice */}
      {isOffline && (
        <div className="bg-orange-50/90 border border-orange-200/50 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-orange-800">
            <div className="text-lg">📱</div>
            <div>
              <div className="font-medium text-sm">You're offline</div>
              <div className="text-xs">All phone numbers work offline! Voice commands also available.</div>
            </div>
          </div>
        </div>
      )}

      {/* Screen reader announcements for accessibility */}
      <div className="sr-only" aria-live="polite">
        {Object.entries(loadingStates).map(([id, loading]) => 
          loading && (
            <div key={id}>
              Connecting to {resources.find(r => r.id === id)?.name}...
            </div>
          )
        )}
      </div>
    </div>
  );
}