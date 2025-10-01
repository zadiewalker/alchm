#!/usr/bin/env node

/**
 * QUICK MOBILE TRAUMA-INFORMED AUDIT
 * Fast validation of critical mobile accessibility features
 */

const fs = require('fs').promises;
const path = require('path');

class QuickMobileAudit {
  constructor() {
    this.results = {
      touchTargets: { compliant: 0, nonCompliant: 0, issues: [] },
      crisisFeatures: { found: 0, issues: [] },
      traumaInformedCSS: { rules: 0, coverage: [] },
      recommendations: []
    };
  }

  async runAudit() {
    console.log('🔍 Starting Quick Mobile Trauma-Informed Audit...\n');
    
    try {
      await this.auditTouchTargetCSS();
      await this.auditCrisisComponents();
      await this.auditTraumaInformedStyles();
      await this.auditMobileComponents();
      
      this.generateQuickReport();
    } catch (error) {
      console.error('❌ Audit failed:', error);
      process.exit(1);
    }
  }

  async auditTouchTargetCSS() {
    console.log('👆 Auditing touch target CSS...');
    
    try {
      const traumaCSSPath = path.join(__dirname, '../src/styles/mobile-trauma-informed.css');
      const traumaCSS = await fs.readFile(traumaCSSPath, 'utf8');
      
      // Check for touch-safe class definitions
      const touchSafeMatches = traumaCSS.match(/\.touch-safe[^{]*{[^}]*min-height:\s*(\d+)px/g);
      const touchCrisisMatches = traumaCSS.match(/\.touch-crisis[^{]*{[^}]*min-height:\s*(\d+)px/g);
      const touchTargetMatches = traumaCSS.match(/\.touch-target[^{]*{[^}]*min-height:\s*(\d+)px/g);
      
      console.log(`  ✅ Found ${touchSafeMatches?.length || 0} .touch-safe definitions`);
      console.log(`  ✅ Found ${touchCrisisMatches?.length || 0} .touch-crisis definitions`);
      console.log(`  ✅ Found ${touchTargetMatches?.length || 0} .touch-target definitions`);
      
      // Validate minimum sizes
      const allTouchTargets = [...(touchSafeMatches || []), ...(touchCrisisMatches || []), ...(touchTargetMatches || [])];
      
      allTouchTargets.forEach(match => {
        const heightMatch = match.match(/min-height:\s*(\d+)px/);
        if (heightMatch) {
          const height = parseInt(heightMatch[1]);
          const isCrisis = match.includes('crisis');
          const minRequired = isCrisis ? 70 : 60;
          
          if (height >= minRequired) {
            this.results.touchTargets.compliant++;
          } else {
            this.results.touchTargets.nonCompliant++;
            this.results.touchTargets.issues.push({
              class: match.match(/\.([\w-]+)/)[1],
              currentSize: height,
              requiredSize: minRequired,
              severity: isCrisis ? 'critical' : 'high'
            });
          }
        }
      });
      
      // Check for trauma-informed hover states
      const hoverStates = traumaCSS.match(/:hover[^{]*{[^}]*}/g);
      console.log(`  ✅ Found ${hoverStates?.length || 0} hover state definitions`);
      
    } catch (error) {
      this.results.touchTargets.issues.push({
        error: `Could not read trauma-informed CSS: ${error.message}`,
        severity: 'high'
      });
    }
  }

  async auditCrisisComponents() {
    console.log('🆘 Auditing crisis components...');
    
    const componentPaths = [
      '../src/components/ui/CrisisFloatingButtonNew.tsx',
      '../src/components/mobile/TraumaInformedMobileUX.tsx',
      '../src/components/mobile/CrisisSafeMobileProvider.tsx'
    ];
    
    for (const componentPath of componentPaths) {
      try {
        const fullPath = path.join(__dirname, componentPath);
        const content = await fs.readFile(fullPath, 'utf8');
        
        // Check for crisis-specific features
        const features = {
          hasEmergencyCall: content.includes('tel:988') || content.includes('href="tel:'),
          hasCrisisDetection: content.includes('crisis') && content.includes('detect'),
          hasHapticFeedback: content.includes('vibrate'),
          hasTouchOptimization: content.includes('touchAction') || content.includes('touch-action'),
          hasAriaLabels: content.includes('aria-label'),
          hasMinTouchSize: content.includes('minHeight') && /minHeight.*5[6-9]|[6-9]\d/.test(content)
        };
        
        const componentName = path.basename(componentPath, '.tsx');
        console.log(`  📱 ${componentName}:`);
        Object.entries(features).forEach(([feature, present]) => {
          console.log(`    ${present ? '✅' : '❌'} ${feature}`);
          if (present) this.results.crisisFeatures.found++;
        });
        
        // Check for crisis keywords and implementations
        const crisisKeywords = ['crisis', 'emergency', '988', 'suicide', 'help'];
        const foundKeywords = crisisKeywords.filter(keyword => 
          content.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (foundKeywords.length > 0) {
          console.log(`    🔍 Crisis keywords found: ${foundKeywords.join(', ')}`);
        }
        
      } catch (error) {
        this.results.crisisFeatures.issues.push({
          component: path.basename(componentPath),
          error: error.message,
          severity: 'medium'
        });
      }
    }
  }

  async auditTraumaInformedStyles() {
    console.log('💚 Auditing trauma-informed style coverage...');
    
    try {
      const globalCSSPath = path.join(__dirname, '../src/app/globals.css');
      const globalCSS = await fs.readFile(globalCSSPath, 'utf8');
      
      // Check for trauma-informed imports
      const traumaImports = [
        'mobile-trauma-informed.css',
        'jony-ive-master-system.css',
        'sanctuary.css'
      ];
      
      traumaImports.forEach(importFile => {
        if (globalCSS.includes(importFile)) {
          console.log(`  ✅ ${importFile} imported`);
          this.results.traumaInformedCSS.coverage.push(importFile);
        } else {
          console.log(`  ❌ ${importFile} missing`);
          this.results.traumaInformedCSS.issues?.push({
            file: importFile,
            error: 'Not imported in globals.css',
            severity: 'medium'
          });
        }
      });
      
    } catch (error) {
      console.log(`  ❌ Could not audit global CSS: ${error.message}`);
    }
  }

  async auditMobileComponents() {
    console.log('📱 Auditing mobile-specific components...');
    
    const mobileComponentsDir = path.join(__dirname, '../src/components/mobile');
    
    try {
      const files = await fs.readdir(mobileComponentsDir);
      const tsxFiles = files.filter(file => file.endsWith('.tsx'));
      
      console.log(`  📂 Found ${tsxFiles.length} mobile components:`);
      
      for (const file of tsxFiles) {
        const filePath = path.join(mobileComponentsDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        
        // Check for mobile-specific optimizations
        const optimizations = {
          hasPerformanceTier: content.includes('usePerformanceTier') || content.includes('PerformanceTier'),
          hasBatteryAware: content.includes('battery') || content.includes('Battery'),
          hasTouchOptimization: content.includes('touch') && (content.includes('optimization') || content.includes('Optimization')),
          hasOfflineSupport: content.includes('offline') || content.includes('Offline'),
          hasCrisisMode: content.includes('crisis') && content.includes('mode')
        };
        
        const optimizationCount = Object.values(optimizations).filter(Boolean).length;
        console.log(`    📱 ${file}: ${optimizationCount}/5 optimizations`);
        
        if (optimizationCount < 3) {
          this.results.recommendations.push(
            `Enhance ${file} with additional mobile optimizations (${optimizationCount}/5 present)`
          );
        }
      }
      
    } catch (error) {
      console.log(`  ❌ Could not audit mobile components: ${error.message}`);
    }
  }

  generateQuickReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 QUICK MOBILE TRAUMA-INFORMED AUDIT REPORT');
    console.log('='.repeat(60));
    
    // Touch Targets Summary
    console.log('\n👆 TOUCH TARGETS SUMMARY:');
    console.log(`  ✅ Compliant: ${this.results.touchTargets.compliant}`);
    console.log(`  ❌ Non-compliant: ${this.results.touchTargets.nonCompliant}`);
    
    if (this.results.touchTargets.issues.length > 0) {
      console.log('\n  🚨 ISSUES TO FIX:');
      this.results.touchTargets.issues.forEach(issue => {
        if (issue.class) {
          console.log(`    .${issue.class}: ${issue.currentSize}px → needs ${issue.requiredSize}px (${issue.severity})`);
        } else {
          console.log(`    ${issue.error} (${issue.severity})`);
        }
      });
    }
    
    // Crisis Features Summary
    console.log('\n🆘 CRISIS FEATURES SUMMARY:');
    console.log(`  ✅ Crisis features found: ${this.results.crisisFeatures.found}`);
    
    if (this.results.crisisFeatures.issues.length > 0) {
      console.log('\n  ⚠️  COMPONENT ISSUES:');
      this.results.crisisFeatures.issues.forEach(issue => {
        console.log(`    ${issue.component}: ${issue.error} (${issue.severity})`);
      });
    }
    
    // Style Coverage Summary
    console.log('\n💚 TRAUMA-INFORMED STYLE COVERAGE:');
    console.log(`  ✅ Style files imported: ${this.results.traumaInformedCSS.coverage.length}/3`);
    this.results.traumaInformedCSS.coverage.forEach(file => {
      console.log(`    ✅ ${file}`);
    });
    
    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      this.results.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }
    
    // Overall Assessment
    const criticalIssues = [...this.results.touchTargets.issues, ...this.results.crisisFeatures.issues]
      .filter(issue => issue.severity === 'critical').length;
    
    const highIssues = [...this.results.touchTargets.issues, ...this.results.crisisFeatures.issues]
      .filter(issue => issue.severity === 'high').length;
    
    const totalCriticalAndHigh = criticalIssues + highIssues;
    
    console.log('\n🎯 MOBILE READINESS ASSESSMENT:');
    
    if (totalCriticalAndHigh === 0) {
      console.log('  🎉 EXCELLENT - Ready for trauma-informed mobile users');
    } else if (totalCriticalAndHigh < 3) {
      console.log('  💛 GOOD - Minor improvements needed');
    } else {
      console.log('  🔴 NEEDS WORK - Critical issues must be addressed');
    }
    
    console.log(`  Critical Issues: ${criticalIssues}`);
    console.log(`  High Priority Issues: ${highIssues}`);
    console.log(`  Touch Target Compliance: ${this.results.touchTargets.compliant}/${this.results.touchTargets.compliant + this.results.touchTargets.nonCompliant}`);
    console.log(`  Crisis Features: ${this.results.crisisFeatures.found} detected`);
    
    if (totalCriticalAndHigh === 0) {
      console.log('\n✨ ALCHM mobile experience is trauma-informed and crisis-ready!');
    } else {
      console.log(`\n📋 Address ${totalCriticalAndHigh} issues to improve mobile accessibility for vulnerable users.`);
    }
    
    console.log('\n' + '='.repeat(60));
  }
}

// Run audit
if (require.main === module) {
  const audit = new QuickMobileAudit();
  audit.runAudit().catch(error => {
    console.error('Audit failed:', error);
    process.exit(1);
  });
}

module.exports = QuickMobileAudit;