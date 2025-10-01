# ALCHM End-to-End Testing Workflow

## 🎯 Purpose

Catch missing dependencies early in development and ensure trauma-informed design principles are maintained across the entire application stack.

## 🚀 Quick Start

### Development Testing
```bash
# Quick dependency validation (most common)
npm run test:e2e:deps

# Crisis safety validation  
npm run test:e2e:crisis

# Full comprehensive testing
npm run test:e2e:full
```

### CI/CD Integration
```bash
# Optimized for automated environments
npm run test:e2e:ci
```

## 🧪 Test Suites

### 1. Dependency Validation (`dependency-validation.spec.ts`)
**Priority**: Highest | **Runtime**: ~2-3 minutes

**What it tests:**
- ✅ TypeScript compilation with no missing imports
- ✅ Critical component loading (auth, dashboard, journal, pricing)
- ✅ Firebase integration and initialization
- ✅ Stripe payment integration
- ✅ Internal link integrity
- ✅ API route availability  
- ✅ Error boundary functionality
- ✅ CSS and asset loading
- ✅ Mobile compatibility

**When to run:**
- Before every commit (automated)
- After adding new dependencies
- Before deployment
- When import errors suspected

```typescript
// Example test
test('should have no TypeScript compilation errors', async () => {
  const output = execSync('npx tsc --noEmit --skipLibCheck');
  // Automatically suggests running stub generator if errors found
});
```

### 2. Crisis Safety Integration (`crisis-safety-integration.spec.ts`)
**Priority**: High | **Runtime**: ~3-4 minutes

**What it tests:**
- 🛡️ Trauma-informed error handling (gentle, supportive messages)
- 👆 Crisis-safe touch targets (60px minimum for mobile)
- 📳 Haptic feedback integration (mobile devices)
- ⏳ Gentle loading states (no aggressive animations)
- 🆘 Crisis resource accessibility
- 🌐 Network failure handling (graceful offline experience)
- 🎨 Trauma-informed design consistency
- 📱 Responsive crisis safety across viewports

**When to run:**
- After UI/UX changes
- Before user-facing releases
- During accessibility audits
- When crisis features modified

```typescript
// Example test
test('should have trauma-informed error handling', async ({ page }) => {
  // Trigger error and check for supportive language
  const errorText = await page.locator('[role="alert"]').textContent();
  expect(errorText.includes('take your time')).toBe(true);
});
```

### 3. Comprehensive Testing (`**/*.spec.ts`)
**Priority**: Manual | **Runtime**: ~10-15 minutes

**What it includes:**
- All dependency validation tests
- All crisis safety tests
- Additional existing E2E tests
- Performance validation
- Cross-browser compatibility

## 🔄 Integration with Development Workflow

### Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit
echo "🧪 Running E2E dependency validation..."
npm run test:e2e:deps --headless

if [ $? -ne 0 ]; then
    echo "❌ E2E tests failed - commit blocked"
    echo "💡 Run 'npm run stubs:generate' to fix import issues"
    exit 1
fi
```

### GitHub Actions Integration
```yaml
name: E2E Validation
on: [push, pull_request]
jobs:
  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:e2e:ci
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/
```

### VSCode Integration
Add to `.vscode/tasks.json`:
```json
{
  "label": "Run E2E Dependency Tests",
  "type": "shell", 
  "command": "npm run test:e2e:deps",
  "group": "test",
  "problemMatcher": [],
  "presentation": {
    "reveal": "always",
    "panel": "new"
  }
}
```

## 📊 Test Reports and Analytics

### Automated Reports
After each test run, find detailed reports in:
```
e2e-reports/
├── e2e-report-[timestamp].json       # Comprehensive results
├── dependency-validation-report.json  # Import analysis
└── failure-report-[timestamp].json   # Failure diagnostics
```

### Report Structure
```json
{
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "duration": "142s",
    "environment": "development"
  },
  "results": {
    "total": 15,
    "passed": 13, 
    "failed": 2,
    "skipped": 0,
    "successRate": 87
  },
  "issues": {
    "critical": ["Missing API route: /api/khepera"],
    "warnings": ["TypeScript compilation issues detected"],
    "recommendations": [
      "🚨 Fix critical issues before deployment",
      "Run 'npm run stubs:generate' to fix import issues"
    ]
  }
}
```

### Success Metrics Dashboard
Track these KPIs over time:
- **Import Error Rate**: Target <2% of builds
- **Crisis Safety Score**: Target 98%+ compliance
- **Test Success Rate**: Target 95%+ passing
- **Time to Fix**: Target <10 minutes average

## 🔧 Advanced Configuration

### Custom Test Configuration
Create `playwright.config.custom.ts`:
```typescript
export default defineConfig({
  ...baseConfig,
  projects: [
    {
      name: 'crisis-mobile',
      use: { ...devices['iPhone 12'], testIdAttribute: 'data-crisis-test' }
    }
  ],
  use: {
    baseURL: 'https://staging.alchmapp.com',
    timeout: 15000
  }
});
```

### Environment-Specific Testing
```bash
# Test against staging
BASE_URL=https://staging.alchmapp.com npm run test:e2e:deps

# Test with specific user data
TEST_USER_EMAIL=test@example.com npm run test:e2e:crisis

# Test mobile-specific features
MOBILE_ONLY=true npm run test:e2e:crisis
```

### Parallel Test Execution
```bash
# Run dependency and crisis tests in parallel
npm run test:e2e:deps & npm run test:e2e:crisis & wait
```

## 🚨 Troubleshooting

### Common Issues

**Q: Tests fail with "Cannot find module" errors**
```bash
# Auto-fix missing imports
npm run stubs:generate
npm run test:e2e:deps
```

**Q: Development server won't start during tests**
```bash
# Check if port is in use
lsof -ti:3000 | xargs kill -9
npm run test:e2e:deps
```

**Q: Tests timeout on CI/CD**
```bash
# Use optimized CI command
npm run test:e2e:ci
```

**Q: Crisis safety tests fail on mobile**
```bash
# Test specific mobile viewport
npx playwright test crisis-safety-integration.spec.ts --project="Mobile Chrome"
```

**Q: Flaky test results**
```bash
# Increase retries for unstable environments
npx playwright test --retries=3 dependency-validation.spec.ts
```

### Debug Mode
```bash
# Run with browser visible (debug mode)
node scripts/automated-e2e-runner.js dependency-validation --headless=false

# Generate detailed traces
npx playwright test --trace on dependency-validation.spec.ts
```

### Performance Optimization
```bash
# Skip video recording for faster tests
npx playwright test --config playwright.config.ts dependency-validation.spec.ts

# Run only critical path tests
npx playwright test --grep "should have no TypeScript compilation errors"
```

## 📈 Testing Strategy

### Test Pyramid for ALCHM
```
           E2E Tests (Crisis Safety)         ← 20% of tests
        ↗                                ↖
    E2E Tests (Dependency Validation)      ← 30% of tests  
  ↗                                      ↖
Integration Tests (API, Firebase)          ← 30% of tests
Unit Tests (Components, Utils)             ← 20% of tests
```

### Test Frequency
- **Every Commit**: Dependency validation
- **Daily**: Crisis safety integration  
- **Weekly**: Full comprehensive suite
- **Before Release**: All tests + manual verification

### Risk-Based Testing Priority
1. **Critical**: Authentication, crisis safety, data persistence
2. **High**: Payment flows, user onboarding, mobile experience
3. **Medium**: Analytics, social features, admin tools
4. **Low**: Documentation, static content, internal tools

## 🛡️ Crisis-Informed Testing Philosophy

### Testing with Trauma Awareness
- **Gentle Failures**: Tests should not cause panic or distress
- **Clear Communication**: Test failures explained in supportive language
- **Progressive Enhancement**: Core functionality tested first
- **Accessibility Focus**: Touch targets, color contrast, screen readers
- **Mobile First**: Crisis situations often involve mobile devices

### Example: Trauma-Informed Test Messaging
```javascript
// ❌ Bad: Alarming test output
expect(touchTarget.height).toBeGreaterThan(44); // "FAILED: Touch target too small"

// ✅ Good: Supportive test output  
expect(touchTarget.height, 'Touch target should be accessible during crisis situations')
  .toBeGreaterThan(44); // "Crisis accessibility: Touch target should be 44px+ for stressed users"
```

## 🔄 Continuous Improvement

### Weekly Test Review
1. **Analyze failure patterns** - What breaks most often?
2. **Review success metrics** - Are we improving?
3. **Update test scenarios** - New user flows to cover?
4. **Refine crisis safety checks** - Better trauma-informed validation?

### Monthly Strategy Updates
1. **Add new critical paths** based on user feedback
2. **Remove flaky tests** that don't provide value
3. **Update mobile device profiles** for latest devices
4. **Review and update crisis safety criteria**

### Quarterly Deep Audits
1. **Full accessibility audit** with screen readers
2. **Performance testing** under stress conditions  
3. **Security testing** of authentication flows
4. **User experience testing** with real trauma survivors

---

This E2E testing workflow transforms dependency management from a reactive debugging process into a proactive development accelerator, while ensuring ALCHM maintains its trauma-informed design principles at every level. 🚀