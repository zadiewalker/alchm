#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simulate the comprehensive diagnostic audit execution
class ComprehensiveDiagnosticAudit {
  constructor() {
    this.projectRoot = process.cwd();
  }

  async executeFullAudit() {
    console.log('🔍 ALCHM COMPREHENSIVE DIAGNOSTIC AUDIT STARTING...\n');

    const results = {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      criticalIssues: [],
      warnings: [],
      passed: [],
      auditSections: {}
    };

    // Execute all audit sections
    const auditSections = [
      'Firebase Studio Architecture',
      'App Store Compliance', 
      'Security & Privacy Fortress',
      'User Journey Validation',
      'Performance & Scalability',
      'Mental Health Safety',
      'Educational Compliance',
      'Cross-Platform Compatibility'
    ];

    let totalScore = 0;
    let maxScore = 0;

    for (const section of auditSections) {
      console.log(`\n📋 Auditing: ${section}`);
      const sectionResult = await this.auditSection(section);
      results.auditSections[section] = sectionResult;
      
      totalScore += sectionResult.score;
      maxScore += sectionResult.maxScore;
      
      results.criticalIssues.push(...sectionResult.criticalIssues);
      results.warnings.push(...sectionResult.warnings);
      results.passed.push(...sectionResult.passed);
      
      console.log(`   Score: ${sectionResult.score}/${sectionResult.maxScore} (${((sectionResult.score/sectionResult.maxScore)*100).toFixed(1)}%)`);
    }

    results.overallScore = (totalScore / maxScore) * 100;
    
    console.log(`\n🎯 OVERALL AUDIT SCORE: ${results.overallScore.toFixed(1)}%`);
    console.log(`📊 CRITICAL ISSUES: ${results.criticalIssues.length}`);
    console.log(`⚠️  WARNINGS: ${results.warnings.length}`);
    console.log(`✅ PASSED CHECKS: ${results.passed.length}`);

    return results;
  }

  async auditSection(sectionName) {
    const result = {
      score: 0,
      maxScore: 100,
      criticalIssues: [],
      warnings: [],
      passed: [],
      details: {}
    };

    switch (sectionName) {
      case 'Firebase Studio Architecture':
        return await this.auditFirebaseStudioArchitecture();
      case 'App Store Compliance':
        return await this.auditAppStoreCompliance();
      case 'Security & Privacy Fortress':
        return await this.auditSecurityPrivacyFortress();
      case 'User Journey Validation':
        return await this.auditUserJourneyValidation();
      case 'Performance & Scalability':
        return await this.auditPerformanceScalability();
      case 'Mental Health Safety':
        return await this.auditMentalHealthSafety();
      case 'Educational Compliance':
        return await this.auditEducationalCompliance();
      case 'Cross-Platform Compatibility':
        return await this.auditCrossPlatformCompatibility();
      default:
        return result;
    }
  }

  async auditFirebaseStudioArchitecture() {
    const result = { score: 0, maxScore: 100, criticalIssues: [], warnings: [], passed: [] };

    // Check firebase.json exists and is properly configured
    if (fs.existsSync(path.join(this.projectRoot, 'firebase.json'))) {
      result.passed.push('firebase.json configuration file exists');
      result.score += 15;
    } else {
      result.criticalIssues.push('firebase.json configuration missing');
    }

    // Check Functions deployment configuration
    if (fs.existsSync(path.join(this.projectRoot, 'functions'))) {
      result.passed.push('Firebase Functions directory structure exists');
      result.score += 15;
    } else {
      result.warnings.push('Firebase Functions directory not found');
    }

    // Check Firestore rules
    if (fs.existsSync(path.join(this.projectRoot, 'firestore.rules'))) {
      result.passed.push('Firestore security rules configured');
      result.score += 15;
    } else {
      result.criticalIssues.push('Firestore security rules missing');
    }

    // Check Next.js configuration for Firebase compatibility
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
      if (nextConfig.includes('export')) {
        result.passed.push('Next.js configured for static export (Firebase compatible)');
        result.score += 25;
      } else if (nextConfig.includes('standalone')) {
        result.warnings.push('Next.js in standalone mode - may need export for Firebase Hosting');
        result.score += 15;
      }
    } else {
      result.criticalIssues.push('Next.js configuration missing');
    }

    // Check Firebase client configuration
    const firebaseConfigPath = path.join(this.projectRoot, 'src/lib/firebase.ts');
    if (fs.existsSync(firebaseConfigPath)) {
      result.passed.push('Firebase client configuration exists');
      result.score += 15;
    } else {
      result.criticalIssues.push('Firebase client configuration missing');
    }

    // Check build output directory
    const buildOutputPath = path.join(this.projectRoot, 'out');
    if (fs.existsSync(buildOutputPath)) {
      result.passed.push('Static build output directory exists');
      result.score += 15;
    } else {
      result.warnings.push('No static build output found - run npm run build');
    }

    return result;
  }

  async auditAppStoreCompliance() {
    const result = { score: 0, maxScore: 100, criticalIssues: [], warnings: [], passed: [] };

    // Check manifest.json for PWA compliance
    const manifestPath = path.join(this.projectRoot, 'public/manifest.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      if (manifest.name && manifest.short_name) {
        result.passed.push('PWA manifest has required name fields');
        result.score += 20;
      }
      
      if (manifest.icons && manifest.icons.length >= 6) {
        result.passed.push('PWA manifest has comprehensive icon set');
        result.score += 15;
      } else {
        result.warnings.push('PWA manifest needs more icon sizes for App Store');
      }

      if (manifest.screenshots) {
        result.passed.push('PWA manifest includes screenshots');
        result.score += 15;
      } else {
        result.warnings.push('PWA manifest missing screenshots');
      }
    } else {
      result.criticalIssues.push('PWA manifest.json missing - required for App Store');
    }

    // Check package.json for app metadata
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      if (pkg.description) {
        result.passed.push('Package.json has app description');
        result.score += 10;
      }
      
      if (pkg.permissions) {
        result.passed.push('Platform permissions documented');
        result.score += 15;
      } else {
        result.warnings.push('Platform permissions not documented in package.json');
      }
    }

    // Check for privacy policy
    const privacyPath = path.join(this.projectRoot, 'public/privacy-policy.html');
    if (fs.existsSync(privacyPath)) {
      result.passed.push('Privacy policy exists');
      result.score += 25;
    } else {
      result.criticalIssues.push('Privacy policy missing - required for App Store');
    }

    return result;
  }

  async auditSecurityPrivacyFortress() {
    const result = { score: 0, maxScore: 100, criticalIssues: [], warnings: [], passed: [] };

    // Check for environment variable protection
    const envExampleExists = fs.existsSync(path.join(this.projectRoot, '.env.example'));
    const envLocalExists = fs.existsSync(path.join(this.projectRoot, '.env.local'));
    
    if (envExampleExists) {
      result.passed.push('Environment variable template exists');
      result.score += 15;
    }
    
    if (envLocalExists) {
      result.warnings.push('.env.local found - ensure secrets are not committed');
    } else {
      result.warnings.push('No .env.local found - may need environment configuration');
    }

    // Check Firebase security configuration
    const securityLibPath = path.join(this.projectRoot, 'src/lib/security.ts');
    if (fs.existsSync(securityLibPath)) {
      result.passed.push('Security utility library exists');
      result.score += 20;
    }

    // Check for HTTPS enforcement
    const middlewarePath = path.join(this.projectRoot, 'middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      result.passed.push('Middleware configuration exists');
      result.score += 15;
    }

    // Check Firestore rules for security
    const rulesPath = path.join(this.projectRoot, 'firestore.rules');
    if (fs.existsSync(rulesPath)) {
      const rules = fs.readFileSync(rulesPath, 'utf8');
      if (rules.includes('auth') && rules.includes('uid')) {
        result.passed.push('Firestore rules include authentication checks');
        result.score += 25;
      } else {
        result.criticalIssues.push('Firestore rules may lack proper authentication');
      }
    }

    // Check for error handling
    const errorHandlingPath = path.join(this.projectRoot, 'src/lib/errorHandling.ts');
    if (fs.existsSync(errorHandlingPath)) {
      result.passed.push('Error handling system exists');
      result.score += 25;
    } else {
      result.warnings.push('No centralized error handling found');
    }

    return result;
  }

  async auditUserJourneyValidation() {
    const result = { score: 0, maxScore: 100, criticalIssues: [], warnings: [], passed: [] };

    // Check key pages exist
    const keyPages = [
      'src/app/page.tsx',
      'src/app/dashboard/page.tsx',
      'src/app/journal/page.tsx',
      'src/app/auth/login/page.tsx'
    ];

    let existingPages = 0;
    keyPages.forEach(pagePath => {
      if (fs.existsSync(path.join(this.projectRoot, pagePath))) {
        existingPages++;
        result.passed.push(`${pagePath} exists`);
      }
    });

    result.score += (existingPages / keyPages.length) * 40;

    // Check for navigation components
    const navPath = path.join(this.projectRoot, 'src/components/nav');
    if (fs.existsSync(navPath)) {
      result.passed.push('Navigation components directory exists');
      result.score += 20;
    }

    // Check for mobile optimization
    const mobileStylesPath = path.join(this.projectRoot, 'src/styles/mobile-trauma-informed.css');
    if (fs.existsSync(mobileStylesPath)) {
      result.passed.push('Mobile-specific styling exists');
      result.score += 20;
    }

    // Check for crisis support components
    const crisisSupportPath = path.join(this.projectRoot, 'src/components/ui/CrisisSupport.tsx');
    if (fs.existsSync(crisisSupportPath)) {
      result.passed.push('Crisis support component exists');
      result.score += 20;
    } else {
      result.warnings.push('Crisis support components not found');
    }

    return result;
  }

  async auditPerformanceScalability() {
    const result = { score: 0, maxScore: 100, criticalIssues: [], warnings: [], passed: [] };

    // Check for performance monitoring
    const performanceLibPath = path.join(this.projectRoot, 'src/lib/performance-monitoring.ts');
    if (fs.existsSync(performanceLibPath)) {
      result.passed.push('Performance monitoring system exists');
      result.score += 25;
    }

    // Check Next.js configuration optimizations
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
      if (nextConfig.includes('compress') || nextConfig.includes('optimization')) {
        result.passed.push('Next.js performance optimizations configured');
        result.score += 20;
      }
    }

    // Check for bundle analysis configuration
    const bundleAnalyzerPath = path.join(this.projectRoot, 'src/lib/bundle-analyzer.ts');
    if (fs.existsSync(bundleAnalyzerPath)) {
      result.passed.push('Bundle analyzer configuration exists');
      result.score += 15;
    }

    // Check build configuration for memory optimization
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      if (pkg.scripts.build && pkg.scripts.build.includes('max-old-space-size')) {
        result.passed.push('Build process optimized for memory usage');
        result.score += 20;
      }
    }

    // Check for Core Web Vitals monitoring
    const webVitalsPath = path.join(this.projectRoot, 'src/lib/coreWebVitals.ts');
    if (fs.existsSync(webVitalsPath)) {
      result.passed.push('Core Web Vitals monitoring configured');
      result.score += 20;
    } else {
      result.warnings.push('Core Web Vitals monitoring not found');
    }

    return result;
  }

  async auditMentalHealthSafety() {
    const result = { score: 0, maxScore: 100, criticalIssues: [], warnings: [], passed: [] };

    // Check for crisis detection systems
    const crisisDetectionPath = path.join(this.projectRoot, 'src/lib/enhanced-crisis-detection.ts');
    if (fs.existsSync(crisisDetectionPath)) {
      result.passed.push('Enhanced crisis detection system exists');
      result.score += 30;
    } else {
      result.criticalIssues.push('Crisis detection system missing - critical for mental health app');
    }

    // Check for trauma-informed AI components
    const traumaAIPath = path.join(this.projectRoot, 'src/ai/trauma-informed-engine.ts');
    if (fs.existsSync(traumaAIPath)) {
      result.passed.push('Trauma-informed AI engine exists');
      result.score += 25;
    }

    // Check for crisis support UI components
    const crisisUIPath = path.join(this.projectRoot, 'src/components/ui/CrisisSupport.tsx');
    if (fs.existsSync(crisisUIPath)) {
      result.passed.push('Crisis support UI components exist');
      result.score += 20;
    }

    // Check for cultural crisis resources
    const culturalCrisisPath = path.join(this.projectRoot, 'src/lib/cultural-crisis-resources.ts');
    if (fs.existsSync(culturalCrisisPath)) {
      result.passed.push('Cultural crisis resources configured');
      result.score += 25;
    } else {
      result.warnings.push('Cultural crisis resources not found');
    }

    return result;
  }

  async auditEducationalCompliance() {
    const result = { score: 0, maxScore: 100, criticalIssues: [], warnings: [], passed: [] };

    // Check for age verification
    const ageVerificationPath = path.join(this.projectRoot, 'src/components/ui/AgeVerification.tsx');
    if (fs.existsSync(ageVerificationPath)) {
      result.passed.push('Age verification component exists');
      result.score += 30;
    } else {
      result.criticalIssues.push('Age verification missing - required for COPPA compliance');
    }

    // Check for educational privacy controls
    const privacyControlsPath = path.join(this.projectRoot, 'src/lib/marginalized-youth-privacy.ts');
    if (fs.existsSync(privacyControlsPath)) {
      result.passed.push('Youth privacy protection systems exist');
      result.score += 25;
    }

    // Check for medical disclaimer
    const medicalDisclaimerPath = path.join(this.projectRoot, 'src/components/ui/MedicalDisclaimer.tsx');
    if (fs.existsSync(medicalDisclaimerPath)) {
      result.passed.push('Medical disclaimer component exists');
      result.score += 20;
    }

    // Check privacy policy for educational compliance
    const privacyPath = path.join(this.projectRoot, 'public/privacy-policy.html');
    if (fs.existsSync(privacyPath)) {
      const privacy = fs.readFileSync(privacyPath, 'utf8');
      if (privacy.includes('COPPA') || privacy.includes('FERPA') || privacy.includes('under 13')) {
        result.passed.push('Privacy policy includes educational compliance');
        result.score += 25;
      } else {
        result.warnings.push('Privacy policy may need educational compliance sections');
      }
    }

    return result;
  }

  async auditCrossPlatformCompatibility() {
    const result = { score: 0, maxScore: 100, criticalIssues: [], warnings: [], passed: [] };

    // Check for mobile-specific configurations
    const capacitorConfigPath = path.join(this.projectRoot, 'capacitor.config.ts');
    if (fs.existsSync(capacitorConfigPath)) {
      result.passed.push('Capacitor mobile configuration exists');
      result.score += 25;
    } else {
      result.warnings.push('Capacitor configuration not found - limits mobile deployment');
    }

    // Check for Android manifest
    const androidManifestPath = path.join(this.projectRoot, 'android/app/src/main/AndroidManifest.xml');
    if (fs.existsSync(androidManifestPath)) {
      result.passed.push('Android manifest configuration exists');
      result.score += 25;
    }

    // Check for mobile-optimized CSS
    const mobileCSS = path.join(this.projectRoot, 'src/styles/mobile-trauma-informed.css');
    if (fs.existsSync(mobileCSS)) {
      result.passed.push('Mobile-optimized CSS exists');
      result.score += 25;
    }

    // Check for PWA configuration
    const manifestPath = path.join(this.projectRoot, 'public/manifest.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (manifest.display === 'standalone') {
        result.passed.push('PWA configured for standalone display');
        result.score += 25;
      }
    }

    return result;
  }
}

// Execute the audit
async function runAudit() {
  try {
    const audit = new ComprehensiveDiagnosticAudit();
    const report = await audit.executeFullAudit();
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL AUDIT SUMMARY');
    console.log('='.repeat(60));
    
    if (report.overallScore >= 95) {
      console.log('🟢 EXCELLENT: Ready for App Store submission');
    } else if (report.overallScore >= 85) {
      console.log('🟡 GOOD: Minor fixes recommended before submission');
    } else if (report.overallScore >= 70) {
      console.log('🟠 NEEDS WORK: Several issues must be addressed');
    } else {
      console.log('🔴 CRITICAL: Major issues prevent App Store submission');
    }
    
    console.log(`\n📈 Overall Score: ${report.overallScore.toFixed(1)}%`);
    
    if (report.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES TO FIX:');
      report.criticalIssues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue}`);
      });
    }
    
    if (report.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS TO CONSIDER:');
      report.warnings.slice(0, 5).forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning}`);
      });
      if (report.warnings.length > 5) {
        console.log(`   ... and ${report.warnings.length - 5} more warnings`);
      }
    }
    
    console.log(`\n✅ SUCCESSFUL CHECKS: ${report.passed.length}`);
    
    // Write detailed report to file
    const reportPath = path.join(process.cwd(), 'DIAGNOSTIC_AUDIT_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📋 Detailed report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Audit execution failed:', error.message);
    process.exit(1);
  }
}

runAudit();