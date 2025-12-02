# ALCHM Build Update Instructions - Jony Ive Dashboard Improvements

## Changes Made ✨

We've implemented Jony Ive-inspired dashboard improvements with "quiet distinction":

### Dashboard Card Improvements:
- **Primary Action (Write Now):** `border-gray-100 hover:border-gray-200 ring-1 ring-black/[0.02] hover:ring-black/[0.04]`
- **Secondary Cards:** `border-gray-100/70 hover:border-gray-200/90 ring-1 ring-black/[0.01] hover:ring-black/[0.02] backdrop-blur-sm`
- **Recent Entry Card:** `border-gray-100/60 hover:border-gray-200/80 ring-1 ring-black/[0.015] hover:ring-black/[0.025]`

These create layered materiality - each element has subtle but distinct presence, maintaining the sanctuary aesthetic while improving visual hierarchy.

## Build Steps

### Step 1: Install Dependencies
```bash
cd /Users/zadiewalker/Desktop/alchm
npm install
```

### Step 2: Update Build Version
Update `ios/App/App/Info.plist`:
- Increment `CFBundleShortVersionString` if this is a feature update
- Increment `CFBundleVersion` (build number) - this should be higher than your current build (currently Build #4)

Suggested version bump:
- Version: `1.0.0` → `1.0.1` (minor improvement)
- Build: `4` → `5`

### Step 3: Test Build Locally
```bash
npm run build
```
Verify no errors before proceeding.

### Step 4: Build for iOS

#### Option A: Using Capacitor (Recommended)
```bash
# Build web assets
npm run build

# Copy to iOS
npx cap copy ios

# Sync native changes
npx cap sync ios

# Open in Xcode
npx cap open ios
```

#### Option B: Direct Xcode
If you already have the iOS project set up:
1. Open `ios/App/App.xcworkspace` in Xcode
2. Select your team and signing certificate
3. Build the project

### Step 5: Archive and Upload

In Xcode:
1. **Set Scheme to "Any iOS Device (arm64)"**
2. **Product → Archive**
3. Wait for build to complete
4. **Distribute App → App Store Connect**
5. Upload and wait for processing

### Step 6: Submit to TestFlight

In App Store Connect:
1. Go to **My Apps → ALCHM → TestFlight**
2. Find your new build (Build #5)
3. Add **What to Test** information:

```
Build #5 - Jony Ive Design Improvements

✨ DASHBOARD ENHANCEMENTS:
• Refined card borders with "quiet distinction" 
• Improved visual hierarchy through layered materiality
• Enhanced button states with subtle ring shadows
• Maintained sanctuary aesthetic with purposeful differentiation

🔧 TECHNICAL IMPROVEMENTS:
• Better visual separation between dashboard elements
• Improved hover states for better interaction feedback
• Maintained trauma-informed design principles
• Preserved sage green brand colors

TESTING FOCUS:
- Dashboard navigation and visual clarity
- Card border visibility and elegance
- Overall aesthetic feels refined but still sanctuary-like
- No accessibility regressions

Previous Build #4 changes also included:
✅ Dashboard card borders (subtle white borders)
✅ Fixed Past Entries loading issue  
✅ Fixed Pathways loading issue
✅ Real analytics only (no fabricated metrics)
✅ Simplified Premium Features
```

4. **Save and Submit** for review

### Step 7: Invite Testers

Update your existing internal testers:
- Send them notification that Build #5 is available
- Focus testing on dashboard visual improvements
- Collect feedback on the refined aesthetics

## Release Notes Template

For future App Store release:

```
🎨 DESIGN REFINEMENTS

This update includes subtle but meaningful visual improvements to the ALCHM dashboard:

• Enhanced visual distinction between dashboard cards while maintaining our sanctuary aesthetic
• Refined interaction states with gentle hover feedback
• Improved visual hierarchy through layered design elements
• Preserved trauma-informed design principles throughout

These improvements create a more polished experience while keeping ALCHM's core mission of providing a safe space for emotional growth.

Continue your journey toward deeper self-understanding with ALCHM's 7-perspective AI companion.
```

## Verification Checklist

After upload to TestFlight:

- [ ] Build appears in App Store Connect
- [ ] Build status shows "Ready to Test"
- [ ] Internal testers can download and install
- [ ] Dashboard cards show improved visual distinction
- [ ] Hover states work properly on interactive elements
- [ ] No visual regressions on other pages
- [ ] Crisis resources still easily accessible
- [ ] App maintains sanctuary-like feeling

## Rollback Plan

If issues are found:
1. Build #4 remains available as fallback
2. Can revert card styling by changing borders back to `border-white/25`
3. Previous version maintains all functionality

## Next Steps

Once Build #5 is validated:
1. Continue with existing TestFlight roadmap
2. Prepare for public App Store submission
3. Consider additional Jony Ive-inspired refinements for future builds

---

**The essence of these improvements:** We've created distinction through restraint - each dashboard element now has presence without being aggressive, maintaining the calm that makes ALCHM special while improving usability.

*"The elegance is in the subtlety."* - Jony Ive approach applied to trauma-informed design.