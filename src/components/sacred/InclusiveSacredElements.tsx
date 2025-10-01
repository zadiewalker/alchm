/*
 * ALCHM Inclusive Sacred Elements
 * Spiritual design components that honor diverse traditions without appropriation
 * Universal symbols and practices that resonate across cultures
 */

import React, { useState, useEffect } from 'react';
import { CulturalText, CulturalHeading, SacredText } from '../cultural/CulturalTypography';
import { CulturalIcons } from '../cultural/CulturalIconSystem';

interface SacredSpaceProps {
  intention?: string;
  culturalContext?: 'secular' | 'spiritual-inclusive' | 'traditional';
  lang?: string;
  children: React.ReactNode;
  className?: string;
}

// Universal Sacred Space Container
export const SacredSpace: React.FC<SacredSpaceProps> = ({
  intention,
  culturalContext = 'spiritual-inclusive',
  lang = 'en',
  children,
  className = '',
}) => {
  return (
    <div className={`reflection-sanctuary ${className}`}>
      {intention && (
        <div className="intention-space mb-6">
          <SacredText
            lang={lang}
            intention="Sacred Intention"
            size="lg"
          >
            {intention}
          </SacredText>
        </div>
      )}
      
      <div className="sacred-content">
        {children}
      </div>
    </div>
  );
};

// Universal Gratitude Circle
interface GratitudeCircleProps {
  gratitudes: string[];
  onAddGratitude?: (gratitude: string) => void;
  lang?: string;
  culturalContext?: string;
  className?: string;
}

export const GratitudeCircle: React.FC<GratitudeCircleProps> = ({
  gratitudes,
  onAddGratitude,
  lang = 'en',
  culturalContext,
  className = '',
}) => {
  const [newGratitude, setNewGratitude] = useState('');

  const handleAdd = () => {
    if (newGratitude.trim()) {
      onAddGratitude?.(newGratitude.trim());
      setNewGratitude('');
    }
  };

  return (
    <div className={`gratitude-circle ${className}`}>
      <CulturalHeading
        lang={lang}
        level={3}
        size="lg"
        className="text-center mb-6"
      >
        Circle of Gratitude
      </CulturalHeading>
      
      <div className="gratitude-items">
        {gratitudes.map((gratitude, index) => (
          <div key={index} className="gratitude-item">
            {gratitude}
          </div>
        ))}
      </div>
      
      {onAddGratitude && (
        <div className="add-gratitude mt-4 flex gap-2">
          <input
            type="text"
            value={newGratitude}
            onChange={(e) => setNewGratitude(e.target.value)}
            placeholder="What are you grateful for today?"
            className="flex-1 p-3 rounded-lg border border-sage-300 focus:border-sage-500 focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-sage-400 text-white rounded-lg hover:bg-sage-500 transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

// Universal Breathing Space
interface BreathingSpaceProps {
  technique?: 'equal' | 'calm' | 'energize' | 'release';
  duration?: number; // in seconds
  onComplete?: () => void;
  lang?: string;
  className?: string;
}

export const BreathingSpace: React.FC<BreathingSpaceProps> = ({
  technique = 'calm',
  duration = 60,
  onComplete,
  lang = 'en',
  className = '',
}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [timeLeft, setTimeLeft] = useState(duration);

  const techniques = {
    equal: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    calm: { inhale: 4, hold: 7, exhale: 8, pause: 2 },
    energize: { inhale: 3, hold: 2, exhale: 3, pause: 1 },
    release: { inhale: 5, hold: 5, exhale: 10, pause: 3 },
  };

  const currentTechnique = techniques[technique];

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  useEffect(() => {
    if (!isActive) return;

    const cycleTime = Object.values(currentTechnique).reduce((a, b) => a + b, 0);
    let phaseTime = 0;

    const phaseInterval = setInterval(() => {
      phaseTime++;
      
      if (phaseTime <= currentTechnique.inhale) {
        setPhase('inhale');
      } else if (phaseTime <= currentTechnique.inhale + currentTechnique.hold) {
        setPhase('hold');
      } else if (phaseTime <= currentTechnique.inhale + currentTechnique.hold + currentTechnique.exhale) {
        setPhase('exhale');
      } else {
        setPhase('pause');
      }

      if (phaseTime >= cycleTime) {
        phaseTime = 0;
      }
    }, 1000);

    return () => clearInterval(phaseInterval);
  }, [isActive, currentTechnique]);

  const phaseInstructions = {
    inhale: 'Breathe in slowly',
    hold: 'Gently hold',
    exhale: 'Release and let go',
    pause: 'Rest in stillness',
  };

  const phaseColors = {
    inhale: 'from-water-clear to-sky-dawn',
    hold: 'from-sage-200 to-sage-300',
    exhale: 'from-blush-200 to-blush-300',
    pause: 'from-spirit-light to-sanctuary-white',
  };

  return (
    <SacredSpace
      intention="Breath as Sacred Practice"
      className={`breathing-space ${className}`}
    >
      <div className="text-center">
        <CulturalHeading
          lang={lang}
          level={3}
          size="xl"
          className="mb-6"
        >
          Sacred Breath
        </CulturalHeading>
        
        {/* Breathing Circle Visualization */}
        <div className="breathing-circle-container mb-8">
          <div
            className={`
              breathing-circle w-32 h-32 mx-auto rounded-full 
              bg-gradient-to-br ${phaseColors[phase]}
              transition-all duration-1000 ease-in-out
              ${isActive ? 'animate-breathing' : ''}
              ${phase === 'inhale' ? 'scale-110' : phase === 'exhale' ? 'scale-90' : 'scale-100'}
            `}
          >
            <div className="w-full h-full flex items-center justify-center">
              <CulturalIcons.Breath 
                size="xl" 
                color="sage" 
                className="opacity-60" 
              />
            </div>
          </div>
        </div>

        {/* Phase Instructions */}
        {isActive && (
          <div className="breathing-instructions mb-6">
            <SacredText
              lang={lang}
              size="xl"
              className="mb-2"
            >
              {phaseInstructions[phase]}
            </SacredText>
            
            <div className="text-sm opacity-70">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} remaining
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="breathing-controls">
          {!isActive ? (
            <button
              onClick={() => {
                setIsActive(true);
                setTimeLeft(duration);
              }}
              className="
                px-8 py-3 bg-gradient-to-r from-sage-400 to-terracotta-400 
                text-white rounded-lg font-medium hover:from-sage-500 hover:to-terracotta-500
                transition-all duration-300 transform hover:scale-105
              "
            >
              Begin Sacred Breath
            </button>
          ) : (
            <button
              onClick={() => setIsActive(false)}
              className="
                px-8 py-3 bg-gradient-to-r from-blush-400 to-sage-400
                text-white rounded-lg font-medium hover:from-blush-500 hover:to-sage-500
                transition-all duration-300
              "
            >
              Complete Practice
            </button>
          )}
        </div>

        {/* Technique Info */}
        <div className="technique-info mt-6 p-4 bg-sage-50 rounded-lg">
          <CulturalText
            lang={lang}
            variant="caption"
            className="text-sm text-sage-700"
          >
            <strong>{technique.charAt(0).toUpperCase() + technique.slice(1)} Breathing:</strong> 
            {' '}Inhale {currentTechnique.inhale}s, Hold {currentTechnique.hold}s, 
            Exhale {currentTechnique.exhale}s, Rest {currentTechnique.pause}s
          </CulturalText>
        </div>
      </div>
    </SacredSpace>
  );
};

// Universal Intention Setting
interface IntentionSetterProps {
  onSetIntention?: (intention: string, category: string) => void;
  suggestions?: { category: string; intentions: string[] }[];
  lang?: string;
  className?: string;
}

export const IntentionSetter: React.FC<IntentionSetterProps> = ({
  onSetIntention,
  suggestions = [],
  lang = 'en',
  className = '',
}) => {
  const [intention, setIntention] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');

  const defaultSuggestions = [
    {
      category: 'healing',
      intentions: [
        'I am open to gentle healing',
        'I release what no longer serves me',
        'I embrace my journey with compassion',
        'I trust in my inner wisdom',
      ],
    },
    {
      category: 'growth',
      intentions: [
        'I welcome new perspectives',
        'I am curious about my experiences',
        'I celebrate small victories',
        'I honor my progress',
      ],
    },
    {
      category: 'connection',
      intentions: [
        'I am open to meaningful connections',
        'I offer and receive support freely',
        'I honor diverse ways of being',
        'I contribute to collective healing',
      ],
    },
    {
      category: 'peace',
      intentions: [
        'I cultivate inner stillness',
        'I find balance in change',
        'I am present in this moment',
        'I release the need to control',
      ],
    },
  ];

  const allSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;

  const handleSetIntention = () => {
    if (intention.trim()) {
      onSetIntention?.(intention.trim(), selectedCategory);
      setIntention('');
    }
  };

  return (
    <SacredSpace
      intention="Setting Sacred Direction"
      className={`intention-setter ${className}`}
    >
      <CulturalHeading
        lang={lang}
        level={3}
        size="xl"
        className="text-center mb-6"
      >
        Sacred Intention
      </CulturalHeading>

      <div className="intention-form space-y-6">
        {/* Category Selection */}
        <div>
          <CulturalText
            lang={lang}
            variant="emphasis"
            size="sm"
            className="block mb-3"
          >
            Choose your focus
          </CulturalText>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {allSuggestions.map(({ category }) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  p-3 rounded-lg text-sm font-medium transition-all capitalize
                  ${selectedCategory === category
                    ? 'bg-sage-400 text-white'
                    : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Intention Input */}
        <div>
          <CulturalText
            lang={lang}
            variant="emphasis"
            size="sm"
            className="block mb-3"
          >
            Your sacred intention
          </CulturalText>
          
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="I intend to..."
            className="
              w-full p-4 rounded-lg border border-sage-300 focus:border-sage-500 
              focus:outline-none bg-sanctuary-white min-h-[100px] resize-none
              text-center font-light text-lg leading-relaxed
            "
          />
        </div>

        {/* Suggestions */}
        <div>
          <CulturalText
            lang={lang}
            variant="emphasis"
            size="sm"
            className="block mb-3"
          >
            Or choose from these inspirations
          </CulturalText>
          
          <div className="grid gap-2">
            {allSuggestions
              .find(s => s.category === selectedCategory)
              ?.intentions.map((suggest, index) => (
                <button
                  key={index}
                  onClick={() => setIntention(suggest)}
                  className="
                    p-3 text-left rounded-lg bg-blush-50 hover:bg-blush-100 
                    text-blush-800 transition-colors border border-blush-200
                  "
                >
                  {suggest}
                </button>
              ))}
          </div>
        </div>

        {/* Set Intention Button */}
        <div className="text-center">
          <button
            onClick={handleSetIntention}
            disabled={!intention.trim()}
            className="
              px-8 py-3 bg-gradient-to-r from-sage-400 via-terracotta-400 to-blush-400
              text-white rounded-lg font-medium transition-all duration-300
              transform hover:scale-105 disabled:opacity-50 disabled:transform-none
              disabled:cursor-not-allowed
            "
          >
            Set Sacred Intention
          </button>
        </div>
      </div>
    </SacredSpace>
  );
};

// Universal Wisdom Reflection
interface WisdomReflectionProps {
  questions: string[];
  onReflection?: (question: string, reflection: string) => void;
  lang?: string;
  className?: string;
}

export const WisdomReflection: React.FC<WisdomReflectionProps> = ({
  questions,
  onReflection,
  lang = 'en',
  className = '',
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [reflection, setReflection] = useState('');

  const handleNext = () => {
    if (reflection.trim() && onReflection) {
      onReflection(questions[currentQuestionIndex], reflection.trim());
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setReflection('');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SacredSpace
      intention="Deep Reflection and Wisdom"
      className={`wisdom-reflection ${className}`}
    >
      <div className="text-center mb-8">
        <CulturalHeading
          lang={lang}
          level={3}
          size="xl"
          className="mb-4"
        >
          Wisdom Reflection
        </CulturalHeading>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`
                w-3 h-3 rounded-full transition-all
                ${index <= currentQuestionIndex 
                  ? 'bg-sage-400' 
                  : 'bg-sage-200'
                }
              `}
            />
          ))}
        </div>
      </div>

      <div className="question-container mb-8">
        <SacredText
          lang={lang}
          size="lg"
          intention="Sacred Question"
          className="mb-6"
        >
          {currentQuestion}
        </SacredText>
        
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Allow your wisdom to flow..."
          className="
            w-full p-4 rounded-lg border border-sage-300 focus:border-sage-500
            focus:outline-none bg-sanctuary-white min-h-[150px] resize-none
            text-sage-800 leading-relaxed
          "
        />
      </div>

      <div className="reflection-controls text-center">
        <button
          onClick={handleNext}
          disabled={!reflection.trim()}
          className="
            px-8 py-3 bg-gradient-to-r from-sage-400 to-blush-400
            text-white rounded-lg font-medium transition-all duration-300
            transform hover:scale-105 disabled:opacity-50 disabled:transform-none
            disabled:cursor-not-allowed
          "
        >
          {currentQuestionIndex < questions.length - 1 ? 'Continue Reflection' : 'Complete Wisdom Journey'}
        </button>
      </div>
    </SacredSpace>
  );
};

// Universal Energy Visualization
interface EnergyVisualizationProps {
  energyType?: 'healing' | 'grounding' | 'protection' | 'growth';
  duration?: number;
  onComplete?: () => void;
  lang?: string;
  className?: string;
}

export const EnergyVisualization: React.FC<EnergyVisualizationProps> = ({
  energyType = 'healing',
  duration = 300, // 5 minutes
  onComplete,
  lang = 'en',
  className = '',
}) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);

  const energyConfigs = {
    healing: {
      color: 'from-sage-200 via-blush-200 to-terracotta-200',
      description: 'Gentle healing light flows through you',
      affirmation: 'I am surrounded by healing energy',
    },
    grounding: {
      color: 'from-terracotta-300 via-copper-glow to-grounding-earth',
      description: 'Earth energy rises through your roots',
      affirmation: 'I am connected to the strength of the earth',
    },
    protection: {
      color: 'from-sage-300 via-spirit-bridge to-sage-400',
      description: 'Protective light surrounds your being',
      affirmation: 'I am safe and protected in this space',
    },
    growth: {
      color: 'from-water-clear via-sage-200 to-gold-sun',
      description: 'Growth energy expands your potential',
      affirmation: 'I am open to infinite possibilities',
    },
  };

  const config = energyConfigs[energyType];

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  return (
    <SacredSpace
      intention="Energy Visualization Practice"
      className={`energy-visualization ${className}`}
    >
      <div className="text-center">
        <CulturalHeading
          lang={lang}
          level={3}
          size="xl"
          className="mb-6"
        >
          Sacred Energy Work
        </CulturalHeading>

        {/* Energy Visualization */}
        <div className="energy-container mb-8">
          <div
            className={`
              energy-field w-48 h-48 mx-auto rounded-full
              bg-gradient-radial ${config.color}
              transition-all duration-2000 ease-in-out
              ${isActive ? 'animate-gentle-pulse scale-110' : 'scale-100'}
            `}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <CulturalIcons.Growth 
                  size="xl" 
                  color="sage" 
                  className="mb-2 opacity-70" 
                />
                {isActive && (
                  <div className="text-sm opacity-80">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Guidance */}
        {isActive && (
          <div className="visualization-guidance mb-6">
            <SacredText
              lang={lang}
              size="lg"
              className="mb-4"
            >
              {config.description}
            </SacredText>
            
            <CulturalText
              lang={lang}
              variant="emphasis"
              className="italic text-sage-700"
            >
              "{config.affirmation}"
            </CulturalText>
          </div>
        )}

        {/* Controls */}
        <div className="visualization-controls">
          {!isActive ? (
            <button
              onClick={() => {
                setIsActive(true);
                setTimeLeft(duration);
              }}
              className="
                px-8 py-3 bg-gradient-to-r from-sage-400 to-terracotta-400
                text-white rounded-lg font-medium hover:from-sage-500 hover:to-terracotta-500
                transition-all duration-300 transform hover:scale-105
              "
            >
              Begin Energy Work
            </button>
          ) : (
            <button
              onClick={() => setIsActive(false)}
              className="
                px-8 py-3 bg-gradient-to-r from-blush-400 to-sage-400
                text-white rounded-lg font-medium hover:from-blush-500 hover:to-sage-500
                transition-all duration-300
              "
            >
              Complete Practice
            </button>
          )}
        </div>
      </div>
    </SacredSpace>
  );
};

export default {
  SacredSpace,
  GratitudeCircle,
  BreathingSpace,
  IntentionSetter,
  WisdomReflection,
  EnergyVisualization,
};