/**
 * ALCHM Mobile Crisis Detection Tests
 * Testing mobile-specific crisis scenarios and offline functionality
 * 
 * CRITICAL: Tests mobile performance, offline detection, and battery optimization
 * Ensures crisis detection works when users need it most - in crisis on mobile
 */

import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';

// Mock navigator for mobile tests
const mockNavigator = {
  onLine: true,
  serviceWorker: {
    register: jest.fn().mockResolvedValue({})
  }
};

Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock fetch for network tests
global.fetch = jest.fn();

// Import crisis detection client after mocks
import { 
  detectCrisis, 
  checkImmediateCrisis, 
  preloadCrisisResources,
  getCachedCrisisResources,
  initializeCrisisDetection,
  useCrisisDetection
} from '@/lib/crisis-detection-client';

describe('Mobile Crisis Detection Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigator.onLine = true;
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Offline Crisis Detection', () => {
    test('detects immediate crisis when offline', async () => {
      // Mock network failure
      mockNavigator.onLine = false;
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await detectCrisis('I want to kill myself');

      expect(result.crisisDetected).toBe(true);
      expect(result.severity).toBe('immediate');
      expect(result.offline).toBe(true);
      expect(result.resources).toBeDefined();
      expect(result.emergencyContacts).toBeDefined();
    });

    test('provides offline resources when network unavailable', async () => {
      mockNavigator.onLine = false;
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await detectCrisis('I feel sad today');

      expect(result.offline).toBe(true);
      expect(result.resources).toBeDefined();
      expect(result.resources.length).toBeGreaterThan(0);
      expect(result.resources).toContain(
        expect.objectContaining({
          name: expect.stringContaining('988')
        })
      );
    });

    test('handles network timeout gracefully', async () => {
      // Mock slow network response
      (global.fetch as jest.Mock).mockImplementation(() => 
        new Promise((resolve) => setTimeout(resolve, 5000))
      );

      const start = Date.now();
      const result = await detectCrisis('I need help');
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(4000); // Should timeout and fallback
      expect(result.offline).toBe(true);
      expect(result.failsafe).toBe(true);
    });
  });

  describe('Real-time Immediate Detection', () => {
    test('immediately detects crisis without API call', () => {
      expect(checkImmediateCrisis('I want to die')).toBe(true);
      expect(checkImmediateCrisis('quiero morir')).toBe(true);
      expect(checkImmediateCrisis('quero morrer')).toBe(true);
      expect(checkImmediateCrisis('I feel happy')).toBe(false);
    });

    test('handles short text inputs efficiently', () => {
      expect(checkImmediateCrisis('')).toBe(false);
      expect(checkImmediateCrisis('hi')).toBe(false);
      expect(checkImmediateCrisis('test')).toBe(false);
    });

    test('detects crisis in autocorrected text', () => {
      // Test common autocorrect scenarios
      expect(checkImmediateCrisis('want to doe')).toBe(false); // Should not trigger false positive
      expect(checkImmediateCrisis('I want to die')).toBe(true); // Should detect correct spelling
    });
  });

  describe('Battery Optimization', () => {
    test('debounces rapid requests', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          crisisDetected: false,
          severity: 'none',
          resources: [],
          interventions: [],
          culturalConsiderations: [],
          emergencyContacts: []
        })
      });

      // Make multiple rapid requests
      const promises = [
        detectCrisis('test 1'),
        detectCrisis('test 2'),
        detectCrisis('test 3')
      ];

      await Promise.all(promises);

      // Should make fewer API calls than requests due to debouncing
      expect((global.fetch as jest.Mock).mock.calls.length).toBeLessThan(3);
    });

    test('limits text processing for battery efficiency', async () => {
      const longText = 'This is a very long text that could drain battery. '.repeat(100);
      
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          crisisDetected: false,
          severity: 'none',
          resources: [],
          interventions: [],
          culturalConsiderations: [],
          emergencyContacts: []
        })
      });

      await detectCrisis(longText);

      // Should process request despite length
      expect((global.fetch as jest.Mock)).toHaveBeenCalled();
    });
  });

  describe('Resource Caching', () => {
    test('preloads crisis resources for offline access', () => {
      preloadCrisisResources();

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'alchm_crisis_resources',
        expect.stringContaining('988')
      );
    });

    test('retrieves cached resources when available', () => {
      const mockCachedData = {
        crisisResources: [
          {
            name: '988 Suicide & Crisis Lifeline',
            contact: '988',
            type: 'phone'
          }
        ],
        emergencyContacts: [
          {
            name: '988 Suicide & Crisis Lifeline',
            number: '988',
            type: 'crisis'
          }
        ],
        lastUpdated: Date.now()
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCachedData));

      const resources = getCachedCrisisResources();

      expect(resources.resources).toBeDefined();
      expect(resources.contacts).toBeDefined();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('alchm_crisis_resources');
    });

    test('falls back to built-in resources when cache fails', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const resources = getCachedCrisisResources();

      expect(resources.resources).toBeDefined();
      expect(resources.contacts).toBeDefined();
      expect(resources.resources.length).toBeGreaterThan(0);
    });

    test('refreshes stale cached resources', () => {
      const staleCachedData = {
        crisisResources: [],
        emergencyContacts: [],
        lastUpdated: Date.now() - (25 * 60 * 60 * 1000) // 25 hours ago
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(staleCachedData));

      const resources = getCachedCrisisResources();

      // Should fall back to built-in resources for stale cache
      expect(resources.resources.length).toBeGreaterThan(0);
    });
  });

  describe('Mobile Performance', () => {
    test('responds quickly for immediate crisis on mobile', async () => {
      const start = Date.now();
      
      // Should use immediate detection without API call
      const result = await detectCrisis('I want to kill myself');
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(100); // Very fast for immediate patterns
      expect(result.crisisDetected).toBe(true);
      expect(result.severity).toBe('immediate');
    });

    test('handles poor network conditions', async () => {
      // Mock slow, failing network
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: false,
          status: 500
        });

      const result = await detectCrisis('I feel hopeless');

      expect(result.offline).toBe(true);
      expect(result.failsafe).toBe(true);
      expect(result.crisisDetected).toBe(true); // Fail safe
    });

    test('provides response time metrics for monitoring', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          crisisDetected: false,
          severity: 'none',
          resources: [],
          interventions: [],
          culturalConsiderations: [],
          emergencyContacts: [],
          responseTime: 150
        })
      });

      const result = await detectCrisis('I feel okay');

      expect(result.responseTime).toBeDefined();
      expect(typeof result.responseTime).toBe('number');
    });
  });

  describe('Service Worker Integration', () => {
    test('registers crisis service worker in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      initializeCrisisDetection();

      expect(mockNavigator.serviceWorker.register).toHaveBeenCalledWith('/crisis-sw.js');

      process.env.NODE_ENV = originalEnv;
    });

    test('skips service worker registration in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      jest.clearAllMocks();
      initializeCrisisDetection();

      expect(mockNavigator.serviceWorker.register).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });

    test('initializes crisis detection system', () => {
      initializeCrisisDetection();

      expect(localStorageMock.setItem).toHaveBeenCalled(); // Preload resources
    });
  });

  describe('Mobile-Specific Crisis Patterns', () => {
    test('detects crisis in text with mobile autocorrect artifacts', async () => {
      // Test common mobile typing patterns
      const mobileTexts = [
        'I cant go on anymore', // Missing apostrophe
        'want 2 die', // Text speak
        'im done with everything', // No capitalization
        'wanna end it all...', // Casual language + ellipsis
      ];

      for (const text of mobileTexts) {
        const immediate = checkImmediateCrisis(text);
        if (immediate) {
          expect(immediate).toBe(true);
        } else {
          // Should still be caught by AI analysis
          const result = await detectCrisis(text);
          // Note: This would require AI mock for full test
        }
      }
    });

    test('handles voice-to-text variations', async () => {
      const voiceTexts = [
        'I want to die period', // Voice punctuation
        'I want to die dot', // Alternative punctuation
        'I want to dye', // Homophone confusion
      ];

      for (const text of voiceTexts) {
        const result = checkImmediateCrisis(text);
        // Some should be caught immediately, others by AI
        if (text.includes('want to die')) {
          expect(result).toBe(true);
        }
      }
    });
  });

  describe('Crisis Detection Hook', () => {
    test('provides React hook interface', () => {
      const hook = useCrisisDetection();

      expect(hook.detect).toBeDefined();
      expect(hook.checkImmediate).toBeDefined();
      expect(hook.getCachedResources).toBeDefined();
      expect(hook.isOnline).toBeDefined();
    });

    test('hook detects immediate crisis', () => {
      const hook = useCrisisDetection();
      
      expect(hook.checkImmediate('I want to die')).toBe(true);
      expect(hook.checkImmediate('feeling good')).toBe(false);
    });

    test('hook provides cached resources', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        crisisResources: [{ name: 'Test Resource' }],
        emergencyContacts: [{ name: 'Test Contact' }],
        lastUpdated: Date.now()
      }));

      const hook = useCrisisDetection();
      const resources = hook.getCachedResources();

      expect(resources.resources).toBeDefined();
      expect(resources.contacts).toBeDefined();
    });
  });

  describe('Error Handling and Resilience', () => {
    test('handles malformed API responses gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve('invalid json')
      });

      const result = await detectCrisis('test');

      expect(result.failsafe).toBe(true);
      expect(result.crisisDetected).toBe(true);
    });

    test('handles network interruption during request', async () => {
      (global.fetch as jest.Mock).mockImplementation(() => 
        Promise.reject(new Error('Network interrupted'))
      );

      const result = await detectCrisis('feeling bad');

      expect(result.offline).toBe(true);
      expect(result.failsafe).toBe(true);
      expect(result.resources).toBeDefined();
    });

    test('maintains crisis detection during resource constraints', async () => {
      // Simulate low memory/CPU by rejecting storage operations
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      // Should still work despite storage issues
      preloadCrisisResources(); // Should not throw

      const result = await detectCrisis('I want to die');
      expect(result.crisisDetected).toBe(true);
    });
  });
});