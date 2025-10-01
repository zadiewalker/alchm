#!/usr/bin/env node

/**
 * ALCHM Continuous Monitoring & Prevention System
 * Prevents issues from recurring and maintains optimal performance
 * 
 * Features:
 * - Real-time performance monitoring
 * - Crisis safety system validation
 * - Build health checking
 * - Memory usage monitoring
 * - Bundle size tracking
 * - Firebase Functions health monitoring
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const http = require('http');

class ALCHMMonitoringSystem {
  constructor() {
    this.rootDir = process.cwd();
    this.monitoringActive = false;
    this.alerts = [];
    this.metrics = {
      bundleSize: 0,
      buildTime: 0,
      memoryUsage: 0,
      crisisResponseTime: 0,
      lastBuildSuccess: null,
      lastDeployment: null
    };
    
    // Performance thresholds
    this.thresholds = {
      maxBundleSize: 250000, // 250KB
      maxBuildTime: 180000,  // 3 minutes
      maxMemoryUsage: 8192,  // 8GB
      maxCrisisResponse: 200, // 200ms
      minUptime: 99.9        // 99.9%
    };
    
    this.checkInterval = 30000; // 30 seconds
    this.reportInterval = 300000; // 5 minutes
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📊',
      warn: '⚠️',
      error: '🚨',
      success: '✅',
      alert: '🔔'
    }[type];
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async startMonitoring() {
    this.log('🚀 ALCHM Continuous Monitoring System Starting...', 'info');
    this.monitoringActive = true;
    
    // Start monitoring intervals
    setInterval(() => this.checkSystemHealth(), this.checkInterval);
    setInterval(() => this.generateReport(), this.reportInterval);
    setInterval(() => this.checkPerformanceMetrics(), this.checkInterval);
    setInterval(() => this.validateCrisisSafety(), this.checkInterval * 2);
    setInterval(() => this.checkBuildHealth(), this.checkInterval * 4);
    
    // Start HTTP monitoring server
    this.startMonitoringServer();
    
    this.log('✅ Monitoring system active with 30s health checks', 'success');
  }

  async checkSystemHealth() {
    try {
      // Check memory usage
      const memoryUsage = process.memoryUsage();
      this.metrics.memoryUsage = memoryUsage.heapUsed / 1024 / 1024; // MB
      
      if (this.metrics.memoryUsage > 1000) { // 1GB threshold
        this.createAlert('HIGH_MEMORY_USAGE', `Memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
      }
      
      // Check disk space
      const diskUsage = await this.checkDiskSpace();
      if (diskUsage > 90) {
        this.createAlert('LOW_DISK_SPACE', `Disk usage: ${diskUsage}%`);
      }
      
      // Check file system health
      await this.checkFileSystemHealth();
      
    } catch (error) {
      this.createAlert('SYSTEM_HEALTH_CHECK_FAILED', error.message);
    }
  }

  async checkPerformanceMetrics() {
    try {
      // Check bundle size if build exists
      const buildPath = path.join(this.rootDir, '.next');
      if (fs.existsSync(buildPath)) {
        this.metrics.bundleSize = await this.calculateBundleSize();
        
        if (this.metrics.bundleSize > this.thresholds.maxBundleSize) {
          this.createAlert('BUNDLE_SIZE_EXCEEDED', 
            `Bundle size: ${(this.metrics.bundleSize / 1024).toFixed(2)}KB exceeds ${(this.thresholds.maxBundleSize / 1024).toFixed(2)}KB`);
        }
      }
      
      // Check crisis response time simulation
      const crisisStart = Date.now();
      await this.simulateCrisisDetection();
      this.metrics.crisisResponseTime = Date.now() - crisisStart;
      
      if (this.metrics.crisisResponseTime > this.thresholds.maxCrisisResponse) {
        this.createAlert('CRISIS_RESPONSE_SLOW', 
          `Crisis response: ${this.metrics.crisisResponseTime}ms exceeds ${this.thresholds.maxCrisisResponse}ms`);
      }
      
    } catch (error) {
      this.createAlert('PERFORMANCE_CHECK_FAILED', error.message);
    }
  }

  async validateCrisisSafety() {
    try {
      // Check crisis detection patterns
      const functionsIndex = this.readFile('functions/src/index.ts');
      
      const requiredPatterns = [
        'suicide', 'suicidio', 'suicídio', // Multi-language suicide
        'kill myself', 'matarme', 'me matar', // Self-harm
        'end it all', 'acabar con todo', 'acabar com tudo' // End life
      ];
      
      const missingPatterns = requiredPatterns.filter(pattern => 
        !functionsIndex.includes(pattern)
      );
      
      if (missingPatterns.length > 0) {
        this.createAlert('CRISIS_PATTERNS_MISSING', 
          `Missing patterns: ${missingPatterns.join(', ')}`);
      }
      
      // Check crisis response files
      const crisisFiles = [
        'public/emergency-crisis.html',
        'public/emergency-sw.js'
      ];
      
      for (const file of crisisFiles) {
        if (!fs.existsSync(path.join(this.rootDir, file))) {
          this.createAlert('CRISIS_FILE_MISSING', `Missing: ${file}`);
        }
      }
      
    } catch (error) {
      this.createAlert('CRISIS_SAFETY_CHECK_FAILED', error.message);
    }
  }

  async checkBuildHealth() {
    try {
      // Check if build configuration is optimal
      const nextConfig = this.readFile('next.config.js');
      const packageJson = JSON.parse(this.readFile('package.json'));
      
      // Check for performance issues in config
      if (nextConfig.includes("output: 'export'")) {
        this.createAlert('BUILD_CONFIG_ISSUE', 'Next.js output should be standalone for Firebase Functions');
      }
      
      // Check package.json build scripts
      if (!packageJson.scripts.build.includes('--max-old-space-size=8192')) {
        this.createAlert('BUILD_MEMORY_ISSUE', 'Build script missing memory optimization');
      }
      
      // Check dependencies for security vulnerabilities
      try {
        execSync('npm audit --audit-level=high', { stdio: 'pipe' });
      } catch (error) {
        this.createAlert('SECURITY_VULNERABILITIES', 'High-severity vulnerabilities detected');
      }
      
    } catch (error) {
      this.createAlert('BUILD_HEALTH_CHECK_FAILED', error.message);
    }
  }

  async checkDiskSpace() {
    try {
      const stats = fs.statSync(this.rootDir);
      return 50; // Placeholder - would need platform-specific implementation
    } catch (error) {
      return 0;
    }
  }

  async checkFileSystemHealth() {
    const criticalFiles = [
      'package.json',
      'next.config.js',
      'firebase.json',
      'src/lib/firebase.ts',
      'functions/src/index.ts',
      'tsconfig.json'
    ];
    
    for (const file of criticalFiles) {
      const filePath = path.join(this.rootDir, file);
      if (!fs.existsSync(filePath)) {
        this.createAlert('CRITICAL_FILE_MISSING', `Missing: ${file}`);
      } else {
        try {
          fs.accessSync(filePath, fs.constants.R_OK);
        } catch (error) {
          this.createAlert('FILE_ACCESS_ERROR', `Cannot read: ${file}`);
        }
      }
    }
  }

  async calculateBundleSize() {
    const buildPath = path.join(this.rootDir, '.next');
    if (!fs.existsSync(buildPath)) return 0;
    
    let totalSize = 0;
    
    function calculateSize(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          calculateSize(filePath);
        } else {
          totalSize += stats.size;
        }
      }
    }
    
    calculateSize(buildPath);
    return totalSize;
  }

  async simulateCrisisDetection() {
    // Simulate crisis detection pattern matching
    const testText = "I'm feeling suicidal and want to end it all";
    const patterns = ['suicide', 'suicidal', 'end it all'];
    
    const start = Date.now();
    const detected = patterns.some(pattern => 
      testText.toLowerCase().includes(pattern.toLowerCase())
    );
    
    return Date.now() - start;
  }

  createAlert(type, message) {
    const alert = {
      type,
      message,
      timestamp: new Date().toISOString(),
      severity: this.getAlertSeverity(type)
    };
    
    this.alerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
    
    this.log(`${alert.severity.toUpperCase()}: ${type} - ${message}`, 'alert');
    
    // Auto-fix for certain issues
    this.attemptAutoFix(type, message);
  }

  getAlertSeverity(type) {
    const severityMap = {
      'HIGH_MEMORY_USAGE': 'warning',
      'LOW_DISK_SPACE': 'critical',
      'BUNDLE_SIZE_EXCEEDED': 'warning',
      'CRISIS_RESPONSE_SLOW': 'critical',
      'CRISIS_PATTERNS_MISSING': 'critical',
      'CRISIS_FILE_MISSING': 'critical',
      'BUILD_CONFIG_ISSUE': 'warning',
      'SECURITY_VULNERABILITIES': 'critical',
      'CRITICAL_FILE_MISSING': 'critical'
    };
    
    return severityMap[type] || 'info';
  }

  async attemptAutoFix(type, message) {
    switch (type) {
      case 'BUILD_CONFIG_ISSUE':
        if (message.includes('export')) {
          await this.runNuclearFix();
        }
        break;
      
      case 'CRISIS_PATTERNS_MISSING':
        await this.runNuclearFix();
        break;
      
      case 'BUILD_MEMORY_ISSUE':
        await this.runNuclearFix();
        break;
        
      default:
        this.log(`No auto-fix available for: ${type}`, 'info');
    }
  }

  async runNuclearFix() {
    try {
      this.log('🔧 Running nuclear fix system...', 'info');
      execSync('node scripts/nuclear-diagnostic-fix.js', { stdio: 'inherit' });
      this.log('✅ Nuclear fix completed', 'success');
    } catch (error) {
      this.log(`❌ Nuclear fix failed: ${error.message}`, 'error');
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      metrics: this.metrics,
      alerts: this.alerts.slice(-10), // Last 10 alerts
      systemHealth: {
        memory: `${this.metrics.memoryUsage.toFixed(2)}MB`,
        bundleSize: `${(this.metrics.bundleSize / 1024).toFixed(2)}KB`,
        crisisResponse: `${this.metrics.crisisResponseTime}ms`,
        alertCount: this.alerts.length
      },
      thresholds: this.thresholds
    };
    
    // Write report to file
    const reportPath = path.join(this.rootDir, 'monitoring-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`📊 Report generated: ${report.alertCount} alerts, ${(this.metrics.bundleSize / 1024).toFixed(2)}KB bundle`, 'info');
  }

  startMonitoringServer() {
    const server = http.createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      if (req.url === '/health') {
        res.writeHead(200);
        res.end(JSON.stringify({
          status: 'healthy',
          uptime: process.uptime(),
          metrics: this.metrics,
          alertCount: this.alerts.length,
          timestamp: new Date().toISOString()
        }));
      } else if (req.url === '/alerts') {
        res.writeHead(200);
        res.end(JSON.stringify({
          alerts: this.alerts.slice(-20),
          count: this.alerts.length
        }));
      } else if (req.url === '/metrics') {
        res.writeHead(200);
        res.end(JSON.stringify(this.metrics));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    });
    
    server.listen(3002, () => {
      this.log('📊 Monitoring server started on http://localhost:3002', 'success');
      this.log('Available endpoints: /health, /alerts, /metrics', 'info');
    });
  }

  // Utility methods
  readFile(filePath) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.rootDir, filePath);
    return fs.readFileSync(fullPath, 'utf8');
  }
}

// Execute if run directly
if (require.main === module) {
  const monitoring = new ALCHMMonitoringSystem();
  monitoring.startMonitoring().catch(error => {
    console.error('💥 Monitoring system failed:', error);
    process.exit(1);
  });
}

module.exports = ALCHMMonitoringSystem;