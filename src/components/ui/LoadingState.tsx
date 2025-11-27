/*
 * ALCHM Loading States - Trauma-Informed Design
 * Jony Ive Refinement for App Store Excellence
 * 
 * Loading moments as opportunities for calm, never anxiety.
 * Every state transition breathes with the user's nervous system.
 */

'use client';

import React from 'react';
import { interactions } from '@/lib/design-system/interactions';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  variant?: 'gentle' | 'progress' | 'skeleton';
  className?: string;
}

export function LoadingState({ 
  size = 'md', 
  message = 'One moment please...', 
  variant = 'gentle',
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

  if (variant === 'gentle') {
    // Breathing loader - synchronized with calm breathing
    return (
      <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
        <div 
          className={`${sizeClasses[size]} bg-sage-400 rounded-full`}
          style={{
            animation: 'breathingGentle 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite'
          }}
        />
        {message && (
          <span className={`text-sage-600 font-medium ${textSizes[size]}`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'progress') {
    // Progress bar - smooth fill animation
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-sage-400 rounded-full w-full origin-left"
            style={{
              animation: 'progressFill 2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite',
              transform: 'scaleX(0)',
              transformOrigin: 'left'
            }}
          />
        </div>
        {message && (
          <p className={`text-sage-600 text-center ${textSizes[size]}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'skeleton') {
    // Shimmer loading for content
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
          <div className="h-4 bg-gray-200 rounded-lg w-5/6" />
        </div>
        {message && (
          <p className={`text-gray-500 text-center ${textSizes[size]} mt-3`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  // Default to gentle
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div 
        className={`${sizeClasses[size]} bg-sage-400 rounded-full`}
        style={{
          animation: 'breathingGentle 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite'
        }}
      />
      {message && (
        <span className={`text-sage-600 font-medium ${textSizes[size]}`}>
          {message}
        </span>
      )}
    </div>
  );
}

// Full-page loading overlay with gentle entrance
export function LoadingOverlay({ message = 'Preparing your sanctuary...' }: { message?: string }) {
  return (
    <div 
      className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50"
      style={{
        animation: 'fadeIn 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <div className="text-center p-8">
        <div className="text-4xl mb-6">🌿</div>
        <LoadingState size="lg" message={message} variant="gentle" />
      </div>
    </div>
  );
}

// Crisis-safe loading for emergency resources
export function CrisisLoadingState({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-6 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div 
          className="w-8 h-8 rounded-full bg-red-500"
          style={{
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
        <p className="text-red-600 font-medium text-sm text-center">
          Loading support resources...
        </p>
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
      <LoadingState size="sm" message={message} variant="gentle" />
    </div>
  );
}

// Page transition wrapper with breathing room
export function PageTransition({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div 
      className={className}
      style={{
        animation: 'fadeIn 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      {children}
    </div>
  );
}