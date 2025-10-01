# 📱 ALCHM iOS App Store Submission Guide
**Complete Xcode & TestFlight Workflow**

---

## 🎯 Prerequisites Checklist

### Required Setup
- [ ] macOS with latest Xcode installed (15.0+)
- [ ] Active Apple Developer Account ($99/year)
- [ ] Node.js 20+ and npm/pnpm installed
- [ ] ALCHM PWA running locally on `localhost:3000`
- [ ] App icons (1024x1024 PNG + various sizes)
- [ ] Screenshots for all device sizes
- [ ] Privacy Policy URL ready
- [ ] App description and keywords prepared

### Required Files
- [ ] `icon-1024.png` (App Store icon)
- [ ] `icon-512.png`, `icon-192.png`, `icon-180.png` (various sizes)
- [ ] Launch screen assets
- [ ] Privacy policy accessible URL
- [ ] App Store screenshots (iPhone 6.7", 5.5", iPad Pro)

---

## 📦 Part 1: PWA to iOS App Conversion

### Step 1: Install Capacitor

```bash
# Navigate to your ALCHM project root
cd /path/to/alchm

# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Initialize Capacitor in your project
npx cap init "ALCHM" "com.alchm.identity" --web-dir="out"

# Install iOS platform
npm install @capacitor/ios @capacitor/core

# Add iOS platform
npx cap add ios
```

### Step 2: Configure Capacitor

Create `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alchm.identity',
  appName: 'ALCHM',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'ALCHM',
    contentInset: 'automatic',
    backgroundColor: '#1a1a1a',
    allowsLinkPreview: false,
    preferredContentMode: 'mobile',
    scrollEnabled: true,
    allowNavigationGestures: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#8b5cf6',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a1a'
    },
    Keyboard: {
      resize: 'ionic',
      style: 'dark'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
```

### Step 3: Install Required Capacitor Plugins

```bash
# Core plugins for PWA functionality
npm install @capacitor/status-bar @capacitor/splash-screen @capacitor/keyboard @capacitor/haptics @capacitor/share @capacitor/filesystem @capacitor/device @capacitor/network @capacitor/push-notifications @capacitor/local-notifications

# Optional: Add Firebase plugin for native features
npm install @capacitor-firebase/analytics @capacitor-firebase/crashlytics @capacitor-firebase/performance
```

### Step 4: Update Next.js Configuration

Update `next.config.js` for iOS compatibility:

```javascript
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  
  // Output configuration for Capacitor
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  
  // Disable image optimization for Capacitor
  images: {
    unoptimized: true
  },

  // Capacitor iOS compatibility
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : '',
  
  // Ensure SPA behavior for mobile app
  experimental: {
    esmExternals: false
  },

  // iOS-specific webpack config
  webpack: (config, { dev, isServer }) => {
    // Capacitor iOS requires specific asset handling
    if (!dev && !isServer) {
      config.output.publicPath = './';
    }
    
    return config;
  }
};

module.exports = nextConfig;
```

### Step 5: Build and Sync PWA

```bash
# Build the Next.js app for production
npm run build

# Copy web assets to native project
npx cap copy ios

# Sync any plugin changes
npx cap sync ios
```

---

## 🍎 Part 2: Xcode Configuration & Build

### Step 6: Open Project in Xcode

```bash
# Open the iOS project in Xcode
npx cap open ios

# Alternative: Open manually
open ios/App/App.xcworkspace
```

### Step 7: Configure App Identity & Settings

#### 📱 General Tab Configuration
1. **Open Xcode** → Select `App` target → `General` tab
2. **Bundle Identifier**: `com.alchm.identity`
3. **Version**: `1.0.0` (Marketing version)
4. **Build**: `1` (Build number - increment for each submission)
5. **Display Name**: `ALCHM`
6. **Deployment Target**: `iOS 14.0`
7. **Device Orientation**: Portrait, Landscape Left, Landscape Right
8. **Status Bar Style**: Default
9. **Hide Status Bar**: Unchecked
10. **Requires Full Screen**: Checked

#### 🎨 App Icons & Assets
1. **App Icons**: 
   - Click on `App` → `Images.xcassets` → `AppIcon`
   - Drag `icon-1024.png` to the 1024x1024 slot
   - Xcode will auto-generate other sizes
   
2. **Launch Screen**:
   - Select `LaunchScreen.storyboard`
   - Add ALCHM logo and purple background (#8b5cf6)
   - Set constraints for center alignment

#### ⚙️ Info.plist Configuration
Add to `ios/App/App/Info.plist`:

```xml
<key>NSUserTrackingUsageDescription</key>
<string>ALCHM uses analytics to improve your mental health journaling experience and provide personalized insights.</string>

<key>NSCameraUsageDescription</key>
<string>ALCHM needs camera access to allow you to capture moments for your journal entries.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>ALCHM needs photo library access to attach images to your journal entries.</string>

<key>NSMicrophoneUsageDescription</key>
<string>ALCHM may use microphone access for voice journaling features (future update).</string>

<key>CFBundleDisplayName</key>
<string>ALCHM</string>

<key>CFBundleShortVersionString</key>
<string>1.0.0</string>

<key>CFBundleVersion</key>
<string>1</string>

<key>LSRequiresIPhoneOS</key>
<true/>

<key>UIRequiredDeviceCapabilities</key>
<array>
    <string>armv7</string>
</array>

<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
</array>

<key>UILaunchStoryboardName</key>
<string>LaunchScreen</string>

<key>UIMainStoryboardFile</key>
<string>Main</string>

<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

### Step 8: Team & Signing Configuration

#### 🔐 Signing & Capabilities Tab
1. **Team**: Select your Apple Developer Team
2. **Bundle Identifier**: Confirm `com.alchm.identity`
3. **Automatically manage signing**: ✅ Checked
4. **Signing Certificate**: Apple Development/Distribution (auto-selected)

#### 📋 Add Required Capabilities
1. Click `+ Capability` and add:
   - **Push Notifications** (for crisis alerts)
   - **Background Modes** → Background fetch, Background processing
   - **Associated Domains** (for universal links)
   - **App Groups** (if needed for widgets)

### Step 9: Build Settings Optimization

#### 🎯 Build Settings Tab
1. **Search for "Dead Code Stripping"** → Set to `Yes`
2. **Search for "Strip Debug Symbols"** → Set to `Yes` for Release
3. **Search for "Optimize"** → Set to `Speed [-O3]` for Release
4. **Architectures** → `$(ARCHS_STANDARD)`
5. **Valid Architectures** → `arm64 armv7s armv7`

---

## 🚀 Part 3: Build & Archive for TestFlight

### Step 10: Configure for Release Build

#### 📱 Change Build Configuration
1. **Product Menu** → **Scheme** → **Edit Scheme**
2. **Run** → **Build Configuration** → Change to `Release`
3. **Archive** → **Build Configuration** → Confirm `Release`
4. Click **Close**

### Step 11: Create Archive

```bash
# Clean previous builds
# In Xcode: Product → Clean Build Folder (⌘+Shift+K)

# Build for Archive
# In Xcode: Product → Archive (⌘+⇧+B then ⌘+⇧+A)
```

#### 📦 Archive Process (GUI Steps)
1. **Product** → **Archive** (or `⌘+Shift+B`)
2. Wait for build to complete (may take 5-10 minutes first time)
3. **Organizer** window will open automatically
4. Your archive appears in the list

### Step 12: Upload to App Store Connect

#### 📤 Distribution Process
1. In **Organizer**, select your ALCHM archive
2. Click **Distribute App**
3. Choose **App Store Connect**
4. Click **Next**
5. Choose **Upload** (not Export)
6. Select your **Team**
7. **App Store Connect Distribution Options**:
   - ✅ Include bitcode
   - ✅ Upload your app's symbols
   - ✅ Manage Version and Build Number
8. Click **Next**
9. **Re-sign** → Select Automatically manage signing
10. Click **Upload**
11. Wait for upload (10-30 minutes depending on connection)

---

## 📋 Part 4: App Store Connect Setup

### Step 13: Create App in App Store Connect

#### 🌐 App Store Connect Portal
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. **My Apps** → **+ (Add App)**
3. **New App Form**:
   - **Platform**: iOS
   - **Name**: ALCHM
   - **Primary Language**: English (US)
   - **Bundle ID**: com.alchm.identity
   - **SKU**: ALCHM-001 (unique identifier)
4. Click **Create**

### Step 14: Configure App Information

#### 📝 App Information Tab
```
Name: ALCHM
Subtitle: Trauma-Informed AI Journaling
Privacy Policy URL: https://alchm-digital-sanctuary.web.app/privacy
Category: Primary: Health & Fitness, Secondary: Medical
Age Rating: 17+ (Medical/Treatment Information)
```

#### 🖼️ App Store Screenshots & Media
**Required Screenshots** (use Simulator or device):
- iPhone 6.7" (Pro Max): 1290 × 2796 pixels
- iPhone 5.5": 1242 × 2208 pixels  
- 12.9" iPad Pro: 2048 × 2732 pixels

**App Preview Video** (Optional but recommended):
- 30-second video showing key features
- Portrait orientation
- No audio narration (subtitles OK)

#### 📱 App Description
```
Discover healing through AI-powered, trauma-informed journaling.

ALCHM combines cutting-edge artificial intelligence with evidence-based therapeutic principles to create a safe digital sanctuary for personal growth and emotional processing.

🧠 TRAUMA-INFORMED AI
Our specialized AI understands the complexity of healing and provides insights rooted in trauma-informed care principles.

✨ KEY FEATURES
• Intelligent journal analysis with personalized insights
• Crisis detection and immediate support resources  
• Mood tracking with pattern recognition
• Multi-language support (6 languages)
• End-to-end encrypted for complete privacy
• Offline-capable for journaling anywhere

🎯 THREE TIERS FOR EVERY NEED
• Free: Basic journaling with AI insights
• Deep Cut ($4.99/month): Advanced analytics & unlimited storage
• Oracle ($9.99/month): AI mentor conversations & premium features

🛡️ PRIVACY & SAFETY FIRST
ALCHM is built with mental health privacy standards, GDPR compliance, and includes 24/7 crisis support resources.

Start your healing journey today with AI that understands, protects, and empowers your growth.
```

**Keywords**: `journaling,mental health,AI,therapy,trauma,mindfulness,wellness,self-care,meditation,mood`

### Step 15: TestFlight Configuration

#### 🧪 TestFlight Tab Setup
1. **Build** → Select uploaded build (may take 1-2 hours to process)
2. **Test Information**:
   - **Beta App Name**: ALCHM Beta
   - **Beta App Description**: 
     ```
     Help us test ALCHM's trauma-informed AI journaling features.
     
     Focus areas for testing:
     • Journal entry creation and AI insights
     • Mood tracking accuracy
     • Crisis support resource access
     • Overall app performance and usability
     
     Please report any bugs or feedback through the app's feedback feature.
     ```
   - **Feedback Email**: beta@alchm.app
   - **What to Test**: Focus on core journaling features and AI insights

#### 👥 Add Internal Testers
1. **TestFlight Users** → **Internal Testing**
2. **Add Team Members**:
   - Add Apple Developer team members
   - They can test immediately after build approval

#### 🌍 External Testing Setup
1. **External Testing** → **Add Group**
2. **Group Name**: ALCHM Beta Testers
3. **Add Testers** (up to 10,000):
   - Add email addresses manually
   - Or share public link: TestFlight Public Link
4. **Submit for Beta App Review** (Apple review required)

---

## ✅ Part 5: Submission Checklist

### Pre-Submission Final Checks

#### 🔍 Technical Validation
```bash
# Verify app builds and runs
npx cap run ios

# Test core features
- [ ] User registration/login
- [ ] Journal entry creation
- [ ] AI insight generation  
- [ ] Crisis support access
- [ ] Offline functionality
- [ ] Payment integration (if applicable)

# Performance testing
- [ ] App launches in <3 seconds
- [ ] Smooth scrolling and animations
- [ ] No memory leaks or crashes
- [ ] Works on iPhone and iPad
```

#### 📋 App Store Requirements
- [ ] App follows Human Interface Guidelines
- [ ] No placeholder content or Lorem ipsum
- [ ] All features described in app description work
- [ ] Privacy policy accessible and accurate
- [ ] Age rating matches content (17+ for medical)
- [ ] No broken links or non-functional features

#### 🛡️ Privacy & Compliance
- [ ] Privacy policy covers AI data processing
- [ ] COPPA compliance for users under 13
- [ ] GDPR compliance for EU users
- [ ] Health data handling disclosed
- [ ] Crisis intervention protocols documented

### Step 16: Submit for App Store Review

#### 📤 Final Submission
1. **App Store** tab in App Store Connect
2. **Version Information**:
   - **Version**: 1.0.0
   - **Copyright**: 2025 ALCHM, Inc.
3. **App Review Information**:
   - **Contact Information**: Your details
   - **Demo Account**: Create test account if needed
   - **Notes**: 
     ```
     ALCHM is a trauma-informed AI journaling app focused on mental health support.
     
     Key features for review:
     • AI-powered journal analysis with mental health focus
     • Crisis detection and resource provision
     • Secure, encrypted data handling
     • Subscription-based premium features
     
     Test account: demo@alchm.app / TestPass123
     ```
4. **Version Release**: Select release option
5. **Submit for Review**

---

## 🎯 Expected Timeline

### Review Process
- **TestFlight Beta Review**: 24-48 hours
- **App Store Review**: 7-14 days (first submission)
- **Resubmissions**: 2-7 days

### Common Rejection Reasons & Solutions
1. **Guideline 2.1 - App Completeness**
   - Solution: Ensure all features work and no placeholder content
2. **Guideline 5.1.1 - Privacy**
   - Solution: Complete privacy policy covering AI and health data
3. **Guideline 1.2 - Safety - User Generated Content**
   - Solution: Implement content moderation for crisis prevention

---

## 📞 Support Resources

### Apple Developer Support
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### ALCHM-Specific Resources
- **Technical Documentation**: `TECHNICAL_OVERVIEW.md`
- **Privacy Policy**: `https://alchm-digital-sanctuary.web.app/privacy`
- **Crisis Support**: Crisis intervention protocols documented

---

**🎉 Congratulations! Your ALCHM iOS app is now submitted to the App Store!**

Monitor the review status in App Store Connect and be prepared to respond to any feedback from Apple's review team within 7 days to maintain your review timeline.