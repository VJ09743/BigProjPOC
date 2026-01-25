# LLM Provider Configuration

This directory contains configuration for your LLM (Large Language Model) provider. The agentic workflow template is **provider-agnostic** and works with any AI assistant.

## Quick Setup

1. **Copy the template:**
   ```bash
   cp .llm/config.template.json .llm/config.json
   ```

2. **Set your API key:**
   ```bash
   # Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
   export LLM_API_KEY="your-api-key-here"
   ```

3. **Edit config.json** with your provider settings

## Supported Providers

### Anthropic (Claude)
```json
{
  "provider": { "name": "anthropic" },
  "model": { "name": "claude-sonnet-4-20250514" },
  "api": { "key_env_var": "ANTHROPIC_API_KEY" }
}
```

**CLI Tool:** [Claude Code](https://github.com/anthropics/claude-code)
```bash
npm install -g @anthropic-ai/claude-code
export ANTHROPIC_API_KEY="your-key"
claude
```

### OpenAI (GPT)
```json
{
  "provider": { "name": "openai" },
  "model": { "name": "gpt-4o" },
  "api": { "key_env_var": "OPENAI_API_KEY" }
}
```

**CLI Tools:**
- [Aider](https://aider.chat): `pip install aider-chat && aider`
- [OpenAI CLI](https://github.com/openai/openai-python): `pip install openai`

### Azure OpenAI
```json
{
  "provider": { "name": "azure" },
  "model": { "name": "gpt-4" },
  "api": {
    "key_env_var": "AZURE_OPENAI_API_KEY",
    "base_url": "https://your-resource.openai.azure.com"
  }
}
```

### Google (Gemini)
```json
{
  "provider": { "name": "google" },
  "model": { "name": "gemini-1.5-pro" },
  "api": { "key_env_var": "GOOGLE_API_KEY" }
}
```

### Ollama (Local)
```json
{
  "provider": { "name": "ollama" },
  "model": { "name": "llama3" },
  "api": {
    "key_env_var": null,
    "base_url": "http://localhost:11434"
  }
}
```

**Setup:**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3

# Use with Aider
aider --model ollama/llama3
```

### Custom Provider
```json
{
  "provider": { "name": "custom" },
  "model": { "name": "your-model" },
  "api": {
    "key_env_var": "CUSTOM_API_KEY",
    "base_url": "https://your-api-endpoint.com/v1"
  }
}
```

## Compatible AI Coding Tools

The agentic workflow works with various AI coding assistants:

| Tool | Providers | Install |
|------|-----------|---------|
| [Claude Code](https://github.com/anthropics/claude-code) | Anthropic | `npm i -g @anthropic-ai/claude-code` |
| [Aider](https://aider.chat) | OpenAI, Anthropic, Ollama, Azure | `pip install aider-chat` |
| [Cursor](https://cursor.sh) | OpenAI, Anthropic | Download from website |
| [Continue](https://continue.dev) | Multiple | VS Code extension |
| [Cody](https://sourcegraph.com/cody) | Multiple | VS Code extension |
| [Copilot](https://github.com/features/copilot) | GitHub/OpenAI | VS Code extension |

## Environment Variables

Store API keys as environment variables, never in files:

```bash
# ~/.bashrc or ~/.zshrc

# Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."

# OpenAI
export OPENAI_API_KEY="sk-..."

# Azure
export AZURE_OPENAI_API_KEY="..."
export AZURE_OPENAI_ENDPOINT="https://..."

# Google
export GOOGLE_API_KEY="..."

# Generic (used by this template)
export LLM_API_KEY="..."
```

## Security

**Never commit API keys!** The following are gitignored:
- `.llm/config.json` (your actual config)
- `.env` files
- `*_key`, `*_token`, `*_secret` files
- `.api_key`, `.llm_key`

## Using the Workflow

Once configured, interact with the AI assistant:

1. **Start your AI tool** (e.g., `claude`, `aider`, `cursor`)
2. **Describe your task** - the agent system will activate
3. **The AI will:**
   - Adopt the appropriate agent role
   - Follow the multi-agent workflow
   - Create PRs for review

## Adapting Agent Prompts

The agent definitions in `.claude/agents/` work with any LLM. If your tool uses different prompt formats:

1. Copy the agent files to your tool's format
2. Maintain the same role definitions and responsibilities
3. Keep the workflow and handoff patterns

## Troubleshooting

**API Key not found:**
```bash
# Verify your key is set
echo $LLM_API_KEY

# Source your profile
source ~/.bashrc
```

**Model not available:**
- Check your API subscription tier
- Verify model name spelling
- Some models require waitlist access

**Rate limits:**
- Add delays between requests
- Use a smaller model for drafts
- Check provider rate limit documentation
