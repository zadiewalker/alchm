#!/usr/bin/env node

/**
 * ALCHM Analytics & Performance Monitoring Audit System
 * Comprehensive validation for Firebase Analytics, performance tracking, and educational compliance
 * Built for trauma-informed data collection with strict privacy requirements
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  cyan: '\x1b[36m'
};

class AnalyticsPerformanceAuditor {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.auditResults = [];
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.reportDir = path.join(this.projectRoot, 'audit-reports', `analytics-performance-${this.timestamp}`);
    
    // Performance thresholds for trauma-informed application
    this.performanceThresholds = {
      firstContentfulPaint: 1800, // 1.8s (gentle loading)
      largestContentfulPaint: 2500, // 2.5s
      firstInputDelay: 100, // 100ms (responsive for crisis moments)
      cumulativeLayoutShift: 0.1, // Stable layout (trauma-sensitive)
      totalBlockingTime: 200, // 200ms
      speedIndex: 3000, // 3s
      bundleSizeKB: 512, // 512KB initial load
      imageOptimization: 90, // 90% compression
      cacheHitRatio: 85, // 85% cache efficiency
      errorRate: 0.1, // 0.1% error rate
      mobilePerformanceScore: 90, // 90+ Lighthouse mobile score
      accessibilityScore: 95 // 95+ accessibility score (inclusive design)
    };

    // Analytics compliance requirements
    this.analyticsRequirements = {
      gdprCompliant: true,
      coppaCompliant: true,
      ferpaCompliant: true,
      dataMinimization: true,
      userConsent: true,
      dataRetention: '2-years', // Educational compliance
      anonymization: true,
      rightToErasure: true,
      dataPortability: true,
      privacyByDesign: true
    };

    this.createReportDirectory();
  }

  createReportDirectory() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  log(level, category, test, details) {
    const timestamp = new Date().toISOString();
    const result = { timestamp, level, category, test, details };
    this.auditResults.push(result);

    const symbols = {
      PASS: '✓',
      FAIL: '✗',
      WARN: '⚠',
      INFO: 'ℹ'
    };

    const color = {
      PASS: colors.green,
      FAIL: colors.red,
      WARN: colors.yellow,
      INFO: colors.blue
    }[level] || colors.reset;

    console.log(`  ${color}${symbols[level]}${colors.reset} ${test}: ${details}`);
  }

  async auditAnalyticsImplementation() {
    console.log(`${colors.purple}📊 PHASE 1: Analytics Implementation Audit${colors.reset}`);
    console.log(`${colors.blue}===========================================${colors.reset}`);

    // Check for Firebase Analytics implementation
    await this.auditFirebaseAnalytics();

    // Check for custom analytics implementation
    await this.auditCustomAnalytics();

    // Check for performance monitoring
    await this.auditPerformanceMonitoring();

    // Check for error tracking
    await this.auditErrorTracking();

    // Check for user behavior tracking
    await this.auditUserBehaviorTracking();
  }

  async auditFirebaseAnalytics() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'lib'),
      path.join(this.projectRoot, 'src', 'app'),
      path.join(this.projectRoot, 'src', 'components')
    ];

    let firebaseAnalyticsFound = false;
    let analyticsFeatures = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for Firebase Analytics import
            if (content.includes('getAnalytics') || content.includes('firebase/analytics')) {
              firebaseAnalyticsFound = true;
              this.log('PASS', 'firebase_analytics', 'analytics_import', 'Firebase Analytics imported');
              break;
            }
          }
          
          if (firebaseAnalyticsFound) break;
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (!firebaseAnalyticsFound) {
      this.log('WARN', 'firebase_analytics', 'analytics_import', 'Firebase Analytics not found');
    }

    // Check for analytics configuration
    const analyticsConfigFiles = [
      path.join(this.projectRoot, 'src', 'lib', 'analytics.ts'),
      path.join(this.projectRoot, 'src', 'lib', 'firebase.ts')
    ];

    for (const configFile of analyticsConfigFiles) {
      if (fs.existsSync(configFile)) {
        const content = fs.readFileSync(configFile, 'utf8');
        
        // Check for analytics initialization
        if (content.includes('getAnalytics') || content.includes('initializeAnalytics')) {
          analyticsFeatures++;
          this.log('PASS', 'firebase_analytics', 'analytics_init', 'Firebase Analytics initialization found');
        }
        
        // Check for custom event tracking
        if (content.includes('logEvent') || content.includes('track')) {
          analyticsFeatures++;
          this.log('PASS', 'firebase_analytics', 'custom_events', 'Custom event tracking implemented');
        }
        
        // Check for user properties
        if (content.includes('setUserProperties') || content.includes('setUserId')) {
          analyticsFeatures++;
          this.log('PASS', 'firebase_analytics', 'user_properties', 'User properties tracking implemented');
        }
        
        // Check for consent management
        if (content.includes('consent') || content.includes('gtag.*consent')) {
          analyticsFeatures++;
          this.log('PASS', 'firebase_analytics', 'consent_management', 'Analytics consent management found');
        } else {
          this.log('FAIL', 'firebase_analytics', 'consent_management', 'No analytics consent management - required for GDPR/COPPA');
        }
        
        break;
      }
    }

    if (analyticsFeatures === 0) {
      this.log('WARN', 'firebase_analytics', 'features_summary', 'No Firebase Analytics features configured');
    }
  }

  async auditCustomAnalytics() {
    const customAnalyticsFiles = [
      path.join(this.projectRoot, 'src', 'lib', 'analytics.ts'),
      path.join(this.projectRoot, 'src', 'lib', 'tracking.ts'),
      path.join(this.projectRoot, 'src', 'lib', 'metrics.ts')
    ];

    let customAnalyticsFound = false;

    for (const file of customAnalyticsFiles) {
      if (fs.existsSync(file)) {
        customAnalyticsFound = true;
        this.log('PASS', 'custom_analytics', 'implementation_found', `Custom analytics implementation found: ${path.basename(file)}`);
        await this.analyzeCustomAnalyticsImplementation(file);
        break;
      }
    }

    if (!customAnalyticsFound) {
      this.log('WARN', 'custom_analytics', 'implementation_found', 'No custom analytics implementation found');
    }
  }

  async analyzeCustomAnalyticsImplementation(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for trauma-informed tracking
      if (content.includes('trauma') || content.includes('crisis') || content.includes('wellbeing')) {
        this.log('PASS', 'custom_analytics', 'trauma_informed', 'Trauma-informed analytics tracking found');
      } else {
        this.log('WARN', 'custom_analytics', 'trauma_informed', 'No trauma-informed analytics patterns found');
      }

      // Check for privacy-preserving analytics
      if (content.includes('anonymize') || content.includes('hash') || content.includes('pseudonymize')) {
        this.log('PASS', 'custom_analytics', 'privacy_preserving', 'Privacy-preserving analytics methods found');
      } else {
        this.log('FAIL', 'custom_analytics', 'privacy_preserving', 'No privacy-preserving analytics methods found');
      }

      // Check for educational compliance
      if (content.includes('coppa') || content.includes('ferpa') || content.includes('educational')) {
        this.log('PASS', 'custom_analytics', 'educational_compliance', 'Educational compliance analytics found');
      } else {
        this.log('FAIL', 'custom_analytics', 'educational_compliance', 'No educational compliance in analytics');
      }

      // Check for consent-based tracking
      if (content.includes('hasConsent') || content.includes('optIn') || content.includes('permission')) {
        this.log('PASS', 'custom_analytics', 'consent_based', 'Consent-based tracking implemented');
      } else {
        this.log('FAIL', 'custom_analytics', 'consent_based', 'No consent-based tracking found');
      }

      // Check for data minimization
      if (content.includes('essential') || content.includes('necessary') || content.includes('minimal')) {
        this.log('PASS', 'custom_analytics', 'data_minimization', 'Data minimization principles implemented');
      } else {
        this.log('WARN', 'custom_analytics', 'data_minimization', 'No explicit data minimization in analytics');
      }

      // Check for error handling
      if (content.includes('try') && content.includes('catch')) {
        this.log('PASS', 'custom_analytics', 'error_handling', 'Analytics error handling implemented');
      } else {
        this.log('WARN', 'custom_analytics', 'error_handling', 'No analytics error handling found');
      }

    } catch (error) {
      this.log('FAIL', 'custom_analytics', 'analysis', `Error analyzing custom analytics: ${error.message}`);
    }
  }

  async auditPerformanceMonitoring() {
    const performanceFiles = [
      path.join(this.projectRoot, 'src', 'lib', 'performance.ts'),
      path.join(this.projectRoot, 'src', 'lib', 'monitoring.ts'),
      path.join(this.projectRoot, 'src', 'lib', 'coreWebVitals.ts')
    ];

    let performanceMonitoringFound = false;

    for (const file of performanceFiles) {
      if (fs.existsSync(file)) {
        performanceMonitoringFound = true;
        this.log('PASS', 'performance_monitoring', 'implementation_found', `Performance monitoring found: ${path.basename(file)}`);
        await this.analyzePerformanceMonitoring(file);
        break;
      }
    }

    if (!performanceMonitoringFound) {
      this.log('WARN', 'performance_monitoring', 'implementation_found', 'No performance monitoring implementation found');
    }

    // Check for Web Vitals tracking
    await this.auditWebVitalsTracking();

    // Check for Firebase Performance Monitoring
    await this.auditFirebasePerformance();
  }

  async analyzePerformanceMonitoring(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for Core Web Vitals
      const webVitalsMetrics = ['CLS', 'FID', 'LCP', 'FCP', 'TTFB'];
      webVitalsMetrics.forEach(metric => {
        if (content.includes(metric)) {
          this.log('PASS', 'performance_monitoring', `web_vital_${metric.toLowerCase()}`, `${metric} monitoring implemented`);
        }
      });

      // Check for custom performance metrics
      if (content.includes('performance.mark') || content.includes('performance.measure')) {
        this.log('PASS', 'performance_monitoring', 'custom_metrics', 'Custom performance metrics implemented');
      } else {
        this.log('WARN', 'performance_monitoring', 'custom_metrics', 'No custom performance metrics found');
      }

      // Check for trauma-informed performance considerations
      if (content.includes('crisis') || content.includes('emergency') || content.includes('immediate')) {
        this.log('PASS', 'performance_monitoring', 'crisis_performance', 'Crisis-aware performance monitoring found');
      } else {
        this.log('WARN', 'performance_monitoring', 'crisis_performance', 'No crisis-aware performance monitoring');
      }

      // Check for real-time monitoring
      if (content.includes('realtime') || content.includes('live') || content.includes('continuous')) {
        this.log('PASS', 'performance_monitoring', 'realtime_monitoring', 'Real-time performance monitoring found');
      } else {
        this.log('WARN', 'performance_monitoring', 'realtime_monitoring', 'No real-time performance monitoring');
      }

    } catch (error) {
      this.log('FAIL', 'performance_monitoring', 'analysis', `Error analyzing performance monitoring: ${error.message}`);
    }
  }

  async auditWebVitalsTracking() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'app'),
      path.join(this.projectRoot, 'src', 'lib'),
      path.join(this.projectRoot, 'src', 'components')
    ];

    let webVitalsFound = false;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            
            if (content.includes('web-vitals') || content.includes('getCLS') || content.includes('getFID') || content.includes('getLCP')) {
              webVitalsFound = true;
              this.log('PASS', 'web_vitals', 'library_usage', 'Web Vitals library usage found');
              break;
            }
          }
          
          if (webVitalsFound) break;
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (!webVitalsFound) {
      this.log('WARN', 'web_vitals', 'library_usage', 'No Web Vitals library usage found');
    }

    // Check package.json for web-vitals dependency
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.dependencies && packageJson.dependencies['web-vitals']) {
        this.log('PASS', 'web_vitals', 'dependency', `Web Vitals dependency found: ${packageJson.dependencies['web-vitals']}`);
      } else {
        this.log('WARN', 'web_vitals', 'dependency', 'Web Vitals dependency not found');
      }
    }
  }

  async auditFirebasePerformance() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'lib'),
      path.join(this.projectRoot, 'src', 'app')
    ];

    let firebasePerformanceFound = false;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            
            if (content.includes('firebase/performance') || content.includes('getPerformance')) {
              firebasePerformanceFound = true;
              this.log('PASS', 'firebase_performance', 'implementation', 'Firebase Performance Monitoring found');
              break;
            }
          }
          
          if (firebasePerformanceFound) break;
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (!firebasePerformanceFound) {
      this.log('WARN', 'firebase_performance', 'implementation', 'No Firebase Performance Monitoring found');
    }
  }

  async auditErrorTracking() {
    const errorTrackingFiles = [
      path.join(this.projectRoot, 'src', 'lib', 'errorHandling.ts'),
      path.join(this.projectRoot, 'src', 'lib', 'logging.ts'),
      path.join(this.projectRoot, 'src', 'lib', 'monitoring.ts')
    ];

    let errorTrackingFound = false;

    for (const file of errorTrackingFiles) {
      if (fs.existsSync(file)) {
        errorTrackingFound = true;
        this.log('PASS', 'error_tracking', 'implementation_found', `Error tracking found: ${path.basename(file)}`);
        await this.analyzeErrorTracking(file);
        break;
      }
    }

    if (!errorTrackingFound) {
      this.log('WARN', 'error_tracking', 'implementation_found', 'No dedicated error tracking implementation found');
    }

    // Check for error boundaries
    await this.auditErrorBoundaries();

    // Check for global error handling
    await this.auditGlobalErrorHandling();
  }

  async analyzeErrorTracking(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for error categorization
      if (content.includes('category') || content.includes('severity') || content.includes('level')) {
        this.log('PASS', 'error_tracking', 'categorization', 'Error categorization implemented');
      } else {
        this.log('WARN', 'error_tracking', 'categorization', 'No error categorization found');
      }

      // Check for privacy-safe error logging
      if (content.includes('sanitize') || content.includes('redact') || content.includes('filter')) {
        this.log('PASS', 'error_tracking', 'privacy_safe', 'Privacy-safe error logging implemented');
      } else {
        this.log('FAIL', 'error_tracking', 'privacy_safe', 'No privacy-safe error logging - may expose sensitive data');
      }

      // Check for crisis error handling
      if (content.includes('crisis') || content.includes('emergency') || content.includes('critical')) {
        this.log('PASS', 'error_tracking', 'crisis_handling', 'Crisis-aware error handling found');
      } else {
        this.log('WARN', 'error_tracking', 'crisis_handling', 'No crisis-aware error handling');
      }

      // Check for error recovery mechanisms
      if (content.includes('retry') || content.includes('fallback') || content.includes('recovery')) {
        this.log('PASS', 'error_tracking', 'recovery_mechanisms', 'Error recovery mechanisms implemented');
      } else {
        this.log('WARN', 'error_tracking', 'recovery_mechanisms', 'No error recovery mechanisms found');
      }

    } catch (error) {
      this.log('FAIL', 'error_tracking', 'analysis', `Error analyzing error tracking: ${error.message}`);
    }
  }

  async auditErrorBoundaries() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'app'),
      path.join(this.projectRoot, 'src', 'components')
    ];

    let errorBoundariesFound = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            
            if (content.includes('ErrorBoundary') || content.includes('componentDidCatch') || content.includes('getDerivedStateFromError')) {
              errorBoundariesFound++;
            }
          }
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (errorBoundariesFound > 0) {
      this.log('PASS', 'error_boundaries', 'implementation', `Found ${errorBoundariesFound} error boundary implementation(s)`);
    } else {
      this.log('WARN', 'error_boundaries', 'implementation', 'No error boundaries found');
    }
  }

  async auditGlobalErrorHandling() {
    // Check for global error handlers in main app files
    const globalErrorFiles = [
      path.join(this.projectRoot, 'src', 'app', 'layout.tsx'),
      path.join(this.projectRoot, 'src', 'app', 'error.tsx'),
      path.join(this.projectRoot, 'src', 'app', 'global-error.tsx')
    ];

    let globalErrorHandlingFound = false;

    for (const file of globalErrorFiles) {
      if (fs.existsSync(file)) {
        globalErrorHandlingFound = true;
        this.log('PASS', 'global_error_handling', 'implementation', `Global error handling found: ${path.basename(file)}`);
        break;
      }
    }

    if (!globalErrorHandlingFound) {
      this.log('WARN', 'global_error_handling', 'implementation', 'No global error handling found');
    }
  }

  async auditUserBehaviorTracking() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'app'),
      path.join(this.projectRoot, 'src', 'components'),
      path.join(this.projectRoot, 'src', 'lib')
    ];

    let behaviorTrackingFeatures = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for user interaction tracking
            if (content.includes('onClick') && content.includes('track')) {
              behaviorTrackingFeatures++;
              this.log('PASS', 'behavior_tracking', 'click_tracking', 'Click tracking implementation found');
              break;
            }
          }
        } catch (error) {
          // Continue checking
        }
      }
    }

    // Check for specific trauma-informed tracking
    await this.auditTraumaInformedTracking();

    // Check for educational analytics
    await this.auditEducationalAnalytics();
  }

  async auditTraumaInformedTracking() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'lib'),
      path.join(this.projectRoot, 'src', 'components')
    ];

    let traumaInformedTracking = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for mood tracking
            if (content.includes('mood') && content.includes('track')) {
              traumaInformedTracking++;
              this.log('PASS', 'trauma_tracking', 'mood_tracking', 'Mood tracking implementation found');
            }
            
            // Check for crisis detection tracking
            if (content.includes('crisis') && content.includes('detect')) {
              traumaInformedTracking++;
              this.log('PASS', 'trauma_tracking', 'crisis_detection', 'Crisis detection tracking found');
            }
            
            // Check for wellbeing metrics
            if (content.includes('wellbeing') || content.includes('wellness')) {
              traumaInformedTracking++;
              this.log('PASS', 'trauma_tracking', 'wellbeing_metrics', 'Wellbeing metrics tracking found');
            }
          }
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (traumaInformedTracking === 0) {
      this.log('WARN', 'trauma_tracking', 'summary', 'No trauma-informed tracking features found');
    }
  }

  async auditEducationalAnalytics() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'lib'),
      path.join(this.projectRoot, 'src', 'app')
    ];

    let educationalAnalytics = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for learning progress tracking
            if (content.includes('progress') || content.includes('learning')) {
              educationalAnalytics++;
              this.log('PASS', 'educational_analytics', 'progress_tracking', 'Learning progress tracking found');
            }
            
            // Check for engagement metrics
            if (content.includes('engagement') || content.includes('time.*spent')) {
              educationalAnalytics++;
              this.log('PASS', 'educational_analytics', 'engagement_metrics', 'Engagement metrics tracking found');
            }
            
            // Check for achievement tracking
            if (content.includes('achievement') || content.includes('badge') || content.includes('milestone')) {
              educationalAnalytics++;
              this.log('PASS', 'educational_analytics', 'achievement_tracking', 'Achievement tracking found');
            }
          }
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (educationalAnalytics === 0) {
      this.log('WARN', 'educational_analytics', 'summary', 'No educational analytics features found');
    }
  }

  async auditPrivacyCompliance() {
    console.log(`\n${colors.purple}🔒 PHASE 2: Privacy & Compliance Audit${colors.reset}`);
    console.log(`${colors.blue}====================================${colors.reset}`);

    // Check for GDPR compliance
    await this.auditGDPRCompliance();

    // Check for COPPA compliance
    await this.auditCOPPACompliance();

    // Check for FERPA compliance
    await this.auditFERPACompliance();

    // Check for consent management
    await this.auditConsentManagement();

    // Check for data retention policies
    await this.auditDataRetention();

    // Check for anonymization and pseudonymization
    await this.auditDataAnonymization();
  }

  async auditGDPRCompliance() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src'),
      path.join(this.projectRoot, 'public')
    ];

    let gdprFeatures = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js', '.html']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8').toLowerCase();
            
            // Check for GDPR implementation
            if (content.includes('gdpr')) {
              gdprFeatures++;
              this.log('PASS', 'gdpr', 'implementation_found', 'GDPR implementation found');
              break;
            }
          }
          
          if (gdprFeatures > 0) break;
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (gdprFeatures === 0) {
      this.log('FAIL', 'gdpr', 'implementation_found', 'No GDPR implementation found - required for EU users');
    }

    // Check for specific GDPR rights
    await this.auditGDPRRights();
  }

  async auditGDPRRights() {
    const gdprRights = {
      'right_to_access': ['data.*export', 'download.*data', 'access.*data'],
      'right_to_rectification': ['update.*data', 'correct.*data', 'modify.*profile'],
      'right_to_erasure': ['delete.*account', 'remove.*data', 'right.*forgotten'],
      'right_to_portability': ['export.*data', 'download.*json', 'data.*portability'],
      'right_to_restrict': ['restrict.*processing', 'limit.*data'],
      'right_to_object': ['opt.*out', 'object.*processing', 'withdraw.*consent']
    };

    const filesToCheck = [
      path.join(this.projectRoot, 'src'),
      path.join(this.projectRoot, 'public')
    ];

    for (const [right, patterns] of Object.entries(gdprRights)) {
      let rightImplemented = false;

      for (const dirPath of filesToCheck) {
        if (fs.existsSync(dirPath)) {
          try {
            const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js', '.html']);
            
            for (const file of files) {
              const content = fs.readFileSync(file, 'utf8').toLowerCase();
              
              if (patterns.some(pattern => content.match(new RegExp(pattern)))) {
                rightImplemented = true;
                break;
              }
            }
            
            if (rightImplemented) break;
          } catch (error) {
            // Continue checking
          }
        }
      }

      if (rightImplemented) {
        this.log('PASS', 'gdpr_rights', right, `${right.replace(/_/g, ' ')} implemented`);
      } else {
        this.log('FAIL', 'gdpr_rights', right, `${right.replace(/_/g, ' ')} not implemented`);
      }
    }
  }

  async auditCOPPACompliance() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src'),
      path.join(this.projectRoot, 'public')
    ];

    let coppaFeatures = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js', '.html']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8').toLowerCase();
            
            // Check for COPPA implementation
            if (content.includes('coppa') || content.includes('under.*13') || content.includes('children.*privacy')) {
              coppaFeatures++;
              this.log('PASS', 'coppa', 'implementation_found', 'COPPA implementation found');
            }
            
            // Check for parental consent
            if (content.includes('parent.*consent') || content.includes('guardian.*permission')) {
              coppaFeatures++;
              this.log('PASS', 'coppa', 'parental_consent', 'Parental consent implementation found');
            }
            
            // Check for age verification
            if (content.includes('age.*verification') || content.includes('birth.*date')) {
              coppaFeatures++;
              this.log('PASS', 'coppa', 'age_verification', 'Age verification implementation found');
            }
          }
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (coppaFeatures === 0) {
      this.log('FAIL', 'coppa', 'implementation_summary', 'No COPPA compliance features found - required for under-13 users');
    }
  }

  async auditFERPACompliance() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src'),
      path.join(this.projectRoot, 'public')
    ];

    let ferpaFeatures = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js', '.html']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8').toLowerCase();
            
            // Check for FERPA implementation
            if (content.includes('ferpa') || content.includes('educational.*record') || content.includes('student.*privacy')) {
              ferpaFeatures++;
              this.log('PASS', 'ferpa', 'implementation_found', 'FERPA implementation found');
            }
            
            // Check for directory information handling
            if (content.includes('directory.*information') || content.includes('educational.*use')) {
              ferpaFeatures++;
              this.log('PASS', 'ferpa', 'directory_info', 'Directory information handling found');
            }
          }
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (ferpaFeatures === 0) {
      this.log('FAIL', 'ferpa', 'implementation_summary', 'No FERPA compliance features found - required for educational use');
    }
  }

  async auditConsentManagement() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src'),
      path.join(this.projectRoot, 'public')
    ];

    let consentFeatures = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js', '.html']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8').toLowerCase();
            
            // Check for consent management
            if (content.includes('consent') && (content.includes('manage') || content.includes('update'))) {
              consentFeatures++;
              this.log('PASS', 'consent', 'management', 'Consent management implementation found');
            }
            
            // Check for granular consent
            if (content.includes('analytics.*consent') || content.includes('tracking.*consent')) {
              consentFeatures++;
              this.log('PASS', 'consent', 'granular', 'Granular consent implementation found');
            }
            
            // Check for consent withdrawal
            if (content.includes('withdraw.*consent') || content.includes('opt.*out')) {
              consentFeatures++;
              this.log('PASS', 'consent', 'withdrawal', 'Consent withdrawal implementation found');
            }
          }
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (consentFeatures === 0) {
      this.log('FAIL', 'consent', 'implementation_summary', 'No consent management features found');
    }
  }

  async auditDataRetention() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'lib'),
      path.join(this.projectRoot, 'functions')
    ];

    let retentionFeatures = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for data retention policies
            if (content.includes('retention') || content.includes('expiry') || content.includes('cleanup')) {
              retentionFeatures++;
              this.log('PASS', 'data_retention', 'policy_implementation', 'Data retention policy implementation found');
            }
            
            // Check for automated cleanup
            if (content.includes('schedule.*delete') || content.includes('cron.*cleanup')) {
              retentionFeatures++;
              this.log('PASS', 'data_retention', 'automated_cleanup', 'Automated data cleanup found');
            }
          }
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (retentionFeatures === 0) {
      this.log('WARN', 'data_retention', 'implementation_summary', 'No data retention policies found');
    }
  }

  async auditDataAnonymization() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'lib'),
      path.join(this.projectRoot, 'functions')
    ];

    let anonymizationFeatures = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for anonymization
            if (content.includes('anonymize') || content.includes('hash') || content.includes('pseudonymize')) {
              anonymizationFeatures++;
              this.log('PASS', 'anonymization', 'implementation', 'Data anonymization implementation found');
            }
            
            // Check for PII redaction
            if (content.includes('redact') || content.includes('mask') || content.includes('sanitize')) {
              anonymizationFeatures++;
              this.log('PASS', 'anonymization', 'pii_redaction', 'PII redaction implementation found');
            }
          }
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (anonymizationFeatures === 0) {
      this.log('FAIL', 'anonymization', 'implementation_summary', 'No data anonymization features found');
    }
  }

  async auditPerformanceOptimization() {
    console.log(`\n${colors.purple}⚡ PHASE 3: Performance Optimization Audit${colors.reset}`);
    console.log(`${colors.blue}===========================================${colors.reset}`);

    // Check build performance
    await this.auditBuildPerformance();

    // Check runtime performance
    await this.auditRuntimePerformance();

    // Check mobile performance
    await this.auditMobilePerformance();

    // Check accessibility performance
    await this.auditAccessibilityPerformance();

    // Check crisis response performance
    await this.auditCrisisResponsePerformance();
  }

  async auditBuildPerformance() {
    // Check bundle analysis
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check for bundle analyzer
      if (packageJson.devDependencies && packageJson.devDependencies['@next/bundle-analyzer']) {
        this.log('PASS', 'build_performance', 'bundle_analyzer', 'Bundle analyzer configured');
      } else {
        this.log('WARN', 'build_performance', 'bundle_analyzer', 'No bundle analyzer found');
      }
      
      // Check for performance optimizations
      if (packageJson.scripts && packageJson.scripts['analyze']) {
        this.log('PASS', 'build_performance', 'analyze_script', 'Bundle analysis script available');
      } else {
        this.log('WARN', 'build_performance', 'analyze_script', 'No bundle analysis script found');
      }
    }

    // Check Next.js configuration for performance
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Check for image optimization
      if (content.includes('images') || content.includes('unoptimized')) {
        this.log('PASS', 'build_performance', 'image_config', 'Image optimization configuration found');
      } else {
        this.log('WARN', 'build_performance', 'image_config', 'No image optimization configuration');
      }
      
      // Check for compression
      if (content.includes('compress') || content.includes('gzip')) {
        this.log('PASS', 'build_performance', 'compression', 'Compression configuration found');
      } else {
        this.log('WARN', 'build_performance', 'compression', 'No compression configuration found');
      }
    }
  }

  async auditRuntimePerformance() {
    // Check for performance monitoring implementation
    const performanceFiles = [
      path.join(this.projectRoot, 'src', 'lib', 'performance.ts'),
      path.join(this.projectRoot, 'src', 'lib', 'coreWebVitals.ts')
    ];

    let runtimePerformanceFound = false;

    for (const file of performanceFiles) {
      if (fs.existsSync(file)) {
        runtimePerformanceFound = true;
        this.log('PASS', 'runtime_performance', 'monitoring', `Runtime performance monitoring found: ${path.basename(file)}`);
        break;
      }
    }

    if (!runtimePerformanceFound) {
      this.log('WARN', 'runtime_performance', 'monitoring', 'No runtime performance monitoring found');
    }

    // Check for lazy loading
    await this.auditLazyLoading();

    // Check for code splitting
    await this.auditCodeSplitting();
  }

  async auditLazyLoading() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'app'),
      path.join(this.projectRoot, 'src', 'components')
    ];

    let lazyLoadingFeatures = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for React lazy loading
            if (content.includes('React.lazy') || content.includes('lazy(')) {
              lazyLoadingFeatures++;
            }
            
            // Check for dynamic imports
            if (content.includes('import(') || content.includes('dynamic(')) {
              lazyLoadingFeatures++;
            }
          }
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (lazyLoadingFeatures > 0) {
      this.log('PASS', 'lazy_loading', 'implementation', `Found ${lazyLoadingFeatures} lazy loading implementation(s)`);
    } else {
      this.log('WARN', 'lazy_loading', 'implementation', 'No lazy loading implementations found');
    }
  }

  async auditCodeSplitting() {
    // Check for route-based code splitting
    const appDir = path.join(this.projectRoot, 'src', 'app');
    if (fs.existsSync(appDir)) {
      const routeDirs = fs.readdirSync(appDir).filter(item => {
        const itemPath = path.join(appDir, item);
        return fs.statSync(itemPath).isDirectory();
      });

      if (routeDirs.length > 3) {
        this.log('PASS', 'code_splitting', 'route_based', `Route-based code splitting with ${routeDirs.length} routes`);
      } else {
        this.log('WARN', 'code_splitting', 'route_based', 'Limited route-based code splitting');
      }
    }

    // Check for component-based code splitting
    const componentsDir = path.join(this.projectRoot, 'src', 'components');
    if (fs.existsSync(componentsDir)) {
      try {
        const files = this.getAllFiles(componentsDir, ['.tsx']);
        const componentCount = files.length;

        if (componentCount > 10) {
          this.log('PASS', 'code_splitting', 'component_based', `Component-based splitting potential with ${componentCount} components`);
        } else {
          this.log('WARN', 'code_splitting', 'component_based', 'Limited component-based splitting opportunity');
        }
      } catch (error) {
        this.log('WARN', 'code_splitting', 'component_based', 'Could not analyze component splitting');
      }
    }
  }

  async auditMobilePerformance() {
    // Check for mobile-specific optimizations
    const mobileOptimizations = [
      { pattern: 'viewport.*meta', name: 'viewport_meta' },
      { pattern: 'touch.*action', name: 'touch_optimization' },
      { pattern: 'mobile.*friendly', name: 'mobile_friendly' },
      { pattern: 'responsive', name: 'responsive_design' }
    ];

    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'app'),
      path.join(this.projectRoot, 'public')
    ];

    for (const optimization of mobileOptimizations) {
      let found = false;

      for (const dirPath of filesToCheck) {
        if (fs.existsSync(dirPath)) {
          try {
            const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js', '.html']);
            
            for (const file of files) {
              const content = fs.readFileSync(file, 'utf8').toLowerCase();
              
              if (content.match(new RegExp(optimization.pattern))) {
                found = true;
                break;
              }
            }
            
            if (found) break;
          } catch (error) {
            // Continue checking
          }
        }
      }

      if (found) {
        this.log('PASS', 'mobile_performance', optimization.name, `${optimization.name.replace(/_/g, ' ')} found`);
      } else {
        this.log('WARN', 'mobile_performance', optimization.name, `${optimization.name.replace(/_/g, ' ')} not found`);
      }
    }
  }

  async auditAccessibilityPerformance() {
    const accessibilityFeatures = [
      { pattern: 'aria-', name: 'aria_attributes' },
      { pattern: 'alt=', name: 'image_alt_text' },
      { pattern: 'tabindex', name: 'keyboard_navigation' },
      { pattern: 'sr-only', name: 'screen_reader' }
    ];

    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'app'),
      path.join(this.projectRoot, 'src', 'components')
    ];

    let accessibilityScore = 0;

    for (const feature of accessibilityFeatures) {
      let found = false;

      for (const dirPath of filesToCheck) {
        if (fs.existsSync(dirPath)) {
          try {
            const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
            
            for (const file of files) {
              const content = fs.readFileSync(file, 'utf8');
              
              if (content.includes(feature.pattern)) {
                found = true;
                break;
              }
            }
            
            if (found) break;
          } catch (error) {
            // Continue checking
          }
        }
      }

      if (found) {
        accessibilityScore++;
        this.log('PASS', 'accessibility_performance', feature.name, `${feature.name.replace(/_/g, ' ')} implemented`);
      } else {
        this.log('WARN', 'accessibility_performance', feature.name, `${feature.name.replace(/_/g, ' ')} not found`);
      }
    }

    const accessibilityPercentage = (accessibilityScore / accessibilityFeatures.length) * 100;
    if (accessibilityPercentage >= 75) {
      this.log('PASS', 'accessibility_performance', 'overall_score', `Accessibility score: ${accessibilityPercentage}%`);
    } else {
      this.log('WARN', 'accessibility_performance', 'overall_score', `Accessibility score: ${accessibilityPercentage}% - needs improvement`);
    }
  }

  async auditCrisisResponsePerformance() {
    // Check for crisis-related performance optimizations
    const crisisFeatures = [
      { pattern: 'crisis.*fast', name: 'crisis_fast_loading' },
      { pattern: 'emergency.*response', name: 'emergency_response' },
      { pattern: 'priority.*loading', name: 'priority_loading' },
      { pattern: 'immediate.*access', name: 'immediate_access' }
    ];

    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'components'),
      path.join(this.projectRoot, 'src', 'lib')
    ];

    let crisisPerformanceFeatures = 0;

    for (const feature of crisisFeatures) {
      let found = false;

      for (const dirPath of filesToCheck) {
        if (fs.existsSync(dirPath)) {
          try {
            const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
            
            for (const file of files) {
              const content = fs.readFileSync(file, 'utf8').toLowerCase();
              
              if (content.match(new RegExp(feature.pattern))) {
                found = true;
                crisisPerformanceFeatures++;
                break;
              }
            }
            
            if (found) break;
          } catch (error) {
            // Continue checking
          }
        }
      }

      if (found) {
        this.log('PASS', 'crisis_performance', feature.name, `${feature.name.replace(/_/g, ' ')} implemented`);
      } else {
        this.log('WARN', 'crisis_performance', feature.name, `${feature.name.replace(/_/g, ' ')} not found`);
      }
    }

    if (crisisPerformanceFeatures === 0) {
      this.log('WARN', 'crisis_performance', 'summary', 'No crisis-specific performance optimizations found');
    }
  }

  getAllFiles(dirPath, extensions) {
    let files = [];
    
    try {
      if (!fs.existsSync(dirPath)) return files;
      
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files = files.concat(this.getAllFiles(fullPath, extensions));
        } else if (extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Return empty array if directory can't be read
    }
    
    return files;
  }

  generateAnalyticsPerformanceReport() {
    console.log(`\n${colors.purple}📊 PHASE 4: Generating Analytics & Performance Report${colors.reset}`);
    console.log(`${colors.blue}=====================================================${colors.reset}`);

    // Calculate statistics
    const totalTests = this.auditResults.length;
    const passCount = this.auditResults.filter(r => r.level === 'PASS').length;
    const failCount = this.auditResults.filter(r => r.level === 'FAIL').length;
    const warnCount = this.auditResults.filter(r => r.level === 'WARN').length;
    const infoCount = this.auditResults.filter(r => r.level === 'INFO').length;

    const passPercentage = Math.round((passCount / totalTests) * 100);

    // Generate reports
    const csvHeader = 'timestamp,level,category,test,details\n';
    const csvData = this.auditResults.map(r => 
      `${r.timestamp},${r.level},${r.category},${r.test},"${r.details.replace(/"/g, '""')}"`
    ).join('\n');
    
    fs.writeFileSync(
      path.join(this.reportDir, 'analytics_performance_audit.csv'),
      csvHeader + csvData
    );

    // Generate summary
    const summary = {
      timestamp: this.timestamp,
      project: 'alchm-analytics-performance',
      totalTests,
      results: { passCount, failCount, warnCount, infoCount },
      passPercentage,
      complianceStatus: this.determineComplianceStatus(passPercentage, failCount),
      criticalIssues: this.auditResults.filter(r => r.level === 'FAIL'),
      performanceThresholds: this.performanceThresholds,
      analyticsRequirements: this.analyticsRequirements,
      traumaInformedCompliance: this.assessTraumaInformedCompliance(),
      educationalCompliance: this.assessEducationalCompliance(),
      privacyCompliance: this.assessPrivacyCompliance()
    };

    fs.writeFileSync(
      path.join(this.reportDir, 'analytics_performance_summary.json'),
      JSON.stringify(summary, null, 2)
    );

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(summary);
    fs.writeFileSync(
      path.join(this.reportDir, 'ANALYTICS_PERFORMANCE_AUDIT_REPORT.md'),
      markdownReport
    );

    console.log(`\n${colors.cyan}📊 Analytics & Performance Audit Complete${colors.reset}`);
    console.log(`${colors.blue}=============================================${colors.reset}`);
    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`${colors.green}✅ Passed: ${passCount} (${passPercentage}%)${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failCount}${colors.reset}`);
    console.log(`${colors.yellow}⚠️ Warnings: ${warnCount}${colors.reset}`);
    console.log(`${colors.blue}ℹ️ Info: ${infoCount}${colors.reset}`);

    // Final status
    const status = this.determineComplianceStatus(passPercentage, failCount);
    if (status === 'COMPLIANT') {
      console.log(`\n${colors.green}🎯 STATUS: ANALYTICS & PERFORMANCE ARE PRODUCTION-READY${colors.reset}`);
    } else if (status === 'NEEDS_FIXES') {
      console.log(`\n${colors.yellow}⚠️ STATUS: NEEDS FIXES BEFORE PRODUCTION${colors.reset}`);
    } else {
      console.log(`\n${colors.red}🚨 STATUS: CRITICAL ISSUES - NOT PRODUCTION-READY${colors.reset}`);
    }

    console.log(`\n📁 Analytics & performance audit reports generated in: ${this.reportDir}`);

    return summary;
  }

  determineComplianceStatus(passPercentage, failCount) {
    if (passPercentage >= 85 && failCount <= 3) {
      return 'COMPLIANT';
    } else if (passPercentage >= 70 && failCount <= 6) {
      return 'NEEDS_FIXES';
    } else {
      return 'CRITICAL_ISSUES';
    }
  }

  assessTraumaInformedCompliance() {
    const traumaTests = this.auditResults.filter(r => 
      r.category.includes('trauma') || 
      r.category.includes('crisis') || 
      r.test.includes('trauma') || 
      r.test.includes('crisis')
    );
    const passedTrauma = traumaTests.filter(r => r.level === 'PASS').length;
    const totalTrauma = traumaTests.length;
    
    return {
      score: totalTrauma > 0 ? Math.round((passedTrauma / totalTrauma) * 100) : 0,
      status: passedTrauma >= totalTrauma * 0.8 ? 'COMPLIANT' : 'NEEDS_IMPROVEMENT',
      features: {
        traumaInformedTracking: this.auditResults.some(r => r.test.includes('trauma_tracking') && r.level === 'PASS'),
        crisisPerformance: this.auditResults.some(r => r.test.includes('crisis_performance') && r.level === 'PASS'),
        privacySafeLogging: this.auditResults.some(r => r.test.includes('privacy_safe') && r.level === 'PASS'),
        wellbeingMetrics: this.auditResults.some(r => r.test.includes('wellbeing') && r.level === 'PASS')
      }
    };
  }

  assessEducationalCompliance() {
    const complianceTests = this.auditResults.filter(r => 
      r.category === 'coppa' || 
      r.category === 'ferpa' || 
      r.category.includes('educational')
    );
    const passedCompliance = complianceTests.filter(r => r.level === 'PASS').length;
    const totalCompliance = complianceTests.length;
    
    return {
      score: totalCompliance > 0 ? Math.round((passedCompliance / totalCompliance) * 100) : 0,
      status: passedCompliance >= totalCompliance * 0.9 ? 'COMPLIANT' : 'NEEDS_IMPROVEMENT',
      requirements: {
        coppa: this.auditResults.some(r => r.category === 'coppa' && r.level === 'PASS'),
        ferpa: this.auditResults.some(r => r.category === 'ferpa' && r.level === 'PASS'),
        educationalAnalytics: this.auditResults.some(r => r.category === 'educational_analytics' && r.level === 'PASS'),
        parentalConsent: this.auditResults.some(r => r.test.includes('parental_consent') && r.level === 'PASS')
      }
    };
  }

  assessPrivacyCompliance() {
    const privacyTests = this.auditResults.filter(r => 
      r.category === 'gdpr' || 
      r.category === 'consent' || 
      r.category === 'anonymization' ||
      r.category === 'data_retention'
    );
    const passedPrivacy = privacyTests.filter(r => r.level === 'PASS').length;
    const totalPrivacy = privacyTests.length;
    
    return {
      score: totalPrivacy > 0 ? Math.round((passedPrivacy / totalPrivacy) * 100) : 0,
      status: passedPrivacy >= totalPrivacy * 0.9 ? 'COMPLIANT' : 'NEEDS_IMPROVEMENT',
      features: {
        gdprCompliance: this.auditResults.some(r => r.category === 'gdpr' && r.level === 'PASS'),
        consentManagement: this.auditResults.some(r => r.category === 'consent' && r.level === 'PASS'),
        dataAnonymization: this.auditResults.some(r => r.category === 'anonymization' && r.level === 'PASS'),
        dataRetention: this.auditResults.some(r => r.category === 'data_retention' && r.level === 'PASS')
      }
    };
  }

  generateMarkdownReport(summary) {
    return `# ALCHM Analytics & Performance Audit Report

**Generated:** ${new Date().toISOString()}  
**Project:** ALCHM Trauma-Informed AI Journaling OS  
**Analytics & Performance:** Production Deployment Assessment  
**Educational Compliance:** COPPA/FERPA/GDPR Required  

## Executive Summary

| Metric | Count | Percentage |
|--------|--------|------------|
| Total Tests | ${summary.totalTests} | 100% |
| ✅ Passed | ${summary.results.passCount} | ${summary.passPercentage}% |
| ❌ Failed | ${summary.results.failCount} | ${Math.round((summary.results.failCount / summary.totalTests) * 100)}% |
| ⚠️ Warnings | ${summary.results.warnCount} | ${Math.round((summary.results.warnCount / summary.totalTests) * 100)}% |
| ℹ️ Info | ${summary.results.infoCount} | ${Math.round((summary.results.infoCount / summary.totalTests) * 100)}% |

## Compliance Status

${summary.complianceStatus === 'COMPLIANT' ? 
  '🟢 **COMPLIANT - PRODUCTION READY**' : 
  summary.complianceStatus === 'NEEDS_FIXES' ? 
  '🟡 **NEEDS FIXES BEFORE PRODUCTION**' : 
  '🔴 **CRITICAL COMPLIANCE ISSUES - NOT PRODUCTION READY**'
}

## Trauma-Informed Analytics Assessment

**Score:** ${summary.traumaInformedCompliance.score}%  
**Status:** ${summary.traumaInformedCompliance.status}

### Trauma-Informed Features Status
- **Trauma-Informed Tracking:** ${summary.traumaInformedCompliance.features.traumaInformedTracking ? '✅' : '❌'} (Mood, wellbeing metrics)
- **Crisis Performance:** ${summary.traumaInformedCompliance.features.crisisPerformance ? '✅' : '❌'} (Emergency response optimization)
- **Privacy-Safe Logging:** ${summary.traumaInformedCompliance.features.privacySafeLogging ? '✅' : '❌'} (No sensitive data exposure)
- **Wellbeing Metrics:** ${summary.traumaInformedCompliance.features.wellbeingMetrics ? '✅' : '❌'} (Therapeutic progress tracking)

## Educational Compliance Assessment

**Score:** ${summary.educationalCompliance.score}%  
**Status:** ${summary.educationalCompliance.status}

### Educational Requirements Status
- **COPPA (Under 13):** ${summary.educationalCompliance.requirements.coppa ? '✅' : '❌'}
- **FERPA (Educational Records):** ${summary.educationalCompliance.requirements.ferpa ? '✅' : '❌'}
- **Educational Analytics:** ${summary.educationalCompliance.requirements.educationalAnalytics ? '✅' : '❌'}
- **Parental Consent:** ${summary.educationalCompliance.requirements.parentalConsent ? '✅' : '❌'}

## Privacy Compliance Assessment

**Score:** ${summary.privacyCompliance.score}%  
**Status:** ${summary.privacyCompliance.status}

### Privacy Features Status
- **GDPR Compliance:** ${summary.privacyCompliance.features.gdprCompliance ? '✅' : '❌'}
- **Consent Management:** ${summary.privacyCompliance.features.consentManagement ? '✅' : '❌'}
- **Data Anonymization:** ${summary.privacyCompliance.features.dataAnonymization ? '✅' : '❌'}
- **Data Retention:** ${summary.privacyCompliance.features.dataRetention ? '✅' : '❌'}

## Critical Issues Requiring Immediate Attention

${summary.criticalIssues.length > 0 ?
  summary.criticalIssues.map(issue => `- **${issue.category}/${issue.test}:** ${issue.details}`).join('\n') :
  'No critical analytics/performance issues identified.'
}

## Performance Thresholds & Targets

### Core Web Vitals (Trauma-Informed Targets)
- **First Contentful Paint:** < ${summary.performanceThresholds.firstContentfulPaint}ms (gentle loading)
- **Largest Contentful Paint:** < ${summary.performanceThresholds.largestContentfulPaint}ms
- **First Input Delay:** < ${summary.performanceThresholds.firstInputDelay}ms (crisis responsiveness)
- **Cumulative Layout Shift:** < ${summary.performanceThresholds.cumulativeLayoutShift} (stable, trauma-sensitive)

### Application Performance
- **Bundle Size:** < ${summary.performanceThresholds.bundleSizeKB}KB initial load
- **Mobile Performance Score:** > ${summary.performanceThresholds.mobilePerformanceScore}
- **Accessibility Score:** > ${summary.performanceThresholds.accessibilityScore} (inclusive design)
- **Error Rate:** < ${summary.performanceThresholds.errorRate}%

## Analytics Implementation Analysis

### Firebase Analytics
- Event tracking and user behavior analysis
- Custom metrics for therapeutic progress
- Conversion funnel optimization
- Real-time engagement monitoring

### Privacy-Preserving Analytics
- Client-side anonymization before transmission
- Consent-based data collection
- Granular privacy controls
- GDPR/COPPA compliant implementation

### Educational Analytics
- Learning progress tracking (FERPA compliant)
- Engagement metrics with parental controls
- Achievement and milestone tracking
- Safe data sharing for educational insights

## Performance Optimization Strategy

### Trauma-Informed Performance
- **Crisis Response:** < 100ms for emergency features
- **Gentle Loading:** Progressive enhancement for vulnerable users
- **Stable Layout:** No sudden shifts that could trigger trauma
- **Offline Capability:** Essential features work without connectivity

### Mobile-First Performance
- Touch-optimized interactions
- Responsive design for all devices
- Optimized for low-bandwidth scenarios
- Battery-efficient implementations

### Accessibility Performance
- Screen reader optimization
- Keyboard navigation efficiency
- High contrast and large text support
- Voice control compatibility

## Privacy & Compliance Architecture

### Data Protection by Design
1. **Client-Side Encryption:** All sensitive data encrypted before transmission
2. **Anonymization:** Personal identifiers removed from analytics
3. **Consent Management:** Granular control over data collection
4. **Data Minimization:** Only essential data collected and stored

### Educational Compliance Framework
1. **COPPA Compliance:** Parental consent for under-13 users
2. **FERPA Compliance:** Educational record protection
3. **Age Verification:** Robust age checking mechanisms
4. **Directory Information:** Proper handling of student data

### GDPR Rights Implementation
1. **Right to Access:** Data export functionality
2. **Right to Rectification:** Profile update capabilities
3. **Right to Erasure:** Complete data deletion
4. **Right to Portability:** Data format standardization

## Recommendations for Production Deployment

### High Priority Fixes
${summary.criticalIssues.length > 0 ?
  summary.criticalIssues.slice(0, 5).map(issue => `- **${issue.test}:** ${issue.details}`).join('\n') :
  '- No critical fixes required'
}

### Performance Optimizations
1. **Bundle Size Reduction:** Implement code splitting for non-critical features
2. **Image Optimization:** Compress and optimize all visual assets
3. **Cache Strategy:** Implement aggressive caching for static resources
4. **Critical Path:** Optimize above-the-fold content loading

### Privacy Enhancements
1. **Consent UX:** Improve consent flow for better user understanding
2. **Data Transparency:** Enhance data usage explanations
3. **Anonymization:** Strengthen PII removal processes
4. **Retention Policies:** Implement automated data cleanup

### Educational Compliance
1. **COPPA Implementation:** Complete age verification and parental consent
2. **FERPA Compliance:** Add educational record privacy protections
3. **Documentation:** Create comprehensive privacy documentation
4. **Training:** Implement staff training on educational data handling

## Next Steps for Firebase Studio Deployment

1. **Fix Critical Issues:** Address all failed compliance tests
2. **Performance Testing:** Conduct load testing with trauma-informed scenarios
3. **Privacy Audit:** Third-party privacy compliance review
4. **Educational Certification:** Obtain COPPA/FERPA compliance certification
5. **Accessibility Testing:** Comprehensive accessibility audit
6. **Crisis Response Testing:** Validate emergency feature performance

## Monitoring & Alerting Strategy

### Real-Time Monitoring
- Performance degradation alerts
- Error rate spike detection
- Privacy breach monitoring
- Crisis intervention response times

### Educational Compliance Monitoring
- COPPA consent tracking
- FERPA access logging
- Data retention compliance
- Parental notification systems

### Trauma-Informed Metrics
- Crisis response effectiveness
- User wellbeing indicators
- Therapeutic progress tracking
- Safety resource utilization

---

**Analytics & Performance Audit Completed by ALCHM Monitoring Suite**  
*For detailed test results, see analytics_performance_audit.csv*
`;
  }

  async run() {
    console.log(`${colors.cyan}📊 ALCHM Analytics & Performance Audit${colors.reset}`);
    console.log(`${colors.blue}=====================================${colors.reset}`);
    console.log(`Timestamp: ${this.timestamp}`);
    console.log(`Project Root: ${this.projectRoot}`);
    console.log(`Report Directory: ${this.reportDir}\n`);

    await this.auditAnalyticsImplementation();
    await this.auditPrivacyCompliance();
    await this.auditPerformanceOptimization();
    
    return this.generateAnalyticsPerformanceReport();
  }
}

// Run the audit if this file is executed directly
if (require.main === module) {
  const auditor = new AnalyticsPerformanceAuditor();
  auditor.run().catch(console.error);
}

module.exports = AnalyticsPerformanceAuditor;