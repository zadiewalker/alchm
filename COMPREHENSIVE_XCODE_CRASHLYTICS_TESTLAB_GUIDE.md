# ALCHM Native iOS App Store Submission Guide
## Complete Xcode Setup, Crashlytics & Test Lab Integration

**Project:** ALCHM - Trauma-informed, AI-powered journaling OS  
**Firebase Project:** alchm-digital-sanctuary  
**Bundle ID:** com.thirtythree6.alchm  
**Current Status:** Next.js PWA with Capacitor iOS setup

---

## 🎯 EXECUTIVE SUMMARY

This guide provides the exact workflow to transform your ALCHM PWA into a native iOS app ready for App Store submission with complete Firebase Crashlytics and Test Lab integration.

**Current Assets Available:**
✅ Capacitor iOS project in `/ios/` directory  
✅ Bundle ID configured: `com.thirtythree6.alchm`  
✅ Firebase project: `alchm-digital-sanctuary`  
✅ Basic app icons and splash screens  
✅ Fastlane configuration for automation

---

## 1. XCODE PROJECT CONFIGURATION

### A. Initial Xcode Setup

```bash
# 1. Navigate to your iOS directory
cd /Users/zadiewalker/Desktop/alchm/ios

# 2. Open the Xcode workspace (NOT .xcodeproj)
open App/App.xcworkspace

# 3. If Xcode asks to update project settings, click "Recommended Settings"
```

### B. Essential Project Settings

**In Xcode Navigator → App target → General:**

| Setting | Value |
|---------|-------|
| Display Name | ALCHM |
| Bundle Identifier | com.thirtythree6.alchm |
| Version | 1.0.0 |
| Build | 1 |
| Minimum Deployments | iOS 13.0 |
| Devices | iPhone, iPad |

### C. Signing & Capabilities Configuration

**1. Signing Settings:**
- Team: Select your Apple Developer Team
- Provisioning Profile: Select "ALCHM Distribution Profile"
- Signing Certificate: "Apple Distribution"

**2. Required Capabilities to Add:**
```
- Push Notifications
- Background Modes
  ☑️ Background processing
  ☑️ Remote notifications
- Associated Domains (for Firebase Dynamic Links)
- App Groups (com.thirtythree6.alchm.group)
```

**3. Privacy Permissions in Info.plist:**
Your package.json already defines these - verify they appear in Info.plist:

```xml
<key>NSCameraUsageDescription</key>
<string>ALCHM needs camera access for journal photo attachments</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>Save journal reflections as PDFs and images</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Attach photos to your journal entries</string>

<key>NSMicrophoneUsageDescription</key>
<string>Record voice notes for your journal (future feature)</string>

<key>NSUserTrackingUsageDescription</key>
<string>Help improve ALCHM's AI insights while protecting your privacy</string>
```

---

## 2. FIREBASE SDK INTEGRATION

### A. Download Firebase Configuration

**Step 1: Get GoogleService-Info.plist**
```bash
# Go to Firebase Console
open https://console.firebase.google.com/project/alchm-digital-sanctuary/settings/general

# Download GoogleService-Info.plist for iOS app
# Save to: /Users/zadiewalker/Desktop/alchm/ios/App/App/GoogleService-Info.plist
```

### B. Add Firebase SDK Dependencies

**Update Podfile** `/Users/zadiewalker/Desktop/alchm/ios/Podfile`:

```ruby
require_relative '../node_modules/@capacitor/ios/scripts/pods_helpers'

platform :ios, '13.0'
use_frameworks!

target 'App' do
  capacitor_pods
  
  # Firebase SDKs - Add these lines
  pod 'Firebase/Analytics'
  pod 'Firebase/Crashlytics'
  pod 'Firebase/Performance'
  pod 'Firebase/RemoteConfig'
  pod 'Firebase/Messaging'
  pod 'Firebase/Auth'
  pod 'Firebase/Firestore'
end

# Build script for Crashlytics
post_install do |installer|
  assertDeploymentTarget(installer)
end
```

**Install Firebase SDKs:**
```bash
cd /Users/zadiewalker/Desktop/alchm/ios
pod install --repo-update
pod update
```

### C. Configure AppDelegate.swift

**Update** `/Users/zadiewalker/Desktop/alchm/ios/App/App/AppDelegate.swift`:

```swift
import UIKit
import Capacitor
import Firebase

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Configure Firebase BEFORE other initializations
        FirebaseApp.configure()
        
        // Enable Firebase Analytics collection
        Analytics.setAnalyticsCollectionEnabled(true)
        
        // Configure Crashlytics for privacy compliance
        Crashlytics.crashlytics().setCrashlyticsCollectionEnabled(true)
        Crashlytics.crashlytics().setUserID(nil) // Anonymous by default
        
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Optional: Log app backgrounding for analytics
        Analytics.logEvent("app_backgrounded", parameters: nil)
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Save any critical data before backgrounding
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Resume operations when returning to foreground
        Analytics.logEvent("app_foregrounded", parameters: nil)
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Resume full operations
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Save data before termination
    }

    func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
```

---

## 3. CRASHLYTICS SETUP & CONFIGURATION

### A. Build Phase for dSYM Upload

**In Xcode:**
1. Select **App** target
2. **Build Phases** tab
3. Click **"+"** → **New Run Script Phase**
4. Name it: **"Firebase Crashlytics"**
5. Add this script:

```bash
# Firebase Crashlytics Build Script
if [ "${CONFIGURATION}" = "Release" ]; then
    "${PODS_ROOT}/FirebaseCrashlytics/run"
fi
```

**Input Files (click + to add each):**
```
${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}/Contents/Resources/DWARF/${TARGET_NAME}
${BUILT_PRODUCTS_DIR}/${INFOPLIST_PATH}
```

### B. Privacy-First Crashlytics Configuration

**Create** `/Users/zadiewalker/Desktop/alchm/ios/App/App/ALCHMCrashlytics.swift`:

```swift
import Foundation
import Firebase

class ALCHMCrashlytics {
    
    static let shared = ALCHMCrashlytics()
    private init() {}
    
    func configure() {
        // Privacy-preserving Crashlytics setup
        Crashlytics.crashlytics().setCrashlyticsCollectionEnabled(true)
        
        // Set custom user identifier (hashed, no PII)
        if let userID = generateAnonymousUserID() {
            Crashlytics.crashlytics().setUserID(userID)
        }
        
        // Set app version for crash grouping
        if let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String {
            Crashlytics.crashlytics().setCustomValue(version, forKey: "app_version")
        }
        
        // Mark as trauma-informed app
        Crashlytics.crashlytics().setCustomValue("trauma_informed", forKey: "app_type")
    }
    
    func logCrisisSafetyEvent(_ event: String) {
        // Log crisis-related events with high priority
        Crashlytics.crashlytics().log("CRISIS_SAFETY: \(event)")
        Crashlytics.crashlytics().setCustomValue(true, forKey: "crisis_context")
    }
    
    func logError(_ error: Error, context: String) {
        // Log non-fatal errors with sanitized context
        let sanitizedContext = sanitizeForPrivacy(context)
        Crashlytics.crashlytics().record(error: error)
        Crashlytics.crashlytics().log("ERROR_CONTEXT: \(sanitizedContext)")
    }
    
    private func generateAnonymousUserID() -> String? {
        // Generate anonymous hash-based user ID
        let deviceID = UIDevice.current.identifierForVendor?.uuidString ?? ""
        return deviceID.sha256
    }
    
    private func sanitizeForPrivacy(_ text: String) -> String {
        // Remove any potential PII or journal content
        var sanitized = text
        
        // Remove email patterns
        let emailRegex = try! NSRegularExpression(pattern: "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}", options: [])
        sanitized = emailRegex.stringByReplacingMatches(in: sanitized, options: [], range: NSRange(location: 0, length: sanitized.count), withTemplate: "[EMAIL_REDACTED]")
        
        // Remove phone patterns
        let phoneRegex = try! NSRegularExpression(pattern: "\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b", options: [])
        sanitized = phoneRegex.stringByReplacingMatches(in: sanitized, options: [], range: NSRange(location: 0, length: sanitized.count), withTemplate: "[PHONE_REDACTED]")
        
        return sanitized
    }
}

extension String {
    var sha256: String {
        let data = self.data(using: .utf8)!
        var hash = [UInt8](repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))
        data.withUnsafeBytes {
            _ = CC_SHA256($0.baseAddress, CC_LONG(data.count), &hash)
        }
        return Data(hash).base64EncodedString()
    }
}
```

### C. Files Required for Crashlytics Upload

**Automatic Upload (Recommended):**
- Build script handles dSYM upload automatically
- Files uploaded from: `./DerivedData/Build/Products/Release-iphoneos/App.app.dSYM`

**Manual Upload (if needed):**
```bash
# Upload dSYMs manually using Firebase CLI
firebase crashlytics:symbols:upload --app=1:YOUR_IOS_APP_ID:ios:YOUR_BUNDLE_ID \
  /Users/zadiewalker/Desktop/alchm/ios/DerivedData/Build/Products/Release-iphoneos/App.app.dSYM
```

**Required Files Structure:**
```
iOS Crashlytics Files:
├── GoogleService-Info.plist (in Xcode project)
├── App.app.dSYM (generated during build)
├── Info.plist (with Firebase configuration)
└── Build logs (in DerivedData/Logs/)
```

---

## 4. TEST LAB CONFIGURATION

### A. Build for Testing

**Create Test Build:**
```bash
cd /Users/zadiewalker/Desktop/alchm/ios

# Build for testing
xcodebuild -workspace App/App.xcworkspace \
  -scheme App \
  -destination generic/platform=iOS \
  -derivedDataPath ./TestingBuild \
  build-for-testing
```

### B. Required Files for Test Lab Upload

**Test Bundle Structure:**
```
ALCHMTestBundle/
├── App_iphoneos*.xctestrun
├── Build/
│   └── Products/
│       ├── Debug-iphoneos/
│       │   ├── App.app/
│       │   └── AppUITests.xctest/
│       └── Release-iphoneos/
│           └── App.app/
```

**Generate Test Bundle:**
```bash
#!/bin/bash
# Create test bundle script

cd /Users/zadiewalker/Desktop/alchm/ios

echo "🧪 Generating ALCHM Test Lab Bundle..."

# Clean previous builds
rm -rf ./ALCHMTestBundle
rm -rf ./TestingBuild

# Build for testing
xcodebuild -workspace App/App.xcworkspace \
  -scheme App \
  -destination generic/platform=iOS \
  -derivedDataPath ./TestingBuild \
  clean build-for-testing

# Create test bundle directory
mkdir -p ALCHMTestBundle

# Copy .xctestrun file
cp ./TestingBuild/Build/Products/*.xctestrun ALCHMTestBundle/

# Copy build products
cp -R ./TestingBuild/Build/Products ALCHMTestBundle/Build/

echo "✅ Test bundle created: ./ALCHMTestBundle/"
echo "📊 Ready for Firebase Test Lab upload"

# List contents
ls -la ALCHMTestBundle/
```

### C. Firebase Test Lab Upload

**Upload to Test Lab:**
```bash
# Install Firebase CLI if not already available
npm install -g firebase-tools

# Authenticate with Firebase
firebase login

# Upload to Test Lab with ALCHM-specific device matrix
firebase test ios run \
  --test ./ALCHMTestBundle/App_iphoneos*.xctestrun \
  --device model=iphone13,version=15.5,locale=en_US,orientation=portrait \
  --device model=iphone12mini,version=15.0,locale=en_US,orientation=portrait \
  --device model=iphonese,version=15.0,locale=en_US,orientation=portrait \
  --device model=ipad6,version=15.0,locale=en_US,orientation=portrait \
  --timeout 10m \
  --results-bucket=gs://alchm-digital-sanctuary_test-results \
  --project alchm-digital-sanctuary
```

---

## 5. COMPLETE BUILD & SUBMISSION WORKFLOW

### A. Pre-Build Checklist

```bash
# 1. Sync Capacitor with latest web build
cd /Users/zadiewalker/Desktop/alchm
npm run build
npx cap sync ios

# 2. Verify Firebase configuration
ls -la ios/App/App/GoogleService-Info.plist

# 3. Check Podfile dependencies
cd ios && pod install
```

### B. Build Process Script

**Create** `/Users/zadiewalker/Desktop/alchm/scripts/ios-production-build.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 ALCHM iOS Production Build Pipeline"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/Users/zadiewalker/Desktop/alchm"
IOS_DIR="$PROJECT_ROOT/ios"
SCHEME="App"
CONFIGURATION="Release"
ARCHIVE_PATH="$IOS_DIR/build/ALCHM.xcarchive"
EXPORT_PATH="$IOS_DIR/build/export"

echo -e "${YELLOW}📱 Building ALCHM for iOS App Store submission...${NC}"

# Step 1: Build web app
echo -e "${YELLOW}🌐 Building Next.js web app...${NC}"
cd "$PROJECT_ROOT"
npm run build

# Step 2: Sync Capacitor
echo -e "${YELLOW}⚡ Syncing Capacitor...${NC}"
npx cap sync ios

# Step 3: Install iOS dependencies
echo -e "${YELLOW}📦 Installing iOS dependencies...${NC}"
cd "$IOS_DIR"
pod install --repo-update

# Step 4: Clean and archive
echo -e "${YELLOW}🏗️ Creating iOS archive...${NC}"
xcodebuild clean archive \
  -workspace App/App.xcworkspace \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -archivePath "$ARCHIVE_PATH" \
  -allowProvisioningUpdates \
  CODE_SIGNING_ALLOWED=YES

# Step 5: Export for App Store
echo -e "${YELLOW}📤 Exporting IPA for App Store...${NC}"
xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_PATH" \
  -exportOptionsPlist App/ExportOptions.plist \
  -allowProvisioningUpdates

# Step 6: Validate IPA
echo -e "${YELLOW}✅ Validating IPA...${NC}"
xcrun altool --validate-app \
  -f "$EXPORT_PATH/ALCHM.ipa" \
  -t ios \
  -u "$APPLE_ID_EMAIL" \
  -p "$APP_SPECIFIC_PASSWORD"

echo -e "${GREEN}🎉 ALCHM iOS build complete!${NC}"
echo -e "${GREEN}📍 Archive: $ARCHIVE_PATH${NC}"
echo -e "${GREEN}📍 IPA: $EXPORT_PATH/ALCHM.ipa${NC}"

# Optional: Upload to App Store Connect
read -p "Upload to App Store Connect? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}📤 Uploading to App Store Connect...${NC}"
    xcrun altool --upload-app \
      -f "$EXPORT_PATH/ALCHM.ipa" \
      -t ios \
      -u "$APPLE_ID_EMAIL" \
      -p "$APP_SPECIFIC_PASSWORD"
    echo -e "${GREEN}✅ Upload complete!${NC}"
fi
```

### C. ExportOptions.plist Configuration

**Update** `/Users/zadiewalker/Desktop/alchm/ios/App/ExportOptions.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>uploadSymbols</key>
    <true/>
    <key>uploadBitcode</key>
    <false/>
    <key>compileBitcode</key>
    <false/>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>destination</key>
    <string>upload</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>provisioningProfiles</key>
    <dict>
        <key>com.thirtythree6.alchm</key>
        <string>ALCHM Distribution</string>
    </dict>
</dict>
</plist>
```

---

## 6. APP STORE CONNECT CONFIGURATION

### A. App Information Setup

**Bundle ID Registration:**
1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Register `com.thirtythree6.alchm` if not already registered
3. Enable capabilities:
   - App Groups
   - Associated Domains
   - Push Notifications
   - Background Modes

**App Store Connect Setup:**
1. Go to https://appstoreconnect.apple.com/apps
2. Create new app with Bundle ID: `com.thirtythree6.alchm`
3. Set age rating: **17+** (for mature mental health content)

### B. Required Metadata

**App Information:**
- **Name:** ALCHM
- **Subtitle:** Trauma-informed journaling & healing
- **Category:** Health & Fitness
- **Age Rating:** 17+
- **Price:** Free (with in-app purchases)

**Privacy Policy URL:**
```
https://alchm-digital-sanctuary.web.app/privacy-policy.html
```

**Support URL:**
```
https://alchm-digital-sanctuary.web.app
```

---

## 7. TESTING & VALIDATION

### A. Pre-Submission Testing

**Crisis Safety Testing:**
```swift
// Add this to test crash reporting works
import Firebase

// In a test function (remove before production):
func testCrashlytics() {
    ALCHMCrashlytics.shared.logCrisisSafetyEvent("Testing crisis safety reporting")
    
    // Force a test crash (REMOVE BEFORE PRODUCTION)
    // fatalError("Test crash for Crashlytics verification")
}
```

**Test Lab Scenarios:**
- Crisis resource access
- Emergency calling functionality
- Offline mode functionality
- Rapid navigation (stress testing)
- Accessibility with VoiceOver

### B. Validation Checklist

**Before Submission:**
- [ ] Crashlytics receiving test data
- [ ] dSYM files uploading correctly
- [ ] Test Lab tests passing on all devices
- [ ] Privacy policy accessible from app
- [ ] All required App Store metadata complete
- [ ] Screenshots uploaded (6.5", 5.5", 12.9" iPad)
- [ ] App icon validated (1024x1024)
- [ ] Age rating set to 17+
- [ ] Crisis support resources functional

---

## 8. SPECIFIC FILE LOCATIONS SUMMARY

### A. Files to Upload to Crashlytics
```
Automatic Upload via Build Script:
📁 /Users/zadiewalker/Desktop/alchm/ios/DerivedData/Build/Products/Release-iphoneos/App.app.dSYM

Manual Upload Files:
📄 GoogleService-Info.plist
📄 App.app.dSYM (symbol file)
📄 Build logs from DerivedData/Logs/
```

### B. Files for Test Lab
```
Test Bundle Location:
📁 /Users/zadiewalker/Desktop/alchm/ios/ALCHMTestBundle/

Required Files:
📄 App_iphoneos*.xctestrun
📁 Build/Products/Debug-iphoneos/App.app
📄 Build/Products/Debug-iphoneos/AppUITests.xctest
```

### C. Distribution Files
```
Archive Location:
📄 /Users/zadiewalker/Desktop/alchm/ios/build/ALCHM.xcarchive

Distribution Files:
📄 /Users/zadiewalker/Desktop/alchm/ios/build/export/ALCHM.ipa
📄 /Users/zadiewalker/Desktop/alchm/ios/App/ExportOptions.plist
```

---

## 9. AUTOMATED EXECUTION COMMANDS

### A. Complete Build & Upload Process

```bash
# Make scripts executable
chmod +x /Users/zadiewalker/Desktop/alchm/scripts/ios-production-build.sh

# Set environment variables
export APPLE_ID_EMAIL="your-apple-id@email.com"
export APP_SPECIFIC_PASSWORD="your-app-specific-password"

# Execute complete build pipeline
cd /Users/zadiewalker/Desktop/alchm
./scripts/ios-production-build.sh
```

### B. Test Lab Execution

```bash
# Generate test bundle and run Test Lab
cd /Users/zadiewalker/Desktop/alchm/ios

# Generate test bundle
./generate-test-bundle.sh

# Upload to Test Lab
firebase test ios run \
  --test ./ALCHMTestBundle/App_iphoneos*.xctestrun \
  --device model=iphone13,version=15.5 \
  --timeout 10m \
  --project alchm-digital-sanctuary
```

---

## 10. TROUBLESHOOTING GUIDE

### Common Issues & Solutions

**1. dSYM Upload Fails:**
```bash
# Verify dSYM exists
ls -la ./DerivedData/Build/Products/Release-iphoneos/App.app.dSYM

# Manual upload with verbose logging
"${PODS_ROOT}/FirebaseCrashlytics/upload-symbols" \
  -gsp ./App/App/GoogleService-Info.plist \
  -p ios \
  ./path/to/App.app.dSYM
```

**2. Signing Issues:**
- Verify Apple Developer Team membership
- Check provisioning profile includes all devices
- Ensure certificates installed in Keychain
- Update bundle identifier if needed

**3. Test Lab Upload Problems:**
```bash
# Check file permissions
chmod +r ALCHMTestBundle/*.xctestrun
chmod -R +r ALCHMTestBundle/Build/

# Verify Firebase project access
firebase projects:list
firebase use alchm-digital-sanctuary
```

**4. Crashlytics Not Receiving Data:**
- Verify GoogleService-Info.plist in Xcode project
- Check Firebase project settings
- Ensure Crashlytics enabled in Firebase console
- Verify build script runs in Release configuration

---

## 🎉 COMPLETION CHECKLIST

**Pre-Submission Verification:**
- [ ] Xcode project opens without errors
- [ ] Firebase SDKs installed via CocoaPods
- [ ] GoogleService-Info.plist added to project
- [ ] Build script for Crashlytics configured
- [ ] Test crashes appear in Firebase Console
- [ ] Test Lab runs complete successfully
- [ ] IPA builds and validates without errors
- [ ] App Store Connect metadata complete
- [ ] Privacy policy accessible
- [ ] Crisis support resources functional

**Ready for App Store Submission when all items checked ✅**

---

This guide provides the complete, step-by-step workflow to transform your ALCHM PWA into a native iOS app with full Firebase integration, ready for App Store submission with comprehensive crash reporting and testing capabilities.