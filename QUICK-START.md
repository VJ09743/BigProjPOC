# Quick Start Guide

Welcome! This guide will help you set up the AI-assisted workflow.

**No programming experience required.**

> **New here?** First, [fork this template](README.md#fork-this-template) to create your own copy, then follow the steps below.

---

## Prerequisites - IMPORTANT!

Before choosing an AI tool path, you **MUST** set up these prerequisites:

### 1. Git Installation
- **Mac**: `brew install git`
- **Windows**: Download from https://git-scm.com/
- **Linux**: `sudo apt install git`

### 2. GitHub Account
- Go to https://github.com and sign up (or sign in)
- You'll need this for automatic PR creation

### 3. GitHub Token (REQUIRED for PR creation)

The AI agents will automatically create Pull Requests, which requires GitHub authentication:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "AI Agents")
4. Select these scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `workflow` - Update GitHub Actions workflows
   - ✅ `admin:repo_hook` - Access to hooks
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### 4. Save GitHub Token to Environment

**On Mac/Linux:**
```bash
echo 'export GITHUB_TOKEN="your_github_token_here"' >> ~/.bashrc
source ~/.bashrc
```

**On Windows (PowerShell as Administrator):**
```powershell
[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "your_github_token_here", "User")
$env:GITHUB_TOKEN = "your_github_token_here"
```

### 5. Install `gh` CLI (for automatic PR creation)

**On Mac:**
```bash
brew install gh
```

**On Windows (PowerShell as Administrator):**
```powershell
winget install GitHub.cli --accept-package-agreements --accept-source-agreements
```

**On Linux (Ubuntu/Debian):**
```bash
sudo apt update && sudo apt install -y gh
```

**Verify installation:**
```bash
gh auth status
```

---

## ✅ Setup Checklist

Before proceeding to "Choose Your Path", verify:

- [ ] Git is installed (`git --version`)
- [ ] GitHub account created
- [ ] GitHub token created and saved to `GITHUB_TOKEN` environment variable
- [ ] `gh` CLI installed (`gh --version`)
- [ ] `gh auth status` shows you're authenticated

**If all checkboxes pass**, you're ready to proceed! 🚀

---

## Choose Your Path

Pick ONE path based on which AI tool you want to use:

| Path | AI Tool | Best For | Difficulty |
|------|---------|----------|------------|
| [Path A](#path-a-claude-code--anthropic) | Claude Code + Anthropic | Software projects | Easy (CLI) |
| [Path B](#path-b-cursor-ide) | Cursor IDE | Beginners, visual interface | Easiest (GUI) |
| [Path C](#path-c-windsurf-ide) | Windsurf IDE | Beginners, visual interface | Easiest (GUI) |
| [Path D](#path-d-aider--google-gemini) | Aider + Google Gemini | Budget-conscious | Easy (CLI) |
| [Path E](#path-e-aider--openai) | Aider + OpenAI | GPT-4 users | Easy (CLI) |
| [Path F](#path-f-continue-extension) | Continue + VS Code | VS Code users | Easy (Extension) |

**Recommended**: Path A (Claude Code) for best software development experience.

---

## Path A: Claude Code + Anthropic

**Best for**: Software projects, most capable for coding tasks.

### Step 1: Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Create an account (or sign in)
3. Go to **API Keys** section
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-...`)

### Step 2: Save Your API Key

**On Mac/Linux:**
```bash
echo 'export ANTHROPIC_API_KEY="your-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**On Windows:**
1. Search for "Environment Variables" in Start menu
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "User variables", click "New"
5. Variable name: `ANTHROPIC_API_KEY`
6. Variable value: your API key
7. Click OK

### Step 3: Install Claude Code

**On Mac:**
```bash
# Install Node.js if needed
if ! command -v node &> /dev/null; then
    brew install node || { /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && brew install node; }
fi
# Install Claude Code
npm install -g @anthropic-ai/claude-code
```

**On Windows (PowerShell as Administrator):**
```powershell
# Install Node.js if needed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}
# Install Claude Code
npm install -g @anthropic-ai/claude-code
```

**On Linux (Ubuntu/Debian):**
```bash
# Install Node.js if needed
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt install -y nodejs
fi
# Install Claude Code
npm install -g @anthropic-ai/claude-code
```

### Step 4: Start Building

```bash
cd /path/to/your/project
claude
```

Now describe what you want to build! [Jump to examples](#example-requests)

---

## Path B: Cursor IDE

**Best for**: Beginners who prefer a visual interface. Works with any AI provider.

### Step 1: Get an API Key

Choose ONE provider:

**Option 1 - Anthropic (Recommended):**
1. Go to https://console.anthropic.com/
2. Create account → API Keys → Create Key
3. Copy the key (starts with `sk-ant-...`)

**Option 2 - OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create account → Create new secret key
3. Copy the key (starts with `sk-...`)

### Step 2: Install Cursor

1. Go to https://cursor.sh
2. Download for your operating system
3. Install and open Cursor

### Step 3: Configure API Key in Cursor

1. Open Cursor Settings (Cmd+, on Mac, Ctrl+, on Windows)
2. Go to **Models** section
3. Add your API key for your chosen provider
4. Select your preferred model

### Step 4: Start Building

1. Click **File** → **Open Folder**
2. Select your project folder
3. Press **Cmd+K** (Mac) or **Ctrl+K** (Windows) to chat with AI

Now describe what you want to build! [Jump to examples](#example-requests)

---

## Path C: Windsurf IDE

**Best for**: Beginners who prefer a visual interface with AI-first design.

### Step 1: Get an API Key

Choose ONE provider:

**Option 1 - Anthropic (Recommended):**
1. Go to https://console.anthropic.com/
2. Create account → API Keys → Create Key
3. Copy the key (starts with `sk-ant-...`)

**Option 2 - OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create account → Create new secret key
3. Copy the key (starts with `sk-...`)

### Step 2: Install Windsurf

1. Go to https://codeium.com/windsurf
2. Download for your operating system
3. Install and open Windsurf

### Step 3: Configure API Key

1. Open Windsurf Settings
2. Navigate to AI/Model settings
3. Add your API key
4. Select your preferred model

### Step 4: Start Building

1. Open your project folder in Windsurf
2. Use the AI chat panel to describe what you want

Now describe what you want to build! [Jump to examples](#example-requests)

---

## Path D: Aider + Google Gemini

**Best for**: Budget-conscious users, Google ecosystem.

### Step 1: Get Your Google API Key

1. Go to https://aistudio.google.com/
2. Sign in with Google account
3. Click **"Get API Key"**
4. Create and copy the key

### Step 2: Save Your API Key

**On Mac/Linux:**
```bash
echo 'export GOOGLE_API_KEY="your-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**On Windows:**
1. Search for "Environment Variables" in Start menu
2. Click "Edit the system environment variables"
3. Click "Environment Variables" → "New"
4. Variable name: `GOOGLE_API_KEY`
5. Variable value: your API key
6. Click OK

### Step 3: Install Aider

**On Mac:**
```bash
# Install Python if needed
if ! command -v python3 &> /dev/null; then
    brew install python3 || { /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && brew install python3; }
fi
pip3 install aider-chat
```

**On Windows (PowerShell as Administrator):**
```powershell
# Install Python if needed
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    winget install Python.Python.3.11 --accept-package-agreements --accept-source-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}
pip install aider-chat
```

**On Linux (Ubuntu/Debian):**
```bash
# Install Python if needed
if ! command -v python3 &> /dev/null; then
    sudo apt update && sudo apt install -y python3 python3-pip
fi
pip3 install aider-chat
```

### Step 4: Start Building

```bash
cd /path/to/your/project
aider --model gemini/gemini-1.5-pro-latest
```

Now describe what you want to build! [Jump to examples](#example-requests)

---

## Path E: Aider + OpenAI

**Best for**: GPT-4 users, OpenAI ecosystem.

### Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/signup
2. Create an account (or sign in)
3. Go to https://platform.openai.com/api-keys
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)

### Step 2: Save Your API Key

**On Mac/Linux:**
```bash
echo 'export OPENAI_API_KEY="your-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**On Windows:**
1. Search for "Environment Variables" in Start menu
2. Click "Edit the system environment variables"
3. Click "Environment Variables" → "New"
4. Variable name: `OPENAI_API_KEY`
5. Variable value: your API key
6. Click OK

### Step 3: Install Aider

**On Mac:**
```bash
# Install Python if needed
if ! command -v python3 &> /dev/null; then
    brew install python3 || { /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && brew install python3; }
fi
pip3 install aider-chat
```

**On Windows (PowerShell as Administrator):**
```powershell
# Install Python if needed
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    winget install Python.Python.3.11 --accept-package-agreements --accept-source-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}
pip install aider-chat
```

**On Linux (Ubuntu/Debian):**
```bash
# Install Python if needed
if ! command -v python3 &> /dev/null; then
    sudo apt update && sudo apt install -y python3 python3-pip
fi
pip3 install aider-chat
```

### Step 4: Start Building

```bash
cd /path/to/your/project
aider
```

Now describe what you want to build! [Jump to examples](#example-requests)

---

## Path F: Continue Extension

**Best for**: VS Code users who want AI assistance in their existing editor.

### Step 1: Get an API Key

Choose ONE provider:

**Option 1 - Anthropic (Recommended):**
1. Go to https://console.anthropic.com/
2. Create account → API Keys → Create Key
3. Copy the key (starts with `sk-ant-...`)

**Option 2 - OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create account → Create new secret key
3. Copy the key (starts with `sk-...`)

### Step 2: Install Continue

1. Open VS Code
2. Go to Extensions (Cmd+Shift+X on Mac, Ctrl+Shift+X on Windows)
3. Search for "Continue"
4. Click Install

### Step 3: Configure Continue

1. Click the Continue icon in the sidebar
2. Go to Settings
3. Add your API key
4. Select your preferred model

### Step 4: Start Building

1. Open your project folder in VS Code
2. Use the Continue panel to chat with AI

Now describe what you want to build! [Jump to examples](#example-requests)

---

## After Setup: How the Agentic Workflow Works

Once you're set up, the AI follows a structured workflow:

```
You describe what you want
         ↓
   Product Owner
   (Understands your request, creates plan)
         ↓
      Architect
   (Designs the solution)
         ↓
      Developer
   (Writes the code)
         ↓
       Tester
   (Validates it works)
         ↓
   Product Owner
   (Reviews and presents to you)
```

**Important**: The AI will automatically:
1. Start as **Product Owner** to understand your request
2. Update project documentation with your domain info
3. Follow the complete workflow for quality results
4. **Automatically create Pull Requests** using your GitHub token

### Branching Strategy

For each task, the AI uses this branch structure:

- **Base branch**: `template/agentic-workflow` (template for all tasks)
- **Task branch**: `master_{task_name}` (e.g., `master_login-feature`)
  - Created once per task
  - All agents work from this branch
  - All PRs merge into this branch
- **Agent branches**: `claude/{agent}-{task_name}-{sessionID}`
  - Created per agent (Developer, Architect, Tester, etc.)
  - Agent works on their task
  - Creates PR to `master_{task_name}`

**Example**: For "Create a login page" task:
```
template/agentic-workflow
  └─→ master_login-page (Product Owner creates this)
        ├─→ claude/architect-login-page-abc123 (Architect's work)
        ├─→ claude/developer-login-page-abc123 (Developer's work)
        └─→ claude/tester-login-page-abc123 (Tester's work)
```

See [Task-Based Branching Strategy](AI-WORKFLOW.md#task-based-branching-strategy) for details.

---

## Example Requests

Just describe what you want in plain English!

**Building something new:**
> "I want to create a simple todo list application where users can add, complete, and delete tasks"

**Adding a feature:**
> "Add a search feature so users can find items by name"

**Fixing a problem:**
> "Users are reporting that the save button doesn't work on mobile devices"

**Understanding the code:**
> "Explain how the login system works"

---

## Quick Reference

| What you want | What to say |
|---------------|-------------|
| Build new feature | "Create a [feature] that does [what]" |
| Fix a bug | "Fix the issue where [problem]" |
| Understand code | "Explain how [feature] works" |
| Improve something | "Make [feature] faster/better/simpler" |
| Add tests | "Add tests for [feature]" |

---

## Project Structure

```
your-project/
├── CLAUDE.md             ← AI workflow instructions (Claude Code)
├── .cursorrules          ← AI workflow instructions (Cursor)
├── .windsurfrules        ← AI workflow instructions (Windsurf)
├── .continuerules        ← AI workflow instructions (Continue)
├── .aider.conf.yml       ← AI workflow instructions (Aider)
│
├── ai-assistants/        ← AI configuration
├── project-management/   ← Documentation and tasks
│   └── tasks/backlog/    ← User stories go here
├── modules/              ← Your software code
├── scripts/              ← Build, test, run scripts
├── output/               ← Built software
└── AI-WORKFLOW.md        ← Full workflow documentation
```

---

## Troubleshooting

### "API key not found" error
- Make sure you saved the key correctly
- Close and reopen your terminal
- Check for extra spaces in the key

### "GITHUB_TOKEN not set" error
- GitHub token is required for automatic PR creation
- Set it: `export GITHUB_TOKEN="your_token_here"`
- Verify: `echo $GITHUB_TOKEN`
- See [Prerequisites](#prerequisites---important) section

### "`gh` command not found" error
- `gh` CLI is required for automatic PR creation
- Install it from [Prerequisites](#prerequisites---important) section
- Verify: `gh --version`
- Authenticate: `gh auth login`

### "gh: authentication failed" error
- Run: `gh auth login`
- Select "GitHub.com"
- Select "HTTPS" protocol
- Select "Paste an authentication token"
- Paste your GitHub token (from Prerequisites)

### "Command not found" error
- Make sure you installed the tool
- Close and reopen your terminal
- On Windows, run as Administrator

### AI doesn't follow the workflow
- The AI config files (CLAUDE.md, .cursorrules, etc.) instruct the AI
- If issues persist, tell the AI: "Please follow the agentic workflow in AI-WORKFLOW.md"

### AI gives wrong answers
- Be more specific in your request
- Provide examples of what you want
- Break big requests into smaller steps

### PR creation fails
- Verify `GITHUB_TOKEN` is set: `echo $GITHUB_TOKEN`
- Verify `gh` is installed: `gh --version`
- Verify authentication: `gh auth status`
- See Prerequisites section if any fail

### Need more help?
- See `ai-assistants/how-to-use.md` for detailed guide
- See `AI-WORKFLOW.md` for full workflow documentation

---

## Cost Awareness

Using AI APIs costs money per request.

**Approximate costs:**
- Simple question: ~$0.01
- Small feature: ~$0.10
- Large feature: ~$1.00+

The **Cost Analyst** agent will warn you before expensive operations.

---

## Automated Peer Review Setup

This workflow automatically reviews your PRs using AI agents.

### Step 1: Choose Your LLM Provider

The automated review supports 6 LLM providers:

| Provider | Best For | Cost | Setup |
|----------|----------|------|-------|
| OpenAI | Most popular, GPT-4o | $$ | https://platform.openai.com/ |
| Anthropic | Best code reviews, Claude | $$$ | https://console.anthropic.com/ |
| Gemini | Google's model | $ | https://makersuite.google.com/ |
| Azure OpenAI | Enterprise users | $$$ | https://portal.azure.com/ |
| Cohere | Fast responses | $ | https://dashboard.cohere.com/ |
| Mistral | Open-source option | $ | https://console.mistral.ai/ |

### Step 2: Configure GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions

**For OpenAI (default):**
```
LLM_PROVIDER = openai
LLM_API_KEY = your-openai-api-key
```

**For Anthropic (Claude):**
```
LLM_PROVIDER = anthropic
LLM_API_KEY = your-anthropic-api-key
```

**For Gemini:**
```
LLM_PROVIDER = gemini
LLM_API_KEY = your-google-api-key
```

**For Azure OpenAI:**
```
LLM_PROVIDER = azure
LLM_API_KEY = your-azure-api-key
AZURE_OPENAI_ENDPOINT = https://your-resource.openai.azure.com/
```

**For Cohere:**
```
LLM_PROVIDER = cohere
LLM_API_KEY = your-cohere-api-key
```

**For Mistral:**
```
LLM_PROVIDER = mistral
LLM_API_KEY = your-mistral-api-key
```

### Step 3: Run Automated Review

1. Create a PR following the branch naming pattern:
   - `{llm-name}/{agent-type}-{project}-{sessionID}`
   - Example: `copilot/developer-sudoku-webapp-123456`

2. Go to **Actions** tab → **Automated Multi-Agent Peer Review**

3. Click **Run workflow** → Enter PR number

4. Wait for sequential agent reviews (Architect, Tester)

5. Reviews posted as PR comments with inline suggestions

### Switching Providers

Just update the `LLM_PROVIDER` secret in GitHub - no code changes needed!

```bash
# Example: Switch from OpenAI to Claude
# In GitHub: Settings → Secrets → Actions
# Edit LLM_PROVIDER: change "openai" to "anthropic"
# Edit LLM_API_KEY: change to your Anthropic key
```

---

