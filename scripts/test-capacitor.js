#!/usr/bin/env node

/**
 * Capacitor iOS Testing and Debugging Script for ALCHM
 * 
 * This script helps validate that the Capacitor iOS setup is working correctly
 * and provides debugging information for JavaScript runtime errors.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ALCHM Capacitor iOS Diagnostic Report');
console.log('==========================================\n');

// Check build output
console.log('1. Checking Next.js Build Output...');
const outDir = path.join(__dirname, '../out');
const iosPublicDir = path.join(__dirname, '../ios/App/App/public');

if (fs.existsSync(outDir)) {
  const outFiles = fs.readdirSync(outDir);
  console.log(`✅ Next.js build output exists (${outFiles.length} files)`);
  
  // Check for key files
  const keyFiles = ['index.html', 'manifest.json', '_next'];
  keyFiles.forEach(file => {
    const exists = fs.existsSync(path.join(outDir, file));
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  });
} else {
  console.log('❌ Next.js build output not found. Run: npm run build');
}

console.log('\n2. Checking iOS App Public Directory...');
if (fs.existsSync(iosPublicDir)) {
  const iosFiles = fs.readdirSync(iosPublicDir);
  console.log(`✅ iOS public directory exists (${iosFiles.length} files)`);
  
  // Check if files are synced
  const keyFiles = ['index.html', 'manifest.json', '_next', 'cordova.js'];
  keyFiles.forEach(file => {
    const exists = fs.existsSync(path.join(iosPublicDir, file));
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  });
} else {
  console.log('❌ iOS public directory not found. Run: npx cap sync ios');
}

// Check Capacitor config
console.log('\n3. Checking Capacitor Configuration...');
const capacitorConfigPath = path.join(__dirname, '../capacitor.config.ts');
if (fs.existsSync(capacitorConfigPath)) {
  console.log('✅ capacitor.config.ts found');
  const config = fs.readFileSync(capacitorConfigPath, 'utf8');
  
  // Check key configuration values
  const checks = [
    { name: 'webDir: "out"', test: /webDir:\s*['"']out['"]/ },
    { name: 'webContentsDebuggingEnabled: true', test: /webContentsDebuggingEnabled:\s*true/ },
    { name: 'limitsNavigationsToAppBoundDomains: false', test: /limitsNavigationsToAppBoundDomains:\s*false/ }
  ];
  
  checks.forEach(check => {
    const found = check.test.test(config);
    console.log(`   ${found ? '✅' : '⚠️'} ${check.name}`);
  });
} else {
  console.log('❌ capacitor.config.ts not found');
}

// Check Next.js config
console.log('\n4. Checking Next.js Configuration...');
const nextConfigPath = path.join(__dirname, '../next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log('✅ next.config.js found');
  const config = fs.readFileSync(nextConfigPath, 'utf8');
  
  const checks = [
    { name: 'output: "export"', test: /output:\s*['"']export['"]/ },
    { name: 'images.unoptimized: true', test: /unoptimized:\s*true/ },
    { name: 'trailingSlash: true', test: /trailingSlash:\s*true/ }
  ];
  
  checks.forEach(check => {
    const found = check.test.test(config);
    console.log(`   ${found ? '✅' : '⚠️'} ${check.name}`);
  });
} else {
  console.log('❌ next.config.js not found');
}

// Check package.json for required dependencies
console.log('\n5. Checking Dependencies...');
const packageJsonPath = path.join(__dirname, '../package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = [
    '@capacitor/core',
    '@capacitor/ios',
    '@capacitor/cli',
    'next'
  ];
  
  console.log('✅ package.json found');
  requiredDeps.forEach(dep => {
    const version = deps[dep];
    console.log(`   ${version ? '✅' : '❌'} ${dep}${version ? ` (${version})` : ''}`);
  });
} else {
  console.log('❌ package.json not found');
}

console.log('\n6. Debugging Instructions...');
console.log(`
📱 To debug your iOS app:

1. **Enable Safari Web Inspector**:
   - Open Xcode and run your app in the simulator
   - Open Safari on your Mac
   - Go to Develop menu → [Device Name] → capacitor://localhost

2. **Check Console Logs**:
   - In Xcode, open the debug console (View → Debug Area → Activate Console)
   - Look for our enhanced error logging with 🔴, 🟠, and ⚡ prefixes

3. **Common Issues & Solutions**:
   - "⚡️ [error] - {}": Empty error objects usually indicate JavaScript module loading failures
   - Network errors: Check if all _next/ assets are properly copied
   - Plugin errors: Verify Capacitor plugins are properly installed with 'npx cap sync ios'

4. **Testing Checklist**:
   ✓ App loads without blank screen
   ✓ Console shows "⚡ Capacitor Status" logs
   ✓ Console shows "🔄 Initializing data service..." logs  
   ✓ Navigation works between pages
   ✓ No "TypeError: undefined is not an object" errors

5. **If Problems Persist**:
   - Clean build: rm -rf out .next && npm run build && npx cap sync ios
   - Reset iOS app: Product → Clean Build Folder in Xcode
   - Check iOS Simulator logs: Console.app → Device → [Your Simulator]
`);

console.log('\n🎯 Next Steps:');
console.log('1. Run your iOS app in Xcode');
console.log('2. Check Safari Web Inspector for detailed error information');
console.log('3. Monitor console logs for the enhanced debugging output we added');
console.log('4. Report any remaining "⚡️ [error] - {}" issues with full error context');

console.log('\n📋 Report Template for Issues:');
console.log(`
If you still see JavaScript runtime errors, please include:

**Environment:**
- iOS Version: 
- Xcode Version:
- Device/Simulator:

**Console Output:**
- Copy all logs from Safari Web Inspector
- Include any Xcode console output
- Note the specific step where errors occur

**Error Pattern:**
- Exact error message
- When it occurs (app launch, navigation, etc.)
- Whether app functions despite the error

This information will help identify any remaining issues.
`);