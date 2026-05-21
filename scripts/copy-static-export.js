#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const source = path.join(repoRoot, '.next-launch');
const target = path.join(repoRoot, 'out');

if (!fs.existsSync(source)) {
  console.error('Static export source not found: .next-launch/');
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });

console.log('Copied static export from .next-launch/ to out/');
