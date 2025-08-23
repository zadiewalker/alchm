'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResearchGradeDataset,
  ResearchParticipation,
  ValidatedInstrument,
  StatisticalSignificance,
  LongitudinalStudyData,
  AcademicDataSharing,
  AnonymizedDataContribution,
  UniversityPartnership,
  ResearchApplication,
  EthicsApproval,
  InformedConsentDocument,
  DataUsageConsent,
  PublicationContribution
} from '@/types/analytics-outcome-measurement-schema';

interface ResearchGradeDataCollectionProps {
  userId: string;
  researchParticipation?: ResearchParticipation | null;
  dataCollectionLevel?: 'basic' | 'standard' | 'comprehensive' | 'research_grade';
  consentLevel?: 'minimal' | 'standard' | 'comprehensive' | 'research_grade';
  culturalContext?: {
    primaryCulture: string;
    secondaryCultures: string[];
    culturalValues: string[];
    languagePreferences: string[];
  };
  onConsentUpdated?: (consent: DataUsageConsent) => void;
  onDataContributed?: (contribution: AnonymizedDataContribution) => void;
  onResearchGenerated?: (dataset: ResearchGradeDataset) => void;
  className?: string;
}

export default function ResearchGradeDataCollection({
  userId,
  researchParticipation,
  dataCollectionLevel = 'standard',
  consentLevel = 'standard',
  culturalContext,
  onConsentUpdated,
  onDataContributed,
  onResearchGenerated,
  className = ''
}: ResearchGradeDataCollectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'datasets' | 'participation' | 'consent' | 'publications'>('datasets');
  const [selectedDataLevel, setSelectedDataLevel] = useState(dataCollectionLevel);
  const [selectedConsentLevel, setSelectedConsentLevel] = useState(consentLevel);
  
  // Research Data State
  const [researchDatasets, setResearchDatasets] = useState<ResearchGradeDataset[]>([]);
  const [validatedInstruments, setValidatedInstruments] = useState<ValidatedInstrument[]>([]);
  const [statisticalResults, setStatisticalResults] = useState<StatisticalSignificance[]>([]);
  const [longitudinalData, setLongitudinalData] = useState<LongitudinalStudyData[]>([]);
  
  // Participation State
  const [activeStudies, setActiveStudies] = useState<any[]>([]);
  const [completedStudies, setCompletedStudies] = useState<any[]>([]);
  const [eligibleStudies, setEligibleStudies] = useState<any[]>([]);
  const [universityPartnerships, setUniversityPartnerships] = useState<UniversityPartnership[]>([]);
  
  // Consent & Ethics State
  const [consentDocuments, setConsentDocuments] = useState<InformedConsentDocument[]>([]);
  const [ethicsApprovals, setEthicsApprovals] = useState<EthicsApproval[]>([]);
  const [dataUsageConsents, setDataUsageConsents] = useState<DataUsageConsent[]>([]);
  const [anonymizedContributions, setAnonymizedContributions] = useState<AnonymizedDataContribution[]>([]);
  
  // Publication State
  const [publicationContributions, setPublicationContributions] = useState<PublicationContribution[]>([]);
  const [researchCitations, setResearchCitations] = useState<any[]>([]);
  const [academicRecognition, setAcademicRecognition] = useState<any[]>([]);

  useEffect(() => {
    loadResearchGradeData();
  }, [userId, selectedDataLevel, selectedConsentLevel, culturalContext]);

  const loadResearchGradeData = async () => {
    try {
      setIsLoading(true);
      
      // Load research datasets
      const datasets = await loadResearchDatasets(userId, selectedDataLevel, culturalContext);
      setResearchDatasets(datasets);
      
      // Load validated instruments
      const instruments = await loadValidatedInstruments(selectedDataLevel, culturalContext);
      setValidatedInstruments(instruments);
      
      // Load statistical significance results
      const stats = await loadStatisticalSignificanceResults(userId, selectedDataLevel);
      setStatisticalResults(stats);
      
      // Load longitudinal study data
      const longitudinal = await loadLongitudinalStudyData(userId, selectedDataLevel);
      setLongitudinalData(longitudinal);
      
      // Load study participation data
      const studies = await loadStudyParticipation(userId, selectedConsentLevel);
      setActiveStudies(studies.active);
      setCompletedStudies(studies.completed);
      setEligibleStudies(studies.eligible);
      
      // Load university partnerships
      const partnerships = await loadUniversityPartnerships(userId);
      setUniversityPartnerships(partnerships);
      
      // Load consent and ethics data
      const consentData = await loadConsentAndEthicsData(userId, selectedConsentLevel);
      setConsentDocuments(consentData.consents);
      setEthicsApprovals(consentData.ethics);
      setDataUsageConsents(consentData.usageConsents);
      setAnonymizedContributions(consentData.contributions);
      
      // Load publication data
      const publications = await loadPublicationData(userId);
      setPublicationContributions(publications.contributions);
      setResearchCitations(publications.citations);
      setAcademicRecognition(publications.recognition);
      
      // Trigger callback events
      datasets.forEach(dataset => onResearchGenerated?.(dataset));
      consentData.contributions.forEach(contribution => onDataContributed?.(contribution));
      consentData.usageConsents.forEach(consent => onConsentUpdated?.(consent));
      
    } catch (error) {
      console.error('Error loading research grade data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data loading functions
  const loadResearchDatasets = async (
    userId: string, 
    dataLevel: string, 
    cultural: any
  ): Promise<ResearchGradeDataset[]> => {
    return [
      {
        datasetId: 'rgd-001',
        userId: userId,
        datasetType: 'longitudinal_personal_development',
        dataQuality: 0.94,
        sampleSize: 2847,
        timeframeCoverage: {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-08-19'),
          frequency: 'weekly',
          dataPoints: 33
        },
        statisticalPower: 0.92,
        culturalRepresentation: 0.89,
        ethicalApproval: 'institutional_review_board_approved',
        dataAnonymization: 'differential_privacy_applied',
        researchApplications: [
          'personal_development_effectiveness',
          'cultural_adaptation_studies',
          'ai_assisted_growth_research',
          'cross_cultural_psychology'
        ],
        academicPartners: [
          'Stanford_University_Psychology_Department',
          'MIT_Computer_Science_AI_Lab',
          'Harvard_School_of_Public_Health',
          'University_of_Oxford_Wellbeing_Research'
        ],
        publicationPotential: 'tier_1_journals',
        datasetMetrics: {
          completenessScore: 0.96,
          consistencyScore: 0.91,
          accuracyScore: 0.93,
          validityScore: 0.89,
          reliabilityScore: 0.94
        },
        researchGradeFeatures: [
          'peer_reviewed_methodology',
          'validated_instruments',
          'statistical_significance_testing',
          'effect_size_calculations',
          'cultural_adaptation_validation',
          'longitudinal_tracking',
          'control_group_comparisons'
        ],
        dataGovernance: {
          dataClassification: 'research_grade_anonymized',
          retentionPolicy: 'academic_research_standard',
          accessControls: 'institutional_approved_only',
          auditTrail: 'complete_provenance_tracking'
        },
        generatedAt: new Date('2024-08-19'),
        lastValidated: new Date('2024-08-18'),
        nextReview: new Date('2024-11-19')
      },
      {
        datasetId: 'rgd-002',
        userId: userId,
        datasetType: 'cross_cultural_effectiveness_study',
        dataQuality: 0.91,
        sampleSize: 1924,
        timeframeCoverage: {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-08-19'),
          frequency: 'bi_weekly',
          dataPoints: 12
        },
        statisticalPower: 0.87,
        culturalRepresentation: 0.94,
        ethicalApproval: 'multi_institutional_approved',
        dataAnonymization: 'k_anonymity_and_differential_privacy',
        researchApplications: [
          'cultural_competency_measurement',
          'cross_cultural_validation',
          'personalization_effectiveness',
          'global_mental_health_applications'
        ],
        academicPartners: [
          'University_of_Toronto_Cross_Cultural_Psychology',
          'London_School_of_Economics_Behavioral_Science',
          'Seoul_National_University_Psychology',
          'Universidad_de_Barcelona_Cultural_Studies'
        ],
        publicationPotential: 'high_impact_interdisciplinary',
        datasetMetrics: {
          completenessScore: 0.88,
          consistencyScore: 0.94,
          accuracyScore: 0.91,
          validityScore: 0.92,
          reliabilityScore: 0.89
        },
        researchGradeFeatures: [
          'cross_cultural_validation',
          'multi_language_instruments',
          'cultural_bias_assessment',
          'emic_etic_approach_balance',
          'indigenous_psychology_integration'
        ],
        dataGovernance: {
          dataClassification: 'international_research_compliant',
          retentionPolicy: 'gdpr_and_international_standards',
          accessControls: 'federated_institutional_access',
          auditTrail: 'blockchain_verified_provenance'
        },
        generatedAt: new Date('2024-08-19'),
        lastValidated: new Date('2024-08-17'),
        nextReview: new Date('2024-10-19')
      }
    ];
  };

  const loadValidatedInstruments = async (dataLevel: string, cultural: any): Promise<ValidatedInstrument[]> => {
    return [
      {
        instrumentId: 'vi-001',
        instrumentName: 'ALCHM Personal Development Assessment Scale (APDAS)',
        instrumentType: 'psychometric_scale',
        validationType: 'peer_reviewed_published',
        reliabilityMetrics: {
          cronbachsAlpha: 0.94,
          testRetestReliability: 0.89,
          interRaterReliability: 0.92,
          splitHalfReliability: 0.91
        },
        validityMetrics: {
          contentValidity: 0.93,
          constructValidity: 0.89,
          criterionValidity: 0.87,
          convergentValidity: 0.91,
          discriminantValidity: 0.88
        },
        culturalValidation: {
          crossCulturalEquivalence: 0.86,
          culturalAdaptationIndex: 0.89,
          translationQuality: 0.94,
          culturalBiasAssessment: 0.08
        },
        psychometricProperties: {
          itemDiscrimination: 0.76,
          itemDifficulty: 0.62,
          factorStructureStability: 0.91,
          measurementInvariance: 'strong_invariance_achieved'
        },
        normativeData: {
          sampleSize: 3847,
          demographicRepresentation: 0.91,
          culturalRepresentation: 0.88,
          ageRange: '18-75',
          validationCountries: [
            'United_States',
            'Canada',
            'United_Kingdom',
            'Germany',
            'Japan',
            'Brazil',
            'India',
            'Australia'
          ]
        },
        researchApplications: [
          'longitudinal_development_tracking',
          'intervention_effectiveness_measurement',
          'cross_cultural_comparison_studies',
          'clinical_outcome_assessment'
        ],
        publicationStatus: {
          peerReviewedPapers: 7,
          citationCount: 124,
          hIndex: 12,
          impactFactor: 3.8,
          journalTier: 'tier_1_psychology'
        },
        developedAt: new Date('2023-09-15'),
        lastValidated: new Date('2024-08-10'),
        nextValidation: new Date('2025-08-10')
      },
      {
        instrumentId: 'vi-002',
        instrumentName: 'Cultural Adaptation Effectiveness Measure (CAEM)',
        instrumentType: 'behavioral_observation_scale',
        validationType: 'multi_site_validation',
        reliabilityMetrics: {
          cronbachsAlpha: 0.89,
          testRetestReliability: 0.86,
          interRaterReliability: 0.94,
          splitHalfReliability: 0.87
        },
        validityMetrics: {
          contentValidity: 0.91,
          constructValidity: 0.85,
          criterionValidity: 0.89,
          convergentValidity: 0.88,
          discriminantValidity: 0.85
        },
        culturalValidation: {
          crossCulturalEquivalence: 0.94,
          culturalAdaptationIndex: 0.96,
          translationQuality: 0.92,
          culturalBiasAssessment: 0.05
        },
        psychometricProperties: {
          itemDiscrimination: 0.82,
          itemDifficulty: 0.58,
          factorStructureStability: 0.88,
          measurementInvariance: 'configural_invariance_achieved'
        },
        normativeData: {
          sampleSize: 2341,
          demographicRepresentation: 0.94,
          culturalRepresentation: 0.97,
          ageRange: '16-80',
          validationCountries: [
            'Mexico',
            'China',
            'Nigeria',
            'Sweden',
            'South_Korea',
            'Egypt',
            'Chile',
            'Philippines'
          ]
        },
        researchApplications: [
          'cultural_competency_assessment',
          'intervention_cultural_adaptation',
          'cross_cultural_psychology_research',
          'global_mental_health_studies'
        ],
        publicationStatus: {
          peerReviewedPapers: 4,
          citationCount: 67,
          hIndex: 6,
          impactFactor: 2.9,
          journalTier: 'tier_2_cross_cultural'
        },
        developedAt: new Date('2024-02-20'),
        lastValidated: new Date('2024-08-05'),
        nextValidation: new Date('2025-02-20')
      }
    ];
  };

  const loadStatisticalSignificanceResults = async (userId: string, dataLevel: string): Promise<StatisticalSignificance[]> => {
    return [
      {
        testId: 'ss-001',
        testType: 'multilevel_mixed_effects_model',
        hypothesis: 'alchm_pathways_demonstrate_sustained_positive_outcomes',
        pValue: 0.0001,
        effectSize: 0.82,
        confidenceLevel: 0.99,
        sampleSize: 2847,
        powerAnalysis: 0.95,
        culturalValidation: 0.89,
        practicalSignificance: 'large_clinically_meaningful',
        statisticalMethod: {
          primaryAnalysis: 'hierarchical_linear_modeling',
          secondaryAnalyses: [
            'propensity_score_matching',
            'instrumental_variables',
            'regression_discontinuity'
          ],
          robustnessChecks: [
            'bootstrap_confidence_intervals',
            'permutation_tests',
            'jackknife_resampling'
          ]
        },
        effectSizeInterpretation: {
          cohensD: 0.82,
          hedgesG: 0.79,
          glassesΔ: 0.85,
          r2: 0.37,
          eta2: 0.34
        },
        multipleComparisonsAdjustment: {
          method: 'false_discovery_rate_correction',
          adjustedPValue: 0.0003,
          familywiseErrorRate: 0.01
        },
        culturalSubgroupAnalysis: [
          { culture: 'individualistic', effectSize: 0.89, pValue: 0.0001 },
          { culture: 'collectivistic', effectSize: 0.76, pValue: 0.0008 },
          { culture: 'hierarchical', effectSize: 0.71, pValue: 0.0021 },
          { culture: 'egalitarian', effectSize: 0.93, pValue: 0.0000 }
        ],
        temporalStabilityAnalysis: {
          immediateEffects: { effectSize: 0.54, pValue: 0.0089 },
          shortTermEffects: { effectSize: 0.72, pValue: 0.0003 },
          longTermEffects: { effectSize: 0.82, pValue: 0.0001 },
          sustainabilityIndex: 0.88
        },
        researchImplications: [
          'pathway_effectiveness_definitively_confirmed',
          'cultural_adaptation_strategies_validated',
          'longitudinal_sustainability_demonstrated',
          'clinical_significance_established'
        ],
        metaAnalysisContribution: {
          studiesIncluded: 12,
          totalParticipants: 8924,
          pooledEffectSize: 0.79,
          heterogeneity: 'low_to_moderate',
          publicationBias: 'none_detected'
        },
        calculatedAt: new Date('2024-08-19'),
        peerReviewStatus: 'accepted_tier_1_journal',
        replicationStatus: 'independently_replicated'
      }
    ];
  };

  const loadLongitudinalStudyData = async (userId: string, dataLevel: string): Promise<LongitudinalStudyData[]> => {
    return [
      {
        studyId: 'lsd-001',
        studyName: 'ALCHM Long-term Impact and Sustainability Study (ALISS)',
        studyType: 'prospective_longitudinal_cohort',
        userId: userId,
        studyDuration: '24_months',
        followUpSchedule: [
          { timePoint: 'baseline', completed: true, date: new Date('2024-01-15') },
          { timePoint: '1_month', completed: true, date: new Date('2024-02-15') },
          { timePoint: '3_months', completed: true, date: new Date('2024-04-15') },
          { timePoint: '6_months', completed: true, date: new Date('2024-07-15') },
          { timePoint: '12_months', completed: false, scheduled: new Date('2025-01-15') },
          { timePoint: '18_months', completed: false, scheduled: new Date('2025-07-15') },
          { timePoint: '24_months', completed: false, scheduled: new Date('2026-01-15') }
        ],
        primaryOutcomes: [
          {
            outcome: 'personal_development_composite',
            measurementTool: 'APDAS',
            dataPoints: [
              { timePoint: 'baseline', value: 6.2, reliability: 0.94 },
              { timePoint: '1_month', value: 6.8, reliability: 0.93 },
              { timePoint: '3_months', value: 7.4, reliability: 0.95 },
              { timePoint: '6_months', value: 8.1, reliability: 0.94 }
            ],
            trajectoryModel: {
              modelType: 'latent_growth_curve',
              interceptValue: 6.18,
              slopeValue: 0.32,
              quadraticTerm: -0.02,
              modelFit: { cfi: 0.97, tli: 0.96, rmsea: 0.04 }
            }
          },
          {
            outcome: 'quality_of_life_index',
            measurementTool: 'WHO_QOL_BREF_Cultural_Adapted',
            dataPoints: [
              { timePoint: 'baseline', value: 71.2, reliability: 0.91 },
              { timePoint: '1_month', value: 74.8, reliability: 0.92 },
              { timePoint: '3_months', value: 79.3, reliability: 0.90 },
              { timePoint: '6_months', value: 83.7, reliability: 0.93 }
            ],
            trajectoryModel: {
              modelType: 'piecewise_linear_growth',
              phase1Slope: 0.71,
              phase2Slope: 0.89,
              changePoint: '2_months',
              modelFit: { cfi: 0.95, tli: 0.94, rmsea: 0.05 }
            }
          }
        ],
        secondaryOutcomes: [
          'emotional_regulation_scale',
          'social_connectedness_index',
          'meaning_in_life_questionnaire',
          'cultural_identity_clarity_scale'
        ],
        covariateTracking: [
          'socioeconomic_status',
          'life_events_inventory',
          'social_support_network',
          'health_status_indicators',
          'concurrent_interventions'
        ],
        attritionAnalysis: {
          currentRetentionRate: 0.87,
          predictedFinalRetention: 0.76,
          attritionFactors: [
            'geographic_relocation',
            'life_circumstances_change',
            'technology_access_barriers'
          ],
          mitigationStrategies: [
            'flexible_assessment_scheduling',
            'multi_modal_data_collection',
            'incentive_optimization'
          ]
        },
        dataQualityMetrics: {
          completenessRate: 0.94,
          consistencyScore: 0.91,
          timelinessPenalty: 0.03,
          overallQualityIndex: 0.91
        },
        ethicalOversight: {
          irbApproval: 'stanford_irb_54891',
          consentUpdateSchedule: 'annual_renewal',
          dataProtocolCompliance: 0.98,
          participantWelfareScore: 0.96
        },
        studyMilestones: [
          {
            milestone: 'baseline_data_collection_complete',
            completed: true,
            date: new Date('2024-02-28')
          },
          {
            milestone: '6_month_followup_complete',
            completed: true,
            date: new Date('2024-08-15')
          },
          {
            milestone: '12_month_data_analysis',
            completed: false,
            planned: new Date('2025-02-15')
          }
        ],
        collaboratingInstitutions: [
          'Stanford_University',
          'University_of_California_Berkeley',
          'Harvard_Medical_School',
          'MIT_Computer_Science_AI_Lab'
        ],
        fundingSource: 'NIH_National_Institute_Mental_Health',
        principalInvestigator: 'Dr. Sarah Chen, PhD',
        lastUpdated: new Date('2024-08-19'),
        studyStatus: 'active_enrollment_complete'
      }
    ];
  };

  const loadStudyParticipation = async (userId: string, consentLevel: string) => {
    return {
      active: [
        {
          studyId: 'as-001',
          studyName: 'Cross-Cultural Personal Development Effectiveness Study',
          studyType: 'randomized_controlled_trial',
          participationRole: 'intervention_group',
          enrollmentDate: new Date('2024-06-15'),
          estimatedCompletion: new Date('2025-06-15'),
          timeCommitment: '30_minutes_biweekly',
          compensationType: 'research_participation_credit',
          principalInvestigator: 'Dr. Maria Rodriguez, PhD',
          institution: 'University_of_Toronto',
          studyDescription: 'Examining the effectiveness of culturally-adapted personal development pathways across diverse populations'
        }
      ],
      completed: [
        {
          studyId: 'cs-001',
          studyName: 'AI-Assisted Reflection Impact Study',
          studyType: 'longitudinal_observational',
          participationRole: 'primary_participant',
          enrollmentDate: new Date('2024-01-15'),
          completionDate: new Date('2024-07-15'),
          totalTimeContributed: '18_hours',
          studyOutcome: 'positive_significant_findings',
          publicationStatus: 'manuscript_in_preparation',
          principalInvestigator: 'Dr. James Liu, PhD',
          institution: 'MIT_Computer_Science_AI_Lab'
        }
      ],
      eligible: [
        {
          studyId: 'es-001',
          studyName: 'Global Mental Health Technology Adoption Study',
          studyType: 'multi_site_cohort',
          eligibilityReason: 'demographic_match_and_technology_use',
          estimatedDuration: '12_months',
          timeCommitment: '45_minutes_monthly',
          compensationType: 'monetary_compensation',
          recruitmentPriority: 'high_priority',
          institution: 'Harvard_School_of_Public_Health'
        }
      ]
    };
  };

  const loadUniversityPartnerships = async (userId: string): Promise<UniversityPartnership[]> => {
    return [
      {
        partnershipId: 'up-001',
        universityName: 'Stanford University',
        department: 'Department of Psychology',
        partnershipType: 'primary_research_collaboration',
        collaborationScope: [
          'longitudinal_outcome_studies',
          'psychometric_validation',
          'cultural_adaptation_research',
          'ai_ethics_framework_development'
        ],
        principalInvestigators: [
          {
            name: 'Dr. Sarah Chen',
            title: 'Professor of Clinical Psychology',
            expertise: 'longitudinal_development_studies',
            h_index: 47
          },
          {
            name: 'Dr. Michael Torres',
            title: 'Associate Professor of Cultural Psychology',
            expertise: 'cross_cultural_measurement',
            h_index: 32
          }
        ],
        activeProjects: 3,
        completedProjects: 8,
        totalParticipants: 4821,
        publicationCount: 12,
        grantFunding: 2400000,
        partnershipDuration: '5_years',
        renewalStatus: 'automatic_renewal_approved',
        ethicalApprovals: [
          'stanford_irb_primary',
          'stanford_irb_data_sharing',
          'stanford_ai_ethics_committee'
        ],
        dataGovernanceAgreement: {
          dataOwnership: 'joint_ownership',
          publicationRights: 'collaborative_authorship_required',
          dataRetention: '10_years_post_completion',
          intellectualProperty: 'shared_ip_agreement'
        },
        establishedDate: new Date('2023-09-01'),
        lastReview: new Date('2024-08-01'),
        nextReview: new Date('2025-08-01')
      }
    ];
  };

  const loadConsentAndEthicsData = async (userId: string, consentLevel: string) => {
    return {
      consents: [
        {
          consentId: 'icd-001',
          consentType: 'research_participation_comprehensive',
          consentVersion: '3.2.1',
          studyReference: 'ALISS_longitudinal_study',
          consentDate: new Date('2024-01-15'),
          expirationDate: new Date('2025-01-15'),
          renewalRequired: true,
          consentScope: [
            'longitudinal_data_collection',
            'academic_research_sharing',
            'cross_cultural_analysis',
            'ai_assisted_analysis',
            'publication_contribution'
          ],
          rightsNotified: [
            'right_to_withdraw',
            'right_to_data_deletion',
            'right_to_access_data',
            'right_to_correct_data',
            'right_to_restrict_processing'
          ],
          risksBenefitsDisclosed: {
            risks: [
              'minimal_privacy_risk_with_anonymization',
              'potential_emotional_discomfort_during_assessment',
              'time_commitment_burden'
            ],
            benefits: [
              'contribution_to_scientific_understanding',
              'personalized_insights_from_participation',
              'access_to_research_findings'
            ]
          },
          culturalConsiderations: [
            'consent_process_adapted_for_cultural_context',
            'language_preference_accommodated',
            'family_consultation_options_provided'
          ],
          legalCompliance: [
            'gdpr_compliant',
            'hipaa_compliant',
            'local_privacy_laws_compliant'
          ],
          witnessSignature: true,
          notarized: false,
          digitalSignature: 'blockchain_verified',
          consentWithdrawals: 0,
          consentModifications: 1
        }
      ],
      ethics: [
        {
          approvalId: 'ea-001',
          ethicsBoard: 'Stanford_Institutional_Review_Board',
          approvalNumber: 'IRB_54891',
          approvalType: 'full_board_review',
          approvalDate: new Date('2023-12-15'),
          expirationDate: new Date('2024-12-15'),
          renewalStatus: 'renewal_submitted_pending',
          studyClassification: 'minimal_risk_with_vulnerable_populations',
          specialProtections: [
            'cultural_minority_protections',
            'data_security_enhanced_protocols',
            'participant_wellbeing_monitoring'
          ],
          ethicalPrinciples: [
            'respect_for_persons',
            'beneficence',
            'justice',
            'cultural_sensitivity'
          ],
          monitoringPlan: {
            frequency: 'quarterly_reports',
            safetyOfficer: 'Dr. Patricia Williams',
            adverseEventReporting: 'immediate_notification_required',
            dataMonitoringCommittee: true
          },
          complianceAudits: [
            {
              auditDate: new Date('2024-06-15'),
              auditResult: 'full_compliance_achieved',
              recommendationsImplemented: 3
            }
          ]
        }
      ],
      usageConsents: [
        {
          consentId: 'duc-001',
          userId: userId,
          consentType: 'research_grade_data_usage',
          consentLevel: 'comprehensive_research_participation',
          dataUsagePermissions: {
            longitudinalTracking: true,
            crossCulturalAnalysis: true,
            academicPublication: true,
            algorithmTraining: true,
            metaAnalysisInclusion: true,
            internationalDataSharing: true
          },
          anonymizationLevel: 'differential_privacy_applied',
          dataRetentionPeriod: '10_years_research_standard',
          rightToWithdraw: true,
          rightToDataPortability: true,
          rightToBeForgotten: true,
          culturalDataConsiderations: {
            culturalSensitivityRespected: true,
            culturalContextPreserved: true,
            indigenousDataSovereignty: 'not_applicable'
          },
          consentDate: new Date('2024-01-15'),
          lastModified: new Date('2024-08-01'),
          consentVersion: '2.1.0',
          legalBasis: 'explicit_informed_consent',
          geographicScope: 'international_academic_institutions'
        }
      ],
      contributions: [
        {
          contributionId: 'adc-001',
          userId: userId,
          contributionType: 'longitudinal_outcome_data',
          anonymizationMethod: 'k_anonymity_plus_differential_privacy',
          dataClassification: 'research_grade_anonymized',
          contributionDate: new Date('2024-08-19'),
          datasetSize: '847_data_points',
          researchValue: 'high_scientific_value',
          academicInstitutions: [
            'Stanford_University',
            'MIT',
            'Harvard_School_of_Public_Health'
          ],
          researchApplications: [
            'personal_development_effectiveness_research',
            'cultural_adaptation_studies',
            'ai_assisted_growth_research'
          ],
          ethicalCompliance: 'full_institutional_review_board_approved',
          dataGovernance: {
            accessControls: 'institutional_approval_required',
            usageRestrictions: 'non_commercial_research_only',
            publicationRequirements: 'acknowledgment_required',
            dataDestruction: 'scheduled_after_retention_period'
          },
          impactMetrics: {
            studiesEnabled: 3,
            participantsImpacted: 2847,
            publicationsContributed: 7,
            citationsPotential: 'high_citation_expected'
          },
          qualityAssurance: {
            dataValidationScore: 0.94,
            completenessScore: 0.91,
            consistencyScore: 0.93
          },
          recognitionReceived: [
            'stanford_research_contributor_award',
            'digital_health_innovation_recognition'
          ]
        }
      ]
    };
  };

  const loadPublicationData = async (userId: string) => {
    return {
      contributions: [
        {
          contributionId: 'pc-001',
          userId: userId,
          publicationType: 'peer_reviewed_journal_article',
          publicationTitle: 'Culturally-Adaptive AI-Assisted Personal Development: A Longitudinal Effectiveness Study',
          journalName: 'Journal of Cross-Cultural Psychology',
          publicationStatus: 'accepted_in_press',
          contributionRole: 'data_contributor_and_co_author',
          authorPosition: 4,
          totalAuthors: 8,
          impactFactor: 3.8,
          citationExpectation: 'high_citation_potential',
          publicationDate: new Date('2024-10-15'),
          doi: '10.1177/0022022124000001',
          researchContribution: {
            dataContribution: 'primary_longitudinal_dataset',
            analysisContribution: 'cultural_adaptation_analysis',
            writingContribution: 'methodology_and_results_sections'
          },
          academicImpact: {
            h_index_contribution: 0.3,
            career_advancement_value: 'significant',
            research_recognition: 'peer_acknowledgment_received'
          },
          openAccessStatus: 'fully_open_access',
          dataAvailabilityStatement: 'anonymized_data_available_upon_request',
          ethicalStatement: 'full_irb_approval_obtained',
          conflictOfInterestDisclosure: 'technology_platform_contributor'
        },
        {
          contributionId: 'pc-002',
          userId: userId,
          publicationType: 'conference_presentation',
          publicationTitle: 'Real-World Outcomes of AI-Assisted Personal Development: A Multi-Cultural Analysis',
          conferenceName: 'International Conference on AI in Mental Health',
          publicationStatus: 'presented',
          contributionRole: 'primary_data_contributor',
          presentationType: 'poster_presentation',
          conferenceRanking: 'tier_1_international',
          attendeeEstimate: 2400,
          publicationDate: new Date('2024-07-20'),
          proceedingsPublished: true,
          researchContribution: {
            dataContribution: 'complete_anonymized_dataset',
            analysisContribution: 'real_world_outcome_correlations'
          },
          networkingValue: {
            collaborations_initiated: 3,
            follow_up_meetings: 7,
            research_interest_generated: 'high'
          }
        }
      ],
      citations: [
        {
          citationId: 'rc-001',
          citingPaper: 'Digital Therapeutics for Cross-Cultural Mental Health Applications',
          citingAuthors: ['Dr. Jennifer Park', 'Dr. Ahmed Hassan'],
          citingJournal: 'Digital Medicine Review',
          citationContext: 'methodology_reference',
          citationImportance: 'foundational_to_study_design',
          citationDate: new Date('2024-08-10')
        }
      ],
      recognition: [
        {
          recognitionId: 'ar-001',
          recognitionType: 'research_excellence_award',
          awardingInstitution: 'American_Psychological_Association',
          awardName: 'Digital Innovation in Psychology Research Award',
          recognitionReason: 'outstanding_contribution_to_culturally_adaptive_digital_interventions',
          awardDate: new Date('2024-08-01'),
          recognitionValue: 'career_milestone_achievement',
          publicRecognition: true,
          mediaAttention: 'featured_in_apa_newsletter'
        }
      ]
    };
  };

  const renderDatasetOverview = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchDatasets.map((dataset) => (
            <div key={dataset.datasetId} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 capitalize">
                    {dataset.datasetType.replace('_', ' ')}
                  </h3>
                  <div className="text-sm text-gray-600">Dataset ID: {dataset.datasetId}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {(dataset.dataQuality * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-500">Data Quality</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {dataset.sampleSize.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Sample Size</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {dataset.timeframeCoverage.dataPoints}
                  </div>
                  <div className="text-sm text-gray-600">Data Points</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {(dataset.statisticalPower * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Statistical Power</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-teal-600">
                    {(dataset.culturalRepresentation * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Cultural Rep.</div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Research Applications</div>
                  <div className="flex flex-wrap gap-1">
                    {dataset.researchApplications.slice(0, 3).map((app) => (
                      <span key={app} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg capitalize">
                        {app.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Academic Partners</div>
                  <div className="text-sm text-gray-600">
                    {dataset.academicPartners.length} institutions including {dataset.academicPartners[0].replace('_', ' ')}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-700">Data Metrics</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Completeness:</span>
                      <span>{(dataset.datasetMetrics.completenessScore * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span>{(dataset.datasetMetrics.accuracyScore * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reliability:</span>
                      <span>{(dataset.datasetMetrics.reliabilityScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700">Publication Potential</div>
                  <div className="text-sm text-green-600 capitalize mt-1">
                    {dataset.publicationPotential.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Ethics: {dataset.ethicalApproval.replace('_', ' ')}
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-sm font-medium text-purple-800">Research Grade Features</div>
                <div className="text-xs text-purple-700 mt-1">
                  {dataset.researchGradeFeatures.slice(0, 3).map(feature => 
                    feature.replace('_', ' ')
                  ).join(' • ')}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Validated Research Instruments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {validatedInstruments.map((instrument) => (
              <div key={instrument.instrumentId} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{instrument.instrumentName}</h4>
                    <div className="text-sm text-gray-600 capitalize">
                      {instrument.instrumentType.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">
                      α = {instrument.reliabilityMetrics.cronbachsAlpha.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Reliability</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-blue-600">
                      {(instrument.validityMetrics.constructValidity * 100).toFixed(0)}%
                    </div>
                    <div className="text-gray-500">Construct Validity</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-purple-600">
                      {(instrument.culturalValidation.crossCulturalEquivalence * 100).toFixed(0)}%
                    </div>
                    <div className="text-gray-500">Cultural Equiv.</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-orange-600">
                      {instrument.normativeData.sampleSize.toLocaleString()}
                    </div>
                    <div className="text-gray-500">Norm Sample</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600">
                  <div className="font-medium mb-1">Publications & Impact</div>
                  <div className="flex justify-between">
                    <span>Papers: {instrument.publicationStatus.peerReviewedPapers}</span>
                    <span>Citations: {instrument.publicationStatus.citationCount}</span>
                    <span>IF: {instrument.publicationStatus.impactFactor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderParticipationOverview = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-green-600">Active Studies</h3>
            <div className="space-y-4">
              {activeStudies.map((study, idx) => (
                <div key={idx} className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 text-sm mb-2">{study.studyName}</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{study.studyType.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium capitalize">{study.participationRole.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{study.timeCommitment.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Institution:</span>
                      <span className="font-medium">{study.institution.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-green-700">
                    Enrolled: {study.enrollmentDate.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-blue-600">Completed Studies</h3>
            <div className="space-y-4">
              {completedStudies.map((study, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 text-sm mb-2">{study.studyName}</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{study.totalTimeContributed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Outcome:</span>
                      <span className="font-medium capitalize">{study.studyOutcome.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Publication:</span>
                      <span className="font-medium capitalize">{study.publicationStatus.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-blue-700">
                    Completed: {study.completionDate.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-purple-600">Eligible Studies</h3>
            <div className="space-y-4">
              {eligibleStudies.map((study, idx) => (
                <div key={idx} className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 text-sm mb-2">{study.studyName}</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{study.estimatedDuration.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{study.timeCommitment.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className="font-medium capitalize">{study.recruitmentPriority.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="w-full bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">University Partnerships</h3>
          <div className="space-y-4">
            {universityPartnerships.map((partnership) => (
              <div key={partnership.partnershipId} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">{partnership.universityName}</h4>
                    <div className="text-sm text-gray-600">{partnership.department}</div>
                    <div className="text-sm text-blue-600 capitalize">{partnership.partnershipType.replace('_', ' ')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">${(partnership.grantFunding / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-gray-500">Grant Funding</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{partnership.activeProjects}</div>
                    <div className="text-sm text-gray-600">Active Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{partnership.completedProjects}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{partnership.publicationCount}</div>
                    <div className="text-sm text-gray-600">Publications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-teal-600">{partnership.totalParticipants.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Participants</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Principal Investigators</div>
                    <div className="space-y-2">
                      {partnership.principalInvestigators.map((pi, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="font-medium text-gray-800">{pi.name}</div>
                          <div className="text-gray-600">{pi.title}</div>
                          <div className="text-blue-600 capitalize text-xs">
                            {pi.expertise.replace('_', ' ')} • h-index: {pi.h_index}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Collaboration Scope</div>
                    <div className="space-y-1">
                      {partnership.collaborationScope.slice(0, 4).map((scope) => (
                        <div key={scope} className="text-sm text-blue-600 capitalize">
                          • {scope.replace('_', ' ')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderConsentAndEthics = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Informed Consent Status</h3>
            <div className="space-y-4">
              {consentDocuments.map((consent) => (
                <div key={consent.consentId} className="bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800 capitalize">
                        {consent.consentType.replace('_', ' ')}
                      </h4>
                      <div className="text-sm text-gray-600">Version {consent.consentVersion}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">Active</div>
                      <div className="text-xs text-gray-500">Expires {consent.expirationDate.toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <div className="font-medium text-gray-700">Consent Scope</div>
                      <div className="text-xs text-gray-600">
                        {consent.consentScope.slice(0, 3).map(scope => 
                          scope.replace('_', ' ')
                        ).join(' • ')}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-700">Rights Protected</div>
                      <div className="text-xs text-blue-600">
                        {consent.rightsNotified.slice(0, 3).map(right => 
                          right.replace('_', ' ')
                        ).join(' • ')}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-700">Cultural Considerations</div>
                      <div className="text-xs text-purple-600">
                        {consent.culturalConsiderations.length} adaptations applied
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Signed: {consent.consentDate.toLocaleDateString()}</span>
                      <span className="text-green-600 font-medium">
                        {consent.digitalSignature.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Ethics Approvals</h3>
            <div className="space-y-4">
              {ethicsApprovals.map((ethics) => (
                <div key={ethics.approvalId} className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">{ethics.ethicsBoard.replace('_', ' ')}</h4>
                      <div className="text-sm text-gray-600">#{ethics.approvalNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600 capitalize">
                        {ethics.renewalStatus.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-gray-500">
                        Expires {ethics.expirationDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Classification:</span>
                      <span className="font-medium capitalize">{ethics.studyClassification.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Review Type:</span>
                      <span className="font-medium capitalize">{ethics.approvalType.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Special Protections</div>
                    <div className="space-y-1">
                      {ethics.specialProtections.map((protection) => (
                        <div key={protection} className="text-xs text-blue-600 capitalize">
                          • {protection.replace('_', ' ')}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {ethics.complianceAudits.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="text-xs">
                        <span className="text-gray-500">Last Audit: </span>
                        <span className="font-medium text-green-600">
                          {ethics.complianceAudits[0].auditResult.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Data Usage Consent & Contributions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Current Consent Levels</h4>
              <div className="space-y-3">
                {dataUsageConsents.map((consent) => (
                  <div key={consent.consentId} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-800 capitalize">
                        {consent.consentLevel.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-green-600 font-medium">Active</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={consent.dataUsagePermissions.longitudinalTracking ? 'text-green-600' : 'text-gray-400'}>
                        ✓ Longitudinal Tracking
                      </div>
                      <div className={consent.dataUsagePermissions.crossCulturalAnalysis ? 'text-green-600' : 'text-gray-400'}>
                        ✓ Cross-Cultural Analysis
                      </div>
                      <div className={consent.dataUsagePermissions.academicPublication ? 'text-green-600' : 'text-gray-400'}>
                        ✓ Academic Publication
                      </div>
                      <div className={consent.dataUsagePermissions.algorithmTraining ? 'text-green-600' : 'text-gray-400'}>
                        ✓ Algorithm Training
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                      <div>Anonymization: {consent.anonymizationLevel.replace('_', ' ')}</div>
                      <div>Retention: {consent.dataRetentionPeriod.replace('_', ' ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Data Contributions</h4>
              <div className="space-y-3">
                {anonymizedContributions.map((contribution) => (
                  <div key={contribution.contributionId} className="bg-purple-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-800 capitalize">
                        {contribution.contributionType.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-purple-600 font-medium capitalize">
                        {contribution.researchValue.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dataset Size:</span>
                        <span className="font-medium">{contribution.datasetSize.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Institutions:</span>
                        <span className="font-medium">{contribution.academicInstitutions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Studies Enabled:</span>
                        <span className="font-medium">{contribution.impactMetrics.studiesEnabled}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-700 mb-1">Quality Metrics</div>
                      <div className="grid grid-cols-3 gap-1 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-purple-600">
                            {(contribution.qualityAssurance.dataValidationScore * 100).toFixed(0)}%
                          </div>
                          <div className="text-gray-500">Valid.</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-purple-600">
                            {(contribution.qualityAssurance.completenessScore * 100).toFixed(0)}%
                          </div>
                          <div className="text-gray-500">Complete</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-purple-600">
                            {(contribution.qualityAssurance.consistencyScore * 100).toFixed(0)}%
                          </div>
                          <div className="text-gray-500">Consist.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPublicationsAndRecognition = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Publication Contributions</h3>
            <div className="space-y-4">
              {publicationContributions.map((pub) => (
                <div key={pub.contributionId} className="bg-blue-50 rounded-lg p-4">
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-800 text-sm leading-tight mb-1">
                      {pub.publicationTitle}
                    </h4>
                    <div className="text-sm text-blue-600">{pub.journalName}</div>
                    <div className="text-xs text-gray-600 capitalize">
                      {pub.publicationStatus.replace('_', ' ')} • {pub.contributionRole.replace('_', ' ')}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3 text-xs text-center">
                    <div>
                      <div className="font-bold text-blue-600">{pub.impactFactor}</div>
                      <div className="text-gray-500">Impact Factor</div>
                    </div>
                    <div>
                      <div className="font-bold text-purple-600">{pub.authorPosition}/{pub.totalAuthors}</div>
                      <div className="text-gray-500">Author Position</div>
                    </div>
                    <div>
                      <div className="font-bold text-green-600 capitalize">
                        {pub.citationExpectation.split('_')[0]}
                      </div>
                      <div className="text-gray-500">Citation Exp.</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-700">
                    <div className="font-medium mb-1">Research Contribution</div>
                    <div className="space-y-1">
                      <div>• Data: {pub.researchContribution.dataContribution.replace('_', ' ')}</div>
                      <div>• Analysis: {pub.researchContribution.analysisContribution.replace('_', ' ')}</div>
                      {pub.researchContribution.writingContribution && (
                        <div>• Writing: {pub.researchContribution.writingContribution.replace('_', ' ')}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-blue-200 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {pub.publicationType.replace('_', ' ')}
                      </span>
                      <span className="font-medium">
                        {pub.publicationDate ? pub.publicationDate.toLocaleDateString() : 'Pending'}
                      </span>
                    </div>
                    {pub.doi && (
                      <div className="text-blue-600 mt-1">DOI: {pub.doi}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Academic Recognition</h3>
            <div className="space-y-4">
              {academicRecognition.map((recognition) => (
                <div key={recognition.recognitionId} className="bg-yellow-50 rounded-lg p-4">
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-800 text-sm">
                      {recognition.awardName}
                    </h4>
                    <div className="text-sm text-yellow-600">
                      {recognition.awardingInstitution.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {recognition.recognitionType.replace('_', ' ')}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-3">
                    <strong>Recognition Reason:</strong>
                    <div className="text-xs mt-1 capitalize">
                      {recognition.recognitionReason.replace(/_/g, ' ')}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-600">Value:</span>
                      <div className="font-medium text-yellow-600 capitalize">
                        {recognition.recognitionValue.replace('_', ' ')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <div className="font-medium">{recognition.awardDate.toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  {recognition.mediaAttention && (
                    <div className="mt-3 pt-3 border-t border-yellow-200">
                      <div className="text-xs text-yellow-700">
                        <strong>Media:</strong> {recognition.mediaAttention.replace('_', ' ')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Research Impact & Citations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {researchCitations.length}
              </div>
              <div className="text-sm text-blue-700 font-medium">Total Citations</div>
              <div className="text-xs text-blue-600 mt-1">From peer-reviewed sources</div>
            </div>
            
            <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {publicationContributions.length}
              </div>
              <div className="text-sm text-green-700 font-medium">Publications</div>
              <div className="text-xs text-green-600 mt-1">Co-authored contributions</div>
            </div>
            
            <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {academicRecognition.length}
              </div>
              <div className="text-sm text-purple-700 font-medium">Awards</div>
              <div className="text-xs text-purple-600 mt-1">Academic recognition received</div>
            </div>
          </div>
          
          {researchCitations.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-3">Recent Citations</h4>
              <div className="space-y-2">
                {researchCitations.map((citation) => (
                  <div key={citation.citationId} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-800">{citation.citingPaper}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {citation.citingAuthors.join(', ')} • {citation.citingJournal}
                    </div>
                    <div className="text-xs text-blue-600 mt-1 capitalize">
                      {citation.citationContext.replace('_', ' ')} • {citation.citationImportance.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Cited: {citation.citationDate.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          <h2 className="text-2xl font-bold text-gray-800">Research-Grade Data Collection</h2>
          <p className="text-gray-600">Academic partnerships, validated instruments, and peer-reviewed research contributions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedDataLevel}
            onChange={(e) => setSelectedDataLevel(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="basic">Basic</option>
            <option value="standard">Standard</option>
            <option value="comprehensive">Comprehensive</option>
            <option value="research_grade">Research Grade</option>
          </select>
          
          <select 
            value={selectedConsentLevel}
            onChange={(e) => setSelectedConsentLevel(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="minimal">Minimal</option>
            <option value="standard">Standard</option>
            <option value="comprehensive">Comprehensive</option>
            <option value="research_grade">Research Grade</option>
          </select>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'datasets', label: 'Research Datasets', count: researchDatasets.length },
            { id: 'participation', label: 'Study Participation', count: activeStudies.length + completedStudies.length },
            { id: 'consent', label: 'Consent & Ethics', count: consentDocuments.length + ethicsApprovals.length },
            { id: 'publications', label: 'Publications & Recognition', count: publicationContributions.length }
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
        {activeTab === 'datasets' && renderDatasetOverview()}
        {activeTab === 'participation' && renderParticipationOverview()}
        {activeTab === 'consent' && renderConsentAndEthics()}
        {activeTab === 'publications' && renderPublicationsAndRecognition()}
      </div>
    </div>
  );
}