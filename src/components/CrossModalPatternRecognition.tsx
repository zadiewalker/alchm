'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useMoodContext, MoodType } from './MoodSelector';

// Types for cross-modal pattern recognition
interface CrossModalPattern {
  id: string;
  name: string;
  modalities: string[];
  frequency: number;
  confidence: number;
  healingSignificance: string;
  therapeuticValue: string;
  personalResonance: number;
  timeframe: 'session' | 'daily' | 'weekly' | 'monthly';
  discovered: Date;
  examples: PatternExample[];
}

interface PatternExample {
  id: string;
  timestamp: Date;
  modalities: ModalityData[];
  emotionalContext: EmotionalContext;
  outcome: HealingOutcome;
}

interface ModalityData {
  type: 'voice' | 'art' | 'poetry' | 'music' | 'movement';
  features: ModalityFeatures;
  emotionalSignature: EmotionalSignature;
  timeSpent: number;
}

interface ModalityFeatures {
  // Voice features
  tonalQuality?: 'gentle' | 'raw' | 'strong' | 'vulnerable' | 'clear';
  speechPattern?: 'flowing' | 'hesitant' | 'rhythmic' | 'fragmented';
  emotionalIntensity?: number;
  
  // Art features
  colorDominance?: string[];
  gestureType?: 'circular' | 'linear' | 'chaotic' | 'rhythmic';
  pressureIntensity?: number;
  symbolism?: string[];
  
  // Poetry features
  metaphorDensity?: number;
  emotionalArc?: string[];
  linguisticComplexity?: number;
  themes?: string[];
  
  // Music features
  frequencyRange?: number[];
  rhythmPattern?: string;
  therapeuticMode?: string;
  bodyResonance?: string[];
  
  // Movement features
  movementType?: string;
  bodyAwareness?: string[];
  energyFlow?: string;
  somaticRelease?: boolean;
}

interface EmotionalSignature {
  dominantEmotion: string;
  intensity: number;
  complexity: number;
  authenticity: number;
  flow: 'blocked' | 'hesitant' | 'flowing' | 'transcendent';
  progression: string[];
}

interface EmotionalContext {
  startingMood?: MoodType;
  endingMood?: MoodType;
  energyShift: number;
  breakthroughs: string[];
  resistances: string[];
  insights: string[];
}

interface HealingOutcome {
  wellnessImprovement: number;
  insightGained: string[];
  emotionalRelease: boolean;
  bodyIntegration: boolean;
  creativeFulfillment: number;
  connectionToSelf: number;
}

interface PatternInsight {
  id: string;
  pattern: CrossModalPattern;
  insight: string;
  actionSuggestion: string;
  healingPotential: number;
  personalRelevance: number;
}

interface CrossModalPatternRecognitionProps {
  onPatternDiscovered?: (pattern: CrossModalPattern) => void;
  className?: string;
}

// Pre-defined healing patterns that the AI recognizes
const HEALING_PATTERNS = {
  voice_to_movement: {
    name: 'Voice to Movement Flow',
    description: 'Speaking pain leads to physical release through movement',
    significance: 'Indicates readiness to embody emotional processing',
    markers: ['verbal_processing', 'kinesthetic_release', 'trauma_discharge']
  },
  
  art_to_poetry: {
    name: 'Visual to Verbal Translation',
    description: 'Visual expression transforms into linguistic meaning',
    significance: 'Integration of non-verbal trauma into conscious understanding',
    markers: ['color_symbolism', 'metaphor_creation', 'meaning_making']
  },
  
  circular_expression: {
    name: 'Circular Processing Pattern',
    description: 'Repeated themes across multiple modalities indicate core healing work',
    significance: 'Shows dedication to working through central life themes',
    markers: ['theme_repetition', 'deepening_insight', 'spiral_healing']
  },
  
  modality_bridging: {
    name: 'Creative Bridge Building',
    description: 'Using one modality to access another when feeling stuck',
    significance: 'Demonstrates resourcefulness and creative resilience',
    markers: ['creative_problem_solving', 'resource_access', 'flow_restoration']
  },
  
  crescendo_pattern: {
    name: 'Emotional Crescendo Release',
    description: 'Building intensity across modalities leading to breakthrough',
    significance: 'Indicates readiness for major emotional breakthrough',
    markers: ['intensity_building', 'multi_modal_engagement', 'cathartic_release']
  },
  
  integration_weaving: {
    name: 'Wisdom Integration Weaving',
    description: 'Multiple modalities working together to integrate new understanding',
    significance: 'Shows advanced healing capacity and wholeness seeking',
    markers: ['cross_modal_coherence', 'wisdom_synthesis', 'embodied_integration']
  }
};

const CrossModalPatternRecognition: React.FC<CrossModalPatternRecognitionProps> = ({
  onPatternDiscovered,
  className = ''
}) => {
  const [discoveredPatterns, setDiscoveredPatterns] = useState<CrossModalPattern[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState(false);
  const [patternInsights, setPatternInsights] = useState<PatternInsight[]>([]);
  const [timeframeFilter, setTimeframeFilter] = useState<'all' | 'session' | 'daily' | 'weekly' | 'monthly'>('all');
  const [selectedPattern, setSelectedPattern] = useState<CrossModalPattern | null>(null);
  const [showAnalysisDetails, setShowAnalysisDetails] = useState(false);

  const { currentMood } = useMoodContext();

  // Mock creative session data for pattern analysis
  const [mockCreativeData] = useState(() => {
    // This would normally come from localStorage or API
    return generateMockCreativeData();
  });

  // Generate mock data for demonstration
  function generateMockCreativeData() {
    const mockSessions = [];
    const now = new Date();
    
    // Create several sessions with different modality combinations
    for (let i = 0; i < 15; i++) {
      const sessionDate = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)); // Days ago
      const session = {
        id: `session_${i}`,
        date: sessionDate,
        modalities: generateMockModalityData(),
        mood: (['raw', 'tender', 'empowered', 'contemplative', 'grateful'] as MoodType[])[Math.floor(Math.random() * 5)],
        duration: Math.random() * 60 + 10, // 10-70 minutes
        energyShift: (Math.random() - 0.5) * 6 // -3 to +3
      };
      mockSessions.push(session);
    }
    
    return mockSessions;
  }

  function generateMockModalityData() {
    const modalities = ['voice', 'art', 'poetry', 'music', 'movement'];
    const numModalities = Math.floor(Math.random() * 3) + 1; // 1-3 modalities per session
    const selectedModalities = modalities
      .sort(() => 0.5 - Math.random())
      .slice(0, numModalities);
    
    return selectedModalities.map(type => ({
      type,
      features: generateMockModalityFeatures(type),
      timeSpent: Math.random() * 20 + 5, // 5-25 minutes
      emotionalSignature: generateMockEmotionalSignature()
    }));
  }

  function generateMockModalityFeatures(type: string) {
    const baseFeatures: any = {};
    
    switch (type) {
      case 'voice':
        baseFeatures.tonalQuality = ['gentle', 'raw', 'strong', 'vulnerable'][Math.floor(Math.random() * 4)];
        baseFeatures.speechPattern = ['flowing', 'hesitant', 'rhythmic'][Math.floor(Math.random() * 3)];
        baseFeatures.emotionalIntensity = Math.random();
        break;
      
      case 'art':
        baseFeatures.colorDominance = ['sage', 'blue', 'warm', 'earth'][Math.floor(Math.random() * 4)];
        baseFeatures.gestureType = ['circular', 'linear', 'chaotic'][Math.floor(Math.random() * 3)];
        baseFeatures.pressureIntensity = Math.random();
        break;
      
      case 'poetry':
        baseFeatures.metaphorDensity = Math.random();
        baseFeatures.themes = ['healing', 'growth', 'connection', 'resilience'][Math.floor(Math.random() * 4)];
        baseFeatures.linguisticComplexity = Math.random();
        break;
      
      case 'music':
        baseFeatures.frequencyRange = [200 + Math.random() * 600]; // 200-800 Hz
        baseFeatures.therapeuticMode = ['grounding', 'energizing', 'releasing'][Math.floor(Math.random() * 3)];
        break;
      
      case 'movement':
        baseFeatures.movementType = ['gentle', 'dynamic', 'flowing'][Math.floor(Math.random() * 3)];
        baseFeatures.energyFlow = ['building', 'releasing', 'circulating'][Math.floor(Math.random() * 3)];
        baseFeatures.somaticRelease = Math.random() > 0.5;
        break;
    }
    
    return baseFeatures;
  }

  function generateMockEmotionalSignature(): EmotionalSignature {
    const emotions = ['tender', 'raw', 'empowered', 'contemplative', 'grateful'];
    const flows = ['blocked', 'hesitant', 'flowing', 'transcendent'];
    
    return {
      dominantEmotion: emotions[Math.floor(Math.random() * emotions.length)],
      intensity: Math.random(),
      complexity: Math.random(),
      authenticity: Math.random() * 0.3 + 0.7, // Usually high authenticity
      flow: flows[Math.floor(Math.random() * flows.length)] as any,
      progression: ['starting', 'processing', 'integrating']
    };
  }

  // Analyze patterns across creative sessions
  const analyzePatterns = useCallback(() => {
    setActiveAnalysis(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const patterns: CrossModalPattern[] = [];
      
      // Voice to Movement Pattern Detection
      const voiceToMovementSessions = mockCreativeData.filter(session => 
        session.modalities.some(m => m.type === 'voice') && 
        session.modalities.some(m => m.type === 'movement')
      );
      
      if (voiceToMovementSessions.length >= 2) {
        patterns.push({
          id: 'voice_to_movement_1',
          name: 'Voice to Movement Flow',
          modalities: ['voice', 'movement'],
          frequency: voiceToMovementSessions.length,
          confidence: 0.85,
          healingSignificance: 'You consistently move from verbal processing to physical release, indicating healthy trauma discharge',
          therapeuticValue: 'This pattern supports complete nervous system processing - from cognitive to somatic',
          personalResonance: 0.9,
          timeframe: 'weekly',
          discovered: new Date(),
          examples: voiceToMovementSessions.slice(0, 3).map((session, i) => ({
            id: `example_${i}`,
            timestamp: session.date,
            modalities: session.modalities,
            emotionalContext: {
              startingMood: session.mood,
              energyShift: session.energyShift,
              breakthroughs: ['Physical release after verbal processing'],
              resistances: [],
              insights: ['Body holds wisdom that voice helps access']
            },
            outcome: {
              wellnessImprovement: 0.8,
              insightGained: ['Somatic integration'],
              emotionalRelease: true,
              bodyIntegration: true,
              creativeFulfillment: 0.85,
              connectionToSelf: 0.9
            }
          }))
        });
      }

      // Art to Poetry Pattern Detection
      const artToPoetryPattern = mockCreativeData.filter(session =>
        session.modalities.some(m => m.type === 'art') &&
        session.modalities.some(m => m.type === 'poetry')
      );

      if (artToPoetryPattern.length >= 2) {
        patterns.push({
          id: 'art_to_poetry_1',
          name: 'Visual to Verbal Translation',
          modalities: ['art', 'poetry'],
          frequency: artToPoetryPattern.length,
          confidence: 0.78,
          healingSignificance: 'You transform visual emotional expressions into meaningful language, creating bridges between unconscious and conscious processing',
          therapeuticValue: 'This integration supports meaning-making and helps unconscious material become consciously accessible',
          personalResonance: 0.82,
          timeframe: 'weekly',
          discovered: new Date(),
          examples: artToPoetryPattern.slice(0, 3).map((session, i) => ({
            id: `art_poetry_example_${i}`,
            timestamp: session.date,
            modalities: session.modalities,
            emotionalContext: {
              startingMood: session.mood,
              energyShift: session.energyShift,
              breakthroughs: ['Meaning emerged from visual expression'],
              resistances: [],
              insights: ['Images carry messages that words can translate']
            },
            outcome: {
              wellnessImprovement: 0.75,
              insightGained: ['Symbolic understanding', 'Conscious integration'],
              emotionalRelease: false,
              bodyIntegration: false,
              creativeFulfillment: 0.9,
              connectionToSelf: 0.85
            }
          }))
        });
      }

      // Multi-Modal Integration Pattern
      const multiModalSessions = mockCreativeData.filter(session => session.modalities.length >= 3);
      
      if (multiModalSessions.length >= 1) {
        patterns.push({
          id: 'integration_weaving_1',
          name: 'Wisdom Integration Weaving',
          modalities: ['voice', 'art', 'poetry', 'music', 'movement'],
          frequency: multiModalSessions.length,
          confidence: 0.92,
          healingSignificance: 'You naturally engage multiple creative channels simultaneously, showing advanced capacity for holistic healing',
          therapeuticValue: 'Multi-modal processing accelerates integration and creates robust healing experiences',
          personalResonance: 0.95,
          timeframe: 'session',
          discovered: new Date(),
          examples: multiModalSessions.slice(0, 2).map((session, i) => ({
            id: `integration_example_${i}`,
            timestamp: session.date,
            modalities: session.modalities,
            emotionalContext: {
              startingMood: session.mood,
              energyShift: session.energyShift,
              breakthroughs: ['Comprehensive processing across modalities'],
              resistances: [],
              insights: ['Healing happens on multiple levels simultaneously']
            },
            outcome: {
              wellnessImprovement: 0.95,
              insightGained: ['Holistic integration', 'Multi-dimensional awareness'],
              emotionalRelease: true,
              bodyIntegration: true,
              creativeFulfillment: 0.95,
              connectionToSelf: 0.98
            }
          }))
        });
      }

      setDiscoveredPatterns(patterns);
      generatePatternInsights(patterns);
      setActiveAnalysis(false);
    }, 2000);
  }, [mockCreativeData]);

  // Generate actionable insights from patterns
  const generatePatternInsights = useCallback((patterns: CrossModalPattern[]) => {
    const insights: PatternInsight[] = [];
    
    patterns.forEach(pattern => {
      let insight = '';
      let actionSuggestion = '';
      let healingPotential = 0;
      
      switch (pattern.name) {
        case 'Voice to Movement Flow':
          insight = 'Your nervous system has developed a healthy pathway from cognitive processing to somatic release. This is a trauma-informed healing pattern.';
          actionSuggestion = 'Consider starting future difficult conversations or processing sessions with voice work, knowing movement can help integrate what emerges.';
          healingPotential = 0.9;
          break;
        
        case 'Visual to Verbal Translation':
          insight = 'You have a gift for making the unconscious conscious through creative translation between visual and verbal languages.';
          actionSuggestion = 'When feeling stuck with words, try drawing or painting first. Let images show you what wants to be spoken.';
          healingPotential = 0.85;
          break;
        
        case 'Wisdom Integration Weaving':
          insight = 'Your healing style is naturally holistic and comprehensive. You instinctively know that complex experiences need multiple forms of processing.';
          actionSuggestion = 'Trust your impulse to use multiple creative modalities. Your system is telling you it wants complete, multi-dimensional healing.';
          healingPotential = 0.95;
          break;
      }
      
      insights.push({
        id: `insight_${pattern.id}`,
        pattern,
        insight,
        actionSuggestion,
        healingPotential,
        personalRelevance: pattern.personalResonance
      });
    });
    
    setPatternInsights(insights);
  }, []);

  // Filter patterns by timeframe
  const filteredPatterns = useMemo(() => {
    if (timeframeFilter === 'all') return discoveredPatterns;
    return discoveredPatterns.filter(pattern => pattern.timeframe === timeframeFilter);
  }, [discoveredPatterns, timeframeFilter]);

  // Initialize pattern analysis on mount
  useEffect(() => {
    // Auto-analyze patterns if we have sufficient data
    if (mockCreativeData.length >= 5) {
      analyzePatterns();
    }
  }, [analyzePatterns, mockCreativeData]);

  return (
    <div className={`cross-modal-pattern-recognition ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Cross-Modal Pattern Recognition
        </h3>
        <p className="text-sm text-gray-600">
          AI-powered insights into your healing patterns across creative modalities
        </p>
      </div>

      {/* Analysis Status */}
      <div className="analysis-status mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {activeAnalysis ? (
              <>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-purple-700">
                  Analyzing Creative Patterns...
                </span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">
                  {discoveredPatterns.length} Healing Patterns Discovered
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={analyzePatterns}
              disabled={activeAnalysis}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                activeAnalysis
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
              }`}
            >
              {activeAnalysis ? 'Analyzing...' : 'Refresh Analysis'}
            </button>
            
            <button
              onClick={() => setShowAnalysisDetails(!showAnalysisDetails)}
              className="px-3 py-1 bg-blue-200 text-blue-800 rounded-lg text-sm hover:bg-blue-300 transition-colors"
            >
              How It Works
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Data Sources: {mockCreativeData.length} creative sessions</span>
          <span>Analysis Confidence: {discoveredPatterns.length > 0 ? Math.round(discoveredPatterns.reduce((sum, p) => sum + p.confidence, 0) / discoveredPatterns.length * 100) : 0}%</span>
        </div>
      </div>

      {/* How It Works Details */}
      {showAnalysisDetails && (
        <div className="analysis-details mb-6 p-6 bg-gradient-to-br from-sage-50 to-green-50 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-800">How Cross-Modal Pattern Recognition Works</h4>
            <button
              onClick={() => setShowAnalysisDetails(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">🔍 Pattern Detection</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our AI analyzes your creative sessions across voice, art, poetry, music, and movement to identify recurring 
                patterns, sequences, and combinations that indicate specific healing processes.
              </p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">🧠 Therapeutic Intelligence</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Each pattern is evaluated for its therapeutic significance, healing potential, and personal relevance 
                based on trauma-informed creative therapy principles and somatic psychology.
              </p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">🌱 Personalized Insights</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Insights are tailored to your unique creative healing style, offering actionable suggestions that honor 
                your natural patterns while expanding your toolkit for growth.
              </p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">🔒 Privacy-First Design</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Pattern analysis happens locally on your device. Only anonymized, aggregated insights contribute to 
                improving the system for the broader healing community.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-sage-700 italic font-medium">
              "Every creative expression contains wisdom. Patterns reveal the deeper intelligence of your healing journey."
            </p>
          </div>
        </div>
      )}

      {/* Pattern Filter */}
      {discoveredPatterns.length > 0 && (
        <div className="pattern-filter mb-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Filter by Timeframe:</h4>
            <div className="filter-buttons flex gap-2">
              {['all', 'session', 'daily', 'weekly', 'monthly'].map(timeframe => (
                <button
                  key={timeframe}
                  onClick={() => setTimeframeFilter(timeframe as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                    timeframeFilter === timeframe
                      ? 'bg-sage-400 text-white'
                      : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Discovered Patterns */}
      {filteredPatterns.length > 0 ? (
        <div className="patterns-grid space-y-6">
          {filteredPatterns.map(pattern => (
            <div key={pattern.id} className="pattern-card bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              
              {/* Pattern Header */}
              <div className="pattern-header p-6 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-1">{pattern.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>Frequency: {pattern.frequency}x</span>
                      <span>Confidence: {Math.round(pattern.confidence * 100)}%</span>
                      <span className="capitalize">{pattern.timeframe} pattern</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {pattern.modalities.map(modality => (
                      <span key={modality} className="text-lg">
                        {modality === 'voice' && '🎙️'}
                        {modality === 'art' && '🎨'}
                        {modality === 'poetry' && '✨'}
                        {modality === 'music' && '🎵'}
                        {modality === 'movement' && '💃'}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Resonance Indicator */}
                <div className="resonance-indicator mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Personal Resonance</span>
                    <span>{Math.round(pattern.personalResonance * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${pattern.personalResonance * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="modalities-flow flex items-center justify-center gap-2 text-sm text-gray-700">
                  {pattern.modalities.map((modality, i) => (
                    <React.Fragment key={modality}>
                      <span className="font-medium capitalize">{modality}</span>
                      {i < pattern.modalities.length - 1 && (
                        <span className="text-purple-400">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              {/* Pattern Content */}
              <div className="pattern-content p-6">
                <div className="healing-significance mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Healing Significance</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{pattern.healingSignificance}</p>
                </div>
                
                <div className="therapeutic-value mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Therapeutic Value</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{pattern.therapeuticValue}</p>
                </div>
                
                {/* Pattern Examples */}
                <div className="pattern-examples">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Recent Examples</h5>
                  <div className="examples-timeline space-y-2">
                    {pattern.examples.slice(0, 2).map(example => (
                      <div key={example.id} className="example p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                          <span>{example.timestamp.toLocaleDateString()}</span>
                          <span>Energy shift: {example.outcome.wellnessImprovement > 0.5 ? '+' : ''}{Math.round((example.outcome.wellnessImprovement - 0.5) * 10)}</span>
                        </div>
                        
                        <div className="modalities-used flex gap-2 mb-2">
                          {example.modalities.map(modality => (
                            <span key={modality.type} className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full capitalize">
                              {modality.type}
                            </span>
                          ))}
                        </div>
                        
                        {example.emotionalContext.insights.length > 0 && (
                          <div className="insights text-xs text-gray-700 italic">
                            "{example.emotionalContext.insights[0]}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Pattern Actions */}
              <div className="pattern-actions p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    Discovered {pattern.discovered.toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPattern(pattern)}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs hover:bg-purple-200 transition-colors"
                    >
                      View Insights
                    </button>
                    
                    <button
                      onClick={() => {
                        // Save pattern as personal insight
                        console.log('Saving pattern insight:', pattern);
                      }}
                      className="px-3 py-1 bg-sage-100 text-sage-700 rounded-lg text-xs hover:bg-sage-200 transition-colors"
                    >
                      Save Insight
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !activeAnalysis && (
        <div className="empty-state text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            Discovering Your Creative Patterns
          </h4>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
            Create more sessions using different modalities to unlock insights about your unique healing patterns. 
            Our AI needs at least 5 sessions to identify meaningful patterns.
          </p>
          
          <div className="progress-indicator">
            <div className="text-xs text-gray-600 mb-2">
              Progress: {mockCreativeData.length}/5 sessions
            </div>
            <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto">
              <div 
                className="bg-sage-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (mockCreativeData.length / 5) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pattern Insight Modal */}
      {selectedPattern && (
        <div className="pattern-insight-modal fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-3xl max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="modal-header p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-medium text-gray-800">
                  Pattern Insights: {selectedPattern.name}
                </h4>
                <button
                  onClick={() => setSelectedPattern(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="modal-body p-6">
              {/* Pattern insights would be displayed here */}
              {patternInsights
                .filter(insight => insight.pattern.id === selectedPattern.id)
                .map(insight => (
                  <div key={insight.id} className="insight-content space-y-4">
                    <div className="insight p-4 bg-purple-50 rounded-lg">
                      <h5 className="text-sm font-medium text-purple-800 mb-2">Personal Insight</h5>
                      <p className="text-sm text-gray-700 leading-relaxed">{insight.insight}</p>
                    </div>
                    
                    <div className="action-suggestion p-4 bg-green-50 rounded-lg">
                      <h5 className="text-sm font-medium text-green-800 mb-2">Suggested Action</h5>
                      <p className="text-sm text-gray-700 leading-relaxed">{insight.actionSuggestion}</p>
                    </div>
                    
                    <div className="potential-indicators grid grid-cols-2 gap-4">
                      <div className="healing-potential">
                        <div className="text-xs text-gray-600 mb-1">Healing Potential</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-400 h-2 rounded-full"
                            style={{ width: `${insight.healingPotential * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {Math.round(insight.healingPotential * 100)}% potential
                        </div>
                      </div>
                      
                      <div className="personal-relevance">
                        <div className="text-xs text-gray-600 mb-1">Personal Relevance</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-400 h-2 rounded-full"
                            style={{ width: `${insight.personalRelevance * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {Math.round(insight.personalRelevance * 100)}% relevance
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrossModalPatternRecognition;