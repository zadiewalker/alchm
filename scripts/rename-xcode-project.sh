#!/bin/bash

# ALCHM Xcode Project Renaming Script
# Renames the iOS project from 'App' to 'ALCHM'

set -e

echo "🔄 Starting Xcode project rename from 'App' to 'ALCHM'..."

# Define paths
IOS_DIR="/Users/zadiewalker/Desktop/alchm/ios"
APP_DIR="$IOS_DIR/App"
NEW_DIR="$IOS_DIR/ALCHM"

# Step 1: Close Xcode if running
echo "📱 Closing Xcode..."
osascript -e 'tell application "Xcode" to quit' 2>/dev/null || echo "Xcode not running"
sleep 2

# Step 2: Backup the current project
echo "💾 Creating backup..."
cp -r "$APP_DIR" "$IOS_DIR/App_backup_$(date +%Y%m%d_%H%M%S)"

# Step 3: Rename directory structure
echo "📁 Renaming directories..."
if [ -d "$APP_DIR" ]; then
    mv "$APP_DIR" "$NEW_DIR"
fi

# Step 4: Rename .xcodeproj
if [ -d "$NEW_DIR/App.xcodeproj" ]; then
    mv "$NEW_DIR/App.xcodeproj" "$NEW_DIR/ALCHM.xcodeproj"
fi

# Step 5: Rename .xcworkspace  
if [ -d "$NEW_DIR/App.xcworkspace" ]; then
    mv "$NEW_DIR/App.xcworkspace" "$NEW_DIR/ALCHM.xcworkspace"
fi

# Step 6: Rename App folder to ALCHM
if [ -d "$NEW_DIR/App" ]; then
    mv "$NEW_DIR/App" "$NEW_DIR/ALCHM"
fi

# Step 7: Update project.pbxproj file
echo "🔧 Updating project references..."
if [ -f "$NEW_DIR/ALCHM.xcodeproj/project.pbxproj" ]; then
    # Replace all instances of "App" with "ALCHM" in project file
    sed -i.backup 's/App\.app/ALCHM.app/g' "$NEW_DIR/ALCHM.xcodeproj/project.pbxproj"
    sed -i.backup 's/Pods_App/Pods_ALCHM/g' "$NEW_DIR/ALCHM.xcodeproj/project.pbxproj"
    sed -i.backup 's/"App"/"ALCHM"/g' "$NEW_DIR/ALCHM.xcodeproj/project.pbxproj"
    sed -i.backup 's/path = App;/path = ALCHM;/g' "$NEW_DIR/ALCHM.xcodeproj/project.pbxproj"
    sed -i.backup 's/name = App;/name = ALCHM;/g' "$NEW_DIR/ALCHM.xcodeproj/project.pbxproj"
fi

# Step 8: Update workspace contents
echo "📋 Updating workspace configuration..."
if [ -f "$NEW_DIR/ALCHM.xcworkspace/contents.xcworkspacedata" ]; then
    sed -i.backup 's/App\.xcodeproj/ALCHM.xcodeproj/g' "$NEW_DIR/ALCHM.xcworkspace/contents.xcworkspacedata"
fi

# Step 9: Update project workspace
if [ -f "$NEW_DIR/ALCHM.xcodeproj/project.xcworkspace/contents.xcworkspacedata" ]; then
    sed -i.backup 's/App\.xcodeproj/ALCHM.xcodeproj/g' "$NEW_DIR/ALCHM.xcodeproj/project.xcworkspace/contents.xcworkspacedata"
fi

# Step 10: Update Info.plist
echo "📄 Updating Info.plist..."
if [ -f "$NEW_DIR/ALCHM/Info.plist" ]; then
    # Update bundle display name and identifier
    plutil -replace CFBundleDisplayName -string "ALCHM" "$NEW_DIR/ALCHM/Info.plist" 2>/dev/null || echo "Could not update CFBundleDisplayName"
    plutil -replace CFBundleName -string "ALCHM" "$NEW_DIR/ALCHM/Info.plist" 2>/dev/null || echo "Could not update CFBundleName"
    plutil -replace CFBundleIdentifier -string "com.alchm.app" "$NEW_DIR/ALCHM/Info.plist" 2>/dev/null || echo "Could not update bundle identifier"
fi

# Step 11: Update scheme files
echo "🎯 Updating scheme files..."
SCHEME_DIR="$NEW_DIR/ALCHM.xcodeproj/xcuserdata/zadiewalker.xcuserdatad/xcschemes"
if [ -f "$SCHEME_DIR/App.xcscheme" ]; then
    mv "$SCHEME_DIR/App.xcscheme" "$SCHEME_DIR/ALCHM.xcscheme"
    sed -i.backup 's/App\.app/ALCHM.app/g' "$SCHEME_DIR/ALCHM.xcscheme"
    sed -i.backup 's/"App"/"ALCHM"/g' "$SCHEME_DIR/ALCHM.xcscheme"
fi

# Step 12: Update Podfile
echo "📦 Updating Podfile..."
if [ -f "$NEW_DIR/Podfile" ]; then
    sed -i.backup "s/target 'App'/target 'ALCHM'/g" "$NEW_DIR/Podfile"
fi

# Step 13: Update capacitor configuration
echo "⚡ Updating Capacitor configuration..."
if [ -f "$NEW_DIR/ALCHM/capacitor.config.json" ]; then
    # Update the iOS project name in capacitor config
    sed -i.backup 's/"name": "App"/"name": "ALCHM"/g' "$NEW_DIR/ALCHM/capacitor.config.json"
fi

# Step 14: Clean up backup files
echo "🧹 Cleaning up backup files..."
find "$NEW_DIR" -name "*.backup" -delete

echo "✅ Project renamed successfully!"
echo ""
echo "📱 Next Steps:"
echo "1. Run 'pod install' in the ALCHM directory"
echo "2. Open ALCHM.xcworkspace in Xcode"
echo "3. Clean and rebuild the project"
echo ""
echo "🎯 Project Structure:"
echo "   $NEW_DIR/ALCHM.xcworkspace  <- Open this in Xcode"
echo "   $NEW_DIR/ALCHM/             <- App source files"
echo ""