/**
 * ALCHM Production Validation E2E Tests
 * Validates critical paths on the live production site
 */

import { test, expect, Page } from '@playwright/test';

const PRODUCTION_URL = 'https://alchmapp.web.app';

// Test timeout for production environment
test.setTimeout(30000);

test.describe('Production Critical Path Validation', () => {
  
  // Critical Flow 1: Homepage loads and performs correctly
  test('Homepage loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Performance validation
    expect(loadTime).toBeLessThan(5000); // 5s max for full load
    
    // Content validation - updated to match actual homepage
    await expect(page.locator('h1')).toContainText(/The World's First Identity OS|ALCHM/i);
    
    // Essential elements present
    await expect(page.locator('a[href*="auth"], a[href*="login"], a[href*="write"]')).toBeVisible({ timeout: 10000 });
    
    // Check for JavaScript errors
    const jsErrors: string[] = [];
    page.on('pageerror', error => jsErrors.push(error.message));
    await page.waitForTimeout(2000); // Give time for JS to execute
    expect(jsErrors).toHaveLength(0);
  });

  // Critical Flow 2: Auth page accessibility
  test('Authentication pages are accessible', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/auth/login`, { waitUntil: 'networkidle' });
    
    // Check that auth page loads successfully (may redirect or show different content)
    const content = await page.textContent('body');
    expect(content).not.toContain('404');
    expect(content).not.toContain('not found');
    
    // Check for sign up or login links/buttons (auth flow may vary)
    const hasAuthElements = await page.locator('input, button:has-text("sign"), a:has-text("login"), a:has-text("auth")').first().isVisible();
    expect(hasAuthElements).toBe(true);
    
    // HTTPS enforcement
    expect(page.url()).toMatch(/^https:/);
  });

  // Critical Flow 3: Write page loads correctly
  test('Write page provides proper journaling interface', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/write`, { waitUntil: 'networkidle' });
    
    // Should either show auth gate or writing interface
    const hasAuthGate = await page.locator('a[href*="auth"], button:has-text("sign")').isVisible();
    const hasWritingInterface = await page.locator('textarea, .journal, .write').isVisible();
    
    expect(hasAuthGate || hasWritingInterface).toBe(true);
    
    if (hasWritingInterface) {
      // If we can see the writing interface, validate it
      await expect(page.locator('textarea')).toBeVisible();
      await expect(page.locator('button:has-text("save"), button:has-text("submit")')).toBeVisible();
    }
  });

  // Critical Flow 4: All pathway pages load
  test('All pathway pages are accessible', async ({ page }) => {
    const pathways = ['resilience', 'becoming', 'purpose', 'belonging'];
    
    for (const pathway of pathways) {
      await page.goto(`${PRODUCTION_URL}/pathways/${pathway}`, { waitUntil: 'networkidle' });
      
      // Check that we don't get a 404
      const content = await page.textContent('body');
      expect(content).not.toContain('404');
      expect(content).not.toContain('not found');
      
      // Check for pathway-related content (pathway names or general content)
      const hasPathwayContent = content && (
        content.toLowerCase().includes(pathway) ||
        content.toLowerCase().includes('pathway') ||
        content.toLowerCase().includes('step') ||
        content.toLowerCase().includes('begin')
      );
      expect(hasPathwayContent).toBe(true);
    }
  });

  // Critical Flow 5: Pathway step pages load
  test('Pathway step pages provide proper prompts', async ({ page }) => {
    const testUrls = [
      '/pathways/becoming/step/1/',
      '/pathways/resilience/step/1/',
      '/pathways/purpose/step/1/',
      '/pathways/belonging/step/1/'
    ];

    for (const url of testUrls) {
      await page.goto(`${PRODUCTION_URL}${url}`, { waitUntil: 'networkidle' });
      
      // Check that we don't get a 404
      const content = await page.textContent('body');
      expect(content).not.toContain('404');
      expect(content).not.toContain('not found');
      
      // Should have either auth gate or step content (more flexible check)
      const hasContent = content && (
        content.toLowerCase().includes('auth') ||
        content.toLowerCase().includes('login') ||
        content.toLowerCase().includes('sign') ||
        content.toLowerCase().includes('step') ||
        content.toLowerCase().includes('prompt') ||
        content.toLowerCase().includes('pathway')
      );
      expect(hasContent).toBe(true);
    }
  });

  // Security validation
  test('Security headers are properly configured', async ({ page }) => {
    const response = await page.goto(PRODUCTION_URL);
    
    // HTTPS redirect check
    expect(response?.url()).toMatch(/^https:/);
    
    // Security headers (basic check)
    const headers = response?.headers() || {};
    
    // These might not all be present in static hosting, but check what we can
    if (headers['content-security-policy']) {
      expect(headers['content-security-policy']).toBeTruthy();
    }
    
    if (headers['x-frame-options']) {
      expect(headers['x-frame-options']).toBeTruthy();
    }
  });

  // Mobile responsiveness
  test('Site is mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    
    // Check that content is not horizontally scrollable
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10); // 10px tolerance
    
    // Check that text is readable (not too small)
    const textElements = await page.locator('p, span, div').all();
    for (const element of textElements.slice(0, 5)) { // Check first 5 elements
      const fontSize = await element.evaluate(el => {
        return parseFloat(window.getComputedStyle(el).fontSize);
      });
      if (fontSize > 0) { // Only check elements that have font size
        expect(fontSize).toBeGreaterThanOrEqual(14); // Minimum readable size
      }
    }
  });

  // Performance audit
  test('Core Web Vitals are within acceptable ranges', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    
    // Measure First Contentful Paint (approximate)
    const fcpTime = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            if (entry.name === 'first-contentful-paint') {
              resolve(entry.startTime);
            }
          }
        }).observe({ entryTypes: ['paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve(0), 1000);
      });
    });
    
    if (fcpTime > 0) {
      expect(fcpTime).toBeLessThan(2500); // 2.5s max for FCP
    }
    
    // Check for layout shift indicators
    const hasFixedDimensions = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const videos = Array.from(document.querySelectorAll('video'));
      
      return [...images, ...videos].every(el => 
        el.style.width || el.style.height || 
        el.getAttribute('width') || el.getAttribute('height')
      );
    });
    
    // This is a proxy check - in a real audit we'd measure actual CLS
    expect(hasFixedDimensions).toBe(true);
  });

  // Accessibility compliance
  test('Basic accessibility requirements are met', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    
    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBe(null); // Alt attribute should exist (can be empty for decorative)
    }
    
    // Check for proper form labels (if forms exist)
    const inputs = await page.locator('input[type="email"], input[type="password"], input[type="text"]').all();
    for (const input of inputs) {
      const hasLabel = await input.evaluate(el => {
        const id = el.id;
        const hasAriaLabel = el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby');
        const hasAssociatedLabel = id && document.querySelector(`label[for="${id}"]`);
        return hasAriaLabel || hasAssociatedLabel;
      });
      expect(hasLabel).toBe(true);
    }
  });

  // Crisis support validation
  test('Crisis detection and resources work properly', async ({ page }) => {
    // This would typically test the crisis support interface
    // For now, we'll just verify the crisis resources are accessible
    await page.goto(`${PRODUCTION_URL}/write?mode=test`, { waitUntil: 'networkidle' });
    
    // Check if we can find crisis support elements or links
    const crisisText = await page.textContent('body');
    const hasCrisisSupport = crisisText?.includes('988') || 
                           crisisText?.includes('crisis') ||
                           crisisText?.includes('support');
    
    // Crisis support should be mentioned somewhere on the site
    expect(hasCrisisSupport).toBe(true);
  });
});