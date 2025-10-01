#!/bin/bash

# 🚨 EMERGENCY ROLLBACK SCRIPT
# ALCHM Mental Health Platform - Crisis Recovery
# Use ONLY if new credentials cause system failure

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a emergency-rollback.log
}

echo -e "${RED}🚨 EMERGENCY ROLLBACK INITIATED${NC}"
echo "=================================="
echo "⚠️  This will restore previous credentials"
echo "   Use ONLY if new credentials are causing system failures"
echo ""

read -p "Are you sure you want to rollback credentials? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Rollback cancelled"
    exit 0
fi

log "Emergency rollback initiated"

# Find most recent backup
BACKUP_FILE=$(ls -t .env.local.backup.* 2>/dev/null | head -n1)

if [ -z "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ No backup file found${NC}"
    echo "Cannot rollback without backup"
    log "ERROR: No backup file found"
    exit 1
fi

echo "Found backup: $BACKUP_FILE"
echo "Restoring previous environment..."

# Backup current (failed) environment
if [ -f ".env.local" ]; then
    cp .env.local ".env.local.failed.$(date +%Y%m%d_%H%M%S)"
    log "Backed up failed environment"
fi

# Restore backup
cp "$BACKUP_FILE" .env.local
log "Restored environment from $BACKUP_FILE"

echo -e "${GREEN}✅ Environment restored${NC}"

# Test the rollback
echo "Testing rollback..."
if npm run build > rollback-test.log 2>&1; then
    echo -e "${GREEN}✅ Rollback successful - build test passed${NC}"
    log "Rollback successful"
else
    echo -e "${YELLOW}⚠️  Build test failed - check rollback-test.log${NC}"
    log "WARNING: Build test failed after rollback"
fi

echo ""
echo "🏥 CRISIS SYSTEM STATUS"
echo "======================="
echo "1. Start development server: npm run dev"
echo "2. Test crisis detection immediately"
echo "3. Verify AI chat functionality"
echo "4. Check user authentication"
echo ""
echo "If rollback successful, you can retry credential rotation later"
echo "Focus on system stability for vulnerable users first"

log "Emergency rollback completed"