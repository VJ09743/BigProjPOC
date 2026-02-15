# Setup Wizard - Engineering Design Specification (EDS)

## 1. Overview

The setup wizard is a browser-based GUI that runs locally on the user's machine. A Python HTTP server serves a single-page web application and exposes JSON API endpoints. The browser UI communicates with the Python backend to perform installations, configurations, and system operations.

```
User pastes one command in Terminal/PowerShell
         |
         v
   setup.sh / setup.ps1
   (detects OS, installs Python, downloads repo tarball)
         |
         v
   python -m setup.wizard.main
   (starts HTTP server on localhost:PORT)
         |
         v
   Browser opens http://127.0.0.1:PORT
   (wizard UI with 9 screens)
         |
    [Browser] <--JSON API--> [Python Server]
         |                        |
    (user clicks)          (installs tools,
                            runs commands,
                            saves config)
```

## 2. Architecture

### 2.1 Directory Structure

```
setup/
├── setup.sh                  # Entry point: Mac & Linux
├── setup.ps1                 # Entry point: Windows (PowerShell)
├── .gitignore                # Exclude __pycache__
├── docs/
│   ├── requirements.md       # This requirements document
│   └── design.md             # This design document
└── wizard/
    ├── __init__.py
    ├── main.py               # HTTP server, browser launcher
    ├── api.py                # API endpoint router and handlers
    ├── installers/           # OS-specific installation logic
    │   ├── __init__.py
    │   ├── mac.py            # Homebrew, brew install, open -a
    │   ├── linux.py          # apt/dnf/pacman detection, package install
    │   └── windows.py        # winget/choco, PowerShell commands
    ├── utils/                # Shared utilities
    │   ├── __init__.py
    │   ├── os_detect.py      # OS type, version, package manager detection
    │   ├── shell.py          # Command execution, tool detection
    │   └── config.py         # Environment variable persistence
    └── web/                  # Static files served to browser
        ├── index.html        # Single-page wizard (all 9 screens)
        ├── styles.css        # UI styling
        └── wizard.js         # Screen navigation, API calls, state
```

### 2.2 Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `setup.sh` | Mac/Linux bootstrap: detect OS, install Python 3, download repo tarball via curl, extract, launch wizard |
| `setup.ps1` | Windows bootstrap: detect OS, install Python 3, download repo zip via Invoke-WebRequest, extract, launch wizard |
| `main.py` | Start `http.server.HTTPServer` on a free port, serve static files from `web/`, route `/api/*` to `api.py`, open browser |
| `api.py` | Central API router. Delegates to installers and utils. Returns JSON for all endpoints. |
| `installers/*.py` | OS-specific logic for installing git, gh, and AI tools. Each module exposes `install_git()`, `install_gh()`, `install_ai_tool(tool)`, `launch_ai_tool(tool, path)` |
| `utils/os_detect.py` | Detects OS type, version, Linux distro, and available package manager |
| `utils/shell.py` | Runs shell commands with timeout, captures output, checks if tools are installed |
| `utils/config.py` | Saves environment variables to shell profile (Mac/Linux) or user env (Windows) |
| `web/index.html` | All 9 wizard screens as hidden/shown divs in a single page |
| `web/wizard.js` | Client-side state management, screen navigation with skip logic, API fetch calls |
| `web/styles.css` | Clean, modern styling. Responsive down to 320px. |

## 3. Entry Point Flow (Bootstrapping)

### 3.1 The Chicken-and-Egg Problem

The wizard needs Python to run, but the user may not have Python. The wizard is inside the repo, but the user doesn't have the repo yet. The entry scripts solve both problems:

### 3.2 Mac/Linux (`setup.sh`)

```
curl -sL <raw-url>/setup/setup.sh | bash
```

1. **Detect OS**: `uname -s` → Darwin (macOS) or Linux. On Linux, read `/etc/os-release` for distro.
2. **Ensure Python 3**:
   - Check `python3` / `python` commands
   - If missing: install via brew (macOS) or apt/dnf/pacman (Linux)
   - If brew missing on macOS: install Homebrew first
3. **Download repo tarball**:
   - `curl -sL https://github.com/<owner>/<repo>/archive/refs/heads/<branch>.tar.gz | tar -xz -C $TEMP_DIR`
   - This downloads the entire branch as an archive — no git required
   - The tarball contains all project files including `setup/wizard/`
4. **Set `WIZARD_REPO_PATH`**: env var pointing to extracted repo (used by local-copy mode)
5. **Launch**: `python3 -m setup.wizard.main`
6. **Cleanup**: Remove temp directory when wizard exits

### 3.3 Windows (`setup.ps1`)

```powershell
irm <raw-url>/setup/setup.ps1 | iex
```

Same flow but using PowerShell equivalents:
- `Invoke-WebRequest` instead of `curl`
- `Expand-Archive` instead of `tar`
- `winget install Python.Python.3.12` or direct installer download

### 3.4 Why Tarball (Approach B)?

| Approach | Pros | Cons |
|----------|------|------|
| A. Download files individually | Simple | Brittle — must update file list when adding files |
| **B. Download tarball/zip** | **Single download, auto-includes new files** | **Slightly larger download** |
| C. `git clone --sparse` | Minimal download | Requires git already installed |

Approach B was chosen because it has no git dependency and no maintenance burden.

## 4. Web Server Design

### 4.1 Server (`main.py`)

- Uses Python's built-in `http.server.HTTPServer` — zero dependencies
- Binds to `127.0.0.1` on a random free port (security: not network-accessible)
- `WizardHandler` extends `SimpleHTTPRequestHandler`:
  - `GET /*` → serves static files from `web/`
  - `GET /api/*` → routes to API handler
  - `POST /api/*` → routes to API handler with JSON body
  - `OPTIONS /api/*` → CORS preflight support
- Browser opened via `webbrowser.open()` in a daemon thread
- Server shutdown via `/api/shutdown` endpoint or Ctrl+C

### 4.2 API Layer (`api.py`)

All endpoints return JSON. POST endpoints accept JSON body.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/os-info` | Returns OS type, version, display name, package manager |
| GET | `/api/prerequisites/status` | Returns install status and version of git and gh |
| POST | `/api/prerequisites/install` | Installs git or gh. Body: `{"tool": "git"}` |
| GET | `/api/github/auth-status` | Checks `gh auth status`, returns authenticated/username |
| POST | `/api/github/login` | Triggers `gh auth login --web` for browser OAuth |
| POST | `/api/github/token` | Saves token to env and authenticates gh. Body: `{"token": "ghp_..."}` |
| POST | `/api/github/fork-clone` | Forks repo and clones to path. Body: `{"path": "...", "project_name": "..."}` |
| POST | `/api/llm/configure` | Saves LLM provider, API key, and optional Azure endpoint |
| GET | `/api/tools/list` | Returns available AI tools with metadata |
| POST | `/api/tools/install` | Installs selected tool. Body: `{"tool": "cursor"}` |
| POST | `/api/tools/launch` | Launches tool at project path. Body: `{"tool": "cursor", "project_path": "..."}` |
| POST | `/api/local/copy` | Copies project files to path (no git). Body: `{"path": "...", "project_name": "..."}` |
| GET | `/api/paths/suggested` | Returns suggested project locations (Desktop, Documents, etc.) |
| GET | `/api/shutdown` | Shuts down the wizard server |

### 4.3 Installer Selection

`api.py` dynamically selects the correct installer module based on detected OS:

```python
def _get_installer():
    info = get_os_info()
    if info["os"] == "mac":
        from setup.wizard.installers import mac
        return mac
    elif info["os"] == "linux":
        from setup.wizard.installers import linux
        return linux
    elif info["os"] == "windows":
        from setup.wizard.installers import windows
        return windows
```

Each installer module implements the same interface:
- `install_git()` → dict with success, message
- `install_gh()` → dict with success, message
- `install_ai_tool(tool)` → dict with success, message
- `launch_ai_tool(tool, project_path)` → dict with success, message

## 5. Wizard UI Design

### 5.1 Screen Flow

```
[0. Welcome]
     |
[1. Workflow Mode] ──── "Local" ────────────────────┐
     |                                               |
     | "GitHub"                                      |
     v                                               |
[2. Prerequisites]                                   |
     |                                               |
[3. GitHub Account]                                  |
     |                                          (skipped)
[4. GitHub Token]                                    |
     |                                               |
[5. Fork & Clone] ─── or ─── [5. Local Copy] <──────┘
     |                              |
[6. LLM Provider (optional)]  (skipped)
     |                              |
     └──────────┬───────────────────┘
                v
[7. AI Tool Selection]
     |
[8. Verification]
     |
[9. Done]
```

### 5.2 Skip Logic

When user selects "Local" mode, the JavaScript `nextScreen()` and `prevScreen()` functions skip screen indices `[3, 4, 5, 6]` (GitHub Account, Token, Fork/Clone, LLM Provider). Screen 5 has two sections — `fork-clone-section` and `local-copy-section` — toggled by `selectWorkflow()`.

### 5.3 State Management

Client-side state is a simple JavaScript object:

```javascript
const state = {
  currentScreen: 0,       // Active screen index
  totalScreens: 9,        // Total number of screens
  workflowMode: null,     // 'github' or 'local'
  osInfo: null,           // From /api/os-info
  projectPath: null,      // Where project was cloned/copied
  selectedTool: null,     // AI tool ID (e.g., 'cursor')
  selectedProvider: null,  // LLM provider ID (e.g., 'openai')
};
```

### 5.4 UI Components

| Component | CSS Class | Description |
|-----------|-----------|-------------|
| Radio group | `.radio-option` | Clickable cards with radio buttons (workflow, providers) |
| Status list | `.status-item` | Shows install status with icon, label, version, action button |
| Tool grid | `.tool-card` | 2-column grid of selectable AI tool cards |
| Copy box | `.copy-box` | Dark-themed box with text and "Copy" button |
| Instructions | `.instructions` | Numbered step-by-step guides |
| Alerts | `.alert` | Info/success/warning/danger notification banners |
| Progress bar | `.progress-bar` | Segmented bar showing wizard progress |

## 6. OS-Specific Installer Details

### 6.1 macOS (`mac.py`)

| Tool | Install Method |
|------|---------------|
| Homebrew | Official install script via curl |
| git | `xcode-select --install` (preferred) or `brew install git` |
| gh | `brew install gh` |
| Cursor | `brew install --cask cursor` |
| Windsurf | `brew install --cask windsurf` |
| Claude Code | `npm install -g @anthropic-ai/claude-code` (installs Node.js via brew if needed) |
| VS Code + Continue | `brew install --cask visual-studio-code` + `code --install-extension continue.continue` |
| VS Code + Copilot | `brew install --cask visual-studio-code` + `code --install-extension GitHub.copilot GitHub.copilot-chat` |
| Aider | `pip3 install aider-chat` |

Tool launch: `open -a <AppName> "<project_path>"` or `osascript` for terminal-based tools.

### 6.2 Linux (`linux.py`)

| Package Manager | Detection | Install Command |
|----------------|-----------|-----------------|
| apt (Debian/Ubuntu) | `which apt` | `sudo apt update && sudo apt install -y <pkg>` |
| dnf (Fedora) | `which dnf` | `sudo dnf install -y <pkg>` |
| pacman (Arch) | `which pacman` | `sudo pacman -S --noconfirm <pkg>` |
| yum (RHEL/CentOS) | `which yum` | `sudo yum install -y <pkg>` |
| zypper (openSUSE) | `which zypper` | `sudo zypper install -y <pkg>` |

gh CLI on Debian/Ubuntu uses the official GitHub apt repository (requires adding GPG key and source).

Tool launch: Detects terminal emulator (`gnome-terminal`, `xterm`, `konsole`, `xfce4-terminal`) for CLI-based tools.

### 6.3 Windows (`windows.py`)

| Tool | Primary Method | Fallback |
|------|---------------|----------|
| git | `winget install Git.Git` | `choco install git` |
| gh | `winget install GitHub.cli` | `choco install gh` |
| Cursor | `winget install Anysphere.Cursor` | Manual download link |
| Windsurf | `winget install Codeium.Windsurf` | Manual download link |
| Claude Code | `npm install -g @anthropic-ai/claude-code` | Requires Node.js |
| VS Code + Continue | `winget install Microsoft.VisualStudioCode` + Continue ext | Manual download link |
| VS Code + Copilot | `winget install Microsoft.VisualStudioCode` + Copilot ext | Manual download link |

Tool launch: `start "" <tool> "<project_path>"` or `start cmd /k` for terminal-based tools.

## 7. Security Considerations

| Concern | Mitigation |
|---------|------------|
| Server accessibility | Binds to `127.0.0.1` only, not `0.0.0.0` |
| Token handling | Tokens are saved locally (shell profile or user env vars), never transmitted |
| GitHub OAuth | Uses `gh auth login --web` (official GitHub OAuth flow in browser) |
| curl pipe to bash | Standard pattern (used by Homebrew, Rust, nvm). User can download and inspect script first. |
| Sudo operations | Only used for package installation on Linux. Wizard never runs as root itself. |

## 8. Verification Strategy

The wizard cannot programmatically confirm that an AI tool has loaded its instruction file — no tool exposes such an API. Instead, a three-layer approach:

1. **Precondition check**: Verify the instruction file exists at the expected path in the project
2. **User verification prompt**: Ask the user to paste "What is the first agent role you adopt for any task?" into the AI tool's chat. Expected answer: "Product Owner."
3. **Fallback fix prompt**: If verification fails, provide a per-tool copy-paste prompt that tells the AI to read its specific instruction file

| AI Tool | Instruction File | Fallback Prompt |
|---------|-----------------|-----------------|
| Cursor | `.cursorrules` | "Read .cursorrules in the project root..." |
| Windsurf | `.windsurfrules` | "Read .windsurfrules in the project root..." |
| Claude Code | `CLAUDE.md` | "Read CLAUDE.md in the project root..." |
| VS Code + Continue | `.continuerules` | "Read .continuerules in the project root..." |
| VS Code + Copilot | `.github/copilot-instructions.md` | "Read .github/copilot-instructions.md in the project root..." |
| Aider | `.aider.conf.yml` | "Read .aider.conf.yml in the project root..." |

## 9. Dependencies

The wizard is designed to have **zero external Python dependencies**. All imports are from the Python 3 standard library:

- `http.server` — HTTP server
- `json` — JSON serialization
- `os`, `platform`, `shutil` — OS operations
- `subprocess` — Command execution
- `socket` — Free port detection
- `webbrowser` — Browser launch
- `threading` — Non-blocking browser open and server shutdown

## 10. Future Enhancements

| Enhancement | Description |
|-------------|-------------|
| Native executables | Build .dmg/.exe/.AppImage using PyInstaller or Tauri for true double-click experience |
| Codespaces integration | Add `.devcontainer/` config and "Open in Codespaces" button |
| Workflow file updates | Make Product Owner the first agent (remove IT Agent as first step since wizard handles prerequisites) |
| Progress persistence | Save wizard state so users can resume if they close the browser |
| Telemetry (opt-in) | Track which steps fail most to improve the wizard |
| Auto-update | Check for newer wizard version on launch |
