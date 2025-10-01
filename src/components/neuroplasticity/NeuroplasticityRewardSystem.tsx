// ALCHM Neuroplasticity Component: Reward System
// Natural celebration patterns that reinforce positive neural pathways without triggering shame
// Scientific Foundation: Dopamine regulation, positive reinforcement learning, and trauma-informed rewards

'use client';

import React, { useState, useEffect, useRef } from 'react';

interface NeuralReward {
  id: string;
  type: 'micro' | 'milestone' | 'breakthrough' | 'transformation';
  trigger: string;
  celebration: {
    visual: string;
    message: string;
    duration: number;
    intensity: 'whisper' | 'gentle' | 'warm' | 'radiant';
  };
  neurochemicalBenefit: 'dopamine' | 'serotonin' | 'oxytocin' | 'endorphin';
  timestamp: Date;
}

interface RewardSystemProps {
  userId?: string;
  currentStreak?: number;
  pathwayProgress?: Record<string, number>;
  enableAutoCelebration?: boolean;
  traumaInformed?: boolean;
  celebrationStyle?: 'minimal' | 'gentle' | 'enthusiastic';
  onRewardTriggered?: (reward: NeuralReward) => void;
  className?: string;
}

export function NeuroplasticityRewardSystem({
  userId,
  currentStreak = 0,
  pathwayProgress = {},
  enableAutoCelebration = true,
  traumaInformed = true,
  celebrationStyle = 'gentle',
  onRewardTriggered,
  className = ''
}: RewardSystemProps) {
  const [activeRewards, setActiveRewards] = useState<NeuralReward[]>([]);
  const [celebrationQueue, setCelebrationQueue] = useState<NeuralReward[]>([]);
  const [userReceptivity, setUserReceptivity] = useState<'high' | 'medium' | 'low'>('medium');
  const rewardContainerRef = useRef<HTMLDivElement>(null);

  // Trauma-informed reward configuration
  const rewardConfigs = {
    micro: {
      visual: '✨',
      messages: [
        'Your brain is growing',
        'Neural pathway strengthening',
        'Gentle progress happening',
        'You\'re rewiring beautifully'
      ],
      duration: 2000,
      minInterval: 30000, // 30 seconds minimum between micro-rewards
    },
    milestone: {
      visual: '🌱',
      messages: [
        'Beautiful progress milestone',
        'Your dedication is healing',
        'Neural pathways strengthening',
        'Growth happening naturally'
      ],
      duration: 4000,
      minInterval: 300000, // 5 minutes minimum
    },
    breakthrough: {
      visual: '🌟',
      messages: [
        'Breakthrough moment achieved',
        'Significant neural rewiring',
        'Your brain is transforming',
        'Profound healing happening'
      ],
      duration: 6000,
      minInterval: 900000, // 15 minutes minimum
    },
    transformation: {
      visual: '💫',
      messages: [
        'Deep transformation emerging',
        'Neural architecture evolving',
        'Profound healing integration',
        'Your brain has fundamentally changed'
      ],
      duration: 8000,
      minInterval: 1800000, // 30 minutes minimum
    }
  };

  // Detect user's current receptivity to celebrations
  useEffect(() => {
    const detectReceptivity = () => {
      const currentHour = new Date().getHours();
      const isOptimalTime = currentHour >= 9 && currentHour <= 17; // Peak cortisol window
      
      // Check recent interaction patterns
      const recentRewards = activeRewards.filter(
        reward => Date.now() - reward.timestamp.getTime() < 600000 // Last 10 minutes
      );
      
      if (recentRewards.length > 3) {
        setUserReceptivity('low'); // Avoid overwhelming
      } else if (isOptimalTime && recentRewards.length <= 1) {
        setUserReceptivity('high');
      } else {
        setUserReceptivity('medium');
      }
    };

    const receptivityInterval = setInterval(detectReceptivity, 60000); // Check every minute
    detectReceptivity(); // Initial check

    return () => clearInterval(receptivityInterval);
  }, [activeRewards]);

  // Monitor pathway progress for reward triggers
  useEffect(() => {
    if (!enableAutoCelebration) return;

    Object.entries(pathwayProgress).forEach(([pathway, progress]) => {
      // Micro-rewards for incremental progress
      if (progress > 0 && progress % 5 === 0 && userReceptivity !== 'low') {
        triggerReward('micro', `${pathway} pathway progress`);
      }
      
      // Milestone rewards for significant progress
      if (progress > 0 && progress % 25 === 0) {
        triggerReward('milestone', `${pathway} milestone reached`);
      }
      
      // Breakthrough rewards for major achievements
      if (progress >= 75 && progress % 50 === 0) {
        triggerReward('breakthrough', `${pathway} breakthrough achieved`);
      }
      
      // Transformation rewards for completion
      if (progress === 100) {
        triggerReward('transformation', `${pathway} fully integrated`);
      }
    });
  }, [pathwayProgress, enableAutoCelebration, userReceptivity]);

  // Streak-based celebration triggers
  useEffect(() => {
    if (currentStreak > 0 && currentStreak % 7 === 0) {
      triggerReward('milestone', `${currentStreak} day consistency streak`);
    }
    
    if (currentStreak >= 21) { // Neural pathway formation window
      triggerReward('breakthrough', 'Neural pathway formation cycle completed');
    }
    
    if (currentStreak >= 66) { // Habit automation research threshold
      triggerReward('transformation', 'Habit deeply integrated into neural architecture');
    }
  }, [currentStreak]);

  // Generate culturally-sensitive, trauma-informed celebration
  const generateCelebration = (type: NeuralReward['type'], trigger: string): NeuralReward => {
    const config = rewardConfigs[type];
    const message = config.messages[Math.floor(Math.random() * config.messages.length)];
    
    // Adjust intensity based on trauma-informed settings and user receptivity
    let intensity: NeuralReward['celebration']['intensity'] = 'gentle';
    
    if (traumaInformed) {
      intensity = userReceptivity === 'high' ? 'warm' : 'whisper';
    } else {
      intensity = celebrationStyle === 'minimal' ? 'whisper' :
                  celebrationStyle === 'gentle' ? 'gentle' :
                  celebrationStyle === 'enthusiastic' ? 'radiant' : 'gentle';
    }
    
    // Map reward type to neurochemical benefit
    const neurochemicalMap = {
      micro: 'dopamine' as const,
      milestone: 'serotonin' as const,
      breakthrough: 'endorphin' as const,
      transformation: 'oxytocin' as const
    };

    return {
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      trigger,
      celebration: {
        visual: config.visual,
        message,
        duration: config.duration,
        intensity
      },
      neurochemicalBenefit: neurochemicalMap[type],
      timestamp: new Date()
    };
  };

  // Trigger reward with respect for user's nervous system state
  const triggerReward = (type: NeuralReward['type'], trigger: string) => {
    const config = rewardConfigs[type];
    const now = Date.now();
    
    // Check if enough time has passed since last reward of this type
    const lastSimilarReward = activeRewards
      .filter(reward => reward.type === type)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    if (lastSimilarReward && now - lastSimilarReward.timestamp.getTime() < config.minInterval) {
      return; // Respect minimum interval to avoid overwhelming
    }
    
    const reward = generateCelebration(type, trigger);
    
    // Add to celebration queue for gentle processing
    setCelebrationQueue(prev => [...prev, reward]);
    onRewardTriggered?.(reward);
  };

  // Process celebration queue with gentle timing
  useEffect(() => {
    if (celebrationQueue.length === 0) return;

    const processNextCelebration = () => {
      const [nextReward, ...remaining] = celebrationQueue;
      setCelebrationQueue(remaining);
      
      setActiveRewards(prev => [...prev, nextReward]);
      
      // Auto-remove after celebration duration
      setTimeout(() => {
        setActiveRewards(prev => prev.filter(r => r.id !== nextReward.id));
      }, nextReward.celebration.duration);
    };

    // Gentle timing between celebrations to avoid overwhelming
    const delay = traumaInformed ? 1000 : 500;
    const timer = setTimeout(processNextCelebration, delay);
    
    return () => clearTimeout(timer);
  }, [celebrationQueue, traumaInformed]);

  // Render individual celebration
  const renderCelebration = (reward: NeuralReward) => {
    const intensityClasses = {
      whisper: 'opacity-60 scale-95',
      gentle: 'opacity-80 scale-100',
      warm: 'opacity-90 scale-105',
      radiant: 'opacity-100 scale-110'
    };

    const animationClasses = {
      micro: 'animate-gentle-encourage',
      milestone: 'animate-growth-milestone',
      breakthrough: 'animate-healing-celebration',
      transformation: 'animate-self-compassion-glow'
    };

    return (
      <div
        key={reward.id}
        className={`
          celebration-reward fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
          sanctuary-glass rounded-2xl p-6 backdrop-blur-md
          ${intensityClasses[reward.celebration.intensity]}
          ${animationClasses[reward.type]}
          transition-all duration-[var(--neural-medium)]
        `}
        style={{
          background: `linear-gradient(135deg, var(--celebration-glow), var(--celebration-radiance))`,
          boxShadow: `0 0 ${reward.celebration.intensity === 'radiant' ? '40px' : '20px'} var(--feedback-celebrating)`
        }}
      >
        <div className="text-center">
          <div className="text-4xl mb-3 animate-gentle-sparkle">
            {reward.celebration.visual}
          </div>
          <div className="text-neural-growth font-light text-lg mb-2">
            {reward.celebration.message}
          </div>
          <div className="text-neural-comfort text-sm opacity-75">
            {reward.trigger}
          </div>
        </div>
        
        {/* Neural benefit indicator */}
        <div className="mt-4 text-center">
          <div className="text-xs text-neural-celebration opacity-60">
            {reward.neurochemicalBenefit} release supported
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={rewardContainerRef} className={`neuroplasticity-reward-system ${className}`}>
      {/* Active celebrations */}
      {activeRewards.map(renderCelebration)}
      
      {/* Subtle progress indicators in corner */}
      <div className="fixed bottom-4 right-4 pointer-events-none">
        {Object.entries(pathwayProgress).map(([pathway, progress], index) => (
          progress > 0 && (
            <div
              key={pathway}
              className="mb-2 sanctuary-glass rounded-lg p-2 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neural-growth animate-contemplative-breathe" />
                <div className="text-xs text-neural-connection opacity-75">
                  {pathway}: {progress}%
                </div>
              </div>
            </div>
          )
        ))}
      </div>
      
      {/* Celebration history summary */}
      {activeRewards.length > 0 && (
        <div className="fixed top-4 right-4 pointer-events-none">
          <div className="sanctuary-glass rounded-lg p-3 backdrop-blur-md">
            <div className="text-xs text-neural-celebration opacity-75 mb-1">
              Neural celebrations today
            </div>
            <div className="flex gap-1">
              {['micro', 'milestone', 'breakthrough', 'transformation'].map(type => {
                const count = activeRewards.filter(r => r.type === type).length;
                return count > 0 && (
                  <div
                    key={type}
                    className="w-2 h-2 rounded-full bg-neural-growth opacity-80"
                    style={{ 
                      backgroundColor: `var(--${type === 'micro' ? 'synapse-forming' : 
                                              type === 'milestone' ? 'synapse-strengthening' : 
                                              type === 'breakthrough' ? 'synapse-established' : 
                                              'synapse-mastered'})` 
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Manual reward trigger for specific achievements
export function triggerManualReward(
  type: NeuralReward['type'],
  trigger: string,
  rewardSystem: React.RefObject<{ triggerReward: (type: NeuralReward['type'], trigger: string) => void }>
) {
  rewardSystem.current?.triggerReward(type, trigger);
}

export default NeuroplasticityRewardSystem;