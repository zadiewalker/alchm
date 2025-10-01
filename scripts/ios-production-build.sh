#!/bin/bash
set -e

echo "🚀 ALCHM iOS Production Build Pipeline"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/Users/zadiewalker/Desktop/alchm"
IOS_DIR="$PROJECT_ROOT/ios"
SCHEME="App"
CONFIGURATION="Release"
ARCHIVE_PATH="$IOS_DIR/build/ALCHM.xcarchive"
EXPORT_PATH="$IOS_DIR/build/export"

echo -e "${YELLOW}📱 Building ALCHM for iOS App Store submission...${NC}"

# Step 1: Build web app
echo -e "${YELLOW}🌐 Building Next.js web app...${NC}"
cd "$PROJECT_ROOT"
npm run build

# Step 2: Sync Capacitor
echo -e "${YELLOW}⚡ Syncing Capacitor...${NC}"
npx cap sync ios

# Step 3: Install iOS dependencies
echo -e "${YELLOW}📦 Installing iOS dependencies...${NC}"
cd "$IOS_DIR"
pod install --repo-update

# Step 4: Clean and archive
echo -e "${YELLOW}🏗️ Creating iOS archive...${NC}"
xcodebuild clean archive \
  -workspace App/App.xcworkspace \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -archivePath "$ARCHIVE_PATH" \
  -allowProvisioningUpdates \
  CODE_SIGNING_ALLOWED=YES

# Step 5: Export for App Store
echo -e "${YELLOW}📤 Exporting IPA for App Store...${NC}"
xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_PATH" \
  -exportOptionsPlist App/ExportOptions.plist \
  -allowProvisioningUpdates

# Step 6: Validate IPA
echo -e "${YELLOW}✅ Validating IPA...${NC}"
if [ -n "$APPLE_ID_EMAIL" ] && [ -n "$APP_SPECIFIC_PASSWORD" ]; then
    xcrun altool --validate-app \
      -f "$EXPORT_PATH/ALCHM.ipa" \
      -t ios \
      -u "$APPLE_ID_EMAIL" \
      -p "$APP_SPECIFIC_PASSWORD"
else
    echo -e "${YELLOW}⚠️  Skipping validation - APPLE_ID_EMAIL and APP_SPECIFIC_PASSWORD not set${NC}"
fi

echo -e "${GREEN}🎉 ALCHM iOS build complete!${NC}"
echo -e "${GREEN}📍 Archive: $ARCHIVE_PATH${NC}"
echo -e "${GREEN}📍 IPA: $EXPORT_PATH/ALCHM.ipa${NC}"

# Optional: Upload to App Store Connect
if [ -n "$APPLE_ID_EMAIL" ] && [ -n "$APP_SPECIFIC_PASSWORD" ]; then
    read -p "Upload to App Store Connect? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}📤 Uploading to App Store Connect...${NC}"
        xcrun altool --upload-app \
          -f "$EXPORT_PATH/ALCHM.ipa" \
          -t ios \
          -u "$APPLE_ID_EMAIL" \
          -p "$APP_SPECIFIC_PASSWORD"
        echo -e "${GREEN}✅ Upload complete!${NC}"
    fi
else
    echo -e "${YELLOW}ℹ️  To enable automatic upload, set environment variables:${NC}"
    echo -e "${YELLOW}   export APPLE_ID_EMAIL=\"your-apple-id@email.com\"${NC}"
    echo -e "${YELLOW}   export APP_SPECIFIC_PASSWORD=\"your-app-specific-password\"${NC}"
fi