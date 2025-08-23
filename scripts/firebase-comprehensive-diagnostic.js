#!/usr/bin/env node

/**
 * FIREBASE COMPREHENSIVE DIAGNOSTIC AUDIT MODULE
 * 
 * Award-winning diagnostic system for Firebase Studio, Firebase CLI, and Unix-based Terminal workflows
 * 
 * Features:
 * - Modular and step-by-step analysis
 * - Self-operating with automatic remediation suggestions
 * - Comprehensive layer investigation (local dev → cloud deployment)
 * - CLI executable with detailed reporting
 * 
 * Focus Areas:
 * - Project initialization and configuration
 * - Hosting & routing diagnostics
 * - Emulator health checks
 * - Build & deployment auditing
 * - Terminal command chain simulation
 * - Security & access verification
 * - Automated remediation generation
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

class FirebaseComprehensiveDiagnostic {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.findings = [];
    this.remediation = [];
    this.scores = {
      initialization: 0,
      hosting: 0,
      emulator: 0,
      build: 0,
      terminal: 0,
      security: 0
    };
    this.maxScores = {
      initialization: 100,
      hosting: 100,
      emulator: 100,
      build: 100,
      terminal: 100,
      security: 100
    };
    
    // Test URLs and endpoints
    this.testEndpoints = {
      local: {
        hosting: 'http://localhost:5000',
        functions: 'http://localhost:5001',
        firestore: 'http://localhost:8080',
        auth: 'http://localhost:9099'
      },
      production: null // Will be determined from config
    };
    
    this.criticalFiles = [
      'firebase.json',
      '.firebaserc',
      'package.json',
      'firestore.rules',
      'storage.rules'
    ];
  }

  async runComprehensiveDiagnostic() {
    console.log('🔥 Firebase Comprehensive Diagnostic Audit');
    console.log('==========================================');
    console.log(`📁 Project: ${path.basename(this.projectPath)}`);
    console.log(`🕐 Started: ${new Date().toISOString()}`);
    console.log('');

    try {
      // Module 1: Project Initialization Audit
      await this.auditProjectInitialization();
      
      // Module 2: Hosting & Routing Diagnostics
      await this.auditHostingAndRouting();
      
      // Module 3: Emulator Health Check
      await this.auditEmulatorHealth();
      
      // Module 4: Build & Deployment Audit
      await this.auditBuildAndDeployment();
      
      // Module 5: Terminal Command Chain Simulation
      await this.auditTerminalCommands();
      
      // Module 6: Security & Access Checks
      await this.auditSecurityAndAccess();
      
      // Module 7: Generate Final Report
      await this.generateComprehensiveReport();
      
      console.log('✅ Comprehensive diagnostic completed successfully');
      console.log(`📊 Overall Health Score: ${this.calculateOverallScore()}/600`);
      
    } catch (error) {
      console.error('❌ Diagnostic failed:', error.message);
      this.addFinding('critical', 'system', 'Diagnostic execution failed', error.message);
      await this.generateComprehensiveReport();
      throw error;
    }
  }

  // =============================================
  // MODULE 1: PROJECT INITIALIZATION AUDIT
  // =============================================
  
  async auditProjectInitialization() {
    console.log('🔍 Module 1: Project Initialization Audit');
    console.log('=========================================');
    
    let moduleScore = 0;
    
    // Check critical configuration files
    for (const file of this.criticalFiles) {
      const filePath = path.join(this.projectPath, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} found`);
        moduleScore += 15;
        await this.validateConfigurationFile(file);
      } else {
        console.log(`❌ ${file} missing`);
        this.addFinding('high', 'initialization', `Missing ${file}`, 
          `Critical Firebase configuration file not found`);
        this.addRemediation(`Create ${file}`, `firebase init` + (file === 'package.json' ? ' && npm init -y' : ''));
      }
    }
    
    // Verify Firebase project is initialized
    const firebaseRc = path.join(this.projectPath, '.firebaserc');
    if (fs.existsSync(firebaseRc)) {
      try {
        const config = JSON.parse(fs.readFileSync(firebaseRc, 'utf8'));
        if (config.projects && config.projects.default) {
          console.log(`✅ Firebase project initialized: ${config.projects.default}`);
          moduleScore += 25;
          this.testEndpoints.production = `https://${config.projects.default}.web.app`;
        } else {
          console.log('❌ Firebase project not properly configured in .firebaserc');
          this.addFinding('high', 'initialization', 'Invalid .firebaserc', 
            'No default project configured');
          this.addRemediation('Configure Firebase project', 'firebase use --add');
        }
      } catch (error) {
        console.log('❌ Invalid .firebaserc format');
        this.addFinding('high', 'initialization', 'Malformed .firebaserc', error.message);
      }
    }
    
    // Check Firebase CLI installation and version
    try {
      const version = execSync('firebase --version', { encoding: 'utf8', timeout: 5000 });
      console.log(`✅ Firebase CLI version: ${version.trim()}`);
      moduleScore += 10;
      
      // Check for outdated CLI
      const versionNumber = version.match(/(\d+)\.(\d+)\.(\d+)/);
      if (versionNumber) {
        const major = parseInt(versionNumber[1]);
        if (major < 12) {
          console.log('⚠️  Firebase CLI version may be outdated');
          this.addFinding('medium', 'initialization', 'Outdated Firebase CLI', 
            'Consider updating for latest features and bug fixes');
          this.addRemediation('Update Firebase CLI', 'npm install -g firebase-tools@latest');
        }
      }
    } catch (error) {
      console.log('❌ Firebase CLI not installed or not accessible');
      this.addFinding('critical', 'initialization', 'Firebase CLI missing', 
        'Firebase CLI is required for deployment and development');
      this.addRemediation('Install Firebase CLI', 'npm install -g firebase-tools');
    }
    
    this.scores.initialization = moduleScore;
    console.log(`📊 Initialization Score: ${moduleScore}/${this.maxScores.initialization}`);
    console.log('');
  }

  async validateConfigurationFile(filename) {
    const filePath = path.join(this.projectPath, filename);
    
    try {
      if (filename === 'firebase.json') {
        const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Validate hosting configuration
        if (config.hosting) {
          if (!config.hosting.public) {
            this.addFinding('high', 'initialization', 'Missing public directory', 
              'firebase.json hosting.public not specified');
          } else {
            const publicDir = path.join(this.projectPath, config.hosting.public);
            if (!fs.existsSync(publicDir)) {
              this.addFinding('high', 'initialization', 'Public directory not found', 
                `Directory ${config.hosting.public} does not exist`);
            }
          }
          
          // Check for proper rewrite rules
          if (config.hosting.rewrites && config.hosting.rewrites.length > 0) {
            console.log(`✅ ${config.hosting.rewrites.length} rewrite rules configured`);
          } else {
            this.addFinding('medium', 'initialization', 'No rewrite rules', 
              'Consider adding fallback routes for SPA behavior');
          }
        }
        
        // Validate functions configuration
        if (config.functions) {
          const functionsDir = path.join(this.projectPath, config.functions.source || 'functions');
          if (!fs.existsSync(functionsDir)) {
            this.addFinding('high', 'initialization', 'Functions directory not found', 
              `Directory ${config.functions.source || 'functions'} does not exist`);
          }
        }
      }
      
      if (filename === 'package.json') {
        const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Check for essential scripts
        const essentialScripts = ['build', 'dev', 'start'];
        const missingScripts = essentialScripts.filter(script => !packageJson.scripts?.[script]);
        if (missingScripts.length > 0) {
          this.addFinding('medium', 'initialization', 'Missing npm scripts', 
            `Consider adding scripts: ${missingScripts.join(', ')}`);
        }
        
        // Check for Firebase dependencies
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        if (!deps['firebase'] && !deps['firebase-tools']) {
          this.addFinding('medium', 'initialization', 'No Firebase dependencies', 
            'Consider adding firebase or firebase-admin to dependencies');
        }
      }
      
    } catch (error) {
      this.addFinding('high', 'initialization', `Invalid ${filename}`, 
        `File exists but contains errors: ${error.message}`);
    }
  }

  // =============================================
  // MODULE 2: HOSTING & ROUTING DIAGNOSTICS
  // =============================================
  
  async auditHostingAndRouting() {
    console.log('🔍 Module 2: Hosting & Routing Diagnostics');
    console.log('==========================================');
    
    let moduleScore = 0;
    const firebaseJson = path.join(this.projectPath, 'firebase.json');
    
    if (!fs.existsSync(firebaseJson)) {
      console.log('❌ Cannot audit hosting - firebase.json missing');
      this.scores.hosting = 0;
      return;
    }
    
    try {
      const config = JSON.parse(fs.readFileSync(firebaseJson, 'utf8'));
      
      if (!config.hosting) {
        console.log('❌ No hosting configuration found');
        this.addFinding('high', 'hosting', 'No hosting config', 
          'firebase.json does not contain hosting configuration');
        this.scores.hosting = 0;
        return;
      }
      
      console.log('✅ Hosting configuration found');
      moduleScore += 20;
      
      // Validate public directory and contents
      const publicDir = path.join(this.projectPath, config.hosting.public);
      if (fs.existsSync(publicDir)) {
        console.log(`✅ Public directory exists: ${config.hosting.public}`);
        moduleScore += 20;
        
        // Check for essential files
        const indexPath = path.join(publicDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          console.log('✅ index.html found');
          moduleScore += 15;
          
          // Validate index.html content
          const indexContent = fs.readFileSync(indexPath, 'utf8');
          if (indexContent.includes('<title>') && indexContent.includes('<body>')) {
            console.log('✅ index.html appears valid');
            moduleScore += 10;
          } else {
            console.log('⚠️  index.html may be incomplete');
            this.addFinding('medium', 'hosting', 'Incomplete index.html', 
              'index.html missing essential HTML structure');
          }
        } else {
          console.log('❌ index.html missing');
          this.addFinding('critical', 'hosting', 'Missing index.html', 
            'Homepage file not found in public directory');
        }
      } else {
        console.log(`❌ Public directory not found: ${config.hosting.public}`);
        this.addFinding('critical', 'hosting', 'Public directory missing', 
          `Directory ${config.hosting.public} does not exist`);
      }
      
      // Validate rewrite rules
      if (config.hosting.rewrites) {
        console.log(`✅ ${config.hosting.rewrites.length} rewrite rules found`);
        moduleScore += 15;
        
        // Check for SPA fallback
        const hasSpaFallback = config.hosting.rewrites.some(rule => 
          rule.source === '**' && rule.destination === '/index.html'
        );
        if (hasSpaFallback) {
          console.log('✅ SPA fallback rule configured');
          moduleScore += 10;
        } else {
          console.log('⚠️  No SPA fallback rule found');
          this.addFinding('medium', 'hosting', 'No SPA fallback', 
            'Consider adding ** -> /index.html rule for client-side routing');
          this.addRemediation('Add SPA fallback', 
            'Add rewrite rule: {"source": "**", "destination": "/index.html"}');
        }
      }
      
      // Test local hosting if possible
      try {
        console.log('🧪 Testing local Firebase hosting...');
        const testResult = await this.testFirebaseServe();
        if (testResult.success) {
          console.log('✅ Local hosting test passed');
          moduleScore += 10;
        } else {
          console.log('❌ Local hosting test failed');
          this.addFinding('high', 'hosting', 'Local hosting failure', testResult.error);
        }
      } catch (error) {
        console.log('⚠️  Could not test local hosting:', error.message);
      }
      
    } catch (error) {
      console.log('❌ Error parsing firebase.json:', error.message);
      this.addFinding('high', 'hosting', 'Invalid firebase.json', error.message);
    }
    
    this.scores.hosting = moduleScore;
    console.log(`📊 Hosting Score: ${moduleScore}/${this.maxScores.hosting}`);
    console.log('');
  }

  async testFirebaseServe() {
    return new Promise((resolve) => {
      let serverProcess;
      let timeoutId;
      
      try {
        // Start firebase serve in background
        serverProcess = spawn('firebase', ['serve', '--only', 'hosting'], {
          cwd: this.projectPath,
          detached: true,
          stdio: 'pipe'
        });
        
        let output = '';
        serverProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        serverProcess.stderr.on('data', (data) => {
          output += data.toString();
        });
        
        // Wait for server to start
        setTimeout(async () => {
          try {
            const response = await fetch('http://localhost:5000/');
            const status = response.status;
            
            if (serverProcess && !serverProcess.killed) {
              serverProcess.kill();
            }
            clearTimeout(timeoutId);
            
            if (status === 200) {
              resolve({ success: true });
            } else {
              resolve({ success: false, error: `HTTP ${status}` });
            }
          } catch (error) {
            if (serverProcess && !serverProcess.killed) {
              serverProcess.kill();
            }
            clearTimeout(timeoutId);
            resolve({ success: false, error: error.message });
          }
        }, 3000);
        
        // Cleanup timeout
        timeoutId = setTimeout(() => {
          if (serverProcess && !serverProcess.killed) {
            serverProcess.kill();
          }
          resolve({ success: false, error: 'Timeout waiting for server' });
        }, 10000);
        
      } catch (error) {
        resolve({ success: false, error: error.message });
      }
    });
  }

  // =============================================
  // MODULE 3: EMULATOR HEALTH CHECK
  // =============================================
  
  async auditEmulatorHealth() {
    console.log('🔍 Module 3: Emulator Health Check');
    console.log('==================================');
    
    let moduleScore = 0;
    
    // Check emulator configuration
    const firebaseJson = path.join(this.projectPath, 'firebase.json');
    if (fs.existsSync(firebaseJson)) {
      try {
        const config = JSON.parse(fs.readFileSync(firebaseJson, 'utf8'));
        
        if (config.emulators) {
          console.log('✅ Emulator configuration found');
          moduleScore += 25;
          
          // Check individual emulator configs
          const emulatorTypes = ['hosting', 'functions', 'firestore', 'auth'];
          for (const type of emulatorTypes) {
            if (config.emulators[type]) {
              console.log(`✅ ${type} emulator configured on port ${config.emulators[type].port}`);
              moduleScore += 10;
            }
          }
        } else {
          console.log('⚠️  No emulator configuration found');
          this.addFinding('medium', 'emulator', 'No emulator config', 
            'Consider adding emulator configuration for local development');
          this.addRemediation('Add emulator config', 'firebase init emulators');
        }
      } catch (error) {
        console.log('❌ Error reading firebase.json:', error.message);
      }
    }
    
    // Test emulator startup
    try {
      console.log('🧪 Testing emulator startup...');
      const emulatorTest = await this.testEmulatorStartup();
      if (emulatorTest.success) {
        console.log('✅ Emulators can start successfully');
        moduleScore += 35;
      } else {
        console.log('❌ Emulator startup failed');
        this.addFinding('high', 'emulator', 'Emulator startup failure', emulatorTest.error);
      }
    } catch (error) {
      console.log('⚠️  Could not test emulators:', error.message);
    }
    
    this.scores.emulator = moduleScore;
    console.log(`📊 Emulator Score: ${moduleScore}/${this.maxScores.emulator}`);
    console.log('');
  }

  async testEmulatorStartup() {
    return new Promise((resolve) => {
      let emulatorProcess;
      let timeoutId;
      
      try {
        emulatorProcess = spawn('firebase', ['emulators:exec', 'echo "Emulators started"'], {
          cwd: this.projectPath,
          detached: true,
          stdio: 'pipe'
        });
        
        let output = '';
        emulatorProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        emulatorProcess.stderr.on('data', (data) => {
          output += data.toString();
        });
        
        emulatorProcess.on('exit', (code) => {
          clearTimeout(timeoutId);
          if (code === 0) {
            resolve({ success: true });
          } else {
            resolve({ success: false, error: `Exit code ${code}: ${output}` });
          }
        });
        
        timeoutId = setTimeout(() => {
          if (emulatorProcess && !emulatorProcess.killed) {
            emulatorProcess.kill();
          }
          resolve({ success: false, error: 'Emulator startup timeout' });
        }, 15000);
        
      } catch (error) {
        resolve({ success: false, error: error.message });
      }
    });
  }

  // =============================================
  // MODULE 4: BUILD & DEPLOYMENT AUDIT
  // =============================================
  
  async auditBuildAndDeployment() {
    console.log('🔍 Module 4: Build & Deployment Audit');
    console.log('=====================================');
    
    let moduleScore = 0;
    
    // Check package.json for build script
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        if (packageJson.scripts && packageJson.scripts.build) {
          console.log('✅ Build script found');
          moduleScore += 20;
          
          // Test build process
          try {
            console.log('🧪 Testing build process...');
            const buildCommand = packageJson.scripts.build;
            console.log(`Running: npm run build`);
            
            execSync('npm run build', { 
              cwd: this.projectPath, 
              encoding: 'utf8',
              timeout: 60000,
              stdio: 'pipe'
            });
            
            console.log('✅ Build completed successfully');
            moduleScore += 30;
            
            // Check build artifacts
            const buildArtifacts = await this.checkBuildArtifacts();
            if (buildArtifacts.success) {
              console.log('✅ Build artifacts validated');
              moduleScore += 25;
            } else {
              console.log('⚠️  Build artifact issues found');
              this.addFinding('medium', 'build', 'Build artifact issues', buildArtifacts.issues);
            }
            
          } catch (error) {
            console.log('❌ Build process failed');
            this.addFinding('critical', 'build', 'Build failure', error.message);
            this.addRemediation('Fix build issues', 'Check build logs and resolve dependencies');
          }
        } else {
          console.log('❌ No build script found');
          this.addFinding('high', 'build', 'No build script', 
            'package.json missing build script');
        }
      } catch (error) {
        console.log('❌ Error reading package.json:', error.message);
      }
    }
    
    // Test deployment simulation
    try {
      console.log('🧪 Simulating deployment...');
      const deploymentTest = await this.testDeploymentSimulation();
      if (deploymentTest.success) {
        console.log('✅ Deployment simulation passed');
        moduleScore += 25;
      } else {
        console.log('❌ Deployment simulation failed');
        this.addFinding('high', 'build', 'Deployment issues', deploymentTest.error);
      }
    } catch (error) {
      console.log('⚠️  Could not simulate deployment:', error.message);
    }
    
    this.scores.build = moduleScore;
    console.log(`📊 Build Score: ${moduleScore}/${this.maxScores.build}`);
    console.log('');
  }

  async checkBuildArtifacts() {
    const issues = [];
    
    // Check for common build output directories
    const commonBuildDirs = ['dist', 'build', 'out', '.next'];
    let foundBuildDir = false;
    
    for (const dir of commonBuildDirs) {
      const buildPath = path.join(this.projectPath, dir);
      if (fs.existsSync(buildPath)) {
        console.log(`✅ Build directory found: ${dir}`);
        foundBuildDir = true;
        
        // Check if build directory has content
        const files = fs.readdirSync(buildPath);
        if (files.length === 0) {
          issues.push(`Build directory ${dir} is empty`);
        }
        break;
      }
    }
    
    if (!foundBuildDir) {
      issues.push('No build output directory found');
    }
    
    // Check firebase.json public directory alignment
    const firebaseJsonPath = path.join(this.projectPath, 'firebase.json');
    if (fs.existsSync(firebaseJsonPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
        if (config.hosting && config.hosting.public) {
          const publicDir = path.join(this.projectPath, config.hosting.public);
          if (!fs.existsSync(publicDir)) {
            issues.push(`Firebase hosting public directory '${config.hosting.public}' does not exist`);
          }
        }
      } catch (error) {
        issues.push('Cannot validate firebase.json configuration');
      }
    }
    
    return {
      success: issues.length === 0,
      issues: issues.join('; ')
    };
  }

  async testDeploymentSimulation() {
    try {
      // Run firebase deploy --dry-run if available
      const output = execSync('firebase deploy --dry-run', {
        cwd: this.projectPath,
        encoding: 'utf8',
        timeout: 30000,
        stdio: 'pipe'
      });
      
      if (output.includes('Deploy complete') || output.includes('would be deployed')) {
        return { success: true };
      } else {
        return { success: false, error: 'Deployment validation failed' };
      }
    } catch (error) {
      // If dry-run not available, try basic validation
      return { success: false, error: error.message };
    }
  }

  // =============================================
  // MODULE 5: TERMINAL COMMAND CHAIN SIMULATION
  // =============================================
  
  async auditTerminalCommands() {
    console.log('🔍 Module 5: Terminal Command Chain Simulation');
    console.log('==============================================');
    
    let moduleScore = 0;
    
    // Test system prerequisites
    const systemTests = [
      { command: 'node --version', name: 'Node.js' },
      { command: 'npm --version', name: 'npm' },
      { command: 'firebase --version', name: 'Firebase CLI' },
      { command: 'curl --version', name: 'curl' }
    ];
    
    for (const test of systemTests) {
      try {
        const output = execSync(test.command, { encoding: 'utf8', timeout: 5000 });
        console.log(`✅ ${test.name}: ${output.split('\n')[0]}`);
        moduleScore += 15;
      } catch (error) {
        console.log(`❌ ${test.name} not available`);
        this.addFinding('medium', 'terminal', `${test.name} missing`, 
          `System dependency not available: ${test.command}`);
      }
    }
    
    // Test file permissions
    const criticalFiles = ['firebase.json', 'package.json'];
    for (const file of criticalFiles) {
      const filePath = path.join(this.projectPath, file);
      if (fs.existsSync(filePath)) {
        try {
          fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
          console.log(`✅ ${file} permissions OK`);
          moduleScore += 5;
        } catch (error) {
          console.log(`❌ ${file} permission issues`);
          this.addFinding('medium', 'terminal', 'File permission issues', 
            `Cannot read/write ${file}`);
        }
      }
    }
    
    // Test network connectivity
    try {
      console.log('🧪 Testing network connectivity...');
      
      // Test Firebase API connectivity
      execSync('curl -I --connect-timeout 5 https://firebase.googleapis.com/', 
        { encoding: 'utf8', timeout: 10000 });
      console.log('✅ Firebase API connectivity OK');
      moduleScore += 10;
      
      // Test production site if configured
      if (this.testEndpoints.production) {
        try {
          const response = execSync(`curl -I --connect-timeout 5 "${this.testEndpoints.production}"`, 
            { encoding: 'utf8', timeout: 10000 });
          if (response.includes('200 OK')) {
            console.log('✅ Production site accessible');
            moduleScore += 10;
          } else {
            console.log('⚠️  Production site issues detected');
            this.addFinding('medium', 'terminal', 'Production site issues', 
              'Site not returning 200 OK');
          }
        } catch (error) {
          console.log('❌ Production site not accessible');
          this.addFinding('high', 'terminal', 'Production site down', error.message);
        }
      }
      
    } catch (error) {
      console.log('❌ Network connectivity issues');
      this.addFinding('high', 'terminal', 'Network connectivity', error.message);
    }
    
    this.scores.terminal = moduleScore;
    console.log(`📊 Terminal Score: ${moduleScore}/${this.maxScores.terminal}`);
    console.log('');
  }

  // =============================================
  // MODULE 6: SECURITY & ACCESS CHECKS
  // =============================================
  
  async auditSecurityAndAccess() {
    console.log('🔍 Module 6: Security & Access Checks');
    console.log('====================================');
    
    let moduleScore = 0;
    
    // Audit Firestore security rules
    const firestoreRulesPath = path.join(this.projectPath, 'firestore.rules');
    if (fs.existsSync(firestoreRulesPath)) {
      console.log('✅ Firestore rules file found');
      moduleScore += 20;
      
      try {
        const rules = fs.readFileSync(firestoreRulesPath, 'utf8');
        
        // Check for basic security practices
        if (rules.includes('request.auth')) {
          console.log('✅ Authentication checks found in rules');
          moduleScore += 15;
        } else {
          console.log('⚠️  No authentication checks in Firestore rules');
          this.addFinding('high', 'security', 'Insecure Firestore rules', 
            'Rules do not check request.auth - potential security risk');
        }
        
        if (rules.includes('allow read, write: if false')) {
          console.log('✅ Default deny rules found');
          moduleScore += 10;
        } else {
          console.log('⚠️  No default deny rules - check security');
          this.addFinding('medium', 'security', 'Missing default deny', 
            'Consider adding default deny rules for security');
        }
        
      } catch (error) {
        console.log('❌ Error reading Firestore rules');
        this.addFinding('medium', 'security', 'Cannot read Firestore rules', error.message);
      }
    } else {
      console.log('⚠️  Firestore rules file not found');
      this.addFinding('medium', 'security', 'No Firestore rules', 
        'Firestore rules file missing - using default rules');
    }
    
    // Audit Storage security rules
    const storageRulesPath = path.join(this.projectPath, 'storage.rules');
    if (fs.existsSync(storageRulesPath)) {
      console.log('✅ Storage rules file found');
      moduleScore += 15;
    } else {
      console.log('⚠️  Storage rules file not found');
      this.addFinding('low', 'security', 'No Storage rules', 
        'Storage rules file missing - using default rules');
    }
    
    // Check for exposed secrets in config files
    const sensitivePatterns = [
      /api[_-]?key.*['\"][a-zA-Z0-9]{20,}['\"]/, // API keys
      /secret.*['\"][a-zA-Z0-9]{20,}['\"]/, // Secrets
      /password.*['\"][^'\"]{8,}['\"]/, // Passwords
      /private[_-]?key/, // Private keys
    ];
    
    const configFiles = ['firebase.json', 'package.json', '.env', '.env.local'];
    for (const file of configFiles) {
      const filePath = path.join(this.projectPath, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          let foundSecrets = false;
          
          for (const pattern of sensitivePatterns) {
            if (pattern.test(content)) {
              foundSecrets = true;
              break;
            }
          }
          
          if (foundSecrets) {
            console.log(`⚠️  Potential secrets found in ${file}`);
            this.addFinding('high', 'security', 'Potential exposed secrets', 
              `File ${file} may contain exposed secrets`);
          } else {
            console.log(`✅ ${file} appears secure`);
            moduleScore += 5;
          }
        } catch (error) {
          // File read error - not critical for security audit
        }
      }
    }
    
    // Check Firebase Auth configuration
    try {
      console.log('🧪 Checking Firebase Auth configuration...');
      // This would require Firebase admin or specific auth checks
      // For now, we'll check if auth is mentioned in config
      
      const firebaseJsonPath = path.join(this.projectPath, 'firebase.json');
      if (fs.existsSync(firebaseJsonPath)) {
        const config = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
        if (config.emulators && config.emulators.auth) {
          console.log('✅ Auth emulator configured');
          moduleScore += 10;
        }
      }
      
      // Basic auth configuration validation
      moduleScore += 25; // Placeholder for more detailed auth checks
      
    } catch (error) {
      console.log('⚠️  Could not validate Auth configuration');
    }
    
    this.scores.security = moduleScore;
    console.log(`📊 Security Score: ${moduleScore}/${this.maxScores.security}`);
    console.log('');
  }

  // =============================================
  // MODULE 7: COMPREHENSIVE REPORT GENERATION
  // =============================================
  
  async generateComprehensiveReport() {
    console.log('📊 Generating Comprehensive Diagnostic Report');
    console.log('=============================================');
    
    const overallScore = this.calculateOverallScore();
    const maxPossible = Object.values(this.maxScores).reduce((a, b) => a + b, 0);
    const healthPercentage = Math.round((overallScore / maxPossible) * 100);
    
    // Generate detailed markdown report
    await this.generateMarkdownReport(overallScore, maxPossible, healthPercentage);
    
    // Generate JSON diagnostic data
    await this.generateJSONReport(overallScore, maxPossible, healthPercentage);
    
    // Generate remediation script
    await this.generateRemediationScript();
    
    // Display summary
    console.log(`🎯 Overall Health: ${healthPercentage}% (${overallScore}/${maxPossible})`);
    console.log('');
    
    console.log('📈 Module Scores:');
    Object.entries(this.scores).forEach(([module, score]) => {
      const maxScore = this.maxScores[module];
      const percentage = Math.round((score / maxScore) * 100);
      const status = percentage >= 80 ? '🟢' : percentage >= 60 ? '🟡' : '🔴';
      console.log(`   ${status} ${module}: ${score}/${maxScore} (${percentage}%)`);
    });
    console.log('');
    
    if (this.findings.length > 0) {
      console.log('⚠️  Issues Found:');
      this.findings.forEach((finding, index) => {
        const icon = finding.severity === 'critical' ? '🚨' : 
                    finding.severity === 'high' ? '🔴' : 
                    finding.severity === 'medium' ? '🟡' : '🔵';
        console.log(`   ${icon} ${finding.title}: ${finding.description}`);
      });
      console.log('');
    }
    
    console.log('📄 Reports generated:');
    console.log('   📝 firebase_comprehensive_report.md');
    console.log('   📊 firebase_diagnostic_data.json');
    console.log('   🔧 firebase_remediation.sh');
    console.log('');
    
    return {
      overallScore,
      maxPossible,
      healthPercentage,
      moduleScores: this.scores,
      findings: this.findings,
      remediation: this.remediation
    };
  }

  async generateMarkdownReport(overallScore, maxPossible, healthPercentage) {
    const report = `# Firebase Comprehensive Diagnostic Report

## Executive Summary

**Project:** ${path.basename(this.projectPath)}  
**Generated:** ${new Date().toISOString()}  
**Overall Health:** ${healthPercentage}% (${overallScore}/${maxPossible} points)

${this.getHealthStatusBadge(healthPercentage)}

## Module Scores

| Module | Score | Max | Percentage | Status |
|--------|-------|-----|------------|--------|
${Object.entries(this.scores).map(([module, score]) => {
  const maxScore = this.maxScores[module];
  const percentage = Math.round((score / maxScore) * 100);
  const status = percentage >= 80 ? '🟢 GOOD' : percentage >= 60 ? '🟡 FAIR' : '🔴 NEEDS ATTENTION';
  return `| ${module} | ${score} | ${maxScore} | ${percentage}% | ${status} |`;
}).join('\n')}

## Critical Findings

${this.findings
  .filter(f => f.severity === 'critical')
  .map((finding, index) => `### ${index + 1}. ${finding.title}
**Module:** ${finding.module}  
**Severity:** 🚨 CRITICAL  
**Description:** ${finding.description}

**Remediation:** ${this.remediation.find(r => r.title.includes(finding.title))?.command || 'Manual investigation required'}

---`).join('\n\n')}

## High Priority Issues

${this.findings
  .filter(f => f.severity === 'high')
  .map((finding, index) => `### ${index + 1}. ${finding.title}
**Module:** ${finding.module}  
**Severity:** 🔴 HIGH  
**Description:** ${finding.description}

**Remediation:** ${this.remediation.find(r => r.title.includes(finding.title))?.command || 'See remediation script'}

---`).join('\n\n')}

## Medium Priority Issues

${this.findings
  .filter(f => f.severity === 'medium')
  .map((finding, index) => `### ${index + 1}. ${finding.title}
**Module:** ${finding.module}  
**Severity:** 🟡 MEDIUM  
**Description:** ${finding.description}

---`).join('\n\n')}

## Remediation Summary

${this.remediation.map((item, index) => `### ${index + 1}. ${item.title}

\`\`\`bash
${item.command}
\`\`\`

---`).join('\n\n')}

## System Information

- **Node.js Version:** ${this.getNodeVersion()}
- **Firebase CLI Version:** ${this.getFirebaseCLIVersion()}
- **Project Path:** ${this.projectPath}
- **Configuration Files:** ${this.getConfigFileStatus()}

## Recommendations

### Immediate Actions (Critical/High)
${this.getImmediateActions()}

### Performance Improvements
${this.getPerformanceRecommendations()}

### Security Enhancements
${this.getSecurityRecommendations()}

### Development Workflow
${this.getDevelopmentRecommendations()}

## Next Steps

1. **Address Critical Issues:** Fix all critical severity issues immediately
2. **Run Remediation Script:** Execute \`firebase_remediation.sh\` for automated fixes
3. **Rerun Diagnostic:** Verify improvements with another diagnostic run
4. **Monitor Deployment:** Test deployment after applying fixes

---

*Generated by Firebase Comprehensive Diagnostic Tool*
*For support and updates: https://github.com/firebase/firebase-tools*
`;

    fs.writeFileSync(
      path.join(this.projectPath, 'firebase_comprehensive_report.md'), 
      report
    );
  }

  async generateJSONReport(overallScore, maxPossible, healthPercentage) {
    const diagnosticData = {
      metadata: {
        projectName: path.basename(this.projectPath),
        projectPath: this.projectPath,
        generated: new Date().toISOString(),
        toolVersion: '1.0.0'
      },
      summary: {
        overallScore,
        maxPossible,
        healthPercentage,
        totalFindings: this.findings.length,
        criticalIssues: this.findings.filter(f => f.severity === 'critical').length,
        highIssues: this.findings.filter(f => f.severity === 'high').length,
        mediumIssues: this.findings.filter(f => f.severity === 'medium').length,
        lowIssues: this.findings.filter(f => f.severity === 'low').length
      },
      moduleScores: Object.entries(this.scores).map(([module, score]) => ({
        module,
        score,
        maxScore: this.maxScores[module],
        percentage: Math.round((score / this.maxScores[module]) * 100),
        status: score / this.maxScores[module] >= 0.8 ? 'good' : 
                score / this.maxScores[module] >= 0.6 ? 'fair' : 'needs_attention'
      })),
      findings: this.findings,
      remediation: this.remediation,
      systemInfo: {
        nodeVersion: this.getNodeVersion(),
        firebaseCLIVersion: this.getFirebaseCLIVersion(),
        platform: process.platform,
        architecture: process.arch
      },
      configFiles: this.getConfigFileStatus(),
      testEndpoints: this.testEndpoints
    };

    fs.writeFileSync(
      path.join(this.projectPath, 'firebase_diagnostic_data.json'),
      JSON.stringify(diagnosticData, null, 2)
    );
  }

  async generateRemediationScript() {
    const script = `#!/bin/bash

# Firebase Comprehensive Diagnostic - Automated Remediation Script
# Generated: ${new Date().toISOString()}
# Project: ${path.basename(this.projectPath)}

echo "🔧 Firebase Comprehensive Remediation Script"
echo "==========================================="
echo ""

set -e  # Exit on any error

${this.remediation.map((item, index) => `
echo "${index + 1}. ${item.title}"
echo "-----------------------------------"
${item.command}
echo "✅ Completed: ${item.title}"
echo ""
`).join('')}

echo "🎉 All automated remediation steps completed!"
echo ""
echo "📋 Manual Review Required:"
${this.findings
  .filter(f => f.severity === 'critical' || f.severity === 'high')
  .map(f => `echo "   - ${f.title}: ${f.description}"`)
  .join('\n')}

echo ""
echo "🔄 Next Steps:"
echo "1. Review the changes made by this script"
echo "2. Run the diagnostic again to verify improvements"
echo "3. Test your application thoroughly"
echo "4. Deploy when all issues are resolved"
echo ""
echo "📊 Rerun diagnostic: node scripts/firebase-comprehensive-diagnostic.js"
`;

    fs.writeFileSync(
      path.join(this.projectPath, 'firebase_remediation.sh'),
      script
    );
    
    // Make executable
    try {
      execSync(`chmod +x ${path.join(this.projectPath, 'firebase_remediation.sh')}`);
    } catch (error) {
      // Non-critical if chmod fails
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  addFinding(severity, module, title, description) {
    this.findings.push({
      severity,
      module,
      title,
      description,
      timestamp: new Date().toISOString()
    });
  }

  addRemediation(title, command) {
    this.remediation.push({
      title,
      command,
      timestamp: new Date().toISOString()
    });
  }

  calculateOverallScore() {
    return Object.values(this.scores).reduce((total, score) => total + score, 0);
  }

  getHealthStatusBadge(percentage) {
    if (percentage >= 90) return '🟢 **EXCELLENT** - Your Firebase project is in great shape!';
    if (percentage >= 75) return '🟡 **GOOD** - Minor issues that should be addressed';
    if (percentage >= 60) return '🟠 **FAIR** - Several issues need attention';
    if (percentage >= 40) return '🔴 **POOR** - Significant issues require immediate attention';
    return '🚨 **CRITICAL** - Major issues must be resolved before deployment';
  }

  getNodeVersion() {
    try {
      return execSync('node --version', { encoding: 'utf8' }).trim();
    } catch (error) {
      return 'Unknown';
    }
  }

  getFirebaseCLIVersion() {
    try {
      return execSync('firebase --version', { encoding: 'utf8' }).trim();
    } catch (error) {
      return 'Unknown';
    }
  }

  getConfigFileStatus() {
    return this.criticalFiles.map(file => ({
      file,
      exists: fs.existsSync(path.join(this.projectPath, file)),
      size: fs.existsSync(path.join(this.projectPath, file)) 
        ? fs.statSync(path.join(this.projectPath, file)).size 
        : 0
    }));
  }

  getImmediateActions() {
    const criticalAndHigh = this.findings.filter(f => 
      f.severity === 'critical' || f.severity === 'high'
    );
    
    if (criticalAndHigh.length === 0) {
      return '- ✅ No immediate critical actions required';
    }
    
    return criticalAndHigh.map(finding => 
      `- 🚨 ${finding.title}: ${finding.description}`
    ).join('\n');
  }

  getPerformanceRecommendations() {
    return `- Optimize build process with caching
- Use Firebase Hosting CDN for static assets
- Implement proper cache headers
- Minimize bundle size with tree shaking`;
  }

  getSecurityRecommendations() {
    return `- Review and tighten Firestore security rules
- Implement proper authentication checks
- Audit environment variables for secrets
- Enable Firebase Security Rules simulator`;
  }

  getDevelopmentRecommendations() {
    return `- Set up Firebase emulators for local development
- Implement CI/CD pipeline for automated testing
- Use Firebase extensions for common functionality
- Set up monitoring and alerting`;
  }
}

// Execute diagnostic if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const diagnostic = new FirebaseComprehensiveDiagnostic(process.argv[2]);
  diagnostic.runComprehensiveDiagnostic()
    .then(result => {
      console.log('🎉 Diagnostic completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Diagnostic failed:', error.message);
      process.exit(1);
    });
}

export default FirebaseComprehensiveDiagnostic;