#!/bin/bash

# ALCHM iOS Crashlytics Symbol Upload Script
# Uploads dSYM files to Firebase Crashlytics for crash symbolication

set -e

echo "🔧 ALCHM iOS Crashlytics Symbol Upload"
echo "======================================="

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IOS_PROJECT_PATH="${PROJECT_ROOT}/ios/App"
CRASHLYTICS_UPLOAD_SYMBOLS="${PROJECT_ROOT}/ios/Pods/FirebaseCrashlytics/upload-symbols"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verify Firebase configuration exists
if [ ! -f "${IOS_PROJECT_PATH}/GoogleService-Info.plist" ]; then
    echo -e "${RED}❌ Error: GoogleService-Info.plist not found in iOS project${NC}"
    echo "Please add your Firebase configuration file to: ${IOS_PROJECT_PATH}/"
    exit 1
fi

# Verify Crashlytics upload-symbols script exists
if [ ! -f "${CRASHLYTICS_UPLOAD_SYMBOLS}" ]; then
    echo -e "${RED}❌ Error: Crashlytics upload-symbols script not found${NC}"
    echo "Please ensure Firebase Crashlytics is properly installed via CocoaPods"
    exit 1
fi

# Find dSYM files
DSYM_FOLDER="${IOS_PROJECT_PATH}/build/Release-iphoneos/App.app.dSYM"
ARCHIVE_DSYMS_PATH="${IOS_PROJECT_PATH}/build/Release-iphoneos"

echo -e "${YELLOW}📍 Searching for dSYM files...${NC}"

# Method 1: Use Xcode's DWARF_DSYM_FOLDER_PATH if available
if [ ! -z "${DWARF_DSYM_FOLDER_PATH}" ] && [ ! -z "${DWARF_DSYM_FILE_NAME}" ]; then
    DSYM_PATH="${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}"
    echo -e "${GREEN}✅ Found dSYM via Xcode environment: ${DSYM_PATH}${NC}"
    
    # Upload symbols
    "${CRASHLYTICS_UPLOAD_SYMBOLS}" -gsp "${IOS_PROJECT_PATH}/GoogleService-Info.plist" -p ios "${DSYM_PATH}"
    
elif [ -d "${DSYM_FOLDER}" ]; then
    echo -e "${GREEN}✅ Found dSYM folder: ${DSYM_FOLDER}${NC}"
    
    # Upload symbols
    "${CRASHLYTICS_UPLOAD_SYMBOLS}" -gsp "${IOS_PROJECT_PATH}/GoogleService-Info.plist" -p ios "${DSYM_FOLDER}"
    
else
    echo -e "${YELLOW}⚠️  dSYM files not found, searching in archives...${NC}"
    
    # Find all .xcarchive files and extract dSYMs
    find ~/Library/Developer/Xcode/Archives -name "*.xcarchive" -type d | while read archive; do
        if [[ "$archive" == *"App"* ]]; then
            ARCHIVE_DSYM="${archive}/dSYMs"
            if [ -d "${ARCHIVE_DSYM}" ]; then
                echo -e "${GREEN}✅ Found archive dSYM: ${ARCHIVE_DSYM}${NC}"
                
                # Upload symbols from archive
                find "${ARCHIVE_DSYM}" -name "*.dSYM" | while read dsym; do
                    echo -e "${YELLOW}📤 Uploading symbols from: ${dsym}${NC}"
                    "${CRASHLYTICS_UPLOAD_SYMBOLS}" -gsp "${IOS_PROJECT_PATH}/GoogleService-Info.plist" -p ios "${dsym}"
                done
            fi
        fi
    done
fi

# Privacy and security validation
echo -e "${YELLOW}🔒 Validating privacy compliance...${NC}"

# Ensure we're not uploading sensitive information
PRIVACY_CHECK_RESULT=$(grep -r "journal" "${IOS_PROJECT_PATH}/build" 2>/dev/null || true)
if [ ! -z "${PRIVACY_CHECK_RESULT}" ]; then
    echo -e "${RED}⚠️  WARNING: Potential sensitive data found in build artifacts${NC}"
    echo "Review build output for journal content before symbol upload"
fi

echo -e "${GREEN}✅ iOS Crashlytics symbol upload completed${NC}"
echo -e "${YELLOW}💡 Tip: Add this script to your Xcode build phases for automatic symbol uploads${NC}"

exit 0