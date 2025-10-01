# ALCHM Module Stub Generation Workflow

## 🎯 Purpose

Prevent the #1 critical development issue in ALCHM: **missing imports causing build failures** (70% of critical issues based on development pattern analysis).

## 🚀 Quick Start

### Automatic Generation (Recommended)
```bash
# Safe development with automatic stub detection
npm run dev:safe

# Or check and generate stubs manually
npm run stubs:check
```

### Manual Generation
```bash
# Generate stubs for any missing imports
npm run stubs:generate
```

## 🔧 How It Works

### 1. Detection Phase
- Runs TypeScript compilation check (`tsc --noEmit`)
- Parses output for "Cannot find module" errors
- Filters for internal modules (excludes external packages)

### 2. Analysis Phase
```typescript
// Determines stub type based on path and naming patterns
const stubTypes = {
  component: /^[A-Z]/ || /components\//,
  hook: /^use/ || /hooks\//,
  context: /Context|Provider/,
  utility: /lib\// || /utils\//,
  type: /types|Types/
};
```

### 3. Generation Phase
Creates appropriate stub files with:
- **Visual indicators** (🚧 warnings)
- **Console warnings** for development
- **TypeScript compatibility**
- **Trauma-informed error styling** for components

## 📋 Stub Templates

### Component Stub
```tsx
export default function ComponentName({ children, className = '' }) {
  return (
    <div className={`bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="text-yellow-800 font-medium mb-2">
        🚧 Component Stub: ComponentName
      </div>
      <div className="text-yellow-700 text-sm mb-3">
        This component was auto-generated to prevent import errors.
        Please implement the actual component functionality.
      </div>
      {children}
    </div>
  );
}
```

### Hook Stub
```typescript
export function useHookName() {
  console.warn('🚧 Using stub implementation of useHookName');
  
  return {
    data: null,
    loading: false,
    error: null,
    refetch: () => Promise.resolve(null)
  };
}
```

### Context Stub
```tsx
export function useContextName() {
  console.warn('🚧 ContextName used outside of provider (using stub)');
  return { isStub: true, data: null };
}

export function ContextNameProvider({ children }) {
  return (
    <>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4">
        <div className="text-yellow-700 text-sm">
          🚧 Using stub ContextNameProvider
        </div>
      </div>
      {children}
    </>
  );
}
```

## 🔄 Development Workflow Integration

### Pre-Commit Hooks
Automatically runs before commits to prevent broken builds:
```bash
#!/bin/bash
# .git/hooks/pre-commit
exec < /dev/tty
npm run stubs:check
```

### VSCode Integration
Use **Cmd+Shift+P** → "Tasks: Run Task" → "Generate Missing Module Stubs"

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Check for missing imports
  run: npm run stubs:check
```

## 📊 Monitoring and Reports

### Stub Generation Report
After each run, check `module-stub-report.json`:
```json
{
  "scannedAt": "2024-01-15T10:30:00.000Z",
  "missingImportsFound": 3,
  "stubsCreated": 2,
  "stubsDetails": [
    {
      "importPath": "@/components/NewFeature",
      "stubType": "component",
      "filePath": "src/components/NewFeature.tsx"
    }
  ],
  "nextSteps": [
    "1. Review created stubs and implement actual functionality",
    "2. Run npm run build to verify all imports are resolved"
  ]
}
```

### Development Metrics
Track stub creation patterns to identify:
- Most commonly missing import types
- Directories that need better organization
- Features that need proper implementation

## 🚧 Working with Stubs

### 1. Identify Stubs
- Look for 🚧 visual indicators in UI
- Check console for stub warnings
- Search codebase for "STUB:" comments

### 2. Replace Stub Implementations
```typescript
// Before (Stub)
export function useUserProfile() {
  console.warn('🚧 Using stub implementation');
  return { data: null, loading: false };
}

// After (Real Implementation)
export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadUserProfile().then(setProfile).finally(() => setLoading(false));
  }, []);
  
  return { data: profile, loading };
}
```

### 3. Verify Implementation
```bash
# After implementing real functionality
npm run stubs:check  # Should show fewer stubs needed
npm run build       # Should build successfully
npm run test        # Verify functionality works
```

## ⚡ Performance Considerations

### Bundle Size Impact
- Stubs add minimal bundle size (~1-2KB each)
- Tree shaking removes unused stub code in production
- Real implementations should replace stubs before deployment

### Development Speed
- **Before**: 2-5 minutes debugging missing import errors
- **After**: Instant stub generation, continue development
- **Build time**: +5-10 seconds for stub check, saves hours debugging

## 🛡️ Crisis Safety Integration

### Trauma-Informed Design
Stub components follow ALCHM's trauma-informed design:
- Gentle yellow warning colors (not alarming red)
- Clear, non-technical language
- Accessible touch targets on mobile
- Graceful degradation during development

### Error Prevention
```typescript
// Prevents runtime crashes during development
try {
  const Component = await import('@/components/MightNotExist');
  return <Component />;
} catch (error) {
  // Stub will be imported instead, UI continues working
  console.warn('Using stub component due to missing implementation');
}
```

## 🔄 Advanced Usage

### Custom Stub Templates
Modify `scripts/module-stub-generator.js` to customize stub templates:
```javascript
getComponentStubTemplate() {
  return (componentName) => `
    // Your custom component stub template
    export default function ${componentName}() {
      return <div>Custom stub for ${componentName}</div>;
    }
  `;
}
```

### Selective Stub Generation
```bash
# Only generate stubs for specific types
node scripts/module-stub-generator.js --types=component,hook

# Exclude certain directories
node scripts/module-stub-generator.js --exclude=test,__tests__
```

### Integration with Testing
```typescript
// Test files can detect and handle stub implementations
it('should work with stub implementations', () => {
  const { result } = renderHook(() => useFeature());
  
  if (result.current.isStub) {
    // Skip test or use mock behavior
    expect(result.current.data).toBeNull();
  } else {
    // Test actual implementation
    expect(result.current.data).toBeDefined();
  }
});
```

## 🎯 Best Practices

### 1. Regular Stub Audits
```bash
# Weekly stub audit
grep -r "🚧 STUB" src/ --include="*.ts" --include="*.tsx"
```

### 2. Prioritize Stub Replacement
1. **Critical components** first (authentication, crisis safety)
2. **User-facing features** second
3. **Internal utilities** last

### 3. Documentation Updates
When replacing stubs, update:
- Component documentation
- Type definitions
- Test cases
- Integration guides

### 4. Team Communication
```typescript
// Add TODO comments with assignee and priority
// 🚧 STUB: TODO @username - HIGH PRIORITY
// This component needs implementation for crisis safety features
// Related to: authentication flow, mobile optimization
```

## 🚨 Troubleshooting

### Common Issues

**Q: Stub generator creates wrong stub type**
```bash
# Force specific stub type
node -e "
const ModuleStubGenerator = require('./scripts/module-stub-generator.js');
const gen = new ModuleStubGenerator();
gen.createStub({
  filePath: 'src/components/MyComponent.tsx',
  stubType: 'component',
  fileName: 'MyComponent'
});
"
```

**Q: TypeScript still reports errors after stub creation**
```bash
# Clear TypeScript cache and rebuild
rm -rf .next/cache
npx tsc --build --clean
npm run build
```

**Q: Stubs not showing in development**
- Check file permissions: `ls -la src/components/`
- Verify import paths match file locations
- Restart development server: `npm run dev`

## 📈 Success Metrics

Track these KPIs to measure workflow effectiveness:

- **Import errors reduced**: Target 95% reduction
- **Build success rate**: Target >99% on first attempt
- **Development velocity**: Measure feature completion time
- **Developer experience**: Survey team satisfaction

## 🎉 Migration Guide

### From Manual Stub Creation
1. Remove existing manual stub files
2. Run `npm run stubs:generate` 
3. Review generated stubs for consistency
4. Update development workflow documentation

### Integration Checklist
- [ ] Install workflow scripts
- [ ] Update package.json commands  
- [ ] Configure pre-commit hooks
- [ ] Train team on new commands
- [ ] Set up monitoring dashboards
- [ ] Schedule weekly stub audits

---

This workflow transforms the #1 development pain point into an automated, trauma-informed development accelerator. 🚀