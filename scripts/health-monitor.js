// ALCHM Health Monitor - Continuous system monitoring
const https = require('https');
const fs = require('fs');

const ENDPOINTS = [
  'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net/crisisDetection',
  'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net/healthCheck',
  'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net/emergencyResources'
];

async function checkEndpoint(url) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = https.get(url, (res) => {
      const responseTime = Date.now() - start;
      resolve({
        url,
        status: res.statusCode,
        responseTime,
        healthy: res.statusCode === 200 && responseTime < 5000
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        responseTime: Date.now() - start,
        healthy: false,
        error: error.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        responseTime: 10000,
        healthy: false,
        error: 'Request timeout'
      });
    });
  });
}

async function runHealthCheck() {
  console.log('🏥 Running ALCHM Health Check...');
  
  const results = await Promise.all(ENDPOINTS.map(checkEndpoint));
  
  const healthyCount = results.filter(r => r.healthy).length;
  const allHealthy = healthyCount === results.length;
  
  console.log(`Health Status: ${healthyCount}/${results.length} endpoints healthy`);
  
  results.forEach(result => {
    const status = result.healthy ? '✅' : '❌';
    console.log(`${status} ${result.url} - ${result.status} (${result.responseTime}ms)`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  if (!allHealthy) {
    console.error('🚨 SYSTEM HEALTH ISSUE DETECTED');
    // In production, this would send alerts
  }
  
  return allHealthy;
}

if (require.main === module) {
  runHealthCheck().catch(console.error);
}

module.exports = { runHealthCheck };
