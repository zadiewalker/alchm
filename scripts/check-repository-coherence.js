#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const repoRoot = path.join(__dirname, '..')

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
}

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath))
}

function assert(condition, message) {
  if (!condition) {
    console.error(`Repository coherence guard failed: ${message}`)
    process.exitCode = 1
  }
}

function walkFiles(relativeRoot) {
  const absoluteRoot = path.join(repoRoot, relativeRoot)
  if (!fs.existsSync(absoluteRoot)) return []

  const files = []
  const entries = fs.readdirSync(absoluteRoot, { withFileTypes: true })

  for (const entry of entries) {
    const relativePath = path.join(relativeRoot, entry.name)

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'out') {
        continue
      }
      files.push(...walkFiles(relativePath))
      continue
    }

    if (entry.isFile()) {
      files.push(relativePath)
    }
  }

  return files
}

const requiredDocs = [
  'README.md',
  'CONTRIBUTING.md',
  'docs/emotional-language-governance.md',
  'docs/operational-trustworthiness.md',
  'docs/repository-coherence.md',
]

for (const requiredDoc of requiredDocs) {
  assert(exists(requiredDoc), `${requiredDoc} must exist`)
}

const packageJson = JSON.parse(readText('package.json'))
const scripts = packageJson.scripts || {}

assert(
  typeof scripts.build === 'string' && scripts.build.startsWith('node scripts/prepare-next-build.js && next build'),
  'package.json build script must use scripts/prepare-next-build.js before next build'
)
assert(
  typeof scripts['qa:governance'] === 'string' && scripts['qa:governance'].includes('qa:repository-coherence'),
  'qa:governance must include qa:repository-coherence'
)
assert(
  scripts['qa:repository-coherence'] === 'node scripts/check-repository-coherence.js',
  'qa:repository-coherence must run scripts/check-repository-coherence.js'
)

const validateWorkflow = readText('.github/workflows/validate.yml')
assert(
  validateWorkflow.includes('npm run qa:governance'),
  '.github/workflows/validate.yml must run npm run qa:governance'
)

const retiredWorkflowRefs = [
  'check-seed-return-guards',
  'check-notification-routes',
  'check-no-manual-return-url-construction',
  'check-no-return-threshold-bypass',
  'check-no-legacy-imports',
]

for (const retiredWorkflowRef of retiredWorkflowRefs) {
  assert(
    !validateWorkflow.includes(retiredWorkflowRef),
    `.github/workflows/validate.yml must not reference retired ${retiredWorkflowRef}`
  )
}

const rootBuildArtifacts = fs
  .readdirSync(repoRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => /^\.next(?: |.__trash__)/.test(name) || /^out(?: |.__trash__)/.test(name))
  .sort()

const rootDuplicateFiles = fs
  .readdirSync(repoRoot, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => /(?: 2\.(?:js|json|tsbuildinfo)|\.(?:bak|backup|disabled|old))$/.test(name))
  .sort()

if (rootBuildArtifacts.length > 0 || rootDuplicateFiles.length > 0) {
  const messages = []

  if (rootBuildArtifacts.length > 0) {
    messages.push(`duplicate root build artifacts are not allowed:\n${rootBuildArtifacts.join('\n')}`)
  }

  if (rootDuplicateFiles.length > 0) {
    messages.push(`duplicate or stale root files are not allowed:\n${rootDuplicateFiles.join('\n')}`)
  }

  console.error(`Repository coherence guard failed: ${messages.join('\n\n')}`)
  process.exit(1)
}

const staleArtifactRoots = ['src', 'scripts', 'docs', '.github']
const staleArtifacts = staleArtifactRoots
  .flatMap((root) => walkFiles(root))
  .filter((file) => /\.(bak|backup|disabled|old)$/.test(file))

assert(
  staleArtifacts.length === 0,
  `stale source artifacts are not allowed:\n${staleArtifacts.join('\n')}`
)

const staleCommentMarkers = staleArtifactRoots
  .flatMap((root) => walkFiles(root))
  .filter((file) => /\.(js|jsx|mjs|cjs|ts|tsx|md|yml|yaml)$/.test(file))
  .flatMap((file) => {
    const lines = readText(file).split('\n')
    const staleMarkerPattern = new RegExp(`\\b(${['TO' + 'DO', 'FIX' + 'ME', 'HA' + 'CK', 'XX' + 'X'].join('|')})\\b`)

    return lines
      .map((line, index) => ({ file, line, lineNumber: index + 1 }))
      .filter(({ line }) => staleMarkerPattern.test(line))
      .map(({ file, line, lineNumber }) => `${file}:${lineNumber}: ${line.trim()}`)
  })

assert(
  staleCommentMarkers.length === 0,
  `stale comment markers are not allowed:\n${staleCommentMarkers.join('\n')}`
)

const repositoryCoherenceDoc = readText('docs/repository-coherence.md')
for (const legacyRoot of ['alchm-v2/', 'alchm-vite/']) {
  assert(
    repositoryCoherenceDoc.includes(legacyRoot),
    `${legacyRoot} retirement must be documented in docs/repository-coherence.md`
  )
}

const trackedFiles = execFileSync('git', ['ls-files'], {
  cwd: repoRoot,
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean)

for (const legacyRoot of ['alchm-v2/', 'alchm-vite/']) {
  const trackedLegacyFiles = trackedFiles.filter((file) => file.startsWith(legacyRoot))
  assert(
    trackedLegacyFiles.length === 0,
    `${legacyRoot} must not contain tracked files:\n${trackedLegacyFiles.join('\n')}`
  )
}

for (const generatedRoot of ['functions/lib/', 'functions/node_modules/']) {
  const trackedGeneratedFiles = trackedFiles.filter((file) => file.startsWith(generatedRoot))
  assert(
    trackedGeneratedFiles.length === 0,
    `${generatedRoot} must not contain tracked files:\n${trackedGeneratedFiles.join('\n')}`
  )
}

for (const duplicateIosRoot of ['ios/App 2/', 'ios/capacitor-cordova-ios-plugins 2/']) {
  const trackedDuplicateIosFiles = trackedFiles.filter((file) => file.startsWith(duplicateIosRoot))
  assert(
    trackedDuplicateIosFiles.length === 0,
    `${duplicateIosRoot} must not contain tracked files:\n${trackedDuplicateIosFiles.join('\n')}`
  )
}

const retiredFunctionSources = [
  'functions/src/aiService.ts',
  'functions/src/prompts.ts',
  'functions/src/types.ts',
  'functions/src/crisisDetection.ts',
  'functions/src/crisisMonitoring.ts',
  'functions/src/pathwaySystem.ts',
  'functions/src/predictiveCrisisService.ts',
  'functions/src/personalizedInterventionService.ts',
  'functions/src/voiceAnalysisService.ts',
]

const trackedRetiredFunctionSources = retiredFunctionSources.filter((file) => trackedFiles.includes(file))
assert(
  trackedRetiredFunctionSources.length === 0,
  `retired Firebase Functions AI and therapeutic surfaces must not be tracked:\n${trackedRetiredFunctionSources.join('\n')}`
)

if (process.exitCode) {
  process.exit(process.exitCode)
}

console.log('Repository coherence guard passed')
