// ALCHM Neuroplasticity Component: Progress Visualization
// Visual representation of neural pathway development using organic growth patterns
// Scientific Foundation: Based on Hebbian learning principles and synaptic plasticity research

'use client';

import React, { useState, useEffect, useRef } from 'react';

interface NeuralPathway {
  id: string;
  name: string;
  strength: number; // 0-100
  formationDate: Date;
  lastReinforced: Date;
  category: 'emotional' | 'behavioral' | 'cognitive' | 'somatic';
  milestones: number[];
}

interface ProgressVisualizationProps {
  pathways: NeuralPathway[];
  showGrowthAnimation?: boolean;
  enableCelebrations?: boolean;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'lifetime';
  onPathwaySelect?: (pathway: NeuralPathway) => void;
  className?: string;
}

export function NeuroplasticityProgressVisualization({
  pathways,
  showGrowthAnimation = true,
  enableCelebrations = true,
  timeframe = 'weekly',
  onPathwaySelect,
  className = ''
}: ProgressVisualizationProps) {
  const [selectedPathway, setSelectedPathway] = useState<NeuralPathway | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'growing' | 'strengthening' | 'celebrating'>('growing');
  const canvasRef = useRef<SVGSVGElement>(null);
  const celebrationRef = useRef<HTMLDivElement>(null);

  // Generate organic growth visualization
  const generateGrowthPath = (pathway: NeuralPathway, index: number) => {
    const baseRadius = 120;
    const angle = (index / pathways.length) * 2 * Math.PI;
    const x = 250 + Math.cos(angle) * baseRadius;
    const y = 250 + Math.sin(angle) * baseRadius;
    
    // Strength determines branch complexity and reach
    const strength = pathway.strength / 100;
    const branchLength = 40 + (strength * 60);
    const branchCount = Math.max(1, Math.floor(strength * 5));
    
    return {
      centerX: x,
      centerY: y,
      branches: Array.from({ length: branchCount }, (_, branchIndex) => {
        const branchAngle = (branchIndex / branchCount) * 2 * Math.PI;
        const branchX = x + Math.cos(branchAngle) * branchLength * strength;
        const branchY = y + Math.sin(branchAngle) * branchLength * strength;
        
        return {
          x: branchX,
          y: branchY,
          opacity: 0.3 + (strength * 0.7),
          strokeWidth: 1 + (strength * 3)
        };
      })
    };
  };

  // Color mapping based on pathway category and strength
  const getPathwayColor = (pathway: NeuralPathway) => {
    const baseColors = {
      emotional: '--neural-growth',
      behavioral: '--neural-connection',
      cognitive: '--neural-celebration',
      somatic: '--neural-comfort'
    };
    
    return `var(${baseColors[pathway.category]})`;
  };

  // Calculate pathway formation progress
  const getFormationStage = (strength: number) => {
    if (strength < 25) return 'forming';
    if (strength < 50) return 'strengthening';
    if (strength < 75) return 'establishing';
    return 'mastering';
  };

  // Trigger celebration animation for milestone achievements
  useEffect(() => {
    if (!enableCelebrations) return;

    const recentMilestones = pathways.filter(pathway => {
      const lastMilestone = pathway.milestones[pathway.milestones.length - 1];
      const daysSince = (Date.now() - pathway.lastReinforced.getTime()) / (1000 * 60 * 60 * 24);
      return lastMilestone && daysSince <= 1; // Milestone achieved in last 24 hours
    });

    if (recentMilestones.length > 0) {
      setAnimationPhase('celebrating');
      setTimeout(() => setAnimationPhase('growing'), 3000);
    }
  }, [pathways, enableCelebrations]);

  // Handle pathway selection
  const handlePathwayClick = (pathway: NeuralPathway) => {
    setSelectedPathway(pathway);
    onPathwaySelect?.(pathway);
    
    // Brief visual feedback
    setAnimationPhase('strengthening');
    setTimeout(() => setAnimationPhase('growing'), 1000);
  };

  return (
    <div className={`neuroplasticity-visualization relative ${className}`}>
      {/* Main visualization canvas */}
      <div className="relative w-full h-96 sanctuary-glass rounded-2xl p-6 overflow-hidden">
        <svg
          ref={canvasRef}
          width="100%"
          height="100%"
          viewBox="0 0 500 500"
          className="absolute inset-0"
        >
          {/* Background neural network pattern */}
          <defs>
            <radialGradient id="neuralBackground" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--state-forming)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--neural-safety)" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#neuralBackground)" />
          
          {/* Central nervous system visualization */}
          <circle
            cx="250"
            cy="250"
            r="30"
            fill="var(--neural-growth)"
            opacity="0.3"
            className={showGrowthAnimation ? 'animate-contemplative-breathe' : ''}
          />
          
          {/* Individual pathway visualizations */}
          {pathways.map((pathway, index) => {
            const growthPath = generateGrowthPath(pathway, index);
            const pathwayColor = getPathwayColor(pathway);
            const stage = getFormationStage(pathway.strength);
            
            return (
              <g key={pathway.id}>
                {/* Central node */}
                <circle
                  cx={growthPath.centerX}
                  cy={growthPath.centerY}
                  r={8 + (pathway.strength / 100 * 12)}
                  fill={pathwayColor}
                  opacity={0.8}
                  className={`cursor-pointer transition-all duration-[var(--neural-medium)] hover:opacity-100 ${
                    showGrowthAnimation ? `animate-synaptic-strengthen` : ''
                  }`}
                  onClick={() => handlePathwayClick(pathway)}
                />
                
                {/* Connection lines to center */}
                <line
                  x1="250"
                  y1="250"
                  x2={growthPath.centerX}
                  y2={growthPath.centerY}
                  stroke={pathwayColor}
                  strokeWidth={1 + (pathway.strength / 100 * 2)}
                  opacity={0.4 + (pathway.strength / 100 * 0.4)}
                  className="transition-all duration-[var(--neural-long)]"
                />
                
                {/* Branch network */}
                {growthPath.branches.map((branch, branchIndex) => (
                  <g key={branchIndex}>
                    <line
                      x1={growthPath.centerX}
                      y1={growthPath.centerY}
                      x2={branch.x}
                      y2={branch.y}
                      stroke={pathwayColor}
                      strokeWidth={branch.strokeWidth}
                      opacity={branch.opacity}
                      className={`transition-all duration-[var(--neural-long)] ${
                        showGrowthAnimation ? 'animate-neural-forming' : ''
                      }`}
                      style={{ animationDelay: `${branchIndex * 200}ms` }}
                    />
                    
                    <circle
                      cx={branch.x}
                      cy={branch.y}
                      r={2 + (pathway.strength / 100 * 3)}
                      fill={pathwayColor}
                      opacity={branch.opacity}
                      className={showGrowthAnimation ? 'animate-neural-connection-grow' : ''}
                      style={{ animationDelay: `${branchIndex * 300}ms` }}
                    />
                  </g>
                ))}
                
                {/* Pathway label */}
                <text
                  x={growthPath.centerX}
                  y={growthPath.centerY - 25}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--neural-growth)"
                  opacity="0.8"
                  className="font-light tracking-wide pointer-events-none"
                >
                  {pathway.name}
                </text>
                
                {/* Strength indicator */}
                <text
                  x={growthPath.centerX}
                  y={growthPath.centerY + 35}
                  textAnchor="middle"
                  fontSize="8"
                  fill="var(--neural-celebration)"
                  opacity="0.7"
                  className="font-light pointer-events-none"
                >
                  {pathway.strength}% {stage}
                </text>
              </g>
            );
          })}
          
          {/* Celebration overlay */}
          {animationPhase === 'celebrating' && (
            <g className="animate-healing-celebration">
              {Array.from({ length: 12 }, (_, i) => (
                <circle
                  key={i}
                  cx={250 + Math.cos(i * Math.PI / 6) * (50 + i * 10)}
                  cy={250 + Math.sin(i * Math.PI / 6) * (50 + i * 10)}
                  r="2"
                  fill="var(--celebration-radiance)"
                  opacity="0.8"
                  className="animate-gentle-sparkle"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </g>
          )}
        </svg>
        
        {/* Celebration text overlay */}
        {animationPhase === 'celebrating' && (
          <div 
            ref={celebrationRef}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 animate-growth-milestone"
          >
            <div className="sanctuary-glass p-3 rounded-xl backdrop-blur-md text-center">
              <div className="text-lg">🎉 ✨</div>
              <div className="text-sm text-neural-celebration font-light">
                Neural milestone achieved!
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Pathway details panel */}
      {selectedPathway && (
        <div className="mt-6 sanctuary-glass rounded-xl p-6 animate-slide-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-light text-neural-growth">
              {selectedPathway.name}
            </h3>
            <button
              onClick={() => setSelectedPathway(null)}
              className="text-neural-comfort hover:text-neural-growth transition-colors"
              aria-label="Close pathway details"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Strength progress bar */}
            <div>
              <div className="flex justify-between text-sm text-neural-connection mb-2">
                <span>Pathway Strength</span>
                <span>{selectedPathway.strength}%</span>
              </div>
              <div className="w-full bg-state-forming rounded-full h-2">
                <div
                  className="bg-neural-growth h-2 rounded-full transition-all duration-[var(--neural-long)] animate-habit-progress-ring"
                  style={{ width: `${selectedPathway.strength}%` }}
                />
              </div>
            </div>
            
            {/* Formation timeline */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neural-comfort">Started:</span>
                <div className="text-neural-growth">
                  {selectedPathway.formationDate.toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-neural-comfort">Last Active:</span>
                <div className="text-neural-growth">
                  {selectedPathway.lastReinforced.toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Milestones achieved */}
            <div>
              <span className="text-neural-comfort text-sm">Milestones:</span>
              <div className="flex gap-2 mt-2">
                {selectedPathway.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full bg-neural-celebration animate-gentle-sparkle"
                    style={{ animationDelay: `${index * 200}ms` }}
                  />
                ))}
              </div>
            </div>
            
            {/* Category indicator */}
            <div className="flex items-center gap-2">
              <span className="text-neural-comfort text-sm">Category:</span>
              <div className={`px-3 py-1 rounded-full text-xs font-light capitalize
                ${selectedPathway.category === 'emotional' ? 'bg-synapse-forming text-neural-growth' :
                  selectedPathway.category === 'behavioral' ? 'bg-synapse-strengthening text-neural-connection' :
                  selectedPathway.category === 'cognitive' ? 'bg-synapse-established text-neural-celebration' :
                  'bg-synapse-mastered text-neural-comfort'}`}
              >
                {selectedPathway.category}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-4 flex gap-4 text-xs text-neural-comfort">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neural-growth"></div>
          <span>Emotional</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neural-connection"></div>
          <span>Behavioral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neural-celebration"></div>
          <span>Cognitive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neural-comfort"></div>
          <span>Somatic</span>
        </div>
      </div>
    </div>
  );
}

export default NeuroplasticityProgressVisualization;