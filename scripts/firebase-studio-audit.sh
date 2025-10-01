#!/bin/bash

# Firebase Studio Production Readiness Audit
echo "🔥 FIREBASE STUDIO PRODUCTION AUDIT - ALCHM"
echo "============================================="
echo ""

PASSED=0
FAILED=0
WARNINGS=0

# Function to print status
print_check() {
    local status=$1
    local message=$2
    
    case $status in
        "PASS")
            echo "✅ PASS: $message"
            ((PASSED++))
            ;;
        "FAIL")
            echo "❌ FAIL: $message"
            ((FAILED++))
            ;;
        "WARN")
            echo "⚠️  WARN: $message"
            ((WARNINGS++))
            ;;
    esac
}

echo "📋 FIREBASE PROJECT VALIDATION"
echo "==============================="

# Check Firebase project
if firebase use --current >/dev/null 2>&1; then
    PROJECT=$(firebase use --current)
    if [ "$PROJECT" = "alchm-digital-sanctuary" ]; then
        print_check "PASS" "Using production project: $PROJECT"
    else
        print_check "WARN" "Project: $PROJECT (consider production naming)"
    fi
else
    print_check "FAIL" "Firebase project not selected"
fi

# Check hosting
if firebase hosting:sites:list >/dev/null 2>&1; then
    print_check "PASS" "Firebase Hosting configured"
else
    print_check "FAIL" "Firebase Hosting not configured"
fi

# Check functions
FUNC_COUNT=$(firebase functions:list 2>/dev/null | grep -c nodejs || echo 0)
if [ "$FUNC_COUNT" -gt 0 ]; then
    print_check "PASS" "Cloud Functions deployed ($FUNC_COUNT functions)"
else
    print_check "FAIL" "No Cloud Functions deployed"
fi

echo ""
echo "🔒 SECURITY & COMPLIANCE"
echo "========================"

# Check Firestore rules
if [ -f "firestore.rules" ]; then
    print_check "PASS" "Firestore security rules present"
    if grep -q "isOwner\|request.auth.uid" firestore.rules; then
        print_check "PASS" "User-based security rules implemented"
    else
        print_check "WARN" "Basic security rules may need enhancement"
    fi
else
    print_check "FAIL" "Firestore security rules missing"
fi

# Check middleware security
if [ -f "middleware.ts" ]; then
    print_check "PASS" "Next.js middleware present"
    if grep -q "security\|headers" middleware.ts; then
        print_check "PASS" "Security middleware implemented"
    else
        print_check "WARN" "Security enhancements needed in middleware"
    fi
else
    print_check "FAIL" "Next.js middleware missing"
fi

echo ""
echo "⚡ PERFORMANCE & MONITORING"
echo "=========================="

# Check performance monitoring
if [ -f "src/lib/monitoring.ts" ]; then
    print_check "PASS" "Performance monitoring implemented"
else
    print_check "WARN" "Performance monitoring missing"
fi

# Check Firebase Performance in package.json
if grep -q "firebase/performance" package.json 2>/dev/null; then
    print_check "PASS" "Firebase Performance SDK included"
else
    print_check "WARN" "Firebase Performance SDK not found"
fi

# Check analytics
if grep -q "firebase/analytics" package.json 2>/dev/null; then
    print_check "PASS" "Firebase Analytics SDK included"
else
    print_check "WARN" "Firebase Analytics SDK not found"
fi

echo ""
echo "🏗️  BUILD & DEPLOYMENT"
echo "======================"

# Check Next.js config
if [ -f "next.config.js" ]; then
    print_check "PASS" "Next.js configuration present"
else
    print_check "FAIL" "Next.js configuration missing"
fi

# Check Firebase config
if [ -f "firebase.json" ]; then
    print_check "PASS" "Firebase configuration present"
    if grep -q '"hosting"' firebase.json; then
        print_check "PASS" "Hosting configuration found"
    else
        print_check "WARN" "Hosting configuration may be incomplete"
    fi
else
    print_check "FAIL" "Firebase configuration missing"
fi

# Test build
echo "Testing build process..."
if timeout 60 npm run build >/dev/null 2>&1; then
    print_check "PASS" "Build process successful"
else
    print_check "WARN" "Build process may have issues"
fi

echo ""
echo "📱 MOBILE & PWA READINESS"
echo "========================"

# Check PWA manifest
if [ -f "public/manifest.json" ]; then
    print_check "PASS" "PWA manifest found"
else
    print_check "WARN" "PWA manifest missing"
fi

# Check mobile icons
if [ -f "public/icons/icon-192x192.png" ]; then
    print_check "PASS" "Mobile app icons present"
else
    print_check "WARN" "Mobile app icons missing"
fi

echo ""
echo "🎯 FEATURE COMPLETENESS"
echo "======================="

# Check critical features
FEATURES=(
    "src/components/auth:Authentication system"
    "src/components/journal:Journal functionality"
    "src/components/dashboard:User dashboard"
    "src/lib/ab-testing.ts:A/B testing framework"
    "src/components/i18n:Internationalization"
    "src/components/analytics:Analytics system"
)

for feature in "${FEATURES[@]}"; do
    path="${feature%%:*}"
    name="${feature##*:}"
    
    if [ -e "$path" ]; then
        print_check "PASS" "$name implemented"
    else
        print_check "WARN" "$name missing"
    fi
done

echo ""
echo "📊 FIREBASE STUDIO READINESS SCORE"
echo "=================================="

TOTAL=$((PASSED + FAILED + WARNINGS))
if [ $TOTAL -gt 0 ]; then
    SCORE=$((PASSED * 100 / TOTAL))
    
    echo "Checks Passed: $PASSED"
    echo "Checks Failed: $FAILED"
    echo "Warnings: $WARNINGS"
    echo "Total Checks: $TOTAL"
    echo ""
    
    if [ $SCORE -ge 85 ]; then
        echo "🏆 FIREBASE STUDIO READY! Score: $SCORE%"
        echo "ALCHM is ready for Firebase Studio submission!"
    elif [ $SCORE -ge 70 ]; then
        echo "⚠️  MOSTLY READY. Score: $SCORE%"
        echo "Address warnings for optimal submission."
    else
        echo "❌ NEEDS WORK. Score: $SCORE%"
        echo "Critical issues must be resolved."
    fi
else
    echo "⚠️  Could not complete audit"
fi

echo ""
echo "🚀 NEXT STEPS:"
echo "1. Address any failed checks"
echo "2. Optimize performance metrics"
echo "3. Prepare Firebase Studio demo"
echo "4. Submit with confidence!"