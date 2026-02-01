# Anthropic (Claude) Setup Guide

**Best for**: Advanced code review, software development

## Step 1: Get Your API Key

1. Go to https://console.anthropic.com/
2. Create an account (or sign in)
3. Go to **API Keys** section
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-...`)

## Step 2: Set Environment Variables

**On Mac/Linux:**
```bash
echo 'export LLM_PROVIDER="anthropic"' >> ~/.bashrc
echo 'export LLM_API_KEY="your-anthropic-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**On Windows (PowerShell as Administrator):**
```powershell
[Environment]::SetEnvironmentVariable("LLM_PROVIDER", "anthropic", "User")
[Environment]::SetEnvironmentVariable("LLM_API_KEY", "your-anthropic-key-here", "User")
$env:LLM_PROVIDER = "anthropic"
$env:LLM_API_KEY = "your-anthropic-key-here"
```

## Step 3: Configure GitHub Secrets (for automated reviews)

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - Name: `LLM_PROVIDER`, Value: `anthropic`
   - Name: `LLM_API_KEY`, Value: your Anthropic API key

## Model Information

- **Model**: Claude Sonnet 4
- **Cost**: $$$ (Premium)
- **Strengths**: Excellent code review, complex reasoning, large context window

## Verification

```bash
# Verify setup
echo "LLM_PROVIDER=$LLM_PROVIDER"
echo "LLM_API_KEY is set: $([ -n "$LLM_API_KEY" ] && echo 'Yes' || echo 'No')"
```

You're ready to use Anthropic! Return to [Quick Start Guide](../../QUICK-START.md).
