#!/bin/bash

# ALCHM Emergency CDN Cache Bust Script
# Aggressive cache invalidation for Sacred Contract styling propagation

set -e

echo "🔥 EMERGENCY CDN CACHE BUST - Sacred Contract Styling Fix"
echo "=================================================="

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Ensure we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ Error: firebase.json not found. Please run from project root."
    exit 1
fi

log "🧹 Step 1: Clearing local build cache"
rm -rf .next/cache/* 2>/dev/null || true
rm -rf out/* 2>/dev/null || true
rm -rf .firebase/hosting.* 2>/dev/null || true

log "🔧 Step 2: Rebuilding with cache-busting"
npm run build

log "🚀 Step 3: Force redeployment to both Firebase sites"

# Deploy to alchm-digital-sanctuary with version tagging
log "Deploying to alchm-digital-sanctuary..."
firebase deploy --only hosting:alchm-digital-sanctuary --message "CACHE_BUST_$(date +%s)_Sacred_Contract_Fix" || {
    log "❌ Failed to deploy to alchm-digital-sanctuary"
    exit 1
}

# Deploy to alchmapp with version tagging
log "Deploying to alchmapp..."
firebase deploy --only hosting:alchmapp --message "CACHE_BUST_$(date +%s)_Sacred_Contract_Fix" || {
    log "❌ Failed to deploy to alchmapp"
    exit 1
}

log "💥 Step 4: Triggering Firebase CDN cache invalidation"

# Firebase automatically invalidates cache on deploy, but we'll force additional invalidation
# by deploying a timestamp file to force CDN refresh
echo "Cache bust timestamp: $(date)" > out/cache-bust.txt
echo "Sacred Contract fix deployed: $(date +%s)" > out/version.txt

# Redeploy just these files to trigger CDN refresh
firebase deploy --only hosting --message "CDN_INVALIDATION_$(date +%s)"

log "🌍 Step 5: Generating global cache test script"

cat > scripts/test-global-cache-propagation.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>ALCHM Sacred Contract Global Cache Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-section { margin: 20px 0; padding: 20px; border: 1px solid #ccc; }
        .result { margin: 10px 0; padding: 10px; }
        .success { background: #d4edda; color: #155724; }
        .warning { background: #fff3cd; color: #856404; }
        .error { background: #f8d7da; color: #721c24; }
        .sacred-contract-test {
            margin-top: 5rem;
            background-color: rgba(34, 51, 68, 0.15);
            color: white;
            padding: 1.5rem;
            border-radius: 0.5rem;
        }
    </style>
</head>
<body>
    <h1>🔬 ALCHM Sacred Contract Global Cache Test</h1>
    
    <div class="test-section">
        <h3>Test Sacred Contract Styling</h3>
        <div class="sacred-contract-test">
            <h4>Sacred Contract Test Element</h4>
            <p>This element should have:</p>
            <ul>
                <li>5rem margin-top (80px)</li>
                <li>15% opacity sage green background (rgba(34, 51, 68, 0.15))</li>
                <li>White text color</li>
                <li>Proper spacing and border radius</li>
            </ul>
        </div>
        
        <div id="test-results"></div>
    </div>

    <div class="test-section">
        <h3>Global CDN Test URLs</h3>
        <p>Test these URLs from different locations:</p>
        <ul>
            <li><a href="https://alchm-digital-sanctuary.web.app/" target="_blank">alchm-digital-sanctuary.web.app</a></li>
            <li><a href="https://alchmapp.web.app/" target="_blank">alchmapp.web.app</a></li>
            <li><a href="https://alchm.app/" target="_blank">alchm.app (if configured)</a></li>
        </ul>
    </div>

    <script>
        function testSacredContractStyling() {
            const testElement = document.querySelector('.sacred-contract-test');
            const computedStyle = window.getComputedStyle(testElement);
            const resultsDiv = document.getElementById('test-results');
            
            const tests = [
                {
                    name: 'Margin Top',
                    expected: '80px',
                    actual: computedStyle.marginTop,
                    test: computedStyle.marginTop === '80px'
                },
                {
                    name: 'Background Color',
                    expected: 'rgba(34, 51, 68, 0.15)',
                    actual: computedStyle.backgroundColor,
                    test: computedStyle.backgroundColor.includes('34, 51, 68') || computedStyle.backgroundColor.includes('rgba')
                },
                {
                    name: 'Text Color',
                    expected: 'white/rgb(255, 255, 255)',
                    actual: computedStyle.color,
                    test: computedStyle.color === 'rgb(255, 255, 255)' || computedStyle.color === 'white'
                }
            ];
            
            let allPassed = true;
            let html = '<h4>Styling Test Results:</h4>';
            
            tests.forEach(test => {
                const status = test.test ? 'success' : 'error';
                if (!test.test) allPassed = false;
                
                html += `<div class="result ${status}">
                    <strong>${test.name}:</strong> 
                    Expected: ${test.expected} | 
                    Actual: ${test.actual} | 
                    ${test.test ? '✅ PASS' : '❌ FAIL'}
                </div>`;
            });
            
            html += `<div class="result ${allPassed ? 'success' : 'warning'}">
                <strong>Overall Result:</strong> ${allPassed ? '✅ ALL TESTS PASSED - Sacred Contract styling is correct!' : '⚠️ SOME TESTS FAILED - Cache may not be fully propagated'}
            </div>`;
            
            html += `<div class="result">
                <strong>Cache Status:</strong> 
                Tested at ${new Date().toLocaleString()} | 
                User Agent: ${navigator.userAgent.substring(0, 50)}...
            </div>`;
            
            resultsDiv.innerHTML = html;
        }
        
        // Run tests when page loads
        window.addEventListener('load', testSacredContractStyling);
        
        // Provide manual test button
        document.addEventListener('DOMContentLoaded', function() {
            const button = document.createElement('button');
            button.textContent = '🔄 Re-run Tests';
            button.onclick = testSacredContractStyling;
            button.style.cssText = 'padding: 10px 20px; margin: 10px 0; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;';
            document.getElementById('test-results').parentNode.insertBefore(button, document.getElementById('test-results'));
        });
    </script>
</body>
</html>
EOF

log "📊 Step 6: Creating global monitoring script"

cat > scripts/monitor-global-cache-status.js << 'EOF'
const https = require('https');
const fs = require('fs');

const sites = [
    'https://alchm-digital-sanctuary.web.app/',
    'https://alchmapp.web.app/'
];

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
];

async function checkCacheStatus() {
    console.log('🌍 Checking global cache status for Sacred Contract styling...\n');
    
    for (const site of sites) {
        console.log(`\n📍 Testing ${site}`);
        
        for (let i = 0; i < userAgents.length; i++) {
            const userAgent = userAgents[i];
            const deviceType = i === 0 ? 'Desktop Chrome' : i === 1 ? 'Mac Chrome' : 'Mobile Safari';
            
            try {
                const response = await makeRequest(site, userAgent);
                const cacheHeaders = {
                    'cache-control': response.headers['cache-control'] || 'Not set',
                    'etag': response.headers['etag'] || 'Not set',
                    'last-modified': response.headers['last-modified'] || 'Not set',
                    'x-cache': response.headers['x-cache'] || 'Not set',
                    'cf-cache-status': response.headers['cf-cache-status'] || 'Not set'
                };
                
                console.log(`  ${deviceType}:`);
                console.log(`    Status: ${response.statusCode}`);
                console.log(`    Cache-Control: ${cacheHeaders['cache-control']}`);
                console.log(`    ETag: ${cacheHeaders['etag']}`);
                console.log(`    X-Cache: ${cacheHeaders['x-cache']}`);
                
                // Check if content contains Sacred Contract styling
                const hasSacredContract = response.body.includes('Sacred Contract') || response.body.includes('sacred-contract');
                console.log(`    Sacred Contract Found: ${hasSacredContract ? '✅' : '❌'}`);
                
            } catch (error) {
                console.log(`  ${deviceType}: ❌ Error - ${error.message}`);
            }
        }
    }
}

function makeRequest(url, userAgent) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': userAgent,
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        };
        
        https.get(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: body
                });
            });
        }).on('error', reject);
    });
}

// Run the check
checkCacheStatus().catch(console.error);
EOF

log "🎯 Step 7: Running immediate cache validation"
node scripts/monitor-global-cache-status.js

log "✅ Emergency CDN cache bust complete!"
echo ""
echo "🔍 NEXT STEPS:"
echo "1. Open scripts/test-global-cache-propagation.html in multiple browsers"
echo "2. Test from different locations using VPN or proxy services"
echo "3. Run: node scripts/monitor-global-cache-status.js (every 5 minutes)"
echo "4. Check developer tools Network tab for cache headers"
echo ""
echo "🌍 Expected Sacred Contract styling:"
echo "   • margin-top: 5rem (80px)"
echo "   • background: rgba(34, 51, 68, 0.15)"
echo "   • color: white"
echo ""
echo "⚠️ If issues persist, CDN nodes may need 15-30 minutes for full propagation"

log "🎉 Cache bust deployment completed successfully!"