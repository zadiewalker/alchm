#!/usr/bin/env node

/**
 * ALCHM Bundle Analysis Script
 * 
 * Analyzes JavaScript bundles for App Store optimization
 * Ensures crisis components meet <25KB requirement
 */

const fs = require('fs');
const path = require('path');

class BundleAnalyzer {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      totalSize: 0,
      bundleBreakdown: {},
      crisisOptimization: {},
      recommendations: [],
      appStoreCompliance: false
    };
    
    this.thresholds = {
      crisisBundle: 25000,   // 25KB for crisis components
      totalApp: 2000000,     // 2MB total app size
      initialBundle: 200000, // 200KB initial bundle
      chunkSize: 100000      // 100KB max chunk size
    };
  }

  log(level, message, data = null) {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[level]}[${level.toUpperCase()}] ${message}${colors.reset}`);
    if (data && typeof data === 'object') {
      console.log(JSON.stringify(data, null, 2));
    } else if (data) {
      console.log(data);
    }
  }

  getFileSize(filePath) {
    try {
      return fs.statSync(filePath).size;
    } catch (error) {
      return 0;
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  analyzeSourceCode() {
    this.log('info', 'Analyzing source code structure...');
    
    const srcDir = path.join(process.cwd(), 'src');
    const analysis = {
      components: {},
      libraries: {},
      totalSize: 0
    };

    if (!fs.existsSync(srcDir)) {
      this.log('error', 'Source directory not found');
      return analysis;
    }

    const analyzeDirectory = (dir, category) => {
      if (!fs.existsSync(dir)) return 0;
      
      let totalSize = 0;
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      files.forEach(file => {
        const filePath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          totalSize += analyzeDirectory(filePath, category);
        } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
          const size = this.getFileSize(filePath);
          totalSize += size;
          
          if (!analysis[category][file.name]) {
            analysis[category][file.name] = {
              path: filePath.replace(process.cwd(), ''),
              size,
              critical: file.name.toLowerCase().includes('crisis') ||
                       file.name.toLowerCase().includes('emergency')
            };
          }
        }
      });
      
      return totalSize;
    };

    // Analyze components
    analysis.components.totalSize = analyzeDirectory(
      path.join(srcDir, 'components'), 
      'components'
    );

    // Analyze libraries
    analysis.libraries.totalSize = analyzeDirectory(
      path.join(srcDir, 'lib'), 
      'libraries'
    );

    analysis.totalSize = analysis.components.totalSize + analysis.libraries.totalSize;

    this.log('success', 'Source code analysis complete', {
      componentsSize: this.formatBytes(analysis.components.totalSize),
      librariesSize: this.formatBytes(analysis.libraries.totalSize),
      totalSize: this.formatBytes(analysis.totalSize)
    });

    this.results.bundleBreakdown = analysis;
    return analysis;
  }

  analyzeCrisisComponents() {
    this.log('info', 'Analyzing crisis-critical components...');
    
    const crisisAnalysis = {
      components: [],
      totalSize: 0,
      optimized: false,
      issues: []
    };

    const crisisFiles = [
      'src/components/ui/CrisisFloatingButton.tsx',
      'src/components/ui/CrisisSupport.tsx',
      'src/components/ui/CrisisFloatingButtonNew.tsx',
      'src/components/ui/EnhancedCulturalCrisisSupport.tsx',
      'src/lib/crisis-safety-coordinator.ts',
      'src/lib/crisis-resource-preloader.ts',
      'src/lib/crisis-detection-system.ts'
    ];

    crisisFiles.forEach(filePath => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        const size = this.getFileSize(fullPath);
        crisisAnalysis.components.push({
          file: filePath,
          size,
          formatted: this.formatBytes(size),
          optimized: size < 10000 // Under 10KB is well optimized
        });
        crisisAnalysis.totalSize += size;
      }
    });

    // Check if crisis bundle meets requirements
    crisisAnalysis.optimized = crisisAnalysis.totalSize < this.thresholds.crisisBundle;
    
    if (!crisisAnalysis.optimized) {
      crisisAnalysis.issues.push(
        `Crisis bundle too large: ${this.formatBytes(crisisAnalysis.totalSize)} (target: <${this.formatBytes(this.thresholds.crisisBundle)})`
      );
      this.results.recommendations.push('🚨 CRITICAL: Optimize crisis components - lives depend on fast loading');
    }

    // Check individual component sizes
    crisisAnalysis.components.forEach(comp => {
      if (comp.size > 15000) { // 15KB threshold for individual crisis components
        crisisAnalysis.issues.push(`${comp.file} is too large: ${comp.formatted}`);
        this.results.recommendations.push(`⚡ Optimize ${path.basename(comp.file)} for faster crisis response`);
      }
    });

    this.log(crisisAnalysis.optimized ? 'success' : 'warning', 
      `Crisis components analysis: ${this.formatBytes(crisisAnalysis.totalSize)}`,
      crisisAnalysis.optimized ? 'Within limits ✅' : 'Exceeds limits ⚠️'
    );

    this.results.crisisOptimization = crisisAnalysis;
    return crisisAnalysis;
  }

  analyzeNextBuild() {
    this.log('info', 'Analyzing Next.js build output...');
    
    const buildDir = path.join(process.cwd(), '.next');
    const analysis = {
      found: false,
      staticAssets: {},
      buildManifest: null,
      totalSize: 0
    };

    if (!fs.existsSync(buildDir)) {
      this.log('warning', 'Next.js build directory not found - production build may be needed');
      return analysis;
    }

    analysis.found = true;

    // Analyze static assets
    const staticDir = path.join(buildDir, 'static');
    if (fs.existsSync(staticDir)) {
      const analyzeStatic = (dir) => {
        let size = 0;
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        items.forEach(item => {
          const itemPath = path.join(dir, item.name);
          if (item.isDirectory()) {
            size += analyzeStatic(itemPath);
          } else {
            const fileSize = this.getFileSize(itemPath);
            size += fileSize;
            
            if (item.name.endsWith('.js')) {
              analysis.staticAssets[item.name] = {
                size: fileSize,
                formatted: this.formatBytes(fileSize),
                type: 'javascript'
              };
            }
          }
        });
        
        return size;
      };

      analysis.totalSize = analyzeStatic(staticDir);
    }

    // Read build manifest if available
    const manifestPath = path.join(buildDir, 'build-manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        analysis.buildManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      } catch (error) {
        this.log('warning', 'Could not parse build manifest');
      }
    }

    this.log('success', `Build analysis complete - Total static size: ${this.formatBytes(analysis.totalSize)}`);
    
    this.results.buildAnalysis = analysis;
    return analysis;
  }

  generateRecommendations() {
    this.log('info', 'Generating optimization recommendations...');
    
    const recommendations = [];

    // Crisis optimization recommendations
    if (!this.results.crisisOptimization.optimized) {
      recommendations.push({
        priority: 'CRITICAL',
        category: 'Crisis Safety',
        issue: 'Crisis components exceed size limit',
        action: 'Implement lazy loading and code splitting for non-essential crisis features',
        impact: 'Faster crisis response times - potentially life-saving'
      });
    }

    // Bundle size recommendations
    if (this.results.bundleBreakdown.totalSize > this.thresholds.totalApp) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Bundle Size',
        issue: 'Total app size exceeds recommendation',
        action: 'Implement aggressive tree shaking and remove unused dependencies',
        impact: 'Faster app load times for users on slow networks'
      });
    }

    // Individual component recommendations
    const largeComponents = Object.values(this.results.bundleBreakdown.components)
      .filter(comp => comp && comp.size > 20000);
    
    largeComponents.forEach(comp => {
      if (comp.path) {
        recommendations.push({
          priority: 'MEDIUM',
          category: 'Component Optimization',
          issue: `${comp.path} is ${this.formatBytes(comp.size)}`,
          action: 'Break down into smaller components or implement lazy loading',
          impact: 'Improved initial load performance'
        });
      }
    });

    // Check for missing optimizations
    if (!this.results.buildAnalysis?.found) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Build Process',
        issue: 'Production build not found',
        action: 'Run production build to enable bundle analysis',
        impact: 'Essential for App Store submission validation'
      });
    }

    this.results.recommendations = recommendations;
    return recommendations;
  }

  checkAppStoreCompliance() {
    this.log('info', 'Checking App Store compliance...');
    
    let compliant = true;
    const issues = [];

    // Crisis component compliance
    if (!this.results.crisisOptimization.optimized) {
      compliant = false;
      issues.push('Crisis components exceed size limits');
    }

    // Overall size compliance
    const totalSourceSize = this.results.bundleBreakdown.totalSize;
    if (totalSourceSize > this.thresholds.totalApp) {
      compliant = false;
      issues.push(`Total source size too large: ${this.formatBytes(totalSourceSize)}`);
    }

    // Build availability compliance
    if (!this.results.buildAnalysis?.found) {
      compliant = false;
      issues.push('Production build required for final validation');
    }

    this.results.appStoreCompliance = compliant;
    this.results.complianceIssues = issues;

    this.log(compliant ? 'success' : 'warning', 
      `App Store compliance: ${compliant ? 'COMPLIANT' : 'NEEDS WORK'}`,
      issues.length > 0 ? issues : 'All checks passed'
    );

    return { compliant, issues };
  }

  generateReport() {
    const reportPath = path.join(process.cwd(), 'BUNDLE_ANALYSIS_REPORT.md');
    
    const report = `# ALCHM Bundle Analysis Report

## Executive Summary

**Generated**: ${this.results.timestamp}
**Crisis Bundle Size**: ${this.formatBytes(this.results.crisisOptimization.totalSize)}
**Total Source Size**: ${this.formatBytes(this.results.bundleBreakdown.totalSize)}
**App Store Compliant**: ${this.results.appStoreCompliance ? '✅ YES' : '❌ NO'}

## Crisis-Critical Component Analysis

**Target**: Crisis components must load in <1 second (≈25KB bundle)
**Current**: ${this.formatBytes(this.results.crisisOptimization.totalSize)}
**Status**: ${this.results.crisisOptimization.optimized ? '✅ OPTIMIZED' : '⚠️ NEEDS OPTIMIZATION'}

### Crisis Components Breakdown
${this.results.crisisOptimization.components.map(comp => 
  `- **${path.basename(comp.file)}**: ${comp.formatted} ${comp.optimized ? '✅' : '⚠️'}`
).join('\n')}

## Source Code Analysis

### Components
- **Total Size**: ${this.formatBytes(this.results.bundleBreakdown.components.totalSize)}
- **Component Count**: ${Object.keys(this.results.bundleBreakdown.components).filter(k => k !== 'totalSize').length}

### Libraries
- **Total Size**: ${this.formatBytes(this.results.bundleBreakdown.libraries.totalSize)}
- **Library Count**: ${Object.keys(this.results.bundleBreakdown.libraries).filter(k => k !== 'totalSize').length}

## Build Analysis

${this.results.buildAnalysis?.found ? 
  `✅ **Production Build Found**
- **Static Assets**: ${this.formatBytes(this.results.buildAnalysis.totalSize)}
- **JavaScript Files**: ${Object.keys(this.results.buildAnalysis.staticAssets).length}` :
  '❌ **Production Build Not Found** - Run \`npm run build\` for complete analysis'
}

## Performance Recommendations

${this.results.recommendations.length > 0 ?
  this.results.recommendations.map((rec, index) => 
    `### ${index + 1}. ${rec.category} - ${rec.priority}
**Issue**: ${rec.issue}
**Action**: ${rec.action}
**Impact**: ${rec.impact}`
  ).join('\n\n') :
  '✅ No performance issues detected'
}

## App Store Submission Status

${this.results.appStoreCompliance ? 
  '🚀 **READY FOR APP STORE**\n\nBundle sizes are within App Store guidelines for trauma-informed applications.' :
  `⚠️ **OPTIMIZATION REQUIRED**\n\n${this.results.complianceIssues.map(issue => `- ${issue}`).join('\n')}`
}

## Critical Performance Thresholds

- **Crisis Bundle**: <25KB ${this.results.crisisOptimization.totalSize < this.thresholds.crisisBundle ? '✅' : '❌'}
- **Total App**: <2MB ${this.results.bundleBreakdown.totalSize < this.thresholds.totalApp ? '✅' : '❌'}
- **Initial Bundle**: <200KB ${this.results.buildAnalysis?.totalSize < this.thresholds.initialBundle ? '✅' : '⚠️ (needs build)'}

---
*Bundle analysis for trauma-informed journaling platform*
*Every kilobyte matters for users in crisis*
`;

    fs.writeFileSync(reportPath, report);
    this.log('success', `Bundle analysis report generated: ${reportPath}`);
    
    return reportPath;
  }

  async runAnalysis() {
    this.log('info', 'Starting ALCHM bundle analysis...');
    
    try {
      // Run all analyses
      this.analyzeSourceCode();
      this.analyzeCrisisComponents();
      this.analyzeNextBuild();
      this.generateRecommendations();
      this.checkAppStoreCompliance();
      
      // Generate report
      const reportPath = this.generateReport();
      
      this.log('success', 'Bundle analysis complete!');
      return reportPath;
      
    } catch (error) {
      this.log('error', 'Bundle analysis failed', error.message);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const analyzer = new BundleAnalyzer();
  
  try {
    const reportPath = await analyzer.runAnalysis();
    
    console.log('\n' + '='.repeat(80));
    console.log('📦 ALCHM BUNDLE ANALYSIS COMPLETE');
    console.log('='.repeat(80));
    console.log(`📊 Report: ${reportPath}`);
    console.log(`🎯 Crisis Bundle: ${analyzer.formatBytes(analyzer.results.crisisOptimization.totalSize)}`);
    console.log(`📱 App Store Ready: ${analyzer.results.appStoreCompliance ? 'YES ✅' : 'NO ❌'}`);
    
    if (!analyzer.results.appStoreCompliance) {
      console.log('\n⚠️ COMPLIANCE ISSUES:');
      analyzer.results.complianceIssues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
    }
    
    if (analyzer.results.recommendations.length > 0) {
      console.log('\n📋 RECOMMENDATIONS:');
      analyzer.results.recommendations
        .filter(rec => rec.priority === 'CRITICAL')
        .forEach(rec => {
          console.log(`   🚨 ${rec.issue}: ${rec.action}`);
        });
    }
    
    process.exit(analyzer.results.appStoreCompliance ? 0 : 1);
    
  } catch (error) {
    console.error('\n❌ ANALYSIS FAILED:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = BundleAnalyzer;