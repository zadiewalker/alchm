'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Intelligent prompt delivery system that adapts to user state and preferences

interface Prompt {
  id: string;
  type: 'gentle' | 'exploratory' | 'grounding' | 'celebration';
  category: 'reflection' | 'growth' | 'processing' | 'gratitude' | 'intention';
  text: string;
  followUp?: string;
  culturalContext?: string[];
  traumaInformed?: boolean;
  difficultyLevel: 1 | 2 | 3; // 1=gentle, 3=deep
  estimatedTime?: string;
  tags: string[];
}

interface UserState {
  mood?: string;
  energy?: string;
  timeAvailable?: string;
  recentTopic?: string;
  culturalBackground?: string[];
  preferredStyle?: string;
}

const INTELLIGENT_PROMPTS: Prompt[] = [
  // Gentle Entry Points
  {
    id: 'gentle-check-in',
    type: 'gentle',
    category: 'reflection',
    text: "How are you feeling right now? Just a simple check-in with yourself.",
    followUp: "What does your body need to feel more comfortable?",
    traumaInformed: true,
    difficultyLevel: 1,
    estimatedTime: "2-3 minutes",
    tags: ['check-in', 'present-moment', 'self-awareness']
  },
  {
    id: 'three-things',
    type: 'grounding',
    category: 'gratitude',
    text: "Name three things you can see, hear, or feel right now that bring you peace.",
    traumaInformed: true,
    difficultyLevel: 1,
    estimatedTime: "1-2 minutes",
    tags: ['grounding', '5-4-3-2-1', 'present-moment']
  },
  {
    id: 'small-victory',
    type: 'celebration',
    category: 'growth',
    text: "What's one small thing you accomplished today, no matter how tiny?",
    followUp: "How does it feel to acknowledge this achievement?",
    difficultyLevel: 1,
    estimatedTime: "3-5 minutes",
    tags: ['celebration', 'achievements', 'self-compassion']
  },

  // Exploratory Prompts
  {
    id: 'identity-exploration',
    type: 'exploratory',
    category: 'growth',
    text: "If you could introduce yourself to the world in any way you wanted, what would you say?",
    culturalContext: ['multicultural', 'identity-exploration'],
    difficultyLevel: 2,
    estimatedTime: "10-15 minutes",
    tags: ['identity', 'self-expression', 'authenticity']
  },
  {
    id: 'ancestor-wisdom',
    type: 'exploratory',
    category: 'reflection',
    text: "What wisdom from your ancestors (biological or chosen) guides you today?",
    culturalContext: ['ancestral-wisdom', 'cultural-heritage'],
    difficultyLevel: 2,
    estimatedTime: "8-12 minutes",
    tags: ['ancestors', 'wisdom', 'cultural-connection']
  },
  {
    id: 'boundary-reflection',
    type: 'exploratory',
    category: 'growth',
    text: "Think of a time when you successfully set a healthy boundary. What did that feel like?",
    traumaInformed: true,
    difficultyLevel: 2,
    estimatedTime: "8-10 minutes",
    tags: ['boundaries', 'self-advocacy', 'healing']
  },

  // Deep Processing
  {
    id: 'difficult-emotion',
    type: 'exploratory',
    category: 'processing',
    text: "What emotion have you been avoiding? Can you sit with it gently for a moment?",
    followUp: "Where do you feel this emotion in your body? What does it need?",
    traumaInformed: true,
    difficultyLevel: 3,
    estimatedTime: "15-20 minutes",
    tags: ['emotions', 'processing', 'somatic', 'difficult-feelings']
  },
  {
    id: 'healing-journey',
    type: 'exploratory',
    category: 'growth',
    text: "How has your healing journey changed the way you see yourself?",
    traumaInformed: true,
    difficultyLevel: 3,
    estimatedTime: "12-18 minutes",
    tags: ['healing', 'transformation', 'self-perception']
  }
];

const CULTURAL_PROMPT_ADAPTATIONS = {
  'indigenous': {
    grounding: "Connect with the land or your cultural teachings. What wisdom do they offer today?",
    ancestors: "What teachings from your elders speak to your heart right now?"
  },
  'african-diaspora': {
    community: "How does your community's strength live within you?",
    resilience: "What ancestral resilience flows through your veins?"
  },
  'latino': {
    family: "How do the values of your familia guide your choices?",
    celebration: "What brings you alegría (joy) today?"
  },
  'asian': {
    balance: "Where do you find harmony between different parts of your life?",
    honor: "How do you honor both tradition and your individual path?"
  }
};

export function IntelligentPromptSystem({
  userState,
  onPromptSelect,
  className = ''
}: {
  userState?: UserState;
  onPromptSelect: (prompt: Prompt) => void;
  className?: string;
}) {
  const [availablePrompts, setAvailablePrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>('all');

  useEffect(() => {
    const filteredPrompts = filterPromptsForUser(userState);
    setAvailablePrompts(filteredPrompts);
  }, [userState]);

  const filterPromptsForUser = (state?: UserState): Prompt[] => {
    let filtered = [...INTELLIGENT_PROMPTS];

    // Filter by mood and energy
    if (state?.mood === 'overwhelmed' || state?.energy === 'low') {
      filtered = filtered.filter(p => p.difficultyLevel <= 2 && p.traumaInformed);
    }

    // Filter by time available
    if (state?.timeAvailable === 'quick') {
      filtered = filtered.filter(p => p.estimatedTime?.includes('1-') || p.estimatedTime?.includes('2-'));
    }

    // Cultural context filtering
    if (state?.culturalBackground) {
      const culturallyRelevant = filtered.filter(p => 
        p.culturalContext?.some(context => 
          state.culturalBackground?.includes(context)
        )
      );
      if (culturallyRelevant.length > 0) {
        filtered = [...culturallyRelevant, ...filtered.filter(p => !p.culturalContext)];
      }
    }

    // Avoid recent topics
    if (state?.recentTopic) {
      filtered = filtered.filter(p => !p.tags.includes(state.recentTopic!));
    }

    return filtered.slice(0, 6); // Show max 6 options
  };

  const categories = [
    { id: 'all', label: 'All Prompts', icon: '✨' },
    { id: 'reflection', label: 'Reflection', icon: '🪞' },
    { id: 'growth', label: 'Growth', icon: '🌱' },
    { id: 'processing', label: 'Processing', icon: '🌊' },
    { id: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { id: 'intention', label: 'Intention', icon: '💎' }
  ];

  const displayedPrompts = currentCategory === 'all' 
    ? availablePrompts 
    : availablePrompts.filter(p => p.category === currentCategory);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setCurrentCategory(category.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentCategory === category.id
                ? 'bg-sage-400 text-white shadow-gentle'
                : 'bg-sage-50 text-sage-700 hover:bg-sage-100'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Prompt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {displayedPrompts.map((prompt, index) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              index={index}
              onSelect={() => setSelectedPrompt(prompt)}
              onPreview={() => {
                setSelectedPrompt(prompt);
                setShowPromptPreview(true);
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {displayedPrompts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-accent-bg flex items-center justify-center">
            <span className="text-2xl">🌸</span>
          </div>
          <h3 className="text-lg font-medium text-sanctuary-gray-700 mb-2">
            No prompts in this category yet
          </h3>
          <p className="text-sanctuary-gray-500">
            Try selecting "All Prompts" or a different category
          </p>
        </div>
      )}

      {/* Prompt Preview Modal */}
      <AnimatePresence>
        {showPromptPreview && selectedPrompt && (
          <PromptPreviewModal
            prompt={selectedPrompt}
            onSelect={() => {
              onPromptSelect(selectedPrompt);
              setShowPromptPreview(false);
            }}
            onClose={() => setShowPromptPreview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PromptCard({
  prompt,
  index,
  onSelect,
  onPreview
}: {
  prompt: Prompt;
  index: number;
  onSelect: () => void;
  onPreview: () => void;
}) {
  const typeColors = {
    gentle: 'border-sage-200 bg-sage-50/50',
    exploratory: 'border-calm-blue/30 bg-calm-blue/5',
    grounding: 'border-warm-amber/30 bg-warm-amber/5',
    celebration: 'border-gentle-rose/30 bg-gentle-rose/5'
  };

  const typeIcons = {
    gentle: '🕊️',
    exploratory: '🔍',
    grounding: '🌿',
    celebration: '🎉'
  };

  const difficultyLabels = {
    1: 'Gentle',
    2: 'Moderate', 
    3: 'Deep'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
      className={`sanctuary-card cursor-pointer group hover:shadow-soft transition-all ${typeColors[prompt.type]}`}
      onClick={onPreview}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcons[prompt.type]}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            prompt.traumaInformed 
              ? 'bg-sage-100 text-sage-600' 
              : 'bg-sanctuary-gray-100 text-sanctuary-gray-600'
          }`}>
            {difficultyLabels[prompt.difficultyLevel]}
          </span>
        </div>
        
        {prompt.estimatedTime && (
          <span className="text-xs text-sanctuary-gray-400">
            {prompt.estimatedTime}
          </span>
        )}
      </div>

      {/* Prompt Text */}
      <p className="text-sanctuary-gray-700 mb-4 line-clamp-3 leading-relaxed">
        {prompt.text}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {prompt.tags.slice(0, 3).map((tag) => (
          <span 
            key={tag}
            className="text-xs px-2 py-1 bg-sanctuary-gray-100 text-sanctuary-gray-600 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="flex-1 sage-primary safe-button text-sm py-2"
        >
          Start Writing
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className="px-3 py-2 border border-sanctuary-gray-200 rounded-lg hover:bg-sanctuary-gray-50 transition-colors"
          title="Preview prompt"
        >
          👁️
        </button>
      </div>
    </motion.div>
  );
}

function PromptPreviewModal({
  prompt,
  onSelect,
  onClose
}: {
  prompt: Prompt;
  onSelect: () => void;
  onClose: () => void;
}) {
  const typeIcons = {
    gentle: '🕊️',
    exploratory: '🔍', 
    grounding: '🌿',
    celebration: '🎉'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="sanctuary-card max-w-md mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-sage-accent-bg flex items-center justify-center">
            <span className="text-xl">{typeIcons[prompt.type]}</span>
          </div>
          <div>
            <h3 className="font-medium text-sanctuary-gray-800 capitalize">
              {prompt.type} Reflection
            </h3>
            <p className="text-sm text-sanctuary-gray-500">
              {prompt.category} • {prompt.estimatedTime}
            </p>
          </div>
        </div>

        {/* Prompt */}
        <div className="mb-6">
          <p className="text-lg text-sanctuary-gray-700 leading-relaxed mb-4">
            {prompt.text}
          </p>
          
          {prompt.followUp && (
            <div className="bg-sage-accent-bg rounded-lg p-3">
              <p className="text-sm text-sage-700">
                <strong>Follow-up:</strong> {prompt.followUp}
              </p>
            </div>
          )}
        </div>

        {/* Trauma-Informed Notice */}
        {prompt.traumaInformed && (
          <div className="bg-sage-50 border border-sage-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-sage-600">
              💚 This prompt is designed with trauma-informed care. 
              Take your time and stop anytime you need a break.
            </p>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-6">
          {prompt.tags.map((tag) => (
            <span 
              key={tag}
              className="text-xs px-2 py-1 bg-sanctuary-gray-100 text-sanctuary-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onSelect}
            className="flex-1 sage-primary safe-button"
          >
            Start Writing
          </button>
          <button
            onClick={onClose}
            className="flex-1 safe-button"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function QuickPromptSuggestion({
  userState,
  onPromptSelect,
  className = ''
}: {
  userState?: UserState;
  onPromptSelect: (prompt: Prompt) => void;
  className?: string;
}) {
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    // Select a prompt based on user state
    const filtered = INTELLIGENT_PROMPTS.filter(p => {
      if (userState?.mood === 'overwhelmed') return p.type === 'grounding' && p.difficultyLevel === 1;
      if (userState?.energy === 'high') return p.type === 'exploratory';
      return p.type === 'gentle' && p.difficultyLevel <= 2;
    });
    
    const randomPrompt = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentPrompt(randomPrompt);
  }, [userState]);

  if (!currentPrompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sanctuary-card bg-gradient-to-r from-sage-50 to-sage-100 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-sage-200 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">💭</span>
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-sage-600 mb-1">Gentle suggestion</p>
          <p className="text-sanctuary-gray-700 mb-3 leading-relaxed">
            {currentPrompt.text}
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => onPromptSelect(currentPrompt)}
              className="text-sm px-3 py-1 bg-sage-400 text-white rounded-lg hover:bg-sage-500 transition-colors"
            >
              Try this
            </button>
            <button
              onClick={() => setCurrentPrompt(
                INTELLIGENT_PROMPTS[Math.floor(Math.random() * INTELLIGENT_PROMPTS.length)]
              )}
              className="text-sm px-3 py-1 text-sage-600 hover:bg-sage-200 rounded-lg transition-colors"
            >
              Different one
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}