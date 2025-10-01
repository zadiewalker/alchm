'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  Download,
  Share,
  Calendar,
  TrendingUp,
  Target,
  Heart,
  Brain,
  Users,
  Shield,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  FileBarChart,
  Archive,
  Printer,
  Mail,
  Link,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Star,
  Lightbulb,
  Bookmark,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  Zap,
  Sparkles,
  Crown
} from 'lucide-react';

interface ProgressMetric {
  id: string;
  category: 'emotional-intelligence' | 'spiritual-growth' | 'community-connection' | 'goal-achievement' | 'crisis-prevention';
  name: string;
  currentValue: number;
  previousValue: number;
  target: number;
  unit: string;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
  significance: 'high' | 'medium' | 'low';
}

interface TherapeuticNote {
  id: string;
  date: string;
  sessionType: 'individual' | 'group' | 'family' | 'self-reflection';
  focus: string[];
  insights: string[];
  progress: string[];
  challenges: string[];
  goals: string[];
  interventions: string[];
  homework: string[];
  mood: number;
  anxiety: number;
  energy: number;
  hopefulness: number;
  therapeuticAlliance: number;
  shareableWithTherapist: boolean;
  confidentialityLevel: 'full-access' | 'summary-only' | 'restricted';
}

interface ProfessionalReport {
  id: string;
  title: string;
  type: 'progress-summary' | 'ei-assessment' | 'crisis-prevention' | 'growth-plan' | 'comprehensive';
  dateRange: { start: string; end: string };
  generatedDate: string;
  sections: {
    executiveSummary: string;
    keyFindings: string[];
    progressMetrics: ProgressMetric[];
    recommendations: string[];
    therapeuticConsiderations: string[];
    attachments: string[];
  };
  accessLevel: 'therapist-ready' | 'educational-use' | 'personal-only';
  shareableLink?: string;
  downloadedBy: string[];
}

interface GoalTracking {
  id: string;
  title: string;
  category: 'therapeutic' | 'personal' | 'spiritual' | 'professional';
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused' | 'discontinued';
  targetDate: string;
  progress: number;
  milestones: {
    id: string;
    title: string;
    completed: boolean;
    completedDate?: string;
    evidence: string[];
  }[];
  barriers: string[];
  supports: string[];
  measurableOutcomes: string[];
  therapeuticAlignment: string;
}

export default function ProfessionalDocumentation() {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'reports' | 'goals' | 'sharing'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([]);
  const [therapeuticNotes, setTherapeuticNotes] = useState<TherapeuticNote[]>([]);
  const [professionalReports, setProfessionalReports] = useState<ProfessionalReport[]>([]);
  const [goalTracking, setGoalTracking] = useState<GoalTracking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Initialize sample data
    setProgressMetrics([
      {
        id: '1',
        category: 'emotional-intelligence',
        name: 'Emotional Regulation Score',
        currentValue: 7.2,
        previousValue: 6.1,
        target: 8.0,
        unit: '/10',
        trend: 'improving',
        lastUpdated: '2024-03-15',
        significance: 'high'
      },
      {
        id: '2',
        category: 'spiritual-growth',
        name: 'Meaning-Making Engagement',
        currentValue: 85,
        previousValue: 78,
        target: 90,
        unit: '%',
        trend: 'improving',
        lastUpdated: '2024-03-14',
        significance: 'high'
      },
      {
        id: '3',
        category: 'crisis-prevention',
        name: 'Early Warning Detection',
        currentValue: 92,
        previousValue: 89,
        target: 95,
        unit: '%',
        trend: 'improving',
        lastUpdated: '2024-03-13',
        significance: 'high'
      },
      {
        id: '4',
        category: 'community-connection',
        name: 'Peer Support Engagement',
        currentValue: 68,
        previousValue: 72,
        target: 80,
        unit: '%',
        trend: 'declining',
        lastUpdated: '2024-03-12',
        significance: 'medium'
      }
    ]);

    setTherapeuticNotes([
      {
        id: '1',
        date: '2024-03-15',
        sessionType: 'self-reflection',
        focus: ['Relationship patterns', 'Boundary setting', 'Self-compassion'],
        insights: [
          'Recognized pattern of people-pleasing in professional relationships',
          'Connected childhood experiences to current boundary challenges',
          'Identified self-compassion as key growth area'
        ],
        progress: [
          'Successfully set boundaries with colleague this week',
          'Used mindfulness technique during difficult conversation',
          'Completed values clarification exercise'
        ],
        challenges: [
          'Still experiencing guilt after setting boundaries',
          'Tendency to over-analyze social interactions',
          'Difficulty with self-forgiveness'
        ],
        goals: [
          'Practice boundary-setting language daily',
          'Complete self-compassion meditation series',
          'Schedule conversation with supervisor about workload'
        ],
        interventions: [
          'Cognitive restructuring for boundary guilt',
          'Self-compassion break practice',
          'Values-based decision making framework'
        ],
        homework: [
          'Practice saying no to one non-essential request',
          'Write self-compassion letter',
          'Track boundary-setting moments in journal'
        ],
        mood: 7,
        anxiety: 4,
        energy: 6,
        hopefulness: 8,
        therapeuticAlliance: 9,
        shareableWithTherapist: true,
        confidentialityLevel: 'full-access'
      },
      {
        id: '2',
        date: '2024-03-08',
        sessionType: 'individual',
        focus: ['Trauma processing', 'Somatic awareness', 'Resource building'],
        insights: [
          'Body holds trauma memories in shoulders and chest',
          'Breathing techniques help regulate nervous system',
          'Safe relationships are crucial for healing'
        ],
        progress: [
          'Able to identify body sensations during stress',
          'Using breathing technique successfully in difficult moments',
          'Feeling more connected to support network'
        ],
        challenges: [
          'Still experiencing nightmares occasionally',
          'Hypervigilance in crowded spaces',
          'Difficulty trusting new people'
        ],
        goals: [
          'Continue somatic awareness practice',
          'Gradually increase social exposure',
          'Develop trauma narrative with therapist'
        ],
        interventions: [
          'Somatic experiencing techniques',
          'Graduated exposure to social situations',
          'Narrative therapy approaches'
        ],
        homework: [
          'Daily body scan meditation',
          'Practice grounding techniques in public spaces',
          'Continue trauma journaling'
        ],
        mood: 6,
        anxiety: 6,
        energy: 5,
        hopefulness: 7,
        therapeuticAlliance: 9,
        shareableWithTherapist: true,
        confidentialityLevel: 'summary-only'
      }
    ]);

    setGoalTracking([
      {
        id: '1',
        title: 'Improve Emotional Regulation Skills',
        category: 'therapeutic',
        priority: 'high',
        status: 'active',
        targetDate: '2024-06-15',
        progress: 72,
        milestones: [
          {
            id: 'm1',
            title: 'Complete mindfulness course',
            completed: true,
            completedDate: '2024-02-28',
            evidence: ['Course certificate', 'Daily practice log']
          },
          {
            id: 'm2',
            title: 'Implement daily emotion tracking',
            completed: true,
            completedDate: '2024-03-01',
            evidence: ['30-day tracking data', 'Pattern analysis']
          },
          {
            id: 'm3',
            title: 'Demonstrate regulation skills in crisis situation',
            completed: false,
            evidence: []
          }
        ],
        barriers: ['Time constraints', 'Perfectionism', 'Self-doubt'],
        supports: ['Therapist guidance', 'Partner encouragement', 'Mindfulness app'],
        measurableOutcomes: [
          'Reduce anxiety episodes from 3/week to 1/week',
          'Increase emotional awareness score by 20%',
          'Successfully navigate 2 difficult conversations using skills'
        ],
        therapeuticAlignment: 'Directly supports DBT skills building and trauma recovery goals'
      },
      {
        id: '2',
        title: 'Develop Spiritual Meaning-Making Practice',
        category: 'spiritual',
        priority: 'medium',
        status: 'active',
        targetDate: '2024-08-01',
        progress: 45,
        milestones: [
          {
            id: 'm1',
            title: 'Explore three spiritual traditions',
            completed: true,
            completedDate: '2024-03-10',
            evidence: ['Tradition research notes', 'Practice experiments']
          },
          {
            id: 'm2',
            title: 'Establish daily contemplative practice',
            completed: false,
            evidence: []
          },
          {
            id: 'm3',
            title: 'Complete sacred narrative project',
            completed: false,
            evidence: []
          }
        ],
        barriers: ['Spiritual confusion', 'Past religious trauma', 'Lack of community'],
        supports: ['Spiritual director', 'Interfaith community', 'Reading group'],
        measurableOutcomes: [
          'Maintain daily practice for 30 consecutive days',
          'Complete meaning-making assessment with 80% clarity',
          'Share spiritual story with trusted friend'
        ],
        therapeuticAlignment: 'Supports meaning-making and post-traumatic growth objectives'
      }
    ]);
  }, []);

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">87%</div>
          <div className="text-sm text-gray-600">Overall Progress</div>
          <div className="text-xs text-green-600 mt-1">↑ 12% this month</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600">7.2</div>
          <div className="text-sm text-gray-600">EI Score</div>
          <div className="text-xs text-blue-600 mt-1">↑ 1.1 improvement</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600">5</div>
          <div className="text-sm text-gray-600">Active Goals</div>
          <div className="text-xs text-purple-600 mt-1">2 near completion</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-yellow-600">92%</div>
          <div className="text-sm text-gray-600">Crisis Prevention</div>
          <div className="text-xs text-yellow-600 mt-1">Excellent early warning</div>
        </Card>
      </div>

      {/* Progress Metrics */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Progress Metrics</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Charts
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {progressMetrics.map((metric) => (
            <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium">{metric.name}</h3>
                  <Badge variant={
                    metric.trend === 'improving' ? 'default' :
                    metric.trend === 'stable' ? 'secondary' : 'destructive'
                  }>
                    {metric.trend}
                  </Badge>
                  {metric.significance === 'high' && (
                    <Star className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Current: <strong>{metric.currentValue}{metric.unit}</strong></span>
                  <span>Previous: {metric.previousValue}{metric.unit}</span>
                  <span>Target: {metric.target}{metric.unit}</span>
                  <span>Updated: {metric.lastUpdated}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {Math.round((metric.currentValue / metric.target) * 100)}%
                </div>
                <div className="text-xs text-gray-500">of target</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <div className="font-medium">Completed EI Assessment</div>
              <div className="text-sm text-gray-600">Advanced level achieved in empathy domain</div>
            </div>
            <div className="text-sm text-gray-500">2 hours ago</div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Target className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <div className="font-medium">Goal Milestone Reached</div>
              <div className="text-sm text-gray-600">Daily mindfulness practice - 30 day streak</div>
            </div>
            <div className="text-sm text-gray-500">1 day ago</div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <div className="flex-1">
              <div className="font-medium">Spiritual Narrative Created</div>
              <div className="text-sm text-gray-600">Phoenix Rising from Heartbreak - integrated Buddhist wisdom</div>
            </div>
            <div className="text-sm text-gray-500">3 days ago</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Therapeutic Notes</h1>
          <p className="text-gray-600">Professional-grade session documentation</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      <div className="grid gap-6">
        {therapeuticNotes.map((note) => (
          <Card key={note.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-semibold">{note.date}</h2>
                  <Badge variant="outline" className="capitalize">
                    {note.sessionType.replace('-', ' ')}
                  </Badge>
                  <Badge variant={
                    note.confidentialityLevel === 'full-access' ? 'default' :
                    note.confidentialityLevel === 'summary-only' ? 'secondary' : 'destructive'
                  }>
                    {note.shareableWithTherapist ? (
                      <><Unlock className="h-3 w-3 mr-1" /> Shareable</>
                    ) : (
                      <><Lock className="h-3 w-3 mr-1" /> Private</>
                    )}
                  </Badge>
                </div>
                
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <span>Focus Areas: {note.focus.join(', ')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Mood Metrics */}
            <div className="grid grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{note.mood}/10</div>
                <div className="text-xs text-gray-600">Mood</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">{note.anxiety}/10</div>
                <div className="text-xs text-gray-600">Anxiety</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{note.energy}/10</div>
                <div className="text-xs text-gray-600">Energy</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600">{note.hopefulness}/10</div>
                <div className="text-xs text-gray-600">Hope</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">{note.therapeuticAlliance}/10</div>
                <div className="text-xs text-gray-600">Alliance</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    Key Insights
                  </h3>
                  <ul className="text-sm space-y-1">
                    {note.insights.slice(0, 2).map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Progress Made
                  </h3>
                  <ul className="text-sm space-y-1">
                    {note.progress.slice(0, 2).map((progress, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                        <span>{progress}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Current Goals
                  </h3>
                  <ul className="text-sm space-y-1">
                    {note.goals.slice(0, 2).map((goal, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    Challenges
                  </h3>
                  <ul className="text-sm space-y-1">
                    {note.challenges.slice(0, 2).map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-3 w-3 text-orange-500 mt-1 flex-shrink-0" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {note.homework.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h3 className="font-medium mb-2">Homework & Practice</h3>
                <div className="text-sm">{note.homework.join(' • ')}</div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Professional Reports</h1>
          <p className="text-gray-600">Therapeutic-grade documentation and progress summaries</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Report Templates */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="font-semibold mb-2">Progress Summary</h3>
          <p className="text-sm text-gray-600 mb-4">
            Comprehensive overview of therapeutic progress and achievements
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Generate Report
          </Button>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Brain className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className="font-semibold mb-2">EI Assessment</h3>
          <p className="text-sm text-gray-600 mb-4">
            Detailed emotional intelligence evaluation with growth recommendations
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Generate Report
          </Button>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h3 className="font-semibold mb-2">Crisis Prevention</h3>
          <p className="text-sm text-gray-600 mb-4">
            Early warning system analysis and prevention strategies
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Generate Report
          </Button>
        </Card>
      </div>

      {/* Sample Report */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Sample Professional Report</h2>
            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
              <span>Generated: March 15, 2024</span>
              <Badge>Therapist-Ready</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm">
              <Link className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-3">Executive Summary</h3>
          <p className="text-gray-700 mb-4">
            Client demonstrates significant progress in emotional regulation and self-awareness over the past 
            30 days. Notable improvements in crisis prevention capabilities (92% early warning detection) and 
            integration of mindfulness practices into daily routine. Continuing work on boundary setting and 
            self-compassion development shows promising trends.
          </p>

          <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
            <li>Emotional Intelligence Score improved from 6.1 to 7.2 (18% increase)</li>
            <li>Crisis prevention system showing 92% accuracy in early warning detection</li>
            <li>Daily mindfulness practice maintained for 30 consecutive days</li>
            <li>Successful implementation of boundary-setting techniques in professional context</li>
            <li>Integration of spiritual meaning-making practices supporting overall resilience</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3">Therapeutic Recommendations</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Continue focus on self-compassion development through targeted interventions</li>
            <li>Explore somatic experiencing techniques for trauma processing</li>
            <li>Maintain current mindfulness practice while exploring additional contemplative approaches</li>
            <li>Consider group therapy component for interpersonal skills development</li>
          </ul>
        </div>
      </Card>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Goal Tracking</h1>
          <p className="text-gray-600">Therapeutic and personal development objectives</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      <div className="grid gap-6">
        {goalTracking.map((goal) => (
          <Card key={goal.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-semibold">{goal.title}</h2>
                  <Badge variant={
                    goal.priority === 'high' ? 'destructive' :
                    goal.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {goal.priority} priority
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {goal.category}
                  </Badge>
                  <Badge variant={
                    goal.status === 'active' ? 'default' :
                    goal.status === 'completed' ? 'secondary' : 'outline'
                  }>
                    {goal.status}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  Target Date: {goal.targetDate} • Progress: {goal.progress}%
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              </div>
            </div>

            {/* Milestones */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Milestones</h3>
              <div className="space-y-2">
                {goal.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {milestone.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{milestone.title}</div>
                      {milestone.completed && milestone.completedDate && (
                        <div className="text-sm text-gray-600">
                          Completed: {milestone.completedDate}
                        </div>
                      )}
                      {milestone.evidence.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Evidence: {milestone.evidence.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">Measurable Outcomes</h3>
                <ul className="text-sm space-y-1">
                  {goal.measurableOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Current Barriers</h3>
                <ul className="text-sm space-y-1">
                  {goal.barriers.map((barrier, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                      <span>{barrier}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Support Systems</h3>
                <ul className="text-sm space-y-1">
                  {goal.supports.map((support, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Users className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>{support}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Therapeutic Alignment</h4>
              <p className="text-sm text-gray-700">{goal.therapeuticAlignment}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSharing = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Professional Sharing & Integration</h1>
        <p className="text-gray-600">
          Securely share your progress with mental health professionals and educational institutions
        </p>
      </div>

      {/* Sharing Options */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold">Therapist Integration</h2>
              <p className="text-sm text-gray-600">Share progress with your mental health provider</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Dr. Sarah Chen - Primary Therapist</span>
              <Badge variant="outline">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Mountain View Counseling Center</span>
              <Badge variant="secondary">Pending</Badge>
            </div>
          </div>

          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Professional
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building className="h-8 w-8 text-green-600" />
            <div>
              <h2 className="text-lg font-semibold">Educational Use</h2>
              <p className="text-sm text-gray-600">Export data for research and academic purposes</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Stanford Psychology Research</span>
              <Badge variant="outline">Authorized</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Personal Academic Record</span>
              <Badge variant="default">Active</Badge>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Research Data
          </Button>
        </Card>
      </div>

      {/* Privacy Controls */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Privacy & Data Control</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Sharing Permissions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Progress metrics</span>
                <Badge variant="default">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Therapeutic notes</span>
                <Badge variant="secondary">Summary Only</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Crisis detection data</span>
                <Badge variant="default">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Spiritual narratives</span>
                <Badge variant="outline">Restricted</Badge>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Data Retention</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Professional reports</span>
                <span className="text-gray-600">7 years</span>
              </div>
              <div className="flex justify-between">
                <span>Session notes</span>
                <span className="text-gray-600">5 years</span>
              </div>
              <div className="flex justify-between">
                <span>Assessment data</span>
                <span className="text-gray-600">Indefinite</span>
              </div>
              <div className="flex justify-between">
                <span>Personal reflections</span>
                <span className="text-gray-600">User controlled</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">HIPAA Compliance</h4>
              <p className="text-sm text-blue-800">
                All shared data meets HIPAA privacy and security standards. You maintain full control 
                over what information is shared and can revoke access at any time.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Professional Documentation</h1>
            <p className="text-gray-600">Therapeutic-grade progress tracking and reporting</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-600">
            <Crown className="h-3 w-3 mr-1" />
            Oracle Tier
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeTab === 'notes' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('notes')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Notes
        </Button>
        <Button
          variant={activeTab === 'reports' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('reports')}
        >
          <FileBarChart className="h-4 w-4 mr-2" />
          Reports
        </Button>
        <Button
          variant={activeTab === 'goals' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('goals')}
        >
          <Target className="h-4 w-4 mr-2" />
          Goals
        </Button>
        <Button
          variant={activeTab === 'sharing' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('sharing')}
        >
          <Share className="h-4 w-4 mr-2" />
          Sharing
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'notes' && renderNotes()}
      {activeTab === 'reports' && renderReports()}
      {activeTab === 'goals' && renderGoals()}
      {activeTab === 'sharing' && renderSharing()}
    </div>
  );
}