const https = require('https');

const routes = [
  'https://alchmapp.web.app/',
  'https://alchmapp.web.app/dashboard',
  'https://alchmapp.web.app/journal',
  'https://alchmapp.web.app/journals',
  'https://alchmapp.web.app/auth/login',
  'https://alchmapp.web.app/auth/signup',
  'https://alchmapp.web.app/pricing',
  'https://alchmapp.web.app/api/crisis-detection/',
  'https://alchmapp.web.app/api/khepera/'
];

async function testRoute(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      const statusCode = response.statusCode;
      const contentType = response.headers['content-type'] || '';
      
      let body = '';
      response.on('data', chunk => body += chunk);
      response.on('end', () => {
        resolve({
          url,
          status: statusCode,
          contentType,
          isHTML: contentType.includes('text/html'),
          isJSON: contentType.includes('application/json'),
          size: body.length,
          working: statusCode >= 200 && statusCode < 400
        });
      });
    });
    
    request.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        error: error.message,
        working: false
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        working: false
      });
    });
  });
}

async function testAllRoutes() {
  console.log('ALCHM Route Testing Report');
  console.log('=' .repeat(50));
  
  for (const route of routes) {
    const result = await testRoute(route);
    const status = result.working ? '✅' : '❌';
    console.log(`${status} ${result.url}`);
    console.log(`   Status: ${result.status}`);
    if (result.contentType) {
      console.log(`   Type: ${result.contentType}`);
    }
    if (result.size) {
      console.log(`   Size: ${result.size} bytes`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  }
}

testAllRoutes().catch(console.error);
