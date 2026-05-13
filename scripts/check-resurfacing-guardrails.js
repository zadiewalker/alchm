#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function collectStringLiterals(source) {
  const literals = [];
  const stringLiteralPattern = /(['"`])((?:\\.|(?!\1)[\s\S])*)\1/g;
  let match;

  while ((match = stringLiteralPattern.exec(source)) !== null) {
    literals.push(match[2]);
  }

  return literals;
}

const userFacingResurfacingFiles = [
  'src/components/journal/JournalFlow.tsx',
  'src/app/insights/page.tsx',
  'src/services/mirror/mirrorService.ts',
  'src/services/notifications/notificationCopy.ts',
  'src/services/notifications/localReminderService.ts',
];

const forbiddenCopy = [
  /remember this/i,
  /on this day/i,
  /look how far/i,
  /\bprogress\b/i,
  /dominant emotion/i,
  /top emotion/i,
  /\bfrequency\b/i,
  /\bstreak\b/i,
  /\bmissed\b/i,
  /catch up/i,
];

for (const file of userFacingResurfacingFiles) {
  const source = read(file);
  const badLiteral = collectStringLiterals(source).find((literal) =>
    forbiddenCopy.some((pattern) => pattern.test(literal))
  );

  assert(!badLiteral, `${file} contains unsafe resurfacing-facing copy: "${badLiteral}"`);
}

const selectReturnSource = read('src/services/returns/selectReturn.ts');
const suppressReturnsSource = read('src/services/returns/suppressReturns.ts');
const dataServiceSource = read('src/services/data/dataService.ts');

assert(
  !selectReturnSource.includes("return 'processing';\n}"),
  'selectReturn must not collapse every emotional tone to processing'
);
assert(
  selectReturnSource.includes('normalizeEmotionalTone(entry.emotionalTone)'),
  'selectReturn must read persisted top-level emotionalTone metadata'
);
assert(
  selectReturnSource.includes('normalizeEmotionalTone(entry.aiAnalysis?.emotionalTone)'),
  'selectReturn must preserve legacy aiAnalysis emotionalTone compatibility'
);
assert(
  selectReturnSource.includes('normalizeEmotionalTone(entry.emotions[0])'),
  'selectReturn must preserve local queued/check-in tone compatibility'
);
assert(
  suppressReturnsSource.includes('high_intensity_hold'),
  'return suppression must keep high-intensity hold behavior'
);
assert(
  suppressReturnsSource.includes('weak_current_metadata'),
  'return suppression must prefer silence when current metadata is weak'
);
assert(
  suppressReturnsSource.includes('recent_return_spacing'),
  'return suppression must keep recent return spacing behavior'
);
assert(
  dataServiceSource.includes('emotionalTone: typeof data.emotionalTone'),
  'dataService must preserve persisted emotionalTone metadata for return selection'
);
assert(
  dataServiceSource.includes('themes: this.toStringArray(data.themes)'),
  'dataService must preserve persisted theme metadata for return selection'
);

console.log('Resurfacing restraint guardrails passed.');
