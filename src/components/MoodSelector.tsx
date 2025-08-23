// Mood Selector Component - Intuitive mood tracking with visual feedback
// Part of ALCHM's trauma-informed user experience

'use client';

import React, { useState } from 'react';

interface MoodSelectorProps {
  value: number;
  onChange: (mood: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function MoodSelector({ 
  value, 
  onChange, 
  disabled = false, 
  size = 'md',
  showLabels = true 
}: MoodSelectorProps) {
  const [hoveredMood, setHoveredMood] = useState<number | null>(null);

  const moods = [
    { value: 1, emoji: '😢', label: 'Terrible', color: 'text-red-400', bgColor: 'bg-red-500' },
    { value: 2, emoji: '😞', label: 'Bad', color: 'text-red-300', bgColor: 'bg-red-400' },
    { value: 3, emoji: '😐', label: 'Okay', color: 'text-yellow-400', bgColor: 'bg-yellow-500' },
    { value: 4, emoji: '😊', label: 'Good', color: 'text-green-300', bgColor: 'bg-green-400' },
    { value: 5, emoji: '🙂', label: 'Neutral', color: 'text-gray-400', bgColor: 'bg-gray-500' },
    { value: 6, emoji: '😌', label: 'Fine', color: 'text-blue-300', bgColor: 'bg-blue-400' },
    { value: 7, emoji: '😃', label: 'Happy', color: 'text-green-400', bgColor: 'bg-green-500' },
    { value: 8, emoji: '😄', label: 'Great', color: 'text-green-500', bgColor: 'bg-green-600' },
    { value: 9, emoji: '🤗', label: 'Amazing', color: 'text-purple-400', bgColor: 'bg-purple-500' },
    { value: 10, emoji: '✨', label: 'Excellent', color: 'text-yellow-300', bgColor: 'bg-yellow-400' }
  ];

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8 text-sm';
      case 'lg': return 'w-16 h-16 text-2xl';
      default: return 'w-12 h-12 text-lg';
    }
  };

  const currentMood = moods.find(m => m.value === (hoveredMood || value));
  const displayMood = hoveredMood || value;

  return (
    <div className="space-y-4">
      {/* Current mood display */}
      <div className="text-center">
        <div className={`mx-auto ${getSizeClasses()} flex items-center justify-center rounded-full transition-all duration-200 ${currentMood?.bgColor || 'bg-gray-500'}`}>
          <span className="text-white font-bold">
            {currentMood?.emoji || '🙂'}
          </span>
        </div>
        {showLabels && (
          <div className="mt-2">
            <p className={`font-medium ${currentMood?.color || 'text-gray-400'}`}>
              {currentMood?.label || 'Neutral'}
            </p>
            <p className="text-sm text-gray-500">
              {displayMood}/10
            </p>
          </div>
        )}
      </div>

      {/* Mood scale */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Worst</span>
          <span>Best</span>
        </div>
        
        <div className="relative">
          {/* Background track */}
          <div className="h-2 bg-gray-700 rounded-full"></div>
          
          {/* Progress track */}
          <div 
            className={`absolute top-0 h-2 rounded-full transition-all duration-300 ${currentMood?.bgColor || 'bg-gray-500'}`}
            style={{ width: `${((hoveredMood || value) / 10) * 100}%` }}
          ></div>
          
          {/* Interactive dots */}
          <div className="absolute top-0 w-full h-2 flex justify-between items-center -mt-1">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => !disabled && onChange(mood.value)}
                onMouseEnter={() => !disabled && setHoveredMood(mood.value)}
                onMouseLeave={() => setHoveredMood(null)}
                disabled={disabled}
                className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-200 ${
                  disabled 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'cursor-pointer hover:scale-125'
                } ${
                  mood.value <= (hoveredMood || value) 
                    ? mood.bgColor 
                    : 'bg-gray-600'
                }`}
                aria-label={`Mood: ${mood.label} (${mood.value}/10)`}
              >
                <span className="sr-only">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-600">
          {moods.filter((_, index) => index % 2 === 0).map((mood) => (
            <span key={mood.value}>{mood.value}</span>
          ))}
        </div>
      </div>

      {/* Mood insights */}
      {!disabled && (
        <div className="text-center">
          <p className="text-xs text-gray-400">
            {value <= 3 
              ? "Remember, difficult feelings are temporary. You're not alone in this."
              : value <= 6
              ? "Every feeling is valid. Take a moment to honor where you are right now."
              : "It's wonderful that you're feeling positive! What's contributing to this mood?"
            }
          </p>
        </div>
      )}
    </div>
  );
}