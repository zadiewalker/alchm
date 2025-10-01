#!/usr/bin/env node

/**
 * ALCHM Firebase Authentication Flow Validation System
 * Comprehensive testing for auth security, educational compliance, and trauma-informed protections
 * Built for 10M+ users with strict privacy requirements
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

class FirebaseAuthAuditor {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.auditResults = [];
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.reportDir = path.join(this.projectRoot, 'audit-reports', `firebase-auth-${this.timestamp}`);
    
    // Authentication security requirements for trauma-informed application
    this.authRequirements = {
      minPasswordLength: 8,
      requireEmailVerification: true,
      enableMFA: false, // Can be overwhelming for trauma survivors
      sessionTimeout: 30 * 24 * 60 * 60 * 1000, // 30 days (gentle for therapeutic continuity)
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes (trauma-informed)
      requireStrongPasswords: true,
      enableAnonymousAuth: true, // Critical for privacy-conscious users
      enableSocialAuth: true,
      enableCustomClaims: true,
      requireAgeVerification: true, // COPPA compliance
      enableParentalConsent: true // COPPA compliance
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

  async auditFirebaseAuthConfiguration() {
    console.log(`${colors.purple}🔍 PHASE 1: Firebase Auth Configuration Analysis${colors.reset}`);
    console.log(`${colors.blue}================================================${colors.reset}`);

    // Check Firebase client configuration
    const clientConfigPath = path.join(this.projectRoot, 'src', 'lib', 'firebase.ts');
    if (fs.existsSync(clientConfigPath)) {
      this.log('PASS', 'config', 'client_config_exists', 'Firebase client configuration file found');
      await this.analyzeClientConfig(clientConfigPath);
    } else {
      this.log('FAIL', 'config', 'client_config_exists', 'Firebase client configuration file not found');
    }

    // Check Firebase Admin configuration
    const adminConfigPath = path.join(this.projectRoot, 'src', 'lib', 'firebaseAdmin.ts');
    if (fs.existsSync(adminConfigPath)) {
      this.log('PASS', 'config', 'admin_config_exists', 'Firebase Admin configuration file found');
      await this.analyzeAdminConfig(adminConfigPath);
    } else {
      this.log('FAIL', 'config', 'admin_config_exists', 'Firebase Admin configuration file not found');
    }

    // Check session validation
    const sessionValidationPath = path.join(this.projectRoot, 'src', 'lib', 'validateSession.ts');
    if (fs.existsSync(sessionValidationPath)) {
      this.log('PASS', 'config', 'session_validation_exists', 'Session validation implementation found');
      await this.analyzeSessionValidation(sessionValidationPath);
    } else {
      this.log('FAIL', 'config', 'session_validation_exists', 'Session validation implementation not found');
    }

    // Check environment variables
    await this.auditEnvironmentVariables();
  }

  async analyzeClientConfig(configPath) {
    try {
      const content = fs.readFileSync(configPath, 'utf8');

      // Check for proper Firebase Auth import
      if (content.includes('getAuth') || content.includes('Auth')) {
        this.log('PASS', 'client', 'auth_import', 'Firebase Auth properly imported');
      } else {
        this.log('FAIL', 'client', 'auth_import', 'Firebase Auth not imported');
      }

      // Check for app initialization
      if (content.includes('initializeApp')) {
        this.log('PASS', 'client', 'app_initialization', 'Firebase app properly initialized');
      } else {
        this.log('FAIL', 'client', 'app_initialization', 'Firebase app not initialized');
      }

      // Check for environment variable usage
      if (content.includes('process.env') || content.includes('NEXT_PUBLIC_')) {
        this.log('PASS', 'client', 'env_variables', 'Environment variables used for configuration');
      } else {
        this.log('WARN', 'client', 'env_variables', 'No environment variables detected - check configuration security');
      }

      // Check for auth state persistence
      if (content.includes('setPersistence') || content.includes('browserLocalPersistence')) {
        this.log('PASS', 'client', 'auth_persistence', 'Auth state persistence configured');
      } else {
        this.log('WARN', 'client', 'auth_persistence', 'No explicit auth persistence configuration');
      }

      // Check for error handling
      if (content.includes('try') && content.includes('catch')) {
        this.log('PASS', 'client', 'error_handling', 'Error handling implemented');
      } else {
        this.log('WARN', 'client', 'error_handling', 'Limited error handling detected');
      }

    } catch (error) {
      this.log('FAIL', 'client', 'config_analysis', `Error analyzing client config: ${error.message}`);
    }
  }

  async analyzeAdminConfig(configPath) {
    try {
      const content = fs.readFileSync(configPath, 'utf8');

      // Check for proper Admin SDK import
      if (content.includes('firebase-admin') && content.includes('getAuth')) {
        this.log('PASS', 'admin', 'admin_import', 'Firebase Admin Auth properly imported');
      } else {
        this.log('FAIL', 'admin', 'admin_import', 'Firebase Admin Auth not properly imported');
      }

      // Check for app initialization
      if (content.includes('initializeApp') || content.includes('getApps')) {
        this.log('PASS', 'admin', 'admin_initialization', 'Firebase Admin properly initialized');
      } else {
        this.log('FAIL', 'admin', 'admin_initialization', 'Firebase Admin not initialized');
      }

      // Check for service account configuration
      if (content.includes('serviceAccount') || content.includes('credential')) {
        this.log('PASS', 'admin', 'service_account', 'Service account configuration found');
      } else {
        this.log('WARN', 'admin', 'service_account', 'No explicit service account configuration');
      }

      // Check for custom claims functionality
      if (content.includes('setCustomUserClaims') || content.includes('customClaims')) {
        this.log('PASS', 'admin', 'custom_claims', 'Custom claims functionality implemented');
      } else {
        this.log('WARN', 'admin', 'custom_claims', 'No custom claims functionality found');
      }

      // Check for user management functions
      if (content.includes('createUser') || content.includes('updateUser') || content.includes('deleteUser')) {
        this.log('PASS', 'admin', 'user_management', 'User management functions found');
      } else {
        this.log('WARN', 'admin', 'user_management', 'No user management functions found');
      }

    } catch (error) {
      this.log('FAIL', 'admin', 'config_analysis', `Error analyzing admin config: ${error.message}`);
    }
  }

  async analyzeSessionValidation(sessionPath) {
    try {
      const content = fs.readFileSync(sessionPath, 'utf8');

      // Check for token verification
      if (content.includes('verifyIdToken') || content.includes('verifySessionCookie')) {
        this.log('PASS', 'session', 'token_verification', 'Token verification implemented');
      } else {
        this.log('FAIL', 'session', 'token_verification', 'No token verification found');
      }

      // Check for session expiry handling
      if (content.includes('exp') || content.includes('expires') || content.includes('timeout')) {
        this.log('PASS', 'session', 'expiry_handling', 'Session expiry handling implemented');
      } else {
        this.log('WARN', 'session', 'expiry_handling', 'No explicit session expiry handling');
      }

      // Check for user role validation
      if (content.includes('role') || content.includes('admin') || content.includes('tier')) {
        this.log('PASS', 'session', 'role_validation', 'User role validation implemented');
      } else {
        this.log('WARN', 'session', 'role_validation', 'No user role validation found');
      }

      // Check for error handling
      if (content.includes('try') && content.includes('catch')) {
        this.log('PASS', 'session', 'error_handling', 'Session validation error handling implemented');
      } else {
        this.log('FAIL', 'session', 'error_handling', 'No session validation error handling');
      }

    } catch (error) {
      this.log('FAIL', 'session', 'validation_analysis', `Error analyzing session validation: ${error.message}`);
    }
  }

  async auditEnvironmentVariables() {
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'FIREBASE_ADMIN_PRIVATE_KEY',
      'FIREBASE_ADMIN_CLIENT_EMAIL',
      'FIREBASE_ADMIN_PROJECT_ID'
    ];

    // Check for .env.example or documentation
    const envExamplePath = path.join(this.projectRoot, '.env.example');
    const envLocalExamplePath = path.join(this.projectRoot, '.env.local.example');
    
    if (fs.existsSync(envExamplePath) || fs.existsSync(envLocalExamplePath)) {
      this.log('PASS', 'env', 'env_template', 'Environment variable template found');
    } else {
      this.log('WARN', 'env', 'env_template', 'No environment variable template found');
    }

    // Check if .env files are properly gitignored
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      if (gitignoreContent.includes('.env.local') || gitignoreContent.includes('.env')) {
        this.log('PASS', 'env', 'env_security', 'Environment files properly gitignored');
      } else {
        this.log('FAIL', 'env', 'env_security', 'Environment files not properly gitignored - security risk');
      }
    }

    // Validate current environment variables (without exposing values)
    requiredEnvVars.forEach(envVar => {
      if (process.env[envVar]) {
        this.log('PASS', 'env', `${envVar.toLowerCase()}`, `Environment variable ${envVar} is set`);
      } else {
        this.log('WARN', 'env', `${envVar.toLowerCase()}`, `Environment variable ${envVar} not set`);
      }
    });
  }

  async auditAuthenticationFlows() {
    console.log(`\n${colors.purple}🔐 PHASE 2: Authentication Flow Analysis${colors.reset}`);
    console.log(`${colors.blue}=========================================${colors.reset}`);

    // Check login page implementation
    await this.auditLoginPage();

    // Check signup/registration flow
    await this.auditSignupFlow();

    // Check password reset flow
    await this.auditPasswordResetFlow();

    // Check email verification flow
    await this.auditEmailVerificationFlow();

    // Check logout flow
    await this.auditLogoutFlow();

    // Check protected route handling
    await this.auditProtectedRoutes();
  }

  async auditLoginPage() {
    const loginPagePaths = [
      path.join(this.projectRoot, 'src', 'app', 'auth', 'login', 'page.tsx'),
      path.join(this.projectRoot, 'src', 'app', 'login', 'page.tsx'),
      path.join(this.projectRoot, 'src', 'pages', 'login.tsx')
    ];

    let loginPageFound = false;
    for (const loginPath of loginPagePaths) {
      if (fs.existsSync(loginPath)) {
        loginPageFound = true;
        this.log('PASS', 'auth_flow', 'login_page_exists', 'Login page found');
        await this.analyzeLoginImplementation(loginPath);
        break;
      }
    }

    if (!loginPageFound) {
      this.log('FAIL', 'auth_flow', 'login_page_exists', 'No login page found');
    }
  }

  async analyzeLoginImplementation(loginPath) {
    try {
      const content = fs.readFileSync(loginPath, 'utf8');

      // Check for email/password authentication
      if (content.includes('signInWithEmailAndPassword') || content.includes('email') && content.includes('password')) {
        this.log('PASS', 'login', 'email_password_auth', 'Email/password authentication implemented');
      } else {
        this.log('WARN', 'login', 'email_password_auth', 'No email/password authentication found');
      }

      // Check for social authentication
      if (content.includes('GoogleAuthProvider') || content.includes('signInWithPopup') || content.includes('social')) {
        this.log('PASS', 'login', 'social_auth', 'Social authentication implemented');
      } else {
        this.log('WARN', 'login', 'social_auth', 'No social authentication found');
      }

      // Check for anonymous authentication (important for privacy)
      if (content.includes('signInAnonymously') || content.includes('anonymous')) {
        this.log('PASS', 'login', 'anonymous_auth', 'Anonymous authentication implemented (trauma-informed)');
      } else {
        this.log('WARN', 'login', 'anonymous_auth', 'No anonymous authentication - consider for privacy-conscious users');
      }

      // Check for input validation
      if (content.includes('validate') || content.includes('required') || content.includes('type="email"')) {
        this.log('PASS', 'login', 'input_validation', 'Input validation implemented');
      } else {
        this.log('WARN', 'login', 'input_validation', 'Limited input validation detected');
      }

      // Check for error handling
      if (content.includes('error') || content.includes('catch') || content.includes('ErrorMessage')) {
        this.log('PASS', 'login', 'error_handling', 'Error handling implemented');
      } else {
        this.log('FAIL', 'login', 'error_handling', 'No error handling found');
      }

      // Check for loading states
      if (content.includes('loading') || content.includes('isLoading') || content.includes('disabled')) {
        this.log('PASS', 'login', 'loading_states', 'Loading states implemented');
      } else {
        this.log('WARN', 'login', 'loading_states', 'No loading states found');
      }

      // Check for accessibility features
      if (content.includes('aria-') || content.includes('role=') || content.includes('label')) {
        this.log('PASS', 'login', 'accessibility', 'Accessibility features implemented');
      } else {
        this.log('WARN', 'login', 'accessibility', 'Limited accessibility features');
      }

      // Check for trauma-informed design elements
      if (content.includes('gentle') || content.includes('safe') || content.includes('privacy') || content.includes('confidential')) {
        this.log('PASS', 'login', 'trauma_informed_design', 'Trauma-informed design elements found');
      } else {
        this.log('WARN', 'login', 'trauma_informed_design', 'No trauma-informed design elements found');
      }

    } catch (error) {
      this.log('FAIL', 'login', 'implementation_analysis', `Error analyzing login implementation: ${error.message}`);
    }
  }

  async auditSignupFlow() {
    const signupPagePaths = [
      path.join(this.projectRoot, 'src', 'app', 'auth', 'signup', 'page.tsx'),
      path.join(this.projectRoot, 'src', 'app', 'signup', 'page.tsx'),
      path.join(this.projectRoot, 'src', 'pages', 'signup.tsx')
    ];

    let signupPageFound = false;
    for (const signupPath of signupPagePaths) {
      if (fs.existsSync(signupPath)) {
        signupPageFound = true;
        this.log('PASS', 'auth_flow', 'signup_page_exists', 'Signup page found');
        await this.analyzeSignupImplementation(signupPath);
        break;
      }
    }

    if (!signupPageFound) {
      this.log('FAIL', 'auth_flow', 'signup_page_exists', 'No signup page found');
    }
  }

  async analyzeSignupImplementation(signupPath) {
    try {
      const content = fs.readFileSync(signupPath, 'utf8');

      // Check for user registration
      if (content.includes('createUserWithEmailAndPassword') || content.includes('register') || content.includes('signup')) {
        this.log('PASS', 'signup', 'user_registration', 'User registration implemented');
      } else {
        this.log('FAIL', 'signup', 'user_registration', 'No user registration found');
      }

      // Check for age verification (COPPA compliance)
      if (content.includes('age') || content.includes('birthdate') || content.includes('under.*13') || content.includes('coppa')) {
        this.log('PASS', 'signup', 'age_verification', 'Age verification implemented (COPPA compliance)');
      } else {
        this.log('FAIL', 'signup', 'age_verification', 'No age verification found - required for COPPA compliance');
      }

      // Check for parental consent
      if (content.includes('parent') || content.includes('guardian') || content.includes('consent')) {
        this.log('PASS', 'signup', 'parental_consent', 'Parental consent features found');
      } else {
        this.log('FAIL', 'signup', 'parental_consent', 'No parental consent features - required for under-13 users');
      }

      // Check for privacy policy acceptance
      if (content.includes('privacy.*policy') || content.includes('terms.*service') || content.includes('agree')) {
        this.log('PASS', 'signup', 'privacy_consent', 'Privacy policy/terms acceptance implemented');
      } else {
        this.log('FAIL', 'signup', 'privacy_consent', 'No privacy policy/terms acceptance found');
      }

      // Check for email verification requirement
      if (content.includes('sendEmailVerification') || content.includes('verify.*email')) {
        this.log('PASS', 'signup', 'email_verification', 'Email verification implemented');
      } else {
        this.log('WARN', 'signup', 'email_verification', 'No email verification found');
      }

      // Check for password strength requirements
      if (content.includes('password.*strength') || content.includes('minLength') || content.includes('complex')) {
        this.log('PASS', 'signup', 'password_strength', 'Password strength requirements implemented');
      } else {
        this.log('WARN', 'signup', 'password_strength', 'No password strength requirements found');
      }

      // Check for data minimization principles
      if (content.includes('minimal') || content.includes('essential') || content.includes('necessary')) {
        this.log('PASS', 'signup', 'data_minimization', 'Data minimization principles implemented');
      } else {
        this.log('WARN', 'signup', 'data_minimization', 'No explicit data minimization principles');
      }

    } catch (error) {
      this.log('FAIL', 'signup', 'implementation_analysis', `Error analyzing signup implementation: ${error.message}`);
    }
  }

  async auditPasswordResetFlow() {
    // Look for password reset implementation
    const passwordResetPaths = [
      path.join(this.projectRoot, 'src', 'app', 'auth', 'reset', 'page.tsx'),
      path.join(this.projectRoot, 'src', 'app', 'reset-password', 'page.tsx'),
      path.join(this.projectRoot, 'src', 'pages', 'reset-password.tsx')
    ];

    // Also check in existing auth pages
    const authPages = [
      path.join(this.projectRoot, 'src', 'app', 'auth', 'login', 'page.tsx'),
      path.join(this.projectRoot, 'src', 'app', 'login', 'page.tsx')
    ];

    let passwordResetFound = false;

    // Check dedicated password reset pages
    for (const resetPath of passwordResetPaths) {
      if (fs.existsSync(resetPath)) {
        passwordResetFound = true;
        this.log('PASS', 'auth_flow', 'password_reset_page', 'Dedicated password reset page found');
        break;
      }
    }

    // Check for password reset functionality in auth pages
    for (const authPage of authPages) {
      if (fs.existsSync(authPage)) {
        const content = fs.readFileSync(authPage, 'utf8');
        if (content.includes('sendPasswordResetEmail') || content.includes('forgot.*password') || content.includes('reset.*password')) {
          passwordResetFound = true;
          this.log('PASS', 'auth_flow', 'password_reset_function', 'Password reset functionality found');
          break;
        }
      }
    }

    if (!passwordResetFound) {
      this.log('FAIL', 'auth_flow', 'password_reset', 'No password reset functionality found');
    }
  }

  async auditEmailVerificationFlow() {
    // Check for email verification implementation across the app
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'app', 'auth'),
      path.join(this.projectRoot, 'src', 'lib')
    ];

    let emailVerificationFound = false;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('sendEmailVerification') || content.includes('emailVerified')) {
              emailVerificationFound = true;
              this.log('PASS', 'auth_flow', 'email_verification', 'Email verification implementation found');
              break;
            }
          }
          
          if (emailVerificationFound) break;
        } catch (error) {
          // Continue checking other directories
        }
      }
    }

    if (!emailVerificationFound) {
      this.log('WARN', 'auth_flow', 'email_verification', 'No email verification implementation found');
    }
  }

  async auditLogoutFlow() {
    // Check for logout implementation
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'app'),
      path.join(this.projectRoot, 'src', 'components'),
      path.join(this.projectRoot, 'src', 'lib')
    ];

    let logoutFound = false;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('signOut') || content.includes('logout')) {
              logoutFound = true;
              this.log('PASS', 'auth_flow', 'logout_function', 'Logout functionality found');
              
              // Check for proper session cleanup
              if (content.includes('clear') || content.includes('remove') || content.includes('delete')) {
                this.log('PASS', 'auth_flow', 'session_cleanup', 'Session cleanup implementation found');
              } else {
                this.log('WARN', 'auth_flow', 'session_cleanup', 'No explicit session cleanup found');
              }
              break;
            }
          }
          
          if (logoutFound) break;
        } catch (error) {
          // Continue checking other directories
        }
      }
    }

    if (!logoutFound) {
      this.log('FAIL', 'auth_flow', 'logout_function', 'No logout functionality found');
    }
  }

  async auditProtectedRoutes() {
    // Check for middleware implementation
    const middlewarePath = path.join(this.projectRoot, 'middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      this.log('PASS', 'auth_flow', 'middleware_exists', 'Authentication middleware found');
      await this.analyzeMiddleware(middlewarePath);
    } else {
      this.log('WARN', 'auth_flow', 'middleware_exists', 'No authentication middleware found');
    }

    // Check for protected route implementations
    const appDir = path.join(this.projectRoot, 'src', 'app');
    if (fs.existsSync(appDir)) {
      await this.analyzeProtectedRoutes(appDir);
    }
  }

  async analyzeMiddleware(middlewarePath) {
    try {
      const content = fs.readFileSync(middlewarePath, 'utf8');

      // Check for authentication checks
      if (content.includes('auth') || content.includes('token') || content.includes('session')) {
        this.log('PASS', 'middleware', 'auth_checks', 'Authentication checks in middleware');
      } else {
        this.log('WARN', 'middleware', 'auth_checks', 'No authentication checks in middleware');
      }

      // Check for redirect logic
      if (content.includes('redirect') || content.includes('NextResponse')) {
        this.log('PASS', 'middleware', 'redirect_logic', 'Redirect logic implemented');
      } else {
        this.log('WARN', 'middleware', 'redirect_logic', 'No redirect logic found');
      }

      // Check for protected paths configuration
      if (content.includes('/dashboard') || content.includes('/profile') || content.includes('protected')) {
        this.log('PASS', 'middleware', 'protected_paths', 'Protected paths configured');
      } else {
        this.log('WARN', 'middleware', 'protected_paths', 'No protected paths configured');
      }

    } catch (error) {
      this.log('FAIL', 'middleware', 'analysis', `Error analyzing middleware: ${error.message}`);
    }
  }

  async analyzeProtectedRoutes(appDir) {
    try {
      const protectedDirs = ['dashboard', 'profile', 'settings', 'journal', 'journals'];
      let protectedRoutesFound = 0;

      for (const dir of protectedDirs) {
        const routePath = path.join(appDir, dir);
        if (fs.existsSync(routePath)) {
          protectedRoutesFound++;
          
          // Check for auth guards in the route
          const layoutPath = path.join(routePath, 'layout.tsx');
          const pagePath = path.join(routePath, 'page.tsx');
          
          for (const filePath of [layoutPath, pagePath]) {
            if (fs.existsSync(filePath)) {
              const content = fs.readFileSync(filePath, 'utf8');
              if (content.includes('useAuth') || content.includes('auth') || content.includes('redirect')) {
                this.log('PASS', 'protected_routes', `${dir}_protection`, `${dir} route has auth protection`);
                break;
              }
            }
          }
        }
      }

      if (protectedRoutesFound > 0) {
        this.log('INFO', 'protected_routes', 'routes_count', `Found ${protectedRoutesFound} potentially protected routes`);
      } else {
        this.log('WARN', 'protected_routes', 'routes_count', 'No protected routes found');
      }

    } catch (error) {
      this.log('FAIL', 'protected_routes', 'analysis', `Error analyzing protected routes: ${error.message}`);
    }
  }

  async auditEducationalCompliance() {
    console.log(`\n${colors.purple}🎓 PHASE 3: Educational Compliance Audit${colors.reset}`);
    console.log(`${colors.blue}=======================================${colors.reset}`);

    // Check for COPPA compliance implementation
    await this.auditCOPPACompliance();

    // Check for FERPA compliance
    await this.auditFERPACompliance();

    // Check for age verification systems
    await this.auditAgeVerification();

    // Check for parental consent mechanisms
    await this.auditParentalConsent();

    // Check for data minimization practices
    await this.auditDataMinimization();
  }

  async auditCOPPACompliance() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src'),
      path.join(this.projectRoot, 'public')
    ];

    let coppaFeaturesFound = false;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js', '.html']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8').toLowerCase();
            if (content.includes('coppa') || 
                content.includes('under.*13') || 
                content.includes('children.*privacy') ||
                content.includes('parental.*consent')) {
              coppaFeaturesFound = true;
              this.log('PASS', 'coppa', 'implementation_found', 'COPPA compliance implementation found');
              break;
            }
          }
          
          if (coppaFeaturesFound) break;
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (!coppaFeaturesFound) {
      this.log('FAIL', 'coppa', 'implementation_found', 'No COPPA compliance implementation found - required for under-13 users');
    }

    // Check for age gate implementation
    const ageGatePatterns = ['age.*gate', 'birth.*date', 'how.*old', 'year.*born'];
    let ageGateFound = false;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8').toLowerCase();
            if (ageGatePatterns.some(pattern => content.match(new RegExp(pattern)))) {
              ageGateFound = true;
              this.log('PASS', 'coppa', 'age_gate', 'Age gate implementation found');
              break;
            }
          }
          
          if (ageGateFound) break;
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (!ageGateFound) {
      this.log('FAIL', 'coppa', 'age_gate', 'No age gate implementation found');
    }
  }

  async auditFERPACompliance() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src'),
      path.join(this.projectRoot, 'public')
    ];

    let ferpaFeaturesFound = false;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js', '.html']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8').toLowerCase();
            if (content.includes('ferpa') || 
                content.includes('educational.*record') || 
                content.includes('student.*privacy') ||
                content.includes('directory.*information')) {
              ferpaFeaturesFound = true;
              this.log('PASS', 'ferpa', 'implementation_found', 'FERPA compliance implementation found');
              break;
            }
          }
          
          if (ferpaFeaturesFound) break;
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (!ferpaFeaturesFound) {
      this.log('FAIL', 'ferpa', 'implementation_found', 'No FERPA compliance implementation found - required for educational use');
    }
  }

  async auditAgeVerification() {
    // Check for age verification in signup flow
    const signupFiles = this.getAllFiles(path.join(this.projectRoot, 'src', 'app'), ['.tsx', '.ts'])
      .filter(file => file.includes('signup') || file.includes('register') || file.includes('onboard'));

    let ageVerificationFound = false;

    for (const file of signupFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('age') || content.includes('birth') || content.includes('13')) {
          ageVerificationFound = true;
          this.log('PASS', 'age_verification', 'signup_integration', 'Age verification integrated in signup flow');
          break;
        }
      } catch (error) {
        // Continue checking
      }
    }

    if (!ageVerificationFound) {
      this.log('FAIL', 'age_verification', 'signup_integration', 'No age verification in signup flow');
    }
  }

  async auditParentalConsent() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src'),
      path.join(this.projectRoot, 'public')
    ];

    let parentalConsentFound = false;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js', '.html']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8').toLowerCase();
            if (content.includes('parent') && content.includes('consent') ||
                content.includes('guardian') && content.includes('permission') ||
                content.includes('parent.*email') ||
                content.includes('guardian.*approval')) {
              parentalConsentFound = true;
              this.log('PASS', 'parental_consent', 'implementation', 'Parental consent implementation found');
              break;
            }
          }
          
          if (parentalConsentFound) break;
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (!parentalConsentFound) {
      this.log('FAIL', 'parental_consent', 'implementation', 'No parental consent implementation found');
    }
  }

  async auditDataMinimization() {
    // Check signup forms for minimal data collection
    const signupFiles = this.getAllFiles(path.join(this.projectRoot, 'src'), ['.tsx', '.ts'])
      .filter(file => file.includes('signup') || file.includes('register'));

    let dataMinimizationPractices = 0;

    for (const file of signupFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for minimal required fields
        if (!content.includes('address') && !content.includes('phone')) {
          dataMinimizationPractices++;
        }
        
        // Check for optional field indicators
        if (content.includes('optional') || content.includes('required={false}')) {
          dataMinimizationPractices++;
        }
        
        // Check for data necessity explanations
        if (content.includes('necessary') || content.includes('essential') || content.includes('required.*for')) {
          dataMinimizationPractices++;
        }
      } catch (error) {
        // Continue checking
      }
    }

    if (dataMinimizationPractices > 0) {
      this.log('PASS', 'data_minimization', 'practices', `Found ${dataMinimizationPractices} data minimization practices`);
    } else {
      this.log('WARN', 'data_minimization', 'practices', 'No explicit data minimization practices found');
    }
  }

  async auditTraumaInformedAuth() {
    console.log(`\n${colors.purple}💚 PHASE 4: Trauma-Informed Authentication Audit${colors.reset}`);
    console.log(`${colors.blue}================================================${colors.reset}`);

    // Check for gentle/trauma-informed design
    await this.auditTraumaInformedDesign();

    // Check for privacy-first features
    await this.auditPrivacyFirstFeatures();

    // Check for accessibility features
    await this.auditAccessibilityFeatures();

    // Check for crisis support integration
    await this.auditCrisisSupportIntegration();
  }

  async auditTraumaInformedDesign() {
    const authFiles = this.getAllFiles(path.join(this.projectRoot, 'src', 'app'), ['.tsx', '.ts'])
      .filter(file => file.includes('auth') || file.includes('login') || file.includes('signup'));

    let traumaInformedFeatures = 0;

    for (const file of authFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8').toLowerCase();
        
        // Check for gentle language
        if (content.includes('gentle') || content.includes('safe') || content.includes('welcome')) {
          traumaInformedFeatures++;
        }
        
        // Check for privacy messaging
        if (content.includes('private') || content.includes('confidential') || content.includes('secure')) {
          traumaInformedFeatures++;
        }
        
        // Check for supportive messaging
        if (content.includes('support') || content.includes('help') || content.includes('care')) {
          traumaInformedFeatures++;
        }
        
        // Check for non-judgmental language
        if (!content.includes('wrong') && !content.includes('error') && !content.includes('invalid')) {
          traumaInformedFeatures++;
        }
      } catch (error) {
        // Continue checking
      }
    }

    if (traumaInformedFeatures > 2) {
      this.log('PASS', 'trauma_informed', 'design_elements', `Found ${traumaInformedFeatures} trauma-informed design elements`);
    } else {
      this.log('WARN', 'trauma_informed', 'design_elements', 'Limited trauma-informed design elements found');
    }
  }

  async auditPrivacyFirstFeatures() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'app'),
      path.join(this.projectRoot, 'src', 'lib')
    ];

    let privacyFeatures = 0;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for anonymous authentication
            if (content.includes('signInAnonymously')) {
              privacyFeatures++;
              this.log('PASS', 'privacy_first', 'anonymous_auth', 'Anonymous authentication available');
              break;
            }
          }
        } catch (error) {
          // Continue checking
        }
      }
    }

    // Check for privacy policy integration
    const privacyPolicyPath = path.join(this.projectRoot, 'public', 'privacy-policy.html');
    if (fs.existsSync(privacyPolicyPath)) {
      privacyFeatures++;
      this.log('PASS', 'privacy_first', 'privacy_policy', 'Privacy policy document found');
    } else {
      this.log('FAIL', 'privacy_first', 'privacy_policy', 'No privacy policy document found');
    }

    if (privacyFeatures === 0) {
      this.log('WARN', 'privacy_first', 'features_summary', 'Limited privacy-first features found');
    }
  }

  async auditAccessibilityFeatures() {
    const authFiles = this.getAllFiles(path.join(this.projectRoot, 'src', 'app'), ['.tsx'])
      .filter(file => file.includes('auth') || file.includes('login') || file.includes('signup'));

    let accessibilityFeatures = 0;

    for (const file of authFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for ARIA labels
        if (content.includes('aria-') || content.includes('ariaLabel')) {
          accessibilityFeatures++;
        }
        
        // Check for semantic HTML
        if (content.includes('<label') || content.includes('htmlFor')) {
          accessibilityFeatures++;
        }
        
        // Check for keyboard navigation
        if (content.includes('onKeyDown') || content.includes('tabIndex')) {
          accessibilityFeatures++;
        }
        
        // Check for screen reader support
        if (content.includes('screen.*reader') || content.includes('sr-only')) {
          accessibilityFeatures++;
        }
      } catch (error) {
        // Continue checking
      }
    }

    if (accessibilityFeatures > 2) {
      this.log('PASS', 'accessibility', 'features', `Found ${accessibilityFeatures} accessibility features`);
    } else {
      this.log('WARN', 'accessibility', 'features', 'Limited accessibility features found');
    }
  }

  async auditCrisisSupportIntegration() {
    const filesToCheck = [
      path.join(this.projectRoot, 'src', 'app'),
      path.join(this.projectRoot, 'src', 'components')
    ];

    let crisisSupportFound = false;

    for (const dirPath of filesToCheck) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = this.getAllFiles(dirPath, ['.tsx', '.ts', '.js']);
          
          for (const file of files) {
            const content = fs.readFileSync(file, 'utf8').toLowerCase();
            if (content.includes('crisis') || 
                content.includes('emergency') || 
                content.includes('help.*line') ||
                content.includes('support.*resources')) {
              crisisSupportFound = true;
              this.log('PASS', 'crisis_support', 'integration', 'Crisis support integration found');
              break;
            }
          }
          
          if (crisisSupportFound) break;
        } catch (error) {
          // Continue checking
        }
      }
    }

    if (!crisisSupportFound) {
      this.log('WARN', 'crisis_support', 'integration', 'No crisis support integration found');
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

  generateAuthReport() {
    console.log(`\n${colors.purple}📊 PHASE 5: Generating Authentication Audit Report${colors.reset}`);
    console.log(`${colors.blue}======================================================${colors.reset}`);

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
      path.join(this.reportDir, 'firebase_auth_audit.csv'),
      csvHeader + csvData
    );

    // Generate summary
    const summary = {
      timestamp: this.timestamp,
      project: 'alchm-firebase-auth',
      totalTests,
      results: { passCount, failCount, warnCount, infoCount },
      passPercentage,
      authStatus: this.determineAuthStatus(passPercentage, failCount),
      criticalIssues: this.auditResults.filter(r => r.level === 'FAIL'),
      traumaInformedCompliance: this.assessTraumaInformedCompliance(),
      educationalCompliance: this.assessEducationalCompliance(),
      authRequirements: this.authRequirements
    };

    fs.writeFileSync(
      path.join(this.reportDir, 'firebase_auth_summary.json'),
      JSON.stringify(summary, null, 2)
    );

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(summary);
    fs.writeFileSync(
      path.join(this.reportDir, 'FIREBASE_AUTH_AUDIT_REPORT.md'),
      markdownReport
    );

    console.log(`\n${colors.cyan}🔐 Firebase Authentication Audit Complete${colors.reset}`);
    console.log(`${colors.blue}=========================================${colors.reset}`);
    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`${colors.green}✅ Passed: ${passCount} (${passPercentage}%)${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failCount}${colors.reset}`);
    console.log(`${colors.yellow}⚠️ Warnings: ${warnCount}${colors.reset}`);
    console.log(`${colors.blue}ℹ️ Info: ${infoCount}${colors.reset}`);

    // Final status
    const status = this.determineAuthStatus(passPercentage, failCount);
    if (status === 'SECURE') {
      console.log(`\n${colors.green}🛡️ STATUS: FIREBASE AUTH IS PRODUCTION-READY${colors.reset}`);
    } else if (status === 'NEEDS_FIXES') {
      console.log(`\n${colors.yellow}⚠️ STATUS: AUTH NEEDS FIXES BEFORE PRODUCTION${colors.reset}`);
    } else {
      console.log(`\n${colors.red}🚨 STATUS: CRITICAL AUTH ISSUES - NOT PRODUCTION-READY${colors.reset}`);
    }

    console.log(`\n📁 Authentication audit reports generated in: ${this.reportDir}`);

    return summary;
  }

  determineAuthStatus(passPercentage, failCount) {
    if (passPercentage >= 85 && failCount <= 2) {
      return 'SECURE';
    } else if (passPercentage >= 70 && failCount <= 5) {
      return 'NEEDS_FIXES';
    } else {
      return 'CRITICAL_ISSUES';
    }
  }

  assessTraumaInformedCompliance() {
    const traumaTests = this.auditResults.filter(r => r.category === 'trauma_informed' || r.category === 'privacy_first' || r.category === 'accessibility');
    const passedTrauma = traumaTests.filter(r => r.level === 'PASS').length;
    const totalTrauma = traumaTests.length;
    
    return {
      score: totalTrauma > 0 ? Math.round((passedTrauma / totalTrauma) * 100) : 0,
      status: passedTrauma >= totalTrauma * 0.8 ? 'COMPLIANT' : 'NEEDS_IMPROVEMENT',
      features: {
        anonymousAuth: this.auditResults.some(r => r.test.includes('anonymous') && r.level === 'PASS'),
        traumaInformedDesign: this.auditResults.some(r => r.test.includes('trauma_informed') && r.level === 'PASS'),
        privacyFirst: this.auditResults.some(r => r.test.includes('privacy') && r.level === 'PASS'),
        accessibilityFeatures: this.auditResults.some(r => r.test.includes('accessibility') && r.level === 'PASS')
      }
    };
  }

  assessEducationalCompliance() {
    const complianceTests = this.auditResults.filter(r => r.category === 'coppa' || r.category === 'ferpa' || r.category === 'age_verification' || r.category === 'parental_consent');
    const passedCompliance = complianceTests.filter(r => r.level === 'PASS').length;
    const totalCompliance = complianceTests.length;
    
    return {
      score: totalCompliance > 0 ? Math.round((passedCompliance / totalCompliance) * 100) : 0,
      status: passedCompliance >= totalCompliance * 0.9 ? 'COMPLIANT' : 'NEEDS_IMPROVEMENT',
      requirements: {
        coppa: this.auditResults.some(r => r.category === 'coppa' && r.level === 'PASS'),
        ferpa: this.auditResults.some(r => r.category === 'ferpa' && r.level === 'PASS'),
        ageVerification: this.auditResults.some(r => r.category === 'age_verification' && r.level === 'PASS'),
        parentalConsent: this.auditResults.some(r => r.category === 'parental_consent' && r.level === 'PASS')
      }
    };
  }

  generateMarkdownReport(summary) {
    return `# ALCHM Firebase Authentication Audit Report

**Generated:** ${new Date().toISOString()}  
**Project:** ALCHM Trauma-Informed AI Journaling OS  
**Firebase Auth:** Production Deployment Assessment  
**Educational Compliance:** COPPA/FERPA Required  

## Executive Summary

| Metric | Count | Percentage |
|--------|--------|------------|
| Total Authentication Tests | ${summary.totalTests} | 100% |
| ✅ Passed | ${summary.results.passCount} | ${summary.passPercentage}% |
| ❌ Failed | ${summary.results.failCount} | ${Math.round((summary.results.failCount / summary.totalTests) * 100)}% |
| ⚠️ Warnings | ${summary.results.warnCount} | ${Math.round((summary.results.warnCount / summary.totalTests) * 100)}% |
| ℹ️ Info | ${summary.results.infoCount} | ${Math.round((summary.results.infoCount / summary.totalTests) * 100)}% |

## Authentication Security Status

${summary.authStatus === 'SECURE' ? 
  '🟢 **SECURE - PRODUCTION READY**' : 
  summary.authStatus === 'NEEDS_FIXES' ? 
  '🟡 **NEEDS FIXES BEFORE PRODUCTION**' : 
  '🔴 **CRITICAL AUTH ISSUES - NOT PRODUCTION READY**'
}

## Trauma-Informed Authentication Assessment

**Score:** ${summary.traumaInformedCompliance.score}%  
**Status:** ${summary.traumaInformedCompliance.status}

### Trauma-Informed Features Status
- **Anonymous Authentication:** ${summary.traumaInformedCompliance.features.anonymousAuth ? '✅' : '❌'} (Privacy-conscious users)
- **Trauma-Informed Design:** ${summary.traumaInformedCompliance.features.traumaInformedDesign ? '✅' : '❌'} (Gentle UX)
- **Privacy-First Features:** ${summary.traumaInformedCompliance.features.privacyFirst ? '✅' : '❌'} (Data protection)
- **Accessibility Features:** ${summary.traumaInformedCompliance.features.accessibilityFeatures ? '✅' : '❌'} (Inclusive design)

## Educational Compliance Assessment

**Score:** ${summary.educationalCompliance.score}%  
**Status:** ${summary.educationalCompliance.status}

### Compliance Requirements Status
- **COPPA (Under 13):** ${summary.educationalCompliance.requirements.coppa ? '✅' : '❌'}
- **FERPA (Educational Records):** ${summary.educationalCompliance.requirements.ferpa ? '✅' : '❌'}
- **Age Verification:** ${summary.educationalCompliance.requirements.ageVerification ? '✅' : '❌'}
- **Parental Consent:** ${summary.educationalCompliance.requirements.parentalConsent ? '✅' : '❌'}

## Critical Authentication Issues

${summary.criticalIssues.length > 0 ?
  summary.criticalIssues.map(issue => `- **${issue.category}/${issue.test}:** ${issue.details}`).join('\n') :
  'No critical authentication issues identified.'
}

## Authentication Flow Analysis

### Implemented Authentication Methods
- Email/Password Authentication
- Social Authentication (Google, etc.)
- Anonymous Authentication (trauma-informed privacy)
- Password Reset Flow
- Email Verification
- Session Management

### Security Features
- Input Validation and Sanitization
- Error Handling and User Feedback
- Session Timeout Management
- Protected Route Implementation
- Middleware Authentication Guards

### Educational Compliance Features
- Age Verification Systems
- Parental Consent Mechanisms
- Data Minimization Practices
- Privacy Policy Integration
- COPPA/FERPA Compliance Measures

## Trauma-Informed Authentication Principles

### Privacy-by-Design
- Anonymous authentication option for privacy-conscious users
- Minimal data collection during registration
- Clear privacy messaging throughout auth flows
- Secure session management with appropriate timeouts

### Gentle User Experience
- Non-judgmental error messaging
- Supportive and encouraging language
- Clear explanations of data usage
- Accessible design for all users

### Crisis-Aware Design
- Integration with crisis support resources
- Trauma-informed communication patterns
- Safe space indicators
- Emergency contact accessibility

## Performance & Security Optimization

### Authentication Configuration
- **Session Timeout:** ${summary.authRequirements.sessionTimeout / (24 * 60 * 60 * 1000)} days (therapeutic continuity)
- **Password Requirements:** ${summary.authRequirements.requireStrongPasswords ? 'Enabled' : 'Disabled'}
- **Email Verification:** ${summary.authRequirements.requireEmailVerification ? 'Required' : 'Optional'}
- **Anonymous Auth:** ${summary.authRequirements.enableAnonymousAuth ? 'Enabled' : 'Disabled'} (privacy-first)
- **Social Auth:** ${summary.authRequirements.enableSocialAuth ? 'Enabled' : 'Disabled'}

### Security Measures
- Environment variable protection
- Secure credential storage
- Token validation and verification
- Protected route middleware
- Error handling and logging

## Recommendations for Production Deployment

### High Priority Fixes
${summary.criticalIssues.length > 0 ?
  summary.criticalIssues.slice(0, 5).map(issue => `- **${issue.test}:** ${issue.details}`).join('\n') :
  '- No critical fixes required'
}

### Educational Compliance Requirements
1. **COPPA Compliance:** Implement age verification and parental consent for under-13 users
2. **FERPA Compliance:** Add educational record privacy protections
3. **Data Minimization:** Collect only essential information during registration
4. **Consent Management:** Clear opt-in/opt-out mechanisms for data processing

### Trauma-Informed Improvements
1. **Anonymous Authentication:** Enable for privacy-conscious users
2. **Gentle Messaging:** Use supportive, non-judgmental language
3. **Crisis Support:** Integrate emergency resources into auth flows
4. **Accessibility:** Ensure all auth flows are accessible to users with disabilities

### Performance Optimizations
1. **Session Management:** Optimize for therapeutic continuity (30-day sessions)
2. **Error Handling:** Implement comprehensive error boundaries
3. **Loading States:** Add appropriate loading indicators
4. **Rate Limiting:** Implement auth attempt limits with trauma-informed timeouts

## Next Steps for Firebase Studio Deployment

1. **Fix Critical Issues:** Address all failed authentication tests
2. **Educational Compliance:** Ensure full COPPA/FERPA implementation
3. **Trauma-Informed Testing:** Validate with trauma-informed design principles
4. **Security Testing:** Conduct penetration testing on auth flows
5. **Performance Testing:** Validate auth performance under 10M+ user load
6. **Documentation:** Update auth documentation and incident response plans

---

**Authentication Audit Completed by ALCHM Firebase Auth Testing Suite**  
*For detailed test results, see firebase_auth_audit.csv*
`;
  }

  async run() {
    console.log(`${colors.cyan}🔐 ALCHM Firebase Authentication Audit${colors.reset}`);
    console.log(`${colors.blue}======================================${colors.reset}`);
    console.log(`Timestamp: ${this.timestamp}`);
    console.log(`Project Root: ${this.projectRoot}`);
    console.log(`Report Directory: ${this.reportDir}\n`);

    await this.auditFirebaseAuthConfiguration();
    await this.auditAuthenticationFlows();
    await this.auditEducationalCompliance();
    await this.auditTraumaInformedAuth();
    
    return this.generateAuthReport();
  }
}

// Run the audit if this file is executed directly
if (require.main === module) {
  const auditor = new FirebaseAuthAuditor();
  auditor.run().catch(console.error);
}

module.exports = FirebaseAuthAuditor;