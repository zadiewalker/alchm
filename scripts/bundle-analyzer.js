// Bundle analyzer script for ALCHM performance optimization
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const fs = require('fs')
const path = require('path')

// Configuration for bundle analysis
const BUNDLE_ANALYZE_CONFIG = {
  analyzerMode: 'server',
  analyzerHost: '127.0.0.1',
  analyzerPort: 8888,
  reportFilename: 'bundle-report.html',
  defaultSizes: 'parsed',
  openAnalyzer: true,
  generateStatsFile: true,
  statsFilename: 'bundle-stats.json',
  statsOptions: null,
  logLevel: 'info'
}

// Bundle size thresholds (in bytes)
const SIZE_THRESHOLDS = {
  // Individual chunk limits
  MAX_CHUNK_SIZE: 250 * 1024, // 250KB
  MAX_INITIAL_CHUNK: 500 * 1024, // 500KB
  
  // Total bundle limits
  MAX_TOTAL_JS: 1024 * 1024, // 1MB
  MAX_TOTAL_CSS: 100 * 1024, // 100KB
  
  // Asset limits
  MAX_IMAGE_SIZE: 500 * 1024, // 500KB
  MAX_FONT_SIZE: 100 * 1024, // 100KB
}

// Critical performance packages to monitor
const CRITICAL_PACKAGES = [
  'react',
  'react-dom',
  'next',
  'firebase',
  '@firebase/firestore',
  '@firebase/auth',
  'firebase-functions',
  '@google/generative-ai',
  'stripe'
]

// Generate bundle analysis report
function generateBundleReport(statsFile) {
  if (!fs.existsSync(statsFile)) {
    console.error('❌ Bundle stats file not found:', statsFile)
    return
  }

  const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'))
  const chunks = stats.chunks || []
  const assets = stats.assets || []
  const modules = stats.modules || []

  console.log('\n📊 ALCHM Bundle Analysis Report')
  console.log('=' .repeat(50))

  // Analyze chunks
  console.log('\n🧩 Chunk Analysis:')
  const chunkSizes = chunks.map(chunk => ({
    name: chunk.names[0] || 'unnamed',
    size: chunk.size,
    files: chunk.files
  })).sort((a, b) => b.size - a.size)

  chunkSizes.forEach(chunk => {
    const sizeMB = (chunk.size / 1024 / 1024).toFixed(2)
    const status = chunk.size > SIZE_THRESHOLDS.MAX_CHUNK_SIZE ? '⚠️' : '✅'
    console.log(`  ${status} ${chunk.name}: ${sizeMB}MB`)
  })

  // Analyze assets
  console.log('\n📦 Asset Analysis:')
  const assetsByType = assets.reduce((acc, asset) => {
    const ext = path.extname(asset.name).toLowerCase()
    if (!acc[ext]) acc[ext] = { count: 0, totalSize: 0, files: [] }
    acc[ext].count++
    acc[ext].totalSize += asset.size
    acc[ext].files.push(asset)
    return acc
  }, {})

  Object.entries(assetsByType).forEach(([ext, data]) => {
    const sizeMB = (data.totalSize / 1024 / 1024).toFixed(2)
    console.log(`  ${ext || 'no-ext'}: ${data.count} files, ${sizeMB}MB total`)
  })

  // Analyze large modules
  console.log('\n📚 Large Modules (>50KB):')
  const largeModules = modules
    .filter(module => module.size > 50 * 1024)
    .sort((a, b) => b.size - a.size)
    .slice(0, 20)

  largeModules.forEach(module => {
    const sizeKB = (module.size / 1024).toFixed(1)
    const name = module.name.replace(/^.*node_modules\//, '')
    console.log(`  📦 ${name}: ${sizeKB}KB`)
  })

  // Analyze critical packages
  console.log('\n🔍 Critical Package Analysis:')
  CRITICAL_PACKAGES.forEach(pkg => {
    const pkgModules = modules.filter(module => 
      module.name.includes(`node_modules/${pkg}/`)
    )
    
    if (pkgModules.length > 0) {
      const totalSize = pkgModules.reduce((sum, mod) => sum + mod.size, 0)
      const sizeKB = (totalSize / 1024).toFixed(1)
      console.log(`  📦 ${pkg}: ${sizeKB}KB (${pkgModules.length} modules)`)
    }
  })

  // Generate optimization recommendations
  generateOptimizationRecommendations(stats)
}

function generateOptimizationRecommendations(stats) {
  console.log('\n🚀 Optimization Recommendations:')
  
  const recommendations = []
  const chunks = stats.chunks || []
  const modules = stats.modules || []

  // Check for large chunks
  const largeChunks = chunks.filter(chunk => chunk.size > SIZE_THRESHOLDS.MAX_CHUNK_SIZE)
  if (largeChunks.length > 0) {
    recommendations.push({
      type: 'chunk-splitting',
      message: `${largeChunks.length} chunks exceed 250KB. Consider code splitting.`,
      priority: 'high'
    })
  }

  // Check for duplicate dependencies
  const packageCounts = {}
  modules.forEach(module => {
    const match = module.name.match(/node_modules\/([^\/]+)/)
    if (match) {
      const pkg = match[1]
      packageCounts[pkg] = (packageCounts[pkg] || 0) + 1
    }
  })

  const duplicatePackages = Object.entries(packageCounts)
    .filter(([pkg, count]) => count > 5)
    .sort((a, b) => b[1] - a[1])

  if (duplicatePackages.length > 0) {
    recommendations.push({
      type: 'deduplication',
      message: `Found duplicate imports: ${duplicatePackages.slice(0, 3).map(([pkg]) => pkg).join(', ')}`,
      priority: 'medium'
    })
  }

  // Check for tree shaking opportunities
  const largeLodashUsage = modules.find(module => 
    module.name.includes('lodash') && module.size > 50 * 1024
  )
  if (largeLodashUsage) {
    recommendations.push({
      type: 'tree-shaking',
      message: 'Large lodash usage detected. Use specific imports instead.',
      priority: 'high'
    })
  }

  // Check for moment.js (should use date-fns instead)
  const momentUsage = modules.find(module => module.name.includes('moment'))
  if (momentUsage) {
    recommendations.push({
      type: 'package-replacement',
      message: 'Moment.js detected. Consider switching to date-fns for smaller bundle.',
      priority: 'medium'
    })
  }

  // Display recommendations
  recommendations.forEach((rec, index) => {
    const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢'
    console.log(`  ${priority} ${index + 1}. ${rec.message}`)
  })

  if (recommendations.length === 0) {
    console.log('  ✅ No major optimization opportunities detected!')
  }
}

// Check if running as script
if (require.main === module) {
  const statsFile = process.argv[2] || '.next/analyze/bundle-stats.json'
  generateBundleReport(statsFile)
}

module.exports = {
  BUNDLE_ANALYZE_CONFIG,
  SIZE_THRESHOLDS,
  generateBundleReport
}