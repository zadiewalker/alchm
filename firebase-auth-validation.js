#!/usr/bin/env node

/**
 * FIREBASE AUTHENTICATION VALIDATION FOR ALCHM
 * 
 * Critical test for mental health app authentication flow
 * Validates Firebase configuration and auth performance
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class FirebaseAuthValidator {
  constructor() {
    this.results = {
      configValidation: {},
      authFlow: {},
      performance: {},
      security: {},
      criticalIssues: []
    };
  }

  async validate() {
    console.log('🔐 ALCHM Firebase Authentication Validation');
    console.log('='.repeat(50));

    try {
      await this.validateConfig();
      await this.testAuthFlow();
      await this.validateSecurity();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Validation failed:', error);
      this.results.criticalIssues.push({
        type: 'VALIDATION_FAILURE',
        message: error.message,
        impact: 'CRITICAL'
      });
    }
  }

  async validateConfig() {
    console.log('\n📋 Validating Firebase Configuration...');

    try {
      // Check .env.local exists
      const envPath = path.join(__dirname, '.env.local');
      const envExists = await fs.access(envPath).then(() => true).catch(() => false);
      
      if (!envExists) {
        throw new Error('.env.local file not found - Firebase configuration missing');
      }

      // Read environment variables
      const envContent = await fs.readFile(envPath, 'utf8');
      const envVars = {};
      envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          envVars[key.trim()] = value.trim();
        }
      });

      // Critical Firebase variables
      const requiredVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID'
      ];

      const missingVars = requiredVars.filter(varName => !envVars[varName]);
      
      if (missingVars.length > 0) {
        this.results.criticalIssues.push({
          type: 'MISSING_ENV_VARS',
          message: `Missing Firebase environment variables: ${missingVars.join(', ')}`,
          impact: 'CRITICAL'
        });
      }

      this.results.configValidation = {
        envFileExists: envExists,
        requiredVarsPresent: missingVars.length === 0,
        missingVars: missingVars,
        projectId: envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        authDomain: envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
      };

      console.log(`   ✅ .env.local file: ${envExists ? 'Found' : 'Missing'}`);
      console.log(`   ✅ Required variables: ${missingVars.length === 0 ? 'All present' : `Missing ${missingVars.length}`}`);
      
      if (missingVars.length > 0) {
        console.log(`   ❌ Missing: ${missingVars.join(', ')}`);
      }

    } catch (error) {
      console.error('❌ Config validation failed:', error.message);
      this.results.criticalIssues.push({
        type: 'CONFIG_VALIDATION_FAILED',
        message: error.message,
        impact: 'CRITICAL'
      });
    }
  }

  async testAuthFlow() {
    console.log('\n🔑 Testing Authentication Flow...');

    return new Promise((resolve) => {
      const authTest = `
const { initializeApp } = require('firebase/app');
const { getAuth, connectAuthEmulator } = require('firebase/auth');

async function testFirebaseAuth() {
  try {
    // Firebase config from environment
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    };

    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // Test auth initialization time
    const startTime = Date.now();
    
    // Simple auth state check
    auth.onAuthStateChanged((user) => {
      const initTime = Date.now() - startTime;
      console.log(\`Auth initialized in \${initTime}ms\`);
      
      if (initTime > 2000) {
        console.error('❌ Firebase Auth initialization too slow');
      } else {
        console.log('✅ Firebase Auth initialization time acceptable');
      }
      
      console.log('Auth state:', user ? 'User signed in' : 'No user');
      process.exit(0);
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      console.error('❌ Firebase Auth initialization timeout');
      process.exit(1);
    }, 5000);

  } catch (error) {
    console.error('❌ Firebase Auth test failed:', error.message);
    process.exit(1);
  }
}

testFirebaseAuth();
`;

      // Write test file
      const testFile = path.join(__dirname, 'temp-auth-test.js');
      fs.writeFile(testFile, authTest).then(() => {
        
        // Run test with environment variables
        const child = spawn('node', [testFile], {
          env: { ...process.env },
          stdio: 'pipe'
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
          output += data.toString();
          console.log(`   ${data.toString().trim()}`);
        });

        child.stderr.on('data', (data) => {
          errorOutput += data.toString();
          console.error(`   ❌ ${data.toString().trim()}`);
        });

        child.on('close', async (code) => {
          // Clean up test file
          await fs.unlink(testFile).catch(() => {});

          this.results.authFlow = {
            exitCode: code,
            success: code === 0,
            output: output,
            errors: errorOutput,
            duration: Date.now()
          };

          if (code !== 0) {
            this.results.criticalIssues.push({
              type: 'AUTH_FLOW_FAILED',
              message: 'Firebase authentication flow test failed',
              impact: 'CRITICAL',
              details: errorOutput
            });
          }

          resolve();
        });

      }).catch((error) => {
        console.error('❌ Failed to create auth test:', error);
        resolve();
      });
    });
  }

  async validateSecurity() {
    console.log('\n🔒 Validating Security Configuration...');

    try {
      // Check if HTTPS is enforced
      const nextConfigPath = path.join(__dirname, 'next.config.js');
      const nextConfig = await fs.readFile(nextConfigPath, 'utf8');
      
      const securityChecks = {
        httpsEnforced: nextConfig.includes('https') || process.env.NODE_ENV === 'production',
        firebaseRulesExist: await fs.access(path.join(__dirname, 'firestore.rules')).then(() => true).catch(() => false),
        environmentSecure: !nextConfig.includes('ignoreBuildErrors') || process.env.NODE_ENV !== 'production'
      };

      this.results.security = securityChecks;

      Object.entries(securityChecks).forEach(([check, passed]) => {
        console.log(`   ${passed ? '✅' : '❌'} ${check}: ${passed ? 'OK' : 'ISSUE'}`);
        
        if (!passed) {
          this.results.criticalIssues.push({
            type: 'SECURITY_ISSUE',
            message: `Security check failed: ${check}`,
            impact: 'HIGH'
          });
        }
      });

    } catch (error) {
      console.error('❌ Security validation failed:', error.message);
      this.results.criticalIssues.push({
        type: 'SECURITY_VALIDATION_FAILED',
        message: error.message,
        impact: 'HIGH'
      });
    }
  }

  async generateReport() {
    const criticalCount = this.results.criticalIssues.filter(i => i.impact === 'CRITICAL').length;
    const highCount = this.results.criticalIssues.filter(i => i.impact === 'HIGH').length;
    
    const isReady = criticalCount === 0 && highCount <= 1;

    console.log('\n' + '='.repeat(50));
    console.log('📊 FIREBASE AUTHENTICATION VALIDATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`🔐 Configuration: ${this.results.configValidation.requiredVarsPresent ? 'Valid' : 'Invalid'}`);
    console.log(`🔑 Auth Flow: ${this.results.authFlow.success ? 'Working' : 'Failed'}`);
    console.log(`🔒 Security: ${Object.values(this.results.security).every(v => v) ? 'Secure' : 'Issues Found'}`);
    console.log(`⚠️  Critical Issues: ${criticalCount}`);
    console.log(`📈 High Priority Issues: ${highCount}`);
    console.log('');
    console.log(`🚦 Beta Launch Readiness: ${isReady ? 'READY' : 'NOT READY'}`);

    if (!isReady) {
      console.log('\n❌ CRITICAL ISSUES MUST BE RESOLVED:');
      this.results.criticalIssues
        .filter(i => i.impact === 'CRITICAL')
        .forEach(issue => {
          console.log(`   • ${issue.type}: ${issue.message}`);
        });
    }

    // Save detailed report
    await fs.writeFile(
      path.join(__dirname, 'firebase-auth-validation-report.json'),
      JSON.stringify(this.results, null, 2)
    );

    console.log('\n📋 Detailed report saved to: firebase-auth-validation-report.json');
  }
}

// Run validation
async function main() {
  const validator = new FirebaseAuthValidator();
  await validator.validate();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = FirebaseAuthValidator;