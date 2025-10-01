const https = require('https');

const mobileTests = [
  {
    name: 'Mobile Meta Tags',
    url: 'https://alchmapp.web.app/dashboard',
    check: (html) => {
      return html.includes('viewport') && 
             html.includes('minimum-scale=1') &&
             html.includes('user-scalable=yes');
    }
  },
  {
    name: 'Touch-Safe Navigation',
    url: 'https://alchmapp.web.app/journal',
    check: (html) => {
      return html.includes('touch-safe') || 
             html.includes('touch-target') ||
             html.includes('min-h-\\[52px\\]');
    }
  },
  {
    name: 'Crisis Button Accessibility',
    url: 'https://alchmapp.web.app/dashboard',
    check: (html) => {
      return html.includes('crisis') && 
             html.includes('988') &&
             (html.includes('tel:988') || html.includes('href="tel:988"'));
    }
  },
  {
    name: 'Mobile CSS Loading',
    url: 'https://alchmapp.web.app/dashboard',
    check: (html) => {
      return html.includes('mobile-trauma-informed.css') ||
             html.includes('trauma-informed-animations.css') ||
             html.includes('mobile-sage');
    }
  }
];

async function testMobileFeature(test) {
  return new Promise((resolve) => {
    const request = https.get(test.url, (response) => {
      let html = '';
      response.on('data', chunk => html += chunk);
      response.on('end', () => {
        const passed = test.check(html);
        resolve({
          name: test.name,
          url: test.url,
          passed,
          status: response.statusCode,
          hasContent: html.length > 1000,
          details: passed ? 'Feature detected' : 'Feature not found in HTML'
        });
      });
    });
    
    request.on('error', (error) => {
      resolve({
        name: test.name,
        url: test.url,
        passed: false,
        error: error.message
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        name: test.name,
        url: test.url,
        passed: false,
        error: 'Request timeout'
      });
    });
  });
}

async function testMobileInterface() {
  console.log('ALCHM Mobile Interface Test');
  console.log('=' .repeat(40));
  
  for (const test of mobileTests) {
    const result = await testMobileFeature(test);
    const status = result.passed ? '✅' : '❌';
    
    console.log(`${status} ${result.name}`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Status: ${result.status || 'ERROR'}`);
    console.log(`   Details: ${result.details || result.error || 'No details'}`);
    console.log('');
  }
}

testMobileInterface().catch(console.error);
