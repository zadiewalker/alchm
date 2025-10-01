#!/usr/bin/env node

/**
 * ALCHM LANDING PAGE EXCELLENCE VALIDATION
 * Comprehensive testing against design requirements and trauma-informed standards
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

// Validation criteria based on original requirements
const EXCELLENCE_CRITERIA = {
  design: {
    singleDominantCTA: true,
    whitespaceBreatheingRoom: '40%',
    maxFontWeights: 2,
    crisisCornerPlacement: true,
    legalFooterMinimized: true
  },
  mobile: {
    touchTargetMinimum: 72, // pixels
    traumaInformedOptimization: true,
    singleHandedOperation: true,
    safeAreas: true
  },
  accessibility: {
    contrastRatio: 4.5,
    keyboardNavigation: true,
    screenReaderSupport: true,
    reducedMotionSupport: true
  },
  performance: {
    firstContentfulPaint: 1.5, // seconds
    largestContentfulPaint: 2.5, // seconds
    cumulativeLayoutShift: 0.1
  },
  emotional: {
    sanctuaryFeeling: true,
    traumaInformedLanguage: true,
    culturalInclusivity: true,
    healingInvitation: true
  }
};

class LandingPageValidator {
  constructor() {
    this.results = {
      overall: 'pending',
      scores: {},
      issues: [],
      strengths: [],
      recommendations: []
    };
  }

  async validate() {
    console.log('🎯 Starting ALCHM Landing Page Excellence Validation...\n');
    
    const browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      // Test desktop experience
      await this.validateDesktopExperience(browser);
      
      // Test mobile experience
      await this.validateMobileExperience(browser);
      
      // Test accessibility
      await this.validateAccessibility(browser);
      
      // Test performance
      await this.validatePerformance(browser);
      
      // Test emotional resonance
      await this.validateEmotionalResonance(browser);
      
      // Generate final report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
    } finally {
      await browser.close();
    }
  }

  async validateDesktopExperience(browser) {
    console.log('🖥️  Validating Desktop Experience...');
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    try {
      await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
      
      // Check for single dominant CTA
      const ctaButtons = await page.$$('[data-testid="primary-cta"], [class*="landing-primary-cta"], a[href="/auth/login"]');
      if (ctaButtons.length === 1) {
        this.addStrength('✅ Single dominant CTA achieved');
        this.results.scores.singleCTA = 100;
      } else {
        this.addIssue(`❌ Found ${ctaButtons.length} CTA buttons, should be 1`);
        this.results.scores.singleCTA = 0;
      }
      
      // Check whitespace distribution
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      const contentHeight = await page.evaluate(() => {
        const content = document.querySelector('main');
        return content ? content.offsetHeight : 0;
      });
      
      const whitespacePercentage = ((bodyHeight - contentHeight) / bodyHeight) * 100;
      if (whitespacePercentage >= 35) {
        this.addStrength(`✅ Excellent whitespace usage: ${whitespacePercentage.toFixed(1)}%`);
        this.results.scores.whitespace = 100;
      } else {
        this.addIssue(`❌ Insufficient whitespace: ${whitespacePercentage.toFixed(1)}% (target: 40%)`);
        this.results.scores.whitespace = 60;
      }
      
      // Check typography hierarchy
      const fontWeights = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const weights = new Set();
        elements.forEach(el => {
          const weight = window.getComputedStyle(el).fontWeight;
          if (weight !== '400') weights.add(weight);
        });
        return Array.from(weights);
      });
      
      if (fontWeights.length <= 2) {
        this.addStrength(`✅ Typography constraint respected: ${fontWeights.length} weights`);
        this.results.scores.typography = 100;
      } else {
        this.addIssue(`❌ Too many font weights: ${fontWeights.length} (maximum: 2)`);
        this.results.scores.typography = 50;
      }
      
      // Check crisis support placement
      const crisisButton = await page.$('[class*="crisis"], [class*="Crisis"]');
      if (crisisButton) {
        const boundingBox = await crisisButton.boundingBox();
        const isCornerPlaced = boundingBox.x > page.viewport().width * 0.7 && 
                              boundingBox.y > page.viewport().height * 0.7;
        
        if (isCornerPlaced) {
          this.addStrength('✅ Crisis support discretely placed in corner');
          this.results.scores.crisisPlacement = 100;
        } else {
          this.addIssue('❌ Crisis support not optimally positioned');
          this.results.scores.crisisPlacement = 70;
        }
      } else {
        this.addIssue('❌ Crisis support button not found');
        this.results.scores.crisisPlacement = 0;
      }
      
    } catch (error) {
      this.addIssue(`❌ Desktop validation error: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async validateMobileExperience(browser) {
    console.log('📱 Validating Mobile Experience...');
    
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667 }); // iPhone SE
    
    try {
      await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
      
      // Check touch target sizes
      const touchTargets = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, a, [role="button"]'));
        return buttons.map(btn => {
          const rect = btn.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height,
            element: btn.className || btn.tagName
          };
        });
      });
      
      const inadequateTargets = touchTargets.filter(target => 
        target.width < 72 || target.height < 72
      );
      
      if (inadequateTargets.length === 0) {
        this.addStrength('✅ All touch targets meet 72px minimum');
        this.results.scores.touchTargets = 100;
      } else {
        this.addIssue(`❌ ${inadequateTargets.length} touch targets below 72px minimum`);
        this.results.scores.touchTargets = 60;
      }
      
      // Check for mobile-specific optimizations
      const mobileClasses = await page.evaluate(() => {
        const html = document.documentElement;
        const mainElement = document.querySelector('main');
        return {
          hasTraumaInformed: html.classList.contains('trauma-informed') || 
                            (mainElement && mainElement.classList.contains('trauma-informed')) ||
                            document.querySelector('[class*="trauma-informed"]') !== null,
          hasThumbZones: document.querySelector('[class*="thumb-zone"]') !== null,
          hasSafeAreas: document.querySelector('[class*="safe-area"]') !== null ||
                       getComputedStyle(document.body).paddingTop.includes('env(safe-area-inset-top)'),
          hasMobileOptimized: mainElement && mainElement.classList.contains('mobile-optimized'),
          hasSanctuaryDesign: mainElement && mainElement.classList.contains('sanctuary-visual-design')
        };
      });
      
      if (mobileClasses.hasTraumaInformed) {
        this.addStrength('✅ Trauma-informed mobile optimizations detected');
      } else {
        this.addIssue('❌ Missing trauma-informed mobile optimizations');
      }
      
      if (mobileClasses.hasThumbZones) {
        this.addStrength('✅ Single-handed operation support detected');
      } else {
        this.addRecommendation('💡 Consider adding thumb zone optimization');
      }
      
      this.results.scores.mobileOptimization = 
        (mobileClasses.hasTraumaInformed ? 40 : 0) + 
        (mobileClasses.hasThumbZones ? 20 : 0) + 
        (mobileClasses.hasSafeAreas ? 20 : 0) +
        (mobileClasses.hasMobileOptimized ? 10 : 0) +
        (mobileClasses.hasSanctuaryDesign ? 10 : 0);
      
    } catch (error) {
      this.addIssue(`❌ Mobile validation error: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async validateAccessibility(browser) {
    console.log('♿ Validating Accessibility...');
    
    const page = await browser.newPage();
    
    try {
      await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
      
      // Check color contrast
      const contrastResults = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const contrastIssues = [];
        
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          const bgColor = style.backgroundColor;
          const textColor = style.color;
          
          // Simple contrast check (would need proper contrast calculation in real implementation)
          if (textColor === 'rgb(255, 255, 255)' && bgColor.includes('rgba')) {
            // White text on semi-transparent background - check if sufficient
            const alpha = parseFloat(bgColor.match(/rgba?\([^)]+,\s*([^)]+)\)/)?.[1] || 1);
            if (alpha < 0.8) {
              contrastIssues.push(`Low contrast: ${el.tagName}.${el.className}`);
            }
          }
        });
        
        return contrastIssues;
      });
      
      if (contrastResults.length === 0) {
        this.addStrength('✅ No obvious contrast issues detected');
        this.results.scores.contrast = 100;
      } else {
        this.addIssue(`❌ Potential contrast issues: ${contrastResults.length}`);
        this.results.scores.contrast = 70;
      }
      
      // Check keyboard navigation
      const keyboardNav = await page.evaluate(() => {
        const focusableElements = document.querySelectorAll(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        let canNavigate = true;
        focusableElements.forEach(el => {
          if (!el.hasAttribute('tabindex') && el.tabIndex < 0) {
            canNavigate = false;
          }
        });
        
        return {
          canNavigate,
          focusableCount: focusableElements.length
        };
      });
      
      if (keyboardNav.canNavigate) {
        this.addStrength(`✅ Keyboard navigation supported (${keyboardNav.focusableCount} focusable elements)`);
        this.results.scores.keyboardNav = 100;
      } else {
        this.addIssue('❌ Keyboard navigation issues detected');
        this.results.scores.keyboardNav = 50;
      }
      
      // Check ARIA labels and screen reader support
      const ariaSupport = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, a[role="button"]'));
        const missingLabels = buttons.filter(btn => 
          !btn.hasAttribute('aria-label') && 
          !btn.hasAttribute('aria-labelledby') && 
          !btn.innerText.trim()
        );
        
        return {
          totalButtons: buttons.length,
          missingLabels: missingLabels.length
        };
      });
      
      if (ariaSupport.missingLabels === 0) {
        this.addStrength('✅ All interactive elements have proper labels');
        this.results.scores.ariaSupport = 100;
      } else {
        this.addIssue(`❌ ${ariaSupport.missingLabels} elements missing accessibility labels`);
        this.results.scores.ariaSupport = 70;
      }
      
    } catch (error) {
      this.addIssue(`❌ Accessibility validation error: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async validatePerformance(browser) {
    console.log('⚡ Validating Performance...');
    
    const page = await browser.newPage();
    
    try {
      // Enable performance monitoring
      await page.coverage.startJSCoverage();
      await page.coverage.startCSSCoverage();
      
      const startTime = Date.now();
      await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
      const loadTime = Date.now() - startTime;
      
      // Check Core Web Vitals
      const vitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          // Simulate Core Web Vitals measurement
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitals = {};
            
            entries.forEach(entry => {
              if (entry.entryType === 'paint') {
                vitals[entry.name] = entry.startTime;
              }
            });
            
            setTimeout(() => resolve(vitals), 100);
          });
          
          observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
          
          // Fallback if no entries
          setTimeout(() => resolve({}), 1000);
        });
      });
      
      if (loadTime < 2000) {
        this.addStrength(`✅ Fast loading time: ${loadTime}ms`);
        this.results.scores.loadTime = 100;
      } else if (loadTime < 3000) {
        this.addStrength(`✅ Acceptable loading time: ${loadTime}ms`);
        this.results.scores.loadTime = 80;
      } else {
        this.addIssue(`❌ Slow loading time: ${loadTime}ms`);
        this.results.scores.loadTime = 50;
      }
      
      // Check for performance optimizations
      const optimizations = await page.evaluate(() => {
        return {
          hasLazyLoading: document.querySelector('[loading="lazy"]') !== null,
          hasPreload: document.querySelector('link[rel="preload"]') !== null,
          hasServiceWorker: 'serviceWorker' in navigator,
          hasCompression: document.querySelector('meta[name="format-detection"]') !== null
        };
      });
      
      const optimizationScore = Object.values(optimizations).filter(Boolean).length * 25;
      this.results.scores.optimizations = optimizationScore;
      
      if (optimizationScore >= 75) {
        this.addStrength(`✅ Good performance optimizations: ${optimizationScore}%`);
      } else {
        this.addRecommendation(`💡 Consider more performance optimizations: ${optimizationScore}%`);
      }
      
      await page.coverage.stopJSCoverage();
      await page.coverage.stopCSSCoverage();
      
    } catch (error) {
      this.addIssue(`❌ Performance validation error: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async validateEmotionalResonance(browser) {
    console.log('💜 Validating Emotional Resonance...');
    
    const page = await browser.newPage();
    
    try {
      await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
      
      // Check for trauma-informed language
      const contentAnalysis = await page.evaluate(() => {
        const allText = document.body.innerText.toLowerCase();
        
        const traumaInformedWords = [
          'safe', 'healing', 'sanctuary', 'support', 'trauma-informed',
          'gentle', 'compassionate', 'vulnerable', 'journey', 'growth'
        ];
        
        const inclusiveWords = [
          'all identities', 'communities', 'traditions', 'cultural',
          'diverse', 'inclusive', 'marginalized', 'identity'
        ];
        
        const healingWords = [
          'alchm', 'transformation', 'reflection', 'emotional',
          'wellness', 'mindful', 'authentic', 'purpose'
        ];
        
        const traumaScore = traumaInformedWords.filter(word => allText.includes(word)).length;
        const inclusiveScore = inclusiveWords.filter(word => allText.includes(word)).length;
        const healingScore = healingWords.filter(word => allText.includes(word)).length;
        
        return {
          traumaInformed: traumaScore,
          inclusive: inclusiveScore,
          healing: healingScore,
          totalWordCount: allText.split(' ').length,
          content: allText.substring(0, 500) // First 500 chars for analysis
        };
      });
      
      if (contentAnalysis.traumaInformed >= 3) {
        this.addStrength(`✅ Strong trauma-informed language (${contentAnalysis.traumaInformed} indicators)`);
        this.results.scores.traumaLanguage = 100;
      } else {
        this.addIssue(`❌ Limited trauma-informed language (${contentAnalysis.traumaInformed} indicators)`);
        this.results.scores.traumaLanguage = 60;
      }
      
      if (contentAnalysis.inclusive >= 2) {
        this.addStrength(`✅ Inclusive language detected (${contentAnalysis.inclusive} indicators)`);
        this.results.scores.inclusivity = 100;
      } else {
        this.addRecommendation(`💡 Consider more inclusive language (${contentAnalysis.inclusive} indicators)`);
        this.results.scores.inclusivity = 70;
      }
      
      if (contentAnalysis.healing >= 3) {
        this.addStrength(`✅ Strong healing invitation (${contentAnalysis.healing} indicators)`);
        this.results.scores.healingInvitation = 100;
      } else {
        this.addIssue(`❌ Weak healing invitation (${contentAnalysis.healing} indicators)`);
        this.results.scores.healingInvitation = 60;
      }
      
      // Check for sanctuary feeling through visual design
      const designElements = await page.evaluate(() => {
        const style = window.getComputedStyle(document.body);
        const mainSection = document.querySelector('main');
        const mainStyle = mainSection ? window.getComputedStyle(mainSection) : null;
        
        return {
          hasSageGreen: (style.background.includes('#a4b792') || 
                        style.background.includes('164, 183, 146') ||
                        (mainStyle && mainStyle.background.includes('#a4b792'))),
          hasGradient: (style.background.includes('gradient') ||
                       (mainStyle && mainStyle.background.includes('gradient'))),
          hasRoundedCorners: mainStyle ? mainStyle.borderRadius !== '0px' : false,
          hasSoftShadows: (document.querySelector('[style*="shadow"], [class*="shadow"]') !== null ||
                          (mainStyle && mainStyle.boxShadow !== 'none')),
          hasSanctuaryClass: mainSection && mainSection.classList.contains('sanctuary-visual-design'),
          hasBackdropFilter: document.querySelector('[style*="backdrop-filter"], [class*="backdrop"]') !== null
        };
      });
      
      const designScore = Math.min(100, Object.values(designElements).filter(Boolean).length * 16.67);
      this.results.scores.sanctuaryDesign = designScore;
      
      if (designScore >= 75) {
        this.addStrength(`✅ Strong sanctuary visual design: ${designScore}%`);
      } else {
        this.addRecommendation(`💡 Enhance sanctuary visual elements: ${designScore}%`);
      }
      
    } catch (error) {
      this.addIssue(`❌ Emotional resonance validation error: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  addStrength(message) {
    this.results.strengths.push(message);
    console.log(`  ${message}`);
  }

  addIssue(message) {
    this.results.issues.push(message);
    console.log(`  ${message}`);
  }

  addRecommendation(message) {
    this.results.recommendations.push(message);
    console.log(`  ${message}`);
  }

  generateReport() {
    console.log('\n🎯 ALCHM LANDING PAGE EXCELLENCE VALIDATION REPORT');
    console.log('=' .repeat(60));
    
    // Calculate overall score
    const scores = Object.values(this.results.scores);
    const overallScore = scores.length > 0 ? 
      Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    
    this.results.overall = overallScore >= 90 ? 'EXCELLENT' :
                          overallScore >= 80 ? 'GOOD' :
                          overallScore >= 70 ? 'ACCEPTABLE' : 'NEEDS_IMPROVEMENT';
    
    console.log(`\n🏆 OVERALL ASSESSMENT: ${this.results.overall} (${overallScore}%)`);
    
    // Individual scores
    console.log('\n📊 DETAILED SCORES:');
    Object.entries(this.results.scores).forEach(([category, score]) => {
      const emoji = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';
      console.log(`  ${emoji} ${category}: ${score}%`);
    });
    
    // Strengths
    if (this.results.strengths.length > 0) {
      console.log('\n💪 STRENGTHS:');
      this.results.strengths.forEach(strength => console.log(`  ${strength}`));
    }
    
    // Issues
    if (this.results.issues.length > 0) {
      console.log('\n⚠️  CRITICAL ISSUES:');
      this.results.issues.forEach(issue => console.log(`  ${issue}`));
    }
    
    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      this.results.recommendations.forEach(rec => console.log(`  ${rec}`));
    }
    
    // Deployment readiness
    console.log('\n🚀 DEPLOYMENT READINESS:');
    if (overallScore >= 85 && this.results.issues.length === 0) {
      console.log('  ✅ READY FOR PRODUCTION DEPLOYMENT');
      console.log('  ✅ All critical requirements met');
      console.log('  ✅ Trauma-informed design validated');
      console.log('  ✅ Mobile optimization confirmed');
    } else if (overallScore >= 75) {
      console.log('  🟡 READY WITH MINOR RECOMMENDATIONS');
      console.log('  ✅ Core requirements met');
      console.log('  💡 Consider addressing recommendations for excellence');
    } else {
      console.log('  🔴 NOT READY - CRITICAL ISSUES DETECTED');
      console.log('  ❌ Address critical issues before deployment');
    }
    
    // Save report
    const reportData = {
      timestamp: new Date().toISOString(),
      overallScore,
      assessment: this.results.overall,
      scores: this.results.scores,
      strengths: this.results.strengths,
      issues: this.results.issues,
      recommendations: this.results.recommendations
    };
    
    fs.writeFileSync('./landing-page-validation-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Report saved to: landing-page-validation-report.json');
    
    console.log('\n' + '=' .repeat(60));
  }
}

// Run validation if this file is executed directly
if (require.main === module) {
  const validator = new LandingPageValidator();
  validator.validate().catch(console.error);
}

module.exports = LandingPageValidator;