#!/usr/bin/env node

/**
 * ALCHM Module Stub Generator
 * 
 * Prevents the #1 critical development issue: missing imports causing build failures
 * Based on development pattern analysis showing 70% of critical issues are import-related
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ModuleStubGenerator {
  constructor() {
    this.projectRoot = process.cwd();
    this.srcDir = path.join(this.projectRoot, 'src');
    this.componentsDir = path.join(this.srcDir, 'components');
    this.libDir = path.join(this.srcDir, 'lib');
    this.hooksDir = path.join(this.srcDir, 'hooks');
    
    this.stubTemplates = {
      component: this.getComponentStubTemplate(),
      hook: this.getHookStubTemplate(),
      utility: this.getUtilityStubTemplate(),
      context: this.getContextStubTemplate(),
      type: this.getTypeStubTemplate()
    };
    
    this.missingImports = new Set();
    this.createdStubs = [];
  }

  async scanForMissingImports() {
    console.log('🔍 Scanning for missing imports...');
    
    try {
      // Try to build and capture TypeScript errors
      const result = execSync('npx tsc --noEmit --skipLibCheck', { 
        encoding: 'utf8',
        cwd: this.projectRoot 
      });
      console.log('✅ No TypeScript errors found');
      return [];
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      return this.parseTypeScriptErrors(output);
    }
  }

  parseTypeScriptErrors(output) {
    const missingImportPattern = /Cannot find module ['"]([^'"]+)['"]/g;
    const imports = [];
    let match;

    while ((match = missingImportPattern.exec(output)) !== null) {
      const importPath = match[1];
      if (this.shouldCreateStub(importPath)) {
        imports.push(importPath);
        this.missingImports.add(importPath);
      }
    }

    return [...new Set(imports)];
  }

  shouldCreateStub(importPath) {
    // Only create stubs for our own modules, not external packages
    return (
      importPath.startsWith('@/') || 
      importPath.startsWith('./') || 
      importPath.startsWith('../') ||
      importPath.includes('/components/') ||
      importPath.includes('/lib/') ||
      importPath.includes('/hooks/')
    ) && !importPath.includes('node_modules');
  }

  async createStubsForMissingImports(missingImports) {
    console.log(`📝 Creating stubs for ${missingImports.length} missing imports...`);
    
    for (const importPath of missingImports) {
      try {
        const stubInfo = this.analyzeImportPath(importPath);
        await this.createStub(stubInfo);
        this.createdStubs.push(stubInfo);
      } catch (error) {
        console.error(`❌ Failed to create stub for ${importPath}:`, error.message);
      }
    }
  }

  analyzeImportPath(importPath) {
    // Convert @/ paths to actual file paths
    let filePath = importPath;
    if (filePath.startsWith('@/')) {
      filePath = filePath.replace('@/', '');
    }
    
    // Determine full file path
    const fullPath = path.join(this.srcDir, filePath);
    const ext = path.extname(fullPath) || '.ts';
    const finalPath = ext ? fullPath : `${fullPath}.tsx`;
    
    // Determine stub type based on path and naming
    let stubType = 'utility';
    const fileName = path.basename(finalPath, ext);
    const dirName = path.dirname(finalPath);
    
    if (dirName.includes('components') || fileName.match(/^[A-Z]/)) {
      stubType = 'component';
    } else if (dirName.includes('hooks') || fileName.startsWith('use')) {
      stubType = 'hook';
    } else if (fileName.includes('Context') || fileName.includes('Provider')) {
      stubType = 'context';
    } else if (fileName.includes('types') || fileName.includes('Types')) {
      stubType = 'type';
    }
    
    return {
      importPath,
      filePath: finalPath,
      fileName,
      stubType,
      directory: path.dirname(finalPath)
    };
  }

  async createStub(stubInfo) {
    const { filePath, fileName, stubType, directory } = stubInfo;
    
    // Ensure directory exists
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`⚠️  File already exists: ${filePath}`);
      return;
    }
    
    // Generate stub content
    const stubContent = this.generateStubContent(stubInfo);
    
    // Write stub file
    fs.writeFileSync(filePath, stubContent);
    console.log(`✅ Created ${stubType} stub: ${filePath}`);
  }

  generateStubContent(stubInfo) {
    const { fileName, stubType } = stubInfo;
    const template = this.stubTemplates[stubType];
    
    return template(fileName);
  }

  getComponentStubTemplate() {
    return (componentName) => `'use client';

import React from 'react';

// 🚧 STUB: This component was auto-generated to prevent import errors
// TODO: Implement the actual ${componentName} component

interface ${componentName}Props {
  children?: React.ReactNode;
  className?: string;
}

export default function ${componentName}({ children, className = '' }: ${componentName}Props) {
  return (
    <div className={\`bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 \${className}\`}>
      <div className="text-yellow-800 font-medium mb-2">
        🚧 Component Stub: ${componentName}
      </div>
      <div className="text-yellow-700 text-sm mb-3">
        This component was auto-generated to prevent import errors.
        Please implement the actual component functionality.
      </div>
      {children && (
        <div className="border-t border-yellow-200 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

// Export named export as well for flexibility
export { ${componentName} };
`;
  }

  getHookStubTemplate() {
    return (hookName) => `// 🚧 STUB: This hook was auto-generated to prevent import errors
// TODO: Implement the actual ${hookName} hook

import { useState } from 'react';

export function ${hookName}() {
  const [stubData, setStubData] = useState(null);
  
  console.warn('🚧 Using stub implementation of ${hookName}. Please implement the actual hook.');
  
  return {
    data: stubData,
    loading: false,
    error: null,
    refetch: () => {
      console.warn('${hookName} refetch called on stub implementation');
      return Promise.resolve(stubData);
    }
  };
}

// Default export for flexibility
export default ${hookName};
`;
  }

  getUtilityStubTemplate() {
    return (utilityName) => `// 🚧 STUB: This utility was auto-generated to prevent import errors
// TODO: Implement the actual ${utilityName} functionality

console.warn('🚧 Using stub implementation of ${utilityName}. Please implement the actual utility.');

// Generic stub function
export function ${utilityName}(...args: any[]): any {
  console.warn(\`${utilityName} called with args:\`, args);
  return null;
}

// Default export for flexibility
export default ${utilityName};

// Common utility exports
export const config = {
  name: '${utilityName}',
  isStub: true
};
`;
  }

  getContextStubTemplate() {
    return (contextName) => `'use client';

// 🚧 STUB: This context was auto-generated to prevent import errors
// TODO: Implement the actual ${contextName} context

import React, { createContext, useContext, ReactNode } from 'react';

interface ${contextName}ContextType {
  isStub: boolean;
  data: any;
}

const ${contextName}Context = createContext<${contextName}ContextType | undefined>(undefined);

export function use${contextName}() {
  const context = useContext(${contextName}Context);
  if (context === undefined) {
    console.warn('🚧 ${contextName} used outside of provider (using stub)');
    return { isStub: true, data: null };
  }
  return context;
}

interface ${contextName}ProviderProps {
  children: ReactNode;
}

export function ${contextName}Provider({ children }: ${contextName}ProviderProps) {
  const value: ${contextName}ContextType = {
    isStub: true,
    data: null
  };

  return (
    <${contextName}Context.Provider value={value}>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4">
        <div className="text-yellow-700 text-sm">
          🚧 Using stub ${contextName}Provider
        </div>
      </div>
      {children}
    </${contextName}Context.Provider>
  );
}

export default ${contextName}Provider;
`;
  }

  getTypeStubTemplate() {
    return (typeName) => `// 🚧 STUB: These types were auto-generated to prevent import errors
// TODO: Implement the actual ${typeName} types

export interface ${typeName} {
  id?: string;
  [key: string]: any;
}

export type ${typeName}Props = {
  [key: string]: any;
};

export default ${typeName};
`;
  }

  async generateReport() {
    const report = {
      scannedAt: new Date().toISOString(),
      missingImportsFound: this.missingImports.size,
      stubsCreated: this.createdStubs.length,
      stubsDetails: this.createdStubs,
      nextSteps: [
        '1. Review created stubs and implement actual functionality',
        '2. Run npm run build to verify all imports are resolved',
        '3. Replace stub implementations with real code',
        '4. Add proper TypeScript types for better development experience'
      ]
    };

    const reportPath = path.join(this.projectRoot, 'module-stub-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Module Stub Generation Report');
    console.log('================================');
    console.log(`Missing imports found: ${report.missingImportsFound}`);
    console.log(`Stubs created: ${report.stubsCreated}`);
    console.log(`Report saved to: ${reportPath}`);
    
    if (this.createdStubs.length > 0) {
      console.log('\n🚧 Created Stubs:');
      this.createdStubs.forEach(stub => {
        console.log(`  - ${stub.stubType}: ${stub.filePath}`);
      });
      
      console.log('\n⚠️  Important: These are placeholder implementations!');
      console.log('Please replace stub content with actual functionality.');
    }
  }

  async run() {
    console.log('🚀 ALCHM Module Stub Generator');
    console.log('===============================');
    
    const missingImports = await this.scanForMissingImports();
    
    if (missingImports.length === 0) {
      console.log('✅ No missing imports found!');
      return;
    }
    
    console.log(`Found ${missingImports.length} missing imports:`);
    missingImports.forEach(imp => console.log(`  - ${imp}`));
    
    await this.createStubsForMissingImports(missingImports);
    await this.generateReport();
    
    console.log('\n🎉 Module stub generation complete!');
    console.log('Run "npm run build" to verify all imports are now resolved.');
  }
}

// CLI Usage
if (require.main === module) {
  const generator = new ModuleStubGenerator();
  generator.run().catch(console.error);
}

module.exports = ModuleStubGenerator;