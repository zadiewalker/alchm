/**
 * SACRED HEALING DESIGN PALETTE - IMMUTABLE CONSTANTS
 * 
 * These are the ONLY approved colors for ALCHM.
 * Any deviation from these colors is a violation of our sacred design principles.
 * 
 * Last Updated: 2026-02-01
 * Design Authority: ALCHM Sacred Design Team
 */

export const SACRED_PALETTE = {
  sage: {
    primary: '#8B9A7C',
    light: '#A8B5A0',
    dark: '#6B7A5C',
  },
  gold: {
    primary: '#E5C97D',
    hover: '#F2D99D',
    deep: '#D4B76A',
  },
  // Unique healing pathway colors for transformation themes
  pathways: {
    foundation: '#D4A574',     // Warm earth brown for grounding
    calmStorm: '#7BB3D4',      // Calming ocean blue for peace
    honoringLoss: '#D4A77B',   // Soft amber for grief's tenderness
    enoughAsYouAre: '#B395D4', // Gentle lavender for self-compassion
    shadowWork: '#95A7D4',     // Deep twilight blue for shadow integration
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    strong: 'rgba(255, 255, 255, 0.2)',
    ultraLight: 'rgba(255, 255, 255, 0.05)',
    // Additional legitimate glass variations
    subtle: 'rgba(255, 255, 255, 0.08)',
    elevated: 'rgba(255, 255, 255, 0.10)',
    prominent: 'rgba(255, 255, 255, 0.20)',
    overlay: 'rgba(255, 255, 255, 0.3)',
    modal: 'rgba(255, 255, 255, 0.4)',
    focus: 'rgba(255, 255, 255, 0.5)',
    secondary: 'rgba(255, 255, 255, 0.6)',
    muted: 'rgba(255, 255, 255, 0.7)',
    primary: 'rgba(255, 255, 255, 0.8)',
  },
  // Emergency colors - ONLY for crisis hotline
  crisis: {
    red: '#DC2626',
    redHover: '#B91C1C',
  },
  // Neutral sacred tones
  neutral: {
    white: '#ffffff',
    whiteShort: '#fff', // Shorthand white
    black: '#000000',
    darkText: '#333', // Dark text for light backgrounds (emergency modal)
    transparent: 'transparent',
    // Dark overlays for modals/shadows
    blackLight: 'rgba(0, 0, 0, 0.15)',
    blackMedium: 'rgba(0, 0, 0, 0.2)',
    blackStrong: 'rgba(0, 0, 0, 0.3)',
    blackHeavy: 'rgba(0, 0, 0, 0.9)',
  },
  // Text colors
  text: {
    primary: '#1f2937',
    light: 'rgba(255, 255, 255, 0.9)',
    muted: 'rgba(255, 255, 255, 0.7)',
  }
} as const;

/**
 * FORBIDDEN COLORS - These must NEVER appear in our codebase
 */
export const FORBIDDEN_COLORS = [
  '#3B82F6', // Old blue
  '#10B981', // Old green  
  '#F59E0B', // Old amber
  '#EF4444', // Old red (except for crisis)
  '#8B5CF6', // Old purple
  '#06B6D4', // Old cyan
  '#F97316', // Old orange
  '#84CC16', // Old lime
  // Old purple system colors
  'rgba(168, 85, 247, 0.5)', // Purple focus
  'rgba(168, 85, 247, 0.9)', // Purple background
  'rgba(44, 44, 46, 0.95)', // Dark system modal
  'rgba(120, 120, 128, 0.32)', // iOS system separator
] as const;

/**
 * Utility function to validate if a color is sacred
 */
export const isSacredColor = (color: string): boolean => {
  const allSacredColors = Object.values(SACRED_PALETTE).flatMap(category => 
    typeof category === 'object' ? Object.values(category) : [category]
  ) as string[];
  return allSacredColors.includes(color);
};

/**
 * Utility function to check if a color is forbidden
 */
export const isForbiddenColor = (color: string): boolean => {
  return FORBIDDEN_COLORS.includes(color as any);
};

/**
 * Get all sacred color values as a flat array
 */
export const getAllSacredColors = (): string[] => {
  const colors: string[] = [];
  
  const addColors = (obj: any) => {
    Object.values(obj).forEach(value => {
      if (typeof value === 'string') {
        colors.push(value);
      } else if (typeof value === 'object') {
        addColors(value);
      }
    });
  };
  
  addColors(SACRED_PALETTE);
  return colors;
};