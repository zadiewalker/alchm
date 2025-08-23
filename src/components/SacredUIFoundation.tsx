'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// ===== SACRED UX TYPES =====

export type SacredIntention = 'primary' | 'gentle' | 'grounding' | 'release';
export type SacredEnergy = 'active' | 'contemplative' | 'nurturing';
export type SacredSize = 'intimate' | 'comfortable' | 'spacious';
export type SacredHaptic = 'soft' | 'affirming' | 'grounding';

export interface SacredTheme {
  colorPalette: {
    sacredCanvas: string;
    groundingEarth: string;
    tenderEmbrace: string;
    deepPresence: string;
    healingMist: string;
  };
  spacing: {
    whisper: string;
    gentle: string;
    breath: string;
    ritual: string;
    sacred: string;
    pause: string;
    sanctuary: string;
    vast: string;
  };
  typography: {
    fontPrimary: string;
    fontSecondary: string;
    fontAccent: string;
  };
}

export interface SacredUIState {
  theme: SacredTheme;
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    breathingMode: boolean;
  };
  ritualMode: boolean;
}

// ===== SACRED THEME PROVIDER =====

const defaultSacredTheme: SacredTheme = {
  colorPalette: {
    sacredCanvas: '#f7f7f2',
    groundingEarth: '#cb997e',
    tenderEmbrace: '#eeddd3',
    deepPresence: '#3a3a3a',
    healingMist: '#f0f4f1',
  },
  spacing: {
    whisper: '4px',
    gentle: '8px',
    breath: '16px',
    ritual: '24px',
    sacred: '32px',
    pause: '48px',
    sanctuary: '64px',
    vast: '96px',
  },
  typography: {
    fontPrimary: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSecondary: 'Crimson Pro, Georgia, serif',
    fontAccent: 'Inter, Helvetica Neue, sans-serif',
  },
};

const initialState: SacredUIState = {
  theme: defaultSacredTheme,
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    breathingMode: false,
  },
  ritualMode: false,
};

type SacredUIAction = 
  | { type: 'TOGGLE_REDUCE_MOTION' }
  | { type: 'TOGGLE_HIGH_CONTRAST' }
  | { type: 'TOGGLE_BREATHING_MODE' }
  | { type: 'TOGGLE_RITUAL_MODE' }
  | { type: 'SET_THEME'; payload: Partial<SacredTheme> };

function sacredUIReducer(state: SacredUIState, action: SacredUIAction): SacredUIState {
  switch (action.type) {
    case 'TOGGLE_REDUCE_MOTION':
      return {
        ...state,
        accessibility: {
          ...state.accessibility,
          reduceMotion: !state.accessibility.reduceMotion,
        },
      };
    case 'TOGGLE_HIGH_CONTRAST':
      return {
        ...state,
        accessibility: {
          ...state.accessibility,
          highContrast: !state.accessibility.highContrast,
        },
      };
    case 'TOGGLE_BREATHING_MODE':
      return {
        ...state,
        accessibility: {
          ...state.accessibility,
          breathingMode: !state.accessibility.breathingMode,
        },
      };
    case 'TOGGLE_RITUAL_MODE':
      return {
        ...state,
        ritualMode: !state.ritualMode,
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: { ...state.theme, ...action.payload },
      };
    default:
      return state;
  }
}

const SacredUIContext = createContext<{
  state: SacredUIState;
  dispatch: React.Dispatch<SacredUIAction>;
} | null>(null);

export function SacredUIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sacredUIReducer, initialState);

  return (
    <SacredUIContext.Provider value={{ state, dispatch }}>
      {children}
    </SacredUIContext.Provider>
  );
}

export function useSacredUI() {
  const context = useContext(SacredUIContext);
  if (!context) {
    throw new Error('useSacredUI must be used within a SacredUIProvider');
  }
  return context;
}

// ===== SACRED BUTTON COMPONENT =====

export interface SacredButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intention?: SacredIntention;
  energy?: SacredEnergy;
  size?: SacredSize;
  haptic?: SacredHaptic;
  children: ReactNode;
  isLoading?: boolean;
}

export function SacredButton({
  intention = 'primary',
  energy = 'active',
  size = 'comfortable',
  haptic = 'soft',
  children,
  isLoading = false,
  className = '',
  onTouchStart,
  ...props
}: SacredButtonProps) {
  const { state } = useSacredUI();

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    // Trigger haptic feedback (if supported)
    if ('vibrate' in navigator && !state.accessibility.reduceMotion) {
      const hapticPattern = {
        soft: [10],
        affirming: [15, 10, 15],
        grounding: [25],
      };
      navigator.vibrate(hapticPattern[haptic]);
    }
    
    onTouchStart?.(e);
  };

  const buttonClasses = [
    'sacred-button',
    `sacred-button--${intention}`,
    `sacred-button--${energy}`,
    `sacred-button--${size}`,
    state.accessibility.reduceMotion && 'reduce-motion',
    state.accessibility.highContrast && 'high-contrast',
    isLoading && 'loading',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onTouchStart={handleTouchStart}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="sacred-button__loading">
          <span className="sacred-spinner" />
          <span className="sr-only">Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// ===== SACRED TEXT COMPONENT =====

export interface SacredTextProps {
  variant: 'hero' | 'title' | 'body' | 'caption' | 'sacred';
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export function SacredText({
  variant,
  children,
  className = '',
  as = 'p',
  ...props
}: SacredTextProps) {
  const Component = as;
  const textClasses = [
    'sacred-text',
    `sacred-text--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={textClasses} {...props}>
      {children}
    </Component>
  );
}

// ===== SACRED CARD COMPONENT =====

export interface SacredCardProps {
  variant?: 'default' | 'gentle' | 'warm' | 'sacred';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isInteractive?: boolean;
}

export function SacredCard({
  variant = 'default',
  children,
  className = '',
  onClick,
  isInteractive = false,
  ...props
}: SacredCardProps) {
  const { state } = useSacredUI();

  const cardClasses = [
    'ritual-card',
    variant !== 'default' && `ritual-card--${variant}`,
    isInteractive && 'ritual-card--interactive',
    state.accessibility.reduceMotion && 'reduce-motion',
    className,
  ].filter(Boolean).join(' ');

  const CardComponent = isInteractive ? 'button' : 'div';

  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      {...props}
    >
      {children}
    </CardComponent>
  );
}

// ===== SACRED INPUT COMPONENT =====

export interface SacredInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  isTextArea?: boolean;
  variant?: 'default' | 'sacred';
  helpText?: string;
  errorText?: string;
}

export function SacredInput({
  label,
  isTextArea = false,
  variant = 'default',
  helpText,
  errorText,
  className = '',
  id,
  ...props
}: SacredInputProps) {
  const inputId = id || `sacred-input-${Math.random().toString(36).substr(2, 9)}`;
  const helpId = helpText ? `${inputId}-help` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;

  const inputClasses = [
    'sacred-input',
    variant !== 'default' && `sacred-input--${variant}`,
    errorText && 'sacred-input--error',
    className,
  ].filter(Boolean).join(' ');

  const InputComponent = isTextArea ? 'textarea' : 'input';

  return (
    <div className="sacred-input-group">
      <label htmlFor={inputId} className="sacred-input__label">
        {label}
      </label>
      
      <InputComponent
        id={inputId}
        className={inputClasses}
        aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={!!errorText}
        {...props}
      />
      
      {helpText && (
        <p id={helpId} className="sacred-input__help">
          {helpText}
        </p>
      )}
      
      {errorText && (
        <p id={errorId} className="sacred-input__error" role="alert">
          {errorText}
        </p>
      )}
    </div>
  );
}

// ===== SACRED CONTAINER COMPONENT =====

export interface SacredContainerProps {
  children: ReactNode;
  className?: string;
  spacing?: 'compact' | 'comfortable' | 'spacious';
}

export function SacredContainer({
  children,
  className = '',
  spacing = 'comfortable',
  ...props
}: SacredContainerProps) {
  const containerClasses = [
    'sacred-container',
    `sacred-container--${spacing}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
}

// ===== SACRED ACCESSIBILITY CONTROLS =====

export function SacredAccessibilityControls() {
  const { state, dispatch } = useSacredUI();

  return (
    <div className="sacred-accessibility-controls" role="region" aria-label="Accessibility controls">
      <h3 className="sacred-text sacred-text--caption">
        Sacred Space Settings
      </h3>
      
      <div className="sacred-controls-grid">
        <label className="sacred-control">
          <input
            type="checkbox"
            checked={state.accessibility.reduceMotion}
            onChange={() => dispatch({ type: 'TOGGLE_REDUCE_MOTION' })}
          />
          <span>Gentle Motion</span>
          <span className="sacred-control__description">
            Reduces animations for a calmer experience
          </span>
        </label>

        <label className="sacred-control">
          <input
            type="checkbox"
            checked={state.accessibility.highContrast}
            onChange={() => dispatch({ type: 'TOGGLE_HIGH_CONTRAST' })}
          />
          <span>High Contrast</span>
          <span className="sacred-control__description">
            Increases contrast for better visibility
          </span>
        </label>

        <label className="sacred-control">
          <input
            type="checkbox"
            checked={state.accessibility.breathingMode}
            onChange={() => dispatch({ type: 'TOGGLE_BREATHING_MODE' })}
          />
          <span>Breathing Mode</span>
          <span className="sacred-control__description">
            Simplified interface for centering moments
          </span>
        </label>

        <label className="sacred-control">
          <input
            type="checkbox"
            checked={state.ritualMode}
            onChange={() => dispatch({ type: 'TOGGLE_RITUAL_MODE' })}
          />
          <span>Ritual Mode</span>
          <span className="sacred-control__description">
            Enhanced sacred interactions
          </span>
        </label>
      </div>
    </div>
  );
}

// ===== SACRED LAYOUT COMPONENTS =====

export function SacredSection({ children, className = '', ...props }: { children: ReactNode; className?: string; [key: string]: any }) {
  return (
    <section className={`ritual-section ${className}`} {...props}>
      {children}
    </section>
  );
}

export function SacredGrid({ 
  children, 
  columns = 'auto',
  gap = 'ritual',
  className = '',
  ...props 
}: { 
  children: ReactNode; 
  columns?: 'auto' | 1 | 2 | 3 | 4;
  gap?: 'gentle' | 'breath' | 'ritual' | 'sacred';
  className?: string;
  [key: string]: any;
}) {
  const gridClasses = [
    'sacred-grid',
    `sacred-grid--columns-${columns}`,
    `sacred-grid--gap-${gap}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
}

// ===== EXPORT ALL SACRED COMPONENTS =====

export {
  SacredUIProvider,
  useSacredUI,
  SacredButton,
  SacredText,
  SacredCard,
  SacredInput,
  SacredContainer,
  SacredAccessibilityControls,
  SacredSection,
  SacredGrid,
};