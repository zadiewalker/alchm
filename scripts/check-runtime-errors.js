#!/usr/bin/env node

/**
 * Runtime Error Checker for ALCHM
 * Checks key pages for webpack module loading errors and Fast Refresh issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 ALCHM Runtime Error Check');
console.log('============================\n');

// Key pages to test
const testPages = [
  '/auth/login',
  '/auth/signup', 
  '/dashboard',
  '/journal',
  '/journals'
];

// Check for problematic imports in source files
console.log('1. Checking for problematic imports...');

const srcDir = path.join(process.cwd(), 'src');
const problematicPatterns = [
  /import.*NetworkResilience.*from/,
  /import.*MobileCrisisPerformanceMonitor.*from/,
  /import.*\.\.\/\.\.\/.*firebase/,  // Relative firebase imports
  /from ['"]firebase\/auth['"].*\n.*from ['"]@\/lib\/firebase['"]/  // Potential circular deps
];

function checkDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const issues = [];
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.')) {
      issues.push(...checkDirectory(fullPath));
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      for (const pattern of problematicPatterns) {
        if (pattern.test(content)) {
          issues.push({
            file: fullPath.replace(process.cwd(), '.'),
            issue: 'Problematic import pattern detected',
            pattern: pattern.toString()
          });
        }
      }
    }
  }
  
  return issues;
}

const importIssues = checkDirectory(srcDir);

if (importIssues.length === 0) {
  console.log('✅ No problematic import patterns found');
} else {
  console.log('❌ Found problematic imports:');
  importIssues.forEach(issue => {
    console.log(`   ${issue.file}: ${issue.issue}`);
  });
}

console.log('\n2. Checking build output for webpack errors...');

try {
  // Build the project and capture output
  const buildOutput = execSync('npm run build 2>&1', { 
    encoding: 'utf8',
    cwd: process.cwd(),
    timeout: 120000  // 2 minutes timeout
  });
  
  // Check for specific error patterns
  const errorPatterns = [
    /TypeError: Cannot read properties of undefined \(reading 'call'\)/,
    /Module not found: Can't resolve/,
    /Circular dependency detected/,
    /Webpack HMR.*error/,
    /Fast Refresh.*error/
  ];
  
  let hasErrors = false;
  for (const pattern of errorPatterns) {
    if (pattern.test(buildOutput)) {
      hasErrors = true;
      console.log(`❌ Found: ${pattern.toString()}`);
    }
  }
  
  if (!hasErrors) {
    console.log('✅ No webpack runtime errors detected in build');
  }
  
} catch (error) {
  console.log('❌ Build failed:');
  console.log(error.stdout || error.message);
}

console.log('\n3. Checking bundle size optimizations...');

const bundleStatsPath = path.join(process.cwd(), '.next/static');
if (fs.existsSync(bundleStatsPath)) {
  const buildStats = execSync('du -sh .next/static/* | sort -h', { encoding: 'utf8' });
  console.log('Bundle sizes:');
  console.log(buildStats);
  
  // Check for oversized chunks
  const lines = buildStats.trim().split('\n');
  let hasLargeChunks = false;
  for (const line of lines) {
    const size = line.split('\t')[0];
    if (size.includes('M') && parseFloat(size) > 2) {
      hasLargeChunks = true;
      console.log(`⚠️  Large chunk detected: ${line}`);
    }
  }
  
  if (!hasLargeChunks) {
    console.log('✅ All chunks are reasonably sized');
  }
} else {
  console.log('❌ Build output not found - build may have failed');
}

console.log('\n🎯 Runtime Error Check Complete');
console.log('================================');