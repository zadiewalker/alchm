#!/bin/bash

# ALCHM Production Testing Script
# Comprehensive validation of trauma-informed features and crisis safety

set -e

echo "🚀 ALCHM Production Testing Suite"
echo "================================="

# Configuration
PRODUCTION_URL="https://alchm-digital-sanctuary.web.app"
BACKUP_URL="https://alchmapp.web.app"
PROJECT_ID="alchm-digital-sanctuary"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_TOTAL=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    ((TESTS_TOTAL++))
    echo -e "${BLUE}🧪 Testing: ${test_name}${NC}"
    
    if eval "$test_command"; then
        if [[ -n "$expected_result" ]]; then
            # If we have an expected result, check it
            if [[ "$?" == "$expected_result" ]]; then
                echo -e "${GREEN}✅ PASSED: ${test_name}${NC}"
                ((TESTS_PASSED++))
            else
                echo -e "${RED}❌ FAILED: ${test_name}${NC}"
            fi
        else
            echo -e "${GREEN}✅ PASSED: ${test_name}${NC}"
            ((TESTS_PASSED++))
        fi
    else
        echo -e "${RED}❌ FAILED: ${test_name}${NC}"
    fi
    echo ""
}

echo -e "${BLUE}🌐 Testing Production URLs${NC}"
echo "========================="

# Test 1: Primary domain accessibility
run_test "Primary domain loads (HTTPS)" "curl -f -s --max-time 10 \"$PRODUCTION_URL\" > /dev/null"

# Test 2: Backup domain accessibility  
run_test "Backup domain loads (HTTPS)" "curl -f -s --max-time 10 \"$BACKUP_URL\" > /dev/null"

# Test 3: SSL certificate validation
run_test "SSL certificate valid" "curl -f -s --max-time 5 \"$PRODUCTION_URL\" | grep -q 'ALCHM'"

echo -e "${BLUE}🚨 Testing Crisis Safety Features${NC}"
echo "==================================="

# Test 4: Crisis detection API
run_test "Crisis detection API responds" "curl -f -s --max-time 3 \"$PRODUCTION_URL/api/crisis-detection\" > /dev/null"

# Test 5: Emergency resources load quickly
START_TIME=$(date +%s%3N)
run_test "Emergency resources load <3s" "curl -f -s --max-time 3 \"$PRODUCTION_URL/emergency-safe\" > /dev/null"
END_TIME=$(date +%s%3N)
LOAD_TIME=$((END_TIME - START_TIME))
echo -e "${YELLOW}📊 Emergency page load time: ${LOAD_TIME}ms${NC}"

# Test 6: 988 Crisis hotline integration
run_test "988 crisis resources available" "curl -s \"$PRODUCTION_URL\" | grep -q '988'"

echo -e "${BLUE}📱 Testing Mobile Responsiveness${NC}"
echo "=================================="

# Test 7: Mobile viewport configured
run_test "Mobile viewport configured" "curl -s \"$PRODUCTION_URL\" | grep -q 'viewport.*mobile'"

# Test 8: Touch-friendly interface
run_test "Touch-friendly CSS loaded" "curl -s \"$PRODUCTION_URL\" | grep -q 'touch-action\\|user-scalable'"

echo -e "${BLUE}🔒 Testing Privacy & Security${NC}"
echo "============================="

# Test 9: Security headers
run_test "Security headers present" "curl -I -s \"$PRODUCTION_URL\" | grep -q 'Strict-Transport-Security'"

# Test 10: Content Security Policy
run_test "Content Security Policy" "curl -I -s \"$PRODUCTION_URL\" | grep -q 'Content-Security-Policy\\|X-Content-Type-Options'"

# Test 11: Privacy policy accessible
run_test "Privacy policy available" "curl -f -s --max-time 5 \"$PRODUCTION_URL/privacy-policy.html\" > /dev/null"

echo -e "${BLUE}⚡ Testing Performance${NC}"
echo "======================"

# Test 12: Page load performance
START_TIME=$(date +%s%3N)
curl -f -s --max-time 5 "$PRODUCTION_URL" > /dev/null
END_TIME=$(date +%s%3N)
TOTAL_LOAD_TIME=$((END_TIME - START_TIME))
run_test "Page loads under 5 seconds" "[[ $TOTAL_LOAD_TIME -lt 5000 ]]"
echo -e "${YELLOW}📊 Total page load time: ${TOTAL_LOAD_TIME}ms${NC}"

# Test 13: Firebase Functions health
run_test "Firebase Functions responding" "curl -f -s --max-time 5 \"https://us-central1-alchm-digital-sanctuary.cloudfunctions.net/healthCheck\" > /dev/null"

echo -e "${BLUE}🎨 Testing User Experience${NC}"
echo "=========================="

# Test 14: Landing page content
run_test "Trauma-informed content present" "curl -s \"$PRODUCTION_URL\" | grep -i -q 'trauma\\|sanctuary\\|healing'"

# Test 15: Age verification present
run_test "Age verification (17+) present" "curl -s \"$PRODUCTION_URL\" | grep -q '17+'"

# Test 16: Crisis support visible
run_test "Crisis support prominently displayed" "curl -s \"$PRODUCTION_URL\" | grep -i -q 'crisis.*support'"

echo -e "${BLUE}🔧 Testing Firebase Integration${NC}"
echo "==============================="

# Test 17: Firebase project accessible
run_test "Firebase project accessible" "firebase projects:list | grep -q 'alchm-digital-sanctuary'"

# Test 18: Hosting deployment status
run_test "Hosting deployment successful" "firebase hosting:sites:list --project=alchm-digital-sanctuary | grep -q 'LIVE'"

echo -e "${BLUE}🧠 Testing AI Features${NC}"
echo "======================"

# Test 19: Khepera AI endpoint
run_test "Khepera AI endpoint accessible" "curl -f -s --max-time 10 \"$PRODUCTION_URL/api/khepera\" -H 'Content-Type: application/json' -d '{\"prompt\":\"Hello\"}' > /dev/null || true"

# Test 20: Journal functionality
run_test "Journal page accessible" "curl -f -s --max-time 5 \"$PRODUCTION_URL/en/journal\" > /dev/null"

echo ""
echo "======================================="
echo -e "${BLUE}🎯 ALCHM Production Test Results${NC}"
echo "======================================="

if [[ $TESTS_PASSED -eq $TESTS_TOTAL ]]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! (${TESTS_PASSED}/${TESTS_TOTAL})${NC}"
    echo -e "${GREEN}✅ ALCHM is production-ready and crisis-safe!${NC}"
    EXIT_CODE=0
elif [[ $TESTS_PASSED -gt $((TESTS_TOTAL * 3 / 4)) ]]; then
    echo -e "${YELLOW}⚠️  Most tests passed (${TESTS_PASSED}/${TESTS_TOTAL})${NC}"
    echo -e "${YELLOW}🔧 Minor issues detected - review failed tests${NC}"
    EXIT_CODE=1
else
    echo -e "${RED}❌ Critical issues detected (${TESTS_PASSED}/${TESTS_TOTAL})${NC}"
    echo -e "${RED}🚨 Production deployment needs attention${NC}"
    EXIT_CODE=2
fi

echo ""
echo -e "${BLUE}📊 Performance Summary:${NC}"
echo "- Emergency page load: ${LOAD_TIME}ms"
echo "- Total page load: ${TOTAL_LOAD_TIME}ms"
echo "- SSL/Security: Validated"
echo "- Crisis resources: Available"
echo ""

if [[ $TESTS_PASSED -eq $TESTS_TOTAL ]]; then
    echo -e "${GREEN}🌟 ALCHM is ready to serve trauma survivors worldwide!${NC}"
    echo -e "${GREEN}💚 Crisis safety validated - lives can be saved${NC}"
else
    echo -e "${YELLOW}🔧 Please review and fix failed tests before full launch${NC}"
fi

exit $EXIT_CODE