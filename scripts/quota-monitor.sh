#!/bin/bash
# Firebase Quota Monitoring Script
# Run this script regularly to monitor Firebase usage

echo "📊 Firebase Quota Monitoring Report"
echo "===================================="
echo "Generated: $(date)"

# Function to check if Firebase CLI is authenticated
check_firebase_auth() {
    if ! firebase projects:list >/dev/null 2>&1; then
        echo "❌ Not authenticated with Firebase CLI"
        echo "Run: firebase login"
        exit 1
    fi
}

# Get current project
get_current_project() {
    local project=$(firebase use 2>/dev/null | grep "Now using project" | awk '{print $4}')
    echo "📍 Current project: $project"
    echo "🌐 Console: https://console.firebase.google.com/project/$project"
    echo ""
}

# Check functions usage
check_functions_usage() {
    echo "🔧 Cloud Functions:"
    local functions=$(firebase functions:list 2>/dev/null | grep -c "Function" || echo "0")
    echo "  📊 Deployed functions: $functions"
    echo "  💡 Monitor invocations in Firebase Console"
    echo ""
}

# Check hosting usage  
check_hosting_usage() {
    echo "🌐 Firebase Hosting:"
    local sites=$(firebase hosting:sites:list 2>/dev/null | grep -c "Site ID" || echo "0")
    echo "  📊 Hosting sites: $sites"
    echo "  💡 Monitor bandwidth usage in Firebase Console"
    echo ""
}

# Resource usage recommendations
show_monitoring_tips() {
    echo "💡 Monitoring Tips:"
    echo "  1. Set up billing alerts in Google Cloud Console"
    echo "  2. Review usage weekly in Firebase Console"
    echo "  3. Monitor function execution times and optimize"
    echo "  4. Use Firestore compound indexes efficiently"
    echo "  5. Implement proper data archival strategies"
    echo "  6. Monitor security rules for potential abuse"
    echo ""
    
    echo "🚨 Alert Thresholds to Watch:"
    echo "  • Firestore reads: >800K/day (approaching 1M limit)"
    echo "  • Function invocations: >1.6M/month (approaching 2M limit)"
    echo "  • Storage: >800MB (approaching 1GB limit)"
    echo "  • Bandwidth: >8GB/month (approaching 10GB limit)"
}

# Main execution
check_firebase_auth
get_current_project
check_functions_usage
check_hosting_usage
show_monitoring_tips

echo "📋 Next Steps:"
echo "  1. Review current usage in Firebase Console"
echo "  2. Set up billing alerts if on Blaze plan"
echo "  3. Optimize any high-usage areas identified"
echo "  4. Schedule regular quota reviews"
