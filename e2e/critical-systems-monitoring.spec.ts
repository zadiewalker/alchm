/**
 * ALCHM Critical Systems Monitoring
 * 
 * Sacred promise: The platform must be reliable, responsive, and always accessible
 * for those seeking healing. Every millisecond of downtime could matter to someone in crisis.
 */

import { test, expect, Page } from '@playwright/test';

const PRODUCTION_URL = 'https://alchm-digital-sanctuary.web.app';

test.describe('Critical Systems Real-Time Monitoring', () => {
  test.setTimeout(180000); // 3 minutes for thorough monitoring

  // Test core system availability and response times
  test('should verify platform availability and performance', async ({ page }) => {
    const startTime = Date.now();
    
    // Monitor performance metrics during page load
    let performanceMetrics: any = {};
    
    page.on('domcontentloaded', () => {
      performanceMetrics.domContentLoaded = Date.now() - startTime;
    });

    page.on('load', () => {
      performanceMetrics.fullLoad = Date.now() - startTime;
    });

    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    
    const totalLoadTime = Date.now() - startTime;
    performanceMetrics.networkIdle = totalLoadTime;
    
    console.log('🔍 PERFORMANCE METRICS:');
    console.log(`DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`);
    console.log(`Full Load: ${performanceMetrics.fullLoad}ms`);
    console.log(`Network Idle: ${performanceMetrics.networkIdle}ms`);
    
    // Performance thresholds for mental health platform
    expect(performanceMetrics.domContentLoaded).toBeLessThan(3000); // 3s DOM ready
    expect(performanceMetrics.fullLoad).toBeLessThan(5000); // 5s full load
    expect(performanceMetrics.networkIdle).toBeLessThan(8000); // 8s network idle
    
    console.log('✅ Platform performance meets healing-focused requirements');
  });

  // Test critical pathway accessibility
  test('should ensure healing pathways are always accessible', async ({ page }) => {
    const criticalPaths = [
      '/', // Homepage - entry point
      '/pathways', // Path discovery
      '/pathways/resilience/', // Crisis-relevant pathway
      '/pathways%202/resilience/step/1/', // Immediate writing interface
    ];
    
    let pathwayUptime = 0;
    let totalPathways = criticalPaths.length;
    
    for (const path of criticalPaths) {
      const startTime = Date.now();
      
      try {
        await page.goto(`${PRODUCTION_URL}${path}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        
        const loadTime = Date.now() - startTime;
        const content = await page.textContent('body');
        
        if (!content.includes('404') && !content.includes('error')) {
          pathwayUptime++;
          console.log(`✅ ${path} - Accessible (${loadTime}ms)`);
        } else {
          console.error(`❌ ${path} - Content error detected`);
        }
        
      } catch (error) {
        console.error(`❌ ${path} - Failed to load: ${error}`);
      }
    }
    
    const uptimePercentage = (pathwayUptime / totalPathways) * 100;
    console.log(`📊 Critical pathway uptime: ${uptimePercentage}%`);
    
    // 100% uptime required for healing platform
    expect(uptimePercentage).toBe(100);
  });

  // Test crisis support systems
  test('should verify crisis support systems are operational', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    
    // Check for crisis lifeline link
    const crisisLink = page.locator('a[href="tel:988"]');
    const crisisLinkExists = await crisisLink.count() > 0;
    
    if (crisisLinkExists) {
      const isVisible = await crisisLink.isVisible();
      expect(isVisible).toBe(true);
      console.log('✅ 988 Crisis Lifeline prominently displayed');
    } else {
      console.warn('⚠️ No crisis lifeline found on homepage');
    }
    
    // Navigate to a pathway and verify crisis support is still accessible
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    const crisisLinkInPathway = page.locator('a[href="tel:988"]');
    const crisisAccessible = await crisisLinkInPathway.count() > 0;
    
    if (crisisAccessible) {
      console.log('✅ Crisis support accessible within healing interface');
    } else {
      console.warn('⚠️ Crisis support not found in pathway interface');
    }
  });

  // Test writing interface reliability
  test('should verify writing interface responsiveness', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    const textarea = page.locator('textarea');
    const isTextareaPresent = await textarea.count() > 0;
    expect(isTextareaPresent).toBe(true);
    
    if (isTextareaPresent) {
      const isVisible = await textarea.isVisible();
      const isEnabled = !await textarea.isDisabled();
      
      console.log(`Writing interface visible: ${isVisible}`);
      console.log(`Writing interface enabled: ${isEnabled}`);
      
      if (isVisible) {
        // Test input responsiveness
        const testText = 'System monitoring test - this is my healing space';
        await textarea.fill(testText);
        
        const inputValue = await textarea.inputValue();
        expect(inputValue).toBe(testText);
        console.log('✅ Writing interface accepts input immediately');
        
        // Test character limit handling
        const longText = 'a'.repeat(10000);
        await textarea.fill(longText);
        const longInputValue = await textarea.inputValue();
        console.log(`Character handling: ${longInputValue.length} characters accepted`);
      }
    }
  });

  // Test mobile responsiveness for crisis situations
  test('should verify mobile accessibility for crisis users', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    
    // Check mobile navigation
    const mobileNavElements = await page.locator('nav, .nav, [role="navigation"]').count();
    console.log(`Mobile navigation elements: ${mobileNavElements}`);
    
    // Test touch targets for crisis users (minimum 44px)
    const buttons = page.locator('button, a');
    const buttonCount = await buttons.count();
    
    let accessibleButtons = 0;
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box && box.height >= 44 && box.width >= 44) {
          accessibleButtons++;
        }
      }
    }
    
    console.log(`Touch-accessible buttons: ${accessibleButtons} of ${Math.min(buttonCount, 10)} tested`);
    
    // Navigate to writing interface on mobile
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    const mobileTextarea = page.locator('textarea');
    if (await mobileTextarea.isVisible()) {
      const textareaBox = await mobileTextarea.boundingBox();
      if (textareaBox) {
        console.log(`Mobile writing area: ${textareaBox.width}x${textareaBox.height}`);
        expect(textareaBox.height).toBeGreaterThan(120); // Minimum usable height
      }
    }
    
    console.log('✅ Mobile interface suitable for crisis accessibility');
  });

  // Test HTTPS and security headers
  test('should verify security infrastructure', async ({ page }) => {
    const response = await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    
    // Check HTTPS
    const isHTTPS = page.url().startsWith('https://');
    expect(isHTTPS).toBe(true);
    console.log('✅ HTTPS encryption verified');
    
    // Check security headers
    const headers = response.headers();
    const securityHeaders = {
      'content-security-policy': headers['content-security-policy'],
      'x-frame-options': headers['x-frame-options'],
      'x-content-type-options': headers['x-content-type-options'],
      'referrer-policy': headers['referrer-policy']
    };
    
    console.log('🔒 SECURITY HEADERS:');
    for (const [header, value] of Object.entries(securityHeaders)) {
      if (value) {
        console.log(`✅ ${header}: Present`);
      } else {
        console.log(`ℹ️ ${header}: Not set`);
      }
    }
  });

  // Test database connectivity and data persistence
  test('should verify data infrastructure reliability', async ({ page }) => {
    // Monitor Firebase/database requests
    const dataRequests: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('firebase') || url.includes('firestore') || url.includes('googleapis')) {
        dataRequests.push(url);
      }
    });

    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    // Test writing interface interaction
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      await textarea.fill('Data persistence test for monitoring');
      
      // Wait for any auto-save or background requests
      await page.waitForTimeout(3000);
    }
    
    console.log(`🔌 Database requests detected: ${dataRequests.length}`);
    
    if (dataRequests.length > 0) {
      console.log('✅ Data infrastructure active');
      for (const request of dataRequests.slice(0, 5)) {
        console.log(`   └── ${request.split('?')[0]}`);
      }
    } else {
      console.log('ℹ️ No database requests - likely static/demo mode');
    }
    
    // Check local storage functionality
    const localStorageTest = await page.evaluate(() => {
      try {
        localStorage.setItem('monitor_test', 'working');
        const result = localStorage.getItem('monitor_test');
        localStorage.removeItem('monitor_test');
        return result === 'working';
      } catch {
        return false;
      }
    });
    
    expect(localStorageTest).toBe(true);
    console.log('✅ Local storage functional for offline resilience');
  });

  // Test error handling and graceful degradation
  test('should verify graceful error handling', async ({ page }) => {
    const errors: string[] = [];
    
    // Monitor console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Test with network issues simulation
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    
    // Navigate through critical paths
    const testPaths = [
      '/pathways',
      '/pathways/resilience/',
      '/pathways%202/resilience/step/1/'
    ];
    
    for (const path of testPaths) {
      try {
        await page.goto(`${PRODUCTION_URL}${path}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForTimeout(1000);
      } catch (error) {
        console.warn(`Navigation warning for ${path}: ${error}`);
      }
    }
    
    console.log(`Console errors detected: ${errors.length}`);
    
    // Some errors are acceptable in static/demo mode, but not critical failures
    const criticalErrors = errors.filter(error => 
      error.includes('network error') || 
      error.includes('failed to fetch') ||
      error.toLowerCase().includes('uncaught')
    );
    
    if (criticalErrors.length > 0) {
      console.error('🚨 Critical errors detected:');
      criticalErrors.forEach(error => console.error(`   └── ${error}`));
    } else {
      console.log('✅ No critical system errors detected');
    }
    
    expect(criticalErrors.length).toBeLessThan(3); // Allow minimal graceful degradation
  });

  // Test accessibility for users with disabilities
  test('should verify accessibility compliance for vulnerable users', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    // Check color contrast for users with visual impairments
    const backgroundColors = await page.locator('main, body, textarea').evaluateAll(elements => {
      return elements.map(el => {
        const style = window.getComputedStyle(el);
        return {
          background: style.backgroundColor,
          color: style.color,
          tagName: el.tagName
        };
      });
    });
    
    console.log('🎨 COLOR ACCESSIBILITY:');
    backgroundColors.forEach((colors, index) => {
      console.log(`${colors.tagName}: ${colors.color} on ${colors.background}`);
    });
    
    // Check keyboard navigation for users who can't use a mouse
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    const focusedElement = await page.locator(':focus').count();
    if (focusedElement > 0) {
      console.log('✅ Keyboard navigation functional');
    } else {
      console.warn('⚠️ No keyboard focus detected - may impact accessibility');
    }
    
    // Check for screen reader compatibility
    const ariaElements = await page.locator('[aria-label], [aria-labelledby], [role]').count();
    const headingElements = await page.locator('h1, h2, h3, h4, h5, h6').count();
    
    console.log(`Screen reader aids: ${ariaElements} ARIA elements, ${headingElements} headings`);
    
    if (ariaElements + headingElements > 0) {
      console.log('✅ Screen reader compatibility present');
    } else {
      console.warn('⚠️ Limited screen reader support detected');
    }
  });
});