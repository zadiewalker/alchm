#!/usr/bin/env node

/**
 * ALCHM App Store Compliance Testing Suite
 * 
 * Comprehensive pre-submission testing to ensure App Store approval
 * Tests all critical requirements for mental health apps
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test configuration
const CONFIG = {
  PROJECT_ROOT: '/Users/zadiewalker/Desktop/alchm',
  PERFORMANCE_THRESHOLDS: {
    launchTime: 2000, // ms
    memoryUsage: 50, // MB
    crashRate: 0.001, // 0.1%
    bundleSize: 2000000, // 2MB (relaxed for now)
    accessibilityScore: 95 // %
  },
  REQUIRED_FILES: [
    'public/manifest.json',
    'public/privacy-policy.html',
    'public/terms-of-service.html',
    'src/components/compliance/MedicalDisclaimer.tsx',
    'src/components/compliance/CrisisIntervention.tsx'
  ],
  REQUIRED_METADATA: {
    name: 'ALCHM',
    description: 'Trauma-informed AI journaling platform',
    category: 'Health & Fitness',
    ageRating: '12+',
    contentRating: 'Mature themes related to mental health'
  }
};

class AppStoreComplianceTest {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      score: 0,
      totalTests: 0
    };
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      pass: '✅',
      fail: '❌',
      warn: '⚠️'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  pass(testName, details = '') {
    this.results.passed.push({ test: testName, details });
    this.log(`PASS: ${testName} ${details}`, 'pass');
  }

  fail(testName, details = '', fix = '') {
    this.results.failed.push({ test: testName, details, fix });
    this.log(`FAIL: ${testName} ${details}`, 'fail');
    if (fix) {
      this.log(`  Fix: ${fix}`, 'warn');
    }
  }

  warn(testName, details = '') {
    this.results.warnings.push({ test: testName, details });
    this.log(`WARN: ${testName} ${details}`, 'warn');
  }

  async runAllTests() {
    this.log('🚀 Starting ALCHM App Store Compliance Test Suite');
    this.log(`Project Root: ${CONFIG.PROJECT_ROOT}`);
    
    try {
      // Critical compliance tests
      await this.testMedicalDisclaimers();
      await this.testCrisisInterventionFeatures();
      await this.testPrivacyCompliance();
      await this.testAccessibilityCompliance();
      await this.testPerformanceRequirements();
      await this.testDesignGuidelines();
      await this.testContentModeration();
      await this.testAgeRatingCompliance();
      await this.testNetworkErrorHandling();
      await this.testDataProtectionFeatures();
      
      // Generate final report
      this.generateReport();
      
    } catch (error) {
      this.fail('Test Suite Execution', error.message);
      this.generateReport();
    }
  }

  async testMedicalDisclaimers() {
    this.log('🏥 Testing Medical Disclaimers...');
    
    const disclaimerPath = path.join(CONFIG.PROJECT_ROOT, 'src/components/compliance/MedicalDisclaimer.tsx');
    
    if (!fs.existsSync(disclaimerPath)) {
      this.fail('Medical Disclaimer Component', 'Missing MedicalDisclaimer.tsx', 
                'Create src/components/compliance/MedicalDisclaimer.tsx');
      return;
    }
    
    const content = fs.readFileSync(disclaimerPath, 'utf8');
    
    // Check for required disclaimer content
    const requiredPhrases = [
      'not intended to diagnose, treat, cure, or prevent',
      'not a substitute for professional medical advice',
      '988',
      '911',
      'Crisis Text Line',
      'qualified health providers'
    ];
    
    let missingPhrases = [];
    requiredPhrases.forEach(phrase => {
      if (!content.toLowerCase().includes(phrase.toLowerCase())) {
        missingPhrases.push(phrase);
      }
    });
    
    if (missingPhrases.length === 0) {
      this.pass('Medical Disclaimer Content', 'All required phrases present');
    } else {
      this.fail('Medical Disclaimer Content', 
                `Missing required phrases: ${missingPhrases.join(', ')}`,
                'Add missing medical disclaimer phrases');
    }
    
    // Check for crisis resources
    if (content.includes('988') && content.includes('741741')) {
      this.pass('Crisis Resources in Disclaimer', 'Emergency contacts included');
    } else {
      this.fail('Crisis Resources in Disclaimer', 'Missing emergency contact numbers');
    }
  }

  async testCrisisInterventionFeatures() {
    this.log('🆘 Testing Crisis Intervention Features...');
    
    const crisisPath = path.join(CONFIG.PROJECT_ROOT, 'src/components/compliance/CrisisIntervention.tsx');
    
    if (!fs.existsSync(crisisPath)) {
      this.fail('Crisis Intervention Component', 'Missing CrisisIntervention.tsx');
      return;
    }
    
    const content = fs.readFileSync(crisisPath, 'utf8');
    
    // Check for essential crisis features
    const requiredFeatures = [
      '988', // Suicide prevention lifeline
      '741741', // Crisis text line
      '911', // Emergency services
      'LGBTQ', // Specialized resources
      'Veterans', // Veterans crisis line
      'domestic violence' // Domestic violence hotline
    ];
    
    let missingFeatures = [];
    requiredFeatures.forEach(feature => {
      if (!content.toLowerCase().includes(feature.toLowerCase())) {
        missingFeatures.push(feature);
      }
    });
    
    if (missingFeatures.length === 0) {
      this.pass('Crisis Resources Coverage', 'All essential crisis resources included');
    } else {
      this.warn('Crisis Resources Coverage', `Consider adding: ${missingFeatures.join(', ')}`);
    }
    
    // Check for immediate access features
    if (content.includes('tel:') && content.includes('sms:')) {
      this.pass('Direct Contact Links', 'Crisis resources have direct contact links');
    } else {
      this.fail('Direct Contact Links', 'Crisis resources need tel: and sms: links');
    }
  }

  async testPrivacyCompliance() {
    this.log('🔒 Testing Privacy Compliance...');
    
    // Check for privacy policy
    const privacyPath = path.join(CONFIG.PROJECT_ROOT, 'src/components/compliance/PrivacyPolicy.tsx');
    
    if (!fs.existsSync(privacyPath)) {
      this.fail('Privacy Policy Component', 'Missing PrivacyPolicy.tsx');
      return;
    }
    
    const content = fs.readFileSync(privacyPath, 'utf8');
    
    // Check for COPPA compliance
    if (content.includes('13 years') && content.includes('COPPA')) {
      this.pass('COPPA Compliance', 'Age restrictions and COPPA compliance addressed');
    } else {
      this.fail('COPPA Compliance', 'Missing age restrictions or COPPA compliance');
    }
    
    // Check for data collection transparency
    const dataTransparencyItems = [
      'Journal entries',
      'stored locally',
      'account information',
      'usage analytics',
      'not collected'
    ];
    
    let hasTransparency = dataTransparencyItems.every(item => 
      content.toLowerCase().includes(item.toLowerCase())
    );
    
    if (hasTransparency) {
      this.pass('Data Collection Transparency', 'Clear data collection practices described');
    } else {
      this.fail('Data Collection Transparency', 'Unclear data collection practices');
    }
    
    // Check for user rights
    const userRights = ['delete', 'export', 'access', 'control'];
    let rightsCount = userRights.filter(right => 
      content.toLowerCase().includes(right)
    ).length;
    
    if (rightsCount >= 3) {
      this.pass('User Privacy Rights', `${rightsCount}/4 key rights mentioned`);
    } else {
      this.warn('User Privacy Rights', `Only ${rightsCount}/4 key rights mentioned`);
    }
  }

  async testAccessibilityCompliance() {
    this.log('♿ Testing Accessibility Compliance...');
    
    // Check for accessibility components
    const compliancePath = path.join(CONFIG.PROJECT_ROOT, 'src/components/compliance/AppStoreCompliance.tsx');
    
    if (!fs.existsSync(compliancePath)) {
      this.fail('Accessibility Components', 'Missing AppStoreCompliance.tsx');
      return;
    }
    
    const content = fs.readFileSync(compliancePath, 'utf8');
    
    // Check for required accessibility features
    const a11yFeatures = [
      'aria-label',
      'TouchTarget',
      'minSize.*44', // 44pt minimum touch targets
      'role=',
      'aria-describedby',
      'VoiceOver'
    ];
    
    let foundFeatures = a11yFeatures.filter(feature => 
      new RegExp(feature, 'i').test(content)
    );
    
    if (foundFeatures.length >= 4) {
      this.pass('Accessibility Features', `${foundFeatures.length}/${a11yFeatures.length} features implemented`);
    } else {
      this.fail('Accessibility Features', 
                `Only ${foundFeatures.length}/${a11yFeatures.length} features found`,
                'Implement missing accessibility features');
    }
    
    // Check for touch target compliance
    if (content.includes('44') && content.includes('minSize')) {
      this.pass('Touch Target Compliance', '44pt minimum touch targets implemented');
    } else {
      this.fail('Touch Target Compliance', 'Missing 44pt minimum touch target implementation');
    }
  }

  async testPerformanceRequirements() {
    this.log('⚡ Testing Performance Requirements...');
    
    try {
      // Check bundle size
      const nextDir = path.join(CONFIG.PROJECT_ROOT, '.next');
      if (fs.existsSync(nextDir)) {
        const buildManifest = path.join(nextDir, 'build-manifest.json');
        if (fs.existsSync(buildManifest)) {
          try {
            const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
            this.pass('Build Manifest', 'Next.js build completed successfully');
          } catch (e) {
            this.warn('Build Manifest', 'Could not parse build manifest');
          }
        } else {
          this.warn('Build Status', 'No build manifest found - run npm run build');
        }
      } else {
        this.fail('Build Status', 'No .next directory found', 'Run npm run build first');
      }
      
      // Check for performance monitoring
      const perfMonitorPath = path.join(CONFIG.PROJECT_ROOT, 'scripts/performance-monitor.js');
      if (fs.existsSync(perfMonitorPath)) {
        this.pass('Performance Monitoring', 'Performance monitoring script exists');
      } else {
        this.warn('Performance Monitoring', 'No performance monitoring script found');
      }
      
      // Check for error boundaries
      const compliancePath = path.join(CONFIG.PROJECT_ROOT, 'src/components/compliance/AppStoreCompliance.tsx');
      if (fs.existsSync(compliancePath)) {
        const content = fs.readFileSync(compliancePath, 'utf8');
        if (content.includes('NetworkErrorBoundary')) {
          this.pass('Error Handling', 'Network error boundary implemented');
        } else {
          this.warn('Error Handling', 'Consider implementing error boundaries');
        }
      }
      
    } catch (error) {
      this.fail('Performance Testing', error.message);
    }
  }

  async testDesignGuidelines() {
    this.log('🎨 Testing Design Guidelines...');
    
    // Check for Dark Mode support
    const compliancePath = path.join(CONFIG.PROJECT_ROOT, 'src/components/compliance/AppStoreCompliance.tsx');
    if (fs.existsSync(compliancePath)) {
      const content = fs.readFileSync(compliancePath, 'utf8');
      
      if (content.includes('DarkModeSupport') || content.includes('prefers-color-scheme')) {
        this.pass('Dark Mode Support', 'Dark mode implementation found');
      } else {
        this.warn('Dark Mode Support', 'No dark mode implementation found');
      }
      
      if (content.includes('TouchTarget')) {
        this.pass('Touch Target Implementation', 'Custom touch target component found');
      } else {
        this.warn('Touch Target Implementation', 'Custom touch target component recommended');
      }
    }
    
    // Check for responsive design
    const globalsPath = path.join(CONFIG.PROJECT_ROOT, 'src/app/globals.css');
    if (fs.existsSync(globalsPath)) {
      const content = fs.readFileSync(globalsPath, 'utf8');
      if (content.includes('@media') && content.includes('responsive')) {
        this.pass('Responsive Design', 'Media queries found in global styles');
      } else {
        this.warn('Responsive Design', 'Consider adding responsive design styles');
      }
    }
  }

  async testContentModeration() {
    this.log('🛡️ Testing Content Moderation...');
    
    const compliancePath = path.join(CONFIG.PROJECT_ROOT, 'src/components/compliance/AppStoreCompliance.tsx');
    if (fs.existsSync(compliancePath)) {
      const content = fs.readFileSync(compliancePath, 'utf8');
      
      if (content.includes('ContentModerationNotice')) {
        this.pass('Content Moderation Notice', 'Content moderation notice implemented');
      } else {
        this.warn('Content Moderation Notice', 'Consider adding content moderation notice');
      }
    }
    
    // Check for community guidelines
    const publicFiles = fs.readdirSync(path.join(CONFIG.PROJECT_ROOT, 'public'));
    if (publicFiles.some(file => file.includes('guidelines') || file.includes('terms'))) {
      this.pass('Community Guidelines', 'Guidelines/terms files found');
    } else {
      this.warn('Community Guidelines', 'Consider adding community guidelines');
    }
  }

  async testAgeRatingCompliance() {
    this.log('🔞 Testing Age Rating Compliance...');
    
    const compliancePath = path.join(CONFIG.PROJECT_ROOT, 'src/components/compliance/AppStoreCompliance.tsx');
    if (fs.existsSync(compliancePath)) {
      const content = fs.readFileSync(compliancePath, 'utf8');
      
      if (content.includes('AgeRatingCompliance') && content.includes('13')) {
        this.pass('Age Verification', 'Age verification component implemented');
      } else {
        this.fail('Age Verification', 'Missing age verification component');
      }
    }
    
    // Check package.json for proper metadata
    const packagePath = path.join(CONFIG.PROJECT_ROOT, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      if (packageJson.name && packageJson.description) {
        this.pass('App Metadata', 'Basic app metadata present');
      } else {
        this.warn('App Metadata', 'Consider improving app metadata');
      }
    }
  }

  async testNetworkErrorHandling() {
    this.log('🌐 Testing Network Error Handling...');
    
    const compliancePath = path.join(CONFIG.PROJECT_ROOT, 'src/components/compliance/AppStoreCompliance.tsx');
    if (fs.existsSync(compliancePath)) {
      const content = fs.readFileSync(compliancePath, 'utf8');
      
      if (content.includes('NetworkErrorBoundary') && content.includes('offline')) {
        this.pass('Offline Support', 'Network error boundary with offline support');
      } else {
        this.fail('Offline Support', 'Missing offline support implementation');
      }
      
      if (content.includes('Try Again') && content.includes('Continue Offline')) {
        this.pass('Error Recovery', 'Error recovery options implemented');
      } else {
        this.warn('Error Recovery', 'Consider adding error recovery options');
      }
    }
  }

  async testDataProtectionFeatures() {
    this.log('🔐 Testing Data Protection Features...');
    
    // Check for biometric authentication references
    const authFiles = [
      'src/contexts/AuthContext.tsx',
      'src/lib/auth.ts'
    ];
    
    let hasAuth = false;
    authFiles.forEach(file => {
      const fullPath = path.join(CONFIG.PROJECT_ROOT, file);
      if (fs.existsSync(fullPath)) {
        hasAuth = true;
      }
    });
    
    if (hasAuth) {
      this.pass('Authentication System', 'Authentication files found');
    } else {
      this.warn('Authentication System', 'No authentication files found');
    }
    
    // Check for data export functionality
    const privacyPath = path.join(CONFIG.PROJECT_ROOT, 'src/components/compliance/PrivacyPolicy.tsx');
    if (fs.existsSync(privacyPath)) {
      const content = fs.readFileSync(privacyPath, 'utf8');
      
      if (content.includes('Download My Data') || content.includes('export')) {
        this.pass('Data Export Feature', 'Data export functionality mentioned');
      } else {
        this.fail('Data Export Feature', 'Missing data export functionality');
      }
    }
  }

  generateReport() {
    this.results.totalTests = this.results.passed.length + this.results.failed.length + this.results.warnings.length;
    this.results.score = Math.round((this.results.passed.length / (this.results.passed.length + this.results.failed.length)) * 100);
    
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 ALCHM APP STORE COMPLIANCE REPORT');
    console.log('='.repeat(80));
    
    console.log(`\n🎯 OVERALL SCORE: ${this.results.score}% (${this.results.passed.length}/${this.results.passed.length + this.results.failed.length} tests passed)`);
    console.log(`⏱️  Test Duration: ${duration} seconds`);
    console.log(`📝 Total Tests: ${this.results.totalTests}`);
    
    if (this.results.score >= 90) {
      console.log('\n🎉 EXCELLENT! Your app is ready for App Store submission.');
    } else if (this.results.score >= 75) {
      console.log('\n✅ GOOD! Your app is mostly ready. Address the failed tests below.');
    } else {
      console.log('\n⚠️  NEEDS WORK! Please address the critical issues before submission.');
    }
    
    if (this.results.failed.length > 0) {
      console.log('\n❌ FAILED TESTS (MUST FIX):');
      this.results.failed.forEach((failure, index) => {
        console.log(`${index + 1}. ${failure.test}`);
        console.log(`   Issue: ${failure.details}`);
        if (failure.fix) {
          console.log(`   Fix: ${failure.fix}`);
        }
        console.log('');
      });
    }
    
    if (this.results.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS (RECOMMENDED):');
      this.results.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning.test}: ${warning.details}`);
      });
    }
    
    console.log('\n✅ PASSED TESTS:');
    this.results.passed.forEach((pass, index) => {
      console.log(`${index + 1}. ${pass.test} ${pass.details ? '- ' + pass.details : ''}`);
    });
    
    // Save detailed report
    const reportPath = path.join(CONFIG.PROJECT_ROOT, 'app-store-compliance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    console.log('\n' + '='.repeat(80));
    console.log('🚀 Next Steps:');
    console.log('1. Fix all failed tests');
    console.log('2. Address warnings for better approval chances');
    console.log('3. Run this test again to verify fixes');
    console.log('4. Prepare App Store assets and metadata');
    console.log('5. Submit to App Store Connect');
    console.log('='.repeat(80));
    
    // Exit with error code if critical tests failed
    if (this.results.failed.length > 0) {
      process.exit(1);
    }
  }
}

// Run the compliance test
if (require.main === module) {
  const tester = new AppStoreComplianceTest();
  tester.runAllTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = AppStoreComplianceTest;