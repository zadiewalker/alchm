/**
 * ALCHM Crisis-Safe Design System Export Index
 * 
 * MISSION CRITICAL: Centralized exports for all crisis-safe design components.
 * Every component exported here prioritizes user safety and suicide prevention.
 */

// Crisis-Safe Design Components
export { CrisisEmergencyButton } from './CrisisEmergencyButton';
export type { EmergencyButtonVariant, EmergencyButtonSize } from './CrisisEmergencyButton';

export { CrisisResourcePage } from './CrisisResourcePage';
export type { CrisisResource } from './CrisisResourcePage';

export { CrisisLoadingStates, CrisisLoadingPresets } from './CrisisLoadingStates';
export type { LoadingVariant, LoadingSize } from './CrisisLoadingStates';

export { 
  CrisisTypography, 
  CrisisHeading, 
  CrisisText, 
  useCrisisTypography 
} from './CrisisTypography';
export type { 
  CrisisTextVariant, 
  CrisisTextSize, 
  CrisisTextWeight, 
  CrisisTextColor 
} from './CrisisTypography';

export { 
  CrisisBreathingLayouts, 
  CrisisLayouts, 
  useCrisisBreathing 
} from './CrisisBreathingLayouts';
export type { 
  BreathingLayoutVariant, 
  BreathingSpacing, 
  BackgroundIntensity 
} from './CrisisBreathingLayouts';

export { 
  CrisisQuickAccess, 
  defaultQuickAccessResources 
} from './CrisisQuickAccess';
export type { 
  QuickAccessResource, 
  QuickAccessPosition, 
  QuickAccessSize 
} from './CrisisQuickAccess';

// Legacy/Existing Crisis Components
export { CrisisEmergencyInterface } from './CrisisEmergencyInterface';

// Crisis-Safe Design Utility Functions
export const crisisSafeUtils = {
  /**
   * Apply crisis mode to a DOM element
   */
  enableCrisisMode: (element: HTMLElement) => {
    element.classList.add('crisis-mode');
  },

  /**
   * Remove crisis mode from a DOM element
   */
  disableCrisisMode: (element: HTMLElement) => {
    element.classList.remove('crisis-mode');
  },

  /**
   * Check if crisis mode is active
   */
  isCrisisModeActive: (element: HTMLElement) => {
    return element.classList.contains('crisis-mode');
  },

  /**
   * Get crisis-safe color values
   */
  getCrisisColors: () => ({
    emergencyRed: '#b87d7d',
    emergencyRedHover: '#a66d6d',
    emergencyRedBg: '#f5f0f0',
    sagePrimary: '#8ba675',
    sageLight: '#f7f9f6',
    sanctuary: '#fefefe',
    sanctuaryWarm: '#fefcfb'
  }),

  /**
   * Get crisis-safe spacing values
   */
  getCrisisSpacing: () => ({
    tight: '1rem',
    comfortable: '2rem', 
    generous: '3rem',
    expansive: '4rem'
  }),

  /**
   * Apply crisis-safe styles to any element
   */
  applyCrisisSafeStyles: (element: HTMLElement) => {
    element.style.borderRadius = 'var(--crisis-safe-radius, 12px)';
    element.style.boxShadow = 'var(--crisis-safe-shadow, 0 2px 8px rgba(0, 0, 0, 0.1))';
    element.style.transition = 'none';
  }
};

// Crisis-Safe Design Constants
export const CRISIS_DESIGN_CONSTANTS = {
  COLORS: {
    EMERGENCY_RED: '#b87d7d',
    EMERGENCY_RED_HOVER: '#a66d6d', 
    EMERGENCY_RED_ACTIVE: '#955d5d',
    EMERGENCY_RED_BG: '#f5f0f0',
    SAGE_PRIMARY: '#8ba675',
    SAGE_LIGHT: '#f7f9f6',
    SAGE_DEEP: '#6b8559',
    SANCTUARY: '#fefefe',
    SANCTUARY_WARM: '#fefcfb'
  },
  
  SPACING: {
    TIGHT: '1rem',
    COMFORTABLE: '2rem',
    GENEROUS: '3rem', 
    EXPANSIVE: '4rem'
  },
  
  TOUCH_TARGETS: {
    DEFAULT: '44px',
    LARGE: '48px',
    CRISIS: '52px',
    EMERGENCY: '64px'
  },
  
  TYPOGRAPHY: {
    SIZES: {
      XS: '0.875rem',
      SM: '1rem',
      BASE: '1.125rem',
      LG: '1.25rem',
      XL: '1.5rem',
      '2XL': '1.75rem',
      '3XL': '2rem'
    },
    LINE_HEIGHTS: {
      TIGHT: '1.3',
      COMFORTABLE: '1.6',
      RELAXED: '1.8',
      LOOSE: '1.9'
    }
  },
  
  ANIMATIONS: {
    DURATION_CRISIS_SAFE: '0.01ms',
    DURATION_GENTLE: '300ms',
    EASING_CRISIS_SAFE: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const;

// Crisis Detection Utilities
export const crisisDetectionUtils = {
  /**
   * Detect if user might be in crisis based on interaction patterns
   */
  detectCrisisSignals: (interactions: Array<{ type: string; timestamp: number; duration?: number }>) => {
    // Rapid, repeated interactions might indicate panic
    const rapidInteractions = interactions.filter((_, i, arr) => {
      if (i === 0) return false;
      return arr[i].timestamp - arr[i - 1].timestamp < 500; // Less than 500ms apart
    });
    
    // Very long pauses might indicate dissociation
    const longPauses = interactions.filter((_, i, arr) => {
      if (i === 0) return false;
      return arr[i].timestamp - arr[i - 1].timestamp > 30000; // More than 30s apart
    });
    
    return {
      possiblePanic: rapidInteractions.length > 5,
      possibleDissociation: longPauses.length > 3,
      riskLevel: rapidInteractions.length > 5 || longPauses.length > 3 ? 'high' : 'normal'
    };
  },

  /**
   * Check if current time might indicate increased risk
   */
  checkTemporalRiskFactors: () => {
    const now = new Date();
    const hour = now.getHours();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const isLateNight = hour >= 22 || hour <= 5;
    const isHoliday = false; // Would need external holiday API
    
    return {
      isHighRiskTime: isLateNight || isWeekend,
      timeOfDay: hour < 6 ? 'early-morning' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening',
      riskFactors: {
        lateNight: isLateNight,
        weekend: isWeekend,
        holiday: isHoliday
      }
    };
  }
};

// Crisis Resource Validation
export const validateCrisisResource = (resource: Partial<CrisisResource>): resource is CrisisResource => {
  return !!(
    resource.id &&
    resource.name &&
    resource.description &&
    resource.type &&
    (resource.contact?.phone || resource.contact?.text || resource.contact?.website) &&
    typeof resource.available24_7 === 'boolean' &&
    Array.isArray(resource.languages) &&
    Array.isArray(resource.specialties) &&
    typeof resource.trusted === 'boolean' &&
    typeof resource.priority === 'string'
  );
};

// Crisis-Safe Component Props Validator
export const validateCrisisSafeProps = <T extends Record<string, any>>(
  props: T,
  requiredProps: (keyof T)[]
): boolean => {
  return requiredProps.every(prop => {
    const value = props[prop];
    return value !== undefined && value !== null && value !== '';
  });
};

// Emergency Contact Formatter
export const formatEmergencyContact = (contact: string): string => {
  // Format phone numbers for accessibility
  if (contact.match(/^\d{3}$/)) {
    return contact; // Already formatted (like 988)
  }
  
  if (contact.match(/^\d{6}$/)) {
    return contact; // Text codes (like 741741)
  }
  
  if (contact.match(/^\d{10}$/)) {
    return `(${contact.slice(0, 3)}) ${contact.slice(3, 6)}-${contact.slice(6)}`;
  }
  
  return contact;
};

// Crisis-Safe Error Boundary Props
export interface CrisisSafeErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  enableCrisisMode?: boolean;
}

// Default crisis-safe error fallback
export const DefaultCrisisErrorFallback: React.FC<{ error: Error; reset: () => void }> = ({
  error,
  reset
}) => (
  <CrisisLayouts.Container
    spacing="generous"
    backgroundIntensity="warm"
    centerContent
    className="crisis-priority-high"
  >
    <CrisisHeading.Crisis>Something went wrong</CrisisHeading.Crisis>
    <CrisisText.Body>
      We encountered an unexpected error. Your safety is our priority.
    </CrisisText.Body>
    
    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <CrisisEmergencyButton
        variant="safety"
        onClick={reset}
      >
        Try Again
      </CrisisEmergencyButton>
      
      <CrisisEmergencyButton
        variant="call"
        href="tel:988"
      >
        Get Help Now
      </CrisisEmergencyButton>
    </div>
    
    <CrisisText.Caption style={{ marginTop: '1rem' }}>
      If you're in crisis, please reach out for immediate support.
    </CrisisText.Caption>
  </CrisisLayouts.Container>
);

export default {
  // Components
  CrisisEmergencyButton,
  CrisisResourcePage,
  CrisisLoadingStates,
  CrisisTypography,
  CrisisBreathingLayouts,
  CrisisQuickAccess,
  
  // Utilities
  crisisSafeUtils,
  crisisDetectionUtils,
  
  // Constants
  CRISIS_DESIGN_CONSTANTS,
  
  // Validators
  validateCrisisResource,
  validateCrisisSafeProps,
  formatEmergencyContact
};