# Cohere Setup Guide

**Best for**: Fast responses, efficiency-focused, enterprise-grade

## Step 1: Get Your API Key

1. Go to https://dashboard.cohere.com/
2. Create an account (or sign in)
3. Go to **API Keys** section
4. Copy your Production key

## Step 2: Set Environment Variables

**On Mac/Linux:**
```bash
echo 'export LLM_PROVIDER="cohere"' >> ~/.bashrc
echo 'export LLM_API_KEY="your-cohere-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**On Windows (PowerShell as Administrator):**
```powershell
[Environment]::SetEnvironmentVariable("LLM_PROVIDER", "cohere", "User")
[Environment]::SetEnvironmentVariable("LLM_API_KEY", "your-cohere-key-here", "User")
$env:LLM_PROVIDER = "cohere"
$env:LLM_API_KEY = "your-cohere-key-here"
```

## Step 3: Install Dependencies (for automated reviews)

The automated review system needs the Cohere SDK:

```bash
cd .github/scripts
npm install cohere-ai
```

## Step 4: Configure GitHub Secrets (for automated reviews)

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - Name: `LLM_PROVIDER`, Value: `cohere`
   - Name: `LLM_API_KEY`, Value: your Cohere API key

## Model Information

- **Model**: Command R Plus
- **Cost**: $ (Low to moderate)
- **Strengths**: Fast, efficient, good for production workloads

## Verification

```bash
# Verify setup
echo "LLM_PROVIDER=$LLM_PROVIDER"
echo "LLM_API_KEY is set: $([ -n "$LLM_API_KEY" ] && echo 'Yes' || echo 'No')"
```

You're ready to use Cohere! Return to [Quick Start Guide](../../QUICK-START.md).
