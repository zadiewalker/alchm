#!/bin/bash

# ALCHM Firebase Authentication Domain Configuration Fix
# Critical script to resolve mobile OAuth domain authorization issues
# Run this script to add all required authorized domains to Firebase Auth

echo "🔐 ALCHM Firebase Authentication Domain Configuration"
echo "=================================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "   npm install -g firebase-tools"
    echo "   firebase login"
    exit 1
fi

# Check if user is logged in
echo "🔍 Checking Firebase authentication status..."
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run: firebase login"
    exit 1
fi

echo "✅ Firebase CLI authenticated"
echo ""

# Get current project
PROJECT_ID=$(firebase projects:list --json | jq -r '.[] | select(.status == "ACTIVE") | .projectId' | head -1)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No active Firebase project found. Please run: firebase use <project-id>"
    exit 1
fi

echo "📱 Active Firebase Project: $PROJECT_ID"
echo ""

# List current authorized domains
echo "🔍 Current authorized domains:"
firebase auth:domains:list --project=$PROJECT_ID
echo ""

# Domains to add for ALCHM mobile authentication
DOMAINS_TO_ADD=(
    "alchmapp.web.app"
    "alchm-digital-sanctuary.web.app"
    "alchmapp.firebaseapp.com"
    "alchm-e9eb4.firebaseapp.com"
    "localhost"
)

echo "➕ Adding required domains for mobile OAuth..."
echo ""

for domain in "${DOMAINS_TO_ADD[@]}"; do
    echo "Adding domain: $domain"
    if firebase auth:domains:add $domain --project=$PROJECT_ID; then
        echo "  ✅ Successfully added $domain"
    else
        echo "  ⚠️  Failed to add $domain (may already exist)"
    fi
    echo ""
done

echo "🎯 Verifying final domain configuration:"
firebase auth:domains:list --project=$PROJECT_ID
echo ""

echo "🔐 Google OAuth Configuration Check"
echo "===================================="
echo ""
echo "Please verify the following in Google Cloud Console:"
echo "1. Go to: https://console.cloud.google.com/apis/credentials"
echo "2. Find your OAuth 2.0 Client ID for ALCHM"
echo "3. Under 'Authorized JavaScript origins', ensure these are added:"
echo "   - https://alchmapp.web.app"
echo "   - https://alchm-digital-sanctuary.web.app"
echo "   - http://localhost:3000 (for development)"
echo ""
echo "4. Under 'Authorized redirect URIs', ensure these are added:"
echo "   - https://alchmapp.web.app/__/auth/handler"
echo "   - https://alchm-digital-sanctuary.web.app/__/auth/handler"
echo "   - http://localhost:3000/__/auth/handler (for development)"
echo ""

echo "📋 Mobile Authentication Testing Checklist"
echo "=========================================="
echo ""
echo "After running this script, test authentication on:"
echo "□ iPhone Safari (regular browsing)"
echo "□ iPhone Safari (private browsing)"
echo "□ iPhone Chrome"
echo "□ Android Chrome"
echo "□ Android Firefox"
echo "□ iPad Safari"
echo ""
echo "Test scenarios:"
echo "□ Normal authentication flow"
echo "□ Popup blocked scenario (should fall back to redirect)"
echo "□ Network interruption during auth"
echo "□ Low battery scenario"
echo "□ Crisis keyword detection and bypass"
echo ""

echo "🚨 Crisis Safety Validation"
echo "============================"
echo ""
echo "Verify these crisis-safety features work:"
echo "□ Emergency call buttons (988, 911) work on all mobile browsers"
echo "□ SMS crisis text (741741) works on all mobile devices"
echo "□ Guest access functions without authentication"
echo "□ Offline crisis resources load when network is down"
echo "□ Haptic feedback works on touch devices"
echo ""

echo "✅ Firebase authentication domain configuration complete!"
echo ""
echo "Next steps:"
echo "1. Test mobile authentication flows"
echo "2. Verify Google OAuth settings in Cloud Console"
echo "3. Run mobile device testing on real devices"
echo "4. Monitor authentication success rates in Firebase Analytics"
echo ""
echo "For issues, check Firebase Authentication logs:"
echo "https://console.firebase.google.com/project/$PROJECT_ID/authentication/users"