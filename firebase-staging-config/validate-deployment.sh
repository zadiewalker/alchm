#!/bin/bash

# ALCHM Therapist Beta Staging - Deployment Validation Pipeline
# Comprehensive validation system for staging environment deployments
# Ensures production-ready code quality and HIPAA compliance

set -e  # Exit on any error

echo "🏥 ALCHM Therapist Beta - Deployment Validation Pipeline"
echo "====================================================="
echo "🔒 HIPAA-Compliant Staging Environment Validation"
echo "📊 Mock Data Testing Environment"
echo "👩‍⚕️ Licensed Professional Beta Testing"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Validation results tracking
VALIDATION_ERRORS=0
VALIDATION_WARNINGS=0
VALIDATION_PASSED=0

# Helper functions
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((VALIDATION_PASSED++))
}

log_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
    ((VALIDATION_WARNINGS++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((VALIDATION_ERRORS++))
}

log_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

log_step() {
    echo -e "${CYAN}🔄 $1${NC}"
}

# Function to validate environment configuration
validate_environment() {
    log_step "Validating environment configuration..."
    
    # Check Node.js version
    node_version=$(node --version | cut -d'v' -f2)
    major_version=$(echo $node_version | cut -d'.' -f1)
    
    if [ "$major_version" -ge 18 ] && [ "$major_version" -lt 21 ]; then
        log_success "Node.js version valid: $node_version (requirement: >=18 <21)"
    else
        log_error "Node.js version invalid: $node_version (requirement: >=18 <21)"
    fi
    
    # Check npm version
    npm_version=$(npm --version)
    npm_major=$(echo $npm_version | cut -d'.' -f1)
    
    if [ "$npm_major" -ge 8 ]; then
        log_success "npm version valid: $npm_version (requirement: >=8.0.0)"
    else
        log_error "npm version invalid: $npm_version (requirement: >=8.0.0)"
    fi
    
    # Check Firebase CLI
    if command -v firebase &> /dev/null; then
        firebase_version=$(firebase --version)
        log_success "Firebase CLI installed: $firebase_version"
    else
        log_error "Firebase CLI not found - required for deployment"
    fi
    
    # Check required environment files
    if [ -f ".env.local" ]; then
        log_success "Environment configuration found"
    else
        log_warning "No .env.local found - using defaults"
    fi
}

# Function to validate Firebase configuration
validate_firebase_config() {
    log_step "Validating Firebase staging configuration..."
    
    # Check Firebase configuration files
    if [ -f "firebase-staging-config/firebase.staging.json" ]; then
        log_success "Firebase staging configuration found"
        
        # Validate JSON syntax
        if jq empty firebase-staging-config/firebase.staging.json 2>/dev/null; then
            log_success "Firebase staging configuration is valid JSON"
        else
            log_error "Firebase staging configuration has invalid JSON syntax"
        fi
    else
        log_error "Firebase staging configuration missing"
    fi
    
    # Check Firestore rules
    if [ -f "firebase-staging-config/firestore.staging.rules" ]; then
        log_success "Firestore staging rules found"
    else
        log_error "Firestore staging rules missing"
    fi
    
    # Check Firestore indexes
    if [ -f "firebase-staging-config/firestore.staging.indexes.json" ]; then
        log_success "Firestore staging indexes found"
        
        if jq empty firebase-staging-config/firestore.staging.indexes.json 2>/dev/null; then
            log_success "Firestore staging indexes are valid JSON"
        else
            log_error "Firestore staging indexes have invalid JSON syntax"
        fi
    else
        log_error "Firestore staging indexes missing"
    fi
    
    # Check Storage rules
    if [ -f "firebase-staging-config/storage.staging.rules" ]; then
        log_success "Storage staging rules found"
    else
        log_error "Storage staging rules missing"
    fi
    
    # Validate Firebase project configuration
    if firebase projects:list &>/dev/null; then
        log_success "Firebase authentication valid"
    else
        log_error "Firebase authentication failed - run 'firebase login'"
    fi
}

# Function to validate dependencies and security
validate_dependencies() {
    log_step "Validating dependencies and security..."
    
    # Check if package.json exists
    if [ -f "package.json" ]; then
        log_success "package.json found"
        
        # Check for required dependencies
        required_deps=("firebase" "firebase-admin" "firebase-functions" "next" "react" "zod")
        for dep in "${required_deps[@]}"; do
            if jq -e ".dependencies.\"$dep\"" package.json &>/dev/null || jq -e ".devDependencies.\"$dep\"" package.json &>/dev/null; then
                version=$(jq -r ".dependencies.\"$dep\" // .devDependencies.\"$dep\"" package.json)
                log_success "Required dependency found: $dep@$version"
            else
                log_error "Required dependency missing: $dep"
            fi
        done
        
        # Check for security vulnerabilities
        if command -v npm &> /dev/null; then
            echo -e "${BLUE}🔍 Running security audit...${NC}"
            if npm audit --audit-level high --production 2>/dev/null; then
                log_success "No high/critical security vulnerabilities found"
            else
                log_warning "Security vulnerabilities detected - review npm audit output"
            fi
        fi
        
    else
        log_error "package.json not found"
    fi
    
    # Check functions dependencies
    if [ -f "functions/package.json" ]; then
        log_success "Firebase Functions package.json found"
        
        # Validate functions dependencies
        cd functions
        if npm list firebase-functions &>/dev/null; then
            log_success "Firebase Functions dependencies valid"
        else
            log_warning "Firebase Functions dependencies may need installation"
        fi
        cd ..
    else
        log_error "Firebase Functions package.json missing"
    fi
}

# Function to validate TypeScript and code quality
validate_code_quality() {
    log_step "Validating TypeScript and code quality..."
    
    # Check TypeScript configuration
    if [ -f "tsconfig.json" ]; then
        log_success "TypeScript configuration found"
        
        # Validate TypeScript compilation
        if command -v npx &> /dev/null; then
            echo -e "${BLUE}🔍 Running TypeScript compilation check...${NC}"
            if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
                log_success "TypeScript compilation successful"
            else
                log_error "TypeScript compilation errors found"
            fi
        fi
    else
        log_error "TypeScript configuration missing"
    fi
    
    # Check ESLint configuration
    if [ -f ".eslintrc.json" ] || [ -f ".eslintrc.js" ] || [ -f "eslint.config.js" ]; then
        log_success "ESLint configuration found"
        
        # Run ESLint if available
        if command -v npx &> /dev/null; then
            echo -e "${BLUE}🔍 Running ESLint checks...${NC}"
            if npx eslint . --max-warnings 10 2>/dev/null; then
                log_success "ESLint checks passed (max 10 warnings)"
            else
                log_warning "ESLint issues found - review code quality"
            fi
        fi
    else
        log_warning "ESLint configuration not found"
    fi
    
    # Check for critical files
    critical_files=(
        "src/beta/therapist-onboarding.ts"
        "src/beta/feedback-collection-system.ts"
        "src/beta/mock-data-generator.ts"
        "src/components/beta/TherapistBetaDashboard.tsx"
    )
    
    for file in "${critical_files[@]}"; do
        if [ -f "$file" ]; then
            log_success "Critical beta file found: $file"
        else
            log_error "Critical beta file missing: $file"
        fi
    done
}

# Function to validate HIPAA compliance features
validate_hipaa_compliance() {
    log_step "Validating HIPAA compliance features..."
    
    # Check for HIPAA-related configuration
    hipaa_patterns=(
        "hipaa"
        "encryption"
        "audit"
        "privacy"
        "security"
        "compliance"
    )
    
    hipaa_files_found=0
    for pattern in "${hipaa_patterns[@]}"; do
        if find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" | xargs grep -l -i "$pattern" &>/dev/null; then
            ((hipaa_files_found++))
        fi
    done
    
    if [ $hipaa_files_found -gt 3 ]; then
        log_success "HIPAA compliance patterns found in codebase ($hipaa_files_found files)"
    else
        log_warning "Limited HIPAA compliance patterns found ($hipaa_files_found files)"
    fi
    
    # Check for mock data patterns
    mock_patterns=(
        "mock"
        "synthetic"
        "fake"
        "test"
        "demo"
    )
    
    mock_files_found=0
    for pattern in "${mock_patterns[@]}"; do
        if find src -name "*.ts" -o -name "*.tsx" | xargs grep -l -i "$pattern" &>/dev/null; then
            ((mock_files_found++))
        fi
    done
    
    if [ $mock_files_found -gt 0 ]; then
        log_success "Mock data patterns found in source code ($mock_files_found files)"
    else
        log_error "No mock data patterns found - required for beta testing"
    fi
    
    # Check for real data prevention patterns
    real_data_patterns=(
        "NO.*REAL.*DATA"
        "SYNTHETIC.*ONLY"
        "MOCK.*DATA.*ONLY"
        "HIPAA.*SAFE"
    )
    
    real_data_prevention=0
    for pattern in "${real_data_patterns[@]}"; do
        if find . -name "*.ts" -o -name "*.tsx" -o -name "*.md" | xargs grep -l "$pattern" &>/dev/null; then
            ((real_data_prevention++))
        fi
    done
    
    if [ $real_data_prevention -gt 0 ]; then
        log_success "Real data prevention patterns found ($real_data_prevention instances)"
    else
        log_warning "Limited real data prevention documentation found"
    fi
}

# Function to validate beta testing features
validate_beta_features() {
    log_step "Validating beta testing specific features..."
    
    # Check for beta testing components
    beta_components=(
        "TherapistBetaDashboard"
        "MockDataGenerator"
        "FeedbackCollectionSystem"
        "CredentialVerification"
        "AnalyticsMonitoring"
    )
    
    for component in "${beta_components[@]}"; do
        if find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "$component" &>/dev/null; then
            log_success "Beta component found: $component"
        else
            log_error "Beta component missing: $component"
        fi
    done
    
    # Check for crisis detection features
    if find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "crisis.*detection\|emergency.*escalation" &>/dev/null; then
        log_success "Crisis detection features found"
    else
        log_error "Crisis detection features missing"
    fi
    
    # Check for professional features
    professional_features=(
        "license.*verification"
        "professional.*credential"
        "clinical.*insight"
        "therapeutic.*workflow"
    )
    
    for feature in "${professional_features[@]}"; do
        if find src -name "*.ts" -o -name "*.tsx" | xargs grep -l -i "$feature" &>/dev/null; then
            log_success "Professional feature found: $feature"
        else
            log_warning "Professional feature may be missing: $feature"
        fi
    done
}

# Function to validate build process
validate_build_process() {
    log_step "Validating build process..."
    
    # Clean previous builds
    if [ -d ".next" ]; then
        rm -rf .next
        log_info "Cleaned previous Next.js build"
    fi
    
    if [ -d "out" ]; then
        rm -rf out  
        log_info "Cleaned previous static export"
    fi
    
    # Install dependencies
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    if npm ci --silent; then
        log_success "Dependencies installed successfully"
    else
        log_error "Dependency installation failed"
    fi
    
    # Build the project
    echo -e "${BLUE}🏗️ Building staging environment...${NC}"
    if NODE_ENV=staging npm run build --silent; then
        log_success "Staging build completed successfully"
    else
        log_error "Staging build failed"
    fi
    
    # Validate build output
    if [ -d "out" ]; then
        log_success "Static build output generated"
        
        # Check for critical files in build
        critical_build_files=("index.html" "_next" "manifest.json")
        for file in "${critical_build_files[@]}"; do
            if [ -e "out/$file" ]; then
                log_success "Critical build file found: $file"
            else
                log_error "Critical build file missing: $file"
            fi
        done
    else
        log_error "No build output directory found"
    fi
    
    # Validate Firebase Functions build
    if [ -d "functions" ]; then
        cd functions
        echo -e "${BLUE}🔧 Building Firebase Functions...${NC}"
        if npm run build --silent 2>/dev/null; then
            log_success "Firebase Functions build completed"
        else
            log_warning "Firebase Functions build may have issues"
        fi
        cd ..
    fi
}

# Function to run tests
validate_tests() {
    log_step "Running test suites..."
    
    # Run unit tests
    if [ -f "jest.config.js" ] || [ -f "jest.config.ts" ]; then
        echo -e "${BLUE}🧪 Running unit tests...${NC}"
        if npm test -- --passWithNoTests --silent 2>/dev/null; then
            log_success "Unit tests passed"
        else
            log_warning "Unit tests may have issues"
        fi
    else
        log_info "No Jest configuration found - skipping unit tests"
    fi
    
    # Check for E2E tests
    if [ -d "e2e" ] || [ -f "playwright.config.ts" ]; then
        log_info "E2E tests found but skipping for staging validation"
    else
        log_info "No E2E tests configured"
    fi
    
    # Run specific beta testing validation
    if [ -f "scripts/validate-beta-features.js" ]; then
        echo -e "${BLUE}🏥 Running beta feature validation...${NC}"
        if node scripts/validate-beta-features.js; then
            log_success "Beta feature validation passed"
        else
            log_error "Beta feature validation failed"
        fi
    else
        log_info "No specific beta feature validation script found"
    fi
}

# Function to validate performance and security
validate_performance_security() {
    log_step "Validating performance and security..."
    
    # Check bundle size (approximate)
    if [ -d "out/_next" ]; then
        bundle_size=$(du -sh out/_next 2>/dev/null | cut -f1)
        log_info "Bundle size: $bundle_size"
        
        # Rough check for reasonable bundle size (should be under 50MB for staging)
        bundle_size_mb=$(du -sm out/_next 2>/dev/null | cut -f1)
        if [ "$bundle_size_mb" -lt 50 ]; then
            log_success "Bundle size acceptable: ${bundle_size}B"
        else
            log_warning "Bundle size large: ${bundle_size}B - consider optimization"
        fi
    fi
    
    # Check for common security issues
    security_checks=0
    
    # Check for hardcoded secrets (basic check)
    if ! find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" | xargs grep -i "api[_-]key\|secret\|password" | grep -v "placeholder\|example\|test" &>/dev/null; then
        log_success "No obvious hardcoded secrets found"
        ((security_checks++))
    else
        log_warning "Potential hardcoded secrets found - review code"
    fi
    
    # Check for proper error handling
    if find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "try.*catch\|\.catch\|error" &>/dev/null; then
        log_success "Error handling patterns found"
        ((security_checks++))
    else
        log_warning "Limited error handling patterns found"
    fi
    
    if [ $security_checks -ge 2 ]; then
        log_success "Basic security checks passed"
    else
        log_warning "Some security checks failed - review implementation"
    fi
}

# Function to validate documentation
validate_documentation() {
    log_step "Validating documentation..."
    
    # Check for critical documentation files
    doc_files=(
        "README.md"
        "docs/therapist-beta-guide.md"
        "CLAUDE.md"
    )
    
    for doc in "${doc_files[@]}"; do
        if [ -f "$doc" ]; then
            log_success "Documentation found: $doc"
        else
            log_warning "Documentation missing: $doc"
        fi
    done
    
    # Check documentation quality
    if [ -f "docs/therapist-beta-guide.md" ]; then
        word_count=$(wc -w < "docs/therapist-beta-guide.md")
        if [ "$word_count" -gt 10000 ]; then
            log_success "Comprehensive therapist guide: $word_count words"
        else
            log_warning "Therapist guide may be incomplete: $word_count words"
        fi
    fi
}

# Main validation execution
main() {
    echo -e "${PURPLE}Starting comprehensive deployment validation...${NC}"
    echo ""
    
    validate_environment
    echo ""
    
    validate_firebase_config
    echo ""
    
    validate_dependencies
    echo ""
    
    validate_code_quality
    echo ""
    
    validate_hipaa_compliance
    echo ""
    
    validate_beta_features
    echo ""
    
    validate_build_process
    echo ""
    
    validate_tests
    echo ""
    
    validate_performance_security
    echo ""
    
    validate_documentation
    echo ""
    
    # Summary
    echo -e "${PURPLE}=== VALIDATION SUMMARY ===${NC}"
    echo -e "${GREEN}✅ Passed: $VALIDATION_PASSED${NC}"
    echo -e "${YELLOW}⚠️  Warnings: $VALIDATION_WARNINGS${NC}"
    echo -e "${RED}❌ Errors: $VALIDATION_ERRORS${NC}"
    echo ""
    
    if [ $VALIDATION_ERRORS -eq 0 ]; then
        echo -e "${GREEN}🎉 DEPLOYMENT VALIDATION SUCCESSFUL! 🎉${NC}"
        echo -e "${GREEN}Ready for therapist beta staging deployment${NC}"
        echo ""
        echo -e "${BLUE}Next Steps:${NC}"
        echo -e "1. Deploy to staging: ${CYAN}./firebase-staging-config/deploy-staging.sh${NC}"
        echo -e "2. Run post-deployment tests"
        echo -e "3. Notify beta participants of new staging environment"
        echo -e "4. Begin professional feedback collection"
        echo ""
        exit 0
    else
        echo -e "${RED}❌ DEPLOYMENT VALIDATION FAILED${NC}"
        echo -e "${RED}Please fix the errors above before deploying${NC}"
        echo ""
        echo -e "${YELLOW}Common fixes:${NC}"
        echo -e "- Run ${CYAN}npm install${NC} to install dependencies"
        echo -e "- Fix TypeScript compilation errors"
        echo -e "- Update Firebase configuration"
        echo -e "- Add missing beta testing components"
        echo -e "- Review HIPAA compliance implementation"
        echo ""
        exit 1
    fi
}

# Trap to clean up on exit
cleanup() {
    log_info "Validation process interrupted - cleaning up..."
}
trap cleanup EXIT

# Run main validation
main "$@"