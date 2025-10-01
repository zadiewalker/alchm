'use client';

/**
 * ALCHM Therapist Beta Testing Dashboard
 * Professional clinical interface for licensed mental health professionals
 * Features crisis monitoring, AI insight evaluation, and HIPAA-compliant feedback collection
 */

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Brain, 
  FileText, 
  Shield, 
  TrendingUp, 
  Users, 
  Clock,
  Heart,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

// Import our beta testing services
import { MockDataGenerator, MockClientProfile, MockJournalEntry } from '@/beta/mock-data-generator';
import { TherapistFeedbackService, TherapistFeedback, CLINICAL_FEEDBACK_CATEGORIES } from '@/beta/feedback-collection-system';
import { TherapistBetaProfile, LicenseVerificationStatus } from '@/beta/therapist-onboarding';

interface TherapistBetaDashboardProps {
  therapistId: string;
  therapistProfile: TherapistBetaProfile;
}

interface CrisisAlert {
  id: string;
  clientPseudonym: string;
  severity: 'low' | 'moderate' | 'high' | 'imminent';
  timestamp: Date;
  content: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  responseTime?: number;
}

interface AIInsight {
  id: string;
  clientPseudonym: string;
  category: 'therapeutic_breakthrough' | 'risk_indicators' | 'progress_pattern' | 'intervention_suggestion';
  insight: string;
  confidence: number;
  timestamp: Date;
  therapistFeedback?: 'helpful' | 'partially_helpful' | 'not_helpful';
}

interface TestingMetrics {
  totalSessions: number;
  feedbackSubmitted: number;
  crisisScenariosTested: number;
  avgResponseTime: number; // milliseconds
  hipaaComplianceScore: number; // 1-10
  aiInsightAccuracy: number; // percentage
}

export default function TherapistBetaDashboard({ therapistId, therapistProfile }: TherapistBetaDashboardProps) {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'crisis' | 'insights' | 'feedback' | 'training'>('overview');
  const [mockClients, setMockClients] = useState<MockClientProfile[]>([]);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [testingMetrics, setTestingMetrics] = useState<TestingMetrics | null>(null);
  const [feedbackForm, setFeedbackForm] = useState<Partial<TherapistFeedback> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Services
  const mockDataGenerator = MockDataGenerator.getInstance();
  const feedbackService = TherapistFeedbackService.getInstance();

  // Initialize dashboard data
  useEffect(() => {
    initializeDashboard();
  }, [therapistId]);

  const initializeDashboard = async () => {
    try {
      setIsLoading(true);
      
      // Generate mock client cohort
      const clientCohort = mockDataGenerator.generateClientCohort(therapistId, 8);
      setMockClients(clientCohort);
      
      // Generate crisis alerts for testing
      const alerts = generateMockCrisisAlerts(clientCohort);
      setCrisisAlerts(alerts);
      
      // Generate AI insights
      const insights = generateMockAIInsights(clientCohort);
      setAIInsights(insights);
      
      // Load testing metrics
      const metrics = generateMockMetrics();
      setTestingMetrics(metrics);
      
    } catch (error) {
      console.error('Failed to initialize therapist dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockCrisisAlerts = (clients: MockClientProfile[]): CrisisAlert[] => {
    const alerts: CrisisAlert[] = [];
    
    clients.forEach((client, index) => {
      if (Math.random() < 0.4) { // 40% chance of crisis alert per client
        const scenarios = mockDataGenerator.generateCrisisTestingScenarios(client);
        scenarios.forEach((scenario, scenarioIndex) => {
          if (scenario.riskLevel !== 'none' && Math.random() < 0.6) {
            alerts.push({
              id: `alert_${index}_${scenarioIndex}`,
              clientPseudonym: client.pseudonym,
              severity: scenario.riskLevel as any,
              timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
              content: scenario.journalEntry.content.substring(0, 150) + '...',
              status: Math.random() < 0.3 ? 'pending' : 'acknowledged',
              responseTime: Math.random() < 0.7 ? Math.floor(Math.random() * 120 * 60 * 1000) : undefined
            });
          }
        });
      }
    });
    
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const generateMockAIInsights = (clients: MockClientProfile[]): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    clients.forEach((client, index) => {
      // Generate 2-4 insights per client
      const insightCount = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < insightCount; i++) {
        insights.push({
          id: `insight_${index}_${i}`,
          clientPseudonym: client.pseudonym,
          category: ['therapeutic_breakthrough', 'risk_indicators', 'progress_pattern', 'intervention_suggestion'][Math.floor(Math.random() * 4)] as any,
          insight: generateInsightText(client),
          confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
          timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
          therapistFeedback: Math.random() < 0.3 ? undefined : (['helpful', 'partially_helpful', 'not_helpful'][Math.floor(Math.random() * 3)] as any)
        });
      }
    });
    
    return insights.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const generateInsightText = (client: MockClientProfile): string => {
    const insights = [
      `${client.pseudonym} is showing improved coping strategy utilization in recent entries, with a 40% increase in mentions of breathing exercises and mindfulness practices.`,
      `Pattern detected: ${client.pseudonym}'s mood ratings correlate strongly with sleep quality mentions. Consider sleep hygiene intervention.`,
      `${client.pseudonym} demonstrates significant progress in emotional regulation, with fewer crisis-level expressions over the past two weeks.`,
      `AI suggests exploring family dynamics with ${client.pseudonym} - recurring themes of relationship stress may benefit from family therapy approach.`,
      `${client.pseudonym} shows high therapy engagement but may benefit from homework assignments to reinforce session learnings.`
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const generateMockMetrics = (): TestingMetrics => {
    return {
      totalSessions: Math.floor(Math.random() * 50) + 25,
      feedbackSubmitted: Math.floor(Math.random() * 15) + 8,
      crisisScenariosTested: Math.floor(Math.random() * 20) + 10,
      avgResponseTime: Math.floor(Math.random() * 300000) + 120000, // 2-7 minutes
      hipaaComplianceScore: Math.floor(Math.random() * 2) + 8, // 8-10
      aiInsightAccuracy: Math.floor(Math.random() * 20) + 75 // 75-95%
    };
  };

  const handleCrisisAlert = async (alertId: string, action: 'acknowledge' | 'resolve') => {
    setCrisisAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            status: action === 'acknowledge' ? 'acknowledged' : 'resolved',
            responseTime: action === 'acknowledge' ? Date.now() - alert.timestamp.getTime() : alert.responseTime
          }
        : alert
    ));
    
    // Log crisis response for analytics
    console.log(`Crisis alert ${alertId} ${action}d by therapist ${therapistId}`);
  };

  const handleAIInsightFeedback = async (insightId: string, feedback: 'helpful' | 'partially_helpful' | 'not_helpful') => {
    setAIInsights(prev => prev.map(insight =>
      insight.id === insightId
        ? { ...insight, therapistFeedback: feedback }
        : insight
    ));
    
    // Submit feedback to improve AI accuracy
    console.log(`AI insight ${insightId} rated as ${feedback} by therapist ${therapistId}`);
  };

  const submitFeedback = async (feedbackData: Partial<TherapistFeedback>) => {
    try {
      const completeFeedback = {
        ...feedbackData,
        therapistId,
        submittedAt: new Date()
      } as TherapistFeedback;
      
      const result = await feedbackService.submitFeedback(completeFeedback);
      console.log('Feedback submitted successfully:', result);
      
      // Close feedback form
      setFeedbackForm(null);
      
      // Show success message (in a real app, use a toast notification)
      alert('Feedback submitted successfully! Thank you for helping improve ALCHM.');
      
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Loading Therapist Dashboard...</h2>
          <p className="text-gray-600 mt-2">Initializing mock client data and testing scenarios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ALCHM Therapist Beta Dashboard</h1>
              <p className="text-sm text-gray-600">Licensed Professional Testing Environment • Mock Data Only</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{therapistProfile.credentials.firstName} {therapistProfile.credentials.lastName}</p>
                <p className="text-xs text-gray-500">{therapistProfile.credentials.licenseType} • {therapistProfile.credentials.licensingState}</p>
              </div>
              <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Safe Testing
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'clients', label: 'Mock Clients', icon: Users },
              { id: 'crisis', label: 'Crisis Scenarios', icon: AlertTriangle },
              { id: 'insights', label: 'AI Insights', icon: Brain },
              { id: 'feedback', label: 'Feedback', icon: MessageSquare },
              { id: 'training', label: 'Training', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            metrics={testingMetrics} 
            crisisAlerts={crisisAlerts.filter(alert => alert.status === 'pending')}
            aiInsights={aiInsights.filter(insight => !insight.therapistFeedback)}
            clientCount={mockClients.length}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsTab 
            clients={mockClients} 
            onGenerateNewCohort={() => initializeDashboard()}
          />
        )}

        {activeTab === 'crisis' && (
          <CrisisTab 
            alerts={crisisAlerts}
            onHandleAlert={handleCrisisAlert}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsTab 
            insights={aiInsights}
            onProvideFeedback={handleAIInsightFeedback}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackTab 
            onSubmitFeedback={submitFeedback}
          />
        )}

        {activeTab === 'training' && (
          <TrainingTab 
            therapistProfile={therapistProfile}
          />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ 
  metrics, 
  crisisAlerts, 
  aiInsights, 
  clientCount 
}: { 
  metrics: TestingMetrics | null;
  crisisAlerts: CrisisAlert[];
  aiInsights: AIInsight[];
  clientCount: number;
}) {
  if (!metrics) return <div>Loading metrics...</div>;

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Testing Environment:</strong> All client data is synthetic and created specifically for clinical training. 
              No real patient information is present or accessible.
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Mock Clients"
          value={clientCount.toString()}
          subtitle="Assigned for testing"
          icon={Users}
          color="blue"
        />
        
        <MetricCard
          title="Crisis Scenarios"
          value={metrics.crisisScenariosTested.toString()}
          subtitle="Successfully tested"
          icon={AlertTriangle}
          color="red"
        />
        
        <MetricCard
          title="AI Accuracy"
          value={`${metrics.aiInsightAccuracy}%`}
          subtitle="Insight relevance rating"
          icon={Brain}
          color="purple"
        />
        
        <MetricCard
          title="HIPAA Compliance"
          value={`${metrics.hipaaComplianceScore}/10`}
          subtitle="Privacy protection score"
          icon={Shield}
          color="green"
        />
      </div>

      {/* Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            Pending Crisis Alerts ({crisisAlerts.length})
          </h3>
          
          {crisisAlerts.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending crisis alerts</p>
          ) : (
            <div className="space-y-3">
              {crisisAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.clientPseudonym}</p>
                    <p className="text-xs text-gray-500">{alert.content}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      alert.severity === 'imminent' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Brain className="w-5 h-5 text-purple-500 mr-2" />
            AI Insights Awaiting Review ({aiInsights.length})
          </h3>
          
          {aiInsights.length === 0 ? (
            <p className="text-gray-500 text-sm">No insights awaiting review</p>
          ) : (
            <div className="space-y-3">
              {aiInsights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{insight.clientPseudonym}</p>
                    <span className="text-xs text-purple-600">{insight.confidence}% confidence</span>
                  </div>
                  <p className="text-xs text-gray-600">{insight.insight.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Testing Performance Trends</h3>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Performance charts will be displayed here</p>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color 
}: { 
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: 'blue' | 'red' | 'purple' | 'green';
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    red: 'text-red-600 bg-red-100',
    purple: 'text-purple-600 bg-purple-100',
    green: 'text-green-600 bg-green-100'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// Clients Tab Component
function ClientsTab({ 
  clients, 
  onGenerateNewCohort 
}: { 
  clients: MockClientProfile[];
  onGenerateNewCohort: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Mock Client Cohort</h2>
        <button 
          onClick={onGenerateNewCohort}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Generate New Cohort
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.mockClientId} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">{client.pseudonym}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                client.currentRiskLevel === 'imminent' ? 'bg-red-100 text-red-800' :
                client.currentRiskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                client.currentRiskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {client.currentRiskLevel} risk
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Age:</strong> {client.age}</p>
              <p><strong>Primary:</strong> {client.primaryDiagnosis.replace(/_/g, ' ')}</p>
              <p><strong>Treatment:</strong> {client.treatmentModality.replace(/_/g, ' ')}</p>
              <p><strong>Engagement:</strong> {client.engagementLevel}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-xs">
                <span>Mood: {client.currentMoodBaseline}/10</span>
                <span>Anxiety: {client.anxietyLevel}/10</span>
                <span>Function: {11 - client.functionalImpairment}/10</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Crisis Tab Component
function CrisisTab({ 
  alerts, 
  onHandleAlert 
}: { 
  alerts: CrisisAlert[];
  onHandleAlert: (alertId: string, action: 'acknowledge' | 'resolve') => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Crisis Detection Testing</h2>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{alert.clientPseudonym}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    alert.severity === 'imminent' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    alert.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity} severity
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    alert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    alert.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.timestamp.toLocaleString()}</p>
                <p className="text-gray-800">{alert.content}</p>
                {alert.responseTime && (
                  <p className="text-sm text-gray-500 mt-2">
                    Response time: {Math.floor(alert.responseTime / 60000)} minutes
                  </p>
                )}
              </div>
              
              <div className="flex space-x-2">
                {alert.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onHandleAlert(alert.id, 'acknowledge')}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => onHandleAlert(alert.id, 'resolve')}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// AI Insights Tab Component  
function InsightsTab({ 
  insights, 
  onProvideFeedback 
}: { 
  insights: AIInsight[];
  onProvideFeedback: (insightId: string, feedback: 'helpful' | 'partially_helpful' | 'not_helpful') => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">AI Clinical Insights</h2>
      
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{insight.clientPseudonym}</h3>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    {insight.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {insight.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{insight.timestamp.toLocaleString()}</p>
                <p className="text-gray-800">{insight.insight}</p>
              </div>
            </div>
            
            {!insight.therapistFeedback ? (
              <div className="flex space-x-2 pt-4 border-t">
                <p className="text-sm text-gray-600 mr-4">How helpful was this insight?</p>
                <button
                  onClick={() => onProvideFeedback(insight.id, 'helpful')}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200"
                >
                  Helpful
                </button>
                <button
                  onClick={() => onProvideFeedback(insight.id, 'partially_helpful')}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded hover:bg-yellow-200"
                >
                  Partially
                </button>
                <button
                  onClick={() => onProvideFeedback(insight.id, 'not_helpful')}
                  className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200"
                >
                  Not Helpful
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t">
                <span className="text-sm text-gray-500">
                  Rated as: <strong>{insight.therapistFeedback.replace(/_/g, ' ')}</strong>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Feedback Tab Component
function FeedbackTab({ 
  onSubmitFeedback 
}: { 
  onSubmitFeedback: (feedback: Partial<TherapistFeedback>) => void;
}) {
  const [formData, setFormData] = useState({
    category: '',
    context: '',
    priority: '',
    clinicalRelevanceScore: 3,
    title: '',
    description: '',
    featureArea: '',
    overallSatisfaction: 5,
    easeOfUse: 5,
    clinicalValue: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback(formData);
    setFormData({
      category: '',
      context: '',
      priority: '',
      clinicalRelevanceScore: 3,
      title: '',
      description: '',
      featureArea: '',
      overallSatisfaction: 5,
      easeOfUse: 5,
      clinicalValue: 5
    });
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Feedback</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category...</option>
              {CLINICAL_FEEDBACK_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select priority...</option>
              <option value="critical_blocker">Critical Blocker</option>
              <option value="high_impact">High Impact</option>
              <option value="moderate_improvement">Moderate Improvement</option>
              <option value="nice_to_have">Nice to Have</option>
              <option value="future_consideration">Future Consideration</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feedback Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={10}
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={50}
            maxLength={2000}
            placeholder="Please provide detailed feedback including specific examples, context, and professional recommendations..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Satisfaction (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.overallSatisfaction}
              onChange={(e) => setFormData(prev => ({ ...prev, overallSatisfaction: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">{formData.overallSatisfaction}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ease of Use (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.easeOfUse}
              onChange={(e) => setFormData(prev => ({ ...prev, easeOfUse: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">{formData.easeOfUse}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Value (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.clinicalValue}
              onChange={(e) => setFormData(prev => ({ ...prev, clinicalValue: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">{formData.clinicalValue}</div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Professional Feedback
        </button>
      </form>
    </div>
  );
}

// Training Tab Component
function TrainingTab({ 
  therapistProfile 
}: { 
  therapistProfile: TherapistBetaProfile;
}) {
  const trainingModules = [
    {
      id: 'crisis_detection',
      title: 'Crisis Detection & Response',
      description: 'Learn how ALCHM identifies crisis language and triggers appropriate interventions.',
      status: 'completed',
      duration: '30 minutes'
    },
    {
      id: 'ai_insights',
      title: 'AI Clinical Insights Interpretation',
      description: 'Understanding AI-generated insights and their clinical applications.',
      status: 'in_progress',
      duration: '45 minutes'
    },
    {
      id: 'hipaa_compliance',
      title: 'HIPAA Compliance & Data Security',
      description: 'Ensuring patient privacy and regulatory compliance in digital platforms.',
      status: 'not_started',
      duration: '25 minutes'
    },
    {
      id: 'treatment_planning',
      title: 'Digital Treatment Planning Integration',
      description: 'Incorporating ALCHM insights into comprehensive treatment planning.',
      status: 'not_started',
      duration: '40 minutes'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Beta Training Modules</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trainingModules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                module.status === 'completed' ? 'bg-green-100 text-green-800' :
                module.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {module.status.replace('_', ' ')}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{module.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{module.duration}</span>
              <button 
                className={`px-4 py-2 rounded text-sm ${
                  module.status === 'completed' 
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={module.status === 'completed'}
              >
                {module.status === 'completed' ? 'Completed' : 'Start Module'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}