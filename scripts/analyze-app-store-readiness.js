#!/usr/bin/env node

/**
 * ALCHM App Store Readiness Analysis Script
 * 
 * Analyzes codebase for App Store submission readiness
 * when production build is not available
 */

const fs = require('fs');
const path = require('path');

class AppStoreReadinessAnalyzer {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      codebaseAnalysis: {},
      configurationAnalysis: {},
      performanceOptimizations: {},
      appStoreReadiness: {
        score: 0,
        issues: [],
        recommendations: [],
        critical: []
      }
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

  analyzeNextConfig() {
    this.log('info', 'Analyzing Next.js configuration...');
    
    const configPath = path.join(process.cwd(), 'next.config.js');
    const analysis = { found: false, optimizations: [], issues: [] };
    
    if (fs.existsSync(configPath)) {
      analysis.found = true;
      const config = fs.readFileSync(configPath, 'utf8');
      
      // Check for performance optimizations
      if (config.includes('output: \'standalone\'')) {
        analysis.optimizations.push('✅ Standalone output configured for Firebase deployment');
      }
      
      if (config.includes('optimizePackageImports')) {
        analysis.optimizations.push('✅ Package import optimization enabled');
      }
      
      if (config.includes('splitChunks')) {
        analysis.optimizations.push('✅ Advanced chunk splitting configured');
      }
      
      if (config.includes('crisisEmergency')) {
        analysis.optimizations.push('✅ Crisis-specific bundle optimization found');
      }
      
      if (config.includes('swcMinify: true')) {
        analysis.optimizations.push('✅ SWC minification enabled');
      }
      
      if (config.includes('images:')) {
        analysis.optimizations.push('✅ Image optimization configured');
      }
      
      // Check for performance headers
      if (config.includes('headers()')) {
        analysis.optimizations.push('✅ Performance headers configured');
      }
      
      // Check for bundle size limits
      if (config.includes('maxAssetSize')) {
        analysis.optimizations.push('✅ Bundle size monitoring configured');
      }
      
      this.log('success', 'Next.js configuration analysis complete');
    } else {
      analysis.issues.push('❌ next.config.js not found');
      this.log('error', 'Next.js configuration file not found');
    }
    
    this.results.configurationAnalysis.nextjs = analysis;
    return analysis;
  }

  analyzePackageJson() {
    this.log('info', 'Analyzing package.json...');
    
    const packagePath = path.join(process.cwd(), 'package.json');
    const analysis = { found: false, dependencies: {}, scripts: {}, issues: [] };
    
    if (fs.existsSync(packagePath)) {
      analysis.found = true;
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Check for performance-related dependencies
      const perfDeps = [
        'framer-motion',
        'firebase',
        'next',
        'react',
        'stripe',
        'lighthouse',
        'puppeteer'
      ];
      
      perfDeps.forEach(dep => {
        if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
          analysis.dependencies[dep] = 
            packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
        }
      });
      
      // Check for performance scripts
      const perfScripts = [
        'perf:audit',
        'perf:monitor',
        'perf:report',
        'test:e2e',
        'build:optimized'
      ];
      
      perfScripts.forEach(script => {
        if (packageJson.scripts?.[script]) {
          analysis.scripts[script] = packageJson.scripts[script];
        }
      });
      
      // Check Node.js version constraints
      if (packageJson.engines?.node) {
        analysis.nodeVersion = packageJson.engines.node;
      }
      
      this.log('success', 'package.json analysis complete');
    } else {
      analysis.issues.push('❌ package.json not found');
      this.log('error', 'package.json not found');
    }
    
    this.results.configurationAnalysis.package = analysis;
    return analysis;
  }

  analyzeCrisisComponents() {
    this.log('info', 'Analyzing crisis safety components...');
    
    const analysis = { components: [], optimizations: [], issues: [] };
    
    // Look for crisis-related components
    const crisisFiles = [
      'src/components/ui/CrisisFloatingButton.tsx',
      'src/components/ui/CrisisSupport.tsx',
      'src/components/ui/EnhancedCulturalCrisisSupport.tsx',
      'src/components/crisis/',
      'src/lib/crisis-safety-coordinator.ts',
      'src/lib/crisis-resource-preloader.ts'
    ];
    
    crisisFiles.forEach(filePath => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        if (stats.isFile()) {
          analysis.components.push({
            file: filePath,
            size: stats.size,
            optimized: stats.size < 10000 // Under 10KB for critical crisis components
          });
        } else if (stats.isDirectory()) {
          const dirFiles = fs.readdirSync(fullPath);
          analysis.components.push({
            directory: filePath,
            fileCount: dirFiles.length,
            files: dirFiles.slice(0, 5) // First 5 files
          });
        }
      }
    });
    
    if (analysis.components.length > 0) {
      analysis.optimizations.push('✅ Crisis safety components found');
    } else {
      analysis.issues.push('❌ Crisis safety components not found');
    }
    
    this.log('success', 'Crisis components analysis complete');
    this.results.codebaseAnalysis.crisis = analysis;
    return analysis;
  }

  analyzePerformanceLibraries() {
    this.log('info', 'Analyzing performance optimization libraries...');
    
    const analysis = { libraries: [], optimizations: [], issues: [] };
    
    // Check for performance monitoring files
    const perfFiles = [
      'src/lib/performance-monitoring.ts',
      'src/lib/mobile-performance-optimizer.ts',
      'src/lib/core-web-vitals-monitor.ts',
      'src/lib/analytics-performance-integration.ts',
      'scripts/performance-budget-check.js',
      'lighthouserc.js'
    ];
    
    perfFiles.forEach(filePath => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        analysis.libraries.push({
          file: filePath,
          size: fs.statSync(fullPath).size
        });
        analysis.optimizations.push(`✅ ${path.basename(filePath)} found`);
      }
    });
    
    // Check Lighthouse configuration
    const lighthousePath = path.join(process.cwd(), 'lighthouserc.js');
    if (fs.existsSync(lighthousePath)) {
      analysis.optimizations.push('✅ Lighthouse CI configuration found');
    } else {
      analysis.issues.push('❌ Lighthouse CI configuration missing');
    }
    
    this.log('success', 'Performance libraries analysis complete');
    this.results.performanceOptimizations = analysis;
    return analysis;
  }

  analyzeFirebaseConfig() {
    this.log('info', 'Analyzing Firebase configuration...');
    
    const analysis = { configs: [], optimizations: [], issues: [] };
    
    const firebaseFiles = [
      'firebase.json',
      'firestore.rules',
      'functions/src/index.ts',
      'src/lib/firebase.ts'
    ];
    
    firebaseFiles.forEach(filePath => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        analysis.configs.push(filePath);
        
        if (filePath === 'firebase.json') {
          const config = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
          if (config.hosting) {
            analysis.optimizations.push('✅ Firebase hosting configured');
          }
          if (config.functions) {
            analysis.optimizations.push('✅ Firebase functions configured');
          }
        }
      } else {
        analysis.issues.push(`❌ ${filePath} not found`);
      }
    });
    
    this.log('success', 'Firebase configuration analysis complete');
    this.results.configurationAnalysis.firebase = analysis;
    return analysis;
  }

  calculateReadinessScore() {
    this.log('info', 'Calculating App Store readiness score...');
    
    let score = 0;
    const maxScore = 100;
    
    // Next.js configuration (25 points)
    const nextjsOpts = this.results.configurationAnalysis.nextjs?.optimizations?.length || 0;
    score += Math.min(25, nextjsOpts * 3);
    
    // Crisis components (25 points - critical for ALCHM)
    const crisisComps = this.results.codebaseAnalysis.crisis?.components?.length || 0;
    score += Math.min(25, crisisComps * 5);
    
    // Performance optimizations (25 points)
    const perfOpts = this.results.performanceOptimizations?.optimizations?.length || 0;
    score += Math.min(25, perfOpts * 3);
    
    // Firebase configuration (25 points)
    const firebaseOpts = this.results.configurationAnalysis.firebase?.optimizations?.length || 0;
    score += Math.min(25, firebaseOpts * 6);
    
    // Collect all issues
    const allIssues = [
      ...(this.results.configurationAnalysis.nextjs?.issues || []),
      ...(this.results.configurationAnalysis.package?.issues || []),
      ...(this.results.codebaseAnalysis.crisis?.issues || []),
      ...(this.results.performanceOptimizations?.issues || []),
      ...(this.results.configurationAnalysis.firebase?.issues || [])
    ];
    
    // Collect all recommendations
    const allRecommendations = [];
    
    if (score < 70) {
      allRecommendations.push('🔧 Implement additional performance optimizations');
    }
    
    if ((this.results.codebaseAnalysis.crisis?.components?.length || 0) === 0) {
      allRecommendations.push('🚨 CRITICAL: Implement crisis safety components');
    }
    
    if ((this.results.performanceOptimizations?.optimizations?.length || 0) < 3) {
      allRecommendations.push('⚡ Add more performance monitoring tools');
    }
    
    this.results.appStoreReadiness = {
      score: Math.round(score),
      issues: allIssues,
      recommendations: allRecommendations,
      critical: allIssues.filter(issue => issue.includes('CRITICAL') || issue.includes('crisis')),
      passed: score >= 80 && allIssues.length === 0
    };
    
    this.log('success', `Readiness score calculated: ${score}/100`);
    return this.results.appStoreReadiness;
  }

  generateReport() {
    const reportPath = path.join(process.cwd(), 'APP_STORE_READINESS_ANALYSIS.md');
    
    const report = `# ALCHM App Store Readiness Analysis

## Executive Summary

**Generated**: ${this.results.timestamp}
**Readiness Score**: ${this.results.appStoreReadiness.score}/100
**Status**: ${this.results.appStoreReadiness.passed ? '✅ READY' : '⚠️ NEEDS OPTIMIZATION'}

## Configuration Analysis

### Next.js Performance Optimizations
${this.results.configurationAnalysis.nextjs?.optimizations?.join('\n') || 'No optimizations detected'}

### Firebase Configuration
${this.results.configurationAnalysis.firebase?.optimizations?.join('\n') || 'No Firebase optimizations detected'}

## Codebase Analysis

### Crisis Safety Components
${this.results.codebaseAnalysis.crisis?.components?.map(comp => 
  comp.file ? `- **${comp.file}** (${Math.round(comp.size / 1024)}KB) ${comp.optimized ? '✅' : '⚠️'}` :
  `- **${comp.directory}** (${comp.fileCount} files)`
).join('\n') || 'No crisis components analyzed'}

### Performance Libraries
${this.results.performanceOptimizations?.libraries?.map(lib => 
  `- **${lib.file}** (${Math.round(lib.size / 1024)}KB)`
).join('\n') || 'No performance libraries found'}

## Issues Requiring Attention

${this.results.appStoreReadiness.issues.length > 0 ? 
  this.results.appStoreReadiness.issues.join('\n') :
  '✅ No critical issues found'
}

## Recommendations for App Store Submission

${this.results.appStoreReadiness.recommendations.length > 0 ?
  this.results.appStoreReadiness.recommendations.join('\n') :
  '✅ Configuration appears optimized for App Store submission'
}

## Critical Actions Required

${this.results.appStoreReadiness.critical.length > 0 ?
  '🚨 **IMMEDIATE ATTENTION REQUIRED:**\n' + this.results.appStoreReadiness.critical.join('\n') :
  '✅ No critical issues blocking App Store submission'
}

## Performance Optimization Status

- **Bundle Splitting**: ${this.results.configurationAnalysis.nextjs?.optimizations?.some(opt => opt.includes('splitting')) ? '✅' : '❌'}
- **Image Optimization**: ${this.results.configurationAnalysis.nextjs?.optimizations?.some(opt => opt.includes('Image')) ? '✅' : '❌'}
- **Crisis Optimization**: ${this.results.configurationAnalysis.nextjs?.optimizations?.some(opt => opt.includes('crisis')) ? '✅' : '❌'}
- **Performance Headers**: ${this.results.configurationAnalysis.nextjs?.optimizations?.some(opt => opt.includes('headers')) ? '✅' : '❌'}

## Next Steps

${this.results.appStoreReadiness.passed ? 
  '🚀 **PROCEED WITH APP STORE SUBMISSION**\n\n1. Complete production build testing\n2. Submit to App Store review\n3. Monitor performance post-launch' :
  '🔧 **OPTIMIZATION REQUIRED**\n\n1. Address critical issues listed above\n2. Complete performance optimizations\n3. Re-run validation after fixes\n4. Proceed with submission when score >80'
}

---
*Generated by ALCHM Performance & Monitoring Specialist*
*Trauma-informed performance analysis for vulnerable users*
`;

    fs.writeFileSync(reportPath, report);
    this.log('success', `Analysis report generated: ${reportPath}`);
    
    return reportPath;
  }

  async runAnalysis() {
    this.log('info', 'Starting ALCHM App Store readiness analysis...');
    
    try {
      // Analyze all components
      this.analyzeNextConfig();
      this.analyzePackageJson();
      this.analyzeCrisisComponents();
      this.analyzePerformanceLibraries();
      this.analyzeFirebaseConfig();
      
      // Calculate final score
      this.calculateReadinessScore();
      
      // Generate report
      const reportPath = this.generateReport();
      
      this.log('success', 'Analysis complete!');
      return reportPath;
      
    } catch (error) {
      this.log('error', 'Analysis failed', error.message);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const analyzer = new AppStoreReadinessAnalyzer();
  
  try {
    const reportPath = await analyzer.runAnalysis();
    
    console.log('\n' + '='.repeat(80));
    console.log('📱 ALCHM APP STORE READINESS ANALYSIS COMPLETE');
    console.log('='.repeat(80));
    console.log(`📊 Report: ${reportPath}`);
    console.log(`🎯 Readiness Score: ${analyzer.results.appStoreReadiness.score}/100`);
    console.log(`📱 Status: ${analyzer.results.appStoreReadiness.passed ? 'READY ✅' : 'NEEDS WORK ⚠️'}`);
    
    if (analyzer.results.appStoreReadiness.critical.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      analyzer.results.appStoreReadiness.critical.forEach(issue => {
        console.log(`   • ${issue}`);
      });
    }
    
    if (!analyzer.results.appStoreReadiness.passed) {
      console.log('\n📋 NEXT STEPS:');
      analyzer.results.appStoreReadiness.recommendations.forEach(rec => {
        console.log(`   • ${rec}`);
      });
    }
    
    process.exit(analyzer.results.appStoreReadiness.passed ? 0 : 1);
    
  } catch (error) {
    console.error('\n❌ ANALYSIS FAILED:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = AppStoreReadinessAnalyzer;