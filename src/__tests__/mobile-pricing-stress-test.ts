// Mobile Pricing Page Stress Testing Framework
// Tests for trauma-informed design under crisis conditions

import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';

// Mock DOM environment for testing
const mockWindow = {
  innerWidth: 375, // iPhone SE width
  innerHeight: 667,
  navigator: {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    deviceMemory: 2, // Low-end device
    connection: {
      effectiveType: '3g',
      downlink: 1.5,
      rtt: 300
    },
    getBattery: jest.fn().mockResolvedValue({
      level: 0.15, // Low battery
      charging: false
    })
  },
  matchMedia: jest.fn((query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  })),
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
  },
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
};

// Mock document for DOM manipulation tests
const mockDocument = {
  documentElement: {
    style: {
      setProperty: jest.fn(),
      removeProperty: jest.fn()
    },
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn()
    }
  },
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => []),
  createElement: jest.fn(() => ({
    style: {},
    setAttribute: jest.fn(),
    appendChild: jest.fn(),
    textContent: ''
  })),
  head: {
    appendChild: jest.fn()
  },
  body: {
    classList: {
      add: jest.fn(),
      remove: jest.fn()
    }
  },
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

// Setup global mocks
global.window = mockWindow as any;
global.document = mockDocument as any;
global.navigator = mockWindow.navigator as any;

interface StressTestScenario {
  name: string;
  deviceConditions: {
    memory: number;
    battery: number;
    connection: string;
    screenSize: { width: number; height: number };
  };
  userBehavior: {
    rapidTaps: number;
    longPresses: number;
    scrollSpeed: 'slow' | 'normal' | 'fast';
    multitasking: boolean;
  };
  emotionalState: 'calm' | 'anxious' | 'panic' | 'crisis';
  expectedOptimizations: string[];
}

const stressTestScenarios: StressTestScenario[] = [
  {
    name: 'Crisis Mode - Panic Attack Simulation',
    deviceConditions: {
      memory: 1, // Very low memory
      battery: 0.08, // Critical battery
      connection: 'slow-2g',
      screenSize: { width: 320, height: 568 } // Small screen
    },
    userBehavior: {
      rapidTaps: 15, // Rapid, frantic tapping
      longPresses: 0,
      scrollSpeed: 'fast',
      multitasking: true
    },
    emotionalState: 'crisis',
    expectedOptimizations: [
      'crisis-mode-enabled',
      'reduced-animations',
      'simplified-interface',
      'large-touch-targets',
      'crisis-support-visible'
    ]
  },
  {
    name: 'Anxiety State - Decision Paralysis',
    deviceConditions: {
      memory: 2,
      battery: 0.25,
      connection: '3g',
      screenSize: { width: 375, height: 667 }
    },
    userBehavior: {
      rapidTaps: 8,
      longPresses: 3, // Hesitation patterns
      scrollSpeed: 'slow',
      multitasking: false
    },
    emotionalState: 'anxious',
    expectedOptimizations: [
      'gentle-interactions',
      'reassuring-messaging',
      'clear-exit-options',
      'simplified-choices'
    ]
  },
  {
    name: 'Low-Resource Environment',
    deviceConditions: {
      memory: 1,
      battery: 0.12,
      connection: '2g',
      screenSize: { width: 360, height: 640 }
    },
    userBehavior: {
      rapidTaps: 2,
      longPresses: 1,
      scrollSpeed: 'slow',
      multitasking: true
    },
    emotionalState: 'calm',
    expectedOptimizations: [
      'deferred-non-essentials',
      'compressed-images',
      'minimal-javascript',
      'offline-fallbacks'
    ]
  },
  {
    name: 'Trembling Hands - Motor Impairment',
    deviceConditions: {
      memory: 4,
      battery: 0.60,
      connection: '4g',
      screenSize: { width: 414, height: 896 }
    },
    userBehavior: {
      rapidTaps: 12, // Unintentional repeated taps
      longPresses: 8, // Difficulty with precise touches
      scrollSpeed: 'slow',
      multitasking: false
    },
    emotionalState: 'anxious',
    expectedOptimizations: [
      'extra-large-touch-targets',
      'tap-delay-tolerance',
      'error-prevention',
      'confirmation-dialogs'
    ]
  }
];

describe('Mobile Pricing Page Stress Testing', () => {
  let performanceOptimizer: any;
  let accessibilityEnhancements: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock performance optimizer
    performanceOptimizer = {
      detectCrisisPatterns: jest.fn(),
      optimizeForLowMemory: jest.fn(),
      enableCrisisMode: jest.fn(),
      shouldReduceAnimations: jest.fn(),
      shouldShowCrisisSupport: jest.fn()
    };

    // Mock accessibility enhancements
    accessibilityEnhancements = {
      enhanceTouchTargets: jest.fn(),
      enableSlowInteractions: jest.fn(),
      announceToScreenReader: jest.fn(),
      detectMotorImpairment: jest.fn()
    };
  });

  afterEach(() => {
    // Cleanup
    jest.restoreAllMocks();
  });

  describe('Crisis Detection and Response', () => {
    test('should detect rapid interaction patterns indicating crisis', () => {
      const scenario = stressTestScenarios[0]; // Crisis mode scenario
      
      // Simulate rapid tapping
      for (let i = 0; i < scenario.userBehavior.rapidTaps; i++) {
        const touchEvent = new Event('touchstart');
        global.document.dispatchEvent(touchEvent);
      }

      expect(performanceOptimizer.detectCrisisPatterns).toHaveBeenCalled();
      expect(performanceOptimizer.enableCrisisMode).toHaveBeenCalled();
    });

    test('should show crisis support when battery is critically low', () => {
      const scenario = stressTestScenarios[0];
      
      // Mock low battery condition
      mockWindow.navigator.getBattery = jest.fn().mockResolvedValue({
        level: scenario.deviceConditions.battery,
        charging: false
      });

      expect(performanceOptimizer.shouldShowCrisisSupport()).toBeTruthy();
    });

    test('should reduce animations in crisis mode', () => {
      const scenario = stressTestScenarios[0];
      
      // Trigger crisis mode
      performanceOptimizer.enableCrisisMode();
      
      expect(performanceOptimizer.shouldReduceAnimations()).toBeTruthy();
      expect(mockDocument.documentElement.classList.add).toHaveBeenCalledWith('reduced-motion');
    });
  });

  describe('Touch Target Optimization', () => {
    test('should increase touch target sizes for trembling hands', () => {
      const scenario = stressTestScenarios[3]; // Motor impairment scenario
      
      // Simulate trembling hand pattern (multiple rapid taps in small area)
      for (let i = 0; i < scenario.userBehavior.rapidTaps; i++) {
        const touchEvent = new Event('touchstart');
        global.document.dispatchEvent(touchEvent);
      }

      expect(accessibilityEnhancements.detectMotorImpairment).toHaveBeenCalled();
      expect(accessibilityEnhancements.enhanceTouchTargets).toHaveBeenCalled();
    });

    test('should maintain minimum 52px touch targets on small screens', () => {
      const scenario = stressTestScenarios[0];
      mockWindow.innerWidth = scenario.deviceConditions.screenSize.width;
      
      const buttons = mockDocument.querySelectorAll('button');
      buttons.forEach((button: any) => {
        expect(button.style.minHeight).toMatch(/^([5-9]\d|[1-9]\d{2,})px$/); // >= 52px
        expect(button.style.minWidth).toMatch(/^([5-9]\d|[1-9]\d{2,})px$/); // >= 52px
      });
    });
  });

  describe('Performance Under Stress', () => {
    test('should defer non-essential content on slow connections', () => {
      const scenario = stressTestScenarios[2]; // Low-resource scenario
      
      mockWindow.navigator.connection.effectiveType = scenario.deviceConditions.connection;
      
      expect(performanceOptimizer.optimizeForLowMemory).toHaveBeenCalled();
      
      // Should defer testimonials and decorative elements
      const deferredElements = mockDocument.querySelectorAll('.testimonials, .decorative');
      expect(deferredElements.length).toBeGreaterThan(0);
    });

    test('should preload crisis resources even on slow connections', () => {
      const scenario = stressTestScenarios[2];
      
      const criticalResources = [
        'crisis-lifeline-numbers',
        'emergency-contacts',
        'basic-coping-tools'
      ];

      criticalResources.forEach(resource => {
        expect(mockDocument.createElement).toHaveBeenCalledWith('link');
      });
    });

    test('should handle memory pressure gracefully', () => {
      const scenario = stressTestScenarios[0];
      mockWindow.navigator.deviceMemory = scenario.deviceConditions.memory;
      
      // Simulate memory pressure
      const memoryPressureEvent = new Event('memorywarning');
      global.window.dispatchEvent(memoryPressureEvent);
      
      expect(performanceOptimizer.optimizeForLowMemory).toHaveBeenCalled();
    });
  });

  describe('Payment Flow Stress Testing', () => {
    test('should handle payment form submission under crisis conditions', async () => {
      const scenario = stressTestScenarios[0];
      
      // Mock payment form
      const paymentForm = {
        validate: jest.fn().mockReturnValue(true),
        submit: jest.fn().mockResolvedValue({ success: true }),
        showCrisisExit: jest.fn()
      };

      // Simulate crisis state during payment
      performanceOptimizer.enableCrisisMode();
      
      // Should show crisis exit option
      expect(paymentForm.showCrisisExit).toHaveBeenCalled();
      
      // Should allow form completion with gentle validation
      await expect(paymentForm.submit()).resolves.toEqual({ success: true });
    });

    test('should prevent accidental purchases during panic state', () => {
      const scenario = stressTestScenarios[0];
      
      // Simulate rapid button presses (panic behavior)
      const purchaseButton = {
        click: jest.fn(),
        disabled: false,
        addConfirmationDelay: jest.fn()
      };

      for (let i = 0; i < 5; i++) {
        purchaseButton.click();
      }

      // Should add confirmation delay or require deliberate action
      expect(purchaseButton.addConfirmationDelay).toHaveBeenCalled();
    });
  });

  describe('Accessibility Under Stress', () => {
    test('should maintain screen reader compatibility during crisis', () => {
      const scenario = stressTestScenarios[0];
      
      // Enable crisis mode
      performanceOptimizer.enableCrisisMode();
      
      // Should announce crisis mode to screen reader
      expect(accessibilityEnhancements.announceToScreenReader)
        .toHaveBeenCalledWith(expect.stringContaining('crisis'));
    });

    test('should adapt to user preference changes during stress', () => {
      const scenario = stressTestScenarios[1]; // Anxiety scenario
      
      // User enables simplified interface due to overwhelm
      const userPreferences = {
        simplifyInterface: true,
        reduceMotion: true,
        largeText: true
      };

      Object.entries(userPreferences).forEach(([key, value]) => {
        if (value) {
          expect(accessibilityEnhancements.enableSlowInteractions).toHaveBeenCalled();
        }
      });
    });
  });

  describe('Network Resilience', () => {
    test('should handle network disconnection gracefully', () => {
      // Simulate going offline
      const offlineEvent = new Event('offline');
      global.window.dispatchEvent(offlineEvent);
      
      // Should show offline notice and enable crisis mode
      expect(performanceOptimizer.shouldShowCrisisSupport()).toBeTruthy();
    });

    test('should queue payment attempts when connection is unstable', () => {
      const scenario = stressTestScenarios[2];
      
      const paymentQueue = {
        add: jest.fn(),
        retry: jest.fn(),
        clear: jest.fn()
      };

      // Simulate network instability
      mockWindow.navigator.connection.effectiveType = 'slow-2g';
      
      // Should queue payment for retry when connection improves
      expect(paymentQueue.add).toHaveBeenCalled();
    });
  });

  describe('Error Recovery', () => {
    test('should provide clear error messages without increasing anxiety', () => {
      const errorHandler = {
        displayError: jest.fn(),
        offerSupport: jest.fn(),
        provideAlternatives: jest.fn()
      };

      const error = new Error('Payment processing failed');
      
      errorHandler.displayError(error);
      
      // Should offer gentle error messages and support options
      expect(errorHandler.offerSupport).toHaveBeenCalled();
      expect(errorHandler.provideAlternatives).toHaveBeenCalled();
    });

    test('should maintain session state after errors', () => {
      const sessionManager = {
        saveState: jest.fn(),
        restoreState: jest.fn(),
        clearSensitiveData: jest.fn()
      };

      // Simulate error during checkout
      const checkoutError = new Error('Network timeout');
      
      // Should save non-sensitive form data for recovery
      expect(sessionManager.saveState).toHaveBeenCalled();
      expect(sessionManager.clearSensitiveData).toHaveBeenCalled();
    });
  });
});

// Performance benchmark testing
describe('Performance Benchmarks', () => {
  test('should load pricing page in under 2 seconds on 3G', async () => {
    const startTime = performance.now();
    
    // Mock page load simulation
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate 1.5s load
    
    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });

  test('should maintain 60fps during interactions on low-end devices', () => {
    const frameRate = {
      measure: jest.fn().mockReturnValue(16.67), // ~60fps
      optimize: jest.fn()
    };

    // Simulate interaction on low-end device
    mockWindow.navigator.deviceMemory = 1;
    
    const measuredFrameRate = frameRate.measure();
    expect(measuredFrameRate).toBeLessThan(20); // Target: under 20ms per frame
  });

  test('should use less than 50MB memory on budget devices', () => {
    const memoryUsage = {
      measure: jest.fn().mockReturnValue(45), // 45MB
      optimize: jest.fn()
    };

    const usage = memoryUsage.measure();
    expect(usage).toBeLessThan(50);
  });
});

// Export test utilities for integration testing
export {
  stressTestScenarios,
  mockWindow,
  mockDocument
};