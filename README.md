# Agentic Workflow Template

A **provider-agnostic template** for AI-assisted multi-agent development workflows.

## Works With Any AI

| Provider | Models | Tools |
|----------|--------|-------|
| **Anthropic** | Claude 3.5, Claude 3 Opus | Claude Code |
| **OpenAI** | GPT-4o, GPT-4 Turbo | Aider, Cursor |
| **Azure** | GPT-4, GPT-3.5 | Aider, Cursor |
| **Google** | Gemini Pro, Gemini Ultra | - |
| **Ollama** | Llama 3, Mistral, CodeLlama | Aider |
| **Any** | OpenAI-compatible APIs | Custom |

## What is this?

A structured approach to software development using specialized AI agents:

- **Team Leader**: Orchestrates work and coordinates agents
- **Architect**: Designs systems and creates specifications
- **Developer**: Implements features and writes code
- **Tester**: Tests and validates implementations
- **IT**: Manages infrastructure and releases

## Who is this for?

- **Non-programmers** who want AI help building software
- **Teams** wanting structured AI-assisted workflows
- **Projects** needing consistent development processes

## Quick Start

```bash
# 1. Clone this template
git clone <repo-url> my-project
cd my-project

# 2. Set up your AI provider
cp .llm/config.template.json .llm/config.json
export LLM_API_KEY="your-api-key"

# 3. Start your AI tool
claude           # For Claude Code
aider            # For Aider
cursor .         # For Cursor

# 4. Describe what you want to build
```

## Features

- **LLM Provider Agnostic** - Works with any AI
- **Multi-agent workflow** with peer review
- **Git worktree support** for parallel work
- **Task management system**
- **GitHub Actions** for automation
- **Secure API key handling** (environment variables, gitignored)

## Structure

```
├── .agents/             # Agent role definitions (LLM-agnostic)
├── .llm/                # LLM provider configuration
│   ├── config.template.json  # Config template
│   └── README.md             # Setup instructions
├── .claude/             # Claude Code compatibility
├── .github/workflows/   # GitHub Actions
├── docs/                # Documentation templates
│   ├── tasks/           # Task management
│   ├── architecture/    # Design docs
│   ├── tests/           # Test docs
│   └── it/              # Infrastructure docs
├── src/                 # Your source code
├── tests/               # Your tests
└── CLAUDE.md            # Main configuration (works with any AI)
```

## How It Works

1. You describe what you want to build
2. Team Leader analyzes and plans the work
3. Appropriate agents are assigned tasks
4. Agents work independently in git worktrees
5. Peer review ensures quality
6. PRs are created for your review

## Setup by Provider

### Anthropic (Claude)
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
npm install -g @anthropic-ai/claude-code
claude
```

### OpenAI (GPT-4)
```bash
export OPENAI_API_KEY="sk-..."
pip install aider-chat
aider
```

### Ollama (Local)
```bash
ollama pull llama3
aider --model ollama/llama3
```

See `.llm/README.md` for detailed setup instructions.

## Customization

1. **Configure your AI provider** - Edit `.llm/config.json`
2. **Add domain expertise** - Update agent files in `.agents/`
3. **Customize structure** - Modify directories for your project
4. **Configure builds** - Add your build system
5. **Update workflows** - Modify `.github/workflows/`

## Security

- API keys stored as **environment variables**
- Secrets are **automatically gitignored**
- No keys in code or config files

## License

[Add your license here]
