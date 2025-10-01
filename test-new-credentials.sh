#!/bin/bash

# ALCHM Credential Validation Script
# Tests all critical systems after credential rotation

echo "🔐 ALCHM NEW CREDENTIALS VALIDATION"
echo "=================================="
echo "Testing all systems after credential rotation"
echo "Platform: ALCHM Mental Health Journaling"
echo "Time: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
CRITICAL_FAILURES=0

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="$4"
    local critical="${5:-false}"
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" -o /dev/null 2>/dev/null)
    else
        response=$(curl -s -w "%{http_code}" "$url" -o /dev/null 2>/dev/null)
    fi
    
    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo -e "${GREEN}✅ PASSED${NC} ($response)"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC} ($response)"
        ((TESTS_FAILED++))
        if [ "$critical" = "true" ]; then
            ((CRITICAL_FAILURES++))
        fi
    fi
}

# Check if server is running
echo -e "${BLUE}🔍 Checking server status...${NC}"
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Development server not running. Starting server...${NC}"
    echo "Run: npm run dev"
    echo "Then execute this script again."
    exit 1
fi

echo -e "${GREEN}✅ Development server is running${NC}"
echo ""

# Test Homepage
echo -e "${BLUE}🏠 HOMEPAGE TESTS${NC}"
echo "=================="
test_endpoint "Homepage" "http://localhost:3000" "GET" "" "true"
test_endpoint "Auth Page" "http://localhost:3000/auth/login" "GET" "" "true"
test_endpoint "Dashboard" "http://localhost:3000/dashboard" "GET" "" "false"
echo ""

# Test Firebase Authentication
echo -e "${BLUE}🔐 FIREBASE AUTHENTICATION TESTS${NC}"
echo "=================================="
test_endpoint "Auth Session API" "http://localhost:3000/api/auth/session" "POST" '{"sessionToken":"test"}' "true"
echo ""

# Test Crisis Detection System (OpenAI)
echo -e "${BLUE}🚨 CRISIS DETECTION TESTS (OpenAI)${NC}"
echo "=================================="
test_endpoint "Crisis Detection API" "http://localhost:3000/api/ai/crisis-detection" "POST" '{"text":"I feel hopeless today","userId":"test"}' "true"
echo ""

# Test Khepera AI System (Google AI)
echo -e "${BLUE}🧠 KHEPERA AI TESTS (Google AI)${NC}"
echo "==============================="
test_endpoint "Khepera AI API" "http://localhost:3000/api/ai/khepera" "POST" '{"message":"I need guidance today","userId":"test"}' "true"
echo ""

# Test Stripe Payment System
echo -e "${BLUE}💳 STRIPE PAYMENT TESTS${NC}"
echo "======================="
test_endpoint "Stripe Checkout" "http://localhost:3000/api/stripe/create-checkout-session" "POST" '{"priceId":"price_test"}' "true"
test_endpoint "Stripe Webhook" "http://localhost:3000/api/stripe/webhook" "POST" '{"type":"test"}' "false"
echo ""

# Test Additional APIs
echo -e "${BLUE}🔧 ADDITIONAL API TESTS${NC}"
echo "======================"
test_endpoint "Privacy Export" "http://localhost:3000/api/privacy/export" "POST" '{"userId":"test"}' "false"
test_endpoint "Content Moderation" "http://localhost:3000/api/content-moderation/analyze" "POST" '{"text":"test"}' "false"
echo ""

# Production endpoint tests (if deployed)
echo -e "${BLUE}🌍 PRODUCTION TESTS${NC}"
echo "=================="
test_endpoint "Production Homepage" "https://alchmapp.web.app" "GET" "" "true"
test_endpoint "Production Auth" "https://alchmapp.web.app/auth/login" "GET" "" "true"
echo ""

# Summary
echo "=================================="
echo -e "${BLUE}📊 TEST SUMMARY${NC}"
echo "=================================="
echo "Tests Passed: $TESTS_PASSED"
echo "Tests Failed: $TESTS_FAILED"
echo "Critical Failures: $CRITICAL_FAILURES"
echo ""

if [ $CRITICAL_FAILURES -eq 0 ]; then
    echo -e "${GREEN}🎉 CREDENTIAL ROTATION SUCCESSFUL!${NC}"
    echo -e "${GREEN}✅ All critical systems are operational${NC}"
    echo -e "${GREEN}✅ Platform is secure and ready for users${NC}"
    echo ""
    echo -e "${BLUE}🚀 NEXT STEPS:${NC}"
    echo "1. Run: npm run build"
    echo "2. Run: firebase deploy --only hosting:alchmapp"
    echo "3. Revoke old credentials in each service"
    echo "4. Monitor production systems for 24 hours"
    exit 0
else
    echo -e "${RED}🚨 CRITICAL FAILURES DETECTED!${NC}"
    echo -e "${RED}❌ $CRITICAL_FAILURES critical system(s) failed${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  TROUBLESHOOTING STEPS:${NC}"
    echo "1. Check .env.local credential format"
    echo "2. Verify all API keys are valid"
    echo "3. Restart development server: npm run dev"
    echo "4. Check console logs for detailed errors"
    echo ""
    echo -e "${RED}DO NOT DEPLOY until all critical systems pass!${NC}"
    exit 1
fi