'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';

interface MoodDataPoint {
  date: string;
  mood: number;
  emotions: string[];
  activities: string[];
  journalLength: number;
  vocabularyScore: number;
}

interface InsightScores {
  resilience: number;
  emotionalVocabulary: number;
  selfAwareness: number;
  copingStrategies: number;
  socialConnection: number;
}

interface DataVisualizationEngineProps {
  moodData: MoodDataPoint[];
  insights: InsightScores;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
}

const OrganicMoodFlow: React.FC<{ data: MoodDataPoint[] }> = ({ data }) => {
  const pathData = useMemo(() => {
    if (data.length < 2) return '';
    
    const width = 800;
    const height = 200;
    const padding = 40;
    
    const xStep = (width - 2 * padding) / (data.length - 1);
    const maxMood = Math.max(...data.map(d => d.mood));
    const minMood = Math.min(...data.map(d => d.mood));
    const moodRange = maxMood - minMood || 1;
    
    let path = '';
    
    data.forEach((point, index) => {
      const x = padding + index * xStep;
      const y = height - padding - ((point.mood - minMood) / moodRange) * (height - 2 * padding);
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        // Create smooth curves between points
        const prevX = padding + (index - 1) * xStep;
        const prevY = height - padding - ((data[index - 1].mood - minMood) / moodRange) * (height - 2 * padding);
        const cpX1 = prevX + xStep * 0.3;
        const cpX2 = x - xStep * 0.3;
        path += ` C ${cpX1} ${prevY} ${cpX2} ${y} ${x} ${y}`;
      }
    });
    
    return path;
  }, [data]);

  const gradientStops = useMemo(() => {
    return data.map((point, index) => {
      const offset = (index / (data.length - 1)) * 100;
      const moodColor = point.mood >= 7 ? '#10B981' : 
                       point.mood >= 5 ? '#F59E0B' : 
                       point.mood >= 3 ? '#EF4444' : '#6B7280';
      return { offset: `${offset}%`, color: moodColor };
    });
  }, [data]);

  return (
    <div className="relative">
      <svg width="100%" height="200" viewBox="0 0 800 200" className="overflow-visible">
        <defs>
          <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {gradientStops.map((stop, index) => (
              <stop key={index} offset={stop.offset} stopColor={stop.color} stopOpacity="0.6" />
            ))}
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background organic shapes */}
        <circle cx="100" cy="50" r="30" fill="#F3F4F6" opacity="0.3" />
        <ellipse cx="300" cy="150" rx="40" ry="25" fill="#E5E7EB" opacity="0.3" />
        <circle cx="500" cy="80" r="35" fill="#F3F4F6" opacity="0.3" />
        <ellipse cx="700" cy="120" rx="30" ry="20" fill="#E5E7EB" opacity="0.3" />
        
        {/* Main mood flow line */}
        <path
          d={pathData}
          stroke="url(#moodGradient)"
          strokeWidth="4"
          fill="none"
          filter="url(#glow)"
          className="transition-all duration-500"
        />
        
        {/* Data points */}
        {data.map((point, index) => {
          const x = 40 + index * ((800 - 80) / (data.length - 1));
          const y = 160 - ((point.mood - Math.min(...data.map(d => d.mood))) / 
                          (Math.max(...data.map(d => d.mood)) - Math.min(...data.map(d => d.mood)) || 1)) * 120;
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="6"
                fill={point.mood >= 7 ? '#10B981' : 
                     point.mood >= 5 ? '#F59E0B' : 
                     point.mood >= 3 ? '#EF4444' : '#6B7280'}
                className="transition-all duration-300 hover:r-8 cursor-pointer"
              />
              <circle
                cx={x}
                cy={y}
                r="10"
                fill="transparent"
                className="hover:fill-black hover:fill-opacity-10 cursor-pointer transition-all duration-300"
              />
            </g>
          );
        })}
      </svg>
      
      {/* Mood scale labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-sage-500 py-5">
        <span>Excellent</span>
        <span>Good</span>
        <span>Okay</span>
        <span>Difficult</span>
      </div>
    </div>
  );
};

const OrganicInsightRadar: React.FC<{ insights: InsightScores }> = ({ insights }) => {
  const radarData = [
    { key: 'resilience', label: 'Resilience', value: insights.resilience, angle: 0 },
    { key: 'emotionalVocabulary', label: 'Emotional\nVocabulary', value: insights.emotionalVocabulary, angle: 72 },
    { key: 'selfAwareness', label: 'Self\nAwareness', value: insights.selfAwareness, angle: 144 },
    { key: 'copingStrategies', label: 'Coping\nStrategies', value: insights.copingStrategies, angle: 216 },
    { key: 'socialConnection', label: 'Social\nConnection', value: insights.socialConnection, angle: 288 }
  ];

  const centerX = 150;
  const centerY = 150;
  const maxRadius = 100;

  const getCoordinates = (angle: number, radius: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian)
    };
  };

  const dataPath = radarData.map((item, index) => {
    const radius = (item.value / 100) * maxRadius;
    const coords = getCoordinates(item.angle, radius);
    return index === 0 ? `M ${coords.x} ${coords.y}` : `L ${coords.x} ${coords.y}`;
  }).join(' ') + ' Z';

  return (
    <div className="flex justify-center">
      <svg width="300" height="300" viewBox="0 0 300 300">
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1"/>
          </radialGradient>
        </defs>
        
        {/* Background circles */}
        {[20, 40, 60, 80, 100].map((radius, index) => (
          <circle
            key={index}
            cx={centerX}
            cy={centerY}
            r={(radius / 100) * maxRadius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="1"
            opacity={0.5}
          />
        ))}
        
        {/* Axis lines */}
        {radarData.map((item, index) => {
          const coords = getCoordinates(item.angle, maxRadius);
          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={coords.x}
              y2={coords.y}
              stroke="#E5E7EB"
              strokeWidth="1"
              opacity={0.5}
            />
          );
        })}
        
        {/* Data area */}
        <path
          d={dataPath}
          fill="url(#radarGradient)"
          stroke="#10B981"
          strokeWidth="2"
          className="transition-all duration-500"
        />
        
        {/* Data points */}
        {radarData.map((item, index) => {
          const radius = (item.value / 100) * maxRadius;
          const coords = getCoordinates(item.angle, radius);
          return (
            <circle
              key={index}
              cx={coords.x}
              cy={coords.y}
              r="4"
              fill="#10B981"
              className="transition-all duration-300"
            />
          );
        })}
        
        {/* Labels */}
        {radarData.map((item, index) => {
          const labelRadius = maxRadius + 25;
          const coords = getCoordinates(item.angle, labelRadius);
          return (
            <g key={index}>
              <text
                x={coords.x}
                y={coords.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-sage-600"
              >
                {item.label.split('\n').map((line, lineIndex) => (
                  <tspan key={lineIndex} x={coords.x} dy={lineIndex === 0 ? 0 : 12}>
                    {line}
                  </tspan>
                ))}
              </text>
              <text
                x={coords.x}
                y={coords.y + 20}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-sage-800"
              >
                {item.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const EmotionalVocabularyGrowth: React.FC<{ data: MoodDataPoint[] }> = ({ data }) => {
  const vocabularyData = useMemo(() => {
    return data.map((point, index) => ({
      date: point.date,
      score: point.vocabularyScore,
      uniqueEmotions: new Set(point.emotions).size,
      complexity: point.journalLength > 0 ? point.vocabularyScore / point.journalLength * 1000 : 0
    }));
  }, [data]);

  const maxScore = Math.max(...vocabularyData.map(d => d.score)) || 100;
  const maxEmotions = Math.max(...vocabularyData.map(d => d.uniqueEmotions)) || 10;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        {vocabularyData.slice(-3).map((point, index) => (
          <div key={index} className="bg-sage-50 rounded-lg p-4">
            <div className="text-2xl font-medium text-sage-800 mb-1">
              {point.score}
            </div>
            <div className="text-sm text-sage-600 mb-2">Sophistication Score</div>
            <div className="text-lg font-medium text-eucalyptus-600">
              {point.uniqueEmotions}
            </div>
            <div className="text-xs text-sage-500">Unique Emotions</div>
          </div>
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-sage-50 to-eucalyptus-50 rounded-lg p-4">
        <h4 className="font-medium text-sage-800 mb-2">Vocabulary Evolution</h4>
        <div className="flex items-center space-x-2">
          {vocabularyData.slice(-7).map((point, index) => {
            const height = (point.score / maxScore) * 40;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-sage-400 to-eucalyptus-400 rounded-t"
                  style={{ height: `${height}px`, minHeight: '4px' }}
                ></div>
                <div className="text-xs text-sage-500 mt-1 rotate-45 origin-bottom-left">
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const DataVisualizationEngine: React.FC<DataVisualizationEngineProps> = ({
  moodData,
  insights,
  timeframe
}) => {
  const timeframeLabel = {
    week: 'This Week',
    month: 'This Month', 
    quarter: 'This Quarter',
    year: 'This Year'
  }[timeframe];

  return (
    <div className="space-y-6">
      {/* Mood Flow Visualization */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-sage-800 mb-4">
          Emotional Journey • {timeframeLabel}
        </h3>
        <p className="text-sage-600 text-sm mb-6">
          Your mood patterns flow like a river - gentle curves showing the natural rhythms of your emotional landscape.
        </p>
        <OrganicMoodFlow data={moodData} />
      </Card>

      {/* Insights Radar */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-sage-800 mb-4">
          Emotional Intelligence Dimensions
        </h3>
        <p className="text-sage-600 text-sm mb-6">
          Like petals of a flower, each dimension of your emotional intelligence contributes to your overall wellbeing.
        </p>
        <OrganicInsightRadar insights={insights} />
      </Card>

      {/* Vocabulary Growth */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-sage-800 mb-4">
          Emotional Vocabulary Sophistication
        </h3>
        <p className="text-sage-600 text-sm mb-6">
          The richness of your emotional language reflects the depth of your self-understanding.
        </p>
        <EmotionalVocabularyGrowth data={moodData} />
      </Card>
    </div>
  );
};