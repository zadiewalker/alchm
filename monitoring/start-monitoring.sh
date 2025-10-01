#!/bin/bash

echo "🚀 Starting ALCHM Performance Monitoring"

# Check if Node.js is installed
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Error: Node.js is not installed"
    exit 1
fi

# Create log directory
mkdir -p logs

# Start monitoring with log rotation
exec node ../scripts/performance-monitoring-dashboard.js 2>&1 | tee logs/monitoring-$(date +%Y%m%d-%H%M%S).log
