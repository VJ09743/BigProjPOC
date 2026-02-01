# Google Gemini Setup Guide

**Best for**: Fast responses, cost-effective, Google ecosystem integration

## Step 1: Get Your API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click **Create API Key**
4. Select or create a Google Cloud project
5. Copy the API key

## Step 2: Set Environment Variables

**On Mac/Linux:**
```bash
echo 'export LLM_PROVIDER="gemini"' >> ~/.bashrc
echo 'export LLM_API_KEY="your-gemini-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**On Windows (PowerShell as Administrator):**
```powershell
[Environment]::SetEnvironmentVariable("LLM_PROVIDER", "gemini", "User")
[Environment]::SetEnvironmentVariable("LLM_API_KEY", "your-gemini-key-here", "User")
$env:LLM_PROVIDER = "gemini"
$env:LLM_API_KEY = "your-gemini-key-here"
```

## Step 3: Install Dependencies (for automated reviews)

The automated review system needs the Gemini SDK:

```bash
cd .github/scripts
npm install @google/generative-ai
```

## Step 4: Configure GitHub Secrets (for automated reviews)

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - Name: `LLM_PROVIDER`, Value: `gemini`
   - Name: `LLM_API_KEY`, Value: your Gemini API key

## Model Information

- **Model**: Gemini Pro
- **Cost**: $ (Low cost)
- **Strengths**: Fast, cost-effective, multimodal capabilities

## Verification

```bash
# Verify setup
echo "LLM_PROVIDER=$LLM_PROVIDER"
echo "LLM_API_KEY is set: $([ -n "$LLM_API_KEY" ] && echo 'Yes' || echo 'No')"
```

You're ready to use Gemini! Return to [Quick Start Guide](../../QUICK-START.md).
