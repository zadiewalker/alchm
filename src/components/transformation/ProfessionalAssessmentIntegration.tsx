'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ClinicalAssessment {
  id: string;
  name: string;
  type: 'self_report' | 'clinical_scale' | 'behavioral_marker' | 'therapeutic_outcome';
  description: string;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  lastCompleted: Date | null;
  nextDue: Date;
  scores: AssessmentScore[];
  interpretation: string;
  recommendations: string[];
  correlations: CorrelationData[];
}

interface AssessmentScore {
  date: Date;
  score: number;
  percentile: number;
  category: 'low' | 'moderate' | 'high' | 'severe';
  notes?: string;
}

interface CorrelationData {
  metric: string;
  correlation: number;
  significance: number;
  interpretation: string;
}

interface TherapeuticOutcome {
  measure: string;
  baseline: number;
  current: number;
  target: number;
  progress: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: Date;
}

interface ProfessionalReport {
  generatedDate: Date;
  period: string;
  transformationSummary: string;
  clinicalCorrelations: string[];
  recommendations: string[];
  riskFactors: string[];
  strengths: string[];
  nextSteps: string[];
}

interface ProfessionalAssessmentIntegrationProps {
  userId: string;
  transformationData: any;
}

export const ProfessionalAssessmentIntegration: React.FC<ProfessionalAssessmentIntegrationProps> = ({
  userId,
  transformationData
}) => {
  const [assessments, setAssessments] = useState<ClinicalAssessment[]>([]);
  const [therapeuticOutcomes, setTherapeuticOutcomes] = useState<TherapeuticOutcome[]>([]);
  const [professionalReport, setProfessionalReport] = useState<ProfessionalReport | null>(null);
  const [selectedView, setSelectedView] = useState<'assessments' | 'outcomes' | 'correlations' | 'reports'>('assessments');
  const [isLoading, setIsLoading] = useState(true);
  const [showDataSharing, setShowDataSharing] = useState(false);

  useEffect(() => {
    loadAssessments();
    loadTherapeuticOutcomes();
    generateProfessionalReport();
  }, [userId]);

  const loadAssessments = async () => {
    try {
      // Mock clinical assessments data
      const mockAssessments: ClinicalAssessment[] = [
        {
          id: 'phq9',
          name: 'PHQ-9 (Depression)',
          type: 'clinical_scale',
          description: 'Patient Health Questionnaire-9 for depression screening',
          frequency: 'biweekly',
          lastCompleted: new Date('2024-09-15'),
          nextDue: new Date('2024-09-29'),
          scores: [
            { date: new Date('2024-06-01'), score: 14, percentile: 85, category: 'moderate', notes: 'Baseline assessment' },
            { date: new Date('2024-07-01'), score: 11, percentile: 75, category: 'moderate' },
            { date: new Date('2024-08-01'), score: 8, percentile: 60, category: 'moderate' },
            { date: new Date('2024-09-01'), score: 5, percentile: 40, category: 'low' },
            { date: new Date('2024-09-15'), score: 4, percentile: 30, category: 'low' }
          ],
          interpretation: 'Significant improvement in depressive symptoms over 3.5 months',
          recommendations: [
            'Continue current therapeutic interventions',
            'Maintain daily journaling practice',
            'Monitor for seasonal changes'
          ],
          correlations: [
            { metric: 'journal_emotional_tone', correlation: 0.73, significance: 0.001, interpretation: 'Strong negative correlation with journal emotional tone' },
            { metric: 'sleep_quality', correlation: -0.68, significance: 0.002, interpretation: 'Better sleep correlates with lower depression scores' }
          ]
        },
        {
          id: 'gad7',
          name: 'GAD-7 (Anxiety)',
          type: 'clinical_scale',
          description: 'Generalized Anxiety Disorder 7-item scale',
          frequency: 'biweekly',
          lastCompleted: new Date('2024-09-15'),
          nextDue: new Date('2024-09-29'),
          scores: [
            { date: new Date('2024-06-01'), score: 12, percentile: 80, category: 'moderate' },
            { date: new Date('2024-07-01'), score: 10, percentile: 70, category: 'moderate' },
            { date: new Date('2024-08-01'), score: 7, percentile: 55, category: 'moderate' },
            { date: new Date('2024-09-01'), score: 6, percentile: 45, category: 'low' },
            { date: new Date('2024-09-15'), score: 4, percentile: 25, category: 'low' }
          ],
          interpretation: 'Consistent reduction in anxiety symptoms with stabilization in low range',
          recommendations: [
            'Continue mindfulness practices',
            'Gradually expose to previously avoided situations',
            'Track anxiety triggers in journal'
          ],
          correlations: [
            { metric: 'mindfulness_practice_frequency', correlation: -0.71, significance: 0.001, interpretation: 'Regular mindfulness practice strongly reduces anxiety' }
          ]
        },
        {
          id: 'wemwbs',
          name: 'WEMWBS (Mental Wellbeing)',
          type: 'self_report',
          description: 'Warwick-Edinburgh Mental Wellbeing Scale',
          frequency: 'monthly',
          lastCompleted: new Date('2024-09-01'),
          nextDue: new Date('2024-10-01'),
          scores: [
            { date: new Date('2024-06-01'), score: 42, percentile: 35, category: 'moderate' },
            { date: new Date('2024-07-01'), score: 48, percentile: 50, category: 'moderate' },
            { date: new Date('2024-08-01'), score: 54, percentile: 70, category: 'high' },
            { date: new Date('2024-09-01'), score: 58, percentile: 80, category: 'high' }
          ],
          interpretation: 'Steady improvement in overall mental wellbeing',
          recommendations: [
            'Maintain current wellness practices',
            'Explore additional creative outlets',
            'Consider peer support groups'
          ],
          correlations: [
            { metric: 'journal_gratitude_expressions', correlation: 0.79, significance: 0.001, interpretation: 'Gratitude practice strongly correlates with wellbeing' }
          ]
        },
        {
          id: 'pc_ptsd5',
          name: 'PC-PTSD-5 (Trauma)',
          type: 'clinical_scale',
          description: 'Primary Care PTSD Screen for DSM-5',
          frequency: 'monthly',
          lastCompleted: new Date('2024-09-01'),
          nextDue: new Date('2024-10-01'),
          scores: [
            { date: new Date('2024-06-01'), score: 4, percentile: 90, category: 'high' },
            { date: new Date('2024-07-01'), score: 3, percentile: 75, category: 'moderate' },
            { date: new Date('2024-08-01'), score: 2, percentile: 50, category: 'moderate' },
            { date: new Date('2024-09-01'), score: 1, percentile: 25, category: 'low' }
          ],
          interpretation: 'Significant reduction in trauma-related symptoms',
          recommendations: [
            'Continue trauma-informed therapy',
            'Practice grounding techniques',
            'Monitor for triggers during stress'
          ],
          correlations: [
            { metric: 'journal_self_compassion', correlation: -0.65, significance: 0.005, interpretation: 'Self-compassion practices reduce trauma symptoms' }
          ]
        }
      ];

      setAssessments(mockAssessments);
    } catch (error) {
      console.error('Error loading assessments:', error);
    }
  };

  const loadTherapeuticOutcomes = async () => {
    try {
      const mockOutcomes: TherapeuticOutcome[] = [
        {
          measure: 'Emotional Regulation',
          baseline: 3.2,
          current: 7.1,
          target: 7.0,
          progress: 1.02,
          trend: 'improving',
          lastUpdated: new Date('2024-09-15')
        },
        {
          measure: 'Social Functioning',
          baseline: 4.1,
          current: 6.8,
          target: 7.5,
          progress: 0.91,
          trend: 'improving',
          lastUpdated: new Date('2024-09-15')
        },
        {
          measure: 'Stress Management',
          baseline: 2.8,
          current: 6.5,
          target: 7.0,
          progress: 0.93,
          trend: 'improving',
          lastUpdated: new Date('2024-09-15')
        },
        {
          measure: 'Sleep Quality',
          baseline: 3.5,
          current: 7.2,
          target: 7.0,
          progress: 1.03,
          trend: 'stable',
          lastUpdated: new Date('2024-09-15')
        },
        {
          measure: 'Life Satisfaction',
          baseline: 4.0,
          current: 7.8,
          target: 8.0,
          progress: 0.98,
          trend: 'improving',
          lastUpdated: new Date('2024-09-15')
        }
      ];

      setTherapeuticOutcomes(mockOutcomes);
    } catch (error) {
      console.error('Error loading therapeutic outcomes:', error);
    }
  };

  const generateProfessionalReport = async () => {
    try {
      const mockReport: ProfessionalReport = {
        generatedDate: new Date(),
        period: 'June 2024 - September 2024',
        transformationSummary: 'Client demonstrates significant improvement across multiple domains with consistent engagement in therapeutic interventions and self-directed healing practices.',
        clinicalCorrelations: [
          'Journal emotional tone strongly correlates with PHQ-9 scores (r = -0.73)',
          'Mindfulness practice frequency inversely correlates with GAD-7 scores (r = -0.71)',
          'Gratitude expressions in journal correlate with WEMWBS scores (r = 0.79)',
          'Self-compassion language reduces PC-PTSD-5 scores (r = -0.65)'
        ],
        recommendations: [
          'Continue current therapeutic modality with focus on consolidating gains',
          'Maintain daily journaling practice as primary intervention tool',
          'Introduce advanced mindfulness techniques for anxiety management',
          'Explore trauma integration through continued therapeutic work',
          'Consider group therapy for additional social support'
        ],
        riskFactors: [
          'Seasonal changes may impact mood stability',
          'High stress periods could trigger anxiety symptoms',
          'Social isolation during difficult times'
        ],
        strengths: [
          'High engagement with therapeutic interventions',
          'Consistent self-reflection and journaling practice',
          'Strong development of emotional awareness',
          'Effective use of coping strategies',
          'Willingness to explore difficult emotions'
        ],
        nextSteps: [
          'Continue biweekly PHQ-9 and GAD-7 monitoring',
          'Monthly WEMWBS assessment for wellbeing tracking',
          'Quarterly PC-PTSD-5 for trauma symptom monitoring',
          'Introduce additional resilience measures',
          'Consider discharge planning at 6-month mark if stability maintained'
        ]
      };

      setProfessionalReport(mockReport);
    } catch (error) {
      console.error('Error generating professional report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAssessmentCard = (assessment: ClinicalAssessment) => {
    const latestScore = assessment.scores[assessment.scores.length - 1];
    const firstScore = assessment.scores[0];
    const improvement = firstScore ? ((firstScore.score - latestScore.score) / firstScore.score) * 100 : 0;

    return (
      <Card key={assessment.id} className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">{assessment.name}</h3>
            <p className="text-sm text-gray-600">{assessment.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              Assessed {assessment.frequency} • Last: {assessment.lastCompleted?.toLocaleDateString()}
            </p>
          </div>
          
          <div className="text-right">
            <div className={`text-2xl font-medium ${
              latestScore.category === 'low' ? 'text-green-600' :
              latestScore.category === 'moderate' ? 'text-amber-600' :
              latestScore.category === 'high' ? 'text-red-600' : 'text-red-800'
            }`}>
              {latestScore.score}
            </div>
            <div className="text-xs text-gray-500">{latestScore.category}</div>
            {improvement > 0 && (
              <div className="text-sm text-green-600">↓ {Math.round(improvement)}%</div>
            )}
          </div>
        </div>

        {/* Score Trend */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Score Trend</h4>
          <div className="flex items-end space-x-1 h-20">
            {assessment.scores.map((score, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t ${
                    score.category === 'low' ? 'bg-green-500' :
                    score.category === 'moderate' ? 'bg-amber-500' :
                    score.category === 'high' ? 'bg-red-500' : 'bg-red-700'
                  }`}
                  style={{ height: `${(score.score / 27) * 100}%` }}
                />
                <div className="text-xs text-gray-500 mt-1">{score.date.getMonth() + 1}/{score.date.getDate()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interpretation */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Clinical Interpretation</h4>
          <p className="text-sm text-gray-700">{assessment.interpretation}</p>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="text-sm font-medium mb-2">Recommendations</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {assessment.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    );
  };

  const renderTherapeuticOutcomes = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {therapeuticOutcomes.map((outcome) => (
            <Card key={outcome.measure} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{outcome.measure}</h3>
                <div className={`flex items-center space-x-1 ${
                  outcome.trend === 'improving' ? 'text-green-600' :
                  outcome.trend === 'stable' ? 'text-blue-600' : 'text-red-600'
                }`}>
                  <span>{outcome.trend === 'improving' ? '↗' : outcome.trend === 'stable' ? '→' : '↘'}</span>
                  <span className="text-sm">{outcome.trend}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Baseline</span>
                  <span>{outcome.baseline.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current</span>
                  <span className="font-medium">{outcome.current.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Target</span>
                  <span>{outcome.target.toFixed(1)}</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(outcome.progress * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      outcome.progress >= 1 ? 'bg-green-500' :
                      outcome.progress >= 0.8 ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(outcome.progress * 100, 100)}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Progress Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Therapeutic Progress Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Targets Achieved</h4>
              <div className="text-2xl font-medium text-green-600">
                {therapeuticOutcomes.filter(o => o.progress >= 1).length}/{therapeuticOutcomes.length}
              </div>
              <div className="text-sm text-gray-600">outcome measures</div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Average Progress</h4>
              <div className="text-2xl font-medium text-blue-600">
                {Math.round(therapeuticOutcomes.reduce((sum, o) => sum + o.progress, 0) / therapeuticOutcomes.length * 100)}%
              </div>
              <div className="text-sm text-gray-600">toward targets</div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Improving Areas</h4>
              <div className="text-2xl font-medium text-amber-600">
                {therapeuticOutcomes.filter(o => o.trend === 'improving').length}
              </div>
              <div className="text-sm text-gray-600">active improvements</div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderCorrelations = () => {
    const allCorrelations = assessments.flatMap(a => a.correlations);
    
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Journal-Clinical Correlations</h3>
          <p className="text-sm text-gray-600 mb-4">
            Statistical relationships between your journaling patterns and clinical assessment scores.
          </p>
          
          <div className="space-y-4">
            {allCorrelations.map((corr, index) => (
              <div key={index} className="border-l-4 border-amber-500 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{corr.metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm px-2 py-1 rounded ${
                      Math.abs(corr.correlation) >= 0.7 ? 'bg-green-100 text-green-800' :
                      Math.abs(corr.correlation) >= 0.5 ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      r = {corr.correlation.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">p = {corr.significance.toFixed(3)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{corr.interpretation}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Correlation Strength Guide */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Understanding Correlations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Strong (|r| ≥ 0.7)</h4>
              <p className="text-sm text-gray-600">High predictive value for clinical outcomes</p>
              <div className="w-full bg-green-100 h-2 rounded mt-2" />
            </div>
            <div>
              <h4 className="font-medium mb-2">Moderate (|r| 0.5-0.7)</h4>
              <p className="text-sm text-gray-600">Meaningful relationship worth monitoring</p>
              <div className="w-full bg-amber-100 h-2 rounded mt-2" />
            </div>
            <div>
              <h4 className="font-medium mb-2">Weak (|r| < 0.5)</h4>
              <p className="text-sm text-gray-600">Limited predictive value</p>
              <div className="w-full bg-gray-100 h-2 rounded mt-2" />
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderProfessionalReport = () => {
    if (!professionalReport) return null;

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Professional Assessment Report</h3>
            <div className="text-sm text-gray-500">
              Generated: {professionalReport.generatedDate.toLocaleDateString()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Assessment Period</h4>
              <p className="text-sm text-gray-600">{professionalReport.period}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Overall Progress</h4>
              <p className="text-sm text-gray-600">{professionalReport.transformationSummary}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clinical Correlations */}
          <Card className="p-6">
            <h4 className="font-medium mb-3">Clinical Correlations</h4>
            <ul className="space-y-2">
              {professionalReport.clinicalCorrelations.map((corr, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">📊</span>
                  <span>{corr}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <h4 className="font-medium mb-3">Clinical Recommendations</h4>
            <ul className="space-y-2">
              {professionalReport.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Strengths */}
          <Card className="p-6">
            <h4 className="font-medium mb-3">Client Strengths</h4>
            <ul className="space-y-2">
              {professionalReport.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-amber-500 mt-0.5">⭐</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Risk Factors */}
          <Card className="p-6">
            <h4 className="font-medium mb-3">Risk Factors to Monitor</h4>
            <ul className="space-y-2">
              {professionalReport.riskFactors.map((risk, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-red-500 mt-0.5">⚠</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="p-6">
          <h4 className="font-medium mb-3">Next Steps</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionalReport.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-purple-500 mt-0.5">🎯</span>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Data Sharing Controls */}
        <Card className="p-6">
          <h4 className="font-medium mb-3">Professional Data Sharing</h4>
          <p className="text-sm text-gray-600 mb-4">
            Control how your assessment data is shared with healthcare providers.
          </p>
          <Button
            variant="outline"
            onClick={() => setShowDataSharing(true)}
            className="flex items-center space-x-2"
          >
            <span>🔒</span>
            <span>Manage Data Sharing</span>
          </Button>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🏥</div>
          <p className="text-gray-600">Loading professional assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Professional Assessment Integration</h2>
          <p className="text-gray-600">
            Clinical-grade measurements correlated with your transformation journey
          </p>
        </div>
        
        <Button variant="outline" className="flex items-center space-x-2">
          <span>📤</span>
          <span>Export Report</span>
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'assessments', label: 'Clinical Assessments', icon: '📋' },
          { key: 'outcomes', label: 'Therapeutic Outcomes', icon: '🎯' },
          { key: 'correlations', label: 'Data Correlations', icon: '📊' },
          { key: 'reports', label: 'Professional Reports', icon: '📄' }
        ].map(({ key, label, icon }) => (
          <Button
            key={key}
            variant={selectedView === key ? 'default' : 'outline'}
            onClick={() => setSelectedView(key as any)}
            className="flex items-center space-x-2"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {selectedView === 'assessments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assessments.map(renderAssessmentCard)}
          </div>
        )}
        {selectedView === 'outcomes' && renderTherapeuticOutcomes()}
        {selectedView === 'correlations' && renderCorrelations()}
        {selectedView === 'reports' && renderProfessionalReport()}
      </div>
    </div>
  );
};

export default ProfessionalAssessmentIntegration;