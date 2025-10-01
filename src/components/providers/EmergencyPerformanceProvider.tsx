/**
 * EMERGENCY PERFORMANCE PROVIDER
 * Wraps the app with critical performance optimizations for crisis users
 * Initializes emergency monitoring and optimization systems
 */

"use client";

import { useEffect, ReactNode } from 'react';
import { emergencyPerformanceOptimizer } from '@/lib/emergency-performance-optimizer';
import { crisisResourcePreloader } from '@/lib/crisis-resource-preloader';

interface EmergencyPerformanceProviderProps {
  children: ReactNode;
}

export function EmergencyPerformanceProvider({ children }: EmergencyPerformanceProviderProps) {
  useEffect(() => {
    // Initialize crisis resource preloading immediately
    const initializeCrisisResources = async () => {
      try {
        console.log('🚨 Initializing emergency crisis resources...');
        
        // Preload emergency contacts to typeof window !== 'undefined' && localStorage for instant access
        crisisResourcePreloader.preloadEmergencyContacts();
        
        // Initialize crisis resource cache
        await crisisResourcePreloader.initialize();
        
        console.log('✅ Emergency crisis resources initialized');
      } catch (error) {
        console.error('🚨 Crisis resource initialization failed:', error);
        // Continue - better to have some functionality than none
      }
    };

    // Initialize emergency performance optimization
    const initializeEmergencyOptimization = async () => {
      try {
        console.log('⚡ Initializing emergency performance optimization...');
        
        // Check if we should activate emergency mode based on URL params
        const urlParams = new URLSearchParams(typeof window !== 'undefined' && window.location.search);
        if (urlParams.get('emergency') === 'true') {
          emergencyPerformanceOptimizer.enableEmergencyMode();
        }
        
        // Validate crisis resource loading speed
        const validation = await emergencyPerformanceOptimizer.validateCrisisResourceSpeed();
        
        if (!validation.passed) {
          console.warn('⚠️ Crisis resources loading slowly:', validation.warnings);
          // Auto-enable emergency mode if crisis resources are slow
          emergencyPerformanceOptimizer.enableEmergencyMode();
        }
        
        console.log('✅ Emergency performance optimization initialized');
      } catch (error) {
        console.error('🚨 Emergency performance optimization failed:', error);
      }
    };

    // Run initializations in parallel
    Promise.all([
      initializeCrisisResources(),
      initializeEmergencyOptimization()
    ]);

    // Set up performance monitoring for crisis safety
    const monitorPerformance = () => {
      const metrics = emergencyPerformanceOptimizer.getMetrics();
      
      // Log performance status for crisis safety monitoring
      console.log('📊 Performance metrics:', {
        isEmergencyMode: metrics.isEmergencyMode,
        metrics: metrics.metrics
      });
    };

    // Monitor performance every 30 seconds
    const performanceInterval = setInterval(monitorPerformance, 30000);

    // Cleanup function
    return () => {
      clearInterval(performanceInterval);
    };
  }, []);

  // Add emergency mode CSS class to body for styling
  useEffect(() => {
    const checkEmergencyMode = () => {
      const metrics = emergencyPerformanceOptimizer.getMetrics();
      if (metrics.isEmergencyMode) {
        typeof window !== 'undefined' && document.body.classList.add('emergency-mode');
      } else {
        typeof window !== 'undefined' && document.body.classList.remove('emergency-mode');
      }
    };

    checkEmergencyMode();
    
    // Check every 5 seconds for emergency mode changes
    const emergencyModeInterval = setInterval(checkEmergencyMode, 5000);

    return () => clearInterval(emergencyModeInterval);
  }, []);

  return <>{children}</>;
}

export default EmergencyPerformanceProvider;