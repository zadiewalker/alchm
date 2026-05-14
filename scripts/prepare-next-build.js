#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const buildArtifacts = ['.next', 'out'];

for (const artifact of buildArtifacts) {
  const target = path.join(repoRoot, artifact);

  if (!fs.existsSync(target)) {
    continue;
  }

  fs.rmSync(target, { recursive: true, force: true });
  console.log(`Removed stale ${artifact}/`);
}
