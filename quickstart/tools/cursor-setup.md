# Path B: Cursor IDE

**Best for**: Beginners who prefer a visual interface. Works with any AI provider.

## Step 1: Get an API Key

Choose ONE provider:

**Option 1 - Anthropic (Recommended):**
1. Go to https://console.anthropic.com/
2. Create account → API Keys → Create Key
3. Copy the key (starts with `sk-ant-...`)

**Option 2 - OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create account → Create new secret key
3. Copy the key (starts with `sk-...`)

## Step 2: Set Environment Variables

**If using Anthropic:**
```bash
# Mac/Linux
echo 'export LLM_PROVIDER="anthropic"' >> ~/.bashrc
echo 'export LLM_API_KEY="your-anthropic-key"' >> ~/.bashrc
source ~/.bashrc

# Windows (PowerShell as Administrator)
[Environment]::SetEnvironmentVariable("LLM_PROVIDER", "anthropic", "User")
[Environment]::SetEnvironmentVariable("LLM_API_KEY", "your-anthropic-key", "User")
```

**If using OpenAI:**
```bash
# Mac/Linux
echo 'export LLM_PROVIDER="openai"' >> ~/.bashrc
echo 'export LLM_API_KEY="your-openai-key"' >> ~/.bashrc
source ~/.bashrc

# Windows (PowerShell as Administrator)
[Environment]::SetEnvironmentVariable("LLM_PROVIDER", "openai", "User")
[Environment]::SetEnvironmentVariable("LLM_API_KEY", "your-openai-key", "User")
```

## Step 3: Install Cursor

1. Go to https://cursor.sh
2. Download for your operating system
3. Install and open Cursor

## Step 4: Configure API Key in Cursor

1. Open Cursor Settings (Cmd+, on Mac, Ctrl+, on Windows)
2. Go to **Models** section
3. Add your API key for your chosen provider
4. Select your preferred model

## Step 5: Start Building

1. Click **File** → **Open Folder**
2. Select your project folder
3. Press **Cmd+K** (Mac) or **Ctrl+K** (Windows) to chat with AI

Now describe what you want to build!

## What's Next?

Return to [Quick Start Guide](../../QUICK-START.md#example-requests) to see example requests and learn how to use the agentic workflow.
