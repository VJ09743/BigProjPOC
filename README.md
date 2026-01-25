# Agentic Workflow Template

A **provider-agnostic template** for AI-assisted multi-agent development workflows.

## Works With Any AI

| Provider | Models | Tools |
|----------|--------|-------|
| **Anthropic** | Claude 3.5, Opus | Any compatible CLI |
| **OpenAI** | GPT-4o, GPT-4 Turbo | Aider, Cursor |
| **Azure** | GPT-4, GPT-3.5 | Aider, Cursor |
| **Google** | Gemini Pro, Ultra | Custom |
| **Ollama** | Llama 3, Mistral | Aider |
| **Any** | OpenAI-compatible | Custom |

## What is this?

A structured approach to software development using specialized AI agents:

- **Product Owner**: Customer-facing, gathers requirements, creates user stories
- **Architect**: Designs systems and creates technical specifications
- **Developer**: Implements features and writes code
- **Tester**: Tests and validates implementations
- **IT**: Manages infrastructure and releases
- **Cost Analyst**: Estimates token costs, warns before expensive operations

## Who is this for?

- **Non-programmers** who want AI help building software
- **Teams** wanting structured AI-assisted workflows
- **Projects** needing consistent development processes

---

## **New here? Start with [QUICK-START.md](QUICK-START.md)**

A simple 5-step guide for non-programmers to get up and running.

---

## Quick Start (For Developers)

```bash
# 1. Clone this template
git clone <repo-url> my-project
cd my-project

# 2. Set up your AI provider
cp ai-assistants/provider-setup/config.template.json ai-assistants/provider-setup/config.json
export LLM_API_KEY="your-api-key"

# 3. Start your AI tool and describe what you want to build
aider            # For Aider
cursor .         # For Cursor
# or any other AI coding assistant
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
├── ai-assistants/           # AI setup and configuration
│   ├── agents/              # Agent role definitions
│   ├── provider-setup/      # LLM provider configuration
│   └── how-to-use.md        # Getting started guide
│
├── project-management/      # Project documentation
│   ├── tasks/               # Task assignments
│   ├── designs/             # Architecture docs
│   ├── requirements/        # Feature requirements
│   ├── quality/             # Test plans and QA
│   └── operations/          # Releases and infrastructure
│
├── modules/                 # Software modules
│   ├── module-name/         # Each module is self-contained
│   │   ├── src/             # Source code
│   │   ├── test/            # Tests
│   │   ├── release/         # Module release output
│   │   ├── debug/           # Module debug output
│   │   ├── build-config/    # Build configuration
│   │   └── Makefile         # Module build script
│   └── another-module/      # Add more modules as needed
│
├── output/                  # Combined build output (all modules)
│   ├── release/             # Combined release builds
│   └── debug/               # Combined debug builds
│
├── Makefile                 # Top-level build script
├── .github/workflows/       # GitHub Actions
└── AI-WORKFLOW.md           # Main workflow documentation
```

## How It Works

1. You describe what you want to build
2. Product Owner clarifies requirements, creates user story
3. Cost Analyst estimates resource usage (warns if expensive)
4. Architect enriches with technical specifications
5. Product Owner assigns tasks to agents
6. Agents work independently in git worktrees
7. Peer review ensures quality
8. PRs are created for your review

## Setup by Provider

### OpenAI (GPT-4)
```bash
export OPENAI_API_KEY="sk-..."
pip install aider-chat
aider
```

### Anthropic
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
pip install aider-chat
aider --model claude-3-opus-20240229
```

### Ollama (Local)
```bash
ollama pull llama3
aider --model ollama/llama3
```

See `ai-assistants/provider-setup/README.md` for detailed setup instructions.

## Customization

1. **Configure your AI provider** - Edit `ai-assistants/provider-setup/config.json`
2. **Add domain expertise** - Update agent files in `ai-assistants/agents/`
3. **Customize structure** - Modify directories for your project
4. **Configure builds** - Add your build system
5. **Update workflows** - Modify `.github/workflows/`

## Security

- API keys stored as **environment variables**
- Secrets are **automatically gitignored**
- No keys in code or config files

## License

[Add your license here]
