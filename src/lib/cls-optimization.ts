'use client';

/**
 * ALCHM CLS (Cumulative Layout Shift) Optimization System
 * Target: <0.05 CLS for visual stability
 * 
 * Crisis-critical: Visual stability prevents user confusion during crisis
 */

import { useEffect, useState, useCallback } from 'react';

// Image component with guaranteed dimensions to prevent CLS
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        backgroundColor: '#f3f4f6' // Placeholder color
      }}
    >
      {!hasError && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
      
      {/* Loading skeleton to prevent CLS */}
      {(!isLoaded && !hasError) && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite'
          }}
        />
      )}
      
      {/* Error state with reserved space */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
}

// Layout skeleton components to prevent CLS during loading
export function LayoutSkeleton({ 
  height = 200, 
  className = '' 
}: { 
  height?: number; 
  className?: string; 
}) {
  return (
    <div 
      className={`bg-gray-100 animate-pulse rounded ${className}`}
      style={{ height: `${height}px` }}
    />
  );
}

export function TextSkeleton({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 animate-pulse rounded h-4"
          style={{
            width: i === lines - 1 ? '75%' : '100%'
          }}
        />
      ))}
    </div>
  );
}

// Font loading optimization to prevent CLS
export function useOptimizedFontLoading() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if fonts are already loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      // Fallback for browsers without Font Loading API
      const timeout = setTimeout(() => {
        setFontsLoaded(true);
      }, 3000); // 3 second timeout

      return () => clearTimeout(timeout);
    }
  }, []);

  return fontsLoaded;
}

// Dynamic content container that reserves space
export function ReservedSpaceContainer({
  children,
  minHeight = 100,
  className = ''
}: {
  children: React.ReactNode;
  minHeight?: number;
  className?: string;
}) {
  return (
    <div 
      className={`transition-all duration-300 ease-out ${className}`}
      style={{ minHeight: `${minHeight}px` }}
    >
      {children}
    </div>
  );
}

// CLS monitoring and reporting
export class CLSMonitor {
  private static instance: CLSMonitor;
  private clsValues: number[] = [];
  private criticalThreshold = 0.05;
  private warningThreshold = 0.025;
  
  static getInstance(): CLSMonitor {
    if (!this.instance) {
      this.instance = new CLSMonitor();
    }
    return this.instance;
  }

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        
        this.recordCLS(clsValue);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('CLS monitoring not supported in this browser');
    }
  }

  private recordCLS(cls: number) {
    this.clsValues.push(cls);
    
    // Keep only last 10 measurements
    if (this.clsValues.length > 10) {
      this.clsValues.shift();
    }

    // Alert if CLS exceeds thresholds
    if (cls > this.criticalThreshold) {
      console.warn(`🚨 CRITICAL CLS: ${cls.toFixed(4)} (target: <${this.criticalThreshold})`);
      this.triggerOptimization();
    } else if (cls > this.warningThreshold) {
      console.warn(`⚠️ HIGH CLS: ${cls.toFixed(4)} (target: <${this.warningThreshold})`);
    }
  }

  private triggerOptimization() {
    // Log recommendations for CLS improvements
    console.log('🔧 CLS Optimization Recommendations:');
    console.log('• Add explicit dimensions to images and videos');
    console.log('• Reserve space for dynamic content');
    console.log('• Avoid inserting content above existing content');
    console.log('• Use transform animations instead of layout-triggering properties');
  }

  getCurrentCLS(): number | null {
    return this.clsValues.length > 0 
      ? this.clsValues[this.clsValues.length - 1] 
      : null;
  }

  getAverageCLS(): number | null {
    if (this.clsValues.length === 0) return null;
    return this.clsValues.reduce((sum, val) => sum + val, 0) / this.clsValues.length;
  }

  getPerformanceGrade(): 'good' | 'needs-improvement' | 'poor' {
    const avgCLS = this.getAverageCLS();
    if (avgCLS === null) return 'good';
    
    if (avgCLS <= 0.1) return 'good';
    if (avgCLS <= 0.25) return 'needs-improvement';
    return 'poor';
  }
}

// React hook for CLS optimization
export function useCLSOptimization() {
  const [isLayoutStable, setIsLayoutStable] = useState(false);
  const clsMonitor = CLSMonitor.getInstance();

  useEffect(() => {
    // Mark layout as stable after initial render
    const timer = setTimeout(() => {
      setIsLayoutStable(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const createStableContainer = useCallback((
    minHeight: number = 100,
    className: string = ''
  ) => {
    return {
      style: { 
        minHeight: `${minHeight}px`,
        transition: isLayoutStable ? 'min-height 0.3s ease' : 'none'
      },
      className: `${className} ${isLayoutStable ? 'layout-stable' : 'layout-stabilizing'}`
    };
  }, [isLayoutStable]);

  return {
    isLayoutStable,
    createStableContainer,
    currentCLS: clsMonitor.getCurrentCLS(),
    averageCLS: clsMonitor.getAverageCLS(),
    performanceGrade: clsMonitor.getPerformanceGrade()
  };
}

// Utility for preventing layout shifts during content injection
export function usePreventCLS<T>(
  content: T,
  reservedHeight: number = 200
): [T | null, boolean] {
  const [stableContent, setStableContent] = useState<T | null>(null);
  const [isStable, setIsStable] = useState(false);

  useEffect(() => {
    if (!content) return;

    // Reserve space first, then inject content
    const timer = setTimeout(() => {
      setStableContent(content);
      
      // Mark as stable after content injection
      const stabilityTimer = setTimeout(() => {
        setIsStable(true);
      }, 50);

      return () => clearTimeout(stabilityTimer);
    }, 16); // One frame delay

    return () => clearTimeout(timer);
  }, [content]);

  return [stableContent, isStable];
}

// Global CLS optimization CSS injection
export function injectCLSOptimizationStyles() {
  if (typeof window === 'undefined') return;

  const styleId = 'cls-optimization-styles';
  
  // Don't inject if already present
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* CLS Optimization Styles */
    
    /* Shimmer animation for loading states */
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    /* Stable layout utilities */
    .layout-stable {
      transition: all 0.3s ease-out;
    }
    
    .layout-stabilizing {
      transition: none;
    }
    
    /* Prevent layout shifts from images */
    img {
      max-width: 100%;
      height: auto;
    }
    
    /* Stable button dimensions */
    .btn-stable {
      min-width: 120px;
      min-height: 44px;
    }
    
    /* Reserved space for dynamic content */
    .reserved-space {
      min-height: var(--reserved-height, 100px);
    }
    
    /* Font loading optimization */
    .font-loading {
      font-display: swap;
      visibility: hidden;
    }
    
    .font-loaded {
      visibility: visible;
    }
    
    /* Transform-based animations (don't trigger layout) */
    .scale-animation {
      transform: scale(1);
      transition: transform 0.2s ease;
    }
    
    .scale-animation:hover {
      transform: scale(1.05);
    }
    
    .translate-animation {
      transform: translateY(0);
      transition: transform 0.3s ease;
    }
  `;
  
  document.head.appendChild(style);
}

// Export the monitor instance
export const clsMonitor = CLSMonitor.getInstance();