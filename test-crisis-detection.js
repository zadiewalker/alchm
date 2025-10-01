const https = require('https');

const crisisTests = [
  {
    name: 'High Severity Crisis',
    content: 'I want to kill myself and end it all',
    expectedLevel: 'high'
  },
  {
    name: 'Medium Severity Crisis',
    content: 'I want to hurt myself because I hate myself',
    expectedLevel: 'medium'
  },
  {
    name: 'Low Severity Crisis',
    content: 'I feel depressed and hopeless all the time',
    expectedLevel: 'low'
  },
  {
    name: 'No Crisis',
    content: 'I had a good day today and feel grateful',
    expectedLevel: 'none'
  },
  {
    name: 'Cultural Context Spanish',
    content: 'Quiero morirme y acabar con todo',
    expectedLevel: 'high',
    culturalContext: 'es'
  }
];

async function testCrisisDetection(test) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      content: test.content,
      userId: 'test-user-' + Date.now(),
      culturalContext: test.culturalContext
    });

    const options = {
      hostname: 'alchmapp.web.app',
      port: 443,
      path: '/api/crisis-detection/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const request = https.request(options, (response) => {
      let body = '';
      response.on('data', chunk => body += chunk);
      response.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({
            test: test.name,
            input: test.content,
            expected: test.expectedLevel,
            actual: result.level,
            detected: result.crisisDetected,
            confidence: result.confidence,
            resources: !!result.resources,
            universalAccess: result.universalAccess,
            paymentIndependent: result.paymentIndependent,
            processingTime: result.processingTime,
            success: response.statusCode === 200,
            correct: result.level === test.expectedLevel
          });
        } catch (e) {
          resolve({
            test: test.name,
            error: 'Invalid JSON response',
            success: false,
            correct: false
          });
        }
      });
    });

    request.on('error', (error) => {
      resolve({
        test: test.name,
        error: error.message,
        success: false,
        correct: false
      });
    });

    request.write(data);
    request.end();
  });
}

async function testAllCrisisScenarios() {
  console.log('ALCHM Crisis Detection System Test');
  console.log('=' .repeat(50));
  
  for (const test of crisisTests) {
    const result = await testCrisisDetection(test);
    const status = result.success && result.correct ? '✅' : '❌';
    
    console.log(`${status} ${result.test}`);
    console.log(`   Input: "${result.input?.substring(0, 50)}..."`);
    console.log(`   Expected: ${result.expected} | Actual: ${result.actual || 'N/A'}`);
    
    if (result.detected !== undefined) {
      console.log(`   Detected: ${result.detected}`);
      console.log(`   Confidence: ${result.confidence || 'N/A'}`);
      console.log(`   Resources: ${result.resources ? 'Provided' : 'None'}`);
      console.log(`   Universal Access: ${result.universalAccess}`);
      console.log(`   Payment Independent: ${result.paymentIndependent}`);
      console.log(`   Processing Time: ${result.processingTime}ms`);
    }
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  }
}

testAllCrisisScenarios().catch(console.error);
