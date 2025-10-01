'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface UserProgress {
  totalPathwaysStarted: number;
  totalPathwaysCompleted: number;
  currentlyActive: number;
  weeklyProgress: number;
  healingMomentum: 'emerging' | 'growing' | 'blooming' | 'flourishing';
  milestones: Array<{
    id: string;
    title: string;
    achievedAt: Date;
    category: string;
  }>;
}

interface BotanicalProgressProps {
  userProgress: UserProgress;
}

// Botanical elements that grow based on progress
const GrowthElement = ({ progress, type }: { progress: number; type: 'seed' | 'sprout' | 'flower' | 'tree' }) => {
  const variants = {
    seed: {
      initial: { scale: 0, opacity: 0 },
      animate: { 
        scale: progress > 0 ? 1 : 0, 
        opacity: progress > 0 ? 1 : 0,
        rotate: [0, 5, -5, 0]
      }
    },
    sprout: {
      initial: { scaleY: 0, opacity: 0 },
      animate: { 
        scaleY: progress > 25 ? 1 : 0, 
        opacity: progress > 25 ? 1 : 0 
      }
    },
    flower: {
      initial: { scale: 0, opacity: 0, rotate: -45 },
      animate: { 
        scale: progress > 50 ? 1 : 0, 
        opacity: progress > 50 ? 1 : 0,
        rotate: progress > 50 ? 0 : -45
      }
    },
    tree: {
      initial: { scale: 0, opacity: 0 },
      animate: { 
        scale: progress > 75 ? 1 : 0, 
        opacity: progress > 75 ? 1 : 0 
      }
    }
  };

  const icons = {
    seed: '🌰',
    sprout: '🌱',
    flower: '🌸',
    tree: '🌳'
  };

  return (
    <motion.div
      className="text-4xl md:text-6xl"
      variants={variants[type]}
      initial="initial"
      animate="animate"
      transition={{ 
        duration: 1.5, 
        delay: type === 'seed' ? 0 : type === 'sprout' ? 0.3 : type === 'flower' ? 0.6 : 0.9,
        type: "spring",
        stiffness: 120,
        damping: 15
      }}
    >
      {icons[type]}
    </motion.div>
  );
};

// Flowing water progress indicator
const FlowingProgress = ({ progress }: { progress: number }) => {
  return (
    <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400/70 via-teal-400/70 to-green-400/70 rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Flowing sparkles */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        animate={{
          backgroundPosition: ['0% 0%', '100% 0%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            rgba(255,255,255,0.4) 25%, 
            transparent 50%, 
            rgba(255,255,255,0.4) 75%, 
            transparent 100%)`,
          backgroundSize: '50% 100%'
        }}
      />
    </div>
  );
};

// Milestone celebration with particle effects
const MilestoneCard = ({ milestone }: { milestone: UserProgress['milestones'][0] }) => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="relative bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 20px 40px rgba(255,255,255,0.1)" 
      }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="text-2xl"
          animate={showParticles ? {
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : {}}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
        >
          ⭐
        </motion.div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm mb-1 truncate">
            {milestone.title}
          </h4>
          <p className="text-white/70 text-xs">
            {milestone.category}
          </p>
        </div>
      </div>

      {/* Particle effect */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              initial={{ 
                x: '50%', 
                y: '50%', 
                scale: 0, 
                opacity: 1 
              }}
              animate={{
                x: [
                  '50%',
                  `${50 + (Math.random() - 0.5) * 200}%`
                ],
                y: [
                  '50%',
                  `${50 + (Math.random() - 0.5) * 200}%`
                ],
                scale: [0, 1, 0],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 4
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Healing momentum visualization
const HealingMomentumIndicator = ({ momentum }: { momentum: UserProgress['healingMomentum'] }) => {
  const momentumConfig = {
    emerging: { 
      icon: '🌱', 
      color: 'from-green-400 to-emerald-500',
      description: 'Your healing journey is taking root',
      intensity: 1
    },
    growing: { 
      icon: '🌿', 
      color: 'from-emerald-400 to-teal-500',
      description: 'Steady growth and new insights emerging',
      intensity: 2
    },
    blooming: { 
      icon: '🌸', 
      color: 'from-pink-400 to-rose-500',
      description: 'Beautiful transformation blossoming',
      intensity: 3
    },
    flourishing: { 
      icon: '🌺', 
      color: 'from-purple-400 to-pink-500',
      description: 'Thriving in your authentic power',
      intensity: 4
    }
  };

  const config = momentumConfig[momentum];

  return (
    <motion.div
      className={`bg-gradient-to-br ${config.color} p-6 rounded-3xl text-white relative overflow-hidden`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px, 15px 15px'
        }}
      />
      
      <div className="relative z-10 text-center">
        <motion.div
          className="text-5xl mb-3"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {config.icon}
        </motion.div>
        <h3 className="text-xl font-light mb-2 capitalize">
          {momentum}
        </h3>
        <p className="text-white/90 text-sm leading-relaxed">
          {config.description}
        </p>
        
        {/* Energy waves */}
        <div className="mt-4 flex justify-center gap-1">
          {[...Array(config.intensity)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-8 bg-white/40 rounded-full"
              animate={{
                scaleY: [0.3, 1, 0.3],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export function BotanicalProgress({ userProgress }: BotanicalProgressProps) {
  const overallProgress = (userProgress.totalPathwaysCompleted / Math.max(userProgress.totalPathwaysStarted, 1)) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
          Your Healing Garden
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
          Watch your progress bloom through gentle, organic growth that honors your unique journey
        </p>
      </div>

      {/* Main Growth Visualization */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Botanical Growth Timeline */}
          <div className="space-y-8">
            <div className="text-center space-y-6">
              <h3 className="text-xl font-light text-white mb-6">
                Growth Timeline
              </h3>
              
              {/* Growth stages */}
              <div className="flex justify-center items-end gap-4 h-32">
                <GrowthElement progress={overallProgress} type="seed" />
                <GrowthElement progress={overallProgress} type="sprout" />
                <GrowthElement progress={overallProgress} type="flower" />
                <GrowthElement progress={overallProgress} type="tree" />
              </div>
            </div>

            {/* Progress Flow */}
            <div className="space-y-3">
              <div className="flex justify-between text-white/80 text-sm">
                <span>Weekly Progress</span>
                <span>{userProgress.weeklyProgress}%</span>
              </div>
              <FlowingProgress progress={userProgress.weeklyProgress} />
            </div>
          </div>

          {/* Healing Momentum */}
          <div className="space-y-6">
            <HealingMomentumIndicator momentum={userProgress.healingMomentum} />
            
            {/* Active pathways indicator */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-white font-medium mb-1">
                  {userProgress.currentlyActive} Pathways Growing
                </div>
                <div className="text-white/70 text-sm">
                  Currently nurturing your healing journey
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Milestones */}
      {userProgress.milestones.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-light text-white text-center">
            Recent Celebrations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProgress.milestones.slice(0, 6).map((milestone) => (
              <MilestoneCard key={milestone.id} milestone={milestone} />
            ))}
          </div>
        </div>
      )}

      {/* Encouragement message */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
          <div className="text-3xl mb-3">💚</div>
          <p className="text-white/90 leading-relaxed">
            Every step forward in your healing journey matters. Trust in your natural capacity 
            for growth and remember that transformation happens in its own perfect timing.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default BotanicalProgress;