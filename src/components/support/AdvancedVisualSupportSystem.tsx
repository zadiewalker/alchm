'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Camera, 
  Monitor, 
  Terminal, 
  Edit3, 
  Shield, 
  Heart, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Share2,
  RefreshCw,
  Users,
  BookOpen,
  HelpCircle
} from 'lucide-react';

// Import all our visual diagnostic components
import { VisualDiagnosticsSystem } from './VisualDiagnosticsSystem';
import { ScreenRecordingAnalyzer } from './ScreenRecordingAnalyzer';
import { ConsoleLogCollector } from './ConsoleLogCollector';
import { VisualAnnotationEngine } from './VisualAnnotationEngine';
import { TherapeuticVisualFeedback, TherapeuticFeedbackSequence, THERAPEUTIC_PRESETS } from './TherapeuticVisualFeedback';
import { TechnicalSupportChatbot } from './TechnicalSupportChatbot';

// Import analysis utilities
import { ImageAnalyzer, createImageAnalyzer } from '../../lib/visual-analysis/imageAnalyzer';
import { PrivacyManager, createPrivacyManager, createTraumaInformedConsent } from '../../lib/visual-analysis/privacyManager';

interface AdvancedVisualSupportSystemProps {
  traumaInformed?: boolean;
  escalationCallback?: (issue: SupportIssue) => void;
  onSolutionFound?: (solution: ComprehensiveSolution) => void;
  maxSessions?: number;
  autoPrivacyDeletion?: boolean;
}

interface SupportSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  type: 'visual_diagnosis' | 'screen_recording' | 'console_logs' | 'annotation' | 'comprehensive';
  status: 'active' | 'analyzing' | 'complete' | 'escalated';
  data: SupportSessionData;
  privacy: PrivacyRecord;
  results?: AnalysisResults;
  solutions?: ComprehensiveSolution[];
  userSatisfaction?: number;
  followUpNeeded: boolean;
}

interface SupportSessionData {
  screenshots: string[];
  recordings: string[];
  consoleLogs: any;
  annotations: any[];
  userDescription?: string;
  deviceInfo: DeviceInfo;
  browserInfo: BrowserInfo;
}

interface PrivacyRecord {
  consentGiven: boolean;
  consentTimestamp: Date;
  dataRetentionHours: number;
  autoDeleteScheduled: boolean;
  sensitiveDataBlurred: boolean;
  userId?: string;
  sessionId: string;
}

interface DeviceInfo {
  userAgent: string;
  platform: string;
  screenSize: { width: number; height: number };
  mobile: boolean;
  language: string;
  timezone: string;
}

interface BrowserInfo {
  name: string;
  version: string;
  viewport: { width: number; height: number };
  cookies: boolean;
  localStorage: boolean;
  javascript: boolean;
}

interface AnalysisResults {
  imageAnalysis?: any;
  recordingAnalysis?: any;
  logAnalysis?: any;
  annotationAnalysis?: any;
  crossModalInsights: CrossModalInsight[];
  confidenceScore: number;
  recommendedActions: RecommendedAction[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface CrossModalInsight {
  id: string;
  type: 'correlation' | 'contradiction' | 'confirmation' | 'pattern';
  description: string;
  traumaInformedDescription: string;
  evidence: string[];
  confidence: number;
  actionable: boolean;
}

interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  traumaInformedDescription: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'educational' | 'support' | 'escalation';
  steps: ActionStep[];
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requiredTools: string[];
}

interface ActionStep {
  id: string;
  order: number;
  instruction: string;
  traumaInformedInstruction: string;
  type: 'user_action' | 'system_check' | 'verification' | 'support_contact';
  visual?: string;
  annotation?: any;
  estimatedTime: number;
}

interface ComprehensiveSolution {
  id: string;
  title: string;
  description: string;
  traumaInformedDescription: string;
  category: 'immediate_fix' | 'guided_solution' | 'educational_resource' | 'escalation';
  confidence: number;
  effectiveness: number;
  userFriendliness: number;
  steps: SolutionStep[];
  visualGuides: VisualGuide[];
  followUpActions: string[];
  successCriteria: string[];
  traumaInformedSupport: TraumaInformedSupport;
}

interface SolutionStep {
  id: string;
  order: number;
  title: string;
  description: string;
  traumaInformedDescription: string;
  type: 'action' | 'verification' | 'troubleshooting' | 'support';
  visual?: VisualGuide;
  timeEstimate: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  supportAvailable: boolean;
}

interface VisualGuide {
  id: string;
  type: 'screenshot' | 'annotation' | 'video' | 'animation';
  url: string;
  alt: string;
  annotations?: any[];
  traumaInformedCaption: string;
}

interface TraumaInformedSupport {
  encouragementMessages: string[];
  paceGuidance: string;
  safetyReminders: string[];
  celebrationMoments: string[];
  escalationTriggers: string[];
  supportPersonAvailable: boolean;
}

interface SupportIssue {
  id: string;
  sessionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  userImpact: string;
  technicalDetails: any;
  traumaIndicators: string[];
  escalationReason: string;
  urgentResponse: boolean;
}

export function AdvancedVisualSupportSystem({
  traumaInformed = true,
  escalationCallback,
  onSolutionFound,
  maxSessions = 5,
  autoPrivacyDeletion = true
}: AdvancedVisualSupportSystemProps) {
  const [currentSession, setCurrentSession] = useState<SupportSession | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SupportSession[]>([]);
  const [showFeedback, setShowFeedback] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [solutions, setSolutions] = useState<ComprehensiveSolution[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  const [privacyManager] = useState(() => createPrivacyManager({
    traumaInformed,
    autoDeleteEnabled: autoPrivacyDeletion,
    maxRetentionHours: 24
  }));
  const [imageAnalyzer] = useState(() => createImageAnalyzer(traumaInformed));

  // Device and browser detection
  const deviceInfo = useRef<DeviceInfo>({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenSize: { width: screen.width, height: screen.height },
    mobile: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent),
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const browserInfo = useRef<BrowserInfo>({
    name: getBrowserName(),
    version: getBrowserVersion(),
    viewport: { width: window.innerWidth, height: window.innerHeight },
    cookies: navigator.cookieEnabled,
    localStorage: typeof Storage !== 'undefined',
    javascript: true
  });

  // Initialize new support session
  const startNewSession = useCallback((type: SupportSession['type']) => {
    const session: SupportSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      startTime: new Date(),
      type,
      status: 'active',
      data: {
        screenshots: [],
        recordings: [],
        consoleLogs: null,
        annotations: [],
        deviceInfo: deviceInfo.current,
        browserInfo: browserInfo.current
      },
      privacy: {
        consentGiven: false,
        consentTimestamp: new Date(),
        dataRetentionHours: 24,
        autoDeleteScheduled: false,
        sensitiveDataBlurred: true,
        sessionId: `session-${Date.now()}`
      },
      followUpNeeded: false
    };

    setCurrentSession(session);
    setSessions(prev => [...prev.slice(-(maxSessions - 1)), session]);
    
    if (traumaInformed) {
      setShowFeedback({
        feedbackType: 'support',
        message: 'Starting new support session',
        traumaInformedMessage: '💚 Welcome to your safe support space. Take your time and share what feels comfortable.',
        intensity: 'gentle',
        duration: 4000
      });
    }
  }, [maxSessions, traumaInformed]);

  // Handle data collection from various tools
  const handleDiagnosisComplete = useCallback(async (results: any) => {
    if (!currentSession) return;

    try {
      setIsAnalyzing(true);
      
      // Store data with privacy protection
      const consent = createTraumaInformedConsent(['diagnostic', 'analysis'], 24);
      await privacyManager.storeDiagnosticData(
        JSON.stringify(results),
        'screenshot',
        { sessionId: currentSession.id },
        consent
      );

      // Update session data
      setCurrentSession(prev => prev ? {
        ...prev,
        data: { ...prev.data, screenshots: [...prev.data.screenshots, results] },
        status: 'analyzing'
      } : null);

      // Perform comprehensive analysis
      const analysis = await performCrossModalAnalysis([results]);
      setAnalysisResults(analysis);

      // Generate solutions
      const comprehensiveSolutions = await generateComprehensiveSolutions(analysis);
      setSolutions(comprehensiveSolutions);

      if (traumaInformed) {
        setShowFeedback(THERAPEUTIC_PRESETS.analysisComplete);
      }

      onSolutionFound?.(comprehensiveSolutions[0]);

    } catch (error) {
      console.error('Analysis failed:', error);
      
      if (traumaInformed) {
        setShowFeedback({
          feedbackType: 'support',
          message: 'Analysis encountered an issue',
          traumaInformedMessage: '💚 We had trouble analyzing that, but it\'s okay. Let\'s try a different approach together.',
          intensity: 'gentle',
          duration: 4000
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentSession, privacyManager, traumaInformed, onSolutionFound]);

  // Comprehensive cross-modal analysis
  const performCrossModalAnalysis = useCallback(async (allData: any[]): Promise<AnalysisResults> => {
    // Simulate sophisticated AI analysis combining multiple data sources
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockInsights: CrossModalInsight[] = [
      {
        id: 'insight-1',
        type: 'correlation',
        description: 'Visual error matches console error pattern',
        traumaInformedDescription: 'We can see the connection between what you\'re experiencing visually and what\'s happening behind the scenes',
        evidence: ['screenshot-error-area', 'console-log-entry'],
        confidence: 0.87,
        actionable: true
      }
    ];

    const mockActions: RecommendedAction[] = [
      {
        id: 'action-1',
        title: 'Clear Browser Cache',
        description: 'Clear cached data to resolve authentication issues',
        traumaInformedDescription: 'Let\'s clear your browser\'s memory to give you a fresh start',
        priority: 'high',
        category: 'technical',
        steps: [
          {
            id: 'step-1',
            order: 1,
            instruction: 'Press Ctrl+Shift+Delete',
            traumaInformedInstruction: 'Gently press Ctrl+Shift+Delete to open the clear data window',
            type: 'user_action',
            estimatedTime: 30
          }
        ],
        estimatedTime: 2,
        difficulty: 'beginner',
        requiredTools: []
      }
    ];

    return {
      crossModalInsights: mockInsights,
      confidenceScore: 0.85,
      recommendedActions: mockActions,
      urgencyLevel: 'medium'
    };
  }, []);

  // Generate comprehensive solutions
  const generateComprehensiveSolutions = useCallback(async (analysis: AnalysisResults): Promise<ComprehensiveSolution[]> => {
    const solution: ComprehensiveSolution = {
      id: `solution-${Date.now()}`,
      title: traumaInformed ? 'Gentle Step-by-Step Solution' : 'Technical Solution',
      description: 'Comprehensive fix for your technical issue',
      traumaInformedDescription: 'A caring, step-by-step approach to resolve what you\'re experiencing',
      category: 'guided_solution',
      confidence: analysis.confidenceScore,
      effectiveness: 0.9,
      userFriendliness: traumaInformed ? 0.95 : 0.7,
      steps: [
        {
          id: 'step-1',
          order: 1,
          title: 'Clear Browser Data',
          description: 'Remove stored data that may be causing issues',
          traumaInformedDescription: 'Let\'s gently clear your browser\'s stored memory',
          type: 'action',
          timeEstimate: 2,
          difficultyLevel: 'easy',
          supportAvailable: true
        }
      ],
      visualGuides: [],
      followUpActions: ['Verify login works', 'Test key functionality'],
      successCriteria: ['Login successful', 'No error messages visible'],
      traumaInformedSupport: {
        encouragementMessages: [
          'You\'re doing great by working through this',
          'Every step brings you closer to resolution',
          'Your patience with this process shows strength'
        ],
        paceGuidance: 'Take breaks whenever you need them. This isn\'t a race.',
        safetyReminders: [
          'You can stop anytime if this feels overwhelming',
          'Support is always available if you need help'
        ],
        celebrationMoments: [
          'Celebrate each completed step',
          'Acknowledge your problem-solving skills'
        ],
        escalationTriggers: [
          'Continued frustration after 3 attempts',
          'User expresses distress or overwhelm'
        ],
        supportPersonAvailable: true
      }
    };

    return [solution];
  }, [traumaInformed]);

  // Handle session completion
  const completeSession = useCallback(async (satisfaction?: number) => {
    if (!currentSession) return;

    const completedSession: SupportSession = {
      ...currentSession,
      endTime: new Date(),
      status: 'complete',
      results: analysisResults || undefined,
      solutions,
      userSatisfaction: satisfaction
    };

    setCurrentSession(null);
    setSessions(prev => prev.map(s => s.id === completedSession.id ? completedSession : s));
    setActiveTool(null);
    setAnalysisResults(null);
    setSolutions([]);

    if (traumaInformed) {
      setShowFeedback({
        feedbackType: 'celebration',
        message: 'Support session completed successfully',
        traumaInformedMessage: '🎉 You\'ve completed this support journey beautifully. Your dedication to resolving this shows incredible strength.',
        intensity: 'strong',
        duration: 5000
      });
    }
  }, [currentSession, analysisResults, solutions, traumaInformed]);

  // Tool selection interface
  const ToolSelector = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        {
          id: 'screenshot',
          icon: Camera,
          label: traumaInformed ? 'Share Screenshot' : 'Screenshot Analysis',
          description: traumaInformed ? 'Share what you\'re seeing' : 'Upload screenshots for analysis'
        },
        {
          id: 'recording',
          icon: Monitor,
          label: traumaInformed ? 'Screen Recording' : 'Record Screen',
          description: traumaInformed ? 'Show us your experience' : 'Record screen activity'
        },
        {
          id: 'console',
          icon: Terminal,
          label: traumaInformed ? 'Technical Info' : 'Console Logs',
          description: traumaInformed ? 'Gather helpful details' : 'Collect browser logs'
        },
        {
          id: 'annotation',
          icon: Edit3,
          label: traumaInformed ? 'Highlight Issues' : 'Annotate',
          description: traumaInformed ? 'Mark problem areas' : 'Add annotations'
        }
      ].map(tool => (
        <Button
          key={tool.id}
          variant={activeTool === tool.id ? 'default' : 'outline'}
          className={`h-24 flex flex-col items-center gap-2 ${
            activeTool === tool.id ? 'bg-sage-400 text-white' : 'hover:bg-sage-50'
          }`}
          onClick={() => {
            setActiveTool(tool.id);
            if (!currentSession) {
              startNewSession('comprehensive');
            }
          }}
        >
          <tool.icon className="w-6 h-6" />
          <div className="text-center">
            <div className="text-sm font-medium">{tool.label}</div>
            <div className="text-xs opacity-75">{tool.description}</div>
          </div>
        </Button>
      ))}
    </div>
  );

  // Solutions display
  const SolutionsPanel = () => (
    <div className="space-y-4">
      {solutions.map((solution, index) => (
        <Card key={solution.id} className="border-sage-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-sanctuary-gray-800">
                  {solution.title}
                </h3>
                <p className="text-sm text-sanctuary-gray-600">
                  {traumaInformed ? solution.traumaInformedDescription : solution.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-sage-600">
                  {Math.round(solution.confidence * 100)}% confidence
                </div>
                <div className="text-xs text-sanctuary-gray-500">
                  {solution.steps.length} steps • {solution.steps.reduce((acc, step) => acc + step.timeEstimate, 0)} min
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {solution.steps.map((step) => (
                <div key={step.id} className="flex items-start gap-3 p-3 bg-sanctuary-gray-50 rounded">
                  <div className="w-6 h-6 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-xs font-bold">
                    {step.order}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sanctuary-gray-800">{step.title}</h4>
                    <p className="text-sm text-sanctuary-gray-600">
                      {traumaInformed ? step.traumaInformedDescription : step.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-sanctuary-gray-500">
                      <span>⏱️ {step.timeEstimate} min</span>
                      <span className={`px-2 py-1 rounded ${
                        step.difficultyLevel === 'easy' ? 'bg-green-100 text-green-700' :
                        step.difficultyLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {step.difficultyLevel}
                      </span>
                      {step.supportAvailable && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Support available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {traumaInformed && solution.traumaInformedSupport.encouragementMessages.length > 0 && (
              <div className="mt-4 p-3 bg-sage-50 rounded border border-sage-100">
                <h4 className="font-medium text-sage-800 mb-2">💚 Gentle Reminders</h4>
                <ul className="text-sm text-sage-700 space-y-1">
                  {solution.traumaInformedSupport.encouragementMessages.map((message, idx) => (
                    <li key={idx}>• {message}</li>
                  ))}
                </ul>
                <p className="text-xs text-sage-600 mt-2 italic">
                  {solution.traumaInformedSupport.paceGuidance}
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <div className="flex items-center gap-2 text-sm text-sanctuary-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Solution {index + 1} of {solutions.length}</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download Guide
              </Button>
              <Button size="sm" className="bg-sage-400 hover:bg-sage-500 text-white">
                Start Solution
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Therapeutic Feedback */}
      {showFeedback && (
        <TherapeuticVisualFeedback
          {...showFeedback}
          onComplete={() => setShowFeedback(null)}
        />
      )}

      {/* Main Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-400 to-sage-500 flex items-center justify-center shadow-soft">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-sanctuary-gray-800">
                  {traumaInformed ? 'Visual Support Sanctuary' : 'Advanced Visual Diagnostics'}
                </h2>
                <p className="text-sm text-sanctuary-gray-600">
                  {traumaInformed 
                    ? 'A safe space to understand and resolve what you\'re experiencing'
                    : 'Comprehensive screenshot and visual analysis system'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {sessions.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSessionHistory(!showSessionHistory)}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  History ({sessions.length})
                </Button>
              )}
              
              <div className="flex items-center gap-1 text-xs text-sanctuary-gray-500">
                <Shield className="w-3 h-3" />
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!currentSession ? (
            <div className="space-y-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-sanctuary-gray-800 mb-2">
                  {traumaInformed ? 'How can we support you today?' : 'Choose your diagnostic approach'}
                </h3>
                <p className="text-sanctuary-gray-600 mb-6">
                  {traumaInformed 
                    ? 'Select the way that feels most comfortable for sharing your experience'
                    : 'Select the type of visual diagnostic you\'d like to perform'}
                </p>
              </div>
              
              <ToolSelector />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Tool Interface */}
              {activeTool === 'screenshot' && (
                <VisualDiagnosticsSystem
                  onDiagnosisComplete={handleDiagnosisComplete}
                  traumaInformed={traumaInformed}
                />
              )}
              
              {activeTool === 'recording' && (
                <ScreenRecordingAnalyzer
                  onAnalysisComplete={handleDiagnosisComplete}
                  traumaInformed={traumaInformed}
                />
              )}
              
              {activeTool === 'console' && (
                <ConsoleLogCollector
                  onLogsCollected={handleDiagnosisComplete}
                  traumaInformed={traumaInformed}
                />
              )}
              
              {activeTool === 'annotation' && currentSession.data.screenshots.length > 0 && (
                <VisualAnnotationEngine
                  imageUrl={currentSession.data.screenshots[0]}
                  onSolutionGenerated={handleDiagnosisComplete}
                  traumaInformed={traumaInformed}
                />
              )}

              {/* Analysis Status */}
              {isAnalyzing && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="flex items-center gap-3 py-4">
                    <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                    <div>
                      <h4 className="font-medium text-blue-800">
                        {traumaInformed ? 'Understanding your experience...' : 'Analyzing data...'}
                      </h4>
                      <p className="text-sm text-blue-700">
                        {traumaInformed 
                          ? 'We\'re carefully reviewing what you\'ve shared to provide the best support'
                          : 'Processing visual data and generating insights'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Solutions Display */}
          {solutions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sage-600" />
                <h3 className="text-lg font-semibold text-sanctuary-gray-800">
                  {traumaInformed ? 'Your Gentle Solutions' : 'Generated Solutions'}
                </h3>
              </div>
              <SolutionsPanel />
            </div>
          )}
        </CardContent>

        {currentSession && (
          <CardFooter className="flex justify-between">
            <div className="text-sm text-sanctuary-gray-600">
              Session: {currentSession.id.split('-')[1]} • 
              Started: {currentSession.startTime.toLocaleTimeString()}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentSession(null)}
              >
                Cancel Session
              </Button>
              
              {solutions.length > 0 && (
                <Button
                  onClick={() => completeSession(5)}
                  className="bg-sage-400 hover:bg-sage-500 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Complete Session
                </Button>
              )}
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Session History */}
      {showSessionHistory && sessions.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-sanctuary-gray-800">Recent Sessions</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions.slice(-5).reverse().map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium text-sanctuary-gray-800">
                      {session.type.replace('_', ' ').toUpperCase()} Session
                    </div>
                    <div className="text-sm text-sanctuary-gray-600">
                      {session.startTime.toLocaleDateString()} at {session.startTime.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      session.status === 'complete' ? 'bg-green-100 text-green-700' :
                      session.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      session.status === 'analyzing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {session.status}
                    </span>
                    {session.userSatisfaction && (
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-pink-500" />
                        <span className="text-xs text-sanctuary-gray-600">
                          {session.userSatisfaction}/5
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Utility functions
function getBrowserName(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
}

function getBrowserVersion(): string {
  const userAgent = navigator.userAgent;
  const match = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/(\d+)/);
  return match ? match[2] : 'Unknown';
}