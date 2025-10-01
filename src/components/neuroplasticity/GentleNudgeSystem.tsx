// ALCHM Neuroplasticity Component: Gentle Nudge System
// Trauma-informed behavioral guidance using color psychology and spatial design
// Research Foundation: Choice architecture, nudge theory, and nervous system regulation

'use client';

import React, { useState, useEffect, useRef } from 'react';

interface NudgeContext {
  userState: 'regulated' | 'hyperaroused' | 'hypoaroused' | 'window_edge';
  timeOfDay: 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
  lastInteraction: Date | null;
  recentStressors: string[];
  preferences: {
    nudgeIntensity: 'minimal' | 'gentle' | 'encouraging';
    colorSensitivity: 'low' | 'medium' | 'high';
    spatialPreference: 'compact' | 'spacious' | 'flowing';
  };
}

interface Nudge {
  id: string;
  type: 'encouragement' | 'reminder' | 'celebration' | 'comfort' | 'grounding';
  trigger: string;
  content: {
    visual: 'color_shift' | 'gentle_glow' | 'spatial_expand' | 'breathing_rhythm' | 'sparkle';
    message?: string;
    duration: number;
    intensity: number; // 0-100
  };
  positioning: {
    placement: 'ambient' | 'peripheral' | 'contextual' | 'centered';
    distance: 'intimate' | 'personal' | 'social' | 'public'; // Proxemics-based
  };
  colorPsychology: {
    primary: string;
    emotional_tone: 'calm' | 'warm' | 'hopeful' | 'grounding' | 'energizing';
    therapeutic_intent: 'regulate' | 'activate' | 'soothe' | 'inspire' | 'connect';
  };
  respectsUserState: boolean;
  traumaInformed: boolean;
}

interface GentleNudgeSystemProps {
  userContext: Partial<NudgeContext>;
  habitGoals?: string[];
  currentActivity?: string;
  enableSpatialNudges?: boolean;
  enableColorNudges?: boolean;
  enableTimingNudges?: boolean;
  onNudgeTriggered?: (nudge: Nudge) => void;
  onUserResponse?: (nudgeId: string, response: 'helpful' | 'neutral' | 'overwhelming') => void;
  className?: string;
}

export function GentleNudgeSystem({
  userContext,
  habitGoals = [],
  currentActivity,
  enableSpatialNudges = true,
  enableColorNudges = true,
  enableTimingNudges = true,
  onNudgeTriggered,
  onUserResponse,
  className = ''
}: GentleNudgeSystemProps) {
  const [activeNudges, setActiveNudges] = useState<Nudge[]>([]);
  const [nudgeQueue, setNudgeQueue] = useState<Nudge[]>([]);
  const [userFeedback, setUserFeedback] = useState<Record<string, 'helpful' | 'neutral' | 'overwhelming'>>({});
  const [spatialContext, setSpatialContext] = useState<'compressed' | 'balanced' | 'expanded'>('balanced');
  const nudgeContainerRef = useRef<HTMLDivElement>(null);

  // Color psychology mapping for neuroplasticity
  const therapeuticColors = {
    regulate: {
      primary: 'var(--neural-safety)',
      secondary: 'var(--neural-comfort)',
      gradient: 'linear-gradient(135deg, var(--neural-safety), var(--neural-comfort))'
    },
    activate: {
      primary: 'var(--neural-growth)',
      secondary: 'var(--neural-connection)',
      gradient: 'linear-gradient(135deg, var(--neural-growth), var(--neural-connection))'
    },
    soothe: {
      primary: 'var(--sanctuary-glass)',
      secondary: 'var(--sanctuary-mist)',
      gradient: 'linear-gradient(135deg, var(--sanctuary-glass), var(--sanctuary-mist))'
    },
    inspire: {
      primary: 'var(--neural-celebration)',
      secondary: 'var(--celebration-glow)',
      gradient: 'linear-gradient(135deg, var(--neural-celebration), var(--celebration-glow))'
    },
    connect: {
      primary: 'var(--feedback-celebrating)',
      secondary: 'var(--feedback-transforming)',
      gradient: 'linear-gradient(135deg, var(--feedback-celebrating), var(--feedback-transforming))'
    }
  };

  // Spatial psychology patterns for different user states
  const spatialPatterns = {
    compressed: {
      containerPadding: 'var(--contemplative-sm)',
      elementSpacing: 'var(--contemplative-xs)',
      borderRadius: 'var(--radius-sm)',
      maxWidth: '300px'
    },
    balanced: {
      containerPadding: 'var(--contemplative-lg)',
      elementSpacing: 'var(--contemplative-md)',
      borderRadius: 'var(--radius-md)',
      maxWidth: '450px'
    },
    expanded: {
      containerPadding: 'var(--contemplative-xl)',
      elementSpacing: 'var(--contemplative-lg)',
      borderRadius: 'var(--radius-lg)',
      maxWidth: '600px'
    }
  };

  // Generate contextually appropriate nudges
  const generateNudge = (type: Nudge['type'], trigger: string): Nudge => {
    const baseIntensity = userContext.preferences?.nudgeIntensity === 'minimal' ? 30 :
                         userContext.preferences?.nudgeIntensity === 'gentle' ? 60 : 80;

    // Adjust intensity based on user state
    const stateModifier = userContext.userState === 'hyperaroused' ? -20 :
                          userContext.userState === 'hypoaroused' ? -10 :
                          userContext.userState === 'window_edge' ? -15 : 0;

    const adjustedIntensity = Math.max(10, Math.min(100, baseIntensity + stateModifier));

    const nudgeConfigs = {
      encouragement: {
        visual: 'gentle_glow' as const,
        colorPsychology: {
          primary: therapeuticColors.inspire.primary,
          emotional_tone: 'hopeful' as const,
          therapeutic_intent: 'inspire' as const
        },
        positioning: {
          placement: 'peripheral' as const,
          distance: 'personal' as const
        },
        duration: 3000
      },
      reminder: {
        visual: 'color_shift' as const,
        colorPsychology: {
          primary: therapeuticColors.activate.primary,
          emotional_tone: 'energizing' as const,
          therapeutic_intent: 'activate' as const
        },
        positioning: {
          placement: 'contextual' as const,
          distance: 'social' as const
        },
        duration: 2000
      },
      celebration: {
        visual: 'sparkle' as const,
        colorPsychology: {
          primary: therapeuticColors.connect.primary,
          emotional_tone: 'warm' as const,
          therapeutic_intent: 'connect' as const
        },
        positioning: {
          placement: 'centered' as const,
          distance: 'intimate' as const
        },
        duration: 4000
      },
      comfort: {
        visual: 'breathing_rhythm' as const,
        colorPsychology: {
          primary: therapeuticColors.soothe.primary,
          emotional_tone: 'calm' as const,
          therapeutic_intent: 'soothe' as const
        },
        positioning: {
          placement: 'ambient' as const,
          distance: 'public' as const
        },
        duration: 6000
      },
      grounding: {
        visual: 'spatial_expand' as const,
        colorPsychology: {
          primary: therapeuticColors.regulate.primary,
          emotional_tone: 'grounding' as const,
          therapeutic_intent: 'regulate' as const
        },
        positioning: {
          placement: 'ambient' as const,
          distance: 'personal' as const
        },
        duration: 5000
      }
    };

    const config = nudgeConfigs[type];

    return {
      id: `nudge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      trigger,
      content: {
        visual: config.visual,
        duration: config.duration,
        intensity: adjustedIntensity
      },
      positioning: config.positioning,
      colorPsychology: config.colorPsychology,
      respectsUserState: true,
      traumaInformed: true
    };
  };

  // Monitor user state and trigger appropriate nudges
  useEffect(() => {
    if (!enableTimingNudges) return;

    const checkNudgeOpportunities = () => {
      const now = new Date();
      const hourOfDay = now.getHours();
      
      // Time-based nudging with circadian respect
      if (hourOfDay === 9 && userContext.userState === 'regulated') {
        const nudge = generateNudge('encouragement', 'Morning neuroplasticity window');
        triggerNudge(nudge);
      }
      
      // Activity-based nudging
      if (currentActivity === 'journaling' && userContext.userState !== 'hyperaroused') {
        const nudge = generateNudge('comfort', 'Supporting reflective state');
        triggerNudge(nudge);
      }
      
      // Habit goal nudging (very gentle)
      habitGoals.forEach(goal => {
        if (Math.random() < 0.1 && userContext.userState === 'regulated') { // 10% chance per check
          const nudge = generateNudge('reminder', `Gentle reminder: ${goal}`);
          nudge.content.message = `Perhaps a moment for ${goal}?`;
          triggerNudge(nudge);
        }
      });
    };

    const nudgeInterval = setInterval(checkNudgeOpportunities, 300000); // Every 5 minutes
    return () => clearInterval(nudgeInterval);
  }, [userContext, currentActivity, habitGoals, enableTimingNudges]);

  // Adjust spatial context based on user state
  useEffect(() => {
    if (!enableSpatialNudges) return;

    const newSpatialContext = userContext.userState === 'hyperaroused' ? 'compressed' :
                              userContext.userState === 'hypoaroused' ? 'expanded' :
                              'balanced';
    
    setSpatialContext(newSpatialContext);
  }, [userContext.userState, enableSpatialNudges]);

  // Process nudge queue with gentle timing
  useEffect(() => {
    if (nudgeQueue.length === 0) return;

    const processNudge = () => {
      const [nextNudge, ...remaining] = nudgeQueue;
      setNudgeQueue(remaining);
      
      // Check if user is in appropriate state for nudge
      if (nextNudge.respectsUserState && userContext.userState === 'hyperaroused') {
        // Skip nudge if user is hyperaroused
        return;
      }
      
      setActiveNudges(prev => [...prev, nextNudge]);
      onNudgeTriggered?.(nextNudge);
      
      // Auto-remove after duration
      setTimeout(() => {
        setActiveNudges(prev => prev.filter(n => n.id !== nextNudge.id));
      }, nextNudge.content.duration);
    };

    // Gentle timing between nudges
    const delay = userContext.userState === 'window_edge' ? 2000 : 1000;
    const timer = setTimeout(processNudge, delay);
    
    return () => clearTimeout(timer);
  }, [nudgeQueue, userContext.userState, onNudgeTriggered]);

  // Trigger nudge with queue management
  const triggerNudge = (nudge: Nudge) => {
    // Prevent overwhelming by limiting active nudges
    if (activeNudges.length >= 2) return;
    
    // Check recent feedback to avoid unwanted nudge types
    const recentFeedback = Object.values(userFeedback).slice(-5);
    const overwhelmingRatio = recentFeedback.filter(f => f === 'overwhelming').length / recentFeedback.length;
    
    if (overwhelmingRatio > 0.4) return; // Back off if 40%+ of recent nudges were overwhelming
    
    setNudgeQueue(prev => [...prev, nudge]);
  };

  // Handle user feedback on nudges
  const handleNudgeFeedback = (nudgeId: string, response: 'helpful' | 'neutral' | 'overwhelming') => {
    setUserFeedback(prev => ({ ...prev, [nudgeId]: response }));
    onUserResponse?.(nudgeId, response);
    
    // Immediately remove nudge if overwhelming
    if (response === 'overwhelming') {
      setActiveNudges(prev => prev.filter(n => n.id !== nudgeId));
    }
  };

  // Render nudge with appropriate visual treatment
  const renderNudge = (nudge: Nudge) => {
    const pattern = spatialPatterns[spatialContext];
    const colorConfig = therapeuticColors[nudge.colorPsychology.therapeutic_intent];
    
    const positioningClasses = {
      ambient: 'fixed inset-0 pointer-events-none z-0',
      peripheral: 'fixed top-4 right-4 pointer-events-auto z-10',
      contextual: 'relative pointer-events-auto z-10',
      centered: 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20'
    };

    const visualComponents = {
      color_shift: (
        <div 
          className="absolute inset-0 transition-all duration-[var(--neural-medium)] rounded-lg"
          style={{ 
            background: colorConfig.gradient,
            opacity: nudge.content.intensity / 200 // Very subtle
          }}
        />
      ),
      gentle_glow: (
        <div 
          className="absolute inset-0 animate-self-compassion-glow rounded-lg"
          style={{ 
            backgroundColor: colorConfig.primary,
            opacity: nudge.content.intensity / 300,
            filter: 'blur(8px)'
          }}
        />
      ),
      spatial_expand: (
        <div className="transition-all duration-[var(--neural-long)] animate-contemplative-breathe" />
      ),
      breathing_rhythm: (
        <div 
          className="absolute inset-0 animate-contemplative-breathe rounded-lg"
          style={{ 
            background: `radial-gradient(circle, ${colorConfig.primary} 0%, transparent 70%)`,
            opacity: nudge.content.intensity / 400
          }}
        />
      ),
      sparkle: (
        <div className="absolute top-2 right-2 animate-gentle-sparkle text-xs">
          ✨
        </div>
      )
    };

    return (
      <div
        key={nudge.id}
        className={positioningClasses[nudge.positioning.placement]}
        style={{
          maxWidth: pattern.maxWidth,
          padding: pattern.containerPadding
        }}
      >
        <div 
          className="relative sanctuary-glass backdrop-blur-md border border-neural-comfort/20 transition-all duration-[var(--neural-medium)]"
          style={{
            borderRadius: pattern.borderRadius,
            padding: pattern.elementSpacing
          }}
        >
          {/* Visual component */}
          {visualComponents[nudge.content.visual]}
          
          {/* Message content */}
          {nudge.content.message && (
            <div className="relative z-10">
              <p className="text-sm text-neural-connection mb-3">
                {nudge.content.message}
              </p>
              
              {/* Feedback buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleNudgeFeedback(nudge.id, 'helpful')}
                  className="text-xs px-2 py-1 rounded bg-feedback-encouraging hover:bg-feedback-supporting transition-colors"
                >
                  Helpful
                </button>
                <button
                  onClick={() => handleNudgeFeedback(nudge.id, 'neutral')}
                  className="text-xs px-2 py-1 rounded bg-state-forming hover:bg-synapse-forming transition-colors"
                >
                  Neutral
                </button>
                <button
                  onClick={() => handleNudgeFeedback(nudge.id, 'overwhelming')}
                  className="text-xs px-2 py-1 rounded bg-pressure-whisper hover:bg-pressure-nudge transition-colors"
                >
                  Too much
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={nudgeContainerRef}
      className={`gentle-nudge-system relative ${className}`}
      style={{
        transition: 'all var(--neural-medium)',
        padding: spatialPatterns[spatialContext].containerPadding
      }}
    >
      {/* Active nudges */}
      {activeNudges.map(renderNudge)}
      
      {/* Ambient color psychology layer */}
      {enableColorNudges && userContext.userState && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 transition-all duration-[var(--neural-deep)]"
          style={{
            background: userContext.userState === 'regulated' ? 
              'linear-gradient(135deg, var(--neural-safety) 0%, transparent 100%)' :
              userContext.userState === 'hyperaroused' ?
              'linear-gradient(135deg, var(--sanctuary-glass) 0%, transparent 100%)' :
              'linear-gradient(135deg, var(--neural-comfort) 0%, transparent 100%)',
            opacity: 0.03 // Extremely subtle
          }}
        />
      )}
      
      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 text-xs text-neural-comfort bg-sanctuary-glass p-2 rounded">
          State: {userContext.userState} | Nudges: {activeNudges.length} | Spatial: {spatialContext}
        </div>
      )}
    </div>
  );
}

// Pre-configured nudge triggers for common scenarios
export const commonNudgeTriggers = {
  morningMotivation: () => ({
    type: 'encouragement' as const,
    trigger: 'Morning neuroplasticity window',
    message: 'Your brain is most receptive to new learning right now. What would feel nourishing?'
  }),
  
  stressDetected: () => ({
    type: 'grounding' as const,
    trigger: 'Stress pattern detected',
    message: 'I notice some activation. Would a moment of grounding help?'
  }),
  
  habitReminder: (habitName: string) => ({
    type: 'reminder' as const,
    trigger: `Gentle ${habitName} reminder`,
    message: `When you\'re ready, ${habitName} is here for you.`
  }),
  
  progressCelebration: (achievement: string) => ({
    type: 'celebration' as const,
    trigger: 'Progress milestone',
    message: `Beautiful work on ${achievement}. Your neural pathways are strengthening.`
  })
};

export default GentleNudgeSystem;