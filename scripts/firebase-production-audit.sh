#!/bin/bash

# 🔥 FIREBASE STUDIO PRODUCTION AUDIT SCRIPT
# This script validates all Firebase services for Firebase Studio submission

set -e

echo "🏆 FIREBASE STUDIO PUBLICATION AUDIT - ALCHM"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to print status
print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "PASS")
            echo -e "${GREEN}✅ PASS${NC}: $message"
            ((PASSED++))
            ;;
        "FAIL")
            echo -e "${RED}❌ FAIL${NC}: $message"
            ((FAILED++))
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  WARN${NC}: $message"
            ((WARNINGS++))
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  INFO${NC}: $message"
            ;;
    esac
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo ""
echo "🔧 Phase 1: Firebase CLI & Project Validation"
echo "=============================================="

# Check Firebase CLI
if command_exists firebase; then
    print_status "PASS" "Firebase CLI is installed"
    FIREBASE_VERSION=$(firebase --version | head -n1)
    print_status "INFO" "Firebase CLI Version: $FIREBASE_VERSION"
else
    print_status "FAIL" "Firebase CLI not installed"
    exit 1
fi

# Check if logged in
if firebase projects:list >/dev/null 2>&1; then
    print_status "PASS" "Firebase CLI authenticated"
else
    print_status "FAIL" "Firebase CLI not authenticated. Run: firebase login"
    exit 1
fi

# Check current project
CURRENT_PROJECT=$(firebase use --current 2>/dev/null || echo "none")
if [ "$CURRENT_PROJECT" == "alchm-digital-sanctuary" ]; then
    print_status "PASS" "Using production project: $CURRENT_PROJECT"
else
    print_status "FAIL" "Not using production project. Current: $CURRENT_PROJECT"
    echo "Run: firebase use alchm-digital-sanctuary"
fi

echo ""
echo "🏗️  Phase 2: Project Architecture Validation"
echo "============================================="

# Check hosting sites
echo "Checking hosting configuration..."
if firebase hosting:sites:list >/dev/null 2>&1; then
    print_status "PASS" "Firebase Hosting is configured"
    
    # Check for custom domains (we'll implement this)
    print_status "WARN" "Custom domain not yet configured (alchm.app recommended)"
else
    print_status "FAIL" "Firebase Hosting not properly configured"
fi

# Check functions deployment
echo "Checking Cloud Functions..."
FUNCTIONS_COUNT=$(firebase functions:list 2>/dev/null | grep -c "│" | tail -1 || echo "0")
if [ "$FUNCTIONS_COUNT" -gt 15 ]; then
    print_status "PASS" "Cloud Functions deployed ($FUNCTIONS_COUNT functions)"
else
    print_status "WARN" "Limited Cloud Functions deployed ($FUNCTIONS_COUNT functions)"
fi

# Check for Next.js app function
if firebase functions:list 2>/dev/null | grep -q "nextApp"; then
    print_status "PASS" "Next.js app function deployed"
else
    print_status "FAIL" "Next.js app function not found"
fi

echo ""
echo "📊 Phase 3: Performance & Monitoring Setup"
echo "==========================================="

# Check package.json for performance dependencies
if [ -f "package.json" ]; then
    print_status "PASS" "Package.json found"
    
    # Check for Firebase Performance
    if grep -q "firebase/performance" package.json; then
        print_status "PASS" "Firebase Performance SDK included"
    else
        print_status "WARN" "Firebase Performance SDK not found in package.json"
    fi
    
    # Check for Firebase Analytics
    if grep -q "firebase/analytics" package.json; then
        print_status "PASS" "Firebase Analytics SDK included"
    else
        print_status "WARN" "Firebase Analytics SDK not found in package.json"
    fi
else
    print_status "FAIL" "Package.json not found"
fi

# Check for monitoring files
if [ -f "src/lib/monitoring.ts" ]; then
    print_status "PASS" "Performance monitoring implementation found"
else
    print_status "FAIL" "Performance monitoring implementation missing"
fi

echo ""
echo "🔒 Phase 4: Security & Compliance Validation"
echo "============================================"

# Check Firestore rules
if [ -f "firestore.rules" ]; then
    print_status "PASS" "Firestore security rules file found"
    
    # Check for privacy-first rules
    if grep -q "isOwner" firestore.rules; then
        print_status "PASS" "Owner-based security rules implemented"
    else
        print_status "WARN" "Owner-based security rules not clearly implemented"
    fi
    
    # Check for crisis detection rules
    if grep -q "safety_events" firestore.rules; then
        print_status "PASS" "Crisis detection security rules found"
    else
        print_status "WARN" "Crisis detection security rules not found"
    fi
else
    print_status "FAIL" "Firestore security rules file not found"
fi

# Check middleware security
if [ -f "middleware.ts" ]; then
    print_status "PASS" "Next.js middleware found"
    
    if grep -q "applySecurityHeaders" middleware.ts; then
        print_status "PASS" "Security headers middleware implemented"
    else
        print_status "WARN" "Security headers not implemented in middleware"
    fi
else
    print_status "FAIL" "Next.js middleware not found"
fi

# Check for security middleware
if [ -f "src/middleware/security.ts" ]; then
    print_status "PASS" "Security middleware implementation found"
else
    print_status "FAIL" "Security middleware implementation missing"
fi

echo ""
echo "🧪 Phase 5: Build & Deployment Validation"
echo "========================================="

# Check Next.js config
if [ -f "next.config.js" ]; then
    print_status "PASS" "Next.js configuration found"
    
    if grep -q "output.*export" next.config.js; then
        print_status "PASS" "Static export configuration found"
    else
        print_status "WARN" "Static export configuration not found"
    fi
else
    print_status "FAIL" "Next.js configuration not found"
fi

# Check Firebase config
if [ -f "firebase.json" ]; then
    print_status "PASS" "Firebase configuration found"
    
    if grep -q "hosting" firebase.json; then
        print_status "PASS" "Hosting configuration found in firebase.json"
    else
        print_status "FAIL" "Hosting configuration not found in firebase.json"
    fi
    
    if grep -q "functions" firebase.json; then
        print_status "PASS" "Functions configuration found in firebase.json"
    else
        print_status "WARN" "Functions configuration not found in firebase.json"
    fi
else
    print_status "FAIL" "Firebase configuration not found"
fi

# Test build process
echo "Testing build process..."
if npm run build >/dev/null 2>&1; then
    print_status "PASS" "Build process successful"
else
    print_status "FAIL" "Build process failed"
fi

echo ""
echo "📱 Phase 6: PWA & Mobile Readiness"
echo "=================================="

# Check PWA manifest
if [ -f "public/manifest.json" ]; then
    print_status "PASS" "PWA manifest found"
else
    print_status "WARN" "PWA manifest not found"
fi

# Check for service worker
if [ -f "public/sw.js" ] || grep -q "serviceWorker" src/app/layout.tsx 2>/dev/null; then
    print_status "PASS" "Service worker configuration found"
else
    print_status "WARN" "Service worker not configured"
fi

# Check for mobile icons
if [ -d "public/icons" ] && [ -f "public/icons/icon-192x192.png" ]; then
    print_status "PASS" "Mobile app icons found"
else
    print_status "WARN" "Mobile app icons not found or incomplete"
fi

echo ""
echo "🎯 Phase 7: Feature Completeness Check"
echo "====================================="

# Check critical components
CRITICAL_COMPONENTS=(
    "src/components/auth"
    "src/components/journal"
    "src/components/dashboard"
    "src/components/community"
    "src/components/export"
    "src/components/i18n"
    "src/components/analytics"
    "src/components/enterprise"
    "src/components/admin"
    "src/lib/ab-testing.ts"
)

for component in "${CRITICAL_COMPONENTS[@]}"; do
    if [ -e "$component" ]; then
        print_status "PASS" "Critical component found: $component"
    else
        print_status "WARN" "Critical component missing: $component"
    fi
done

# Check API routes
API_ROUTES=(
    "src/app/api/auth"
    "src/app/api/save"
    "src/app/api/analytics"
    "src/app/api/crisis-detection"
    "src/app/api/ab-testing"
)

for route in "${API_ROUTES[@]}"; do
    if [ -d "$route" ]; then
        print_status "PASS" "API route found: $route"
    else
        print_status "WARN" "API route missing: $route"
    fi
done

echo ""
echo "🚀 Phase 8: Firebase Studio Readiness Score"
echo "==========================================="

TOTAL_CHECKS=$((PASSED + FAILED + WARNINGS))
SUCCESS_RATE=$((PASSED * 100 / TOTAL_CHECKS))

echo -e "${BLUE}📊 AUDIT RESULTS:${NC}"
echo -e "${GREEN}   ✅ Passed: $PASSED${NC}"
echo -e "${RED}   ❌ Failed: $FAILED${NC}"
echo -e "${YELLOW}   ⚠️  Warnings: $WARNINGS${NC}"
echo -e "${BLUE}   📊 Total Checks: $TOTAL_CHECKS${NC}"
echo ""

if [ $SUCCESS_RATE -ge 90 ]; then
    echo -e "${GREEN}🏆 FIREBASE STUDIO READY: $SUCCESS_RATE% Success Rate${NC}"
    echo -e "${GREEN}   ALCHM is ready for Firebase Studio submission!${NC}"
elif [ $SUCCESS_RATE -ge 75 ]; then
    echo -e "${YELLOW}⚠️  MOSTLY READY: $SUCCESS_RATE% Success Rate${NC}"
    echo -e "${YELLOW}   Address warnings for optimal Firebase Studio submission${NC}"
else
    echo -e "${RED}❌ NOT READY: $SUCCESS_RATE% Success Rate${NC}"
    echo -e "${RED}   Critical issues must be resolved before submission${NC}"
fi

echo ""
echo "🎯 NEXT STEPS FOR FIREBASE STUDIO:"
if [ $FAILED -gt 0 ]; then
    echo "1. Fix all failed checks above"
fi
if [ $WARNINGS -gt 0 ]; then
    echo "2. Address warnings for optimal submission"
fi
echo "3. Run comprehensive performance testing"
echo "4. Prepare demo environment with sample data"
echo "5. Document Firebase services integration"
echo "6. Submit to Firebase Studio with confidence"

echo ""
echo "🔥 Ready to make Firebase Studio executives call their VCs!"

exit $FAILED