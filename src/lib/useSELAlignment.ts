'use client';

// ALCHM SEL Alignment React Hook and Utilities
// React integration for Social-Emotional Learning alignment system

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  SELAlignmentEngine,
  SELAssessment,
  SELGoalAlignment,
  IKIGAISELAlignment,
  IntegrationOpportunity
} from './sel-alignment';
import {
  IKIGAISession,
  IKIGAIBootcamp,
  Goal,
  SuccessMetric
} from '@/types/ikigai-schema';
import { CulturalContext } from '@/types/pathways-schema';

export interface SELAlignmentState {
  currentAssessment: SELAssessment | null;
  goalAlignments: Map<string, SELGoalAlignment>;
  selMetrics: SuccessMetric[];
  integrationOpportunities: IntegrationOpportunity[];
  isAssessing: boolean;
  lastUpdated: Date | null;
  error: string | null;
}

export interface SELAlignmentActions {
  assessSELFromIKIGAI: (
    ikigaiSession: IKIGAISession,
    culturalContext: CulturalContext,
    previousAssessment?: SELAssessment
  ) => Promise<SELAssessment>;
  createSELAlignedGoals: (
    ikigaiSession: IKIGAISession,
    culturalContext: CulturalContext
  ) => Promise<Goal[]>;
  scoreGoalAlignment: (goal: Goal) => SELGoalAlignment | null;
  updateGoalAlignments: (goals: Goal[]) => void;
  generateSELMetrics: (
    goals: Goal[],
    culturalContext: CulturalContext
  ) => SuccessMetric[];
  refreshAssessment: () => Promise<void>;
  clearError: () => void;
}

export interface UseSELAlignmentOptions {
  autoAssess?: boolean;
  assessmentCacheTime?: number; // milliseconds
  enableRealTimeUpdates?: boolean;
  culturalContextRequired?: boolean;
}

export interface SELDashboardData {
  overallSELScore: number;
  competencyBreakdown: {
    competencyId: string;
    name: string;
    score: number;
    developmentPriority: string;
    culturalResonance: number;
  }[];
  ikigaiAlignment: IKIGAISELAlignment | null;
  topStrengths: string[];
  developmentAreas: string[];
  recommendedActions: string[];
  culturalIntegration: {
    alignment: number;
    considerations: string[];
    opportunities: string[];
  };
  progressTrends: {
    competencyId: string;
    trend: 'improving' | 'stable' | 'declining';
    changeRate: number;
  }[];
}

// Main hook for SEL alignment functionality
export const useSELAlignment = (
  initialSession?: IKIGAISession,
  initialCulturalContext?: CulturalContext,
  options: UseSELAlignmentOptions = {}
) => {
  const {
    autoAssess = false,
    assessmentCacheTime = 24 * 60 * 60 * 1000, // 24 hours
    enableRealTimeUpdates = true,
    culturalContextRequired = true
  } = options;

  // Initialize SEL engine
  const selEngine = useMemo(() => new SELAlignmentEngine(), []);

  // State management
  const [state, setState] = useState<SELAlignmentState>({
    currentAssessment: null,
    goalAlignments: new Map(),
    selMetrics: [],
    integrationOpportunities: [],
    isAssessing: false,
    lastUpdated: null,
    error: null
  });

  // Track current session and cultural context
  const [currentSession, setCurrentSession] = useState<IKIGAISession | null>(initialSession || null);
  const [culturalContext, setCulturalContext] = useState<CulturalContext | null>(initialCulturalContext || null);

  // Assessment function
  const assessSELFromIKIGAI = useCallback(async (
    ikigaiSession: IKIGAISession,
    context: CulturalContext,
    previousAssessment?: SELAssessment
  ): Promise<SELAssessment> => {
    if (culturalContextRequired && !context) {
      throw new Error('Cultural context is required for SEL assessment');
    }

    setState(prev => ({ ...prev, isAssessing: true, error: null }));

    try {
      const assessment = selEngine.assessSELFromIKIGAI(
        ikigaiSession,
        context,
        previousAssessment || state.currentAssessment || undefined
      );

      setState(prev => ({
        ...prev,
        currentAssessment: assessment,
        integrationOpportunities: assessment.ikigaiAlignment.integrationOpportunities,
        isAssessing: false,
        lastUpdated: new Date()
      }));

      setCurrentSession(ikigaiSession);
      setCulturalContext(context);

      return assessment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Assessment failed';
      setState(prev => ({
        ...prev,
        isAssessing: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [selEngine, state.currentAssessment, culturalContextRequired]);

  // Create SEL-aligned goals
  const createSELAlignedGoals = useCallback(async (
    ikigaiSession: IKIGAISession,
    context: CulturalContext
  ): Promise<Goal[]> => {
    if (!state.currentAssessment) {
      // Auto-assess if no current assessment
      await assessSELFromIKIGAI(ikigaiSession, context);
    }

    if (!state.currentAssessment) {
      throw new Error('SEL assessment required before creating goals');
    }

    try {
      const goals = selEngine.createSELAlignedGoals(
        ikigaiSession,
        state.currentAssessment,
        context
      );

      // Update goal alignments
      const alignments = new Map<string, SELGoalAlignment>();
      goals.forEach(goal => {
        const alignment = selEngine.scoreGoalSELAlignment(goal, state.currentAssessment!);
        alignments.set(goal.id, alignment);
      });

      setState(prev => ({
        ...prev,
        goalAlignments: alignments
      }));

      return goals;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Goal creation failed';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [selEngine, state.currentAssessment, assessSELFromIKIGAI]);

  // Score individual goal alignment
  const scoreGoalAlignment = useCallback((goal: Goal): SELGoalAlignment | null => {
    if (!state.currentAssessment) {
      console.warn('SEL assessment required for goal alignment scoring');
      return null;
    }

    try {
      const alignment = selEngine.scoreGoalSELAlignment(goal, state.currentAssessment);
      
      setState(prev => ({
        ...prev,
        goalAlignments: new Map(prev.goalAlignments.set(goal.id, alignment))
      }));

      return alignment;
    } catch (error) {
      console.error('Goal alignment scoring failed:', error);
      return null;
    }
  }, [selEngine, state.currentAssessment]);

  // Update multiple goal alignments
  const updateGoalAlignments = useCallback((goals: Goal[]) => {
    if (!state.currentAssessment) return;

    const newAlignments = new Map<string, SELGoalAlignment>();
    
    goals.forEach(goal => {
      try {
        const alignment = selEngine.scoreGoalSELAlignment(goal, state.currentAssessment!);
        newAlignments.set(goal.id, alignment);
      } catch (error) {
        console.error(`Failed to score alignment for goal ${goal.id}:`, error);
      }
    });

    setState(prev => ({
      ...prev,
      goalAlignments: newAlignments
    }));
  }, [selEngine, state.currentAssessment]);

  // Generate SEL metrics
  const generateSELMetrics = useCallback((
    goals: Goal[],
    context: CulturalContext
  ): SuccessMetric[] => {
    if (!state.currentAssessment) {
      console.warn('SEL assessment required for metrics generation');
      return [];
    }

    try {
      const metrics = selEngine.generateSELSuccessMetrics(
        goals,
        state.currentAssessment,
        context
      );

      setState(prev => ({
        ...prev,
        selMetrics: metrics
      }));

      return metrics;
    } catch (error) {
      console.error('SEL metrics generation failed:', error);
      return [];
    }
  }, [selEngine, state.currentAssessment]);

  // Refresh assessment
  const refreshAssessment = useCallback(async () => {
    if (!currentSession || !culturalContext) {
      throw new Error('Session and cultural context required for refresh');
    }

    return assessSELFromIKIGAI(currentSession, culturalContext, state.currentAssessment || undefined);
  }, [currentSession, culturalContext, assessSELFromIKIGAI, state.currentAssessment]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-assessment effect
  useEffect(() => {
    if (autoAssess && currentSession && culturalContext && !state.currentAssessment) {
      const shouldAssess = !state.lastUpdated || 
        (Date.now() - state.lastUpdated.getTime()) > assessmentCacheTime;

      if (shouldAssess) {
        assessSELFromIKIGAI(currentSession, culturalContext).catch(error => {
          console.error('Auto-assessment failed:', error);
        });
      }
    }
  }, [autoAssess, currentSession, culturalContext, state.currentAssessment, state.lastUpdated, assessmentCacheTime, assessSELFromIKIGAI]);

  // Actions object
  const actions: SELAlignmentActions = useMemo(() => ({
    assessSELFromIKIGAI,
    createSELAlignedGoals,
    scoreGoalAlignment,
    updateGoalAlignments,
    generateSELMetrics,
    refreshAssessment,
    clearError
  }), [
    assessSELFromIKIGAI,
    createSELAlignedGoals,
    scoreGoalAlignment,
    updateGoalAlignments,
    generateSELMetrics,
    refreshAssessment,
    clearError
  ]);

  // Computed dashboard data
  const dashboardData: SELDashboardData | null = useMemo(() => {
    if (!state.currentAssessment) return null;

    const assessment = state.currentAssessment;
    
    return {
      overallSELScore: assessment.overallSELScore,
      competencyBreakdown: assessment.competencyScores.map(score => ({
        competencyId: score.competencyId,
        name: score.competencyId.replace('_', ' ').toUpperCase(),
        score: score.overallScore,
        developmentPriority: score.developmentPriority,
        culturalResonance: score.culturalResonance
      })),
      ikigaiAlignment: assessment.ikigaiAlignment,
      topStrengths: assessment.strengthAreas,
      developmentAreas: assessment.developmentAreas,
      recommendedActions: assessment.recommendedActivities,
      culturalIntegration: {
        alignment: assessment.culturalAlignment,
        considerations: assessment.culturalConsiderations,
        opportunities: state.integrationOpportunities.map(op => op.title)
      },
      progressTrends: assessment.competencyScores.map(score => ({
        competencyId: score.competencyId,
        trend: 'stable' as const, // Would be calculated from historical data
        changeRate: 0
      }))
    };
  }, [state.currentAssessment, state.integrationOpportunities]);

  // Utility functions
  const getGoalAlignment = useCallback((goalId: string): SELGoalAlignment | null => {
    return state.goalAlignments.get(goalId) || null;
  }, [state.goalAlignments]);

  const getCompetencyScore = useCallback((competencyId: string): number | null => {
    const score = state.currentAssessment?.competencyScores.find(s => s.competencyId === competencyId);
    return score?.overallScore || null;
  }, [state.currentAssessment]);

  const isAssessmentStale = useCallback((): boolean => {
    if (!state.lastUpdated) return true;
    return (Date.now() - state.lastUpdated.getTime()) > assessmentCacheTime;
  }, [state.lastUpdated, assessmentCacheTime]);

  const canCreateGoals = useCallback((): boolean => {
    return !!state.currentAssessment && !state.isAssessing;
  }, [state.currentAssessment, state.isAssessing]);

  return {
    // State
    ...state,
    currentSession,
    culturalContext,
    
    // Actions
    ...actions,
    
    // Setters
    setCurrentSession,
    setCulturalContext,
    
    // Computed data
    dashboardData,
    
    // Utility functions
    getGoalAlignment,
    getCompetencyScore,
    isAssessmentStale,
    canCreateGoals,
    
    // Status checks
    hasAssessment: !!state.currentAssessment,
    isReady: !!state.currentAssessment && !!culturalContext,
    needsRefresh: isAssessmentStale()
  };
};

// Specialized hook for SEL dashboard
export const useSELDashboard = (
  ikigaiSession?: IKIGAISession,
  culturalContext?: CulturalContext
) => {
  const selAlignment = useSELAlignment(ikigaiSession, culturalContext, {
    autoAssess: true,
    enableRealTimeUpdates: true
  });

  const [refreshing, setRefreshing] = useState(false);

  const refreshDashboard = useCallback(async () => {
    if (!selAlignment.canCreateGoals()) return;
    
    setRefreshing(true);
    try {
      await selAlignment.refreshAssessment();
    } catch (error) {
      console.error('Dashboard refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [selAlignment]);

  return {
    ...selAlignment,
    refreshing,
    refreshDashboard,
    
    // Dashboard-specific computed values
    competencyChart: selAlignment.dashboardData?.competencyBreakdown || [],
    strengthsAndGaps: {
      strengths: selAlignment.dashboardData?.topStrengths || [],
      gaps: selAlignment.dashboardData?.developmentAreas || []
    },
    culturalIntegrationStatus: selAlignment.dashboardData?.culturalIntegration || {
      alignment: 0,
      considerations: [],
      opportunities: []
    },
    progressIndicators: selAlignment.dashboardData?.progressTrends || [],
    
    // Quick actions
    hasHighPriorityDevelopmentAreas: () => 
      selAlignment.currentAssessment?.competencyScores.some(s => s.developmentPriority === 'high') || false,
    
    getTopDevelopmentArea: () => 
      selAlignment.currentAssessment?.competencyScores
        .filter(s => s.developmentPriority === 'high')
        .sort((a, b) => a.overallScore - b.overallScore)[0]?.competencyId || null,
    
    getCulturalResonanceLevel: () => {
      const scores = selAlignment.currentAssessment?.competencyScores || [];
      const avgResonance = scores.reduce((sum, s) => sum + s.culturalResonance, 0) / scores.length;
      return avgResonance > 0.8 ? 'high' : avgResonance > 0.6 ? 'medium' : 'low';
    }
  };
};

// Helper function for integrating SEL with bootcamp progression
export const integrateSELWithBootcamp = (
  bootcamp: IKIGAIBootcamp,
  selAssessment: SELAssessment,
  culturalContext: CulturalContext
): {
  enhancedBootcamp: IKIGAIBootcamp;
  selIntegrationNotes: string[];
  recommendedAdjustments: string[];
} => {
  
  const selIntegrationNotes = [
    `SEL overall score: ${selAssessment.overallSELScore.toFixed(1)}/5.0`,
    `Cultural alignment: ${(selAssessment.culturalAlignment * 100).toFixed(0)}%`,
    `Development priorities: ${selAssessment.developmentAreas.join(', ')}`
  ];

  const recommendedAdjustments = [];
  
  // Adjust session pacing based on SEL scores
  const avgSELScore = selAssessment.overallSELScore;
  if (avgSELScore < 3) {
    recommendedAdjustments.push('Consider extended session timeframes to allow for SEL skill building');
  }
  
  // Cultural integration recommendations
  if (selAssessment.culturalAlignment < 0.7) {
    recommendedAdjustments.push('Increase cultural adaptation elements in sessions');
  }

  // Add SEL integration opportunities to bootcamp sessions
  const enhancedSessions = bootcamp.sessions.map(session => ({
    ...session,
    // Add SEL development opportunities to each session
    selIntegrationOpportunities: selAssessment.ikigaiAlignment.integrationOpportunities
      .filter(op => op.culturalRelevance > 0.6)
      .slice(0, 2) // Limit to top 2 opportunities per session
  }));

  const enhancedBootcamp: IKIGAIBootcamp = {
    ...bootcamp,
    sessions: enhancedSessions,
    // Enhance personal growth plan with SEL elements
    personalGrowthPlan: {
      ...bootcamp.personalGrowthPlan,
      keyStrengths: [
        ...bootcamp.personalGrowthPlan.keyStrengths,
        ...selAssessment.strengthAreas.map(area => `SEL: ${area}`)
      ],
      developmentAreas: [
        ...bootcamp.personalGrowthPlan.developmentAreas,
        ...selAssessment.developmentAreas.map(area => `SEL: ${area}`)
      ]
    }
  };

  return {
    enhancedBootcamp,
    selIntegrationNotes,
    recommendedAdjustments
  };
};

export default useSELAlignment;