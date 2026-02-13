#!/bin/bash
# ALCHM Build Analysis Script

echo "🔍 ALCHM Build Analysis Starting..."
echo "=================================="
echo "Timestamp: $(date)"
echo "Working Directory: $(pwd)"

# Check environment
echo -e "\n📋 Environment Check:"
echo "Node version: $(node --version 2>/dev/null || echo 'Node not found')"
echo "NPM version: $(npm --version 2>/dev/null || echo 'NPM not found')"
echo "Next.js version: $(npx next --version 2>/dev/null || echo 'Next.js not found')"

# Check project structure
echo -e "\n📁 Project Structure:"
if [ -d "src" ]; then
  echo "✅ src/ directory exists"
  ls -la src/ | head -5
elif [ -d "app" ]; then
  echo "✅ app/ directory exists (App Router)"
  ls -la app/ | head -5
else
  echo "❌ No src/ or app/ directory found"
fi

# Check critical files
echo -e "\n📄 Critical Files:"
critical_files=("package.json" "next.config.js" "capacitor.config.ts" "tsconfig.json")
for file in "${critical_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists ($(wc -c < "$file") bytes)"
  else
    echo "❌ $file missing"
  fi
done

# Check dependencies
echo -e "\n📦 Dependencies Check:"
if [ -f "package.json" ]; then
  if command -v jq >/dev/null 2>&1; then
    echo "React: $(jq -r '.dependencies.react // "not found"' package.json)"
    echo "Next.js: $(jq -r '.dependencies.next // "not found"' package.json)"
    echo "Capacitor: $(jq -r '.dependencies."@capacitor/core" // "not found"' package.json)"
  else
    echo "Dependencies found: $(grep -c '"' package.json 2>/dev/null || echo 0) entries"
  fi
else
  echo "❌ package.json not found"
fi

# Clean previous builds
echo -e "\n🧹 Cleaning Previous Builds:"
if [ -d ".next" ]; then
  rm -rf .next
  echo "✅ Cleaned .next directory"
fi

if [ -d "out" ]; then
  rm -rf out
  echo "✅ Cleaned out directory"
fi

if [ -d "node_modules/.cache" ]; then
  rm -rf node_modules/.cache
  echo "✅ Cleaned npm cache"
fi

if [ -d "ios/App/App/public" ]; then
  rm -rf ios/App/App/public/*
  echo "✅ Cleaned iOS public directory"
fi

echo "Build environment cleaned"

# Build application
echo -e "\n🔨 Building Application:"
echo "Starting build at $(date)"

# Capture build output
npm run build > build.log 2>&1
build_exit_code=$?

if [ $build_exit_code -eq 0 ]; then
  echo "✅ Build completed successfully"
else
  echo "❌ Build failed with exit code $build_exit_code"
  echo -e "\nBuild errors:"
  grep -i "error" build.log | head -5
  echo -e "\nBuild warnings:"
  grep -i "warning" build.log | head -3
fi

# Analyze build output
echo -e "\n📊 Build Output Analysis:"
if [ -d "out" ]; then
  echo "✅ Output directory exists"
  
  # Directory size
  output_size=$(du -sh out 2>/dev/null | cut -f1)
  echo "Output size: $output_size"
  
  # File count
  file_count=$(find out -type f | wc -l)
  echo "Total files: $file_count"
  
  # List main files
  echo -e "\nMain files:"
  ls -lah out/ | head -10
  
  # Check index.html
  if [ -f "out/index.html" ]; then
    index_size=$(wc -c < out/index.html)
    script_count=$(grep -c '<script' out/index.html 2>/dev/null || echo 0)
    link_count=$(grep -c '<link' out/index.html 2>/dev/null || echo 0)
    
    echo -e "\n📄 index.html Analysis:"
    echo "Size: $index_size bytes"
    echo "Script tags: $script_count"
    echo "Link tags: $link_count"
    
    # Check for React mount point
    if grep -q '__next' out/index.html; then
      echo "✅ React mount point found"
    else
      echo "❌ React mount point missing"
    fi
    
    # Extract script sources
    echo -e "\nScript sources:"
    grep 'src=' out/index.html | sed 's/.*src="\([^"]*\)".*/\1/' | head -5
  else
    echo "❌ index.html not found"
  fi
  
  # Check JavaScript bundles
  echo -e "\n📦 JavaScript Bundle Analysis:"
  if [ -d "out/_next/static/chunks" ]; then
    js_file_count=$(find out/_next/static/chunks -name "*.js" | wc -l)
    echo "JavaScript files: $js_file_count"
    
    # List main bundles
    echo -e "\nMain bundles:"
    ls -lah out/_next/static/chunks/*.js 2>/dev/null | head -5
    
    # Check bundle sizes
    echo -e "\nLargest bundles:"
    find out/_next/static/chunks -name "*.js" -exec ls -lah {} \; | sort -k5 -hr | head -3
    
    # Simple syntax check on main bundles
    echo -e "\n🔍 Bundle Syntax Check:"
    for file in out/_next/static/chunks/framework*.js out/_next/static/chunks/main*.js; do
      if [ -f "$file" ]; then
        filename=$(basename "$file")
        if node -c "$file" 2>/dev/null; then
          echo "✅ $filename - syntax valid"
        else
          echo "❌ $filename - syntax error"
        fi
      fi
    done
  else
    echo "❌ JavaScript chunks directory not found"
  fi
  
  # Check for CSS files
  echo -e "\n🎨 CSS Analysis:"
  css_file_count=$(find out -name "*.css" | wc -l)
  echo "CSS files: $css_file_count"
  if [ $css_file_count -gt 0 ]; then
    find out -name "*.css" -exec ls -lah {} \; | head -3
  fi
  
else
  echo "❌ No output directory generated"
fi

# Check debug files
echo -e "\n🧪 Debug Files Check:"
debug_files=("public/debug.html" "public/test.html")
for file in "${debug_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
    # Copy to output if build succeeded
    if [ -d "out" ]; then
      cp "$file" "out/$(basename "$file")"
      echo "   → Copied to output directory"
    fi
  else
    echo "⚠️ $file not found"
  fi
done

# Capacitor analysis
echo -e "\n📱 Capacitor Analysis:"
if [ -f "capacitor.config.ts" ]; then
  echo "✅ Capacitor config exists"
  
  # Extract webDir
  web_dir=$(grep -o 'webDir:.*' capacitor.config.ts 2>/dev/null | cut -d"'" -f2 2>/dev/null || echo "out")
  echo "Web directory: $web_dir"
  
  if [ -d "ios/App/App" ]; then
    echo "✅ iOS project exists"
    
    # Check if sync is needed
    if [ -d "ios/App/App/public" ]; then
      ios_file_count=$(find ios/App/App/public -type f | wc -l)
      echo "iOS public files: $ios_file_count"
    else
      echo "⚠️ iOS public directory empty - sync needed"
    fi
  else
    echo "⚠️ iOS project not found"
  fi
else
  echo "❌ Capacitor config not found"
fi

# Final recommendations
echo -e "\n🎯 Recommendations:"
if [ $build_exit_code -eq 0 ]; then
  if [ -f "out/index.html" ]; then
    echo "✅ Build successful - ready for testing"
    echo "Next steps:"
    echo "1. npx cap sync ios"
    echo "2. npx cap open ios"
    echo "3. Test debug.html first"
  else
    echo "⚠️ Build completed but missing index.html"
    echo "Check static export configuration"
  fi
else
  echo "❌ Fix build errors first"
  echo "Check build.log for details"
fi

echo -e "\n🏁 Analysis Complete"
echo "=================================="
echo "Build log saved to: build.log"
echo "Run with: bash scripts/analyze-build.sh"