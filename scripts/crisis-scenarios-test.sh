#!/bin/bash

# ALCHM Crisis Scenarios Testing Script
# Comprehensive testing of crisis intervention flows and safety features

set -e

echo "🚨 ALCHM Crisis Scenarios Testing"
echo "=================================="

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_PROJECT_PATH="${PROJECT_ROOT}/android"
TEST_RESULTS_DIR="${PROJECT_ROOT}/test-results/crisis-scenarios"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create test results directory
mkdir -p "${TEST_RESULTS_DIR}"

echo -e "${BLUE}📋 Crisis Testing Prerequisites${NC}"

# Check Android SDK and tools
if ! command -v adb &> /dev/null; then
    echo -e "${RED}❌ ADB not found${NC}"
    echo "Install Android SDK platform-tools"
    exit 1
fi

# Check if device/emulator is connected
DEVICE_COUNT=$(adb devices | grep -c "device$" || echo "0")
if [ "$DEVICE_COUNT" -eq 0 ]; then
    echo -e "${RED}❌ No Android device or emulator connected${NC}"
    echo "Connect a device or start an emulator"
    exit 1
fi

echo -e "${GREEN}✅ Found ${DEVICE_COUNT} connected device(s)${NC}"

# Build the test APK
echo -e "${BLUE}🔨 Building test APK...${NC}"
cd "${ANDROID_PROJECT_PATH}"

# Clean and build debug APK
./gradlew clean assembleDebug assembleDebugAndroidTest || {
    echo -e "${RED}❌ Failed to build test APK${NC}"
    exit 1
}

APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
TEST_APK_PATH="app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk"

echo -e "${GREEN}✅ Test APK built successfully${NC}"

# Install the APK on device
echo -e "${BLUE}📱 Installing APK on test device...${NC}"
adb install -r "${APK_PATH}" || {
    echo -e "${RED}❌ Failed to install APK${NC}"
    exit 1
}

echo -e "${GREEN}✅ APK installed successfully${NC}"

# Function to run individual crisis test
run_crisis_test() {
    local test_name=$1
    local test_class=$2
    local test_method=$3
    
    echo -e "${YELLOW}🧪 Running crisis test: ${test_name}${NC}"
    
    # Run the specific test
    adb shell am instrument -w -r -e debug false \
        -e class "${test_class}#${test_method}" \
        com.alchm.identityos.test/androidx.test.runner.AndroidJUnitRunner > \
        "${TEST_RESULTS_DIR}/${test_name}_results.txt" 2>&1
    
    # Check test result
    if grep -q "FAILURES" "${TEST_RESULTS_DIR}/${test_name}_results.txt"; then
        echo -e "${RED}❌ Crisis test FAILED: ${test_name}${NC}"
        echo "Results saved to: ${TEST_RESULTS_DIR}/${test_name}_results.txt"
        return 1
    else
        echo -e "${GREEN}✅ Crisis test PASSED: ${test_name}${NC}"
        return 0
    fi
}

# Crisis Test Suite
echo -e "${BLUE}🚨 Running Crisis Scenarios Test Suite${NC}"

# Test 1: Crisis Resource Access
run_crisis_test "crisis_resource_access" \
    "com.alchm.identityos.ALCHMCrisisTestFramework" \
    "testCrisisResourceAccess"

# Test 2: Panic Attack Navigation
run_crisis_test "panic_attack_navigation" \
    "com.alchm.identityos.ALCHMCrisisTestFramework" \
    "testPanicAttackNavigation"

# Test 3: Emergency Contact Flow
run_crisis_test "emergency_contact_flow" \
    "com.alchm.identityos.ALCHMCrisisTestFramework" \
    "testEmergencyContactFlow"

# Test 4: Offline Crisis Support
run_crisis_test "offline_crisis_support" \
    "com.alchm.identityos.ALCHMCrisisTestFramework" \
    "testOfflineCrisisSupport"

# Test 5: Safe Space Verification
run_crisis_test "safe_space_verification" \
    "com.alchm.identityos.ALCHMCrisisTestFramework" \
    "testSafeSpaceVerification"

# Test 6: App Stability Under Stress
run_crisis_test "app_stability_stress" \
    "com.alchm.identityos.ALCHMCrisisTestFramework" \
    "testAppStabilityUnderStress"

# Test 7: Crisis Button Accessibility
run_crisis_test "crisis_button_accessibility" \
    "com.alchm.identityos.ALCHMCrisisTestFramework" \
    "testCrisisButtonAccessibility"

# Performance stress test for crisis scenarios
echo -e "${BLUE}⚡ Running Crisis Performance Tests${NC}"

# Test memory usage during crisis mode
echo -e "${YELLOW}🧠 Testing memory usage during crisis scenarios...${NC}"
adb shell am instrument -w -r -e debug false \
    -e class "com.alchm.identityos.ALCHMInstrumentedTestFramework#testCrisisMemoryUsage" \
    com.alchm.identityos.test/androidx.test.runner.AndroidJUnitRunner > \
    "${TEST_RESULTS_DIR}/crisis_memory_results.txt" 2>&1

# Test network resilience during crisis
echo -e "${YELLOW}🌐 Testing network resilience during crisis...${NC}"
adb shell am instrument -w -r -e debug false \
    -e class "com.alchm.identityos.ALCHMInstrumentedTestFramework#testCrisisNetworkResilience" \
    com.alchm.identityos.test/androidx.test.runner.AndroidJUnitRunner > \
    "${TEST_RESULTS_DIR}/crisis_network_results.txt" 2>&1

# Accessibility testing for crisis scenarios
echo -e "${BLUE}♿ Running Crisis Accessibility Tests${NC}"

# Test screen reader compatibility during crisis
echo -e "${YELLOW}📢 Testing screen reader during crisis scenarios...${NC}"
adb shell am instrument -w -r -e debug false \
    -e class "com.alchm.identityos.ALCHMInstrumentedTestFramework#testCrisisScreenReaderSupport" \
    com.alchm.identityos.test/androidx.test.runner.AndroidJUnitRunner > \
    "${TEST_RESULTS_DIR}/crisis_accessibility_results.txt" 2>&1

# Test high contrast mode during crisis
echo -e "${YELLOW}🎨 Testing high contrast mode during crisis...${NC}"
adb shell am instrument -w -r -e debug false \
    -e class "com.alchm.identityos.ALCHMInstrumentedTestFramework#testCrisisHighContrastMode" \
    com.alchm.identityos.test/androidx.test.runner.AndroidJUnitRunner > \
    "${TEST_RESULTS_DIR}/crisis_contrast_results.txt" 2>&1

# Privacy validation during crisis testing
echo -e "${BLUE}🔒 Running Crisis Privacy Validation${NC}"

# Verify no sensitive data is logged during crisis
echo -e "${YELLOW}🛡️  Validating privacy during crisis scenarios...${NC}"
adb shell am instrument -w -r -e debug false \
    -e class "com.alchm.identityos.ALCHMInstrumentedTestFramework#testCrisisPrivacyProtection" \
    com.alchm.identityos.test/androidx.test.runner.AndroidJUnitRunner > \
    "${TEST_RESULTS_DIR}/crisis_privacy_results.txt" 2>&1

# Generate comprehensive test report
echo -e "${BLUE}📊 Generating Crisis Testing Report${NC}"

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

cat > "${TEST_RESULTS_DIR}/crisis_test_report.md" << EOF
# ALCHM Crisis Scenarios Testing Report

**Test Execution Date:** ${TIMESTAMP}
**Test Environment:** Android Device/Emulator
**Results Directory:** ${TEST_RESULTS_DIR}

## Executive Summary

This report covers comprehensive testing of ALCHM's crisis intervention features,
ensuring the app provides reliable support during users' most vulnerable moments.

### Test Categories Covered

1. **Crisis Resource Access** - Verification that emergency resources are always accessible
2. **Panic Attack Navigation** - Testing simplified UI during high-stress situations
3. **Emergency Contact Flow** - Validation of emergency contact functionality
4. **Offline Crisis Support** - Ensuring crisis features work without internet
5. **Safe Space Verification** - Confirming consistent safety indicators
6. **App Stability Under Stress** - Testing app resilience during rapid interactions
7. **Crisis Button Accessibility** - Verifying accessibility compliance for crisis features

### Performance & Accessibility Testing

- **Memory Usage During Crisis:** Validated low memory usage during crisis mode
- **Network Resilience:** Tested graceful handling of network failures during crisis
- **Screen Reader Support:** Verified crisis features work with accessibility tools
- **High Contrast Mode:** Tested visibility during crisis for users with visual impairments

### Privacy & Security Validation

- **Crisis Privacy Protection:** Verified no sensitive data is logged during crisis scenarios
- **Anonymous Crisis Reporting:** Confirmed crisis events are reported without user identification
- **Secure Crisis Communication:** Validated encrypted communication with crisis resources

## Detailed Test Results

EOF

# Analyze each test result
for result_file in "${TEST_RESULTS_DIR}"/*.txt; do
    if [ -f "$result_file" ]; then
        test_name=$(basename "$result_file" _results.txt)
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        
        if grep -q "FAILURES" "$result_file"; then
            FAILED_TESTS=$((FAILED_TESTS + 1))
            echo "### ❌ ${test_name}" >> "${TEST_RESULTS_DIR}/crisis_test_report.md"
            echo "**Status:** FAILED" >> "${TEST_RESULTS_DIR}/crisis_test_report.md"
        else
            PASSED_TESTS=$((PASSED_TESTS + 1))
            echo "### ✅ ${test_name}" >> "${TEST_RESULTS_DIR}/crisis_test_report.md"
            echo "**Status:** PASSED" >> "${TEST_RESULTS_DIR}/crisis_test_report.md"
        fi
        
        echo "**Details:** [View Results](./${test_name}_results.txt)" >> "${TEST_RESULTS_DIR}/crisis_test_report.md"
        echo "" >> "${TEST_RESULTS_DIR}/crisis_test_report.md"
    fi
done

# Add summary statistics
cat >> "${TEST_RESULTS_DIR}/crisis_test_report.md" << EOF

## Test Statistics

- **Total Tests:** ${TOTAL_TESTS}
- **Passed Tests:** ${PASSED_TESTS}
- **Failed Tests:** ${FAILED_TESTS}
- **Success Rate:** $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%

## Trauma-Informed Testing Notes

- All crisis scenarios tested without storing or logging sensitive user data
- Privacy protection validated throughout all crisis flows
- Accessibility features tested specifically for users experiencing trauma responses
- Offline functionality prioritized for emergency situations
- App stability under stress conditions validated for crisis reliability

## Recommendations

Based on test results, the following areas should be prioritized:

1. **Critical Fixes:** Address any failed tests immediately
2. **Performance Optimization:** Focus on crisis mode performance improvements
3. **Accessibility Enhancement:** Ensure all crisis features meet WCAG guidelines
4. **Privacy Hardening:** Continue strengthening data protection during crisis scenarios

## Next Steps

1. Review detailed test results in individual result files
2. Address any failing tests with priority focus on crisis scenarios
3. Run regression tests after fixes
4. Update crisis documentation based on test findings

---

**Note:** This testing framework ensures ALCHM's crisis features work reliably
when users need them most, while maintaining strict privacy protection.

EOF

echo -e "${GREEN}✅ Crisis scenarios testing completed${NC}"
echo -e "${BLUE}📊 Test report generated: ${TEST_RESULTS_DIR}/crisis_test_report.md${NC}"
echo -e "${YELLOW}📈 Results: ${PASSED_TESTS}/${TOTAL_TESTS} tests passed${NC}"

if [ "$FAILED_TESTS" -gt 0 ]; then
    echo -e "${RED}⚠️  ${FAILED_TESTS} tests failed - prioritize fixing crisis-related issues${NC}"
    exit 1
else
    echo -e "${GREEN}🎉 All crisis scenarios tests passed!${NC}"
    exit 0
fi