'use client';

import { useEffect, useRef } from 'react';

/**
 * Crisis Resource Preloader for ALCHM
 * 
 * CRITICAL: Preloads life-saving resources before they're needed
 * - Crisis hotline contacts
 * - Emergency resources
 * - Critical page assets
 * - Offline fallback data
 * 
 * Priority: Sub-second access to crisis support
 */

interface CrisisResource {
  url: string;
  type: 'script' | 'style' | 'font' | 'image' | 'fetch' | 'document';
  priority: 'critical' | 'high' | 'medium';
  cacheStrategy: 'force-cache' | 'no-cache' | 'default';
}

// CRITICAL: Resources that must be immediately available
const CRISIS_CRITICAL_RESOURCES: CrisisResource[] = [
  // Emergency contact data
  {
    url: '/api/crisis-resources',
    type: 'fetch',
    priority: 'critical',
    cacheStrategy: 'force-cache'
  },
  
  // Crisis support pages
  {
    url: '/crisis',
    type: 'document',
    priority: 'critical',
    cacheStrategy: 'force-cache'
  },
  
  {
    url: '/emergency',
    type: 'document', 
    priority: 'critical',
    cacheStrategy: 'force-cache'
  },
  
  // Essential fonts for readability in crisis
  {
    url: '/fonts/system-ui.woff2',
    type: 'font',
    priority: 'critical',
    cacheStrategy: 'force-cache'
  }
];

// HIGH PRIORITY: Resources likely to be needed soon
const HIGH_PRIORITY_RESOURCES: CrisisResource[] = [
  // Main app pages
  {
    url: '/journal',
    type: 'document',
    priority: 'high',
    cacheStrategy: 'default'
  },
  
  {
    url: '/dashboard',
    type: 'document',
    priority: 'high', 
    cacheStrategy: 'default'
  },
  
  // Auth pages for quick access
  {
    url: '/auth/login',
    type: 'document',
    priority: 'high',
    cacheStrategy: 'default'
  }
];

export default function CrisisResourcePreloader() {
  const preloadedResources = useRef(new Set<string>());
  const preloadStartTime = useRef(performance.now());

  const preloadResource = async (resource: CrisisResource): Promise<boolean> => {
    // Skip if already preloaded
    if (preloadedResources.current.has(resource.url)) {
      return true;
    }

    const startTime = performance.now();

    try {
      switch (resource.type) {
        case 'fetch':
          await preloadFetchResource(resource);
          break;
        case 'document':
          await preloadDocumentResource(resource);
          break;
        case 'font':
          await preloadFontResource(resource);
          break;
        case 'style':
          await preloadStyleResource(resource);
          break;
        case 'script':
          await preloadScriptResource(resource);
          break;
        case 'image':
          await preloadImageResource(resource);
          break;
        default:
          console.warn('[Crisis Preloader] Unknown resource type:', resource.type);
          return false;
      }

      const loadTime = performance.now() - startTime;
      
      // Log performance for crisis resources
      if (resource.priority === 'critical' && loadTime > 500) {
        console.warn('[Crisis Preloader] SLOW CRITICAL RESOURCE:', resource.url, `${Math.round(loadTime)}ms`);
      }

      preloadedResources.current.add(resource.url);
      return true;

    } catch (error) {
      console.error('[Crisis Preloader] Failed to preload:', resource.url, error);
      return false;
    }
  };

  const preloadFetchResource = async (resource: CrisisResource) => {
    const response = await fetch(resource.url, {
      cache: resource.cacheStrategy,
      method: 'GET',
      priority: resource.priority as RequestInit['priority']
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Pre-parse JSON for immediate use
    if (response.headers.get('content-type')?.includes('application/json')) {
      await response.json();
    }
  };

  const preloadDocumentResource = async (resource: CrisisResource) => {
    // Use link prefetch for documents
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource.url;
    link.as = 'document';
    
    if (resource.priority === 'critical') {
      link.rel = 'preload';
    }
    
    document.head.appendChild(link);
    
    // Wait for preload to complete
    return new Promise<void>((resolve, reject) => {
      link.onload = () => resolve();
      link.onerror = () => reject(new Error('Failed to preload document'));
      
      // Timeout for critical resources
      if (resource.priority === 'critical') {
        setTimeout(() => reject(new Error('Preload timeout')), 2000);
      }
    });
  };

  const preloadFontResource = async (resource: CrisisResource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
    
    return new Promise<void>((resolve, reject) => {
      link.onload = () => resolve();
      link.onerror = () => reject(new Error('Failed to preload font'));
      setTimeout(() => reject(new Error('Font preload timeout')), 3000);
    });
  };

  const preloadStyleResource = async (resource: CrisisResource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;
    link.as = 'style';
    
    document.head.appendChild(link);
    
    return new Promise<void>((resolve, reject) => {
      link.onload = () => resolve();
      link.onerror = () => reject(new Error('Failed to preload style'));
      setTimeout(() => reject(new Error('Style preload timeout')), 2000);
    });
  };

  const preloadScriptResource = async (resource: CrisisResource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;
    link.as = 'script';
    
    document.head.appendChild(link);
    
    return new Promise<void>((resolve, reject) => {
      link.onload = () => resolve();
      link.onerror = () => reject(new Error('Failed to preload script'));
      setTimeout(() => reject(new Error('Script preload timeout')), 2000);
    });
  };

  const preloadImageResource = async (resource: CrisisResource) => {
    const img = new Image();
    
    return new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to preload image'));
      img.src = resource.url;
    });
  };

  const preloadCriticalResources = async () => {
    console.log('[Crisis Preloader] Preloading critical resources...');
    
    const promises = CRISIS_CRITICAL_RESOURCES.map(resource => preloadResource(resource));
    const results = await Promise.allSettled(promises);
    
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    if (failed > 0) {
      console.warn(`[Crisis Preloader] ${failed} critical resources failed to preload`);
    }
    
    console.log(`[Crisis Preloader] ${succeeded}/${CRISIS_CRITICAL_RESOURCES.length} critical resources preloaded`);
  };

  const preloadHighPriorityResources = async () => {
    // Wait for critical resources first
    await preloadCriticalResources();
    
    console.log('[Crisis Preloader] Preloading high-priority resources...');
    
    // Use requestIdleCallback for non-critical preloading
    if ('requestIdleCallback' in window) {
      const preloadBatch = async () => {
        for (const resource of HIGH_PRIORITY_RESOURCES) {
          await preloadResource(resource);
          
          // Yield control back to browser between preloads
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      };
      
      requestIdleCallback(preloadBatch, { timeout: 5000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        HIGH_PRIORITY_RESOURCES.forEach(resource => {
          preloadResource(resource);
        });
      }, 1000);
    }
  };

  const preloadCrisisHotlines = () => {
    // Cache critical phone numbers and resources
    const crisisData = {
      hotlines: [
        { name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' },
        { name: 'Crisis Text Line', number: '741741', text: 'HOME', available: '24/7' },
        { name: 'National Domestic Violence Hotline', number: '1-800-799-7233', available: '24/7' },
        { name: 'LGBTQ National Hotline', number: '1-888-843-4564', available: '24/7' }
      ],
      resources: [
        'https://suicidepreventionlifeline.org/',
        'https://www.crisistextline.org/',
        'https://www.thehotline.org/'
      ]
    };

    // Store in multiple places for maximum availability
    try {
      localStorage.setItem('alchm-crisis-resources', JSON.stringify(crisisData));
      sessionStorage.setItem('alchm-crisis-resources', JSON.stringify(crisisData));
      
      // Also cache in IndexedDB for offline access
      if ('indexedDB' in window) {
        const request = indexedDB.open('alchm-crisis', 1);
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['resources'], 'readwrite');
          const store = transaction.objectStore('resources');
          store.put(crisisData, 'hotlines');
        };
      }
      
      console.log('[Crisis Preloader] Crisis resources cached for offline access');
    } catch (error) {
      console.error('[Crisis Preloader] Failed to cache crisis resources:', error);
    }
  };

  useEffect(() => {
    // Start preloading immediately
    const initializePreloader = async () => {
      const startTime = performance.now();
      
      // Cache crisis hotlines first (most critical)
      preloadCrisisHotlines();
      
      // Preload all resources
      await preloadHighPriorityResources();
      
      const totalTime = performance.now() - preloadStartTime.current;
      console.log(`[Crisis Preloader] All resources preloaded in ${Math.round(totalTime)}ms`);
      
      // Register service worker for offline support
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/crisis-performance-sw.js');
          console.log('[Crisis Preloader] Service worker registered for offline crisis support');
        } catch (error) {
          console.error('[Crisis Preloader] Service worker registration failed:', error);
        }
      }
    };

    initializePreloader();
  }, []);

  // No visual component - preloader runs in background
  return null;
}