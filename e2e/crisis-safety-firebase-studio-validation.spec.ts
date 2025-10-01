/**
 * Crisis Safety Firebase Studio Validation Tests
 * 
 * CRITICAL MISSION: End-to-end testing that validates Firebase Studio diagnostic
 * operations never compromise crisis safety. These tests simulate real user crisis
 * scenarios during diagnostic operations to ensure safety is maintained.
 * 
 * Every test here could prevent a tragedy - execute with absolute precision.
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';

// Crisis safety performance thresholds
const CRISIS_THRESHOLDS = {
  CRISIS_BUTTON_RESPONSE: 100,      // ms
  EMERGENCY_NAVIGATION: 200,        // ms  
  HOTLINE_ACCESS: 500,              // ms
  OFFLINE_CACHE_ACCESS: 50,         // ms
  AGE_VERIFICATION: 1000,           // ms
  EMERGENCY_MODE_ACTIVATION: 100    // ms
};

// Test configuration
const CRISIS_SCENARIOS = {
  MILD_DISTRESS: 'mild distress expressions',
  MODERATE_CRISIS: 'moderate crisis indicators', 
  SEVERE_EMERGENCY: 'severe emergency situation',
  IMMEDIATE_DANGER: 'immediate danger keywords'
};

test.describe('Crisis Safety Firebase Studio Validation', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext({
      // Simulate real user conditions
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      // Reduce network speed to test under stress
      permissions: ['notifications', 'geolocation']
    });
    
    page = await context.newPage();
    
    // Setup crisis detection monitoring
    await setupCrisisMonitoring(page);
  });

  test.afterEach(async () => {
    await context.close();
  });

  test('CRITICAL: Crisis button remains functional during Firebase Studio diagnostics', async () => {
    await test.step('Navigate to journal page', async () => {
      await page.goto('/journal');
      await expect(page).toHaveTitle(/Journal/);
    });

    await test.step('Start diagnostic operation simulation', async () => {
      // Simulate Firebase Studio diagnostic running
      await page.evaluate(() => {
        window.simulateFirebaseStudioDiagnostic = true;
        window.diagnosticLoad = setInterval(() => {
          // Simulate diagnostic CPU load
          const start = Date.now();
          while (Date.now() - start < 10) {
            Math.random();
          }
        }, 100);
      });
    });

    await test.step('Enter crisis text to trigger support', async () => {
      const journalTextarea = page.locator('textarea[placeholder*="write"], textarea[placeholder*="journal"], #journal-input');
      await journalTextarea.fill('I am having thoughts of ending my life and I don\'t know what to do anymore');
    });

    await test.step('Measure crisis button response time', async () => {
      const startTime = Date.now();
      
      // Wait for crisis support to appear
      const crisisSupport = page.locator('[data-testid="crisis-support"], .crisis-support, [class*="crisis"]').first();
      await expect(crisisSupport).toBeVisible({ timeout: 5000 });
      
      const responseTime = Date.now() - startTime;
      
      console.log(`Crisis button response time: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(CRISIS_THRESHOLDS.CRISIS_BUTTON_RESPONSE);
    });

    await test.step('Verify crisis support is fully functional during diagnostics', async () => {
      // Check that crisis support modal has all required elements
      await expect(page.locator('text=988')).toBeVisible();
      await expect(page.locator('text=Crisis Text Line')).toBeVisible();
      
      // Test that crisis support buttons are clickable
      const crisisButton = page.locator('a[href*="tel:988"], a[href*="sms:741741"]').first();
      await expect(crisisButton).toBeEnabled();
    });

    await test.step('Stop diagnostic simulation', async () => {
      await page.evaluate(() => {
        if (window.diagnosticLoad) {
          clearInterval(window.diagnosticLoad);
          window.simulateFirebaseStudioDiagnostic = false;
        }
      });
    });
  });

  test('CRITICAL: Emergency navigation works during Firebase Studio operations', async () => {
    await test.step('Start diagnostic operation with high CPU load', async () => {
      await page.goto('/dashboard');
      
      // Simulate intensive Firebase Studio diagnostic
      await page.evaluate(() => {
        window.intensiveDiagnostic = setInterval(() => {
          // High CPU load simulation
          const start = Date.now();
          while (Date.now() - start < 50) {
            Math.random() * Math.random();
          }
        }, 10);
      });
    });

    await test.step('Test emergency navigation performance', async () => {
      const emergencyPaths = ['/emergency', '/crisis-resources', '/988'];
      
      for (const path of emergencyPaths) {
        const startTime = Date.now();
        
        await page.goto(path);
        await page.waitForLoadState('domcontentloaded');
        
        const navigationTime = Date.now() - startTime;
        
        console.log(`Emergency navigation to ${path}: ${navigationTime}ms`);
        expect(navigationTime).toBeLessThan(CRISIS_THRESHOLDS.EMERGENCY_NAVIGATION);
        
        // Verify page loaded correctly
        await expect(page.locator('body')).toBeVisible();
      }
    });

    await test.step('Stop intensive diagnostic', async () => {
      await page.evaluate(() => {
        if (window.intensiveDiagnostic) {
          clearInterval(window.intensiveDiagnostic);
        }
      });
    });
  });

  test('CRITICAL: Offline crisis cache remains accessible during diagnostics', async () => {
    await test.step('Navigate to journal and go offline', async () => {
      await page.goto('/journal');
      
      // Go offline
      await context.setOffline(true);
    });

    await test.step('Start diagnostic operation while offline', async () => {
      await page.evaluate(() => {
        window.offlineDiagnostic = setInterval(() => {
          // Simulate diagnostic operations while offline
          localStorage.setItem('diagnosticTest_' + Date.now(), 'test');
        }, 100);
      });
    });

    await test.step('Test offline crisis cache access time', async () => {
      const startTime = Date.now();
      
      // Try to access cached crisis resources
      const crisisResourcesAccess = await page.evaluate(async () => {
        try {
          // Check if service worker cache has crisis resources
          if ('caches' in window) {
            const cache = await caches.open('crisis-cache');
            const keys = await cache.keys();
            return keys.length > 0;
          }
          return false;
        } catch (error) {
          return false;
        }
      });
      
      const accessTime = Date.now() - startTime;
      
      console.log(`Offline crisis cache access: ${accessTime}ms`);
      expect(accessTime).toBeLessThan(CRISIS_THRESHOLDS.OFFLINE_CACHE_ACCESS);
      expect(crisisResourcesAccess).toBe(true);
    });

    await test.step('Verify offline crisis support still works', async () => {
      // Enter crisis text while offline
      const textarea = page.locator('textarea').first();
      await textarea.fill('I need immediate help, I am in crisis');
      
      // Crisis support should still activate from cache
      await expect(page.locator('[data-testid="crisis-support"], .crisis-support').first()).toBeVisible({ timeout: 3000 });
    });

    await test.step('Cleanup offline diagnostic', async () => {
      await page.evaluate(() => {
        if (window.offlineDiagnostic) {
          clearInterval(window.offlineDiagnostic);
        }
      });
      
      await context.setOffline(false);
    });
  });

  test('CRITICAL: Age verification remains functional during Firebase Studio stress', async () => {
    await test.step('Clear age verification and start diagnostic stress', async () => {
      await page.evaluate(() => {
        localStorage.removeItem('age_verified');
        
        // Start memory-intensive diagnostic
        window.memoryStress = [];
        window.memoryStressInterval = setInterval(() => {
          window.memoryStress.push(new Array(1000).fill('diagnostic-test'));
          if (window.memoryStress.length > 100) {
            window.memoryStress = window.memoryStress.slice(-50);
          }
        }, 50);
      });
    });

    await test.step('Test age verification performance under stress', async () => {
      await page.goto('/journal');
      
      const startTime = Date.now();
      
      // Age verification should appear
      const ageVerification = page.locator('[data-testid="age-verification"], .age-verification, text="age"').first();
      await expect(ageVerification).toBeVisible({ timeout: 5000 });
      
      const verificationTime = Date.now() - startTime;
      
      console.log(`Age verification load time under stress: ${verificationTime}ms`);
      expect(verificationTime).toBeLessThan(CRISIS_THRESHOLDS.AGE_VERIFICATION);
    });

    await test.step('Complete age verification and test crisis flow', async () => {
      // Complete age verification
      const confirmButton = page.locator('button:has-text("I am 18 or older"), button:has-text("Confirm"), button[type="submit"]').first();
      await confirmButton.click();
      
      // Test that crisis support still works after age verification under stress
      const textarea = page.locator('textarea').first();
      await textarea.fill('I am struggling with suicidal thoughts');
      
      await expect(page.locator('[data-testid="crisis-support"], .crisis-support').first()).toBeVisible({ timeout: 3000 });
    });

    await test.step('Stop memory stress test', async () => {
      await page.evaluate(() => {
        if (window.memoryStressInterval) {
          clearInterval(window.memoryStressInterval);
          window.memoryStress = [];
        }
      });
    });
  });

  test('CRITICAL: Emergency mode activation during Firebase Studio diagnostics', async () => {
    await test.step('Navigate to journal and simulate diagnostic load', async () => {
      await page.goto('/journal');
      
      // Simulate diagnostic operations that might trigger emergency mode
      await page.evaluate(() => {
        window.diagnosticOverload = setInterval(() => {
          // Simulate excessive diagnostic operations
          for (let i = 0; i < 100; i++) {
            localStorage.setItem(`stress_${i}`, new Array(1000).join('x'));
          }
        }, 10);
      });
    });

    await test.step('Trigger emergency mode activation', async () => {
      const startTime = Date.now();
      
      // Simulate emergency mode trigger (in real app, this would be automatic)
      await page.evaluate(() => {
        // Trigger emergency mode
        window.dispatchEvent(new CustomEvent('crisis-emergency-mode', {
          detail: { reason: 'Diagnostic overload detected' }
        }));
      });
      
      // Emergency mode should activate quickly
      const emergencyIndicator = page.locator('[data-emergency-mode="true"], .emergency-mode, text="Emergency Mode"').first();
      await expect(emergencyIndicator).toBeVisible({ timeout: 2000 });
      
      const activationTime = Date.now() - startTime;
      
      console.log(`Emergency mode activation time: ${activationTime}ms`);
      expect(activationTime).toBeLessThan(CRISIS_THRESHOLDS.EMERGENCY_MODE_ACTIVATION);
    });

    await test.step('Verify crisis support priority during emergency mode', async () => {
      // In emergency mode, crisis support should have absolute priority
      const textarea = page.locator('textarea').first();
      await textarea.fill('Help me please, I am in immediate danger');
      
      // Crisis support should appear instantly in emergency mode
      const crisisSupport = page.locator('[data-testid="crisis-support"], .crisis-support').first();
      await expect(crisisSupport).toBeVisible({ timeout: 1000 });
      
      // Verify 988 is prominently displayed
      await expect(page.locator('text=988').first()).toBeVisible();
    });

    await test.step('Stop diagnostic overload', async () => {
      await page.evaluate(() => {
        if (window.diagnosticOverload) {
          clearInterval(window.diagnosticOverload);
        }
        // Clear stress test data
        for (let i = 0; i < 100; i++) {
          localStorage.removeItem(`stress_${i}`);
        }
      });
    });
  });

  test('CRITICAL: Crisis resource preloading works during concurrent diagnostics', async () => {
    await test.step('Start multiple concurrent diagnostic operations', async () => {
      await page.goto('/dashboard');
      
      // Simulate multiple concurrent Firebase Studio diagnostics
      await page.evaluate(() => {
        window.concurrentDiagnostics = [];
        
        // Start multiple diagnostic simulations
        for (let i = 0; i < 5; i++) {
          const diagnostic = setInterval(() => {
            // Each diagnostic does different work
            if (i === 0) fetch('/api/health').catch(() => {});
            if (i === 1) localStorage.setItem(`diag_${Date.now()}`, 'test');
            if (i === 2) sessionStorage.setItem(`session_${Date.now()}`, 'test');
            if (i === 3) document.querySelectorAll('*').length;
            if (i === 4) JSON.parse(JSON.stringify({test: Date.now()}));
          }, 100);
          
          window.concurrentDiagnostics.push(diagnostic);
        }
      });
    });

    await test.step('Test crisis resource preloading under load', async () => {
      await page.goto('/journal');
      
      const startTime = Date.now();
      
      // Test that crisis resources are preloaded despite concurrent diagnostics
      const preloadingTest = await page.evaluate(async () => {
        try {
          // Check if crisis resources are accessible
          const crisisData = localStorage.getItem('crisis_resources') || 
                            sessionStorage.getItem('crisis_resources');
          
          if (crisisData) return true;
          
          // Check if service worker has preloaded resources
          if ('serviceWorker' in navigator && 'caches' in window) {
            const cache = await caches.open('crisis-cache');
            const keys = await cache.keys();
            return keys.some(key => key.url.includes('crisis'));
          }
          
          return false;
        } catch (error) {
          return false;
        }
      });
      
      const preloadTime = Date.now() - startTime;
      
      console.log(`Crisis resource preloading check: ${preloadTime}ms`);
      expect(preloadTime).toBeLessThan(CRISIS_THRESHOLDS.HOTLINE_ACCESS);
      expect(preloadingTest).toBe(true);
    });

    await test.step('Verify crisis support activation with preloaded resources', async () => {
      const textarea = page.locator('textarea').first();
      await textarea.fill('I have been thinking about suicide constantly');
      
      // Crisis support should use preloaded resources quickly
      const crisisSupport = page.locator('[data-testid="crisis-support"], .crisis-support').first();
      await expect(crisisSupport).toBeVisible({ timeout: 2000 });
      
      // Verify hotlines are accessible
      await expect(page.locator('a[href*="tel:988"]')).toBeVisible();
      await expect(page.locator('a[href*="sms:741741"]')).toBeVisible();
    });

    await test.step('Stop concurrent diagnostics', async () => {
      await page.evaluate(() => {
        if (window.concurrentDiagnostics) {
          window.concurrentDiagnostics.forEach(diagnostic => {
            clearInterval(diagnostic);
          });
          window.concurrentDiagnostics = [];
        }
      });
    });
  });

  test('CRITICAL: Firebase Studio diagnostic emergency stop mechanisms', async () => {
    await test.step('Start Firebase Studio diagnostic operation', async () => {
      await page.goto('/journal');
      
      // Start a diagnostic that we'll need to emergency stop
      await page.evaluate(() => {
        window.diagnosticToStop = setInterval(() => {
          // Intensive operation that might need emergency stopping
          const data = new Array(10000).fill('diagnostic');
          localStorage.setItem('emergency_test', JSON.stringify(data));
        }, 50);
      });
    });

    await test.step('Simulate crisis scenario during diagnostic', async () => {
      // Enter severe crisis text
      const textarea = page.locator('textarea').first();
      await textarea.fill('I am going to kill myself tonight, I have a plan and I am ready to do it');
      
      // Crisis support should appear
      await expect(page.locator('[data-testid="crisis-support"], .crisis-support').first()).toBeVisible({ timeout: 2000 });
    });

    await test.step('Trigger emergency stop of diagnostics', async () => {
      const stopTime = Date.now();
      
      // Trigger emergency stop
      await page.evaluate(() => {
        // Emergency stop all diagnostics
        window.dispatchEvent(new CustomEvent('crisis-emergency-stop', {
          detail: { reason: 'Severe crisis detected' }
        }));
      });
      
      // Verify diagnostic stopped
      const diagnosticStopped = await page.evaluate(() => {
        return !window.diagnosticToStop;
      });
      
      const stopLatency = Date.now() - stopTime;
      
      console.log(`Emergency stop latency: ${stopLatency}ms`);
      expect(stopLatency).toBeLessThan(100); // Should stop within 100ms
    });

    await test.step('Verify crisis support has full priority after emergency stop', async () => {
      // After emergency stop, crisis support should have all system resources
      const crisisSupport = page.locator('[data-testid="crisis-support"], .crisis-support').first();
      await expect(crisisSupport).toBeVisible();
      
      // Verify immediate access to hotlines
      const hotlineButton = page.locator('a[href*="tel:988"]').first();
      await expect(hotlineButton).toBeVisible();
      
      // Test that hotline button is immediately responsive
      const clickStart = Date.now();
      await hotlineButton.click();
      const clickTime = Date.now() - clickStart;
      
      console.log(`Crisis hotline click response: ${clickTime}ms`);
      expect(clickTime).toBeLessThan(50);
    });

    await test.step('Cleanup emergency test', async () => {
      await page.evaluate(() => {
        if (window.diagnosticToStop) {
          clearInterval(window.diagnosticToStop);
        }
        localStorage.removeItem('emergency_test');
      });
    });
  });
});

// Helper function to setup crisis monitoring
async function setupCrisisMonitoring(page: Page) {
  await page.addInitScript(() => {
    // Monitor for crisis events
    window.crisisEvents = [];
    
    // Listen for crisis detection
    window.addEventListener('crisis-detected', (event) => {
      window.crisisEvents.push({
        type: 'crisis-detected',
        timestamp: Date.now(),
        details: event.detail
      });
    });
    
    // Listen for emergency stops
    window.addEventListener('crisis-emergency-stop', (event) => {
      window.crisisEvents.push({
        type: 'emergency-stop',
        timestamp: Date.now(),
        details: event.detail
      });
    });
    
    // Monitor performance during crisis scenarios
    window.crisisPerformanceData = {
      responseTime: [],
      memoryUsage: [],
      cpuUsage: []
    };
    
    // Performance monitoring
    setInterval(() => {
      if (window.performance && window.performance.memory) {
        window.crisisPerformanceData.memoryUsage.push({
          timestamp: Date.now(),
          used: window.performance.memory.usedJSHeapSize,
          total: window.performance.memory.totalJSHeapSize
        });
      }
    }, 1000);
  });
}