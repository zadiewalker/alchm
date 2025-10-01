# ALCHM Premium Component Specifications
## Jony Ive Design System Implementation Guide

*Exact code specifications for implementing the premium, trauma-informed design system*

---

## Component Library Overview

This document provides exact Tailwind CSS classes and React component specifications for implementing ALCHM's premium design system. Each component is designed with Jony Ive's philosophy of radical simplicity while maintaining trauma-informed design principles.

---

## Core Design Tokens (Tailwind Config)

### Required Tailwind Configuration Updates

```typescript
// tailwind.config.ts - EXACT CONFIGURATION
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // SAGE GREEN SYSTEM - Primary brand colors
        sage: {
          50: '#f6f7f4',   // Whisper backgrounds
          100: '#e8eae3',  // Subtle surfaces
          200: '#d1d6c7',  // Gentle borders
          300: '#b4bca2',  // Secondary text
          400: '#a4b792',  // PRIMARY BRAND - Use with intention
          500: '#93a682',  // Hover states
          600: '#7a8c6a',  // Active states
          700: '#626d54',  // Deep accents
          800: '#4f5843',  // Strong contrast
          900: '#3d4435',  // Maximum contrast
        },
        
        // SANCTUARY NEUTRALS - Supporting palette
        sanctuary: {
          white: '#fefcfb',    // Pure backgrounds
          gray: {
            50: '#f9f9f9',     // Light surfaces
            100: '#f1f1f1',    // Subtle dividers
            200: '#e5e5e5',    // Gentle borders
            300: '#d1d1d1',    // Light text
            400: '#a8a8a8',    // Secondary text
            500: '#8c8c8c',    // Medium text
            600: '#6b6b6b',    // Primary text
            700: '#4a4a4a',    // Dark text
            800: '#2d2d2d',    // Headings
            900: '#1a1a1a',    // Maximum contrast
          },
        },
      },
      
      // SPACING SYSTEM - 8px grid
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
      },
      
      // SHADOWS - Gentle elevation
      boxShadow: {
        'gentle': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.12)',
        'nurturing': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'sacred': '0 8px 32px rgba(164, 183, 146, 0.15)',
        'floating': '0 16px 64px rgba(0, 0, 0, 0.20)',
      },
      
      // BORDER RADIUS - Soft, never sharp
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      
      // ANIMATION DURATIONS
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};

export default config;
```

---

## Button System - Premium Implementation

### Primary Button (Sage Green Signature)

```tsx
// components/ui/PremiumButton.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'crisis';
  size?: 'default' | 'lg' | 'touch';
  children: React.ReactNode;
}

export function PremiumButton({ 
  variant = 'primary', 
  size = 'default', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'font-medium transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/30 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none cursor-pointer'
  ].join(' ');
  
  const variants = {
    primary: [
      'bg-sage-400 text-white',
      'border border-sage-400',
      'hover:bg-sage-500 hover:shadow-soft',
      'hover:transform hover:scale-[1.01] active:scale-[0.99]',
      'rounded-xl'
    ].join(' '),
    
    secondary: [
      'bg-sanctuary-white text-sage-600',
      'border border-sage-200',
      'hover:bg-sage-50 hover:border-sage-300',
      'hover:scale-[1.01] active:scale-[0.99]',
      'rounded-xl shadow-gentle'
    ].join(' '),
    
    ghost: [
      'bg-transparent text-sanctuary-gray-600',
      'hover:bg-sage-50 hover:text-sage-600',
      'hover:scale-[1.01] active:scale-[0.99]',
      'rounded-lg'
    ].join(' '),
    
    crisis: [
      'bg-red-500 text-white',
      'border border-red-600',
      'hover:bg-red-600 hover:shadow-soft',
      'hover:scale-[1.01] active:scale-[0.99]',
      'rounded-xl'
    ].join(' ')
  };
  
  const sizes = {
    default: 'h-12 px-6 text-base min-w-[120px]',
    lg: 'h-14 px-8 text-lg min-w-[140px]',
    touch: 'h-16 px-8 text-lg min-w-[160px] md:h-14 md:px-6' // Crisis situations
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ touchAction: 'manipulation' }}
      {...props}
    >
      {children}
    </button>
  );
}
```

**Usage Examples:**
```tsx
// Primary CTA
<PremiumButton variant="primary" size="lg">
  Begin Healing
</PremiumButton>

// Secondary action
<PremiumButton variant="secondary">
  Learn More
</PremiumButton>

// Crisis support
<PremiumButton variant="crisis" size="touch">
  Get Help Now
</PremiumButton>
```

---

## Card System - Floating Sanctuary

### Premium Card Component

```tsx
// components/ui/PremiumCard.tsx
interface CardProps {
  children: React.ReactNode;
  variant?: 'sanctuary' | 'sage' | 'elevated';
  interactive?: boolean;
  className?: string;
}

export function PremiumCard({ 
  children, 
  variant = 'sanctuary', 
  interactive = false,
  className = '' 
}: CardProps) {
  const baseClasses = [
    'backdrop-blur-xl',
    'border',
    'rounded-2xl',
    'p-6',
    'transition-all duration-300 ease-out'
  ].join(' ');
  
  const variants = {
    sanctuary: [
      'bg-white/90',
      'border-sage-100',
      'shadow-soft',
      interactive ? 'hover:bg-white/95 hover:border-sage-200 hover:shadow-nurturing hover:-translate-y-1' : ''
    ].join(' '),
    
    sage: [
      'bg-sage-400/10',
      'border-sage-200',
      'shadow-soft',
      interactive ? 'hover:bg-sage-400/15 hover:border-sage-300 hover:shadow-sacred hover:-translate-y-1' : ''
    ].join(' '),
    
    elevated: [
      'bg-white',
      'border-sage-200',
      'shadow-sacred',
      interactive ? 'hover:shadow-floating hover:-translate-y-2' : ''
    ].join(' ')
  };
  
  const Component = interactive ? 'button' : 'div';
  
  return (
    <Component 
      className={`${baseClasses} ${variants[variant]} ${interactive ? 'cursor-pointer text-left w-full' : ''} ${className}`}
      style={interactive ? { touchAction: 'manipulation' } : undefined}
    >
      {children}
    </Component>
  );
}
```

**Usage Examples:**
```tsx
// Basic content card
<PremiumCard variant="sanctuary">
  <h3 className="text-lg font-medium text-sanctuary-gray-800 mb-2">
    Journal Entry
  </h3>
  <p className="text-sanctuary-gray-600">
    Your thoughts are safe here...
  </p>
</PremiumCard>

// Interactive navigation card
<PremiumCard variant="sage" interactive onClick={() => navigate('/journal')}>
  <div className="text-4xl mb-4">✍️</div>
  <h3 className="text-xl font-medium text-sage-700 mb-2">
    New Journal Entry
  </h3>
  <p className="text-sage-600">
    Share your thoughts in a safe space
  </p>
</PremiumCard>
```

---

## Input System - Sacred Text Entry

### Premium Input Component

```tsx
// components/ui/PremiumInput.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  helper?: string;
  error?: string;
  variant?: 'default' | 'therapeutic';
  multiline?: boolean;
  rows?: number;
}

export function PremiumInput({ 
  label,
  helper,
  error,
  variant = 'default',
  multiline = false,
  rows = 4,
  className = '',
  ...props 
}: InputProps) {
  const baseClasses = [
    'w-full',
    'min-h-[52px]',
    'px-4 py-3',
    'bg-white/90',
    'border',
    'rounded-xl',
    'text-base text-sanctuary-gray-700', // Prevent iOS zoom
    'placeholder:text-sanctuary-gray-400 placeholder:italic',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-sage-400/20 focus:border-sage-400',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ].join(' ');
  
  const variants = {
    default: 'border-sage-200 focus:bg-white',
    therapeutic: 'border-sage-300 bg-sage-50/50 focus:bg-sage-50 focus:border-sage-500'
  };
  
  const errorClasses = error ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' : '';
  
  const Component = multiline ? 'textarea' : 'input';
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-sanctuary-gray-700">
          {label}
        </label>
      )}
      
      <Component
        className={`${baseClasses} ${variants[variant]} ${errorClasses} ${className}`}
        style={{ 
          touchAction: 'manipulation',
          resize: multiline ? 'vertical' : undefined,
          minHeight: multiline ? `${rows * 1.5}rem` : undefined
        }}
        rows={multiline ? rows : undefined}
        {...props}
      />
      
      {helper && !error && (
        <p className="text-sm text-sanctuary-gray-500">
          {helper}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
```

**Usage Examples:**
```tsx
// Basic input
<PremiumInput 
  label="Email"
  placeholder="your@email.com"
  type="email"
/>

// Therapeutic journal input
<PremiumInput 
  label="How are you feeling today?"
  variant="therapeutic"
  multiline
  rows={6}
  placeholder="Share what's on your mind... Your thoughts are safe here."
/>

// Input with validation
<PremiumInput 
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>
```

---

## Crisis Footer - Always Accessible, Never Intrusive

### Premium Crisis Support Footer

```tsx
// components/ui/CrisisFooter.tsx
'use client';

import { useState } from 'react';
import { PremiumButton } from './PremiumButton';

export function CrisisFooter() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
        <div className="bg-gradient-to-t from-sage-400/95 to-transparent backdrop-blur-xl border-t border-sage-300/50">
          <div className="px-4 py-3">
            <PremiumButton
              variant="secondary"
              size="default"
              className="w-full bg-white/95 hover:bg-white text-sage-700 border-sage-200"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="text-lg mr-2">🤍</span>
              Need Support?
              <svg 
                className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </PremiumButton>
          </div>
        </div>
        
        {/* Expanded Crisis Resources */}
        {isExpanded && (
          <div className="bg-white/98 backdrop-blur-xl border-t border-sage-200 shadow-floating">
            <div className="px-4 py-6 space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-sanctuary-gray-800 mb-1">
                  You Matter
                </h3>
                <p className="text-sm text-sanctuary-gray-600">
                  Help is available right now
                </p>
              </div>
              
              <div className="space-y-3">
                {/* Crisis Lifeline */}
                <a
                  href="tel:988"
                  className="flex items-center justify-between p-4 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                  style={{ touchAction: 'manipulation' }}
                >
                  <div>
                    <div className="font-semibold text-red-700 text-lg">
                      988 Crisis Lifeline
                    </div>
                    <div className="text-sm text-red-600">
                      Tap to call • Available 24/7
                    </div>
                  </div>
                  <div className="text-2xl">📞</div>
                </a>
                
                {/* Crisis Text Line */}
                <a
                  href="sms:741741&body=HOME"
                  className="flex items-center justify-between p-4 bg-sage-50 border-2 border-sage-200 rounded-xl hover:bg-sage-100 transition-colors"
                  style={{ touchAction: 'manipulation' }}
                >
                  <div>
                    <div className="font-semibold text-sage-700 text-lg">
                      Crisis Text Line
                    </div>
                    <div className="text-sm text-sage-600">
                      Text HOME to 741741
                    </div>
                  </div>
                  <div className="text-2xl">💬</div>
                </a>
              </div>
              
              <div className="pt-2 border-t border-sage-100">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-sm text-sanctuary-gray-500 hover:text-sanctuary-gray-700 w-full text-center py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Spacer to prevent content overlap */}
      <div className="h-16" />
    </>
  );
}
```

---

## Loading States - Gentle & Therapeutic

### Premium Loading Component

```tsx
// components/ui/PremiumLoading.tsx
interface LoadingProps {
  variant?: 'minimal' | 'therapeutic' | 'sanctuary';
  size?: 'sm' | 'default' | 'lg';
  message?: string;
}

export function PremiumLoading({ 
  variant = 'minimal', 
  size = 'default',
  message 
}: LoadingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  const variants = {
    minimal: (
      <div className={`${sizes[size]} border-2 border-sage-200 border-t-sage-400 rounded-full animate-spin`} />
    ),
    
    therapeutic: (
      <div className="flex items-center space-x-3">
        <div className={`${sizes[size]} border-2 border-sage-200 border-t-sage-400 rounded-full animate-spin`} />
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-sage-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-sage-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-sage-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    ),
    
    sanctuary: (
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-sage-100 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-sage-400 border-t-transparent rounded-full animate-spin" />
        </div>
        {message && (
          <p className="text-sage-600 font-medium animate-pulse">
            {message}
          </p>
        )}
      </div>
    )
  };
  
  return (
    <div className="flex items-center justify-center">
      {variants[variant]}
    </div>
  );
}
```

**Usage Examples:**
```tsx
// Minimal loading for buttons
<PremiumLoading variant="minimal" size="sm" />

// Page loading
<PremiumLoading 
  variant="sanctuary" 
  message="Preparing your sanctuary..." 
/>

// Therapeutic loading for journal saves
<PremiumLoading 
  variant="therapeutic" 
  message="Saving your thoughts safely..." 
/>
```

---

## Typography System - Exact Classes

### Heading Components

```tsx
// components/ui/PremiumTypography.tsx
interface HeadingProps {
  level: 'h1' | 'h2' | 'h3' | 'h4';
  children: React.ReactNode;
  className?: string;
}

export function PremiumHeading({ level, children, className = '' }: HeadingProps) {
  const baseClasses = 'font-light text-sanctuary-gray-900 tracking-tight';
  
  const styles = {
    h1: 'text-4xl md:text-5xl lg:text-6xl leading-tight mb-6',
    h2: 'text-3xl md:text-4xl leading-tight mb-4',
    h3: 'text-xl md:text-2xl leading-tight mb-3',
    h4: 'text-lg md:text-xl font-medium leading-tight mb-2'
  };
  
  const Component = level;
  
  return (
    <Component className={`${baseClasses} ${styles[level]} ${className}`}>
      {children}
    </Component>
  );
}

// Body text component
interface BodyTextProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'therapeutic';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function PremiumBodyText({ 
  children, 
  variant = 'default', 
  size = 'default',
  className = '' 
}: BodyTextProps) {
  const variants = {
    default: 'text-sanctuary-gray-600',
    secondary: 'text-sanctuary-gray-500',
    therapeutic: 'text-sage-700'
  };
  
  const sizes = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg'
  };
  
  return (
    <p className={`leading-relaxed ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </p>
  );
}
```

---

## Layout System - Container & Grid

### Premium Layout Components

```tsx
// components/ui/PremiumLayout.tsx
interface ContainerProps {
  children: React.ReactNode;
  size?: 'narrow' | 'default' | 'wide' | 'full';
  className?: string;
}

export function PremiumContainer({ 
  children, 
  size = 'default', 
  className = '' 
}: ContainerProps) {
  const sizes = {
    narrow: 'max-w-2xl',   // ~45ch
    default: 'max-w-4xl',  // ~65ch  
    wide: 'max-w-6xl',     // ~80ch
    full: 'max-w-7xl'      // Container max
  };
  
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}

// Sacred grid for pathways/cards
interface GridProps {
  children: React.ReactNode;
  columns?: 'auto' | '1' | '2' | '3' | '4';
  gap?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function PremiumGrid({ 
  children, 
  columns = 'auto', 
  gap = 'default',
  className = '' 
}: GridProps) {
  const columnClasses = {
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };
  
  const gapClasses = {
    sm: 'gap-4',
    default: 'gap-6',
    lg: 'gap-8'
  };
  
  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}
```

---

## Animation Utilities - Trauma-Informed Motion

### CSS Classes for Gentle Animations

```css
/* Add to globals.css */

/* GENTLE ENTRANCE ANIMATIONS */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes gentle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* UTILITY CLASSES */
.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out forwards;
}

.animate-gentle-pulse {
  animation: gentle-pulse 2s ease-in-out infinite;
}

/* STAGGERED ANIMATIONS */
.stagger-children > * {
  opacity: 0;
  animation: fade-in-up 0.4s ease-out forwards;
}

.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 100ms; }
.stagger-children > *:nth-child(3) { animation-delay: 200ms; }
.stagger-children > *:nth-child(4) { animation-delay: 300ms; }
.stagger-children > *:nth-child(5) { animation-delay: 400ms; }

/* REDUCED MOTION RESPECT */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Page Template - Complete Implementation

### Premium Page Layout Template

```tsx
// components/ui/PremiumPageTemplate.tsx
import { PremiumContainer, PremiumHeading, PremiumBodyText } from './PremiumLayout';
import { CrisisFooter } from './CrisisFooter';

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backgroundVariant?: 'sage' | 'sanctuary' | 'gradient';
  showCrisisFooter?: boolean;
}

export function PremiumPageTemplate({ 
  title,
  subtitle,
  children,
  backgroundVariant = 'sanctuary',
  showCrisisFooter = true
}: PageTemplateProps) {
  const backgrounds = {
    sage: 'bg-gradient-to-br from-sage-50 to-sage-100',
    sanctuary: 'bg-sanctuary-white',
    gradient: 'bg-gradient-to-br from-sage-400 to-sage-500'
  };
  
  const textColors = {
    sage: 'text-sanctuary-gray-900',
    sanctuary: 'text-sanctuary-gray-900',
    gradient: 'text-white'
  };
  
  return (
    <div className={`min-h-screen ${backgrounds[backgroundVariant]}`}>
      {/* Page Header */}
      <header className="pt-16 pb-12">
        <PremiumContainer>
          <div className="text-center">
            <PremiumHeading 
              level="h1" 
              className={`${textColors[backgroundVariant]} animate-fade-in-up`}
            >
              {title}
            </PremiumHeading>
            {subtitle && (
              <PremiumBodyText 
                size="lg"
                className={`max-w-2xl mx-auto ${
                  backgroundVariant === 'gradient' ? 'text-sage-100' : 'text-sanctuary-gray-600'
                } animate-fade-in-up`}
                style={{ animationDelay: '100ms' }}
              >
                {subtitle}
              </PremiumBodyText>
            )}
          </div>
        </PremiumContainer>
      </header>
      
      {/* Main Content */}
      <main className="pb-24">
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {children}
        </div>
      </main>
      
      {/* Crisis Footer */}
      {showCrisisFooter && <CrisisFooter />}
    </div>
  );
}
```

---

## Usage Examples - Complete Pages

### Dashboard Page with Premium Components

```tsx
// Example: Premium Dashboard Implementation
import { PremiumPageTemplate, PremiumContainer, PremiumGrid } from '@/components/ui/PremiumLayout';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';

export default function PremiumDashboard() {
  return (
    <PremiumPageTemplate
      title="Welcome back"
      subtitle="Your healing journey continues"
      backgroundVariant="sanctuary"
    >
      <PremiumContainer>
        <PremiumGrid columns="3" gap="lg" className="stagger-children">
          
          <PremiumCard variant="sage" interactive>
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-medium text-sage-700 mb-2">
              New Journal Entry
            </h3>
            <p className="text-sage-600">
              Share your thoughts in a safe space
            </p>
          </PremiumCard>
          
          <PremiumCard variant="sanctuary" interactive>
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-sanctuary-gray-800 mb-2">
              Past Entries
            </h3>
            <p className="text-sanctuary-gray-600">
              Review your journey and growth
            </p>
          </PremiumCard>
          
          <PremiumCard variant="elevated" interactive>
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-medium text-sanctuary-gray-800 mb-2">
              Premium Features
            </h3>
            <p className="text-sanctuary-gray-600">
              Unlock advanced insights
            </p>
          </PremiumCard>
          
        </PremiumGrid>
      </PremiumContainer>
    </PremiumPageTemplate>
  );
}
```

---

## Implementation Priority

### Phase 1: Core Components (Week 1)
1. Update Tailwind config with design tokens
2. Implement PremiumButton component
3. Replace all hardcoded button styles
4. Implement CrisisFooter

### Phase 2: Layout System (Week 2)
1. Implement PremiumCard component
2. Add PremiumInput component
3. Create layout utilities (Container, Grid)
4. Update major pages (Dashboard, Journal)

### Phase 3: Polish & Animation (Week 3)
1. Add PremiumLoading states
2. Implement gentle animations
3. Typography component refinement
4. Page template system

### Phase 4: Testing & Optimization (Week 4)
1. Cross-device testing
2. Accessibility audit
3. Performance optimization
4. User testing validation

---

## Quality Checklist

### Design System Compliance
- [ ] All components use design tokens (no hardcoded values)
- [ ] Typography follows 3-weight hierarchy (light, regular, medium)
- [ ] Spacing uses 8px grid system
- [ ] Colors limited to sage green + sanctuary neutrals

### Mobile Excellence
- [ ] Touch targets minimum 52px (60px for crisis)
- [ ] One-handed operation tested
- [ ] Works on iOS Safari and Android Chrome
- [ ] Reduced motion preferences honored

### Trauma-Informed Design
- [ ] No sudden movements or aggressive animations
- [ ] Predictable interaction patterns
- [ ] Crisis support always accessible but never intrusive
- [ ] Gentle, supportive visual language throughout

---

This comprehensive component specification provides the exact code needed to implement ALCHM's premium, trauma-informed design system. Each component is crafted with Jony Ive's philosophy of radical simplicity while maintaining the therapeutic, healing-centered approach essential for mental health applications.

The specifications ensure consistency, accessibility, and premium visual quality while supporting users in vulnerable moments with thoughtful, gentle interactions.