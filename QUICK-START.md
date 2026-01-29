# Quick Start Guide

Welcome! This guide will help you set up the AI-assisted workflow in **5 simple steps**.

No programming experience required.

> **New here?** First, [fork this template](README.md#fork-this-template) to create your own copy, then follow the steps below.

---

## Step 1: Get an AI API Key (5 minutes)

You need an API key from an AI provider. Choose ONE:

### Option A: Anthropic Claude (Recommended - Best for software projects)
1. Go to https://console.anthropic.com/
2. Create an account (or sign in)
3. Go to API Keys section
4. Create a new key
5. Copy the key (starts with `sk-ant-...`)

### Option B: Google Gemini
1. Go to https://aistudio.google.com/
2. Create an account (or sign in with Google)
3. Click **"Get API Key"**
4. Create a new key
5. Copy the key

### Option C: OpenAI (ChatGPT)
1. Go to https://platform.openai.com/signup
2. Create an account (or sign in)
3. Go to https://platform.openai.com/api-keys
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)

---

## Step 2: Save Your API Key (2 minutes)

Your API key needs to be saved so the AI tools can use it.

### On Mac/Linux:
Open Terminal and run:
```bash
# For Anthropic Claude (recommended):
echo 'export ANTHROPIC_API_KEY="your-key-here"' >> ~/.bashrc
source ~/.bashrc

# For Google Gemini:
echo 'export GOOGLE_API_KEY="your-key-here"' >> ~/.bashrc
source ~/.bashrc

# For OpenAI:
echo 'export OPENAI_API_KEY="your-key-here"' >> ~/.bashrc
source ~/.bashrc
```

### On Windows:
1. Search for "Environment Variables" in Start menu
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "User variables", click "New"
5. Variable name: `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, or `OPENAI_API_KEY`
6. Variable value: your API key
7. Click OK

---

## Step 3: Install an AI Coding Tool (5 minutes)

Choose ONE tool to interact with the AI:

### Option A: Claude Code (Recommended - Best for software projects)

Claude Code is Anthropic's official CLI tool, optimized for software development.

First, check if Node.js is installed and install it if needed, then install Claude Code:

**On Mac:**
```bash
# This script checks for Node.js and installs if needed
if command -v node &> /dev/null; then
    echo "Node.js is already installed: $(node --version)"
else
    echo "Node.js not found. Installing..."
    if command -v brew &> /dev/null; then
        brew install node
    else
        echo "Installing Homebrew first..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        brew install node
    fi
fi
# Now install Claude Code
npm install -g @anthropic-ai/claude-code
```

**On Windows (PowerShell - Run as Administrator):**
```powershell
# This script checks for Node.js and installs if needed
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if ($nodeInstalled) {
    Write-Host "Node.js is already installed: $(node --version)"
} else {
    Write-Host "Node.js not found. Installing..."
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}
# Now install Claude Code
npm install -g @anthropic-ai/claude-code
```

**On Linux (Ubuntu/Debian):**
```bash
# This script checks for Node.js and installs if needed
if command -v node &> /dev/null; then
    echo "Node.js is already installed: $(node --version)"
else
    echo "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt install -y nodejs
fi
# Now install Claude Code
npm install -g @anthropic-ai/claude-code
```

**On Linux (Fedora/RHEL):**
```bash
# This script checks for Node.js and installs if needed
if command -v node &> /dev/null; then
    echo "Node.js is already installed: $(node --version)"
else
    echo "Node.js not found. Installing..."
    sudo dnf install -y nodejs
fi
# Now install Claude Code
npm install -g @anthropic-ai/claude-code
```

### Option B: Aider (Works with Google Gemini and OpenAI)

First, check if Python is installed and install it if needed:

**On Mac:**
```bash
# This script checks for Python and installs if needed
if command -v python3 &> /dev/null; then
    echo "Python is already installed: $(python3 --version)"
else
    echo "Python not found. Installing..."
    if command -v brew &> /dev/null; then
        brew install python3
    else
        echo "Installing Homebrew first..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        brew install python3
    fi
fi
# Now install Aider
pip3 install aider-chat
```

**On Windows (PowerShell - Run as Administrator):**
```powershell
# This script checks for Python and installs if needed
$pythonInstalled = Get-Command python -ErrorAction SilentlyContinue
if ($pythonInstalled) {
    Write-Host "Python is already installed: $(python --version)"
} else {
    Write-Host "Python not found. Installing..."
    winget install Python.Python.3.11 --accept-package-agreements --accept-source-agreements
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}
# Now install Aider
pip install aider-chat
```

**On Linux (Ubuntu/Debian):**
```bash
# This script checks for Python and installs if needed
if command -v python3 &> /dev/null; then
    echo "Python is already installed: $(python3 --version)"
else
    echo "Python not found. Installing..."
    sudo apt update
    sudo apt install -y python3 python3-pip
fi
# Now install Aider
pip3 install aider-chat
```

**On Linux (Fedora/RHEL):**
```bash
# This script checks for Python and installs if needed
if command -v python3 &> /dev/null; then
    echo "Python is already installed: $(python3 --version)"
else
    echo "Python not found. Installing..."
    sudo dnf install -y python3 python3-pip
fi
# Now install Aider
pip3 install aider-chat
```

### Option C: Cursor IDE (Easiest for beginners - No installation scripts needed)
1. Go to https://cursor.sh
2. Download and install
3. Open your project folder in Cursor
4. Use Cmd+K (Mac) or Ctrl+K (Windows) to chat with AI

---

## Step 4: Open Your Project (1 minute)

### If using Claude Code (recommended):
```bash
cd /path/to/your/project
claude
```

### If using Aider:
```bash
cd /path/to/your/project
aider
```

### If using Cursor:
1. Open Cursor
2. Click "Open Folder"
3. Select your project folder

---

## Step 5: Start Building! (Now the fun begins)

Just describe what you want to build in plain English!

### Example Requests:

**Building something new:**
> "I want to create a simple todo list application where users can add, complete, and delete tasks"

**Adding a feature:**
> "Add a search feature so users can find items by name"

**Fixing a problem:**
> "Users are reporting that the save button doesn't work on mobile devices"

**Understanding the code:**
> "Explain how the login system works"

---

## What Happens Next?

When you describe what you want, the AI agents will:

1. **Product Owner** - Understands your request and creates a plan
2. **Architect** - Designs the technical solution
3. **Developer** - Writes the code
4. **Tester** - Makes sure it works
5. **IT** - Prepares it for release

You'll be asked to review changes before they're applied.

---

## Quick Reference

### Useful Commands

| What you want | What to say |
|---------------|-------------|
| Build new feature | "Create a [feature] that does [what]" |
| Fix a bug | "Fix the issue where [problem]" |
| Understand code | "Explain how [feature] works" |
| Improve something | "Make [feature] faster/better/simpler" |
| Add tests | "Add tests for [feature]" |

### Project Structure

```
your-project/
├── ai-assistants/        ← AI configuration (don't modify unless needed)
├── project-management/   ← Documentation and task tracking
├── modules/              ← Your software code goes here
├── output/               ← Built software appears here
└── QUICK-START.md        ← You are here!
```

---

## Troubleshooting

### "API key not found" error
- Make sure you saved the key in Step 2
- Try closing and reopening your terminal
- Check the key is correct (no extra spaces)

### "Command not found" error
- Make sure you installed the tool in Step 3
- Try closing and reopening your terminal
- On Windows, try running as Administrator

### AI gives wrong answers
- Be more specific in your request
- Provide examples of what you want
- Break big requests into smaller steps

### Need more help?
- Check `ai-assistants/how-to-use.md` for detailed guide
- Check `AI-WORKFLOW.md` for full documentation

---

## Cost Awareness

Using AI APIs costs money per request.

**Approximate costs:**
- Simple question: ~$0.01
- Small feature: ~$0.10
- Large feature: ~$1.00+

The **Cost Analyst** agent will warn you before expensive operations.

---

## You're Ready!

That's it! You're now set up to build software with AI assistance.

Remember:
- **Be specific** about what you want
- **Review changes** before accepting
- **Ask questions** if something is unclear

Happy building! 🚀
