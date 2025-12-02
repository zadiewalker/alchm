# ALCHM App Store Icon Requirements
  
## Critical: 1024x1024 App Store Icon
**Status:** ❌ REQUIRED
- File: app-store-icon.png  
- Size: 1024x1024 pixels
- Format: PNG (no transparency, no rounded corners)
- Usage: App Store listing (MANDATORY for submission)

## Icon Generation Instructions:

### Option 1: Design Tool (Recommended)
1. Create a 1024x1024 design in Figma/Sketch/Adobe XD
2. Use ALCHM brand colors (sage green #a4b792)
3. Include recognizable symbol (journal, leaf, healing symbol)
4. Export as PNG with no transparency
5. Use online icon generator to create all sizes

### Option 2: ImageMagick (if source available)
```bash
# From 1024x1024 source icon
convert source-icon.png -resize 180x180 public/icons/icon-180x180.png
convert source-icon.png -resize 120x120 public/icons/icon-120x120.png
# ... repeat for all sizes
```

### Option 3: Online Icon Generator
1. Visit https://appicon.co or https://makeappicon.com
2. Upload 1024x1024 source icon
3. Download iOS and web icon packages
4. Copy to appropriate directories

## Complete Icon Checklist:
- [❌] app-store-icon.png (1024x1024) - App Store listing (required)
- [✅] icon-180x180.png (180x180) - iPhone app icon (@3x)
- [❌] icon-120x120.png (120x120) - iPhone app icon (@2x)
- [❌] icon-87x87.png (87x87) - iPhone Settings (@3x)
- [❌] icon-80x80.png (80x80) - iPhone Spotlight (@2x)
- [❌] icon-60x60.png (60x60) - iPhone Spotlight (@1x)
- [❌] icon-58x58.png (58x58) - iPhone Settings (@2x)
- [❌] icon-40x40.png (40x40) - iPhone Spotlight (@2x)
- [❌] icon-29x29.png (29x29) - iPhone Settings (@1x)
- [❌] icon-20x20.png (20x20) - iPhone Notification (@1x)
- [❌] icon-167x167.png (167x167) - iPad Pro app icon
- [✅] icon-152x152.png (152x152) - iPad app icon (@2x)
- [❌] icon-76x76.png (76x76) - iPad app icon (@1x)
- [✅] icon-512x512.png (512x512) - PWA large icon
- [✅] icon-192x192.png (192x192) - PWA standard icon
- [✅] icon-144x144.png (144x144) - PWA Android icon
- [✅] icon-128x128.png (128x128) - PWA Windows icon
- [✅] icon-96x96.png (96x96) - PWA small icon
- [✅] icon-72x72.png (72x72) - PWA Android legacy
- [✅] icon-48x48.png (48x48) - PWA minimum size
- [✅] icon-32x32.png (32x32) - Favicon large
- [✅] icon-16x16.png (16x16) - Favicon small
- [❌] apple-touch-icon.png (180x180) - Apple touch icon
