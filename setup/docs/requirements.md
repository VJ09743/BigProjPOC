# Setup Wizard - Requirements Document

## 1. Problem Statement

The current `QUICK-START.md` assumes users are comfortable with terminals, git, package managers, and GitHub. Non-programmers lack this context and find the setup process overwhelming. Steps like "fork this repo", "brew install", or "export GITHUB_TOKEN" are barriers that prevent adoption by non-technical users.

## 2. Goal

Provide a **single-command setup experience** that guides non-programmers through the entire project setup via a visual, browser-based wizard. The user should never need to:
- Type terminal commands manually
- Understand git, forks, clones, or branches
- Edit configuration files or environment variables
- Know what a package manager is

## 3. Target Users

| User Type | Description | Needs |
|-----------|-------------|-------|
| Non-programmer | No terminal/git experience | Full hand-holding, visual UI, simple language |
| Beginner | Some tech exposure, not a developer | Guided setup with explanations |
| Experienced user | Developer comfortable with CLI | Can still use the wizard for convenience |

## 4. Functional Requirements

### 4.1 Entry Point

| ID | Requirement |
|----|-------------|
| FR-01 | Mac/Linux users can start the wizard by pasting a single `curl` command into Terminal |
| FR-02 | Windows users can start the wizard by pasting a single PowerShell command |
| FR-03 | The entry script must auto-detect the operating system (macOS, Linux distro, Windows version) |
| FR-04 | The entry script must check for Python 3 and install it if missing |
| FR-05 | The entry script must download the project files (tarball/zip) without requiring git |
| FR-06 | The entry script must launch the wizard automatically in the user's default browser |

### 4.2 Workflow Mode Selection

| ID | Requirement |
|----|-------------|
| FR-10 | User must be able to choose between "GitHub" mode and "Local" mode |
| FR-11 | GitHub mode: full workflow with version control, PRs, and code reviews |
| FR-12 | Local mode: everything stays on user's computer, no GitHub/internet needed after setup |
| FR-13 | Choosing "Local" mode must skip all GitHub-related screens (account, token, fork/clone, LLM provider) |

### 4.3 Prerequisites Installation

| ID | Requirement |
|----|-------------|
| FR-20 | Wizard must check if `git` is installed and show status |
| FR-21 | Wizard must check if `gh` (GitHub CLI) is installed and show status |
| FR-22 | Wizard must provide an "Install" button for each missing prerequisite |
| FR-23 | Installation must use the OS-appropriate package manager (brew/apt/dnf/pacman/winget/choco) |
| FR-24 | If auto-install fails, wizard must show manual install instructions with links |

### 4.4 GitHub Account

| ID | Requirement |
|----|-------------|
| FR-30 | Wizard must detect if the user is already signed in to GitHub (via `gh auth status`) |
| FR-31 | If signed in, show the username with a success indicator |
| FR-32 | If not signed in, provide a "Sign In" button that opens browser-based OAuth |
| FR-33 | If user has no account, provide a "Create Free Account" button linking to github.com/signup |
| FR-34 | Provide a "Refresh Status" button to re-check after user completes sign-in/sign-up |

### 4.5 GitHub Token

| ID | Requirement |
|----|-------------|
| FR-40 | Wizard must provide a clickable link to open the GitHub token settings page |
| FR-41 | Wizard must show step-by-step instructions with exact button names and scope checkboxes to select |
| FR-42 | Wizard must provide an input field to paste the token |
| FR-43 | Wizard must save the token to the user's environment (shell profile on Mac/Linux, user env var on Windows) |
| FR-44 | Wizard must authenticate the `gh` CLI with the provided token |

### 4.6 Fork & Clone (GitHub Mode)

| ID | Requirement |
|----|-------------|
| FR-50 | Wizard must fork the template repository under the user's GitHub account |
| FR-51 | Wizard must present suggested project locations (Desktop, Documents, Home) |
| FR-52 | Wizard must allow the user to type a custom folder path |
| FR-53 | Wizard must allow the user to set a custom project folder name |
| FR-54 | Wizard must clone the fork to the chosen location with the correct branch checked out |

### 4.7 Local File Copy (Local Mode)

| ID | Requirement |
|----|-------------|
| FR-60 | Wizard must copy all project files (minus `.git/`) from the downloaded tarball to the user's chosen location |
| FR-61 | Wizard must present the same folder picker as the GitHub fork/clone screen |
| FR-62 | No git, fork, or clone operations must occur in local mode |

### 4.8 LLM Provider Configuration (GitHub Mode)

| ID | Requirement |
|----|-------------|
| FR-70 | Wizard must list all 7 supported providers: Copilot, OpenAI, Anthropic, Gemini, Azure, Cohere, Mistral |
| FR-71 | Each provider must show cost indicator ($, $$, $$$, or FREE) |
| FR-72 | Selecting a provider must show provider-specific instructions for obtaining an API key |
| FR-73 | Each provider's instructions must include a clickable link to their API key page |
| FR-74 | GitHub Copilot must indicate that no API key is needed |
| FR-75 | Azure OpenAI must include an additional input for the endpoint URL |
| FR-76 | Wizard must save LLM_PROVIDER and LLM_API_KEY to the user's environment |
| FR-77 | If `gh` is authenticated, wizard should also save values as GitHub repository secrets |
| FR-78 | This screen must be skippable (it is optional) |

### 4.9 AI Tool Selection, Installation, and Launch

| ID | Requirement |
|----|-------------|
| FR-80 | Wizard must list available AI tools: Cursor, Windsurf, Claude Code, VS Code + Continue, VS Code + GitHub Copilot, Aider |
| FR-81 | Each tool must show name, description, and difficulty level |
| FR-82 | User must be able to select one tool |
| FR-83 | Wizard must install the selected tool using OS-appropriate methods |
| FR-84 | After installation, wizard must provide a "Launch" button |
| FR-85 | Launching must open the tool pointed at the cloned/copied project directory |
| FR-86 | The AI tool must automatically pick up its instruction file (.cursorrules, CLAUDE.md, etc.) from the project root |

### 4.10 Verification

| ID | Requirement |
|----|-------------|
| FR-90 | Wizard must provide a copy-paste verification prompt for the user to test in their AI tool |
| FR-91 | Expected answer must be clearly stated ("Product Owner") |
| FR-92 | If verification fails, wizard must provide a copy-paste fallback prompt per tool |
| FR-93 | Fallback prompt must instruct the AI tool to read its specific instruction file |
| FR-94 | Wizard must provide troubleshooting steps if fallback also fails |

### 4.11 Done Screen

| ID | Requirement |
|----|-------------|
| FR-100 | Wizard must show a summary of what was set up |
| FR-101 | Wizard must suggest what to do next (describe what you want to build) |
| FR-102 | Wizard must provide a "Close Wizard" button that shuts down the local server |

## 5. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Wizard must work on macOS 12+, Ubuntu 20.04+, Fedora 36+, Windows 10+ |
| NFR-02 | Wizard must use only Python 3 standard library (no pip packages) |
| NFR-03 | Entry scripts must work without git installed (use curl/wget for download) |
| NFR-04 | Wizard UI must be responsive and work on screens 320px+ wide |
| NFR-05 | All user-facing text must use plain, non-technical language |
| NFR-06 | Wizard must clean up temporary files when it exits |
| NFR-07 | Wizard server must bind to 127.0.0.1 only (not accessible from network) |
| NFR-08 | User tokens and API keys must only be stored locally, never transmitted to third parties |

## 6. Out of Scope (for initial version)

- Downloadable native executables (.dmg, .exe, .AppImage)
- Auto-update mechanism for the wizard itself
- Updating workflow files to make Product Owner the first agent (IT Agent removal)
- GitHub Codespaces / Gitpod integration
- Hosted web version
