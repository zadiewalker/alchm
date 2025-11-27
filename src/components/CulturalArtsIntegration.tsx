'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useMoodContext, MoodType } from './MoodSelector';

interface CulturalTradition {
  id: string;
  name: string;
  culture: string;
  region: string;
  description: string;
  healingPurpose: string;
  practiceType: 'movement' | 'sound' | 'visual' | 'ritual' | 'storytelling' | 'breathwork';
  elements: CulturalElement[];
  guidance: string[];
  respectfulPractice: string[];
  modernAdaptation: string;
}

interface CulturalElement {
  name: string;
  meaning: string;
  practice: string;
  significance: string;
}

interface CulturalSession {
  id: string;
  traditionId: string;
  duration: number;
  elements: string[];
  reflections: string[];
  culturalInsights: string[];
  mood?: MoodType;
  respectfulAdaptations: string[];
  timestamp: Date;
}

interface CulturalArtsIntegrationProps {
  onPreferenceUpdate?: (preferences: any) => void;
  culturalPreferences?: any;
  className?: string;
}

// Cultural healing traditions from around the world
const CULTURAL_TRADITIONS: CulturalTradition[] = [
  {
    id: 'indigenous_nature_connection',
    name: 'Nature Connection Ceremony',
    culture: 'Pan-Indigenous Wisdom',
    region: 'Global Indigenous Communities',
    description: 'Connection with natural elements for grounding and spiritual healing',
    healingPurpose: 'Restoring harmony with earth, self, and community',
    practiceType: 'ritual',
    elements: [
      { name: 'Four Directions', meaning: 'Honoring all perspectives and balance', practice: 'Face each direction with intention', significance: 'Wholeness and orientation' },
      { name: 'Gratitude to Earth', meaning: 'Acknowledging our connection to Mother Earth', practice: 'Express gratitude to land and ancestors', significance: 'Humility and connection' },
      { name: 'Sacred Breath', meaning: 'Breath as life force and spirit', practice: 'Mindful breathing with nature sounds', significance: 'Life force and presence' },
      { name: 'Circle of Sharing', meaning: 'Community and witnessing', practice: 'Share reflections in sacred circle', significance: 'Belonging and witness' }
    ],
    guidance: [
      'Find a quiet outdoor space or imagine being in nature',
      'Take time to feel your connection to the earth beneath you',
      'Honor the wisdom of indigenous peoples who originated these practices',
      'Approach with respect, humility, and genuine desire to learn'
    ],
    respectfulPractice: [
      'Acknowledge the indigenous origins of these practices',
      'Practice with humility and respect, not appropriation',
      'Support indigenous communities and causes',
      'Understand these are simplified adaptations, not traditional ceremonies'
    ],
    modernAdaptation: 'Mindful connection with nature for grounding and perspective, adapted respectfully from indigenous wisdom traditions'
  },
  {
    id: 'japanese_forest_bathing',
    name: 'Shinrin-yoku (Forest Bathing)',
    culture: 'Japanese',
    region: 'Japan',
    description: 'Immersive mindful presence with trees and forest energy',
    healingPurpose: 'Reducing stress, connecting with nature\'s healing power',
    practiceType: 'movement',
    elements: [
      { name: 'Mindful Walking', meaning: 'Slow, contemplative movement', practice: 'Walk slowly, feeling each step', significance: 'Present moment awareness' },
      { name: 'Tree Connection', meaning: 'Communion with tree spirits', practice: 'Sit with or touch trees mindfully', significance: 'Natural wisdom and strength' },
      { name: 'Sensory Opening', meaning: 'Full sensory forest immersion', practice: 'Open all senses to forest life', significance: 'Complete presence' },
      { name: 'Breathing Together', meaning: 'Exchanging breath with forest', practice: 'Conscious breathing with trees', significance: 'Interconnection and life force' }
    ],
    guidance: [
      'Move slowly and mindfully through natural spaces',
      'Let go of goals and simply be present with nature',
      'Notice the subtle communications from trees and plants',
      'Allow the forest\'s calm energy to restore your nervous system'
    ],
    respectfulPractice: [
      'Honor Japanese cultural wisdom in developing this practice',
      'Practice with genuine reverence for nature',
      'Learn about the cultural context of forest bathing',
      'Respect natural spaces and leave no trace'
    ],
    modernAdaptation: 'Adapted mindfulness practice that can be done in any natural setting, from forests to parks to gardens'
  },
  {
    id: 'sufi_whirling_meditation',
    name: 'Meditative Turning (Sema)',
    culture: 'Sufi/Islamic Mysticism',
    region: 'Middle East, Turkey',
    description: 'Spinning meditation for spiritual transcendence and divine connection',
    healingPurpose: 'Releasing ego, finding divine connection, emotional purification',
    practiceType: 'movement',
    elements: [
      { name: 'Centered Spinning', meaning: 'Turning around heart center', practice: 'Slow, centered rotating movement', significance: 'Unity and divine connection' },
      { name: 'Sacred Intention', meaning: 'Remembrance of the Divine', practice: 'Hold sacred intention while turning', significance: 'Spiritual focus and devotion' },
      { name: 'Breath Coordination', meaning: 'Breath as prayer', practice: 'Coordinate breath with movement', significance: 'Life force and presence' },
      { name: 'Inner Surrender', meaning: 'Releasing ego and control', practice: 'Let go into the movement', significance: 'Surrender and trust' }
    ],
    guidance: [
      'Start slowly and build up duration gradually',
      'Focus on your heart center as the axis of turning',
      'Approach with reverence for the sacred tradition',
      'Stop if you feel dizzy and rest mindfully'
    ],
    respectfulPractice: [
      'Honor the sacred Islamic mystical tradition of Sufism',
      'Practice with spiritual intention, not as mere exercise',
      'Learn about Sufi philosophy and Rumi\'s teachings',
      'Understand this is adapted practice, not traditional Sema ceremony'
    ],
    modernAdaptation: 'Gentle turning meditation adapted for personal spiritual practice and emotional release'
  },
  {
    id: 'african_rhythmic_healing',
    name: 'Rhythmic Healing Circle',
    culture: 'West African Traditions',
    region: 'West Africa',
    description: 'Drumming and rhythmic movement for community healing',
    healingPurpose: 'Community connection, emotional release, ancestral wisdom',
    practiceType: 'sound',
    elements: [
      { name: 'Ancestral Rhythms', meaning: 'Connection to ancestral wisdom', practice: 'Create or listen to healing rhythms', significance: 'Cultural memory and strength' },
      { name: 'Call and Response', meaning: 'Community dialogue through sound', practice: 'Alternate between leading and following', significance: 'Communication and connection' },
      { name: 'Body Movement', meaning: 'Letting rhythm move through body', practice: 'Allow natural movement to emerge', significance: 'Embodied expression and freedom' },
      { name: 'Healing Circle', meaning: 'Community support and witness', practice: 'Share rhythm and movement together', significance: 'Belonging and collective healing' }
    ],
    guidance: [
      'Use simple percussion instruments or improvise with household items',
      'Let rhythm emerge naturally rather than forcing patterns',
      'Honor the communal aspect even when practicing alone',
      'Focus on healing and connection rather than performance'
    ],
    respectfulPractice: [
      'Acknowledge West African origins of healing drum practices',
      'Approach with respect for African cultural wisdom',
      'Support African communities and musicians',
      'Understand these rhythms carry sacred cultural meaning'
    ],
    modernAdaptation: 'Adapted rhythmic practice for personal healing and community connection, honoring African musical traditions'
  },
  {
    id: 'tibetan_singing_bowls',
    name: 'Sound Healing with Singing Bowls',
    culture: 'Tibetan Buddhist',
    region: 'Tibet, Himalayan Region',
    description: 'Sacred sound vibrations for meditation and healing',
    healingPurpose: 'Chakra balancing, meditation, nervous system calming',
    practiceType: 'sound',
    elements: [
      { name: 'Sacred Tones', meaning: 'Vibrational healing frequencies', practice: 'Listen to or create bowl sounds', significance: 'Harmonic healing and balance' },
      { name: 'Meditation Support', meaning: 'Sound as meditation anchor', practice: 'Use sound to deepen meditation', significance: 'Mindfulness and presence' },
      { name: 'Chakra Attunement', meaning: 'Balancing energy centers', practice: 'Focus sound on different body areas', significance: 'Energetic harmony' },
      { name: 'Compassionate Intention', meaning: 'Healing with loving-kindness', practice: 'Set intention of compassion', significance: 'Heart-centered healing' }
    ],
    guidance: [
      'Use singing bowls, recordings, or even humming as alternatives',
      'Focus on the vibrations you feel in your body',
      'Set intentions of healing and compassion',
      'Practice in a quiet, respectful space'
    ],
    respectfulPractice: [
      'Honor Tibetan Buddhist spiritual traditions',
      'Approach with reverence for sacred sound practices',
      'Learn about Buddhist philosophy of compassion',
      'Support Tibetan culture and causes when possible'
    ],
    modernAdaptation: 'Accessible sound healing practice using various instruments or recordings for meditation and nervous system regulation'
  },
  {
    id: 'mayan_breathwork_ceremony',
    name: 'Sacred Breathwork Journey',
    culture: 'Mayan Traditions',
    region: 'Central America',
    description: 'Ceremonial breathing for spiritual cleansing and vision',
    healingPurpose: 'Spiritual cleansing, accessing inner wisdom, emotional release',
    practiceType: 'breathwork',
    elements: [
      { name: 'Four Breath Directions', meaning: 'Honoring four sacred directions', practice: 'Breathe toward each direction', significance: 'Balance and orientation' },
      { name: 'Serpent Breath', meaning: 'Kundalini-like energy awakening', practice: 'Undulating breath through spine', significance: 'Life force activation' },
      { name: 'Vision Breathing', meaning: 'Breathing for inner sight', practice: 'Breath to access inner wisdom', significance: 'Intuition and guidance' },
      { name: 'Gratitude Release', meaning: 'Breathing out offerings of thanks', practice: 'Exhale gratitude to ancestors', significance: 'Connection and reverence' }
    ],
    guidance: [
      'Create sacred space with respect for Mayan wisdom',
      'Approach breathwork gently and with intention',
      'Honor the connection to earth and ancestors',
      'Practice in a safe, comfortable environment'
    ],
    respectfulPractice: [
      'Honor Mayan spiritual wisdom and cosmology',
      'Practice with reverence for indigenous knowledge',
      'Support Mayan communities and cultural preservation',
      'Understand this is adapted practice, not traditional ceremony'
    ],
    modernAdaptation: 'Respectfully adapted breathwork practice for personal healing and spiritual connection'
  },
  {
    id: 'hindu_mantra_meditation',
    name: 'Healing Mantra Practice',
    culture: 'Hindu/Sanskrit Tradition',
    region: 'Indian Subcontinent',
    description: 'Sacred sound repetition for mental purification and peace',
    healingPurpose: 'Mental clarity, emotional balance, spiritual connection',
    practiceType: 'sound',
    elements: [
      { name: 'Om Chanting', meaning: 'Universal sound of creation', practice: 'Chant Om with intention', significance: 'Unity and cosmic connection' },
      { name: 'Healing Mantras', meaning: 'Specific sounds for healing', practice: 'Repeat mantras for wellbeing', significance: 'Focused healing intention' },
      { name: 'Breath Integration', meaning: 'Mantra synchronized with breath', practice: 'Coordinate mantra with breathing', significance: 'Life force harmony' },
      { name: 'Heart-Centered Practice', meaning: 'Chanting from heart space', practice: 'Feel mantras in heart center', significance: 'Love and devotion' }
    ],
    guidance: [
      'Start with simple mantras like "Om" or "So Hum"',
      'Focus on the vibration and feeling rather than pronunciation',
      'Practice with devotion and respect for the tradition',
      'Allow the sounds to naturally calm your mind'
    ],
    respectfulPractice: [
      'Honor the Sanskrit language and Hindu traditions',
      'Learn about the meaning and origin of mantras',
      'Practice with genuine spiritual intention',
      'Support Sanskrit preservation and Hindu cultural understanding'
    ],
    modernAdaptation: 'Accessible mantra practice using traditional Sanskrit sounds or adapted healing phrases for meditation and wellbeing'
  }
];

const CulturalArtsIntegration: React.FC<CulturalArtsIntegrationProps> = ({
  onPreferenceUpdate,
  culturalPreferences,
  className = ''
}) => {
  const [selectedTradition, setSelectedTradition] = useState<CulturalTradition | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [practiceReflections, setPracticeReflections] = useState<string[]>([]);
  const [culturalInsights, setCulturalInsights] = useState<string[]>([]);
  const [respectfulAdaptations, setRespectfulAdaptations] = useState<string[]>([]);
  const [culturalAwareness, setCulturalAwareness] = useState({
    understanding: 0,
    respect: 0,
    appreciation: 0
  });

  const { currentMood, getMoodData } = useMoodContext();

  // Filter traditions by mood and cultural sensitivity
  const availableTraditions = useMemo(() => {
    return CULTURAL_TRADITIONS.filter(tradition => {
      // All traditions can be healing in different ways
      return true;
    });
  }, []);

  // Start cultural practice session
  const startSession = useCallback((tradition: CulturalTradition) => {
    setSelectedTradition(tradition);
    setIsSessionActive(true);
    setSessionDuration(0);
    setCurrentStep(0);
    setPracticeReflections([]);
    setCulturalInsights([]);
    setRespectfulAdaptations([]);

    // Start timer
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Record practice reflection
  const recordReflection = useCallback((reflection: string) => {
    setPracticeReflections(prev => [...prev, reflection]);
  }, []);

  // Record cultural insight
  const recordCulturalInsight = useCallback((insight: string) => {
    setCulturalInsights(prev => [...prev, insight]);
  }, []);

  // Complete session
  const completeSession = useCallback(() => {
    if (!selectedTradition || sessionDuration < 60) return;

    const session: CulturalSession = {
      id: Date.now().toString(),
      traditionId: selectedTradition.id,
      duration: sessionDuration,
      elements: selectedTradition.elements.map(e => e.name),
      reflections: practiceReflections,
      culturalInsights,
      respectfulAdaptations,
      mood: currentMood || undefined,
      timestamp: new Date()
    };

    // Update cultural awareness
    setCulturalAwareness(prev => ({
      understanding: Math.min(100, prev.understanding + 5),
      respect: Math.min(100, prev.respect + 3),
      appreciation: Math.min(100, prev.appreciation + 4)
    }));

    // Save to localStorage
    const savedSessions = JSON.parse(localStorage.getItem('alchm_cultural_sessions') || '[]');
    savedSessions.push(session);
    localStorage.setItem('alchm_cultural_sessions', JSON.stringify(savedSessions));

    // Update preferences
    const updatedPreferences = {
      ...culturalPreferences,
      practicedTraditions: [...(culturalPreferences?.practicedTraditions || []), selectedTradition.id],
      culturalAwareness
    };
    onPreferenceUpdate?.(updatedPreferences);

    // Reset session
    setSelectedTradition(null);
    setIsSessionActive(false);
    setSessionDuration(0);
    setCurrentStep(0);
    setPracticeReflections([]);
    setCulturalInsights([]);
    setRespectfulAdaptations([]);

    // Success feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }, [selectedTradition, sessionDuration, practiceReflections, culturalInsights, respectfulAdaptations, currentMood, culturalPreferences, onPreferenceUpdate, culturalAwareness]);

  // Format time
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Cultural awareness quiz responses
  const culturalAwarenessPrompts = [
    {
      question: "What does practicing this tradition mean to you?",
      placeholder: "Reflect on your personal connection and intention..."
    },
    {
      question: "How can you honor the culture this practice comes from?",
      placeholder: "Think about respect, appreciation, and support..."
    },
    {
      question: "What did you learn about this cultural wisdom?",
      placeholder: "Share insights about the tradition and its origins..."
    }
  ];

  return (
    <div className={`cultural-arts-integration ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-medium text-gray-800 mb-3">
          Cultural Arts Integration
        </h3>
        <p className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Explore healing wisdom from cultures around the world with deep respect, 
          humility, and commitment to honoring indigenous knowledge and traditional practices.
        </p>
      </div>

      {/* Cultural Awareness Notice */}
      <div className="cultural-notice mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🌍</div>
          <div>
            <h4 className="text-lg font-medium text-amber-800 mb-2">Cultural Respect & Awareness</h4>
            <p className="text-sm text-amber-700 mb-3 leading-relaxed">
              These practices are simplified, respectful adaptations of sacred cultural traditions. 
              We approach them with humility, acknowledging their origins, and commit to supporting 
              the communities from which they come.
            </p>
            <div className="text-xs text-amber-600">
              <strong>Our commitment:</strong> Honor origins • Support communities • Practice with respect • Continue learning
            </div>
          </div>
        </div>
      </div>

      {/* Tradition Selection */}
      {!selectedTradition && (
        <div className="tradition-selection">
          <h4 className="text-xl font-medium text-gray-800 mb-6">Choose a Cultural Healing Tradition</h4>
          
          <div className="traditions-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTraditions.map(tradition => (
              <div
                key={tradition.id}
                className="tradition-card p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => startSession(tradition)}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">
                    {tradition.practiceType === 'movement' ? '💃' :
                     tradition.practiceType === 'sound' ? '🎵' :
                     tradition.practiceType === 'visual' ? '🎨' :
                     tradition.practiceType === 'ritual' ? '🕯️' :
                     tradition.practiceType === 'storytelling' ? '📚' : '🫁'}
                  </div>
                  <h5 className="text-lg font-medium text-gray-800 mb-2">{tradition.name}</h5>
                  <div className="text-sm text-amber-700 font-medium mb-2">
                    {tradition.culture} • {tradition.region}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{tradition.description}</p>
                </div>
                
                <div className="healing-purpose mb-4 p-3 bg-sage-50 rounded-lg">
                  <div className="text-xs text-sage-700 font-medium mb-1">Healing Purpose:</div>
                  <div className="text-xs text-gray-700">{tradition.healingPurpose}</div>
                </div>
                
                <div className="elements-preview">
                  <div className="text-xs text-gray-600 mb-2">Key Elements:</div>
                  <div className="space-y-1">
                    {tradition.elements.slice(0, 3).map((element, i) => (
                      <div key={i} className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded">
                        <span className="font-medium">{element.name}</span>: {element.meaning}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="modern-adaptation mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-700 font-medium mb-1">Respectful Adaptation:</div>
                  <div className="text-xs text-gray-700">{tradition.modernAdaptation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Session */}
      {selectedTradition && isSessionActive && (
        <div className="active-session bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h4 className="text-2xl font-medium text-gray-800 mb-2">{selectedTradition.name}</h4>
            <div className="text-sm text-amber-700 font-medium mb-3">
              {selectedTradition.culture} • {selectedTradition.region}
            </div>
            <p className="text-gray-600 mb-6">{selectedTradition.description}</p>
            
            {/* Session Timer */}
            <div className="session-timer mb-6">
              <div className="text-3xl font-light text-amber-600 mb-2">{formatTime(sessionDuration)}</div>
              <div className="text-sm text-gray-500">Cultural practice time</div>
            </div>
          </div>

          {/* Respectful Practice Guidelines */}
          <div className="respectful-guidelines mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
            <h5 className="text-lg font-medium text-red-800 mb-4">🙏 Respectful Practice Guidelines</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTradition.respectfulPractice.map((guideline, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="text-red-600 mt-1">•</div>
                  <div className="text-sm text-red-700">{guideline}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Guidance */}
          <div className="practice-guidance mb-8">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-medium text-gray-800">
                Guidance Step {currentStep + 1} of {selectedTradition.guidance.length}
              </h5>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(selectedTradition.guidance.length - 1, currentStep + 1))}
                  disabled={currentStep === selectedTradition.guidance.length - 1}
                  className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm hover:bg-amber-200 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
            
            <div className="guidance-card p-6 bg-gradient-to-r from-sage-50 to-green-50 rounded-xl">
              <p className="text-gray-800 leading-relaxed">{selectedTradition.guidance[currentStep]}</p>
            </div>
          </div>

          {/* Cultural Elements Explorer */}
          <div className="elements-explorer mb-8">
            <h5 className="text-lg font-medium text-gray-800 mb-4">Explore Cultural Elements</h5>
            
            <div className="elements-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTradition.elements.map((element, i) => (
                <div key={i} className="element-card p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <h6 className="font-medium text-gray-800 mb-2">{element.name}</h6>
                  <p className="text-sm text-gray-700 mb-2"><strong>Meaning:</strong> {element.meaning}</p>
                  <p className="text-sm text-gray-700 mb-2"><strong>Practice:</strong> {element.practice}</p>
                  <p className="text-xs text-orange-700"><strong>Significance:</strong> {element.significance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Awareness Reflection */}
          <div className="cultural-reflection mb-8">
            <h5 className="text-lg font-medium text-gray-800 mb-4">Cultural Awareness Reflection</h5>
            
            <div className="space-y-4">
              {culturalAwarenessPrompts.map((prompt, i) => (
                <div key={i} className="reflection-prompt">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {prompt.question}
                  </label>
                  <textarea
                    placeholder={prompt.placeholder}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                    rows={3}
                    onChange={(e) => {
                      if (i === 0) recordReflection(e.target.value);
                      else if (i === 1) setRespectfulAdaptations([e.target.value]);
                      else recordCulturalInsight(e.target.value);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Session Controls */}
          <div className="session-controls flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setIsSessionActive(false);
                setSelectedTradition(null);
              }}
              className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              End Session
            </button>
            
            {sessionDuration >= 180 && (
              <button
                onClick={completeSession}
                className="px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
              >
                Complete & Honor Practice
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cultural Learning Resources */}
      {!selectedTradition && (
        <div className="learning-resources mt-12 p-8 bg-gradient-to-br from-sage-50 to-green-50 rounded-3xl">
          <h4 className="text-xl font-medium text-gray-800 text-center mb-6">
            Principles of Respectful Cultural Practice
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="principle text-center">
              <div className="text-4xl mb-3">🙏</div>
              <h5 className="font-medium text-gray-800 mb-2">Humility</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Approach with genuine respect and acknowledgment that we are guests to these traditions.
              </p>
            </div>
            
            <div className="principle text-center">
              <div className="text-4xl mb-3">📚</div>
              <h5 className="font-medium text-gray-800 mb-2">Learning</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Commit to ongoing education about the cultures and contexts of these practices.
              </p>
            </div>
            
            <div className="principle text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h5 className="font-medium text-gray-800 mb-2">Support</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Actively support the communities and causes of the cultures we learn from.
              </p>
            </div>
            
            <div className="principle text-center">
              <div className="text-4xl mb-3">💝</div>
              <h5 className="font-medium text-gray-800 mb-2">Gratitude</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Express genuine appreciation for the wisdom and healing these traditions offer.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 italic max-w-3xl mx-auto leading-relaxed">
              "True healing through cultural wisdom requires not appropriation, but appreciation—a humble recognition that we are students of traditions far greater than ourselves, committed to honoring their origins while allowing their healing gifts to support our growth."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalArtsIntegration;