#!/bin/bash

# Production User Flow Testing Script for ALCHM
# This script tests all critical user flows in the production environment

echo "🚀 ALCHM Production User Flow Testing"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNING_TESTS=0

# Configuration
PRODUCTION_URL="${NEXT_PUBLIC_APP_URL:-https://alchm-digital-sanctuary.web.app}"
TIMEOUT=30

# Function to increment counters
increment_counter() {
    local status=$1
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    case $status in
        "pass") PASSED_TESTS=$((PASSED_TESTS + 1)) ;;
        "fail") FAILED_TESTS=$((FAILED_TESTS + 1)) ;;
        "warn") WARNING_TESTS=$((WARNING_TESTS + 1)) ;;
    esac
}

# Function to test HTTP response
test_http_response() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo "🔍 Testing: $description"
    echo "   URL: $url"
    
    if ! command -v curl >/dev/null 2>&1; then
        echo -e "${RED}❌ curl not available${NC}"
        increment_counter "fail"
        return 1
    fi
    
    local response=$(curl -s -o /dev/null -w "%{http_code},%{time_total},%{size_download}" --max-time $TIMEOUT "$url" 2>/dev/null)
    local http_code=$(echo $response | cut -d',' -f1)
    local time_total=$(echo $response | cut -d',' -f2)
    local size_download=$(echo $response | cut -d',' -f3)
    
    if [ -z "$http_code" ]; then
        echo -e "${RED}❌ Failed to connect${NC}"
        increment_counter "fail"
        return 1
    fi
    
    echo "   Status: $http_code | Time: ${time_total}s | Size: ${size_download} bytes"
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ HTTP $expected_status response received${NC}"
        increment_counter "pass"
        
        # Check response time
        local time_ms=$(echo "$time_total * 1000" | bc 2>/dev/null | cut -d'.' -f1)
        if [ -n "$time_ms" ] && [ "$time_ms" -lt 3000 ]; then
            echo -e "${GREEN}✅ Response time acceptable (<3s)${NC}"
        elif [ -n "$time_ms" ] && [ "$time_ms" -lt 10000 ]; then
            echo -e "${YELLOW}⚠️  Response time slow (${time_ms}ms)${NC}"
            increment_counter "warn"
        else
            echo -e "${RED}❌ Response time too slow (>10s)${NC}"
            increment_counter "fail"
        fi
        
        return 0
    else
        echo -e "${RED}❌ Expected $expected_status, got $http_code${NC}"
        increment_counter "fail"
        return 1
    fi
}

# Function to test API endpoint
test_api_endpoint() {
    local endpoint=$1
    local method=$2
    local expected_status=$3
    local description=$4
    local payload=$5
    
    echo "🔍 Testing API: $description"
    echo "   Endpoint: $endpoint"
    echo "   Method: $method"
    
    local curl_args=(-s -o /dev/null -w "%{http_code},%{time_total}" --max-time $TIMEOUT -X "$method")
    
    if [ -n "$payload" ]; then
        curl_args+=(-H "Content-Type: application/json" -d "$payload")
    fi
    
    local response=$(curl "${curl_args[@]}" "$PRODUCTION_URL$endpoint" 2>/dev/null)
    local http_code=$(echo $response | cut -d',' -f1)
    local time_total=$(echo $response | cut -d',' -f2)
    
    if [ -z "$http_code" ]; then
        echo -e "${RED}❌ Failed to connect to API${NC}"
        increment_counter "fail"
        return 1
    fi
    
    echo "   Status: $http_code | Time: ${time_total}s"
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ API returned expected status $expected_status${NC}"
        increment_counter "pass"
        return 0
    else
        echo -e "${RED}❌ Expected $expected_status, got $http_code${NC}"
        increment_counter "fail"
        return 1
    fi
}

# Function to test page load and content
test_page_content() {
    local path=$1
    local expected_content=$2
    local description=$3
    
    echo "🔍 Testing page content: $description"
    echo "   Path: $path"
    
    local content=$(curl -s --max-time $TIMEOUT "$PRODUCTION_URL$path" 2>/dev/null)
    
    if [ -z "$content" ]; then
        echo -e "${RED}❌ Failed to load page content${NC}"
        increment_counter "fail"
        return 1
    fi
    
    if echo "$content" | grep -q "$expected_content"; then
        echo -e "${GREEN}✅ Expected content found${NC}"
        increment_counter "pass"
        return 0
    else
        echo -e "${RED}❌ Expected content not found${NC}"
        echo "   Looking for: $expected_content"
        increment_counter "fail"
        return 1
    fi
}

# Function to test security headers
test_security_headers() {
    local url=$1
    local description=$2
    
    echo "🔍 Testing security headers: $description"
    echo "   URL: $url"
    
    local headers=$(curl -s -I --max-time $TIMEOUT "$url" 2>/dev/null)
    
    if [ -z "$headers" ]; then
        echo -e "${RED}❌ Failed to get headers${NC}"
        increment_counter "fail"
        return 1
    fi
    
    # Check for important security headers
    local security_checks=0
    local total_security_checks=5
    
    if echo "$headers" | grep -qi "x-frame-options"; then
        echo -e "${GREEN}✅ X-Frame-Options header present${NC}"
        security_checks=$((security_checks + 1))
    else
        echo -e "${YELLOW}⚠️  X-Frame-Options header missing${NC}"
    fi
    
    if echo "$headers" | grep -qi "x-content-type-options"; then
        echo -e "${GREEN}✅ X-Content-Type-Options header present${NC}"
        security_checks=$((security_checks + 1))
    else
        echo -e "${YELLOW}⚠️  X-Content-Type-Options header missing${NC}"
    fi
    
    if echo "$headers" | grep -qi "strict-transport-security"; then
        echo -e "${GREEN}✅ HSTS header present${NC}"
        security_checks=$((security_checks + 1))
    else
        echo -e "${YELLOW}⚠️  HSTS header missing${NC}"
    fi
    
    if echo "$headers" | grep -qi "content-security-policy"; then
        echo -e "${GREEN}✅ CSP header present${NC}"
        security_checks=$((security_checks + 1))
    else
        echo -e "${YELLOW}⚠️  CSP header missing${NC}"
    fi
    
    if echo "$headers" | grep -qi "referrer-policy"; then
        echo -e "${GREEN}✅ Referrer-Policy header present${NC}"
        security_checks=$((security_checks + 1))
    else
        echo -e "${YELLOW}⚠️  Referrer-Policy header missing${NC}"
    fi
    
    if [ $security_checks -ge 3 ]; then
        echo -e "${GREEN}✅ Adequate security headers ($security_checks/$total_security_checks)${NC}"
        increment_counter "pass"
    else
        echo -e "${YELLOW}⚠️  Insufficient security headers ($security_checks/$total_security_checks)${NC}"
        increment_counter "warn"
    fi
}

# Load environment variables if available
if [ -f ".env.local" ]; then
    set -a
    source .env.local
    set +a
fi

echo -e "\n${BLUE}🌐 Testing Production Environment${NC}"
echo "Production URL: $PRODUCTION_URL"
echo "Timeout: ${TIMEOUT}s"

# Test 1: Basic connectivity and homepage
echo -e "\n${BLUE}📋 Test 1: Basic Connectivity${NC}"
test_http_response "$PRODUCTION_URL" 200 "Homepage accessibility"
test_page_content "/" "ALCHM" "Homepage contains app name"

# Test 2: Authentication pages
echo -e "\n${BLUE}📋 Test 2: Authentication Flow${NC}"
test_http_response "$PRODUCTION_URL/auth" 200 "Authentication page"
test_page_content "/auth" "Sign" "Authentication page contains sign-in elements"

# Test 3: Core application pages
echo -e "\n${BLUE}📋 Test 3: Core Application Pages${NC}"
test_http_response "$PRODUCTION_URL/journals" 200 "Journals page"
test_http_response "$PRODUCTION_URL/home" 200 "Home page"

# Test 4: Error pages
echo -e "\n${BLUE}📋 Test 4: Error Handling${NC}"
test_http_response "$PRODUCTION_URL/non-existent-page" 404 "404 error page"
test_page_content "/non-existent-page" "404\|Not Found\|Page not found" "404 page contains error message"

# Test 5: API endpoints (health checks)
echo -e "\n${BLUE}📋 Test 5: API Health Checks${NC}"
test_api_endpoint "/api/health/ping" "GET" 200 "Basic health check"
test_api_endpoint "/api/health/status" "GET" 200 "Detailed health status"
test_api_endpoint "/api/health/database" "GET" 200 "Database connectivity"

# Test 6: API authentication (should require auth)
echo -e "\n${BLUE}📋 Test 6: API Security${NC}"
test_api_endpoint "/api/journals" "GET" 401 "Protected journals API (should require auth)"
test_api_endpoint "/api/save" "POST" 401 "Protected save API (should require auth)"

# Test 7: Static assets
echo -e "\n${BLUE}📋 Test 7: Static Assets${NC}"
test_http_response "$PRODUCTION_URL/favicon.ico" 200 "Favicon"
test_http_response "$PRODUCTION_URL/manifest.json" 200 "PWA manifest"

# Test 8: Security headers
echo -e "\n${BLUE}📋 Test 8: Security Headers${NC}"
test_security_headers "$PRODUCTION_URL" "Homepage security headers"

# Test 9: Performance and optimization
echo -e "\n${BLUE}📋 Test 9: Performance Checks${NC}"

# Test compression
echo "🔍 Testing compression..."
local compression_test=$(curl -s -H "Accept-Encoding: gzip,deflate" -I --max-time $TIMEOUT "$PRODUCTION_URL" 2>/dev/null)
if echo "$compression_test" | grep -qi "content-encoding"; then
    echo -e "${GREEN}✅ Compression enabled${NC}"
    increment_counter "pass"
else
    echo -e "${YELLOW}⚠️  No compression detected${NC}"
    increment_counter "warn"
fi

# Test caching headers for static assets
echo "🔍 Testing caching headers..."
local cache_test=$(curl -s -I --max-time $TIMEOUT "$PRODUCTION_URL/_next/static/" 2>/dev/null)
if echo "$cache_test" | grep -qi "cache-control"; then
    echo -e "${GREEN}✅ Caching headers present${NC}"
    increment_counter "pass"
else
    echo -e "${YELLOW}⚠️  No caching headers found${NC}"
    increment_counter "warn"
fi

# Test 10: PWA functionality
echo -e "\n${BLUE}📋 Test 10: PWA Features${NC}"
test_http_response "$PRODUCTION_URL/sw.js" 200 "Service Worker"
test_page_content "/manifest.json" "ALCHM" "PWA manifest contains app name"

# Test 11: Internationalization
echo -e "\n${BLUE}📋 Test 11: Internationalization${NC}"
test_http_response "$PRODUCTION_URL/en" 200 "English locale"
test_http_response "$PRODUCTION_URL/es" 200 "Spanish locale"

# Test 12: SEO and meta tags
echo -e "\n${BLUE}📋 Test 12: SEO & Meta Tags${NC}"
test_page_content "/" "<title>" "Page has title tag"
test_page_content "/" "<meta.*description" "Page has meta description"
test_page_content "/" "<meta.*viewport" "Page has viewport meta tag"

# Generate test report
echo -e "\n${BLUE}📝 Generating Test Report${NC}"

cat > production-test-report.md << EOF
# ALCHM Production User Flow Test Report

**Generated:** $(date)
**Production URL:** $PRODUCTION_URL
**Test Duration:** ${TIMEOUT}s timeout per test

## Test Results Summary

- **Total Tests:** $TOTAL_TESTS
- **Passed:** $PASSED_TESTS
- **Failed:** $FAILED_TESTS  
- **Warnings:** $WARNING_TESTS
- **Success Rate:** $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%

## Test Categories

### ✅ Basic Connectivity
- Homepage accessibility and content
- Core application pages
- Static assets loading

### 🔐 Authentication & Security
- Authentication pages accessibility
- API security (protected endpoints)
- Security headers validation
- Error page handling

### ⚡ Performance & Optimization
- Response time validation
- Compression testing
- Caching headers verification
- Asset optimization

### 🌐 PWA & Modern Web Features
- Service Worker functionality
- PWA manifest validation
- Internationalization support

### 📊 API Health Checks
- Basic ping endpoint
- Detailed status endpoint
- Database connectivity

### 🔍 SEO & Accessibility
- Meta tags presence
- Title tags validation
- Viewport configuration

## Recommendations

$(if [ $FAILED_TESTS -eq 0 ]; then
    echo "✅ All critical tests passed! Production environment is ready."
else
    echo "❌ $FAILED_TESTS tests failed. Address these issues before full production launch:"
    echo "- Review failed connectivity tests"
    echo "- Fix API endpoint issues"
    echo "- Resolve security header problems"
fi)

$(if [ $WARNING_TESTS -gt 0 ]; then
    echo "⚠️ $WARNING_TESTS warnings found. Consider addressing for optimal performance:"
    echo "- Implement missing security headers"
    echo "- Optimize slow response times"
    echo "- Enable compression if missing"
    echo "- Configure proper caching headers"
fi)

## Next Steps

1. Address any failed tests immediately
2. Implement fixes for warning-level issues
3. Re-run tests after fixes
4. Set up automated monitoring for these flows
5. Schedule regular production testing
6. Monitor user analytics for real-world performance

---
*This report was generated by the ALCHM production testing script*
EOF

echo -e "${GREEN}✅ Test report generated: production-test-report.md${NC}"

# Summary
echo -e "\n${BLUE}📊 Production User Flow Test Summary${NC}"
echo "============================================"
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${YELLOW}Warnings: $WARNING_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"

if [ $TOTAL_TESTS -gt 0 ]; then
    local success_rate=$(( PASSED_TESTS * 100 / TOTAL_TESTS ))
    echo -e "Success Rate: ${success_rate}%"
fi

# Recommendations
echo -e "\n${BLUE}💡 Production Readiness Assessment${NC}"
echo "============================================"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 Production environment is ready for launch!${NC}"
    echo -e "${GREEN}✅ All critical user flows are working correctly${NC}"
else
    echo -e "${RED}❌ $FAILED_TESTS critical issues found${NC}"
    echo -e "${RED}🚨 Address these issues before production launch${NC}"
fi

if [ $WARNING_TESTS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNING_TESTS optimization opportunities identified${NC}"
    echo -e "${YELLOW}💡 Consider addressing these for optimal user experience${NC}"
fi

echo ""
echo "🚀 Production Best Practices:"
echo "  • Monitor all tested flows continuously"
echo "  • Set up automated testing in CI/CD pipeline"
echo "  • Implement real user monitoring (RUM)"
echo "  • Regular performance audits"
echo "  • User feedback collection and analysis"
echo "  • A/B testing for critical flows"

echo ""
echo "📋 Next Steps:"
echo "  1. Fix any failed tests immediately"
echo "  2. Address warning-level issues"
echo "  3. Set up production monitoring"
echo "  4. Create automated test suite"
echo "  5. Schedule regular production audits"
echo "  6. Implement user analytics tracking"

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    exit 0
else
    exit 1
fi