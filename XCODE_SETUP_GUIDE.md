# ALCHM Xcode Setup Guide 🍎

## Overview

This guide will help you convert ALCHM from a Progressive Web App (PWA) to a native iOS app using Xcode for App Store submission. We'll use the most reliable method: Capacitor by Ionic.

## 🛠️ Method 1: Capacitor (Recommended)

Capacitor is specifically designed for converting web apps to native iOS apps and provides excellent PWA compatibility.

### Step 1: Install Capacitor
```bash
cd /Users/zadiewalker/Desktop/alchm

# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Install Capacitor in your project
npm install @capacitor/core @capacitor/ios

# Initialize Capacitor
npx cap init alchm com.alchm.app
```

### Step 2: Configure Capacitor
Create or update `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alchm.app',
  appName: 'ALCHM',
  webDir: 'out', // Next.js static export directory
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    presentationStyle: 'fullscreen'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#f7f7f2",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#a4b792'
    }
  }
};

export default config;
```

### Step 3: Build Static Version
```bash
# Update next.config.js to enable static export
# Add this to your existing config:
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

# Build static version
npm run build

# Copy build output to 'out' directory if not already there
# Next.js static export should create this automatically
```

### Step 4: Add iOS Platform
```bash
# Add iOS platform
npx cap add ios

# Copy web assets to native project
npx cap copy

# Sync changes
npx cap sync
```

### Step 5: Open in Xcode
```bash
# This will open Xcode with your iOS project
npx cap open ios
```

## 🍎 Method 2: PWABuilder (Alternative)

If Capacitor doesn't work, PWABuilder is another excellent option.

### Step 1: Use PWABuilder Online
1. Go to https://pwabuilder.com
2. Enter your URL: `https://alchmapp.web.app`
3. Click "Start" and let it analyze your PWA
4. Click "Build My PWA"
5. Select "iOS" platform
6. Download the generated iOS package

### Step 2: Extract and Open
1. Extract the downloaded ZIP file
2. Navigate to the iOS folder
3. Double-click the `.xcodeproj` file to open in Xcode

## 📱 Xcode Configuration

Once you have the project open in Xcode:

### Step 1: Configure Project Settings
1. **Select your project** in the navigator
2. **General tab:**
   - Display Name: `ALCHM`
   - Bundle Identifier: `com.alchm.app`
   - Version: `1.0.0`
   - Build: `1`
   - Deployment Target: `iOS 13.0`

### Step 2: Configure App Icons
1. **Select Assets.xcassets**
2. **Click on AppIcon**
3. **Drag your icon files** from `/app-store-assets/icons/` to the appropriate slots:
   - 20pt: icon-20x20.png, icon-40x40.png, icon-60x60.png
   - 29pt: icon-29x29.png, icon-58x58.png, icon-87x87.png
   - 40pt: icon-40x40.png, icon-80x80.png, icon-120x120.png
   - 60pt: icon-120x120.png, icon-180x180.png
   - iPad sizes as needed

### Step 3: Configure Info.plist
Add these entries to `Info.plist`:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
<key>UIRequiredDeviceCapabilities</key>
<array>
    <string>armv7</string>
</array>
<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationPortraitUpsideDown</string>
</array>
<key>CFBundleDisplayName</key>
<string>ALCHM</string>
<key>CFBundleName</key>
<string>ALCHM</string>
```

### Step 4: Configure Signing
1. **Select your project → Signing & Capabilities**
2. **Team:** Select your Apple Developer account
3. **Bundle Identifier:** Ensure it's `com.alchm.app`
4. **Automatically manage signing:** Check this box

## 🚀 Building for App Store

### Step 1: Build Archive
1. **Select target device:** "Any iOS Device (arm64)"
2. **Product menu → Archive**
3. Wait for build to complete (may take 5-10 minutes)

### Step 2: Upload to App Store Connect
1. **Window → Organizer** (opens automatically after archive)
2. **Select your archive → Distribute App**
3. **App Store Connect → Next**
4. **Upload → Next**
5. **Automatically manage signing → Next**
6. **Upload**

### Step 3: Monitor Upload
- Check App Store Connect for processing status
- Usually takes 10-30 minutes to process
- You'll get an email when ready for submission

## 🔧 Troubleshooting Common Issues

### Issue: Build Fails
```bash
# Clean build folder
Product → Clean Build Folder

# Reset Capacitor
npx cap sync ios
```

### Issue: Icon Missing
- Ensure all icon sizes are provided
- Icons must be PNG format
- No transparency allowed for app icons

### Issue: Info.plist Errors
- Check bundle identifier matches App Store Connect
- Verify all required permissions are set

### Issue: Signing Problems
- Verify Apple Developer account is active
- Check bundle ID is registered in developer portal
- Ensure certificates are valid

## 📋 Pre-Submission Checklist

Before submitting to App Store:

- [ ] **App builds successfully** without errors
- [ ] **All icons are properly set** in all required sizes
- [ ] **App launches and loads** your web content
- [ ] **Crisis button works** (calls 988)
- [ ] **Navigation functions** properly
- [ ] **Offline features** work as expected
- [ ] **Bundle ID matches** App Store Connect setup

## 🎯 Quick Start Commands

```bash
# If starting fresh with Capacitor:
cd /Users/zadiewalker/Desktop/alchm
npm install -g @capacitor/cli
npm install @capacitor/core @capacitor/ios
npx cap init alchm com.alchm.app
npm run build  # Make sure this creates 'out' directory
npx cap add ios
npx cap copy
npx cap sync
npx cap open ios
```

## 📞 Need Help?

If you encounter issues:

1. **Check Capacitor docs:** https://capacitorjs.com/docs/ios
2. **PWABuilder support:** https://docs.pwabuilder.com/
3. **Apple Developer forums:** https://developer.apple.com/forums/
4. **Xcode help:** Product → Help in Xcode menu

The Capacitor method is recommended because it's specifically designed for this use case and provides excellent integration with PWAs. Your ALCHM app should convert smoothly since it's already PWA-compliant.