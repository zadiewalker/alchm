#!/usr/bin/env node

/**
 * TOML Validation Script for Firebase Studio
 * Validates project.toml syntax to prevent deployment failures
 */

const fs = require('fs');
const path = require('path');

function validateTOML() {
  const projectTomlPath = path.join(__dirname, '..', 'project.toml');
  
  if (!fs.existsSync(projectTomlPath)) {
    console.log('✅ No project.toml found - using default buildpack behavior');
    return true;
  }

  try {
    const content = fs.readFileSync(projectTomlPath, 'utf8');
    
    // Basic validation checks
    const checks = [
      {
        name: 'Environment variables use array syntax',
        test: () => {
          const hasArraySyntax = content.includes('[[build.env]]');
          const hasMapSyntax = content.match(/^\[build\.env\]$/m);
          return hasArraySyntax && !hasMapSyntax;
        },
        error: 'Environment variables must use [[build.env]] array syntax, not [build.env] map syntax'
      },
      {
        name: 'Environment variables have name and value',
        test: () => {
          const envBlocks = content.match(/\[\[build\.env\]\][\s\S]*?(?=\[\[|$)/g) || [];
          return envBlocks.every(block => block.includes('name =') && block.includes('value ='));
        },
        error: 'Each [[build.env]] block must have both "name" and "value" fields'
      },
      {
        name: 'No mixing of map and array syntax',
        test: () => !content.match(/^\[build\.env\]$/m),
        error: 'Do not mix [build.env] map syntax with [[build.env]] array syntax'
      },
      {
        name: 'Buildpack URI is specified',
        test: () => content.includes('[[build.buildpacks]]') && content.includes('uri ='),
        error: 'Buildpack URI must be specified in [[build.buildpacks]] section'
      }
    ];

    console.log('🔍 Validating project.toml...');
    
    for (const check of checks) {
      if (!check.test()) {
        console.error(`❌ ${check.name}: ${check.error}`);
        return false;
      }
      console.log(`✅ ${check.name}`);
    }

    console.log('✅ project.toml validation passed!');
    console.log('\nConfigured environment variables:');
    
    // Extract and display configured environment variables
    const envBlocks = content.match(/\[\[build\.env\]\][\s\S]*?(?=\[\[|$)/g) || [];
    envBlocks.forEach(block => {
      const nameMatch = block.match(/name\s*=\s*"([^"]+)"/);
      const valueMatch = block.match(/value\s*=\s*"([^"]+)"/);
      if (nameMatch && valueMatch) {
        console.log(`  ${nameMatch[1]} = ${valueMatch[1]}`);
      }
    });

    return true;
  } catch (error) {
    console.error('❌ Error reading project.toml:', error.message);
    return false;
  }
}

if (require.main === module) {
  const isValid = validateTOML();
  process.exit(isValid ? 0 : 1);
}

module.exports = { validateTOML };