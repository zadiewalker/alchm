/**
 * ALCHM Design System Patterns
 * Jony Ive-inspired unified component architecture for trauma-informed design
 * "Simplicity is the ultimate sophistication" - Applied to every interaction
 */

// Common CSS class patterns for consistent component design
export const DESIGN_PATTERNS = {
  // Base containers using sanctuary glass morphism
  containers: {
    glass: 'sanctuary-glass border border-sage-200 rounded-3xl shadow-soft',
    solid: 'bg-sanctuary-white border border-sage-200 rounded-3xl shadow-soft',
    emergency: 'bg-red-50 border border-red-200 rounded-3xl shadow-nurturing',
  },

  // Button patterns following trauma-informed principles with luxury typography
  buttons: {
    primary: 'bg-sage-400 hover:bg-sage-500 text-sanctuary-white rounded-2xl font-medium transition-all duration-300 ease-sanctuary hover:transform hover:scale-[1.01] touch-target-default focus:outline-none focus:ring-2 focus:ring-sage-400/50',
    secondary: 'bg-sanctuary-white hover:bg-sage-50 text-sage-700 border border-sage-200 hover:border-sage-300 rounded-2xl font-medium transition-all duration-300 ease-sanctuary hover:transform hover:scale-[1.01] touch-target-default focus:outline-none focus:ring-2 focus:ring-sage-400/50',
    crisis: 'bg-crisis-red hover:bg-emergency-red text-sanctuary-white rounded-2xl font-medium transition-all duration-300 ease-sanctuary hover:transform hover:scale-[1.01] touch-target-crisis focus:outline-none focus:ring-2 focus:ring-red-400/50',
    ghost: 'bg-transparent hover:bg-sage-100 text-sage-700 rounded-2xl font-normal transition-all duration-300 ease-sanctuary hover:transform hover:scale-[1.01] touch-target-default focus:outline-none focus:ring-2 focus:ring-sage-400/50',
  },

  // Typography patterns with luxury hierarchy and trauma-informed line heights
  typography: {
    // Hero text - ultra-light for visual sophistication
    display: 'text-sage-800 font-light text-4xl leading-tight tracking-tight',
    // Page headings - light weight for elegant hierarchy
    heading: 'text-sage-800 font-light text-2xl leading-snug tracking-tight',
    // Section headings - light weight for consistent visual weight
    subheading: 'text-sage-600 font-light text-xl leading-relaxed tracking-normal',
    // Body text - normal weight for optimal readability
    body: 'text-sage-700 font-normal text-base leading-relaxed tracking-normal',
    // Supporting text - normal weight for readability
    caption: 'text-sage-500 font-normal text-sm leading-relaxed tracking-wide',
    // Emphasis text - medium weight only for true emphasis
    emphasis: 'text-sage-800 font-medium text-base leading-relaxed tracking-normal',
    // Crisis text with enhanced readability
    crisis: 'text-red-700 font-medium text-lg leading-loose tracking-wide',
  },

  // Input field patterns
  inputs: {
    base: 'w-full px-4 py-3 border-2 border-sage-200 rounded-2xl text-sage-800 bg-sanctuary-white focus:border-sage-400 focus:outline-none transition-all duration-300 ease-sanctuary touch-target-crisis',
    error: 'w-full px-4 py-3 border-2 border-red-300 rounded-2xl text-sage-800 bg-red-50 focus:border-red-400 focus:outline-none transition-all duration-300 ease-sanctuary touch-target-crisis',
  },

  // Icon containers with consistent sizing
  icons: {
    small: 'w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center',
    medium: 'w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center',
    large: 'w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center',
    crisis: 'w-10 h-10 bg-red-100 rounded-full flex items-center justify-center',
  },

  // Spacing patterns using 8px grid
  spacing: {
    section: 'space-y-6 p-6',
    compact: 'space-y-3 p-4',
    comfortable: 'space-y-8 p-8',
    emergency: 'space-y-4 p-6',
  },

  // Animation patterns
  animations: {
    gentle: 'transition-all duration-300 ease-sanctuary',
    instant: 'transition-all duration-100 ease-sanctuary',
    slow: 'transition-all duration-500 ease-sanctuary',
    crisis: 'transition-all duration-200 ease-sanctuary animate-crisis-attention',
  },
} as const;

// Touch target size calculator for different contexts
export const getTouchTargetClass = (context: 'default' | 'crisis' | 'emergency' | 'tremor') => {
  switch (context) {
    case 'crisis':
      return 'touch-target-crisis';
    case 'emergency':
      return 'touch-target-emergency';
    case 'tremor':
      return 'touch-target-emergency'; // Larger targets for motor difficulties
    default:
      return 'touch-target-default';
  }
};

// Component base props interface for consistency
export interface BaseComponentProps {
  children?: React.ReactNode;
  className?: string;
  crisisMode?: boolean;
  emergencyMode?: boolean;
  reducedMotion?: boolean;
  highContrast?: boolean;
}

// Crisis-aware styling helper
export const getCrisisAwareStyles = (
  baseStyles: string,
  crisisMode: boolean = false,
  emergencyMode: boolean = false
) => {
  let styles = baseStyles;
  
  if (crisisMode) {
    styles = styles.replace('touch-target-default', 'touch-target-crisis');
    styles = styles.replace('duration-300', 'duration-200');
  }
  
  if (emergencyMode) {
    styles = styles.replace('touch-target-default', 'touch-target-emergency');
    styles = styles.replace('touch-target-crisis', 'touch-target-emergency');
    styles = styles.replace('duration-300', 'duration-100');
  }
  
  return styles;
};

// Accessibility enhancement helper
export const getAccessibilityProps = (
  crisisMode: boolean = false,
  emergencyMode: boolean = false
) => ({
  'aria-live': crisisMode || emergencyMode ? 'polite' : undefined,
  'role': crisisMode || emergencyMode ? 'alert' : undefined,
  'data-crisis-mode': crisisMode,
  'data-emergency-mode': emergencyMode,
});

// Color palette validation
export const SAGE_PALETTE = {
  50: '#f6f7f4',
  100: '#e8eae3', 
  200: '#d1d6c7',
  300: '#b4bca2',
  400: '#a4b792', // Primary sage
  500: '#93a682',
  600: '#7a8c6a',
  700: '#626d54',
  800: '#4f5843',
  900: '#3d4435',
} as const;

export const SANCTUARY_PALETTE = {
  white: '#fefcfb',
  gray: {
    50: '#f9f9f9',
    100: '#f1f1f1',
    200: '#e5e5e5',
    300: '#d1d1d1',
    400: '#a8a8a8',
    500: '#8c8c8c',
    600: '#6b6b6b',
    700: '#4a4a4a',
    800: '#2d2d2d',
    900: '#1a1a1a',
  },
} as const;

// Luxury typography validation for Jony Ive standards
export const LUXURY_FONT_WEIGHTS = ['light', 'normal', 'medium'] as const;
export const DEPRECATED_FONT_WEIGHTS = ['thin', 'semibold', 'bold', 'extrabold', 'black'] as const;

// Validation function to ensure components use luxury design system
export const validateComponentStyles = (className: string): {
  isValid: boolean;
  warnings: string[];
} => {
  const warnings: string[] = [];
  
  // Check for hardcoded colors
  if (className.includes('#')) {
    warnings.push('Hardcoded hex colors detected. Use design system tokens.');
  }
  
  // Check for non-luxury font weights
  DEPRECATED_FONT_WEIGHTS.forEach(weight => {
    if (className.includes(`font-${weight}`)) {
      warnings.push(`Deprecated font-${weight} detected. Use font-light, font-normal, or font-medium only for luxury hierarchy.`);
    }
  });
  
  // Check for non-standard spacing
  if (className.includes('p-') && !className.match(/p-(4|6|8)/)) {
    warnings.push('Non-standard padding detected. Use 8px grid system.');
  }
  
  // Check for proper touch targets
  if (className.includes('min-h-') && !className.includes('touch-target-')) {
    warnings.push('Manual height detected. Use touch-target classes for accessibility.');
  }
  
  // Check for crisis-appropriate transitions
  if (className.includes('duration-') && !className.includes('ease-sanctuary')) {
    warnings.push('Non-sanctuary timing detected. Use --ease-sanctuary for gentle animations.');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
  };
};

// Helper to build consistent modal/overlay styles
export const buildModalStyles = (variant: 'default' | 'crisis' | 'emergency' = 'default') => {
  const baseBackdrop = 'fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4';
  const baseModal = 'bg-sanctuary-white rounded-3xl max-w-md w-full shadow-sanctuary border';
  
  switch (variant) {
    case 'crisis':
      return {
        backdrop: `${baseBackdrop} bg-sage-900/90`,
        modal: `${baseModal} border-red-200`,
        content: DESIGN_PATTERNS.spacing.emergency,
      };
    case 'emergency':
      return {
        backdrop: `${baseBackdrop} bg-red-900/95`,
        modal: `${baseModal} border-red-300 shadow-nurturing`,
        content: DESIGN_PATTERNS.spacing.emergency,
      };
    default:
      return {
        backdrop: `${baseBackdrop} bg-sage-900/90`,
        modal: `${baseModal} border-sage-200`,
        content: DESIGN_PATTERNS.spacing.section,
      };
  }
};