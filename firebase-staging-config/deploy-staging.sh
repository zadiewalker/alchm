#!/bin/bash

# ALCHM Therapist Beta Staging Deployment Script
# Deploys isolated staging environment for clinical professional testing

set -e  # Exit on any error

echo "🏥 ALCHM Therapist Beta Staging Deployment"
echo "=========================================="
echo "⚠️  WARNING: This deploys to STAGING environment only"
echo "📋 No real client data - Mock data environment"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found. Installing...${NC}"
    npm install -g firebase-tools
fi

# Verify user is logged in to Firebase
echo -e "${BLUE}🔐 Verifying Firebase authentication...${NC}"
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚡ Please log in to Firebase CLI${NC}"
    firebase login
fi

# Backup current firebase.json
echo -e "${BLUE}📋 Backing up current Firebase configuration...${NC}"
if [ -f "firebase.json" ]; then
    cp firebase.json firebase.json.production.backup
    echo -e "${GREEN}✅ Production config backed up${NC}"
fi

# Use staging configuration
echo -e "${BLUE}🔄 Switching to staging configuration...${NC}"
cp firebase-staging-config/firebase.staging.json firebase.json
cp firebase-staging-config/firestore.staging.rules firestore.rules
cp firebase-staging-config/firestore.staging.indexes.json firestore.indexes.json
cp firebase-staging-config/storage.staging.rules storage.rules
cp firebase-staging-config/database.staging.rules.json database.rules.json

echo -e "${GREEN}✅ Staging configuration active${NC}"

# Create staging environment variables
echo -e "${BLUE}🔧 Setting up staging environment variables...${NC}"
cat > .env.staging.local << EOF
# THERAPIST BETA STAGING ENVIRONMENT
NODE_ENV=staging
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_BETA_MODE=therapist_testing

# Firebase Staging Project
NEXT_PUBLIC_FIREBASE_PROJECT_ID=alchm-therapist-beta-staging
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=alchm-therapist-beta-staging.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=alchm-therapist-beta-staging.appspot.com

# Beta Testing Features
NEXT_PUBLIC_MOCK_DATA_MODE=enabled
NEXT_PUBLIC_CRISIS_TEST_MODE=enabled
NEXT_PUBLIC_HIPAA_COMPLIANCE_TEST=enabled

# Professional License Verification
THERAPIST_LICENSE_VERIFICATION_API=staging
PROFESSIONAL_CREDENTIALS_CHECK=enabled

# Feedback Collection
BETA_FEEDBACK_COLLECTION=enabled
CLINICAL_ANALYTICS_MODE=professional_testing

# Emergency Escalation Testing
EMERGENCY_ESCALATION_TEST_MODE=enabled
CRISIS_RESPONSE_SIMULATION=enabled
EOF

echo -e "${GREEN}✅ Staging environment configured${NC}"

# Build for staging
echo -e "${BLUE}🏗️  Building for staging environment...${NC}"
NODE_ENV=staging npm run build

# Deploy to Firebase
echo -e "${BLUE}🚀 Deploying to Firebase staging...${NC}"
firebase use alchm-therapist-beta-staging || {
    echo -e "${YELLOW}⚠️  Creating new Firebase project for staging...${NC}"
    firebase projects:create alchm-therapist-beta-staging --display-name "ALCHM Therapist Beta Staging"
    firebase use alchm-therapist-beta-staging
}

# Deploy all services
echo -e "${BLUE}📦 Deploying Firestore rules and indexes...${NC}"
firebase deploy --only firestore:rules,firestore:indexes

echo -e "${BLUE}📦 Deploying Storage rules...${NC}"
firebase deploy --only storage:rules

echo -e "${BLUE}📦 Deploying Database rules...${NC}"
firebase deploy --only database

echo -e "${BLUE}📦 Deploying Functions...${NC}"
firebase deploy --only functions

echo -e "${BLUE}📦 Deploying Hosting...${NC}"
firebase deploy --only hosting:alchm-therapist-beta-staging

echo -e "${BLUE}📦 Deploying Extensions...${NC}"
firebase deploy --only extensions

# Restore production configuration
echo -e "${BLUE}🔄 Restoring production configuration...${NC}"
if [ -f "firebase.json.production.backup" ]; then
    mv firebase.json.production.backup firebase.json
    git checkout firestore.rules firestore.indexes.json storage.rules
    echo -e "${GREEN}✅ Production config restored${NC}"
fi

# Clean up staging environment file
rm -f .env.staging.local

echo ""
echo -e "${GREEN}🎉 STAGING DEPLOYMENT COMPLETE! 🎉${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}📋 Staging Environment Details:${NC}"
echo -e "   🌐 URL: https://alchm-therapist-beta-staging.web.app"
echo -e "   🏥 Purpose: Licensed therapist beta testing"
echo -e "   📊 Data: Mock client data only (HIPAA-safe)"
echo -e "   🔒 Access: Beta therapists with verified credentials"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT NOTES:${NC}"
echo -e "   • This is an isolated testing environment"
echo -e "   • No real client data is present"
echo -e "   • All crisis scenarios are simulated"
echo -e "   • Professional licenses are verified before access"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo -e "   1. Verify staging environment: https://alchm-therapist-beta-staging.web.app"
echo -e "   2. Send beta invitations to licensed therapists"
echo -e "   3. Monitor feedback collection dashboard"
echo -e "   4. Review crisis detection test results"
echo ""
echo -e "${GREEN}✅ Ready for therapist beta testing!${NC}"