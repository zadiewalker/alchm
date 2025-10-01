#!/usr/bin/env node

/**
 * LIVE SITE PERFORMANCE ANALYSIS
 * Real-world testing of ALCHM production deployment
 */

const https = require('https');
const url = require('url');

class LiveSiteAnalyzer {
  constructor(baseUrl = 'https://alchm-digital-sanctuary.web.app') {
    this.baseUrl = baseUrl;
    this.results = {
      connectivity: {},
      responseHeaders: {},
      contentAnalysis: {},
      mobileOptimization: {},
      recommendations: []
    };
  }

  async analyzeLiveSite() {
    console.log('🔍 LIVE SITE ANALYSIS - ALCHM');
    console.log('====================================');
    
    try {
      await this.testConnectivity();
      await this.analyzeHeaders();
      await this.testMobileEndpoints();
      await this.analyzeCriticalResources();
      
      this.generateLiveReport();
      
    } catch (error) {
      console.error('❌ Live site analysis failed:', error);
    }
  }

  async testConnectivity() {
    console.log('\n🌐 Testing Site Connectivity...');
    
    const testUrls = [
      '/',
      '/auth',
      '/dashboard', 
      '/journal',
      '/crisis-resources',
      '/manifest.json'
    ];
    
    for (const path of testUrls) {
      try {
        const startTime = Date.now();
        const response = await this.makeRequest(path, { method: 'HEAD' });
        const loadTime = Date.now() - startTime;
        
        const status = response.statusCode >= 200 && response.statusCode < 400 ? 'PASS' : 'FAIL';
        const statusEmoji = status === 'PASS' ? '✅' : '❌';
        
        console.log(`${statusEmoji} ${path}: ${response.statusCode} (${loadTime}ms)`);
        
        this.results.connectivity[path] = {
          statusCode: response.statusCode,
          loadTime: loadTime,
          status: status
        };
        
        if (response.statusCode === 404 && path !== '/') {
          this.results.recommendations.push(`Path ${path} returns 404 - check routing configuration`);
        }
        
        if (loadTime > 3000) {
          this.results.recommendations.push(`${path} loads slowly (${loadTime}ms) - optimize server response time`);
        }
        
      } catch (error) {
        console.log(`❌ ${path}: Connection failed - ${error.message}`);
        this.results.connectivity[path] = {
          status: 'FAIL',
          error: error.message
        };
      }
    }
  }

  async analyzeHeaders() {
    console.log('\n📋 Analyzing Response Headers...');
    
    try {
      const response = await this.makeRequest('/', { method: 'HEAD' });
      this.results.responseHeaders = response.headers;
      
      // Check critical headers for mobile optimization
      const criticalHeaders = {
        'cache-control': 'Performance optimization',
        'content-encoding': 'Compression enabled', 
        'x-frame-options': 'Security protection',
        'content-security-policy': 'Security policy',
        'x-content-type-options': 'MIME protection'
      };
      
      Object.entries(criticalHeaders).forEach(([header, purpose]) => {
        const value = response.headers[header];
        if (value) {
          console.log(`✅ ${header}: ${value.substring(0, 50)}...`);
        } else {
          console.log(`⚠️ ${header}: Missing - ${purpose}`);
          this.results.recommendations.push(`Add ${header} header for ${purpose}`);
        }
      });
      
      // Check for mobile-specific optimizations
      if (response.headers['cache-control']) {
        const cacheControl = response.headers['cache-control'];
        if (cacheControl.includes('no-cache')) {
          this.results.recommendations.push('Consider enabling caching for static assets to improve mobile performance');
        }
      }
      
    } catch (error) {
      console.log(`❌ Header analysis failed: ${error.message}`);
    }
  }

  async testMobileEndpoints() {
    console.log('\n📱 Testing Mobile-Critical Endpoints...');
    
    const mobileEndpoints = [
      { path: '/manifest.json', critical: true, name: 'PWA Manifest' },
      { path: '/favicon.ico', critical: false, name: 'Favicon' },
      { path: '/icons/icon-192x192.svg', critical: true, name: 'PWA Icon' },
      { path: '/api/health/ping', critical: false, name: 'Health Check' }
    ];
    
    for (const endpoint of mobileEndpoints) {
      try {
        const startTime = Date.now();
        const response = await this.makeRequest(endpoint.path);
        const loadTime = Date.now() - startTime;
        
        const isSuccess = response.statusCode >= 200 && response.statusCode < 400;
        const status = isSuccess ? 'PASS' : 'FAIL';
        const statusEmoji = status === 'PASS' ? '✅' : (endpoint.critical ? '❌' : '⚠️');
        
        console.log(`${statusEmoji} ${endpoint.name}: ${response.statusCode} (${loadTime}ms)`);
        
        // Analyze manifest specifically
        if (endpoint.path === '/manifest.json' && isSuccess) {
          await this.analyzeManifest(response.data);
        }
        
        this.results.mobileOptimization[endpoint.name] = {
          statusCode: response.statusCode,
          loadTime: loadTime,
          status: status,
          critical: endpoint.critical
        };
        
        if (!isSuccess && endpoint.critical) {
          this.results.recommendations.push(`Critical mobile resource ${endpoint.name} is not accessible`);
        }
        
      } catch (error) {
        const statusEmoji = endpoint.critical ? '❌' : '⚠️';
        console.log(`${statusEmoji} ${endpoint.name}: Failed - ${error.message}`);
      }
    }
  }

  async analyzeManifest(manifestData) {
    try {
      const manifest = typeof manifestData === 'string' ? JSON.parse(manifestData) : manifestData;
      
      console.log('\n📄 PWA Manifest Analysis:');
      
      // Check essential PWA fields
      const essentialFields = [
        { key: 'name', required: true },
        { key: 'short_name', required: true },
        { key: 'start_url', required: true },
        { key: 'display', required: true },
        { key: 'theme_color', required: true },
        { key: 'background_color', required: true },
        { key: 'icons', required: true }
      ];
      
      essentialFields.forEach(field => {
        const value = manifest[field.key];
        if (value) {
          console.log(`✅ ${field.key}: ${typeof value === 'object' ? 'Configured' : value}`);
        } else {
          console.log(`❌ ${field.key}: Missing`);
          this.results.recommendations.push(`Add ${field.key} to PWA manifest`);
        }
      });
      
      // Check for trauma-informed features
      if (manifest.shortcuts) {
        const hasCrisisShortcut = manifest.shortcuts.some(s => 
          s.name?.toLowerCase().includes('crisis') || 
          s.name?.toLowerCase().includes('help') ||
          s.name?.toLowerCase().includes('support')
        );
        
        if (hasCrisisShortcut) {
          console.log('✅ Crisis Support Shortcut: Available');
        } else {
          console.log('⚠️ Crisis Support Shortcut: Not found');
          this.results.recommendations.push('Add crisis support shortcut to PWA manifest for vulnerable users');
        }
      }
      
      // Check icon sizes for mobile devices
      if (manifest.icons && Array.isArray(manifest.icons)) {
        const requiredSizes = ['192x192', '512x512'];
        requiredSizes.forEach(size => {
          const hasSize = manifest.icons.some(icon => icon.sizes === size);
          if (hasSize) {
            console.log(`✅ Icon ${size}: Available`);
          } else {
            console.log(`⚠️ Icon ${size}: Missing`);
            this.results.recommendations.push(`Add ${size} icon for proper mobile display`);
          }
        });
      }
      
    } catch (error) {
      console.log(`❌ Manifest analysis failed: ${error.message}`);
    }
  }

  async analyzeCriticalResources() {
    console.log('\n🔧 Analyzing Critical Resources...');
    
    // Test loading of critical CSS and JS files
    const criticalResources = [
      '/_next/static/css/',  // CSS bundle
      '/_next/static/chunks/', // JS chunks
      '/api/health/status'   // API health
    ];
    
    // This is a simplified analysis - in a real scenario, you'd parse the HTML
    // to find actual resource URLs
    
    console.log('ℹ️ Note: Detailed resource analysis requires HTML parsing');
    console.log('✅ Assumed: Next.js optimizations in place');
    console.log('✅ Assumed: Critical CSS inlined');
    console.log('⚠️ Recommendation: Implement resource preloading for crisis-critical assets');
    
    this.results.recommendations.push('Implement detailed resource timing analysis');
    this.results.recommendations.push('Add preload hints for crisis intervention resources');
  }

  generateLiveReport() {
    console.log('\n📊 LIVE SITE ANALYSIS REPORT');
    console.log('=====================================');
    
    // Connectivity Summary
    const connectivityTests = Object.values(this.results.connectivity);
    const passedConnectivity = connectivityTests.filter(t => t.status === 'PASS').length;
    const connectivityRate = (passedConnectivity / connectivityTests.length * 100).toFixed(1);
    
    console.log(`\n🌐 Connectivity: ${passedConnectivity}/${connectivityTests.length} endpoints accessible (${connectivityRate}%)`);
    
    // Performance Summary
    const avgLoadTime = connectivityTests
      .filter(t => t.loadTime)
      .reduce((sum, t) => sum + t.loadTime, 0) / 
      connectivityTests.filter(t => t.loadTime).length;
    
    if (avgLoadTime) {
      console.log(`⚡ Average Response Time: ${avgLoadTime.toFixed(0)}ms`);
      
      if (avgLoadTime > 1000) {
        console.log('⚠️ Performance Warning: Response times exceed 1 second');
      } else if (avgLoadTime < 500) {
        console.log('✅ Performance: Excellent response times');
      }
    }
    
    // Mobile Optimization Summary
    const mobileTests = Object.values(this.results.mobileOptimization);
    const passedMobile = mobileTests.filter(t => t.status === 'PASS').length;
    const mobileRate = mobileTests.length > 0 ? (passedMobile / mobileTests.length * 100).toFixed(1) : 0;
    
    console.log(`📱 Mobile Resources: ${passedMobile}/${mobileTests.length} accessible (${mobileRate}%)`);
    
    // Critical Issues
    const criticalIssues = this.results.recommendations.filter(r => 
      r.toLowerCase().includes('critical') || 
      r.toLowerCase().includes('crisis') ||
      r.toLowerCase().includes('security')
    );
    
    if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      criticalIssues.forEach(issue => console.log(`❌ ${issue}`));
    }
    
    // Top Recommendations
    console.log('\n💡 TOP RECOMMENDATIONS:');
    const topRecommendations = this.results.recommendations.slice(0, 5);
    topRecommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec}`);
    });
    
    // Overall Assessment
    const overallScore = this.calculateOverallScore();
    console.log(`\n🎯 Overall Live Site Score: ${overallScore}/100`);
    
    if (overallScore >= 85) {
      console.log('✅ Excellent: Site is well-optimized for mobile users');
    } else if (overallScore >= 70) {
      console.log('⚠️ Good: Site functions well but has room for improvement');
    } else if (overallScore >= 50) {
      console.log('⚠️ Fair: Several optimization opportunities exist');
    } else {
      console.log('❌ Poor: Critical issues need immediate attention');
    }
  }

  calculateOverallScore() {
    let score = 0;
    let maxScore = 0;
    
    // Connectivity score (40 points max)
    const connectivityTests = Object.values(this.results.connectivity);
    if (connectivityTests.length > 0) {
      const passed = connectivityTests.filter(t => t.status === 'PASS').length;
      score += (passed / connectivityTests.length) * 40;
    }
    maxScore += 40;
    
    // Mobile optimization score (30 points max)
    const mobileTests = Object.values(this.results.mobileOptimization);
    if (mobileTests.length > 0) {
      const passed = mobileTests.filter(t => t.status === 'PASS').length;
      score += (passed / mobileTests.length) * 30;
    }
    maxScore += 30;
    
    // Performance score (20 points max) - based on response times
    const timedTests = connectivityTests.filter(t => t.loadTime && t.status === 'PASS');
    if (timedTests.length > 0) {
      const avgTime = timedTests.reduce((sum, t) => sum + t.loadTime, 0) / timedTests.length;
      if (avgTime < 500) score += 20;
      else if (avgTime < 1000) score += 15;
      else if (avgTime < 2000) score += 10;
      else score += 5;
    }
    maxScore += 20;
    
    // Security/Headers score (10 points max)
    const securityHeaders = ['x-frame-options', 'x-content-type-options', 'content-security-policy'];
    const foundHeaders = securityHeaders.filter(header => this.results.responseHeaders[header]);
    score += (foundHeaders.length / securityHeaders.length) * 10;
    maxScore += 10;
    
    return Math.round((score / maxScore) * 100);
  }

  async makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
      const fullUrl = `${this.baseUrl}${path}`;
      const urlParts = url.parse(fullUrl);
      
      const requestOptions = {
        hostname: urlParts.hostname,
        port: urlParts.port || 443,
        path: urlParts.path,
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'ALCHM-Mobile-Test/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache',
          ...options.headers
        }
      };
      
      const req = https.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', chunk => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });
      
      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    });
  }
}

// Run the analysis
if (require.main === module) {
  const analyzer = new LiveSiteAnalyzer();
  analyzer.analyzeLiveSite().catch(console.error);
}

module.exports = LiveSiteAnalyzer;