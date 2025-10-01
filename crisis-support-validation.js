#!/usr/bin/env node

/**
 * CRISIS SUPPORT VALIDATION FOR ALCHM
 * 
 * CRITICAL: Tests emergency features that could save lives
 * Zero tolerance for failures in crisis functionality
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class CrisisSupportValidator {
  constructor() {
    this.results = {
      emergencyPage: {},
      crisisResources: {},
      performance: {},
      accessibility: {},
      criticalIssues: []
    };
    this.browser = null;
    this.page = null;
  }

  async validate() {
    console.log('🆘 ALCHM Crisis Support Validation');
    console.log('CRITICAL: Life-safety features test');
    console.log('='.repeat(50));

    try {
      await this.setupBrowser();
      await this.testEmergencyPage();
      await this.testCrisisResources();
      await this.testPerformance();
      await this.testAccessibility();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Crisis validation failed:', error);
      this.results.criticalIssues.push({
        type: 'VALIDATION_FAILURE',
        message: error.message,
        impact: 'CRITICAL'
      });
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async setupBrowser() {
    console.log('\n🖥️ Setting up browser for crisis testing...');
    
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });

    this.page = await this.browser.newPage();
    
    // Simulate mobile device (crisis users often on mobile)
    await this.page.setViewport({ width: 375, height: 667 });
    await this.page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15');
    
    console.log('   ✅ Browser configured for mobile crisis testing');
  }

  async testEmergencyPage() {
    console.log('\n🚨 Testing Emergency Page...');

    try {
      const startTime = Date.now();
      
      // Navigate to emergency page
      await this.page.goto('http://localhost:3000/emergency', {
        waitUntil: 'networkidle0',
        timeout: 5000
      });

      const loadTime = Date.now() - startTime;
      
      // Check if page loaded
      const title = await this.page.title();
      const content = await this.page.content();
      
      // Critical elements check
      const criticalElements = await this.page.evaluate(() => {
        return {
          crisisButton: !!document.querySelector('button[onclick*="988"]') || !!document.querySelector('a[href*="tel:988"]'),
          textarea: !!document.querySelector('textarea'),
          saveButton: !!document.querySelector('button[onclick*="save"]') || !!document.querySelector('button:contains("Save")'),
          emergencyResources: document.querySelectorAll('a[href*="tel:"], a[href*="sms:"]').length
        };
      });

      this.results.emergencyPage = {
        loadTime,
        pageLoaded: !content.includes('404') && !content.includes('500'),
        title,
        criticalElements,
        loadTimeAcceptable: loadTime < 2000 // Must load in under 2 seconds
      };

      console.log(`   ⚡ Load time: ${loadTime}ms (target: <2000ms)`);
      console.log(`   🆘 Crisis button present: ${criticalElements.crisisButton ? 'Yes' : 'No'}`);
      console.log(`   📝 Textarea available: ${criticalElements.textarea ? 'Yes' : 'No'}`);
      console.log(`   📞 Emergency resources: ${criticalElements.emergencyResources} links`);

      // Critical failures
      if (loadTime > 2000) {
        this.results.criticalIssues.push({
          type: 'EMERGENCY_PAGE_SLOW',
          message: `Emergency page loaded in ${loadTime}ms (target: <2000ms)`,
          impact: 'CRITICAL'
        });
      }

      if (!criticalElements.crisisButton) {
        this.results.criticalIssues.push({
          type: 'MISSING_CRISIS_BUTTON',
          message: 'Crisis hotline button not found on emergency page',
          impact: 'CRITICAL'
        });
      }

      if (!criticalElements.textarea) {
        this.results.criticalIssues.push({
          type: 'MISSING_JOURNAL_TEXTAREA',
          message: 'Emergency journaling textarea not found',
          impact: 'HIGH'
        });
      }

    } catch (error) {
      console.error('❌ Emergency page test failed:', error.message);
      this.results.criticalIssues.push({
        type: 'EMERGENCY_PAGE_FAILED',
        message: `Emergency page failed to load: ${error.message}`,
        impact: 'CRITICAL'
      });
    }
  }

  async testCrisisResources() {
    console.log('\n📞 Testing Crisis Resources...');

    try {
      // Test 988 hotline link
      const crisisLinks = await this.page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="tel:988"], button[onclick*="988"]'));
        return links.map(link => ({
          text: link.textContent.trim(),
          href: link.href || link.getAttribute('onclick'),
          visible: link.offsetWidth > 0 && link.offsetHeight > 0
        }));
      });

      // Test text crisis line
      const textLinks = await this.page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="sms:741741"], a[href*="text:741741"]'));
        return links.map(link => ({
          text: link.textContent.trim(),
          href: link.href,
          visible: link.offsetWidth > 0 && link.offsetHeight > 0
        }));
      });

      this.results.crisisResources = {
        hotlineLinks: crisisLinks,
        textLinks: textLinks,
        totalResources: crisisLinks.length + textLinks.length,
        visibleResources: crisisLinks.filter(l => l.visible).length + textLinks.filter(l => l.visible).length
      };

      console.log(`   📞 988 Hotline links: ${crisisLinks.length} (${crisisLinks.filter(l => l.visible).length} visible)`);
      console.log(`   💬 Text crisis links: ${textLinks.length} (${textLinks.filter(l => l.visible).length} visible)`);

      // Critical: Must have at least one visible crisis resource
      if (this.results.crisisResources.visibleResources === 0) {
        this.results.criticalIssues.push({
          type: 'NO_VISIBLE_CRISIS_RESOURCES',
          message: 'No visible crisis support resources found',
          impact: 'CRITICAL'
        });
      }

      // Should have both hotline and text options
      if (crisisLinks.length === 0) {
        this.results.criticalIssues.push({
          type: 'MISSING_HOTLINE_LINK',
          message: 'No 988 hotline links found',
          impact: 'HIGH'
        });
      }

    } catch (error) {
      console.error('❌ Crisis resources test failed:', error.message);
      this.results.criticalIssues.push({
        type: 'CRISIS_RESOURCES_TEST_FAILED',
        message: error.message,
        impact: 'HIGH'
      });
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Crisis Performance...');

    try {
      // Test rapid navigation to emergency page
      const rapidTests = [];
      
      for (let i = 0; i < 3; i++) {
        const startTime = Date.now();
        await this.page.goto('http://localhost:3000/emergency', { waitUntil: 'domcontentloaded' });
        const loadTime = Date.now() - startTime;
        rapidTests.push(loadTime);
        console.log(`   Test ${i + 1}: ${loadTime}ms`);
      }

      const avgLoadTime = rapidTests.reduce((sum, time) => sum + time, 0) / rapidTests.length;
      const maxLoadTime = Math.max(...rapidTests);

      this.results.performance = {
        rapidTests,
        averageLoadTime: avgLoadTime,
        maxLoadTime,
        consistentPerformance: maxLoadTime < 3000 && avgLoadTime < 2000
      };

      console.log(`   📊 Average load time: ${avgLoadTime.toFixed(0)}ms`);
      console.log(`   📊 Max load time: ${maxLoadTime}ms`);
      console.log(`   ✅ Consistent performance: ${this.results.performance.consistentPerformance ? 'Yes' : 'No'}`);

      if (!this.results.performance.consistentPerformance) {
        this.results.criticalIssues.push({
          type: 'INCONSISTENT_CRISIS_PERFORMANCE',
          message: `Emergency page performance inconsistent (max: ${maxLoadTime}ms, avg: ${avgLoadTime.toFixed(0)}ms)`,
          impact: 'HIGH'
        });
      }

    } catch (error) {
      console.error('❌ Performance test failed:', error.message);
      this.results.criticalIssues.push({
        type: 'PERFORMANCE_TEST_FAILED',
        message: error.message,
        impact: 'MEDIUM'
      });
    }
  }

  async testAccessibility() {
    console.log('\n♿ Testing Crisis Accessibility...');

    try {
      // Test keyboard navigation
      await this.page.goto('http://localhost:3000/emergency');
      
      // Tab through all interactive elements
      const tabSequence = [];
      let tabCount = 0;
      
      while (tabCount < 10) {
        await this.page.keyboard.press('Tab');
        const activeElement = await this.page.evaluate(() => {
          const active = document.activeElement;
          return {
            tagName: active.tagName,
            type: active.type || '',
            text: active.textContent?.trim().substring(0, 50) || '',
            hasClick: typeof active.click === 'function'
          };
        });
        
        tabSequence.push(activeElement);
        tabCount++;
        
        // Stop if we've cycled back to first element
        if (tabCount > 3 && JSON.stringify(activeElement) === JSON.stringify(tabSequence[0])) {
          break;
        }
      }

      // Check for proper focus management
      const focusableElements = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('a, button, input, textarea, [tabindex]');
        return Array.from(elements).map(el => ({
          tagName: el.tagName,
          visible: el.offsetWidth > 0 && el.offsetHeight > 0,
          tabIndex: el.tabIndex
        }));
      });

      this.results.accessibility = {
        tabSequence,
        focusableElements: focusableElements.filter(el => el.visible),
        keyboardNavigable: tabSequence.length > 2,
        crisisButtonAccessible: tabSequence.some(el => 
          el.text.includes('988') || el.text.includes('Crisis') || el.text.includes('Emergency')
        )
      };

      console.log(`   ⌨️  Keyboard navigable: ${this.results.accessibility.keyboardNavigable ? 'Yes' : 'No'}`);
      console.log(`   🆘 Crisis button accessible: ${this.results.accessibility.crisisButtonAccessible ? 'Yes' : 'No'}`);
      console.log(`   🎯 Focusable elements: ${this.results.accessibility.focusableElements.length}`);

      if (!this.results.accessibility.crisisButtonAccessible) {
        this.results.criticalIssues.push({
          type: 'CRISIS_BUTTON_NOT_ACCESSIBLE',
          message: 'Crisis button not accessible via keyboard navigation',
          impact: 'HIGH'
        });
      }

    } catch (error) {
      console.error('❌ Accessibility test failed:', error.message);
      this.results.criticalIssues.push({
        type: 'ACCESSIBILITY_TEST_FAILED',
        message: error.message,
        impact: 'MEDIUM'
      });
    }
  }

  async generateReport() {
    const criticalCount = this.results.criticalIssues.filter(i => i.impact === 'CRITICAL').length;
    const highCount = this.results.criticalIssues.filter(i => i.impact === 'HIGH').length;
    
    const isCrisisReady = criticalCount === 0 && highCount <= 1;

    console.log('\n' + '='.repeat(50));
    console.log('🆘 CRISIS SUPPORT VALIDATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`🚨 Emergency Page: ${this.results.emergencyPage.pageLoaded ? 'Working' : 'Failed'}`);
    console.log(`📞 Crisis Resources: ${this.results.crisisResources.visibleResources || 0} visible`);
    console.log(`⚡ Performance: ${this.results.performance.consistentPerformance ? 'Consistent' : 'Issues'}`);
    console.log(`♿ Accessibility: ${this.results.accessibility.keyboardNavigable ? 'Keyboard OK' : 'Issues'}`);
    console.log(`⚠️  Critical Issues: ${criticalCount}`);
    console.log(`📈 High Priority Issues: ${highCount}`);
    console.log('');
    console.log(`🚦 Crisis Readiness: ${isCrisisReady ? 'READY' : 'NOT READY'}`);

    if (!isCrisisReady) {
      console.log('\n❌ CRITICAL CRISIS ISSUES:');
      this.results.criticalIssues
        .filter(i => i.impact === 'CRITICAL')
        .forEach(issue => {
          console.log(`   • ${issue.type}: ${issue.message}`);
        });

      console.log('\n⚠️  HIGH PRIORITY CRISIS ISSUES:');
      this.results.criticalIssues
        .filter(i => i.impact === 'HIGH')
        .forEach(issue => {
          console.log(`   • ${issue.type}: ${issue.message}`);
        });
    }

    // Save detailed report
    await fs.writeFile(
      path.join(__dirname, 'crisis-support-validation-report.json'),
      JSON.stringify(this.results, null, 2)
    );

    console.log('\n📋 Crisis report saved to: crisis-support-validation-report.json');
  }
}

// Check if dependencies are available
async function checkDependencies() {
  try {
    require('puppeteer');
    return true;
  } catch (error) {
    console.log('📦 Installing puppeteer for crisis testing...');
    console.log('   (This is needed for browser automation testing)');
    return false;
  }
}

// Run validation
async function main() {
  const hasRequiredDeps = await checkDependencies();
  
  if (!hasRequiredDeps) {
    console.log('❌ Missing puppeteer dependency');
    console.log('   Run: npm install puppeteer');
    console.log('   Then run this test again');
    return;
  }

  const validator = new CrisisSupportValidator();
  await validator.validate();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = CrisisSupportValidator;