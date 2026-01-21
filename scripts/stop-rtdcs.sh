#!/usr/bin/env bash
#
# RTDCS Stop Script
# Gracefully stops all RTDCS modules
#
# Author: Developer Agent
# Date: 2026-01-21
# Usage: ./scripts/stop-rtdcs.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "======================================================================="
echo -e "${BLUE}RTDCS System Shutdown${NC}"
echo "======================================================================="
echo ""

# Check if modules are running
BIGMODULEA_PID=$(pgrep -f "BigModuleA" || true)
BIGMODULEB_PID=$(pgrep -f "BigModuleB" || true)
BIGMODULEC_PID=$(pgrep -f "BigModuleC" || true)

if [ -z "$BIGMODULEA_PID" ] && [ -z "$BIGMODULEB_PID" ] && [ -z "$BIGMODULEC_PID" ]; then
    echo -e "${YELLOW}[INFO]${NC} No RTDCS modules are currently running."
    exit 0
fi

# Stop BigModuleB first (client)
if [ -n "$BIGMODULEB_PID" ]; then
    echo -e "${BLUE}[1/3]${NC} Stopping BigModuleB (PID: $BIGMODULEB_PID)..."
    kill -SIGINT "$BIGMODULEB_PID" 2>/dev/null || kill -SIGTERM "$BIGMODULEB_PID" 2>/dev/null || true
    sleep 1
else
    echo -e "${YELLOW}[1/3]${NC} BigModuleB not running"
fi

# Stop BigModuleC (server)
if [ -n "$BIGMODULEC_PID" ]; then
    echo -e "${BLUE}[2/3]${NC} Stopping BigModuleC (PID: $BIGMODULEC_PID)..."
    kill -SIGINT "$BIGMODULEC_PID" 2>/dev/null || kill -SIGTERM "$BIGMODULEC_PID" 2>/dev/null || true
    sleep 1
else
    echo -e "${YELLOW}[2/3]${NC} BigModuleC not running"
fi

# Stop BigModuleA last (shared memory owner)
if [ -n "$BIGMODULEA_PID" ]; then
    echo -e "${BLUE}[3/3]${NC} Stopping BigModuleA (PID: $BIGMODULEA_PID)..."
    kill -SIGINT "$BIGMODULEA_PID" 2>/dev/null || kill -SIGTERM "$BIGMODULEA_PID" 2>/dev/null || true
    sleep 1
else
    echo -e "${YELLOW}[3/3]${NC} BigModuleA not running"
fi

# Wait for processes to terminate
echo ""
echo "Waiting for processes to terminate..."
sleep 2

# Check if any are still running
STILL_RUNNING=$(pgrep -f "BigModule" || true)
if [ -n "$STILL_RUNNING" ]; then
    echo -e "${YELLOW}[WARNING]${NC} Some processes still running. Forcing termination..."
    pkill -SIGKILL -f "BigModule" 2>/dev/null || true
    sleep 1
fi

# Clean up PID files if they exist
rm -f /tmp/rtdcs_bigmodulea.pid /tmp/rtdcs_bigmoduleb.pid /tmp/rtdcs_bigmodulec.pid 2>/dev/null || true

# Clean up stale shared memory (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if [ -e "/tmp/rtdcs_shared_state" ]; then
        echo "Cleaning up stale shared memory..."
        rm -f /tmp/rtdcs_shared_state
    fi
fi

echo ""
echo "======================================================================="
echo -e "${GREEN}[SUCCESS]${NC} RTDCS System Shutdown Complete"
echo "======================================================================="
echo ""
