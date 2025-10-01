#!/usr/bin/env node

/**
 * ALCHM Design System Verification
 * Ensures Jony Ive design principles are properly implemented
 */

const fs = require('fs');
const path = require('path');

class DesignSystemVerifier {
  constructor() {
    this.results = {
      foundation: {},
      components: {},
      pages: {},
      accessibility: {},
      performance: {}
    };
  }

  async verifyFoundation() {
    console.log('🎨 Verifying Design Foundation...');
    
    // Check if core CSS files exist
    const foundationFile = 'src/styles/alchm-jony-ive-foundation.css';
    const layoutFile = 'src/styles/layout.css';
    const globalsFile = 'src/app/globals.css';
    
    this.results.foundation.coreFiles = {
      foundation: fs.existsSync(foundationFile),
      layout: fs.existsSync(layoutFile),
      globals: fs.existsSync(globalsFile)
    };
    
    // Verify design tokens are present
    if (fs.existsSync(foundationFile)) {
      const foundationContent = fs.readFileSync(foundationFile, 'utf8');
      this.results.foundation.designTokens = {
        sageColors: foundationContent.includes('--sage-primary: #a4b792'),
        spacingSystem: foundationContent.includes('--space-unit: 8px'),
        touchTargets: foundationContent.includes('--touch-default: 44px'),
        animations: foundationContent.includes('--ease-gentle'),
        crisisColors: foundationContent.includes('--crisis-red')
      };
    }
    
    // Verify globals.css imports design system
    if (fs.existsSync(globalsFile)) {
      const globalsContent = fs.readFileSync(globalsFile, 'utf8');
      this.results.foundation.imports = {
        foundationImported: globalsContent.includes('alchm-jony-ive-foundation.css'),
        layoutImported: globalsContent.includes('layout.css')
      };
    }
    
    console.log('   ✅ Foundation verification complete');
  }

  async verifyComponents() {
    console.log('🧱 Verifying Sacred Components...');
    
    const componentPaths = [
      'src/components/layout/SacredLayout.tsx',
      'src/components/ui/button.tsx',
      'src/components/ui/card.tsx'
    ];
    
    for (const componentPath of componentPaths) {
      const componentName = path.basename(componentPath, '.tsx');
      this.results.components[componentName] = {
        exists: fs.existsSync(componentPath),
        implemented: false
      };
      
      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        
        // Check for Jony Ive design principles in components
        this.results.components[componentName].principles = {
          sacredNaming: content.includes('sacred') || content.includes('Sacred'),
          traumaInformed: content.includes('trauma') || content.includes('touch-'),
          gentleAnimations: content.includes('motion') || content.includes('animate'),
          accessibilityFirst: content.includes('aria-') || content.includes('role='),
          crisisAware: content.includes('crisis') || content.includes('emergency')
        };
        
        this.results.components[componentName].implemented = true;
      }
    }
    
    console.log('   ✅ Component verification complete');
  }

  async verifyPages() {
    console.log('📄 Verifying Sacred Pages...');
    
    const pagePaths = [
      { path: 'src/app/page.tsx', name: 'landing' },
      { path: 'src/app/journal/sacred-page.tsx', name: 'journal' },
      { path: 'src/app/pricing/sacred-page.tsx', name: 'pricing' }
    ];
    
    for (const { path: pagePath, name } of pagePaths) {
      this.results.pages[name] = {
        exists: fs.existsSync(pagePath),
        principles: {}
      };
      
      if (fs.existsSync(pagePath)) {
        const content = fs.readFileSync(pagePath, 'utf8');
        
        // Verify Jony Ive principles implementation
        this.results.pages[name].principles = {
          radicalSimplification: content.includes('SacredLayout') || content.includes('sacred-hero'),
          singlePrimaryAction: content.match(/alchm-button--primary/g)?.length <= 1,
          materialHonesty: content.includes('sanctuary') || content.includes('healing'),
          attentionToDetail: content.includes('motion.') || content.includes('transition'),
          traumaInformed: content.includes('gentle') || content.includes('Sacred')
        };
      }
    }
    
    console.log('   ✅ Page verification complete');
  }

  async verifyAccessibility() {
    console.log('♿ Verifying Accessibility Features...');
    
    // Check for accessibility patterns in foundation CSS
    const foundationFile = 'src/styles/alchm-jony-ive-foundation.css';
    if (fs.existsSync(foundationFile)) {
      const content = fs.readFileSync(foundationFile, 'utf8');
      
      this.results.accessibility = {
        reducedMotion: content.includes('prefers-reduced-motion'),
        highContrast: content.includes('prefers-contrast: high'),
        focusVisible: content.includes('focus-visible'),
        touchTargets: content.includes('min-height: var(--touch-'),
        crisisAccessibility: content.includes('crisis-mode'),
        emergencyMode: content.includes('emergency-mode')
      };
    }
    
    console.log('   ✅ Accessibility verification complete');
  }

  async verifyPerformance() {
    console.log('⚡ Verifying Performance Optimizations...');
    
    // Check for performance-conscious patterns
    const foundationFile = 'src/styles/alchm-jony-ive-foundation.css';
    if (fs.existsSync(foundationFile)) {
      const content = fs.readFileSync(foundationFile, 'utf8');
      
      this.results.performance = {
        gentleAnimations: content.includes('200ms') || content.includes('300ms'),
        batteryOptimization: content.includes('animation-duration: 4s'),
        systemFonts: content.includes('-apple-system'),
        mobileBatteryConscious: content.includes('@media (max-width: 768px)'),
        reducedAnimationIntensity: content.includes('animation-duration: 4s')
      };
    }
    
    console.log('   ✅ Performance verification complete');
  }

  calculateDesignScore() {
    let totalChecks = 0;
    let passedChecks = 0;
    
    // Count foundation checks
    Object.values(this.results.foundation).forEach(section => {
      if (typeof section === 'object') {
        Object.values(section).forEach(check => {
          totalChecks++;
          if (check === true) passedChecks++;
        });
      }
    });
    
    // Count component checks
    Object.values(this.results.components).forEach(component => {
      if (component.principles) {
        Object.values(component.principles).forEach(check => {
          totalChecks++;
          if (check === true) passedChecks++;
        });
      }
    });
    
    // Count page checks
    Object.values(this.results.pages).forEach(page => {
      if (page.principles) {
        Object.values(page.principles).forEach(check => {
          totalChecks++;
          if (check === true) passedChecks++;
        });
      }
    });
    
    // Count accessibility checks
    Object.values(this.results.accessibility).forEach(check => {
      totalChecks++;
      if (check === true) passedChecks++;
    });
    
    // Count performance checks
    Object.values(this.results.performance).forEach(check => {
      totalChecks++;
      if (check === true) passedChecks++;
    });
    
    return Math.round((passedChecks / totalChecks) * 100);
  }

  generateReport() {
    const score = this.calculateDesignScore();
    
    console.log('\n🎨 ALCHM DESIGN SYSTEM VERIFICATION REPORT');
    console.log('==========================================');
    
    console.log(`\n📊 Overall Design System Score: ${score}%`);
    
    if (score >= 90) {
      console.log('✅ EXCELLENT: Design system embodies Jony Ive\'s principles');
    } else if (score >= 80) {
      console.log('⚠️  GOOD: Design system mostly aligned with principles');
    } else if (score >= 70) {
      console.log('⚠️  WARNING: Design system needs refinement');
    } else {
      console.log('❌ CRITICAL: Design system requires major improvements');
    }
    
    // Detailed results
    console.log('\n🎯 FOUNDATION VERIFICATION:');
    console.log('   Core Files:', this.results.foundation.coreFiles);
    console.log('   Design Tokens:', this.results.foundation.designTokens);
    console.log('   Imports:', this.results.foundation.imports);
    
    console.log('\n🧱 COMPONENT VERIFICATION:');
    Object.entries(this.results.components).forEach(([name, result]) => {
      console.log(`   ${name}:`, result.implemented ? '✅' : '❌');
    });
    
    console.log('\n📄 PAGE VERIFICATION:');
    Object.entries(this.results.pages).forEach(([name, result]) => {
      console.log(`   ${name}:`, result.exists ? '✅' : '❌');
    });
    
    console.log('\n♿ ACCESSIBILITY FEATURES:');
    const accessibilityScore = Object.values(this.results.accessibility)
      .filter(v => v === true).length;
    console.log(`   ${accessibilityScore}/6 accessibility features implemented`);
    
    console.log('\n⚡ PERFORMANCE OPTIMIZATIONS:');
    const performanceScore = Object.values(this.results.performance)
      .filter(v => v === true).length;
    console.log(`   ${performanceScore}/5 performance optimizations active`);
    
    return {
      score,
      results: this.results,
      summary: {
        foundation: Object.values(this.results.foundation.coreFiles || {}).filter(v => v).length,
        components: Object.values(this.results.components).filter(c => c.implemented).length,
        pages: Object.values(this.results.pages).filter(p => p.exists).length,
        accessibility: accessibilityScore,
        performance: performanceScore
      }
    };
  }

  async runVerification() {
    console.log('🚀 Starting ALCHM Design System Verification...\n');
    
    await this.verifyFoundation();
    await this.verifyComponents();
    await this.verifyPages();
    await this.verifyAccessibility();
    await this.verifyPerformance();
    
    const report = this.generateReport();
    
    // Save detailed results
    fs.writeFileSync('./design-system-verification-results.json', 
      JSON.stringify(report, null, 2));
    
    console.log('\n📄 Detailed results saved to: design-system-verification-results.json');
    
    return report;
  }
}

// Run verification if called directly
if (require.main === module) {
  const verifier = new DesignSystemVerifier();
  verifier.runVerification()
    .then((report) => {
      process.exit(report.score >= 80 ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

module.exports = DesignSystemVerifier;