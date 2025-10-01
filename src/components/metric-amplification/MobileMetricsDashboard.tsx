/**
 * ALCHM Mobile Metric Amplification Dashboard
 * Jony Ive Mobile Excellence: "Technology should be invisible"
 * 
 * Mobile-optimized executive dashboard maintaining design integrity
 * at every screen size with trauma-informed touch interactions.
 * 
 * Mobile Philosophy:
 * - One-handed operation capability
 * - Crisis-safe navigation patterns
 * - Gentle scrolling and transitions
 * - Essential information hierarchy
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MobileDashboardProps {
  isFullDashboard?: boolean;
}

export function MobileMetricsDashboard({ isFullDashboard = false }: MobileDashboardProps) {
  const [activeMetric, setActiveMetric] = useState<'conversion' | 'retention' | 'nps' | 'ai'>('conversion');
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulated metrics for mobile display
  const metrics = {
    conversion: { value: '12.4%', trend: 'up', description: 'Revenue conversion' },
    retention: { value: '67.8%', trend: 'up', description: '6-month retention' },
    nps: { value: '73', trend: 'up', description: 'Professional NPS' },
    ai: { value: '87.5%', trend: 'up', description: 'AI accuracy' }
  };

  const currentMetric = metrics[activeMetric];

  if (isFullDashboard) {
    // Mobile-optimized full dashboard
    return (
      <div className="min-h-screen bg-sanctuary-white">
        {/* Mobile Header */}
        <div className="pt-6 pb-4 px-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-light text-sanctuary-gray-900 tracking-tight">
              Analytics
            </h1>
            <p className="text-sm text-sanctuary-gray-600">
              Executive insights
            </p>
          </div>
        </div>

        {/* Mobile Metric Carousel */}
        <div className="px-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.entries(metrics).map(([key, metric]) => (
              <button
                key={key}
                onClick={() => setActiveMetric(key as any)}
                className={`flex-shrink-0 p-4 rounded-xl transition-all duration-300 min-w-[140px] ${
                  activeMetric === key
                    ? 'bg-sage-400 text-white shadow-soft'
                    : 'bg-sanctuary-gray-50 text-sanctuary-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-light mb-1">{metric.value}</div>
                  <div className="text-xs opacity-90">{metric.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Content Areas */}
        <div className="px-4 space-y-4">
          {activeMetric === 'conversion' && <MobileConversionView />}
          {activeMetric === 'retention' && <MobileRetentionView />}
          {activeMetric === 'nps' && <MobileProfessionalView />}
          {activeMetric === 'ai' && <MobileAIView />}
        </div>
      </div>
    );
  }

  // Compact widget version
  return (
    <Card variant="sanctuary" className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle level="h3" className="text-lg">Analytics Summary</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? '−' : '+'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {!isExpanded ? (
          // Collapsed state - single metric
          <div className="text-center py-2">
            <div className="text-3xl font-light text-sanctuary-gray-900 mb-1">
              {currentMetric.value}
            </div>
            <div className="text-sm text-sanctuary-gray-600">
              {currentMetric.description}
            </div>
          </div>
        ) : (
          // Expanded state - all metrics
          <div className="space-y-4">
            {Object.entries(metrics).map(([key, metric]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-sanctuary-gray-50 rounded-lg">
                <div>
                  <div className="text-lg font-light text-sanctuary-gray-900">
                    {metric.value}
                  </div>
                  <div className="text-xs text-sanctuary-gray-600">
                    {metric.description}
                  </div>
                </div>
                <div className="text-sage-600">
                  {metric.trend === 'up' ? '↗' : '↘'}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Mobile-optimized content views
function MobileConversionView() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle level="h3">Conversion Funnel</CardTitle>
        <CardDescription>Revenue optimization journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { stage: 'Landing', users: '45K', rate: '100%' },
            { stage: 'Signup', users: '8.9K', rate: '19.7%' },
            { stage: 'First Use', users: '6.7K', rate: '75.5%' },
            { stage: 'Premium', users: '1.3K', rate: '20.0%' }
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-sanctuary-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-sanctuary-gray-800">{item.stage}</div>
                <div className="text-sm text-sanctuary-gray-600">{item.users} users</div>
              </div>
              <div className="text-sage-600 font-medium">{item.rate}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MobileRetentionView() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle level="h3">User Retention</CardTitle>
        <CardDescription>Engagement over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { period: 'Day 7', rate: '82.3%', color: 'bg-sage-100' },
            { period: 'Day 30', rate: '74.1%', color: 'bg-sage-200' },
            { period: 'Day 90', rate: '68.9%', color: 'bg-sage-300' },
            { period: '6 Months', rate: '67.8%', color: 'bg-sage-400' }
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm font-medium text-sanctuary-gray-700">{item.period}</span>
              </div>
              <span className="text-lg font-light text-sanctuary-gray-900">{item.rate}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MobileProfessionalView() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle level="h3">Professional Network</CardTitle>
        <CardDescription>Therapist satisfaction</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-4xl font-light text-sage-600 mb-2">73</div>
          <div className="text-sm text-sanctuary-gray-600">NPS Score</div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-sanctuary-gray-50 rounded-lg">
            <div className="text-xl font-light text-sage-600">68%</div>
            <div className="text-xs text-sanctuary-gray-600">Promoters</div>
          </div>
          <div className="p-3 bg-sanctuary-gray-50 rounded-lg">
            <div className="text-xl font-light text-sanctuary-gray-700">25%</div>
            <div className="text-xs text-sanctuary-gray-600">Passives</div>
          </div>
          <div className="p-3 bg-sanctuary-gray-50 rounded-lg">
            <div className="text-xl font-light text-red-500">7%</div>
            <div className="text-xs text-sanctuary-gray-600">Detractors</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MobileAIView() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle level="h3">AI Performance</CardTitle>
        <CardDescription>Machine learning insights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { label: 'Model Accuracy', value: '87.5%', target: 90 },
            { label: 'Personalization', value: '82.1%', target: 85 },
            { label: 'Intervention Success', value: '74.8%', target: 80 }
          ].map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-sanctuary-gray-700">{metric.label}</span>
                <span className="text-lg font-light text-sanctuary-gray-900">{metric.value}</span>
              </div>
              <div className="h-2 bg-sanctuary-gray-100 rounded-full">
                <div 
                  className="h-2 bg-sage-400 rounded-full transition-all duration-1000"
                  style={{ width: `${(parseFloat(metric.value) / metric.target) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}