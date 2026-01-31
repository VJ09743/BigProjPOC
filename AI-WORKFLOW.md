# AI-Assisted Agentic Workflow Template

---

## MANDATORY INSTRUCTIONS FOR AI ASSISTANTS

**CRITICAL**: If you are an AI assistant (Claude, GPT, Gemini, etc.), you MUST follow these instructions for EVERY user request.

---

## STEP 0: MANDATORY FILE READING (BEFORE ANY TASK)

**STOP!** Before starting ANY new task, you MUST read ALL of these files:

### Required Reading Checklist
```
[ ] 1. AI-WORKFLOW.md (this file) - Complete workflow instructions
[ ] 2. ai-assistants/agents/product-owner-agent.md - You ALWAYS start here
[ ] 3. ai-assistants/agents/cost-analyst-agent.md - Cost estimation rules
[ ] 4. ai-assistants/agents/architect-agent.md - Design responsibilities
[ ] 5. ai-assistants/agents/developer-agent.md - Implementation rules
[ ] 6. ai-assistants/agents/it-agent.md - Infrastructure rules
[ ] 7. ai-assistants/agents/tester-agent.md - Testing rules
[ ] 8. .github/MULTI_AGENT_REVIEW_GUIDE.md - PR review process
```

**WHY?** Each file contains critical rules that prevent mistakes. Skipping files leads to:
- Missing PR creation at handoffs
- Skipping Cost Analyst warnings
- Wrong branching strategy
- IT Agent writing application code (forbidden!)

---

## STEP 1: TASK-BASED BRANCHING (MANDATORY FOR NEW TASKS)

**CRITICAL**: When user gives ANY new task, Product Owner MUST FIRST create the task branch structure:

```bash
# 1. Checkout from template branch
git fetch origin template/agentic-workflow
git checkout template/agentic-workflow

# 2. Create task master branch
git checkout -b master_{task_name}
git push -u origin master_{task_name}

# 3. Create your working branch FROM task master
git checkout -b claude/{agent}-{task_name}-{sessionID}
```

**Example for "joke-website" task:**
```bash
git checkout template/agentic-workflow
git checkout -b master_joke-website
git push -u origin master_joke-website
git checkout -b claude/product-owner-joke-website-abc123
```

### Branch Naming Rules

| Branch Type | Pattern | Example |
|-------------|---------|---------|
| Task Master | `master_{task_name}` | `master_joke-website` |
| Agent Working | `claude/{agent}-{task_name}-{sessionID}` | `claude/architect-joke-website-abc123` |

**NEVER** work directly on `main`, `master`, or any branch not following this pattern!

---

## STEP 2: AGENT WORKFLOW WITH MANDATORY PR HANDOFFS

### Complete Workflow Diagram

```
User Request
     ↓
┌─────────────────────────────────────────────────────────────────┐
│ PRODUCT OWNER                                                    │
│ 1. Read ALL mandatory files (Step 0)                            │
│ 2. Create task master branch (Step 1)                           │
│ 3. Clarify requirements with user                               │
│ 4. Consult COST ANALYST for estimate ← MANDATORY                │
│ 5. Create user story                                            │
│ 6. Assign to Architect                                          │
└─────────────────────────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────────────────────────┐
│ ARCHITECT                                                        │
│ 1. Create technical specification (EPS/EDS)                     │
│ 2. Choose technology stack                                      │
│ 3. Create developer tasks                                       │
│ 4. Consult COST ANALYST for implementation estimate             │
│ 5. CREATE PR → Triggers multi-agent review                      │
│ 6. WAIT for PR approval                                         │
└─────────────────────────────────────────────────────────────────┘
     ↓ (ONLY after PR approved)
┌─────────────────────────────────────────────────────────────────┐
│ IT AGENT (Environment Setup)                                     │
│ 1. Install dependencies (npm, pip, cargo, etc.)                 │
│ 2. Update scripts/ folder (build.sh, test.sh, run.sh, clean.sh) │
│ 3. Set up build environment                                     │
│ 4. ⚠️  DO NOT WRITE APPLICATION CODE - Only infrastructure!     │
│ 5. CREATE PR → Triggers multi-agent review                      │
│ 6. WAIT for PR approval                                         │
└─────────────────────────────────────────────────────────────────┘
     ↓ (ONLY after PR approved)
┌─────────────────────────────────────────────────────────────────┐
│ DEVELOPER                                                        │
│ 1. Implement code in modules/ directory                         │
│ 2. Write tests                                                  │
│ 3. Follow Architect's specifications                            │
│ 4. CREATE PR → Triggers multi-agent review                      │
│ 5. WAIT for PR approval                                         │
└─────────────────────────────────────────────────────────────────┘
     ↓ (ONLY after PR approved)
┌─────────────────────────────────────────────────────────────────┐
│ TESTER                                                           │
│ 1. Validate implementation                                      │
│ 2. Run tests                                                    │
│ 3. Create test report                                           │
│ 4. CREATE PR → Triggers multi-agent review                      │
│ 5. WAIT for PR approval                                         │
└─────────────────────────────────────────────────────────────────┘
     ↓ (ONLY after PR approved)
┌─────────────────────────────────────────────────────────────────┐
│ IT AGENT (Release)                                               │
│ 1. Build release artifacts                                      │
│ 2. Package for distribution                                     │
│ 3. Tag release in git                                           │
│ 4. CREATE PR → Final review                                     │
└─────────────────────────────────────────────────────────────────┘
     ↓ (ONLY after PR approved)
┌─────────────────────────────────────────────────────────────────┐
│ PRODUCT OWNER (Acceptance)                                       │
│ 1. Review completed work                                        │
│ 2. Verify acceptance criteria                                   │
│ 3. Present to user                                              │
│ 4. MERGE final PR to task master branch                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## STEP 3: PR CREATION IS MANDATORY AT EVERY HANDOFF

**CRITICAL**: Every agent MUST create a PR before handing off to the next agent.

### How to Create PR at Handoff

```bash
# 1. Stage and commit your work
git add <specific-files>
git commit -m "[Agent] Description of work completed"

# 2. Push to your branch
git push -u origin claude/{agent}-{task_name}-{sessionID}

# 3. Create PR to task master branch (NOT main/master!)
gh pr create --base master_{task_name} \
  --title "[Agent] Description" \
  --body "## Summary
- Work completed by [Agent Name]

## Changes
- [List of changes]

## Ready for: [Next Agent Name]

## Cost Estimate
- Estimated tokens: [amount]
- Estimated cost: $[amount]"
```

### Triggering Multi-Agent Review

After creating PR, user triggers review via GitHub Actions:
1. Go to GitHub → Actions tab
2. Select "Automated Multi-Agent Peer Review"
3. Click "Run workflow"
4. Enter PR number
5. Wait for AI agents to review

See `.github/MULTI_AGENT_REVIEW_GUIDE.md` for detailed instructions.

---

## STEP 4: COST ANALYST INTEGRATION (MANDATORY)

**CRITICAL**: Cost Analyst MUST be consulted before any significant work.

### When to Consult Cost Analyst

| Trigger | Action |
|---------|--------|
| New user task | Product Owner consults Cost Analyst for initial estimate |
| Before Architect design | Estimate design complexity |
| Before Developer implementation | Estimate implementation cost |
| Large file operations | Warn user before proceeding |
| Cost > $1.00 | MUST get explicit user approval |

### Cost Warning Format

```
⚠️ COST WARNING ⚠️

Task: [task description]
Estimated tokens: [input] + [output] = [total]
Estimated cost: $[amount]
Threshold: [LOW/MEDIUM/HIGH/CRITICAL]

Do you want to proceed? (yes/no)
```

---

## AGENT ROLES SUMMARY

| Agent | Primary Responsibility | Creates PR? |
|-------|----------------------|-------------|
| **Product Owner** | Requirements, coordination, acceptance | Final merge only |
| **Cost Analyst** | Cost estimation, warnings | No (advisory) |
| **Architect** | Technical design, tech stack | YES - before IT |
| **IT Agent** | Environment, scripts, releases | YES - before Developer |
| **Developer** | Implementation, code | YES - before Tester |
| **Tester** | Validation, testing | YES - before IT Release |

---

## PEER REVIEW MATRIX

| PR Author | Required Reviewers |
|-----------|-------------------|
| Architect | Developer, Tester |
| IT Agent | Architect |
| Developer | Architect, Tester |
| Tester | Developer, Product Owner |

---

## CRITICAL RULES - NEVER VIOLATE

1. **NEVER skip reading mandatory files** - Read all files in Step 0
2. **NEVER skip Product Owner** - Always start there
3. **NEVER skip task branching** - Create master_{task} branch first
4. **NEVER skip Cost Analyst** - Always get cost estimate
5. **NEVER skip PR creation** - Every agent creates PR before handoff
6. **NEVER let IT Agent write application code** - Only infrastructure
7. **NEVER work on main/master directly** - Use task branches
8. **NEVER merge without peer review** - Follow review matrix

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

## Domain: Entertainment & News Aggregation

**Industry**: Digital Media / Content Aggregation

### Project: Viral Content Hub

A family-friendly content aggregation website featuring:
- **Jokes**: Random jokes from public joke APIs
- **Memes**: Viral memes from accessible platforms (Reddit, Imgur, etc.)
- **Sports News**: Trending sports news from real news sources
- **Political News**: Trending political news from real news sources
- **Technical News**: Trending tech news from real news sources

### Content Requirements
- **Age-Appropriate**: All content must be safe for ages 8+
- **No Violence**: No violent or graphic content
- **No Sexual Content**: No adult or sexual content
- **Real Sources**: Content from real websites, not AI-generated
- **Attribution**: Display source links for all content

### Key Concepts
- Content moderation and filtering
- API integration with third-party services
- Rate limiting and caching
- Responsive web design
- User experience (single-button interactions)

**Agent Domain Expertise**:
All agents should understand the entertainment/news domain to make informed decisions. Agents have been updated with relevant web development and content aggregation skills.

---

## Project Structure

```
YourProject/
├── ai-assistants/               # AI configuration
│   ├── agents/                  # Agent role definitions
│   │   ├── product-owner-agent.md   # Requirements & coordination
│   │   ├── cost-analyst-agent.md    # Cost estimation & warnings
│   │   ├── architect-agent.md       # System designer
│   │   ├── developer-agent.md       # Implementation specialist
│   │   ├── it-agent.md              # Infrastructure specialist
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
Product Owner (Clarifies requirements, creates user story)
    ↓
Architect (Chooses tech stack, designs solution)
    ↓
IT Agent (Installs dependencies, sets up scripts/)  ← CRITICAL STEP
    ↓
Developer (Implements code in modules/)
    ↓
Tester (Validates implementation)
    ↓
IT Agent (Builds release artifacts)
    ↓
Product Owner (Accepts & presents to user)
```

**IMPORTANT**: IT Agent activates in TWO places:
1. **After Architect** - To install dependencies and set up scripts/
2. **Before Release** - To build and package artifacts

### Task-Based Branching Strategy

When user gives ANY new task, Product Owner MUST first create a task master branch:

```bash
# Step 1: Create task master branch from template
git checkout template/agentic-workflow
git checkout -b master_{task_name}
git push -u origin master_{task_name}
```

**Examples of task master branches**:
- `master_joke-website`
- `master_user-authentication`
- `master_shopping-cart`

### Branch Naming Convention

| Branch Type | Pattern | Example |
|-------------|---------|---------|
| Task Master | `master_{task_name}` | `master_joke-website` |
| Agent Branch | `claude/{agent}-{task_name}-{sessionID}` | `claude/developer-joke-website-abc123` |

### Git Worktree Workflow

Agents work in separate git worktrees to enable parallel work:

```bash
# Product Owner creates task master branch first
git checkout template/agentic-workflow
git checkout -b master_{task_name}
git push -u origin master_{task_name}

# Then creates worktrees for agents (branching from task master)
git checkout master_{task_name}
git worktree add ../worktree-architect claude/architect-{task_name}-{sessionID}
git worktree add ../worktree-developer claude/developer-{task_name}-{sessionID}

# Each agent works independently in their worktree
# When done, create PR to master_{task_name} (the task's main branch)
```

### Pull Request Process

**Agents automatically create PRs when work is complete.** The process is:

1. **Complete work** in agent's task branch
2. **Commit changes** with clear, descriptive messages
3. **Agent automatically pushes** to remote branch
4. **Agent automatically creates PR** to `master_{task_name}` branch (the task's main branch, created from `template/agentic-workflow`)
   - PR title: `[Agent Name] Work description`
   - PR body includes: Summary, Changes, Ready for: [Next Agent]
5. **Peer review** - other agents review before user accepts

**Requirement**: Ensure `GITHUB_TOKEN` environment variable is set before starting work.

### Peer Review Process (CRITICAL)

**All PRs must be peer-reviewed by other agents BEFORE user reviews.**

#### Review Assignment Rules

| PR Author | Required Reviewers |
|-----------|-------------------|
| **Developer** | Architect, Tester |
| **Architect** | Developer |
| **Tester** | Developer |
| **IT** | Architect |

#### Review Checklist

Each reviewer checks:
- [ ] Code follows project standards
- [ ] Design patterns correctly applied
- [ ] Tests are present and pass
- [ ] Documentation updated

#### Two-Phase Review

1. **Phase 1 - Peer Review**: Agents review each other (2+ approvals required)
2. **Phase 2 - User Review**: After peer approval, user reviews and merges

**NEVER skip peer review** - Quality before speed

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
- **Base branch**: `template/agentic-workflow`
- **Task branch**: `master_{task_name}` (created per task, see [Task-Based Branching Strategy](#task-based-branching-strategy))
- **Agent branches**: `claude/{agent}-{task_name}-{sessionID}` (created per agent from task branch)
- Always test before committing

### Testing Strategy

**Test Levels**:
1. **Unit Tests** (Developer) - Individual functions/classes
2. **Component Tests** (Tester) - Components in isolation
3. **Integration Tests** (Tester) - Component interactions
4. **System Tests** (Tester) - End-to-end workflows

---

## GitHub Integration

### Authentication - REQUIRED

**AI agents will automatically create PRs. You must set up GitHub authentication first.**

Before running any workflow, set up your GitHub token:

```bash
# Set as environment variable (REQUIRED for automatic PR creation)
export GITHUB_TOKEN="your_github_token"
```

**To create a GitHub token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `workflow`, `admin:repo_hook`
4. Copy the token and set it as shown above

### Automated PR Creation

Agents will automatically create PRs after completing their work. This requires:

- ✅ GitHub token set in `GITHUB_TOKEN` environment variable
- ✅ `gh` CLI installed and authenticated
- ✅ All commits pushed to remote branch

**If GitHub token is not set**: Agents will halt and request that you set it before continuing.

### Installing `gh` CLI (If Not Already Installed)

```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y gh

# macOS
brew install gh

# After installation, authenticate
gh auth login
```

**Verify setup:**
```bash
gh auth status
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
