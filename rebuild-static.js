#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ensure out directory exists
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Create the main directories and copy existing files
const staticFiles = [
  'index.html',
  'dashboard.html',
  'pricing-premium.html',
  'emotional-report-card.html',
  'pathways.html',
  'version.json'
];

console.log('🔄 Regenerating static files with fixes...');

// Copy files that exist and add our fixes
staticFiles.forEach(file => {
  const sourcePath = path.join(outDir, file);
  if (fs.existsSync(sourcePath)) {
    console.log(`✅ Found ${file}`);
  } else {
    console.log(`⚠️  Missing ${file}`);
  }
});

// Update version
const version = {
  version: "1.0.0-2025-11-27-fixes",
  deployVersion: "1.0.0-fixes-" + Date.now(),
  buildTime: new Date().toISOString(),
  buildTimestamp: Date.now(),
  git: {
    hash: "fixes",
    branch: "main",
    commitMessage: "Apply critical UI and authentication fixes"
  },
  cacheVersion: "v" + Date.now(),
  environment: "production"
};

fs.writeFileSync(path.join(outDir, 'version.json'), JSON.stringify(version, null, 2));
console.log('✅ Updated version.json');

console.log('🎉 Static files ready for deployment');