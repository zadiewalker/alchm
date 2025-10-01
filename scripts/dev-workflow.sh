#!/bin/bash

# ALCHM Development Workflow - Instant Visual Changes
# Designed by Jony Ive principles: Eliminate friction, maximize flow

set -e

# Colors for beautiful terminal output
SAGE_GREEN='\033[38;2;164;183;146m'
WHITE='\033[1;37m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
RESET='\033[0m'

# Sanctuary-inspired logging
log_sanctuary() {
    echo -e "${SAGE_GREEN}🌿 ALCHM${RESET} ${WHITE}$1${RESET}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  WARNING${RESET} $1"
}

log_error() {
    echo -e "${RED}❌ ERROR${RESET} $1"
}

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1
    else
        return 0
    fi
}

# Kill any existing dev servers
cleanup_servers() {
    log_sanctuary "Cleaning up existing development servers..."
    
    # Kill any existing Next.js dev servers
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "npm run dev" 2>/dev/null || true
    pkill -f "pnpm dev" 2>/dev/null || true
    
    # Wait a moment for processes to terminate
    sleep 2
}

# Start development server with hot reload
start_dev_server() {
    log_sanctuary "Starting hot-reload development server..."
    
    # Check if port 3000 is available
    if ! check_port 3000; then
        log_warning "Port 3000 is busy. Trying port 3001..."
        if ! check_port 3001; then
            log_warning "Port 3001 is busy. Trying port 3002..."
            export PORT=3002
        else
            export PORT=3001
        fi
    else
        export PORT=3000
    fi
    
    # Start development server with optimized settings
    log_sanctuary "Starting development server on port $PORT with instant hot-reload..."
    
    # Set environment variables for optimal development experience
    export NEXT_TELEMETRY_DISABLED=1
    export FAST_REFRESH=true
    export NEXT_PRIVATE_LOCAL_WEBPACK=1
    
    # Start the development server
    npm run dev &
    DEV_PID=$!
    
    # Wait for server to start
    log_sanctuary "Waiting for development server to initialize..."
    sleep 5
    
    # Check if server started successfully
    if check_port $PORT; then
        log_error "Failed to start development server on port $PORT"
        exit 1
    fi
    
    log_sanctuary "Development server running at http://localhost:$PORT"
    log_sanctuary "Hot reload enabled - changes will appear instantly"
    
    return $DEV_PID
}

# Watch for CSS changes and apply them instantly
setup_css_watcher() {
    log_sanctuary "Setting up instant CSS refresh..."
    
    # Use fswatch to monitor CSS file changes (macOS)
    if command -v fswatch >/dev/null 2>&1; then
        fswatch -o src/styles/ | while read f; do
            log_sanctuary "CSS changes detected - refreshing styles..."
            # Touch a dummy file to trigger Next.js hot reload
            touch .next-refresh-trigger
        done &
        CSS_WATCHER_PID=$!
    else
        log_warning "fswatch not found. Install with: brew install fswatch (for instant CSS refresh)"
    fi
}

# Function to deploy to Firebase with one command
quick_deploy() {
    log_sanctuary "Starting quick deployment pipeline..."
    
    # Build the project
    log_sanctuary "Building optimized production bundle..."
    npm run build
    
    if [ $? -ne 0 ]; then
        log_error "Build failed. Please fix errors before deploying."
        return 1
    fi
    
    # Deploy to Firebase
    log_sanctuary "Deploying to Firebase hosting..."
    firebase deploy --only hosting
    
    if [ $? -eq 0 ]; then
        log_sanctuary "🎉 Deployment successful!"
        log_sanctuary "Live at: https://alchmapp.web.app"
        
        # Open the deployed site
        if command -v open >/dev/null 2>&1; then
            open "https://alchmapp.web.app"
        fi
    else
        log_error "Deployment failed. Please check Firebase configuration."
        return 1
    fi
}

# Function to create a development build for testing
dev_build() {
    log_sanctuary "Creating development build for testing..."
    
    # Set development environment
    export NODE_ENV=development
    export NEXT_TELEMETRY_DISABLED=1
    
    # Build with development optimizations
    npm run build
    
    if [ $? -eq 0 ]; then
        log_sanctuary "Development build complete. Starting preview server..."
        npm start &
        PREVIEW_PID=$!
        
        log_sanctuary "Preview server running at http://localhost:3000"
        log_sanctuary "This build includes development optimizations for faster iteration"
        
        return $PREVIEW_PID
    else
        log_error "Development build failed"
        return 1
    fi
}

# Main workflow selector
case "${1:-dev}" in
    "dev"|"start"|"")
        log_sanctuary "🚀 Starting ALCHM Development Workflow"
        echo
        cleanup_servers
        start_dev_server
        setup_css_watcher
        
        log_sanctuary "✨ Development environment ready!"
        log_sanctuary "Make visual changes and see them instantly at http://localhost:$PORT"
        echo
        log_sanctuary "Commands available:"
        echo "  - Ctrl+C: Stop development servers"
        echo "  - './scripts/dev-workflow.sh deploy': Quick deploy to production"
        echo "  - './scripts/dev-workflow.sh build': Create development build"
        echo
        
        # Keep the script running and handle cleanup on exit
        trap 'log_sanctuary "Shutting down development servers..."; kill $DEV_PID 2>/dev/null || true; kill $CSS_WATCHER_PID 2>/dev/null || true; exit 0' INT TERM
        wait
        ;;
        
    "deploy"|"d")
        quick_deploy
        ;;
        
    "build"|"b")
        dev_build
        ;;
        
    "preview"|"p")
        log_sanctuary "Starting preview server..."
        npm start
        ;;
        
    "clean"|"c")
        log_sanctuary "Cleaning development environment..."
        cleanup_servers
        rm -rf .next
        rm -rf out
        rm -f .next-refresh-trigger
        log_sanctuary "Development environment cleaned"
        ;;
        
    "help"|"h")
        echo
        log_sanctuary "ALCHM Development Workflow Commands:"
        echo
        echo "  ${WHITE}./scripts/dev-workflow.sh${RESET}          Start hot-reload development"
        echo "  ${WHITE}./scripts/dev-workflow.sh deploy${RESET}    Quick deploy to production"
        echo "  ${WHITE}./scripts/dev-workflow.sh build${RESET}     Create development build"
        echo "  ${WHITE}./scripts/dev-workflow.sh preview${RESET}   Preview production build"
        echo "  ${WHITE}./scripts/dev-workflow.sh clean${RESET}     Clean development files"
        echo "  ${WHITE}./scripts/dev-workflow.sh help${RESET}      Show this help"
        echo
        ;;
        
    *)
        log_error "Unknown command: $1"
        log_sanctuary "Run './scripts/dev-workflow.sh help' for available commands"
        exit 1
        ;;
esac