#!/bin/bash

# Firebase Studio Buildpack Detection Validator
# CRITICAL: Validates that all required files are present for buildpack detection

set -e

echo "=== FIREBASE STUDIO BUILDPACK DETECTION VALIDATOR ==="
echo "Date: $(date)"
echo "Working directory: $(pwd)"
echo ""

# Check required files for buildpack detection
echo "=== REQUIRED FILES CHECK ==="
files_missing=0

# package.json - Critical for Node.js buildpack detection
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    if [ -s "package.json" ]; then
        echo "✅ package.json is not empty"
        # Validate JSON structure
        if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
            echo "✅ package.json is valid JSON"
            # Check for required fields
            if grep -q '"name"' package.json && grep -q '"scripts"' package.json; then
                echo "✅ package.json contains required fields"
            else
                echo "❌ package.json missing required fields (name or scripts)"
                files_missing=$((files_missing + 1))
            fi
        else
            echo "❌ package.json contains invalid JSON"
            files_missing=$((files_missing + 1))
        fi
    else
        echo "❌ package.json is empty"
        files_missing=$((files_missing + 1))
    fi
else
    echo "❌ package.json NOT FOUND"
    files_missing=$((files_missing + 1))
fi

# next.config.js - Critical for Next.js buildpack detection
if [ -f "next.config.js" ]; then
    echo "✅ next.config.js found"
else
    echo "⚠️  next.config.js not found (recommended for Next.js detection)"
fi

# .nvmrc - For Node.js version detection
if [ -f ".nvmrc" ]; then
    echo "✅ .nvmrc found (Node version: $(cat .nvmrc))"
else
    echo "⚠️  .nvmrc not found (recommended for Node.js version)"
fi

echo ""

# Check for JavaScript/TypeScript source files
echo "=== SOURCE FILES CHECK ==="
js_files=$(find . -maxdepth 2 -name "*.js" -type f | wc -l)
ts_files=$(find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l || echo 0)

echo "JavaScript files in root/immediate dirs: $js_files"
echo "TypeScript files in src: $ts_files"

if [ $js_files -gt 0 ] || [ $ts_files -gt 0 ]; then
    echo "✅ Source files detected"
else
    echo "❌ No JavaScript or TypeScript source files found"
    files_missing=$((files_missing + 1))
fi

echo ""

# Check for conflicting package managers
echo "=== PACKAGE MANAGER CONFLICTS CHECK ==="
conflicts=0

if [ -f "pnpm-lock.yaml" ]; then
    echo "❌ pnpm-lock.yaml found (conflicts with npm)"
    conflicts=$((conflicts + 1))
fi

if [ -f "yarn.lock" ]; then
    echo "❌ yarn.lock found (conflicts with npm)"
    conflicts=$((conflicts + 1))
fi

if [ -f "pnpm-workspace.yaml" ]; then
    echo "❌ pnpm-workspace.yaml found (conflicts with npm)"
    conflicts=$((conflicts + 1))
fi

if [ $conflicts -eq 0 ]; then
    echo "✅ No conflicting package manager files"
else
    echo "⚠️  Found $conflicts conflicting package manager files"
fi

echo ""

# Check directory structure
echo "=== DIRECTORY STRUCTURE CHECK ==="
if [ -d "src" ]; then
    echo "✅ src directory exists"
    if [ -d "src/app" ]; then
        echo "✅ src/app directory exists (Next.js App Router)"
    else
        echo "⚠️  src/app directory not found"
    fi
else
    echo "❌ src directory not found"
    files_missing=$((files_missing + 1))
fi

if [ -d "node_modules" ]; then
    echo "ℹ️  node_modules directory exists"
else
    echo "ℹ️  node_modules directory not found (normal for clean builds)"
fi

echo ""

# Final validation
echo "=== BUILDPACK DETECTION READINESS ==="
if [ $files_missing -eq 0 ]; then
    echo "✅ ALL CRITICAL FILES PRESENT"
    echo "✅ Firebase Studio buildpack detection should work"
    exit 0
else
    echo "❌ MISSING $files_missing CRITICAL FILES"
    echo "❌ Firebase Studio buildpack detection will likely FAIL"
    exit 1
fi