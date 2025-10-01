'use client';

import React, { useEffect, useState } from 'react';

// ALCHM Sanctuary Loading States - Performance Optimized
// Maintains healing sanctuary feeling during all loading states

interface SanctuaryLoadingProps {
  type?: 'gentle' | 'breathing' | 'writing' | 'crisis';
  message?: string;
  duration?: number;
  showProgress?: boolean;
}

export function SanctuaryLoading({ 
  type = 'gentle', 
  message = 'Creating your sanctuary...', 
  duration = 2000,
  showProgress = false 
}: SanctuaryLoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showProgress) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / (duration / 50)); // Update every 50ms
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, showProgress]);

  const loadingStyles = {
    gentle: 'animate-sanctuary-breathe',
    breathing: 'animate-healing-pulse',
    writing: 'animate-sanctuary-float',
    crisis: 'animate-crisis-glow'
  };

  const icons = {
    gentle: '🌿',
    breathing: '🫁',
    writing: '✍️',
    crisis: '🆘'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-sage-primary to-sage-hover">
      <div className="sanctuary-card text-center max-w-md w-full">
        {/* Animated sanctuary icon */}
        <div className={`text-6xl mb-6 ${loadingStyles[type]}`}>
          {icons[type]}
        </div>
        
        {/* Loading message */}
        <h2 className="sanctuary-heading text-xl mb-4">
          {message}
        </h2>
        
        {/* Progress indicator */}
        {showProgress && (
          <div className="w-full mb-6">
            <div className="w-full bg-sage-light rounded-full h-2 mb-2">
              <div 
                className="bg-sage-primary h-2 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="sanctuary-text text-sm text-sage-active">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}
        
        {/* Breathing dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-sage-primary rounded-full animate-healing-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Skeleton loader for content while maintaining sanctuary feel
export function SanctuarySkeleton({ 
  lines = 3, 
  showAvatar = false,
  className = '' 
}: {
  lines?: number;
  showAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={`sanctuary-card ${className}`}>
      {showAvatar && (
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-sage-light rounded-full animate-sanctuary-breathe" />
          <div className="ml-3">
            <div className="h-4 bg-sage-light rounded w-24 mb-2 animate-sanctuary-breathe" />
            <div className="h-3 bg-sage-muted rounded w-16 animate-sanctuary-breathe" />
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-sage-light rounded animate-sanctuary-breathe`}
            style={{ 
              width: `${Math.random() * 40 + 60}%`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Button loading state that maintains accessibility
export function SanctuaryButtonLoading({ 
  children, 
  isLoading = false,
  loadingText = 'Processing...',
  className = '',
  disabled = false,
  onClick,
  ...props 
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  
  return (
    <button
      className={`sanctuary-button relative ${isLoading ? 'sanctuary-loading' : ''} ${className}`}
      disabled={disabled || isLoading}
      onClick={isLoading ? undefined : onClick}
      aria-label={isLoading ? loadingText : undefined}
      {...props}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-sm">{loadingText}</span>
        </div>
      )}
      
      {/* Button content */}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
}

// Page transition loading with sanctuary feel
export function SanctuaryPageTransition({ 
  isVisible = false,
  message = 'Transitioning to your sanctuary...' 
}: {
  isVisible?: boolean;
  message?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-sage-primary/95 to-sage-hover/95 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-4 animate-sanctuary-float">🌿</div>
        <p className="text-xl font-light animate-sanctuary-reveal">
          {message}
        </p>
        
        {/* Organic loading animation */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 h-8 bg-white rounded-full animate-healing-pulse"
                style={{ 
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Image loading with sanctuary placeholder
export function SanctuaryImageLoader({ 
  src, 
  alt, 
  className = '',
  ...props 
}: {
  src: string;
  alt: string;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-sage-light animate-sanctuary-breathe flex items-center justify-center">
          <div className="text-4xl text-sage-primary animate-sanctuary-float">🌿</div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-sage-muted flex items-center justify-center">
          <div className="text-center text-sage-active">
            <div className="text-2xl mb-2">🖼️</div>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  );
}

// Crisis-optimized loading for emergency states
export function CrisisLoading({ 
  message = 'Connecting to support...',
  priority = false 
}: {
  message?: string;
  priority?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-crisis-red/90 to-crisis-red-hover/90 backdrop-blur-sm flex items-center justify-center">
      <div className="sanctuary-card border-crisis-red bg-white text-center max-w-sm w-full mx-4">
        <div className="text-5xl mb-4 animate-crisis-glow">🆘</div>
        
        <h2 className="text-lg font-medium text-crisis-red mb-4">
          {message}
        </h2>
        
        {priority && (
          <p className="text-sm text-sage-active mb-4">
            Priority connection in progress...
          </p>
        )}
        
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-crisis-red rounded-full animate-healing-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SanctuaryLoading;