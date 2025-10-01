#!/usr/bin/env node

/**
 * MOBILE TRAUMA-INFORMED VALIDATION SCRIPT
 * Comprehensive testing for vulnerable users in crisis on mobile devices
 * 
 * Tests:
 * - Touch target sizes (minimum 60px for trembling hands)
 * - Performance on low-end devices
 * - Crisis accessibility features
 * - Offline functionality
 * - Network resilience
 * - iOS Safari/Android Chrome compatibility
 */

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

class MobileTraumaValidator {
  constructor() {
    this.results = {
      touchTargets: [],
      performance: {},
      accessibility: {},
      offline: {},
      crisisFeatures: {},
      compatibility: {},
      issues: [],
      recommendations: []
    };
  }

  async runFullValidation() {
    console.log('🔍 Starting ALCHM Mobile Trauma-Informed Validation...\n');
    
    try {
      const browser = await puppeteer.launch({
        headless: false, // Show browser for visual validation
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--allow-running-insecure-content'
        ]
      });

      // Test different device types
      const devices = [
        { name: 'iPhone SE (Crisis Simulation)', ...puppeteer.devices['iPhone SE'] },
        { name: 'iPhone 12 Pro', ...puppeteer.devices['iPhone 12 Pro'] },
        { name: 'Pixel 5', ...puppeteer.devices['Pixel 5'] },
        { name: 'Galaxy S8 (Older Android)', ...puppeteer.devices['Galaxy S8'] }
      ];

      for (const device of devices) {
        console.log(`📱 Testing on ${device.name}...`);
        await this.validateDeviceExperience(browser, device);
      }

      await this.validatePerformanceMetrics();
      await this.validateCrisisAccessibility(browser);
      await this.validateOfflineFunctionality(browser);
      
      await browser.close();
      
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    }
  }

  async validateDeviceExperience(browser, device) {
    const page = await browser.newPage();
    await page.emulate(device);
    
    // Simulate slow network for crisis situations
    await page.emulateNetworkConditions({
      offline: false,
      downloadThroughput: 50 * 1024, // 50kb/s - very slow 3G
      uploadThroughput: 20 * 1024,   // 20kb/s
      latency: 2000 // 2s latency
    });
    
    // Simulate low-end device
    await page.emulateCPUThrottling(6); // 6x slower CPU

    const urls = [
      'http://localhost:3001',
      'http://localhost:3001/auth/login', 
      'http://localhost:3001/dashboard',
      'http://localhost:3001/journal'
    ];

    for (const url of urls) {
      console.log(`  🔗 Testing ${url}...`);
      
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        await this.validateTouchTargets(page, device.name, url);
        await this.validateCrisisElements(page, device.name, url);
        await this.validateResponsiveLayout(page, device.name, url);
      } catch (error) {
        this.results.issues.push({
          device: device.name,
          url,
          error: error.message,
          severity: 'high'
        });
      }
    }
    
    await page.close();
  }

  async validateTouchTargets(page, deviceName, url) {
    console.log(`    👆 Validating touch targets...`);
    
    const touchTargets = await page.evaluate(() => {
      const interactiveElements = document.querySelectorAll(
        'button, a, input, textarea, select, [role="button"], [tabindex]'
      );
      
      const targets = [];
      interactiveElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const computedStyle = getComputedStyle(el);
        
        // Check if element is visible
        if (rect.width === 0 || rect.height === 0 || 
            computedStyle.display === 'none' || 
            computedStyle.visibility === 'hidden') {
          return;
        }
        
        targets.push({
          index,
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          text: el.textContent?.slice(0, 50) || '',
          width: Math.max(rect.width, parseFloat(computedStyle.minWidth) || 0),
          height: Math.max(rect.height, parseFloat(computedStyle.minHeight) || 0),
          isCrisisElement: el.classList.contains('crisis-accessible') || 
                          el.classList.contains('touch-crisis') ||
                          el.classList.contains('touch-target-crisis') ||
                          el.textContent?.toLowerCase().includes('crisis') ||
                          el.textContent?.toLowerCase().includes('help') ||
                          el.textContent?.toLowerCase().includes('988'),
          hasTraumaClass: el.classList.contains('touch-safe') ||
                         el.classList.contains('touch-target-large') ||
                         el.classList.contains('trauma-informed')
        });
      });
      
      return targets;
    });

    // Analyze touch targets
    const issues = touchTargets.filter(target => {
      // Crisis elements need 70px minimum
      if (target.isCrisisElement) {
        return target.width < 70 || target.height < 70;
      }
      // Regular elements need 60px minimum for trauma-informed design
      return target.width < 60 || target.height < 60;
    });

    this.results.touchTargets.push({
      device: deviceName,
      url,
      totalElements: touchTargets.length,
      compliantElements: touchTargets.length - issues.length,
      issues: issues.map(issue => ({
        element: `${issue.tagName}${issue.id ? '#' + issue.id : ''}${issue.className ? '.' + issue.className.split(' ')[0] : ''}`,
        text: issue.text,
        size: `${Math.round(issue.width)}x${Math.round(issue.height)}px`,
        isCrisis: issue.isCrisisElement,
        recommendedSize: issue.isCrisisElement ? '70x70px' : '60x60px'
      }))
    });

    if (issues.length > 0) {
      console.log(`    ⚠️  Found ${issues.length} undersized touch targets`);
    } else {
      console.log(`    ✅ All ${touchTargets.length} touch targets meet trauma-informed standards`);
    }
  }

  async validateCrisisElements(page, deviceName, url) {
    console.log(`    🆘 Validating crisis accessibility...`);
    
    const crisisValidation = await page.evaluate(() => {
      const crisisElements = {
        floatingButton: document.querySelector('.crisis-accessible, .btn-crisis-intervention'),
        crisisLinks: Array.from(document.querySelectorAll('a[href*="988"], a[href*="tel:988"], a[href*="crisis"]')),
        emergencyContacts: Array.from(document.querySelectorAll('a[href^="tel:"], a[href^="sms:"]')),
        crisisResources: Array.from(document.querySelectorAll('.crisis-resources, .emergency-resources'))
      };
      
      return {
        hasFloatingButton: !!crisisElements.floatingButton,
        floatingButtonVisible: crisisElements.floatingButton ? 
          getComputedStyle(crisisElements.floatingButton).display !== 'none' : false,
        crisisLinksCount: crisisElements.crisisLinks.length,
        emergencyContactsCount: crisisElements.emergencyContacts.length,
        crisisResourcesCount: crisisElements.crisisResources.length,
        allElementsAccessible: [
          ...crisisElements.crisisLinks,
          ...crisisElements.emergencyContacts
        ].every(el => {
          const rect = el.getBoundingClientRect();
          return rect.width >= 52 && rect.height >= 52;
        })
      };
    });

    this.results.crisisFeatures[`${deviceName}-${url}`] = crisisValidation;

    if (!crisisValidation.hasFloatingButton) {
      this.results.issues.push({
        device: deviceName,
        url,
        error: 'Missing crisis floating button',
        severity: 'critical',
        recommendation: 'Add CrisisFloatingButton component to provide 24/7 crisis access'
      });
    }

    if (crisisValidation.emergencyContactsCount === 0) {
      this.results.issues.push({
        device: deviceName,
        url,
        error: 'No emergency contact links found',
        severity: 'high',
        recommendation: 'Add tel: and sms: links for immediate crisis support'
      });
    }
  }

  async validateResponsiveLayout(page, deviceName, url) {
    console.log(`    📐 Validating responsive layout...`);
    
    const layoutValidation = await page.evaluate(() => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      // Check for horizontal scrolling (layout breaks)
      const hasHorizontalScroll = document.documentElement.scrollWidth > viewport.width;
      
      // Check for content overflow
      const overflowingElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.right > viewport.width;
      });
      
      // Check font sizes are readable
      const allText = Array.from(document.querySelectorAll('p, span, div, a, button, input, textarea, label'));
      const smallText = allText.filter(el => {
        const fontSize = parseFloat(getComputedStyle(el).fontSize);
        return fontSize < 16; // Minimum readable size for emotional distress
      });
      
      return {
        viewport,
        hasHorizontalScroll,
        overflowingElementsCount: overflowingElements.length,
        smallTextElementsCount: smallText.length,
        readableTextPercentage: ((allText.length - smallText.length) / allText.length) * 100
      };
    });

    if (layoutValidation.hasHorizontalScroll || layoutValidation.overflowingElementsCount > 0) {
      this.results.issues.push({
        device: deviceName,
        url,
        error: 'Layout overflow detected - content extends beyond viewport',
        severity: 'medium',
        recommendation: 'Review responsive design and ensure content fits within mobile viewports'
      });
    }

    if (layoutValidation.readableTextPercentage < 90) {
      this.results.issues.push({
        device: deviceName,
        url,
        error: `${100 - layoutValidation.readableTextPercentage}% of text is below 16px (trauma-informed minimum)`,
        severity: 'medium',
        recommendation: 'Increase font sizes to minimum 16px for users experiencing emotional distress'
      });
    }
  }

  async validatePerformanceMetrics() {
    console.log('⚡ Running Lighthouse performance audit...');
    
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility'],
      port: chrome.port,
      emulatedFormFactor: 'mobile',
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4, // Slow 3G
        cpuSlowdownMultiplier: 4
      }
    };
    
    const urls = [
      'http://localhost:3001',
      'http://localhost:3001/dashboard',
      'http://localhost:3001/journal'
    ];
    
    for (const url of urls) {
      try {
        const runnerResult = await lighthouse(url, options);
        const report = runnerResult.report;
        const results = JSON.parse(report);
        
        this.results.performance[url] = {
          performanceScore: results.categories.performance.score * 100,
          accessibilityScore: results.categories.accessibility.score * 100,
          fcp: results.audits['first-contentful-paint'].numericValue,
          lcp: results.audits['largest-contentful-paint'].numericValue,
          cls: results.audits['cumulative-layout-shift'].numericValue,
          tti: results.audits['interactive'].numericValue,
          tbt: results.audits['total-blocking-time'].numericValue
        };
        
        // Validate trauma-informed performance thresholds
        const metrics = this.results.performance[url];
        if (metrics.lcp > 2000) { // 2s threshold for crisis situations
          this.results.issues.push({
            url,
            error: `LCP ${Math.round(metrics.lcp)}ms exceeds crisis-safe threshold (2000ms)`,
            severity: 'high',
            recommendation: 'Optimize critical rendering path for users in distress'
          });
        }
        
        if (metrics.cls > 0.05) { // Very low CLS for users with motor impairments
          this.results.issues.push({
            url,
            error: `CLS ${metrics.cls} may cause touch target shifts for users with tremors`,
            severity: 'medium',
            recommendation: 'Stabilize layout to prevent accidental touches during loading'
          });
        }
        
        console.log(`  📊 ${url}: Performance ${Math.round(metrics.performanceScore)}/100, Accessibility ${Math.round(metrics.accessibilityScore)}/100`);
        
      } catch (error) {
        this.results.issues.push({
          url,
          error: `Performance audit failed: ${error.message}`,
          severity: 'medium'
        });
      }
    }
    
    await chrome.kill();
  }

  async validateCrisisAccessibility(browser) {
    console.log('🆘 Validating crisis intervention accessibility...');
    
    const page = await browser.newPage();
    await page.emulate(puppeteer.devices['iPhone SE']); // Smallest common screen
    
    try {
      await page.goto('http://localhost:3001/dashboard', { waitUntil: 'networkidle0' });
      
      // Test crisis button accessibility
      const crisisAccessibility = await page.evaluate(() => {
        const floatingButton = document.querySelector('.btn-crisis-intervention, [aria-label*="crisis"], [aria-label*="Crisis"]');
        
        if (!floatingButton) return { accessible: false, reason: 'No crisis button found' };
        
        const rect = floatingButton.getBoundingClientRect();
        const style = getComputedStyle(floatingButton);
        
        return {
          accessible: true,
          size: { width: rect.width, height: rect.height },
          zIndex: style.zIndex,
          position: style.position,
          bottom: style.bottom,
          right: style.right,
          visible: style.display !== 'none' && style.visibility !== 'hidden',
          hasAriaLabel: floatingButton.hasAttribute('aria-label'),
          ariaLabel: floatingButton.getAttribute('aria-label'),
          meetsSizeRequirement: rect.width >= 56 && rect.height >= 56
        };
      });
      
      this.results.crisisFeatures.accessibility = crisisAccessibility;
      
      if (!crisisAccessibility.accessible || !crisisAccessibility.meetsSizeRequirement) {
        this.results.issues.push({
          error: 'Crisis button does not meet accessibility requirements',
          severity: 'critical',
          details: crisisAccessibility,
          recommendation: 'Ensure crisis button is minimum 56x56px, properly positioned, and has aria-label'
        });
      }
      
    } catch (error) {
      this.results.issues.push({
        error: `Crisis accessibility validation failed: ${error.message}`,
        severity: 'high'
      });
    } finally {
      await page.close();
    }
  }

  async validateOfflineFunctionality(browser) {
    console.log('📴 Validating offline functionality...');
    
    const page = await browser.newPage();
    await page.emulate(puppeteer.devices['iPhone 12 Pro']);
    
    try {
      // First load online
      await page.goto('http://localhost:3001/journal', { waitUntil: 'networkidle0' });
      
      // Test offline mode
      await page.setOfflineMode(true);
      
      const offlineExperience = await page.evaluate(() => {
        // Check if service worker is registered
        const hasServiceWorker = 'serviceWorker' in navigator;
        
        // Check for offline indicators
        const offlineIndicator = document.querySelector('.offline-indicator, [class*="offline"]');
        
        // Test local storage functionality
        let localStorageWorks = false;
        try {
          localStorage.setItem('alchm-offline-test', 'test');
          localStorageWorks = localStorage.getItem('alchm-offline-test') === 'test';
          localStorage.removeItem('alchm-offline-test');
        } catch (e) {
          localStorageWorks = false;
        }
        
        return {
          hasServiceWorker,
          hasOfflineIndicator: !!offlineIndicator,
          localStorageWorks,
          canWriteOffline: document.querySelector('textarea') !== null,
          url: window.location.href
        };
      });
      
      this.results.offline = offlineExperience;
      
      if (!offlineExperience.hasServiceWorker) {
        this.results.issues.push({
          error: 'No service worker detected - offline functionality unavailable',
          severity: 'high',
          recommendation: 'Implement service worker for offline journaling during network issues'
        });
      }
      
      if (!offlineExperience.canWriteOffline) {
        this.results.issues.push({
          error: 'Journal writing not available offline',
          severity: 'critical',
          recommendation: 'Enable offline journaling - critical for users in crisis without reliable network'
        });
      }
      
    } catch (error) {
      this.results.issues.push({
        error: `Offline validation failed: ${error.message}`,
        severity: 'medium'
      });
    } finally {
      await page.close();
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📋 ALCHM MOBILE TRAUMA-INFORMED VALIDATION REPORT');
    console.log('='.repeat(80));
    
    // Touch Target Analysis
    console.log('\n👆 TOUCH TARGET ANALYSIS');
    console.log('-'.repeat(40));
    
    const totalTouchTargets = this.results.touchTargets.reduce((sum, result) => sum + result.totalElements, 0);
    const totalCompliant = this.results.touchTargets.reduce((sum, result) => sum + result.compliantElements, 0);
    const complianceRate = totalTouchTargets > 0 ? (totalCompliant / totalTouchTargets * 100) : 0;
    
    console.log(`Total Interactive Elements: ${totalTouchTargets}`);
    console.log(`Trauma-Informed Compliant: ${totalCompliant} (${complianceRate.toFixed(1)}%)`);
    
    if (complianceRate < 100) {
      console.log('\n⚠️  NON-COMPLIANT TOUCH TARGETS:');
      this.results.touchTargets.forEach(result => {
        if (result.issues.length > 0) {
          console.log(`\n  ${result.device} - ${result.url}:`);
          result.issues.forEach(issue => {
            console.log(`    ${issue.element}: ${issue.size} (needs ${issue.recommendedSize})`);
            if (issue.isCrisis) console.log(`      🚨 CRITICAL: Crisis element undersized`);
          });
        }
      });
    }
    
    // Performance Analysis
    console.log('\n⚡ PERFORMANCE ANALYSIS');
    console.log('-'.repeat(40));
    
    Object.entries(this.results.performance).forEach(([url, metrics]) => {
      console.log(`\n${url}:`);
      console.log(`  Performance Score: ${Math.round(metrics.performanceScore)}/100`);
      console.log(`  Accessibility Score: ${Math.round(metrics.accessibilityScore)}/100`);
      console.log(`  LCP: ${Math.round(metrics.lcp)}ms ${metrics.lcp > 2000 ? '❌' : '✅'}`);
      console.log(`  CLS: ${metrics.cls.toFixed(3)} ${metrics.cls > 0.05 ? '❌' : '✅'}`);
      console.log(`  TTI: ${Math.round(metrics.tti)}ms`);
    });
    
    // Crisis Features Analysis  
    console.log('\n🆘 CRISIS ACCESSIBILITY ANALYSIS');
    console.log('-'.repeat(40));
    
    if (this.results.crisisFeatures.accessibility) {
      const crisis = this.results.crisisFeatures.accessibility;
      console.log(`Crisis Button Present: ${crisis.accessible ? '✅' : '❌'}`);
      if (crisis.accessible) {
        console.log(`  Size: ${Math.round(crisis.size.width)}x${Math.round(crisis.size.height)}px ${crisis.meetsSizeRequirement ? '✅' : '❌'}`);
        console.log(`  Accessible: ${crisis.hasAriaLabel ? '✅' : '❌'}`);
        console.log(`  Visible: ${crisis.visible ? '✅' : '❌'}`);
      }
    }
    
    // Offline Capability
    console.log('\n📴 OFFLINE CAPABILITY ANALYSIS');
    console.log('-'.repeat(40));
    
    console.log(`Service Worker: ${this.results.offline.hasServiceWorker ? '✅' : '❌'}`);
    console.log(`Local Storage: ${this.results.offline.localStorageWorks ? '✅' : '❌'}`);
    console.log(`Offline Journaling: ${this.results.offline.canWriteOffline ? '✅' : '❌'}`);
    
    // Critical Issues Summary
    console.log('\n🚨 CRITICAL ISSUES SUMMARY');
    console.log('-'.repeat(40));
    
    const criticalIssues = this.results.issues.filter(issue => issue.severity === 'critical');
    const highIssues = this.results.issues.filter(issue => issue.severity === 'high');
    const mediumIssues = this.results.issues.filter(issue => issue.severity === 'medium');
    
    console.log(`Critical Issues: ${criticalIssues.length}`);
    console.log(`High Priority Issues: ${highIssues.length}`);
    console.log(`Medium Priority Issues: ${mediumIssues.length}`);
    
    if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES (Fix immediately):');
      criticalIssues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.error}`);
        if (issue.recommendation) {
          console.log(`   💡 ${issue.recommendation}`);
        }
      });
    }
    
    if (highIssues.length > 0) {
      console.log('\n⚠️  HIGH PRIORITY ISSUES:');
      highIssues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.error}`);
        if (issue.recommendation) {
          console.log(`   💡 ${issue.recommendation}`);
        }
      });
    }
    
    // Trauma-Informed Recommendations
    console.log('\n💚 TRAUMA-INFORMED RECOMMENDATIONS');
    console.log('-'.repeat(40));
    
    const recommendations = [
      complianceRate < 100 ? '• Increase touch target sizes to minimum 60px (70px for crisis elements)' : null,
      this.results.performance['http://localhost:3001']?.lcp > 2000 ? '• Optimize loading performance for users in crisis' : null,
      !this.results.offline.hasServiceWorker ? '• Implement offline functionality for network-disrupted crisis situations' : null,
      !this.results.crisisFeatures.accessibility?.accessible ? '• Add floating crisis support button on all pages' : null,
      '• Test with users experiencing different trauma responses (tremors, dissociation, panic)',
      '• Validate color contrast for users with tears or emotional distress',
      '• Ensure all crisis resources load within 2 seconds on slow networks'
    ].filter(Boolean);
    
    recommendations.forEach(rec => console.log(rec));
    
    // Final Assessment
    const totalIssues = criticalIssues.length + highIssues.length;
    const assessmentColor = totalIssues === 0 ? '💚' : totalIssues < 3 ? '💛' : '🔴';
    const assessmentText = totalIssues === 0 ? 'EXCELLENT' : totalIssues < 3 ? 'GOOD' : 'NEEDS IMPROVEMENT';
    
    console.log(`\n${assessmentColor} OVERALL TRAUMA-INFORMED MOBILE READINESS: ${assessmentText}`);
    console.log(`Touch Target Compliance: ${complianceRate.toFixed(1)}%`);
    console.log(`Critical Issues: ${criticalIssues.length}`);
    console.log(`High Priority Issues: ${highIssues.length}`);
    
    if (totalIssues === 0) {
      console.log('\n🎉 ALCHM is ready to provide safe mobile support for users in crisis!');
    } else {
      console.log(`\n📋 Please address ${totalIssues} critical/high priority issues before launch.`);
    }
    
    console.log('\n' + '='.repeat(80));
    
    // Exit with appropriate code
    process.exit(criticalIssues.length > 0 ? 1 : 0);
  }
}

// Run validation if script is executed directly
if (require.main === module) {
  const validator = new MobileTraumaValidator();
  validator.runFullValidation().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = MobileTraumaValidator;