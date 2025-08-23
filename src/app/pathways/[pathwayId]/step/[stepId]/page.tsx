// ALCHM Pathways Step Page - Soul-Centered SEL Journey
// Dynamic pathway step with AI-augmented prompts and cultural adaptations

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PathwayStep, PathwayAIInsight, PathwayMilestone, SELCompetencyScore } from '@/types/pathways-schema';
import PathwayStepInterface from '@/components/pathways/PathwayStepInterface';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

interface PathwayStepPageState {
  step: PathwayStep | null;
  aiEnhancedPrompts: {
    mentorPrompt: string;
    reflectionPrompt: string;
    encouragementMessage: string;
  } | null;
  culturalAdaptations: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  sessionStartTime: number;
}

export default function PathwayStepPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const pathwayId = params.pathwayId as string;
  const stepId = params.stepId as string;

  const [state, setState] = useState<PathwayStepPageState>({
    step: null,
    aiEnhancedPrompts: null,
    culturalAdaptations: {},
    isLoading: true,
    error: null,
    sessionStartTime: Date.now()
  });

  /**
   * Load step data with AI enhancements
   */
  const loadStepData = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`/api/pathways/${pathwayId}/step/${stepId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load step: ${response.statusText}`);
      }

      const data = await response.json();

      setState(prev => ({
        ...prev,
        step: data.step,
        aiEnhancedPrompts: data.aiEnhancedPrompts,
        culturalAdaptations: data.culturalAdaptations,
        isLoading: false
      }));

      // Track step view analytics
      await trackStepView(stepId);

    } catch (error) {
      console.error('Error loading step data:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load step',
        isLoading: false
      }));
    }
  }, [user?.uid, pathwayId, stepId]);

  /**
   * Handle step completion with AI analysis
   */
  const handleStepCompletion = async (completionData: {
    reflections: string[];
    journalEntry?: string;
    interactiveResponses: Record<string, any>;
    emotionalState?: any;
  }) => {
    if (!user?.uid || !state.step) return;

    try {
      const timeSpentMs = Date.now() - state.sessionStartTime;

      const response = await fetch(`/api/pathways/${pathwayId}/step/${stepId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...completionData,
          timeSpentMs
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to complete step: ${response.statusText}`);
      }

      const result = await response.json();

      // Handle completion results
      await handleCompletionResults(result);

    } catch (error) {
      console.error('Error completing step:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to complete step'
      }));
    }
  };

  /**
   * Handle completion results (insights, milestones, next steps)
   */
  const handleCompletionResults = async (result: {
    aiInsights: PathwayAIInsight[];
    nextStep?: PathwayStep;
    milestones: PathwayMilestone[];
    SELGrowth: Partial<SELCompetencyScore>;
  }) => {
    // Show milestones and insights
    if (result.milestones.length > 0) {
      await showMilestones(result.milestones);
    }

    // Display AI insights
    if (result.aiInsights.length > 0) {
      await showAIInsights(result.aiInsights);
    }

    // Navigate to next step or pathway completion
    if (result.nextStep) {
      router.push(`/pathways/${pathwayId}/step/${result.nextStep.id}`);
    } else {
      // Pathway completed
      router.push(`/pathways/${pathwayId}/complete`);
    }
  };

  /**
   * Show milestone achievements
   */
  const showMilestones = async (milestones: PathwayMilestone[]) => {
    // In a full implementation, this would show a celebration modal/animation
    for (const milestone of milestones) {
      console.log('Milestone achieved:', milestone.title);
      // Could trigger confetti animation, sound effects, etc.
    }
  };

  /**
   * Show AI insights
   */
  const showAIInsights = async (insights: PathwayAIInsight[]) => {
    // In a full implementation, this would show insights in a beautiful modal
    for (const insight of insights) {
      console.log('AI Insight:', insight.content);
    }
  };

  /**
   * Track step view for analytics
   */
  const trackStepView = async (stepId: string) => {
    try {
      await fetch('/api/analytics/pathway-step-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pathwayId,
          stepId,
          timestamp: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Error tracking step view:', error);
    }
  };

  /**
   * Initialize step on mount
   */
  useEffect(() => {
    if (user?.uid) {
      loadStepData();
    }
  }, [user?.uid, loadStepData]);

  /**
   * Track session time on unmount
   */
  useEffect(() => {
    return () => {
      if (state.sessionStartTime && state.step) {
        const sessionDuration = Date.now() - state.sessionStartTime;
        // Track session analytics
        fetch('/api/analytics/pathway-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pathwayId,
            stepId,
            sessionDuration,
            completed: false
          }),
        }).catch(console.error);
      }
    };
  }, [pathwayId, stepId, state.sessionStartTime, state.step]);

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <LoadingSpinner />
        <p className="ml-4 text-white text-lg">Loading your pathway step...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md">
          <h2 className="text-red-300 text-xl font-semibold mb-2">Error Loading Step</h2>
          <p className="text-red-200 mb-4">{state.error}</p>
          <button 
            onClick={loadStepData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!state.step || !state.aiEnhancedPrompts) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-center">
          <h2 className="text-2xl font-semibold mb-2">Step Not Found</h2>
          <p className="text-gray-300 mb-4">The requested pathway step could not be found.</p>
          <button 
            onClick={() => router.push(`/pathways/${pathwayId}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-colors"
          >
            Return to Pathway
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          {/* Pathway Progress Header */}
          <div className="mb-8">
            <nav className="text-sm breadcrumbs text-gray-300 mb-4">
              <a href="/pathways" className="hover:text-white transition-colors">Pathways</a>
              <span className="mx-2">/</span>
              <a 
                href={`/pathways/${pathwayId}`} 
                className="hover:text-white transition-colors"
              >
                Current Journey
              </a>
              <span className="mx-2">/</span>
              <span className="text-white">{state.step.title}</span>
            </nav>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              {state.step.title}
            </h1>
            <p className="text-gray-300">
              Step {state.step.order} • Estimated time: {state.step.estimatedDurationMinutes} minutes
            </p>
          </div>

          {/* Main Step Interface */}
          <PathwayStepInterface
            step={state.step}
            aiEnhancedPrompts={state.aiEnhancedPrompts}
            culturalAdaptations={state.culturalAdaptations}
            onStepComplete={handleStepCompletion}
            onStepSkip={() => {
              // Handle step skip if allowed
              router.push(`/pathways/${pathwayId}`);
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

/**
 * Generate static params for pre-rendering popular pathway steps
 */
export async function generateStaticParams() {
  // In production, this would fetch popular pathway/step combinations
  return [
    { pathwayId: 'self-discovery-101', stepId: 'intro-reflection' },
    { pathwayId: 'emotional-regulation', stepId: 'identifying-triggers' },
    { pathwayId: 'social-connection', stepId: 'empathy-building' },
  ];
}

/**
 * Generate metadata for SEO and social sharing
 */
export async function generateMetadata({ params }: { params: { pathwayId: string; stepId: string } }) {
  // In production, this would fetch actual step data
  return {
    title: `ALCHM Pathway Step | ${params.stepId}`,
    description: 'Transform reflection into insight with AI-augmented SEL journeys designed for youth development.',
    openGraph: {
      title: 'ALCHM Pathways - Soul-Centered Growth',
      description: 'AI-powered pathways for transformative social-emotional learning',
      images: ['/images/pathways-og.jpg'],
    },
  };
}