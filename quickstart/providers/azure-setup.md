# Azure OpenAI Setup Guide

**Best for**: Enterprise users, compliance requirements, existing Azure infrastructure

## Step 1: Create Azure OpenAI Resource

1. Go to https://portal.azure.com/
2. Search for "Azure OpenAI"
3. Click **Create** → Configure your resource
4. Wait for deployment to complete

## Step 2: Get Your API Key and Endpoint

1. Go to your Azure OpenAI resource
2. Click **Keys and Endpoint** in left menu
3. Copy:
   - **Key 1** (your API key)
   - **Endpoint** (looks like `https://your-resource.openai.azure.com/`)

## Step 3: Set Environment Variables

**On Mac/Linux:**
```bash
echo 'export LLM_PROVIDER="azure"' >> ~/.bashrc
echo 'export LLM_API_KEY="your-azure-key-here"' >> ~/.bashrc
echo 'export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"' >> ~/.bashrc
source ~/.bashrc
```

**On Windows (PowerShell as Administrator):**
```powershell
[Environment]::SetEnvironmentVariable("LLM_PROVIDER", "azure", "User")
[Environment]::SetEnvironmentVariable("LLM_API_KEY", "your-azure-key-here", "User")
[Environment]::SetEnvironmentVariable("AZURE_OPENAI_ENDPOINT", "https://your-resource.openai.azure.com/", "User")
$env:LLM_PROVIDER = "azure"
$env:LLM_API_KEY = "your-azure-key-here"
$env:AZURE_OPENAI_ENDPOINT = "https://your-resource.openai.azure.com/"
```

## Step 4: Configure GitHub Secrets (for automated reviews)

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - Name: `LLM_PROVIDER`, Value: `azure`
   - Name: `LLM_API_KEY`, Value: your Azure OpenAI key
   - Name: `AZURE_OPENAI_ENDPOINT`, Value: your endpoint URL

## Model Information

- **Model**: GPT-4 (deployment-specific)
- **Cost**: $$$ (Enterprise pricing)
- **Strengths**: Enterprise compliance, data residency, SLA guarantees

## Verification

```bash
# Verify setup
echo "LLM_PROVIDER=$LLM_PROVIDER"
echo "LLM_API_KEY is set: $([ -n "$LLM_API_KEY" ] && echo 'Yes' || echo 'No')"
echo "AZURE_OPENAI_ENDPOINT=$AZURE_OPENAI_ENDPOINT"
```

You're ready to use Azure OpenAI! Return to [Quick Start Guide](../../QUICK-START.md).
