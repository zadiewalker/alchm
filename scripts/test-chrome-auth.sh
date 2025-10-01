#!/bin/bash

# ALCHM Chrome Authentication Test Script
# Tests authentication system on actual Chrome browsers

echo "🔍 ALCHM Chrome Authentication Test"
echo "======================================"

# Check if dev server is running
echo "📡 Checking development server..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Dev server is running on localhost:3000"
else
    echo "❌ Dev server not running. Please start with: npm run dev"
    exit 1
fi

# Test available pages
echo ""
echo "🌐 Testing available authentication pages..."

# Test auth login page (non-locale)
if curl -s http://localhost:3000/auth/login | grep -q "Welcome to ALCHM"; then
    echo "✅ /auth/login - Available"
    AUTH_URL="http://localhost:3000/auth/login"
else
    echo "❌ /auth/login - Not available"
fi

# Test localized auth login page
if curl -s http://localhost:3000/en/auth/login | grep -q "Welcome to ALCHM"; then
    echo "✅ /en/auth/login - Available"
    if [ -z "$AUTH_URL" ]; then
        AUTH_URL="http://localhost:3000/en/auth/login"
    fi
else
    echo "⚠️  /en/auth/login - Not available"
fi

# Test browser test page
echo "✅ /auth-browser-test.html - Available (static test page)"

if [ -z "$AUTH_URL" ]; then
    echo ""
    echo "❌ No working authentication pages found!"
    echo "Please check the development server and try again."
    exit 1
fi

echo ""
echo "🚀 Authentication page available at: $AUTH_URL"
echo ""

# Open browsers for manual testing
echo "🔍 Opening browsers for manual testing..."

# macOS specific browser testing
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 Opening Chrome browsers on macOS..."
    
    # Open Chrome desktop
    if command -v /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome &> /dev/null; then
        echo "🖥️  Opening Chrome Desktop..."
        open -a "Google Chrome" "$AUTH_URL"
        sleep 2
    fi
    
    # Open Safari for comparison
    if command -v /Applications/Safari.app/Contents/MacOS/Safari &> /dev/null; then
        echo "🦋 Opening Safari for comparison..."
        open -a "Safari" "$AUTH_URL"
        sleep 2
    fi
    
    # Open browser test page
    echo "🧪 Opening browser test page..."
    open -a "Google Chrome" "http://localhost:3000/auth-browser-test.html"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Opening Chrome browsers on Linux..."
    
    # Linux browser testing
    if command -v google-chrome &> /dev/null; then
        echo "🖥️  Opening Chrome..."
        google-chrome "$AUTH_URL" &
        sleep 2
    elif command -v chromium-browser &> /dev/null; then
        echo "🖥️  Opening Chromium..."
        chromium-browser "$AUTH_URL" &
        sleep 2
    fi
    
    # Open Firefox for comparison
    if command -v firefox &> /dev/null; then
        echo "🦊 Opening Firefox for comparison..."
        firefox "$AUTH_URL" &
        sleep 2
    fi
    
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo "🪟 Opening Chrome browsers on Windows..."
    
    # Windows browser testing
    if command -v chrome.exe &> /dev/null; then
        echo "🖥️  Opening Chrome..."
        chrome.exe "$AUTH_URL" &
        sleep 2
    fi
    
    # Open Edge for comparison
    if command -v msedge.exe &> /dev/null; then
        echo "🔷 Opening Edge for comparison..."
        msedge.exe "$AUTH_URL" &
        sleep 2
    fi
fi

echo ""
echo "📋 Manual Testing Checklist:"
echo "=============================="
echo ""
echo "🖥️  CHROME DESKTOP:"
echo "   ✓ Check browser detection in console (F12)"
echo "   ✓ Verify 'Continue with Google' button appears"
echo "   ✓ Test Google authentication (should use popup)"
echo "   ✓ Verify popup fallback if blocked"
echo "   ✓ Test email/password authentication"
echo "   ✓ Check error handling and messages"
echo ""
echo "📱 CHROME MOBILE SIMULATION:"
echo "   ✓ Open DevTools (F12) and enable device simulation"
echo "   ✓ Select iPhone or Android device"
echo "   ✓ Refresh page and check mobile detection"
echo "   ✓ Verify touch-friendly button sizing (≥44px)"
echo "   ✓ Test Google authentication (should use redirect)"
echo "   ✓ Check mobile-specific messaging"
echo ""
echo "🦋 SAFARI COMPARISON:"
echo "   ✓ Verify same functionality as Chrome"
echo "   ✓ Test popup authentication"
echo "   ✓ Check error handling consistency"
echo ""
echo "🧪 BROWSER TEST PAGE:"
echo "   ✓ Review automated browser detection results"
echo "   ✓ Verify authentication strategy selection"
echo "   ✓ Check mobile capabilities detection"
echo "   ✓ Test live authentication flow"
echo ""
echo "🚨 CRISIS FEATURES:"
echo "   ✓ Verify 988 Crisis Line button works (tel: link)"
echo "   ✓ Test Text HOME button (sms: link)"
echo "   ✓ Check emergency access options"
echo "   ✓ Verify offline mode detection"
echo ""

# Console logging instructions
echo "📝 Console Logging:"
echo "=================="
echo "Look for these log messages in browser console:"
echo "   🔐 ALCHM Auth: Using [domain] domain..."
echo "   📱 Mobile capabilities: [object]"
echo "   🔥 Firebase Auth Debug Info"
echo "   ✅ Authentication successful logs"
echo ""

# Test results logging
echo "💾 Test Results:"
echo "================"
echo "Document your findings:"
echo "   - Browser detection accuracy"
echo "   - Authentication method selection"
echo "   - User experience quality"
echo "   - Error handling effectiveness"
echo "   - Mobile responsiveness"
echo "   - Crisis support accessibility"
echo ""

echo "🎉 Testing setup complete!"
echo "📧 Report any issues found during manual testing."
echo ""
echo "📊 For automated testing, run:"
echo "   npm run test:e2e"
echo ""
echo "🔄 To restart the test:"
echo "   $0"

exit 0