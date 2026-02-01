# Path E: Aider + OpenAI

**Best for**: GPT-4 users, OpenAI ecosystem.

## Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/signup
2. Create an account (or sign in)
3. Go to https://platform.openai.com/api-keys
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)

## Step 2: Save Your API Key

**On Mac/Linux:**
```bash
echo 'export LLM_PROVIDER="openai"' >> ~/.bashrc
echo 'export LLM_API_KEY="your-openai-key"' >> ~/.bashrc
source ~/.bashrc
```

**On Windows:**
1. Search for "Environment Variables" in Start menu
2. Click "Edit the system environment variables"
3. Click "Environment Variables" → "New"
4. Variable name: `LLM_PROVIDER`, Value: `openai`
5. Click "New" again
6. Variable name: `LLM_API_KEY`, Value: your API key
7. Click OK

## Step 3: Install Aider

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

## Step 4: Start Building

```bash
cd /path/to/your/project
aider
```

Now describe what you want to build!

## What's Next?

Return to [Quick Start Guide](../../QUICK-START.md#example-requests) to see example requests and learn how to use the agentic workflow.
