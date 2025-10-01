#!/usr/bin/env node

/**
 * ALCHM Sacred Contract Deployment Verification
 * Verifies both Firebase sites serve consistent Sacred Contract styling
 */

const https = require('https');

const sites = [
  'https://alchm-digital-sanctuary.web.app',
  'https://alchmapp.web.app'
];

const requiredStyling = {
  marginTop: '5rem',
  background: 'rgba(164, 183, 146, 0.15)',
  textColor: '#ffffff'
};

function fetchSite(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'User-Agent': 'ALCHM-Deployment-Verifier/1.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

async function verifySacredContract() {
  console.log('🔍 ALCHM Sacred Contract Deployment Verification');
  console.log('=' .repeat(60));
  
  for (const site of sites) {
    try {
      console.log(`\n📍 Testing: ${site}`);
      const html = await fetchSite(site);
      
      // Check for cache version
      const cacheVersionMatch = html.match(/cache-version["\s]*content["\s]*=["\s]*([^"]+)/);
      if (cacheVersionMatch) {
        console.log(`✅ Cache Version: ${cacheVersionMatch[1]}`);
      } else {
        console.log('⚠️  No cache version found');
      }
      
      // Check for Sacred Contract styling
      const contractStyleMatch = html.match(/\.contract[^}]*margin-top:\s*5rem[^}]*rgba\(164,\s*183,\s*146,\s*0\.15\)[^}]*#ffffff/);
      if (contractStyleMatch) {
        console.log('✅ Sacred Contract styling: CORRECT');
      } else {
        console.log('❌ Sacred Contract styling: INCORRECT or MISSING');
      }
      
      // Check for emergency cache bust
      const emergencyBustMatch = html.match(/ALCHM Emergency Cache Bust v2\.3/);
      if (emergencyBustMatch) {
        console.log('✅ Emergency cache bust: ACTIVE');
      } else {
        console.log('⚠️  Emergency cache bust: INACTIVE');
      }
      
      // Check for Sacred Contract content
      const contractContentMatch = html.match(/This is your sacred contract/i);
      if (contractContentMatch) {
        console.log('✅ Sacred Contract content: PRESENT');
      } else {
        console.log('❌ Sacred Contract content: MISSING');
      }
      
    } catch (error) {
      console.log(`❌ Error testing ${site}: ${error.message}`);
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 Verification Complete');
  console.log('📝 Both sites should show identical Sacred Contract styling');
  console.log('   - 5rem margin-top');
  console.log('   - rgba(164, 183, 146, 0.15) sage green background');
  console.log('   - #ffffff white text');
}

if (require.main === module) {
  verifySacredContract().catch(console.error);
}

module.exports = { verifySacredContract };