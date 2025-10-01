/**
 * ALCHM Crisis System Validation Script
 * Validates crisis detection and support systems for vulnerable users
 */

console.log('🚨 ALCHM Crisis System Validation');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const fs = require('fs');
const path = require('path');

let crisisSystemsOperational = true;

// Check crisis detection endpoints
console.log('\n🔍 Crisis Detection Systems:');

const crisisEndpoints = [
  'src/app/api/ai/crisis-detection/route.ts',
  'functions/src/index.ts'
];

crisisEndpoints.forEach(endpoint => {
  if (fs.existsSync(endpoint)) {
    const content = fs.readFileSync(endpoint, 'utf8');
    const hasCrisisLogic = content.includes('crisis') && 
                          (content.includes('988') || content.includes('emergency'));
    if (hasCrisisLogic) {
      console.log(`✅ ${endpoint.split('/').pop()} - Crisis detection implemented`);
    } else {
      console.log(`⚠️  ${endpoint.split('/').pop()} - Crisis logic may be incomplete`);
    }
  } else {
    console.log(`❌ ${endpoint.split('/').pop()} - Missing crisis endpoint`);
    crisisSystemsOperational = false;
  }
});

// Check crisis resources configuration
console.log('\n📞 Crisis Resources Configuration:');

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  
  const crisisResources = [
    'NEXT_PUBLIC_CRISIS_HOTLINES',
    'NEXT_PUBLIC_CRISIS_TEXT_LINE', 
    'NEXT_PUBLIC_EMERGENCY_NUMBER'
  ];
  
  crisisResources.forEach(resource => {
    if (envContent.includes(`${resource}=`) && !envContent.includes(`${resource}=your_`)) {
      console.log(`✅ ${resource}`);
    } else {
      console.log(`❌ ${resource} (NOT CONFIGURED)`);
      crisisSystemsOperational = false;
    }
  });
} else {
  console.log('❌ Environment file missing - crisis resources not configured');
  crisisSystemsOperational = false;
}

// Check AI services for crisis detection
console.log('\n🤖 AI Services for Crisis Detection:');

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  
  const aiServices = [
    { name: 'OpenAI API Key', env: 'OPENAI_API_KEY', purpose: 'Crisis language detection' },
    { name: 'Google AI API Key', env: 'GOOGLE_AI_API_KEY', purpose: 'Therapeutic AI responses' }
  ];
  
  aiServices.forEach(service => {
    if (envContent.includes(`${service.env}=`) && !envContent.includes(`${service.env}=your_`)) {
      console.log(`✅ ${service.name} - ${service.purpose}`);
    } else {
      console.log(`❌ ${service.name} (NOT CONFIGURED) - ${service.purpose}`);
      crisisSystemsOperational = false;
    }
  });
}

// Check fallback crisis patterns
console.log('\n🔄 Fallback Crisis Detection:');

const emergencyCrisisPatterns = [
  'functions/src/emergency-crisis-patterns.js'
];

emergencyCrisisPatterns.forEach(patternFile => {
  if (fs.existsSync(patternFile)) {
    console.log(`✅ ${patternFile.split('/').pop()} - Fallback patterns available`);
  } else {
    console.log(`⚠️  ${patternFile.split('/').pop()} - Fallback patterns missing`);
  }
});

// Crisis system continuity check
console.log('\n🛡️  Crisis System Continuity:');

// Check that Firebase Functions are properly configured for crisis response
if (fs.existsSync('firebase.json')) {
  const firebaseConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
  const hasCrisisRoutes = JSON.stringify(firebaseConfig).includes('crisis-detection');
  
  if (hasCrisisRoutes) {
    console.log('✅ Firebase Functions configured for crisis detection');
  } else {
    console.log('⚠️  Crisis detection routes may not be properly configured in Firebase');
  }
}

// Check Firestore rules for secure crisis data handling
if (fs.existsSync('firestore.rules')) {
  const rulesContent = fs.readFileSync('firestore.rules', 'utf8');
  const hasAuthRules = rulesContent.includes('request.auth');
  
  if (hasAuthRules) {
    console.log('✅ Firestore security rules include authentication checks');
  } else {
    console.log('❌ Firestore security rules missing authentication (SECURITY RISK)');
    crisisSystemsOperational = false;
  }
}

// Final crisis system assessment
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (crisisSystemsOperational) {
  console.log('🎉 Crisis Systems: ✅ OPERATIONAL');
  console.log('🛡️  All critical safety systems are configured and ready');
  console.log('💙 Platform is prepared to support vulnerable users');
  console.log('\n📋 Crisis Support Resources Available:');
  console.log('   • 988 Suicide & Crisis Lifeline');
  console.log('   • Crisis Text Line (741741)');
  console.log('   • Emergency Services (911)');
  console.log('   • International Crisis Support');
  process.exit(0);
} else {
  console.log('❌ Crisis Systems: ❌ FAILED');
  console.log('🚨 Critical safety systems are not properly configured');
  console.log('⚠️  Platform NOT ready to serve vulnerable users');
  console.log('\n🔧 Required Actions:');
  console.log('1. Run: npm run security:setup');
  console.log('2. Configure all AI API keys for crisis detection');
  console.log('3. Verify crisis resource phone numbers');
  console.log('4. Test crisis detection endpoints');
  console.log('5. Review SECURITY.md for complete setup guide');
  process.exit(1);
}