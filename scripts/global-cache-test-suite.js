#!/usr/bin/env node

/**
 * ALCHM Global Cache Test Suite
 * Comprehensive testing of Sacred Contract styling propagation across global CDN nodes
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    sites: [
        'https://alchm-digital-sanctuary.web.app/',
        'https://alchmapp.web.app/'
    ],
    
    testUserAgents: [
        {
            name: 'Chrome Desktop',
            ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        {
            name: 'Safari Mac',
            ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
        },
        {
            name: 'Mobile Safari',
            ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        },
        {
            name: 'Edge',
            ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
        }
    ],
    
    expectedStyling: {
        marginTop: '5rem',
        backgroundColor: 'rgba(34, 51, 68, 0.15)',
        color: 'white'
    },
    
    testInterval: 60000, // 1 minute between tests
    maxRetries: 3
};

class GlobalCacheTestSuite {
    constructor() {
        this.results = [];
        this.startTime = new Date();
        this.testCount = 0;
    }

    async makeRequest(url, userAgent, options = {}) {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                headers: {
                    'User-Agent': userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    ...options.headers
                },
                timeout: 15000
            };

            const req = https.get(url, requestOptions, (res) => {
                let body = '';
                
                res.on('data', chunk => {
                    body += chunk;
                });
                
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body,
                        responseTime: Date.now() - startTime
                    });
                });
            });

            const startTime = Date.now();
            
            req.on('error', (error) => {
                reject(new Error(`Request failed: ${error.message}`));
            });
            
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
        });
    }

    analyzeResponse(response, site, userAgent) {
        const analysis = {
            site: site,
            userAgent: userAgent.name,
            timestamp: new Date().toISOString(),
            status: response.statusCode,
            responseTime: response.responseTime,
            cacheHeaders: {
                cacheControl: response.headers['cache-control'] || 'Not set',
                etag: response.headers['etag'] || 'Not set',
                lastModified: response.headers['last-modified'] || 'Not set',
                expires: response.headers['expires'] || 'Not set',
                cfCache: response.headers['cf-cache-status'] || 'Not set',
                xCache: response.headers['x-cache'] || 'Not set'
            }
        };

        // Check for Sacred Contract styling
        const bodyLower = response.body.toLowerCase();
        
        // Look for the expected CSS values
        const hasSacredContractElement = bodyLower.includes('sacred-contract') || 
                                       bodyLower.includes('sacred contract');
        
        const hasCorrectMarginTop = bodyLower.includes('margin-top: 5rem') || 
                                   bodyLower.includes('margin-top:5rem');
        
        const hasCorrectBackground = bodyLower.includes('rgba(34, 51, 68, 0.15)') ||
                                   bodyLower.includes('rgba(34,51,68,0.15)');
        
        const hasWhiteText = bodyLower.includes('color: white') || 
                           bodyLower.includes('color:white');

        analysis.sacredContractTest = {
            elementFound: hasSacredContractElement,
            correctMarginTop: hasCorrectMarginTop,
            correctBackground: hasCorrectBackground,
            whiteTextColor: hasWhiteText,
            overallPass: hasSacredContractElement && hasCorrectMarginTop && 
                        hasCorrectBackground && hasWhiteText
        };

        // Additional performance metrics
        analysis.performance = {
            fastResponse: response.responseTime < 2000,
            cacheHit: response.headers['x-cache'] && response.headers['x-cache'].includes('HIT'),
            cdnOptimized: response.headers['cf-cache-status'] === 'HIT' || 
                         response.headers['x-cache'] === 'HIT'
        };

        return analysis;
    }

    async runSingleTest() {
        this.testCount++;
        console.log(`\n🔍 Running test #${this.testCount} at ${new Date().toLocaleTimeString()}`);
        console.log('='.repeat(60));

        const testResults = [];

        for (const site of CONFIG.sites) {
            console.log(`\n📍 Testing ${site}`);
            
            for (const userAgent of CONFIG.testUserAgents) {
                try {
                    console.log(`  👤 ${userAgent.name}...`);
                    
                    const response = await this.makeRequest(site, userAgent.ua, {
                        headers: { 'Cache-Control': 'no-cache, no-store' }
                    });
                    
                    const analysis = this.analyzeResponse(response, site, userAgent);
                    testResults.push(analysis);
                    
                    // Log results
                    const status = analysis.sacredContractTest.overallPass ? '✅' : '❌';
                    const responseTime = `${analysis.responseTime}ms`;
                    const cacheStatus = analysis.cacheHeaders.cfCache !== 'Not set' ? 
                                      analysis.cacheHeaders.cfCache : 
                                      analysis.cacheHeaders.xCache;
                    
                    console.log(`    ${status} Status: ${analysis.status} | Time: ${responseTime} | Cache: ${cacheStatus}`);
                    
                    if (!analysis.sacredContractTest.overallPass) {
                        console.log(`    ⚠️  Issues detected:`);
                        if (!analysis.sacredContractTest.elementFound) console.log(`       • Sacred Contract element not found`);
                        if (!analysis.sacredContractTest.correctMarginTop) console.log(`       • Incorrect margin-top (expected: 5rem)`);
                        if (!analysis.sacredContractTest.correctBackground) console.log(`       • Incorrect background (expected: rgba(34, 51, 68, 0.15))`);
                        if (!analysis.sacredContractTest.whiteTextColor) console.log(`       • Incorrect text color (expected: white)`);
                    }
                    
                } catch (error) {
                    console.log(`    ❌ Error: ${error.message}`);
                    testResults.push({
                        site: site,
                        userAgent: userAgent.name,
                        timestamp: new Date().toISOString(),
                        error: error.message,
                        status: 'ERROR'
                    });
                }
            }
        }

        this.results.push({
            testNumber: this.testCount,
            timestamp: new Date().toISOString(),
            results: testResults
        });

        // Generate summary
        this.generateTestSummary(testResults);
        
        return testResults;
    }

    generateTestSummary(testResults) {
        const totalTests = testResults.length;
        const successfulTests = testResults.filter(r => r.sacredContractTest?.overallPass).length;
        const errorTests = testResults.filter(r => r.status === 'ERROR').length;
        
        console.log(`\n📊 Test Summary:`);
        console.log(`   Total tests: ${totalTests}`);
        console.log(`   Successful: ${successfulTests} (${Math.round(successfulTests/totalTests*100)}%)`);
        console.log(`   Failed: ${totalTests - successfulTests - errorTests}`);
        console.log(`   Errors: ${errorTests}`);
        
        if (successfulTests === totalTests - errorTests) {
            console.log(`   🎉 All working tests PASSED! Sacred Contract styling is properly propagated.`);
        } else {
            console.log(`   ⚠️  Some tests failed. CDN propagation may still be in progress.`);
        }
    }

    async generateDetailedReport() {
        const reportPath = path.join(__dirname, '..', 'cache-propagation-report.json');
        const htmlReportPath = path.join(__dirname, '..', 'cache-propagation-report.html');
        
        // JSON Report
        const report = {
            generatedAt: new Date().toISOString(),
            testDuration: Date.now() - this.startTime.getTime(),
            totalTests: this.testCount,
            configuration: CONFIG,
            results: this.results
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        // HTML Report
        const htmlReport = this.generateHtmlReport(report);
        fs.writeFileSync(htmlReportPath, htmlReport);
        
        console.log(`\n📋 Detailed reports generated:`);
        console.log(`   JSON: ${reportPath}`);
        console.log(`   HTML: ${htmlReportPath}`);
    }

    generateHtmlReport(report) {
        const latestResults = report.results[report.results.length - 1]?.results || [];
        const successRate = latestResults.length > 0 ? 
            Math.round(latestResults.filter(r => r.sacredContractTest?.overallPass).length / latestResults.length * 100) : 0;

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ALCHM Sacred Contract Global Cache Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .metric-label { opacity: 0.9; }
        .test-results { margin-top: 30px; }
        .result-item { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 6px; border-left: 4px solid #28a745; }
        .result-item.failed { border-left-color: #dc3545; }
        .result-item.error { border-left-color: #ffc107; }
        .site-header { font-weight: bold; color: #495057; margin-bottom: 5px; }
        .test-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9em; }
        .status-pass { color: #28a745; font-weight: bold; }
        .status-fail { color: #dc3545; font-weight: bold; }
        .timestamp { text-align: center; color: #6c757d; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔬 ALCHM Sacred Contract Global Cache Test Report</h1>
            <p>Comprehensive CDN propagation analysis for Sacred Contract styling fixes</p>
        </div>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${successRate}%</div>
                <div class="metric-label">Success Rate</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.totalTests}</div>
                <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric">
                <div class="metric-value">${CONFIG.sites.length}</div>
                <div class="metric-label">Sites Tested</div>
            </div>
            <div class="metric">
                <div class="metric-value">${CONFIG.testUserAgents.length}</div>
                <div class="metric-label">User Agents</div>
            </div>
        </div>
        
        <div class="test-results">
            <h2>Latest Test Results</h2>
            ${latestResults.map(result => `
                <div class="result-item ${result.sacredContractTest?.overallPass ? 'passed' : result.status === 'ERROR' ? 'error' : 'failed'}">
                    <div class="site-header">${result.site} - ${result.userAgent}</div>
                    <div class="test-details">
                        <div>
                            <strong>Status:</strong> 
                            <span class="${result.sacredContractTest?.overallPass ? 'status-pass' : 'status-fail'}">
                                ${result.sacredContractTest?.overallPass ? '✅ PASS' : result.status === 'ERROR' ? '❌ ERROR' : '❌ FAIL'}
                            </span>
                        </div>
                        <div><strong>Response Time:</strong> ${result.responseTime || 'N/A'}ms</div>
                        <div><strong>Cache Status:</strong> ${result.cacheHeaders?.cfCache || result.cacheHeaders?.xCache || 'Unknown'}</div>
                        <div><strong>HTTP Status:</strong> ${result.status || 'N/A'}</div>
                    </div>
                    ${result.sacredContractTest ? `
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #dee2e6;">
                            <strong>Sacred Contract Tests:</strong><br>
                            Element Found: ${result.sacredContractTest.elementFound ? '✅' : '❌'} |
                            Margin Top: ${result.sacredContractTest.correctMarginTop ? '✅' : '❌'} |
                            Background: ${result.sacredContractTest.correctBackground ? '✅' : '❌'} |
                            Text Color: ${result.sacredContractTest.whiteTextColor ? '✅' : '❌'}
                        </div>
                    ` : ''}
                    ${result.error ? `<div style="color: #dc3545; margin-top: 10px;"><strong>Error:</strong> ${result.error}</div>` : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="timestamp">
            <p>Report generated at: ${report.generatedAt}</p>
            <p>Test duration: ${Math.round(report.testDuration / 1000)} seconds</p>
        </div>
    </div>
    
    <script>
        // Auto-refresh every 2 minutes if in continuous monitoring mode
        if (window.location.search.includes('auto-refresh')) {
            setTimeout(() => window.location.reload(), 120000);
        }
    </script>
</body>
</html>`;
    }

    async runContinuousMonitoring(duration = 30 * 60 * 1000) { // 30 minutes default
        console.log(`🚀 Starting continuous monitoring for ${duration/60000} minutes...`);
        console.log(`📊 Testing every ${CONFIG.testInterval/1000} seconds`);
        
        const endTime = Date.now() + duration;
        
        while (Date.now() < endTime) {
            await this.runSingleTest();
            
            if (Date.now() < endTime) {
                console.log(`\n⏳ Waiting ${CONFIG.testInterval/1000} seconds until next test...`);
                await new Promise(resolve => setTimeout(resolve, CONFIG.testInterval));
            }
        }
        
        await this.generateDetailedReport();
        console.log(`\n🎉 Continuous monitoring completed!`);
    }

    async runSingleTestSuite() {
        console.log('🔍 Running single test suite...');
        await this.runSingleTest();
        await this.generateDetailedReport();
        console.log('\n✅ Single test suite completed!');
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const testSuite = new GlobalCacheTestSuite();
    
    if (args.includes('--continuous')) {
        const duration = args.includes('--duration') ? 
            parseInt(args[args.indexOf('--duration') + 1]) * 60 * 1000 : 
            30 * 60 * 1000; // Default 30 minutes
        await testSuite.runContinuousMonitoring(duration);
    } else {
        await testSuite.runSingleTestSuite();
    }
}

// Export for use as module
module.exports = GlobalCacheTestSuite;

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}