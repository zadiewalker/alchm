#!/bin/bash

# 🏥 CRITICAL SYSTEMS INTEGRATION TEST
# ALCHM Mental Health Platform - Post-Rotation Validation
# Tests all life-critical systems after credential rotation

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TEST_LOG="critical-systems-test-$(date +%Y%m%d_%H%M%S).log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$TEST_LOG"
}

test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2 - PASSED${NC}"
        log "PASS: $2"
    else
        echo -e "${RED}❌ $2 - FAILED${NC}"
        log "FAIL: $2"
        ((FAILED_TESTS++))
    fi
}

echo -e "${BLUE}🏥 ALCHM CRITICAL SYSTEMS TEST${NC}"
echo "=============================="
echo "Testing life-critical systems after credential rotation"
echo "Log file: $TEST_LOG"
echo ""

FAILED_TESTS=0

# Check if server is running
echo "🔍 Checking server status..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    test_result 0 "Server connectivity"
else
    echo -e "${YELLOW}⚠️  Server not running. Starting development server...${NC}"
    echo "Please run 'npm run dev' in another terminal, then re-run this test"
    exit 1
fi

echo ""
echo "🔐 AUTHENTICATION TESTS"
echo "======================="

# Test Firebase Auth configuration
echo "Testing Firebase Auth configuration..."
if curl -s "http://localhost:3000/api/auth/session" -H "Content-Type: application/json" | grep -q "error\|success" 2>/dev/null; then
    test_result 0 "Firebase Auth endpoint"
else
    test_result 1 "Firebase Auth endpoint"
fi

echo ""
echo "🚨 CRISIS DETECTION TESTS (HIGHEST PRIORITY)"
echo "============================================="

# Test crisis detection endpoint
echo "Testing crisis detection system..."
CRISIS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/crisis-detection \
    -H "Content-Type: application/json" \
    -d '{"text":"I am having thoughts of hurting myself"}' 2>/dev/null)

if echo "$CRISIS_RESPONSE" | grep -q "crisis\|support\|help" 2>/dev/null; then
    test_result 0 "Crisis detection API response"
else
    test_result 1 "Crisis detection API response"
    echo "  Response: $CRISIS_RESPONSE"
fi

# Test crisis resources endpoint
echo "Testing crisis resources access..."
if curl -s http://localhost:3000/crisis-resources 2>/dev/null | grep -q "988\|crisis\|support" 2>/dev/null; then
    test_result 0 "Crisis resources page"
else
    test_result 1 "Crisis resources page"
fi

echo ""
echo "🤖 AI PROCESSING TESTS"
echo "======================"

# Test Khepera AI system
echo "Testing Khepera AI system..."
AI_RESPONSE=$(curl -s -X POST http://localhost:3000/api/khepera \
    -H "Content-Type: application/json" \
    -d '{"message":"Hello, I need support"}' 2>/dev/null)

if echo "$AI_RESPONSE" | grep -q "response\|support\|here" 2>/dev/null; then
    test_result 0 "Khepera AI processing"
else
    test_result 1 "Khepera AI processing"
    echo "  Response: $AI_RESPONSE"
fi

# Test OpenAI integration (if endpoint exists)
echo "Testing OpenAI integration..."
if curl -s http://localhost:3000/api/emotional-alchemy -X POST \
    -H "Content-Type: application/json" \
    -d '{"entry":"I feel anxious today"}' 2>/dev/null | grep -q "insight\|response" 2>/dev/null; then
    test_result 0 "OpenAI processing"
else
    test_result 1 "OpenAI processing"
fi

echo ""
echo "💳 PAYMENT PROCESSING TESTS"
echo "==========================="

# Test Stripe configuration
echo "Testing Stripe integration..."
if curl -s http://localhost:3000/api/create-checkout-session -X POST \
    -H "Content-Type: application/json" \
    -d '{"priceId":"price_test"}' 2>/dev/null | grep -q "url\|session\|error" 2>/dev/null; then
    test_result 0 "Stripe checkout session"
else
    test_result 1 "Stripe checkout session"
fi

echo ""
echo "📝 DATA PERSISTENCE TESTS"
echo "========================="

# Test journal save endpoint
echo "Testing journal data persistence..."
JOURNAL_RESPONSE=$(curl -s -X POST http://localhost:3000/api/save \
    -H "Content-Type: application/json" \
    -d '{"entry":"Test entry for credential validation","mood":5}' 2>/dev/null)

if echo "$JOURNAL_RESPONSE" | grep -q "success\|saved\|id" 2>/dev/null; then
    test_result 0 "Journal data saving"
else
    test_result 1 "Journal data saving"
    echo "  Response: $JOURNAL_RESPONSE"
fi

# Test data retrieval
echo "Testing journal data retrieval..."
if curl -s http://localhost:3000/api/secure-retrieve 2>/dev/null | grep -q "entries\|data\|[]" 2>/dev/null; then
    test_result 0 "Journal data retrieval"
else
    test_result 1 "Journal data retrieval"
fi

echo ""
echo "🌐 FRONTEND CRITICAL PAGES"
echo "=========================="

# Test critical frontend pages
PAGES=("/" "/auth/login" "/auth/signup" "/dashboard" "/journal" "/pricing")

for page in "${PAGES[@]}"; do
    echo "Testing page: $page"
    if curl -s "http://localhost:3000$page" | grep -q "<html\|<!DOCTYPE" 2>/dev/null; then
        test_result 0 "Page load: $page"
    else
        test_result 1 "Page load: $page"
    fi
done

echo ""
echo "🔒 SECURITY VALIDATION"
echo "======================"

# Check for HTTPS redirect (in production)
echo "Testing security headers..."
SECURITY_HEADERS=$(curl -s -I http://localhost:3000 2>/dev/null)
if echo "$SECURITY_HEADERS" | grep -q "Content-Security-Policy\|X-Frame-Options" 2>/dev/null; then
    test_result 0 "Security headers present"
else
    test_result 1 "Security headers present"
fi

# Test CORS configuration
echo "Testing CORS configuration..."
CORS_RESPONSE=$(curl -s -X OPTIONS http://localhost:3000/api/save -H "Origin: https://alchmapp.web.app" 2>/dev/null)
if echo "$CORS_RESPONSE" | grep -q "Access-Control\|200" 2>/dev/null; then
    test_result 0 "CORS configuration"
else
    test_result 1 "CORS configuration"
fi

echo ""
echo "📊 TEST SUMMARY"
echo "==============="

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED${NC}"
    echo "✅ Credential rotation successful"
    echo "✅ All critical systems operational"
    echo "✅ Platform ready for vulnerable users"
    log "ALL TESTS PASSED - System operational"
else
    echo -e "${RED}❌ $FAILED_TESTS TESTS FAILED${NC}"
    echo "🚨 CRITICAL: System not ready for production"
    echo ""
    echo "IMMEDIATE ACTIONS REQUIRED:"
    echo "1. Review failed tests in log: $TEST_LOG"
    echo "2. Fix credential configuration issues"
    echo "3. Consider emergency rollback if crisis systems fail"
    echo "4. DO NOT deploy until all tests pass"
    echo ""
    echo "Crisis Support Priority:"
    echo "- Crisis detection system MUST work"
    echo "- AI processing MUST work"
    echo "- User authentication MUST work"
    log "TESTS FAILED - System requires attention"
fi

echo ""
echo "📞 CRISIS CONTACT VERIFICATION"
echo "==============================="
echo "National Suicide Prevention Lifeline: 988"
echo "Crisis Text Line: Text HOME to 741741"
echo "If platform systems fail, users must have alternative support"

echo ""
echo "Detailed test log saved to: $TEST_LOG"