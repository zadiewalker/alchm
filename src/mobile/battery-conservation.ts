'use client';

/**
 * Battery Conservation System for ALCHM
 * Optimizes app performance during crisis situations when battery life is critical
 */

import React from 'react';

interface BatteryStatus {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

interface ConservationSettings {
  enableLowPowerMode: boolean;
  reduceAnimations: boolean;
  dimBackground: boolean;
  limitNetworkActivity: boolean;
  disableNonEssentialFeatures: boolean;
  emergencyModeThreshold: number; // Battery level to auto-activate emergency mode
}

interface PerformanceOptimizations {
  reducedFrameRate: boolean;
  disabledAnimations: boolean;
  compressedImages: boolean;
  minimalUI: boolean;
  backgroundSyncDisabled: boolean;
}

class BatteryConservationManager {
  private batteryStatus: BatteryStatus | null = null;
  private battery: any = null;
  private settings: ConservationSettings;
  private optimizations: PerformanceOptimizations;
  private conservationActive = false;
  private criticalModeActive = false;
  private emergencyCallbacks: Array<() => void> = [];
  private lowBatteryCallbacks: Array<(level: number) => void> = [];

  constructor() {
    this.settings = {
      enableLowPowerMode: true,
      reduceAnimations: true,
      dimBackground: true,
      limitNetworkActivity: true,
      disableNonEssentialFeatures: true,
      emergencyModeThreshold: 0.15 // 15% battery
    };

    this.optimizations = {
      reducedFrameRate: false,
      disabledAnimations: false,
      compressedImages: false,
      minimalUI: false,
      backgroundSyncDisabled: false
    };

    this.initialize();
  }

  private async initialize() {
    try {
      // Try to access Battery API
      this.battery = await (navigator as any).getBattery?.();
      
      if (this.battery) {
        this.updateBatteryStatus();
        this.setupBatteryListeners();
        this.checkConservationNeeded();
      } else {
        // Fallback: Assume moderate battery level if API unavailable
        this.batteryStatus = {
          level: 0.5,
          charging: false,
          chargingTime: Infinity,
          dischargingTime: 7200 // Assume 2 hours remaining
        };
        
        // Enable conservative optimizations by default
        this.activateConservationMode();
      }
    } catch (error) {
      console.warn('Battery API not available, enabling conservative mode:', error);
      this.activateConservationMode();
    }

    // Listen for visibility changes to optimize when app is in background
    this.setupVisibilityOptimizations();
    
    // Monitor device memory and CPU constraints
    this.setupPerformanceMonitoring();
  }

  private updateBatteryStatus() {
    if (!this.battery) return;

    this.batteryStatus = {
      level: this.battery.level,
      charging: this.battery.charging,
      chargingTime: this.battery.chargingTime,
      dischargingTime: this.battery.dischargingTime
    };
  }

  private setupBatteryListeners() {
    if (!this.battery) return;

    const handleBatteryChange = () => {
      this.updateBatteryStatus();
      this.checkConservationNeeded();
    };

    this.battery.addEventListener('levelchange', handleBatteryChange);
    this.battery.addEventListener('chargingchange', handleBatteryChange);
    this.battery.addEventListener('chargingtimechange', handleBatteryChange);
    this.battery.addEventListener('dischargingtimechange', handleBatteryChange);
  }

  private checkConservationNeeded() {
    if (!this.batteryStatus) return;

    const { level, charging } = this.batteryStatus;
    
    // Critical battery level - activate emergency mode
    if (level <= 0.10 && !charging) {
      this.activateCriticalMode();
    }
    // Low battery - activate conservation mode
    else if (level <= 0.20 && !charging) {
      this.activateConservationMode();
    }
    // Emergency threshold - notify for emergency mode
    else if (level <= this.settings.emergencyModeThreshold && !charging) {
      this.notifyEmergencyThreshold();
    }
    // Normal level - deactivate conservation if charging
    else if ((level > 0.30 || charging) && this.conservationActive) {
      this.deactivateConservationMode();
    }

    // Notify callbacks about battery level changes
    this.lowBatteryCallbacks.forEach(callback => {
      try {
        callback(level);
      } catch (error) {
        console.error('Error in low battery callback:', error);
      }
    });
  }

  private activateConservationMode() {
    if (this.conservationActive) return;

    console.log('Activating battery conservation mode');
    this.conservationActive = true;

    // Reduce animations and transitions
    if (this.settings.reduceAnimations) {
      this.optimizations.disabledAnimations = true;
      this.injectConservationCSS();
    }

    // Dim background and reduce visual effects
    if (this.settings.dimBackground) {
      this.optimizations.minimalUI = true;
      this.applyVisualOptimizations();
    }

    // Limit network activity
    if (this.settings.limitNetworkActivity) {
      this.optimizations.backgroundSyncDisabled = true;
      this.limitNetworkOperations();
    }

    // Reduce frame rate for animations
    this.optimizations.reducedFrameRate = true;
    this.reduceFrameRate();

    // Notify components about conservation mode
    this.notifyConservationModeChange(true);
  }

  private activateCriticalMode() {
    console.warn('Activating critical battery mode');
    this.criticalModeActive = true;
    
    // All conservation measures plus emergency optimizations
    this.activateConservationMode();
    
    // Disable all non-essential features
    this.optimizations.compressedImages = true;
    this.disableNonEssentialFeatures();
    
    // Show critical battery warning
    this.showCriticalBatteryWarning();
    
    // Auto-save any unsaved content
    this.triggerEmergencyAutoSave();
  }

  private deactivateConservationMode() {
    if (!this.conservationActive) return;

    console.log('Deactivating battery conservation mode');
    this.conservationActive = false;
    this.criticalModeActive = false;

    // Reset optimizations
    this.optimizations = {
      reducedFrameRate: false,
      disabledAnimations: false,
      compressedImages: false,
      minimalUI: false,
      backgroundSyncDisabled: false
    };

    // Remove conservation CSS
    this.removeConservationCSS();
    
    // Re-enable normal performance
    this.restoreNormalPerformance();
    
    // Notify components about conservation mode change
    this.notifyConservationModeChange(false);
  }

  private setupVisibilityOptimizations() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // App is in background - maximize battery savings
        this.enableBackgroundOptimizations();
      } else {
        // App is visible - restore necessary functionality
        this.restoreFromBackground();
      }
    });
  }

  private setupPerformanceMonitoring() {
    // Monitor device memory
    const checkMemoryPressure = () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const memoryUsage = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
        
        if (memoryUsage > 0.8) {
          console.warn('High memory usage detected, enabling aggressive optimizations');
          this.activateConservationMode();
        }
      }
    };

    // Check memory every 30 seconds
    setInterval(checkMemoryPressure, 30000);

    // Monitor CPU usage through frame timing
    this.monitorCPUUsage();
  }

  private monitorCPUUsage() {
    let lastTime = performance.now();
    let frameCount = 0;
    let slowFrames = 0;

    const measureFrame = () => {
      const currentTime = performance.now();
      const frameDuration = currentTime - lastTime;
      
      frameCount++;
      
      // Consider frames slower than 32ms (< 30fps) as slow
      if (frameDuration > 32) {
        slowFrames++;
      }

      // Check every 100 frames
      if (frameCount >= 100) {
        const slowFramePercentage = (slowFrames / frameCount) * 100;
        
        if (slowFramePercentage > 20) {
          console.warn('High CPU usage detected, enabling performance optimizations');
          this.activateConservationMode();
        }
        
        frameCount = 0;
        slowFrames = 0;
      }

      lastTime = currentTime;
      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  }

  private injectConservationCSS() {
    const conservationCSS = `
      .battery-conservation * {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        animation-delay: 0s !important;
        transition-delay: 0s !important;
      }

      .battery-conservation .minimal-ui {
        background: #000 !important;
        color: #fff !important;
        opacity: 0.9 !important;
      }

      .battery-conservation img {
        filter: grayscale(50%) brightness(0.8);
      }

      .battery-conservation video {
        display: none !important;
      }

      .battery-conservation .non-essential {
        display: none !important;
      }

      /* Reduce visual complexity */
      .battery-conservation * {
        box-shadow: none !important;
        text-shadow: none !important;
        backdrop-filter: none !important;
        filter: none !important;
      }

      /* Optimize fonts */
      .battery-conservation {
        font-synthesis: none;
        text-rendering: optimizeSpeed;
      }
    `;

    const style = document.createElement('style');
    style.id = 'battery-conservation-styles';
    style.textContent = conservationCSS;
    document.head.appendChild(style);

    // Apply conservation class to body
    document.body.classList.add('battery-conservation');
  }

  private removeConservationCSS() {
    const existingStyle = document.getElementById('battery-conservation-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    document.body.classList.remove('battery-conservation');
  }

  private applyVisualOptimizations() {
    document.body.classList.add('minimal-ui');
  }

  private limitNetworkOperations() {
    // Disable background sync
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'LIMIT_NETWORK_ACTIVITY'
      });
    }

    // Cancel non-essential requests
    this.optimizations.backgroundSyncDisabled = true;
  }

  private reduceFrameRate() {
    // Override requestAnimationFrame to limit to 15fps during conservation
    const originalRAF = window.requestAnimationFrame;
    let lastExecution = 0;

    window.requestAnimationFrame = (callback) => {
      return originalRAF((time) => {
        if (this.conservationActive && time - lastExecution < 67) { // 15fps = 67ms per frame
          return originalRAF(callback);
        }
        lastExecution = time;
        return callback(time);
      });
    };
  }

  private enableBackgroundOptimizations() {
    // Pause all timers and intervals that aren't critical
    document.body.classList.add('app-backgrounded');
    
    // Reduce update frequency
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'BACKGROUND_MODE',
        enabled: true
      });
    }
  }

  private restoreFromBackground() {
    document.body.classList.remove('app-backgrounded');
    
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'BACKGROUND_MODE',
        enabled: false
      });
    }
  }

  private disableNonEssentialFeatures() {
    document.body.classList.add('critical-battery');
    
    // Disable analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('config', 'disable');
    }
    
    // Disable auto-save except for critical content
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'EMERGENCY_MODE',
        enabled: true
      });
    }
  }

  private restoreNormalPerformance() {
    document.body.classList.remove('minimal-ui', 'critical-battery', 'app-backgrounded');
    
    // Restore normal frame rate
    // (would need to restore original RAF if we stored it)
    
    // Re-enable features
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'EMERGENCY_MODE',
        enabled: false
      });
    }
  }

  private showCriticalBatteryWarning() {
    const warning = document.createElement('div');
    warning.id = 'critical-battery-warning';
    warning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff4444;
      color: white;
      padding: 12px;
      text-align: center;
      font-weight: bold;
      z-index: 10000;
      font-size: 14px;
    `;
    warning.textContent = `Critical Battery (${Math.round((this.batteryStatus?.level || 0) * 100)}%) - Emergency optimizations active`;
    
    // Remove after 5 seconds
    document.body.appendChild(warning);
    setTimeout(() => {
      warning.remove();
    }, 5000);
  }

  private triggerEmergencyAutoSave() {
    // Dispatch custom event for emergency auto-save
    const event = new CustomEvent('emergencyAutoSave', {
      detail: { reason: 'critical_battery' }
    });
    document.dispatchEvent(event);
  }

  private notifyConservationModeChange(active: boolean) {
    const event = new CustomEvent('batteryConservationChange', {
      detail: { 
        active,
        criticalMode: this.criticalModeActive,
        optimizations: { ...this.optimizations },
        batteryLevel: this.batteryStatus?.level || 0
      }
    });
    document.dispatchEvent(event);
  }

  private notifyEmergencyThreshold() {
    this.emergencyCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in emergency callback:', error);
      }
    });
  }

  // Public API
  public getBatteryStatus(): BatteryStatus | null {
    return this.batteryStatus;
  }

  public isConservationActive(): boolean {
    return this.conservationActive;
  }

  public isCriticalModeActive(): boolean {
    return this.criticalModeActive;
  }

  public getOptimizations(): PerformanceOptimizations {
    return { ...this.optimizations };
  }

  public updateSettings(newSettings: Partial<ConservationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.checkConservationNeeded();
  }

  public onEmergencyThreshold(callback: () => void) {
    this.emergencyCallbacks.push(callback);
    
    return () => {
      const index = this.emergencyCallbacks.indexOf(callback);
      if (index > -1) {
        this.emergencyCallbacks.splice(index, 1);
      }
    };
  }

  public onLowBattery(callback: (level: number) => void) {
    this.lowBatteryCallbacks.push(callback);
    
    return () => {
      const index = this.lowBatteryCallbacks.indexOf(callback);
      if (index > -1) {
        this.lowBatteryCallbacks.splice(index, 1);
      }
    };
  }

  public forceConservationMode() {
    this.activateConservationMode();
  }

  public forceCriticalMode() {
    this.activateCriticalMode();
  }

  public disable() {
    this.deactivateConservationMode();
  }
}

// Create singleton instance
const batteryConservationManager = new BatteryConservationManager();

// Export utilities
export const getBatteryStatus = () => batteryConservationManager.getBatteryStatus();
export const isConservationActive = () => batteryConservationManager.isConservationActive();
export const isCriticalModeActive = () => batteryConservationManager.isCriticalModeActive();
export const getOptimizations = () => batteryConservationManager.getOptimizations();
export const onEmergencyThreshold = (callback: () => void) => batteryConservationManager.onEmergencyThreshold(callback);
export const onLowBattery = (callback: (level: number) => void) => batteryConservationManager.onLowBattery(callback);
export const updateBatterySettings = (settings: Partial<ConservationSettings>) => batteryConservationManager.updateSettings(settings);
export const forceConservationMode = () => batteryConservationManager.forceConservationMode();
export const forceCriticalMode = () => batteryConservationManager.forceCriticalMode();

export default batteryConservationManager;

// React hook for easy integration
export function useBatteryConservation() {
  const [batteryStatus, setBatteryStatus] = React.useState<BatteryStatus | null>(null);
  const [conservationActive, setConservationActive] = React.useState(false);
  const [criticalMode, setCriticalMode] = React.useState(false);
  const [optimizations, setOptimizations] = React.useState<PerformanceOptimizations>({
    reducedFrameRate: false,
    disabledAnimations: false,
    compressedImages: false,
    minimalUI: false,
    backgroundSyncDisabled: false
  });

  React.useEffect(() => {
    const updateStatus = () => {
      setBatteryStatus(getBatteryStatus());
      setConservationActive(isConservationActive());
      setCriticalMode(isCriticalModeActive());
      setOptimizations(getOptimizations());
    };

    // Initial update
    updateStatus();

    // Listen for conservation mode changes
    const handleConservationChange = () => updateStatus();
    document.addEventListener('batteryConservationChange', handleConservationChange);

    // Update periodically
    const interval = setInterval(updateStatus, 5000);

    return () => {
      document.removeEventListener('batteryConservationChange', handleConservationChange);
      clearInterval(interval);
    };
  }, []);

  return {
    batteryStatus,
    conservationActive,
    criticalMode,
    optimizations,
    forceConservation: forceConservationMode,
    forceCritical: forceCriticalMode
  };
}