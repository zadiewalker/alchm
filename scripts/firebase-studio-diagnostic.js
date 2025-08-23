#!/usr/bin/env node

/**
 * Firebase Studio Publication Diagnostic Audit System
 * Award-winning expert debugger for comprehensive Firebase Studio readiness
 * 
 * This diagnostic system performs meticulous testing to ensure ALCHM
 * meets all Firebase Studio publication requirements.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const yaml = require('js-yaml');

class FirebaseStudioDiagnostic {
  constructor() {
    this.projectRoot = process.cwd();
    this.diagnosticResults = {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      criticalIssues: [],
      warnings: [],
      recommendations: [],
      testResults: {},
      publicationReadiness: false
    };
    this.requiredFiles = [
      'package.json',
      'next.config.js',
      'apphosting.yaml',
      'firebase.json'
    ];
    this.logFile = path.join(this.projectRoot, 'firebase-studio-audit.log');
    this.reportFile = path.join(this.projectRoot, 'firebase-studio-report.md');
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} [${level}] ${message}\n`;
    console.log(`[${level}] ${message}`);
    fs.appendFileSync(this.logFile, logEntry);
  }

  async runDiagnostic() {
    this.log('🚀 Firebase Studio Publication Diagnostic Starting...', 'AUDIT');
    
    try {
      await this.validateEnvironment();
      await this.validateConfiguration();
      await this.validateBuildSystem();
      await this.validateAppHostingConfig();
      await this.validateDependencies();
      await this.runBuildTests();
      await this.validatePerformance();
      await this.validateSecurity();
      await this.calculateScore();
      await this.generateReport();
      
      this.log('✅ Firebase Studio Diagnostic Complete', 'SUCCESS');
      return this.diagnosticResults;
    } catch (error) {
      this.log(`❌ Diagnostic Failed: ${error.message}`, 'ERROR');
      this.diagnosticResults.criticalIssues.push({
        category: 'System Error',
        issue: error.message,
        severity: 'CRITICAL',
        fix: 'Review system setup and try again'
      });
      return this.diagnosticResults;
    }
  }

  async validateEnvironment() {
    this.log('🔍 Validating Firebase Studio Environment...', 'TEST');
    
    const envTests = {
      nodeVersion: this.checkNodeVersion(),
      firebaseCli: this.checkFirebaseCli(),
      projectStructure: this.checkProjectStructure(),
      gitStatus: this.checkGitStatus()
    };

    this.diagnosticResults.testResults.environment = envTests;

    // Check Node.js version compatibility
    if (!envTests.nodeVersion.compatible) {
      this.diagnosticResults.criticalIssues.push({
        category: 'Environment',
        issue: 'Node.js version incompatible with Firebase Studio',
        severity: 'CRITICAL',
        current: envTests.nodeVersion.current,
        required: '>=18 <=20',
        fix: 'Update Node.js to version 18 or 20'
      });
    }

    // Check Firebase CLI
    if (!envTests.firebaseCli.installed) {
      this.diagnosticResults.criticalIssues.push({
        category: 'Environment',
        issue: 'Firebase CLI not installed or outdated',
        severity: 'CRITICAL',
        fix: 'Install/update Firebase CLI: npm install -g firebase-tools'
      });
    }

    this.log(`✅ Environment validation complete`, 'TEST');
  }

  checkNodeVersion() {
    try {
      const version = process.version;
      const majorVersion = parseInt(version.slice(1).split('.')[0]);
      const compatible = majorVersion >= 18 && majorVersion <= 20;
      
      return {
        current: version,
        majorVersion,
        compatible,
        recommended: majorVersion === 20
      };
    } catch (error) {
      return { current: 'unknown', compatible: false, error: error.message };
    }
  }

  checkFirebaseCli() {
    try {
      const version = execSync('firebase --version', { encoding: 'utf8' }).trim();
      const versionNumber = version.match(/(\d+\.\d+\.\d+)/)?.[1];
      
      return {
        installed: true,
        version: versionNumber,
        fullOutput: version
      };
    } catch (error) {
      return { installed: false, error: error.message };
    }
  }

  checkProjectStructure() {
    const structure = {
      requiredFiles: {},
      srcDirectory: fs.existsSync(path.join(this.projectRoot, 'src')),
      publicDirectory: fs.existsSync(path.join(this.projectRoot, 'public')),
      functionsDirectory: fs.existsSync(path.join(this.projectRoot, 'functions'))
    };

    for (const file of this.requiredFiles) {
      const filePath = path.join(this.projectRoot, file);
      structure.requiredFiles[file] = {
        exists: fs.existsSync(filePath),
        path: filePath
      };
    }

    return structure;
  }

  checkGitStatus() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      
      return {
        clean: status.trim() === '',
        branch,
        uncommittedChanges: status.split('\n').filter(line => line.trim()).length,
        status: status.trim()
      };
    } catch (error) {
      return { error: 'Not a git repository or git not available' };
    }
  }

  async validateConfiguration() {
    this.log('🔧 Validating Firebase Studio Configuration...', 'TEST');
    
    const configTests = {
      packageJson: this.validatePackageJson(),
      nextConfig: this.validateNextConfig(),
      firebaseConfig: this.validateFirebaseConfig(),
      appHostingYaml: this.validateAppHostingYaml()
    };

    this.diagnosticResults.testResults.configuration = configTests;
    this.log(`✅ Configuration validation complete`, 'TEST');
  }

  validatePackageJson() {
    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      const validation = {
        exists: true,
        hasNextjs: packageJson.dependencies?.next !== undefined,
        nextVersion: packageJson.dependencies?.next,
        hasTypeModule: packageJson.type === 'module',
        nodeVersion: packageJson.engines?.node,
        scripts: {
          build: packageJson.scripts?.build !== undefined,
          dev: packageJson.scripts?.dev !== undefined,
          start: packageJson.scripts?.start !== undefined
        }
      };

      // Critical issue: type: "module" conflicts with Firebase Studio
      if (validation.hasTypeModule) {
        this.diagnosticResults.criticalIssues.push({
          category: 'Configuration',
          issue: 'package.json contains "type": "module" which conflicts with Firebase Studio',
          severity: 'CRITICAL',
          file: 'package.json',
          fix: 'Remove "type": "module" from package.json'
        });
      }

      // Warning: Missing or incorrect Node.js version
      if (!validation.nodeVersion || !validation.nodeVersion.includes('20')) {
        this.diagnosticResults.warnings.push({
          category: 'Configuration',
          issue: 'Node.js version not specified or not optimal for Firebase Studio',
          severity: 'WARNING',
          file: 'package.json',
          fix: 'Add "engines": {"node": ">=18 <=20"} to package.json'
        });
      }

      return validation;
    } catch (error) {
      this.diagnosticResults.criticalIssues.push({
        category: 'Configuration',
        issue: 'package.json is missing or invalid',
        severity: 'CRITICAL',
        error: error.message,
        fix: 'Ensure package.json exists and is valid JSON'
      });
      return { exists: false, error: error.message };
    }
  }

  validateNextConfig() {
    try {
      const configPath = path.join(this.projectRoot, 'next.config.js');
      
      // Check for conflicting .mjs files
      const mjsFiles = [
        'next.config.mjs',
        'next.config.performance.mjs'
      ].filter(file => fs.existsSync(path.join(this.projectRoot, file)));

      if (mjsFiles.length > 0) {
        this.diagnosticResults.criticalIssues.push({
          category: 'Configuration',
          issue: 'Conflicting .mjs config files found',
          severity: 'CRITICAL',
          files: mjsFiles,
          fix: `Remove conflicting files: ${mjsFiles.join(', ')}`
        });
      }

      if (!fs.existsSync(configPath)) {
        this.diagnosticResults.criticalIssues.push({
          category: 'Configuration',
          issue: 'next.config.js is missing',
          severity: 'CRITICAL',
          fix: 'Create next.config.js with proper Firebase Studio configuration'
        });
        return { exists: false };
      }

      const configContent = fs.readFileSync(configPath, 'utf8');
      
      const validation = {
        exists: true,
        hasStandalone: configContent.includes("output: 'standalone'"),
        hasModuleExports: configContent.includes('module.exports'),
        hasExportDefault: configContent.includes('export default'),
        conflictingFiles: mjsFiles,
        size: fs.statSync(configPath).size
      };

      // Critical: Must use module.exports, not export default
      if (validation.hasExportDefault) {
        this.diagnosticResults.criticalIssues.push({
          category: 'Configuration',
          issue: 'next.config.js uses ES module syntax (export default)',
          severity: 'CRITICAL',
          file: 'next.config.js',
          fix: 'Change "export default" to "module.exports =" for CommonJS compatibility'
        });
      }

      // Critical: Must have standalone output for Firebase Studio
      if (!validation.hasStandalone) {
        this.diagnosticResults.criticalIssues.push({
          category: 'Configuration',
          issue: 'next.config.js missing standalone output configuration',
          severity: 'CRITICAL',
          file: 'next.config.js',
          fix: 'Add "output: \'standalone\'" to next.config.js'
        });
      }

      return validation;
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  validateFirebaseConfig() {
    try {
      const configPath = path.join(this.projectRoot, 'firebase.json');
      const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      const validation = {
        exists: true,
        hasHosting: firebaseConfig.hosting !== undefined,
        hasFunctions: firebaseConfig.functions !== undefined,
        hasFirestore: firebaseConfig.firestore !== undefined,
        hostingConfig: firebaseConfig.hosting,
        functionsConfig: firebaseConfig.functions
      };

      return validation;
    } catch (error) {
      this.diagnosticResults.warnings.push({
        category: 'Configuration',
        issue: 'firebase.json is missing or invalid',
        severity: 'WARNING',
        file: 'firebase.json',
        fix: 'Create firebase.json with proper configuration'
      });
      return { exists: false, error: error.message };
    }
  }

  validateAppHostingYaml() {
    try {
      const yamlPath = path.join(this.projectRoot, 'apphosting.yaml');
      const yamlContent = fs.readFileSync(yamlPath, 'utf8');
      const appHostingConfig = yaml.load(yamlContent);
      
      const validation = {
        exists: true,
        hasRunConfig: appHostingConfig.runConfig !== undefined,
        hasNodeRuntime: appHostingConfig.runConfig?.runtime === 'nodejs20',
        hasBuildCommands: appHostingConfig.build?.commands !== undefined,
        hasServeConfig: appHostingConfig.serve !== undefined,
        hasEntryPoint: appHostingConfig.serve?.appConfig?.entryPoint !== undefined,
        entryPoint: appHostingConfig.serve?.appConfig?.entryPoint,
        runtime: appHostingConfig.runConfig?.runtime
      };

      // Critical: Must have correct runtime
      if (!validation.hasNodeRuntime) {
        this.diagnosticResults.criticalIssues.push({
          category: 'App Hosting',
          issue: 'apphosting.yaml must specify nodejs20 runtime',
          severity: 'CRITICAL',
          file: 'apphosting.yaml',
          current: validation.runtime,
          fix: 'Set runConfig.runtime to "nodejs20"'
        });
      }

      // Critical: Must have correct entry point
      if (!validation.entryPoint || !validation.entryPoint.includes('standalone/server.js')) {
        this.diagnosticResults.criticalIssues.push({
          category: 'App Hosting',
          issue: 'apphosting.yaml has incorrect entry point',
          severity: 'CRITICAL',
          file: 'apphosting.yaml',
          current: validation.entryPoint,
          fix: 'Set serve.appConfig.entryPoint to ".next/standalone/server.js"'
        });
      }

      return validation;
    } catch (error) {
      this.diagnosticResults.criticalIssues.push({
        category: 'App Hosting',
        issue: 'apphosting.yaml is missing or invalid',
        severity: 'CRITICAL',
        file: 'apphosting.yaml',
        error: error.message,
        fix: 'Create proper apphosting.yaml configuration'
      });
      return { exists: false, error: error.message };
    }
  }

  async validateBuildSystem() {
    this.log('🏗️ Validating Build System...', 'TEST');
    
    const buildTests = {
      dependencyInstall: await this.testDependencyInstall(),
      buildProcess: await this.testBuildProcess(),
      standaloneOutput: this.testStandaloneOutput()
    };

    this.diagnosticResults.testResults.buildSystem = buildTests;
    this.log(`✅ Build system validation complete`, 'TEST');
  }

  async testDependencyInstall() {
    this.log('📦 Testing dependency installation...', 'TEST');
    
    try {
      const startTime = Date.now();
      execSync('npm install --production=false', { 
        stdio: 'pipe',
        timeout: 300000 // 5 minutes timeout
      });
      const duration = Date.now() - startTime;
      
      return {
        success: true,
        duration: `${(duration / 1000).toFixed(2)}s`,
        message: 'Dependencies installed successfully'
      };
    } catch (error) {
      this.diagnosticResults.criticalIssues.push({
        category: 'Build System',
        issue: 'Dependency installation failed',
        severity: 'CRITICAL',
        error: error.message,
        fix: 'Review package.json and resolve dependency conflicts'
      });
      
      return {
        success: false,
        error: error.message,
        message: 'Dependency installation failed'
      };
    }
  }

  async testBuildProcess() {
    this.log('🔨 Testing build process...', 'TEST');
    
    try {
      const startTime = Date.now();
      const buildOutput = execSync('npm run build', { 
        encoding: 'utf8',
        timeout: 600000 // 10 minutes timeout
      });
      const duration = Date.now() - startTime;
      
      const hasErrors = buildOutput.toLowerCase().includes('error') || 
                       buildOutput.toLowerCase().includes('failed');
      
      if (hasErrors) {
        this.diagnosticResults.criticalIssues.push({
          category: 'Build System',
          issue: 'Build process completed with errors',
          severity: 'CRITICAL',
          output: buildOutput.substring(0, 1000), // Truncate for readability
          fix: 'Review build errors and fix TypeScript/ESLint issues'
        });
      }
      
      return {
        success: !hasErrors,
        duration: `${(duration / 1000).toFixed(2)}s`,
        output: buildOutput.substring(0, 500), // Brief output
        message: hasErrors ? 'Build completed with errors' : 'Build successful'
      };
    } catch (error) {
      this.diagnosticResults.criticalIssues.push({
        category: 'Build System',
        issue: 'Build process failed',
        severity: 'CRITICAL',
        error: error.message,
        fix: 'Review build configuration and resolve compilation errors'
      });
      
      return {
        success: false,
        error: error.message,
        message: 'Build process failed'
      };
    }
  }

  testStandaloneOutput() {
    this.log('📂 Testing standalone output...', 'TEST');
    
    const standalonePath = path.join(this.projectRoot, '.next', 'standalone');
    const serverPath = path.join(standalonePath, 'server.js');
    const staticPath = path.join(standalonePath, 'static');
    
    const validation = {
      standaloneExists: fs.existsSync(standalonePath),
      serverExists: fs.existsSync(serverPath),
      staticExists: fs.existsSync(staticPath),
      packageJsonExists: fs.existsSync(path.join(standalonePath, 'package.json'))
    };

    if (!validation.standaloneExists) {
      this.diagnosticResults.criticalIssues.push({
        category: 'Build Output',
        issue: 'Standalone build directory not found',
        severity: 'CRITICAL',
        path: standalonePath,
        fix: 'Ensure next.config.js has output: "standalone" and build succeeds'
      });
    }

    if (!validation.serverExists) {
      this.diagnosticResults.criticalIssues.push({
        category: 'Build Output',
        issue: 'Standalone server.js not found',
        severity: 'CRITICAL',
        path: serverPath,
        fix: 'Verify Next.js standalone build is working correctly'
      });
    }

    return validation;
  }

  async validateAppHostingConfig() {
    this.log('🎯 Validating App Hosting Configuration...', 'TEST');
    // App Hosting specific validation already done in validateConfiguration
    this.log(`✅ App Hosting configuration validation complete`, 'TEST');
  }

  async validateDependencies() {
    this.log('📋 Validating Dependencies...', 'TEST');
    
    const packagePath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const criticalDependencies = {
      'next': { required: true, minVersion: '15.0.0' },
      'react': { required: true, minVersion: '18.0.0' },
      'firebase': { required: true, minVersion: '10.0.0' }
    };

    const depValidation = {};
    
    for (const [dep, requirements] of Object.entries(criticalDependencies)) {
      const installed = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
      depValidation[dep] = {
        installed: !!installed,
        version: installed,
        required: requirements.required,
        minVersion: requirements.minVersion
      };

      if (requirements.required && !installed) {
        this.diagnosticResults.criticalIssues.push({
          category: 'Dependencies',
          issue: `Critical dependency missing: ${dep}`,
          severity: 'CRITICAL',
          dependency: dep,
          fix: `Install ${dep}: npm install ${dep}`
        });
      }
    }

    this.diagnosticResults.testResults.dependencies = depValidation;
    this.log(`✅ Dependencies validation complete`, 'TEST');
  }

  async runBuildTests() {
    this.log('🧪 Running Build Tests...', 'TEST');
    
    const buildTests = {
      syntaxValidation: this.testSyntaxValidation(),
      moduleResolution: this.testModuleResolution(),
      standaloneServer: await this.testStandaloneServer()
    };

    this.diagnosticResults.testResults.buildTests = buildTests;
    this.log(`✅ Build tests complete`, 'TEST');
  }

  testSyntaxValidation() {
    // Check for common syntax issues
    const configFiles = ['next.config.js', 'apphosting.yaml'];
    const syntaxIssues = [];

    for (const file of configFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (file.endsWith('.js')) {
          // Check for ES module syntax in JS files
          if (content.includes('export default') || content.includes('import ')) {
            syntaxIssues.push({
              file,
              issue: 'ES module syntax in CommonJS file',
              line: content.split('\n').findIndex(line => 
                line.includes('export default') || line.includes('import ')
              ) + 1
            });
          }
        }
      }
    }

    return {
      passed: syntaxIssues.length === 0,
      issues: syntaxIssues
    };
  }

  testModuleResolution() {
    // Test if critical modules can be resolved
    const criticalModules = ['next', 'react', 'firebase'];
    const resolutionTests = {};

    for (const module of criticalModules) {
      try {
        require.resolve(module);
        resolutionTests[module] = { resolved: true };
      } catch (error) {
        resolutionTests[module] = { resolved: false, error: error.message };
      }
    }

    return resolutionTests;
  }

  async testStandaloneServer() {
    this.log('🚀 Testing standalone server...', 'TEST');
    
    const serverPath = path.join(this.projectRoot, '.next', 'standalone', 'server.js');
    
    if (!fs.existsSync(serverPath)) {
      return {
        success: false,
        error: 'Standalone server.js not found',
        message: 'Cannot test server - file missing'
      };
    }

    return new Promise((resolve) => {
      // Test if server can start (quick test)
      const testPort = 3999;
      const serverProcess = spawn('node', [serverPath], {
        env: { ...process.env, PORT: testPort },
        stdio: 'pipe',
        cwd: path.dirname(serverPath)
      });

      let serverOutput = '';
      let serverStarted = false;

      const timeout = setTimeout(() => {
        serverProcess.kill();
        resolve({
          success: false,
          error: 'Server startup timeout',
          output: serverOutput,
          message: 'Server failed to start within 10 seconds'
        });
      }, 10000);

      serverProcess.stdout.on('data', (data) => {
        serverOutput += data.toString();
        if (data.toString().includes('Ready in') || data.toString().includes('started server')) {
          serverStarted = true;
          clearTimeout(timeout);
          serverProcess.kill();
          resolve({
            success: true,
            output: serverOutput,
            message: 'Standalone server started successfully'
          });
        }
      });

      serverProcess.stderr.on('data', (data) => {
        serverOutput += data.toString();
      });

      serverProcess.on('error', (error) => {
        clearTimeout(timeout);
        resolve({
          success: false,
          error: error.message,
          output: serverOutput,
          message: 'Server process failed to start'
        });
      });

      serverProcess.on('exit', (code) => {
        clearTimeout(timeout);
        if (!serverStarted) {
          resolve({
            success: false,
            exitCode: code,
            output: serverOutput,
            message: `Server exited with code ${code}`
          });
        }
      });
    });
  }

  async validatePerformance() {
    this.log('⚡ Validating Performance...', 'TEST');
    
    const perfTests = {
      bundleSize: this.analyzeBundleSize(),
      buildTime: this.diagnosticResults.testResults.buildSystem?.buildProcess?.duration,
      dependencies: this.analyzeDepCount()
    };

    this.diagnosticResults.testResults.performance = perfTests;
    this.log(`✅ Performance validation complete`, 'TEST');
  }

  analyzeBundleSize() {
    try {
      const buildManifestPath = path.join(this.projectRoot, '.next', 'build-manifest.json');
      
      if (!fs.existsSync(buildManifestPath)) {
        return { analyzed: false, reason: 'Build manifest not found' };
      }

      const manifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));
      const pages = manifest.pages || {};
      
      let totalSize = 0;
      const pageAnalysis = {};

      for (const [page, files] of Object.entries(pages)) {
        const pageSize = files.reduce((size, file) => {
          const filePath = path.join(this.projectRoot, '.next', file);
          if (fs.existsSync(filePath)) {
            return size + fs.statSync(filePath).size;
          }
          return size;
        }, 0);
        
        pageAnalysis[page] = {
          files: files.length,
          size: pageSize,
          sizeKB: Math.round(pageSize / 1024)
        };
        
        totalSize += pageSize;
      }

      return {
        analyzed: true,
        totalSizeKB: Math.round(totalSize / 1024),
        totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
        pages: Object.keys(pageAnalysis).length,
        largestPage: Object.entries(pageAnalysis)
          .sort(([,a], [,b]) => b.size - a.size)[0]
      };
    } catch (error) {
      return { analyzed: false, error: error.message };
    }
  }

  analyzeDepCount() {
    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      const deps = Object.keys(packageJson.dependencies || {});
      const devDeps = Object.keys(packageJson.devDependencies || {});
      
      return {
        dependencies: deps.length,
        devDependencies: devDeps.length,
        total: deps.length + devDeps.length,
        heavyDeps: deps.filter(dep => 
          ['@types/', 'webpack', 'babel', 'eslint'].some(heavy => dep.includes(heavy))
        ).length
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async validateSecurity() {
    this.log('🔒 Validating Security...', 'TEST');
    
    const securityTests = {
      envVariables: this.checkEnvVariables(),
      gitignore: this.checkGitignore(),
      secrets: this.checkForSecrets()
    };

    this.diagnosticResults.testResults.security = securityTests;
    this.log(`✅ Security validation complete`, 'TEST');
  }

  checkEnvVariables() {
    const envFiles = ['.env.local', '.env.production', '.env'];
    const envStatus = {};

    for (const envFile of envFiles) {
      const envPath = path.join(this.projectRoot, envFile);
      envStatus[envFile] = {
        exists: fs.existsSync(envPath),
        size: fs.existsSync(envPath) ? fs.statSync(envPath).size : 0
      };
    }

    return envStatus;
  }

  checkGitignore() {
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    
    if (!fs.existsSync(gitignorePath)) {
      this.diagnosticResults.warnings.push({
        category: 'Security',
        issue: '.gitignore file missing',
        severity: 'WARNING',
        fix: 'Create .gitignore to exclude sensitive files'
      });
      return { exists: false };
    }

    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const criticalIgnores = ['.env.local', '.env.production', 'node_modules', '.next'];
    const missingIgnores = criticalIgnores.filter(ignore => 
      !gitignoreContent.includes(ignore)
    );

    if (missingIgnores.length > 0) {
      this.diagnosticResults.warnings.push({
        category: 'Security',
        issue: 'Critical files not in .gitignore',
        severity: 'WARNING',
        missing: missingIgnores,
        fix: `Add to .gitignore: ${missingIgnores.join(', ')}`
      });
    }

    return {
      exists: true,
      missingIgnores,
      hasEnvProtection: gitignoreContent.includes('.env')
    };
  }

  checkForSecrets() {
    // Basic secret detection in config files
    const configFiles = ['next.config.js', 'apphosting.yaml'];
    const secretPatterns = [
      /sk_live_[a-zA-Z0-9]{99,}/,  // Stripe live keys
      /sk_test_[a-zA-Z0-9]{99,}/,  // Stripe test keys
      /AIza[0-9A-Za-z\\-_]{35}/,   // Google API keys
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/ // UUIDs
    ];

    const secretsFound = [];

    for (const file of configFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        for (const pattern of secretPatterns) {
          if (pattern.test(content)) {
            secretsFound.push({ file, pattern: pattern.toString() });
          }
        }
      }
    }

    if (secretsFound.length > 0) {
      this.diagnosticResults.criticalIssues.push({
        category: 'Security',
        issue: 'Potential secrets found in config files',
        severity: 'CRITICAL',
        files: secretsFound,
        fix: 'Move secrets to environment variables'
      });
    }

    return {
      secretsFound: secretsFound.length,
      files: secretsFound
    };
  }

  calculateScore() {
    const { criticalIssues, warnings, testResults } = this.diagnosticResults;
    
    let score = 100;
    
    // Deduct points for critical issues
    score -= criticalIssues.length * 20;
    
    // Deduct points for warnings
    score -= warnings.length * 5;
    
    // Bonus points for successful tests
    const successfulTests = Object.values(testResults).flat().filter(test => 
      test && (test.success === true || test.passed === true)
    ).length;
    
    score += successfulTests * 2;
    
    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    this.diagnosticResults.overallScore = score;
    this.diagnosticResults.publicationReadiness = score >= 80 && criticalIssues.length === 0;
    
    this.log(`📊 Overall Score: ${score}/100`, 'SCORE');
    this.log(`🎯 Publication Ready: ${this.diagnosticResults.publicationReadiness}`, 'SCORE');
  }

  async generateReport() {
    this.log('📋 Generating Comprehensive Report...', 'REPORT');
    
    const report = this.buildMarkdownReport();
    fs.writeFileSync(this.reportFile, report);
    
    this.log(`📄 Report saved to: ${this.reportFile}`, 'REPORT');
    
    // Also generate a summary for console
    this.printSummary();
  }

  buildMarkdownReport() {
    const { overallScore, criticalIssues, warnings, testResults, publicationReadiness } = this.diagnosticResults;
    
    return `# Firebase Studio Publication Diagnostic Report

**Generated:** ${new Date().toLocaleString()}  
**Overall Score:** ${overallScore}/100  
**Publication Ready:** ${publicationReadiness ? '✅ YES' : '❌ NO'}

## 🎯 Executive Summary

${publicationReadiness 
  ? '🎉 **ALCHM is ready for Firebase Studio publication!** All critical requirements have been met.'
  : '⚠️ **ALCHM requires fixes before Firebase Studio publication.** Please address the issues below.'
}

## 🚨 Critical Issues (${criticalIssues.length})

${criticalIssues.length === 0 
  ? '✅ No critical issues found!'
  : criticalIssues.map((issue, i) => `
### ${i + 1}. ${issue.issue}
- **Category:** ${issue.category}
- **Severity:** ${issue.severity}
- **File:** ${issue.file || 'N/A'}
- **Fix:** ${issue.fix}
${issue.current ? `- **Current Value:** ${issue.current}` : ''}
${issue.error ? `- **Error:** ${issue.error}` : ''}
`).join('')
}

## ⚠️ Warnings (${warnings.length})

${warnings.length === 0 
  ? '✅ No warnings found!'
  : warnings.map((warning, i) => `
### ${i + 1}. ${warning.issue}
- **Category:** ${warning.category}
- **Severity:** ${warning.severity}
- **Fix:** ${warning.fix}
`).join('')
}

## 📊 Test Results

### Environment Tests
${this.formatTestResults(testResults.environment)}

### Configuration Tests
${this.formatTestResults(testResults.configuration)}

### Build System Tests
${this.formatTestResults(testResults.buildSystem)}

### Dependencies
${this.formatTestResults(testResults.dependencies)}

### Performance Analysis
${this.formatTestResults(testResults.performance)}

### Security Check
${this.formatTestResults(testResults.security)}

## 🎯 Firebase Studio Requirements Checklist

- [${testResults.configuration?.nextConfig?.hasStandalone ? 'x' : ' '}] Next.js standalone output configured
- [${testResults.configuration?.nextConfig?.hasModuleExports ? 'x' : ' '}] CommonJS module exports (not ES modules)
- [${testResults.configuration?.appHostingYaml?.hasNodeRuntime ? 'x' : ' '}] Node.js 20 runtime specified
- [${testResults.buildSystem?.buildProcess?.success ? 'x' : ' '}] Build process succeeds
- [${testResults.buildSystem?.standaloneOutput?.serverExists ? 'x' : ' '}] Standalone server.js generated
- [${testResults.buildTests?.standaloneServer?.success ? 'x' : ' '}] Standalone server starts successfully
- [${criticalIssues.length === 0 ? 'x' : ' '}] No critical configuration issues

## 🚀 Next Steps

${publicationReadiness 
  ? `
### Ready for Publication! 🎉

1. **Deploy via Firebase Studio** - Your app is ready for publication
2. **Monitor deployment** - Watch for any deployment-specific issues
3. **Test production** - Verify all features work in production environment
4. **Set up monitoring** - Configure alerts and analytics
` 
  : `
### Fix Required Issues 🔧

1. **Address Critical Issues** - Fix all ${criticalIssues.length} critical issues listed above
2. **Review Warnings** - Consider fixing ${warnings.length} warnings for optimal performance
3. **Re-run Diagnostic** - Run this diagnostic again after fixes
4. **Verify Build** - Ensure \`npm run build\` succeeds without errors
`
}

## 📈 Performance Metrics

- **Build Time:** ${testResults.buildSystem?.buildProcess?.duration || 'N/A'}
- **Bundle Size:** ${testResults.performance?.bundleSize?.totalSizeKB ? `${testResults.performance.bundleSize.totalSizeKB}KB` : 'N/A'}
- **Dependencies:** ${testResults.performance?.dependencies?.total || 'N/A'} total packages

## 🔍 Technical Details

### File Structure Validation
\`\`\`
${Object.entries(testResults.environment?.projectStructure?.requiredFiles || {})
  .map(([file, status]) => `${status.exists ? '✅' : '❌'} ${file}`)
  .join('\n')}
\`\`\`

### Build Output Validation
\`\`\`
${Object.entries(testResults.buildSystem?.standaloneOutput || {})
  .map(([check, status]) => `${status ? '✅' : '❌'} ${check}`)
  .join('\n')}
\`\`\`

---

**Diagnostic completed successfully. Score: ${overallScore}/100**

*Generated by Firebase Studio Publication Diagnostic System*
`;
  }

  formatTestResults(results) {
    if (!results) return 'No test results available';
    
    return Object.entries(results)
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return `- **${key}:** ${value ? '✅ Pass' : '❌ Fail'}`;
        } else if (typeof value === 'object' && value !== null) {
          if (value.success !== undefined) {
            return `- **${key}:** ${value.success ? '✅ Pass' : '❌ Fail'} ${value.message ? `- ${value.message}` : ''}`;
          } else if (value.exists !== undefined) {
            return `- **${key}:** ${value.exists ? '✅ Found' : '❌ Missing'}`;
          } else {
            return `- **${key}:** ${JSON.stringify(value)}`;
          }
        } else {
          return `- **${key}:** ${value}`;
        }
      })
      .join('\n');
  }

  printSummary() {
    console.log('\n🎯 FIREBASE STUDIO DIAGNOSTIC SUMMARY');
    console.log('═'.repeat(50));
    console.log(`📊 Overall Score: ${this.diagnosticResults.overallScore}/100`);
    console.log(`🎯 Publication Ready: ${this.diagnosticResults.publicationReadiness ? '✅ YES' : '❌ NO'}`);
    console.log(`🚨 Critical Issues: ${this.diagnosticResults.criticalIssues.length}`);
    console.log(`⚠️  Warnings: ${this.diagnosticResults.warnings.length}`);
    
    if (this.diagnosticResults.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES TO FIX:');
      this.diagnosticResults.criticalIssues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.issue}`);
        console.log(`   Fix: ${issue.fix}`);
      });
    }
    
    if (this.diagnosticResults.publicationReadiness) {
      console.log('\n🎉 READY FOR FIREBASE STUDIO PUBLICATION!');
      console.log('Your app meets all requirements and can be published.');
    } else {
      console.log('\n🔧 FIXES REQUIRED BEFORE PUBLICATION');
      console.log('Please address the critical issues listed above.');
    }
    
    console.log(`\n📄 Full report available at: ${this.reportFile}`);
    console.log('═'.repeat(50));
  }
}

// Self-executing diagnostic if run directly
if (require.main === module) {
  const diagnostic = new FirebaseStudioDiagnostic();
  diagnostic.runDiagnostic()
    .then(() => {
      process.exit(diagnostic.diagnosticResults.publicationReadiness ? 0 : 1);
    })
    .catch((error) => {
      console.error('Diagnostic failed:', error);
      process.exit(1);
    });
}

module.exports = FirebaseStudioDiagnostic;