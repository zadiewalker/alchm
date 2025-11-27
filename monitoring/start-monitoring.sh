#!/bin/bash

# ALCHM Monitoring Service Starter
# Starts the deployment health monitoring system as a background service

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PID_FILE="$SCRIPT_DIR/monitor.pid"
LOG_FILE="$SCRIPT_DIR/monitor-service.log"

log() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG_FILE"
}

success() {
    log "${GREEN}✅ $1${NC}"
}

error() {
    log "${RED}❌ $1${NC}"
}

warning() {
    log "${YELLOW}⚠️  $1${NC}"
}

# Check if monitoring is already running
is_running() {
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        else
            # Stale PID file
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Start monitoring service
start_monitoring() {
    if is_running; then
        warning "Monitoring service is already running (PID: $(cat "$PID_FILE"))"
        return 1
    fi
    
    log "Starting ALCHM deployment health monitoring service..."
    
    # Change to project directory
    cd "$PROJECT_ROOT"
    
    # Create necessary directories
    mkdir -p monitoring/logs monitoring/alerts monitoring/reports
    
    # Start the monitor in background
    nohup ./scripts/deployment-health-monitor.sh >> "$LOG_FILE" 2>&1 &
    local monitor_pid=$!
    
    # Save PID
    echo "$monitor_pid" > "$PID_FILE"
    
    # Wait a moment to see if it starts successfully
    sleep 2
    
    if ps -p "$monitor_pid" > /dev/null 2>&1; then
        success "Monitoring service started successfully (PID: $monitor_pid)"
        log "Monitor logs: $LOG_FILE"
        log "Health status: $SCRIPT_DIR/health-status.json"
        log "Alerts: $SCRIPT_DIR/alerts.log"
        return 0
    else
        error "Failed to start monitoring service"
        rm -f "$PID_FILE"
        return 1
    fi
}

# Stop monitoring service
stop_monitoring() {
    if ! is_running; then
        warning "Monitoring service is not running"
        return 1
    fi
    
    local pid=$(cat "$PID_FILE")
    log "Stopping monitoring service (PID: $pid)..."
    
    # Send SIGTERM for graceful shutdown
    if kill -TERM "$pid" 2>/dev/null; then
        # Wait for graceful shutdown
        local timeout=10
        while [[ $timeout -gt 0 ]] && ps -p "$pid" > /dev/null 2>&1; do
            sleep 1
            ((timeout--))
        done
        
        # Force kill if still running
        if ps -p "$pid" > /dev/null 2>&1; then
            warning "Graceful shutdown failed, force killing..."
            kill -KILL "$pid" 2>/dev/null || true
        fi
        
        rm -f "$PID_FILE"
        success "Monitoring service stopped"
        return 0
    else
        error "Failed to stop monitoring service"
        return 1
    fi
}

# Restart monitoring service
restart_monitoring() {
    log "Restarting monitoring service..."
    stop_monitoring || true
    sleep 1
    start_monitoring
}

# Show monitoring status
status_monitoring() {
    if is_running; then
        local pid=$(cat "$PID_FILE")
        success "Monitoring service is running (PID: $pid)"
        
        # Show recent health status if available
        if [[ -f "$SCRIPT_DIR/health-status.json" ]]; then
            log "Recent health status:"
            cat "$SCRIPT_DIR/health-status.json" | jq -r '"Timestamp: \(.timestamp), Status: \(.status), Failures: \(.consecutive_failures)"' 2>/dev/null || cat "$SCRIPT_DIR/health-status.json"
        fi
        
        # Show recent alerts if any
        if [[ -f "$SCRIPT_DIR/alerts.log" ]]; then
            local recent_alerts=$(tail -5 "$SCRIPT_DIR/alerts.log" 2>/dev/null || echo "")
            if [[ -n "$recent_alerts" ]]; then
                log "Recent alerts:"
                echo "$recent_alerts"
            fi
        fi
        
        return 0
    else
        error "Monitoring service is not running"
        return 1
    fi
}

# Show logs
show_logs() {
    local lines=${1:-50}
    
    if [[ -f "$LOG_FILE" ]]; then
        log "Last $lines lines of monitoring logs:"
        tail -n "$lines" "$LOG_FILE"
    else
        warning "No log file found"
    fi
}

# Usage information
usage() {
    echo "ALCHM Deployment Health Monitoring Service"
    echo ""
    echo "Usage: $0 {start|stop|restart|status|logs}"
    echo ""
    echo "Commands:"
    echo "  start     - Start the monitoring service"
    echo "  stop      - Stop the monitoring service"
    echo "  restart   - Restart the monitoring service"
    echo "  status    - Show service status and recent health data"
    echo "  logs      - Show recent monitoring logs"
    echo ""
    echo "Files:"
    echo "  PID file: $PID_FILE"
    echo "  Log file: $LOG_FILE"
    echo "  Health status: $SCRIPT_DIR/health-status.json"
    echo "  Alerts: $SCRIPT_DIR/alerts.log"
}

# Main execution
main() {
    local command=${1:-"status"}
    
    case "$command" in
        "start")
            start_monitoring
            ;;
        "stop")
            stop_monitoring
            ;;
        "restart")
            restart_monitoring
            ;;
        "status")
            status_monitoring
            ;;
        "logs")
            show_logs "${2:-50}"
            ;;
        "help"|"-h"|"--help")
            usage
            ;;
        *)
            error "Unknown command: $command"
            usage
            return 1
            ;;
    esac
}

# Execute if run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
