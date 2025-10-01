#!/usr/bin/env node

/**
 * CRISIS BUNDLE ANALYZER - Emergency Bundle Size Assessment
 * Analyzes bundle components for crisis-user optimization
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 CRISIS BUNDLE ANALYZER - Emergency Size Assessment');
console.log('=' .repeat(60));

// Analyze Next.js build manifest
function analyzeBuildManifest() {
  const manifestPath = path.join(__dirname, '.next', 'build-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.log('❌ Build manifest not found. Run `npm run build` first.');
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  console.log('\n📦 BUNDLE ANALYSIS - Critical for Crisis Users');
  console.log('-'.repeat(50));
  
  // Analyze pages
  Object.entries(manifest.pages || {}).forEach(([page, files]) => {
    if (page.includes('auth') || page.includes('login') || page.includes('emergency')) {
      console.log(`\n📄 ${page}:`);
      files.forEach(file => {
        try {
          const filePath = path.join(__dirname, '.next', file);
          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const sizeKB = Math.round(stats.size / 1024);
            const sizeStatus = sizeKB > 500 ? '❌ TOO LARGE' : 
                             sizeKB > 100 ? '⚠️ LARGE' : '✅ OK';
            console.log(`  ${file} - ${sizeKB}KB ${sizeStatus}`);
          }
        } catch (error) {
          console.log(`  ${file} - ERROR: ${error.message}`);
        }
      });
    }
  });
}

// Analyze app build manifest  
function analyzeAppManifest() {
  const manifestPath = path.join(__dirname, '.next', 'app-build-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.log('❌ App build manifest not found.');
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  console.log('\n🏗️ APP MANIFEST ANALYSIS');
  console.log('-'.repeat(30));
  
  // Analyze pages in app manifest
  Object.entries(manifest.pages || {}).forEach(([page, data]) => {
    if (page.includes('auth') || page.includes('login') || page.includes('emergency')) {
      console.log(`\n📱 ${page}:`);
      if (data.length) {
        data.forEach(file => {
          console.log(`  ${file}`);
        });
      }
    }
  });
}

// Check static chunks directory
function analyzeStaticChunks() {
  const chunksPath = path.join(__dirname, '.next', 'static', 'chunks');
  
  if (!fs.existsSync(chunksPath)) {
    console.log('❌ Static chunks directory not found.');
    return;
  }

  console.log('\n📊 STATIC CHUNKS ANALYSIS - Crisis Impact');
  console.log('-'.repeat(40));

  const chunks = fs.readdirSync(chunksPath)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(chunksPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024),
        sizeMB: Math.round(stats.size / 1024 / 1024 * 100) / 100
      };
    })
    .sort((a, b) => b.size - a.size);

  console.log('\n🔴 LARGEST CHUNKS (Crisis Blockers):');
  chunks.slice(0, 10).forEach((chunk, i) => {
    const impact = chunk.sizeMB > 1 ? '🚨 CRISIS BLOCKER' :
                   chunk.sizeKB > 500 ? '⚠️ LARGE' :
                   chunk.sizeKB > 100 ? '⚠️ MEDIUM' : '✅ OK';
    console.log(`  ${i + 1}. ${chunk.name}`);
    console.log(`     Size: ${chunk.sizeMB}MB (${chunk.sizeKB}KB) ${impact}`);
  });

  // Calculate total bundle size
  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
  const totalMB = Math.round(totalSize / 1024 / 1024 * 100) / 100;
  
  console.log(`\n📏 TOTAL BUNDLE SIZE: ${totalMB}MB`);
  console.log(`🎯 CRISIS TARGET: 0.5MB (${totalMB}MB ÷ 0.5MB = ${Math.round(totalMB / 0.5 * 10) / 10}x over target)`);
}

// Crisis-specific recommendations
function provideCrisisRecommendations(bundleSizeMB) {
  console.log('\n🚨 CRISIS OPTIMIZATION RECOMMENDATIONS');
  console.log('='.repeat(45));

  if (bundleSizeMB > 2) {
    console.log('🔴 CRITICAL - Bundle size threatens crisis user access:');
    console.log('  1. EMERGENCY: Remove Firebase from initial bundle');
    console.log('  2. URGENT: Implement code splitting for auth page');
    console.log('  3. HIGH: Lazy load all non-essential components');
    console.log('  4. MEDIUM: Use lightweight auth alternatives');
  } else if (bundleSizeMB > 1) {
    console.log('⚠️ WARNING - Bundle size may impact crisis users:');
    console.log('  1. Split vendor bundles');
    console.log('  2. Implement tree shaking');
    console.log('  3. Remove unused dependencies');
  } else if (bundleSizeMB > 0.5) {
    console.log('⚠️ CAUTION - Bundle approaching crisis threshold:');
    console.log('  1. Monitor bundle size in CI/CD');
    console.log('  2. Consider implementing bundle budgets');
  } else {
    console.log('✅ GOOD - Bundle size crisis-appropriate');
  }

  console.log('\n🎯 CRISIS USER CONSTRAINTS:');
  console.log('  • 2G/3G networks (256kbps-2Mbps)');
  console.log('  • Low-end Android devices (2GB RAM)');
  console.log('  • High stress/panic situations');
  console.log('  • Potential vision impairment from tears');
  console.log('  • Trembling hands affecting interaction');
  
  console.log('\n📱 MOBILE CRISIS OPTIMIZATION CHECKLIST:');
  console.log('  □ Bundle < 500KB for initial page load');
  console.log('  □ Critical CSS < 5KB inline');
  console.log('  □ Service worker for offline access');
  console.log('  □ Touch targets ≥ 52px');
  console.log('  □ Error states are forgiving');
  console.log('  □ Works without JavaScript (progressive enhancement)');
}

// Main execution
function main() {
  console.log('Crisis user bundle analysis starting...\n');
  
  analyzeBuildManifest();
  analyzeAppManifest();
  analyzeStaticChunks();
  
  // Get total bundle estimate
  const chunksPath = path.join(__dirname, '.next', 'static', 'chunks');
  if (fs.existsSync(chunksPath)) {
    const chunks = fs.readdirSync(chunksPath)
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const filePath = path.join(chunksPath, file);
        return fs.statSync(filePath).size;
      });
    
    const totalSize = chunks.reduce((sum, size) => sum + size, 0);
    const totalMB = Math.round(totalSize / 1024 / 1024 * 100) / 100;
    
    provideCrisisRecommendations(totalMB);
  }
  
  console.log('\n🔄 To fix bundle size issues:');
  console.log('  npm run build && node crisis-bundle-analyzer.js');
  console.log('  npm install --save-dev webpack-bundle-analyzer');
  console.log('  npx webpack-bundle-analyzer .next/static/chunks/*.js');
}

if (require.main === module) {
  main();
}

module.exports = { analyzeBuildManifest, analyzeAppManifest, analyzeStaticChunks };