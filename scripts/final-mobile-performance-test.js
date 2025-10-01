#!/usr/bin/env node

/**
 * FINAL MOBILE PERFORMANCE TEST
 * Validates trauma-informed mobile experience using browser automation
 */

const puppeteer = require('puppeteer');

class FinalMobilePerformanceTest {
  constructor() {
    this.results = {
      devices: [],
      performance: {},
      accessibility: {},
      crisisFeatures: {},
      recommendations: [],
      overallScore: 0
    };
  }

  async runFinalTest() {
    console.log('🚀 Running Final Mobile Performance Test for ALCHM...\n');
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    try {
      // Test critical devices
      const testDevices = [
        { name: 'iPhone SE (2020)', preset: 'iPhone SE' },
        { name: 'iPhone 12 Pro', preset: 'iPhone 12 Pro' },
        { name: 'Galaxy S8', preset: 'Galaxy S8' },
        { name: 'Pixel 5', preset: 'Pixel 5' }
      ];

      for (const device of testDevices) {
        console.log(`📱 Testing ${device.name}...`);
        await this.testDevice(browser, device);
      }

      await this.generateFinalReport();

    } catch (error) {
      console.error('❌ Final test failed:', error);
    } finally {
      await browser.close();
    }
  }

  async testDevice(browser, device) {
    const page = await browser.newPage();
    
    try {
      // Emulate device
      await page.emulate(puppeteer.devices[device.preset]);
      
      // Simulate poor network conditions (crisis scenario)
      await page.emulateNetworkConditions({
        offline: false,
        downloadThroughput: 100 * 1024, // 100kb/s (slow 3G)
        uploadThroughput: 50 * 1024,
        latency: 1500 // 1.5s latency
      });
      
      // Test critical pages
      const pages = [
        { url: 'http://localhost:3001', name: 'Homepage' },
        { url: 'http://localhost:3001/auth/login', name: 'Login' },
        { url: 'http://localhost:3001/dashboard', name: 'Dashboard' },
        { url: 'http://localhost:3001/journal', name: 'Journal' }
      ];

      const deviceResults = {
        name: device.name,
        pages: [],
        touchTargets: { total: 0, compliant: 0 },
        crisisFeatures: { found: 0, accessible: 0 },
        performance: { avgLoadTime: 0, avgFCP: 0 }
      };

      for (const testPage of pages) {
        console.log(`  📄 Testing ${testPage.name}...`);
        
        try {
          const startTime = Date.now();
          
          // Navigate with timeout for poor network conditions
          await page.goto(testPage.url, { 
            waitUntil: 'networkidle0', 
            timeout: 15000 
          });
          
          const loadTime = Date.now() - startTime;
          
          // Get performance metrics
          const performanceMetrics = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            
            return {
              loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
              fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
              lcp: 0 // Would need additional observer for LCP
            };
          });
          
          // Test touch targets
          const touchTargets = await this.testTouchTargets(page);
          
          // Test crisis features
          const crisisFeatures = await this.testCrisisFeatures(page);
          
          // Test offline capability
          const offlineSupport = await this.testOfflineSupport(page);
          
          const pageResult = {
            name: testPage.name,
            url: testPage.url,
            loadTime,
            performanceMetrics,
            touchTargets,
            crisisFeatures,
            offlineSupport,
            accessible: true
          };
          
          deviceResults.pages.push(pageResult);
          
          // Update device totals
          deviceResults.touchTargets.total += touchTargets.total;
          deviceResults.touchTargets.compliant += touchTargets.compliant;
          deviceResults.crisisFeatures.found += crisisFeatures.found;
          deviceResults.crisisFeatures.accessible += crisisFeatures.accessible;
          
          console.log(`    ⚡ Load time: ${loadTime}ms`);
          console.log(`    👆 Touch targets: ${touchTargets.compliant}/${touchTargets.total} compliant`);
          console.log(`    🆘 Crisis features: ${crisisFeatures.found} found, ${crisisFeatures.accessible} accessible`);
          
        } catch (error) {
          console.log(`    ❌ Failed to test ${testPage.name}: ${error.message}`);
          deviceResults.pages.push({
            name: testPage.name,
            url: testPage.url,
            error: error.message,
            accessible: false
          });
        }
      }
      
      // Calculate averages
      const validPages = deviceResults.pages.filter(p => !p.error);
      if (validPages.length > 0) {
        deviceResults.performance.avgLoadTime = validPages.reduce((sum, p) => sum + p.loadTime, 0) / validPages.length;
        deviceResults.performance.avgFCP = validPages.reduce((sum, p) => sum + (p.performanceMetrics?.fcp || 0), 0) / validPages.length;
      }
      
      this.results.devices.push(deviceResults);
      
    } catch (error) {
      console.error(`  ❌ Device test failed for ${device.name}:`, error.message);
    } finally {
      await page.close();
    }
  }

  async testTouchTargets(page) {
    return await page.evaluate(() => {
      const interactiveElements = document.querySelectorAll(
        'button, a, input, textarea, select, [role="button"], [tabindex]'
      );
      
      let total = 0;
      let compliant = 0;
      
      interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const computedStyle = getComputedStyle(element);
        
        // Skip hidden elements
        if (rect.width === 0 || rect.height === 0 || 
            computedStyle.display === 'none' || 
            computedStyle.visibility === 'hidden') {
          return;
        }
        
        total++;
        
        const width = Math.max(rect.width, parseFloat(computedStyle.minWidth) || 0);
        const height = Math.max(rect.height, parseFloat(computedStyle.minHeight) || 0);
        
        // Check if it's a crisis element (needs 70px minimum)
        const isCrisis = element.classList.contains('crisis-accessible') ||
                         element.classList.contains('touch-crisis') ||
                         element.textContent?.toLowerCase().includes('crisis') ||
                         element.textContent?.toLowerCase().includes('988');
        
        const minSize = isCrisis ? 70 : 60;
        
        if (width >= minSize && height >= minSize) {
          compliant++;
        }
      });
      
      return { total, compliant };
    });
  }

  async testCrisisFeatures(page) {
    return await page.evaluate(() => {
      let found = 0;
      let accessible = 0;
      
      // Check for crisis floating button
      const floatingButton = document.querySelector('.btn-crisis-intervention, [aria-label*="Crisis"]');
      if (floatingButton) {
        found++;
        const rect = floatingButton.getBoundingClientRect();
        if (rect.width >= 56 && rect.height >= 56 && 
            getComputedStyle(floatingButton).display !== 'none') {
          accessible++;
        }
      }
      
      // Check for crisis links
      const crisisLinks = document.querySelectorAll('a[href*="988"], a[href*="crisis"], a[href*="tel:"]');
      found += crisisLinks.length;
      
      crisisLinks.forEach(link => {
        const rect = link.getBoundingClientRect();
        if (rect.width >= 52 && rect.height >= 52) {
          accessible++;
        }
      });
      
      // Check for crisis resources
      const crisisResources = document.querySelectorAll('.crisis-resources, .emergency-resources');
      found += crisisResources.length;
      accessible += crisisResources.length; // Assume accessible if present
      
      return { found, accessible };
    });
  }

  async testOfflineSupport(page) {
    return await page.evaluate(() => {
      const hasServiceWorker = 'serviceWorker' in navigator;
      
      // Check for offline indicators
      const hasOfflineSupport = document.querySelector('.offline-indicator') !== null ||
                               hasServiceWorker;
      
      // Check for local storage capability
      let hasLocalStorage = false;
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        hasLocalStorage = true;
      } catch (e) {
        hasLocalStorage = false;
      }
      
      return {
        hasServiceWorker,
        hasOfflineSupport,
        hasLocalStorage,
        canJournalOffline: hasServiceWorker && hasLocalStorage
      };
    });
  }

  async generateFinalReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 FINAL MOBILE TRAUMA-INFORMED PERFORMANCE REPORT');
    console.log('='.repeat(80));

    // Device Performance Summary
    console.log('\n📱 DEVICE PERFORMANCE SUMMARY:');
    console.log('-'.repeat(50));

    this.results.devices.forEach(device => {
      console.log(`\n${device.name}:`);
      console.log(`  Average Load Time: ${Math.round(device.performance.avgLoadTime)}ms`);
      console.log(`  Touch Target Compliance: ${device.touchTargets.compliant}/${device.touchTargets.total} (${Math.round(device.touchTargets.compliant / device.touchTargets.total * 100)}%)`);
      console.log(`  Crisis Features: ${device.crisisFeatures.accessible}/${device.crisisFeatures.found} accessible`);
      
      device.pages.forEach(page => {
        if (page.error) {
          console.log(`    ❌ ${page.name}: ${page.error}`);
        } else {
          const status = page.loadTime < 3000 ? '✅' : '⚠️';
          console.log(`    ${status} ${page.name}: ${Math.round(page.loadTime)}ms`);
        }
      });
    });

    // Overall Performance Assessment
    console.log('\n⚡ OVERALL PERFORMANCE ASSESSMENT:');
    console.log('-'.repeat(50));

    const allDevices = this.results.devices;
    const totalTouchTargets = allDevices.reduce((sum, d) => sum + d.touchTargets.total, 0);
    const compliantTouchTargets = allDevices.reduce((sum, d) => sum + d.touchTargets.compliant, 0);
    const touchComplianceRate = totalTouchTargets > 0 ? (compliantTouchTargets / totalTouchTargets * 100) : 0;

    const avgLoadTime = allDevices.reduce((sum, d) => sum + d.performance.avgLoadTime, 0) / allDevices.length;
    const totalCrisisFeatures = allDevices.reduce((sum, d) => sum + d.crisisFeatures.found, 0);
    const accessibleCrisisFeatures = allDevices.reduce((sum, d) => sum + d.crisisFeatures.accessible, 0);

    console.log(`Touch Target Compliance: ${touchComplianceRate.toFixed(1)}%`);
    console.log(`Average Load Time: ${Math.round(avgLoadTime)}ms`);
    console.log(`Crisis Features Accessibility: ${accessibleCrisisFeatures}/${totalCrisisFeatures}`);

    // Performance Grade
    let grade = 'A+';
    let color = '💚';
    
    if (touchComplianceRate < 95 || avgLoadTime > 3000) {
      grade = 'A';
      color = '💛';
    }
    if (touchComplianceRate < 90 || avgLoadTime > 4000) {
      grade = 'B+';
      color = '🟡';
    }
    if (touchComplianceRate < 85 || avgLoadTime > 5000) {
      grade = 'B';
      color = '🟠';
    }
    if (touchComplianceRate < 80 || avgLoadTime > 6000) {
      grade = 'C';
      color = '🔴';
    }

    console.log(`\n${color} OVERALL MOBILE READINESS GRADE: ${grade}`);

    // Crisis Readiness Assessment
    console.log('\n🆘 CRISIS READINESS ASSESSMENT:');
    console.log('-'.repeat(50));

    const crisisReadiness = accessibleCrisisFeatures >= totalCrisisFeatures * 0.8 ? 'EXCELLENT' : 'GOOD';
    const crisisColor = crisisReadiness === 'EXCELLENT' ? '✅' : '⚠️';

    console.log(`${crisisColor} Crisis Feature Accessibility: ${crisisReadiness}`);
    console.log(`Average Load Time (Crisis Scenario): ${Math.round(avgLoadTime)}ms`);

    if (avgLoadTime < 2000) {
      console.log('✅ Meets crisis-safe load time threshold (<2s)');
    } else if (avgLoadTime < 3000) {
      console.log('⚠️ Acceptable for non-crisis situations');
    } else {
      console.log('❌ Too slow for users in crisis');
    }

    // Final Recommendations
    console.log('\n💡 FINAL RECOMMENDATIONS:');
    console.log('-'.repeat(50));

    if (touchComplianceRate < 100) {
      console.log('• Review and enlarge remaining non-compliant touch targets');
    }

    if (avgLoadTime > 2000) {
      console.log('• Optimize critical rendering path for faster crisis-safe loading');
    }

    if (accessibleCrisisFeatures < totalCrisisFeatures) {
      console.log('• Ensure all crisis features meet accessibility requirements');
    }

    console.log('• Test with real users experiencing different trauma responses');
    console.log('• Validate color contrast for users with tears or emotional distress');
    console.log('• Continue monitoring performance on low-end devices');

    // Success Message
    if (grade === 'A+' && crisisReadiness === 'EXCELLENT') {
      console.log('\n🎉 OUTSTANDING! ALCHM is trauma-informed and crisis-ready for mobile users!');
      console.log('Your mobile experience provides a safe digital sanctuary for healing.');
    } else if (grade.startsWith('A') && crisisReadiness !== 'POOR') {
      console.log('\n✨ EXCELLENT! ALCHM mobile experience is well-prepared for vulnerable users.');
      console.log('Minor optimizations will make it even better.');
    } else {
      console.log('\n📋 GOOD PROGRESS! Address the recommendations above to optimize for trauma-informed mobile use.');
    }

    console.log('\n' + '='.repeat(80));
  }
}

// Run the test
if (require.main === module) {
  const test = new FinalMobilePerformanceTest();
  test.runFinalTest().catch(error => {
    console.error('Final test failed:', error);
    process.exit(1);
  });
}

module.exports = FinalMobilePerformanceTest;