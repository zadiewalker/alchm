'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MultiDimensionalGrowth } from './MultiDimensionalGrowth';
import { BeforeAfterAnalysis } from './BeforeAfterAnalysis';
import { CommunityTransformation } from './CommunityTransformation';
import { ProfessionalAssessmentIntegration } from './ProfessionalAssessmentIntegration';
import { SacredMetamorphosisEngine } from '@/lib/transformation/sacred-metamorphosis-engine';

interface TransformationStage {
  id: string;
  name: string;
  symbol: string;
  description: string;
  sacredMeaning: string;
  active: boolean;
}

interface TransformationData {
  userId: string;
  startDate: Date;
  currentStage: string;
  dimensions: {
    emotional: number;
    behavioral: number;
    cognitive: number;
    spiritual: number;
    relational: number;
  };
  milestones: any[];
  insights: any[];
  assessments: any[];
}

export const KheperaTransformationTracker: React.FC = () => {
  const { user } = useAuth();
  const [transformationData, setTransformationData] = useState<TransformationData | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'dimensions' | 'analysis' | 'community' | 'professional'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [sacredMode, setSacredMode] = useState(true);

  const transformationStages: TransformationStage[] = [
    {
      id: 'emergence',
      name: 'Emergence',
      symbol: '🌱',
      description: 'Beginning of conscious transformation',
      sacredMeaning: 'Like the scarab pushing through darkness toward light',
      active: true
    },
    {
      id: 'metamorphosis',
      name: 'Metamorphosis',
      symbol: '🛡️',
      description: 'Deep internal restructuring and growth',
      sacredMeaning: 'The sacred scarab forming its protective shell of wisdom',
      active: false
    },
    {
      id: 'integration',
      name: 'Integration',
      symbol: '🪲',
      description: 'Merging new insights with daily life',
      sacredMeaning: 'The scarab rolling the sun of consciousness across the sky',
      active: false
    },
    {
      id: 'transcendence',
      name: 'Transcendence',
      symbol: '☀️',
      description: 'Embodying transformed self in service',
      sacredMeaning: 'Becoming the sacred solar disk of wisdom and compassion',
      active: false
    }
  ];

  useEffect(() => {
    if (user) {
      loadTransformationData();
    }
  }, [user]);

  const loadTransformationData = async () => {
    try {
      setIsLoading(true);
      const engine = new SacredMetamorphosisEngine();
      const data = await engine.loadUserTransformation(user.uid);
      setTransformationData(data);
    } catch (error) {
      console.error('Error loading transformation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStageTransition = async (stageId: string) => {
    try {
      const engine = new SacredMetamorphosisEngine();
      await engine.transitionToStage(user.uid, stageId);
      await loadTransformationData();
    } catch (error) {
      console.error('Error transitioning stage:', error);
    }
  };

  const renderSacredProgressVisualization = () => {
    if (!transformationData) return null;

    const { dimensions } = transformationData;
    const totalProgress = Object.values(dimensions).reduce((sum, val) => sum + val, 0) / 5;

    return (
      <div className="relative w-full h-64 flex items-center justify-center">
        {/* Sacred Geometry Background */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Sacred circles representing wholeness */}
            <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="200" cy="200" r="50" fill="none" stroke="currentColor" strokeWidth="1" />
            
            {/* Fibonacci spiral representing growth */}
            <path d="M200,200 Q250,200 250,150 Q250,100 200,100 Q150,100 150,150 Q150,200 200,200" 
                  fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>

        {/* Khepera Scarab at Center */}
        <div className="relative z-10 text-6xl animate-pulse">
          🪲
        </div>

        {/* Transformation Stages Around Circle */}
        <div className="absolute inset-0">
          {transformationStages.map((stage, index) => {
            const angle = (index / transformationStages.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 120;
            const x = 200 + radius * Math.cos(angle);
            const y = 200 + radius * Math.sin(angle);

            return (
              <div
                key={stage.id}
                className={`absolute w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 cursor-pointer ${
                  stage.active 
                    ? 'bg-amber-500 text-white shadow-lg scale-110' 
                    : 'bg-gray-200 text-gray-500 hover:bg-amber-200'
                }`}
                style={{
                  left: `${(x / 400) * 100}%`,
                  top: `${(y / 400) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleStageTransition(stage.id)}
                title={sacredMode ? stage.sacredMeaning : stage.description}
              >
                <span className="text-xl">{stage.symbol}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Rays */}
        <div className="absolute inset-0 opacity-30">
          {Object.entries(dimensions).map(([dimension, progress], index) => {
            const angle = (index / 5) * 2 * Math.PI - Math.PI / 2;
            const length = 80 + (progress * 40);
            const x2 = 200 + length * Math.cos(angle);
            const y2 = 200 + length * Math.sin(angle);

            return (
              <svg key={dimension} viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
                <line
                  x1="200"
                  y1="200"
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-amber-500"
                  style={{ strokeDasharray: `${progress * 10}, 10` }}
                />
              </svg>
            );
          })}
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Sacred Visualization */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium">Sacred Metamorphosis Journey</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSacredMode(!sacredMode)}
          >
            {sacredMode ? 'Scientific View' : 'Sacred View'}
          </Button>
        </div>
        {renderSacredProgressVisualization()}
      </Card>

      {/* Current Stage Insights */}
      {transformationData && (
        <Card className="p-6">
          <h3 className="text-xl font-medium mb-4">Current Transformation Stage</h3>
          {(() => {
            const currentStage = transformationStages.find(s => s.active);
            if (!currentStage) return null;

            return (
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{currentStage.symbol}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium">{currentStage.name}</h4>
                  <p className="text-gray-600 mb-2">
                    {sacredMode ? currentStage.sacredMeaning : currentStage.description}
                  </p>
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Active Transformations:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(transformationData.dimensions).map(([dimension, progress]) => (
                        <div key={dimension} className="flex items-center space-x-2">
                          <span className="capitalize text-sm">{dimension}:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500">{Math.round(progress * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
          onClick={() => setSelectedView('dimensions')}
        >
          <span className="text-2xl">📊</span>
          <span className="text-sm">Growth Dimensions</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
          onClick={() => setSelectedView('analysis')}
        >
          <span className="text-2xl">🔄</span>
          <span className="text-sm">Before/After</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
          onClick={() => setSelectedView('community')}
        >
          <span className="text-2xl">🌍</span>
          <span className="text-sm">Community</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
          onClick={() => setSelectedView('professional')}
        >
          <span className="text-2xl">🏥</span>
          <span className="text-sm">Professional</span>
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">🪲</div>
          <p className="text-gray-600">Loading your transformation journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Khepera Transformation Tracker</h1>
        <p className="text-gray-600">
          {sacredMode 
            ? "Sacred journey of metamorphosis guided by ancient wisdom" 
            : "Evidence-based transformation tracking with measurable outcomes"
          }
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'overview', label: 'Overview', icon: '🏠' },
          { key: 'dimensions', label: 'Growth Dimensions', icon: '📊' },
          { key: 'analysis', label: 'Writing Analysis', icon: '🔄' },
          { key: 'community', label: 'Community Sharing', icon: '🌍' },
          { key: 'professional', label: 'Professional Tools', icon: '🏥' }
        ].map(({ key, label, icon }) => (
          <Button
            key={key}
            variant={selectedView === key ? 'default' : 'outline'}
            onClick={() => setSelectedView(key as any)}
            className="flex items-center space-x-2"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {selectedView === 'overview' && renderOverview()}
        {selectedView === 'dimensions' && <MultiDimensionalGrowth transformationData={transformationData} sacredMode={sacredMode} />}
        {selectedView === 'analysis' && <BeforeAfterAnalysis userId={user?.uid} sacredMode={sacredMode} />}
        {selectedView === 'community' && <CommunityTransformation userId={user?.uid} />}
        {selectedView === 'professional' && <ProfessionalAssessmentIntegration userId={user?.uid} transformationData={transformationData} />}
      </div>
    </div>
  );
};

export default KheperaTransformationTracker;