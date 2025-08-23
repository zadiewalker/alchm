#!/usr/bin/env node

/**
 * Build verification script for Firebase Studio deployment
 * Checks for common issues that cause build failures
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying ALCHM build configuration...\n');

// Check 1: Verify next.config.js is properly formatted
const nextConfigPath = path.join(__dirname, 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  if (nextConfigContent.includes('output: \'export\'')) {
    console.log('✅ next.config.js: Static export configured correctly');
  } else {
    console.log('❌ next.config.js: Missing static export configuration');
  }
} else {
  console.log('❌ next.config.js: File not found');
}

// Check 2: Verify package.json has type specified
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.type === 'commonjs') {
    console.log('✅ package.json: CommonJS type specified');
  } else {
    console.log('❌ package.json: Missing or incorrect type specification');
  }
} else {
  console.log('❌ package.json: File not found');
}

// Check 3: Verify apphosting.yaml configuration
const apphostingPath = path.join(__dirname, 'apphosting.yaml');
if (fs.existsSync(apphostingPath)) {
  const apphostingContent = fs.readFileSync(apphostingPath, 'utf8');
  if (apphostingContent.includes('source: out')) {
    console.log('✅ apphosting.yaml: Static export output configured');
  } else {
    console.log('❌ apphosting.yaml: Missing static export output configuration');
  }
} else {
  console.log('❌ apphosting.yaml: File not found');
}

// Check 4: Verify root layout exists
const rootLayoutPath = path.join(__dirname, 'src/app/layout.tsx');
if (fs.existsSync(rootLayoutPath)) {
  console.log('✅ Root layout: src/app/layout.tsx exists');
} else {
  console.log('❌ Root layout: src/app/layout.tsx missing');
}

console.log('\n🎯 Build verification complete!');
console.log('\n📝 If all checks pass, the build should succeed on Firebase Studio.');
console.log('🚀 Ready for deployment to Firebase App Hosting!');