#!/usr/bin/env node
/**
 * Generate App Store Icons for ALCHM
 * 
 * Creates required icon sizes for iOS App Store submission
 */

const fs = require('fs');
const path = require('path');

// Icon specifications for App Store
const iconSpecs = [
  { size: 1024, name: 'icon-1024.png', description: 'App Store Icon' },
  { size: 180, name: 'icon-180.png', description: 'iPhone App Icon' },
  { size: 167, name: 'icon-167.png', description: 'iPad Pro Icon' },
  { size: 152, name: 'icon-152.png', description: 'iPad Icon' },
  { size: 120, name: 'icon-120.png', description: 'iPhone Icon' },
  { size: 76, name: 'icon-76.png', description: 'iPad Icon' },
  { size: 60, name: 'icon-60.png', description: 'iPhone Icon' },
  { size: 40, name: 'icon-40.png', description: 'Spotlight Icon' },
  { size: 29, name: 'icon-29.png', description: 'Settings Icon' },
  { size: 20, name: 'icon-20.png', description: 'Notification Icon' }
];

// SVG template for ALCHM icon
const generateIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a4b792;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8fa078;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${size * 0.02}" stdDeviation="${size * 0.01}" flood-color="#000" flood-opacity="0.1"/>
    </filter>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect width="${size}" height="${size}" rx="${size * 0.18}" ry="${size * 0.18}" fill="url(#bg)"/>
  
  <!-- Sacred scarab symbol -->
  <g transform="translate(${size * 0.5}, ${size * 0.5})">
    <!-- Scarab body -->
    <ellipse cx="0" cy="0" rx="${size * 0.15}" ry="${size * 0.25}" fill="#ffffff" opacity="0.9" filter="url(#shadow)"/>
    
    <!-- Scarab wings -->
    <ellipse cx="-${size * 0.1}" cy="-${size * 0.05}" rx="${size * 0.08}" ry="${size * 0.15}" fill="#ffffff" opacity="0.7" transform="rotate(-20)"/>
    <ellipse cx="${size * 0.1}" cy="-${size * 0.05}" rx="${size * 0.08}" ry="${size * 0.15}" fill="#ffffff" opacity="0.7" transform="rotate(20)"/>
    
    <!-- Sacred geometry -->
    <circle cx="0" cy="-${size * 0.08}" r="${size * 0.03}" fill="#2d3748" opacity="0.6"/>
    <circle cx="0" cy="0" r="${size * 0.02}" fill="#2d3748" opacity="0.8"/>
    <circle cx="0" cy="${size * 0.08}" r="${size * 0.03}" fill="#2d3748" opacity="0.6"/>
  </g>
  
  <!-- App name hint for larger sizes -->
  ${size >= 180 ? `
  <text x="${size * 0.5}" y="${size * 0.85}" font-family="system-ui" font-size="${size * 0.06}" font-weight="500" fill="#ffffff" text-anchor="middle" opacity="0.8">ALCHM</text>
  ` : ''}
</svg>
`.trim();

// Create icons directory if it doesn't exist
const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🎨 Generating ALCHM App Store Icons...\n');

// Generate SVG icons (for now - in production you'd convert to PNG)
iconSpecs.forEach(spec => {
  const svgContent = generateIconSVG(spec.size);
  const filePath = path.join(iconsDir, spec.name.replace('.png', '.svg'));
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Created ${spec.description}: ${spec.name.replace('.png', '.svg')} (${spec.size}x${spec.size})`);
});

// Create a placeholder PNG for the 1024x1024 App Store icon (most critical)
const placeholder1024Content = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a4b792;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8fa078;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="1024" height="1024" rx="184" ry="184" fill="url(#bg)"/>
  
  <g transform="translate(512, 512)">
    <!-- Khepera scarab symbol -->
    <ellipse cx="0" cy="0" rx="153" ry="256" fill="#ffffff" opacity="0.9"/>
    <ellipse cx="-102" cy="-51" rx="82" ry="153" fill="#ffffff" opacity="0.7" transform="rotate(-20)"/>
    <ellipse cx="102" cy="-51" rx="82" ry="153" fill="#ffffff" opacity="0.7" transform="rotate(20)"/>
    
    <!-- Sacred dots -->
    <circle cx="0" cy="-82" r="31" fill="#2d3748" opacity="0.6"/>
    <circle cx="0" cy="0" r="20" fill="#2d3748" opacity="0.8"/>
    <circle cx="0" cy="82" r="31" fill="#2d3748" opacity="0.6"/>
  </g>
  
  <text x="512" y="870" font-family="-apple-system, system-ui" font-size="62" font-weight="500" fill="#ffffff" text-anchor="middle" opacity="0.8">ALCHM</text>
</svg>
`.trim();

// Write the critical 1024x1024 icon
fs.writeFileSync(path.join(iconsDir, 'icon-1024.svg'), placeholder1024Content);

console.log('\n📱 App Store Icon Generation Complete!');
console.log('\n⚠️  IMPORTANT NOTES:');
console.log('• These are SVG placeholders. For App Store submission, convert to PNG format');
console.log('• Icons should be professionally designed and match your brand');
console.log('• Test icons on actual devices for clarity and visibility');
console.log('• Ensure icons meet Apple\'s Human Interface Guidelines');
console.log('\n🔧 To convert to PNG, use a tool like:');
console.log('• Figma, Sketch, or Adobe Illustrator');
console.log('• Online converters like CloudConvert');
console.log('• Command line tools like ImageMagick or rsvg-convert');

// Create a simple script to help with icon validation
const iconValidationScript = `
#!/bin/bash
# App Icon Validation Script

echo "🔍 Validating App Store Icons..."

ICONS_DIR="public/icons"
REQUIRED_SIZES=(1024 180 167 152 120 76 60 40 29 20)

for size in "\${REQUIRED_SIZES[@]}"; do
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
`.trim();

fs.writeFileSync(path.join(process.cwd(), 'scripts', 'validate-app-icons.sh'), iconValidationScript);
fs.chmodSync(path.join(process.cwd(), 'scripts', 'validate-app-icons.sh'), '755');

console.log('\n📝 Created icon validation script: scripts/validate-app-icons.sh');
console.log('Run with: ./scripts/validate-app-icons.sh');