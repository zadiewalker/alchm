'use client';

import { useState } from 'react';
import { AppText } from '@/components/ui/AppText';
import type { MoodSelectorProps } from '@/types/dashboard';

export const AVAILABLE_MOODS = [
  'anxious', 'heavy', 'numb', 'restless', 'tender', 
  'hopeful', 'alive', 'shattered', 'calm', 'burning'
];

const MOOD_COLORS: Record<string, string> = {
  anxious: 'var(--color-sage-500)',
  heavy: 'var(--color-sage-400)',
  numb: 'var(--color-sage-600)',
  restless: 'var(--color-sage-500)',
  tender: 'var(--color-text-secondary)',
  hopeful: 'var(--color-text-secondary)',
  alive: 'var(--color-text-primary)',
  shattered: 'var(--color-sage-300)',
  calm: 'var(--color-sage-400)',
  burning: 'var(--color-text-primary)'
};

export function MoodSelector({ onMoodSelect, selectedMood, onClear }: MoodSelectorProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="dashboard-mood-section">
      <div className="dashboard-mood-header">
        <AppText variant="caption" as="label">
          How are you feeling?
        </AppText>
        
        {selectedMood && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="btn-ghost dashboard-clear-button"
          >
            Clear
          </button>
        )}
      </div>

      <div className="dashboard-mood-grid">
        {AVAILABLE_MOODS.slice(0, expanded ? AVAILABLE_MOODS.length : 6).map((mood) => {
          const isSelected = selectedMood === mood;
          const moodColor = MOOD_COLORS[mood];
          
          return (
            <button
              key={mood}
              type="button"
              onClick={() => onMoodSelect(mood)}
              className={['dashboard-mood-chip', isSelected ? 'is-selected' : ''].filter(Boolean).join(' ')}
              style={{
                borderColor: isSelected ? moodColor : undefined,
                background: isSelected
                  ? 'color-mix(in srgb, var(--accent-primary) 42%, transparent)'
                  : undefined,
                color: isSelected ? 'var(--text-primary)' : undefined,
                fontWeight: isSelected ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
              }}
            >
              {mood}
            </button>
          );
        })}

        {AVAILABLE_MOODS.length > 6 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="dashboard-mood-chip dashboard-mood-toggle"
          >
            {expanded ? 'Show less' : `+${AVAILABLE_MOODS.length - 6} more`}
          </button>
        )}
      </div>
    </div>
  );
}
