'use client';

/**
 * React Memory Manager for ALCHM
 * Provides hooks and utilities for proper React component memory management
 * Focuses on preventing memory leaks in crisis-critical applications
 */

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import MemoryLeakDetector, { CleanupFunction } from './memory-leak-detector';

/**
 * Hook for safe useEffect cleanup
 * Automatically registers cleanup functions with memory manager
 */
export function useSafeEffect(
  effect: () => (() => void) | void,
  deps?: React.DependencyList,
  componentName?: string
) {
  const cleanupRef = useRef<(() => void) | null>(null);
  const memoryManager = useMemo(() => MemoryLeakDetector.getInstance(), []);
  
  useEffect(() => {
    // Execute the effect and capture cleanup
    const cleanup = effect();
    cleanupRef.current = cleanup || null;
    
    // Register with memory manager if cleanup exists
    if (cleanup && componentName) {
      const cleanupFunction: CleanupFunction = {
        name: `${componentName}-effect-cleanup`,
        cleanup,
        component: componentName,
        type: 'subscription'
      };
      memoryManager.registerCleanup(cleanupFunction);
    }
    
    return () => {
      // Execute cleanup
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, deps);
}

/**
 * Hook for safe event listener management
 * Automatically removes event listeners on unmount
 */
export function useSafeEventListener<T extends keyof WindowEventMap>(
  target: Window | Document | Element | null,
  eventType: T,
  handler: (event: WindowEventMap[T]) => void,
  options?: AddEventListenerOptions,
  componentName?: string
) {
  const handlerRef = useRef(handler);
  const memoryManager = useMemo(() => MemoryLeakDetector.getInstance(), []);
  
  // Update handler reference
  handlerRef.current = handler;
  
  useEffect(() => {
    if (!target) return;
    
    // Create stable handler
    const stableHandler = (event: Event) => {
      handlerRef.current(event as WindowEventMap[T]);
    };
    
    // Add event listener
    target.addEventListener(eventType, stableHandler, options);
    
    // Register cleanup
    const cleanupFunction: CleanupFunction = {
      name: `${componentName || 'unknown'}-${eventType}-listener`,
      cleanup: () => target.removeEventListener(eventType, stableHandler, options),
      component: componentName,
      type: 'listener'
    };
    memoryManager.registerCleanup(cleanupFunction);
    
    return () => {
      target.removeEventListener(eventType, stableHandler, options);
    };
  }, [target, eventType, options, componentName, memoryManager]);
}

/**
 * Hook for safe timer management
 * Automatically clears timers on unmount
 */
export function useSafeTimer(componentName?: string) {
  const timersRef = useRef<Set<number>>(new Set());
  const memoryManager = useMemo(() => MemoryLeakDetector.getInstance(), []);
  
  const setTimeout = useCallback((callback: () => void, delay: number): number => {
    const timerId = typeof window !== 'undefined' && window.setTimeout(() => {
      callback();
      timersRef.current.delete(timerId);
    }, delay);
    
    timersRef.current.add(timerId);
    
    // Register cleanup
    const cleanupFunction: CleanupFunction = {
      name: `${componentName || 'unknown'}-timeout-${timerId}`,
      cleanup: () => {
        typeof window !== 'undefined' && window.clearTimeout(timerId);
        timersRef.current.delete(timerId);
      },
      component: componentName,
      type: 'timer'
    };
    memoryManager.registerCleanup(cleanupFunction);
    
    return timerId;
  }, [componentName, memoryManager]);
  
  const setInterval = useCallback((callback: () => void, delay: number): number => {
    const timerId = typeof window !== 'undefined' && window.setInterval(callback, delay);
    timersRef.current.add(timerId);
    
    // Register cleanup
    const cleanupFunction: CleanupFunction = {
      name: `${componentName || 'unknown'}-interval-${timerId}`,
      cleanup: () => {
        typeof window !== 'undefined' && window.clearInterval(timerId);
        timersRef.current.delete(timerId);
      },
      component: componentName,
      type: 'timer'
    };
    memoryManager.registerCleanup(cleanupFunction);
    
    return timerId;
  }, [componentName, memoryManager]);
  
  const clearTimeout = useCallback((timerId: number) => {
    typeof window !== 'undefined' && window.clearTimeout(timerId);
    timersRef.current.delete(timerId);
  }, []);
  
  const clearInterval = useCallback((timerId: number) => {
    typeof window !== 'undefined' && window.clearInterval(timerId);
    timersRef.current.delete(timerId);
  }, []);
  
  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timerId => {
        typeof window !== 'undefined' && window.clearTimeout(timerId);
        typeof window !== 'undefined' && window.clearInterval(timerId);
      });
      timersRef.current.clear();
    };
  }, []);
  
  return { setTimeout, setInterval, clearTimeout, clearInterval };
}

/**
 * Hook for safe Firebase listener management
 * Automatically unsubscribes from Firebase listeners
 */
export function useSafeFirebaseListener<T>(
  subscribe: () => (() => void) | Promise<() => void>,
  deps: React.DependencyList,
  componentName?: string
) {
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const memoryManager = useMemo(() => MemoryLeakDetector.getInstance(), []);
  
  useEffect(() => {
    let mounted = true;
    
    const setupSubscription = async () => {
      try {
        const unsubscribe = await Promise.resolve(subscribe());
        
        if (!mounted) {
          // Component unmounted before subscription completed
          unsubscribe();
          return;
        }
        
        unsubscribeRef.current = unsubscribe;
        
        // Register cleanup
        const cleanupFunction: CleanupFunction = {
          name: `${componentName || 'unknown'}-firebase-listener`,
          cleanup: () => {
            if (unsubscribeRef.current) {
              unsubscribeRef.current();
              unsubscribeRef.current = null;
            }
          },
          component: componentName,
          type: 'subscription'
        };
        memoryManager.registerCleanup(cleanupFunction);
        
      } catch (error) {
        console.error(`[ALCHM Memory] Firebase subscription failed in ${componentName}:`, error);
      }
    };
    
    setupSubscription();
    
    return () => {
      mounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, deps);
}

/**
 * Hook for memory-safe state management
 * Prevents state updates after component unmount
 */
export function useSafeState<T>(
  initialState: T | (() => T),
  componentName?: string
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = React.useState(initialState);
  const mountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  const safeSetState = useCallback((value: T | ((prev: T) => T)) => {
    if (mountedRef.current) {
      setState(value);
    } else {
      console.warn(`[ALCHM Memory] Attempted state update after unmount in ${componentName}`);
    }
  }, [componentName]);
  
  return [state, safeSetState];
}

/**
 * Hook for detecting memory pressure and adjusting behavior
 */
export function useMemoryPressure(componentName?: string) {
  const [memoryPressure, setMemoryPressure] = useSafeState<'low' | 'medium' | 'high'>('low');
  const memoryManager = useMemo(() => MemoryLeakDetector.getInstance(), []);
  
  useSafeEffect(() => {
    const checkMemoryPressure = () => {
      const usage = memoryManager.getMemoryUsage();
      
      if (usage.status === 'critical') {
        setMemoryPressure('high');
      } else if (usage.status === 'warning') {
        setMemoryPressure('medium');
      } else {
        setMemoryPressure('low');
      }
    };
    
    // Check immediately
    checkMemoryPressure();
    
    // Check periodically
    const interval = setInterval(checkMemoryPressure, 10000);
    
    return () => clearInterval(interval);
  }, [], componentName);
  
  return memoryPressure;
}

/**
 * Hook for crisis-safe component behavior
 * Automatically reduces functionality under memory pressure
 */
export function useCrisisSafeComponent(componentName: string) {
  const memoryPressure = useMemoryPressure(componentName);
  const [isCrisisMode, setIsCrisisMode] = useSafeState(false, componentName);
  
  useSafeEffect(() => {
    // Detect crisis mode from URL or typeof window !== 'undefined' && localStorage
    const crisisIndicators = [
      '/crisis',
      '/emergency',
      '/support',
      typeof window !== 'undefined' && window.location.search.includes('crisis=true'),
      typeof window !== 'undefined' && localStorage.getItem('crisis-mode') === 'true'
    ];
    
    setIsCrisisMode(crisisIndicators.some(Boolean));
  }, [], componentName);
  
  // Reduce functionality under high memory pressure or crisis mode
  const shouldReduceFeatures = memoryPressure === 'high' || isCrisisMode;
  const shouldDisableAnimations = memoryPressure !== 'low' || isCrisisMode;
  const shouldLimitRendering = memoryPressure === 'high';
  
  return {
    isCrisisMode,
    memoryPressure,
    shouldReduceFeatures,
    shouldDisableAnimations,
    shouldLimitRendering
  };
}

/**
 * Higher-order component for automatic memory management
 */
export function withMemoryManagement<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function MemoryManagedComponent(props: P) {
    const { isCrisisMode, shouldReduceFeatures } = useCrisisSafeComponent(componentName);
    
    // Render simplified version under memory pressure
    if (shouldReduceFeatures) {
      return React.createElement('div', { className: 'memory-safe-fallback' }, 'Loading...');
    }
    
    return React.createElement(Component, props);
  };
}

/**
 * Memory-safe async operation hook
 */
export function useSafeAsync<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList,
  componentName?: string
) {
  const [state, setState] = useSafeState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({ data: null, loading: false, error: null }, componentName);
  
  const mountedRef = useRef(true);
  
  useSafeEffect(() => {
    let cancelled = false;
    
    setState({ data: null, loading: true, error: null });
    
    asyncFn()
      .then(data => {
        if (!cancelled && mountedRef.current) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch(error => {
        if (!cancelled && mountedRef.current) {
          setState({ data: null, loading: false, error });
        }
      });
    
    return () => {
      cancelled = true;
    };
  }, deps, componentName);
  
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  return state;
}

// Re-export React hooks with safe versions as default
export { useSafeState as useState };
export { useSafeEffect as useEffect };

// Export original React for cases where safe versions aren't needed
export { React };