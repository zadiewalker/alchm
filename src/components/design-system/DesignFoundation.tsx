'use client';

/**
 * ALCHM Design Foundation Components
 * Jony Ive-inspired visual identity system
 * Purposeful minimalism for emotional wellbeing
 */

import React from 'react';

// ===== TYPOGRAPHY COMPONENTS =====

interface TextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const TextHero: React.FC<TextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'h1' 
}) => (
  <Component className={`text-hero ${className}`}>
    {children}
  </Component>
);

export const TextHeading: React.FC<TextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'h2' 
}) => (
  <Component className={`text-heading ${className}`}>
    {children}
  </Component>
);

export const TextBody: React.FC<TextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'p' 
}) => (
  <Component className={`text-body ${className}`}>
    {children}
  </Component>
);

export const TextSupporting: React.FC<TextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'p' 
}) => (
  <Component className={`text-supporting ${className}`}>
    {children}
  </Component>
);

export const TextCrisis: React.FC<TextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'p' 
}) => (
  <Component className={`text-crisis ${className}`}>
    {children}
  </Component>
);

// ===== BUTTON COMPONENTS =====

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
  href?: string;
}

export const ButtonPrimary: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ariaLabel,
  href
}) => {
  const baseClass = `btn-primary ${className}`;
  
  if (href) {
    return (
      <a 
        href={href} 
        className={baseClass}
        aria-label={ariaLabel}
        role="button"
      >
        {children}
      </a>
    );
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export const ButtonSecondary: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ariaLabel,
  href
}) => {
  const baseClass = `btn-secondary ${className}`;
  
  if (href) {
    return (
      <a 
        href={href} 
        className={baseClass}
        aria-label={ariaLabel}
        role="button"
      >
        {children}
      </a>
    );
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export const ButtonCrisis: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ariaLabel,
  href
}) => {
  const baseClass = `btn-crisis ${className}`;
  
  if (href) {
    return (
      <a 
        href={href} 
        className={baseClass}
        aria-label={ariaLabel}
        role="button"
      >
        {children}
      </a>
    );
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

// ===== CARD COMPONENTS =====

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'sanctuary' | 'journal';
  onClick?: () => void;
}

export const CardSanctuary: React.FC<CardProps> = ({
  children,
  className = '',
  onClick
}) => (
  <div 
    className={`card-sanctuary ${className}`}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    {children}
  </div>
);

export const CardJournal: React.FC<CardProps> = ({
  children,
  className = '',
  onClick
}) => (
  <div 
    className={`card-journal ${className}`}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    {children}
  </div>
);

// ===== INPUT COMPONENTS =====

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'textarea';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  ariaLabel?: string;
  rows?: number;
}

export const InputSanctuary: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  ariaLabel,
  rows = 4
}) => {
  const baseClass = `input-sanctuary ${className}`;
  
  if (type === 'textarea') {
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        className={baseClass}
        aria-label={ariaLabel}
        rows={rows}
      />
    );
  }
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      required={required}
      className={baseClass}
      aria-label={ariaLabel}
    />
  );
};

// ===== LAYOUT COMPONENTS =====

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  breathing?: boolean;
}

export const ContainerSanctuary: React.FC<ContainerProps> = ({
  children,
  className = '',
  breathing = false
}) => (
  <div className={`container-sanctuary ${breathing ? 'breathing-space' : ''} ${className}`}>
    {children}
  </div>
);

export const LayoutCentered: React.FC<ContainerProps> = ({
  children,
  className = ''
}) => (
  <div className={`layout-centered ${className}`}>
    {children}
  </div>
);

export const SectionBreathing: React.FC<ContainerProps> = ({
  children,
  className = ''
}) => (
  <section className={`section-breathing ${className}`}>
    {children}
  </section>
);

// ===== SACRED WORDMARK COMPONENT =====

interface WordmarkProps {
  text?: string;
  className?: string;
}

export const WordmarkSacred: React.FC<WordmarkProps> = ({
  text = 'ALCHM',
  className = ''
}) => (
  <h1 className={`wordmark-sacred ${className}`}>
    {text}
  </h1>
);

// ===== MENTAL HEALTH SPECIFIC COMPONENTS =====

interface CrisisSupportProps {
  className?: string;
  show?: boolean;
}

export const CrisisSupport: React.FC<CrisisSupportProps> = ({
  className = '',
  show = true
}) => {
  if (!show) return null;
  
  return (
    <div className={`crisis-support ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="crisis-pulse"></div>
        <TextSupporting className="font-medium">Crisis Support</TextSupporting>
      </div>
      <div className="space-y-1">
        <TextSupporting><strong>988</strong> - Crisis Lifeline</TextSupporting>
        <TextSupporting><strong>741741</strong> - Crisis Text</TextSupporting>
        <TextSupporting className="opacity-light">24/7 • Free • Confidential</TextSupporting>
      </div>
    </div>
  );
};

interface PrivacyControlProps {
  children: React.ReactNode;
  className?: string;
}

export const PrivacyControl: React.FC<PrivacyControlProps> = ({
  children,
  className = ''
}) => (
  <div className={`privacy-control ${className}`}>
    {children}
  </div>
);

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  label?: string;
}

export const ProgressGentle: React.FC<ProgressProps> = ({
  value,
  className = '',
  label
}) => (
  <div className={`${className}`}>
    {label && <TextSupporting className="mb-2">{label}</TextSupporting>}
    <div className="progress-gentle">
      <div 
        className="progress-fill" 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  </div>
);

// ===== LOADING STATES =====

interface LoadingProps {
  className?: string;
  children?: React.ReactNode;
}

export const LoadingGentle: React.FC<LoadingProps> = ({
  className = '',
  children
}) => (
  <div className={`loading-gentle ${className}`}>
    {children}
  </div>
);

// ===== GRADIENT COMPONENTS =====

interface GradientProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientSanctuary: React.FC<GradientProps> = ({
  children,
  className = ''
}) => (
  <div className={`gradient-sanctuary ${className}`}>
    {children}
  </div>
);

// ===== RESPONSIVE IMAGE COMPONENT =====

interface ImageSacredProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const ImageSacred: React.FC<ImageSacredProps> = ({
  src,
  alt,
  className = '',
  width,
  height
}) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={`${className}`}
    loading="lazy"
    style={{
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-gentle)'
    }}
  />
);

// ===== SPACING UTILITIES AS COMPONENTS =====

interface SpacerProps {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Spacer: React.FC<SpacerProps> = ({ size }) => (
  <div className={`mt-${size}`} />
);

// ===== UTILITY HOOKS FOR DESIGN SYSTEM =====

export const useEmotionalState = () => {
  const [isCrisisMode, setIsCrisisMode] = React.useState(false);
  
  React.useEffect(() => {
    // Apply crisis mode styles to typeof window !== 'undefined' && document root
    if (isCrisisMode) {
      typeof window !== 'undefined' && document.typeof window !== 'undefined' && documentElement.classList.add('crisis-mode');
    } else {
      typeof window !== 'undefined' && document.typeof window !== 'undefined' && documentElement.classList.remove('crisis-mode');
    }
    
    return () => {
      typeof window !== 'undefined' && document.typeof window !== 'undefined' && documentElement.classList.remove('crisis-mode');
    };
  }, [isCrisisMode]);
  
  return {
    isCrisisMode,
    enableCrisisMode: () => setIsCrisisMode(true),
    disableCrisisMode: () => setIsCrisisMode(false)
  };
};

// ===== DESIGN SYSTEM CONTEXT =====

interface DesignSystemContextType {
  theme: 'light' | 'dark' | 'high-contrast';
  setTheme: (theme: 'light' | 'dark' | 'high-contrast') => void;
  isCrisisMode: boolean;
  enableCrisisMode: () => void;
  disableCrisisMode: () => void;
}

const DesignSystemContext = React.createContext<DesignSystemContextType | null>(null);

export const DesignSystemProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'high-contrast'>('light');
  const { isCrisisMode, enableCrisisMode, disableCrisisMode } = useEmotionalState();
  
  const value = {
    theme,
    setTheme,
    isCrisisMode,
    enableCrisisMode,
    disableCrisisMode
  };
  
  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = () => {
  const context = React.useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
};

export default {
  // Typography
  TextHero,
  TextHeading,
  TextBody,
  TextSupporting,
  TextCrisis,
  
  // Buttons
  ButtonPrimary,
  ButtonSecondary,
  ButtonCrisis,
  
  // Cards
  CardSanctuary,
  CardJournal,
  
  // Inputs
  InputSanctuary,
  
  // Layout
  ContainerSanctuary,
  LayoutCentered,
  SectionBreathing,
  
  // Brand
  WordmarkSacred,
  GradientSanctuary,
  
  // Mental Health
  CrisisSupport,
  PrivacyControl,
  ProgressGentle,
  
  // Utilities
  LoadingGentle,
  ImageSacred,
  Spacer,
  
  // Providers
  DesignSystemProvider,
  useDesignSystem,
  useEmotionalState
};