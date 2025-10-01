'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GrowthDimension {
  id: string;
  name: string;
  sacredName: string;
  description: string;
  sacredDescription: string;
  icon: string;
  color: string;
  progress: number;
  insights: string[];
  milestones: DimensionMilestone[];
  subDimensions: SubDimension[];
}

interface SubDimension {
  id: string;
  name: string;
  progress: number;
  recent_change: number;
}

interface DimensionMilestone {
  id: string;
  title: string;
  date: Date;
  significance: 'minor' | 'major' | 'breakthrough';
  description: string;
}

interface MultiDimensionalGrowthProps {
  transformationData: any;
  sacredMode: boolean;
}

export const MultiDimensionalGrowth: React.FC<MultiDimensionalGrowthProps> = ({
  transformationData,
  sacredMode
}) => {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [growthDimensions, setGrowthDimensions] = useState<GrowthDimension[]>([]);

  useEffect(() => {
    initializeGrowthDimensions();
  }, [transformationData, timeRange]);

  const initializeGrowthDimensions = () => {
    const dimensions: GrowthDimension[] = [
      {
        id: 'emotional',
        name: 'Emotional Intelligence',
        sacredName: 'Heart Wisdom',
        description: 'Ability to understand, process, and regulate emotions effectively',
        sacredDescription: 'Opening the sacred heart center to flow with life\'s emotional currents',
        icon: '❤️',
        color: 'text-red-500',
        progress: transformationData?.dimensions?.emotional || 0,
        insights: [
          'Increased emotional vocabulary by 35%',
          'Better recognition of trigger patterns',
          'Improved emotional regulation in conflict'
        ],
        milestones: [
          {
            id: '1',
            title: 'First Breakthrough in Anger Management',
            date: new Date('2024-01-15'),
            significance: 'major',
            description: 'Successfully used breathing technique during family conflict'
          }
        ],
        subDimensions: [
          { id: 'self-awareness', name: 'Self-Awareness', progress: 0.8, recent_change: 0.1 },
          { id: 'self-regulation', name: 'Self-Regulation', progress: 0.6, recent_change: 0.2 },
          { id: 'empathy', name: 'Empathy', progress: 0.7, recent_change: 0.05 },
          { id: 'social-skills', name: 'Social Skills', progress: 0.5, recent_change: 0.15 }
        ]
      },
      {
        id: 'behavioral',
        name: 'Behavioral Patterns',
        sacredName: 'Sacred Actions',
        description: 'Conscious choice-making and habit transformation',
        sacredDescription: 'Aligning daily actions with highest truth and sacred purpose',
        icon: '🔄',
        color: 'text-blue-500',
        progress: transformationData?.dimensions?.behavioral || 0,
        insights: [
          'Established 3 new positive habits',
          'Reduced reactive behaviors by 40%',
          'Improved decision-making consistency'
        ],
        milestones: [
          {
            id: '1',
            title: 'Consistent Morning Practice Established',
            date: new Date('2024-02-01'),
            significance: 'major',
            description: '30 days of unbroken morning reflection practice'
          }
        ],
        subDimensions: [
          { id: 'habit-formation', name: 'Habit Formation', progress: 0.7, recent_change: 0.25 },
          { id: 'impulse-control', name: 'Impulse Control', progress: 0.6, recent_change: 0.1 },
          { id: 'goal-pursuit', name: 'Goal Pursuit', progress: 0.8, recent_change: 0.2 },
          { id: 'adaptability', name: 'Adaptability', progress: 0.5, recent_change: 0.08 }
        ]
      },
      {
        id: 'cognitive',
        name: 'Cognitive Flexibility',
        sacredName: 'Mind Liberation',
        description: 'Mental agility, perspective-taking, and thought pattern awareness',
        sacredDescription: 'Freeing the mind from limiting beliefs to embrace infinite possibility',
        icon: '🧠',
        color: 'text-purple-500',
        progress: transformationData?.dimensions?.cognitive || 0,
        insights: [
          'Reduced negative thought loops by 50%',
          'Increased perspective-taking ability',
          'Better problem-solving creativity'
        ],
        milestones: [
          {
            id: '1',
            title: 'Cognitive Reframe Mastery',
            date: new Date('2024-02-15'),
            significance: 'breakthrough',
            description: 'Successfully reframed major life setback into growth opportunity'
          }
        ],
        subDimensions: [
          { id: 'cognitive-reframing', name: 'Cognitive Reframing', progress: 0.75, recent_change: 0.3 },
          { id: 'perspective-taking', name: 'Perspective Taking', progress: 0.6, recent_change: 0.15 },
          { id: 'mental-flexibility', name: 'Mental Flexibility', progress: 0.65, recent_change: 0.12 },
          { id: 'metacognition', name: 'Metacognition', progress: 0.55, recent_change: 0.18 }
        ]
      },
      {
        id: 'spiritual',
        name: 'Spiritual Connection',
        sacredName: 'Soul Awakening',
        description: 'Sense of meaning, purpose, and connection to something greater',
        sacredDescription: 'Remembering the sacred nature of existence and one\'s divine purpose',
        icon: '✨',
        color: 'text-amber-500',
        progress: transformationData?.dimensions?.spiritual || 0,
        insights: [
          'Deepened sense of life purpose',
          'Increased connection to values',
          'Enhanced appreciation for transcendent moments'
        ],
        milestones: [
          {
            id: '1',
            title: 'Sacred Purpose Clarity',
            date: new Date('2024-03-01'),
            significance: 'breakthrough',
            description: 'Profound insight into life mission during meditation'
          }
        ],
        subDimensions: [
          { id: 'purpose-clarity', name: 'Purpose Clarity', progress: 0.8, recent_change: 0.4 },
          { id: 'values-alignment', name: 'Values Alignment', progress: 0.7, recent_change: 0.2 },
          { id: 'transcendence', name: 'Transcendent Experiences', progress: 0.6, recent_change: 0.25 },
          { id: 'service', name: 'Service Orientation', progress: 0.5, recent_change: 0.15 }
        ]
      },
      {
        id: 'relational',
        name: 'Relational Intelligence',
        sacredName: 'Sacred Connection',
        description: 'Quality of relationships and interpersonal wisdom',
        sacredDescription: 'Honoring the divine in others and creating sacred relationship',
        icon: '🤝',
        color: 'text-green-500',
        progress: transformationData?.dimensions?.relational || 0,
        insights: [
          'Improved boundary setting',
          'Enhanced communication skills',
          'Deeper intimacy in key relationships'
        ],
        milestones: [
          {
            id: '1',
            title: 'Healthy Boundary Implementation',
            date: new Date('2024-03-10'),
            significance: 'major',
            description: 'Successfully maintained boundaries with challenging family member'
          }
        ],
        subDimensions: [
          { id: 'boundary-setting', name: 'Boundary Setting', progress: 0.75, recent_change: 0.35 },
          { id: 'communication', name: 'Communication', progress: 0.65, recent_change: 0.2 },
          { id: 'intimacy', name: 'Emotional Intimacy', progress: 0.6, recent_change: 0.15 },
          { id: 'conflict-resolution', name: 'Conflict Resolution', progress: 0.55, recent_change: 0.25 }
        ]
      }
    ];

    setGrowthDimensions(dimensions);
  };

  const renderDimensionCard = (dimension: GrowthDimension) => {
    const isSelected = selectedDimension === dimension.id;
    
    return (
      <Card 
        key={dimension.id}
        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
          isSelected ? 'ring-2 ring-amber-500 shadow-lg' : ''
        }`}
        onClick={() => setSelectedDimension(isSelected ? null : dimension.id)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{dimension.icon}</span>
            <div>
              <h3 className="font-semibold">
                {sacredMode ? dimension.sacredName : dimension.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {sacredMode ? dimension.sacredDescription : dimension.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{Math.round(dimension.progress * 100)}%</div>
            <div className="text-xs text-gray-500">Growth</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${dimension.progress * 100}%` }}
            />
          </div>
        </div>

        {/* Sub-dimensions Preview */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {dimension.subDimensions.slice(0, 4).map((sub) => (
            <div key={sub.id} className="flex items-center justify-between">
              <span className="truncate">{sub.name}</span>
              <div className="flex items-center space-x-1">
                <span>{Math.round(sub.progress * 100)}%</span>
                {sub.recent_change > 0 && (
                  <span className="text-green-500">↗</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Expanded View */}
        {isSelected && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {/* Detailed Sub-dimensions */}
            <div>
              <h4 className="font-medium mb-2">Growth Areas:</h4>
              <div className="space-y-2">
                {dimension.subDimensions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between">
                    <span className="text-sm">{sub.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${sub.progress * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{Math.round(sub.progress * 100)}%</span>
                      {sub.recent_change > 0 && (
                        <span className="text-green-500 text-xs">+{Math.round(sub.recent_change * 100)}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Insights */}
            <div>
              <h4 className="font-medium mb-2">Recent Insights:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {dimension.insights.map((insight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Milestones */}
            {dimension.milestones.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recent Milestones:</h4>
                <div className="space-y-2">
                  {dimension.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-start space-x-3 p-2 bg-gray-50 rounded">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        milestone.significance === 'breakthrough' ? 'bg-green-500' :
                        milestone.significance === 'major' ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{milestone.title}</div>
                        <div className="text-xs text-gray-500">{milestone.date.toLocaleDateString()}</div>
                        <div className="text-sm text-gray-600 mt-1">{milestone.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    );
  };

  const renderSacredGeometryVisualization = () => {
    if (growthDimensions.length === 0) return null;

    const centerX = 200;
    const centerY = 200;
    const radius = 120;

    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">
          {sacredMode ? 'Sacred Pentagram of Growth' : 'Multi-Dimensional Growth Map'}
        </h3>
        <div className="flex justify-center">
          <svg width="400" height="400" viewBox="0 0 400 400">
            {/* Background sacred geometry */}
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="1" />
            <circle cx={centerX} cy={centerY} r={radius * 0.7} fill="none" stroke="#e5e7eb" strokeWidth="1" />
            <circle cx={centerX} cy={centerY} r={radius * 0.4} fill="none" stroke="#e5e7eb" strokeWidth="1" />
            
            {/* Pentagon/Pentagram for 5 dimensions */}
            {growthDimensions.map((dimension, index) => {
              const angle = (index / growthDimensions.length) * 2 * Math.PI - Math.PI / 2;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              
              // Progress point
              const progressRadius = radius * dimension.progress;
              const progressX = centerX + progressRadius * Math.cos(angle);
              const progressY = centerY + progressRadius * Math.sin(angle);

              return (
                <g key={dimension.id}>
                  {/* Dimension line */}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke="#d1d5db"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  
                  {/* Progress line */}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={progressX}
                    y2={progressY}
                    stroke="#f59e0b"
                    strokeWidth="3"
                  />
                  
                  {/* Progress point */}
                  <circle
                    cx={progressX}
                    cy={progressY}
                    r="6"
                    fill="#f59e0b"
                    className="cursor-pointer"
                    onClick={() => setSelectedDimension(dimension.id)}
                  />
                  
                  {/* Dimension label */}
                  <text
                    x={x + 20 * Math.cos(angle)}
                    y={y + 20 * Math.sin(angle)}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {dimension.icon}
                  </text>
                  <text
                    x={x + 40 * Math.cos(angle)}
                    y={y + 40 * Math.sin(angle)}
                    textAnchor="middle"
                    className="text-xs fill-gray-700 font-medium"
                  >
                    {sacredMode ? dimension.sacredName.split(' ')[0] : dimension.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
            
            {/* Connect progress points to show overall balance */}
            <path
              d={growthDimensions.map((dimension, index) => {
                const angle = (index / growthDimensions.length) * 2 * Math.PI - Math.PI / 2;
                const progressRadius = radius * dimension.progress;
                const x = centerX + progressRadius * Math.cos(angle);
                const y = centerY + progressRadius * Math.sin(angle);
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ') + ' Z'}
              fill="rgba(245, 158, 11, 0.2)"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            
            {/* Center sacred symbol */}
            <text x={centerX} y={centerY} textAnchor="middle" className="text-2xl">🪲</text>
          </svg>
        </div>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          {growthDimensions.map((dimension) => (
            <div key={dimension.id} className="flex items-center space-x-2">
              <span>{dimension.icon}</span>
              <span>{sacredMode ? dimension.sacredName : dimension.name}</span>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {sacredMode ? 'Sacred Dimensions of Growth' : 'Multi-Dimensional Growth Analysis'}
        </h2>
        <div className="flex space-x-2">
          {[
            { key: 'week', label: 'Week' },
            { key: 'month', label: 'Month' },
            { key: 'quarter', label: 'Quarter' },
            { key: 'year', label: 'Year' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={timeRange === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(key as any)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Sacred Geometry Visualization */}
      {renderSacredGeometryVisualization()}

      {/* Dimension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {growthDimensions.map(renderDimensionCard)}
      </div>

      {/* Growth Insights Summary */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Growth Pattern Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2">Strongest Growth Areas</h4>
            <div className="space-y-2">
              {growthDimensions
                .flatMap(d => d.subDimensions.map(s => ({ ...s, dimension: d.name })))
                .sort((a, b) => b.recent_change - a.recent_change)
                .slice(0, 3)
                .map((sub, index) => (
                  <div key={index} className="text-sm flex items-center justify-between">
                    <span>{sub.name}</span>
                    <span className="text-green-500">+{Math.round(sub.recent_change * 100)}%</span>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Focus Areas</h4>
            <div className="space-y-2">
              {growthDimensions
                .flatMap(d => d.subDimensions.map(s => ({ ...s, dimension: d.name })))
                .sort((a, b) => a.progress - b.progress)
                .slice(0, 3)
                .map((sub, index) => (
                  <div key={index} className="text-sm flex items-center justify-between">
                    <span>{sub.name}</span>
                    <span className="text-amber-600">{Math.round(sub.progress * 100)}%</span>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Transformation Momentum</h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">
                {Math.round(growthDimensions.reduce((sum, d) => sum + d.progress, 0) / growthDimensions.length * 100)}%
              </div>
              <div className="text-sm text-gray-600">Overall Growth</div>
              <div className="mt-2 text-xs text-gray-500">
                {sacredMode 
                  ? "The sacred journey unfolds with divine timing"
                  : "Consistent progress across multiple dimensions"
                }
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MultiDimensionalGrowth;