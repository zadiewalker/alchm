// ALCHM Cultural Competency Progress Visualization
// Comprehensive dashboard for tracking identity exploration, bias reduction, and cultural competency growth

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CulturalCompetencyGrowthVisualization,
  CompetencyDashboard,
  ProgressChart,
  GrowthTrajectory,
  BiasReductionChart,
  IdentityEvolutionMap
} from '@/types/identity-pathway-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { BiasGrowthTracker, BiasProgressVisualization } from '@/lib/bias-interruption-tracking';

interface ProgressVisualizationProps {
  userId: string;
  identityProfile: IdentityExplorationProfile;
  visualizationData: CulturalCompetencyGrowthVisualization;
  biasTracker: BiasGrowthTracker;
  timeframe: 'week' | 'month' | 'quarter' | 'year' | 'all_time';
  onTimeframeChange?: (timeframe: string) => void;
  onInsightSelect?: (insight: any) => void;
  showDetailedMetrics?: boolean;
}

interface VisualizationState {
  activeChart: string;
  selectedTimeRange: DateRange;
  comparisonMode: boolean;
  focusArea: 'identity' | 'bias' | 'empathy' | 'cultural' | 'community' | 'overall';
  celebrationView: boolean;
  detailLevel: 'overview' | 'detailed' | 'expert';
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
  insights: ChartInsight[];
  milestones: ChartMilestone[];
}

interface ProgressMetric {
  name: string;
  current: number;
  previous: number;
  target: number;
  trend: 'improving' | 'stable' | 'declining';
  significance: 'low' | 'medium' | 'high';
}

const CulturalCompetencyProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  userId,
  identityProfile,
  visualizationData,
  biasTracker,
  timeframe,
  onTimeframeChange,
  onInsightSelect,
  showDetailedMetrics = false
}) => {
  // State management
  const [visualizationState, setVisualizationState] = useState<VisualizationState>({
    activeChart: 'overview',
    selectedTimeRange: getTimeRangeForTimeframe(timeframe),
    comparisonMode: false,
    focusArea: 'overall',
    celebrationView: false,
    detailLevel: 'overview'
  });

  const [animationState, setAnimationState] = useState({
    isAnimating: false,
    completedAnimations: new Set<string>()
  });

  const [selectedInsights, setSelectedInsights] = useState<any[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Process visualization data
  const processedData = useMemo(() => {
    return processVisualizationData(
      visualizationData,
      biasTracker,
      visualizationState.selectedTimeRange,
      visualizationState.focusArea
    );
  }, [visualizationData, biasTracker, visualizationState.selectedTimeRange, visualizationState.focusArea]);

  // Initialize animations on load
  useEffect(() => {
    setAnimationState(prev => ({ ...prev, isAnimating: true }));
    
    // Check for celebration moments
    const recentMilestones = visualizationData.milestoneTracking.filter(
      milestone => milestone.achievedDate && 
      milestone.achievedDate > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    );
    
    if (recentMilestones.length > 0) {
      setTimeout(() => setShowCelebration(true), 1000);
    }
  }, [visualizationData]);

  // Handle chart interaction
  const handleChartInteraction = (chartType: string, dataPoint: any) => {
    if (dataPoint.insights) {
      setSelectedInsights(dataPoint.insights);
      onInsightSelect?.(dataPoint.insights);
    }
  };

  // Render celebration overlay
  const renderCelebrationOverlay = () => {
    if (!showCelebration) return null;

    const recentMilestones = visualizationData.milestoneTracking.filter(
      milestone => milestone.achievedDate && 
      milestone.achievedDate > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-lg mx-4 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-medium text-gray-800 mb-2">
              Congratulations on Your Growth!
            </h2>
            <p className="text-gray-600">
              You've reached important milestones in your journey
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {recentMilestones.map((milestone, index) => (
              <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="font-medium text-gray-800">{milestone.title}</div>
                <div className="text-sm text-gray-600">{milestone.description}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowCelebration(false)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600"
          >
            Continue Journey
          </button>
        </div>
      </div>
    );
  };

  // Render main dashboard
  const renderMainDashboard = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Overall Progress Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Overall Progress</h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      stroke="url(#progressGradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${processedData.overallProgress * 339.292} 339.292`}
                      className="transition-all duration-2000 ease-out"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-medium text-gray-800">
                        {Math.round(processedData.overallProgress * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {processedData.keyMetrics.slice(0, 4).map((metric, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-800">
                        {Math.round(metric.current * 100)}%
                      </span>
                      <span className={`text-xs ${
                        metric.trend === 'improving' ? 'text-green-600' : 
                        metric.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.trend === 'improving' ? '↗' : 
                         metric.trend === 'declining' ? '↘' : '→'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Growth Trajectory Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Growth Trajectory</h3>
              <div className="flex space-x-2">
                {['week', 'month', 'quarter', 'year'].map((period) => (
                  <button
                    key={period}
                    onClick={() => onTimeframeChange?.(period)}
                    className={`px-3 py-1 text-sm rounded ${
                      timeframe === period
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 flex items-end space-x-2">
              {processedData.trajectoryData.map((point, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center cursor-pointer hover:opacity-80"
                  onClick={() => handleChartInteraction('trajectory', point)}
                >
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all duration-1000 ease-out"
                    style={{ 
                      height: `${point.value * 100}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    {point.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render detailed competency areas
  const renderCompetencyAreas = () => {
    const competencyAreas = [
      {
        name: 'Identity Exploration',
        icon: '🧭',
        progress: processedData.identityExplorationProgress,
        insights: processedData.identityInsights,
        color: 'blue'
      },
      {
        name: 'Bias Awareness',
        icon: '👁️',
        progress: processedData.biasAwarenessProgress,
        insights: processedData.biasInsights,
        color: 'green'
      },
      {
        name: 'Empathy Development',
        icon: '❤️',
        progress: processedData.empathyProgress,
        insights: processedData.empathyInsights,
        color: 'purple'
      },
      {
        name: 'Cultural Competency',
        icon: '🌍',
        progress: processedData.culturalCompetencyProgress,
        insights: processedData.culturalInsights,
        color: 'orange'
      },
      {
        name: 'Community Engagement',
        icon: '🤝',
        progress: processedData.communityEngagementProgress,
        insights: processedData.communityInsights,
        color: 'pink'
      },
      {
        name: 'Leadership Development',
        icon: '⭐',
        progress: processedData.leadershipProgress,
        insights: processedData.leadershipInsights,
        color: 'indigo'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {competencyAreas.map((area, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setVisualizationState(prev => ({ ...prev, focusArea: area.name.toLowerCase().replace(' ', '_') as any }))}
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{area.icon}</span>
              <h4 className="font-medium text-gray-800">{area.name}</h4>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-800">
                  {Math.round(area.progress.current * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-${area.color}-500 h-2 rounded-full transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${area.progress.current * 100}%`,
                    animationDelay: `${index * 200}ms`
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Level</span>
                <span className={`text-${area.color}-600 font-medium`}>
                  {area.progress.level}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Recent Growth</span>
                <span className={`text-sm ${
                  area.progress.recentGrowth > 0 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  +{Math.round(area.progress.recentGrowth * 100)}%
                </span>
              </div>
            </div>

            {area.insights.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600 mb-2">Latest Insight:</div>
                <div className="text-sm text-gray-800 italic">
                  "{area.insights[0].message}"
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render milestones and achievements
  const renderMilestonesAndAchievements = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-6">Milestones & Achievements</h3>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
            {visualizationData.milestoneTracking.map((milestone, index) => (
              <div key={index} className="relative flex items-start space-x-4">
                {/* Timeline dot */}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  milestone.achievedDate ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <span className="text-white text-sm">
                    {milestone.achievedDate ? '✓' : index + 1}
                  </span>
                </div>
                
                {/* Milestone content */}
                <div className="flex-1 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-medium ${
                      milestone.achievedDate ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {milestone.title}
                    </h4>
                    {milestone.achievedDate && (
                      <span className="text-sm text-green-600">
                        {milestone.achievedDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-sm ${
                    milestone.achievedDate ? 'text-gray-700' : 'text-gray-500'
                  } mb-3`}>
                    {milestone.description}
                  </p>
                  
                  {milestone.culturalSignificance && (
                    <div className="bg-purple-50 border border-purple-200 rounded p-3">
                      <div className="text-sm text-purple-800">
                        <span className="font-medium">Cultural Significance:</span> {milestone.culturalSignificance}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render insights and recommendations
  const renderInsightsAndRecommendations = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personalized Insights */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            💡 Personalized Insights
          </h3>
          
          <div className="space-y-4">
            {visualizationData.personalizedInsights.slice(0, 3).map((insight, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-lg">🔍</span>
                  <div>
                    <div className="font-medium text-blue-800 mb-1">{insight.category}</div>
                    <p className="text-blue-700 text-sm">{insight.insight}</p>
                    {insight.culturalContext && (
                      <div className="mt-2 text-xs text-blue-600">
                        Cultural Context: {insight.culturalContext}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            🎯 Recommended Next Steps
          </h3>
          
          <div className="space-y-4">
            {visualizationData.nextStepsRecommendations.slice(0, 4).map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm font-medium">{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800 mb-1">{step.title}</div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      step.priority === 'high' ? 'bg-red-100 text-red-700' :
                      step.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {step.priority} priority
                    </span>
                    <span className="text-xs text-gray-500">
                      {step.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {renderCelebrationOverlay()}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-gray-800 mb-4">
            Your Cultural Competency Journey
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track your growth across identity exploration, bias awareness, empathy development, 
            and cultural competency. Celebrate your progress and discover your next steps.
          </p>
        </div>

        {/* Main Dashboard */}
        {renderMainDashboard()}

        {/* Competency Areas */}
        {renderCompetencyAreas()}

        {/* Milestones and Achievements */}
        {renderMilestonesAndAchievements()}

        {/* Insights and Recommendations */}
        {renderInsightsAndRecommendations()}
      </div>
    </div>
  );
};

// Helper functions
const getTimeRangeForTimeframe = (timeframe: string) => {
  const end = new Date();
  const start = new Date();
  
  switch (timeframe) {
    case 'week':
      start.setDate(end.getDate() - 7);
      break;
    case 'month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(end.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setFullYear(2020); // All time
  }
  
  return { startDate: start, endDate: end };
};

const processVisualizationData = (
  visualizationData: CulturalCompetencyGrowthVisualization,
  biasTracker: BiasGrowthTracker,
  timeRange: DateRange,
  focusArea: string
) => {
  // Implementation would process and combine data from various sources
  return {
    overallProgress: 0.75, // Placeholder
    keyMetrics: [
      { name: 'Identity Clarity', current: 0.8, previous: 0.6, target: 0.9, trend: 'improving' as const, significance: 'high' as const },
      { name: 'Bias Awareness', current: 0.7, previous: 0.5, target: 0.8, trend: 'improving' as const, significance: 'high' as const },
      { name: 'Empathy Level', current: 0.85, previous: 0.8, target: 0.9, trend: 'improving' as const, significance: 'medium' as const },
      { name: 'Cultural Safety', current: 0.9, previous: 0.85, target: 0.95, trend: 'improving' as const, significance: 'high' as const }
    ],
    trajectoryData: Array.from({ length: 12 }, (_, i) => ({
      label: `Month ${i + 1}`,
      value: 0.3 + (i * 0.05) + Math.random() * 0.1,
      insights: []
    })),
    identityExplorationProgress: { current: 0.8, level: 'Advanced', recentGrowth: 0.15 },
    biasAwarenessProgress: { current: 0.7, level: 'Intermediate', recentGrowth: 0.2 },
    empathyProgress: { current: 0.85, level: 'Advanced', recentGrowth: 0.1 },
    culturalCompetencyProgress: { current: 0.75, level: 'Intermediate', recentGrowth: 0.18 },
    communityEngagementProgress: { current: 0.6, level: 'Developing', recentGrowth: 0.25 },
    leadershipProgress: { current: 0.65, level: 'Developing', recentGrowth: 0.12 },
    identityInsights: [{ message: 'Your cultural identity exploration has deepened significantly' }],
    biasInsights: [{ message: 'You\'ve shown remarkable growth in recognizing implicit biases' }],
    empathyInsights: [{ message: 'Your perspective-taking abilities have expanded' }],
    culturalInsights: [{ message: 'Cross-cultural understanding continues to develop' }],
    communityInsights: [{ message: 'Community engagement is becoming more meaningful' }],
    leadershipInsights: [{ message: 'Leadership skills in inclusive spaces are emerging' }]
  };
};

// Supporting interfaces
interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

interface ChartInsight {
  message: string;
  significance: 'low' | 'medium' | 'high';
  actionable: boolean;
}

interface ChartMilestone {
  date: Date;
  title: string;
  description: string;
  type: 'achievement' | 'breakthrough' | 'challenge_overcome';
}

export default CulturalCompetencyProgressVisualization;