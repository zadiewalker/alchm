'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useMoodContext, MoodType } from './MoodSelector';
import VoiceJournal from './VoiceJournal';
import ArtCanvas from './ArtCanvas';
import PoetryLab from './PoetryLab';
import MusicTherapy from './MusicTherapy';
import MovementTherapy from './MovementTherapy';

// Types for creative expression data
interface CreativeSession {
  id: string;
  type: 'voice' | 'art' | 'poetry' | 'music' | 'movement' | 'mixed';
  modalities: CreativeModality[];
  duration: number;
  mood?: MoodType;
  crossModalPatterns: CrossModalPattern[];
  healingInsights: string[];
  timestamp: Date;
  energyFlow: {
    start: number;
    peak: number;
    end: number;
  };
}

interface CreativeModality {
  type: 'voice' | 'art' | 'poetry' | 'music' | 'movement';
  data: any;
  emotionalSignature: EmotionalSignature;
  timeSpent: number;
  switchedFrom?: string;
  switchedTo?: string;
}

interface EmotionalSignature {
  dominantEmotion: string;
  intensity: number;
  complexity: number;
  authenticity: number;
  flow: 'blocked' | 'hesitant' | 'flowing' | 'transcendent';
}

interface CrossModalPattern {
  pattern: string;
  modalities: string[];
  meaning: string;
  therapeuticValue: string;
  frequency: number;
}

interface CreativeExpressionHubProps {
  onSessionComplete?: (session: CreativeSession) => void;
  className?: string;
}

// Creative modality configurations
const CREATIVE_MODALITIES = {
  voice: {
    name: 'Voice Expression',
    icon: '🎙️',
    color: 'from-sage-50 to-sage-200',
    borderColor: 'border-sage-400',
    description: 'Speak your truth, analyze emotional tones',
    benefits: ['Immediate release', 'Emotional processing'],
    when: 'When words need to flow without filter'
  },
  art: {
    name: 'Visual Art',
    icon: '🎨',
    color: 'from-sage-50 to-sage-100',
    borderColor: 'border-sage-300',
    description: 'Express through colors, shapes, and gestures',
    benefits: ['Non-verbal expression', 'Symbolic processing'],
    when: 'When emotions are beyond words'
  },
  poetry: {
    name: 'Poetry Creation',
    icon: '✨',
    color: 'from-purple-100 to-violet-100',
    borderColor: 'border-purple-400',
    description: 'Transform feelings into verses with AI support',
    benefits: ['Metaphor creation', 'AI collaboration', 'Pattern recognition', 'Linguistic healing'],
    when: 'When you need to find beauty in experience'
  },
  music: {
    name: 'Sound Healing',
    icon: '🎵',
    color: 'from-orange-100 to-red-100',
    borderColor: 'border-orange-400',
    description: 'Therapeutic frequencies and breathing rhythms',
    benefits: ['Nervous system regulation', 'Frequency healing', 'Breath work', 'Vibrational therapy'],
    when: 'When your body needs sound medicine'
  },
  movement: {
    name: 'Somatic Movement',
    icon: '💃',
    color: 'from-pink-100 to-rose-100',
    borderColor: 'border-pink-400',
    description: 'Healing through body wisdom and movement',
    benefits: ['Body awareness', 'Trauma release', 'Energy tracking', 'Somatic intelligence'],
    when: 'When healing lives in the body'
  }
} as const;

const CreativeExpressionHub: React.FC<CreativeExpressionHubProps> = ({
  onSessionComplete,
  className = ''
}) => {
  const [activeModality, setActiveModality] = useState<keyof typeof CREATIVE_MODALITIES | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [modalityHistory, setModalityHistory] = useState<CreativeModality[]>([]);
  const [showModalitySelector, setShowModalitySelector] = useState(false);
  const [crossModalInsights, setCrossModalInsights] = useState<CrossModalPattern[]>([]);
  const [energyTracking, setEnergyTracking] = useState({
    start: 5,
    current: 5,
    peak: 5
  });
  
  // Creative flow tracking
  const [creativeFlow, setCreativeFlow] = useState({
    switches: 0,
    totalTime: 0,
    dominantModality: null as string | null,
    flowState: 'beginning' as 'beginning' | 'exploring' | 'flowing' | 'integrating'
  });

  const { currentMood, getMoodData } = useMoodContext();

  // Get mood-appropriate creative suggestions
  const moodSuggestions = useMemo(() => {
    if (!currentMood) return ['art', 'voice', 'movement'];
    
    const suggestions: { [key in MoodType]: (keyof typeof CREATIVE_MODALITIES)[] } = {
      raw: ['voice', 'movement', 'art'],
      tender: ['art', 'poetry', 'music'],
      empowered: ['movement', 'voice', 'poetry'],
      contemplative: ['poetry', 'music', 'art'],
      grateful: ['music', 'poetry', 'voice']
    };
    
    return suggestions[currentMood] || ['art', 'voice', 'movement'];
  }, [currentMood]);

  // Start creative session
  const startCreativeSession = useCallback(() => {
    setSessionActive(true);
    setSessionStartTime(new Date());
    setModalityHistory([]);
    setCrossModalInsights([]);
    setCreativeFlow({
      switches: 0,
      totalTime: 0,
      dominantModality: null,
      flowState: 'beginning'
    });
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }, []);

  // Switch modalities during session
  const switchModality = useCallback((newModality: keyof typeof CREATIVE_MODALITIES) => {
    const now = Date.now();
    
    if (activeModality) {
      // Record time spent in previous modality
      const timeSpent = sessionStartTime ? now - sessionStartTime.getTime() : 0;
      
      const modalityData: CreativeModality = {
        type: activeModality,
        data: {}, // This would be populated by the actual component
        emotionalSignature: {
          dominantEmotion: currentMood || 'neutral',
          intensity: Math.random() * 0.5 + 0.5, // Mock for now
          complexity: Math.random() * 0.7 + 0.3,
          authenticity: Math.random() * 0.3 + 0.7,
          flow: creativeFlow.flowState === 'flowing' ? 'flowing' : 'hesitant'
        },
        timeSpent,
        switchedFrom: activeModality,
        switchedTo: newModality
      };
      
      setModalityHistory(prev => [...prev, modalityData]);
      
      // Update flow tracking
      setCreativeFlow(prev => ({
        ...prev,
        switches: prev.switches + 1,
        totalTime: prev.totalTime + timeSpent,
        dominantModality: prev.totalTime > timeSpent ? prev.dominantModality : activeModality,
        flowState: prev.switches > 2 ? 'flowing' : 'exploring'
      }));
    }

    setActiveModality(newModality);
    setShowModalitySelector(false);
    
    // Analyze cross-modal patterns
    analyzeCrossModalPatterns(newModality);
    
    // Gentle haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, [activeModality, sessionStartTime, currentMood, creativeFlow.flowState]);

  // Analyze patterns across modalities
  const analyzeCrossModalPatterns = useCallback((currentModality: keyof typeof CREATIVE_MODALITIES) => {
    if (modalityHistory.length < 1) return;
    
    const patterns: CrossModalPattern[] = [];
    
    // Pattern: Voice → Art (emotional externalization)
    if (modalityHistory.some(m => m.type === 'voice') && currentModality === 'art') {
      patterns.push({
        pattern: 'Voice-to-Visual Expression',
        modalities: ['voice', 'art'],
        meaning: 'Moving from verbal processing to visual externalization',
        therapeuticValue: 'Transforming internal experience into tangible form',
        frequency: 1
      });
    }
    
    // Pattern: Movement → Poetry (embodied wisdom to language)
    if (modalityHistory.some(m => m.type === 'movement') && currentModality === 'poetry') {
      patterns.push({
        pattern: 'Embodied-to-Linguistic Wisdom',
        modalities: ['movement', 'poetry'],
        meaning: 'Translating body wisdom into poetic language',
        therapeuticValue: 'Integrating somatic knowledge with conscious expression',
        frequency: 1
      });
    }
    
    // Pattern: Multiple modalities (integration)
    const uniqueModalities = new Set([...modalityHistory.map(m => m.type), currentModality]);
    if (uniqueModalities.size >= 3) {
      patterns.push({
        pattern: 'Multi-Modal Integration',
        modalities: Array.from(uniqueModalities),
        meaning: 'Exploring healing through multiple creative channels',
        therapeuticValue: 'Comprehensive emotional processing and integration',
        frequency: uniqueModalities.size
      });
    }
    
    setCrossModalInsights(prev => [...prev.slice(-5), ...patterns]);
  }, [modalityHistory]);

  // Complete creative session
  const completeSession = useCallback(() => {
    if (!sessionStartTime) return;
    
    const totalDuration = Date.now() - sessionStartTime.getTime();
    
    // Generate healing insights based on session
    const healingInsights = [
      `${Math.floor(totalDuration / 60000)} minutes of multi-modal creative healing`,
      `Explored ${modalityHistory.length + (activeModality ? 1 : 0)} different creative modalities`,
      creativeFlow.switches > 3 
        ? 'Deep creative flow achieved through modality switching'
        : 'Focused creative exploration with intentional modality use',
      crossModalInsights.length > 0
        ? `Discovered ${crossModalInsights.length} cross-modal healing patterns`
        : 'Single-modality deep dive for concentrated healing',
      currentMood 
        ? `Creative expression honored your ${currentMood} energy and supported natural processing`
        : 'Authentic creative expression supported emotional integration'
    ];
    
    const session: CreativeSession = {
      id: Date.now().toString(),
      type: modalityHistory.length > 2 ? 'mixed' : (activeModality || 'mixed'),
      modalities: modalityHistory,
      duration: totalDuration,
      mood: currentMood || undefined,
      crossModalPatterns: crossModalInsights,
      healingInsights,
      timestamp: new Date(),
      energyFlow: {
        start: energyTracking.start,
        peak: energyTracking.peak,
        end: energyTracking.current
      }
    };
    
    // Save to localStorage
    const savedSessions = JSON.parse(localStorage.getItem('alchm_creative_sessions') || '[]');
    savedSessions.push(session);
    localStorage.setItem('alchm_creative_sessions', JSON.stringify(savedSessions));
    
    onSessionComplete?.(session);
    
    // Reset session state
    setSessionActive(false);
    setActiveModality(null);
    setSessionStartTime(null);
    setModalityHistory([]);
    setCrossModalInsights([]);
    setCreativeFlow({
      switches: 0,
      totalTime: 0,
      dominantModality: null,
      flowState: 'beginning'
    });
    
    // Success feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }, [sessionStartTime, modalityHistory, activeModality, creativeFlow, crossModalInsights, currentMood, energyTracking, onSessionComplete]);

  // Format session duration
  const formatSessionDuration = useCallback(() => {
    if (!sessionStartTime) return '0:00';
    const elapsed = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [sessionStartTime]);

  return (
    <div className={`creative-expression-hub ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Creative Expression Sanctuary
        </h3>
        <p className="text-sm text-gray-600">
          Multi-modal healing through art, voice, poetry, sound, and movement
        </p>
      </div>

      {/* Session Status */}
      {sessionActive && (
        <div className="session-status mb-6 p-4 bg-gradient-to-r from-sage-50 to-green-50 rounded-2xl border border-sage-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Creative Session Active
              </span>
              <span className="text-lg font-light text-gray-600">
                {formatSessionDuration()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowModalitySelector(!showModalitySelector)}
                className="px-3 py-1 bg-sage-200 text-sage-800 rounded-lg text-sm hover:bg-sage-300 transition-colors"
              >
                Switch Mode
              </button>
              <button
                onClick={completeSession}
                className="px-3 py-1 bg-purple-200 text-purple-800 rounded-lg text-sm hover:bg-purple-300 transition-colors"
              >
                Complete Session
              </button>
            </div>
          </div>
          
          {/* Session Insights */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <span>Modalities: {modalityHistory.length + (activeModality ? 1 : 0)}</span>
            <span>Switches: {creativeFlow.switches}</span>
            <span>Flow State: {creativeFlow.flowState}</span>
            {crossModalInsights.length > 0 && (
              <span>Patterns: {crossModalInsights.length}</span>
            )}
          </div>
        </div>
      )}

      {/* Modality Selector Overlay */}
      {showModalitySelector && sessionActive && (
        <div className="modality-selector mb-6 p-4 bg-white rounded-2xl shadow-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">
            Switch Creative Modality
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(CREATIVE_MODALITIES).map(([key, modality]) => (
              <button
                key={key}
                onClick={() => switchModality(key as keyof typeof CREATIVE_MODALITIES)}
                disabled={activeModality === key}
                className={`
                  p-3 rounded-xl text-center transition-all duration-200 border-2
                  ${activeModality === key 
                    ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                    : `bg-gradient-to-br ${modality.color} ${modality.borderColor} hover:scale-105 hover:shadow-md cursor-pointer`
                  }
                `}
              >
                <div className="text-2xl mb-1">{modality.icon}</div>
                <div className="text-xs font-medium text-gray-700">{modality.name}</div>
              </button>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <button
              onClick={() => setShowModalitySelector(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Creative Modality Interface */}
      {!sessionActive && !activeModality && (
        <div className="modality-welcome">
          {/* Mood-Based Recommendations */}
          {currentMood && (
            <div className="mood-recommendations mb-6 p-4 bg-gradient-to-r from-sage-100 to-green-100 rounded-2xl">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Recommended for {currentMood} energy:
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {moodSuggestions.slice(0, 3).map(suggestion => {
                  const modality = CREATIVE_MODALITIES[suggestion];
                  return (
                    <button
                      key={suggestion}
                      onClick={() => {
                        startCreativeSession();
                        switchModality(suggestion);
                      }}
                      className={`
                        p-4 rounded-xl text-center transition-all duration-200 border-2
                        bg-gradient-to-br ${modality.color} ${modality.borderColor} hover:scale-105 hover:shadow-md
                      `}
                    >
                      <div className="text-3xl mb-2">{modality.icon}</div>
                      <div className="text-sm font-medium text-gray-800">{modality.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{modality.when}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Simplified Modality Selection - Jony Ive Minimalism */}
          <div className="all-modalities">
            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              {Object.entries(CREATIVE_MODALITIES).map(([key, modality]) => (
                <button
                  key={key}
                  className={`
                    flex items-center gap-6 p-6 rounded-2xl border transition-all duration-300 cursor-pointer
                    bg-gradient-to-r ${modality.color} ${modality.borderColor} hover:scale-[1.02] hover:shadow-soft
                    focus:outline-none focus:ring-2 focus:ring-sage-400/30
                  `}
                  onClick={() => {
                    startCreativeSession();
                    switchModality(key as keyof typeof CREATIVE_MODALITIES);
                  }}
                >
                  <div className="text-3xl">{modality.icon}</div>
                  <div className="flex-1 text-left">
                    <h5 className="text-lg font-medium text-gray-800 mb-1">{modality.name}</h5>
                    <p className="text-sm text-gray-600 leading-relaxed">{modality.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Modality Component */}
      {sessionActive && activeModality && (
        <div className="active-modality-container">
          {activeModality === 'voice' && (
            <VoiceJournal
              onEntryComplete={(entry) => {
                // Handle voice entry completion
                console.log('Voice entry completed:', entry);
              }}
              className="mb-6"
            />
          )}
          
          {activeModality === 'art' && (
            <ArtCanvas
              onArtworkComplete={(artwork) => {
                // Handle artwork completion
                console.log('Artwork completed:', artwork);
              }}
              className="mb-6"
            />
          )}
          
          {activeModality === 'poetry' && (
            <PoetryLab
              onPoemComplete={(poem) => {
                // Handle poem completion
                console.log('Poem completed:', poem);
              }}
              className="mb-6"
            />
          )}
          
          {activeModality === 'music' && (
            <MusicTherapy
              onSessionComplete={(session) => {
                // Handle music session completion
                console.log('Music session completed:', session);
              }}
              className="mb-6"
            />
          )}
          
          {activeModality === 'movement' && (
            <MovementTherapy
              onSessionComplete={(session) => {
                // Handle movement session completion
                console.log('Movement session completed:', session);
              }}
              className="mb-6"
            />
          )}
        </div>
      )}

      {/* Cross-Modal Insights */}
      {crossModalInsights.length > 0 && sessionActive && (
        <div className="cross-modal-insights mt-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            ✨ Creative Pattern Recognition
          </h4>
          
          <div className="space-y-3">
            {crossModalInsights.slice(-2).map((insight, i) => (
              <div key={i} className="insight-card p-3 bg-white/60 rounded-lg">
                <div className="text-sm font-medium text-purple-800">{insight.pattern}</div>
                <div className="text-xs text-gray-600 mt-1">{insight.meaning}</div>
                <div className="text-xs italic text-purple-600 mt-1">{insight.therapeuticValue}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started Guide */}
      {!sessionActive && (
        <div className="getting-started mt-8 p-6 bg-gradient-to-br from-sage-50 to-green-50 rounded-2xl">
          <h4 className="text-lg font-medium text-gray-800 mb-4 text-center">
            How Multi-Modal Creative Healing Works
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="concept">
              <h5 className="text-sm font-medium text-gray-700 mb-2">🌈 Multiple Pathways</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Different emotions and experiences need different forms of expression. 
                You can start with one modality and flow naturally to others as your healing needs evolve.
              </p>
            </div>
            
            <div className="concept">
              <h5 className="text-sm font-medium text-gray-700 mb-2">🔄 Cross-Modal Integration</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our AI recognizes patterns across your creative expressions, helping you discover 
                deeper insights about your healing journey and emotional processing.
              </p>
            </div>
            
            <div className="concept">
              <h5 className="text-sm font-medium text-gray-700 mb-2">🎯 Mood-Guided Suggestions</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Based on your current emotional state, we suggest the most therapeutic 
                creative modalities to support your healing in this moment.
              </p>
            </div>
            
            <div className="concept">
              <h5 className="text-sm font-medium text-gray-700 mb-2">💎 Trauma-Informed Approach</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every creative tool is designed with trauma sensitivity, offering multiple 
                ways to process experiences safely at your own pace.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 italic">
              "Healing happens when we honor all the ways our hearts and bodies want to speak."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeExpressionHub;