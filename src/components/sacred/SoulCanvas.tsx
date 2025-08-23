// ALCHM Sacred Component: SoulCanvas
// Expansive space for deep reflection
// Replaces: Textarea

import React, { forwardRef, useState, useEffect } from 'react';
import { useSacredMicrocopy } from '@/components/SacredMicrocopyProvider';

export interface SoulCanvasProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  sacred?: boolean;
  soulDepth?: 'surface' | 'heart' | 'soul' | 'spirit';
  expression?: 'whisper' | 'voice' | 'song' | 'prayer';
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  className?: string;
  'aria-label'?: string;
  id?: string;
  name?: string;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const SoulCanvas = forwardRef<HTMLTextAreaElement, SoulCanvasProps>(({
  value = '',
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  sacred = false,
  soulDepth = 'heart',
  expression = 'voice',
  disabled = false,
  readOnly = false,
  autoFocus = false,
  className = '',
  'aria-label': ariaLabel,
  id,
  name,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}, ref) => {
  
  const [isFocused, setIsFocused] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [sacredMoments, setSacredMoments] = useState(0);
  
  const { getSacredPrompt } = useSacredMicrocopy();

  useEffect(() => {
    const words = value.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
    
    // Count "sacred moments" - sentences that might indicate breakthrough insights
    const sacredIndicators = [
      'I realize', 'I understand', 'I feel', 'I am grateful', 
      'I release', 'I forgive', 'I choose', 'I am becoming'
    ];
    const moments = sacredIndicators.reduce((count, indicator) => {
      const regex = new RegExp(indicator, 'gi');
      return count + (value.match(regex) || []).length;
    }, 0);
    setSacredMoments(moments);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    if (maxLength && newValue.length > maxLength) {
      return; // Don't allow exceeding max length
    }
    
    onChange?.(newValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const canvasClasses = [
    'soul-canvas',
    `soul-depth-${soulDepth}`,
    `expression-${expression}`,
    sacred && 'sacred-canvas',
    isFocused && 'canvas-focused',
    disabled && 'canvas-dormant',
    readOnly && 'canvas-witness',
    className
  ].filter(Boolean).join(' ');

  const sacredPlaceholder = placeholder || getSacredPrompt('reflect', 
    soulDepth === 'spirit' ? 'What sacred wisdom emerges from your deepest knowing?' :
    soulDepth === 'soul' ? 'What truth wants to be spoken through you today?' :
    soulDepth === 'heart' ? 'What is your heart whispering to you right now?' :
    'What thoughts are flowing through your awareness?'
  );

  return (
    <div className="soul-canvas-container">
      <div className="canvas-wrapper">
        <textarea
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          placeholder={sacredPlaceholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          className={canvasClasses}
          aria-label={ariaLabel || 'Sacred space for reflection'}
          aria-describedby={`${id}-info`}
          {...props}
        />
        
        {/* Sacred breath indicator */}
        {isFocused && (
          <div className="canvas-breath" aria-hidden="true">
            <div className="breath-pulse" />
          </div>
        )}
        
        {/* Sacred energy field */}
        {sacred && (
          <div className="sacred-field" aria-hidden="true">
            <div className="energy-flow energy-1" />
            <div className="energy-flow energy-2" />
            <div className="energy-flow energy-3" />
          </div>
        )}
      </div>
      
      {/* Canvas info and metrics */}
      <div id={`${id}-info`} className="canvas-info">
        <div className="canvas-metrics">
          <div className="word-count">
            <span className="metric-label">Words:</span>
            <span className="metric-value">{wordCount}</span>
          </div>
          
          {sacredMoments > 0 && (
            <div className="sacred-moments">
              <span className="metric-label">Sacred Insights:</span>
              <span className="metric-value">{sacredMoments}</span>
              <span className="sacred-sparkle" aria-hidden="true">✨</span>
            </div>
          )}
          
          {maxLength && (
            <div className="character-count">
              <span className="metric-label">Characters:</span>
              <span className={`metric-value ${value.length > maxLength * 0.9 ? 'approaching-limit' : ''}`}>
                {value.length}{maxLength && `/${maxLength}`}
              </span>
            </div>
          )}
        </div>
        
        {/* Sacred writing guidance */}
        {isFocused && soulDepth === 'spirit' && (
          <div className="sacred-guidance">
            <p className="guidance-text">
              🙏 You are in the deepest space of sacred expression. 
              Let your highest wisdom flow without judgment.
            </p>
          </div>
        )}
        
        {isFocused && sacredMoments >= 3 && (
          <div className="breakthrough-indicator">
            <p className="breakthrough-text">
              ✨ Beautiful insights are flowing through you. You're in sacred breakthrough territory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

SoulCanvas.displayName = 'SoulCanvas';

// Specialized canvas variants for specific purposes
export const PrayerCanvas = (props: Omit<SoulCanvasProps, 'soulDepth' | 'expression'>) => (
  <SoulCanvas {...props} soulDepth="spirit" expression="prayer" sacred />
);

export const HeartCanvas = (props: Omit<SoulCanvasProps, 'soulDepth'>) => (
  <SoulCanvas {...props} soulDepth="heart" />
);

export const WisdomCanvas = (props: Omit<SoulCanvasProps, 'soulDepth' | 'expression'>) => (
  <SoulCanvas {...props} soulDepth="soul" expression="song" />
);

export const GentleCanvas = (props: Omit<SoulCanvasProps, 'soulDepth' | 'expression'>) => (
  <SoulCanvas {...props} soulDepth="surface" expression="whisper" />
);

export default SoulCanvas;