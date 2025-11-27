#!/usr/bin/env node

// Set version script for ALCHM build process
const fs = require('fs');
const path = require('path');

// Get version from package.json
const packageJson = require('../package.json');
const version = packageJson.version || '1.0.0';

// Create version info
const versionInfo = {
  version,
  buildTime: new Date().toISOString(),
  gitCommit: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
  buildId: Date.now()
};

// Write version to public directory
const versionPath = path.join(__dirname, '../public/version.json');
fs.writeFileSync(versionPath, JSON.stringify(versionInfo, null, 2));

console.log(`✅ Version set to ${version} (Build ID: ${versionInfo.buildId})`);