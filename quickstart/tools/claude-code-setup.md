# Path A: Claude Code + Anthropic

**Best for**: Software projects, most capable for coding tasks.

## Step 1: Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Create an account (or sign in)
3. Go to **API Keys** section
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-...`)

## Step 2: Save Your API Key

**On Mac/Linux:**
```bash
echo 'export LLM_PROVIDER="anthropic"' >> ~/.bashrc
echo 'export LLM_API_KEY="your-anthropic-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**On Windows:**
1. Search for "Environment Variables" in Start menu
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "User variables", click "New"
5. Variable name: `LLM_PROVIDER`, Value: `anthropic`
6. Click "New" again
7. Variable name: `LLM_API_KEY`, Value: your API key
8. Click OK

## Step 3: Install Claude Code

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

## Step 4: Start Building

```bash
cd /path/to/your/project
claude
```

Now describe what you want to build!

## What's Next?

Return to [Quick Start Guide](../../QUICK-START.md#example-requests) to see example requests and learn how to use the agentic workflow.
