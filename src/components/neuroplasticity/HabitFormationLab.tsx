// ALCHM Neuroplasticity Component: Habit Formation Lab
// Scientific habit cultivation using neuroplasticity principles and trauma-informed design
// Research Foundation: Habit loop research, neural pathway formation, and implementation intentions

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IntentionGem } from '@/components/sacred/IntentionGem';

interface HabitCue {
  type: 'time' | 'location' | 'emotion' | 'preceding_action' | 'person';
  value: string;
  reliability: number; // 0-100
}

interface HabitRoutine {
  action: string;
  duration: number; // in minutes
  difficulty: 'micro' | 'small' | 'medium' | 'large';
  neuralLoad: number; // cognitive load 0-100
}

interface HabitReward {
  type: 'intrinsic' | 'extrinsic' | 'neurochemical';
  description: string;
  satisfaction: number; // 0-100
}

interface Habit {
  id: string;
  name: string;
  category: 'self_compassion' | 'mindfulness' | 'physical_care' | 'emotional_regulation' | 'connection';
  cue: HabitCue;
  routine: HabitRoutine;
  reward: HabitReward;
  neuralStrength: number; // 0-100
  consistencyStreak: number;
  formationPhase: 'initiation' | 'learning' | 'stability' | 'automaticity';
  traumaInformed: boolean;
  windowOfTolerance: 'safe' | 'stretch' | 'challenge';
  lastPerformed: Date | null;
  createdAt: Date;
}

interface HabitFormationLabProps {
  userId?: string;
  existingHabits?: Habit[];
  enableNeuralTracking?: boolean;
  traumaInformed?: boolean;
  maxConcurrentHabits?: number;
  onHabitCreated?: (habit: Habit) => void;
  onHabitProgress?: (habitId: string, progress: number) => void;
  className?: string;
}

export function HabitFormationLab({
  userId,
  existingHabits = [],
  enableNeuralTracking = true,
  traumaInformed = true,
  maxConcurrentHabits = 3,
  onHabitCreated,
  onHabitProgress,
  className = ''
}: HabitFormationLabProps) {
  const [habits, setHabits] = useState<Habit[]>(existingHabits);
  const [isCreatingHabit, setIsCreatingHabit] = useState(false);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({});
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [neuralVisualization, setNeuralVisualization] = useState<'pathway' | 'strength' | 'formation'>('pathway');
  const labRef = useRef<HTMLDivElement>(null);

  // Trauma-informed habit suggestions
  const habitTemplates = {
    self_compassion: [
      {
        name: "Morning self-check-in",
        routine: { action: "Ask myself: How am I feeling right now?", duration: 2, difficulty: 'micro' as const, neuralLoad: 10 },
        cue: { type: 'time' as const, value: "Upon waking", reliability: 90 },
        reward: { type: 'intrinsic' as const, description: "Self-awareness and connection", satisfaction: 80 }
      },
      {
        name: "Gentle self-talk",
        routine: { action: "Replace one critical thought with kindness", duration: 1, difficulty: 'micro' as const, neuralLoad: 15 },
        cue: { type: 'emotion' as const, value: "When noticing self-criticism", reliability: 70 },
        reward: { type: 'neurochemical' as const, description: "Serotonin boost from self-kindness", satisfaction: 85 }
      }
    ],
    mindfulness: [
      {
        name: "Three conscious breaths",
        routine: { action: "Take three slow, intentional breaths", duration: 1, difficulty: 'micro' as const, neuralLoad: 5 },
        cue: { type: 'preceding_action' as const, value: "Before opening phone", reliability: 85 },
        reward: { type: 'neurochemical' as const, description: "Calm nervous system activation", satisfaction: 90 }
      },
      {
        name: "Body scan micro-practice",
        routine: { action: "Notice three body sensations", duration: 2, difficulty: 'micro' as const, neuralLoad: 20 },
        cue: { type: 'time' as const, value: "Before meals", reliability: 80 },
        reward: { type: 'intrinsic' as const, description: "Embodied presence", satisfaction: 75 }
      }
    ],
    physical_care: [
      {
        name: "Hydration ritual",
        routine: { action: "Drink water mindfully, tasting it", duration: 1, difficulty: 'micro' as const, neuralLoad: 5 },
        cue: { type: 'time' as const, value: "Every 2 hours", reliability: 95 },
        reward: { type: 'intrinsic' as const, description: "Caring for my body", satisfaction: 70 }
      }
    ],
    emotional_regulation: [
      {
        name: "Name the emotion",
        routine: { action: "Identify and name current emotion", duration: 1, difficulty: 'micro' as const, neuralLoad: 25 },
        cue: { type: 'emotion' as const, value: "When feeling overwhelmed", reliability: 60 },
        reward: { type: 'neurochemical' as const, description: "Prefrontal cortex activation", satisfaction: 85 }
      }
    ],
    connection: [
      {
        name: "Gratitude moment",
        routine: { action: "Think of one person I appreciate", duration: 1, difficulty: 'micro' as const, neuralLoad: 10 },
        cue: { type: 'time' as const, value: "Before sleep", reliability: 85 },
        reward: { type: 'neurochemical' as const, description: "Oxytocin release", satisfaction: 90 }
      }
    ]
  };

  // Calculate neural pathway formation stage
  const calculateFormationPhase = (habit: Habit): Habit['formationPhase'] => {
    const { neuralStrength, consistencyStreak } = habit;
    
    if (neuralStrength < 25 || consistencyStreak < 7) return 'initiation';
    if (neuralStrength < 50 || consistencyStreak < 21) return 'learning';
    if (neuralStrength < 75 || consistencyStreak < 66) return 'stability';
    return 'automaticity';
  };

  // Update habit neural strength based on consistency
  useEffect(() => {
    const updateNeuralStrength = () => {
      setHabits(prevHabits => 
        prevHabits.map(habit => {
          const daysSincePerformed = habit.lastPerformed 
            ? Math.floor((Date.now() - habit.lastPerformed.getTime()) / (1000 * 60 * 60 * 24))
            : 0;
          
          // Neural pathway decay if not reinforced
          let strengthAdjustment = 0;
          if (daysSincePerformed === 0) {
            strengthAdjustment = +2; // Strengthen with practice
          } else if (daysSincePerformed > 3) {
            strengthAdjustment = -1; // Gradual decay
          }
          
          const newStrength = Math.max(0, Math.min(100, habit.neuralStrength + strengthAdjustment));
          const newPhase = calculateFormationPhase({ ...habit, neuralStrength: newStrength });
          
          // Report progress
          if (newStrength !== habit.neuralStrength) {
            onHabitProgress?.(habit.id, newStrength);
          }
          
          return {
            ...habit,
            neuralStrength: newStrength,
            formationPhase: newPhase
          };
        })
      );
    };

    const interval = setInterval(updateNeuralStrength, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [onHabitProgress]);

  // Create new habit with trauma-informed defaults
  const createHabit = (template?: typeof habitTemplates.self_compassion[0]) => {
    const habitId = `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const habit: Habit = {
      id: habitId,
      name: template?.name || newHabit.name || '',
      category: newHabit.category || 'self_compassion',
      cue: template?.cue || newHabit.cue || { type: 'time', value: '', reliability: 50 },
      routine: template?.routine || newHabit.routine || { action: '', duration: 1, difficulty: 'micro', neuralLoad: 10 },
      reward: template?.reward || newHabit.reward || { type: 'intrinsic', description: '', satisfaction: 50 },
      neuralStrength: 0,
      consistencyStreak: 0,
      formationPhase: 'initiation',
      traumaInformed: traumaInformed,
      windowOfTolerance: 'safe',
      lastPerformed: null,
      createdAt: new Date()
    };

    setHabits(prev => [...prev, habit]);
    onHabitCreated?.(habit);
    setIsCreatingHabit(false);
    setNewHabit({});
  };

  // Mark habit as performed
  const performHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => {
        if (habit.id !== habitId) return habit;
        
        const now = new Date();
        const daysSinceLastPerformed = habit.lastPerformed 
          ? Math.floor((now.getTime() - habit.lastPerformed.getTime()) / (1000 * 60 * 60 * 24))
          : 1;
        
        const newStreak = daysSinceLastPerformed <= 1 ? habit.consistencyStreak + 1 : 1;
        
        return {
          ...habit,
          lastPerformed: now,
          consistencyStreak: newStreak,
          neuralStrength: Math.min(100, habit.neuralStrength + 3)
        };
      })
    );
  };

  // Render neural pathway visualization
  const renderNeuralVisualization = (habit: Habit) => {
    const pathwayColor = `var(--${
      habit.formationPhase === 'initiation' ? 'synapse-forming' :
      habit.formationPhase === 'learning' ? 'synapse-strengthening' :
      habit.formationPhase === 'stability' ? 'synapse-established' :
      'synapse-mastered'
    })`;

    return (
      <div className="neural-pathway-viz flex items-center gap-3">
        {/* Cue node */}
        <div className="cue-node w-8 h-8 rounded-full bg-neural-growth opacity-80 flex items-center justify-center text-xs">
          C
        </div>
        
        {/* Connection strength indicator */}
        <div className="pathway-connection flex-1 h-2 bg-state-forming rounded-full relative overflow-hidden">
          <div 
            className="pathway-strength h-full rounded-full transition-all duration-[var(--neural-long)] animate-habit-progress-ring"
            style={{ 
              width: `${habit.neuralStrength}%`,
              backgroundColor: pathwayColor
            }}
          />
          {/* Neural activity sparkles */}
          {habit.neuralStrength > 20 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-neural-celebration animate-neural-connection-grow" />
            </div>
          )}
        </div>
        
        {/* Routine node */}
        <div className="routine-node w-8 h-8 rounded-full bg-neural-connection opacity-80 flex items-center justify-center text-xs">
          R
        </div>
        
        {/* Reward connection */}
        <div className="reward-connection w-6 h-2 bg-state-forming rounded-full relative">
          <div 
            className="reward-strength h-full rounded-full transition-all duration-[var(--neural-medium)]"
            style={{ 
              width: `${habit.reward.satisfaction}%`,
              backgroundColor: 'var(--neural-celebration)'
            }}
          />
        </div>
        
        {/* Reward node */}
        <div className="reward-node w-8 h-8 rounded-full bg-neural-celebration opacity-80 flex items-center justify-center text-xs">
          R
        </div>
      </div>
    );
  };

  return (
    <div ref={labRef} className={`habit-formation-lab space-y-6 ${className}`}>
      {/* Lab header */}
      <div className="sanctuary-glass rounded-2xl p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-light text-neural-growth">
            Neuroplasticity Habit Lab
          </h2>
          <div className="text-sm text-neural-comfort">
            {habits.length}/{maxConcurrentHabits} active pathways
          </div>
        </div>
        
        <p className="text-neural-connection opacity-80 mb-4">
          Build healing habits through gentle, trauma-informed neural pathway cultivation.
          Start with micro-practices that honor your nervous system's capacity.
        </p>
        
        {/* Neural visualization toggle */}
        {enableNeuralTracking && (
          <div className="flex gap-2">
            {(['pathway', 'strength', 'formation'] as const).map(view => (
              <button
                key={view}
                onClick={() => setNeuralVisualization(view)}
                className={`px-3 py-1 rounded-lg text-xs transition-all duration-[var(--neural-short)] ${
                  neuralVisualization === view 
                    ? 'bg-neural-growth text-sanctuary' 
                    : 'bg-state-forming text-neural-connection hover:bg-synapse-forming'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active habits */}
      <div className="space-y-4">
        {habits.map(habit => (
          <div 
            key={habit.id}
            className="sanctuary-glass rounded-xl p-6 backdrop-blur-md animate-contemplative-breathe"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-light text-neural-growth mb-2">
                  {habit.name}
                </h3>
                <p className="text-neural-connection text-sm mb-3">
                  {habit.routine.action}
                </p>
                
                {/* Neural pathway visualization */}
                {enableNeuralTracking && neuralVisualization === 'pathway' && (
                  <div className="mb-4">
                    {renderNeuralVisualization(habit)}
                  </div>
                )}
                
                {/* Formation phase indicator */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      habit.formationPhase === 'initiation' ? 'bg-synapse-forming animate-neural-forming' :
                      habit.formationPhase === 'learning' ? 'bg-synapse-strengthening animate-synaptic-strengthen' :
                      habit.formationPhase === 'stability' ? 'bg-synapse-established animate-gentle-encourage' :
                      'bg-synapse-mastered animate-self-compassion-glow'
                    }`} />
                    <span className="text-neural-comfort capitalize">
                      {habit.formationPhase}
                    </span>
                  </div>
                  
                  <div className="text-neural-comfort">
                    Streak: {habit.consistencyStreak} days
                  </div>
                  
                  <div className="text-neural-comfort">
                    Neural strength: {habit.neuralStrength}%
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2">
                <IntentionGem
                  intent="growth"
                  energy="gentle"
                  manifestation="breath"
                  onClick={() => performHabit(habit.id)}
                  className="text-xs px-4 py-2"
                >
                  Practice
                </IntentionGem>
                
                <button
                  onClick={() => setSelectedHabit(selectedHabit?.id === habit.id ? null : habit)}
                  className="text-neural-comfort hover:text-neural-growth transition-colors text-xs"
                >
                  Details
                </button>
              </div>
            </div>
            
            {/* Expanded details */}
            {selectedHabit?.id === habit.id && (
              <div className="border-t border-neural-comfort/20 pt-4 mt-4 animate-slide-in-up">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="text-neural-growth font-medium mb-2">Cue</h4>
                    <p className="text-neural-connection">{habit.cue.value}</p>
                    <p className="text-neural-comfort text-xs mt-1">
                      Reliability: {habit.cue.reliability}%
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-neural-growth font-medium mb-2">Routine</h4>
                    <p className="text-neural-connection">{habit.routine.action}</p>
                    <p className="text-neural-comfort text-xs mt-1">
                      Duration: {habit.routine.duration}min • {habit.routine.difficulty}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-neural-growth font-medium mb-2">Reward</h4>
                    <p className="text-neural-connection">{habit.reward.description}</p>
                    <p className="text-neural-comfort text-xs mt-1">
                      Satisfaction: {habit.reward.satisfaction}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create new habit */}
      {habits.length < maxConcurrentHabits && (
        <div className="sanctuary-glass rounded-xl p-6 backdrop-blur-md">
          {!isCreatingHabit ? (
            <div className="text-center">
              <IntentionGem
                intent="growth"
                energy="gentle"
                manifestation="voice"
                onClick={() => setIsCreatingHabit(true)}
                className="mb-4"
              >
                Cultivate New Habit
              </IntentionGem>
              
              <div className="text-neural-comfort text-sm mb-4">
                Or choose from trauma-informed templates:
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(habitTemplates).map(([category, templates]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-neural-growth text-sm font-medium capitalize">
                      {category.replace('_', ' ')}
                    </h4>
                    {templates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => createHabit(template)}
                        className="w-full text-left p-3 rounded-lg bg-state-forming hover:bg-synapse-forming transition-all duration-[var(--neural-short)] text-sm"
                      >
                        <div className="text-neural-connection font-medium mb-1">
                          {template.name}
                        </div>
                        <div className="text-neural-comfort text-xs">
                          {template.routine.action}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-light text-neural-growth">
                Create Custom Habit
              </h3>
              
              {/* Habit creation form */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Habit name"
                  value={newHabit.name || ''}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-state-forming border border-neural-comfort/20 text-neural-growth placeholder-neural-comfort/60"
                />
                
                <textarea
                  placeholder="What action will you take? (keep it small and specific)"
                  value={newHabit.routine?.action || ''}
                  onChange={(e) => setNewHabit(prev => ({ 
                    ...prev, 
                    routine: { ...prev.routine, action: e.target.value, duration: 1, difficulty: 'micro', neuralLoad: 10 }
                  }))}
                  className="w-full p-3 rounded-lg bg-state-forming border border-neural-comfort/20 text-neural-growth placeholder-neural-comfort/60 h-20 resize-none"
                />
                
                <div className="flex gap-3">
                  <IntentionGem
                    intent="healing"
                    energy="gentle"
                    onClick={() => createHabit()}
                    disabled={!newHabit.name || !newHabit.routine?.action}
                  >
                    Create Habit
                  </IntentionGem>
                  
                  <button
                    onClick={() => {
                      setIsCreatingHabit(false);
                      setNewHabit({});
                    }}
                    className="px-4 py-2 text-neural-comfort hover:text-neural-growth transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HabitFormationLab;