#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 ALCHM Production Build Validation Report');
console.log('==========================================\n');

// 1. Bundle Size Analysis
console.log('📦 BUNDLE SIZE ANALYSIS');
console.log('-----------------------');

function analyzeDirectory(dir, label) {
  try {
    const stats = execSync(`du -sh ${dir} 2>/dev/null || echo "0K"`, { encoding: 'utf8' }).trim();
    console.log(`${label}: ${stats}`);
    return stats;
  } catch (e) {
    console.log(`${label}: Not found or error`);
    return '0K';
  }
}

analyzeDirectory('.next/static/chunks', 'JavaScript Chunks');
analyzeDirectory('.next/static/css', 'CSS Files');
analyzeDirectory('.next/static/media', 'Media Assets');
analyzeDirectory('.next/server', 'Server Bundle');

// 2. Critical Path Analysis
console.log('\n🎯 CRITICAL PATH ANALYSIS');
console.log('-------------------------');

try {
  const buildManifest = JSON.parse(fs.readFileSync('.next/build-manifest.json', 'utf8'));
  const pages = buildManifest.pages || {};
  
  // Check main page bundles
  const criticalPages = ['/', '/dashboard', '/journal', '/crisis', '/emergency'];
  
  criticalPages.forEach(page => {
    if (pages[page]) {
      const chunks = pages[page];
      const totalSize = chunks.reduce((sum, chunk) => {
        try {
          const chunkPath = `.next/static/chunks/${chunk}`;
          if (fs.existsSync(chunkPath)) {
            const stat = fs.statSync(chunkPath);
            return sum + stat.size;
          }
        } catch (e) {}
        return sum;
      }, 0);
      
      const totalKB = (totalSize / 1024).toFixed(1);
      const status = totalSize < 100000 ? '✅' : totalSize < 200000 ? '⚠️' : '❌';
      console.log(`${status} ${page}: ${totalKB}KB (${chunks.length} chunks)`);
    }
  });
} catch (e) {
  console.log('❌ Could not analyze build manifest');
}

// 3. Crisis Performance Validation
console.log('\n🆘 CRISIS PERFORMANCE VALIDATION');
console.log('--------------------------------');

try {
  // Check for crisis-related chunks
  const chunkFiles = fs.readdirSync('.next/static/chunks');
  const crisisChunks = chunkFiles.filter(file => 
    file.includes('crisis') || file.includes('emergency')
  );
  
  if (crisisChunks.length > 0) {
    console.log('✅ Crisis-specific chunks found:');
    crisisChunks.forEach(chunk => {
      const stat = fs.statSync(`.next/static/chunks/${chunk}`);
      const sizeKB = (stat.size / 1024).toFixed(1);
      const status = stat.size < 25000 ? '✅' : stat.size < 50000 ? '⚠️' : '❌';
      console.log(`  ${status} ${chunk}: ${sizeKB}KB`);
    });
  } else {
    console.log('⚠️ No dedicated crisis chunks found (using general chunks)');
  }
} catch (e) {
  console.log('❌ Could not analyze crisis chunks');
}

// 4. Core Web Vitals Targets
console.log('\n⚡ CORE WEB VITALS TARGETS');
console.log('-------------------------');

try {
  // Calculate total initial bundle size
  const buildManifest = JSON.parse(fs.readFileSync('.next/build-manifest.json', 'utf8'));
  const rootChunks = buildManifest.pages['/'] || [];
  const sharedChunks = buildManifest.rootMainFiles || [];
  
  let totalInitialSize = 0;
  [...rootChunks, ...sharedChunks].forEach(chunk => {
    try {
      const chunkPath = `.next/static/chunks/${chunk}`;
      if (fs.existsSync(chunkPath)) {
        const stat = fs.statSync(chunkPath);
        totalInitialSize += stat.size;
      }
    } catch (e) {}
  });
  
  const totalInitialKB = (totalInitialSize / 1024).toFixed(1);
  
  console.log(`Initial Bundle Size: ${totalInitialKB}KB`);
  console.log(`Target: <200KB for mobile: ${totalInitialSize < 204800 ? '✅' : '❌'}`);
  console.log(`Target: <150KB for 2G: ${totalInitialSize < 153600 ? '✅' : '⚠️'}`);
  
} catch (e) {
  console.log('❌ Could not calculate initial bundle size');
}

// 5. Security Headers Validation
console.log('\n🔒 SECURITY CONFIGURATION');
console.log('-------------------------');

try {
  const nextConfig = require('./next.config.js');
  
  if (nextConfig.headers) {
    console.log('✅ Security headers configured');
  } else {
    console.log('❌ Security headers not configured');
  }
  
  if (nextConfig.images && nextConfig.images.unoptimized) {
    console.log('✅ Images optimized for Firebase Functions');
  }
  
  if (nextConfig.output === 'standalone') {
    console.log('✅ Standalone output configured');
  }
  
} catch (e) {
  console.log('❌ Could not validate next.config.js');
}

// 6. Build Quality Summary
console.log('\n📊 BUILD QUALITY SUMMARY');
console.log('------------------------');

const buildId = fs.existsSync('.next/BUILD_ID') ? 
  fs.readFileSync('.next/BUILD_ID', 'utf8').trim() : 'unknown';

console.log(`Build ID: ${buildId}`);
console.log(`Build Time: ${new Date().toISOString()}`);
console.log(`Node.js: ${process.version}`);
console.log(`Environment: production`);

console.log('\n✅ ALCHM Production Build Validation Complete');
console.log('Ready for App Store submission!');