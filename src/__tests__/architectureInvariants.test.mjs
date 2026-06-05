import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(src, '..');
const read = (relativePath) => fs.readFileSync(path.join(repo, relativePath), 'utf8');

function filesUnder(relativeDirectory) {
  const root = path.join(repo, relativeDirectory);
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(ts|tsx|js|mjs)$/.test(entry.name) && !entry.name.endsWith('.disabled'))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

function sourceUnder(...directories) {
  return directories
    .flatMap(filesUnder)
    .map((filename) => fs.readFileSync(filename, 'utf8'))
    .join('\n');
}

test('production build configuration does not bypass TypeScript or ESLint failures', () => {
  const nextConfig = read('next.config.js');
  assert.doesNotMatch(nextConfig, /ignoreBuildErrors\s*:\s*true/);
  assert.doesNotMatch(nextConfig, /ignoreDuringBuilds\s*:\s*true/);
});

test('legacy clinical, analysis, subscription, and raw-storage data modules cannot be imported live', () => {
  const liveSource = sourceUnder('src/app', 'src/components', 'src/hooks', 'src/services');
  assert.doesNotMatch(
    liveSource,
    /@\/lib\/(?:crisisDetection|offlineCrisisDetection|api\/aiAnalysisApi|aiPrompts|subscription|dataService|pathways|onboarding|settings|storageKeys)/,
  );
});

test('presentation does not directly call clinical generation, crisis, community persistence, or browser storage', () => {
  const presentation = sourceUnder('src/app', 'src/components');
  assert.doesNotMatch(presentation, /localStorage|sessionStorage/);
  assert.doesNotMatch(
    presentation,
    /@\/services\/(?:journal\/submissionPipeline|khepera\/|mirror\/mirrorService|community\/communityService|containers\/arcGeneration)/,
  );
  assert.doesNotMatch(presentation, /from ['"](?:firebase|@anthropic-ai|openai|@capacitor\/core)/);

  filesUnder('src/app').concat(filesUnder('src/components')).forEach((filename) => {
    const source = fs.readFileSync(filename, 'utf8');
    assert.doesNotMatch(
      source,
      /(?:^|\n)import(?!\s+type\b)[^;]*from\s+['"]@\/services\//s,
      `${path.relative(repo, filename)} must access services through hooks/controllers`,
    );
    assert.doesNotMatch(
      source,
      /import\(\s*['"]@\/services\//,
      `${path.relative(repo, filename)} must not dynamically import services`,
    );
  });
});

test('config is static and hooks route browser storage through services', () => {
  const storageConfig = read('src/config/storageKeys.ts');
  const hooks = sourceUnder('src/hooks');
  assert.doesNotMatch(storageConfig, /@\/utils\/storage|localStorage|sessionStorage/);
  assert.doesNotMatch(
    storageConfig,
    /export\s+(?:function|const)\s+(?:migrate|sanitize|clear|complete|isOnboarding|hasCompleted)/,
  );
  assert.doesNotMatch(hooks, /@\/utils\/storage|localStorage|sessionStorage/);
});

test('retired product-drift routes and active user surfaces do not reintroduce progress pressure', () => {
  assert.equal(fs.existsSync(path.join(repo, 'src/app/api/soulfund/route.ts')), false);
  assert.equal(fs.existsSync(path.join(repo, 'src/app/soulfund/SoulFundClient.tsx')), false);
  assert.equal(fs.existsSync(path.join(repo, 'src/lib/pathways.ts')), false);
  assert.equal(fs.existsSync(path.join(repo, 'src/lib/onboarding.ts')), false);
  assert.equal(fs.existsSync(path.join(repo, 'src/lib/settings.ts')), false);
  assert.equal(fs.existsSync(path.join(repo, 'src/lib/storageKeys.ts')), false);
  assert.equal(fs.existsSync(path.join(repo, 'src/components/ErrorBoundary.tsx')), false);
  const surfaces = [
    'src/app/journal/new/page.tsx',
    'src/app/checkin/page.tsx',
    'src/app/onboarding/page.tsx',
    'src/app/dashboard/DashboardClient.tsx',
    'src/app/mirror/page.tsx',
    'src/components/return/ReturnThresholdScreen.tsx',
    'src/app/containers/page.tsx',
  ].map(read).join('\n');
  assert.doesNotMatch(surfaces, /\b(?:streak|missed|habit|productivity|score|reward|badge)\b/i);
  assert.doesNotMatch(surfaces, /\b\d+\s+days?\s+(?:ago|earlier|away)\b/i);
});

test('Khepera memory and crisis implementation remain narrow', () => {
  const memoryType = read('src/types/khepera.ts');
  const memoryBlock = memoryType.slice(
    memoryType.indexOf('export interface KheperaMemory'),
    memoryType.indexOf('}', memoryType.indexOf('export interface KheperaMemory')) + 1,
  );
  assert.match(memoryBlock, /themeTags: ThemeTag\[\]/);
  assert.match(memoryBlock, /emotionalTone: EmotionalTone/);
  assert.doesNotMatch(memoryBlock, /entryText|seed|sessionCount|recent|return|timestamp/i);

  const implementationSources = filesUnder('src/services')
    .filter((filename) => filename.endsWith('.ts'))
    .filter((filename) => /export function detectCrisisSignals/.test(fs.readFileSync(filename, 'utf8')));
  assert.deepEqual(
    implementationSources.map((filename) => path.relative(repo, filename)),
    ['src/services/khepera/crisisDetection.ts'],
  );
});

test('queue claims are transactional and ownership is verified before generation', () => {
  const queue = read('src/services/offline/localQueue.ts');
  const processor = read('src/services/journal/processQueuedEntry.ts');
  const lease = read('src/services/offline/queueLease.ts');
  assert.match(queue, /const LEGACY_DATABASE_NAME = 'keyval-store'/);
  assert.match(queue, /const LEGACY_STORE_NAME = 'keyval'/);
  assert.match(queue, /migrateLegacyQueueEntries[\s\S]*readLegacyKeys[\s\S]*writeValue\(queueKey, legacyEntry\)/);
  assert.match(queue, /export async function getAllQueuedEntries\(\)[\s\S]*await ensureLegacyQueueMigrated\(\)/);
  assert.match(queue, /claimQueueEntry[\s\S]*transaction\(STORE_NAME, 'readwrite'\)/);
  assert.match(queue, /export async function verifyQueueClaim/);
  assert.doesNotMatch(processor, /crisis_remote_persistence_unavailable/);
  assert.match(processor, /if \(isCrisis\) \{[\s\S]*buildCompletedQueueUpdate\(entry, resolvedUserId/);
  const assertion = processor.indexOf('await assertClaimOwnership();');
  const model = processor.indexOf('await deps.generateSafeKheperaResponse({');
  assert.ok(assertion !== -1 && model !== -1 && assertion < model);
  assert.match(processor, /buildCompletedQueueUpdate/);
  assert.match(lease, /entryText: ''/);
});

test('canonical Firestore user paths remain owner-scoped', () => {
  const rules = read('firestore.rules');
  assert.match(rules, /match \/users\/\{userId\}\/sessions\/\{sessionId\}/);
  assert.match(rules, /match \/users\/\{userId\}\/khepera\/\{documentId\}/);
  assert.doesNotMatch(rules, /match \/users\/\{userId\}\/\{document=\*\*\}/);
  assert.match(rules, /request\.auth\.uid == userId/);
  assert.match(rules, /match \/\{document=\*\*\} \{\s*allow read, write: if false;/s);
});

test('resume and native listeners preserve queue retry and dispose on remount', () => {
  const syncHook = read('src/hooks/useOfflineSync.ts');
  const notificationRouter = read('src/services/notifications/notificationRouter.ts');
  const notificationHook = read('src/hooks/useNotificationRouting.ts');
  assert.match(syncHook, /document\.addEventListener\('visibilitychange'/);
  assert.match(syncHook, /document\.removeEventListener\('visibilitychange'/);
  assert.match(notificationRouter, /handles\.push\(await App\.addListener\('appStateChange'/);
  assert.match(notificationRouter, /handles\.map\(\(handle\) => handle\.remove\(\)\)/);
  assert.match(notificationHook, /removeNativeListeners/);
});

test('lockdown patch does not add unsafe TypeScript suppressions', () => {
  const guarded = [
    'src/services/offline/localQueue.ts',
    'src/services/journal/processQueuedEntry.ts',
    'src/services/journal/submissionPipeline.ts',
    'src/hooks/useStandaloneJournalSubmission.ts',
    'src/hooks/useCommunityReflections.ts',
    'src/hooks/useMirrorWorkflows.ts',
    'src/hooks/useContainerReflectionCopy.ts',
    'src/hooks/useMedicalDisclaimer.ts',
    'src/hooks/useSubscriptionController.ts',
    'src/hooks/usePaywallController.ts',
    'src/hooks/useNotificationRouting.ts',
    'src/hooks/useSplashScreenDismissal.ts',
    'src/hooks/useOperationalEvents.ts',
    'src/hooks/useReturnNavigation.ts',
    'src/hooks/useSubmissionErrorMessage.ts',
  ].map(read).join('\n');
  assert.doesNotMatch(guarded, /as any|@ts-ignore|@ts-expect-error/);
});

test('live TypeScript does not use unsafe casts, ignores, or property non-null assertions', () => {
  const liveSource = sourceUnder('src/app', 'src/components', 'src/hooks', 'src/services');
  assert.doesNotMatch(liveSource, /as unknown as|as any|@ts-ignore|@ts-expect-error|!\./);
});

test('release backend does not ship noncanonical generation or gamification surfaces', () => {
  const entrypoints = [
    read('functions/src/index.ts'),
    read('functions/lib/index.js'),
  ].join('\n');
  const firebase = read('firebase.json');
  const removedModules = [
    'functions/src/aiService.ts',
    'functions/src/crisisDetection.ts',
    'functions/src/pathwaySystem.ts',
    'functions/src/personalizedInterventionService.ts',
    'functions/src/predictiveCrisisService.ts',
    'functions/src/voiceAnalysisService.ts',
    'functions/lib/aiService.js',
    'functions/lib/crisisDetection.js',
    'functions/lib/pathwaySystem.js',
    'functions/lib/personalizedInterventionService.js',
    'functions/lib/predictiveCrisisService.js',
    'functions/lib/voiceAnalysisService.js',
  ];

  assert.equal(fs.existsSync(path.join(repo, 'alchm-v2')), false);
  assert.equal(fs.existsSync(path.join(repo, 'alchm-vite')), false);
  assert.equal(fs.existsSync(path.join(repo, 'functions/functions')), false);
  removedModules.forEach((relativePath) => {
    assert.equal(fs.existsSync(path.join(repo, relativePath)), false, `${relativePath} must not ship`);
  });
  assert.doesNotMatch(
    entrypoints,
    /from ['"]openai['"]|require\(['"]openai['"]\)|api\.anthropic\.com|chat\.completions\.create|messages\.create/,
  );
  assert.doesNotMatch(entrypoints, /\b(?:currentStreak|longestStreak|gamification|streakDays|badge_earned)\b/i);
  assert.doesNotMatch(
    firebase,
    /"source":\s*"\/api\/(?:khepera|crisis-detection)[^"]*"[\s\S]*?"function":\s*"crisisDetection"/,
  );
});

test('subscription diagnostics omit key-derived and user-derived identifiers', () => {
  const diagnostics = [
    read('src/services/subscriptions/nativeSubscriptionUiService.ts'),
    read('src/services/subscriptions/revenueCatService.ts'),
    read('src/components/subscriptions/SubscriptionDiagnosticsPanel.tsx'),
  ].join('\n');

  assert.doesNotMatch(
    diagnostics,
    /apiKeyFingerprint|apiKeyPrefix|nativeApiKeyFingerprint|nativeApiKeyPrefix|sdkAppUserIdFingerprint/,
  );
});
