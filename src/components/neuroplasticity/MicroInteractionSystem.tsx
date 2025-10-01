// ALCHM Neuroplasticity Component: Micro-Interaction System
// Self-compassion and growth mindset reinforcement through subtle interactions
// Research Foundation: Micro-learning, positive psychology, and embodied cognition

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface InteractionContext {
  userIntention: 'exploring' | 'focused' | 'struggling' | 'celebrating' | 'resting';
  emotionalState: 'calm' | 'excited' | 'anxious' | 'content' | 'overwhelmed';
  energyLevel: number; // 0-100
  selfCompassionLevel: number; // 0-100
  interactionHistory: InteractionEvent[];
}

interface InteractionEvent {
  id: string;
  type: 'hover' | 'focus' | 'click' | 'scroll' | 'pause' | 'return';
  element: string;
  timestamp: Date;
  duration: number;
  pressure?: number; // For touch devices
  velocity?: number; // For scroll/swipe
}

interface MicroFeedback {
  visual: {
    colorShift: string;
    scaleChange: number;
    glowIntensity: number;
    rippleEffect: boolean;
  };
  haptic?: {
    type: 'gentle' | 'affirming' | 'celebratory';
    duration: number;
  };
  message?: {
    content: string;
    tone: 'encouraging' | 'supportive' | 'celebrating' | 'grounding';
    placement: 'tooltip' | 'floating' | 'inline' | 'ambient';
  };
  timing: {
    delay: number;
    duration: number;
    fadeOut: number;
  };
}

interface MicroInteractionSystemProps {
  context: Partial<InteractionContext>;
  enableSelfCompassionFeedback?: boolean;
  enableGrowthMindsetCues?: boolean;
  enableEmbodiedCognition?: boolean;
  traumaInformed?: boolean;
  feedbackIntensity?: 'whisper' | 'gentle' | 'warm' | 'encouraging';
  onInteractionPattern?: (pattern: string, significance: number) => void;
  className?: string;
}

export function MicroInteractionSystem({
  context,
  enableSelfCompassionFeedback = true,
  enableGrowthMindsetCues = true,
  enableEmbodiedCognition = true,
  traumaInformed = true,
  feedbackIntensity = 'gentle',
  onInteractionPattern,
  className = ''
}: MicroInteractionSystemProps) {
  const [activeFeedbacks, setActiveFeedbacks] = useState<Map<string, MicroFeedback>>(new Map());
  const [interactionBuffer, setInteractionBuffer] = useState<InteractionEvent[]>([]);
  const [patternDetection, setPatternDetection] = useState<Record<string, number>>({});
  const systemRef = useRef<HTMLDivElement>(null);
  const feedbackTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Self-compassion affirmations based on interaction patterns
  const selfCompassionResponses = {
    struggling: [
      "This is a moment of difficulty. You're not alone.",
      "It's okay to feel this way. You're being human.",
      "Your struggle is valid. Take this at your own pace.",
      "You're doing your best with what you have right now."
    ],
    exploring: [
      "Curious exploration is how growth happens.",
      "Your willingness to explore shows courage.",
      "Each step of discovery matters.",
      "You're expanding your world gently."
    ],
    celebrating: [
      "Your joy in this moment is beautiful.",
      "You deserve to celebrate your progress.",
      "This achievement reflects your dedication.",
      "Your growth is inspiring."
    ],
    focused: [
      "Your attention and focus are gifts you give yourself.",
      "Deep focus is a form of self-care.",
      "You're creating space for what matters.",
      "This concentration serves your wellbeing."
    ],
    resting: [
      "Rest is productive. Recovery is growth.",
      "Your body and mind deserve this pause.",
      "Stillness is where integration happens.",
      "You honor your needs by resting."
    ]
  };

  // Growth mindset cues for different interaction patterns
  const growthMindsetCues = {
    repeated_attempt: {
      message: "Each attempt builds neural pathways. You're literally growing your brain.",
      tone: 'encouraging' as const
    },
    pause_before_action: {
      message: "Thoughtful pauses show wisdom. Your reflection makes you stronger.",
      tone: 'supportive' as const
    },
    returning_to_element: {
      message: "Coming back shows persistence. This is how mastery develops.",
      tone: 'encouraging' as const
    },
    gentle_interaction: {
      message: "Gentleness with yourself creates the safest space for growth.",
      tone: 'grounding' as const
    },
    sustained_focus: {
      message: "Your sustained attention is building neural strength.",
      tone: 'celebrating' as const
    }
  };

  // Embodied cognition mappings - physical interaction affects mental state
  const embodiedCognitionMappings = {
    slow_deliberate: {
      mentalState: 'mindful',
      feedback: {
        colorShift: 'var(--neural-comfort)',
        message: 'Your slow, deliberate movement cultivates mindfulness.'
      }
    },
    quick_confident: {
      mentalState: 'empowered',
      feedback: {
        colorShift: 'var(--neural-growth)',
        message: 'Your confident interaction reflects inner strength.'
      }
    },
    gentle_touch: {
      mentalState: 'self_compassionate',
      feedback: {
        colorShift: 'var(--celebration-glow)',
        message: 'Gentle touch with your device reflects self-compassion.'
      }
    },
    rhythmic_pattern: {
      mentalState: 'regulated',
      feedback: {
        colorShift: 'var(--neural-safety)',
        message: 'Rhythmic interaction shows nervous system regulation.'
      }
    }
  };

  // Intensity scaling based on user preferences and trauma-informed settings
  const getIntensityScale = useCallback(() => {
    const baseScale = {
      whisper: 0.3,
      gentle: 0.6,
      warm: 0.8,
      encouraging: 1.0
    }[feedbackIntensity];

    // Reduce intensity if user is overwhelmed or anxious
    const stateModifier = context.emotionalState === 'overwhelmed' ? 0.5 :
                          context.emotionalState === 'anxious' ? 0.7 :
                          context.emotionalState === 'excited' ? 1.2 : 1.0;

    return Math.min(1.0, baseScale * stateModifier);
  }, [feedbackIntensity, context.emotionalState]);

  // Detect meaningful interaction patterns
  const analyzeInteractionPattern = useCallback((events: InteractionEvent[]) => {
    if (events.length < 2) return null;

    const recent = events.slice(-5); // Last 5 interactions
    const timings = recent.map((event, i) => 
      i > 0 ? event.timestamp.getTime() - recent[i-1].timestamp.getTime() : 0
    ).slice(1);

    // Detect patterns
    const patterns: Record<string, number> = {};

    // Rhythm detection
    const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
    const rhythmVariance = timings.reduce((acc, timing) => acc + Math.pow(timing - avgTiming, 2), 0) / timings.length;
    
    if (rhythmVariance < 1000) { // Low variance indicates rhythm
      patterns.rhythmic_interaction = Math.min(100, 100 - rhythmVariance / 10);
    }

    // Hesitation detection
    const longPauses = timings.filter(t => t > 3000).length;
    if (longPauses > 0) {
      patterns.thoughtful_pauses = (longPauses / timings.length) * 100;
    }

    // Gentleness detection (for touch devices)
    const gentleTouches = recent.filter(e => e.pressure && e.pressure < 0.3).length;
    if (gentleTouches > recent.length * 0.6) {
      patterns.gentle_interaction = 90;
    }

    // Return detection
    const elementReturns = recent.reduce((acc, event) => {
      acc[event.element] = (acc[event.element] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const maxReturns = Math.max(...Object.values(elementReturns));
    if (maxReturns > 2) {
      patterns.returning_to_element = (maxReturns / recent.length) * 100;
    }

    return patterns;
  }, []);

  // Generate appropriate micro-feedback
  const generateMicroFeedback = useCallback((
    interactionType: string,
    element: string,
    patterns: Record<string, number>
  ): MicroFeedback => {
    const intensity = getIntensityScale();
    
    // Base feedback configuration
    let feedback: MicroFeedback = {
      visual: {
        colorShift: 'var(--neural-connection)',
        scaleChange: 1 + (0.05 * intensity),
        glowIntensity: intensity * 0.3,
        rippleEffect: false
      },
      timing: {
        delay: traumaInformed ? 150 : 100,
        duration: 600 + (intensity * 400),
        fadeOut: 200
      }
    };

    // Self-compassion feedback
    if (enableSelfCompassionFeedback && context.userIntention) {
      const responses = selfCompassionResponses[context.userIntention];
      if (responses && Math.random() < 0.3) { // 30% chance of message
        feedback.message = {
          content: responses[Math.floor(Math.random() * responses.length)],
          tone: 'supportive',
          placement: 'floating'
        };
      }
    }

    // Growth mindset cues
    if (enableGrowthMindsetCues) {
      Object.entries(patterns).forEach(([pattern, strength]) => {
        if (strength > 70 && growthMindsetCues[pattern as keyof typeof growthMindsetCues]) {
          const cue = growthMindsetCues[pattern as keyof typeof growthMindsetCues];
          feedback.message = {
            content: cue.message,
            tone: cue.tone,
            placement: 'tooltip'
          };
          feedback.visual.glowIntensity *= 1.5;
        }
      });
    }

    // Embodied cognition responses
    if (enableEmbodiedCognition) {
      Object.entries(patterns).forEach(([pattern, strength]) => {
        const mapping = embodiedCognitionMappings[pattern as keyof typeof embodiedCognitionMappings];
        if (mapping && strength > 60) {
          feedback.visual.colorShift = mapping.feedback.colorShift;
          if (Math.random() < 0.2) { // 20% chance of embodied cognition message
            feedback.message = {
              content: mapping.feedback.message,
              tone: 'grounding',
              placement: 'ambient'
            };
          }
        }
      });
    }

    // Haptic feedback for supported devices
    if ('vibrate' in navigator && intensity > 0.7) {
      feedback.haptic = {
        type: 'gentle',
        duration: 50
      };
    }

    return feedback;
  }, [context, enableSelfCompassionFeedback, enableGrowthMindsetCues, enableEmbodiedCognition, traumaInformed, getIntensityScale]);

  // Handle interaction events
  const handleInteraction = useCallback((
    type: InteractionEvent['type'],
    element: string,
    additionalData?: Partial<InteractionEvent>
  ) => {
    const event: InteractionEvent = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      element,
      timestamp: new Date(),
      duration: 0,
      ...additionalData
    };

    // Update interaction buffer
    setInteractionBuffer(prev => {
      const updated = [...prev, event].slice(-20); // Keep last 20 interactions
      
      // Analyze patterns
      const patterns = analyzeInteractionPattern(updated);
      if (patterns) {
        setPatternDetection(prev => ({ ...prev, ...patterns }));
        
        // Report significant patterns
        Object.entries(patterns).forEach(([pattern, strength]) => {
          if (strength > 75) {
            onInteractionPattern?.(pattern, strength);
          }
        });
      }
      
      return updated;
    });

    // Generate and apply micro-feedback
    const patterns = patternDetection;
    const feedback = generateMicroFeedback(type, element, patterns);
    
    setActiveFeedbacks(prev => new Map(prev.set(element, feedback)));
    
    // Clear previous timeout for this element
    const existingTimeout = feedbackTimeouts.current.get(element);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Set new timeout to remove feedback
    const timeout = setTimeout(() => {
      setActiveFeedbacks(prev => {
        const updated = new Map(prev);
        updated.delete(element);
        return updated;
      });
      feedbackTimeouts.current.delete(element);
    }, feedback.timing.duration + feedback.timing.fadeOut);
    
    feedbackTimeouts.current.set(element, timeout);

    // Trigger haptic feedback if available
    if (feedback.haptic && 'vibrate' in navigator) {
      navigator.vibrate(feedback.haptic.duration);
    }
  }, [analyzeInteractionPattern, generateMicroFeedback, patternDetection, onInteractionPattern]);

  // Create interaction handlers for different elements
  const createInteractionHandlers = useCallback((elementId: string) => ({
    onMouseEnter: (e: React.MouseEvent) => {
      handleInteraction('hover', elementId, { 
        duration: 0 
      });
    },
    
    onMouseLeave: (e: React.MouseEvent) => {
      const hoverDuration = Date.now() - (activeFeedbacks.get(elementId)?.timing.delay || Date.now());
      handleInteraction('hover', elementId, { 
        duration: hoverDuration,
        type: 'pause'
      });
    },
    
    onFocus: (e: React.FocusEvent) => {
      handleInteraction('focus', elementId);
    },
    
    onClick: (e: React.MouseEvent) => {
      const clickPressure = 'force' in e.nativeEvent ? 
        (e.nativeEvent as any).force : 0.5;
      handleInteraction('click', elementId, { 
        pressure: clickPressure 
      });
    },
    
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const pressure = 'force' in touch ? touch.force : 0.3;
      handleInteraction('click', elementId, { 
        pressure 
      });
    }
  }), [handleInteraction, activeFeedbacks]);

  // Enhanced interaction wrapper component
  const InteractionWrapper = useCallback(({ 
    children, 
    elementId, 
    className: wrapperClassName = '',
    style = {}
  }: {
    children: React.ReactNode;
    elementId: string;
    className?: string;
    style?: React.CSSProperties;
  }) => {
    const feedback = activeFeedbacks.get(elementId);
    const handlers = createInteractionHandlers(elementId);
    
    const enhancedStyle = {
      ...style,
      transition: `all ${feedback?.timing.duration || 300}ms var(--ease-sanctuary)`,
      transform: feedback ? `scale(${feedback.visual.scaleChange})` : 'scale(1)',
      filter: feedback?.visual.glowIntensity ? 
        `drop-shadow(0 0 ${feedback.visual.glowIntensity * 20}px ${feedback.visual.colorShift})` : 
        'none',
      ...(feedback?.visual.colorShift && {
        backgroundColor: feedback.visual.colorShift,
        backgroundBlendMode: 'soft-light'
      })
    };

    return (
      <div
        className={`interaction-enhanced ${wrapperClassName}`}
        style={enhancedStyle}
        {...handlers}
      >
        {children}
        
        {/* Floating message */}
        {feedback?.message?.placement === 'floating' && feedback.message.content && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 sanctuary-glass p-2 rounded-lg backdrop-blur-md animate-fade-in z-50">
            <div className="text-xs text-neural-connection whitespace-nowrap">
              {feedback.message.content}
            </div>
          </div>
        )}
        
        {/* Ripple effect */}
        {feedback?.visual.rippleEffect && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full rounded-lg bg-neural-celebration opacity-20 animate-gentle-encourage" />
          </div>
        )}
      </div>
    );
  }, [activeFeedbacks, createInteractionHandlers]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      feedbackTimeouts.current.forEach(timeout => clearTimeout(timeout));
      feedbackTimeouts.current.clear();
    };
  }, []);

  return (
    <div ref={systemRef} className={`micro-interaction-system relative ${className}`}>
      {/* Ambient messages */}
      {Array.from(activeFeedbacks.entries()).map(([elementId, feedback]) => 
        feedback.message?.placement === 'ambient' && feedback.message.content && (
          <div 
            key={elementId}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 sanctuary-glass p-4 rounded-xl backdrop-blur-md animate-slide-in-up z-40"
          >
            <div className="text-sm text-neural-connection text-center max-w-md">
              {feedback.message.content}
            </div>
          </div>
        )
      )}
      
      {/* Pattern detection indicator (development only) */}
      {process.env.NODE_ENV === 'development' && Object.keys(patternDetection).length > 0 && (
        <div className="fixed top-16 right-4 sanctuary-glass p-3 rounded-lg backdrop-blur-md text-xs">
          <div className="text-neural-growth mb-2">Detected Patterns:</div>
          {Object.entries(patternDetection).map(([pattern, strength]) => (
            <div key={pattern} className="text-neural-connection">
              {pattern}: {Math.round(strength)}%
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Export the InteractionWrapper for use by other components
  return { InteractionWrapper, handleInteraction };
}

// Higher-order component for easy integration
export function withMicroInteractions<P extends object>(
  Component: React.ComponentType<P>,
  elementId: string
) {
  return function EnhancedComponent(props: P) {
    const { InteractionWrapper } = MicroInteractionSystem({
      context: {},
      enableSelfCompassionFeedback: true,
      enableGrowthMindsetCues: true,
      enableEmbodiedCognition: true
    });

    return (
      <InteractionWrapper elementId={elementId}>
        <Component {...props} />
      </InteractionWrapper>
    );
  };
}

export default MicroInteractionSystem;