/**
 * Neuroplasticity Visualization Component
 * 
 * Revolutionary React component that shows users real-time neural pathway changes
 * happening in their brains through habit practice. Uses the NeuralPathwayVisualizationEngine
 * to display scientifically accurate brain changes with trauma-informed adaptations.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NeuralPathwayVisualizationEngine } from '@/lib/neural-pathway-visualization-engine';

interface NeuroplasticityVisualizationProps {
  userId: string;
  habitData: {
    habitId: string;
    habitName: string;
    completionHistory: Date[];
    practiceQuality: number[];
    difficultyProgression: number[];
    establishmentDate: Date;
  };
  traumaProfile: {
    nervousSystemRegulation: number;
    executiveFunctionCapacity: number;
    stressTolerance: number;
    windowOfTolerance: number;
    celebrationSensitivity: 'subtle' | 'gentle' | 'moderate' | 'enthusiastic';
    overwhelmProtection: boolean;
  };
  visualizationPreferences: {
    style: 'scientific' | 'artistic' | 'gentle' | 'celebratory';
    complexity: 'simple' | 'detailed' | 'comprehensive';
    animations: 'minimal' | 'moderate' | 'dynamic';
    timeFrame: '24h' | '7d' | '30d' | '90d' | '1y';
  };
  onMilestoneReached?: (milestone: any) => void;
  className?: string;
}

export default function NeuroplasticityVisualization({
  userId,
  habitData,
  traumaProfile,
  visualizationPreferences,
  onMilestoneReached,
  className = ''
}: NeuroplasticityVisualizationProps) {
  const [neuroplasticityMetrics, setNeuroplasticityMetrics] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [currentCelebration, setCurrentCelebration] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'milestones'>('overview');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Calculate neuroplasticity metrics on mount and when data changes
  useEffect(() => {
    const metrics = NeuralPathwayVisualizationEngine.calculateNeuroplasticityMetrics(
      {
        completionHistory: habitData.completionHistory,
        consistencyWindow: 30,
        practiceQuality: habitData.practiceQuality,
        difficultyProgression: habitData.difficultyProgression
      },
      traumaProfile,
      visualizationPreferences.timeFrame
    );

    setNeuroplasticityMetrics(metrics);

    // Generate milestones
    const generatedMilestones = NeuralPathwayVisualizationEngine.generateNeuroplasticityMilestones(
      {
        establishmentDate: habitData.establishmentDate,
        currentStrength: metrics.neuroplasticityScore,
        practiceCount: habitData.completionHistory.length,
        consistencyScore: 80 // This would come from the metrics calculation
      },
      {
        celebrationSensitivity: traumaProfile.celebrationSensitivity,
        overwhelmProtection: traumaProfile.overwhelmProtection,
        positiveFraming: true
      }
    );

    setMilestones(generatedMilestones);

    // Check for new milestones
    generatedMilestones.forEach(milestone => {
      if (milestone.achievedAt <= new Date() && !celebrationActive) {
        triggerMilestoneCelebration(milestone);
      }
    });
  }, [habitData, traumaProfile, visualizationPreferences.timeFrame]);

  // Canvas animation for neural pathway visualization
  useEffect(() => {
    if (!neuroplasticityMetrics || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      if (isPaused) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw neural network visualization
      drawNeuralNetwork(ctx, neuroplasticityMetrics);
      
      if (!isPaused) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [neuroplasticityMetrics, isPaused]);

  const triggerMilestoneCelebration = (milestone: any) => {
    if (traumaProfile.overwhelmProtection && celebrationActive) return;

    setCelebrationActive(true);
    setCurrentCelebration(milestone);
    
    if (onMilestoneReached) {
      onMilestoneReached(milestone);
    }

    // Auto-dismiss celebration after appropriate duration
    const duration = traumaProfile.celebrationSensitivity === 'subtle' ? 3000 : 5000;
    setTimeout(() => {
      setCelebrationActive(false);
      setCurrentCelebration(null);
    }, duration);
  };

  const drawNeuralNetwork = (ctx: CanvasRenderingContext2D, metrics: any) => {
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;

    // Draw main neural pathway
    ctx.save();
    
    // Pathway strength determines line thickness and glow
    const pathwayThickness = Math.max(2, metrics.visualizationData.pathwayThickness);
    const glowIntensity = metrics.visualizationData.glowIntensity;
    
    // Create gradient for pathway
    const gradient = ctx.createLinearGradient(
      centerX - radius, centerY,
      centerX + radius, centerY
    );
    
    // Color based on trauma sensitivity
    const baseColor = traumaProfile.celebrationSensitivity === 'subtle' 
      ? `rgba(99, 102, 241, ${glowIntensity / 200})` 
      : `rgba(99, 102, 241, ${glowIntensity / 100})`;
    
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0)');
    gradient.addColorStop(0.5, baseColor);
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    // Draw pathway with pulsing effect
    const pulsePhase = Date.now() * metrics.visualizationData.pulseFrequency * 0.001;
    const pulseIntensity = (Math.sin(pulsePhase) + 1) * 0.5;
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = pathwayThickness * (1 + pulseIntensity * 0.3);
    ctx.globalAlpha = 0.7 + pulseIntensity * 0.3;
    
    // Draw curved pathway representing neural connections
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw synaptic nodes
    const nodeCount = Math.min(12, Math.max(4, Math.floor(metrics.connectionDensityIncrease / 10)));
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const nodeX = centerX + Math.cos(angle) * radius;
      const nodeY = centerY + Math.sin(angle) * radius;
      
      // Node size based on synaptic strength
      const nodeSize = 3 + (metrics.synapticStrengthChange / 100) * 5;
      
      ctx.fillStyle = `rgba(34, 197, 94, ${0.6 + pulseIntensity * 0.4})`;
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, nodeSize, 0, Math.PI * 2);
      ctx.fill();

      // Connection strength indicators
      if (i < metrics.visualizationData.connectionStrength.length) {
        const connectionStrength = metrics.visualizationData.connectionStrength[i];
        ctx.strokeStyle = `rgba(34, 197, 94, ${connectionStrength / 200})`;
        ctx.lineWidth = 1 + (connectionStrength / 100) * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nodeX, nodeY);
        ctx.stroke();
      }
    }

    ctx.restore();
  };

  const formatNeuroplasticityScore = (score: number): string => {
    if (score >= 90) return 'Exceptional neuroplasticity - your brain is thriving!';
    if (score >= 70) return 'Strong neural pathway development';
    if (score >= 50) return 'Healthy brain changes in progress';
    if (score >= 30) return 'Neural pathways beginning to form';
    return 'Early stages of brain adaptation';
  };

  const getNeurotransmitterColor = (neurotransmitter: string): string => {
    const colors = {
      dopamine: '#ef4444', // Red for motivation/reward
      serotonin: '#22c55e', // Green for well-being
      gaba: '#3b82f6',      // Blue for calm
      acetylcholine: '#f59e0b' // Amber for focus
    };
    return colors[neurotransmitter as keyof typeof colors] || '#64748b';
  };

  if (!neuroplasticityMetrics) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Milestone Celebration Modal */}
      {celebrationActive && currentCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-8 max-w-md mx-4 text-center space-y-4">
            <div className="text-2xl">🧠✨</div>
            <h3 className="text-xl font-bold text-gray-900">
              Neuroplasticity Milestone Reached!
            </h3>
            <p className="text-gray-700">
              {currentCelebration.celebrationMessage}
            </p>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>What's happening in your brain:</strong><br />
              {currentCelebration.neurologicalSignificance}
            </div>
            <div className="text-xs text-gray-500">
              Research basis: {currentCelebration.researchBasis}
            </div>
            {traumaProfile.overwhelmProtection && (
              <Button 
                onClick={() => {
                  setCelebrationActive(false);
                  setCurrentCelebration(null);
                }}
                variant="outline"
                size="sm"
              >
                Continue at my pace
              </Button>
            )}
          </Card>
        </div>
      )}

      {/* Main Visualization */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Brain's Neural Pathway Development
          </h3>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('overview')}
            >
              Overview
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('detailed')}
            >
              Detailed
            </Button>
            <Button
              variant={viewMode === 'milestones' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('milestones')}
            >
              Milestones
            </Button>
          </div>
        </div>

        {viewMode === 'overview' && (
          <div className="space-y-4">
            {/* Neural Network Visualization Canvas */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="border rounded-lg bg-gray-50 w-full"
                style={{ maxHeight: '300px' }}
              />
              {traumaProfile.overwhelmProtection && (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
              )}
            </div>

            {/* Neuroplasticity Score */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Neuroplasticity Score</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {Math.round(neuroplasticityMetrics.neuroplasticityScore)}%
                </span>
              </div>
              <div className="mt-2 bg-white rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${neuroplasticityMetrics.neuroplasticityScore}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {formatNeuroplasticityScore(neuroplasticityMetrics.neuroplasticityScore)}
              </p>
            </div>
          </div>
        )}

        {viewMode === 'detailed' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Synaptic Strength */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Synaptic Strength</h4>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {Math.round(neuroplasticityMetrics.synapticStrengthChange)}%
              </div>
              <p className="text-xs text-blue-700">
                Your neural connections are {neuroplasticityMetrics.synapticStrengthChange > 50 ? 'strongly' : 'steadily'} strengthening through Long-Term Potentiation
              </p>
            </div>

            {/* Myelination Progress */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Myelin Development</h4>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round(neuroplasticityMetrics.myelinationProgress)}%
              </div>
              <p className="text-xs text-green-700">
                Protective myelin sheaths are forming, making your neural signals faster
              </p>
            </div>

            {/* Connection Density */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Connection Density</h4>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Math.round(neuroplasticityMetrics.connectionDensityIncrease)}%
              </div>
              <p className="text-xs text-purple-700">
                New synaptic connections are forming between neurons
              </p>
            </div>

            {/* BDNF Level */}
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-900 mb-2">BDNF Level</h4>
              <div className="text-2xl font-bold text-amber-600 mb-1">
                {Math.round(neuroplasticityMetrics.bdnfLevel)}%
              </div>
              <p className="text-xs text-amber-700">
                Brain-Derived Neurotrophic Factor promotes neural growth
              </p>
            </div>

            {/* Neurotransmitter Balance */}
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Neurotransmitter Balance</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(neuroplasticityMetrics.neurotransmitterBalance).map(([neurotransmitter, level]) => (
                  <div key={neurotransmitter} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getNeurotransmitterColor(neurotransmitter) }}
                    />
                    <span className="text-sm capitalize text-gray-700">{neurotransmitter}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {Math.round(level as number)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'milestones' && (
          <div className="space-y-4">
            {milestones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🧠</div>
                <p>Your first neuroplasticity milestone is forming...</p>
                <p className="text-sm mt-2">Keep practicing consistently to see your brain changes!</p>
              </div>
            ) : (
              milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    milestone.achievedAt <= new Date() 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold capitalize">
                      {milestone.milestoneType.replace('-', ' ')}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded ${
                      milestone.achievedAt <= new Date() 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {milestone.achievedAt <= new Date() ? 'Achieved' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {milestone.neurologicalSignificance}
                  </p>
                  <p className="text-xs text-gray-500">
                    {milestone.researchBasis}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
}