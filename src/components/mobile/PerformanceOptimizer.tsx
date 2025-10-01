'use client';

import React, { useEffect } from 'react';
import { getCrisisPerformanceMonitor } from '@/lib/mobile/CrisisPerformanceMonitor';

/**
 * Performance Optimizer Component
 * Automatically monitors and optimizes performance for vulnerable users
 * Integrates with trauma-informed mobile provider for crisis scenarios
 */
export function PerformanceOptimizer() {
  useEffect(() => {
    const monitor = getCrisisPerformanceMonitor();
    
    // Subscribe to optimization level changes
    const unsubscribe = monitor.subscribe((optimizationLevel) => {
      // Apply performance optimizations based on current level
      console.log(`Performance optimization level: ${optimizationLevel.level}`);
      
      // Dispatch custom event for other components to react
      window.dispatchEvent(new CustomEvent('performance-optimization-change', {
        detail: optimizationLevel
      }));
    });
    
    // Set up CSS imports based on performance tier
    const loadPerformanceStyles = async () => {
      try {
        // Always load trauma-informed animations
        await import('@/styles/trauma-informed-animations.css');
        
        // Load additional mobile styles if device can handle it
        const metrics = monitor.getMetrics();
        if (metrics.memoryUsage < 30 * 1024 * 1024) { // Less than 30MB
          await import('@/styles/mobile-trauma-informed.css');
          await import('@/styles/mobile-crisis-optimization.css');
        }
      } catch (error) {
        console.warn('Failed to load performance styles:', error);
      }
    };
    
    loadPerformanceStyles();
    
    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);
  
  // This component doesn't render anything - it's purely for side effects
  return null;
}

/**
 * Hook to access performance optimization data
 */
export function usePerformanceOptimization() {
  const [optimizationLevel, setOptimizationLevel] = React.useState(null);
  
  useEffect(() => {
    const monitor = getCrisisPerformanceMonitor();
    
    const unsubscribe = monitor.subscribe((level) => {
      setOptimizationLevel(level);
    });
    
    return unsubscribe;
  }, []);
  
  return {
    optimizationLevel,
    isEmergencyMode: optimizationLevel?.level === 'crisis',
    shouldReduceAnimations: optimizationLevel?.disableAnimations ?? false,
    shouldSimplifyLayout: optimizationLevel?.simplifyLayout ?? false,
    shouldPrioritizeCrisis: optimizationLevel?.prioritizeCrisisElements ?? false
  };
}