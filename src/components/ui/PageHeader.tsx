'use client';

import React from 'react';
import { Button } from './button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backAction?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    icon?: React.ReactNode;
  };
  loading?: boolean;
  variant?: 'default' | 'glass' | 'minimal';
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  backAction,
  primaryAction,
  loading = false,
  variant = 'default',
  className = ''
}: PageHeaderProps) {
  const variantClasses = {
    default: 'bg-sanctuary-white/10 backdrop-blur-sm border-b border-sanctuary-white/20',
    glass: 'bg-sanctuary-white/5 backdrop-blur-md border-b border-sage-200/30',
    minimal: 'bg-transparent'
  };

  return (
    <header className={`${variantClasses[variant]} ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-4 flex-1">
            {backAction && (
              <Button
                onClick={backAction.onClick}
                variant="ghost"
                size="default"
                className="gap-2 text-sanctuary-white hover:text-white hover:bg-sanctuary-white/10"
                aria-label={`Go back to ${backAction.label}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {backAction.label}
              </Button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-light text-sanctuary-white leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sanctuary-white/70 text-sm sm:text-base font-medium mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {primaryAction && (
            <div className="flex-shrink-0">
              <Button
                onClick={primaryAction.onClick}
                variant={primaryAction.variant || 'secondary'}
                size="default"
                className="gap-2"
                disabled={loading}
                aria-label={primaryAction.label}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  primaryAction.icon || (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )
                )}
                {primaryAction.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Loading state for headers
export function PageHeaderSkeleton({ className = '' }: { className?: string }) {
  return (
    <header className={`bg-sanctuary-white/10 backdrop-blur-sm border-b border-sanctuary-white/20 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-24 h-10 bg-sanctuary-white/20 rounded-lg animate-pulse" />
            <div className="min-w-0 flex-1">
              <div className="w-48 h-8 bg-sanctuary-white/20 rounded-lg animate-pulse mb-2" />
              <div className="w-32 h-4 bg-sanctuary-white/15 rounded-md animate-pulse" />
            </div>
          </div>
          <div className="w-32 h-10 bg-sanctuary-white/20 rounded-lg animate-pulse" />
        </div>
      </div>
    </header>
  );
}