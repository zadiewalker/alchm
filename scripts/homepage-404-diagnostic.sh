#!/bin/bash

# FIREBASE HOMEPAGE 404 DIAGNOSTIC AUDIT - Shell Wrapper
# Comprehensive debugging for Firebase-hosted Next.js 15 applications
# Focus: Surgical diagnosis of homepage (/) route visibility

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🔍 FIREBASE HOMEPAGE 404 DIAGNOSTIC AUDIT${NC}"
echo -e "${PURPLE}=================================================${NC}"
echo ""

# Check if Node.js diagnostic script exists
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
DIAGNOSTIC_SCRIPT="$SCRIPT_DIR/firebase-homepage-diagnostic.js"

if [ ! -f "$DIAGNOSTIC_SCRIPT" ]; then
    echo -e "${RED}❌ Diagnostic script not found: $DIAGNOSTIC_SCRIPT${NC}"
    exit 1
fi

# Make diagnostic script executable
chmod +x "$DIAGNOSTIC_SCRIPT"

# Get project path (default to current directory)
PROJECT_PATH="${1:-$(pwd)}"

echo -e "${CYAN}📁 Project Path: $PROJECT_PATH${NC}"
echo ""

# Verify we're in a valid project directory
if [ ! -f "$PROJECT_PATH/package.json" ]; then
    echo -e "${RED}❌ No package.json found in $PROJECT_PATH${NC}"
    echo -e "${YELLOW}💡 Please run this script from your project root or specify the correct path${NC}"
    exit 1
fi

# Pre-flight checks
echo -e "${BLUE}🔧 Pre-flight Environment Checks${NC}"
echo -e "${BLUE}=================================${NC}"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

# Check npm/yarn/pnpm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
fi

if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    echo -e "${GREEN}✅ yarn: $YARN_VERSION${NC}"
fi

if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}✅ pnpm: $PNPM_VERSION${NC}"
fi

# Check Firebase CLI
if command -v firebase &> /dev/null; then
    FIREBASE_VERSION=$(firebase --version)
    echo -e "${GREEN}✅ Firebase CLI: $FIREBASE_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  Firebase CLI not found${NC}"
    echo -e "${CYAN}💡 Install with: npm install -g firebase-tools${NC}"
fi

echo ""

# Run the comprehensive Node.js diagnostic
echo -e "${PURPLE}🚀 Running Comprehensive Diagnostic...${NC}"
echo -e "${PURPLE}=====================================${NC}"
echo ""

node "$DIAGNOSTIC_SCRIPT" "$PROJECT_PATH"

# Check exit code and provide additional guidance
EXIT_CODE=$?

echo ""
echo -e "${PURPLE}📋 POST-DIAGNOSTIC ACTIONS${NC}"
echo -e "${PURPLE}==========================${NC}"

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Diagnostic completed successfully${NC}"
    
    # Quick deployment verification commands
    echo ""
    echo -e "${CYAN}🔄 Quick Fix Commands (if needed):${NC}"
    echo ""
    echo -e "${YELLOW}# 1. Ensure build is current${NC}"
    echo -e "npm run build"
    echo ""
    echo -e "${YELLOW}# 2. Test local Firebase emulator${NC}"
    echo -e "firebase emulators:start --only hosting"
    echo -e "# Then visit: http://localhost:5000"
    echo ""
    echo -e "${YELLOW}# 3. Deploy to Firebase${NC}"
    echo -e "firebase deploy --only hosting"
    echo ""
    echo -e "${YELLOW}# 4. Verify deployment${NC}"
    echo -e "curl -I https://\$(firebase projects:list --json | jq -r '.[] | select(.id != \"\" and .id != null) | .id' | head -1).web.app/"
    
else
    echo -e "${RED}❌ Diagnostic encountered errors${NC}"
    echo -e "${YELLOW}💡 Review the error messages above and apply suggested fixes${NC}"
fi

echo ""
echo -e "${PURPLE}🎯 FIREBASE HOMEPAGE DIAGNOSTIC COMPLETE${NC}"

# Optional: Open Firebase console
read -p "🌐 Open Firebase console for this project? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v firebase &> /dev/null; then
        firebase open hosting
    else
        echo -e "${YELLOW}Firebase CLI not available. Visit: https://console.firebase.google.com${NC}"
    fi
fi

exit $EXIT_CODE