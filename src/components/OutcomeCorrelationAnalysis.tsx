'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CorrelationAnalysisResults,
  PathwayAttributionAnalysis,
  FeatureAttributionAnalysis,
  InterventionEffectivenessAnalysis,
  OutcomeCorrelation,
  PredictiveCorrelationModel,
  CausalInferenceAnalysis,
  LongitudinalCorrelationData,
  CrossPathwayCorrelation,
  RealWorldOutcomeCorrelation
} from '@/types/analytics-outcome-measurement-schema';

interface OutcomeCorrelationAnalysisProps {
  userId: string;
  correlationData?: CorrelationAnalysisResults | null;
  timeframe?: '1month' | '3months' | '6months' | '1year' | 'all';
  analysisType?: 'pathway' | 'feature' | 'intervention' | 'outcome' | 'comprehensive';
  culturalContext?: {
    primaryCulture: string;
    secondaryCultures: string[];
    culturalValues: string[];
    languagePreferences: string[];
  };
  onCorrelationDiscovered?: (correlation: OutcomeCorrelation) => void;
  onAttributionAnalyzed?: (attribution: PathwayAttributionAnalysis) => void;
  onPredictionGenerated?: (prediction: PredictiveCorrelationModel) => void;
  className?: string;
}

export default function OutcomeCorrelationAnalysis({
  userId,
  correlationData,
  timeframe = '6months',
  analysisType = 'comprehensive',
  culturalContext,
  onCorrelationDiscovered,
  onAttributionAnalyzed,
  onPredictionGenerated,
  className = ''
}: OutcomeCorrelationAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'correlations' | 'attributions' | 'predictions' | 'causal'>('correlations');
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState(analysisType);
  
  // Correlation Data State
  const [pathwayCorrelations, setPathwayCorrelations] = useState<PathwayAttributionAnalysis[]>([]);
  const [featureCorrelations, setFeatureCorrelations] = useState<FeatureAttributionAnalysis[]>([]);
  const [interventionCorrelations, setInterventionCorrelations] = useState<InterventionEffectivenessAnalysis[]>([]);
  const [outcomeCorrelations, setOutcomeCorrelations] = useState<OutcomeCorrelation[]>([]);
  
  // Advanced Analysis State
  const [predictiveModels, setPredictiveModels] = useState<PredictiveCorrelationModel[]>([]);
  const [causalInferences, setCausalInferences] = useState<CausalInferenceAnalysis[]>([]);
  const [longitudinalData, setLongitudinalData] = useState<LongitudinalCorrelationData[]>([]);
  const [crossPathwayData, setCrossPathwayData] = useState<CrossPathwayCorrelation[]>([]);
  const [realWorldCorrelations, setRealWorldCorrelations] = useState<RealWorldOutcomeCorrelation[]>([]);

  useEffect(() => {
    loadCorrelationAnalysisData();
  }, [userId, selectedTimeframe, selectedAnalysisType, culturalContext]);

  const loadCorrelationAnalysisData = async () => {
    try {
      setIsLoading(true);
      
      // Load pathway attribution analysis
      const pathwayData = await loadPathwayAttributionAnalysis(userId, selectedTimeframe, selectedAnalysisType);
      setPathwayCorrelations(pathwayData);
      
      // Load feature attribution analysis
      const featureData = await loadFeatureAttributionAnalysis(userId, selectedTimeframe);
      setFeatureCorrelations(featureData);
      
      // Load intervention effectiveness analysis
      const interventionData = await loadInterventionEffectivenessAnalysis(userId, selectedTimeframe);
      setInterventionCorrelations(interventionData);
      
      // Load outcome correlations
      const outcomeData = await loadOutcomeCorrelations(userId, selectedTimeframe, culturalContext);
      setOutcomeCorrelations(outcomeData);
      
      // Load predictive correlation models
      const predictiveData = await loadPredictiveCorrelationModels(userId, selectedTimeframe);
      setPredictiveModels(predictiveData);
      
      // Load causal inference analysis
      const causalData = await loadCausalInferenceAnalysis(userId, selectedTimeframe);
      setCausalInferences(causalData);
      
      // Load longitudinal correlation data
      const longitudinalAnalysis = await loadLongitudinalCorrelationData(userId, selectedTimeframe);
      setLongitudinalData(longitudinalAnalysis);
      
      // Load cross-pathway correlation analysis
      const crossPathwayAnalysis = await loadCrossPathwayCorrelationData(userId, selectedTimeframe);
      setCrossPathwayData(crossPathwayAnalysis);
      
      // Load real-world outcome correlations
      const realWorldData = await loadRealWorldOutcomeCorrelations(userId, selectedTimeframe, culturalContext);
      setRealWorldCorrelations(realWorldData);
      
      // Trigger callback events
      outcomeData.forEach(correlation => onCorrelationDiscovered?.(correlation));
      pathwayData.forEach(attribution => onAttributionAnalyzed?.(attribution));
      predictiveData.forEach(prediction => onPredictionGenerated?.(prediction));
      
    } catch (error) {
      console.error('Error loading correlation analysis data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data loading functions
  const loadPathwayAttributionAnalysis = async (
    userId: string, 
    timeframe: string, 
    analysisType: string
  ): Promise<PathwayAttributionAnalysis[]> => {
    return [
      {
        attributionId: 'pa-001',
        userId: userId,
        pathwayId: 'identity-exploration',
        pathwayType: 'identity',
        outcomeDomain: 'self_awareness',
        attributionScore: 0.73,
        confidenceLevel: 0.89,
        causalContribution: 0.68,
        correlationStrength: 0.82,
        directEffects: [
          {
            effectType: 'values_clarification',
            effectSize: 0.65,
            significance: 0.002,
            mechanismExplanation: 'Values exploration exercises directly contributed to improved self-awareness through structured reflection processes'
          },
          {
            effectType: 'identity_integration',
            effectSize: 0.71,
            significance: 0.001,
            mechanismExplanation: 'Identity integration activities showed strong correlation with overall personal development outcomes'
          }
        ],
        indirectEffects: [
          {
            effectType: 'confidence_building',
            effectSize: 0.42,
            significance: 0.018,
            mechanismExplanation: 'Identity work indirectly improved confidence through enhanced self-understanding'
          }
        ],
        mediatingFactors: [
          {
            factor: 'cultural_alignment',
            mediationStrength: 0.58,
            explanation: 'Cultural alignment with identity exploration content mediated the relationship between pathway engagement and outcomes'
          }
        ],
        moderatingFactors: [
          {
            factor: 'baseline_self_awareness',
            moderationEffect: 0.34,
            explanation: 'Participants with higher baseline self-awareness showed stronger pathway effects'
          }
        ],
        temporalDynamics: {
          immediateEffects: 0.45,
          shortTermEffects: 0.68,
          longTermEffects: 0.73,
          sustainabilityScore: 0.81
        },
        culturalEffectiveness: {
          overallCulturalFit: 0.87,
          cultureSpecificEffects: [
            { culture: 'individualistic', effectSize: 0.79, significance: 0.001 },
            { culture: 'collectivistic', effectSize: 0.68, significance: 0.004 }
          ]
        },
        statisticalSignificance: 0.001,
        effectSizeClassification: 'large_effect',
        realWorldSignificance: 'clinically_meaningful',
        analyzedAt: new Date('2024-08-19'),
        dataQualityScore: 0.91
      },
      {
        attributionId: 'pa-002',
        userId: userId,
        pathwayId: 'emotional-wellness',
        pathwayType: 'emotional',
        outcomeDomain: 'emotional_regulation',
        attributionScore: 0.81,
        confidenceLevel: 0.93,
        causalContribution: 0.76,
        correlationStrength: 0.88,
        directEffects: [
          {
            effectType: 'mindfulness_practice',
            effectSize: 0.74,
            significance: 0.000,
            mechanismExplanation: 'Regular mindfulness practice showed direct causal relationship with improved emotional regulation'
          }
        ],
        indirectEffects: [
          {
            effectType: 'stress_reduction',
            effectSize: 0.51,
            significance: 0.008,
            mechanismExplanation: 'Emotional wellness practices indirectly improved life satisfaction through stress reduction'
          }
        ],
        mediatingFactors: [
          {
            factor: 'self_compassion',
            mediationStrength: 0.67,
            explanation: 'Self-compassion development mediated the relationship between emotional practices and regulation outcomes'
          }
        ],
        moderatingFactors: [
          {
            factor: 'trauma_history',
            moderationEffect: -0.23,
            explanation: 'Participants with trauma history required additional support for optimal pathway effectiveness'
          }
        ],
        temporalDynamics: {
          immediateEffects: 0.52,
          shortTermEffects: 0.74,
          longTermEffects: 0.81,
          sustainabilityScore: 0.88
        },
        culturalEffectiveness: {
          overallCulturalFit: 0.92,
          cultureSpecificEffects: [
            { culture: 'eastern_philosophy', effectSize: 0.91, significance: 0.000 },
            { culture: 'western_psychology', effectSize: 0.72, significance: 0.002 }
          ]
        },
        statisticalSignificance: 0.000,
        effectSizeClassification: 'large_effect',
        realWorldSignificance: 'transformative',
        analyzedAt: new Date('2024-08-19'),
        dataQualityScore: 0.94
      }
    ];
  };

  const loadFeatureAttributionAnalysis = async (userId: string, timeframe: string): Promise<FeatureAttributionAnalysis[]> => {
    return [
      {
        attributionId: 'fa-001',
        userId: userId,
        featureId: 'ai-reflection-assistant',
        featureType: 'ai_integration',
        featureName: 'AI Reflection Assistant',
        outcomeDomain: 'personal_insight',
        usageFrequency: 4.2,
        engagementQuality: 0.87,
        attributionScore: 0.69,
        causalContribution: 0.64,
        correlationStrength: 0.78,
        usagePatterns: {
          averageSessionDuration: 18.5,
          peakUsageTimes: ['evening', 'weekend_morning'],
          usageConsistency: 0.82,
          featureAdoptionSpeed: 'rapid'
        },
        outcomeContributions: [
          {
            outcome: 'self_awareness_improvement',
            contributionPercentage: 34.2,
            confidenceLevel: 0.91,
            mechanism: 'AI-guided reflection prompts enhanced depth of self-analysis'
          },
          {
            outcome: 'insight_generation',
            contributionPercentage: 28.7,
            confidenceLevel: 0.86,
            mechanism: 'Pattern recognition in AI responses facilitated breakthrough insights'
          }
        ],
        culturalAdaptation: {
          culturalRelevance: 0.88,
          culturalSensitivity: 0.92,
          cultureSpecificEffectiveness: [
            { culture: 'tech_savvy', effectiveness: 0.91 },
            { culture: 'traditional', effectiveness: 0.67 }
          ]
        },
        featureOptimizationInsights: [
          {
            insight: 'personalized_prompt_timing',
            impactPotential: 0.23,
            implementationComplexity: 'medium',
            expectedOutcomeImprovement: 0.15
          }
        ],
        statisticalSignificance: 0.003,
        analyzedAt: new Date('2024-08-19'),
        dataReliability: 0.89
      },
      {
        attributionId: 'fa-002',
        userId: userId,
        featureId: 'progress-visualization',
        featureType: 'gamification',
        featureName: 'Progress Visualization Dashboard',
        outcomeDomain: 'motivation_maintenance',
        usageFrequency: 7.1,
        engagementQuality: 0.92,
        attributionScore: 0.76,
        causalContribution: 0.71,
        correlationStrength: 0.84,
        usagePatterns: {
          averageSessionDuration: 12.3,
          peakUsageTimes: ['morning_planning', 'evening_review'],
          usageConsistency: 0.89,
          featureAdoptionSpeed: 'immediate'
        },
        outcomeContributions: [
          {
            outcome: 'engagement_consistency',
            contributionPercentage: 42.1,
            confidenceLevel: 0.94,
            mechanism: 'Visual progress feedback maintained motivation through achievement visualization'
          },
          {
            outcome: 'goal_completion_rate',
            contributionPercentage: 38.5,
            confidenceLevel: 0.88,
            mechanism: 'Progress tracking increased goal completion through enhanced accountability'
          }
        ],
        culturalAdaptation: {
          culturalRelevance: 0.85,
          culturalSensitivity: 0.81,
          cultureSpecificEffectiveness: [
            { culture: 'achievement_oriented', effectiveness: 0.94 },
            { culture: 'process_oriented', effectiveness: 0.73 }
          ]
        },
        featureOptimizationInsights: [
          {
            insight: 'cultural_milestone_adaptation',
            impactPotential: 0.31,
            implementationComplexity: 'high',
            expectedOutcomeImprovement: 0.22
          }
        ],
        statisticalSignificance: 0.001,
        analyzedAt: new Date('2024-08-19'),
        dataReliability: 0.93
      }
    ];
  };

  const loadInterventionEffectivenessAnalysis = async (userId: string, timeframe: string): Promise<InterventionEffectivenessAnalysis[]> => {
    return [
      {
        analysisId: 'iea-001',
        userId: userId,
        interventionId: 'mindful-breathing-reminder',
        interventionType: 'behavioral_prompt',
        interventionName: 'Mindful Breathing Reminder',
        targetOutcome: 'stress_reduction',
        interventionFrequency: 3.8,
        responseRate: 0.73,
        effectivenessScore: 0.81,
        outcomeImprovement: 0.67,
        interventionTiming: {
          optimalTimingWindows: ['high_stress_detection', 'transition_moments'],
          averageResponseTime: 4.2,
          timingEffectiveness: 0.87
        },
        dosageResponse: {
          minimalEffectiveDose: 2.1,
          optimalDose: 3.8,
          maximumBenefit: 5.2,
          dosageResponseCurve: 'logarithmic'
        },
        personalizedFactors: [
          {
            factor: 'stress_baseline',
            influence: 0.42,
            adaptation: 'Higher baseline stress required more frequent interventions'
          },
          {
            factor: 'mindfulness_experience',
            influence: 0.38,
            adaptation: 'Prior mindfulness experience enhanced intervention effectiveness'
          }
        ],
        culturalConsiderations: {
          culturalAcceptance: 0.89,
          culturalAdaptations: [
            'Breathing techniques adapted for cultural meditation traditions',
            'Language and imagery customized for cultural context'
          ],
          cultureSpecificEffectiveness: [
            { culture: 'meditation_tradition', effectiveness: 0.94 },
            { culture: 'western_stress_management', effectiveness: 0.76 }
          ]
        },
        mechanismOfAction: {
          primaryMechanism: 'autonomic_nervous_system_regulation',
          secondaryMechanisms: ['attention_regulation', 'emotional_regulation'],
          neurobiologicalBasis: 'Parasympathetic activation through controlled breathing patterns',
          behavioralBasis: 'Habit formation through consistent environmental cues'
        },
        longitudinalEffectiveness: {
          immediateEffect: 0.54,
          oneWeekEffect: 0.67,
          oneMonthEffect: 0.81,
          sustainedEffect: 0.78,
          habitFormationRate: 0.84
        },
        statisticalSignificance: 0.002,
        clinicalSignificance: 'moderate_to_large',
        analyzedAt: new Date('2024-08-19'),
        evidenceQuality: 0.91
      }
    ];
  };

  const loadOutcomeCorrelations = async (userId: string, timeframe: string, cultural: any): Promise<OutcomeCorrelation[]> => {
    return [
      {
        correlationId: 'oc-001',
        userId: userId,
        primaryOutcome: 'self_awareness',
        secondaryOutcome: 'decision_making_quality',
        correlationCoefficient: 0.78,
        correlationType: 'positive_strong',
        statisticalSignificance: 0.001,
        sampleSize: 1247,
        confidenceInterval: { lower: 0.72, upper: 0.84 },
        effectSizeInterpretation: 'large_effect',
        causalDirection: 'bidirectional',
        temporalRelationship: {
          immediateCorrelation: 0.68,
          laggedCorrelation: 0.78,
          optimalLag: '2_weeks',
          temporalStability: 0.85
        },
        mechanismExplanation: 'Enhanced self-awareness provides clearer understanding of values and preferences, leading to better decision-making alignment',
        culturalVariation: [
          {
            culture: 'individualistic',
            correlationStrength: 0.82,
            culturalModeration: 'stronger_in_individual_contexts'
          },
          {
            culture: 'collectivistic',
            correlationStrength: 0.74,
            culturalModeration: 'moderated_by_group_harmony_considerations'
          }
        ],
        realWorldImplications: [
          'Career decision satisfaction increased by 34%',
          'Relationship choice satisfaction improved by 28%',
          'Financial decision regret decreased by 41%'
        ],
        mediatingVariables: ['emotional_clarity', 'value_alignment'],
        moderatingVariables: ['cognitive_flexibility', 'decision_complexity'],
        replicationStudies: 3,
        metaAnalysisInclusion: true,
        analyzedAt: new Date('2024-08-19')
      },
      {
        correlationId: 'oc-002',
        userId: userId,
        primaryOutcome: 'emotional_regulation',
        secondaryOutcome: 'relationship_satisfaction',
        correlationCoefficient: 0.84,
        correlationType: 'positive_very_strong',
        statisticalSignificance: 0.000,
        sampleSize: 1389,
        confidenceInterval: { lower: 0.79, upper: 0.89 },
        effectSizeInterpretation: 'very_large_effect',
        causalDirection: 'primary_to_secondary',
        temporalRelationship: {
          immediateCorrelation: 0.71,
          laggedCorrelation: 0.84,
          optimalLag: '3_weeks',
          temporalStability: 0.91
        },
        mechanismExplanation: 'Improved emotional regulation enables better communication, conflict resolution, and empathy in relationships',
        culturalVariation: [
          {
            culture: 'expressive',
            correlationStrength: 0.89,
            culturalModeration: 'stronger_in_emotionally_expressive_cultures'
          },
          {
            culture: 'reserved',
            correlationStrength: 0.76,
            culturalModeration: 'mediated_by_non_verbal_communication_improvements'
          }
        ],
        realWorldImplications: [
          'Relationship conflict frequency decreased by 47%',
          'Partner satisfaction ratings increased by 39%',
          'Communication effectiveness improved by 52%'
        ],
        mediatingVariables: ['empathy', 'communication_skills'],
        moderatingVariables: ['relationship_duration', 'attachment_style'],
        replicationStudies: 5,
        metaAnalysisInclusion: true,
        analyzedAt: new Date('2024-08-19')
      }
    ];
  };

  const loadPredictiveCorrelationModels = async (userId: string, timeframe: string): Promise<PredictiveCorrelationModel[]> => {
    return [
      {
        modelId: 'pcm-001',
        userId: userId,
        modelType: 'outcome_prediction',
        targetOutcome: 'pathway_completion',
        predictiveFeatures: [
          { feature: 'engagement_consistency', importance: 0.34, description: 'Regular engagement pattern' },
          { feature: 'early_milestone_completion', importance: 0.28, description: 'Success in initial stages' },
          { feature: 'social_support_level', importance: 0.22, description: 'Community and peer support' },
          { feature: 'intrinsic_motivation', importance: 0.16, description: 'Internal drive and purpose' }
        ],
        modelAccuracy: 0.87,
        precisionScore: 0.84,
        recallScore: 0.89,
        f1Score: 0.86,
        crossValidationScore: 0.85,
        predictionConfidence: 0.91,
        predictionHorizon: '3_months',
        modelInterpretation: {
          shapValues: [
            { feature: 'engagement_consistency', shapValue: 0.42 },
            { feature: 'early_milestone_completion', shapValue: 0.38 }
          ],
          featureInteractions: [
            {
              features: ['engagement_consistency', 'social_support_level'],
              interactionStrength: 0.23,
              description: 'Consistent engagement amplified by social support'
            }
          ]
        },
        culturalAdaptation: {
          cultureSpecificModels: [
            { culture: 'individual_achievement', accuracy: 0.91 },
            { culture: 'collective_harmony', accuracy: 0.83 }
          ],
          culturalBiasAssessment: 0.08,
          fairnessMetrics: { demographicParity: 0.92, equalizedOdds: 0.89 }
        },
        realWorldValidation: {
          deploymentAccuracy: 0.82,
          realWorldPrecision: 0.79,
          userFeedbackScore: 0.88,
          actionabilityScore: 0.86
        },
        trainedAt: new Date('2024-07-15'),
        lastUpdated: new Date('2024-08-19'),
        modelVersion: '2.3.1'
      }
    ];
  };

  const loadCausalInferenceAnalysis = async (userId: string, timeframe: string): Promise<CausalInferenceAnalysis[]> => {
    return [
      {
        analysisId: 'cia-001',
        userId: userId,
        treatmentVariable: 'identity_pathway_completion',
        outcomeVariable: 'life_satisfaction',
        causalEffectSize: 0.71,
        causalMethod: 'propensity_score_matching',
        treatmentEffect: {
          averageTreatmentEffect: 0.71,
          treatmentOnTreatedEffect: 0.78,
          treatmentOnControlEffect: 0.65,
          confidenceInterval: { lower: 0.58, upper: 0.84 }
        },
        confoundingControl: {
          identifiedConfounders: ['baseline_wellbeing', 'socioeconomic_status', 'education_level'],
          propensityScoreBalance: 0.94,
          covariateBalance: 0.89,
          unobservedConfoundingAssessment: 'low_risk'
        },
        causalAssumptions: {
          ignorability: 'satisfied',
          positivity: 'satisfied',
          consistency: 'satisfied',
          noInterference: 'assumed_satisfied'
        },
        sensitivityAnalysis: {
          robustnessValue: 0.23,
          criticalValue: 0.31,
          robustnessConclusion: 'causally_robust',
          alternativeExplanations: ['selection_bias_ruled_out', 'reverse_causation_unlikely']
        },
        mechanismAnalysis: {
          directEffect: 0.52,
          indirectEffects: [
            { mediator: 'self_awareness', effect: 0.19 },
            { mediator: 'goal_clarity', effect: 0.14 }
          ],
          totalMediationEffect: 0.33,
          percentMediated: 46.5
        },
        externalValidity: {
          populationGeneralizability: 0.82,
          settingGeneralizability: 0.78,
          treatmentVariationGeneralizability: 0.85
        },
        statisticalSignificance: 0.001,
        clinicalSignificance: 'large_meaningful_effect',
        analyzedAt: new Date('2024-08-19'),
        evidenceStrength: 'strong_causal_evidence'
      }
    ];
  };

  const loadLongitudinalCorrelationData = async (userId: string, timeframe: string): Promise<LongitudinalCorrelationData[]> => {
    return [
      {
        longitudinalId: 'lcd-001',
        userId: userId,
        outcomeVariable: 'personal_development_composite',
        timePoints: [
          { timePoint: 'baseline', value: 6.2, date: new Date('2024-01-15') },
          { timePoint: '1_month', value: 6.8, date: new Date('2024-02-15') },
          { timePoint: '3_months', value: 7.4, date: new Date('2024-04-15') },
          { timePoint: '6_months', value: 8.1, date: new Date('2024-07-15') }
        ],
        trajectoryAnalysis: {
          trajectoryType: 'linear_growth',
          growthRate: 0.32,
          accelerationPhase: '1_to_3_months',
          plateauPhase: 'none_detected',
          sustainabilityPrediction: 0.89
        },
        changePointAnalysis: {
          significantChangePoints: [
            { timePoint: '2_months', changeType: 'acceleration', magnitude: 0.41 }
          ],
          changePointConfidence: 0.87
        },
        individualDifferences: {
          trajectoryVariability: 0.23,
          individualSlopes: { mean: 0.32, sd: 0.08 },
          respondentClassification: 'steady_improver'
        },
        predictiveModeling: {
          futureTrajectory: [
            { timePoint: '9_months', predictedValue: 8.6, confidence: 0.82 },
            { timePoint: '12_months', predictedValue: 9.1, confidence: 0.74 }
          ],
          trajectoryStability: 0.88
        },
        culturalTrajectoryVariation: [
          {
            culture: 'progress_oriented',
            trajectoryModification: 'faster_initial_growth',
            culturalGrowthRate: 0.41
          }
        ],
        analyzedAt: new Date('2024-08-19'),
        followUpRequired: true,
        dataCompleteness: 0.94
      }
    ];
  };

  const loadCrossPathwayCorrelationData = async (userId: string, timeframe: string): Promise<CrossPathwayCorrelation[]> => {
    return [
      {
        correlationId: 'cpc-001',
        userId: userId,
        primaryPathway: 'identity_exploration',
        secondaryPathway: 'emotional_wellness',
        crossPathwayCorrelation: 0.76,
        synergyScore: 0.83,
        complementarityAnalysis: {
          skillOverlap: 0.42,
          reinforcementEffect: 0.71,
          sequentialOptimization: 'identity_first_then_emotional'
        },
        combinedEffectiveness: {
          individualEffectSum: 1.34,
          combinedEffect: 1.78,
          synergyBonus: 0.44,
          synergyPercentage: 32.8
        },
        optimalSequencing: {
          recommendedOrder: ['identity_exploration', 'emotional_wellness'],
          sequenceReasoning: 'Identity clarity enhances emotional awareness and regulation effectiveness',
          sequenceEffectiveness: 0.89
        },
        temporalDynamics: {
          immediateCorrelation: 0.61,
          delayedCorrelation: 0.76,
          peakSynergyTime: '6_weeks_overlap',
          sustainedSynergy: 0.82
        },
        mechanismExplanation: 'Identity exploration provides emotional context and values framework that enhances emotional regulation strategies',
        culturalSynergy: [
          {
            culture: 'holistic_development',
            synergyEnhancement: 0.23,
            culturalReasoning: 'Holistic cultural approaches amplify cross-pathway benefits'
          }
        ],
        statisticalSignificance: 0.002,
        analyzedAt: new Date('2024-08-19'),
        validationStatus: 'peer_reviewed'
      }
    ];
  };

  const loadRealWorldOutcomeCorrelations = async (userId: string, timeframe: string, cultural: any): Promise<RealWorldOutcomeCorrelation[]> => {
    return [
      {
        correlationId: 'rwoc-001',
        userId: userId,
        alchemyOutcome: 'emotional_regulation',
        realWorldDomain: 'workplace_performance',
        correlationStrength: 0.68,
        realWorldMetrics: [
          { metric: 'performance_rating', correlation: 0.71, significance: 0.003 },
          { metric: 'team_collaboration_score', correlation: 0.64, significance: 0.008 },
          { metric: 'stress_related_absences', correlation: -0.52, significance: 0.021 }
        ],
        outcomeLatency: '4_to_8_weeks',
        durabilityAssessment: {
          sixMonthSustainability: 0.78,
          oneYearSustainability: 0.71,
          factorsInfluencingSustainability: ['workplace_culture', 'continued_practice']
        },
        externalValidation: {
          supervisorRatings: 0.73,
          peerAssessments: 0.69,
          objectiveMetrics: 0.66,
          selfReportCorrelation: 0.84
        },
        culturalRelevance: {
          workplaceCultureFit: 0.87,
          culturalAdaptationSuccess: 0.82,
          crossCulturalValidation: 0.79
        },
        economicImpact: {
          productivityImprovement: '23%',
          absenteeismReduction: '31%',
          teamEffectivenessGain: '28%'
        },
        mechanismValidation: 'independently_verified',
        replicationStudies: 2,
        analyzedAt: new Date('2024-08-19')
      },
      {
        correlationId: 'rwoc-002',
        userId: userId,
        alchemyOutcome: 'self_awareness',
        realWorldDomain: 'relationship_quality',
        correlationStrength: 0.74,
        realWorldMetrics: [
          { metric: 'relationship_satisfaction_score', correlation: 0.78, significance: 0.001 },
          { metric: 'communication_effectiveness', correlation: 0.72, significance: 0.002 },
          { metric: 'conflict_resolution_success', correlation: 0.69, significance: 0.004 }
        ],
        outcomeLatency: '2_to_6_weeks',
        durabilityAssessment: {
          sixMonthSustainability: 0.85,
          oneYearSustainability: 0.81,
          factorsInfluencingSustainability: ['relationship_investment', 'communication_practice']
        },
        externalValidation: {
          partnerRatings: 0.76,
          observationalAssessment: 0.71,
          behavioralIndicators: 0.68,
          selfReportCorrelation: 0.82
        },
        culturalRelevance: {
          relationshipCultureFit: 0.89,
          culturalAdaptationSuccess: 0.86,
          crossCulturalValidation: 0.83
        },
        socialImpact: {
          relationshipStabilityImprovement: '34%',
          communicationQualityGain: '41%',
          conflictReductionRate: '38%'
        },
        mechanismValidation: 'longitudinally_confirmed',
        replicationStudies: 4,
        analyzedAt: new Date('2024-08-19')
      }
    ];
  };

  const renderCorrelationMatrix = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {outcomeCorrelations.map((correlation) => (
            <div key={correlation.correlationId} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 capitalize">
                    {correlation.primaryOutcome.replace('_', ' ')} → {correlation.secondaryOutcome.replace('_', ' ')}
                  </h3>
                  <div className="text-sm text-gray-600 capitalize">{correlation.correlationType.replace('_', ' ')}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {correlation.correlationCoefficient.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">r-value</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Effect Size:</span>
                  <span className="font-medium capitalize">{correlation.effectSizeInterpretation.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">P-value:</span>
                  <span className="font-medium">{correlation.statisticalSignificance.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sample Size:</span>
                  <span className="font-medium">{correlation.sampleSize.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Causal Direction:</span>
                  <span className="font-medium capitalize">{correlation.causalDirection.replace('_', ' ')}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800">Mechanism</div>
                <div className="text-sm text-blue-700 mt-1">{correlation.mechanismExplanation}</div>
              </div>
              
              {correlation.realWorldImplications.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Real-World Impact</div>
                  <div className="space-y-1">
                    {correlation.realWorldImplications.slice(0, 2).map((implication, idx) => (
                      <div key={idx} className="text-sm text-green-600">• {implication}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAttributionAnalysis = () => {
    return (
      <div className="space-y-6">
        {pathwayCorrelations.map((attribution) => (
          <div key={attribution.attributionId} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 capitalize">
                  {attribution.pathwayId.replace('-', ' ')} Pathway
                </h3>
                <div className="text-sm text-gray-600">
                  Impact on {attribution.outcomeDomain.replace('_', ' ')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {(attribution.attributionScore * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500">Attribution Score</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {(attribution.causalContribution * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Causal Contribution</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {(attribution.correlationStrength * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Correlation Strength</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {(attribution.confidenceLevel * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Confidence Level</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-teal-600 capitalize">
                  {attribution.effectSizeClassification.replace('_', ' ')}
                </div>
                <div className="text-sm text-gray-600">Effect Size</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Direct Effects</h4>
                <div className="space-y-2">
                  {attribution.directEffects.map((effect, idx) => (
                    <div key={idx} className="bg-green-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-green-800 capitalize">
                          {effect.effectType.replace('_', ' ')}
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          {effect.effectSize.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-green-700">{effect.mechanismExplanation}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Temporal Dynamics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Immediate Effects:</span>
                    <span className="font-medium">{(attribution.temporalDynamics.immediateEffects * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Short-term Effects:</span>
                    <span className="font-medium">{(attribution.temporalDynamics.shortTermEffects * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Long-term Effects:</span>
                    <span className="font-medium">{(attribution.temporalDynamics.longTermEffects * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sustainability:</span>
                    <span className="font-medium">{(attribution.temporalDynamics.sustainabilityScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Cultural Effectiveness</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attribution.culturalEffectiveness.cultureSpecificEffects.map((cultural, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{cultural.culture}:</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{cultural.effectSize.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">p = {cultural.significance.toFixed(3)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Feature Attribution Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureCorrelations.map((feature) => (
              <div key={feature.attributionId} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{feature.featureName}</h4>
                    <div className="text-sm text-gray-600 capitalize">
                      {feature.featureType.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {(feature.attributionScore * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usage Frequency:</span>
                    <span className="font-medium">{feature.usageFrequency.toFixed(1)}/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engagement Quality:</span>
                    <span className="font-medium">{(feature.engagementQuality * 100).toFixed(0)}%</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Top Contributions</div>
                  {feature.outcomeContributions.slice(0, 2).map((contribution, idx) => (
                    <div key={idx} className="text-xs text-blue-600 mb-1">
                      • {contribution.outcome.replace('_', ' ')}: {contribution.contributionPercentage.toFixed(1)}%
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPredictiveModels = () => {
    return (
      <div className="space-y-6">
        {predictiveModels.map((model) => (
          <div key={model.modelId} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 capitalize">
                  {model.targetOutcome.replace('_', ' ')} Prediction Model
                </h3>
                <div className="text-sm text-gray-600">{model.predictionHorizon.replace('_', ' ')} horizon</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {(model.modelAccuracy * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {(model.precisionScore * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Precision</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {(model.recallScore * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Recall</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {(model.f1Score * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">F1 Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-teal-600">
                  {(model.predictionConfidence * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Predictive Features</h4>
                <div className="space-y-2">
                  {model.predictiveFeatures.map((feature, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                      <div>
                        <div className="text-sm font-medium text-gray-800 capitalize">
                          {feature.feature.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-600">{feature.description}</div>
                      </div>
                      <div className="text-sm font-bold text-blue-600">
                        {(feature.importance * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Real-World Validation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Deployment Accuracy:</span>
                    <span className="font-medium">{(model.realWorldValidation.deploymentAccuracy * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Real-World Precision:</span>
                    <span className="font-medium">{(model.realWorldValidation.realWorldPrecision * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">User Feedback:</span>
                    <span className="font-medium">{(model.realWorldValidation.userFeedbackScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Actionability:</span>
                    <span className="font-medium">{(model.realWorldValidation.actionabilityScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-2">Cultural Adaptation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {model.culturalAdaptation.cultureSpecificModels.map((cultural, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm text-purple-700 capitalize">{cultural.culture.replace('_', ' ')}:</span>
                    <span className="text-sm font-medium text-purple-800">{(cultural.accuracy * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-sm text-purple-700">
                Cultural Bias Assessment: {(model.culturalAdaptation.culturalBiasAssessment * 100).toFixed(1)}% (lower is better)
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCausalAnalysis = () => {
    return (
      <div className="space-y-6">
        {causalInferences.map((causal) => (
          <div key={causal.analysisId} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 capitalize">
                  {causal.treatmentVariable.replace('_', ' ')} → {causal.outcomeVariable.replace('_', ' ')}
                </h3>
                <div className="text-sm text-gray-600 capitalize">{causal.causalMethod.replace('_', ' ')}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {causal.causalEffectSize.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Causal Effect</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {causal.treatmentEffect.averageTreatmentEffect.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Average Treatment Effect</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {causal.treatmentEffect.treatmentOnTreatedEffect.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Effect on Treated</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600 capitalize">
                  {causal.evidenceStrength.replace('_', ' ')}
                </div>
                <div className="text-sm text-gray-600">Evidence Strength</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Confounding Control</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Propensity Score Balance:</span>
                    <span className="font-medium">{(causal.confoundingControl.propensityScoreBalance * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Covariate Balance:</span>
                    <span className="font-medium">{(causal.confoundingControl.covariateBalance * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Unobserved Confounding:</span>
                    <span className="font-medium capitalize">{causal.confoundingControl.unobservedConfoundingAssessment.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Identified Confounders</div>
                  <div className="space-y-1">
                    {causal.confoundingControl.identifiedConfounders.map((confounder, idx) => (
                      <div key={idx} className="text-xs text-blue-600 capitalize">
                        • {confounder.replace('_', ' ')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Mechanism Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Direct Effect:</span>
                    <span className="font-medium">{causal.mechanismAnalysis.directEffect.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Mediation:</span>
                    <span className="font-medium">{causal.mechanismAnalysis.totalMediationEffect.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Percent Mediated:</span>
                    <span className="font-medium">{causal.mechanismAnalysis.percentMediated.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Mediating Effects</div>
                  <div className="space-y-1">
                    {causal.mechanismAnalysis.indirectEffects.map((effect, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-gray-600 capitalize">{effect.mediator.replace('_', ' ')}:</span>
                        <span className="font-medium">{effect.effect.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Sensitivity Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {causal.sensitivityAnalysis.robustnessValue.toFixed(2)}
                  </div>
                  <div className="text-sm text-yellow-700">Robustness Value</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {causal.sensitivityAnalysis.criticalValue.toFixed(2)}
                  </div>
                  <div className="text-sm text-yellow-700">Critical Value</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-yellow-800 capitalize">
                    {causal.sensitivityAnalysis.robustnessConclusion.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-yellow-700">Conclusion</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Outcome Correlation Analysis</h2>
          <p className="text-gray-600">Advanced correlation analysis and causal inference for outcome attribution</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedAnalysisType}
            onChange={(e) => setSelectedAnalysisType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="comprehensive">Comprehensive</option>
            <option value="pathway">Pathway Focus</option>
            <option value="feature">Feature Focus</option>
            <option value="intervention">Intervention Focus</option>
            <option value="outcome">Outcome Focus</option>
          </select>
          
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="1month">1 Month</option>
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
            <option value="1year">1 Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'correlations', label: 'Correlations', count: outcomeCorrelations.length },
            { id: 'attributions', label: 'Attribution Analysis', count: pathwayCorrelations.length + featureCorrelations.length },
            { id: 'predictions', label: 'Predictive Models', count: predictiveModels.length },
            { id: 'causal', label: 'Causal Inference', count: causalInferences.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
      
      <div>
        {activeView === 'correlations' && renderCorrelationMatrix()}
        {activeView === 'attributions' && renderAttributionAnalysis()}
        {activeView === 'predictions' && renderPredictiveModels()}
        {activeView === 'causal' && renderCausalAnalysis()}
      </div>
    </div>
  );
}