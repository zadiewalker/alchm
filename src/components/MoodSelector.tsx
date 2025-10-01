// ALCHM Modern Mood Selector
// Contemporary emotional intelligence meets authentic user expression

'use client';

import React, { useState, useEffect } from 'react';

interface ModernMood {
  id: string;
  emoji: string;
  name: string;
  description: string;
  color: string;
  colorLight: string;
  colorRgb: string;
  bgGradient: string;
}

interface MoodSelectorProps {
  selectedMood?: string | null;
  onMoodSelect: (mood: string | null, intensity?: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIntensity?: boolean;
  variant?: 'grid' | 'minimal';
  value?: string;
  onChange?: (mood: string, intensity?: number) => void;
  showRecentMoods?: boolean;
  enableHapticFeedback?: boolean;
}

export function MoodSelector({ 
  selectedMood,
  onMoodSelect,
  value,
  onChange,
  disabled = false, 
  size = 'md',
  showIntensity = true,
  variant = 'grid',
  showRecentMoods = true,
  enableHapticFeedback = true
}: MoodSelectorProps) {
  
  // Support both interfaces for backward compatibility
  const currentValue = selectedMood ?? value;
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<number>(5);
  const [recentMoods, setRecentMoods] = useState<string[]>([]);
  const [showDescription, setShowDescription] = useState(false);

  // Modern mood states - sophisticated emotional vocabulary
  const modernMoods: ModernMood[] = [
    {
      id: 'overwhelmed',
      emoji: '🌊',
      name: 'Overwhelmed',
      description: 'Feeling like there\'s too much happening',
      color: '#2C5F73',
      colorLight: '#4A7A8A',
      colorRgb: '44, 95, 115',
      bgGradient: 'linear-gradient(135deg, #2C5F73 0%, #4A7A8A 100%)'
    },
    {
      id: 'restless',
      emoji: '⚡',
      name: 'Restless',
      description: 'Energy with nowhere to go',
      color: '#F39C12',
      colorLight: '#F5B041',
      colorRgb: '243, 156, 18',
      bgGradient: 'linear-gradient(135deg, #F39C12 0%, #F5B041 100%)'
    },
    {
      id: 'disconnected',
      emoji: '🌫️',
      name: 'Disconnected',
      description: 'Present but not really here',
      color: '#95A5A6',
      colorLight: '#B2BABB',
      colorRgb: '149, 165, 166',
      bgGradient: 'linear-gradient(135deg, #95A5A6 0%, #B2BABB 100%)'
    },
    {
      id: 'hopeful',
      emoji: '🌱',
      name: 'Hopeful',
      description: 'Seeing possibilities ahead',
      color: '#27AE60',
      colorLight: '#52C882',
      colorRgb: '39, 174, 96',
      bgGradient: 'linear-gradient(135deg, #27AE60 0%, #52C882 100%)'
    },
    {
      id: 'passionate',
      emoji: '🔥',
      name: 'Passionate',
      description: 'Feeling alive and engaged',
      color: '#E74C3C',
      colorLight: '#EC7063',
      colorRgb: '231, 76, 60',
      bgGradient: 'linear-gradient(135deg, #E74C3C 0%, #EC7063 100%)'
    },
    {
      id: 'content',
      emoji: '🌸',
      name: 'Content',
      description: 'Peaceful and satisfied',
      color: '#F8C2C1',
      colorLight: '#FAD7D6',
      colorRgb: '248, 194, 193',
      bgGradient: 'linear-gradient(135deg, #F8C2C1 0%, #FAD7D6 100%)'
    },
    {
      id: 'inspired',
      emoji: '✨',
      name: 'Inspired',
      description: 'Creative energy is flowing',
      color: '#F1C40F',
      colorLight: '#F4D03F',
      colorRgb: '241, 196, 15',
      bgGradient: 'linear-gradient(135deg, #F1C40F 0%, #F4D03F 100%)'
    },
    {
      id: 'reflective',
      emoji: '🌙',
      name: 'Reflective',
      description: 'In a thoughtful, introspective mood',
      color: '#8E44AD',
      colorLight: '#AF7AC5',
      colorRgb: '142, 68, 173',
      bgGradient: 'linear-gradient(135deg, #8E44AD 0%, #AF7AC5 100%)'
    }
  ];

  // Handle mood selection with haptic feedback
  const handleMoodSelection = (moodId: string) => {
    if (disabled) return;
    
    // Haptic feedback (trauma-informed)
    if (enableHapticFeedback) {
      import('@/lib/client-safe-apis').then(({ safeHapticFeedback }) => {
        safeHapticFeedback('gentle');
      });
    }
    
    // Update recent moods
    if (showRecentMoods) {
      setRecentMoods(prev => {
        const filtered = prev.filter(id => id !== moodId);
        return [moodId, ...filtered].slice(0, 3);
      });
    }

    // Call callbacks
    if (onMoodSelect) {
      onMoodSelect(moodId, selectedIntensity);
    }
    if (onChange) {
      onChange(moodId, selectedIntensity);
    }
  };

  // Smart default suggestions based on time of day
  const getTimeBasedSuggestions = (): string[] => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 6) {
      return ['reflective', 'disconnected', 'content'];
    }
    if (hour >= 6 && hour <= 12) {
      return ['hopeful', 'inspired', 'restless'];
    }
    if (hour >= 12 && hour <= 17) {
      return ['passionate', 'overwhelmed', 'content'];
    }
    return ['reflective', 'content', 'hopeful'];
  };

  const selectedMoodData = modernMoods.find(mood => mood.id === currentValue);
  const hoveredMoodData = hoveredMood ? modernMoods.find(mood => mood.id === hoveredMood) : null;
  
  // Load recent moods from safe storage
  useEffect(() => {
    if (!showRecentMoods) return;
    
    import('@/lib/client-safe-apis').then(({ safeStorage }) => {
      const stored = safeStorage.get('alchm-recent-moods');
      if (stored) {
        try {
          setRecentMoods(JSON.parse(stored));
        } catch (e) {
          console.warn('Failed to parse recent moods from storage');
        }
      }
    });
  }, [showRecentMoods]);

  // Save recent moods to safe storage
  useEffect(() => {
    if (showRecentMoods && recentMoods.length > 0) {
      import('@/lib/client-safe-apis').then(({ safeStorage }) => {
        safeStorage.set('alchm-recent-moods', JSON.stringify(recentMoods));
      });
    }
  }, [recentMoods, showRecentMoods]);

  // Minimal variant for compact spaces
  if (variant === 'minimal') {
    return (
      <div className="flex gap-2 justify-center flex-wrap">
        {modernMoods.map((mood) => {
          const isSelected = currentValue === mood.id;
          const isHovered = hoveredMood === mood.id;
          
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodSelection(mood.id)}
              onMouseEnter={() => !disabled && setHoveredMood(mood.id)}
              onMouseLeave={() => setHoveredMood(null)}
              disabled={disabled}
              className={`
                w-10 h-10 rounded-full border-2 transition-all duration-300 ease-in-out
                flex items-center justify-center text-lg
                ${
                  isSelected || isHovered
                    ? 'transform scale-110 shadow-lg'
                    : 'hover:scale-105'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
              style={{
                backgroundColor: isSelected || isHovered ? mood.color : 'transparent',
                borderColor: mood.color,
                boxShadow: isSelected ? `0 0 20px rgba(${mood.colorRgb}, 0.4)` : 'none'
              }}
              title={`${mood.name}: ${mood.description}`}
              aria-label={`${mood.name}: ${mood.description}`}
            >
              <span className={isSelected || isHovered ? 'text-white' : ''}>
                {mood.emoji}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Main grid-based interface
  return (
    <div className="space-y-6">
      {/* Recent moods indicator */}
      {showRecentMoods && recentMoods.length > 0 && (
        <div className="text-center">
          <p className="text-xs text-sanctuary-gray-400 mb-2">Recently selected</p>
          <div className="flex gap-2 justify-center">
            {recentMoods.map((moodId, index) => {
              const mood = modernMoods.find(m => m.id === moodId);
              if (!mood) return null;
              return (
                <div
                  key={`recent-${moodId}-${index}`}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-50"
                  style={{ backgroundColor: mood.colorLight }}
                  title={`Recently: ${mood.name}`}
                >
                  {mood.emoji}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main mood grid */}
      <div className="mood-grid grid grid-cols-2 gap-3">
        {modernMoods.map((mood) => {
          const isSelected = currentValue === mood.id;
          const isHovered = hoveredMood === mood.id;
          const isTimeRecommended = getTimeBasedSuggestions().includes(mood.id);
          
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodSelection(mood.id)}
              onMouseEnter={() => {
                if (!disabled) {
                  setHoveredMood(mood.id);
                  setShowDescription(true);
                }
              }}
              onMouseLeave={() => {
                setHoveredMood(null);
                setShowDescription(false);
              }}
              disabled={disabled}
              className={`
                mood-tile relative flex flex-col items-center justify-center
                h-16 rounded-xl cursor-pointer transition-all duration-400 ease-in-out
                border-2 overflow-hidden group
                ${
                  isSelected
                    ? 'transform scale-105 shadow-xl'
                    : isHovered
                    ? 'transform -translate-y-0.5 shadow-lg'
                    : 'hover:shadow-md'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
              style={{
                background: isSelected || isHovered ? mood.bgGradient : `linear-gradient(135deg, ${mood.color}20, ${mood.colorLight}20)`,
                borderColor: isSelected ? mood.color : isHovered ? mood.colorLight : 'transparent',
                boxShadow: isSelected ? `0 0 20px rgba(${mood.colorRgb}, 0.4)` : undefined
              }}
              aria-label={`Select mood: ${mood.name} - ${mood.description}`}
            >
              {/* Time-based suggestion indicator */}
              {isTimeRecommended && !isSelected && (
                <div 
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: mood.color }}
                  title="Suggested based on time of day"
                />
              )}

              {/* Emoji */}
              <div className="text-2xl mb-1 transition-transform duration-200 group-hover:scale-110">
                {mood.emoji}
              </div>
              
              {/* Mood name */}
              <div 
                className={`text-sm font-semibold text-center transition-colors duration-200 ${
                  isSelected || isHovered ? 'text-white' : 'text-sanctuary-gray-700'
                }`}
              >
                {mood.name}
              </div>
              
              {/* Description on hover */}
              <div 
                className={`absolute inset-x-0 bottom-0 p-2 text-xs text-center transition-all duration-300 ${
                  (isHovered || isSelected) && showDescription 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
                style={{ 
                  color: isSelected || isHovered ? 'white' : mood.color,
                  backgroundColor: isSelected || isHovered ? 'rgba(0,0,0,0.2)' : 'transparent'
                }}
              >
                {mood.description}
              </div>

              {/* Selection pulse animation */}
              {isSelected && (
                <div 
                  className="absolute inset-0 rounded-xl animate-ping opacity-30"
                  style={{ backgroundColor: mood.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Intensity slider (shown when mood is selected) */}
      {showIntensity && currentValue && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-sanctuary-gray-700">
              Intensity
            </label>
            <span className="text-sm text-sanctuary-gray-500">
              {selectedIntensity}/10
            </span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="1"
              max="10"
              value={selectedIntensity}
              onChange={(e) => setSelectedIntensity(parseInt(e.target.value))}
              disabled={disabled}
              className={`
                w-full h-2 rounded-lg appearance-none cursor-pointer
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              style={{
                background: selectedMoodData 
                  ? `linear-gradient(to right, ${selectedMoodData.colorLight} 0%, ${selectedMoodData.color} 100%)`
                  : '#e5e7eb'
              }}
            />
            <div 
              className="absolute top-0 h-2 rounded-lg pointer-events-none transition-all duration-300"
              style={{
                width: `${(selectedIntensity / 10) * 100}%`,
                backgroundColor: selectedMoodData?.color || '#6b7280'
              }}
            />
          </div>
        </div>
      )}

      {/* Selected mood insight */}
      {(selectedMoodData || hoveredMoodData) && (
        <div className="text-center space-y-2 animate-fade-in">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white shadow-md"
            style={{ 
              backgroundColor: (hoveredMoodData || selectedMoodData)?.color,
              boxShadow: `0 4px 12px rgba(${(hoveredMoodData || selectedMoodData)?.colorRgb}, 0.3)`
            }}
          >
            <span className="text-lg">{(hoveredMoodData || selectedMoodData)?.emoji}</span>
            <span>{(hoveredMoodData || selectedMoodData)?.name}</span>
          </div>
          <p className="text-xs text-sanctuary-gray-500 max-w-xs mx-auto leading-relaxed">
            {(hoveredMoodData || selectedMoodData)?.description}
          </p>
        </div>
      )}

      {/* Custom mood option */}
      <div className="text-center">
        <button
          disabled={disabled}
          className={`
            text-xs text-sanctuary-gray-400 hover:text-sage-600 transition-colors duration-200
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={() => {
            // Future: Open custom mood creator modal
            alert('Custom mood creation coming soon! 🎨');
          }}
        >
          + Create custom mood
        </button>
      </div>
    </div>
  );
}