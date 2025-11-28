'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { emotionalAnalytics } from '@/lib/privacy-preserving-emotional-analytics';

// Organic visualization components
interface MoodFlowVisualizationProps {
  data: MoodDataPoint[];
  timeframe: 'week' | 'month' | 'quarter';
}

interface MoodDataPoint {
  date: string;
  mood: number; // 0-1 scale
  energy: number; // 0-1 scale
  clarity: number; // 0-1 scale
  growth: number; // 0-1 scale
}

interface GrowthRingProps {
  categories: GrowthCategory[];
  size?: 'small' | 'medium' | 'large';
}

interface GrowthCategory {
  name: string;
  value: number;
  color: string;
  description: string;
}

interface InsightGardenProps {
  insights: GardenInsight[];
  interactive?: boolean;
}

interface GardenInsight {
  type: 'seed' | 'sprout' | 'bloom' | 'fruit';
  title: string;
  description: string;
  confidence: number;
  daysGrowing: number;
}

// Organic mood flow visualization
const MoodFlowVisualization = ({ data, timeframe }: MoodFlowVisualizationProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sage-600">
        <div className="text-center">
          <div className="text-2xl mb-2 animate-gentle-breathe">🌱</div>
          <p className="text-sm">Your emotional landscape is growing</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.mood, d.energy, d.clarity, d.growth)));
  const svgHeight = 200;
  const svgWidth = 400;
  const padding = 40;

  const xScale = (index: number) => padding + (index / (data.length - 1)) * (svgWidth - 2 * padding);
  const yScale = (value: number) => svgHeight - padding - ((value / maxValue) * (svgHeight - 2 * padding));

  // Create organic curve paths
  const createPath = (values: number[]) => {
    if (values.length < 2) return '';
    
    let path = `M ${xScale(0)} ${yScale(values[0])}`;
    
    for (let i = 1; i < values.length; i++) {
      const x = xScale(i);
      const y = yScale(values[i]);
      const prevX = xScale(i - 1);
      const prevY = yScale(values[i - 1]);
      
      // Create smooth curves
      const cpX1 = prevX + (x - prevX) * 0.3;
      const cpY1 = prevY;
      const cpX2 = prevX + (x - prevX) * 0.7;
      const cpY2 = y;
      
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
    }
    
    return path;
  };

  const moodPath = createPath(data.map(d => d.mood));
  const energyPath = createPath(data.map(d => d.energy));
  const clarityPath = createPath(data.map(d => d.clarity));
  const growthPath = createPath(data.map(d => d.growth));

  return (
    <div className="relative">
      <svg 
        width={svgWidth} 
        height={svgHeight} 
        className="overflow-visible"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(164, 183, 146, 0.1))' }}
      >
        {/* Gentle gradient background */}
        <defs>
          <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(164, 183, 146, 0.05)" />
            <stop offset="100%" stopColor="rgba(164, 183, 146, 0.01)" />
          </linearGradient>
          
          <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 195, 74, 0.3)" />
            <stop offset="100%" stopColor="rgba(139, 195, 74, 0.1)" />
          </linearGradient>
        </defs>
        
        {/* Background */}
        <rect 
          width={svgWidth} 
          height={svgHeight} 
          fill="url(#backgroundGradient)" 
          rx="16"
        />
        
        {/* Organic flowing paths */}
        <path
          d={moodPath}
          stroke="rgba(139, 195, 74, 0.8)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
        
        <path
          d={energyPath}
          stroke="rgba(255, 193, 7, 0.7)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5,5"
          className="transition-all duration-300"
        />
        
        <path
          d={clarityPath}
          stroke="rgba(103, 58, 183, 0.6)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3,3"
          className="transition-all duration-300"
        />
        
        <path
          d={growthPath}
          stroke="rgba(76, 175, 80, 0.8)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
        
        {/* Gentle data points */}
        {data.map((point, index) => (
          <g key={index}>
            <circle
              cx={xScale(index)}
              cy={yScale(point.mood)}
              r={hoveredPoint === index ? "6" : "4"}
              fill="rgba(139, 195, 74, 0.9)"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
            
            {/* Sparkle for high values */}
            {point.mood > 0.8 && (
              <text
                x={xScale(index)}
                y={yScale(point.mood) - 15}
                textAnchor="middle"
                className="text-xs animate-gentle-sparkle"
                fill="rgba(255, 193, 7, 0.8)"
              >
                ✨
              </text>
            )}
          </g>
        ))}
      </svg>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
          <span className="text-sage-700">Emotional Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-yellow-400 opacity-70" />
          <span className="text-sage-700">Energy Rhythm</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-purple-400 opacity-60" />
          <span className="text-sage-700">Mental Clarity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-80" />
          <span className="text-sage-700">Growth Moments</span>
        </div>
      </div>
    </div>
  );
};

// Organic growth rings visualization
const GrowthRings = ({ categories, size = 'medium' }: GrowthRingProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  const ringSize = size === 'small' ? 120 : size === 'large' ? 200 : 160;
  const center = ringSize / 2;
  const maxRadius = center - 20;
  
  const getRadius = (value: number, index: number) => {
    const baseRadius = 30 + (index * 15);
    return baseRadius + (value * (maxRadius - baseRadius));
  };

  return (
    <div className="relative inline-block">
      <svg width={ringSize} height={ringSize} className="overflow-visible">
        {/* Background rings */}
        {categories.map((_, index) => (
          <circle
            key={`bg-${index}`}
            cx={center}
            cy={center}
            r={30 + (index * 15)}
            fill="none"
            stroke="rgba(164, 183, 146, 0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Growth rings */}
        {categories.map((category, index) => {
          const radius = getRadius(category.value, index);
          const isHovered = hoveredCategory === category.name;
          
          return (
            <g key={category.name}>
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={category.color}
                strokeWidth={isHovered ? "4" : "3"}
                strokeOpacity={isHovered ? 0.8 : 0.6}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
              
              {/* Category label */}
              <text
                x={center + Math.cos((index * Math.PI * 2) / categories.length - Math.PI / 2) * (radius + 15)}
                y={center + Math.sin((index * Math.PI * 2) / categories.length - Math.PI / 2) * (radius + 15)}
                textAnchor="middle"
                className="text-xs font-medium fill-sage-700"
              >
                {category.name}
              </text>
              
              {/* Value indicator */}
              <circle
                cx={center + Math.cos((index * Math.PI * 2) / categories.length - Math.PI / 2) * radius}
                cy={center + Math.sin((index * Math.PI * 2) / categories.length - Math.PI / 2) * radius}
                r={isHovered ? "6" : "4"}
                fill={category.color}
                className="transition-all duration-200"
              />
            </g>
          );
        })}
        
        {/* Center point */}
        <circle
          cx={center}
          cy={center}
          r="8"
          fill="rgba(164, 183, 146, 0.8)"
          className="animate-gentle-pulse"
        />
      </svg>
      
      {/* Tooltip */}
      {hoveredCategory && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-soft border border-sage-100 max-w-xs z-10">
          <div className="text-center">
            <div className="font-medium text-sm text-sage-800 mb-1">
              {hoveredCategory}
            </div>
            <div className="text-xs text-sage-600 leading-relaxed">
              {categories.find(c => c.name === hoveredCategory)?.description}
            </div>
            <div className="text-xs font-medium text-sage-700 mt-1">
              {Math.round((categories.find(c => c.name === hoveredCategory)?.value || 0) * 100)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Insight garden visualization
const InsightGarden = ({ insights, interactive = true }: InsightGardenProps) => {
  const [selectedInsight, setSelectedInsight] = useState<GardenInsight | null>(null);
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'seed': return '🌱';
      case 'sprout': return '🌿';
      case 'bloom': return '🌸';
      case 'fruit': return '🍃';
      default: return '🌱';
    }
  };
  
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'seed': return 'from-green-100 to-green-200 border-green-300';
      case 'sprout': return 'from-emerald-100 to-emerald-200 border-emerald-300';
      case 'bloom': return 'from-pink-100 to-pink-200 border-pink-300';
      case 'fruit': return 'from-purple-100 to-purple-200 border-purple-300';
      default: return 'from-sage-100 to-sage-200 border-sage-300';
    }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`group relative p-4 rounded-2xl bg-gradient-to-br ${getInsightColor(insight.type)} border transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5 ${
              interactive ? 'cursor-pointer' : ''
            }`}
            onClick={() => interactive && setSelectedInsight(insight)}
          >
            <div className="text-center">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {getInsightIcon(insight.type)}
              </div>
              
              <h3 className="font-medium text-sm text-sage-800 mb-1 tracking-tight">
                {insight.title}
              </h3>
              
              <div className="flex items-center justify-between text-xs text-sage-600">
                <span>{insight.daysGrowing}d</span>
                <span>{Math.round(insight.confidence * 100)}%</span>
              </div>
              
              {/* Growth indicator */}
              <div className="mt-2 h-1 w-full bg-sage-200/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sage-400 rounded-full transition-all duration-500"
                  style={{ width: `${insight.confidence * 100}%` }}
                />
              </div>
            </div>
            
            {/* Sparkle for mature insights */}
            {insight.type === 'fruit' && (
              <div className="absolute -top-1 -right-1 text-sm animate-gentle-sparkle">
                ✨
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Insight detail modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-sage-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-elevated max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedInsight(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-sage-100 hover:bg-sage-200 flex items-center justify-center transition-colors duration-200"
            >
              <span className="text-sage-600">×</span>
            </button>
            
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">
                {getInsightIcon(selectedInsight.type)}
              </div>
              <h2 className="text-xl font-medium text-sage-800 mb-2">
                {selectedInsight.title}
              </h2>
            </div>
            
            <p className="text-sage-600 text-sm leading-relaxed mb-6">
              {selectedInsight.description}
            </p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sage-400 rounded-full animate-gentle-pulse" />
                <span className="text-sage-700">Growing for {selectedInsight.daysGrowing} days</span>
              </div>
              <span className="text-sage-600">
                {Math.round(selectedInsight.confidence * 100)}% confidence
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main sanctuary analytics dashboard
export default function SanctuaryAnalyticsDashboard() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([]);
  const [growthCategories, setGrowthCategories] = useState<GrowthCategory[]>([]);
  const [gardenInsights, setGardenInsights] = useState<GardenInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSanctuaryData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Generate mock data for demonstration
        const mockMoodData: MoodDataPoint[] = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
          mood: 0.4 + Math.random() * 0.5 + (i * 0.01), // Gradual improvement trend
          energy: 0.3 + Math.random() * 0.6,
          clarity: 0.5 + Math.random() * 0.4 + (Math.sin(i / 7) * 0.1), // Weekly patterns
          growth: 0.2 + Math.random() * 0.3 + (i * 0.015) // Steady growth
        }));
        
        const mockGrowthCategories: GrowthCategory[] = [
          {
            name: 'Self-Awareness',
            value: 0.78,
            color: 'rgba(139, 195, 74, 0.8)',
            description: 'Your understanding of your inner world is beautifully deep'
          },
          {
            name: 'Emotional Intelligence',
            value: 0.65,
            color: 'rgba(103, 58, 183, 0.8)',
            description: 'You\'re developing sophisticated emotional wisdom'
          },
          {
            name: 'Resilience',
            value: 0.72,
            color: 'rgba(255, 193, 7, 0.8)',
            description: 'Your ability to bounce back is remarkably strong'
          },
          {
            name: 'Authenticity',
            value: 0.81,
            color: 'rgba(233, 30, 99, 0.8)',
            description: 'Your true self is shining through with courage'
          }
        ];
        
        const mockGardenInsights: GardenInsight[] = [
          {
            type: 'bloom',
            title: 'Evening Clarity',
            description: 'You consistently find deep insights during evening reflection sessions.',
            confidence: 0.85,
            daysGrowing: 23
          },
          {
            type: 'sprout',
            title: 'Emotional Vocabulary',
            description: 'Your ability to articulate complex feelings is expanding beautifully.',
            confidence: 0.67,
            daysGrowing: 12
          },
          {
            type: 'fruit',
            title: 'Self-Compassion',
            description: 'You\'re treating yourself with the kindness you deserve.',
            confidence: 0.92,
            daysGrowing: 34
          },
          {
            type: 'seed',
            title: 'Creative Expression',
            description: 'New forms of emotional expression are beginning to emerge.',
            confidence: 0.43,
            daysGrowing: 5
          }
        ];
        
        setMoodData(mockMoodData);
        setGrowthCategories(mockGrowthCategories);
        setGardenInsights(mockGardenInsights);
        
      } catch (error) {
        console.error('Failed to load sanctuary analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSanctuaryData();
  }, [user, timeframe]);

  const TimeframeSelector = () => (
    <div className="flex items-center gap-1 p-1 bg-sage-50/60 rounded-xl">
      {(['week', 'month', 'quarter'] as const).map((period) => (
        <button
          key={period}
          onClick={() => setTimeframe(period)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            timeframe === period
              ? 'bg-white text-sage-700 shadow-soft'
              : 'text-sage-600 hover:text-sage-700 hover:bg-sage-50/50'
          }`}
        >
          {period.charAt(0).toUpperCase() + period.slice(1)}
        </button>
      ))}
    </div>
  );

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-white/60 to-white/40 border border-sage-100/60 rounded-3xl shadow-soft p-8 backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-sage-50 to-sage-100">
              <div className="w-6 h-6 bg-sage-400 rounded-full animate-gentle-pulse opacity-60" />
            </div>
            <h3 className="text-sage-800 font-medium text-lg mb-2 tracking-tight">
              Creating Your Sanctuary Analytics
            </h3>
            <p className="text-sage-600 text-sm tracking-wide">
              Transforming your data into gentle insights
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-sage-800 mb-2 tracking-tight">
            Your Healing Sanctuary
          </h1>
          <p className="text-sage-600 text-sm">
            Compassionate insights from your emotional journey
          </p>
        </div>
        <TimeframeSelector />
      </div>

      {/* Real analytics will be added here */}

      {/* Organic visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood flow */}
        <div className="bg-gradient-to-br from-white/60 to-white/40 border border-sage-100/60 rounded-3xl shadow-soft p-6 backdrop-blur-sm">
          <h2 className="text-xl font-medium text-sage-800 mb-4 tracking-tight">
            Emotional Flow
          </h2>
          <p className="text-sage-600 text-sm mb-6 leading-relaxed">
            The gentle rhythm of your emotional landscape over time.
          </p>
          <MoodFlowVisualization data={moodData} timeframe={timeframe} />
        </div>

        {/* Growth rings */}
        <div className="bg-gradient-to-br from-white/60 to-white/40 border border-sage-100/60 rounded-3xl shadow-soft p-6 backdrop-blur-sm">
          <h2 className="text-xl font-medium text-sage-800 mb-4 tracking-tight">
            Growth Dimensions
          </h2>
          <p className="text-sage-600 text-sm mb-6 leading-relaxed">
            Your healing journey visualized as organic growth rings.
          </p>
          <div className="flex justify-center">
            <GrowthRings categories={growthCategories} size="medium" />
          </div>
        </div>
      </div>

      {/* Insight garden */}
      <div className="bg-gradient-to-br from-white/60 to-white/40 border border-sage-100/60 rounded-3xl shadow-soft p-6 backdrop-blur-sm">
        <h2 className="text-xl font-medium text-sage-800 mb-4 tracking-tight">
          Your Insight Garden
        </h2>
        <p className="text-sage-600 text-sm mb-6 leading-relaxed">
          Watch your insights grow from seeds to full bloom as you continue your healing journey.
        </p>
        <InsightGarden insights={gardenInsights} interactive={true} />
      </div>

      {/* Privacy assurance */}
      <div className="bg-gradient-to-br from-sage-50/60 to-sage-100/40 border border-sage-200/60 rounded-3xl shadow-soft p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-gentle-pulse" />
          <h3 className="text-lg font-medium text-sage-800 tracking-tight">
            Privacy Protected Analytics
          </h3>
        </div>
        <p className="text-sage-600 text-sm leading-relaxed">
          Your insights are generated using privacy-preserving techniques. We analyze patterns without storing personal content, 
          ensuring your healing journey remains private while providing meaningful guidance.
        </p>
        <div className="flex items-center gap-6 mt-4 text-xs text-sage-500">
          <span>🔒 Differential Privacy</span>
          <span>🌱 Federated Learning</span>
          <span>✨ Trauma-Informed Design</span>
          <span>🌸 Ethical AI</span>
        </div>
      </div>
    </div>
  );
}