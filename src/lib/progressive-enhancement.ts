// ALCHM Progressive Enhancement System
// Ensures sanctuary experience works on all devices, from premium to crisis-limited

export interface DeviceCapabilities {
  isLowEndDevice: boolean;
  hasSlowConnection: boolean;
  hasLimitedMemory: boolean;
  hasReducedMotion: boolean;
  hasHighContrast: boolean;
  isCrisisMode: boolean;
  supportLevel: 'basic' | 'enhanced' | 'premium';
}

// Detect device capabilities for progressive enhancement
export function detectDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      isLowEndDevice: false,
      hasSlowConnection: false,
      hasLimitedMemory: false,
      hasReducedMotion: false,
      hasHighContrast: false,
      isCrisisMode: false,
      supportLevel: 'enhanced'
    };
  }

  // Hardware detection
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const deviceMemory = (navigator as any).deviceMemory || 4;
  const isLowEndDevice = hardwareConcurrency <= 2 || deviceMemory <= 2;

  // Network detection
  const connection = (navigator as any).connection;
  const hasSlowConnection = connection && 
    (connection.effectiveType === 'slow-2g' || 
     connection.effectiveType === '2g' ||
     connection.downlink < 1.5);

  // Memory constraints
  const hasLimitedMemory = deviceMemory <= 2;

  // Accessibility preferences
  const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

  // Crisis mode detection
  const isCrisisMode = localStorage.getItem('alchm-crisis-level') !== 'normal';

  // Determine support level
  let supportLevel: 'basic' | 'enhanced' | 'premium' = 'enhanced';
  
  if (isLowEndDevice || hasSlowConnection || hasLimitedMemory || isCrisisMode) {
    supportLevel = 'basic';
  } else if (hardwareConcurrency >= 8 && deviceMemory >= 8 && !hasSlowConnection) {
    supportLevel = 'premium';
  }

  return {
    isLowEndDevice,
    hasSlowConnection,
    hasLimitedMemory,
    hasReducedMotion,
    hasHighContrast,
    isCrisisMode,
    supportLevel
  };
}

// Apply progressive enhancement based on device capabilities
export function applyProgressiveEnhancement(capabilities: DeviceCapabilities) {
  const docElement = document.documentElement;
  
  // Remove previous enhancement classes
  docElement.classList.remove('pe-basic', 'pe-enhanced', 'pe-premium');
  
  // Apply support level class
  docElement.classList.add(`pe-${capabilities.supportLevel}`);
  
  // Apply capability-specific classes
  if (capabilities.isLowEndDevice) {
    docElement.classList.add('pe-low-end');
  }
  
  if (capabilities.hasSlowConnection) {
    docElement.classList.add('pe-slow-connection');
  }
  
  if (capabilities.hasLimitedMemory) {
    docElement.classList.add('pe-limited-memory');
  }
  
  if (capabilities.hasReducedMotion) {
    docElement.classList.add('pe-reduced-motion');
  }
  
  if (capabilities.hasHighContrast) {
    docElement.classList.add('pe-high-contrast');
  }
  
  if (capabilities.isCrisisMode) {
    docElement.classList.add('pe-crisis-mode');
  }
  
  // Set CSS custom properties for dynamic optimization
  docElement.style.setProperty('--animation-duration', 
    capabilities.hasReducedMotion ? '0.01ms' : 
    capabilities.isLowEndDevice ? '600ms' : '300ms'
  );
  
  docElement.style.setProperty('--blur-intensity', 
    capabilities.isLowEndDevice ? '5px' : '20px'
  );
  
  docElement.style.setProperty('--shadow-intensity', 
    capabilities.isLowEndDevice ? '0.05' : '0.15'
  );

  // Apply memory optimizations
  if (capabilities.hasLimitedMemory) {
    // Disable expensive effects
    docElement.style.setProperty('--backdrop-filter', 'none');
    docElement.style.setProperty('--box-shadow', 'none');
  }
}

// Optimize animations based on capabilities
export function getOptimizedAnimationConfig(capabilities: DeviceCapabilities) {
  if (capabilities.hasReducedMotion) {
    return {
      duration: '0.01ms',
      easing: 'linear',
      iterations: 1,
      enabled: false
    };
  }
  
  if (capabilities.isLowEndDevice) {
    return {
      duration: '600ms',
      easing: 'ease-out',
      iterations: 1,
      enabled: true,
      useTransform3d: false // Avoid 3D transforms on low-end devices
    };
  }
  
  if (capabilities.supportLevel === 'premium') {
    return {
      duration: '300ms',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      iterations: 'infinite',
      enabled: true,
      useTransform3d: true,
      useWillChange: true
    };
  }
  
  // Enhanced default
  return {
    duration: '400ms',
    easing: 'ease-out',
    iterations: 1,
    enabled: true,
    useTransform3d: true
  };
}

// Load appropriate CSS based on capabilities
export function loadAdaptiveStyles(capabilities: DeviceCapabilities) {
  const head = document.head;
  
  // Remove existing adaptive stylesheets
  const existingSheets = head.querySelectorAll('[data-adaptive-style]');
  existingSheets.forEach(sheet => sheet.remove());
  
  // Load appropriate stylesheet
  const stylesheetMap = {
    basic: '/styles/basic-sanctuary.css',
    enhanced: '/styles/alchm-jony-ive-foundation.css',
    premium: '/styles/premium-sanctuary-effects.css'
  };
  
  const stylesheetUrl = stylesheetMap[capabilities.supportLevel];
  
  if (stylesheetUrl) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheetUrl;
    link.setAttribute('data-adaptive-style', capabilities.supportLevel);
    
    // Load asynchronously for better performance
    if (capabilities.hasSlowConnection) {
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
    }
    
    head.appendChild(link);
  }
}

// Optimize bundle loading based on capabilities
export function getOptimizedBundleStrategy(capabilities: DeviceCapabilities) {
  if (capabilities.supportLevel === 'basic') {
    return {
      loadAnimations: false,
      loadHighResImages: false,
      loadInteractiveFeatures: true,
      loadVideoContent: false,
      chunkSize: 'small',
      prefetchStrategy: 'none'
    };
  }
  
  if (capabilities.supportLevel === 'premium') {
    return {
      loadAnimations: true,
      loadHighResImages: true,
      loadInteractiveFeatures: true,
      loadVideoContent: true,
      chunkSize: 'large',
      prefetchStrategy: 'aggressive'
    };
  }
  
  // Enhanced default
  return {
    loadAnimations: true,
    loadHighResImages: false,
    loadInteractiveFeatures: true,
    loadVideoContent: false,
    chunkSize: 'medium',
    prefetchStrategy: 'conservative'
  };
}

// Initialize progressive enhancement system
export function initializeProgressiveEnhancement() {
  if (typeof window === 'undefined') return;
  
  // Detect capabilities
  const capabilities = detectDeviceCapabilities();
  
  // Apply enhancements
  applyProgressiveEnhancement(capabilities);
  
  // Load adaptive styles
  loadAdaptiveStyles(capabilities);
  
  // Store capabilities for other modules
  (window as any).__alchm_capabilities = capabilities;
  
  // Listen for network changes
  if ((navigator as any).connection) {
    (navigator as any).connection.addEventListener('change', () => {
      const updatedCapabilities = detectDeviceCapabilities();
      applyProgressiveEnhancement(updatedCapabilities);
      (window as any).__alchm_capabilities = updatedCapabilities;
    });
  }
  
  // Listen for memory pressure (experimental)
  if ('memory' in performance) {
    const checkMemoryPressure = () => {
      const memInfo = (performance as any).memory;
      const memoryPressure = memInfo.usedJSHeapSize / memInfo.totalJSHeapSize;
      
      if (memoryPressure > 0.8) {
        document.documentElement.classList.add('pe-memory-pressure');
        // Disable expensive features
        document.documentElement.style.setProperty('--backdrop-filter', 'none');
      }
    };
    
    setInterval(checkMemoryPressure, 30000); // Check every 30 seconds
  }
  
  return capabilities;
}

// Hook for React components to access capabilities
export function useDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      isLowEndDevice: false,
      hasSlowConnection: false,
      hasLimitedMemory: false,
      hasReducedMotion: false,
      hasHighContrast: false,
      isCrisisMode: false,
      supportLevel: 'enhanced'
    };
  }
  
  return (window as any).__alchm_capabilities || detectDeviceCapabilities();
}

// Crisis mode optimization
export function enableCrisisOptimizations() {
  const docElement = document.documentElement;
  
  // Apply crisis-specific optimizations
  docElement.classList.add('pe-crisis-mode');
  
  // Disable all non-essential animations
  docElement.style.setProperty('--animation-duration', '0.01ms');
  
  // Simplify visual effects
  docElement.style.setProperty('--backdrop-filter', 'none');
  docElement.style.setProperty('--box-shadow', '0 2px 4px rgba(0,0,0,0.1)');
  
  // Increase touch targets
  docElement.style.setProperty('--touch-target-size', '64px');
  
  // Store crisis mode state
  localStorage.setItem('alchm-crisis-level', 'crisis');
  
  // Reload with crisis optimizations
  location.reload();
}

export default {
  detectDeviceCapabilities,
  applyProgressiveEnhancement,
  initializeProgressiveEnhancement,
  useDeviceCapabilities,
  enableCrisisOptimizations
};