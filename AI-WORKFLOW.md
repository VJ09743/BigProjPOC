# AI-Assisted Agentic Workflow Template

---

## MANDATORY INSTRUCTIONS FOR AI ASSISTANTS

**CRITICAL**: If you are an AI assistant (Claude, GPT, Gemini, etc.), you MUST follow these instructions for EVERY user request:

### 1. ALWAYS Start as Product Owner
- Read `ai-assistants/agents/product-owner-agent.md`
- Adopt Product Owner role BEFORE any other action
- Never skip straight to coding

### 2. First Task? Customize the Template
When this is a NEW project, Product Owner MUST:
- Update the "Domain" section below with actual project domain
- Update agent skills in `ai-assistants/agents/*.md`
- Add domain-specific context throughout

### 3. Follow the Agent Workflow
```
User Request → Product Owner (ALWAYS FIRST)
    → Architect (design) → Developer (implement)
    → Tester (validate) → Product Owner (accept)
```

### 4. Never Skip Steps
Even for "simple" tasks, follow the workflow. This ensures quality and documentation.

---

## Overview

This is a **provider-agnostic template** for setting up a multi-agent AI workflow. It works with any LLM (Large Language Model) provider and AI coding assistant.

**Supported AI Providers:**
- Anthropic (Claude)
- OpenAI (GPT-4, GPT-4o)
- Azure OpenAI
- Google (Gemini)
- Ollama (Local models)
- Any OpenAI-compatible API

**Compatible AI Coding Tools:**
- Claude Code, Aider, Cursor, Continue, Cody, and more

**This template is designed for non-programmers** who want to leverage AI-assisted development workflows.

## Quick Start

1. **Fork or clone this repository**
2. **Configure your LLM provider** (see `ai-assistants/provider-setup/README.md`)
3. **Set your API key** as an environment variable
4. **Start your AI assistant** and describe what you want to build

---

## LLM Provider Setup

See `ai-assistants/provider-setup/README.md` for detailed setup instructions.

### Quick Configuration

```bash
# 1. Copy the config template
cp ai-assistants/provider-setup/config.template.json ai-assistants/provider-setup/config.json

# 2. Set your API key (add to ~/.bashrc or ~/.zshrc)
export LLM_API_KEY="your-api-key"

# 3. Start your AI tool
# For Claude Code:
claude

# For Aider (works with multiple providers):
aider --model gpt-4o  # or --model claude-3-opus
```

---

## Domain: [Your Project Domain]

**CUSTOMIZE THIS SECTION** for your specific project.

Replace this section with your project's domain context. Examples:

### Example: E-commerce Platform
```
**Industry**: Retail Technology
- Online shopping systems
- Payment processing and checkout flows
- Inventory management and fulfillment
- Customer experience and personalization
```

### Example: Healthcare Application
```
**Industry**: Healthcare IT
- Patient data management
- HIPAA compliance requirements
- Clinical workflow integration
- Electronic health records (EHR)
```

### Example: Financial Services
```
**Industry**: FinTech
- Transaction processing
- Regulatory compliance (SOX, PCI-DSS)
- Real-time data processing
- Risk management and fraud detection
```

**Agent Domain Expertise**:
All agents should understand your project's domain to make informed decisions. Update the agent files in `ai-assistants/agents/` to include relevant domain expertise.

---

## Project Structure

```
YourProject/
├── ai-assistants/               # AI configuration
│   ├── agents/                  # Agent role definitions
│   │   ├── team-leader-agent.md     # Orchestrator and planner
│   │   ├── it-agent.md              # Infrastructure specialist
│   │   ├── architect-agent.md       # System designer
│   │   ├── developer-agent.md       # Implementation specialist
│   │   └── tester-agent.md          # QA specialist
│   ├── provider-setup/          # LLM provider configuration
│   │   ├── config.template.json     # Config template
│   │   ├── config.json              # Your config (gitignored)
│   │   └── README.md                # Setup instructions
│   └── how-to-use.md            # Getting started guide
│
├── project-management/          # Project documentation
│   ├── tasks/                   # Task management system
│   ├── designs/                 # Architecture docs (EPS, EDS)
│   ├── requirements/            # Feature requirements
│   ├── quality/                 # Test plans and QA docs
│   ├── operations/              # Infrastructure and releases
│   └── workflow/                # Team coordination docs
│
├── modules/                     # Software modules
│   ├── module-name/             # Each module is self-contained
│   │   ├── src/                 # Module source code
│   │   ├── test/                # Module tests
│   │   ├── release/             # Module release output
│   │   ├── debug/               # Module debug output
│   │   ├── build-config/        # Build configuration
│   │   └── Makefile             # Module build script
│   └── another-module/          # Add more modules as needed
│
├── output/                      # Combined build output
│   ├── release/                 # Combined release (all modules)
│   └── debug/                   # Combined debug (all modules)
│
├── scripts/                     # Build, test, run scripts
│   ├── build.sh                 # Build all modules
│   ├── test.sh                  # Run all tests
│   ├── run.sh                   # Run the application
│   └── clean.sh                 # Clean build artifacts
│
├── Makefile                     # Top-level build script
├── .github/                     # GitHub configuration
│   ├── workflows/               # GitHub Actions
│   └── scripts/                 # Automation scripts
│
├── AI-WORKFLOW.md               # This file
└── README.md                    # Project readme
```

---

## Agent System

This template uses a **multi-agent system** where the AI assistant adopts specialized roles based on the task. The agents work together through a structured workflow.

### Agent Roles

#### Product Owner Agent
**Role**: Customer-Facing Requirements Lead and Backlog Manager

- **ALWAYS activates first** for new user requests
- Gathers and clarifies user requirements
- Creates high-level user stories (WHAT to build, not HOW)
- Coordinates work across all agents
- Accepts completed work

**Activates for**: Any new task from user, requirements, prioritization

**Note**: Product Owner focuses on WHAT to build. Technical details are filled in by Architect.

#### Architect Agent
**Role**: System Architect and Design Lead

- Enriches user stories with technical specifications
- Designs interfaces and APIs
- Creates detailed development tasks
- Makes architectural decisions

**Activates for**: New features, specifications, design, architecture

**Note**: Architect creates *technical specifications*. Product Owner creates *high-level requirements*.

#### Developer Agent
**Role**: Software Developer and Implementation Specialist

- Implements features and interfaces
- Writes clean, maintainable code
- Creates unit tests
- Follows specifications

**Activates for**: Implementation, coding, bug fixes, unit tests

#### Tester Agent
**Role**: Quality Assurance and Testing Specialist

- Creates test plans
- Writes automated tests
- Validates implementations
- Reports bugs

**Activates for**: Testing, QA, validation, bug reporting

#### IT Agent
**Role**: Infrastructure and Operations Specialist

- Maintains build infrastructure
- Manages releases and versioning
- Sets up CI/CD pipelines
- Documents infrastructure

**Activates for**: Build systems, releases, infrastructure, tools

#### Cost Analyst Agent
**Role**: Resource Analyst and Cost Optimization Specialist

- Estimates token consumption before expensive operations
- Warns user before high-cost tasks
- Logs usage for transparency
- Recommends cost optimization strategies

**Activates for**: Large operations, cost estimation, usage reporting

### Agent Workflow

The agents work together in a collaborative workflow:

```
User Request
    ↓
Product Owner (Analyzes & Plans)
    ↓
Create Git Worktrees → Assign to Agent(s)
    ↓
Agent(s) Work Independently
    ↓
Peer Review (2+ agents)
    ↓
Create PR for User Review
    ↓
User Reviews & Merges
```

### Git Worktree Workflow

Agents work in separate git worktrees to enable parallel work:

```bash
# Product Owner creates worktrees
git worktree add ../worktree-architect agent/architect-{project}-{sessionID}
git worktree add ../worktree-developer agent/developer-{project}-{sessionID}

# Each agent works independently in their worktree
# When done, merge back via PR
```

### Peer Review Process

Before PRs go to user review:

1. Agent completes work in their worktree
2. Requests review from 2+ relevant agents
3. Peers review for design, quality, patterns
4. Address feedback and get approvals
5. Only then create PR for user review

---

## Task Management

### Task Folders

- `project-management/tasks/backlog/` - User stories (Product Owner)
- `project-management/tasks/it/` - Infrastructure tasks
- `project-management/tasks/architect/` - Design tasks
- `project-management/tasks/developer/` - Implementation tasks
- `project-management/tasks/tester/` - Testing tasks

### Creating Tasks

1. Copy `TEMPLATE.md` to new file
2. Fill in objective, requirements, deliverables
3. Set status and priority
4. Tell your AI assistant to process the task

### Task Lifecycle

```
pending → in-progress → completed → archived
              ↓
           blocked
```

---

## Development Guidelines

### Code Organization
- Organize code into self-contained modules in `modules/`
- Each module contains:
  - `src/` - Module source code
  - `test/` - Module tests
  - `release/` - Release build output (gitignored)
  - `debug/` - Debug build output (gitignored)
  - `build-config/` - Build configuration files
  - `Makefile` - Module build script
- Copy `modules/example-module/` to create new modules

### Git Workflow
- Main branch: `master` or `main`
- Feature branches follow your naming convention
- Always test before committing

### Testing Strategy

**Test Levels**:
1. **Unit Tests** (Developer) - Individual functions/classes
2. **Component Tests** (Tester) - Components in isolation
3. **Integration Tests** (Tester) - Component interactions
4. **System Tests** (Tester) - End-to-end workflows

---

## GitHub Integration

### Authentication

Set up a GitHub token for automated PR creation:

```bash
# Store token as environment variable (recommended)
export GITHUB_TOKEN="your_github_token"

# Or store in a file (gitignored)
echo "your_github_token" > .github_token
```

### Creating Pull Requests

Agents create PRs using:

```bash
export GH_TOKEN=$GITHUB_TOKEN
gh pr create --base master --head <branch> \
  --title "Title" \
  --body "Description"
```

---

## Customization Guide

### 1. Configure Your LLM Provider

Edit `ai-assistants/provider-setup/config.json` with your provider settings. See `ai-assistants/provider-setup/README.md` for details.

### 2. Update Domain Expertise

Edit each agent file in `ai-assistants/agents/` to include your project's domain knowledge.

### 3. Customize Project Structure

Modify the directory structure to match your project's needs:
- Add source directories for your modules
- Configure build systems for your technology stack
- Set up test directories appropriate for your frameworks

### 4. Configure Build System

Add build scripts appropriate for your technology:
- Makefiles for C/C++ projects
- package.json for Node.js
- requirements.txt for Python
- build.gradle for Java

### 5. Update GitHub Workflows

Modify `.github/workflows/` for your CI/CD needs.

---

## Using with Different AI Tools

### Claude Code
```bash
npm install -g @anthropic-ai/claude-code
export ANTHROPIC_API_KEY="your-key"
cd your-project
claude
```

### Aider
```bash
pip install aider-chat
export OPENAI_API_KEY="your-key"  # or ANTHROPIC_API_KEY
cd your-project
aider
```

### Cursor
1. Download from cursor.sh
2. Open your project
3. Use Cmd/Ctrl+K for AI assistance

### Continue (VS Code)
1. Install Continue extension
2. Configure your API key
3. Use the Continue panel

---

## Notes for AI Assistants

- Automatically adopt appropriate agent role based on task
- Read agent configs in `ai-assistants/agents/` for responsibilities
- Follow peer review process before creating PRs
- Document decisions in appropriate project-management folders
- Keep this file updated when structure changes
- API keys are stored as environment variables, never in code

---

## Getting Started

1. **Configure your AI provider** (see `ai-assistants/provider-setup/README.md`)
2. **Describe your project** to the AI assistant
3. The AI will ask clarifying questions
4. Work begins with Product Owner analysis
5. Agents collaborate to complete the work
6. Review and merge PRs

**Example first request**:
"I want to build a web application for managing tasks. It should have user authentication, task creation, and notifications."

---

## Security Best Practices

- **Never commit API keys** - Use environment variables
- **Use .gitignore** - API keys and secrets are automatically excluded
- **Rotate keys regularly** - Especially if accidentally exposed
- **Use least privilege** - Only grant necessary API permissions

---

**Template Version**: 2.1
**Last Updated**: 2026-01-25
