/**
 * ALCHM Sanctuary Components
 * "Where technology disappears and only intention remains"
 * 
 * This component library embodies Jony Ive's philosophy of intentional restraint
 * and demonstrates the practical application of our Digital Sanctuary Design System.
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ========================================
// TYPOGRAPHY COMPONENTS - WHISPERED CONFIDENCE
// ========================================

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'whisper' | 'body' | 'emphasis' | 'subhead' | 'heading' | 'display' | 'monument';
  children: React.ReactNode;
}

export const SanctuaryText = forwardRef<HTMLElement, TextProps>(
  ({ variant = 'body', className, children, ...props }, ref) => {
    const baseClasses = "transition-colors duration-400";
    
    const variants = {
      whisper: "text-xs font-normal tracking-wide text-sanctuary-gray-600 leading-relaxed",
      body: "text-sm font-normal tracking-wide text-sanctuary-gray-800 leading-relaxed",
      emphasis: "text-base font-medium tracking-wide text-sanctuary-gray-800 leading-relaxed",
      subhead: "text-lg font-semibold tracking-wider text-sanctuary-gray-800 leading-normal",
      heading: "text-2xl font-bold tracking-wider text-sanctuary-gray-800 leading-tight",
      display: "text-4xl font-bold tracking-widest text-sanctuary-gray-800 leading-none",
      monument: "text-6xl font-bold tracking-widest text-sanctuary-gray-800 leading-none"
    };

    const Component = variant === 'monument' || variant === 'display' ? 'h1' : 
                     variant === 'heading' ? 'h2' :
                     variant === 'subhead' ? 'h3' : 'span';

    return (
      <Component
        ref={ref as any}
        className={cn(baseClasses, variants[variant], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

SanctuaryText.displayName = "SanctuaryText";

// ========================================
// BUTTON COMPONENTS - SAGE INVITATIONS
// ========================================

interface SanctuaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'sage-primary' | 'sanctuary-secondary' | 'gentle-ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  sparkle?: boolean;
}

export const SanctuaryButton = forwardRef<HTMLButtonElement, SanctuaryButtonProps>(
  ({ variant = 'sage-primary', size = 'md', sparkle = false, className, children, ...props }, ref) => {
    const baseClasses = cn(
      "relative overflow-hidden font-medium tracking-wide rounded-xl",
      "transition-all duration-400 ease-out",
      "focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "group"
    );

    const variants = {
      'sage-primary': cn(
        "bg-gradient-to-r from-sage-400 to-sage-500 text-white",
        "hover:from-sage-500 hover:to-sage-600",
        "hover:-translate-y-0.5 hover:shadow-soft",
        "active:translate-y-0 active:shadow-whisper"
      ),
      'sanctuary-secondary': cn(
        "bg-white/70 text-sage-600 border border-sage-200",
        "backdrop-blur-sm hover:bg-sage-50/80 hover:border-sage-300",
        "hover:-translate-y-0.5 hover:shadow-whisper"
      ),
      'gentle-ghost': cn(
        "text-sage-600 hover:bg-sage-50/50",
        "hover:-translate-y-0.5"
      )
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base"
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-600 ease-out" />
        
        <span className="relative flex items-center gap-2">
          {sparkle && (
            <span className="text-warm-amber animate-heart-sparkle">✨</span>
          )}
          {children}
        </span>
      </button>
    );
  }
);

SanctuaryButton.displayName = "SanctuaryButton";

// ========================================
// CARD COMPONENTS - GLASS CONTAINERS
// ========================================

interface SanctuaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
}

export const SanctuaryCard = forwardRef<HTMLDivElement, SanctuaryCardProps>(
  ({ hover = true, glass = true, className, children, ...props }, ref) => {
    const baseClasses = cn(
      "rounded-2xl border transition-all duration-400 ease-out",
      "focus-within:ring-2 focus-within:ring-sage-400 focus-within:ring-offset-2"
    );

    const glassClasses = glass ? cn(
      "bg-white/70 backdrop-blur-sm border-white/30",
      hover && "hover:bg-white/80 hover:border-sage-200/50 hover:-translate-y-1 hover:shadow-soft"
    ) : cn(
      "bg-white border-sanctuary-gray-200",
      hover && "hover:border-sage-200 hover:-translate-y-1 hover:shadow-soft"
    );

    return (
      <div
        ref={ref}
        className={cn(baseClasses, glassClasses, className)}
        {...props}
      >
        {/* Subtle top border accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-sage-400 to-transparent rounded-b opacity-60" />
        {children}
      </div>
    );
  }
);

SanctuaryCard.displayName = "SanctuaryCard";

// ========================================
// INPUT COMPONENTS - SACRED VESSELS
// ========================================

interface SanctuaryInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const SanctuaryInput = forwardRef<HTMLInputElement, SanctuaryInputProps>(
  ({ label, hint, error, className, ...props }, ref) => {
    const inputClasses = cn(
      "w-full px-4 py-3 rounded-xl border transition-all duration-400",
      "bg-sanctuary-gray-50 border-sanctuary-gray-200",
      "focus:outline-none focus:bg-white focus:border-sage-400 focus:ring-2 focus:ring-sage-100",
      "placeholder:text-sanctuary-gray-500 placeholder:tracking-wide",
      "text-sm tracking-wide leading-relaxed",
      error && "border-red-300 focus:border-red-400 focus:ring-red-100",
      className
    );

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium tracking-wide text-sanctuary-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs tracking-wide text-sanctuary-gray-500 flex items-center gap-1">
            <span className="text-sage-400">💭</span>
            {hint}
          </p>
        )}
        {error && (
          <p className="text-xs tracking-wide text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

SanctuaryInput.displayName = "SanctuaryInput";

// ========================================
// TEXTAREA COMPONENTS - REFLECTION VESSELS
// ========================================

interface SanctuaryTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const SanctuaryTextarea = forwardRef<HTMLTextAreaElement, SanctuaryTextareaProps>(
  ({ label, hint, error, className, ...props }, ref) => {
    const textareaClasses = cn(
      "w-full px-4 py-3 rounded-xl border transition-all duration-400 resize-y",
      "bg-sanctuary-gray-50 border-sanctuary-gray-200 min-h-[120px]",
      "focus:outline-none focus:bg-white focus:border-sage-400 focus:ring-2 focus:ring-sage-100",
      "placeholder:text-sanctuary-gray-500 placeholder:tracking-wide",
      "text-sm tracking-wide leading-relaxed",
      error && "border-red-300 focus:border-red-400 focus:ring-red-100",
      className
    );

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium tracking-wide text-sanctuary-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={textareaClasses}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs tracking-wide text-sanctuary-gray-500 flex items-center gap-1">
            <span className="text-sage-400">💭</span>
            {hint}
          </p>
        )}
        {error && (
          <p className="text-xs tracking-wide text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

SanctuaryTextarea.displayName = "SanctuaryTextarea";

// ========================================
// PROGRESS COMPONENTS - GENTLE CELEBRATION
// ========================================

interface SanctuaryProgressProps {
  value: number;
  max?: number;
  label?: string;
  showSparkle?: boolean;
  className?: string;
}

export const SanctuaryProgress: React.FC<SanctuaryProgressProps> = ({ 
  value, 
  max = 100, 
  label, 
  showSparkle = true,
  className 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <SanctuaryText variant="body" className="font-medium">
            {label}
          </SanctuaryText>
          <div className="flex items-center gap-1">
            <SanctuaryText variant="whisper">
              {value} / {max}
            </SanctuaryText>
            {showSparkle && percentage > 0 && (
              <span className="text-warm-amber animate-gentle-sparkle">✨</span>
            )}
          </div>
        </div>
      )}
      <div className="relative h-2 bg-sanctuary-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-sage-400 to-sage-500 rounded-full transition-all duration-600 ease-out relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-sanctuary-shimmer" />
        </div>
      </div>
    </div>
  );
};

// ========================================
// BADGE COMPONENTS - GENTLE RECOGNITION
// ========================================

interface SanctuaryBadgeProps {
  children: React.ReactNode;
  variant?: 'sage' | 'warm' | 'calm' | 'gentle';
  sparkle?: boolean;
  className?: string;
}

export const SanctuaryBadge: React.FC<SanctuaryBadgeProps> = ({ 
  children, 
  variant = 'sage',
  sparkle = false,
  className 
}) => {
  const variants = {
    sage: "bg-sage-100 text-sage-700 border-sage-200",
    warm: "bg-warm-amber/10 text-warm-amber border-warm-amber/20",
    calm: "bg-calm-blue/10 text-calm-blue border-calm-blue/20",
    gentle: "bg-gentle-rose/10 text-gentle-rose border-gentle-rose/20"
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium tracking-wide uppercase",
      "transition-all duration-400 hover:-translate-y-0.5 hover:shadow-whisper",
      variants[variant],
      className
    )}>
      {sparkle && (
        <span className="animate-gentle-sparkle">✨</span>
      )}
      {children}
    </span>
  );
};

// ========================================
// FLOATING ACTION BUTTON - CRISIS SUPPORT
// ========================================

interface CrisisFloatingButtonProps {
  onClick?: () => void;
  className?: string;
}

export const CrisisFloatingButton: React.FC<CrisisFloatingButtonProps> = ({ 
  onClick,
  className 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-red-500 to-red-600",
        "text-white rounded-full shadow-sacred hover:shadow-sanctuary",
        "flex items-center justify-center text-2xl",
        "transition-all duration-400 hover:scale-110",
        "animate-gentle-pulse z-50",
        "focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2",
        className
      )}
      aria-label="Crisis Support - Get immediate help"
    >
      🆘
    </button>
  );
};

// ========================================
// HEART SPARKLE - POSITIVE REINFORCEMENT
// ========================================

interface HeartSparkleProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'rose' | 'amber' | 'blue' | 'sage';
  className?: string;
}

export const HeartSparkle: React.FC<HeartSparkleProps> = ({ 
  size = 'md',
  color = 'rose',
  className 
}) => {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const colors = {
    rose: "text-gentle-rose",
    amber: "text-warm-amber", 
    blue: "text-calm-blue",
    sage: "text-sage-400"
  };

  return (
    <span className={cn(
      "inline-block animate-heart-sparkle",
      sizes[size],
      colors[color],
      className
    )}>
      💖
    </span>
  );
};

// ========================================
// LAYOUT COMPONENTS - BREATHING ROOM
// ========================================

interface SanctuaryContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'narrow' | 'reading' | 'standard' | 'wide';
  children: React.ReactNode;
}

export const SanctuaryContainer: React.FC<SanctuaryContainerProps> = ({ 
  size = 'standard',
  className,
  children,
  ...props 
}) => {
  const sizes = {
    narrow: "max-w-md",
    reading: "max-w-2xl",
    standard: "max-w-4xl",
    wide: "max-w-6xl"
  };

  return (
    <div 
      className={cn(
        "mx-auto px-8",
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface SanctuarySectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  spacing?: 'cozy' | 'comfortable' | 'spacious' | 'sanctuary';
}

export const SanctuarySection: React.FC<SanctuarySectionProps> = ({ 
  spacing = 'comfortable',
  className,
  children,
  ...props 
}) => {
  const spacings = {
    cozy: "py-16",
    comfortable: "py-24",
    spacious: "py-32",
    sanctuary: "py-sanctuary"
  };

  return (
    <section 
      className={cn(
        spacings[spacing],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};

// ========================================
// STACK COMPONENT - VERTICAL RHYTHM
// ========================================

interface SanctuaryStackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'tight' | 'normal' | 'generous' | 'spacious';
  children: React.ReactNode;
}

export const SanctuaryStack: React.FC<SanctuaryStackProps> = ({ 
  spacing = 'normal',
  className,
  children,
  ...props 
}) => {
  const spacings = {
    tight: "space-y-4",
    normal: "space-y-6",
    generous: "space-y-8",
    spacious: "space-y-12"
  };

  return (
    <div 
      className={cn(
        spacings[spacing],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default {
  SanctuaryText,
  SanctuaryButton,
  SanctuaryCard,
  SanctuaryInput,
  SanctuaryTextarea,
  SanctuaryProgress,
  SanctuaryBadge,
  CrisisFloatingButton,
  HeartSparkle,
  SanctuaryContainer,
  SanctuarySection,
  SanctuaryStack
};