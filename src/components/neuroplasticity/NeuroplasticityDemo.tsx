// ALCHM Neuroplasticity Demo: Premium Digital Sanctuary Integration
// Demonstrates the complete neuroplasticity-focused design system in action

'use client';

import React, { useState, useEffect } from 'react';
import { 
  PremiumDigitalSanctuary,
  NeuroplasticityProgressVisualization,
  NeuroplasticityRewardSystem,
  HabitFormationLab,
  GentleNudgeSystem,
  MicroInteractionSystem
} from './index';
import { IntentionGem } from '@/components/sacred/IntentionGem';

interface DemoState {
  habits: any[];
  pathways: any[];
  userContext: any;
  neuroplasticityData: any;
}

export function NeuroplasticityDemo() {
  const [demoState, setDemoState] = useState<DemoState>({
    habits: [
      {
        id: 'morning-check-in',
        name: 'Morning Self-Check-In',
        category: 'self_compassion',
        neuralStrength: 45,
        consistencyStreak: 12,
        formationPhase: 'learning',
        routine: { action: 'Ask myself: How am I feeling right now?', duration: 2, difficulty: 'micro', neuralLoad: 10 },
        lastPerformed: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        id: 'three-breaths',
        name: 'Three Conscious Breaths',
        category: 'mindfulness',
        neuralStrength: 78,
        consistencyStreak: 23,
        formationPhase: 'stability',
        routine: { action: 'Take three slow, intentional breaths', duration: 1, difficulty: 'micro', neuralLoad: 5 }
      }
    ],
    pathways: [
      {
        id: 'self-compassion',
        name: 'Self-Compassion',
        strength: 65,
        formationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastReinforced: new Date(),
        category: 'emotional',
        milestones: [25, 50]
      },
      {
        id: 'mindful-breathing',
        name: 'Mindful Breathing',
        strength: 82,
        formationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        lastReinforced: new Date(),
        category: 'somatic',
        milestones: [25, 50, 75]
      },
      {
        id: 'emotional-regulation',
        name: 'Emotional Regulation',
        strength: 34,
        formationDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        lastReinforced: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        category: 'cognitive',
        milestones: [25]
      }
    ],
    userContext: {
      userState: 'regulated',
      timeOfDay: 'morning',
      lastInteraction: new Date(Date.now() - 60 * 1000),
      recentStressors: [],
      preferences: {
        nudgeIntensity: 'gentle',
        colorSensitivity: 'medium',
        spatialPreference: 'spacious'
      }
    },
    neuroplasticityData: {
      pathway: 'strengthening',
      progress: 67,
      synapticConnections: 156,
      windowOfTolerance: 'optimal',
      compassionLevel: 85
    }
  });

  const [selectedDemo, setSelectedDemo] = useState<'overview' | 'habits' | 'progress' | 'rewards' | 'nudges'>('overview');
  const [interactionCount, setInteractionCount] = useState(0);

  // Simulate neuroplasticity progress over time
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setDemoState(prev => ({
        ...prev,
        neuroplasticityData: {
          ...prev.neuroplasticityData,
          progress: Math.min(100, prev.neuroplasticityData.progress + 1),
          synapticConnections: prev.neuroplasticityData.synapticConnections + Math.floor(Math.random() * 3)
        }
      }));
    }, 3000);

    return () => clearInterval(progressInterval);
  }, []);

  // Handle habit practice
  const handleHabitPractice = (habitId: string) => {
    setDemoState(prev => ({
      ...prev,
      habits: prev.habits.map(habit => 
        habit.id === habitId 
          ? { 
              ...habit, 
              neuralStrength: Math.min(100, habit.neuralStrength + 5),
              lastPerformed: new Date()
            }
          : habit
      )
    }));
  };

  // Handle pathway selection
  const handlePathwaySelect = (pathway: any) => {
    console.log('Selected pathway:', pathway);
  };

  // Handle reward triggers
  const handleRewardTriggered = (reward: any) => {
    console.log('Reward triggered:', reward);
  };

  // Handle nudge responses
  const handleNudgeResponse = (nudgeId: string, response: 'helpful' | 'neutral' | 'overwhelming') => {
    console.log('Nudge response:', nudgeId, response);
  };

  // Handle interaction patterns
  const handleInteractionPattern = (pattern: string, significance: number) => {
    setInteractionCount(prev => prev + 1);
    console.log('Interaction pattern detected:', pattern, significance);
  };

  const { InteractionWrapper } = MicroInteractionSystem({
    context: {
      userIntention: 'exploring',
      emotionalState: 'content',
      energyLevel: 75,
      selfCompassionLevel: demoState.neuroplasticityData.compassionLevel,
      interactionHistory: []
    },
    enableSelfCompassionFeedback: true,
    enableGrowthMindsetCues: true,
    enableEmbodiedCognition: true,
    traumaInformed: true,
    feedbackIntensity: 'gentle',
    onInteractionPattern: handleInteractionPattern
  });

  const renderDemoContent = () => {
    switch (selectedDemo) {
      case 'habits':
        return (
          <InteractionWrapper elementId="habit-lab">
            <HabitFormationLab
              existingHabits={demoState.habits}
              enableNeuralTracking={true}
              traumaInformed={true}
              maxConcurrentHabits={3}
              onHabitProgress={(habitId, progress) => console.log('Habit progress:', habitId, progress)}
            />
          </InteractionWrapper>
        );

      case 'progress':
        return (
          <InteractionWrapper elementId="progress-viz">
            <NeuroplasticityProgressVisualization
              pathways={demoState.pathways}
              showGrowthAnimation={true}
              enableCelebrations={true}
              timeframe="weekly"
              onPathwaySelect={handlePathwaySelect}
            />
          </InteractionWrapper>
        );

      case 'rewards':
        return (
          <div className="space-y-6">
            <InteractionWrapper elementId="reward-system">
              <NeuroplasticityRewardSystem
                currentStreak={23}
                pathwayProgress={demoState.pathways.reduce((acc, p) => ({ ...acc, [p.name]: p.strength }), {})}
                enableAutoCelebration={true}
                traumaInformed={true}
                celebrationStyle="gentle"
                onRewardTriggered={handleRewardTriggered}
              />
            </InteractionWrapper>
            
            <div className="sanctuary-glass rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-light text-neural-growth mb-4">
                Trigger Manual Rewards
              </h3>
              <div className="flex gap-3">
                <IntentionGem
                  intent="celebration"
                  energy="gentle"
                  onClick={() => handleRewardTriggered({
                    type: 'milestone',
                    trigger: 'Demo milestone',
                    celebration: { visual: '🌟', message: 'You\'re exploring neuroplasticity beautifully!' }
                  })}
                >
                  Celebrate Progress
                </IntentionGem>
                <IntentionGem
                  intent="growth"
                  energy="presence"
                  onClick={() => handleRewardTriggered({
                    type: 'breakthrough',
                    trigger: 'Learning breakthrough',
                    celebration: { visual: '💫', message: 'Your understanding is deepening!' }
                  })}
                >
                  Breakthrough
                </IntentionGem>
              </div>
            </div>
          </div>
        );

      case 'nudges':
        return (
          <div className="space-y-6">
            <GentleNudgeSystem
              userContext={demoState.userContext}
              habitGoals={['Morning check-in', 'Mindful breathing']}
              currentActivity="exploring"
              enableSpatialNudges={true}
              enableColorNudges={true}
              enableTimingNudges={true}
              onNudgeTriggered={(nudge) => console.log('Nudge triggered:', nudge)}
              onUserResponse={handleNudgeResponse}
            />
            
            <div className="sanctuary-glass rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-light text-neural-growth mb-4">
                Nudge System Information
              </h3>
              <div className="space-y-3 text-sm text-neural-connection">
                <div>
                  <strong>User State:</strong> {demoState.userContext.userState}
                </div>
                <div>
                  <strong>Nudge Intensity:</strong> {demoState.userContext.preferences.nudgeIntensity}
                </div>
                <div>
                  <strong>Spatial Preference:</strong> {demoState.userContext.preferences.spatialPreference}
                </div>
                <div className="text-neural-comfort text-xs mt-3">
                  The nudge system adapts its intensity and timing based on your nervous system state 
                  and preferences, ensuring all guidance feels supportive rather than overwhelming.
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            {/* Overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InteractionWrapper elementId="overview-pathways">
                <div className="sanctuary-glass rounded-xl p-6 backdrop-blur-md animate-contemplative-breathe">
                  <h3 className="text-lg font-light text-neural-growth mb-4">
                    Neural Pathways Active
                  </h3>
                  <div className="space-y-3">
                    {demoState.pathways.map(pathway => (
                      <div key={pathway.id} className="flex items-center justify-between">
                        <span className="text-neural-connection">{pathway.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-state-forming rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-neural-growth transition-all duration-[var(--neural-long)] animate-habit-progress-ring"
                              style={{ width: `${pathway.strength}%` }}
                            />
                          </div>
                          <span className="text-xs text-neural-comfort">{pathway.strength}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </InteractionWrapper>

              <InteractionWrapper elementId="overview-stats">
                <div className="sanctuary-glass rounded-xl p-6 backdrop-blur-md animate-self-compassion-glow">
                  <h3 className="text-lg font-light text-neural-growth mb-4">
                    Neuroplasticity Metrics
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neural-connection">Neural Connections:</span>
                      <span className="text-neural-celebration">{demoState.neuroplasticityData.synapticConnections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neural-connection">Formation Progress:</span>
                      <span className="text-neural-celebration">{demoState.neuroplasticityData.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neural-connection">Self-Compassion:</span>
                      <span className="text-neural-celebration">{demoState.neuroplasticityData.compassionLevel}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neural-connection">Micro-Interactions:</span>
                      <span className="text-neural-celebration">{interactionCount}</span>
                    </div>
                  </div>
                </div>
              </InteractionWrapper>
            </div>

            {/* System explanation */}
            <InteractionWrapper elementId="overview-explanation">
              <div className="sanctuary-glass rounded-xl p-8 backdrop-blur-md">
                <h3 className="text-xl font-light text-neural-growth mb-6">
                  Premium Digital Sanctuary: Neuroplasticity in Action
                </h3>
                
                <div className="prose prose-sm max-w-none text-neural-connection">
                  <p className="mb-4">
                    This Premium Digital Sanctuary demonstrates how visual design can actively support 
                    positive neuroplasticity and trauma-informed healing. Every element is carefully 
                    crafted to reinforce growth mindset and self-compassion.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="text-neural-growth font-medium mb-2">Color Psychology</h4>
                      <p className="text-sm text-neural-comfort">
                        Sage green tones trigger neuroplasticity-associated calm and growth states. 
                        Color transitions reinforce positive neural pathway formation.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-neural-growth font-medium mb-2">Micro-Interactions</h4>
                      <p className="text-sm text-neural-comfort">
                        Every interaction provides gentle feedback that reinforces self-compassion 
                        and growth mindset through embodied cognition principles.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-neural-growth font-medium mb-2">Gentle Nudges</h4>
                      <p className="text-sm text-neural-comfort">
                        Trauma-informed behavioral guidance uses spatial design and color psychology 
                        to support habit formation without pressure or shame.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-neural-growth font-medium mb-2">Natural Celebrations</h4>
                      <p className="text-sm text-neural-comfort">
                        Rewards feel like natural consequences of growth, not gamification, 
                        supporting intrinsic motivation and neural pathway reinforcement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </InteractionWrapper>
          </div>
        );
    }
  };

  return (
    <PremiumDigitalSanctuary
      neuroplasticityData={demoState.neuroplasticityData}
      currentHabit={demoState.habits[0]?.name}
      enableGentleNudges={true}
      celebrateProgress={true}
      showNeuralGrowth={true}
      className="min-h-screen"
    >
      <div className="container mx-auto px-6 py-8">
        {/* Demo navigation */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-sanctuary mb-6 text-center">
            Premium Digital Sanctuary Demo
          </h1>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'overview', label: 'Overview', icon: '🏡' },
              { id: 'habits', label: 'Habit Lab', icon: '🧠' },
              { id: 'progress', label: 'Progress', icon: '📈' },
              { id: 'rewards', label: 'Rewards', icon: '✨' },
              { id: 'nudges', label: 'Nudges', icon: '🤲' }
            ].map(item => (
              <InteractionWrapper key={item.id} elementId={`nav-${item.id}`}>
                <button
                  onClick={() => setSelectedDemo(item.id as any)}
                  className={`px-4 py-2 rounded-xl transition-all duration-[var(--neural-medium)] ${
                    selectedDemo === item.id
                      ? 'bg-neural-growth text-sanctuary shadow-elevated'
                      : 'sanctuary-glass text-neural-connection hover:bg-synapse-forming backdrop-blur-md'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              </InteractionWrapper>
            ))}
          </div>
        </div>

        {/* Demo content */}
        <div className="max-w-6xl mx-auto">
          {renderDemoContent()}
        </div>
        
        {/* Interaction feedback display */}
        <div className="fixed bottom-4 right-4 sanctuary-glass p-3 rounded-lg backdrop-blur-md text-xs text-neural-comfort">
          Micro-interactions detected: {interactionCount}
        </div>
      </div>
    </PremiumDigitalSanctuary>
  );
}

export default NeuroplasticityDemo;