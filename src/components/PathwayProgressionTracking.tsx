// ALCHM Pathway Progression Tracking
// Detailed milestone analysis and optimal pathway sequence identification system

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PathwayProgressionAnalytics,
  UserGrowthAnalytics,
  AnalyticsProfile
} from '@/types/analytics-outcome-measurement-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { CareerExplorationProfile, SMARTGoal, LearningPathway } from '@/types/career-future-readiness-schema';
import { CulturalContext } from '@/types/identity-schema';
import { GamificationProfile } from '@/types/gamification-engagement-schema';

interface PathwayProgressionTrackingProps {
  userId: string;
  identityProfile: IdentityExplorationProfile;
  emotionalEntries: EmotionalEntry[];
  careerProfile: CareerExplorationProfile;
  culturalContext: CulturalContext;
  gamificationProfile: GamificationProfile;
  activeGoals: SMARTGoal[];
  learningPathways: LearningPathway[];
  onOptimizationOpportunity?: (opportunity: OptimizationOpportunity) => void;
  onMilestoneInsight?: (insight: MilestoneInsight) => void;
  onSequenceRecommendation?: (recommendation: SequenceRecommendation) => void;
}

interface PathwayStageAnalysis {
  stageId: string;
  stageName: string;
  pathwayType: 'identity' | 'emotional' | 'career' | 'integrated';
  stageIndex: number;
  
  // Progression Metrics
  entryDate: Date;
  currentDuration: number; // days
  expectedDuration: number; // days
  completionPercentage: number; // 0-100
  progressionRate: number; // % per day
  
  // Engagement Analysis
  dailyEngagementAverage: number; // 0-1
  sessionFrequency: number; // sessions per week
  contentCompletionRate: number; // 0-1
  interactionDepth: number; // 0-1
  
  // Milestone Progress
  totalMilestones: number;
  completedMilestones: number;
  inProgressMilestones: number;
  milestoneCompletionRate: number; // 0-1
  averageMilestoneTime: number; // days
  
  // Difficulty Assessment
  userPerceivedDifficulty: number; // 1-5
  objectiveDifficultyScore: number; // 0-1
  supportRequestFrequency: number;
  frustractionIndicators: FrustrationIndicator[];
  
  // Cultural Adaptation
  culturalRelevanceScore: number; // 0-1
  culturalEngagementLevel: number; // 0-1
  culturalAdaptationEffectiveness: number; // 0-1
  culturalFeedback: CulturalFeedback[];
  
  // Predictive Analysis
  completionProbability: number; // 0-1
  timeToCompletion: number; // days
  riskFactors: StageRiskFactor[];
  accelerationOpportunities: AccelerationOpportunity[];
  
  // Comparison Metrics
  cohortPercentile: number; // 0-100
  relativeProgress: 'significantly_ahead' | 'ahead' | 'on_track' | 'behind' | 'significantly_behind';
  peerComparison: PeerComparisonData;
  
  lastUpdated: Date;
}

interface MilestoneAnalysisData {
  milestoneId: string;
  milestoneName: string;
  milestoneType: 'learning' | 'skill_demonstration' | 'reflection' | 'application' | 'assessment' | 'breakthrough';
  pathwayStage: string;
  
  // Completion Analysis
  completionStatus: 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'skipped';
  startDate?: Date;
  completionDate?: Date;
  timeToComplete?: number; // days
  expectedCompletionTime: number; // days
  
  // Quality Analysis
  completionQuality: number; // 0-1
  effortLevel: number; // 0-1
  comprehensionLevel: number; // 0-1
  applicationLevel: number; // 0-1
  
  // Engagement Metrics
  attemptCount: number;
  totalTimeSpent: number; // minutes
  averageSessionDuration: number; // minutes
  engagementScore: number; // 0-1
  
  // Difficulty & Support
  perceivedDifficulty: number; // 1-5
  supportUtilized: boolean;
  feedbackReceived: boolean;
  hinderanceFactors: HinderanceFactor[];
  
  // Cultural Factors
  culturalRelevance: number; // 0-1
  culturalAlignment: number; // 0-1
  culturalBarriers: CulturalBarrier[];
  culturalEnhancers: CulturalEnhancer[];
  
  // Impact Analysis
  skillImprovementEvidence: SkillImprovementEvidence[];
  behaviorChangeEvidence: BehaviorChangeEvidence[];
  mindsetShiftEvidence: MindsetShiftEvidence[];
  confidenceImpact: number; // -1 to 1
  
  // Optimization Insights
  optimizationOpportunities: MilestoneOptimization[];
  recommendedAdjustments: RecommendedAdjustment[];
  alternativeApproaches: AlternativeApproach[];
  
  lastAnalyzed: Date;
}

interface OptimalSequenceAnalysis {
  analysisId: string;
  pathwayType: 'identity' | 'emotional' | 'career' | 'integrated';
  userId: string;
  
  // Current Sequence
  currentSequence: SequenceStep[];
  currentSequenceEffectiveness: number; // 0-1
  currentSequenceCompletion: number; // 0-1
  
  // Optimal Sequence
  recommendedSequence: SequenceStep[];
  optimizedSequenceEffectiveness: number; // 0-1
  improvementPotential: number; // 0-1
  
  // Personalization Factors
  personalizationFactors: PersonalizationFactor[];
  culturalAdaptations: SequenceCulturalAdaptation[];
  learningStyleAlignment: LearningStyleAlignment;
  pacePreferences: PacePreference;
  
  // Evidence & Validation
  evidenceSource: 'user_data' | 'cohort_analysis' | 'ml_optimization' | 'expert_curation';
  validationScore: number; // 0-1
  statisticalSignificance: number; // 0-1
  sampleSize: number;
  
  // Implementation
  implementationComplexity: 'low' | 'medium' | 'high';
  expectedImpact: ExpectedImpact;
  rolloutStrategy: RolloutStrategy;
  monitoringPlan: SequenceMonitoringPlan;
  
  analyzedAt: Date;
  confidenceLevel: number; // 0-1
}

interface CompletionPredictiveModel {
  modelId: string;
  modelType: 'pathway_completion' | 'stage_completion' | 'milestone_achievement' | 'time_to_completion';
  userId: string;
  
  // Current Predictions
  overallCompletionProbability: number; // 0-1
  estimatedCompletionDate: Date;
  completionTimeRange: { min: number; max: number }; // days
  confidenceInterval: { lower: number; upper: number };
  
  // Stage-by-Stage Predictions
  stageCompletionPredictions: StageCompletionPrediction[];
  milestoneCompletionPredictions: MilestoneCompletionPrediction[];
  criticalPathAnalysis: CriticalPathStep[];
  
  // Risk Factors
  dropoutRisk: number; // 0-1
  plateauRisk: number; // 0-1
  stagnationRisk: number; // 0-1
  overloadRisk: number; // 0-1
  
  // Success Factors
  successProbabilityFactors: SuccessFactor[];
  acceleratingFactors: AcceleratingFactor[];
  supportingFactors: SupportingFactor[];
  motivatingFactors: MotivatingFactor[];
  
  // Intervention Recommendations
  interventionRecommendations: InterventionRecommendation[];
  supportRecommendations: SupportRecommendation[];
  adjustmentRecommendations: AdjustmentRecommendation[];
  
  // Model Performance
  modelAccuracy: number; // 0-1
  historicalPerformance: HistoricalPerformance[];
  calibrationMetrics: CalibrationMetric[];
  
  lastUpdated: Date;
  modelVersion: string;
}

interface AdaptivePathwayRecommendation {
  recommendationId: string;
  recommendationType: 'sequence_optimization' | 'content_adjustment' | 'pacing_modification' | 'support_enhancement' | 'cultural_adaptation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Recommendation Details
  title: string;
  description: string;
  rationale: string;
  expectedBenefit: string;
  implementationSteps: string[];
  
  // Impact Prediction
  expectedImpactArea: 'completion_rate' | 'engagement' | 'time_to_completion' | 'satisfaction' | 'learning_outcomes';
  expectedImpactMagnitude: number; // 0-1
  implementationDifficulty: number; // 0-1
  timeToSeeResults: number; // days
  
  // Personalization
  personalizedJustification: string;
  culturalConsiderations: string[];
  learningStyleAlignment: string;
  
  // Validation
  evidenceStrength: number; // 0-1
  similarUserSuccess: number; // 0-1
  expertConfidence: number; // 0-1
  
  // Implementation
  implementationComplexity: 'automatic' | 'user_guided' | 'manual_review';
  userApprovalRequired: boolean;
  reversible: boolean;
  
  recommendedAt: Date;
  validUntil: Date;
  status: 'pending' | 'approved' | 'implemented' | 'rejected' | 'expired';
}

const PathwayProgressionTracking: React.FC<PathwayProgressionTrackingProps> = ({
  userId,
  identityProfile,
  emotionalEntries,
  careerProfile,
  culturalContext,
  gamificationProfile,
  activeGoals,
  learningPathways,
  onOptimizationOpportunity,
  onMilestoneInsight,
  onSequenceRecommendation
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'stage_analysis' | 'milestone_analysis' | 'sequence_optimization' | 'predictive_models' | 'recommendations'>('stage_analysis');
  const [pathwayProgressions, setPathwayProgressions] = useState<PathwayProgressionAnalytics[]>([]);
  const [stageAnalyses, setStageAnalyses] = useState<PathwayStageAnalysis[]>([]);
  const [milestoneAnalyses, setMilestoneAnalyses] = useState<MilestoneAnalysisData[]>([]);
  const [sequenceAnalyses, setSequenceAnalyses] = useState<OptimalSequenceAnalysis[]>([]);
  const [predictiveModels, setPredictiveModels] = useState<CompletionPredictiveModel[]>([]);
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState<AdaptivePathwayRecommendation[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<PathwayStageAnalysis | null>(null);
  const [showStageModal, setShowStageModal] = useState(false);
  const [optimizationOpportunities, setOptimizationOpportunities] = useState<OptimizationOpportunity[]>([]);
  const [milestoneInsights, setMilestoneInsights] = useState<MilestoneInsight[]>([]);
  const [sequenceRecommendations, setSequenceRecommendations] = useState<SequenceRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const trackingRef = useRef<HTMLDivElement>(null);

  // Initialize pathway progression tracking
  useEffect(() => {
    loadPathwayProgressionData();
  }, [userId, selectedPathway]);

  const loadPathwayProgressionData = async () => {
    try {
      setIsLoading(true);

      // Load pathway progressions
      const progressions = await loadPathwayProgressionAnalytics(userId, selectedPathway);
      setPathwayProgressions(progressions);

      // Load stage analyses
      const stages = await loadStageAnalyses(userId, learningPathways, selectedPathway);
      setStageAnalyses(stages);

      // Load milestone analyses
      const milestones = await loadMilestoneAnalyses(userId, learningPathways, selectedPathway);
      setMilestoneAnalyses(milestones);

      // Load sequence analyses
      const sequences = await loadSequenceAnalyses(userId, culturalContext, selectedPathway);
      setSequenceAnalyses(sequences);

      // Load predictive models
      const models = await loadCompletionPredictiveModels(userId, selectedPathway);
      setPredictiveModels(models);

      // Load adaptive recommendations
      const recommendations = await loadAdaptiveRecommendations(userId, selectedPathway);
      setAdaptiveRecommendations(recommendations);

      // Generate optimization opportunities
      const opportunities = await generateOptimizationOpportunities(stages, milestones, sequences);
      setOptimizationOpportunities(opportunities);

      // Generate milestone insights
      const insights = await generateMilestoneInsights(milestones, culturalContext);
      setMilestoneInsights(insights);

      // Generate sequence recommendations
      const seqRecommendations = await generateSequenceRecommendations(sequences, culturalContext);
      setSequenceRecommendations(seqRecommendations);

      // Trigger callbacks
      opportunities.forEach(opp => onOptimizationOpportunity?.(opp));
      insights.forEach(insight => onMilestoneInsight?.(insight));
      seqRecommendations.forEach(rec => onSequenceRecommendation?.(rec));

    } catch (error) {
      console.error('Error loading pathway progression data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render stage analysis
  const renderStageAnalysis = () => {
    return (
      <div className="space-y-6">
        {/* Pathway filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex space-x-4">
            {['all', 'identity', 'emotional', 'career', 'integrated'].map((pathway) => (
              <button
                key={pathway}
                onClick={() => setSelectedPathway(pathway)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  selectedPathway === pathway
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {pathway} pathway{pathway !== 'all' ? '' : ' pathways'}
              </button>
            ))}
          </div>
        </div>

        {/* Stage overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stageAnalyses.map((stage) => (
            <div
              key={stage.stageId}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedStage(stage);
                setShowStageModal(true);
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{stage.stageName}</h3>
                  <div className="text-sm text-gray-600 capitalize">{stage.pathwayType} • Stage {stage.stageIndex}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{stage.completionPercentage}%</div>
                  <div className="text-xs text-gray-500">complete</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${stage.completionPercentage}%` }}
                />
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Progress:</span>
                  <div className={`font-medium ${
                    stage.relativeProgress === 'significantly_ahead' || stage.relativeProgress === 'ahead' ? 'text-green-600' :
                    stage.relativeProgress === 'on_track' ? 'text-blue-600' :
                    stage.relativeProgress === 'behind' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {stage.relativeProgress.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Engagement:</span>
                  <div className="font-medium text-purple-600">
                    {Math.round(stage.dailyEngagementAverage * 100)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Milestones:</span>
                  <div className="font-medium text-green-600">
                    {stage.completedMilestones}/{stage.totalMilestones}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>
                  <div className="font-medium text-orange-600">
                    {stage.currentDuration} days
                  </div>
                </div>
              </div>

              {/* Risk indicators */}
              {stage.riskFactors.length > 0 && (
                <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded">
                  <div className="text-xs font-medium text-red-700">
                    {stage.riskFactors.length} risk factor{stage.riskFactors.length > 1 ? 's' : ''} detected
                  </div>
                </div>
              )}

              {/* Acceleration opportunities */}
              {stage.accelerationOpportunities.length > 0 && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <div className="text-xs font-medium text-green-700">
                    {stage.accelerationOpportunities.length} acceleration opportunit{stage.accelerationOpportunities.length > 1 ? 'ies' : 'y'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stage progression timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Stage Progression Timeline</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />
            
            {/* Timeline events */}
            <div className="space-y-6">
              {stageAnalyses
                .sort((a, b) => a.stageIndex - b.stageIndex)
                .map((stage, index) => (
                  <div key={stage.stageId} className="relative flex items-start space-x-6">
                    {/* Timeline dot */}
                    <div className={`relative z-10 w-4 h-4 rounded-full border-2 border-white ${
                      stage.completionPercentage === 100 ? 'bg-green-500' :
                      stage.completionPercentage > 0 ? 'bg-blue-500' : 'bg-gray-300'
                    } shadow-lg`} />
                    
                    {/* Timeline content */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{stage.stageName}</h4>
                        <span className="text-sm text-gray-500">
                          {stage.currentDuration} days ({stage.expectedDuration} expected)
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Completion:</span>
                          <span className="ml-1 font-medium">{stage.completionPercentage}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Milestones:</span>
                          <span className="ml-1 font-medium">{stage.completedMilestones}/{stage.totalMilestones}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Difficulty:</span>
                          <span className="ml-1 font-medium">{stage.userPerceivedDifficulty}/5</span>
                        </div>
                      </div>

                      {/* Cultural adaptation score */}
                      <div className="mt-2 flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Cultural Adaptation:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-purple-500 h-1 rounded-full"
                            style={{ width: `${stage.culturalAdaptationEffectiveness * 100}%` }}
                          />
                        </div>
                        <span className="text-purple-600 font-medium">
                          {Math.round(stage.culturalAdaptationEffectiveness * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render milestone analysis
  const renderMilestoneAnalysis = () => {
    return (
      <div className="space-y-6">
        {/* Milestone overview metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">✅</div>
              <div>
                <div className="text-2xl font-bold">
                  {milestoneAnalyses.filter(m => m.completionStatus === 'completed').length}
                </div>
                <div className="text-sm opacity-80">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🔄</div>
              <div>
                <div className="text-2xl font-bold">
                  {milestoneAnalyses.filter(m => m.completionStatus === 'in_progress').length}
                </div>
                <div className="text-sm opacity-80">In Progress</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">📊</div>
              <div>
                <div className="text-2xl font-bold">
                  {milestoneAnalyses.length > 0 
                    ? Math.round(milestoneAnalyses.reduce((sum, m) => sum + m.completionQuality, 0) / milestoneAnalyses.length * 100)
                    : 0}%
                </div>
                <div className="text-sm opacity-80">Avg Quality</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">⏱️</div>
              <div>
                <div className="text-2xl font-bold">
                  {milestoneAnalyses.length > 0
                    ? Math.round(milestoneAnalyses
                        .filter(m => m.timeToComplete)
                        .reduce((sum, m) => sum + (m.timeToComplete || 0), 0) / 
                        milestoneAnalyses.filter(m => m.timeToComplete).length)
                    : 0}
                </div>
                <div className="text-sm opacity-80">Avg Days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone analysis table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Milestone Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Milestone</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Quality</th>
                  <th className="text-left py-3 px-4">Time</th>
                  <th className="text-left py-3 px-4">Difficulty</th>
                  <th className="text-left py-3 px-4">Cultural</th>
                </tr>
              </thead>
              <tbody>
                {milestoneAnalyses.map((milestone) => (
                  <tr key={milestone.milestoneId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">{milestone.milestoneName}</div>
                      <div className="text-xs text-gray-500">{milestone.pathwayStage}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded capitalize">
                        {milestone.milestoneType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded capitalize ${
                        milestone.completionStatus === 'completed' ? 'bg-green-100 text-green-700' :
                        milestone.completionStatus === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        milestone.completionStatus === 'blocked' ? 'bg-red-100 text-red-700' :
                        milestone.completionStatus === 'skipped' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {milestone.completionStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-purple-500 h-1 rounded-full"
                            style={{ width: `${milestone.completionQuality * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {Math.round(milestone.completionQuality * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-800">
                        {milestone.timeToComplete ? `${milestone.timeToComplete}d` : '-'}
                      </div>
                      <div className="text-xs text-gray-500">
                        (expected: {milestone.expectedCompletionTime}d)
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {'★'.repeat(milestone.perceivedDifficulty)}
                        {'☆'.repeat(5 - milestone.perceivedDifficulty)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs text-gray-600">
                        Relevance: {Math.round(milestone.culturalRelevance * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">
                        Alignment: {Math.round(milestone.culturalAlignment * 100)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Milestone insights */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Milestone Insights</h3>
          <div className="space-y-4">
            {milestoneInsights.map((insight) => (
              <div key={insight.insightId} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded ${
                    insight.priority === 'critical' ? 'bg-red-100 text-red-700' :
                    insight.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
                {insight.actionableRecommendations.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600">Recommendations:</div>
                    {insight.actionableRecommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="text-xs text-blue-600">• {rec}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render stage modal
  const renderStageModal = () => {
    if (!showStageModal || !selectedStage) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">{selectedStage.stageName}</h3>
              <button
                onClick={() => setShowStageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Stage overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {selectedStage.completionPercentage}%
                    </div>
                    <div className="text-sm text-blue-700">Completion</div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {selectedStage.completedMilestones}/{selectedStage.totalMilestones}
                    </div>
                    <div className="text-sm text-green-700">Milestones</div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {Math.round(selectedStage.dailyEngagementAverage * 100)}%
                    </div>
                    <div className="text-sm text-purple-700">Engagement</div>
                  </div>
                </div>
              </div>

              {/* Detailed metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Progress Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Duration:</span>
                      <span className="font-medium">{selectedStage.currentDuration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Duration:</span>
                      <span className="font-medium">{selectedStage.expectedDuration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progression Rate:</span>
                      <span className="font-medium">{selectedStage.progressionRate.toFixed(1)}%/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Relative Progress:</span>
                      <span className={`font-medium capitalize ${
                        selectedStage.relativeProgress.includes('ahead') ? 'text-green-600' :
                        selectedStage.relativeProgress === 'on_track' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {selectedStage.relativeProgress.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Cultural Adaptation</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Cultural Relevance</span>
                        <span>{Math.round(selectedStage.culturalRelevanceScore * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${selectedStage.culturalRelevanceScore * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Cultural Engagement</span>
                        <span>{Math.round(selectedStage.culturalEngagementLevel * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${selectedStage.culturalEngagementLevel * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Adaptation Effectiveness</span>
                        <span>{Math.round(selectedStage.culturalAdaptationEffectiveness * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${selectedStage.culturalAdaptationEffectiveness * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk factors and acceleration opportunities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedStage.riskFactors.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">🚨 Risk Factors</h4>
                    <div className="space-y-2">
                      {selectedStage.riskFactors.map((risk, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="font-medium text-red-800">{risk.factorName}</div>
                          <div className="text-sm text-red-700">{risk.description}</div>
                          <div className="text-xs text-red-600 mt-1">
                            Risk Level: {Math.round(risk.riskLevel * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedStage.accelerationOpportunities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">🚀 Acceleration Opportunities</h4>
                    <div className="space-y-2">
                      {selectedStage.accelerationOpportunities.map((opportunity, index) => (
                        <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="font-medium text-green-800">{opportunity.opportunityName}</div>
                          <div className="text-sm text-green-700">{opportunity.description}</div>
                          <div className="text-xs text-green-600 mt-1">
                            Potential Impact: {Math.round(opportunity.potentialImpact * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Predictive analysis */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">🔮 Predictive Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(selectedStage.completionProbability * 100)}%
                    </div>
                    <div className="text-sm text-blue-700">Completion Probability</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedStage.timeToCompletion}
                    </div>
                    <div className="text-sm text-orange-700">Days to Completion</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedStage.cohortPercentile}
                    </div>
                    <div className="text-sm text-purple-700">Cohort Percentile</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {renderStageModal()}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Pathway Progression Tracking
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Detailed milestone analysis, optimal pathway sequence identification, and 
            predictive modeling for enhanced learning outcomes and progression optimization.
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'stage_analysis', label: 'Stage Analysis', icon: '📊' },
              { id: 'milestone_analysis', label: 'Milestone Analysis', icon: '🎯' },
              { id: 'sequence_optimization', label: 'Sequence Optimization', icon: '🔄' },
              { id: 'predictive_models', label: 'Predictive Models', icon: '🔮' },
              { id: 'recommendations', label: 'Recommendations', icon: '💡' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {isLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Analyzing pathway progression patterns...</p>
          </div>
        ) : (
          <>
            {activeTab === 'stage_analysis' && renderStageAnalysis()}
            {activeTab === 'milestone_analysis' && renderMilestoneAnalysis()}
            {activeTab === 'sequence_optimization' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Sequence optimization analytics would be implemented here</p>
              </div>
            )}
            {activeTab === 'predictive_models' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Predictive models dashboard would be implemented here</p>
              </div>
            )}
            {activeTab === 'recommendations' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Adaptive recommendations system would be implemented here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Supporting types and interfaces
interface OptimizationOpportunity {
  opportunityId: string;
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  expectedImpact: number;
  implementationEffort: number;
}

interface MilestoneInsight {
  insightId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionableRecommendations: string[];
  affectedMilestones: string[];
}

interface SequenceRecommendation {
  recommendationId: string;
  title: string;
  description: string;
  sequenceChanges: string[];
  expectedImprovement: number;
  implementationComplexity: string;
}

interface FrustrationIndicator {
  indicatorType: string;
  severity: number;
  description: string;
  detectedAt: Date;
}

interface CulturalFeedback {
  feedbackType: string;
  rating: number;
  comment: string;
  submittedAt: Date;
}

interface StageRiskFactor {
  factorName: string;
  riskLevel: number;
  description: string;
  mitigationSuggestions: string[];
}

interface AccelerationOpportunity {
  opportunityName: string;
  description: string;
  potentialImpact: number;
  implementationSteps: string[];
}

interface PeerComparisonData {
  averageCompletion: number;
  averageTime: number;
  percentileRanking: number;
  similarUsers: number;
}

// API functions (implementations would be expanded)
const loadPathwayProgressionAnalytics = async (
  userId: string,
  pathwayFilter: string
): Promise<PathwayProgressionAnalytics[]> => {
  // Implementation would load pathway progression analytics
  return [];
};

const loadStageAnalyses = async (
  userId: string,
  learningPathways: LearningPathway[],
  pathwayFilter: string
): Promise<PathwayStageAnalysis[]> => {
  // Implementation would load detailed stage analyses
  return [];
};

const loadMilestoneAnalyses = async (
  userId: string,
  learningPathways: LearningPathway[],
  pathwayFilter: string
): Promise<MilestoneAnalysisData[]> => {
  // Implementation would load milestone analyses
  return [];
};

const loadSequenceAnalyses = async (
  userId: string,
  culturalContext: CulturalContext,
  pathwayFilter: string
): Promise<OptimalSequenceAnalysis[]> => {
  // Implementation would load sequence analyses
  return [];
};

const loadCompletionPredictiveModels = async (
  userId: string,
  pathwayFilter: string
): Promise<CompletionPredictiveModel[]> => {
  // Implementation would load predictive models
  return [];
};

const loadAdaptiveRecommendations = async (
  userId: string,
  pathwayFilter: string
): Promise<AdaptivePathwayRecommendation[]> => {
  // Implementation would load adaptive recommendations
  return [];
};

const generateOptimizationOpportunities = async (
  stages: PathwayStageAnalysis[],
  milestones: MilestoneAnalysisData[],
  sequences: OptimalSequenceAnalysis[]
): Promise<OptimizationOpportunity[]> => {
  // Implementation would generate optimization opportunities
  return [];
};

const generateMilestoneInsights = async (
  milestones: MilestoneAnalysisData[],
  culturalContext: CulturalContext
): Promise<MilestoneInsight[]> => {
  // Implementation would generate milestone insights
  return [];
};

const generateSequenceRecommendations = async (
  sequences: OptimalSequenceAnalysis[],
  culturalContext: CulturalContext
): Promise<SequenceRecommendation[]> => {
  // Implementation would generate sequence recommendations
  return [];
};

export default PathwayProgressionTracking;