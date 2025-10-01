'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronRight, ChevronDown, RefreshCw, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { ALCHMKnowledgeBase, type KnownIssue } from '../../lib/alchm-support-knowledge-base';
import { trackTroubleshootingEvent } from '../../lib/analytics';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

function Checkbox({ id, checked, onCheckedChange, className = '' }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className={`w-4 h-4 text-sage-600 bg-sanctuary-white border-sanctuary-gray-300 rounded focus:ring-sage-500 focus:ring-2 ${className}`}
    />
  );
}

interface ProgressProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}

function Progress({ value, className = '', style }: ProgressProps) {
  return (
    <div className={`w-full bg-sanctuary-gray-200 rounded-full h-2.5 ${className}`} style={style}>
      <div 
        className="bg-sage-400 h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

interface TroubleshootingStep {
  id: string;
  title: string;
  description: string;
  traumaInformedDescription: string;
  instructions: string[];
  visualAids: VisualAid[];
  completed: boolean;
  current: boolean;
  skipped: boolean;
  timeToComplete?: number;
  difficulty: 'easy' | 'moderate' | 'advanced';
  successRate: number;
  alternativePaths?: string[];
  encouragement: string;
  checklistItems: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  text: string;
  traumaInformedText: string;
  completed: boolean;
  required: boolean;
}

interface VisualAid {
  type: 'screenshot' | 'annotation' | 'video' | 'diagram';
  src: string;
  alt: string;
  annotations?: Annotation[];
  caption: string;
}

interface Annotation {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  type: 'click' | 'highlight' | 'warning' | 'info';
}

interface TroubleshootingSession {
  id: string;
  issueId: string;
  steps: TroubleshootingStep[];
  currentStepIndex: number;
  startedAt: Date;
  progressHistory: ProgressEvent[];
  adaptivePath: string[];
  userFeedback: StepFeedback[];
  completed: boolean;
  successful: boolean;
}

interface ProgressEvent {
  stepId: string;
  action: 'started' | 'completed' | 'skipped' | 'failed';
  timestamp: Date;
  timeSpent?: number;
  helpUsed?: boolean;
}

interface StepFeedback {
  stepId: string;
  helpful: boolean;
  difficulty: 'too_easy' | 'just_right' | 'too_hard';
  clarity: 'unclear' | 'clear' | 'very_clear';
  emotionalComfort: 'uncomfortable' | 'neutral' | 'supportive';
  comments?: string;
}

interface InteractiveTroubleshootingEngineProps {
  issueId?: string;
  onComplete?: (session: TroubleshootingSession) => void;
  onEscalate?: (reason: string, session: TroubleshootingSession) => void;
  traumaInformed?: boolean;
  showVisualAids?: boolean;
  adaptiveDifficulty?: boolean;
}

export function InteractiveTroubleshootingEngine({
  issueId,
  onComplete,
  onEscalate,
  traumaInformed = true,
  showVisualAids = true,
  adaptiveDifficulty = true
}: InteractiveTroubleshootingEngineProps) {
  const [session, setSession] = useState<TroubleshootingSession | null>(null);
  const [currentStep, setCurrentStep] = useState<TroubleshootingStep | null>(null);
  const [expandedVisualAids, setExpandedVisualAids] = useState<Set<string>>(new Set());
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [stepStartTime, setStepStartTime] = useState<Date>(new Date());
  const [isProcessingFeedback, setIsProcessingFeedback] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    preferredDifficulty: 'moderate' as const,
    needsEncouragement: true,
    hasAccessibilityNeeds: false,
    preferredVisualStyle: 'gentle' as 'gentle' | 'standard' | 'minimal'
  });
  
  const knowledgeBase = useRef(new ALCHMKnowledgeBase());
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize troubleshooting session
  useEffect(() => {
    if (issueId && !session) {
      initializeSession(issueId);
    }
  }, [issueId]);

  // Track step timing
  useEffect(() => {
    if (currentStep) {
      setStepStartTime(new Date());
      stepTimerRef.current = setTimeout(() => {
        if (currentStep && !currentStep.completed) {
          trackTroubleshootingEvent({
            event: 'step_timeout',
            stepId: currentStep.id,
            timeSpent: Date.now() - stepStartTime.getTime()
          });
        }
      }, 300000); // 5 minute timeout

      return () => {
        if (stepTimerRef.current) {
          clearTimeout(stepTimerRef.current);
        }
      };
    }
  }, [currentStep]);

  const initializeSession = (problemIssueId: string) => {
    const issue = knowledgeBase.current.getSolutions(problemIssueId)[0];
    if (!issue) return;

    const steps = createTroubleshootingSteps(issue);
    const newSession: TroubleshootingSession = {
      id: `session_${Date.now()}`,
      issueId: problemIssueId,
      steps,
      currentStepIndex: 0,
      startedAt: new Date(),
      progressHistory: [],
      adaptivePath: [],
      userFeedback: [],
      completed: false,
      successful: false
    };

    setSession(newSession);
    setCurrentStep(steps[0]);
    
    trackTroubleshootingEvent({
      event: 'session_started',
      issueId: problemIssueId,
      sessionId: newSession.id
    });
  };

  const createTroubleshootingSteps = (solution: any): TroubleshootingStep[] => {
    return solution.steps.map((step: any, index: number) => {
      const baseStep: TroubleshootingStep = {
        id: `step_${index + 1}`,
        title: step.title || `Step ${index + 1}`,
        description: step.description || step.instruction,
        traumaInformedDescription: step.traumaInformedVersion || step.instruction,
        instructions: Array.isArray(step.instruction) ? step.instruction : [step.instruction],
        visualAids: createVisualAidsForStep(step, solution.id),
        completed: false,
        current: index === 0,
        skipped: false,
        difficulty: step.difficulty || 'moderate',
        successRate: step.successRate || 0.8,
        encouragement: step.encouragement || 'You\'re doing great! This step helps secure your sanctuary.',
        checklistItems: createChecklistForStep(step)
      };

      // Add alternative paths for complex steps
      if (step.alternatives || step.deviceSpecific) {
        baseStep.alternativePaths = Object.keys(step.deviceSpecific || {});
      }

      return baseStep;
    });
  };

  const createVisualAidsForStep = (step: any, solutionId: string): VisualAid[] => {
    const aids: VisualAid[] = [];

    // Generate visual aids based on step type
    if (step.instruction.includes('popup') || step.instruction.includes('browser')) {
      aids.push({
        type: 'screenshot',
        src: `/images/troubleshooting/${solutionId}/browser-popup-guide.png`,
        alt: 'Browser popup settings screenshot',
        caption: 'Example of popup settings in your browser',
        annotations: [
          {
            x: 120,
            y: 80,
            width: 200,
            height: 40,
            label: 'Click here to allow popups',
            type: 'click'
          }
        ]
      });
    }

    if (step.instruction.includes('cache') || step.instruction.includes('clear')) {
      aids.push({
        type: 'diagram',
        src: `/images/troubleshooting/cache-clearing-steps.svg`,
        alt: 'Step-by-step cache clearing diagram',
        caption: 'Visual guide to clearing browser cache safely'
      });
    }

    // Crisis-specific visual aids
    if (step.instruction.includes('crisis') || step.instruction.includes('emergency')) {
      aids.push({
        type: 'screenshot',
        src: `/images/troubleshooting/crisis-resources-access.png`,
        alt: 'Crisis resources access guide',
        caption: 'How to access emergency resources when technical features fail',
        annotations: [
          {
            x: 50,
            y: 50,
            width: 100,
            height: 50,
            label: 'Emergency call button',
            type: 'warning'
          }
        ]
      });
    }

    return aids;
  };

  const createChecklistForStep = (step: any): ChecklistItem[] => {
    const items: ChecklistItem[] = [];

    // Extract actionable items from instructions
    if (step.instruction.includes('verify') || step.instruction.includes('check')) {
      items.push({
        id: 'verify_action',
        text: 'Verify the information or setting mentioned',
        traumaInformedText: 'Take a gentle moment to check this detail at your own pace',
        completed: false,
        required: true
      });
    }

    if (step.instruction.includes('click') || step.instruction.includes('tap')) {
      items.push({
        id: 'interaction_action',
        text: 'Complete the clicking or tapping action',
        traumaInformedText: 'When you feel ready, interact with the element described',
        completed: false,
        required: true
      });
    }

    if (step.instruction.includes('test') || step.instruction.includes('try')) {
      items.push({
        id: 'test_action',
        text: 'Test the functionality as described',
        traumaInformedText: 'Gently test whether your sanctuary is working as expected',
        completed: false,
        required: false
      });
    }

    // Always add a completion confirmation
    items.push({
      id: 'step_complete',
      text: 'This step is working as expected',
      traumaInformedText: 'I feel confident this step has helped my sanctuary',
      completed: false,
      required: true
    });

    return items;
  };

  const completeChecklistItem = (stepId: string, itemId: string) => {
    if (!session) return;

    setSession(prev => {
      if (!prev) return prev;

      const updatedSteps = prev.steps.map(step => {
        if (step.id === stepId) {
          const updatedItems = step.checklistItems.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          );
          
          // Check if all required items are completed
          const allRequiredCompleted = updatedItems
            .filter(item => item.required)
            .every(item => item.completed);
          
          return {
            ...step,
            checklistItems: updatedItems,
            completed: allRequiredCompleted
          };
        }
        return step;
      });

      return { ...prev, steps: updatedSteps };
    });
  };

  const proceedToNextStep = () => {
    if (!session || !currentStep) return;

    const timeSpent = Date.now() - stepStartTime.getTime();
    
    // Record progress event
    const progressEvent: ProgressEvent = {
      stepId: currentStep.id,
      action: 'completed',
      timestamp: new Date(),
      timeSpent,
      helpUsed: expandedVisualAids.has(currentStep.id)
    };

    setSession(prev => {
      if (!prev) return prev;

      const nextIndex = prev.currentStepIndex + 1;
      const isComplete = nextIndex >= prev.steps.length;
      
      const updatedSession = {
        ...prev,
        currentStepIndex: nextIndex,
        progressHistory: [...prev.progressHistory, progressEvent],
        completed: isComplete,
        successful: isComplete
      };

      if (isComplete) {
        trackTroubleshootingEvent({
          event: 'session_completed',
          sessionId: prev.id,
          totalTime: Date.now() - prev.startedAt.getTime(),
          success: true
        });
        
        onComplete?.(updatedSession);
      } else {
        const nextStep = prev.steps[nextIndex];
        setCurrentStep(nextStep);
        
        trackTroubleshootingEvent({
          event: 'step_completed',
          stepId: currentStep.id,
          timeSpent,
          sessionId: prev.id
        });
      }

      return updatedSession;
    });
  };

  const skipCurrentStep = () => {
    if (!session || !currentStep) return;

    const timeSpent = Date.now() - stepStartTime.getTime();
    
    const progressEvent: ProgressEvent = {
      stepId: currentStep.id,
      action: 'skipped',
      timestamp: new Date(),
      timeSpent
    };

    setSession(prev => {
      if (!prev) return prev;

      const nextIndex = prev.currentStepIndex + 1;
      const updatedSteps = prev.steps.map((step, index) => 
        index === prev.currentStepIndex ? { ...step, skipped: true } : step
      );

      if (nextIndex >= prev.steps.length) {
        // Show alternative paths or escalate
        setShowAlternatives(true);
        return prev;
      }

      const nextStep = updatedSteps[nextIndex];
      setCurrentStep(nextStep);

      return {
        ...prev,
        steps: updatedSteps,
        currentStepIndex: nextIndex,
        progressHistory: [...prev.progressHistory, progressEvent]
      };
    });
  };

  const requestHumanHelp = () => {
    if (!session) return;
    
    trackTroubleshootingEvent({
      event: 'escalation_requested',
      reason: 'user_requested_human_help',
      sessionId: session.id,
      currentStep: currentStep?.id
    });

    onEscalate?.('User requested human assistance', session);
  };

  const submitStepFeedback = (feedback: Omit<StepFeedback, 'stepId'>) => {
    if (!currentStep || !session) return;

    setIsProcessingFeedback(true);
    
    const fullFeedback: StepFeedback = {
      ...feedback,
      stepId: currentStep.id
    };

    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        userFeedback: [...prev.userFeedback, fullFeedback]
      };
    });

    trackTroubleshootingEvent({
      event: 'step_feedback',
      stepId: currentStep.id,
      feedback: fullFeedback,
      sessionId: session.id
    });

    // Adaptive difficulty adjustment
    if (adaptiveDifficulty && feedback.difficulty === 'too_hard') {
      setUserPreferences(prev => ({
        ...prev,
        preferredDifficulty: 'easy',
        needsEncouragement: true
      }));
    }

    setTimeout(() => setIsProcessingFeedback(false), 1000);
  };

  const toggleVisualAid = (stepId: string) => {
    setExpandedVisualAids(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  if (!session || !currentStep) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-sage-200 border-t-sage-400 rounded-full mx-auto mb-4"></div>
            <p className="text-sanctuary-gray-600">
              {traumaInformed 
                ? 'Preparing your personalized guidance sanctuary...'
                : 'Initializing troubleshooting session...'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = ((session.currentStepIndex) / session.steps.length) * 100;
  const completedRequiredItems = currentStep.checklistItems
    .filter(item => item.required)
    .filter(item => item.completed).length;
  const totalRequiredItems = currentStep.checklistItems
    .filter(item => item.required).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="bg-sanctuary-white/95 backdrop-blur-xl border-sage-200/60">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-sanctuary-gray-800">
                {traumaInformed ? 'Guided Sanctuary Restoration' : 'Interactive Troubleshooting'}
              </h2>
              <p className="text-sm text-sanctuary-gray-600">
                Step {session.currentStepIndex + 1} of {session.steps.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl mb-1">
                {currentStep.completed ? '✨' : currentStep.difficulty === 'easy' ? '🌱' : currentStep.difficulty === 'moderate' ? '🌿' : '🌳'}
              </div>
              <p className="text-xs text-sanctuary-gray-500">
                {currentStep.difficulty === 'easy' ? 'Gentle' : currentStep.difficulty === 'moderate' ? 'Moderate' : 'Detailed'}
              </p>
            </div>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2"
            style={{
              background: 'linear-gradient(to right, rgba(164, 183, 146, 0.2) 0%, rgba(164, 183, 146, 0.1) 100%)'
            }}
          />
          
          <div className="flex justify-between text-xs text-sanctuary-gray-500 mt-2">
            <span>{traumaInformed ? 'Your healing journey progress' : 'Troubleshooting progress'}</span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
        </CardHeader>
      </Card>

      {/* Current Step */}
      <Card className="bg-sanctuary-white/98 backdrop-blur-xl border-sage-200/60">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                currentStep.completed 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-sage-100 text-sage-600'
              }`}>
                {currentStep.completed ? <CheckCircle size={24} /> : <HelpCircle size={24} />}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-sanctuary-gray-800 mb-2">
                {currentStep.title}
              </h3>
              <p className="text-sanctuary-gray-600 leading-relaxed">
                {traumaInformed 
                  ? currentStep.traumaInformedDescription 
                  : currentStep.description
                }
              </p>
              
              {userPreferences.needsEncouragement && (
                <div className="mt-3 p-3 bg-sage-50 rounded-lg border border-sage-100">
                  <p className="text-sm text-sage-700 italic">
                    💚 {currentStep.encouragement}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Instructions Checklist */}
          <div className="space-y-3">
            <h4 className="font-medium text-sanctuary-gray-700 flex items-center gap-2">
              <span className="text-lg">📋</span>
              {traumaInformed ? 'Gentle Steps to Follow' : 'Action Items'}
            </h4>
            
            {currentStep.checklistItems.map(item => (
              <div key={item.id} className="flex items-start gap-3 group">
                <Checkbox
                  id={item.id}
                  checked={item.completed}
                  onCheckedChange={() => completeChecklistItem(currentStep.id, item.id)}
                  className="mt-1 data-[state=checked]:bg-sage-400 data-[state=checked]:border-sage-400"
                />
                <div className="flex-1">
                  <label 
                    htmlFor={item.id}
                    className={`text-sm leading-relaxed cursor-pointer ${
                      item.completed 
                        ? 'text-sanctuary-gray-500 line-through' 
                        : 'text-sanctuary-gray-700'
                    } group-hover:text-sanctuary-gray-900 transition-colors`}
                  >
                    {traumaInformed ? item.traumaInformedText : item.text}
                    {item.required && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </label>
                </div>
              </div>
            ))}
            
            <div className="text-xs text-sanctuary-gray-500 mt-2">
              {completedRequiredItems} of {totalRequiredItems} required items completed
            </div>
          </div>

          {/* Visual Aids */}
          {showVisualAids && currentStep.visualAids.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sanctuary-gray-700 flex items-center gap-2">
                  <span className="text-lg">🎨</span>
                  Visual Guidance
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleVisualAid(currentStep.id)}
                  className="text-sage-600 hover:text-sage-700"
                >
                  {expandedVisualAids.has(currentStep.id) ? (
                    <><ChevronDown size={16} /> Hide</>
                  ) : (
                    <><ChevronRight size={16} /> Show</>
                  )}
                </Button>
              </div>
              
              {expandedVisualAids.has(currentStep.id) && (
                <div className="space-y-4">
                  {currentStep.visualAids.map((aid, index) => (
                    <div key={index} className="border border-sage-100 rounded-lg overflow-hidden">
                      <div className="relative">
                        <img
                          src={aid.src}
                          alt={aid.alt}
                          className="w-full h-auto"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-visual-aid.svg';
                          }}
                        />
                        
                        {/* Annotations */}
                        {aid.annotations?.map((annotation, annotationIndex) => (
                          <div
                            key={annotationIndex}
                            className={`absolute border-2 rounded ${
                              annotation.type === 'click' ? 'border-blue-400 bg-blue-100/50' :
                              annotation.type === 'highlight' ? 'border-yellow-400 bg-yellow-100/50' :
                              annotation.type === 'warning' ? 'border-red-400 bg-red-100/50' :
                              'border-green-400 bg-green-100/50'
                            }`}
                            style={{
                              left: `${annotation.x}px`,
                              top: `${annotation.y}px`,
                              width: `${annotation.width}px`,
                              height: `${annotation.height}px`
                            }}
                          >
                            <div className={`absolute -top-8 left-0 px-2 py-1 text-xs rounded shadow-md ${
                              annotation.type === 'click' ? 'bg-blue-600 text-white' :
                              annotation.type === 'highlight' ? 'bg-yellow-600 text-white' :
                              annotation.type === 'warning' ? 'bg-red-600 text-white' :
                              'bg-green-600 text-white'
                            }`}>
                              {annotation.label}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-3 bg-sanctuary-gray-50">
                        <p className="text-sm text-sanctuary-gray-600">
                          {aid.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Alternative Paths */}
          {currentStep.alternativePaths && currentStep.alternativePaths.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sanctuary-gray-700 flex items-center gap-2">
                  <span className="text-lg">🔄</span>
                  Alternative Approaches
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAlternatives(!showAlternatives)}
                  className="text-sage-600 hover:text-sage-700"
                >
                  {showAlternatives ? (
                    <><ChevronDown size={16} /> Hide</>
                  ) : (
                    <><ChevronRight size={16} /> Show</>
                  )}
                </Button>
              </div>
              
              {showAlternatives && (
                <div className="grid gap-3">
                  {currentStep.alternativePaths.map(path => (
                    <Button
                      key={path}
                      variant="outline"
                      className="justify-start h-auto p-4 text-left"
                      onClick={() => {
                        // Handle alternative path selection
                        trackTroubleshootingEvent({
                          event: 'alternative_path_selected',
                          path,
                          stepId: currentStep.id,
                          sessionId: session.id
                        });
                      }}
                    >
                      <div>
                        <div className="font-medium text-sanctuary-gray-800">
                          {path.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-sanctuary-gray-600 mt-1">
                          Try this approach if the main method isn't working
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {/* Step Actions */}
          <div className="flex flex-wrap gap-3 w-full">
            <Button
              onClick={proceedToNextStep}
              disabled={totalRequiredItems > 0 && completedRequiredItems < totalRequiredItems}
              className={`flex-1 min-w-0 ${
                currentStep.completed 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-sage-400 hover:bg-sage-500'
              } text-white`}
            >
              {currentStep.completed ? (
                <>✅ Step Complete</>
              ) : session.currentStepIndex === session.steps.length - 1 ? (
                <>🎉 Finish Troubleshooting</>
              ) : (
                <>Continue to Next Step <ChevronRight size={16} /></>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={skipCurrentStep}
              className="px-6"
            >
              Skip Step
            </Button>
            
            <Button
              variant="ghost"
              onClick={requestHumanHelp}
              className="px-6 text-sage-600 hover:text-sage-700"
            >
              <HelpCircle size={16} className="mr-2" />
              Get Human Help
            </Button>
          </div>

          {/* Quick Feedback */}
          <div className="w-full pt-4 border-t border-sage-100">
            <p className="text-sm text-sanctuary-gray-600 mb-3">
              {traumaInformed 
                ? 'How does this step feel for you?' 
                : 'How helpful was this step?'
              }
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => submitStepFeedback({ 
                  helpful: true, 
                  difficulty: 'just_right', 
                  clarity: 'clear',
                  emotionalComfort: 'supportive'
                })}
                disabled={isProcessingFeedback}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                👍 Helpful
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => submitStepFeedback({ 
                  helpful: false, 
                  difficulty: 'too_hard', 
                  clarity: 'unclear',
                  emotionalComfort: 'neutral'
                })}
                disabled={isProcessingFeedback}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              >
                🤔 Needs Improvement
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => submitStepFeedback({ 
                  helpful: false, 
                  difficulty: 'too_hard', 
                  clarity: 'unclear',
                  emotionalComfort: 'uncomfortable'
                })}
                disabled={isProcessingFeedback}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                😰 Too Overwhelming
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Session Summary for Completed */}
      {session.completed && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                {traumaInformed 
                  ? 'Your Sanctuary Has Been Restored!' 
                  : 'Troubleshooting Complete!'
                }
              </h3>
              <p className="text-green-700 mb-4">
                {traumaInformed
                  ? 'You\'ve successfully restored your healing sanctuary. Your journey of growth continues.'
                  : 'The issue has been resolved successfully. Your ALCHM experience should now work smoothly.'
                }
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => window.location.href = '/journal'}
                  className="bg-sage-400 hover:bg-sage-500 text-white"
                >
                  Return to Journaling
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Reset for new session
                    setSession(null);
                    setCurrentStep(null);
                  }}
                >
                  Start New Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}