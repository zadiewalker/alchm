# 🌿 ALCHM Development Workflow Guide

*Designed with Jony Ive principles: Eliminate friction, maximize creative flow*

## 🚀 **INSTANT VISUAL DEVELOPMENT**

### Quick Start (30 seconds to visual changes)

```bash
# Start instant hot-reload development
npm run dev:fast

# Or use the full workflow system
./scripts/dev-workflow.sh
```

**What happens:**
- ✨ Hot-reload development server on optimal port
- 🎨 Live design system panel appears (top-right)
- 📱 Mobile-responsive testing ready
- 🔄 Instant CSS changes without refresh

---

## 🎨 **VISUAL DESIGN SYSTEM**

### Live Design Token Editor

When you run `npm run dev:fast`, a floating design system panel appears:

- **🎯 Real-time token editing** - Change colors, spacing, typography instantly
- **📱 Category filtering** - Focus on colors, spacing, typography, or animations
- **💾 Export tokens** - Download your custom design tokens as CSS
- **🔄 Reset system** - Return to default tokens anytime

### Custom Token Testing
```bash
# Test custom CSS properties live
# Use the floating panel or modify CSS variables directly:

:root {
  --color-primary: #your-color;
  --space-comfort: 32px;
  --ease-sanctuary: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

## ⚡ **STREAMLINED DEPLOYMENT**

### One-Command Deploy
```bash
# Build and deploy in one command
npm run deploy

# Or use the workflow script
./scripts/dev-workflow.sh deploy
```

### Development Build Testing
```bash
# Create development build for testing
./scripts/dev-workflow.sh build

# Preview production build locally
./scripts/dev-workflow.sh preview
```

---

## 📸 **VISUAL REGRESSION TESTING**

### Automated Screenshot Testing
```bash
# Test all key pages
npm run visual:test

# Test specific URL
./scripts/visual-diff.sh test http://localhost:3000

# Test responsive breakpoints
./scripts/visual-diff.sh responsive
```

### Visual Comparison
```bash
# Compare before/after screenshots
npm run visual:compare screenshot1.png screenshot2.png

# Generate visual report
npm run visual:report
```

---

## 🔄 **WORKFLOW COMMANDS**

### Development
```bash
npm run dev:fast           # Start optimized development server
npm run dev:visual         # Start with design system panel
./scripts/dev-workflow.sh  # Full workflow with cleanup
```

### Building
```bash
npm run build              # Standard production build
npm run deploy:quick       # Quick build + deploy
./scripts/dev-workflow.sh deploy  # Full deployment workflow
```

### Visual Testing
```bash
npm run visual:test        # Screenshot all pages
npm run visual:compare     # Compare two screenshots
npm run visual:report      # Generate HTML report
```

### Cleanup
```bash
./scripts/dev-workflow.sh clean   # Clean all development files
```

---

## 🎯 **OPTIMIZED FOR VISUAL ITERATION**

### Hot-Reload Features
- **CSS changes** appear instantly without page refresh
- **Component changes** update in <500ms
- **Design token changes** apply immediately
- **Mobile breakpoint testing** built-in

### Design System Integration
- **Live token editor** for real-time visual changes
- **Export functionality** to save custom designs
- **Category filtering** to focus on specific design areas
- **Reset capability** to return to baseline

### Deployment Optimization
- **Automated builds** with optimal memory allocation
- **Error detection** with clear feedback
- **One-command deployment** to Firebase
- **Preview deployments** for testing

---

## 🛠️ **TECHNICAL ARCHITECTURE**

### Development Server
- **Next.js 14** with optimized hot-reload
- **Port auto-detection** (3000 → 3001 → 3002)
- **CSS watching** with fswatch (install: `brew install fswatch`)
- **Memory optimization** for large builds

### Visual Testing
- **Playwright** for screenshot automation
- **ImageMagick** for visual diffing (install: `brew install imagemagick`)
- **Multiple viewport testing** (mobile, tablet, desktop)
- **HTML report generation**

### Deployment Pipeline
- **GitHub Actions** for automated deployment
- **Firebase hosting** with preview channels
- **Build optimization** with memory management
- **Error handling** with clear feedback

---

## 💡 **DEVELOPMENT TIPS**

### Fastest Visual Changes
1. **Use the floating design panel** - no file editing needed
2. **Edit CSS variables** in browser dev tools first
3. **Then apply changes** to actual CSS files
4. **Use hot-reload** - never manually refresh

### Efficient Testing
1. **Take screenshots before** major visual changes
2. **Use responsive testing** for different screen sizes
3. **Compare visually** before deploying
4. **Generate reports** to share with team

### Deployment Strategy
1. **Test locally first** with dev build
2. **Use visual diff** to verify changes
3. **Deploy with one command** when ready
4. **Monitor deployment** for errors

---

## 🚨 **TROUBLESHOOTING**

### Development Server Won't Start
```bash
# Clean and restart
./scripts/dev-workflow.sh clean
npm run dev:fast
```

### Build Failures
```bash
# Check TypeScript errors
npm run typecheck

# Fix linting issues
npm run lint:fix

# Clean build cache
rm -rf .next && npm run build
```

### Deployment Issues
```bash
# Check Firebase authentication
firebase login

# Verify project configuration
firebase projects:list

# Try manual deployment
npm run build && firebase deploy --only hosting
```

### Visual Tests Failing
```bash
# Install required tools
brew install fswatch imagemagick

# Check Playwright installation
npx playwright install chromium

# Generate fresh baseline screenshots
npm run visual:test
```

---

## 🎨 **DESIGN SYSTEM WORKFLOW**

### Making Visual Changes
1. **Start development server**: `npm run dev:fast`
2. **Open floating design panel** (appears automatically)
3. **Edit tokens live** - see changes instantly
4. **Export when satisfied** - download CSS tokens
5. **Apply to actual files** - update sanctuary.css
6. **Deploy changes**: `npm run deploy`

### Testing Responsive Design
1. **Use visual testing**: `./scripts/visual-diff.sh responsive`
2. **Check multiple breakpoints** automatically
3. **Generate reports** for review
4. **Compare before/after** screenshots

This workflow eliminates the friction between design intention and visual execution, allowing you to iterate on ALCHM's interface with the same fluidity as sketching on paper.

---

*"The interface disappears so the creativity can begin"* ✨