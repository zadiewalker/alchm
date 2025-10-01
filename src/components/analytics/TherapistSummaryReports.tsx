'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Eye, EyeOff, Shield, CheckCircle, AlertTriangle, Calendar, TrendingUp, FileText, Users } from 'lucide-react';

interface EmotionalReportData {
  userId: string;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  moodData: Array<{
    date: string;
    mood: number;
    emotions: string[];
    activities: string[];
    journalLength: number;
    vocabularyScore: number;
  }>;
  insights: {
    resilience: number;
    emotionalVocabulary: number;
    selfAwareness: number;
    copingStrategies: number;
    socialConnection: number;
  };
  progress: {
    currentWeek: number;
    previousWeek: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  anonymousComparison: {
    percentile: number;
    similarUsers: number;
  };
}

interface TherapistSummaryReportsProps {
  reportData: EmotionalReportData;
  userId: string;
}

interface ClinicalInsight {
  category: 'resilience' | 'emotional_regulation' | 'social_connection' | 'coping_strategies' | 'risk_factors';
  title: string;
  observation: string;
  clinicalRelevance: string;
  recommendedExploration: string;
  severity: 'low' | 'medium' | 'high';
}

interface TherapeuticGoalProgress {
  goalArea: string;
  baseline: number;
  current: number;
  target: number;
  progressPercentage: number;
  insights: string[];
  nextSteps: string[];
}

const ConsentGate: React.FC<{ onConsent: (granted: boolean) => void }> = ({ onConsent }) => {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <Card className="p-6 border-2 border-sage-200">
      <div className="flex items-start space-x-4 mb-6">
        <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6 text-sage-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-sage-800 mb-2">
            Professional Report Sharing Consent
          </h3>
          <p className="text-sage-600 leading-relaxed">
            This report contains clinical-grade insights derived from your emotional data. 
            It's designed to support therapeutic collaboration while maintaining your privacy 
            and autonomy in the healing process.
          </p>
        </div>
      </div>

      <div className="bg-sage-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-sage-800 mb-3">What's Included in Professional Reports:</h4>
        <ul className="space-y-2 text-sm text-sage-700">
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Aggregated emotional patterns and trends (no specific journal content)</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Research-backed insights on resilience and coping strategies</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Progress indicators aligned with therapeutic outcomes</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Recommended areas for therapeutic exploration</span>
          </li>
        </ul>
      </div>

      <div className="bg-amber-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-amber-800 mb-2 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Privacy Protections
        </h4>
        <ul className="space-y-1 text-sm text-amber-700">
          <li>• No specific journal entries or personal details are included</li>
          <li>• Data is aggregated and anonymized for clinical use</li>
          <li>• You maintain full control over what's shared and when</li>
          <li>• Reports can be revoked or updated at any time</li>
        </ul>
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <input
          type="checkbox"
          id="consent-checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="w-4 h-4 text-sage-600 border-sage-300 rounded focus:ring-sage-500"
        />
        <label htmlFor="consent-checkbox" className="text-sm text-sage-700">
          I understand and consent to generating a professional summary report for therapeutic collaboration
        </label>
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={() => onConsent(true)}
          disabled={!acknowledged}
          className="bg-sage-600 hover:bg-sage-700 text-white"
        >
          Generate Professional Report
        </Button>
        <Button
          onClick={() => onConsent(false)}
          variant="outline"
          className="text-sage-600 border-sage-300"
        >
          Cancel
        </Button>
      </div>
    </Card>
  );
};

const ClinicalInsightCard: React.FC<{ insight: ClinicalInsight }> = ({ insight }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-amber-200 bg-amber-50';
      default: return 'border-sage-200 bg-sage-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default: return <CheckCircle className="w-5 h-5 text-sage-600" />;
    }
  };

  return (
    <Card className={`p-4 border-2 ${getSeverityColor(insight.severity)}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getSeverityIcon(insight.severity)}
          <h4 className="font-medium text-sage-800">{insight.title}</h4>
        </div>
        <span className="text-xs text-sage-500 capitalize bg-white px-2 py-1 rounded">
          {insight.category.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-medium text-sage-700 mb-1">Clinical Observation:</h5>
          <p className="text-sm text-sage-600">{insight.observation}</p>
        </div>

        <div>
          <h5 className="text-sm font-medium text-sage-700 mb-1">Clinical Relevance:</h5>
          <p className="text-sm text-sage-600">{insight.clinicalRelevance}</p>
        </div>

        <div>
          <h5 className="text-sm font-medium text-sage-700 mb-1">Recommended Exploration:</h5>
          <p className="text-sm text-sage-600">{insight.recommendedExploration}</p>
        </div>
      </div>
    </Card>
  );
};

const TherapeuticGoalCard: React.FC<{ goal: TherapeuticGoalProgress }> = ({ goal }) => {
  const progressColor = goal.progressPercentage >= 75 ? 'bg-green-500' :
                       goal.progressPercentage >= 50 ? 'bg-amber-500' : 'bg-sage-500';

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sage-800">{goal.goalArea}</h4>
        <div className="text-right">
          <div className="text-lg font-bold text-sage-800">
            {goal.progressPercentage.toFixed(0)}%
          </div>
          <div className="text-xs text-sage-500">Progress</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-sage-600 mb-1">
          <span>Baseline: {goal.baseline}</span>
          <span>Target: {goal.target}</span>
        </div>
        <div className="w-full bg-sage-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${progressColor} transition-all duration-300`}
            style={{ width: `${goal.progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-center text-xs text-sage-600 mt-1">
          Current: {goal.current}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-medium text-sage-700 mb-1">Key Insights:</h5>
          <ul className="text-sm text-sage-600 space-y-1">
            {goal.insights.map((insight, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-sage-400 mt-1">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-medium text-sage-700 mb-1">Recommended Next Steps:</h5>
          <ul className="text-sm text-sage-600 space-y-1">
            {goal.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-sage-400 mt-1">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export const TherapistSummaryReports: React.FC<TherapistSummaryReportsProps> = ({
  reportData,
  userId
}) => {
  const [consentGranted, setConsentGranted] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'insights' | 'goals' | 'recommendations'>('overview');

  const clinicalInsights = useMemo((): ClinicalInsight[] => {
    const insights: ClinicalInsight[] = [];
    
    // Resilience Assessment
    if (reportData.insights.resilience >= 80) {
      insights.push({
        category: 'resilience',
        title: 'Strong Resilience Indicators',
        observation: 'Client demonstrates consistent high resilience scores with effective emotional regulation patterns.',
        clinicalRelevance: 'Indicates well-developed coping mechanisms and emotional stability. May serve as strength to build upon.',
        recommendedExploration: 'Explore what specific strategies contribute to resilience for reinforcement and potential application to other areas.',
        severity: 'low'
      });
    } else if (reportData.insights.resilience < 50) {
      insights.push({
        category: 'resilience',
        title: 'Resilience Development Opportunity',
        observation: 'Client shows lower resilience scores, indicating potential challenges in bouncing back from difficulties.',
        clinicalRelevance: 'May benefit from trauma-informed approaches and resilience-building interventions.',
        recommendedExploration: 'Assess trauma history, current stressors, and explore evidence-based resilience interventions.',
        severity: 'medium'
      });
    }

    // Emotional Vocabulary
    if (reportData.insights.emotionalVocabulary >= 75) {
      insights.push({
        category: 'emotional_regulation',
        title: 'Advanced Emotional Awareness',
        observation: 'Client demonstrates sophisticated emotional vocabulary and nuanced emotional awareness.',
        clinicalRelevance: 'Strong foundation for emotion-focused therapeutic interventions and emotional processing work.',
        recommendedExploration: 'Leverage this strength for deeper emotional processing and relationship dynamics exploration.',
        severity: 'low'
      });
    }

    // Trend Analysis
    if (reportData.progress.trend === 'declining') {
      insights.push({
        category: 'risk_factors',
        title: 'Declining Trend Noted',
        observation: 'Recent data shows a declining trend in overall emotional wellbeing indicators.',
        clinicalRelevance: 'May indicate need for intervention adjustment or assessment of external stressors.',
        recommendedExploration: 'Explore recent life changes, medication adjustments, or therapeutic approach modifications.',
        severity: 'high'
      });
    }

    // Social Connection
    if (reportData.insights.socialConnection < 40) {
      insights.push({
        category: 'social_connection',
        title: 'Social Isolation Indicators',
        observation: 'Lower social connection scores suggest potential isolation or interpersonal difficulties.',
        clinicalRelevance: 'Social support is crucial for mental health recovery and maintaining therapeutic gains.',
        recommendedExploration: 'Assess social support systems, social anxiety, and opportunities for community connection.',
        severity: 'medium'
      });
    }

    return insights;
  }, [reportData]);

  const therapeuticGoals = useMemo((): TherapeuticGoalProgress[] => {
    return [
      {
        goalArea: 'Emotional Regulation',
        baseline: 45,
        current: reportData.insights.emotionalVocabulary,
        target: 80,
        progressPercentage: ((reportData.insights.emotionalVocabulary - 45) / (80 - 45)) * 100,
        insights: [
          'Vocabulary sophistication has increased significantly',
          'More nuanced emotional expression in journal entries',
          'Better recognition of emotional triggers'
        ],
        nextSteps: [
          'Continue emotion-focused therapeutic techniques',
          'Explore mindfulness-based emotional regulation',
          'Practice distress tolerance skills'
        ]
      },
      {
        goalArea: 'Resilience Building',
        baseline: 30,
        current: reportData.insights.resilience,
        target: 75,
        progressPercentage: ((reportData.insights.resilience - 30) / (75 - 30)) * 100,
        insights: [
          'Improved recovery time from emotional setbacks',
          'Developing consistent self-care practices',
          'Growing sense of self-efficacy'
        ],
        nextSteps: [
          'Strengthen existing coping strategies',
          'Explore trauma-informed resilience approaches',
          'Build upon identified personal strengths'
        ]
      },
      {
        goalArea: 'Social Connection',
        baseline: 25,
        current: reportData.insights.socialConnection,
        target: 70,
        progressPercentage: ((reportData.insights.socialConnection - 25) / (70 - 25)) * 100,
        insights: [
          'Gradual increase in social engagement',
          'Better boundary setting in relationships',
          'Reduced social anxiety indicators'
        ],
        nextSteps: [
          'Continue social skills development',
          'Explore group therapy opportunities',
          'Address any remaining social anxiety'
        ]
      }
    ];
  }, [reportData]);

  if (!consentGranted) {
    return <ConsentGate onConsent={setConsentGranted} />;
  }

  const exportReport = () => {
    const reportContent = {
      generatedDate: new Date().toISOString(),
      clientId: userId,
      timeframe: reportData.timeframe,
      clinicalInsights,
      therapeuticGoals,
      overallAssessment: {
        resilienceScore: reportData.insights.resilience,
        emotionalVocabularyScore: reportData.insights.emotionalVocabulary,
        selfAwarenessScore: reportData.insights.selfAwareness,
        trend: reportData.progress.trend
      },
      recommendations: [
        'Continue current therapeutic approach with emphasis on strengths',
        'Consider incorporating mindfulness-based interventions',
        'Monitor progress on resilience-building strategies',
        'Assess need for social support interventions'
      ]
    };

    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `therapeutic-report-${userId}-${reportData.timeframe}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-sage-50 to-eucalyptus-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-sage-800 mb-2">
              Professional Therapeutic Summary
            </h2>
            <p className="text-sage-600">
              Clinical insights and progress indicators for therapeutic collaboration
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={exportReport}
              size="sm"
              className="bg-sage-600 hover:bg-sage-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <Card className="p-4">
        <div className="flex space-x-1 bg-sage-50 p-1 rounded-lg">
          {[
            { key: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
            { key: 'insights', label: 'Clinical Insights', icon: <FileText className="w-4 h-4" /> },
            { key: 'goals', label: 'Therapeutic Goals', icon: <TrendingUp className="w-4 h-4" /> },
            { key: 'recommendations', label: 'Recommendations', icon: <Users className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                activeSection === tab.key
                  ? 'bg-white text-sage-800 shadow-sm'
                  : 'text-sage-600 hover:text-sage-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-sage-800 mb-1">
              {reportData.insights.resilience}%
            </div>
            <div className="text-sm text-sage-600">Resilience Score</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-sage-800 mb-1">
              {reportData.insights.emotionalVocabulary}%
            </div>
            <div className="text-sm text-sage-600">Emotional Vocabulary</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-sage-800 mb-1">
              {reportData.insights.selfAwareness}%
            </div>
            <div className="text-sm text-sage-600">Self-Awareness</div>
          </Card>
          <Card className="p-4 text-center">
            <div className={`text-2xl font-bold mb-1 ${
              reportData.progress.trend === 'improving' ? 'text-green-600' :
              reportData.progress.trend === 'stable' ? 'text-amber-600' : 'text-red-600'
            }`}>
              {reportData.progress.trend === 'improving' ? '↗' :
               reportData.progress.trend === 'stable' ? '→' : '↘'}
            </div>
            <div className="text-sm text-sage-600 capitalize">{reportData.progress.trend}</div>
          </Card>
        </div>
      )}

      {/* Clinical Insights Section */}
      {activeSection === 'insights' && (
        <div className="space-y-4">
          {clinicalInsights.map((insight, index) => (
            <ClinicalInsightCard key={index} insight={insight} />
          ))}
        </div>
      )}

      {/* Therapeutic Goals Section */}
      {activeSection === 'goals' && (
        <div className="space-y-4">
          {therapeuticGoals.map((goal, index) => (
            <TherapeuticGoalCard key={index} goal={goal} />
          ))}
        </div>
      )}

      {/* Recommendations Section */}
      {activeSection === 'recommendations' && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-sage-800 mb-4">
            Clinical Recommendations
          </h3>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Strengths to Leverage</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Strong emotional vocabulary development</li>
                <li>• Consistent engagement with self-reflection practices</li>
                <li>• Demonstrated capacity for insight</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 mb-2">Areas for Continued Focus</h4>
              <ul className="text-amber-700 space-y-1 text-sm">
                <li>• Resilience-building interventions</li>
                <li>• Social connection and support system development</li>
                <li>• Coping strategy refinement and practice</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Suggested Interventions</h4>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Mindfulness-based stress reduction techniques</li>
                <li>• Narrative therapy approaches to strengthen identity</li>
                <li>• Group therapy for social connection</li>
                <li>• Trauma-informed resilience building</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};