'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MomentumData {
  currentMomentum: number; // 0-100
  growthVelocity: 'gentle' | 'steady' | 'accelerating';
  breakthroughProximity: number; // 0-100
  lastBreakthrough: Date | null;
  emotionalResilience: number; // 0-100
  weeklyProgress: Array<{ day: string; energy: number }>;
}

interface TherapeuticMomentumDisplayProps {
  momentumData: MomentumData;
  isVisible?: boolean;
  onBreakthroughCelebration?: () => void;
}

export default function TherapeuticMomentumDisplay({
  momentumData,
  isVisible = true,
  onBreakthroughCelebration
}: TherapeuticMomentumDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimationProgress(momentumData.currentMomentum);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, momentumData.currentMomentum]);

  const getMomentumColor = (momentum: number) => {
    if (momentum >= 80) return 'text-sage-500';
    if (momentum >= 60) return 'text-sage-400';
    if (momentum >= 40) return 'text-sage-300';
    return 'text-sanctuary-gray-400';
  };

  const getMomentumDescription = (velocity: string, momentum: number) => {
    const descriptions = {
      gentle: {
        high: 'Your healing moves like morning mist - soft, steady, transformative',
        medium: 'Gentle waves of growth are building within you',
        low: 'Seeds of change rest quietly, gathering strength'
      },
      steady: {
        high: 'You are in a beautiful rhythm of sustainable growth',
        medium: 'Your therapeutic momentum flows like a peaceful river',
        low: 'Steady foundations are forming beneath the surface'
      },
      accelerating: {
        high: 'Breakthrough energy is gathering - something profound approaches',
        medium: 'Your growth is quickening with intentional purpose',
        low: 'Acceleration begins quietly, then builds with power'
      }
    };

    const level = momentum >= 70 ? 'high' : momentum >= 40 ? 'medium' : 'low';
    return descriptions[velocity][level];
  };

  const getBreakthroughMessage = (proximity: number) => {
    if (proximity >= 90) return 'Breakthrough imminent - trust the process';
    if (proximity >= 70) return 'Major shift approaching - prepare your heart';
    if (proximity >= 50) return 'Growth momentum building toward transformation';
    return 'Foundation strengthening for future breakthrough';
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-sanctuary-white rounded-3xl p-8 shadow-soft border border-sanctuary-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-sage-100 rounded-2xl flex items-center justify-center">
            <div className="w-6 h-6 bg-sage-400 rounded-full animate-gentle-pulse"></div>
          </div>
          <div>
            <h3 className="text-xl font-light text-sanctuary-gray-900 m-0">
              Therapeutic Momentum
            </h3>
            <p className="text-sanctuary-gray-600 text-sm m-0">
              Your inner growth in motion
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="
            text-sage-600 hover:text-sage-700 text-sm font-medium
            transition-colors duration-300
          "
        >
          {showDetails ? 'Simple view' : 'Details'}
        </button>
      </div>

      {/* Main Momentum Display */}
      <div className="text-center py-12 space-y-8">
        {/* Momentum Visualization */}
        <div className="relative">
          <div className="w-48 h-48 mx-auto relative">
            {/* Background Circle */}
            <div className="absolute inset-0 border-8 border-sanctuary-gray-100 rounded-full"></div>
            
            {/* Momentum Progress */}
            <motion.div
              className={`absolute inset-0 border-8 rounded-full ${getMomentumColor(momentumData.currentMomentum).replace('text-', 'border-')}`}
              style={{
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                transform: 'rotate(-90deg)'
              }}
              initial={{ clipPath: 'polygon(50% 50%, 50% 0%, 50% 0%, 50% 50%)' }}
              animate={{ 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + (animationProgress / 100) * 50}% 0%, 50% 50%)`
              }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className={`text-5xl font-extralight tracking-tight ${getMomentumColor(momentumData.currentMomentum)}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', bounce: 0.3 }}
              >
                {momentumData.currentMomentum}
              </motion.div>
              <div className="text-sanctuary-gray-500 text-sm font-medium">
                momentum
              </div>
            </div>
          </div>
        </div>

        {/* Momentum Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-md mx-auto space-y-4"
        >
          <p className="text-sanctuary-gray-800 font-medium">
            {getMomentumDescription(momentumData.growthVelocity, momentumData.currentMomentum)}
          </p>
          
          {/* Breakthrough Proximity */}
          <div className="bg-sage-50 rounded-2xl p-4 border border-sage-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sage-700 text-sm font-medium">Breakthrough Proximity</span>
              <span className="text-sage-600 text-sm">{momentumData.breakthroughProximity}%</span>
            </div>
            <div className="w-full bg-sage-100 rounded-full h-2">
              <motion.div
                className="bg-sage-400 h-2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${momentumData.breakthroughProximity}%` }}
                transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-sage-600 text-xs mt-2 text-center">
              {getBreakthroughMessage(momentumData.breakthroughProximity)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="pt-8 border-t border-sanctuary-gray-100 space-y-6"
          >
            {/* Weekly Progress */}
            <div>
              <h4 className="text-sanctuary-gray-900 font-medium mb-4">Weekly Energy Flow</h4>
              <div className="flex items-end justify-between space-x-2 h-24">
                {momentumData.weeklyProgress.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center space-y-2">
                    <motion.div
                      className="bg-sage-300 rounded-t-lg w-full"
                      initial={{ height: '0%' }}
                      animate={{ height: `${day.energy}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      style={{ minHeight: '4px' }}
                    />
                    <span className="text-xs text-sanctuary-gray-500">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emotional Resilience */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-sanctuary-gray-50 rounded-2xl">
                <div className="text-2xl font-light text-sage-500 mb-1">
                  {momentumData.emotionalResilience}%
                </div>
                <div className="text-sanctuary-gray-600 text-sm">
                  Emotional Resilience
                </div>
              </div>
              
              <div className="text-center p-4 bg-sanctuary-gray-50 rounded-2xl">
                <div className="text-2xl font-light text-sage-500 mb-1 capitalize">
                  {momentumData.growthVelocity}
                </div>
                <div className="text-sanctuary-gray-600 text-sm">
                  Growth Velocity
                </div>
              </div>
            </div>

            {/* Last Breakthrough */}
            {momentumData.lastBreakthrough && (
              <div className="text-center p-4 bg-warm-amber/10 rounded-2xl border border-warm-amber/20">
                <div className="text-warm-amber text-sm font-medium mb-1">
                  Last Breakthrough
                </div>
                <div className="text-sanctuary-gray-700 text-sm">
                  {momentumData.lastBreakthrough.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gentle Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center pt-8"
      >
        {momentumData.breakthroughProximity >= 80 && (
          <button
            onClick={onBreakthroughCelebration}
            className="
              bg-sage-400 hover:bg-sage-500 text-white
              px-8 py-3 rounded-2xl font-medium
              transition-all duration-300 shadow-soft
              hover:shadow-nurturing
            "
          >
            Celebrate this momentum ✨
          </button>
        )}
        
        {momentumData.currentMomentum < 30 && (
          <div className="bg-calm-blue/10 rounded-2xl p-4 border border-calm-blue/20">
            <p className="text-calm-blue text-sm">
              Remember: Healing isn't linear. Your gentle pace is perfect.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}