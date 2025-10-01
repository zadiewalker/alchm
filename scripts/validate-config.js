/**
 * ALCHM Configuration Validation Script
 * Validates environment configuration for secure deployment
 */

console.log('🔧 ALCHM Configuration Validation');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Check for required environment files
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  '.env.local',
  'src/lib/config.ts',
  'firebase.json',
  'firestore.rules'
];

let allFilesPresent = true;

console.log('\n📁 Required Files Check:');
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} (MISSING)`);
    allFilesPresent = false;
  }
});

// Check environment variables
console.log('\n🔐 Environment Variables Check:');

const criticalEnvVars = [
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'STRIPE_SECRET_KEY',
  'GOOGLE_AI_API_KEY',
  'OPENAI_API_KEY',
  'NEXTAUTH_SECRET'
];

let allEnvVarsPresent = true;

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  
  criticalEnvVars.forEach(envVar => {
    if (envContent.includes(`${envVar}=`) && !envContent.includes(`${envVar}=your_`)) {
      console.log(`✅ ${envVar}`);
    } else {
      console.log(`❌ ${envVar} (NOT CONFIGURED)`);
      allEnvVarsPresent = false;
    }
  });
} else {
  console.log('❌ .env.local file missing');
  allEnvVarsPresent = false;
}

// Security checks
console.log('\n🛡️  Security Validation:');

// Check if .env.local is in .gitignore
if (fs.existsSync('.gitignore')) {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  if (gitignoreContent.includes('.env.local')) {
    console.log('✅ .env.local is properly ignored by git');
  } else {
    console.log('❌ .env.local not in .gitignore (SECURITY RISK)');
    allEnvVarsPresent = false;
  }
} else {
  console.log('⚠️  .gitignore file not found');
}

// Final result
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (allFilesPresent && allEnvVarsPresent) {
  console.log('🎉 Configuration validation PASSED');
  console.log('✅ All critical components are properly configured');
  process.exit(0);
} else {
  console.log('❌ Configuration validation FAILED');
  console.log('🚨 Critical issues must be resolved before deployment');
  console.log('\nNext steps:');
  console.log('1. Run: npm run security:setup');
  console.log('2. Follow the security documentation in SECURITY.md');
  process.exit(1);
}