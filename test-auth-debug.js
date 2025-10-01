#!/usr/bin/env node

/**
 * ALCHM Authentication Debug Test
 * Quick test to identify authentication flow issues
 */

const https = require('https');
const fs = require('fs');

async function testAuthFlow() {
  console.log('🔍 ALCHM Authentication Debug Test');
  console.log('=====================================\n');

  // Test 1: Environment Variables
  console.log('1️⃣ Testing Environment Variables...');
  
  const envFile = '.env.local';
  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf8');
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY'
    ];
    
    let missingVars = [];
    requiredVars.forEach(varName => {
      if (!envContent.includes(varName + '=')) {
        missingVars.push(varName);
      }
    });
    
    if (missingVars.length === 0) {
      console.log('✅ All required Firebase environment variables are present');
    } else {
      console.log('❌ Missing environment variables:', missingVars.join(', '));
    }
  } else {
    console.log('❌ .env.local file not found');
  }

  // Test 2: Local development server
  console.log('\n2️⃣ Testing Local Development Server...');
  
  try {
    const response = await fetch('http://localhost:3001/auth/login');
    if (response.ok) {
      console.log('✅ Login page accessible at http://localhost:3001/auth/login');
    } else {
      console.log('❌ Login page returned status:', response.status);
    }
  } catch (error) {
    console.log('❌ Could not access login page:', error.message);
  }

  // Test 3: API endpoints
  console.log('\n3️⃣ Testing API Endpoints...');
  
  const apiEndpoints = [
    '/api/auth/session',
    '/api/health/ping'
  ];
  
  for (const endpoint of apiEndpoints) {
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'GET'
      });
      
      if (endpoint === '/api/auth/session') {
        // This should return 401 for unauthenticated requests
        if (response.status === 401) {
          console.log(`✅ ${endpoint} - Properly rejecting unauthenticated requests`);
        } else {
          console.log(`⚠️ ${endpoint} - Unexpected status: ${response.status}`);
        }
      } else {
        if (response.ok) {
          console.log(`✅ ${endpoint} - Accessible`);
        } else {
          console.log(`❌ ${endpoint} - Status: ${response.status}`);
        }
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }

  // Test 4: Firebase config validation
  console.log('\n4️⃣ Testing Firebase Configuration...');
  
  try {
    const configResponse = await fetch('http://localhost:3001/api/health/ping');
    if (configResponse.ok) {
      console.log('✅ Basic server connectivity works');
    }
  } catch (error) {
    console.log('❌ Server connectivity issue:', error.message);
  }

  // Test 5: Check for missing dependencies
  console.log('\n5️⃣ Checking Dependencies...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    'firebase',
    'firebase-admin',
    'next',
    'react'
  ];
  
  let missingDeps = [];
  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      missingDeps.push(dep);
    }
  });
  
  if (missingDeps.length === 0) {
    console.log('✅ All required dependencies are present');
  } else {
    console.log('❌ Missing dependencies:', missingDeps.join(', '));
  }

  console.log('\n📋 Debug Test Complete');
  console.log('=====================================');
  console.log('If you see any ❌ errors above, these need to be fixed for authentication to work properly.');
}

// Only run if this file is executed directly
if (require.main === module) {
  testAuthFlow().catch(console.error);
}

module.exports = { testAuthFlow };