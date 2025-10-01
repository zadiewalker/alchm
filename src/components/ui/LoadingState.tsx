'use client';

import React from 'react';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  variant?: 'dots' | 'pulse' | 'breathe';
  className?: string;
}

export function LoadingState({ 
  size = 'md', 
  message = 'Loading...', 
  variant = 'breathe',
  className = ''
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-4 ${className}`}>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`${sizeClasses[size]} bg-sage-400 rounded-full animate-pulse`}
              style={{ 
                animationDelay: `${i * 200}ms`,
                animationDuration: '1.2s' 
              }}
            />
          ))}
        </div>
        {message && (
          <span className={`text-sage-600 font-medium ${textSizes[size]}`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <div 
          className={`${sizeClasses[size]} bg-sage-400 rounded-full animate-pulse`}
          style={{ animationDuration: '1.5s' }}
        />
        {message && (
          <span className={`text-sage-600 font-medium ${textSizes[size]} animate-pulse`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  // Default 'breathe' variant - most trauma-informed
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} bg-sage-400/20 rounded-full animate-ping absolute`}
          style={{ animationDuration: '2s' }}
        />
        <div 
          className={`${sizeClasses[size]} bg-sage-400 rounded-full animate-pulse`}
          style={{ animationDuration: '2s' }}
        />
      </div>
      {message && (
        <span className={`text-sage-600 font-medium ${textSizes[size]} opacity-75`}>
          {message}
        </span>
      )}
    </div>
  );
}

// Full-page loading overlay
export function LoadingOverlay({ message = 'Preparing your sanctuary...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-surface/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center p-8">
        <div className="text-4xl mb-4 animate-pulse">🌿</div>
        <LoadingState size="lg" message={message} variant="breathe" />
      </div>
    </div>
  );
}

// Inline loading for components
export function InlineLoading({ 
  message = 'Loading...', 
  className = '' 
}: { 
  message?: string; 
  className?: string; 
}) {
  return (
    <div className={`py-8 ${className}`}>
      <LoadingState size="sm" message={message} variant="dots" />
    </div>
  );
}