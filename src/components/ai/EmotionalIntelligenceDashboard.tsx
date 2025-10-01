'use client';

/**
 * ALCHM Emotional Intelligence Dashboard
 * Advanced visualization and interaction component for emotional intelligence systems
 * Philosophy: "Data becomes wisdom when seen through the lens of compassion"
 * 
 * Features:
 * - Real-time emotional state visualization
 * - Pattern recognition displays
 * - Cultural emotion recognition
 * - Trauma-informed insights
 * - Calibration feedback interface
 * - Cross-cultural emotional learning
 * - Privacy-preserving analytics
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

// Import emotional intelligence systems
import { QuantumEmotionalState, advancedEmotionDetector } from '@/ai/advanced-emotional-intelligence';
import { EmotionalPattern, EmotionalTrajectory, emotionalPatternEngine } from '@/ai/emotional-pattern-engine';
import { EmotionalContext, ContextualEmotionalInsight, contextualEmotionAnalyzer } from '@/ai/contextual-emotion-analyzer';
import { TraumaInformedProfile, TraumaInformedResponse, traumaInformedResponseEngine } from '@/ai/trauma-informed-response-system';
import { PersonalEmotionalVocabulary, emotionalCalibrationEngine } from '@/ai/emotional-calibration-engine';
import { CulturalEmotionalFramework, CrossCulturalEmotionalInsight, crossCulturalEmotionalRecognitionEngine } from '@/ai/cultural-emotion-recognition';

// Types for dashboard
interface EmotionalIntelligenceDashboardProps {
  userId: string;
  currentJournalText?: string;
  culturalContext?: {
    primary_cultural_identity: string[];
    language_codes: string[];
    cultural_fluency_level: number;
    bicultural_navigation: boolean;
    generational_status: string;
  };
  onCalibrationFeedback?: (feedback: CalibrationFeedback) => void;
  onInsightRequest?: (insightType: string) => void;
  className?: string;
}

interface CalibrationFeedback {
  accuracy_rating: number;
  intensity_rating: number;
  missing_aspects: string[];
  cultural_context: string;
  personal_meaning: string;
}

interface DashboardState {
  currentEmotionalState: QuantumEmotionalState | null;
  emotionalPatterns: EmotionalPattern[];
  emotionalTrajectory: EmotionalTrajectory | null;
  contextualInsight: ContextualEmotionalInsight | null;
  traumaInformedProfile: TraumaInformedProfile | null;
  traumaInformedResponse: TraumaInformedResponse | null;
  personalVocabulary: PersonalEmotionalVocabulary | null;
  culturalInsight: CrossCulturalEmotionalInsight | null;
  isAnalyzing: boolean;
  selectedView: 'overview' | 'patterns' | 'cultural' | 'trauma' | 'calibration';
  showCalibrationFeedback: boolean;
  calibrationAccuracy: number;
}

const EmotionalIntelligenceDashboard: React.FC<EmotionalIntelligenceDashboardProps> = ({
  userId,
  currentJournalText = '',
  culturalContext,
  onCalibrationFeedback,
  onInsightRequest,
  className = ''
}) => {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    currentEmotionalState: null,
    emotionalPatterns: [],
    emotionalTrajectory: null,
    contextualInsight: null,
    traumaInformedProfile: null,
    traumaInformedResponse: null,
    personalVocabulary: null,
    culturalInsight: null,
    isAnalyzing: false,
    selectedView: 'overview',
    showCalibrationFeedback: false,
    calibrationAccuracy: 0
  });

  const [calibrationFeedback, setCalibrationFeedback] = useState<CalibrationFeedback>({
    accuracy_rating: 3,
    intensity_rating: 3,
    missing_aspects: [],
    cultural_context: '',
    personal_meaning: ''
  });

  /**
   * Analyze emotional intelligence across all systems
   */
  const analyzeEmotionalIntelligence = useCallback(async () => {
    if (!currentJournalText.trim()) return;

    setDashboardState(prev => ({ ...prev, isAnalyzing: true }));

    try {
      // 1. Advanced emotion detection
      const emotionalState = await advancedEmotionDetector.detectQuantumEmotionalState(
        currentJournalText,
        {
          userId,
          locale: culturalContext?.language_codes[0] || 'en',
          timeContext: new Date().toISOString()
        }
      );

      // 2. Contextual analysis
      const contextualInsight = await contextualEmotionAnalyzer.analyzeEmotionWithContext(
        emotionalState,
        createEmotionalContext(),
        {
          cultural_identity: culturalContext?.primary_cultural_identity || ['western_individualistic'],
          age: 30, // Would come from user profile
          life_stage: 'adult',
          emotional_patterns: [],
          previous_contexts: []
        }
      );

      // 3. Cultural recognition
      let culturalInsight: CrossCulturalEmotionalInsight | null = null;
      if (culturalContext) {
        culturalInsight = await crossCulturalEmotionalRecognitionEngine.recognizeCulturalEmotions(
          emotionalState,
          currentJournalText,
          culturalContext
        );
      }

      // 4. Personal vocabulary calibration
      const personalVocabulary = await emotionalCalibrationEngine.initializeUserVocabulary(
        userId,
        {
          cultural_background: culturalContext?.primary_cultural_identity || [],
          primary_language: culturalContext?.language_codes[0] || 'en',
          emotional_awareness_level: 0.7,
          preferred_communication_style: 'direct_gentle'
        }
      );

      // 5. Apply calibration
      const calibratedResult = await emotionalCalibrationEngine.applyPersonalCalibration(
        userId,
        emotionalState,
        currentJournalText
      );

      // 6. Trauma-informed analysis
      const traumaProfile = await traumaInformedResponseEngine.buildTraumaInformedProfile(
        userId,
        [calibratedResult.calibrated_emotional_state],
        [{ content: currentJournalText, timestamp: new Date() }]
      );

      const traumaResponse = await traumaInformedResponseEngine.generateTraumaInformedResponse(
        calibratedResult.calibrated_emotional_state,
        createEmotionalContext(),
        traumaProfile,
        currentJournalText
      );

      setDashboardState(prev => ({
        ...prev,
        currentEmotionalState: calibratedResult.calibrated_emotional_state,
        contextualInsight,
        culturalInsight,
        personalVocabulary,
        traumaInformedProfile: traumaProfile,
        traumaInformedResponse: traumaResponse,
        calibrationAccuracy: calibratedResult.calibration_confidence,
        isAnalyzing: false
      }));

    } catch (error) {
      console.error('Error analyzing emotional intelligence:', error);
      setDashboardState(prev => ({ ...prev, isAnalyzing: false }));
    }
  }, [currentJournalText, userId, culturalContext]);

  /**
   * Create emotional context for analysis
   */
  const createEmotionalContext = (): EmotionalContext => {
    const now = new Date();
    return {
      temporal: {
        time_of_day: now.getHours(),
        day_of_week: now.getDay(),
        month: now.getMonth() + 1,
        season: getSeason(now),
        circadian_rhythm_alignment: 0.7,
        temporal_emotional_signature: {
          morning_energy: 0.7,
          afternoon_focus: 0.8,
          evening_winding: 0.6,
          night_processing: 0.5
        },
        life_phase: 'adult',
        recent_major_events: []
      },
      social: {
        relationship_status: 'single',
        family_dynamics: {
          family_support_level: 0.7,
          family_stress_level: 0.3,
          intergenerational_patterns: [],
          cultural_family_expectations: []
        },
        social_support_network: {
          network_size: 5,
          intimacy_level: 0.6,
          diversity_score: 0.5,
          reciprocity_balance: 0.7,
          recent_social_changes: []
        },
        community_connection: {
          belonging_sense: 0.6,
          community_roles: [],
          social_isolation_risk: 0.3,
          cultural_community_ties: 0.5
        },
        social_stressors: {
          interpersonal_conflict: 0.2,
          social_anxiety_triggers: [],
          boundary_challenges: [],
          social_comparison_pressure: 0.4
        }
      },
      environmental: {
        physical_location: {
          type: 'home',
          safety_perception: 0.8,
          comfort_level: 0.9,
          privacy_level: 0.9,
          sensory_environment: {
            noise_level: 0.3,
            lighting_quality: 0.7,
            temperature_comfort: 0.8,
            air_quality: 0.8
          }
        },
        weather_influence: {
          current_weather: 'clear',
          seasonal_affective_sensitivity: 0.3,
          weather_mood_correlation: 0.2,
          light_exposure_adequacy: 0.7
        },
        digital_environment: {
          screen_time_today: 6,
          social_media_mood_impact: 0.1,
          information_overload_risk: 0.4,
          digital_boundary_health: 0.6
        },
        economic_context: {
          financial_stress_level: 0.3,
          housing_stability: 0.8,
          economic_mobility_hope: 0.6,
          resource_scarcity_anxiety: 0.2
        }
      },
      life_events: {
        recent_transitions: [],
        developmental_milestones: [],
        ongoing_challenges: [],
        celebration_moments: []
      },
      cultural: {
        primary_cultural_identity: culturalContext?.primary_cultural_identity || ['western_individualistic'],
        cultural_expression_comfort: 0.7,
        cultural_value_conflicts: [],
        cultural_healing_traditions: [],
        cultural_emotional_norms: {
          directness_preference: 0.8,
          emotional_intensity_scaling: 1.0,
          collective_vs_individual_focus: 0.3,
          hierarchical_consideration: 0.4
        },
        acculturation_stress: {
          identity_navigation_challenge: 0.3,
          language_code_switching_fatigue: 0.2,
          cultural_bridge_building_effort: 0.4
        },
        spiritual_context: {
          spiritual_practice_engagement: 0.5,
          meaning_making_resources: [],
          existential_questioning_intensity: 0.4,
          transcendent_connection_access: 0.6
        }
      },
      micro_context: {
        immediate_triggers: [],
        physical_sensations: [],
        cognitive_state: 'clear',
        energy_level: 0.7,
        stress_load: 0.3,
        recent_interactions: [],
        substance_influences: {
          caffeine_influence: 0.3,
          alcohol_influence: 0.0,
          medication_influence: 0.0,
          natural_substances: []
        }
      }
    };
  };

  /**
   * Get current season
   */
  const getSeason = (date: Date): 'spring' | 'summer' | 'fall' | 'winter' => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  /**
   * Handle calibration feedback submission
   */
  const handleCalibrationFeedback = () => {
    if (onCalibrationFeedback) {
      onCalibrationFeedback(calibrationFeedback);
    }
    setDashboardState(prev => ({ ...prev, showCalibrationFeedback: false }));
  };

  /**
   * Handle view selection
   */
  const handleViewChange = (view: DashboardState['selectedView']) => {
    setDashboardState(prev => ({ ...prev, selectedView: view }));
  };

  // Auto-analyze when text changes
  useEffect(() => {
    if (currentJournalText.trim()) {
      analyzeEmotionalIntelligence();
    }
  }, [currentJournalText, analyzeEmotionalIntelligence]);

  return (
    <div className={`emotional-intelligence-dashboard space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Emotional Intelligence Dashboard
        </h2>
        <div className="flex space-x-2">
          <Button
            variant={dashboardState.selectedView === 'overview' ? 'default' : 'outline'}
            onClick={() => handleViewChange('overview')}
            size="sm"
          >
            Overview
          </Button>
          <Button
            variant={dashboardState.selectedView === 'patterns' ? 'default' : 'outline'}
            onClick={() => handleViewChange('patterns')}
            size="sm"
          >
            Patterns
          </Button>
          <Button
            variant={dashboardState.selectedView === 'cultural' ? 'default' : 'outline'}
            onClick={() => handleViewChange('cultural')}
            size="sm"
          >
            Cultural
          </Button>
          <Button
            variant={dashboardState.selectedView === 'trauma' ? 'default' : 'outline'}
            onClick={() => handleViewChange('trauma')}
            size="sm"
          >
            Trauma-Informed
          </Button>
          <Button
            variant={dashboardState.selectedView === 'calibration' ? 'default' : 'outline'}
            onClick={() => handleViewChange('calibration')}
            size="sm"
          >
            Calibration
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {dashboardState.isAnalyzing && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Analyzing emotional intelligence across multiple dimensions...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Overview View */}
      {dashboardState.selectedView === 'overview' && dashboardState.currentEmotionalState && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primary Emotion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-lg">🎭</span>
                <span>Primary Emotion</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 capitalize">
                  {dashboardState.currentEmotionalState.primaryEmotion.name}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Intensity:</span>
                    <span className="font-medium">
                      {Math.round(dashboardState.currentEmotionalState.primaryEmotion.intensity * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valence:</span>
                    <span className="font-medium">
                      {dashboardState.currentEmotionalState.primaryEmotion.valence > 0 ? 'Positive' : 'Negative'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span className="font-medium">
                      {Math.round(dashboardState.currentEmotionalState.primaryEmotion.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mixed Emotions */}
          {dashboardState.currentEmotionalState.mixedEmotions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-lg">🌈</span>
                  <span>Mixed Emotions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardState.currentEmotionalState.mixedEmotions.slice(0, 3).map((emotion, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      <div className="font-medium text-sm">{emotion.combination}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Therapeutic Value: {Math.round(emotion.therapeuticValue * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cultural Emotions */}
          {dashboardState.currentEmotionalState.culturalEmotions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-lg">🌍</span>
                  <span>Cultural Emotions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardState.currentEmotionalState.culturalEmotions.slice(0, 3).map((emotion, index) => (
                    <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      <div className="font-medium text-sm capitalize">{emotion.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {emotion.culture} • {Math.round(emotion.intensity * 100)}% intensity
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trauma Markers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-lg">🛡️</span>
                <span>Trauma-Informed Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Safety Perception:</span>
                  <span className="font-medium">
                    {Math.round(dashboardState.currentEmotionalState.traumaMarkers.safety_perception * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Hypervigilance:</span>
                  <span className="font-medium">
                    {Math.round(dashboardState.currentEmotionalState.traumaMarkers.hypervigilance * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Somatic Awareness:</span>
                  <span className="font-medium">
                    {Math.round((1 - dashboardState.currentEmotionalState.traumaMarkers.somatic_disconnection) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Therapeutic Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-lg">⚕️</span>
                <span>Therapeutic Priority</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-lg font-bold capitalize">
                  {dashboardState.currentEmotionalState.therapeuticPriority.urgency_level}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {dashboardState.currentEmotionalState.therapeuticPriority.intervention_type}
                </div>
                <div className="text-sm">
                  Growth Opportunity: {Math.round(dashboardState.currentEmotionalState.therapeuticPriority.growth_opportunity * 100)}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Embodied Markers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-lg">🧘</span>
                <span>Embodied Awareness</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Somatic Awareness:</span>
                  <span className="font-medium">
                    {Math.round(dashboardState.currentEmotionalState.embodiedMarkers.somatic_awareness * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Breathing Pattern:</span>
                  <span className="font-medium capitalize">
                    {dashboardState.currentEmotionalState.embodiedMarkers.breathing_pattern}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Energy Signature:</span>
                  <span className="font-medium capitalize">
                    {dashboardState.currentEmotionalState.embodiedMarkers.energy_signature}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cultural View */}
      {dashboardState.selectedView === 'cultural' && dashboardState.culturalInsight && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-lg">🌍</span>
                <span>Cultural Emotional Interpretation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Primary Cultural Understanding</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {dashboardState.culturalInsight.primary_cultural_interpretation.interpretation}
                  </p>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Cultural Significance: {Math.round(dashboardState.culturalInsight.primary_cultural_interpretation.cultural_significance * 100)}%
                  </div>
                </div>

                {dashboardState.culturalInsight.healing_wisdom_integration.cultural_strengths_to_activate.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Cultural Strengths to Activate</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {dashboardState.culturalInsight.healing_wisdom_integration.cultural_strengths_to_activate.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {dashboardState.culturalInsight.decolonized_perspective.liberation_framework_elements.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Liberation Framework Elements</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {dashboardState.culturalInsight.decolonized_perspective.liberation_framework_elements.map((element, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{element}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trauma-Informed View */}
      {dashboardState.selectedView === 'trauma' && dashboardState.traumaInformedResponse && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-lg">🛡️</span>
                <span>Trauma-Informed Response</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Response Style</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                    <div className="text-sm">
                      Voice Quality: <span className="font-medium capitalize">{dashboardState.traumaInformedResponse.response_content.tone_adjustments.voice_quality}</span>
                    </div>
                    <div className="text-sm">
                      Pacing: <span className="font-medium capitalize">{dashboardState.traumaInformedResponse.response_content.tone_adjustments.pacing}</span>
                    </div>
                    <div className="text-sm">
                      Energy Level: <span className="font-medium capitalize">{dashboardState.traumaInformedResponse.response_content.tone_adjustments.energy_level}</span>
                    </div>
                  </div>
                </div>

                {dashboardState.traumaInformedResponse.response_content.safety_elements.explicit_safety_reminders.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Safety Elements</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {dashboardState.traumaInformedResponse.response_content.safety_elements.explicit_safety_reminders.map((reminder, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{reminder}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {dashboardState.traumaInformedResponse.neurobiological_support.nervous_system_regulation.breathing_invitations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Nervous System Regulation</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {dashboardState.traumaInformedResponse.neurobiological_support.nervous_system_regulation.breathing_invitations.map((invitation, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{invitation}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calibration View */}
      {dashboardState.selectedView === 'calibration' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-lg">🎯</span>
                <span>Emotional Intelligence Calibration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Current Accuracy</h4>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${dashboardState.calibrationAccuracy * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {Math.round(dashboardState.calibrationAccuracy * 100)}% accuracy in understanding your emotions
                  </div>
                </div>

                <Button
                  onClick={() => setDashboardState(prev => ({ ...prev, showCalibrationFeedback: true }))}
                  className="w-full"
                >
                  Provide Calibration Feedback
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Calibration Feedback Modal */}
          {dashboardState.showCalibrationFeedback && (
            <Card>
              <CardHeader>
                <CardTitle>Calibration Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      How accurate was the emotion detection? (1-5)
                    </label>
                    <Slider
                      value={[calibrationFeedback.accuracy_rating]}
                      onValueChange={([value]) => 
                        setCalibrationFeedback(prev => ({ ...prev, accuracy_rating: value }))
                      }
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Current: {calibrationFeedback.accuracy_rating}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      How accurate was the intensity detection? (1-5)
                    </label>
                    <Slider
                      value={[calibrationFeedback.intensity_rating]}
                      onValueChange={([value]) => 
                        setCalibrationFeedback(prev => ({ ...prev, intensity_rating: value }))
                      }
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Current: {calibrationFeedback.intensity_rating}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional context or personal meaning
                    </label>
                    <textarea
                      value={calibrationFeedback.personal_meaning}
                      onChange={(e) => 
                        setCalibrationFeedback(prev => ({ ...prev, personal_meaning: e.target.value }))
                      }
                      placeholder="Share what this emotion means to you personally..."
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleCalibrationFeedback} className="flex-1">
                      Submit Feedback
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setDashboardState(prev => ({ ...prev, showCalibrationFeedback: false }))}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* No Data State */}
      {!dashboardState.isAnalyzing && !dashboardState.currentEmotionalState && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-lg font-medium mb-2">Emotional Intelligence Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start writing in your journal to see real-time emotional intelligence insights across multiple dimensions.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmotionalIntelligenceDashboard;