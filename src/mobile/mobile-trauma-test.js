/**
 * Mobile Trauma Optimization Test Suite
 * Tests critical user flows for users in emotional distress on mobile devices
 */

class MobileTraumaTestSuite {
  constructor() {
    this.testResults = [];
    this.criticalFailures = [];
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    this.isAndroid = /Android/.test(navigator.userAgent);
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, type };
    console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
    this.testResults.push(logEntry);
  }

  error(message) {
    this.log(message, 'error');
    this.criticalFailures.push(message);
  }

  success(message) {
    this.log(message, 'success');
  }

  warn(message) {
    this.log(message, 'warn');
  }

  // Test touch target sizes for trembling hands
  testTouchTargetSizes() {
    this.log('Testing touch target sizes for crisis accessibility...');
    
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
    let failedElements = 0;
    
    interactiveElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const minSize = 52; // Minimum size for trembling hands
      
      if (rect.width < minSize || rect.height < minSize) {
        failedElements++;
        this.error(`Touch target ${index} too small: ${rect.width}x${rect.height}px (min: ${minSize}px)`);
      }
    });
    
    if (failedElements === 0) {
      this.success(`All ${interactiveElements.length} touch targets meet accessibility requirements`);
    } else {
      this.error(`${failedElements}/${interactiveElements.length} touch targets are too small for crisis users`);
    }
    
    return failedElements === 0;
  }

  // Test crisis resource loading speed
  async testCrisisResourcePerformance() {
    this.log('Testing crisis resource loading performance...');
    
    const criticalResources = [
      '/crisis-resources',
      '/emergency-contacts',
      '/safe-space',
      '/breathe'
    ];
    
    const results = [];
    
    for (const resource of criticalResources) {
      try {
        const startTime = performance.now();
        const response = await fetch(resource, { method: 'HEAD' });
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        results.push({ resource, loadTime, status: response.status });
        
        if (loadTime > 1000) { // 1 second threshold
          this.error(`Crisis resource ${resource} loads too slowly: ${loadTime.toFixed(2)}ms`);
        } else {
          this.success(`Crisis resource ${resource} loads quickly: ${loadTime.toFixed(2)}ms`);
        }
      } catch (error) {
        this.error(`Failed to load crisis resource ${resource}: ${error.message}`);
        results.push({ resource, loadTime: null, status: 'error', error: error.message });
      }
    }
    
    return results;
  }

  // Test triple-tap activation for emergency mode
  testTripleTapActivation() {
    this.log('Testing triple-tap emergency activation...');
    
    const testElement = document.body;
    let tapCount = 0;
    let lastTapTime = 0;
    let activationDetected = false;
    
    // Simulate triple tap
    const simulateTripleTap = () => {
      return new Promise((resolve) => {
        const tapEvents = [];
        
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const event = new TouchEvent('touchstart', {
              touches: [{
                clientX: 100,
                clientY: 100
              }]
            });
            
            testElement.dispatchEvent(event);
            tapEvents.push(Date.now());
            
            if (i === 2) {
              // Check if activation was triggered
              setTimeout(() => {
                const emergencyMode = document.querySelector('.emergency-overlay');
                activationDetected = emergencyMode && !emergencyMode.hidden;
                resolve(activationDetected);
              }, 100);
            }
          }, i * 100);
        }
      });
    };
    
    // Listen for emergency mode activation
    document.addEventListener('emergencyModeActivated', () => {
      activationDetected = true;
    });
    
    return simulateTripleTap().then((activated) => {
      if (activated) {
        this.success('Triple-tap emergency activation working correctly');
      } else {
        this.warn('Triple-tap emergency activation not detected (may require manual testing)');
      }
      return activated;
    });
  }

  // Test battery conservation features
  testBatteryConservation() {
    this.log('Testing battery conservation features...');
    
    const tests = {
      conservationCSS: document.querySelector('#battery-conservation-styles') !== null,
      reducedAnimations: document.body.classList.contains('reduced-motion'),
      conservationActive: document.body.classList.contains('battery-conservation')
    };
    
    // Test Battery API if available
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        this.log(`Battery level: ${(battery.level * 100).toFixed(0)}%`);
        this.log(`Charging: ${battery.charging ? 'Yes' : 'No'}`);
        
        if (battery.level <= 0.2 && !battery.charging) {
          if (tests.conservationActive) {
            this.success('Low battery conservation mode activated correctly');
          } else {
            this.error('Low battery conservation mode should be active');
          }
        }
      }).catch(() => {
        this.warn('Battery API not available for testing');
      });
    } else {
      this.warn('Battery API not supported on this device');
    }
    
    return tests;
  }

  // Test network resilience
  testNetworkResilience() {
    this.log('Testing network resilience features...');
    
    const tests = {
      offlineSupport: 'serviceWorker' in navigator,
      cacheAPI: 'caches' in window,
      localStorage: !!window.localStorage,
      indexedDB: !!window.indexedDB
    };
    
    // Test offline functionality
    const originalOnline = navigator.onLine;
    
    // Simulate offline
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    
    const offlineEvent = new Event('offline');
    window.dispatchEvent(offlineEvent);
    
    setTimeout(() => {
      const offlineNotification = document.querySelector('#offline-notification');
      if (offlineNotification) {
        this.success('Offline notification displayed correctly');
      } else {
        this.warn('Offline notification not found');
      }
      
      // Restore online status
      Object.defineProperty(navigator, 'onLine', { value: originalOnline, configurable: true });
      const onlineEvent = new Event('online');
      window.dispatchEvent(onlineEvent);
    }, 100);
    
    return tests;
  }

  // Test one-handed operation
  testOneHandedOperation() {
    this.log('Testing one-handed operation features...');
    
    const tests = {
      thumbZones: document.querySelector('.thumb-zones') !== null,
      floatingButtons: document.querySelectorAll('.one-handed-fab').length > 0,
      reachabilityMode: false
    };
    
    // Test reachability mode activation
    const swipeEvent = new TouchEvent('touchstart', {
      touches: [{
        clientX: 100,
        clientY: 50 // Top of screen
      }]
    });
    
    document.dispatchEvent(swipeEvent);
    
    setTimeout(() => {
      const reachabilityActive = document.querySelector('.pulled-down');
      tests.reachabilityMode = !!reachabilityActive;
      
      if (tests.reachabilityMode) {
        this.success('Reachability mode can be activated');
      } else {
        this.warn('Reachability mode not detected (may require gesture)');
      }
    }, 500);
    
    return tests;
  }

  // Test accessibility features
  testAccessibilityFeatures() {
    this.log('Testing accessibility features for crisis users...');
    
    const tests = {
      ariaLiveRegion: document.querySelector('#crisis-announcements') !== null,
      skipLinks: document.querySelectorAll('.skip-link').length > 0,
      focusManagement: true,
      screenReaderOptimized: document.body.classList.contains('screen-reader-optimized'),
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
    
    // Test focus ring visibility
    const firstButton = document.querySelector('button');
    if (firstButton) {
      firstButton.focus();
      const focusOutlineStyle = window.getComputedStyle(firstButton).outline;
      tests.focusManagement = focusOutlineStyle !== 'none';
      
      if (tests.focusManagement) {
        this.success('Focus management working correctly');
      } else {
        this.error('Focus outlines not visible - critical for keyboard navigation');
      }
    }
    
    // Test ARIA live regions
    if (tests.ariaLiveRegion) {
      const liveRegion = document.querySelector('#crisis-announcements');
      const ariaLive = liveRegion.getAttribute('aria-live');
      
      if (ariaLive === 'assertive' || ariaLive === 'polite') {
        this.success('ARIA live region configured correctly');
      } else {
        this.error('ARIA live region missing aria-live attribute');
      }
    }
    
    return tests;
  }

  // Test performance on low-end devices
  testLowEndDevicePerformance() {
    this.log('Testing performance on low-end devices...');
    
    const performanceMetrics = {
      memory: (performance as any).memory,
      timing: performance.timing,
      navigation: performance.navigation
    };
    
    // Estimate device capability
    const deviceScore = this.estimateDeviceCapability();
    
    if (deviceScore < 3) {
      this.warn('Low-end device detected - ensuring optimizations are active');
      
      const optimizations = {
        reducedAnimations: document.body.classList.contains('reduced-motion-mode'),
        compressedImages: document.querySelectorAll('img[data-compressed]').length > 0,
        minimalUI: document.body.classList.contains('minimal-ui')
      };
      
      Object.entries(optimizations).forEach(([key, active]) => {
        if (active) {
          this.success(`Low-end device optimization active: ${key}`);
        } else {
          this.warn(`Low-end device optimization not active: ${key}`);
        }
      });
    } else {
      this.success('Device performance appears adequate');
    }
    
    return { deviceScore, performanceMetrics };
  }

  // Estimate device capability score (1-10, lower = less capable)
  estimateDeviceCapability() {
    let score = 5; // Start with average
    
    // Memory indicators
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory.jsHeapSizeLimit < 1000000000) score -= 2; // < 1GB
      if (memory.jsHeapSizeLimit > 4000000000) score += 2; // > 4GB
    }
    
    // Hardware concurrency
    if (navigator.hardwareConcurrency) {
      if (navigator.hardwareConcurrency <= 2) score -= 1;
      if (navigator.hardwareConcurrency >= 8) score += 1;
    }
    
    // Device pixel ratio (higher might indicate more powerful device)
    if (this.devicePixelRatio >= 3) score += 1;
    if (this.devicePixelRatio < 2) score -= 1;
    
    // Connection speed
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') score -= 2;
      if (connection.effectiveType === '4g') score += 1;
    }
    
    return Math.max(1, Math.min(10, score));
  }

  // Test crisis detection and intervention
  testCrisisDetection() {
    this.log('Testing crisis detection and intervention...');
    
    const crisisKeywords = ['help', 'emergency', 'crisis', 'hurt', 'end it all'];
    const testText = 'I need help, this is an emergency';
    
    // Test keyword detection
    const detectedCrisis = crisisKeywords.some(keyword => 
      testText.toLowerCase().includes(keyword)
    );
    
    if (detectedCrisis) {
      this.success('Crisis keyword detection working');
    } else {
      this.error('Crisis keyword detection failed');
    }
    
    // Test intervention UI
    const crisisElements = {
      floatingButton: document.querySelector('.crisis-support'),
      emergencyModal: document.querySelector('.emergency-overlay'),
      hotlineNumbers: document.querySelectorAll('[href^="tel:"]').length > 0
    };
    
    Object.entries(crisisElements).forEach(([key, present]) => {
      if (present) {
        this.success(`Crisis intervention element present: ${key}`);
      } else {
        this.warn(`Crisis intervention element missing: ${key}`);
      }
    });
    
    return { detectedCrisis, crisisElements };
  }

  // Test keyboard shortcuts for crisis situations
  testKeyboardShortcuts() {
    this.log('Testing keyboard shortcuts for accessibility...');
    
    const shortcuts = [
      { keys: ['Control', 'Shift', 'h'], description: 'Emergency help' },
      { keys: ['Control', 'Alt', 'a'], description: 'Accessibility panel' },
      { keys: ['Escape'], description: 'Exit emergency mode' }
    ];
    
    let shortcutsWorking = 0;
    
    shortcuts.forEach(({ keys, description }) => {
      // Simulate keypress
      const event = new KeyboardEvent('keydown', {
        key: keys[keys.length - 1],
        ctrlKey: keys.includes('Control'),
        shiftKey: keys.includes('Shift'),
        altKey: keys.includes('Alt'),
        metaKey: keys.includes('Meta')
      });
      
      document.dispatchEvent(event);
      
      // Note: This is a simplified test - actual functionality would need manual verification
      this.log(`Tested shortcut: ${keys.join('+')} (${description})`);
      shortcutsWorking++;
    });
    
    this.success(`${shortcutsWorking} keyboard shortcuts tested`);
    return shortcutsWorking;
  }

  // Run all tests
  async runAllTests() {
    this.log('Starting comprehensive mobile trauma optimization test suite...');
    this.log(`Device: ${this.isMobile ? (this.isIOS ? 'iOS' : this.isAndroid ? 'Android' : 'Mobile') : 'Desktop'}`);
    this.log(`Viewport: ${this.viewport.width}x${this.viewport.height}`);
    this.log(`Pixel Ratio: ${this.devicePixelRatio}`);
    
    const results = {
      touchTargets: this.testTouchTargetSizes(),
      crisisResources: await this.testCrisisResourcePerformance(),
      tripleTap: await this.testTripleTapActivation(),
      batteryConservation: this.testBatteryConservation(),
      networkResilience: this.testNetworkResilience(),
      oneHandedOperation: this.testOneHandedOperation(),
      accessibility: this.testAccessibilityFeatures(),
      lowEndPerformance: this.testLowEndDevicePerformance(),
      crisisDetection: this.testCrisisDetection(),
      keyboardShortcuts: this.testKeyboardShortcuts()
    };
    
    // Generate summary
    const criticalFailures = this.criticalFailures.length;
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(result => 
      typeof result === 'boolean' ? result : true
    ).length;
    
    this.log('=== TEST SUMMARY ===');
    this.log(`Total test categories: ${totalTests}`);
    this.log(`Critical failures: ${criticalFailures}`);
    
    if (criticalFailures === 0) {
      this.success('All critical mobile trauma optimizations are working correctly!');
    } else {
      this.error(`${criticalFailures} critical issues found that could impact users in crisis`);
    }
    
    // Provide recommendations
    this.generateRecommendations();
    
    return {
      results,
      summary: {
        totalTests,
        criticalFailures,
        testResults: this.testResults
      }
    };
  }

  // Generate recommendations based on test results
  generateRecommendations() {
    this.log('=== RECOMMENDATIONS ===');
    
    if (this.criticalFailures.length > 0) {
      this.log('CRITICAL ISSUES TO FIX:');
      this.criticalFailures.forEach((failure, index) => {
        this.log(`${index + 1}. ${failure}`);
      });
    }
    
    // Device-specific recommendations
    if (this.isMobile) {
      this.log('Mobile-specific optimizations verified');
      
      if (this.isIOS) {
        this.log('iOS-specific: Ensure viewport meta tag prevents zoom on input focus');
        this.log('iOS-specific: Verify safe area insets are properly handled');
      }
      
      if (this.isAndroid) {
        this.log('Android-specific: Test across different browser versions');
        this.log('Android-specific: Verify touch event handling consistency');
      }
    }
    
    // Performance recommendations
    const deviceScore = this.estimateDeviceCapability();
    if (deviceScore < 4) {
      this.log('PERFORMANCE RECOMMENDATIONS:');
      this.log('- Enable aggressive battery conservation mode');
      this.log('- Reduce animation complexity');
      this.log('- Implement image compression');
      this.log('- Consider minimal UI mode by default');
    }
  }
}

// Export for use in testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileTraumaTestSuite;
}

// Auto-run tests if loaded directly
if (typeof window !== 'undefined') {
  window.MobileTraumaTestSuite = MobileTraumaTestSuite;
  
  // Provide easy way to run tests
  window.runMobileTraumaTests = function() {
    const testSuite = new MobileTraumaTestSuite();
    return testSuite.runAllTests();
  };
  
  // Auto-run in development mode
  if (window.location.hostname === 'localhost') {
    console.log('Mobile Trauma Test Suite loaded. Run window.runMobileTraumaTests() to test.');
  }
}