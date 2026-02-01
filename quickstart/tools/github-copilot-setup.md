# Path G: GitHub Copilot (Monthly Subscription)

**Best for**: GitHub users with Copilot subscription who want to use the agentic workflow.

## Important: Two Separate Configurations

When using GitHub Copilot, you need to understand two separate contexts:

### 1. Your IDE (GitHub Copilot) - No Setup Needed ✅

GitHub Copilot authenticates through your GitHub account. **You don't need LLM_PROVIDER or LLM_API_KEY** for:
- GitHub Copilot Chat in VS Code
- GitHub Copilot in your IDE
- Inline code suggestions
- Chat-based coding assistance

**Just sign in to GitHub in your IDE and you're ready!**

### 2. Automated Peer Review (GitHub Actions) - Setup Required ⚠️

For the **automated peer review workflow** to work, you **MUST** configure an LLM provider because:
- GitHub Actions runs on GitHub's servers (not your local machine)
- The review workflow needs its own API access
- Copilot subscription doesn't cover GitHub Actions workflows

## Setup for Automated Reviews

You have three options:

### Option A: Use Copilot Provider (Simplest) ✨

**NEW**: For GitHub Copilot users, just set the provider to "copilot" and the script handles everything automatically!

```bash
# Mac/Linux
echo 'export LLM_PROVIDER="copilot"' >> ~/.bashrc
source ~/.bashrc

# Windows (PowerShell as Administrator)
[Environment]::SetEnvironmentVariable("LLM_PROVIDER", "copilot", "User")
$env:LLM_PROVIDER = "copilot"
```

**Then configure GitHub Secrets** (for automated reviews):
1. Go to your repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `LLM_PROVIDER` = `copilot`
   - `GITHUB_TOKEN` = (automatically available in GitHub Actions)

**That's it!** The automated review script will use GitHub's API automatically through your repository's authentication.

**Note**: This uses the repository's GitHub token to access GitHub's models API. No separate API key needed!

### Option B: Use Your Copilot Enterprise API (If Available)

Some GitHub Copilot Enterprise plans provide direct API access. Check if you have access:
1. Go to https://github.com/settings/copilot
2. Look for "API access" or "Copilot API"
3. If available, get your API token

Then set:
```bash
# Mac/Linux
echo 'export LLM_PROVIDER="github-copilot"' >> ~/.bashrc
echo 'export LLM_API_KEY="your-copilot-api-token"' >> ~/.bashrc
source ~/.bashrc

# Windows (PowerShell as Administrator)
[Environment]::SetEnvironmentVariable("LLM_PROVIDER", "github-copilot", "User")
[Environment]::SetEnvironmentVariable("LLM_API_KEY", "your-copilot-api-token", "User")
```

### Option C: Use a Separate LLM Provider

Choose a separate provider for automated reviews:

**Choose ONE:**
- **OpenAI** (Recommended) - See [OpenAI Setup](../providers/openai-setup.md)
- **Anthropic** - See [Anthropic Setup](../providers/anthropic-setup.md)
- **Gemini** (Budget) - See [Gemini Setup](../providers/gemini-setup.md)
- **Azure OpenAI** - See [Azure Setup](../providers/azure-setup.md)
- **Cohere** - See [Cohere Setup](../providers/cohere-setup.md)
- **Mistral** - See [Mistral Setup](../providers/mistral-setup.md)

## Why Do I Need This?

The agentic workflow uses LLM APIs for:
1. **Automated code reviews** - AI agents review your PRs
2. **GitHub Actions workflows** - Runs on GitHub servers, needs API access
3. **Multi-agent collaboration** - Architect, Tester agents need LLM access

Your GitHub Copilot subscription covers:
- ✅ IDE coding assistance
- ✅ Chat in your editor
- ❌ GitHub Actions workflows (needs separate API)

## Complete Setup Steps

### Step 1: Use GitHub Copilot in Your IDE

1. Install GitHub Copilot extension in VS Code/IDE
2. Sign in with your GitHub account
3. Start coding with Copilot - no LLM_PROVIDER needed!

### Step 2: Configure for Automated Reviews

**Recommended: Option A (Simplest)**

Just set `LLM_PROVIDER=copilot` and you're done!

```bash
# Mac/Linux
export LLM_PROVIDER="copilot"

# Windows
$env:LLM_PROVIDER = "copilot"
```

**Configure GitHub Secrets**:
1. Go to your repository → Settings → Secrets and variables → Actions
2. Add secret: `LLM_PROVIDER` = `copilot`
3. That's it! No API key needed - uses repository's GitHub authentication

**Alternative: Use separate provider** (Option C)
- Choose OpenAI, Anthropic, Gemini, etc.
- Follow their setup guide for API key
- Set `LLM_PROVIDER` and `LLM_API_KEY`

### Step 3: Verify Setup

```bash
# For automated reviews, this must be set:
echo "LLM_PROVIDER: $LLM_PROVIDER"

# If using separate provider (Option C):
echo "LLM_API_KEY: $([ -n "$LLM_API_KEY" ] && echo 'Set ✅' || echo 'NOT SET ❌')"
```

### Step 4: Start Building

With GitHub Copilot in VS Code:
1. Open your project folder
2. Open Copilot Chat (Ctrl+Shift+I or Cmd+Shift+I)
3. Tell Copilot: "Follow the agentic workflow in AI-WORKFLOW.md"
4. Describe what you want to build

## Example Usage

```
You: "I want to build a todo list app"

Copilot: "First, let me verify LLM provider configuration...
✅ LLM Provider: copilot
✅ Configuration: GitHub authentication

Now, as Product Owner, let me clarify requirements:
1. What features do you need?
2. Should it have user authentication?
3. Any specific design preferences?"
```

## Cost Considerations

**GitHub Copilot Subscription:**
- Individual: ~$10/month
- Business: ~$19/month per user  
- Enterprise: Custom pricing

**Automated Reviews Cost:**

**Option A (LLM_PROVIDER=copilot) - RECOMMENDED:**
- ✅ **FREE** - Uses repository's GitHub authentication
- No additional API costs
- Included with your Copilot subscription

**Option C (Separate Provider):**
- ~$1-5/month depending on provider and usage
- Gemini: $ (cheapest, ~$1-2/month)
- OpenAI: $$ (~$2-4/month)
- Anthropic Claude: $$$ (~$4-8/month)

**Recommendation**: Use **Option A** (`LLM_PROVIDER=copilot`) for simplest setup with no additional cost!

## What's Next?

Return to [Quick Start Guide](../../QUICK-START.md#example-requests) to see example requests and learn how to use the agentic workflow.
