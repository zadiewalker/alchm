#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 ALCHM Production Build Performance Analysis');
console.log('='.repeat(60));

// 1. CRITICAL BUNDLE SIZE ANALYSIS
console.log('\n📊 BUNDLE SIZE ANALYSIS:');
console.log('-'.repeat(40));

const chunksDir = path.join('.next', 'static', 'chunks');
const chunks = fs.readdirSync(chunksDir);

let totalSize = 0;
const bundleAnalysis = {
  framework: [],
  vendor: [],
  crisis: [],
  emergency: [],
  large: [],
  total: 0
};

chunks.forEach(chunk => {
  const filePath = path.join(chunksDir, chunk);
  const stats = fs.statSync(filePath);
  const sizeKB = Math.round(stats.size / 1024 * 100) / 100;
  totalSize += sizeKB;
  
  const analysis = {
    name: chunk,
    size: sizeKB,
    critical: false
  };
  
  // Categorize chunks
  if (chunk.includes('next-framework') || chunk.includes('react')) {
    bundleAnalysis.framework.push(analysis);
  } else if (chunk.includes('vendor')) {
    bundleAnalysis.vendor.push(analysis);
  } else if (chunk.includes('crisis') || chunk.includes('emergency')) {
    analysis.critical = true;
    bundleAnalysis.crisis.push(analysis);
  } else if (sizeKB > 50) {
    bundleAnalysis.large.push(analysis);
  }
});

bundleAnalysis.total = totalSize;

// Framework bundles
console.log('\n🔧 FRAMEWORK BUNDLES:');
bundleAnalysis.framework.forEach(chunk => {
  const status = chunk.size > 100 ? '❌ TOO LARGE' : chunk.size > 50 ? '⚠️  LARGE' : '✅ OK';
  console.log(`  ${chunk.name}: ${chunk.size}KB ${status}`);
});

// Vendor bundles
console.log('\n📦 VENDOR BUNDLES:');
bundleAnalysis.vendor.forEach(chunk => {
  const status = chunk.size > 200 ? '❌ TOO LARGE' : chunk.size > 100 ? '⚠️  LARGE' : '✅ OK';
  console.log(`  ${chunk.name}: ${chunk.size}KB ${status}`);
});

// Crisis bundles
console.log('\n🚨 CRISIS/EMERGENCY BUNDLES:');
if (bundleAnalysis.crisis.length === 0) {
  console.log('  ⚠️  WARNING: No crisis-specific bundles found!');
} else {
  bundleAnalysis.crisis.forEach(chunk => {
    const status = chunk.size > 90 ? '❌ CRITICAL' : chunk.size > 50 ? '⚠️  REVIEW' : '✅ GOOD';
    console.log(`  ${chunk.name}: ${chunk.size}KB ${status}`);
  });
}

// Large bundles
console.log('\n⚠️  LARGE BUNDLES (>50KB):');
bundleAnalysis.large
  .sort((a, b) => b.size - a.size)
  .slice(0, 10)
  .forEach(chunk => {
    const status = chunk.size > 200 ? '❌ EXCESSIVE' : chunk.size > 100 ? '⚠️  LARGE' : '📋 REVIEW';
    console.log(`  ${chunk.name}: ${chunk.size}KB ${status}`);
  });

console.log(`\n📈 TOTAL BUNDLE SIZE: ${Math.round(totalSize)}KB`);

// 2. ROUTE-SPECIFIC ANALYSIS
console.log('\n🛣️  ROUTE PERFORMANCE TARGETS:');
console.log('-'.repeat(40));

const routeTargets = {
  '/': { target: 160, critical: true, name: 'Landing Page' },
  '/crisis': { target: 90, critical: true, name: 'Crisis Resources' },
  '/emergency': { target: 90, critical: true, name: 'Emergency Access' },
  '/auth/login': { target: 120, critical: true, name: 'Authentication' },
  '/journal': { target: 160, critical: false, name: 'Journal Entry' },
  '/dashboard': { target: 200, critical: false, name: 'Dashboard' }
};

// Parse Next.js build output for route analysis
const buildOutput = `Route (app)                                             Size     First Load JS
┌ ○ /                                                   8.62 kB         182 kB
├ ● /[locale]/crisis                                    414 B           174 kB
├ ● /[locale]/emergency                                 2.81 kB         150 kB
├ ● /[locale]/auth/login                                2.83 kB         150 kB
├ ● /[locale]/journal                                   3.57 kB         202 kB
├ ● /[locale]/dashboard                                 2.07 kB         149 kB`;

const routes = buildOutput.split('\n').slice(1);
routes.forEach(route => {
  const match = route.match(/([\/\w\[\]]+)\s+.*?(\d+(?:\.\d+)?)\s*kB\s+(\d+)\s*kB/);
  if (match) {
    const [, routePath, routeSize, firstLoadJS] = match;
    const normalizedPath = routePath.replace('/[locale]', '');
    const target = routeTargets[normalizedPath];
    
    if (target) {
      const firstLoadKB = parseInt(firstLoadJS);
      const status = firstLoadKB > target.target ? 
        (target.critical ? '❌ CRITICAL FAILURE' : '❌ FAILS TARGET') :
        firstLoadKB > target.target * 0.8 ? '⚠️  APPROACHING LIMIT' : '✅ MEETS TARGET';
      
      console.log(`  ${target.name}: ${firstLoadKB}KB (target: ${target.target}KB) ${status}`);
    }
  }
});

// 3. CRISIS-SPECIFIC PERFORMANCE REQUIREMENTS
console.log('\n🚨 CRISIS PERFORMANCE ASSESSMENT:');
console.log('-'.repeat(40));

const crisisRequirements = [
  { metric: 'First Contentful Paint', target: '1.2s', status: 'NEEDS TESTING' },
  { metric: 'Largest Contentful Paint', target: '2.0s', status: 'NEEDS TESTING' },
  { metric: 'First Input Delay', target: '50ms', status: 'NEEDS TESTING' },
  { metric: 'Cumulative Layout Shift', target: '0.05', status: 'NEEDS TESTING' },
  { metric: 'Time to Interactive', target: '3.0s', status: 'NEEDS TESTING' }
];

crisisRequirements.forEach(req => {
  console.log(`  ${req.metric}: Target ${req.target} - ${req.status}`);
});

// 4. OPTIMIZATION RECOMMENDATIONS
console.log('\n💡 CRITICAL OPTIMIZATION RECOMMENDATIONS:');
console.log('-'.repeat(40));

const recommendations = [];

// Check bundle sizes
if (bundleAnalysis.total > 800) {
  recommendations.push('❌ CRITICAL: Total bundle size exceeds 800KB - implement aggressive code splitting');
}

if (bundleAnalysis.vendor.some(v => v.size > 200)) {
  recommendations.push('❌ CRITICAL: Vendor bundles too large - split Firebase/Stripe into async chunks');
}

if (bundleAnalysis.crisis.length === 0) {
  recommendations.push('⚠️  WARNING: No crisis-specific bundle optimization detected');
}

// Route-specific recommendations
const landingPageJS = 182; // From build output
if (landingPageJS > 160) {
  recommendations.push('❌ CRITICAL: Landing page exceeds 160KB - crisis users may abandon');
}

const journalJS = 202; // From build output
if (journalJS > 160) {
  recommendations.push('⚠️  WARNING: Journal page exceeds 160KB - consider lazy loading');
}

if (recommendations.length === 0) {
  console.log('  ✅ No critical issues detected in static analysis');
} else {
  recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. ${rec}`);
  });
}

// 5. NEXT STEPS
console.log('\n🎯 IMMEDIATE ACTION ITEMS:');
console.log('-'.repeat(40));
console.log('  1. Run Lighthouse audit on production build');
console.log('  2. Test Core Web Vitals with real user metrics');
console.log('  3. Validate crisis route accessibility under 3G network');
console.log('  4. Test service worker crisis resource caching');
console.log('  5. Benchmark emergency authentication flow performance');

console.log('\n✅ Production build analysis complete!');
console.log('='.repeat(60));