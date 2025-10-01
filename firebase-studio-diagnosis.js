#!/usr/bin/env node

// Firebase Studio Buildpack Diagnosis Script
// This script helps diagnose what buildpacks can see

const fs = require('fs');
const path = require('path');

console.log('🔍 Firebase Studio Buildpack Diagnosis');
console.log('=====================================');

// Check current working directory
console.log('Working Directory:', process.cwd());

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
console.log('package.json exists:', fs.existsSync(packageJsonPath));

if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log('package.json name:', packageJson.name);
    console.log('package.json scripts:', Object.keys(packageJson.scripts || {}));
  } catch (e) {
    console.log('package.json read error:', e.message);
  }
}

// Check for JavaScript files
const jsFiles = fs.readdirSync(process.cwd())
  .filter(file => file.endsWith('.js'))
  .slice(0, 10);

console.log('JavaScript files found:', jsFiles);

// Check for Next.js files
console.log('next.config.js exists:', fs.existsSync('next.config.js'));
console.log('.next directory exists:', fs.existsSync('.next'));

// Check for Node.js version
console.log('Node.js version:', process.version);

// List all files in root (first 20)
console.log('\nRoot directory files:');
try {
  const files = fs.readdirSync(process.cwd()).slice(0, 20);
  files.forEach(file => console.log(`  - ${file}`));
} catch (e) {
  console.log('Error reading directory:', e.message);
}

console.log('\n✅ Diagnosis complete');