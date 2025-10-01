#!/bin/bash
# App Icon Validation Script

echo "🔍 Validating App Store Icons..."

ICONS_DIR="public/icons"
REQUIRED_SIZES=(1024 180 167 152 120 76 60 40 29 20)

for size in "${REQUIRED_SIZES[@]}"; do
  PNG_FILE="$ICONS_DIR/icon-$size.png"
  SVG_FILE="$ICONS_DIR/icon-$size.svg"
  
  if [[ -f "$PNG_FILE" ]]; then
    echo "✅ Found PNG: icon-$size.png"
  elif [[ -f "$SVG_FILE" ]]; then
    echo "⚠️  Found SVG: icon-$size.svg (needs PNG conversion)"
  else
    echo "❌ Missing: icon-$size.png"
  fi
done

echo ""
echo "📋 App Store Icon Requirements:"
echo "• All icons must be PNG format"
echo "• No transparency allowed"
echo "• Square aspect ratio"
echo "• High quality (minimum 72 DPI)"
echo "• Follow Apple Human Interface Guidelines"