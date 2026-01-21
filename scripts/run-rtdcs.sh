#!/usr/bin/env bash
#
# RTDCS Launcher Script
# Launches all three RTDCS modules in separate terminal windows
#
# Author: Developer Agent
# Date: 2026-01-21
# Usage: ./scripts/run-rtdcs.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository root
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Executables
BIGMODULEA="$REPO_ROOT/release/bin/BigModuleA"
BIGMODULEB="$REPO_ROOT/release/bin/BigModuleB"
BIGMODULEC="$REPO_ROOT/release/bin/BigModuleC"

# Check if executables exist
if [ ! -f "$BIGMODULEA" ] || [ ! -f "$BIGMODULEB" ] || [ ! -f "$BIGMODULEC" ]; then
    echo -e "${RED}[ERROR]${NC} Executables not found in release/bin/"
    echo "Please run: make all"
    exit 1
fi

echo "======================================================================="
echo -e "${BLUE}RTDCS System Launcher${NC}"
echo "======================================================================="
echo ""

# Detect terminal emulator and OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    TERMINAL="Terminal.app"

    echo -e "${GREEN}[INFO]${NC} Launching on macOS using Terminal.app..."
    echo ""

    # Launch BigModuleA
    echo -e "${BLUE}[1/3]${NC} Launching BigModuleA (ThermalMonitor)..."
    osascript -e "tell app \"Terminal\" to do script \"cd '$REPO_ROOT' && echo 'BigModuleA - ThermalMonitor' && '$BIGMODULEA' --samples 0\""

    sleep 2

    # Launch BigModuleC
    echo -e "${BLUE}[2/3]${NC} Launching BigModuleC (CompensationController)..."
    osascript -e "tell app \"Terminal\" to do script \"cd '$REPO_ROOT' && echo 'BigModuleC - CompensationController' && '$BIGMODULEC' --port 9090\""

    sleep 2

    # Launch BigModuleB
    echo -e "${BLUE}[3/3]${NC} Launching BigModuleB (DistortionPredictor)..."
    osascript -e "tell app \"Terminal\" to do script \"cd '$REPO_ROOT' && echo 'BigModuleB - DistortionPredictor' && '$BIGMODULEB' --host localhost --port 9090 --samples 0\""

elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux - try different terminal emulators

    if command -v gnome-terminal &> /dev/null; then
        TERMINAL="gnome-terminal"
        echo -e "${GREEN}[INFO]${NC} Launching on Linux using gnome-terminal..."
        echo ""

        # Launch BigModuleA
        echo -e "${BLUE}[1/3]${NC} Launching BigModuleA (ThermalMonitor)..."
        gnome-terminal -- bash -c "cd '$REPO_ROOT' && echo 'BigModuleA - ThermalMonitor' && '$BIGMODULEA' --samples 0; exec bash"

        sleep 2

        # Launch BigModuleC
        echo -e "${BLUE}[2/3]${NC} Launching BigModuleC (CompensationController)..."
        gnome-terminal -- bash -c "cd '$REPO_ROOT' && echo 'BigModuleC - CompensationController' && '$BIGMODULEC' --port 9090; exec bash"

        sleep 2

        # Launch BigModuleB
        echo -e "${BLUE}[3/3]${NC} Launching BigModuleB (DistortionPredictor)..."
        gnome-terminal -- bash -c "cd '$REPO_ROOT' && echo 'BigModuleB - DistortionPredictor' && '$BIGMODULEB' --host localhost --port 9090 --samples 0; exec bash"

    elif command -v xterm &> /dev/null; then
        TERMINAL="xterm"
        echo -e "${GREEN}[INFO]${NC} Launching on Linux using xterm..."
        echo ""

        # Launch BigModuleA
        echo -e "${BLUE}[1/3]${NC} Launching BigModuleA (ThermalMonitor)..."
        xterm -e "cd '$REPO_ROOT' && echo 'BigModuleA - ThermalMonitor' && '$BIGMODULEA' --samples 0; bash" &

        sleep 2

        # Launch BigModuleC
        echo -e "${BLUE}[2/3]${NC} Launching BigModuleC (CompensationController)..."
        xterm -e "cd '$REPO_ROOT' && echo 'BigModuleC - CompensationController' && '$BIGMODULEC' --port 9090; bash" &

        sleep 2

        # Launch BigModuleB
        echo -e "${BLUE}[3/3]${NC} Launching BigModuleB (DistortionPredictor)..."
        xterm -e "cd '$REPO_ROOT' && echo 'BigModuleB - DistortionPredictor' && '$BIGMODULEB' --host localhost --port 9090 --samples 0; bash" &

    else
        echo -e "${YELLOW}[WARNING]${NC} No supported terminal emulator found (gnome-terminal, xterm)"
        echo "Falling back to background process mode..."
        echo ""
        echo -e "${BLUE}[1/3]${NC} Launching BigModuleA (ThermalMonitor) in background..."
        "$BIGMODULEA" --samples 0 > /tmp/rtdcs_bigmodulea.log 2>&1 &
        echo $! > /tmp/rtdcs_bigmodulea.pid

        sleep 2

        echo -e "${BLUE}[2/3]${NC} Launching BigModuleC (CompensationController) in background..."
        "$BIGMODULEC" --port 9090 > /tmp/rtdcs_bigmodulec.log 2>&1 &
        echo $! > /tmp/rtdcs_bigmodulec.pid

        sleep 2

        echo -e "${BLUE}[3/3]${NC} Launching BigModuleB (DistortionPredictor) in background..."
        "$BIGMODULEB" --host localhost --port 9090 --samples 0 > /tmp/rtdcs_bigmoduleb.log 2>&1 &
        echo $! > /tmp/rtdcs_bigmoduleb.pid

        echo ""
        echo -e "${YELLOW}[INFO]${NC} Modules running in background. Logs in /tmp/rtdcs_*.log"
        echo "To stop: ./scripts/stop-rtdcs.sh"
    fi
else
    echo -e "${RED}[ERROR]${NC} Unsupported OS: $OSTYPE"
    exit 1
fi

echo ""
echo "======================================================================="
echo -e "${GREEN}[SUCCESS]${NC} RTDCS System Launched!"
echo "======================================================================="
echo ""
echo "Three terminal windows should have opened:"
echo "  1. BigModuleA (ThermalMonitor) - Simulates temperature"
echo "  2. BigModuleC (CompensationController) - RPC server"
echo "  3. BigModuleB (DistortionPredictor) - Prediction loop"
echo ""
echo "To stop all modules:"
echo "  • Press Ctrl+C in each terminal window, OR"
echo "  • Run: ./scripts/stop-rtdcs.sh"
echo ""
echo "To check status:"
echo "  • Run: ./scripts/check-rtdcs.sh"
echo ""
echo "======================================================================="
