#!/bin/bash
# EMERGENCY: Crisis-optimized build for ALCHM
# Minimal bundle sizes for trauma-informed performance

echo "🚨 EMERGENCY BUILD: Crisis-optimized bundle generation"

# Backup current config
cp next.config.js next.config.js.backup

# Use emergency config
cp next.config.emergency.js next.config.js

# Clean build directory
rm -rf .next

# Build with emergency optimizations
NODE_OPTIONS='--max-old-space-size=4096' \
NEXT_TELEMETRY_DISABLED=1 \
NODE_ENV=production \
npm run build

# Restore original config
mv next.config.js.backup next.config.js

echo "✅ Emergency build complete - check bundle sizes"
echo "📊 Run 'ls -la .next/static/chunks/' to verify chunk sizes"