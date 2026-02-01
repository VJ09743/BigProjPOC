# Path F: Continue Extension

**Best for**: VS Code users who want AI assistance in their existing editor.

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

## Step 3: Install Continue

1. Open VS Code
2. Go to Extensions (Cmd+Shift+X on Mac, Ctrl+Shift+X on Windows)
3. Search for "Continue"
4. Click Install

## Step 4: Configure Continue

1. Click the Continue icon in the sidebar
2. Go to Settings
3. Add your API key
4. Select your preferred model

## Step 5: Start Building

1. Open your project folder in VS Code
2. Use the Continue panel to chat with AI

Now describe what you want to build!

## What's Next?

Return to [Quick Start Guide](../../QUICK-START.md#example-requests) to see example requests and learn how to use the agentic workflow.
