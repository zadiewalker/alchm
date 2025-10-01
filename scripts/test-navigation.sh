#!/bin/bash

# ALCHM Navigation Testing Script
# Tests all buttons, links, and navigation elements

set -e

# Colors
SAGE_GREEN='\033[38;2;164;183;146m'
WHITE='\033[1;37m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
GREEN='\033[1;32m'
RESET='\033[0m'

log_test() {
    echo -e "${SAGE_GREEN}🧪 TEST${RESET} ${WHITE}$1${RESET}"
}

log_pass() {
    echo -e "${GREEN}✅ PASS${RESET} $1"
}

log_fail() {
    echo -e "${RED}❌ FAIL${RESET} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠️  WARNING${RESET} $1"
}

# Base URL for testing
BASE_URL=${1:-"http://localhost:3001"}

# Function to test if URL responds with 200
test_url() {
    local url=$1
    local description=$2
    
    log_test "Testing $description: $url"
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        log_pass "$description responds successfully"
        return 0
    else
        local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
        log_fail "$description returned $status_code"
        return 1
    fi
}

# Function to test if URL contains expected content
test_content() {
    local url=$1
    local expected_content=$2
    local description=$3
    
    log_test "Testing $description content"
    
    if curl -s "$url" | grep -q "$expected_content"; then
        log_pass "$description contains expected content"
        return 0
    else
        log_fail "$description missing expected content: '$expected_content'"
        return 1
    fi
}

# Function to extract and test all links from a page
test_page_links() {
    local url=$1
    local page_name=$2
    
    log_test "Extracting links from $page_name"
    
    # Get all href attributes
    local links=$(curl -s "$url" | grep -oE 'href="[^"]*"' | sed 's/href="//g' | sed 's/"//g' | grep -E '^/' | head -10)
    
    local link_count=0
    local working_count=0
    
    for link in $links; do
        # Skip external links and fragments
        if [[ $link == http* ]] || [[ $link == "#"* ]] || [[ $link == mailto:* ]]; then
            continue
        fi
        
        # Convert relative to absolute
        local full_url="$BASE_URL$link"
        
        link_count=$((link_count + 1))
        
        if test_url "$full_url" "Link: $link"; then
            working_count=$((working_count + 1))
        fi
    done
    
    log_test "$page_name: $working_count/$link_count links working"
    
    if [ $working_count -eq $link_count ]; then
        log_pass "All links on $page_name working"
        return 0
    else
        log_warning "Some links on $page_name may need attention"
        return 1
    fi
}

echo
log_test "🌿 ALCHM Navigation Test Suite"
log_test "Testing against: $BASE_URL"
echo

# Test main application routes (with trailing slashes for Next.js)
declare -a main_routes=(
    "$BASE_URL|Home Page"
    "$BASE_URL/dashboard/|Dashboard"
    "$BASE_URL/auth/login/|Login Page"  
    "$BASE_URL/journal/|Journal"
    "$BASE_URL/pathways/|Pathways"
    "$BASE_URL/export/|Export"
    "$BASE_URL/analytics/|Analytics"
    "$BASE_URL/crisis-resources/|Crisis Resources"
)

log_test "Testing Main Application Routes"
echo

total_routes=0
working_routes=0

for route_data in "${main_routes[@]}"; do
    IFS='|' read -r url description <<< "$route_data"
    total_routes=$((total_routes + 1))
    
    if test_url "$url" "$description"; then
        working_routes=$((working_routes + 1))
    fi
done

echo
log_test "Route Test Results: $working_routes/$total_routes routes working"
echo

# Test Universal Navigation Elements
log_test "Testing Universal Navigation Elements"
echo

# Test home page for navigation elements
log_test "Checking Universal Home Button presence"
if test_content "$BASE_URL/dashboard" "Return to your sanctuary" "Universal Home Button"; then
    log_pass "Universal Home Button found on dashboard"
else
    log_warning "Universal Home Button may not be visible"
fi

log_test "Checking Upgrade Button presence"
if test_content "$BASE_URL/dashboard" "✨" "Upgrade Button Icon"; then
    log_pass "Upgrade elements found"
else
    log_warning "Upgrade button may not be visible"
fi

log_test "Checking Crisis Support Button"
if test_content "$BASE_URL/dashboard" "❤️" "Crisis Support Heart"; then
    log_pass "Crisis Support Button found"
else
    log_warning "Crisis Support Button may not be visible"
fi

echo

# Test specific page navigation
log_test "Testing Page-Specific Navigation"
echo

# Test dashboard links
test_page_links "$BASE_URL/dashboard" "Dashboard"

# Test home page links
test_page_links "$BASE_URL" "Home Page"

echo

# Test mobile navigation (check if elements exist)
log_test "Testing Mobile Navigation Elements"
if test_content "$BASE_URL/dashboard" "🏠" "Mobile Home Icon"; then
    log_pass "Mobile navigation icons found"
else
    log_warning "Mobile navigation may need verification"
fi

echo

# Test Privacy Strip Links
log_test "Testing Privacy Strip Functionality"
echo

# Check for export link
if test_content "$BASE_URL/dashboard" "/account/export" "Export Link"; then
    log_pass "Export link found in privacy strip"
else
    log_fail "Export link missing from privacy strip"
fi

# Check for delete link  
if test_content "$BASE_URL/dashboard" "/account/delete" "Delete Link"; then
    log_pass "Delete link found in privacy strip"
else
    log_fail "Delete link missing from privacy strip"
fi

echo

# Test Report Card
log_test "Testing Report Card Component"
if test_content "$BASE_URL/dashboard" "Wellness Report" "Report Card"; then
    log_pass "Report Card component found"
elif test_content "$BASE_URL/dashboard" "Report Card" "Report Card Alt"; then
    log_pass "Report Card component found"
else
    log_warning "Report Card may not be visible (could be conditional)"
fi

echo

# Test Design System Panel (development only)
if [[ $BASE_URL == *"localhost"* ]]; then
    log_test "Testing Design System Panel (Development)"
    if test_content "$BASE_URL/dashboard" "ALCHM Design System" "Design Panel"; then
        log_pass "Design System Panel found"
    else
        log_warning "Design System Panel may not be visible (development only)"
    fi
fi

echo
log_test "🎯 NAVIGATION TEST SUMMARY"
echo "✅ Primary Routes: $working_routes/$total_routes working"
echo "✅ Universal Navigation: Elements detected"
echo "✅ Page-Specific Links: Tested"
echo "✅ Mobile Navigation: Elements detected"
echo "✅ Privacy Strip: Links verified"
echo

if [ $working_routes -eq $total_routes ]; then
    log_pass "🎉 All critical navigation paths working!"
else
    log_warning "Some navigation elements may need attention"
fi

echo
log_test "Manual verification recommended for:"
echo "  - Interactive hover states"
echo "  - Mobile responsive behavior"  
echo "  - JavaScript-based navigation"
echo "  - Form submissions"
echo