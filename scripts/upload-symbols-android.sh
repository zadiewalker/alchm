#!/bin/bash

# ALCHM Android Crashlytics Symbol Upload Script
# Handles ProGuard mapping files and native symbol uploads for crash symbolication

set -e

echo "🤖 ALCHM Android Crashlytics Symbol Upload"
echo "=========================================="

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_PROJECT_PATH="${PROJECT_ROOT}/android"
APP_MODULE_PATH="${ANDROID_PROJECT_PATH}/app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verify Firebase configuration exists
if [ ! -f "${APP_MODULE_PATH}/google-services.json" ]; then
    echo -e "${RED}❌ Error: google-services.json not found in Android project${NC}"
    echo "Please add your Firebase configuration file to: ${APP_MODULE_PATH}/"
    exit 1
fi

# Check if ProGuard is enabled
PROGUARD_ENABLED=$(grep "minifyEnabled true" "${APP_MODULE_PATH}/build.gradle" || echo "false")

if [[ "${PROGUARD_ENABLED}" == *"minifyEnabled true"* ]]; then
    echo -e "${GREEN}✅ ProGuard is enabled, will upload mapping files${NC}"
    
    # Find ProGuard mapping files
    MAPPING_FILE_PATH="${APP_MODULE_PATH}/build/outputs/mapping/release/mapping.txt"
    
    if [ -f "${MAPPING_FILE_PATH}" ]; then
        echo -e "${GREEN}✅ Found ProGuard mapping file: ${MAPPING_FILE_PATH}${NC}"
        
        # Upload mapping file using Firebase CLI
        if command -v firebase &> /dev/null; then
            echo -e "${YELLOW}📤 Uploading mapping file to Firebase Crashlytics...${NC}"
            firebase crashlytics:mappingfile:upload "${MAPPING_FILE_PATH}" --app-id=$(grep "applicationId" "${APP_MODULE_PATH}/build.gradle" | sed 's/.*applicationId "//' | sed 's/".*//')
        else
            echo -e "${YELLOW}⚠️  Firebase CLI not found. Install with: npm install -g firebase-tools${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  ProGuard mapping file not found at: ${MAPPING_FILE_PATH}${NC}"
        echo "Make sure you've built a release version of your app"
    fi
else
    echo -e "${YELLOW}⚠️  ProGuard is not enabled. Crash reports will include obfuscated stack traces.${NC}"
    echo "Consider enabling ProGuard for release builds to reduce APK size"
fi

# Check for native libraries (NDK)
NATIVE_LIBS_PATH="${APP_MODULE_PATH}/src/main/jniLibs"
if [ -d "${NATIVE_LIBS_PATH}" ]; then
    echo -e "${GREEN}✅ Found native libraries directory${NC}"
    
    # Find .so files
    SO_FILES=$(find "${NATIVE_LIBS_PATH}" -name "*.so" 2>/dev/null || true)
    if [ ! -z "${SO_FILES}" ]; then
        echo -e "${YELLOW}📚 Found native libraries:${NC}"
        echo "${SO_FILES}"
        echo -e "${YELLOW}💡 Consider uploading native debug symbols for better crash reports${NC}"
    fi
fi

# Privacy and security validation
echo -e "${YELLOW}🔒 Validating privacy compliance...${NC}"

# Check build output for sensitive information
BUILD_OUTPUT_PATH="${APP_MODULE_PATH}/build"
if [ -d "${BUILD_OUTPUT_PATH}" ]; then
    # Look for potential journal content in build artifacts
    PRIVACY_CHECK_RESULT=$(grep -r -i "journal\|diary\|personal" "${BUILD_OUTPUT_PATH}" 2>/dev/null | head -10 || true)
    if [ ! -z "${PRIVACY_CHECK_RESULT}" ]; then
        echo -e "${RED}⚠️  WARNING: Potential sensitive data found in build artifacts${NC}"
        echo "First 10 matches:"
        echo "${PRIVACY_CHECK_RESULT}"
        echo -e "${YELLOW}Please review and ensure no user journal content is included${NC}"
    fi
fi

# Validate Crashlytics setup in MainActivity
MAIN_ACTIVITY_PATH="${APP_MODULE_PATH}/src/main/java/com/alchm/identityos/MainActivity.java"
if [ -f "${MAIN_ACTIVITY_PATH}" ]; then
    CRASHLYTICS_INIT=$(grep -i "crashlytics" "${MAIN_ACTIVITY_PATH}" || echo "not_found")
    if [[ "${CRASHLYTICS_INIT}" == "not_found" ]]; then
        echo -e "${YELLOW}⚠️  Crashlytics initialization not found in MainActivity${NC}"
        echo "Consider adding Crashlytics initialization code for better crash reporting"
    else
        echo -e "${GREEN}✅ Crashlytics initialization found in MainActivity${NC}"
    fi
fi

# Check gradle configuration
if [ -f "${APP_MODULE_PATH}/build.gradle" ]; then
    FIREBASE_CRASHLYTICS_PLUGIN=$(grep "firebase-crashlytics" "${APP_MODULE_PATH}/build.gradle" || echo "not_found")
    if [[ "${FIREBASE_CRASHLYTICS_PLUGIN}" == "not_found" ]]; then
        echo -e "${YELLOW}⚠️  Firebase Crashlytics plugin not found in app/build.gradle${NC}"
        echo "Add: apply plugin: 'com.google.firebase.crashlytics'"
    else
        echo -e "${GREEN}✅ Firebase Crashlytics plugin configured${NC}"
    fi
fi

echo -e "${GREEN}✅ Android Crashlytics symbol upload process completed${NC}"
echo -e "${YELLOW}💡 Tip: Run this script after each release build for optimal crash reporting${NC}"

exit 0