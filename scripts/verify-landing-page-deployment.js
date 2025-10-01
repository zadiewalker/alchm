#!/usr/bin/env node

/**
 * ALCHM Landing Page Deployment Verification Script
 * Comprehensive testing to ensure the new redesigned landing page is live
 */

const https = require('https');
const http = require('http');

console.log('🚀 ALCHM Landing Page Deployment Verification');
console.log('==============================================\n');

// Test configuration
const tests = [
  {
    name: 'Primary Site Content',
    url: 'https://alchmapp.web.app',
    expectedContent: ['The World\'s First Identity OS', 'Your private sanctuary', 'ALCHM', 'Start Your Journey'],
    expectedStatus: 200
  },
  {
    name: 'Redirect Site',
    url: 'https://alchm-digital-sanctuary.web.app',
    expectedStatus: 301,
    expectedHeaders: { location: 'https://alchmapp.web.app' }
  },
  {
    name: 'Cache Refresh Helper',
    url: 'https://alchmapp.web.app/cache-refresh.html',
    expectedContent: ['serviceWorker', 'localStorage.clear'],
    expectedStatus: 200
  }
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'ALCHM-Deployment-Verifier/1.0',
        'Cache-Control': 'no-cache'
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runTest(test) {
  console.log(`🔍 Testing: ${test.name}`);
  console.log(`   URL: ${test.url}`);
  
  try {
    const response = await makeRequest(test.url);
    
    // Check status code
    if (response.statusCode === test.expectedStatus) {
      console.log(`   ✅ Status: ${response.statusCode} (expected)`);
    } else {
      console.log(`   ❌ Status: ${response.statusCode} (expected ${test.expectedStatus})`);
      return false;
    }
    
    // Check headers if specified
    if (test.expectedHeaders) {
      for (const [key, expectedValue] of Object.entries(test.expectedHeaders)) {
        const actualValue = response.headers[key.toLowerCase()];
        if (actualValue === expectedValue) {
          console.log(`   ✅ Header ${key}: ${actualValue}`);
        } else {
          console.log(`   ❌ Header ${key}: ${actualValue} (expected ${expectedValue})`);
          return false;
        }
      }
    }
    
    // Check content if specified
    if (test.expectedContent) {
      let contentScore = 0;
      for (const content of test.expectedContent) {
        if (response.body.includes(content)) {
          console.log(`   ✅ Content found: "${content}"`);
          contentScore++;
        } else {
          console.log(`   ❌ Content missing: "${content}"`);
        }
      }
      
      if (contentScore === test.expectedContent.length) {
        console.log(`   ✅ All expected content found (${contentScore}/${test.expectedContent.length})`);
      } else {
        console.log(`   ⚠️  Partial content found (${contentScore}/${test.expectedContent.length})`);
        return false;
      }
    }
    
    console.log(`   🎉 Test passed!\n`);
    return true;
    
  } catch (error) {
    console.log(`   ❌ Test failed: ${error.message}\n`);
    return false;
  }
}

async function runAllTests() {
  let passedTests = 0;
  
  for (const test of tests) {
    const result = await runTest(test);
    if (result) passedTests++;
  }
  
  console.log('📊 RESULTS');
  console.log('==========');
  console.log(`Passed: ${passedTests}/${tests.length} tests`);
  
  if (passedTests === tests.length) {
    console.log('🎉 All tests passed! The new landing page is live and working correctly.');
    console.log('\nIf users are still seeing the old version, they should:');
    console.log('1. Hard refresh their browser (Ctrl+F5 or Cmd+Shift+R)');
    console.log('2. Clear their browser cache');
    console.log('3. Try incognito/private browsing mode');
    console.log('4. Visit https://alchmapp.web.app/cache-refresh.html to force refresh');
  } else {
    console.log('❌ Some tests failed. Check the output above for details.');
    process.exit(1);
  }
}

// Additional timestamp check
console.log(`🕐 Test started at: ${new Date().toISOString()}`);
console.log(`🌍 Testing from: ${process.env.USER || 'Unknown'}@${require('os').hostname()}\n`);

runAllTests().catch(console.error);