/**
 * ALCHM Predictive Wellness Dashboard
 * 
 * Comprehensive dashboard component that integrates all predictive wellness
 * systems into a trauma-informed, culturally competent interface. Displays
 * neuroplasticity patterns, wellness trajectories, habit formation readiness,
 * crisis prevention indicators, intervention timing, and resilience building
 * opportunities in real-time.
 * 
 * Key Features:
 * - Real-time predictive analytics visualization
 * - Trauma-informed design principles
 * - Cultural competency in data presentation
 * - Neuroplasticity-optimized user experience
 * - Crisis-safe interaction patterns
 * - Personalized insight delivery
 * 
 * Design Philosophy:
 * - Safety first in all interactions
 * - Empowerment through understanding
 * - Choice and agency in all features
 * - Beautiful, calming visual design
 * - Accessible to all nervous system states
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Brain, TrendingUp, Shield, Clock, Heart, Sparkles, Activity, Users, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import prediction engines
import { NeuroplasticityPredictionEngine, type NeuroplasticityPrediction } from '@/ai/neuroplasticity-prediction-engine';
import { WellnessTrajectoryEngine, type WellnessTrajectory } from '@/ai/wellness-trajectory-modeling';
import { HabitFormationPredictor, type HabitFormationPrediction } from '@/ai/habit-formation-predictor';
import { CrisisPreventionEngine, type CrisisPreventionAssessment } from '@/ai/crisis-prevention-indicators';
import { InterventionTimingOptimizer, type InterventionTimingOptimization } from '@/ai/intervention-timing-optimizer';
import { ResilienceBuildingPredictor, type ResilienceBuildingPrediction } from '@/ai/resilience-building-predictor';

interface PredictiveWellnessDashboardProps {
  userId: string;
  currentWellnessData: any;
  historicalData: any;
  culturalContext: any;
  userPreferences: any;
  onInterventionSelect?: (intervention: any) => void;
  onHabitStart?: (habit: any) => void;
  onCrisisAlert?: (alert: any) => void;
}

interface DashboardState {
  predictions: {
    neuroplasticity?: NeuroplasticityPrediction;
    wellness_trajectory?: WellnessTrajectory;
    habit_formation?: HabitFormationPrediction;
    crisis_prevention?: CrisisPreventionAssessment;
    intervention_timing?: InterventionTimingOptimization;
    resilience_building?: ResilienceBuildingPrediction;
  };
  loading: {
    neuroplasticity: boolean;
    wellness_trajectory: boolean;
    habit_formation: boolean;
    crisis_prevention: boolean;
    intervention_timing: boolean;
    resilience_building: boolean;
  };
  errors: Record<string, string | null>;
  lastUpdated: Date | null;
  autoRefresh: boolean;
  selectedTimeframe: 'immediate' | 'week' | 'month';
  selectedFocus: 'overview' | 'neuroplasticity' | 'habits' | 'crisis' | 'timing' | 'resilience';
}

export default function PredictiveWellnessDashboard({
  userId,
  currentWellnessData,
  historicalData,
  culturalContext,
  userPreferences,
  onInterventionSelect,
  onHabitStart,
  onCrisisAlert
}: PredictiveWellnessDashboardProps) {
  
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    predictions: {},
    loading: {
      neuroplasticity: true,
      wellness_trajectory: true,
      habit_formation: true,
      crisis_prevention: true,
      intervention_timing: true,
      resilience_building: true
    },
    errors: {},
    lastUpdated: null,
    autoRefresh: true,
    selectedTimeframe: 'week',
    selectedFocus: 'overview'
  });
  
  // Generate all predictions
  const generatePredictions = useCallback(async () => {
    setDashboardState(prev => ({
      ...prev,
      loading: {
        neuroplasticity: true,
        wellness_trajectory: true,
        habit_formation: true,
        crisis_prevention: true,
        intervention_timing: true,
        resilience_building: true
      },
      errors: {}
    }));
    
    try {
      // Generate predictions in parallel for performance
      const [
        neuroplasticityPrediction,
        wellnessTrajectory,
        habitFormationPrediction,
        crisisAssessment,
        interventionTiming,
        resiliencePrediction
      ] = await Promise.allSettled([
        NeuroplasticityPredictionEngine.generatePredictions({
          user_id: userId,
          current_neural_state: currentWellnessData.neural_state,
          recent_journal_entries: currentWellnessData.journal_entries,
          intervention_history: historicalData.interventions,
          trauma_profile: currentWellnessData.trauma_profile,
          circadian_profile: historicalData.circadian_profile
        }),
        WellnessTrajectoryEngine.generateTrajectoryModel(
          userId,
          {
            recent_journal_entries: currentWellnessData.journal_entries,
            mood_tracking_data: currentWellnessData.mood_data,
            intervention_history: historicalData.interventions,
            trauma_assessment: currentWellnessData.trauma_assessment,
            neuroplasticity_patterns: []
          },
          {
            baseline_measurements: historicalData.baseline,
            long_term_patterns: historicalData.patterns,
            significant_events: historicalData.events,
            cultural_context: culturalContext
          }
        ),
        HabitFormationPredictor.predictHabitFormationReadiness(
          userId,
          {
            wellness_trajectory: {} as WellnessTrajectory, // Will be filled after trajectory generation
            neuroplasticity_patterns: [],
            trauma_assessment: currentWellnessData.trauma_assessment,
            circadian_profile: historicalData.circadian_profile,
            intervention_history: historicalData.interventions,
            current_habits: currentWellnessData.current_habits
          },
          {
            desired_habit_categories: userPreferences.habit_categories || ['emotional_regulation'],
            urgency_level: 'moderate',
            specific_habit_requests: userPreferences.specific_habits || [],
            constraints: []
          }
        ),
        CrisisPreventionEngine.generateCrisisPreventionAssessment(
          userId,
          {
            wellness_trajectory: {} as WellnessTrajectory, // Will be filled after trajectory generation
            neuroplasticity_patterns: [],
            trauma_assessment: currentWellnessData.trauma_assessment,
            recent_journal_entries: currentWellnessData.journal_entries,
            mood_tracking_data: currentWellnessData.mood_data,
            intervention_history: historicalData.interventions,
            social_context: currentWellnessData.social_context,
            environmental_factors: currentWellnessData.environmental_factors,
            cultural_background: culturalContext
          }
        ),
        InterventionTimingOptimizer.optimizeInterventionTiming(
          userId,
          {
            neuroplasticity_patterns: [],
            wellness_trajectory: {} as WellnessTrajectory, // Will be filled after trajectory generation
            crisis_assessment: {} as CrisisPreventionAssessment, // Will be filled after crisis assessment
            trauma_assessment: currentWellnessData.trauma_assessment,
            circadian_profile: historicalData.circadian_profile,
            intervention_history: historicalData.interventions,
            current_interventions: currentWellnessData.current_interventions,
            user_preferences: userPreferences,
            cultural_context: culturalContext,
            environmental_factors: currentWellnessData.environmental_factors
          }
        ),
        ResilienceBuildingPredictor.generateResilienceBuildingPrediction(
          userId,
          {
            wellness_trajectory: {} as WellnessTrajectory, // Will be filled after trajectory generation
            neuroplasticity_patterns: [],
            crisis_assessment: {} as CrisisPreventionAssessment, // Will be filled after crisis assessment
            trauma_assessment: currentWellnessData.trauma_assessment,
            intervention_timing: {} as InterventionTimingOptimization, // Will be filled after timing optimization
            intervention_history: historicalData.interventions,
            life_experiences: historicalData.life_experiences,
            cultural_context: culturalContext,
            social_support_network: currentWellnessData.social_context,
            personal_values: userPreferences.values,
            current_challenges: currentWellnessData.current_challenges
          }
        )
      ]);
      
      // Update state with successful predictions
      const newPredictions: any = {};
      const newErrors: any = {};
      const newLoading = {
        neuroplasticity: false,
        wellness_trajectory: false,
        habit_formation: false,
        crisis_prevention: false,
        intervention_timing: false,
        resilience_building: false
      };
      
      if (neuroplasticityPrediction.status === 'fulfilled') {
        newPredictions.neuroplasticity = neuroplasticityPrediction.value;
      } else {
        newErrors.neuroplasticity = 'Failed to generate neuroplasticity prediction';
      }
      
      if (wellnessTrajectory.status === 'fulfilled') {
        newPredictions.wellness_trajectory = wellnessTrajectory.value;
      } else {
        newErrors.wellness_trajectory = 'Failed to generate wellness trajectory';
      }
      
      if (habitFormationPrediction.status === 'fulfilled') {
        newPredictions.habit_formation = habitFormationPrediction.value;
      } else {
        newErrors.habit_formation = 'Failed to generate habit formation prediction';
      }
      
      if (crisisAssessment.status === 'fulfilled') {
        newPredictions.crisis_prevention = crisisAssessment.value;
        
        // Alert if crisis risk is high
        if (crisisAssessment.value.overall_crisis_risk.risk_category === 'high' ||
            crisisAssessment.value.overall_crisis_risk.risk_category === 'critical') {
          onCrisisAlert?.(crisisAssessment.value);
        }
      } else {
        newErrors.crisis_prevention = 'Failed to generate crisis assessment';
      }
      
      if (interventionTiming.status === 'fulfilled') {
        newPredictions.intervention_timing = interventionTiming.value;
      } else {
        newErrors.intervention_timing = 'Failed to optimize intervention timing';
      }
      
      if (resiliencePrediction.status === 'fulfilled') {
        newPredictions.resilience_building = resiliencePrediction.value;
      } else {
        newErrors.resilience_building = 'Failed to generate resilience prediction';
      }
      
      setDashboardState(prev => ({
        ...prev,
        predictions: newPredictions,
        loading: newLoading,
        errors: newErrors,
        lastUpdated: new Date()
      }));
      
    } catch (error) {
      console.error('Error generating predictions:', error);
      setDashboardState(prev => ({
        ...prev,
        loading: {
          neuroplasticity: false,
          wellness_trajectory: false,
          habit_formation: false,
          crisis_prevention: false,
          intervention_timing: false,
          resilience_building: false
        },
        errors: {
          general: 'Failed to generate predictions. Please try again.'
        }
      }));
    }
  }, [userId, currentWellnessData, historicalData, culturalContext, userPreferences, onCrisisAlert]);
  
  // Auto-refresh predictions
  useEffect(() => {
    generatePredictions();
    
    if (dashboardState.autoRefresh) {
      const interval = setInterval(generatePredictions, 10 * 60 * 1000); // Every 10 minutes
      return () => clearInterval(interval);
    }
  }, [generatePredictions, dashboardState.autoRefresh]);
  
  // Crisis risk indicator
  const crisisRiskLevel = useMemo(() => {
    if (!dashboardState.predictions.crisis_prevention) return 'unknown';
    return dashboardState.predictions.crisis_prevention.overall_crisis_risk.risk_category;
  }, [dashboardState.predictions.crisis_prevention]);
  
  // Overall wellness trajectory
  const wellnessTrajectoryDirection = useMemo(() => {
    if (!dashboardState.predictions.wellness_trajectory) return 'unknown';
    return dashboardState.predictions.wellness_trajectory.trajectory_momentum.overall_direction;
  }, [dashboardState.predictions.wellness_trajectory]);
  
  // Immediate opportunities count
  const immediateOpportunities = useMemo(() => {
    const opportunities = [];
    
    if (dashboardState.predictions.habit_formation?.immediate_windows) {
      opportunities.push(...dashboardState.predictions.habit_formation.immediate_windows);
    }
    
    if (dashboardState.predictions.resilience_building?.immediate_resilience_opportunities) {
      opportunities.push(...dashboardState.predictions.resilience_building.immediate_resilience_opportunities);
    }
    
    if (dashboardState.predictions.intervention_timing?.immediate_intervention_opportunities) {
      opportunities.push(...dashboardState.predictions.intervention_timing.immediate_intervention_opportunities);
    }
    
    return opportunities;
  }, [dashboardState.predictions]);
  
  const getCrisisRiskColor = (level: string) => {
    switch (level) {
      case 'minimal': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-green-100 text-green-700';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'imminent': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  const getTrajectoryIcon = (direction: string) => {
    switch (direction) {
      case 'upward': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'stable': return <Activity className="w-4 h-4 text-blue-600" />;
      case 'downward': return <TrendingUp className="w-4 h-4 text-orange-600 rotate-180" />;
      case 'volatile': return <Activity className="w-4 h-4 text-purple-600" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header with safety indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Predictive Wellness Insights</h1>
          <Badge className={getCrisisRiskColor(crisisRiskLevel)}>
            <Shield className="w-3 h-3 mr-1" />
            Safety Level: {crisisRiskLevel}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generatePredictions}
            disabled={Object.values(dashboardState.loading).some(Boolean)}
          >
            {Object.values(dashboardState.loading).some(Boolean) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            ) : (
              'Refresh Insights'
            )}
          </Button>
          
          <Button
            variant={dashboardState.autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDashboardState(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }))}
          >
            Auto-refresh: {dashboardState.autoRefresh ? 'On' : 'Off'}
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wellness Trajectory */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              {getTrajectoryIcon(wellnessTrajectoryDirection)}
              <span className="ml-2">Wellness Trajectory</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 capitalize">
              {wellnessTrajectoryDirection}
            </div>
            {dashboardState.predictions.wellness_trajectory && (
              <p className="text-xs text-gray-500 mt-1">
                Next milestone predicted in{' '}
                {Math.round(
                  (new Date(dashboardState.predictions.wellness_trajectory.growth_opportunity_windows[0]?.start_date_predicted).getTime() - Date.now()) / 
                  (1000 * 60 * 60 * 24)
                )} days
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Neuroplasticity Windows */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Brain className="w-4 h-4" />
              <span className="ml-2">Optimal Learning Windows</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardState.predictions.neuroplasticity?.optimal_plasticity_windows?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available in next 24 hours
            </p>
          </CardContent>
        </Card>
        
        {/* Habit Formation Readiness */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Target className="w-4 h-4" />
              <span className="ml-2">Habit Formation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardState.predictions.habit_formation?.overall_habit_formation_readiness || 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Readiness Score
            </p>
          </CardContent>
        </Card>
        
        {/* Immediate Opportunities */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Sparkles className="w-4 h-4" />
              <span className="ml-2">Immediate Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {immediateOpportunities.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ready to engage with now
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Focus Selection */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { key: 'overview', label: 'Overview', icon: Activity },
          { key: 'neuroplasticity', label: 'Brain Optimization', icon: Brain },
          { key: 'habits', label: 'Habit Formation', icon: Target },
          { key: 'crisis', label: 'Crisis Prevention', icon: Shield },
          { key: 'timing', label: 'Optimal Timing', icon: Clock },
          { key: 'resilience', label: 'Resilience Building', icon: Heart }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={dashboardState.selectedFocus === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDashboardState(prev => ({ ...prev, selectedFocus: key as any }))}
            className="flex items-center space-x-1 whitespace-nowrap"
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </Button>
        ))}
      </div>
      
      {/* Crisis Alert */}
      {crisisRiskLevel === 'high' || crisisRiskLevel === 'critical' || crisisRiskLevel === 'imminent' ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Wellness Support Needed</h3>
              <p className="text-red-700">
                Our analysis indicates you may benefit from additional support right now. 
                Would you like to connect with crisis resources or adjust your support plan?
              </p>
              {dashboardState.predictions.crisis_prevention?.immediate_interventions && (
                <div className="mt-3 space-x-2">
                  {dashboardState.predictions.crisis_prevention.immediate_interventions.slice(0, 2).map((intervention, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => onInterventionSelect?.(intervention)}
                    >
                      {intervention.intervention_name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Neuroplasticity Focus */}
          {dashboardState.selectedFocus === 'neuroplasticity' && dashboardState.predictions.neuroplasticity && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Neuroplasticity Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Current Neural Readiness</h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${dashboardState.predictions.neuroplasticity.habit_formation_probability}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {dashboardState.predictions.neuroplasticity.habit_formation_probability}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Optimal Learning Windows Today</h4>
                    <div className="space-y-2">
                      {dashboardState.predictions.neuroplasticity.optimal_plasticity_windows.slice(0, 3).map((window, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div>
                            <div className="font-medium text-purple-900">
                              {new Date(window.start_time * 60 * 60 * 1000 + Date.now()).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                            <div className="text-sm text-purple-700">
                              Plasticity Score: {window.plasticity_score}%
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {window.neural_mechanisms_active.length} mechanisms active
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Habit Formation Focus */}
          {dashboardState.selectedFocus === 'habits' && dashboardState.predictions.habit_formation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Habit Formation Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">
                        {dashboardState.predictions.habit_formation.overall_habit_formation_readiness}%
                      </div>
                      <div className="text-sm text-green-600">Overall Readiness</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">
                        {dashboardState.predictions.habit_formation.success_probabilities.overall_success_probability}%
                      </div>
                      <div className="text-sm text-blue-600">Success Probability</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700">
                        {dashboardState.predictions.habit_formation.recommended_habits.length}
                      </div>
                      <div className="text-sm text-purple-600">Recommended Habits</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Top Habit Recommendations</h4>
                    <div className="space-y-3">
                      {dashboardState.predictions.habit_formation.recommended_habits.slice(0, 3).map((habit, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{habit.habit_name}</h5>
                              <p className="text-sm text-gray-600 mt-1">{habit.habit_description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {habit.habit_category.replace('_', ' ')}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Success Rate: {habit.success_probability}%
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => onHabitStart?.(habit)}
                              className="ml-4"
                            >
                              Start Habit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Resilience Building Focus */}
          {dashboardState.selectedFocus === 'resilience' && dashboardState.predictions.resilience_building && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-pink-600" />
                  Resilience Building
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Current Resilience Profile</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { 
                          name: 'Emotional', 
                          score: dashboardState.predictions.resilience_building.current_resilience_profile.emotional_resilience.current_score,
                          color: 'bg-pink-500'
                        },
                        { 
                          name: 'Cognitive', 
                          score: dashboardState.predictions.resilience_building.current_resilience_profile.cognitive_resilience.current_score,
                          color: 'bg-blue-500'
                        },
                        { 
                          name: 'Social', 
                          score: dashboardState.predictions.resilience_building.current_resilience_profile.social_resilience.current_score,
                          color: 'bg-green-500'
                        },
                        { 
                          name: 'Somatic', 
                          score: dashboardState.predictions.resilience_building.current_resilience_profile.somatic_resilience.current_score,
                          color: 'bg-orange-500'
                        },
                        { 
                          name: 'Spiritual', 
                          score: dashboardState.predictions.resilience_building.current_resilience_profile.spiritual_resilience.current_score,
                          color: 'bg-purple-500'
                        },
                        { 
                          name: 'Behavioral', 
                          score: dashboardState.predictions.resilience_building.current_resilience_profile.behavioral_resilience.current_score,
                          color: 'bg-indigo-500'
                        }
                      ].map((dimension, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{dimension.name}</span>
                            <span className="text-sm text-gray-600">{Math.round(dimension.score)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${dimension.color}`}
                              style={{ width: `${dimension.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Immediate Opportunities</h4>
                    <div className="space-y-3">
                      {dashboardState.predictions.resilience_building.immediate_resilience_opportunities.slice(0, 2).map((opportunity, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{opportunity.opportunity_type.replace('_', ' ')}</h5>
                              <p className="text-sm text-gray-600 mt-1">{opportunity.opportunity_description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {opportunity.duration_minutes} minutes
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Building Potential: {opportunity.resilience_building_potential}%
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="ml-4 border-pink-300 text-pink-700 hover:bg-pink-50"
                            >
                              Try Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Overview Focus - Combined insights */}
          {dashboardState.selectedFocus === 'overview' && (
            <div className="space-y-6">
              {/* Wellness Trajectory Overview */}
              {dashboardState.predictions.wellness_trajectory && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Wellness Trajectory Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Current Wellness Coordinates</h4>
                        <div className="space-y-2">
                          {[
                            { label: 'Emotional Wellbeing', value: dashboardState.predictions.wellness_trajectory.current_wellness_coordinates.emotional_wellbeing },
                            { label: 'Psychological Safety', value: dashboardState.predictions.wellness_trajectory.current_wellness_coordinates.psychological_safety },
                            { label: 'Daily Functioning', value: dashboardState.predictions.wellness_trajectory.current_wellness_coordinates.daily_functioning },
                            { label: 'Growth Orientation', value: dashboardState.predictions.wellness_trajectory.current_wellness_coordinates.growth_orientation }
                          ].map((coordinate, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{coordinate.label}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${coordinate.value}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-8">{Math.round(coordinate.value)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Trajectory Momentum</h4>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTrajectoryIcon(dashboardState.predictions.wellness_trajectory.trajectory_momentum.overall_direction)}
                            <span className="font-medium capitalize">
                              {dashboardState.predictions.wellness_trajectory.trajectory_momentum.overall_direction}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Momentum Strength: {dashboardState.predictions.wellness_trajectory.trajectory_momentum.momentum_strength}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Today's Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-yellow-600" />
                    Today's Growth Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {immediateOpportunities.slice(0, 4).map((opportunity, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg hover:border-yellow-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 text-sm">
                              {opportunity.intervention_name || opportunity.opportunity_type?.replace('_', ' ') || 'Growth Opportunity'}
                            </h5>
                            <p className="text-xs text-gray-600 mt-1">
                              {opportunity.intervention_description || opportunity.opportunity_description || 'Ready to engage with now'}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {opportunity.duration_minutes || opportunity.optimal_timing?.duration_minutes || 10} min
                              </Badge>
                              {opportunity.urgency_level && (
                                <Badge variant={opportunity.urgency_level === 'immediate' ? 'destructive' : 'secondary'} className="text-xs">
                                  {opportunity.urgency_level}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="ml-2 text-xs">
                            Try
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {immediateOpportunities.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No immediate opportunities detected.</p>
                      <p className="text-sm">Check back later or refresh your insights.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium">
                  {dashboardState.lastUpdated ? 
                    dashboardState.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                    'Never'
                  }
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Prediction Confidence</span>
                <span className="text-sm font-medium">
                  {dashboardState.predictions.neuroplasticity?.prediction_confidence || 0}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next Optimal Window</span>
                <span className="text-sm font-medium">
                  {dashboardState.predictions.intervention_timing?.next_optimal_window ? 
                    new Date(dashboardState.predictions.intervention_timing.next_optimal_window.start_datetime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 
                    'Calculating...'
                  }
                </span>
              </div>
            </CardContent>
          </Card>
          
          {/* Safety Resources */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Safety Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start text-left">
                <span>Crisis Support Hotline</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-left">
                <span>Emergency Contacts</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-left">
                <span>Safety Plan</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-left">
                <span>Grounding Exercises</span>
              </Button>
            </CardContent>
          </Card>
          
          {/* Community Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Community Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                Connect with others on similar journeys
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Find Support Groups
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Peer Mentorship
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}