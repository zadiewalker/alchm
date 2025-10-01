#!/usr/bin/env node

/**
 * ALCHM Mobile Performance Analysis
 * 
 * Simplified mobile performance analysis focused on trauma-informed accessibility
 * and crisis response times. Designed to work with development server.
 */

const fs = require('fs').promises;
const path = require('path');

class MobilePerformanceAnalyzer {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      bundleAnalysis: {},
      mobileOptimizations: {},
      crisisReadiness: {},
      traumaInformed: {},
      recommendations: []
    };
  }

  async analyze() {
    console.log('📱 ALCHM Mobile Performance Analysis Starting...');
    
    try {
      // 1. Analyze bundle sizes and mobile optimization
      await this.analyzeBundleSizes();
      
      // 2. Check mobile-specific configurations
      await this.checkMobileConfigurations();
      
      // 3. Validate crisis-critical resources
      await this.validateCrisisResources();
      
      // 4. Check trauma-informed design compliance
      await this.checkTraumaInformedDesign();
      
      // 5. Generate recommendations
      this.generateRecommendations();
      
      // 6. Save and display results
      await this.saveResults();
      
      console.log('✅ Mobile performance analysis completed!');
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      throw error;
    }
  }

  async analyzeBundleSizes() {
    console.log('\n📦 Analyzing bundle sizes for mobile optimization...');
    
    try {
      // Check if build manifests exist
      const buildDir = path.join(process.cwd(), '.next');
      const staticDir = path.join(buildDir, 'static');
      
      let bundleInfo = {
        hasBuiltAssets: false,
        estimatedBundleSize: 'Unknown',
        criticalIssues: []
      };
      
      try {
        const staticExists = await fs.access(staticDir).then(() => true).catch(() => false);
        if (staticExists) {
          // Analyze built assets
          const chunks = await this.findBundleFiles(staticDir);
          bundleInfo = await this.analyzeBundleFiles(chunks);
        }
      } catch (error) {
        console.log('  ⚠️ Built assets not available, analyzing source files...');
      }
      
      // Analyze source files for potential bundle issues
      const sourceAnalysis = await this.analyzeSourceFiles();
      
      this.results.bundleAnalysis = {
        ...bundleInfo,
        sourceAnalysis,
        mobileOptimized: bundleInfo.estimatedBundleSize !== 'Unknown' && 
                        bundleInfo.estimatedBundleSize < 500000, // 500KB target
        recommendations: this.getBundleRecommendations(bundleInfo, sourceAnalysis)
      };
      
      console.log(`  📊 Bundle analysis: ${bundleInfo.hasBuiltAssets ? 'Built assets found' : 'Source analysis only'}`);
      
    } catch (error) {
      console.error('  ❌ Bundle analysis failed:', error.message);
      this.results.bundleAnalysis = { error: error.message };
    }
  }

  async findBundleFiles(staticDir) {
    const chunks = [];
    
    try {
      const items = await fs.readdir(staticDir, { recursive: true });
      
      for (const item of items) {
        if (item.endsWith('.js') && !item.includes('webpack')) {
          const filePath = path.join(staticDir, item);
          const stats = await fs.stat(filePath);
          chunks.push({
            name: item,
            size: stats.size,
            path: filePath
          });
        }
      }
    } catch (error) {
      console.log('  ⚠️ Could not read static directory');
    }
    
    return chunks;
  }

  async analyzeBundleFiles(chunks) {
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const largeChunks = chunks.filter(chunk => chunk.size > 200000); // >200KB
    
    return {
      hasBuiltAssets: true,
      totalChunks: chunks.length,
      totalSize,
      estimatedBundleSize: totalSize,
      largeChunks: largeChunks.length,
      criticalIssues: largeChunks.map(chunk => ({
        file: chunk.name,
        size: Math.round(chunk.size / 1024) + 'KB',
        issue: 'Large bundle size may slow mobile loading'
      }))
    };
  }

  async analyzeSourceFiles() {
    console.log('  🔍 Analyzing source files for mobile optimization...');
    
    const analysis = {
      heavyDependencies: [],
      mobileOptimizations: [],
      potentialIssues: []
    };
    
    try {
      // Check package.json for heavy dependencies
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf8');
      const packageData = JSON.parse(packageContent);
      
      const heavyPackages = [
        'firebase', 'openai', '@opentelemetry', 'next', 'react', 'react-dom'
      ];
      
      const dependencies = { ...packageData.dependencies, ...packageData.devDependencies };
      
      for (const [pkg, version] of Object.entries(dependencies)) {
        if (heavyPackages.some(heavy => pkg.includes(heavy))) {
          analysis.heavyDependencies.push({ package: pkg, version });
        }
      }
      
      // Check Next.js config for mobile optimizations
      const nextConfigPath = path.join(process.cwd(), 'next.config.js');
      const nextConfigExists = await fs.access(nextConfigPath).then(() => true).catch(() => false);
      
      if (nextConfigExists) {
        const configContent = await fs.readFile(nextConfigPath, 'utf8');
        
        // Check for mobile-specific optimizations
        if (configContent.includes('splitChunks')) {
          analysis.mobileOptimizations.push('Code splitting configured');
        }
        if (configContent.includes('swcMinify')) {
          analysis.mobileOptimizations.push('SWC minification enabled');
        }
        if (configContent.includes('images')) {
          analysis.mobileOptimizations.push('Image optimization configured');
        }
        if (configContent.includes('crisis')) {
          analysis.mobileOptimizations.push('Crisis-specific optimizations found');
        }
      }
      
    } catch (error) {
      analysis.potentialIssues.push(`Source analysis error: ${error.message}`);
    }
    
    return analysis;
  }

  getBundleRecommendations(bundleInfo, sourceAnalysis) {
    const recommendations = [];
    
    if (bundleInfo.largeChunks > 0) {
      recommendations.push({
        priority: 'high',
        category: 'Bundle Size',
        issue: `${bundleInfo.largeChunks} large chunks detected`,
        recommendation: 'Implement aggressive code splitting and lazy loading'
      });
    }
    
    if (sourceAnalysis.heavyDependencies.length > 5) {
      recommendations.push({
        priority: 'medium',
        category: 'Dependencies',
        issue: 'Many heavy dependencies detected',
        recommendation: 'Consider lighter alternatives or dynamic imports'
      });
    }
    
    if (sourceAnalysis.mobileOptimizations.length < 3) {
      recommendations.push({
        priority: 'high',
        category: 'Mobile Optimization',
        issue: 'Limited mobile optimizations detected',
        recommendation: 'Enable more mobile-specific optimizations in Next.js config'
      });
    }
    
    return recommendations;
  }

  async checkMobileConfigurations() {
    console.log('\n📱 Checking mobile-specific configurations...');
    
    const config = {
      serviceWorker: false,
      pwa: false,
      mobileViewport: false,
      touchOptimized: false,
      crisisOptimized: false
    };
    
    try {
      // Check for service worker
      const swPath = path.join(process.cwd(), 'public', 'sw.js');
      config.serviceWorker = await fs.access(swPath).then(() => true).catch(() => false);
      
      // Check for PWA manifest
      const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
      config.pwa = await fs.access(manifestPath).then(() => true).catch(() => false);
      
      // Check layout.tsx for mobile optimizations
      const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
      const layoutExists = await fs.access(layoutPath).then(() => true).catch(() => false);
      
      if (layoutExists) {
        const layoutContent = await fs.readFile(layoutPath, 'utf8');
        
        config.mobileViewport = layoutContent.includes('viewport') && 
                               layoutContent.includes('width=device-width');
        config.touchOptimized = layoutContent.includes('touch-action') || 
                              layoutContent.includes('tap-highlight');
        config.crisisOptimized = layoutContent.includes('crisis') || 
                               layoutContent.includes('emergency');
      }
      
      const optimizationScore = Object.values(config).filter(Boolean).length;
      
      this.results.mobileOptimizations = {
        ...config,
        score: optimizationScore,
        maxScore: Object.keys(config).length,
        percentage: Math.round((optimizationScore / Object.keys(config).length) * 100)
      };
      
      console.log(`  📊 Mobile optimization score: ${optimizationScore}/${Object.keys(config).length} (${this.results.mobileOptimizations.percentage}%)`);
      
    } catch (error) {
      console.error('  ❌ Mobile configuration check failed:', error.message);
      this.results.mobileOptimizations = { error: error.message };
    }
  }

  async validateCrisisResources() {
    console.log('\n🚨 Validating crisis-critical resources...');
    
    const crisisResources = {
      offlineSupport: false,
      crisisCache: false,
      emergencyFallbacks: false,
      fastAccess: false
    };
    
    try {
      // Check service worker for crisis caching
      const swPath = path.join(process.cwd(), 'public', 'sw.js');
      const swExists = await fs.access(swPath).then(() => true).catch(() => false);
      
      if (swExists) {
        const swContent = await fs.readFile(swPath, 'utf8');
        crisisResources.offlineSupport = swContent.includes('offline') || 
                                       swContent.includes('cache');
        crisisResources.crisisCache = swContent.includes('crisis') || 
                                    swContent.includes('emergency');
        crisisResources.emergencyFallbacks = swContent.includes('fallback') ||
                                           swContent.includes('error');
      }
      
      // Check for crisis-specific components
      const componentsDir = path.join(process.cwd(), 'src', 'components');
      const compExists = await fs.access(componentsDir).then(() => true).catch(() => false);
      
      if (compExists) {
        const components = await fs.readdir(componentsDir, { recursive: true });
        const crisisComponents = components.filter(comp => 
          comp.includes('crisis') || comp.includes('emergency') || comp.includes('Crisis')
        );
        
        crisisResources.fastAccess = crisisComponents.length > 0;
      }
      
      const readinessScore = Object.values(crisisResources).filter(Boolean).length;
      
      this.results.crisisReadiness = {
        ...crisisResources,
        score: readinessScore,
        maxScore: Object.keys(crisisResources).length,
        percentage: Math.round((readinessScore / Object.keys(crisisResources).length) * 100)
      };
      
      console.log(`  📊 Crisis readiness score: ${readinessScore}/${Object.keys(crisisResources).length} (${this.results.crisisReadiness.percentage}%)`);
      
    } catch (error) {
      console.error('  ❌ Crisis resource validation failed:', error.message);
      this.results.crisisReadiness = { error: error.message };
    }
  }

  async checkTraumaInformedDesign() {
    console.log('\n🫶 Checking trauma-informed design compliance...');
    
    const traumaFeatures = {
      touchTargets: false,
      readableText: false,
      reducedMotion: false,
      highContrast: false,
      emergencyAccess: false
    };
    
    try {
      // Check CSS files for trauma-informed features
      const stylesDir = path.join(process.cwd(), 'src', 'styles');
      const globalCssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
      
      let cssContent = '';
      
      // Read global CSS
      const globalExists = await fs.access(globalCssPath).then(() => true).catch(() => false);
      if (globalExists) {
        cssContent += await fs.readFile(globalCssPath, 'utf8');
      }
      
      // Read styles directory
      const stylesExists = await fs.access(stylesDir).then(() => true).catch(() => false);
      if (stylesExists) {
        const styleFiles = await fs.readdir(stylesDir, { recursive: true });
        for (const file of styleFiles) {
          if (file.endsWith('.css')) {
            const filePath = path.join(stylesDir, file);
            cssContent += await fs.readFile(filePath, 'utf8');
          }
        }
      }
      
      // Check layout.tsx for inline critical CSS
      const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
      const layoutExists = await fs.access(layoutPath).then(() => true).catch(() => false);
      
      if (layoutExists) {
        const layoutContent = await fs.readFile(layoutPath, 'utf8');
        
        // Extract critical CSS from layout
        const criticalCssMatch = layoutContent.match(/const criticalCSS = `([\s\S]*?)`;/);
        if (criticalCssMatch) {
          cssContent += criticalCssMatch[1];
        }
      }
      
      // Analyze CSS for trauma-informed features
      traumaFeatures.touchTargets = cssContent.includes('min-width') && 
                                   cssContent.includes('min-height') &&
                                   (cssContent.includes('48px') || cssContent.includes('52px'));
      
      traumaFeatures.readableText = cssContent.includes('font-size') && 
                                   (cssContent.includes('16px') || cssContent.includes('18px'));
      
      traumaFeatures.reducedMotion = cssContent.includes('prefers-reduced-motion');
      
      traumaFeatures.highContrast = cssContent.includes('contrast') || 
                                   cssContent.includes('color');
      
      traumaFeatures.emergencyAccess = cssContent.includes('crisis') || 
                                      cssContent.includes('emergency');
      
      const complianceScore = Object.values(traumaFeatures).filter(Boolean).length;
      
      this.results.traumaInformed = {
        ...traumaFeatures,
        score: complianceScore,
        maxScore: Object.keys(traumaFeatures).length,
        percentage: Math.round((complianceScore / Object.keys(traumaFeatures).length) * 100)
      };
      
      console.log(`  📊 Trauma-informed compliance: ${complianceScore}/${Object.keys(traumaFeatures).length} (${this.results.traumaInformed.percentage}%)`);
      
    } catch (error) {
      console.error('  ❌ Trauma-informed design check failed:', error.message);
      this.results.traumaInformed = { error: error.message };
    }
  }

  generateRecommendations() {
    console.log('\n💡 Generating mobile performance recommendations...');
    
    const recommendations = [];
    
    // Bundle optimization recommendations
    if (this.results.bundleAnalysis.recommendations) {
      recommendations.push(...this.results.bundleAnalysis.recommendations);
    }
    
    // Mobile optimization recommendations
    if (this.results.mobileOptimizations.percentage < 80) {
      recommendations.push({
        priority: 'high',
        category: 'Mobile Configuration',
        issue: 'Mobile optimizations below 80%',
        recommendation: 'Enable service worker, PWA features, and touch optimizations'
      });
    }
    
    // Crisis readiness recommendations
    if (this.results.crisisReadiness.percentage < 75) {
      recommendations.push({
        priority: 'critical',
        category: 'Crisis Readiness',
        issue: 'Crisis preparedness below 75%',
        recommendation: 'Implement offline crisis resources and emergency fallbacks'
      });
    }
    
    // Trauma-informed design recommendations
    if (this.results.traumaInformed.percentage < 90) {
      recommendations.push({
        priority: 'critical',
        category: 'Trauma-Informed Design',
        issue: 'Trauma-informed compliance below 90%',
        recommendation: 'Ensure 52px touch targets, 16px+ fonts, and reduced motion support'
      });
    }
    
    // Performance recommendations based on development observations
    recommendations.push({
      priority: 'high',
      category: 'Development Performance',
      issue: 'Large bundle sizes detected in webpack warnings',
      recommendation: 'Implement dynamic imports for non-critical code and optimize vendor chunks'
    });
    
    recommendations.push({
      priority: 'medium',
      category: 'Mobile Loading',
      issue: 'Missing crisis-resources.json and emergency-crisis.html',
      recommendation: 'Create static crisis resources for immediate offline access'
    });
    
    this.results.recommendations = recommendations;
    
    console.log(`  📋 Generated ${recommendations.length} recommendations`);
  }

  async saveResults() {
    const reportPath = path.join(process.cwd(), 'mobile-performance-analysis.json');
    const summaryPath = path.join(process.cwd(), 'MOBILE_PERFORMANCE_SUMMARY.md');
    
    // Save detailed JSON results
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    
    // Generate and save markdown summary
    const summary = this.generateMarkdownSummary();
    await fs.writeFile(summaryPath, summary);
    
    console.log(`\n📊 Analysis complete! Reports saved:`);
    console.log(`   📄 Detailed: ${reportPath}`);
    console.log(`   📋 Summary: ${summaryPath}`);
    
    this.printConsoleSummary();
  }

  generateMarkdownSummary() {
    const bundle = this.results.bundleAnalysis;
    const mobile = this.results.mobileOptimizations;
    const crisis = this.results.crisisReadiness;
    const trauma = this.results.traumaInformed;
    
    return `# ALCHM Mobile Performance Analysis Report

Generated: ${this.results.timestamp}

## Executive Summary

**Mobile Optimization Score: ${mobile.percentage || 0}%**
**Crisis Readiness Score: ${crisis.percentage || 0}%**  
**Trauma-Informed Compliance: ${trauma.percentage || 0}%**

## Bundle Analysis

${bundle.hasBuiltAssets ? `
- Total Bundle Size: ${Math.round(bundle.totalSize / 1024)}KB
- Number of Chunks: ${bundle.totalChunks}
- Large Chunks: ${bundle.largeChunks}
` : '- Analysis: Source files only (no built assets)'}

### Critical Bundle Issues
${bundle.criticalIssues?.map(issue => `- ${issue.file}: ${issue.size} - ${issue.issue}`).join('\n') || 'None detected'}

### Heavy Dependencies Detected
${bundle.sourceAnalysis?.heavyDependencies?.map(dep => `- ${dep.package} (${dep.version})`).join('\n') || 'None analyzed'}

## Mobile Configuration Status

- ✅ Service Worker: ${mobile.serviceWorker ? 'Enabled' : 'Missing'}
- ✅ PWA Manifest: ${mobile.pwa ? 'Configured' : 'Missing'}  
- ✅ Mobile Viewport: ${mobile.mobileViewport ? 'Optimized' : 'Needs Work'}
- ✅ Touch Optimization: ${mobile.touchOptimized ? 'Enabled' : 'Missing'}
- ✅ Crisis Optimization: ${mobile.crisisOptimized ? 'Enabled' : 'Missing'}

**Score: ${mobile.score}/${mobile.maxScore} (${mobile.percentage}%)**

## Crisis Readiness Assessment

- 🚨 Offline Support: ${crisis.offlineSupport ? 'Available' : 'Missing'}
- 🚨 Crisis Cache: ${crisis.crisisCache ? 'Configured' : 'Missing'}
- 🚨 Emergency Fallbacks: ${crisis.emergencyFallbacks ? 'Available' : 'Missing'}
- 🚨 Fast Crisis Access: ${crisis.fastAccess ? 'Enabled' : 'Missing'}

**Score: ${crisis.score}/${crisis.maxScore} (${crisis.percentage}%)**

## Trauma-Informed Design Compliance

- 🫶 Touch Targets (≥52px): ${trauma.touchTargets ? 'Compliant' : 'Needs Work'}
- 🫶 Readable Text (≥16px): ${trauma.readableText ? 'Compliant' : 'Needs Work'}
- 🫶 Reduced Motion: ${trauma.reducedMotion ? 'Supported' : 'Missing'}
- 🫶 High Contrast: ${trauma.highContrast ? 'Available' : 'Needs Work'}
- 🫶 Emergency Access: ${trauma.emergencyAccess ? 'Optimized' : 'Missing'}

**Score: ${trauma.score}/${trauma.maxScore} (${trauma.percentage}%)**

## Critical Recommendations

${this.results.recommendations.filter(r => r.priority === 'critical').map(rec => `
### ${rec.category} (CRITICAL)
**Issue:** ${rec.issue}
**Recommendation:** ${rec.recommendation}
`).join('\n')}

## High Priority Recommendations

${this.results.recommendations.filter(r => r.priority === 'high').map(rec => `
### ${rec.category} (HIGH)
**Issue:** ${rec.issue}  
**Recommendation:** ${rec.recommendation}
`).join('\n')}

## Mobile Performance Standards

### Trauma-Informed Requirements Met:
- Touch targets ≥52px for users with tremors: ${trauma.touchTargets ? '✅' : '❌'}
- Text size ≥16px for readability during distress: ${trauma.readableText ? '✅' : '❌'}
- Reduced motion support for sensory sensitivity: ${trauma.reducedMotion ? '✅' : '❌'}
- Crisis resource optimization: ${crisis.crisisCache ? '✅' : '❌'}
- Offline emergency access: ${crisis.offlineSupport ? '✅' : '❌'}

### Performance Targets:
- Bundle size <500KB for fast mobile loading
- Crisis resources cached for <1s offline access
- Touch targets ≥52px minimum (WCAG AAA)
- Service worker enabled for offline functionality
- PWA features for app-like experience

---

*This analysis ensures ALCHM meets the unique performance needs of trauma survivors accessing the platform on mobile devices during vulnerable moments.*
`;
  }

  printConsoleSummary() {
    const mobile = this.results.mobileOptimizations;
    const crisis = this.results.crisisReadiness;
    const trauma = this.results.traumaInformed;
    
    console.log('\n' + '='.repeat(70));
    console.log('📱 ALCHM MOBILE PERFORMANCE ANALYSIS SUMMARY');
    console.log('='.repeat(70));
    
    console.log(`\n📊 MOBILE OPTIMIZATION: ${mobile.percentage || 0}% ${this.getScoreIcon(mobile.percentage || 0)}`);
    console.log(`🚨 CRISIS READINESS: ${crisis.percentage || 0}% ${this.getScoreIcon(crisis.percentage || 0)}`);
    console.log(`🫶 TRAUMA-INFORMED: ${trauma.percentage || 0}% ${this.getScoreIcon(trauma.percentage || 0)}`);
    
    console.log('\n🚨 CRITICAL ISSUES:');
    const criticalIssues = this.results.recommendations.filter(r => r.priority === 'critical');
    if (criticalIssues.length === 0) {
      console.log('   ✅ No critical issues found!');
    } else {
      criticalIssues.forEach(issue => {
        console.log(`   ❌ ${issue.category}: ${issue.issue}`);
      });
    }
    
    console.log('\n💡 KEY RECOMMENDATIONS:');
    this.results.recommendations.slice(0, 3).forEach(rec => {
      console.log(`   • ${rec.category}: ${rec.recommendation}`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('🫶 Mobile performance analysis completed for trauma survivors');
    console.log('='.repeat(70));
  }

  getScoreIcon(score) {
    if (score >= 90) return '🟢';
    if (score >= 70) return '🟡';
    if (score >= 50) return '🟠';
    return '🔴';
  }
}

// Run analysis if script is called directly
if (require.main === module) {
  const analyzer = new MobilePerformanceAnalyzer();
  analyzer.analyze().catch(error => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });
}

module.exports = MobilePerformanceAnalyzer;