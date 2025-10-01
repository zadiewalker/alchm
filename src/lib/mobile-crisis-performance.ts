/**
 * MOBILE CRISIS PERFORMANCE OPTIMIZER
 * Emergency performance optimizations for users in emotional distress
 * 
 * This module detects crisis conditions and applies aggressive optimizations
 * to ensure ALCHM remains accessible during the most vulnerable moments.
 */

export interface CrisisConditions {
  lowBattery: boolean;
  slowConnection: boolean;
  oldDevice: boolean;
  highMemoryUsage: boolean;
  emergencyDetected: boolean;
}

export interface PerformanceOptimizations {
  disableAnimations: boolean;
  reduceImageQuality: boolean;
  preloadCrisisResources: boolean;
  enableOfflineMode: boolean;
  simplifyUI: boolean;
}

export class MobileCrisisPerformanceOptimizer {
  private static instance: MobileCrisisPerformanceOptimizer | null = null;
  private crisisConditions: CrisisConditions = {
    lowBattery: false,
    slowConnection: false,
    oldDevice: false,
    highMemoryUsage: false,
    emergencyDetected: false
  };
  
  private isMonitoring = false;
  private performanceObserver: PerformanceObserver | null = null;
  
  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeCrisisDetection();
    }
  }

  static getInstance(): MobileCrisisPerformanceOptimizer {
    if (!this.instance) {
      this.instance = new MobileCrisisPerformanceOptimizer();
    }
    return this.instance;
  }

  private async initializeCrisisDetection(): Promise<void> {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    console.log('🚨 Initializing Mobile Crisis Performance Monitoring...');

    // Battery API monitoring for crisis detection
    await this.monitorBatteryLevel();
    
    // Connection quality monitoring
    this.monitorConnectionQuality();
    
    // Device performance monitoring
    this.monitorDevicePerformance();
    
    // Memory usage monitoring
    this.monitorMemoryUsage();
    
    // Preload crisis resources immediately
    this.preloadEmergencyResources();
    
    // Start continuous monitoring
    this.startContinuousMonitoring();
    
    console.log('✅ Crisis Performance Monitoring Active');
  }

  private async monitorBatteryLevel(): Promise<void> {
    try {
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        
        const updateBatteryStatus = () => {
          const isCriticalBattery = battery.level < 0.15 && !battery.charging;
          const isLowBattery = battery.level < 0.25 && !battery.charging;
          
          this.crisisConditions.lowBattery = isCriticalBattery;
          
          if (isCriticalBattery) {
            console.log('🔋 CRITICAL BATTERY DETECTED - Activating Emergency Mode');
            this.activateEmergencyMode();
          } else if (isLowBattery) {
            console.log('⚠️ Low battery detected - Optimizing for power saving');
            this.optimizeForBattery();
          }
        };

        // Initial check
        updateBatteryStatus();
        
        // Listen for battery changes
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
      }
    } catch (error) {
      console.warn('Battery API not available:', error);
    }
  }

  private monitorConnectionQuality(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnectionStatus = () => {
        const slowConnections = ['slow-2g', '2g', '3g'];
        const isSlowConnection = slowConnections.includes(connection.effectiveType);
        
        this.crisisConditions.slowConnection = isSlowConnection;
        
        if (isSlowConnection) {
          console.log('📶 Slow connection detected - Activating offline-first mode');
          this.optimizeForSlowConnection();
        }
      };

      updateConnectionStatus();
      connection.addEventListener('change', updateConnectionStatus);
    }

    // Fallback: Monitor actual connection speed
    this.measureConnectionSpeed();
  }

  private async measureConnectionSpeed(): Promise<void> {
    try {
      const startTime = performance.now();
      // Use a small image to test connection speed
      const testImage = new Image();
      testImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      
      await new Promise((resolve, reject) => {
        testImage.onload = resolve;
        testImage.onerror = reject;
        
        setTimeout(reject, 3000); // 3 second timeout
      });
      
      const loadTime = performance.now() - startTime;
      
      if (loadTime > 2000) {
        this.crisisConditions.slowConnection = true;
        console.log('📶 Slow connection detected via speed test');
        this.optimizeForSlowConnection();
      }
    } catch (error) {
      // Assume slow connection if test fails
      this.crisisConditions.slowConnection = true;
      this.optimizeForSlowConnection();
    }
  }

  private monitorDevicePerformance(): void {
    // Detect old/slow devices
    const isOldDevice = this.detectOldDevice();
    this.crisisConditions.oldDevice = isOldDevice;
    
    if (isOldDevice) {
      console.log('📱 Old device detected - Optimizing for limited performance');
      this.optimizeForOldDevice();
    }

    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            // Monitor for long tasks that could indicate performance issues
            if (entry.entryType === 'longtask' && entry.duration > 100) {
              console.warn('⚠️ Long task detected:', entry.duration + 'ms');
              this.handlePerformanceIssue();
            }
            
            // Monitor for navigation timing issues
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              const loadTime = navEntry.loadEventEnd - navEntry.navigationStart;
              
              if (loadTime > 5000) {
                console.warn('⚠️ Slow page load detected:', loadTime + 'ms');
                this.handleSlowLoad();
              }
            }
          });
        });

        this.performanceObserver.observe({ 
          entryTypes: ['longtask', 'navigation', 'measure']
        });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }

  private detectOldDevice(): boolean {
    const userAgent = navigator.userAgent;
    
    // Check for old iOS versions
    const iosMatch = userAgent.match(/OS (\d+)_/);
    if (iosMatch && parseInt(iosMatch[1]) < 14) {
      return true;
    }
    
    // Check for old Android versions
    const androidMatch = userAgent.match(/Android (\d+)/);
    if (androidMatch && parseInt(androidMatch[1]) < 10) {
      return true;
    }
    
    // Check for low-end device indicators
    if (userAgent.includes('Android') && userAgent.includes('Mobile')) {
      // Common patterns for budget Android devices
      const lowEndPatterns = ['SM-A', 'SM-J', 'SM-G3', 'LG-', 'HUAWEI Y'];
      if (lowEndPatterns.some(pattern => userAgent.includes(pattern))) {
        return true;
      }
    }
    
    // Check hardware concurrency (CPU cores)
    if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4) {
      return true;
    }
    
    return false;
  }

  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      
      const checkMemory = () => {
        const memoryUsageRatio = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
        
        if (memoryUsageRatio > 0.8) {
          this.crisisConditions.highMemoryUsage = true;
          console.log('🧠 High memory usage detected - Optimizing memory usage');
          this.optimizeMemoryUsage();
        }
      };

      // Check memory every 30 seconds
      setInterval(checkMemory, 30000);
      checkMemory(); // Initial check
    }
  }

  private preloadEmergencyResources(): void {
    console.log('🚑 Preloading crisis resources...');
    
    // Preload 988 Lifeline information
    this.preconnectToEmergencyServices();
    
    // Preload offline crisis support content
    this.cacheEmergencyContent();
  }

  private preconnectToEmergencyServices(): void {
    const emergencyDomains = [
      'tel:988',
      'sms:741741',
      'https://988lifeline.org'
    ];

    // Create DNS prefetch links for faster emergency connections
    const emergencyLink = document.createElement('link');
    emergencyLink.rel = 'dns-prefetch';
    emergencyLink.href = '//988lifeline.org';
    document.head.appendChild(emergencyLink);
  }

  private async cacheEmergencyContent(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration) {
          // Request caching of emergency resources
          const emergencyResources = [
            '/crisis-resources',
            '/offline',
            '/emergency-contacts'
          ];
          
          // Cache emergency pages for offline access
          if ('caches' in window) {
            const cache = await caches.open('alchm-crisis-cache-v1');
            await cache.addAll(emergencyResources.filter(url => url.startsWith('/')));
          }
        }
      } catch (error) {
        console.warn('Could not cache emergency resources:', error);
      }
    }
  }

  private startContinuousMonitoring(): void {
    // Check for crisis conditions every 10 seconds
    setInterval(() => {
      this.evaluateCrisisConditions();
    }, 10000);
    
    // Check for emergency keywords in journal entries
    this.monitorForEmergencyKeywords();
  }

  private monitorForEmergencyKeywords(): void {
    // Monitor text inputs for crisis indicators
    const emergencyKeywords = [
      'suicide', 'kill myself', 'end my life', 'want to die',
      'self harm', 'hurt myself', 'can\'t go on', 'hopeless',
      'emergency', 'crisis', 'help me', 'desperate'
    ];

    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
        const text = target.value.toLowerCase();
        
        const hasEmergencyKeyword = emergencyKeywords.some(keyword => 
          text.includes(keyword)
        );
        
        if (hasEmergencyKeyword && !this.crisisConditions.emergencyDetected) {
          this.crisisConditions.emergencyDetected = true;
          console.log('🆘 EMERGENCY KEYWORDS DETECTED - Activating Crisis Mode');
          this.activateEmergencyMode();
          this.showCrisisSupport();
        }
      }
    });
  }

  private evaluateCrisisConditions(): void {
    const crisisCount = Object.values(this.crisisConditions).filter(Boolean).length;
    
    if (crisisCount >= 2) {
      console.log('🚨 MULTIPLE CRISIS CONDITIONS DETECTED - Full Emergency Mode');
      this.activateEmergencyMode();
    } else if (crisisCount >= 1) {
      console.log('⚠️ Crisis condition detected - Partial optimizations');
      this.applyPartialOptimizations();
    }
  }

  private activateEmergencyMode(): void {
    console.log('🚨 ACTIVATING EMERGENCY MODE');
    
    // Apply all crisis optimizations
    const optimizations: PerformanceOptimizations = {
      disableAnimations: true,
      reduceImageQuality: true,
      preloadCrisisResources: true,
      enableOfflineMode: true,
      simplifyUI: true
    };
    
    this.applyOptimizations(optimizations);
    
    // Show crisis support prominently
    this.showCrisisSupport();
    
    // Enable offline-first mode
    this.enableOfflineFirst();
    
    // Notify the app of emergency mode
    this.notifyEmergencyMode();
  }

  private optimizeForBattery(): void {
    console.log('🔋 Optimizing for battery conservation');
    
    // Disable animations to save CPU
    this.disableAnimations();
    
    // Reduce screen brightness hint
    if ('brightness' in screen) {
      try {
        (screen as any).brightness = 0.7;
      } catch (error) {
        console.warn('Could not adjust brightness');
      }
    }
    
    // Reduce update frequency
    this.reduceUpdateFrequency();
  }

  private optimizeForSlowConnection(): void {
    console.log('📶 Optimizing for slow connection');
    
    // Enable offline-first mode
    this.enableOfflineFirst();
    
    // Compress data
    this.enableDataCompression();
    
    // Preload essential resources only
    this.preloadEssentialResources();
  }

  private optimizeForOldDevice(): void {
    console.log('📱 Optimizing for old device');
    
    // Disable hardware-intensive features
    this.disableAnimations();
    this.simplifyRendering();
    
    // Reduce DOM complexity
    this.simplifyUI();
  }

  private handlePerformanceIssue(): void {
    console.warn('⚠️ Performance issue detected - Applying optimizations');
    this.applyPartialOptimizations();
  }

  private handleSlowLoad(): void {
    console.warn('⚠️ Slow load detected - Optimizing future loads');
    this.optimizeForSlowConnection();
  }

  private optimizeMemoryUsage(): void {
    console.log('🧠 Optimizing memory usage');
    
    // Clear unused caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (!name.includes('crisis') && !name.includes('essential')) {
            caches.delete(name);
          }
        });
      });
    }
    
    // Trigger garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  private applyOptimizations(optimizations: PerformanceOptimizations): void {
    if (optimizations.disableAnimations) {
      this.disableAnimations();
    }
    
    if (optimizations.reduceImageQuality) {
      this.reduceImageQuality();
    }
    
    if (optimizations.preloadCrisisResources) {
      this.preloadEmergencyResources();
    }
    
    if (optimizations.enableOfflineMode) {
      this.enableOfflineFirst();
    }
    
    if (optimizations.simplifyUI) {
      this.simplifyUI();
    }
  }

  private applyPartialOptimizations(): void {
    this.disableAnimations();
    this.reduceUpdateFrequency();
  }

  private disableAnimations(): void {
    const style = document.createElement('style');
    style.id = 'crisis-animation-disable';
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    
    if (!document.getElementById('crisis-animation-disable')) {
      document.head.appendChild(style);
    }
  }

  private reduceImageQuality(): void {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Reduce image loading priority for non-essential images
      if (!img.classList.contains('essential')) {
        img.loading = 'lazy';
      }
    });
  }

  private enableOfflineFirst(): void {
    // Enable offline-first caching strategy
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Send message to service worker to enable offline mode
        registration.active?.postMessage({
          type: 'ENABLE_OFFLINE_FIRST'
        });
      });
    }
    
    // Store journal entries locally immediately
    this.enableLocalStorage();
  }

  private enableLocalStorage(): void {
    // Ensure all form data is saved locally immediately
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          localStorage.setItem(`alchm_backup_${target.name || 'anonymous'}`, target.value);
        });
      });
    });
  }

  private simplifyRendering(): void {
    // Disable CSS filters and effects
    const style = document.createElement('style');
    style.id = 'crisis-simplify-rendering';
    style.textContent = `
      * {
        filter: none !important;
        backdrop-filter: none !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
    `;
    
    if (!document.getElementById('crisis-simplify-rendering')) {
      document.head.appendChild(style);
    }
  }

  private simplifyUI(): void {
    // Hide non-essential UI elements
    const nonEssentialElements = document.querySelectorAll(
      '.decoration, .animation, .non-essential, [data-non-essential]'
    );
    
    nonEssentialElements.forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
  }

  private reduceUpdateFrequency(): void {
    // Reduce the frequency of updates and checks
    clearInterval;
    
    // Replace high-frequency intervals with lower frequency
    this.isMonitoring = false;
    setTimeout(() => {
      this.isMonitoring = true;
    }, 5000);
  }

  private enableDataCompression(): void {
    // Request compressed data from server
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Accept-Encoding';
    meta.content = 'gzip, deflate, br';
    document.head.appendChild(meta);
  }

  private preloadEssentialResources(): void {
    const essentialResources = [
      '/journal',
      '/crisis-resources',
      '/auth/login'
    ];
    
    essentialResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  private showCrisisSupport(): void {
    // Ensure crisis support is highly visible
    const crisisElement = document.querySelector('.crisis-support-container');
    if (crisisElement) {
      (crisisElement as HTMLElement).style.zIndex = '9999';
      (crisisElement as HTMLElement).style.position = 'fixed';
      (crisisElement as HTMLElement).style.bottom = '20px';
    }
    
    // Create emergency overlay if needed
    this.createEmergencyOverlay();
  }

  private createEmergencyOverlay(): void {
    if (document.getElementById('emergency-crisis-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'emergency-crisis-overlay';
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(145deg, rgba(220, 38, 38, 0.95), rgba(185, 28, 28, 0.95));
        color: white;
        padding: 16px;
        text-align: center;
        z-index: 10000;
        font-weight: 600;
        font-size: 16px;
        box-shadow: 0 4px 20px rgba(220, 38, 38, 0.5);
      ">
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
          <span style="font-size: 20px;">🆘</span>
          <span>Crisis detected. Need immediate help?</span>
          <a href="tel:988" style="
            background: white;
            color: #dc2626;
            padding: 8px 16px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 700;
            margin-left: 12px;
          ">Call 988 Now</a>
          <button onclick="document.getElementById('emergency-crisis-overlay').remove()" style="
            background: transparent;
            border: 2px solid white;
            color: white;
            padding: 6px 12px;
            border-radius: 16px;
            cursor: pointer;
            font-size: 14px;
          ">✕</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
      const element = document.getElementById('emergency-crisis-overlay');
      if (element) {
        element.remove();
      }
    }, 30000);
  }

  private notifyEmergencyMode(): void {
    // Dispatch custom event to notify the app
    const event = new CustomEvent('alchm:emergency-mode-activated', {
      detail: {
        conditions: this.crisisConditions,
        timestamp: new Date().toISOString()
      }
    });
    
    window.dispatchEvent(event);
  }

  // Public API
  public getCrisisConditions(): CrisisConditions {
    return { ...this.crisisConditions };
  }

  public isInCrisisMode(): boolean {
    return Object.values(this.crisisConditions).some(Boolean);
  }

  public forceEmergencyMode(): void {
    console.log('🚨 EMERGENCY MODE MANUALLY ACTIVATED');
    this.crisisConditions.emergencyDetected = true;
    this.activateEmergencyMode();
  }

  public generatePerformanceReport(): string {
    const conditions = this.crisisConditions;
    let report = '🚨 Mobile Crisis Performance Report\n';
    report += '=' .repeat(40) + '\n\n';
    
    report += `Crisis Conditions Detected:\n`;
    report += `• Low Battery: ${conditions.lowBattery ? '❌ YES' : '✅ NO'}\n`;
    report += `• Slow Connection: ${conditions.slowConnection ? '❌ YES' : '✅ NO'}\n`;
    report += `• Old Device: ${conditions.oldDevice ? '❌ YES' : '✅ NO'}\n`;
    report += `• High Memory Usage: ${conditions.highMemoryUsage ? '❌ YES' : '✅ NO'}\n`;
    report += `• Emergency Keywords: ${conditions.emergencyDetected ? '🆘 DETECTED' : '✅ NONE'}\n\n`;
    
    const crisisLevel = Object.values(conditions).filter(Boolean).length;
    report += `Crisis Level: ${crisisLevel}/5 `;
    
    if (crisisLevel === 0) report += '✅ OPTIMAL';
    else if (crisisLevel <= 2) report += '⚠️ MONITORING';
    else report += '🚨 EMERGENCY MODE';
    
    return report;
  }
}

// Initialize crisis monitoring on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    MobileCrisisPerformanceOptimizer.getInstance();
  });

  // Also listen for emergency mode events
  window.addEventListener('alchm:emergency-mode-activated', (event: any) => {
    console.log('🚨 Emergency Mode Activated:', event.detail);
    
    // Show user-friendly notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ALCHM Emergency Mode Active', {
        body: 'Crisis support optimizations enabled. Help is available.',
        icon: '/favicon.svg',
        tag: 'alchm-emergency'
      });
    }
  });
}

export default MobileCrisisPerformanceOptimizer;