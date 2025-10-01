/**
 * MOBILE CRISIS LAYOUT AUDIT SCRIPT
 * 
 * Comprehensive mobile optimization validation for trauma survivors in crisis
 * Tests layout, performance, and accessibility under stress conditions
 */

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs');

class MobileCrisisAudit {
  constructor() {
    this.results = {
      layoutTests: [],
      performanceMetrics: {},
      accessibilityFindings: [],
      crisisSpecificValidation: [],
      recommendations: []
    };
  }

  async runComprehensiveAudit() {
    console.log('\n🔍 ALCHM MOBILE CRISIS AUDIT STARTING...\n');
    
    const browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      devtools: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security'
      ]
    });

    try {
      // Test multiple mobile viewports for crisis scenarios
      const crisisViewports = [
        { name: 'iPhone SE (Small Crisis)', width: 375, height: 667 },
        { name: 'iPhone 12 (Modern Crisis)', width: 390, height: 844 },
        { name: 'Android Small (Budget Crisis)', width: 360, height: 640 },
        { name: 'Android Medium (Standard Crisis)', width: 414, height: 896 }
      ];

      for (const viewport of crisisViewports) {
        console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
        await this.testViewport(browser, viewport);
      }

      // Run performance stress tests
      await this.runPerformanceStressTests(browser);
      
      // Test crisis-specific interactions
      await this.testCrisisInteractions(browser);

      // Generate comprehensive report
      await this.generateReport();
      
    } finally {
      await browser.close();
    }
  }

  async testViewport(browser, viewport) {
    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height });
    
    // Add CSS for crisis simulation
    await page.evaluateOnNewDocument(() => {
      // Simulate user in emotional distress
      window.crisisSimulation = {
        visionImpaired: true,
        motorImpaired: true,
        cognitiveLoad: 'high'
      };
    });

    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Test 1: Crisis Support Box Positioning
      const layoutTest = await this.testCrisisSupportLayout(page, viewport);
      this.results.layoutTests.push({ viewport: viewport.name, ...layoutTest });
      
      // Test 2: Touch Target Validation
      const touchTest = await this.testTouchTargets(page, viewport);
      this.results.accessibilityFindings.push({ viewport: viewport.name, ...touchTest });
      
      // Test 3: Cognitive Load Assessment
      const cognitiveTest = await this.assessCognitiveLoad(page, viewport);
      this.results.crisisSpecificValidation.push({ viewport: viewport.name, ...cognitiveTest });
      
      console.log(`  ✓ ${viewport.name} tests completed`);
      
    } catch (error) {
      console.error(`  ❌ Error testing ${viewport.name}:`, error.message);
    } finally {
      await page.close();
    }
  }

  async testCrisisSupportLayout(page, viewport) {
    const results = { test: 'Crisis Support Layout', issues: [], recommendations: [] };
    
    try {
      // Check crisis box positioning
      const crisisBox = await page.$('div:has-text("Crisis Support Available 24/7")');
      const privateCard = await page.$('div:has-text("Private & Secure")');
      
      if (crisisBox && privateCard) {
        const crisisRect = await crisisBox.boundingBox();
        const privateRect = await privateCard.boundingBox();
        
        if (crisisRect && privateRect) {
          // Check for overlap
          const overlap = !(
            crisisRect.y >= privateRect.y + privateRect.height ||
            privateRect.y >= crisisRect.y + crisisRect.height ||
            crisisRect.x >= privateRect.x + privateRect.width ||
            privateRect.x >= crisisRect.x + crisisRect.width
          );
          
          if (overlap) {
            results.issues.push('Crisis support box overlaps with feature cards');
            results.recommendations.push('Increase margin-top on crisis section for mobile');
          } else {
            const spacing = crisisRect.y - (privateRect.y + privateRect.height);
            if (spacing < 16) {
              results.issues.push(`Insufficient spacing between crisis box and cards: ${spacing}px`);
              results.recommendations.push('Add minimum 24px spacing for trauma-informed design');
            } else {
              console.log(`    ✓ Crisis box properly positioned with ${Math.round(spacing)}px spacing`);
            }
          }
        }
      } else {
        results.issues.push('Could not locate crisis support elements');
      }
      
      // Test crisis button accessibility
      const crisisButton = await page.$('a[href="tel:988"]');
      if (crisisButton) {
        const buttonRect = await crisisButton.boundingBox();
        if (buttonRect) {
          if (buttonRect.height < 60) {
            results.issues.push(`Crisis button too small: ${buttonRect.height}px height`);
            results.recommendations.push('Increase crisis button to minimum 70px height');
          }
          
          if (buttonRect.width < 160) {
            results.issues.push(`Crisis button too narrow: ${buttonRect.width}px width`);
            results.recommendations.push('Increase crisis button to minimum 200px width');
          }
          
          if (buttonRect.height >= 60 && buttonRect.width >= 160) {
            console.log(`    ✓ Crisis button meets trauma-informed size: ${Math.round(buttonRect.width)}x${Math.round(buttonRect.height)}px`);
          }
        }
      }
      
    } catch (error) {
      results.issues.push(`Layout test error: ${error.message}`);
    }
    
    return results;
  }

  async testTouchTargets(page, viewport) {
    const results = { test: 'Touch Target Validation', issues: [], recommendations: [] };
    
    try {
      const interactiveElements = await page.$$('a[href], button, [role="button"]');
      const problems = [];
      
      for (let i = 0; i < Math.min(interactiveElements.length, 10); i++) {
        const element = interactiveElements[i];
        const rect = await element.boundingBox();
        
        if (rect) {
          const isCrisisElement = await element.evaluate(el => 
            el.href?.includes('tel:') || el.textContent?.includes('988') || el.textContent?.includes('Crisis')
          );
          
          const minSize = isCrisisElement ? 70 : 52; // Crisis elements need larger targets
          
          if (rect.width < minSize || rect.height < minSize) {
            const elementText = await element.evaluate(el => el.textContent?.trim()?.substring(0, 30) || 'Unknown');
            problems.push({
              element: elementText,
              size: `${Math.round(rect.width)}x${Math.round(rect.height)}px`,
              required: `${minSize}x${minSize}px`,
              isCrisis: isCrisisElement
            });
          }
        }
      }
      
      if (problems.length > 0) {
        results.issues = problems.map(p => 
          `${p.element}: ${p.size} (needs ${p.required})${p.isCrisis ? ' [CRISIS ELEMENT]' : ''}`
        );
        results.recommendations.push(
          'Increase touch targets to meet trauma-informed accessibility standards',
          'Crisis elements need minimum 70px height/width for users with trembling hands'
        );
      } else {
        console.log(`    ✓ All touch targets meet accessibility requirements`);
      }
      
    } catch (error) {
      results.issues.push(`Touch target test error: ${error.message}`);
    }
    
    return results;
  }

  async assessCognitiveLoad(page, viewport) {
    const results = { test: 'Cognitive Load Assessment', issues: [], recommendations: [] };
    
    try {
      // Count visible interactive elements
      const interactiveCount = await page.$$eval('a[href], button, [role="button"]', 
        elements => elements.filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0; // Visible elements only
        }).length
      );
      
      // Check for overwhelming visual elements
      const hasMultipleCTAs = await page.$$eval('a[href*="auth"], a[href*="login"], a[href*="signup"]',
        elements => elements.length > 2
      );
      
      // Assess text density
      const textDensity = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        const words = bodyText.split(/\s+/).length;
        const viewport = window.innerHeight * window.innerWidth;
        return words / (viewport / 10000); // Words per 10k pixels
      });
      
      // Crisis-specific validation
      if (interactiveCount > 8) {
        results.issues.push(`Too many interactive elements for crisis users: ${interactiveCount}`);
        results.recommendations.push('Limit interactive elements to max 6 for crisis scenarios');
      }
      
      if (hasMultipleCTAs) {
        results.issues.push('Multiple competing CTAs create decision paralysis');
        results.recommendations.push('Simplify to one primary CTA for crisis clarity');
      }
      
      if (textDensity > 15) {
        results.issues.push(`Text density too high for emotional distress: ${Math.round(textDensity)} words/10k pixels`);
        results.recommendations.push('Reduce text density for users with impaired cognitive function');
      }
      
      if (results.issues.length === 0) {
        console.log(`    ✓ Cognitive load optimized for crisis users (${interactiveCount} elements)`);
      }
      
    } catch (error) {
      results.issues.push(`Cognitive load test error: ${error.message}`);
    }
    
    return results;
  }

  async runPerformanceStressTests(browser) {
    console.log('\n⚡ Running Performance Stress Tests...');
    
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667 }); // iPhone SE baseline
    
    try {
      // Test 1: Slow 3G Performance
      const client = await page.target().createCDPSession();
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: 400 * 1024 / 8, // 400kbps
        uploadThroughput: 400 * 1024 / 8,
        latency: 2000
      });
      
      const startTime = Date.now();
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      const loadTime = Date.now() - startTime;
      
      // Check if crisis button is accessible quickly
      const crisisButtonLoadTime = await page.evaluate(() => {
        const button = document.querySelector('a[href="tel:988"]');
        return button ? 'loaded' : 'missing';
      });
      
      this.results.performanceMetrics = {
        slowNetworkLoadTime: loadTime,
        crisisButtonAccessible: crisisButtonLoadTime === 'loaded',
        meetsTraumaInformedStandard: loadTime < 5000 // Max 5s for crisis scenarios
      };
      
      console.log(`  ✓ Slow 3G load time: ${loadTime}ms`);
      console.log(`  ✓ Crisis button accessible: ${crisisButtonLoadTime}`);
      
      // Test 2: CPU Throttling (simulate older devices)
      await client.send('Emulation.setCPUThrottlingRate', { rate: 6 });
      
      const interactionStartTime = Date.now();
      await page.click('a[href="tel:988"]');
      const interactionTime = Date.now() - interactionStartTime;
      
      this.results.performanceMetrics.crisisButtonResponseTime = interactionTime;
      this.results.performanceMetrics.meetsInteractionStandard = interactionTime < 200;
      
      console.log(`  ✓ Crisis button response time: ${interactionTime}ms`);
      
    } catch (error) {
      console.error('  ❌ Performance test error:', error.message);
    } finally {
      await page.close();
    }
  }

  async testCrisisInteractions(browser) {
    console.log('\n🚨 Testing Crisis-Specific Interactions...');
    
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667 });
    
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Test trembling hand simulation
      const crisisButton = await page.$('a[href="tel:988"]');
      if (crisisButton) {
        const buttonRect = await crisisButton.boundingBox();
        
        if (buttonRect) {
          // Simulate imprecise touches
          const testResults = [];
          for (let i = 0; i < 5; i++) {
            const offsetX = (Math.random() - 0.5) * 15; // ±7.5px variation
            const offsetY = (Math.random() - 0.5) * 15;
            
            const x = buttonRect.x + buttonRect.width / 2 + offsetX;
            const y = buttonRect.y + buttonRect.height / 2 + offsetY;
            
            // Check if click would still hit target
            const hitElement = await page.elementFromPoint(x, y);
            const isStillCrisisButton = await hitElement?.evaluate(el => 
              el.closest('a[href="tel:988"]') !== null
            );
            
            testResults.push(isStillCrisisButton);
          }
          
          const successRate = testResults.filter(Boolean).length / testResults.length;
          
          this.results.crisisSpecificValidation.push({
            test: 'Trembling Hand Tolerance',
            successRate: `${Math.round(successRate * 100)}%`,
            meetsStandard: successRate >= 0.8, // 80% success rate required
            recommendation: successRate < 0.8 ? 'Increase button size and padding for motor impairment' : null
          });
          
          console.log(`  ✓ Trembling hand tolerance: ${Math.round(successRate * 100)}% success rate`);
        }
      }
      
      // Test layout stability during stress
      const initialCrisisPosition = await page.evaluate(() => {
        const element = document.querySelector('a[href="tel:988"]');
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return { x: rect.x, y: rect.y };
      });
      
      // Simulate rapid interactions
      for (let i = 0; i < 3; i++) {
        await page.mouse.move(200, 300);
        await page.mouse.down();
        await page.waitForTimeout(100);
        await page.mouse.up();
      }
      
      const finalCrisisPosition = await page.evaluate(() => {
        const element = document.querySelector('a[href="tel:988"]');
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return { x: rect.x, y: rect.y };
      });
      
      const layoutStable = initialCrisisPosition && finalCrisisPosition &&
        Math.abs(initialCrisisPosition.x - finalCrisisPosition.x) < 2 &&
        Math.abs(initialCrisisPosition.y - finalCrisisPosition.y) < 2;
      
      this.results.crisisSpecificValidation.push({
        test: 'Layout Stability Under Stress',
        result: layoutStable ? 'Stable' : 'Unstable',
        meetsStandard: layoutStable,
        recommendation: !layoutStable ? 'Fix layout shifts that could confuse users in crisis' : null
      });
      
      console.log(`  ✓ Layout stability: ${layoutStable ? 'Stable' : 'Unstable'}`);
      
    } catch (error) {
      console.error('  ❌ Crisis interaction test error:', error.message);
    } finally {
      await page.close();
    }
  }

  async generateReport() {
    console.log('\n📊 Generating Mobile Crisis Audit Report...\n');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(),
      detailed_findings: this.results,
      priority_fixes: this.getPriorityFixes(),
      trauma_informed_score: this.calculateTraumaInformedScore()
    };
    
    // Save detailed report
    const filename = `mobile-crisis-audit-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    
    // Generate console summary
    this.printSummary(report);
    
    console.log(`\n📄 Detailed report saved: ${filename}`);
    return report;
  }

  generateSummary() {
    const totalIssues = this.results.layoutTests.reduce((count, test) => count + test.issues.length, 0) +
                       this.results.accessibilityFindings.reduce((count, test) => count + test.issues.length, 0) +
                       this.results.crisisSpecificValidation.reduce((count, test) => count + (test.issues ? test.issues.length : 0), 0);
    
    return {
      overall_status: totalIssues === 0 ? 'EXCELLENT' : totalIssues < 3 ? 'GOOD' : totalIssues < 6 ? 'NEEDS_WORK' : 'CRITICAL',
      total_issues_found: totalIssues,
      crisis_accessibility_score: this.calculateTraumaInformedScore(),
      performance_meets_standards: this.results.performanceMetrics.meetsTraumaInformedStandard,
      ready_for_crisis_users: totalIssues < 2 && this.results.performanceMetrics.meetsTraumaInformedStandard
    };
  }

  getPriorityFixes() {
    const fixes = [];
    
    // Crisis-specific fixes get highest priority
    this.results.layoutTests.forEach(test => {
      test.issues.forEach(issue => {
        if (issue.includes('Crisis') || issue.includes('overlap')) {
          fixes.push({ priority: 'CRITICAL', issue, viewport: test.viewport });
        }
      });
    });
    
    this.results.accessibilityFindings.forEach(test => {
      test.issues.forEach(issue => {
        if (issue.includes('CRISIS ELEMENT')) {
          fixes.push({ priority: 'CRITICAL', issue, viewport: test.viewport });
        } else if (issue.includes('touch target')) {
          fixes.push({ priority: 'HIGH', issue, viewport: test.viewport });
        }
      });
    });
    
    return fixes.slice(0, 10); // Top 10 priority fixes
  }

  calculateTraumaInformedScore() {
    let score = 100;
    
    // Deduct points for issues
    this.results.layoutTests.forEach(test => {
      score -= test.issues.length * 10;
    });
    
    this.results.accessibilityFindings.forEach(test => {
      score -= test.issues.length * 15; // Accessibility issues are more critical
    });
    
    // Performance penalties
    if (!this.results.performanceMetrics.meetsTraumaInformedStandard) {
      score -= 20;
    }
    
    if (!this.results.performanceMetrics.meetsInteractionStandard) {
      score -= 15;
    }
    
    return Math.max(0, score);
  }

  printSummary(report) {
    console.log('='.repeat(60));
    console.log('🏥 ALCHM MOBILE CRISIS AUDIT RESULTS');
    console.log('='.repeat(60));
    console.log(`📈 Overall Status: ${report.summary.overall_status}`);
    console.log(`🎯 Trauma-Informed Score: ${report.trauma_informed_score}/100`);
    console.log(`⚠️  Issues Found: ${report.summary.total_issues_found}`);
    console.log(`⚡ Performance: ${report.summary.performance_meets_standards ? 'PASS' : 'FAIL'}`);
    console.log(`🚨 Crisis Ready: ${report.summary.ready_for_crisis_users ? 'YES' : 'NO'}`);
    
    if (report.priority_fixes.length > 0) {
      console.log('\n🔧 PRIORITY FIXES:');
      report.priority_fixes.forEach((fix, i) => {
        console.log(`  ${i + 1}. [${fix.priority}] ${fix.issue}`);
      });
    }
    
    console.log('\n💡 KEY VALIDATIONS:');
    console.log(`  ✓ Crisis support box positioning`);
    console.log(`  ✓ Touch target accessibility (70px+ for crisis)`);
    console.log(`  ✓ Cognitive load optimization`);
    console.log(`  ✓ Performance under stress conditions`);
    console.log(`  ✓ Layout stability during crisis interactions`);
    console.log('='.repeat(60));
  }
}

// Run audit if called directly
if (require.main === module) {
  const audit = new MobileCrisisAudit();
  audit.runComprehensiveAudit().catch(console.error);
}

module.exports = MobileCrisisAudit;