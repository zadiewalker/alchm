#!/bin/bash

# ALCHM Icon Generation Script
# Converts the SVG source to all required App Store icon sizes

echo "🎨 ALCHM Icon Generation"
echo "========================="

# Check if ImageMagick is available
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing..."
    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo "Please install ImageMagick:"
        echo "- macOS: brew install imagemagick"
        echo "- Ubuntu: sudo apt-get install imagemagick"
        echo "- Windows: Download from https://imagemagick.org"
        exit 1
    fi
fi

# Source SVG file
SOURCE_SVG="alchm-icon.svg"
if [ ! -f "$SOURCE_SVG" ]; then
    echo "❌ Source SVG not found: $SOURCE_SVG"
    exit 1
fi

echo "📱 Converting SVG to PNG icons..."

# Create output directories
mkdir -p ../icons
mkdir -p ../../public/icons

# App Store and marketing icons
echo "Creating 1024x1024 App Store icon..."
convert "$SOURCE_SVG" -resize 1024x1024 "app-store-icon.png"
cp "app-store-icon.png" "../icons/"
cp "app-store-icon.png" "../../public/icons/"

# iPhone icons
echo "Creating iPhone icons..."
convert "$SOURCE_SVG" -resize 180x180 "icon-180x180.png"
convert "$SOURCE_SVG" -resize 120x120 "icon-120x120.png"
convert "$SOURCE_SVG" -resize 87x87 "icon-87x87.png"
convert "$SOURCE_SVG" -resize 80x80 "icon-80x80.png"
convert "$SOURCE_SVG" -resize 60x60 "icon-60x60.png"
convert "$SOURCE_SVG" -resize 58x58 "icon-58x58.png"
convert "$SOURCE_SVG" -resize 40x40 "icon-40x40.png"
convert "$SOURCE_SVG" -resize 29x29 "icon-29x29.png"
convert "$SOURCE_SVG" -resize 20x20 "icon-20x20.png"

# iPad icons
echo "Creating iPad icons..."
convert "$SOURCE_SVG" -resize 167x167 "icon-167x167.png"
convert "$SOURCE_SVG" -resize 152x152 "icon-152x152.png"
convert "$SOURCE_SVG" -resize 76x76 "icon-76x76.png"

# Web/PWA icons
echo "Creating PWA icons..."
convert "$SOURCE_SVG" -resize 512x512 "icon-512x512.png"
convert "$SOURCE_SVG" -resize 192x192 "icon-192x192.png"
convert "$SOURCE_SVG" -resize 144x144 "icon-144x144.png"
convert "$SOURCE_SVG" -resize 128x128 "icon-128x128.png"
convert "$SOURCE_SVG" -resize 96x96 "icon-96x96.png"
convert "$SOURCE_SVG" -resize 72x72 "icon-72x72.png"
convert "$SOURCE_SVG" -resize 48x48 "icon-48x48.png"
convert "$SOURCE_SVG" -resize 32x32 "icon-32x32.png"
convert "$SOURCE_SVG" -resize 16x16 "icon-16x16.png"

# Apple touch icon
echo "Creating Apple touch icon..."
convert "$SOURCE_SVG" -resize 180x180 "apple-touch-icon.png"

# Copy all icons to public directory
echo "Copying icons to public/icons/..."
cp *.png ../../public/icons/

# Copy critical icons to app-store-assets
echo "Copying key assets to app-store-assets/..."
cp app-store-icon.png ../icons/
cp icon-*.png ../icons/
cp apple-touch-icon.png ../icons/

# Generate icon manifest
echo "📋 Creating icon manifest..."
cat > "icon-manifest.json" << EOF
{
  "name": "ALCHM App Icons",
  "description": "Complete icon set for ALCHM iOS App Store submission",
  "generated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "source": "alchm-icon.svg",
  "icons": {
    "app-store": {
      "file": "app-store-icon.png",
      "size": "1024x1024",
      "purpose": "App Store listing (required)"
    },
    "iphone": {
      "180x180": "icon-180x180.png",
      "120x120": "icon-120x120.png",
      "87x87": "icon-87x87.png",
      "80x80": "icon-80x80.png",
      "60x60": "icon-60x60.png",
      "58x58": "icon-58x58.png",
      "40x40": "icon-40x40.png",
      "29x29": "icon-29x29.png",
      "20x20": "icon-20x20.png"
    },
    "ipad": {
      "167x167": "icon-167x167.png",
      "152x152": "icon-152x152.png",
      "76x76": "icon-76x76.png"
    },
    "pwa": {
      "512x512": "icon-512x512.png",
      "192x192": "icon-192x192.png",
      "144x144": "icon-144x144.png",
      "128x128": "icon-128x128.png",
      "96x96": "icon-96x96.png",
      "72x72": "icon-72x72.png",
      "48x48": "icon-48x48.png",
      "32x32": "icon-32x32.png",
      "16x16": "icon-16x16.png"
    },
    "apple": {
      "touch-icon": "apple-touch-icon.png"
    }
  }
}
EOF

echo "✅ Icon generation complete!"
echo ""
echo "📊 Summary:"
echo "- Generated $(ls *.png | wc -l) PNG icons"
echo "- Copied to public/icons/ and app-store-assets/icons/"
echo "- Created icon-manifest.json"
echo ""
echo "🎯 Critical App Store icon ready: app-store-icon.png (1024x1024)"
echo "🌐 All PWA icons updated"
echo "📱 All iOS device icons generated"
echo ""
echo "Next steps:"
echo "1. Verify app-store-icon.png quality"
echo "2. Update PWA manifest.json to reference new icons"
echo "3. Test icons on actual devices"
echo "4. Begin screenshot capture process"