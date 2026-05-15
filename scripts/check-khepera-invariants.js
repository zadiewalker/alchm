#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const repoRoot = path.join(__dirname, '..')
const scanRoots = ['src/app', 'src/components', 'src/hooks', 'src/lib', 'src/services', 'functions/src']

const failures = []

function walkFiles(relativeRoot) {
  const absoluteRoot = path.join(repoRoot, relativeRoot)
  if (!fs.existsSync(absoluteRoot)) return []

  const files = []
  for (const entry of fs.readdirSync(absoluteRoot, { withFileTypes: true })) {
    const relativePath = path.join(relativeRoot, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'out') continue
      files.push(...walkFiles(relativePath))
      continue
    }
    if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(relativePath)
    }
  }
  return files
}

function report(file, message) {
  failures.push(`${file}: ${message}`)
}

const sourceFiles = scanRoots.flatMap(walkFiles)

for (const file of sourceFiles) {
  const text = fs.readFileSync(path.join(repoRoot, file), 'utf8')

  if (/from ['"]@\/lib\/api\/aiAnalysisApi['"]/.test(text) || /from ['"]@\/lib\/aiPrompts['"]/.test(text)) {
    report(file, 'live UI and services must not import legacy emotional analysis systems')
  }

  if (/\balchm-current-streak\b|\balchm-longest-streak\b|\bstreak_milestone\b|\bstage_progress\b/.test(text)) {
    report(file, 'streak and progress mechanics are forbidden in release code')
  }

  if (/\banalyticsEnabled\b|\bgrowthIndicators\b|\bhealing journey\b|\bAI companion\b|\btherapeutic suggestions\b|\bgenerateCompanionText\b/.test(text)) {
    report(file, 'emotional analytics, companion framing, and healing-journey language are forbidden in release code')
  }

  if (
    file.startsWith('functions/src/') &&
    /\b(?:openai|chat\.completions|emotionalAnalysis|growthIndicators|predictiveCrisis|personalizedIntervention|voiceAnalysis|pathway|therapeutic|healing\s+journey|progress\s+score)\b/i.test(text)
  ) {
    report(file, 'Firebase Functions must not reintroduce legacy AI analysis, predictive crisis, progress, or therapeutic systems')
  }

  if (/\b(?:window\.)?(?:localStorage|sessionStorage)\.clear\s*\(/.test(text)) {
    report(file, 'broad browser storage clearing is forbidden; use explicit ALCHM-owned keys only')
  }

  if (!file.startsWith('src/services/khepera/') && /\bcreateModelText\b/.test(text)) {
    report(file, 'direct model text access is restricted to canonical Khepera services')
  }

  if (file.startsWith('src/app/') && /\bgenerate(?:Safe)?KheperaResponse\b|\bgenerateCompanionText\b|\bgenerateKheperaResponse\b/.test(text)) {
    report(file, 'app routes must not generate Khepera output directly')
  }

  if (file.startsWith('src/app/') && /\bdetectCrisisLanguage\b/.test(text)) {
    report(file, 'app routes must not run post-reflection crisis checks; use the canonical submission pipeline')
  }
}

if (failures.length > 0) {
  console.error('Khepera invariant guard failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('Khepera invariant guard passed')
