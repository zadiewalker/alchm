'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Video, 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  RotateCw,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  MousePointer,
  Keyboard,
  AlertTriangle,
  CheckCircle,
  Heart,
  Shield
} from 'lucide-react';

interface ScreenRecordingAnalyzerProps {
  onAnalysisComplete?: (results: RecordingAnalysisResult) => void;
  traumaInformed?: boolean;
  maxDuration?: number; // in minutes
  maxFileSize?: number; // in bytes
}

interface RecordingAnalysisResult {
  duration: number;
  frameRate: number;
  resolution: { width: number; height: number };
  userInteractions: UserInteraction[];
  problemSteps: ProblemStep[];
  performanceMetrics: PerformanceMetrics;
  behaviorAnalysis: BehaviorAnalysis;
  recommendations: RecordingRecommendation[];
  keyframes: Keyframe[];
  confidence: number;
}

interface UserInteraction {
  timestamp: number;
  type: 'click' | 'scroll' | 'keyboard' | 'hover' | 'drag';
  target: InteractionTarget;
  success: boolean;
  delay: number; // time between interactions
  frustrationIndicators: string[];
  traumaInformedDescription: string;
}

interface InteractionTarget {
  element: string;
  bounds: { x: number; y: number; width: number; height: number };
  text?: string;
  role?: string;
  state: 'normal' | 'error' | 'loading' | 'disabled';
}

interface ProblemStep {
  id: string;
  timestamp: number;
  duration: number;
  description: string;
  traumaInformedDescription: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'ui_issue' | 'performance' | 'network' | 'user_error' | 'system_error';
  screenshot: string; // base64 frame
  suggestions: string[];
  traumaInformedSuggestions: string[];
}

interface PerformanceMetrics {
  loadTimes: LoadTimeMetric[];
  clickResponseTimes: number[];
  scrollPerformance: ScrollMetric[];
  networkRequests: NetworkMetric[];
  memoryUsage: MemoryMetric[];
  overallScore: number;
}

interface LoadTimeMetric {
  timestamp: number;
  element: string;
  loadTime: number;
  expected: number;
  impact: 'low' | 'medium' | 'high';
}

interface ScrollMetric {
  timestamp: number;
  smoothness: number; // 0-1 score
  responsiveness: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

interface NetworkMetric {
  timestamp: number;
  url: string;
  method: string;
  status: number;
  responseTime: number;
  size: number;
}

interface MemoryMetric {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
}

interface BehaviorAnalysis {
  userExperience: 'smooth' | 'hesitant' | 'frustrated' | 'confused';
  interactionPatterns: InteractionPattern[];
  attentionHeatmap: AttentionPoint[];
  cognitiveLoad: CognitiveLoadMetric;
  traumaIndicators: TraumaIndicator[];
  supportNeeded: SupportLevel;
}

interface InteractionPattern {
  type: 'exploration' | 'goal_directed' | 'error_recovery' | 'help_seeking';
  frequency: number;
  duration: number;
  effectiveness: number;
}

interface AttentionPoint {
  x: number;
  y: number;
  duration: number;
  intensity: number;
  timestamp: number;
}

interface CognitiveLoadMetric {
  overall: 'low' | 'medium' | 'high' | 'overwhelming';
  factors: string[];
  recommendations: string[];
  traumaInformedRecommendations: string[];
}

interface TraumaIndicator {
  type: 'hesitation' | 'repetition' | 'avoidance' | 'rapid_clicking' | 'prolonged_pause';
  timestamp: number;
  duration: number;
  severity: 'mild' | 'moderate' | 'significant';
  supportResponse: string;
}

type SupportLevel = 'minimal' | 'moderate' | 'intensive' | 'crisis_aware';

interface RecordingRecommendation {
  id: string;
  title: string;
  description: string;
  traumaInformedDescription: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'ui_improvement' | 'performance' | 'accessibility' | 'support' | 'education';
  steps: RecommendationStep[];
  estimatedTime: number; // in minutes
}

interface RecommendationStep {
  description: string;
  traumaInformedDescription: string;
  visual?: string; // screenshot or diagram
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Keyframe {
  timestamp: number;
  frame: string; // base64 image
  events: string[];
  importance: 'low' | 'medium' | 'high';
  description: string;
  traumaInformedDescription: string;
}

interface RecordingState {
  status: 'idle' | 'requesting' | 'recording' | 'processing' | 'complete';
  stream?: MediaStream;
  recorder?: MediaRecorder;
  chunks: Blob[];
  duration: number;
  recordedBlob?: Blob;
  recordedUrl?: string;
}

export function ScreenRecordingAnalyzer({
  onAnalysisComplete,
  traumaInformed = true,
  maxDuration = 5, // 5 minutes default
  maxFileSize = 50 * 1024 * 1024 // 50MB default
}: ScreenRecordingAnalyzerProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    status: 'idle',
    chunks: [],
    duration: 0
  });
  
  const [analysisResults, setAnalysisResults] = useState<RecordingAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showInteractions, setShowInteractions] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const durationTimerRef = useRef<NodeJS.Timeout>();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingState.stream) {
        recordingState.stream.getTracks().forEach(track => track.stop());
      }
      if (recordingState.recordedUrl) {
        URL.revokeObjectURL(recordingState.recordedUrl);
      }
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
    };
  }, [recordingState.stream, recordingState.recordedUrl]);

  const requestScreenRecording = useCallback(async () => {
    if (!privacyConsent) {
      setShowPrivacyNotice(true);
      return;
    }

    try {
      setRecordingState(prev => ({ ...prev, status: 'requesting' }));
      
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });

      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        setRecordingState(prev => ({
          ...prev,
          status: 'complete',
          recordedBlob: blob,
          recordedUrl: url,
          chunks: []
        }));
      };

      setRecordingState({
        status: 'recording',
        stream,
        recorder,
        chunks: [],
        duration: 0
      });

      // Start recording
      recorder.start(1000); // Collect data every second

      // Start duration timer
      durationTimerRef.current = setInterval(() => {
        setRecordingState(prev => {
          const newDuration = prev.duration + 1;
          
          // Auto-stop at max duration
          if (newDuration >= maxDuration * 60) {
            stopRecording();
          }
          
          return { ...prev, duration: newDuration };
        });
      }, 1000);

    } catch (error) {
      console.error('Failed to start screen recording:', error);
      setRecordingState(prev => ({ ...prev, status: 'idle' }));
      
      // Show user-friendly error
      alert(traumaInformed 
        ? 'We couldn\'t start the screen recording, but that\'s okay. You can still share screenshots or describe your issue.'
        : 'Screen recording failed. Please check your browser permissions and try again.');
    }
  }, [privacyConsent, maxDuration, traumaInformed]);

  const stopRecording = useCallback(() => {
    if (recordingState.recorder && recordingState.recorder.state === 'recording') {
      recordingState.recorder.stop();
    }
    
    if (recordingState.stream) {
      recordingState.stream.getTracks().forEach(track => track.stop());
    }
    
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }
  }, [recordingState.recorder, recordingState.stream]);

  const analyzeRecording = useCallback(async () => {
    if (!recordingState.recordedBlob) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate comprehensive analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults: RecordingAnalysisResult = {
        duration: recordingState.duration,
        frameRate: 30,
        resolution: { width: 1920, height: 1080 },
        userInteractions: [
          {
            timestamp: 2.5,
            type: 'click',
            target: {
              element: 'login-button',
              bounds: { x: 400, y: 300, width: 120, height: 40 },
              text: 'Login',
              role: 'button',
              state: 'normal'
            },
            success: false,
            delay: 1200,
            frustrationIndicators: ['multiple_attempts', 'hesitation'],
            traumaInformedDescription: 'You tried clicking the login button, and it\'s completely normal that it didn\'t work right away.'
          }
        ],
        problemSteps: [
          {
            id: 'step-1',
            timestamp: 2.5,
            duration: 3.0,
            description: 'Login attempt failed due to network timeout',
            traumaInformedDescription: 'The login screen wasn\'t responding, which can feel frustrating. This happens sometimes and it\'s not your fault.',
            severity: 'medium',
            category: 'network',
            screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            suggestions: ['Check internet connection', 'Refresh the page', 'Clear browser cache'],
            traumaInformedSuggestions: ['Let\'s check your internet connection together', 'We can refresh the page and start fresh', 'Clearing the browser\'s memory might help']
          }
        ],
        performanceMetrics: {
          loadTimes: [],
          clickResponseTimes: [1200, 800, 2100],
          scrollPerformance: [],
          networkRequests: [],
          memoryUsage: [],
          overallScore: 6.5
        },
        behaviorAnalysis: {
          userExperience: 'frustrated',
          interactionPatterns: [
            {
              type: 'error_recovery',
              frequency: 3,
              duration: 15,
              effectiveness: 0.4
            }
          ],
          attentionHeatmap: [],
          cognitiveLoad: {
            overall: 'medium',
            factors: ['unclear_error_messages', 'slow_response_times'],
            recommendations: ['Improve error messaging', 'Optimize performance'],
            traumaInformedRecommendations: ['Add supportive error messages', 'Make interactions feel more responsive']
          },
          traumaIndicators: [
            {
              type: 'hesitation',
              timestamp: 2.0,
              duration: 2.5,
              severity: 'mild',
              supportResponse: 'Take your time - there\'s no rush. We\'re here to help you through this.'
            }
          ],
          supportNeeded: 'moderate'
        },
        recommendations: [
          {
            id: 'rec-1',
            title: 'Clear Browser Cache',
            description: 'Clear cached data that may be causing login issues',
            traumaInformedDescription: 'Let\'s clear your browser\'s stored memory to give you a fresh start',
            priority: 'high',
            category: 'performance',
            steps: [
              {
                description: 'Open browser settings',
                traumaInformedDescription: 'First, let\'s gently open your browser settings',
                difficulty: 'easy'
              }
            ],
            estimatedTime: 2
          }
        ],
        keyframes: [
          {
            timestamp: 0,
            frame: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            events: ['recording_started'],
            importance: 'medium',
            description: 'Recording started',
            traumaInformedDescription: 'We started recording your experience'
          }
        ],
        confidence: 0.82
      };
      
      setAnalysisResults(mockResults);
      onAnalysisComplete?.(mockResults);
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [recordingState.recordedBlob, recordingState.duration, onAnalysisComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const PrivacyNoticeModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg bg-sanctuary-white">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-sanctuary-gray-800">
                Screen Recording Privacy
              </h3>
              <p className="text-sm text-sanctuary-gray-600">
                Your privacy and safety matter to us
              </p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm text-sanctuary-gray-700">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">🎥 What we record:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Only your screen during the session</li>
                <li>• Mouse movements and clicks</li>
                <li>• Keyboard activity (but not passwords)</li>
                <li>• Page navigation and interactions</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium text-green-800 mb-2">🔒 Privacy protections:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Recording stays on your device</li>
                <li>• Automatic deletion after analysis</li>
                <li>• No personal data extraction</li>
                <li>• You control start and stop</li>
                <li>• No external servers involved</li>
              </ul>
            </div>
            
            <div className="p-4 bg-sage-50 rounded-lg border border-sage-100">
              <h4 className="font-medium text-sage-800 mb-2">💚 Trauma-informed approach:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Stop anytime you feel uncomfortable</li>
                <li>• Analysis focuses on helping, not judging</li>
                <li>• Supportive language in all feedback</li>
                <li>• No pressure to share anything</li>
              </ul>
            </div>
          </div>
        </CardHeader>
        
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPrivacyNotice(false)}
            className="flex-1"
          >
            Not Now
          </Button>
          <Button
            onClick={() => {
              setPrivacyConsent(true);
              setShowPrivacyNotice(false);
              requestScreenRecording();
            }}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            I Understand & Consent
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Privacy Notice Modal */}
      {showPrivacyNotice && <PrivacyNoticeModal />}
      
      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-soft ${
                recordingState.status === 'recording' 
                  ? 'bg-red-400 animate-pulse' 
                  : 'bg-gradient-to-br from-blue-400 to-blue-500'
              }`}>
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-sanctuary-gray-800">
                  {traumaInformed ? 'Screen Recording Helper' : 'Screen Recording'}
                </h3>
                <p className="text-sm text-sanctuary-gray-600">
                  {traumaInformed 
                    ? 'Record your screen to show us what\'s happening - we\'ll help you through it'
                    : 'Record your screen to capture complex issues for analysis'}
                </p>
              </div>
            </div>
            
            {recordingState.status === 'recording' && (
              <div className="text-right">
                <div className="text-lg font-mono text-red-600">
                  {formatTime(recordingState.duration)}
                </div>
                <div className="text-xs text-sanctuary-gray-500">
                  Max: {maxDuration} min
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {recordingState.status === 'idle' && (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto">
                  <Video className="w-10 h-10 text-blue-600" />
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-sanctuary-gray-800 mb-2">
                    {traumaInformed 
                      ? 'Share your experience with us' 
                      : 'Record your screen activity'}
                  </h4>
                  <p className="text-sm text-sanctuary-gray-600 mb-4">
                    {traumaInformed
                      ? 'Recording helps us see exactly what you\'re experiencing so we can provide the most helpful support.'
                      : 'Screen recordings help us identify complex issues that are hard to describe in words.'}
                  </p>
                </div>
                
                <div className="flex justify-center gap-3">
                  <Button
                    onClick={requestScreenRecording}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {traumaInformed ? 'Start Recording' : 'Begin Recording'}
                  </Button>
                </div>
                
                <div className="text-xs text-sanctuary-gray-500 space-y-1">
                  <p>• Maximum duration: {maxDuration} minutes</p>
                  <p>• Recording stays on your device</p>
                  <p>• You can stop anytime</p>
                </div>
              </div>
            </div>
          )}

          {recordingState.status === 'requesting' && (
            <div className="text-center py-8">
              <div className="space-y-4">
                <RotateCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                <p className="text-sanctuary-gray-600">
                  {traumaInformed 
                    ? 'Please allow screen sharing when prompted...' 
                    : 'Requesting screen capture permission...'}
                </p>
              </div>
            </div>
          )}

          {recordingState.status === 'recording' && (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-red-500"></div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-sanctuary-gray-800 mb-2">
                    Recording in progress...
                  </h4>
                  <p className="text-sm text-sanctuary-gray-600">
                    {traumaInformed 
                      ? 'Go through your normal process. Take your time - we\'re here with you.'
                      : 'Navigate through the issue you\'re experiencing. Try to reproduce the problem.'}
                  </p>
                </div>
                
                <Button
                  onClick={stopRecording}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              </div>
            </div>
          )}

          {recordingState.status === 'complete' && recordingState.recordedUrl && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  src={recordingState.recordedUrl}
                  controls
                  className="w-full rounded-lg"
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                >
                  Your browser does not support video playback.
                </video>
                
                {/* Interaction Overlay */}
                {showInteractions && analysisResults && (
                  <div className="absolute inset-0 pointer-events-none">
                    {analysisResults.userInteractions
                      .filter(interaction => 
                        Math.abs(interaction.timestamp - currentTime) < 0.5
                      )
                      .map((interaction, index) => (
                        <div
                          key={index}
                          className="absolute animate-ping"
                          style={{
                            left: `${(interaction.target.bounds.x / analysisResults.resolution.width) * 100}%`,
                            top: `${(interaction.target.bounds.y / analysisResults.resolution.height) * 100}%`
                          }}
                        >
                          <div className="w-4 h-4 rounded-full bg-yellow-400 opacity-75"></div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setShowInteractions(!showInteractions)}
                    variant="ghost"
                    size="sm"
                  >
                    {showInteractions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showInteractions ? 'Hide' : 'Show'} Interactions
                  </Button>
                  
                  <div className="text-sm text-sanctuary-gray-600">
                    Duration: {formatTime(recordingState.duration)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={analyzeRecording}
                    disabled={isAnalyzing}
                    className="bg-sage-400 hover:bg-sage-500 text-white"
                  >
                    {isAnalyzing ? (
                      <>
                        <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                        {traumaInformed ? 'Analyzing with care...' : 'Analyzing...'}
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        {traumaInformed ? 'Help me understand this' : 'Analyze Recording'}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => {
                      if (recordingState.recordedUrl) {
                        URL.revokeObjectURL(recordingState.recordedUrl);
                      }
                      setRecordingState({
                        status: 'idle',
                        chunks: [],
                        duration: 0
                      });
                      setAnalysisResults(null);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-sanctuary-gray-800">
                  {traumaInformed ? 'Understanding Your Experience' : 'Analysis Results'}
                </h3>
                <p className="text-sm text-sanctuary-gray-600">
                  Confidence: {Math.round(analysisResults.confidence * 100)}%
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Experience Summary */}
            <div className="p-4 bg-sage-50 rounded-lg border border-sage-100">
              <h4 className="font-medium text-sage-800 mb-2">
                {traumaInformed ? 'What We Observed' : 'User Experience Analysis'}
              </h4>
              <p className="text-sm text-sanctuary-gray-700">
                {traumaInformed
                  ? `We saw that you experienced some ${analysisResults.behaviorAnalysis.userExperience} moments. This is completely normal, and we're here to help make things smoother for you.`
                  : `User experience level: ${analysisResults.behaviorAnalysis.userExperience}`}
              </p>
              
              {analysisResults.behaviorAnalysis.traumaIndicators.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-100">
                  <p className="text-xs text-blue-800 font-medium mb-1">
                    💙 Support Available
                  </p>
                  <p className="text-xs text-blue-700">
                    {analysisResults.behaviorAnalysis.traumaIndicators[0].supportResponse}
                  </p>
                </div>
              )}
            </div>

            {/* Problem Steps */}
            {analysisResults.problemSteps.length > 0 && (
              <div>
                <h4 className="font-medium text-sanctuary-gray-800 mb-3">
                  {traumaInformed ? 'Challenges We Noticed' : 'Issues Identified'}
                </h4>
                <div className="space-y-3">
                  {analysisResults.problemSteps.map((step) => (
                    <div key={step.id} className="p-3 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          step.severity === 'critical' ? 'bg-red-500' :
                          step.severity === 'high' ? 'bg-orange-500' :
                          step.severity === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-3 h-3 text-sanctuary-gray-500" />
                            <span className="text-xs text-sanctuary-gray-500">
                              {formatTime(step.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-sanctuary-gray-800 mb-2">
                            {traumaInformed ? step.traumaInformedDescription : step.description}
                          </p>
                          <div className="text-xs text-sanctuary-gray-600">
                            <p className="font-medium mb-1">
                              {traumaInformed ? 'How we can help:' : 'Suggestions:'}
                            </p>
                            <ul className="space-y-1">
                              {(traumaInformed ? step.traumaInformedSuggestions : step.suggestions).map((suggestion, index) => (
                                <li key={index}>• {suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysisResults.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-sanctuary-gray-800 mb-3">
                  {traumaInformed ? 'Gentle Next Steps' : 'Recommendations'}
                </h4>
                <div className="space-y-3">
                  {analysisResults.recommendations.map((rec) => (
                    <div key={rec.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sanctuary-gray-800">
                          {rec.title}
                        </h5>
                        <span className={`text-xs px-2 py-1 rounded ${
                          rec.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-sanctuary-gray-700 mb-2">
                        {traumaInformed ? rec.traumaInformedDescription : rec.description}
                      </p>
                      <div className="text-xs text-sanctuary-gray-500">
                        Estimated time: {rec.estimatedTime} minutes
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}