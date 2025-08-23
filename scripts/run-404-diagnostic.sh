#!/bin/bash

# 🔥 Firebase Studio 404 Diagnostic Runner
# Expert-level diagnostic suite for Firebase Studio 404 errors

set -e

echo "🔥 Firebase Studio 404 Diagnostic Suite"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from project root directory"
    exit 1
fi

echo "📍 Project: $(pwd)"
echo "⏰ Started: $(date)"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo "🔍 Checking system dependencies..."
if ! command_exists node; then
    echo "❌ Node.js not found. Please install Node.js"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo "✅ Node.js $(node --version)"
echo "✅ npm $(npm --version)"
echo ""

# Option 1: Quick Fix (Emergency Mode)
echo "🚨 OPTION 1: Quick Emergency Fix"
echo "   Fast 404 error detection and immediate fixes"
echo ""
echo "🔬 OPTION 2: Comprehensive Diagnostic"
echo "   Complete analysis with detailed reporting"
echo ""

read -p "Choose option (1 for Quick Fix, 2 for Comprehensive): " choice

case $choice in
    1)
        echo ""
        echo "🚨 Running Quick 404 Fix..."
        echo "=========================="
        node scripts/quick-404-fix.js
        ;;
    2)
        echo ""
        echo "🔬 Running Comprehensive Diagnostic..."
        echo "===================================="
        node scripts/firebase-studio-404-debugger.js
        ;;
    *)
        echo "❌ Invalid choice. Running Quick Fix by default..."
        node scripts/quick-404-fix.js
        ;;
esac

echo ""
echo "🎯 NEXT STEPS:"
echo "=============="
echo "1. Review any fixes that were applied"
echo "2. Run 'npm run build' to test your configuration"
echo "3. Test locally with 'firebase emulators:start'"
echo "4. Deploy to Firebase Studio when ready"
echo ""
echo "⏰ Completed: $(date)"