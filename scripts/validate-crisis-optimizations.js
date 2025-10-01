#!/usr/bin/env node

/**
 * ALCHM Crisis Optimization Validation Script
 * 
 * Quick validation of crisis mobile optimizations without requiring Playwright.
 * This script validates the implementation files and checks for critical requirements.
 */

const fs = require('fs');
const path = require('path');

const CRITICAL_FILES = [
  '/Users/zadiewalker/Desktop/alchm/src/components/mobile/CrisisMobileInterface.tsx',
  '/Users/zadiewalker/Desktop/alchm/src/lib/mobile/mobile-core-web-vitals.ts',
  '/Users/zadiewalker/Desktop/alchm/src/lib/mobile/crisis-mobile-optimizer.ts',
  '/Users/zadiewalker/Desktop/alchm/public/crisis-sw.js'
];

const CRISIS_REQUIREMENTS = [
  {
    name: 'Core Web Vitals Monitoring',
    file: '/Users/zadiewalker/Desktop/alchm/src/lib/mobile/mobile-core-web-vitals.ts',
    patterns: [
      'LCP.*1200',      // LCP threshold 1.2s
      'FID.*50',        // FID threshold 50ms
      'CLS.*0\.05',     // CLS threshold 0.05
      'tremor',         // Tremor compensation
      'crisis'          // Crisis-specific handling
    ]
  },
  {
    name: 'Crisis Mobile Interface',
    file: '/Users/zadiewalker/Desktop/alchm/src/components/mobile/CrisisMobileInterface.tsx',
    patterns: [
      'tremor.*detection',
      'stress.*adaptation',
      'emergency.*mode',
      'battery.*optimization',
      'one.*handed',
      'touch.*target.*52'
    ]
  },
  {
    name: 'Crisis Service Worker',
    file: '/Users/zadiewalker/Desktop/alchm/public/crisis-sw.js',
    patterns: [
      'offline.*crisis',
      'emergency.*resources',
      'cache.*1200',     // Sub-1.2s loading
      'hotline',
      'battery.*aware'
    ]
  },
  {
    name: 'Crisis Mobile Optimizer',
    file: '/Users/zadiewalker/Desktop/alchm/src/lib/mobile/crisis-mobile-optimizer.ts',
    patterns: [
      'crisis.*detection',
      'panic.*keyword',
      'tremor.*detection',
      'battery.*conservation',
      'navigation.*confusion'
    ]
  }
];

class CrisisOptimizationValidator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      filesChecked: 0,
      requirementsPassed: 0,
      requirementsFailed: 0,
      criticalIssues: [],
      warnings: [],
      summary: ''
    };
  }

  validateFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        this.results.criticalIssues.push(`CRITICAL: File missing - ${filePath}`);
        return false;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const stats = fs.statSync(filePath);
      
      console.log(`✓ Found: ${path.basename(filePath)} (${(stats.size / 1024).toFixed(1)}KB)`);
      
      this.results.filesChecked++;
      return content;
    } catch (error) {
      this.results.criticalIssues.push(`ERROR reading ${filePath}: ${error.message}`);
      return false;
    }
  }

  validateRequirement(requirement) {
    console.log(`\n🔍 Validating: ${requirement.name}`);
    
    const content = this.validateFile(requirement.file);
    if (!content) {
      this.results.requirementsFailed++;
      return false;
    }

    let passed = 0;
    let total = requirement.patterns.length;

    requirement.patterns.forEach(pattern => {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(content)) {
        console.log(`  ✅ Found: ${pattern}`);
        passed++;
      } else {
        console.log(`  ❌ Missing: ${pattern}`);
        this.results.warnings.push(`${requirement.name}: Missing pattern "${pattern}"`);
      }
    });

    const passRate = (passed / total) * 100;
    console.log(`  📊 Coverage: ${passed}/${total} (${passRate.toFixed(1)}%)`);

    if (passRate >= 80) {
      this.results.requirementsPassed++;
      return true;
    } else {
      this.results.requirementsFailed++;
      if (passRate < 50) {
        this.results.criticalIssues.push(`${requirement.name}: Critical implementation gaps (${passRate.toFixed(1)}% coverage)`);
      }
      return false;
    }
  }

  validateCoreWebVitalsThresholds() {
    console.log(`\n🎯 Validating Core Web Vitals Crisis Thresholds`);
    
    const vitalsFile = '/Users/zadiewalker/Desktop/alchm/src/lib/mobile/mobile-core-web-vitals.ts';
    const content = this.validateFile(vitalsFile);
    
    if (!content) return false;

    const thresholds = {
      'LCP': { target: 1200, pattern: /LCP.*?(\d+)/ },
      'FID': { target: 50, pattern: /FID.*?(\d+)/ },
      'CLS': { target: 0.05, pattern: /CLS.*?(0\.\d+)/ }
    };

    let allThresholdsMet = true;

    Object.entries(thresholds).forEach(([metric, config]) => {
      const match = content.match(config.pattern);
      if (match) {
        const value = parseFloat(match[1]);
        const met = metric === 'CLS' ? value <= config.target : value <= config.target;
        
        if (met) {
          console.log(`  ✅ ${metric}: ${value} <= ${config.target} (crisis-safe)`);
        } else {
          console.log(`  ❌ ${metric}: ${value} > ${config.target} (NOT crisis-safe)`);
          this.results.criticalIssues.push(`${metric} threshold too high: ${value} > ${config.target}`);
          allThresholdsMet = false;
        }
      } else {
        console.log(`  ⚠️  ${metric}: Threshold not found`);
        this.results.warnings.push(`${metric} threshold not explicitly defined`);
      }
    });

    return allThresholdsMet;
  }

  validateTouchTargets() {
    console.log(`\n👆 Validating Touch Target Safety (52px minimum)`);
    
    const interfaceFile = '/Users/zadiewalker/Desktop/alchm/src/components/mobile/CrisisMobileInterface.tsx';
    const content = this.validateFile(interfaceFile);
    
    if (!content) return false;

    // Check for 52px minimum touch targets
    const touchTargetPatterns = [
      /min.*(?:width|height|size).*52/i,
      /touch.*target.*52/i,
      /tremor.*safe.*52/i,
      /button.*52/i
    ];

    let foundTouchTargets = false;
    touchTargetPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        console.log(`  ✅ Found tremor-safe touch targets (52px+)`);
        foundTouchTargets = true;
      }
    });

    if (!foundTouchTargets) {
      console.log(`  ❌ No 52px touch target requirements found`);
      this.results.criticalIssues.push('Touch targets may not meet 52px tremor-safety requirement');
    }

    return foundTouchTargets;
  }

  validateOfflineCapabilities() {
    console.log(`\n📱 Validating Offline Crisis Capabilities`);
    
    const swFile = '/Users/zadiewalker/Desktop/alchm/public/crisis-sw.js';
    const content = this.validateFile(swFile);
    
    if (!content) return false;

    const offlineFeatures = [
      { name: 'Crisis Resource Caching', pattern: /crisis.*cache/i },
      { name: 'Emergency Contacts Offline', pattern: /emergency.*offline/i },
      { name: 'Offline Writing', pattern: /offline.*writ/i },
      { name: 'Crisis Hotlines', pattern: /hotline/i },
      { name: 'Sub-1.2s Loading', pattern: /cache.*1200|1\.2.*cache/i }
    ];

    let offlineScore = 0;
    offlineFeatures.forEach(feature => {
      if (feature.pattern.test(content)) {
        console.log(`  ✅ ${feature.name}`);
        offlineScore++;
      } else {
        console.log(`  ❌ ${feature.name} - Not implemented`);
      }
    });

    const passRate = (offlineScore / offlineFeatures.length) * 100;
    console.log(`  📊 Offline Readiness: ${offlineScore}/${offlineFeatures.length} (${passRate.toFixed(1)}%)`);

    if (passRate < 80) {
      this.results.criticalIssues.push(`Insufficient offline capabilities: ${passRate.toFixed(1)}% (need 80%+)`);
    }

    return passRate >= 80;
  }

  generateSummary() {
    const totalRequirements = CRISIS_REQUIREMENTS.length + 3; // +3 for additional validations
    const totalPassed = this.results.requirementsPassed + 
      (this.validateCoreWebVitalsThresholds() ? 1 : 0) +
      (this.validateTouchTargets() ? 1 : 0) +
      (this.validateOfflineCapabilities() ? 1 : 0);

    const passRate = (totalPassed / totalRequirements) * 100;

    this.results.summary = `
🚨 ALCHM Crisis Optimization Validation Results
=============================================

📊 Overall Score: ${passRate.toFixed(1)}% (${totalPassed}/${totalRequirements} requirements met)

📁 Files Checked: ${this.results.filesChecked}
✅ Requirements Passed: ${this.results.requirementsPassed}
❌ Requirements Failed: ${this.results.requirementsFailed}
⚠️  Warnings: ${this.results.warnings.length}
🚨 Critical Issues: ${this.results.criticalIssues.length}

${this.results.criticalIssues.length > 0 ? `
🚨 CRITICAL ISSUES (MUST FIX BEFORE DEPLOYMENT):
${this.results.criticalIssues.map((issue, i) => `   ${i + 1}. ${issue}`).join('\n')}
` : '✅ No critical issues found!'}

${this.results.warnings.length > 0 ? `
⚠️  WARNINGS (RECOMMENDED FIXES):
${this.results.warnings.map((warning, i) => `   ${i + 1}. ${warning}`).join('\n')}
` : ''}

📋 CRISIS SAFETY CHECKLIST:
${passRate >= 90 ? '✅' : '❌'} Overall Implementation (${passRate.toFixed(1)}%)
${this.results.criticalIssues.length === 0 ? '✅' : '❌'} No Critical Safety Issues
${this.results.filesChecked === CRITICAL_FILES.length ? '✅' : '❌'} All Critical Files Present

${passRate >= 90 && this.results.criticalIssues.length === 0 ? 
'🎉 ALCHM is ready to safely support users in crisis!' : 
'⚠️  Additional work needed before crisis deployment.'}

Generated: ${this.results.timestamp}
`;

    return this.results;
  }

  async run() {
    console.log('🚨 ALCHM Crisis Optimization Validation\n');
    console.log('Validating implementation of trauma-informed mobile optimizations...\n');

    // Check all critical files exist
    console.log('📁 Checking Critical Files:');
    CRITICAL_FILES.forEach(filePath => {
      this.validateFile(filePath);
    });

    // Validate each requirement
    console.log('\n🔍 Validating Crisis Requirements:');
    for (const requirement of CRISIS_REQUIREMENTS) {
      this.validateRequirement(requirement);
    }

    // Additional specialized validations
    this.validateCoreWebVitalsThresholds();
    this.validateTouchTargets();
    this.validateOfflineCapabilities();

    // Generate final report
    const results = this.generateSummary();
    console.log(results.summary);

    // Write results to file
    const reportPath = '/Users/zadiewalker/Desktop/alchm/crisis-optimization-validation.json';
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Detailed results saved to: ${reportPath}`);

    return results;
  }
}

// Execute if run directly
if (require.main === module) {
  const validator = new CrisisOptimizationValidator();
  validator.run()
    .then(results => {
      const passRate = (results.requirementsPassed / CRISIS_REQUIREMENTS.length) * 100;
      process.exit(passRate >= 80 && results.criticalIssues.length === 0 ? 0 : 1);
    })
    .catch(error => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}

module.exports = CrisisOptimizationValidator;