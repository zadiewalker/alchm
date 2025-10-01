'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useMoodContext, MoodType } from './MoodSelector';

interface SynestheticExperience {
  id: string;
  name: string;
  description: string;
  primarySense: 'visual' | 'auditory' | 'tactile' | 'olfactory' | 'gustatory';
  synestheticMappings: SenseMapping[];
  therapeuticPurpose: string;
  guidance: string[];
}

interface SenseMapping {
  trigger: string;
  targetSense: string;
  experience: string;
  intensity: number;
}

interface MultiSensorySession {
  id: string;
  experienceType: string;
  duration: number;
  sensoryInputs: SensoryInput[];
  synestheticResponses: SynestheticResponse[];
  mood?: MoodType;
  insights: string[];
  timestamp: Date;
}

interface SensoryInput {
  sense: string;
  stimulus: string;
  intensity: number;
  duration: number;
  timestamp: number;
}

interface SynestheticResponse {
  triggerSense: string;
  experiencedSense: string;
  description: string;
  emotionalResonance: number;
  memorability: number;
}

interface MultiSensoryExpressionHubProps {
  onSessionComplete?: (session: MultiSensorySession) => void;
  className?: string;
}

// Synesthetic experiences for healing
const SYNESTHETIC_EXPERIENCES: SynestheticExperience[] = [
  {
    id: 'color_sound_healing',
    name: 'Color-Sound Healing',
    description: 'Experience colors as sounds and sounds as colors for emotional processing',
    primarySense: 'visual',
    synestheticMappings: [
      { trigger: 'red', targetSense: 'auditory', experience: 'warm drum beats', intensity: 0.8 },
      { trigger: 'blue', targetSense: 'auditory', experience: 'flowing water sounds', intensity: 0.6 },
      { trigger: 'green', targetSense: 'auditory', experience: 'gentle wind chimes', intensity: 0.5 },
      { trigger: 'yellow', targetSense: 'auditory', experience: 'light piano notes', intensity: 0.7 },
      { trigger: 'purple', targetSense: 'auditory', experience: 'deep singing bowls', intensity: 0.9 }
    ],
    therapeuticPurpose: 'Emotional color association and sound healing integration',
    guidance: [
      'Select colors that represent your current emotional state',
      'Listen to the associated sounds with full attention',
      'Notice what new colors emerge as you listen',
      'Allow the color-sound relationship to shift your inner landscape'
    ]
  },
  {
    id: 'texture_emotion_mapping',
    name: 'Texture-Emotion Mapping',
    description: 'Explore emotions through tactile sensations and textures',
    primarySense: 'tactile',
    synestheticMappings: [
      { trigger: 'rough texture', targetSense: 'emotional', experience: 'processing difficult experiences', intensity: 0.7 },
      { trigger: 'smooth texture', targetSense: 'emotional', experience: 'calm acceptance', intensity: 0.5 },
      { trigger: 'warm surface', targetSense: 'emotional', experience: 'self-compassion', intensity: 0.8 },
      { trigger: 'cool surface', targetSense: 'emotional', experience: 'clarity and perspective', intensity: 0.6 },
      { trigger: 'soft texture', targetSense: 'emotional', experience: 'tenderness and care', intensity: 0.9 }
    ],
    therapeuticPurpose: 'Embodied emotional processing through tactile awareness',
    guidance: [
      'Find various textured objects around you',
      'Touch each texture mindfully for 30 seconds',
      'Notice what emotions or memories arise',
      'Allow the texture to guide your emotional exploration'
    ]
  },
  {
    id: 'scent_memory_journey',
    name: 'Scent Memory Journey',
    description: 'Use aromatherapy to unlock and process emotional memories',
    primarySense: 'olfactory',
    synestheticMappings: [
      { trigger: 'lavender', targetSense: 'visual', experience: 'purple fields of calm', intensity: 0.6 },
      { trigger: 'citrus', targetSense: 'visual', experience: 'bright yellow energy', intensity: 0.8 },
      { trigger: 'eucalyptus', targetSense: 'tactile', experience: 'cooling breath sensations', intensity: 0.7 },
      { trigger: 'vanilla', targetSense: 'emotional', experience: 'warm childhood comfort', intensity: 0.9 },
      { trigger: 'peppermint', targetSense: 'visual', experience: 'sharp green focus', intensity: 0.8 }
    ],
    therapeuticPurpose: 'Memory integration and emotional healing through scent',
    guidance: [
      'Choose scents that feel meaningful or healing',
      'Breathe deeply and notice what arises',
      'Follow any memories or emotions that surface',
      'Honor whatever comes up without judgment'
    ]
  },
  {
    id: 'taste_metaphor_exploration',
    name: 'Taste Metaphor Exploration',
    description: 'Explore life experiences through taste metaphors and sensations',
    primarySense: 'gustatory',
    synestheticMappings: [
      { trigger: 'sweet taste', targetSense: 'emotional', experience: 'love and appreciation', intensity: 0.8 },
      { trigger: 'bitter taste', targetSense: 'emotional', experience: 'life lessons and growth', intensity: 0.7 },
      { trigger: 'sour taste', targetSense: 'emotional', experience: 'surprise and adaptation', intensity: 0.6 },
      { trigger: 'salty taste', targetSense: 'emotional', experience: 'tears and cleansing', intensity: 0.8 },
      { trigger: 'umami taste', targetSense: 'emotional', experience: 'depth and satisfaction', intensity: 0.9 }
    ],
    therapeuticPurpose: 'Metaphorical processing of life experiences through taste',
    guidance: [
      'Think of a current life experience',
      'What would it taste like?',
      'Explore that taste (literally or imaginatively)',
      'Notice how the taste connects to your emotions'
    ]
  },
  {
    id: 'vibrational_color_therapy',
    name: 'Vibrational Color Therapy',
    description: 'Feel colors as vibrations and vibrations as colors',
    primarySense: 'tactile',
    synestheticMappings: [
      { trigger: 'low vibration', targetSense: 'visual', experience: 'deep red grounding', intensity: 0.8 },
      { trigger: 'medium vibration', targetSense: 'visual', experience: 'green heart opening', intensity: 0.7 },
      { trigger: 'high vibration', targetSense: 'visual', experience: 'violet spiritual connection', intensity: 0.9 },
      { trigger: 'pulsing vibration', targetSense: 'visual', experience: 'golden healing energy', intensity: 0.8 },
      { trigger: 'gentle vibration', targetSense: 'visual', experience: 'soft blue peace', intensity: 0.6 }
    ],
    therapeuticPurpose: 'Chakra balancing through vibrational-color synesthesia',
    guidance: [
      'Place hands on different parts of your body',
      'Notice any vibrations or energy you feel',
      'Visualize colors associated with those sensations',
      'Breathe the colors into your body'
    ]
  },
  {
    id: 'soundscape_landscape_journey',
    name: 'Soundscape Landscape Journey',
    description: 'Transform sounds into visual landscapes for emotional exploration',
    primarySense: 'auditory',
    synestheticMappings: [
      { trigger: 'ocean sounds', targetSense: 'visual', experience: 'vast blue horizons', intensity: 0.7 },
      { trigger: 'forest sounds', targetSense: 'visual', experience: 'green cathedral space', intensity: 0.8 },
      { trigger: 'city sounds', targetSense: 'visual', experience: 'gray geometric patterns', intensity: 0.6 },
      { trigger: 'rain sounds', targetSense: 'tactile', experience: 'gentle cleansing touch', intensity: 0.7 },
      { trigger: 'wind sounds', targetSense: 'visual', experience: 'flowing movement and change', intensity: 0.8 }
    ],
    therapeuticPurpose: 'Environmental connection and emotional landscape exploration',
    guidance: [
      'Choose nature or ambient sounds',
      'Close your eyes and listen deeply',
      'Let visual landscapes emerge in your mind',
      'Explore the emotional territory of these landscapes'
    ]
  }
];

// Sensory stimuli organized by type
const SENSORY_STIMULI = {
  visual: [
    { name: 'Warm Colors', description: 'Reds, oranges, yellows for energy', intensity: 0.8 },
    { name: 'Cool Colors', description: 'Blues, greens, purples for calm', intensity: 0.6 },
    { name: 'Flowing Patterns', description: 'Organic, water-like movements', intensity: 0.5 },
    { name: 'Geometric Patterns', description: 'Structured, precise shapes', intensity: 0.7 },
    { name: 'Natural Imagery', description: 'Landscapes, plants, sky', intensity: 0.6 }
  ],
  auditory: [
    { name: 'Nature Sounds', description: 'Ocean, rain, forest ambience', intensity: 0.6 },
    { name: 'Harmonic Tones', description: 'Pure frequency combinations', intensity: 0.8 },
    { name: 'Rhythmic Patterns', description: 'Heartbeat, drumming, pulse', intensity: 0.7 },
    { name: 'Melodic Flow', description: 'Gentle musical progressions', intensity: 0.5 },
    { name: 'White Noise', description: 'Consistent background static', intensity: 0.4 }
  ],
  tactile: [
    { name: 'Temperature Variation', description: 'Warm and cool sensations', intensity: 0.7 },
    { name: 'Texture Exploration', description: 'Rough, smooth, soft surfaces', intensity: 0.8 },
    { name: 'Pressure Points', description: 'Gentle touch and release', intensity: 0.6 },
    { name: 'Vibration Therapy', description: 'Subtle energetic pulsing', intensity: 0.7 },
    { name: 'Air Movement', description: 'Gentle breeze sensations', intensity: 0.5 }
  ]
};

const MultiSensoryExpressionHub: React.FC<MultiSensoryExpressionHubProps> = ({
  onSessionComplete,
  className = ''
}) => {
  const [activeExperience, setActiveExperience] = useState<SynestheticExperience | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [sensoryInputs, setSensoryInputs] = useState<SensoryInput[]>([]);
  const [synestheticResponses, setSynestheticResponses] = useState<SynestheticResponse[]>([]);
  const [selectedStimuli, setSelectedStimuli] = useState<{ [key: string]: any }>({});
  const [intensitySettings, setIntensitySettings] = useState({
    visual: 0.7,
    auditory: 0.6,
    tactile: 0.5
  });

  const { currentMood, getMoodData } = useMoodContext();

  // Filter experiences by mood appropriateness
  const moodAppropriateExperiences = useMemo(() => {
    if (!currentMood) return SYNESTHETIC_EXPERIENCES;
    
    // All experiences can be healing in different ways
    return SYNESTHETIC_EXPERIENCES;
  }, [currentMood]);

  // Start synesthetic session
  const startSession = useCallback((experience: SynestheticExperience) => {
    setActiveExperience(experience);
    setIsSessionActive(true);
    setSessionDuration(0);
    setCurrentStep(0);
    setSensoryInputs([]);
    setSynestheticResponses([]);
    
    // Start timer
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Record sensory input
  const recordSensoryInput = useCallback((sense: string, stimulus: string, intensity: number) => {
    const input: SensoryInput = {
      sense,
      stimulus,
      intensity,
      duration: 0, // Will be calculated when input ends
      timestamp: Date.now()
    };
    
    setSensoryInputs(prev => [...prev, input]);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(Math.round(intensity * 50));
    }
  }, []);

  // Record synesthetic response
  const recordSynestheticResponse = useCallback((
    triggerSense: string, 
    experiencedSense: string, 
    description: string,
    emotionalResonance: number,
    memorability: number
  ) => {
    const response: SynestheticResponse = {
      triggerSense,
      experiencedSense,
      description,
      emotionalResonance,
      memorability
    };
    
    setSynestheticResponses(prev => [...prev, response]);
  }, []);

  // Complete session
  const completeSession = useCallback(() => {
    if (!activeExperience || sessionDuration < 60) return;
    
    const session: MultiSensorySession = {
      id: Date.now().toString(),
      experienceType: activeExperience.id,
      duration: sessionDuration,
      sensoryInputs,
      synestheticResponses,
      mood: currentMood || undefined,
      insights: generateSessionInsights(),
      timestamp: new Date()
    };
    
    // Save to localStorage
    const savedSessions = JSON.parse(localStorage.getItem('alchm_multisensory_sessions') || '[]');
    savedSessions.push(session);
    localStorage.setItem('alchm_multisensory_sessions', JSON.stringify(savedSessions));
    
    onSessionComplete?.(session);
    
    // Reset session
    setActiveExperience(null);
    setIsSessionActive(false);
    setSessionDuration(0);
    setCurrentStep(0);
    setSensoryInputs([]);
    setSynestheticResponses([]);
    
    // Success feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }, [activeExperience, sessionDuration, sensoryInputs, synestheticResponses, currentMood, onSessionComplete]);

  // Generate session insights
  const generateSessionInsights = useCallback(() => {
    const insights = [];
    
    if (synestheticResponses.length > 0) {
      const avgEmotionalResonance = synestheticResponses.reduce((sum, r) => sum + r.emotionalResonance, 0) / synestheticResponses.length;
      
      if (avgEmotionalResonance > 0.7) {
        insights.push('Strong synesthetic connections activated deep emotional processing');
      } else if (avgEmotionalResonance > 0.4) {
        insights.push('Gentle cross-sensory experiences supported emotional exploration');
      } else {
        insights.push('Subtle synesthetic awareness began developing new neural pathways');
      }
    }
    
    if (sessionDuration > 300) {
      insights.push('Extended multi-sensory practice deepened embodied awareness');
    } else if (sessionDuration > 120) {
      insights.push('Focused sensory exploration created meaningful healing moments');
    }
    
    const uniqueSenses = new Set(sensoryInputs.map(i => i.sense)).size;
    if (uniqueSenses >= 3) {
      insights.push('Multi-modal sensory integration expanded healing possibilities');
    }
    
    if (currentMood) {
      insights.push(`Synesthetic practice honored your ${currentMood} energy through embodied exploration`);
    }
    
    return insights;
  }, [synestheticResponses, sessionDuration, sensoryInputs, currentMood]);

  // Format time
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className={`multisensory-hub ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Multi-Sensory Expression Hub
        </h3>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          Explore healing through synesthetic experiences that connect multiple senses for deeper emotional processing
        </p>
      </div>

      {/* Experience Selection */}
      {!activeExperience && (
        <div className="experience-selection">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Synesthetic Journey</h4>
          
          <div className="experiences-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moodAppropriateExperiences.map(experience => (
              <div
                key={experience.id}
                className="experience-card p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border-2 border-teal-200 hover:border-teal-300 transition-all duration-200 cursor-pointer hover:shadow-lg"
                onClick={() => startSession(experience)}
              >
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">
                    {experience.primarySense === 'visual' ? '👁️' :
                     experience.primarySense === 'auditory' ? '👂' :
                     experience.primarySense === 'tactile' ? '✋' :
                     experience.primarySense === 'olfactory' ? '👃' : '👅'}
                  </div>
                  <h5 className="text-lg font-semibold text-gray-800 mb-2">{experience.name}</h5>
                  <p className="text-sm text-gray-600 mb-3">{experience.description}</p>
                </div>
                
                <div className="therapeutic-purpose mb-4">
                  <div className="text-xs text-teal-700 font-medium mb-1">Therapeutic Purpose:</div>
                  <div className="text-xs text-gray-700">{experience.therapeuticPurpose}</div>
                </div>
                
                <div className="mappings-preview">
                  <div className="text-xs text-gray-600 mb-2">Sample Cross-Sensory Connections:</div>
                  <div className="space-y-1">
                    {experience.synestheticMappings.slice(0, 2).map((mapping, i) => (
                      <div key={i} className="text-xs text-gray-700 bg-white/60 px-2 py-1 rounded">
                        <span className="font-medium">{mapping.trigger}</span> → <span className="italic">{mapping.experience}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Session */}
      {activeExperience && isSessionActive && (
        <div className="active-session bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h4 className="text-2xl font-semibold text-gray-800 mb-2">{activeExperience.name}</h4>
            <p className="text-gray-600 mb-4">{activeExperience.description}</p>
            
            {/* Session Timer */}
            <div className="session-timer mb-6">
              <div className="text-3xl font-light text-teal-600 mb-2">{formatTime(sessionDuration)}</div>
              <div className="text-sm text-gray-500">Synesthetic exploration time</div>
            </div>
          </div>

          {/* Guidance Steps */}
          <div className="guidance-section mb-8">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold text-gray-800">Step {currentStep + 1} of {activeExperience.guidance.length}</h5>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(activeExperience.guidance.length - 1, currentStep + 1))}
                  disabled={currentStep === activeExperience.guidance.length - 1}
                  className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm hover:bg-teal-200 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
            
            <div className="guidance-card p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
              <p className="text-gray-800 leading-relaxed">{activeExperience.guidance[currentStep]}</p>
            </div>
          </div>

          {/* Cross-Sensory Mappings */}
          <div className="mappings-interactive mb-8">
            <h5 className="text-lg font-semibold text-gray-800 mb-4">Explore Cross-Sensory Connections</h5>
            
            <div className="mappings-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeExperience.synestheticMappings.map((mapping, i) => (
                <button
                  key={i}
                  onClick={() => {
                    recordSensoryInput(activeExperience.primarySense, mapping.trigger, mapping.intensity);
                    recordSynestheticResponse(
                      activeExperience.primarySense,
                      mapping.targetSense,
                      mapping.experience,
                      0.5 + Math.random() * 0.4,
                      0.6 + Math.random() * 0.4
                    );
                  }}
                  className="mapping-card p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-800">{mapping.trigger}</div>
                    <div className="text-xs text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                      {Math.round(mapping.intensity * 100)}%
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">↓</div>
                  <div className="text-sm italic text-gray-700">{mapping.experience}</div>
                  <div className="text-xs text-gray-500 mt-2 capitalize">
                    {mapping.targetSense} experience
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Session Progress */}
          {synestheticResponses.length > 0 && (
            <div className="session-progress mb-8">
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Your Synesthetic Journey</h5>
              <div className="progress-summary p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xl font-semibold text-purple-600">{sensoryInputs.length}</div>
                    <div className="text-xs text-gray-600">Sensory Inputs</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-blue-600">{synestheticResponses.length}</div>
                    <div className="text-xs text-gray-600">Cross-Connections</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-teal-600">
                      {Math.round((synestheticResponses.reduce((sum, r) => sum + r.emotionalResonance, 0) / synestheticResponses.length) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600">Emotional Resonance</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-cyan-600">
                      {new Set(sensoryInputs.map(i => i.sense)).size}
                    </div>
                    <div className="text-xs text-gray-600">Senses Activated</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Session Controls */}
          <div className="session-controls flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setIsSessionActive(false);
                setActiveExperience(null);
              }}
              className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              End Session
            </button>
            
            {sessionDuration >= 60 && (
              <button
                onClick={completeSession}
                className="px-8 py-3 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition-colors font-medium"
              >
                Complete & Save Experience
              </button>
            )}
          </div>
        </div>
      )}

      {/* Getting Started Guide */}
      {!activeExperience && (
        <div className="getting-started mt-12 p-8 bg-gradient-to-br from-sage-50 to-green-50 rounded-3xl">
          <h4 className="text-xl font-semibold text-gray-800 text-center mb-6">
            Understanding Multi-Sensory Healing
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="concept text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h5 className="font-semibold text-gray-800 mb-2">Neuroplasticity</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Cross-sensory experiences create new neural pathways, expanding your capacity for emotional processing and healing.
              </p>
            </div>
            
            <div className="concept text-center">
              <div className="text-4xl mb-3">🌈</div>
              <h5 className="font-semibold text-gray-800 mb-2">Synesthesia</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                When one sense triggers another, it creates rich, multi-dimensional experiences that can unlock new forms of self-understanding.
              </p>
            </div>
            
            <div className="concept text-center">
              <div className="text-4xl mb-3">💫</div>
              <h5 className="font-semibold text-gray-800 mb-2">Integration</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Multi-sensory practices help integrate fragmented experiences, creating wholeness and coherence in your healing journey.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 italic max-w-2xl mx-auto leading-relaxed">
              "When we engage multiple senses in healing, we honor the full spectrum of human experience and create pathways for transformation that words alone cannot reach."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSensoryExpressionHub;