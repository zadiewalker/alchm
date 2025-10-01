/**
 * ALCHM Crisis Breathing Layouts Component
 * 
 * MISSION CRITICAL: Breathing space layouts with off-white calming backgrounds.
 * Designed to provide visual sanctuary during crisis moments.
 * 
 * Design Principles:
 * - Off-white backgrounds that provide visual calm without sterility
 * - Generous spacing that doesn't feel overwhelming
 * - Gentle gradients that create depth without distraction
 * - Rounded corners that feel safe and non-threatening
 * - Flexible layouts that work across all device sizes
 * - Visual rhythms that support rather than agitate
 */

'use client';

import React from 'react';

export type BreathingLayoutVariant = 
  | 'sanctuary'       // Full-page sanctuary layout
  | 'container'       // Content container with breathing space
  | 'card'            // Card-style layout with soft edges
  | 'section'         // Section separator with breathing room
  | 'panel'           // Side panel or modal content
  | 'inline'          // Inline content with subtle background
  | 'emergency';      // Emergency content with priority styling

export type BreathingSpacing = 
  | 'tight'           // Minimal breathing space
  | 'comfortable'     // Standard breathing space
  | 'generous'        // Extra breathing space
  | 'expansive';      // Maximum breathing space

export type BackgroundIntensity = 
  | 'subtle'          // Very light background
  | 'soft'            // Gentle background
  | 'warm'            // Warm, welcoming background
  | 'cool'            // Cool, calming background
  | 'neutral';        // Balanced neutral background

interface CrisisBreathingLayoutsProps {
  children: React.ReactNode;
  variant?: BreathingLayoutVariant;
  spacing?: BreathingSpacing;
  backgroundIntensity?: BackgroundIntensity;
  className?: string;
  id?: string;
  'data-testid'?: string;
  maxWidth?: string;
  centerContent?: boolean;
  addBorder?: boolean;
  addShadow?: boolean;
  role?: string;
  'aria-label'?: string;
}

/**
 * Crisis Breathing Layouts Component
 * 
 * Provides calming, spacious layouts optimized for crisis states
 */
export const CrisisBreathingLayouts: React.FC<CrisisBreathingLayoutsProps> = ({
  children,
  variant = 'container',
  spacing = 'comfortable',
  backgroundIntensity = 'soft',
  className = '',
  id,
  'data-testid': testId,
  maxWidth,
  centerContent = false,
  addBorder = false,
  addShadow = false,
  role,
  'aria-label': ariaLabel
}) => {
  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'sanctuary':
        return {
          element: 'main',
          baseClass: 'crisis-sanctuary-layout',
          minHeight: '100vh',
          fullWidth: true,
          padding: 'var(--sanctuary-padding)',
          background: 'var(--sanctuary-background)'
        };
      
      case 'container':
        return {
          element: 'div',
          baseClass: 'crisis-container-layout',
          maxWidth: maxWidth || '800px',
          margin: '0 auto',
          padding: 'var(--container-padding)',
          background: 'var(--container-background)'
        };
      
      case 'card':
        return {
          element: 'div',
          baseClass: 'crisis-card-layout',
          borderRadius: '20px',
          padding: 'var(--card-padding)',
          background: 'var(--card-background)',
          border: addBorder ? 'var(--card-border)' : 'none',
          boxShadow: addShadow ? 'var(--card-shadow)' : 'none'
        };
      
      case 'section':
        return {
          element: 'section',
          baseClass: 'crisis-section-layout',
          padding: 'var(--section-padding)',
          marginBottom: 'var(--section-margin)',
          background: 'var(--section-background)',
          borderBottom: '1px solid var(--section-border)'
        };
      
      case 'panel':
        return {
          element: 'aside',
          baseClass: 'crisis-panel-layout',
          padding: 'var(--panel-padding)',
          background: 'var(--panel-background)',
          borderRadius: '16px',
          border: addBorder ? 'var(--panel-border)' : 'none'
        };
      
      case 'inline':
        return {
          element: 'div',
          baseClass: 'crisis-inline-layout',
          padding: 'var(--inline-padding)',
          background: 'var(--inline-background)',
          borderRadius: '12px',
          display: 'inline-block'
        };
      
      case 'emergency':
        return {
          element: 'div',
          baseClass: 'crisis-emergency-layout',
          padding: 'var(--emergency-padding)',
          background: 'var(--emergency-background)',
          borderRadius: '16px',
          border: '2px solid var(--emergency-border)',
          boxShadow: 'var(--emergency-shadow)'
        };
      
      default:
        return {
          element: 'div',
          baseClass: 'crisis-default-layout',
          padding: 'var(--default-padding)',
          background: 'var(--default-background)'
        };
    }
  };

  const styles = getVariantStyles();
  const Element = styles.element as keyof JSX.IntrinsicElements;

  // Build CSS classes
  const classes = [
    'crisis-breathing-layout',
    styles.baseClass,
    `spacing-${spacing}`,
    `background-${backgroundIntensity}`,
    centerContent && 'center-content',
    className
  ].filter(Boolean).join(' ');

  return (
    <Element
      className={classes}
      id={id}
      data-testid={testId}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
      
      <style jsx>{`
        /* Base Crisis Breathing Layout Styles */
        .crisis-breathing-layout {
          box-sizing: border-box;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        /* CSS Variables for Dynamic Styling */
        .crisis-breathing-layout {
          /* Sanctuary Colors */
          --sanctuary-pure: #fefefe;
          --sanctuary-warm: #fefcfb;
          --sanctuary-cool: #fbfcfe;
          --sanctuary-soft: #fcfcfc;
          --sanctuary-neutral: #fafafa;
          
          /* Sage Tints */
          --sage-tint-subtle: rgba(139, 166, 117, 0.03);
          --sage-tint-soft: rgba(139, 166, 117, 0.05);
          --sage-tint-warm: rgba(139, 166, 117, 0.08);
          --sage-tint-cool: rgba(139, 166, 117, 0.06);
          --sage-tint-neutral: rgba(139, 166, 117, 0.04);
          
          /* Emergency Tints */
          --emergency-tint: rgba(184, 125, 125, 0.05);
          --emergency-border-color: rgba(184, 125, 125, 0.2);
          
          /* Spacing Variables */
          --spacing-tight: 1rem;
          --spacing-comfortable: 2rem;
          --spacing-generous: 3rem;
          --spacing-expansive: 4rem;
          
          /* Mobile Spacing */
          --spacing-tight-mobile: 0.75rem;
          --spacing-comfortable-mobile: 1.5rem;
          --spacing-generous-mobile: 2rem;
          --spacing-expansive-mobile: 2.5rem;
        }

        /* Background Intensity Variants */
        .background-subtle {
          --sanctuary-background: var(--sanctuary-pure);
          --container-background: var(--sage-tint-subtle);
          --card-background: var(--sanctuary-warm);
          --section-background: transparent;
          --panel-background: var(--sanctuary-soft);
          --inline-background: var(--sage-tint-subtle);
          --emergency-background: var(--emergency-tint);
        }

        .background-soft {
          --sanctuary-background: var(--sanctuary-warm);
          --container-background: var(--sage-tint-soft);
          --card-background: var(--sanctuary-pure);
          --section-background: var(--sage-tint-subtle);
          --panel-background: var(--sanctuary-warm);
          --inline-background: var(--sage-tint-soft);
          --emergency-background: var(--emergency-tint);
        }

        .background-warm {
          --sanctuary-background: var(--sanctuary-warm);
          --container-background: var(--sage-tint-warm);
          --card-background: var(--sanctuary-pure);
          --section-background: var(--sage-tint-soft);
          --panel-background: var(--sanctuary-warm);
          --inline-background: var(--sage-tint-warm);
          --emergency-background: rgba(184, 125, 125, 0.08);
        }

        .background-cool {
          --sanctuary-background: var(--sanctuary-cool);
          --container-background: var(--sage-tint-cool);
          --card-background: var(--sanctuary-pure);
          --section-background: var(--sage-tint-subtle);
          --panel-background: var(--sanctuary-cool);
          --inline-background: var(--sage-tint-cool);
          --emergency-background: var(--emergency-tint);
        }

        .background-neutral {
          --sanctuary-background: var(--sanctuary-neutral);
          --container-background: var(--sage-tint-neutral);
          --card-background: var(--sanctuary-pure);
          --section-background: transparent;
          --panel-background: var(--sanctuary-neutral);
          --inline-background: var(--sage-tint-neutral);
          --emergency-background: var(--emergency-tint);
        }

        /* Spacing Variants */
        .spacing-tight {
          --sanctuary-padding: var(--spacing-tight);
          --container-padding: var(--spacing-tight);
          --card-padding: var(--spacing-tight);
          --section-padding: var(--spacing-tight) 0;
          --section-margin: var(--spacing-tight);
          --panel-padding: var(--spacing-tight);
          --inline-padding: calc(var(--spacing-tight) / 2);
          --emergency-padding: var(--spacing-tight);
          --default-padding: var(--spacing-tight);
        }

        .spacing-comfortable {
          --sanctuary-padding: var(--spacing-comfortable);
          --container-padding: var(--spacing-comfortable);
          --card-padding: var(--spacing-comfortable);
          --section-padding: var(--spacing-comfortable) 0;
          --section-margin: var(--spacing-comfortable);
          --panel-padding: var(--spacing-comfortable);
          --inline-padding: var(--spacing-comfortable);
          --emergency-padding: var(--spacing-comfortable);
          --default-padding: var(--spacing-comfortable);
        }

        .spacing-generous {
          --sanctuary-padding: var(--spacing-generous);
          --container-padding: var(--spacing-generous);
          --card-padding: var(--spacing-generous);
          --section-padding: var(--spacing-generous) 0;
          --section-margin: var(--spacing-generous);
          --panel-padding: var(--spacing-generous);
          --inline-padding: calc(var(--spacing-generous) / 1.5);
          --emergency-padding: var(--spacing-generous);
          --default-padding: var(--spacing-generous);
        }

        .spacing-expansive {
          --sanctuary-padding: var(--spacing-expansive);
          --container-padding: var(--spacing-expansive);
          --card-padding: var(--spacing-expansive);
          --section-padding: var(--spacing-expansive) 0;
          --section-margin: var(--spacing-expansive);
          --panel-padding: var(--spacing-expansive);
          --inline-padding: var(--spacing-generous);
          --emergency-padding: var(--spacing-expansive);
          --default-padding: var(--spacing-expansive);
        }

        /* Layout-Specific Styles */
        .crisis-sanctuary-layout {
          background: var(--sanctuary-background);
          min-height: 100vh;
          min-height: 100dvh;
          padding: var(--sanctuary-padding);
          display: flex;
          flex-direction: column;
        }

        .crisis-container-layout {
          background: var(--container-background);
          max-width: 800px;
          margin: 0 auto;
          padding: var(--container-padding);
          border-radius: 20px;
          position: relative;
        }

        .crisis-card-layout {
          background: var(--card-background);
          padding: var(--card-padding);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .crisis-card-layout::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            var(--sage-tint-subtle) 0%,
            transparent 50%,
            var(--sage-tint-subtle) 100%
          );
          pointer-events: none;
          opacity: 0.5;
        }

        .crisis-card-layout > * {
          position: relative;
          z-index: 2;
        }

        .crisis-section-layout {
          background: var(--section-background);
          padding: var(--section-padding);
          margin-bottom: var(--section-margin);
          border-bottom: 1px solid rgba(139, 166, 117, 0.1);
        }

        .crisis-section-layout:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .crisis-panel-layout {
          background: var(--panel-background);
          padding: var(--panel-padding);
          border-radius: 16px;
          border: 1px solid rgba(139, 166, 117, 0.1);
        }

        .crisis-inline-layout {
          background: var(--inline-background);
          padding: var(--inline-padding);
          border-radius: 12px;
          display: inline-block;
        }

        .crisis-emergency-layout {
          background: var(--emergency-background);
          padding: var(--emergency-padding);
          border-radius: 16px;
          border: 2px solid var(--emergency-border-color);
          position: relative;
          overflow: hidden;
        }

        .crisis-emergency-layout::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(184, 125, 125, 0.03) 50%,
            transparent 100%
          );
          pointer-events: none;
        }

        .crisis-emergency-layout > * {
          position: relative;
          z-index: 2;
        }

        /* Border and Shadow Variants */
        .crisis-breathing-layout {
          --card-border: 1px solid rgba(139, 166, 117, 0.15);
          --panel-border: 1px solid rgba(139, 166, 117, 0.1);
          --section-border: rgba(139, 166, 117, 0.1);
          
          --card-shadow: 0 4px 20px rgba(139, 166, 117, 0.08);
          --emergency-shadow: 0 4px 20px rgba(184, 125, 125, 0.15);
        }

        /* Center Content */
        .center-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        /* Breathing Effect on Hover */
        .crisis-card-layout:hover,
        .crisis-panel-layout:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(139, 166, 117, 0.12);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .spacing-tight {
            --sanctuary-padding: var(--spacing-tight-mobile);
            --container-padding: var(--spacing-tight-mobile);
            --card-padding: var(--spacing-tight-mobile);
            --panel-padding: var(--spacing-tight-mobile);
            --emergency-padding: var(--spacing-tight-mobile);
          }

          .spacing-comfortable {
            --sanctuary-padding: var(--spacing-comfortable-mobile);
            --container-padding: var(--spacing-comfortable-mobile);
            --card-padding: var(--spacing-comfortable-mobile);
            --panel-padding: var(--spacing-comfortable-mobile);
            --emergency-padding: var(--spacing-comfortable-mobile);
          }

          .spacing-generous {
            --sanctuary-padding: var(--spacing-generous-mobile);
            --container-padding: var(--spacing-generous-mobile);
            --card-padding: var(--spacing-generous-mobile);
            --panel-padding: var(--spacing-generous-mobile);
            --emergency-padding: var(--spacing-generous-mobile);
          }

          .spacing-expansive {
            --sanctuary-padding: var(--spacing-expansive-mobile);
            --container-padding: var(--spacing-expansive-mobile);
            --card-padding: var(--spacing-expansive-mobile);
            --panel-padding: var(--spacing-expansive-mobile);
            --emergency-padding: var(--spacing-expansive-mobile);
          }

          .crisis-container-layout {
            border-radius: 16px;
            margin: 1rem;
          }

          .crisis-card-layout {
            border-radius: 16px;
          }

          .crisis-sanctuary-layout {
            padding: var(--spacing-comfortable-mobile);
          }
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .crisis-card-layout,
          .crisis-panel-layout {
            border: 2px solid var(--crisis-sage-deep, #6b8559);
          }

          .crisis-emergency-layout {
            border-width: 3px;
            border-color: var(--crisis-emergency-red, #b87d7d);
          }

          .crisis-section-layout {
            border-bottom-width: 2px;
            border-bottom-color: var(--crisis-sage-primary, #8ba675);
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .crisis-breathing-layout {
            transition: none;
          }

          .crisis-card-layout:hover,
          .crisis-panel-layout:hover {
            transform: none;
          }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          .crisis-breathing-layout {
            --sanctuary-pure: #1a1d1a;
            --sanctuary-warm: #1c1f1c;
            --sanctuary-cool: #1a1c1f;
            --sanctuary-soft: #1b1e1b;
            --sanctuary-neutral: #1d1d1d;
          }
        }

        /* Print Styles */
        @media print {
          .crisis-breathing-layout {
            background: white !important;
            border: 1px solid #000 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }

          .crisis-sanctuary-layout {
            min-height: auto !important;
          }
        }
      `}</style>
    </Element>
  );
};

// Preset layout components for common patterns
export const CrisisLayouts = {
  Sanctuary: (props: Omit<CrisisBreathingLayoutsProps, 'variant'>) => (
    <CrisisBreathingLayouts variant="sanctuary" {...props} />
  ),
  
  Container: (props: Omit<CrisisBreathingLayoutsProps, 'variant'>) => (
    <CrisisBreathingLayouts variant="container" {...props} />
  ),
  
  Card: (props: Omit<CrisisBreathingLayoutsProps, 'variant'>) => (
    <CrisisBreathingLayouts variant="card" addShadow={true} {...props} />
  ),
  
  Section: (props: Omit<CrisisBreathingLayoutsProps, 'variant'>) => (
    <CrisisBreathingLayouts variant="section" {...props} />
  ),
  
  Panel: (props: Omit<CrisisBreathingLayoutsProps, 'variant'>) => (
    <CrisisBreathingLayouts variant="panel" addBorder={true} {...props} />
  ),
  
  Emergency: (props: Omit<CrisisBreathingLayoutsProps, 'variant'>) => (
    <CrisisBreathingLayouts 
      variant="emergency" 
      backgroundIntensity="warm"
      spacing="generous"
      {...props} 
    />
  )
};

// Hook for responsive breathing layouts
export const useCrisisBreathing = () => {
  const [spacing, setSpacing] = React.useState<BreathingSpacing>('comfortable');
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const detectMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    detectMobile();
    window.addEventListener('resize', detectMobile);
    return () => window.removeEventListener('resize', detectMobile);
  }, []);

  // Adjust spacing for crisis scenarios
  const expandForCrisis = () => setSpacing('generous');
  const normalSpacing = () => setSpacing('comfortable');
  const compactForMobile = () => setSpacing(isMobile ? 'tight' : 'comfortable');

  return {
    spacing,
    setSpacing,
    isMobile,
    expandForCrisis,
    normalSpacing,
    compactForMobile,
    // Helper function to get appropriate spacing for context
    getContextualSpacing: (isCrisis = false) => {
      if (isCrisis) return 'generous';
      if (isMobile) return 'comfortable';
      return 'comfortable';
    }
  };
};

export default CrisisBreathingLayouts;