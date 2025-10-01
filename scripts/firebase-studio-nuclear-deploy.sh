#!/bin/bash

# FIREBASE STUDIO NUCLEAR CACHE BYPASS DEPLOYMENT
# FORCES FRESH CONFIGURATION READ

set -e

echo "🚨 FIREBASE STUDIO NUCLEAR CACHE BYPASS STARTING..."

# Step 1: Replace apphosting.yaml with nuclear version
echo "📁 Backing up current apphosting.yaml..."
cp apphosting.yaml apphosting.yaml.backup

echo "🔥 Deploying NUCLEAR cache-busting configuration..."
cp apphosting-nuclear.yaml apphosting.yaml

# Step 2: Force Firebase CLI refresh
echo "🔄 Forcing Firebase CLI cache refresh..."
firebase logout 2>/dev/null || true
firebase login --reauth

# Step 3: Create new backend (forces fresh configuration)
echo "🆕 Creating new backend configuration..."
firebase apphosting:backends:create alchm-nuclear-backend \
  --project=alchm-digital-sanctuary \
  --location=us-central1 \
  --repository=https://github.com/zadiewalker/alchm \
  --branch=main 2>/dev/null || true

# Step 4: Deploy with nuclear configuration
echo "🚀 Deploying with nuclear configuration..."
firebase deploy --only apphosting:alchm-nuclear-backend --project=alchm-digital-sanctuary

echo "✅ NUCLEAR DEPLOYMENT COMPLETE!"
echo "🔗 Check Firebase Console for new backend status"
echo "📱 Backend: alchm-nuclear-backend"