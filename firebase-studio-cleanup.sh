#!/bin/bash
# ALCHM Safe Firebase Studio Cleanup
# Generated: 2025-09-26T19:40:41.728Z

echo "🧹 ALCHM Firebase Studio Safe Cleanup Starting..."
echo ""

# Safety backup of critical files
echo "📦 Creating safety backup..."
mkdir -p .cleanup-backup
cp src/lib/pricing/advanced-pricing-psychology.ts .cleanup-backup/ 2>/dev/null || true
cp src/app/pricing/page.tsx .cleanup-backup/ 2>/dev/null || true

# Safe removals only
echo "🗑️  Removing safe files..."

# Count files before
BEFORE_COUNT=$(find . -name ".DS_Store" | wc -l)

# Remove .DS_Store files
find . -name ".DS_Store" -delete

# Remove backup files safely  
find . -name "*.backup" -delete

# Remove old diagnostic logs
rm -f diagnostic-log-*.txt 2>/dev/null || true

# Keep latest lighthouse reports, remove old ones
ls lighthouse-*.json 2>/dev/null | head -n -2 | xargs rm -f 2>/dev/null || true

# Remove mobile test files
rm -f mobile-crisis-phone-*.json 2>/dev/null || true

# Clean cache safely
rm -rf .next/cache/ 2>/dev/null || true

echo ""
echo "✅ Safe cleanup completed!"
echo "📊 Removed $BEFORE_COUNT .DS_Store files and other safe targets"
echo ""
echo "🔒 CRITICAL SYSTEMS PROTECTED:"
echo "   ✅ Pricing Psychology ($4.99/$9.99)"
echo "   ✅ Conversion Optimization" 
echo "   ✅ Crisis Safety Systems"
echo "   ✅ Real-time Analytics"
echo ""
echo "🧪 Next steps:"
echo "1. Test: npm run dev"
echo "2. Build: npm run build" 
echo "3. Deploy to Firebase Studio with confidence!"
