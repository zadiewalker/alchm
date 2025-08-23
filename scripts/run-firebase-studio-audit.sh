#!/bin/bash

# Firebase Studio Publication Audit Script
# Comprehensive validation for Firebase Studio deployment

set -e

echo "🔥 Firebase Studio Publication Audit Starting..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_status "ERROR" "package.json not found. Please run from project root."
    exit 1
fi

# Validate environment
print_status "INFO" "Checking environment..."

# Check Node.js version
NODE_VERSION=$(node --version | sed 's/v//')
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1)

if [[ $MAJOR_VERSION -lt 18 || $MAJOR_VERSION -gt 20 ]]; then
    print_status "ERROR" "Node.js version $NODE_VERSION not supported. Use version 18-20."
    exit 1
else
    print_status "SUCCESS" "Node.js version $NODE_VERSION is compatible"
fi

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    print_status "ERROR" "Firebase CLI not installed. Install with: npm install -g firebase-tools"
    exit 1
else
    FIREBASE_VERSION=$(firebase --version)
    print_status "SUCCESS" "Firebase CLI installed: $FIREBASE_VERSION"
fi

# Pre-audit cleanup
print_status "INFO" "Performing pre-audit cleanup..."

# Remove any conflicting config files
if [[ -f "next.config.mjs" ]]; then
    print_status "WARNING" "Removing conflicting next.config.mjs"
    rm next.config.mjs
fi

if [[ -f "next.config.performance.mjs" ]]; then
    print_status "WARNING" "Removing conflicting next.config.performance.mjs"
    rm next.config.performance.mjs
fi

# Verify critical files exist
CRITICAL_FILES=("package.json" "next.config.js" "apphosting.yaml")
for file in "${CRITICAL_FILES[@]}"; do
    if [[ ! -f "$file" ]]; then
        print_status "ERROR" "Critical file missing: $file"
        exit 1
    else
        print_status "SUCCESS" "Found: $file"
    fi
done

# Check for ES module issues
print_status "INFO" "Checking for ES module syntax issues..."

if grep -q "export default" next.config.js; then
    print_status "ERROR" "next.config.js contains 'export default' - must use module.exports"
    exit 1
fi

if grep -q '"type": "module"' package.json; then
    print_status "ERROR" "package.json contains 'type: module' - remove for Firebase Studio compatibility"
    exit 1
fi

print_status "SUCCESS" "No ES module syntax conflicts found"

# Install dependencies
print_status "INFO" "Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install --production=false
else
    npm install
fi

# Run the comprehensive diagnostic
print_status "INFO" "Running comprehensive Firebase Studio diagnostic..."
node scripts/firebase-studio-diagnostic.js

DIAGNOSTIC_EXIT_CODE=$?

if [[ $DIAGNOSTIC_EXIT_CODE -eq 0 ]]; then
    print_status "SUCCESS" "Firebase Studio diagnostic passed!"
    echo ""
    echo "🎉 ALCHM IS READY FOR FIREBASE STUDIO PUBLICATION!"
    echo "=================================================="
    echo "Next steps:"
    echo "1. Go to Firebase Console > App Hosting"
    echo "2. Create new App Hosting backend"
    echo "3. Connect your GitHub repository"
    echo "4. Deploy to Firebase Studio"
    echo ""
else
    print_status "ERROR" "Firebase Studio diagnostic failed!"
    echo ""
    echo "🔧 PLEASE FIX THE ISSUES ABOVE BEFORE PUBLICATION"
    echo "=================================================="
    echo "Review the detailed report: firebase-studio-report.md"
    echo "Check the audit log: firebase-studio-audit.log"
    echo ""
fi

exit $DIAGNOSTIC_EXIT_CODE