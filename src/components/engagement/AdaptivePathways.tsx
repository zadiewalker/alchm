/**
 * ALCHM Adaptive Pathways System
 * 
 * Intelligent journey evolution that adapts to user's writing patterns, progress,
 * and therapeutic needs. Creates personalized healing pathways that evolve
 * based on invisible progress markers and breakthrough patterns.
 * 
 * This system ensures users always have meaningful next steps without pressure.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { therapeuticMomentumEngine } from '@/lib/retention/therapeutic-momentum-engine';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Map, 
  Route, 
  TreePine,
  Flower2,
  Mountain,
  Waves,
  Sun,
  Moon,
  Star,
  Heart,
  Brain,
  Shield,
  Lightbulb,
  Users,
  Palette,
  BookOpen,
  Target,
  Zap,
  Leaf
} from 'lucide-react';

interface PathwayStage {
  id: string;
  name: string;
  description: string;
  category: 'foundation' | 'exploration' | 'integration' | 'mastery' | 'transcendence';
  prerequisites: string[];
  estimatedDuration: string;
  therapeuticGoals: string[];
  progressMarkers: string[];
  nextStages: string[];
  icon: React.ReactNode;
  color: string;
  difficulty: 'gentle' | 'moderate' | 'challenging' | 'advanced';
}

interface AdaptiveRecommendation {
  pathway: PathwayStage;
  confidence: number;
  reasoning: string[];
  urgency: 'low' | 'medium' | 'high';
  personalizedFor: string[];
  estimatedBenefit: number;
  adaptationTriggers: string[];
}

interface UserJourneyState {
  currentStage: string;
  completedStages: string[];
  progressInCurrentStage: number;
  journeyStartDate: Date;
  totalJourneyTime: number;
  pathwayHistory: string[];
  preferredCategories: string[];
  avoidedCategories: string[];
  readinessLevel: number; // 0-100
  therapeuticFocus: string[];
}

interface PersonalizationFactors {
  writingStyle: 'reflective' | 'analytical' | 'emotional' | 'creative' | 'practical';
  emotionalRange: number;
  vulnerabilityComfort: number;
  communityEngagement: number;
  crisisResilience: number;
  growthMindset: number;
  spiritualOpenness: number;
  creativeExpression: number;
}

const pathwayStages: PathwayStage[] = [
  // Foundation Stages
  {
    id: 'emotional_awareness_foundation',
    name: 'Emotional Awareness Foundation',
    description: 'Building the basic skills to recognize and name emotions as they arise.',
    category: 'foundation',
    prerequisites: [],
    estimatedDuration: '2-3 weeks',
    therapeuticGoals: ['emotion identification', 'basic mindfulness', 'self-observation'],
    progressMarkers: ['daily emotion check-ins', 'emotion vocabulary growth', 'pattern recognition'],
    nextStages: ['emotional_regulation_basics', 'mindful_journaling'],
    icon: <Heart className="w-5 h-5" />,
    color: 'rose',
    difficulty: 'gentle'
  },
  {
    id: 'safe_space_creation',
    name: 'Creating Your Sacred Space',
    description: 'Establishing internal and external safe spaces for healing and growth.',
    category: 'foundation',
    prerequisites: [],
    estimatedDuration: '1-2 weeks',
    therapeuticGoals: ['safety establishment', 'boundary setting', 'self-care practices'],
    progressMarkers: ['daily safety rituals', 'boundary practice', 'comfort with solitude'],
    nextStages: ['trauma_informed_healing', 'relationship_boundaries'],
    icon: <Shield className="w-5 h-5" />,
    color: 'blue',
    difficulty: 'gentle'
  },

  // Exploration Stages
  {
    id: 'pattern_recognition_journey',
    name: 'Pattern Recognition Journey',
    description: 'Discovering the recurring themes, triggers, and responses in your life.',
    category: 'exploration',
    prerequisites: ['emotional_awareness_foundation'],
    estimatedDuration: '3-4 weeks',
    therapeuticGoals: ['pattern identification', 'trigger awareness', 'behavioral insights'],
    progressMarkers: ['breakthrough insights', 'connection-making', 'aha moments'],
    nextStages: ['shadow_work_introduction', 'relationship_dynamics'],
    icon: <Compass className="w-5 h-5" />,
    color: 'amber',
    difficulty: 'moderate'
  },
  {
    id: 'creative_expression_pathway',
    name: 'Creative Expression Pathway',
    description: 'Using art, movement, and creativity as vehicles for healing and self-discovery.',
    category: 'exploration',
    prerequisites: ['safe_space_creation'],
    estimatedDuration: '4-6 weeks',
    therapeuticGoals: ['creative flow', 'non-verbal processing', 'intuitive wisdom'],
    progressMarkers: ['creative breakthroughs', 'emotional release', 'artistic confidence'],
    nextStages: ['somatic_healing', 'community_creative_sharing'],
    icon: <Palette className="w-5 h-5" />,
    color: 'purple',
    difficulty: 'moderate'
  },

  // Integration Stages
  {
    id: 'shadow_work_integration',
    name: 'Shadow Work Integration',
    description: 'Embracing and integrating the rejected parts of yourself with compassion.',
    category: 'integration',
    prerequisites: ['pattern_recognition_journey', 'emotional_awareness_foundation'],
    estimatedDuration: '6-8 weeks',
    therapeuticGoals: ['shadow acknowledgment', 'self-acceptance', 'wholeness integration'],
    progressMarkers: ['self-compassion growth', 'reduced self-judgment', 'integrated awareness'],
    nextStages: ['archetypal_exploration', 'wounded_healer_path'],
    icon: <Moon className="w-5 h-5" />,
    color: 'indigo',
    difficulty: 'challenging'
  },
  {
    id: 'relationship_alchemy',
    name: 'Relationship Alchemy',
    description: 'Transforming relationship patterns and creating authentic connections.',
    category: 'integration',
    prerequisites: ['pattern_recognition_journey', 'safe_space_creation'],
    estimatedDuration: '5-7 weeks',
    therapeuticGoals: ['healthy boundaries', 'authentic communication', 'interdependence'],
    progressMarkers: ['boundary clarity', 'communication skills', 'relationship improvements'],
    nextStages: ['community_leadership', 'mentorship_readiness'],
    icon: <Users className="w-5 h-5" />,
    color: 'emerald',
    difficulty: 'challenging'
  },

  // Mastery Stages
  {
    id: 'archetypal_mastery',
    name: 'Archetypal Mastery',
    description: 'Understanding and embodying your core archetypal energies for authentic living.',
    category: 'mastery',
    prerequisites: ['shadow_work_integration'],
    estimatedDuration: '8-10 weeks',
    therapeuticGoals: ['archetypal integration', 'authentic expression', 'purpose clarity'],
    progressMarkers: ['archetypal awareness', 'authentic choices', 'purpose alignment'],
    nextStages: ['wisdom_keeper_path', 'spiritual_integration'],
    icon: <Star className="w-5 h-5" />,
    color: 'gold',
    difficulty: 'advanced'
  },
  {
    id: 'purpose_crystallization',
    name: 'Purpose Crystallization',
    description: 'Clarifying and manifesting your unique contribution to the world.',
    category: 'mastery',
    prerequisites: ['relationship_alchemy'],
    estimatedDuration: '6-8 weeks',
    therapeuticGoals: ['purpose clarity', 'service orientation', 'impact creation'],
    progressMarkers: ['mission clarity', 'service activities', 'impact measurement'],
    nextStages: ['legacy_creation', 'community_transformation'],
    icon: <Target className="w-5 h-5" />,
    color: 'orange',
    difficulty: 'advanced'
  },

  // Transcendence Stages
  {
    id: 'wisdom_keeper_emergence',
    name: 'Wisdom Keeper Emergence',
    description: 'Stepping into the role of guide and mentor for others on the path.',
    category: 'transcendence',
    prerequisites: ['archetypal_mastery', 'purpose_crystallization'],
    estimatedDuration: 'ongoing',
    therapeuticGoals: ['wisdom sharing', 'mentorship skills', 'community contribution'],
    progressMarkers: ['mentoring activities', 'wisdom sharing', 'community impact'],
    nextStages: ['elder_wisdom', 'legacy_fulfillment'],
    icon: <TreePine className="w-5 h-5" />,
    color: 'green',
    difficulty: 'advanced'
  }
];

export default function AdaptivePathways({
  onPathwayChange,
  showRecommendations = true,
  autoAdapt = true
}: {
  onPathwayChange?: (pathway: PathwayStage) => void;
  showRecommendations?: boolean;
  autoAdapt?: boolean;
}) {
  const { user } = useAuth();
  const [userJourneyState, setUserJourneyState] = useState<UserJourneyState | null>(null);
  const [personalizationFactors, setPersonalizationFactors] = useState<PersonalizationFactors | null>(null);
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState<AdaptiveRecommendation[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<PathwayStage | null>(null);
  const [showPathwayDetails, setShowPathwayDetails] = useState(false);

  /**
   * Load user journey state and personalization factors
   */
  const loadUserJourneyData = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const momentum = await therapeuticMomentumEngine.calculateMomentum(user.uid);
      
      // Calculate journey state from momentum data
      const journeyState: UserJourneyState = {
        currentStage: determineCurrentStage(momentum),
        completedStages: determineCompletedStages(momentum),
        progressInCurrentStage: calculateStageProgress(momentum),
        journeyStartDate: new Date(Date.now() - (momentum.totalSessions * 24 * 60 * 60 * 1000)),
        totalJourneyTime: momentum.totalSessions,
        pathwayHistory: [], // Would load from user preferences
        preferredCategories: inferPreferredCategories(momentum),
        avoidedCategories: [],
        readinessLevel: momentum.currentMomentum,
        therapeuticFocus: inferTherapeuticFocus(momentum)
      };

      // Calculate personalization factors
      const factors: PersonalizationFactors = {
        writingStyle: inferWritingStyle(momentum),
        emotionalRange: momentum.emotionalVocabularyGrowth,
        vulnerabilityComfort: Math.min(100, momentum.totalSessions * 2),
        communityEngagement: momentum.connectionStrength,
        crisisResilience: 100 - momentum.riskScore,
        growthMindset: momentum.currentMomentum,
        spiritualOpenness: 50, // Would infer from content analysis
        creativeExpression: 40 // Would infer from content analysis
      };

      setUserJourneyState(journeyState);
      setPersonalizationFactors(factors);
    } catch (error) {
      console.error('Error loading user journey data:', error);
    }
  }, [user?.uid]);

  /**
   * Generate adaptive pathway recommendations
   */
  const generateRecommendations = useCallback(() => {
    if (!userJourneyState || !personalizationFactors) return;

    const recommendations: AdaptiveRecommendation[] = [];

    // Find eligible pathways based on prerequisites
    const eligiblePathways = pathwayStages.filter(stage => {
      return stage.prerequisites.every(prereq => 
        userJourneyState.completedStages.includes(prereq)
      );
    });

    // Score and rank pathways
    eligiblePathways.forEach(pathway => {
      const score = calculatePathwayScore(pathway, userJourneyState, personalizationFactors);
      
      if (score.confidence > 60) {
        recommendations.push({
          pathway,
          confidence: score.confidence,
          reasoning: score.reasoning,
          urgency: score.urgency,
          personalizedFor: score.personalizedFactors,
          estimatedBenefit: score.estimatedBenefit,
          adaptationTriggers: score.adaptationTriggers
        });
      }
    });

    // Sort by confidence and estimated benefit
    recommendations.sort((a, b) => 
      (b.confidence * b.estimatedBenefit) - (a.confidence * a.estimatedBenefit)
    );

    setAdaptiveRecommendations(recommendations.slice(0, 3));
  }, [userJourneyState, personalizationFactors]);

  /**
   * Calculate pathway recommendation score
   */
  const calculatePathwayScore = (
    pathway: PathwayStage,
    journey: UserJourneyState,
    factors: PersonalizationFactors
  ) => {
    let confidence = 50; // Base confidence
    const reasoning: string[] = [];
    const personalizedFactors: string[] = [];
    const adaptationTriggers: string[] = [];
    let urgency: 'low' | 'medium' | 'high' = 'low';
    let estimatedBenefit = 50;

    // Category preferences
    if (journey.preferredCategories.includes(pathway.category)) {
      confidence += 20;
      reasoning.push(`Matches your preferred ${pathway.category} category`);
    }

    // Readiness level alignment
    const difficultyScore = {
      'gentle': 25,
      'moderate': 50,
      'challenging': 75,
      'advanced': 90
    }[pathway.difficulty];

    if (Math.abs(journey.readinessLevel - difficultyScore) < 20) {
      confidence += 15;
      reasoning.push('Perfectly matched to your current readiness level');
    }

    // Personalization factor alignment
    switch (pathway.id) {
      case 'creative_expression_pathway':
        if (factors.creativeExpression > 60) {
          confidence += 25;
          personalizedFactors.push('high creative expression');
        }
        break;
      case 'relationship_alchemy':
        if (factors.communityEngagement > 50) {
          confidence += 20;
          personalizedFactors.push('community engagement readiness');
        }
        break;
      case 'shadow_work_integration':
        if (factors.vulnerabilityComfort > 70) {
          confidence += 30;
          personalizedFactors.push('high vulnerability comfort');
        }
        break;
    }

    // Therapeutic focus alignment
    const goalAlignment = pathway.therapeuticGoals.filter(goal =>
      journey.therapeuticFocus.includes(goal)
    ).length;
    
    if (goalAlignment > 0) {
      confidence += goalAlignment * 10;
      reasoning.push(`Addresses ${goalAlignment} of your current therapeutic focuses`);
    }

    // Urgency calculation
    if (journey.readinessLevel > 80 && pathway.difficulty === 'challenging') {
      urgency = 'high';
      reasoning.push('You appear ready for more challenging work');
    } else if (journey.progressInCurrentStage > 80) {
      urgency = 'medium';
      reasoning.push('Good progress in current stage suggests readiness to advance');
    }

    // Estimated benefit calculation
    estimatedBenefit = Math.min(100, 
      confidence + 
      (goalAlignment * 15) + 
      (factors.growthMindset * 0.3)
    );

    return {
      confidence: Math.min(100, confidence),
      reasoning,
      urgency,
      personalizedFactors,
      estimatedBenefit,
      adaptationTriggers
    };
  };

  /**
   * Handle pathway selection
   */
  const selectPathway = async (recommendation: AdaptiveRecommendation) => {
    if (!userJourneyState) return;

    try {
      // Update user journey state
      const updatedJourney = {
        ...userJourneyState,
        currentStage: recommendation.pathway.id,
        progressInCurrentStage: 0,
        pathwayHistory: [...userJourneyState.pathwayHistory, recommendation.pathway.id]
      };

      setUserJourneyState(updatedJourney);
      setSelectedPathway(recommendation.pathway);
      
      // Trigger callback
      onPathwayChange?.(recommendation.pathway);

      // Save selection to backend
      await savePathwaySelection(recommendation.pathway.id);
    } catch (error) {
      console.error('Error selecting pathway:', error);
    }
  };

  /**
   * Helper functions for journey state calculation
   */
  const determineCurrentStage = (momentum: any): string => {
    if (momentum.totalSessions < 5) return 'emotional_awareness_foundation';
    if (momentum.breakthroughMoments < 2) return 'safe_space_creation';
    if (momentum.emotionalVocabularyGrowth < 20) return 'pattern_recognition_journey';
    return 'creative_expression_pathway';
  };

  const determineCompletedStages = (momentum: any): string[] => {
    const completed: string[] = [];
    if (momentum.totalSessions >= 5) completed.push('emotional_awareness_foundation');
    if (momentum.breakthroughMoments >= 2) completed.push('safe_space_creation');
    if (momentum.emotionalVocabularyGrowth >= 20) completed.push('pattern_recognition_journey');
    return completed;
  };

  const calculateStageProgress = (momentum: any): number => {
    // Simplified progress calculation
    return Math.min(100, (momentum.weeklyGrowth / 5) * 100);
  };

  const inferPreferredCategories = (momentum: any): string[] => {
    const categories: string[] = [];
    if (momentum.connectionStrength > 50) categories.push('integration');
    if (momentum.breakthroughMoments > 3) categories.push('exploration');
    if (momentum.currentMomentum > 70) categories.push('mastery');
    return categories;
  };

  const inferTherapeuticFocus = (momentum: any): string[] => {
    const focus: string[] = ['emotional awareness'];
    if (momentum.riskScore > 30) focus.push('crisis resilience');
    if (momentum.connectionStrength < 30) focus.push('relationship skills');
    return focus;
  };

  const inferWritingStyle = (momentum: any): PersonalizationFactors['writingStyle'] => {
    if (momentum.insightDepthScore > 70) return 'analytical';
    if (momentum.emotionalVocabularyGrowth > 30) return 'emotional';
    if (momentum.breakthroughMoments > 5) return 'reflective';
    return 'practical';
  };

  const savePathwaySelection = async (pathwayId: string) => {
    // Would save to Firestore
    console.log('Saving pathway selection:', pathwayId);
  };

  // Effects
  useEffect(() => {
    loadUserJourneyData();
  }, [loadUserJourneyData]);

  useEffect(() => {
    if (userJourneyState && personalizationFactors && autoAdapt) {
      generateRecommendations();
    }
  }, [userJourneyState, personalizationFactors, generateRecommendations, autoAdapt]);

  // Computed values
  const currentPathway = useMemo(() => {
    if (!userJourneyState) return null;
    return pathwayStages.find(stage => stage.id === userJourneyState.currentStage) || null;
  }, [userJourneyState]);

  if (!showRecommendations) {
    return null;
  }

  return (
    <div className="adaptive-pathways">
      {/* Current Pathway Display */}
      {currentPathway && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className={`text-${currentPathway.color}-600 mt-1`}>
              {currentPathway.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Current Journey: {currentPathway.name}
              </h3>
              <p className="text-xs text-blue-700 mb-2">
                {currentPathway.description}
              </p>
              
              {/* Progress indicator */}
              {userJourneyState && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-blue-600">
                    <span>Progress</span>
                    <span>{userJourneyState.progressInCurrentStage}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${userJourneyState.progressInCurrentStage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowPathwayDetails(true)}
              className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      )}

      {/* Adaptive Recommendations */}
      {adaptiveRecommendations.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
            <Compass className="w-4 h-4 text-gray-600" />
            <span>Recommended Next Steps</span>
          </h4>
          
          <div className="space-y-3">
            {adaptiveRecommendations.map(recommendation => (
              <PathwayRecommendationCard
                key={recommendation.pathway.id}
                recommendation={recommendation}
                onSelect={() => selectPathway(recommendation)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pathway Details Modal */}
      <AnimatePresence>
        {showPathwayDetails && currentPathway && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPathwayDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <PathwayDetailView
                pathway={currentPathway}
                journeyState={userJourneyState}
                onClose={() => setShowPathwayDetails(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Pathway Recommendation Card Component
 */
const PathwayRecommendationCard = ({
  recommendation,
  onSelect
}: {
  recommendation: AdaptiveRecommendation;
  onSelect: () => void;
}) => {
  const { pathway } = recommendation;
  
  const getUrgencyColor = () => {
    switch (recommendation.urgency) {
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-amber-200 bg-amber-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getUrgencyColor()}`}>
      <div className="flex items-start space-x-3">
        <div className={`text-${pathway.color}-600 mt-1`}>
          {pathway.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-1">
                {pathway.name}
              </h5>
              <p className="text-xs text-gray-600">
                {pathway.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">
                {recommendation.confidence}% match
              </div>
              <div className="text-xs font-medium text-gray-700">
                {pathway.estimatedDuration}
              </div>
            </div>
          </div>
          
          {/* Reasoning */}
          {recommendation.reasoning.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Why this fits you:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {recommendation.reasoning.slice(0, 2).map((reason, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Goals preview */}
          <div className="flex flex-wrap gap-1 mb-3">
            {pathway.therapeuticGoals.slice(0, 3).map(goal => (
              <span 
                key={goal}
                className="text-xs px-2 py-1 bg-white/60 rounded-full text-gray-600"
              >
                {goal}
              </span>
            ))}
          </div>
          
          <button
            onClick={onSelect}
            className={`w-full py-2 px-4 bg-${pathway.color}-600 hover:bg-${pathway.color}-700 text-white text-sm font-medium rounded-lg transition-colors`}
          >
            Begin This Journey
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Pathway Detail View Component
 */
const PathwayDetailView = ({
  pathway,
  journeyState,
  onClose
}: {
  pathway: PathwayStage;
  journeyState: UserJourneyState | null;
  onClose: () => void;
}) => {
  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`text-${pathway.color}-600`}>{pathway.icon}</div>
          <h3 className="text-lg font-semibold text-gray-900">
            {pathway.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          ✕
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        {pathway.description}
      </p>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Therapeutic Goals
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {pathway.therapeuticGoals.map(goal => (
              <li key={goal} className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-gray-400" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Progress Markers
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {pathway.progressMarkers.map(marker => (
              <li key={marker} className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-gray-400" />
                <span>{marker}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {journeyState && (
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Your Progress
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Current progress</span>
                <span className="font-medium">{journeyState.progressInCurrentStage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`bg-${pathway.color}-600 h-1.5 rounded-full transition-all duration-300`}
                  style={{ width: `${journeyState.progressInCurrentStage}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex space-x-3">
        <button
          onClick={onClose}
          className="flex-1 py-2 px-4 text-sm text-gray-600 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors"
        >
          Close
        </button>
        <button
          className={`flex-1 py-2 px-4 bg-${pathway.color}-600 hover:bg-${pathway.color}-700 text-white text-sm font-medium rounded-lg transition-colors`}
        >
          Continue Journey
        </button>
      </div>
    </div>
  );
};