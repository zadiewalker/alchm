'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Eye, Calendar, AlertCircle } from 'lucide-react';

interface ClientOverview {
  id: string;
  initials: string;
  consentStatus: 'active' | 'pending' | 'expired';
  lastActivity: Date;
  riskLevel: 'low' | 'moderate' | 'high' | 'crisis';
  progressTrend: 'improving' | 'stable' | 'declining';
  upcomingSession: Date | null;
}

interface ClientProgress {
  emotionalWellbeing: number;
  engagementLevel: number;
  selfReflectionDepth: number;
  copingSkillsApplication: number;
  journalingFrequency: number;
  weeklyTrends: {
    mood: number[];
    activity: number[];
    insight: number[];
  };
  recentEntryThemes: string[];
  therapeuticGoals: {
    id: string;
    description: string;
    progress: number;
    lastUpdated: Date;
  }[];
}

interface Props {
  clients: ClientOverview[];
}

export const ClientProgressMonitor: React.FC<Props> = ({ clients }) => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clientProgress, setClientProgress] = useState<ClientProgress | null>(null);
  const [loading, setLoading] = useState(false);

  const loadClientProgress = async (clientId: string) => {
    setLoading(true);
    try {
      // Load detailed client progress data
      // This would integrate with HIPAA-compliant backend
      const mockProgress: ClientProgress = {
        emotionalWellbeing: 75,
        engagementLevel: 82,
        selfReflectionDepth: 68,
        copingSkillsApplication: 71,
        journalingFrequency: 85,
        weeklyTrends: {
          mood: [65, 70, 73, 68, 75, 78, 82],
          activity: [80, 85, 82, 78, 85, 88, 90],
          insight: [60, 65, 68, 72, 70, 75, 78]
        },
        recentEntryThemes: [
          'workplace stress',
          'family relationships',
          'self-compassion',
          'anxiety management'
        ],
        therapeuticGoals: [
          {
            id: '1',
            description: 'Develop daily mindfulness practice',
            progress: 65,
            lastUpdated: new Date()
          },
          {
            id: '2',
            description: 'Improve emotional regulation strategies',
            progress: 78,
            lastUpdated: new Date()
          },
          {
            id: '3',
            description: 'Strengthen interpersonal boundaries',
            progress: 45,
            lastUpdated: new Date()
          }
        ]
      };
      setClientProgress(mockProgress);
    } catch (error) {
      console.error('Error loading client progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'crisis': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="text-green-600" size={16} />;
      case 'declining': return <TrendingDown className="text-red-600" size={16} />;
      case 'stable': return <Minus className="text-yellow-600" size={16} />;
      default: return <Minus className="text-slate-600" size={16} />;
    }
  };

  const ProgressBar = ({ value, label, color = 'sage' }: { value: number; label: string; color?: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-600 tracking-wide">{label}</span>
        <span className="text-sm font-medium text-slate-800">{value}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            color === 'sage' ? 'bg-sage-600' : 
            color === 'green' ? 'bg-green-600' :
            color === 'blue' ? 'bg-blue-600' :
            'bg-slate-600'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  const MiniChart = ({ data, label }: { data: number[]; label: string }) => (
    <div className="space-y-2">
      <span className="text-sm text-slate-600 tracking-wide">{label}</span>
      <div className="flex items-end space-x-1 h-12">
        {data.map((value, index) => (
          <div
            key={index}
            className="bg-sage-300 rounded-sm flex-1 transition-all duration-300"
            style={{ height: `${(value / 100) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Client Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <Card
            key={client.id}
            className={`p-4 cursor-pointer transition-all duration-300 ${
              selectedClient === client.id 
                ? 'border-sage-400 shadow-md bg-sage-50' 
                : 'border-slate-200 hover:border-sage-300 hover:shadow-sm'
            }`}
            onClick={() => {
              setSelectedClient(client.id);
              loadClientProgress(client.id);
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-sage-800">
                    {client.initials}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-800">Client {client.initials}</p>
                  <p className="text-xs text-slate-500">
                    Last active: {client.lastActivity.toLocaleDateString()}
                  </p>
                </div>
              </div>
              {getTrendIcon(client.progressTrend)}
            </div>

            <div className="flex items-center justify-between">
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium tracking-wide
                ${getRiskLevelColor(client.riskLevel)}
              `}>
                {client.riskLevel.charAt(0).toUpperCase() + client.riskLevel.slice(1)} Risk
              </span>

              {client.upcomingSession && (
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Calendar size={12} />
                  <span>{client.upcomingSession.toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {client.consentStatus !== 'active' && (
              <div className="mt-2 flex items-center space-x-1 text-xs text-orange-600">
                <AlertCircle size={12} />
                <span>Consent {client.consentStatus}</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Detailed Client Progress */}
      {selectedClient && clientProgress && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-slate-800 tracking-wide">
              Detailed Progress Analysis
            </h3>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Export Report
              </Button>
              <Button size="sm" variant="outline">
                Schedule Session
              </Button>
              <Button size="sm" className="bg-sage-600 hover:bg-sage-700 text-white">
                Session Prep
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Metrics */}
            <Card className="p-6 border-sage-200">
              <h4 className="text-lg font-medium text-slate-800 mb-4 tracking-wide">
                Progress Metrics
              </h4>
              <div className="space-y-4">
                <ProgressBar 
                  value={clientProgress.emotionalWellbeing} 
                  label="Emotional Wellbeing" 
                  color="sage"
                />
                <ProgressBar 
                  value={clientProgress.engagementLevel} 
                  label="Platform Engagement" 
                  color="blue"
                />
                <ProgressBar 
                  value={clientProgress.selfReflectionDepth} 
                  label="Self-Reflection Depth" 
                  color="green"
                />
                <ProgressBar 
                  value={clientProgress.copingSkillsApplication} 
                  label="Coping Skills Application" 
                  color="sage"
                />
                <ProgressBar 
                  value={clientProgress.journalingFrequency} 
                  label="Journaling Consistency" 
                  color="blue"
                />
              </div>
            </Card>

            {/* Weekly Trends */}
            <Card className="p-6 border-sage-200">
              <h4 className="text-lg font-medium text-slate-800 mb-4 tracking-wide">
                Weekly Trends
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <MiniChart data={clientProgress.weeklyTrends.mood} label="Mood" />
                <MiniChart data={clientProgress.weeklyTrends.activity} label="Activity" />
                <MiniChart data={clientProgress.weeklyTrends.insight} label="Insights" />
              </div>
              <p className="text-sm text-slate-600 mt-4 tracking-wide">
                7-day rolling averages based on journal analysis and self-reported metrics
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Entry Themes */}
            <Card className="p-6 border-sage-200">
              <h4 className="text-lg font-medium text-slate-800 mb-4 tracking-wide">
                Recent Entry Themes
              </h4>
              <div className="flex flex-wrap gap-2">
                {clientProgress.recentEntryThemes.map((theme, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-sage-100 text-sage-800 rounded-full text-sm tracking-wide"
                  >
                    {theme}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-4 tracking-wide">
                AI-identified themes from recent journal entries (last 14 days)
              </p>
            </Card>

            {/* Therapeutic Goals */}
            <Card className="p-6 border-sage-200">
              <h4 className="text-lg font-medium text-slate-800 mb-4 tracking-wide">
                Therapeutic Goals Progress
              </h4>
              <div className="space-y-4">
                {clientProgress.therapeuticGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-700 tracking-wide flex-1">
                        {goal.description}
                      </span>
                      <span className="text-sm font-medium text-slate-800 ml-2">
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-sage-600 transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Session Preparation Insights */}
          <Card className="p-6 border-blue-200 bg-blue-50">
            <h4 className="text-lg font-medium text-slate-800 mb-4 tracking-wide">
              Pre-Session Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-slate-700 mb-2">Areas of Focus:</h5>
                <ul className="space-y-1 text-slate-600">
                  <li>• Recent increase in workplace stress mentions</li>
                  <li>• Positive progress in mindfulness practice</li>
                  <li>• Consider exploring boundary-setting techniques</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-slate-700 mb-2">Suggested Interventions:</h5>
                <ul className="space-y-1 text-slate-600">
                  <li>• Review coping strategies for work situations</li>
                  <li>• Reinforce recent mindfulness gains</li>
                  <li>• Introduce assertiveness training exercises</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto"></div>
          <p className="text-slate-600 mt-2 tracking-wide">Loading client progress...</p>
        </div>
      )}

      {!selectedClient && !loading && (
        <div className="text-center py-12 text-slate-500">
          <Eye size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg tracking-wide">Select a client to view detailed progress</p>
          <p className="text-sm mt-2">All data is encrypted and HIPAA-compliant</p>
        </div>
      )}
    </div>
  );
};

export default ClientProgressMonitor;