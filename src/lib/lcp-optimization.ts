'use client';

/**
 * ALCHM LCP (Largest Contentful Paint) Optimization System
 * Target: <2000ms LCP for critical page loads
 * 
 * Crisis-critical: Fast content rendering can save lives during crisis
 */

import { useEffect, useState, useCallback } from 'react';

// Resource priority management for LCP optimization
export type ResourcePriority = 'critical' | 'high' | 'normal' | 'low';

export interface LCPOptimizationConfig {
  enablePreloading: boolean;
  enableImageOptimization: boolean;
  enableCriticalCSS: boolean;
  enableResourceHints: boolean;
}

// LCP Resource Manager
export class LCPResourceManager {
  private static instance: LCPResourceManager;
  private criticalResources: Set<string> = new Set();
  private preloadedResources: Set<string> = new Set();
  
  static getInstance(): LCPResourceManager {
    if (!this.instance) {
      this.instance = new LCPResourceManager();
    }
    return this.instance;
  }

  // Mark resources as critical for LCP
  markAsCritical(resourceUrl: string) {
    this.criticalResources.add(resourceUrl);
  }

  // Preload critical resources
  preloadResource(url: string, type: 'image' | 'font' | 'script' | 'style', priority: ResourcePriority = 'high') {
    if (typeof window === 'undefined') return;
    if (this.preloadedResources.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    if (priority === 'critical') {
      link.setAttribute('fetchpriority', 'high');
    }
    
    if (type === 'font') {
      link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
    this.preloadedResources.add(url);
  }

  // Optimize images for LCP
  optimizeImage(src: string, options: {
    width: number;
    height: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  }) {
    const { width, height, quality = 80, format = 'auto' } = options;
    
    // For Firebase hosting, use URL parameters for optimization
    const url = new URL(src, window.location.origin);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('q', quality.toString());
    
    if (format !== 'auto') {
      url.searchParams.set('f', format);
    }
    
    return url.toString();
  }

  // Preload critical above-the-fold content
  preloadAboveTheFold() {
    if (typeof window === 'undefined') return;

    // Preload critical CSS
    this.preloadResource('/styles/critical.css', 'style', 'critical');
    
    // Preload system fonts
    this.preloadResource('/fonts/system-ui.woff2', 'font', 'critical');
    
    // Preload hero image if exists
    const heroImage = document.querySelector('[data-lcp-image]') as HTMLImageElement;
    if (heroImage && heroImage.src) {
      this.preloadResource(heroImage.src, 'image', 'critical');
    }
  }
}

// LCP Monitoring and Analytics
export class LCPMonitor {
  private static instance: LCPMonitor;
  private lcpValues: number[] = [];
  private criticalThreshold = 2000; // ms
  private warningThreshold = 1500; // ms
  private lcpElement: Element | null = null;
  
  static getInstance(): LCPMonitor {
    if (!this.instance) {
      this.instance = new LCPMonitor();
    }
    return this.instance;
  }

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        if (lastEntry) {
          const lcp = lastEntry.startTime;
          this.lcpElement = lastEntry.element;
          this.recordLCP(lcp);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP monitoring not supported in this browser');
    }
  }

  private recordLCP(lcp: number) {
    this.lcpValues.push(lcp);
    
    // Keep only last 10 measurements
    if (this.lcpValues.length > 10) {
      this.lcpValues.shift();
    }

    // Alert if LCP exceeds thresholds
    if (lcp > this.criticalThreshold) {
      console.warn(`🚨 CRITICAL LCP: ${lcp.toFixed(2)}ms (target: <${this.criticalThreshold}ms)`);
      this.triggerOptimization();
    } else if (lcp > this.warningThreshold) {
      console.warn(`⚠️ HIGH LCP: ${lcp.toFixed(2)}ms (target: <${this.warningThreshold}ms)`);
    }

    // Log LCP element for debugging
    if (this.lcpElement) {
      console.log('LCP Element:', this.lcpElement);
    }
  }

  private triggerOptimization() {
    console.log('🔧 LCP Optimization Recommendations:');
    console.log('• Optimize images (WebP/AVIF format, appropriate sizing)');
    console.log('• Preload critical resources');
    console.log('• Minimize render-blocking resources');
    console.log('• Use a CDN for faster content delivery');
    console.log('• Optimize server response times');
  }

  getCurrentLCP(): number | null {
    return this.lcpValues.length > 0 
      ? this.lcpValues[this.lcpValues.length - 1] 
      : null;
  }

  getAverageLCP(): number | null {
    if (this.lcpValues.length === 0) return null;
    return this.lcpValues.reduce((sum, val) => sum + val, 0) / this.lcpValues.length;
  }

  getLCPElement(): Element | null {
    return this.lcpElement;
  }

  getPerformanceGrade(): 'good' | 'needs-improvement' | 'poor' {
    const avgLCP = this.getAverageLCP();
    if (avgLCP === null) return 'good';
    
    if (avgLCP <= 2500) return 'good';
    if (avgLCP <= 4000) return 'needs-improvement';
    return 'poor';
  }
}

// Optimized image component for LCP
export interface LCPOptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
}

export function LCPOptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  quality = 80,
  format = 'auto'
}: LCPOptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  const resourceManager = LCPResourceManager.getInstance();

  useEffect(() => {
    // Optimize image URL
    const optimized = resourceManager.optimizeImage(src, {
      width,
      height,
      quality,
      format
    });
    setOptimizedSrc(optimized);

    // Preload if priority
    if (priority) {
      resourceManager.preloadResource(optimized, 'image', 'critical');
      resourceManager.markAsCritical(optimized);
    }
  }, [src, width, height, quality, format, priority]);

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      data-lcp-image={priority}
      style={{
        aspectRatio: `${width}/${height}`,
        maxWidth: '100%',
        height: 'auto'
      }}
      onLoad={() => setIsLoaded(true)}
      onError={(e) => {
        console.warn('LCP image failed to load:', optimizedSrc);
        // Fallback to original src
        if (optimizedSrc !== src) {
          setOptimizedSrc(src);
        }
      }}
    />
  );
}

// Critical CSS injection for LCP
export function injectCriticalCSS(css: string) {
  if (typeof window === 'undefined') return;

  const style = document.createElement('style');
  style.innerHTML = css;
  style.setAttribute('data-critical-css', 'true');
  
  // Insert at the beginning of head for highest priority
  const firstStyle = document.head.querySelector('style, link[rel="stylesheet"]');
  if (firstStyle) {
    document.head.insertBefore(style, firstStyle);
  } else {
    document.head.appendChild(style);
  }
}

// React hook for LCP optimization
export function useLCPOptimization(config: Partial<LCPOptimizationConfig> = {}) {
  const [isOptimized, setIsOptimized] = useState(false);
  const lcpMonitor = LCPMonitor.getInstance();
  const resourceManager = LCPResourceManager.getInstance();
  
  const defaultConfig: LCPOptimizationConfig = {
    enablePreloading: true,
    enableImageOptimization: true,
    enableCriticalCSS: true,
    enableResourceHints: true,
    ...config
  };

  useEffect(() => {
    if (defaultConfig.enablePreloading) {
      resourceManager.preloadAboveTheFold();
    }

    if (defaultConfig.enableCriticalCSS) {
      // Inject critical CSS for immediate rendering
      injectCriticalCSS(`
        /* Critical above-the-fold styles */
        body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
        .hero-section { min-height: 100vh; }
        .loading-state { opacity: 0.8; }
      `);
    }

    setIsOptimized(true);
  }, [defaultConfig]);

  const optimizeForLCP = useCallback((element: HTMLElement) => {
    if (!element) return;

    // Mark element as LCP candidate
    element.setAttribute('data-lcp-candidate', 'true');
    
    // Ensure critical styles are applied
    element.style.willChange = 'auto';
    element.style.contentVisibility = 'auto';
  }, []);

  return {
    isOptimized,
    optimizeForLCP,
    currentLCP: lcpMonitor.getCurrentLCP(),
    averageLCP: lcpMonitor.getAverageLCP(),
    lcpElement: lcpMonitor.getLCPElement(),
    performanceGrade: lcpMonitor.getPerformanceGrade(),
    resourceManager,
    lcpMonitor
  };
}

// Performance-optimized font loading
export function optimizeFontLoading() {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fonts = [
    '/fonts/inter-var.woff2',
    '/fonts/system-ui.woff2'
  ];

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });

  // Use font-display: swap for faster text rendering
  const style = document.createElement('style');
  style.innerHTML = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
      src: url('/fonts/inter-var.woff2') format('woff2-variations');
    }
    
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
  `;
  document.head.appendChild(style);
}

// Export instances
export const lcpMonitor = LCPMonitor.getInstance();
export const lcpResourceManager = LCPResourceManager.getInstance();