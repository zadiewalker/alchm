const https = require('https');

const apiTests = [
  {
    name: 'Crisis Detection GET',
    url: 'https://alchmapp.web.app/api/crisis-detection/',
    method: 'GET'
  },
  {
    name: 'Crisis Detection POST',
    url: 'https://alchmapp.web.app/api/crisis-detection/',
    method: 'POST',
    data: JSON.stringify({
      content: 'I want to kill myself',
      userId: 'test-user'
    })
  },
  {
    name: 'Khepera AI',
    url: 'https://alchmapp.web.app/api/khepera/',
    method: 'GET'
  },
  {
    name: 'Journal Save',
    url: 'https://alchmapp.web.app/api/journal/save',
    method: 'GET'
  },
  {
    name: 'Journal List',
    url: 'https://alchmapp.web.app/api/journal/list',
    method: 'GET'
  }
];

async function testAPI(test) {
  return new Promise((resolve) => {
    const url = new URL(test.url);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ALCHM-Test/1.0'
      }
    };

    if (test.data) {
      options.headers['Content-Length'] = Buffer.byteLength(test.data);
    }

    const request = https.request(options, (response) => {
      let body = '';
      response.on('data', chunk => body += chunk);
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({
            test: test.name,
            status: response.statusCode,
            success: response.statusCode >= 200 && response.statusCode < 400,
            data: jsonData,
            error: null
          });
        } catch (e) {
          resolve({
            test: test.name,
            status: response.statusCode,
            success: response.statusCode >= 200 && response.statusCode < 400,
            data: body.substring(0, 200) + '...',
            error: 'Invalid JSON response'
          });
        }
      });
    });

    request.on('error', (error) => {
      resolve({
        test: test.name,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    });

    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        test: test.name,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });

    if (test.data) {
      request.write(test.data);
    }
    
    request.end();
  });
}

async function testAllAPIs() {
  console.log('ALCHM API Endpoint Testing Report');
  console.log('=' .repeat(50));
  
  for (const test of apiTests) {
    const result = await testAPI(test);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.test}`);
    console.log(`   Status: ${result.status}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    if (result.data && typeof result.data === 'object') {
      console.log(`   Response: ${JSON.stringify(result.data, null, 2)}`);
    } else if (result.data) {
      console.log(`   Response: ${result.data}`);
    }
    console.log('');
  }
}

testAllAPIs().catch(console.error);
