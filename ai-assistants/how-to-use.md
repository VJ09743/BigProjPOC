# Getting Started with AI Assistants

This guide helps you set up and use AI assistants for your software project.

## Quick Setup (5 minutes)

### Step 1: Choose Your AI Provider

Pick one AI service to use. Popular options:

| Provider | Cost | Best For |
|----------|------|----------|
| **OpenAI (GPT-4)** | Pay per use | General coding |
| **Anthropic (Claude)** | Pay per use | Complex reasoning |
| **Ollama** | Free (local) | Privacy, offline work |
| **Google (Gemini)** | Pay per use | Google ecosystem |

### Step 2: Get Your API Key

1. **OpenAI**: Go to https://platform.openai.com/api-keys
2. **Anthropic**: Go to https://console.anthropic.com/
3. **Google**: Go to https://aistudio.google.com/
4. **Ollama**: No key needed (runs locally)

### Step 3: Configure Your Provider

```bash
# Copy the template
cp ai-assistants/provider-setup/config.template.json ai-assistants/provider-setup/config.json

# Set your API key (add to ~/.bashrc or ~/.zshrc for persistence)
export LLM_API_KEY="your-api-key-here"
```

### Step 4: Install an AI Coding Tool

Choose one:

**Option A: Aider (works with most providers)**
```bash
pip install aider-chat
aider
```

**Option B: Claude Code (Anthropic only)**
```bash
npm install -g @anthropic-ai/claude-code
claude
```

**Option C: Cursor IDE**
Download from https://cursor.sh

## How the Agent System Works

When you interact with the AI, it will automatically:

1. **Analyze your request** - Understand what you want to build
2. **Adopt the right role** - Team Leader, Architect, Developer, Tester, or IT
3. **Follow the workflow** - Plan, design, implement, test, release
4. **Create pull requests** - For your review before merging

### The 5 Agent Roles

| Agent | What They Do |
|-------|--------------|
| **Team Leader** | Plans work, assigns tasks, coordinates agents |
| **Architect** | Designs systems, creates specifications |
| **Developer** | Writes code, implements features |
| **Tester** | Tests code, reports bugs, validates quality |
| **IT** | Manages builds, releases, infrastructure |

## Example Conversations

### Building a New Feature

You say:
> "I want to add a login page with email and password"

The AI will:
1. Team Leader: Plan the feature breakdown
2. Architect: Design the login flow
3. Developer: Implement the code
4. Tester: Validate it works
5. Create a PR for your review

### Fixing a Bug

You say:
> "Users can't save their profile changes"

The AI will:
1. Tester: Investigate and document the bug
2. Developer: Fix the issue
3. Tester: Verify the fix
4. Create a PR for your review

## Project Structure

```
your-project/
├── ai-assistants/           # AI configuration (you are here)
│   ├── agents/              # Agent role definitions
│   ├── provider-setup/      # Your AI provider config
│   └── how-to-use.md        # This guide
│
├── project-management/      # Project documentation
│   ├── tasks/               # Task tracking
│   ├── designs/             # Architecture docs
│   ├── requirements/        # Feature requirements
│   ├── quality/             # Test plans
│   └── operations/          # Release docs
│
├── modules/                 # Software modules
│   ├── module-name/         # Each module is self-contained
│   │   ├── src/             # Module source code
│   │   ├── test/            # Module tests
│   │   ├── release/         # Release builds (gitignored)
│   │   ├── debug/           # Debug builds (gitignored)
│   │   ├── build-config/    # Build configuration
│   │   └── Makefile         # Build script
│   └── example-module/      # Template to copy for new modules
│
└── .github/                 # GitHub workflows
```

## Need Help?

- **Agent definitions**: See `ai-assistants/agents/`
- **Provider setup**: See `ai-assistants/provider-setup/README.md`
- **Workflow details**: See `AI-WORKFLOW.md` in project root
