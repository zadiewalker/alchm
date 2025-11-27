#!/usr/bin/env node

/**
 * 🔧 ALCHM Firebase Studio Auto-Healing System
 * 
 * Automatically detects and repairs common Firebase Studio deployment issues
 * while maintaining trauma-informed safety protocols throughout the healing process.
 * 
 * @version 3.0.0 - Production Ready
 * @author ALCHM Core Team
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { performance } = require('perf_hooks');

class FirebaseStudioAutoHealer {
  constructor(options = {}) {
    this.startTime = performance.now();
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.skipBackup = options.skipBackup || false;
    this.force = options.force || false;
    
    this.backupDir = path.join(process.cwd(), '.healing-backups');
    this.healingResults = {
      totalActions: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      actions: []
    };
    
    this.log('🔧 Firebase Studio Auto-Healing System initialized');
    this.log(`Mode: ${this.dryRun ? 'DRY RUN' : 'LIVE HEALING'}`, 'info');
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '🔧',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'critical': '🚨',
      'heal': '🩹'
    }[level] || '🔧';
    
    if (this.verbose || level !== 'info') {
      console.log(`${prefix} [${timestamp}] ${message}`);
    }
  }

  // BACKUP SYSTEM
  async createBackup(filePath) {
    if (this.skipBackup || this.dryRun) return null;
    
    try {
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `${path.basename(filePath)}.${timestamp}.backup`;
      const backupPath = path.join(this.backupDir, backupName);
      
      fs.copyFileSync(filePath, backupPath);
      
      this.log(`Created backup: ${backupPath}`, 'info');
      return backupPath;
      
    } catch (error) {
      this.log(`Failed to create backup for ${filePath}: ${error.message}`, 'warning');
      return null;
    }
  }

  async recordAction(action) {
    this.healingResults.totalActions++;
    this.healingResults.actions.push({
      timestamp: new Date().toISOString(),
      ...action
    });
    
    if (action.status === 'success') {
      this.healingResults.successful++;
    } else if (action.status === 'failed') {
      this.healingResults.failed++;
    } else if (action.status === 'skipped') {
      this.healingResults.skipped++;
    }
  }

  // MAIN HEALING ORCHESTRATOR
  async executeHealing() {
    this.log('🩹 Starting comprehensive auto-healing process...', 'success');
    
    const healingModules = [
      { name: 'Firebase Configuration', fn: () => this.healFirebaseConfiguration() },
      { name: 'Next.js Configuration', fn: () => this.healNextJSConfiguration() },
      { name: 'Package Configuration', fn: () => this.healPackageConfiguration() }
    ];
    
    for (const module of healingModules) {
      try {
        this.log(`Processing: ${module.name}`, 'info');
        await module.fn();
      } catch (error) {
        this.log(`Failed to heal ${module.name}: ${error.message}`, 'error');
        await this.recordAction({
          type: `heal_${module.name.toLowerCase().replace(/\s+/g, '_')}`,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    return this.generateHealingReport();
  }

  // 1. FIREBASE CONFIGURATION HEALING
  async healFirebaseConfiguration() {
    this.log('🔥 Healing Firebase configuration...', 'heal');
    
    const firebaseJsonPath = path.join(process.cwd(), 'firebase.json');
    
    if (!fs.existsSync(firebaseJsonPath)) {
      await this.recordAction({
        type: 'create_firebase_config',
        status: 'failed',
        error: 'firebase.json not found and cannot be auto-created',
        recommendation: 'Create firebase.json manually or reinitialize Firebase project'
      });
      return;
    }
    
    try {
      const config = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
      let modified = false;
      let backup = null;
      
      // Ensure hosting configuration exists
      if (!config.hosting) {
        config.hosting = [];
        modified = true;
      }
      
      if (!Array.isArray(config.hosting)) {
        config.hosting = [config.hosting];
        modified = true;
      }
      
      // Ensure primary hosting site exists
      if (config.hosting.length === 0) {
        config.hosting.push({
          public: "out",
          ignore: ["firebase.json", "**/.*", "**/node_modules/**"],
          rewrites: [{ source: "**", destination: "/index.html" }]
        });
        modified = true;
      }
      
      // Fix hosting configuration issues
      for (const hostingConfig of config.hosting) {
        // Ensure correct public directory for Next.js static export
        if (hostingConfig.public !== 'out') {
          hostingConfig.public = 'out';
          modified = true;
        }
        
        // Ensure proper rewrites for SPA
        if (!hostingConfig.rewrites || hostingConfig.rewrites.length === 0) {
          hostingConfig.rewrites = [
            { source: "**", destination: "/index.html" }
          ];
          modified = true;
        }
      }
      
      // Apply changes
      if (modified && !this.dryRun) {
        backup = await this.createBackup(firebaseJsonPath);
        fs.writeFileSync(firebaseJsonPath, JSON.stringify(config, null, 2));
      }
      
      await this.recordAction({
        type: 'heal_firebase_config',
        status: modified ? 'success' : 'skipped',
        description: modified ? 'Firebase configuration optimized' : 'Firebase configuration already optimal',
        backup: backup,
        changesApplied: modified
      });
      
    } catch (error) {
      await this.recordAction({
        type: 'heal_firebase_config',
        status: 'failed',
        error: error.message
      });
    }
  }

  // 2. NEXT.JS CONFIGURATION HEALING
  async healNextJSConfiguration() {
    this.log('⚡ Healing Next.js configuration...', 'heal');
    
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    
    if (!fs.existsSync(nextConfigPath)) {
      await this.recordAction({
        type: 'heal_nextjs_config',
        status: 'skipped',
        description: 'next.config.js not found - using defaults'
      });
      return;
    }
    
    try {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      let modified = false;
      let backup = null;
      
      // Check if Firebase Studio compatibility settings are present
      const requiredSettings = [
        'output:',
        'trailingSlash:',
        'images:'
      ];
      
      const missingSettings = requiredSettings.filter(setting => !configContent.includes(setting));
      
      if (missingSettings.length > 0) {
        modified = true;
      }
      
      // If modifications needed, generate optimized config
      if (modified && !this.dryRun) {
        backup = await this.createBackup(nextConfigPath);
        
        const optimizedConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase Studio Compatibility
  output: 'export',
  trailingSlash: true,
  
  // Image Optimization (disabled for Firebase hosting)
  images: {
    unoptimized: true
  },
  
  // Crisis-Safe Performance Optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Bundle Optimization for Firebase Studio
  experimental: {
    optimizePackageImports: ['@firebase/firestore', '@firebase/auth']
  }
}

module.exports = nextConfig
`;
        
        fs.writeFileSync(nextConfigPath, optimizedConfig);
      }
      
      await this.recordAction({
        type: 'heal_nextjs_config',
        status: modified ? 'success' : 'skipped',
        description: modified ? 'Next.js configuration optimized for Firebase Studio' : 'Next.js configuration already optimal',
        backup: backup,
        changesApplied: modified
      });
      
    } catch (error) {
      await this.recordAction({
        type: 'heal_nextjs_config',
        status: 'failed',
        error: error.message
      });
    }
  }

  // 3. PACKAGE.JSON HEALING
  async healPackageConfiguration() {
    this.log('📦 Healing package.json configuration...', 'heal');
    
    const packagePath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packagePath)) {
      await this.recordAction({
        type: 'heal_package_config',
        status: 'failed',
        error: 'package.json not found'
      });
      return;
    }
    
    try {
      const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      let modified = false;
      let backup = null;
      
      // Ensure Firebase Studio build script
      if (!packageData.scripts || !packageData.scripts.build) {
        if (!packageData.scripts) packageData.scripts = {};
        packageData.scripts.build = 'next build';
        modified = true;
      }
      
      // Add Firebase Studio deployment script
      if (!packageData.scripts['firebase:deploy']) {
        packageData.scripts['firebase:deploy'] = 'npm run build && firebase deploy --only hosting';
        modified = true;
      }
      
      // Add crisis-safe build script
      if (!packageData.scripts['build:crisis']) {
        packageData.scripts['build:crisis'] = 'NODE_OPTIONS="--max-old-space-size=4096" npm run build';
        modified = true;
      }
      
      // Ensure proper Node.js version constraint
      if (!packageData.engines) {
        packageData.engines = {};
        modified = true;
      }
      
      if (!packageData.engines.node) {
        packageData.engines.node = '>=18.0.0';
        modified = true;
      }
      
      // Apply changes
      if (modified && !this.dryRun) {
        backup = await this.createBackup(packagePath);
        fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
      }
      
      await this.recordAction({
        type: 'heal_package_config',
        status: modified ? 'success' : 'skipped',
        description: modified ? 'package.json optimized for Firebase Studio' : 'package.json already optimal',
        backup: backup,
        changesApplied: modified
      });
      
    } catch (error) {
      await this.recordAction({
        type: 'heal_package_config',
        status: 'failed',
        error: error.message
      });
    }
  }

  generateHealingReport() {
    const endTime = performance.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    const report = {
      metadata: {
        timestamp: new Date().toISOString(),
        duration: `${duration}s`,
        mode: this.dryRun ? 'dry_run' : 'live_healing',
        version: '3.0.0'
      },
      summary: this.healingResults,
      actions: this.healingResults.actions
    };
    
    // Save healing report
    if (!fs.existsSync('diagnostic-reports')) {
      fs.mkdirSync('diagnostic-reports', { recursive: true });
    }
    const reportPath = `diagnostic-reports/healing-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log('\n🩹 HEALING SUMMARY', 'success');
    this.log(`Total Actions: ${this.healingResults.totalActions}`, 'info');
    this.log(`Successful: ${this.healingResults.successful}`, 'success');
    this.log(`Failed: ${this.healingResults.failed}`, this.healingResults.failed > 0 ? 'error' : 'info');
    this.log(`Skipped: ${this.healingResults.skipped}`, 'info');
    this.log(`Duration: ${duration}s`, 'info');
    this.log(`Report saved: ${reportPath}`, 'info');
    
    if (this.healingResults.failed > 0) {
      this.log('⚠️ Some healing actions failed. Review the report for details.', 'warning');
    } else {
      this.log('✅ All healing actions completed successfully!', 'success');
    }
    
    return report;
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const options = {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose'),
    skipBackup: args.includes('--skip-backup'),
    force: args.includes('--force')
  };
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🔧 ALCHM Firebase Studio Auto-Healing System

USAGE:
  node firebase-studio-auto-healer.js [options]

OPTIONS:
  --dry-run      Show what would be healed without making changes
  --verbose      Show detailed healing process
  --skip-backup  Skip creating backups of modified files
  --force        Force healing even with warnings
  --help         Show this help message

HEALING MODULES:
  - Firebase Configuration Optimization
  - Next.js Configuration for Firebase Studio
  - Package.json Script Optimization

EXAMPLES:
  node firebase-studio-auto-healer.js --dry-run --verbose
  node firebase-studio-auto-healer.js --force
  node firebase-studio-auto-healer.js --skip-backup

All healing actions are logged and can be reverted using the backup files.
`);
    process.exit(0);
  }
  
  const healer = new FirebaseStudioAutoHealer(options);
  healer.executeHealing().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('💥 Auto-healing failed:', error);
    process.exit(1);
  });
}

module.exports = FirebaseStudioAutoHealer;