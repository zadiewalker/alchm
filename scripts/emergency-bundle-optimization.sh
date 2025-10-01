#!/bin/bash

# 🚨 ALCHM Emergency Bundle Optimization Script
# Applies crisis-optimized configuration to reduce bundle sizes immediately

set -e

echo "🚨 ALCHM Emergency Bundle Optimization"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${RED}⚠️  WARNING: This will temporarily modify your Next.js configuration${NC}"
echo -e "${YELLOW}📋 Actions this script will take:${NC}"
echo "   1. Backup current next.config.js"
echo "   2. Apply crisis-optimized configuration"
echo "   3. Rebuild with maximum bundle splitting"
echo "   4. Analyze new bundle sizes"
echo "   5. Provide optimization report"
echo ""

# Confirm with user
read -p "Continue with emergency optimization? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏸️  Emergency optimization cancelled${NC}"
    exit 0
fi

echo -e "${BLUE}🔧 Step 1: Backing up current configuration...${NC}"
cp next.config.js next.config.js.emergency-backup
echo "✅ Backup saved as next.config.js.emergency-backup"

echo -e "${BLUE}🔧 Step 2: Applying crisis-optimized configuration...${NC}"
cp next.config.crisis-optimized.js next.config.js
echo "✅ Crisis-optimized configuration applied"

echo -e "${BLUE}🔧 Step 3: Clearing build cache...${NC}"
rm -rf .next/cache
echo "✅ Build cache cleared"

echo -e "${BLUE}🏗️  Step 4: Building with crisis optimization...${NC}"
echo "⏱️  This may take 2-3 minutes..."

# Build with crisis optimization
if NODE_OPTIONS='--max-old-space-size=8192' npm run build; then
    echo -e "${GREEN}✅ Crisis-optimized build successful!${NC}"
else
    echo -e "${RED}❌ Crisis-optimized build failed${NC}"
    echo -e "${YELLOW}🔄 Restoring original configuration...${NC}"
    cp next.config.js.emergency-backup next.config.js
    echo -e "${YELLOW}⚠️  Original configuration restored${NC}"
    exit 1
fi

echo -e "${BLUE}📊 Step 5: Analyzing optimized bundle sizes...${NC}"
npm run bundle:analyze

echo -e "${GREEN}🎉 Emergency bundle optimization completed!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Review the bundle analysis output above"
echo "2. Test critical functionality: npm run test:e2e:crisis"
echo "3. If satisfied, commit the optimized configuration"
echo "4. If issues found, restore: cp next.config.js.emergency-backup next.config.js"
echo ""
echo -e "${YELLOW}📄 Configuration files:${NC}"
echo "   • Current config: next.config.js (crisis-optimized)"
echo "   • Backup: next.config.js.emergency-backup (original)" 
echo "   • Template: next.config.crisis-optimized.js (for reference)"
echo ""
echo -e "${GREEN}🛡️  Crisis accessibility status will be shown in bundle analysis above ⬆️${NC}"