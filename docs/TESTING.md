# ALCHM Testing Strategy & Implementation

## Overview

This document outlines the comprehensive testing strategy for ALCHM (trauma-informed AI journaling OS), covering unit tests, integration tests, end-to-end tests, and automated CI/CD pipelines.

## Test Architecture

### 1. Unit Tests (`src/__tests__/`)
- **Framework**: Jest with Next.js configuration
- **Coverage**: Critical components and utilities
- **Location**: `src/lib/__tests__/`
- **Command**: `pnpm run test`

**Key Test Files**:
- `apiUtils.test.ts` - API utility functions
- `enhancedAI.test.ts` - Gemini AI service integration
- `firestoreClient.test.ts` - Database operations
- `sessionManager.test.ts` - Authentication and session handling

### 2. Integration Tests (`functions/test/`)
- **Framework**: Mocha with Chai assertions
- **Coverage**: Firebase Functions and API routes
- **Location**: `functions/test/`
- **Command**: `cd functions && pnpm run test`

**Key Test Files**:
- `integration.test.js` - Firebase Functions integration
- `api-routes.test.js` - API endpoint testing with Express

### 3. End-to-End Tests (`e2e/`)
- **Framework**: Playwright
- **Coverage**: Complete user workflows
- **Location**: `e2e/`
- **Command**: `pnpm run test:e2e`

**Key Test Files**:
- `auth.spec.ts` - Authentication flows
- `journaling.spec.ts` - Journaling workflows and Khepera AI
- `mobile.spec.ts` - Mobile experience and PWA features

## Test Coverage Requirements

### Unit Tests (Target: 70%+ coverage)
- **API Utilities**: Input validation, error handling, request processing
- **Enhanced AI**: Risk assessment, emotional analysis, fallback handling
- **Firestore Client**: CRUD operations, real-time subscriptions, offline support
- **Session Manager**: Authentication, token refresh, session persistence

### Integration Tests
- **Firebase Functions**: Gemini AI integration, Next.js SSR
- **API Routes**: Save, Khepera, authentication endpoints
- **Error Handling**: Network failures, service unavailability
- **Security**: Input sanitization, rate limiting, CSRF protection

### End-to-End Tests
- **Authentication**: Login, logout, session persistence, password reset
- **Journaling**: Create, edit, delete entries, emotion tracking, privacy
- **AI Integration**: Khepera responses, crisis intervention, reflection prompts
- **Mobile Experience**: Touch gestures, offline functionality, PWA features
- **Accessibility**: Screen reader support, keyboard navigation, ARIA compliance

## Test Configuration

### Jest Configuration (`jest.config.js`)
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

### Playwright Configuration (`playwright.config.ts`)
- **Browsers**: Chromium, Firefox, Safari (desktop and mobile)
- **Reporters**: HTML, JSON, JUnit
- **Screenshots**: On failure
- **Videos**: On retry
- **Trace**: On first retry

### Firebase Emulators
- **Firestore**: Port 8080
- **Authentication**: Port 9099
- **Functions**: Port 5001

## CI/CD Pipeline

### GitHub Actions Workflows

#### Test Workflow (`.github/workflows/test.yml`)
**Triggers**: Push to main/develop, Pull requests

**Jobs**:
1. **Unit & Integration Tests**
   - TypeScript checking
   - ESLint validation
   - Jest unit tests with coverage
   - Firebase Functions integration tests

2. **End-to-End Tests**
   - Playwright browser testing
   - Mobile device simulation
   - Accessibility compliance

3. **Security Audit**
   - Dependency vulnerability scanning
   - Secret detection
   - Prepublish audit script

4. **Performance Tests**
   - Lighthouse CI audits
   - Bundle size analysis
   - Core Web Vitals monitoring

5. **Accessibility Tests**
   - axe-core automated testing
   - Color contrast validation
   - Screen reader compatibility

#### Deployment Workflow (`.github/workflows/deploy.yml`)
**Triggers**: Push to main, Manual dispatch

**Jobs**:
1. **Pre-deployment Tests**
   - Comprehensive audit
   - Critical path testing

2. **Staging Deployment**
   - Firebase staging deployment
   - Post-deploy health checks
   - Smoke testing

3. **Production Deployment** (manual approval)
   - Firebase production deployment
   - Production health checks
   - Smoke testing

4. **Post-deployment Monitoring**
   - Lighthouse audits
   - Performance monitoring
   - User flow validation

## Test Data & Mocks

### Firebase Mocks (`src/__tests__/__mocks__/`)
- **firebase/app.ts**: Firebase app initialization
- **firebase/auth.ts**: Authentication methods
- **firebase/firestore.ts**: Firestore operations
- **firebase-admin.ts**: Admin SDK operations

### Test Environment Variables (`.env.test`)
```env
NODE_ENV=test
NEXT_PUBLIC_FIREBASE_API_KEY=test-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=test-project
GEMINI_API_KEY=test-gemini-key
STRIPE_SECRET_KEY=sk_test_123456789
```

## Running Tests

### Quick Commands
```bash
# All unit tests
pnpm run test

# Unit tests with coverage
pnpm run test:coverage

# Watch mode for development
pnpm run test:watch

# End-to-end tests
pnpm run test:e2e

# Integration tests
cd functions && pnpm run test

# Performance tests
pnpm run test:performance

# Setup test environment
./scripts/test-setup.sh
```

### Specific Test Patterns
```bash
# Test specific component
pnpm run test -- apiUtils

# Test with coverage
pnpm run test -- --coverage

# Debug mode
pnpm run test -- --detectOpenHandles

# E2E tests for specific browser
pnpm exec playwright test --project webkit

# E2E tests for mobile
pnpm exec playwright test --project "Mobile Chrome"
```

## Test Quality Standards

### Unit Test Standards
- **Arrange-Act-Assert** pattern
- **Single responsibility** per test
- **Descriptive test names**
- **Mock external dependencies**
- **Test edge cases and error conditions**

### Integration Test Standards
- **Real Firebase emulators**
- **End-to-end API request/response testing**
- **Error condition simulation**
- **Performance boundary testing**

### E2E Test Standards
- **Page Object Model** for maintainability
- **Test data isolation**
- **Browser compatibility**
- **Mobile responsiveness**
- **Accessibility compliance**

## Trauma-Informed Testing Considerations

### AI Response Testing
- **Crisis intervention**: Verify appropriate crisis resources
- **Risk assessment**: Test risk level detection accuracy
- **Cultural sensitivity**: Validate culturally aware responses
- **Fallback mechanisms**: Ensure graceful AI service failures

### User Safety Testing
- **Session security**: Verify proper data clearing on logout
- **Privacy protection**: Test private entry access controls
- **Input sanitization**: Validate XSS and injection protection
- **Rate limiting**: Verify protection against abuse

### Accessibility Testing
- **Screen reader compatibility**: Full keyboard navigation
- **Color contrast**: WCAG AA compliance
- **Focus management**: Logical tab order
- **Error messaging**: Clear, supportive error communication

## Performance Budgets

### Lighthouse Thresholds
- **Performance**: ≥ 80
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Core Web Vitals
- **First Contentful Paint**: ≤ 2000ms
- **Largest Contentful Paint**: ≤ 2500ms
- **Cumulative Layout Shift**: ≤ 0.1
- **Total Blocking Time**: ≤ 300ms

### Resource Budgets
- **JavaScript Bundle**: ≤ 500KB
- **Images**: ≤ 1MB
- **Total Resources**: ≤ 2MB

## Monitoring & Alerts

### Test Result Monitoring
- **Coverage reports**: Codecov integration
- **E2E results**: Playwright HTML reports
- **Performance trends**: Lighthouse CI tracking

### Failure Notifications
- **Slack alerts**: CI/CD pipeline failures
- **Performance degradation**: Lighthouse budget violations
- **Security issues**: Vulnerability scanner alerts

## Continuous Improvement

### Test Metrics Tracking
- **Test execution time**: Monitor for slowdowns
- **Flaky test detection**: Identify unreliable tests
- **Coverage trends**: Track coverage improvements
- **Bug detection rate**: Measure test effectiveness

### Review Process
- **Weekly test review**: Assess test health and coverage
- **Quarterly strategy review**: Update testing approaches
- **Post-incident analysis**: Improve test coverage for discovered issues

---

## Quick Start Guide

1. **Setup**: Run `./scripts/test-setup.sh`
2. **Unit Tests**: `pnpm run test`
3. **E2E Tests**: `pnpm run test:e2e`
4. **Coverage**: `pnpm run test:coverage`
5. **CI/CD**: Push to trigger automated pipeline

For detailed troubleshooting and advanced configuration, see the individual test files and configuration documentation.