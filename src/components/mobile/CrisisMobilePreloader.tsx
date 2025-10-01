'use client';

// ALCHM Crisis Mobile Preloader
// Trauma-informed mobile optimization ensuring <3s crisis resource access
// Battery-efficient, memory-aware preloading for vulnerable users

import { useEffect, useRef, useState } from 'react';
import { crisisResourceCache } from '@/lib/crisis-resource-cache-manager';
import { crisisPerformanceMonitor } from '@/lib/crisis-performance-monitor';

interface MobileCapabilities {
  deviceMemory: number;
  hardwareConcurrency: number;
  connectionType: string;
  batteryLevel: number;
  isCharging: boolean;
  isMobile: boolean;
  isOldDevice: boolean;
  screenSize: { width: number; height: number };
  supportsTouchEvents: boolean;
}

interface PreloadingMetrics {
  startTime: number;
  completedResources: number;
  totalResources: number;
  failedResources: number;
  averageLoadTime: number;
  batteryConsumed: number;
  memoryUsed: number;
}

export default function CrisisMobilePreloader() {
  const [capabilities, setCapabilities] = useState<MobileCapabilities | null>(null);
  const [metrics, setMetrics] = useState<PreloadingMetrics>({
    startTime: Date.now(),
    completedResources: 0,
    totalResources: 0,
    failedResources: 0,
    averageLoadTime: 0,
    batteryConsumed: 0,
    memoryUsed: 0
  });
  const [isPreloading, setIsPreloading] = useState(false);
  const preloadingRef = useRef<boolean>(false);
  const batteryRef = useRef<any>(null);
  const memoryMonitorRef = useRef<number>(0);

  // Detect mobile capabilities and constraints
  useEffect(() => {
    const detectCapabilities = async () => {
      const capabilities: MobileCapabilities = {
        deviceMemory: (navigator as any).deviceMemory || 4,
        hardwareConcurrency: navigator.hardwareConcurrency || 2,
        connectionType: (navigator as any).connection?.effectiveType || '4g',
        batteryLevel: 1,
        isCharging: false,
        isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isOldDevice: false,
        screenSize: { width: window.innerWidth, height: window.innerHeight },
        supportsTouchEvents: 'ontouchstart' in window
      };

      // Battery detection
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          batteryRef.current = battery;
          capabilities.batteryLevel = battery.level;
          capabilities.isCharging = battery.charging;

          // Monitor battery changes
          battery.addEventListener('levelchange', () => {
            setCapabilities(prev => prev ? {
              ...prev,
              batteryLevel: battery.level
            } : null);
          });

          battery.addEventListener('chargingchange', () => {
            setCapabilities(prev => prev ? {
              ...prev,
              isCharging: battery.charging
            } : null);
          });
        } catch (error) {
          console.warn('[Crisis Preloader] Battery API not available');
        }
      }

      // Old device detection
      const ua = navigator.userAgent;
      capabilities.isOldDevice = 
        /iPhone OS (8|9|10|11|12|13)/i.test(ua) ||
        /Android [4-8]/i.test(ua) ||
        capabilities.hardwareConcurrency <= 2 ||
        capabilities.deviceMemory <= 2;

      setCapabilities(capabilities);
    };

    detectCapabilities();
  }, []);

  // Memory monitoring for trauma-informed optimization
  useEffect(() => {
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const memoryUsed = memInfo.usedJSHeapSize / 1024 / 1024; // MB
        memoryMonitorRef.current = memoryUsed;
        
        setMetrics(prev => ({
          ...prev,
          memoryUsed
        }));

        // Trigger emergency cache clear if memory usage is critical
        if (memoryUsed > 100 && capabilities?.isOldDevice) {
          console.warn('[Crisis Preloader] High memory usage detected, clearing cache');
          crisisResourceCache.emergencyCacheClear();
        }
      }
    };

    const interval = setInterval(monitorMemory, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [capabilities]);

  // Smart preloading based on device capabilities
  useEffect(() => {
    if (!capabilities || preloadingRef.current) return;

    const shouldPreload = () => {
      // Don't preload if battery is critically low
      if (capabilities.batteryLevel < 0.15 && !capabilities.isCharging) {
        console.log('[Crisis Preloader] Skipping preload: Low battery');
        return false;
      }

      // Don't preload on very slow connections
      if (['slow-2g', '2g'].includes(capabilities.connectionType)) {
        console.log('[Crisis Preloader] Skipping preload: Slow connection');
        return false;
      }

      // Don't preload if memory is severely limited
      if (capabilities.deviceMemory <= 1) {
        console.log('[Crisis Preloader] Skipping preload: Limited memory');
        return false;
      }

      return true;
    };

    if (shouldPreload()) {
      startCrisisPreloading();
    }
  }, [capabilities]);

  // Crisis resource preloading with intelligent prioritization
  const startCrisisPreloading = async () => {
    if (preloadingRef.current) return;
    
    preloadingRef.current = true;
    setIsPreloading(true);
    
    console.log('[Crisis Preloader] Starting trauma-informed resource preloading');

    try {
      // Cache crisis resources from JSON first
      await crisisResourceCache.cacheCrisisResourcesFromJSON();

      // Preload critical audio/visual crisis intervention resources
      const crisisResources = [
        {
          id: 'breathing-audio',
          type: 'audio' as const,
          content: await fetchResourceAsBlob('/audio/breathing-guide.mp3'),
          priority: 'critical' as const
        },
        {
          id: 'grounding-audio', 
          type: 'audio' as const,
          content: await fetchResourceAsBlob('/audio/grounding-voice.mp3'),
          priority: 'high' as const
        }
      ];

      // Adaptive preloading based on device capabilities
      const maxConcurrentRequests = capabilities?.isOldDevice ? 2 : 4;
      const chunks = chunkArray(crisisResources, maxConcurrentRequests);

      let totalLoaded = 0;
      let totalLoadTime = 0;

      for (const chunk of chunks) {
        const chunkPromises = chunk.map(async (resource) => {
          const startTime = performance.now();
          
          try {
            await crisisResourceCache.cacheResource(resource);
            const loadTime = performance.now() - startTime;
            totalLoadTime += loadTime;
            totalLoaded++;
            
            setMetrics(prev => ({
              ...prev,
              completedResources: totalLoaded,
              averageLoadTime: totalLoadTime / totalLoaded
            }));

            return { success: true, loadTime };
          } catch (error) {
            console.warn(`[Crisis Preloader] Failed to cache ${resource.id}:`, error);
            setMetrics(prev => ({
              ...prev,
              failedResources: prev.failedResources + 1
            }));
            return { success: false, loadTime: 0 };
          }
        });

        await Promise.allSettled(chunkPromises);

        // Pause between chunks for battery conservation
        if (capabilities?.batteryLevel && capabilities.batteryLevel < 0.5) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Preload mobile-specific trauma interface assets
      if (capabilities?.isMobile) {
        await preloadMobileTraumaAssets();
      }

      // Register service worker message handlers for crisis events
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
      }

      console.log('[Crisis Preloader] Crisis resource preloading completed');
      
    } catch (error) {
      console.error('[Crisis Preloader] Preloading failed:', error);
    } finally {
      setIsPreloading(false);
      preloadingRef.current = false;
    }
  };

  // Preload mobile-specific trauma interface assets
  const preloadMobileTraumaAssets = async () => {
    const mobileAssets = [
      {
        id: 'crisis-modal-bg',
        type: 'text' as const,
        content: JSON.stringify({
          backgroundGradient: 'linear-gradient(135deg, #a4b792, #93a682)',
          safeSpaceColors: ['#f0f9ff', '#ecfccb', '#fef3f2'],
          traumaInformedSpacing: { touch: '52px', crisis: '64px' }
        }),
        priority: 'high' as const
      },
      {
        id: 'mobile-breathing-animation',
        type: 'text' as const,
        content: JSON.stringify({
          breathingCircle: {
            inhale: { duration: 4000, scale: 1.3 },
            hold: { duration: 4000, scale: 1.3 },
            exhale: { duration: 4000, scale: 0.8 },
            holdEmpty: { duration: 4000, scale: 0.8 }
          },
          reduceMotion: 'prefers-reduced-motion: reduce'
        }),
        priority: 'medium' as const
      }
    ];

    for (const asset of mobileAssets) {
      try {
        await crisisResourceCache.cacheResource(asset);
      } catch (error) {
        console.warn(`[Crisis Preloader] Failed to cache mobile asset ${asset.id}:`, error);
      }
    }
  };

  // Handle service worker messages for crisis events
  const handleServiceWorkerMessage = (event: MessageEvent) => {
    const { type, data } = event.data || {};

    switch (type) {
      case 'CRISIS_SW_ACTIVATED':
        console.log('[Crisis Preloader] Crisis service worker activated');
        break;

      case 'BATTERY_LOW_WARNING':
        if (capabilities && capabilities.batteryLevel > 0.2) {
          // False alarm, continue normal operation
          return;
        }
        // Activate battery conservation mode
        navigator.serviceWorker.ready.then(registration => {
          registration.active?.postMessage({ type: 'BATTERY_LOW' });
        });
        break;

      case 'EMERGENCY_MODE_REQUEST':
        // User activated emergency mode
        navigator.serviceWorker.ready.then(registration => {
          registration.active?.postMessage({ type: 'EMERGENCY_MODE_ACTIVATE' });
        });
        break;
    }
  };

  // Utility functions
  const fetchResourceAsBlob = async (url: string): Promise<Blob> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.warn(`[Crisis Preloader] Failed to fetch ${url}, using fallback`);
      // Return minimal fallback blob
      return new Blob([''], { type: 'audio/mpeg' });
    }
  };

  const chunkArray = <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  // Debug metrics display (only in development)
  if (process.env.NODE_ENV === 'development' && capabilities) {
    return (
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        maxWidth: '300px',
        borderRadius: '0 8px 0 0'
      }}>
        <div>🚨 Crisis Preloader Status</div>
        <div>Device: {capabilities.isMobile ? 'Mobile' : 'Desktop'} {capabilities.isOldDevice ? '(Old)' : ''}</div>
        <div>Memory: {capabilities.deviceMemory}GB | CPU: {capabilities.hardwareConcurrency}</div>
        <div>Connection: {capabilities.connectionType}</div>
        <div>Battery: {Math.round(capabilities.batteryLevel * 100)}% {capabilities.isCharging ? '⚡' : '🔋'}</div>
        <div>Preloading: {isPreloading ? '⏳' : '✅'}</div>
        <div>Resources: {metrics.completedResources}/{metrics.totalResources}</div>
        <div>Avg Load: {Math.round(metrics.averageLoadTime)}ms</div>
        <div>Memory: {Math.round(metrics.memoryUsed)}MB</div>
      </div>
    );
  }

  // Production: invisible component that just handles preloading
  return null;
}