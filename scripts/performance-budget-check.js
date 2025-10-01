#!/usr/bin/env node
/**
 * Performance Budget Build-Time Enforcement
 * Prevents Firebase App Hosting deployment of builds that don't meet trauma-informed standards
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Trauma-informed performance budgets (stricter than standard)
const PERFORMANCE_BUDGETS = {
  // Critical thresholds for crisis users
  maxBundleSize: 500000,    // 500KB total
  maxChunkSize: 244000,     // 244KB per chunk (2-3s on slow 3G)
  maxJSBundleSize: 200000,  // 200KB for JavaScript
  maxCSSBundleSize: 50000,  // 50KB for CSS
  maxImageSize: 100000,     // 100KB per image
  
  // Build performance thresholds
  maxBuildTime: 300000,     // 5 minutes max build time
  maxMemoryUsage: 4096,     // 4GB max memory usage
}

const CRITICAL_PAGES = [
  '/',
  '/crisis-support',
  '/journal',
  '/auth/login'
]

class BuildPerformanceEnforcer {
  constructor() {
    this.violations = []
    this.buildStartTime = Date.now()
    this.buildStats = null
  }

  async enforceBudgets() {
    console.log('🎯 Enforcing trauma-informed performance budgets...\n')
    
    try {
      // Check if build artifacts exist
      await this.checkBuildArtifacts()
      
      // Analyze bundle sizes
      await this.analyzeBundleSizes()
      
      // Check build performance
      this.checkBuildPerformance()
      
      // Check critical file sizes
      await this.checkCriticalFiles()
      
      // Generate report
      const report = this.generateReport()
      
      // Write report to file
      this.saveReport(report)
      
      // Determine if build should fail
      const shouldFail = this.shouldFailBuild()
      
      if (shouldFail) {
        this.displayFailureReport()
        process.exit(1)
      } else {
        this.displaySuccessReport()
        process.exit(0)
      }
      
    } catch (error) {
      console.error('❌ Performance budget check failed:', error.message)
      process.exit(1)
    }
  }

  async checkBuildArtifacts() {
    const buildDir = path.join(process.cwd(), '.next')
    
    if (!fs.existsSync(buildDir)) {
      throw new Error('Build artifacts not found. Run "npm run build" first.')
    }
    
    // Check for build manifest
    const buildManifest = path.join(buildDir, 'build-manifest.json')
    if (fs.existsSync(buildManifest)) {
      this.buildStats = JSON.parse(fs.readFileSync(buildManifest, 'utf8'))
    }
    
    console.log('✅ Build artifacts found')
  }

  async analyzeBundleSizes() {
    const staticDir = path.join(process.cwd(), '.next', 'static')
    
    if (!fs.existsSync(staticDir)) {
      console.log('⚠️ Static directory not found, skipping bundle analysis')
      return
    }
    
    const chunks = this.getAllChunks(staticDir)
    let totalSize = 0
    let totalJSSize = 0
    let totalCSSSize = 0
    
    for (const chunk of chunks) {
      const stats = fs.statSync(chunk.path)
      const size = stats.size
      totalSize += size
      
      if (chunk.path.endsWith('.js')) {
        totalJSSize += size
        
        // Check individual chunk size
        if (size > PERFORMANCE_BUDGETS.maxChunkSize) {
          this.addViolation({
            type: 'chunk_size',
            file: chunk.name,
            current: size,
            budget: PERFORMANCE_BUDGETS.maxChunkSize,
            severity: 'error',
            impact: 'Large chunks slow initial load for crisis users'
          })
        }
      } else if (chunk.path.endsWith('.css')) {
        totalCSSSize += size
      }
    }
    
    // Check total bundle size
    if (totalSize > PERFORMANCE_BUDGETS.maxBundleSize) {
      this.addViolation({
        type: 'total_bundle_size',
        current: totalSize,
        budget: PERFORMANCE_BUDGETS.maxBundleSize,
        severity: 'error',
        impact: 'Large bundle increases load time for trauma-informed users'
      })
    }
    
    // Check JS bundle size
    if (totalJSSize > PERFORMANCE_BUDGETS.maxJSBundleSize) {
      this.addViolation({
        type: 'js_bundle_size',
        current: totalJSSize,
        budget: PERFORMANCE_BUDGETS.maxJSBundleSize,
        severity: 'error',
        impact: 'Large JavaScript bundle blocks main thread execution'
      })
    }
    
    // Check CSS bundle size
    if (totalCSSSize > PERFORMANCE_BUDGETS.maxCSSBundleSize) {
      this.addViolation({
        type: 'css_bundle_size',
        current: totalCSSSize,
        budget: PERFORMANCE_BUDGETS.maxCSSBundleSize,
        severity: 'warning',
        impact: 'Large CSS delays first contentful paint'
      })
    }
    
    console.log(`📦 Bundle analysis complete:`)
    console.log(`   Total: ${this.formatBytes(totalSize)} / ${this.formatBytes(PERFORMANCE_BUDGETS.maxBundleSize)}`)
    console.log(`   JS: ${this.formatBytes(totalJSSize)} / ${this.formatBytes(PERFORMANCE_BUDGETS.maxJSBundleSize)}`)
    console.log(`   CSS: ${this.formatBytes(totalCSSSize)} / ${this.formatBytes(PERFORMANCE_BUDGETS.maxCSSBundleSize)}`)
  }

  getAllChunks(staticDir) {
    const chunks = []
    
    const scanDirectory = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        
        if (entry.isDirectory()) {
          scanDirectory(fullPath)
        } else if (entry.name.endsWith('.js') || entry.name.endsWith('.css')) {
          chunks.push({
            name: entry.name,
            path: fullPath
          })
        }
      }
    }
    
    scanDirectory(staticDir)
    return chunks
  }

  checkBuildPerformance() {
    const buildTime = Date.now() - this.buildStartTime
    
    // Check build time
    if (buildTime > PERFORMANCE_BUDGETS.maxBuildTime) {
      this.addViolation({
        type: 'build_time',
        current: buildTime,
        budget: PERFORMANCE_BUDGETS.maxBuildTime,
        severity: 'warning',
        impact: 'Long build times indicate potential performance issues'
      })
    }
    
    // Check memory usage (if available)
    try {
      const memUsage = process.memoryUsage()
      const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024)
      
      if (memUsageMB > PERFORMANCE_BUDGETS.maxMemoryUsage) {
        this.addViolation({
          type: 'memory_usage',
          current: memUsageMB,
          budget: PERFORMANCE_BUDGETS.maxMemoryUsage,
          severity: 'warning',
          impact: 'High memory usage may cause build failures in CI/CD'
        })
      }
    } catch (error) {
      // Memory usage check failed, continue
    }
    
    console.log(`⏱️ Build time: ${Math.round(buildTime / 1000)}s`)
  }

  async checkCriticalFiles() {
    // Check public directory for large images
    const publicDir = path.join(process.cwd(), 'public')
    
    if (fs.existsSync(publicDir)) {
      const images = this.getImageFiles(publicDir)
      
      for (const image of images) {
        const stats = fs.statSync(image.path)
        
        if (stats.size > PERFORMANCE_BUDGETS.maxImageSize) {
          this.addViolation({
            type: 'image_size',
            file: image.name,
            current: stats.size,
            budget: PERFORMANCE_BUDGETS.maxImageSize,
            severity: 'warning',
            impact: 'Large images slow page load, especially on mobile'
          })
        }
      }
    }
    
    console.log('🖼️ Image analysis complete')
  }

  getImageFiles(dir) {
    const images = []
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']
    
    const scanDirectory = (currentDir) => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name)
        
        if (entry.isDirectory()) {
          scanDirectory(fullPath)
        } else {
          const ext = path.extname(entry.name).toLowerCase()
          if (imageExtensions.includes(ext)) {
            images.push({
              name: entry.name,
              path: fullPath
            })
          }
        }
      }
    }
    
    scanDirectory(dir)
    return images
  }

  addViolation(violation) {
    this.violations.push({
      ...violation,
      timestamp: Date.now(),
      percentage: violation.budget ? Math.round(((violation.current - violation.budget) / violation.budget) * 100) : 0
    })
  }

  shouldFailBuild() {
    // Fail build if there are any error-level violations
    return this.violations.some(v => v.severity === 'error')
  }

  generateReport() {
    const errorCount = this.violations.filter(v => v.severity === 'error').length
    const warningCount = this.violations.filter(v => v.severity === 'warning').length
    
    return {
      timestamp: new Date().toISOString(),
      buildTime: Date.now() - this.buildStartTime,
      summary: {
        total: this.violations.length,
        errors: errorCount,
        warnings: warningCount,
        passed: errorCount === 0
      },
      violations: this.violations,
      budgets: PERFORMANCE_BUDGETS
    }
  }

  saveReport(report) {
    const reportPath = path.join(process.cwd(), 'performance-budget-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`📊 Report saved to ${reportPath}`)
  }

  displaySuccessReport() {
    const report = this.generateReport()
    
    console.log('\n✅ PERFORMANCE BUDGET CHECK PASSED')
    console.log('=====================================')
    
    if (report.summary.warnings > 0) {
      console.log(`⚠️ ${report.summary.warnings} warning(s) found - consider optimizing`)
      this.violations.filter(v => v.severity === 'warning').forEach(v => {
        console.log(`   • ${v.type}: ${this.formatViolation(v)}`)
      })
    } else {
      console.log('🎯 All performance budgets met!')
      console.log('🚀 Ready for trauma-informed deployment')
    }
    
    console.log(`\n📊 Build completed in ${Math.round(report.buildTime / 1000)}s`)
  }

  displayFailureReport() {
    const report = this.generateReport()
    
    console.error('\n❌ PERFORMANCE BUDGET CHECK FAILED')
    console.error('===================================')
    console.error('🚨 CRITICAL: Build blocked due to performance violations')
    console.error('These issues must be fixed to protect crisis users:\n')
    
    this.violations.filter(v => v.severity === 'error').forEach(v => {
      console.error(`❌ ${v.type.toUpperCase()}:`)
      console.error(`   Current: ${this.formatViolation(v)}`)
      console.error(`   Impact: ${v.impact}`)
      console.error(`   Recommendations: ${this.getRecommendations(v.type)}\n`)
    })
    
    if (report.summary.warnings > 0) {
      console.error('⚠️ Additional warnings:')
      this.violations.filter(v => v.severity === 'warning').forEach(v => {
        console.error(`   • ${v.type}: ${this.formatViolation(v)}`)
      })
    }
    
    console.error('\n🔧 Fix these issues and run "npm run build" again')
  }

  formatViolation(violation) {
    const current = violation.type.includes('time') 
      ? `${Math.round(violation.current / 1000)}s`
      : this.formatBytes(violation.current)
    
    const budget = violation.type.includes('time')
      ? `${Math.round(violation.budget / 1000)}s`
      : this.formatBytes(violation.budget)
    
    const file = violation.file ? ` (${violation.file})` : ''
    const percentage = violation.percentage > 0 ? ` (+${violation.percentage}%)` : ''
    
    return `${current} / ${budget}${file}${percentage}`
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  getRecommendations(type) {
    const recommendations = {
      chunk_size: 'Implement code splitting, use dynamic imports, remove unused dependencies',
      total_bundle_size: 'Enable compression, implement tree shaking, audit dependencies',
      js_bundle_size: 'Split JavaScript bundles, defer non-critical scripts, use web workers',
      css_bundle_size: 'Remove unused CSS, inline critical styles, use CSS optimization tools',
      image_size: 'Compress images, use modern formats (WebP/AVIF), implement responsive images',
      build_time: 'Optimize build process, use build caching, reduce dependency complexity',
      memory_usage: 'Optimize memory usage during build, use incremental builds'
    }
    
    return recommendations[type] || 'Review and optimize the identified resource'
  }
}

// Run the enforcer
if (require.main === module) {
  const enforcer = new BuildPerformanceEnforcer()
  enforcer.enforceBudgets().catch(error => {
    console.error('Performance budget enforcement failed:', error)
    process.exit(1)
  })
}

module.exports = BuildPerformanceEnforcer