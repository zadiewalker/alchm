#!/usr/bin/env node

/**
 * SACRED DESIGN VALIDATION SCRIPT
 * 
 * This script enforces our sacred healing design principles by:
 * 1. Scanning all .tsx/.ts/.css files for unauthorized colors
 * 2. Failing the build if non-sacred colors are found
 * 3. Allowing only crisis red for emergency 988 hotline
 * 
 * Run this script before every commit and build to maintain design purity.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Sacred color palette - ONLY these colors are allowed
const SACRED_COLORS = {
  surface: ['#1a1f16', '#242b1e', '#2d3527', '#2a2520'],
  sage: ['#8B9A7C', '#A8B5A0', '#6B7A5C', '#6b7a5e', '#c2d1b8'],
  gold: ['#E5C97D', '#F2D99D', '#D4B76A', '#E8C56D', '#b89d4a', '#f5dfa0'],
  glass: [
    'rgba(0, 0, 0, 0.55)',
    'rgba(0, 0, 0, 0.65)',
    'rgba(255, 255, 255, 0.1)',
    'rgba(255, 255, 255, 0.10)',
    'rgba(255, 255, 255, 0.12)',
    'rgba(255, 255, 255, 0.15)', 
    'rgba(255, 255, 255, 0.2)',
    'rgba(255, 255, 255, 0.05)',
    'rgba(255, 255, 255, 0.06)',
    'rgba(168, 181, 160, 0.92)',
    'rgba(196, 122, 106, 0.14)',
    'rgba(196, 122, 106, 0.18)',
    'rgba(232, 197, 109, 0.12)',
    'rgba(232, 197, 109, 0.15)',
    'rgba(232, 197, 109, 0.2)'
  ],
  crisis: ['#DC2626', '#B91C1C', '#c47a6a'], // ONLY for 988 emergency and existing error surfaces
  pathways: ['#D4A574', '#7BB3D4', '#D4A77B', '#B395D4', '#95A7D4'], // Unique healing pathway colors
  neutral: ['#ffffff', '#fff', '#000000', 'transparent'],
  text: [
    '#1f2937',
    '#333',
    '#8ba88a',
    'rgba(255, 255, 255, 0.92)',
    'rgba(255, 255, 255, 0.9)',
    'rgba(255, 255, 255, 0.8)',
    'rgba(255, 255, 255, 0.7)',
    'rgba(255, 255, 255, 0.65)',
    'rgba(255, 255, 255, 0.40)'
  ]
};

// Forbidden colors that contaminated our design before
const FORBIDDEN_COLORS = [
  '#3B82F6', // Old blue
  '#10B981', // Old green
  '#F59E0B', // Old amber
  '#EF4444', // Old red (except crisis)
  '#8B5CF6', // Old purple
  '#06B6D4', // Old cyan
  '#F97316', // Old orange
  '#84CC16', // Old lime
  'rgb(59, 130, 246)', // Old blue RGB
  'rgb(16, 185, 129)', // Old green RGB
  'rgb(245, 158, 11)', // Old amber RGB
];

// Get all allowed colors as flat array
const getAllowedColors = () => {
  return Object.values(SACRED_COLORS).flat();
};

// Color regex patterns
const HEX_COLOR_REGEX = /#[0-9A-Fa-f]{3,8}/g;
const RGB_COLOR_REGEX = /rgb\([^)]+\)/g;
const RGBA_COLOR_REGEX = /rgba\([^)]+\)/g;
const HSL_COLOR_REGEX = /hsl\([^)]+\)/g;
const TAILWIND_COLOR_REGEX = /(bg|text|border|ring|shadow)-\w+-\d+/g;

// Files to scan
const FILE_PATTERNS = [
  'src/**/*.tsx',
  'src/**/*.ts', 
  'src/**/*.css',
  'src/**/*.module.css',
  'app/**/*.tsx',
  'app/**/*.ts'
];

// Files to ignore
const IGNORE_PATTERNS = [
  'node_modules/**',
  '.next/**',
  '**/*.d.ts',
  '**/sacred-colors.ts' // Don't validate our own constants file
];

class DesignValidator {
  constructor() {
    this.violations = [];
    this.allowedColors = getAllowedColors();
    this.scannedFiles = 0;
  }

  log(message, type = 'info') {
    const colors = {
      error: '\x1b[31m',
      warning: '\x1b[33m', 
      success: '\x1b[32m',
      info: '\x1b[36m',
      reset: '\x1b[0m'
    };
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  normalizeColor(color) {
    // Remove all spaces and convert to lowercase for comparison
    return color.toLowerCase().replace(/\s+/g, '');
  }

  isColorAllowed(color) {
    const normalized = this.normalizeColor(color);
    const normalizedAllowed = this.allowedColors.map(c => this.normalizeColor(c));
    return normalizedAllowed.includes(normalized);
  }

  isForbiddenColor(color) {
    const normalized = this.normalizeColor(color);
    const normalizedForbidden = FORBIDDEN_COLORS.map(c => this.normalizeColor(c));
    return normalizedForbidden.includes(normalized);
  }

  isEmergencyContext(line, lineNumber) {
    const emergencyKeywords = ['emergency', '988', 'crisis', 'hotline', 'suicide'];
    return emergencyKeywords.some(keyword => 
      line.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  isPathwayContext(filePath, line) {
    // Allow pathway colors only in pathway-related files
    const isPathwayFile = filePath.includes('pathways') || filePath.includes('pathway');
    const hasPathwayKeywords = ['foundation', 'calm-the-storm', 'honoring-loss', 'enough-as-you-are', 'shadow-work', 'pathway'].some(keyword =>
      line.toLowerCase().includes(keyword.toLowerCase())
    );
    return isPathwayFile && hasPathwayKeywords;
  }

  extractColors(content) {
    const colors = new Set();
    
    // Extract hex colors
    const hexMatches = content.match(HEX_COLOR_REGEX) || [];
    hexMatches.forEach(color => colors.add(this.normalizeColor(color)));
    
    // Extract rgb/rgba colors
    const rgbMatches = content.match(RGB_COLOR_REGEX) || [];
    const rgbaMatches = content.match(RGBA_COLOR_REGEX) || [];
    [...rgbMatches, ...rgbaMatches].forEach(color => colors.add(this.normalizeColor(color)));
    
    return Array.from(colors);
  }

  validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const colors = this.extractColors(content);
      
      colors.forEach(color => {
        if (this.isForbiddenColor(color)) {
          // Check if it's in emergency context
          const colorLines = lines
            .map((line, index) => ({ line, number: index + 1 }))
            .filter(({ line }) => line.includes(color));
          
          colorLines.forEach(({ line, number }) => {
            if (!this.isEmergencyContext(line, number)) {
              this.violations.push({
                file: filePath,
                line: number,
                color: color,
                context: line.trim(),
                type: 'forbidden',
                message: `FORBIDDEN COLOR DETECTED: ${color} - This color contaminated our design before!`
              });
            }
          });
        } else if (!this.isColorAllowed(color)) {
          const colorLines = lines
            .map((line, index) => ({ line, number: index + 1 }))
            .filter(({ line }) => line.includes(color));
          
          colorLines.forEach(({ line, number }) => {
            // Allow crisis red in emergency contexts
            if (color === '#dc2626' || color === '#b91c1c') {
              if (this.isEmergencyContext(line, number)) {
                return; // Allow it
              }
            }
            
            // Allow pathway colors in pathway contexts
            const pathwayColors = ['#d4a574', '#7bb3d4', '#d4a77b', '#b395d4', '#95a7d4'];
            if (pathwayColors.includes(color)) {
              if (this.isPathwayContext(filePath, line)) {
                return; // Allow it
              }
            }
            
            this.violations.push({
              file: filePath,
              line: number,
              color: color,
              context: line.trim(),
              type: 'unauthorized',
              message: `UNAUTHORIZED COLOR: ${color} - Only sacred colors are allowed!`
            });
          });
        }
      });
      
      this.scannedFiles++;
    } catch (error) {
      this.log(`Error reading file ${filePath}: ${error.message}`, 'error');
    }
  }

  async validate() {
    this.log('🛡️  SACRED DESIGN VALIDATION STARTING...', 'info');
    this.log('🎨 Protecting ALCHM from design contamination\n', 'info');
    
    // Get all files to scan
    const files = [];
    for (const pattern of FILE_PATTERNS) {
      const matches = glob.sync(pattern, { ignore: IGNORE_PATTERNS });
      files.push(...matches);
    }
    
    this.log(`📁 Scanning ${files.length} files for design violations...\n`, 'info');
    
    // Validate each file
    files.forEach(file => this.validateFile(file));
    
    // Report results
    this.generateReport();
    
    return this.violations.length === 0;
  }

  generateReport() {
    console.log('═══════════════════════════════════════════════');
    console.log('🛡️  SACRED DESIGN VALIDATION REPORT');
    console.log('═══════════════════════════════════════════════\n');
    
    if (this.violations.length === 0) {
      this.log('✅ DESIGN PURITY MAINTAINED!', 'success');
      this.log(`🎨 Scanned ${this.scannedFiles} files - No violations found`, 'success');
      this.log('💚 Sacred healing design is protected\n', 'success');
      return;
    }
    
    this.log(`❌ DESIGN CONTAMINATION DETECTED!`, 'error');
    this.log(`🚨 Found ${this.violations.length} violations in ${this.scannedFiles} files\n`, 'error');
    
    // Group violations by type
    const forbidden = this.violations.filter(v => v.type === 'forbidden');
    const unauthorized = this.violations.filter(v => v.type === 'unauthorized');
    
    if (forbidden.length > 0) {
      this.log('🔥 FORBIDDEN COLORS (Previously contaminated our design):', 'error');
      forbidden.forEach(violation => {
        this.log(`   ${violation.file}:${violation.line}`, 'error');
        this.log(`   Color: ${violation.color}`, 'error');
        this.log(`   Context: ${violation.context}`, 'error');
        this.log('', 'error');
      });
    }
    
    if (unauthorized.length > 0) {
      this.log('⚠️  UNAUTHORIZED COLORS (Not in sacred palette):', 'warning');
      unauthorized.forEach(violation => {
        this.log(`   ${violation.file}:${violation.line}`, 'warning');
        this.log(`   Color: ${violation.color}`, 'warning');
        this.log(`   Context: ${violation.context}`, 'warning');
        this.log('', 'warning');
      });
    }
    
    this.log('💡 SOLUTION:', 'info');
    this.log('   Replace unauthorized colors with sacred alternatives:', 'info');
    this.log('   • Sage: #8B9A7C, #A8B5A0', 'info');
    this.log('   • Gold: #E5C97D, #F2D99D', 'info');
    this.log('   • Glass: rgba(255, 255, 255, 0.1-0.2)', 'info');
    this.log('   • Pathways: #D4A574, #7BB3D4, #D4A77B, #B395D4, #95A7D4 (pathway files only)', 'info');
    this.log('   • Crisis Red (988 only): #DC2626\n', 'info');
    
    console.log('═══════════════════════════════════════════════');
  }
}

// Run validation
async function main() {
  const validator = new DesignValidator();
  const isValid = await validator.validate();
  
  if (!isValid) {
    console.log('🚫 BUILD BLOCKED - Design contamination detected!');
    process.exit(1);
  }
  
  console.log('✅ Design validation passed - Build may proceed');
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  });
}

module.exports = { DesignValidator };
