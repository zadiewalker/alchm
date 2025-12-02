// Environment audit script for production readiness
// Run with: node scripts/env-audit.js

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const optionalEnvVars = [
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'ANTHROPIC_API_KEY',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_SENTRY_DSN',
  'NEXT_PUBLIC_MIXPANEL_TOKEN',
];

function auditEnvironment() {
  console.log('🔍 ALCHM Environment Audit');
  console.log('=' .repeat(50));
  
  // Load environment from .env.local if it exists
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (e) {
    console.log('ℹ️  dotenv not available, checking process.env directly');
  }
  
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  const optionalMissing = optionalEnvVars.filter(key => !process.env[key]);
  const present = requiredEnvVars.filter(key => !!process.env[key]);
  
  console.log('\n✅ Required variables present:', present.length + '/' + requiredEnvVars.length);
  present.forEach(key => console.log(`   ✓ ${key}`));
  
  if (missing.length > 0) {
    console.log('\n❌ Required variables missing:', missing.length);
    missing.forEach(key => console.log(`   ✗ ${key}`));
  }
  
  if (optionalMissing.length > 0) {
    console.log('\n⚠️  Optional variables missing:', optionalMissing.length);
    optionalMissing.forEach(key => console.log(`   - ${key}`));
  }
  
  // Check Firebase configuration validity
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.log('\n🔧 Firebase Configuration:');
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    console.log(`   Project ID: ${projectId}`);
    
    const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    if (authDomain) {
      console.log(`   Auth Domain: ${authDomain}`);
    }
  }
  
  // Environment status
  const status = missing.length === 0 ? 'READY' : 'NOT READY';
  const icon = missing.length === 0 ? '🟢' : '🔴';
  
  console.log('\n' + '='.repeat(50));
  console.log(`${icon} Production readiness: ${status}`);
  
  if (missing.length > 0) {
    console.log('\n💡 Next steps:');
    console.log('   1. Add missing environment variables to .env.local');
    console.log('   2. Get Firebase configuration from Firebase Console');
    console.log('   3. Set up Anthropic API key for AI features');
    console.log('   4. Run this audit again');
  }
  
  return {
    status: missing.length === 0 ? 'ready' : 'not-ready',
    missing,
    present,
    optional: optionalMissing
  };
}

if (require.main === module) {
  auditEnvironment();
}

module.exports = { auditEnvironment };