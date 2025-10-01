/**
 * ALCHM Cultural Design System
 * Responsive design tokens that honor diverse aesthetic traditions
 * Breaking away from Eurocentric minimalism as the default
 */

export interface CulturalColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  culturalContext: string;
}

export interface CulturalDesignTokens {
  colors: CulturalColorPalette;
  spacing: {
    breathingRoom: string; // Cultural concept of appropriate spacing
    intimacy: string; // Close, personal spacing
    community: string; // Group-oriented spacing
    ceremony: string; // Sacred/formal spacing
  };
  typography: {
    primaryFont: string;
    secondaryFont: string;
    culturalWeights: string[];
    ceremonialSize: string;
    communitySize: string;
    intimateSize: string;
  };
  patterns: {
    useOrganic: boolean; // Prefer organic vs geometric patterns
    useBorders: boolean; // Cultural preference for boundaries
    useGradients: boolean; // Preference for color transitions
    useTextures: boolean; // Tactile design elements
  };
  interaction: {
    hoverStyle: 'subtle' | 'expressive' | 'ceremonial';
    transitionSpeed: 'immediate' | 'gentle' | 'ceremonial';
    feedbackStyle: 'minimal' | 'warm' | 'celebratory';
  };
}

export const CULTURAL_DESIGN_SYSTEMS: Record<string, CulturalDesignTokens> = {
  // Default - Inclusive Green (moving away from just "Western")
  inclusive: {
    colors: {
      primary: '#a4b792',
      secondary: '#8ea876',
      accent: '#d4af37', // Gold for celebration
      background: '#f8faf9',
      surface: '#ffffff',
      text: '#2d3748',
      textSecondary: '#718096',
      success: '#48bb78',
      warning: '#ed8936',
      error: '#e53e3e',
      culturalContext: 'balanced_harmony'
    },
    spacing: {
      breathingRoom: '2rem',
      intimacy: '0.75rem',
      community: '1.5rem',
      ceremony: '4rem'
    },
    typography: {
      primaryFont: 'system-ui, -apple-system, sans-serif',
      secondaryFont: 'Georgia, serif',
      culturalWeights: ['300', '400', '500', '600'],
      ceremonialSize: '3rem',
      communitySize: '1.5rem',
      intimateSize: '1rem'
    },
    patterns: {
      useOrganic: true,
      useBorders: false,
      useGradients: true,
      useTextures: false
    },
    interaction: {
      hoverStyle: 'gentle',
      transitionSpeed: 'gentle',
      feedbackStyle: 'warm'
    }
  },

  // Afrofuturist - Bold, geometric, tech-spiritual
  afrofuturist: {
    colors: {
      primary: '#8b5a3c', // Rich brown
      secondary: '#d4af37', // Gold
      accent: '#6b46c1', // Purple
      background: '#1a1a2e',
      surface: '#16213e',
      text: '#f7fafc',
      textSecondary: '#cbd5e0',
      success: '#38a169',
      warning: '#dd6b20',
      error: '#e53e3e',
      culturalContext: 'tech_spiritual_power'
    },
    spacing: {
      breathingRoom: '3rem',
      intimacy: '1rem',
      community: '2rem',
      ceremony: '6rem'
    },
    typography: {
      primaryFont: 'Orbitron, Futura, sans-serif',
      secondaryFont: 'Space Grotesk, sans-serif',
      culturalWeights: ['400', '500', '700', '900'],
      ceremonialSize: '4rem',
      communitySize: '2rem',
      intimateSize: '1.125rem'
    },
    patterns: {
      useOrganic: false,
      useBorders: true,
      useGradients: true,
      useTextures: true
    },
    interaction: {
      hoverStyle: 'expressive',
      transitionSpeed: 'immediate',
      feedbackStyle: 'celebratory'
    }
  },

  // Indigenous - Earth tones, organic patterns, ceremonial spacing
  indigenous: {
    colors: {
      primary: '#8b4513', // Saddle brown
      secondary: '#cd853f', // Peru
      accent: '#dc143c', // Crimson
      background: '#fdf6e3', // Cream
      surface: '#f4f1e8',
      text: '#3c2e2a',
      textSecondary: '#8d7053',
      success: '#228b22',
      warning: '#ff8c00',
      error: '#b22222',
      culturalContext: 'earth_connection_sacred'
    },
    spacing: {
      breathingRoom: '4rem',
      intimacy: '0.5rem',
      community: '3rem',
      ceremony: '8rem'
    },
    typography: {
      primaryFont: 'Crimson Text, serif',
      secondaryFont: 'Source Sans Pro, sans-serif',
      culturalWeights: ['300', '400', '600'],
      ceremonialSize: '3.5rem',
      communitySize: '1.75rem',
      intimateSize: '1rem'
    },
    patterns: {
      useOrganic: true,
      useBorders: false,
      useGradients: false,
      useTextures: true
    },
    interaction: {
      hoverStyle: 'ceremonial',
      transitionSpeed: 'ceremonial',
      feedbackStyle: 'warm'
    }
  },

  // Latinx - Warm, vibrant, family-oriented
  latinx: {
    colors: {
      primary: '#dc2626', // Red
      secondary: '#f59e0b', // Amber
      accent: '#10b981', // Emerald
      background: '#fef7ed',
      surface: '#ffffff',
      text: '#451a03',
      textSecondary: '#78350f',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      culturalContext: 'familia_celebration_warmth'
    },
    spacing: {
      breathingRoom: '1.5rem',
      intimacy: '1rem',
      community: '2rem',
      ceremony: '3rem'
    },
    typography: {
      primaryFont: 'Playfair Display, serif',
      secondaryFont: 'Open Sans, sans-serif',
      culturalWeights: ['400', '500', '600', '700'],
      ceremonialSize: '3rem',
      communitySize: '1.5rem',
      intimateSize: '1rem'
    },
    patterns: {
      useOrganic: true,
      useBorders: true,
      useGradients: true,
      useTextures: false
    },
    interaction: {
      hoverStyle: 'expressive',
      transitionSpeed: 'gentle',
      feedbackStyle: 'celebratory'
    }
  },

  // East Asian - Harmony, balance, subtle elegance
  eastAsian: {
    colors: {
      primary: '#4a5568', // Gray
      secondary: '#e53e3e', // Red
      accent: '#d4af37', // Gold
      background: '#f7fafc',
      surface: '#ffffff',
      text: '#1a202c',
      textSecondary: '#4a5568',
      success: '#38a169',
      warning: '#dd6b20',
      error: '#e53e3e',
      culturalContext: 'harmony_balance_elegance'
    },
    spacing: {
      breathingRoom: '3rem',
      intimacy: '0.75rem',
      community: '2rem',
      ceremony: '5rem'
    },
    typography: {
      primaryFont: 'Noto Sans, sans-serif',
      secondaryFont: 'Source Serif Pro, serif',
      culturalWeights: ['300', '400', '500'],
      ceremonialSize: '2.5rem',
      communitySize: '1.25rem',
      intimateSize: '0.875rem'
    },
    patterns: {
      useOrganic: true,
      useBorders: false,
      useGradients: false,
      useTextures: false
    },
    interaction: {
      hoverStyle: 'subtle',
      transitionSpeed: 'gentle',
      feedbackStyle: 'minimal'
    }
  },

  // South Asian - Rich colors, detailed patterns, spiritual depth
  southAsian: {
    colors: {
      primary: '#7c2d12', // Red brown
      secondary: '#f59e0b', // Amber
      accent: '#8b5cf6', // Violet
      background: '#fefdf8',
      surface: '#ffffff',
      text: '#44403c',
      textSecondary: '#78716c',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      culturalContext: 'spiritual_richness_detail'
    },
    spacing: {
      breathingRoom: '2rem',
      intimacy: '1rem',
      community: '2.5rem',
      ceremony: '4rem'
    },
    typography: {
      primaryFont: 'Libre Baskerville, serif',
      secondaryFont: 'Inter, sans-serif',
      culturalWeights: ['400', '500', '600', '700'],
      ceremonialSize: '3.5rem',
      communitySize: '1.75rem',
      intimateSize: '1rem'
    },
    patterns: {
      useOrganic: true,
      useBorders: true,
      useGradients: true,
      useTextures: true
    },
    interaction: {
      hoverStyle: 'expressive',
      transitionSpeed: 'gentle',
      feedbackStyle: 'warm'
    }
  },

  // LGBTQ+ - Pride colors, expressive, identity-affirming
  lgbtqPride: {
    colors: {
      primary: '#8b5cf6', // Purple
      secondary: '#ec4899', // Pink
      accent: '#06b6d4', // Cyan
      background: '#fefefe',
      surface: '#ffffff',
      text: '#374151',
      textSecondary: '#6b7280',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      culturalContext: 'pride_expression_identity'
    },
    spacing: {
      breathingRoom: '2rem',
      intimacy: '1rem',
      community: '1.5rem',
      ceremony: '3rem'
    },
    typography: {
      primaryFont: 'Poppins, sans-serif',
      secondaryFont: 'Merriweather, serif',
      culturalWeights: ['400', '500', '600', '700'],
      ceremonialSize: '3rem',
      communitySize: '1.5rem',
      intimateSize: '1rem'
    },
    patterns: {
      useOrganic: true,
      useBorders: false,
      useGradients: true,
      useTextures: false
    },
    interaction: {
      hoverStyle: 'expressive',
      transitionSpeed: 'gentle',
      feedbackStyle: 'celebratory'
    }
  }
};

/**
 * Cultural Design Detection
 * Attempts to provide appropriate design based on user context
 */
export function detectCulturalDesignPreference(context: {
  identities?: string[];
  language?: string;
  region?: string;
  preferences?: string[];
}): string {
  const { identities = [], language = 'en', region = 'US', preferences = [] } = context;

  // Check for specific identity-based preferences
  if (identities.some(id => ['transgender', 'gay', 'lesbian', 'bisexual', 'queer', 'lgbtq'].includes(id.toLowerCase()))) {
    return 'lgbtqPride';
  }

  if (identities.some(id => ['black', 'african-american', 'afrocaribbean'].includes(id.toLowerCase()))) {
    return 'afrofuturist';
  }

  if (identities.some(id => ['indigenous', 'native-american', 'first-nations', 'aboriginal'].includes(id.toLowerCase()))) {
    return 'indigenous';
  }

  if (identities.some(id => ['latino', 'latina', 'hispanic', 'chicano', 'mexican', 'puerto-rican'].includes(id.toLowerCase()))) {
    return 'latinx';
  }

  if (identities.some(id => ['indian', 'pakistani', 'bangladeshi', 'sri-lankan', 'south-asian'].includes(id.toLowerCase()))) {
    return 'southAsian';
  }

  // Language-based fallbacks
  if (['zh', 'ja', 'ko'].includes(language)) {
    return 'eastAsian';
  }

  if (['es', 'pt'].includes(language)) {
    return 'latinx';
  }

  if (['hi', 'ur', 'bn'].includes(language)) {
    return 'southAsian';
  }

  // Default to inclusive design
  return 'inclusive';
}

/**
 * Apply cultural design tokens to CSS variables
 */
export function applyCulturalDesignTokens(designSystem: string): Record<string, string> {
  const tokens = CULTURAL_DESIGN_SYSTEMS[designSystem] || CULTURAL_DESIGN_SYSTEMS.inclusive;
  
  return {
    '--color-primary': tokens.colors.primary,
    '--color-secondary': tokens.colors.secondary,
    '--color-accent': tokens.colors.accent,
    '--color-background': tokens.colors.background,
    '--color-surface': tokens.colors.surface,
    '--color-text': tokens.colors.text,
    '--color-text-secondary': tokens.colors.textSecondary,
    '--color-success': tokens.colors.success,
    '--color-warning': tokens.colors.warning,
    '--color-error': tokens.colors.error,
    
    '--spacing-breathing': tokens.spacing.breathingRoom,
    '--spacing-intimacy': tokens.spacing.intimacy,
    '--spacing-community': tokens.spacing.community,
    '--spacing-ceremony': tokens.spacing.ceremony,
    
    '--font-primary': tokens.typography.primaryFont,
    '--font-secondary': tokens.typography.secondaryFont,
    '--size-ceremonial': tokens.typography.ceremonialSize,
    '--size-community': tokens.typography.communitySize,
    '--size-intimate': tokens.typography.intimateSize,
    
    '--transition-speed': tokens.interaction.transitionSpeed === 'immediate' ? '0.1s' : 
                          tokens.interaction.transitionSpeed === 'gentle' ? '0.3s' : '0.6s'
  };
}

/**
 * Generate culturally-appropriate gradient
 */
export function getCulturalGradient(designSystem: string): string {
  const tokens = CULTURAL_DESIGN_SYSTEMS[designSystem] || CULTURAL_DESIGN_SYSTEMS.inclusive;
  
  if (!tokens.patterns.useGradients) {
    return tokens.colors.primary;
  }
  
  return `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.secondary})`;
}

/**
 * Get culturally-appropriate animation timing
 */
export function getCulturalAnimationTiming(designSystem: string): string {
  const tokens = CULTURAL_DESIGN_SYSTEMS[designSystem] || CULTURAL_DESIGN_SYSTEMS.inclusive;
  
  switch (tokens.interaction.transitionSpeed) {
    case 'immediate': return 'cubic-bezier(0.4, 0, 1, 1)';
    case 'ceremonial': return 'cubic-bezier(0.4, 0, 0.2, 1)';
    default: return 'cubic-bezier(0.4, 0, 0.2, 1)';
  }
}

export default {
  CULTURAL_DESIGN_SYSTEMS,
  detectCulturalDesignPreference,
  applyCulturalDesignTokens,
  getCulturalGradient,
  getCulturalAnimationTiming
};