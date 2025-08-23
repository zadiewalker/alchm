#!/bin/bash

# Firebase Usage Quotas and Billing Audit Script for ALCHM
# This script checks Firebase usage quotas, billing, and resource consumption

echo "🔥 ALCHM Firebase Usage Quotas & Billing Audit"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Function to increment counters
increment_counter() {
    local status=$1
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    case $status in
        "pass") PASSED_CHECKS=$((PASSED_CHECKS + 1)) ;;
        "fail") FAILED_CHECKS=$((FAILED_CHECKS + 1)) ;;
        "warn") WARNING_CHECKS=$((WARNING_CHECKS + 1)) ;;
    esac
}

# Function to check Firebase authentication
check_firebase_auth() {
    echo -e "\n${BLUE}🔐 Firebase Authentication Check${NC}"
    
    if ! command -v firebase >/dev/null 2>&1; then
        echo -e "${RED}❌ Firebase CLI not found${NC}"
        echo "   Install with: npm install -g firebase-tools"
        increment_counter "fail"
        return 1
    fi
    
    echo -e "${GREEN}✅ Firebase CLI available${NC}"
    increment_counter "pass"
    
    # Check authentication
    if firebase projects:list >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Firebase authentication successful${NC}"
        increment_counter "pass"
        
        # Get current project
        local current_project=$(firebase use 2>/dev/null | grep "Now using project" | awk '{print $4}' || echo "none")
        if [ "$current_project" != "none" ]; then
            echo "  📍 Current project: $current_project"
        fi
        return 0
    else
        echo -e "${RED}❌ Firebase authentication failed${NC}"
        echo "   Run: firebase login"
        increment_counter "fail"
        return 1
    fi
}

# Function to check Firebase project quotas
check_firebase_quotas() {
    echo -e "\n${BLUE}📊 Firebase Project Quotas${NC}"
    
    # Check Firestore quotas
    echo "🔍 Checking Firestore quotas..."
    
    # These checks would normally query Firebase APIs
    # For now, we'll provide guidance on quota monitoring
    echo -e "${YELLOW}⚠️  Manual quota checks required${NC}"
    echo "   Visit: https://console.firebase.google.com/project/$(firebase use 2>/dev/null | awk '{print $4}')/usage"
    increment_counter "warn"
    
    # Firestore quota guidelines
    echo -e "\n${BLUE}📋 Firestore Quota Limits (Spark Plan)${NC}"
    echo "  📄 Documents: 1M reads/day, 20K writes/day, 20K deletes/day"
    echo "  💾 Storage: 1 GiB total"
    echo "  🌐 Network egress: 10 GiB/month"
    
    echo -e "\n${BLUE}📋 Firestore Quota Limits (Blaze Plan)${NC}"
    echo "  📄 Documents: Pay-per-use after free tier"
    echo "  💾 Storage: $0.18/GiB/month"
    echo "  🌐 Network egress: $0.12/GiB"
    
    # Functions quota guidelines
    echo -e "\n${BLUE}🔧 Cloud Functions Quotas${NC}"
    echo "  ⚡ Invocations: 2M/month (free), then $0.40/M"
    echo "  ⏱️  GB-seconds: 400K/month (free), then $0.0000025/GB-second"
    echo "  🌐 Network egress: 5 GB/month (free), then $0.12/GB"
    
    # Hosting quota guidelines
    echo -e "\n${BLUE}🌐 Firebase Hosting Quotas${NC}"
    echo "  💾 Storage: 10 GB (free), then $0.026/GB/month"
    echo "  🔄 Transfer: 360 MB/day (free), then $0.15/GB"
    
    # Authentication quotas
    echo -e "\n${BLUE}👤 Firebase Authentication Quotas${NC}"
    echo "  📱 Phone Auth: No free tier, $0.06/verification"
    echo "  📧 Email/Social: Free for reasonable use"
}

# Function to check current usage metrics
check_current_usage() {
    echo -e "\n${BLUE}📈 Current Usage Analysis${NC}"
    
    # Check functions deployment status
    echo "🔍 Checking deployed functions..."
    local functions_list=$(firebase functions:list 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Functions list accessible${NC}"
        increment_counter "pass"
        
        local function_count=$(echo "$functions_list" | grep -c "Function" || echo "0")
        echo "  📊 Deployed functions: $function_count"
        
        if [ "$function_count" -gt 10 ]; then
            echo -e "${YELLOW}⚠️  High number of functions may impact billing${NC}"
            increment_counter "warn"
        fi
    else
        echo -e "${YELLOW}⚠️  Unable to retrieve functions list${NC}"
        increment_counter "warn"
    fi
    
    # Check hosting sites
    echo -e "\n🔍 Checking hosting deployment status..."
    local hosting_list=$(firebase hosting:sites:list 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Hosting sites accessible${NC}"
        increment_counter "pass"
        
        local site_count=$(echo "$hosting_list" | grep -c "Site ID" || echo "0")
        echo "  🌐 Hosting sites: $site_count"
    else
        echo -e "${YELLOW}⚠️  Unable to retrieve hosting sites${NC}"
        increment_counter "warn"
    fi
    
    # Check project size indicators
    echo -e "\n🔍 Checking local project size indicators..."
    
    # Check .next build size
    if [ -d ".next" ]; then
        local build_size=$(du -sh .next 2>/dev/null | awk '{print $1}' || echo "unknown")
        echo "  📦 Build size: $build_size"
        
        # Warn if build is very large
        local size_mb=$(du -sm .next 2>/dev/null | awk '{print $1}' || echo "0")
        if [ "$size_mb" -gt 500 ]; then
            echo -e "${YELLOW}⚠️  Large build size may impact hosting costs${NC}"
            increment_counter "warn"
        else
            echo -e "${GREEN}✅ Build size reasonable${NC}"
            increment_counter "pass"
        fi
    else
        echo -e "${YELLOW}⚠️  No build found - run 'npm run build' first${NC}"
        increment_counter "warn"
    fi
    
    # Check functions build size
    if [ -d "functions/dist" ] || [ -d "functions/lib" ]; then
        local functions_size=$(du -sh functions/dist functions/lib 2>/dev/null | awk '{sum+=$1} END {print sum "MB"}' || echo "unknown")
        echo "  🔧 Functions build size: $functions_size"
    fi
}

# Function to check billing configuration
check_billing_config() {
    echo -e "\n${BLUE}💳 Billing Configuration${NC}"
    
    echo "🔍 Checking for billing-related configuration..."
    
    # Check if project is on Blaze plan (required for some features)
    echo -e "${YELLOW}⚠️  Manual billing verification required${NC}"
    echo "   Visit: https://console.firebase.google.com/project/$(firebase use 2>/dev/null | awk '{print $4}')/settings/billing"
    increment_counter "warn"
    
    # Billing best practices
    echo -e "\n${BLUE}💡 Billing Best Practices${NC}"
    echo "  🚨 Set up billing alerts in Google Cloud Console"
    echo "  📊 Monitor usage regularly via Firebase Console"
    echo "  🔒 Implement proper security rules to prevent abuse"
    echo "  ⚡ Optimize function execution time and memory usage"
    echo "  🗂️  Archive old data to reduce storage costs"
    echo "  🌐 Use CDN caching to reduce bandwidth costs"
    
    # Check for potential cost optimization opportunities
    echo -e "\n${BLUE}💰 Cost Optimization Checks${NC}"
    
    # Check for large files in public directory
    if [ -d "public" ]; then
        local large_files=$(find public -type f -size +1M 2>/dev/null | wc -l)
        if [ "$large_files" -gt 0 ]; then
            echo -e "${YELLOW}⚠️  $large_files large files found in public directory${NC}"
            echo "   Consider optimizing images and assets"
            increment_counter "warn"
        else
            echo -e "${GREEN}✅ No large files detected in public directory${NC}"
            increment_counter "pass"
        fi
    fi
    
    # Check for optimized Next.js configuration
    if [ -f "next.config.mjs" ] || [ -f "next.config.js" ]; then
        echo -e "${GREEN}✅ Next.js configuration found${NC}"
        
        # Check for output: 'standalone' (better for functions)
        if grep -q "output.*standalone" next.config.* 2>/dev/null; then
            echo -e "${GREEN}✅ Standalone output configured (optimal for Firebase Functions)${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  Consider using standalone output for better performance${NC}"
            increment_counter "warn"
        fi
        
        # Check for image optimization
        if grep -q "images.*unoptimized.*true" next.config.* 2>/dev/null; then
            echo -e "${YELLOW}⚠️  Image optimization disabled${NC}"
            echo "   This is normal for Firebase Functions but may increase bandwidth costs"
            increment_counter "warn"
        fi
    fi
}

# Function to check security rules (affects quota usage)
check_security_rules() {
    echo -e "\n${BLUE}🔒 Security Rules Impact on Usage${NC}"
    
    # Check Firestore rules
    if [ -f "firestore.rules" ]; then
        echo -e "${GREEN}✅ Firestore rules file found${NC}"
        increment_counter "pass"
        
        # Check for overly permissive rules that could lead to abuse
        if grep -q "allow read, write" firestore.rules; then
            echo -e "${RED}❌ Potentially insecure rules detected${NC}"
            echo "   Overly permissive rules can lead to quota abuse"
            increment_counter "fail"
        else
            echo -e "${GREEN}✅ Security rules appear restrictive${NC}"
            increment_counter "pass"
        fi
    else
        echo -e "${YELLOW}⚠️  Firestore rules file not found${NC}"
        increment_counter "warn"
    fi
    
    # Check Storage rules if applicable
    if [ -f "storage.rules" ]; then
        echo -e "${GREEN}✅ Storage rules file found${NC}"
        increment_counter "pass"
    fi
}

# Function to generate quota monitoring recommendations
generate_monitoring_recommendations() {
    echo -e "\n${BLUE}📝 Generating Quota Monitoring Setup${NC}"
    
    cat > scripts/quota-monitor.sh << 'EOF'
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
EOF

    chmod +x scripts/quota-monitor.sh
    echo -e "${GREEN}✅ Quota monitoring script created: scripts/quota-monitor.sh${NC}"
    
    # Generate Firebase Console quick links
    cat > firebase-console-links.md << 'EOF'
# Firebase Console Quick Links

## Usage & Billing Monitoring

### Project Overview
- [Project Dashboard](https://console.firebase.google.com/project/_/overview)
- [Usage Dashboard](https://console.firebase.google.com/project/_/usage)
- [Billing](https://console.firebase.google.com/project/_/settings/billing)

### Service-Specific Usage
- [Firestore Usage](https://console.firebase.google.com/project/_/firestore/usage)
- [Functions Usage](https://console.firebase.google.com/project/_/functions/usage)
- [Hosting Usage](https://console.firebase.google.com/project/_/hosting/usage)
- [Authentication Usage](https://console.firebase.google.com/project/_/authentication/usage)
- [Storage Usage](https://console.firebase.google.com/project/_/storage/usage)

### Optimization Resources
- [Performance Monitoring](https://console.firebase.google.com/project/_/performance)
- [Security Rules](https://console.firebase.google.com/project/_/firestore/rules)
- [Function Logs](https://console.firebase.google.com/project/_/functions/logs)

## Google Cloud Console (for billing alerts)
- [Billing Dashboard](https://console.cloud.google.com/billing)
- [Budget Alerts](https://console.cloud.google.com/billing/budgets)
- [Usage Reports](https://console.cloud.google.com/billing/reports)

## Monitoring Checklist
- [ ] Weekly usage review
- [ ] Monthly billing review  
- [ ] Quarterly quota optimization
- [ ] Security rules audit
- [ ] Performance optimization review
EOF

    echo -e "${GREEN}✅ Console links generated: firebase-console-links.md${NC}"
}

# Load environment variables if available
if [ -f ".env.local" ]; then
    set -a
    source .env.local
    set +a
fi

# Main execution
check_firebase_auth

if [ $? -eq 0 ]; then
    check_firebase_quotas
    check_current_usage
    check_billing_config
    check_security_rules
    generate_monitoring_recommendations
fi

# Summary
echo -e "\n${BLUE}📊 Firebase Quotas & Billing Audit Summary${NC}"
echo "=============================================="
echo -e "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"
echo -e "${YELLOW}Warnings: $WARNING_CHECKS${NC}"
echo -e "${RED}Failed: $FAILED_CHECKS${NC}"

# Recommendations
echo -e "\n${BLUE}💡 Firebase Usage Optimization${NC}"
echo "=============================================="

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}✅ Firebase configuration appears optimal for quota management${NC}"
else
    echo -e "${RED}❌ $FAILED_CHECKS critical issues found. Address before production.${NC}"
fi

if [ $WARNING_CHECKS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNING_CHECKS optimization opportunities found.${NC}"
fi

echo ""
echo "🔥 Firebase Quota Best Practices:"
echo "  • Monitor usage daily via Firebase Console"
echo "  • Set up billing alerts to prevent unexpected charges"
echo "  • Implement efficient Firestore security rules"
echo "  • Optimize function memory allocation and execution time"
echo "  • Use Firestore compound indexes judiciously"
echo "  • Implement data archival for old records"
echo "  • Monitor for potential abuse or unusual usage patterns"

echo ""
echo "📋 Next Steps:"
echo "  1. Review current usage in Firebase Console"
echo "  2. Set up billing alerts in Google Cloud Console"
echo "  3. Run scripts/quota-monitor.sh weekly"
echo "  4. Optimize any high-usage areas identified"
echo "  5. Implement proper data lifecycle management"
echo "  6. Schedule regular quota and cost reviews"

# Exit with appropriate code
if [ $FAILED_CHECKS -eq 0 ]; then
    exit 0
else
    exit 1
fi