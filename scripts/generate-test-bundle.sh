#!/bin/bash
set -e

echo "🧪 Generating ALCHM Test Lab Bundle"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/Users/zadiewalker/Desktop/alchm"
IOS_DIR="$PROJECT_ROOT/ios"
TEST_BUNDLE_DIR="$IOS_DIR/ALCHMTestBundle"

cd "$IOS_DIR"

echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
rm -rf "$TEST_BUNDLE_DIR"
rm -rf ./TestingBuild

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
pod install --repo-update

echo -e "${YELLOW}🔨 Building for testing...${NC}"
xcodebuild -workspace App/App.xcworkspace \
  -scheme App \
  -destination generic/platform=iOS \
  -derivedDataPath ./TestingBuild \
  clean build-for-testing

echo -e "${YELLOW}📦 Creating test bundle...${NC}"
mkdir -p "$TEST_BUNDLE_DIR"

# Copy .xctestrun file
echo -e "${YELLOW}📄 Copying test run configuration...${NC}"
cp ./TestingBuild/Build/Products/*.xctestrun "$TEST_BUNDLE_DIR/"

# Copy build products
echo -e "${YELLOW}📱 Copying build products...${NC}"
cp -R ./TestingBuild/Build/Products "$TEST_BUNDLE_DIR/Build/"

# List contents for verification
echo -e "${GREEN}✅ Test bundle created successfully!${NC}"
echo -e "${GREEN}📍 Location: $TEST_BUNDLE_DIR${NC}"
echo -e "${GREEN}📋 Contents:${NC}"
ls -la "$TEST_BUNDLE_DIR/"
echo ""
echo -e "${GREEN}🏗️  Build Products:${NC}"
ls -la "$TEST_BUNDLE_DIR/Build/Products/"

echo ""
echo -e "${GREEN}🎯 Ready for Firebase Test Lab upload!${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "   1. Run: firebase test ios run --test $TEST_BUNDLE_DIR/App_iphoneos*.xctestrun"
echo -e "   2. Or use: ./scripts/run-firebase-testlab.sh"