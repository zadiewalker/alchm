'use client';

/**
 * Enhanced Crisis Detection Dashboard
 * 
 * Comprehensive dashboard for crisis monitoring, detection, and intervention
 * Integrates all crisis AI systems with trauma-informed UI/UX
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Heart, Users, Brain, Globe, Phone, MessageCircle } from 'lucide-react';

// Import AI systems
import AdvancedCrisisPatternRecognition, { CrisisPattern } from '@/ai/advanced-crisis-pattern-recognition';
import KheperaCrisisResponseSystem, { KheperaCrisisResponse } from '@/ai/khepera-crisis-response-system';
import ContextualCrisisAssessment, { ContextualAssessment, UserContext } from '@/ai/contextual-crisis-assessment';
import ProgressiveCrisisIntervention, { InterventionLevel } from '@/ai/progressive-crisis-intervention';
import CulturalCrisisCompetency from '@/ai/cultural-crisis-competency';

interface CrisisDetectionDashboardProps {
  userId: string;
  journalText?: string;
  userContext?: UserContext;
  onCrisisDetected: (crisis: CrisisDetectionResult) => void;
  onInterventionStarted: (intervention: InterventionLevel) => void;
}

interface CrisisDetectionResult {
  patterns: CrisisPattern[];
  assessment: ContextualAssessment;
  response: KheperaCrisisResponse;
  culturalFactors: string[];
  intervention: InterventionLevel;
  timestamp: string;
}

interface DashboardState {
  isScanning: boolean;
  lastScan: string | null;
  crisisLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  activeInterventions: string[];
  safetyStatus: 'stable' | 'monitoring' | 'intervention' | 'emergency';
}

const EnhancedCrisisDetectionDashboard: React.FC<CrisisDetectionDashboardProps> = ({
  userId,
  journalText,
  userContext,
  onCrisisDetected,
  onInterventionStarted
}) => {
  // AI System instances
  const [patternRecognition] = useState(() => new AdvancedCrisisPatternRecognition());
  const [crisisResponse] = useState(() => new KheperaCrisisResponseSystem());
  const [contextualAssessment] = useState(() => new ContextualCrisisAssessment());
  const [interventionSystem] = useState(() => new ProgressiveCrisisIntervention());
  const [culturalCompetency] = useState(() => new CulturalCrisisCompetency());

  // Component state
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    isScanning: false,
    lastScan: null,
    crisisLevel: 'none',
    activeInterventions: [],
    safetyStatus: 'stable'
  });

  const [detectionResults, setDetectionResults] = useState<CrisisDetectionResult | null>(null);
  const [showKheperaResponse, setShowKheperaResponse] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<'sage' | 'coach' | 'poet'>('sage');

  // Real-time scanning effect
  useEffect(() => {
    if (journalText && journalText.length > 50) {
      performCrisisDetection(journalText);
    }
  }, [journalText]);

  const performCrisisDetection = async (text: string) => {
    setDashboardState(prev => ({ ...prev, isScanning: true }));

    try {
      // Step 1: Pattern Recognition
      const patterns = await patternRecognition.detectCrisisPatterns(text, {
        sensitivity: 'high',
        traumaInformed: true,
        userHistory: userContext?.mentalHealthHistory ? {
          previousCrises: [],
          triggerPatterns: userContext.journalPatterns?.triggerPatterns || [],
          copingStrategies: userContext.copingStrategies?.healthy || [],
          culturalBackground: userContext.demographics?.culturalBackground || [],
          identityFactors: userContext.demographics?.identityFactors || []
        } : undefined
      });

      if (patterns.length === 0) {
        setDashboardState(prev => ({
          ...prev,
          isScanning: false,
          lastScan: new Date().toISOString(),
          crisisLevel: 'none',
          safetyStatus: 'stable'
        }));
        return;
      }

      // Step 2: Contextual Assessment
      const assessment = userContext 
        ? await contextualAssessment.assessCrisisContext(patterns, userContext, [])
        : {
            overallRiskLevel: 'moderate' as const,
            confidenceScore: 0.5,
            primaryConcerns: patterns.map(p => p.type),
            protectiveFactors: [],
            riskFactors: [],
            culturalConsiderations: [],
            traumaInformedRecommendations: [],
            immediateSafetyNeeds: patterns.some(p => p.severity === 'critical'),
            followUpTimeframe: 'immediate' as const
          };

      // Step 3: Cultural Assessment
      const culturalAssessment = userContext 
        ? await culturalCompetency.assessCulturalContext(patterns, userContext)
        : {
            culturalFactors: [],
            adaptedInterventions: [],
            culturalResources: [],
            systemicConsiderations: [],
            languageAdaptations: [],
            intersectionalFactors: []
          };

      // Step 4: Crisis Response Generation
      const responseContext = {
        patterns,
        culturalBackground: userContext?.demographics?.culturalBackground,
        identityFactors: userContext?.demographics?.identityFactors,
        previousInteractions: 0,
        timeOfDay: getTimeOfDay(),
        userPreferences: {
          preferredVoice: selectedVoice,
          spiritualityImportant: userContext?.demographics?.culturalBackground?.some(bg => 
            ['indigenous', 'religious'].includes(bg.toLowerCase())
          ),
          culturallySpecificSupport: true
        }
      };

      const response = await crisisResponse.generateCrisisResponse(responseContext);

      // Step 5: Intervention Planning
      const interventionPlan = userContext 
        ? await interventionSystem.orchestrateIntervention(assessment, userContext, patterns)
        : {
            currentLevel: {
              level: 1 as const,
              name: 'self_care' as const,
              description: 'Self-guided techniques for immediate stabilization',
              interventions: [],
              escalationTriggers: [],
              timeframe: 'Immediate to 30 minutes',
              userChoice: true
            },
            recommendedInterventions: [],
            escalationPlan: {
              shouldEscalate: false,
              reason: '',
              recommendedLevel: 1,
              urgency: 'low' as const,
              userConsent: 'required' as const,
              additionalSupport: []
            },
            culturalAdaptations: [],
            traumaConsiderations: []
          };

      // Compile results
      const result: CrisisDetectionResult = {
        patterns,
        assessment,
        response,
        culturalFactors: culturalAssessment.culturalFactors,
        intervention: interventionPlan.currentLevel,
        timestamp: new Date().toISOString()
      };

      setDetectionResults(result);
      setDashboardState(prev => ({
        ...prev,
        isScanning: false,
        lastScan: new Date().toISOString(),
        crisisLevel: assessment.overallRiskLevel === 'minimal' ? 'none' : assessment.overallRiskLevel,
        safetyStatus: assessment.immediateSafetyNeeds ? 'emergency' : 
                     assessment.overallRiskLevel === 'high' || assessment.overallRiskLevel === 'critical' ? 'intervention' :
                     assessment.overallRiskLevel === 'moderate' ? 'monitoring' : 'stable',
        activeInterventions: [interventionPlan.currentLevel.name]
      }));

      // Trigger callbacks
      onCrisisDetected(result);
      onInterventionStarted(interventionPlan.currentLevel);

      // Show Khepera response if crisis detected
      if (patterns.length > 0) {
        setShowKheperaResponse(true);
      }

    } catch (error) {
      console.error('Crisis detection error:', error);
      setDashboardState(prev => ({
        ...prev,
        isScanning: false,
        safetyStatus: 'stable'
      }));
    }
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  };

  const getSafetyStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'text-green-600 bg-green-50 border-green-200';
      case 'monitoring': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'intervention': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'emergency': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCrisisLevelColor = (level: string) => {
    switch (level) {
      case 'none': return 'text-green-600';
      case 'low': return 'text-blue-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now.getTime() - then.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const renderCrisisResources = () => {
    if (!detectionResults?.response.resourcesOffered) return null;

    return (
      <div className=\"space-y-3\">
        <h4 className=\"font-medium text-gray-900\">Crisis Resources</h4>
        {detectionResults.response.resourcesOffered.map((resource, index) => (
          <div key={index} className=\"flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200\">
            {resource.type === 'hotline' ? <Phone className=\"h-5 w-5 text-blue-600\" /> :
             resource.type === 'text' ? <MessageCircle className=\"h-5 w-5 text-blue-600\" /> :
             <Users className=\"h-5 w-5 text-blue-600\" />}
            <div className=\"flex-1\">
              <div className=\"font-medium text-blue-900\">{resource.name}</div>
              <div className=\"text-sm text-blue-700\">{resource.contact}</div>
              <div className=\"text-xs text-blue-600\">{resource.availability}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className=\"space-y-6\">
      {/* Status Header */}
      <div className=\"bg-white rounded-lg shadow-sm border border-gray-200 p-6\">
        <div className=\"flex items-center justify-between mb-4\">
          <h2 className=\"text-xl font-semibold text-gray-900 flex items-center space-x-2\">
            <Shield className=\"h-6 w-6 text-blue-600\" />
            <span>Crisis Detection & Safety</span>
          </h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSafetyStatusColor(dashboardState.safetyStatus)}`}>
            {dashboardState.safetyStatus.charAt(0).toUpperCase() + dashboardState.safetyStatus.slice(1)}
          </div>
        </div>

        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
          {/* Crisis Level */}
          <div className=\"bg-gray-50 rounded-lg p-4\">
            <div className=\"flex items-center space-x-2 mb-2\">
              <AlertTriangle className={`h-5 w-5 ${getCrisisLevelColor(dashboardState.crisisLevel)}`} />
              <span className=\"font-medium text-gray-900\">Crisis Level</span>
            </div>
            <div className={`text-lg font-semibold ${getCrisisLevelColor(dashboardState.crisisLevel)}`}>
              {dashboardState.crisisLevel === 'none' ? 'None Detected' : dashboardState.crisisLevel.charAt(0).toUpperCase() + dashboardState.crisisLevel.slice(1)}
            </div>
          </div>

          {/* Last Scan */}
          <div className=\"bg-gray-50 rounded-lg p-4\">
            <div className=\"flex items-center space-x-2 mb-2\">
              <Brain className=\"h-5 w-5 text-purple-600\" />
              <span className=\"font-medium text-gray-900\">Last Scan</span>
            </div>
            <div className=\"text-lg font-semibold text-gray-700\">
              {dashboardState.isScanning ? (
                <div className=\"flex items-center space-x-2\">
                  <div className=\"animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600\"></div>
                  <span>Scanning...</span>
                </div>
              ) : dashboardState.lastScan ? (
                formatTimeAgo(dashboardState.lastScan)
              ) : (
                'Not scanned'
              )}
            </div>
          </div>

          {/* Active Interventions */}
          <div className=\"bg-gray-50 rounded-lg p-4\">
            <div className=\"flex items-center space-x-2 mb-2\">
              <Heart className=\"h-5 w-5 text-red-600\" />
              <span className=\"font-medium text-gray-900\">Interventions</span>
            </div>
            <div className=\"text-lg font-semibold text-gray-700\">
              {dashboardState.activeInterventions.length === 0 ? 'None Active' : 
               dashboardState.activeInterventions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Khepera Response */}
      <AnimatePresence>
        {showKheperaResponse && detectionResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className=\"bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6\"
          >
            <div className=\"flex items-center justify-between mb-4\">
              <h3 className=\"text-lg font-semibold text-purple-900 flex items-center space-x-2\">
                <span>✨</span>
                <span>Khepera's Response</span>
              </h3>
              <div className=\"flex space-x-2\">
                {(['sage', 'coach', 'poet'] as const).map((voice) => (
                  <button
                    key={voice}
                    onClick={() => setSelectedVoice(voice)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedVoice === voice
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-purple-600 border border-purple-300'
                    }`}
                  >
                    {voice.charAt(0).toUpperCase() + voice.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className=\"bg-white rounded-lg p-4 mb-4 border border-purple-200\">
              <p className=\"text-gray-800 leading-relaxed\">
                {detectionResults.response.message}
              </p>
            </div>

            {renderCrisisResources()}

            <div className=\"mt-4 text-xs text-purple-600\">
              {detectionResults.response.confidentialityNotice}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detection Results Details */}
      {detectionResults && (
        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
          {/* Detected Patterns */}
          <div className=\"bg-white rounded-lg shadow-sm border border-gray-200 p-6\">
            <h3 className=\"text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2\">
              <Brain className=\"h-5 w-5 text-blue-600\" />
              <span>Detected Patterns</span>
            </h3>
            <div className=\"space-y-3\">
              {detectionResults.patterns.map((pattern, index) => (
                <div key={index} className=\"bg-gray-50 rounded-lg p-3 border border-gray-200\">
                  <div className=\"flex items-center justify-between mb-2\">
                    <span className=\"font-medium text-gray-900\">{pattern.type.replace('_', ' ').toUpperCase()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pattern.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      pattern.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      pattern.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {pattern.severity}
                    </span>
                  </div>
                  <div className=\"text-sm text-gray-600\">
                    Confidence: {Math.round(pattern.confidence * 100)}%
                  </div>
                  <div className=\"text-xs text-gray-500 mt-1\">
                    Indicators: {pattern.indicators.slice(0, 3).join(', ')}
                    {pattern.indicators.length > 3 && '...'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Considerations */}
          <div className=\"bg-white rounded-lg shadow-sm border border-gray-200 p-6\">
            <h3 className=\"text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2\">
              <Globe className=\"h-5 w-5 text-green-600\" />
              <span>Cultural Considerations</span>
            </h3>
            <div className=\"space-y-3\">
              {detectionResults.culturalFactors.length > 0 ? (
                detectionResults.culturalFactors.map((factor, index) => (
                  <div key={index} className=\"bg-green-50 rounded-lg p-3 border border-green-200\">
                    <p className=\"text-sm text-green-800\">{factor}</p>
                  </div>
                ))
              ) : (
                <p className=\"text-gray-500 text-sm\">No specific cultural factors detected</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assessment Summary */}
      {detectionResults && (
        <div className=\"bg-white rounded-lg shadow-sm border border-gray-200 p-6\">
          <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Assessment Summary</h3>
          <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">
            <div className=\"bg-gray-50 rounded-lg p-4\">
              <div className=\"text-sm font-medium text-gray-600 mb-1\">Risk Level</div>
              <div className={`text-lg font-semibold ${
                detectionResults.assessment.overallRiskLevel === 'critical' ? 'text-red-600' :
                detectionResults.assessment.overallRiskLevel === 'high' ? 'text-orange-600' :
                detectionResults.assessment.overallRiskLevel === 'moderate' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {detectionResults.assessment.overallRiskLevel}
              </div>
            </div>
            <div className=\"bg-gray-50 rounded-lg p-4\">
              <div className=\"text-sm font-medium text-gray-600 mb-1\">Confidence</div>
              <div className=\"text-lg font-semibold text-gray-800\">
                {Math.round(detectionResults.assessment.confidenceScore * 100)}%
              </div>
            </div>
            <div className=\"bg-gray-50 rounded-lg p-4\">
              <div className=\"text-sm font-medium text-gray-600 mb-1\">Follow-up</div>
              <div className=\"text-lg font-semibold text-gray-800\">
                {detectionResults.assessment.followUpTimeframe.replace('_', ' ')}
              </div>
            </div>
            <div className=\"bg-gray-50 rounded-lg p-4\">
              <div className=\"text-sm font-medium text-gray-600 mb-1\">Safety Needs</div>
              <div className={`text-lg font-semibold ${
                detectionResults.assessment.immediateSafetyNeeds ? 'text-red-600' : 'text-green-600'
              }`}>
                {detectionResults.assessment.immediateSafetyNeeds ? 'Immediate' : 'Routine'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCrisisDetectionDashboard;