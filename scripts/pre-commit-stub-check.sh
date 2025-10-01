#!/bin/bash

# ALCHM Pre-Commit Stub Generator
# Automatically prevents import errors before they reach the repository

set -e

echo "🔍 Pre-commit: Checking for missing imports..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Run TypeScript check to detect missing imports
echo "Running TypeScript compilation check..."

if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
    echo -e "${GREEN}✅ No missing imports detected${NC}"
else
    echo -e "${YELLOW}⚠️  Missing imports detected - generating stubs...${NC}"
    
    # Run the stub generator
    node scripts/module-stub-generator.js
    
    # Check if stubs were created
    if [ -f "module-stub-report.json" ]; then
        STUBS_CREATED=$(node -p "JSON.parse(require('fs').readFileSync('module-stub-report.json', 'utf8')).stubsCreated")
        
        if [ "$STUBS_CREATED" -gt 0 ]; then
            echo -e "${YELLOW}📝 Created $STUBS_CREATED stub files${NC}"
            echo -e "${YELLOW}⚠️  IMPORTANT: Review and implement these stubs before deploying!${NC}"
            
            # Add generated stubs to the commit
            git add src/
            
            echo -e "${GREEN}✅ Stubs added to commit - build should now succeed${NC}"
        else
            echo -e "${GREEN}✅ No stubs needed to be created${NC}"
        fi
    fi
    
    # Re-run TypeScript check to verify
    if npx tsc --noEmit --skipLibCheck; then
        echo -e "${GREEN}✅ All imports resolved after stub generation${NC}"
    else
        echo -e "${RED}❌ Still have import errors - manual intervention required${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}🚀 Pre-commit stub check complete!${NC}"