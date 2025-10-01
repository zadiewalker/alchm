#!/usr/bin/env node

/**
 * 🔄 ALCHM Firebase Studio Continuous Monitoring System
 * 
 * Real-time monitoring system that continuously validates Firebase Studio
 * compliance and provides predictive issue detection with automated alerting.
 * 
 * @version 2.0.0 - Production Ready
 * @author ALCHM Core Team
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const EventEmitter = require('events');

class FirebaseStudioContinuousMonitor extends EventEmitter {
  constructor() {
    super();
    this.isRunning = false;
    this.metrics = new Map();
    this.alerts = [];
    this.thresholds = this.loadThresholds();
    this.watchers = new Map();
    this.lastCheck = null;
    this.checkInterval = 30000; // 30 seconds
    this.verbose = process.argv.includes('--verbose');
    
    this.log('🔄 Firebase Studio Continuous Monitor initialized');
  }

  loadThresholds() {
    return {
      bundleSize: {
        warning: 1.6 * 1024 * 1024,  // 1.6MB (80% of 2MB limit)
        critical: 1.9 * 1024 * 1024  // 1.9MB (95% of 2MB limit)
      },
      assetSize: {
        warning: 0.8 * 1024 * 1024,  // 800KB (80% of 1MB limit)
        critical: 0.95 * 1024 * 1024 // 950KB (95% of 1MB limit)
      },
      buildTime: {
        warning: 180000,  // 3 minutes
        critical: 300000  // 5 minutes
      },
      memoryUsage: {
        warning: 6 * 1024 * 1024 * 1024,  // 6GB
        critical: 7 * 1024 * 1024 * 1024  // 7GB
      },
      errorRate: {
        warning: 0.05,  // 5%
        critical: 0.1   // 10%
      }
    };
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '🔄',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'critical': '🚨',
      'metric': '📊'
    }[level] || '🔄';
    
    if (this.verbose || level !== 'info') {
      console.log(`${prefix} [${timestamp}] ${message}`);
    }
  }

  createAlert(severity, metric, current, threshold, description) {
    const alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      severity,
      metric,
      current,
      threshold,
      description,
      resolved: false
    };
    
    this.alerts.push(alert);
    this.emit('alert', alert);
    this.log(`${description} (${current} vs ${threshold})`, severity);
    
    return alert;
  }

  // 1. REAL-TIME BUNDLE SIZE MONITORING
  async monitorBundleSize() {
    try {
      const buildStart = Date.now();
      
      // Quick build check without full optimization
      const buildCommand = 'NODE_OPTIONS="--max-old-space-size=4096" next build --no-lint --no-minify';
      const buildResult = execSync(buildCommand, { 
        encoding: 'utf8', 
        timeout: 300000,
        stdio: 'pipe'
      });
      
      const buildTime = Date.now() - buildStart;
      this.recordMetric('buildTime', buildTime);
      
      // Check build time threshold
      if (buildTime > this.thresholds.buildTime.critical) {
        this.createAlert('critical', 'buildTime', buildTime, this.thresholds.buildTime.critical,
          'Build time exceeds critical threshold');
      } else if (buildTime > this.thresholds.buildTime.warning) {
        this.createAlert('warning', 'buildTime', buildTime, this.thresholds.buildTime.warning,
          'Build time exceeds warning threshold');
      }
      
      // Analyze bundle
      const bundleInfo = this.parseBuildOutput(buildResult);
      this.recordMetric('bundleSize', bundleInfo.totalSize);
      this.recordMetric('firstLoadJS', bundleInfo.firstLoadJS);
      
      // Check bundle size thresholds
      if (bundleInfo.totalSize > this.thresholds.bundleSize.critical) {
        this.createAlert('critical', 'bundleSize', bundleInfo.totalSize, 
          this.thresholds.bundleSize.critical, 'Bundle size exceeds Firebase Studio limit');
      } else if (bundleInfo.totalSize > this.thresholds.bundleSize.warning) {
        this.createAlert('warning', 'bundleSize', bundleInfo.totalSize,
          this.thresholds.bundleSize.warning, 'Bundle size approaching Firebase Studio limit');
      }
      
      // Check individual assets
      bundleInfo.assets?.forEach(asset => {
        if (asset.size > this.thresholds.assetSize.critical) {
          this.createAlert('critical', 'assetSize', asset.size, this.thresholds.assetSize.critical,
            `Asset ${asset.name} exceeds size limit`);
        } else if (asset.size > this.thresholds.assetSize.warning) {
          this.createAlert('warning', 'assetSize', asset.size, this.thresholds.assetSize.warning,
            `Asset ${asset.name} approaching size limit`);
        }
      });
      
      this.log(`Bundle check complete: ${(bundleInfo.totalSize / 1024 / 1024).toFixed(2)}MB`, 'metric');
      
    } catch (error) {
      this.log(`Bundle monitoring failed: ${error.message}`, 'error');
      this.recordMetric('monitoringErrors', (this.getMetric('monitoringErrors') || 0) + 1);
    }
  }

  parseBuildOutput(output) {
    const bundleInfo = {
      firstLoadJS: 0,
      totalSize: 0,
      assets: [],
      chunks: []
    };
    
    const lines = output.split('\n');
    
    for (const line of lines) {
      // Parse Next.js build output
      if (line.includes('First Load JS shared by all')) {
        const match = line.match(/(\d+(?:\.\d+)?)\s*kB/);
        if (match) {
          bundleInfo.firstLoadJS = parseFloat(match[1]) * 1024;
        }
      }
      
      // Parse individual assets
      if (line.includes('.js') && line.includes('kB')) {
        const match = line.match(/([^\s]+\.js)\s+(\d+(?:\.\d+)?)\s*kB/);
        if (match) {
          const size = parseFloat(match[2]) * 1024;
          bundleInfo.assets.push({
            name: match[1],
            size: size
          });
          bundleInfo.totalSize += size;
        }
      }
    }
    
    return bundleInfo;
  }

  // 2. FILE SYSTEM MONITORING
  startFileWatching() {
    const watchPaths = [
      'src/',
      'pages/',
      'components/',
      'lib/',
      'next.config.js',
      'package.json',
      'firebase.json'
    ];
    
    watchPaths.forEach(watchPath => {
      if (fs.existsSync(watchPath)) {
        const watcher = fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
          if (filename && !filename.includes('node_modules') && !filename.startsWith('.')) {
            this.log(`File changed: ${path.join(watchPath, filename)}`, 'info');
            this.scheduleComplianceCheck();
          }
        });
        
        this.watchers.set(watchPath, watcher);
        this.log(`Watching: ${watchPath}`, 'info');
      }
    });
  }

  scheduleComplianceCheck() {
    // Debounce file changes to avoid excessive checking
    clearTimeout(this.checkTimeout);
    this.checkTimeout = setTimeout(() => {
      this.runComplianceCheck();
    }, 5000); // 5 second delay
  }

  // 3. PERFORMANCE METRICS MONITORING
  async monitorPerformanceMetrics() {
    try {
      // Memory usage monitoring
      const memoryUsage = process.memoryUsage();
      this.recordMetric('heapUsed', memoryUsage.heapUsed);
      this.recordMetric('heapTotal', memoryUsage.heapTotal);
      this.recordMetric('rss', memoryUsage.rss);
      
      if (memoryUsage.heapUsed > this.thresholds.memoryUsage.critical) {
        this.createAlert('critical', 'memoryUsage', memoryUsage.heapUsed,
          this.thresholds.memoryUsage.critical, 'Memory usage critical');
      } else if (memoryUsage.heapUsed > this.thresholds.memoryUsage.warning) {
        this.createAlert('warning', 'memoryUsage', memoryUsage.heapUsed,
          this.thresholds.memoryUsage.warning, 'Memory usage high');
      }
      
      // Check for memory leaks
      this.detectMemoryLeaks();
      
      // TypeScript compilation check
      await this.checkTypeScriptCompilation();
      
      // ESLint check
      await this.checkLinting();
      
    } catch (error) {
      this.log(`Performance monitoring failed: ${error.message}`, 'error');
    }
  }

  detectMemoryLeaks() {
    const currentHeap = this.getMetric('heapUsed');
    const previousHeap = this.getMetric('previousHeapUsed');
    
    if (previousHeap && currentHeap > previousHeap * 1.5) {
      this.createAlert('warning', 'memoryLeak', currentHeap, previousHeap * 1.5,
        'Potential memory leak detected');
    }
    
    this.recordMetric('previousHeapUsed', currentHeap);
  }

  async checkTypeScriptCompilation() {
    try {
      const start = Date.now();
      execSync('npx tsc --noEmit', { stdio: 'pipe', timeout: 60000 });
      const duration = Date.now() - start;
      
      this.recordMetric('typeScriptCompileTime', duration);
      this.recordMetric('typeScriptErrors', 0);
      
    } catch (error) {
      const errorCount = (error.stdout || '').split('\n').filter(line => 
        line.includes('error TS')).length;
      
      this.recordMetric('typeScriptErrors', errorCount);
      
      if (errorCount > 10) {
        this.createAlert('critical', 'typeScriptErrors', errorCount, 10,
          'High number of TypeScript errors detected');
      } else if (errorCount > 0) {
        this.createAlert('warning', 'typeScriptErrors', errorCount, 0,
          'TypeScript compilation errors detected');
      }
    }
  }

  async checkLinting() {
    try {
      execSync('npm run lint', { stdio: 'pipe', timeout: 60000 });
      this.recordMetric('lintErrors', 0);
    } catch (error) {
      const errorCount = (error.stdout || '').split('\n').filter(line => 
        line.includes('error') || line.includes('✖')).length;
      
      this.recordMetric('lintErrors', errorCount);
      
      if (errorCount > 20) {
        this.createAlert('warning', 'lintErrors', errorCount, 20,
          'High number of linting errors detected');
      }
    }
  }

  // 4. DEPENDENCY MONITORING
  async monitorDependencies() {
    try {
      // Check for security vulnerabilities
      const auditResult = execSync('npm audit --json', { 
        encoding: 'utf8', 
        stdio: 'pipe' 
      });
      
      const audit = JSON.parse(auditResult);
      const vulnerabilities = audit.metadata?.vulnerabilities?.total || 0;
      
      this.recordMetric('securityVulnerabilities', vulnerabilities);
      
      if (vulnerabilities > 0) {
        this.createAlert('warning', 'securityVulnerabilities', vulnerabilities, 0,
          `${vulnerabilities} security vulnerabilities detected`);
      }
      
      // Check package.json for dependency bloat
      await this.checkDependencyBloat();
      
    } catch (error) {
      // npm audit returns non-zero exit for vulnerabilities
      if (error.stdout) {
        try {
          const audit = JSON.parse(error.stdout);
          const vulnerabilities = audit.metadata?.vulnerabilities?.total || 0;
          this.recordMetric('securityVulnerabilities', vulnerabilities);
        } catch (parseError) {
          this.log('Could not parse npm audit results', 'warning');
        }
      }
    }
  }

  async checkDependencyBloat() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const depCount = Object.keys(packageJson.dependencies || {}).length;
    const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
    
    this.recordMetric('dependencyCount', depCount);
    this.recordMetric('devDependencyCount', devDepCount);
    
    if (depCount > 50) {
      this.createAlert('warning', 'dependencyCount', depCount, 50,
        'High number of production dependencies detected');
    }
    
    if (devDepCount > 100) {
      this.createAlert('warning', 'devDependencyCount', devDepCount, 100,
        'High number of development dependencies detected');
    }
  }

  // 5. FIREBASE CONFIGURATION MONITORING
  async monitorFirebaseConfig() {
    try {
      // Check Firebase configuration files
      const configs = ['firebase.json', 'firestore.rules', 'firestore.indexes.json'];
      
      for (const config of configs) {
        if (!fs.existsSync(config)) {
          this.createAlert('critical', 'firebaseConfig', 0, 1,
            `Firebase configuration file missing: ${config}`);
        } else {
          // Validate configuration format
          if (config.endsWith('.json')) {
            try {
              JSON.parse(fs.readFileSync(config, 'utf8'));
            } catch (error) {
              this.createAlert('critical', 'firebaseConfig', 0, 1,
                `Invalid JSON in ${config}: ${error.message}`);
            }
          }
        }
      }
      
      // Check Firebase functions
      await this.checkFirebaseFunctions();
      
    } catch (error) {
      this.log(`Firebase configuration monitoring failed: ${error.message}`, 'error');
    }
  }

  async checkFirebaseFunctions() {
    const functionsDir = 'functions';
    if (fs.existsSync(functionsDir)) {
      try {
        // Check if functions can be built
        const start = Date.now();
        execSync('cd functions && npm run build', { stdio: 'pipe', timeout: 120000 });
        const buildTime = Date.now() - start;
        
        this.recordMetric('functionsBuildTime', buildTime);
        
        if (buildTime > 60000) { // 1 minute
          this.createAlert('warning', 'functionsBuildTime', buildTime, 60000,
            'Firebase Functions build time is slow');
        }
        
      } catch (error) {
        this.createAlert('critical', 'functionsBuild', 0, 1,
          'Firebase Functions build failed');
      }
    }
  }

  // 6. PREDICTIVE ISSUE DETECTION
  async detectTrends() {
    const metrics = ['bundleSize', 'buildTime', 'typeScriptErrors', 'memoryUsage'];
    
    metrics.forEach(metric => {
      const history = this.getMetricHistory(metric, 10); // Last 10 data points
      if (history.length >= 5) {
        const trend = this.calculateTrend(history);
        
        if (trend.isIncreasing && trend.rate > 0.1) { // 10% increase rate
          this.createAlert('warning', `${metric}Trend`, trend.rate, 0.1,
            `Increasing trend detected in ${metric}: ${(trend.rate * 100).toFixed(1)}% per check`);
        }
      }
    });
  }

  calculateTrend(values) {
    if (values.length < 2) return { isIncreasing: false, rate: 0 };
    
    const recent = values.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const older = values.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    
    const rate = (recent - older) / older;
    
    return {
      isIncreasing: rate > 0,
      rate: Math.abs(rate)
    };
  }

  // 7. AUTOMATED REMEDIATION
  async attemptAutomaticRemediation(alert) {
    this.log(`Attempting automatic remediation for: ${alert.description}`, 'info');
    
    try {
      switch (alert.metric) {
        case 'bundleSize':
          await this.remediateBundleSize();
          break;
          
        case 'memoryUsage':
          await this.remediateMemoryUsage();
          break;
          
        case 'typeScriptErrors':
          await this.remediateTypeScriptErrors();
          break;
          
        case 'securityVulnerabilities':
          await this.remediateSecurityVulnerabilities();
          break;
          
        default:
          this.log(`No automatic remediation available for ${alert.metric}`, 'warning');
      }
    } catch (error) {
      this.log(`Automatic remediation failed: ${error.message}`, 'error');
    }
  }

  async remediateBundleSize() {
    // Apply emergency bundle optimization
    execSync('node scripts/firebase-studio-auto-healer.js --bundle-only', { stdio: 'inherit' });
    this.log('Applied emergency bundle optimization', 'success');
  }

  async remediateMemoryUsage() {
    // Force garbage collection
    if (global.gc) {
      global.gc();
      this.log('Forced garbage collection', 'success');
    }
    
    // Clear caches
    this.clearMetricHistory();
    this.log('Cleared metric history cache', 'success');
  }

  async remediateTypeScriptErrors() {
    // This would run automated TypeScript fixes if available
    this.log('TypeScript error remediation requires manual intervention', 'warning');
  }

  async remediateSecurityVulnerabilities() {
    try {
      execSync('npm audit fix', { stdio: 'inherit', timeout: 120000 });
      this.log('Applied npm audit fixes', 'success');
    } catch (error) {
      this.log('Automatic security fix failed', 'warning');
    }
  }

  // METRIC MANAGEMENT
  recordMetric(name, value) {
    const timestamp = Date.now();
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const history = this.metrics.get(name);
    history.push({ value, timestamp });
    
    // Keep only last 100 data points per metric
    if (history.length > 100) {
      history.shift();
    }
    
    this.log(`Metric recorded: ${name} = ${value}`, 'metric');
  }

  getMetric(name) {
    const history = this.metrics.get(name);
    return history && history.length > 0 ? history[history.length - 1].value : null;
  }

  getMetricHistory(name, count = 10) {
    const history = this.metrics.get(name) || [];
    return history.slice(-count).map(entry => entry.value);
  }

  clearMetricHistory() {
    this.metrics.clear();
    this.log('Metric history cleared', 'info');
  }

  // MAIN MONITORING LOOP
  async runComplianceCheck() {
    if (this.isRunning) {
      this.log('Compliance check already running, skipping...', 'warning');
      return;
    }
    
    this.isRunning = true;
    this.lastCheck = new Date();
    
    try {
      this.log('Running comprehensive compliance check...', 'info');
      
      // Run all monitoring checks
      await Promise.all([
        this.monitorBundleSize(),
        this.monitorPerformanceMetrics(),
        this.monitorDependencies(),
        this.monitorFirebaseConfig()
      ]);
      
      // Predictive analysis
      await this.detectTrends();
      
      // Generate alerts summary
      this.generateAlertsReport();
      
      this.log('Compliance check completed', 'success');
      
    } catch (error) {
      this.log(`Compliance check failed: ${error.message}`, 'error');
    } finally {
      this.isRunning = false;
    }
  }

  generateAlertsReport() {
    const recentAlerts = this.alerts.filter(alert => 
      Date.now() - new Date(alert.timestamp).getTime() < 3600000 // Last hour
    );
    
    const criticalAlerts = recentAlerts.filter(alert => alert.severity === 'critical');
    const warningAlerts = recentAlerts.filter(alert => alert.severity === 'warning');
    
    if (criticalAlerts.length > 0 || warningAlerts.length > 0) {
      this.log(`Alert Summary: ${criticalAlerts.length} critical, ${warningAlerts.length} warnings`, 'warning');
      
      // Save alerts report
      const report = {
        timestamp: new Date().toISOString(),
        summary: {
          critical: criticalAlerts.length,
          warning: warningAlerts.length,
          total: recentAlerts.length
        },
        criticalAlerts,
        warningAlerts,
        metrics: this.getCurrentMetrics()
      };
      
      fs.mkdirSync('monitoring-reports', { recursive: true });
      fs.writeFileSync(
        `monitoring-reports/alerts-${Date.now()}.json`, 
        JSON.stringify(report, null, 2)
      );
    }
  }

  getCurrentMetrics() {
    const current = {};
    this.metrics.forEach((history, name) => {
      if (history.length > 0) {
        current[name] = history[history.length - 1].value;
      }
    });
    return current;
  }

  // MAIN EXECUTION
  start() {
    this.log('🚀 Starting Firebase Studio Continuous Monitor...', 'success');
    
    // Start file watching
    this.startFileWatching();
    
    // Set up event listeners
    this.on('alert', (alert) => {
      if (alert.severity === 'critical') {
        // Attempt automatic remediation for critical alerts
        this.attemptAutomaticRemediation(alert);
      }
    });
    
    // Initial compliance check
    this.runComplianceCheck();
    
    // Set up periodic monitoring
    this.monitoringInterval = setInterval(() => {
      this.runComplianceCheck();
    }, this.checkInterval);
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      this.stop();
    });
    
    process.on('SIGTERM', () => {
      this.stop();
    });
    
    this.log(`Monitor started with ${this.checkInterval / 1000}s check interval`, 'info');
  }

  stop() {
    this.log('🛑 Stopping Firebase Studio Continuous Monitor...', 'info');
    
    // Stop periodic monitoring
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    // Stop file watchers
    this.watchers.forEach(watcher => {
      watcher.close();
    });
    this.watchers.clear();
    
    // Generate final report
    this.generateFinalReport();
    
    this.log('Monitor stopped', 'success');
    process.exit(0);
  }

  generateFinalReport() {
    const report = {
      session: {
        startTime: this.startTime,
        endTime: new Date().toISOString(),
        duration: Date.now() - this.startTime
      },
      summary: {
        totalAlerts: this.alerts.length,
        criticalAlerts: this.alerts.filter(a => a.severity === 'critical').length,
        warningAlerts: this.alerts.filter(a => a.severity === 'warning').length,
        checksPerformed: Math.floor((Date.now() - this.startTime) / this.checkInterval)
      },
      alerts: this.alerts,
      finalMetrics: this.getCurrentMetrics()
    };
    
    fs.mkdirSync('monitoring-reports', { recursive: true });
    fs.writeFileSync(
      `monitoring-reports/session-${Date.now()}.json`,
      JSON.stringify(report, null, 2)
    );
    
    this.log(`Final monitoring report saved`, 'info');
  }
}

// Execute the continuous monitor
if (require.main === module) {
  const monitor = new FirebaseStudioContinuousMonitor();
  monitor.startTime = Date.now();
  monitor.start();
}

module.exports = FirebaseStudioContinuousMonitor;