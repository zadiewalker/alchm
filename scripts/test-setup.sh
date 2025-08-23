#!/bin/bash

# ALCHM Test Setup Script
# Configures the testing environment for comprehensive test suite

set -e

echo "🧪 Setting up ALCHM Test Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install pnpm first."
    exit 1
fi

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    pnpm install --frozen-lockfile
fi

# Setup test environment variables
print_status "Setting up test environment variables..."
if [ ! -f ".env.test" ]; then
    cat > .env.test << EOF
# Test Environment Configuration
NODE_ENV=test

# Firebase Test Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=test-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=test.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=test-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=test-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Server-side Firebase Configuration
FIREBASE_PROJECT_ID=test-project
FIREBASE_CLIENT_EMAIL=test@test-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC+...\n-----END PRIVATE KEY-----\n"

# Gemini AI Test Configuration
GEMINI_API_KEY=test-gemini-key

# Stripe Test Configuration
STRIPE_SECRET_KEY=sk_test_123456789
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_123456789

# Other Test Configuration
NEXTAUTH_SECRET=test-secret
NEXTAUTH_URL=http://localhost:3000
EOF
    print_success "Created .env.test file"
else
    print_warning ".env.test already exists, skipping creation"
fi

# Install Playwright browsers if not already installed
if [ ! -d "node_modules/@playwright" ] || [ ! -d "$HOME/.cache/ms-playwright" ]; then
    print_status "Installing Playwright browsers..."
    pnpm exec playwright install --with-deps
    print_success "Playwright browsers installed"
fi

# Create test directories if they don't exist
print_status "Creating test directories..."
mkdir -p src/__tests__/__mocks__/firebase
mkdir -p src/__tests__/__mocks__/next
mkdir -p e2e/fixtures
mkdir -p test-results
mkdir -p coverage
print_success "Test directories created"

# Run type checking
print_status "Running TypeScript type checking..."
if pnpm run typecheck; then
    print_success "TypeScript type checking passed"
else
    print_error "TypeScript type checking failed"
    exit 1
fi

# Run linting
print_status "Running ESLint..."
if pnpm run lint; then
    print_success "ESLint passed"
else
    print_warning "ESLint found issues (continuing anyway)"
fi

# Build the application for testing
print_status "Building application for testing..."
if pnpm run build; then
    print_success "Application build successful"
else
    print_error "Application build failed"
    exit 1
fi

# Setup Firebase Functions for testing
if [ -d "functions" ]; then
    print_status "Setting up Firebase Functions for testing..."
    cd functions
    
    if [ ! -d "node_modules" ]; then
        pnpm install --frozen-lockfile
    fi
    
    if pnpm run build; then
        print_success "Firebase Functions build successful"
    else
        print_error "Firebase Functions build failed"
        exit 1
    fi
    
    cd ..
fi

# Run unit tests to verify setup
print_status "Running unit tests to verify setup..."
if pnpm run test -- --watchAll=false --coverage=false --passWithNoTests; then
    print_success "Unit tests setup verification passed"
else
    print_error "Unit tests setup verification failed"
    exit 1
fi

# Generate test summary
print_status "Generating test configuration summary..."
cat > test-config-summary.md << EOF
# ALCHM Test Configuration Summary

## ✅ Setup Complete

### Test Environment
- Jest with Next.js configuration
- Playwright for E2E testing  
- Firebase emulators for integration testing
- TypeScript type checking
- ESLint code quality checking

### Test Types Available
1. **Unit Tests**: \`pnpm run test\`
   - Critical component testing
   - API utilities testing
   - Enhanced AI service testing
   - Session management testing

2. **Integration Tests**: \`pnpm run test:integration\`
   - Firebase Functions testing
   - API routes testing
   - Database operations testing

3. **End-to-End Tests**: \`pnpm run test:e2e\`
   - Authentication flows
   - Journaling workflows
   - Mobile experience
   - Accessibility compliance

4. **Performance Tests**: \`pnpm run test:performance\`
   - Lighthouse audits
   - Bundle size analysis
   - Core Web Vitals

### CI/CD Pipeline
- GitHub Actions workflow configured
- Automated testing on push/PR
- Staging and production deployment
- Performance monitoring
- Security auditing

### Coverage Reporting
- Unit test coverage: \`coverage/\`
- E2E test reports: \`playwright-report/\`
- Performance reports: \`.lighthouseci/\`

## 🚀 Next Steps
1. Run \`pnpm run test\` for unit tests
2. Run \`pnpm run test:e2e\` for E2E tests
3. Run \`pnpm run test:integration\` for integration tests
4. Check coverage reports in \`coverage/\` directory

## 📊 Test Scripts
- \`pnpm run test\` - Unit tests
- \`pnpm run test:watch\` - Unit tests in watch mode
- \`pnpm run test:coverage\` - Unit tests with coverage
- \`pnpm run test:e2e\` - End-to-end tests
- \`pnpm run test:integration\` - Integration tests
- \`pnpm run test:performance\` - Performance tests

EOF

print_success "Test configuration summary generated: test-config-summary.md"

echo ""
echo "🎉 ALCHM Test Environment Setup Complete!"
echo ""
echo "📋 Available test commands:"
echo "  • pnpm run test              - Run unit tests"
echo "  • pnpm run test:e2e          - Run end-to-end tests"  
echo "  • pnpm run test:integration  - Run integration tests"
echo "  • pnpm run test:coverage     - Run tests with coverage"
echo "  • pnpm run test:watch        - Run tests in watch mode"
echo ""
echo "📊 View test results:"
echo "  • Coverage: coverage/lcov-report/index.html"
echo "  • E2E Report: playwright-report/index.html"
echo "  • Performance: .lighthouseci/report.html"
echo ""
echo "🔗 CI/CD Pipeline:"
echo "  • Tests run automatically on push/PR"
echo "  • Deployment pipeline includes comprehensive testing"
echo "  • Performance monitoring post-deployment"
echo ""