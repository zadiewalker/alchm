/**
 * ALCHM Analytics Visualization Components
 * 
 * Beautiful, trauma-informed data visualizations that celebrate progress
 * and provide supportive insights without clinical coldness.
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ==============================================================================
// CORE VISUALIZATION INTERFACES
// ==============================================================================

export interface VisualizationProps {
  className?: string;
  variant?: 'gentle' | 'encouraging' | 'celebratory';
  size?: 'compact' | 'standard' | 'expanded';
}

export interface MetricDisplayProps extends VisualizationProps {
  value: number;
  label: string;
  description?: string;
  trend?: 'improving' | 'stable' | 'needs_attention';
  showProgress?: boolean;
  isPercentage?: boolean;
}

export interface ProgressRingProps extends VisualizationProps {
  value: number;
  maxValue?: number;
  label: string;
  description?: string;
  color?: 'sage' | 'amber' | 'rose' | 'blue' | 'purple';
  showLabel?: boolean;
}

export interface TrendVisualizationProps extends VisualizationProps {
  data: Array<{ label: string; value: number; date?: Date }>;
  title: string;
  description?: string;
  type?: 'line' | 'bar' | 'area';
}

export interface EmotionalPatternProps extends VisualizationProps {
  emotions: Array<{ emotion: string; percentage: number; trend: string }>;
  title?: string;
}

export interface GrowthIndicatorProps extends VisualizationProps {
  indicators: Array<{ name: string; value: number; description: string }>;
  title?: string;
}

// ==============================================================================
// SUPPORTIVE METRIC DISPLAY
// ==============================================================================

export function SupportiveMetricDisplay({
  value,
  label,
  description,
  trend = 'stable',
  showProgress = true,
  isPercentage = false,
  variant = 'gentle',
  size = 'standard',
  className = ''
}: MetricDisplayProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'improving': return 'text-sage-600 bg-sage-50';
      case 'needs_attention': return 'text-amber-600 bg-amber-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving': return '🌱';
      case 'needs_attention': return '🌟';
      default: return '💙';
    }
  };

  const formatValue = () => {
    if (isPercentage) {
      return `${Math.round(value * 100)}%`;
    }
    return value.toFixed(1);
  };

  const sizeClasses = {
    compact: 'p-4',
    standard: 'p-6',
    expanded: 'p-8'
  };

  return (
    <Card className={`bg-white border-sage-100 hover:shadow-soft transition-all duration-300 ${className}`}>
      <CardContent className={sizeClasses[size]}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-sage-600 uppercase tracking-wide">
            {label}
          </span>
          <div className={`p-1.5 rounded-lg ${getTrendColor()}`}>
            <span className="text-sm">{getTrendIcon()}</span>
          </div>
        </div>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-ink tracking-tight">
            {formatValue()}
          </span>
          {trend === 'improving' && (
            <span className="text-sm text-sage-600 font-medium">↗</span>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted leading-relaxed mb-3">
            {description}
          </p>
        )}
        
        {showProgress && (
          <div className="w-full bg-sage-50 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sage-300 to-sage-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, value * 100)}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==============================================================================
// HEALING PROGRESS RING
// ==============================================================================

export function HealingProgressRing({
  value,
  maxValue = 1,
  label,
  description,
  color = 'sage',
  showLabel = true,
  size = 'standard',
  className = ''
}: ProgressRingProps) {
  const percentage = (value / maxValue) * 100;
  const strokeDasharray = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  const colorMap = {
    sage: { 
      stroke: 'stroke-sage-400', 
      text: 'text-sage-600',
      bg: 'text-sage-100'
    },
    amber: { 
      stroke: 'stroke-amber-400', 
      text: 'text-amber-600',
      bg: 'text-amber-100'
    },
    rose: { 
      stroke: 'stroke-rose-400', 
      text: 'text-rose-600',
      bg: 'text-rose-100'
    },
    blue: { 
      stroke: 'stroke-blue-400', 
      text: 'text-blue-600',
      bg: 'text-blue-100'
    },
    purple: { 
      stroke: 'stroke-purple-400', 
      text: 'text-purple-600',
      bg: 'text-purple-100'
    }
  };

  const sizeMap = {
    compact: { size: 80, radius: 35, strokeWidth: 6 },
    standard: { size: 120, radius: 45, strokeWidth: 8 },
    expanded: { size: 160, radius: 60, strokeWidth: 10 }
  };

  const { size: svgSize, radius, strokeWidth } = sizeMap[size];
  const colors = colorMap[color];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <svg 
          width={svgSize} 
          height={svgSize} 
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className={colors.bg}
          />
          {/* Progress circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className={colors.stroke}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1.5s ease-in-out'
            }}
          />
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${colors.text}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      
      {showLabel && (
        <div className="text-center mt-4">
          <h4 className="font-semibold text-ink text-sm mb-1">{label}</h4>
          {description && (
            <p className="text-xs text-muted leading-relaxed max-w-[120px]">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// EMOTIONAL PATTERN VISUALIZATION
// ==============================================================================

export function EmotionalPatternViz({
  emotions,
  title = "Emotional Patterns",
  size = 'standard',
  className = ''
}: EmotionalPatternProps) {
  const getEmotionColor = (emotion: string) => {
    const positiveEmotions = ['happy', 'grateful', 'peaceful', 'confident', 'hopeful'];
    const complexEmotions = ['ambivalent', 'nostalgic', 'vulnerable', 'empowered'];
    
    if (positiveEmotions.some(pos => emotion.toLowerCase().includes(pos))) {
      return 'bg-sage-100 text-sage-700 border-sage-200';
    }
    if (complexEmotions.some(comp => emotion.toLowerCase().includes(comp))) {
      return 'bg-purple-100 text-purple-700 border-purple-200';
    }
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '↗️';
      case 'stable': return '→';
      case 'needs_attention': return '💡';
      default: return '•';
    }
  };

  return (
    <Card className={`bg-white border-sage-100 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-ink text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">💭</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {emotions.slice(0, 5).map((emotion, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getEmotionColor(emotion.emotion)}`}>
                  {emotion.emotion}
                </span>
                <div className="flex-1 bg-sage-50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sage-300 to-sage-400 rounded-full transition-all duration-1000"
                    style={{ width: `${emotion.percentage}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <span className="text-sm font-medium text-ink">
                  {Math.round(emotion.percentage)}%
                </span>
                <span className="text-sm" title={emotion.trend}>
                  {getTrendIcon(emotion.trend)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {emotions.length === 0 && (
          <div className="text-center py-8">
            <span className="text-4xl mb-3 block">🌱</span>
            <p className="text-muted text-sm">
              Continue writing to discover your emotional patterns
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==============================================================================
// GROWTH INDICATORS VISUALIZATION
// ==============================================================================

export function GrowthIndicatorsViz({
  indicators,
  title = "Growth Indicators",
  size = 'standard',
  className = ''
}: GrowthIndicatorProps) {
  const getIndicatorColor = (value: number) => {
    if (value >= 0.8) return { bg: 'bg-sage-50', border: 'border-sage-200', text: 'text-sage-700' };
    if (value >= 0.6) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' };
    return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
  };

  return (
    <Card className={`bg-white border-sage-100 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-ink text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">📈</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {indicators.map((indicator, index) => {
            const colors = getIndicatorColor(indicator.value);
            return (
              <div 
                key={index} 
                className={`p-4 rounded-xl border ${colors.bg} ${colors.border} transition-all duration-300 hover:shadow-soft`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold text-sm ${colors.text}`}>
                    {indicator.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${colors.text}`}>
                      {Math.round(indicator.value * 100)}%
                    </span>
                    <HealingProgressRing
                      value={indicator.value}
                      label=""
                      size="compact"
                      showLabel={false}
                      color={indicator.value >= 0.8 ? 'sage' : indicator.value >= 0.6 ? 'amber' : 'blue'}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {indicator.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {indicators.length === 0 && (
          <div className="text-center py-8">
            <span className="text-4xl mb-3 block">🌟</span>
            <p className="text-muted text-sm">
              Your growth indicators will appear as you continue journaling
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==============================================================================
// GENTLE TREND VISUALIZATION
// ==============================================================================

export function GentleTrendViz({
  data,
  title,
  description,
  type = 'area',
  size = 'standard',
  className = ''
}: TrendVisualizationProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * 100;
  };

  return (
    <Card className={`bg-white border-sage-100 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-ink text-lg font-semibold">
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-32 flex items-end justify-between gap-2">
          {data.map((point, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-gradient-to-t from-sage-300 to-sage-400 rounded-t-lg transition-all duration-1000 ease-out min-h-[4px]"
                style={{ height: `${Math.max(4, getBarHeight(point.value))}%` }}
              />
              <span className="text-xs text-muted font-medium truncate max-w-full">
                {point.label}
              </span>
            </div>
          ))}
        </div>
        
        {data.length === 0 && (
          <div className="text-center py-8">
            <span className="text-4xl mb-3 block">📊</span>
            <p className="text-muted text-sm">
              Trends will appear as you build your journaling practice
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==============================================================================
// HEALING MILESTONE CELEBRATION
// ==============================================================================

export interface HealingMilestoneProps extends VisualizationProps {
  milestones: Array<{
    id: string;
    name: string;
    description: string;
    achievedDate: Date;
    significanceScore: number;
  }>;
  title?: string;
}

export function HealingMilestoneCelebration({
  milestones,
  title = "Healing Milestones",
  className = ''
}: HealingMilestoneProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMilestoneIcon = (significanceScore: number) => {
    if (significanceScore >= 0.9) return '🏆';
    if (significanceScore >= 0.7) return '🌟';
    if (significanceScore >= 0.5) return '💎';
    return '🌱';
  };

  return (
    <Card className={`bg-white border-sage-100 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-ink text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">🎉</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.slice(0, 3).map((milestone) => (
            <div 
              key={milestone.id}
              className="p-4 bg-gradient-to-r from-sage-50 to-sage-100/50 rounded-xl border border-sage-200 transition-all duration-300 hover:shadow-soft"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">
                  {getMilestoneIcon(milestone.significanceScore)}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-ink text-sm mb-1">
                    {milestone.name}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed mb-2">
                    {milestone.description}
                  </p>
                  <span className="text-xs text-sage-600 font-medium">
                    Achieved {formatDate(milestone.achievedDate)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {milestones.length === 0 && (
          <div className="text-center py-8">
            <span className="text-4xl mb-3 block">🎯</span>
            <p className="text-muted text-sm">
              Your healing milestones will be celebrated here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==============================================================================
// SUPPORTIVE RECOMMENDATIONS
// ==============================================================================

export interface SupportiveRecommendationProps extends VisualizationProps {
  recommendations: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    priority: number;
    traumaInformed: boolean;
    actionable: boolean;
  }>;
  title?: string;
}

export function SupportiveRecommendations({
  recommendations,
  title = "Supportive Insights",
  className = ''
}: SupportiveRecommendationProps) {
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'healing_practice': return '🧘';
      case 'writing_technique': return '✍️';
      case 'self_care': return '💚';
      case 'professional_support': return '🤝';
      default: return '💡';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-sage-50 border-sage-200 text-sage-700';
    if (priority >= 6) return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  return (
    <Card className={`bg-white border-sage-100 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-ink text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">🌟</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.slice(0, 3).map((rec) => (
            <div 
              key={rec.id}
              className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-soft ${getPriorityColor(rec.priority)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">
                  {getRecommendationIcon(rec.type)}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">
                    {rec.title}
                  </h4>
                  <p className="text-xs leading-relaxed mb-2">
                    {rec.description}
                  </p>
                  <div className="flex gap-2">
                    {rec.traumaInformed && (
                      <span className="text-xs px-2 py-1 bg-sage-100 text-sage-700 rounded-full">
                        Trauma-informed
                      </span>
                    )}
                    {rec.actionable && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        Actionable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {recommendations.length === 0 && (
          <div className="text-center py-8">
            <span className="text-4xl mb-3 block">🎁</span>
            <p className="text-muted text-sm">
              Personalized insights will appear as you continue your journey
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default {
  SupportiveMetricDisplay,
  HealingProgressRing,
  EmotionalPatternViz,
  GrowthIndicatorsViz,
  GentleTrendViz,
  HealingMilestoneCelebration,
  SupportiveRecommendations
};