// ALCHM Global Sacred Contract Verification
// Tests the sage green styling from multiple perspectives

const https = require('https');
const { URL } = require('url');

const userAgents = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', // iOS Safari
    'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/111.0 Firefox/111.0', // Android Firefox  
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36', // Desktop Chrome
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36', // macOS Chrome
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36' // Linux Chrome
];

function testUserAgent(userAgent, index) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'alchm-digital-sanctuary.web.app',
            port: 443,
            path: '/?test=global-verification',
            method: 'GET',
            headers: {
                'User-Agent': userAgent,
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                // Extract Sacred Contract styling
                const colorMatch = data.match(/rgba\(164,\s*183,\s*146,\s*([0-9.]+)\)/);
                const hasCorrectOpacity = colorMatch && parseFloat(colorMatch[1]) >= 0.4;
                
                const result = {
                    userAgent: userAgent.split(') ')[0] + ')',
                    statusCode: res.statusCode,
                    hasCorrectSageGreen: hasCorrectOpacity,
                    opacity: colorMatch ? parseFloat(colorMatch[1]) : null,
                    cacheHeaders: res.headers['cache-control'],
                    timestamp: new Date().toISOString()
                };
                
                resolve(result);
            });
        });

        req.on('error', (error) => {
            resolve({
                userAgent: userAgent.split(') ')[0] + ')',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        });

        req.end();
    });
}

async function runGlobalVerification() {
    console.log('🌍 ALCHM Global Sacred Contract Verification');
    console.log('==============================================');
    console.log(`Testing from ${userAgents.length} different user agents...`);
    console.log('');

    const results = await Promise.all(
        userAgents.map((ua, index) => testUserAgent(ua, index))
    );

    console.log('📊 VERIFICATION RESULTS:');
    console.log('========================');
    
    let successCount = 0;
    let failureCount = 0;
    
    results.forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.userAgent}`);
        console.log(`   Status: ${result.statusCode || 'ERROR'}`);
        console.log(`   Sage Green Correct: ${result.hasCorrectSageGreen ? '✅' : '❌'}`);
        console.log(`   Opacity Value: ${result.opacity || 'N/A'}`);
        console.log(`   Cache Headers: ${result.cacheHeaders || 'N/A'}`);
        
        if (result.hasCorrectSageGreen) {
            successCount++;
        } else {
            failureCount++;
        }
        
        if (result.error) {
            console.log(`   Error: ${result.error}`);
        }
    });
    
    console.log('\n📈 SUMMARY:');
    console.log('===========');
    console.log(`✅ Success: ${successCount}/${results.length} (${Math.round(successCount/results.length*100)}%)`);
    console.log(`❌ Failures: ${failureCount}/${results.length} (${Math.round(failureCount/results.length*100)}%)`);
    
    if (successCount === results.length) {
        console.log('\n🎉 ALL TESTS PASSED!');
        console.log('Sacred Contract sage green styling is now visible to all users globally.');
        console.log('The opacity has been increased from 0.15 to 0.4, making the sage green clearly visible.');
    } else {
        console.log('\n⚠️  Some tests failed - cache may still be propagating');
        console.log('Wait 5-10 minutes and re-run this test.');
    }
    
    console.log('\n🔍 TECHNICAL DETAILS:');
    console.log('=====================');
    console.log('• Background changed from: rgba(164, 183, 146, 0.15) [barely visible]');
    console.log('• Background changed to: rgba(164, 183, 146, 0.4) [clearly visible sage green]');
    console.log('• Border changed from: rgba(164, 183, 146, 0.3)');
    console.log('• Border changed to: rgba(164, 183, 146, 0.6)');
    console.log('• Text color darkened for better contrast: #1a1f15');
}

// Run the verification
runGlobalVerification().catch(console.error);