'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Performance state for mobile optimization
interface MobilePerformanceState {
  // Device capabilities
  deviceTier: 'ultra-low' | 'low' | 'medium' | 'high' | 'ultra-high';
  memoryGB: number;
  cpuCores: number;
  batteryLevel: number;
  isCharging: boolean;
  
  // Network conditions
  connectionType: '2g' | '3g' | '4g' | '5g' | 'wifi' | 'unknown';
  isSlowConnection: boolean;
  isOffline: boolean;
  bandwidth: number; // Mbps estimate
  
  // Performance metrics
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  memoryUsage: number; // MB
  
  // Optimization flags
  batterySaver: boolean;
  dataSparing: boolean;
  reducedFunctionality: boolean;
  emergencyMode: boolean;
  
  // Loading states
  isInitialLoad: boolean;
  isCriticalPath: boolean;
  hasPreloaded: boolean;
}

interface MobilePerformanceContextType {
  state: MobilePerformanceState;
  actions: {
    enableBatterySaver: () => void;
    enableDataSparing: () => void;
    enableEmergencyMode: () => void;
    optimizeForDevice: (tier: MobilePerformanceState['deviceTier']) => void;
    preloadCriticalResources: () => Promise<void>;
    measurePerformance: () => void;
    reportCrisisOptimization: () => void;
  };
  utils: {
    shouldLoadImage: (priority: 'critical' | 'high' | 'medium' | 'low') => boolean;
    shouldEnableAnimation: () => boolean;
    getOptimalImageFormat: () => 'webp' | 'jpeg' | 'png';
    getCompressionLevel: () => 'high' | 'medium' | 'low';
    shouldPreloadResource: (resourceType: 'css' | 'js' | 'font' | 'image') => boolean;
  };
}

const MobilePerformanceContext = createContext<MobilePerformanceContextType | undefined>(undefined);

interface MobilePerformanceOptimizerProps {
  children: ReactNode;
  emergencyCrisisFallback?: boolean;
}

export function MobilePerformanceOptimizer({ 
  children, 
  emergencyCrisisFallback = false 
}: MobilePerformanceOptimizerProps) {
  const [state, setState] = useState<MobilePerformanceState>({
    deviceTier: 'medium',
    memoryGB: 4,
    cpuCores: 4,
    batteryLevel: 100,
    isCharging: false,
    connectionType: 'unknown',
    isSlowConnection: false,
    isOffline: false,
    bandwidth: 10,
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    memoryUsage: 0,
    batterySaver: false,
    dataSparing: false,
    reducedFunctionality: false,
    emergencyMode: emergencyCrisisFallback,
    isInitialLoad: true,
    isCriticalPath: true,
    hasPreloaded: false
  });

  // Device capability detection and classification
  useEffect(() => {
    const detectDeviceCapabilities = async () => {
      const memory = (navigator as any).deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      const connection = (navigator as any).connection;
      
      // Classify device tier based on memory and CPU
      let deviceTier: MobilePerformanceState['deviceTier'] = 'medium';
      
      if (memory <= 1 && cores <= 2) {
        deviceTier = 'ultra-low';
      } else if (memory <= 2 && cores <= 4) {
        deviceTier = 'low';
      } else if (memory <= 4 && cores <= 6) {
        deviceTier = 'medium';
      } else if (memory <= 8 && cores <= 8) {
        deviceTier = 'high';
      } else {
        deviceTier = 'ultra-high';
      }
      
      // Detect connection type and speed
      let connectionType: MobilePerformanceState['connectionType'] = 'unknown';
      let isSlowConnection = false;
      let bandwidth = 10;
      
      if (connection) {
        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink || 10;
        
        bandwidth = downlink;
        
        switch (effectiveType) {
          case 'slow-2g':
          case '2g':
            connectionType = '2g';
            isSlowConnection = true;
            break;
          case '3g':
            connectionType = '3g';
            isSlowConnection = downlink < 1.5;
            break;
          case '4g':
            connectionType = '4g';
            isSlowConnection = downlink < 5;
            break;
          default:\n            connectionType = bandwidth > 50 ? '5g' : '4g';\n        }\n      }\n      \n      // Monitor battery status\n      let batteryLevel = 100;\n      let isCharging = false;\n      \n      if ('getBattery' in navigator) {\n        try {\n          const battery = await (navigator as any).getBattery();\n          batteryLevel = battery.level * 100;\n          isCharging = battery.charging;\n          \n          const updateBattery = () => {\n            setState(prev => ({\n              ...prev,\n              batteryLevel: battery.level * 100,\n              isCharging: battery.charging,\n              batterySaver: battery.level < 0.2 && !battery.charging\n            }));\n          };\n          \n          battery.addEventListener('levelchange', updateBattery);\n          battery.addEventListener('chargingchange', updateBattery);\n        } catch (error) {\n          console.warn('Battery API not available');\n        }\n      }\n      \n      setState(prev => ({\n        ...prev,\n        deviceTier,\n        memoryGB: memory,\n        cpuCores: cores,\n        batteryLevel,\n        isCharging,\n        connectionType,\n        isSlowConnection,\n        bandwidth,\n        batterySaver: batteryLevel < 20 && !isCharging,\n        dataSparing: isSlowConnection || deviceTier === 'ultra-low'\n      }));\n    };\n    \n    detectDeviceCapabilities();\n  }, []);\n\n  // Monitor online/offline status\n  useEffect(() => {\n    const handleOnline = () => setState(prev => ({ ...prev, isOffline: false }));\n    const handleOffline = () => setState(prev => ({ ...prev, isOffline: true }));\n    \n    window.addEventListener('online', handleOnline);\n    window.addEventListener('offline', handleOffline);\n    \n    setState(prev => ({ ...prev, isOffline: !navigator.onLine }));\n    \n    return () => {\n      window.removeEventListener('online', handleOnline);\n      window.removeEventListener('offline', handleOffline);\n    };\n  }, []);\n\n  // Performance monitoring\n  useEffect(() => {\n    const measurePerformance = () => {\n      if ('performance' in window) {\n        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;\n        const paint = performance.getEntriesByType('paint');\n        \n        const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;\n        const lcp = 0; // Will be updated by observer\n        \n        setState(prev => ({\n          ...prev,\n          fcp,\n          lcp\n        }));\n      }\n      \n      // Monitor memory usage\n      if ('memory' in performance) {\n        const memoryInfo = (performance as any).memory;\n        const memoryUsage = memoryInfo.usedJSHeapSize / (1024 * 1024); // Convert to MB\n        \n        setState(prev => ({ ...prev, memoryUsage }));\n      }\n    };\n    \n    // Measure on load and periodically\n    measurePerformance();\n    const interval = setInterval(measurePerformance, 30000); // Every 30 seconds\n    \n    return () => clearInterval(interval);\n  }, []);\n\n  // LCP observer\n  useEffect(() => {\n    if ('PerformanceObserver' in window) {\n      const lcpObserver = new PerformanceObserver((list) => {\n        const entries = list.getEntries();\n        const lastEntry = entries[entries.length - 1];\n        \n        setState(prev => ({ ...prev, lcp: lastEntry.startTime }));\n      });\n      \n      try {\n        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });\n      } catch (error) {\n        console.warn('LCP observer not supported');\n      }\n      \n      return () => lcpObserver.disconnect();\n    }\n  }, []);\n\n  // Apply performance optimizations based on device and conditions\n  useEffect(() => {\n    const body = document.body;\n    \n    // Clear previous performance classes\n    body.classList.remove(\n      'perf-ultra-low', 'perf-low', 'perf-medium', 'perf-high', 'perf-ultra-high',\n      'battery-saver', 'data-sparing', 'slow-connection', 'emergency-mode',\n      'reduced-functionality'\n    );\n    \n    // Apply current performance classes\n    body.classList.add(`perf-${state.deviceTier}`);\n    \n    if (state.batterySaver) body.classList.add('battery-saver');\n    if (state.dataSparing) body.classList.add('data-sparing');\n    if (state.isSlowConnection) body.classList.add('slow-connection');\n    if (state.emergencyMode) body.classList.add('emergency-mode');\n    if (state.reducedFunctionality) body.classList.add('reduced-functionality');\n    \n    // Set CSS custom properties for fine-tuned control\n    body.style.setProperty('--device-memory', `${state.memoryGB}GB`);\n    body.style.setProperty('--device-cores', `${state.cpuCores}`);\n    body.style.setProperty('--battery-level', `${state.batteryLevel}%`);\n    body.style.setProperty('--bandwidth', `${state.bandwidth}Mbps`);\n    body.style.setProperty('--memory-usage', `${state.memoryUsage}MB`);\n    \n  }, [state]);\n\n  // Preload critical resources based on device capabilities\n  const preloadCriticalResources = async () => {\n    if (state.hasPreloaded) return;\n    \n    const resources = [\n      { href: '/src/styles/trauma-informed-mobile.css', as: 'style', priority: 'critical' },\n      { href: '/src/styles/mobile-accessibility.css', as: 'style', priority: 'high' },\n      { href: '/src/styles/core-web-vitals.css', as: 'style', priority: 'critical' }\n    ];\n    \n    const shouldPreload = (priority: string) => {\n      if (state.emergencyMode) return priority === 'critical';\n      if (state.deviceTier === 'ultra-low') return priority === 'critical';\n      if (state.isSlowConnection) return priority === 'critical' || priority === 'high';\n      return true;\n    };\n    \n    const preloadPromises = resources\n      .filter(resource => shouldPreload(resource.priority))\n      .map(resource => {\n        return new Promise<void>((resolve) => {\n          const link = document.createElement('link');\n          link.rel = 'preload';\n          link.href = resource.href;\n          link.as = resource.as;\n          link.onload = () => resolve();\n          link.onerror = () => resolve(); // Don't fail the whole preload\n          document.head.appendChild(link);\n        });\n      });\n    \n    try {\n      await Promise.all(preloadPromises);\n      setState(prev => ({ ...prev, hasPreloaded: true }));\n    } catch (error) {\n      console.warn('Failed to preload some resources:', error);\n    }\n  };\n\n  const actions = {\n    enableBatterySaver: () => {\n      setState(prev => ({\n        ...prev,\n        batterySaver: true,\n        reducedFunctionality: true\n      }));\n    },\n    \n    enableDataSparing: () => {\n      setState(prev => ({\n        ...prev,\n        dataSparing: true,\n        reducedFunctionality: true\n      }));\n    },\n    \n    enableEmergencyMode: () => {\n      setState(prev => ({\n        ...prev,\n        emergencyMode: true,\n        batterySaver: true,\n        dataSparing: true,\n        reducedFunctionality: true\n      }));\n    },\n    \n    optimizeForDevice: (tier: MobilePerformanceState['deviceTier']) => {\n      setState(prev => ({\n        ...prev,\n        deviceTier: tier,\n        reducedFunctionality: tier === 'ultra-low' || tier === 'low'\n      }));\n    },\n    \n    preloadCriticalResources,\n    \n    measurePerformance: () => {\n      // Trigger performance measurement\n      if ('performance' in window && 'mark' in performance) {\n        performance.mark('mobile-performance-check');\n      }\n    },\n    \n    reportCrisisOptimization: () => {\n      // Report performance optimizations for crisis users\n      if (typeof window !== 'undefined' && 'navigator' in window && 'sendBeacon' in navigator) {\n        const data = {\n          deviceTier: state.deviceTier,\n          batteryLevel: state.batteryLevel,\n          connectionType: state.connectionType,\n          memoryUsage: state.memoryUsage,\n          optimizationsEnabled: {\n            batterySaver: state.batterySaver,\n            dataSparing: state.dataSparing,\n            emergencyMode: state.emergencyMode\n          },\n          timestamp: new Date().toISOString()\n        };\n        \n        navigator.sendBeacon('/api/crisis-performance', JSON.stringify(data));\n      }\n    }\n  };\n\n  const utils = {\n    shouldLoadImage: (priority: 'critical' | 'high' | 'medium' | 'low') => {\n      if (state.emergencyMode) return priority === 'critical';\n      if (state.dataSparing) return priority === 'critical' || priority === 'high';\n      if (state.deviceTier === 'ultra-low') return priority === 'critical';\n      if (state.isSlowConnection) return priority !== 'low';\n      return true;\n    },\n    \n    shouldEnableAnimation: () => {\n      if (state.emergencyMode || state.batterySaver) return false;\n      if (state.deviceTier === 'ultra-low') return false;\n      if (state.batteryLevel < 15) return false;\n      return true;\n    },\n    \n    getOptimalImageFormat: (): 'webp' | 'jpeg' | 'png' => {\n      // Check browser support for modern formats\n      const supportsWebP = 'createImageBitmap' in window;\n      \n      if (state.dataSparing || state.isSlowConnection) {\n        return supportsWebP ? 'webp' : 'jpeg';\n      }\n      \n      return supportsWebP ? 'webp' : 'jpeg';\n    },\n    \n    getCompressionLevel: (): 'high' | 'medium' | 'low' => {\n      if (state.emergencyMode || state.dataSparing) return 'high';\n      if (state.isSlowConnection || state.deviceTier === 'ultra-low') return 'high';\n      if (state.deviceTier === 'low') return 'medium';\n      return 'low';\n    },\n    \n    shouldPreloadResource: (resourceType: 'css' | 'js' | 'font' | 'image') => {\n      if (state.emergencyMode) return resourceType === 'css';\n      if (state.dataSparing) return resourceType === 'css' || resourceType === 'js';\n      if (state.deviceTier === 'ultra-low') return resourceType === 'css';\n      return true;\n    }\n  };\n\n  return (\n    <MobilePerformanceContext.Provider value={{ state, actions, utils }}>\n      {children}\n      \n      {/* Performance monitoring indicators */}\n      {(state.deviceTier === 'ultra-low' || state.batterySaver || state.emergencyMode) && (\n        <div className=\"fixed bottom-16 left-4 z-40 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg\">\n          {state.emergencyMode ? '🚨' : state.batterySaver ? '🔋' : '⚡'} \n          {state.emergencyMode ? 'Emergency' : state.batterySaver ? 'Battery Saver' : 'Performance'} Mode\n        </div>\n      )}\n      \n      {/* Crisis performance fallback */}\n      {state.emergencyMode && state.isOffline && (\n        <div className=\"fixed top-0 left-0 right-0 bg-red-600 text-white p-4 text-center z-50\">\n          <strong>🚨 Emergency Offline Mode</strong>\n          <br />\n          <small>Crisis resources cached locally. Call 988 for immediate help.</small>\n        </div>\n      )}\n    </MobilePerformanceContext.Provider>\n  );\n}\n\nexport function useMobilePerformance() {\n  const context = useContext(MobilePerformanceContext);\n  if (context === undefined) {\n    throw new Error('useMobilePerformance must be used within a MobilePerformanceOptimizer');\n  }\n  return context;\n}\n\n// Hook for performance-aware component loading\nexport function usePerformanceAwareLoading(resourceType: 'image' | 'video' | 'audio' | 'component') {\n  const { state, utils } = useMobilePerformance();\n  \n  const shouldLoad = () => {\n    switch (resourceType) {\n      case 'image':\n        return utils.shouldLoadImage('medium');\n      case 'video':\n      case 'audio':\n        return !state.dataSparing && !state.emergencyMode && state.deviceTier !== 'ultra-low';\n      case 'component':\n        return !state.emergencyMode || state.isCriticalPath;\n      default:\n        return true;\n    }\n  };\n  \n  const loadingStrategy = () => {\n    if (state.emergencyMode) return 'immediate';\n    if (state.isSlowConnection || state.deviceTier === 'ultra-low') return 'lazy';\n    if (state.batterySaver) return 'on-interaction';\n    return 'eager';\n  };\n  \n  return {\n    shouldLoad: shouldLoad(),\n    loadingStrategy: loadingStrategy(),\n    compressionLevel: utils.getCompressionLevel(),\n    imageFormat: utils.getOptimalImageFormat()\n  };\n}\n\n// Hook for crisis-aware performance optimization\nexport function useCrisisPerformanceOptimization() {\n  const { state, actions } = useMobilePerformance();\n  \n  useEffect(() => {\n    // Auto-enable emergency mode for crisis users with poor performance\n    if ((state.deviceTier === 'ultra-low' && state.batteryLevel < 20) ||\n        (state.isSlowConnection && state.batteryLevel < 15)) {\n      actions.enableEmergencyMode();\n    }\n  }, [state.deviceTier, state.batteryLevel, state.isSlowConnection, actions]);\n  \n  return {\n    isOptimizedForCrisis: state.emergencyMode,\n    shouldShowMinimalUI: state.emergencyMode || (state.deviceTier === 'ultra-low' && state.batteryLevel < 30),\n    shouldReduceAnimations: state.batterySaver || state.deviceTier === 'ultra-low',\n    shouldCompressContent: state.dataSparing || state.isSlowConnection,\n    emergencyOptimization: actions.enableEmergencyMode\n  };\n}