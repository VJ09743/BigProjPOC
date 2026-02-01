# Mistral AI Setup Guide

**Best for**: Open-source friendly, European provider, privacy-focused

## Step 1: Get Your API Key

1. Go to https://console.mistral.ai/
2. Create an account (or sign in)
3. Go to **API Keys** section
4. Click **Create new key**
5. Copy the API key

## Step 2: Set Environment Variables

**On Mac/Linux:**
```bash
echo 'export LLM_PROVIDER="mistral"' >> ~/.bashrc
echo 'export LLM_API_KEY="your-mistral-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**On Windows (PowerShell as Administrator):**
```powershell
[Environment]::SetEnvironmentVariable("LLM_PROVIDER", "mistral", "User")
[Environment]::SetEnvironmentVariable("LLM_API_KEY", "your-mistral-key-here", "User")
$env:LLM_PROVIDER = "mistral"
$env:LLM_API_KEY = "your-mistral-key-here"
```

## Step 3: Install Dependencies (for automated reviews)

The automated review system needs the Mistral SDK:

```bash
cd .github/scripts
npm install @mistralai/mistralai
```

## Step 4: Configure GitHub Secrets (for automated reviews)

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - Name: `LLM_PROVIDER`, Value: `mistral`
   - Name: `LLM_API_KEY`, Value: your Mistral API key

## Model Information

- **Model**: Mistral Large
- **Cost**: $ (Competitive pricing)
- **Strengths**: Open-source roots, European data centers, privacy-focused

## Verification

```bash
# Verify setup
echo "LLM_PROVIDER=$LLM_PROVIDER"
echo "LLM_API_KEY is set: $([ -n "$LLM_API_KEY" ] && echo 'Yes' || echo 'No')"
```

You're ready to use Mistral! Return to [Quick Start Guide](../../QUICK-START.md).
