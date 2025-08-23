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
