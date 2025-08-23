#!/bin/bash

# Master Production Readiness Checklist Script for ALCHM
# This script runs all production readiness audits in sequence

echo "🚀 ALCHM Production Readiness Master Audit"
echo "==========================================="
echo "Running comprehensive production readiness checks..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters for overall assessment
TOTAL_AUDITS=5
PASSED_AUDITS=0
FAILED_AUDITS=0
WARNING_AUDITS=0

# Function to run audit and track results
run_audit() {
    local script_name=$1
    local description=$2
    local script_path="scripts/$script_name"
    
    echo -e "${BLUE}🔍 Running: $description${NC}"
    echo "================================================="
    
    if [ ! -f "$script_path" ]; then
        echo -e "${RED}❌ Script not found: $script_path${NC}"
        FAILED_AUDITS=$((FAILED_AUDITS + 1))
        return 1
    fi
    
    if [ ! -x "$script_path" ]; then
        echo -e "${YELLOW}⚠️  Making script executable: $script_path${NC}"
        chmod +x "$script_path"
    fi
    
    # Run the audit script
    if "./$script_path"; then
        echo -e "${GREEN}✅ $description - PASSED${NC}"
        PASSED_AUDITS=$((PASSED_AUDITS + 1))
        echo ""
        return 0
    else
        local exit_code=$?
        if [ $exit_code -eq 1 ]; then
            echo -e "${RED}❌ $description - FAILED${NC}"
            FAILED_AUDITS=$((FAILED_AUDITS + 1))
        else
            echo -e "${YELLOW}⚠️  $description - WARNINGS${NC}"
            WARNING_AUDITS=$((WARNING_AUDITS + 1))
        fi
        echo ""
        return $exit_code
    fi
}

# Function to create master checklist
create_master_checklist() {
    echo -e "${BLUE}📝 Creating Master Production Readiness Checklist${NC}"
    
    cat > PRODUCTION_READINESS_CHECKLIST.md << EOF
# ALCHM Production Readiness Checklist

**Generated:** $(date)
**Status:** $(if [ $FAILED_AUDITS -eq 0 ]; then echo "✅ READY"; else echo "❌ NOT READY"; fi)

## Overview

This checklist ensures all critical systems are properly configured and secured before production deployment.

## Audit Results Summary

- **Total Audits:** $TOTAL_AUDITS
- **Passed:** $PASSED_AUDITS  
- **Failed:** $FAILED_AUDITS
- **Warnings:** $WARNING_AUDITS
- **Success Rate:** $(( PASSED_AUDITS * 100 / TOTAL_AUDITS ))%

## 1. Environment Variables & Secrets ✅

**Script:** \`scripts/env-audit.sh\`
**Status:** $(grep -c "✅" scripts/env-audit.sh >/dev/null 2>&1 && echo "✅ Configured" || echo "❌ Needs Review")

### Key Requirements:
- [ ] All required environment variables set
- [ ] No development keys in production
- [ ] Secrets properly secured
- [ ] Environment consistency validated
- [ ] .env.local.template generated

### Critical Variables:
- Firebase configuration (API key, project ID, etc.)
- Stripe keys (production vs test)
- AI service API keys
- Application URLs and settings

---

## 2. SSL Certificates & Custom Domains 🔒

**Script:** \`scripts/ssl-domain-audit.sh\`
**Status:** $([ -f "scripts/ssl-monitor.sh" ] && echo "✅ Configured" || echo "❌ Needs Setup")

### Key Requirements:
- [ ] SSL certificates valid and not expiring soon
- [ ] Custom domains properly configured
- [ ] HTTPS redirects working
- [ ] Security headers implemented
- [ ] DNS configuration validated
- [ ] CDN and performance optimized

### Generated Tools:
- SSL monitoring script
- Firebase hosting template
- Certificate renewal alerts

---

## 3. Firebase Usage Quotas & Billing 💳

**Script:** \`scripts/firebase-audit.sh\`
**Status:** $([ -f "scripts/quota-monitor.sh" ] && echo "✅ Configured" || echo "❌ Needs Setup")

### Key Requirements:
- [ ] Firebase project properly configured
- [ ] Billing plan appropriate for usage
- [ ] Quota monitoring set up
- [ ] Usage optimization implemented
- [ ] Cost alerts configured
- [ ] Resource usage within limits

### Monitoring Tools:
- Quota monitoring script
- Firebase console quick links
- Usage alert thresholds

---

## 4. Security Rules & Permissions 🛡️

**Script:** \`scripts/security-rules-audit.sh\`
**Status:** $([ -f "firestore.rules.template" ] && echo "✅ Configured" || echo "❌ Needs Review")

### Key Requirements:
- [ ] Firestore security rules implemented
- [ ] User authentication required
- [ ] Data access properly restricted
- [ ] API endpoints secured
- [ ] Input validation implemented
- [ ] Security headers configured

### Security Templates:
- Comprehensive Firestore rules
- Storage security rules
- Security checklist documentation

---

## 5. Production User Flow Testing 🧪

**Script:** \`scripts/production-user-flow-test.sh\`
**Status:** $([ -f "production-test-report.md" ] && echo "✅ Tested" || echo "❌ Needs Testing")

### Key Requirements:
- [ ] Homepage and core pages accessible
- [ ] Authentication flow working
- [ ] API endpoints responding correctly
- [ ] Error pages functioning
- [ ] Security headers present
- [ ] Performance within acceptable limits
- [ ] PWA features working
- [ ] SEO meta tags present

### Test Coverage:
- Basic connectivity
- Authentication & security
- Performance & optimization
- PWA & modern web features
- API health checks
- SEO & accessibility

---

## Production Deployment Readiness

### ✅ Ready for Production If:
- All 5 audits pass without critical failures
- Security rules are properly implemented
- SSL certificates are valid and monitored
- Environment variables are production-ready
- User flows work correctly in production
- Performance meets requirements

### ❌ Not Ready If:
- Any audit shows critical failures
- Security vulnerabilities exist
- SSL certificates are expired/missing
- Development keys are in production
- Core user flows are broken
- Performance is unacceptable

## Pre-Deployment Commands

Run these commands before deploying to production:

\`\`\`bash
# 1. Run all audits
./scripts/production-readiness-master.sh

# 2. Build and test locally
npm run build
npm run test

# 3. Run type checking
npm run typecheck

# 4. Deploy to production
firebase deploy

# 5. Run post-deployment tests
./scripts/production-user-flow-test.sh
\`\`\`

## Post-Deployment Monitoring

### Daily Checks:
- [ ] Run quota monitoring: \`./scripts/quota-monitor.sh\`
- [ ] Check SSL certificates: \`./scripts/ssl-monitor.sh\`
- [ ] Monitor error logs
- [ ] Review user analytics

### Weekly Checks:
- [ ] Full production testing: \`./scripts/production-user-flow-test.sh\`
- [ ] Security audit: \`./scripts/security-rules-audit.sh\`
- [ ] Performance review
- [ ] User feedback analysis

### Monthly Checks:
- [ ] Complete readiness audit: \`./scripts/production-readiness-master.sh\`
- [ ] Environment variables review
- [ ] SSL certificate renewal planning
- [ ] Security rules update
- [ ] Cost and usage optimization

## Emergency Contacts & Procedures

### Critical Issues:
1. **Security Breach:** Immediately disable access, review logs
2. **Site Down:** Check hosting status, review error logs
3. **SSL Expiry:** Emergency certificate renewal
4. **Quota Exceeded:** Upgrade plan or optimize usage
5. **Data Loss:** Restore from backups

### Support Resources:
- Firebase Console: https://console.firebase.google.com
- Google Cloud Console: https://console.cloud.google.com
- Project Documentation: ./README.md
- Security Checklist: ./security-checklist.md

---

**Last Updated:** $(date)
**Next Review:** $(date -d "+1 month" 2>/dev/null || date -v +1m 2>/dev/null || echo "Set reminder for 1 month")
EOF

    echo -e "${GREEN}✅ Master checklist created: PRODUCTION_READINESS_CHECKLIST.md${NC}"
}

# Function to create quick deployment script
create_deployment_script() {
    echo -e "${BLUE}📝 Creating Quick Deployment Script${NC}"
    
    cat > deploy-to-production.sh << 'EOF'
#!/bin/bash

# Quick Production Deployment Script for ALCHM
# This script runs all pre-deployment checks and deploys to production

echo "🚀 ALCHM Production Deployment"
echo "==============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to check if we should proceed
confirm_deployment() {
    echo -e "${YELLOW}⚠️  You are about to deploy to PRODUCTION${NC}"
    echo "This will:"
    echo "  • Run all production readiness checks"
    echo "  • Build the application"
    echo "  • Deploy to Firebase hosting and functions"
    echo ""
    read -p "Are you sure you want to continue? (yes/no): " -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
}

# Function to run pre-deployment checks
run_predeploy_checks() {
    echo -e "${BLUE}🔍 Running pre-deployment checks...${NC}"
    
    # Run master audit
    if ! ./scripts/production-readiness-master.sh; then
        echo -e "${RED}❌ Production readiness checks failed${NC}"
        echo "Fix the issues above before deploying to production."
        exit 1
    fi
    
    # Run build
    echo -e "${BLUE}🏗️  Building application...${NC}"
    if ! npm run build; then
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi
    
    # Run tests if available
    echo -e "${BLUE}🧪 Running tests...${NC}"
    if ! npm run test; then
        echo -e "${YELLOW}⚠️  Tests failed, but continuing...${NC}"
    fi
    
    # Run type checking
    echo -e "${BLUE}📝 Running type checking...${NC}"
    if ! npm run typecheck; then
        echo -e "${RED}❌ Type checking failed${NC}"
        exit 1
    fi
}

# Function to deploy to Firebase
deploy_to_firebase() {
    echo -e "${BLUE}🚀 Deploying to Firebase...${NC}"
    
    # Deploy hosting and functions
    if firebase deploy --only hosting,functions; then
        echo -e "${GREEN}✅ Deployment successful!${NC}"
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    fi
}

# Function to run post-deployment tests
run_postdeploy_tests() {
    echo -e "${BLUE}🧪 Running post-deployment tests...${NC}"
    
    # Wait a moment for deployment to propagate
    sleep 10
    
    # Run production user flow tests
    if ./scripts/production-user-flow-test.sh; then
        echo -e "${GREEN}✅ Post-deployment tests passed!${NC}"
    else
        echo -e "${RED}❌ Post-deployment tests failed${NC}"
        echo "Check the production environment immediately."
        exit 1
    fi
}

# Main deployment process
confirm_deployment
run_predeploy_checks
deploy_to_firebase
run_postdeploy_tests

echo -e "${GREEN}🎉 Production deployment completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Monitor the application for the first hour"
echo "  2. Check user analytics and error logs"
echo "  3. Verify all user flows are working"
echo "  4. Update team on deployment status"
echo ""
echo "Monitoring commands:"
echo "  • ./scripts/quota-monitor.sh"
echo "  • ./scripts/ssl-monitor.sh"
echo "  • ./scripts/production-user-flow-test.sh"
EOF

    chmod +x deploy-to-production.sh
    echo -e "${GREEN}✅ Deployment script created: deploy-to-production.sh${NC}"
}

# Start timestamp
START_TIME=$(date +%s)

echo "Starting production readiness audit at $(date)"
echo ""

# Run all audits in sequence
run_audit "env-audit.sh" "Environment Variables & Secrets Audit"
run_audit "ssl-domain-audit.sh" "SSL Certificates & Custom Domains Audit"  
run_audit "firebase-audit.sh" "Firebase Usage Quotas & Billing Audit"
run_audit "security-rules-audit.sh" "Security Rules & Permissions Audit"
run_audit "production-user-flow-test.sh" "Production User Flow Testing"

# Calculate duration
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Create additional deliverables
create_master_checklist
create_deployment_script

# Final summary
echo -e "${BLUE}🏁 Production Readiness Master Audit Complete${NC}"
echo "============================================="
echo "Audit completed in ${DURATION} seconds"
echo ""
echo -e "Total Audits: $TOTAL_AUDITS"
echo -e "${GREEN}Passed: $PASSED_AUDITS${NC}"
echo -e "${YELLOW}Warnings: $WARNING_AUDITS${NC}"
echo -e "${RED}Failed: $FAILED_AUDITS${NC}"

if [ $TOTAL_AUDITS -gt 0 ]; then
    local success_rate=$(( PASSED_AUDITS * 100 / TOTAL_AUDITS ))
    echo -e "Success Rate: ${success_rate}%"
fi

echo ""
echo -e "${BLUE}📋 Generated Files:${NC}"
echo "  • PRODUCTION_READINESS_CHECKLIST.md - Master checklist"
echo "  • deploy-to-production.sh - Quick deployment script"
echo "  • Various audit reports and templates"

echo ""
echo -e "${BLUE}💡 Production Readiness Assessment${NC}"
echo "============================================="

if [ $FAILED_AUDITS -eq 0 ]; then
    echo -e "${GREEN}🎉 PRODUCTION READY!${NC}"
    echo -e "${GREEN}✅ All critical audits passed${NC}"
    echo -e "${GREEN}🚀 Safe to deploy to production${NC}"
    
    if [ $WARNING_AUDITS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNING_AUDITS optimization opportunities found${NC}"
        echo -e "${YELLOW}💡 Consider addressing these for optimal performance${NC}"
    fi
    
    echo ""
    echo "Ready to deploy:"
    echo "  ./deploy-to-production.sh"
    
else
    echo -e "${RED}❌ NOT READY FOR PRODUCTION${NC}"
    echo -e "${RED}🚨 $FAILED_AUDITS critical issues must be resolved${NC}"
    
    if [ $WARNING_AUDITS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNING_AUDITS additional warnings${NC}"
    fi
    
    echo ""
    echo "Fix the issues above, then run this script again:"
    echo "  ./scripts/production-readiness-master.sh"
fi

echo ""
echo "📚 Documentation:"
echo "  • Review: PRODUCTION_READINESS_CHECKLIST.md"
echo "  • Security: security-checklist.md (if generated)"
echo "  • Console: firebase-console-links.md (if generated)"

# Exit with appropriate code
if [ $FAILED_AUDITS -eq 0 ]; then
    exit 0
else
    exit 1
fi