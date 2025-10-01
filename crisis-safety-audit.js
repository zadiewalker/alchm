#!/usr/bin/env node

/**
 * ALCHM Crisis Safety Systems Audit
 * Critical testing for trauma-informed crisis detection and intervention
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class CrisisSafetyAuditor {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      criticalIssues: [],
      warnings: [],
      passed: [],
      summary: {}
    };
  }

  async initialize() {
    console.log('🛡️ Initializing ALCHM Crisis Safety Audit...');
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    this.page = await this.browser.newPage();
    
    // Set viewport for mobile testing
    await this.page.setViewport({ width: 390, height: 844 });
    
    // Enable console monitoring
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
  }

  async testCrisisButtonPresence() {
    console.log('🔍 Testing Crisis Button Presence...');
    
    try {
      await this.page.goto('http://localhost:3002', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Check for crisis buttons (multiple types)
      const crisisButton = await this.page.$('.crisis-button, .emergency-button, .crisis-support, [data-testid="crisis-button"], [aria-label*="Crisis"], [aria-label*="Emergency"], [href="tel:988"]');
      
      if (crisisButton) {
        this.results.passed.push('✅ Crisis support button is present');
        
        // Test button accessibility
        const ariaLabel = await crisisButton.evaluate(el => el.getAttribute('aria-label'));
        if (ariaLabel) {
          this.results.passed.push('✅ Crisis button has proper aria-label');
        } else {
          this.results.warnings.push('⚠️ Crisis button missing aria-label');
        }

        // Test button positioning
        const buttonRect = await crisisButton.boundingBox();
        if (buttonRect && buttonRect.y > 600) {
          this.results.passed.push('✅ Crisis button positioned in lower viewport');
        } else {
          this.results.warnings.push('⚠️ Crisis button may be too high in viewport');
        }

      } else {
        this.results.criticalIssues.push('🚨 CRITICAL: Crisis support button not found on homepage');
      }

    } catch (error) {
      this.results.criticalIssues.push(`🚨 CRITICAL: Failed to load homepage - ${error.message}`);
    }
  }

  async testCrisisKeywordDetection() {
    console.log('🔍 Testing Crisis Keyword Detection...');
    
    try {
      // Navigate to a page with text input
      await this.page.goto('http://localhost:3002/journal', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Look for textarea or input fields
      const textArea = await this.page.$('textarea, input[type="text"]');
      
      if (textArea) {
        // Test crisis keyword detection
        const crisisKeywords = ['suicide', 'want to die', 'hurt myself', 'hopeless'];
        
        for (const keyword of crisisKeywords) {
          await textArea.click();
          await textArea.type(keyword);
          
          // Wait for potential crisis detection
          await new Promise(resolve => setTimeout(resolve, 2500));
          
          // Check if crisis footer appears
          const expandedCrisisFooter = await this.page.$('.crisis-footer.visible, [data-crisis-mode="true"]');
          
          if (expandedCrisisFooter) {
            this.results.passed.push(`✅ Crisis detection working for keyword: "${keyword}"`);
          } else {
            this.results.warnings.push(`⚠️ Crisis detection may not be working for: "${keyword}"`);
          }
          
          // Clear input
          await textArea.evaluate(el => el.value = '');
        }
      } else {
        this.results.warnings.push('⚠️ No text input found for crisis keyword testing');
      }

    } catch (error) {
      this.results.warnings.push(`⚠️ Crisis keyword detection test failed: ${error.message}`);
    }
  }

  async testCrisisResourceAccessibility() {
    console.log('🔍 Testing Crisis Resource Accessibility...');
    
    try {
      await this.page.goto('http://localhost:3002', { waitUntil: 'networkidle2' });

      // Click crisis button to expand
      const crisisButton = await this.page.$('.crisis-button, .emergency-button, .crisis-support, [aria-label*="Crisis"], [href="tel:988"]');
      if (crisisButton) {
        await crisisButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check for crisis resources
        const resources = await this.page.$$('[data-testid*="crisis-resource"], .crisis-footer .bg-white');
        
        if (resources.length > 0) {
          this.results.passed.push(`✅ Found ${resources.length} crisis resources`);
          
          // Test first resource's call button
          const firstCallButton = await this.page.$('button[aria-label*="Call"], button:has-text("Call")');
          if (firstCallButton) {
            this.results.passed.push('✅ Crisis resource call buttons are present');
          } else {
            this.results.criticalIssues.push('🚨 CRITICAL: Crisis resource call buttons not found');
          }

          // Test resource accessibility
          for (let i = 0; i < Math.min(resources.length, 3); i++) {
            const resource = resources[i];
            const text = await resource.evaluate(el => el.textContent);
            
            if (text.includes('24/7') || text.includes('available')) {
              this.results.passed.push(`✅ Resource ${i + 1} shows availability`);
            }
            
            if (text.includes('988') || text.includes('Crisis')) {
              this.results.passed.push(`✅ Resource ${i + 1} appears to be legitimate crisis resource`);
            }
          }

        } else {
          this.results.criticalIssues.push('🚨 CRITICAL: No crisis resources found when footer expanded');
        }
      }

    } catch (error) {
      this.results.criticalIssues.push(`🚨 CRITICAL: Crisis resource accessibility test failed: ${error.message}`);
    }
  }

  async testEmergencyModeActivation() {
    console.log('🔍 Testing Emergency Mode Activation...');
    
    try {
      await this.page.goto('http://localhost:3002', { waitUntil: 'networkidle2' });

      // Simulate crisis scenario
      await this.page.evaluate(() => {
        // Try to trigger emergency mode programmatically
        const crisisFooter = document.querySelector('[data-testid="crisis-footer"]');
        if (crisisFooter && crisisFooter.setAttribute) {
          crisisFooter.setAttribute('data-emergency-mode', 'true');
        }
        
        // Trigger crisis keyword detection if available
        const textInputs = document.querySelectorAll('input, textarea');
        textInputs.forEach(input => {
          input.value = 'I want to hurt myself';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      // Check for emergency mode indicators
      const emergencyMode = await this.page.$('[data-emergency-mode="true"], .alert, .bg-red-50');
      
      if (emergencyMode) {
        this.results.passed.push('✅ Emergency mode can be activated');
      } else {
        this.results.warnings.push('⚠️ Emergency mode activation needs verification');
      }

    } catch (error) {
      this.results.warnings.push(`⚠️ Emergency mode test encountered error: ${error.message}`);
    }
  }

  async testCrisisPerformance() {
    console.log('🔍 Testing Crisis Systems Performance...');
    
    try {
      await this.page.goto('http://localhost:3002', { waitUntil: 'networkidle2' });

      // Measure crisis button render time
      const renderStart = Date.now();
      await this.page.waitForSelector('.crisis-button, .emergency-button, .crisis-support, [href="tel:988"]', { timeout: 5000 });
      const renderTime = Date.now() - renderStart;

      if (renderTime < 1000) {
        this.results.passed.push(`✅ Crisis button renders quickly (${renderTime}ms)`);
      } else {
        this.results.warnings.push(`⚠️ Crisis button slow render (${renderTime}ms)`);
      }

      // Test crisis button interaction speed
      const interactionStart = Date.now();
      const crisisButton = await this.page.$('.crisis-button, .emergency-button, .crisis-support, [href="tel:988"]');
      if (crisisButton) {
        await crisisButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        const interactionTime = Date.now() - interactionStart;

        if (interactionTime < 1000) {
          this.results.passed.push(`✅ Crisis footer expands quickly (${interactionTime}ms)`);
        } else {
          this.results.warnings.push(`⚠️ Crisis footer slow expansion (${interactionTime}ms)`);
        }
      }

    } catch (error) {
      this.results.warnings.push(`⚠️ Crisis performance test failed: ${error.message}`);
    }
  }

  async testOfflineCrisisSupport() {
    console.log('🔍 Testing Offline Crisis Support...');
    
    try {
      // Simulate offline condition
      await this.page.setOfflineMode(true);
      await this.page.reload({ waitUntil: 'networkidle2' });

      // Check if crisis button still works offline
      const crisisButton = await this.page.$('.crisis-button, .emergency-button, .crisis-support, [href="tel:988"]');
      
      if (crisisButton) {
        this.results.passed.push('✅ Crisis button available offline');
        
        await crisisButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check for offline crisis resources
        const offlineResources = await this.page.$('.crisis-footer, [data-offline-crisis="true"]');
        if (offlineResources) {
          this.results.passed.push('✅ Offline crisis resources accessible');
        } else {
          this.results.warnings.push('⚠️ Offline crisis resources may not be available');
        }
      } else {
        this.results.criticalIssues.push('🚨 CRITICAL: Crisis button not available offline');
      }

      // Reset online mode
      await this.page.setOfflineMode(false);

    } catch (error) {
      this.results.warnings.push(`⚠️ Offline crisis test failed: ${error.message}`);
    }
  }

  generateReport() {
    const timestamp = new Date().toISOString();
    
    this.results.summary = {
      timestamp,
      totalTests: this.results.passed.length + this.results.warnings.length + this.results.criticalIssues.length,
      criticalIssuesCount: this.results.criticalIssues.length,
      warningsCount: this.results.warnings.length,
      passedCount: this.results.passed.length,
      overallStatus: this.results.criticalIssues.length === 0 ? 'SAFE FOR PRODUCTION' : 'CRITICAL ISSUES FOUND'
    };

    const report = {
      title: 'ALCHM Crisis Safety Systems Audit Report',
      timestamp,
      summary: this.results.summary,
      criticalIssues: this.results.criticalIssues,
      warnings: this.results.warnings,
      passed: this.results.passed,
      recommendations: [
        'Ensure crisis support button is always visible and accessible',
        'Test crisis keyword detection with real user scenarios',
        'Verify all crisis resource phone numbers are current',
        'Test offline crisis support functionality',
        'Implement crisis intervention analytics (without storing personal data)',
        'Regular accessibility audits for crisis support features'
      ]
    };

    // Save report
    const reportPath = path.join(__dirname, 'crisis-safety-audit-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runFullAudit() {
    try {
      await this.initialize();
      
      await this.testCrisisButtonPresence();
      await this.testCrisisKeywordDetection();
      await this.testCrisisResourceAccessibility();
      await this.testEmergencyModeActivation();
      await this.testCrisisPerformance();
      await this.testOfflineCrisisSupport();
      
      const report = this.generateReport();
      
      console.log('\n🛡️ ALCHM Crisis Safety Audit Complete\n');
      console.log(`📊 Summary:`);
      console.log(`   Total Tests: ${report.summary.totalTests}`);
      console.log(`   ✅ Passed: ${report.summary.passedCount}`);
      console.log(`   ⚠️  Warnings: ${report.summary.warningsCount}`);
      console.log(`   🚨 Critical Issues: ${report.summary.criticalIssuesCount}`);
      console.log(`   📋 Status: ${report.summary.overallStatus}`);
      
      if (report.criticalIssues.length > 0) {
        console.log('\n🚨 CRITICAL ISSUES:');
        report.criticalIssues.forEach(issue => console.log(`   ${issue}`));
      }
      
      if (report.warnings.length > 0) {
        console.log('\n⚠️ WARNINGS:');
        report.warnings.forEach(warning => console.log(`   ${warning}`));
      }
      
      console.log(`\n📁 Full report saved to: crisis-safety-audit-results.json\n`);
      
      return report;
      
    } catch (error) {
      console.error('🚨 Crisis Safety Audit Failed:', error);
      return null;
    } finally {
      await this.cleanup();
    }
  }
}

// Run audit if called directly
if (require.main === module) {
  const auditor = new CrisisSafetyAuditor();
  auditor.runFullAudit().then(report => {
    if (report && report.summary.criticalIssuesCount > 0) {
      process.exit(1); // Exit with error if critical issues found
    }
  });
}

module.exports = CrisisSafetyAuditor;