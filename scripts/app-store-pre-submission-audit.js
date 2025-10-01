#!/usr/bin/env node
/**
 * ALCHM App Store Pre-Submission Compliance Audit
 * 
 * Comprehensive testing suite for iOS App Store submission readiness.
 * Mental health apps face heightened scrutiny - this ensures compliance.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class AppStoreAuditor {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      critical: []
    };
    this.startTime = Date.now();
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  pass(check, details = '') {
    this.results.passed.push({ check, details });
    this.log(`✅ ${check}${details ? ` - ${details}` : ''}`, 'green');
  }

  fail(check, details = '', critical = false) {
    const result = { check, details };
    if (critical) {
      this.results.critical.push(result);
      this.log(`❌ CRITICAL: ${check}${details ? ` - ${details}` : ''}`, 'red');
    } else {
      this.results.failed.push(result);
      this.log(`❌ ${check}${details ? ` - ${details}` : ''}`, 'red');
    }
  }

  warn(check, details = '') {
    this.results.warnings.push({ check, details });
    this.log(`⚠️  ${check}${details ? ` - ${details}` : ''}`, 'yellow');
  }

  info(message) {
    this.log(`ℹ️  ${message}`, 'blue');
  }

  checkFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
      this.pass(`${description} exists`, filePath);
      return true;
    } else {
      this.fail(`${description} missing`, filePath, true);
      return false;
    }
  }

  checkFileSize(filePath, maxSize, description) {
    if (!fs.existsSync(filePath)) return false;
    
    const stats = fs.statSync(filePath);
    const sizeKB = stats.size / 1024;
    
    if (sizeKB <= maxSize) {
      this.pass(`${description} size OK`, `${sizeKB.toFixed(1)}KB (max: ${maxSize}KB)`);
      return true;
    } else {
      this.fail(`${description} too large`, `${sizeKB.toFixed(1)}KB (max: ${maxSize}KB)`);
      return false;
    }
  }

  // 1. MEDICAL DISCLAIMER AND LEGAL COMPLIANCE
  auditMedicalCompliance() {
    this.log('\n🏥 MEDICAL DISCLAIMER & LEGAL COMPLIANCE', 'bold');
    
    // Check medical disclaimer component
    const medicalDisclaimerPath = 'src/components/ui/MedicalDisclaimer.tsx';
    if (this.checkFileExists(medicalDisclaimerPath, 'Medical Disclaimer Component')) {
      const content = fs.readFileSync(medicalDisclaimerPath, 'utf8');
      
      // Check for required disclaimer elements
      const requiredTexts = [
        'not therapy',
        'not medical treatment',
        'licensed professional',
        '988',
        '911',
        'crisis'
      ];
      
      requiredTexts.forEach(text => {
        if (content.toLowerCase().includes(text)) {
          this.pass(`Medical disclaimer contains: "${text}"`);
        } else {
          this.fail(`Medical disclaimer missing: "${text}"`, '', true);
        }
      });
    }
    
    // Check privacy policy
    const privacyPolicyPath = 'public/privacy-policy.html';
    if (this.checkFileExists(privacyPolicyPath, 'Privacy Policy')) {
      const content = fs.readFileSync(privacyPolicyPath, 'utf8');
      
      // Check COPPA compliance
      if (content.includes('COPPA') && content.includes('17 years')) {
        this.pass('COPPA age verification present');
      } else {
        this.fail('COPPA compliance missing or incorrect age limit', '', true);
      }
      
      // Check crisis intervention limitations
      if (content.includes('Crisis Intervention Limitations')) {
        this.pass('Crisis intervention limitations disclosed');
      } else {
        this.fail('Crisis intervention limitations not disclosed', '', true);
      }
    }
  }

  // 2. CRISIS INTERVENTION FEATURES
  auditCrisisFeatures() {
    this.log('\n🚨 CRISIS INTERVENTION FEATURES', 'bold');
    
    // Check crisis support components
    const crisisComponents = [
      'src/components/ui/CrisisSupport.tsx',
      'src/components/ui/EmergencyCrisisButton.tsx',
      'src/components/ui/CrisisFloatingButton.tsx'
    ];
    
    crisisComponents.forEach(component => {
      this.checkFileExists(component, `Crisis component: ${path.basename(component)}`);
    });
    
    // Check crisis resources file
    const crisisResourcesPath = 'public/crisis-resources.json';
    if (this.checkFileExists(crisisResourcesPath, 'Crisis Resources JSON')) {
      try {
        const content = JSON.parse(fs.readFileSync(crisisResourcesPath, 'utf8'));
        
        // Verify required crisis numbers
        const requiredNumbers = ['988', '911', '741741'];
        requiredNumbers.forEach(number => {
          const found = JSON.stringify(content).includes(number);
          if (found) {
            this.pass(`Crisis resource includes: ${number}`);
          } else {
            this.fail(`Crisis resource missing: ${number}`, '', true);
          }
        });
      } catch (e) {
        this.fail('Crisis resources JSON invalid', e.message);
      }
    }
  }

  // 3. ACCESSIBILITY COMPLIANCE
  auditAccessibility() {
    this.log('\n♿ ACCESSIBILITY COMPLIANCE', 'bold');
    
    // Check accessibility helper
    const accessibilityPath = 'src/components/ui/AccessibilityHelper.tsx';
    if (this.checkFileExists(accessibilityPath, 'Accessibility Helper Component')) {
      const content = fs.readFileSync(accessibilityPath, 'utf8');
      
      const accessibilityFeatures = [
        'aria-live',
        'aria-label',
        'sr-only',
        'focus',
        'VoiceOver',
        'prefers-reduced-motion',
        'prefers-contrast'
      ];
      
      accessibilityFeatures.forEach(feature => {
        if (content.includes(feature)) {
          this.pass(`Accessibility feature: ${feature}`);
        } else {
          this.warn(`Accessibility feature missing: ${feature}`);
        }
      });
    }
    
    // Check for minimum touch targets (44pt)
    this.info('Checking touch target sizes in Tailwind config...');
    const tailwindPath = 'tailwind.config.ts';
    if (fs.existsSync(tailwindPath)) {
      const content = fs.readFileSync(tailwindPath, 'utf8');
      if (content.includes('44') || content.includes('min-h-') || content.includes('min-w-')) {
        this.pass('Touch target size considerations found');
      } else {
        this.warn('Consider adding 44pt minimum touch target utilities');
      }
    }
  }

  // 4. PERFORMANCE REQUIREMENTS
  auditPerformance() {
    this.log('\n⚡ PERFORMANCE REQUIREMENTS', 'bold');
    
    // Check bundle sizes
    const buildPath = '.next';
    if (fs.existsSync(buildPath)) {
      this.pass('Production build exists');
      
      // Check for large bundle warnings in build output
      try {
        const buildOutput = execSync('npm run build 2>&1 || true', { encoding: 'utf8' });
        
        if (buildOutput.includes('asset size limit')) {
          this.warn('Bundle size warnings detected', 'Consider code splitting');
        } else {
          this.pass('No bundle size warnings');
        }
        
        if (buildOutput.includes('entrypoint size limit')) {
          this.warn('Entry point size warnings detected', 'Consider lazy loading');
        } else {
          this.pass('Entry point sizes acceptable');
        }
      } catch (e) {
        this.warn('Could not check build output', e.message);
      }
    } else {
      this.fail('No production build found', 'Run npm run build first', true);
    }
    
    // Check for performance monitoring
    const performancePaths = [
      'src/lib/core-web-vitals-monitor.ts',
      'src/components/PerformanceMonitor.tsx'
    ];
    
    performancePaths.forEach(perfPath => {
      if (fs.existsSync(perfPath)) {
        this.pass(`Performance monitoring: ${path.basename(perfPath)}`);
      } else {
        this.warn(`Performance monitoring missing: ${path.basename(perfPath)}`);
      }
    });
  }

  // 5. PRIVACY AND DATA PROTECTION
  auditPrivacy() {
    this.log('\n🔒 PRIVACY & DATA PROTECTION', 'bold');
    
    // Check privacy-related components
    const privacyComponents = [
      'src/components/ui/PrivacyStrip.tsx',
      'src/components/ui/AITransparency.tsx',
      'src/components/ui/AIConsentFlow.tsx'
    ];
    
    privacyComponents.forEach(component => {
      if (fs.existsSync(component)) {
        this.pass(`Privacy component: ${path.basename(component)}`);
      } else {
        this.warn(`Privacy component missing: ${path.basename(component)}`);
      }
    });
    
    // Check for data export functionality
    const dataExportPaths = [
      'src/app/api/privacy/export',
      'src/app/api/privacy/delete'
    ];
    
    dataExportPaths.forEach(apiPath => {
      if (fs.existsSync(apiPath)) {
        this.pass(`Privacy API: ${path.basename(apiPath)}`);
      } else {
        this.fail(`Privacy API missing: ${path.basename(apiPath)}`, 'Required for GDPR compliance');
      }
    });
  }

  // 6. APP STORE ASSETS
  auditAppStoreAssets() {
    this.log('\n📱 APP STORE ASSETS', 'bold');
    
    // Check for icon files
    const iconSizes = [
      { size: '1024x1024', path: 'public/icons/icon-1024.png', desc: 'App Store Icon' },
      { size: '180x180', path: 'public/icons/icon-180.png', desc: 'iPhone App Icon' },
      { size: '167x167', path: 'public/icons/icon-167.png', desc: 'iPad Pro Icon' },
      { size: '152x152', path: 'public/icons/icon-152.png', desc: 'iPad Icon' }
    ];
    
    iconSizes.forEach(icon => {
      if (this.checkFileExists(icon.path, `${icon.desc} (${icon.size})`)) {
        // Check file size (should be reasonable)
        this.checkFileSize(icon.path, 200, icon.desc);
      }
    });
    
    // Check for screenshot directory
    const screenshotPath = 'app-store/screenshots';
    if (fs.existsSync(screenshotPath)) {
      this.pass('Screenshot directory exists');
      
      const screenshots = fs.readdirSync(screenshotPath).filter(f => f.endsWith('.png'));
      if (screenshots.length >= 3) {
        this.pass(`${screenshots.length} screenshots found`);
      } else {
        this.fail('Insufficient screenshots', 'Need at least 3 for App Store');
      }
    } else {
      this.fail('Screenshot directory missing', 'app-store/screenshots/', true);
    }
    
    // Check for metadata
    const metadataPath = 'app-store/app-store-config.json';
    if (this.checkFileExists(metadataPath, 'App Store Metadata')) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        
        const requiredFields = ['name', 'description', 'keywords', 'category'];
        requiredFields.forEach(field => {
          if (metadata[field]) {
            this.pass(`Metadata field: ${field}`);
          } else {
            this.fail(`Metadata missing: ${field}`, '', true);
          }
        });
        
        // Check description length
        if (metadata.description && metadata.description.length >= 80) {
          this.pass('App description length adequate');
        } else {
          this.warn('App description may be too short', 'Consider expanding for better discovery');
        }
      } catch (e) {
        this.fail('App Store metadata invalid JSON', e.message);
      }
    }
  }

  // 7. TECHNICAL STANDARDS
  auditTechnicalStandards() {
    this.log('\n🔧 TECHNICAL STANDARDS', 'bold');
    
    // Check Next.js configuration
    const nextConfigPath = 'next.config.js';
    if (this.checkFileExists(nextConfigPath, 'Next.js Configuration')) {
      const content = fs.readFileSync(nextConfigPath, 'utf8');
      
      if (content.includes('output: \'standalone\'')) {
        this.pass('Standalone output configured');
      } else {
        this.warn('Consider standalone output for deployment');
      }
      
      if (content.includes('images: {')) {
        this.pass('Image optimization configured');
      } else {
        this.warn('Image optimization not configured');
      }
    }
    
    // Check package.json for required scripts
    const packagePath = 'package.json';
    if (this.checkFileExists(packagePath, 'Package Configuration')) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      const requiredScripts = ['build', 'start', 'test'];
      requiredScripts.forEach(script => {
        if (pkg.scripts && pkg.scripts[script]) {
          this.pass(`Script configured: ${script}`);
        } else {
          this.fail(`Script missing: ${script}`, 'Required for app store builds');
        }
      });
      
      // Check Node.js version constraint
      if (pkg.engines && pkg.engines.node) {
        this.pass(`Node.js version constraint: ${pkg.engines.node}`);
      } else {
        this.warn('No Node.js version constraint', 'Consider adding for consistency');
      }
    }
    
    // Check for TypeScript configuration
    const tsconfigPath = 'tsconfig.json';
    if (this.checkFileExists(tsconfigPath, 'TypeScript Configuration')) {
      const content = fs.readFileSync(tsconfigPath, 'utf8');
      const tsconfig = JSON.parse(content);
      
      if (tsconfig.compilerOptions && tsconfig.compilerOptions.strict) {
        this.pass('TypeScript strict mode enabled');
      } else {
        this.warn('TypeScript strict mode not enabled');
      }
    }
  }

  // 8. CONTENT GUIDELINES
  auditContentGuidelines() {
    this.log('\n📝 CONTENT GUIDELINES', 'bold');
    
    // Check for inappropriate content in components
    const contentPaths = [
      'src/app',
      'src/components',
      'public'
    ];
    
    const inappropriateTerms = [
      'lorem ipsum',
      'placeholder',
      'TODO',
      'FIXME',
      'test test',
      'hello world'
    ];
    
    let foundInappropriate = false;
    
    contentPaths.forEach(dirPath => {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.html', '.json']);
          
          files.forEach(file => {
            const content = fs.readFileSync(file, 'utf8').toLowerCase();
            
            inappropriateTerms.forEach(term => {
              if (content.includes(term.toLowerCase())) {
                this.fail(`Inappropriate content found: "${term}"`, file);
                foundInappropriate = true;
              }
            });
          });
        } catch (e) {
          // Silent fail for permission issues
        }
      }
    });
    
    if (!foundInappropriate) {
      this.pass('No inappropriate placeholder content found');
    }
    
    // Check for proper attribution
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageJson.author) {
      this.pass('App author specified');
    } else {
      this.warn('App author not specified in package.json');
    }
  }

  // 9. ERROR HANDLING AND RESILIENCE
  auditErrorHandling() {
    this.log('\n🛡️  ERROR HANDLING & RESILIENCE', 'bold');
    
    // Check for error boundary
    const errorBoundaryPaths = [
      'src/components/ui/TraumaInformedErrorBoundary.tsx',
      'src/app/error.tsx',
      'src/app/global-error.tsx'
    ];
    
    let hasErrorHandling = false;
    errorBoundaryPaths.forEach(errorPath => {
      if (fs.existsSync(errorPath)) {
        this.pass(`Error handling: ${path.basename(errorPath)}`);
        hasErrorHandling = true;
      }
    });
    
    if (!hasErrorHandling) {
      this.fail('No error boundary components found', 'Add React error boundaries', true);
    }
    
    // Check for offline support
    const swPath = 'public/sw.js';
    if (fs.existsSync(swPath)) {
      this.pass('Service worker present for offline support');
    } else {
      this.warn('No service worker found', 'Consider offline support for crisis situations');
    }
    
    // Check for network error handling
    const networkPaths = [
      'src/lib/apiWrapper.ts',
      'src/lib/firebase.ts'
    ];
    
    networkPaths.forEach(netPath => {
      if (fs.existsSync(netPath)) {
        const content = fs.readFileSync(netPath, 'utf8');
        if (content.includes('catch') || content.includes('error')) {
          this.pass(`Network error handling: ${path.basename(netPath)}`);
        } else {
          this.warn(`No error handling in: ${path.basename(netPath)}`);
        }
      }
    });
  }

  // Helper method to get all files with specific extensions
  getAllFiles(dirPath, extensions) {
    const files = [];
    
    function traverse(currentPath) {
      const items = fs.readdirSync(currentPath);
      
      items.forEach(item => {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          traverse(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      });
    }
    
    traverse(dirPath);
    return files;
  }

  // Generate comprehensive report
  generateReport() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    this.log('\n' + '='.repeat(80), 'bold');
    this.log('📊 ALCHM APP STORE SUBMISSION AUDIT REPORT', 'bold');
    this.log('='.repeat(80), 'bold');
    
    this.log(`\n⏱️  Audit completed in ${duration} seconds\n`, 'cyan');
    
    // Summary
    this.log('📈 SUMMARY:', 'bold');
    this.log(`✅ Passed: ${this.results.passed.length}`, 'green');
    this.log(`❌ Failed: ${this.results.failed.length}`, 'red');
    this.log(`⚠️  Warnings: ${this.results.warnings.length}`, 'yellow');
    this.log(`🚨 Critical Issues: ${this.results.critical.length}`, 'magenta');
    
    // Critical issues (must fix before submission)
    if (this.results.critical.length > 0) {
      this.log('\n🚨 CRITICAL ISSUES (MUST FIX BEFORE SUBMISSION):', 'bold');
      this.results.critical.forEach((issue, index) => {
        this.log(`${index + 1}. ${issue.check}`, 'red');
        if (issue.details) {
          this.log(`   Details: ${issue.details}`, 'red');
        }
      });
    }
    
    // Failed checks
    if (this.results.failed.length > 0) {
      this.log('\n❌ FAILED CHECKS:', 'bold');
      this.results.failed.forEach((failure, index) => {
        this.log(`${index + 1}. ${failure.check}`, 'red');
        if (failure.details) {
          this.log(`   Details: ${failure.details}`, 'red');
        }
      });
    }
    
    // Warnings
    if (this.results.warnings.length > 0) {
      this.log('\n⚠️  WARNINGS (RECOMMENDED FIXES):', 'bold');
      this.results.warnings.forEach((warning, index) => {
        this.log(`${index + 1}. ${warning.check}`, 'yellow');
        if (warning.details) {
          this.log(`   Details: ${warning.details}`, 'yellow');
        }
      });
    }
    
    // Overall assessment
    const readinessScore = this.calculateReadinessScore();
    this.log('\n🎯 SUBMISSION READINESS ASSESSMENT:', 'bold');
    
    if (this.results.critical.length === 0 && this.results.failed.length === 0) {
      this.log('🟢 READY FOR SUBMISSION', 'green');
      this.log('All critical requirements met. You may proceed with App Store submission.', 'green');
    } else if (this.results.critical.length === 0) {
      this.log('🟡 MOSTLY READY', 'yellow');
      this.log('No critical issues, but some failed checks should be addressed.', 'yellow');
    } else {
      this.log('🔴 NOT READY FOR SUBMISSION', 'red');
      this.log('Critical issues must be resolved before submission.', 'red');
    }
    
    this.log(`\n📊 Readiness Score: ${readinessScore}%\n`, 'cyan');
    
    // Next steps
    this.log('🚀 NEXT STEPS:', 'bold');
    if (this.results.critical.length > 0) {
      this.log('1. Fix all critical issues listed above', 'yellow');
      this.log('2. Re-run this audit to verify fixes', 'yellow');
      this.log('3. Address failed checks and warnings', 'yellow');
    } else if (this.results.failed.length > 0) {
      this.log('1. Address failed checks listed above', 'yellow');
      this.log('2. Consider fixing warnings for better approval chances', 'yellow');
      this.log('3. Run final tests and prepare submission materials', 'yellow');
    } else {
      this.log('1. Review warnings and consider improvements', 'green');
      this.log('2. Prepare App Store submission materials', 'green');
      this.log('3. Submit to App Store Connect', 'green');
    }
    
    this.log('\n📱 App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/', 'blue');
    this.log('💙 Mental Health Apps Guidelines: Section 1.4 Safety and 5.1.1 Privacy', 'blue');
    
    // Save detailed report
    this.saveDetailedReport();
    
    return {
      readiness: readinessScore,
      critical: this.results.critical.length,
      failed: this.results.failed.length,
      warnings: this.results.warnings.length,
      passed: this.results.passed.length
    };
  }

  calculateReadinessScore() {
    const total = this.results.passed.length + this.results.failed.length + this.results.critical.length;
    const passed = this.results.passed.length;
    
    if (total === 0) return 0;
    
    // Critical issues heavily penalize score
    const criticalPenalty = this.results.critical.length * 20;
    const failedPenalty = this.results.failed.length * 10;
    
    const baseScore = Math.round((passed / total) * 100);
    const finalScore = Math.max(0, baseScore - criticalPenalty - failedPenalty);
    
    return finalScore;
  }

  saveDetailedReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      duration: ((Date.now() - this.startTime) / 1000).toFixed(2),
      readinessScore: this.calculateReadinessScore(),
      results: this.results,
      summary: {
        passed: this.results.passed.length,
        failed: this.results.failed.length,
        warnings: this.results.warnings.length,
        critical: this.results.critical.length
      }
    };
    
    const reportPath = 'app-store-submission-audit-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    this.log(`\n💾 Detailed report saved: ${reportPath}`, 'blue');
  }

  // Main audit runner
  async runFullAudit() {
    this.log('🚀 Starting ALCHM App Store Pre-Submission Audit...', 'bold');
    this.log('This audit checks compliance with App Store guidelines for mental health apps.\n', 'blue');
    
    try {
      // Run all audit sections
      this.auditMedicalCompliance();
      this.auditCrisisFeatures();
      this.auditAccessibility();
      this.auditPerformance();
      this.auditPrivacy();
      this.auditAppStoreAssets();
      this.auditTechnicalStandards();
      this.auditContentGuidelines();
      this.auditErrorHandling();
      
      // Generate final report
      return this.generateReport();
      
    } catch (error) {
      this.log('\n❌ Audit failed with error:', 'red');
      this.log(error.message, 'red');
      throw error;
    }
  }
}

// Run audit if called directly
if (require.main === module) {
  const auditor = new AppStoreAuditor();
  auditor.runFullAudit()
    .then(results => {
      const exitCode = results.critical > 0 ? 1 : 0;
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('Audit failed:', error);
      process.exit(1);
    });
}

module.exports = AppStoreAuditor;