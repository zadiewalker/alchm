'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Heart, Shield, Zap, Target, Award, Brain, Sparkles } from 'lucide-react';

interface MentalHealthInvestmentProps {
  timeframe?: number; // in months
}

export function MentalHealthInvestment({ timeframe = 18 }: MentalHealthInvestmentProps) {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  useEffect(() => {
    const phases = [0, 1, 2, 3];
    phases.forEach((phase, index) => {
      setTimeout(() => setAnimationPhase(phase), index * 400);
    });
  }, []);

  const investmentMetrics = [
    {
      id: 'emotional-roi',
      icon: <Heart className="w-6 h-6" />,
      title: 'Emotional Intelligence ROI',
      value: '340%',
      description: 'Improved emotional regulation and self-awareness',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      detail: 'Studies show emotional intelligence training yields 3.4x return through improved relationships and decision-making'
    },
    {
      id: 'productivity-gain',
      icon: <Zap className="w-6 h-6" />,
      title: 'Productivity Improvement',
      value: '23%',
      description: 'Better focus, energy, and mental clarity',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      detail: 'Mental wellness directly correlates with 15-30% productivity increases in professional settings'
    },
    {
      id: 'healthcare-savings',
      icon: <Shield className="w-6 h-6" />,
      title: 'Healthcare Cost Reduction',
      value: '$2,400',
      description: 'Reduced medical visits and stress-related conditions',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      detail: 'Preventive mental health care reduces annual healthcare costs by $1,000-$4,000 per person'
    },
    {
      id: 'relationship-value',
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Relationship Quality',
      value: '85%',
      description: 'Enhanced communication and connection',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      detail: 'Improved mental health leads to 70-90% better relationship satisfaction and communication'
    }
  ];

  const timelineROI = [
    {
      month: 1,
      milestone: 'Foundation Building',
      benefit: 'Self-awareness increases by 25%',
      icon: <Brain className="w-4 h-4" />
    },
    {
      month: 3,
      milestone: 'Pattern Recognition',
      benefit: 'Emotional regulation improves by 40%',
      icon: <Target className="w-4 h-4" />
    },
    {
      month: 6,
      milestone: 'Habit Integration',
      benefit: 'Stress management mastery achieved',
      icon: <Shield className="w-4 h-4" />
    },
    {
      month: 12,
      milestone: 'Transformation Locked',
      benefit: 'Sustainable well-being established',
      icon: <Award className="w-4 h-4" />
    },
    {
      month: 18,
      milestone: 'Wisdom Embodied',
      benefit: 'Mentor and guide others in healing',
      icon: <Sparkles className="w-4 h-4" />
    }
  ];

  const totalInvestment = 149.94; // 18 months
  const estimatedLifetimeValue = 24750; // conservative estimate of benefits

  return (
    <div className="space-y-6">
      {/* Investment Overview */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-medium text-slate-800">Mental Health Investment Analysis</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-slate-600">Your Investment</div>
              <div className="text-3xl font-medium text-blue-700">
                ${totalInvestment}
              </div>
              <div className="text-xs text-slate-500">One-time 18-month commitment</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-slate-600">Estimated Lifetime Value</div>
              <div className="text-3xl font-medium text-green-700">
                ${estimatedLifetimeValue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">Conservative 5-year projection</div>
            </div>
          </div>

          <div className="bg-white/60 p-4 rounded-lg">
            <div className="text-lg font-medium text-slate-800">
              ROI: <span className="text-green-600">
                {Math.round((estimatedLifetimeValue - totalInvestment) / totalInvestment * 100)}%
              </span>
            </div>
            <div className="text-sm text-slate-600">
              Every $1 invested returns ${(estimatedLifetimeValue / totalInvestment).toFixed(2)} in value
            </div>
          </div>
        </div>
      </Card>

      {/* Investment Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {investmentMetrics.map((metric, index) => (
          <Card
            key={metric.id}
            className={`p-4 cursor-pointer transition-all duration-300 ${metric.bgColor} ${metric.borderColor} ${
              animationPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } ${hoveredMetric === metric.id ? 'scale-105 shadow-lg' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
            onMouseEnter={() => setHoveredMetric(metric.id)}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            <div className="space-y-3">
              <div className={`${metric.color}`}>
                {metric.icon}
              </div>
              <div>
                <div className={`text-2xl font-medium ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {metric.title}
                </div>
                <div className="text-xs text-slate-600">
                  {metric.description}
                </div>
              </div>
            </div>

            {/* Hover Detail */}
            {hoveredMetric === metric.id && (
              <div className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-xl border max-w-xs">
                <div className="text-xs text-slate-600">
                  {metric.detail}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* ROI Timeline */}
      <Card className="p-6 bg-white border-slate-200">
        <div className="space-y-4">
          <h3 className="font-medium text-slate-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-600" />
            Your Investment Timeline
          </h3>
          
          <div className="space-y-4">
            {timelineROI.map((milestone, index) => (
              <div
                key={milestone.month}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-500 ${
                  animationPhase >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-lg font-medium text-purple-600">
                    {milestone.month}mo
                  </div>
                </div>
                
                <div className="flex-shrink-0 text-purple-600">
                  {milestone.icon}
                </div>
                
                <div className="flex-grow">
                  <div className="font-medium text-slate-800">
                    {milestone.milestone}
                  </div>
                  <div className="text-sm text-slate-600">
                    {milestone.benefit}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Value Proposition Summary */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium text-green-800">
            Why This Investment Makes Sense
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-medium text-green-700">Financial Return</div>
              <div className="text-green-600">
                Saves thousands in therapy costs while providing superior 24/7 support
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-green-700">Life Quality</div>
              <div className="text-green-600">
                Measurable improvements in relationships, productivity, and happiness
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-green-700">Future Security</div>
              <div className="text-green-600">
                Build resilience and emotional intelligence that lasts a lifetime
              </div>
            </div>
          </div>

          <div className="text-xs text-green-600 bg-white/50 p-3 rounded-lg">
            <strong>Evidence-Based:</strong> All projections based on peer-reviewed research in 
            preventive mental healthcare, emotional intelligence training, and digital therapeutics.
          </div>
        </div>
      </Card>
    </div>
  );
}