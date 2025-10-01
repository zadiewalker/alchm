#!/usr/bin/env node

// ALCHM Sanctuary Performance Validation
// Ensures the new design system meets crisis-critical performance targets

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Performance targets from budget.json
const PERFORMANCE_TARGETS = {
  'first-contentful-paint': 1200, // 1.2s for crisis access
  'largest-contentful-paint': 2000, // 2.0s max
  'cumulative-layout-shift': 0.05, // Excellent stability
  'total-blocking-time': 100, // Crisis-optimized
  'max-potential-fid': 50, // Immediate responsiveness
  'interactive': 3000, // 3s max for full functionality
};

// URLs to test
const TEST_URLS = [
  'http://localhost:3000',
  'http://localhost:3000/auth/login',
  'http://localhost:3000/journal',
  'http://localhost:3000/dashboard'
];

// Device simulation profiles
const DEVICE_PROFILES = {
  'mobile-crisis': {
    emulation: 'mobile',
    throttling: 'simulate',
    network: 'slow-3G',
    cpu: 4
  },
  'desktop-premium': {
    emulation: 'desktop',
    throttling: 'devtools',
    network: 'broadband',
    cpu: 1
  },
  'mobile-premium': {
    emulation: 'mobile',
    throttling: 'simulate',
    network: '4G',
    cpu: 2
  }
};

console.log('🌿 ALCHM Sanctuary Performance Validation');
console.log('==========================================\n');

async function runLighthouseTest(url, profile, outputPath) {
  const profileConfig = DEVICE_PROFILES[profile];
  
  try {
    console.log(`Testing ${url} (${profile})...`);
    
    const command = [
      'npx lighthouse',
      `"${url}"`,
      '--output=json',
      `--output-path="${outputPath}"`,
      '--chrome-flags="--headless --no-sandbox"',
      `--emulated-form-factor=${profileConfig.emulation}`,
      `--throttling-method=${profileConfig.throttling}`,
      `--throttling.cpuSlowdownMultiplier=${profileConfig.cpu}`,
      '--quiet'
    ].join(' ');
    
    execSync(command, { stdio: 'pipe' });
    
    // Read and parse results
    const results = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    return extractMetrics(results);
    
  } catch (error) {
    console.error(`❌ Failed to test ${url}: ${error.message}`);
    return null;
  }
}

function extractMetrics(lighthouseResults) {
  const audits = lighthouseResults.audits;
  
  return {
    fcp: parseFloat(audits['first-contentful-paint']?.numericValue) || 0,
    lcp: parseFloat(audits['largest-contentful-paint']?.numericValue) || 0,
    cls: parseFloat(audits['cumulative-layout-shift']?.numericValue) || 0,
    tbt: parseFloat(audits['total-blocking-time']?.numericValue) || 0,
    fid: parseFloat(audits['max-potential-fid']?.numericValue) || 0,
    tti: parseFloat(audits['interactive']?.numericValue) || 0,
    performanceScore: lighthouseResults.categories?.performance?.score * 100 || 0
  };
}

function validateMetrics(metrics, profile) {
  const results = {
    passed: 0,
    failed: 0,
    issues: []
  };
  
  // Adjust targets for crisis scenarios
  const targets = { ...PERFORMANCE_TARGETS };
  if (profile === 'mobile-crisis') {
    targets['first-contentful-paint'] = 800; // Stricter for crisis
    targets['largest-contentful-paint'] = 1200;
    targets['total-blocking-time'] = 50;
  }
  
  const checks = [
    { metric: 'fcp', value: metrics.fcp, target: targets['first-contentful-paint'], name: 'First Contentful Paint' },
    { metric: 'lcp', value: metrics.lcp, target: targets['largest-contentful-paint'], name: 'Largest Contentful Paint' },
    { metric: 'cls', value: metrics.cls, target: targets['cumulative-layout-shift'], name: 'Cumulative Layout Shift' },
    { metric: 'tbt', value: metrics.tbt, target: targets['total-blocking-time'], name: 'Total Blocking Time' },
    { metric: 'fid', value: metrics.fid, target: targets['max-potential-fid'], name: 'First Input Delay' },
    { metric: 'tti', value: metrics.tti, target: targets['interactive'], name: 'Time to Interactive' }
  ];
  
  checks.forEach(check => {
    const passed = check.value <= check.target;
    if (passed) {
      results.passed++;
      console.log(`  ✅ ${check.name}: ${Math.round(check.value)}ms (target: ${check.target}ms)`);
    } else {
      results.failed++;
      const exceed = Math.round(check.value - check.target);
      console.log(`  ❌ ${check.name}: ${Math.round(check.value)}ms (exceeds target by ${exceed}ms)`);
      results.issues.push({
        metric: check.metric,
        name: check.name,
        value: check.value,
        target: check.target,
        excess: exceed
      });
    }
  });
  
  // Performance score check
  if (metrics.performanceScore >= 90) {
    results.passed++;
    console.log(`  ✅ Performance Score: ${Math.round(metrics.performanceScore)}/100`);
  } else {
    results.failed++;
    console.log(`  ❌ Performance Score: ${Math.round(metrics.performanceScore)}/100 (target: 90+)`);
    results.issues.push({
      metric: 'performance-score',
      name: 'Performance Score',
      value: metrics.performanceScore,
      target: 90
    });
  }
  
  return results;
}

function generateReport(allResults) {
  console.log('\n📊 PERFORMANCE VALIDATION SUMMARY');
  console.log('=====================================\n');
  
  let totalPassed = 0;
  let totalFailed = 0;
  let criticalIssues = [];
  
  Object.entries(allResults).forEach(([url, profiles]) => {
    console.log(`🔍 ${url}`);
    
    Object.entries(profiles).forEach(([profile, result]) => {
      if (!result) return;
      
      console.log(`  📱 ${profile.toUpperCase()}:`);
      console.log(`    Performance Score: ${Math.round(result.metrics.performanceScore)}/100`);
      
      totalPassed += result.validation.passed;
      totalFailed += result.validation.failed;
      
      // Check for critical issues (crisis scenarios)
      if (profile === 'mobile-crisis' && result.validation.failed > 0) {
        criticalIssues.push(...result.validation.issues.map(issue => ({
          ...issue,
          url,
          profile
        })));
      }
    });
    console.log('');
  });
  
  console.log(`📈 OVERALL RESULTS:`);
  console.log(`  ✅ Passed: ${totalPassed} metrics`);
  console.log(`  ❌ Failed: ${totalFailed} metrics`);
  console.log(`  📊 Success Rate: ${Math.round((totalPassed / (totalPassed + totalFailed)) * 100)}%\n`);
  
  if (criticalIssues.length > 0) {
    console.log('🚨 CRITICAL PERFORMANCE ISSUES (Crisis Scenarios):');
    criticalIssues.forEach(issue => {
      console.log(`  ⚠️  ${issue.name} on ${issue.url} (${issue.profile})`);
      console.log(`      Current: ${Math.round(issue.value)}ms | Target: ${issue.target}ms`);
    });
    console.log('');
  }
  
  // Recommendations
  if (totalFailed > 0) {
    console.log('💡 OPTIMIZATION RECOMMENDATIONS:');
    
    const commonIssues = criticalIssues.reduce((acc, issue) => {
      acc[issue.metric] = (acc[issue.metric] || 0) + 1;
      return acc;
    }, {});
    
    const sortedIssues = Object.entries(commonIssues)
      .sort(([,a], [,b]) => b - a);
    
    sortedIssues.forEach(([metric, count]) => {
      const recommendations = {
        'lcp': 'Consider inlining critical CSS, optimizing font loading, or reducing image sizes',
        'fcp': 'Inline critical CSS, optimize font loading, and minimize render-blocking resources',
        'tbt': 'Split large JavaScript bundles, defer non-critical scripts, and optimize React renders',
        'fid': 'Reduce JavaScript execution time and optimize event handlers',
        'cls': 'Add size attributes to images and reserve space for dynamic content',
        'tti': 'Optimize JavaScript bundles and defer non-critical resources'
      };
      
      console.log(`  • ${metric.toUpperCase()}: ${recommendations[metric] || 'Review and optimize this metric'}`);
    });
    console.log('');
  }
  
  return {
    passed: totalPassed,
    failed: totalFailed,
    successRate: (totalPassed / (totalPassed + totalFailed)) * 100,
    criticalIssues: criticalIssues.length,
    hasCriticalIssues: criticalIssues.length > 0
  };
}

// Check if development server is running
function checkDevServer() {
  try {
    execSync('curl -f http://localhost:3000 > /dev/null 2>&1');
    return true;
  } catch {
    return false;
  }
}

async function main() {
  // Check prerequisites
  if (!checkDevServer()) {
    console.log('❌ Development server not running. Please start with: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Development server detected\n');
  
  // Create temp directory for reports
  const tempDir = path.join(__dirname, '../.lighthouse-temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const allResults = {};
  
  // Test each URL with each profile
  for (const url of TEST_URLS) {
    allResults[url] = {};
    
    for (const [profileName, profileConfig] of Object.entries(DEVICE_PROFILES)) {
      const outputPath = path.join(tempDir, `${url.replace(/[^a-zA-Z0-9]/g, '_')}_${profileName}.json`);
      
      const metrics = await runLighthouseTest(url, profileName, outputPath);
      
      if (metrics) {
        console.log(`  Performance Score: ${Math.round(metrics.performanceScore)}/100`);
        const validation = validateMetrics(metrics, profileName);
        
        allResults[url][profileName] = {
          metrics,
          validation
        };
      }
      
      console.log('');
    }
  }
  
  // Generate final report
  const summary = generateReport(allResults);
  
  // Save results
  const reportPath = path.join(__dirname, '../performance-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary,
    results: allResults
  }, null, 2));
  
  console.log(`📋 Detailed report saved to: ${reportPath}`);
  
  // Clean up temp files
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  // Exit with appropriate code
  if (summary.hasCriticalIssues) {
    console.log('\n🚨 CRITICAL PERFORMANCE ISSUES DETECTED');
    console.log('The sanctuary experience may not meet crisis user needs.');
    process.exit(1);
  } else if (summary.successRate < 85) {
    console.log('\n⚠️  PERFORMANCE CONCERNS DETECTED');
    console.log('Consider optimizing before production deployment.');
    process.exit(1);
  } else {
    console.log('\n🌿 SANCTUARY PERFORMANCE VALIDATED');
    console.log('Ready for healing and transformation.');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
});