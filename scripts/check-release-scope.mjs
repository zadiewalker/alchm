import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const conflictingPaths = [
  'functions/functions',
  'ios/App 2',
  'alchm-clean',
  'emergency-backups',
  'artifacts',
  '.github/workflows 2',
  '.github/workflows 3',
];

const presentPaths = conflictingPaths.filter((relativePath) => (
  fs.existsSync(path.join(repo, relativePath))
));

if (presentPaths.length > 0) {
  console.error('Release scope contains non-canonical or unreviewed authority paths:');
  presentPaths.forEach((relativePath) => console.error(`- ${relativePath}`));
  console.error('These paths must be explicitly dispositioned before candidate certification.');
  process.exitCode = 1;
} else {
  console.log('Release scope contains no known authority-conflicting duplicate trees.');
}
