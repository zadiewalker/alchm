/**
 * ALCHM Crisis Typography Component
 * 
 * MISSION CRITICAL: Typography system optimized for crisis states.
 * Designed for maximum clarity during dissociation, panic, and trauma responses.
 * 
 * Design Principles:
 * - Extra-large text sizes for stress reading
 * - Increased line heights for visual breathing room
 * - Enhanced letter spacing for character recognition
 * - High contrast color combinations
 * - Clear visual hierarchy that works during cognitive impairment
 * - Trauma-informed spacing that doesn't feel overwhelming
 */

'use client';

import React from 'react';

export type CrisisTextVariant = 
  | 'emergency-heading'     // Critical emergency messages
  | 'crisis-heading'        // Main crisis page headings
  | 'support-heading'       // Support section headings
  | 'resource-title'        // Resource names/titles
  | 'instruction-text'      // Step-by-step instructions
  | 'body-text'             // General content
  | 'supportive-text'       // Encouraging/supportive messages
  | 'caption-text'          // Small supportive text
  | 'emergency-contact';    // Phone numbers/contact info

export type CrisisTextSize = 
  | 'xs'    // 14px
  | 'sm'    // 16px
  | 'base'  // 18px
  | 'lg'    // 20px
  | 'xl'    // 24px
  | '2xl'   // 28px
  | '3xl'   // 32px
  | '4xl'   // 36px
  | '5xl';  // 40px

export type CrisisTextWeight = 
  | 'light'     // 300
  | 'normal'    // 400
  | 'medium'    // 500
  | 'semibold'  // 600
  | 'bold';     // 700

export type CrisisTextColor = 
  | 'primary'           // Main text color
  | 'secondary'         // Secondary text
  | 'muted'             // Muted/disabled text
  | 'emergency'         // Emergency red
  | 'sage'              // Calming sage
  | 'supportive'        // Supportive blue
  | 'success'           // Success green
  | 'warning'           // Warning yellow
  | 'white'             // White text
  | 'inherit';          // Inherit from parent

interface CrisisTypographyProps {
  children: React.ReactNode;
  variant?: CrisisTextVariant;
  size?: CrisisTextSize;
  weight?: CrisisTextWeight;
  color?: CrisisTextColor;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'strong' | 'em';
  className?: string;
  id?: string;
  'aria-level'?: number;
  'data-testid'?: string;
  onClick?: () => void;
  highContrast?: boolean;
  reducedMotion?: boolean;
  stressReading?: boolean; // Extra accommodations for stress reading
}

/**
 * Crisis Typography Component
 * 
 * Provides trauma-informed typography with crisis-specific styling
 */
export const CrisisTypography: React.FC<CrisisTypographyProps> = ({
  children,
  variant,
  size,
  weight,
  color,
  as: Component = 'p',
  className = '',
  id,
  'aria-level': ariaLevel,
  'data-testid': testId,
  onClick,
  highContrast = false,
  reducedMotion = false,
  stressReading = false
}) => {
  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'emergency-heading':
        return {
          size: size || '4xl',
          weight: weight || 'semibold',
          color: color || 'emergency',
          component: Component === 'p' ? 'h1' : Component,
          lineHeight: '1.2',
          letterSpacing: '0.02em',
          marginBottom: '1.5rem'
        };
      
      case 'crisis-heading':
        return {
          size: size || '3xl',
          weight: weight || 'medium',
          color: color || 'sage',
          component: Component === 'p' ? 'h2' : Component,
          lineHeight: '1.3',
          letterSpacing: '0.015em',
          marginBottom: '1.25rem'
        };
      
      case 'support-heading':
        return {
          size: size || '2xl',
          weight: weight || 'medium',
          color: color || 'supportive',
          component: Component === 'p' ? 'h3' : Component,
          lineHeight: '1.4',
          letterSpacing: '0.01em',
          marginBottom: '1rem'
        };
      
      case 'resource-title':
        return {
          size: size || 'xl',
          weight: weight || 'semibold',
          color: color || 'primary',
          component: Component === 'p' ? 'h4' : Component,
          lineHeight: '1.4',
          letterSpacing: '0.005em',
          marginBottom: '0.75rem'
        };
      
      case 'instruction-text':
        return {
          size: size || 'lg',
          weight: weight || 'medium',
          color: color || 'primary',
          component: Component,
          lineHeight: '1.7',
          letterSpacing: '0.02em',
          marginBottom: '1rem'
        };
      
      case 'body-text':
        return {
          size: size || 'base',
          weight: weight || 'normal',
          color: color || 'primary',
          component: Component,
          lineHeight: '1.8',
          letterSpacing: '0.01em',
          marginBottom: '1rem'
        };
      
      case 'supportive-text':
        return {
          size: size || 'base',
          weight: weight || 'normal',
          color: color || 'supportive',
          component: Component,
          lineHeight: '1.7',
          letterSpacing: '0.015em',
          marginBottom: '0.75rem'
        };
      
      case 'caption-text':
        return {
          size: size || 'sm',
          weight: weight || 'normal',
          color: color || 'muted',
          component: Component === 'p' ? 'span' : Component,
          lineHeight: '1.6',
          letterSpacing: '0.025em',
          marginBottom: '0.5rem'
        };
      
      case 'emergency-contact':
        return {
          size: size || '2xl',
          weight: weight || 'bold',
          color: color || 'emergency',
          component: Component,
          lineHeight: '1.3',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem'
        };
      
      default:
        return {
          size: size || 'base',
          weight: weight || 'normal',
          color: color || 'primary',
          component: Component,
          lineHeight: '1.6',
          letterSpacing: '0',
          marginBottom: '0'
        };
    }
  };

  const styles = getVariantStyles();
  const FinalComponent = styles.component as keyof JSX.IntrinsicElements;

  // Build CSS classes
  const classes = [
    'crisis-typography',
    `crisis-text-${styles.size}`,
    `crisis-weight-${styles.weight}`,
    `crisis-color-${styles.color}`,
    variant && `crisis-variant-${variant}`,
    highContrast && 'crisis-high-contrast',
    reducedMotion && 'crisis-reduced-motion',
    stressReading && 'crisis-stress-reading',
    className
  ].filter(Boolean).join(' ');

  return (
    <FinalComponent
      className={classes}
      id={id}
      aria-level={ariaLevel}
      data-testid={testId}
      onClick={onClick}
      style={{
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        marginBottom: styles.marginBottom
      }}
    >
      {children}
      
      <style jsx>{`
        /* Base Crisis Typography Styles */
        .crisis-typography {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          word-wrap: break-word;
          hyphens: auto;
        }

        /* Size Classes */
        .crisis-text-xs { font-size: 0.875rem; }  /* 14px */
        .crisis-text-sm { font-size: 1rem; }      /* 16px */
        .crisis-text-base { font-size: 1.125rem; } /* 18px */
        .crisis-text-lg { font-size: 1.25rem; }   /* 20px */
        .crisis-text-xl { font-size: 1.5rem; }    /* 24px */
        .crisis-text-2xl { font-size: 1.75rem; }  /* 28px */
        .crisis-text-3xl { font-size: 2rem; }     /* 32px */
        .crisis-text-4xl { font-size: 2.25rem; }  /* 36px */
        .crisis-text-5xl { font-size: 2.5rem; }   /* 40px */

        /* Weight Classes */
        .crisis-weight-light { font-weight: 300; }
        .crisis-weight-normal { font-weight: 400; }
        .crisis-weight-medium { font-weight: 500; }
        .crisis-weight-semibold { font-weight: 600; }
        .crisis-weight-bold { font-weight: 700; }

        /* Color Classes */
        .crisis-color-primary { color: var(--crisis-neutral-800, #343a40); }
        .crisis-color-secondary { color: var(--crisis-neutral-700, #495057); }
        .crisis-color-muted { color: var(--crisis-neutral-600, #6c757d); }
        .crisis-color-emergency { color: var(--crisis-emergency-red, #b87d7d); }
        .crisis-color-sage { color: var(--crisis-sage-deep, #6b8559); }
        .crisis-color-supportive { color: var(--crisis-support-blue, #7da3b8); }
        .crisis-color-success { color: var(--crisis-validation-success, #7bb87d); }
        .crisis-color-warning { color: var(--crisis-support-yellow, #c4b87d); }
        .crisis-color-white { color: white; }
        .crisis-color-inherit { color: inherit; }

        /* Variant-Specific Styles */
        .crisis-variant-emergency-heading {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .crisis-variant-crisis-heading {
          border-bottom: 2px solid var(--crisis-sage-muted, #e8ede4);
          padding-bottom: 0.5rem;
        }

        .crisis-variant-emergency-contact {
          font-feature-settings: 'tnum' 1; /* Tabular numbers for phone numbers */
          text-decoration: underline;
          text-decoration-color: var(--crisis-emergency-red, #b87d7d);
          text-decoration-thickness: 2px;
          text-underline-offset: 4px;
        }

        .crisis-variant-instruction-text {
          background: var(--crisis-sage-light, #f7f9f6);
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid var(--crisis-sage-primary, #8ba675);
        }

        /* High Contrast Mode */
        .crisis-high-contrast,
        .crisis-typography.crisis-high-contrast {
          font-weight: 600;
        }

        .crisis-high-contrast.crisis-color-primary { color: #000000; }
        .crisis-high-contrast.crisis-color-secondary { color: #333333; }
        .crisis-high-contrast.crisis-color-emergency { color: #8b0000; }
        .crisis-high-contrast.crisis-color-sage { color: #2d4a22; }

        /* Stress Reading Accommodations */
        .crisis-stress-reading {
          font-size: 1.25em !important;
          line-height: 1.9 !important;
          letter-spacing: 0.05em !important;
          word-spacing: 0.1em;
        }

        .crisis-stress-reading.crisis-text-xs { font-size: 1.125rem !important; }
        .crisis-stress-reading.crisis-text-sm { font-size: 1.25rem !important; }
        .crisis-stress-reading.crisis-text-base { font-size: 1.375rem !important; }
        .crisis-stress-reading.crisis-text-lg { font-size: 1.5rem !important; }
        .crisis-stress-reading.crisis-text-xl { font-size: 1.75rem !important; }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .crisis-text-5xl { font-size: 2rem; }    /* 32px on mobile */
          .crisis-text-4xl { font-size: 1.875rem; } /* 30px on mobile */
          .crisis-text-3xl { font-size: 1.75rem; }  /* 28px on mobile */
          .crisis-text-2xl { font-size: 1.5rem; }   /* 24px on mobile */
          
          .crisis-typography {
            line-height: 1.7 !important;
          }
          
          .crisis-variant-instruction-text {
            padding: 0.75rem;
            border-radius: 6px;
          }
          
          /* Even larger text for mobile crisis scenarios */
          .crisis-stress-reading {
            font-size: 1.375em !important;
            line-height: 2 !important;
          }
        }

        /* Reduced Motion */
        .crisis-reduced-motion {
          transition: none;
        }

        /* Focus States */
        .crisis-typography:focus {
          outline: 3px solid var(--crisis-sage-primary, #8ba675);
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Selection Styles */
        .crisis-typography::selection {
          background: var(--crisis-sage-light, #f7f9f6);
          color: var(--crisis-sage-deep, #6b8559);
        }

        /* Print Styles */
        @media print {
          .crisis-typography {
            font-size: 12pt !important;
            line-height: 1.6 !important;
            color: black !important;
          }
          
          .crisis-variant-emergency-contact {
            font-size: 14pt !important;
            font-weight: bold !important;
          }
        }

        /* Accessibility Media Queries */
        @media (prefers-contrast: high) {
          .crisis-typography {
            font-weight: 600;
          }
          
          .crisis-color-emergency { color: #8b0000; }
          .crisis-color-sage { color: #2d4a22; }
          .crisis-color-supportive { color: #1a5490; }
        }

        @media (prefers-reduced-motion: reduce) {
          .crisis-typography {
            transition: none;
          }
        }

        /* Font Loading States */
        .crisis-typography {
          font-display: swap; /* Ensure text remains visible during font load */
        }
      `}</style>
    </FinalComponent>
  );
};

// Preset components for common crisis typography patterns
export const CrisisHeading = {
  Emergency: (props: Omit<CrisisTypographyProps, 'variant'>) => (
    <CrisisTypography variant="emergency-heading" {...props} />
  ),
  
  Crisis: (props: Omit<CrisisTypographyProps, 'variant'>) => (
    <CrisisTypography variant="crisis-heading" {...props} />
  ),
  
  Support: (props: Omit<CrisisTypographyProps, 'variant'>) => (
    <CrisisTypography variant="support-heading" {...props} />
  ),
  
  Resource: (props: Omit<CrisisTypographyProps, 'variant'>) => (
    <CrisisTypography variant="resource-title" {...props} />
  )
};

export const CrisisText = {
  Instruction: (props: Omit<CrisisTypographyProps, 'variant'>) => (
    <CrisisTypography variant="instruction-text" {...props} />
  ),
  
  Body: (props: Omit<CrisisTypographyProps, 'variant'>) => (
    <CrisisTypography variant="body-text" {...props} />
  ),
  
  Supportive: (props: Omit<CrisisTypographyProps, 'variant'>) => (
    <CrisisTypography variant="supportive-text" {...props} />
  ),
  
  Caption: (props: Omit<CrisisTypographyProps, 'variant'>) => (
    <CrisisTypography variant="caption-text" {...props} />
  ),
  
  EmergencyContact: (props: Omit<CrisisTypographyProps, 'variant'>) => (
    <CrisisTypography variant="emergency-contact" {...props} />
  )
};

// Hook for responsive crisis typography
export const useCrisisTypography = () => {
  const [stressReading, setStressReading] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    // Detect user preferences
    const detectPreferences = () => {
      setHighContrast(window.matchMedia('(prefers-contrast: high)').matches);
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    detectPreferences();
    
    // Listen for changes
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    contrastQuery.addListener(detectPreferences);
    motionQuery.addListener(detectPreferences);
    
    return () => {
      contrastQuery.removeListener(detectPreferences);
      motionQuery.removeListener(detectPreferences);
    };
  }, []);

  return {
    stressReading,
    setStressReading,
    highContrast,
    reducedMotion,
    // Helper function to get crisis-appropriate props
    getCrisisProps: (overrides?: Partial<CrisisTypographyProps>) => ({
      highContrast,
      reducedMotion,
      stressReading,
      ...overrides
    })
  };
};

export default CrisisTypography;