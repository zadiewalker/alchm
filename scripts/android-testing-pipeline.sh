#!/bin/bash

# ALCHM Android Testing Automation Script
# Comprehensive testing pipeline for mental health app

set -e

echo "🤖 Starting ALCHM Android Testing Pipeline"
echo "═══════════════════════════════════════════"

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean

# Step 2: Build web app
echo "🌐 Building web application..."
cd ..
npm run build

# Step 3: Sync with Capacitor
echo "📱 Syncing with Capacitor Android..."
npx cap sync android

# Step 4: Run unit tests
echo "🧪 Running unit tests..."
cd android
./gradlew testDebugUnitTest
echo "✅ Unit tests completed"

# Step 5: Run instrumented tests
echo "🔬 Running instrumented tests..."
./gradlew connectedDebugAndroidTest
echo "✅ Instrumented tests completed"

# Step 6: Run accessibility tests
echo "♿ Running accessibility tests..."
./gradlew connectedDebugAndroidTest -Pandroid.testInstrumentationRunnerArguments.class=com.alchm.identityos.ALCHMInstrumentedTestFramework#testAccessibilityCompliance
echo "✅ Accessibility tests completed"

# Step 7: Build testing APK
echo "📦 Building testing APK..."
./gradlew assembleTestingDebug
echo "✅ Testing APK built"

# Step 8: Generate test reports
echo "📊 Generating test reports..."
./gradlew jacocoTestReport
echo "✅ Test reports generated"

# Step 9: Security scan
echo "🔒 Running security checks..."
./gradlew dependencyCheckAnalyze
echo "✅ Security checks completed"

echo ""
echo "🎉 ALCHM Android Testing Pipeline Complete!"
echo "📍 APK Location: android/app/build/outputs/apk/testing/debug/"
echo "📊 Test Reports: android/app/build/reports/"
echo ""
echo "🚀 Ready for Google Play Internal Testing Upload!"