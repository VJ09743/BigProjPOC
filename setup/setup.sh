#!/usr/bin/env bash
# =============================================================================
# Setup Wizard - Mac & Linux Entry Point
#
# Usage (one-liner for users):
#   curl -sL https://raw.githubusercontent.com/meenusinha/BigProjPOC/template/agentic-workflow-gui/setup/setup.sh | bash
#
# What this script does:
#   1. Detects OS (macOS vs Linux distro)
#   2. Checks/installs Python 3
#   3. Downloads the project repo as a tarball
#   4. Extracts it to a temp directory
#   5. Launches the setup wizard (opens in browser)
# =============================================================================

set -e

REPO_OWNER="meenusinha"
REPO_NAME="BigProjPOC"
# NOTE: Change this to "template/agentic-workflow-gui" after merging the PR.
# Using the working branch for pre-merge testing.
REPO_BRANCH="claude/create-setup-wizard-gOvpL"
TARBALL_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}/archive/refs/heads/${REPO_BRANCH}.tar.gz"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# --- Detect OS ---
detect_os() {
    case "$(uname -s)" in
        Darwin*)
            OS="mac"
            info "Detected: macOS $(sw_vers -productVersion 2>/dev/null || echo '')"
            ;;
        Linux*)
            OS="linux"
            if [ -f /etc/os-release ]; then
                . /etc/os-release
                info "Detected: ${NAME} ${VERSION_ID}"
                DISTRO_ID="${ID}"
            else
                info "Detected: Linux"
                DISTRO_ID="linux"
            fi
            ;;
        *)
            error "Unsupported OS: $(uname -s)"
            error "For Windows, use setup.ps1 instead."
            exit 1
            ;;
    esac
}

# --- Check/Install Python 3 ---
ensure_python() {
    # Check for python3
    if command -v python3 &>/dev/null; then
        PYTHON="python3"
        ok "Python 3 found: $(python3 --version)"
        return
    fi

    # Check for python (might be Python 3)
    if command -v python &>/dev/null; then
        PY_VER=$(python --version 2>&1)
        if echo "$PY_VER" | grep -q "Python 3"; then
            PYTHON="python"
            ok "Python 3 found: $PY_VER"
            return
        fi
    fi

    # Need to install Python 3
    warn "Python 3 not found. Installing..."

    if [ "$OS" = "mac" ]; then
        # macOS: try brew, then xcode python
        if command -v brew &>/dev/null; then
            info "Installing Python 3 via Homebrew..."
            brew install python3
        else
            info "Installing Homebrew first..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            # Add brew to PATH for this session
            if [ -f /opt/homebrew/bin/brew ]; then
                eval "$(/opt/homebrew/bin/brew shellenv)"
            fi
            brew install python3
        fi
    elif [ "$OS" = "linux" ]; then
        if command -v apt &>/dev/null; then
            info "Installing Python 3 via apt..."
            sudo apt update && sudo apt install -y python3
        elif command -v dnf &>/dev/null; then
            info "Installing Python 3 via dnf..."
            sudo dnf install -y python3
        elif command -v pacman &>/dev/null; then
            info "Installing Python 3 via pacman..."
            sudo pacman -S --noconfirm python
        elif command -v zypper &>/dev/null; then
            info "Installing Python 3 via zypper..."
            sudo zypper install -y python3
        else
            error "No supported package manager found. Please install Python 3 manually."
            exit 1
        fi
    fi

    # Verify installation
    if command -v python3 &>/dev/null; then
        PYTHON="python3"
        ok "Python 3 installed: $(python3 --version)"
    else
        error "Failed to install Python 3. Please install it manually."
        exit 1
    fi
}

# --- Download repo tarball ---
download_repo() {
    TEMP_DIR=$(mktemp -d)
    info "Downloading project files..."

    if command -v curl &>/dev/null; then
        curl -sL "$TARBALL_URL" | tar -xz -C "$TEMP_DIR"
    elif command -v wget &>/dev/null; then
        wget -qO- "$TARBALL_URL" | tar -xz -C "$TEMP_DIR"
    else
        error "Neither curl nor wget found. Please install one of them."
        exit 1
    fi

    # The tarball extracts to a directory like BigProjPOC-template-agentic-workflow-gui/
    # Find the extracted directory
    REPO_DIR=$(find "$TEMP_DIR" -maxdepth 1 -type d -name "${REPO_NAME}*" | head -1)

    if [ -z "$REPO_DIR" ] || [ ! -d "$REPO_DIR" ]; then
        error "Failed to download project files."
        rm -rf "$TEMP_DIR"
        exit 1
    fi

    ok "Project files downloaded to temporary directory."

    # Export so the wizard can find the full repo for local copy mode
    export WIZARD_REPO_PATH="$REPO_DIR"

    # Export the user's original working directory as a default project path
    export WIZARD_USER_CWD="$(pwd)"
}

# --- Launch wizard ---
launch_wizard() {
    info "Starting setup wizard..."
    echo ""
    echo "============================================"
    echo "  The wizard will open in your browser."
    echo "  If it doesn't open automatically,"
    echo "  look for the URL printed below."
    echo "============================================"
    echo ""

    # Run the wizard (run script directly to avoid 'setup' package name conflicts)
    PYTHONPATH="$REPO_DIR" $PYTHON "$REPO_DIR/setup/wizard/main.py"

    # Cleanup temp directory when done
    info "Cleaning up temporary files..."
    rm -rf "$TEMP_DIR"
    ok "Done!"
}

# --- Main ---
main() {
    echo ""
    echo "==============================="
    echo "  Project Setup Wizard"
    echo "==============================="
    echo ""

    detect_os
    ensure_python
    download_repo
    launch_wizard
}

main
