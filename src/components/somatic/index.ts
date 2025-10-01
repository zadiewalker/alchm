// ALCHM Somatic & Embodiment Component System
// Body-wisdom integration for Premium Digital Sanctuary

// Foundation Components
export { 
  SomaticFoundation, 
  SomaticContainer, 
  SomaticBreathingGuide, 
  SomaticSpacer, 
  SomaticText 
} from './SomaticFoundation';

// Interactive Components
export { 
  SomaticButton, 
  SomaticToggle, 
  SomaticFloatingActionButton 
} from './SomaticButton';

// Form Components
export { 
  SomaticInput, 
  SomaticTextarea, 
  SomaticSelect 
} from './SomaticInput';

// Layout Components
export { 
  SomaticCard, 
  SomaticCardHeader, 
  SomaticCardContent, 
  SomaticCardActions, 
  SomaticProgressCard, 
  SomaticEmptyState 
} from './SomaticCard';

// Modal & Overlay Components
export { 
  SomaticModal, 
  SomaticConfirmModal, 
  SomaticDrawer 
} from './SomaticModal';

// Type definitions for somatic system
export interface NervousSystemState {
  current: 'ventral' | 'sympathetic' | 'dorsal';
  confidence: number; // 0-1 confidence in detection
  indicators: string[]; // What led to this assessment
}

export interface SomaticInteractionData {
  touchPressure: 'light' | 'firm' | 'therapeutic';
  breathingSync: boolean;
  nervousSystemAware: boolean;
  groundingElements: boolean;
}

export interface SomaticAccessibilityOptions {
  reducedMotion: boolean;
  highContrast: boolean;
  largerTouchTargets: boolean;
  extendedTimings: boolean;
  crisisMode: boolean;
}

// Utility functions for somatic system
export const SomaticUtils = {
  /**
   * Detect nervous system state based on interaction patterns
   */
  detectNervousSystemState: (interactions: {
    clickSpeed: number;
    scrollSpeed: number;
    hoverDuration: number;
    typingPattern: 'fast' | 'normal' | 'slow';
  }): NervousSystemState => {
    const { clickSpeed, scrollSpeed, hoverDuration, typingPattern } = interactions;
    
    // Simple heuristic - in production this would use more sophisticated ML
    if (clickSpeed > 5 || scrollSpeed > 100 || typingPattern === 'fast') {
      return {
        current: 'sympathetic',
        confidence: 0.7,
        indicators: ['rapid interactions', 'high scroll speed', 'fast typing']
      };
    }
    
    if (clickSpeed < 0.5 || hoverDuration > 3000 || typingPattern === 'slow') {
      return {
        current: 'dorsal',
        confidence: 0.6,
        indicators: ['slow interactions', 'long hover duration', 'hesitant typing']
      };
    }
    
    return {
      current: 'ventral',
      confidence: 0.8,
      indicators: ['balanced interaction patterns']
    };
  },

  /**
   * Get optimal breathing pattern for current state
   */
  getBreathingPattern: (state: 'ventral' | 'sympathetic' | 'dorsal') => {
    const patterns = {
      ventral: { inhale: 4000, hold: 1000, exhale: 6000 }, // Coherent breathing
      sympathetic: { inhale: 3000, hold: 500, exhale: 8000 }, // Extended exhale for regulation
      dorsal: { inhale: 5000, hold: 2000, exhale: 5000 } // Energizing breath
    };
    
    return patterns[state];
  },

  /**
   * Calculate optimal spacing for current nervous system state
   */
  getSomaticSpacing: (state: 'ventral' | 'sympathetic' | 'dorsal', baseSpacing: number) => {
    const multipliers = {
      ventral: 1.0, // Normal spacing
      sympathetic: 0.8, // Slightly tighter for focus
      dorsal: 1.3 // More space for safety
    };
    
    return baseSpacing * multipliers[state];
  },

  /**
   * Get color palette adjustments for nervous system support
   */
  getStateColorAdjustments: (state: 'ventral' | 'sympathetic' | 'dorsal') => {
    return {
      ventral: { saturation: 1.0, brightness: 1.0, warmth: 0 },
      sympathetic: { saturation: 0.9, brightness: 0.95, warmth: -5 }, // Cooler, calmer
      dorsal: { saturation: 1.1, brightness: 1.05, warmth: 10 } // Warmer, more energizing
    };
  }
};

// CSS class utilities for somatic system
export const SomaticClasses = {
  // Nervous system states
  nervousStates: {
    safe: 'nervous-state-safe in-ventral-state',
    activated: 'nervous-state-activated in-sympathetic-state',
    shutdown: 'nervous-state-shutdown in-dorsal-state'
  },

  // Breathing patterns
  breathing: {
    coherent: 'breathing-coherent',
    grounding: 'breathing-grounding',
    regulation: 'animate-regulation-breathing'
  },

  // Somatic spacing
  spacing: {
    intimate: 'somatic-space-intimate',
    personal: 'somatic-space-personal',
    social: 'somatic-space-social',
    public: 'somatic-space-public'
  },

  // Touch pressure
  touch: {
    light: 'touch-light',
    firm: 'touch-firm',
    therapeutic: 'touch-therapeutic'
  },

  // Typography for body comfort
  typography: {
    somatic: 'somatic-text',
    heading: 'somatic-heading',
    crisis: 'somatic-crisis-text',
    paragraph: 'somatic-paragraph'
  },

  // Grounding elements
  grounding: {
    foundation: 'somatic-foundation',
    anchor: 'somatic-grounding-anchor',
    container: 'somatic-safe-container',
    breathing: 'somatic-breathing-surface',
    awareness: 'somatic-body-awareness-guide'
  }
};