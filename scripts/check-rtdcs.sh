#!/usr/bin/env bash
#
# RTDCS Status Checker
# Checks if RTDCS modules are running
#
# Author: Developer Agent
# Date: 2026-01-21
# Usage: ./scripts/check-rtdcs.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "======================================================================="
echo -e "${BLUE}RTDCS System Status${NC}"
echo "======================================================================="
echo ""

# Check BigModuleA
BIGMODULEA_PID=$(pgrep -f "BigModuleA" || true)
if [ -n "$BIGMODULEA_PID" ]; then
    echo -e "${GREEN}✓${NC} BigModuleA (ThermalMonitor) is running (PID: $BIGMODULEA_PID)"
else
    echo -e "${RED}✗${NC} BigModuleA (ThermalMonitor) is NOT running"
fi

# Check BigModuleB
BIGMODULEB_PID=$(pgrep -f "BigModuleB" || true)
if [ -n "$BIGMODULEB_PID" ]; then
    echo -e "${GREEN}✓${NC} BigModuleB (DistortionPredictor) is running (PID: $BIGMODULEB_PID)"
else
    echo -e "${RED}✗${NC} BigModuleB (DistortionPredictor) is NOT running"
fi

# Check BigModuleC
BIGMODULEC_PID=$(pgrep -f "BigModuleC" || true)
if [ -n "$BIGMODULEC_PID" ]; then
    echo -e "${GREEN}✓${NC} BigModuleC (CompensationController) is running (PID: $BIGMODULEC_PID)"
else
    echo -e "${RED}✗${NC} BigModuleC (CompensationController) is NOT running"
fi

echo ""

# Check shared memory
echo "Shared Memory Status:"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if [ -e "/tmp/rtdcs_shared_state" ]; then
        SHM_SIZE=$(stat -f%z "/tmp/rtdcs_shared_state" 2>/dev/null || echo "unknown")
        echo -e "  ${GREEN}✓${NC} Shared memory exists: /tmp/rtdcs_shared_state ($SHM_SIZE bytes)"
    else
        echo -e "  ${RED}✗${NC} Shared memory not found: /tmp/rtdcs_shared_state"
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if [ -e "/dev/shm/rtdcs_shared_state" ]; then
        SHM_SIZE=$(stat -c%s "/dev/shm/rtdcs_shared_state" 2>/dev/null || echo "unknown")
        echo -e "  ${GREEN}✓${NC} Shared memory exists: /dev/shm/rtdcs_shared_state ($SHM_SIZE bytes)"
    else
        echo -e "  ${RED}✗${NC} Shared memory not found: /dev/shm/rtdcs_shared_state"
    fi
fi

echo ""

# Check Thrift RPC port
echo "Thrift RPC Status:"
if command -v lsof &> /dev/null; then
    if lsof -i :9090 -sTCP:LISTEN &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Port 9090 is listening (Thrift RPC server)"
    else
        echo -e "  ${RED}✗${NC} Port 9090 is not listening"
    fi
elif command -v netstat &> /dev/null; then
    if netstat -an | grep -q ":9090.*LISTEN"; then
        echo -e "  ${GREEN}✓${NC} Port 9090 is listening (Thrift RPC server)"
    else
        echo -e "  ${RED}✗${NC} Port 9090 is not listening"
    fi
else
    echo -e "  ${YELLOW}?${NC} Cannot check port status (lsof/netstat not available)"
fi

echo ""

# Summary
TOTAL_RUNNING=0
[ -n "$BIGMODULEA_PID" ] && ((TOTAL_RUNNING++)) || true
[ -n "$BIGMODULEB_PID" ] && ((TOTAL_RUNNING++)) || true
[ -n "$BIGMODULEC_PID" ] && ((TOTAL_RUNNING++)) || true

if [ "$TOTAL_RUNNING" -eq 3 ]; then
    echo -e "${GREEN}[SYSTEM STATUS]${NC} All 3 modules are running (HEALTHY)"
elif [ "$TOTAL_RUNNING" -gt 0 ]; then
    echo -e "${YELLOW}[SYSTEM STATUS]${NC} $TOTAL_RUNNING/3 modules are running (PARTIAL)"
else
    echo -e "${RED}[SYSTEM STATUS]${NC} No modules are running (DOWN)"
fi

echo ""
echo "======================================================================="

# Exit code based on status
if [ "$TOTAL_RUNNING" -eq 3 ]; then
    exit 0  # All running
elif [ "$TOTAL_RUNNING" -gt 0 ]; then
    exit 1  # Partial
else
    exit 2  # None running
fi
