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
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/auth/login/page.tsx',
  'src/app/auth/signup/page.tsx',
  'src/app/dashboard/DashboardClient.tsx',
  'src/app/community/page.tsx',
  'src/app/insights/page.tsx',
  'src/app/onboarding/page.tsx',
  'src/app/pathways/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/journal/page.tsx',
  'src/app/terms/page.tsx',
  'src/components/journal/JournalFlow.tsx',
  'src/components/HealthDisclaimer.tsx',
  'src/components/ui/FooterNav.tsx',
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
  /healing sanctuary/i,
  /healing and transformation/i,
  /begin your journey/i,
  /companion in reflection/i,
  /go deeper/i,
  /AI companion/i,
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

const quarantinedSurfaces = [
  'src/components/PredictiveAnalytics.tsx',
  'src/components/SmartJournalAnalyzer.tsx',
  'src/components/community/CollectiveExperiences.tsx',
  'src/components/community/StoryCreator.tsx',
  'src/components/community/WisdomLibrary.tsx',
  'src/components/community/GrowthHealingCircles.tsx',
  'src/components/community/HealingCircleManager.tsx',
  'src/components/MigrationPrompt.tsx',
  'src/components/JournalSuccessCeremony.tsx',
];

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
