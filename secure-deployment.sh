#!/bin/bash
# ALCHM Secure Deployment Script
# Ensures all security fixes are applied before deployment

set -e  # Exit on any error

echo "🚨 ALCHM SECURE DEPLOYMENT VALIDATOR 🚨"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Validation functions
check_credentials() {
    echo "🔐 Checking credential security..."
    
    if [ -f ".env.local" ]; then
        # Check if .env.local contains template placeholders
        if grep -q "your_firebase_api_key_here\|your_project_id\|sk_test_or_live_key" .env.local; then
            echo -e "${RED}❌ .env.local contains template placeholders. Please fill with real (rotated) credentials.${NC}"
            return 1
        fi
        
        # Check if .env.local is properly secured
        if [ "$(stat -c %a .env.local 2>/dev/null || stat -f %A .env.local)" != "600" ]; then
            echo -e "${YELLOW}⚠️  Setting .env.local permissions to 600 (owner read/write only)${NC}"
            chmod 600 .env.local
        fi
        
        echo -e "${GREEN}✅ .env.local exists and appears configured${NC}"
    else
        echo -e "${RED}❌ .env.local not found. Copy from .env.local.template and configure.${NC}"
        return 1
    fi
}

check_gitignore() {
    echo "📝 Checking .gitignore security..."
    
    if grep -q ".env.local" .gitignore && grep -q "*.key" .gitignore; then
        echo -e "${GREEN}✅ .gitignore properly configured for security${NC}"
        return 0
    else
        echo -e "${RED}❌ .gitignore missing security exclusions${NC}"
        return 1
    fi
}

check_security_files() {
    echo "🛡️ Checking security implementation files..."
    
    local missing_files=()
    
    if [ ! -f "src/lib/security/security-audit-system.ts" ]; then
        missing_files+=("security-audit-system.ts")
    fi
    
    if [ ! -f "src/lib/security/security-privacy-fortress.ts" ]; then
        missing_files+=("security-privacy-fortress.ts")
    fi
    
    if [ ! -f "src/lib/middleware/authMiddleware.ts" ]; then
        missing_files+=("authMiddleware.ts")
    fi
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        echo -e "${GREEN}✅ All security implementation files present${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing security files: ${missing_files[*]}${NC}"
        return 1
    fi
}

check_api_security() {
    echo "🔒 Checking API endpoint security..."
    
    if grep -q "validateSession" pages/api/reflection.js && grep -q "SECURITY_HEADERS" pages/api/reflection.js; then
        echo -e "${GREEN}✅ Reflection API properly secured${NC}"
    else
        echo -e "${RED}❌ Reflection API missing security implementation${NC}"
        return 1
    fi
    
    if grep -q "allowedOrigins" src/app/api/privacy/export/route.ts; then
        echo -e "${GREEN}✅ Privacy export API CORS properly configured${NC}"
    else
        echo -e "${RED}❌ Privacy export API CORS not secured${NC}"
        return 1
    fi
}

check_dependencies() {
    echo "📦 Checking security dependencies..."
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found${NC}"
        return 1
    fi
    
    # Check if we have necessary security packages
    if npm list firebase-admin > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Firebase Admin SDK installed${NC}"
    else
        echo -e "${YELLOW}⚠️  Installing Firebase Admin SDK...${NC}"
        npm install firebase-admin
    fi
}

check_build() {
    echo "🏗️ Checking build integrity..."
    
    if npm run build > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Build successful${NC}"
        return 0
    else
        echo -e "${RED}❌ Build failed. Fix errors before deployment.${NC}"
        return 1
    fi
}

check_firebase_config() {
    echo "🔥 Checking Firebase configuration..."
    
    if [ -f "firebase.json" ]; then
        echo -e "${GREEN}✅ Firebase configuration found${NC}"
    else
        echo -e "${RED}❌ firebase.json not found${NC}"
        return 1
    fi
    
    # Check if hosting is properly configured
    if grep -q '"public"' firebase.json; then
        echo -e "${GREEN}✅ Firebase hosting configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Firebase hosting may not be configured${NC}"
    fi
}

security_audit() {
    echo "🔍 Running security audit..."
    
    local audit_passed=true
    
    # Check for common security vulnerabilities
    echo "   Checking for exposed secrets..."
    if grep -r "sk_live_\|pk_live_" src/ --exclude-dir=node_modules 2>/dev/null | grep -v ".template" | head -5; then
        echo -e "${RED}❌ Potential exposed Stripe keys found in source code${NC}"
        audit_passed=false
    fi
    
    if grep -r "AIza[0-9A-Za-z\\-_]{35}" src/ --exclude-dir=node_modules 2>/dev/null | grep -v ".template" | head -5; then
        echo -e "${RED}❌ Potential exposed Google API keys found in source code${NC}"
        audit_passed=false
    fi
    
    if [ "$audit_passed" = true ]; then
        echo -e "${GREEN}✅ No obvious security vulnerabilities found${NC}"
        return 0
    else
        echo -e "${RED}❌ Security audit failed - fix issues before deployment${NC}"
        return 1
    fi
}

deploy_to_firebase() {
    echo "🚀 Deploying to Firebase..."
    
    # Build the application
    npm run build
    
    # Deploy to Firebase
    if command -v firebase &> /dev/null; then
        firebase deploy --only hosting,functions
        echo -e "${GREEN}✅ Deployment completed${NC}"
    else
        echo -e "${RED}❌ Firebase CLI not installed. Install with: npm install -g firebase-tools${NC}"
        return 1
    fi
}

# Main execution
main() {
    echo "Starting security validation checks..."
    echo ""
    
    local checks_passed=0
    local total_checks=7
    
    # Run all security checks
    check_credentials && ((checks_passed++)) || echo -e "${RED}Failed credential check${NC}"
    check_gitignore && ((checks_passed++)) || echo -e "${RED}Failed gitignore check${NC}"
    check_security_files && ((checks_passed++)) || echo -e "${RED}Failed security files check${NC}"
    check_api_security && ((checks_passed++)) || echo -e "${RED}Failed API security check${NC}"
    check_dependencies && ((checks_passed++)) || echo -e "${RED}Failed dependencies check${NC}"
    check_firebase_config && ((checks_passed++)) || echo -e "${RED}Failed Firebase config check${NC}"
    security_audit && ((checks_passed++)) || echo -e "${RED}Failed security audit${NC}"
    
    echo ""
    echo "=========================================="
    echo "Security Validation Results:"
    echo "Passed: $checks_passed/$total_checks checks"
    
    if [ $checks_passed -eq $total_checks ]; then
        echo -e "${GREEN}🎉 All security checks passed!${NC}"
        echo ""
        
        read -p "Proceed with deployment? (y/N): " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            deploy_to_firebase
        else
            echo "Deployment cancelled by user."
        fi
    else
        echo -e "${RED}❌ Security validation failed. Fix issues before deployment.${NC}"
        echo ""
        echo "Required fixes:"
        echo "- Ensure all credentials are rotated and properly configured"
        echo "- Verify all security implementation files are in place"
        echo "- Fix any security audit issues"
        echo ""
        exit 1
    fi
}

# Run the main function
main "$@"