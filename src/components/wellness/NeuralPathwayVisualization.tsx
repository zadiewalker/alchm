'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NeuralPathwayVisualizationProps {
  pathwayStrength: number; // 0-100
  pathwayName: string;
  targetRegion: string;
  daysPracticed: number;
  milestones: NeuroplasticityMilestone[];
  onCelebrateMilestone?: (milestone: NeuroplasticityMilestone) => void;
}

interface NeuroplasticityMilestone {
  name: string;
  description: string;
  achieved: boolean;
  date?: Date;
  strength_threshold: number;
}

export const NeuralPathwayVisualization: React.FC<NeuralPathwayVisualizationProps> = ({
  pathwayStrength,
  pathwayName,
  targetRegion,
  daysPracticed,
  milestones,
  onCelebrateMilestone
}) => {
  const [animatedStrength, setAnimatedStrength] = useState(0);
  const [showCelebration, setShowCelebration] = useState<NeuroplasticityMilestone | null>(null);

  useEffect(() => {
    // Animate the pathway strength
    const timer = setTimeout(() => {
      setAnimatedStrength(pathwayStrength);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathwayStrength]);

  useEffect(() => {
    // Check for newly achieved milestones
    const newlyAchieved = milestones.find(m => 
      !m.achieved && pathwayStrength >= m.strength_threshold
    );

    if (newlyAchieved) {
      setShowCelebration(newlyAchieved);
      setTimeout(() => setShowCelebration(null), 5000);
      onCelebrateMilestone?.(newlyAchieved);
    }
  }, [pathwayStrength, milestones, onCelebrateMilestone]);

  const getStrengthPhase = (strength: number): {
    phase: string;
    color: string;
    description: string;
    icon: string;
  } => {
    if (strength >= 90) return {
      phase: 'Mastery',
      color: 'from-purple-400 to-purple-600',
      description: 'Highly integrated neural pathway',
      icon: '✨'
    };
    if (strength >= 70) return {
      phase: 'Integration',
      color: 'from-green-400 to-green-600',
      description: 'Strong, stable neural connections',
      icon: '🌟'
    };
    if (strength >= 50) return {
      phase: 'Strengthening',
      color: 'from-sage-400 to-sage-600',
      description: 'Pathway consolidating and growing',
      icon: '🌱'
    };
    if (strength >= 25) return {
      phase: 'Formation',
      color: 'from-blue-400 to-blue-600',
      description: 'New neural pathways taking shape',
      icon: '🔗'
    };
    return {
      phase: 'Initiation',
      color: 'from-gray-400 to-gray-600',
      description: 'Beginning neural adaptation',
      icon: '💫'
    };
  };

  const strengthPhase = getStrengthPhase(animatedStrength);

  // Generate neural network visualization points
  const generateNetworkPoints = (strength: number) => {
    const points = [];
    const density = Math.floor(strength / 10) + 2;
    
    for (let i = 0; i < density; i++) {
      points.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    return points;
  };

  const networkPoints = generateNetworkPoints(animatedStrength);

  return (
    <div className="space-y-6">
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center transform animate-pulse">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-light text-sage-800 mb-4">
              Milestone Achieved!
            </h2>
            <h3 className="text-xl font-medium text-sage-700 mb-2">
              {showCelebration.name}
            </h3>
            <p className="text-sage-600 mb-6">
              {showCelebration.description}
            </p>
            <div className="bg-gradient-to-r from-sage-100 to-sage-50 p-4 rounded-lg border border-sage-200">
              <div className="text-sm text-sage-700">
                🧠 Your brain has created measurable structural changes through consistent practice!
              </div>
            </div>
            <Button
              onClick={() => setShowCelebration(null)}
              className="mt-6 bg-sage-600 hover:bg-sage-700 text-white px-8 py-2 rounded-full"
            >
              Continue Journey ✨
            </Button>
          </div>
        </div>
      )}

      {/* Main Visualization */}
      <Card className="p-8 bg-gradient-to-br from-white to-sage-50 border-sage-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-medium text-sage-800">
              {pathwayName}
            </h3>
            <div className="text-sage-600 text-sm">
              Target: {targetRegion} • {daysPracticed} days practiced
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${strengthPhase.color} text-white text-sm font-medium`}>
              <span className="mr-2">{strengthPhase.icon}</span>
              {strengthPhase.phase}
            </div>
          </div>
        </div>

        {/* Neural Network Visualization */}
        <div className="relative mb-8">
          <div className="w-full h-48 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 relative overflow-hidden">
            
            {/* Background Neural Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern id="neural-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="#8b9dc3" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#neural-grid)"/>
            </svg>

            {/* Animated Network Points */}
            <div className="absolute inset-0">
              {networkPoints.map((point, index) => (
                <div
                  key={index}
                  className="absolute bg-sage-500 rounded-full animate-pulse"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    width: `${point.size}px`,
                    height: `${point.size}px`,
                    opacity: point.opacity,
                    animationDelay: `${index * 0.1}s`
                  }}
                />
              ))}
            </div>

            {/* Pathway Strength Visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#pathwayGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2.51 * animatedStrength} ${251 - 2.51 * animatedStrength}`}
                      className="transition-all duration-2000 ease-out"
                    />
                    <defs>
                      <linearGradient id="pathwayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a4b792" />
                        <stop offset="100%" stopColor="#7a9971" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-light text-sage-800">
                        {Math.round(animatedStrength)}%
                      </div>
                      <div className="text-xs text-sage-600">
                        Strength
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-indigo-700 bg-white bg-opacity-75 px-3 py-1 rounded-full">
                  {strengthPhase.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline and Milestones */}
        <div className="space-y-4">
          <h4 className="font-medium text-sage-800">Neuroplasticity Milestones</h4>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-sage-200"></div>
            <div 
              className="absolute left-4 top-0 w-0.5 bg-sage-500 transition-all duration-2000 ease-out"
              style={{ 
                height: `${(milestones.filter(m => animatedStrength >= m.strength_threshold).length / milestones.length) * 100}%` 
              }}
            ></div>
            
            {/* Milestone Items */}
            <div className="space-y-4">
              {milestones.map((milestone, index) => {
                const isAchieved = animatedStrength >= milestone.strength_threshold;
                const isActive = animatedStrength >= milestone.strength_threshold - 10 && 
                                 animatedStrength < milestone.strength_threshold;
                
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isAchieved 
                        ? 'bg-sage-500 border-sage-500 text-white' 
                        : isActive
                          ? 'bg-sage-100 border-sage-400 text-sage-600'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      {isAchieved ? '✓' : index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${
                        isAchieved ? 'text-sage-800' : isActive ? 'text-sage-700' : 'text-gray-500'
                      }`}>
                        {milestone.name}
                      </div>
                      <div className={`text-sm ${
                        isAchieved ? 'text-sage-600' : isActive ? 'text-sage-600' : 'text-gray-400'
                      }`}>
                        {milestone.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Threshold: {milestone.strength_threshold}% pathway strength
                      </div>
                      {milestone.achieved && milestone.date && (
                        <div className="text-xs text-sage-500 mt-1">
                          Achieved: {milestone.date.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scientific Insight */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-blue-600 text-lg mr-2">🧬</span>
            <h5 className="font-medium text-blue-800">Neuroplasticity Science</h5>
          </div>
          <div className="text-sm text-blue-700">
            Your consistent practice is creating measurable changes in your brain's structure and function. 
            The {targetRegion.toLowerCase()} region is developing stronger neural networks through 
            repeated activation and consolidation during your {daysPracticed} days of practice.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NeuralPathwayVisualization;