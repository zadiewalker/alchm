'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RefreshCw, Compass, Heart, Brain, Sparkles } from 'lucide-react';

interface WritingPrompt {
  id: string;
  content: string;
  category: 'reflection' | 'exploration' | 'gratitude' | 'growth' | 'creativity' | 'healing';
  mood?: string[];
  archetype: 'sage' | 'coach' | 'poet';
  difficulty: 'gentle' | 'medium' | 'deep';
}

interface SmartWritingPromptsProps {
  mood?: string;
  recentEntries?: any[];
  onPromptSelect?: (prompt: string) => void;
}

const WRITING_PROMPTS: WritingPrompt[] = [
  // Sage Prompts - Wisdom & Understanding
  {
    id: 'sage-1',
    content: 'What ancient wisdom lives within your current experience that your ancestors might recognize?',
    category: 'reflection',
    mood: ['confused', 'overwhelmed', 'seeking'],
    archetype: 'sage',
    difficulty: 'deep'
  },
  {
    id: 'sage-2',
    content: 'If you could offer guidance to someone facing exactly what you\'re facing, what would you say?',
    category: 'exploration',
    mood: ['uncertain', 'lost'],
    archetype: 'sage',
    difficulty: 'medium'
  },
  {
    id: 'sage-3',
    content: 'What patterns in your life are asking to be understood rather than changed?',
    category: 'reflection',
    mood: ['frustrated', 'stuck'],
    archetype: 'sage',
    difficulty: 'deep'
  },

  // Coach Prompts - Empowerment & Action
  {
    id: 'coach-1',
    content: 'You\'ve overcome challenges before. What strengths did you use then that are available to you now?',
    category: 'growth',
    mood: ['discouraged', 'stuck', 'frustrated'],
    archetype: 'coach',
    difficulty: 'medium'
  },
  {
    id: 'coach-2',
    content: 'What would you attempt if you knew you had unlimited support and resources?',
    category: 'exploration',
    mood: ['hopeful', 'ambitious', 'energetic'],
    archetype: 'coach',
    difficulty: 'medium'
  },
  {
    id: 'coach-3',
    content: 'What small action could you take today that your future self would thank you for?',
    category: 'growth',
    mood: ['motivated', 'ready', 'determined'],
    archetype: 'coach',
    difficulty: 'gentle'
  },

  // Poet Prompts - Beauty & Expression
  {
    id: 'poet-1',
    content: 'If your current emotional state was a landscape, what would you see, hear, and feel there?',
    category: 'creativity',
    mood: ['emotional', 'sensitive', 'artistic'],
    archetype: 'poet',
    difficulty: 'medium'
  },
  {
    id: 'poet-2',
    content: 'What color is your heart today, and what story does that color want to tell?',
    category: 'creativity',
    mood: ['creative', 'expressive', 'introspective'],
    archetype: 'poet',
    difficulty: 'gentle'
  },
  {
    id: 'poet-3',
    content: 'Write a love letter to the part of yourself that needs the most tenderness right now.',
    category: 'healing',
    mood: ['hurt', 'sad', 'lonely', 'tender'],
    archetype: 'poet',
    difficulty: 'deep'
  },

  // Universal Prompts
  {
    id: 'universal-1',
    content: 'What are three things your body is grateful for today?',
    category: 'gratitude',
    archetype: 'coach',
    difficulty: 'gentle'
  },
  {
    id: 'universal-2',
    content: 'Describe a moment when you felt completely yourself. What made it special?',
    category: 'reflection',
    archetype: 'poet',
    difficulty: 'medium'
  },
  {
    id: 'universal-3',
    content: 'What permission do you need to give yourself today?',
    category: 'growth',
    archetype: 'sage',
    difficulty: 'medium'
  },
  {
    id: 'universal-4',
    content: 'If your journal could speak, what would it say about your growth journey?',
    category: 'reflection',
    archetype: 'sage',
    difficulty: 'deep'
  },
  {
    id: 'universal-5',
    content: 'What boundary would create more space for joy in your life?',
    category: 'exploration',
    archetype: 'coach',
    difficulty: 'medium'
  }
];

const CATEGORY_CONFIGS = {
  reflection: { icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  exploration: { icon: Compass, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  gratitude: { icon: Heart, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  growth: { icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  creativity: { icon: Lightbulb, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  healing: { icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20' }
};

export const SmartWritingPrompts: React.FC<SmartWritingPromptsProps> = ({
  mood,
  recentEntries = [],
  onPromptSelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Smart prompt selection based on mood and context
  const relevantPrompts = useMemo(() => {
    let filteredPrompts = [...WRITING_PROMPTS];

    // Filter by mood if provided
    if (mood && mood.trim()) {
      const moodLower = mood.toLowerCase();
      filteredPrompts = filteredPrompts.filter(prompt => 
        !prompt.mood || prompt.mood.some(m => moodLower.includes(m))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filteredPrompts = filteredPrompts.filter(prompt => 
        prompt.category === selectedCategory
      );
    }

    // If no mood-specific prompts, include universal ones
    if (filteredPrompts.length === 0) {
      filteredPrompts = WRITING_PROMPTS.filter(prompt => !prompt.mood);
    }

    // Shuffle and return top 6
    return filteredPrompts
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  }, [mood, selectedCategory, refreshKey]);

  const handlePromptSelect = (prompt: WritingPrompt) => {
    if (onPromptSelect) {
      const formattedPrompt = `📝 Writing Prompt: ${prompt.content}\n\n`;
      onPromptSelect(formattedPrompt);
    }
  };

  const refreshPrompts = () => {
    setRefreshKey(prev => prev + 1);
  };

  const categories = Object.keys(CATEGORY_CONFIGS);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
          <Lightbulb className="w-4 h-4" />
          <span>Writing Inspiration</span>
        </h4>
        <motion.button
          onClick={refreshPrompts}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RefreshCw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <motion.button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 text-xs rounded-full transition-all ${
            selectedCategory === 'all'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All
        </motion.button>
        {categories.map(category => {
          const config = CATEGORY_CONFIGS[category as keyof typeof CATEGORY_CONFIGS];
          return (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-xs rounded-full transition-all capitalize ${
                selectedCategory === category
                  ? `${config.bg} ${config.color}`
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          );
        })}
      </div>

      {/* Mood-based suggestion */}
      {mood && (
        <motion.div
          className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-indigo-700 dark:text-indigo-300">
            ✨ Prompts curated for your current emotional landscape: <span className="font-medium">{mood}</span>
          </p>
        </motion.div>
      )}

      {/* Prompts Grid */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {relevantPrompts.map((prompt, index) => {
            const config = CATEGORY_CONFIGS[prompt.category];
            const IconComponent = config.icon;

            return (
              <motion.div
                key={`${prompt.id}-${refreshKey}`}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button
                  onClick={() => handlePromptSelect(prompt)}
                  className={`w-full p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 ${config.bg} hover:shadow-md group-hover:scale-[1.02]`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                      <IconComponent className={`w-4 h-4 ${config.color}`} />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium capitalize ${config.color}`}>
                          {prompt.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {prompt.archetype}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            prompt.difficulty === 'gentle' ? 'bg-green-400' :
                            prompt.difficulty === 'medium' ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`} />
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {prompt.content}
                      </p>
                      
                      {prompt.mood && (
                        <div className="flex flex-wrap gap-1">
                          {prompt.mood.slice(0, 2).map((m, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-white/50 dark:bg-gray-700/50 rounded-full text-gray-600 dark:text-gray-400"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {relevantPrompts.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Lightbulb className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            No prompts found for current filters.
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-indigo-600 dark:text-indigo-400 text-sm mt-2 hover:underline"
          >
            Show all prompts
          </button>
        </div>
      )}

      {/* Gentle reminder */}
      <motion.div
        className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          💡 <strong>Gentle reminder:</strong> These prompts are invitations, not obligations. 
          Choose what resonates and modify as needed for your journey.
        </p>
      </motion.div>
    </div>
  );
};

export default SmartWritingPrompts;