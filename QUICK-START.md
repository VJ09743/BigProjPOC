# Quick Start Guide

Welcome! This guide will help you set up the AI-assisted workflow.

**No programming experience required.**

> **New here?** First, [fork this template](README.md#fork-this-template) to create your own copy, then follow the steps below.

---

## Prerequisites - IMPORTANT!

Before choosing an AI tool path, you **MUST** set up these prerequisites:

### 1. Git Installation
- **Mac**: `brew install git` (or `xcode-select --install`)
- **Windows**: `winget install Git.Git` or download from https://git-scm.com/
- **Linux (Debian/Ubuntu)**: `sudo apt install git`
- **Linux (Fedora)**: `sudo dnf install git`

> **Note:** IT Agent (Step 0) will also verify and install `git` automatically when the workflow starts.

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

**On Linux (Debian/Ubuntu):**
```bash
sudo apt update && sudo apt install -y gh
```

**On Linux (Fedora):**
```bash
sudo dnf install -y gh
```

**Verify installation (all platforms):**
```bash
gh auth login   # First time: authenticate
gh auth status  # Verify authentication
```

> **Note:** IT Agent (Step 0) will also verify and install `gh` automatically when the workflow starts.

---

## LLM Provider (Only for Automated Reviews)

**LLM Provider is ONLY needed if you want automated peer reviews (GitHub Actions).**

**For IDE work ONLY** (using Copilot, Claude Code, Cursor, etc.):
- ✅ **No LLM_PROVIDER needed** - Your AI tool authenticates separately
- ✅ **Start working immediately** - Skip this section and go to [Choose Your Path](#choose-your-path)

**For automated peer reviews**:
- ⚠️ **LLM_PROVIDER is REQUIRED** - Continue with Step 1 below

> **GitHub Copilot users**: If you have Copilot Enterprise, set `LLM_PROVIDER=copilot` (no API key needed). If you have Copilot Pro/Individual, use a separate provider like Gemini for automated reviews. See [Path G setup guide](quickstart/tools/github-copilot-setup.md) for details.

### Step 1: Choose Your LLM Provider (for Automated Reviews)

| Provider | Best For | Cost | Setup Guide |
|----------|----------|------|-------------|
| **GitHub Copilot** | Copilot subscribers (automated reviews) | Included* | [Copilot Setup](quickstart/tools/github-copilot-setup.md) |
| **OpenAI** | General purpose, most popular | $$ | [OpenAI Setup](quickstart/providers/openai-setup.md) |
| **Anthropic** | Code review, complex reasoning | $$$ | [Anthropic Setup](quickstart/providers/anthropic-setup.md) |
| **Gemini** | Fast, cost-effective | $ | [Gemini Setup](quickstart/providers/gemini-setup.md) |
| **Azure OpenAI** | Enterprise, compliance | $$$ | [Azure Setup](quickstart/providers/azure-setup.md) |
| **Cohere** | Efficiency, production | $ | [Cohere Setup](quickstart/providers/cohere-setup.md) |
| **Mistral** | Open-source, privacy | $ | [Mistral Setup](quickstart/providers/mistral-setup.md) |

*GitHub Copilot Pro/Individual subscriptions provide IDE access only. For automated reviews, you need Copilot ENTERPRISE or use a separate provider (Gemini, OpenAI, etc.). Set `LLM_PROVIDER=copilot` only if you have Enterprise access.

### Step 2: Follow Your Provider's Setup Guide

Click on your chosen provider's setup guide above. Each guide includes:
- API key acquisition
- Environment variable configuration
- GitHub Secrets setup (for automated reviews)
- Verification steps

### Step 3: Verify Configuration (Optional - Only for Automated Reviews)

After setup, verify your provider is configured:

**Linux/macOS (bash):**
```bash
echo "LLM_PROVIDER: ${LLM_PROVIDER:-'Not set (IDE work only)'}"
echo "LLM_API_KEY is set: $([ -n "$LLM_API_KEY" ] && echo 'Yes' || echo 'No (IDE work only)')"
```

**Windows (PowerShell):**
```powershell
Write-Host "LLM_PROVIDER: $($env:LLM_PROVIDER ?? 'Not set (IDE work only)')"
Write-Host "LLM_API_KEY is set: $(if ($env:LLM_API_KEY) { 'Yes' } else { 'No (IDE work only)' })"
```

**Summary**:
- **IDE work only**: No configuration needed - your AI tool handles authentication
- **Automated reviews**: LLM_PROVIDER required, LLM_API_KEY required (except copilot)

---

## ✅ Setup Checklist

Before proceeding to "Choose Your Path", verify:

- [ ] Git is installed (`git --version`)
- [ ] GitHub account created and logged in
- [ ] GITHUB_TOKEN environment variable set
- [ ] gh CLI installed and authenticated (`gh auth status`)
- [ ] **(Optional)** LLM_PROVIDER set - only if you want automated peer reviews
- [ ] **(Optional)** LLM_API_KEY set - only if you want automated peer reviews with non-Copilot providers

**If all checkboxes pass**, you're ready to proceed! 🚀

---

## Choose Your Path

Pick ONE path based on which AI tool you want to use:

| Path | AI Tool | Best For | Difficulty | Setup Guide |
|------|---------|----------|------------|-------------|
| **Path A** | Claude Code + Anthropic | Software projects | Easy (CLI) | [Setup Guide](quickstart/tools/claude-code-setup.md) |
| **Path B** | Cursor IDE | Beginners, visual | Easiest (GUI) | [Setup Guide](quickstart/tools/cursor-setup.md) |
| **Path C** | Windsurf IDE | Beginners, visual | Easiest (GUI) | [Setup Guide](quickstart/tools/windsurf-setup.md) |
| **Path D** | Aider + Gemini | Budget-conscious | Easy (CLI) | [Setup Guide](quickstart/tools/aider-gemini-setup.md) |
| **Path E** | Aider + OpenAI | GPT-4 users | Easy (CLI) | [Setup Guide](quickstart/tools/aider-openai-setup.md) |
| **Path F** | Continue + VS Code | VS Code users | Easy (Extension) | [Setup Guide](quickstart/tools/continue-setup.md) |
| **Path G** | GitHub Copilot | Copilot subscribers | Easiest (GUI) | [Setup Guide](quickstart/tools/github-copilot-setup.md) |

**Recommended**: 
- **Path A** (Claude Code) for best software development experience
- **Path G** (GitHub Copilot) if you already have a subscription

**⚠️ Important for GitHub Copilot users**: While Copilot works in your IDE without LLM_PROVIDER setup, you still need to configure an LLM provider for automated peer reviews. See [Path G guide](quickstart/tools/github-copilot-setup.md) for details.

**Click on your chosen setup guide above** for detailed installation and configuration instructions.

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

The automated review supports 7 LLM providers:

| Provider | Best For | Cost | Setup |
|----------|----------|------|-------|
| GitHub Copilot | Copilot subscribers | FREE* | Set LLM_PROVIDER=copilot (no API key!) |
| OpenAI | Most popular, GPT-4o | $$ | https://platform.openai.com/ |
| Anthropic | Best code reviews, Claude | $$$ | https://console.anthropic.com/ |
| Gemini | Google's model | $ | https://makersuite.google.com/ |
| Azure OpenAI | Enterprise users | $$$ | https://portal.azure.com/ |
| Cohere | Fast responses | $ | https://dashboard.cohere.com/ |
| Mistral | Open-source option | $ | https://console.mistral.ai/ |

*Uses repository's GitHub authentication automatically

### Step 2: Configure GitHub Repository Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions** → **Repository secrets** tab → Click **"New repository secret"**

**For GitHub Copilot (Recommended - FREE):**
```
Name: LLM_PROVIDER
Secret: copilot
```
That's it! No API key needed - uses repository authentication automatically.

**For OpenAI:**
```
Name: LLM_PROVIDER
Secret: openai

Name: LLM_API_KEY
Secret: your-openai-api-key
```

**For Anthropic (Claude):**
```
Name: LLM_PROVIDER
Secret: anthropic

Name: LLM_API_KEY
Secret: your-anthropic-api-key
```

**For Gemini:**
```
Name: LLM_PROVIDER
Secret: gemini

Name: LLM_API_KEY
Secret: your-google-api-key
```

**For Azure OpenAI:**
```
Name: LLM_PROVIDER
Secret: azure

Name: LLM_API_KEY
Secret: your-azure-api-key

Name: AZURE_OPENAI_ENDPOINT
Secret: https://your-resource.openai.azure.com/
```

**For Cohere:**
```
Name: LLM_PROVIDER
Secret: cohere

Name: LLM_API_KEY
Secret: your-cohere-api-key
```

**For Mistral:**
```
Name: LLM_PROVIDER
Secret: mistral

Name: LLM_API_KEY
Secret: your-mistral-api-key
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

