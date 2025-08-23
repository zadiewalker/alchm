'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ImpactMeasurementSuite, 
  ValidatedAssessmentTool,
  PersonalDevelopmentAssessment,
  WellBeingMeasure,
  BaselineMeasurement,
  ProgressMeasurement,
  OutcomeMeasurement,
  ChangeCalculation,
  QualityOfLifeAssessment,
  ResearchGradeDataset,
  StatisticalSignificance,
  TimeframeCoverage
} from '@/types/analytics-outcome-measurement-schema';

interface ImpactMeasurementToolsProps {
  userId: string;
  impactMeasurementSuite?: ImpactMeasurementSuite | null;
  timeframe?: '1month' | '3months' | '6months' | '1year' | 'all';
  culturalContext?: {
    primaryCulture: string;
    secondaryCultures: string[];
    culturalValues: string[];
    languagePreferences: string[];
  };
  onAssessmentCompleted?: (assessment: PersonalDevelopmentAssessment) => void;
  onImpactMeasured?: (measurement: ChangeCalculation) => void;
  onResearchDataGenerated?: (dataset: ResearchGradeDataset) => void;
  className?: string;
}

export default function ImpactMeasurementTools({
  userId,
  impactMeasurementSuite,
  timeframe = '3months',
  culturalContext,
  onAssessmentCompleted,
  onImpactMeasured,
  onResearchDataGenerated,
  className = ''
}: ImpactMeasurementToolsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'assessments' | 'measurements' | 'outcomes' | 'research'>('assessments');
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  
  // Assessment Tools State
  const [availableAssessments, setAvailableAssessments] = useState<ValidatedAssessmentTool[]>([]);
  const [completedAssessments, setCompletedAssessments] = useState<PersonalDevelopmentAssessment[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<ValidatedAssessmentTool | null>(null);
  
  // Measurement State
  const [baselineMeasurements, setBaselineMeasurements] = useState<BaselineMeasurement[]>([]);
  const [progressMeasurements, setProgressMeasurements] = useState<ProgressMeasurement[]>([]);
  const [outcomeMeasurements, setOutcomeMeasurements] = useState<OutcomeMeasurement[]>([]);
  const [impactChanges, setImpactChanges] = useState<ChangeCalculation[]>([]);
  
  // Quality of Life State
  const [qualityOfLifeData, setQualityOfLifeData] = useState<QualityOfLifeAssessment | null>(null);
  const [wellBeingTrends, setWellBeingTrends] = useState<WellBeingMeasure[]>([]);
  
  // Research State
  const [researchDatasets, setResearchDatasets] = useState<ResearchGradeDataset[]>([]);
  const [statisticalResults, setStatisticalResults] = useState<StatisticalSignificance[]>([]);

  useEffect(() => {
    loadImpactMeasurementData();
  }, [userId, selectedTimeframe, culturalContext]);

  const loadImpactMeasurementData = async () => {
    try {
      setIsLoading(true);
      
      // Load available assessment tools
      const assessments = await loadValidatedAssessmentTools(culturalContext);
      setAvailableAssessments(assessments);
      
      // Load completed assessments
      const completed = await loadCompletedAssessments(userId, selectedTimeframe);
      setCompletedAssessments(completed);
      
      // Load measurement data
      const baseline = await loadBaselineMeasurements(userId);
      setBaselineMeasurements(baseline);
      
      const progress = await loadProgressMeasurements(userId, selectedTimeframe);
      setProgressMeasurements(progress);
      
      const outcomes = await loadOutcomeMeasurements(userId, selectedTimeframe);
      setOutcomeMeasurements(outcomes);
      
      // Calculate impact changes
      const changes = await calculateImpactChanges(baseline, progress, outcomes);
      setImpactChanges(changes);
      
      // Load quality of life data
      const qolData = await loadQualityOfLifeAssessment(userId, selectedTimeframe);
      setQualityOfLifeData(qolData);
      
      // Load well-being trends
      const trends = await loadWellBeingTrends(userId, selectedTimeframe);
      setWellBeingTrends(trends);
      
      // Load research datasets
      const datasets = await loadResearchGradeData(userId, selectedTimeframe, culturalContext);
      setResearchDatasets(datasets);
      
      // Load statistical significance results
      const stats = await loadStatisticalSignificance(changes, culturalContext);
      setStatisticalResults(stats);
      
    } catch (error) {
      console.error('Error loading impact measurement data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data loading functions
  const loadValidatedAssessmentTools = async (cultural: any): Promise<ValidatedAssessmentTool[]> => {
    return [
      {
        toolId: 'pdt-001',
        toolName: 'Personal Development Tracker',
        toolType: 'alchm_developed',
        reliability: { internalConsistency: 0.89, testRetest: 0.85, interRater: 0.92 },
        validity: { content: 0.88, construct: 0.91, criterion: 0.87 },
        culturalAdaptation: { 
          culturalRelevance: 0.92, 
          culturalSensitivity: 0.89, 
          crossCulturalValidity: 0.86,
          culturalBiasAssessment: 0.91
        },
        normativeData: [],
        assessmentDomains: [],
        assessmentItems: [],
        scoringMethods: [],
        interpretationGuidelines: [],
        administrationProtocol: {} as any,
        timeRequirements: {} as any,
        prerequisiteAssessments: [],
        followUpAssessments: [],
        researchApplications: [],
        academicValidation: [],
        peerReviewStatus: {} as any,
        publicationStatus: [],
        accessibilityFeatures: [],
        culturalInclusivity: [],
        languageAdaptations: [],
        disabilityAccommodations: [],
        developedAt: new Date('2024-01-01'),
        lastValidated: new Date('2024-08-01'),
        validationStatus: 'validated'
      },
      {
        toolId: 'wbm-002',
        toolName: 'Well-Being Measurement Scale',
        toolType: 'pre_validated',
        reliability: { internalConsistency: 0.94, testRetest: 0.88, interRater: 0.90 },
        validity: { content: 0.93, construct: 0.89, criterion: 0.92 },
        culturalAdaptation: { 
          culturalRelevance: 0.88, 
          culturalSensitivity: 0.94, 
          crossCulturalValidity: 0.91,
          culturalBiasAssessment: 0.87
        },
        normativeData: [],
        assessmentDomains: [],
        assessmentItems: [],
        scoringMethods: [],
        interpretationGuidelines: [],
        administrationProtocol: {} as any,
        timeRequirements: {} as any,
        prerequisiteAssessments: [],
        followUpAssessments: [],
        researchApplications: [],
        academicValidation: [],
        peerReviewStatus: {} as any,
        publicationStatus: [],
        accessibilityFeatures: [],
        culturalInclusivity: [],
        languageAdaptations: [],
        disabilityAccommodations: [],
        developedAt: new Date('2023-06-01'),
        lastValidated: new Date('2024-07-15'),
        validationStatus: 'research_grade'
      }
    ];
  };

  const loadCompletedAssessments = async (userId: string, timeframe: string): Promise<PersonalDevelopmentAssessment[]> => {
    return [
      {
        assessmentId: 'pda-001',
        userId: userId,
        toolId: 'pdt-001',
        assessmentType: 'baseline',
        responses: [],
        scores: {
          overall: 72,
          domains: [
            { domain: 'Self-Awareness', score: 78, percentile: 68 },
            { domain: 'Emotional Intelligence', score: 69, percentile: 54 },
            { domain: 'Resilience', score: 74, percentile: 71 },
            { domain: 'Purpose Clarity', score: 67, percentile: 49 }
          ]
        },
        interpretation: {
          strengths: ['Strong self-reflection abilities', 'Good stress management'],
          growthAreas: ['Emotional regulation', 'Goal clarity'],
          recommendations: ['Focus on emotional intelligence pathway', 'Engage with purpose exploration exercises']
        },
        culturalConsiderations: {
          culturalRelevance: 0.89,
          adaptationNotes: ['Assessment adapted for collectivist cultural values', 'Family-centered questions emphasized']
        },
        completedAt: new Date('2024-06-01'),
        validatedAt: new Date('2024-06-02'),
        reliability: 0.91
      }
    ];
  };

  const loadBaselineMeasurements = async (userId: string): Promise<BaselineMeasurement[]> => {
    return [
      {
        measurementId: 'bm-001',
        userId: userId,
        measurementType: 'personal_development_baseline',
        measurementDomain: 'overall_wellbeing',
        baselineValue: 6.2,
        measurementUnit: 'likert_scale_1_10',
        measurementDate: new Date('2024-01-15'),
        culturalContext: 'multicultural_urban',
        validationStatus: 'validated',
        reliability: 0.88
      },
      {
        measurementId: 'bm-002',
        userId: userId,
        measurementType: 'life_satisfaction_baseline',
        measurementDomain: 'life_satisfaction',
        baselineValue: 7.1,
        measurementUnit: 'swls_scale',
        measurementDate: new Date('2024-01-15'),
        culturalContext: 'multicultural_urban',
        validationStatus: 'validated',
        reliability: 0.92
      }
    ];
  };

  const loadProgressMeasurements = async (userId: string, timeframe: string): Promise<ProgressMeasurement[]> => {
    return [
      {
        measurementId: 'pm-001',
        userId: userId,
        measurementType: 'personal_development_progress',
        measurementDomain: 'overall_wellbeing',
        currentValue: 7.4,
        previousValue: 6.2,
        changeAmount: 1.2,
        changePercentage: 19.4,
        measurementDate: new Date('2024-08-15'),
        comparisonPeriod: '6_months',
        trendDirection: 'increasing',
        significanceLevel: 0.02,
        culturalContext: 'multicultural_urban'
      },
      {
        measurementId: 'pm-002',
        userId: userId,
        measurementType: 'life_satisfaction_progress',
        measurementDomain: 'life_satisfaction',
        currentValue: 8.3,
        previousValue: 7.1,
        changeAmount: 1.2,
        changePercentage: 16.9,
        measurementDate: new Date('2024-08-15'),
        comparisonPeriod: '6_months',
        trendDirection: 'increasing',
        significanceLevel: 0.01,
        culturalContext: 'multicultural_urban'
      }
    ];
  };

  const loadOutcomeMeasurements = async (userId: string, timeframe: string): Promise<OutcomeMeasurement[]> => {
    return [
      {
        measurementId: 'om-001',
        userId: userId,
        outcomeType: 'personal_growth_outcome',
        outcomeDomain: 'self_awareness',
        outcomeValue: 8.1,
        outcomeUnit: 'standardized_score',
        measurementDate: new Date('2024-08-19'),
        outcomeReliability: 0.89,
        outcomeValidation: 'externally_validated',
        culturalRelevance: 0.92,
        realWorldApplication: 'improved_decision_making'
      },
      {
        measurementId: 'om-002',
        userId: userId,
        outcomeType: 'behavioral_change_outcome',
        outcomeDomain: 'emotional_regulation',
        outcomeValue: 7.6,
        outcomeUnit: 'behavioral_frequency_scale',
        measurementDate: new Date('2024-08-19'),
        outcomeReliability: 0.86,
        outcomeValidation: 'self_reported_validated',
        culturalRelevance: 0.88,
        realWorldApplication: 'better_relationship_management'
      }
    ];
  };

  const calculateImpactChanges = async (
    baseline: BaselineMeasurement[],
    progress: ProgressMeasurement[],
    outcomes: OutcomeMeasurement[]
  ): Promise<ChangeCalculation[]> => {
    return [
      {
        calculationId: 'cc-001',
        userId: userId,
        measurementDomain: 'overall_wellbeing',
        baselineValue: 6.2,
        currentValue: 7.4,
        changeAmount: 1.2,
        changePercentage: 19.4,
        effectSize: 0.68,
        statisticalSignificance: 0.02,
        confidenceInterval: { lower: 0.4, upper: 2.0 },
        changeClassification: 'meaningful_improvement',
        culturallyAdjustedChange: 1.15,
        realWorldSignificance: 'clinically_meaningful',
        calculationMethod: 'cohens_d_with_cultural_adjustment',
        calculatedAt: new Date('2024-08-19')
      },
      {
        calculationId: 'cc-002',
        userId: userId,
        measurementDomain: 'life_satisfaction',
        baselineValue: 7.1,
        currentValue: 8.3,
        changeAmount: 1.2,
        changePercentage: 16.9,
        effectSize: 0.82,
        statisticalSignificance: 0.01,
        confidenceInterval: { lower: 0.6, upper: 1.8 },
        changeClassification: 'significant_improvement',
        culturallyAdjustedChange: 1.28,
        realWorldSignificance: 'highly_meaningful',
        calculationMethod: 'hedges_g_with_cultural_weighting',
        calculatedAt: new Date('2024-08-19')
      }
    ];
  };

  const loadQualityOfLifeAssessment = async (userId: string, timeframe: string): Promise<QualityOfLifeAssessment> => {
    return {
      assessmentId: 'qol-001',
      userId: userId,
      overallQualityOfLife: 7.8,
      physicalHealth: 7.2,
      mentalHealth: 8.1,
      socialRelationships: 7.6,
      environmentalFactors: 7.9,
      personalSatisfaction: 8.3,
      purposeAndMeaning: 8.0,
      culturalWellBeing: 7.7,
      assessmentDate: new Date('2024-08-15'),
      comparisonToPrevious: {
        overallChange: 1.4,
        significantImprovements: ['mentalHealth', 'personalSatisfaction', 'purposeAndMeaning'],
        areasForGrowth: ['physicalHealth', 'socialRelationships']
      },
      culturalAdaptation: {
        culturalRelevance: 0.91,
        culturalSensitivity: 0.88,
        crossCulturalValidity: 0.85
      },
      validationStatus: 'research_validated'
    };
  };

  const loadWellBeingTrends = async (userId: string, timeframe: string): Promise<WellBeingMeasure[]> => {
    return [
      {
        measureId: 'wbm-001',
        userId: userId,
        measureType: 'subjective_wellbeing',
        measureValue: 7.8,
        measureDate: new Date('2024-08-19'),
        measureDomain: 'life_satisfaction',
        culturalContext: 'multicultural_urban',
        validationLevel: 'research_grade',
        reliability: 0.91
      },
      {
        measureId: 'wbm-002',
        userId: userId,
        measureType: 'psychological_wellbeing',
        measureValue: 8.2,
        measureDate: new Date('2024-08-19'),
        measureDomain: 'personal_growth',
        culturalContext: 'multicultural_urban',
        validationLevel: 'clinically_validated',
        reliability: 0.88
      }
    ];
  };

  const loadResearchGradeData = async (userId: string, timeframe: string, cultural: any): Promise<ResearchGradeDataset[]> => {
    return [
      {
        datasetId: 'rgd-001',
        userId: userId,
        datasetType: 'longitudinal_personal_development',
        dataQuality: 0.94,
        sampleSize: 847,
        timeframeCoverage: {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-08-19'),
          frequency: 'weekly',
          dataPoints: 33
        },
        statisticalPower: 0.89,
        culturalRepresentation: 0.87,
        ethicalApproval: 'institutional_review_board_approved',
        dataAnonymization: 'differential_privacy_applied',
        researchApplications: ['personal_development_effectiveness', 'cultural_adaptation_studies'],
        academicPartners: ['Stanford_Psychology_Dept', 'MIT_Well_Being_Lab'],
        publicationPotential: 'high_impact_journals',
        generatedAt: new Date('2024-08-19')
      }
    ];
  };

  const loadStatisticalSignificance = async (changes: ChangeCalculation[], cultural: any): Promise<StatisticalSignificance[]> => {
    return [
      {
        testId: 'ss-001',
        testType: 'paired_t_test_with_cultural_adjustment',
        hypothesis: 'alchm_pathways_improve_wellbeing',
        pValue: 0.002,
        effectSize: 0.74,
        confidenceLevel: 0.95,
        sampleSize: 847,
        powerAnalysis: 0.92,
        culturalValidation: 0.89,
        practicalSignificance: 'clinically_meaningful',
        researchImplications: ['pathway_effectiveness_confirmed', 'cultural_adaptation_successful'],
        calculatedAt: new Date('2024-08-19')
      }
    ];
  };

  const renderAssessmentTools = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableAssessments.map((tool) => (
            <div key={tool.toolId} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{tool.toolName}</h3>
                  <div className="text-sm text-gray-600 capitalize">{tool.toolType.replace('_', ' ')}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">
                    Reliability: {(tool.reliability.internalConsistency * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    Status: {tool.validationStatus}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cultural Relevance:</span>
                  <span className="font-medium">{(tool.culturalAdaptation.culturalRelevance * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cross-Cultural Validity:</span>
                  <span className="font-medium">{(tool.culturalAdaptation.crossCulturalValidity * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Research Grade:</span>
                  <span className="font-medium">{tool.validationStatus === 'research_grade' ? 'Yes' : 'No'}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setActiveAssessment(tool)}
                className="mt-4 w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                Begin Assessment
              </button>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Completed Assessments</h3>
          <div className="space-y-3">
            {completedAssessments.map((assessment) => (
              <div key={assessment.assessmentId} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-800">Assessment ID: {assessment.assessmentId}</div>
                    <div className="text-sm text-gray-600">Overall Score: {assessment.scores.overall}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {assessment.completedAt.toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {assessment.scores.domains.map((domain) => (
                    <div key={domain.domain} className="text-center">
                      <div className="font-medium text-gray-700">{domain.score}</div>
                      <div className="text-gray-500 text-xs">{domain.domain}</div>
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

  const renderImpactMeasurements = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactChanges.map((change) => (
            <div key={change.calculationId} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-gray-800 capitalize">
                  {change.measurementDomain.replace('_', ' ')}
                </h3>
                <div className="text-3xl font-bold text-green-600 mt-2">
                  +{change.changePercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  Effect Size: {change.effectSize.toFixed(2)}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Baseline:</span>
                  <span className="font-medium">{change.baselineValue.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current:</span>
                  <span className="font-medium">{change.currentValue.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Change:</span>
                  <span className="font-medium text-green-600">+{change.changeAmount.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">P-value:</span>
                  <span className="font-medium">{change.statisticalSignificance.toFixed(3)}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800 capitalize">
                  {change.changeClassification.replace('_', ' ')}
                </div>
                <div className="text-xs text-green-700 mt-1 capitalize">
                  {change.realWorldSignificance.replace('_', ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {qualityOfLifeData && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Quality of Life Assessment</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Overall', value: qualityOfLifeData.overallQualityOfLife },
                { label: 'Mental Health', value: qualityOfLifeData.mentalHealth },
                { label: 'Social Relations', value: qualityOfLifeData.socialRelationships },
                { label: 'Purpose & Meaning', value: qualityOfLifeData.purposeAndMeaning }
              ].map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metric.value.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Significant Improvements</h4>
                <div className="space-y-1">
                  {qualityOfLifeData.comparisonToPrevious.significantImprovements.map((improvement) => (
                    <div key={improvement} className="text-sm text-green-600 capitalize">
                      • {improvement.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Areas for Growth</h4>
                <div className="space-y-1">
                  {qualityOfLifeData.comparisonToPrevious.areasForGrowth.map((area) => (
                    <div key={area} className="text-sm text-amber-600 capitalize">
                      • {area.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOutcomeTracking = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {outcomeMeasurements.map((outcome) => (
            <div key={outcome.measurementId} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 capitalize">
                    {outcome.outcomeDomain.replace('_', ' ')}
                  </h3>
                  <div className="text-sm text-gray-600 capitalize">{outcome.outcomeType.replace('_', ' ')}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{outcome.outcomeValue.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">{outcome.outcomeUnit.replace('_', ' ')}</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reliability:</span>
                  <span className="font-medium">{(outcome.outcomeReliability * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cultural Relevance:</span>
                  <span className="font-medium">{(outcome.culturalRelevance * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Validation:</span>
                  <span className="font-medium capitalize">{outcome.outcomeValidation.replace('_', ' ')}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800">Real-World Application</div>
                <div className="text-sm text-blue-700 capitalize">
                  {outcome.realWorldApplication.replace('_', ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Well-Being Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wellBeingTrends.map((trend) => (
              <div key={trend.measureId} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{trend.measureValue.toFixed(1)}</div>
                  <div className="text-sm text-gray-600 capitalize">{trend.measureDomain.replace('_', ' ')}</div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">
                    {trend.measureType.replace('_', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResearchData = () => {
    return (
      <div className="space-y-6">
        {researchDatasets.map((dataset) => (
          <div key={dataset.datasetId} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 capitalize">
                  {dataset.datasetType.replace('_', ' ')}
                </h3>
                <div className="text-sm text-gray-600">Dataset ID: {dataset.datasetId}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">
                  Quality: {(dataset.dataQuality * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500">
                  Sample: {dataset.sampleSize.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{dataset.timeframeCoverage.dataPoints}</div>
                <div className="text-sm text-gray-600">Data Points</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{(dataset.statisticalPower * 100).toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Statistical Power</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{(dataset.culturalRepresentation * 100).toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Cultural Rep.</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 capitalize">
                  {dataset.publicationPotential.replace('_', ' ')}
                </div>
                <div className="text-sm text-gray-600">Pub. Potential</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Research Applications</h4>
                <div className="space-y-1">
                  {dataset.researchApplications.map((app) => (
                    <div key={app} className="text-sm text-blue-600 capitalize">
                      • {app.replace('_', ' ')}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Academic Partners</h4>
                <div className="space-y-1">
                  {dataset.academicPartners.map((partner) => (
                    <div key={partner} className="text-sm text-green-600">
                      • {partner.replace('_', ' ')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-purple-800">Ethics & Privacy</div>
              <div className="text-sm text-purple-700 capitalize">
                {dataset.ethicalApproval.replace('_', ' ')} • {dataset.dataAnonymization.replace('_', ' ')}
              </div>
            </div>
          </div>
        ))}
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Statistical Significance Results</h3>
          <div className="space-y-4">
            {statisticalResults.map((result) => (
              <div key={result.testId} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{result.pValue.toFixed(4)}</div>
                    <div className="text-sm text-gray-600">P-value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{result.effectSize.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Effect Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{(result.powerAnalysis * 100).toFixed(0)}%</div>
                    <div className="text-sm text-gray-600">Statistical Power</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{result.sampleSize.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Sample Size</div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700 capitalize">
                  <strong>Hypothesis:</strong> {result.hypothesis.replace('_', ' ')}
                </div>
                <div className="text-sm text-green-700 capitalize mt-1">
                  <strong>Significance:</strong> {result.practicalSignificance.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
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
          <h2 className="text-2xl font-bold text-gray-800">Impact Measurement Tools</h2>
          <p className="text-gray-600">Validated assessment tools and research-grade impact measurement</p>
        </div>
        
        <div className="flex items-center space-x-3">
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
            { id: 'assessments', label: 'Assessment Tools', count: availableAssessments.length },
            { id: 'measurements', label: 'Impact Measurements', count: impactChanges.length },
            { id: 'outcomes', label: 'Outcome Tracking', count: outcomeMeasurements.length },
            { id: 'research', label: 'Research Data', count: researchDatasets.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
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
        {activeTab === 'assessments' && renderAssessmentTools()}
        {activeTab === 'measurements' && renderImpactMeasurements()}
        {activeTab === 'outcomes' && renderOutcomeTracking()}
        {activeTab === 'research' && renderResearchData()}
      </div>
    </div>
  );
}