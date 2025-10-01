#!/bin/bash

# ALCHM Visual Diff System
# Compare visual changes before/after deployment

set -e

# Colors
SAGE_GREEN='\033[38;2;164;183;146m'
WHITE='\033[1;37m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
RESET='\033[0m'

log_sanctuary() {
    echo -e "${SAGE_GREEN}🌿 VISUAL DIFF${RESET} ${WHITE}$1${RESET}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  WARNING${RESET} $1"
}

log_error() {
    echo -e "${RED}❌ ERROR${RESET} $1"
}

# Create screenshots directory if it doesn't exist
SCREENSHOTS_DIR="visual-tests/screenshots"
mkdir -p "$SCREENSHOTS_DIR"

# Function to take screenshot of a page
take_screenshot() {
    local url=$1
    local name=$2
    local output="$SCREENSHOTS_DIR/${name}-$(date +%Y%m%d-%H%M%S).png"
    
    log_sanctuary "Taking screenshot of $name..."
    
    # Use Playwright to take screenshot
    npx playwright-core screenshot \
        --browser=chromium \
        --viewport-size=1200,800 \
        --full-page \
        --wait-for-timeout=2000 \
        "$url" "$output"
    
    if [ $? -eq 0 ]; then
        log_sanctuary "Screenshot saved: $output"
        echo "$output"
    else
        log_error "Failed to take screenshot of $name"
        return 1
    fi
}

# Function to compare two screenshots
compare_screenshots() {
    local before=$1
    local after=$2
    local diff_output="$SCREENSHOTS_DIR/diff-$(date +%Y%m%d-%H%M%S).png"
    
    if command -v magick >/dev/null 2>&1; then
        log_sanctuary "Comparing screenshots..."
        
        magick compare -metric AE -highlight-color red \
            "$before" "$after" "$diff_output" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            log_sanctuary "Visual diff saved: $diff_output"
            return 0
        else
            log_sanctuary "Visual differences detected"
            return 1
        fi
    else
        log_warning "ImageMagick not found. Install with: brew install imagemagick"
        return 1
    fi
}

# Test different viewport sizes
test_responsive() {
    local url=$1
    local name=$2
    
    declare -a viewports=("375,667" "768,1024" "1200,800" "1920,1080")
    
    for viewport in "${viewports[@]}"; do
        local size_name="${name}-${viewport//,/x}"
        local output="$SCREENSHOTS_DIR/${size_name}-$(date +%Y%m%d-%H%M%S).png"
        
        log_sanctuary "Testing $viewport viewport for $name..."
        
        npx playwright-core screenshot \
            --browser=chromium \
            --viewport-size="$viewport" \
            --full-page \
            --wait-for-timeout=2000 \
            "$url" "$output"
    done
}

# Main testing function
run_visual_tests() {
    local base_url=${1:-"http://localhost:3000"}
    
    log_sanctuary "Starting visual regression tests on $base_url"
    
    # Key pages to test
    declare -a pages=(
        "$base_url|home"
        "$base_url/dashboard|dashboard"
        "$base_url/auth/login|auth"
        "$base_url/journal|journal"
        "$base_url/pathways|pathways"
    )
    
    for page_data in "${pages[@]}"; do
        IFS='|' read -r url name <<< "$page_data"
        
        # Test responsive designs
        test_responsive "$url" "$name"
        
        # Take standard screenshot
        take_screenshot "$url" "$name"
    done
    
    log_sanctuary "Visual tests complete!"
    log_sanctuary "Screenshots saved in: $SCREENSHOTS_DIR"
}

# Function to generate visual report
generate_report() {
    log_sanctuary "Generating visual test report..."
    
    local report_file="visual-tests/report-$(date +%Y%m%d-%H%M%S).html"
    
    cat > "$report_file" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ALCHM Visual Test Report</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1a1a1a;
            color: #fefcfb;
            margin: 0;
            padding: 20px;
        }
        .header {
            background: linear-gradient(145deg, #a4b792 0%, #8fa67d 100%);
            color: black;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
        }
        .screenshots {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .screenshot {
            background: rgba(164, 183, 146, 0.1);
            border: 1px solid rgba(164, 183, 146, 0.2);
            border-radius: 8px;
            padding: 15px;
        }
        .screenshot img {
            width: 100%;
            height: auto;
            border-radius: 6px;
        }
        .screenshot h3 {
            margin: 0 0 10px 0;
            color: #a4b792;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌿 ALCHM Visual Test Report</h1>
        <p>Generated on $(date)</p>
    </div>
    
    <div class="screenshots">
EOF

    # Add screenshot entries
    for screenshot in "$SCREENSHOTS_DIR"/*.png; do
        if [ -f "$screenshot" ]; then
            local basename=$(basename "$screenshot")
            cat >> "$report_file" << EOF
        <div class="screenshot">
            <h3>$basename</h3>
            <img src="screenshots/$basename" alt="$basename" />
        </div>
EOF
        fi
    done

    cat >> "$report_file" << EOF
    </div>
</body>
</html>
EOF

    log_sanctuary "Visual report generated: $report_file"
    
    # Open report in browser
    if command -v open >/dev/null 2>&1; then
        open "$report_file"
    fi
}

# Command dispatcher
case "${1:-test}" in
    "test"|"t")
        run_visual_tests "$2"
        ;;
    "compare"|"c")
        if [ -z "$2" ] || [ -z "$3" ]; then
            log_error "Usage: $0 compare <before-screenshot> <after-screenshot>"
            exit 1
        fi
        compare_screenshots "$2" "$3"
        ;;
    "report"|"r")
        generate_report
        ;;
    "responsive"|"resp")
        test_responsive "${2:-http://localhost:3000}" "${3:-home}"
        ;;
    "help"|"h")
        echo
        log_sanctuary "ALCHM Visual Testing Commands:"
        echo
        echo "  ${WHITE}$0 test [url]${RESET}              Run visual tests (default: localhost:3000)"
        echo "  ${WHITE}$0 compare <before> <after>${RESET} Compare two screenshots"
        echo "  ${WHITE}$0 report${RESET}                   Generate HTML report"
        echo "  ${WHITE}$0 responsive [url] [name]${RESET}  Test responsive design"
        echo "  ${WHITE}$0 help${RESET}                     Show this help"
        echo
        ;;
    *)
        log_error "Unknown command: $1"
        log_sanctuary "Run '$0 help' for available commands"
        exit 1
        ;;
esac