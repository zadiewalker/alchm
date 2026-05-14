#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
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

const governanceSource = read('src/config/emotionalLanguage.ts');

const requiredGovernanceTerms = [
  'EMOTIONAL_LANGUAGE_GOVERNANCE',
  'EMOTIONAL_LANGUAGE_GOVERNED_SURFACES',
  'EMOTIONAL_LANGUAGE_QUARANTINED_SURFACES',
  'EMOTIONAL_LANGUAGE_RETIRED_SURFACES',
  'dominant emotion',
  'welcome back',
  'pattern detected',
  'look how far',
  'missed days remain silent',
  'recently named tones',
];

for (const term of requiredGovernanceTerms) {
  assert(
    governanceSource.toLowerCase().includes(term.toLowerCase()),
    `emotionalLanguage governance must codify "${term}"`
  );
}

const governedSurfaces = [
  'src/app/dashboard/DashboardClient.tsx',
  'src/app/community/page.tsx',
  'src/app/insights/page.tsx',
  'src/app/onboarding/page.tsx',
  'src/app/pathways/page.tsx',
  'src/app/pathways/foundation/page.tsx',
  'src/components/journal/JournalFlow.tsx',
  'src/config/containerDefinitions.ts',
  'src/config/resurfacingTone.ts',
  'src/services/mirror/mirrorService.ts',
  'src/services/notifications/localReminderService.ts',
  'src/services/notifications/notificationCopy.ts',
];

const forbiddenUserFacingCopy = [
  /dominant emotion/i,
  /top mood/i,
  /top emotion/i,
  /\bfrequency\b/i,
  /\btrend\b/i,
  /pattern detected/i,
  /insights engine/i,
  /\bpredictive\b/i,
  /\banalytics\b/i,
  /\bprogress\b/i,
  /growth journey/i,
  /leveling up/i,
  /\bmilestone\b/i,
  /\bachievement\b/i,
  /\bstreak\b/i,
  /\bconsistency\b/i,
  /falling behind/i,
  /back on track/i,
  /remember this/i,
  /on this day/i,
  /look how far/i,
  /years ago today/i,
  /throwback/i,
  /memory lane/i,
  /catch up/i,
  /keep going/i,
  /stay consistent/i,
  /don[’']t stop/i,
  /continue your journey/i,
  /healing you/i,
  /trauma recovery/i,
  /\bbreakthrough\b/i,
  /emotional diagnosis/i,
  /what this means/i,
  /unresolved issue/i,
  /subconscious pattern/i,
];

function isAllowedLiteral(literal) {
  return /\bno streaks\b/i.test(literal);
}

for (const file of governedSurfaces) {
  const source = read(file);
  const badLiteral = collectStringLiterals(source).find((literal) =>
    !isAllowedLiteral(literal) && forbiddenUserFacingCopy.some((pattern) => pattern.test(literal))
  );

  assert(!badLiteral, `${file} contains unsafe user-facing emotional language: "${badLiteral}"`);
}

const quarantinedSurfaces = [];

const retiredSurfaces = [
  'src/components/PredictiveAnalytics.tsx',
  'src/components/SmartJournalAnalyzer.tsx',
  'src/components/community/CollectiveExperiences.tsx',
  'src/components/community/StoryCreator.tsx',
  'src/components/community/WisdomLibrary.tsx',
  'src/components/community/GrowthHealingCircles.tsx',
  'src/components/community/HealingCircleManager.tsx',
  'src/components/CulturalChallengeLibrary.tsx.disabled',
  'src/components/MigrationPrompt.tsx',
  'src/app/pathways/enough-as-you-are/page.tsx.bak',
  'src/app/pathways/calm-the-storm/page.tsx.bak',
  'src/app/pathways/shadow-work/page.tsx.bak',
  'src/app/pathways/honoring-loss/page.tsx.bak',
];

for (const retiredSurface of retiredSurfaces) {
  assert(
    !fs.existsSync(path.join(repoRoot, retiredSurface)),
    `${retiredSurface} is retired and must not reappear without emotional-language review`
  );
}

const importableSources = [
  'src/app',
  'src/components',
  'src/hooks',
  'src/services',
];

function walkFiles(directory) {
  const absoluteDirectory = path.join(repoRoot, directory);
  if (!fs.existsSync(absoluteDirectory)) return [];

  return fs.readdirSync(absoluteDirectory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(absoluteDirectory, entry.name);
    const relativePath = path.relative(repoRoot, absolutePath);

    if (entry.isDirectory()) {
      return walkFiles(relativePath);
    }

    return /\.(tsx?|jsx?)$/.test(entry.name) ? [relativePath] : [];
  });
}

const allImportableFiles = importableSources.flatMap(walkFiles);

const staleSourceArtifacts = walkFiles('src').filter((file) => /\.(bak|disabled|old)$/.test(file));

assert(
  staleSourceArtifacts.length === 0,
  `stale source artifacts must be removed, found: ${staleSourceArtifacts.join(', ')}`
);

for (const quarantinedSurface of quarantinedSurfaces) {
  const basename = path.basename(quarantinedSurface, path.extname(quarantinedSurface));
  const importer = allImportableFiles.find((file) => {
    if (file === quarantinedSurface) return false;
    return new RegExp(`\\b${basename}\\b`).test(read(file));
  });

  assert(
    !importer,
    `${quarantinedSurface} is language-quarantined and must not be imported by ${importer}`
  );
}

console.log('Emotional language guardrails passed.');
