# Path D: Aider + Google Gemini

**Best for**: Budget-conscious users, Google ecosystem.

## Step 1: Get Your Google API Key

1. Go to https://aistudio.google.com/
2. Sign in with Google account
3. Click **"Get API Key"**
4. Create and copy the key

## Step 2: Save Your API Key

**On Mac/Linux:**
```bash
echo 'export LLM_PROVIDER="gemini"' >> ~/.bashrc
echo 'export LLM_API_KEY="your-gemini-key"' >> ~/.bashrc
source ~/.bashrc
```

**On Windows:**
1. Search for "Environment Variables" in Start menu
2. Click "Edit the system environment variables"
3. Click "Environment Variables" → "New"
4. Variable name: `LLM_PROVIDER`, Value: `gemini`
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
aider --model gemini/gemini-1.5-pro-latest
```

Now describe what you want to build!

## What's Next?

Return to [Quick Start Guide](../../QUICK-START.md#example-requests) to see example requests and learn how to use the agentic workflow.
