// ALCHM Neuroplasticity Component: Premium Digital Sanctuary
// A trauma-informed, neuroplasticity-focused environment for positive habit formation
// Scientific Foundation: Leverages polyvagal theory, window of tolerance, and neural pathway strengthening

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SanctuaryShell } from '@/components/sacred/SanctuaryShell';

interface NeuroplasticityState {
  pathway: 'forming' | 'strengthening' | 'establishing' | 'mastering';
  progress: number; // 0-100
  synapticConnections: number;
  windowOfTolerance: 'dysregulated' | 'hyperarousal' | 'optimal' | 'hypoarousal';
  compassionLevel: number; // 0-100
}

interface PremiumDigitalSanctuaryProps {
  children: React.ReactNode;
  userId?: string;
  currentHabit?: string;
  neuroplasticityData?: Partial<NeuroplasticityState>;
  onStateChange?: (state: NeuroplasticityState) => void;
  enableGentleNudges?: boolean;
  celebrateProgress?: boolean;
  showNeuralGrowth?: boolean;
  className?: string;
}

export function PremiumDigitalSanctuary({
  children,
  userId,
  currentHabit,
  neuroplasticityData = {},
  onStateChange,
  enableGentleNudges = true,
  celebrateProgress = true,
  showNeuralGrowth = true,
  className = ''
}: PremiumDigitalSanctuaryProps) {
  // Neuroplasticity state management
  const [neuralState, setNeuralState] = useState<NeuroplasticityState>({
    pathway: 'forming',
    progress: 0,
    synapticConnections: 0,
    windowOfTolerance: 'optimal',
    compassionLevel: 100,
    ...neuroplasticityData
  });

  // Gentle encouragement timing based on circadian rhythms
  const [encouragementActive, setEncouragementActive] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const sanctuaryRef = useRef<HTMLDivElement>(null);
  const neuralGrowthRef = useRef<HTMLDivElement>(null);

  // Monitor user's nervous system state through interaction patterns
  useEffect(() => {
    if (!enableGentleNudges) return;

    const encouragementInterval = setInterval(() => {
      // Gentle nudge timing based on healing rhythm patterns
      const currentHour = new Date().getHours();
      const isOptimalTime = currentHour >= 8 && currentHour <= 20; // Daylight hours for cortisol optimization
      
      if (isOptimalTime && neuralState.windowOfTolerance === 'optimal') {
        setEncouragementActive(true);
        setTimeout(() => setEncouragementActive(false), 3000);
      }
    }, 300000); // Every 5 minutes - respects attention restoration

    return () => clearInterval(encouragementInterval);
  }, [enableGentleNudges, neuralState.windowOfTolerance]);

  // Celebration trigger for neuroplasticity milestones
  useEffect(() => {
    if (!celebrateProgress) return;

    const previousProgress = useRef(neuralState.progress);
    
    if (neuralState.progress > previousProgress.current && neuralState.progress % 25 === 0) {
      // Celebrate every 25% milestone to reinforce positive neural pathways
      setCelebrationVisible(true);
      setTimeout(() => setCelebrationVisible(false), 4000);
    }
    
    previousProgress.current = neuralState.progress;
  }, [neuralState.progress, celebrateProgress]);

  // Neural pathway visualization update
  useEffect(() => {
    if (showNeuralGrowth && neuralGrowthRef.current) {
      const connections = neuralGrowthRef.current.querySelectorAll('.neural-connection');
      connections.forEach((connection, index) => {
        const delay = index * 100; // Staggered growth animation
        setTimeout(() => {
          connection.classList.add('animate-neural-connection-grow');
        }, delay);
      });
    }
  }, [neuralState.synapticConnections, showNeuralGrowth]);

  // Update parent component with state changes
  useEffect(() => {
    onStateChange?.(neuralState);
  }, [neuralState, onStateChange]);

  // Handle user interactions that affect neuroplasticity
  const handleInteraction = (interactionType: 'positive' | 'neutral' | 'stress') => {
    setNeuralState(prev => {
      const newState = { ...prev };
      
      switch (interactionType) {
        case 'positive':
          newState.progress = Math.min(100, prev.progress + 2);
          newState.synapticConnections = prev.synapticConnections + 1;
          newState.compassionLevel = Math.min(100, prev.compassionLevel + 1);
          break;
        case 'stress':
          // Trauma-informed response: don't penalize, just pause growth
          newState.windowOfTolerance = 'hyperarousal';
          setTimeout(() => {
            setNeuralState(current => ({
              ...current,
              windowOfTolerance: 'optimal'
            }));
          }, 5000); // 5-second nervous system regulation period
          break;
        case 'neutral':
          // Maintain current state, allow natural settling
          break;
      }
      
      // Update pathway stage based on progress
      if (newState.progress < 25) newState.pathway = 'forming';
      else if (newState.progress < 50) newState.pathway = 'strengthening';
      else if (newState.progress < 75) newState.pathway = 'establishing';
      else newState.pathway = 'mastering';
      
      return newState;
    });
  };

  // Generate neural pathway visualization
  const renderNeuralPathways = () => {
    if (!showNeuralGrowth) return null;

    const connectionCount = Math.floor(neuralState.synapticConnections / 10);
    
    return (
      <div 
        ref={neuralGrowthRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {Array.from({ length: connectionCount }, (_, i) => (
          <div
            key={i}
            className="neural-connection absolute rounded-full bg-neural-growth opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 200}ms`
            }}
          />
        ))}
      </div>
    );
  };

  // Sanctuary classes based on neuroplasticity state
  const sanctuaryClasses = [
    'premium-digital-sanctuary',
    'relative',
    'min-h-screen',
    'transition-all',
    'duration-[var(--neural-medium)]',
    `pathway-${neuralState.pathway}`,
    `tolerance-${neuralState.windowOfTolerance}`,
    encouragementActive && 'animate-gentle-encourage',
    celebrationVisible && 'animate-healing-celebration',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={sanctuaryRef}
      className={sanctuaryClasses}
      style={{
        background: `linear-gradient(135deg, 
          var(--state-${neuralState.pathway}) 0%, 
          var(--sanctuary-glass) 50%, 
          var(--neural-safety) 100%)`
      }}
      onMouseEnter={() => handleInteraction('positive')}
      role="application"
      aria-label="Premium Digital Sanctuary for Neuroplasticity and Healing"
    >
      {/* Neural pathway visualization layer */}
      {renderNeuralPathways()}
      
      {/* Gentle encouragement ambient overlay */}
      {encouragementActive && (
        <div 
          className="absolute inset-0 pointer-events-none animate-self-compassion-glow opacity-30"
          aria-hidden="true"
        />
      )}
      
      {/* Celebration visual feedback */}
      {celebrationVisible && (
        <div className="absolute top-8 right-8 pointer-events-none">
          <div className="animate-growth-milestone text-2xl">
            🌱✨
          </div>
          <div className="text-sm text-neural-celebration font-light mt-2 animate-fade-in">
            Neural pathway strengthening!
          </div>
        </div>
      )}
      
      {/* Progress indicator with neuroplasticity visualization */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="flex items-center gap-3 sanctuary-glass p-3 rounded-xl backdrop-blur-md">
          {/* Circular progress ring showing synaptic strength */}
          <svg width="40" height="40" className="transform -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="var(--neural-comfort)"
              strokeWidth="2"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="var(--neural-growth)"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset={100 - neuralState.progress}
              className="animate-habit-progress-ring transition-all duration-[var(--neural-long)]"
            />
          </svg>
          
          {/* Pathway state indicator */}
          <div className="text-xs">
            <div className="text-neural-growth font-medium capitalize">
              {neuralState.pathway}
            </div>
            <div className="text-neural-connection opacity-75">
              {neuralState.progress}% formed
            </div>
          </div>
        </div>
      </div>
      
      {/* Nervous system state indicator */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <div className={`
          sanctuary-glass p-2 rounded-full backdrop-blur-md text-xs
          ${neuralState.windowOfTolerance === 'optimal' ? 'text-neural-growth' : 
            neuralState.windowOfTolerance === 'hyperarousal' ? 'text-orange-400' : 
            'text-blue-400'}
        `}>
          <div className={`w-3 h-3 rounded-full ${
            neuralState.windowOfTolerance === 'optimal' ? 'bg-neural-growth animate-gentle-pulse' : 
            neuralState.windowOfTolerance === 'hyperarousal' ? 'bg-orange-400 animate-pulse' : 
            'bg-blue-400 animate-pulse'
          }`} />
        </div>
      </div>
      
      {/* Main sanctuary content */}
      <SanctuaryShell
        energyLevel="gentle"
        consciousness="grounding"
        sacredSpace={true}
        className="relative z-10"
      >
        <div 
          className="animate-contemplative-breathe"
          onFocus={() => handleInteraction('positive')}
          onBlur={() => handleInteraction('neutral')}
        >
          {children}
        </div>
      </SanctuaryShell>
      
      {/* Habit formation context display */}
      {currentHabit && (
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          <div className="sanctuary-glass p-4 rounded-xl backdrop-blur-md text-center">
            <div className="text-sm text-neural-connection opacity-75 mb-1">
              Currently nurturing
            </div>
            <div className="text-neural-growth font-medium">
              {currentHabit}
            </div>
            <div className="flex justify-center mt-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < Math.floor(neuralState.progress / 20) 
                        ? 'bg-neural-growth animate-synaptic-strengthen' 
                        : 'bg-neural-comfort'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Premium Sanctuary with Enhanced Neuroplasticity Features
export function PremiumSanctuaryWithNeuroplasticity({
  children,
  ...props
}: PremiumDigitalSanctuaryProps) {
  return (
    <PremiumDigitalSanctuary
      {...props}
      enableGentleNudges={true}
      celebrateProgress={true}
      showNeuralGrowth={true}
    >
      {children}
    </PremiumDigitalSanctuary>
  );
}

export default PremiumDigitalSanctuary;